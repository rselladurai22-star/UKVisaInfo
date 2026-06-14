'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  Filter, 
  Search, 
  X, 
  Home, 
  ChevronRight, 
  Plane, 
  Wallet, 
  HomeIcon, 
  Building2, 
  Gift, 
  Users, 
  Car, 
  Zap, 
  FileText,
  Briefcase,
  ShieldAlert,
  Calculator,
  TrendingUp
} from 'lucide-react';
import type { BlogPost, BlogCategory } from '../../data/blog';
import { postCategory, getCategoryMeta, BLOG_CATEGORIES } from '../../data/blog';
import BlogThumb from '../../components/blog/BlogThumb';

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

  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* Build tag → count map for popular tags cloud */
  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of sorted) {
      // If a category filter is active, only show tags within that category
      if (activeCategory && postCategory(p) !== activeCategory) continue;
      for (const t of p.tags) {
        m.set(t, (m.get(t) ?? 0) + 1);
      }
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [sorted, activeCategory]);

  /* Build category → count map */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of sorted) {
      const cat = postCategory(p);
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, [sorted]);

  const filtered = useMemo(() => {
    let list = sorted;
    if (activeCategory) {
      list = list.filter((p) => postCategory(p) === activeCategory);
    }
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
  }, [sorted, activeCategory, activeTag, searchQuery]);

  const [featured, second, ...rest] = filtered;

  return (
    <main className="bg-surface text-on-surface min-h-screen">
      {/* Page hero */}
      <section className="relative pt-[72px] sm:pt-[84px] md:pt-[96px] pb-10 md:pb-14 bg-surface border-b border-outline-variant/60 overflow-hidden">
        {/* Soft atmospheric glow elements */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-5 right-20 w-96 h-96 rounded-full bg-primary/4 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading & Search */}
            <div className="lg:col-span-7">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <span className="text-primary font-bold">Guides</span>
              </nav>

              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
                  Plain-English UK Library
                </span>
              </div>
              
              <h1 className="font-display text-[2.2rem] sm:text-[2.75rem] md:text-[3.25rem] font-bold text-on-surface tracking-[-0.025em] leading-[1.1] mb-4">
                UK visa & finance,<br className="hidden sm:block" />
                <span className="text-primary"> plain English.</span>
              </h1>
              
              <p className="text-on-surface-variant text-[1.05rem] md:text-[1.15rem] leading-relaxed mb-6 max-w-xl">
                Deep-dives on rules, thresholds and tables — updated for the 2026/27 tax year and current Home Office thresholds.
              </p>

              {/* Floating Hero Search */}
              <div className="relative max-w-xl shadow-soft rounded-xl bg-surface-container-lowest border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guides, calculators, or thresholds..."
                  className="w-full pl-12 pr-12 py-3.5 bg-transparent text-[15px] sm:text-[17px] text-on-surface outline-none placeholder:text-on-surface-variant/50"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    aria-label="Clear Search" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Quick Interactive Tools */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-low border border-outline-variant/80 rounded-2xl p-5 shadow-soft relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl -mr-6 -mt-6" />
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" /> Interactive tools
                </h3>
                <div className="space-y-1">
                  <QuickToolLink href="/tools/salary-checker" label="Skilled Worker Salary Checker" desc="Check if your salary meets the 2026 thresholds" icon={Briefcase} />
                  <QuickToolLink href="/stamp-duty-calculator" label="Stamp Duty (SDLT) Calculator" desc="Calculate stamp duty for 2025/26 home buys" icon={HomeIcon} />
                  <QuickToolLink href="/tools/refusal-analyzer" label="Visa Refusal Analyzer" desc="Analyze reasons for UK visa refusal" icon={ShieldAlert} />
                  <QuickToolLink href="/take-home-pay" label="Take-Home Pay Calculator" desc="Net salary after income tax and NI" icon={TrendingUp} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mobile-only horizontal Category filter strip */}
      <div className="lg:hidden sticky top-[56px] z-30 bg-surface/90 backdrop-blur border-y border-outline-variant/60">
        <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
          <Chip
            label="All"
            count={sorted.length}
            active={activeCategory === null && activeTag === null}
            onClick={() => {
              setActiveCategory(null);
              setActiveTag(null);
            }}
          />
          {BLOG_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            if (count === 0) return null;
            return (
              <Chip
                key={cat.id}
                label={cat.label}
                count={count}
                active={activeCategory === cat.id}
                onClick={() => {
                  setActiveCategory(cat.id === activeCategory ? null : cat.id);
                  setActiveTag(null);
                }}
                accent={cat.accent}
              />
            );
          })}
        </div>
      </div>

      {/* Main content area */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Feed Grid (Col Span 3) */}
            <div className="flex-1 w-full lg:max-w-[calc(100%-280px-2rem)]">
              
              {/* Active filters and counts */}
              <div className="text-[14px] text-on-surface-variant mb-6 flex items-center flex-wrap gap-1.5">
                <span className="font-semibold text-on-surface tabular-nums">{filtered.length}</span>
                {' '}{filtered.length === 1 ? 'article' : 'articles'}
                {activeCategory && (
                  <>
                    in <span className="font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[13px]">{getCategoryMeta(activeCategory).label}</span>
                  </>
                )}
                {activeTag && (
                  <>
                    tagged <span className="font-semibold text-on-surface bg-surface-container border border-outline-variant px-2 py-0.5 rounded text-[13px]">#{activeTag}</span>
                  </>
                )}
                {searchQuery && (
                  <>
                    matching &ldquo;<span className="font-semibold text-on-surface">&ldquo;{searchQuery}&rdquo;</span>&rdquo;
                  </>
                )}
                {(activeCategory || activeTag || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveTag(null);
                      setSearchQuery('');
                    }}
                    className="text-xs text-primary font-bold ml-2 hover:underline flex items-center gap-1"
                  >
                    Clear filters <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-12 text-center">
                  <p className="text-[15px] text-on-surface-variant">No articles match your selection.</p>
                  <button 
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveTag(null);
                      setSearchQuery('');
                    }} 
                    className="mt-4 text-sm font-bold text-primary hover:underline"
                  >
                    Reset all filters
                  </button>
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
                        className="group block relative overflow-hidden bg-surface-container-lowest border border-outline-variant rounded-xl mb-8 shadow-soft hover:shadow-md active:scale-[0.99] transition-all duration-200"
                      >
                        <span className="absolute left-0 top-0 bottom-0 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30" style={{ background: catMeta.accent }} />
                        
                        <div className="flex flex-col md:flex-row min-h-[220px]">
                          {/* Thumbnail */}
                          <div className="relative md:w-2/5 min-h-[165px] overflow-hidden flex items-center justify-center p-6">
                            <BlogThumb slug={featured.slug} category={category} accent={catMeta.accent} Icon={Icon} image={featured.image} iconSize={112} priority sizes="(max-width: 768px) 100vw, 40vw" />
                            <div className="relative z-10 px-3 py-1.5 rounded bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
                              Featured Guide
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {featured.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] font-semibold text-on-surface-variant bg-surface-container border border-outline-variant/30 px-2 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <h2 className="font-display text-on-surface text-lg md:text-[1.4rem] font-bold leading-snug group-hover:text-primary transition-colors mb-2">
                                {featured.title}
                              </h2>
                              <p className="text-on-surface-variant text-[13px] md:text-[14px] leading-relaxed line-clamp-2">
                                {featured.description}
                              </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-outline-variant/50 flex flex-col items-start gap-2 text-[13px] text-on-surface-variant/80 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-on-surface-variant" /> {formatDate(featured.date)}
                                </span>
                                <span className="flex items-center gap-1">
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

                  {/* Regular Posts Grid - adjusted to 2 columns to fit comfortably next to the sidebar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {second && (() => {
                      const category = postCategory(second);
                      const catMeta = getCategoryMeta(category);
                      const Icon = CAT_ICONS[category] || FileText;
                      return (
                        <Link
                          href={`/blog/${second.slug}`}
                          className="group flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl shadow-soft hover:shadow-md active:scale-[0.99] transition-all overflow-hidden relative"
                        >
                          <span className="absolute left-0 top-0 bottom-0 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30" style={{ background: catMeta.accent }} />
                          
                          <div className="relative h-44 w-full overflow-hidden flex items-end">
                            <BlogThumb slug={second.slug} category={category} accent={catMeta.accent} Icon={Icon} image={second.image} iconSize={96} sizes="(max-width: 768px) 100vw, 35vw" />
                            <div className="relative z-10 w-full p-4 flex justify-between items-center bg-gradient-to-t from-black/30 to-transparent">
                              <span className="px-2 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                                {catMeta.label}
                              </span>
                              <span className="text-[11px] font-bold text-white/90">
                                {second.readMinutes} min read
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col flex-1 p-5">
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {second.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-semibold text-on-surface-variant bg-surface-container border border-outline-variant/30 px-2 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="font-display text-on-surface text-[16px] md:text-[18px] font-bold leading-snug flex-1 group-hover:text-primary transition-colors">
                              {second.title}
                            </h3>
                            <p className="mt-2 text-on-surface-variant text-[13px] leading-relaxed line-clamp-3">
                              {second.description}
                            </p>
                            <div className="mt-5 pt-3 border-t border-outline-variant/50 flex items-center justify-between text-[13px] text-on-surface-variant/80">
                              <span className="flex items-center gap-1">
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
                          className="group flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-soft hover:shadow-md active:scale-[0.99] transition-all duration-200 relative"
                        >
                          <span className="absolute left-0 top-0 bottom-0 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20" style={{ background: catMeta.accent }} />
                          
                          <div className="relative h-36 w-full overflow-hidden flex items-end">
                            <BlogThumb slug={post.slug} category={category} accent={catMeta.accent} Icon={Icon} image={post.image} iconSize={68} sizes="(max-width: 768px) 100vw, 25vw" />
                            <div className="relative z-10 w-full p-3 flex justify-between items-center bg-gradient-to-t from-black/30 to-transparent">
                              <span className="px-2 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
                                {catMeta.label}
                              </span>
                              <span className="text-[10px] font-bold text-white/90">
                                {post.readMinutes} min read
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col flex-1 p-4">
                            <div className="flex flex-wrap gap-1.5 mb-2.5">
                              {post.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-semibold text-on-surface-variant bg-surface-container border border-outline-variant/30 px-2 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <h3 className="font-display text-[15px] md:text-[16px] font-bold text-on-surface leading-snug flex-1 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>

                            <p className="mt-2 text-[12.5px] text-on-surface-variant leading-relaxed line-clamp-2">
                              {post.description}
                            </p>

                            <div className="mt-4 pt-3 border-t border-outline-variant/50 flex items-center justify-between text-[12px]">
                              <span className="flex items-center gap-1 text-on-surface-variant/80">
                                <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                                <span>{formatDate(post.date)}</span>
                              </span>
                              <span className="inline-flex items-center gap-1 font-bold text-primary">
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

            {/* Right Column: Sticky Sidebar on Desktop (Col Span 1) */}
            <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[100px] space-y-6">
              
              {/* Category Directory */}
              <div className="bg-surface-container-low border border-outline-variant/80 rounded-xl p-4 shadow-soft">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-primary" /> Filter by Category
                </h3>
                <div className="space-y-1">
                  <SidebarCategoryButton
                    label="All Categories"
                    count={sorted.length}
                    active={activeCategory === null}
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveTag(null);
                    }}
                    icon={FileText}
                    accent="var(--color-primary, #0037b0)"
                  />
                  {BLOG_CATEGORIES.map((cat) => {
                    const count = categoryCounts[cat.id] ?? 0;
                    if (count === 0) return null;
                    const Icon = CAT_ICONS[cat.id] || FileText;
                    return (
                      <SidebarCategoryButton
                        key={cat.id}
                        label={cat.label}
                        count={count}
                        active={activeCategory === cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id === activeCategory ? null : cat.id);
                          setActiveTag(null);
                        }}
                        icon={Icon}
                        accent={cat.accent}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Popular Tags cloud */}
              {tagCounts.length > 0 && (
                <div className="bg-surface-container-low border border-outline-variant/80 rounded-xl p-4 shadow-soft">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                    Popular Topics
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {tagCounts.slice(0, 15).map(([tag, count]) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setActiveTag(tag === activeTag ? null : tag);
                          setActiveCategory(null);
                        }}
                        className={`text-[12px] px-2.5 py-1 rounded-lg border transition-all ${
                          activeTag === tag
                            ? 'bg-primary text-white border-transparent shadow-soft'
                            : 'bg-surface text-on-surface-variant border-outline-variant hover:border-primary/50'
                        }`}
                      >
                        #{tag} <span className="opacity-60 text-[10px]">({count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter conversion box */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 shadow-soft relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-xl -mr-6 -mt-6" />
                <h3 className="text-[14px] font-bold text-on-surface mb-1 flex items-center gap-1.5">
                  Get visa & tax alerts
                </h3>
                <p className="text-[12px] text-on-surface-variant leading-relaxed mb-4">
                  Join 12,000+ subscribers receiving plain-English UK rule updates.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 text-[13px] rounded-lg border border-outline-variant bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button className="w-full py-2 bg-primary text-white text-[13px] font-bold rounded-lg hover:bg-primary/95 transition-colors shadow-soft">
                    Subscribe
                  </button>
                </div>
              </div>

            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}

function Chip({ active, onClick, label, count, accent }: { active: boolean; onClick: () => void; label: string; count?: number; accent?: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-all duration-150 ${
        active ? 'text-white border-transparent shadow-soft' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary/50'
      }`}
      style={active ? { background: accent ?? 'var(--color-primary, #0037b0)' } : undefined}
    >
      {label}{count != null && <span className={active ? 'opacity-80' : 'opacity-60'}> · {count}</span>}
    </button>
  );
}

function SidebarCategoryButton({
  active,
  onClick,
  label,
  count,
  icon: Icon,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon: any;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-semibold transition-all group ${
        active
          ? 'text-white shadow-soft'
          : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
      }`}
      style={active ? { backgroundColor: accent } : undefined}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`p-1.5 rounded-lg border transition-colors ${
          active 
            ? 'bg-white/15 border-white/20 text-white' 
            : 'bg-surface border-outline-variant/60 text-on-surface-variant group-hover:text-primary group-hover:border-primary/30'
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="truncate">{label}</span>
      </div>
      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
        active
          ? 'bg-white/20 text-white'
          : 'bg-surface-container-high text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'
      }`}>
        {count}
      </span>
    </button>
  );
}

function QuickToolLink({ href, label, desc, icon: Icon }: { href: string; label: string; desc: string; icon: any }) {
  return (
    <Link href={href} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container transition-colors group">
      <div className="p-2 rounded-lg bg-surface border border-outline-variant/60 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
          {label}
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="text-[12px] text-on-surface-variant line-clamp-1">{desc}</div>
      </div>
    </Link>
  );
}
