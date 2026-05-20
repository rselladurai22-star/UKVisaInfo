'use client';

import { useState, useMemo } from 'react';
import { calculateSSP } from '../../lib/ssp/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP, fmtGBP2 } from '../../components/calc-shell/CalcFormPrimitives';

export default function SspClient() {
  const [awe, setAwe] = useState('400');
  const [qdpw, setQdpw] = useState('5');
  const [sickDays, setSickDays] = useState('14');

  const result = useMemo(() => calculateSSP({
    averageWeeklyEarnings: parseFloat(awe) || 0,
    qualifyingDaysPerWeek: parseFloat(qdpw) || 5,
    sickDays: parseFloat(sickDays) || 0,
  }), [awe, qdpw, sickDays]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NumberField label="Average weekly earnings (gross)" prefix="£" value={awe} onChange={setAwe} />
        <NumberField label="Qualifying days per week" value={qdpw} onChange={setQdpw} hint="Usually 5 (Mon–Fri)." />
        <NumberField label="Calendar days off sick" value={sickDays} onChange={setSickDays} suffix="days" />
      </div>

      {!result.eligible ? (
        <div className="mt-6 p-4 rounded-xl bg-[#fef3c7] border border-[#fde68a] text-[13px] text-[#92400e]">
          {result.reason}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultBox label="Total SSP" value={fmtGBP(result.total)} primary sub={`${result.paidDays} paid day${result.paidDays === 1 ? '' : 's'}`} />
            <ResultBox label="Daily rate" value={fmtGBP2(result.dailyRate)} muted />
            <ResultBox label="Waiting days (unpaid)" value={`${result.waitingDays}`} accent={result.waitingDays > 0 ? '#b54708' : '#76777e'} sub="First 3 qualifying days" />
          </div>

          {result.cappedDays > 0 && (
            <p className="mt-5 text-[12.5px] text-[#b54708] bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3">
              You\'ve been off long enough to hit the 28-week SSP limit. {result.cappedDays} eligible days fall after the cap — these are unpaid by your employer. Apply for new-style Employment & Support Allowance (ESA) via DWP.
            </p>
          )}

          <p className="mt-4 text-[12px] text-[#76777e]">
            Weekly SSP rate £{result.weeklyRate.toFixed(2)}. {result.weeksPaid.toFixed(1)} weeks paid out of a maximum 28.
          </p>
        </>
      )}
    </CalcCard>
  );
}
