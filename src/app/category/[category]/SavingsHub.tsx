'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PiggyBank,
  Landmark,
  Percent,
  Wallet,
  Star,
  Coins,
  RefreshCw,
  Target,
  Scale,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Clock,
  Users,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export default function SavingsHub() {
  const [contribution, setContribution] = useState<number>(500);
  const [years, setYears] = useState<number>(25);
  const [potSize, setPotSize] = useState<number>(342850);

  // Replicate compound interest math
  useEffect(() => {
    const rate = 0.054 / 12; // 5.4% annual rate compounded monthly
    const n = years * 12;
    const futureValue = contribution * ((Math.pow(1 + rate, n) - 1) / rate);
    setPotSize(Math.round(futureValue));
  }, [contribution, years]);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Savings & Pensions</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
          Pensions, Investing & Savings Hub
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Model state pensions, consolidate private accounts, and map stocks and shares ISA growth with tax-advantaged tools.
        </p>
      </section>

      {/* Hero Section: Workstation Layout */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Projection Module */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-outline-variant/60 shadow-soft relative overflow-hidden flex flex-col justify-between border-l-4 border-l-primary">
            {/* Background decoration */}
            <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none">
              <TrendingUp className="h-[400px] w-[400px] text-primary" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="flex items-center gap-1 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold tracking-wider uppercase border border-secondary/20">
                  <ShieldCheck className="h-3 w-3" /> FCA Regulated Rules
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[10px] font-bold tracking-wider uppercase border border-primary/20">
                  HMRC Rates
                </span>
              </div>
              
              <h2 className="text-3xl font-display font-bold text-on-surface leading-tight">
                Pension Pot Projection
              </h2>
              <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
                Visualize your retirement nest egg. Adjust contribution rates and horizons to map growth benchmarks in real time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-surface-container-low/40 rounded-xl p-6 border border-outline-variant/30">
                <div className="space-y-6">
                  {/* Slider 1: Monthly contribution */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      <span>Monthly Contribution</span>
                      <span className="text-primary font-bold">£{contribution.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={5000}
                      step={100}
                      value={contribution}
                      onChange={(e) => setContribution(Number(e.target.value))}
                      className="w-full h-2 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Slider 2: Years until retirement */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      <span>Years Until Retirement</span>
                      <span className="text-primary font-bold">{years} Years</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      step={1}
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full h-2 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/40">
                    <span>Assumed Annual Return Rate:</span>
                    <span className="font-bold text-secondary">5.4%</span>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 text-center flex flex-col justify-center items-center h-full">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Estimated Pot Size</span>
                  <div className="text-4xl font-display font-bold text-primary mb-2">
                    £{potSize.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +£12k tax relief contribution included
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SIPP One-Click Consolidation */}
          <div className="lg:col-span-4 bg-inverse-surface text-inverse-on-surface p-8 rounded-2xl flex flex-col justify-between border border-outline-variant/60 shadow-soft relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <span className="text-[10px] font-bold text-primary-soft uppercase tracking-wider">Retirement Consolidation</span>
              <h3 className="font-display text-2xl font-bold tracking-tight leading-tight">
                SIPP One-Click Transfer
              </h3>
              <p className="text-xs text-inverse-on-surface/80 leading-relaxed">
                Consolidate multiple legacy workplace pensions into a single, low-fee SIPP. Track all balances in one modern portal.
              </p>
              <button className="px-5 py-2.5 bg-primary hover:bg-primary-strong text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md">
                Consolidate Now <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="mt-8 flex items-center gap-3 border-t border-outline-variant/20 pt-4">
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-inverse-surface"
                  alt="Customer advisor"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuc9PDNTEHy_LieZ9gY4SQXwPdR1RPPxS-C-kZZZRsThBnmsgPADmAwgFK4z_z09NvkjA9Lq9fiI0sinJzKPZ6cpIwdBiQXKcd7vQUHGJMkP4EFJyxD0iY99A53VKmnqDVajXQQp_i7beVQlr0hynI50Th0WhNi4SvvBqohoPO2kXGBONwGTymGcUWpYOH_vgLlVgcHeI1kIOWqDXWdo63aOSCaWElIdn3pks7pNcs2FNH1VOD1y2P0_fxDA2_EmF7WlSS6FTlCYk"
                />
                <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold ring-2 ring-inverse-surface text-primary">+4k</div>
              </div>
              <span className="text-[10px] text-inverse-on-surface/80">consolidated SIPP clients</span>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section Header */}
      <section className="container-page pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant pb-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-on-surface">Financial Toolkit</h3>
            <p className="text-sm text-on-surface-variant mt-1">Specialized calculation modules for compound interest, drawdown strategies, and tax-free accounts.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-semibold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> HMRC Compliant
            </span>
          </div>
        </div>
      </section>

      {/* Grid of Toolkit Cards */}
      <section className="container-page pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* State Pension */}
          <WorkstationCard
            title="State Pension"
            description="Forecast your retirement age and expected weekly pension based on National Insurance contributions."
            href="/state-pension"
            icon={Landmark}
            tag="Statutory NI"
          />

          {/* ISA Growth */}
          <WorkstationCard
            title="ISA Growth"
            description="Model compound growth schedules for Stocks & Shares and Cash ISAs with annual limits."
            href="/isa-calculator"
            icon={Wallet}
            tag="£20,000 Allowance"
          />

          {/* Pension Drawdown */}
          <WorkstationCard
            title="Pension Drawdown"
            description="Sustainability projections to evaluate year-by-year income drawdowns and tax impacts."
            href="/pension-drawdown-calculator"
            icon={Coins}
            tag="Drawdown Projections"
          />

          {/* Lifetime ISA */}
          <WorkstationCard
            title="Lifetime ISA"
            description="Calculate government bonuses, growth metrics, and penalties for first home or retirement."
            href="/lifetime-isa-calculator"
            icon={Star}
            tag="25% Bonus Rate"
          />
        </div>
      </section>

      {/* Dynamic Insights & Specialized Audit Booking */}
      <section className="container-page pb-20">
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Insights list */}
            <div className="lg:col-span-8 space-y-6">
              <h4 className="text-lg font-display font-bold">Market Projections & Allowances</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                UKDesk aligns financial tools with the latest pension regulations to ensure your modeling matches regulatory expectations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white border border-outline-variant/60 rounded-xl flex justify-between items-center shadow-soft">
                  <span className="text-xs font-semibold text-on-surface-variant">Average SIPP Growth</span>
                  <span className="text-sm font-bold text-secondary">+6.2%</span>
                </div>
                <div className="p-4 bg-white border border-outline-variant/60 rounded-xl flex justify-between items-center shadow-soft">
                  <span className="text-xs font-semibold text-on-surface-variant">Annual ISA Limit</span>
                  <span className="text-sm font-bold text-primary">£20,000</span>
                </div>
                <div className="p-4 bg-white border border-outline-variant/60 rounded-xl flex justify-between items-center shadow-soft">
                  <span className="text-xs font-semibold text-on-surface-variant">CPI Inflation Index</span>
                  <span className="text-sm font-bold text-error">3.1%</span>
                </div>
              </div>
            </div>

            {/* CTA section */}
            <div className="lg:col-span-4 p-6 bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col justify-between h-44 shadow-soft">
              <div>
                <h5 className="font-bold text-sm mb-1 text-on-surface">Book Pension Audit</h5>
                <p className="text-xs text-on-surface-variant leading-relaxed">Speak to an FCA-regulated partner for a free 15-minute retirement planning check.</p>
              </div>
              <button className="w-full py-2 bg-primary text-on-primary rounded-lg font-bold text-xs hover:opacity-90 transition-opacity">
                Schedule Free Audit
              </button>
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
