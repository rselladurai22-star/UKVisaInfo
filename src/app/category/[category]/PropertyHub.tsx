'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  Calculator,
  Home,
  FileText,
  TrendingUp,
  RefreshCw,
  Scale,
  Award,
  Layers,
  HeartPulse,
} from 'lucide-react';

export default function PropertyHub() {
  const [income, setIncome] = useState<string>('75000');
  const [expenses, setExpenses] = useState<string>('1200');
  const [purchasePrice, setPurchasePrice] = useState<string>('');

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Property</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
          Property & Mortgages
        </h1>
      </section>

      {/* Hero Section: Featured Tools */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mortgage Affordability (Large Featured Card) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-soft p-8 relative overflow-hidden border border-outline-variant group hover:translate-y-[-2px] transition-all duration-300">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft/30 flex items-center justify-center text-primary border border-primary-soft">
                    <Home className="h-6 w-6" />
                  </div>
                  <span className="bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    POPULAR
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-on-surface">Mortgage Affordability</h2>
                <p className="text-sm text-on-surface-variant max-w-lg mb-6 leading-relaxed">
                  Calculate how much you can realistically borrow based on your household income, monthly debt, and deposit size.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                    <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Single/Joint Income</p>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface font-semibold text-lg">£</span>
                      <input
                        className="w-full pl-4 bg-transparent border-none p-0 text-lg font-bold focus:ring-0 focus:outline-none"
                        type="text"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                    <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Monthly Expenses</p>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface font-semibold text-lg">£</span>
                      <input
                        className="w-full pl-4 bg-transparent border-none p-0 text-lg font-bold focus:ring-0 focus:outline-none"
                        type="text"
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/mortgage-affordability"
                className="mt-6 inline-flex items-center justify-center bg-primary hover:bg-primary-container text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-md transition-colors self-start"
              >
                Run Full Analysis
              </Link>
            </div>
            {/* Abstract UI Decoration */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary-soft/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Stamp Duty Quick-Check */}
          <div className="lg:col-span-4 bg-primary text-white rounded-2xl p-8 shadow-md flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Calculator className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold border border-white/30 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  2026/27 TAX
                </span>
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Stamp Duty (SDLT)</h2>
              <p className="text-xs text-white/80 leading-relaxed mb-6">
                Instant calculation for residential property purchases in England and Northern Ireland.
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 font-semibold text-sm">£</span>
                <input
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-8 pr-4 text-white placeholder-white/50 focus:bg-white/20 outline-none text-sm font-semibold transition-all"
                  placeholder="Purchase Price"
                  type="text"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
              <Link
                href={`/stamp-duty-calculator?price=${purchasePrice}`}
                className="w-full inline-flex items-center justify-center bg-white text-primary font-bold py-3 rounded-xl text-xs hover:bg-primary-soft transition-colors shadow-sm text-center"
              >
                Calculate Tax
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Specialized Tools */}
      <section className="container-page pb-4">
        <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-4">
          <h3 className="text-xl font-display font-bold">Essential Property Tools</h3>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container px-2.5 py-1 rounded-md">
            6 Tools Available
          </span>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mortgage Repayments */}
          <PropertyToolCard
            title="Mortgage Repayments"
            description="Compare capital & interest vs interest-only plans over various terms."
            badge1="Trending"
            badge2="Guide"
            href="/mortgage-affordability"
            stats={[
              { label: 'Basis', value: 'Repayment' },
              { label: 'Accuracy', value: '99.8%' },
            ]}
          />
          {/* Rent vs Buy Analysis */}
          <PropertyToolCard
            title="Rent vs Buy Analysis"
            description="A 10-year projection comparing the costs and wealth accumulation of both paths."
            badge1="Verification"
            href="/cost-of-living-uk"
            progress={75}
            progressLabel="Complexity: High"
          />
          {/* Council Tax Band Finder */}
          <PropertyToolCard
            title="Council Tax Band Finder"
            description="Check bands for properties across the UK and estimate annual costs."
            badge1="Data Feed"
            href="/council-tax-band"
            subtext="Verified by VOA Protocol"
          />
          {/* Buy-to-Let Yield */}
          <PropertyToolCard
            title="Buy-to-Let Yield"
            description="Calculate gross/net rental yields and ROI for investment properties."
            badge1="Trending"
            href="/rental-yield-calculator"
            focusText="LTV & Cashflow"
          />
          {/* Remortgage Savings */}
          <PropertyToolCard
            title="Remortgage Savings"
            description="Determine if switching lenders will save you money after fees."
            badge1="Guide"
            href="/overpayment-mortgage"
            savingText="£240/mo avg savings"
          />
          {/* Equity Release */}
          <PropertyToolCard
            title="Equity Release"
            description="Estimate how much cash you could unlock from your home's equity value."
            badge1="Verification"
            href="/mortgage-affordability"
            steps={true}
          />
        </div>
      </section>

      {/* Informational Section (Asymmetric) */}
      <section className="container-page pb-20">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 w-full h-[350px] relative rounded-2xl overflow-hidden shadow-md shrink-0 border border-outline-variant/60">
            <img
              className="w-full h-full object-cover"
              alt="Modern residence facade"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEmonUhrt3_kjQFo0nEGj5S29J8KcLhLdo4UXnZnW2oOHy5BssnqatzevF37tMVGbNGw7FNQ8YeXKtsz8Ce_eVGAZfd9TXmx61I9eeaPJI5qged5ilGfNXTJxlIKdxXOUZXf_B2P-yH9EGWgOCX6BoRY_V1YA5Mi_w0w7lXa2nbu02c8qfvHC1qSZjkl8EyHOpWHoJ03G2mK3UoWJYu_fqWr2RGHgA2S_plL6A1xfF2ohFzvABPXbYXCgSS4tSJyT1UOrj6OV1gCg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
          </div>
          <div className="lg:w-1/2 w-full">
            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-3 block">Smart Property Data</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-on-surface leading-tight">
              Calculations powered by live market precision.
            </h2>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              Our calculators aren't just formulas; they're integrated with current UK tax codes, regional council data, and lender trends to provide the most accurate projections for your financial future.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-soft/35 text-primary flex items-center justify-center shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">FCA Compliant</p>
                  <p className="text-xs text-on-surface-variant">Standard calculations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-soft/35 text-primary flex items-center justify-center shrink-0">
                  <RefreshCw className="h-4 w-4 animate-spin-slow" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Daily Updates</p>
                  <p className="text-xs text-on-surface-variant">Reflecting tax changes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ToolCardProps {
  title: string;
  description: string;
  badge1: string;
  badge2?: string;
  href: string;
  stats?: { label: string; value: string }[];
  progress?: number;
  progressLabel?: string;
  subtext?: string;
  focusText?: string;
  savingText?: string;
  steps?: boolean;
}

function PropertyToolCard({
  title,
  description,
  badge1,
  badge2,
  href,
  stats,
  progress,
  progressLabel,
  subtext,
  focusText,
  savingText,
  steps,
}: ToolCardProps) {
  return (
    <div className="workstation-card rounded-2xl p-6 flex flex-col h-full bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-1.5">
          <span className="bg-surface-container text-on-surface-variant text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
            {badge1}
          </span>
          {badge2 && (
            <span className="bg-primary-soft/40 text-primary text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              {badge2}
            </span>
          )}
        </div>
      </div>
      <div className="flex-grow mb-6">
        <h4 className="text-base font-display font-bold mb-2 text-on-surface">{title}</h4>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{description}</p>

        {stats && (
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-primary/20 pl-2">
                <span className="block text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{s.label}</span>
                <span className="text-xs font-semibold text-on-surface">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {progress !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              <span>{progressLabel}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {subtext && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-surface-container border border-surface-container-lowest"></div>
              <div className="w-4 h-4 rounded-full bg-outline-variant border border-surface-container-lowest"></div>
            </div>
            <span className="text-[11px] text-on-surface-variant font-medium">{subtext}</span>
          </div>
        )}

        {focusText && (
          <div className="bg-surface-container-low/80 p-2.5 rounded-lg border border-outline-variant/30 flex justify-between items-center">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Focus</span>
            <span className="text-xs font-bold text-primary">{focusText}</span>
          </div>
        )}

        {savingText && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-secondary">{savingText.split(' ')[0]}</span>
            <span className="text-[11px] text-on-surface-variant">{savingText.slice(savingText.indexOf(' ') + 1)}</span>
          </div>
        )}

        {steps && (
          <div className="flex gap-1.5">
            <div className="w-1/3 h-1 bg-primary rounded-full"></div>
            <div className="w-1/3 h-1 bg-surface-container rounded-full"></div>
            <div className="w-1/3 h-1 bg-surface-container rounded-full"></div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-outline-variant/40 flex justify-between items-center mt-auto">
        <Link href={href} className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
          Launch Tool
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
