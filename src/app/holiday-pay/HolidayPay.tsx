'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';
import { calcHoliday, type WorkerType } from '../../lib/holiday-pay/calc';

const RELATED = [
  { href: '/minimum-wage-checker', label: 'Minimum Wage', hint: 'NLW £12.21 · 2025' },
  { href: '/sick-pay', label: 'Statutory Sick Pay', hint: 'SSP £118.75/week' },
  { href: '/redundancy-pay', label: 'Redundancy Pay', hint: 'Statutory entitlement' },
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
];

export default function HolidayPay() {
  const [type, setType] = useState<WorkerType>('regular');
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [weeklyPay, setWeeklyPay] = useState(450);
  const [hoursWorked, setHoursWorked] = useState(160);
  const [hourlyRate, setHourlyRate] = useState(12.21);

  const r = useMemo(() => {
    if (type === 'irregular') {
      return calcHoliday({ type: 'irregular', hoursWorkedInPeriod: hoursWorked, hourlyRate });
    }
    return calcHoliday({ type: 'regular', daysPerWeek, weeklyGrossPay: weeklyPay });
  }, [type, daysPerWeek, weeklyPay, hoursWorked, hourlyRate]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Employment', href: '/category/employment' }, { label: 'Holiday Pay' }]}
      title="Holiday Entitlement & Pay Calculator"
      subtitle="Work out your statutory holiday for 2025/26 to 5.6 weeks a year for regular workers, or 12.07% of hours for irregular and part-year workers."
      calcLabel="Calculate Holiday"
      inputs={
        <Panel title="Your Work Pattern">
          <div className="space-y-4">
            <Field label="Type of worker">
              <Choice<WorkerType>
                name="type"
                value={type}
                onChange={setType}
                options={[
                  { value: 'regular', label: 'Regular hours', desc: 'Fixed days each week' },
                  { value: 'irregular', label: 'Irregular / part-year', desc: 'Zero-hours, casual, term-time' },
                ]}
              />
            </Field>
            {type === 'regular' ? (
              <>
                <Field label="Days worked per week"><NumberInput value={daysPerWeek} onChange={setDaysPerWeek} min={1} step={1} suffix=" days" /></Field>
                <Field label="Gross weekly pay (optional)"><MoneyInput value={weeklyPay} onChange={setWeeklyPay} step={25} /></Field>
              </>
            ) : (
              <>
                <Field label="Hours worked in the pay period"><NumberInput value={hoursWorked} onChange={setHoursWorked} min={0} step={5} suffix=" hrs" /></Field>
                <Field label="Hourly rate (optional)"><MoneyInput value={hourlyRate} onChange={setHourlyRate} step={0.25} /></Field>
              </>
            )}
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            {r.kind === 'regular' ? (
              <>
                <Stat label="Holiday Entitlement" value={`${r.entitlementDays?.toFixed(1)} days`} sub="Per year (5.6 weeks)" tone="dark" big />
                <Stat label="Cap Applied" value={r.cappedAtStatutoryMax ? '28 days' : 'No cap'} sub="Statutory maximum" tone="primary" />
              </>
            ) : (
              <>
                <Stat label="Holiday Accrued" value={`${r.entitlementHours?.toFixed(1)} hrs`} sub="12.07% of hours worked" tone="dark" big />
                <Stat label="Method" value="12.07%" sub="Per pay period" tone="primary" />
              </>
            )}
            {r.payValue !== undefined && (
              <Stat label="Holiday Pay Value" value={gbp(r.payValue)} sub="At your pay rate" tone="accent" />
            )}
          </div>

          <Callout tone="info" title="How it's calculated">
            {r.note}
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26. Holiday pay must reflect normal pay including regular overtime and commission. Bank holidays are usually counted within the 28-day cap, depending on your contract.</p>
        </>
      }
    >
      <Guide
        title="Holiday entitlement and pay explained (2025/26)"
        intro="Almost every UK worker is entitled to 5.6 weeks of paid holiday a year. How that translates into days depends on your working pattern, and irregular-hours workers use a percentage method instead. Here's how to work out what you're owed."
      >
        <GuideSection kicker="The basics" title="5.6 weeks for everyone">
          <p>The statutory minimum is <strong>5.6 weeks</strong> of paid holiday a year under the Working Time Regulations. For a five-day-a-week worker that's 5.6 × 5 = <strong>28 days</strong>, which is also the legal cap, employers don't have to give more than 28 days statutory, even if you work six or seven days a week. Part-time workers get a pro-rata amount: a three-day-a-week worker gets 5.6 × 3 = 16.8 days.</p>
        </GuideSection>

        <GuideSection kicker="Irregular hours" title="The 12.07% method">
          <p>Since 1 April 2024, irregular-hours and part-year workers (zero-hours, casual, term-time) accrue holiday at <strong>12.07%</strong> of the hours they work in each pay period. The figure comes from 5.6 weeks ÷ (52 − 5.6 working weeks). Employers can pay this as "rolled-up" holiday pay, an extra 12.07% added to each payslip, clearly itemised.</p>
        </GuideSection>

        <GuideSection kicker="Bank holidays" title="Are bank holidays extra?">
          <p>There's no automatic right to paid time off on bank holidays. Employers can include the eight English bank holidays within your 5.6 weeks, so "28 days including bank holidays" is lawful. Always check your contract to see whether bank holidays are on top of or inside your entitlement.</p>
          <Callout tone="warn" title="Holiday pay must reflect normal pay">
            Holiday pay should include regular overtime, commission and shift premiums, not just basic pay. Paying only basic salary for holiday can leave you underpaid.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A five-day worker">
          <p>Someone working five days a week is entitled to 28 days' paid holiday (5.6 × 5), capped at the statutory maximum. If they earn £450 a week, each week of holiday is worth £450, so the full 5.6 weeks is worth about £2,520 of paid time off across the year.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common holiday pay mistakes">
          <Mistakes items={[
            ['Basing holiday pay on basic pay only', 'Regular overtime and commission must be included in holiday pay.'],
            ['Assuming bank holidays are always extra', 'They can lawfully be counted within your 5.6 weeks, check your contract.'],
            ['Mishandling part-year workers', 'Term-time and zero-hours staff use the 12.07% accrual method, not a flat 12.07% of full-time holiday.'],
            ['Losing holiday at year end', 'You can usually carry over some untaken statutory leave, especially if sickness or family leave stopped you taking it.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How many days holiday am I entitled to?', a: 'At least 5.6 weeks a year, 28 days for a five-day worker, pro-rated for part-timers, capped at 28 days statutory.' },
            { q: 'What is the 12.07% rule?', a: 'It is the holiday accrual rate for irregular-hours and part-year workers: 12.07% of the hours worked in each pay period.' },
            { q: 'Can my employer choose when I take holiday?', a: 'Yes, with notice. They can require you to take leave at certain times (such as a Christmas shutdown) or refuse specific dates for business reasons.' },
            { q: 'Do I get paid for unused holiday when I leave?', a: 'Yes. Any accrued but untaken statutory holiday must be paid in your final pay when employment ends.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
