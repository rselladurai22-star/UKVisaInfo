'use client';

import { useState, useMemo } from 'react';
import { calculateIR35 } from '../../lib/ir35/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function IR35Client() {
  const [dayRate,    setDayRate]    = useState('600');
  const [days,       setDays]       = useState('220');
  const [salary,     setSalary]     = useState('12570');
  const [expenses,   setExpenses]   = useState('3000');

  const r = useMemo(() => calculateIR35({
    dayRate: parseFloat(dayRate) || 0,
    daysPerYear: parseFloat(days) || 0,
    directorSalary: (parseInt(salary) === 5000 ? 5000 : 12570) as 5000 | 12570,
    expenses: parseFloat(expenses) || 0,
  }), [dayRate, days, salary, expenses]);

  const better = r.betterOption;

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Day rate" prefix="£" value={dayRate} onChange={setDayRate} hint="Gross daily invoice rate" />
        <NumberField label="Billable days per year" value={days} onChange={setDays} hint="Typically 200–230 days" />
        <SelectField
          label="Director&rsquo;s salary (outside IR35)"
          value={salary}
          onChange={setSalary}
          options={[
            { value: '5000', label: '£5,000 (secondary threshold — zero employer NI)' },
            { value: '12570', label: '£12,570 (full Personal Allowance)' },
          ]}
        />
        <NumberField label="Annual business expenses (outside only)" prefix="£" value={expenses} onChange={setExpenses} hint="Accountancy, insurance, equipment, etc." />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[r.inside, r.outside].map((path) => (
          <div key={path.label} className={`p-4 rounded-xl border-2 ${path.label === 'Outside IR35' && better === 'outside' ? 'border-[#00C4B4]' : path.label === 'Inside IR35' && better === 'inside' ? 'border-[#00C4B4]' : 'border-[#E5E7EB]'}`}>
            <p className="text-[13px] font-bold text-[#0A2540] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              {path.label} {path.label.replace(' IR35', '') === better.charAt(0).toUpperCase() + better.slice(1) ? '✓' : ''}
            </p>
            <div className="space-y-1.5 text-[12.5px]">
              <TaxRow label="Contract value" value={fmtGBP(path.grossContractValue)} />
              <TaxRow label="Income Tax" value={`–${fmtGBP(path.incomeTax)}`} />
              <TaxRow label="Employee NI" value={`–${fmtGBP(path.employeeNi)}`} />
              <TaxRow label="Employer NI" value={`–${fmtGBP(path.employerNi)}`} />
              {path.corporationTax > 0 && <TaxRow label="Corporation Tax" value={`–${fmtGBP(path.corporationTax)}`} />}
              {path.dividendTax > 0 && <TaxRow label="Dividend Tax" value={`–${fmtGBP(path.dividendTax)}`} />}
              <TaxRow label="Total tax" value={fmtGBP(path.totalTax)} bold />
              <TaxRow label="Take-home" value={fmtGBP(path.takeHome)} bold accent="#00C4B4" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <ResultBox
          label={better === 'outside' ? 'Outside IR35 saves you' : better === 'inside' ? 'Inside IR35 saves you' : 'Both routes are equal'}
          value={better === 'tie' ? '£0' : fmtGBP(Math.abs(r.difference))}
          primary
          sub="per year compared to the other route"
        />
      </div>
    </CalcCard>
  );
}

function TaxRow({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: string }) {
  return (
    <div className="flex justify-between items-center border-b border-[#E5E7EB]/40 py-1 last:border-0">
      <span className="text-[#76777e]">{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold' : ''}`} style={{ color: accent ?? (bold ? '#0A2540' : '#45464d') }}>{value}</span>
    </div>
  );
}
