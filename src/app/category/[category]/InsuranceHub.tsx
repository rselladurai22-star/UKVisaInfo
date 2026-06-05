'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Calculator,
  Calendar,
  Layers,
  HeartPulse,
  User,
  Car,
  Bike,
  Activity,
  FileText,
  Home,
  AlertTriangle,
} from 'lucide-react';

export default function InsuranceHub() {
  const [income, setIncome] = useState<number>(65000);
  const [dependents, setDependents] = useState<string>('2');
  const [mortgage, setMortgage] = useState<string>('240,000');
  const [calculatedCover, setCalculatedCover] = useState<number | null>(null);

  const handleCalculate = () => {
    const rawMortgage = Number(mortgage.replace(/,/g, ''));
    const depFactor = Number(dependents) * 100000;
    const incomeFactor = income * 10;
    setCalculatedCover(rawMortgage + depFactor + incomeFactor);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Insurance</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
          Insurance Hub
        </h1>
      </section>

      {/* Hero Section */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 bg-secondary-soft text-secondary text-xs font-bold rounded uppercase tracking-wider">
                Verified Precision
              </span>
              <span className="text-on-surface-variant text-xs font-medium">Last updated: Oct 2024</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
              Navigate Your Coverage with <span className="text-primary">Precision.</span>
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant mb-8 max-w-2xl leading-relaxed">
              Professional-grade calculators designed for life's complex risks. Get accurate estimates based on current actuarial data and market trends.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl text-xs font-semibold transition-all shadow-md flex items-center gap-2 group">
                Insurance Health Check
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href="/tools"
                className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-6 py-3 rounded-xl text-xs font-semibold transition-all border border-outline-variant/60"
              >
                Browse All Tools
              </Link>
            </div>
          </div>

          {/* Life Cover Estimator Quick Start */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-lift border border-outline-variant relative overflow-hidden h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-on-surface mb-6 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Life Cover Estimator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">ANNUAL INCOME</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">£</span>
                      <input
                        className="w-full pl-8 pr-4 py-2 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none"
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">DEPENDENTS</label>
                      <select
                        value={dependents}
                        onChange={(e) => setDependents(e.target.value)}
                        className="w-full py-2 px-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">MORTGAGE BAL.</label>
                      <input
                        className="w-full py-2 px-3 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none font-mono"
                        type="text"
                        value={mortgage}
                        onChange={(e) => setMortgage(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {calculatedCover !== null && (
                  <div className="p-3 bg-secondary-soft text-secondary rounded-xl text-center font-bold text-sm">
                    Suggested Protection: £{calculatedCover.toLocaleString()}
                  </div>
                )}
                <button
                  onClick={handleCalculate}
                  className="w-full bg-secondary text-white py-3 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Calculate Required Cover
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Inventory Section (Workstation Layout) */}
      <section className="container-page pb-12 space-y-12">
        {/* Category Group 1: Personal Protection */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-outline-variant pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft/35 flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-on-surface leading-tight">Personal Protection</h2>
                <p className="text-xs text-on-surface-variant">Core calculators for individual risk and family safeguarding.</p>
              </div>
            </div>
            <Link href="/tools" className="text-primary font-bold text-xs hover:underline flex items-center gap-1">
              ALL PERSONAL TOOLS
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InsuranceToolCard
              category="Life"
              title="Life Insurance Estimator"
              description="Determine optimal coverage amounts based on debt, dependents, and inflation modeling."
              href="/tools"
            />
            <InsuranceToolCard
              category="Financial"
              title="Income Protection Gap"
              description="Analyze the deficit between statutory sick pay and your essential monthly expenditures."
              href="/sick-pay"
              showActuarialBadge={true}
            />
            <InsuranceToolCard
              category="Health"
              title="Private Health Modeler"
              description="Compare policy tiers from basic outpatient to comprehensive private medical cover."
              href="/tools"
              lastUpdated="Updated 2d ago"
            />
          </div>
        </div>

        {/* Category Group 2: Property & Assets */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-outline-variant pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-soft text-secondary flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-on-surface leading-tight">Property & Assets</h2>
                <p className="text-xs text-on-surface-variant">Precision valuation tools for physical assets and holdings.</p>
              </div>
            </div>
            <Link href="/tools" className="text-primary font-bold text-xs hover:underline flex items-center gap-1">
              ALL ASSET TOOLS
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feature-rich card */}
            <div className="lg:col-span-2 rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest shadow-soft grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 rounded-xl overflow-hidden h-32 md:h-full relative border border-outline-variant/50">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZGDViQe7u-NPnaEItpS5PIswKzF-73CrB2Oxm1gnwcV_ObwPHapAlzYxTnE2inSRHlWko-HnB0GYmmqQbjqv-6RnCttO0zi5tdqm5C1uL37oDvjVXRuC-ecFjlm1HgZXTAFlWkFo6-oLBaQijq16IXWHLFTdkymkvJu1vLV9A5sEciOddRZjs-AmHWgtkGTOqgloaXakj7bTWJ1Uc8dxrjojFYvjn9XXwymv1zHGfb-3KV28sf1H4NPc1w-PrL0aUh4wrAhb39To"
                  alt="Modern residence facade"
                />
              </div>
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-primary-soft text-primary text-[10px] font-bold rounded uppercase tracking-wider">
                      Property
                    </span>
                    <span className="px-2 py-0.5 bg-secondary-soft text-secondary text-[10px] font-bold rounded uppercase tracking-wider">
                      Premium Tool
                    </span>
                  </div>
                  <h4 className="text-base font-display font-bold mb-2 text-on-surface">Home Rebuild Cost Calculator</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    A geo-referenced tool using current local construction data to prevent under-insurance on your primary residence.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40 mt-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Sqm/Rate</span>
                      <span className="text-xs font-bold font-mono">£2,450</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Index</span>
                      <span className="text-xs font-bold font-mono text-secondary">+4.2%</span>
                    </div>
                  </div>
                  <Link href="/tools" className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-primary-container transition-colors shadow-sm">
                    Start Calculation
                  </Link>
                </div>
              </div>
            </div>

            {/* Pet Card */}
            <div className="rounded-2xl p-6 border border-outline-variant bg-surface-container-lowest shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-wider">Pet</span>
                </div>
                <h4 className="text-base font-display font-bold mb-2 text-on-surface">Vet Fee Comparison</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                  Evaluate maximum claim limits across 50+ specialized pet insurance providers.
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/40 flex justify-between items-center mt-auto">
                <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1">
                  🐾 Vet cover
                </span>
                <Link href="/childcare-calculator" className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                  LAUNCH TOOL
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Category Group 3: Vehicle Insurance */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-outline-variant pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-on-surface leading-tight">Vehicle Insurance</h2>
                <p className="text-xs text-on-surface-variant">Road risk assessment and classification modeling.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group Finder */}
            <div className="workstation-card rounded-2xl p-6 bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-200 hover:shadow-md flex gap-4">
              <div className="w-12 h-12 bg-primary-soft/30 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Car className="h-6 w-6" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-wider">Motor</span>
                  <span className="text-[10px] text-secondary font-bold tracking-wider uppercase">Live Data</span>
                </div>
                <h4 className="text-base font-display font-bold mb-2 text-on-surface">Car Insurance Group Finder</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  Instantly identify the insurance risk group (1-50) for any UK vehicle model.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[9px] bg-surface-container px-2 py-0.5 rounded font-semibold text-on-surface-variant">ABI DATA</span>
                  <span className="text-[9px] bg-surface-container px-2 py-0.5 rounded font-semibold text-on-surface-variant">THATCHAM</span>
                </div>
                <Link href="/mot-check" className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                  SEARCH DATABASE
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            {/* Risk Modeler */}
            <div className="workstation-card rounded-2xl p-6 bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-200 hover:shadow-md flex gap-4">
              <div className="w-12 h-12 bg-primary-soft/30 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Bike className="h-6 w-6" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-wider">Bike</span>
                </div>
                <h4 className="text-base font-display font-bold mb-2 text-on-surface">Motorcycle Risk Modeler</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  Evaluate the impact of high-security locks and trackers on specialized premiums.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[9px] bg-surface-container px-2 py-0.5 rounded font-semibold text-on-surface-variant">SECURITY CREDITS</span>
                </div>
                <Link href="/tools" className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                  LAUNCH MODELER
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Library Section */}
      <section className="container-page pb-20">
        <div className="bg-surface-container-low/50 p-8 rounded-2xl border border-outline-variant">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-display font-bold text-on-surface">Resource Library</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LibraryArticle
              title="How much life cover do I really need?"
              excerpt="A deep dive into debt-to-income ratios and long-term family financial planning."
              readTime="8 MIN READ"
            />
            <LibraryArticle
              title="Understanding Insurance Groups"
              excerpt="The technical factors that determine where your car sits on the 1-50 risk scale."
              readTime="12 MIN READ"
            />
            <LibraryArticle
              title="The No-Claims Bonus Model"
              excerpt="How years of safe driving translate into percentage-based premium discounts."
              readTime="5 MIN READ"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

interface ToolCardProps {
  category: string;
  title: string;
  description: string;
  href: string;
  showActuarialBadge?: boolean;
  lastUpdated?: string;
}

function InsuranceToolCard({
  category,
  title,
  description,
  href,
  showActuarialBadge,
  lastUpdated,
}: ToolCardProps) {
  return (
    <div className="workstation-card rounded-2xl p-6 flex flex-col h-full bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <span className="px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
          {category}
        </span>
      </div>
      <div className="mb-6 flex-grow">
        <h4 className="text-base font-display font-bold mb-2 text-on-surface">{title}</h4>
        <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
      </div>
      <div className="pt-4 border-t border-outline-variant/40 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          {showActuarialBadge && (
            <span className="text-[9px] font-bold text-secondary bg-secondary-soft px-1.5 py-0.5 rounded uppercase tracking-wider">
              Actuarial
            </span>
          )}
          {lastUpdated && <span className="text-[10px] text-on-surface-variant italic">{lastUpdated}</span>}
        </div>
        <Link href={href} className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
          Launch Tool
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function LibraryArticle({ title, excerpt, readTime }: { title: string; excerpt: string; readTime: string }) {
  return (
    <article className="space-y-3 flex flex-col justify-between h-full bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 shadow-sm hover:shadow transition-shadow">
      <div>
        <h5 className="text-sm font-bold font-display text-on-surface hover:text-primary transition-colors cursor-pointer">
          {title}
        </h5>
        <p className="text-xs text-on-surface-variant leading-relaxed mt-2">{excerpt}</p>
      </div>
      <span className="text-[9px] font-bold text-primary tracking-widest uppercase mt-4 block">{readTime}</span>
    </article>
  );
}
