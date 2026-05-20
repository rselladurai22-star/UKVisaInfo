import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, CheckCircle2, Clock, Banknote, ShieldCheck,
  Calendar, ArrowRight, MessageCircle, Star, Calculator,
  Wallet, Stethoscope, Building2, Globe, IdCard, AlertTriangle, Sparkles,
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

/* ────────────────────────────────────────────────────────────
   Brand palette references (no off-brand greys here)
   navy   #0A2540   navy-2 #13325F   navy-deep #06192E
   teal   #00C4B4   teal-dark #00A89A
   gold   #C9A14A
   ink    text on white = navy
   muted  = slate-ish #5A6478
─────────────────────────────────────────────────────────────── */

interface RouteParams { params: Promise<{ slug: string }> }

const CATEGORY_META: Record<string, { accent: string; bgTint: string; label: string }> = {
  Work:   { accent: '#00C4B4', bgTint: 'rgba(0,196,180,0.08)',  label: 'Work route' },
  Study:  { accent: '#C9A14A', bgTint: 'rgba(201,161,74,0.10)', label: 'Study route' },
  Family: { accent: '#13325F', bgTint: 'rgba(19,50,95,0.08)',   label: 'Family route' },
  Visit:  { accent: '#0A2540', bgTint: 'rgba(10,37,64,0.06)',   label: 'Visit route' },
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
  const buckets: { id: string; label: string; icon: typeof IdCard; tone: string; items: string[] }[] = [
    { id: 'identity', label: 'Identity',            icon: IdCard,      tone: '#0A2540', items: [] },
    { id: 'finance',  label: 'Finance',             icon: Wallet,      tone: '#C9A14A', items: [] },
    { id: 'sponsor',  label: 'Sponsor / Course',    icon: Building2,   tone: '#00C4B4', items: [] },
    { id: 'health',   label: 'Health & qualifications', icon: Stethoscope, tone: '#13325F', items: [] },
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
  const meta = CATEGORY_META[v.category] ?? CATEGORY_META.Work;
  const accent = meta.accent;
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

      <VisaStickyBar title={v.title} fee={v.fee} applyUrl={v.applyUrl} accent={accent} slug={slug} />

      {/* ═══════════════════════════════════════════════════════════
          HERO — deep navy, editorial, large display title with
          ambient gradient + passport-style edge motif on the right
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#06192E] text-white pt-[88px] md:pt-[104px] pb-16 md:pb-24">
        {/* Aurora */}
        <div aria-hidden className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-[0.22] blur-3xl"
             style={{ background: `radial-gradient(circle at center, ${accent} 0%, transparent 60%)` }} />
        <div aria-hidden className="absolute -bottom-40 -right-32 w-[640px] h-[640px] rounded-full opacity-[0.16] blur-3xl"
             style={{ background: 'radial-gradient(circle at center, #C9A14A 0%, transparent 60%)' }} />
        {/* UK hairlines */}
        <div aria-hidden className="absolute inset-0 opacity-[0.05]"
             style={{
               backgroundImage:
                 'linear-gradient(45deg, transparent 49.5%, #fff 49.5%, #fff 50.5%, transparent 50.5%),' +
                 'linear-gradient(-45deg, transparent 49.5%, #fff 49.5%, #fff 50.5%, transparent 50.5%)',
               backgroundSize: '120px 120px',
             }} />

        <div className="relative max-w-[1280px] mx-auto px-5 md:px-10">
          <div className="pt-4 pb-6">
            <Link
              href="/visa-types"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-[13px] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All visa routes
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              {/* Pill row */}
              <div className="flex flex-wrap items-center gap-2 mb-7">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full"
                  style={{ background: meta.bgTint, color: accent, border: `1px solid ${accent}33` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  {meta.label}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.10em] px-3 py-1.5 rounded-full bg-white/8 text-white/80 border border-white/10">
                  <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                  Verified · {v.updated}
                </span>
                <a
                  href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.10em] px-3 py-1.5 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3" />
                  gov.uk source
                </a>
              </div>

              <h1
                className="font-bold tracking-[-0.025em] leading-[1.02]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)',
                }}
              >
                {v.title}
              </h1>

              <p className="mt-5 text-white/75 text-[17px] md:text-[19px] leading-[1.55] max-w-2xl"
                 style={{ fontFamily: 'Inter, sans-serif' }}>
                {v.tagline}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={v.applyUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#06192E] text-[14px] font-bold px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                    boxShadow: `0 10px 30px -8px ${accent}80, inset 0 1px 0 rgba(255,255,255,0.4)`,
                  }}
                >
                  Apply on gov.uk
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link
                  href={`/tools/cost-calculator?visa=${slug}`}
                  className="inline-flex items-center gap-2 bg-white/8 text-white text-[14px] font-semibold px-6 py-3.5 rounded-xl border border-white/15 hover:bg-white/14 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate full cost
                </Link>
              </div>
            </div>

            {/* Stat trio — premium glassy cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 md:gap-4">
              <HeroStat label="Fee from" value={headlineFee} accent={accent} icon={Banknote} />
              <HeroStat label="Decision" value={v.processing.outside} icon={Clock} />
              <HeroStat label="Duration" value={shortDuration} sub={v.duration !== shortDuration ? v.duration : undefined} wide icon={Calendar} />
            </div>
          </div>
        </div>
      </section>

      {/* Section anchor nav */}
      <VisaTabNav tabs={tabs} accent={accent} />

      {/* ═══════════════════════════════════════════════════════════
          CONTENT
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">

            <main className="col-span-12 lg:col-span-8 space-y-16 md:space-y-24">

              {/* 01 OVERVIEW */}
              <Section number="01" eyebrow="Overview" title={`What is the ${v.title}?`}>
                <div
                  className="relative rounded-2xl p-7 md:p-9 bg-white"
                  style={{
                    boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 10px 40px -16px rgba(10,37,64,0.10)',
                    border: '1px solid rgba(10,37,64,0.06)',
                  }}
                >
                  <span aria-hidden className="absolute left-0 top-7 bottom-7 w-[3px] rounded-full"
                        style={{ background: `linear-gradient(180deg, ${accent}, ${accent}33)` }} />
                  <p className="text-[#0A2540]/85 text-[16px] md:text-[18px] leading-[1.7] pl-5"
                     style={{ fontFamily: 'Inter, sans-serif' }}>
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

              {/* 02 ELIGIBILITY */}
              <Section number="02" eyebrow="Eligibility" title="Are you eligible?">
                <p className="text-[#5A6478] text-[15.5px] md:text-[16.5px] leading-[1.65] mb-7 max-w-2xl"
                   style={{ fontFamily: 'Inter, sans-serif' }}>
                  You must meet <strong className="text-[#0A2540] font-semibold">every</strong> condition below — Home Office caseworkers refuse on the first one missed.
                </p>
                <div
                  className="rounded-2xl bg-white overflow-hidden"
                  style={{
                    boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 10px 40px -16px rgba(10,37,64,0.08)',
                    border: '1px solid rgba(10,37,64,0.06)',
                  }}
                >
                  <ul>
                    {v.eligibility.map((item, i) => (
                      <li
                        key={i}
                        className="px-5 md:px-7 py-4 md:py-5 flex items-start gap-4 border-b border-[rgba(10,37,64,0.06)] last:border-b-0"
                      >
                        <span
                          className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,196,180,0.12)', color: '#00A89A' }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </span>
                        <span className="text-[#0A2540] text-[15px] md:text-[16px] leading-[1.6] flex-1"
                              style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              {/* 03 COSTS */}
              <Section number="03" eyebrow="Costs" title="What it costs in 2026">
                <p className="text-[#5A6478] text-[15.5px] md:text-[16.5px] leading-[1.65] mb-7 max-w-2xl"
                   style={{ fontFamily: 'Inter, sans-serif' }}>
                  Two compulsory costs apply: the application fee and the Health Surcharge (IHS). Priority service and dependants sit on top.
                </p>

                {SETTLEMENT_BREAKDOWNS[slug] ? (
                  <SettlementCostStack breakdown={SETTLEMENT_BREAKDOWNS[slug]} calculatorVisaParam={slug} />
                ) : (
                  <CostCard fee={v.fee} ihs={v.ihs} accent={accent} slug={slug} headlineFee={headlineFee} />
                )}
              </Section>

              {/* 04 DOCUMENTS */}
              <Section number="04" eyebrow="Documents" title="What you'll need to provide">
                <p className="text-[#5A6478] text-[15.5px] md:text-[16.5px] leading-[1.65] mb-7 max-w-2xl"
                   style={{ fontFamily: 'Inter, sans-serif' }}>
                  Group your evidence under these four headings. Missing or mis-categorised documents are the second most common refusal reason after salary.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {docGroups.map((group) => {
                    const Icon = group.icon;
                    return (
                      <div
                        key={group.id}
                        className="relative rounded-2xl bg-white p-6 transition-transform duration-200 hover:-translate-y-0.5"
                        style={{
                          boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 8px 30px -12px rgba(10,37,64,0.10)',
                          border: '1px solid rgba(10,37,64,0.06)',
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[rgba(10,37,64,0.06)]">
                          <span
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${group.tone}15`, color: group.tone }}
                          >
                            <Icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                          </span>
                          <h3
                            className="font-bold text-[#0A2540] text-[16.5px] tracking-[-0.005em]"
                            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                          >
                            {group.label}
                          </h3>
                          <span className="ml-auto text-[11px] font-semibold text-[#5A6478] tabular-nums">
                            {group.items.length}
                          </span>
                        </div>
                        <ul className="space-y-2.5">
                          {group.items.map((doc, i) => (
                            <li
                              key={i}
                              className="text-[#0A2540]/85 text-[14.5px] leading-[1.55] flex items-start gap-2.5"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              <span className="mt-2 w-1 h-1 rounded-full bg-[#5A6478] flex-shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* 05 PROCESS */}
              <Section number="05" eyebrow="How to apply" title="Step-by-step">
                <div
                  className="rounded-2xl bg-white p-7 md:p-9"
                  style={{
                    boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 10px 40px -16px rgba(10,37,64,0.10)',
                    border: '1px solid rgba(10,37,64,0.06)',
                  }}
                >
                  <ol className="relative">
                    <span aria-hidden className="absolute left-[19px] top-4 bottom-4 w-px"
                          style={{ background: `linear-gradient(180deg, ${accent}55, rgba(10,37,64,0.10))` }} />
                    {v.steps.map((s, i) => (
                      <li key={i} className="relative pl-14 pb-7 last:pb-0">
                        <span
                          aria-hidden
                          className="absolute left-0 top-0 w-10 h-10 rounded-full text-white text-[13px] font-bold flex items-center justify-center tabular-nums"
                          style={{
                            background: 'linear-gradient(135deg, #0A2540, #13325F)',
                            boxShadow: `0 4px 12px -2px ${accent}50, inset 0 1px 0 rgba(255,255,255,0.1)`,
                            fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h4
                          className="font-bold text-[#0A2540] text-[16.5px] md:text-[17.5px] leading-tight mb-2 tracking-[-0.005em]"
                          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                        >
                          {s.title}
                        </h4>
                        <p className="text-[#0A2540]/75 text-[15px] md:text-[15.5px] leading-[1.65]"
                           style={{ fontFamily: 'Inter, sans-serif' }}>
                          {s.desc}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </Section>

              {/* 06 NOTES */}
              {v.notes && v.notes.length > 0 && (
                <Section number="06" eyebrow="Watch out for" title="Things that catch people out">
                  <div className="space-y-3">
                    {v.notes.map((note, i) => (
                      <div
                        key={i}
                        className="relative rounded-2xl bg-white p-5 md:p-6 flex items-start gap-4 overflow-hidden"
                        style={{
                          boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 8px 30px -16px rgba(10,37,64,0.08)',
                          border: '1px solid rgba(201,161,74,0.30)',
                        }}
                      >
                        <span aria-hidden className="absolute left-0 top-0 bottom-0 w-1"
                              style={{ background: 'linear-gradient(180deg, #C9A14A, #E6B450)' }} />
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(201,161,74,0.12)', color: '#C9A14A' }}>
                          <AlertTriangle className="w-4 h-4" strokeWidth={2.2} />
                        </span>
                        <p className="text-[#0A2540] text-[14.5px] md:text-[15.5px] leading-[1.6]"
                           style={{ fontFamily: 'Inter, sans-serif' }}>
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* 07 FAQ */}
              {faqs.length > 0 && (
                <Section number="07" eyebrow="FAQ" title="Common questions">
                  <div
                    className="rounded-2xl bg-white p-6 md:p-8"
                    style={{
                      boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 10px 40px -16px rgba(10,37,64,0.10)',
                      border: '1px solid rgba(10,37,64,0.06)',
                    }}
                  >
                    <VisaFaq faqs={faqs} />
                  </div>
                </Section>
              )}

              {/* FINAL CTA BANNER */}
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white"
                   style={{ background: 'linear-gradient(135deg, #06192E 0%, #0A2540 55%, #13325F 100%)' }}>
                <div aria-hidden className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
                     style={{ background: `radial-gradient(circle at center, ${accent} 0%, transparent 60%)` }} />
                <div aria-hidden className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
                     style={{ background: 'radial-gradient(circle at center, #C9A14A 0%, transparent 60%)' }} />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-7">
                  <div className="max-w-md">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
                      style={{ color: accent, fontFamily: 'Inter, sans-serif' }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Ready to apply
                    </span>
                    <h3
                      className="text-white text-[24px] md:text-[30px] font-bold tracking-[-0.02em] leading-[1.15] mb-3"
                      style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                    >
                      Apply for the {v.title} on gov.uk
                    </h3>
                    <p className="text-white/70 text-[14.5px] md:text-[15.5px] leading-[1.6]"
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                      Free, official, no agents. Bookmark the URL — it's the only place to legally apply.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <a
                      href={v.applyUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-[#06192E] text-[14px] font-bold px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                        boxShadow: `0 10px 30px -8px ${accent}90, inset 0 1px 0 rgba(255,255,255,0.4)`,
                      }}
                    >
                      Apply on gov.uk
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link
                      href="/eligibility"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 text-[14px] font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
                    >
                      Run eligibility quiz
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
              <div className="lg:sticky lg:top-[124px] space-y-4">

                {/* Quick facts card */}
                <div
                  className="rounded-2xl bg-white p-6"
                  style={{
                    boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 8px 30px -12px rgba(10,37,64,0.10)',
                    border: '1px solid rgba(10,37,64,0.06)',
                  }}
                >
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A6478] mb-5 pb-4 border-b border-[rgba(10,37,64,0.06)]"
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                    Quick facts
                  </div>
                  <dl className="space-y-3.5">
                    <FactRow label="Application fee" value={v.fee} icon={Banknote} accent={accent} />
                    <FactRow label="Health surcharge" value={v.ihs} icon={ShieldCheck} accent={accent} />
                    <FactRow label="Decision (out)" value={v.processing.outside} icon={Clock} accent={accent} />
                    <FactRow label="Decision (in)" value={v.processing.inside} icon={Clock} accent={accent} />
                    <FactRow label="Duration" value={v.duration} icon={Calendar} accent={accent} />
                  </dl>
                </div>

                {/* Apply card — accent gradient */}
                <a
                  href={v.applyUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="group block relative overflow-hidden rounded-2xl p-6 text-white active:scale-[0.99] transition-transform"
                  style={{
                    background: 'linear-gradient(135deg, #06192E 0%, #0A2540 100%)',
                    boxShadow: `0 14px 40px -14px ${accent}60`,
                  }}
                >
                  <div aria-hidden className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-2xl"
                       style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }} />
                  <div className="relative">
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2"
                         style={{ color: accent, fontFamily: 'Inter, sans-serif' }}>
                      Official
                    </div>
                    <div className="font-bold text-[20px] leading-tight tracking-[-0.01em]"
                         style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                      Apply on gov.uk
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold group-hover:gap-3 transition-[gap]"
                         style={{ fontFamily: 'Inter, sans-serif' }}>
                      Start application <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </a>

                {/* Solicitor */}
                <div
                  className="rounded-2xl bg-white p-6"
                  style={{
                    boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 8px 30px -12px rgba(10,37,64,0.10)',
                    border: '1px solid rgba(10,37,64,0.06)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,196,180,0.12)', color: '#00A89A' }}>
                      <MessageCircle className="w-4 h-4" strokeWidth={2.2} />
                    </span>
                    <div>
                      <div className="font-bold text-[14.5px] text-[#0A2540] leading-tight"
                           style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                        Talk to a solicitor
                      </div>
                      <div className="text-[11.5px] text-[#5A6478] mt-0.5"
                           style={{ fontFamily: 'Inter, sans-serif' }}>
                        Free 15-min consult
                      </div>
                    </div>
                  </div>
                  <p className="text-[13.5px] text-[#0A2540]/75 leading-[1.6] mb-4"
                     style={{ fontFamily: 'Inter, sans-serif' }}>
                    Get an OISC-regulated immigration solicitor to review your situation before you apply.
                  </p>
                  <Link
                    href="/eligibility"
                    className="block text-center text-white text-[13px] font-bold py-3 rounded-xl transition-transform active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #0A2540, #13325F)' }}
                  >
                    Get matched →
                  </Link>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#5A6478]"
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-[#C9A14A] text-[#C9A14A]" />)}
                    <span className="ml-1.5">2,400+ applicants</span>
                  </div>
                </div>

                {/* Source */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: 'rgba(10,37,64,0.04)',
                    border: '1px solid rgba(10,37,64,0.06)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A6478] mb-2"
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Globe className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12.5px] text-[#0A2540]/80 leading-[1.55]"
                     style={{ fontFamily: 'Inter, sans-serif' }}>
                    Every figure verified against the gov.uk fee table effective <strong className="text-[#0A2540]">8 April 2026</strong>.
                  </p>
                  <a
                    href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                    target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold hover:underline"
                    style={{ color: accent, fontFamily: 'Inter, sans-serif' }}
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
  number, eyebrow, title, children,
}: {
  number: string; eyebrow: string; title: string; children: React.ReactNode;
}) {
  return (
    <section id={eyebrow.toLowerCase().replace(/\s+/g, '-').replace('how-to-apply', 'process').replace('watch-out-for', 'notes')} className="scroll-mt-32">
      <div className="flex items-baseline gap-4 mb-5">
        <span
          className="font-bold tabular-nums leading-none"
          style={{
            fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            background: 'linear-gradient(135deg, #C9A14A 0%, #E6B450 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {number}
        </span>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5A6478]"
           style={{ fontFamily: 'Inter, sans-serif' }}>
          {eyebrow}
        </p>
      </div>
      <h2
        className="font-bold text-[#0A2540] tracking-[-0.02em] leading-[1.1] mb-7"
        style={{
          fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
          fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function HeroStat({
  label, value, sub, wide, accent, icon: Icon,
}: {
  label: string; value: string; sub?: string; wide?: boolean; accent?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div
      className={`relative rounded-2xl p-5 backdrop-blur-md ${wide ? 'col-span-2' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px -12px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/55 mb-2"
           style={{ fontFamily: 'Inter, sans-serif' }}>
        <Icon className="w-3 h-3" strokeWidth={2.2} />
        {label}
      </div>
      <p
        className="font-bold tracking-[-0.015em] leading-[1.1] tabular-nums text-white"
        style={{
          fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
          fontSize: wide ? 'clamp(1.1rem, 2vw, 1.4rem)' : 'clamp(1.5rem, 3vw, 1.85rem)',
          color: accent ?? '#fff',
        }}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-[12px] text-white/55 leading-[1.5]"
           style={{ fontFamily: 'Inter, sans-serif' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function FactRow({
  label, value, icon: Icon, accent,
}: {
  label: string; value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-2 text-[12px] text-[#5A6478] font-medium flex-shrink-0"
          style={{ fontFamily: 'Inter, sans-serif' }}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
        {label}
      </dt>
      <dd className="text-[12.5px] font-bold text-[#0A2540] text-right max-w-[180px] leading-tight tabular-nums"
          style={{ fontFamily: 'Inter, sans-serif' }}>
        {value}
      </dd>
    </div>
  );
}

function CostCard({ fee, ihs, accent, slug, headlineFee }: {
  fee: string; ihs: string; accent: string; slug: string; headlineFee: string;
}) {
  return (
    <div
      className="rounded-2xl bg-white overflow-hidden"
      style={{
        boxShadow: '0 1px 0 rgba(10,37,64,0.04), 0 10px 40px -16px rgba(10,37,64,0.12)',
        border: '1px solid rgba(10,37,64,0.06)',
      }}
    >
      {/* Headline fee — dark band */}
      <div className="relative p-7 md:p-9 text-white overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #0A2540 0%, #13325F 100%)' }}>
        <div aria-hidden className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-25 blur-3xl"
             style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 60%)` }} />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
             style={{ color: accent, fontFamily: 'Inter, sans-serif' }}>
            Application fee
          </p>
          <p
            className="font-bold tabular-nums tracking-[-0.03em] leading-none"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              color: '#fff',
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            }}
          >
            {headlineFee}
          </p>
          <p className="mt-3 text-[14px] text-white/65"
             style={{ fontFamily: 'Inter, sans-serif' }}>
            {fee}
          </p>
        </div>
      </div>

      <div className="p-7 md:p-9 grid grid-cols-1 sm:grid-cols-2 gap-7 md:gap-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A6478] mb-2"
             style={{ fontFamily: 'Inter, sans-serif' }}>
            Health surcharge (IHS)
          </p>
          <p className="text-[20px] font-bold text-[#0A2540] tabular-nums tracking-[-0.01em]"
             style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            {ihs}
          </p>
          <p className="mt-2 text-[13px] text-[#5A6478] leading-[1.6]"
             style={{ fontFamily: 'Inter, sans-serif' }}>
            Paid upfront for the full visa duration — funds NHS access.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A6478] mb-2"
             style={{ fontFamily: 'Inter, sans-serif' }}>
            Optional add-ons
          </p>
          <ul className="space-y-2 text-[14px] text-[#0A2540] tabular-nums"
              style={{ fontFamily: 'Inter, sans-serif' }}>
            <li className="flex justify-between gap-3"><span className="text-[#5A6478]">Priority service</span><span className="font-bold">+£500</span></li>
            <li className="flex justify-between gap-3"><span className="text-[#5A6478]">Super-priority</span><span className="font-bold">+£1,000</span></li>
            <li className="flex justify-between gap-3"><span className="text-[#5A6478]">Per dependant</span><span className="font-bold">+full fee + IHS</span></li>
          </ul>
        </div>
      </div>

      <div className="px-7 md:px-9 py-5 border-t border-[rgba(10,37,64,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
           style={{ background: 'rgba(10,37,64,0.02)' }}>
        <div className="flex items-center gap-2 text-[12.5px] text-[#5A6478]"
             style={{ fontFamily: 'Inter, sans-serif' }}>
          <ShieldCheck className="w-4 h-4" style={{ color: accent }} />
          Verified against gov.uk (8 April 2026)
        </div>
        <Link
          href={`/tools/cost-calculator?visa=${slug}`}
          className="inline-flex items-center gap-1.5 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl transition-transform active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #0A2540, #13325F)' }}
        >
          <Calculator className="w-3.5 h-3.5" />
          Calculate full cost
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
