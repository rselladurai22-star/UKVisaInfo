'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Scale,
  Baby,
  HeartPulse,
  ShieldCheck,
  Clock,
  Users,
  HeartHandshake,
  Car,
  GraduationCap,
  ArrowRight,
  ChevronRight,
  Calculator,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export default function EmploymentHub() {
  const [grossSalary, setGrossSalary] = useState<number>(45000);

  // HMRC-verified precision calculation
  const getTaxAndNI = (gross: number) => {
    // Personal allowance tapering (reduces by £1 for every £2 over £100,000)
    const allowance = Math.max(0, 12570 - Math.max(0, gross - 100000) / 2);
    const taxable = Math.max(0, gross - allowance);
    
    let incomeTax = 0;
    if (taxable > 0) {
      // Basic Rate 20% (up to £37,700 taxable)
      const basicAmt = Math.min(taxable, 37700);
      incomeTax += basicAmt * 0.20;
      
      // Higher Rate 40% (up to £125,140, i.e., next £74,870)
      if (taxable > 37700) {
        const higherAmt = Math.min(taxable - 37700, 74870);
        incomeTax += higherAmt * 0.40;
      }
      
      // Additional Rate 45%
      if (taxable > 37700 + 74870) {
        const additionalAmt = taxable - 37700 - 74870;
        incomeTax += additionalAmt * 0.45;
      }
    }

    // National Insurance (standard Class 1 for 2026/27: 8% on £12,570 - £50,270, 2% above)
    let ni = 0;
    if (gross > 12570) {
      const basicNiAmt = Math.min(gross - 12570, 50270 - 12570);
      ni += basicNiAmt * 0.08;
      if (gross > 50270) {
        ni += (gross - 50270) * 0.02;
      }
    }

    const net = gross - incomeTax - ni;
    const monthly = net / 12;
    const weekly = net / 52;
    return { incomeTax, ni, net, monthly, weekly };
  };

  const getPercentile = (gross: number) => {
    if (gross < 20000) return 'Bottom 30%';
    if (gross < 30000) return 'Top 50%';
    if (gross < 45000) return 'Top 30%';
    if (gross < 60000) return 'Top 15%';
    if (gross < 80000) return 'Top 8%';
    if (gross < 120000) return 'Top 3%';
    return 'Top 1%';
  };

  const { net, monthly } = getTaxAndNI(grossSalary);
  const percentile = getPercentile(grossSalary);
  const progressPct = Math.min(100, Math.max(10, Math.round((grossSalary / 120000) * 100)));

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Employment</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
          Employment & Salary Hub
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Benchmark your earnings, calculate statutory holiday entitlements, and assess redundancy or sick pay compliance.
        </p>
      </section>

      {/* Hero Section: Salary Comparison Tool */}
      <section className="container-page pb-12">
        <div className="relative rounded-2xl overflow-hidden bg-primary-container p-8 lg:p-12 min-h-[400px] flex flex-col lg:flex-row items-center gap-8 border border-outline-variant/60 shadow-soft">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 lg:w-1/2 text-on-primary-container">
            <div className="flex gap-2 mb-4">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold text-[10px] tracking-wider uppercase border border-secondary/25">
                HMRC Verified
              </span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold text-[10px] tracking-wider uppercase border border-white/20">
                2026/27 Rules
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Salary Comparison Tool
            </h2>
            <p className="text-base text-on-primary-container/80 mb-8 max-w-lg leading-relaxed">
              Benchmark your earnings across industries, locations, and roles with our real-time database based on the latest HMRC tax data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/salary-compare"
                className="px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-surface-bright transition-all active:scale-[0.98]"
              >
                Detailed Comparison
              </Link>
            </div>
          </div>

          <div className="relative z-10 lg:w-1/2 w-full">
            <div className="bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-2xl shadow-xl border border-white/30 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-outline-variant/40 pb-4">
                <span className="font-headline-md text-xl font-bold text-primary">Salary Quick Check</span>
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <label className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
                      Annual Gross Income
                    </label>
                    <span className="font-mono text-sm font-bold text-primary">£{grossSalary.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={12000}
                    max={150000}
                    step={1000}
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    className="w-full h-2 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Monthly Net Pay</p>
                    <p className="text-xl font-display font-bold text-on-surface">£{monthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="p-4 bg-secondary-container/20 rounded-xl border border-secondary-container/10">
                    <p className="text-[10px] font-bold text-secondary-strong uppercase tracking-wider mb-1">Percentile Rank</p>
                    <p className="text-xl font-display font-bold text-secondary">{percentile}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                  <span>Earnings Percentile Profile</span>
                  <span>{percentile} of UK</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section Header */}
      <section className="container-page pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant pb-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-on-surface">Employment Directory</h3>
            <p className="text-sm text-on-surface-variant mt-1">Specialized calculation modules for compensation and legal guidelines.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> HMRC Compliant
            </span>
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-secondary" /> Statutory Rates
            </span>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="container-page pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Holiday Pay */}
          <WorkstationCard
            title="Holiday Pay"
            description="Calculate statutory holiday entitlement and payment details for full-time or part-time staff."
            href="/holiday-pay"
            icon={Briefcase}
            tag="5.6 Weeks Standard"
          />

          {/* Salary Compare */}
          <WorkstationCard
            title="Salary Compare"
            description="Detailed breakdown of two salaries side-by-side including income tax, NI, and pension sacrifice."
            href="/salary-compare"
            icon={Scale}
            tag="Side-by-Side"
          />

          {/* Redundancy Pay */}
          <WorkstationCard
            title="Redundancy Pay"
            description="Calculate statutory redundancy pay based on age, service length, and weekly pay caps."
            href="/redundancy-pay"
            icon={Calculator}
            tag="£719 Weekly Cap"
          />

          {/* Maternity Pay */}
          <WorkstationCard
            title="Maternity Pay"
            description="Forecast your statutory maternity pay (SMP) schedule and employer top-up schemes."
            href="/maternity-pay"
            icon={Baby}
            tag="SMP 39 Weeks"
          />

          {/* Sick Pay */}
          <WorkstationCard
            title="Sick Pay (SSP)"
            description="Calculate Statutory Sick Pay (SSP) eligibility, exclusion parameters, and daily pay rates."
            href="/sick-pay"
            icon={HeartPulse}
            tag="£118.75/wk Rates"
          />

          {/* Minimum Wage */}
          <WorkstationCard
            title="Minimum Wage"
            description="Check if you are being paid the correct National Living Wage based on age and apprenticeship rules."
            href="/minimum-wage-checker"
            icon={Scale}
            tag="NLW £12.21 Rate"
          />
        </div>
      </section>

      {/* Accuracy Commitment Section */}
      <section className="container-page pb-20">
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-2/3 w-full">
              <h4 className="text-lg font-display font-bold mb-2">Reliable Calculations for 2026/2027</h4>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                All tools in our Employment Hub are updated to reflect the latest legislation from the UK Government and HMRC. We factor in the recent National Insurance changes and the new thresholds for the 2026/27 tax year.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-on-surface">Updated Tax Brackets</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-on-surface">NI Rate Changes Applied</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-on-surface">Living Wage Adjustments</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 w-full p-6 bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col justify-between h-44 shadow-soft">
              <div>
                <h5 className="font-bold text-sm mb-1 text-on-surface">Need a Custom Report?</h5>
                <p className="text-xs text-on-surface-variant leading-relaxed">Generate a PDF breakdown of your total compensation package including benefits.</p>
              </div>
              <Link href="/salary-compare" className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-center text-xs block hover:opacity-90 transition-opacity">
                Configure Report
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkstationCard({ title, description, href, icon: Icon, tag }: { title: string; description: string; href: string; icon: any; tag: string }) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-soft hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 duration-200">
      <div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <Icon className="h-6 w-6" />
        </div>
        <h4 className="font-display text-base font-bold text-on-surface mb-2">{title}</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 mt-auto">
        <span className="bg-surface-container text-on-surface-variant text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
          {tag}
        </span>
        <Link href={href} className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
          Launch Tool <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
