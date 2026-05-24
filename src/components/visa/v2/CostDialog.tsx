'use client';

/**
 * CostDialog — modal that shows the line-by-line cost breakdown for the
 * current scenario, plus a CTA to the full /tools/cost-calculator for
 * power-user editing (currencies, alternate durations, etc.)
 *
 * The dialog is read-only on purpose — the ScenarioBar is the editor.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShieldCheck, ExternalLink, Calculator, ArrowRight } from 'lucide-react';
import type { Scenario } from './useScenario';

const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const PAPER   = '#FFFFFF';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  slug: string;
  scenario: Scenario;
  adults: number;
  childrenCount: number;
  years: number;
  onClose: () => void;
}

export default function CostDialog({ slug, scenario, adults, childrenCount, years, onClose }: Props) {
  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const calcUrl =
    `/tools/cost-calculator?visa=${encodeURIComponent(slug)}` +
    `&from=${scenario.from}&fam=${scenario.fam}&v=${scenario.v}&nat=${scenario.nat}`;

  return (
    <div role="dialog" aria-modal="true" aria-label="Full cost breakdown"
         className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
         style={{ background: 'rgba(11,15,25,0.55)', backdropFilter: 'blur(6px)' }}
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full md:max-w-[640px] max-h-[92dvh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
           style={{ background: PAPER, boxShadow: '0 24px 60px -16px rgba(11,15,25,0.40)' }}
           onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 md:px-8 py-5 flex items-center justify-between"
             style={{ background: PAPER, borderBottom: `1px solid ${HAIR}` }}>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: GOLD }}>
              Cost breakdown
            </p>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22, letterSpacing: '-0.022em', color: INK, lineHeight: 1.1 }}>
              Every fee, line by line
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
                  className="w-9 h-9 rounded-full inline-flex items-center justify-center transition-colors active:scale-[0.96]"
                  style={{ background: CREAM, border: `1px solid ${HAIR}`, color: INK }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scenario echo */}
        <div className="px-6 md:px-8 py-4 flex flex-wrap items-center gap-2 text-[11.5px]"
             style={{ background: CREAM, borderBottom: `1px solid ${HAIR}`, color: SLATE }}>
          <span style={{ color: MUTED }}>For:</span>
          <Chip>{scenario.from === 'outside' ? 'Outside UK' : 'Inside UK'}</Chip>
          <Chip>{adults} adult{adults > 1 ? 's' : ''}{childrenCount > 0 ? ` + ${childrenCount} child${childrenCount > 1 ? 'ren' : ''}` : ''}</Chip>
          <Chip>{years} yr{years > 1 ? 's' : ''}</Chip>
          <Chip>{scenario.v}</Chip>
        </div>

        {/* Lines */}
        <div className="px-6 md:px-8 py-6">
          <p className="text-[13px] leading-[1.6] mb-5" style={{ color: SLATE }}>
            Each line is a real Home Office charge — application fees come from the master gov.uk fee table
            (effective 8 April 2026). IHS is per gov.uk/healthcare-immigration-application.
          </p>

          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: MUTED }}>
            What you will pay
          </p>

          <ul className="space-y-0">
            <Line label="Application fee — main applicant" detail="Paid online with the form. Non-refundable." />
            {(adults > 1 || childrenCount > 0) && (
              <Line label="Application fee — dependants"
                    detail={`${adults - 1} partner${adults - 1 === 1 ? '' : 's'}, ${childrenCount} child${childrenCount === 1 ? '' : 'ren'}. Each at the full fee.`} />
            )}
            <Line label="Immigration Health Surcharge (IHS)"
                  detail={`Paid upfront for the full visa length. £1,035/yr adult, £776/yr child. ${years} years total.`} />
            <Line label="Biometric enrolment (UKVCAS)"
                  detail={scenario.from === 'inside' ? '£19.20 standard appointment. Premium centres £69+.' : 'Free at most overseas VACs. Some centres charge a local enrolment fee.'} />
            <Line label="Priority service (optional)"
                  detail="5 working days · £500 surcharge. Skip if you can plan ahead." />
            <Line label="Super-priority (optional)"
                  detail="Next working day · £1,000 surcharge. Worth it only for tight start dates." />
          </ul>
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 px-6 md:px-8 py-4 flex items-center justify-between gap-3 flex-wrap"
             style={{ background: PAPER, borderTop: `1px solid ${HAIR}` }}>
          <div className="flex items-center gap-2 text-[11.5px]" style={{ color: SLATE }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: EMERALD }} />
            <span>Figures verified against gov.uk · 8 April 2026 fee table</span>
          </div>
          <Link href={calcUrl}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                style={{ background: INK, color: CREAM }}>
            <Calculator className="w-3.5 h-3.5" />
            Open full calculator
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
          style={{ background: PAPER, border: `1px solid ${HAIR}`, color: INK }}>
      {children}
    </span>
  );
}

function Line({ label, detail }: { label: string; detail: string }) {
  return (
    <li className="py-3.5 flex items-start gap-4"
        style={{ borderBottom: `1px solid ${HAIR}` }}>
      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: EMERALD }} />
      <div className="flex-1">
        <p className="text-[14px] font-semibold leading-snug" style={{ color: INK }}>{label}</p>
        <p className="mt-0.5 text-[12.5px] leading-[1.55]" style={{ color: SLATE }}>{detail}</p>
      </div>
    </li>
  );
}
