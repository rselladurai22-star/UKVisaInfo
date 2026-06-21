import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getPost, postCategory, getCategoryMeta, type BlogCategory, type RelatedTool } from '../../../data/blog';
import { primaryEditorSchema } from '../../../data/editorialTeam';
import BlogShell from '../../../components/blog/BlogShell';
import FlagshipSalary2025 from './FlagshipSalary2025';
import { parseSegments } from '../../../components/blog/parseSegments';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Category-aware end-of-article CTA + default cross-link tools (cluster model).
const CATEGORY_CTA: Record<BlogCategory, { kicker: string; heading: string; sub: string; href: string; label: string; tools: RelatedTool[] }> = {
  visa: {
    kicker: 'Start here', heading: 'Find the right UK visa route in 60 seconds.',
    sub: 'Take our free quiz to see which UK visa matches your situation.',
    href: '/eligibility', label: 'Start eligibility check',
    tools: [
      { href: '/tools/cost-calculator', label: 'Visa Cost Calculator', hint: 'Fees · IHS · dependants' },
      { href: '/ihs-calculator', label: 'IHS Calculator', hint: 'Healthcare surcharge' },
      { href: '/skilled-worker-points-check', label: 'Skilled Worker Points', hint: 'Points · salary · sponsor' },
    ],
  },
  money: {
    kicker: 'Try the tool', heading: 'See your real take-home pay.',
    sub: 'Free UK calculators for tax, National Insurance and net pay, 2025/26.',
    href: '/take-home-pay', label: 'Open take-home calculator',
    tools: [
      { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
      { href: '/national-insurance-calculator', label: 'National Insurance', hint: 'Class 1 / 4 NI' },
      { href: '/pension-calculator', label: 'Pension Calculator', hint: 'Pot at retirement' },
    ],
  },
  property: {
    kicker: 'Try the tool', heading: 'Work out what your move really costs.',
    sub: 'Mortgage, stamp duty and full buying-cost calculators for the UK.',
    href: '/mortgage-calculator', label: 'Open mortgage calculator',
    tools: [
      { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Repayment · interest' },
      { href: '/stamp-duty-calculator', label: 'Stamp Duty (SDLT)', hint: '2025/26 rates · FTB' },
      { href: '/house-buying-costs', label: 'House Buying Costs', hint: 'Total cash to buy' },
    ],
  },
  business: {
    kicker: 'Try the tool', heading: 'Run the numbers on your business.',
    sub: 'VAT, corporation tax and structure calculators for 2025/26.',
    href: '/corporation-tax-calculator', label: 'Open corporation tax calculator',
    tools: [
      { href: '/vat-calculator', label: 'VAT Calculator', hint: 'Add/remove 20% VAT' },
      { href: '/corporation-tax-calculator', label: 'Corporation Tax', hint: '19% / 25% + marginal' },
      { href: '/sole-trader-vs-limited', label: 'Sole Trader vs Limited', hint: 'Take-home compared' },
    ],
  },
  benefits: {
    kicker: 'Try the tool', heading: 'Check what support you can get.',
    sub: 'Universal Credit, childcare and council-tax support calculators.',
    href: '/universal-credit-calculator', label: 'Open Universal Credit calculator',
    tools: [
      { href: '/universal-credit-calculator', label: 'Universal Credit', hint: 'Allowance + elements' },
      { href: '/childcare-calculator', label: 'Childcare Costs', hint: 'Free hours + TFC' },
      { href: '/council-tax-support-checker', label: 'Council Tax Support', hint: 'Reduction eligibility' },
    ],
  },
  family: {
    kicker: 'Try the tool', heading: 'Estimate the cost of a separation.',
    sub: 'Divorce, child maintenance and settlement calculators.',
    href: '/divorce-cost-calculator', label: 'Open divorce cost calculator',
    tools: [
      { href: '/divorce-cost-calculator', label: 'Divorce Cost', hint: 'Court + legal fees' },
      { href: '/child-maintenance-calculator', label: 'Child Maintenance', hint: 'CMS formula' },
      { href: '/financial-settlement-calculator', label: 'Financial Settlement', hint: 'Asset split' },
    ],
  },
  motoring: {
    kicker: 'Try the tool', heading: 'Know what your car really costs.',
    sub: 'Road tax, running costs and fuel calculators for the UK.',
    href: '/car-running-costs', label: 'Open running-costs calculator',
    tools: [
      { href: '/vehicle-tax-calculator', label: 'Vehicle Tax (VED)', hint: 'CO2 + standard rate' },
      { href: '/car-running-costs', label: 'Car Running Costs', hint: 'Total cost of ownership' },
      { href: '/fuel-cost-calculator', label: 'Fuel Cost', hint: 'Per journey & year' },
    ],
  },
  energy: {
    kicker: 'Try the tool', heading: 'Cut your household bills.',
    sub: 'Energy bill, solar and heat-pump calculators under the price cap.',
    href: '/energy-bill', label: 'Open energy bill calculator',
    tools: [
      { href: '/energy-bill', label: 'Energy Bill', hint: 'Ofgem price cap' },
      { href: '/solar-panel-roi', label: 'Solar Panel ROI', hint: 'Payback + export' },
      { href: '/heat-pump-calculator', label: 'Heat Pump', hint: 'Running cost vs gas' },
    ],
  },
  estate: {
    kicker: 'Try the tool', heading: 'Plan your estate with confidence.',
    sub: 'Inheritance tax, probate and gift calculators for 2025/26.',
    href: '/inheritance-tax', label: 'Open inheritance tax calculator',
    tools: [
      { href: '/inheritance-tax', label: 'Inheritance Tax', hint: 'NRB £325k + RNRB' },
      { href: '/estate-value-calculator', label: 'Estate Value', hint: 'Net estate for IHT' },
      { href: '/gift-iht-calculator', label: 'Gift & 7-Year Rule', hint: 'Taper relief' },
    ],
  },
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Post not found' };
  const ogImageUrl = `https://ukvisainfo.co.uk/blog/${slug}/opengraph-image`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    authors: [
      { name: 'UKDesk Editorial', url: 'https://ukvisainfo.co.uk/about#ukdesk-editorial' },
      { name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
    ],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://ukvisainfo.co.uk/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: ['https://ukvisainfo.co.uk/about#ukdesk-editorial'],
      tags: post.tags,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const segments = parseSegments(post.body);
  const faqSegs = segments.filter((s) => s.type === 'faq');
  const allFaqs = faqSegs.flatMap((s) => (s.type === 'faq' ? s.items : []));

  const category = postCategory(post);
  const catMeta = getCategoryMeta(category);
  const cta = CATEGORY_CTA[category];
  const relatedTools = post.relatedTools && post.relatedTools.length ? post.relatedTools : cta.tools;

  // Plain-text projection of the markdown body for Article schema.
  const plainBody = post.body
    .replace(/```[\s\S]*?```/g, ' ')            // code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')      // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')    // links → text
    .replace(/^>.*$/gm, ' ')                    // block directives + their rows (charts/flow/faq/etc.)
    .replace(/^#{1,6}\s+/gm, '')                // heading hashes
    .replace(/[*_`~|]+/g, ' ')                  // emphasis + table pipes
    .replace(/<[^>]+>/g, ' ')                   // raw html
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = plainBody.split(/\s+/).filter(Boolean).length;
  const articleBody = plainBody.slice(0, 5000);

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    image: `https://ukvisainfo.co.uk/blog/${slug}/opengraph-image`,
    author: primaryEditorSchema('https://ukvisainfo.co.uk'),
    publisher: {
      '@type': 'Organization',
      name: 'UKDesk',
      url: 'https://ukvisainfo.co.uk',
      logo: { '@type': 'ImageObject', url: 'https://ukvisainfo.co.uk/icon.svg' },
    },
    mainEntityOfPage: `https://ukvisainfo.co.uk/blog/${slug}`,
    keywords: post.tags.join(', '),
    inLanguage: 'en-GB',
    isPartOf: { '@type': 'Blog', name: 'UKDesk Guides', url: 'https://ukvisainfo.co.uk/blog' },
    wordCount,
    articleBody,
    articleSection: post.tags[0] ?? 'Guide',
    timeRequired: `PT${post.readMinutes}M`,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://ukvisainfo.co.uk/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://ukvisainfo.co.uk/blog/${slug}` },
    ],
  };

  const faqJsonLd = allFaqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  // ── Flagship bespoke article (built from scratch, no legacy ArticleBody) ──
  if (slug === 'uk-salary-after-tax-take-home-table-2025-26') {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        )}
        <FlagshipSalary2025 post={post} category={category} catMeta={catMeta} cta={cta} relatedTools={relatedTools} />
      </>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <BlogShell
        post={post}
        category={category}
        catMeta={catMeta}
        cta={cta}
        relatedTools={relatedTools}
      />
    </>
  );
}
