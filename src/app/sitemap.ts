import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '../data/blog';
import { VISA_DETAILS } from '../data/visaDetails';
import { SOC_OCCUPATIONS } from '../data/socCodes';
import { SPONSORS, SPONSOR_SECTORS } from '../data/sponsors';
import { COUNTRIES } from '../data/countries';
import { CITIES } from '../data/cities';
import { NEWS_ITEMS } from '../data/news';
import { VISA_VARIANTS } from '../data/visaVariants';
import { socSlug, slugify } from '../lib/slug';

const SITE = 'https://ukvisainfo.co.uk';
const TODAY = new Date().toISOString().split('T')[0];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  /* ── Top-level pages ── */
  const top = [
    { p: '',                 prio: 1.0,  freq: 'weekly' },
    { p: '/visa-types',      prio: 0.95, freq: 'weekly' },
    { p: '/eligibility',     prio: 0.9,  freq: 'monthly' },
    { p: '/costs',           prio: 0.8,  freq: 'monthly' },
    { p: '/blog',            prio: 0.9,  freq: 'weekly' },
    { p: '/news',            prio: 0.9,  freq: 'daily' },
    { p: '/settlement',      prio: 0.9,  freq: 'monthly' },
    { p: '/postcode',        prio: 0.95, freq: 'monthly' },
    { p: '/take-home-pay',         prio: 0.95, freq: 'monthly' },
    { p: '/stamp-duty-calculator', prio: 0.95, freq: 'monthly' },
    { p: '/mortgage-affordability', prio: 0.95, freq: 'monthly' },
    { p: '/council-tax-band',      prio: 0.95, freq: 'monthly' },
    { p: '/cost-of-living-uk',     prio: 0.90, freq: 'monthly' },
    { p: '/vat-calculator',        prio: 0.95, freq: 'monthly' },
    { p: '/tax-code',              prio: 0.90, freq: 'monthly' },
    { p: '/holiday-pay',           prio: 0.90, freq: 'monthly' },
    { p: '/salary-compare',        prio: 0.95, freq: 'monthly' },
    { p: '/cgt-calculator',        prio: 0.90, freq: 'monthly' },
    { p: '/pension-allowance',     prio: 0.85, freq: 'monthly' },
    { p: '/state-pension',         prio: 0.90, freq: 'monthly' },
    { p: '/ulez-check',            prio: 0.90, freq: 'monthly' },
    { p: '/mot-check',             prio: 0.90, freq: 'monthly' },
    { p: '/energy-bill',           prio: 0.95, freq: 'weekly'  },
    { p: '/tools',           prio: 0.8,  freq: 'monthly' },
    { p: '/tools/salary-checker',     prio: 0.85, freq: 'monthly' },
    { p: '/tools/sponsor-search',     prio: 0.85, freq: 'monthly' },
    { p: '/tools/cost-calculator',    prio: 0.85, freq: 'monthly' },
    { p: '/tools/compare',            prio: 0.8,  freq: 'monthly' },
    { p: '/tools/refusal-analyzer',   prio: 0.85, freq: 'monthly' },
    { p: '/my-journey',      prio: 0.6,  freq: 'monthly' },
    { p: '/from',            prio: 0.85, freq: 'monthly' },
    { p: '/uk-cities',       prio: 0.8,  freq: 'monthly' },
    { p: '/salary',          prio: 0.85, freq: 'monthly' },
    { p: '/about',           prio: 0.4,  freq: 'yearly' },
    { p: '/privacy',         prio: 0.3,  freq: 'yearly' },
    { p: '/terms',           prio: 0.3,  freq: 'yearly' },
  ];
  for (const { p, prio, freq } of top) {
    urls.push({
      url: `${SITE}${p || ''}`,
      lastModified: TODAY,
      changeFrequency: freq as MetadataRoute.Sitemap[number]['changeFrequency'],
      priority: prio,
    });
  }

  /* ── Visa guides ── */
  for (const v of Object.values(VISA_DETAILS)) {
    urls.push({
      url: `${SITE}/visa/${v.id}`,
      lastModified: TODAY,
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  }

  /* ── Sub-route SEO pages ── */
  for (const [slug, variants] of Object.entries(VISA_VARIANTS)) {
    for (const variant of variants) {
      urls.push({
        url: `${SITE}/visa/${slug}/${variant.id}`,
        lastModified: TODAY,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  /* ── Blog posts ── */
  for (const p of BLOG_POSTS) {
    urls.push({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: p.updated,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  /* ── Country guides ── */
  for (const c of Object.values(COUNTRIES)) {
    urls.push({
      url: `${SITE}/from/${c.code}`,
      lastModified: TODAY,
      changeFrequency: 'monthly',
      priority: c.status === 'full' ? 0.8 : 0.5,
    });
  }

  /* ── UK city guides ── */
  for (const c of Object.values(CITIES)) {
    urls.push({
      url: `${SITE}/uk-cities/${c.code}`,
      lastModified: TODAY,
      changeFrequency: 'monthly',
      priority: c.status === 'full' ? 0.7 : 0.5,
    });
  }

  /* ── 270 SOC salary pages ── */
  for (const o of SOC_OCCUPATIONS) {
    urls.push({
      url: `${SITE}/salary/${socSlug(o.code, o.title)}`,
      lastModified: TODAY,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  /* ── Sponsor sector pages ── */
  for (const s of SPONSOR_SECTORS) {
    urls.push({
      url: `${SITE}/sponsors/sector/${slugify(s)}`,
      lastModified: TODAY,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  /* ── Sponsor city pages ── */
  const cities = Array.from(new Set(SPONSORS.map((s) => s.city).filter(Boolean)));
  for (const c of cities) {
    urls.push({
      url: `${SITE}/sponsors/city/${slugify(c)}`,
      lastModified: TODAY,
      changeFrequency: 'weekly',
      priority: 0.65,
    });
  }

  /* ── News items ── */
  for (const n of NEWS_ITEMS) {
    urls.push({
      url: `${SITE}/news/${n.slug}`,
      lastModified: n.date,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return urls;
}
