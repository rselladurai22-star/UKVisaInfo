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
import ApplicationGuide from '../../../components/visa/ApplicationGuide';
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7">
              {/* Pill row */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.10em] px-3.5 py-1.5 rounded-full"
                  style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  {meta.label}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3.5 py-1.5 rounded-full bg-white/[0.12] text-white border border-white/[0.18]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
                  Verified · {v.updated}
                </span>
                <a
                  href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3.5 py-1.5 rounded-full bg-white/[0.07] text-white/90 hover:text-white hover:bg-white/[0.14] border border-white/[0.15] transition-colors"
                >
                  <ShieldCheck className="w-3 h-3" />
                  gov.uk source
                </a>
              </div>

              <h1
                className="font-bold text-white tracking-[-0.025em] leading-[1.06]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                }}
              >
                {v.title}
              </h1>

              <p className="mt-5 text-white/90 text-[16px] md:text-[18px] leading-[1.65] max-w-2xl"
                 style={{ fontFamily: 'Inter, sans-serif' }}>
                {v.tagline}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={v.applyUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#06192E] text-[14.5px] font-bold px-7 py-3.5 rounded-xl active:scale-[0.98] transition-all"
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
                  className="inline-flex items-center gap-2 bg-white/[0.10] text-white text-[14.5px] font-semibold px-7 py-3.5 rounded-xl border border-white/[0.18] hover:bg-white/[0.18] transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate full cost
                </Link>
              </div>
            </div>

            {/* Stat trio — clearly readable cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 md:gap-4">
              <HeroStat label="Fee from" value={headlineFee} accent={accent} icon={Banknote} />
              <HeroStat label="Decision" value={v.processing.outside} icon={Clock} />
              <HeroStat label="Visa duration" value={shortDuration} sub={v.duration !== shortDuration ? v.duration : undefined} wide icon={Calendar} />
            </div>
          </div>
        </div>
      </section>

      {/* Section anchor nav */}
      <VisaTabNav tabs={tabs} accent={accent} />

      {/* ═══════════════════════════════════════════════════════════
          CONTENT
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-14 md:py-18">
          <div className="grid grid-cols-12 gap-8 lg:gap-14">

            <main className="col-span-12 lg:col-span-8 space-y-14 md:space-y-20">

              {/* 01 OVERVIEW */}
              <Section eyebrow="Overview" title={`What is the ${v.title}?`} accent={accent}>
                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-7 md:p-9"
                  style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.06)' }}>
                  <p className="text-[#0F172A] text-[15.5px] md:text-[16.5px] font-normal leading-[1.82]"
                     style={{ fontFamily: 'Inter, sans-serif' }}>
                    {v.summary}
                  </p>
                  <div className="mt-6 pt-5 border-t border-[#F3F4F6] flex flex-wrap gap-6">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9CA3AF] mb-1.5">Application fee</div>
                      <div className="text-[21px] font-extrabold text-[#0A2540] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans",Inter,sans-serif' }}>{v.fee}</div>
                    </div>
                    <div className="w-px bg-[#E5E7EB]" />
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9CA3AF] mb-1.5">IHS surcharge</div>
                      <div className="text-[21px] font-extrabold text-[#0A2540] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans",Inter,sans-serif' }}>{v.ihs}</div>
                    </div>
                    <div className="w-px bg-[#E5E7EB]" />
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9CA3AF] mb-1.5">Decision (outside UK)</div>
                      <div className="text-[21px] font-extrabold text-[#0A2540] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans",Inter,sans-serif' }}>{v.processing.outside}</div>
                    </div>
                    <div className="w-px bg-[#E5E7EB]" />
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9CA3AF] mb-1.5">Visa duration</div>
                      <div className="text-[21px] font-extrabold text-[#0A2540] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans",Inter,sans-serif' }}>{shortDuration}</div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* SUB-ROUTE PICKER */}
              {variants.length > 0 && (
                <section id="variants" className="scroll-mt-28">
                  <VariantPicker variants={variants} visaId={slug} accent={accent} />
                </section>
              )}

              {/* 02 ELIGIBILITY */}
              <Section eyebrow="Eligibility" title="Are you eligible?" accent={accent}>
                <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[13.5px] font-normal text-amber-900 leading-[1.65]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    You must meet <strong className="font-bold">every</strong> condition below. The Home Office refuses on the first missed requirement.
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden"
                  style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.06)' }}>
                  <ul className="divide-y divide-[#F3F4F6]">
                    {v.eligibility.map((item, i) => (
                      <li key={i} className="px-6 py-5 flex items-start gap-4">
                        <span className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12.5px] font-extrabold text-white"
                          style={{ background: accent, fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                          {i + 1}
                        </span>
                        <span className="text-[#0F172A] text-[15px] font-normal leading-[1.72] flex-1"
                              style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              {/* 03 COSTS */}
              <Section eyebrow="Costs" title="What it costs in 2026" accent={accent}>
                <p className="text-[#475569] text-[14.5px] font-normal leading-[1.72] mb-6 max-w-2xl"
                   style={{ fontFamily: 'Inter, sans-serif' }}>
                  Two compulsory costs: the application fee and the Immigration Health Surcharge (IHS). Priority and dependants are added on top.
                </p>

                {SETTLEMENT_BREAKDOWNS[slug] ? (
                  <SettlementCostStack breakdown={SETTLEMENT_BREAKDOWNS[slug]} calculatorVisaParam={slug} />
                ) : (
                  <CostCard fee={v.fee} ihs={v.ihs} accent={accent} slug={slug} headlineFee={headlineFee} />
                )}
              </Section>

              {/* 04 DOCUMENTS */}
              <Section eyebrow="Documents" title="What you'll need to provide" accent={accent}>
                <p className="text-[#475569] text-[14.5px] font-normal leading-[1.72] mb-6 max-w-2xl"
                   style={{ fontFamily: 'Inter, sans-serif' }}>
                  Group your evidence under these headings. Mis-categorised or missing documents are the second most common refusal reason.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {docGroups.map((group) => {
                    const Icon = group.icon;
                    return (
                      <div key={group.id}
                        className="rounded-2xl bg-white border border-[#E5E7EB] p-6"
                        style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.05)' }}>
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F3F4F6]">
                          <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${group.tone}18`, color: group.tone }}>
                            <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                          </span>
                          <h3 className="font-extrabold text-[#0A2540] text-[14.5px] flex-1"
                            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                            {group.label}
                          </h3>
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full text-white"
                            style={{ background: group.tone, fontFamily: 'Inter, sans-serif' }}>
                            {group.items.length}
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {group.items.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: group.tone }} />
                              <span className="text-[#334155] text-[13.5px] font-normal leading-[1.58]"
                                    style={{ fontFamily: 'Inter, sans-serif' }}>
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

              {/* 05 PROCESS — gov.uk-style differentiated guide */}
              <Section eyebrow="How to apply" title="Step-by-step application guide" accent={accent}>
                <p className="text-[#475569] text-[14.5px] font-normal leading-[1.72] mb-6 max-w-2xl"
                   style={{ fontFamily: 'Inter, sans-serif' }}>
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
                  accent={accent}
                />
              </Section>

              {/* 06 NOTES */}
              {v.notes && v.notes.length > 0 && (
                <Section eyebrow="Common pitfalls" title="Things that catch people out" accent={accent}>
                  <div className="space-y-3">
                    {v.notes.map((note, i) => (
                      <div key={i}
                        className="rounded-2xl bg-white border border-amber-200 p-5 md:p-6 flex items-start gap-4"
                        style={{ boxShadow: '0 2px 8px rgba(201,161,74,0.08)' }}>
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(201,161,74,0.12)', color: '#C9A14A' }}>
                          <AlertTriangle className="w-4 h-4" strokeWidth={2.2} />
                        </span>
                        <p className="text-[#0F172A] text-[14.5px] font-normal leading-[1.68]"
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
                <Section eyebrow="FAQ" title="Common questions" accent={accent}>
                  <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 md:p-8"
                    style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.06)' }}>
                    <VisaFaq faqs={faqs} />
                  </div>
                </Section>
              )}

              {/* FINAL CTA BANNER */}
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white"
                   style={{ background: 'linear-gradient(135deg, #06192E 0%, #0A2540 55%, #13325F 100%)' }}>
                <div aria-hidden className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
                     style={{ background: `radial-gradient(circle at center, ${accent} 0%, transparent 60%)` }} />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-7">
                  <div className="max-w-md">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] mb-3"
                      style={{ color: accent, fontFamily: 'Inter, sans-serif' }}>
                      <Sparkles className="w-3 h-3" />
                      Ready to apply
                    </span>
                    <h3 className="text-white text-[22px] md:text-[28px] font-bold tracking-[-0.02em] leading-[1.2] mb-3"
                      style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                      Apply for the {v.title} on gov.uk
                    </h3>
                    <p className="text-white/80 text-[15px] leading-[1.65]"
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                      Free, official, no agents required. Bookmark the URL — it&#39;s the only place to legally apply.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <a href={v.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-[#06192E] text-[14.5px] font-bold px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all"
                      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 10px 30px -8px ${accent}90` }}>
                      Apply on gov.uk <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link href="/eligibility"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 text-[14.5px] font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors">
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
              <div className="lg:sticky lg:top-[100px] space-y-4">

                {/* Quick facts card */}
                <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden"
                  style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.07)' }}>
                  <div className="px-5 py-3.5 border-b border-[#F3F4F6] flex items-center gap-2.5"
                    style={{ background: `${accent}0c` }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
                    <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em]"
                      style={{ color: accent, fontFamily: 'Inter, sans-serif' }}>At a glance</span>
                  </div>
                  <dl className="divide-y divide-[#F9FAFB]">
                    <FactRow label="Application fee" value={v.fee} icon={Banknote} accent={accent} />
                    <FactRow label="Health surcharge (IHS)" value={v.ihs} icon={ShieldCheck} accent={accent} />
                    <FactRow label="Decision (outside UK)" value={v.processing.outside} icon={Clock} accent={accent} />
                    <FactRow label="Decision (inside UK)" value={v.processing.inside} icon={Clock} accent={accent} />
                    <FactRow label="Duration" value={v.duration} icon={Calendar} accent={accent} />
                  </dl>
                </div>

                {/* Apply CTA */}
                <a href={v.applyUrl} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-2xl p-5 text-white transition-all active:scale-[0.99]"
                  style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`, boxShadow: `0 8px 30px -8px ${accent}66` }}>
                  <div>
                    <div className="text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-white/75 mb-1">Official application</div>
                    <div className="font-extrabold text-[17px] leading-tight text-white"
                      style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                      Apply on gov.uk
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/90 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Solicitor */}
                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5"
                  style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.05)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,196,180,0.12)', color: '#00A89A' }}>
                      <MessageCircle className="w-4 h-4" strokeWidth={2.2} />
                    </span>
                    <div>
                      <div className="font-bold text-[14px] text-[#0A2540] leading-tight"
                           style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                        Talk to a solicitor
                      </div>
                      <div className="text-[12px] text-[#6B7280] mt-0.5">Free 15-min consultation</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#374151] leading-[1.6] mb-4">
                    Get an OISC-regulated immigration solicitor to review your case before you apply.
                  </p>
                  <Link href="/eligibility"
                    className="block text-center text-white text-[13.5px] font-bold py-2.5 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #0A2540, #13325F)' }}>
                    Get matched →
                  </Link>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[11.5px] text-[#6B7280]">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-[#C9A14A] text-[#C9A14A]" />)}
                    <span className="ml-1.5">2,400+ applicants helped</span>
                  </div>
                </div>

                {/* Source note */}
                <div className="rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#0369A1]">gov.uk verified</span>
                  </div>
                  <p className="text-[12.5px] text-[#0C4A6E] leading-[1.6]">
                    All fees verified against gov.uk effective <strong>8 April 2026</strong>.
                  </p>
                  <a href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                    target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#0284C7] hover:underline">
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
        accent={accent}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function Section({
  eyebrow, title, children, accent,
}: {
  eyebrow: string; title: string; children: React.ReactNode; accent: string;
}) {
  const sectionId = eyebrow.toLowerCase()
    .replace(/\s+/g, '-')
    .replace('how-to-apply', 'process')
    .replace('common-pitfalls', 'notes');
  return (
    <section id={sectionId} className="scroll-mt-28">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="w-[3px] h-[18px] rounded-full" style={{ background: accent }} />
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em]"
           style={{ color: accent, fontFamily: 'Inter, sans-serif' }}>
          {eyebrow}
        </p>
      </div>
      <h2 className="font-extrabold text-[#0A2540] tracking-[-0.022em] leading-[1.12] mb-7 text-[23px] md:text-[28px]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
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
    <div className={`rounded-2xl p-5 ${wide ? 'col-span-2' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(10px)',
      }}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-white/70 mb-3"
           style={{ fontFamily: 'Inter, sans-serif' }}>
        <Icon className="w-3 h-3" strokeWidth={2.5} />
        {label}
      </div>
      <p className="font-extrabold tracking-[-0.02em] leading-[1.05] tabular-nums"
        style={{
          fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
          fontSize: wide ? 'clamp(1.15rem, 2vw, 1.4rem)' : 'clamp(1.5rem, 3vw, 1.85rem)',
          color: accent ?? '#fff',
        }}>
        {value}
      </p>
      {sub && (
        <p className="mt-2 text-[11.5px] text-white/60 leading-[1.45]"
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
    <div className="flex items-start justify-between gap-3 px-5 py-3.5">
      <dt className="flex items-center gap-2 text-[12px] font-medium text-[#64748B] flex-shrink-0"
          style={{ fontFamily: 'Inter, sans-serif' }}>
        <span style={{ color: accent }}><Icon className="w-3.5 h-3.5" strokeWidth={2} /></span>
        {label}
      </dt>
      <dd className="text-[13px] font-extrabold text-[#0A2540] text-right max-w-[200px] leading-snug"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
        {value}
      </dd>
    </div>
  );
}

function CostCard({ fee, ihs, accent, slug, headlineFee }: {
  fee: string; ihs: string; accent: string; slug: string; headlineFee: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.07)' }}>
      {/* Fee header — clean accent band */}
      <div className="px-7 py-6 border-b border-[#F3F4F6]"
        style={{ background: `linear-gradient(90deg, ${accent}0d 0%, transparent 60%)` }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9CA3AF] mb-2"
               style={{ fontFamily: 'Inter, sans-serif' }}>
              Application fee
            </p>
            <p className="font-extrabold tabular-nums tracking-[-0.03em] leading-none text-[#0A2540]"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)' }}>
              {headlineFee}
            </p>
            <p className="mt-2 text-[13px] font-normal text-[#475569]" style={{ fontFamily: 'Inter, sans-serif' }}>{fee}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-full border"
            style={{ background: `${accent}0e`, borderColor: `${accent}30`, color: '#0A2540' }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: accent }} />
            gov.uk verified
          </span>
        </div>
      </div>

      <div className="p-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9CA3AF] mb-2"
             style={{ fontFamily: 'Inter, sans-serif' }}>
            Health Surcharge (IHS)
          </p>
          <p className="text-[24px] font-extrabold text-[#0A2540] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            {ihs}
          </p>
          <p className="mt-1.5 text-[13px] font-normal text-[#475569] leading-[1.65]"
             style={{ fontFamily: 'Inter, sans-serif' }}>
            Paid upfront for the full visa duration — funds NHS access.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9CA3AF] mb-2"
             style={{ fontFamily: 'Inter, sans-serif' }}>
            Optional add-ons
          </p>
          <ul className="space-y-2.5">
            {[
              ['Priority service', '+£500'],
              ['Super-priority', '+£1,000'],
              ['Per dependant', '+full fee + IHS'],
            ].map(([label, val]) => (
              <li key={label} className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-normal text-[#475569]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
                <span className="text-[13px] font-extrabold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{val}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-7 py-4 border-t border-[#F3F4F6] bg-[#FAFAFA]">
        <Link href={`/tools/cost-calculator?visa=${slug}`}
          className="inline-flex items-center gap-2 text-white text-[13.5px] font-bold px-5 py-2.5 rounded-xl transition-all active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 4px 14px -4px ${accent}66` }}>
          <Calculator className="w-4 h-4" />
          Calculate your total cost
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
