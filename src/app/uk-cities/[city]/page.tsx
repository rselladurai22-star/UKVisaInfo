import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Building2, MapPin, Banknote, Train, ShoppingCart,
  Zap, Briefcase, Home, ShieldCheck, ExternalLink, Sparkles,
} from 'lucide-react';
import { CITIES, getCity } from '../../../data/cities';
import { SPONSORS } from '../../../data/sponsors';
import { slugify } from '../../../lib/slug';
import StickyMobileCta from '../../../components/StickyMobileCta';

interface RouteParams { params: Promise<{ city: string }> }

export function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return { title: 'City guide not found' };
  const title = `Living in ${c.name} on a UK Visa — Cost, Jobs & Sponsors 2026`;
  const description = `Move to ${c.name}: monthly cost of living, top hiring sectors, popular neighbourhoods for newcomers, NHS access and sponsor activity.`;
  return {
    title, description,
    alternates: { canonical: `/uk-cities/${city}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/uk-cities/${city}`, type: 'article' },
  };
}

export default async function CityPage({ params }: RouteParams) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  const sponsorsInCity = SPONSORS.filter((s) => s.city.toLowerCase() === c.name.toLowerCase()).length;

  return (
    <>
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#0e1b3f] to-[#13204a] pt-[100px] md:pt-[120px] pb-12 md:pb-14">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#2563eb]/18 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link href="/uk-cities" className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm font-medium mb-6 transition-colors duration-100">
            <ArrowLeft className="w-4 h-4" /> All cities
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#ffbf47] mb-3">
            <MapPin className="w-3 h-3" /> {c.region}
          </span>
          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold leading-[1.04] tracking-[-0.025em]">
            Living in {c.name} on a UK visa
          </h1>
          <p className="mt-4 max-w-2xl text-white/65 text-base md:text-[1.0625rem] leading-relaxed">
            {c.tagline}
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <FactPill icon={Banknote} label="One-bed rent" value={`£${c.monthlyCost.rent1bed}/mo`} />
            <FactPill icon={ShoppingCart} label="Cost of living" value={`£${c.monthlyCost.total}/mo`} />
            <FactPill icon={Building2} label="Sponsors here" value={`${sponsorsInCity}+ in our data`} />
          </div>
        </div>
      </header>

      <div className="bg-[#fafbfd]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-10">

            <main className="col-span-12 lg:col-span-8 space-y-5 md:space-y-6">

              <Section eyebrow="Overview" title={`What it’s like to land in ${c.name}`}>
                <p className="text-[#1a2240] text-[16px] md:text-[17px] leading-[1.7]">{c.intro}</p>
                {c.status === 'stub' && (
                  <p className="mt-4 text-[12.5px] text-[#92400e] bg-[#fffbeb] border border-[#fde68a] rounded-xl px-3 py-2 leading-snug">
                    This guide is a quick brief — full breakdown coming soon.
                  </p>
                )}
              </Section>

              <Section eyebrow="Cost of living" title={`Monthly budget for a single adult in ${c.name}`}>
                <p className="text-[#52596e] text-[14.5px] mb-5 leading-relaxed">
                  Average figures for 2026. Add ~£300/month per child and roughly +30% for a partner sharing rent.
                </p>
                <ul className="space-y-2.5 mb-5">
                  <CostRow icon={Home} label="One-bed rent" value={`£${c.monthlyCost.rent1bed}`} />
                  <CostRow icon={Train} label="Transport" value={`£${c.monthlyCost.transport}`} />
                  <CostRow icon={ShoppingCart} label="Groceries" value={`£${c.monthlyCost.groceries}`} />
                  <CostRow icon={Zap} label="Utilities + internet" value={`£${c.monthlyCost.utilities}`} />
                </ul>
                <div className="rounded-2xl bg-gradient-to-br from-[#dcfce7] to-white border border-[#bbf7d0] p-4 flex items-center justify-between gap-3">
                  <span className="text-[13.5px] font-bold text-[#047857] uppercase tracking-[0.08em]">Total / month</span>
                  <span className="font-display font-bold text-[1.625rem] text-[#0a1530] tabular-nums">£{c.monthlyCost.total}</span>
                </div>
              </Section>

              <Section eyebrow="Jobs" title="Top sectors hiring visa-sponsored roles">
                <ul className="space-y-3">
                  {c.topSectors.map((s, i) => (
                    <li key={i}>
                      <Link
                        href={`/sponsors/sector/${slugify(s.sector)}`}
                        className="group flex items-start gap-3 p-4 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0a1530] hover:shadow-[0_4px_14px_rgba(10,21,48,0.06)] transition-[border-color,box-shadow] duration-150"
                      >
                        <span className="w-9 h-9 rounded-xl bg-[rgba(37,99,235,0.08)] text-[#2563eb] flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14.5px] font-bold text-[#0a1530] group-hover:text-[#d9152b] transition-colors duration-100">{s.sector}</div>
                          <div className="text-[12.5px] text-[#7a8195] mt-0.5">{s.reason}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] group-hover:translate-x-0.5 transition-transform duration-150 mt-1 flex-shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section eyebrow="Where to live" title={`Popular ${c.name} neighbourhoods for newcomers`}>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {c.neighbourhoods.map((n) => (
                    <li key={n.name} className="p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white">
                      <div className="flex items-center gap-2 text-[14px] font-bold text-[#0a1530]">
                        <MapPin className="w-3.5 h-3.5 text-[#d9152b]" /> {n.name}
                      </div>
                      <div className="text-[12.5px] text-[#7a8195] mt-1 leading-snug">{n.vibe}</div>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section eyebrow="Local notes" title={`${c.name}-specific tips`}>
                <ul className="space-y-2.5">
                  {c.notes.map((n, i) => (
                    <li key={i} className="flex gap-3 items-start p-3.5 rounded-xl bg-[#fafbfd] border border-[rgba(14,20,36,0.05)]">
                      <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#d97706]" />
                      <span className="text-[#1a2240] text-[14px] leading-[1.6]">{n}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-7 md:p-9">
                <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-[#d9152b]/25 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="max-w-md">
                    <h3 className="font-display text-white text-[1.25rem] md:text-[1.5rem] font-bold leading-tight tracking-[-0.015em]">
                      Got your offer in {c.name}?
                    </h3>
                    <p className="mt-2 text-white/55 text-[13.5px]">Run the salary and cost numbers before you accept.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/tools/salary-checker" className="inline-flex items-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] transition-colors duration-100">
                      Check salary <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href={`/sponsors/city/${slugify(c.name)}`} className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.14] text-white font-semibold px-5 py-3 rounded-xl text-sm hover:bg-white/[0.13] transition-colors duration-100">
                      Local sponsors
                    </Link>
                  </div>
                </div>
              </div>
            </main>

            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[100px] space-y-4">
                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-3">Quick reference</div>
                  <dl className="space-y-2.5 text-[13px]">
                    <Row label="City" value={c.name} icon={MapPin} />
                    <Row label="Region" value={c.region} icon={Building2} />
                    <Row label="Cost (single)" value={`£${c.monthlyCost.total}/mo`} icon={Banknote} />
                    <Row label="Top sector" value={c.topSectors[0]?.sector ?? '—'} icon={Briefcase} />
                  </dl>
                </div>

                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-3">Other UK cities</div>
                  <ul className="space-y-1">
                    {Object.values(CITIES).filter((o) => o.code !== c.code).map((o) => (
                      <li key={o.code}>
                        <Link href={`/uk-cities/${o.code}`} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[13px] text-[#52596e] hover:bg-[#f3f5fb]">
                          <span className="font-semibold">{o.name}</span>
                          <span className="tabular-nums text-[11px] text-[#9aa3b8]">£{o.monthlyCost.total}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <a href="https://www.gov.uk/check-uk-visa" target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-[#fafbfd] border border-[rgba(14,20,36,0.05)] p-4">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12px] text-[#52596e] leading-snug">Cost figures sourced from ONS, transport authorities and rental platforms (May 2026).</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#d9152b]">
                    gov.uk visa check <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta context="Plan your move" label="Check salary threshold" href="/tools/salary-checker" />
    </>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
      <div className="mb-5 pb-4 border-b border-[rgba(14,20,36,0.06)]">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-1.5">{eyebrow}</div>
        <h2 className="font-display text-[1.375rem] md:text-[1.625rem] font-bold text-[#0a1530] leading-tight tracking-[-0.015em]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function FactPill({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.12] rounded-2xl px-3.5 py-2 backdrop-blur-sm">
      <Icon className="w-3.5 h-3.5 text-white/50" />
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45 leading-none mb-1">{label}</div>
        <div className="text-[13px] font-semibold text-white leading-none">{value}</div>
      </div>
    </div>
  );
}

function CostRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(14,20,36,0.05)] bg-[#fafbfd]">
      <span className="w-8 h-8 rounded-lg bg-white text-[#0a1530] flex items-center justify-center"><Icon className="w-3.5 h-3.5" /></span>
      <span className="text-[14px] font-semibold text-[#0a1530] flex-1">{label}</span>
      <span className="text-[14px] font-bold text-[#0a1530] tabular-nums">{value}</span>
    </li>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-start justify-between gap-3 py-0.5">
      <dt className="flex items-center gap-2 text-[12px] text-[#7a8195] font-medium">
        <Icon className="w-3 h-3" /> {label}
      </dt>
      <dd className="text-[12.5px] font-semibold text-[#0a1530] text-right">{value}</dd>
    </div>
  );
}
