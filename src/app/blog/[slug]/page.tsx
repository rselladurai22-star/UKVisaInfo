import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS, getPost, postCategory, getCategoryMeta, type BlogCategory, type RelatedTool } from '../../../data/blog';
import { primaryEditorSchema, PRIMARY_EDITOR } from '../../../data/editorialTeam';
import RelatedPosts from '../../../components/RelatedPosts';
import ReadingProgress from '../../../components/blog/ReadingProgress';
import ArticleToc from '../../../components/blog/ArticleToc';
import ShareRail from '../../../components/blog/ShareRail';
import ArticleBody from '../../../components/blog/ArticleBody';
import Comments from '../../../components/blog/Comments';
import EmailCapture from '../../../components/EmailCapture';
import StickyMobileCta from '../../../components/StickyMobileCta';
import AdUnit from '../../../components/AdUnit';
import { extractH2Headings } from '../../../components/blog/slug';
import { parseSegments } from '../../../components/blog/parseSegments';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'skilled-worker': { bg: 'rgba(0, 196, 180,0.1)',  text: '#c0112a' },
  'student':        { bg: 'rgba(10, 37, 64,0.1)',  text: '#1d4ed8' },
  'family':         { bg: 'rgba(19, 50, 95,0.1)', text: '#6d28d9' },
  'visitor':        { bg: 'rgba(0, 196, 180,0.1)',  text: '#0e7490' },
  'costs':          { bg: 'rgba(201, 161, 74,0.1)',  text: '#b45309' },
  'health':         { bg: 'rgba(0, 168, 154,0.1)',  text: '#047857' },
  'graduate':       { bg: 'rgba(0, 127, 118,0.1)', text: '#0f766e' },
};
const tagStyle = (tag: string) =>
  TAG_COLORS[tag.toLowerCase().replace(/\s+/g, '-')] ?? { bg: 'rgba(14,20,36,0.07)', text: '#52596e' };

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
  // Strips MD syntax → counts words → trims first 5000 chars for articleBody.
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
          EDITORIAL HERO
      ═══════════════════════ */}
      <header className="relative isolate overflow-hidden bg-gradient-to-b from-[#0A2540] via-[#0e1b3f] to-[#0F2C4B] pt-[100px] md:pt-[120px] pb-14 md:pb-20">
        {/* decorative bg */}
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#00C4B4]/15 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#0A2540]/10 blur-[140px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Back nav */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm font-medium mb-7 transition-colors duration-100"
          >
            <ArrowLeft className="w-4 h-4" />
            All articles
          </Link>

          {/* Category + freshness pill */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Link href={`/blog/category/${category}`} className="inline-flex items-center text-[10.5px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#C9A14A] text-[#0A2540] hover:bg-[#ffd166] transition-colors">
              {catMeta.label}
            </Link>
            {isFresh && (
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.14] text-[#34d399]">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-[#34d399] opacity-65 animate-ping" />
                  <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#34d399]" />
                </span>
                Updated {updatedDays === 0 ? 'today' : `${updatedDays}d ago`}
              </span>
            )}
            {post.tags.slice(1, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10.5px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-white/[0.07] text-white/55"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold leading-[1.08] tracking-[-0.025em]">
            {post.title}
          </h1>

          {/* Deck */}
          <p className="mt-5 text-white/65 text-[1.0625rem] md:text-[1.125rem] leading-relaxed max-w-2xl">
            {post.description}
          </p>

          {/* Meta row */}
          <div className="mt-8 pt-7 border-t border-white/[0.08] flex flex-wrap items-center gap-x-6 gap-y-2.5 text-white/45 text-[12.5px]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readMinutes} min read
            </span>
            <span className="hidden md:flex items-center gap-1.5 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
              By <Link href={PRIMARY_EDITOR.profileUrl} className="text-white/85 hover:underline underline-offset-2">{PRIMARY_EDITOR.name}</Link>
            </span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════
          3-COLUMN ARTICLE LAYOUT
      ═══════════════════════ */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="grid grid-cols-12 gap-8 lg:gap-10">

            {/* ── LEFT RAIL: TOC ── */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-[110px]">
                <ArticleToc headings={headings} />
              </div>
            </aside>

            {/* ── CENTER: ARTICLE ── */}
            <article className="col-span-12 lg:col-span-7">
              <ArticleBody body={post.body} articleSlug={post.slug} />

              {/* Mid-article ad — shown after body, before tags */}
              <AdUnit slot="3862206036" format="auto" className="my-8" />

              {/* Tags strip */}
              <div className="mt-12 pt-8 border-t border-[rgba(14,20,36,0.08)]">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-3">Filed under</div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => {
                    const s = tagStyle(tag);
                    return (
                      <span
                        key={tag}
                        className="text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full"
                        style={{ background: s.bg, color: s.text }}
                      >
                        {tag}
                      </span>
                    );
                  })}
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
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-3">Related calculators</div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {relatedTools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="group rounded-xl border border-[rgba(14,20,36,0.1)] p-4 hover:border-[#0A2540] transition-colors"
                      style={{ borderTopColor: catMeta.accent, borderTopWidth: 2 }}
                    >
                      <div className="font-semibold text-[#0A2540] text-sm flex items-center gap-1">{t.label}<ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                      <div className="text-[12px] text-[#52596e] mt-0.5">{t.hint}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pre-comments ad */}
              <AdUnit slot="8847243325" format="auto" className="my-6" />

              <RelatedPosts current={post} />

              <Comments term={post.slug} />

              {/* Bottom CTA */}
              <div className="mt-14 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0F2C4B] to-[#1c2c63] p-7 md:p-10">
                <div
                  className="absolute inset-0 opacity-[0.22] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-[#00C4B4]/25 blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-md">
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#C9A14A] mb-4">
                    {cta.kicker}
                  </span>
                  <h3 className="font-display text-white text-[1.25rem] md:text-[1.625rem] font-bold leading-tight tracking-[-0.015em]">
                    {cta.heading}
                  </h3>
                  <p className="mt-3 text-white/55 text-[14.5px] leading-relaxed">
                    {cta.sub}
                  </p>
                  <Link
                    href={cta.href}
                    className="mt-6 inline-flex items-center gap-2 bg-[#C9A14A] text-[#0A2540] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] active:scale-[0.98] transition-[background,transform] duration-150"
                  >
                    {cta.label} <ArrowRight className="w-4 h-4" />
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
          font-family: var(--font-display, sans-serif);
          float: left;
          font-size: 4.5rem;
          line-height: 0.82;
          font-weight: 800;
          padding: 0.2rem 0.65rem 0 0;
          color: #00C4B4;
          letter-spacing: -0.03em;
        }
        @media (max-width: 640px) {
          .article-body > p:first-of-type::first-letter {
            font-size: 3.5rem;
            padding: 0.15rem 0.5rem 0 0;
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
