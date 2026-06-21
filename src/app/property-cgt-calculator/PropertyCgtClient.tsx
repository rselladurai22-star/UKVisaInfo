'use client';

import { useState, useMemo } from 'react';
import { calculatePropertyCgt } from '../../lib/property-cgt/calc';
import { CalcCard, NumberField, ToggleRow, ResultBox, fmtGBP, fmtPct } from '../../components/calc-shell/CalcFormPrimitives';

export default function PropertyCgtClient() {
  const [purchasePrice, setPurchasePrice] = useState('200000');
  const [salePrice,     setSalePrice]     = useState('350000');
  const [ownMonths,     setOwnMonths]     = useState('84');
  const [occupiedMths,  setOccupiedMths]  = useState('60');
  const [purchaseCosts, setPurchaseCosts] = useState('3000');
  const [improvesCosts, setImprovesCosts] = useState('15000');
  const [saleCosts,     setSaleCosts]     = useState('8000');
  const [taxIncome,     setTaxIncome]     = useState('45000');

  const r = useMemo(() => calculatePropertyCgt({
    purchasePrice: parseFloat(purchasePrice) || 0,
    salePrice: parseFloat(salePrice) || 0,
    ownershipMonths: parseFloat(ownMonths) || 1,
    occupiedMonths: parseFloat(occupiedMths) || 0,
    lettingRelief: false,
    purchaseCosts: parseFloat(purchaseCosts) || 0,
    improvementCosts: parseFloat(improvesCosts) || 0,
    saleCosts: parseFloat(saleCosts) || 0,
    taxableIncome: parseFloat(taxIncome) || 0,
  }), [purchasePrice, salePrice, ownMonths, occupiedMths, purchaseCosts, improvesCosts, saleCosts, taxIncome]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Purchase price" prefix="£" value={purchasePrice} onChange={setPurchasePrice} />
        <NumberField label="Sale price" prefix="£" value={salePrice} onChange={setSalePrice} />
        <NumberField label="Total ownership (months)" value={ownMonths} onChange={setOwnMonths} hint="From completion to completion" suffix="months" />
        <NumberField label="Months as main residence" value={occupiedMths} onChange={setOccupiedMths} hint="PPR months (the last 9 months always count)" suffix="months" />
        <NumberField label="Purchase costs" prefix="£" value={purchaseCosts} onChange={setPurchaseCosts} hint="Solicitor, SDLT paid on purchase" />
        <NumberField label="Capital improvement costs" prefix="£" value={improvesCosts} onChange={setImprovesCosts} hint="Extensions, loft conversions, new kitchen etc." />
        <NumberField label="Sale costs" prefix="£" value={saleCosts} onChange={setSaleCosts} hint="Estate agent, conveyancing" />
        <NumberField label="Other taxable income (this year)" prefix="£" value={taxIncome} onChange={setTaxIncome} hint="Used to determine 18% vs 24% CGT rate" />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Total gain" value={fmtGBP(r.gain)} muted />
        <ResultBox label="PPR relief" value={`, ${fmtGBP(r.pprRelief)}`} accent="#15803d" sub={`${Math.round(r.pprPct * 100)}% of ownership`} />
        <ResultBox label="Taxable gain" value={fmtGBP(r.taxableGain)} />
        <ResultBox label="Capital Gains Tax" value={fmtGBP(r.totalCgt)} primary />
      </div>

      <div className="mt-5 pt-5 border-t border-[#E5E7EB] space-y-2 text-[13px]">
        <Row label="Gain after PPR" value={fmtGBP(r.gainAfterPpr)} />
        <Row label="Annual Exempt Amount" value={`, ${fmtGBP(r.annualExemptAmount)}`} muted />
        <Row label="Taxable gain" value={fmtGBP(r.taxableGain)} />
        {r.basicRateTax > 0 && <Row label="CGT at 18% (basic rate)" value={fmtGBP(r.basicRateTax)} muted />}
        {r.higherRateTax > 0 && <Row label="CGT at 24% (higher rate)" value={fmtGBP(r.higherRateTax)} muted />}
        <Row label="Total CGT" value={fmtGBP(r.totalCgt)} bold />
      </div>
      <p className="mt-3 text-[12px] text-[#76777e]">Report and pay within 60 days of completion via the HMRC &lsquo;Report and Pay CGT on UK property&rsquo; service.</p>
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
