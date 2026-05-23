'use client';

/**
 * UKDesk — Editorial Premium Homepage (May 2026 redesign)
 *
 * Tools have moved into the header mega-menu. The homepage now reads as
 * a calm editorial hub:
 *
 *   1. Hero          — serif headline, search, quick chips
 *   2. Trust strip   — 4 quiet metrics
 *   3. Categories    — the main act: 8 large cards, top tools listed inline
 *   4. Pulse band    — slim row of live UK figures (proves currency)
 *   5. Why UKDesk    — three editorial value props
 *   6. Closing CTA   — ink-black band linking to eligibility quiz
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles,
  CornerDownLeft, Command, BookOpen, TrendingUp, TrendingDown,
  Coffee, Eye, FileCheck,
} from 'lucide-react';
import {
  APP_TILES, CATEGORIES, type CategoryId, type AppTile,
} from '../data/tools';

/* ─────────────────────────────────────────────
   BRAND TOKENS — Editorial Premium
───────────────────────────────────────────── */
const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const PAPER   = '#FFFFFF';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

/* ─────────────────────────────────────────────
   COMMAND INDEX (search) — slim, just for nav
───────────────────────────────────────────── */
interface CommandItem {
  href: string; title: string; hint: string;
  group: 'Tool' | 'Visa' | 'Guide' | 'Place';
  keywords: string[];
}
const COMMAND_INDEX: CommandItem[] = [
  ...APP_TILES.map<CommandItem>((t) => ({
    href: t.href, title: t.label, hint: t.hint,
    group: 'Tool', keywords: t.label.toLowerCase().split(/\s+/),
  })),
  { href: '/postcode',        title: 'Postcode super-lookup',  hint: 'Council, MP, NHS, police', group: 'Place', keywords: ['postcode'] },
  { href: '/visa-types',      title: 'All UK visa routes',     hint: '14 routes · 2026 fees',    group: 'Visa',  keywords: ['visa','routes'] },
  { href: '/visa/skilled-worker', title: 'Skilled Worker visa', hint: '£41,700 · sponsored',     group: 'Visa',  keywords: ['skilled','worker'] },
  { href: '/visa/student',    title: 'Student visa',           hint: '£558 · degree study',      group: 'Visa',  keywords: ['student'] },
  { href: '/visa/family',     title: 'Family visa',            hint: '£29,000 income',           group: 'Visa',  keywords: ['family','spouse'] },
  { href: '/eligibility',     title: 'Eligibility quiz',       hint: 'Match in 60 seconds',      group: 'Visa',  keywords: ['quiz'] },
  { href: '/settlement',      title: 'Settlement compare',     hint: 'ILR routes side-by-side',  group: 'Visa',  keywords: ['settlement','ilr'] },
  { href: '/blog',            title: 'All guides',             hint: '19 long-form articles',    group: 'Guide', keywords: ['guides','blog'] },
];

/* ─────────────────────────────────────────────
   PULSE — live UK reference figures
───────────────────────────────────────────── */
interface PulseRow {
  label: string; value: string; delta?: string;
  trend?: 'up' | 'down' | 'flat'; source: string;
}
const PULSE: PulseRow[] = [
  { label: 'Bank rate',           value: '4.25%',  delta: '−25 bp',  trend: 'down', source: 'BoE'    },
  { label: 'CPI inflation',       value: '2.1%',   delta: '−0.2 pp', trend: 'down', source: 'ONS'    },
  { label: 'Avg weekly wage',     value: '£697',   delta: '+4.1%',   trend: 'up',   source: 'ONS'    },
  { label: 'Skilled Worker min',  value: '£41.7k', delta: 'Apr 26',                 source: 'gov.uk' },
  { label: 'Family visa min',     value: '£29k',   delta: 'income',                  source: 'gov.uk' },
  { label: 'IHS standard',        value: '£1,035', delta: 'per year',                source: 'gov.uk' },
];

/* ─────────────────────────────────────────────
   CATEGORY CARD COPY — editorial framing for each
───────────────────────────────────────────── */
const CATEGORY_COPY: Record<CategoryId, { title: string; deck: string }> = {
  tax:         { title: 'Tax & Income',        deck: 'PAYE, NI, dividends, CGT and the codes on your payslip.' },
  employment:  { title: 'Employment',          deck: 'Pay, leave, redundancy, statutory rights at work.' },
  property:    { title: 'Property',            deck: 'Mortgages, SDLT, council tax, buy-to-let economics.' },
  savings:     { title: 'Savings & Pensions',  deck: 'ISA, LISA, drawdown, state pension forecasting.' },
  business:    { title: 'Business',            deck: 'Sole trader vs Ltd, IR35, contractor day-rate math.' },
  immigration: { title: 'Immigration',         deck: 'Visa routes, IHS, Skilled Worker points, postcode lookup.' },
  benefits:    { title: 'Benefits',            deck: 'Child benefit, childcare costs and family support.' },
  vehicles:    { title: 'Vehicles',            deck: 'ULEZ, CAZ, MOT and tax compliance checks.' },
};

/* ═════════════════════════════════════════════
   PAGE
═════════════════════════════════════════════ */
export default function Home() {
  const router = useRouter();
  const [query, setQuery]     = useState('');
  const [active, setActive]   = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const isPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(q);
    if (isPostcode) return [{
      href: `/postcode/${q.replace(/\s+/g, '').toUpperCase()}`,
      title: `Look up postcode ${q.toUpperCase()}`,
      hint: 'Council · MP · NHS · police · ward',
      group: 'Place' as const, keywords: [],
    }];
    return COMMAND_INDEX.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.hint.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.includes(q)),
    ).slice(0, 7);
  }, [query]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); const t = results[active]; if (t) router.push(t.href); }
    if (e.key === 'Escape')    { inputRef.current?.blur(); }
  };

  const categoryTools = useMemo(() => {
    const map: Record<CategoryId, AppTile[]> = {} as Record<CategoryId, AppTile[]>;
    CATEGORIES.forEach((c) => { map[c.id] = APP_TILES.filter((t) => t.category === c.id); });
    return map;
  }, []);

  return (
    <div style={{ background: CREAM, color: INK, fontFamily: 'Inter, sans-serif' }}>

      {/* ═══════════════════════════════════
          1. HERO
      ═══════════════════════════════════ */}
      <section className="relative pt-[120px] md:pt-[150px] pb-16 md:pb-24 overflow-hidden">
        {/* Soft cream gradient backdrop */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
             style={{
               background:
                 'radial-gradient(ellipse at 12% 8%, rgba(4,120,87,0.05) 0px, transparent 55%),' +
                 'radial-gradient(ellipse at 88% 80%, rgba(184,134,11,0.05) 0px, transparent 55%)',
             }} />
        {/* Hairline grid texture */}
        <div aria-hidden className="absolute inset-0 opacity-[0.28] pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle, rgba(11,15,25,0.10) 1px, transparent 1px)',
               backgroundSize: '32px 32px',
               maskImage: 'radial-gradient(ellipse 70% 55% at 50% 35%, black, transparent)',
               WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 35%, black, transparent)',
             }} />

        <div className="relative max-w-[1180px] mx-auto px-5 md:px-10 text-center">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7"
               style={{ background: 'rgba(4,120,87,0.07)', border: '1px solid rgba(4,120,87,0.20)' }}>
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 ping-slow" style={{ background: EMERALD }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: EMERALD }} />
            </span>
            <span className="text-[10.5px] font-bold uppercase" style={{ color: EMERALD, letterSpacing: '0.18em' }}>
              {APP_TILES.length} tools live · verified May 2026
            </span>
          </div>

          {/* Mega headline — Fraunces serif */}
          <h1
            className="mx-auto"
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              fontSize: 'clamp(2.7rem, 7vw, 5.6rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.035em',
              color: INK,
              maxWidth: '17ch',
              fontOpticalSizing: 'auto',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            The quiet desk
            <br />
            <span style={{ fontStyle: 'italic', color: EMERALD }}>for UK life.</span>
          </h1>

          {/* Deck */}
          <p className="mx-auto mt-7 text-[17px] md:text-[19px] leading-[1.6]"
             style={{ color: SLATE, maxWidth: '620px', fontWeight: 400 }}>
            One unhurried place for every UK calculator, visa route and lookup —
            verified against gov.uk, HMRC and ONS. No signup, no clutter.
          </p>

          {/* SEARCH */}
          <div className="relative mt-10 max-w-[660px] mx-auto">
            <div className="relative flex items-center rounded-2xl transition-all"
                 style={{
                   background: PAPER,
                   border: `1px solid ${focused ? EMERALD : 'rgba(11,15,25,0.10)'}`,
                   boxShadow: focused
                     ? '0 0 0 5px rgba(4,120,87,0.10), 0 18px 44px -12px rgba(11,15,25,0.18)'
                     : '0 6px 22px -6px rgba(11,15,25,0.10), 0 1px 2px rgba(11,15,25,0.04)',
                 }}>
              <Search className="w-5 h-5 ml-5 flex-shrink-0" style={{ color: focused ? EMERALD : MUTED }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 160)}
                onKeyDown={onKey}
                placeholder="Search a tool, postcode or visa…"
                className="flex-1 px-4 py-[18px] bg-transparent outline-none text-[16px] font-medium placeholder:font-normal"
                style={{ color: INK }}
              />
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 mr-3 rounded-md text-[11px] font-semibold"
                    style={{ background: 'rgba(11,15,25,0.05)', color: SLATE }}>
                <Command className="w-3 h-3" /> K
              </span>
            </div>

            {focused && query && results.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-30 text-left"
                   style={{
                     background: PAPER,
                     border: '1px solid rgba(11,15,25,0.10)',
                     boxShadow: '0 28px 64px -16px rgba(11,15,25,0.24)',
                   }}>
                {results.map((r, i) => (
                  <Link key={r.href} href={r.href} onMouseEnter={() => setActive(i)}
                        className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors"
                        style={{ background: i === active ? 'rgba(4,120,87,0.06)' : 'transparent' }}>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold truncate" style={{ color: INK }}>{r.title}</div>
                      <div className="text-[12px] truncate mt-0.5" style={{ color: MUTED }}>{r.hint}</div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1 rounded-md"
                          style={{ background: 'rgba(11,15,25,0.05)', color: SLATE }}>
                      {r.group}
                    </span>
                    <CornerDownLeft className="w-3.5 h-3.5" style={{ color: MUTED }} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: MUTED }}>Try</span>
            {[
              { href: '/take-home-pay',         label: 'Take-home pay' },
              { href: '/stamp-duty-calculator', label: 'Stamp duty' },
              { href: '/postcode',              label: 'Postcode' },
              { href: '/visa/skilled-worker',   label: 'Skilled Worker' },
              { href: '/mortgage-affordability', label: 'Mortgage' },
            ].map((c) => (
              <Link key={c.href} href={c.href}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-full transition-all"
                    style={{
                      color: INK,
                      background: PAPER,
                      border: '1px solid rgba(11,15,25,0.09)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = EMERALD;
                      e.currentTarget.style.color = EMERALD;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(11,15,25,0.09)';
                      e.currentTarget.style.color = INK;
                    }}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          2. TRUST STRIP — quiet metrics
      ═══════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px"
               style={{ background: HAIR, borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}>
            {[
              { value: APP_TILES.length, label: 'Calculators',  hint: 'Live & maintained' },
              { value: '8',              label: 'Categories',   hint: 'Across UK life' },
              { value: '100%',           label: 'Sourced',      hint: 'gov.uk · HMRC · ONS' },
              { value: '£0',             label: 'Forever',      hint: 'No signup, no ads' },
            ].map((s) => (
              <div key={s.label} className="px-6 py-7 md:py-8" style={{ background: CREAM }}>
                <div className="tabular"
                     style={{ fontFamily: 'Fraunces, serif', fontWeight: 700,
                              fontSize: 38, letterSpacing: '-0.04em', color: INK, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div className="mt-2 text-[13px] font-semibold" style={{ color: INK }}>{s.label}</div>
                <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{s.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          3. CATEGORIES — the main act
      ═══════════════════════════════════ */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-10">

          {/* Section heading */}
          <div className="max-w-3xl mb-12 md:mb-16">
            <p className="eyebrow mb-4">The directory</p>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: INK,
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}>
              Eight quiet shelves of <span style={{ fontStyle: 'italic', color: EMERALD }}>UK admin</span>,
              arranged for the eye.
            </h2>
            <p className="mt-5 text-[16px] md:text-[17px] leading-[1.65]"
               style={{ color: SLATE, maxWidth: '640px' }}>
              Pick a category to see the tools we have ready, or use the search above
              if you already know what you need. Everything reachable from the menu.
            </p>
          </div>

          {/* Grid of category cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {CATEGORIES.map((c) => {
              const tools = categoryTools[c.id];
              const topTools = tools.slice(0, 5);
              const overflow = tools.length - topTools.length;
              const copy = CATEGORY_COPY[c.id];
              return (
                <article key={c.id}
                         className="group relative rounded-3xl overflow-hidden lift-on-hover"
                         style={{
                           background: PAPER,
                           border: '1px solid rgba(11,15,25,0.08)',
                           padding: '32px 32px 28px',
                         }}>
                  {/* Gold accent line on hover */}
                  <span aria-hidden
                        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                        style={{ background: EMERALD, opacity: 0 }} />

                  <div className="flex items-baseline justify-between mb-2">
                    <p className="eyebrow" style={{ color: GOLD }}>
                      0{CATEGORIES.findIndex((x) => x.id === c.id) + 1}
                    </p>
                    <span className="text-[11px] font-mono tabular-nums font-medium" style={{ color: MUTED }}>
                      {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'Fraunces, serif',
                    fontWeight: 600,
                    fontSize: 30,
                    letterSpacing: '-0.028em',
                    color: INK,
                    lineHeight: 1.05,
                    marginBottom: 8,
                  }}>
                    {copy.title}
                  </h3>

                  <p className="text-[14.5px] leading-[1.55] mb-6" style={{ color: SLATE }}>
                    {copy.deck}
                  </p>

                  {/* Top tools list */}
                  <ul className="space-y-0">
                    {topTools.map((t, idx) => (
                      <li key={t.href}
                          style={{
                            borderTop: idx === 0 ? `1px solid ${HAIR}` : 'none',
                            borderBottom: `1px solid ${HAIR}`,
                          }}>
                        <Link
                          href={t.href}
                          className="group/row flex items-center justify-between gap-3 py-3 transition-colors"
                          onMouseEnter={(e) => {
                            const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement | null;
                            if (arrow) { arrow.style.opacity = '1'; arrow.style.transform = 'translateX(0)'; }
                          }}
                          onMouseLeave={(e) => {
                            const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement | null;
                            if (arrow) { arrow.style.opacity = '0'; arrow.style.transform = 'translateX(-4px)'; }
                          }}>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[14.5px] font-semibold truncate" style={{ color: INK }}>
                                {t.label}
                              </span>
                              {t.status === 'new' && (
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-px rounded flex-shrink-0"
                                      style={{ background: 'rgba(184,134,11,0.16)', color: GOLD }}>
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] mt-0.5 truncate" style={{ color: MUTED }}>{t.hint}</div>
                          </div>
                          <ArrowRight
                            data-arrow
                            className="w-4 h-4 flex-shrink-0 transition-all duration-150"
                            style={{ color: EMERALD, opacity: 0, transform: 'translateX(-4px)' }}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Overflow link */}
                  <div className="mt-5 flex items-center justify-between">
                    {overflow > 0 ? (
                      <Link href="/tools"
                            className="text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                            style={{ color: EMERALD }}>
                        <span>+ {overflow} more in {copy.title.toLowerCase()}</span>
                      </Link>
                    ) : <span />}
                    <Link href="/tools"
                          className="text-[13px] font-semibold inline-flex items-center gap-1 transition-all"
                          style={{ color: INK }}>
                      View all
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          4. PULSE BAND — quiet live figures
      ═══════════════════════════════════ */}
      <section className="relative py-12 md:py-16" style={{ background: '#F6F5F0' }}>
        <div className="absolute inset-x-0 top-0 ed-rule" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 ed-rule" aria-hidden />
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex items-baseline justify-between mb-7">
            <div>
              <p className="eyebrow">Today in the UK</p>
              <h3 className="mt-1"
                  style={{
                    fontFamily: 'Fraunces, serif', fontWeight: 600,
                    fontSize: 22, letterSpacing: '-0.02em', color: INK,
                  }}>
                Reference rates the calculators read from.
              </h3>
            </div>
            <Link href="/news"
                  className="hidden md:inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                  style={{ color: INK }}>
              Read updates
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px"
               style={{ background: HAIR }}>
            {PULSE.map((p) => (
              <div key={p.label} className="px-5 py-5" style={{ background: '#F6F5F0' }}>
                <div className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                  {p.label}
                </div>
                <div className="mt-2 tabular"
                     style={{ fontFamily: 'Fraunces, serif', fontWeight: 700,
                              fontSize: 26, letterSpacing: '-0.025em', color: INK, lineHeight: 1.1 }}>
                  {p.value}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {p.delta && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums"
                          style={{
                            color: p.trend === 'up' ? EMERALD : p.trend === 'down' ? '#9F1239' : SLATE,
                          }}>
                      {p.trend === 'up'   && <TrendingUp   className="w-3 h-3" />}
                      {p.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {p.delta}
                    </span>
                  )}
                  <span className="text-[10.5px] font-medium" style={{ color: MUTED }}>{p.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          5. WHY UKDESK — editorial value props
      ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="max-w-2xl mb-14 md:mb-20">
            <p className="eyebrow mb-4">The principle</p>
            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: INK,
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}>
              Built like a <span style={{ fontStyle: 'italic', color: EMERALD }}>good reference book</span>{' '}
              — slow to age, easy to trust.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-14">
            {[
              {
                icon: FileCheck,
                title: 'Sourced from primary records',
                body: 'Every figure traces back to gov.uk, HMRC, ONS or the Bank of England. ' +
                      'No editorial guesswork. Where a rule has nuance, we link to the gov.uk page that says so.',
                stat: '100% verified',
              },
              {
                icon: Coffee,
                title: 'Free, unhurried, no upsell',
                body: 'No accounts, no email harvesting, no consultancy funnel. The site is funded by ' +
                      'discreet contextual ads on a few pages — the calculations themselves stay clean.',
                stat: '£0 forever',
              },
              {
                icon: Eye,
                title: 'Designed to be read',
                body: 'Plain English over legalese. Fraunces serif headings, generous line height, ' +
                      'tabular numbers. The same calculation displayed twice is still one calculation.',
                stat: 'WCAG AA',
              },
            ].map((v) => (
              <div key={v.title} className="relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-7"
                     style={{ background: PAPER, border: `1px solid rgba(11,15,25,0.10)` }}>
                  <v.icon className="w-5 h-5" style={{ color: EMERALD }} />
                </div>
                <h3 style={{
                  fontFamily: 'Fraunces, serif',
                  fontWeight: 600,
                  fontSize: 22,
                  letterSpacing: '-0.022em',
                  color: INK,
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}>
                  {v.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65]" style={{ color: SLATE }}>
                  {v.body}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold tabular-nums"
                     style={{ color: EMERALD }}>
                  <span className="w-4 h-px" style={{ background: EMERALD }} />
                  {v.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          6. CLOSING CTA — ink-black band
      ═══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: INK, color: CREAM }}>
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" aria-hidden
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full pointer-events-none" aria-hidden
             style={{ background: 'rgba(4,120,87,0.30)', filter: 'blur(80px)' }} />
        <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full pointer-events-none" aria-hidden
             style={{ background: 'rgba(184,134,11,0.22)', filter: 'blur(80px)' }} />

        <div className="relative max-w-5xl mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
          <p className="eyebrow mb-5" style={{ color: '#A7F3D0' }}>One more thing</p>
          <h2 style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 600,
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            color: CREAM,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
            maxWidth: '20ch',
            margin: '0 auto',
          }}>
            Not sure where to start?{' '}
            <span style={{ fontStyle: 'italic', color: '#FDE68A' }}>Take the quiz.</span>
          </h2>
          <p className="mt-7 text-[16px] md:text-[17.5px] leading-[1.6] mx-auto"
             style={{ color: 'rgba(250,250,247,0.62)', maxWidth: '560px' }}>
            Sixty seconds, six questions. We match you to the visa route, the calculators
            and the guides most useful for your situation. No email needed.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/eligibility"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-[14px] font-semibold transition-all"
                  style={{
                    background: CREAM,
                    color: INK,
                    boxShadow: '0 8px 28px -8px rgba(255,255,255,0.30)',
                  }}>
              <Sparkles className="w-4 h-4" style={{ color: EMERALD }} />
              Start eligibility quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tools"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-[14px] font-semibold transition-all"
                  style={{ background: 'rgba(250,250,247,0.06)', color: CREAM, border: '1px solid rgba(250,250,247,0.16)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(250,250,247,0.10)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(250,250,247,0.06)'; }}>
              <BookOpen className="w-4 h-4" />
              Browse the toolkit
            </Link>
          </div>

          {/* Tiny trust line */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px]"
               style={{ color: 'rgba(250,250,247,0.45)' }}>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" style={{ color: '#A7F3D0' }} />
              gov.uk verified
            </span>
            <span>Independent editorial</span>
            <span>Updated May 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
}
