import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, CheckCircle2, FileText, Sparkles, Clock,
  Banknote, ShieldCheck, Calendar, ArrowRight, AlertCircle, Briefcase,
  Globe2, MessageCircle, Star, Info,
} from 'lucide-react';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { VISA_FAQS } from '../../../data/visaFaqs';
import VisaTabNav from '../../../components/visa/VisaTabNav';
import VisaFaq from '../../../components/visa/VisaFaq';
import RelatedBlogToVisa from '../../../components/RelatedBlogToVisa';
import StickyMobileCta from '../../../components/StickyMobileCta';

interface RouteParams { params: Promise<{ slug: string }> }

const CATEGORY_COLORS: Record<string, string> = {
  Work: '#d9152b', Study: '#2563eb', Family: '#7c3aed', Visit: '#0891b2',
};

export function generateStaticParams() {
  return Object.keys(VISA_DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) return { title: 'Visa not found' };
  const title = `${v.title} 2026 — Fees, Eligibility & How to Apply`;
  const description = `${v.summary} Fee: ${v.fee}. IHS: ${v.ihs}. Processing: ${v.processing.outside} (outside UK). Updated ${v.updated}.`;
  return {
    title, description,
    alternates: { canonical: `/visa/${slug}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/visa/${slug}`, type: 'article' },
  };
}

export default async function VisaPage({ params }: RouteParams) {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) notFound();

  const faqs = VISA_FAQS[slug] ?? [];
  const accent = CATEGORY_COLORS[v.category] ?? '#d9152b';

  const tabs = [
    { id: 'overview',    label: 'Overview' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'costs',       label: 'Costs' },
    { id: 'documents',   label: 'Documents' },
    { id: 'process',     label: 'How to apply' },
    ...(v.notes?.length ? [{ id: 'notes', label: 'Key notes' }] : []),
    ...(faqs.length ? [{ id: 'faq', label: 'FAQ' }] : []),
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: v.title, description: v.summary,
    datePublished: '2026-04-01', dateModified: '2026-04-23',
    author: { '@type': 'Organization', name: 'UK Visa Info' },
    publisher: { '@type': 'Organization', name: 'UK Visa Info' },
    mainEntityOfPage: `https://ukvisainfo.co.uk/visa/${slug}`,
  };
  const faqJsonLd = faqs.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question', name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* ═══════════════════════
          HERO
      ═══════════════════════ */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#0e1b3f] to-[#13204a] pt-[100px] md:pt-[120px] pb-12 md:pb-16">
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px]"
          style={{ background: `${accent}26` }} />
        <div className="absolute -bottom-32 -left-24 w-[400px] h-[400px] rounded-full bg-[#2563eb]/10 blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/visa-types"
            className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm font-medium mb-6 transition-colors duration-100"
          >
            <ArrowLeft className="w-4 h-4" />
            All visa routes
          </Link>

          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            {/* Left: title block */}
            <div className="col-span-12 md:col-span-8">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-[0.12em]"
                  style={{ background: `${accent}28`, color: '#ffffff' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: accent }} />
                  {v.category} visa
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.14] text-white/65 text-[10.5px] font-bold uppercase tracking-[0.1em]">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-[#34d399] opacity-65 animate-ping" />
                    <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#34d399]" />
                  </span>
                  Updated {v.updated}
                </span>
              </div>

              <h1 className="font-display text-white text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] font-bold leading-[1.04] tracking-[-0.025em]">
                {v.title}
              </h1>
              <p className="mt-4 text-white/65 text-base md:text-[1.0625rem] leading-relaxed max-w-2xl">
                {v.tagline}
              </p>

              {/* Quick fact pills */}
              <div className="mt-7 flex flex-wrap gap-2.5">
                <FactPill icon={Banknote}    label="From" value={shortFee(v.fee)} accent={accent} />
                <FactPill icon={ShieldCheck} label="IHS"  value={v.ihs} accent={accent} />
                <FactPill icon={Clock}       label="Processing" value={v.processing.outside} accent={accent} />
                <FactPill icon={Calendar}    label="Duration" value={shortDuration(v.duration)} accent={accent} />
              </div>
            </div>

            {/* Right: apply CTA on desktop */}
            <div className="col-span-12 md:col-span-4 hidden md:block">
              <a
                href={v.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl bg-white p-5 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] transition-shadow duration-200"
              >
                <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-2">
                  Official application
                </div>
                <div className="flex items-center gap-2 text-[#0a1530] font-display font-bold text-[18px] leading-tight mb-2">
                  Apply on gov.uk
                  <ExternalLink className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-[12px] text-[#52596e] leading-snug">
                  Direct link to the Home Office application form.
                </p>
                <div className="mt-4 pt-4 border-t border-[rgba(14,20,36,0.06)] flex items-center justify-between text-[11px] text-[#7a8195]">
                  <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#10b981]" /> Verified gov.uk URL</span>
                  <span>Free</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <VisaTabNav tabs={tabs} accent={accent} />

      {/* ═══════════════════════
          CONTENT — 2-column layout
      ═══════════════════════ */}
      <div className="bg-[#fafbfd]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-10">

            {/* MAIN ── */}
            <main className="col-span-12 lg:col-span-8 space-y-5 md:space-y-6">

              {/* Overview */}
              <Section id="overview" eyebrow="01 · Overview" title={`What is the ${v.title}?`} accent={accent}>
                <p className="text-[#1a2240] text-[16px] md:text-[17px] leading-[1.7] mb-6">
                  {v.summary}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 border-t border-[rgba(14,20,36,0.06)]">
                  <MiniStat label="Fee from" value={shortFee(v.fee)} accent={accent} />
                  <MiniStat label="Health charge" value={v.ihs} accent={accent} />
                  <MiniStat label="Decision in" value={v.processing.outside} accent={accent} />
                  <MiniStat label="Length" value={shortDuration(v.duration)} accent={accent} />
                </div>
              </Section>

              {/* Eligibility */}
              <Section id="eligibility" eyebrow="02 · Eligibility" title="Are you eligible?" accent={accent}>
                <p className="text-[#52596e] text-[14.5px] leading-relaxed mb-6">
                  You must meet <strong className="text-[#0a1530]">all</strong> of these criteria to apply.
                </p>
                <ul className="space-y-2.5">
                  {v.eligibility.map((item, i) => (
                    <li
                      key={i}
                      className="group flex gap-3 items-start p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-[#fafbfd] hover:border-[rgba(14,20,36,0.12)] hover:bg-white transition-colors duration-150"
                    >
                      <span
                        className="mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: '#dcfce7', color: '#15803d' }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                      <span className="text-[#1a2240] text-[14.5px] leading-[1.6] flex-1">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Costs */}
              <Section id="costs" eyebrow="03 · Costs" title="What it costs in 2026" accent={accent}>
                <p className="text-[#52596e] text-[14.5px] leading-relaxed mb-6">
                  Two compulsory costs apply to every applicant. Extras (priority service, dependants) sit on top.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  <CostCard
                    icon={Banknote}
                    title="Application fee"
                    value={v.fee}
                    note="Paid online when you submit your application."
                    accent={accent}
                    primary
                  />
                  <CostCard
                    icon={ShieldCheck}
                    title="Health surcharge (IHS)"
                    value={v.ihs}
                    note="Annual NHS access fee, paid upfront for the visa's duration."
                    accent={accent}
                  />
                </div>
                <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 md:p-5 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#f59e0b] text-white flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </span>
                  <div className="text-[13.5px] text-[#78350f] leading-snug">
                    <strong className="text-[#92400e]">Extras to budget for:</strong> priority service (£500),
                    super-priority (£1,000), dependants (full fee + IHS each), biometrics (varies by country).
                  </div>
                </div>
              </Section>

              {/* Documents */}
              <Section id="documents" eyebrow="04 · Documents" title="What you'll need to provide" accent={accent}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {v.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[rgba(14,20,36,0.12)] transition-colors duration-100"
                    >
                      <span
                        className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${accent}13`, color: accent }}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[#1a2240] text-[13.5px] leading-snug flex-1">{doc}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Process */}
              <Section id="process" eyebrow="05 · How to apply" title="Step-by-step" accent={accent}>
                <ol className="relative pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute left-[17px] top-4 bottom-4 w-px"
                    style={{ background: `linear-gradient(to bottom, ${accent}55, rgba(10,21,48,0.12), ${accent}55)` }}
                  />
                  {v.steps.map((s, i) => (
                    <li key={i} className="relative pl-12 pb-7 last:pb-0">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 w-[34px] h-[34px] rounded-full bg-white border-2 font-display font-bold text-[14px] flex items-center justify-center shadow-[0_2px_10px_rgba(14,20,36,0.08)]"
                        style={{ borderColor: accent, color: accent }}
                      >
                        {i + 1}
                      </span>
                      <h4 className="font-display text-[1.0625rem] md:text-[1.1875rem] font-bold text-[#0a1530] leading-tight mb-1.5">
                        {s.title}
                      </h4>
                      <p className="text-[#52596e] text-[14.5px] leading-[1.65]">{s.desc}</p>
                    </li>
                  ))}
                </ol>
              </Section>

              {/* Key notes */}
              {v.notes && v.notes.length > 0 && (
                <Section id="notes" eyebrow="06 · Key notes" title="Things to watch out for" accent={accent}>
                  <ul className="space-y-2.5">
                    {v.notes.map((note, i) => (
                      <li
                        key={i}
                        className="flex gap-3 items-start p-4 rounded-xl bg-gradient-to-br from-[#fff7ed] to-[#fffbeb] border border-[#fde68a]"
                      >
                        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#d97706]" />
                        <span className="text-[#78350f] text-[14.5px] leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* FAQ */}
              {faqs.length > 0 && (
                <Section id="faq" eyebrow="07 · FAQ" title="Common questions" accent={accent}>
                  <VisaFaq faqs={faqs} />
                </Section>
              )}

              {/* Bottom CTA */}
              <div className="mt-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-7 md:p-9">
                <div
                  className="absolute inset-0 opacity-[0.2] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                  style={{ background: `${accent}40` }} />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="max-w-md">
                    <h3 className="font-display text-white text-[1.25rem] md:text-[1.5rem] font-bold leading-tight tracking-[-0.015em]">
                      Ready to apply for the {v.title}?
                    </h3>
                    <p className="mt-2 text-white/55 text-[13.5px] leading-relaxed">
                      Use the official gov.uk link to start your application. Free, no signup, no agents.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={v.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] active:scale-[0.98] transition-[background,transform] duration-150"
                    >
                      Apply on gov.uk <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link
                      href="/eligibility"
                      className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.14] text-white font-semibold px-5 py-3 rounded-xl text-sm hover:bg-white/[0.13] transition-colors duration-100"
                    >
                      Check eligibility <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <RelatedBlogToVisa visaSlug={slug} />
            </main>

            {/* SIDEBAR ── */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[124px] space-y-4">

                {/* Quick facts */}
                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(14,20,36,0.06)]">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}13`, color: accent }}>
                      <Info className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8]">
                      Quick facts
                    </div>
                  </div>
                  <dl className="space-y-3">
                    <FactRow label="Category" value={`${v.category} route`} icon={Briefcase} />
                    <FactRow label="Application fee" value={v.fee} icon={Banknote} />
                    <FactRow label="Health surcharge" value={v.ihs} icon={ShieldCheck} />
                    <FactRow label="Outside UK" value={v.processing.outside} icon={Clock} />
                    <FactRow label="Inside UK" value={v.processing.inside} icon={Clock} />
                    <FactRow label="Duration" value={v.duration} icon={Calendar} />
                  </dl>
                </div>

                {/* Apply CTA */}
                <a
                  href={v.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl p-5 text-white relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] opacity-70 mb-1.5">
                      Apply now
                    </div>
                    <div className="font-display font-bold text-[18px] leading-tight">
                      Go to gov.uk
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold group-hover:gap-2.5 transition-[gap] duration-100">
                      Start application <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </a>

                {/* Solicitor lead form */}
                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-[#dcfce7] text-[#15803d] flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="text-[13.5px] font-bold text-[#0a1530] leading-tight">
                        Talk to a solicitor
                      </div>
                      <div className="text-[11px] text-[#7a8195]">Free 15-min consultation</div>
                    </div>
                  </div>
                  <p className="text-[12.5px] text-[#52596e] leading-snug mb-3">
                    Get expert review from a UK OISC-regulated immigration solicitor before you apply.
                  </p>
                  <Link
                    href="/eligibility"
                    className="block text-center bg-[#0a1530] text-white text-[12.5px] font-bold py-2.5 rounded-xl hover:bg-[#13204a] transition-colors duration-100"
                  >
                    Get matched with a solicitor →
                  </Link>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[10.5px] text-[#9aa3b8]">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-[#ffbf47] text-[#ffbf47]" />)}
                    <span className="ml-1">Trusted by 2,400+ applicants</span>
                  </div>
                </div>

                {/* Trust signal */}
                <div className="rounded-2xl bg-[#fafbfd] border border-[rgba(14,20,36,0.05)] p-4">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-2 flex items-center gap-1.5">
                    <Globe2 className="w-3 h-3" />
                    Source
                  </div>
                  <p className="text-[12px] text-[#52596e] leading-snug">
                    All figures verified against the official Home Office Immigration Rules and gov.uk fee
                    pages. Updated <strong className="text-[#0a1530]">{v.updated}</strong>.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta
        context={`${v.category} visa`}
        label={`Apply on gov.uk`}
        href={v.applyUrl}
        external
        accent={accent}
      />

      {/* Print stylesheet — clean output for offline reference */}
      <style>{`
        @media print {
          nav, header[class*="fixed"], aside, .sticky,
          [class*="StickyMobileCta"], [aria-label="Pagination"],
          [aria-label="Share"], [aria-label="Section navigation"] {
            display: none !important;
          }
          a[href]::after { content: " (" attr(href) ")"; font-size: 10pt; color: #555; }
          a[href^="#"]::after, a[href^="/"]::after { content: ""; }
          body { background: white !important; color: #000 !important; }
          h1, h2, h3, h4 { page-break-after: avoid; color: #000 !important; }
          section { page-break-inside: avoid; }
          .grid { display: block !important; }
          [class*="bg-gradient"], [class*="bg-["] { background: white !important; color: #000 !important; }
          [class*="text-white"] { color: #000 !important; }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function Section({
  id, eyebrow, title, accent, children,
}: {
  id: string; eyebrow: string; title: string; accent: string; children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-32 rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-8 shadow-[0_2px_12px_rgba(10,21,48,0.04)]"
    >
      <div className="mb-6 pb-5 border-b border-[rgba(14,20,36,0.06)]">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: accent }}>
          {eyebrow}
        </div>
        <h2 className="font-display text-[1.5rem] md:text-[1.875rem] font-bold text-[#0a1530] leading-tight tracking-[-0.015em]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function FactPill({
  icon: Icon, label, value, accent,
}: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent: string;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.12] rounded-2xl px-3.5 py-2 backdrop-blur-sm">
      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}30`, color: '#fff' }}>
        <Icon className="w-3.5 h-3.5" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45 leading-none mb-1">
          {label}
        </div>
        <div className="text-[13px] font-semibold text-white leading-none truncate max-w-[160px]">
          {value}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9aa3b8] mb-1">{label}</div>
      <div className="text-[14.5px] font-bold text-[#0a1530] leading-tight" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function CostCard({
  icon: Icon, title, value, note, accent, primary,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; value: string; note: string; accent: string; primary?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 ${
        primary
          ? 'text-white'
          : 'bg-[#f7f9fd] border border-[rgba(14,20,36,0.05)]'
      }`}
      style={primary ? { background: `linear-gradient(135deg, ${accent}, ${accent}d8)` } : undefined}
    >
      {primary && (
        <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${primary ? 'bg-white/20' : ''}`}
            style={primary ? {} : { background: `${accent}13`, color: accent }}
          >
            <Icon className={`w-4 h-4 ${primary ? 'text-white' : ''}`} />
          </span>
          <div className={`text-[10.5px] font-bold uppercase tracking-[0.12em] ${primary ? 'text-white/65' : 'text-[#9aa3b8]'}`}>
            {title}
          </div>
        </div>
        <div className={`font-display font-bold text-[1.5rem] md:text-[1.625rem] leading-tight tracking-[-0.015em] tabular-nums ${primary ? 'text-white' : 'text-[#0a1530]'}`}>
          {value}
        </div>
        <p className={`mt-2 text-[12px] leading-snug ${primary ? 'text-white/70' : 'text-[#52596e]'}`}>
          {note}
        </p>
      </div>
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
      <dt className="flex items-center gap-2 text-[12px] text-[#7a8195] font-medium flex-shrink-0">
        <Icon className="w-3 h-3" />
        {label}
      </dt>
      <dd className="text-[12.5px] font-semibold text-[#0a1530] text-right tabular-nums">{value}</dd>
    </div>
  );
}

function shortFee(fee: string): string {
  // "£827 – £1,636 (outside UK)" → "£827"
  const m = fee.match(/£[\d,]+/);
  return m ? m[0] : fee;
}

function shortDuration(dur: string): string {
  // Keep first phrase before semicolon or comma
  return dur.split(/[;,]/)[0].trim();
}
