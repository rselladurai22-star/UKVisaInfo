'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';
import { calculateRedundancy, WEEKLY_CAP, MAX_YEARS, TAX_FREE_CAP } from '../../lib/redundancy/calc';

const RELATED = [
  { href: '/sick-pay', label: 'Statutory Sick Pay', hint: 'SSP £118.75/week' },
  { href: '/maternity-pay', label: 'Maternity & Paternity', hint: 'SMP/SPP statutory pay' },
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Your normal net pay' },
  { href: '/holiday-pay', label: 'Holiday Pay', hint: '5.6 weeks entitlement' },
];

export default function RedundancyPay() {
  const [age, setAge] = useState(45);
  const [years, setYears] = useState(12);
  const [weeklyPay, setWeeklyPay] = useState(600);

  const r = useMemo(() => calculateRedundancy({ age, yearsService: years, weeklyPay }), [age, years, weeklyPay]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Employment', href: '/category/employment' }, { label: 'Redundancy Pay' }]}
      title="Redundancy Pay Calculator"
      subtitle="Work out your statutory redundancy entitlement for 2025/26 using the gov.uk age-banded formula — age × years of service × capped weekly pay."
      calcLabel="Calculate Redundancy Pay"
      inputs={
        <Panel title="Your Details">
          <div className="space-y-4">
            <Field label="Age when employment ends"><NumberInput value={age} onChange={setAge} min={16} step={1} suffix=" yrs" /></Field>
            <Field label="Complete years of service" hint={`Only the last ${MAX_YEARS} years count`}><NumberInput value={years} onChange={setYears} min={0} step={1} suffix=" yrs" /></Field>
            <Field label="Gross weekly pay" hint={`Capped at £${WEEKLY_CAP} for statutory redundancy`}><MoneyInput value={weeklyPay} onChange={setWeeklyPay} step={25} /></Field>
          </div>
        </Panel>
      }
      results={
        r.eligible ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Statutory Redundancy" value={gbp(r.statutoryPay)} sub={`${r.totalWeeks} weeks' pay`} tone="dark" big />
              <Stat label="Tax-Free" value={gbp(r.taxFree)} sub={`Up to £${TAX_FREE_CAP.toLocaleString()}`} tone="primary" />
              <Stat label="Capped Weekly Pay" value={gbp(r.cappedWeeklyPay)} sub={weeklyPay > WEEKLY_CAP ? `Capped from ${gbp(weeklyPay)}` : 'Within cap'} tone="accent" />
              <Stat label="Taxable" value={gbp(r.taxable)} sub="Above £30,000" />
            </div>

            <Panel title="Year-by-year breakdown">
              <div className="space-y-1.5 text-sm w-full max-h-64 overflow-y-auto">
                {r.slices.map((s) => (
                  <div key={s.yearOfService} className="flex justify-between">
                    <span className="text-on-surface-variant">Year {s.yearOfService} (age {s.ageInYear}) — {s.weeksMultiplier} wk</span>
                    <span className="font-semibold tabular-nums">{gbp(s.amount)}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Callout tone="info" title="Notice and holiday are separate">
              Statutory notice pay (1 week per year, max 12) and accrued unused holiday are paid on top of redundancy pay.
            </Callout>
          </>
        ) : (
          <Callout tone="warn" title="Not eligible for statutory redundancy">
            {r.reason}
          </Callout>
        )
      }
    >
      <Guide
        title="Statutory redundancy pay explained (2025/26)"
        intro="If you're made redundant after at least two years with an employer, you're legally entitled to statutory redundancy pay. The amount depends on your age, length of service and weekly pay. Here's how the formula works and what else you're owed."
      >
        <GuideSection kicker="The formula" title="Age bands and weeks">
          <p>For each full year of service, you get:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>0.5 week's pay</strong> for each year you were under 22.</li>
            <li><strong>1 week's pay</strong> for each year you were 22 to 40.</li>
            <li><strong>1.5 weeks' pay</strong> for each year you were 41 or older.</li>
          </ul>
          <p>Only the last <strong>20 years</strong> of service count, and your weekly pay is capped at <strong>£{WEEKLY_CAP}</strong> (from 6 April 2025).</p>
        </GuideSection>

        <GuideSection kicker="Eligibility" title="Who qualifies">
          <p>You need at least <strong>two years' continuous service</strong> with the same employer and must be an employee (not a contractor or most agency workers). You qualify if your role is genuinely redundant — the work has stopped or diminished — not if you're dismissed for conduct or resign.</p>
        </GuideSection>

        <GuideSection kicker="Tax" title="The £30,000 tax-free limit">
          <p>Statutory and enhanced redundancy pay is free of tax and National Insurance up to <strong>£30,000</strong>. Anything above that is taxed as earnings through PAYE. Payments in lieu of notice (PILON) are always taxable, even within the £30,000 band.</p>
          <Callout tone="warn" title="Watch contractual extras">
            Enhanced redundancy schemes can push you over £30,000. The excess is taxable, so check whether a payment is statutory redundancy or a taxable bonus dressed up as redundancy.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Age 45, 12 years' service, £600/week">
          <p>At 45 with 12 years' service, the most recent years fall in the 41+ band (1.5 weeks each) and earlier years in the 22–40 band (1 week each). Weekly pay of £600 is within the £{WEEKLY_CAP} cap. The calculator walks back year by year, totalling the weeks and multiplying by £600 to give the statutory entitlement — all tax-free as it's well under £30,000.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common redundancy mistakes">
          <Mistakes items={[
            ['Confusing redundancy with notice pay', 'They are separate — you get both statutory redundancy and statutory notice pay.'],
            ['Forgetting the 20-year cap', 'Service beyond 20 years does not increase statutory redundancy pay.'],
            ['Assuming high earners get full pay', 'Weekly pay is capped at £' + WEEKLY_CAP + ' for the statutory calculation, regardless of actual salary.'],
            ['Not checking for enhanced terms', 'Many contracts offer enhanced redundancy above the statutory minimum — read your contract and any collective agreement.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Do I pay tax on redundancy pay?', a: 'Statutory and enhanced redundancy pay is tax-free up to £30,000. Above that it is taxed as income. Notice pay (PILON) is always taxable.' },
            { q: 'What if I have under two years service?', a: 'You are not entitled to statutory redundancy pay, though you may still get contractual redundancy and your notice pay.' },
            { q: 'Is the weekly pay capped?', a: `Yes — for the statutory calculation a week's pay is capped at £${WEEKLY_CAP} from 6 April 2025, even if you earn more.` },
            { q: 'Does my employer have to consult?', a: 'Yes. Employers must follow a fair process, and collective consultation rules apply when 20 or more roles are at risk.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
