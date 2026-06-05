'use client';

/**
 * /tools — Tool directory (June 2026 redesign)
 * Compact hero + search + trending chips · category cards grouped by
 * sub-category · request-a-tool CTA bento. Client-side search.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Search, X } from 'lucide-react';
import { APP_TILES, CATEGORIES } from '../../data/tools';
import { VISA_TOOLS, getHubSections } from '../../lib/categoryMeta';

const TOTAL = APP_TILES.length + VISA_TOOLS.length;
const TRENDING = ['Mortgage', 'ISA', 'Skilled Worker', 'Stamp Duty'];

function hexToRgba(hex: string, a: number) {
  const m = hex.replace('#', '');
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(v, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Pre-build grouped sections per category once. */
const CARDS = CATEGORIES.map((cat) => {
  const sections = getHubSections(cat.id);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  return { cat, sections, total };
});

export default function ToolsIndex() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const cards = useMemo(() => {
    if (!q) return CARDS.filter((c) => c.total > 0);
    return CARDS
      .map(({ cat, sections, total }) => ({
        cat,
        total,
        sections: sections
          .map((s) => ({ ...s, items: s.items.filter((i) => i.label.toLowerCase().includes(q)) }))
          .filter((s) => s.items.length > 0),
      }))
      .filter((c) => c.sections.length > 0);
  }, [q]);

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      {/* ─── Compact hero ─── */}
      <section className="bg-surface-container px-4 pt-8 pb-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm font-medium">
            <Link href="/" className="text-on-surface-variant transition-colors hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 text-outline" />
            <span className="font-semibold text-primary">All tools</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="font-display text-[clamp(30px,4vw+12px,48px)] font-bold leading-tight tracking-tight text-on-surface">
              Browse all calculators
            </h1>
            <p className="mt-3 text-[clamp(16px,0.6vw+14px,19px)] text-on-surface-variant">
              Every free UK calculator and lookup — money, property, visas and more.
              Verified against GOV.UK, HMRC and ONS.
            </p>
          </div>

          {/* Search */}
          <div className="relative mt-7 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${TOTAL}+ verified calculators…`}
              autoComplete="off"
              autoFocus
              className="block w-full rounded-xl border-none bg-surface-container-lowest py-4 pl-[52px] pr-12 text-base shadow-sm transition-all placeholder:text-outline focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition hover:text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Trending chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Trending:</span>
            {TRENDING.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setQuery(t)}
                className="rounded-full bg-surface-container-high px-3.5 py-1 text-sm font-medium text-on-surface transition-colors hover:bg-primary-container hover:text-surface"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Category cards ─── */}
      <section className="px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {cards.length === 0 ? (
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ cat, sections, total }) => {
                const Icon = cat.icon;
                return (
                  <section
                    key={cat.id}
                    className="flex flex-col gap-5 rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,55,176,0.08)]"
                  >
                    {/* Card header */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ background: hexToRgba(cat.color, 0.1), color: cat.color }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-on-surface">{cat.label}</h2>
                        <span
                          className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={{ background: hexToRgba(cat.color, 0.12), color: cat.color }}
                        >
                          {total} tool{total === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>

                    {/* Sub-grouped tool lists */}
                    <div className="flex flex-col">
                      {sections.map((sec) => (
                        <div key={sec.id}>
                          <h3 className="mb-1.5 mt-4 text-[11px] font-bold uppercase tracking-wider text-outline first:mt-0">
                            {sec.label}
                          </h3>
                          <ul className="space-y-0.5">
                            {sec.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="block rounded-lg p-2 text-sm text-on-surface-variant no-underline transition-all hover:bg-surface-container-low hover:text-primary"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* ─── Request-a-tool CTA bento ─── */}
          {!q && (
            <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl bg-primary p-8 md:col-span-8">
                <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="relative z-10">
                  <h2 className="font-display text-2xl font-bold text-surface">Missing a calculator?</h2>
                  <p className="mt-2 max-w-md text-sm text-surface/85">
                    We add new UK tools regularly. Tell us what you need and we&apos;ll
                    notify you when it&apos;s live.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-primary no-underline shadow-sm transition hover:bg-surface"
                  >
                    Request a tool
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl bg-surface-container-high p-8 md:col-span-4">
                <h3 className="font-display text-lg font-bold text-on-surface">Kept current</h3>
                <p className="mt-1.5 text-sm text-on-surface-variant">
                  Figures updated for tax year 2026/27 and checked against official sources.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    Verified · GOV.UK · HMRC · ONS
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
