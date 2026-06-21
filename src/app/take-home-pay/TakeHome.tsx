'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, Choice, Toggle, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, incomeTax, employeeNI, studentLoan, personalAllowance, type StudentPlan } from '../../lib/tax2526';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const GREEN = '#0a7d4f';
const VIOLET = '#7c3aed';
const GOLD = '#C9A14A';

export const TAX_RELATED = [
  { href: '/self-employed-tax', label: 'Self-Employed Tax', hint: 'Self Assessment + Class 4 NI' },
  { href: '/national-insurance-calculator', label: 'National Insurance', hint: 'Class 1 / 4 NI' },
  { href: '/salary-sacrifice-calculator', label: 'Salary Sacrifice', hint: 'Pension / EV tax saving' },
  { href: '/director-dividend', label: 'Dividend Tax', hint: 'Salary + dividends' },
  { href: '/cgt-calculator', label: 'Capital Gains Tax', hint: 'On shares & property' },
  { href: '/category/tax', label: 'All Tax Tools', hint: 'The full hub' },
];

export default function TakeHome() {
  const [salary, setSalary] = useState(35000);
  const [pensionPct, setPensionPct] = useState(5);
  const [plan, setPlan] = useState<StudentPlan>('none');
  const [pg, setPg] = useState(false);

  const r = useMemo(() => {
    const pension = salary * (pensionPct / 100);
    const adjusted = Math.max(0, salary - pension); // salary-sacrifice basis
    const tax = incomeTax(adjusted);
    const ni = employeeNI(adjusted);
    const sl = studentLoan(adjusted, plan) + (pg ? studentLoan(adjusted, 'pg') : 0);
    const net = Math.max(0, adjusted - tax - ni - sl);
    const totalDeductions = tax + ni + sl;
    const effRate = salary > 0 ? (totalDeductions / salary) * 100 : 0;
    return { pension, adjusted, tax, ni, sl, net, effRate, pa: personalAllowance(adjusted) };
  }, [salary, pensionPct, plan, pg]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Take-home Pay' }]}
      title="Take-Home Pay Calculator"
      subtitle="See your real net pay after Income Tax, National Insurance, pension and student loan, yearly, monthly and weekly, on 2025/26 rates for England, Wales and NI."
      calcLabel="Calculate take-home"
      inputs={
        <Panel title="Your salary">
          <div className="space-y-4">
            <Field label="Gross annual salary"><MoneyInput value={salary} onChange={setSalary} step={1000} /></Field>
            <Field label={`Pension contribution, ${pensionPct}%`} hint="Salary-sacrifice basis (cuts tax + NI)"><Slider value={pensionPct} onChange={setPensionPct} min={0} max={40} /></Field>
            <Field label="Student loan plan">
              <Choice<StudentPlan> name="plan" value={plan} onChange={setPlan} options={[
                { value: 'none', label: 'None' }, { value: 'plan2', label: 'Plan 2 (2012 to 2023)' }, { value: 'plan1', label: 'Plan 1' }, { value: 'plan5', label: 'Plan 5 (2023+)' }, { value: 'plan4', label: 'Plan 4 (Scotland)' },
              ]} />
            </Field>
            <Toggle checked={pg} onChange={setPg} label="Also repaying a Postgraduate Loan" />
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Take-home / yr" value={gbp(r.net)} sub={`${pct(r.effRate)} deducted`} tone="dark" big />
            <Stat label="Per month" value={gbp(r.net / 12)} sub="net" tone="accent" />
            <Stat label="Per week" value={gbp(r.net / 52)} sub="net" />
            <Stat label="Per day" value={gbp(r.net / 260)} sub="working day" />
          </div>
          <Panel title="Where your salary goes">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Gross salary" centerValue={gbp(salary)} segments={[
                { value: r.net, color: GREEN, label: 'Take-home' },
                { value: r.tax, color: PRIMARY, label: 'Income Tax' },
                { value: r.ni, color: ACCENT, label: 'National Insurance' },
                { value: r.sl, color: VIOLET, label: 'Student loan' },
                { value: r.pension, color: GOLD, label: 'Pension' },
              ]} />
              <div className="flex-1 space-y-2 text-sm w-full">
                <Row label="Income Tax" value={gbp(r.tax)} c={PRIMARY} />
                <Row label="National Insurance" value={gbp(r.ni)} c={ACCENT} />
                {r.sl > 0 && <Row label="Student loan" value={gbp(r.sl)} c={VIOLET} />}
                {r.pension > 0 && <Row label="Pension (your pot)" value={gbp(r.pension)} c={GOLD} />}
                <div className="pt-2 border-t border-outline-variant"><Row label="Take-home pay" value={gbp(r.net)} c={GREEN} bold /></div>
              </div>
            </div>
          </Panel>
          {salary > 100000 && salary < 125140 && (
            <Callout tone="warn" title="The 60% tax trap">
              Between £100,000 and £125,140 your personal allowance is withdrawn (£1 per £2), creating an effective
              ~60% marginal rate. A pension contribution can reclaim the allowance and is very tax-efficient here.
            </Callout>
          )}
          <p className="text-[11px] text-on-surface-variant">Estimate on 2025/26 rUK rates. Excludes Scottish rates, tax-code adjustments, benefits-in-kind and other income. Verify on your payslip.</p>
        </>
      }
    >
      <Guide
        title="How your take-home pay is worked out"
        intro="Your gross salary and your take-home pay can differ by a third or more. This guide explains each deduction, Income Tax, National Insurance, pension and student loan, on 2025/26 rates."
      >
        <GuideSection kicker="Income tax" title="Allowance and bands (2025/26)">
          <p>You pay no Income Tax on the first <strong>£12,570</strong> (the personal allowance). Above that, the rest-of-UK rates are <strong>20%</strong> up to £50,270, <strong>40%</strong> to £125,140, and <strong>45%</strong> above. Earn over £100,000 and the allowance tapers away, £1 lost for every £2, which creates a punishing ~60% effective rate between £100,000 and £125,140. Scotland has its own bands.</p>
        </GuideSection>
        <GuideSection kicker="National Insurance" title="Class 1 employee NI">
          <p>Employees pay Class 1 NI of <strong>8%</strong> on earnings between £12,570 and £50,270, then <strong>2%</strong> above. Unlike Income Tax, NI is generally worked out per pay period, so a one-off bonus can be charged more NI in that month. NI funds the State Pension and certain benefits.</p>
        </GuideSection>
        <GuideSection kicker="Pension" title="Why pension contributions boost take-home efficiency">
          <p>Pension contributions reduce your taxable pay. Under <strong>salary sacrifice</strong>, you give up salary for an employer pension contribution, cutting both Income Tax <em>and</em> National Insurance, and often the employer adds their NI saving too. It&apos;s one of the most tax-efficient things most employees can do, especially for higher earners and those caught in the 60% trap.</p>
          <Callout tone="tip" title="Escape the 60% trap">If your income is just over £100,000, a pension contribution that brings it back under reclaims your personal allowance, effectively turning £100 of pension into far more than £100 of value.</Callout>
        </GuideSection>
        <GuideSection kicker="Student loan" title="Plan thresholds">
          <p>Student loan repayments are 9% of income above your plan&apos;s threshold (6% for postgraduate loans, payable on top). Thresholds for 2025/26 are roughly: Plan 1 £26,065, Plan 2 £28,470, Plan 4 £32,745 (Scotland), Plan 5 £25,000, Postgraduate £21,000. It&apos;s collected through PAYE like tax.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Checking the wrong tax code', 'A wrong code over- or under-taxes you. 1257L is the standard; check yours on your payslip.'],
            ['Ignoring the 60% band', 'Earning just over £100k can be barely worth it after the allowance taper, pension can fix it.'],
            ['Forgetting salary sacrifice saves NI too', 'Sacrifice beats relief-at-source for most because it also cuts National Insurance.'],
            ['Assuming bonuses are taxed more', 'They aren&apos;t taxed at a higher rate overall, NI timing just makes one payslip look heavier.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much of my salary do I take home?', a: 'It depends on your salary and deductions, but most basic-rate earners keep roughly 70 to 75% after tax and NI, less if repaying a student loan or contributing to a pension (which goes to your pot).' },
            { q: 'Is pension deducted before or after tax?', a: 'Under salary sacrifice and net-pay schemes, before tax, reducing your taxable income. Relief-at-source schemes add basic-rate relief to your contribution and higher-rate is claimed back separately.' },
            { q: 'Why is my first payslip taxed oddly?', a: 'PAYE spreads your allowance across the year. A new job, wrong code or mid-year start can cause over- or under-taxation that corrects over time or via a refund.' },
            { q: 'Does this cover Scotland?', a: 'No, Scotland has different income-tax bands and rates. Use a Scottish income tax calculator if you&apos;re a Scottish taxpayer.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}

function Row({ label, value, c, bold }: { label: string; value: string; c: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="flex items-center gap-2 text-on-surface-variant"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold' : 'font-semibold'}`}>{value}</span>
    </div>
  );
}
