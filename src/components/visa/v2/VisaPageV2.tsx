/**
 * VisaPageV2 — cheat-sheet visa layout (POC: Skilled Worker).
 *
 * Server-rendered shell. Client islands handle:
 *   - ScenarioBar    (URL state)
 *   - VariantSpotlight, CostPanel, CostDialog, ProcessingCard, ApplyCta
 *
 * All static content (eligibility, documents, refusals) is server-rendered
 * for SEO. The dynamic numerics + apply URL update from the URL params.
 */

import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, ShieldCheck, Sparkles, AlertTriangle,
  Banknote, Clock, Calendar, Stethoscope, ChevronRight,
} from 'lucide-react';
import type { VisaDetail } from '../../../data/visaDetails';
import type { VisaVariant } from '../../../data/visaVariants';
import { getRefusalsFor } from '../../../data/visaRefusals';
import { FROM_VISAS } from '../../../data/visaSwitching';
import VisaStickyBar from '../VisaStickyBar';
import VisaFaq from '../VisaFaq';
import RelatedBlogToVisa from '../../RelatedBlogToVisa';
import StickyMobileCta from '../../StickyMobileCta';
import EditorByline from '../../EditorByline';
import LegalDisclaimer from '../../LegalDisclaimer';
import ScenarioBar from './ScenarioBar';
import VariantSpotlight from './VariantSpotlight';
import CostPanel from './CostPanel';
import ProcessingCard from './ProcessingCard';
import ApplyCta from './ApplyCta';
import EligibilityCard from './EligibilityCard';
import DocumentsCard from './DocumentsCard';
import RefusalsCard from './RefusalsCard';

const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const PAPER   = '#FFFFFF';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

const CATEGORY_LABEL: Record<string, string> = {
  Work:   'Work route',
  Study:  'Study route',
  Family: 'Family route',
  Visit:  'Visit route',
};

interface Props {
  slug: string;
  visa: VisaDetail;
  variants: VisaVariant[];
  faqs: { question: string; answer: string }[];
  defaultYears: number;
  baseFeeOutside3y: number;
  baseFeeOutside5y?: number;
  baseFeeInside3y?: number;
  baseFeeInside5y?: number;
  ihsAdult: number;
  ihsChild: number;
  allowDependants: boolean;
}

function isAvailable(value?: string) {
  return !!value && !/^n\/a/i.test(value.trim());
}

export default function VisaPageV2({
  slug, visa, variants, faqs, defaultYears,
  baseFeeOutside3y, baseFeeOutside5y, baseFeeInside3y, baseFeeInside5y,
  ihsAdult, ihsChild, allowDependants,
}: Props) {
  const refusals = getRefusalsFor(slug);
  const switchOptions = FROM_VISAS.find((f) => f.id === slug);
  const categoryLabel = CATEGORY_LABEL[visa.category] ?? 'UK visa';

  const hasOutside = isAvailable(visa.processing.outside);
  const hasInside  = isAvailable(visa.processing.inside);
  const defaultFrom = hasOutside ? 'outside' : 'inside';
  const defaultVariant = variants[0]?.id ?? 'standard';

  const headlineFee = (visa.fee.match(/£[\d,]+/) ?? ['—'])[0];
  const yearsBadge  = variants[0]?.yearsToIlr
    ? `${variants[0].yearsToIlr} yrs to ILR`
    : visa.duration.split(/[;,·]/)[0].trim();

  return (
    <>
      <VisaStickyBar title={visa.title} fee={visa.fee} applyUrl={visa.applyUrl} slug={slug} />

      {/* ═══ HERO ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-[96px] md:pt-[112px] pb-10 md:pb-14"
               style={{ background: CREAM }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none"
             style={{
               background:
                 'radial-gradient(ellipse at 10% 10%, rgba(4,120,87,0.05) 0px, transparent 55%),' +
                 'radial-gradient(ellipse at 90% 75%, rgba(184,134,11,0.05) 0px, transparent 55%)',
             }} />
        <div aria-hidden className="absolute inset-0 opacity-[0.18] pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle, rgba(11,15,25,0.10) 1px, transparent 1px)',
               backgroundSize: '32px 32px',
               maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)',
               WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)',
             }} />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10">
          <div className="pt-1 pb-6">
            <Link href="/visa-types"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
                  style={{ color: SLATE }}>
              <ArrowLeft className="w-4 h-4" />
              All visa routes
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge tone="emerald" icon={<span className="w-1.5 h-1.5 rounded-full" style={{ background: EMERALD }} />}>
              {categoryLabel}
            </Badge>
            <Badge tone="paper" icon={<ShieldCheck className="w-3 h-3" style={{ color: EMERALD }} />}>
              Verified · {visa.updated}
            </Badge>
            <Badge tone="paper" icon={<Sparkles className="w-3 h-3" style={{ color: GOLD }} />}>
              Cheat-sheet view
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-7">
              <h1 style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 600,
                fontSize: 'clamp(2rem, 5vw, 3.6rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.035em',
                color: INK,
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}>
                {visa.title}
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] md:text-[17.5px] leading-[1.55]"
                 style={{ color: SLATE }}>
                {visa.tagline}
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 md:gap-4">
              <Stat label="Fee from"  value={headlineFee}             icon={Banknote} highlight />
              <Stat label="Decision"  value={visa.processing.outside} icon={Clock} />
              <Stat label="IHS / yr"  value={visa.ihs.replace(/ \/ year.*$/, '')} icon={Stethoscope} />
              <Stat label="To ILR"    value={yearsBadge}              icon={Calendar} />
            </div>
          </div>
        </div>
      </section>

      {/* Byline + YMYL disclaimer — first thing the reader sees below hero */}
      <div style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-4 pb-2 space-y-3">
          <EditorByline verified={visa.updated} />
          <LegalDisclaimer variant="inline" />
        </div>
      </div>

      {/* ═══ SCENARIO BAR (sticky, frosted) ═════════════ */}
      <ScenarioBar
        variants={variants}
        allowDependants={allowDependants}
        hasInside={hasInside}
        hasOutside={hasOutside}
        defaultVariant={defaultVariant}
        defaultFrom={defaultFrom}
      />

      {/* ═══ CONTENT ════════════════════════════════════ */}
      <div style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-16 space-y-12 md:space-y-16">

          {/* SUB-ROUTE SPOTLIGHT */}
          {variants.length > 1 && (
            <SectionShell eyebrow="01 — Sub-route" title="Your chosen route">
              <VariantSpotlight variants={variants} defaultVariant={defaultVariant} />
            </SectionShell>
          )}

          {/* ELIGIBILITY */}
          <SectionShell
            eyebrow={`${variants.length > 1 ? '02' : '01'} — Eligibility`}
            title="Are you eligible?"
            sub="Every line below must be true on the day you apply.">
            <EligibilityCard items={visa.eligibility} />
          </SectionShell>

          {/* COST */}
          <SectionShell
            eyebrow={`${variants.length > 1 ? '03' : '02'} — Cost for your scenario`}
            title="What it will cost"
            sub="Live total — changes when you switch family or sub-route in the bar above.">
            <CostPanel
              slug={slug}
              variants={variants}
              defaultYears={defaultYears}
              defaultVariant={defaultVariant}
              allowDependants={allowDependants}
              baseFeeOutside3y={baseFeeOutside3y}
              baseFeeOutside5y={baseFeeOutside5y}
              baseFeeInside3y={baseFeeInside3y}
              baseFeeInside5y={baseFeeInside5y}
              ihsAdult={ihsAdult}
              ihsChild={ihsChild}
            />
          </SectionShell>

          {/* PROCESSING */}
          <SectionShell
            eyebrow={`${variants.length > 1 ? '04' : '03'} — Processing time`}
            title="When will you hear back?"
            sub="Three speed tiers from the Home Office.">
            <ProcessingCard processing={visa.processing} defaultVariant={defaultVariant} />
          </SectionShell>

          {/* DOCUMENTS */}
          <SectionShell
            eyebrow={`${variants.length > 1 ? '05' : '04'} — Documents`}
            title="What you will upload"
            sub="Tick each item as you collect it — your progress is saved in this view.">
            <DocumentsCard documents={visa.documents} />
          </SectionShell>

          {/* REFUSALS */}
          {refusals.length > 0 && (
            <SectionShell
              eyebrow={`${variants.length > 1 ? '06' : '05'} — Why people get refused`}
              title="Top 5 refusal reasons"
              sub="Tap a row to see the cause + how to avoid it. Sources cite the gov.uk rule.">
              <RefusalsCard reasons={refusals} />
            </SectionShell>
          )}

          {/* APPLY */}
          <SectionShell
            eyebrow={`${variants.length > 1 ? '07' : '06'} — Apply`}
            title="Direct to the form"
            sub="We deep-link to the first page of the actual gov.uk application — no agents, no middlemen.">
            <ApplyCta slug={slug} visaTitle={visa.title} fallbackUrl={visa.applyUrl} defaultVariant={defaultVariant} />
          </SectionShell>

          {/* SWITCH PATHS */}
          {switchOptions && switchOptions.switches.length > 0 && (
            <SectionShell
              eyebrow={`${variants.length > 1 ? '08' : '07'} — After this visa`}
              title="Where you can go next"
              sub="Common routes you can switch to from this visa.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {switchOptions.switches.slice(0, 6).map((s) => (
                  <Link key={s.toSlug + s.toTitle}
                        href={`/visa/${s.toSlug}`}
                        className="group rounded-2xl p-5 flex items-start gap-4 transition-colors"
                        style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
                              style={{ color: s.difficulty === 'Common' ? EMERALD : s.difficulty === 'Conditional' ? GOLD : MUTED }}>
                          {s.difficulty}
                        </span>
                        <span className="text-[10.5px]" style={{ color: MUTED }}>·</span>
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                          {s.category}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-semibold mb-1.5" style={{ color: INK }}>
                        {s.toTitle}
                      </h3>
                      <p className="text-[12.5px] leading-[1.55]" style={{ color: SLATE }}>{s.note}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5"
                                  style={{ color: MUTED }} />
                  </Link>
                ))}
              </div>
            </SectionShell>
          )}

          {/* PITFALLS */}
          {visa.notes && visa.notes.length > 0 && (
            <SectionShell
              eyebrow={`${variants.length > 1 ? '09' : '08'} — Pitfalls`}
              title="Things that catch people out">
              <div className="space-y-2.5">
                {visa.notes.map((note, i) => (
                  <div key={i} className="rounded-2xl p-5 flex items-start gap-4"
                       style={{ background: '#FBF6E7', border: '1px solid rgba(184,134,11,0.30)' }}>
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(184,134,11,0.15)', color: GOLD }}>
                      <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </span>
                    <p className="text-[13.5px] leading-[1.65] flex-1" style={{ color: '#3F2E0A' }}>
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </SectionShell>
          )}

          {/* FAQ */}
          {faqs.length > 0 && (
            <SectionShell
              eyebrow="10 — FAQ"
              title="Common questions">
              <div className="rounded-3xl p-5 md:p-7"
                   style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(11,15,25,0.08)' }}>
                <VisaFaq faqs={faqs} />
              </div>
            </SectionShell>
          )}

          {/* SOURCE / TRUST */}
          <div className="rounded-3xl p-5 flex items-start gap-3"
               style={{ background: 'rgba(4,120,87,0.05)', border: '1px solid rgba(4,120,87,0.18)' }}>
            <ShieldCheck className="w-4 h-4 mt-0.5" style={{ color: EMERALD }} />
            <p className="text-[12.5px] leading-[1.65]" style={{ color: '#064E3B' }}>
              All numbers verified against gov.uk pages — fee table effective <strong style={{ fontWeight: 700 }}>8 April 2026</strong>,
              processing times from the latest published service standards. Last audit: <strong style={{ fontWeight: 700 }}>{visa.updated}</strong>.
              <a href="https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026"
                 target="_blank" rel="noopener noreferrer"
                 className="ml-2 inline-flex items-center gap-1 font-semibold transition-colors" style={{ color: EMERALD }}>
                Master fee table <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <RelatedBlogToVisa visaSlug={slug} />
        </div>
      </div>

      <StickyMobileCta
        context={`${visa.category} · Apply`}
        label="Apply on gov.uk"
        href={visa.applyUrl}
        external
        accent={EMERALD}
      />
    </>
  );
}

/* ─────────── helpers ─────────── */

function SectionShell({ eyebrow, title, sub, children }:
  { eyebrow: string; title: string; sub?: string; children: React.ReactNode }) {
  const sectionId = eyebrow.toLowerCase().split('—')[1]?.trim().replace(/\s+/g, '-') ?? eyebrow.toLowerCase().replace(/\s+/g, '-');
  return (
    <section id={sectionId} className="scroll-mt-32">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-3"
         style={{ color: GOLD }}>{eyebrow}</p>
      <h2 className="mb-3"
          style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 600,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            letterSpacing: '-0.028em',
            lineHeight: 1.08,
            color: INK,
          }}>
        {title}
      </h2>
      {sub && (
        <p className="mb-6 text-[14.5px] leading-[1.6] max-w-2xl" style={{ color: SLATE }}>{sub}</p>
      )}
      {children}
    </section>
  );
}

function Badge({ tone, icon, children }:
  { tone: 'emerald' | 'paper'; icon: React.ReactNode; children: React.ReactNode }) {
  const isEmerald = tone === 'emerald';
  return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase px-3 py-1.5 rounded-full"
          style={{
            background: isEmerald ? 'rgba(4,120,87,0.08)' : PAPER,
            color: isEmerald ? EMERALD : INK,
            border: `1px solid ${isEmerald ? 'rgba(4,120,87,0.18)' : HAIR}`,
            letterSpacing: '0.18em',
          }}>
      {icon}
      {children}
    </span>
  );
}

function Stat({ label, value, highlight, icon: Icon }:
  { label: string; value: string; highlight?: boolean;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }) {
  return (
    <div className="rounded-2xl p-4 md:p-5"
         style={{
           background: highlight ? INK : PAPER,
           color: highlight ? CREAM : INK,
           border: `1px solid ${highlight ? 'rgba(250,250,247,0.10)' : HAIR}`,
           boxShadow: highlight
             ? '0 8px 26px -10px rgba(11,15,25,0.30)'
             : '0 2px 12px -6px rgba(11,15,25,0.08)',
         }}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] mb-2.5"
           style={{ color: highlight ? 'rgba(250,250,247,0.65)' : MUTED }}>
        <Icon className="w-3 h-3" strokeWidth={2.5} />
        {label}
      </div>
      <p className="tabular-nums leading-[1.05]"
         style={{
           fontFamily: 'Fraunces, serif',
           fontWeight: 700,
           fontSize: 'clamp(1.2rem, 2.3vw, 1.5rem)',
           letterSpacing: '-0.028em',
           color: highlight ? CREAM : INK,
         }}>
        {value}
      </p>
    </div>
  );
}
