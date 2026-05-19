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
export default function VariantPicker({ variants, visaId, accent = '#d9152b' }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!variants.length) return null;
  const v = variants[activeIdx];

  return (
    <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
      <div className="mb-4">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: accent }}>
          Sub-routes
        </div>
        <h2 className="font-display text-[1.375rem] md:text-[1.625rem] font-bold text-[#0a1530] tracking-[-0.015em] leading-tight">
          Which sub-route applies to you?
        </h2>
        <p className="mt-2 text-[13.5px] text-[#52596e] leading-relaxed">
          Switching between tabs reveals the fees, eligibility and gov.uk source for that specific variant.
        </p>
      </div>

      {/* Tab strip */}
      <div className="flex flex-wrap gap-1.5 mb-5 pb-4 border-b border-[rgba(14,20,36,0.06)]">
        {variants.map((vv, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={vv.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors duration-100 ${
                isActive
                  ? 'text-white'
                  : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#e6eaf5] hover:text-[#0a1530]'
              }`}
              style={isActive ? { background: accent } : undefined}
            >
              {vv.label}
            </button>
          );
        })}
      </div>

      {/* Active variant detail */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-7">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9aa3b8]">
            {v.label}
          </div>
          <div className="mt-1 font-display font-bold text-[18px] text-[#0a1530] leading-tight">
            {v.headline}
          </div>
          {v.fee && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f7f9fd] border border-[rgba(14,20,36,0.06)] text-[12.5px] font-semibold text-[#0a1530] tabular-nums">
              {v.fee}
            </div>
          )}

          <ul className="mt-5 space-y-2">
            {v.eligibilityHighlights.map((line, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#1a2240] leading-snug">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {v.notes && v.notes.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {v.notes.map((n, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px] text-[#7a8195] leading-snug">
                  <span className="text-[#d9152b]">•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Meta panel */}
        <div className="col-span-12 md:col-span-5">
          <dl className="rounded-2xl bg-[#fafbfd] border border-[rgba(14,20,36,0.06)] p-4 space-y-3 text-[13px]">
            {typeof v.feeAmount === 'number' && (
              <Row label="Application fee" value={`£${v.feeAmount.toLocaleString('en-GB')}`} />
            )}
            {typeof v.ihsAdult === 'number' && (
              <Row label="IHS (adult)" value={`£${v.ihsAdult.toLocaleString('en-GB')}/yr`} />
            )}
            {v.duration && <Row label="Duration" value={v.duration} />}
            {typeof v.yearsToIlr === 'number' && (
              <Row label="Time to ILR" value={`${v.yearsToIlr} year${v.yearsToIlr === 1 ? '' : 's'}`} />
            )}
            {typeof v.yearsToCitizenship === 'number' && (
              <Row label="ILR → Citizenship" value={v.yearsToCitizenship === 0 ? 'Immediate' : `${v.yearsToCitizenship} year${v.yearsToCitizenship === 1 ? '' : 's'}`} />
            )}
          </dl>

          <div className="mt-3 space-y-2">
            <Link
              href={`/tools/cost-calculator?visa=${visaId}&variant=${v.id}`}
              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-white font-bold text-[13px] shadow-[0_4px_14px_rgba(217,21,43,0.32)] active:scale-[0.98] transition-transform"
              style={{ background: accent }}
            >
              <span className="flex items-center gap-2">
                💰 Calculate your full cost
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-100" />
            </Link>
            <a
              href={v.source}
              target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-[rgba(14,20,36,0.1)] text-[12.5px] font-semibold text-[#52596e] hover:border-[#0a1530] hover:text-[#0a1530] transition-colors duration-100"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                gov.uk source for this variant
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-[11.5px] uppercase tracking-[0.08em] text-[#9aa3b8] font-semibold flex-shrink-0">
        {label}
      </dt>
      <dd className="text-[12.5px] font-semibold text-[#0a1530] text-right tabular-nums leading-tight">
        {value}
      </dd>
    </div>
  );
}

/* ChevronRight just to keep tsc happy if unused down the line. */
export const _ChevronRight = ChevronRight;
