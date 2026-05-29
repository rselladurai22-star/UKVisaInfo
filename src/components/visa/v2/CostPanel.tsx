'use client';

/**
 * CostPanel — inline live-updating cost summary for the visa page.
 *
 * Reads the current scenario from the URL and computes:
 *   - Application fee × applicants
 *   - IHS × years × applicants
 *   - Priority (+£500) — toggle preview
 *   - Total cost
 *
 * Below the totals there is "Open full breakdown ▸" which launches
 * CostDialog with the same scenario pre-filled. Two presentations of
 * the same answer — quick glance + power-user detail.
 */

import { useMemo, useState } from 'react';
import { Banknote, ShieldCheck, Zap, ArrowUpRight, Calculator, Info } from 'lucide-react';
import { useScenario, familyCounts } from './useScenario';
import type { VisaVariant } from '../../../data/visaVariants';
import CostDialog from './CostDialog';

const INK     = '#18181B';
const CREAM   = '#FFFFFF';
const PAPER   = '#FFFFFF';
const EMERALD = '#6366F1';
const GOLD    = '#6366F1';
const SLATE   = '#3F3F46';
const MUTED   = '#6B7280';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  slug: string;
  variants: VisaVariant[];
  /** Years on the visa — fallback if variant.duration missing. */
  defaultYears: number;
  /** Default variant id. */
  defaultVariant: string;
  /** Variant ids that allow dependants — usually all of them. */
  allowDependants: boolean;
  /** Fallback fees when the variant has no specific numbers. */
  baseFeeOutside3y: number;
  baseFeeOutside5y?: number;
  baseFeeInside3y?: number;
  baseFeeInside5y?: number;
  /** Annual IHS for the main applicant (defaults to £1,035 adult). */
  ihsAdult: number;
  ihsChild: number;
}

export default function CostPanel(props: Props) {
  const { scenario } = useScenario({ defaultVariant: props.defaultVariant });
  const [open, setOpen] = useState(false);

  const variant = useMemo(
    () => props.variants.find(v => v.id === scenario.v) ?? props.variants[0],
    [props.variants, scenario.v]
  );

  const { adults, children } = familyCounts(scenario.fam);
  const years = props.defaultYears;

  const ihsAdult = variant?.ihsAdult ?? props.ihsAdult;
  const ihsChild = variant?.ihsChild ?? props.ihsChild;

  // Fee resolution by from + duration band
  const fee = useMemo(() => {
    const variantFee = variant?.feeAmount;
    if (variantFee && scenario.from === 'outside') return variantFee;
    if (scenario.from === 'outside') {
      return years > 3 && props.baseFeeOutside5y ? props.baseFeeOutside5y : props.baseFeeOutside3y;
    }
    if (scenario.from === 'inside') {
      const inside3 = props.baseFeeInside3y ?? props.baseFeeOutside3y;
      const inside5 = props.baseFeeInside5y ?? props.baseFeeOutside5y ?? inside3;
      return years > 3 ? inside5 : inside3;
    }
    return props.baseFeeOutside3y;
  }, [variant, scenario.from, years, props]);

  const feeMain  = fee * 1;
  const feeDeps  = fee * (adults - 1) + fee * children;
  const ihsMain  = ihsAdult * years;
  const ihsDeps  = ihsAdult * (adults - 1) * years + ihsChild * children * years;
  const total    = feeMain + feeDeps + ihsMain + ihsDeps;

  const totalWithPriority = total + 500;
  const totalWithSuper    = total + 1000;

  return (
    <>
      <div className="rounded-3xl overflow-hidden"
           style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(11,15,25,0.08)' }}>

        {/* HEADLINE */}
        <div className="px-6 md:px-8 py-6 md:py-7"
             style={{ borderBottom: `1px solid ${HAIR}` }}>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2.5"
                 style={{ color: GOLD }}>
                Your total for this scenario
              </p>
              <p className="tabular-nums leading-none"
                 style={{ fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 700, fontSize: 'clamp(2.4rem, 5.5vw, 3.6rem)', letterSpacing: '-0.04em', color: INK }}>
                {gbp(total)}
              </p>
              <p className="mt-2 text-[13px]" style={{ color: SLATE }}>
                {adults} adult{adults > 1 ? 's' : ''}{children > 0 ? ` · ${children} child${children > 1 ? 'ren' : ''}` : ''} ·{' '}
                {years} year{years > 1 ? 's' : ''} · {scenario.from === 'outside' ? 'outside UK' : 'inside UK'}
              </p>
            </div>
            <button type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                    style={{ background: INK, color: CREAM }}>
              <Calculator className="w-3.5 h-3.5" />
              Open full breakdown
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BREAKDOWN GRID */}
        <div className="px-6 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          <Row icon={Banknote} label="Application fee" sub={`${gbp(fee)} × ${adults + children}`} value={gbp(feeMain + feeDeps)} />
          <Row icon={ShieldCheck} label="IHS (NHS)" sub={`${gbp(ihsAdult)}/yr · ${years} yrs`} value={gbp(ihsMain + ihsDeps)} />
          <Row icon={Zap} label="If priority (+5d)" sub="optional add-on" value={`+${gbp(500)}`} />
          <Row icon={Zap} label="If super-priority" sub="next working day" value={`+${gbp(1000)}`} highlight />
        </div>

        {/* FOOTER NOTE */}
        <div className="px-6 md:px-8 py-4 flex items-start gap-2.5"
             style={{ background: CREAM, borderTop: `1px solid ${HAIR}` }}>
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: SLATE }} />
          <p className="text-[12px] leading-[1.6]" style={{ color: SLATE }}>
            Figures use the gov.uk fee table effective <strong style={{ fontWeight: 700, color: INK }}>8 April 2026</strong>.
            With priority: <strong style={{ fontWeight: 700, color: INK }}>{gbp(totalWithPriority)}</strong> ·
            with super-priority: <strong style={{ fontWeight: 700, color: INK }}>{gbp(totalWithSuper)}</strong>.
          </p>
        </div>
      </div>

      {open && (
        <CostDialog
          slug={props.slug}
          scenario={scenario}
          adults={adults}
          childrenCount={children}
          years={years}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function gbp(n: number) {
  return `£${n.toLocaleString('en-GB')}`;
}

function Row({ icon: Icon, label, sub, value, highlight }:
  { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    label: string; sub: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
           style={{ color: MUTED }}>
        <Icon className="w-3 h-3" strokeWidth={2.5} />
        {label}
      </div>
      <p className="tabular-nums leading-[1.05]"
         style={{
           fontFamily: 'var(--font-grotesk), sans-serif',
           fontWeight: 700,
           fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
           letterSpacing: '-0.022em',
           color: highlight ? EMERALD : INK,
         }}>
        {value}
      </p>
      <p className="mt-1 text-[11.5px]" style={{ color: SLATE }}>{sub}</p>
    </div>
  );
}
