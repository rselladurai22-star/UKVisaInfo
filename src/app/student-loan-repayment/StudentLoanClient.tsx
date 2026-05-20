'use client';

import { useState, useMemo } from 'react';
import { calculateStudentLoan, PLANS, type Plan } from '../../lib/student-loan/calc';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
const fmtMo = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(n);

export default function StudentLoanClient() {
  const [plan, setPlan] = useState<Plan>('plan5');
  const [salary, setSalary] = useState('40000');
  const [balance, setBalance] = useState('45000');
  const [growth, setGrowth] = useState('2');

  const result = useMemo(() =>
    calculateStudentLoan({
      plan,
      salary: parseFloat(salary) || 0,
      balance: parseFloat(balance) || 0,
      salaryGrowthPct: parseFloat(growth) || 0,
    }),
    [plan, salary, balance, growth],
  );

  return (
    <div className="max-w-4xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">

        <Field label="Repayment plan">
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as Plan)}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14.5px] font-semibold text-[#0A2540] bg-white outline-none focus:border-[#0A2540]"
          >
            {(Object.keys(PLANS) as Plan[]).map((p) => (
              <option key={p} value={p}>{PLANS[p].label}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <NumberField label="Gross annual salary" prefix="£" value={salary} onChange={setSalary} />
          <NumberField label="Outstanding balance" prefix="£" value={balance} onChange={setBalance} />
          <NumberField label="Salary growth / year" suffix="%" value={growth} onChange={setGrowth} />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ResultBox label="Monthly deduction" value={fmtMo(result.monthly)} primary />
          <ResultBox label="Annual deduction" value={fmt(result.annual)} />
          <ResultBox
            label="Years until clear"
            value={result.yearsToClear !== null ? `${result.yearsToClear} yrs` : `Not cleared in ${result.writtenOffAtYear} yrs`}
            accent={result.yearsToClear !== null ? '#15803d' : '#b54708'}
          />
        </div>

        {result.belowThreshold && (
          <p className="mt-5 text-[12.5px] text-[#76777e]">
            You\'re currently below the £{PLANS[plan].threshold.toLocaleString()} threshold — nothing is deducted at this salary.
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
          <h3 className="text-[14px] font-bold text-[#0A2540] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            Projection · {PLANS[plan].label}
          </h3>
          <p className="text-[12.5px] text-[#76777e] mb-3">{PLANS[plan].note} Interest used: {(result.projection.length > 0 ? PLANS[plan].defaultInterest * 100 : 0).toFixed(2)}%/yr.</p>
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-[12.5px] tabular-nums">
              <thead className="text-[11px] uppercase tracking-wider text-[#76777e]">
                <tr>
                  <th className="text-left font-semibold px-2 py-2">Year</th>
                  <th className="text-right font-semibold px-2 py-2">Salary</th>
                  <th className="text-right font-semibold px-2 py-2">Repaid</th>
                  <th className="text-right font-semibold px-2 py-2">Interest</th>
                  <th className="text-right font-semibold px-2 py-2">Balance</th>
                </tr>
              </thead>
              <tbody className="text-[#0A2540]">
                {result.projection.map((r) => (
                  <tr key={r.year} className="border-t border-[#E5E7EB]/60">
                    <td className="px-2 py-1.5">{r.year}</td>
                    <td className="px-2 py-1.5 text-right">{fmt(r.salary)}</td>
                    <td className="px-2 py-1.5 text-right">{fmt(r.repayment)}</td>
                    <td className="px-2 py-1.5 text-right text-[#b54708]">{fmt(r.interest)}</td>
                    <td className="px-2 py-1.5 text-right font-semibold">{fmt(r.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[12.5px] text-[#45464d]">
            <span>Total repaid: <strong className="text-[#0A2540]">{fmt(result.totalRepaid)}</strong></span>
            <span>Total interest: <strong className="text-[#b54708]">{fmt(result.totalInterest)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function NumberField({ label, value, onChange, prefix, suffix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-3 py-2.5 focus-within:border-[#0A2540]">
        {prefix && <span className="text-[#76777e] text-[15px] font-semibold">{prefix}</span>}
        <input
          type="number" inputMode="decimal" value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[16px] font-bold text-[#0A2540] tabular-nums outline-none"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        />
        {suffix && <span className="text-[#76777e] text-[13px]">{suffix}</span>}
      </div>
    </Field>
  );
}

function ResultBox({ label, value, primary, accent }: { label: string; value: string; primary?: boolean; accent?: string }) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: primary ? '#0A2540' : '#ffffff',
        borderColor: primary ? '#0A2540' : '#E5E7EB',
        color: primary ? '#ffffff' : '#0A2540',
      }}
    >
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: primary ? 'rgba(255,255,255,0.6)' : accent ?? '#76777e' }}>
        {label}
      </div>
      <div className="mt-1 font-bold tabular-nums text-[18px] md:text-[20px] tracking-[-0.01em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
        {value}
      </div>
    </div>
  );
}
