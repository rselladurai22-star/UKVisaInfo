#!/usr/bin/env node
// Parses the Home Office "Skilled Worker visa going rates for eligible
// occupation codes" gov.uk page into src/data/socCodes.ts.
//
// Usage:
//   node scripts/convert-soc-rates.mjs <path-to-saved-html>
// or
//   node scripts/convert-soc-rates.mjs   (fetches live page)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const URL =
  'https://www.gov.uk/government/publications/skilled-worker-visa-going-rates-for-eligible-occupations/skilled-worker-visa-going-rates-for-eligible-occupation-codes';

async function loadHtml() {
  const arg = process.argv[2];
  if (arg) return readFileSync(arg, 'utf8');
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.text();
}

function decode(s) {
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&pound;/g, '£')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRate(cell) {
  // Possible values:
  //   £88,100  <br> (£45.18 per hour)
  //   Not eligible for standard rate applications
  const text = decode(cell);
  if (/not eligible/i.test(text)) return { rate: null, hourly: null, note: 'Not eligible for standard rate' };
  const m = text.match(/£([\d,]+)\s*\(£([\d.]+)\s*per hour\)/);
  if (!m) return { rate: null, hourly: null };
  return { rate: Number(m[1].replace(/,/g, '')), hourly: Number(m[2]) };
}

// SOC 2020 major group mapping (first digit) → sector label used in UI.
function majorGroupLabel(code) {
  const d = code[0];
  switch (d) {
    case '1': return 'Managers & Directors';
    case '2': return 'Professional Occupations';
    case '3': return 'Associate Professional';
    case '4': return 'Administrative & Secretarial';
    case '5': return 'Skilled Trades';
    case '6': return 'Caring, Leisure & Service';
    case '7': return 'Sales & Customer Service';
    case '8': return 'Process, Plant & Machine';
    case '9': return 'Elementary Occupations';
    default:  return 'Other';
  }
}

// Finer-grained sector group inferred from title keywords. Falls back to
// SOC major group when no keyword match.
function inferSector(code, title) {
  const t = title.toLowerCase();
  if (/\b(software|programmer|it |information technology|web |systems|cyber|data scientist|database|network|telecom)\b/.test(t))
    return 'Technology';
  if (/\b(engineer|engineering)\b/.test(t)) return 'Engineering';
  if (/\b(nurse|midwif|doctor|medical|dental|pharmac|physiotherap|paramedic|radiograph|psycholog|therap|optic|podiatr|health|care worker)\b/.test(t))
    return 'Healthcare';
  if (/\b(teacher|lecturer|education|academic|school|nurser)\b/.test(t)) return 'Education';
  if (/\b(financ|account|tax|audit|invest|actuar|economist|banker|insur)\b/.test(t)) return 'Finance';
  if (/\b(lawyer|legal|solicitor|barrister|judge|paralegal|notar)\b/.test(t)) return 'Legal';
  if (/\b(construction|builder|carpent|plumb|electrician|brickl|roofer|plaster|painter and decor|glazier|scaffold)\b/.test(t))
    return 'Construction & Trades';
  if (/\b(chef|cook|baker|butcher|food|restaurant|hospitality|hotel)\b/.test(t)) return 'Hospitality & Food';
  if (/\b(driver|driving|transport|haulage|logistics|warehous|courier|freight|rail|marine|pilot|aviation|aircraft)\b/.test(t))
    return 'Transport & Logistics';
  if (/\b(farm|agricult|horticult|garden|forest|fish|animal|veterinar)\b/.test(t)) return 'Agriculture & Environment';
  if (/\b(sales|marketing|advertis|retail|merchand|buyer)\b/.test(t)) return 'Sales & Marketing';
  if (/\b(manager|director|executive|officer|admin)\b/.test(t)) return 'Management & Admin';
  if (/\b(artist|design|musician|actor|dancer|photograph|writer|journalist|editor|broadcast|film|media|creative|architect)\b/.test(t))
    return 'Creative & Media';
  if (/\b(scientist|biolog|chemist|physic|geolog|meteorolog|research)\b/.test(t)) return 'Science & Research';
  if (/\b(police|fire|armed|prison|security|protective)\b/.test(t)) return 'Protective Services';
  if (/\b(hairdress|beaut|sport|fitness|leisure|childmind|nanny|funeral)\b/.test(t)) return 'Personal Services';
  return majorGroupLabel(code);
}

async function main() {
  const html = await loadHtml();
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/);
  if (!tableMatch) throw new Error('No table found');
  const rowRe = /<tr>([\s\S]*?)<\/tr>/g;
  const records = [];
  let m;
  while ((m = rowRe.exec(tableMatch[0]))) {
    const inner = m[1];
    const cellRe = /<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/g;
    const cells = [];
    let c;
    while ((c = cellRe.exec(inner))) cells.push(c[1]);
    if (cells.length < 5) continue;
    const code = decode(cells[0]);
    if (!/^\d{4}/.test(code)) continue;
    const title = decode(cells[1]);
    const standard = parseRate(cells[3]);
    const lower = parseRate(cells[4]);
    const goingRate = standard.rate ?? lower.rate ?? 0;
    const hourly = standard.hourly ?? lower.hourly ?? null;
    records.push({
      code,
      title,
      goingRate,
      hourlyGoingRate: hourly,
      lowerGoingRate: lower.rate ?? null,
      lowerHourlyRate: lower.hourly ?? null,
      group: inferSector(code, title),
      notes: standard.note,
    });
  }
  records.sort((a, b) => a.code.localeCompare(b.code));
  console.log('Parsed', records.length, 'occupations');

  // Emit TS
  const header = `// UK SOC 2020 occupation codes with Skilled Worker visa going rates.
// Auto-generated from gov.uk on ${new Date().toISOString().slice(0, 10)}.
// Source: ${URL}
//
// All ${records.length} eligible occupation codes are covered. Standard rates
// apply to most new applications; lower rates apply to transitional / Health &
// Care / certain National Pay Scale and discounted-route cases.

export interface SocOccupation {
  code: string;             // SOC 2020 code
  title: string;            // ONS occupation title
  goingRate: number;        // gross annual £ (standard)
  hourlyGoingRate?: number; // £/hour at standard rate
  lowerGoingRate?: number;  // discounted / transitional going rate
  lowerHourlyRate?: number; // £/hour at lower rate
  group: string;            // sector label (for filter)
  notes?: string;
  isl?: boolean;            // on Immigration Salary List (legacy flag)
  closedToNewOverseas?: boolean;
}

// 2026 thresholds
export const THRESHOLDS = {
  general: 38700,
  newEntrant: 30960,
  islGeneral: 30960,
  healthCare: 25600,
  healthCareNewEntrant: 20960,
  hourlyMinimum: 15.88,
};

export const SOC_OCCUPATIONS: SocOccupation[] = [
`;

  const body = records
    .map((r) => {
      const parts = [
        `code: '${r.code}'`,
        `title: ${JSON.stringify(r.title)}`,
        `goingRate: ${r.goingRate}`,
      ];
      if (r.hourlyGoingRate != null) parts.push(`hourlyGoingRate: ${r.hourlyGoingRate}`);
      if (r.lowerGoingRate != null) parts.push(`lowerGoingRate: ${r.lowerGoingRate}`);
      if (r.lowerHourlyRate != null) parts.push(`lowerHourlyRate: ${r.lowerHourlyRate}`);
      parts.push(`group: ${JSON.stringify(r.group)}`);
      if (r.notes) parts.push(`notes: ${JSON.stringify(r.notes)}`);
      return `  { ${parts.join(', ')} },`;
    })
    .join('\n');

  const footer = `
];

export const SOC_GROUPS = Array.from(new Set(SOC_OCCUPATIONS.map((o) => o.group))).sort();
`;

  const out = header + body + footer;
  const outPath = path.join(ROOT, 'src', 'data', 'socCodes.ts');
  writeFileSync(outPath, out);
  console.log('Wrote', outPath, (out.length / 1024).toFixed(1), 'KB');
}

main().catch((e) => { console.error(e); process.exit(1); });
