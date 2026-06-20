import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ChevronRight, Home, ArrowUpRight, BadgeCheck } from 'lucide-react';
import { BLOG_POSTS, getPost, postCategory, getCategoryMeta, type BlogCategory, type RelatedTool } from '../../../data/blog';
import { primaryEditorSchema, PRIMARY_EDITOR } from '../../../data/editorialTeam';
import RelatedPosts from '../../../components/RelatedPosts';
import ArticleBody from '../../../components/blog/ArticleBody';
import ShareRail from '../../../components/blog/ShareRail';
import FlagshipSalary2025 from './FlagshipSalary2025';
import Comments from '../../../components/blog/Comments';
import StickyMobileCta from '../../../components/StickyMobileCta';
import AdUnit from '../../../components/AdUnit';
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
    sub: 'Free UK calculators for tax, National Insurance and net pay — 2025/26.',
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

  const updatedDays = Math.floor(
    (Date.now() - new Date(post.updated).getTime()) / (1000 * 60 * 60 * 24)
  );
  const isFresh = updatedDays <= 30;

  const category = postCategory(post);
  const catMeta = getCategoryMeta(category);
  const cta = CATEGORY_CTA[category];
  const relatedTools = post.relatedTools && post.relatedTools.length ? post.relatedTools : cta.tools;

  // Plain-text projection of the markdown body for Article schema.
  const plainBody = post.body
    .replace(/```[\s\S]*?```/g, ' ')            // code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')      // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')    // links → text
    .replace(/>\s*\[!\w+\][^\n]*/g, ' ')        // callout markers
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
        <FlagshipSalary2025 post={post} catMeta={catMeta} relatedTools={relatedTools} />
        <StickyMobileCta context={catMeta.label} label={cta.label} href={cta.href} />
      </>
    );
  }

  const dateLabel = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const verifiedLabel = category === 'visa' ? 'gov.uk-sourced' : 'HMRC-verified · 2025/26';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <article className="min-h-screen bg-white text-slate-900 antialiased">
        {/* ───────── HERO (matches flagship) ───────── */}
        <header className="relative border-b border-slate-200 bg-white">
          <div aria-hidden className="cs-canvas pointer-events-none absolute inset-0" />
          <div className="relative mx-auto w-full max-w-5xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
            <div className="lg:grid lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-8">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-mono text-[12px] text-slate-400">
                  <Link href="/" className="inline-flex items-center gap-1 hover:text-blue-700"><Home className="h-3.5 w-3.5" /> home</Link>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  <Link href="/blog" className="hover:text-blue-700">guides</Link>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  <span className="text-slate-600">read</span>
                </nav>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link href={`/blog?category=${category}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white hover:opacity-90 transition-opacity" style={{ background: catMeta.accent }}>
                    {catMeta.label}
                  </Link>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> {verifiedLabel}
                  </span>
                  {isFresh && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      Updated
                    </span>
                  )}
                </div>

                <h1 className="mt-5 font-display text-[clamp(28px,5.2vw,44px)] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-900 [text-wrap:balance]">
                  {post.title}
                </h1>

                <p className="mt-4 text-[17px] leading-relaxed text-slate-600">
                  {post.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 pt-4 font-mono text-[12px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {dateLabel}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readMinutes} min read</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> By <Link href={PRIMARY_EDITOR.profileUrl} className="font-sans font-semibold text-slate-700 hover:text-blue-700">{PRIMARY_EDITOR.name}</Link></span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ───────── BODY: article + right sidebar (desktop) ───────── */}
        <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-6">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">

            {/* MAIN COLUMN */}
            <div className="min-w-0 lg:col-span-8">
              {/* Share row — top of every post */}
              <div className="mb-8 border-b border-slate-200 pb-5">
                <ShareRail title={post.title} />
              </div>

              <ArticleBody body={post.body} articleSlug={post.slug} />

              {/* Mid-article ad */}
              <AdUnit slot="3862206036" format="auto" className="my-8" />

              {/* Tags strip */}
              <div className="mt-12 border-t border-slate-200 pt-8">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-3">Filed under</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pre-comments ad */}
              <AdUnit slot="8847243325" format="auto" className="my-6" />

              <Comments term={post.slug} />

              {/* Bottom CTA — flagship dark gradient */}
              <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 p-7 text-white shadow-cs-lg sm:p-9">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">{cta.kicker}</p>
                <h3 className="mt-3 font-display text-[clamp(20px,3vw,28px)] font-extrabold leading-tight tracking-[-0.02em]">
                  {cta.heading}
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">
                  {cta.sub}
                </p>
                <Link
                  href={cta.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
                >
                  {cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* RIGHT SIDEBAR — desktop; stacks below on mobile */}
            <aside className="mt-14 lg:mt-0 lg:col-span-4">
              <div className="space-y-8 lg:sticky lg:top-8">
                {/* Related calculators */}
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 mb-3">Keep going</p>
                  <div className="space-y-3">
                    {relatedTools.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-cs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold text-slate-900 group-hover:text-blue-700">{t.label}</p>
                          <p className="truncate text-[11.5px] text-slate-500">{t.hint}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 flex-none text-slate-300 group-hover:text-blue-600" />
                      </Link>
                    ))}
                  </div>
                </div>

                <RelatedPosts current={post} />
              </div>
            </aside>
          </div>
        </div>
      </article>

      <StickyMobileCta
        context={category === 'visa' ? 'Find your route' : catMeta.label}
        label={cta.label}
        href={cta.href}
      />
    </>
  );
}
