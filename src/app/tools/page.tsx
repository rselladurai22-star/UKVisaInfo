import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Search, ArrowRight, Briefcase, Scale, FileSearch } from 'lucide-react';

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

const FONT   = '"Lexend Deca", -apple-system, system-ui, sans-serif';
const INK    = '#213343';
const SLATE  = '#516F90';
const MUTED  = '#7C98B6';
const ORANGE = '#FF7A59';
const HAIR   = 'rgba(33,51,67,0.08)';

const TOOLS = [
  {
    href: '/tools/salary-checker',
    icon: Briefcase,
    category: 'Skilled Worker',
    title: 'Skilled Worker salary checker',
    desc: 'Enter your offered salary and SOC 2020 code. See instantly whether you clear the £41,700 general threshold, the £33,400 new-entrant rate, and your occupation\'s going rate.',
  },
  {
    href: '/tools/sponsor-search',
    icon: Search,
    category: 'Sponsorship',
    title: 'UK sponsor licence search',
    desc: 'Find UK employers who hold a Skilled Worker sponsor licence. Filter by city, region, sector and rating. Built from the official Home Office register.',
  },
  {
    href: '/tools/cost-calculator',
    icon: Calculator,
    category: 'Cost',
    title: 'Advanced UK visa cost calculator',
    desc: 'Calculate the full cost of any UK visa including Home Office fees, multi-year IHS, dependants and priority service. With currency conversion.',
  },
  {
    href: '/tools/compare',
    icon: Scale,
    category: 'Compare',
    title: 'Visa side-by-side comparison',
    desc: 'Compare any two UK visa routes on fees, IHS, salary thresholds, processing times, work rights and path to ILR. Decide which route fits your situation.',
  },
  {
    href: '/tools/refusal-analyzer',
    icon: FileSearch,
    category: 'Refusal',
    title: 'Refusal letter analyzer',
    desc: 'Paste your UK visa refusal letter and get a plain-English breakdown of each ground — severity, what it means, and what to do next. Runs in your browser.',
  },
];

export default function ToolsIndex() {
  return (
    <div style={{ background: '#FFFFFF', color: INK, fontFamily: FONT }}>

      {/* Hero */}
      <section className="pt-[120px] md:pt-[140px] pb-12 md:pb-16">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE,
            marginBottom: 14,
          }}>
            Free interactive tools
          </p>
          <h1 style={{
            fontFamily: FONT, fontWeight: 700,
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            lineHeight: 1.04, letterSpacing: '-0.032em',
            color: INK, maxWidth: '20ch',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}>
            UK visa tools that actually save you time
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 18, lineHeight: 1.6,
            color: SLATE, marginTop: 18, maxWidth: 620,
          }}>
            Five free calculators and searches built from the official Home Office
            data. No signup, no email required.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group lift-on-hover"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${HAIR}`,
                  borderRadius: 24,
                  padding: '32px 32px 28px',
                  display: 'block',
                  textDecoration: 'none',
                  color: INK,
                }}
              >
                {/* Icon + eyebrow */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="inline-flex items-center justify-center"
                    style={{
                      width: 44, height: 44,
                      background: 'rgba(255,122,89,0.10)',
                      color: ORANGE,
                      borderRadius: 12,
                    }}
                  >
                    <t.icon className="w-5 h-5" />
                  </span>
                  <span style={{
                    fontFamily: FONT, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: ORANGE,
                  }}>
                    {t.category}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: FONT, fontWeight: 700,
                  fontSize: 'clamp(1.25rem, 2.2vw, 1.5rem)',
                  lineHeight: 1.15, letterSpacing: '-0.022em',
                  color: INK, marginBottom: 10,
                  textWrap: 'balance' as React.CSSProperties['textWrap'],
                }}>
                  {t.title}
                </h2>

                <p style={{
                  fontFamily: FONT, fontSize: 14.5, lineHeight: 1.6,
                  color: SLATE, marginBottom: 22,
                }}>
                  {t.desc}
                </p>

                <span
                  className="inline-flex items-center gap-1.5 transition-all"
                  style={{
                    fontFamily: FONT, fontSize: 14, fontWeight: 600,
                    color: ORANGE,
                  }}
                >
                  Open tool
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
