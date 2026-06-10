import { NextRequest, NextResponse } from 'next/server';
import { BLOG_POSTS, BLOG_CATEGORIES, getPostsByCategory } from '../../../data/blog';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { COUNTRIES } from '../../../data/countries';
import { VISA_VARIANTS } from '../../../data/visaVariants';
import { HUB_TOOLS } from '../../../data/hubTools';

const SITE = 'https://ukvisainfo.co.uk';
const INDEXNOW_KEY = 'f5a5e346b62e95505a77586057fc7ba0';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Protect with a deploy secret so this can't be abused publicly
const SUBMIT_SECRET = process.env.INDEXNOW_SUBMIT_SECRET;

// Only indexable content is submitted. Noindex templated dumps (salary/SOC,
// sponsors, uk-cities, postcode, news) are deliberately excluded.
function buildAllUrls(): string[] {
  const seen = new Set<string>();
  const add = (p: string) => {
    const url = `${SITE}${p}`;
    if (!seen.has(url)) seen.add(url);
  };

  // Core content/info pages
  for (const p of [
    '', '/visa-types', '/visa-types/compare', '/eligibility', '/settlement', '/costs',
    '/blog', '/tools', '/cost-of-living-uk', '/about',
    '/tools/salary-checker', '/tools/sponsor-search', '/tools/cost-calculator', '/tools/refusal-analyzer',
  ]) add(p);

  // Every live calculator/tool (auto from the hub index)
  for (const groups of Object.values(HUB_TOOLS)) {
    for (const g of groups) {
      for (const item of g.items) {
        if (item.status === 'live' && item.href.startsWith('/')) add(item.href);
      }
    }
  }

  // Visa guides + variants
  for (const v of Object.values(VISA_DETAILS)) add(`/visa-types/${v.id}`);
  for (const [slug, variants] of Object.entries(VISA_VARIANTS)) {
    for (const variant of variants) add(`/visa-types/${slug}/${variant.id}`);
  }

  // Blog posts + category silos
  for (const p of BLOG_POSTS) add(`/blog/${p.slug}`);
  for (const c of BLOG_CATEGORIES) {
    if (getPostsByCategory(c.id).length > 0) add(`/blog/category/${c.id}`);
  }

  // Full country guides only (stubs are noindex)
  for (const c of Object.values(COUNTRIES)) {
    if (c.status === 'full') add(`/from/${c.code}`);
  }

  return Array.from(seen);
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
