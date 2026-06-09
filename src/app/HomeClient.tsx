'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Search, Briefcase, Users, BookOpen,
  Wallet, HomeIcon, Shield, LandmarkIcon, Plane,
  PiggyBank, Building2, FileText, Zap, Car, Baby,
  ExternalLink, Percent, ShieldCheck
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../data/tools';
import { HUB_TOOLS } from '../data/hubTools';

/* ────────────────────────────────────────────────
   CURATED CONTENT & CONFIG
   ──────────────────────────────────────────────── */

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

const FAQS = [
  {
    q: 'How often are the calculators and tax figures updated?',
    a: 'All tax calculators, National Insurance thresholds, and visa application fee figures are updated weekly. We audit against official publications from HMRC, the Home Office, ONS, and gov.uk to ensure they reflect the active regulations for the 2025/26 and 2026/27 tax years.',
  },
  {
    q: 'Is UKDesk affiliated with the UK Government?',
    a: 'No. UKDesk is a secure, independent repository of tools and reference resources. We have no affiliation with HMRC, the Home Office, or the UK Government. Our goal is to provide pure, ad-free, noise-free calculators to help you make decisions.',
  },
  {
    q: 'Are my calculations saved or stored anywhere?',
    a: 'Your privacy is our priority. All calculations and inputs happen locally in your web browser. We do not store, track, or share your financial figures, income details, or personal choices. There are no paywalls or account registration steps required.',
  },
  {
    q: 'How can I suggest a new calculator or report a rate error?',
    a: 'We welcome suggestions and corrections! You can submit corrections or reach out to our editorial team directly via our contact page. All submissions are audited weekly by our experts.',
  },
];

/* ────────────────────────────────────────────────
   ANIMATION HELPER COMPONENT (Split staggered text)
   ──────────────────────────────────────────────── */
function SplitText({ text, delayOffset = 12 }: { text: string; delayOffset?: number }) {
  return (
    <span className="relative inline-flex overflow-hidden group/split">
      <span className="flex">
        {text.split('').map((char, idx) => (
          <span
            key={idx}
            className="inline-block transition-transform duration-300 translate-y-0 group-hover/split:-translate-y-full"
            style={{
              transitionDelay: `${idx * delayOffset}ms`,
              transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      <span className="flex absolute inset-0">
        {text.split('').map((char, idx) => (
          <span
            key={idx}
            className="inline-block transition-transform duration-300 translate-y-full group-hover/split:translate-y-0"
            style={{
              transitionDelay: `${idx * delayOffset}ms`,
              transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function HomeClient() {
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

      {/* 6. LEARN RESOURCE PACKS (Growra Style Interactive Switcher) */}
      <LearnSection />

      {/* 7. OFFICIAL UK UPDATES TIMELINE */}
      <TimelineSection />

      {/* 8. FAQ ACCORDION SECTION */}
      <FaqSection />

      {/* 9. CLOSING CTA */}
      <ClosingCtaSection />
    </div>
  );
}

/* ────────────────────────────────────────────────
   SUB-COMPONENTS WITH CLIENT STATES
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
    <section className="bg-white pt-16 pb-12 sm:pt-20 sm:pb-16 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl text-center">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded bg-[#00875A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#00875A]">
          ✓ Tax Year 2026/27 Rates Active
        </span>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B2240] tracking-tight leading-[1.1] mb-6">
          Let&apos;s calculate your next <br className="hidden sm:inline" />
          <span className="text-[#00875A]">UK life decision.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Compare income taxes, evaluate mortgage capacity, check visa requirements, and model childcare costs. 100% free, independent, and verified against official databases.
        </p>

        {/* Search Command Center */}
        <form action="/tools" method="get" className="group relative w-full max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center rounded-full border border-[#d2dcf0] bg-white px-5 py-4 shadow-md transition-all duration-200 focus-within:border-[#00875A] focus-within:ring-2 focus-within:ring-[#00875A]/10">
            <Search className="mr-3 h-5 w-5 flex-none text-[#0B2240]" />
            <input
              type="search"
              name="q"
              placeholder="Search take-home pay, stamp duty, student visa, pensions..."
              className="flex-1 border-none bg-transparent text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 py-0.5"
            />
            <button
              type="submit"
              className="bg-[#00875A] hover:bg-[#00704a] text-white font-bold text-sm px-7 py-2.5 rounded-full transition-all active:scale-95 flex items-center gap-1 ml-2 shadow-sm"
            >
              <SplitText text="Search" />
            </button>
          </div>
        </form>

        {/* Quick Triggers */}
        <div className="flex flex-col items-center gap-3 w-full">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Popular Calculators:</span>
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl">
            {TRIGGERS.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group/btn flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-[#0B2240] hover:text-[#00875A] hover:border-[#00875A] hover:shadow-sm transition-all duration-200 active:scale-95"
                >
                  <Icon className="h-4 w-4 text-slate-400 group-hover/btn:text-[#00875A] transition-colors" />
                  <SplitText text={t.label} />
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
    <section className="bg-slate-50 border-b border-slate-200 py-6">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x md:divide-slate-200">
          {STATS.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center text-center md:items-start md:text-left px-6 first:pl-0 last:pr-0">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#0B2240] tracking-tight">{s.value}</span>
                <span className="text-xs font-extrabold text-[#00875A] uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.sub}</p>
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
    <section className="bg-surface py-16 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="mb-12 text-center max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1.5">UKDesk Essentials</p>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-[#0B2240] tracking-tight mb-3">
            Our Core Calculators
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Find the right tools to evaluate wages, stamp duty liability, visa applications, and personal savings.
          </p>
        </div>

        {/* 2x2 Grid of Core Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CORE_HUBS.map((hub, idx) => {
            const Icon = hub.icon;
            return (
              <div
                key={idx}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#00875A]/60 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-start gap-4.5 mb-5">
                  <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${hub.accent}`}>
                    <Icon className="h-6.5 w-6.5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-[#0B2240]">
                      {hub.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                      {hub.description}
                    </p>
                  </div>
                </div>

                {/* Simplified List of 4 Core Tools with Forest Green arrow indicators */}
                <ul className="space-y-4 flex-1 mt-2">
                  {hub.tools.map((t, tIdx) => (
                    <li key={tIdx} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                      <Link
                        href={t.href}
                        className="group flex flex-col justify-start text-left"
                      >
                        <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-[#0B2240] hover:text-[#00875A] transition-colors leading-tight">
                          <span>{t.label}</span>
                          <span className="text-[#00875A] font-normal group-hover:translate-x-1 transition-all duration-150">→</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-1 leading-normal font-medium">{t.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Category Hub CTA Link */}
                <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-start">
                  <Link
                    href={hub.ctaHref}
                    className="group/cta inline-flex items-center justify-center bg-[#00875A] hover:bg-[#00704a] text-white font-bold text-xs px-6 py-3 rounded transition-all active:scale-95 shadow-sm"
                  >
                    <SplitText text={hub.ctaLabel} />
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
  return (
    <section className="bg-white py-16 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1.5">Interactive Index</p>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-[#0B2240] tracking-tight mb-3">
            All UKLife Directory Areas
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Browse our complete directory categories. Each hub lists up to 4 top tools and links directly to the sector index page.
          </p>
        </div>

        {/* 16-Card Matrix Grid (All col-span-1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Active Categories */}
          {CATEGORIES.map((cat) => {
            const id = cat.id;
            const Icon = cat.icon;
            const groups = HUB_TOOLS[id] || [];
            const allItems = groups.flatMap((g) => g.items);
            const liveCount = allItems.filter((item) => item.status === 'live').length;
            
            // Prioritize live tools first, then soon tools
            const sortedTools = [...allItems].sort((a, b) => {
              if (a.status === 'live' && b.status !== 'live') return -1;
              if (a.status !== 'live' && b.status === 'live') return 1;
              return 0;
            });
            const topTools = sortedTools.slice(0, 4);

            return (
              <article
                key={id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00875A]/60 hover:shadow-lg hover:-translate-y-1 h-[310px]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 text-[#00875A]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B2240] leading-tight">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {liveCount} tools
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {cat.description}
                </p>

                {/* Directory Tool Rows */}
                <ul className="space-y-2.5 flex-1 mt-1">
                  {topTools.map((t) => {
                    if (t.status === 'live') {
                      return (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5"
                          >
                            <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">{t.label}</span>
                            <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all duration-150">→</span>
                          </Link>
                        </li>
                      );
                    } else {
                      return (
                        <li key={t.href || t.label}>
                          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 py-0.5 cursor-not-allowed select-none">
                            <span className="truncate mr-2 font-medium text-slate-400">{t.label}</span>
                            <span className="rounded bg-slate-100/60 border border-slate-200/50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                              Soon
                            </span>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>

                {/* Hub Link */}
                <div className="mt-4 pt-2.5 border-t border-slate-100">
                  <Link
                    href={`/category/${id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00875A] hover:text-[#00704a] group/hub"
                  >
                    <span>View all {allItems.length} tools</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/hub:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}

          {/* Card 14: Resource Hub Links */}
          <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00875A]/60 hover:shadow-lg hover:-translate-y-1 h-[310px]">
            <div className="flex items-start justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 text-[#00875A]">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B2240] leading-tight">
                  Updates & Guides
                </h3>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                Links
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
              Browse policy changes, tax rate tables, and analytical explanations.
            </p>
            <ul className="space-y-2.5 flex-1 mt-1">
              <li>
                <Link href="/news" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Policy News Feed</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Guides Hub Directory</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Data Sourcing Info</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Editorial Contacts</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2.5 border-t border-slate-100">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00875A] hover:text-[#00704a] group/hub">
                <span>Open Resource Hub</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/hub:translate-x-0.5" />
              </Link>
            </div>
          </article>

          {/* Card 15: Developer Services */}
          <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00875A]/60 hover:shadow-lg hover:-translate-y-1 h-[310px]">
            <div className="flex items-start justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 text-[#00875A]">
                  <ExternalLink className="h-5 w-5" />
                </span>
                <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B2240] leading-tight">
                  APIs & Developers
                </h3>
              </div>
              <span className="rounded bg-primary-soft px-2 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wide">
                API
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
              Integrate live UK tax tables and ULEZ compliance lookup tools.
            </p>
            <ul className="space-y-2.5 flex-1 mt-1">
              <li>
                <Link href="/about#api" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">API Documentation</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <a href="https://github.com/rselladurai22-star/UKVisaInfo" target="_blank" rel="noopener noreferrer" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">GitHub Repository</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-300 group-hover/tool:text-[#00875A] transition-all" />
                </a>
              </li>
              <li>
                <Link href="/contact" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Request API Access</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">API Status Indicators</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2.5 border-t border-slate-100">
              <Link href="/about#api" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00875A] hover:text-[#00704a] group/hub">
                <span>View API Services</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/hub:translate-x-0.5" />
              </Link>
            </div>
          </article>

          {/* Card 16: Trust & Integrity Verification */}
          <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00875A]/60 hover:shadow-lg hover:-translate-y-1 h-[310px]">
            <div className="flex items-start justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 text-[#00875A]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B2240] leading-tight">
                  Data Verification
                </h3>
              </div>
              <span className="rounded bg-secondary-soft px-2 py-0.5 text-[9px] font-bold text-secondary uppercase tracking-wide">
                Trust
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
              All calculations verified directly against official UK guidelines.
            </p>
            <ul className="space-y-2.5 flex-1 mt-1">
              <li>
                <Link href="/editorial-policy" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Editorial Guidelines</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/sources" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Data Sourcing Guide</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Privacy Policy Links</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="group/tool flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2240] hover:text-[#00875A] transition-colors py-0.5">
                  <span className="truncate mr-2 font-semibold text-slate-800 group-hover/tool:text-[#00875A] transition-colors">Submit Correction Request</span>
                  <span className="text-slate-300 group-hover/tool:text-[#00875A] group-hover/tool:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-2.5 border-t border-slate-100">
              <Link href="/sources" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00875A] hover:text-[#00704a] group/hub">
                <span>Check Sourcing Rules</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/hub:translate-x-0.5" />
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
    <section className="bg-surface py-16 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1.5">Recent Updates</p>
          <h2 className="font-display text-3xl font-black text-[#0B2240] tracking-tight mb-3">
            Trending Policy & Rate Changes
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            Major legislative updates and timeline alterations affecting UK finances and immigration status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {TRENDING_CHANGES.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex flex-col rounded-xl bg-white p-6 border border-slate-200 shadow-sm hover:border-[#00875A]/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.tagColor}`}>
                  {item.category}
                </span>
                <span className="text-[#00875A] group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <h3 className="font-display text-base font-extrabold text-[#0B2240] group-hover:text-[#00875A] transition-colors mb-2.5 leading-snug">
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

// 6. Learn Groupings (Growra Interactive Tab Switcher Redesign)
function LearnSection() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeGroup = LEARN_GROUPS[activeTabIdx];
  const ActiveIcon = activeGroup.icon;

  return (
    <section className="bg-white py-16 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1.5">Knowledge Library</p>
          <h2 className="font-display text-3xl font-black text-[#0B2240] tracking-tight mb-3">
            Learn — Goal-Oriented Resources
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            Solve specific problems using our three-in-one resource bundles, complete with calculators, analytical guides, and official source links.
          </p>
        </div>

        {/* Growra Horizontal Tab Switcher */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-10 border-b border-slate-200 pb-5 max-w-4xl mx-auto">
          {LEARN_GROUPS.map((g, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTabIdx(idx)}
              className={`relative px-5 py-3 text-xs sm:text-sm font-extrabold rounded-md transition-all duration-200 ${
                activeTabIdx === idx
                  ? 'text-[#00875A] bg-[#00875A]/5'
                  : 'text-slate-500 hover:text-[#0B2240] hover:bg-slate-50'
              }`}
            >
              <span>{g.title}</span>
              {activeTabIdx === idx && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00875A] rounded" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Display Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Left Block - Tab Details */}
          <div className="lg:col-span-7 flex flex-col justify-between border border-slate-200 rounded-xl bg-slate-50 p-8 shadow-sm transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="p-2 bg-[#00875A]/10 text-[#00875A] rounded-lg">
                  <ActiveIcon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-[#0B2240]">
                  {activeGroup.title}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-6">
                {activeGroup.description}
              </p>
              <p className="text-xs text-slate-500 font-medium mb-4 uppercase tracking-wider">
                What you can achieve in this section:
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                  <span className="text-[#00875A] mt-0.5">✓</span>
                  <span>Access dynamic, verified estimation calculators.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                  <span className="text-[#00875A] mt-0.5">✓</span>
                  <span>Read full analysis guides with calculated threshold breakdowns.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                  <span className="text-[#00875A] mt-0.5">✓</span>
                  <span>Cross-check guidelines with primary official government sources.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Block - Tab Actions (Resources Box) */}
          <div className="lg:col-span-5 flex flex-col justify-center border border-slate-200 rounded-xl bg-white p-8 shadow-sm hover:border-[#00875A]/60 hover:shadow-lg transition-all duration-300">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0B2240] mb-5 border-b border-slate-100 pb-2.5">
              Available Resources
            </h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="inline-flex self-start items-center justify-center rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider mb-1.5">
                  Calculator
                </span>
                <Link
                  href={activeGroup.calculator.href}
                  className="group/action text-sm sm:text-base text-[#0B2240] hover:text-[#00875A] font-extrabold flex items-center gap-1 transition-colors leading-tight"
                >
                  <SplitText text={activeGroup.calculator.label} />
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover/action:translate-x-0.5 group-hover/action:text-[#00875A] transition-all" />
                </Link>
              </div>

              <div className="flex flex-col gap-1 pt-3 border-t border-slate-100">
                <span className="inline-flex self-start items-center justify-center rounded bg-purple-50 px-2 py-0.5 text-[9px] font-bold text-purple-700 uppercase tracking-wider mb-1.5">
                  Guide
                </span>
                <Link
                  href={activeGroup.guide.href}
                  className="group/action text-sm sm:text-base text-[#0B2240] hover:text-[#00875A] font-extrabold flex items-center gap-1 transition-colors leading-tight"
                >
                  <SplitText text={activeGroup.guide.label} />
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover/action:translate-x-0.5 group-hover/action:text-[#00875A] transition-all" />
                </Link>
              </div>

              <div className="flex flex-col gap-1 pt-3 border-t border-slate-100">
                <span className="inline-flex self-start items-center justify-center rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official
                </span>
                <a
                  href={activeGroup.official.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/action text-sm sm:text-base text-slate-700 font-extrabold hover:text-[#00875A] flex items-center gap-1 transition-colors leading-tight"
                >
                  <span className="truncate max-w-[200px] sm:max-w-xs">{activeGroup.official.label}</span>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover/action:text-[#00875A] transition-colors shrink-0" />
                </a>
              </div>
            </div>
          </div>
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
    <section className="bg-surface py-16 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section description */}
          <div className="lg:col-span-1 max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1.5">Real-time Stream</p>
            <h2 className="font-display text-3xl font-black text-[#0B2240] tracking-tight mb-3">
              Official UK Updates Log
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-5 font-medium">
              Track policy changes, standard rate updates, and regulatory adjustments as they are verified from administrative logs.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live monitoring active
            </span>
          </div>

          {/* Timeline list */}
          <div className="lg:col-span-2 relative pl-6 border-l-2 border-slate-200 space-y-8">
            {EVENTS.map((ev, idx) => (
              <div key={idx} className="relative group text-left">
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-surface bg-[#00875A] transition-all duration-300 group-hover:scale-125" />

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 mb-1.5">
                  <span className="text-xs font-bold text-[#00875A] tracking-wide">{ev.time} ({ev.date})</span>
                </div>
                <h3 className="font-display text-lg font-extrabold text-[#0B2240] group-hover:text-[#00875A] transition-colors mb-1">
                  {ev.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 font-medium">
                  {ev.desc}
                </p>
                <Link
                  href={ev.href}
                  className="group/timeline inline-flex items-center gap-1 text-xs font-extrabold text-[#00875A] hover:underline"
                >
                  <SplitText text="View full update note" />
                  <ArrowRight className="h-3.5 w-3.5 group-hover/timeline:translate-x-0.5 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 8. FAQ Accordion Section (Webflow Accordion Redesign)
function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 py-16 border-b border-slate-200">
      <div className="container-page px-4 mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#00875A] mb-1.5">Common Queries</p>
          <h2 className="font-display text-3xl font-black text-[#0B2240] tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-lg mx-auto">
            Everything you need to know about our data sourcing rules, updates schedule, and secure local calculator execution.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-extrabold text-sm sm:text-base text-[#0B2240] hover:text-[#00875A] transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`text-slate-400 text-lg transition-transform duration-300 select-none ${
                      isOpen ? 'rotate-45 text-[#00875A]' : 'rotate-0'
                    }`}
                  >
                    ＋
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 mt-2 pt-4 font-medium">
                      {faq.a}
                    </div>
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

// 9. Closing CTA
function ClosingCtaSection() {
  return (
    <section className="bg-[#0B2240] text-white py-16">
      <div className="container-page px-4 mx-auto max-w-6xl text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-4 text-white leading-tight">
            Find your next answer in seconds.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            Compare visa options, model stamp duty fees, or calculate your exact take-home pay. Pure tools, zero noise.
          </p>
          <Link
            href="/tools"
            className="group/cta inline-flex items-center gap-2 rounded bg-[#00875A] hover:bg-[#00704a] text-white px-8 py-4 text-sm font-bold shadow hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <SplitText text="Open the Tool Index" />
            <ArrowRight className="h-4 w-4 text-white/80 group-hover/cta:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
}
