'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  Heart,
  Landmark,
  ShieldAlert,
  ArrowUpRight,
  Info,
  History,
  MessageSquare,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

export default function LoansDebtHub() {
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [term, setTerm] = useState<number>(60);

  // Quick APR Calculation: estimate monthly payment at 4.9% interest
  const monthlyInterestRate = 0.049 / 12;
  const numPayments = term;
  const monthlyPayment =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numPayments)) /
    (Math.pow(1 + monthlyInterestRate, numPayments) - 1);

  const formatNumber = (num: number) => {
    return isNaN(num) || !isFinite(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Loans & Debt</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
          Loans, Debt & Credit Hub
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Precision financial instruments for evaluating lending options, structuring debt repayment, and optimizing your credit portfolio.
        </p>
      </section>

      {/* Hero: Primary Tools */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* APR Comparison Card */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-soft hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-on-surface">Loan APR Comparison</h2>
              <Landmark className="h-8 w-8 text-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Loan Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">£</span>
                    <input
                      className="w-full pl-8 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Term (Months)</label>
                  <div className="flex items-center gap-4">
                    <input
                      className="flex-grow h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                      type="range"
                      min="12"
                      max="120"
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                    />
                    <span className="text-sm font-bold font-mono w-8 text-right">{term}</span>
                  </div>
                </div>
              </div>
              <div className="bg-primary-soft/30 p-6 rounded-xl border-l-4 border-primary flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-primary mb-1">Estimated Monthly Payment</p>
                  <div className="text-3xl font-display font-bold text-primary">£{formatNumber(monthlyPayment)}</div>
                  <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
                    Based on 4.9% APR. You could save <span className="font-bold text-secondary">£1,240</span> over the loan life by consolidating.
                  </p>
                </div>
                <Link href="/student-loan-repayment" className="mt-4 w-full bg-primary hover:bg-primary-container text-white py-2.5 rounded-xl font-semibold text-xs text-center shadow-sm transition-colors">
                  Full Comparison Report
                </Link>
              </div>
            </div>
          </div>

          {/* Consolidation widget */}
          <div className="bg-secondary-soft/50 border border-secondary/20 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-secondary mb-3">Debt Consolidation Path</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Model your journey from multiple high-interest debts into one manageable streamline.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-semibold">
                <span>Progress to Zero</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden border border-outline-variant/30">
                <div className="bg-secondary h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
              <Link href="/tools" className="w-full inline-block text-center border-2 border-secondary text-secondary py-2.5 rounded-xl font-semibold text-xs hover:bg-secondary hover:text-white transition-all">
                Launch Optimizer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Workstations & Sidebar */}
      <section className="container-page pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-10">
            {/* Section 1: Personal Lending */}
            <div>
              <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-soft/35 text-primary flex items-center justify-center border border-primary-soft/50">
                    <Landmark className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-base font-display font-bold">Personal Lending</h3>
                </div>
                <span className="text-[10px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">3 Tools Available</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <WorkstationCard title="Personal Loan" description="Unsecured lending rates and monthly cost projection." tag="Calculated" href="/student-loan-repayment" />
                <WorkstationCard title="Car Finance" description="HP vs PCP comparison and depreciation modelling." tag="Compare" href="/tools" />
                <WorkstationCard title="Student Loans" description="Repayment thresholds and long-term interest accrual." tag="Analysis" href="/student-loan-repayment" />
              </div>
            </div>

            {/* Section 2: Debt Management */}
            <div>
              <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-error-container/20 text-error flex items-center justify-center border border-error/10">
                    <Layers className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-base font-display font-bold">Debt Management</h3>
                </div>
                <span className="text-[10px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">2 Tools Available</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <WorkstationCard title="Debt Payoff Planner" description="Snowball vs Avalanche payoff strategy comparison." tag="High Impact" href="/tools" borderStyle="border-t-4 border-t-error hover:border-error" />
                <WorkstationCard title="Debt Ratio (DTI)" description="Calculate your debt-to-income ratio for mortgage readiness." tag="Calculated" href="/mortgage-affordability" />
              </div>
            </div>

            {/* Section 3: Credit Strategy */}
            <div>
              <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary-soft text-secondary flex items-center justify-center border border-secondary-soft/50">
                    <CreditCard className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-base font-display font-bold">Credit Strategy</h3>
                </div>
                <span className="text-[10px] font-mono font-semibold text-on-surface-variant uppercase tracking-wider">2 Tools Available</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <WorkstationCard title="Balance Transfer" description="Calculate savings from interest card transfer deals." tag="Optimize" href="/tools" />
                <WorkstationCard title="Score Improvement" description="Project credit score changes based on utilization." tag="Excellent" href="/tools" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-primary text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <h3 className="text-base font-display font-bold mb-4">Credit Health</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold font-display">742</span>
                  <span className="text-[10px] font-bold tracking-widest text-primary-soft uppercase">EXCELLENT</span>
                </div>
                <ul className="space-y-2 text-xs font-semibold">
                  <li>
                    <Link href="/tools" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all group">
                      <span>Improve credit score</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all group">
                      <span>Debt help options</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            <div className="p-6 bg-surface-container-low/50 rounded-2xl border border-outline-variant">
              <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-4">RECENT ACTIVITY</h4>
              <div className="space-y-4">
                <ActivityLog title="APR Comp: Personal Loan" time="2 hours ago" />
                <ActivityLog title="Payoff: Credit Card A" time="Yesterday" />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-outline-variant/60 bg-surface-container-lowest shadow-soft">
              <div className="h-32 relative bg-surface-container-low">
                {/* Visual placeholder using pure styling */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingDown className="h-10 w-10 text-primary-soft/40" />
                </div>
              </div>
              <div className="p-4 border-t border-outline-variant/40">
                <p className="text-xs italic text-on-surface-variant leading-relaxed">
                  "Systematic planning is the first step toward financial sovereignty."
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function WorkstationCard({
  title,
  description,
  tag,
  href,
  borderStyle = 'border-t-4 border-t-primary hover:border-primary',
}: {
  title: string;
  description: string;
  tag: string;
  href: string;
  borderStyle?: string;
}) {
  return (
    <div className={`workstation-card rounded-xl p-5 bg-surface-container-lowest border border-outline-variant ${borderStyle} transition-all duration-200 hover:shadow-soft flex flex-col justify-between`}>
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
            {tag}
          </span>
          <Info className="h-4 w-4 text-outline-variant" />
        </div>
        <h4 className="text-sm font-display font-bold text-on-surface mb-1">{title}</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{description}</p>
      </div>
      <Link href={href} className="flex items-center justify-between group text-primary font-bold text-xs pt-3 border-t border-outline-variant/30 mt-4">
        <span>LAUNCH TOOL</span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

function ActivityLog({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex gap-2.5 items-start">
      <History className="h-4 w-4 text-on-surface-variant mt-0.5 shrink-0" />
      <div>
        <p className="text-xs font-semibold text-on-surface">{title}</p>
        <p className="text-[10px] text-on-surface-variant mt-0.5">{time}</p>
      </div>
    </div>
  );
}
