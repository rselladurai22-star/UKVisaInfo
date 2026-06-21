'use client';

import { useState, useMemo } from 'react';
import { calculateIhs } from '../../lib/ihs/calc';
import type { VisaCategory } from '../../lib/ihs/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function IhsClient() {
  const [category, setCategory] = useState<VisaCategory>('standard');
  const [years,    setYears]    = useState('3');
  const [months,   setMonths]   = useState('0');
  const [people,   setPeople]   = useState('2');

  const r = useMemo(() => calculateIhs({
    visaYears: parseFloat(years) || 0,
    visaMonths: parseFloat(months) || 0,
    applicants: parseFloat(people) || 1,
    category,
  }), [category, years, months, people]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Visa category"
          value={category}
          onChange={(v) => setCategory(v as VisaCategory)}
          options={[
            { value: 'standard', label: 'Standard (Skilled Worker, Family, etc.), £1,035/yr' },
            { value: 'student', label: 'Student / Youth Mobility Scheme, £776/yr' },
          ]}
        />
        <NumberField label="Visa duration, years" value={years} onChange={setYears} suffix="years" />
        <NumberField label="Additional months beyond whole years" value={months} onChange={setMonths} suffix="months" hint="E.g. 2 years 6 months = 2 years + 6 months" />
        <NumberField label="Total applicants (including dependants)" value={people} onChange={setPeople} hint="Main applicant + each dependant" />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultBox label="Rate per year" value={fmtGBP(r.ratePerYear)} muted />
        <ResultBox label="Duration charged" value={`${r.durationYears} year${r.durationYears !== 1 ? 's' : ''}`} muted sub="Rounded up to nearest full year" />
        <ResultBox label="Per person total" value={fmtGBP(r.perPersonTotal)} />
      </div>
      <div className="mt-4">
        <ResultBox label="Total IHS for all applicants" value={fmtGBP(r.totalIhs)} primary sub={`${parseFloat(people) || 1} applicant${(parseFloat(people)||1) !== 1 ? 's' : ''} × ${fmtGBP(r.perPersonTotal)}`} />
      </div>

      {r.durationYears > r.exactDurationYears && (
        <p className="mt-4 text-[13px] text-[#76777e]">
          Duration of {r.exactDurationYears.toFixed(2)} years rounds up to <strong>{r.durationYears} years</strong> for IHS purposes.
        </p>
      )}
    </CalcCard>
  );
}
