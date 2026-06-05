'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  Gavel,
  Calculator,
  Coins,
  Scale,
  Users,
  Briefcase,
  Layers,
  Heart,
  FileText,
  Clock,
  HeartHandshake,
} from 'lucide-react';

export default function FamilyLawHub() {
  const [assets, setAssets] = useState<number>(450000);
  const [duration, setDuration] = useState<number>(12);
  const [children, setChildren] = useState<number>(2);

  // Estimator logic: base 50% split. +5% per child, +5% if long marriage (>10 years), capped at 70%
  const splitPct = Math.min(70, Math.max(30, 50 + children * 5 + (duration > 10 ? 5 : 0)));
  const spouseValue = assets * (splitPct / 100);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Family Law</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-on-surface">
          Divorce & Family Law Hub
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Navigate legal separations and matrimonial asset distribution with mathematical clarity.
        </p>
      </section>

      {/* Hero Section: Financial Settlement Estimator */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full mb-6 w-fit border border-secondary-container/20">
              <Gavel className="h-4 w-4" />
              <span className="font-bold text-[10px] tracking-wider uppercase">Legal Guidance</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4 text-on-surface leading-tight">
              Matrimonial Asset Calculator
            </h2>
            <p className="text-base text-on-surface-variant max-w-xl mb-8 leading-relaxed">
              Model potential asset splits based on marriage duration, children, and capital asset bases before formal legal proceedings.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant">#FinancialAccuracy</span>
              <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant">#StandardFees</span>
              <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant">#GDPR_Compliant</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/30 border-l-4 border-l-primary flex flex-col gap-6">
              <div className="flex justify-between items-start border-b border-outline-variant/30 pb-4">
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Settlement Estimator</h3>
                <Coins className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
                    Total Marital Assets (£)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">£</span>
                    <input
                      className="w-full pl-7 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary text-sm font-semibold outline-none"
                      type="number"
                      value={assets}
                      onChange={(e) => setAssets(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Marriage (Years)
                    </label>
                    <input
                      className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary text-sm font-semibold outline-none"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Children
                    </label>
                    <input
                      className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary text-sm font-semibold outline-none"
                      type="number"
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-primary-soft/10 text-primary border border-primary-soft/20 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-on-surface-variant">Estimated Split:</span>
                  <span className="text-xs font-bold font-mono text-secondary">{splitPct}% / {100 - splitPct}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-on-surface">Spouse Share:</span>
                  <span className="text-xl font-bold font-mono text-primary">£{spouseValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              <p className="text-center text-[10px] text-on-surface-variant italic opacity-70">
                Calculations are for exploratory guidance only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Tool Grid */}
      <section className="container-page pb-12">
        <h3 className="text-xl sm:text-2xl font-display font-extrabold mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
          <Scale className="h-6 w-6 text-primary" />
          Specialized Estimators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Divorce Cost */}
          <div className="group bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-soft hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 duration-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Calculator className="h-6 w-6" />
              </div>
              <h4 className="font-display text-base font-bold text-on-surface mb-2">Divorce Cost</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Calculate court application fees, legal representation benchmarks, and administrative expenses.
              </p>
            </div>
            <Link href="/family-law" className="text-primary font-bold text-xs flex items-center gap-1 hover:underline mt-auto">
              Launch Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Financial Settlement */}
          <div className="group bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-soft hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 duration-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                <Coins className="h-6 w-6" />
              </div>
              <h4 className="font-display text-base font-bold text-on-surface mb-2">Financial Settlement</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Estimate matrimonial asset distribution, including properties, pensions, and outstanding debts.
              </p>
            </div>
            <Link href="/family-law" className="text-secondary font-bold text-xs flex items-center gap-1 hover:underline mt-auto">
              Launch Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Card 3: Child Maintenance */}
          <div className="group bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-soft hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 duration-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 text-tertiary flex items-center justify-center mb-5">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="font-display text-base font-bold text-on-surface mb-2">Child Maintenance</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Statutory CMS-compliant calculator mapping child support requirements to non-resident parent income.
              </p>
            </div>
            <Link href="/family-law" className="text-tertiary font-bold text-xs flex items-center gap-1 hover:underline mt-auto">
              Launch Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Card 4: Spousal Maintenance */}
          <div className="group bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-soft hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 duration-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center mb-5">
                <Briefcase className="h-6 w-6" />
              </div>
              <h4 className="font-display text-base font-bold text-on-surface mb-2">Spousal Maintenance</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Evaluate spousal support budgets based on marital living standards, income gaps, and career breaks.
              </p>
            </div>
            <Link href="/family-law" className="text-error font-bold text-xs flex items-center gap-1 hover:underline mt-auto">
              Launch Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Info & Guides Section */}
      <section className="container-page pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Directory */}
          <div className="relative overflow-hidden rounded-2xl h-80 group border border-outline-variant/60 shadow-soft">
            <img
              alt="Legal Consultation"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 opacity-90"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmq3icU0DNkVCJanp8dYx8nDvlY9sn3YMJqWqZwf4cDdJSbAKk-P3LFHQ-j5EJ8PBAGMtA0spKzAPc0YzWUyKLE37PmV4HIhfCdJzUY7KrExL5iAlCTyz8WkeqO8cPX2syN-rShBkJo2G0XaLRTIXDcRUGp-8Pr6TwPqMa02FvH4fK4HD-UPBPudPW90CIFBdiC-xIjfnoZq8tr7VFgCb5D1HYj_yBGCoETP24Pb6VATH_ymLHr92mJYyd5fH1RK4G1efJJGtQnd8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-8 flex flex-col justify-end">
              <h4 className="text-white font-display text-2xl font-bold mb-2">Find a Divorce Solicitor</h4>
              <p className="text-white/80 text-xs mb-6 max-w-sm">Search our directory of SRA-regulated family law practices by location and expertise.</p>
              <Link href="/contact" className="bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-xs w-fit hover:bg-primary-soft transition-colors shadow-md">
                Search Directory
              </Link>
            </div>
          </div>

          {/* Card 2: Divorce Process Guide */}
          <div className="bg-surface-container rounded-2xl p-6 flex flex-col border border-outline-variant/30">
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant/40 pb-4">
              <h4 className="text-lg font-display font-bold">Divorce Process Guide</h4>
              <span className="px-2.5 py-0.5 bg-primary text-on-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                2026 Policy
              </span>
            </div>
            <div className="space-y-6 flex-grow">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-sm text-on-surface">Application & Response</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Submit the divorce application under no-fault rules and await the acknowledgment of service.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-sm text-on-surface">Conditional Order</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Wait out the mandatory 20-week reflection period before applying for the Conditional Order.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-sm text-on-surface">Final Order & Financials</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Apply for the Final Order to legally dissolve the marriage and secure financial consent orders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
