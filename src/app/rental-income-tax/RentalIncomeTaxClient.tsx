'use client';

import { useState, useMemo } from 'react';
import { calculateRentalIncomeTax } from '../../lib/rental-income-tax/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP, fmtPct } from '../../components/calc-shell/CalcFormPrimitives';

export default function RentalIncomeTaxClient() {
  const [rent,         setRent]         = useState('18000');
  const [mortgage,     setMortgage]     = useState('8000');
  const [expenses,     setExpenses]     = useState('2000');
  const [useAllowance, setUseAllowance] = useState(false);
  const [otherIncome,  setOtherIncome]  = useState('35000');

  const r = useMemo(() => calculateRentalIncomeTax({
    annualRent: parseFloat(rent) || 0,
    mortgageInterest: parseFloat(mortgage) || 0,
    allowableExpenses: parseFloat(expenses) || 0,
    usePropertyAllowance: useAllowance,
    otherIncome: parseFloat(otherIncome) || 0,
  }), [rent, mortgage, expenses, useAllowance, otherIncome]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Annual rental income" prefix="£" value={rent} onChange={setRent} />
        <NumberField label="Annual mortgage interest" prefix="£" value={mortgage} onChange={setMortgage} hint="Finance cost — gives 20% credit only (Section 24)" />
        <NumberField label="Other allowable expenses" prefix="£" value={expenses} onChange={setExpenses} hint="Agent fees, insurance, maintenance (not mortgage)" />
        <NumberField label="Other income (salary etc.)" prefix="£" value={otherIncome} onChange={setOtherIncome} hint="Used to determine which tax band your rental profit falls in" />
      </div>
      <div className="mt-4">
        <label className="flex items-start gap-2.5 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#f3f4f5] transition-colors">
          <input type="checkbox" checked={useAllowance} onChange={(e) => setUseAllowance(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#00C4B4]" />
          <span>
            <span className="block text-[13.5px] font-semibold text-[#0A2540]">Use £1,000 Property Allowance instead of itemised expenses</span>
            <span className="block text-[12px] text-[#76777e]">Only worthwhile if total expenses are under £1,000</span>
          </span>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Taxable profit" value={fmtGBP(r.taxableProfit)} muted />
        <ResultBox label="Tax before credit" value={fmtGBP(r.taxBeforeCredit)} muted />
        <ResultBox label="Mortgage tax credit" value={`–${fmtGBP(r.mortgageTaxCredit)}`} accent="#15803d" />
        <ResultBox label="Final rental tax" value={fmtGBP(r.finalTaxOnRental)} primary />
      </div>

      <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-2 text-[13px]">
        <Row label="Gross rent" value={fmtGBP(r.grossRent)} />
        <Row label="Less allowable deductions" value={`–${fmtGBP(r.allowableDeductions)}`} muted />
        <Row label="Less final rental tax" value={`–${fmtGBP(r.finalTaxOnRental)}`} muted />
        <Row label="Less mortgage interest paid" value={`–${fmtGBP(parseFloat(mortgage) || 0)}`} muted />
        <Row label="Net rental income" value={fmtGBP(r.netRentalIncome)} bold />
        {r.section24Impact > 0 && (
          <Row label="Extra tax vs pre-2020 system (Section 24 impact)" value={`+${fmtGBP(r.section24Impact)}`} accent="#b91c1c" />
        )}
      </div>
    </CalcCard>
  );
}

function Row({ label, value, muted, bold, accent }: { label: string; value: string; muted?: boolean; bold?: boolean; accent?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]/40 last:border-0">
      <span className={muted ? 'text-[#76777e]' : 'text-[#0A2540]'}>{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold' : ''}`}
        style={{ color: accent ?? (bold ? '#0A2540' : muted ? '#76777e' : '#0A2540'), fontFamily: bold ? '"Plus Jakarta Sans", Inter, sans-serif' : undefined }}>
        {value}
      </span>
    </div>
  );
}
