#!/usr/bin/env node
// Converts the Home Office sponsor register CSV → optimized JSON for the
// /tools/sponsor-search page. Output: public/sponsors-data.json
//
// Usage: node scripts/convert-sponsors.mjs <input.csv>

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/convert-sponsors.mjs <path-to-csv>');
  process.exit(1);
}

// Minimal RFC 4180 CSV parser — handles quoted fields with embedded commas.
function parseCSV(text) {
  const rows = [];
  let cur = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { cur.push(field); field = ''; }
      else if (c === '\n') {
        cur.push(field); field = '';
        if (cur.some((v) => v.trim() !== '')) rows.push(cur);
        cur = [];
      } else if (c !== '\r') {
        field += c;
      }
    }
  }
  if (field !== '' || cur.length) {
    cur.push(field);
    if (cur.some((v) => v.trim() !== '')) rows.push(cur);
  }
  return rows;
}

const raw = readFileSync(inputPath, 'utf8');
const rows = parseCSV(raw);
const header = rows.shift();
console.log('Header:', header);
console.log('Rows:', rows.length);

// Map: Organisation Name (0), Town/City (1), County (2), Type & Rating (3), Route (4)
function clean(s) {
  if (!s) return '';
  return s.trim()
    .replace(/^"+|"+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function normaliseRating(s) {
  const v = clean(s).toUpperCase();
  if (v.includes('PREMIUM')) return 'AP';
  if (v.includes('A RATING') || v.includes('A-RATING')) return 'A';
  if (v.includes('B RATING') || v.includes('B-RATING')) return 'B';
  if (v.includes('PROVISIONAL')) return 'PR';
  return 'A';
}
function normaliseRoute(s) {
  const v = clean(s);
  if (/skilled worker/i.test(v)) return 'SW';
  if (/senior or specialist/i.test(v)) return 'SS';
  if (/scale-?up/i.test(v)) return 'SU';
  if (/graduate trainee/i.test(v)) return 'GT';
  if (/health.*care/i.test(v)) return 'HC';
  if (/intra-?company/i.test(v)) return 'IC';
  if (/minister of religion/i.test(v)) return 'MR';
  if (/sports/i.test(v)) return 'SP';
  if (/temporary worker/i.test(v)) return 'TW';
  if (/charity worker/i.test(v)) return 'CW';
  if (/seasonal worker/i.test(v)) return 'SE';
  if (/youth mobility/i.test(v)) return 'YM';
  if (/international agreement/i.test(v)) return 'IA';
  if (/creative worker/i.test(v)) return 'CR';
  if (/religious worker/i.test(v)) return 'RW';
  return 'OT';
}

// Dedupe by (name, city, route, rating) — many sponsors appear once per route
const sponsorsMap = new Map();
for (const row of rows) {
  if (row.length < 5) continue;
  const name = clean(row[0]);
  if (!name) continue;
  const city = clean(row[1]);
  const county = clean(row[2]);
  const rating = normaliseRating(row[3]);
  const route = normaliseRoute(row[4]);

  const key = `${name}|${city}|${county}`;
  const existing = sponsorsMap.get(key);
  if (existing) {
    if (!existing.r.includes(route)) existing.r.push(route);
    // Keep best rating found
    const rank = (r) => ({ AP: 3, A: 2, B: 1, PR: 0 }[r] ?? 1);
    if (rank(rating) > rank(existing.t)) existing.t = rating;
  } else {
    sponsorsMap.set(key, {
      n: name,
      c: city,
      o: county || undefined,
      t: rating,
      r: [route],
    });
  }
}

const out = Array.from(sponsorsMap.values()).sort((a, b) =>
  a.n.localeCompare(b.n, 'en-GB', { sensitivity: 'base' })
);

// Region detection — basic mapping of common counties → region
const REGION_MAP = {
  London: ['London', 'Greater London'],
  'South East': ['Surrey', 'Sussex', 'East Sussex', 'West Sussex', 'Hampshire', 'Kent', 'Oxfordshire', 'Berkshire', 'Buckinghamshire', 'Isle of Wight'],
  'South West': ['Devon', 'Cornwall', 'Somerset', 'Dorset', 'Wiltshire', 'Gloucestershire', 'Bristol'],
  East: ['Essex', 'Suffolk', 'Norfolk', 'Cambridgeshire', 'Hertfordshire', 'Bedfordshire'],
  'East Midlands': ['Derbyshire', 'Leicestershire', 'Lincolnshire', 'Northamptonshire', 'Nottinghamshire', 'Rutland'],
  'West Midlands': ['Warwickshire', 'Staffordshire', 'Worcestershire', 'Shropshire', 'Herefordshire', 'West Midlands'],
  'North West': ['Lancashire', 'Cheshire', 'Cumbria', 'Greater Manchester', 'Merseyside'],
  'North East': ['Northumberland', 'Tyne and Wear', 'Durham'],
  Yorkshire: ['Yorkshire', 'North Yorkshire', 'South Yorkshire', 'West Yorkshire', 'East Yorkshire'],
  Scotland: ['Scotland', 'Aberdeen', 'Edinburgh', 'Glasgow', 'Fife', 'Lothian', 'Strathclyde', 'Highland', 'Tayside'],
  Wales: ['Wales', 'Cardiff', 'Swansea', 'Gwent', 'Powys', 'Gwynedd'],
  'Northern Ireland': ['Northern Ireland', 'Belfast', 'Down', 'Antrim', 'Tyrone', 'Armagh', 'Fermanagh', 'Londonderry'],
};
function detectRegion(county, city) {
  const cn = (county || '').toLowerCase();
  const ct = (city || '').toLowerCase();
  for (const [region, terms] of Object.entries(REGION_MAP)) {
    if (terms.some((t) => cn.includes(t.toLowerCase()) || ct.includes(t.toLowerCase()))) {
      return region;
    }
  }
  return undefined;
}
for (const s of out) {
  const region = detectRegion(s.o, s.c);
  if (region) s.g = region;
}

const outPath = path.join(ROOT, 'public', 'sponsors-data.json');
writeFileSync(outPath, JSON.stringify(out));
console.log(`Wrote ${out.length} sponsors to ${outPath}`);
console.log(`File size: ${(JSON.stringify(out).length / 1024 / 1024).toFixed(2)} MB`);
