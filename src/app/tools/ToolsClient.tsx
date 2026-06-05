'use client';

/**
 * /tools — Tool directory (June 2026 bento redesign)
 * Compact hero + search + trending chips · bento grid of category cards.
 * Client component for instant filtering across all tools.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Search, ShieldCheck, X } from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../data/tools';
import { VISA_TOOLS } from '../../lib/categoryMeta';

type Tile = {
  href: string;
  label: string;
  category: CategoryId;
};

const ALL: Tile[] = [
  ...APP_TILES.map((t) => ({ href: t.href, label: t.label, category: t.category })),
  ...VISA_TOOLS.map((v) => ({ href: v.href, label: v.title, category: 'immigration' as CategoryId })),
];

const TRENDING = ['Mortgage', 'ISA', 'Skilled Worker', 'Stamp Duty'];
const PER_CARD = 6;

function hexToRgba(hex: string, a: number) {
  const m = hex.replace('#', '');
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(v, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export default function ToolsIndex() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const all = ALL.filter((t) => t.category === cat.id);
      const items = q
        ? all.filter((t) => t.label.toLowerCase().includes(q) || cat.label.toLowerCase().includes(q))
        : all;
      return { cat, items, total: all.length };
    }).filter((g) => g.items.length > 0);
  }, [q]);

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      {/* ─── Compact hero ─── */}
      <section className="bg-surface-container px-4 pt-10 pb-14 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center justify-center gap-1.5 text-xs font-medium text-on-surface-variant">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-primary">All tools</span>
          </nav>

          <h1 className="font-display text-[clamp(30px,4vw+12px,48px)] font-bold leading-tight tracking-tight text-on-surface">
            All Calculators &amp; Tools
          </h1>
          <p className="mt-3 text-[clamp(16px,0.6vw+14px,19px)] text-on-surface-variant">
            Accurate results for money, property and visas — verified against official sources.
          </p>

          {/* Search */}
          <div className="group relative mx-auto mt-7 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${ALL.length}+ verified calculators…`}
              autoComplete="off"
              autoFocus
              className="block w-full rounded-xl border-none bg-surface-container-lowest py-4 pl-[52px] pr-12 text-base shadow-sm transition-all placeholder:text-outline focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition hover:text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center rounded border border-outline-variant px-1.5 text-[11px] font-semibold text-outline sm:inline-flex">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Trending chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Trending:</span>
            {TRENDING.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full bg-surface-container-high px-3.5 py-1 text-sm font-medium text-on-surface transition-colors hover:bg-primary-container hover:text-surface"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Directory bento grid ─── */}
      <section className="px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-[1400px]">
          {grouped.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest px-8 py-20 text-center">
              <p className="text-base font-semibold text-on-surface">No tools match “{query}”.</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 text-sm font-semibold text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {grouped.map(({ cat, items, total }) => {
                const Icon = cat.icon;
                const shown = q ? items : items.slice(0, PER_CARD);
                const more = total - shown.length;
                return (
                  <div
                    key={cat.id}
                    className="flex flex-col rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,55,176,0.08)]"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ background: hexToRgba(cat.color, 0.1), color: cat.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-on-surface">{cat.label}</h3>
                        <span className="text-xs font-semibold text-outline">
                          {total} verified tool{total === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>

                    <ul className="flex-grow space-y-1">
                      {shown.map((t) => (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            className="group flex items-center justify-between rounded-lg p-2 no-underline transition-colors hover:bg-surface-container"
                          >
                            <span className="text-on-surface-variant group-hover:text-primary">{t.label}</span>
                            <ChevronRight className="h-[18px] w-[18px] text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {more > 0 && (
                      <Link
                        href={`/category/${cat.id}`}
                        className="mt-3 inline-flex items-center gap-1 border-t border-surface-container-high pt-3 text-sm font-semibold text-primary no-underline hover:gap-2"
                      >
                        View all {total}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Highlight promo card */}
              <div className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-xl bg-primary p-6">
                <div className="pointer-events-none absolute right-0 top-0 p-6 opacity-20 transition-transform duration-500 group-hover:scale-110">
                  <ShieldCheck className="h-28 w-28 text-surface" />
                </div>
                <div className="relative z-10">
                  <h3 className="mb-1 font-display text-xl font-bold text-surface">Gov-Verified Data</h3>
                  <p className="mb-5 text-sm text-surface/80">
                    Every figure is checked against GOV.UK, HMRC and ONS data sets.
                  </p>
                  <Link
                    href="/sources"
                    className="inline-flex items-center gap-1 font-bold text-surface no-underline hover:underline"
                  >
                    About our verification policy
                    <ArrowRight className="h-[18px] w-[18px]" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
