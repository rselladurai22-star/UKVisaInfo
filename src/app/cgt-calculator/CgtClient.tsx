'use client';

import { useState, useMemo } from 'react';
import { calcCgt } from '../../lib/cgt/calc';

const gbp0 = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(0, n));

export default function CgtClient() {
  const [income, setIncome] = useState<string>('50000');
  const [gain, setGain] = useState<string>('20000');

  const result = useMemo(() => calcCgt({
    grossIncome: parseFloat(income) || 0,
    totalGain: parseFloat(gain) || 0,
  }), [income, gain]);

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <NumField label="Your other taxable income" hint="Salary, rental, etc. for 2026/27" value={income} onChange={setIncome} step="1000" />
          <NumField label="Total gain in the year" hint="Sale proceeds minus cost" value={gain} onChange={setGain} step="1000" />
        </div>
      </div>

      {/* result */}
      <div className="bg-[#0A2540] text-white rounded-2xl p-6 md:p-7">
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/70">CGT due 2026/27</div>
        <div
          className="mt-1 font-bold tabular-nums tracking-[-0.015em]"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', lineHeight: '1.0' }}
        >
          {gbp0(result.totalTax)}
        </div>
        <div className="mt-1 text-[13.5px] text-white/65">
          Effective rate {(result.effectiveRate * 100).toFixed(1)}% · Net after CGT {gbp0(result.netGain)}
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
        <h3 className="font-bold text-[#0A2540] text-[15px] md:text-[16px] mb-4" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          How we got there
        </h3>
        <table className="w-full text-[13.5px] tabular-nums">
          <tbody className="divide-y divide-[#E5E7EB]">
            <Row label="Total gain" value={gbp0(result.totalGain)} />
            <Row label="Annual Exempt Amount applied" value={`−${gbp0(result.aeaApplied)}`} muted />
            <Row label="Taxable gain" value={gbp0(result.taxableGain)} bold />
            <Row label={`At 18% (basic-rate band: ${gbp0(result.unusedBasicBand)} unused)`} value={`${gbp0(result.gainAtBasic)} → ${gbp0(result.taxAtBasic)}`} />
            <Row label="At 24% (higher-rate band)" value={`${gbp0(result.gainAtHigher)} → ${gbp0(result.taxAtHigher)}`} />
            <Row label="Total CGT" value={gbp0(result.totalTax)} bold />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <tr>
      <td className={`py-2.5 ${bold ? 'font-bold text-[#0A2540]' : muted ? 'text-[#76777e]' : 'text-[#45464d]'}`}>{label}</td>
      <td className={`py-2.5 text-right ${bold ? 'font-bold text-[#0A2540]' : muted ? 'text-[#76777e]' : 'text-[#0A2540] font-semibold'}`}>{value}</td>
    </tr>
  );
}

function NumField({ label, hint, value, onChange, step }: { label: string; hint?: string; value: string; onChange: (v: string) => void; step?: string }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">{label}</span>
      <div className="mt-2 flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-4 py-3 focus-within:border-[#0A2540] transition-colors">
        <span className="text-[#76777e] text-[18px] font-semibold">£</span>
        <input
          type="number"
          inputMode="numeric"
          min="0"
          step={step ?? '1'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[18px] md:text-[20px] font-bold text-[#0A2540] tabular-nums outline-none"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        />
      </div>
      {hint && <div className="text-[11.5px] text-[#76777e] mt-1.5">{hint}</div>}
    </label>
  );
}
