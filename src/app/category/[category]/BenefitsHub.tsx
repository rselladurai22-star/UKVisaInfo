'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  Calculator,
  Coins,
  ShieldCheck,
  RefreshCw,
  Baby,
  Activity,
  Heart,
  CheckCircle2,
} from 'lucide-react';

export default function BenefitsHub() {
  const [income, setIncome] = useState<number>(1200);
  const [dependents, setDependents] = useState<number>(0);

  // Estimation: Universal Credit Standard Allowance (£393.45) + Child Element (£287.92 per child) - 55% Taper Rate
  const childElement = dependents * 287.92;
  const standardAllowance = 393.45;
  const totalNeeds = standardAllowance + childElement;
  const incomeDeduction = income * 0.55;
  const estimatedSupport = Math.max(0, totalNeeds - incomeDeduction);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Benefits</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
          Benefits & Support Hub
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Access specialized calculation modules for UK welfare benefits, childcare allowances, and means-tested support.
        </p>
      </section>

      {/* Hero Section: Universal Credit Estimator */}
      <section className="container-page pb-12">
        <div className="relative rounded-2xl overflow-hidden bg-primary-container p-8 lg:p-12 min-h-[400px] flex flex-col lg:flex-row items-center gap-8 border border-outline-variant/60 shadow-soft">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 lg:w-1/2 text-on-primary-container">
            <span className="bg-[#0037b0]/10 text-[#0037b0] px-3 py-1 rounded-full font-bold text-[10px] tracking-wider mb-4 inline-block uppercase border border-[#0037b0]/25">
              FEATURED TOOL
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Universal Credit Estimator
            </h2>
            <p className="text-base text-on-primary-container/80 mb-8 max-w-lg leading-relaxed">
              Get an instant, reliable estimate of your potential monthly entitlement based on the latest 2026 DWP regulations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/childcare-calculator"
                className="px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-surface-bright transition-all active:scale-[0.98]"
              >
                Run Detailed Check
              </Link>
            </div>
          </div>

          <div className="relative z-10 lg:w-1/2 w-full">
            <div className="bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-xl border border-white/30 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-outline-variant/40 pb-4">
                <span className="font-headline-md text-xl font-bold text-primary">Quick Estimate</span>
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
                    Monthly Earned Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">£</span>
                    <input
                      className="w-full pl-7 pr-4 py-2.5 bg-surface border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary text-sm font-semibold outline-none"
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
                    Number of Dependents
                  </label>
                  <select
                    className="w-full px-3 py-2.5 bg-surface border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary text-sm font-semibold outline-none"
                    value={dependents}
                    onChange={(e) => setDependents(Number(e.target.value))}
                  >
                    <option value={0}>0 children</option>
                    <option value={1}>1 child</option>
                    <option value={2}>2 children</option>
                    <option value={3}>3+ children</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-secondary-container/30 text-on-secondary-container rounded-xl flex items-center justify-between border border-secondary-container/20">
                <span className="text-sm font-medium">Estimated Monthly Support:</span>
                <span className="font-display text-2xl font-bold text-secondary">
                  £{estimatedSupport.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section Header */}
      <section className="container-page pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant pb-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-on-surface">Support Directory</h3>
            <p className="text-sm text-on-surface-variant mt-1">Specialized calculation modules for complex financial planning.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> DWP Sourced
            </span>
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-secondary" /> Means Tested
            </span>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="container-page pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Childcare Calculator */}
          <div className="group bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-soft hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 duration-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <Baby className="h-6 w-6" />
              </div>
              <h4 className="font-display text-xl font-bold text-on-surface mb-2">Childcare Calculator</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Determine eligibility for Tax-Free Childcare, the 15/30 free hours childcare scheme for working parents, and Universal Credit childcare elements.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 mt-auto">
              <div className="flex gap-2">
                <span className="bg-surface-container text-on-surface-variant text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Free Hours
                </span>
                <span className="bg-surface-container text-on-surface-variant text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  2026/27 Policy
                </span>
              </div>
              <Link href="/childcare-calculator" className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                Launch Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Universal Credit detailed calculator */}
          <div className="group bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-soft hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 duration-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Coins className="h-6 w-6" />
              </div>
              <h4 className="font-display text-xl font-bold text-on-surface mb-2">Universal Credit Calculator</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Comprehensive assessment including housing cost contributions, limited capability for work elements, carer components, and transitional protection.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 mt-auto">
              <div className="flex gap-2">
                <span className="bg-surface-container text-on-surface-variant text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Detailed
                </span>
                <span className="bg-surface-container text-on-surface-variant text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Multi-Factor
                </span>
              </div>
              <Link href="/childcare-calculator" className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                Launch Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Accuracy Commitment Section */}
      <section className="container-page pb-20">
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/3 w-full h-48 relative rounded-xl overflow-hidden shadow-soft">
              <img
                alt="Precision Calculation"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiXN9Dhm-diWKXyU-64Gh96fzLOM1sPPoRuZT6SkN13wTWLEyB2yVwD8S8pMJerMchc6HRyyWOpVYxhbf1d6BISaGa3V2zUsluGvpbmVULQOY079gkWCRjNbr4GP6bzweF-hrhl054bmea-LEDg4PTq3fATmoFhYdzFVyV-OcKkyI614C2xn8HZCAt1OOBKQ79K1sP-h7hTQqtk_4B3IFOp6NWAWy8CE8nQih3_8fKG25kibD60R6-E8OyCRJmkv0F380wEHI7Qa8"
              />
            </div>
            <div className="lg:w-2/3 w-full">
              <h4 className="text-lg font-display font-bold mb-2">Accuracy Commitment</h4>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Our benefits calculations are regularly synchronized with the Department for Work and Pensions (DWP) legislative schedules. Every check matches standard benefit rules and means-testing parameters.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-on-surface">Verified by Welfare Experts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <RefreshCw className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-on-surface">Updated with 2026/27 Policy Rates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
