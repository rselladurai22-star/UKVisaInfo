#!/usr/bin/env node

/**
 * Google index-status checker (zero dependencies).
 *
 * Reads every URL from your sitemap and asks Google's URL Inspection API
 * whether each one is indexed — and if not, why. Outputs a live table, a
 * summary, and a CSV you can sort.
 *
 * Prerequisites (same service account as google-index.mjs):
 *   1. Enable the "Google Search Console API" in your GCP project
 *      (this is SEPARATE from the Web Search Indexing API).
 *   2. Add the service account's client_email as an OWNER or FULL user of the
 *      Search Console property.
 *   3. The --site value must EXACTLY match the property (incl. trailing slash),
 *      e.g. https://ukvisainfo.co.uk/
 *
 * Usage:
 *   node scripts/index-status.mjs --key service-account-key.json
 *   node scripts/index-status.mjs --site https://ukvisainfo.co.uk/ --limit 100 --out status.csv
 *
 * Options:
 *   --key <path>      Service account JSON key (default: service-account-key.json)
 *   --site <url>      Search Console property URL (default: https://ukvisainfo.co.uk/)
 *   --sitemap <url>   Sitemap to read (default: <site>sitemap.xml)
 *   --limit <n>       Max URLs to check (default: 2000 — the daily API quota)
 *   --delay <ms>      Delay between calls (default: 250 — stays under 600/min)
 *   --out <path>      CSV output path (default: index-status.csv)
 *   --only-missing    Only print URLs that are NOT indexed
 */

import fs from 'fs';
import crypto from 'crypto';

const c = {
  reset: '\x1b[0m', b: '\x1b[1m', green: '\x1b[32m', yellow: '\x1b[33m',
  red: '\x1b[31m', gray: '\x1b[90m', cyan: '\x1b[36m',
};

function parseArgs() {
  const a = process.argv.slice(2);
  const o = {
    key: 'service-account-key.json',
    site: 'https://ukvisainfo.co.uk/',
    sitemap: null,
    limit: 2000,
    delay: 250,
    out: 'index-status.csv',
    onlyMissing: false,
  };
  for (let i = 0; i < a.length; i++) {
    switch (a[i]) {
      case '--key': o.key = a[++i]; break;
      case '--site': o.site = a[++i]; break;
      case '--sitemap': o.sitemap = a[++i]; break;
      case '--limit': o.limit = parseInt(a[++i], 10); break;
      case '--delay': o.delay = parseInt(a[++i], 10); break;
      case '--out': o.out = a[++i]; break;
      case '--only-missing': o.onlyMissing = true; break;
      case '--help': printHelp(); process.exit(0);
    }
  }
  if (!o.sitemap) o.sitemap = `${o.site.replace(/\/$/, '')}/sitemap.xml`;
  return o;
}

function printHelp() {
  console.log(`
${c.b}Google index-status checker${c.reset}

  node scripts/index-status.mjs --key service-account-key.json

Options:
  --key <path>      Service account JSON (default: service-account-key.json)
  --site <url>      Property URL incl. trailing slash (default: https://ukvisainfo.co.uk/)
  --sitemap <url>   Sitemap (default: <site>sitemap.xml)
  --limit <n>       Max URLs to check (default: 2000)
  --delay <ms>      Delay between calls (default: 250)
  --out <path>      CSV output (default: index-status.csv)
  --only-missing    Print only non-indexed URLs
`);
}

function generateJWT(clientEmail, privateKey) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const input = `${enc(header)}.${enc(payload)}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(input);
  return `${input}.${sign.sign(privateKey, 'base64url')}`;
}

async function getAccessToken(clientEmail, privateKey) {
  const jwt = generateJWT(clientEmail, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

function parseSitemapUrls(xml) {
  const urls = [];
  const re = /<loc>(.*?)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) urls.push(m[1].trim());
  return urls;
}

async function inspect(url, site, token) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: site }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data?.error?.message || `HTTP ${res.status}` };
  const r = data.inspectionResult?.indexStatusResult ?? {};
  return {
    verdict: r.verdict ?? 'UNKNOWN',
    coverageState: r.coverageState ?? '',
    lastCrawl: r.lastCrawlTime ?? '',
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const o = parseArgs();

  if (!fs.existsSync(o.key)) {
    console.error(`${c.red}Key file not found: ${o.key}${c.reset}`);
    console.error('Pass --key <path> or place service-account-key.json in the project root.');
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(o.key, 'utf8'));
  if (!key.client_email || !key.private_key) {
    console.error(`${c.red}Key JSON missing client_email / private_key.${c.reset}`);
    process.exit(1);
  }

  console.log(`${c.gray}Authenticating as ${key.client_email}...${c.reset}`);
  const token = await getAccessToken(key.client_email, key.private_key);

  console.log(`${c.gray}Fetching sitemap ${o.sitemap}...${c.reset}`);
  const xml = await (await fetch(o.sitemap)).text();
  let urls = parseSitemapUrls(xml);
  console.log(`Found ${c.b}${urls.length}${c.reset} URLs. Checking up to ${o.limit}.\n`);
  urls = urls.slice(0, o.limit);

  const counts = { indexed: 0, notIndexed: 0, error: 0 };
  const rows = [['url', 'verdict', 'coverageState', 'lastCrawl']];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    let r;
    try {
      r = await inspect(url, o.site, token);
    } catch (e) {
      r = { error: e.message };
    }

    // The API's verdict is the authoritative signal: PASS = on Google (indexed).
    // coverageState is just the human reason (and contains "indexed" even when
    // NOT indexed, e.g. "Crawled - currently not indexed"), so don't test it.
    const isIndexed = r.verdict === 'PASS';
    if (r.error) counts.error++;
    else if (isIndexed) counts.indexed++;
    else counts.notIndexed++;

    rows.push([url, r.verdict || 'ERROR', r.coverageState || r.error || '', r.lastCrawl || '']);

    const tag = r.error
      ? `${c.red}ERR ${c.reset}${r.error}`
      : isIndexed
        ? `${c.green}INDEXED${c.reset}`
        : `${c.yellow}NOT   ${c.reset}${r.coverageState || r.verdict}`;
    if (!o.onlyMissing || !isIndexed) {
      console.log(`${c.gray}${String(i + 1).padStart(4)}/${urls.length}${c.reset}  ${tag}  ${c.gray}${url.replace(o.site, '/')}${c.reset}`);
    }

    if (o.delay) await sleep(o.delay);
  }

  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  fs.writeFileSync(o.out, csv);

  console.log(`\n${c.b}Summary${c.reset}`);
  console.log(`  ${c.green}Indexed:${c.reset}      ${counts.indexed}`);
  console.log(`  ${c.yellow}Not indexed:${c.reset}  ${counts.notIndexed}`);
  console.log(`  ${c.red}Errors:${c.reset}       ${counts.error}`);
  console.log(`\n  CSV written to ${c.cyan}${o.out}${c.reset}`);
  console.log(`  ${c.gray}Tip: re-run with --only-missing to see just the gaps.${c.reset}`);
}

main().catch((e) => {
  console.error(`${c.red}Failed:${c.reset} ${e.message}`);
  process.exit(1);
});
