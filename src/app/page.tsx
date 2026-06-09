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
    badgeType: 'hmrc',
    description: 'Calculate net salary after income tax, National Insurance, student loans, and pensions.',
    updated: 'Tax year 2026/27',
    icon: Wallet,
    accent: 'text-primary bg-primary/10',
  },
  {
    href: '/mortgage-affordability',
    label: 'Mortgage Affordability',
    badge: 'Bank of England verified',
    badgeType: 'boe',
    description: 'Estimate maximum mortgage borrowing limits based on income multiples and interest stress tests.',
    updated: 'Updated June 2026',
    icon: HomeIcon,
    accent: 'text-amber-700 bg-amber-50',
  },
  {
    href: '/stamp-duty-calculator',
    label: 'Stamp Duty (SDLT)',
    badge: 'HMRC verified',
    badgeType: 'hmrc',
    description: 'Calculate stamp duty land tax for main homes, first-time buyers, and buy-to-let properties.',
    updated: 'Tax year 2026/27',
    icon: Percent,
    accent: 'text-blue-700 bg-blue-50',
  },
  {
    href: '/council-tax-band',
    label: 'Council Tax Bands',
    badge: 'VOA verified',
    badgeType: 'voa',
    description: 'Look up council tax bands and see estimated annual bills for any postcode in England.',
    updated: 'Tax year 2026/27',
    icon: Building2,
    accent: 'text-emerald-700 bg-emerald-50',
  },
  {
    href: '/redundancy-pay',
    label: 'Redundancy Pay',
    badge: 'gov.uk verified',
    badgeType: 'gov',
    description: 'Find your statutory redundancy entitlement based on age, service, and weekly wages.',
    updated: 'Updated 2026',
    icon: LandmarkIcon,
    accent: 'text-rose-700 bg-rose-50',
  },
  {
    href: '/holiday-pay',
    label: 'Holiday Entitlement',
    badge: 'gov.uk verified',
    badgeType: 'gov',
    description: 'Calculate statutory holiday days and pay for full-time, part-time, and irregular shift workers.',
    updated: 'Updated 2026',
    icon: Briefcase,
    accent: 'text-indigo-700 bg-indigo-50',
  },
  {
    href: '/state-pension',
    label: 'State Pension',
    badge: 'DWP verified',
    badgeType: 'dwp',
    description: 'Estimate your state pension age and forecast payouts based on qualifying NI contribution years.',
    updated: 'Triple Lock 2026/27',
    icon: PiggyBank,
    accent: 'text-violet-700 bg-violet-50',
  },
  {
    href: '/ulez-check',
    label: 'ULEZ compliance',
    badge: 'TfL verified',
    badgeType: 'tfl',
    description: 'Verify if your petrol or diesel car meets emissions standards for clean air zones.',
    updated: 'Updated 2026',
    icon: Car,
    accent: 'text-cyan-700 bg-cyan-50',
  },
];

// 2. Future Categories (upcoming tools mapped to category IDs)
const FUTURE_CATEGORIES: Record<string, { badge: string; tools: string[]; icon: any }> = {
  business: {
    badge: 'Launching Soon',
    icon: Building2,
    tools: ['Corp Tax Calc', 'PAYE Payroll', 'Invoice Tax', 'VAT Reg Guide'],
  },
  insurance: {
    badge: 'Launching Soon',
    icon: Shield,
    tools: ['Life Cover', 'Health Cover', 'Rebuild Costs', 'Car Insurance'],
  },
  loans: {
    badge: 'Launching Soon',
    icon: LandmarkIcon,
    tools: ['APR Compare', 'Debt Consolidation', 'Credit Strategy', 'Loan Calculator'],
  },
  estate: {
    badge: 'Launching Soon',
    icon: FileText,
    tools: ['Probate Fees', 'Will Writing', 'Power of Attorney', 'Estate Planner'],
  },
  'family-law': {
    badge: 'Launching Soon',
    icon: Users,
    tools: ['Divorce Costs', 'CMS Support', 'Asset Split', 'Pre-nup Costs'],
  },
  energy: {
    badge: 'Launching Soon',
    icon: Zap,
    tools: ['Solar ROI', 'Heat Pump ROI', 'Ofgem Cap Calc', 'Smart Meter ROI'],
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

            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mb-6 leading-relaxed">
              UKDesk is a secure, independent repository of tools, tax calculators, and visa requirements. No account registration, no paywalls, no marketing.
            </p>

            {/* Search Command Center */}
            <form action="/tools" method="get" className="group relative w-full max-w-xl mb-6">
              <div aria-hidden className="absolute inset-0 rounded-xl bg-primary/5 blur-xl transition-all duration-300 group-focus-within:bg-primary/10" />
              <div className="relative flex items-center rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-4 py-3 shadow-sm transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
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
                      className="flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5 text-[11px] font-semibold text-primary transition-all duration-150 hover:bg-primary hover:text-white hover:border-primary shadow-sm"
                    >
                      <Icon className="h-3 w-3" />
                      {t.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Premium Visual Mockup */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative p-2 rounded-2xl border border-border/80 bg-surface-container/20 shadow-md">
              <img
                src="/dashboard_mockup.png"
                alt="UKDesk Dashboard Mockup"
                className="rounded-xl shadow-lg border border-border/60 max-w-full h-auto object-cover select-none pointer-events-none hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 ease-out"
              />
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
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-on-surface tracking-tight leading-none">{s.value}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{s.label}</span>
                  </div>
                  <p className="text-[10px] text-outline mt-0.5 font-medium">{s.sub}</p>
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
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
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
                className="group flex flex-col rounded-xl border border-border bg-surface-container-lowest p-4 shadow-sm transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${pt.accent}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-secondary-soft px-1.5 py-0.5 text-[9px] font-bold text-secondary">
                    {pt.badge}
                  </span>
                </div>

                <h3 className="font-display text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                  {pt.label}
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4 line-clamp-2">
                  {pt.description}
                </p>

                <div className="mt-auto border-t border-border/40 pt-2.5 flex items-center justify-between text-[10px] font-semibold text-outline">
                  <span>{pt.updated}</span>
                  <ArrowRight className="h-3 w-3 text-outline/60 group-hover:translate-x-1 group-hover:text-primary transition-all" />
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
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
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

            return (
              <article
                key={id}
                className="col-span-1 flex flex-col rounded-xl border border-border bg-surface-container-lowest p-5 transition-all duration-300 hover:border-primary hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-primary-soft text-primary rounded-lg">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-bold text-on-surface leading-tight">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[9px] font-bold text-on-surface-variant">
                    {count} {count === 1 ? 'tool' : 'tools'}
                  </span>
                </div>

                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Highly compact 2-column grid containing all live tools */}
                <div className="grid grid-cols-2 gap-1.5 mt-auto">
                  {categoryTools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group"
                    >
                      <span className="truncate mr-1">{t.label}</span>
                      <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
                    </Link>
                  ))}
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
                className="col-span-1 flex flex-col rounded-xl border border-border bg-surface-container-lowest p-5 transition-all duration-300 hover:border-amber-600 hover:shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-bold text-on-surface leading-tight">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 uppercase tracking-wide">
                    Soon
                  </span>
                </div>

                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Structured placeholders matching active category links */}
                <div className="grid grid-cols-2 gap-1.5 mt-auto">
                  {data.tools.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center rounded-lg border border-border/20 bg-surface-container-low/50 px-2 py-1.5 text-[10px] font-medium text-on-surface-variant/75 cursor-default select-none text-center"
                    >
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}

          {/* Card 14: Resources & Guides */}
          <article className="col-span-1 flex flex-col rounded-xl border border-border bg-surface-container-lowest p-5 transition-all duration-300 hover:border-primary hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-primary-soft text-primary rounded-lg">
                  <BookOpen className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-bold text-on-surface leading-tight">
                  Updates & Guides
                </h3>
              </div>
              <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[9px] font-bold text-on-surface-variant">
                Links
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4">
              Browse policy shifts, tax rate tables, and analytical explanations.
            </p>
            <div className="grid grid-cols-2 gap-1.5 mt-auto">
              <Link href="/news" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Policy News</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
              <Link href="/blog" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Guides Hub</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
              <Link href="/about" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Sourcing Hub</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
              <Link href="/contact" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Contact</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
            </div>
          </article>

          {/* Card 15: Developer & API Services */}
          <article className="col-span-1 flex flex-col rounded-xl border border-border bg-surface-container-lowest p-5 transition-all duration-300 hover:border-primary hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-primary-soft text-primary rounded-lg">
                  <ExternalLink className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-bold text-on-surface leading-tight">
                  APIs & Developers
                </h3>
              </div>
              <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[8px] font-bold text-primary uppercase tracking-wide">
                API
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4">
              Integrate live UK tax tables and ULEZ compliance lookup tools.
            </p>
            <div className="grid grid-cols-2 gap-1.5 mt-auto">
              <Link href="/about#api" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">API Docs</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
              <a href="https://github.com/rselladurai22-star/UKVisaInfo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">GitHub Repo</span>
                <ExternalLink className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </a>
              <Link href="/contact" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">API Key</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
              <Link href="/about" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Sys Status</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
            </div>
          </article>

          {/* Card 16: Integrity & Verification Standard */}
          <article className="col-span-1 flex flex-col rounded-xl border border-border bg-surface-container-lowest p-5 transition-all duration-300 hover:border-primary hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-primary-soft text-primary rounded-lg">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-bold text-on-surface leading-tight">
                  Data Verification
                </h3>
              </div>
              <span className="rounded bg-secondary-soft px-1.5 py-0.5 text-[8px] font-bold text-secondary uppercase tracking-wide">
                Trust
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4">
              All calculations verified directly against official UK guidelines.
            </p>
            <div className="grid grid-cols-2 gap-1.5 mt-auto">
              <Link href="/editorial-policy" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Editorial</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
              <Link href="/sources" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Data Sourcing</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
              <Link href="/privacy" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Privacy</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
              </Link>
              <Link href="/contact" className="flex items-center justify-between rounded-lg border border-border bg-surface-container-low px-2 py-1.5 text-[10px] font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary group">
                <span className="truncate mr-1">Corrections</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0 text-primary/60 group-hover:text-white transition-all" />
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
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Major legislative updates and timeline alterations affecting UK finances and immigration status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {TRENDING_CHANGES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col rounded-xl bg-surface-container-lowest p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300 ${item.accentColor}`}
            >
              <div className="flex items-center justify-between mb-2 text-[9px] font-bold uppercase tracking-wider text-outline">
                <span>{item.category}</span>
                <span className="text-primary group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
              <h3 className="font-display text-sm font-bold text-on-surface group-hover:text-primary transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
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
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Solve specific problems using our three-in-one resource bundles, complete with calculators, analytical guides, and official source links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARN_GROUPS.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="flex flex-col bg-surface-container-lowest border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="p-1.5 bg-primary-soft text-primary rounded-md">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-sm font-bold text-on-surface">
                    {g.title}
                  </h3>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4">
                  {g.description}
                </p>

                <div className="mt-auto space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-700 uppercase tracking-wider w-16 text-center">
                      Calculator
                    </span>
                    <Link
                      href={g.calculator.href}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      {g.calculator.label}
                    </Link>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-purple-50 px-1.5 py-0.5 text-[8px] font-bold text-purple-700 uppercase tracking-wider w-16 text-center">
                      Guide
                    </span>
                    <Link
                      href={g.guide.href}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      {g.guide.label}
                    </Link>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-700 uppercase tracking-wider w-16 text-center">
                      Official
                    </span>
                    <a
                      href={g.official.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-on-surface-variant font-medium hover:text-primary flex items-center gap-1 group"
                    >
                      <span className="truncate">{g.official.label}</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0 text-outline/50 group-hover:text-primary" />
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
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
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
                <h3 className="font-display text-sm font-bold text-on-surface group-hover:text-primary transition-colors mb-1">
                  {ev.title}
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-2">
                  {ev.desc}
                </p>
                <Link
                  href={ev.href}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:underline"
                >
                  View full update note
                  <ArrowRight className="h-2.5 w-2.5" />
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
          <p className="text-xs sm:text-sm text-inverse-on-surface/80 max-w-xl mx-auto mb-6 leading-relaxed">
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
