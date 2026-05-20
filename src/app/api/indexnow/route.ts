import { NextRequest, NextResponse } from 'next/server';
import { BLOG_POSTS } from '../../../data/blog';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { SOC_OCCUPATIONS } from '../../../data/socCodes';
import { SPONSORS, SPONSOR_SECTORS } from '../../../data/sponsors';
import { COUNTRIES } from '../../../data/countries';
import { CITIES } from '../../../data/cities';
import { NEWS_ITEMS } from '../../../data/news';
import { VISA_VARIANTS } from '../../../data/visaVariants';
import { socSlug, slugify } from '../../../lib/slug';

const SITE = 'https://ukvisainfo.co.uk';
const INDEXNOW_KEY = 'f5a5e346b62e95505a77586057fc7ba0';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Protect with a deploy secret so this can't be abused publicly
const SUBMIT_SECRET = process.env.INDEXNOW_SUBMIT_SECRET;

function buildAllUrls(): string[] {
  const urls: string[] = [];

  const static_pages = [
    '', '/visa-types', '/eligibility', '/costs', '/blog', '/news', '/settlement',
    '/postcode', '/take-home-pay', '/stamp-duty-calculator', '/mortgage-affordability',
    '/council-tax-band', '/cost-of-living-uk', '/vat-calculator', '/tax-code',
    '/holiday-pay', '/salary-compare', '/cgt-calculator', '/pension-allowance',
    '/state-pension', '/ulez-check', '/mot-check', '/energy-bill',
    '/tools', '/tools/salary-checker', '/tools/sponsor-search',
    '/tools/cost-calculator', '/tools/compare', '/tools/refusal-analyzer',
    '/from', '/uk-cities', '/salary',
  ];
  for (const p of static_pages) urls.push(`${SITE}${p}`);

  for (const v of Object.values(VISA_DETAILS)) urls.push(`${SITE}/visa/${v.id}`);
  for (const [slug, variants] of Object.entries(VISA_VARIANTS)) {
    for (const variant of variants) urls.push(`${SITE}/visa/${slug}/${variant.id}`);
  }
  for (const p of BLOG_POSTS) urls.push(`${SITE}/blog/${p.slug}`);
  for (const c of Object.values(COUNTRIES)) urls.push(`${SITE}/from/${c.code}`);
  for (const c of Object.values(CITIES)) urls.push(`${SITE}/uk-cities/${c.code}`);
  for (const o of SOC_OCCUPATIONS) urls.push(`${SITE}/salary/${socSlug(o.code, o.title)}`);
  for (const s of SPONSOR_SECTORS) urls.push(`${SITE}/sponsors/sector/${slugify(s)}`);
  const cities = Array.from(new Set(SPONSORS.map((s) => s.city).filter(Boolean)));
  for (const c of cities) urls.push(`${SITE}/sponsors/city/${slugify(c)}`);
  for (const n of NEWS_ITEMS) urls.push(`${SITE}/news/${n.slug}`);

  return urls;
}

async function submitBatch(urls: string[]): Promise<{ ok: boolean; status: number; count: number }> {
  const body = {
    host: 'ukvisainfo.co.uk',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, count: urls.length };
}

export async function GET(req: NextRequest) {
  // Require secret to prevent public abuse
  const secret = req.nextUrl.searchParams.get('secret');
  if (!SUBMIT_SECRET || secret !== SUBMIT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allUrls = buildAllUrls();

  // IndexNow allows up to 10,000 URLs per call — send in one batch
  const BATCH = 10_000;
  const results = [];
  for (let i = 0; i < allUrls.length; i += BATCH) {
    const chunk = allUrls.slice(i, i + BATCH);
    const result = await submitBatch(chunk);
    results.push(result);
  }

  const totalSubmitted = results.reduce((s, r) => s + r.count, 0);
  const allOk = results.every((r) => r.ok);

  return NextResponse.json({
    submitted: totalSubmitted,
    batches: results,
    ok: allOk,
  });
}

// Also support POST with a specific list of URLs (e.g. called from a deploy hook)
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-submit-secret');
  if (!SUBMIT_SECRET || secret !== SUBMIT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const urls: string[] = Array.isArray(body.urls) ? body.urls : buildAllUrls();

  const result = await submitBatch(urls.slice(0, 10_000));
  return NextResponse.json(result);
}
