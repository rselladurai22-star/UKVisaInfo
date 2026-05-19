import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe2 } from 'lucide-react';
import { COUNTRIES } from '../../data/countries';

export const metadata: Metadata = {
  title: 'UK Visa by Country — Country-Specific Application Guides',
  description: 'UK visa requirements, documents, application centres and processing notes broken down by your country of origin.',
  alternates: { canonical: '/from' },
};

export default function FromIndex() {
  const countries = Object.values(COUNTRIES).sort((a, b) => {
    if (a.status === b.status) return a.name.localeCompare(b.name);
    return a.status === 'full' ? -1 : 1;
  });

  return (
    <div className="bg-white">
      <section className="pt-[100px] md:pt-[120px] pb-12 md:pb-16 bg-gradient-to-br from-[#0A2540] via-[#0e1b3f] to-[#0F2C4B]">
        <div
          className="absolute inset-x-0 top-[60px] md:top-[68px] bottom-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A] mb-3">
            <Globe2 className="w-3 h-3" />
            Country guides
          </span>
          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold tracking-[-0.025em] leading-[1.05]">
            UK visa requirements <br />
            <span className="text-white/55">by your country of origin.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/55 text-base md:text-[1.0625rem] leading-relaxed">
            Country-specific application centres, TB-test rules, document requirements and
            processing notes. Updated for 2026.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((c) => (
              <Link
                key={c.code}
                href={`/from/${c.code}`}
                className="group block bg-white rounded-2xl border border-[rgba(14,20,36,0.07)] p-5 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10, 37, 64,0.08)] transition-[transform,border-color,box-shadow] duration-150"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-[2.25rem] leading-none">{c.flag}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-[16px] text-[#0A2540] leading-tight">
                      UK visa for {c.demonym}
                    </div>
                    <div className="text-[11.5px] text-[#9aa3b8] mt-0.5">
                      {c.applicationCentres.length} VFS centres
                    </div>
                  </div>
                  {c.status === 'stub' && (
                    <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[#f3f5fb] text-[#7a8195]">
                      Brief
                    </span>
                  )}
                </div>
                <p className="text-[12.5px] text-[#52596e] leading-snug line-clamp-3">
                  {c.tagline}
                </p>
                <div className="mt-4 pt-3 border-t border-[rgba(14,20,36,0.06)] inline-flex items-center gap-1.5 text-[12px] font-bold text-[#00C4B4] group-hover:gap-2.5 transition-[gap] duration-100">
                  View country guide <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-center text-[12.5px] text-[#7a8195]">
            More country guides coming. Want yours covered?{' '}
            <a href="mailto:contact@ukvisainfo.co.uk" className="text-[#00C4B4] font-semibold">Email us</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
