'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Coins,
  TrendingUp,
  Scale,
  Shield,
  CheckCircle2,
  Calendar,
  BellRing,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function TaxIncomeHub() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Breadcrumbs & Title Section */}
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Tax & Income</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-on-surface">
          Tax & Income
        </h1>
        <p className="mt-3 text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Precision tools for financial planning, compliance tracking, and net income estimation in the current fiscal year.
        </p>
      </section>

      {/* Hero: Key Dates & Global CTA */}
      <section className="container-page pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Status/Calendar Card */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-8 shadow-soft border border-outline-variant flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
            <div className="flex-1 z-10">
              <div className="inline-flex items-center gap-2 bg-primary-soft text-primary px-4 py-1 rounded-full text-xs font-bold mb-4">
                <Calendar className="h-4 w-4" />
                Upcoming Tax Deadline
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">Self-Assessment Filing</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Complete your online submission for the current tax year to avoid HMRC penalties. Remaining: <span className="text-error font-bold italic">14 Days</span>.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/take-home-pay"
                  className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-colors"
                >
                  Launch Tax Calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tools"
                  className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-6 py-3 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Full Calendar
                </Link>
              </div>
            </div>
            <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden relative z-10 shrink-0 border border-outline-variant/60">
              <img
                alt="Tax documents on a clean office desk"
                className="w-full h-full object-cover grayscale opacity-85"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBMPLqpkSv2rEAb9Mkv6CQ48qzVZsS4uQ78emE6jel36xuoT9mLJUlonphSWbWJV2KWtujaDb8Rd8fEO1R5vSLXpzcn0W586T3aa0kFubPmuYL3c53R-RfjY82rixYwhdoGQfEdwPLZRlUS94ZcM5w-JgQruY6XnsNB4f-SasYfjvdTLBE2asQ3hq0dtvx7w3_8SOdI65YOwaM8_vp2xLvPXTh6I5MWfLWfgEdMTRLKtPUDbKdm81OORtRA4YuutZ-wGLEKSZZs80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          {/* Stats/Briefing Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-primary-soft/45 text-on-surface p-6 rounded-2xl flex-1 flex flex-col justify-center border border-primary/10">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">Fiscal Year Status</span>
              <div className="text-3xl font-display font-bold leading-tight mb-1">2026/27</div>
              <p className="text-xs text-on-surface-variant leading-relaxed">Personal Allowance: £12,570. Standard tax codes applied.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-primary">Quick Alerts</span>
                <BellRing className="h-5 w-5 text-secondary" />
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 shrink-0"></span>
                  New VAT MTD rules updated for 2026.
                </li>
                <li className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 shrink-0"></span>
                  Capital Gains thresholds reduced.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Grid Header */}
      <section className="container-page pb-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold">Calculators & Toolkits</h3>
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-lg border border-outline-variant">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-surface-container-lowest shadow-sm text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-surface-container-lowest shadow-sm text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </section>

      {/* Tool Grid: High Density Modular Layout */}
      <section className="container-page pb-16">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <TaxToolCard
              title="Take-home Pay (PAYE)"
              description="Calculate your exact net monthly and annual income after tax and NI contributions with up-to-date thresholds."
              tag="Popular"
              href="/take-home-pay"
              icon={Coins}
              tagStyle="bg-secondary/10 text-secondary border border-secondary/20"
            />
            <TaxToolCard
              title="Dividend Tax"
              description="Estimation tool for company directors and shareholders managing dividend distributions and tax efficiency."
              tag="Business"
              href="/director-dividend"
              icon={TrendingUp}
              iconBg="bg-accent-soft/30 text-accent border-accent-soft/40"
            />
            <TaxToolCard
              title="Capital Gains (CGT)"
              description="Calculate liability for property sales, shares, or other taxable asset disposals including annual exemptions."
              tag="Investments"
              href="/cgt-calculator"
              icon={Scale}
              iconBg="bg-secondary-soft/50 text-secondary border-secondary-soft/60"
            />
            <TaxToolCard
              title="National Insurance"
              description="Verify Class 1, 2, or 4 contributions based on employment or self-employment status for the current year."
              tag="Compliance"
              href="/take-home-pay"
              icon={Shield}
            />
            <TaxToolCard
              title="VAT Checker"
              description="Instantly calculate gross, net, and VAT components for any commercial transaction with custom rate support."
              tag="Business"
              href="/self-employed-tax"
              icon={CheckCircle2}
              iconBg="bg-secondary-soft/50 text-secondary border-secondary-soft/60"
            />
            <TaxToolCard
              title="Self-Assessment Estimator"
              description="Forecast your upcoming tax bill to better manage your cash flow and savings before the deadline."
              tag="Urgent"
              href="/self-employed-tax"
              icon={UserCheck}
              tagStyle="bg-error-container text-error border border-error/20"
              iconBg="bg-error-container/20 text-error border-error-container/30"
            />
          </div>
        ) : (
          <div className="border border-outline-variant bg-surface-container-lowest rounded-2xl overflow-hidden shadow-soft">
            <ul className="divide-y divide-outline-variant/40">
              <TaxListRow title="Take-home Pay (PAYE)" description="Net salary and tax code auditor." href="/take-home-pay" icon={Coins} />
              <TaxListRow title="Dividend Tax" description="Shareholder payout tax band estimations." href="/director-dividend" icon={TrendingUp} />
              <TaxListRow title="Capital Gains (CGT)" description="Asset and share disposal tax calculator." href="/cgt-calculator" icon={Scale} />
              <TaxListRow title="National Insurance" description="Class contributions validator." href="/take-home-pay" icon={Shield} />
              <TaxListRow title="VAT Checker" description="Quick invoicing and VAT rate calculations." href="/self-employed-tax" icon={CheckCircle2} />
              <TaxListRow title="Self-Assessment Estimator" description="Self-employment and SA tax band forecasting." href="/self-employed-tax" icon={UserCheck} />
            </ul>
          </div>
        )}
      </section>

      {/* Informational Section */}
      <section className="container-page pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-surface-container-low/50 rounded-2xl p-8 border border-outline-variant flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-display font-bold mb-4">Precision Methodology</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Our calculators are updated daily based on HMRC's latest technical specifications. We account for current tax bands, personal allowances, and complex NI thresholds to ensure 99.9% data accuracy.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                Verified Algorithms
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                Zero-Log Privacy
              </div>
            </div>
          </div>
          <div className="border-l-4 border-primary pl-8 py-4 flex flex-col justify-center">
            <h4 className="text-lg font-display font-bold mb-2">Need professional advice?</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              While our tools provide high-precision estimates, complex tax affairs should be reviewed by a qualified accountant.
            </p>
            <Link href="/about" className="text-primary font-bold text-xs flex items-center gap-1 hover:underline self-start">
              Find a certified specialist
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
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
  tagStyle?: string;
  iconBg?: string;
}

function TaxToolCard({
  title,
  description,
  tag,
  href,
  icon: Icon,
  tagStyle = 'bg-surface-container text-on-surface-variant border border-outline-variant/30',
  iconBg = 'bg-primary/5 text-primary border-primary/10',
}: CardProps) {
  return (
    <div className="workstation-card rounded-2xl p-6 flex flex-col h-full bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tagStyle}`}>
          {tag}
        </span>
      </div>
      <div className="mb-6 flex-grow">
        <h4 className="text-base font-display font-bold mb-2 text-on-surface">{title}</h4>
        <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-surface-container-low border border-outline-variant hover:bg-primary hover:text-white hover:border-primary text-primary font-semibold text-xs rounded-xl transition-all"
      >
        Launch Tool
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

interface ListProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function TaxListRow({ title, description, href, icon: Icon }: ListProps) {
  return (
    <li className="hover:bg-surface-container-low/20 transition-colors">
      <Link href={href} className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-soft/35 text-primary flex items-center justify-center border border-primary-soft/50">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-on-surface">{title}</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-on-surface-variant" />
      </Link>
    </li>
  );
}
