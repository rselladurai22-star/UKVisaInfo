'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowUpRight, Filter } from 'lucide-react';
import type { BlogPost } from '../../data/blog';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'Skilled Worker': { bg: 'rgba(0, 196, 180,0.08)',  text: '#00C4B4' },
  'Student':        { bg: 'rgba(10, 37, 64,0.08)',  text: '#0A2540' },
  'Family':         { bg: 'rgba(19, 50, 95,0.08)', text: '#13325F' },
  'Visitor':        { bg: 'rgba(0, 196, 180,0.08)',  text: '#00C4B4' },
  'Costs':          { bg: 'rgba(201, 161, 74,0.08)',  text: '#C9A14A' },
  'Health':         { bg: 'rgba(0, 168, 154,0.08)',  text: '#00A89A' },
  'Graduate':       { bg: 'rgba(0, 127, 118,0.08)', text: '#007F76' },
};
const tagStyle = (tag: string) => TAG_COLORS[tag] ?? { bg: 'rgba(14,20,36,0.06)', text: '#52596e' };

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  /* Build tag → count map, sorted by frequency */
  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of sorted) for (const t of p.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [sorted]);

  const filtered = useMemo(() => {
    if (!activeTag) return sorted;
    return sorted.filter((p) => p.tags.includes(activeTag));
  }, [sorted, activeTag]);

  const [featured, second, ...rest] = filtered;

  return (
    <div className="bg-white">
      {/* Page hero */}
      <section className="pt-[88px] md:pt-[104px] pb-10 md:pb-12 hero-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#00C4B4]">
            Blog & Guides
          </span>
          <h1 className="mt-2 font-display text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold text-[#0A2540] tracking-tight leading-tight">
            Long-form UK visa guides
          </h1>
          <p className="mt-3 max-w-2xl text-[#52596e] text-base md:text-lg leading-relaxed">
            Plain-English deep dives on the rules behind your application — updated for
            2026 thresholds, fees and processing times.
          </p>
        </div>
      </section>

      {/* Tag filter strip */}
      <div className="sticky top-[60px] md:top-[64px] z-30 bg-white/95 backdrop-blur border-y border-[rgba(14,20,36,0.06)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-[#52596e] flex-shrink-0 ml-2" />
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
              accent={tagStyle(tag).text}
            />
          ))}
        </div>
      </div>

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[12.5px] text-[#7a8195] mb-7">
            <span className="font-semibold text-[#0A2540] tabular-nums">{filtered.length}</span>
            {' '}{filtered.length === 1 ? 'article' : 'articles'}
            {activeTag && (
              <>
                {' '}tagged <span className="font-semibold text-[#0A2540]">{activeTag}</span>
              </>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[rgba(14,20,36,0.12)] p-12 text-center">
              <p className="text-[14px] text-[#7a8195]">No articles match this tag yet.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group block relative overflow-hidden hero-dark rounded-2xl md:rounded-3xl p-8 md:p-12 mb-10 md:mb-14 shadow-card"
                >
                  <div className="dot-pattern absolute inset-0 opacity-40" aria-hidden="true" />
                  <div className="relative z-10 max-w-3xl">
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#C9A14A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A14A]" />
                        Latest article
                      </span>
                      {featured.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-display text-white text-[1.375rem] md:text-[2rem] font-bold leading-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-white/55 text-sm md:text-base leading-relaxed line-clamp-2">
                      {featured.description}
                    </p>
                    <div className="mt-6 flex items-center gap-5 text-xs text-white/45">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(featured.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {featured.readMinutes} min read
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1.5 text-[#C9A14A] font-semibold">
                        Read article
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {second && (
                  <Link
                    href={`/blog/${second.slug}`}
                    className="group md:row-span-2 flex flex-col bg-[#0A2540] rounded-2xl p-7 shadow-card hover:-translate-y-1 transition-all overflow-hidden relative"
                  >
                    <div className="dot-pattern absolute inset-0 opacity-25" aria-hidden="true" />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {second.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-display text-white text-[1.125rem] md:text-[1.25rem] font-bold leading-snug flex-1">
                        {second.title}
                      </h3>
                      <p className="mt-3 text-white/45 text-sm leading-relaxed line-clamp-3">
                        {second.description}
                      </p>
                      <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/35">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {second.readMinutes} min read
                        </span>
                        <span className="inline-flex items-center gap-1 text-white/60 font-semibold group-hover:text-white transition-colors">
                          Read <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-6 md:p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
                  >
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 2).map((tag) => {
                        const s = tagStyle(tag);
                        return (
                          <span
                            key={tag}
                            className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
                            style={{ background: s.bg, color: s.text }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                    <h3 className="font-display text-[1rem] md:text-[1.0625rem] font-bold text-[#0A2540] leading-snug flex-1 group-hover:text-[#00C4B4] transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#52596e] leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-5 pt-4 border-t border-[rgba(14,20,36,0.07)] flex items-center justify-between text-xs text-[#52596e]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {post.readMinutes} min read
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#00C4B4] font-semibold">
                        Read <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function Chip({
  label, count, active, onClick, accent,
}: {
  label: string; count: number; active: boolean; onClick: () => void; accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap
        transition-colors duration-75 flex-shrink-0
        ${active
          ? 'bg-[#0A2540] text-white'
          : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#e6eaf5] hover:text-[#0A2540]'}
      `}
    >
      {!active && accent && <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />}
      {label}
      <span className={`tabular-nums text-[11px] ${active ? 'text-white/55' : 'text-[#9aa3b8]'}`}>{count}</span>
    </button>
  );
}
