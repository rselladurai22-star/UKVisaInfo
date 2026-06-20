'use client';

/**
 * Tools index v5 — "Clean Slate directory".
 * White / slate / blue. Fresh layout: a sticky category rail on the left
 * (desktop) navigates the index; the right column is one continuous run of
 * re-skinned category sections. Search filters live; on mobile the rail
 * collapses to a horizontal chip strip under the sticky search.
 */

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { CATEGORIES, type CategoryId } from '../../data/tools';
import { HUB_TOOLS, type HubItem } from '../../data/hubTools';
import { AREA_ACCENT, tint } from '../../data/areaAccents';

const CAT_TOOLS = (id: CategoryId): HubItem[] => (HUB_TOOLS[id] ?? []).flatMap((g) => g.items);
const ALL_LIVE = CATEGORIES.reduce((n, c) => n + CAT_TOOLS(c.id).filter((t) => t.status === 'live').length, 0);

export default function ToolsClient() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const inputRef = useRef<HTMLInputElement>(null);

  /* prefill from ?q= (home search hands off here) */
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('q');
    if (v) setQuery(v);
  }, []);

  /* ⌘K focuses search */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* nav → glide that section to sit under the sticky bar */
  const scrollToCat = (id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  };

  const sections = useMemo(() => {
    return CATEGORIES
      .map((c) => {
        let items = CAT_TOOLS(c.id);
        if (q) {
          items = items.filter(
            (t) => t.label.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q)
          );
        }
        items = [...items].sort((a, b) => (a.status === b.status ? 0 : a.status === 'live' ? -1 : 1));
        return { cat: c, items };
      })
      .filter((s) => s.items.length > 0);
  }, [q]);

  const shownLive = sections.reduce((n, s) => n + s.items.filter((i) => i.status === 'live').length, 0);
  const visibleIds = new Set(sections.map((s) => s.cat.id));

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">

        {/* masthead */}
        <header className="border-b border-slate-200 pb-6 pt-7 sm:pt-10">
          <p className="font-mono text-[12px] text-slate-400">
            <Link href="/" className="hover:text-blue-700">ukdesk</Link> <span className="text-slate-300">/</span> tools
          </p>
          <h1 className="mt-2.5 font-display text-[clamp(28px,5vw,40px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-slate-900">
            The tool index<span className="text-blue-600">.</span>
          </h1>
          <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
            {ALL_LIVE} live calculators and checkers across {CATEGORIES.length} areas — verified
            against GOV.UK, HMRC and ONS. No sign-up.
          </p>
        </header>

        {/* sticky search + mobile chip strip */}
        <div className="glass-cs sticky top-[60px] z-20 -mx-5 border-b border-slate-200/80 px-5 pb-3 pt-3 sm:-mx-8 sm:px-8">
          <div className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 shadow-cs ring-1 ring-slate-900/[0.06] transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.12)]">
            <Search className="h-[18px] w-[18px] flex-none text-slate-400" strokeWidth={2.2} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter the index…"
              className="w-full min-w-0 border-none bg-transparent text-[16.5px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            {query ? (
              <button onClick={() => setQuery('')} aria-label="Clear" className="flex-none rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                <X className="h-[18px] w-[18px]" />
              </button>
            ) : (
              <kbd className="hidden flex-none rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-400 sm:block">⌘K</kbd>
            )}
          </div>

          {/* mobile-only chip strip */}
          <div className="mt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar lg:hidden">
            {CATEGORIES.map((c) => {
              const live = CAT_TOOLS(c.id).filter((t) => t.status === 'live').length;
              if (!live) return null;
              return (
                <button
                  key={c.id}
                  onClick={() => scrollToCat(c.id)}
                  className="flex-none whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-bold text-slate-600 transition-all hover:border-blue-400 hover:text-blue-700 active:scale-95"
                >
                  {c.label} <span className="font-mono text-slate-400">{live}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* result meta */}
        <p className="pb-1 pt-4 font-mono text-[12px] tabular-nums text-slate-400">
          {shownLive} live{q && <> · matching “{query.trim()}”</>}
          {q && (
            <button onClick={() => setQuery('')} className="ml-3 font-sans font-bold text-blue-700">
              reset
            </button>
          )}
        </p>

        {sections.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[15.5px] font-semibold text-slate-500">Nothing matches “{query.trim()}”.</p>
            <button onClick={() => setQuery('')} className="mt-2 text-[15.5px] font-bold text-blue-700 underline">
              Clear and show everything
            </button>
          </div>
        ) : (
          <div className="grid gap-8 pb-16 lg:grid-cols-[200px_1fr] lg:gap-10">
            {/* desktop sticky rail */}
            <nav aria-label="Areas" className="hidden lg:block">
              <div className="sticky top-[150px]">
                <p className="mb-2 px-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Areas</p>
                <ul className="space-y-0.5">
                  {CATEGORIES.map((c) => {
                    const live = CAT_TOOLS(c.id).filter((t) => t.status === 'live').length;
                    if (!live) return null;
                    const dimmed = q && !visibleIds.has(c.id);
                    const ac = AREA_ACCENT[c.id];
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => scrollToCat(c.id)}
                          disabled={!!dimmed}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13.5px] font-semibold transition-colors ${
                            dimmed
                              ? 'cursor-default text-slate-300'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 flex-none rounded-full"
                            style={{ background: dimmed ? '#cbd5e1' : ac }}
                          />
                          <span className="min-w-0 flex-1 truncate">{c.label}</span>
                          <span className="flex-none font-mono text-[11px] tabular-nums text-slate-400">{live}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            {/* sections column */}
            <div className="min-w-0 space-y-4">
              {sections.map(({ cat, items }) => {
                const Icon = cat.icon;
                const c = AREA_ACCENT[cat.id];
                return (
                  <section
                    key={cat.id}
                    id={`sec-${cat.id}`}
                    style={{ ['--c' as string]: c }}
                    className="scroll-mt-[150px] overflow-hidden rounded-2xl bg-white shadow-cs transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <span aria-hidden className="block h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${c}, ${tint(c, 0.4)})` }} />
                    <div
                      className="flex items-center gap-3 border-b border-slate-100 px-4 py-3"
                      style={{ background: `linear-gradient(90deg, ${tint(c, 0.08)} 0%, transparent 70%)` }}
                    >
                      <span
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-lg"
                        style={{ background: tint(c, 0.12), color: c }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <h2 className="font-display text-[16px] font-bold tracking-[-0.01em] text-slate-900">{cat.label}</h2>
                      <span
                        className="rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums"
                        style={{ background: tint(c, 0.1), color: c }}
                      >
                        {items.filter((i) => i.status === 'live').length}
                      </span>
                      <Link
                        href={`/category/${cat.id}`}
                        className="ml-auto whitespace-nowrap text-[12.5px] font-bold hover:underline"
                        style={{ color: c }}
                      >
                        Area guide →
                      </Link>
                    </div>

                    <ul className="px-2.5 py-2 lg:columns-2 lg:gap-6">
                      {items.map((t) =>
                        t.status === 'live' ? (
                          <li key={t.href + t.label} className="break-inside-avoid">
                            <Link
                              href={t.href}
                              className="group relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] transition-colors hover:bg-slate-50"
                            >
                              <span className="absolute left-0 top-1/2 h-0 w-[2.5px] -translate-y-1/2 rounded-full bg-[var(--c)] transition-all duration-200 group-hover:h-[55%]" />
                              <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
                                <span className="text-[15px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[var(--c)]">
                                  {t.label}
                                </span>
                                <span className="truncate text-[12.5px] text-slate-400">{t.hint}</span>
                              </span>
                              <ArrowUpRight className="h-4 w-4 flex-none text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--c)]" />
                            </Link>
                          </li>
                        ) : (
                          <li key={t.href + t.label} className="break-inside-avoid">
                            <div className="flex select-none items-center gap-2.5 px-2.5 py-[7px]">
                              <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
                                <span className="text-[15px] font-semibold leading-snug text-slate-400">{t.label}</span>
                                <span className="truncate text-[12.5px] text-slate-300">{t.hint}</span>
                              </span>
                              <span className="flex-none rounded border border-slate-200 bg-slate-50 px-1.5 py-px font-mono text-[10px] font-bold uppercase text-slate-400">
                                soon
                              </span>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
