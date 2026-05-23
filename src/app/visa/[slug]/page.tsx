import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ExternalLink, Calculator, ChevronRight,
  FileText, Wallet, Briefcase, ShieldCheck, GraduationCap,
  Heart, Plane, Users, Globe2,
  Languages, BadgeCheck, FileSignature, CreditCard, Building2,
  Stethoscope, Fingerprint,
} from 'lucide-react';
import { VISA_DETAILS } from '../../../data/visaDetails';
import { VISA_FAQS } from '../../../data/visaFaqs';
import VisaTabNav from '../../../components/visa/VisaTabNav';
import VisaFaq from '../../../components/visa/VisaFaq';
import VisaStickyBar from '../../../components/visa/VisaStickyBar';
import VariantPicker from '../../../components/visa/VariantPicker';
import StickyMobileCta from '../../../components/StickyMobileCta';
import { getVariants } from '../../../data/visaVariants';

/* ─── Quartz tokens ─── */
const INK     = '#1A1F36';
const INK2    = '#3C4257';
const MID     = '#697386';
const MID2    = '#8792A2';
const FAINT   = '#A3ACB9';
const BG      = '#FFFFFF';
const BG2     = '#F7F8FA';
const BG3     = '#F0F2F6';
const BORDER  = '#E3E8EE';
const ACCENT  = '#635BFF';
const ACCENT2 = '#7A73FF';
const ACCENT_DK   = '#5851DB';
const ACCENT_SOFT = '#EFEEFF';
const POSITIVE      = '#08855D';
const POSITIVE_SOFT = '#E6F7EF';
const WARN     = '#BF6A02';
const WARN_SOFT= '#FCEDD3';
const PINK     = '#CD3D64';
const PINK_SOFT= '#FCE6EC';

interface RouteParams { params: Promise<{ slug: string }> }

const CATEGORY_LABEL: Record<string, string> = {
  Work: 'Work', Study: 'Study', Family: 'Family', Visit: 'Visit',
};
const CATEGORY_ICON: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  Work: Briefcase, Study: GraduationCap, Family: Heart, Visit: Plane,
};

export function generateStaticParams() {
  return Object.keys(VISA_DETAILS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) return { title: 'Visa not found' };
  const title = `${v.title} 2026 — Fees, Eligibility & How to Apply`;
  const description = `${v.summary} Fee ${v.fee}. IHS ${v.ihs}. Decision in ${v.processing.outside}. Verified ${v.updated}.`;
  return {
    title, description,
    alternates: { canonical: `/visa/${slug}` },
    openGraph: {
      title, description,
      url: `https://ukvisainfo.co.uk/visa/${slug}`,
      type: 'article',
      images: [{ url: `https://ukvisainfo.co.uk/visa/${slug}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/* ─── numeric extractors ─── */
function extractGBP(s: string): number {
  const m = s.match(/£([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
}
function extractWeeks(s: string): number {
  const m = s.match(/(\d+)\s*(week|day|month)/i);
  if (!m) return 3;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit.startsWith('day'))   return Math.max(1, Math.round(n / 7));
  if (unit.startsWith('month')) return n * 4;
  return n;
}
function extractYears(s: string): number {
  const m = s.match(/(\d+)\s*year/i);
  return m ? parseInt(m[1], 10) : 5;
}

/* ─── doc icon resolver ─── */
function docIcon(d: string) {
  const l = d.toLowerCase();
  if (/passport|biometric|nationality|share code|brp|evisa/.test(l))     return Fingerprint;
  if (/english|ielts|selt|language|b1|b2/.test(l))                       return Languages;
  if (/bank|funds|maintenance|savings|salary|payslip|sa302|p60|hmrc/.test(l)) return CreditCard;
  if (/cas|cos|sponsor|certificate|offer letter|endorsement/.test(l))    return FileSignature;
  if (/employer|institution|company|university|college/.test(l))         return Building2;
  if (/tb|tuberculosis|medical|gmc|nmc|hcpc|health/.test(l))             return Stethoscope;
  if (/birth|marriage|civil partnership|adoption|relationship|family/.test(l)) return Heart;
  if (/criminal|dbs|police|atas/.test(l))                                return ShieldCheck;
  if (/degree|phd|qualification|cv|reference/.test(l))                   return GraduationCap;
  return FileText;
}

function categoriseDocuments(docs: string[]) {
  const buckets: { id: string; label: string; tone: string; items: string[] }[] = [
    { id: 'identity', label: 'Identity', tone: ACCENT,    items: [] },
    { id: 'finance',  label: 'Finance',  tone: POSITIVE,  items: [] },
    { id: 'sponsor',  label: 'Sponsor',  tone: WARN,      items: [] },
    { id: 'health',   label: 'Skills & checks', tone: PINK, items: [] },
  ];
  for (const d of docs) {
    const l = d.toLowerCase();
    if (/passport|biometric|brp|evisa|share code|nationality|birth|marriage|civil partnership|adoption|grandparent/i.test(l)) buckets[0].items.push(d);
    else if (/bank|payslip|p60|tax|hmrc|salary|maintenance|funds|savings|sa302|finance/i.test(l)) buckets[1].items.push(d);
    else if (/cas|cos|sponsor|certificate of acceptance|employer|offer|course|institution|reference number|endorsement|company/i.test(l)) buckets[2].items.push(d);
    else buckets[3].items.push(d);
  }
  return buckets.filter((b) => b.items.length > 0);
}

/* ─── short label from a sentence (first ~4 meaningful words) ─── */
function shortLabel(s: string, max = 36): string {
  const cleaned = s.replace(/\(.*?\)/g, '').replace(/[,;:].*$/, '').trim();
  if (cleaned.length <= max) return cleaned;
  return cleaned.slice(0, max - 1).trimEnd() + '…';
}

/* ─── status pill detector from eligibility ─── */
function eligibilityStatus(s: string): { tone: 'must' | 'cond' | 'opt'; label: string } {
  const l = s.toLowerCase();
  if (/unless|or if|optional|if applic|if you|may|might/.test(l)) return { tone: 'cond', label: 'Conditional' };
  return { tone: 'must', label: 'Required' };
}

export default async function VisaPage({ params }: RouteParams) {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) notFound();

  const faqs = VISA_FAQS[slug] ?? [];
  const variants = getVariants(slug);
  const docGroups = categoriseDocuments(v.documents);
  const CatIcon = CATEGORY_ICON[v.category] ?? Globe2;

  /* numeric breakdown */
  const fee  = extractGBP(v.fee);
  const ihsPerYear = extractGBP(v.ihs);
  const years = Math.min(5, Math.max(1, extractYears(v.duration)));
  const ihsTotal = ihsPerYear * years;
  const totalMin = fee + ihsTotal;
  const feeShare = totalMin ? Math.round((fee / totalMin) * 100) : 0;
  const ihsShare = 100 - feeShare;
  const decisionWeeks = extractWeeks(v.processing.outside);
  const decisionPct = Math.min(100, Math.round((decisionWeeks / 12) * 100));

  /* difficulty score from eligibility count */
  const difficulty = Math.min(5, Math.max(2, Math.ceil(v.eligibility.length / 1.5)));
  const difficultyLabel = difficulty >= 5 ? 'High' : difficulty >= 4 ? 'Above avg' : difficulty >= 3 ? 'Moderate' : 'Standard';

  const tabs = [
    { id: 'snapshot',    label: 'Snapshot' },
    ...(variants.length ? [{ id: 'variants', label: 'Sub-routes' }] : []),
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'costs',       label: 'Costs' },
    { id: 'documents',   label: 'Documents' },
    { id: 'process',     label: 'Process' },
    ...(faqs.length ? [{ id: 'faq', label: 'FAQ' }] : []),
  ];

  /* JSON-LD */
  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: v.title, description: v.summary,
    datePublished: '2026-04-08', dateModified: '2026-05-19',
    author:    { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
    publisher: { '@type': 'Organization', name: 'UKDesk',
                 logo: { '@type': 'ImageObject', url: 'https://ukvisainfo.co.uk/icon.svg' } },
    image: `https://ukvisainfo.co.uk/visa/${slug}/opengraph-image`,
    mainEntityOfPage: `https://ukvisainfo.co.uk/visa/${slug}`, inLanguage: 'en-GB',
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
    name: `How to apply for a ${v.title}`,
    totalTime: `P${decisionWeeks}W`,
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'GBP', value: totalMin },
    step: v.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.desc })),
  };
  const faqJsonLd = faqs.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  } : null;

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

      {/* ════════ VISUAL HERO — gauges, not paragraphs ════════ */}
      <header style={{ borderBottom: `1px solid ${BORDER}`, background: BG }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(76px,9vw,92px) clamp(20px,3vw,32px) 28px' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: MID, marginBottom: 16 }}>
            <Link href="/visa-types" style={{ color: MID, textDecoration: 'none' }}>UK Visas</Link>
            <ChevronRight size={11} color={FAINT} />
            <span style={{ color: INK2, fontWeight: 500 }}>{v.title}</span>
          </nav>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            gap: 32, alignItems: 'center',
          }} className="visa-hero-grid">
            {/* LEFT — title + icon + chips + CTAs */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: ACCENT_SOFT, color: ACCENT_DK,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${ACCENT}26`,
                }}>
                  <CatIcon size={20} strokeWidth={1.8} />
                </span>
                <div>
                  <div style={{
                    fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: MID2,
                  }}>
                    {CATEGORY_LABEL[v.category]} route
                  </div>
                  <div style={{ fontSize: 11, color: POSITIVE, marginTop: 2,
                                display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BadgeCheck size={12} strokeWidth={2.2} /> Verified {v.updated}
                  </div>
                </div>
              </div>

              <h1 style={{
                fontSize: 'clamp(28px, 3.6vw, 40px)',
                fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.025em',
                color: INK, margin: '0 0 10px', maxWidth: 540,
              }}>
                {v.title}
              </h1>

              {/* TAG ROW — replaces tagline */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
                <Tag label={`${years}y leave`} />
                <Tag label={`${decisionWeeks}w decision`} />
                <Tag label={`£${totalMin.toLocaleString()} total`} accent />
                <Tag label={`${v.eligibility.length} criteria`} />
                {/sponsor|cos|cas/i.test(v.eligibility.join(' ')) && <Tag label="Sponsor required" warn />}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href={v.applyUrl} target="_blank" rel="noopener noreferrer"
                   style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: ACCENT, color: '#fff',
                            fontSize: 13, fontWeight: 500, padding: '9px 14px',
                            borderRadius: 6, textDecoration: 'none',
                            boxShadow: '0 1px 2px rgba(26,31,54,0.08)' }}>
                  Apply on gov.uk <ExternalLink size={12} strokeWidth={2.2} />
                </a>
                <Link href={`/tools/cost-calculator?visa=${slug}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                               background: BG, color: INK, border: `1px solid ${BORDER}`,
                               fontSize: 13, fontWeight: 500, padding: '9px 14px',
                               borderRadius: 6, textDecoration: 'none' }}>
                  <Calculator size={12} strokeWidth={2.2} /> Cost calculator
                </Link>
              </div>
            </div>

            {/* RIGHT — VISUAL GAUGES */}
            <div style={{
              background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12,
              padding: 20, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20,
              alignItems: 'center',
            }}>
              <Donut feeShare={feeShare} ihsShare={ihsShare} total={totalMin} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <KV swatch={ACCENT}   label="Application fee" value={`£${fee.toLocaleString()}`} pct={feeShare} />
                <KV swatch={ACCENT2}  label={`IHS × ${years}y`} value={`£${ihsTotal.toLocaleString()}`} pct={ihsShare} />
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 8,
                              display: 'flex', justifyContent: 'space-between',
                              fontSize: 11.5, color: MID }}>
                  <span>Min for {years}y leave</span>
                  <span style={{ fontWeight: 600, color: INK, fontVariantNumeric: 'tabular-nums' }}>
                    £{totalMin.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini visual strip: decision speed + difficulty + family */}
          <div style={{
            marginTop: 22, display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}>
            <SpeedBar weeks={decisionWeeks} pct={decisionPct} inside={v.processing.inside} />
            <DifficultyMeter level={difficulty} label={difficultyLabel} count={v.eligibility.length} />
            <FamilyChip allowed={/spouse|partner|dependant|child/i.test(v.eligibility.concat(v.documents).join(' '))} />
          </div>
        </div>
      </header>

      <VisaTabNav tabs={tabs} />

      {/* ════════ BODY ════════ */}
      <div style={{ background: BG }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(28px,4vw,44px) clamp(20px,3vw,32px) 64px' }}>
          <div className="flex flex-col lg:flex-row gap-10">

            <main style={{ flex: 1, minWidth: 0, maxWidth: 800 }} className="space-y-14">

              {/* 01 SNAPSHOT — 3-card facts grid, very few words */}
              <Section id="snapshot" num="01" title="Snapshot">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 8,
                }}>
                  <FactTile icon={Briefcase}    label="Route"      value={CATEGORY_LABEL[v.category]} />
                  <FactTile icon={Wallet}       label="From"       value={`£${fee.toLocaleString()}`} />
                  <FactTile icon={ShieldCheck}  label="IHS / yr"   value={`£${ihsPerYear.toLocaleString()}`} />
                  <FactTile icon={Plane}        label="Decision"   value={`${decisionWeeks}w`} />
                  <FactTile icon={Globe2}       label="Inside UK"  value={v.processing.inside.replace(/\s*\(.*?\)/g, '')} small />
                  <FactTile icon={Users}        label="Dependants" value={/spouse|partner|dependant|child/i.test(v.eligibility.concat(v.documents).join(' ')) ? 'Allowed' : 'Limited'} small />
                </div>
              </Section>

              {variants.length > 0 && (
                <section id="variants" className="scroll-mt-32">
                  <VariantPicker variants={variants} visaId={slug} />
                </section>
              )}

              {/* 02 ELIGIBILITY — visual tiles with status pill */}
              <Section id="eligibility" num="02" title="Eligibility">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 8,
                }}>
                  {v.eligibility.map((e, i) => {
                    const status = eligibilityStatus(e);
                    return (
                      <div key={i} style={{
                        border: `1px solid ${BORDER}`, borderRadius: 8,
                        background: BG, padding: '12px 14px',
                        display: 'flex', flexDirection: 'column', gap: 8,
                        position: 'relative', overflow: 'hidden',
                      }}>
                        <span style={{
                          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
                          background: status.tone === 'must' ? ACCENT : WARN,
                        }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            fontSize: 9.5, fontWeight: 600, letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: status.tone === 'must' ? ACCENT_DK : WARN,
                            background: status.tone === 'must' ? ACCENT_SOFT : WARN_SOFT,
                            border: `1px solid ${status.tone === 'must' ? ACCENT + '33' : '#F5D88B'}`,
                            padding: '2px 6px', borderRadius: 3,
                          }}>{status.label}</span>
                          <span style={{ fontSize: 10, color: FAINT, fontVariantNumeric: 'tabular-nums' }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, lineHeight: 1.45, color: INK2, fontWeight: 450 }}>
                          {shortLabel(e, 80)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* 03 COSTS — stacked bar visualisation */}
              <Section id="costs" num="03" title="Cost composition">
                <CostStackChart fee={fee} ihsTotal={ihsTotal} years={years} ihsPerYear={ihsPerYear} totalMin={totalMin} slug={slug} />
              </Section>

              {/* 04 DOCUMENTS — icon tile grid */}
              <Section id="documents" num="04" title="Documents">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {docGroups.map((g) => (
                    <div key={g.id}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 6,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: 999, background: g.tone,
                        }} />
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: INK2,
                          letterSpacing: '0.04em', textTransform: 'uppercase',
                        }}>
                          {g.label}
                        </span>
                        <span style={{ fontSize: 11, color: FAINT, marginLeft: 'auto' }}>
                          {g.items.length}
                        </span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 6,
                      }}>
                        {g.items.map((d, i) => {
                          const Icon = docIcon(d);
                          return (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '9px 12px', border: `1px solid ${BORDER}`,
                              borderRadius: 6, background: BG,
                              fontSize: 12.5, lineHeight: 1.35, color: INK2,
                            }}>
                              <span style={{
                                color: g.tone, flexShrink: 0,
                                width: 22, height: 22, borderRadius: 5,
                                background: `${g.tone}10`,
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Icon size={12} strokeWidth={2} />
                              </span>
                              <span>{shortLabel(d, 48)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 05 PROCESS — visual horizontal stepper */}
              <Section id="process" num="05" title="Process flow">
                <ProcessStepper steps={v.steps} weeks={decisionWeeks} />
              </Section>

              {/* 06 FAQ */}
              {faqs.length > 0 && (
                <Section id="faq" num="06" title="FAQ">
                  <VisaFaq faqs={faqs} />
                </Section>
              )}
            </main>

            {/* sticky TOC */}
            <aside className="hidden lg:block" style={{ width: 200, flexShrink: 0 }}>
              <div className="sticky" style={{ top: 96 }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 600, color: MID2,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  marginBottom: 10, paddingLeft: 12,
                }}>On this page</div>
                <nav style={{ display: 'flex', flexDirection: 'column' }}>
                  {tabs.map((t, i) => (
                    <a key={t.id} href={`#${t.id}`}
                       style={{
                         fontSize: 12.5, color: MID, textDecoration: 'none',
                         padding: '6px 12px', borderLeft: `1px solid ${BORDER}`,
                         display: 'flex', alignItems: 'center', gap: 8,
                       }}
                       className="hover:text-[#1A1F36] hover:border-l-[#635BFF]">
                      <span style={{ fontSize: 10, color: FAINT, fontVariantNumeric: 'tabular-nums', minWidth: 14 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {t.label}
                    </a>
                  ))}
                </nav>
                <div style={{
                  marginTop: 22, padding: 14, background: BG2,
                  border: `1px solid ${BORDER}`, borderRadius: 10,
                }}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 600, color: MID2,
                    letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
                  }}>Total minimum</div>
                  <div style={{
                    fontSize: 22, fontWeight: 600, color: INK,
                    letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums',
                  }}>
                    £{totalMin.toLocaleString()}
                  </div>
                  {/* mini stacked bar */}
                  <div style={{
                    display: 'flex', height: 5, borderRadius: 999,
                    overflow: 'hidden', background: BORDER, marginTop: 8,
                  }}>
                    <div style={{ width: `${feeShare}%`, background: ACCENT }} />
                    <div style={{ width: `${ihsShare}%`, background: ACCENT2 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: MID, marginTop: 6 }}>
                    <span>Fee {feeShare}%</span>
                    <span>IHS {ihsShare}%</span>
                  </div>
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

/* ═══════════════════ VISUAL PRIMITIVES ═══════════════════ */

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        paddingBottom: 8, marginBottom: 14, borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: MID2,
                       letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums' }}>{num}</span>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: INK,
                     letterSpacing: '-0.015em', margin: 0 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Tag({ label, accent, warn }: { label: string; accent?: boolean; warn?: boolean }) {
  const bg = accent ? ACCENT_SOFT : warn ? WARN_SOFT : BG2;
  const ink = accent ? ACCENT_DK : warn ? WARN : INK2;
  const bd = accent ? `${ACCENT}33` : warn ? '#F5D88B' : BORDER;
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 500, color: ink,
      background: bg, border: `1px solid ${bd}`,
      padding: '4px 8px', borderRadius: 5,
      fontVariantNumeric: 'tabular-nums',
    }}>{label}</span>
  );
}

function Donut({ feeShare, ihsShare, total }: { feeShare: number; ihsShare: number; total: number }) {
  const r = 42, c = 2 * Math.PI * r;
  const feeArc = (feeShare / 100) * c;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
      <circle cx="60" cy="60" r={r} fill="none" stroke={BG3} strokeWidth="14" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={ACCENT}
              strokeWidth="14" strokeDasharray={`${feeArc} ${c}`} strokeLinecap="butt"
              transform="rotate(-90 60 60)" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={ACCENT2}
              strokeWidth="14" strokeDasharray={`${c - feeArc} ${c}`}
              strokeDashoffset={-feeArc} strokeLinecap="butt"
              transform="rotate(-90 60 60)" />
      <text x="60" y="56" textAnchor="middle" fontSize="9" fontWeight="600" fill={MID2}
            style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>TOTAL</text>
      <text x="60" y="74" textAnchor="middle" fontSize="16" fontWeight="600" fill={INK}
            style={{ letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
        £{(total / 1000).toFixed(total >= 10000 ? 0 : 1)}k
      </text>
    </svg>
  );
}

function KV({ swatch, label, value, pct }: { swatch: string; label: string; value: string; pct: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: swatch }} />
          <span style={{ fontSize: 11.5, color: MID, fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: INK,
                       fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{value}</span>
      </div>
      <div style={{ height: 3, background: BG3, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: swatch }} />
      </div>
    </div>
  );
}

function SpeedBar({ weeks, pct, inside }: { weeks: number; pct: number; inside: string }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 12, background: BG }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: MID2,
                       letterSpacing: '0.06em', textTransform: 'uppercase' }}>Decision speed</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: INK,
                       fontVariantNumeric: 'tabular-nums' }}>{weeks}w</span>
      </div>
      <div style={{ height: 6, background: BG3, borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: ACCENT,
                       borderRadius: 999 }} />
      </div>
      <div style={{ fontSize: 11, color: MID, fontVariantNumeric: 'tabular-nums' }}>
        Inside UK · {inside.replace(/\s*\(.*?\)/g, '')}
      </div>
    </div>
  );
}

function DifficultyMeter({ level, label, count }: { level: number; label: string; count: number }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 12, background: BG }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: MID2,
                       letterSpacing: '0.06em', textTransform: 'uppercase' }}>Complexity</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: INK }}>{label}</span>
      </div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{
            flex: 1, height: 6, borderRadius: 2,
            background: i < level ? ACCENT : BG3,
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: MID }}>{count} criteria to meet</div>
    </div>
  );
}

function FamilyChip({ allowed }: { allowed: boolean }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 12, background: BG }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: MID2,
                       letterSpacing: '0.06em', textTransform: 'uppercase' }}>Dependants</span>
        <span style={{
          fontSize: 10.5, fontWeight: 600,
          color: allowed ? POSITIVE : WARN,
          background: allowed ? POSITIVE_SOFT : WARN_SOFT,
          border: `1px solid ${allowed ? '#BFE3D3' : '#F5D88B'}`,
          padding: '1.5px 6px', borderRadius: 3,
        }}>{allowed ? 'Allowed' : 'Limited'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Users size={14} strokeWidth={1.8} color={INK2} />
        <span style={{ fontSize: 12, color: INK2 }}>Partner + children eligible</span>
      </div>
    </div>
  );
}

function FactTile({
  icon: Icon, label, value, small,
}: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
      label: string; value: string; small?: boolean }) {
  return (
    <div style={{
      border: `1px solid ${BORDER}`, borderRadius: 8, background: BG,
      padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: 6, background: BG2,
        color: ACCENT_DK, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={13} strokeWidth={1.8} />
      </span>
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: MID2,
                      letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{
          fontSize: small ? 13 : 16, fontWeight: 600, color: INK,
          letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.15,
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function CostStackChart({
  fee, ihsTotal, years, ihsPerYear, totalMin, slug,
}: { fee: number; ihsTotal: number; years: number; ihsPerYear: number; totalMin: number; slug: string }) {
  const priority = 500, superPri = 1000;
  const max = totalMin + superPri;
  const rows = [
    { label: 'Application fee', value: fee,      tone: ACCENT,   req: true,  sub: 'One-off' },
    { label: 'IHS surcharge',   value: ihsTotal, tone: ACCENT2,  req: true,  sub: `£${ihsPerYear}/yr × ${years}y` },
    { label: 'Priority',        value: priority, tone: WARN,     req: false, sub: '5-day decision' },
    { label: 'Super-priority',  value: superPri, tone: PINK,     req: false, sub: 'Next working day' },
    { label: 'Per dependant',   value: fee + ihsTotal, tone: MID2, req: false, sub: 'Same fee × per person' },
  ];
  return (
    <div style={{
      border: `1px solid ${BORDER}`, borderRadius: 10, background: BG, padding: 16,
    }}>
      {/* Top: total bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: MID, fontWeight: 500 }}>Required cost for {years}y leave</span>
          <span style={{ fontSize: 19, fontWeight: 600, color: INK,
                         letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            £{totalMin.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', background: BG3 }}>
          <div title={`Fee £${fee}`}
               style={{ width: `${(fee / totalMin) * 100}%`, background: ACCENT }} />
          <div title={`IHS £${ihsTotal}`}
               style={{ width: `${(ihsTotal / totalMin) * 100}%`, background: ACCENT2 }} />
        </div>
      </div>

      {/* Per-row bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '150px 1fr 80px',
            gap: 12, alignItems: 'center',
          }} className="visa-cost-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: r.tone, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: INK,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 10.5, color: MID }}>{r.sub}</div>
              </div>
            </div>
            <div style={{ height: 6, background: BG3, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${(r.value / max) * 100}%`, height: '100%', background: r.tone,
                            opacity: r.req ? 1 : 0.65 }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: 12.5, fontWeight: 600, color: INK,
                          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
              {r.req ? '' : '+'}£{r.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Legend + calc link */}
      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BORDER}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 10.5, color: MID }}>
          <Legend swatch={ACCENT}  label="Required" />
          <Legend swatch={WARN}    label="Optional speed-up" />
          <Legend swatch={MID2}    label="Per extra person" />
        </div>
        <Link href={`/tools/cost-calculator?visa=${slug}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                       fontSize: 12, fontWeight: 500, color: ACCENT, textDecoration: 'none' }}>
          <Calculator size={11} strokeWidth={2.2} /> Full calculator
        </Link>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: 2, background: swatch }} />
      {label}
    </span>
  );
}

function ProcessStepper({ steps, weeks }: { steps: { title: string; desc: string }[]; weeks: number }) {
  const cum = steps.map((_, i) => Math.round(((i + 1) / steps.length) * weeks));
  return (
    <div>
      {/* horizontal stepper on lg, vertical on mobile */}
      <div className="hidden md:block">
        <div style={{ position: 'relative', display: 'grid',
                       gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
                       gap: 8, paddingTop: 4 }}>
          <div style={{
            position: 'absolute', top: 16, left: '5%', right: '5%', height: 1,
            background: BORDER, zIndex: 0,
          }} />
          {steps.map((s, i) => (
            <div key={i} style={{ position: 'relative', zIndex: 1,
                                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                                  textAlign: 'center', gap: 8 }}>
              <span style={{
                width: 32, height: 32, borderRadius: 999, background: BG,
                border: `1.5px solid ${ACCENT}`, color: ACCENT_DK,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                boxShadow: `0 0 0 4px ${BG}`,
              }}>
                {i + 1}
              </span>
              <div style={{
                fontSize: 11, fontWeight: 600, color: MID2,
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                Week {cum[i]}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: INK, lineHeight: 1.3,
                            maxWidth: 130 }}>
                {shortLabel(s.title, 32)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* mobile: vertical compact */}
      <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr',
            gap: 12, paddingBottom: 12,
            borderLeft: i < steps.length - 1 ? `1px dashed ${BORDER}` : 'none',
            marginLeft: 16, paddingLeft: 16,
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute', left: -16, top: 0,
              width: 32, height: 32, borderRadius: 999, background: BG,
              border: `1.5px solid ${ACCENT}`, color: ACCENT_DK,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
            }}>{i + 1}</span>
            <div style={{ gridColumn: 2 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: ACCENT_DK,
                            letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>
                Week {cum[i]}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: INK }}>
                {shortLabel(s.title, 48)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
