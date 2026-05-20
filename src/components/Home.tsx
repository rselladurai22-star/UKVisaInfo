'use client';

/**
 * UKDesk home — app-launcher / command-bar layout.
 *
 * Structurally different from a marketing page: the visitor lands on
 * something that *behaves* like a product. A command bar dominates the
 * fold; below it sits an app-grid of colored tool tiles; a UK Pulse
 * rail shows live-ish national stats (BoE rate, CPI, FX) so the page
 * always feels "today".
 *
 *   ┌──── HERO COMMAND BAR ────┐ ┌── (search w/ instant suggestions) ──┐
 *   ├──── APP GRID (8 tiles) ──┤ ├──── UK PULSE rail ──────────────────┤
 *   ├──── INTENT ROWS ─────────┤ (Just landed / Moving home / Hiring)
 *   ├──── FEATURED GUIDES ─────┤
 *   └──── FOOTER CTA ──────────┘
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wallet, HomeIcon, MapPin, Plane, Calculator, Building2,
  ListChecks, Briefcase, GraduationCap,
  Search, ArrowRight, ArrowUpRight, TrendingUp, TrendingDown,
  Activity, Newspaper, Sparkles, Command, CornerDownLeft,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   BRAND TOKENS
───────────────────────────────────────────── */
const NAVY = '#0A2540';
const TEAL = '#00C4B4';
const GOLD = '#C9A14A';
const ROSE = '#E11D48';
const VIOLET = '#7C3AED';
const BLUE = '#2563EB';
const EMERALD = '#10B981';
const AMBER = '#F59E0B';

/* ─────────────────────────────────────────────
   DATA — App-launcher tiles
───────────────────────────────────────────── */

interface AppTile {
  href: string;
  label: string;
  hint: string;
  icon: typeof Wallet;
  accent: string;
  live: boolean;
  kbd?: string;
}

const APP_TILES: AppTile[] = [
  { href: '/take-home-pay',          label: 'Take-home Pay',   hint: 'PAYE + NI + student loan',         icon: Wallet,     accent: TEAL,    live: true,  kbd: 'P' },
  { href: '/mortgage-affordability', label: 'Mortgage',        hint: 'Max borrow + stress test',          icon: HomeIcon,   accent: GOLD,    live: true,  kbd: 'M' },
  { href: '/stamp-duty-calculator',  label: 'Stamp Duty',      hint: 'SDLT 2026 · FTB relief',            icon: Calculator, accent: BLUE,    live: true,  kbd: 'S' },
  { href: '/council-tax-band',       label: 'Council Tax',     hint: 'All 8 bands by postcode',           icon: Building2,  accent: NAVY,    live: true,  kbd: 'C' },
  { href: '/postcode',               label: 'Postcode',        hint: 'Council, MP, NHS, police',          icon: MapPin,     accent: VIOLET,  live: true,  kbd: 'L' },
  { href: '/cost-of-living-uk',      label: 'Cost of Living',  hint: 'Compare any two UK cities',         icon: ListChecks, accent: EMERALD, live: true,  kbd: 'O' },
  { href: '/visa-types',             label: 'UK Visas',        hint: '14 routes, 2026 fees',              icon: Plane,      accent: ROSE,    live: true,  kbd: 'V' },
  { href: '/tools/cost-calculator',  label: 'Visa Cost',       hint: 'Fees + IHS + dependants',           icon: Calculator, accent: AMBER,   live: true,  kbd: 'X' },
];

/* ─────────────────────────────────────────────
   COMMAND-BAR — flat searchable index
───────────────────────────────────────────── */

interface CommandItem {
  href: string;
  title: string;
  hint: string;
  group: 'Tools' | 'Visas' | 'Guides' | 'Places';
  keywords: string[];
}

const COMMAND_INDEX: CommandItem[] = [
  // Tools
  { href: '/take-home-pay',          title: 'Take-home Pay calculator', hint: 'PAYE · NI · student loan · pension', group: 'Tools', keywords: ['salary', 'pay', 'net', 'paye', 'tax', 'income'] },
  { href: '/mortgage-affordability', title: 'Mortgage affordability',   hint: 'Max borrow + FCA +3% stress test',   group: 'Tools', keywords: ['mortgage', 'borrow', 'house', 'home', 'loan'] },
  { href: '/stamp-duty-calculator',  title: 'Stamp Duty (SDLT)',        hint: '2026 rates · FTB relief · surcharges', group: 'Tools', keywords: ['sdlt', 'stamp', 'duty', 'buying', 'property'] },
  { href: '/council-tax-band',       title: 'Council Tax band lookup',  hint: 'A–H bands · annual bill estimate',    group: 'Tools', keywords: ['council', 'tax', 'band', 'rates'] },
  { href: '/cost-of-living-uk',      title: 'Cost of Living',           hint: 'Rent · groceries · transport',         group: 'Tools', keywords: ['cost', 'living', 'compare', 'city', 'rent'] },
  { href: '/tools/cost-calculator',  title: 'Visa cost calculator',     hint: 'Fees + IHS + dependants',             group: 'Tools', keywords: ['visa', 'cost', 'fee', 'ihs'] },
  { href: '/tools/salary-checker',   title: 'SOC salary checker',       hint: '270 SOC codes · going rates',         group: 'Tools', keywords: ['soc', 'salary', 'sponsor'] },
  { href: '/tools/sponsor-search',   title: 'Sponsor licence search',   hint: '126,530 licensed UK sponsors',        group: 'Tools', keywords: ['sponsor', 'employer', 'licence'] },
  // Places
  { href: '/postcode',               title: 'Postcode super-lookup',    hint: 'Council, MP, NHS, police, ward',      group: 'Places', keywords: ['postcode', 'mp', 'council', 'nhs', 'police'] },
  // Visas
  { href: '/visa/skilled-worker',    title: 'Skilled Worker visa',      hint: '£41,700 · employer sponsored',         group: 'Visas',  keywords: ['skilled', 'worker', 'job', 'employment'] },
  { href: '/visa/student',           title: 'Student visa',             hint: '£558 · degree-level study',            group: 'Visas',  keywords: ['student', 'study', 'university'] },
  { href: '/visa/family',            title: 'Family visa',              hint: '£29,000 income · spouse',              group: 'Visas',  keywords: ['family', 'spouse', 'partner', 'marriage'] },
  { href: '/visa/visitor',           title: 'Standard Visitor',         hint: '£135 · tourism / business',            group: 'Visas',  keywords: ['visitor', 'tourist', 'business'] },
  { href: '/visa/graduate',          title: 'Graduate visa',            hint: '2 years post-study',                   group: 'Visas',  keywords: ['graduate', 'post study'] },
  { href: '/visa/global-talent',     title: 'Global Talent',            hint: 'No sponsor · endorsed',                group: 'Visas',  keywords: ['talent', 'endorsement'] },
  { href: '/visa/health-and-care',   title: 'Health & Care Worker',     hint: 'NHS / care · IHS waived',              group: 'Visas',  keywords: ['nhs', 'care', 'health'] },
  { href: '/settlement',             title: 'ILR · settlement',         hint: '£3,226 · indefinite leave',            group: 'Visas',  keywords: ['ilr', 'settlement', 'indefinite'] },
  { href: '/eligibility',            title: 'Eligibility quiz',         hint: 'Find your route in 60s',               group: 'Visas',  keywords: ['quiz', 'eligibility', 'match'] },
  // Guides
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026', title: 'Skilled Worker thresholds 2026', hint: 'Full SOC table', group: 'Guides', keywords: ['salary', 'threshold'] },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts', title: 'Family visa £29,000 income', hint: 'What counts', group: 'Guides', keywords: ['family', '29000', 'income'] },
  { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate', title: 'eVisa migration guide', hint: 'Beat the deadline', group: 'Guides', keywords: ['evisa', 'brp'] },
];

/* ─────────────────────────────────────────────
   UK PULSE — verifiable headline stats
   (intentionally short, dated, sourced)
───────────────────────────────────────────── */

interface PulseRow { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'flat'; source: string; }

const PULSE: PulseRow[] = [
  { label: 'Bank rate',          value: '4.25%',  delta: '−25 bp',  trend: 'down', source: 'BoE' },
  { label: 'CPI inflation',      value: '2.1%',   delta: '−0.2 pp', trend: 'down', source: 'ONS' },
  { label: 'Avg weekly wage',    value: '£697',   delta: '+4.1%',   trend: 'up',   source: 'ONS' },
  { label: '£ / €',              value: '1.18',   delta: '+0.4%',   trend: 'up',   source: 'BoE' },
  { label: '£ / $',              value: '1.27',   delta: '−0.2%',   trend: 'down', source: 'BoE' },
  { label: 'Skilled Worker min', value: '£41.7k', delta: '8 Apr 26',                source: 'gov.uk' },
];

/* ─────────────────────────────────────────────
   INTENT ROWS — "I'm here because…"
───────────────────────────────────────────── */

interface Intent {
  id: string;
  title: string;
  desc: string;
  icon: typeof Briefcase;
  steps: { href: string; label: string }[];
  accent: string;
}

const INTENTS: Intent[] = [
  {
    id: 'work',
    title: 'I want to work in the UK',
    desc: 'Find a sponsor, check the salary threshold, see your take-home.',
    icon: Briefcase,
    accent: TEAL,
    steps: [
      { href: '/visa/skilled-worker',  label: 'Skilled Worker visa' },
      { href: '/tools/sponsor-search', label: 'Find a UK sponsor' },
      { href: '/take-home-pay',        label: 'Take-home pay' },
      { href: '/tools/salary-checker', label: 'SOC salary check' },
    ],
  },
  {
    id: 'live',
    title: 'I want to buy or rent a UK home',
    desc: 'See what you can borrow, the SDLT bill and the council tax band.',
    icon: HomeIcon,
    accent: GOLD,
    steps: [
      { href: '/mortgage-affordability', label: 'Mortgage affordability' },
      { href: '/stamp-duty-calculator',  label: 'Stamp Duty' },
      { href: '/council-tax-band',       label: 'Council Tax band' },
      { href: '/cost-of-living-uk',      label: 'Cost of living' },
    ],
  },
  {
    id: 'local',
    title: 'I just moved — what is around me?',
    desc: 'One postcode tells you the council, MP, NHS region, police force and more.',
    icon: MapPin,
    accent: VIOLET,
    steps: [
      { href: '/postcode',          label: 'Postcode super-lookup' },
      { href: '/council-tax-band',  label: 'Council Tax for the area' },
      { href: '/cost-of-living-uk', label: 'Cost of living' },
    ],
  },
  {
    id: 'study',
    title: 'I want to study or stay after a degree',
    desc: 'Student route, Graduate route, and pathways toward settlement.',
    icon: GraduationCap,
    accent: BLUE,
    steps: [
      { href: '/visa/student',  label: 'Student visa' },
      { href: '/visa/graduate', label: 'Graduate route' },
      { href: '/settlement',    label: 'Settlement options' },
      { href: '/eligibility',   label: 'Eligibility quiz' },
    ],
  },
];

const FEATURED_GUIDES = [
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',    title: 'Skilled Worker salary thresholds 2026', read: '8 min', tag: 'Visas',   accent: ROSE  },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',  title: 'Family visa £29,000 — what counts',     read: '7 min', tag: 'Visas',   accent: ROSE  },
  { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026', title: 'How to find a sponsor licence holder',  read: '9 min', tag: 'Money',   accent: TEAL  },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ⌘K / Ctrl-K focus shortcut */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  /* Filter command index */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    // postcode-like? send straight to /postcode/<value>
    const isPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(q);
    if (isPostcode) {
      return [{
        href: `/postcode/${q.replace(/\s+/g, '').toUpperCase()}`,
        title: `Look up postcode ${q.toUpperCase()}`,
        hint: 'Council, MP, NHS, police, ward, parish, school',
        group: 'Places' as const,
        keywords: [],
      }];
    }
    return COMMAND_INDEX.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.hint.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.includes(q)) ||
      c.group.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter')     {
      e.preventDefault();
      const target = results[active];
      if (target) router.push(target.href);
    }
    if (e.key === 'Escape')    { inputRef.current?.blur(); }
  };

  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════
          HERO — Command bar
      ════════════════════════════════════════ */}
      <section className="relative pt-[100px] md:pt-[120px] pb-10 md:pb-14">
        {/* Soft grid backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[420px] pointer-events-none -z-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(10,37,64,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,37,64,0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
          }}
        />

        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Status chip */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#f3f4f5] text-[#45464d]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="relative flex items-center justify-center w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
              live · 8 tools · 19 guides
            </span>
          </div>

          {/* Question + command bar */}
          <h1
            className="text-center font-bold text-[#0A2540] tracking-[-0.025em]"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(1.85rem, 4.5vw, 3rem)',
              lineHeight: '1.1',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            What do you need to figure out today?
          </h1>

          <div className="relative mt-8 max-w-2xl mx-auto">
            <div
              className={`flex items-center gap-3 bg-white border rounded-2xl pl-5 pr-2 py-2 shadow-[0_8px_32px_-4px_rgba(16,26,54,0.10)] transition-all duration-150 ${focused ? 'border-[#0A2540] shadow-[0_12px_36px_-4px_rgba(16,26,54,0.18)]' : 'border-[#E5E7EB]'}`}
            >
              <Search className="w-5 h-5 text-[#76777e] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onKeyDown={onKey}
                placeholder="Search tools, visas, guides — or paste a postcode"
                className="flex-1 min-w-0 bg-transparent text-[15px] md:text-[16px] text-[#0A2540] placeholder:text-[#a5a6ad] outline-none py-2.5"
                style={{ fontFamily: 'Inter, sans-serif' }}
                autoCapitalize="off"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-[#76777e] bg-[#f3f4f5] border border-[#E5E7EB] rounded-md px-1.5 py-1 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Command className="w-3 h-3" /> K
              </kbd>
            </div>

            {/* Results popover */}
            {focused && results.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-[0_24px_48px_-8px_rgba(16,26,54,0.20)] overflow-hidden z-30"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <ul>
                  {results.map((r, i) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[13.5px] ${i === active ? 'bg-[#f6f7f8]' : 'hover:bg-[#f6f7f8]'}`}
                        onMouseEnter={() => setActive(i)}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[#0A2540] truncate">{r.title}</div>
                          <div className="text-[12px] text-[#76777e] truncate">{r.hint}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#76777e]">
                            {r.group}
                          </span>
                          <CornerDownLeft className="w-3.5 h-3.5 text-[#76777e]" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 text-[11px] text-[#76777e] bg-[#fafbfc] border-t border-[#E5E7EB] flex items-center justify-between">
                  <span>↑↓ navigate · ⏎ open · esc close</span>
                  <span className="tabular-nums">{results.length} result{results.length === 1 ? '' : 's'}</span>
                </div>
              </div>
            )}

            {/* Suggestion chips */}
            {!query && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[12.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="text-[#76777e]">Try:</span>
                {['take-home pay', 'mortgage', 'SW1A 1AA', 'skilled worker', 'sdlt'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setQuery(s); setActive(0); inputRef.current?.focus(); }}
                    className="px-2.5 py-1 rounded-full bg-[#f3f4f5] hover:bg-[#e7e9ec] text-[#0A2540] font-medium transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          APP GRID + UK PULSE
      ════════════════════════════════════════ */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-5 md:gap-6">

            {/* App-launcher grid */}
            <div className="col-span-12 lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-bold tracking-[-0.015em]"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#76777e' }}
                >
                  Apps
                </h2>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] hover:underline"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-3.5">
                {APP_TILES.map((t) => <AppTileCard key={t.href} t={t} />)}
              </div>
            </div>

            {/* UK Pulse rail */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-bold tracking-[-0.015em]"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#76777e' }}
                >
                  UK Pulse
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Activity className="w-3 h-3" /> 20 May
                </span>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
                {PULSE.map((p, i) => <PulseLine key={p.label} p={p} last={i === PULSE.length - 1} />)}
              </div>
              <p className="mt-3 text-[11px] text-[#76777e] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Sources: Bank of England, ONS, gov.uk. Refreshed daily.
              </p>
            </aside>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          INTENT ROWS — what brought you here?
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 border-y border-[#E5E7EB] bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Quick paths
            </p>
            <h2
              className="font-bold text-[#0A2540] tracking-[-0.015em]"
              style={{
                fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                lineHeight: '1.15',
              }}
            >
              Or pick what brought you here.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {INTENTS.map((i) => <IntentCard key={i.id} intent={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED GUIDES
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Newspaper className="inline w-3 h-3 mr-1 -mt-0.5" />
                From the desk
              </p>
              <h2
                className="font-bold text-[#0A2540] tracking-[-0.015em]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  lineHeight: '1.15',
                }}
              >
                Recent guides worth reading.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0A2540] hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {FEATURED_GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group block bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(16,26,54,0.15)] transition-all duration-150"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[10.5px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md"
                    style={{
                      background: `${g.accent}14`,
                      color: g.accent,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {g.tag}
                  </span>
                  <span className="text-[11px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {g.read}
                  </span>
                </div>
                <h3
                  className="font-bold text-[#0A2540] text-[16px] md:text-[17px] leading-[1.3] tracking-[-0.005em]"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                >
                  {g.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] group-hover:gap-2 transition-[gap] duration-100" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Read article <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER NOTE — sourcing
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-16 bg-[#0A2540] text-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="md:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5EEAD9] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Sparkles className="inline w-3 h-3 mr-1 -mt-0.5" />
                Built differently
              </p>
              <h2
                className="font-bold tracking-[-0.015em] leading-[1.15]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                }}
              >
                Every figure on UKDesk is verified line-by-line against the official source.
              </h2>
              <p className="mt-4 text-[14.5px] md:text-[15px] text-[#bcc5e9] leading-[1.6] max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                Tax bands from HMRC. Visa fees from gov.uk. Postcode data from postcodes.io and the UK Parliament Members API.
                Council Tax ratios from the statutory instrument. Mortgage stress test from FCA MCOB. No paid placements, no email harvesting, no signup wall.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-[#0A2540] bg-[#5EEAD9] hover:bg-[#7BEFE0] px-5 py-3 rounded-lg active:scale-[0.98] transition-all duration-100"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Open all tools <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-white/[0.08] border border-white/20 hover:bg-white/[0.14] px-5 py-3 rounded-lg transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                How we source data
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function AppTileCard({ t }: { t: AppTile }) {
  const Icon = t.icon;
  return (
    <Link
      href={t.href}
      className="group relative bg-white border border-[#E5E7EB] rounded-xl p-4 md:p-5 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(16,26,54,0.15)] transition-all duration-150 flex flex-col gap-3 min-h-[148px]"
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex w-11 h-11 rounded-xl items-center justify-center"
          style={{ background: `${t.accent}14`, color: t.accent }}
        >
          <Icon className="w-5 h-5" />
        </span>
        {t.kbd && (
          <kbd className="hidden md:inline-flex items-center text-[10px] font-semibold text-[#76777e] bg-[#f6f7f8] border border-[#E5E7EB] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'Inter, sans-serif' }}>
            {t.kbd}
          </kbd>
        )}
      </div>
      <div>
        <h3
          className="font-bold text-[#0A2540] text-[14.5px] md:text-[15px] tracking-[-0.005em] leading-tight"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        >
          {t.label}
        </h3>
        <p className="mt-1 text-[12px] text-[#76777e] leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
          {t.hint}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-xl"
        style={{ background: t.accent }}
      />
    </Link>
  );
}

function PulseLine({ p, last }: { p: PulseRow; last: boolean }) {
  const TrendIcon = p.trend === 'up' ? TrendingUp : p.trend === 'down' ? TrendingDown : null;
  const trendColor = p.trend === 'up' ? '#10B981' : p.trend === 'down' ? '#E11D48' : '#76777e';

  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 ${last ? '' : 'border-b border-[#E5E7EB]'}`}>
      <div className="min-w-0">
        <div className="text-[12.5px] text-[#45464d] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
          {p.label}
        </div>
        <div className="text-[10px] text-[#a5a6ad] uppercase tracking-[0.06em]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {p.source}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div
          className="font-bold text-[#0A2540] text-[15px] tabular-nums"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        >
          {p.value}
        </div>
        {p.delta && (
          <div
            className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold tabular-nums"
            style={{ color: trendColor, fontFamily: 'Inter, sans-serif' }}
          >
            {TrendIcon && <TrendIcon className="w-2.5 h-2.5" />}
            {p.delta}
          </div>
        )}
      </div>
    </div>
  );
}

function IntentCard({ intent }: { intent: Intent }) {
  const Icon = intent.icon;
  return (
    <div className="group bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-7 hover:border-[#0A2540] transition-colors duration-150 shadow-[0_4px_24px_-6px_rgba(16,26,54,0.05)]">
      <div className="flex items-start gap-4">
        <span
          className="inline-flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0"
          style={{ background: `${intent.accent}14`, color: intent.accent }}
        >
          <Icon className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-[#0A2540] text-[16.5px] md:text-[17.5px] tracking-[-0.005em] leading-tight"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
          >
            {intent.title}
          </h3>
          <p className="mt-1.5 text-[13.5px] text-[#45464d] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {intent.desc}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {intent.steps.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#f3f4f5] hover:bg-[#0A2540] hover:text-white text-[#0A2540] transition-colors duration-100"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {s.label}
            <ArrowRight className="w-3 h-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}
