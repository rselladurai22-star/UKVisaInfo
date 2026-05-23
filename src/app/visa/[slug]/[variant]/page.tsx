import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ExternalLink, ShieldCheck, Calculator,
  CheckCircle2, Banknote, Clock, Calendar, AlertTriangle,
} from 'lucide-react';
import { VISA_DETAILS } from '../../../../data/visaDetails';
import { VISA_VARIANTS, getVariants } from '../../../../data/visaVariants';
import SidebarAffiliate from '../../../../components/blog/SidebarAffiliate';
import StickyMobileCta from '../../../../components/StickyMobileCta';

const INK     = '#1A1F36';
const CREAM   = '#FCFCFD';
const PAPER   = '#FFFFFF';
const EMERALD = '#635BFF';
const GOLD    = '#5851DB';
const SLATE   = '#3C4257';
const MUTED   = '#697386';
const HAIR    = '#E3E8EE';

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

export default async function VariantPage({ params }: RouteParams) {
  const { slug, variant } = await params;
  const visa = VISA_DETAILS[slug as keyof typeof VISA_DETAILS];
  const v = getVariants(slug).find((x) => x.id === variant);
  if (!visa || !v) notFound();

  const otherVariants = getVariants(slug).filter((x) => x.id !== variant);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${visa.title} — ${v.label}`,
    description: v.headline,
    datePublished: '2026-04-08', dateModified: '2026-05-19',
    author: { '@type': 'Organization', name: 'UKDesk' },
    publisher: { '@type': 'Organization', name: 'UKDesk' },
    mainEntityOfPage: `https://ukvisainfo.co.uk/visa/${slug}/${variant}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO — Editorial Premium cream */}
      <header className="relative isolate overflow-hidden pt-[100px] md:pt-[120px] pb-14 md:pb-16"
              style={{ background: CREAM }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none"
             style={{
               background:
                 'radial-gradient(ellipse at 12% 8%, rgba(99,91,255,0.06) 0px, transparent 55%),' +
                 'radial-gradient(ellipse at 88% 80%, rgba(88,81,219,0.05) 0px, transparent 55%)',
             }} />
        <div aria-hidden className="absolute inset-0 opacity-[0.22] pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle, rgba(26,31,54,0.10) 1px, transparent 1px)',
               backgroundSize: '32px 32px',
               maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)',
               WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)',
             }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link href={`/visa/${slug}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-6 transition-colors"
                style={{ color: SLATE }}>
            <ArrowLeft className="w-4 h-4" /> {visa.title} overview
          </Link>

          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10.5px] font-bold uppercase mb-5"
                style={{
                  background: 'rgba(99,91,255,0.08)',
                  color: EMERALD,
                  border: '1px solid rgba(99,91,255,0.18)',
                  letterSpacing: '0.18em',
                }}>
            <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: EMERALD }} />
            {visa.category} · sub-route
          </span>

          <h1 style={{
            fontFamily: '"Inter Tight", Inter, sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.025em',
            color: INK,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}>
            {visa.title}<br className="hidden sm:block" />
            <span style={{ fontStyle: 'italic', color: EMERALD }}>{v.label}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] md:text-[18px] leading-[1.6]"
             style={{ color: SLATE }}>
            {v.headline}
          </p>

          {/* Pill row — paper white facts */}
          <div className="mt-8 flex flex-wrap gap-3">
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

      <div style={{ background: CREAM }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">

            <main className="col-span-12 lg:col-span-8 space-y-6">

              {/* 01 Eligibility */}
              <section className="rounded-3xl p-7 md:p-8"
                       style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)' }}>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: GOLD }}>
                  01 — Eligibility
                </p>
                <h2 style={{
                  fontFamily: '"Inter Tight", Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.05,
                  color: INK,
                  marginBottom: 24,
                  textWrap: 'balance' as React.CSSProperties['textWrap'],
                }}>
                  Are you eligible for the {v.label.toLowerCase()} route?
                </h2>
                <ul className="space-y-3">
                  {v.eligibilityHighlights.map((line, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 rounded-xl"
                        style={{ background: CREAM, border: `1px solid ${HAIR}` }}>
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: EMERALD }} />
                      <span className="text-[14.5px] leading-[1.6]" style={{ color: INK }}>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 02 Notes */}
              {v.notes && v.notes.length > 0 && (
                <section className="rounded-3xl p-7 md:p-8"
                         style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)' }}>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: GOLD }}>
                    02 — Watch out for
                  </p>
                  <h2 style={{
                    fontFamily: '"Inter Tight", Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 24,
                    letterSpacing: '-0.022em',
                    color: INK,
                    marginBottom: 20,
                  }}>
                    Key conditions
                  </h2>
                  <ul className="space-y-3">
                    {v.notes.map((note, i) => (
                      <li key={i} className="flex gap-3 items-start p-4 rounded-xl"
                          style={{ background: '#FBF6E7', border: '1px solid rgba(88,81,219,0.30)' }}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                        <span className="text-[14px] leading-[1.65]" style={{ color: '#3F2E0A' }}>{note}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 03 Other variants */}
              {otherVariants.length > 0 && (
                <section className="rounded-3xl p-7 md:p-8"
                         style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)' }}>
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: GOLD }}>
                    03 — Other sub-routes
                  </p>
                  <h2 style={{
                    fontFamily: '"Inter Tight", Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 24,
                    letterSpacing: '-0.022em',
                    color: INK,
                    marginBottom: 20,
                  }}>
                    Compare with other {visa.title} routes
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {otherVariants.map((o) => (
                      <li key={o.id}>
                        <Link href={`/visa/${slug}/${o.id}`}
                              className="group flex items-start gap-3 p-4 rounded-xl transition-colors"
                              style={{ background: CREAM, border: `1px solid ${HAIR}` }}>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                              Sub-route
                            </div>
                            <div className="leading-tight mt-1 truncate"
                                 style={{
                                   fontFamily: '"Inter Tight", Inter, sans-serif',
                                   fontWeight: 600,
                                   fontSize: 15,
                                   letterSpacing: '-0.015em',
                                   color: INK,
                                 }}>
                              {o.label}
                            </div>
                            <div className="text-[12px] mt-1 leading-snug" style={{ color: SLATE }}>{o.headline}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 mt-1 flex-shrink-0" style={{ color: MUTED }} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Apply CTA — ink */}
              <div className="relative rounded-3xl overflow-hidden p-8 md:p-10"
                   style={{ background: INK, color: CREAM }}>
                <div aria-hidden className="absolute inset-0 opacity-[0.10] pointer-events-none"
                     style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                <div aria-hidden className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full pointer-events-none"
                     style={{ background: 'rgba(99,91,255,0.28)', filter: 'blur(60px)' }} />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="max-w-md">
                    <h3 className="leading-tight"
                        style={{
                          fontFamily: '"Inter Tight", Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: 'clamp(1.4rem, 2.6vw, 1.85rem)',
                          letterSpacing: '-0.028em',
                          color: CREAM,
                        }}>
                      Ready to apply on the <span style={{ fontStyle: 'italic', color: '#A7F3D0' }}>{v.label.toLowerCase()}</span> route?
                    </h3>
                    <p className="mt-3 text-[14px]" style={{ color: 'rgba(250,250,247,0.65)' }}>
                      Use the official gov.uk application — free, no signup, no agents.
                    </p>
                  </div>
                  <a href={visa.applyUrl} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 font-semibold px-5 py-3.5 rounded-xl text-[14px] active:scale-[0.98] transition-all"
                     style={{ background: CREAM, color: INK }}>
                    Apply on gov.uk <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[140px] space-y-4">

                {/* Cost preview */}
                <div className="rounded-3xl p-5"
                     style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 14px -8px rgba(26,31,54,0.08)' }}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(99,91,255,0.10)', color: EMERALD }}>
                      <Calculator className="w-4 h-4" />
                    </span>
                    <div>
                      <div style={{
                        fontFamily: '"Inter Tight", Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: 15,
                        letterSpacing: '-0.015em',
                        color: INK,
                        lineHeight: 1.15,
                      }}>
                        Full cost
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>
                        Pre-filled for this variant
                      </div>
                    </div>
                  </div>
                  <Link href={`/tools/cost-calculator?visa=${slug}&variant=${variant}`}
                        className="block text-center text-[13px] font-semibold py-3 rounded-xl transition-colors"
                        style={{ background: INK, color: CREAM }}>
                    Open calculator →
                  </Link>
                  <div className="mt-4 pt-3 flex items-center justify-center gap-1.5 text-[10.5px] font-semibold"
                       style={{ borderTop: `1px solid ${HAIR}`, color: EMERALD }}>
                    <ShieldCheck className="w-3 h-3" /> gov.uk verified
                  </div>
                </div>

                <SidebarAffiliate tags={[visa.category, visa.title]} />

                <a href={v.source} target="_blank" rel="noopener noreferrer"
                   className="block rounded-2xl p-4 transition-colors"
                   style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2 flex items-center gap-1.5"
                       style={{ color: EMERALD }}>
                    <ShieldCheck className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12.5px] leading-[1.6]" style={{ color: SLATE }}>
                    All figures on this page verified against the gov.uk page below on 19 May 2026.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: EMERALD }}>
                    Open gov.uk source <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta
        context={`${visa.category} · ${v.label}`}
        label="Open cost calculator"
        href={`/tools/cost-calculator?visa=${slug}&variant=${variant}`}
        accent={EMERALD}
      />
    </>
  );
}

function Pill({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
         style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: EMERALD }} />
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] leading-none mb-1" style={{ color: MUTED }}>
          {label}
        </div>
        <div className="leading-none truncate max-w-[180px] tabular-nums"
             style={{
               fontFamily: '"Inter Tight", Inter, sans-serif',
               fontWeight: 600,
               fontSize: 14,
               letterSpacing: '-0.015em',
               color: INK,
             }}>
          {value}
        </div>
      </div>
    </div>
  );
}
