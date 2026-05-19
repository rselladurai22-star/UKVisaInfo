import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Building2, MapPin, ShieldCheck, ExternalLink, Briefcase,
} from 'lucide-react';
import { SPONSORS, SPONSOR_SECTORS } from '../../../../data/sponsors';
import { slugify } from '../../../../lib/slug';
import SidebarAffiliate from '../../../../components/blog/SidebarAffiliate';
import StickyMobileCta from '../../../../components/StickyMobileCta';

interface RouteParams { params: Promise<{ sector: string }> }

export function generateStaticParams() {
  return SPONSOR_SECTORS.map((s) => ({ sector: slugify(s) }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { sector } = await params;
  const real = SPONSOR_SECTORS.find((s) => slugify(s) === sector);
  if (!real) return { title: 'Sector not found' };
  const sponsors = SPONSORS.filter((s) => s.sector === real);
  const title = `${real} UK Sponsor Licence Holders — Skilled Worker 2026`;
  const description = `${sponsors.length} UK ${real.toLowerCase()} sector employers licensed to sponsor Skilled Worker visas in 2026. Filter by city and licence rating.`;
  return {
    title, description,
    alternates: { canonical: `/sponsors/sector/${sector}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/sponsors/sector/${sector}`, type: 'article' },
  };
}

export default async function SponsorSectorPage({ params }: RouteParams) {
  const { sector } = await params;
  const real = SPONSOR_SECTORS.find((s) => slugify(s) === sector);
  if (!real) notFound();

  const sponsors = SPONSORS.filter((s) => s.sector === real)
    .sort((a, b) => {
      const rank = (r: string) => (r === 'A (Premium)' ? 0 : r === 'A' ? 1 : 2);
      const rd = rank(a.rating) - rank(b.rating);
      return rd !== 0 ? rd : a.name.localeCompare(b.name);
    });

  const byCity = new Map<string, typeof sponsors>();
  for (const s of sponsors) {
    const key = s.city || 'Other';
    const arr = byCity.get(key) ?? [];
    arr.push(s); byCity.set(key, arr);
  }
  const cities = [...byCity.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <>
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0e1b3f] to-[#0F2C4B] pt-[100px] md:pt-[120px] pb-12 md:pb-14">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#0A2540]/15 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link href="/tools/sponsor-search" className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm font-medium mb-6 transition-colors duration-100">
            <ArrowLeft className="w-4 h-4" /> Sponsor search
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A] mb-3">
            <Building2 className="w-3 h-3" /> Sector directory
          </span>
          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold leading-[1.05] tracking-[-0.025em]">
            {real} UK sponsor licence holders
          </h1>
          <p className="mt-4 max-w-2xl text-white/65 text-base leading-relaxed">
            {sponsors.length} {real.toLowerCase()} sector employers currently licensed by the Home Office to sponsor Skilled Worker visas. Showing A-rated holders first.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[12px] text-white/55">
            <Stat label="Sponsors" value={sponsors.length.toString()} />
            <Stat label="Cities" value={byCity.size.toString()} />
            <Stat label="A-rated" value={sponsors.filter(s => s.rating !== 'B').length.toString()} />
          </div>
        </div>
      </header>

      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-10">
            <main className="col-span-12 lg:col-span-8 space-y-5">
              {cities.map(([city, items]) => (
                <section key={city} className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10, 37, 64,0.04)]">
                  <div className="mb-5 pb-4 border-b border-[rgba(14,20,36,0.06)] flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-[1.25rem] font-bold text-[#0A2540] tracking-[-0.015em] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#00C4B4]" />
                      {city}
                    </h2>
                    <Link href={`/sponsors/city/${slugify(city)}`} className="text-[12px] font-semibold text-[#00C4B4] hover:underline">
                      All in {city} →
                    </Link>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map((s) => (
                      <li key={s.name} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(14,20,36,0.05)] bg-white">
                        <span className="w-8 h-8 rounded-lg bg-[rgba(10, 37, 64,0.08)] text-[#0A2540] flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-semibold text-[#0A2540] truncate">{s.name}</div>
                          <div className="text-[11px] text-[#7a8195]">{s.region}</div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full flex-shrink-0 ${
                          s.rating === 'B'
                            ? 'bg-[#fef3c7] text-[#92400e]'
                            : s.rating === 'A (Premium)'
                              ? 'bg-[#dcfce7] text-[#047857]'
                              : 'bg-[#dbeafe] text-[#1d4ed8]'
                        }`}>{s.rating}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </main>

            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[100px] space-y-4">
                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-3">
                    Browse other sectors
                  </div>
                  <ul className="space-y-1">
                    {SPONSOR_SECTORS.map((s) => {
                      const count = SPONSORS.filter((sp) => sp.sector === s).length;
                      const active = s === real;
                      return (
                        <li key={s}>
                          <Link
                            href={`/sponsors/sector/${slugify(s)}`}
                            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[13px] transition-colors duration-100 ${
                              active ? 'bg-[#0A2540] text-white' : 'text-[#52596e] hover:bg-[#f3f5fb]'
                            }`}
                          >
                            <span className="font-semibold">{s}</span>
                            <span className={`tabular-nums text-[11px] ${active ? 'text-white/55' : 'text-[#9aa3b8]'}`}>{count}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <Link
                  href="/tools/sponsor-search"
                  className="group block rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#1d4ed8] p-5 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] opacity-70 mb-1.5">Tool</div>
                    <div className="font-display font-bold text-[17px] leading-tight">Full sponsor search</div>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold group-hover:gap-2.5 transition-[gap] duration-100">
                      Search 126k+ sponsors <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>

                <SidebarAffiliate tags={['Skilled Worker']} />

                <a
                  href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
                  target="_blank" rel="noopener noreferrer"
                  className="block rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-4 hover:border-[#0A2540] transition-colors duration-100"
                >
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12px] text-[#52596e] leading-snug">Verified against the official Home Office Register of Licensed Sponsors.</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#00C4B4]">
                    Open register <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta context="Find a sponsor" label="Open sponsor search" href="/tools/sponsor-search" />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/[0.12]">
      <Briefcase className="w-3 h-3 opacity-60" />
      <strong className="text-white font-bold tabular-nums">{value}</strong> {label}
    </span>
  );
}
