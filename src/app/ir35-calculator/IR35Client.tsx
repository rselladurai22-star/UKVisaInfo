'use client';

import { useMemo, useState } from 'react';
import { calculateIR35 } from '../../lib/ir35/calc';
import {
  CalcCard, NumberField, SelectField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, Tip, fmtGBP,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function IR35Client() {
  const [dayRate, setDayRate] = useState('600');
  const [days, setDays]       = useState('220');
  const [salary, setSalary]   = useState<'5000' | '12570'>('12570');
  const [expenses, setExpenses] = useState('3000');

  const r = useMemo(() => calculateIR35({
    dayRate: parseFloat(dayRate) || 0,
    daysPerYear: parseFloat(days) || 0,
    directorSalary: (salary === '5000' ? 5000 : 12570) as 5000 | 12570,
    expenses: parseFloat(expenses) || 0,
  }), [dayRate, days, salary, expenses]);

  const better = r.betterOption;
  const gap = Math.abs(r.difference);

  return (
    <CalcCard wide>
      <SummaryHero
        label={better === 'tie' ? 'Both routes are equal' : `${better === 'outside' ? 'Outside' : 'Inside'} IR35 wins by`}
        value={fmtGBP(gap)}
        sub={better === 'tie'
          ? 'At this combination of day rate, days, salary and expenses both routes deliver the same net.'
          : `per year of additional take-home pay if your status is ${better === 'outside' ? 'genuinely outside (Ltd + dividends)' : 'inside (full PAYE)'}.`}
        tone={better === 'outside' ? 'teal' : better === 'inside' ? 'navy' : 'navy'}
        badge="2025/26"
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Your contract" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Day rate" prefix="£" value={dayRate} onChange={setDayRate} hint="Gross daily invoice rate" />
            <NumberField label="Billable days / year" value={days} onChange={setDays} hint="Typically 200–230" />
            <SelectField label="Director&rsquo;s salary (outside only)"
              value={salary} onChange={(v) => setSalary(v as '5000' | '12570')}
              options={[
                { value: '5000', label: '£5,000 (Secondary Threshold — zero employer NI)' },
                { value: '12570', label: '£12,570 (Personal Allowance — full IT-free)' },
              ]}
            />
            <NumberField label="Annual business expenses" prefix="£" value={expenses} onChange={setExpenses} hint="Accountant, insurance, equipment (outside only)" />
          </div>
        </Section>

        <Section title="Side-by-side comparison" eyebrow="Step 2" tone="results">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RouteCard route={r.inside} winning={better === 'inside'} />
            <RouteCard route={r.outside} winning={better === 'outside'} />
          </div>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Full tax breakdown both routes" eyebrow="Step 3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0A2540] mb-2">Inside IR35 · PAYE</p>
              <BreakdownTable
                highlightLast
                rows={[
                  { label: 'Contract value (gross)', value: fmtGBP(r.inside.grossContractValue) },
                  { label: 'Employer NI (deducted)', value: `–${fmtGBP(r.inside.employerNi)}`, negative: true },
                  { label: 'Deemed salary', value: fmtGBP(r.inside.grossContractValue - r.inside.employerNi), bold: true },
                  { label: 'Income tax', value: `–${fmtGBP(r.inside.incomeTax)}`, negative: true },
                  { label: 'Employee NI', value: `–${fmtGBP(r.inside.employeeNi)}`, negative: true },
                  { label: 'Take-home', value: fmtGBP(r.inside.takeHome), bold: true },
                ]}
              />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0A2540] mb-2">Outside IR35 · Ltd + dividends</p>
              <BreakdownTable
                highlightLast
                rows={[
                  { label: 'Contract value (gross)', value: fmtGBP(r.outside.grossContractValue) },
                  { label: 'Director salary', value: `–${fmtGBP(parseInt(salary))}`, negative: true },
                  { label: 'Business expenses', value: `–${fmtGBP(parseFloat(expenses) || 0)}`, negative: true },
                  { label: 'Corporation tax (25%)', value: `–${fmtGBP(r.outside.corporationTax)}`, negative: true },
                  { label: 'Dividend tax', value: `–${fmtGBP(r.outside.dividendTax)}`, negative: true },
                  { label: 'Total income tax + NI', value: `–${fmtGBP(r.outside.incomeTax + r.outside.employeeNi)}`, negative: true },
                  { label: 'Take-home', value: fmtGBP(r.outside.takeHome), bold: true },
                ]}
              />
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        <Tip tone="info">
          The status decision rests with the <strong>end-client</strong> for medium &amp; large companies (since April 2021). Only small companies (turnover ≤ £10.2m, employees ≤ 50, balance sheet ≤ £5.1m) leave it to the contractor.
        </Tip>
        {better === 'outside' && gap > 10000 && (
          <Tip tone="warn">
            The gap exceeds £10k/year — make sure your working practices genuinely support outside-IR35 status (substitution, control, mutuality of obligation). Insure with IR35-specific cover.
          </Tip>
        )}
        <Tip tone="info">
          The inside-IR35 column models the fee-payer deducting employer NI first, then PAYE — a typical umbrella / inside-IR35 setup. Outside assumes a Ltd structure with the chosen director salary plus dividends.
        </Tip>
      </div>
    </CalcCard>
  );
}

function RouteCard({ route, winning }: { route: { label: string; grossContractValue: number; takeHome: number; totalTax: number }; winning: boolean }) {
  return (
    <div className="rounded-xl border-2 p-4 transition-colors" style={{ borderColor: winning ? '#00C4B4' : '#E5E7EB', background: winning ? '#F4FBFA' : '#FFFFFF' }}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#0A2540]">{route.label}</p>
        {winning && <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-[#00C4B4] text-white">Winner</span>}
      </div>
      <div className="mt-3 text-[28px] font-extrabold tabular-nums text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
        {fmtGBP(route.takeHome)}
      </div>
      <div className="text-[11.5px] text-[#76777e] mt-1">Annual take-home</div>
      <div className="mt-3 pt-3 border-t border-[#E5E7EB] text-[12px] flex justify-between">
        <span className="text-[#76777e]">Total tax paid</span>
        <span className="tabular-nums font-bold text-[#7F1D1D]">{fmtGBP(route.totalTax)}</span>
      </div>
    </div>
  );
}
