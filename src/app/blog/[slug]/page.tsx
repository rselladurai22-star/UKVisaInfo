import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ArrowRight, ChevronRight, Home, ArrowUpRight } from 'lucide-react';
import { BLOG_POSTS, getPost, postCategory, getCategoryMeta, type BlogCategory, type RelatedTool } from '../../../data/blog';
import { primaryEditorSchema, PRIMARY_EDITOR } from '../../../data/editorialTeam';
import RelatedPosts from '../../../components/RelatedPosts';
import ReadingProgress from '../../../components/blog/ReadingProgress';
import ArticleToc from '../../../components/blog/ArticleToc';
import ShareRail from '../../../components/blog/ShareRail';
import ArticleBody from '../../../components/blog/ArticleBody';
import FlagshipSalary2025 from './FlagshipSalary2025';
import Comments from '../../../components/blog/Comments';
import EmailCapture from '../../../components/EmailCapture';
import StickyMobileCta from '../../../components/StickyMobileCta';
import AdUnit from '../../../components/AdUnit';
import { extractH2Headings } from '../../../components/blog/slug';
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

  const headings = extractH2Headings(post.body);
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
        <ReadingProgress />
        <FlagshipSalary2025 post={post} catMeta={catMeta} relatedTools={relatedTools} />
        <StickyMobileCta context={catMeta.label} label={cta.label} href={cta.href} />
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

      {/* Top reading progress bar */}
      <ReadingProgress />

      {/* ═══════════════════════
          EDITORIAL HEADER
      ═══════════════════════ */}
      <header className="bg-surface border-b border-outline-variant/60 pt-6 sm:pt-8 md:pt-10 pb-5 sm:pb-6">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Back nav / breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex flex-row flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
            <Link href="/" className="hover:text-primary flex items-center gap-1 whitespace-nowrap"><Home className="h-3.5 w-3.5 flex-shrink-0" /> Home</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
            <Link href="/blog" className="hover:text-primary whitespace-nowrap">Guides</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
            <span className="text-primary font-bold whitespace-nowrap">Read</span>
          </nav>

          {/* Category pill / tag info */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link href={`/blog?category=${category}`} className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: catMeta.accent }}>
              {catMeta.label}
            </Link>
            {isFresh && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-success-soft text-success">
                Updated
              </span>
            )}
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-[26px] leading-tight sm:text-4xl font-display font-bold tracking-tight text-on-surface">
            {post.title}
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
            {post.description}
          </p>

          {/* Meta row */}
          <div className="mt-6 pt-4 border-t border-outline-variant/40 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-on-surface-variant/80 text-[12px] font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
              {post.readMinutes} min read
            </span>
            <span className="flex items-center gap-1.5 sm:ml-auto whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
              <span className="text-on-surface-variant/80 whitespace-nowrap">
                By <Link href={PRIMARY_EDITOR.profileUrl} className="text-on-surface hover:text-primary font-semibold transition-colors whitespace-nowrap">{PRIMARY_EDITOR.name}</Link>
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════
          3-COLUMN ARTICLE LAYOUT
      ═══════════════════════ */}
      <div className="bg-surface text-on-surface min-h-screen">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10">

            {/* ── LEFT RAIL: TOC ── */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-[110px]">
                <ArticleToc headings={headings} />
              </div>
            </aside>

      {/* ── CENTER: ARTICLE ── */}
            <article className="w-full col-span-12 lg:col-span-7">
              <ArticleBody body={post.body} articleSlug={post.slug} />

              {/* Mid-article ad — shown after body, before tags */}
              <AdUnit slot="3862206036" format="auto" className="my-8" />

              {/* Tags strip */}
              <div className="mt-12 pt-8 border-t border-outline-variant/60">
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-3">Filed under</div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <EmailCapture
                title={category === 'visa' ? 'Stay on top of UK visa changes' : 'Stay on top of UK money & rule changes'}
                subtitle="Rule updates, rate changes and practical guides in a weekly 3-minute brief."
                cta="Get the brief"
                source={`blog:${post.slug}`}
              />

              {/* Related calculators — cluster cross-link to high-intent tools */}
              <div className="mt-12">
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-3">Related calculators</div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {relatedTools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="group relative rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 flex items-center gap-3 hover:shadow-md active:scale-[0.99] transition-all overflow-hidden"
                    >
                      {/* Hover left accent line */}
                      <span className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: catMeta.accent }} />
                      <div className="min-w-0 flex-1 pl-1">
                        <div className="text-[13px] font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                          {t.label}
                        </div>
                        <div className="text-[11px] text-on-surface-variant truncate">
                          {t.hint}
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-on-surface-variant group-hover:text-primary shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pre-comments ad */}
              <AdUnit slot="8847243325" format="auto" className="my-6" />

              <RelatedPosts current={post} />

              <Comments term={post.slug} />

              {/* Bottom CTA */}
              <div className="mt-14 relative rounded-lg border border-outline-variant bg-surface-container-low p-6 sm:p-8 overflow-hidden shadow-soft">
                <div className="relative z-10 max-w-lg">
                  <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
                    {cta.kicker}
                  </span>
                  <h3 className="font-display text-on-surface text-lg sm:text-xl font-bold leading-tight">
                    {cta.heading}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {cta.sub}
                  </p>
                  <Link
                    href={cta.href}
                    className="mt-5 inline-flex items-center gap-1.5 bg-primary text-white font-bold px-4 py-2.5 rounded-lg text-xs hover:bg-primary-strong active:scale-[0.98] transition-all duration-150 shadow-sm"
                  >
                    {cta.label} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>

            {/* ── RIGHT RAIL: SHARE ── */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-[110px] space-y-6">
                <ShareRail title={post.title} />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Article-specific typography polish */}
      <style>{`
        .article-body > p:first-of-type::first-letter {
          font-family: var(--font-grotesk), sans-serif;
          float: left;
          font-size: 3.2em;
          line-height: 0.85;
          margin-right: 0.15em;
          margin-top: 0.05em;
          font-weight: 800;
          color: ${catMeta.accent};
        }
        @media (max-width: 640px) {
          .article-body > p:first-of-type::first-letter {
            font-size: 2.8em;
            margin-right: 0.12em;
          }
        }
        @supports (initial-letter: 2) or (-webkit-initial-letter: 2) {
          .article-body > p:first-of-type::first-letter {
            float: none;
            font-size: inherit;
            line-height: inherit;
            margin-top: 0;
            -webkit-initial-letter: 2;
            initial-letter: 2;
            margin-right: 0.22em;
          }
          @media (max-width: 640px) {
            .article-body > p:first-of-type::first-letter {
              margin-right: 0.18em;
            }
          }
        }
      `}</style>

      <StickyMobileCta
        context={category === 'visa' ? 'Find your route' : catMeta.label}
        label={cta.label}
        href={cta.href}
      />
    </>
  );
}
