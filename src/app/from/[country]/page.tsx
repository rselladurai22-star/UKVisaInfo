import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, MapPin, FileText, AlertCircle, CheckCircle2,
  Sparkles, Globe2, ShieldCheck, ExternalLink, BookOpen, Building2,
} from 'lucide-react';
import { COUNTRIES, getCountry } from '../../../data/countries';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { BLOG_POSTS } from '../../../data/blog';
import StickyMobileCta from '../../../components/StickyMobileCta';

interface RouteParams { params: Promise<{ country: string }> }

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({ country }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { country } = await params;
  const c = getCountry(country);
  if (!c) return { title: 'Country guide not found', robots: { index: false, follow: true } };
  const title = `UK Visa for ${c.demonym} Citizens, 2026 Complete Guide`;
  const description = `Apply for a UK visa from ${c.name}. Visa routes, fees, document checklist, TB test requirements, biometrics and processing times, updated for 2026. 100% gov.uk sourced.`;
  const ogImageUrl = `https://ukvisainfo.co.uk/og-default.png`;
  // Stub country pages don't carry enough unique editorial value to index.
  // They remain crawlable for users but are excluded from search results.
  const isStub = c.status !== 'full';
  return {
    title, description,
    alternates: { canonical: `/from/${country}` },
    openGraph: {
      title, description,
      url: `https://ukvisainfo.co.uk/from/${country}`,
      type: 'article',
      publishedTime: '2026-04-01',
      modifiedTime: '2026-05-15',
      authors: ['https://ukvisainfo.co.uk'],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title, description,
      images: [ogImageUrl],
    },
    robots: isStub
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true },
  };
}

export default async function CountryPage({ params }: RouteParams) {
  const { country } = await params;
  const c = getCountry(country);
  if (!c) notFound();

  const relatedBlogs = (c.recommendedReads ?? [])
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `UK Visa for ${c.demonym} Citizens, Complete Guide`,
    description: c.tagline,
    datePublished: '2026-04-01',
    dateModified: '2026-05-15',
    author: {
      '@type': 'Organization', name: 'UKDesk',
      url: 'https://ukvisainfo.co.uk',
      logo: { '@type': 'ImageObject', url: 'https://ukvisainfo.co.uk/icon.svg' },
    },
    publisher: {
      '@type': 'Organization', name: 'UKDesk',
      url: 'https://ukvisainfo.co.uk',
      logo: { '@type': 'ImageObject', url: 'https://ukvisainfo.co.uk/icon.svg' },
    },
    mainEntityOfPage: `https://ukvisainfo.co.uk/from/${country}`,
    inLanguage: 'en-GB',
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',           item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Country Guides', item: 'https://ukvisainfo.co.uk/country-guides' },
      { '@type': 'ListItem', position: 3, name: `${c.name} Guide`, item: `https://ukvisainfo.co.uk/from/${country}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* HERO */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0e1b3f] to-[#0F2C4B] pt-[100px] md:pt-[120px] pb-12 md:pb-16">
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#00C4B4]/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#0A2540]/12 blur-[140px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link
            href="/visa-types"
            className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm font-medium mb-6 transition-colors duration-100"
          >
            <ArrowLeft className="w-4 h-4" /> All visa routes
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <div className="text-[3.5rem] md:text-[4.5rem] leading-none">{c.flag}</div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A] mb-1.5">
                <Globe2 className="w-3 h-3" />
                Country guide
              </span>
              <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold leading-[1.04] tracking-[-0.025em]">
                UK Visa for {c.demonym} Citizens
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-white/65 text-base md:text-[1.0625rem] leading-relaxed">
            {c.tagline}
          </p>

          {/* Key facts row */}
          <div className="mt-7 flex flex-wrap gap-2.5">
            <KeyFact ok={c.tbTest} okLabel="TB test required" badLabel="No TB test" />
            <KeyFact ok={c.etaRequired} okLabel="ETA needed for visits" badLabel="Full visa always required" />
            <KeyFact ok={true} okLabel={`${c.applicationCentres.length} VFS centres`} />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-10">

            {/* Main */}
            <main className="col-span-12 lg:col-span-8 space-y-5 md:space-y-6">

              <Section eyebrow="Overview" title={`Applying for a UK visa from ${c.name}`}>
                <p className="text-[#1a2240] text-[16px] md:text-[17px] leading-[1.7]">
                  {c.intro}
                </p>
                {c.status === 'stub' && (
                  <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-[#fffbeb] border border-[#fde68a]">
                    <AlertCircle className="w-4 h-4 text-[#C9A14A] flex-shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#78350f] leading-snug">
                      This guide is being expanded. For the most detailed information,
                      see the relevant visa route page linked below or our latest blog guides.
                    </p>
                  </div>
                )}
              </Section>

              <Section eyebrow="Top routes" title={`Best visa routes for ${c.demonym} applicants`}>
                <p className="text-[#52596e] text-[14.5px] leading-relaxed mb-5">
                  The most-used UK visa routes by {c.demonym} applicants, ordered by volume.
                </p>
                <ol className="space-y-3">
                  {c.topRoutes.map((r, i) => {
                    const v = VISA_DETAILS[r.slug];
                    return (
                      <li key={r.slug}>
                        <Link
                          href={`/visa-types/${r.slug}`}
                          className="group flex items-center gap-4 p-4 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0A2540] hover:shadow-[0_8px_24px_rgba(10, 37, 64,0.08)] transition-[border-color,box-shadow] duration-150"
                        >
                          <span className="w-9 h-9 rounded-xl bg-[#0A2540] text-white font-display font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14.5px] font-bold text-[#0A2540] group-hover:text-[#00C4B4] transition-colors duration-100">
                              {r.title}{v ? <span className="text-[#9aa3b8] font-normal"> · from {extractFee(v.fee)}</span> : null}
                            </div>
                            <div className="text-[12.5px] text-[#7a8195] mt-0.5">{r.reason}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#cfd5e0] group-hover:text-[#00C4B4] group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </Section>

              <Section eyebrow="Where to apply" title="Visa application centres">
                <p className="text-[#52596e] text-[14.5px] leading-relaxed mb-5">
                  Biometric enrolment is mandatory. Book your appointment at the closest VFS centre
                  after submitting your online application.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {c.applicationCentres.map((centre) => (
                    <div key={centre} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[rgba(14,20,36,0.05)] text-[13px] text-[#1a2240]">
                      <MapPin className="w-3.5 h-3.5 text-[#00C4B4] flex-shrink-0" />
                      <span className="truncate">{centre}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section eyebrow="What to watch" title={`Country-specific notes for ${c.demonym} applicants`}>
                <ul className="space-y-2.5">
                  {c.notes.map((note, i) => (
                    <li key={i} className="flex gap-3 items-start p-3.5 rounded-xl bg-white border border-[rgba(14,20,36,0.05)]">
                      <span className="mt-0.5 w-5 h-5 rounded-md bg-[#fef3c7] text-[#C9A14A] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3 h-3" />
                      </span>
                      <span className="text-[#1a2240] text-[14px] leading-[1.6]">{note}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {relatedBlogs.length > 0 && (
                <Section eyebrow="Read next" title="Relevant guides">
                  <ul className="space-y-2">
                    {relatedBlogs.map((b) => (
                      <li key={b.slug}>
                        <Link
                          href={`/blog/${b.slug}`}
                          className="group flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0A2540] transition-colors duration-150"
                        >
                          <span className="w-8 h-8 rounded-lg bg-[rgba(0, 196, 180,0.08)] text-[#00C4B4] flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-3.5 h-3.5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-bold text-[#0A2540] group-hover:text-[#00C4B4] transition-colors duration-100 leading-snug">
                              {b.title}
                            </div>
                            <div className="text-[11.5px] text-[#7a8195] mt-0.5">
                              {b.readMinutes} min read
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] flex-shrink-0 mt-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* CTA */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0F2C4B] to-[#1c2c63] p-7 md:p-9">
                <div
                  className="absolute inset-0 opacity-[0.2] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-[#00C4B4]/25 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="max-w-md">
                    <h3 className="font-display text-white text-[1.25rem] md:text-[1.5rem] font-bold leading-tight tracking-[-0.015em]">
                      Not sure which route fits?
                    </h3>
                    <p className="mt-2 text-white/55 text-[13.5px] leading-relaxed">
                      Take our 60-second eligibility quiz to find the right UK visa route based on
                      your situation.
                    </p>
                  </div>
                  <Link
                    href="/eligibility"
                    className="inline-flex items-center gap-2 bg-[#C9A14A] text-[#0A2540] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] active:scale-[0.98] transition-[background,transform] duration-150"
                  >
                    Start eligibility quiz <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[100px] space-y-4">

                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5 shadow-[0_2px_12px_rgba(10, 37, 64,0.04)]">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-3">
                    Quick reference
                  </div>
                  <dl className="space-y-3 text-[13px]">
                    <FactRow label="Country" value={c.name} icon={Globe2} />
                    <FactRow label="Demonym" value={c.demonym} icon={Building2} />
                    <FactRow label="TB test" value={c.tbTest ? 'Required' : 'Not required'} icon={ShieldCheck} />
                    <FactRow label="ETA (short visits)" value={c.etaRequired ? 'Required from 2026' : 'Not applicable'} icon={FileText} />
                    <FactRow label="VFS centres" value={`${c.applicationCentres.length} locations`} icon={MapPin} />
                  </dl>
                </div>

                <Link
                  href="/eligibility"
                  className="group block rounded-2xl bg-gradient-to-br from-[#00C4B4] to-[#009E91] p-5 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] opacity-70 mb-1.5">
                      Find your route
                    </div>
                    <div className="font-display font-bold text-[17px] leading-tight">
                      Take the 60-second quiz
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold group-hover:gap-2.5 transition-[gap] duration-100">
                      Start <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>

                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.05)] p-4">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-2 flex items-center gap-1.5">
                    <Globe2 className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12px] text-[#52596e] leading-snug">
                    Information verified against Home Office Immigration Rules and the gov.uk visa fee schedule.
                    Updated May 2026.
                  </p>
                  <a
                    href="https://www.gov.uk/check-uk-visa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#00C4B4] hover:underline"
                  >
                    gov.uk visa check <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta
        context="Find your route"
        label="Take the 60-second quiz"
        href="/eligibility"
      />
    </>
  );
}

/* ── Subcomponents ────────────────────────────── */

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10, 37, 64,0.04)]">
      <div className="mb-5 pb-4 border-b border-[rgba(14,20,36,0.06)]">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#00C4B4] mb-1.5">
          {eyebrow}
        </div>
        <h2 className="font-display text-[1.375rem] md:text-[1.625rem] font-bold text-[#0A2540] leading-tight tracking-[-0.015em]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function KeyFact({ ok, okLabel, badLabel }: { ok: boolean; okLabel: string; badLabel?: string }) {
  const positive = !!ok;
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${
        positive
          ? 'bg-[#fef3c7]/15 border-[#fde68a]/30 text-[#fef3c7]'
          : 'bg-white/[0.06] border-white/[0.12] text-white/55'
      }`}
    >
      {positive
        ? <AlertCircle className="w-3 h-3 text-[#C9A14A]" />
        : <CheckCircle2 className="w-3 h-3 text-[#34d399]" />}
      {positive ? okLabel : (badLabel ?? okLabel)}
    </div>
  );
}

function FactRow({
  label, value, icon: Icon,
}: {
  label: string; value: string; icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <dt className="flex items-center gap-2 text-[12px] text-[#7a8195] font-medium">
        <Icon className="w-3 h-3" /> {label}
      </dt>
      <dd className="text-[12.5px] font-semibold text-[#0A2540] text-right">{value}</dd>
    </div>
  );
}

function extractFee(fee: string): string {
  const m = fee.match(/£[\d,]+/);
  return m ? m[0] : fee;
}
