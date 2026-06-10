'use client';

/**
 * ProcessingCard — three tiles for Standard / Priority / Super-priority.
 * Reads scenario.from to swap between inside-UK and outside-UK timings,
 * and overlays nationality-specific processing nuance when relevant.
 */

import { Clock, Zap, AlertCircle } from 'lucide-react';
import { useScenario } from './useScenario';
import { NATIONALITIES } from '../../../data/visaNationalities';

const INK     = '#18181B';
const PAPER   = '#FFFFFF';
const CREAM   = '#FFFFFF';
const EMERALD = '#6366F1';
const SLATE   = '#3F3F46';
const MUTED   = '#6B7280';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  processing: { outside: string; inside: string };
  defaultVariant: string;
}

export default function ProcessingCard({ processing, defaultVariant }: Props) {
  const { scenario } = useScenario({ defaultVariant });
  const nat = NATIONALITIES.find(n => n.code === scenario.nat) ?? NATIONALITIES[0];
  const standard = scenario.from === 'outside' ? processing.outside : processing.inside;
  const isAvailable = standard && !/^n\/a/i.test(standard.trim());

  if (!isAvailable) {
    return (
      <div className="rounded-3xl p-5 flex items-start gap-3"
           style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.30)' }}>
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#92400e' }} />
        <p className="text-[13.5px] leading-[1.6]" style={{ color: '#5c3d10' }}>
          This route is not available {scenario.from === 'outside' ? 'from outside the UK' : 'from inside the UK'}.
          Switch the "Apply from" filter above to see the timings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <Tile
        accent={SLATE}
        label="Standard"
        time={standard}
        cost="Included"
        note={scenario.from === 'inside' ? 'Section 3C leave protects you while you wait' : 'Decision letter by email + eVisa'}
      />
      <Tile
        accent={EMERALD}
        label="Priority"
        time="5 working days"
        cost="+£500"
        note="Faster decision · no extra forms"
      />
      <Tile
        accent={INK}
        label="Super-priority"
        time="Next working day"
        cost="+£1,000"
        note="Use only when start date is tight"
        emphasise
      />

      {/* Nationality nuance */}
      {nat.note && (
        <div className="md:col-span-3 rounded-2xl p-4 flex items-start gap-3 mt-1"
             style={{ background: CREAM, border: `1px solid ${HAIR}` }}>
          <span className="text-[16px] leading-none mt-0.5">{nat.flag}</span>
          <div className="flex-1 text-[13px] leading-[1.6]" style={{ color: SLATE }}>
            <strong style={{ fontWeight: 700, color: INK }}>{nat.name}:</strong> {nat.note}
            {nat.tbTest && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#92400e' }}>
                TB test required
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Tile({ accent, label, time, cost, note, emphasise }:
  { accent: string; label: string; time: string; cost: string; note: string; emphasise?: boolean }) {
  return (
    <div className="rounded-3xl p-5"
         style={{
           background: emphasise ? INK : PAPER,
           color: emphasise ? '#FFFFFF' : INK,
           border: `1px solid ${emphasise ? 'rgba(250,250,247,0.10)' : HAIR}`,
           boxShadow: emphasise ? '0 8px 26px -10px rgba(11,15,25,0.30)' : '0 2px 12px -6px rgba(11,15,25,0.08)',
         }}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
           style={{ color: emphasise ? 'rgba(250,250,247,0.65)' : MUTED }}>
        {label === 'Standard' ? <Clock className="w-3 h-3" strokeWidth={2.5} /> : <Zap className="w-3 h-3" strokeWidth={2.5} />}
        {label}
      </div>
      <p className="tabular-nums leading-[1.05] mb-1.5"
         style={{
           fontFamily: 'var(--font-grotesk), sans-serif',
           fontWeight: 700,
           fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)',
           letterSpacing: '-0.028em',
           color: emphasise ? '#FFFFFF' : INK,
         }}>
        {time}
      </p>
      <p className="text-[12.5px] font-semibold mb-2 tabular-nums"
         style={{ color: emphasise ? '#A7F3D0' : accent }}>
        {cost}
      </p>
      <p className="text-[11.5px] leading-[1.5]"
         style={{ color: emphasise ? 'rgba(250,250,247,0.55)' : SLATE }}>
        {note}
      </p>
    </div>
  );
}
