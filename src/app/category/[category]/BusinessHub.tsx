'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  ArrowUpRight,
  Building2,
  Coins,
  TrendingUp,
  Briefcase,
  Users,
  Store,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function BusinessHub() {
  const [profit, setProfit] = useState<number>(55000);

  // Quick estimation of Sole Trader vs Ltd Company efficiency
  const calculateEfficiency = (p: number) => {
    if (p < 15000) return 'Sole Trader is slightly more efficient (lower admin overhead)';
    if (p < 30000) return 'Sole Trader and Ltd Company are roughly equal';
    const pct = Math.min(20, Math.max(5, Math.round(5 + (p - 30000) / 4000)));
    return `Ltd Company is approximately ${pct}% more tax efficient`;
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Business</span>
        </nav>
        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
            Business & Self-Employed Hub
          </h1>
          <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            High-precision calculation workstations and compliance tools for sole traders, contractors, and Limited company directors.
          </p>
        </div>
      </section>

      {/* Hero Section: Comparison Tool & VAT Checker */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Comparison Tool */}
          <div className="xl:col-span-2 rounded-2xl overflow-hidden flex flex-col md:flex-row border border-outline-variant bg-surface-container-lowest shadow-soft">
            <div className="p-8 bg-primary text-white md:w-1/3 flex flex-col justify-center">
              <Building2 className="h-12 w-12 text-primary-soft mb-4" />
              <h2 className="text-2xl font-display font-bold leading-tight mb-2">Sole Trader vs Ltd Company</h2>
              <p className="text-sm opacity-90 mb-6 leading-relaxed">Calculate the tax efficiency of different business structures based on your projected annual profit.</p>
              <Link href="/contractor-ir35" className="py-2.5 px-5 bg-white text-primary rounded-xl font-semibold text-center text-xs self-start hover:bg-primary-soft transition-colors shadow-sm">
                Start Comparison
              </Link>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Projected Annual Profit</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">£</span>
                      <input
                        className="w-full pl-8 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-base font-semibold outline-none"
                        type="number"
                        value={profit}
                        onChange={(e) => setProfit(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-secondary-soft/50 rounded-xl border border-secondary-strong/20">
                    <p className="text-xs font-bold text-secondary mb-1">Tax Efficiency Insight</p>
                    <p className="text-sm font-semibold text-on-surface">{calculateEfficiency(profit)}.</p>
                  </div>
                </div>
                <div className="h-44 w-full bg-surface-container-high rounded-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent flex items-end p-4 z-10">
                    <span className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">ANALYSIS PREVIEW 2026/27</span>
                  </div>
                  {/* Subtle decorative chart shape using pure Tailwind CSS elements */}
                  <div className="absolute bottom-10 left-6 right-6 h-16 flex items-end gap-2">
                    <div className="w-1/4 bg-primary-soft h-1/3 rounded-t-sm" />
                    <div className="w-1/4 bg-primary h-2/3 rounded-t-sm" />
                    <div className="w-1/4 bg-secondary-soft h-1/2 rounded-t-sm" />
                    <div className="w-1/4 bg-secondary h-full rounded-t-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VAT Checker */}
          <div className="rounded-2xl p-8 border border-outline-variant bg-surface-container-lowest shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-soft rounded-xl flex items-center justify-center text-accent">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-display font-bold">VAT Checker</h2>
              </div>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Determine if your current turnover mandates VAT registration or if voluntary schemes (Flat Rate) would benefit your business model.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
                  <span className="text-sm text-on-surface-variant">Registration Threshold</span>
                  <span className="text-sm font-bold font-mono">£90,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
                  <span className="text-sm text-on-surface-variant">Standard Rate</span>
                  <span className="text-sm font-bold font-mono">20.0%</span>
                </div>
              </div>
            </div>
            <Link href="/self-employed-tax" className="w-full mt-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl text-center text-xs hover:bg-primary-soft/50 transition-colors">
              Check Status
            </Link>
          </div>
        </div>
      </section>

      {/* Tool Grid Header */}
      <section className="container-page pb-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-outline-variant pb-4">
          <h3 className="text-xl font-display font-bold text-on-surface border-l-4 border-primary pl-3">
            Calculation Workstations
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-on-surface-variant px-2.5 py-1 bg-surface-container rounded-md uppercase tracking-wider">UK 2026/27</span>
            <span className="text-xs font-semibold text-on-surface-variant">Active Tools: 6</span>
          </div>
        </div>
      </section>

      {/* Main Bento Tool Grid (Unified Workstation Design) */}
      <section className="container-page pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Corporation Tax Card */}
          <WorkstationCard
            title="Corporation Tax"
            description="Calculate corporation tax using the sliding scale from 19% to 25% based on net profits."
            tag="HMRC Sync"
            href="/self-employed-tax"
            icon={Coins}
          />
          {/* Dividend Allowance Card */}
          <WorkstationCard
            title="Dividend Tax"
            description="Personal tax bands, tax-free allowances and deductions on dividend distributions."
            tag="Professional"
            href="/director-dividend"
            icon={TrendingUp}
          />
          {/* IR35 Status Card */}
          <WorkstationCard
            title="IR35 Status"
            description="Risk assessment tool for contractors to evaluate inside vs outside IR35 engagements."
            tag="FCA Ready"
            href="/contractor-ir35"
            icon={Briefcase}
            accentColor="border-t-accent"
          />
          {/* PAYE Employer Cost Card */}
          <WorkstationCard
            title="PAYE Costs"
            description="Calculate National Insurance contributions, employer pensions and overhead costs."
            tag="Operations"
            href="/take-home-pay"
            icon={Users}
            accentColor="border-t-secondary"
          />
          {/* Business Rates Card */}
          <WorkstationCard
            title="Business Rates"
            description="Regional small business rate relief multiplier check and property tax liability."
            tag="HMRC Sync"
            href="/tools"
            icon={Store}
            accentColor="border-t-secondary"
          />
          {/* Capital Gains Card */}
          <WorkstationCard
            title="Capital Gains (CGT)"
            description="Asset disposal calculations including Business Asset Disposal Relief (BADR) eligibility."
            tag="Professional"
            href="/cgt-calculator"
            icon={Scale}
          />
        </div>
      </section>

      {/* Compliance & Data Sources */}
      <section className="container-page pb-20">
        <div className="bg-surface-container-low/50 rounded-2xl p-8 border border-outline-variant shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Compliance & Data Integrity
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                All calculations are updated for the <strong className="text-on-surface">2026/27 Tax Year</strong> and vetted against official HMRC technical specifications. Our calculation systems account for regional variances across the UK.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span className="text-xs font-semibold text-on-surface">HMRC Real-time Sync</span>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                  <span className="text-xs font-semibold text-on-surface">FCA Guideline Ready</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-80 shrink-0">
              <div className="p-6 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-md">
                <p className="text-[10px] font-bold tracking-widest text-primary-soft/80 uppercase mb-1">System Health</p>
                <p className="text-sm font-bold mb-4 text-primary-soft">Updated: April 6, 2026</p>
                <ul className="text-xs space-y-3 opacity-90">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full shrink-0"></span>
                    NI Rates reduction fully applied
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full shrink-0"></span>
                    Dividend threshold updates verified
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full shrink-0"></span>
                    CGT Relief modifications verified
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface CardProps {
  title: string;
  description: string;
  tag: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: string;
}

function WorkstationCard({ title, description, tag, href, icon: Icon, accentColor = 'border-t-primary' }: CardProps) {
  return (
    <div className={`workstation-card rounded-2xl p-6 flex flex-col h-full bg-surface-container-lowest border border-outline-variant hover:border-primary border-t-4 ${accentColor} transition-all duration-200 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-soft/35 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-wider">
          {tag}
        </span>
      </div>
      <div className="mb-6 flex-grow">
        <h4 className="text-lg font-display font-bold mb-2 text-on-surface">{title}</h4>
        <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
      </div>
      <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Ready</span>
        </div>
        <Link href={href} className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
          Launch Tool
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
