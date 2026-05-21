'use client';

import { useState, useMemo } from 'react';
import { calculateContractorDayRate, BILLABLE_DAYS_DEFAULT } from '../../lib/contractor-day-rate/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function ContractorDayRateClient() {
  const [dayRate,  setDayRate]  = useState('450');
  const [days,     setDays]     = useState(String(BILLABLE_DAYS_DEFAULT));
  const [costs,    setCosts]    = useState('2500');
  const [salary,   setSalary]   = useState('12570');

  const r = useMemo(() => calculateContractorDayRate({
    dayRate: parseFloat(dayRate) || 0,
    billableDays: parseFloat(days) || BILLABLE_DAYS_DEFAULT,
    annualCosts: parseFloat(costs) || 0,
    directorSalary: (parseInt(salary) === 5000 ? 5000 : 12570) as 5000|12570,
  }), [dayRate, days, costs, salary]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Day rate" prefix="£" value={dayRate} onChange={setDayRate} hint="Gross daily invoice rate" />
        <NumberField label="Billable days per year" value={days} onChange={setDays} hint={`Default ${BILLABLE_DAYS_DEFAULT} days (260 − 28 holiday − 8 bank holidays)`} />
        <NumberField label="Annual business costs" prefix="£" value={costs} onChange={setCosts} hint="Accountancy, insurance, professional fees" />
        <SelectField
          label="Director&rsquo;s salary"
          value={salary}
          onChange={setSalary}
          options={[
            { value: '12570', label: '£12,570 (full Personal Allowance)' },
            { value: '5000', label: '£5,000 (zero employer NI)' },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultBox label="Annual contract income" value={fmtGBP(r.grossContractIncome)} muted />
        <ResultBox label="After business costs" value={fmtGBP(r.afterCosts)} muted />
        <ResultBox label="Ltd take-home (salary + dividends)" value={fmtGBP(r.ltdTakeHome)} primary />
        <ResultBox label="Equivalent permanent gross salary" value={fmtGBP(r.equivalentGrossSalary)} />
      </div>

      <div className="mt-4 p-4 bg-[#f0fdfa] rounded-xl border border-[#99f6e4] text-[13px]">
        <p className="text-[#0A2540]">
          A permanent employer would need to pay <strong>{fmtGBP(r.employerTotalCost)}</strong> total cost (salary + employer NI)
          — equivalent to <strong>{fmtGBP(r.dailyRateForEquivalence)}/day</strong> for {parseFloat(days) || BILLABLE_DAYS_DEFAULT} billable days.
        </p>
      </div>
    </CalcCard>
  );
}
