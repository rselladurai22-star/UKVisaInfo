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

// 1. Popular Tools Grid (8 live tools with HMRC / gov.uk badges)
const POPULAR_TOOLS = [
  {
    href: '/take-home-pay',
    label: 'Take-Home Pay',
    badge: 'HMRC verified',
    description: 'Calculate net salary after income tax, National Insurance, student loans, and pensions.',
    updated: 'Tax year 2026/27',
    icon: Wallet,
    accent: 'text-primary bg-primary/10',
  },
  {
    href: '/mortgage-affordability',
    label: 'Mortgage Affordability',
    badge: 'Bank of England verified',
    description: 'Estimate maximum mortgage borrowing limits based on income multiples and interest stress tests.',
    updated: 'Updated June 2026',
    icon: HomeIcon,
    accent: 'text-amber-700 bg-amber-50',
  },
  {
    href: '/stamp-duty-calculator',
    label: 'Stamp Duty (SDLT)',
    badge: 'HMRC verified',
    description: 'Calculate stamp duty land tax for main homes, first-time buyers, and buy-to-let properties.',
    updated: 'Tax year 2026/27',
    icon: Percent,
    accent: 'text-blue-700 bg-blue-50',
  },
  {
    href: '/council-tax-band',
    label: 'Council Tax Bands',
    badge: 'VOA verified',
    description: 'Look up council tax bands and see estimated annual bills for any postcode in England.',
    updated: 'Tax year 2026/27',
    icon: Building2,
    accent: 'text-emerald-700 bg-emerald-50',
  },
  {
    href: '/redundancy-pay',
    label: 'Redundancy Pay',
    badge: 'gov.uk verified',
    description: 'Find your statutory redundancy entitlement based on age, service, and weekly wages.',
    updated: 'Updated 2026',
    icon: LandmarkIcon,
    accent: 'text-rose-700 bg-rose-50',
  },
  {
    href: '/holiday-pay',
    label: 'Holiday Entitlement',
    badge: 'gov.uk verified',
    description: 'Calculate statutory holiday days and pay for full-time, part-time, and irregular shift workers.',
    updated: 'Updated 2026',
    icon: Briefcase,
    accent: 'text-indigo-700 bg-indigo-50',
  },
  {
    href: '/state-pension',
    label: 'State Pension',
    badge: 'DWP verified',
    description: 'Estimate your state pension age and forecast payouts based on qualifying NI contribution years.',
    updated: 'Triple Lock 2026/27',
    icon: PiggyBank,
    accent: 'text-violet-700 bg-violet-50',
  },
  {
    href: '/ulez-check',
    label: 'ULEZ compliance',
    badge: 'TfL verified',
    description: 'Verify if your petrol or diesel car meets emissions standards for clean air zones.',
    updated: 'Updated 2026',
    icon: Car,
    accent: 'text-cyan-700 bg-cyan-50',
  },
];

// 2. Future Categories (upcoming tools mapped to category IDs)
const FUTURE_CATEGORIES: Record<string, { badge: string; tools: string[]; icon: any }> = {
  business: {
    badge: 'Soon',
    icon: Building2,
    tools: ['Corporation Tax Calculator', 'PAYE Tax Calculator', 'Invoice Tax Calculator', 'VAT Registration Guide'],
  },
  insurance: {
    badge: 'Soon',
    icon: Shield,
    tools: ['Life Cover Calculator', 'Health Insurance Guide', 'Home Rebuild Cost Estimator', 'Car Insurance Guide'],
  },
  loans: {
    badge: 'Soon',
    icon: LandmarkIcon,
    tools: ['APR Comparison Calculator', 'Debt Consolidation Tool', 'Credit Strategy Planner', 'Personal Loan Estimator'],
  },
  estate: {
    badge: 'Soon',
    icon: FileText,
    tools: ['Probate Fee Estimator', 'Will Writing Cost Compare', 'Power of Attorney Costs', 'Estate Planner'],
  },
  'family-law': {
    badge: 'Soon',
    icon: Users,
    tools: ['Divorce Cost Estimate', 'Child Maintenance (CMS)', 'Asset Split Calculator', 'Pre-nup Costs Guide'],
  },
  energy: {
    badge: 'Soon',
    icon: Zap,
    tools: ['Solar Panel ROI Calculator', 'Heat Pump vs Boiler', 'Ofgem Energy Cap Estimator', 'Smart Meter Savings'],
  },
};

// 3. Trending policy changes (Horizontal Cards)
const TRENDING_CHANGES = [
  {
    slug: 'spring-2026-fee-uplift',
    category: 'Fees Update',
    title: 'UK Visa Fee Changes 2026',
    summary: 'Home Office fee table updates effective April 2026. ILR fees increased to £3,226.',
    href: '/news/spring-2026-fee-uplift',
    accentColor: 'border-l-4 border-l-primary',
  },
  {
    slug: 'minimum-wage-2025-26',
    category: 'Employment',
    title: 'Minimum Wage Increase',
    summary: 'National Living Wage increases to £12.21 per hour. Check your salary equivalent.',
    href: '/blog/minimum-wage-annual-salary-by-hours-2025-26',
    accentColor: 'border-l-4 border-l-secondary',
  },
  {
    slug: 'stamp-duty-2025-26',
    category: 'Property Tax',
    title: 'Stamp Duty Thresholds',
    summary: 'First-time buyer relief and rate changes. View the full 2025/26 threshold tables.',
    href: '/blog/first-time-buyer-stamp-duty-2025-26',
    accentColor: 'border-l-4 border-l-amber-600',
  },
  {
    slug: 'evisa-transition-2026',
    category: 'Immigration',
    title: 'eVisa Digital Transition',
    summary: 'Biometric Residence Permits (BRP) sunset guidance. UKVI digital status check instructions.',
    href: '/news/evisa-transition-2026',
    accentColor: 'border-l-4 border-l-purple-600',
  },
];

// 4. Learn Resource Packs (3-in-1 pack)
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
    description: 'Verify take-home pay, compare cities, and check legal employment rights.',
    icon: Briefcase,
    calculator: { label: 'Take-Home Pay Calculator', href: '/take-home-pay' },
    guide: { label: 'UK Salary After Tax Table', href: '/blog/uk-salary-after-tax-take-home-table-2025-26' },
    official: { label: 'HMRC Tax Codes (gov.uk)', href: 'https://www.gov.uk/tax-codes' },
  },
  {
    title: 'Immigration & Relocation',
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
    title: 'Driving & CAZ',
    description: 'Check London ULEZ conformity, check MOT statuses, and plan running costs.',
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
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Dynamic inline styles for advanced animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseWidth {
          0%, 100% { width: 62%; }
          50% { width: 76%; }
        }
        @keyframes growHeightTakehome {
          0% { height: 0%; }
          100% { height: 75%; }
        }
        @keyframes growHeightTax {
          0% { height: 0%; }
          100% { height: 20%; }
        }
        @keyframes growHeightNI {
          0% { height: 0%; }
          100% { height: 5%; }
        }
        .animate-pulse-width {
          animation: pulseWidth 5s ease-in-out infinite;
        }
        .animate-grow-takehome {
          animation: growHeightTakehome 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-grow-tax {
          animation: growHeightTax 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-grow-ni {
          animation: growHeightNI 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* 1. HERO - UK LIFE DECISION ENGINE */}
      <HeroSection />

      {/* 2. TRUST & STATS BAR */}
      <TrustBarSection />

      {/* 3. MOST POPULAR TOOLS */}
      <PopularToolsSection />

      {/* 4. UK LIFE AREAS (COMPACT GRID Matrix) */}
      <BentoGridSection />

      {/* 5. TRENDING UK CHANGES */}
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
    { label: 'Calculate my take-home pay', href: '/take-home-pay', icon: Wallet },
    { label: 'Check mortgage affordability', href: '/mortgage-affordability', icon: HomeIcon },
    { label: 'Calculate stamp duty', href: '/stamp-duty-calculator', icon: Percent },
    { label: 'Check ULEZ charges', href: '/ulez-check', icon: Car },
    { label: 'Estimate redundancy pay', href: '/redundancy-pay', icon: LandmarkIcon },
    { label: 'Check visa eligibility', href: '/visa-types', icon: Plane },
    { label: 'Calculate childcare costs', href: '/childcare-calculator', icon: Baby },
  ];

  return (
    <section className="relative overflow-hidden bg-surface pt-10 pb-8 sm:pt-14 sm:pb-10 lg:pt-16 lg:pb-12 border-b border-border">
      {/* Visual background accents */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-soft to-secondary-soft opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      <div className="container-page px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold tracking-[0.05em] uppercase text-secondary">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Verified for Tax Year 2026/27
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-4">
              What do you need <br />
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">help with today?</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 max-w-xl mb-6 leading-relaxed">
              UKDesk is a secure, independent repository of tools, tax calculators, and visa requirements. No account registration, no paywalls, no marketing.
            </p>

            {/* Search Command Center */}
            <form action="/tools" method="get" className="group relative w-full max-w-xl mb-6">
              <div aria-hidden className="absolute inset-0 rounded-xl bg-primary/5 blur-xl transition-all duration-300 group-focus-within:bg-primary/10" />
              <div className="relative flex items-center rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 shadow-sm transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:scale-[1.01] focus-within:shadow-[0_0_20px_rgba(0,55,176,0.12)]">
                <Search className="mr-2 h-4 w-4 flex-none text-primary" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search 50+ tools, guides, and updates..."
                  className="flex-1 border-none bg-transparent text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-0 py-0.5"
                />
                <kbd className="ml-2 hidden items-center rounded border border-outline-variant/30 bg-surface-container-low px-1.5 py-0.5 text-[10px] font-mono text-outline md:inline-flex">
                  ⌘K
                </kbd>
              </div>
            </form>

            {/* Quick Triggers */}
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline">Quick tools:</span>
              <div className="flex flex-wrap gap-1.5 max-w-xl">
                {TRIGGERS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5 text-[11px] font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5 shadow-sm active:scale-95"
                    >
                      <Icon className="h-3 w-3" />
                      {t.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Premium CSS Dashboard Animation (Instead of image) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative p-6 rounded-2xl border border-white/20 bg-white shadow-2xl backdrop-blur-md overflow-hidden select-none hover:shadow-primary/10 transition-all duration-300 scale-102">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live PAYE Calculator</span>
              </div>

              {/* Body */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Gross Annual Income</span>
                    <span className="text-primary font-extrabold">£50,000</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="h-full bg-primary rounded-full animate-pulse-width" style={{ width: '70%' }} />
                  </div>
                </div>

                {/* Net Pay Payout */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center relative overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Net Monthly Take-Home</span>
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight block transition-all duration-500 hover:scale-105">
                    £3,254.50
                  </span>
                  <span className="text-[10px] text-secondary font-semibold mt-1 inline-block">✓ HMRC 2026/27 Tax Code Applied</span>
                </div>

                {/* Graphical charts */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Salary Breakdown</span>
                  <div className="flex items-end gap-3 h-20 pt-2 px-4 justify-center">
                    {/* Bar 1: Take-home */}
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t animate-grow-takehome h-[75%]" />
                      <span className="text-[9px] font-bold text-slate-500">Take-home</span>
                    </div>
                    {/* Bar 2: Income Tax */}
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-gradient-to-t from-rose-500 to-rose-600 rounded-t animate-grow-tax h-[20%]" />
                      <span className="text-[9px] font-bold text-slate-500">Tax</span>
                    </div>
                    {/* Bar 3: National Insurance */}
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-gradient-to-t from-amber-500 to-amber-600 rounded-t animate-grow-ni h-[5%]" />
                      <span className="text-[9px] font-bold text-slate-500">NI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 2. Trust Bar
function TrustBarSection() {
  const STATS = [
    { label: 'Live tools & calculators', value: '50+', icon: ShieldCheck, sub: 'Updated for 2026 rules' },
    { label: 'Sourced from government data', value: '100%', icon: CheckCircle2, sub: 'HMRC, ONS, and gov.uk' },
    { label: 'Frequency check guarantee', value: 'Weekly', icon: Clock, sub: 'Regular accuracy audits' },
  ];

  return (
    <section className="bg-surface-container-low border-b border-border py-4">
      <div className="container-page px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:divide-x md:divide-border/60">
          {STATS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-start gap-3 px-2 md:first:pl-0 md:last:pr-0">
                <span className="flex-none p-1.5 bg-primary-soft rounded-lg text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-on-surface tracking-tight leading-none">{s.value}</span>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{s.label}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{s.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 3. Most Popular Tools
function PopularToolsSection() {
  return (
    <section className="bg-surface py-8 sm:py-10 border-b border-border">
      <div className="container-page px-4 mx-auto max-w-7xl">
        <div className="mb-6 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-1">Most Popular</p>
          <h2 className="font-display text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            Top-visited UK Calculators
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed">
            Get instant calculations based on verified government rate tables and rules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_TOOLS.map((pt) => {
            const Icon = pt.icon;
            return (
              <Link
                key={pt.href}
                href={pt.href}
                className="group flex flex-col rounded-xl border border-border bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_25px_rgba(0,55,176,0.1)]"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${pt.accent}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-secondary-soft px-1.5 py-0.5 text-xs font-bold text-secondary">
                    {pt.badge}
                  </span>
                </div>

                <h3 className="font-display text-base font-extrabold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                  {pt.label}
                </h3>
                <p className="text-[13px] text-slate-700 leading-relaxed mb-4 line-clamp-2">
                  {pt.description}
                </p>

                <div className="mt-auto border-t border-border/40 pt-2.5 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{pt.updated}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 4. Bento Grid (13 Categories + 3 Resources = 16 Uniform Cards)
function BentoGridSection() {
  const activeCategoryIds: CategoryId[] = [
    'tax', 'property', 'immigration', 'employment', 'savings', 'vehicles', 'benefits'
  ];

  return (
    <section className="bg-surface-container-low py-8 sm:py-10 border-b border-border">
      <div className="container-page px-4 mx-auto max-w-7xl">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-1">Detailed Directory</p>
          <h2 className="font-display text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            UK Life Areas & Tools
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed">
            All tools grouped cleanly inside uniform, compact cards. Every live path mapped with zero blank spaces.
          </p>
        </div>

        {/* 16-Card Uniform Grid (4x4 Matrix) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Active Categories */}
          {activeCategoryIds.map((id) => {
            const cat = CATEGORIES.find((c) => c.id === id)!;
            const Icon = cat.icon;
            const categoryTools = APP_TILES.filter((t) => t.category === id);
            const count = categoryTools.length;
            
            // Slice to list exactly 4 top tools to keep UI clean and prevent cognitive overload
            const topTools = categoryTools.slice(0, 4);

            return (
              <article
                key={id}
                className="col-span-1 flex flex-col rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:border-primary/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_25px_rgba(0,55,176,0.12)] h-[290px]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-primary-soft text-primary rounded-lg">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="font-display text-base font-extrabold text-slate-900 leading-tight">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs font-bold text-slate-700">
                    {count} {count === 1 ? 'tool' : 'tools'}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed mb-3 line-clamp-2">
                  {cat.description}
                </p>

                {/* Clean, readable list of exactly 4 top tools */}
                <ul className="space-y-1.5 flex-1 mt-1">
                  {topTools.map((t) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5"
                      >
                        <span className="truncate mr-2">{t.label}</span>
                        <span className="text-primary/45 group-hover:translate-x-1 group-hover:text-primary transition-all duration-200">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Navigate to category hub */}
                <div className="mt-4 pt-2 border-t border-border/60">
                  <Link
                    href={`/category/${id}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-secondary hover:text-secondary-strong group"
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
                className="col-span-1 flex flex-col rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:border-amber-500/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] h-[290px]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="font-display text-base font-extrabold text-slate-900 leading-tight">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-700 uppercase tracking-wide">
                    {data.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed mb-3 line-clamp-2">
                  {cat.description}
                </p>

                {/* Upcoming tools placeholder list */}
                <ul className="space-y-1.5 flex-1 mt-1">
                  {data.tools.slice(0, 4).map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600 py-0.5">
                      <span className="h-1 w-1 rounded-full bg-outline/35" />
                      <span className="truncate">{t}</span>
                    </li>
                  ))}
                </ul>

                {/* Bottom marker */}
                <div className="mt-4 pt-2.5 border-t border-border/20 text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                  Pipeline updates incoming
                </div>
              </article>
            );
          })}

          {/* Card 14: Resources & Guides */}
          <article className="col-span-1 flex flex-col rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:border-primary/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_25px_rgba(0,55,176,0.12)] h-[290px]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-primary-soft text-primary rounded-lg">
                  <BookOpen className="h-4.5 w-4.5" />
                </span>
                <h3 className="font-display text-base font-extrabold text-slate-900 leading-tight">
                  Updates & Guides
                </h3>
              </div>
              <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs font-bold text-slate-700">
                Links
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed mb-3 line-clamp-2">
              Browse policy shifts, tax rate tables, and analytical explanations.
            </p>
            <ul className="space-y-1.5 flex-1 mt-1">
              <li>
                <Link href="/news" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Policy News Feed</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Guides Hub Directory</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Data Sourcing Info</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Editorial Contacts</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2 border-t border-border/60">
              <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-extrabold text-secondary hover:text-secondary-strong group">
                <span>Open Resource Hub</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>

          {/* Card 15: Developer & API Services */}
          <article className="col-span-1 flex flex-col rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:border-primary/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_25px_rgba(0,55,176,0.12)] h-[290px]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-primary-soft text-primary rounded-lg">
                  <ExternalLink className="h-4.5 w-4.5" />
                </span>
                <h3 className="font-display text-base font-extrabold text-slate-900 leading-tight">
                  APIs & Developers
                </h3>
              </div>
              <span className="rounded bg-primary-soft px-1.5 py-0.5 text-xs font-bold text-primary uppercase tracking-wide">
                API
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed mb-3 line-clamp-2">
              Integrate live UK tax tables and ULEZ compliance lookup tools.
            </p>
            <ul className="space-y-1.5 flex-1 mt-1">
              <li>
                <Link href="/about#api" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>API Documentation</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
              <li>
                <a href="https://github.com/rselladurai22-star/UKVisaInfo" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary/45 group-hover:translate-x-1 transition-all" />
                </a>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Request API Access</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>API Status Indicators</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2 border-t border-border/60">
              <Link href="/about#api" className="inline-flex items-center gap-1 text-xs font-extrabold text-secondary hover:text-secondary-strong group">
                <span>View API Services</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>

          {/* Card 16: Integrity & Verification Standard */}
          <article className="col-span-1 flex flex-col rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:border-primary/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_0_25px_rgba(0,55,176,0.12)] h-[290px]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-primary-soft text-primary rounded-lg">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </span>
                <h3 className="font-display text-base font-extrabold text-slate-900 leading-tight">
                  Data Verification
                </h3>
              </div>
              <span className="rounded bg-secondary-soft px-1.5 py-0.5 text-xs font-bold text-secondary uppercase tracking-wide">
                Trust
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed mb-3 line-clamp-2">
              All calculations verified directly against official UK guidelines.
            </p>
            <ul className="space-y-1.5 flex-1 mt-1">
              <li>
                <Link href="/editorial-policy" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Editorial Guidelines</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/sources" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Data Sourcing Guide</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Privacy Policy Links</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group flex items-center justify-between text-[13px] font-bold text-primary hover:text-primary-strong transition-colors py-0.5">
                  <span>Submit Correction Request</span>
                  <span className="text-primary/45 group-hover:translate-x-1 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2 border-t border-border/60">
              <Link href="/sources" className="inline-flex items-center gap-1 text-xs font-extrabold text-secondary hover:text-secondary-strong group">
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
    <section className="bg-surface py-8 sm:py-10 border-b border-border">
      <div className="container-page px-4 mx-auto max-w-7xl">
        <div className="mb-6 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-1">Recent & Live</p>
          <h2 className="font-display text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            Trending Policy & Rate Changes
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed">
            Major legislative updates and timeline alterations affecting UK finances and immigration status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {TRENDING_CHANGES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col rounded-xl bg-white p-4 border border-border shadow-sm hover:shadow-lg transition-all duration-300 ${item.accentColor}`}
            >
              <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-outline">
                <span>{item.category}</span>
                <span className="text-primary group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
              <h3 className="font-display text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-[13px] text-slate-700 leading-relaxed">
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
    <section className="bg-surface-container-low py-8 sm:py-10 border-b border-border">
      <div className="container-page px-4 mx-auto max-w-7xl">
        <div className="mb-8 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-1">Knowledge Library</p>
          <h2 className="font-display text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            Learn — Goal-Oriented Resources
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed">
            Solve specific problems using our three-in-one resource bundles, complete with calculators, analytical guides, and official source links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARN_GROUPS.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="flex flex-col bg-white border border-border rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="p-1.5 bg-primary-soft text-primary rounded-md">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="font-display text-base font-extrabold text-slate-900">
                    {g.title}
                  </h3>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed mb-4">
                  {g.description}
                </p>

                <div className="mt-auto space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-blue-50 px-1.5 py-0.5 text-xs font-bold text-blue-700 uppercase tracking-wider w-20 text-center">
                      Calculator
                    </span>
                    <Link
                      href={g.calculator.href}
                      className="text-xs sm:text-[13px] text-primary font-bold hover:underline"
                    >
                      {g.calculator.label}
                    </Link>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-purple-50 px-1.5 py-0.5 text-xs font-bold text-purple-700 uppercase tracking-wider w-20 text-center">
                      Guide
                    </span>
                    <Link
                      href={g.guide.href}
                      className="text-xs sm:text-[13px] text-primary font-bold hover:underline"
                    >
                      {g.guide.label}
                    </Link>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-700 uppercase tracking-wider w-20 text-center">
                      Official
                    </span>
                    <a
                      href={g.official.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[13px] text-slate-800 font-bold hover:text-primary flex items-center gap-1 group"
                    >
                      <span className="truncate">{g.official.label}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-slate-500 group-hover:text-primary" />
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
      desc: 'Clarified policies regarding absence allowances for 10-year residency paths. Continuous residence counts now enforce strict 180-day individual calendar caps.',
      href: '/news/care-worker-route-closed', // Linked to recent immigration updates
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
    <section className="bg-surface py-8 sm:py-10 border-b border-border">
      <div className="container-page px-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section description */}
          <div className="lg:col-span-1 max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary mb-1">Real-time Stream</p>
            <h2 className="font-display text-2xl font-extrabold text-on-surface tracking-tight mb-3">
              Official UK Updates Timeline
            </h2>
            <p className="text-sm text-slate-800 leading-relaxed mb-4">
              Track policy changes, standard rate updates, and regulatory adjustments as they are verified from administrative logs.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-outline">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live monitoring active
            </span>
          </div>

          {/* Timeline list */}
          <div className="lg:col-span-2 relative pl-6 border-l-2 border-border/80 space-y-6">
            {EVENTS.map((ev, idx) => (
              <div key={idx} className="relative group text-left">
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-surface bg-primary transition-all duration-300 group-hover:scale-125 group-hover:bg-primary-container" />

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 mb-1">
                  <span className="text-xs font-bold text-primary tracking-wide">{ev.time} ({ev.date})</span>
                </div>
                <h3 className="font-display text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors mb-1">
                  {ev.title}
                </h3>
                <p className="text-[13px] text-slate-700 leading-relaxed mb-2">
                  {ev.desc}
                </p>
                <Link
                  href={ev.href}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline"
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
    <section className="bg-inverse-surface text-inverse-on-surface py-10">
      <div className="container-page px-4 mx-auto max-w-7xl text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">
            Find your next answer in seconds.
          </h2>
          <p className="text-sm text-inverse-on-surface/80 max-w-xl mx-auto mb-6 leading-relaxed">
            Compare visa options, model stamp duty fees, or calculate your exact take-home pay. Pure tools, zero noise.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-xs font-semibold text-inverse-surface shadow hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Open the Tool Index
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
