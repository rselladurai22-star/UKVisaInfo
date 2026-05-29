import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ExternalLink, Calculator, ChevronRight,
  FileText, Wallet, Briefcase, ShieldCheck, GraduationCap,
  Heart, Plane, Users, Globe2, Languages, BadgeCheck, FileSignature,
  CreditCard, Building2, Stethoscope, Fingerprint, ArrowUpRight,
  TrendingUp, Clock, Target, Layers,
} from 'lucide-react';
import { VISA_DETAILS, type VisaDetail } from '../../../data/visaDetails';
import { VISA_FAQS } from '../../../data/visaFaqs';
import VisaTabNav from '../../../components/visa/VisaTabNav';
import VisaFaq from '../../../components/visa/VisaFaq';
import VisaStickyBar from '../../../components/visa/VisaStickyBar';
import StickyMobileCta from '../../../components/StickyMobileCta';
import { getVariants, type VisaVariant } from '../../../data/visaVariants';
import VisaPageV2 from '../../../components/visa/v2/VisaPageV2';
import { VISA_FEES, hasV2Layout } from '../../../data/visaFees';
import EditorByline from '../../../components/EditorByline';
import LegalDisclaimer from '../../../components/LegalDisclaimer';
import { primaryEditorSchema } from '../../../data/editorialTeam';

/* ════════════════════════════════════════════════
   QUARTZ — terminal-grade design tokens
═══════════════════════════════════════════════════ */
const C = {
  ink:    '#0A0F1F',  // near-black
  ink2:   '#18181B',
  ink3:   '#3F3F46',
  mid:    '#52525B',
  mid2:   '#8792A2',
  faint:  '#A3ACB9',
  bg:     '#FFFFFF',
  bg2:    '#FAFBFC',
  bg3:    '#F4F6F8',
  bg4:    '#EDEFF3',
  border: '#ECECEF',
  borderS:'#CFD7DF',
  hair:   '#EDF0F4',  // hairline grid
  accent: '#6366F1',
  accent2:'#8B85FF',
  accentDk:'#4F47CC',
  accentSoft:'#EFEEFF',
  ok:     '#08855D',
  okSoft: '#E6F7EF',
  warn:   '#BF6A02',
  warnSoft:'#FCEDD3',
  pink:   '#CD3D64',
  pinkSoft:'#FCE6EC',
  teal:   '#0B7285',
  tealSoft:'#E0F2F4',
};

interface RouteParams { params: Promise<{ slug: string }> }

const CATEGORY_LABEL: Record<string, string> = { Work: 'Work', Study: 'Study', Family: 'Family', Visit: 'Visit' };
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
  const title = `${v.title} 2026 — Fees, Eligibility & Process`;
  const description = `${v.summary} Fee ${v.fee}. IHS ${v.ihs}. Decision in ${v.processing.outside}. Verified ${v.updated}.`;
  return {
    title, description,
    alternates: { canonical: `/visa/${slug}` },
    openGraph: {
      title, description, url: `https://ukvisainfo.co.uk/visa/${slug}`, type: 'article',
      images: [{ url: `https://ukvisainfo.co.uk/visa/${slug}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/* ─── numeric & label extractors ─── */
const gbp = (s: string): number => {
  const m = s.match(/£([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
};
const weeks = (s: string): number => {
  const m = s.match(/(\d+)\s*(week|day|month)/i);
  if (!m) return 3;
  const n = parseInt(m[1], 10);
  const u = m[2].toLowerCase();
  if (u.startsWith('day'))   return Math.max(1, Math.round(n / 7));
  if (u.startsWith('month')) return n * 4;
  return n;
};
const years = (s: string): number => {
  const m = s.match(/(\d+)\s*year/i);
  return m ? parseInt(m[1], 10) : 5;
};
const shortLabel = (s: string, max = 44): string => {
  const cleaned = s.replace(/\(.*?\)/g, '').replace(/[,;:].*$/, '').trim();
  return cleaned.length <= max ? cleaned : cleaned.slice(0, max - 1).trimEnd() + '…';
};

function docIcon(d: string) {
  const l = d.toLowerCase();
  if (/passport|biometric|nationality|share code|brp|evisa/.test(l))     return Fingerprint;
  if (/english|ielts|selt|language|b1|b2/.test(l))                        return Languages;
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
    { id: 'identity', label: 'Identity', tone: C.accent,  items: [] },
    { id: 'finance',  label: 'Finance',  tone: C.ok,      items: [] },
    { id: 'sponsor',  label: 'Sponsor',  tone: C.warn,    items: [] },
    { id: 'skills',   label: 'Skills & checks', tone: C.pink, items: [] },
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

/* classify each eligibility row into a discipline */
type EligKind = 'finance' | 'lang' | 'sponsor' | 'skill' | 'identity' | 'other';
function classifyElig(s: string): { kind: EligKind; label: string; tone: string; icon: React.ComponentType<{size?:number; strokeWidth?:number; color?:string}> } {
  const l = s.toLowerCase();
  if (/£|salary|fund|bank|maintenance|saving|income|wage/.test(l))
    return { kind: 'finance', label: 'Finance', tone: C.ok, icon: CreditCard };
  if (/english|b1|b2|ielts|selt|language/.test(l))
    return { kind: 'lang', label: 'Language', tone: C.teal, icon: Languages };
  if (/sponsor|cas|cos|licensed|certificate of/.test(l))
    return { kind: 'sponsor', label: 'Sponsor', tone: C.warn, icon: FileSignature };
  if (/qualif|degree|rqf|skill|going rate|atas|phd|profession/.test(l))
    return { kind: 'skill', label: 'Skill', tone: C.accent, icon: BadgeCheck };
  if (/passport|biometric|age|under 18|nationality|consent/.test(l))
    return { kind: 'identity', label: 'Identity', tone: C.pink, icon: Fingerprint };
  return { kind: 'other', label: 'Rule', tone: C.mid, icon: Target };
}

/* aggregate fee bench across all visas for comparison */
function buildBenchmarks() {
  const all = Object.values(VISA_DETAILS);
  const fees = all.map((x) => gbp(x.fee)).filter(Boolean);
  const wks  = all.map((x) => weeks(x.processing.outside)).filter(Boolean);
  const ihss = all.map((x) => gbp(x.ihs)).filter(Boolean);
  const elig = all.map((x) => x.eligibility.length);
  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length));
  return { feeAvg: avg(fees), weekAvg: avg(wks), ihsAvg: avg(ihss), eligAvg: avg(elig) };
}

export default async function VisaPage({ params }: RouteParams) {
  const { slug } = await params;
  const v = VISA_DETAILS[slug];
  if (!v) notFound();

  const faqs = VISA_FAQS[slug] ?? [];
  const variants = getVariants(slug);

  // V2 cheat-sheet layout (rolling out per-visa). Currently: skilled-worker only.
  if (hasV2Layout(slug)) {
    const f = VISA_FEES[slug];
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Article',
          headline: v.title, description: v.summary,
          datePublished: '2026-04-08', dateModified: '2026-05-19',
          author: primaryEditorSchema('https://ukvisainfo.co.uk'),
          publisher: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk', logo: { '@type': 'ImageObject', url: 'https://ukvisainfo.co.uk/icon.svg' } },
          image: `https://ukvisainfo.co.uk/visa/${slug}/opengraph-image`,
          mainEntityOfPage: `https://ukvisainfo.co.uk/visa/${slug}`,
          inLanguage: 'en-GB',
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://ukvisainfo.co.uk' },
            { '@type': 'ListItem', position: 2, name: 'Visa Routes', item: 'https://ukvisainfo.co.uk/visa-types' },
            { '@type': 'ListItem', position: 3, name: v.title,       item: `https://ukvisainfo.co.uk/visa/${slug}` },
          ],
        }) }} />
        {faqs.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: faqs.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
          }) }} />
        )}
        <VisaPageV2
          slug={slug}
          visa={v}
          variants={variants}
          faqs={faqs}
          defaultYears={f.defaultYears}
          baseFeeOutside3y={f.baseFee.out3yr}
          baseFeeOutside5y={f.baseFee.out5yr}
          baseFeeInside3y={f.baseFee.in3yr}
          baseFeeInside5y={f.baseFee.in5yr}
          ihsAdult={f.ihsAdult}
          ihsChild={f.ihsChild}
          allowDependants={f.allowsDependants}
        />
      </>
    );
  }

  const categoryLabel = CATEGORY_LABEL[v.category] ?? 'UK visa';
  const docGroups = categoriseDocuments(v.documents);
  const CatIcon = CATEGORY_ICON[v.category] ?? Globe2;
  const bench = buildBenchmarks();

  const fee = gbp(v.fee);
  const ihsPerYear = gbp(v.ihs);
  const yrs = Math.min(5, Math.max(1, years(v.duration)));
  const ihsTotal = ihsPerYear * yrs;
  const totalMin = fee + ihsTotal;
  const feeShare = totalMin ? Math.round((fee / totalMin) * 100) : 0;
  const ihsShare = 100 - feeShare;
  const decisionWeeks = weeks(v.processing.outside);
  const insideWeeks = weeks(v.processing.inside);
  const eligCount = v.eligibility.length;
  const docCount = v.documents.length;

  // 3yr and 5yr cost options
  const ihsTotal3 = ihsPerYear * Math.min(3, yrs);
  const totalMin3 = fee + ihsTotal3;
  const ihsTotal5 = ihsPerYear * Math.min(5, yrs);
  const totalMin5 = fee + ihsTotal5;

  // Complexity heat (0-5) per row
  const complexityScore = Math.min(5, Math.ceil(eligCount / 1.4));

  const tabs = [
    { id: 'overview',    label: 'Overview' },
    ...(variants.length ? [{ id: 'routes', label: 'Sub-routes' }] : []),
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'costs',       label: 'Costs' },
    { id: 'documents',   label: 'Documents' },
    ...(faqs.length ? [{ id: 'faq', label: 'FAQ' }] : []),
  ];

  /* JSON-LD */
  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: v.title,
    description: v.summary,
    datePublished: '2026-04-08',
    dateModified: '2026-05-19',
    author: primaryEditorSchema('https://ukvisainfo.co.uk'),
    publisher: {
      '@type': 'Organization', name: 'UKDesk',
      url: 'https://ukvisainfo.co.uk',
      logo: { '@type': 'ImageObject', url: 'https://ukvisainfo.co.uk/icon.svg' },
    },
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
    name: `How to apply for a ${v.title}`, totalTime: `P${decisionWeeks}W`,
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'GBP', value: totalMin },
    step: v.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.desc })),
  };
  const faqJsonLd = faqs.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  } : null;

  return (
    <div style={{
      background: C.bg, color: C.ink,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale',
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <VisaStickyBar title={v.title} fee={v.fee} applyUrl={v.applyUrl} slug={slug} />

      {/* ════════════════════════════════════════════
          HERO — terminal-grade composition
      ═══════════════════════════════════════════════ */}
      <header style={{
        borderBottom: `1px solid ${C.border}`,
        background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg} 80%)`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* hairline grid overlay */}
        <svg width="100%" height="100%" style={{
          position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none',
        }} aria-hidden>
          <defs>
            <pattern id="hgrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke={C.hair} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>

        <div style={{
          position: 'relative',
          maxWidth: 1240, margin: '0 auto',
          padding: 'clamp(80px,9vw,96px) clamp(20px,3vw,32px) 32px',
        }}>
          {/* TOP META BAR — monogram + breadcrumb + meta chips */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap', marginBottom: 24,
            paddingBottom: 12, borderBottom: `1px dashed ${C.border}`,
          }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: C.mid }}>
              <Link href="/visa-types" style={{ color: C.mid, textDecoration: 'none', letterSpacing: '0.02em' }}>UK&nbsp;Visas</Link>
              <ChevronRight size={10} color={C.faint} />
              <Link href="/visa-types" style={{ color: C.mid, textDecoration: 'none' }}>{CATEGORY_LABEL[v.category]}</Link>
              <ChevronRight size={10} color={C.faint} />
              <span style={{ color: C.ink2, fontWeight: 500 }}>{v.title}</span>
            </nav>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 10.5, color: C.mid }}>
              <MonoChip label="REF" value={`UKV-${slug.toUpperCase().slice(0, 8)}`} />
              <MonoChip label="REV" value={v.updated.replace(/\s/, '·')} />
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                color: C.ok, fontWeight: 600,
                padding: '3px 8px', background: C.okSoft,
                border: `1px solid #BFE3D3`, borderRadius: 999,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: C.ok }} />
                GOV.UK VERIFIED
              </span>
            </div>
          </div>

          {/* TITLE BLOCK + HERO CHART */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
            gap: 'clamp(24px, 4vw, 56px)',
            alignItems: 'center',
          }} className="visa-hero-grid">
            {/* LEFT */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span style={{
                  width: 38, height: 38, borderRadius: 9, background: C.bg,
                  color: C.accentDk, border: `1px solid ${C.border}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 2px rgba(10,15,31,0.04)',
                }}>
                  <CatIcon size={18} strokeWidth={1.8} />
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: C.accentDk,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>
                  {CATEGORY_LABEL[v.category]} · Route
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(30px, 4vw, 44px)',
                fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.028em',
                color: C.ink, margin: '0 0 14px',
              }}>{v.title}</h1>

              {/* dense KPI row (4 cells, hairline divider, mono numerics) */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                border: `1px solid ${C.border}`, borderRadius: 8,
                background: C.bg, marginBottom: 18, overflow: 'hidden',
              }}>
                <KpiCell icon={Wallet}    label="Total min" v={`£${(totalMin/1000).toFixed(totalMin>=10000?0:1)}k`} delta={fee>bench.feeAvg?'+':'−'} bench={`avg £${(bench.feeAvg/1000).toFixed(0)}k`} />
                <KpiCell icon={Clock}     label="Decision"  v={`${decisionWeeks}w`} delta={decisionWeeks<bench.weekAvg?'−':'+'} bench={`avg ${bench.weekAvg}w`} border />
                <KpiCell icon={Layers}    label="Criteria"  v={`${eligCount}`} delta={eligCount<bench.eligAvg?'−':'+'} bench={`avg ${bench.eligAvg}`} border />
                <KpiCell icon={TrendingUp} label="Leave"    v={`${yrs}y`} delta="" bench="initial" border />
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href={v.applyUrl} target="_blank" rel="noopener noreferrer"
                   style={{
                     display: 'inline-flex', alignItems: 'center', gap: 6,
                     background: C.ink, color: '#fff', fontSize: 13, fontWeight: 500,
                     padding: '10px 14px', borderRadius: 7, textDecoration: 'none',
                     boxShadow: '0 1px 2px rgba(10,15,31,0.16)',
                   }}>
                  Apply on gov.uk <ArrowUpRight size={13} strokeWidth={2} />
                </a>
                <Link href={`/tools/cost-calculator?visa=${slug}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: C.bg, color: C.ink, border: `1px solid ${C.borderS}`,
                        fontSize: 13, fontWeight: 500, padding: '10px 14px',
                        borderRadius: 7, textDecoration: 'none',
                      }}>
                  <Calculator size={13} strokeWidth={2} /> Cost calculator
                </Link>
                <a href="#costs"
                   style={{
                     display: 'inline-flex', alignItems: 'center', gap: 6,
                     color: C.mid, fontSize: 13, fontWeight: 500,
                     padding: '10px 4px', textDecoration: 'none',
                   }}>
                  See cost breakdown <ChevronRight size={13} />
                </a>
              </div>
            </div>

            {/* RIGHT — composed cost meter */}
            <div style={{
              background: C.bg,
              border: `1px solid ${C.border}`, borderRadius: 12,
              padding: 20, position: 'relative', overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(10,15,31,0.04), 0 8px 24px -16px rgba(10,15,31,0.08)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                marginBottom: 16,
              }}>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: C.mid2,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                  }}>Cost composition · {yrs}y leave</div>
                  <div style={{
                    fontSize: 28, fontWeight: 600, color: C.ink, marginTop: 2,
                    letterSpacing: '-0.028em', fontVariantNumeric: 'tabular-nums',
                  }}>£{totalMin.toLocaleString()}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: fee > bench.feeAvg ? C.warn : C.ok,
                  background: fee > bench.feeAvg ? C.warnSoft : C.okSoft,
                  border: `1px solid ${fee > bench.feeAvg ? '#F5D88B' : '#BFE3D3'}`,
                  padding: '3px 7px', borderRadius: 4, letterSpacing: '0.04em',
                }}>
                  {fee > bench.feeAvg ? '↑' : '↓'} {Math.abs(Math.round((fee - bench.feeAvg) / Math.max(1, bench.feeAvg) * 100))}% vs avg
                </span>
              </div>

              <HalfGauge feeShare={feeShare} ihsShare={ihsShare} fee={fee} ihsTotal={ihsTotal} years={yrs} ihsPerYear={ihsPerYear} />

              {/* Footer mini metrics */}
              <div style={{
                marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`,
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
              }}>
                <MiniStat label="Priority +" v="£500" hint="5-day" />
                <MiniStat label="Super-pri +" v="£1k" hint="next day" />
                <MiniStat label="Per dep." v={`£${(fee + ihsTotal).toLocaleString()}`} hint="same fee" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Byline + YMYL disclaimer */}
      <div style={{ background: C.bg2 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto',
                      padding: 'clamp(12px,2vw,16px) clamp(20px,3vw,32px) clamp(4px,1vw,8px)',
                      display: 'flex', flexDirection: 'column', gap: 12 }}>
          <EditorByline verified={v.updated} />
          <LegalDisclaimer variant="inline" />
        </div>
      </div>

      {/* Section anchor nav */}
      <VisaTabNav tabs={tabs} />

      {/* ════════════════════════════════════════════
          BODY
      ═══════════════════════════════════════════════ */}
      <div style={{ background: C.bg }}>
        <div style={{ maxWidth: 1240, margin: '0 auto',
                      padding: 'clamp(28px,4vw,48px) clamp(20px,3vw,32px) 64px' }}>
          <div className="flex flex-col lg:flex-row gap-10">

            <main style={{ flex: 1, minWidth: 0, maxWidth: 880 }} className="space-y-14">

              {/* 01 OVERVIEW — fact matrix + processing times */}
              <Section id="overview" num="01" title="At a glance"
                       meta={`${docCount} documents · ${eligCount} eligibility rules`}>
                <FactMatrix v={v} fee={fee} ihsPerYear={ihsPerYear} totalMin={totalMin}
                            yrs={yrs} complexity={complexityScore} />
                <ProcessingTimes outside={v.processing.outside} inside={v.processing.inside}
                                 outsideWeeks={decisionWeeks} insideWeeks={insideWeeks} />
              </Section>

              {variants.length > 0 && (
                <Section id="routes" num="02" title="Sub-routes"
                         meta={`${variants.length} routes · choose the one that fits you`}>
                  <SubRoutesGuide variants={variants} visaId={slug} />
                </Section>
              )}

              {/* 03 ELIGIBILITY — classified matrix grid */}
              <Section id="eligibility" num={variants.length ? '03' : '02'} title="Eligibility matrix"
                       meta={`${eligCount} rules · all required unless marked conditional`}>
                <EligibilityMatrix items={v.eligibility} />
              </Section>

              {/* 04 COSTS — 3yr + 5yr side-by-side */}
              <Section id="costs" num={variants.length ? '04' : '03'} title="Cost breakdown"
                       meta="Required vs optional · 3-year and 5-year options">
                <CostFlow fee={fee} ihsTotal={ihsTotal} ihsPerYear={ihsPerYear} years={yrs}
                          totalMin={totalMin} totalMin3={totalMin3} totalMin5={totalMin5}
                          ihsTotal3={ihsTotal3} ihsTotal5={ihsTotal5} slug={slug} />
              </Section>

              {/* 05 DOCUMENTS — checklist with completion rings */}
              <Section id="documents" num={variants.length ? '05' : '04'} title="Document register"
                       meta={`${docCount} items · 4 categories · evidence to submit`}>
                <DocumentRegister groups={docGroups} total={docCount} />
              </Section>

              {/* 06 FAQ */}
              {faqs.length > 0 && (
                <Section id="faq" num={variants.length ? '06' : '05'} title="FAQ"
                         meta={`${faqs.length} answered questions`}>
                  <VisaFaq faqs={faqs} />
                </Section>
              )}
            </main>

            {/* sticky TOC */}
            <aside className="hidden lg:block" style={{ width: 224, flexShrink: 0 }}>
              <div className="sticky" style={{ top: 100 }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: C.mid2,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  marginBottom: 12, paddingLeft: 14,
                }}>Sections</div>
                <nav style={{ display: 'flex', flexDirection: 'column' }}>
                  {tabs.map((t, i) => (
                    <a key={t.id} href={`#${t.id}`}
                       style={{
                         fontSize: 12.5, color: C.mid, textDecoration: 'none',
                         padding: '7px 14px', borderLeft: `1px solid ${C.border}`,
                         display: 'flex', alignItems: 'center', gap: 10,
                         fontVariantNumeric: 'tabular-nums',
                       }}
                       className="hover:text-[#0A0F1F] hover:border-l-[#6366F1] hover:bg-[#FAFBFC]">
                      <span style={{ fontSize: 10, color: C.faint, minWidth: 14, fontWeight: 600 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {t.label}
                    </a>
                  ))}
                </nav>
                <SidebarSummary fee={fee} ihsTotal={ihsTotal} totalMin={totalMin}
                                feeShare={feeShare} ihsShare={ihsShare}
                                weeks={decisionWeeks} yrs={yrs} slug={slug} />
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta href={v.applyUrl} label="Apply on gov.uk" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VISUAL PRIMITIVES
═══════════════════════════════════════════════════════ */

function MonoChip({ label, value }: { label: string; value: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 5,
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 10, color: C.mid2,
      padding: '3px 7px', background: C.bg2,
      border: `1px solid ${C.border}`, borderRadius: 4,
      letterSpacing: '0.02em',
    }}>
      <span style={{ fontSize: 9, color: C.faint, fontWeight: 600 }}>{label}</span>
      <span style={{ color: C.ink2, fontWeight: 500 }}>{value}</span>
    </span>
  );
}

function KpiCell({
  icon: Icon, label, v, delta, bench, border,
}: { icon: React.ComponentType<{size?:number; strokeWidth?:number; color?:string}>;
     label: string; v: string; delta: string; bench: string; border?: boolean }) {
  return (
    <div style={{
      padding: '11px 14px',
      borderLeft: border ? `1px solid ${C.border}` : 'none',
      background: C.bg,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Icon size={11} strokeWidth={2} color={C.mid2} />
        <span style={{
          fontSize: 10, fontWeight: 700, color: C.mid2,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{
          fontSize: 18, fontWeight: 600, color: C.ink,
          letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>{v}</span>
        {delta && (
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: delta === '−' ? C.ok : C.warn,
          }}>{delta}</span>
        )}
      </div>
      <div style={{
        fontSize: 10, color: C.faint, marginTop: 3,
        fontVariantNumeric: 'tabular-nums',
      }}>{bench}</div>
    </div>
  );
}

function MiniStat({ label, v, hint }: { label: string; v: string; hint: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: C.mid2,
                    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink,
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{v}</div>
      <div style={{ fontSize: 10, color: C.faint }}>{hint}</div>
    </div>
  );
}

function HalfGauge({
  feeShare, ihsShare, fee, ihsTotal, years, ihsPerYear,
}: { feeShare: number; ihsShare: number; fee: number; ihsTotal: number; years: number; ihsPerYear: number }) {
  // semicircle gauge
  const W = 360, H = 180, cx = W / 2, cy = H - 8, r = 130;
  const polar = (deg: number, rad = r) => {
    const a = ((180 - deg) * Math.PI) / 180;
    return [cx + Math.cos(a) * rad, cy - Math.sin(a) * rad] as const;
  };
  const arcPath = (deg0: number, deg1: number, rad = r) => {
    const [x0, y0] = polar(deg0, rad);
    const [x1, y1] = polar(deg1, rad);
    const large = deg1 - deg0 > 180 ? 1 : 0;
    return `M ${x0} ${y0} A ${rad} ${rad} 0 ${large} 1 ${x1} ${y1}`;
  };
  const feeDeg = (feeShare / 100) * 180;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: 'block' }} aria-label="Cost split">
      {/* Background track */}
      <path d={arcPath(0, 180)} fill="none" stroke={C.bg3} strokeWidth="22" strokeLinecap="butt" />
      {/* Fee arc */}
      <path d={arcPath(0, feeDeg)} fill="none" stroke={C.accent} strokeWidth="22" strokeLinecap="butt" />
      {/* IHS arc */}
      <path d={arcPath(feeDeg, 180)} fill="none" stroke={C.accent2} strokeWidth="22" strokeLinecap="butt" />
      {/* Ticks every 25% */}
      {[0, 25, 50, 75, 100].map((p) => {
        const [x1, y1] = polar((p / 100) * 180, r + 14);
        const [x2, y2] = polar((p / 100) * 180, r + 22);
        return <g key={p}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.borderS} strokeWidth="1" />
          <text x={x2} y={y2 + 9} textAnchor="middle" fontSize="9" fill={C.mid2}
                style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>
            {p}%
          </text>
        </g>;
      })}
      {/* Labels at arc midpoints */}
      <g>
        {(() => {
          const [lx, ly] = polar(feeDeg / 2, r - 36);
          return (
            <>
              <text x={lx} y={ly - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.accentDk}
                    style={{ letterSpacing: '0.1em' }}>FEE</text>
              <text x={lx} y={ly + 9} textAnchor="middle" fontSize="13" fontWeight="600" fill={C.ink}
                    style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
                £{(fee/1000).toFixed(fee>=10000?0:1)}k
              </text>
              <text x={lx} y={ly + 22} textAnchor="middle" fontSize="9" fill={C.mid2}>{feeShare}%</text>
            </>
          );
        })()}
        {(() => {
          const [lx, ly] = polar(feeDeg + (180 - feeDeg) / 2, r - 36);
          return (
            <>
              <text x={lx} y={ly - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#5C56C8"
                    style={{ letterSpacing: '0.1em' }}>IHS · {years}Y</text>
              <text x={lx} y={ly + 9} textAnchor="middle" fontSize="13" fontWeight="600" fill={C.ink}
                    style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
                £{(ihsTotal/1000).toFixed(ihsTotal>=10000?0:1)}k
              </text>
              <text x={lx} y={ly + 22} textAnchor="middle" fontSize="9" fill={C.mid2}>£{ihsPerYear}/yr</text>
            </>
          );
        })()}
      </g>
    </svg>
  );
}

function Section({
  id, num, title, meta, children,
}: { id: string; num: string; title: string; meta?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 16, marginBottom: 16, paddingBottom: 10,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 11, fontWeight: 500, color: C.faint, letterSpacing: '0.04em',
          }}>{num}</span>
          <h2 style={{
            fontSize: 19, fontWeight: 600, color: C.ink,
            letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2,
          }}>{title}</h2>
        </div>
        {meta && (
          <div style={{
            fontSize: 11, color: C.mid, textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
            maxWidth: '50%',
          }}>{meta}</div>
        )}
      </div>
      {children}
    </section>
  );
}

/* ─── At-a-glance matrix ─── */
function FactMatrix({
  v, fee, ihsPerYear, totalMin, yrs, complexity,
}: { v: VisaDetail; fee: number; ihsPerYear: number; totalMin: number; yrs: number; complexity: number }) {
  const hasFamily = /spouse|partner|dependant|child/i.test(v.eligibility.concat(v.documents).join(' '));
  const hasSponsor = /sponsor|cas|cos|licensed/i.test(v.eligibility.join(' '));
  const hasSwitch = !!v.processing.inside && !/^n\/a/i.test(v.processing.inside);
  const items: { k: string; v: string; sub?: string; bar?: number; pillTone?: string; pill?: string }[] = [
    { k: 'Route type',     v: CATEGORY_LABEL[v.category] },
    { k: 'Initial leave',  v: `${yrs} years`, sub: v.duration.split(/[;·]/)[0] },
    { k: 'Total upfront',  v: `£${totalMin.toLocaleString()}`, sub: `fee + ${yrs}y IHS` },
    { k: 'IHS / yr',       v: `£${ihsPerYear.toLocaleString()}`, sub: 'paid upfront for full duration' },
    { k: 'Sponsor needed', v: hasSponsor ? 'Yes' : 'No', pill: hasSponsor ? 'critical' : 'no', pillTone: hasSponsor ? C.warn : C.ok },
    { k: 'Dependants',     v: hasFamily ? 'Allowed' : 'Limited', pill: hasFamily ? 'family' : 'solo', pillTone: hasFamily ? C.ok : C.warn },
    { k: 'Switch in-UK',   v: hasSwitch ? 'Permitted' : 'Not available', pillTone: hasSwitch ? C.ok : C.mid },
    { k: 'Complexity',     v: ['Low','Standard','Moderate','Above avg','High','Very high'][complexity], bar: (complexity/5)*100 },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 1, background: C.border, border: `1px solid ${C.border}`,
      borderRadius: 10, overflow: 'hidden',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{ background: C.bg, padding: '12px 14px' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: C.mid2,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
          }}>{it.k}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{
              fontSize: 15, fontWeight: 600, color: C.ink,
              letterSpacing: '-0.015em', fontVariantNumeric: 'tabular-nums',
            }}>{it.v}</span>
            {it.pill && (
              <span style={{
                fontSize: 9.5, fontWeight: 700,
                color: it.pillTone, background: `${it.pillTone}12`,
                border: `1px solid ${it.pillTone}33`,
                padding: '1px 5px', borderRadius: 3,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>{it.pill}</span>
            )}
          </div>
          {it.sub && (
            <div style={{ fontSize: 10.5, color: C.mid, marginTop: 3 }}>{it.sub}</div>
          )}
          {typeof it.bar === 'number' && (
            <div style={{ marginTop: 6, height: 3, background: C.bg3, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${it.bar}%`, height: '100%', background: C.accent }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Eligibility matrix grid (classified) ─── */
function EligibilityMatrix({ items }: { items: string[] }) {
  return (
    <div style={{
      border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: C.bg,
    }}>
      {/* header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '34px 92px 1fr 80px',
        background: C.bg2, borderBottom: `1px solid ${C.border}`,
        fontSize: 10, fontWeight: 700, color: C.mid2,
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        <div style={{ padding: '8px 0', textAlign: 'center' }}>#</div>
        <div style={{ padding: '8px 12px' }}>Type</div>
        <div style={{ padding: '8px 12px' }}>Requirement</div>
        <div style={{ padding: '8px 12px', textAlign: 'right' }}>Status</div>
      </div>
      {items.map((s, i) => {
        const cls = classifyElig(s);
        const Icon = cls.icon;
        const conditional = /unless|or if|optional|may|might|except/i.test(s);
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '34px 92px 1fr 80px',
            borderTop: i > 0 ? `1px solid ${C.hair}` : 'none',
            alignItems: 'center',
          }}>
            <div style={{
              padding: '11px 0', textAlign: 'center',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 11, color: C.faint, fontVariantNumeric: 'tabular-nums',
              borderRight: `1px solid ${C.hair}`,
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{
              padding: '11px 12px', borderRight: `1px solid ${C.hair}`,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 4,
                background: `${cls.tone}14`, color: cls.tone,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={10} strokeWidth={2.2} />
              </span>
              <span style={{
                fontSize: 10.5, fontWeight: 600, color: C.ink2,
                letterSpacing: '0.04em',
              }}>{cls.label}</span>
            </div>
            <div style={{ padding: '11px 12px', fontSize: 13, lineHeight: 1.45,
                          color: C.ink2, fontWeight: 450 }}>
              {s}
            </div>
            <div style={{ padding: '11px 12px', textAlign: 'right' }}>
              <span style={{
                fontSize: 9.5, fontWeight: 700,
                color: conditional ? C.warn : C.ok,
                background: conditional ? C.warnSoft : C.okSoft,
                border: `1px solid ${conditional ? '#F5D88B' : '#BFE3D3'}`,
                padding: '2px 6px', borderRadius: 3,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{conditional ? 'COND' : 'REQ'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Marimekko-style cost flow with 3yr / 5yr options ─── */
function CostFlow({
  fee, ihsTotal, ihsPerYear, years, totalMin,
  totalMin3, totalMin5, ihsTotal3, ihsTotal5, slug,
}: {
  fee: number; ihsTotal: number; ihsPerYear: number; years: number; totalMin: number;
  totalMin3: number; totalMin5: number; ihsTotal3: number; ihsTotal5: number; slug: string;
}) {
  const rows = [
    { label: 'Application fee', val: fee,      tone: C.accent,  req: true,  to: 'Home Office', sub: 'One-off' },
    { label: 'IHS surcharge',   val: ihsTotal, tone: C.accent2, req: true,  to: 'NHS Insurance', sub: `£${ihsPerYear}/yr × ${years}` },
    { label: 'Priority speed',  val: 500,      tone: C.warn,    req: false, to: 'Optional', sub: '5-day decision' },
    { label: 'Super-priority',  val: 1000,     tone: C.pink,    req: false, to: 'Optional', sub: 'Next working day' },
    { label: 'Per dependant',   val: fee + ihsTotal, tone: C.mid, req: false, to: 'Per extra person', sub: 'Same as primary' },
  ];
  const max = Math.max(...rows.map((r) => r.val));
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: C.bg, overflow: 'hidden' }}>

      {/* ── Duration options: 3yr vs 5yr ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        borderBottom: `1px solid ${C.border}`,
      }}>
        {[
          { label: '3-Year leave', total: totalMin3, ihs: ihsTotal3, yrs: 3 },
          { label: '5-Year leave', total: totalMin5, ihs: ihsTotal5, yrs: 5 },
        ].map((opt, idx) => (
          <div key={idx} style={{
            padding: '18px 20px',
            borderLeft: idx > 0 ? `1px solid ${C.border}` : 'none',
            background: idx === (years >= 5 ? 1 : 0) ? C.accentSoft : C.bg2,
            position: 'relative',
          }}>
            {idx === (years >= 5 ? 1 : 0) && (
              <span style={{
                position: 'absolute', top: 10, right: 12,
                fontSize: 9, fontWeight: 700, color: C.accentDk,
                background: C.bg, border: `1px solid ${C.accent}44`,
                padding: '2px 7px', borderRadius: 999, letterSpacing: '0.1em',
              }}>DEFAULT</span>
            )}
            <div style={{ fontSize: 10, fontWeight: 700, color: C.mid2,
                          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {opt.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: C.ink,
                          letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', marginTop: 4, lineHeight: 1 }}>
              £{opt.total.toLocaleString()}
            </div>
            <div style={{ display: 'flex', height: 5, borderRadius: 999, overflow: 'hidden', background: C.bg3, marginTop: 10 }}>
              <div style={{ width: `${(fee / opt.total) * 100}%`, background: C.accent }} />
              <div style={{ width: `${(opt.ihs / opt.total) * 100}%`, background: C.accent2 }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', gap: 8,
              fontSize: 10, color: C.mid, marginTop: 5, fontVariantNumeric: 'tabular-nums',
            }}>
              <span>Fee £{fee.toLocaleString()}</span>
              <span>IHS £{opt.ihs.toLocaleString()} ({opt.yrs}y)</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Per-row breakdown ── */}
      <div style={{ padding: 18 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: C.mid2,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>Line-by-line allocation</div>
          <Link href={`/tools/cost-calculator?visa=${slug}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                         fontSize: 12, fontWeight: 500, color: C.accentDk,
                         border: `1px solid ${C.border}`, padding: '6px 11px',
                         borderRadius: 6, textDecoration: 'none', background: C.bg }}>
            <Calculator size={11} strokeWidth={2.2} /> Full calc
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '170px 1fr 100px',
              gap: 14, alignItems: 'center', padding: '10px 0',
              borderTop: i > 0 ? `1px dashed ${C.hair}` : 'none',
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 3, height: 14, borderRadius: 2,
                    background: r.tone, opacity: r.req ? 1 : 0.55,
                  }} />
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: C.ink, letterSpacing: '-0.005em' }}>
                    {r.label}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: C.mid, marginTop: 2, paddingLeft: 11 }}>
                  {r.sub} → {r.to}
                </div>
              </div>
              <div style={{ position: 'relative', height: 18 }}>
                <div style={{ position: 'absolute', top: 6, left: 0, right: 0, height: 6,
                              background: C.bg3, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(r.val / max) * 100}%`, height: '100%',
                    background: r.tone, opacity: r.req ? 1 : 0.6,
                    borderTopRightRadius: 999, borderBottomRightRadius: 999,
                  }} />
                </div>
                {!r.req && (
                  <span style={{
                    position: 'absolute', top: -2, left: `${(r.val / max) * 100 + 1}%`,
                    fontSize: 9, fontWeight: 700, color: r.tone,
                    letterSpacing: '0.06em',
                  }}>OPT</span>
                )}
              </div>
              <div style={{
                textAlign: 'right', fontSize: 13, fontWeight: 600, color: C.ink,
                fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
              }}>
                {r.req ? '' : '+'}£{r.val.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.hair}`,
                      display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 10.5, color: C.mid }}>
          <Swatch tone={C.accent} label="Application fee" />
          <Swatch tone={C.accent2} label="NHS surcharge" />
          <Swatch tone={C.warn} label="Optional speed" />
          <Swatch tone={C.pink} label="Premium service" />
          <Swatch tone={C.mid} label="Per extra person" />
        </div>
      </div>
    </div>
  );
}

function Swatch({ tone, label }: { tone: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: tone }} />{label}
    </span>
  );
}

/* ─── Document register w/ ring + tile grid ─── */
function DocumentRegister({ groups, total }: { groups: { id: string; label: string; tone: string; items: string[] }[]; total: number }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: C.bg, overflow: 'hidden' }}>
      {/* Header w/ counts */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr',
        gap: 18, padding: 16, borderBottom: `1px solid ${C.border}`,
        background: C.bg2,
        alignItems: 'center',
      }}>
        <RingProgress total={total} groups={groups} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
          {groups.map((g) => (
            <div key={g.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: g.tone }} />
                <span style={{
                  fontSize: 10, fontWeight: 700, color: C.mid2,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>{g.label}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: C.ink, marginTop: 2,
                            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                {g.items.length}<span style={{ fontSize: 11, color: C.mid, marginLeft: 4 }}>items</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* groups */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {groups.map((g) => (
          <div key={g.id}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
              paddingBottom: 6, borderBottom: `1px dashed ${C.hair}`,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: g.tone }} />
              <span style={{
                fontSize: 11, fontWeight: 700, color: C.ink2,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>{g.label}</span>
              <span style={{ fontSize: 10, color: C.faint, marginLeft: 'auto' }}>
                {g.items.length} required
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 6,
            }}>
              {g.items.map((d, i) => {
                const Icon = docIcon(d);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', border: `1px solid ${C.border}`,
                    borderRadius: 6, background: C.bg,
                    fontSize: 12.5, lineHeight: 1.35, color: C.ink2,
                  }}>
                    <span style={{
                      color: g.tone, flexShrink: 0,
                      width: 22, height: 22, borderRadius: 5,
                      background: `${g.tone}12`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={12} strokeWidth={2} />
                    </span>
                    <span>{shortLabel(d, 56)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RingProgress({ total, groups }: { total: number; groups: { tone: string; items: string[] }[] }) {
  const r = 32, c = 2 * Math.PI * r;
  let offset = 0;
  const segs = groups.map((g) => {
    const frac = g.items.length / Math.max(1, total);
    const seg = { tone: g.tone, dash: frac * c, off: offset };
    offset += seg.dash;
    return seg;
  });
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
      <circle cx="44" cy="44" r={r} fill="none" stroke={C.bg3} strokeWidth="8" />
      {segs.map((s, i) => (
        <circle key={i} cx="44" cy="44" r={r} fill="none"
                stroke={s.tone} strokeWidth="8"
                strokeDasharray={`${s.dash} ${c}`}
                strokeDashoffset={-s.off}
                transform="rotate(-90 44 44)" />
      ))}
      <text x="44" y="40" textAnchor="middle" fontSize="9" fontWeight="700" fill={C.mid2}
            style={{ letterSpacing: '0.12em' }}>DOCS</text>
      <text x="44" y="55" textAnchor="middle" fontSize="16" fontWeight="600" fill={C.ink}
            style={{ fontVariantNumeric: 'tabular-nums' }}>{total}</text>
    </svg>
  );
}

/* ─── Processing Times — inside vs outside UK ─── */
function ProcessingTimes({
  outside, inside: insideStr, outsideWeeks, insideWeeks,
}: { outside: string; inside: string; outsideWeeks: number; insideWeeks: number }) {
  const hasInside = !!insideStr && !/^n\/a/i.test(insideStr);
  const maxW = Math.max(outsideWeeks, insideWeeks, 1);
  return (
    <div style={{
      marginTop: 12,
      display: 'grid', gridTemplateColumns: hasInside ? '1fr 1fr' : '1fr',
      gap: 1, background: C.border, border: `1px solid ${C.border}`,
      borderRadius: 10, overflow: 'hidden',
    }}>
      {/* Outside UK / Fresh application */}
      <div style={{ background: C.bg, padding: '16px 18px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 7, background: C.accentSoft,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plane size={13} strokeWidth={2} color={C.accentDk} />
          </span>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: C.accentDk,
              letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1,
            }}>From outside UK</div>
            <div style={{ fontSize: 10, color: C.mid, marginTop: 1 }}>Fresh application</div>
          </div>
        </div>
        <div style={{
          fontSize: 28, fontWeight: 600, color: C.ink,
          letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>{outsideWeeks}<span style={{ fontSize: 14, fontWeight: 500, color: C.mid, marginLeft: 4 }}>weeks</span></div>
        <div style={{ fontSize: 11.5, color: C.mid, marginTop: 4 }}>{outside}</div>
        <div style={{ marginTop: 10, height: 4, background: C.bg3, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${(outsideWeeks / maxW) * 100}%`, height: '100%', background: C.accent }} />
        </div>
      </div>

      {/* Inside UK / Switching / Extension */}
      {hasInside && (
        <div style={{ background: C.bg, padding: '16px 18px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 7, background: C.okSoft,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Globe2 size={13} strokeWidth={2} color={C.ok} />
            </span>
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, color: C.ok,
                letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1,
              }}>Inside UK switch</div>
              <div style={{ fontSize: 10, color: C.mid, marginTop: 1 }}>Extend / switch route</div>
            </div>
          </div>
          <div style={{
            fontSize: 28, fontWeight: 600, color: C.ink,
            letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}>{insideWeeks}<span style={{ fontSize: 14, fontWeight: 500, color: C.mid, marginLeft: 4 }}>weeks</span></div>
          <div style={{ fontSize: 11.5, color: C.mid, marginTop: 4 }}>{insideStr}</div>
          <div style={{ marginTop: 10, height: 4, background: C.bg3, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${(insideWeeks / maxW) * 100}%`, height: '100%', background: C.ok }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-Routes Guide — premium card grid per variant ─── */

function SubRoutesGuide({ variants, visaId }: { variants: VisaVariant[]; visaId: string }) {
  const tones = [C.accent, C.ok, C.teal, C.warn, C.pink];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {variants.map((vr, i) => {
        const tone = tones[i % tones.length];
        return (
          <div key={vr.id} style={{
            border: `1px solid ${C.border}`,
            borderRadius: 10, background: C.bg, overflow: 'hidden',
          }}>
            {/* Card header */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              gap: 16, padding: '14px 18px',
              background: C.bg2, borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <span style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  background: `${tone}14`, color: tone,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 600, color: C.ink,
                    letterSpacing: '-0.015em', lineHeight: 1.2,
                  }}>{vr.label}</div>
                  <div style={{
                    fontSize: 11.5, color: C.mid, marginTop: 2,
                  }}>{vr.headline}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {vr.fee && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: tone,
                    background: `${tone}10`, border: `1px solid ${tone}33`,
                    padding: '3px 8px', borderRadius: 5, letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>{vr.fee.split('/')[0].trim()}</span>
                )}
                {vr.duration && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: C.mid2,
                    background: C.bg3, border: `1px solid ${C.border}`,
                    padding: '3px 8px', borderRadius: 5,
                    whiteSpace: 'nowrap',
                  }}>{vr.duration}</span>
                )}
              </div>
            </div>

            {/* Eligibility highlights */}
            <div style={{ padding: '12px 18px' }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: C.mid2,
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
              }}>Who qualifies</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {vr.eligibilityHighlights.map((h, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    fontSize: 12.5, lineHeight: 1.5, color: C.ink2,
                  }}>
                    <span style={{
                      marginTop: 4, width: 6, height: 6, borderRadius: 999,
                      background: tone, flexShrink: 0,
                    }} />
                    {h}
                  </div>
                ))}
              </div>

              {/* Costs + path to ILR */}
              {(vr.feeAmount || vr.yearsToIlr) && (
                <div style={{
                  marginTop: 12, display: 'flex', gap: 1,
                  background: C.border, borderRadius: 7, overflow: 'hidden',
                }}>
                  {vr.feeAmount && (
                    <div style={{ flex: 1, background: C.bg, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.mid2,
                                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Fee</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: C.ink,
                                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                        £{vr.feeAmount.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {vr.ihsAdult && (
                    <div style={{ flex: 1, background: C.bg, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.mid2,
                                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>IHS/yr</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: C.ink,
                                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                        £{vr.ihsAdult.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {vr.yearsToIlr && (
                    <div style={{ flex: 1, background: C.bg, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.mid2,
                                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Path to ILR</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: C.ink,
                                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                        {vr.yearsToIlr}y
                        {vr.yearsToCitizenship !== undefined && vr.yearsToCitizenship > 0 && (
                          <span style={{ fontSize: 10.5, color: C.mid, marginLeft: 4 }}>
                            +{vr.yearsToCitizenship}y citizenship
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {vr.notes && vr.notes.length > 0 && (
                <div style={{
                  marginTop: 10, padding: '10px 12px',
                  background: C.warnSoft, border: `1px solid #F5D88B`,
                  borderRadius: 7,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.warn,
                                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Notes</div>
                  {vr.notes.map((n, j) => (
                    <div key={j} style={{ fontSize: 12, color: C.ink2, lineHeight: 1.5, marginTop: j > 0 ? 4 : 0 }}>
                      {n}
                    </div>
                  ))}
                </div>
              )}

              {/* Link to variant page */}
              <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <Link href={`/visa/${visaId}/${vr.id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 12, fontWeight: 500, color: tone,
                        border: `1px solid ${tone}44`, padding: '7px 12px',
                        borderRadius: 6, textDecoration: 'none', background: `${tone}08`,
                      }}>
                  Full guide for {vr.label} <ChevronRight size={11} strokeWidth={2.2} />
                </Link>
                <a href={vr.source} target="_blank" rel="noopener noreferrer"
                   style={{
                     display: 'inline-flex', alignItems: 'center', gap: 5,
                     fontSize: 11, color: C.mid, textDecoration: 'none',
                   }}>
                  <ExternalLink size={10} strokeWidth={2} /> gov.uk
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Sidebar summary widget ─── */
function SidebarSummary({
  fee, ihsTotal, totalMin, feeShare, ihsShare, weeks, yrs, slug,
}: { fee: number; ihsTotal: number; totalMin: number; feeShare: number; ihsShare: number; weeks: number; yrs: number; slug: string }) {
  return (
    <div style={{
      marginTop: 22, padding: 14, background: C.bg2,
      border: `1px solid ${C.border}`, borderRadius: 10,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: C.mid2,
        letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6,
      }}>Quick brief</div>
      <div style={{
        fontSize: 22, fontWeight: 600, color: C.ink,
        letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>£{totalMin.toLocaleString()}</div>
      <div style={{ fontSize: 10.5, color: C.mid, marginTop: 2 }}>
        {yrs}y leave · ~{weeks}w decision
      </div>
      <div style={{
        display: 'flex', height: 5, borderRadius: 999, overflow: 'hidden',
        background: C.border, marginTop: 10,
      }}>
        <div style={{ width: `${feeShare}%`, background: C.accent }} />
        <div style={{ width: `${ihsShare}%`, background: C.accent2 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: 10, color: C.mid, marginTop: 5,
                    fontVariantNumeric: 'tabular-nums' }}>
        <span>Fee £{(fee/1000).toFixed(fee>=10000?0:1)}k</span>
        <span>IHS £{(ihsTotal/1000).toFixed(ihsTotal>=10000?0:1)}k</span>
      </div>
      <Link href={`/tools/cost-calculator?visa=${slug}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 12, fontSize: 11.5, fontWeight: 500, color: C.accentDk,
              textDecoration: 'none', padding: '7px 10px',
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
            }}>
        Cost calculator <ArrowUpRight size={11} strokeWidth={2.2} />
      </Link>
    </div>
  );
}
