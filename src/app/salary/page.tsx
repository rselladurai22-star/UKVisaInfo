import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Briefcase, Search } from 'lucide-react';
import { SOC_OCCUPATIONS, SOC_GROUPS } from '../../data/socCodes';
import { socSlug } from '../../lib/slug';

export const metadata: Metadata = {
  title: 'UK Skilled Worker Salary by SOC Code 2026 — All 270 Occupations',
  description: 'Complete index of UK Skilled Worker visa going rates for every SOC 2020 occupation code. Standard rate, hourly equivalent, new-entrant discount and Immigration Salary List status.',
  alternates: { canonical: '/salary' },
};

export default function SalaryIndex() {
  // Group occupations by SOC group, sorted alphabetically inside each
  const grouped: Record<string, typeof SOC_OCCUPATIONS> = {};
  for (const o of SOC_OCCUPATIONS) {
    (grouped[o.group] ??= []).push(o);
  }
  for (const g of Object.keys(grouped)) {
    grouped[g].sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="bg-white">
      <section className="pt-[100px] md:pt-[120px] pb-12 md:pb-14 bg-gradient-to-br from-[#0a1530] via-[#0e1b3f] to-[#13204a] relative isolate overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }}
        />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#d9152b]/15 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#ffbf47] mb-3">
            <Briefcase className="w-3 h-3" /> Salary database
          </span>
          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold leading-[1.05] tracking-[-0.025em]">
            UK Skilled Worker salary by occupation<br className="hidden sm:block" />
            <span className="text-white/55">All 270 SOC 2020 codes · 2026 rates.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/55 text-base md:text-[1.0625rem] leading-relaxed">
            Every eligible occupation, its going rate, hourly equivalent and discount tiers — sourced from the Home Office Appendix Skilled Occupations.
          </p>
          <div className="mt-7">
            <Link
              href="/tools/salary-checker"
              className="inline-flex items-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] transition-colors duration-100"
            >
              <Search className="w-4 h-4" /> Interactive salary checker
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#fafbfd]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10">
          {SOC_GROUPS.map((group) => {
            const items = grouped[group] ?? [];
            if (!items.length) return null;
            return (
              <section key={group} id={slugifyGroup(group)} className="scroll-mt-24">
                <div className="flex items-baseline justify-between gap-3 mb-4">
                  <h2 className="font-display text-[1.25rem] md:text-[1.5rem] font-bold text-[#0a1530] tracking-[-0.015em]">
                    {group}
                  </h2>
                  <span className="text-[11.5px] text-[#7a8195] tabular-nums">{items.length} roles</span>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {items.map((occ) => (
                    <li key={occ.code}>
                      <Link
                        href={`/salary/${socSlug(occ.code, occ.title)}`}
                        className="group flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0a1530] hover:shadow-[0_4px_14px_rgba(10,21,48,0.06)] transition-[border-color,box-shadow] duration-150"
                      >
                        <span className="text-[10.5px] font-bold tracking-[0.04em] text-[#9aa3b8] tabular-nums w-9 pt-0.5 flex-shrink-0">
                          {occ.code}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-semibold text-[#0a1530] leading-snug group-hover:text-[#d9152b] transition-colors duration-100">
                            {occ.title}
                          </div>
                          <div className="text-[11.5px] text-[#7a8195] tabular-nums mt-0.5">
                            £{occ.goingRate.toLocaleString()} · £{occ.hourlyGoingRate?.toFixed(2) ?? '—'}/hr
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] mt-1 flex-shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function slugifyGroup(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
