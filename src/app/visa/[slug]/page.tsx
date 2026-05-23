import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, Calculator, ChevronRight,
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

/* ─── Quartz tokens — light, professional, single Inter font ──── */
const INK    = '#1A1F36';
const INK2   = '#3C4257';
const MID    = '#697386';
const MID2   = '#8792A2';
const FAINT  = '#A3ACB9';
const BG     = '#FFFFFF';
const BG2    = '#F7F8FA';
const BORDER = '#E3E8EE';
const ACCENT = '#635BFF';
const ACCENT_SOFT = '#EFEEFF';
const ACCENT_DK = '#5851DB';
const POSITIVE = '#08855D';
const POSITIVE_SOFT = '#E6F7EF';
const WARN_SOFT = '#FCEDD3';
const WARN_INK  = '#7E4A02';

interface RouteParams { params: Promise<{ slug: string }> }

const CATEGORY_LABEL: Record<string, string> = {
  Work:   'Work',
  Study:  'Study',
  Family: 'Family',
  Visit:  'Visit',
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
    twitter: { card: 'summary_large_image', title, description, images: [ogImageUrl] },
  };
}

function categoriseDocuments(docs: string[]) {
  const buckets: { id: string; label: string; items: string[] }[] = [
    { id: 'identity', label: 'Identity',          items: [] },
    { id: 'finance',  label: 'Finance',           items: [] },
    { id: 'sponsor',  label: 'Sponsor / Course',  items: [] },
    { id: 'health',   label: 'Health & skills',   items: [] },
  ];
  for (const d of docs) {
    const low = d.toLowerCase();
    if (/passport|biometric|brp|evisa|share code|nationality|birth|adoption|marriage|civil partnership|grandparent/i.test(low))
      buckets[0].items.push(d);
    else if (/bank|payslip|p60|tax|hmrc|salary|maintenance|funds|savings|sa302|finance/i.test(low))
      buckets[1].items.push(d);
    else if (/cas|cos|sponsor|certificate of acceptance|employer|letter|offer|course|institution|reference number|endorsement/i.test(low))
      buckets[2].items.push(d);
    else if (/tb|tuberculosis|english|ielts|selt|atas|life in the uk|qualification|degree|gmc|nmc|hcpc|criminal|dbs|police|registration|cv|phd/i.test(low))
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

  /* ─── JSON-LD ─── */
  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: v.title, description: v.summary,
    datePublished: '2026-04-08', dateModified: '2026-05-19',
    author: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
    publisher: { '@type': 'Organization', name: 'UKDesk',
      logo: { '@type': 'ImageObject', url: 'https://ukvisainfo.co.uk/icon.svg' } },
    image: `https://ukvisainfo.co.uk/visa/${slug}/opengraph-image`,
    mainEntityOfPage: `https://ukvisainfo.co.uk/visa/${slug}`,
    inLanguage: 'en-GB',
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Visa Routes', item: 'https://ukvisainfo.co.uk/visa-types' },
      { '@type': 'ListItem', position: 3, name: v.title, item: `https://ukvisainfo.co.uk/visa/${slug}` },
    ],
  };
  const howToJsonLd = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: `How to Apply for a ${v.title}`,
    description: `Step-by-step guide to applying for the ${v.title}. Fee: ${v.fee}. Processing: ${v.processing.outside}.`,
    totalTime: `P${parseInt(v.processing.outside) || 3}W`,
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'GBP', value: (v.fee.match(/[\d,]+/) ?? ['0'])[0].replace(',', '') },
    step: v.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.desc })),
  };
  const faqJsonLd = faqs.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  } : null;

  /* ────────────────────────────────────────────────────────── */
  return (
    <div style={{
      background: BG, color: INK,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale',
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <VisaStickyBar title={v.title} fee={v.fee} applyUrl={v.applyUrl} slug={slug} />

      {/* ═════════ HERO — compressed, one-glance ═════════ */}
      <header style={{ borderBottom: `1px solid ${BORDER}`, background: BG }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(76px,9vw,92px) clamp(20px,3vw,32px) 24px' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: MID, marginBottom: 18 }}>
            <Link href="/visa-types" style={{ color: MID, textDecoration: 'none' }}>UK Visas</Link>
            <ChevronRight size={11} strokeWidth={2} color={FAINT} />
            <Link href="/visa-types" style={{ color: MID, textDecoration: 'none' }}>{categoryLabel}</Link>
            <ChevronRight size={11} strokeWidth={2} color={FAINT} />
            <span style={{ color: INK2, fontWeight: 500 }}>{v.title}</span>
          </nav>

          {/* Title + Tagline + Actions — all on one tight block */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: 24,
            alignItems: 'flex-end',
            marginBottom: 22,
          }} className="visa-hero-row">
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                  textTransform: 'uppercase', color: ACCENT_DK,
                  background: ACCENT_SOFT, border: `1px solid ${ACCENT}26`,
                  padding: '3px 8px', borderRadius: 4,
                }}>
                  {categoryLabel} route
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 500, color: POSITIVE,
                  background: POSITIVE_SOFT, border: `1px solid #BFE3D3`,
                  padding: '3px 8px', borderRadius: 4,
                }}>
                  Verified · {v.updated}
                </span>
              </div>
              <h1 style={{
                fontSize: 'clamp(26px, 3.6vw, 38px)',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: INK,
                margin: '0 0 10px',
                maxWidth: 720,
              }}>
                {v.title}
              </h1>
              <p style={{
                fontSize: 15, lineHeight: 1.55, color: MID,
                margin: 0, maxWidth: 620, fontWeight: 400,
              }}>
                {v.tagline}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }} className="visa-hero-cta">
              <a
                href={v.applyUrl}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: ACCENT, color: '#fff',
                  fontSize: 13, fontWeight: 500,
                  padding: '8px 14px', borderRadius: 6,
                  textDecoration: 'none',
                  boxShadow: '0 1px 2px rgba(26,31,54,0.08)',
                }}
              >
                Apply on gov.uk <ExternalLink size={12} strokeWidth={2.2} />
              </a>
              <Link
                href={`/tools/cost-calculator?visa=${slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: BG, color: INK,
                  border: `1px solid ${BORDER}`,
                  fontSize: 13, fontWeight: 500,
                  padding: '8px 14px', borderRadius: 6,
                  textDecoration: 'none',
                }}
              >
                <Calculator size={12} strokeWidth={2.2} /> Estimate cost
              </Link>
            </div>
          </div>

          {/* INLINE METRIC STRIP — no cards, just hairline-separated cells */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            background: BG2,
            overflow: 'hidden',
          }}>
            <Metric label="Application fee" value={headlineFee} sub={v.fee.split('·')[0].trim().replace(headlineFee, '').trim() || 'from'} />
            <Metric label="IHS / year" value={v.ihs.split('/')[0].trim()} sub="adult rate" border />
            <Metric label="Decision (outside)" value={v.processing.outside} sub={`Inside UK: ${v.processing.inside}`} border />
            <Metric label="Duration" value={shortDuration} sub="initial leave" border />
          </div>
        </div>
      </header>

      {/* Sticky tab nav */}
      <VisaTabNav tabs={tabs} />

      {/* ═════════ BODY — 2-col with sticky TOC ═════════ */}
      <div style={{ background: BG }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(20px,3vw,32px) 64px' }}>
          <div className="flex flex-col lg:flex-row gap-10">

            <main style={{ flex: 1, minWidth: 0, maxWidth: 760 }} className="space-y-12">

              {/* 01 OVERVIEW — facts, not paragraphs */}
              <Section id="overview" num="01" title="Overview">
                <p style={{ fontSize: 15, lineHeight: 1.65, color: INK2, margin: '0 0 16px', maxWidth: 640 }}>
                  {v.summary}
                </p>
                <DL items={[
                  ['Route type', categoryLabel],
                  ['Sponsor required', /sponsor|cas|cos|certificate/i.test(v.eligibility.join(' ')) ? 'Yes' : 'No'],
                  ['Family allowed', /spouse|partner|dependant|child/i.test(v.eligibility.concat(v.documents).join(' ')) ? 'Yes — dependants permitted' : 'Check route rules'],
                  ['Switch in-UK', v.processing.inside && !/^n\/a/i.test(v.processing.inside) ? `Allowed · ${v.processing.inside}` : 'Not available'],
                  ['Updated', v.updated],
                ]} />
              </Section>

              {variants.length > 0 && (
                <section id="variants" className="scroll-mt-32">
                  <VariantPicker variants={variants} visaId={slug} />
                </section>
              )}

              {/* 02 ELIGIBILITY — numbered table */}
              <Section id="eligibility" num="02" title="Eligibility requirements"
                       note="You must meet every condition. Home Office refuses on the first miss.">
                <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden', background: BG }}>
                  {v.eligibility.map((item, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '36px 1fr',
                      borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
                    }}>
                      <div style={{
                        background: BG2, borderRight: `1px solid ${BORDER}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 500, color: MID,
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div style={{ padding: '11px 14px', fontSize: 14, lineHeight: 1.55, color: INK2 }}>
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 03 COSTS */}
              <Section id="costs" num="03" title="Costs in 2026">
                {SETTLEMENT_BREAKDOWNS[slug] ? (
                  <SettlementCostStack breakdown={SETTLEMENT_BREAKDOWNS[slug]} calculatorVisaParam={slug} />
                ) : (
                  <CostTable fee={v.fee} ihs={v.ihs} slug={slug} headlineFee={headlineFee} />
                )}
              </Section>

              {/* 04 DOCUMENTS — grouped 2-col bullets */}
              <Section id="documents" num="04" title="Required documents">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 1, background: BORDER,
                  border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden',
                }}>
                  {docGroups.map((g) => (
                    <div key={g.id} style={{ background: BG, padding: '14px 16px' }}>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: MID2,
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                        marginBottom: 10,
                      }}>
                        {g.label}
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {g.items.map((d, i) => (
                          <li key={i} style={{
                            fontSize: 13.5, lineHeight: 1.5, color: INK2,
                            padding: '6px 0',
                            borderTop: i > 0 ? `1px dashed ${BORDER}` : 'none',
                            display: 'flex', gap: 8, alignItems: 'flex-start',
                          }}>
                            <span style={{
                              width: 4, height: 4, borderRadius: 999,
                              background: ACCENT, marginTop: 8, flexShrink: 0,
                            }} />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 05 PROCESS — application guide stays */}
              <Section id="process" num="05" title="How to apply">
                <ApplicationGuide
                  slug={slug}
                  title={v.title}
                  category={v.category}
                  fee={v.fee}
                  ihs={v.ihs}
                  applyUrl={v.applyUrl}
                  processing={v.processing}
                  steps={v.steps}
                  accent={ACCENT}
                />
              </Section>

              {/* 06 KEY NOTES */}
              {v.notes && v.notes.length > 0 && (
                <Section id="notes" num="06" title="Key notes">
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {v.notes.map((n, i) => (
                      <li key={i} style={{
                        display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 10,
                        padding: '10px 0',
                        borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
                        fontSize: 13.5, lineHeight: 1.6, color: INK2,
                      }}>
                        <span style={{
                          marginTop: 6, width: 5, height: 5, borderRadius: 999,
                          background: ACCENT_DK,
                        }} />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* 07 FAQ */}
              {faqs.length > 0 && (
                <Section id="faq" num={String((v.notes?.length ? 7 : 6)).padStart(2, '0')} title="Frequently asked questions">
                  <VisaFaq faqs={faqs} />
                </Section>
              )}

              <RelatedBlogToVisa visaSlug={slug} />
            </main>

            {/* ─── Sticky TOC sidebar (desktop) ─── */}
            <aside className="hidden lg:block" style={{ width: 220, flexShrink: 0 }}>
              <div className="sticky" style={{ top: 96 }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: MID2,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  marginBottom: 10, paddingLeft: 12,
                }}>
                  On this page
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column' }}>
                  {tabs.map((t) => (
                    <a
                      key={t.id} href={`#${t.id}`}
                      style={{
                        fontSize: 13, color: MID, textDecoration: 'none',
                        padding: '7px 12px', borderLeft: `1px solid ${BORDER}`,
                        transition: 'color 0.12s',
                      }}
                      className="hover:text-[#1A1F36] hover:border-l-[#635BFF]"
                    >
                      {t.label}
                    </a>
                  ))}
                </nav>

                {/* Quick fact card */}
                <div style={{
                  marginTop: 24, padding: '12px 14px',
                  background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8,
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: MID2,
                    letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8,
                  }}>
                    Total minimum cost
                  </div>
                  <div style={{
                    fontSize: 22, fontWeight: 600, color: INK,
                    letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                  }}>
                    {headlineFee}
                  </div>
                  <div style={{ fontSize: 11.5, color: MID, marginTop: 4, lineHeight: 1.5 }}>
                    + IHS {v.ihs} × duration
                  </div>
                  <Link
                    href={`/tools/cost-calculator?visa=${slug}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginTop: 12, fontSize: 12, fontWeight: 500, color: ACCENT,
                      textDecoration: 'none',
                    }}
                  >
                    Full cost calculator <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta href={v.applyUrl} label="Apply on gov.uk" />
    </div>
  );
}

/* ─── Helpers ─── */

function Section({
  id, num, title, note, children,
}: { id: string; num: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        paddingBottom: 8, marginBottom: 14,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: MID2,
          letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums',
        }}>
          {num}
        </span>
        <h2 style={{
          fontSize: 18, fontWeight: 600, color: INK,
          letterSpacing: '-0.015em', margin: 0,
        }}>
          {title}
        </h2>
      </div>
      {note && (
        <div style={{
          background: WARN_SOFT, border: '1px solid #F5D88B',
          color: WARN_INK, fontSize: 12.5, lineHeight: 1.5,
          padding: '8px 12px', borderRadius: 6, marginBottom: 14,
        }}>
          {note}
        </div>
      )}
      {children}
    </section>
  );
}

function Metric({ label, value, sub, border }: { label: string; value: string; sub?: string; border?: boolean }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderLeft: border ? `1px solid ${BORDER}` : 'none',
      background: BG2,
    }}>
      <div style={{
        fontSize: 10.5, fontWeight: 600, color: MID2,
        letterSpacing: '0.04em', textTransform: 'uppercase',
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 17, fontWeight: 600, color: INK,
        letterSpacing: '-0.015em', lineHeight: 1.2,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11.5, color: MID, marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
      )}
    </div>
  );
}

function DL({ items }: { items: [string, string][] }) {
  return (
    <dl style={{
      margin: 0, border: `1px solid ${BORDER}`, borderRadius: 8,
      background: BG, overflow: 'hidden',
    }}>
      {items.map(([k, val], i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '160px 1fr',
          borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
          fontSize: 13.5,
        }}>
          <dt style={{
            background: BG2, padding: '10px 14px',
            color: MID, fontWeight: 500,
            borderRight: `1px solid ${BORDER}`,
          }}>
            {k}
          </dt>
          <dd style={{ padding: '10px 14px', color: INK2, margin: 0, lineHeight: 1.55 }}>
            {val}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CostTable({ fee, ihs, slug, headlineFee }: { fee: string; ihs: string; slug: string; headlineFee: string }) {
  const rows: [string, string, string?][] = [
    ['Application fee',  headlineFee, fee],
    ['Health surcharge', ihs,         'Paid upfront for full duration'],
    ['Priority service', '+£500',     'Optional · 5-day decision'],
    ['Super-priority',   '+£1,000',   'Optional · next working day'],
    ['Per dependant',    '+ full fee + IHS', 'Spouse and each child'],
  ];
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden', background: BG }}>
      {rows.map(([k, val, sub], i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: 12, padding: '11px 16px',
          borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
          background: i === 0 ? BG2 : BG,
          alignItems: 'baseline',
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: INK, letterSpacing: '-0.005em' }}>{k}</div>
            {sub && <div style={{ fontSize: 11.5, color: MID, marginTop: 2 }}>{sub}</div>}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 600, color: i === 0 ? ACCENT_DK : INK,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
          }}>
            {val}
          </div>
        </div>
      ))}
      <div style={{ background: BG2, borderTop: `1px solid ${BORDER}`, padding: '10px 16px' }}>
        <Link href={`/tools/cost-calculator?visa=${slug}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12.5, fontWeight: 500, color: ACCENT,
                textDecoration: 'none',
              }}>
          <Calculator size={12} strokeWidth={2.2} /> Calculate your full cost
        </Link>
      </div>
    </div>
  );
}
