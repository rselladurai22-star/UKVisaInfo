import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, CheckCircle2, Clock, Banknote, ShieldCheck,
  Calendar, ArrowRight, Briefcase, MessageCircle, Star, Calculator,
  Wallet, Stethoscope, Building2, Globe, IdCard, AlertTriangle,
} from 'lucide-react';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { VISA_FAQS } from '../../../data/visaFaqs';
import VisaTabNav from '../../../components/visa/VisaTabNav';
import VisaFaq from '../../../components/visa/VisaFaq';
import VisaStickyBar from '../../../components/visa/VisaStickyBar';
import SettlementCostStack from '../../../components/visa/SettlementCostStack';
import VariantPicker from '../../../components/visa/VariantPicker';
import RelatedBlogToVisa from '../../../components/RelatedBlogToVisa';
import StickyMobileCta from '../../../components/StickyMobileCta';
import { SETTLEMENT_BREAKDOWNS } from '../../../data/settlementFees';
import { getVariants } from '../../../data/visaVariants';

interface RouteParams { params: Promise<{ slug: string }> }

const CATEGORY_ACCENT: Record<string, string> = {
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

/* Auto-categorise documents into 4 buckets for the grid */
function categoriseDocuments(docs: string[]) {
  const buckets: { id: string; label: string; icon: typeof IdCard; items: string[] }[] = [
    { id: 'identity', label: 'Identity', icon: IdCard, items: [] },
    { id: 'finance',  label: 'Finance',  icon: Wallet,    items: [] },
    { id: 'sponsor',  label: 'Sponsor / Course', icon: Building2, items: [] },
    { id: 'health',   label: 'Health & qualifications', icon: Stethoscope, items: [] },
  ];
  for (const d of docs) {
    const low = d.toLowerCase();
    if (/passport|biometric|brp|evisa|share code|nationality|certificate of birth|birth certificate|adoption|marriage|civil partnership|grandparent/i.test(low))
      buckets[0].items.push(d);
    else if (/bank|payslip|p60|tax|hmrc|salary|maintenance|funds|savings|sa302|finance/i.test(low))
      buckets[1].items.push(d);
    else if (/cas|cos|sponsor|certificate of sponsorship|certificate of acceptance|employer|letter|offer|course|institution|reference number|endorsement/i.test(low))
      buckets[2].items.push(d);
    else if (/tb test|tuberculosis|english|ielts|selt|atas|life in the uk|qualification|degree|gmc|nmc|hcpc|criminal record|dbs|police|registration|cv/i.test(low))
      buckets[3].items.push(d);
    else
      buckets[2].items.push(d);
  }
  return buckets.filter((b) => b.items.length > 0);
}

export default async function VisaPage({ params }: RouteParams) {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) notFound();

  const faqs = VISA_FAQS[slug] ?? [];
  const accent = CATEGORY_ACCENT[v.category] ?? '#d9152b';
  const variants = getVariants(slug);
  const docGroups = categoriseDocuments(v.documents);

  const headlineFee = (v.fee.match(/£[\d,]+/) ?? ['—'])[0];
  const shortDuration = v.duration.split(/[;,]/)[0].trim();

  const tabs = [
    { id: 'overview',    label: 'Overview' },
    ...(variants.length ? [{ id: 'variants', label: 'Sub-routes' }] : []),
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'costs',       label: 'Costs' },
    { id: 'documents',   label: 'Documents' },
    { id: 'process',     label: 'How to apply' },
    ...(v.notes?.length ? [{ id: 'notes', label: 'Key notes' }] : []),
    ...(faqs.length ? [{ id: 'faq', label: 'FAQ' }] : []),
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: v.title, description: v.summary,
    datePublished: '2026-04-08', dateModified: '2026-05-19',
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

      <VisaStickyBar title={v.title} fee={v.fee} applyUrl={v.applyUrl} accent={accent} slug={slug} />

      <div className="bg-[#f8f9fa] relative">
        {/* Subtle ambient dot pattern across the whole page */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(118,119,126,0.18) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '-12px -12px',
            opacity: 0.18,
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-4 md:px-10 pt-[88px] md:pt-[104px]">

          {/* ── Back link ─────────────────────────── */}
          <div className="pt-8 pb-2">
            <Link
              href="/visa-types"
              className="inline-flex items-center gap-1.5 text-[#45464d] hover:text-[#101a36] text-[13.5px] font-medium transition-colors duration-100"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ArrowLeft className="w-4 h-4" />
              All visa routes
            </Link>
          </div>

          {/* ══════════════════════════════════════════
              HERO — bento grid (title L, stat cards R)
          ══════════════════════════════════════════ */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-6 pb-16">
            <div className="lg:col-span-7 space-y-6">
              {/* Pills row */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded"
                  style={{ background: '#e1e3e4', color: '#45464d', fontFamily: 'Inter, sans-serif' }}
                >
                  {v.category} route
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#00714d', fontFamily: 'Inter, sans-serif' }}
                >
                  <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                  Verified · {v.updated}
                </span>
                <a
                  href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded text-[#45464d] hover:text-[#101a36] transition-colors"
                  style={{ background: '#f3f4f5', fontFamily: 'Inter, sans-serif' }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  gov.uk source
                </a>
              </div>

              {/* Display headline */}
              <h1
                className="font-bold text-[#101a36] tracking-[-0.02em]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  lineHeight: '1.05',
                }}
              >
                {v.title}
              </h1>

              {/* Tagline */}
              <p className="text-[#45464d] text-[17px] md:text-[18px] leading-[1.55] max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                {v.tagline}
              </p>

              {/* CTAs — rectangular soft corners */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={v.applyUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#101a36] text-white text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#1a2444] active:scale-[0.98] transition-all duration-100"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Apply on gov.uk
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link
                  href={`/tools/cost-calculator?visa=${slug}`}
                  className="inline-flex items-center gap-2 bg-white text-[#101a36] border border-[#101a36] text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#f3f4f5] transition-colors duration-100"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Calculator className="w-4 h-4" />
                  Calculate full cost
                </Link>
              </div>
            </div>

            {/* Bento stat cards (right) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <StatCard label="Fee from" value={headlineFee} accent={accent} />
              <StatCard label="Decision in" value={v.processing.outside} />
              <StatCard label="Duration" value={shortDuration} sub={v.duration !== shortDuration ? v.duration : undefined} wide />
            </div>
          </section>
        </div>

        {/* Anchor nav */}
        <VisaTabNav tabs={tabs} accent={accent} />

        {/* ══════════════════════════════════════════
            CONTENT
        ══════════════════════════════════════════ */}
        <div className="relative max-w-[1280px] mx-auto px-4 md:px-10 pb-16 md:pb-20 pt-8 md:pt-12">
          <div className="grid grid-cols-12 gap-6 lg:gap-10">

            <main className="col-span-12 lg:col-span-8 space-y-12 md:space-y-16">

              {/* 01 OVERVIEW — accent-bordered card */}
              <Section id="overview" eyebrow="01 · Overview" title={`What is the ${v.title}?`}>
                <div
                  className="bg-white rounded-xl p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]"
                  style={{ borderLeft: `4px solid #101a36`, border: '1px solid #E5E7EB', borderLeftWidth: '4px', borderLeftColor: '#101a36' }}
                >
                  <p className="text-[#191c1d] text-[16px] md:text-[18px] leading-[1.7]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {v.summary}
                  </p>
                </div>
              </Section>

              {/* SUB-ROUTE PICKER */}
              {variants.length > 0 && (
                <section id="variants" className="scroll-mt-32">
                  <VariantPicker variants={variants} visaId={slug} accent={accent} />
                </section>
              )}

              {/* 02 ELIGIBILITY — divided list card */}
              <Section id="eligibility" eyebrow="02 · Eligibility" title="Are you eligible?">
                <p className="text-[#45464d] text-[15px] md:text-[16px] leading-relaxed mb-6 max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                  You must meet <strong className="text-[#101a36] font-semibold">every</strong> condition below — Home Office caseworkers refuse on the first one missed.
                </p>
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)] p-2 md:p-3">
                  <ul className="divide-y divide-[#E5E7EB]">
                    {v.eligibility.map((item, i) => (
                      <li key={i} className="p-4 md:p-5 flex items-start gap-4">
                        <span
                          className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: '#10b981' }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} fill="none" />
                        </span>
                        <span className="text-[#191c1d] text-[15px] md:text-[16px] leading-[1.55] flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              {/* 03 COSTS */}
              <Section id="costs" eyebrow="03 · Costs" title="What it costs in 2026">
                <p className="text-[#45464d] text-[15px] md:text-[16px] leading-relaxed mb-6 max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Two compulsory costs apply: the application fee and the Health Surcharge (IHS). Priority service and dependants sit on top.
                </p>

                {SETTLEMENT_BREAKDOWNS[slug] ? (
                  <SettlementCostStack breakdown={SETTLEMENT_BREAKDOWNS[slug]} calculatorVisaParam={slug} />
                ) : (
                  <CostCard fee={v.fee} ihs={v.ihs} accent={accent} slug={slug} headlineFee={headlineFee} />
                )}
              </Section>

              {/* 04 DOCUMENTS — 2x2 card grid */}
              <Section id="documents" eyebrow="04 · Documents" title="What you'll need to provide">
                <p className="text-[#45464d] text-[15px] md:text-[16px] leading-relaxed mb-6 max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Group your evidence under these four headings. Missing or mis-categorised documents are the second most common refusal reason after salary.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {docGroups.map((group) => {
                    const Icon = group.icon;
                    return (
                      <div
                        key={group.id}
                        className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: '#dae2ff', color: '#101a36' }}
                          >
                            <Icon className="w-[18px] h-[18px]" />
                          </span>
                          <h3
                            className="font-semibold text-[#101a36] text-[18px] tracking-[-0.01em]"
                            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                          >
                            {group.label}
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {group.items.map((doc, i) => (
                            <li
                              key={i}
                              className="text-[#45464d] text-[14.5px] leading-[1.55] flex items-start gap-2.5"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              <span className="mt-2.5 w-1 h-1 rounded-full bg-[#76777e] flex-shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* 05 PROCESS — clean numbered timeline */}
              <Section id="process" eyebrow="05 · How to apply" title="Step-by-step">
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)] p-6 md:p-8">
                  <ol className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute left-[19px] top-4 bottom-4 w-px bg-[#E5E7EB]"
                    />
                    {v.steps.map((s, i) => (
                      <li key={i} className="relative pl-14 pb-6 last:pb-0">
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#101a36] text-white text-[14px] font-bold flex items-center justify-center"
                          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                        >
                          {i + 1}
                        </span>
                        <h4
                          className="font-semibold text-[#101a36] text-[16px] md:text-[17px] leading-tight mb-1.5 tracking-[-0.01em]"
                          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                        >
                          {s.title}
                        </h4>
                        <p className="text-[#45464d] text-[14.5px] md:text-[15px] leading-[1.6]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {s.desc}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </Section>

              {/* 06 NOTES — alert callouts */}
              {v.notes && v.notes.length > 0 && (
                <Section id="notes" eyebrow="06 · Watch out for" title="Things that catch people out">
                  <div className="space-y-3">
                    {v.notes.map((note, i) => (
                      <div
                        key={i}
                        className="bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6 flex items-start gap-4 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]"
                        style={{ borderLeft: '4px solid #D9152B' }}
                      >
                        <span className="w-9 h-9 rounded-full bg-[#fde9ec] text-[#D9152B] flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                        <p className="text-[#191c1d] text-[14.5px] md:text-[15.5px] leading-[1.6]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* 07 FAQ */}
              {faqs.length > 0 && (
                <Section id="faq" eyebrow="07 · FAQ" title="Common questions">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)] p-6 md:p-7">
                    <VisaFaq faqs={faqs} />
                  </div>
                </Section>
              )}

              {/* BOTTOM CTA BANNER — dark navy with emerald action */}
              <div className="relative overflow-hidden bg-[#101a36] rounded-xl p-7 md:p-10">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#dae2ff] rounded-full opacity-10 blur-3xl pointer-events-none" />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="max-w-md">
                    <span
                      className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bcc5e9] mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Ready to apply
                    </span>
                    <h3
                      className="text-white text-[22px] md:text-[28px] font-bold tracking-[-0.01em] leading-tight mb-2"
                      style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                    >
                      Apply for the {v.title} on gov.uk
                    </h3>
                    <p className="text-[#bcc5e9] text-[14px] md:text-[15px] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Free, official, no agents. Bookmark the URL — it's the only place to legally apply.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <a
                      href={v.applyUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#10b981] text-white text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#0ea374] active:scale-[0.98] transition-all duration-100"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Apply on gov.uk
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link
                      href="/eligibility"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors duration-100"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Run eligibility quiz
                    </Link>
                  </div>
                </div>
              </div>

              <RelatedBlogToVisa visaSlug={slug} />
            </main>

            {/* SIDEBAR */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[124px] space-y-4">

                {/* Quick facts card */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
                  <div
                    className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-4 pb-3 border-b border-[#E5E7EB]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Quick facts
                  </div>
                  <dl className="space-y-3">
                    <FactRow label="Category" value={`${v.category} route`} icon={Briefcase} />
                    <FactRow label="Application fee" value={v.fee} icon={Banknote} />
                    <FactRow label="Health surcharge" value={v.ihs} icon={ShieldCheck} />
                    <FactRow label="Decision (out)" value={v.processing.outside} icon={Clock} />
                    <FactRow label="Decision (in)" value={v.processing.inside} icon={Clock} />
                    <FactRow label="Duration" value={v.duration} icon={Calendar} />
                  </dl>
                </div>

                {/* Apply card */}
                <a
                  href={v.applyUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="group block bg-[#101a36] text-white rounded-xl p-5 hover:bg-[#1a2444] transition-colors duration-100"
                >
                  <div
                    className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bcc5e9] mb-1.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Official
                  </div>
                  <div
                    className="font-bold text-[18px] leading-tight"
                    style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                  >
                    Apply on gov.uk
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold group-hover:gap-2.5 transition-[gap] duration-100" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Start application <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>

                {/* Solicitor */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-9 h-9 rounded-full bg-[rgba(16,185,129,0.12)] text-[#00714d] flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-[14px] text-[#101a36] leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                        Talk to a solicitor
                      </div>
                      <div className="text-[11.5px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>Free 15-min consult</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#45464d] leading-[1.55] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Get an OISC-regulated immigration solicitor to review your situation before you apply.
                  </p>
                  <Link
                    href="/eligibility"
                    className="block text-center bg-[#101a36] text-white text-[13px] font-semibold py-2.5 rounded-lg hover:bg-[#1a2444] transition-colors duration-100"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Get matched →
                  </Link>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-[#10b981] text-[#10b981]" />)}
                    <span className="ml-1">2,400+ applicants</span>
                  </div>
                </div>

                {/* Source */}
                <div className="bg-[#f3f4f5] border border-[#E5E7EB] rounded-xl p-4">
                  <div
                    className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2 flex items-center gap-1.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Globe className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12.5px] text-[#45464d] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Every figure verified against the gov.uk fee table effective <strong className="text-[#101a36]">8 April 2026</strong>.
                  </p>
                  <a
                    href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                    target="_blank" rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#101a36] hover:underline"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    View on gov.uk <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta
        context={`${v.category} · Apply`}
        label="Apply on gov.uk"
        href={v.applyUrl}
        external
        accent={accent}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function Section({
  id, eyebrow, title, children,
}: {
  id: string; eyebrow: string; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-bold text-[#101a36] tracking-[-0.015em] leading-[1.15] mb-6"
        style={{
          fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatCard({
  label, value, sub, wide, accent,
}: {
  label: string; value: string; sub?: string; wide?: boolean; accent?: string;
}) {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)] ${wide ? 'col-span-2' : 'col-span-2 sm:col-span-1'}`}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </p>
      <p
        className="font-bold text-[#101a36] tracking-[-0.015em] leading-tight tabular-nums"
        style={{
          fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
          fontSize: wide ? 'clamp(1.25rem, 2.5vw, 1.5rem)' : 'clamp(1.5rem, 3vw, 2rem)',
          color: accent ?? '#101a36',
        }}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[12.5px] text-[#76777e] leading-[1.45]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function FactRow({
  label, value, icon: Icon,
}: {
  label: string; value: string; icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-0.5">
      <dt className="flex items-center gap-2 text-[12px] text-[#76777e] font-medium flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Icon className="w-3 h-3" /> {label}
      </dt>
      <dd className="text-[12.5px] font-semibold text-[#101a36] text-right max-w-[180px] leading-tight tabular-nums" style={{ fontFamily: 'Inter, sans-serif' }}>
        {value}
      </dd>
    </div>
  );
}

/** Non-settlement cost panel — single white card with big fee + IHS + extras */
function CostCard({ fee, ihs, accent, slug, headlineFee }: {
  fee: string; ihs: string; accent: string; slug: string; headlineFee: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
      {/* Headline fee */}
      <div className="p-6 md:p-8 border-b border-[#E5E7EB]">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Application fee
        </p>
        <p
          className="font-bold tabular-nums tracking-[-0.02em] leading-none"
          style={{
            fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
            color: accent,
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          }}
        >
          {headlineFee}
        </p>
        <p className="mt-2 text-[13.5px] text-[#45464d]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {fee}
        </p>
      </div>

      {/* IHS + extras */}
      <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Health surcharge (IHS)
          </p>
          <p className="text-[18px] font-bold text-[#101a36] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            {ihs}
          </p>
          <p className="mt-1.5 text-[12.5px] text-[#76777e] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Paid upfront for the full visa duration — funds NHS access.
          </p>
        </div>
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Optional add-ons
          </p>
          <ul className="space-y-1.5 text-[13.5px] text-[#191c1d] tabular-nums" style={{ fontFamily: 'Inter, sans-serif' }}>
            <li className="flex justify-between gap-3"><span>Priority service</span><span className="font-semibold">+£500</span></li>
            <li className="flex justify-between gap-3"><span>Super-priority</span><span className="font-semibold">+£1,000</span></li>
            <li className="flex justify-between gap-3"><span>Per dependant</span><span className="font-semibold">+full fee + IHS</span></li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 md:px-8 py-4 bg-[#f3f4f5] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] text-[#45464d]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          Every figure verified against gov.uk (8 April 2026).
        </div>
        <Link
          href={`/tools/cost-calculator?visa=${slug}`}
          className="inline-flex items-center gap-1.5 bg-[#101a36] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#1a2444] transition-colors duration-100"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Calculator className="w-3.5 h-3.5" />
          Calculate full cost
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
