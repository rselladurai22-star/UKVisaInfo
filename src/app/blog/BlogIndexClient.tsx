'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowUpRight, Filter, Search, X, Home, ChevronRight, Plane, Wallet, HomeIcon, Building2, Gift, Users, Car, Zap, FileText } from 'lucide-react';
import type { BlogPost } from '../../data/blog';
import { postCategory, getCategoryMeta } from '../../data/blog';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const CAT_ICONS: Record<string, any> = {
  visa: Plane,
  money: Wallet,
  property: HomeIcon,
  business: Building2,
  benefits: Gift,
  family: Users,
  motoring: Car,
  energy: Zap,
  estate: FileText,
};

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts]);

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* Build tag → count map, sorted by frequency */
  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of sorted) for (const t of p.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [sorted]);

  const filtered = useMemo(() => {
    let list = sorted;
    if (activeTag) {
      list = list.filter((p) => p.tags.includes(activeTag));
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [sorted, activeTag, searchQuery]);

  const [featured, second, ...rest] = filtered;

  return (
    <main className="bg-surface text-on-surface min-h-screen">
      {/* Page hero */}
      <section className="pt-[88px] md:pt-[104px] pb-10 md:pb-14 bg-surface border-b border-outline-variant/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
            <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-primary font-bold">Guides</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Guides & Analysis
            </span>
          </div>
          <h1 className="font-display text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] font-bold text-on-surface tracking-[-0.025em] leading-[1.1]">
            UK visa guides,<br className="hidden sm:block" />
            <span className="text-primary"> plain English.</span>
          </h1>
          <p className="mt-4 max-w-xl text-on-surface-variant text-[1rem] md:text-[1.0625rem] leading-relaxed">
            Deep dives on the rules behind your application — updated for 2026 thresholds, fees and processing times.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides…"
              className="w-full pl-12 pr-12 py-3 sm:py-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm sm:text-base shadow-soft focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"><X className="h-4 w-4" /></button>
            )}
          </div>
        </div>
      </section>

      {/* Tag filter strip */}
      <div className="sticky top-[60px] md:top-[64px] z-30 bg-surface/90 backdrop-blur border-y border-outline-variant/60">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-on-surface-variant flex-shrink-0 ml-2" />
          <Chip
            label="All"
            count={sorted.length}
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tagCounts.map(([tag, count]) => (
            <Chip
              key={tag}
              label={tag}
              count={count}
              active={activeTag === tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            />
          ))}
        </div>
      </div>

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[12.5px] text-on-surface-variant mb-7">
            <span className="font-semibold text-on-surface tabular-nums">{filtered.length}</span>
            {' '}{filtered.length === 1 ? 'article' : 'articles'}
            {activeTag && (
              <>
                {' '}tagged <span className="font-semibold text-on-surface">{activeTag}</span>
              </>
            )}
            {searchQuery && (
              <>
                {' '}matching &ldquo;<span className="font-semibold text-on-surface">{searchQuery}</span>&rdquo;
              </>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-lowest p-12 text-center">
              <p className="text-[14px] text-on-surface-variant">No articles match this criteria.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (() => {
                const category = postCategory(featured);
                const catMeta = getCategoryMeta(category);
                const Icon = CAT_ICONS[category] || FileText;
                return (
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group block relative overflow-hidden bg-surface-container-lowest border border-outline-variant rounded-lg mb-10 shadow-soft hover:shadow-md active:scale-[0.99] transition-all duration-200"
                  >
                    {/* Left highlight border on hover */}
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30" style={{ background: catMeta.accent }} />
                    
                    <div className="flex flex-col md:flex-row min-h-[220px]">
                      {/* Thumbnail banner */}
                      <div className="relative md:w-2/5 min-h-[160px] overflow-hidden flex items-center justify-center p-6">
                        <div 
                          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105 z-0"
                          style={{ background: `linear-gradient(135deg, ${catMeta.accent} 0%, ${catMeta.accent}dd 100%)` }}
                        >
                          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '15px 15px' }} />
                          <Icon className="absolute -right-4 -bottom-4 h-28 w-28 opacity-15 transform rotate-12 text-white pointer-events-none transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                        </div>
                        <div className="relative z-10 px-3 py-1.5 rounded bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                          Featured Guide
                        </div>
                      </div>
                      
                      {/* Content details */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between pl-6 md:pl-8">
                        <div>
                          <div className="flex flex-wrap gap-2 mb-3.5">
                            {featured.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] font-semibold text-on-surface-variant bg-surface-container border border-outline-variant/30 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h2 className="font-display text-on-surface text-lg md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors mb-2.5">
                            {featured.title}
                          </h2>
                          <p className="mt-2 text-on-surface-variant text-xs md:text-sm leading-relaxed line-clamp-2">
                            {featured.description}
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-outline-variant/50 flex items-center justify-between text-xs text-on-surface-variant/80">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-on-surface-variant" /> {formatDate(featured.date)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-on-surface-variant" /> {featured.readMinutes} min read
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 font-bold text-primary">
                            Read article
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {second && (() => {
                  const category = postCategory(second);
                  const catMeta = getCategoryMeta(category);
                  const Icon = CAT_ICONS[category] || FileText;
                  return (
                    <Link
                      href={`/blog/${second.slug}`}
                      className="group md:row-span-2 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-lg shadow-soft hover:shadow-md active:scale-[0.99] transition-all overflow-hidden relative"
                    >
                      {/* Left highlight border on hover */}
                      <span className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity z-30" style={{ background: catMeta.accent }} />
                      
                      {/* Thumbnail banner — category-coloured, no external image */}
                      <div className="relative h-36 md:h-40 w-full overflow-hidden flex items-end">
                        <div 
                          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105 z-0"
                          style={{ background: `linear-gradient(135deg, ${catMeta.accent} 0%, ${catMeta.accent}dd 100%)` }}
                        >
                          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '15px 15px' }} />
                          <Icon className="absolute -right-4 -bottom-4 h-24 w-24 opacity-15 transform rotate-12 text-white pointer-events-none transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                        </div>
                        
                        {/* Tags overlays */}
                        <div className="relative z-10 w-full p-4 flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
                          <span className="px-2 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
                            {catMeta.label}
                          </span>
                          <span className="text-[10px] font-bold text-white/90">
                            {second.readMinutes} min
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10 flex flex-col flex-1 p-5 md:p-6 pl-6">
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {second.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-semibold text-on-surface-variant bg-surface-container border border-outline-variant/30 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display text-on-surface text-base md:text-lg font-bold leading-snug flex-1 group-hover:text-primary transition-colors">
                          {second.title}
                        </h3>
                        <p className="mt-3 text-on-surface-variant text-xs leading-relaxed line-clamp-4">
                          {second.description}
                        </p>
                        <div className="mt-6 pt-4 border-t border-outline-variant/50 flex items-center justify-between text-xs text-on-surface-variant/80">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-on-surface-variant" /> {formatDate(second.date)}
                          </span>
                          <span className="inline-flex items-center gap-1 font-bold text-primary">
                            Read <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })()}

                {rest.map((post) => {
                  const category = postCategory(post);
                  const catMeta = getCategoryMeta(category);
                  const Icon = CAT_ICONS[category] || FileText;
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-soft hover:shadow-md active:scale-[0.99] transition-all duration-200 relative"
                    >
                      {/* Left highlight border on hover */}
                      <span className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity z-20" style={{ background: catMeta.accent }} />
                      
                      {/* Thumbnail banner — category-coloured, no external image */}
                      <div className="relative h-28 w-full overflow-hidden flex items-end">
                        {/* Zoom wrapper */}
                        <div 
                          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105 z-0"
                          style={{ background: `linear-gradient(135deg, ${catMeta.accent} 0%, ${catMeta.accent}dd 100%)` }}
                        >
                          {/* Dot pattern */}
                          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                          {/* Large category icon */}
                          <Icon className="absolute -right-3 -bottom-3 h-16 w-16 opacity-15 transform rotate-12 text-white pointer-events-none transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                        </div>

                        {/* Tags overlays */}
                        <div className="relative z-10 w-full p-3 flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
                          <span className="px-2 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/20 text-white text-[8px] font-bold uppercase tracking-wider">
                            {catMeta.label}
                          </span>
                          <span className="text-[9px] font-bold text-white/90">
                            {post.readMinutes} min
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 p-4">
                        {/* tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-semibold text-on-surface-variant bg-surface-container border border-outline-variant/30 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* title */}
                        <h3 className="font-display text-[14px] md:text-[15px] font-bold text-on-surface leading-snug flex-1 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        {/* description */}
                        <p className="mt-2 text-[11px] sm:text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                          {post.description}
                        </p>

                        {/* footer */}
                        <div className="mt-4 pt-3 border-t border-outline-variant/50 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/80">
                            <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                            <span>{formatDate(post.date)}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                            Read
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function Chip({ active, onClick, label, count, accent }: { active: boolean; onClick: () => void; label: string; count?: number; accent?: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active ? 'text-white border-transparent' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary/50'
      }`}
      style={active ? { background: accent ?? 'var(--color-primary, #0037b0)' } : undefined}
    >
      {label}{count != null && <span className={active ? 'opacity-80' : 'opacity-60'}> · {count}</span>}
    </button>
  );
}

