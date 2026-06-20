'use client';

/**
 * Home v6 — "Clean Slate".
 * A crisp white / slate / blue product surface. Fresh composition:
 *   1. Split hero — headline + command search on the left, a live "popular
 *      tools" console panel on the right.
 *   2. Trust strip — three plain facts, hairline-separated.
 *   3. Directory grid — one uniform card per area, monochrome blue, three
 *      top tools each, sharp 12px corners.
 *   4. Quiet closing band.
 * Mobile-first single column → 2 cols (md) → 3 cols (lg).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CornerDownLeft, Landmark, Lock, RefreshCw, Search } from 'lucide-react';
import { CATEGORIES } from '../data/tools';
import { HUB_TOOLS } from '../data/hubTools';
import { AREA_ACCENT, tint } from '../data/areaAccents';

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

/* top live tools per area, pre-computed once */
const AREAS = CATEGORIES.map((c) => {
  const items = (HUB_TOOLS[c.id] ?? []).flatMap((g) => g.items);
  const live = items.filter((t) => t.status === 'live');
  return { cat: c, live, top: live.slice(0, 3) };
})
  .filter((a) => a.live.length > 0)
  /* lead with the immigration flagship */
  .sort((a, b) => (a.cat.id === 'immigration' ? -1 : b.cat.id === 'immigration' ? 1 : 0));

/* hand-picked rail for the hero console */
const POPULAR = [
  { label: 'Take-home Pay', hint: 'PAYE · NI · student loan', href: '/take-home-pay' },
  { label: 'Stamp Duty', hint: 'SDLT 2026 · FTB relief', href: '/stamp-duty-calculator' },
  { label: 'Mortgage Affordability', hint: 'Max borrow + stress test', href: '/mortgage-affordability' },
  { label: 'Council Tax Band', hint: 'All 8 bands by postcode', href: '/council-tax-band' },
  { label: 'Visa Cost Calculator', hint: 'Fees + IHS + dependants', href: '/tools/cost-calculator' },
];

/* ────────────────────────────────────────────────
   COMMAND SEARCH — boxed, results while typing
   ──────────────────────────────────────────────── */
function CommandSearch({ autoFocusHint = false }: { autoFocusHint?: boolean }) {
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
    <div ref={boxRef} className="relative w-full">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-cs ring-1 ring-slate-900/[0.06] transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:shadow-[0_0_0_5px_rgba(37,99,235,0.12),0_8px_24px_-12px_rgba(15,23,42,0.12)]">
        <Search className="h-[18px] w-[18px] flex-none text-slate-400" strokeWidth={2.2} />
        <input
          type="text"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="cmd-results"
          aria-autocomplete="list"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search 50+ tools — pay, stamp duty, visa fees…"
          className="w-full min-w-0 border-none bg-transparent text-[16px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
        />
        {q ? (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => { setQ(''); setOpen(false); }}
            className="flex-none rounded-md px-1.5 py-0.5 text-sm font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        ) : autoFocusHint ? (
          <kbd className="hidden sm:flex flex-none items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-400">
            <CornerDownLeft className="h-3 w-3" /> to open
          </kbd>
        ) : null}
      </div>

      {open && q.trim() && (
        <div
          id="cmd-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.28)]"
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-left text-sm text-slate-500">
              Nothing for “{q.trim()}”. <Link href="/tools" className="font-bold text-blue-700 underline">Open the full index</Link>
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
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${idx === hi ? 'bg-blue-50' : ''}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[14.5px] font-semibold ${idx === hi ? 'text-blue-800' : 'text-slate-900'}`}>
                          {r.label}
                        </span>
                        <span className="block truncate text-xs text-slate-500">{r.hint}</span>
                      </span>
                      <span className="hidden sm:block flex-none rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{r.cat}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                href={`/tools?q=${encodeURIComponent(q.trim())}`}
                className="block border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-center text-xs font-bold text-blue-700 hover:bg-blue-50"
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
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* ─────────────  HERO  ───────────── */}
      <header className="relative border-b border-slate-200 bg-white">
        <div aria-hidden className="cs-canvas pointer-events-none absolute inset-0" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-14 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* left — message + search */}
          <div className="max-w-xl">
            <span className="cs-rise glass-cs inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-cs ring-1 ring-blue-600/10" style={{ ['--i' as string]: 0 }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
              </span>
              {liveCount} free tools · GOV.UK verified
            </span>

            <h1 className="cs-rise mt-6 font-display text-[clamp(34px,6.2vw,60px)] font-extrabold leading-[1.0] tracking-[-0.04em] text-slate-900 [text-wrap:balance]" style={{ ['--i' as string]: 1 }}>
              Every UK money, property &amp; visa decision — <span className="ink-cs">worked out clearly.</span>
            </h1>

            <p className="cs-rise mt-5 max-w-md text-[16px] leading-relaxed text-slate-600 sm:text-[17.5px]" style={{ ['--i' as string]: 2 }}>
              One trusted desk for the numbers that run your life in the UK. Type what you need to
              work out, or browse the directory below.
            </p>

            <div className="cs-rise mt-7 max-w-lg" style={{ ['--i' as string]: 3 }}>
              <CommandSearch />
            </div>

            <p className="cs-rise mt-3.5 font-mono text-[11px] text-slate-400" style={{ ['--i' as string]: 4 }}>
              verified weekly · no sign-up · runs in your browser
            </p>
          </div>

          {/* right — popular tools console */}
          <div className="cs-rise relative" style={{ ['--i' as string]: 3 }}>
            {/* soft halo behind the panel */}
            <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(37,99,235,0.12),transparent_70%)] blur-xl" />
            <div className="overflow-hidden rounded-2xl bg-white shadow-cs-lg">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </span>
                <span className="ml-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  popular this week
                </span>
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" />
              </div>
              <ul className="divide-y divide-slate-100">
                {POPULAR.map((t, i) => (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-blue-50/60"
                    >
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-slate-100 font-mono text-[12px] font-bold text-slate-500 transition-all group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-[0_4px_12px_-2px_rgba(37,99,235,0.5)]">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold text-slate-900 group-hover:text-blue-800">{t.label}</span>
                        <span className="block truncate text-[12px] text-slate-500">{t.hint}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 flex-none text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/tools"
                className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-[13px] font-bold text-blue-700 transition-colors hover:to-blue-50"
              >
                Open the full tool index <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────  TRUST STRIP  ───────────── */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-px overflow-hidden bg-slate-200 sm:grid-cols-3">
          {[
            { icon: Landmark, k: 'Sourced from gov.uk', v: 'Every rate, fee and threshold traced to HMRC, ONS or the Home Office.' },
            { icon: Lock, k: 'Nothing stored', v: 'Calculations run entirely in your browser — no account, no tracking by tool.' },
            { icon: RefreshCw, k: 'Checked weekly', v: 'Figures re-audited against official publications as they change.' },
          ].map((f) => (
            <div key={f.k} className="flex gap-3.5 bg-slate-50 px-5 py-6 sm:px-7">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                <f.icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[14px] font-bold text-slate-900">{f.k}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-slate-500">{f.v}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────  DIRECTORY  ───────────── */}
      <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Directory</p>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-[-0.02em] text-slate-900 sm:text-[28px]">
              Browse by area
            </h2>
          </div>
          <Link href="/tools" className="flex-none whitespace-nowrap text-[14px] font-bold text-blue-700 hover:underline">
            All {AREAS.length} areas →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AREAS.map(({ cat, live, top }, idx) => {
            const Icon = cat.icon;
            const c = AREA_ACCENT[cat.id];
            const flagship = cat.id === 'immigration';
            return (
              <section
                key={cat.id}
                className="cs-rise group/card relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-white to-slate-50/40 shadow-cs transition-all duration-300 hover:-translate-y-1.5"
                style={{ ['--c' as string]: c, ['--i' as string]: idx }}
              >
                {/* accent top rule */}
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${c}, ${tint(c, 0.45)})` }} />
                {/* accent hover glow */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                  style={{ boxShadow: `0 28px 56px -28px ${tint(c, 0.6)}, 0 0 0 1px ${tint(c, 0.25)}` }}
                />
                <header className="relative flex items-center gap-3 px-5 pb-4 pt-[18px]">
                  <span
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover/card:scale-110 group-hover/card:-rotate-3"
                    style={{ background: `linear-gradient(140deg, ${tint(c, 0.16)}, ${tint(c, 0.06)})`, color: c, boxShadow: `inset 0 0 0 1px ${tint(c, 0.18)}` }}
                  >
                    <Icon className="h-[19px] w-[19px]" />
                  </span>
                  <h3 className="min-w-0 flex-1 truncate font-display text-[15.5px] font-bold tracking-[-0.01em] text-slate-900">
                    {cat.label}
                  </h3>
                  <span
                    className="flex-none rounded-md px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums"
                    style={{ background: tint(c, 0.1), color: c }}
                  >
                    {live.length}
                  </span>
                </header>

                <div className="mx-5 h-px bg-slate-100" />

                <ul className="relative flex-1 px-2.5 py-2">
                  {(flagship
                    ? [
                        { label: 'Every visa route, explained', hint: 'Fees · timelines · requirements', href: '/visa-types' },
                        { label: 'Visa cost calculator', hint: 'Fees + IHS + dependants', href: '/tools/cost-calculator' },
                        { label: 'Skilled Worker points check', hint: '70-point threshold', href: '/skilled-worker-points-check' },
                      ]
                    : top
                  ).map((t) => (
                    <li key={t.href + t.label}>
                      <Link href={t.href} className="group/row flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-slate-50">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold leading-tight text-slate-900 transition-colors group-hover/row:text-[var(--c)]">{t.label}</span>
                          <span className="block truncate text-[11.5px] text-slate-500">{t.hint}</span>
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 flex-none text-slate-300 transition-all group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-[var(--c)]" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <footer className="relative mx-5 border-t border-slate-100 py-3">
                  <Link
                    href={flagship ? '/visa-types' : `/category/${cat.id}`}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-bold transition-[gap] hover:gap-2.5"
                    style={{ color: c }}
                  >
                    {flagship ? 'Open the visa hub' : `All ${live.length} ${cat.label.toLowerCase()} tools`}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </footer>
              </section>
            );
          })}
        </div>

        {/* ─────────────  CLOSING BAND  ───────────── */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 sm:mt-16 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <p className="max-w-2xl text-[13.5px] leading-relaxed text-slate-500">
            <span className="font-bold text-slate-900">Independent &amp; private.</span> UKDesk is not
            affiliated with HMRC or the Home Office. Rates are audited weekly against official
            publications, and every calculation runs in your browser — nothing is stored.
          </p>
          <div className="mt-4 flex flex-none gap-5 sm:mt-0">
            <Link href="/sources" className="text-[13px] font-bold text-blue-700 hover:underline">Sources</Link>
            <Link href="/editorial-policy" className="text-[13px] font-bold text-blue-700 hover:underline">Policy</Link>
            <Link href="/news" className="text-[13px] font-bold text-blue-700 hover:underline">Updates</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
