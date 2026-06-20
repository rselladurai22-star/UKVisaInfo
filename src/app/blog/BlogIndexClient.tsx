'use client';

/**
 * Blog index — "Clean Slate" editorial library (rebuilt from scratch).
 * Ultra-modern: a compact editorial hero with command search, a sticky
 * accent-coded category bar, one cinematic featured story, then a responsive
 * card grid with real thumbnails and per-category cool accents. Closes on a
 * full-width gradient newsletter band.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Calendar, Clock, Search, X,
  Plane, Wallet, HomeIcon, Building2, Gift, Users, Car, Zap, FileText,
} from 'lucide-react';
import type { BlogPost, BlogCategory } from '../../data/blog';
import { postCategory, getCategoryMeta, BLOG_CATEGORIES } from '../../data/blog';
import BlogThumb from '../../components/blog/BlogThumb';
import { tint } from '../../data/areaAccents';

const CAT_ICONS: Record<string, any> = {
  visa: Plane, money: Wallet, property: HomeIcon, business: Building2,
  benefits: Gift, family: Users, motoring: Car, energy: Zap, estate: FileText,
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts]);
  const [cat, setCat] = useState<BlogCategory | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of sorted) { const c = postCategory(p); m[c] = (m[c] ?? 0) + 1; }
    return m;
  }, [sorted]);

  const filtered = useMemo(() => {
    let list = sorted;
    if (cat) list = list.filter((p) => postCategory(p) === cat);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    const s = q.trim().toLowerCase();
    if (s) list = list.filter(
      (p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.tags.some((t) => t.toLowerCase().includes(s))
    );
    return list;
  }, [sorted, cat, tag, q]);

  const active = !!(cat || tag || q.trim());
  const reset = () => { setCat(null); setTag(null); setQ(''); };
  const [featured, ...rest] = filtered;

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      {/* ───────── HERO ───────── */}
      <header className="relative border-b border-slate-200 bg-white">
        <div aria-hidden className="cs-canvas pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16">
          <p className="cs-rise font-mono text-[12px] text-slate-400" style={{ ['--i' as string]: 0 }}>
            <Link href="/" className="hover:text-blue-700">ukdesk</Link> <span className="text-slate-300">/</span> guides
          </p>
          <div className="mt-3 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="cs-rise inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700" style={{ ['--i' as string]: 1 }}>
                <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" /></span>
                Plain-English UK library
              </span>
              <h1 className="cs-rise mt-4 font-display text-[clamp(34px,6vw,56px)] font-extrabold leading-[1.0] tracking-[-0.04em] text-slate-900 [text-wrap:balance]" style={{ ['--i' as string]: 2 }}>
                The UK rulebook, <span className="ink-cs">without the jargon.</span>
              </h1>
              <p className="cs-rise mt-4 max-w-xl text-[16px] leading-relaxed text-slate-600 sm:text-[17px]" style={{ ['--i' as string]: 3 }}>
                Clear, no-nonsense guides to the money and visa thresholds, fees and tables that actually affect you — updated for the 2026/27 tax year and the latest Home Office rules.
              </p>
            </div>
            <div className="cs-rise w-full max-w-md lg:w-80" style={{ ['--i' as string]: 3 }}>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-cs ring-1 ring-slate-900/[0.06] transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:shadow-[0_0_0_5px_rgba(37,99,235,0.12)]">
                <Search className="h-[18px] w-[18px] flex-none text-slate-400" strokeWidth={2.2} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search guides…"
                  className="w-full min-w-0 border-none bg-transparent text-[16px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {q && (
                  <button onClick={() => setQ('')} aria-label="Clear" className="flex-none rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-2.5 text-right font-mono text-[11px] text-slate-400 tabular-nums">{sorted.length} articles · updated weekly</p>
            </div>
          </div>
        </div>
      </header>

      {/* ───────── STICKY CATEGORY BAR ───────── */}
      <div className="glass-cs sticky top-[60px] z-20 border-b border-slate-200/80">
        <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-5 py-2.5 no-scrollbar [mask-image:linear-gradient(to_right,transparent_0,#000_3%,#000_94%,transparent_100%)] sm:px-8 lg:flex-wrap lg:overflow-visible lg:[mask-image:none]">
          <CatPill label="All" count={sorted.length} active={!cat && !tag} onClick={reset} />
          {BLOG_CATEGORIES.map((c) => {
            const n = categoryCounts[c.id] ?? 0;
            if (!n) return null;
            return (
              <CatPill
                key={c.id}
                label={c.label}
                count={n}
                accent={c.accent}
                active={cat === c.id}
                onClick={() => { setCat(cat === c.id ? null : c.id); setTag(null); }}
              />
            );
          })}
        </div>
      </div>

      {/* ───────── FEED ───────── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {/* meta row */}
        <div className="mb-6 flex items-center gap-2 font-mono text-[12px] text-slate-400 tabular-nums">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          {tag && <span className="rounded-md bg-slate-100 px-2 py-0.5 font-sans text-[11px] font-bold text-slate-600">#{tag}</span>}
          {active && (
            <button onClick={reset} className="ml-1 inline-flex items-center gap-1 font-sans font-bold text-blue-700 hover:underline">
              clear <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <p className="text-[15px] font-semibold text-slate-500">No guides match your selection.</p>
            <button onClick={reset} className="mt-3 text-[15px] font-bold text-blue-700 underline">Reset everything</button>
          </div>
        ) : (
          <>
            {featured && <FeaturedCard post={featured} onTag={(t) => { setTag(t); setCat(null); }} />}

            {rest.length > 0 && (
              <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <PostCard key={p.slug} post={p} onTag={(t) => { setTag(t); setCat(null); }} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ───────── NEWSLETTER BAND ───────── */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 px-6 py-10 sm:px-12 sm:py-12">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative sm:flex sm:items-center sm:justify-between sm:gap-10">
              <div className="max-w-md">
                <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-[28px]">
                  Get UK rule changes in plain English.
                </h2>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-300">
                  Join 12,000+ readers. Visa fee updates, HMRC thresholds and tax-year changes — no spam, unsubscribe anytime.
                </p>
              </div>
              <form className="mt-6 flex w-full max-w-sm gap-2 sm:mt-0" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="min-w-0 flex-1 rounded-xl border-0 bg-white/10 px-4 py-3 text-[15px] text-white ring-1 ring-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="flex-none rounded-xl bg-white px-5 py-3 text-[14px] font-bold text-slate-900 transition-transform hover:-translate-y-0.5">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ───────── pieces ───────── */

function CatPill({ label, count, active, accent, onClick }: { label: string; count: number; active: boolean; accent?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex flex-none items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-150',
        active ? 'border-transparent text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
      ].join(' ')}
      style={active ? { background: accent ?? '#2563eb' } : undefined}
    >
      {accent && <span className="h-1.5 w-1.5 rounded-full" style={{ background: active ? '#fff' : accent }} />}
      {label}
      <span className={active ? 'font-mono text-[11px] opacity-80' : 'font-mono text-[11px] text-slate-400'}>{count}</span>
    </button>
  );
}

function FeaturedCard({ post, onTag }: { post: BlogPost; onTag: (t: string) => void }) {
  const category = postCategory(post);
  const meta = getCategoryMeta(category);
  const Icon = CAT_ICONS[category] || FileText;
  const c = meta.accent;
  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-white shadow-cs transition-all duration-300 hover:-translate-y-1"
      style={{ ['--c' as string]: c }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px]" style={{ background: `linear-gradient(90deg, ${c}, ${tint(c, 0.4)})` }} />
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
        <div className="relative min-h-[220px] overflow-hidden md:min-h-[340px]">
          <BlogThumb slug={post.slug} category={category} accent={c} Icon={Icon} image={post.image} iconSize={120} priority sizes="(max-width: 768px) 100vw, 50vw" />
          <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm" style={{ background: c }}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/90" /> Featured
          </span>
        </div>
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: c }}>{meta.label}</span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-[11.5px] text-slate-400">{post.readMinutes} min read</span>
            </div>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="font-display text-[clamp(22px,3vw,30px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900 transition-colors group-hover:text-[var(--c)]">
                {post.title}
              </h2>
            </Link>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-600 line-clamp-3">{post.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((t) => (
                <button key={t} onClick={() => onTag(t)} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700">
                  #{t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-slate-400">
              <Calendar className="h-3.5 w-3.5" /> {fmt(post.date)}
            </span>
            <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-[13px] font-bold transition-[gap] hover:gap-2.5" style={{ color: c }}>
              Read guide <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function PostCard({ post, onTag }: { post: BlogPost; onTag: (t: string) => void }) {
  const category = postCategory(post);
  const meta = getCategoryMeta(category);
  const Icon = CAT_ICONS[category] || FileText;
  const c = meta.accent;
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-cs transition-all duration-300 hover:-translate-y-1.5"
      style={{ ['--c' as string]: c }}
    >
      <Link href={`/blog/${post.slug}`} className="relative block h-44 overflow-hidden">
        <BlogThumb slug={post.slug} category={category} accent={c} Icon={Icon} image={post.image} iconSize={80} sizes="(max-width: 768px) 100vw, 33vw" />
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm" style={{ background: c }}>
          {meta.label}
        </span>
        <span className="absolute bottom-3 right-3 z-10 rounded-md bg-black/35 px-2 py-0.5 font-mono text-[10.5px] font-bold text-white backdrop-blur-sm">
          {post.readMinutes} min
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/blog/${post.slug}`} className="flex-1">
          <h3 className="font-display text-[17px] font-bold leading-snug tracking-[-0.01em] text-slate-900 transition-colors group-hover:text-[var(--c)]">
            {post.title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-500 line-clamp-2">{post.description}</p>
        </Link>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-slate-400">
            <Clock className="h-3.5 w-3.5" /> {fmt(post.date)}
          </span>
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-[12.5px] font-bold transition-[gap] hover:gap-2" style={{ color: c }}>
            Read <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
