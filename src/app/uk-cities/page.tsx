import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Banknote } from 'lucide-react';
import { CITIES } from '../../data/cities';

export const metadata: Metadata = {
  title: 'UK Cities for Immigrants — Cost of Living, Jobs & Sponsors',
  description: 'Side-by-side guides to UK cities for visa applicants: monthly cost of living, top hiring sectors, neighbourhoods and local notes.',
  alternates: { canonical: '/uk-cities' },
};

export default function UkCitiesIndex() {
  const cities = Object.values(CITIES).sort((a, b) => {
    if (a.status === b.status) return a.name.localeCompare(b.name);
    return a.status === 'full' ? -1 : 1;
  });

  return (
    <div className="bg-white">
      <section className="pt-[100px] md:pt-[120px] pb-12 md:pb-14 bg-gradient-to-br from-[#0A2540] via-[#0e1b3f] to-[#0F2C4B] relative isolate overflow-hidden">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#0A2540]/15 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A] mb-3">
            <MapPin className="w-3 h-3" /> UK city guides
          </span>
          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold tracking-[-0.025em] leading-[1.05]">
            Where to land your UK move<br />
            <span className="text-white/55">cost, jobs and sponsor activity by city.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/55 text-base leading-relaxed">
            Practical city briefs for newcomers on a UK visa — monthly cost of living, top hiring sectors and the best neighbourhoods to settle in.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#fafbfd]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((c) => (
              <Link
                key={c.code}
                href={`/uk-cities/${c.code}`}
                className="group block bg-white rounded-2xl border border-[rgba(14,20,36,0.07)] p-5 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10, 37, 64,0.08)] transition-[transform,border-color,box-shadow] duration-150"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-display font-bold text-[18px] text-[#0A2540] leading-tight">{c.name}</div>
                  {c.status === 'stub' && (
                    <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[#f3f5fb] text-[#7a8195]">Brief</span>
                  )}
                </div>
                <div className="text-[11.5px] text-[#9aa3b8] mb-3">{c.region}</div>
                <p className="text-[12.5px] text-[#52596e] leading-snug line-clamp-3 mb-3">{c.tagline}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[rgba(14,20,36,0.06)]">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-[#52596e]">
                    <Banknote className="w-3.5 h-3.5 text-[#10b981]" />
                    <strong className="text-[#0A2540] tabular-nums">£{c.monthlyCost.total}</strong>/mo
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#00C4B4] group-hover:gap-2 transition-[gap] duration-100">
                    Read <ArrowRight className="w-3.5 h-3.5" />
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
