import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS, getPost } from '../../../data/blog';
import AffiliateCallouts from '../../../components/AffiliateCallouts';
import RelatedPosts from '../../../components/RelatedPosts';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'skilled-worker': { bg: 'rgba(217,21,43,0.1)', text: '#c0112a' },
  'student': { bg: 'rgba(37,99,235,0.1)', text: '#1d4ed8' },
  'family': { bg: 'rgba(124,58,237,0.1)', text: '#6d28d9' },
  'visitor': { bg: 'rgba(8,145,178,0.1)', text: '#0e7490' },
  'costs': { bg: 'rgba(217,119,6,0.1)', text: '#b45309' },
  'health': { bg: 'rgba(5,150,105,0.1)', text: '#047857' },
  'graduate': { bg: 'rgba(13,148,136,0.1)', text: '#0f766e' },
};
function tagStyle(tag: string) {
  return TAG_COLORS[tag] ?? { bg: 'rgba(14,20,36,0.07)', text: '#52596e' };
}

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
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    author: { '@type': 'Organization', name: 'UK Visa Info' },
    publisher: {
      '@type': 'Organization',
      name: 'UK Visa Info',
      url: 'https://ukvisainfo.co.uk',
    },
    mainEntityOfPage: `https://ukvisainfo.co.uk/blog/${slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── DARK HERO HEADER ── */}
      <div className="hero-dark pt-[88px] md:pt-[104px] pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Back nav */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All articles
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-white text-[1.625rem] sm:text-[2rem] md:text-[2.5rem] font-bold leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="mt-4 text-white/55 text-base leading-relaxed max-w-2xl">
            {post.description}
          </p>

          {/* Meta row */}
          <div className="mt-7 flex flex-wrap items-center gap-5 text-white/40 text-xs">
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
          </div>
        </div>
      </div>

      {/* ── ARTICLE BODY ── */}
      <div className="bg-white">
        <article className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* Article content */}
          <div className="prose-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="font-display text-[1.375rem] md:text-[1.625rem] font-bold text-[#0a1530] mt-12 mb-4 pb-3 border-b border-[rgba(14,20,36,0.08)]">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-display text-[1.125rem] md:text-[1.25rem] font-bold text-[#0a1530] mt-9 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[#0e1424] text-[1.0625rem] leading-[1.75] mb-5">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="my-5 space-y-2.5 pl-0">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-5 space-y-2.5 pl-0">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="flex gap-3 items-start text-[#0e1424] text-[1.0rem] leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#d9152b] flex-shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-[#d9152b] underline decoration-[#d9152b]/30 hover:decoration-[#d9152b] underline-offset-2 font-medium transition-colors"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-[#0a1530]">{children}</strong>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8 rounded-xl border border-[rgba(14,20,36,0.09)] shadow-soft">
                    <table className="w-full text-sm">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-[#f3f5fb] border-b border-[rgba(14,20,36,0.09)]">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="text-left px-4 py-3 font-bold text-[#0a1530] text-[11px] uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3.5 border-t border-[rgba(14,20,36,0.06)] text-[#0e1424] text-sm leading-relaxed">
                    {children}
                  </td>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-7 pl-5 border-l-[3px] border-[#d9152b] italic text-[#52596e] text-[1.0rem] leading-relaxed">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-[#f3f5fb] text-[#d9152b] px-1.5 py-0.5 rounded-md text-[0.875em] font-mono border border-[rgba(14,20,36,0.07)]">
                    {children}
                  </code>
                ),
                hr: () => (
                  <hr className="my-10 border-none border-t border-[rgba(14,20,36,0.08)]" />
                ),
              }}
            >
              {post.body}
            </ReactMarkdown>
          </div>

          {/* Tags strip */}
          <div className="mt-10 pt-8 border-t border-[rgba(14,20,36,0.08)] flex flex-wrap gap-2">
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

          {/* Affiliate callouts */}
          <AffiliateCallouts tags={post.tags} />

          {/* Related posts */}
          <RelatedPosts current={post} />

          {/* Bottom eligibility CTA */}
          <div className="mt-12 hero-dark rounded-2xl p-7 md:p-9 relative overflow-hidden">
            <div className="dot-pattern absolute inset-0 opacity-35" aria-hidden="true" />
            <div className="relative z-10">
              <h3 className="font-display text-white text-[1.125rem] md:text-[1.375rem] font-bold leading-tight">
                Find the right UK visa route
              </h3>
              <p className="mt-2 text-white/55 text-sm leading-relaxed max-w-md">
                Take our free 60-second quiz to see which UK visa matches your situation.
              </p>
              <Link
                href="/eligibility"
                className="mt-5 inline-flex items-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] active:scale-[0.98] transition-all"
              >
                Start eligibility check <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
