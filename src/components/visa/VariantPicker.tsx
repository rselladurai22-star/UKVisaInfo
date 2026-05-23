'use client';

/**
 * VariantPicker — sub-route picker (Editorial Premium)
 * White card on cream, Fraunces serif headlines, emerald accent.
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink, ShieldCheck, ArrowRight, CheckCircle2,
} from 'lucide-react';
import type { VisaVariant } from '../../data/visaVariants';

const INK     = '#1A1F36';
const PAPER   = '#FFFFFF';
const EMERALD = '#635BFF';
const GOLD    = '#5851DB';
const SLATE   = '#3C4257';
const MUTED   = '#697386';
const HAIR    = '#E3E8EE';

interface Props {
  variants: VisaVariant[];
  visaId: string;
  accent?: string;
}

export default function VariantPicker({ variants, visaId, accent }: Props) {
  const tint = accent ?? EMERALD;
  const [activeIdx, setActiveIdx] = useState(0);
  if (!variants.length) return null;
  const v = variants[activeIdx];

  return (
    <section
      className="rounded-3xl overflow-hidden"
      style={{
        background: PAPER,
        border: `1px solid ${HAIR}`,
        boxShadow: '0 2px 16px -8px rgba(26,31,54,0.10)',
      }}>
      {/* Header */}
      <div className="px-7 py-6" style={{ background: 'rgba(99,91,255,0.04)', borderBottom: `1px solid ${HAIR}` }}>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: GOLD }}>
          Sub-routes
        </p>
        <h2 style={{
          fontFamily: '"Inter Tight", Inter, sans-serif',
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: '-0.025em',
          color: INK,
          lineHeight: 1.1,
        }}>
          Which sub-route applies to you?
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: SLATE }}>
          Each sub-route has its own fee and eligibility. Pick the one that fits.
        </p>
      </div>

      {/* Tab strip */}
      <div className="px-6 pt-5 pb-1 flex flex-wrap gap-2" style={{ borderBottom: `1px solid ${HAIR}` }}>
        {variants.map((vv, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={vv.id} type="button" onClick={() => setActiveIdx(i)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-100 mb-3"
              style={isActive
                ? { background: INK, color: '#FCFCFD', boxShadow: '0 4px 14px -4px rgba(26,31,54,0.30)' }
                : { background: 'rgba(26,31,54,0.05)', color: INK }}>
              {vv.label}
              {typeof vv.feeAmount === 'number' && (
                <span className="text-[11px] tabular-nums"
                      style={{ color: isActive ? 'rgba(250,250,247,0.7)' : MUTED }}>
                  £{vv.feeAmount.toLocaleString('en-GB')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active variant detail */}
      <div className="grid grid-cols-12">
        {/* Left: eligibility highlights */}
        <div className="col-span-12 md:col-span-7 p-7" style={{ borderRight: `1px solid ${HAIR}` }}>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: GOLD }}>
            {v.label}
          </p>
          <h3 style={{
            fontFamily: '"Inter Tight", Inter, sans-serif',
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: '-0.018em',
            color: INK,
            lineHeight: 1.25,
            marginBottom: 8,
          }}>
            {v.headline}
          </h3>
          {v.fee && (
            <div className="mt-2 mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12.5px] font-semibold"
                 style={{ background: 'rgba(99,91,255,0.08)', color: EMERALD, border: '1px solid rgba(99,91,255,0.18)' }}>
              {v.fee}
            </div>
          )}

          <ul className="space-y-3 mt-4">
            {v.eligibilityHighlights.map((line, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: EMERALD }} />
                <span className="text-[14.5px] leading-[1.6]" style={{ color: INK }}>{line}</span>
              </li>
            ))}
          </ul>

          {v.notes && v.notes.length > 0 && (
            <ul className="mt-5 space-y-2 pl-5" style={{ borderLeft: '2px solid rgba(88,81,219,0.35)' }}>
              {v.notes.map((n, i) => (
                <li key={i} className="text-[13px] leading-[1.6]" style={{ color: SLATE }}>{n}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: fee meta + actions */}
        <div className="col-span-12 md:col-span-5 p-7">
          <dl className="rounded-2xl overflow-hidden mb-4"
              style={{ background: '#FCFCFD', border: `1px solid ${HAIR}` }}>
            {typeof v.feeAmount === 'number' && (
              <RowItem label="Application fee" value={`£${v.feeAmount.toLocaleString('en-GB')}`} />
            )}
            {typeof v.ihsAdult === 'number' && (
              <RowItem label="IHS (adult / yr)" value={`£${v.ihsAdult.toLocaleString('en-GB')}`} />
            )}
            {v.duration && <RowItem label="Duration" value={v.duration} />}
            {typeof v.yearsToIlr === 'number' && (
              <RowItem label="Time to ILR" value={`${v.yearsToIlr} year${v.yearsToIlr === 1 ? '' : 's'}`} />
            )}
            {typeof v.yearsToCitizenship === 'number' && (
              <RowItem label="ILR → Citizenship" value={v.yearsToCitizenship === 0 ? 'Immediate' : `${v.yearsToCitizenship} yr${v.yearsToCitizenship === 1 ? '' : 's'}`} />
            )}
          </dl>

          <div className="space-y-2">
            <Link href={`/tools/cost-calculator?visa=${visaId}&variant=${v.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-[13.5px] font-semibold transition-all active:scale-[0.98]"
                  style={{
                    background: INK,
                    color: '#FCFCFD',
                    boxShadow: '0 4px 16px -4px rgba(26,31,54,0.30)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = EMERALD; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = INK; }}>
              <span>Calculate your full cost</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={v.source} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
               style={{ background: PAPER, border: `1px solid ${HAIR}`, color: INK }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = EMERALD; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = HAIR; }}>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: EMERALD }} />
                gov.uk source for this route
              </span>
              <ExternalLink className="w-3 h-3" style={{ color: MUTED }} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function RowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${HAIR}` }}>
      <dt className="text-[12.5px] font-medium" style={{ color: MUTED, fontFamily: 'Inter, system-ui, sans-serif' }}>
        {label}
      </dt>
      <dd className="text-[13.5px] tabular-nums"
          style={{
            color: INK,
            fontFamily: '"Inter Tight", Inter, sans-serif',
            fontWeight: 600,
            letterSpacing: '-0.012em',
          }}>
        {value}
      </dd>
    </div>
  );
}
