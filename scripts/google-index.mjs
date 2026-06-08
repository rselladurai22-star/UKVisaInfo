#!/usr/bin/env node

/**
 * Google Indexing API Script (Zero Dependencies)
 * 
 * This script allows you to submit URLs from your website's sitemap (or individual URLs)
 * directly to the Google Indexing API for rapid crawling and indexing within 24 hours.
 * 
 * Usage:
 *   node scripts/google-index.mjs [options]
 * 
 * Options:
 *   --key <path>       Path to Google Service Account JSON key (default: service-account-key.json)
 *   --sitemap <url>    Fetch URLs from a sitemap XML (default: https://ukvisainfo.co.uk/sitemap.xml)
 *   --url <url>        Submit a single URL directly
 *   --action <type>    Action to perform: "updated" or "deleted" (default: updated)
 *   --limit <number>   Max number of URLs to submit (default: 200, matching the daily standard quota)
 *   --dry-run          Run the script without submitting requests to Google
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Helper to get absolute paths relative to execution dir
const cwd = process.cwd();

// Terminal ANSI colors for rich console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  keyPath: 'service-account-key.json',
  sitemapUrl: 'https://ukvisainfo.co.uk/sitemap.xml',
  singleUrl: null,
  action: 'URL_UPDATED', // 'URL_UPDATED' or 'URL_DELETED'
  limit: 200,
  dryRun: false,
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--key':
      options.keyPath = args[++i];
      break;
    case '--sitemap':
      options.sitemapUrl = args[++i];
      break;
    case '--url':
      options.singleUrl = args[++i];
      break;
    case '--action':
      const act = args[++i]?.toLowerCase();
      if (act === 'delete' || act === 'deleted' || act === 'url_deleted') {
        options.action = 'URL_DELETED';
      } else {
        options.action = 'URL_UPDATED';
      }
      break;
    case '--limit':
      options.limit = parseInt(args[++i], 10);
      break;
    case '--dry-run':
      options.dryRun = true;
      break;
    case '--help':
    case '-h':
      printHelp();
      process.exit(0);
    default:
      console.warn(`${colors.yellow}Warning: Unknown argument "${args[i]}"${colors.reset}`);
  }
}

function printHelp() {
  console.log(`
${colors.bright}${colors.cyan}Google Indexing API Utility${colors.reset}
---------------------------------
Automates submitting pages to Google Search Console crawler via Indexing API.

${colors.bright}Usage:${colors.reset}
  node scripts/google-index.mjs [options]

${colors.bright}Options:${colors.reset}
  --key <path>       Path to Google Service Account JSON key (default: service-account-key.json)
  --sitemap <url>    URL of sitemap to crawl and submit (default: https://ukvisainfo.co.uk/sitemap.xml)
  --url <url>        Submit a single URL instead of reading a sitemap
  --action <type>    Action to submit: "updated" or "deleted" (default: updated)
  --limit <number>   Max number of URLs to submit in this run (default: 200, Google quota cap)
  --dry-run          Simulate run: parse credentials and fetch sitemap, but do not post to Google

${colors.bright}Setup Guide:${colors.reset}
  1. Go to Google Cloud Console (https://console.cloud.google.com).
  2. Create a project and enable the "Web Search Indexing API".
  3. Create a Service Account: IAM & Admin -> Service Accounts -> Create Service Account.
  4. Create a Private Key for this account (JSON format) and download it.
  5. Rename the downloaded file to "${colors.bright}service-account-key.json${colors.reset}" and place it in the root of your project.
  6. Copy the service account email (e.g., service-account@your-project.iam.gserviceaccount.com).
  7. Go to Google Search Console -> Settings -> Users and permissions.
  8. Add the service account email as an ${colors.bright}Owner${colors.reset} of your property.
  `);
}

/**
 * Generate a signed JWT for Google Service Account authentication
 */
function generateJWT(clientEmail, privateKey) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600, // 1 hour token validity
  };

  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64UrlPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signatureInput = `${base64UrlHeader}.${base64UrlPayload}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey, 'base64url');

  return `${signatureInput}.${signature}`;
}

/**
 * Request an access token from Google OAuth endpoint
 */
async function getAccessToken(clientEmail, privateKey) {
  console.log(`${colors.gray}Generating JWT and authenticating with Google...${colors.reset}`);
  const jwt = generateJWT(clientEmail, privateKey);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Authentication failed: ${response.statusText} (${errorText})`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Parses URLs from an XML sitemap text
 */
function parseSitemapUrls(xmlText) {
  const locRegex = /<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi;
  const urls = [];
  let match;
  while ((match = locRegex.exec(xmlText)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

/**
 * Submits a single URL to the Google Indexing API
 */
async function submitUrlToGoogle(url, action, token) {
  const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: url,
      type: action,
    }),
  });

  const data = await response.json();
  return {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    data,
  };
}

// Helper for delay to avoid rate issues
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log(`\n${colors.bright}${colors.cyan}=== Google Search Indexing API Automation ===${colors.reset}\n`);

  // 1. Resolve key credentials path
  const absoluteKeyPath = path.isAbsolute(options.keyPath)
    ? options.keyPath
    : path.join(cwd, options.keyPath);

  if (!fs.existsSync(absoluteKeyPath)) {
    console.error(`${colors.red}Error: Credentials file not found at: ${absoluteKeyPath}${colors.reset}`);
    console.error(`${colors.yellow}Please make sure you downloaded the Google Service Account JSON key file`);
    console.error(`and placed it in the root directory as "service-account-key.json".${colors.reset}`);
    console.log(`\nRun ${colors.bright}node scripts/google-index.mjs --help${colors.reset} to see setup instructions.`);
    process.exit(1);
  }

  let credentials;
  try {
    credentials = JSON.parse(fs.readFileSync(absoluteKeyPath, 'utf8'));
  } catch (err) {
    console.error(`${colors.red}Error: Failed to parse credentials JSON file: ${err.message}${colors.reset}`);
    process.exit(1);
  }

  const { client_email: clientEmail, private_key: privateKey } = credentials;
  if (!clientEmail || !privateKey) {
    console.error(`${colors.red}Error: Invalid JSON key format. Must contain "client_email" and "private_key".${colors.reset}`);
    process.exit(1);
  }

  // 2. Identify target URLs
  let urlsToSubmit = [];
  if (options.singleUrl) {
    urlsToSubmit.push(options.singleUrl);
    console.log(`${colors.green}Mode: Single URL submission${colors.reset}`);
    console.log(`URL: ${colors.bright}${options.singleUrl}${colors.reset}`);
  } else {
    console.log(`${colors.green}Mode: Sitemap XML parsing${colors.reset}`);
    console.log(`Fetching sitemap: ${colors.bright}${options.sitemapUrl}${colors.reset}`);
    try {
      const sitemapResponse = await fetch(options.sitemapUrl);
      if (!sitemapResponse.ok) {
        throw new Error(`HTTP ${sitemapResponse.status} ${sitemapResponse.statusText}`);
      }
      const sitemapXml = await sitemapResponse.text();
      const extractedUrls = parseSitemapUrls(sitemapXml);
      console.log(`Found ${colors.bright}${extractedUrls.length}${colors.reset} URLs in the sitemap.`);
      
      // Filter out duplicate or empty entries and apply limit
      urlsToSubmit = [...new Set(extractedUrls)].slice(0, options.limit);
      console.log(`Limiting submission to the first ${colors.bright}${urlsToSubmit.length}${colors.reset} URLs (Limit: ${options.limit}).`);
    } catch (err) {
      console.error(`${colors.red}Error fetching sitemap: ${err.message}${colors.reset}`);
      process.exit(1);
    }
  }

  if (urlsToSubmit.length === 0) {
    console.warn(`${colors.yellow}Warning: No URLs found to submit. Exiting.${colors.reset}`);
    return;
  }

  // 3. Dry Run Check
  if (options.dryRun) {
    console.log(`\n${colors.yellow}================ DRY RUN MODE ================`);
    console.log(`Credentials parsed successfully for: ${clientEmail}`);
    console.log(`Action to perform: ${options.action}`);
    console.log(`URLs that would be submitted (up to limit):`);
    urlsToSubmit.forEach((u, i) => console.log(`  [${i + 1}] ${u}`));
    console.log(`==============================================${colors.reset}\n`);
    return;
  }

  // 4. Authenticate & Obtain Token
  let accessToken;
  try {
    accessToken = await getAccessToken(clientEmail, privateKey);
    console.log(`${colors.green}Authentication successful! JWT token received.${colors.reset}\n`);
  } catch (err) {
    console.error(`${colors.red}Authentication failed: ${err.message}${colors.reset}`);
    process.exit(1);
  }

  // 5. Submit URLs
  console.log(`Starting submission of ${colors.bright}${urlsToSubmit.length}${colors.reset} URLs for crawling...`);
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < urlsToSubmit.length; i++) {
    const url = urlsToSubmit[i];
    const indexStr = `[${i + 1}/${urlsToSubmit.length}]`;
    
    try {
      // Small pause to prevent rate limit issues
      if (i > 0) await sleep(250);

      const result = await submitUrlToGoogle(url, options.action, accessToken);

      if (result.ok) {
        successCount++;
        console.log(`${colors.gray}${indexStr}${colors.reset} ${colors.green}✔ Success:${colors.reset} ${url}`);
      } else {
        errorCount++;
        console.error(`${colors.gray}${indexStr}${colors.reset} ${colors.red}✘ Failed:${colors.reset} ${url}`);
        console.error(`  Response: HTTP ${result.status} - ${JSON.stringify(result.data.error || result.data)}`);
      }
    } catch (err) {
      errorCount++;
      console.error(`${colors.gray}${indexStr}${colors.reset} ${colors.red}✘ Error:${colors.reset} ${url}`);
      console.error(`  Detail: ${err.message}`);
    }
  }

  // 6. Report summary
  console.log(`\n${colors.bright}=== Submission Summary ===${colors.reset}`);
  console.log(`Total URLs attempted: ${urlsToSubmit.length}`);
  console.log(`Successful requests:  ${colors.green}${successCount}${colors.reset}`);
  console.log(`Failed requests:      ${errorCount > 0 ? colors.red : ''}${errorCount}${colors.reset}`);
  console.log(`Action type sent:     ${options.action}`);
  
  if (errorCount > 0) {
    console.log(`\n${colors.yellow}Note: If you received "Permission denied" errors, please verify that:`);
    console.log(`1. Google Search Console has the Service Account email (${colors.bright}${clientEmail}${colors.reset}) added as a delegate/owner.`);
    console.log(`2. The property in Search Console matches the domain URL precisely (including protocol https and subdomain www).${colors.reset}\n`);
  } else {
    console.log(`\n${colors.green}All done! Google Search Console crawler has been notified to crawl these URLs.${colors.reset}\n`);
  }
}

main().catch((err) => {
  console.error(`${colors.red}Fatal Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
