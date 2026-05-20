'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { calcPensionAllowance } from '../../lib/pension-allowance/calc';

const gbp0 = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(0, n));

export default function PensionAllowanceClient() {
  const [adjusted, setAdjusted] = useState<string>('250000');
  const [threshold, setThreshold] = useState<string>('220000');
  const [mpaa, setMpaa] = useState<boolean>(false);
  const [carry, setCarry] = useState<string>('0');
  const [contrib, setContrib] = useState<string>('40000');

  const result = useMemo(() => calcPensionAllowance({
    adjustedIncome: parseFloat(adjusted) || 0,
    thresholdIncome: parseFloat(threshold) || 0,
    mpaaTriggered: mpaa,
    carryForward: parseFloat(carry) || 0,
    plannedContribution: parseFloat(contrib) || 0,
  }), [adjusted, threshold, mpaa, carry, contrib]);

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <NumField label="Adjusted income (incl. employer pension)" hint="Used for the taper test" value={adjusted} onChange={setAdjusted} step="1000" />
          <NumField label="Threshold income" hint="Income minus personal pension contribs" value={threshold} onChange={setThreshold} step="1000" />
          <NumField label="Unused AA carried forward (max 3 prior years)" value={carry} onChange={setCarry} step="1000" />
          <NumField label="Planned contribution this year" hint="Employee + employer + salary sacrifice" value={contrib} onChange={setContrib} step="1000" />
        </div>

        <label className="mt-5 flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={mpaa}
            onChange={(e) => setMpaa(e.target.checked)}
            className="w-4 h-4 rounded border-[#cfd5e0] accent-[#0A2540]"
          />
          <span className="text-[13.5px] text-[#0A2540]">
            I{`'`}ve flexibly accessed a defined-contribution pot (MPAA applies)
          </span>
        </label>
      </div>

      {/* Headline */}
      <div className="bg-[#0A2540] text-white rounded-2xl p-6 md:p-7">
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/70">
          Available this year (including carry-forward)
        </div>
        <div
          className="mt-1 font-bold tabular-nums tracking-[-0.015em]"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', lineHeight: '1.0' }}
        >
          {gbp0(result.totalAvailable)}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
          <Pill>This year: {gbp0(result.thisYearAa)}</Pill>
          {!result.mpaaApplies && <Pill>Carry-fwd: {gbp0(result.carryForward)}</Pill>}
          {result.taperApplies && <Pill accent="#F59E0B">Tapered</Pill>}
          {result.mpaaApplies && <Pill accent="#E11D48">MPAA active</Pill>}
        </div>
      </div>

      {/* Overage warning */}
      {result.overage > 0 && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca]">
          <AlertTriangle className="w-4 h-4 text-[#b91c1c] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#b91c1c] mb-1">
              You{`'`}re over the allowance by {gbp0(result.overage)}
            </div>
            <p className="text-[13.5px] text-[#7f1d1d] leading-[1.55]">
              The excess will face an Annual Allowance Charge at your marginal rate when added to your taxable income. Consider reducing the contribution or using Scheme Pays if the scheme allows.
            </p>
          </div>
        </div>
      )}

      <p className="text-[12px] text-[#76777e] leading-relaxed">{result.note}</p>
    </div>
  );
}

function Pill({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <span
      className="inline-flex items-center text-[10.5px] font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-md"
      style={{
        background: accent ? `${accent}28` : 'rgba(255,255,255,0.12)',
        color: accent ?? 'rgba(255,255,255,0.85)',
        border: accent ? `1px solid ${accent}50` : '1px solid rgba(255,255,255,0.18)',
      }}
    >
      {children}
    </span>
  );
}

function NumField({ label, hint, value, onChange, step }: { label: string; hint?: string; value: string; onChange: (v: string) => void; step?: string }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">{label}</span>
      <div className="mt-2 flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-4 py-3 focus-within:border-[#0A2540] transition-colors">
        <span className="text-[#76777e] text-[16px] font-semibold">£</span>
        <input
          type="number"
          inputMode="numeric"
          min="0"
          step={step ?? '1'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[16.5px] md:text-[18px] font-bold text-[#0A2540] tabular-nums outline-none"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        />
      </div>
      {hint && <div className="text-[11.5px] text-[#76777e] mt-1.5">{hint}</div>}
    </label>
  );
}
