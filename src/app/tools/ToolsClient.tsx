'use client';

/**
 * /tools — Tool directory (June 2026 redesign)
 * Hero · live search · category filter chips · responsive tile grid.
 * Client component for instant filtering across all 46 tools.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Search, ShieldCheck, Sparkles, TrendingUp, X } from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../data/tools';
import { VISA_TOOLS } from '../../lib/categoryMeta';

type Tile = {
  href: string;
  label: string;
  hint: string;
  icon: typeof CATEGORIES[number]['icon'];
  accent: string;
  category: CategoryId;
  trending?: boolean;
  status?: string;
};

const ALL: Tile[] = [
  ...APP_TILES.map((t) => ({
    href: t.href,
    label: t.label,
    hint: t.hint,
    icon: t.icon,
    accent: t.accent,
    category: t.category,
    trending: t.trending,
    status: t.status,
  })),
  ...VISA_TOOLS.map((v) => ({
    href: v.href,
    label: v.title,
    hint: v.hint,
    icon: v.icon,
    accent: v.accent,
    category: 'immigration' as CategoryId,
  })),
];

/** Quick-search suggestions — reflect real, popular queries. */
const TRENDING = ['Take-home', 'Stamp duty', 'ULEZ', 'Mortgage'];
const LATEST = ['Salary sacrifice', 'Pension drawdown', 'Skilled worker'];

export default function ToolsIndex() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<'all' | CategoryId>('all');

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return ALL.filter((t) => {
      if (active !== 'all' && t.category !== active) return false;
      if (!q) return true;
      return (
        t.label.toLowerCase().includes(q) ||
        t.hint.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [q, active]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: ALL.length };
    CATEGORIES.forEach((c) => (m[c.id] = ALL.filter((t) => t.category === c.id).length));
    return m;
  }, []);

  /** Group filtered tiles by category, preserving CATEGORIES order. */
  const grouped = useMemo(() => {
    return CATEGORIES
      .map((c) => ({ cat: c, items: filtered.filter((t) => t.category === c.id) }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              'radial-gradient(55% 80% at 15% 0%, #ECFDF5 0%, transparent 60%), radial-gradient(45% 65% at 95% 10%, #FBF6E7 0%, transparent 65%)',
          }}
        />
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-on-surface-variant">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-primary">All tools</span>
          </nav>

          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-container-lowest px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                Tool directory
              </span>
              <h1 className="mt-4 text-[1.875rem] font-bold leading-[1.05] tracking-tight text-primary sm:text-5xl">
                Every calculator, in one place.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                {ALL.length} free UK calculators and lookups — tax, property, visas, benefits and more. Checked against GOV.UK, HMRC and ONS.
              </p>
            </div>

            <ul className="flex shrink-0 gap-3">
              <li className="rounded-2xl border border-border bg-surface-container-lowest px-4 py-3">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">Tools live</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums text-primary">{ALL.length}</div>
              </li>
              <li className="rounded-2xl border border-border bg-surface-container-lowest px-4 py-3">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">Categories</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums text-primary">{CATEGORIES.length}</div>
              </li>
              <li className="hidden rounded-2xl border border-secondary/20 bg-secondary-soft px-4 py-3 sm:block">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-secondary">Verified</div>
                <div className="mt-1 inline-flex items-center gap-1.5 font-display text-sm font-bold text-secondary">
                  <ShieldCheck className="h-4 w-4" />
                  gov.uk
                </div>
              </li>
            </ul>
          </div>

          {/* Search — advanced */}
          <div className="mt-8">
            <div className="group relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-r from-secondary/20 via-accent/20 to-secondary/20 opacity-0 blur-xl transition-opacity duration-300 group-focus-within:opacity-100"
              />
              <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-surface-container-lowest px-5 py-3.5 shadow-[0_2px_10px_-4px_rgba(11,15,25,0.06)] transition focus-within:border-secondary/60 focus-within:shadow-[0_0_0_4px_rgba(4,120,87,0.14)]">
                <Search className="h-5 w-5 shrink-0 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search 50+ tools — take-home pay, ULEZ, visa cost…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-base font-medium text-primary placeholder:text-on-surface-variant focus:outline-none focus:ring-0"
                  autoComplete="off"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <kbd className="hidden rounded-md border border-border bg-surface px-1.5 py-1 text-[10.5px] font-semibold text-on-surface-variant sm:inline-flex">
                  /
                </kbd>
              </div>
            </div>

            {/* Quick suggestions — trending / latest */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                <Flame className="h-3.5 w-3.5 text-accent" />
                Trending
              </span>
              {TRENDING.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-surface-container-lowest px-2.5 py-1 text-[11.5px] font-semibold text-on-surface-variant transition hover:border-secondary/40 hover:bg-secondary-soft hover:text-secondary-strong"
                >
                  {s}
                </button>
              ))}
              <span className="mx-1 hidden h-3 w-px bg-border sm:inline-block" />
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                <TrendingUp className="h-3.5 w-3.5 text-secondary" />
                Latest
              </span>
              {LATEST.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-surface-container-lowest px-2.5 py-1 text-[11.5px] font-semibold text-on-surface-variant transition hover:border-secondary/40 hover:bg-secondary-soft hover:text-secondary-strong"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-5 -mx-1 flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
            <Chip active={active === 'all'} onClick={() => setActive('all')} count={counts.all}>
              All
            </Chip>
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <Chip
                  key={c.id}
                  active={active === c.id}
                  onClick={() => setActive(c.id)}
                  count={counts[c.id]}
                  accent={c.color}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {c.label}
                </Chip>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Grid ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
            {filtered.length === ALL.length
              ? `Showing all ${filtered.length}`
              : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}
          </h2>
          {(query || active !== 'all') && (
            <button
              type="button"
              onClick={() => { setQuery(''); setActive('all'); }}
              className="text-xs font-semibold text-secondary hover:text-secondary-strong"
            >
              Reset filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface-container-lowest px-8 py-20 text-center">
            <p className="text-base font-semibold text-primary">No tools match your search.</p>
            <p className="mt-2 text-sm text-on-surface-variant">Try a different keyword or browse a category above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {grouped.map(({ cat, items }, idx) => {
              const CatIcon = cat.icon;
              return (
                <section
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  className="group/cat relative scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-surface-container-lowest"
                  style={{
                    background: `linear-gradient(180deg, ${hexToRgba(cat.color, 0.06)} 0%, var(--color-surface-container-lowest) 70%)`,
                  }}
                >
                  {/* Coloured left rail */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ background: cat.color }}
                  />

                  <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border/60 px-6 py-5 sm:px-8">
                    <div className="flex items-center gap-4">
                      <span
                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_8px_22px_-10px_rgba(11,15,25,0.45)]"
                        style={{ background: cat.color }}
                      >
                        <CatIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
                            style={{ color: cat.color }}
                          >
                            Category {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="rounded-full bg-surface-container-lowest px-2 py-0.5 text-[10px] font-bold tabular-nums text-on-surface-variant ring-1 ring-border">
                            {items.length} tool{items.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        <h3 className="mt-0.5 font-display text-xl font-bold tracking-tight text-primary sm:text-2xl">
                          {cat.label}
                        </h3>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-on-surface-variant">{cat.description}</p>
                      </div>
                    </div>
                    <Link
                      href={`/category/${cat.id}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-surface no-underline transition hover:gap-2 hover:bg-primary-container"
                    >
                      Open hub
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </header>

                  {/* Tile grid */}
                  <ul className="grid grid-cols-1 gap-3 px-6 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((t) => {
                      const Icon = t.icon;
                      return (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-surface-container-lowest p-5 no-underline transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_18px_44px_-22px_rgba(11,15,25,0.22)]"
                          >
                            {t.trending && (
                              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-secondary/20 bg-secondary-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                                Trending
                              </span>
                            )}
                            {t.status === 'new' && !t.trending && (
                              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-surface">
                                New
                              </span>
                            )}

                            <span
                              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[0_6px_16px_-8px_rgba(11,15,25,0.4)]"
                              style={{ background: t.accent }}
                            >
                              <Icon className="h-5 w-5" />
                            </span>

                            <div className="flex-1">
                              <h4 className="font-display text-[15.5px] font-bold tracking-tight text-primary">
                                {t.label}
                              </h4>
                              <p className="mt-1.5 text-xs leading-relaxed text-on-surface-variant">{t.hint}</p>
                            </div>

                            <div className="mt-2 flex items-center justify-end border-t border-border pt-3">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary transition group-hover:gap-2">
                                Open
                                <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

/* ── helpers ── */
function hexToRgba(hex: string, a: number) {
  const m = hex.replace('#', '');
  const v = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(v, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* ── chip helper ── */
function Chip({
  active, onClick, count, accent, children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition',
        active
          ? 'border border-transparent bg-primary text-surface shadow-[0_4px_12px_-6px_rgba(11,15,25,0.4)]'
          : 'border border-border bg-surface-container-lowest text-on-surface-variant hover:border-border-strong hover:text-primary',
      ].join(' ')}
      style={active && accent ? { background: accent } : undefined}
    >
      {children}
      {typeof count === 'number' && (
        <span
          className={[
            'rounded-full px-1.5 py-px text-[10px] font-bold tabular-nums',
            active ? 'bg-white/20 text-white' : 'bg-surface text-on-surface-variant',
          ].join(' ')}
        >
          {count}
        </span>
      )}
    </button>
  );
}
