'use client';

/**
 * Home v5 — "Catalogue".
 * The whole page IS the tool overview: a compact masthead with command
 * search, then one refined panel per area listing its actual top tools.
 * Mobile-first single column → 2 cols (md) → 3 cols (xl).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Plane, Search, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../data/tools';
import { HUB_TOOLS } from '../data/hubTools';

/* ────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────── */

const SEARCH_POOL = CATEGORIES.flatMap((c) =>
  (HUB_TOOLS[c.id] ?? []).flatMap((g) =>
    g.items
      .filter((t) => t.status === 'live')
      .map((t) => ({ label: t.label, hint: t.hint, href: t.href, cat: c.label }))
  )
);

/* top live tools per category, pre-computed once */
const AREAS = CATEGORIES.map((c) => {
  const items = (HUB_TOOLS[c.id] ?? []).flatMap((g) => g.items);
  const live = items.filter((t) => t.status === 'live');
  return { cat: c, live, top: live.slice(0, 5) };
}).filter((a) => a.live.length > 0);

/* ────────────────────────────────────────────────
   COMMAND SEARCH — boxed, results while typing
   ──────────────────────────────────────────────── */
function CommandSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return SEARCH_POOL.filter(
      (t) => t.label.toLowerCase().includes(s) || t.hint.toLowerCase().includes(s)
    ).slice(0, 7);
  }, [q]);

  useEffect(() => setHi(0), [q]);

  useEffect(() => {
    const fn = (e: MouseEvent | TouchEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn);
    return () => {
      document.removeEventListener('mousedown', fn);
      document.removeEventListener('touchstart', fn);
    };
  }, []);

  const go = (href: string) => { setOpen(false); router.push(href); };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[hi]) go(results[hi].href);
      else if (q.trim()) go(`/tools?q=${encodeURIComponent(q.trim())}`);
    } else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative mx-auto w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-2xl border border-[#0b0f19]/10 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(11,15,25,0.04),0_8px_24px_-12px_rgba(11,15,25,0.12)] transition-[border-color,box-shadow] focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(4,120,87,0.08),0_8px_24px_-12px_rgba(11,15,25,0.12)]">
        <Search className="h-[18px] w-[18px] flex-none text-slate-400" strokeWidth={2.2} />
        <input
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="cmd-results"
          aria-autocomplete="list"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search — pay, stamp duty, visa fees…"
          className="w-full min-w-0 border-none bg-transparent text-[16px] font-medium text-[#0b0f19] placeholder:text-slate-400 focus:outline-none focus:ring-0"
        />
        {q && (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => { setQ(''); setOpen(false); }}
            className="flex-none rounded-md px-1.5 py-0.5 text-sm font-bold text-slate-400 hover:bg-slate-100 hover:text-[#0b0f19]"
          >
            ✕
          </button>
        )}
      </div>

      {open && q.trim() && (
        <div
          id="cmd-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[#0b0f19]/10 bg-white shadow-[0_24px_60px_-20px_rgba(11,15,25,0.28)]"
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-left text-sm text-slate-500">
              Nothing for “{q.trim()}”. <Link href="/tools" className="font-bold text-emerald-700 underline">Open the full index</Link>
            </p>
          ) : (
            <>
              <ul className="max-h-[min(55vh,340px)] overflow-y-auto py-1">
                {results.map((r, idx) => (
                  <li key={r.href} role="option" aria-selected={idx === hi}>
                    <button
                      type="button"
                      onClick={() => go(r.href)}
                      onMouseEnter={() => setHi(idx)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${idx === hi ? 'bg-emerald-50' : ''}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[14.5px] font-semibold ${idx === hi ? 'text-emerald-800' : 'text-[#0b0f19]'}`}>
                          {r.label}
                        </span>
                        <span className="block truncate text-xs text-slate-500">{r.hint}</span>
                      </span>
                      <span className="hidden sm:block flex-none rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{r.cat}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                href={`/tools?q=${encodeURIComponent(q.trim())}`}
                className="block border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-center text-xs font-bold text-emerald-700 hover:bg-emerald-50"
              >
                See every match in the index →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────── */
export default function HomeClient() {
  const liveCount = SEARCH_POOL.length;

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0b0f19] antialiased">
      {/* ── MASTHEAD ── */}
      <header className="relative border-b border-[#0b0f19]/[0.06] bg-white overflow-hidden">
        {/* quiet atmosphere — barely-there emerald wash + dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 90% at 50% -20%, rgba(4,120,87,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(rgba(11,15,25,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(70% 100% at 50% 0%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(70% 100% at 50% 0%, black, transparent)',
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8 pt-12 pb-11 sm:pt-[72px] sm:pb-16 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-600/15 bg-emerald-50/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 shadow-[0_1px_2px_rgba(4,120,87,0.08)]">
            <ShieldCheck className="h-3.5 w-3.5" /> {liveCount} free tools · GOV.UK verified
          </p>
          <h1 className="mx-auto mt-6 max-w-[22ch] font-display text-[clamp(30px,5.8vw,52px)] font-extrabold leading-[1.04] tracking-[-0.032em] [text-wrap:balance]">
            Every UK money, property &amp; visa calculator<span className="text-emerald-600">.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] sm:text-base leading-relaxed text-slate-500">
            Pick an area below, or just type what you need to work out.
          </p>
          <div className="mt-8">
            <CommandSearch />
          </div>
          <p className="mt-4 font-mono text-[11px] text-slate-400">
            verified weekly · no sign-up · nothing stored
          </p>
        </div>
      </header>

      {/* ── AREA PANELS — the exact tool overview ── */}
      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-10 sm:py-14">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-[-0.02em]">
            Browse the catalogue
          </h2>
          <span className="font-mono text-[11px] text-slate-400 tabular-nums">{AREAS.length + 1} areas</span>
          <Link href="/tools" className="ml-auto text-sm font-bold text-emerald-700 hover:underline whitespace-nowrap">
            Full index →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* Immigration first — flagship hub panel */}
          <section className="flex flex-col rounded-[20px] border border-emerald-700/15 bg-gradient-to-b from-emerald-50/70 to-white shadow-[0_1px_2px_rgba(11,15,25,0.04),0_8px_24px_-16px_rgba(4,120,87,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(11,15,25,0.05),0_20px_44px_-18px_rgba(4,120,87,0.4)]">
            <header className="mx-5 flex items-center gap-3 border-b border-emerald-700/10 pt-5 pb-3.5 mb-1.5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald-700 text-white shadow-[0_2px_8px_-2px_rgba(4,120,87,0.5)]">
                <Plane className="h-[18px] w-[18px]" />
              </span>
              <h3 className="min-w-0 flex-1 truncate font-display text-[15.5px] font-bold tracking-[-0.01em]">
                Visas &amp; settlement
              </h3>
              <span className="flex-none rounded-full bg-emerald-700/10 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800 tabular-nums">14</span>
            </header>
            <ul className="flex-1 px-2 pb-1">
              {[
                { label: 'Every visa route, explained', hint: 'Fees · timelines · requirements', href: '/visa-types' },
                { label: 'Eligibility quiz', hint: 'Matched in 60 seconds', href: '/eligibility' },
                { label: 'Visa cost calculator', hint: 'Fees + IHS + dependants', href: '/tools/cost-calculator' },
                { label: 'Settlement & ILR compare', hint: 'All 6 routes side by side', href: '/settlement' },
                { label: 'Skilled Worker points check', hint: '70-point threshold', href: '/skilled-worker-points-check' },
              ].map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold leading-tight group-hover:text-emerald-800">{t.label}</span>
                      <span className="block truncate text-[11.5px] text-slate-500">{t.hint}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 flex-none text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-700" />
                  </Link>
                </li>
              ))}
            </ul>
            <footer className="border-t border-emerald-700/10 px-5 py-3">
              <Link href="/visa-types" className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-emerald-700 hover:gap-2.5 transition-[gap]">
                Open the visa hub <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </footer>
          </section>

          {/* one panel per area */}
          {AREAS.map(({ cat, live, top }) => {
            const Icon = cat.icon;
            return (
              <section
                key={cat.id}
                className="flex flex-col rounded-[20px] border border-[#0b0f19]/[0.08] bg-white shadow-[0_1px_2px_rgba(11,15,25,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0b0f19]/[0.14] hover:shadow-[0_2px_4px_rgba(11,15,25,0.04),0_20px_44px_-20px_rgba(11,15,25,0.25)]"
              >
                <header className="mx-5 flex items-center gap-3 border-b border-[#0b0f19]/[0.05] pt-5 pb-3.5 mb-1.5">
                  <span
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
                    style={{ background: `${cat.color}14`, color: cat.color }}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="min-w-0 flex-1 truncate font-display text-[15.5px] font-bold tracking-[-0.01em]">
                    {cat.label}
                  </h3>
                  <span className="flex-none rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-500 tabular-nums">
                    {live.length}
                  </span>
                </header>

                <ul className="flex-1 px-2 pb-1">
                  {top.map((t) => (
                    <li key={t.href + t.label}>
                      <Link
                        href={t.href}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold leading-tight group-hover:text-emerald-800">
                            {t.label}
                          </span>
                          <span className="block truncate text-[11.5px] text-slate-500">{t.hint}</span>
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 flex-none text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-700" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-[#0b0f19]/[0.06] px-5 py-3">
                  <Link
                    href={`/category/${cat.id}`}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-emerald-700 hover:gap-2.5 transition-[gap]"
                  >
                    All {live.length} {cat.label.toLowerCase()} tools <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </footer>
              </section>
            );
          })}
        </div>

        {/* ── trust footnote ── */}
        <div className="mt-12 sm:mt-16 rounded-[20px] border border-[#0b0f19]/[0.06] bg-gradient-to-b from-white to-slate-50/60 px-6 py-6 sm:px-8 sm:flex sm:items-center sm:justify-between sm:gap-8 shadow-[0_1px_2px_rgba(11,15,25,0.03)]">
          <p className="max-w-2xl text-[13.5px] leading-relaxed text-slate-500">
            <span className="font-bold text-[#0b0f19]">Independent &amp; private.</span> UKDesk is not
            affiliated with HMRC or the Home Office. Rates are audited weekly against official
            publications, and every calculation runs in your browser — nothing is stored.
          </p>
          <div className="mt-4 sm:mt-0 flex flex-none gap-5">
            <Link href="/sources" className="text-[13px] font-bold text-emerald-700 hover:underline">Sources</Link>
            <Link href="/editorial-policy" className="text-[13px] font-bold text-emerald-700 hover:underline">Policy</Link>
            <Link href="/news" className="text-[13px] font-bold text-emerald-700 hover:underline">Updates</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
