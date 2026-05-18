import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ArrowRight, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS, getPost } from '../../../data/blog';
import AffiliateCallouts from '../../../components/AffiliateCallouts';
import RelatedPosts from '../../../components/RelatedPosts';
import ReadingProgress from '../../../components/blog/ReadingProgress';
import ArticleToc from '../../../components/blog/ArticleToc';
import ShareRail from '../../../components/blog/ShareRail';
import { extractH2Headings, headingSlug } from '../../../components/blog/slug';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'skilled-worker': { bg: 'rgba(217,21,43,0.1)',  text: '#c0112a' },
  'student':        { bg: 'rgba(37,99,235,0.1)',  text: '#1d4ed8' },
  'family':         { bg: 'rgba(124,58,237,0.1)', text: '#6d28d9' },
  'visitor':        { bg: 'rgba(8,145,178,0.1)',  text: '#0e7490' },
  'costs':          { bg: 'rgba(217,119,6,0.1)',  text: '#b45309' },
  'health':         { bg: 'rgba(5,150,105,0.1)',  text: '#047857' },
  'graduate':       { bg: 'rgba(13,148,136,0.1)', text: '#0f766e' },
};
const tagStyle = (tag: string) =>
  TAG_COLORS[tag.toLowerCase().replace(/\s+/g, '-')] ?? { bg: 'rgba(14,20,36,0.07)', text: '#52596e' };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://ukvisainfo.co.uk/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = extractH2Headings(post.body);
  const primaryTag = post.tags[0] ?? 'Guide';
  const updatedDays = Math.floor(
    (Date.now() - new Date(post.updated).getTime()) / (1000 * 60 * 60 * 24)
  );
  const isFresh = updatedDays <= 30;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    author: { '@type': 'Organization', name: 'UK Visa Info' },
    publisher: { '@type': 'Organization', name: 'UK Visa Info', url: 'https://ukvisainfo.co.uk' },
    mainEntityOfPage: `https://ukvisainfo.co.uk/blog/${slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Top reading progress bar */}
      <ReadingProgress />

      {/* ═══════════════════════
          EDITORIAL HERO
      ═══════════════════════ */}
      <header className="relative isolate overflow-hidden bg-gradient-to-b from-[#0a1530] via-[#0e1b3f] to-[#13204a] pt-[100px] md:pt-[120px] pb-14 md:pb-20">
        {/* decorative bg */}
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#d9152b]/15 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#2563eb]/10 blur-[140px] pointer-events-none" />

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
            <span className="inline-flex items-center text-[10.5px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#ffbf47] text-[#0a1530]">
              {primaryTag}
            </span>
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
              By <span className="text-white/65">UK Visa Info Editorial</span>
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
              <div className="article-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => {
                      const text = childrenToText(children);
                      const id = headingSlug(text);
                      return (
                        <h2 id={id} className="group relative font-display text-[1.5rem] md:text-[1.875rem] font-bold text-[#0a1530] mt-14 mb-5 leading-tight tracking-[-0.015em] scroll-mt-28">
                          <a
                            href={`#${id}`}
                            aria-label="Anchor link"
                            className="absolute -left-7 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#d9152b] hidden md:inline-flex"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => (
                      <h3 className="font-display text-[1.125rem] md:text-[1.3125rem] font-bold text-[#0a1530] mt-10 mb-3 leading-snug tracking-[-0.01em] flex items-center gap-2.5">
                        <span className="w-1 h-5 bg-[#d9152b] rounded-full flex-shrink-0" aria-hidden="true" />
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[#1a2240] text-[1.0625rem] md:text-[1.125rem] leading-[1.75] mb-5">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => <ul className="my-6 space-y-2.5 pl-0">{children}</ul>,
                    ol: ({ children }) => <ol className="my-6 space-y-2.5 pl-0 counter-reset-list">{children}</ol>,
                    li: ({ children }) => (
                      <li className="flex gap-3 items-start text-[#1a2240] text-[1.0625rem] leading-[1.7]">
                        <span className="mt-[10px] w-1.5 h-1.5 rounded-full bg-[#d9152b] flex-shrink-0" />
                        <span className="flex-1">{children}</span>
                      </li>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-[#d9152b] underline decoration-[#d9152b]/35 decoration-[1.5px] hover:decoration-[#d9152b] underline-offset-[3px] font-medium transition-[text-decoration-color]"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-[#0a1530]">{children}</strong>
                    ),
                    table: ({ children }) => (
                      <div className="my-9 -mx-3 sm:mx-0 overflow-x-auto rounded-2xl border border-[rgba(14,20,36,0.09)] bg-white shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
                        <table className="w-full text-[14px]">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-[#f7f9fd] border-b border-[rgba(14,20,36,0.09)]">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="text-left px-4 py-3 font-bold text-[#0a1530] text-[11px] uppercase tracking-[0.08em] whitespace-nowrap">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3.5 border-t border-[rgba(14,20,36,0.05)] text-[#1a2240] text-[14.5px] leading-relaxed">
                        {children}
                      </td>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-8 relative bg-gradient-to-br from-[#f7f9fd] to-white border-l-[3px] border-[#d9152b] rounded-r-xl p-5 md:p-6">
                        <span
                          aria-hidden="true"
                          className="absolute top-2 right-4 font-display font-bold text-[3.5rem] leading-none text-[#d9152b]/15 select-none"
                        >&ldquo;</span>
                        <div className="relative text-[#0a1530] text-[1.0625rem] md:text-[1.125rem] leading-[1.65] italic font-medium">
                          {children}
                        </div>
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-[#f3f5fb] text-[#d9152b] px-1.5 py-0.5 rounded-md text-[0.875em] font-mono border border-[rgba(14,20,36,0.07)] tabular-nums">
                        {children}
                      </code>
                    ),
                    hr: () => (
                      <div className="my-12 flex items-center justify-center gap-2" aria-hidden="true">
                        <span className="w-1 h-1 rounded-full bg-[#d9152b]" />
                        <span className="w-1 h-1 rounded-full bg-[#0a1530]/20" />
                        <span className="w-1 h-1 rounded-full bg-[#d9152b]" />
                      </div>
                    ),
                  }}
                >
                  {post.body}
                </ReactMarkdown>
              </div>

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

              <AffiliateCallouts tags={post.tags} />
              <RelatedPosts current={post} />

              {/* Bottom CTA */}
              <div className="mt-14 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-7 md:p-10">
                <div
                  className="absolute inset-0 opacity-[0.22] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-[#d9152b]/25 blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-md">
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#ffbf47] mb-4">
                    Start here
                  </span>
                  <h3 className="font-display text-white text-[1.25rem] md:text-[1.625rem] font-bold leading-tight tracking-[-0.015em]">
                    Find the right UK visa route in 60 seconds.
                  </h3>
                  <p className="mt-3 text-white/55 text-[14.5px] leading-relaxed">
                    Take our free quiz to see which UK visa matches your situation.
                  </p>
                  <Link
                    href="/eligibility"
                    className="mt-6 inline-flex items-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] active:scale-[0.98] transition-[background,transform] duration-150"
                  >
                    Start eligibility check <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>

            {/* ── RIGHT RAIL: SHARE ── */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-[110px]">
                <ShareRail title={post.title} />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Article-specific typography polish */}
      <style>{`
        .article-body > p:first-of-type::first-letter {
          font-family: var(--font-display, 'Syne'), serif;
          float: left;
          font-size: 4.2rem;
          line-height: 0.9;
          font-weight: 800;
          padding: 0.35rem 0.7rem 0 0;
          color: #d9152b;
          letter-spacing: -0.03em;
        }
        @media (max-width: 640px) {
          .article-body > p:first-of-type::first-letter {
            font-size: 3.4rem;
            padding: 0.3rem 0.55rem 0 0;
          }
        }
      `}</style>
    </>
  );
}

/* Helper: ReactMarkdown sometimes passes children as array of strings/elements */
function childrenToText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    const c = (children as { props?: { children?: React.ReactNode } }).props?.children;
    return childrenToText(c);
  }
  return '';
}
