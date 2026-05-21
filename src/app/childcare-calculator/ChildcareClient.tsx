'use client';

import { useState, useMemo } from 'react';
import { calculateChildcare } from '../../lib/childcare/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

function ageLabel(months: number) {
  if (months < 12) return `${months} months`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m ? `${y}yr ${m}m` : `${y} years`;
}

function CheckRow({ label, sublabel, checked, onChange }: { label: string; sublabel: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#f3f4f5] transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-[#00C4B4] cursor-pointer shrink-0"
      />
      <span>
        <span className="block text-[13.5px] font-semibold text-[#0A2540]">{label}</span>
        <span className="block text-[12px] text-[#76777e]">{sublabel}</span>
      </span>
    </label>
  );
}

export default function ChildcareClient() {
  const [ageMonths, setAgeMonths]     = useState('36');
  const [hours,     setHours]         = useState('40');
  const [rate,      setRate]          = useState('8.50');
  const [weeks,     setWeeks]         = useState('51');
  const [working,   setWorking]       = useState(true);
  const [under100k, setUnder100k]     = useState(true);
  const [onUc,      setOnUc]          = useState(false);
  const [disabled,  setDisabled]      = useState(false);
  const [numChildren, setNumChildren] = useState('1');

  const r = useMemo(() => calculateChildcare({
    childAgeMonths: parseFloat(ageMonths) || 0,
    weeklyHoursNeeded: parseFloat(hours) || 0,
    hourlyRate: parseFloat(rate) || 0,
    weeksPerYear: parseFloat(weeks) || 0,
    workingParents: working,
    bothEarnUnder100k: under100k,
    onUniversalCredit: onUc,
    disabled,
    numberOfChildren: parseFloat(numChildren) || 1,
  }), [ageMonths, hours, rate, weeks, working, under100k, onUc, disabled, numChildren]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Child&rsquo;s age" value={ageMonths} onChange={setAgeMonths} hint={`= ${ageLabel(parseFloat(ageMonths)||0)}`} suffix="months" />
        <NumberField label="Childcare hours per week needed" value={hours} onChange={setHours} />
        <NumberField label="Hourly childcare rate" prefix="£" value={rate} onChange={setRate} hint="Your local provider&rsquo;s rate" />
        <NumberField label="Weeks per year" value={weeks} onChange={setWeeks} hint="Typical: 50–51 for working parents" suffix="weeks" />
        <NumberField label="Number of children (for UC cap)" value={numChildren} onChange={setNumChildren} />
      </div>
      <div className="mt-4 border border-[#E5E7EB] rounded-xl divide-y divide-[#E5E7EB]">
        <CheckRow label="Both parents are working" sublabel="Required for 30-hr / 9m–3yr free hours" checked={working} onChange={setWorking} />
        <CheckRow label="Both parents earn under £100,000" sublabel="Required for free hours and TFC" checked={under100k} onChange={setUnder100k} />
        <CheckRow label="On Universal Credit" sublabel="TFC and UC childcare are mutually exclusive" checked={onUc} onChange={setOnUc} />
        <CheckRow label="Child is disabled" sublabel="Doubles the TFC annual cap to £4,000" checked={disabled} onChange={setDisabled} />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Gross annual cost" value={fmtGBP(r.grossAnnualCost)} muted />
        <ResultBox label="Free hours saving" value={`–${fmtGBP(r.freeHoursSaving)}`} accent="#15803d" />
        <ResultBox label={onUc ? 'UC childcare support' : 'TFC govt contribution'} value={`–${fmtGBP(onUc ? r.ucChildcareSupport : r.tfcGovtContrib)}`} accent="#15803d" />
        <ResultBox label="Monthly net cost" value={fmtGBP(onUc ? r.monthlyCostUc : r.monthlyCostTfc)} primary />
      </div>

      {r.bestOption !== 'neither' && (
        <p className="mt-4 text-[13px] text-[#0A2540]">
          <strong>Best option for you:</strong>{' '}
          {r.bestOption === 'UC' ? 'Universal Credit childcare element (85% of costs)' : 'Tax-Free Childcare (20% government top-up)'}
        </p>
      )}
    </CalcCard>
  );
}
