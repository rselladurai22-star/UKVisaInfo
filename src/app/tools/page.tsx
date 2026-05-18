import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Search, ArrowUpRight, Briefcase, Scale, FileSearch } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free UK Visa Tools — Salary Checker, Sponsor Search, Cost Calculator',
  description:
    'Four free interactive UK visa tools: Skilled Worker salary checker by SOC code, sponsor licence search, advanced cost calculator with IHS, and side-by-side visa comparison. Updated for 2026.',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'Free UK Visa Tools',
    description: 'Salary checker, sponsor search, cost calculator and visa comparison — all free.',
    url: 'https://ukvisainfo.co.uk/tools',
  },
};

const TOOLS = [
  {
    href: '/tools/salary-checker',
    icon: Briefcase,
    title: 'Skilled Worker salary checker',
    desc: 'Enter your offered salary and SOC 2020 code. See instantly whether you clear the £38,700 general threshold, the £30,960 new-entrant rate, and your occupation\'s going rate.',
    cta: 'Check salary qualification',
    accent: '#d9152b',
    soft: 'rgba(217,21,43,0.06)',
  },
  {
    href: '/tools/sponsor-search',
    icon: Search,
    title: 'UK sponsor licence search',
    desc: 'Find UK employers who hold a Skilled Worker sponsor licence. Filter by city, region, sector and rating. Built from the official Home Office register.',
    cta: 'Find a licensed sponsor',
    accent: '#2563eb',
    soft: 'rgba(37,99,235,0.06)',
  },
  {
    href: '/tools/cost-calculator',
    icon: Calculator,
    title: 'Advanced UK visa cost calculator',
    desc: 'Calculate the full cost of any UK visa including Home Office fees, multi-year IHS, dependants and priority service. With currency conversion.',
    cta: 'Estimate visa costs',
    accent: '#7c3aed',
    soft: 'rgba(124,58,237,0.06)',
  },
  {
    href: '/tools/compare',
    icon: Scale,
    title: 'Visa side-by-side comparison',
    desc: 'Compare any two UK visa routes on fees, IHS, salary thresholds, processing times, work rights and path to ILR. Decide which route fits your situation.',
    cta: 'Compare visa routes',
    accent: '#059669',
    soft: 'rgba(5,150,105,0.06)',
  },
  {
    href: '/tools/refusal-analyzer',
    icon: FileSearch,
    title: 'Refusal letter analyzer',
    desc: 'Paste your UK visa refusal letter and get a plain-English breakdown of each ground — severity, what it means, and what to do next. Runs in your browser.',
    cta: 'Decode my refusal',
    accent: '#e11d48',
    soft: 'rgba(225,29,72,0.06)',
  },
];

export default function ToolsIndex() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-[88px] md:pt-[104px] pb-12 md:pb-16 hero-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#d9152b]">
            Free interactive tools
          </span>
          <h1 className="mt-2 font-display text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold text-[#0a1530] tracking-tight leading-tight">
            UK visa tools that actually save you time
          </h1>
          <p className="mt-3 max-w-2xl text-[#52596e] text-base md:text-lg leading-relaxed">
            Four free calculators and searches built from the official Home
            Office data. No signup, no email required.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group relative overflow-hidden bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl md:rounded-3xl p-7 md:p-8 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-60 blur-3xl"
                  style={{ background: t.soft }}
                />
                <div className="relative z-10">
                  <span
                    className="inline-flex w-12 h-12 items-center justify-center rounded-2xl"
                    style={{ background: t.soft, color: t.accent }}
                  >
                    <t.icon className="w-6 h-6" />
                  </span>
                  <h2 className="mt-5 font-display text-xl md:text-2xl font-bold text-[#0a1530] leading-tight">
                    {t.title}
                  </h2>
                  <p className="mt-2.5 text-sm md:text-[15px] text-[#52596e] leading-relaxed">
                    {t.desc}
                  </p>
                  <span
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: t.accent }}
                  >
                    {t.cta}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
