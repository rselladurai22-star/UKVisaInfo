import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, CheckCircle2, Clock, Banknote, ShieldCheck,
  Calendar, ArrowRight, MessageCircle, Star, Calculator,
  Wallet, Stethoscope, Building2, IdCard, AlertTriangle, Sparkles,
} from 'lucide-react';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { VISA_FAQS } from '../../../data/visaFaqs';
import VisaTabNav from '../../../components/visa/VisaTabNav';
import VisaFaq from '../../../components/visa/VisaFaq';
import VisaStickyBar from '../../../components/visa/VisaStickyBar';
import SettlementCostStack from '../../../components/visa/SettlementCostStack';
import VariantPicker from '../../../components/visa/VariantPicker';
import ApplicationGuide from '../../../components/visa/ApplicationGuide';
import RelatedBlogToVisa from '../../../components/RelatedBlogToVisa';
import StickyMobileCta from '../../../components/StickyMobileCta';
import { SETTLEMENT_BREAKDOWNS } from '../../../data/settlementFees';
import { getVariants } from '../../../data/visaVariants';

/* ────────────────────────────────────────────────────────────
   Editorial Premium tokens — cream paper, ink, emerald, gold
─────────────────────────────────────────────────────────────── */
const INK     = '#1A1F36';
const CREAM   = '#FCFCFD';
const PAPER   = '#FFFFFF';
const EMERALD = '#635BFF';
const GOLD    = '#5851DB';
const SLATE   = '#3C4257';
const MUTED   = '#697386';
const HAIR    = '#E3E8EE';

interface RouteParams { params: Promise<{ slug: string }> }

const CATEGORY_LABEL: Record<string, string> = {
  Work:   'Work route',
  Study:  'Study route',
  Family: 'Family route',
  Visit:  'Visit route',
};

export function generateStaticParams() {
  return Object.keys(VISA_DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) return { title: 'Visa not found' };
  const title = `${v.title} 2026 — Fees, Eligibility & How to Apply`;
  const description = `${v.summary} Application fee: ${v.fee}. IHS: ${v.ihs}. Processing time: ${v.processing.outside} (outside UK). Updated ${v.updated}. 100% gov.uk sourced.`;
  const ogImageUrl = `https://ukvisainfo.co.uk/visa/${slug}/opengraph-image`;
  return {
    title, description,
    alternates: { canonical: `/visa/${slug}` },
    openGraph: {
      title, description,
      url: `https://ukvisainfo.co.uk/visa/${slug}`,
      type: 'article',
      publishedTime: '2026-04-08',
      modifiedTime: '2026-05-19',
      authors: ['https://ukvisainfo.co.uk'],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title, description,
      images: [ogImageUrl],
    },
  };
}

function categoriseDocuments(docs: string[]) {
  const buckets: { id: string; label: string; icon: typeof IdCard; items: string[] }[] = [
    { id: 'identity', label: 'Identity',                  icon: IdCard,      items: [] },
    { id: 'finance',  label: 'Finance',                   icon: Wallet,      items: [] },
    { id: 'sponsor',  label: 'Sponsor / Course',          icon: Building2,   items: [] },
    { id: 'health',   label: 'Health & qualifications',   icon: Stethoscope, items: [] },
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
  const categoryLabel = CATEGORY_LABEL[v.category] ?? 'UK visa';
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
    headline: v.title,
    description: v.summary,
    datePublished: '2026-04-08',
    dateModified: '2026-05-19',
    author: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
    publisher: {
      '@type': 'Organization', name: 'UKDesk',
      logo: { '@type': 'ImageObject', url: 'https://ukvisainfo.co.uk/icon.svg' },
    },
    image: `https://ukvisainfo.co.uk/visa/${slug}/opengraph-image`,
    mainEntityOfPage: `https://ukvisainfo.co.uk/visa/${slug}`,
    inLanguage: 'en-GB',
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Visa Routes', item: 'https://ukvisainfo.co.uk/visa-types' },
      { '@type': 'ListItem', position: 3, name: v.title,       item: `https://ukvisainfo.co.uk/visa/${slug}` },
    ],
  };
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Apply for a ${v.title}`,
    description: `Step-by-step guide to applying for the ${v.title}. Fee: ${v.fee}. Processing: ${v.processing.outside}.`,
    totalTime: `P${parseInt(v.processing.outside) || 3}W`,
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'GBP', value: (v.fee.match(/[\d,]+/) ?? ['0'])[0].replace(',', '') },
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Check eligibility', text: `Confirm you meet the eligibility criteria for the ${v.title}.`, url: `https://ukvisainfo.co.uk/visa/${slug}#eligibility` },
      { '@type': 'HowToStep', position: 2, name: 'Gather documents',  text: 'Collect all required supporting documents before applying.', url: `https://ukvisainfo.co.uk/visa/${slug}#documents` },
      { '@type': 'HowToStep', position: 3, name: 'Pay the fee',       text: `Pay the application fee (${v.fee}) and IHS surcharge (${v.ihs}).`, url: `https://ukvisainfo.co.uk/visa/${slug}#costs` },
      { '@type': 'HowToStep', position: 4, name: 'Submit online application', text: 'Complete and submit your application on gov.uk.', url: v.applyUrl },
      { '@type': 'HowToStep', position: 5, name: 'Attend biometrics appointment', text: 'Book and attend a biometrics appointment at a UKVCAS centre.' },
      { '@type': 'HowToStep', position: 6, name: 'Await decision', text: `Receive your decision. Standard processing: ${v.processing.outside} (outside UK).` },
    ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <VisaStickyBar title={v.title} fee={v.fee} applyUrl={v.applyUrl} slug={slug} />

      {/* ═══════════════════════════════════════════════════════════
          HERO — cream, editorial, large serif title
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-[100px] md:pt-[120px] pb-14 md:pb-20" style={{ background: CREAM }}>
        {/* Subtle background paint */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
             style={{
               background:
                 'radial-gradient(ellipse at 10% 10%, rgba(99,91,255,0.05) 0px, transparent 55%),' +
                 'radial-gradient(ellipse at 90% 75%, rgba(88,81,219,0.05) 0px, transparent 55%)',
             }} />
        <div aria-hidden className="absolute inset-0 opacity-[0.22] pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle, rgba(26,31,54,0.10) 1px, transparent 1px)',
               backgroundSize: '32px 32px',
               maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)',
               WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)',
             }} />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10">
          {/* Breadcrumb */}
          <div className="pt-2 pb-7">
            <Link
              href="/visa-types"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
              style={{ color: SLATE }}
            >
              <ArrowLeft className="w-4 h-4" />
              All visa routes
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7">
              {/* Pill row */}
              <div className="flex flex-wrap items-center gap-2 mb-7">
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase px-3 py-1.5 rounded-full"
                      style={{
                        background: 'rgba(99,91,255,0.08)',
                        color: EMERALD,
                        border: '1px solid rgba(99,91,255,0.18)',
                        letterSpacing: '0.18em',
                      }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: EMERALD }} />
                  {categoryLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase px-3 py-1.5 rounded-full"
                      style={{
                        background: PAPER,
                        color: INK,
                        border: `1px solid ${HAIR}`,
                        letterSpacing: '0.18em',
                      }}>
                  <CheckCircle2 className="w-3 h-3" style={{ color: EMERALD }} strokeWidth={2.5} />
                  Verified · {v.updated}
                </span>
                <a
                  href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    background: PAPER,
                    color: SLATE,
                    border: `1px solid ${HAIR}`,
                    letterSpacing: '0.18em',
                  }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  gov.uk source
                </a>
              </div>

              {/* Title — Fraunces serif */}
              <h1 style={{
                fontFamily: '"Inter Tight", Inter, sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(1.75rem, 4.5vw, 2.875rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.025em',
                color: INK,
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}>
                {v.title}
              </h1>

              <p className="mt-6 max-w-2xl text-[17px] md:text-[19px] leading-[1.6]"
                 style={{ color: SLATE }}>
                {v.tagline}
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={v.applyUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-xl active:scale-[0.98] transition-all"
                  style={{
                    background: INK,
                    color: CREAM,
                    boxShadow: '0 6px 22px -6px rgba(26,31,54,0.30)',
                  }}
                >
                  Apply on gov.uk
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link
                  href={`/tools/cost-calculator?visa=${slug}`}
                  className="inline-flex items-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-xl transition-colors"
                  style={{
                    background: PAPER,
                    color: INK,
                    border: `1px solid ${HAIR}`,
                  }}
                >
                  <Calculator className="w-4 h-4" />
                  Calculate full cost
                </Link>
              </div>
            </div>

            {/* Stat grid — paper white cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 md:gap-4">
              <HeroStat label="Fee from" value={headlineFee} icon={Banknote} highlight />
              <HeroStat label="Decision" value={v.processing.outside} icon={Clock} />
              <HeroStat label="IHS / yr" value={v.ihs} icon={Stethoscope} />
              <HeroStat label="Duration" value={shortDuration} icon={Calendar} />
            </div>
          </div>
        </div>
      </section>

      {/* Section anchor nav */}
      <VisaTabNav tabs={tabs} />

      {/* ═══════════════════════════════════════════════════════════
          CONTENT
      ═══════════════════════════════════════════════════════════ */}
      <div style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-8 lg:gap-14">

            <main className="col-span-12 lg:col-span-8 space-y-16 md:space-y-20">

              {/* 01 OVERVIEW */}
              <Section eyebrow="01 — Overview" title={`What is the ${v.title}?`}>
                <div className="rounded-3xl p-7 md:p-9"
                  style={{
                    background: PAPER,
                    border: `1px solid ${HAIR}`,
                    boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)',
                  }}>
                  <p className="text-[16px] md:text-[17px] leading-[1.75]" style={{ color: INK }}>
                    {v.summary}
                  </p>
                  <div className="mt-7 pt-6 grid grid-cols-2 md:grid-cols-4 gap-6"
                       style={{ borderTop: `1px solid ${HAIR}` }}>
                    <Inline label="Application fee" value={v.fee} />
                    <Inline label="IHS surcharge" value={v.ihs} />
                    <Inline label="Decision (outside)" value={v.processing.outside} />
                    <Inline label="Duration" value={shortDuration} />
                  </div>
                </div>
              </Section>

              {/* SUB-ROUTE PICKER */}
              {variants.length > 0 && (
                <section id="variants" className="scroll-mt-32">
                  <VariantPicker variants={variants} visaId={slug} />
                </section>
              )}

              {/* 02 ELIGIBILITY */}
              <Section eyebrow="02 — Eligibility" title="Are you eligible?">
                <div className="mb-5 rounded-xl px-5 py-4 flex items-start gap-3"
                     style={{ background: '#FBF6E7', border: '1px solid rgba(88,81,219,0.30)' }}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                  <p className="text-[13.5px] leading-[1.65]" style={{ color: '#5C4A12' }}>
                    You must meet <strong style={{ fontWeight: 700 }}>every</strong> condition below.
                    The Home Office refuses on the first missed requirement.
                  </p>
                </div>
                <div className="rounded-3xl overflow-hidden"
                  style={{
                    background: PAPER,
                    border: `1px solid ${HAIR}`,
                    boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)',
                  }}>
                  <ul>
                    {v.eligibility.map((item, i) => (
                      <li key={i} className="px-7 py-5 flex items-start gap-5"
                          style={{ borderBottom: i < v.eligibility.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
                        <span aria-hidden
                              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[14px] tabular-nums"
                              style={{
                                background: INK,
                                color: CREAM,
                                fontFamily: '"Inter Tight", Inter, sans-serif',
                                fontWeight: 700,
                              }}>
                          {i + 1}
                        </span>
                        <span className="text-[15px] leading-[1.7] flex-1" style={{ color: INK }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              {/* 03 COSTS */}
              <Section eyebrow="03 — Costs" title="What it costs in 2026">
                <p className="text-[15px] leading-[1.7] mb-6 max-w-2xl" style={{ color: SLATE }}>
                  Two compulsory costs: the application fee and the Immigration Health Surcharge (IHS).
                  Priority and dependants are added on top.
                </p>

                {SETTLEMENT_BREAKDOWNS[slug] ? (
                  <SettlementCostStack breakdown={SETTLEMENT_BREAKDOWNS[slug]} calculatorVisaParam={slug} />
                ) : (
                  <CostCard fee={v.fee} ihs={v.ihs} slug={slug} headlineFee={headlineFee} />
                )}
              </Section>

              {/* 04 DOCUMENTS */}
              <Section eyebrow="04 — Documents" title="What you'll need to provide">
                <p className="text-[15px] leading-[1.7] mb-7 max-w-2xl" style={{ color: SLATE }}>
                  Group your evidence under these headings. Mis-categorised or missing documents
                  are the second most common refusal reason.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {docGroups.map((group) => {
                    const Icon = group.icon;
                    return (
                      <div key={group.id}
                        className="rounded-3xl p-6"
                        style={{
                          background: PAPER,
                          border: `1px solid ${HAIR}`,
                          boxShadow: '0 2px 14px -8px rgba(26,31,54,0.08)',
                        }}>
                        <div className="flex items-center gap-3 mb-5 pb-5"
                             style={{ borderBottom: `1px solid ${HAIR}` }}>
                          <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(99,91,255,0.08)', color: EMERALD }}>
                            <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                          </span>
                          <h3 className="flex-1"
                              style={{
                                fontFamily: '"Inter Tight", Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: 18,
                                letterSpacing: '-0.02em',
                                color: INK,
                                lineHeight: 1.15,
                              }}>
                            {group.label}
                          </h3>
                          <span className="text-[11px] font-mono tabular-nums" style={{ color: MUTED }}>
                            {group.items.length}
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {group.items.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: EMERALD }} />
                              <span className="text-[14px] leading-[1.6]" style={{ color: INK }}>
                                {doc}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* 05 PROCESS */}
              <Section eyebrow="05 — How to apply" title="Step-by-step application guide">
                <p className="text-[15px] leading-[1.7] mb-7 max-w-2xl" style={{ color: SLATE }}>
                  Choose your path below. The process is different if you&apos;re applying from outside the UK
                  (entry clearance) versus switching from another visa inside the UK.
                </p>
                <ApplicationGuide
                  slug={slug}
                  title={v.title}
                  category={v.category}
                  fee={v.fee}
                  ihs={v.ihs}
                  applyUrl={v.applyUrl}
                  processing={v.processing}
                  steps={v.steps}
                />
              </Section>

              {/* 06 NOTES */}
              {v.notes && v.notes.length > 0 && (
                <Section eyebrow="06 — Common pitfalls" title="Things that catch people out">
                  <div className="space-y-3">
                    {v.notes.map((note, i) => (
                      <div key={i}
                        className="rounded-2xl p-5 md:p-6 flex items-start gap-4"
                        style={{
                          background: '#FBF6E7',
                          border: '1px solid rgba(88,81,219,0.30)',
                        }}>
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(88,81,219,0.15)', color: GOLD }}>
                          <AlertTriangle className="w-4 h-4" strokeWidth={2.2} />
                        </span>
                        <p className="text-[14.5px] leading-[1.7] flex-1" style={{ color: '#3F2E0A' }}>
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* 07 FAQ */}
              {faqs.length > 0 && (
                <Section eyebrow="07 — FAQ" title="Common questions">
                  <div className="rounded-3xl p-6 md:p-8"
                    style={{
                      background: PAPER,
                      border: `1px solid ${HAIR}`,
                      boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)',
                    }}>
                    <VisaFaq faqs={faqs} />
                  </div>
                </Section>
              )}

              {/* FINAL CTA BANNER */}
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-12"
                   style={{ background: INK, color: CREAM }}>
                <div aria-hidden className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
                     style={{ background: 'rgba(99,91,255,0.28)', filter: 'blur(80px)' }} />
                <div aria-hidden className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full pointer-events-none"
                     style={{ background: 'rgba(88,81,219,0.18)', filter: 'blur(80px)' }} />
                <div aria-hidden className="absolute inset-0 opacity-[0.08] pointer-events-none"
                     style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '22px 22px' }} />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-7">
                  <div className="max-w-md">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-4 inline-flex items-center gap-1.5"
                       style={{ color: '#FDE68A' }}>
                      <Sparkles className="w-3 h-3" />
                      Ready to apply
                    </p>
                    <h3 className="mb-3"
                        style={{
                          fontFamily: '"Inter Tight", Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
                          letterSpacing: '-0.028em',
                          lineHeight: 1.05,
                          color: CREAM,
                        }}>
                      Apply for the <span style={{ fontStyle: 'italic', color: '#A7F3D0' }}>{v.title}</span> on gov.uk
                    </h3>
                    <p className="text-[15px] leading-[1.65]" style={{ color: 'rgba(250,250,247,0.65)' }}>
                      Free, official, no agents required. Bookmark the URL — it&#39;s the only place to legally apply.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <a href={v.applyUrl} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all"
                       style={{ background: CREAM, color: INK }}>
                      Apply on gov.uk <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link href="/eligibility"
                       className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold px-6 py-3.5 rounded-xl transition-colors"
                       style={{ background: 'rgba(250,250,247,0.06)', color: CREAM, border: '1px solid rgba(250,250,247,0.16)' }}>
                      Eligibility quiz
                    </Link>
                  </div>
                </div>
              </div>

              <RelatedBlogToVisa visaSlug={slug} />
            </main>

            {/* ═══════════════════════════════════════════════════════
                SIDEBAR
            ═══════════════════════════════════════════════════════ */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[140px] space-y-4">

                {/* Quick facts card */}
                <div className="rounded-3xl overflow-hidden"
                  style={{
                    background: PAPER,
                    border: `1px solid ${HAIR}`,
                    boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)',
                  }}>
                  <div className="px-6 py-4 flex items-center gap-2.5"
                       style={{ background: 'rgba(99,91,255,0.05)', borderBottom: `1px solid ${HAIR}` }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: EMERALD }} />
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
                          style={{ color: GOLD }}>
                      At a glance
                    </span>
                  </div>
                  <dl>
                    <FactRow label="Application fee" value={v.fee} icon={Banknote} />
                    <FactRow label="Health surcharge (IHS)" value={v.ihs} icon={ShieldCheck} />
                    <FactRow label="Decision (outside UK)" value={v.processing.outside} icon={Clock} />
                    <FactRow label="Decision (inside UK)" value={v.processing.inside} icon={Clock} />
                    <FactRow label="Duration" value={v.duration} icon={Calendar} last />
                  </dl>
                </div>

                {/* Apply CTA */}
                <a href={v.applyUrl} target="_blank" rel="noopener noreferrer"
                   className="group flex items-center justify-between gap-3 rounded-3xl p-5 transition-all active:scale-[0.99]"
                   style={{
                     background: INK,
                     color: CREAM,
                     boxShadow: '0 10px 30px -12px rgba(26,31,54,0.40)',
                   }}>
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-1.5"
                         style={{ color: 'rgba(250,250,247,0.65)' }}>
                      Official application
                    </div>
                    <div style={{
                      fontFamily: '"Inter Tight", Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: 18,
                      letterSpacing: '-0.018em',
                      color: CREAM,
                      lineHeight: 1.15,
                    }}>
                      Apply on gov.uk
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                                style={{ color: '#A7F3D0' }} />
                </a>

                {/* Solicitor */}
                <div className="rounded-3xl p-5"
                     style={{
                       background: PAPER,
                       border: `1px solid ${HAIR}`,
                       boxShadow: '0 2px 14px -8px rgba(26,31,54,0.06)',
                     }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(99,91,255,0.10)', color: EMERALD }}>
                      <MessageCircle className="w-4 h-4" strokeWidth={2.2} />
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
                        Talk to a solicitor
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>
                        Free 15-min consultation
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.6] mb-4" style={{ color: SLATE }}>
                    Get an OISC-regulated immigration solicitor to review your case before you apply.
                  </p>
                  <Link href="/eligibility"
                        className="block text-center text-[13.5px] font-semibold py-2.5 rounded-xl transition-colors"
                        style={{ background: INK, color: CREAM }}>
                    Get matched →
                  </Link>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[11.5px]" style={{ color: MUTED }}>
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3" fill={GOLD} style={{ color: GOLD }} />)}
                    <span className="ml-1.5">2,400+ applicants helped</span>
                  </div>
                </div>

                {/* Source note */}
                <div className="rounded-2xl p-4"
                     style={{ background: 'rgba(99,91,255,0.05)', border: '1px solid rgba(99,91,255,0.18)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: EMERALD }} />
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: EMERALD }}>
                      gov.uk verified
                    </span>
                  </div>
                  <p className="text-[12.5px] leading-[1.6]" style={{ color: '#064E3B' }}>
                    All fees verified against gov.uk effective <strong style={{ fontWeight: 700 }}>8 April 2026</strong>.
                  </p>
                  <a href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                     target="_blank" rel="noopener noreferrer"
                     className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold transition-colors"
                     style={{ color: EMERALD }}>
                    View source <ExternalLink className="w-3 h-3" />
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
        accent={EMERALD}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function Section({
  eyebrow, title, children,
}: {
  eyebrow: string; title: string; children: React.ReactNode;
}) {
  const sectionId = eyebrow.toLowerCase().split('—')[1]?.trim()
    .replace(/\s+/g, '-')
    .replace('how-to-apply', 'process')
    .replace('common-pitfalls', 'notes')
    ?? eyebrow.toLowerCase().replace(/\s+/g, '-');
  return (
    <section id={sectionId} className="scroll-mt-32">
      <p className="eyebrow mb-4" style={{ color: GOLD }}>{eyebrow}</p>
      <h2 className="mb-7"
          style={{
            fontFamily: '"Inter Tight", Inter, sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(1.35rem, 3.2vw, 1.875rem)',
            letterSpacing: '-0.028em',
            lineHeight: 1.05,
            color: INK,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function HeroStat({
  label, value, highlight, icon: Icon,
}: {
  label: string; value: string; highlight?: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
}) {
  return (
    <div className="rounded-2xl p-5"
         style={{
           background: highlight ? INK : PAPER,
           color: highlight ? CREAM : INK,
           border: `1px solid ${highlight ? 'rgba(250,250,247,0.10)' : HAIR}`,
           boxShadow: highlight
             ? '0 8px 26px -10px rgba(26,31,54,0.30)'
             : '0 2px 12px -6px rgba(26,31,54,0.08)',
         }}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
           style={{ color: highlight ? 'rgba(250,250,247,0.65)' : MUTED }}>
        <Icon className="w-3 h-3" strokeWidth={2.5} />
        {label}
      </div>
      <p className="tabular-nums leading-[1.05]"
         style={{
           fontFamily: '"Inter Tight", Inter, sans-serif',
           fontWeight: 700,
           fontSize: 'clamp(1.2rem, 2.4vw, 1.5rem)',
           letterSpacing: '-0.03em',
           color: highlight ? CREAM : INK,
         }}>
        {value}
      </p>
    </div>
  );
}

function FactRow({
  label, value, icon: Icon, last,
}: {
  label: string; value: string; last?: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-6 py-4"
         style={{ borderBottom: last ? 'none' : `1px solid ${HAIR}` }}>
      <dt className="flex items-center gap-2 text-[12.5px] font-medium flex-shrink-0"
          style={{ color: SLATE }}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2} style={{ color: EMERALD }} />
        {label}
      </dt>
      <dd className="text-right max-w-[200px] leading-snug tabular-nums"
          style={{
            fontFamily: '"Inter Tight", Inter, sans-serif',
            fontWeight: 600,
            fontSize: 13.5,
            letterSpacing: '-0.012em',
            color: INK,
          }}>
        {value}
      </dd>
    </div>
  );
}

function Inline({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-1.5" style={{ color: MUTED }}>
        {label}
      </div>
      <div className="tabular-nums leading-[1.1]"
           style={{
             fontFamily: '"Inter Tight", Inter, sans-serif',
             fontWeight: 700,
             fontSize: 19,
             letterSpacing: '-0.022em',
             color: INK,
           }}>
        {value}
      </div>
    </div>
  );
}

function CostCard({ fee, ihs, slug, headlineFee }: {
  fee: string; ihs: string; slug: string; headlineFee: string;
}) {
  return (
    <div className="rounded-3xl overflow-hidden"
         style={{
           background: PAPER,
           border: `1px solid ${HAIR}`,
           boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)',
         }}>
      {/* Fee header */}
      <div className="px-8 py-7" style={{ borderBottom: `1px solid ${HAIR}` }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: GOLD }}>
              Application fee
            </p>
            <p className="tabular-nums leading-none"
               style={{
                 fontFamily: '"Inter Tight", Inter, sans-serif',
                 fontWeight: 700,
                 fontSize: 'clamp(1.75rem, 4.5vw, 2.875rem)',
                 letterSpacing: '-0.028em',
                 color: INK,
               }}>
              {headlineFee}
            </p>
            <p className="mt-3 text-[14px]" style={{ color: SLATE }}>{fee}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(99,91,255,0.08)',
                  border: '1px solid rgba(99,91,255,0.22)',
                  color: EMERALD,
                }}>
            <ShieldCheck className="w-3.5 h-3.5" />
            gov.uk verified
          </span>
        </div>
      </div>

      <div className="px-8 py-7 grid grid-cols-1 sm:grid-cols-2 gap-7">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: MUTED }}>
            Health Surcharge (IHS)
          </p>
          <p className="tabular-nums"
             style={{
               fontFamily: '"Inter Tight", Inter, sans-serif',
               fontWeight: 700,
               fontSize: 28,
               letterSpacing: '-0.028em',
               color: INK,
               lineHeight: 1,
             }}>
            {ihs}
          </p>
          <p className="mt-2 text-[13.5px] leading-[1.6]" style={{ color: SLATE }}>
            Paid upfront for the full visa duration — funds NHS access.
          </p>
        </div>
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: MUTED }}>
            Optional add-ons
          </p>
          <ul className="space-y-3">
            {[
              ['Priority service', '+£500'],
              ['Super-priority',   '+£1,000'],
              ['Per dependant',    '+full fee + IHS'],
            ].map(([label, val]) => (
              <li key={label} className="flex items-center justify-between gap-3 pb-2"
                  style={{ borderBottom: `1px solid ${HAIR}` }}>
                <span className="text-[13.5px]" style={{ color: SLATE }}>{label}</span>
                <span className="text-[13.5px] tabular-nums"
                      style={{
                        fontFamily: '"Inter Tight", Inter, sans-serif',
                        fontWeight: 600,
                        letterSpacing: '-0.012em',
                        color: INK,
                      }}>
                  {val}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-8 py-5" style={{ background: CREAM, borderTop: `1px solid ${HAIR}` }}>
        <Link href={`/tools/cost-calculator?visa=${slug}`}
              className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-5 py-3 rounded-xl transition-all active:scale-[0.98]"
              style={{
                background: INK,
                color: CREAM,
                boxShadow: '0 6px 18px -6px rgba(26,31,54,0.30)',
              }}>
          <Calculator className="w-4 h-4" />
          Calculate your total cost
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
