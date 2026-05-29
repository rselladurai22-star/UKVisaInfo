'use client';

/**
 * RefusalsCard — interactive top-5 refusal reasons.
 * Each chip expands to show CAUSE + HOW TO AVOID + gov.uk source.
 */

import { useState } from 'react';
import { AlertTriangle, ChevronDown, ExternalLink } from 'lucide-react';
import type { RefusalReason } from '../../../data/visaRefusals';

const INK     = '#18181B';
const PAPER   = '#FFFFFF';
const CREAM   = '#FFFFFF';
const EMERALD = '#6366F1';
const GOLD    = '#6366F1';
const SLATE   = '#3F3F46';
const MUTED   = '#6B7280';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  reasons: RefusalReason[];
}

export default function RefusalsCard({ reasons }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (reasons.length === 0) return null;

  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(11,15,25,0.08)' }}>
      <ul>
        {reasons.map((r, i) => {
          const isOpen = openId === r.id;
          return (
            <li key={r.id} style={{ borderBottom: i < reasons.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
              <button type="button"
                      onClick={() => setOpenId(isOpen ? null : r.id)}
                      aria-expanded={isOpen}
                      className="w-full text-left px-5 md:px-7 py-4 flex items-center gap-4 transition-colors">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(245,158,11,0.12)', color: '#92400e' }}>
                  <AlertTriangle className="w-4 h-4" strokeWidth={2.2} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.18em] mb-0.5"
                        style={{ color: MUTED }}>
                    Refusal #{i + 1}
                  </span>
                  <span className="block text-[14.5px] font-semibold leading-snug" style={{ color: INK }}>
                    {r.title}
                  </span>
                </span>
                <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform"
                             style={{ color: MUTED, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              {isOpen && (
                <div className="px-5 md:px-7 pb-5 pt-1"
                     style={{ background: CREAM }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <Block label="Cause"
                           color="#B45309"
                           dot="#F59E0B"
                           body={r.cause} />
                    <Block label="How to avoid"
                           color={EMERALD}
                           dot={EMERALD}
                           body={r.fix} />
                  </div>
                  <a href={r.source} target="_blank" rel="noopener noreferrer"
                     className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-semibold transition-colors"
                     style={{ color: EMERALD }}>
                    <ExternalLink className="w-3 h-3" />
                    {r.sourceLabel}
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="px-5 md:px-7 py-3.5 flex items-center justify-between"
           style={{ background: CREAM, borderTop: `1px solid ${HAIR}` }}>
        <span className="text-[11.5px]" style={{ color: SLATE }}>
          Got a refusal letter? <a href="/tools/refusal-analyzer" className="underline font-semibold" style={{ color: INK }}>Decode it</a>.
        </span>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] inline-flex items-center gap-1.5"
              style={{ color: GOLD }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
          Curated · gov.uk sourced
        </span>
      </div>
    </div>
  );
}

function Block({ label, color, dot, body }: { label: string; color: string; dot: string; body: string }) {
  return (
    <div className="rounded-2xl p-4"
         style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
           style={{ color }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
        {label}
      </div>
      <p className="text-[13.5px] leading-[1.6]" style={{ color: INK }}>{body}</p>
    </div>
  );
}
