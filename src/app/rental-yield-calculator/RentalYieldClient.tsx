'use client';

import { useState, useMemo } from 'react';
import { calculateRentalYield } from '../../lib/rental-yield/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

function fmtPctVal(v: number) { return `${v.toFixed(2)}%`; }
function fmtX(v: number) { return isFinite(v) ? `${v.toFixed(2)}x` : '∞'; }

export default function RentalYieldClient() {
  const [price,     setPrice]     = useState('280000');
  const [rent,      setRent]      = useState('1200');
  const [agent,     setAgent]     = useState('10');
  const [insurance, setInsurance] = useState('400');
  const [maint,     setMaint]     = useState('800');
  const [voids,     setVoids]     = useState('600');
  const [mortgage,  setMortgage]  = useState('200000');
  const [rate,      setRate]      = useState('5.0');
  const [higher,    setHigher]    = useState(false);

  const r = useMemo(() => calculateRentalYield({
    purchasePrice: parseFloat(price) || 1,
    monthlyRent: parseFloat(rent) || 0,
    agentFeePct: parseFloat(agent) || 0,
    annualInsurance: parseFloat(insurance) || 0,
    annualMaintenance: parseFloat(maint) || 0,
    annualVoids: parseFloat(voids) || 0,
    mortgageAmount: parseFloat(mortgage) || 0,
    mortgageRatePct: parseFloat(rate) || 0,
    higherRateTaxpayer: higher,
  }), [price, rent, agent, insurance, maint, voids, mortgage, rate, higher]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Purchase price" prefix="£" value={price} onChange={setPrice} />
        <NumberField label="Monthly rent" prefix="£" value={rent} onChange={setRent} />
        <NumberField label="Letting agent fee" value={agent} onChange={setAgent} hint="% of annual rent" suffix="%" />
        <NumberField label="Annual insurance" prefix="£" value={insurance} onChange={setInsurance} />
        <NumberField label="Annual maintenance" prefix="£" value={maint} onChange={setMaint} />
        <NumberField label="Void period allowance" prefix="£" value={voids} onChange={setVoids} hint="Lost rent from empty periods" />
      </div>

      <p className="mt-5 mb-2 text-[13px] font-semibold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>BTL mortgage ICR check</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NumberField label="Mortgage amount" prefix="£" value={mortgage} onChange={setMortgage} />
        <NumberField label="Mortgage rate" value={rate} onChange={setRate} hint="Current pay rate %" suffix="%" />
      </div>
      <div className="mt-2">
        <label className="flex items-start gap-2.5 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#f3f4f5] transition-colors">
          <input type="checkbox" checked={higher} onChange={(e) => setHigher(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#00C4B4]" />
          <span>
            <span className="block text-[13.5px] font-semibold text-[#0A2540]">Higher-rate taxpayer</span>
            <span className="block text-[12px] text-[#76777e]">Requires 145% ICR (vs 125% for basic-rate)</span>
          </span>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Gross yield" value={fmtPctVal(r.grossYield)} />
        <ResultBox label="Net yield" value={fmtPctVal(r.netYield)} primary />
        <ResultBox label="Actual ICR" value={fmtX(r.actualICR)} accent={r.icrPasses ? '#15803d' : '#b91c1c'} sub={`Need ${r.requiredICR}x`} />
        <ResultBox label="Max borrowable" value={fmtGBP(r.maxBorrowable)} muted sub="At this rent + ICR" />
      </div>

      {!r.icrPasses && (
        <div className="mt-4 p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-lg text-[13px] text-[#be123c]">
          <strong>ICR fails:</strong> Rent covers only {fmtX(r.actualICR)} of stressed interest — lenders require {r.requiredICR}x. You may need a larger deposit or higher rent.
        </div>
      )}
    </CalcCard>
  );
}
