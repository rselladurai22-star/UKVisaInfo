'use client';

/**
 * Tools index v4 — "Reference manual".
 * One continuous index of category panels. Chips don't filter — they
 * smooth-scroll the matching section under the sticky bar. Search filters
 * live. Compact rows: maximum tools per screen.
 */

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { CATEGORIES, type CategoryId } from '../../data/tools';
import { HUB_TOOLS, type HubItem } from '../../data/hubTools';

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

  /* chip → glide that section to sit under the sticky bar */
  const scrollToCat = (id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 142;
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

  return (
    <main className="bg-[#fbfbf9] text-[#0b0f19] min-h-screen antialiased">
      <div className="mx-auto w-full max-w-3xl lg:max-w-6xl px-5 sm:px-8">

        {/* masthead */}
        <header className="pt-7 sm:pt-10 pb-4">
          <p className="font-mono text-[11px] text-slate-400">
            <Link href="/" className="hover:text-emerald-700">ukdesk</Link> <span className="text-slate-300">/</span> tools
          </p>
          <h1 className="mt-2 font-display text-[clamp(24px,4.5vw,34px)] font-extrabold leading-[1.05] tracking-[-0.028em]">
            The tool index<span className="text-emerald-600">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-[13.5px] sm:text-[14.5px] leading-relaxed text-slate-500">
            {ALL_LIVE} live calculators and checkers across {CATEGORIES.length} areas — verified
            against GOV.UK, HMRC and ONS. No sign-up.
          </p>
        </header>

        {/* sticky search + jump chips */}
        <div className="sticky top-[56px] z-20 -mx-5 sm:-mx-8 bg-[#fbfbf9]/95 backdrop-blur px-5 sm:px-8 pt-2.5 pb-2.5 border-b border-[#0b0f19]/[0.07] shadow-[0_6px_16px_-12px_rgba(11,15,25,0.1)]">
          <div className="flex items-center gap-2.5 rounded-xl border border-[#0b0f19]/10 bg-white px-3.5 py-2 shadow-[0_1px_2px_rgba(11,15,25,0.04)] transition-[border-color,box-shadow] focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(4,120,87,0.08)]">
            <Search className="h-4 w-4 flex-none text-slate-400" strokeWidth={2.2} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter the index…"
              className="w-full min-w-0 border-none bg-transparent text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            {query ? (
              <button onClick={() => setQuery('')} aria-label="Clear" className="flex-none rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-[#0b0f19]">
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden sm:block flex-none font-mono text-[10px] text-slate-400 border border-slate-200 bg-slate-50 rounded px-1.5 py-0.5">⌘K</kbd>
            )}
          </div>

          <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar lg:flex-wrap lg:overflow-visible">
            {CATEGORIES.map((c) => {
              const live = CAT_TOOLS(c.id).filter((t) => t.status === 'live').length;
              if (!live) return null;
              return (
                <button
                  key={c.id}
                  onClick={() => scrollToCat(c.id)}
                  className="flex-none rounded-lg bg-white border border-[#0b0f19]/[0.09] px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap text-slate-600 transition-all hover:border-emerald-600/40 hover:text-emerald-800 active:scale-95"
                >
                  {c.label} <span className="font-mono opacity-45">{live}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* result meta */}
        <p className="pt-3 pb-0.5 font-mono text-[11px] text-slate-400 tabular-nums">
          {shownLive} live{q && <> · matching “{query.trim()}”</>}
          {q && (
            <button onClick={() => setQuery('')} className="ml-3 font-sans font-bold text-emerald-700">
              reset
            </button>
          )}
        </p>

        {sections.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-slate-500">Nothing matches “{query.trim()}”.</p>
            <button onClick={() => setQuery('')} className="mt-2 text-sm font-bold text-emerald-700 underline">
              Clear and show everything
            </button>
          </div>
        ) : (
          <div className="pb-16">
            {sections.map(({ cat, items }) => {
              const Icon = cat.icon;
              return (
                <section
                  key={cat.id}
                  id={`sec-${cat.id}`}
                  className="mt-4 overflow-hidden rounded-2xl border border-[#0b0f19]/[0.07] bg-white shadow-[0_1px_2px_rgba(11,15,25,0.03)]"
                >
                  {/* tinted header band in the category's own colour */}
                  <div
                    className="flex items-center gap-2.5 border-b border-[#0b0f19]/[0.05] px-4 py-2.5"
                    style={{ background: `linear-gradient(90deg, ${cat.color}10 0%, transparent 65%)` }}
                  >
                    <span
                      className="flex h-7 w-7 flex-none items-center justify-center rounded-lg shadow-[0_2px_8px_-3px_rgba(11,15,25,0.3)]"
                      style={{ background: cat.color, color: '#fff' }}
                    >
                      <Icon className="h-[14px] w-[14px]" />
                    </span>
                    <h2 className="font-display text-[14.5px] font-bold tracking-[-0.01em]">{cat.label}</h2>
                    <span className="font-mono text-[10.5px] text-slate-400 tabular-nums">
                      {items.filter((i) => i.status === 'live').length}
                    </span>
                    <Link
                      href={`/category/${cat.id}`}
                      className="ml-auto text-[11.5px] font-bold text-emerald-700 hover:underline whitespace-nowrap"
                    >
                      Area guide →
                    </Link>
                  </div>

                  <ul className="px-2.5 py-1.5 lg:columns-2 lg:gap-6">
                    {items.map((t) =>
                      t.status === 'live' ? (
                        <li key={t.href + t.label} className="break-inside-avoid">
                          <Link
                            href={t.href}
                            className="group flex items-center gap-2.5 rounded-lg px-2 py-[5px] transition-colors hover:bg-slate-50 active:bg-emerald-50/60"
                          >
                            <span className="min-w-0 flex-1 flex flex-wrap items-baseline gap-x-2">
                              <span className="text-[13.5px] font-semibold leading-snug group-hover:text-emerald-800">
                                {t.label}
                              </span>
                              <span className="truncate text-[11.5px] text-slate-400">{t.hint}</span>
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 flex-none text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-700" />
                          </Link>
                        </li>
                      ) : (
                        <li key={t.href + t.label} className="break-inside-avoid">
                          <div className="flex items-center gap-2.5 px-2 py-[5px] select-none">
                            <span className="min-w-0 flex-1 flex flex-wrap items-baseline gap-x-2">
                              <span className="text-[13.5px] font-semibold leading-snug text-slate-400">{t.label}</span>
                              <span className="truncate text-[11.5px] text-slate-300">{t.hint}</span>
                            </span>
                            <span className="flex-none rounded border border-slate-200 bg-slate-50 px-1.5 py-px font-mono text-[9px] font-bold uppercase text-slate-400">
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
        )}
      </div>
    </main>
  );
}
