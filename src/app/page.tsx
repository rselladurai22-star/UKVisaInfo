import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight, Search, Briefcase, GraduationCap, Users,
  HeartPulse, Star, Award, ShieldCheck, Ban, BookOpen,
  Wallet, HomeIcon, Shield, LandmarkIcon, Plane,
  PiggyBank, Building2, FileText, Zap, Car, Gift, Baby, Clock,
  ExternalLink, TrendingUp, Percent, CheckCircle2
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../data/tools';

export const metadata: Metadata = {
  title: 'UKDesk — UK Tools, Calculators & Visa Guides',
  description:
    'A single, trusted home for UK money, property and visa decisions. 50+ calculators verified against gov.uk, HMRC and ONS.',
  alternates: { canonical: '/' },
};

/* ────────────────────────────────────────────────
   CURATED CONTENT & CONFIG
   ──────────────────────────────────────────────── */

// Core Tool Hubs (NerdWallet Product Hub style)
const CORE_HUBS = [
  {
    title: 'Income & Salary Tax',
    description: 'Calculate net pay under HMRC codes, check dividend rates, and audit your payslip.',
    icon: Wallet,
    accent: 'bg-[#00875A]/10 text-[#00875A]',
    ctaLabel: 'Compare Tax Tools',
    ctaHref: '/category/tax',
    tools: [
      { label: 'Take-Home Pay Calculator', href: '/take-home-pay', desc: 'PAYE + NI + student loans' },
      { label: 'Payslip Auditor & Tax Code Check', href: '/payslip-auditor', desc: 'Verify tax codes against errors' },
      { label: 'Self-Employed Tax Calculator', href: '/self-employed-tax', desc: 'SA estimations & tax schedules' },
      { label: 'Salary Sacrifice Calculator', href: '/salary-sacrifice-calculator', desc: 'Calculate pension & EV salary sacrifice savings' },
    ],
  },
  {
    title: 'Mortgages & Property',
    description: 'Estimate borrowing capacity, stamp duty rates, and landlord rental returns.',
    icon: HomeIcon,
    accent: 'bg-blue-50 text-blue-800',
    ctaLabel: 'Compare Property Tools',
    ctaHref: '/category/property',
    tools: [
      { label: 'Mortgage Affordability Calculator', href: '/mortgage-affordability', desc: 'Max borrowing limits & stress tests' },
      { label: 'Stamp Duty Land Tax (SDLT)', href: '/stamp-duty-calculator', desc: 'Rates for main homes, FTB, & second homes' },
      { label: 'Council Tax Band Lookup', href: '/council-tax-band', desc: 'Lookup tax bands and bills by postcode' },
      { label: 'Mortgage Overpayment Calculator', href: '/overpayment-mortgage', desc: 'Calculate interest saved & term reduction' },
    ],
  },
  {
    title: 'Immigration & Visas',
    description: 'Check fees, calculate health surcharges, and audit Skilled Worker points.',
    icon: Plane,
    accent: 'bg-purple-50 text-purple-800',
    ctaLabel: 'Compare Visa Tools',
    ctaHref: '/category/immigration',
    tools: [
      { label: 'Visa Cost Calculator', href: '/tools/cost-calculator', desc: 'Total fees + IHS + dependants' },
      { label: 'IHS Surcharge Calculator', href: '/ihs-calculator', desc: 'Calculate annual healthcare surcharges' },
      { label: 'Skilled Worker Points Check', href: '/skilled-worker-points-check', desc: 'Check eligibility for 70-point threshold' },
      { label: 'UK Visa Routes Directory', href: '/visa-types', desc: 'Compare 14 active visa pathways' },
    ],
  },
  {
    title: 'Savings & Childcare',
    description: 'Forecast pensions, project ISA growth, and check childcare support eligibility.',
    icon: PiggyBank,
    accent: 'bg-amber-50 text-amber-800',
    ctaLabel: 'Compare Savings Tools',
    ctaHref: '/category/savings',
    tools: [
      { label: 'State Pension Estimator', href: '/state-pension', desc: 'Qualifying years & payout forecasts' },
      { label: 'ISA Investment Growth', href: '/isa-calculator', desc: 'Project tax-free savings compound returns' },
      { label: 'Childcare Costs Calculator', href: '/childcare-calculator', desc: 'Check free hours & Tax-Free Childcare savings' },
      { label: 'Lifetime ISA Calculator', href: '/lifetime-isa-calculator', desc: 'Model 25% government bonus for home buying' },
    ],
  },
];

// Future Categories (upcoming tools mapped to category IDs)
const FUTURE_CATEGORIES: Record<string, { tools: string[]; icon: any }> = {
  business: {
    icon: Building2,
    tools: ['Corporation Tax Calculator', 'PAYE Tax Calculator', 'Invoice Tax Calculator', 'VAT Registration Guide'],
  },
  insurance: {
    icon: Shield,
    tools: ['Life Cover Calculator', 'Health Insurance Guide', 'Home Rebuild Cost Estimator', 'Car Insurance Guide'],
  },
  loans: {
    icon: LandmarkIcon,
    tools: ['APR Comparison Calculator', 'Debt Consolidation Tool', 'Credit Strategy Planner', 'Personal Loan Estimator'],
  },
  estate: {
    icon: FileText,
    tools: ['Probate Fee Estimator', 'Will Writing Cost Compare', 'Power of Attorney Costs', 'Estate Planner'],
  },
  'family-law': {
    icon: Users,
    tools: ['Divorce Cost Estimate', 'Child Maintenance (CMS)', 'Asset Split Calculator', 'Pre-nup Costs Guide'],
  },
  energy: {
    icon: Zap,
    tools: ['Solar Panel ROI Calculator', 'Heat Pump vs Boiler', 'Ofgem Energy Cap Estimator', 'Smart Meter Savings'],
  },
};

// Trending policy changes
const TRENDING_CHANGES = [
  {
    category: 'Immigration & Fees',
    title: 'UK Visa Fee Changes 2026',
    summary: 'Home Office fee table updates effective April 2026. Indefinite Leave to Remain application fee adjusted to £3,226.',
    href: '/news/spring-2026-fee-uplift',
    tagColor: 'text-purple-800 bg-purple-50',
  },
  {
    category: 'Employment & Wages',
    title: 'National Minimum Wage Increase',
    summary: 'National Living Wage increases to £12.21 per hour. Check your salary equivalent and entitlement details.',
    href: '/blog/minimum-wage-annual-salary-by-hours-2025-26',
    tagColor: 'text-[#00875A] bg-[#00875A]/10',
  },
  {
    category: 'Property & Tax',
    title: 'Stamp Duty Threshold Rates 2025/26',
    summary: 'First-time buyer relief and rate changes. View the full 2025/26 threshold tables for England.',
    href: '/blog/first-time-buyer-stamp-duty-2025-26',
    tagColor: 'text-blue-800 bg-blue-50',
  },
  {
    category: 'Immigration & Digital Status',
    title: 'eVisa Digital Transition Guidelines',
    summary: 'Biometric Residence Permits (BRP) sunset guidance. Instructions for linking BRPs to your UKVI account.',
    href: '/news/evisa-transition-2026',
    tagColor: 'text-indigo-800 bg-indigo-50',
  },
];

// Learn Groupings (3-in-1 resource packs)
const LEARN_GROUPS = [
  {
    title: 'Buying a Home',
    description: 'Calculate buying power, check stamp duty bands, and verify HMRC rules.',
    icon: HomeIcon,
    calculator: { label: 'Stamp Duty Calculator', href: '/stamp-duty-calculator' },
    guide: { label: 'Stamp Duty by Price Table', href: '/blog/stamp-duty-by-price-table-2025-26' },
    official: { label: 'HMRC SDLT Guidance (gov.uk)', href: 'https://www.gov.uk/stamp-duty-land-tax' },
  },
  {
    title: 'Working in the UK',
    description: 'Verify take-home pay, compare salaries, and audit your HMRC tax code.',
    icon: Briefcase,
    calculator: { label: 'Take-Home Pay Calculator', href: '/take-home-pay' },
    guide: { label: 'UK Salary After Tax Table', href: '/blog/uk-salary-after-tax-take-home-table-2025-26' },
    official: { label: 'HMRC Tax Codes (gov.uk)', href: 'https://www.gov.uk/tax-codes' },
  },
  {
    title: 'Immigration & Visas',
    description: 'Total up application fees, calculate IHS surcharge, and check point targets.',
    icon: Plane,
    calculator: { label: 'Visa Cost Calculator', href: '/tools/cost-calculator' },
    guide: { label: 'Every UK Visa Route Guide', href: '/visa-types' },
    official: { label: 'Home Office Fee Table (gov.uk)', href: 'https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026' },
  },
  {
    title: 'Benefits & Childcare',
    description: 'Evaluate childcare free hours, verify Universal Credit tapers, and claim allowance.',
    icon: Baby,
    calculator: { label: 'Childcare Costs Calculator', href: '/childcare-calculator' },
    guide: { label: 'Universal Credit Taper Guide', href: '/blog/universal-credit-taper-explained-2025-26' },
    official: { label: 'DWP Childcare Options (gov.uk)', href: 'https://www.gov.uk/childcare-calculator' },
  },
  {
    title: 'Driving & Vehicle Check',
    description: 'Check London ULEZ conformity, verify MOT status, and calculate running costs.',
    icon: Car,
    calculator: { label: 'ULEZ / CAZ Compliance Check', href: '/ulez-check' },
    guide: { label: 'Car Annual Running Costs Guide', href: '/blog/what-does-a-car-cost-to-run-per-year-2025' },
    official: { label: 'TfL Vehicle Checker (tfl.gov.uk)', href: 'https://tfl.gov.uk/modes/driving/ultra-low-emission-zone/ulez-vrm-checker' },
  },
];

/* ────────────────────────────────────────────────
   PAGE COMPONENT (Server Component)
   ──────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-surface text-slate-900 min-h-screen font-sans antialiased">
      {/* 1. HERO - UK LIFE DECISION ENGINE */}
      <HeroSection />

      {/* 2. TRUST & STATS BAR */}
      <TrustBarSection />

      {/* 3. CORE PRODUCT HUBS (NerdWallet Style) */}
      <CoreProductHubsSection />

      {/* 4. COMPACT LIST DIRECTORY */}
      <DirectoryGridSection />

      {/* 5. TRENDING POLICY GUIDES */}
      <TrendingChangesSection />

      {/* 6. LEARN RESOURCE PACKS */}
      <LearnSection />

      {/* 7. OFFICIAL UK UPDATES TIMELINE */}
      <TimelineSection />

      {/* 8. CLOSING CTA */}
      <ClosingCtaSection />
    </div>
  );
}

/* ────────────────────────────────────────────────
   SUB-COMPONENTS
   ──────────────────────────────────────────────── */

// 1. Hero
function HeroSection() {
  const TRIGGERS = [
    { label: 'Take-home pay', href: '/take-home-pay', icon: Wallet },
    { label: 'Mortgage affordability', href: '/mortgage-affordability', icon: HomeIcon },
    { label: 'Stamp duty (SDLT)', href: '/stamp-duty-calculator', icon: Percent },
    { label: 'Immigration & Visas', href: '/visa-types', icon: Plane },
    { label: 'Childcare costs', href: '/childcare-calculator', icon: Baby },
    { label: 'ULEZ check', href: '/ulez-check', icon: Car },
  ];

  return (
    <section className="bg-white pt-12 pb-10 sm:pt-16 sm:pb-12 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded bg-[#00875A]/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00875A]">
          ✓ Tax Year 2026/27 Rates Active
        </span>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B2240] tracking-tight leading-[1.1] mb-5">
          Let&apos;s calculate your next <br className="hidden sm:inline" />
          <span className="text-[#00875A]">UK life decision.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          Compare income taxes, evaluate mortgage capacity, check visa requirements, and model childcare costs. 100% free, independent, and verified against official databases.
        </p>

        {/* Search Command Center */}
        <form action="/tools" method="get" className="group relative w-full max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center rounded-full border border-[#d2dcf0] bg-white px-5 py-3.5 shadow-md transition-all duration-200 focus-within:border-[#00875A] focus-within:ring-2 focus-within:ring-[#00875A]/10">
            <Search className="mr-3 h-5 w-5 flex-none text-[#0B2240]" />
            <input
              type="search"
              name="q"
              placeholder="Search take-home pay, stamp duty, student visa, pensions..."
              className="flex-1 border-none bg-transparent text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 py-0.5"
            />
            <button
              type="submit"
              className="bg-[#00875A] hover:bg-[#00704a] text-white font-bold text-sm px-6 py-2 rounded-full transition-colors active:scale-95 flex items-center gap-1 ml-2"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Triggers */}
        <div className="flex flex-col items-center gap-3 w-full">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Popular Calculators:</span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
            {TRIGGERS.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#0B2240] hover:text-[#00875A] hover:border-[#00875A] hover:shadow-sm transition-all active:scale-95"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// 2. Trust Bar
function TrustBarSection() {
  const STATS = [
    { label: 'Calculators & Lookups', value: '50+', sub: 'HMRC & Home Office verified' },
    { label: 'Sourced Data Integrity', value: '100%', sub: 'HMRC, ONS, and gov.uk only' },
    { label: 'Data Accuracy Audits', value: 'Weekly', sub: 'Updated for 2026/27 rate tables' },
  ];

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-5">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x md:divide-slate-200">
          {STATS.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center text-center md:items-start md:text-left px-4 first:pl-0 last:pr-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#0B2240] tracking-tight">{s.value}</span>
                <span className="text-[11px] font-extrabold text-[#00875A] uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 3. Core Product Hubs (NerdWallet Style)
function CoreProductHubsSection() {
  return (
    <section className="bg-surface py-12 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1">UKDesk Essentials</p>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#0B2240] tracking-tight mb-2">
            Our Core Calculators
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Find the right tools to evaluate wages, stamp duty liability, visa applications, and personal savings.
          </p>
        </div>

        {/* 2x2 Grid of Core Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CORE_HUBS.map((hub, idx) => {
            const Icon = hub.icon;
            return (
              <div
                key={idx}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${hub.accent}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-[#0B2240]">
                      {hub.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed font-medium">
                      {hub.description}
                    </p>
                  </div>
                </div>

                {/* Simplified List of 4 Core Tools with Forest Green arrow indicators */}
                <ul className="space-y-3 flex-1 mt-2">
                  {hub.tools.map((t, tIdx) => (
                    <li key={tIdx} className="border-b border-slate-50 last:border-0 pb-2.5 last:pb-0">
                      <Link
                        href={t.href}
                        className="group flex flex-col justify-start text-left"
                      >
                        <div className="flex items-center justify-between text-sm font-extrabold text-[#0B2240] hover:text-[#00875A] transition-colors leading-tight">
                          <span>{t.label}</span>
                          <span className="text-[#00875A] font-normal group-hover:translate-x-1 transition-all duration-150">→</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 leading-normal">{t.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Category Hub CTA Link */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-start">
                  <Link
                    href={hub.ctaHref}
                    className="inline-flex items-center justify-center bg-[#00875A] hover:bg-[#00704a] text-white font-bold text-xs px-5 py-2.5 rounded transition-all active:scale-95"
                  >
                    {hub.ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 4. Directory Grid (All 13 Categories Matrix)
function DirectoryGridSection() {
  const activeCategoryIds: CategoryId[] = [
    'tax', 'property', 'immigration', 'employment', 'savings', 'vehicles', 'benefits'
  ];

  return (
    <section className="bg-white py-12 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1">Interactive Index</p>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#0B2240] tracking-tight mb-2">
            All UKLife Directory Areas
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Browse our complete directory categories. Each hub lists up to 4 top tools and links directly to the sector index page.
          </p>
        </div>

        {/* 16-Card Matrix Grid (All col-span-1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Active Categories */}
          {activeCategoryIds.map((id) => {
            const cat = CATEGORIES.find((c) => c.id === id)!;
            const Icon = cat.icon;
            const categoryTools = APP_TILES.filter((t) => t.category === id);
            const count = categoryTools.length;
            const topTools = categoryTools.slice(0, 4);

            return (
              <article
                key={id}
                className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md h-[290px]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 border-b border-slate-50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 text-[#00875A]">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="font-display text-sm font-extrabold text-[#0B2240] leading-tight">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {count}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {cat.description}
                </p>

                {/* Directory Tool Rows */}
                <ul className="space-y-2 flex-1 mt-1">
                  {topTools.map((t) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5"
                      >
                        <span className="truncate mr-2">{t.label}</span>
                        <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all duration-150">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Hub Link */}
                <div className="mt-4 pt-2 border-t border-slate-100">
                  <Link
                    href={`/category/${id}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00875A] hover:text-[#00704a] group"
                  >
                    <span>View all {count} tools</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}

          {/* Future Categories */}
          {Object.entries(FUTURE_CATEGORIES).map(([id, data]) => {
            const Icon = data.icon;
            const cat = CATEGORIES.find((c) => c.id === id)!;

            return (
              <article
                key={id}
                className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md h-[290px] opacity-90"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 border-b border-slate-50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 text-amber-700">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="font-display text-sm font-extrabold text-[#0B2240] leading-tight">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase tracking-wide">
                    Soon
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {cat.description}
                </p>

                {/* Placeholder Bullet List */}
                <ul className="space-y-1.5 flex-1 mt-1">
                  {data.tools.slice(0, 4).map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-500 py-0.5">
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="truncate">{t}</span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Hub CTA */}
                <div className="mt-4 pt-2.5 border-t border-slate-100 text-[10px] text-amber-700 font-extrabold uppercase tracking-wider">
                  Pipeline updates incoming
                </div>
              </article>
            );
          })}

          {/* Card 14: Resource Hub Links */}
          <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md h-[290px]">
            <div className="flex items-start justify-between mb-3 border-b border-slate-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 text-[#00875A]">
                  <BookOpen className="h-4.5 w-4.5" />
                </span>
                <h3 className="font-display text-sm font-extrabold text-[#0B2240] leading-tight">
                  Updates & Guides
                </h3>
              </div>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                Links
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
              Browse policy changes, tax rate tables, and analytical explanations.
            </p>
            <ul className="space-y-2 flex-1 mt-1">
              <li>
                <Link href="/news" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Policy News Feed</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Guides Hub Directory</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Data Sourcing Info</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Editorial Contacts</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2 border-t border-slate-100">
              <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00875A] hover:text-[#00704a] group">
                <span>Open Resource Hub</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>

          {/* Card 15: Developer Services */}
          <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md h-[290px]">
            <div className="flex items-start justify-between mb-3 border-b border-slate-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 text-[#00875A]">
                  <ExternalLink className="h-4.5 w-4.5" />
                </span>
                <h3 className="font-display text-sm font-extrabold text-[#0B2240] leading-tight">
                  APIs & Developers
                </h3>
              </div>
              <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wide">
                API
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
              Integrate live UK tax tables and ULEZ compliance lookup tools.
            </p>
            <ul className="space-y-2 flex-1 mt-1">
              <li>
                <Link href="/about#api" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>API Documentation</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <a href="https://github.com/rselladurai22-star/UKVisaInfo" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-[#00875A] transition-all" />
                </a>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Request API Access</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>API Status Indicators</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2 border-t border-slate-100">
              <Link href="/about#api" className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00875A] hover:text-[#00704a] group">
                <span>View API Services</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>

          {/* Card 16: Trust & Integrity Verification */}
          <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md h-[290px]">
            <div className="flex items-start justify-between mb-3 border-b border-slate-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 text-[#00875A]">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </span>
                <h3 className="font-display text-sm font-extrabold text-[#0B2240] leading-tight">
                  Data Verification
                </h3>
              </div>
              <span className="rounded bg-secondary-soft px-1.5 py-0.5 text-[9px] font-bold text-secondary uppercase tracking-wide">
                Trust
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
              All calculations verified directly against official UK guidelines.
            </p>
            <ul className="space-y-2 flex-1 mt-1">
              <li>
                <Link href="/editorial-policy" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Editorial Guidelines</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/sources" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Data Sourcing Guide</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Privacy Policy Links</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center justify-between text-xs font-bold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span>Submit Correction Request</span>
                  <span className="text-slate-300 group-hover:text-[#00875A] group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2 border-t border-slate-100">
              <Link href="/sources" className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00875A] hover:text-[#00704a] group">
                <span>Check Sourcing Rules</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

// 5. Trending Changes
function TrendingChangesSection() {
  return (
    <section className="bg-surface py-12 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="mb-8 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1">Recent Updates</p>
          <h2 className="font-display text-2xl font-black text-[#0B2240] tracking-tight mb-2">
            Trending Policy & Rate Changes
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            Major legislative updates and timeline alterations affecting UK finances and immigration status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {TRENDING_CHANGES.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex flex-col rounded-xl bg-white p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.tagColor}`}>
                  {item.category}
                </span>
                <span className="text-[#00875A] group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <h3 className="font-display text-base font-extrabold text-[#0B2240] group-hover:text-[#00875A] transition-colors mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. Learn Groupings (3-in-1 resource packs)
function LearnSection() {
  return (
    <section className="bg-white py-12 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1">Knowledge Library</p>
          <h2 className="font-display text-2xl font-black text-[#0B2240] tracking-tight mb-2">
            Learn — Goal-Oriented Resources
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            Solve specific problems using our three-in-one resource bundles, complete with calculators, analytical guides, and official source links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARN_GROUPS.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="flex flex-col bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-2.5 mb-3 border-b border-slate-50 pb-2">
                  <span className="p-1 text-[#00875A]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base font-extrabold text-[#0B2240]">
                    {g.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-medium">
                  {g.description}
                </p>

                <div className="mt-auto space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider w-20 text-center">
                      Calculator
                    </span>
                    <Link
                      href={g.calculator.href}
                      className="text-xs sm:text-sm text-[#00875A] font-extrabold hover:underline"
                    >
                      {g.calculator.label}
                    </Link>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-purple-50 px-2 py-0.5 text-[9px] font-bold text-purple-700 uppercase tracking-wider w-20 text-center">
                      Guide
                    </span>
                    <Link
                      href={g.guide.href}
                      className="text-xs sm:text-sm text-[#00875A] font-extrabold hover:underline"
                    >
                      {g.guide.label}
                    </Link>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700 uppercase tracking-wider w-20 text-center">
                      Official
                    </span>
                    <a
                      href={g.official.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-slate-700 font-bold hover:text-[#00875A] flex items-center gap-1 group"
                    >
                      <span className="truncate">{g.official.label}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-[#00875A]" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 7. Official UK Updates Timeline (Government style)
function TimelineSection() {
  const EVENTS = [
    {
      time: 'Today',
      date: '8 April 2026',
      title: 'Visa fee increases take effect',
      desc: 'Home Office fee uplifts go live across major visa classes. Indefinite Leave to Remain (ILR) application fee adjusted to £3,226.',
      href: '/news/spring-2026-fee-uplift',
    },
    {
      time: '2 weeks ago',
      date: '25 March 2026',
      title: 'Long Residence ILR rules revised',
      desc: 'Clarified policies regarding absence allowances for 10-year residency paths. Continuous residency count guidelines now enforce strict 180-day individual calendar caps.',
      href: '/news/care-worker-route-closed',
    },
    {
      time: '1 month ago',
      date: '8 March 2026',
      title: 'HMRC tax code regulations published',
      desc: 'Official guidance for 2026/27 personal tax allowance allocations and PAYE emergency prefix codes issued.',
      href: '/blog/uk-salary-after-tax-take-home-table-2025-26',
    },
    {
      time: '2 months ago',
      date: '8 February 2026',
      title: 'Funded childcare expands further',
      desc: 'Applications open for working parents claiming 15 free hours weekly for children aged 9 months and older, leading to full rollouts in September.',
      href: '/childcare-calculator',
    },
  ];

  return (
    <section className="bg-surface py-12 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section description */}
          <div className="lg:col-span-1 max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1">Real-time Stream</p>
            <h2 className="font-display text-2xl font-black text-[#0B2240] tracking-tight mb-3">
              Official UK Updates Log
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-4 font-medium">
              Track policy changes, standard rate updates, and regulatory adjustments as they are verified from administrative logs.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live monitoring active
            </span>
          </div>

          {/* Timeline list */}
          <div className="lg:col-span-2 relative pl-6 border-l-2 border-slate-200 space-y-6">
            {EVENTS.map((ev, idx) => (
              <div key={idx} className="relative group text-left">
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-surface bg-[#00875A] transition-all duration-300 group-hover:scale-125" />

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 mb-1">
                  <span className="text-xs font-bold text-[#00875A] tracking-wide">{ev.time} ({ev.date})</span>
                </div>
                <h3 className="font-display text-base font-extrabold text-[#0B2240] group-hover:text-[#00875A] transition-colors mb-1">
                  {ev.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2 font-medium">
                  {ev.desc}
                </p>
                <Link
                  href={ev.href}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00875A] group-hover:underline"
                >
                  View full update note
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 8. Closing CTA
function ClosingCtaSection() {
  return (
    <section className="bg-[#0B2240] text-white py-12">
      <div className="container-page px-4 mx-auto max-w-6xl text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-black tracking-tight mb-4 text-white leading-tight">
            Find your next answer in seconds.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed font-medium">
            Compare visa options, model stamp duty fees, or calculate your exact take-home pay. Pure tools, zero noise.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded bg-[#00875A] hover:bg-[#00704a] text-white px-8 py-3.5 text-sm font-bold shadow hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Open the Tool Index
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
