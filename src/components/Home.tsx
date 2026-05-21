'use client';

/**
 * UKDesk homepage — redesigned as a smart tool directory + command bar.
 *
 * Sections:
 *  1. HERO          — search bar, status chip
 *  2. STICKY NAV    — category filter pills + live stats
 *  3. DIRECTORY     — filtered tool grid with Featured / Trending / New sub-sections
 *  4. COMING SOON   — 16 tier-3 previews + planned count
 *  5. UK PULSE      — live national stats strip
 *  6. INTENT ROWS   — quick-path journeys
 *  7. GUIDES        — featured articles
 *  8. FOOTER CTA    — trust + links
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, ArrowRight, ArrowUpRight, TrendingUp, TrendingDown,
  Activity, Newspaper, Sparkles, Command, CornerDownLeft,
  Wallet, HomeIcon, MapPin, Plane, Briefcase, GraduationCap,
  Star, Clock, Users, Car, PiggyBank,
} from 'lucide-react';
import {
  APP_TILES, CATEGORIES, SOON_SHOWCASE, SOON_TOOLS, PLANNED_TOOLS,
  FEATURED_TILES, TRENDING_TILES, NEW_TILES,
  TOTAL_SOON_COUNT, LIVE_COUNT,
  type AppTile, type SoonTool, type CategoryId,
} from '../data/tools';

/* ─────────────────────────────────────────────
   BRAND TOKENS
───────────────────────────────────────────── */
const NAVY = '#0A2540';
const TEAL = '#00C4B4';

/* ─────────────────────────────────────────────
   COMMAND-BAR search index
───────────────────────────────────────────── */
interface CommandItem {
  href: string; title: string; hint: string;
  group: 'Tools' | 'Visas' | 'Guides' | 'Places';
  keywords: string[];
}
const COMMAND_INDEX: CommandItem[] = [
  { href: '/take-home-pay',          title: 'Take-home Pay calculator',        hint: 'PAYE · NI · student loan · pension',              group: 'Tools', keywords: ['salary','pay','net','paye','tax','income'] },
  { href: '/mortgage-affordability', title: 'Mortgage affordability',          hint: 'Max borrow + FCA +3% stress test',                 group: 'Tools', keywords: ['mortgage','borrow','house','home','loan'] },
  { href: '/stamp-duty-calculator',  title: 'Stamp Duty (SDLT)',               hint: '2026 rates · FTB relief · surcharges',             group: 'Tools', keywords: ['sdlt','stamp','duty','buying','property'] },
  { href: '/council-tax-band',       title: 'Council Tax band lookup',         hint: 'A–H bands · annual bill estimate',                  group: 'Tools', keywords: ['council','tax','band','rates'] },
  { href: '/cost-of-living-uk',      title: 'Cost of Living',                  hint: 'Rent · groceries · transport',                      group: 'Tools', keywords: ['cost','living','compare','city','rent'] },
  { href: '/tools/cost-calculator',  title: 'Visa cost calculator',            hint: 'Fees + IHS + dependants',                          group: 'Tools', keywords: ['visa','cost','fee','ihs'] },
  { href: '/tools/salary-checker',   title: 'SOC salary checker',              hint: '270 SOC codes · going rates',                       group: 'Tools', keywords: ['soc','salary','sponsor'] },
  { href: '/tools/sponsor-search',   title: 'Sponsor licence search',          hint: '126,530 licensed UK sponsors',                      group: 'Tools', keywords: ['sponsor','employer','licence'] },
  { href: '/vat-calculator',         title: 'VAT calculator',                  hint: 'Add or remove 20% / 5% / 0%',                       group: 'Tools', keywords: ['vat','tax','20%','reduce'] },
  { href: '/tax-code',               title: 'Tax code decoder',                hint: '1257L · K475 · BR · D0 · NT',                       group: 'Tools', keywords: ['tax code','paye','1257l','k code','br','d0'] },
  { href: '/holiday-pay',            title: 'Holiday pay calculator',          hint: 'Statutory 5.6 weeks · 12.07% rule',                 group: 'Tools', keywords: ['holiday','leave','annual','entitlement'] },
  { href: '/salary-compare',         title: 'Salary comparison',               hint: 'City ↔ city equivalent gross',                      group: 'Tools', keywords: ['salary','compare','london','manchester','equivalent'] },
  { href: '/cgt-calculator',         title: 'Capital Gains Tax',               hint: '£3,000 AEA · 18% / 24%',                            group: 'Tools', keywords: ['cgt','capital gains','property','shares'] },
  { href: '/pension-allowance',      title: 'Pension annual allowance',        hint: 'Tapered + MPAA + carry-forward',                    group: 'Tools', keywords: ['pension','allowance','tapered','mpaa'] },
  { href: '/state-pension',          title: 'State Pension forecast',          hint: 'From your NI years',                                 group: 'Tools', keywords: ['state pension','ni','retirement'] },
  { href: '/ulez-check',             title: 'ULEZ & CAZ checker',              hint: 'London + 7 English + 4 Scottish zones',             group: 'Tools', keywords: ['ulez','caz','clean air','emissions','tfl'] },
  { href: '/mot-check',              title: 'MOT & tax check',                 hint: 'Validate any UK reg plate',                         group: 'Tools', keywords: ['mot','tax','dvla','dvsa','reg','plate'] },
  { href: '/energy-bill',            title: 'Energy bill (Ofgem cap)',         hint: 'kWh × current cap rates',                           group: 'Tools', keywords: ['energy','bill','gas','electricity','ofgem','cap'] },
  { href: '/national-insurance',     title: 'National Insurance calculator',   hint: 'Class 1 employee/employer · Class 4',               group: 'Tools', keywords: ['ni','national insurance','class 1','class 4','self employed'] },
  { href: '/inheritance-tax',        title: 'Inheritance Tax calculator',      hint: 'NRB £325k · RNRB £175k · 36% charity',             group: 'Tools', keywords: ['iht','inheritance','estate','nil rate band','rnrb'] },
  { href: '/dividend-tax',           title: 'Dividend Tax calculator',         hint: '£500 allowance · 8.75% / 33.75% / 39.35%',         group: 'Tools', keywords: ['dividend','dividend tax','shareholder','limited company'] },
  { href: '/sole-trader-vs-limited', title: 'Sole trader vs Limited company',  hint: 'Full IT+NI vs CT+dividend comparison',              group: 'Tools', keywords: ['sole trader','limited company','ltd','self employed','corporation tax'] },
  { href: '/student-loan-repayment', title: 'Student Loan repayment',          hint: 'Plan 1/2/4/5 + Postgraduate projection',            group: 'Tools', keywords: ['student loan','plan 2','plan 5','postgraduate','sl'] },
  { href: '/redundancy-pay',         title: 'Redundancy Pay calculator',       hint: 'Statutory · £719 cap · £30k tax-free',              group: 'Tools', keywords: ['redundancy','statutory redundancy','redundancy pay','made redundant'] },
  { href: '/maternity-pay',          title: 'Maternity Pay calculator',        hint: 'SMP 39 weeks · SPP · £187.18',                      group: 'Tools', keywords: ['maternity','smp','maternity pay','paternity','spp'] },
  { href: '/sick-pay',               title: 'Sick Pay (SSP) calculator',       hint: '£118.75/wk · 28-week max · waiting days',          group: 'Tools', keywords: ['ssp','sick pay','statutory sick','sickness'] },
  { href: '/payslip-decoder',        title: 'Payslip decoder',                 hint: 'Tax codes · NI letters · deduction codes',          group: 'Tools', keywords: ['payslip','tax code','ni category','p60','p45','deduction'] },
  { href: '/child-benefit-calculator',      title: 'Child Benefit calculator',        hint: '£25.60/wk eldest · HICBC £60k–£80k taper',       group: 'Tools', keywords: ['child benefit','hicbc','children','benefit'] },
  { href: '/marriage-allowance-calculator', title: 'Marriage Allowance',              hint: '£1,260 PA transfer · up to £252 saving',          group: 'Tools', keywords: ['marriage allowance','spouse','civil partner','personal allowance'] },
  { href: '/company-car-tax',               title: 'Company Car Tax (BiK)',           hint: 'List price × CO₂% · EV 3% · Class 1A',            group: 'Tools', keywords: ['company car','bik','benefit in kind','co2','fleet'] },
  { href: '/ir35-calculator',               title: 'IR35 calculator',                 hint: 'Inside vs outside take-home comparison',           group: 'Tools', keywords: ['ir35','inside','outside','contractor','psc'] },
  { href: '/contractor-day-rate',           title: 'Contractor day rate',             hint: 'Day rate → Ltd take-home + PAYE equivalent',      group: 'Tools', keywords: ['day rate','contractor','limited company','daily rate'] },
  { href: '/mileage-expense-calculator',    title: 'Mileage expense calculator',      hint: 'AMAP 45p/25p car · 24p motorcycle · 20p bike',    group: 'Tools', keywords: ['mileage','amap','business miles','fuel','reimbursement'] },
  { href: '/salary-sacrifice-calculator',   title: 'Salary sacrifice calculator',     hint: 'IT + employee NI + employer NI saving',            group: 'Tools', keywords: ['salary sacrifice','pension','employer ni','net pay'] },
  { href: '/self-assessment-calculator',    title: 'Self Assessment calculator',      hint: 'Multi-income · Class 4 NI · POAC estimate',        group: 'Tools', keywords: ['self assessment','sa','tax return','self employed','hmrc'] },
  { href: '/rental-income-tax',             title: 'Rental income tax',               hint: 'Section 24 · 20% mortgage interest credit',        group: 'Tools', keywords: ['rental','landlord','section 24','buy to let','property income'] },
  { href: '/rental-yield-calculator',       title: 'Rental yield calculator',         hint: 'Gross/net yield · BTL ICR 125%/145%',              group: 'Tools', keywords: ['rental yield','gross yield','net yield','btl','buy to let'] },
  { href: '/overpayment-mortgage',          title: 'Mortgage overpayment',            hint: 'Interest saved · months off mortgage term',        group: 'Tools', keywords: ['mortgage overpayment','overpay','interest saved','early repayment'] },
  { href: '/property-cgt-calculator',       title: 'Property CGT calculator',         hint: 'PPR relief · 18%/24% from Oct 2024 · AEA',         group: 'Tools', keywords: ['property cgt','capital gains','ppr','main residence','residential'] },
  { href: '/childcare-calculator',          title: 'Childcare cost calculator',       hint: '15/30 free hours · TFC £500/qtr · UC 85%',         group: 'Tools', keywords: ['childcare','free hours','tax-free childcare','tfc','universal credit'] },
  { href: '/isa-calculator',                title: 'ISA & LISA growth calculator',    hint: '£20k ISA · LISA 25% bonus · projection',           group: 'Tools', keywords: ['isa','lisa','lifetime isa','stocks and shares','savings'] },
  { href: '/ihs-calculator',                title: 'IHS surcharge calculator',        hint: '£1,035/yr standard · £776/yr student',             group: 'Tools', keywords: ['ihs','immigration health surcharge','nhs surcharge','visa health'] },
  { href: '/skilled-worker-points-check',   title: 'Skilled Worker points checker',   hint: '70-point check · shortage occupation',              group: 'Tools', keywords: ['skilled worker','points','sponsorship','shortage','new entrant'] },
  { href: '/notice-period-calculator',      title: 'Notice period calculator',        hint: 'Statutory 1wk/yr max 12 · PILON taxable',          group: 'Tools', keywords: ['notice period','pilon','gardening leave','resignation','redundancy'] },
  { href: '/minimum-wage-checker',          title: 'Minimum wage checker',            hint: 'NLW £12.21 (21+) · Apr 2025 rates',                group: 'Tools', keywords: ['minimum wage','nlw','nmw','living wage','hourly rate'] },
  { href: '/pension-drawdown-calculator',   title: 'Pension drawdown calculator',     hint: 'PCLS 25% · year-by-year income projection',        group: 'Tools', keywords: ['pension drawdown','pcls','lump sum','retirement income','sipp'] },
  { href: '/lifetime-isa-calculator',       title: 'Lifetime ISA calculator',         hint: '25% bonus · first home ≤£450k · retirement',      group: 'Tools', keywords: ['lifetime isa','lisa','first home','bonus','help to buy'] },
  { href: '/postcode',                title: 'Postcode super-lookup',    hint: 'Council, MP, NHS, police, ward',           group: 'Places', keywords: ['postcode','mp','council','nhs','police'] },
  { href: '/visa/skilled-worker',     title: 'Skilled Worker visa',      hint: '£41,700 · employer sponsored',              group: 'Visas',  keywords: ['skilled','worker','job','employment'] },
  { href: '/visa/student',            title: 'Student visa',             hint: '£558 · degree-level study',                 group: 'Visas',  keywords: ['student','study','university'] },
  { href: '/visa/family',             title: 'Family visa',              hint: '£29,000 income · spouse',                   group: 'Visas',  keywords: ['family','spouse','partner','marriage'] },
  { href: '/visa/visitor',            title: 'Standard Visitor',         hint: '£135 · tourism / business',                 group: 'Visas',  keywords: ['visitor','tourist','business'] },
  { href: '/visa/graduate',           title: 'Graduate visa',            hint: '2 years post-study',                        group: 'Visas',  keywords: ['graduate','post study'] },
  { href: '/visa/global-talent',      title: 'Global Talent',            hint: 'No sponsor · endorsed',                     group: 'Visas',  keywords: ['talent','endorsement'] },
  { href: '/visa/health-and-care',    title: 'Health & Care Worker',     hint: 'NHS / care · IHS waived',                   group: 'Visas',  keywords: ['nhs','care','health'] },
  { href: '/settlement',              title: 'ILR · settlement',         hint: '£3,226 · indefinite leave',                 group: 'Visas',  keywords: ['ilr','settlement','indefinite'] },
  { href: '/eligibility',             title: 'Eligibility quiz',         hint: 'Find your route in 60s',                    group: 'Visas',  keywords: ['quiz','eligibility','match'] },
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',     title: 'Skilled Worker thresholds 2026', hint: 'Full SOC table',        group: 'Guides', keywords: ['salary','threshold'] },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',   title: 'Family visa £29,000 income',     hint: 'What counts',           group: 'Guides', keywords: ['family','29000','income'] },
  { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',      title: 'eVisa migration guide',          hint: 'Beat the deadline',     group: 'Guides', keywords: ['evisa','brp'] },
];

/* ─────────────────────────────────────────────
   UK PULSE
───────────────────────────────────────────── */
interface PulseRow { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'flat'; source: string; }
const PULSE: PulseRow[] = [
  { label: 'Bank rate',          value: '4.25%',  delta: '−25 bp',  trend: 'down', source: 'BoE' },
  { label: 'CPI inflation',      value: '2.1%',   delta: '−0.2 pp', trend: 'down', source: 'ONS' },
  { label: 'Avg weekly wage',    value: '£697',   delta: '+4.1%',   trend: 'up',   source: 'ONS' },
  { label: '£ / €',              value: '1.18',   delta: '+0.4%',   trend: 'up',   source: 'BoE' },
  { label: '£ / $',              value: '1.27',   delta: '−0.2%',   trend: 'down', source: 'BoE' },
  { label: 'Skilled Worker min', value: '£41.7k', delta: '8 Apr 26',               source: 'gov.uk' },
];

/* ─────────────────────────────────────────────
   INTENT ROWS
───────────────────────────────────────────── */
interface Intent {
  id: string; title: string; desc: string;
  icon: typeof Briefcase;
  steps: { href: string; label: string }[];
  accent: string;
}
const INTENTS: Intent[] = [
  {
    id: 'work', title: 'I want to work in the UK',
    desc: 'Find a sponsor, check the salary threshold, see your take-home.',
    icon: Briefcase, accent: TEAL,
    steps: [
      { href: '/visa/skilled-worker',  label: 'Skilled Worker visa' },
      { href: '/tools/sponsor-search', label: 'Find a UK sponsor' },
      { href: '/take-home-pay',        label: 'Take-home pay' },
      { href: '/tools/salary-checker', label: 'SOC salary check' },
    ],
  },
  {
    id: 'live', title: 'I want to buy or rent a UK home',
    desc: 'See what you can borrow, the SDLT bill and the council tax band.',
    icon: HomeIcon, accent: '#C9A14A',
    steps: [
      { href: '/mortgage-affordability', label: 'Mortgage affordability' },
      { href: '/stamp-duty-calculator',  label: 'Stamp Duty' },
      { href: '/council-tax-band',       label: 'Council Tax band' },
      { href: '/cost-of-living-uk',      label: 'Cost of living' },
    ],
  },
  {
    id: 'local', title: 'I just moved — what is around me?',
    desc: 'One postcode tells you the council, MP, NHS region, police force and more.',
    icon: MapPin, accent: '#7C3AED',
    steps: [
      { href: '/postcode',          label: 'Postcode super-lookup' },
      { href: '/council-tax-band',  label: 'Council Tax for the area' },
      { href: '/cost-of-living-uk', label: 'Cost of living' },
    ],
  },
  {
    id: 'study', title: 'I want to study or stay after a degree',
    desc: 'Student route, Graduate route, and pathways toward settlement.',
    icon: GraduationCap, accent: '#2563EB',
    steps: [
      { href: '/visa/student',  label: 'Student visa' },
      { href: '/visa/graduate', label: 'Graduate route' },
      { href: '/settlement',    label: 'Settlement options' },
      { href: '/eligibility',   label: 'Eligibility quiz' },
    ],
  },
];

const FEATURED_GUIDES = [
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',       title: 'Skilled Worker salary thresholds 2026', read: '8 min', tag: 'Visas',  accent: '#E11D48' },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',     title: 'Family visa £29,000 — what counts',     read: '7 min', tag: 'Visas',  accent: '#E11D48' },
  { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026', title: 'How to find a sponsor licence holder',   read: '9 min', tag: 'Money',  accent: TEAL },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const [query, setQuery]               = useState('');
  const [active, setActive]             = useState(0);
  const [focused, setFocused]           = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const dirRef   = useRef<HTMLDivElement>(null);

  /* ⌘K shortcut */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  /* Search filter */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const isPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(q);
    if (isPostcode) return [{
      href: `/postcode/${q.replace(/\s+/g, '').toUpperCase()}`,
      title: `Look up postcode ${q.toUpperCase()}`,
      hint: 'Council, MP, NHS, police, ward, parish, school',
      group: 'Places' as const, keywords: [],
    }];
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
    if (e.key === 'Enter')     { e.preventDefault(); const t = results[active]; if (t) router.push(t.href); }
    if (e.key === 'Escape')    { inputRef.current?.blur(); }
  };

  /* Filtered tiles */
  const filteredTiles = useMemo(
    () => activeCategory === 'all'
      ? APP_TILES
      : APP_TILES.filter((t) => t.category === activeCategory),
    [activeCategory],
  );

  /* Category tile counts */
  const catCounts = useMemo(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.id, APP_TILES.filter((t) => t.category === c.id).length])),
    [],
  );

  /* Category soon counts */
  const catSoonCounts = useMemo(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.id, SOON_TOOLS.filter((t) => t.category === c.id).length])),
    [],
  );

  const selectCategory = (id: CategoryId | 'all') => {
    setActiveCategory(id);
    dirRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════
          HERO — command bar
      ════════════════════════════════════════ */}
      <section className="relative pt-[100px] md:pt-[120px] pb-10 md:pb-12">
        {/* grid backdrop */}
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
          {/* Status pill */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#f3f4f5] text-[#45464d]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="relative flex items-center justify-center w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
              live &middot; {LIVE_COUNT} tools &middot; {TOTAL_SOON_COUNT}+ coming soon &middot; 8 categories
            </span>
          </div>

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
              className={`flex items-center gap-3 bg-white border rounded-2xl pl-5 pr-2 py-2 shadow-[0_8px_32px_-4px_rgba(16,26,54,0.10)] transition-all duration-150 ${
                focused ? 'border-[#0A2540] shadow-[0_12px_36px_-4px_rgba(16,26,54,0.18)]' : 'border-[#E5E7EB]'
              }`}
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
                autoCapitalize="off" autoComplete="off" spellCheck={false}
              />
              <kbd
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-[#76777e] bg-[#f3f4f5] border border-[#E5E7EB] rounded-md px-1.5 py-1 flex-shrink-0"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
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
                          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#76777e]">{r.group}</span>
                          <CornerDownLeft className="w-3.5 h-3.5 text-[#76777e]" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 text-[11px] text-[#76777e] bg-[#fafbfc] border-t border-[#E5E7EB] flex items-center justify-between">
                  <span>&uarr;&darr; navigate &middot; &#9166; open &middot; esc close</span>
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
                    key={s} type="button"
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
          STICKY CATEGORY FILTER + STATS
      ════════════════════════════════════════ */}
      <div className="sticky top-[68px] z-20 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB]">
        {/* Stats bar */}
        <div className="border-b border-[#E5E7EB] bg-[#fafbfc] hidden md:block">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center gap-5 overflow-x-auto">
              {[
                { num: LIVE_COUNT,            label: 'live tools' },
                { num: TOTAL_SOON_COUNT,       label: 'in development' },
                { num: CATEGORIES.length,      label: 'categories' },
                { num: '100%',                 label: 'free · no signup' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
                  {i > 0 && <span className="w-px h-3 bg-[#E5E7EB] mr-3" />}
                  <span className="text-[12.5px] font-bold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{s.num}</span>
                  <span className="text-[12px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2.5 overflow-x-auto">
            <button
              onClick={() => selectCategory('all')}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors duration-100 ${
                activeCategory === 'all' ? 'bg-[#0A2540] text-white' : 'text-[#45464d] hover:bg-[#f3f4f5]'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All
              <span className={`text-[11px] font-normal ${activeCategory === 'all' ? 'opacity-60' : 'text-[#a5a6ad]'}`}>{LIVE_COUNT}</span>
            </button>
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              const count = catCounts[cat.id] ?? 0;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors duration-100 ${
                    isActive ? 'bg-[#0A2540] text-white' : 'text-[#45464d] hover:bg-[#f3f4f5]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                  <span className={`text-[11px] font-normal ${isActive ? 'opacity-60' : 'text-[#a5a6ad]'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          TOOL DIRECTORY
      ════════════════════════════════════════ */}
      <section ref={dirRef} className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {activeCategory === 'all' ? (
            <div className="space-y-12">

              {/* FEATURED */}
              <div>
                <SectionHeader icon={Star} label="Featured" accent={TEAL} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FEATURED_TILES.map((t) => <FeaturedCard key={t.href} t={t} />)}
                </div>
              </div>

              {/* TRENDING */}
              <div>
                <SectionHeader icon={TrendingUp} label="Trending Now" accent="#F59E0B" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {TRENDING_TILES.map((t) => (
                    <AppTileCard key={t.href} t={t} badge={{ text: 'Trending', color: '#F59E0B' }} />
                  ))}
                </div>
              </div>

              {/* RECENTLY ADDED */}
              <div>
                <SectionHeader icon={Sparkles} label="Recently Added" accent={TEAL} />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {NEW_TILES.map((t) => (
                    <AppTileCard key={t.href} t={t} badge={{ text: 'New', color: TEAL }} />
                  ))}
                </div>
              </div>

              {/* BROWSE ALL — grouped by category */}
              <div>
                <SectionHeader icon={Wallet} label={`All ${LIVE_COUNT} Tools`} />
                <div className="space-y-8">
                  {CATEGORIES.map((cat) => {
                    const tiles = APP_TILES.filter((t) => t.category === cat.id);
                    if (!tiles.length) return null;
                    const CatIcon = cat.icon;
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex w-6 h-6 rounded-md items-center justify-center" style={{ background: `${cat.color}18`, color: cat.color }}>
                              <CatIcon className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[12.5px] font-bold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{cat.label}</span>
                            <span className="text-[11px] text-[#a5a6ad]" style={{ fontFamily: 'Inter, sans-serif' }}>{tiles.length} tools</span>
                          </div>
                          <button
                            onClick={() => selectCategory(cat.id)}
                            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0A2540] hover:underline"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            View category <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                          {tiles.map((t) => <AppTileCard key={t.href} t={t} compact />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ── CATEGORY FILTERED VIEW ── */
            <div>
              {/* Category header */}
              {activeCat && (
                <div className="flex items-start gap-4 mb-8 pb-6 border-b border-[#E5E7EB]">
                  <span
                    className="inline-flex w-14 h-14 rounded-2xl items-center justify-center flex-shrink-0"
                    style={{ background: `${activeCat.color}14`, color: activeCat.color }}
                  >
                    <activeCat.icon className="w-7 h-7" />
                  </span>
                  <div>
                    <h2
                      className="font-bold text-[#0A2540] tracking-[-0.01em]"
                      style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.4rem, 3vw, 1.875rem)' }}
                    >
                      {activeCat.label}
                    </h2>
                    <p className="mt-1 text-[14px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {activeCat.description} &middot; <strong>{filteredTiles.length}</strong> live tools
                      {catSoonCounts[activeCategory] ? ` · ${catSoonCounts[activeCategory]} coming soon` : ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Tools grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-10">
                {filteredTiles.map((t) => (
                  <AppTileCard
                    key={t.href} t={t}
                    badge={t.status === 'new' ? { text: 'New', color: TEAL } : undefined}
                  />
                ))}
              </div>

              {/* Category coming-soon preview */}
              {catSoonCounts[activeCategory] > 0 && (
                <div>
                  <SectionHeader icon={Clock} label={`Coming Soon in ${activeCat?.label}`} accent="#a5a6ad" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SOON_TOOLS.filter((t) => t.category === activeCategory).slice(0, 8).map((t) => (
                      <SoonCard key={t.label} t={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Back to all */}
              <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={() => selectCategory('all')}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#76777e] hover:text-[#0A2540] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  &larr; View all {LIVE_COUNT} tools
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          COMING SOON — full showcase
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-20 border-t border-[#E5E7EB] bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a5a6ad] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Clock className="inline w-3 h-3 mr-1 -mt-0.5" />
                What&rsquo;s coming next
              </p>
              <h2
                className="font-bold text-[#0A2540] tracking-[-0.015em]"
                style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.4rem, 3vw, 1.875rem)', lineHeight: '1.15' }}
              >
                {TOTAL_SOON_COUNT}+ tools in development.
              </h2>
              <p className="mt-2 text-[14px] text-[#76777e] max-w-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                New calculators ship every week. The 16 below launch next &mdash; {PLANNED_TOOLS.length} more are planned across all categories.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {SOON_TOOLS.length} launching next
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {SOON_SHOWCASE.map((t) => <SoonCard key={t.label} t={t} />)}
          </div>

          <div className="text-center py-6 border-2 border-dashed border-[#E5E7EB] rounded-xl">
            <p className="text-[13px] text-[#a5a6ad]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="font-semibold text-[#76777e]">+{PLANNED_TOOLS.length} more</span> planned across all categories
              &nbsp;&middot;&nbsp; Benefits, property, energy, retirement, family, international &amp; more
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          UK PULSE
      ════════════════════════════════════════ */}
      <section className="py-12 md:py-16 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#76777e]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Activity className="inline w-3 h-3 mr-1 -mt-0.5" />
              UK Pulse
            </p>
            <span className="text-[11px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>20 May &middot; refreshed daily</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {PULSE.map((p) => (
              <PulseCard key={p.label} p={p} />
            ))}
          </div>
          <p className="mt-4 text-[11px] text-[#a5a6ad]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Sources: Bank of England, ONS, gov.uk.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          INTENT ROWS
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-20 border-y border-[#E5E7EB] bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Quick paths</p>
            <h2
              className="font-bold text-[#0A2540] tracking-[-0.015em]"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: '1.15' }}
            >
              Or pick what brought you here.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {INTENTS.map((intent) => <IntentCard key={intent.id} intent={intent} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED GUIDES
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Newspaper className="inline w-3 h-3 mr-1 -mt-0.5" />
                From the desk
              </p>
              <h2
                className="font-bold text-[#0A2540] tracking-[-0.015em]"
                style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: '1.15' }}
              >
                Recent guides worth reading.
              </h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0A2540] hover:underline" style={{ fontFamily: 'Inter, sans-serif' }}>
              All articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {FEATURED_GUIDES.map((g) => (
              <Link
                key={g.href} href={g.href}
                className="group block bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(16,26,54,0.15)] transition-all duration-150"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md" style={{ background: `${g.accent}14`, color: g.accent, fontFamily: 'Inter, sans-serif' }}>
                    {g.tag}
                  </span>
                  <span className="text-[11px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>{g.read}</span>
                </div>
                <h3 className="font-bold text-[#0A2540] text-[16px] md:text-[17px] leading-[1.3] tracking-[-0.005em]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
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
          FOOTER CTA
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-16 bg-[#0A2540] text-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
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
                style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
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
   SUB-COMPONENTS
───────────────────────────────────────────── */

function SectionHeader({ icon: Icon, label, accent }: { icon: typeof Star; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-3.5 h-3.5" style={{ color: accent ?? '#76777e' }} />
      <h2
        className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#76777e]"
        style={{ fontFamily: 'Inter, sans-serif', color: accent ? undefined : '#76777e' }}
      >
        {label}
      </h2>
    </div>
  );
}

function FeaturedCard({ t }: { t: AppTile }) {
  const Icon = t.icon;
  return (
    <Link
      href={t.href}
      className="group relative bg-white border border-[#E5E7EB] rounded-2xl p-5 md:p-6 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4 min-h-[190px] overflow-hidden"
      style={{
        boxShadow: '0 1px 4px rgba(16,26,54,0.06)',
      }}
      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 44px -8px rgba(16,26,54,0.18), 0 0 0 1.5px rgba(10,37,64,0.14)'; }}
      onMouseOut={(e)  => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(16,26,54,0.06)'; }}
    >
      {/* Subtle accent gradient wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-2xl"
        style={{ background: `linear-gradient(145deg, ${t.accent}08 0%, transparent 60%)` }}
      />
      {/* Always-visible thin accent bar at top */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${t.accent} 0%, ${t.accent}60 100%)`, opacity: 0.55 }}
      />
      <div className="flex items-start justify-between relative z-10">
        <span
          className="inline-flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${t.accent}22 0%, ${t.accent}0e 100%)`,
            color: t.accent,
            boxShadow: `0 2px 8px ${t.accent}28`,
          }}
        >
          <Icon className="w-6 h-6" />
        </span>
        <span
          className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: '#FFF7ED', color: '#C2780F', fontFamily: 'Inter, sans-serif' }}
        >
          <TrendingUp className="w-2.5 h-2.5" />
          Popular
        </span>
      </div>
      <div className="relative z-10">
        <h3 className="font-bold text-[#0A2540] text-[16px] md:text-[17px] tracking-[-0.01em] leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          {t.label}
        </h3>
        <p className="mt-1 text-[13px] text-[#76777e] leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>{t.hint}</p>
      </div>
      <div className="mt-auto relative z-10 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold group-hover:gap-2.5 transition-[gap] duration-150"
          style={{ color: t.accent, fontFamily: 'Inter, sans-serif' }}
        >
          Open tool <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

function AppTileCard({ t, badge, compact }: { t: AppTile; badge?: { text: string; color: string }; compact?: boolean }) {
  const Icon = t.icon;
  return (
    <Link
      href={t.href}
      className={`group relative bg-white border border-[#EAECF0] rounded-xl transition-all duration-200 flex flex-col gap-2.5 ${
        compact ? 'p-3 md:p-4 min-h-[120px]' : 'p-4 md:p-5 min-h-[148px]'
      }`}
      style={{ boxShadow: '0 1px 3px rgba(16,26,54,0.05)' }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px -4px rgba(16,26,54,0.14), 0 0 0 1.5px rgba(10,37,64,0.12)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(16,26,54,0.05)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Thin left accent strip */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: t.accent }}
      />
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex rounded-xl items-center justify-center ${compact ? 'w-9 h-9' : 'w-11 h-11'}`}
          style={{
            background: `linear-gradient(135deg, ${t.accent}1e 0%, ${t.accent}0a 100%)`,
            color: t.accent,
          }}
        >
          <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </span>
        {badge && (
          <span
            className="text-[9.5px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
            style={{ background: `${badge.color}14`, color: badge.color, fontFamily: 'Inter, sans-serif' }}
          >
            {badge.text}
          </span>
        )}
        {!badge && t.kbd && (
          <kbd className="hidden md:inline-flex items-center text-[10px] font-semibold text-[#76777e] bg-[#f6f7f8] border border-[#E5E7EB] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'Inter, sans-serif' }}>
            {t.kbd}
          </kbd>
        )}
      </div>
      <div>
        <h3 className={`font-bold text-[#0A2540] tracking-[-0.005em] leading-tight ${compact ? 'text-[13px] md:text-[13.5px]' : 'text-[14.5px] md:text-[15px]'}`} style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          {t.label}
        </h3>
        <p className="mt-0.5 text-[11.5px] text-[#76777e] leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>{t.hint}</p>
      </div>
    </Link>
  );
}

function SoonCard({ t }: { t: SoonTool }) {
  const Icon = t.icon;
  return (
    <div
      className="relative bg-white border border-dashed border-[#D1D5DB] rounded-xl p-4 flex flex-col gap-2.5 min-h-[120px] overflow-hidden"
      style={{ opacity: 0.72 }}
    >
      {/* Subtle patterned overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '10px 10px' }}
      />
      <div className="flex items-center justify-between relative z-10">
        <span
          className="inline-flex w-9 h-9 rounded-lg items-center justify-center"
          style={{ background: '#F3F4F6', color: '#9CA3AF' }}
        >
          <Icon className="w-4 h-4" />
        </span>
        <span
          className="text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
          style={{ background: '#F3F4F6', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}
        >
          Coming soon
        </span>
      </div>
      <div className="relative z-10">
        <h3 className="font-semibold text-[13px] text-[#6B7280] leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          {t.label}
        </h3>
        <p className="mt-0.5 text-[11.5px] text-[#9CA3AF] leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>{t.hint}</p>
      </div>
    </div>
  );
}

function PulseCard({ p }: { p: PulseRow }) {
  const TrendIcon = p.trend === 'up' ? TrendingUp : p.trend === 'down' ? TrendingDown : null;
  const trendColor = p.trend === 'up' ? '#10B981' : p.trend === 'down' ? '#E11D48' : '#76777e';
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
      <div className="text-[11px] text-[#a5a6ad] uppercase tracking-[0.06em] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{p.source} · {p.label}</div>
      <div className="font-bold text-[#0A2540] text-[18px] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{p.value}</div>
      {p.delta && (
        <div className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold tabular-nums mt-0.5" style={{ color: trendColor, fontFamily: 'Inter, sans-serif' }}>
          {TrendIcon && <TrendIcon className="w-2.5 h-2.5" />}
          {p.delta}
        </div>
      )}
    </div>
  );
}

function IntentCard({ intent }: { intent: Intent }) {
  const Icon = intent.icon;
  return (
    <div className="group bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-7 hover:border-[#0A2540] transition-colors duration-150 shadow-[0_4px_24px_-6px_rgba(16,26,54,0.05)]">
      <div className="flex items-start gap-4">
        <span className="inline-flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0" style={{ background: `${intent.accent}14`, color: intent.accent }}>
          <Icon className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#0A2540] text-[16.5px] md:text-[17.5px] tracking-[-0.005em] leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            {intent.title}
          </h3>
          <p className="mt-1.5 text-[13.5px] text-[#45464d] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>{intent.desc}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {intent.steps.map((s) => (
          <Link
            key={s.href} href={s.href}
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#f3f4f5] hover:bg-[#0A2540] hover:text-white text-[#0A2540] transition-colors duration-100"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {s.label} <ArrowRight className="w-3 h-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}
