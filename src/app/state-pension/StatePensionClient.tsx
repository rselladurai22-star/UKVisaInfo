'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { calcStatePension } from '../../lib/state-pension/calc';

const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, n));
const gbp0 = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(0, n));

export default function StatePensionClient() {
  const [years, setYears] = useState<string>('25');
  const [yearsUntil, setYearsUntil] = useState<string>('15');

  const result = useMemo(() => calcStatePension({
    qualifyingYears: parseFloat(years) || 0,
    yearsUntilRetirement: parseFloat(yearsUntil) || undefined,
  }), [years, yearsUntil]);

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <NumField label="Your NI qualifying years so far" hint="Check on gov.uk for exact figure" value={years} onChange={setYears} max="50" />
          <NumField label="Years until State Pension age (optional)" hint="To check if you can reach 35" value={yearsUntil} onChange={setYearsUntil} max="50" />
        </div>
      </div>

      {result.belowMinimum ? (
        <div className="flex items-start gap-2.5 p-5 rounded-2xl bg-[#fef2f2] border border-[#fecaca]">
          <AlertTriangle className="w-4 h-4 text-[#b91c1c] flex-shrink-0 mt-1" />
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#b91c1c] mb-1">
              Below the 10-year minimum
            </div>
            <p className="text-[13.5px] text-[#7f1d1d] leading-[1.55]">
              You need at least 10 qualifying NI years to receive any new State Pension. Check your record on gov.uk and consider voluntary Class 3 contributions to fill gaps where possible.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0A2540] text-white rounded-2xl p-6 md:p-7">
          <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/70">
            Forecast new State Pension
          </div>
          <div
            className="mt-1 font-bold tabular-nums tracking-[-0.015em]"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', lineHeight: '1.0' }}
          >
            {gbp(result.weeklyForecast)}/week
          </div>
          <div className="mt-2 text-[13.5px] text-white/65 tabular-nums">
            {gbp0(result.monthlyForecast)}/month · {gbp0(result.annualForecast)}/year
          </div>
        </div>
      )}

      {/* Shortfall + fill cost */}
      {result.shortfallVsFull > 0.01 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
          <h3 className="font-bold text-[#0A2540] text-[15px] md:text-[16px] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            Gap to the full pension
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13.5px]">
            <Stat label="Shortfall per week" value={gbp(result.shortfallVsFull)} />
            <Stat label="Years short of 35" value={`${result.yearsToFull}`} />
            <Stat label="Cost to buy 1 missing year" value={`~${gbp0(result.costToBuyOneYear)}`} />
          </div>
          <p className="mt-4 text-[12.5px] text-[#76777e] leading-relaxed">
            Each extra qualifying year adds about {gbp(result.weeklyGainPerExtraYear)} per week of pension ({gbp0(result.weeklyGainPerExtraYear * 52)} per year). Voluntary Class 3 contributions of about £907 typically pay for themselves in 2 years 8 months of receiving the pension.
          </p>
          {!result.canReachFull && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-[#fff7ed] border border-[#fed7aa]">
              <Sparkles className="w-3.5 h-3.5 text-[#c2410c] flex-shrink-0 mt-0.5" />
              <p className="text-[12.5px] text-[#7c2d12]">
                You{`'`}re {result.yearsToFull} years short and have only {yearsUntil} years left until SP age. Some of the gap will need voluntary contributions to close.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#E5E7EB] rounded-xl p-4">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#76777e]">{label}</div>
      <div
        className="mt-1 font-bold tabular-nums text-[#0A2540] text-[20px]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
      >
        {value}
      </div>
    </div>
  );
}

function NumField({ label, hint, value, onChange, max }: { label: string; hint?: string; value: string; onChange: (v: string) => void; max?: string }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">{label}</span>
      <div className="mt-2 flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-4 py-3 focus-within:border-[#0A2540] transition-colors">
        <input
          type="number"
          inputMode="numeric"
          min="0"
          max={max}
          step="1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[19px] md:text-[22px] font-bold text-[#0A2540] tabular-nums outline-none"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        />
        <span className="text-[#76777e] text-[12px]">years</span>
      </div>
      {hint && <div className="text-[11.5px] text-[#76777e] mt-1.5">{hint}</div>}
    </label>
  );
}
