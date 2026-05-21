'use client';

import { useState, useMemo } from 'react';
import { calculateMinimumWage, NMW_RATES } from '../../lib/minimum-wage/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

const CATEGORY_LABELS: Record<string, string> = {
  nlw: 'National Living Wage (21+)',
  age18to20: 'NMW 18–20',
  under18: 'NMW Under 18',
  apprentice: 'NMW Apprentice',
};

export default function MinimumWageClient() {
  const [age,         setAge]         = useState('22');
  const [hourlyRate,  setHourlyRate]  = useState('12.00');
  const [weeklyHrs,   setWeeklyHrs]   = useState('37.5');
  const [apprentice,  setApprentice]  = useState(false);
  const [app19Y1,     setApp19Y1]     = useState(false);

  const r = useMemo(() => calculateMinimumWage({
    age: parseFloat(age) || 0,
    isApprentice: apprentice,
    apprenticeAge19PlusYear1: app19Y1,
    hourlyRate: parseFloat(hourlyRate) || 0,
    weeklyHours: parseFloat(weeklyHrs) || 0,
  }), [age, hourlyRate, weeklyHrs, apprentice, app19Y1]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Age" value={age} onChange={setAge} suffix="years old" />
        <NumberField label="Current hourly rate" prefix="£" value={hourlyRate} onChange={setHourlyRate} />
        <NumberField label="Weekly hours" value={weeklyHrs} onChange={setWeeklyHrs} suffix="hrs/week" />
      </div>
      <div className="mt-3 space-y-1">
        <label className="flex items-start gap-2.5 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#f3f4f5] transition-colors">
          <input type="checkbox" checked={apprentice} onChange={(e) => setApprentice(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#00C4B4]" />
          <span>
            <span className="block text-[13.5px] font-semibold text-[#0A2540]">Apprentice</span>
            <span className="block text-[12px] text-[#76777e]">Under 19, or 19+ in first year of apprenticeship</span>
          </span>
        </label>
        {apprentice && (
          <label className="flex items-start gap-2.5 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#f3f4f5] transition-colors">
            <input type="checkbox" checked={app19Y1} onChange={(e) => setApp19Y1(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#00C4B4]" />
            <span>
              <span className="block text-[13.5px] font-semibold text-[#0A2540]">Aged 19+ and in first year of apprenticeship</span>
              <span className="block text-[12px] text-[#76777e]">Still qualifies for apprentice rate</span>
            </span>
          </label>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Category" value={CATEGORY_LABELS[r.category]} muted />
        <ResultBox label="Minimum rate" value={`£${r.minimumRate.toFixed(2)}/hr`} />
        <ResultBox
          label="Compliant?"
          value={r.compliant ? '✓ Yes' : '✗ No'}
          accent={r.compliant ? '#15803d' : '#b91c1c'}
          primary={!r.compliant}
        />
        <ResultBox label="Annual pay" value={fmtGBP(r.annualPay)} muted />
      </div>

      {!r.compliant && (
        <div className="mt-4 p-4 bg-[#fff1f2] border border-[#fecdd3] rounded-lg text-[13px] text-[#be123c]">
          <strong>Underpaid by {fmtGBP(r.weeklyShortfall)}/week</strong> ({fmtGBP(r.annualShortfall)}/year).
          The minimum for your category is <strong>£{r.minimumRate.toFixed(2)}/hour</strong>.
          Report underpayment to HMRC or Acas.
        </div>
      )}

      <div className="mt-5 pt-5 border-t border-[#E5E7EB]">
        <p className="text-[13px] font-semibold text-[#0A2540] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          All rates from 1 April 2025
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(NMW_RATES).map(([key, val]) => (
            <div key={key} className={`p-3 rounded-lg text-center ${r.category === key ? 'bg-[#f0fdfa] border border-[#99f6e4]' : 'bg-[#f8f9fa]'}`}>
              <p className="text-[11px] text-[#76777e] uppercase tracking-wide">{CATEGORY_LABELS[key]}</p>
              <p className="text-[16px] font-bold text-[#0A2540] mt-1" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                £{val.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </CalcCard>
  );
}
