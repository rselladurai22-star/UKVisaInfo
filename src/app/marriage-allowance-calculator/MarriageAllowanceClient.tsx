'use client';

import { useState, useMemo } from 'react';
import { calculateMarriageAllowance } from '../../lib/marriage-allowance/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function MarriageAllowanceClient() {
  const [lower,   setLower]   = useState('8000');
  const [higher,  setHigher]  = useState('38000');
  const [backdate, setBackdate] = useState('4');

  const r = useMemo(() => calculateMarriageAllowance({
    lowerEarnerIncome:  parseFloat(lower)  || 0,
    higherEarnerIncome: parseFloat(higher) || 0,
    backdateYears: (parseInt(backdate) || 0) as 0|1|2|3|4,
  }), [lower, higher, backdate]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Lower earner&rsquo;s annual income" prefix="£" value={lower} onChange={setLower} hint="Must be below £12,570 to qualify" />
        <NumberField label="Higher earner&rsquo;s annual income" prefix="£" value={higher} onChange={setHigher} hint="Must be basic-rate only (≤ £50,270)" />
      </div>
      <div className="mt-4 max-w-xs">
        <SelectField
          label="Years to backdate"
          value={backdate}
          onChange={setBackdate}
          options={[
            { value: '0', label: 'No backdating — current year only' },
            { value: '1', label: '1 prior year' },
            { value: '2', label: '2 prior years' },
            { value: '3', label: '3 prior years' },
            { value: '4', label: '4 prior years (maximum)' },
          ]}
        />
      </div>

      {r.eligible ? (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultBox label="Annual saving" value={fmtGBP(r.annualSaving)} />
            <ResultBox label="Backdated saving" value={fmtGBP(r.backdateSaving)} />
            <ResultBox label="Total saving" value={fmtGBP(r.totalSaving)} primary />
          </div>

          {r.yearsBackdated.length > 0 && (
            <div className="mt-5 space-y-1 text-[13px]">
              <p className="font-semibold text-[#0A2540] mb-2" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>Backdated years</p>
              {r.yearsBackdated.map((y) => (
                <div key={y.year} className="flex justify-between py-1 border-b border-[#E5E7EB]/40">
                  <span className="text-[#76777e]">{y.year}</span>
                  <span className="tabular-nums text-[#0A2540]">{fmtGBP(y.saving)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 p-4 bg-[#fff7ed] border border-[#fed7aa] rounded-lg text-[13px] text-[#92400e]">
          <strong>Not eligible:</strong> {r.ineligibleReason}
        </div>
      )}
    </CalcCard>
  );
}
