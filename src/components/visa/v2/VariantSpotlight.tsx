'use client';

/**
 * VariantSpotlight — shows the picked sub-route's headline, highlights
 * and gov.uk source, so the user always understands what scenario
 * the page is currently configured for.
 */

import { useMemo } from 'react';
import { Sparkles, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useScenario } from './useScenario';
import type { VisaVariant } from '../../../data/visaVariants';

const INK     = '#0B0F19';
const PAPER   = '#FFFFFF';
const CREAM   = '#FAFAF7';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  variants: VisaVariant[];
  defaultVariant: string;
}

export default function VariantSpotlight({ variants, defaultVariant }: Props) {
  const { scenario } = useScenario({ defaultVariant });
  const v = useMemo(
    () => variants.find((x) => x.id === scenario.v) ?? variants[0],
    [variants, scenario.v]
  );
  if (!v || variants.length < 2) return null;

  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(11,15,25,0.08)' }}>
      <div className="px-5 md:px-7 py-4 flex items-center gap-3"
           style={{ background: CREAM, borderBottom: `1px solid ${HAIR}` }}>
        <span className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(184,134,11,0.15)', color: GOLD }}>
          <Sparkles className="w-4 h-4" strokeWidth={2.2} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
            Sub-route applied
          </p>
          <p style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 17, letterSpacing: '-0.018em', color: INK, lineHeight: 1.1 }}>
            {v.label}
          </p>
        </div>
        <span className="hidden md:inline-block text-[11.5px] tabular-nums px-2.5 py-1 rounded-full"
              style={{ color: SLATE, background: PAPER, border: `1px solid ${HAIR}` }}>
          {v.headline}
        </span>
      </div>

      <ul className="px-5 md:px-7 py-4 space-y-2.5">
        {v.eligibilityHighlights.map((h, i) => (
          <li key={i} className="flex items-start gap-3 text-[13.5px] leading-[1.55]"
              style={{ color: INK }}>
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: EMERALD }} />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {v.notes && v.notes.length > 0 && (
        <ul className="px-5 md:px-7 pb-4 space-y-1.5">
          {v.notes.map((n, i) => (
            <li key={i} className="text-[12.5px] leading-[1.55]" style={{ color: SLATE }}>
              <span className="mr-1.5" style={{ color: MUTED }}>·</span>{n}
            </li>
          ))}
        </ul>
      )}

      <div className="px-5 md:px-7 py-3" style={{ background: CREAM, borderTop: `1px solid ${HAIR}` }}>
        <a href={v.source} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold"
           style={{ color: EMERALD }}>
          <ExternalLink className="w-3 h-3" />
          Verified on gov.uk
        </a>
      </div>
    </div>
  );
}
