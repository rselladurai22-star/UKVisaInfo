import type { MetadataRoute } from 'next';
import { BLOG_POSTS, BLOG_CATEGORIES, getPostsByCategory } from '../data/blog';
import { CATEGORIES } from '../data/tools';
import { HUB_TOOLS } from '../data/hubTools';

const SITE = 'https://ukvisainfo.co.uk';
const TODAY = new Date().toISOString().split('T')[0];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  /* ── Top-level pages ── */
  const top = [
    { p: '',                 prio: 1.0,  freq: 'weekly' },
    { p: '/blog',            prio: 0.9,  freq: 'weekly' },
    { p: '/postcode',        prio: 0.95, freq: 'monthly' },
    { p: '/take-home-pay',         prio: 0.95, freq: 'monthly' },
    { p: '/payslip-auditor',       prio: 0.95, freq: 'monthly' },
    { p: '/self-employed-tax',     prio: 0.95, freq: 'monthly' },
    { p: '/contractor-ir35',       prio: 0.95, freq: 'monthly' },
    { p: '/director-dividend',     prio: 0.95, freq: 'monthly' },
    { p: '/bonus-tax',             prio: 0.95, freq: 'monthly' },
    { p: '/student-loan-repayment', prio: 0.90, freq: 'monthly' },
    { p: '/salary-sacrifice-calculator', prio: 0.90, freq: 'monthly' },
    { p: '/child-benefit-trap',    prio: 0.95, freq: 'monthly' },
    { p: '/stamp-duty-calculator', prio: 0.95, freq: 'monthly' },
    { p: '/mortgage-affordability', prio: 0.95, freq: 'monthly' },
    { p: '/council-tax-band',      prio: 0.95, freq: 'monthly' },
    { p: '/cost-of-living-uk',     prio: 0.90, freq: 'monthly' },
    { p: '/holiday-pay',           prio: 0.90, freq: 'monthly' },
    { p: '/salary-compare',        prio: 0.95, freq: 'monthly' },
    { p: '/cgt-calculator',        prio: 0.90, freq: 'monthly' },
    { p: '/state-pension',         prio: 0.90, freq: 'monthly' },
    { p: '/ulez-check',            prio: 0.90, freq: 'monthly' },
    { p: '/mot-check',             prio: 0.90, freq: 'monthly' },
    { p: '/energy-bill',           prio: 0.95, freq: 'weekly'  },
    { p: '/redundancy-pay',         prio: 0.90, freq: 'monthly' },
    { p: '/maternity-pay',          prio: 0.90, freq: 'monthly' },
    { p: '/sick-pay',               prio: 0.90, freq: 'monthly' },
    { p: '/inheritance-tax',        prio: 0.90, freq: 'monthly' },
    { p: '/tools',           prio: 0.8,  freq: 'monthly' },
    { p: '/about',           prio: 0.4,  freq: 'yearly' },
    { p: '/privacy',         prio: 0.3,  freq: 'yearly' },
    { p: '/terms',           prio: 0.3,  freq: 'yearly' },
    /* ── Tier-2 calculators ── */
    { p: '/marriage-allowance-calculator', prio: 0.90, freq: 'monthly' },
    { p: '/rental-income-tax',           prio: 0.90, freq: 'monthly' },
    { p: '/rental-yield-calculator',     prio: 0.90, freq: 'monthly' },
    { p: '/overpayment-mortgage',        prio: 0.90, freq: 'monthly' },
    { p: '/property-cgt-calculator',     prio: 0.90, freq: 'monthly' },
    { p: '/childcare-calculator',        prio: 0.90, freq: 'monthly' },
    { p: '/isa-calculator',              prio: 0.90, freq: 'monthly' },
    { p: '/minimum-wage-checker',        prio: 0.90, freq: 'monthly' },
    { p: '/pension-drawdown-calculator', prio: 0.90, freq: 'monthly' },
    { p: '/lifetime-isa-calculator',     prio: 0.90, freq: 'monthly' },
  ];
  for (const { p, prio, freq } of top) {
    urls.push({
      url: `${SITE}${p || ''}`,
      lastModified: TODAY,
      changeFrequency: freq as MetadataRoute.Sitemap[number]['changeFrequency'],
      priority: prio,
    });
  }

  /* ── All live hub tools (auto — every live calculator, deduped) ── */
  const seen = new Set(urls.map((u) => u.url));
  for (const groups of Object.values(HUB_TOOLS)) {
    for (const g of groups) {
      for (const item of g.items) {
        if (item.status !== 'live' || !item.href.startsWith('/')) continue;
        const url = `${SITE}${item.href}`;
        if (seen.has(url)) continue;
        seen.add(url);
        urls.push({ url, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.9 });
      }
    }
  }

  /* ── Category hubs ── */
  for (const cat of CATEGORIES) {
    urls.push({
      url: `${SITE}/category/${cat.id}`,
      lastModified: TODAY,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
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

  /* ── Blog category silos ── */
  for (const c of BLOG_CATEGORIES) {
    if (getPostsByCategory(c.id).length === 0) continue;
    urls.push({
      url: `${SITE}/blog/category/${c.id}`,
      lastModified: TODAY,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return urls;
}
