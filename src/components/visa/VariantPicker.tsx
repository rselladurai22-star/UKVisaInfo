'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink, ShieldCheck, ChevronRight, ArrowRight, CheckCircle2,
} from 'lucide-react';
import type { VisaVariant } from '../../data/visaVariants';

interface Props {
  variants: VisaVariant[];
  /** Used to deep-link to the calculator with a route filter */
  visaId: string;
  accent?: string;
}

/**
 * Interactive sub-route picker — shown at the top of /visa/[slug] guides
 * for routes with verified variants. Click a tab to swap the fee, key
 * eligibility highlights, source citation, and pre-filled calculator
 * link. Renders inline; no extra routes needed.
 */
export default function VariantPicker({ variants, visaId, accent = '#00C4B4' }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!variants.length) return null;
  const v = variants[activeIdx];

  return (
    <section className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.06)' }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#F3F4F6]"
        style={{ background: `${accent}08` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-[3px] h-4 rounded-full" style={{ background: accent }} />
          <div className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#6B7280]">Sub-routes</div>
        </div>
        <h2 className="font-bold text-[#0A2540] text-[20px] md:text-[22px] tracking-[-0.015em]"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          Which sub-route applies to you?
        </h2>
        <p className="mt-1 text-[14px] text-[#374151] leading-relaxed">
          Select a route to see its specific fees and eligibility requirements.
        </p>
      </div>

      {/* Tab strip */}
      <div className="px-5 pt-4 pb-1 flex flex-wrap gap-2 border-b border-[#F3F4F6]">
        {variants.map((vv, i) => {
          const isActive = i === activeIdx;
          return (
            <button key={vv.id} type="button" onClick={() => setActiveIdx(i)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-100 mb-3"
              style={isActive
                ? { background: accent, color: '#fff', boxShadow: `0 4px 12px -4px ${accent}66` }
                : { background: '#F3F4F6', color: '#374151' }}>
              {vv.label}
              {typeof vv.feeAmount === 'number' && (
                <span className={`text-[11px] ${isActive ? 'text-white/80' : 'text-[#6B7280]'}`}>
                  £{vv.feeAmount.toLocaleString('en-GB')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active variant detail */}
      <div className="grid grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F3F4F6]">
        {/* Left: eligibility highlights */}
        <div className="col-span-12 md:col-span-7 p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-1">
            {v.label}
          </div>
          <div className="font-bold text-[17px] text-[#0A2540] leading-snug mb-1"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            {v.headline}
          </div>
          {v.fee && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-bold border"
              style={{ background: `${accent}0c`, borderColor: `${accent}30`, color: '#0A2540' }}>
              {v.fee}
            </div>
          )}

          <ul className="space-y-3 mt-4">
            {v.eligibilityHighlights.map((line, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                <span className="text-[14.5px] text-[#111827] leading-snug">{line}</span>
              </li>
            ))}
          </ul>

          {v.notes && v.notes.length > 0 && (
            <ul className="mt-4 space-y-2 pl-6 border-l-2" style={{ borderColor: `${accent}40` }}>
              {v.notes.map((n, i) => (
                <li key={i} className="text-[13px] text-[#374151] leading-snug">{n}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: fee meta + actions */}
        <div className="col-span-12 md:col-span-5 p-6">
          <dl className="rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] divide-y divide-[#F3F4F6] mb-4 overflow-hidden">
            {typeof v.feeAmount === 'number' && (
              <RowItem label="Application fee" value={`£${v.feeAmount.toLocaleString('en-GB')}`} />
            )}
            {typeof v.ihsAdult === 'number' && (
              <RowItem label="IHS (adult/yr)" value={`£${v.ihsAdult.toLocaleString('en-GB')}`} />
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
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-white text-[13.5px] font-bold transition-all active:scale-[0.98]"
              style={{ background: accent, boxShadow: `0 4px 14px -4px ${accent}66` }}>
              <span>Calculate your full cost</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={v.source} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[13px] font-semibold text-[#374151] hover:border-[#0A2540] hover:text-[#0A2540] transition-colors">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                gov.uk source for this route
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function RowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <dt className="text-[12.5px] text-[#6B7280] font-medium">{label}</dt>
      <dd className="text-[13px] font-bold text-[#0A2540] tabular-nums">{value}</dd>
    </div>
  );
}

/* ChevronRight just to keep tsc happy if unused down the line. */
export const _ChevronRight = ChevronRight;
