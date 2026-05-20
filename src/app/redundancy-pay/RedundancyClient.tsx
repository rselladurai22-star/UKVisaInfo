'use client';

import { useState, useMemo } from 'react';
import { calculateRedundancy, WEEKLY_CAP } from '../../lib/redundancy/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP, fmtGBP2 } from '../../components/calc-shell/CalcFormPrimitives';

export default function RedundancyClient() {
  const [age, setAge] = useState('45');
  const [years, setYears] = useState('8');
  const [weeklyPay, setWeeklyPay] = useState('850');

  const result = useMemo(() => calculateRedundancy({
    age: parseFloat(age) || 0,
    yearsService: parseFloat(years) || 0,
    weeklyPay: parseFloat(weeklyPay) || 0,
  }), [age, years, weeklyPay]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NumberField label="Your age at dismissal" value={age} onChange={setAge} suffix="years" />
        <NumberField label="Years of continuous service" value={years} onChange={setYears} suffix="years" hint="Whole years only — round down." />
        <NumberField label="Gross weekly pay" prefix="£" value={weeklyPay} onChange={setWeeklyPay} hint={`Capped at £${WEEKLY_CAP}/week.`} />
      </div>

      {!result.eligible ? (
        <div className="mt-6 p-4 rounded-xl bg-[#fef3c7] border border-[#fde68a] text-[13px] text-[#92400e]">
          {result.reason}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultBox label="Statutory pay" value={fmtGBP(result.statutoryPay)} primary sub={`${result.totalWeeks} weeks @ ${fmtGBP2(result.cappedWeeklyPay)}`} />
            <ResultBox label="Tax-free portion" value={fmtGBP(result.taxFree)} accent="#15803d" sub="Up to £30,000" />
            <ResultBox label="Taxable portion" value={fmtGBP(result.taxable)} accent={result.taxable > 0 ? '#b54708' : '#76777e'} sub="Taxed via PAYE" />
          </div>

          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <h3 className="text-[14px] font-bold text-[#0A2540] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              Year-by-year breakdown
            </h3>
            <div className="overflow-x-auto -mx-2">
              <table className="min-w-full text-[12.5px] tabular-nums">
                <thead className="text-[11px] uppercase tracking-wider text-[#76777e]">
                  <tr>
                    <th className="text-left font-semibold px-2 py-2">Year of service</th>
                    <th className="text-left font-semibold px-2 py-2">Age in that year</th>
                    <th className="text-right font-semibold px-2 py-2">Weeks multiplier</th>
                    <th className="text-right font-semibold px-2 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-[#0A2540]">
                  {result.slices.map((s) => (
                    <tr key={s.yearOfService} className="border-t border-[#E5E7EB]/60">
                      <td className="px-2 py-1.5">Year {s.yearOfService}</td>
                      <td className="px-2 py-1.5">{s.ageInYear}</td>
                      <td className="px-2 py-1.5 text-right">{s.weeksMultiplier} week{s.weeksMultiplier === 1 ? '' : 's'}</td>
                      <td className="px-2 py-1.5 text-right font-semibold">{fmtGBP(s.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.cappedWeeklyPay < parseFloat(weeklyPay) && (
              <p className="mt-3 text-[12.5px] text-[#76777e]">
                Your weekly pay (£{parseFloat(weeklyPay).toLocaleString()}) exceeds the statutory cap of £{WEEKLY_CAP}/week — calculation uses the cap. Your contract may provide enhanced redundancy on top.
              </p>
            )}
          </div>
        </>
      )}
    </CalcCard>
  );
}
