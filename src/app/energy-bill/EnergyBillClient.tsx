'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { calcEnergyBill, CAP, TDCV } from '../../lib/energy/calc';

const gbp = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, n));
const gbp0 = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(0, n));

export default function EnergyBillClient() {
  const [elec, setElec] = useState<string>(`${TDCV.electricity}`);
  const [gas, setGas]   = useState<string>(`${TDCV.gas}`);

  const result = useMemo(() => calcEnergyBill({
    electricityKwh: parseFloat(elec) || 0,
    gasKwh: parseFloat(gas) || 0,
  }), [elec, gas]);

  const over = result.vsTypical > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Inputs */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-4">
          Ofgem cap window · {result.cap.windowLabel}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <KwhField label="Electricity (kWh / year)" hint={`Typical home: ${TDCV.electricity.toLocaleString()} kWh`} value={elec} onChange={setElec} />
          <KwhField label="Gas (kWh / year)" hint={`Typical gas-heated home: ${TDCV.gas.toLocaleString()} kWh`} value={gas} onChange={setGas} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-[12px] tabular-nums">
          <RateBox label="Electricity" unit={`${CAP.electricity.unitPence.toFixed(2)}p/kWh`} standing={`${CAP.electricity.standingPence.toFixed(2)}p/day`} />
          <RateBox label="Gas" unit={`${CAP.gas.unitPence.toFixed(2)}p/kWh`} standing={`${CAP.gas.standingPence.toFixed(2)}p/day`} />
        </div>
      </div>

      {/* Headline */}
      <div className="bg-[#0A2540] text-white rounded-2xl p-6 md:p-7">
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/70">
          Estimated annual bill
        </div>
        <div
          className="mt-1 font-bold tabular-nums tracking-[-0.015em]"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', lineHeight: '1.0' }}
        >
          {gbp0(result.totalAnnual)}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] text-white/75">
          <span>{gbp(result.monthlyAvg)} per month avg.</span>
          <span className="text-white/30">·</span>
          <span className="inline-flex items-center gap-1">
            {over ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {over ? '+' : ''}{gbp0(result.vsTypical)} vs typical ({gbp0(result.typicalBill)})
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
        <h3 className="font-bold text-[#0A2540] text-[15px] md:text-[16px] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          Breakdown
        </h3>
        <table className="w-full text-[13.5px] tabular-nums">
          <tbody className="divide-y divide-[#E5E7EB]">
            <tr><td className="py-2.5 text-[#45464d]">Electricity bill</td><td className="py-2.5 text-right text-[#0A2540] font-semibold">{gbp(result.electricityAnnual)}</td></tr>
            <tr><td className="py-2.5 text-[#45464d]">Gas bill</td><td className="py-2.5 text-right text-[#0A2540] font-semibold">{gbp(result.gasAnnual)}</td></tr>
            <tr><td className="py-2.5 font-bold text-[#0A2540]">Total per year</td><td className="py-2.5 text-right font-bold text-[#0A2540]">{gbp(result.totalAnnual)}</td></tr>
          </tbody>
        </table>
      </div>

      <p className="text-[12px] text-[#76777e] leading-relaxed">
        Uses Ofgem default tariff cap GB-average for Direct Debit dual-fuel. Your actual bill varies by region (14 caps), payment method and any fixed deal you{`'`}re on. Always confirm with your supplier.
      </p>
    </div>
  );
}

function KwhField({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">{label}</span>
      <div className="mt-2 flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-4 py-3 focus-within:border-[#0A2540] transition-colors">
        <input
          type="number"
          inputMode="numeric"
          min="0"
          step="100"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[19px] md:text-[22px] font-bold text-[#0A2540] tabular-nums outline-none"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        />
        <span className="text-[#76777e] text-[12px]">kWh</span>
      </div>
      {hint && <div className="text-[11.5px] text-[#76777e] mt-1.5">{hint}</div>}
    </label>
  );
}

function RateBox({ label, unit, standing }: { label: string; unit: string; standing: string }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#f6f7f8] px-3 py-2.5">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#76777e]">{label}</div>
      <div className="mt-0.5 text-[12.5px] text-[#0A2540] font-semibold tabular-nums">{unit}</div>
      <div className="text-[11.5px] text-[#45464d] tabular-nums">{standing} standing</div>
    </div>
  );
}
