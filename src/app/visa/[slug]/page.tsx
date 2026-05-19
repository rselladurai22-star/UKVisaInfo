import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, CheckCircle2, Sparkles, Clock,
  Banknote, ShieldCheck, Calendar, ArrowRight,
  Briefcase, MessageCircle, Star, Calculator,
  Wallet, Stethoscope, Building2, Globe, IdCard,
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

/* Categorise documents into 4 visual buckets for the grid */
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
      buckets[2].items.push(d); // default → sponsor bucket
  }
  return buckets.filter((b) => b.items.length > 0);
}

export default async function VisaPage({ params }: RouteParams) {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) notFound();

  const faqs = VISA_FAQS[slug] ?? [];
  const accent = CATEGORY_COLORS[v.category] ?? '#d9152b';
  const variants = getVariants(slug);
  const docGroups = categoriseDocuments(v.documents);

  const shortFee = (v.fee.match(/£[\d,]+/) ?? ['—'])[0];
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

      {/* Slides down on scroll past hero */}
      <VisaStickyBar title={v.title} fee={v.fee} applyUrl={v.applyUrl} accent={accent} slug={slug} />

      {/* ═══════════════════════════════════════
          EDITORIAL HERO — light, magazine-style
      ═══════════════════════════════════════ */}
      <header className="relative isolate overflow-hidden pt-[100px] md:pt-[120px] pb-14 md:pb-20 bg-[#f9fafb]">
        {/* Soft ambient color blobs — one per category */}
        <div
          className="absolute -top-32 -right-20 w-[560px] h-[560px] rounded-full pointer-events-none blur-[140px] opacity-[0.18]"
          style={{ background: accent }}
        />
        <div className="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none blur-[140px] opacity-[0.08] bg-[#2563eb]" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link
            href="/visa-types"
            className="inline-flex items-center gap-1.5 text-[#52596e] hover:text-[#0a1530] text-[13.5px] font-medium mb-8 transition-colors duration-100"
          >
            <ArrowLeft className="w-4 h-4" />
            All visa routes
          </Link>

          {/* Category + freshness */}
          <div className="flex flex-wrap items-center gap-2 mb-7">
            <span
              className="inline-flex items-center gap-1.5 ed-eyebrow px-2.5 py-1 rounded-full"
              style={{ background: `${accent}14`, color: accent }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
              {v.category} route
            </span>
            <span className="inline-flex items-center gap-1.5 ed-eyebrow px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#15803d]">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#15803d] opacity-50 animate-ping" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#15803d]" />
              </span>
              Verified · {v.updated}
            </span>
            <a
              href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 ed-eyebrow px-2.5 py-1 rounded-full bg-[#0a1530]/[0.05] text-[#52596e] hover:text-[#0a1530] transition-colors"
            >
              <ShieldCheck className="w-3 h-3" />
              gov.uk source
            </a>
          </div>

          {/* THE big title */}
          <h1 className="ed-headline text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-bold text-[#0a1530]">
            {v.title}
          </h1>

          {/* Deck */}
          <p className="mt-6 ed-deck text-[1.125rem] md:text-[1.3125rem] max-w-3xl">
            {v.tagline}
          </p>

          {/* At-a-glance strip — big numbers, no boxes */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-y-7 md:gap-y-0">
            <Glance label="Fee from" value={shortFee} accent={accent} />
            <Glance label="Health surcharge" value={v.ihs.split('·')[0].trim()} />
            <Glance label="Decision in" value={v.processing.outside} />
            <Glance label="Duration" value={shortDuration} />
          </div>

          {/* CTA row */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={v.applyUrl}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-full text-[14px] active:scale-[0.98] transition-transform duration-100"
              style={{ background: accent, boxShadow: `0 6px 22px ${accent}55` }}
            >
              Apply on gov.uk
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href={`/tools/cost-calculator?visa=${slug}`}
              className="inline-flex items-center gap-2 bg-white border border-[rgba(14,20,36,0.08)] text-[#0a1530] font-bold px-6 py-3 rounded-full text-[14px] hover:border-[#0a1530] transition-colors duration-100 shadow-soft"
            >
              <Calculator className="w-4 h-4" />
              Calculate full cost
            </Link>
          </div>
        </div>
      </header>

      {/* Anchor nav (existing, polished) */}
      <VisaTabNav tabs={tabs} accent={accent} />

      {/* ═══════════════════════════════════════
          MAIN CONTENT — 2-column editorial
      ═══════════════════════════════════════ */}
      <div className="bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="grid grid-cols-12 gap-x-12 gap-y-8">

            {/* MAIN ── */}
            <main className="col-span-12 lg:col-span-8 space-y-20 md:space-y-24">

              {/* 01 — Overview / prose summary */}
              <Section id="overview" eyebrow="01 · Overview" title={`What is the ${v.title}?`} accent={accent}>
                <p className="ed-prose first-letter:font-editorial first-letter:font-bold first-letter:text-[3.5rem] first-letter:leading-[0.85] first-letter:float-left first-letter:pr-2.5 first-letter:pt-2 first-letter:text-[#0a1530]">
                  {v.summary}
                </p>
              </Section>

              {/* Sub-route picker */}
              {variants.length > 0 && (
                <section id="variants" className="scroll-mt-32">
                  <VariantPicker variants={variants} visaId={slug} accent={accent} />
                </section>
              )}

              {/* 02 — Eligibility — Editorial checklist */}
              <Section id="eligibility" eyebrow="02 · Eligibility" title="Are you eligible?" accent={accent}>
                <p className="ed-prose mb-8 text-[#52596e]">
                  You must meet <strong className="text-[#0a1530] font-semibold">every</strong> condition below — Home Office caseworkers refuse on the first one missed.
                </p>
                <ul className="space-y-5 max-w-2xl">
                  {v.eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-5 group">
                      <span
                        className="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-150"
                        style={{ background: '#dcfce7', color: '#15803d' }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                      <span className="ed-prose flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* 03 — Costs — Big editorial cost stack */}
              <Section id="costs" eyebrow="03 · Costs" title="What it costs in 2026" accent={accent}>
                <p className="ed-prose text-[#52596e] mb-8 max-w-2xl">
                  Two compulsory costs apply to every applicant: the application fee and the Health Surcharge (IHS). Optional priority service and per-dependant fees sit on top.
                </p>

                {/* Settlement breakdown when available */}
                {SETTLEMENT_BREAKDOWNS[slug] ? (
                  <SettlementCostStack breakdown={SETTLEMENT_BREAKDOWNS[slug]} calculatorVisaParam={slug} />
                ) : (
                  <CostEditorial fee={v.fee} ihs={v.ihs} accent={accent} slug={slug} />
                )}
              </Section>

              {/* 04 — Documents — Categorized grid */}
              <Section id="documents" eyebrow="04 · Documents" title="What you'll need to provide" accent={accent}>
                <p className="ed-prose text-[#52596e] mb-8 max-w-2xl">
                  Group your evidence under these four headings. Missing or mis-categorised documents are the second most common refusal reason after salary.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  {docGroups.map((group) => {
                    const Icon = group.icon;
                    return (
                      <div key={group.id}>
                        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[rgba(14,20,36,0.08)]">
                          <span className="inline-flex w-7 h-7 rounded-lg items-center justify-center flex-shrink-0" style={{ background: `${accent}14`, color: accent }}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <h3 className="font-display font-bold text-[15px] text-[#0a1530]">
                            {group.label}
                          </h3>
                        </div>
                        <ul className="space-y-2.5">
                          {group.items.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3 text-[15px] text-[#1a2240] leading-[1.55]">
                              <span className="mt-2.5 w-1 h-1 rounded-full bg-[#0a1530]/30 flex-shrink-0" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* 05 — Process — Magazine timeline */}
              <Section id="process" eyebrow="05 · How to apply" title="Step-by-step" accent={accent}>
                <ol className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute left-[26px] top-3 bottom-3 w-px"
                    style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}55 30%, ${accent}15 70%, transparent)` }}
                  />
                  {v.steps.map((s, i) => (
                    <li key={i} className="relative pl-[72px] pb-10 last:pb-0">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 w-[52px] h-[52px] rounded-full bg-white border flex items-center justify-center"
                        style={{ borderColor: accent, color: accent }}
                      >
                        <span className="ed-bignumber text-[1.5rem]">{i + 1}</span>
                      </span>
                      <h4 className="ed-headline text-[1.3125rem] md:text-[1.5rem] text-[#0a1530] mb-2">
                        {s.title}
                      </h4>
                      <p className="ed-prose text-[#52596e]">{s.desc}</p>
                    </li>
                  ))}
                </ol>
              </Section>

              {/* 06 — Key notes — Editorial pull-quotes */}
              {v.notes && v.notes.length > 0 && (
                <Section id="notes" eyebrow="06 · Watch out for" title="Things that catch people out" accent={accent}>
                  <div className="space-y-6">
                    {v.notes.map((note, i) => (
                      <figure
                        key={i}
                        className="relative pl-7 md:pl-10"
                        style={{ borderLeft: `3px solid ${accent}` }}
                      >
                        <span
                          aria-hidden="true"
                          className="ed-headline absolute -left-1.5 md:-left-2 top-[-12px] text-[3.5rem] leading-none"
                          style={{ color: `${accent}25` }}
                        >&ldquo;</span>
                        <blockquote className="ed-pullquote pl-2">{note}</blockquote>
                      </figure>
                    ))}
                  </div>
                </Section>
              )}

              {/* 07 — FAQ */}
              {faqs.length > 0 && (
                <Section id="faq" eyebrow="07 · FAQ" title="Common questions" accent={accent}>
                  <VisaFaq faqs={faqs} />
                </Section>
              )}

              {/* CTA panel */}
              <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-8 md:p-12 mt-4">
                <div
                  className="absolute inset-0 opacity-[0.2] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
                  style={{ background: `${accent}40` }} />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="max-w-md">
                    <span className="ed-eyebrow text-[#ffbf47] inline-flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Ready to apply
                    </span>
                    <h3 className="mt-3 ed-headline text-white text-[1.875rem] md:text-[2.25rem]">
                      Apply for the {v.title} on gov.uk
                    </h3>
                    <p className="mt-3 ed-deck text-white/55 text-[14.5px]">
                      Free, official, no agents. Bookmark the URL — it's the only place to legally apply.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    <a
                      href={v.applyUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-6 py-3.5 rounded-full text-sm hover:bg-[#ffd166] transition-colors duration-100"
                    >
                      Apply on gov.uk <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link
                      href="/eligibility"
                      className="inline-flex items-center justify-center gap-2 bg-white/[0.08] border border-white/[0.14] text-white font-semibold px-6 py-3.5 rounded-full text-sm hover:bg-white/[0.13] transition-colors duration-100"
                    >
                      Run eligibility quiz
                    </Link>
                  </div>
                </div>
              </div>

              <RelatedBlogToVisa visaSlug={slug} />
            </main>

            {/* SIDEBAR ── */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[124px] space-y-4">

                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5 shadow-soft">
                  <div className="ed-eyebrow text-[#9aa3b8] mb-4 pb-3 border-b border-[rgba(14,20,36,0.06)]">
                    Quick facts
                  </div>
                  <dl className="space-y-3">
                    <FactRow label="Category" value={`${v.category} route`} icon={Briefcase} />
                    <FactRow label="Application fee" value={v.fee} icon={Banknote} />
                    <FactRow label="Health surcharge" value={v.ihs} icon={ShieldCheck} />
                    <FactRow label="Decision (outside UK)" value={v.processing.outside} icon={Clock} />
                    <FactRow label="Decision (in UK)" value={v.processing.inside} icon={Clock} />
                    <FactRow label="Duration" value={v.duration} icon={Calendar} />
                  </dl>
                </div>

                <a
                  href={v.applyUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="group block rounded-2xl p-5 text-white relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}d8)` }}
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="ed-eyebrow opacity-70 mb-1.5">Official</div>
                    <div className="ed-headline text-[20px] leading-tight">Apply on gov.uk</div>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold group-hover:gap-2.5 transition-[gap] duration-100">
                      Start application <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </a>

                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5 shadow-soft">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex w-7 h-7 rounded-lg items-center justify-center bg-[#dcfce7] text-[#15803d]">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="font-bold text-[13.5px] text-[#0a1530] leading-tight">Talk to a solicitor</div>
                      <div className="text-[11px] text-[#7a8195]">Free 15-min consult</div>
                    </div>
                  </div>
                  <p className="text-[12.5px] text-[#52596e] leading-snug mb-3">
                    Get an OISC-regulated immigration solicitor to review your situation before you apply.
                  </p>
                  <Link
                    href="/eligibility"
                    className="block text-center bg-[#0a1530] text-white text-[12.5px] font-bold py-2.5 rounded-full hover:bg-[#13204a] transition-colors duration-100"
                  >
                    Get matched →
                  </Link>
                  <div className="mt-3 flex items-center justify-center gap-1 text-[10.5px] text-[#9aa3b8]">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-[#ffbf47] text-[#ffbf47]" />)}
                    <span className="ml-1">Trusted by 2,400+</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#f3f5fb] border border-[rgba(14,20,36,0.05)] p-4">
                  <div className="ed-eyebrow text-[#9aa3b8] mb-2 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12px] text-[#52596e] leading-snug">
                    Every figure on this page is verified against the gov.uk Home Office fee table effective <strong className="text-[#0a1530]">8 April 2026</strong>.
                  </p>
                  <a
                    href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                    target="_blank" rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#d9152b] hover:underline"
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

function Section({ id, eyebrow, title, accent, children }: {
  id: string; eyebrow: string; title: string; accent: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="mb-8 md:mb-10">
        <div className="ed-eyebrow mb-3" style={{ color: accent }}>{eyebrow}</div>
        <h2 className="ed-headline text-[2rem] sm:text-[2.5rem] md:text-[3rem] text-[#0a1530]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Glance({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div className="ed-eyebrow text-[#9aa3b8] mb-2.5">{label}</div>
      <div
        className="ed-bignumber text-[1.875rem] sm:text-[2.25rem] md:text-[2.25rem] ed-money pr-2"
        style={accent ? { color: accent } : { color: '#0a1530' }}
      >
        {value}
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
    <div className="flex items-start justify-between gap-3 py-0.5">
      <dt className="flex items-center gap-2 text-[12px] text-[#7a8195] font-medium flex-shrink-0">
        <Icon className="w-3 h-3" /> {label}
      </dt>
      <dd className="text-[12.5px] font-semibold text-[#0a1530] text-right ed-money max-w-[180px] leading-tight">{value}</dd>
    </div>
  );
}

/** Non-settlement visa cost panel — big total + line items inline. */
function CostEditorial({ fee, ihs, accent, slug }: { fee: string; ihs: string; accent: string; slug: string }) {
  const headFee = (fee.match(/£[\d,]+/) ?? ['—'])[0];
  return (
    <div className="rounded-[24px] overflow-hidden border border-[rgba(14,20,36,0.08)] bg-white shadow-soft">
      <div className="p-6 md:p-8 bg-gradient-to-br from-[#fafbfd] to-white">
        <div className="ed-eyebrow text-[#9aa3b8] mb-3">Application fee</div>
        <div className="ed-bignumber ed-money text-[3rem] md:text-[3.5rem]" style={{ color: accent }}>
          {headFee}
        </div>
        <div className="mt-2 text-[14px] text-[#52596e]">{fee}</div>
      </div>
      <div className="ed-rule" />
      <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
        <div>
          <div className="ed-eyebrow text-[#9aa3b8] mb-2">Health surcharge (IHS)</div>
          <div className="text-[20px] font-semibold text-[#0a1530] ed-money">{ihs}</div>
          <p className="mt-2 text-[12.5px] text-[#7a8195] leading-snug">
            Paid upfront for the full visa duration. Funds your NHS access.
          </p>
        </div>
        <div>
          <div className="ed-eyebrow text-[#9aa3b8] mb-2">Optional add-ons</div>
          <ul className="space-y-1.5 text-[13.5px] text-[#1a2240] leading-snug">
            <li className="flex items-baseline justify-between gap-3 ed-money">
              <span>Priority service</span><span className="font-semibold">+£500</span>
            </li>
            <li className="flex items-baseline justify-between gap-3 ed-money">
              <span>Super-priority</span><span className="font-semibold">+£1,000</span>
            </li>
            <li className="flex items-baseline justify-between gap-3 ed-money">
              <span>Each dependant</span><span className="font-semibold">+full fee + IHS</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="ed-rule" />
      <div className="p-5 md:p-6 bg-[#fafbfd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] text-[#52596e]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
          Every figure verified against gov.uk (8 April 2026).
        </div>
        <Link
          href={`/tools/cost-calculator?visa=${slug}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white px-4 py-2 rounded-full active:scale-[0.98] transition-transform duration-100"
          style={{ background: accent }}
        >
          <Calculator className="w-3.5 h-3.5" /> Calculate full cost
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

