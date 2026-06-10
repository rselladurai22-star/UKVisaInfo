'use client';

/**
 * ScenarioBar — the persistent filter at the top of every visa page.
 *
 * Four segmented controls collapsed into a single sticky bar:
 *   1. Apply from    — Outside UK / Inside UK
 *   2. Family        — Just me / +Partner / +Children / Family
 *   3. Sub-route     — variant picker (skipped if visa has no variants)
 *   4. Nationality   — surfaces TB / VAC nuances (popover, optional)
 *
 * Selecting any control updates the URL via useScenario, and every
 * downstream client component re-reads the URL to update.
 */

import { useState, useRef, useEffect } from 'react';
import { Plane, Globe2, User, Users, Baby, ChevronDown, Check } from 'lucide-react';
import { useScenario, FAMILY_LABEL, type Family, type ApplyFrom } from './useScenario';
import type { VisaVariant } from '../../../data/visaVariants';
import { NATIONALITIES } from '../../../data/visaNationalities';

const INK     = '#18181B';
const CREAM   = '#FFFFFF';
const PAPER   = '#FFFFFF';
const EMERALD = '#6366F1';
const SLATE   = '#3F3F46';
const MUTED   = '#6B7280';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  variants: VisaVariant[];
  allowDependants: boolean;
  hasInside: boolean;
  hasOutside: boolean;
  defaultVariant: string;
  defaultFrom: ApplyFrom;
}

export default function ScenarioBar({
  variants, allowDependants, hasInside, hasOutside, defaultVariant, defaultFrom,
}: Props) {
  const { scenario, setScenario } = useScenario({ defaultVariant, defaultFrom });

  return (
    <div className="sticky top-[64px] z-30 mt-[-1px]"
         style={{
           background: 'rgba(250,250,247,0.85)',
           backdropFilter: 'saturate(180%) blur(14px)',
           WebkitBackdropFilter: 'saturate(180%) blur(14px)',
           borderTop: `1px solid ${HAIR}`,
           borderBottom: `1px solid ${HAIR}`,
         }}>
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto whitespace-nowrap no-scrollbar">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] mr-2 hidden md:inline-flex items-center gap-1.5"
                style={{ color: MUTED }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: EMERALD }} />
            Your scenario
          </span>

          {/* ── APPLY FROM ── */}
          <Segmented
            ariaLabel="Apply from"
            value={scenario.from}
            onChange={(v) => setScenario({ from: v as ApplyFrom })}
            options={[
              ...(hasOutside ? [{ id: 'outside', label: 'Outside UK', icon: Plane }] : []),
              ...(hasInside  ? [{ id: 'inside',  label: 'Inside UK',  icon: Globe2 }] : []),
            ]}
          />

          {/* ── FAMILY ── */}
          {allowDependants && (
            <Segmented
              ariaLabel="Who is coming with you"
              value={scenario.fam}
              onChange={(v) => setScenario({ fam: v as Family })}
              options={[
                { id: 'solo',    label: 'Just me',       icon: User },
                { id: 'partner', label: '+ Partner',     icon: Users },
                { id: 'kids',    label: '+ Children',    icon: Baby },
                { id: 'family',  label: '+ Family',      icon: Users },
              ]}
            />
          )}

          {/* ── SUB-ROUTE ── */}
          {variants.length > 1 && (
            <VariantPopover variants={variants}
                            current={scenario.v}
                            onChange={(v) => setScenario({ v })} />
          )}

          {/* ── NATIONALITY ── */}
          <NationalityPopover current={scenario.nat}
                              onChange={(nat) => setScenario({ nat })} />
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Segmented control — pill row, single-select
─────────────────────────────────────────────── */
interface SegOpt { id: string; label: string; icon: React.ComponentType<{ className?: string }> }

function Segmented({ value, onChange, options, ariaLabel }:
  { value: string; onChange: (v: string) => void; options: SegOpt[]; ariaLabel: string }) {
  if (options.length === 0) return null;
  return (
    <div role="radiogroup" aria-label={ariaLabel}
         className="inline-flex items-center p-1 rounded-full flex-shrink-0"
         style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
      {options.map((opt) => {
        const active = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-all active:scale-[0.97]"
            style={{
              background: active ? INK : 'transparent',
              color: active ? CREAM : SLATE,
              boxShadow: active ? '0 1px 3px rgba(11,15,25,0.18)' : 'none',
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Variant popover
─────────────────────────────────────────────── */
function VariantPopover({ variants, current, onChange }:
  { variants: VisaVariant[]; current: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = variants.find(v => v.id === current) ?? variants[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12.5px] font-semibold transition-colors"
        style={{ background: PAPER, color: INK, border: `1px solid ${HAIR}` }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: EMERALD }} />
        {active.label}
        <ChevronDown className="w-3.5 h-3.5" style={{ color: MUTED }} />
      </button>

      {open && (
        <div role="listbox"
             className="absolute top-full mt-2 right-0 w-[280px] rounded-2xl overflow-hidden z-40"
             style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 18px 42px -12px rgba(11,15,25,0.22)' }}>
          <div className="px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em]"
               style={{ color: MUTED, borderBottom: `1px solid ${HAIR}` }}>
            Sub-route
          </div>
          <ul>
            {variants.map((v) => {
              const isActive = v.id === current;
              return (
                <li key={v.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => { onChange(v.id); setOpen(false); }}
                    className="w-full text-left px-4 py-3 transition-colors flex items-start gap-3"
                    style={{
                      background: isActive ? 'rgba(4,120,87,0.06)' : 'transparent',
                      borderBottom: `1px solid ${HAIR}`,
                    }}
                  >
                    <span className="flex-1">
                      <span className="block text-[13.5px] font-semibold" style={{ color: INK }}>
                        {v.label}
                      </span>
                      <span className="block text-[11.5px] mt-0.5" style={{ color: SLATE }}>
                        {v.headline}
                      </span>
                    </span>
                    {isActive && <Check className="w-4 h-4 mt-0.5" style={{ color: EMERALD }} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Nationality popover
─────────────────────────────────────────────── */
function NationalityPopover({ current, onChange }:
  { current: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = NATIONALITIES.find(n => n.code === current) ?? NATIONALITIES[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12.5px] font-semibold transition-colors"
        style={{ background: PAPER, color: INK, border: `1px solid ${HAIR}` }}
      >
        <span className="text-[14px] leading-none">{active.flag}</span>
        <span>{active.name}</span>
        <ChevronDown className="w-3.5 h-3.5" style={{ color: MUTED }} />
      </button>

      {open && (
        <div role="listbox"
             className="absolute top-full mt-2 right-0 w-[260px] max-h-[360px] overflow-y-auto rounded-2xl z-40"
             style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 18px 42px -12px rgba(11,15,25,0.22)' }}>
          <div className="sticky top-0 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em]"
               style={{ color: MUTED, background: PAPER, borderBottom: `1px solid ${HAIR}` }}>
            Your nationality
          </div>
          <ul>
            {NATIONALITIES.map((n) => {
              const isActive = n.code === current;
              return (
                <li key={n.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => { onChange(n.code); setOpen(false); }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 transition-colors"
                    style={{
                      background: isActive ? 'rgba(4,120,87,0.06)' : 'transparent',
                      borderBottom: `1px solid ${HAIR}`,
                    }}
                  >
                    <span className="text-[16px] leading-none">{n.flag}</span>
                    <span className="flex-1 text-[13px]" style={{ color: INK }}>{n.name}</span>
                    {n.tbTest && (
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded"
                            style={{ color: '#92400e', background: 'rgba(245,158,11,0.15)' }}>
                        TB
                      </span>
                    )}
                    {isActive && <Check className="w-3.5 h-3.5" style={{ color: EMERALD }} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
