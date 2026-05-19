import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Calculator,
  CheckCircle2, Banknote, Clock, Calendar,
} from 'lucide-react';
import { VISA_DETAILS } from '../../../../data/visaDetails';
import { VISA_VARIANTS, getVariants } from '../../../../data/visaVariants';
import SidebarAffiliate from '../../../../components/blog/SidebarAffiliate';
import StickyMobileCta from '../../../../components/StickyMobileCta';

interface RouteParams { params: Promise<{ slug: string; variant: string }> }

export function generateStaticParams() {
  const all: { slug: string; variant: string }[] = [];
  for (const [slug, vars] of Object.entries(VISA_VARIANTS)) {
    for (const v of vars) all.push({ slug, variant: v.id });
  }
  return all;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug, variant } = await params;
  const visa = VISA_DETAILS[slug as keyof typeof VISA_DETAILS];
  const v = getVariants(slug).find((x) => x.id === variant);
  if (!visa || !v) return { title: 'Sub-route not found' };
  const title = `${visa.title} — ${v.label} (2026)`;
  const description = `${v.headline}. ${v.eligibilityHighlights[0] ?? ''} Updated 8 April 2026, sourced from gov.uk.`;
  return {
    title, description,
    alternates: { canonical: `/visa/${slug}/${variant}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/visa/${slug}/${variant}`, type: 'article' },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Work: '#d9152b', Study: '#2563eb', Family: '#7c3aed', Visit: '#0891b2',
};

export default async function VariantPage({ params }: RouteParams) {
  const { slug, variant } = await params;
  const visa = VISA_DETAILS[slug as keyof typeof VISA_DETAILS];
  const v = getVariants(slug).find((x) => x.id === variant);
  if (!visa || !v) notFound();

  const accent = CATEGORY_COLORS[visa.category] ?? '#d9152b';
  const otherVariants = getVariants(slug).filter((x) => x.id !== variant);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${visa.title} — ${v.label}`,
    description: v.headline,
    datePublished: '2026-04-08', dateModified: '2026-05-19',
    author: { '@type': 'Organization', name: 'UK Visa Info' },
    publisher: { '@type': 'Organization', name: 'UK Visa Info' },
    mainEntityOfPage: `https://ukvisainfo.co.uk/visa/${slug}/${variant}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#0e1b3f] to-[#13204a] pt-[100px] md:pt-[120px] pb-12 md:pb-14">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none blur-[120px]" style={{ background: `${accent}26` }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link href={`/visa/${slug}`} className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm font-medium mb-6 transition-colors duration-100">
            <ArrowLeft className="w-4 h-4" /> {visa.title} overview
          </Link>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-[0.12em] mb-4" style={{ background: `${accent}28`, color: '#ffffff' }}>
            <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: accent }} /> {visa.category} · sub-route
          </span>

          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold leading-[1.04] tracking-[-0.025em]">
            {visa.title}<br className="hidden sm:block" />
            <span className="text-white/55">{v.label}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-white/65 text-base md:text-[1.0625rem] leading-relaxed">
            {v.headline}
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {typeof v.feeAmount === 'number' && (
              <Pill icon={Banknote} label="Application fee" value={`£${v.feeAmount.toLocaleString('en-GB')}`} />
            )}
            {typeof v.ihsAdult === 'number' && v.ihsAdult > 0 && (
              <Pill icon={ShieldCheck} label="IHS (adult)" value={`£${v.ihsAdult}/yr`} />
            )}
            {v.duration && <Pill icon={Calendar} label="Duration" value={v.duration} />}
            {typeof v.yearsToIlr === 'number' && (
              <Pill icon={Clock} label="To ILR" value={`${v.yearsToIlr} yr${v.yearsToIlr === 1 ? '' : 's'}`} />
            )}
          </div>
        </div>
      </header>

      <div className="bg-[#fafbfd]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-10">

            <main className="col-span-12 lg:col-span-8 space-y-5">

              {/* Eligibility */}
              <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-1.5">01 · Eligibility</div>
                <h2 className="font-display text-[1.375rem] md:text-[1.625rem] font-bold text-[#0a1530] tracking-[-0.015em] leading-tight mb-5">
                  Are you eligible for the {v.label.toLowerCase()} route?
                </h2>
                <ul className="space-y-2.5">
                  {v.eligibilityHighlights.map((line, i) => (
                    <li key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-[#fafbfd]">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                      <span className="text-[14.5px] text-[#1a2240] leading-[1.6]">{line}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Notes */}
              {v.notes && v.notes.length > 0 && (
                <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-1.5">02 · Watch out for</div>
                  <h2 className="font-display text-[1.375rem] font-bold text-[#0a1530] tracking-[-0.015em] mb-5">
                    Key conditions
                  </h2>
                  <ul className="space-y-2.5">
                    {v.notes.map((note, i) => (
                      <li key={i} className="flex gap-3 items-start p-3.5 rounded-xl bg-gradient-to-br from-[#fff7ed] to-[#fffbeb] border border-[#fde68a]">
                        <span className="text-[#d97706] text-lg leading-none mt-0.5">!</span>
                        <span className="text-[14px] text-[#78350f] leading-[1.6]">{note}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Other variants */}
              {otherVariants.length > 0 && (
                <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-1.5">03 · Other sub-routes</div>
                  <h2 className="font-display text-[1.375rem] font-bold text-[#0a1530] tracking-[-0.015em] mb-5">
                    Compare with other {visa.title} routes
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {otherVariants.map((o) => (
                      <li key={o.id}>
                        <Link href={`/visa/${slug}/${o.id}`} className="group flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0a1530] transition-colors duration-100">
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aa3b8]">Sub-route</div>
                            <div className="text-[13.5px] font-semibold text-[#0a1530] group-hover:text-[#d9152b] transition-colors duration-100 truncate">
                              {o.label}
                            </div>
                            <div className="text-[11.5px] text-[#7a8195] mt-0.5">{o.headline}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] mt-1 flex-shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Apply CTA */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-7 md:p-9">
                <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: `${accent}40` }} />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="max-w-md">
                    <h3 className="font-display text-white text-[1.25rem] md:text-[1.5rem] font-bold leading-tight tracking-[-0.015em]">
                      Ready to apply on the {v.label.toLowerCase()} route?
                    </h3>
                    <p className="mt-2 text-white/55 text-[13.5px]">Use the official gov.uk application — free, no signup, no agents.</p>
                  </div>
                  <a
                    href={visa.applyUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] transition-colors duration-100"
                  >
                    Apply on gov.uk <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[100px] space-y-4">

                {/* Cost preview */}
                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}13`, color: accent }}>
                      <Calculator className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="text-[13.5px] font-bold text-[#0a1530] leading-tight">Full cost</div>
                      <div className="text-[11px] text-[#7a8195]">Pre-filled for this variant</div>
                    </div>
                  </div>
                  <Link
                    href={`/tools/cost-calculator?visa=${slug}&variant=${variant}`}
                    className="block text-center text-white font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity duration-100 text-[12.5px]"
                    style={{ background: accent }}
                  >
                    💰 Open calculator →
                  </Link>
                  <div className="mt-3 pt-3 border-t border-[rgba(14,20,36,0.06)] flex items-center justify-center gap-1.5 text-[10.5px] text-[#10b981] font-semibold">
                    <ShieldCheck className="w-3 h-3" /> gov.uk verified
                  </div>
                </div>

                <SidebarAffiliate tags={[visa.category, visa.title]} />

                <a
                  href={v.source}
                  target="_blank" rel="noopener noreferrer"
                  className="block rounded-2xl bg-[#fafbfd] border border-[rgba(14,20,36,0.05)] p-4 hover:border-[#0a1530] transition-colors duration-100"
                >
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12px] text-[#52596e] leading-snug">All figures on this page verified against the gov.uk page below on 19 May 2026.</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#d9152b]">
                    Open gov.uk source <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta context={`${visa.category} · ${v.label}`} label="Open cost calculator" href={`/tools/cost-calculator?visa=${slug}&variant=${variant}`} />
    </>
  );
}

function Pill({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.12] rounded-2xl px-3.5 py-2 backdrop-blur-sm">
      <Icon className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45 leading-none mb-1">{label}</div>
        <div className="text-[13px] font-semibold text-white leading-none truncate max-w-[160px]">{value}</div>
      </div>
    </div>
  );
}
