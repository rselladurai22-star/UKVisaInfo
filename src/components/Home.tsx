'use client';

/**
 * UKDesk — Editorial Premium Homepage (May 2026 redesign v2)
 *
 *   1. Hero              — serif headline, search, quick chips
 *   2. Trust strip       — 4 quiet metrics
 *   3. Featured tools    — 4 popular quick-start cards
 *   4. Categories        — 8 category cards with top tools
 *   5. Immigration hub   — visa routes + tools + eligibility quiz
 *   6. Pulse band        — live UK reference figures
 *   7. Why UKDesk        — editorial value props
 *   8. Latest from       — 3 blog cards + news digest
 *   9. Closing CTA       — ink-black band
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles,
  CornerDownLeft, Command, BookOpen, TrendingUp, TrendingDown,
  Coffee, Eye, FileCheck, Calendar, Clock,
} from 'lucide-react';
import {
  APP_TILES, CATEGORIES, type CategoryId, type AppTile,
} from '../data/tools';

/* ─────────────────────────────────────────────
   BRAND TOKENS
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
   COMMAND INDEX — search
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
  { href: '/postcode',            title: 'Postcode super-lookup',   hint: 'Council, MP, NHS, police',  group: 'Place', keywords: ['postcode'] },
  { href: '/visa-types',          title: 'All UK visa routes',      hint: '14 routes · 2026 fees',     group: 'Visa',  keywords: ['visa','routes'] },
  { href: '/visa/skilled-worker', title: 'Skilled Worker visa',     hint: '£41,700 · sponsored',       group: 'Visa',  keywords: ['skilled','worker'] },
  { href: '/visa/student',        title: 'Student visa',            hint: '£558 · degree study',       group: 'Visa',  keywords: ['student'] },
  { href: '/visa/family',         title: 'Family visa',             hint: '£29,000 income',            group: 'Visa',  keywords: ['family','spouse'] },
  { href: '/eligibility',         title: 'Eligibility quiz',        hint: 'Match in 60 seconds',       group: 'Visa',  keywords: ['quiz'] },
  { href: '/settlement',          title: 'Settlement compare',      hint: 'ILR routes side-by-side',   group: 'Visa',  keywords: ['settlement','ilr'] },
  { href: '/blog',                title: 'All guides',              hint: '19 long-form articles',     group: 'Guide', keywords: ['guides','blog'] },
];

/* ─────────────────────────────────────────────
   FEATURED TOOLS — 4 popular quick-start cards
───────────────────────────────────────────── */
const FEATURED_TOOLS = [
  {
    href: '/take-home-pay',
    label: 'Take-home pay',
    hint: 'Salary after tax, NI and student loan',
    category: 'Tax',
    accent: EMERALD,
  },
  {
    href: '/stamp-duty-calculator',
    label: 'Stamp duty',
    hint: 'SDLT on any property purchase',
    category: 'Property',
    accent: GOLD,
  },
  {
    href: '/mortgage-affordability',
    label: 'Mortgage affordability',
    hint: 'How much can you borrow',
    category: 'Property',
    accent: SLATE,
  },
  {
    href: '/isa-calculator',
    label: 'ISA savings',
    hint: '20-year compound growth projections',
    category: 'Savings',
    accent: INK,
  },
];

/* ─────────────────────────────────────────────
   IMMIGRATION HUB DATA
───────────────────────────────────────────── */
const VISA_CATEGORY_CARDS = [
  {
    href: '/visa/skilled-worker',
    label: 'Work visas',
    desc: 'Skilled Worker · Health & Care · Global Talent · Innovator Founder',
    count: 4,
  },
  {
    href: '/visa/student',
    label: 'Study & Graduate',
    desc: 'Student · Graduate · Short-term study',
    count: 2,
  },
  {
    href: '/visa/family',
    label: 'Family & Visit',
    desc: 'Spouse · Standard Visitor · parent reunification',
    count: 2,
  },
  {
    href: '/visa/ilr',
    label: 'Settlement & Citizenship',
    desc: 'ILR · Citizenship · Long residence · EUSS',
    count: 6,
  },
];

const IMMIGRATION_TOOL_LINKS = [
  { href: '/ihs-calculator',               label: 'IHS health surcharge',    hint: 'Cost per year of visa' },
  { href: '/skilled-worker-points-check',  label: 'Points checker',          hint: 'Skilled Worker audit' },
  { href: '/visa-switching',               label: 'Visa switching guide',    hint: 'In-country changes' },
  { href: '/settlement',                   label: 'Settlement compare',      hint: 'ILR routes side-by-side' },
  { href: '/tools/cost-calculator',        label: 'Visa cost calculator',    hint: 'Fees + IHS + extras' },
];

/* ─────────────────────────────────────────────
   FEATURED ARTICLES — curated blog posts
───────────────────────────────────────────── */
const FEATURED_ARTICLES = [
  {
    slug: 'uk-skilled-worker-visa-salary-threshold-2026',
    title: 'Skilled Worker visa salary thresholds 2026',
    desc: 'Full SOC breakdown and how minimum salary is calculated by role.',
    category: 'Visa guide',
    date: '14 Apr 2026',
    mins: 12,
    accent: EMERALD,
  },
  {
    slug: 'uk-family-visa-minimum-income-2026-what-counts',
    title: 'Family visa £29,000 income requirement — what counts',
    desc: 'Which income sources qualify and how to evidence them for a successful application.',
    category: 'Visa guide',
    date: '2 Apr 2026',
    mins: 9,
    accent: GOLD,
  },
  {
    slug: 'uk-ilr-indefinite-leave-to-remain-2026-requirements',
    title: 'ILR 2026 — indefinite leave to remain requirements',
    desc: 'Absences, qualifying period, biometrics and the application process explained.',
    category: 'Settlement',
    date: '28 Mar 2026',
    mins: 14,
    accent: SLATE,
  },
];

const NEWS_ITEMS = [
  {
    slug: 'spring-2026-fee-uplift',
    title: 'Spring 2026 visa fee uplift — what changed on 9 April',
    date: '8 Apr 2026',
  },
  {
    slug: 'evisa-transition-2026',
    title: 'eVisa transition: BRP holders must act by 31 December 2026',
    date: '15 Mar 2026',
  },
];

/* ─────────────────────────────────────────────
   PULSE — live UK reference figures
───────────────────────────────────────────── */
interface PulseRow { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'flat'; source: string; }
const PULSE: PulseRow[] = [
  { label: 'Bank rate',          value: '4.25%',  delta: '−25 bp',  trend: 'down', source: 'BoE'    },
  { label: 'CPI inflation',      value: '2.1%',   delta: '−0.2 pp', trend: 'down', source: 'ONS'    },
  { label: 'Avg weekly wage',    value: '£697',   delta: '+4.1%',   trend: 'up',   source: 'ONS'    },
  { label: 'Skilled Worker min', value: '£41.7k', delta: 'Apr 26',                 source: 'gov.uk' },
  { label: 'Family visa min',    value: '£29k',   delta: 'income',                 source: 'gov.uk' },
  { label: 'IHS standard',       value: '£1,035', delta: 'per year',               source: 'gov.uk' },
];

/* ─────────────────────────────────────────────
   CATEGORY CARD COPY
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
        <div aria-hidden className="absolute inset-0 pointer-events-none"
             style={{
               background:
                 'radial-gradient(ellipse at 12% 8%, rgba(4,120,87,0.05) 0px, transparent 55%),' +
                 'radial-gradient(ellipse at 88% 80%, rgba(184,134,11,0.05) 0px, transparent 55%)',
             }} />
        <div aria-hidden className="absolute inset-0 opacity-[0.28] pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle, rgba(11,15,25,0.10) 1px, transparent 1px)',
               backgroundSize: '32px 32px',
               maskImage: 'radial-gradient(ellipse 70% 55% at 50% 35%, black, transparent)',
               WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 35%, black, transparent)',
             }} />

        <div className="relative max-w-[1180px] mx-auto px-5 md:px-10 text-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7"
               style={{ background: 'rgba(4,120,87,0.07)', border: '1px solid rgba(4,120,87,0.20)' }}>
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 ping-slow"
                    style={{ background: EMERALD }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: EMERALD }} />
            </span>
            <span className="text-[10.5px] font-bold uppercase"
                  style={{ color: EMERALD, letterSpacing: '0.18em' }}>
              {APP_TILES.length} tools live · verified May 2026
            </span>
          </div>

          <h1 className="mx-auto"
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
              }}>
            The quiet desk
            <br />
            <span style={{ fontStyle: 'italic', color: EMERALD }}>for UK life.</span>
          </h1>

          <p className="mx-auto mt-7 text-[17px] md:text-[19px] leading-[1.6]"
             style={{ color: SLATE, maxWidth: '620px', fontWeight: 400 }}>
            Calculators, visa routes and lookups for every part of UK life —
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
              <input ref={inputRef} value={query}
                     onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                     onFocus={() => setFocused(true)}
                     onBlur={() => setTimeout(() => setFocused(false), 160)}
                     onKeyDown={onKey}
                     placeholder="Search a tool, visa route or postcode…"
                     className="flex-1 px-4 py-[18px] bg-transparent outline-none text-[16px] font-medium placeholder:font-normal"
                     style={{ color: INK }} />
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
                    style={{ color: INK, background: PAPER, border: '1px solid rgba(11,15,25,0.09)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = EMERALD; e.currentTarget.style.color = EMERALD; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(11,15,25,0.09)'; e.currentTarget.style.color = INK; }}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          2. TRUST STRIP
      ═══════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px"
               style={{ background: HAIR, borderTop: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}>
            {[
              { value: APP_TILES.length, label: 'Calculators', hint: 'Live & maintained' },
              { value: '8',              label: 'Categories',  hint: 'Across UK life' },
              { value: '100%',           label: 'Sourced',     hint: 'gov.uk · HMRC · ONS' },
              { value: '£0',             label: 'Forever',     hint: 'No signup, no ads' },
            ].map((s) => (
              <div key={s.label} className="px-6 py-7 md:py-8" style={{ background: CREAM }}>
                <div className="tabular"
                     style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 38,
                              letterSpacing: '-0.04em', color: INK, lineHeight: 1 }}>
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
          3. FEATURED TOOLS — quick-start
      ═══════════════════════════════════ */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <p className="eyebrow mb-3">Popular right now</p>
              <h2 style={{
                fontFamily: 'Fraunces, serif', fontWeight: 600,
                fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)',
                lineHeight: 1.06, letterSpacing: '-0.028em', color: INK,
              }}>
                Start calculating in <span style={{ fontStyle: 'italic', color: EMERALD }}>seconds</span>.
              </h2>
            </div>
            <Link href="/tools"
                  className="hidden md:inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
                  style={{ color: INK }}
                  onMouseOver={(e) => { e.currentTarget.style.color = EMERALD; }}
                  onMouseOut={(e)  => { e.currentTarget.style.color = INK; }}>
              All {APP_TILES.length} tools
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {FEATURED_TOOLS.map((t) => (
              <Link key={t.href} href={t.href}
                    className="group relative block rounded-2xl overflow-hidden transition-all duration-200"
                    style={{
                      background: PAPER,
                      border: '1px solid rgba(11,15,25,0.08)',
                      padding: '24px 24px 20px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px -12px rgba(11,15,25,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {/* Accent bar */}
                <span className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{ background: t.accent }} aria-hidden />

                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.16em] mb-4 px-2 py-1 rounded-md"
                      style={{ background: 'rgba(11,15,25,0.05)', color: MUTED }}>
                  {t.category}
                </span>
                <h3 style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 600,
                  fontSize: 20, letterSpacing: '-0.02em', color: INK, lineHeight: 1.15,
                  marginBottom: 8,
                }}>
                  {t.label}
                </h3>
                <p className="text-[12.5px] leading-[1.5]" style={{ color: MUTED }}>
                  {t.hint}
                </p>
                <div className="flex items-center gap-1 mt-5 text-[12.5px] font-semibold"
                     style={{ color: t.accent }}>
                  Calculate
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          4. CATEGORIES — the main act
      ═══════════════════════════════════ */}
      <section className="relative py-16 md:py-24" style={{ background: '#F6F5F0' }}>
        <div className="absolute inset-x-0 top-0 ed-rule" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 ed-rule" aria-hidden />
        <div className="max-w-7xl mx-auto px-5 md:px-10">

          <div className="max-w-3xl mb-12 md:mb-16">
            <p className="eyebrow mb-4">The directory</p>
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontWeight: 600,
              fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
              lineHeight: 1.02, letterSpacing: '-0.03em', color: INK,
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}>
              Eight quiet shelves of <span style={{ fontStyle: 'italic', color: EMERALD }}>UK admin</span>,
              arranged for the eye.
            </h2>
            <p className="mt-5 text-[16px] md:text-[17px] leading-[1.65]"
               style={{ color: SLATE, maxWidth: '640px' }}>
              Pick a category to see the tools ready to use, or search above if you know what you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {CATEGORIES.map((c) => {
              const tools    = categoryTools[c.id];
              const topTools = tools.slice(0, 5);
              const overflow = tools.length - topTools.length;
              const copy     = CATEGORY_COPY[c.id];
              return (
                <article key={c.id}
                         className="group relative rounded-3xl overflow-hidden lift-on-hover"
                         style={{
                           background: PAPER,
                           border: '1px solid rgba(11,15,25,0.08)',
                           padding: '32px 32px 28px',
                         }}>
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
                    fontFamily: 'Fraunces, serif', fontWeight: 600,
                    fontSize: 30, letterSpacing: '-0.028em', color: INK, lineHeight: 1.05, marginBottom: 8,
                  }}>
                    {copy.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.55] mb-6" style={{ color: SLATE }}>{copy.deck}</p>

                  <ul className="space-y-0">
                    {topTools.map((t, idx) => (
                      <li key={t.href}
                          style={{ borderTop: idx === 0 ? `1px solid ${HAIR}` : 'none', borderBottom: `1px solid ${HAIR}` }}>
                        <Link href={t.href}
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
                              <span className="text-[14.5px] font-semibold truncate" style={{ color: INK }}>{t.label}</span>
                              {t.status === 'new' && (
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-px rounded flex-shrink-0"
                                      style={{ background: 'rgba(184,134,11,0.16)', color: GOLD }}>New</span>
                              )}
                            </div>
                            <div className="text-[12px] mt-0.5 truncate" style={{ color: MUTED }}>{t.hint}</div>
                          </div>
                          <ArrowRight data-arrow className="w-4 h-4 flex-shrink-0 transition-all duration-150"
                                      style={{ color: EMERALD, opacity: 0, transform: 'translateX(-4px)' }} />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between">
                    {overflow > 0 ? (
                      <Link href="/tools"
                            className="text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                            style={{ color: EMERALD }}>
                        + {overflow} more in {copy.title.toLowerCase()}
                      </Link>
                    ) : <span />}
                    <Link href="/tools"
                          className="text-[13px] font-semibold inline-flex items-center gap-1 transition-all"
                          style={{ color: INK }}>
                      View all <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          5. IMMIGRATION HUB
      ═══════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Soft gold glow */}
        <div aria-hidden className="absolute -right-40 top-0 w-[600px] h-[600px] rounded-full pointer-events-none"
             style={{ background: 'rgba(184,134,11,0.04)', filter: 'blur(80px)' }} />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left — visa route categories */}
            <div className="lg:col-span-7">
              <p className="eyebrow mb-4">Immigration</p>
              <h2 style={{
                fontFamily: 'Fraunces, serif', fontWeight: 600,
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                lineHeight: 1.04, letterSpacing: '-0.03em', color: INK, marginBottom: 16,
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}>
                UK visa routes — every path,{' '}
                <span style={{ fontStyle: 'italic', color: GOLD }}>explained clearly</span>.
              </h2>
              <p className="text-[15.5px] leading-[1.65] mb-8" style={{ color: SLATE, maxWidth: 540 }}>
                14 live visa routes, verified costs, English requirements and time to settlement —
                all sourced from gov.uk and updated for 2026.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {VISA_CATEGORY_CARDS.map((card) => (
                  <Link key={card.href} href={card.href}
                        className="group block rounded-2xl transition-all duration-200"
                        style={{
                          background: PAPER,
                          border: '1px solid rgba(11,15,25,0.09)',
                          padding: '20px 20px 18px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(184,134,11,0.40)';
                          e.currentTarget.style.boxShadow = '0 8px 28px -8px rgba(11,15,25,0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(11,15,25,0.09)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 style={{
                        fontFamily: 'Fraunces, serif', fontWeight: 600,
                        fontSize: 17, letterSpacing: '-0.016em', color: INK, lineHeight: 1.2,
                      }}>
                        {card.label}
                      </h3>
                      <span className="text-[10px] font-mono tabular-nums" style={{ color: MUTED }}>{card.count}</span>
                    </div>
                    <p className="text-[12px] leading-[1.5]" style={{ color: MUTED }}>{card.desc}</p>
                    <div className="flex items-center gap-1 mt-4 text-[12px] font-semibold"
                         style={{ color: GOLD }}>
                      Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>

              <Link href="/visa-types"
                    className="inline-flex items-center gap-2 mt-6 text-[13.5px] font-semibold"
                    style={{ color: INK }}
                    onMouseOver={(e) => { e.currentTarget.style.color = EMERALD; }}
                    onMouseOut={(e)  => { e.currentTarget.style.color = INK; }}>
                Compare all 14 visa routes side-by-side
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — tools + eligibility quiz */}
            <div className="lg:col-span-5 flex flex-col gap-4">

              {/* Eligibility quiz — featured card */}
              <Link href="/eligibility"
                    className="group relative block rounded-2xl overflow-hidden"
                    style={{ background: INK, color: CREAM, padding: '28px 28px 24px', minHeight: 180 }}>
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                     style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '16px 16px' }} aria-hidden />
                <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full pointer-events-none"
                     style={{ background: 'rgba(4,120,87,0.35)', filter: 'blur(36px)' }} aria-hidden />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4" style={{ color: '#A7F3D0' }} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: '#A7F3D0' }}>
                      Eligibility quiz
                    </span>
                  </div>
                  <div className="text-[22px] leading-[1.1] mb-3"
                       style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, letterSpacing: '-0.025em', color: CREAM }}>
                    Not sure which <span style={{ fontStyle: 'italic', color: '#A7F3D0' }}>visa</span> you need?
                  </div>
                  <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'rgba(250,250,247,0.60)' }}>
                    Six questions, sixty seconds. We match you to the right route.
                    No email required.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold group-hover:gap-2.5 transition-[gap] duration-150"
                        style={{ color: '#FBBF24' }}>
                    Start the quiz <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>

              {/* Immigration tools list */}
              <div className="rounded-2xl" style={{ background: PAPER, border: '1px solid rgba(11,15,25,0.08)', overflow: 'hidden' }}>
                <div className="px-5 pt-5 pb-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                    Immigration tools
                  </p>
                </div>
                <ul>
                  {IMMIGRATION_TOOL_LINKS.map((t, i) => (
                    <li key={t.href}
                        style={{ borderTop: i === 0 ? `1px solid ${HAIR}` : 'none', borderBottom: `1px solid ${HAIR}` }}>
                      <Link href={t.href}
                            className="group flex items-center justify-between gap-3 px-5 py-3.5 transition-colors"
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.03)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-semibold" style={{ color: INK }}>{t.label}</div>
                          <div className="text-[11.5px] mt-0.5" style={{ color: MUTED }}>{t.hint}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
                                    style={{ color: MUTED }} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          6. PULSE BAND — live UK figures
      ═══════════════════════════════════ */}
      <section className="relative py-12 md:py-16" style={{ background: '#F6F5F0' }}>
        <div className="absolute inset-x-0 top-0 ed-rule" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 ed-rule" aria-hidden />
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex items-baseline justify-between mb-7">
            <div>
              <p className="eyebrow">Today in the UK</p>
              <h3 className="mt-1"
                  style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em', color: INK }}>
                Reference rates the calculators read from.
              </h3>
            </div>
            <Link href="/news"
                  className="hidden md:inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                  style={{ color: INK }}>
              Read updates <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px" style={{ background: HAIR }}>
            {PULSE.map((p) => (
              <div key={p.label} className="px-5 py-5" style={{ background: '#F6F5F0' }}>
                <div className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: MUTED }}>{p.label}</div>
                <div className="mt-2 tabular"
                     style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 26,
                              letterSpacing: '-0.025em', color: INK, lineHeight: 1.1 }}>
                  {p.value}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {p.delta && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums"
                          style={{ color: p.trend === 'up' ? EMERALD : p.trend === 'down' ? '#9F1239' : SLATE }}>
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
          7. WHY UKDESK
      ═══════════════════════════════════ */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="max-w-2xl mb-14 md:mb-20">
            <p className="eyebrow mb-4">The principle</p>
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontWeight: 600,
              fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
              lineHeight: 1.02, letterSpacing: '-0.03em', color: INK,
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
                body: 'Every figure traces back to gov.uk, HMRC, ONS or the Bank of England. No editorial guesswork. Where a rule has nuance, we link to the gov.uk page that says so.',
                stat: '100% verified',
              },
              {
                icon: Coffee,
                title: 'Free, unhurried, no upsell',
                body: 'No accounts, no email harvesting, no consultancy funnel. The site is funded by discreet contextual ads on a few pages — the calculations themselves stay clean.',
                stat: '£0 forever',
              },
              {
                icon: Eye,
                title: 'Designed to be read',
                body: 'Plain English over legalese. Fraunces serif headings, generous line height, tabular numbers. The same calculation displayed twice is still one calculation.',
                stat: 'WCAG AA',
              },
            ].map((v) => (
              <div key={v.title} className="relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-7"
                     style={{ background: PAPER, border: `1px solid rgba(11,15,25,0.10)` }}>
                  <v.icon className="w-5 h-5" style={{ color: EMERALD }} />
                </div>
                <h3 style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 600,
                  fontSize: 22, letterSpacing: '-0.022em', color: INK, lineHeight: 1.2, marginBottom: 12,
                }}>
                  {v.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65]" style={{ color: SLATE }}>{v.body}</p>
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
          8. LATEST FROM UKDESK
      ═══════════════════════════════════ */}
      <section className="relative py-20 md:py-28" style={{ background: '#F6F5F0' }}>
        <div className="absolute inset-x-0 top-0 ed-rule" aria-hidden />
        <div className="max-w-7xl mx-auto px-5 md:px-10">

          <div className="flex items-end justify-between mb-10 md:mb-12">
            <div>
              <p className="eyebrow mb-4">In-depth reading</p>
              <h2 style={{
                fontFamily: 'Fraunces, serif', fontWeight: 600,
                fontSize: 'clamp(1.8rem, 3.6vw, 2.8rem)',
                lineHeight: 1.05, letterSpacing: '-0.03em', color: INK,
              }}>
                Latest from <span style={{ fontStyle: 'italic', color: EMERALD }}>UKDesk</span>.
              </h2>
            </div>
            <Link href="/blog"
                  className="hidden md:inline-flex items-center gap-1.5 text-[13px] font-semibold"
                  style={{ color: INK }}
                  onMouseOver={(e) => { e.currentTarget.style.color = EMERALD; }}
                  onMouseOut={(e)  => { e.currentTarget.style.color = INK; }}>
              All 19 guides <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Featured articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {FEATURED_ARTICLES.map((a) => (
              <article key={a.slug}
                       className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
                       style={{ background: PAPER, border: '1px solid rgba(11,15,25,0.08)' }}
                       onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px -12px rgba(11,15,25,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                       onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                {/* Category accent band */}
                <div style={{ height: 4, background: a.accent, flexShrink: 0 }} />

                <div className="flex flex-col flex-1 p-6">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.16em] mb-4"
                        style={{ color: a.accent }}>
                    {a.category}
                  </span>
                  <h3 style={{
                    fontFamily: 'Fraunces, serif', fontWeight: 600,
                    fontSize: 19, letterSpacing: '-0.018em', color: INK, lineHeight: 1.25,
                    marginBottom: 10,
                  }}>
                    {a.title}
                  </h3>
                  <p className="text-[13px] leading-[1.6] flex-1" style={{ color: SLATE }}>{a.desc}</p>

                  <div className="flex items-center justify-between mt-5 pt-4"
                       style={{ borderTop: `1px solid ${HAIR}` }}>
                    <div className="flex items-center gap-3 text-[11.5px]" style={{ color: MUTED }}>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{a.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />{a.mins} min
                      </span>
                    </div>
                    <Link href={`/blog/${a.slug}`}
                          className="inline-flex items-center gap-1 text-[12px] font-semibold"
                          style={{ color: a.accent }}>
                      Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* News digest */}
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ background: PAPER, border: '1px solid rgba(11,15,25,0.08)' }}>
            <div className="flex items-center justify-between px-6 py-4"
                 style={{ borderBottom: `1px solid ${HAIR}` }}>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                Latest news
              </p>
              <Link href="/news" className="text-[12px] font-semibold"
                    style={{ color: EMERALD }}>
                View all <ArrowUpRight className="inline w-3 h-3" />
              </Link>
            </div>
            {NEWS_ITEMS.map((n, i) => (
              <div key={n.slug}
                   style={{ borderBottom: i < NEWS_ITEMS.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
                <Link href={`/news/${n.slug}`}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-colors"
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <p className="text-[14px] font-semibold leading-tight" style={{ color: INK }}>{n.title}</p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11.5px]" style={{ color: MUTED }}>{n.date}</span>
                    <ArrowRight className="w-4 h-4" style={{ color: MUTED }} />
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/blog"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
                  style={{ color: INK }}>
              All 19 guides <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          9. CLOSING CTA
      ═══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: INK, color: CREAM }}>
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" aria-hidden
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full pointer-events-none" aria-hidden
             style={{ background: 'rgba(4,120,87,0.30)', filter: 'blur(80px)' }} />
        <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full pointer-events-none" aria-hidden
             style={{ background: 'rgba(184,134,11,0.22)', filter: 'blur(80px)' }} />

        <div className="relative max-w-5xl mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
          <p className="eyebrow mb-5" style={{ color: '#A7F3D0' }}>Ready to start?</p>
          <h2 style={{
            fontFamily: 'Fraunces, serif', fontWeight: 600,
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            lineHeight: 1.0, letterSpacing: '-0.035em', color: CREAM,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
            maxWidth: '22ch', margin: '0 auto',
          }}>
            Everything you need for <span style={{ fontStyle: 'italic', color: '#FDE68A' }}>UK life</span>,
            in one place.
          </h2>
          <p className="mt-7 text-[16px] md:text-[17.5px] leading-[1.6] mx-auto"
             style={{ color: 'rgba(250,250,247,0.62)', maxWidth: '560px' }}>
            Calculators, visa guides, postcode lookups and more — all free, verified and updated.
            No account needed, ever.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/tools"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-[14px] font-semibold transition-all"
                  style={{ background: CREAM, color: INK, boxShadow: '0 8px 28px -8px rgba(255,255,255,0.30)' }}>
              <BookOpen className="w-4 h-4" style={{ color: EMERALD }} />
              Browse all calculators
            </Link>
            <Link href="/eligibility"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-[14px] font-semibold transition-all"
                  style={{ background: 'rgba(250,250,247,0.06)', color: CREAM, border: '1px solid rgba(250,250,247,0.16)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(250,250,247,0.10)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(250,250,247,0.06)'; }}>
              <Sparkles className="w-4 h-4" />
              Visa eligibility quiz
            </Link>
          </div>

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
