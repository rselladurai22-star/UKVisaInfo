import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, ArrowRight, ChevronRight, Home, BadgeCheck,
} from 'lucide-react';
import type {
  BlogPost, BlogCategory, BlogCategoryMeta, RelatedTool,
} from '../../data/blog';
import { PRIMARY_EDITOR } from '../../data/editorialTeam';
import { extractH2Headings } from './slug';
import BlogSidebar from './BlogSidebar';
import ArticleBody from './ArticleBody';
import ShareRail from './ShareRail';
import Comments from './Comments';
import AdUnit from '../AdUnit';
import StickyMobileCta from '../StickyMobileCta';

/** The category-aware end-of-article CTA card content. */
export interface BlogCta {
  kicker: string;
  heading: string;
  sub: string;
  href: string;
  label: string;
}

interface BlogShellProps {
  post: BlogPost;
  category: BlogCategory;
  catMeta: BlogCategoryMeta;
  cta: BlogCta;
  relatedTools: RelatedTool[];

  /**
   * Main-column body. Standard markdown posts leave this undefined and get the
   * default chrome (share rail → ArticleBody → ads → tags → comments).
   * Bespoke posts (e.g. flagship) pass their own JSX here.
   */
  children?: ReactNode;

  // ── Hero overrides (bespoke posts) ───────────────────────────
  /** Last breadcrumb crumb. Default: "read". */
  breadcrumbLabel?: string;
  /** Hero <h1> content. Default: post.title. */
  title?: ReactNode;
  /** Trust badge text. Default derived from category. */
  verifiedLabel?: string;
  /** Hero subtitle. Default: post.description. */
  description?: ReactNode;
  /** Decorative aurora layer behind the hero (flagship). */
  heroAurora?: boolean;

  // ── Slots & toggles ─────────────────────────────────────────
  /** Rendered first inside <article>, islands, ToC rail, scroped styles. */
  topSlot?: ReactNode;
  /** Show the top share rail above the body. Default: true. */
  showShareRail?: boolean;
  /** Render the standard bottom category-CTA card. Default: true. */
  showBottomCta?: boolean;
  /** Render the dark sticky mobile CTA bar. Default: true. */
  showStickyMobileCta?: boolean;
}

export default function BlogShell({
  post, category, catMeta, cta, relatedTools, children,
  breadcrumbLabel = 'read',
  title,
  verifiedLabel,
  description,
  heroAurora = false,
  topSlot,
  showShareRail = true,
  showBottomCta = true,
  showStickyMobileCta = true,
}: BlogShellProps) {
  const dateLabel = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const updatedDays = Math.floor(
    (Date.now() - new Date(post.updated).getTime()) / (1000 * 60 * 60 * 24)
  );
  const isFresh = updatedDays <= 30;
  const trust = verifiedLabel ?? (category === 'visa' ? 'gov.uk-sourced' : 'HMRC-verified · 2025/26');
  // Auto ToC from markdown H2s, only for the default (markdown) body.
  // Bespoke posts (children) render their own heading structure / ToC rail.
  const headings = children ? [] : extractH2Headings(post.body);

  return (
    <>
      <article className="min-h-screen bg-white text-slate-900 antialiased">
        {topSlot}

        {/* ───────── HERO ───────── */}
        <header className="relative border-b border-slate-200 bg-white">
          <div aria-hidden className="cs-canvas pointer-events-none absolute inset-0" />
          {heroAurora && (
            <div aria-hidden className="fa-aurora pointer-events-none absolute inset-0 overflow-hidden" />
          )}
          <div className="relative mx-auto w-full max-w-5xl px-5 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
            <div className="lg:grid lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-8">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-mono text-[12px] text-slate-400">
                  <Link href="/" className="inline-flex items-center gap-1 hover:text-blue-700"><Home className="h-3.5 w-3.5" /> home</Link>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  <Link href="/blog" className="hover:text-blue-700">guides</Link>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  <span className="text-slate-600">{breadcrumbLabel}</span>
                </nav>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link href={`/blog?category=${category}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white hover:opacity-90 transition-opacity" style={{ background: catMeta.accent }}>
                    {catMeta.label}
                  </Link>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> {trust}
                  </span>
                  {isFresh && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      Updated
                    </span>
                  )}
                </div>

                <h1 className="mt-5 font-display text-[clamp(28px,5.2vw,44px)] font-extrabold leading-[1.06] tracking-[-0.035em] text-slate-900 [text-wrap:balance]">
                  {title ?? post.title}
                </h1>

                <p className="mt-4 text-[17px] leading-relaxed text-slate-600">
                  {description ?? post.description}
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

        {/* ───────── BODY: article + sticky right sidebar ───────── */}
        <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-6">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">

            {/* MAIN COLUMN */}
            <div className="min-w-0 lg:col-span-8">
              {showShareRail && (
                <div className="mb-8 border-b border-slate-200 pb-5">
                  <ShareRail title={post.title} />
                </div>
              )}

              {children ?? <DefaultArticleChrome post={post} />}

              {showBottomCta && (
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
              )}
            </div>

            {/* RIGHT SIDEBAR, sticky on desktop, stacks below on mobile */}
            <BlogSidebar post={post} relatedTools={relatedTools} headings={headings} />
          </div>
        </div>
      </article>

      {showStickyMobileCta && (
        <StickyMobileCta
          context={category === 'visa' ? 'Find your route' : catMeta.label}
          label={cta.label}
          href={cta.href}
        />
      )}
    </>
  );
}

/** Default body for standard markdown posts: ArticleBody + ads + tags + comments. */
function DefaultArticleChrome({ post }: { post: BlogPost }) {
  return (
    <>
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
    </>
  );
}
