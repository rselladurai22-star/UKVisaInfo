'use client';

/**
 * UKDesk — Homepage (Lexend Deca / blog.hubspot.com type system)
 *
 * Sections:
 *   1. Hero            — big bold sans headline, search, quick chips
 *   2. Featured tools  — one large card + two compact cards (HubSpot "featured story")
 *   3. Categories      — 2-col grid of 8 category cards w/ inline tool list
 *   4. Pulse band      — slim row of live UK reference rates
 *   5. Why UKDesk      — three editorial value props
 *   6. Closing CTA     — ink-black band → eligibility quiz
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
   FONT + BRAND TOKENS
───────────────────────────────────────────── */
const FONT     = '"Lexend Deca", -apple-system, system-ui, sans-serif';
const INK      = '#213343';   // HubSpot navy
const CREAM    = '#FFFFFF';   // page surface — pure white
const PAPER    = '#FFFFFF';   // card surface
const EMERALD  = '#FF7A59';   // HubSpot brand orange (legacy name kept)
const GOLD     = '#B8860B';   // warm gold complement (unchanged)
const SLATE    = '#516F90';   // HubSpot slate body text
const MUTED    = '#7C98B6';   // HubSpot light slate
const HAIR     = 'rgba(33,51,67,0.08)';

/* ─────────────────────────────────────────────
   COMMAND INDEX (search)
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
  { href: '/postcode',            title: 'Postcode super-lookup', hint: 'Council, MP, NHS, police', group: 'Place', keywords: ['postcode'] },
  { href: '/visa-types',          title: 'All UK visa routes',    hint: '14 routes · 2026 fees',    group: 'Visa',  keywords: ['visa','routes'] },
  { href: '/visa/skilled-worker', title: 'Skilled Worker visa',   hint: '£41,700 · sponsored',      group: 'Visa',  keywords: ['skilled','worker'] },
  { href: '/visa/student',        title: 'Student visa',          hint: '£558 · degree study',      group: 'Visa',  keywords: ['student'] },
  { href: '/visa/family',         title: 'Family visa',           hint: '£29,000 income',           group: 'Visa',  keywords: ['family','spouse'] },
  { href: '/eligibility',         title: 'Eligibility quiz',      hint: 'Match in 60 seconds',      group: 'Visa',  keywords: ['quiz'] },
  { href: '/settlement',          title: 'Settlement compare',    hint: 'ILR routes side-by-side',  group: 'Visa',  keywords: ['settlement','ilr'] },
  { href: '/blog',                title: 'All guides',            hint: '19 long-form articles',    group: 'Guide', keywords: ['guides','blog'] },
];

/* ─────────────────────────────────────────────
   PULSE — live UK reference figures
───────────────────────────────────────────── */
interface PulseRow {
  label: string; value: string; delta?: string;
  trend?: 'up' | 'down' | 'flat'; source: string;
}
const PULSE: PulseRow[] = [
  { label: 'Bank rate',          value: '4.25%',  delta: '−25 bp',  trend: 'down', source: 'BoE'    },
  { label: 'CPI inflation',      value: '2.1%',   delta: '−0.2 pp', trend: 'down', source: 'ONS'    },
  { label: 'Avg weekly wage',    value: '£697',   delta: '+4.1%',   trend: 'up',   source: 'ONS'    },
  { label: 'Skilled Worker min', value: '£41.7k', delta: 'Apr 26',                 source: 'gov.uk' },
  { label: 'Family visa min',    value: '£29k',   delta: 'income',                 source: 'gov.uk' },
  { label: 'IHS standard',       value: '£1,035', delta: 'per year',               source: 'gov.uk' },
];

/* ─────────────────────────────────────────────
   CATEGORY COPY
───────────────────────────────────────────── */
const CATEGORY_COPY: Record<CategoryId, { title: string; deck: string }> = {
  tax:         { title: 'Tax & Income',       deck: 'PAYE, NI, dividends, CGT and the codes on your payslip.' },
  employment:  { title: 'Employment',         deck: 'Pay, leave, redundancy, statutory rights at work.' },
  property:    { title: 'Property',           deck: 'Mortgages, SDLT, council tax, buy-to-let economics.' },
  savings:     { title: 'Savings & Pensions', deck: 'ISA, LISA, drawdown, state pension forecasting.' },
  business:    { title: 'Business',           deck: 'Sole trader vs Ltd, IR35, contractor day-rate math.' },
  immigration: { title: 'Immigration',        deck: 'Visa routes, IHS, Skilled Worker points, postcode lookup.' },
  benefits:    { title: 'Benefits',           deck: 'Child benefit, childcare costs and family support.' },
  vehicles:    { title: 'Vehicles',           deck: 'ULEZ, CAZ, MOT and tax compliance checks.' },
};

/* ─────────────────────────────────────────────
   FEATURED TOOLS — HubSpot "featured story" trio
───────────────────────────────────────────── */
const FEATURED_PRIMARY_HREF  = '/take-home-pay';
const FEATURED_SECONDARY: string[] = ['/stamp-duty-calculator', '/postcode'];

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

  const featuredPrimary  = useMemo(() => APP_TILES.find((t) => t.href === FEATURED_PRIMARY_HREF), []);
  const featuredSecondary = useMemo(
    () => FEATURED_SECONDARY.map((href) => APP_TILES.find((t) => t.href === href)).filter(Boolean) as AppTile[],
    [],
  );

  return (
    <div style={{ background: CREAM, color: INK, fontFamily: FONT }}>

      {/* ═══════════════════════════════════
          1. HERO
      ═══════════════════════════════════ */}
      <section className="relative pt-[120px] md:pt-[140px] pb-14 md:pb-20 overflow-hidden">
        {/* Soft cream gradient backdrop */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
             style={{
               background:
                 'radial-gradient(ellipse at 12% 10%, rgba(255,122,89,0.045) 0px, transparent 55%),' +
                 'radial-gradient(ellipse at 88% 85%, rgba(184,134,11,0.045) 0px, transparent 55%)',
             }} />

        <div className="relative max-w-[1200px] mx-auto px-5 md:px-10">

          {/* Eyebrow */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full"
                 style={{ background: 'rgba(255,122,89,0.07)', border: '1px solid rgba(255,122,89,0.20)' }}>
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 ping-slow" style={{ background: EMERALD }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: EMERALD }} />
              </span>
              <span style={{
                fontFamily: FONT, color: EMERALD, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                {APP_TILES.length} tools live · verified May 2026
              </span>
            </div>
          </div>

          {/* Big bold sans headline — HubSpot blog feel */}
          <h1 className="mx-auto text-center"
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 'clamp(2.6rem, 6.4vw, 5.2rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
                color: INK,
                maxWidth: '18ch',
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}>
            Every UK calculator,{' '}
            <span style={{ color: EMERALD }}>in one quiet place.</span>
          </h1>

          {/* Deck */}
          <p className="mx-auto mt-7 text-center"
             style={{
               fontFamily: FONT, color: SLATE,
               fontSize: 18, lineHeight: 1.6, fontWeight: 400,
               maxWidth: 640,
             }}>
            Take-home pay, mortgage, stamp duty, council tax, postcode lookup,
            every UK visa route — verified against gov.uk, HMRC and ONS. Free, no signup.
          </p>

          {/* SEARCH */}
          <div className="relative mt-10 max-w-[680px] mx-auto">
            <div className="relative flex items-center rounded-2xl transition-all"
                 style={{
                   background: PAPER,
                   border: `1px solid ${focused ? EMERALD : 'rgba(33,51,67,0.10)'}`,
                   boxShadow: focused
                     ? '0 0 0 5px rgba(255,122,89,0.10), 0 18px 44px -12px rgba(33,51,67,0.18)'
                     : '0 6px 22px -6px rgba(33,51,67,0.10), 0 1px 2px rgba(33,51,67,0.04)',
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
                className="flex-1 px-4 py-[18px] bg-transparent outline-none"
                style={{ color: INK, fontFamily: FONT, fontSize: 16, fontWeight: 500 }}
              />
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 mr-3 rounded-md"
                    style={{
                      background: 'rgba(33,51,67,0.05)', color: SLATE,
                      fontFamily: FONT, fontSize: 11, fontWeight: 600,
                    }}>
                <Command className="w-3 h-3" /> K
              </span>
            </div>

            {focused && query && results.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-30 text-left"
                   style={{
                     background: PAPER,
                     border: '1px solid rgba(33,51,67,0.10)',
                     boxShadow: '0 28px 64px -16px rgba(33,51,67,0.24)',
                   }}>
                {results.map((r, i) => (
                  <Link key={r.href} href={r.href} onMouseEnter={() => setActive(i)}
                        className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors"
                        style={{ background: i === active ? 'rgba(255,122,89,0.06)' : 'transparent' }}>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: INK }}
                           className="truncate">{r.title}</div>
                      <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED, marginTop: 2 }}
                           className="truncate">{r.hint}</div>
                    </div>
                    <span style={{
                      fontFamily: FONT, fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      background: 'rgba(33,51,67,0.05)', color: SLATE,
                      padding: '4px 8px', borderRadius: 6,
                    }}>
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
            <span style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED,
            }}>Try</span>
            {[
              { href: '/take-home-pay',          label: 'Take-home pay' },
              { href: '/stamp-duty-calculator',  label: 'Stamp duty' },
              { href: '/postcode',               label: 'Postcode' },
              { href: '/visa/skilled-worker',    label: 'Skilled Worker' },
              { href: '/mortgage-affordability', label: 'Mortgage' },
            ].map((c) => (
              <Link key={c.href} href={c.href}
                    className="transition-all"
                    style={{
                      fontFamily: FONT, fontSize: 13, fontWeight: 500,
                      color: INK, background: PAPER,
                      border: '1px solid rgba(33,51,67,0.09)',
                      padding: '6px 14px', borderRadius: 999,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = EMERALD;
                      e.currentTarget.style.color = EMERALD;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(33,51,67,0.09)';
                      e.currentTarget.style.color = INK;
                    }}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          2. FEATURED — HubSpot "featured story" trio
      ═══════════════════════════════════ */}
      {featuredPrimary && (
        <section className="relative pb-6 md:pb-10">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10">
            <div className="flex items-baseline justify-between mb-6">
              <p style={{
                fontFamily: FONT, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: EMERALD,
              }}>
                Featured tools
              </p>
              <Link href="/tools"
                    className="inline-flex items-center gap-1.5"
                    style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: INK }}>
                See all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">

              {/* Primary featured card — spans 2 cols on lg */}
              <Link href={featuredPrimary.href}
                    className="group relative lg:col-span-2 rounded-3xl overflow-hidden lift-on-hover"
                    style={{
                      background: PAPER,
                      border: '1px solid rgba(33,51,67,0.08)',
                      minHeight: 320,
                      padding: '36px 36px 32px',
                    }}>
                {/* Decorative emerald wash */}
                <div aria-hidden className="absolute inset-0 pointer-events-none"
                     style={{
                       background:
                         'radial-gradient(ellipse at 90% 10%, rgba(255,122,89,0.08) 0px, transparent 55%)',
                     }} />
                <div className="relative h-full flex flex-col">
                  <p style={{
                    fontFamily: FONT, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD,
                  }}>
                    Most used · {CATEGORY_COPY[featuredPrimary.category].title}
                  </p>
                  <h3 style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)',
                    lineHeight: 1.08,
                    letterSpacing: '-0.025em',
                    color: INK,
                    marginTop: 12,
                    textWrap: 'balance' as React.CSSProperties['textWrap'],
                  }}>
                    {featuredPrimary.label}
                  </h3>
                  <p style={{
                    fontFamily: FONT, fontSize: 16, lineHeight: 1.6,
                    color: SLATE, marginTop: 12, maxWidth: '52ch',
                  }}>
                    {featuredPrimary.hint}. PAYE, National Insurance, student loan
                    plans 1/2/4/5, pension salary sacrifice, all 2026/27 rates from HMRC.
                  </p>
                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2"
                          style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: EMERALD }}>
                      Try it now
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span style={{
                      fontFamily: FONT, fontSize: 11, fontWeight: 600,
                      color: MUTED, letterSpacing: '0.06em',
                    }}>
                      gov.uk · HMRC verified
                    </span>
                  </div>
                </div>
              </Link>

              {/* Two secondary featured cards */}
              <div className="grid grid-cols-1 gap-5 lg:gap-6">
                {featuredSecondary.map((t) => (
                  <Link key={t.href} href={t.href}
                        className="group relative rounded-3xl overflow-hidden lift-on-hover"
                        style={{
                          background: PAPER,
                          border: '1px solid rgba(33,51,67,0.08)',
                          padding: '24px 26px 22px',
                          minHeight: 152,
                        }}>
                    <div className="h-full flex flex-col">
                      <p style={{
                        fontFamily: FONT, fontSize: 10.5, fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase', color: EMERALD,
                      }}>
                        {CATEGORY_COPY[t.category].title}
                      </p>
                      <h4 style={{
                        fontFamily: FONT, fontWeight: 700, fontSize: 20,
                        lineHeight: 1.15, letterSpacing: '-0.02em', color: INK,
                        marginTop: 8,
                      }}>
                        {t.label}
                      </h4>
                      <p style={{
                        fontFamily: FONT, fontSize: 13.5, lineHeight: 1.5,
                        color: SLATE, marginTop: 6,
                      }}>
                        {t.hint}
                      </p>
                      <div className="mt-auto pt-3">
                        <span className="inline-flex items-center gap-1.5"
                              style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: INK }}>
                          Open
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          3. CATEGORIES — main directory
      ═══════════════════════════════════ */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">

          {/* Section heading */}
          <div className="max-w-3xl mb-12 md:mb-14">
            <p style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: EMERALD,
              marginBottom: 14,
            }}>
              The directory
            </p>
            <h2 style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.03em',
              color: INK,
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}>
              Eight shelves of UK admin, arranged for the eye.
            </h2>
            <p style={{
              fontFamily: FONT, fontSize: 17, lineHeight: 1.6,
              color: SLATE, marginTop: 18, maxWidth: 640,
            }}>
              Pick a category to see what we have ready, or use the search above
              if you already know what you need.
            </p>
          </div>

          {/* Grid of category cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {CATEGORIES.map((c, catIdx) => {
              const tools = categoryTools[c.id];
              const topTools = tools.slice(0, 5);
              const overflow = tools.length - topTools.length;
              const copy = CATEGORY_COPY[c.id];
              return (
                <article key={c.id}
                         className="group relative rounded-3xl overflow-hidden lift-on-hover"
                         style={{
                           background: PAPER,
                           border: '1px solid rgba(33,51,67,0.08)',
                           padding: '30px 30px 26px',
                         }}>
                  <div className="flex items-baseline justify-between mb-3">
                    <p style={{
                      fontFamily: FONT, fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD,
                    }}>
                      0{catIdx + 1}
                    </p>
                    <span style={{
                      fontFamily: FONT, fontSize: 11, fontWeight: 500,
                      color: MUTED, fontVariantNumeric: 'tabular-nums',
                    }}>
                      {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 26,
                    letterSpacing: '-0.025em',
                    color: INK,
                    lineHeight: 1.1,
                    marginBottom: 8,
                  }}>
                    {copy.title}
                  </h3>

                  <p style={{
                    fontFamily: FONT, fontSize: 14.5, lineHeight: 1.55,
                    color: SLATE, marginBottom: 22,
                  }}>
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
                              <span style={{
                                fontFamily: FONT, fontSize: 14.5, fontWeight: 600, color: INK,
                              }} className="truncate">
                                {t.label}
                              </span>
                              {t.status === 'new' && (
                                <span style={{
                                  fontFamily: FONT, fontSize: 9, fontWeight: 700,
                                  letterSpacing: '0.10em', textTransform: 'uppercase',
                                  background: 'rgba(184,134,11,0.16)', color: GOLD,
                                  padding: '2px 6px', borderRadius: 4,
                                }} className="flex-shrink-0">
                                  New
                                </span>
                              )}
                            </div>
                            <div style={{
                              fontFamily: FONT, fontSize: 12, color: MUTED, marginTop: 2,
                            }} className="truncate">{t.hint}</div>
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
                            className="inline-flex items-center gap-1.5"
                            style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: EMERALD }}>
                        <span>+ {overflow} more in {copy.title.toLowerCase()}</span>
                      </Link>
                    ) : <span />}
                    <Link href="/tools"
                          className="inline-flex items-center gap-1"
                          style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: INK }}>
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
          4. PULSE BAND — live UK reference rates
      ═══════════════════════════════════ */}
      <section className="relative py-12 md:py-16" style={{ background: '#F6F5F0' }}>
        <div className="absolute inset-x-0 top-0 ed-rule" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 ed-rule" aria-hidden />
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="flex items-baseline justify-between mb-7">
            <div>
              <p style={{
                fontFamily: FONT, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: EMERALD,
              }}>
                Today in the UK
              </p>
              <h3 style={{
                fontFamily: FONT, fontWeight: 700, fontSize: 22,
                letterSpacing: '-0.018em', color: INK, marginTop: 6,
              }}>
                Reference rates the calculators read from.
              </h3>
            </div>
            <Link href="/news"
                  className="hidden md:inline-flex items-center gap-1.5"
                  style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: INK }}>
              Read updates
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px"
               style={{ background: HAIR }}>
            {PULSE.map((p) => (
              <div key={p.label} className="px-5 py-5" style={{ background: '#F6F5F0' }}>
                <div style={{
                  fontFamily: FONT, fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED,
                }}>
                  {p.label}
                </div>
                <div style={{
                  fontFamily: FONT, fontWeight: 700, fontSize: 26,
                  letterSpacing: '-0.025em', color: INK, lineHeight: 1.1,
                  marginTop: 8, fontVariantNumeric: 'tabular-nums',
                }}>
                  {p.value}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {p.delta && (
                    <span className="inline-flex items-center gap-1"
                          style={{
                            fontFamily: FONT, fontSize: 11, fontWeight: 600,
                            fontVariantNumeric: 'tabular-nums',
                            color: p.trend === 'up' ? EMERALD : p.trend === 'down' ? '#9F1239' : SLATE,
                          }}>
                      {p.trend === 'up'   && <TrendingUp   className="w-3 h-3" />}
                      {p.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {p.delta}
                    </span>
                  )}
                  <span style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 500, color: MUTED }}>
                    {p.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          5. WHY UKDESK — three value props
      ═══════════════════════════════════ */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="max-w-2xl mb-14 md:mb-18">
            <p style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: EMERALD,
              marginBottom: 14,
            }}>
              The principle
            </p>
            <h2 style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.03em',
              color: INK,
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}>
              Built like a good reference book — slow to age, easy to trust.
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
                body: 'Plain English over legalese. Lexend Deca type for proven readability, generous ' +
                      'line height, tabular numbers. Clarity is the whole product.',
                stat: 'WCAG AA',
              },
            ].map((v) => (
              <div key={v.title} className="relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                     style={{ background: PAPER, border: '1px solid rgba(33,51,67,0.10)' }}>
                  <v.icon className="w-5 h-5" style={{ color: EMERALD }} />
                </div>
                <h3 style={{
                  fontFamily: FONT, fontWeight: 700, fontSize: 20,
                  letterSpacing: '-0.02em', color: INK, lineHeight: 1.2,
                  marginBottom: 12,
                }}>
                  {v.title}
                </h3>
                <p style={{
                  fontFamily: FONT, fontSize: 14.5, lineHeight: 1.65, color: SLATE,
                }}>
                  {v.body}
                </p>
                <div className="mt-5 inline-flex items-center gap-2"
                     style={{
                       fontFamily: FONT, fontSize: 12, fontWeight: 600,
                       color: EMERALD, fontVariantNumeric: 'tabular-nums',
                     }}>
                  <span className="w-4 h-px" style={{ background: EMERALD }} />
                  {v.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          6. CLOSING CTA — ink band
      ═══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: INK, color: CREAM }}>
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" aria-hidden
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full pointer-events-none" aria-hidden
             style={{ background: 'rgba(255,122,89,0.30)', filter: 'blur(80px)' }} />
        <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full pointer-events-none" aria-hidden
             style={{ background: 'rgba(184,134,11,0.22)', filter: 'blur(80px)' }} />

        <div className="relative max-w-5xl mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A7F3D0',
            marginBottom: 18,
          }}>
            One more thing
          </p>
          <h2 style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 'clamp(2.1rem, 4.8vw, 3.8rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            color: CREAM,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
            maxWidth: '22ch',
            margin: '0 auto',
          }}>
            Not sure where to start? <span style={{ color: '#FDE68A' }}>Take the quiz.</span>
          </h2>
          <p style={{
            fontFamily: FONT, fontSize: 17, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.62)', maxWidth: 560,
            margin: '24px auto 0',
          }}>
            Sixty seconds, six questions. We match you to the visa route, the calculators
            and the guides most useful for your situation. No email needed.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/eligibility"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl transition-all"
                  style={{
                    fontFamily: FONT, fontSize: 14, fontWeight: 600,
                    background: CREAM, color: INK,
                    boxShadow: '0 8px 28px -8px rgba(255,255,255,0.30)',
                  }}>
              <Sparkles className="w-4 h-4" style={{ color: EMERALD }} />
              Start eligibility quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tools"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl transition-all"
                  style={{
                    fontFamily: FONT, fontSize: 14, fontWeight: 600,
                    background: 'rgba(255,255,255,0.06)', color: CREAM,
                    border: '1px solid rgba(255,255,255,0.16)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
              <BookOpen className="w-4 h-4" />
              Browse the toolkit
            </Link>
          </div>

          {/* Tiny trust line */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
               style={{ fontFamily: FONT, fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>
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
