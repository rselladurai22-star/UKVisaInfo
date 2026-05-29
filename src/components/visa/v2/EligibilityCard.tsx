/**
 * EligibilityCard — flat scannable list of every condition that
 * must be met. One row per condition: short headline + Yes-pill.
 * No paragraphs. Eye-trackable in under 8 seconds.
 */

import { CheckCircle2 } from 'lucide-react';

const INK     = '#18181B';
const PAPER   = '#FFFFFF';
const CREAM   = '#FFFFFF';
const EMERALD = '#6366F1';
const MUTED   = '#6B7280';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  items: string[];
}

export default function EligibilityCard({ items }: Props) {
  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(11,15,25,0.08)' }}>
      <div className="px-5 md:px-7 py-3 flex items-center justify-between"
           style={{ background: CREAM, borderBottom: `1px solid ${HAIR}` }}>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
              style={{ color: MUTED }}>
          All {items.length} must match
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em]"
              style={{ color: EMERALD }}>
          <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
          Checklist
        </span>
      </div>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="px-5 md:px-7 py-4 flex items-start gap-4"
              style={{ borderBottom: i < items.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
            <span aria-hidden
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] tabular-nums"
                  style={{ background: INK, color: '#fff', fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 700 }}>
              {i + 1}
            </span>
            <span className="flex-1 text-[14px] leading-[1.65]" style={{ color: INK }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
