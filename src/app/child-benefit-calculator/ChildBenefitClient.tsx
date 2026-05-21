'use client';

import { useState, useMemo } from 'react';
import { calculateChildBenefit } from '../../lib/child-benefit/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function ChildBenefitClient() {
  const [children, setChildren]  = useState('2');
  const [income, setIncome]       = useState('55000');

  const r = useMemo(() => calculateChildBenefit({
    children: parseFloat(children) || 0,
    higherEarnerIncome: parseFloat(income) || 0,
  }), [children, income]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Number of qualifying children" value={children} onChange={setChildren} hint="Children under 16 (or under 20 in approved education)" />
        <NumberField label="Higher earner adjusted net income" prefix="£" value={income} onChange={setIncome} hint="Income of whichever partner earns more" />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultBox label="Gross Child Benefit" value={fmtGBP(r.annualBenefit)} />
        <ResultBox label="HICBC charge" value={r.hicbcCharge > 0 ? `–${fmtGBP(r.hicbcCharge)}` : '£0'} accent={r.hicbcCharge > 0 ? '#b91c1c' : undefined} />
        <ResultBox label="Net benefit" value={fmtGBP(r.netBenefit)} primary />
      </div>

      {r.clawbackPct > 0 && (
        <p className="mt-4 text-[13px] text-[#76777e]">
          {r.isFullyClawedBack
            ? 'The entire benefit is clawed back — but you should still claim to protect your National Insurance record.'
            : `${r.clawbackPct}% of Child Benefit is clawed back via the HICBC Self Assessment charge.`}
        </p>
      )}

      <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-2 text-[13px]">
        <Row label="Weekly benefit (before HICBC)" value={`${fmtGBP(r.weeklyBenefit)}/week`} muted />
        <Row label="HICBC clawback %" value={`${r.clawbackPct}%`} />
        <Row label="HICBC charge (SA)" value={fmtGBP(r.hicbcCharge)} bold />
      </div>
    </CalcCard>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]/40 last:border-0">
      <span className={muted ? 'text-[#76777e]' : 'text-[#0A2540]'}>{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold text-[#0A2540]' : muted ? 'text-[#45464d]' : 'text-[#0A2540]'}`}
        style={bold ? { fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' } : undefined}>
        {value}
      </span>
    </div>
  );
}
