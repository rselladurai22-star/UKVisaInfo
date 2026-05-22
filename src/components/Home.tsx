'use client';

/**
 * UKDesk homepage — premium magazine-style directory.
 *
 * Layout (each section visually distinct):
 *  1. EDITORIAL HERO  — bright white, oversized typography, command search
 *  2. PULSE MARQUEE   — slim dark band with live UK stats
 *  3. PATH GRID       — 4 large intent cards on cream
 *  4. BENTO DIRECTORY — featured (large) + regular (small) tiles, category-coded
 *  5. CATEGORY ATLAS  — 8 category mega-tiles with counts
 *  6. JOURNAL         — featured guides as magazine cards
 *  7. COMING SOON     — dotted background, ghost tiles
 *  8. FOOTER CTA      — bold solid block
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, ArrowRight, ArrowUpRight, TrendingUp, TrendingDown,
  Sparkles, Command, CornerDownLeft, Star, Clock,
  HomeIcon, MapPin, Briefcase, GraduationCap, BookOpen,
  ChevronRight, Zap, ShieldCheck,
} from 'lucide-react';
import {
  APP_TILES, CATEGORIES, SOON_SHOWCASE,
  FEATURED_TILES, TRENDING_TILES, NEW_TILES,
  TOTAL_SOON_COUNT, LIVE_COUNT,
  type CategoryId,
} from '../data/tools';

/* ─────────────────────────────────────────────
   BRAND TOKENS
───────────────────────────────────────────── */
const NAVY = '#0A2540';
const TEAL = '#00C4B4';
const GOLD = '#C9A14A';
const INK  = '#0F172A';

/* ─────────────────────────────────────────────
   COMMAND INDEX (search)
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
  { href: '/state-pension',          title: 'State Pension forecast',          hint: 'From your NI years',                                group: 'Tools', keywords: ['state pension','ni','retirement'] },
  { href: '/ulez-check',             title: 'ULEZ & CAZ checker',              hint: 'London + 7 English + 4 Scottish zones',             group: 'Tools', keywords: ['ulez','caz','clean air','emissions','tfl'] },
  { href: '/mot-check',              title: 'MOT & tax check',                 hint: 'Validate any UK reg plate',                         group: 'Tools', keywords: ['mot','tax','dvla','dvsa','reg','plate'] },
  { href: '/energy-bill',            title: 'Energy bill (Ofgem cap)',         hint: 'kWh × current cap rates',                           group: 'Tools', keywords: ['energy','bill','gas','electricity','ofgem','cap'] },
  { href: '/national-insurance',     title: 'National Insurance calculator',   hint: 'Class 1 employee/employer · Class 4',               group: 'Tools', keywords: ['ni','national insurance','class 1','class 4','self employed'] },
  { href: '/inheritance-tax',        title: 'Inheritance Tax calculator',      hint: 'NRB £325k · RNRB £175k · 36% charity',              group: 'Tools', keywords: ['iht','inheritance','estate','nil rate band','rnrb'] },
  { href: '/dividend-tax',           title: 'Dividend Tax calculator',         hint: '£500 allowance · 8.75% / 33.75% / 39.35%',          group: 'Tools', keywords: ['dividend','dividend tax','shareholder','limited company'] },
  { href: '/sole-trader-vs-limited', title: 'Sole trader vs Limited',          hint: 'Full IT+NI vs CT+dividend comparison',              group: 'Tools', keywords: ['sole trader','limited company','ltd','self employed'] },
  { href: '/student-loan-repayment', title: 'Student Loan repayment',          hint: 'Plan 1/2/4/5 + Postgraduate projection',            group: 'Tools', keywords: ['student loan','plan 2','plan 5','postgraduate','sl'] },
  { href: '/redundancy-pay',         title: 'Redundancy Pay calculator',       hint: 'Statutory · £719 cap · £30k tax-free',              group: 'Tools', keywords: ['redundancy','statutory','redundancy pay'] },
  { href: '/maternity-pay',          title: 'Maternity Pay calculator',        hint: 'SMP 39 weeks · SPP · £187.18',                      group: 'Tools', keywords: ['maternity','smp','maternity pay','paternity','spp'] },
  { href: '/sick-pay',               title: 'Sick Pay (SSP) calculator',       hint: '£118.75/wk · 28-week max · waiting days',           group: 'Tools', keywords: ['ssp','sick pay','statutory sick','sickness'] },
  { href: '/payslip-decoder',        title: 'Payslip decoder',                 hint: 'Tax codes · NI letters · deduction codes',          group: 'Tools', keywords: ['payslip','tax code','ni category','p60','p45'] },
  { href: '/child-benefit-calculator',      title: 'Child Benefit calculator',  hint: '£25.60/wk eldest · HICBC £60k–£80k taper',          group: 'Tools', keywords: ['child benefit','hicbc','children','benefit'] },
  { href: '/marriage-allowance-calculator', title: 'Marriage Allowance',       hint: '£1,260 PA transfer · up to £252 saving',            group: 'Tools', keywords: ['marriage allowance','spouse','civil partner'] },
  { href: '/company-car-tax',               title: 'Company Car Tax (BiK)',    hint: 'List price × CO₂% · EV 3% · Class 1A',              group: 'Tools', keywords: ['company car','bik','benefit in kind','co2'] },
  { href: '/ir35-calculator',               title: 'IR35 calculator',          hint: 'Inside vs outside take-home comparison',            group: 'Tools', keywords: ['ir35','inside','outside','contractor','psc'] },
  { href: '/contractor-day-rate',           title: 'Contractor day rate',      hint: 'Day rate → Ltd take-home + PAYE equivalent',        group: 'Tools', keywords: ['day rate','contractor','limited company','daily rate'] },
  { href: '/mileage-expense-calculator',    title: 'Mileage expense',          hint: 'AMAP 45p/25p car · 24p motorcycle · 20p bike',      group: 'Tools', keywords: ['mileage','amap','business miles','fuel'] },
  { href: '/salary-sacrifice-calculator',   title: 'Salary sacrifice',         hint: 'IT + employee NI + employer NI saving',             group: 'Tools', keywords: ['salary sacrifice','pension','employer ni'] },
  { href: '/self-assessment-calculator',    title: 'Self Assessment',          hint: 'Multi-income · Class 4 NI · POAC estimate',         group: 'Tools', keywords: ['self assessment','sa','tax return','hmrc'] },
  { href: '/rental-income-tax',             title: 'Rental income tax',        hint: 'Section 24 · 20% mortgage interest credit',         group: 'Tools', keywords: ['rental','landlord','section 24','buy to let'] },
  { href: '/rental-yield-calculator',       title: 'Rental yield',             hint: 'Gross/net yield · BTL ICR 125%/145%',               group: 'Tools', keywords: ['rental yield','gross yield','btl','buy to let'] },
  { href: '/overpayment-mortgage',          title: 'Mortgage overpayment',     hint: 'Interest saved · months off mortgage term',         group: 'Tools', keywords: ['mortgage overpayment','overpay','early repayment'] },
  { href: '/property-cgt-calculator',       title: 'Property CGT',             hint: 'PPR relief · 18%/24% from Oct 2024 · AEA',          group: 'Tools', keywords: ['property cgt','capital gains','ppr','main residence'] },
  { href: '/childcare-calculator',          title: 'Childcare cost',           hint: '15/30 free hours · TFC £500/qtr · UC 85%',          group: 'Tools', keywords: ['childcare','free hours','tax-free childcare','tfc'] },
  { href: '/isa-calculator',                title: 'ISA & LISA growth',        hint: '£20k ISA · LISA 25% bonus · projection',            group: 'Tools', keywords: ['isa','lisa','lifetime isa','savings'] },
  { href: '/ihs-calculator',                title: 'IHS surcharge',            hint: '£1,035/yr standard · £776/yr student',              group: 'Tools', keywords: ['ihs','immigration health surcharge','nhs surcharge'] },
  { href: '/skilled-worker-points-check',   title: 'Skilled Worker points',    hint: '70-point check · shortage occupation',              group: 'Tools', keywords: ['skilled worker','points','sponsorship','shortage'] },
  { href: '/notice-period-calculator',      title: 'Notice period',            hint: 'Statutory 1wk/yr max 12 · PILON taxable',           group: 'Tools', keywords: ['notice period','pilon','gardening leave'] },
  { href: '/minimum-wage-checker',          title: 'Minimum wage checker',     hint: 'NLW £12.21 (21+) · Apr 2025 rates',                 group: 'Tools', keywords: ['minimum wage','nlw','nmw','living wage'] },
  { href: '/pension-drawdown-calculator',   title: 'Pension drawdown',         hint: 'PCLS 25% · year-by-year income projection',         group: 'Tools', keywords: ['pension drawdown','pcls','lump sum','sipp'] },
  { href: '/lifetime-isa-calculator',       title: 'Lifetime ISA',             hint: '25% bonus · first home ≤£450k · retirement',        group: 'Tools', keywords: ['lifetime isa','lisa','first home','bonus'] },
  { href: '/postcode',                title: 'Postcode super-lookup', hint: 'Council, MP, NHS, police, ward',  group: 'Places', keywords: ['postcode','mp','council','nhs','police'] },
  { href: '/visa-types',              title: 'Browse all UK visas',   hint: '35+ routes with full guides',     group: 'Visas',  keywords: ['visa','routes','browse'] },
  { href: '/visa-switching',          title: 'UK visa switching',     hint: 'In-country switch guide',         group: 'Visas',  keywords: ['switch','switching','inside uk','3c leave'] },
  { href: '/visa/skilled-worker',     title: 'Skilled Worker visa',   hint: '£41,700 · employer sponsored',    group: 'Visas',  keywords: ['skilled','worker','job','employment'] },
  { href: '/visa/student',            title: 'Student visa',          hint: '£558 · degree-level study',       group: 'Visas',  keywords: ['student','study','university'] },
  { href: '/visa/family',             title: 'Family visa',           hint: '£29,000 income · spouse',         group: 'Visas',  keywords: ['family','spouse','partner','marriage'] },
  { href: '/visa/visitor',            title: 'Standard Visitor',      hint: '£135 · tourism / business',       group: 'Visas',  keywords: ['visitor','tourist','business'] },
  { href: '/visa/graduate',           title: 'Graduate visa',         hint: '2 years post-study',              group: 'Visas',  keywords: ['graduate','post study'] },
  { href: '/visa/global-talent',      title: 'Global Talent',         hint: 'No sponsor · endorsed',           group: 'Visas',  keywords: ['talent','endorsement'] },
  { href: '/visa/health-and-care',    title: 'Health & Care Worker',  hint: 'NHS / care · IHS waived',         group: 'Visas',  keywords: ['nhs','care','health'] },
  { href: '/settlement',              title: 'ILR · settlement',      hint: '£3,226 · indefinite leave',       group: 'Visas',  keywords: ['ilr','settlement','indefinite'] },
  { href: '/eligibility',             title: 'Eligibility quiz',      hint: 'Find your route in 60s',          group: 'Visas',  keywords: ['quiz','eligibility','match'] },
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',     title: 'Skilled Worker thresholds 2026', hint: 'Full SOC table',    group: 'Guides', keywords: ['salary','threshold'] },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',   title: 'Family visa £29,000 income',     hint: 'What counts',       group: 'Guides', keywords: ['family','29000','income'] },
  { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',      title: 'eVisa migration guide',          hint: 'Beat the deadline', group: 'Guides', keywords: ['evisa','brp'] },
];

/* PULSE */
interface PulseRow { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'flat'; source: string; }
const PULSE: PulseRow[] = [
  { label: 'Bank rate',          value: '4.25%',  delta: '−25 bp',  trend: 'down', source: 'BoE' },
  { label: 'CPI inflation',      value: '2.1%',   delta: '−0.2 pp', trend: 'down', source: 'ONS' },
  { label: 'Avg weekly wage',    value: '£697',   delta: '+4.1%',   trend: 'up',   source: 'ONS' },
  { label: '£ / €',              value: '1.18',   delta: '+0.4%',   trend: 'up',   source: 'BoE' },
  { label: '£ / $',              value: '1.27',   delta: '−0.2%',   trend: 'down', source: 'BoE' },
  { label: 'Skilled Worker min', value: '£41.7k', delta: 'Apr 26',                source: 'gov.uk' },
];

/* INTENTS */
interface Intent {
  id: string; title: string; desc: string; eyebrow: string;
  icon: typeof Briefcase;
  steps: { href: string; label: string }[];
  accent: string; bg: string;
}
const INTENTS: Intent[] = [
  {
    id: 'work', eyebrow: 'Career path',
    title: 'Work in the UK',
    desc: 'Find a sponsor, check the salary threshold and project your take-home.',
    icon: Briefcase, accent: '#00C4B4', bg: '#ECFEFE',
    steps: [
      { href: '/visa/skilled-worker',  label: 'Skilled Worker visa' },
      { href: '/tools/sponsor-search', label: 'Find a UK sponsor' },
      { href: '/take-home-pay',        label: 'Take-home pay' },
      { href: '/tools/salary-checker', label: 'SOC salary check' },
    ],
  },
  {
    id: 'live', eyebrow: 'Property',
    title: 'Buy or rent a UK home',
    desc: 'See what you can borrow, the SDLT bill and the council tax band.',
    icon: HomeIcon, accent: '#C9A14A', bg: '#FEF8EC',
    steps: [
      { href: '/mortgage-affordability', label: 'Mortgage affordability' },
      { href: '/stamp-duty-calculator',  label: 'Stamp Duty' },
      { href: '/council-tax-band',       label: 'Council Tax band' },
      { href: '/cost-of-living-uk',      label: 'Cost of living' },
    ],
  },
  {
    id: 'local', eyebrow: 'Local lookup',
    title: 'I just moved — what is around me?',
    desc: 'One postcode tells you the council, MP, NHS region, police force and more.',
    icon: MapPin, accent: '#7C3AED', bg: '#F3EEFE',
    steps: [
      { href: '/postcode',          label: 'Postcode super-lookup' },
      { href: '/council-tax-band',  label: 'Council Tax for the area' },
      { href: '/cost-of-living-uk', label: 'Cost of living' },
    ],
  },
  {
    id: 'study', eyebrow: 'Study & stay',
    title: 'Study or stay after a degree',
    desc: 'Student route, Graduate route, and pathways toward settlement.',
    icon: GraduationCap, accent: '#2563EB', bg: '#EEF4FE',
    steps: [
      { href: '/visa/student',  label: 'Student visa' },
      { href: '/visa/graduate', label: 'Graduate route' },
      { href: '/settlement',    label: 'Settlement options' },
      { href: '/eligibility',   label: 'Eligibility quiz' },
    ],
  },
];

const FEATURED_GUIDES = [
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',       title: 'Skilled Worker salary thresholds 2026',  excerpt: 'New SOC-level rates, going-rate floors, and how the £41,700 baseline is calculated.', read: '8 min', tag: 'Visas',  accent: '#E11D48' },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',     title: 'Family visa £29,000 — what counts',      excerpt: 'Which income sources count toward the new £29k threshold, plus the savings shortfall route.', read: '7 min', tag: 'Visas',  accent: '#E11D48' },
  { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026', title: 'How to find a sponsor licence holder',   excerpt: 'Filter 126,530 sponsors by city and sector, plus what to ask before applying for a CoS.', read: '9 min', tag: 'Career', accent: TEAL },
];

/* ═════════════════════════════════════════════
   COMPONENT
═════════════════════════════════════════════ */
export default function Home() {
  const router = useRouter();
  const [query, setQuery]     = useState('');
  const [active, setActive]   = useState(0);
  const [focused, setFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const dirRef   = useRef<HTMLDivElement>(null);

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

  const filteredTiles = useMemo(
    () => activeCategory === 'all' ? APP_TILES : APP_TILES.filter((t) => t.category === activeCategory),
    [activeCategory],
  );

  const catCounts = useMemo(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.id, APP_TILES.filter((t) => t.category === c.id).length])),
    [],
  );

  const selectCategory = (id: CategoryId | 'all') => {
    setActiveCategory(id);
    dirRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: INK, background: '#FFFFFF' }}>

      {/* ═══════════════════════════════════
          1. EDITORIAL HERO (bright white)
      ═══════════════════════════════════ */}
      <section className="relative pt-[110px] md:pt-[130px] pb-12 md:pb-20 overflow-hidden bg-white">
        {/* subtle dot grid backdrop */}
        <div aria-hidden className="absolute inset-0 opacity-[0.35] pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
               backgroundSize: '28px 28px',
               maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)',
               WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)',
             }} />

        <div className="relative max-w-[1200px] mx-auto px-5 md:px-10 text-center">

          {/* badge */}
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 border"
                style={{ background: '#F0FDFA', borderColor: '#99F6E4' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10B981' }} />
            <span className="text-[11px] font-extrabold tracking-[0.16em] uppercase" style={{ color: '#047857', fontFamily: 'Inter, sans-serif' }}>
              {LIVE_COUNT} apps live · {TOTAL_SOON_COUNT}+ launching soon
            </span>
          </span>

          {/* mega headline */}
          <h1 className="font-extrabold tracking-[-0.04em] leading-[0.95] mx-auto"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                       color: NAVY,
                       fontSize: 'clamp(2.6rem, 6.2vw, 5.25rem)',
                       maxWidth: '17ch' }}>
            One toolkit for{' '}
            <span className="relative whitespace-nowrap">
              UK life
              <span aria-hidden className="absolute left-0 right-0 -bottom-1.5 h-[8px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #00C4B4 0%, #C9A14A 100%)', opacity: 0.85 }} />
            </span>
          </h1>

          {/* subhead */}
          <p className="mx-auto mt-7 text-[16px] md:text-[19px] leading-[1.65] font-normal"
             style={{ color: '#475569', maxWidth: '640px' }}>
            Visas, take-home pay, mortgages, postcodes, ULEZ, ILR.
            Every essential UK calculator and information lookup in one
            beautifully simple place — verified against gov.uk.
          </p>

          {/* SEARCH */}
          <div className="relative mt-10 max-w-[680px] mx-auto">
            <div className="relative flex items-center rounded-2xl border-2 transition-all"
                 style={{ background: '#FFFFFF',
                          borderColor: focused ? TEAL : '#E2E8F0',
                          boxShadow: focused
                            ? '0 0 0 6px rgba(0,196,180,0.12), 0 14px 40px -10px rgba(10,37,64,0.22)'
                            : '0 4px 18px -4px rgba(10,37,64,0.08)' }}>
              <Search className="w-5 h-5 ml-5 flex-shrink-0" style={{ color: focused ? TEAL : '#94A3B8' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 160)}
                onKeyDown={onKey}
                placeholder="Search a tool, postcode, or visa…"
                className="flex-1 px-4 py-4 md:py-[18px] bg-transparent outline-none text-[15.5px] md:text-[16px] font-medium placeholder:font-normal"
                style={{ color: NAVY }}
              />
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 mr-3 rounded-md text-[11px] font-bold border"
                    style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#64748B' }}>
                <Command className="w-3 h-3" /> K
              </span>
            </div>

            {/* dropdown */}
            {focused && query && results.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden z-30 text-left"
                   style={{ boxShadow: '0 24px 60px -12px rgba(10,37,64,0.22)' }}>
                {results.map((r, i) => (
                  <Link key={r.href} href={r.href} onMouseEnter={() => setActive(i)}
                        className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors"
                        style={{ background: i === active ? '#F0FDFA' : 'transparent' }}>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-extrabold truncate" style={{ color: NAVY }}>{r.title}</div>
                      <div className="text-[12px] font-normal truncate" style={{ color: '#64748B' }}>{r.hint}</div>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] px-2 py-1 rounded-md"
                          style={{ background: '#0A2540', color: '#5EEAD4' }}>
                      {r.group}
                    </span>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#94A3B8]" />
                  </Link>
                ))}
              </div>
            )}

            {/* quick chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              <span className="text-[11.5px] font-extrabold uppercase tracking-[0.14em]" style={{ color: '#94A3B8' }}>Try:</span>
              {['Take-home pay', 'SDLT', 'Skilled Worker', 'Postcode', 'ULEZ'].map(q => (
                <button key={q} onClick={() => { setQuery(q); inputRef.current?.focus(); }}
                        className="px-3 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all hover:border-[#0A2540] hover:text-[#0A2540]"
                        style={{ background: '#FFFFFF', borderColor: '#E2E8F0', color: '#475569' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* trust strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] font-semibold" style={{ color: '#64748B' }}>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" style={{ color: '#10B981' }} /> Verified against gov.uk</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" style={{ color: GOLD }} /> No account needed</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" style={{ color: TEAL }} /> Free forever</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          2. PULSE MARQUEE (dark thin band)
      ═══════════════════════════════════ */}
      <section className="border-y" style={{ background: NAVY, borderColor: '#0F2D4D' }}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-3.5 flex items-center gap-6 overflow-x-auto">
          <span className="flex-shrink-0 inline-flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em]"
                style={{ color: '#5EEAD4' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} /> UK pulse
          </span>
          <div className="flex items-center gap-7 md:gap-10 flex-shrink-0">
            {PULSE.map((p) => (
              <div key={p.label} className="flex items-baseline gap-2.5 flex-shrink-0">
                <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.label}</span>
                <span className="text-[14px] font-extrabold tabular-nums" style={{ color: '#FFFFFF', fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{p.value}</span>
                {p.delta && (
                  <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold"
                        style={{ color: p.trend === 'up' ? '#34D399' : p.trend === 'down' ? '#FCA5A5' : '#CBD5E1' }}>
                    {p.trend === 'up' && <TrendingUp className="w-2.5 h-2.5" />}
                    {p.trend === 'down' && <TrendingDown className="w-2.5 h-2.5" />}
                    {p.delta}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          3. PATH GRID (cream, 4 large intent cards)
      ═══════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: '#FAFBFC' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <SectionHeader
            eyebrow="Choose your path"
            title="What brings you here?"
            sub="Pick the journey that matches you. We'll line up the calculators, guides and lookups you'll need." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mt-12">
            {INTENTS.map((it) => {
              const Icon = it.icon;
              return (
                <div key={it.id}
                     className="group relative rounded-3xl border bg-white overflow-hidden transition-all hover:-translate-y-1"
                     style={{ borderColor: '#E5E7EB', boxShadow: '0 2px 20px -6px rgba(10,37,64,0.08)' }}>
                  {/* accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: it.accent }} />
                  {/* tinted backdrop */}
                  <div aria-hidden className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-50 pointer-events-none"
                       style={{ background: it.bg, transform: 'translate(30%,-30%)' }} />

                  <div className="relative p-7 md:p-8">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <span className="inline-flex w-12 h-12 rounded-2xl items-center justify-center"
                            style={{ background: it.bg, color: it.accent }}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                            style={{ background: it.bg, color: it.accent }}>
                        {it.eyebrow}
                      </span>
                    </div>

                    <h3 className="text-[22px] md:text-[24px] font-extrabold tracking-[-0.02em] leading-[1.15] mb-2.5"
                        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', color: NAVY }}>
                      {it.title}
                    </h3>
                    <p className="text-[14px] font-normal leading-[1.65] mb-5" style={{ color: '#475569' }}>
                      {it.desc}
                    </p>

                    <ul className="space-y-1.5">
                      {it.steps.map(s => (
                        <li key={s.href}>
                          <Link href={s.href}
                                className="group/step flex items-center justify-between gap-3 py-2.5 px-3 -mx-3 rounded-lg transition-colors hover:bg-[#F8FAFC]">
                            <span className="text-[13.5px] font-bold" style={{ color: NAVY, fontFamily: 'Inter, sans-serif' }}>
                              {s.label}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/step:translate-x-0.5 group-hover/step:-translate-y-0.5"
                                          style={{ color: it.accent }} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          4. BENTO DIRECTORY (white)
      ═══════════════════════════════════ */}
      <section ref={dirRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <SectionHeader
            eyebrow="The directory"
            title="Every calculator, every lookup"
            sub={`${LIVE_COUNT} live tools, organised by what you're trying to do.`} />

          {/* Filter chips */}
          <div className="mt-10 flex flex-wrap gap-2">
            <FilterChip active={activeCategory === 'all'} onClick={() => selectCategory('all')}
                        label="All" count={APP_TILES.length} color={NAVY} />
            {CATEGORIES.map((c) => (
              <FilterChip key={c.id}
                          active={activeCategory === c.id}
                          onClick={() => selectCategory(c.id)}
                          label={c.label}
                          count={catCounts[c.id] ?? 0}
                          color={c.color} />
            ))}
          </div>

          {/* When showing all → bento layout */}
          {activeCategory === 'all' ? (
            <>
              {/* FEATURED — large bento */}
              <SubHeader text="Featured tools" iconColor={GOLD} icon={Star} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {FEATURED_TILES.slice(0, 3).map((t) => (
                  <FeatureTile key={t.href} tile={t} />
                ))}
              </div>

              {/* TRENDING + NEW combined as smaller cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <TileColumn title="Trending now" icon={TrendingUp} iconColor="#E11D48" tiles={TRENDING_TILES.slice(0, 5)} />
                <TileColumn title="Recently added" icon={Sparkles}  iconColor={TEAL}    tiles={NEW_TILES.slice(0, 5)} />
              </div>

              {/* BROWSE ALL — grouped by category */}
              <SubHeader text="Browse by category" iconColor={NAVY} icon={BookOpen} />
              <div className="space-y-10">
                {CATEGORIES.map((cat) => {
                  const tiles = APP_TILES.filter((t) => t.category === cat.id);
                  if (!tiles.length) return null;
                  return (
                    <CategorySection key={cat.id} category={cat} tiles={tiles} />
                  );
                })}
              </div>
            </>
          ) : (
            // When filtered to a single category
            <div className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTiles.map((t) => <SmallTile key={t.href} tile={t} />)}
              </div>
              <button onClick={() => selectCategory('all')}
                      className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold hover:gap-3 transition-all"
                      style={{ color: TEAL }}>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to all categories
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════
          5. CATEGORY ATLAS (navy band)
      ═══════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #06192E 0%, #0A2540 60%, #0D3060 100%)' }}>
        <div aria-hidden className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
             style={{ background: 'radial-gradient(circle, #00C4B4 0%, transparent 60%)' }} />
        <div aria-hidden className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #C9A14A 0%, transparent 60%)' }} />

        <div className="relative max-w-[1200px] mx-auto px-5 md:px-10">
          <SectionHeader
            eyebrow="Category atlas"
            title="Jump straight in"
            sub="Eight pillars of UK life — pick a category to see every tool inside."
            dark />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const count = catCounts[c.id] ?? 0;
              return (
                <button key={c.id} onClick={() => selectCategory(c.id)}
                        className="group text-left p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
                        style={{ background: 'rgba(255,255,255,0.04)',
                                 borderColor: 'rgba(255,255,255,0.10)',
                                 boxShadow: '0 1px 0 0 rgba(255,255,255,0.04) inset' }}>
                  <span className="inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4"
                        style={{ background: `${c.color}22`, color: c.color }}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="text-[15px] font-extrabold text-white leading-tight mb-1"
                       style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                    {c.label}
                  </div>
                  <div className="text-[12px] font-normal mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {c.description}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: c.color }}>
                      {count} tools
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          6. JOURNAL (cream, magazine style)
      ═══════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: '#FAFBFC' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: GOLD }}>The journal</span>
              <h2 className="text-[32px] md:text-[42px] font-extrabold tracking-[-0.03em] leading-[1.06] mt-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', color: NAVY }}>
                Latest guides
              </h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13px] font-bold hover:gap-2.5 transition-all" style={{ color: NAVY }}>
              All articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_GUIDES.map((g) => (
              <Link key={g.href} href={g.href}
                    className="group block rounded-3xl bg-white border overflow-hidden transition-all hover:-translate-y-1"
                    style={{ borderColor: '#E5E7EB', boxShadow: '0 2px 14px -4px rgba(10,37,64,0.06)' }}>
                {/* visual header band */}
                <div className="h-28 relative overflow-hidden"
                     style={{ background: `linear-gradient(135deg, ${g.accent}18 0%, ${g.accent}08 100%)` }}>
                  <div aria-hidden className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-50"
                       style={{ background: g.accent }} />
                  <span className="absolute top-4 left-5 text-[10px] font-extrabold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                        style={{ background: 'white', color: g.accent, boxShadow: '0 1px 4px rgba(10,37,64,0.06)' }}>
                    {g.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-[17px] font-extrabold tracking-[-0.015em] leading-[1.25] mb-2.5"
                      style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', color: NAVY }}>
                    {g.title}
                  </h3>
                  <p className="text-[13.5px] font-normal leading-[1.62] mb-4" style={{ color: '#475569' }}>
                    {g.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold" style={{ color: '#64748B' }}>
                      <Clock className="w-3 h-3" /> {g.read} read
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-extrabold transition-all group-hover:gap-2" style={{ color: g.accent }}>
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          7. COMING SOON (dotted ghost tiles)
      ═══════════════════════════════════ */}
      <section className="py-16 md:py-20 relative bg-white">
        <div aria-hidden className="absolute inset-0 opacity-[0.4] pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle, #E2E8F0 1px, transparent 1px)',
               backgroundSize: '22px 22px',
             }} />
        <div className="relative max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: '#94A3B8' }}>Roadmap</span>
              <h2 className="text-[28px] md:text-[36px] font-extrabold tracking-[-0.025em] leading-[1.1] mt-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', color: NAVY }}>
                {TOTAL_SOON_COUNT}+ more tools landing soon
              </h2>
            </div>
            <span className="text-[12px] font-semibold" style={{ color: '#64748B' }}>
              Building in public · ship every fortnight
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SOON_SHOWCASE.slice(0, 12).map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-4 rounded-2xl border bg-white/80 backdrop-blur-sm"
                     style={{ borderColor: '#E5E7EB', borderStyle: 'dashed' }}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center"
                          style={{ background: `${s.accent}14`, color: s.accent }}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
                          style={{ background: '#FEF3C7', color: '#92400E' }}>
                      Soon
                    </span>
                  </div>
                  <div className="text-[13.5px] font-extrabold leading-tight mb-1" style={{ color: NAVY, fontFamily: 'Inter, sans-serif' }}>
                    {s.label}
                  </div>
                  <div className="text-[11.5px] font-normal leading-snug" style={{ color: '#64748B' }}>
                    {s.hint}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          8. FOOTER CTA (solid teal-navy)
      ═══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: NAVY }}>
        <div aria-hidden className="absolute inset-0 opacity-30"
             style={{ background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(0,196,180,0.3), transparent), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(201,161,74,0.2), transparent)' }} />
        <div className="relative max-w-[1100px] mx-auto px-5 md:px-10 py-16 md:py-24 text-center">
          <h2 className="text-[34px] md:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.04] text-white max-w-3xl mx-auto"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            Built for everyone living, working or moving to the UK.
          </h2>
          <p className="mt-6 text-[15.5px] md:text-[17px] font-normal leading-[1.65] mx-auto" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '560px' }}>
            No accounts. No paywalls. No tracking. Just calculators that work and information that&apos;s correct.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/visa-types"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-extrabold transition-transform hover:-translate-y-0.5"
                  style={{ background: TEAL, color: NAVY, boxShadow: '0 12px 30px -8px rgba(0,196,180,0.55)' }}>
              Explore visa routes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tools"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-extrabold border-2 transition-colors hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}>
              Browse the toolkit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═════════════════════════════════════════════
   SUB-COMPONENTS
═════════════════════════════════════════════ */

function SectionHeader({
  eyebrow, title, sub, dark = false,
}: { eyebrow: string; title: string; sub: string; dark?: boolean }) {
  return (
    <div className="max-w-2xl">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.18em]"
            style={{ color: dark ? '#5EEAD4' : TEAL }}>
        {eyebrow}
      </span>
      <h2 className="text-[32px] md:text-[42px] font-extrabold tracking-[-0.03em] leading-[1.06] mt-2"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                   color: dark ? '#FFFFFF' : NAVY }}>
        {title}
      </h2>
      <p className="mt-4 text-[15.5px] font-normal leading-[1.6]"
         style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#64748B' }}>
        {sub}
      </p>
    </div>
  );
}

function SubHeader({ text, icon: Icon, iconColor }: { text: string; icon: typeof Star; iconColor: string }) {
  return (
    <div className="flex items-center gap-2.5 mt-12 mb-5">
      <span className="inline-flex w-7 h-7 rounded-lg items-center justify-center"
            style={{ background: `${iconColor}15`, color: iconColor }}>
        <Icon className="w-3.5 h-3.5" />
      </span>
      <h3 className="text-[14px] font-extrabold uppercase tracking-[0.14em]" style={{ color: NAVY }}>
        {text}
      </h3>
      <span className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
    </div>
  );
}

function FilterChip({
  active, onClick, label, count, color,
}: { active: boolean; onClick: () => void; label: string; count: number; color: string }) {
  return (
    <button onClick={onClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border-2 transition-all"
            style={active
              ? { background: color, borderColor: color, color: '#FFFFFF' }
              : { background: '#FFFFFF', borderColor: '#E2E8F0', color: '#475569' }}>
      {label}
      <span className="text-[11px] tabular-nums font-extrabold opacity-70">{count}</span>
    </button>
  );
}

function FeatureTile({ tile }: { tile: typeof APP_TILES[number] }) {
  const Icon = tile.icon;
  return (
    <Link href={tile.href}
          className="group relative block rounded-3xl border bg-white overflow-hidden transition-all hover:-translate-y-1"
          style={{ borderColor: '#E5E7EB', boxShadow: '0 2px 20px -6px rgba(10,37,64,0.08)' }}>
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: tile.accent }} />
      <div aria-hidden className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
           style={{ background: tile.accent }} />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-5">
          <span className="inline-flex w-12 h-12 rounded-2xl items-center justify-center"
                style={{ background: `${tile.accent}18`, color: tile.accent }}>
            <Icon className="w-5 h-5" />
          </span>
          <span className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] px-2 py-1 rounded-full"
                style={{ background: '#FEF3C7', color: '#92400E' }}>
            ★ Featured
          </span>
        </div>
        <h4 className="text-[17px] font-extrabold tracking-[-0.015em] leading-tight mb-1.5"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', color: NAVY }}>
          {tile.label}
        </h4>
        <p className="text-[13px] font-normal leading-[1.55] mb-4" style={{ color: '#64748B' }}>
          {tile.hint}
        </p>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-extrabold group-hover:gap-2 transition-all"
              style={{ color: tile.accent }}>
          Open tool <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

function TileColumn({
  title, icon: Icon, iconColor, tiles,
}: { title: string; icon: typeof Star; iconColor: string; tiles: typeof APP_TILES }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="inline-flex w-7 h-7 rounded-lg items-center justify-center"
              style={{ background: `${iconColor}15`, color: iconColor }}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <h3 className="text-[14px] font-extrabold uppercase tracking-[0.14em]" style={{ color: NAVY }}>{title}</h3>
      </div>
      <div className="space-y-2">
        {tiles.map((t) => <SmallTile key={t.href} tile={t} />)}
      </div>
    </div>
  );
}

function SmallTile({ tile }: { tile: typeof APP_TILES[number] }) {
  const Icon = tile.icon;
  return (
    <Link href={tile.href}
          className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-white border transition-all hover:border-[#0A2540] hover:shadow-[0_4px_14px_-4px_rgba(10,37,64,0.10)]"
          style={{ borderColor: '#E5E7EB' }}>
      <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center flex-shrink-0"
            style={{ background: `${tile.accent}14`, color: tile.accent }}>
        <Icon className="w-4 h-4" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-extrabold leading-tight" style={{ color: NAVY, fontFamily: 'Inter, sans-serif' }}>
          {tile.label}
        </div>
        <div className="text-[11.5px] font-normal leading-snug truncate mt-0.5" style={{ color: '#64748B' }}>
          {tile.hint}
        </div>
      </div>
      {tile.status === 'new' && (
        <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] px-1.5 py-0.5 rounded"
              style={{ background: '#ECFEFE', color: '#0F766E' }}>New</span>
      )}
      <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: '#94A3B8' }} />
    </Link>
  );
}

function CategorySection({
  category, tiles,
}: { category: typeof CATEGORIES[number]; tiles: typeof APP_TILES }) {
  const Icon = category.icon;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex w-9 h-9 rounded-xl items-center justify-center"
                style={{ background: `${category.color}15`, color: category.color }}>
            <Icon className="w-4 h-4" />
          </span>
          <div>
            <div className="text-[15px] font-extrabold leading-tight"
                 style={{ color: NAVY, fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              {category.label}
            </div>
            <div className="text-[12px] font-normal" style={{ color: '#64748B' }}>{category.description}</div>
          </div>
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
              style={{ background: `${category.color}12`, color: category.color }}>
          {tiles.length} tools
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {tiles.map((t) => <SmallTile key={t.href} tile={t} />)}
      </div>
    </div>
  );
}
