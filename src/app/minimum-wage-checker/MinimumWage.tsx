'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';
import { calculateMinimumWage, NMW_RATES } from '../../lib/minimum-wage/calc';

const CATEGORY_LABEL: Record<string, string> = {
  nlw: 'National Living Wage (21+)',
  age18to20: '18–20 rate',
  under18: 'Under-18 rate',
  apprentice: 'Apprentice rate',
};

const RELATED = [
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
  { href: '/holiday-pay', label: 'Holiday Pay', hint: '5.6 weeks entitlement' },
  { href: '/sick-pay', label: 'Statutory Sick Pay', hint: 'SSP £118.75/week' },
  { href: '/salary-compare', label: 'Salary Compare', hint: 'City cost-of-living equivalent' },
];

export default function MinimumWage() {
  const [age, setAge] = useState(25);
  const [isApprentice, setIsApprentice] = useState(false);
  const [apprenticeY1, setApprenticeY1] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(12.21);
  const [weeklyHours, setWeeklyHours] = useState(37.5);

  const r = useMemo(
    () => calculateMinimumWage({ age, isApprentice, apprenticeAge19PlusYear1: apprenticeY1, hourlyRate, weeklyHours }),
    [age, isApprentice, apprenticeY1, hourlyRate, weeklyHours],
  );

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Employment', href: '/category/employment' }, { label: 'Minimum Wage' }]}
      title="Minimum Wage Checker"
      subtitle="Check whether your pay meets the UK National Minimum Wage and National Living Wage rates from 1 April 2025 — and see any shortfall you're owed."
      calcLabel="Check My Pay"
      inputs={
        <Panel title="Your Pay">
          <div className="space-y-4">
            <Field label="Your age"><NumberInput value={age} onChange={setAge} min={16} step={1} suffix=" yrs" /></Field>
            <Toggle checked={isApprentice} onChange={setIsApprentice} label="I'm an apprentice" />
            {isApprentice && (
              <Toggle checked={apprenticeY1} onChange={setApprenticeY1} label="Aged 19+ and in the first year of my apprenticeship" />
            )}
            <Field label="Your hourly rate"><MoneyInput value={hourlyRate} onChange={setHourlyRate} step={0.25} /></Field>
            <Field label="Hours worked per week"><NumberInput value={weeklyHours} onChange={setWeeklyHours} min={0} step={0.5} suffix=" hrs" /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label={r.compliant ? 'Compliant' : 'Underpaid'} value={r.compliant ? '✓ Legal' : gbp(r.weeklyShortfall) + '/wk'} sub={CATEGORY_LABEL[r.category]} tone={r.compliant ? 'primary' : 'accent'} big />
            <Stat label="Minimum Rate" value={gbp(r.minimumRate)} sub="Per hour for your category" tone="dark" />
            <Stat label="Your Rate" value={gbp(r.actualRate)} sub={`${(r.actualRate - r.minimumRate >= 0 ? '+' : '') + gbp(r.actualRate - r.minimumRate)} vs minimum`} />
            <Stat label="Annual Pay" value={gbp(r.annualPay)} sub={`Minimum: ${gbp(r.annualMinimumPay)}`} />
          </div>

          {!r.compliant ? (
            <Callout tone="warn" title="You appear to be underpaid">
              Based on these figures you're owed about <strong>{gbp(r.weeklyShortfall)}</strong> a week — roughly <strong>{gbp(r.annualShortfall)}</strong> a year. Underpayment of the minimum wage is illegal; raise it with your employer or report it to HMRC.
            </Callout>
          ) : (
            <Callout tone="tip" title="Your pay meets the legal minimum">
              You're being paid at or above the {CATEGORY_LABEL[r.category]} of {gbp(r.minimumRate)} an hour.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Rates effective 1 April 2025. Minimum wage is based on average pay across the reference period; tips, accommodation offsets and deductions can affect the real figure.</p>
        </>
      }
    >
      <Guide
        title="UK minimum wage rates explained (from April 2025)"
        intro="The National Minimum Wage and National Living Wage set the legal floor for hourly pay in the UK. Rates rose on 1 April 2025 and depend on your age and whether you're an apprentice. Here's what you should be earning and what to do if you're underpaid."
      >
        <GuideSection kicker="The rates" title="Minimum wage from 1 April 2025">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>National Living Wage (21 and over): £{NMW_RATES.nlw.toFixed(2)}</strong> per hour.</li>
            <li><strong>18 to 20: £{NMW_RATES.age18to20.toFixed(2)}</strong> per hour.</li>
            <li><strong>Under 18: £{NMW_RATES.under18.toFixed(2)}</strong> per hour.</li>
            <li><strong>Apprentice: £{NMW_RATES.apprentice.toFixed(2)}</strong> per hour.</li>
          </ul>
          <p>The National Living Wage now applies from age 21 (it was 23 until April 2024). The 16–17 and apprentice rates are the same for 2025/26.</p>
        </GuideSection>

        <GuideSection kicker="Apprentices" title="When the apprentice rate applies">
          <p>The apprentice rate applies if you're <strong>under 19</strong>, or <strong>19 or over but in the first year</strong> of your apprenticeship. Once you turn 19 and complete your first year, you move onto the rate for your age — a common point where employers forget to update pay.</p>
        </GuideSection>

        <GuideSection kicker="What counts" title="Pay that does and doesn't count">
          <p>Minimum wage is calculated on your average pay over a reference period. Some things don't count towards it:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Tips and service charges</strong> do not count towards minimum wage.</li>
            <li><strong>Deductions</strong> for items required for the job (uniform, tools) can take you below the minimum — which is unlawful.</li>
            <li><strong>Accommodation</strong> provided by the employer has a capped daily offset that can count.</li>
          </ul>
          <Callout tone="warn" title="Unpaid working time is a common trap">
            Time spent on security checks, opening up, training or travel between assignments often counts as working time — if it pushes your average below the minimum, you're being underpaid.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A 25-year-old on 37.5 hours">
          <p>A 25-year-old qualifies for the National Living Wage of £{NMW_RATES.nlw.toFixed(2)}. On 37.5 hours a week that's a legal minimum of about £{(NMW_RATES.nlw * 37.5).toFixed(2)} a week, or roughly £{Math.round(NMW_RATES.nlw * 37.5 * 52).toLocaleString()} a year. If they're paid less per hour, the weekly shortfall multiplied across the year is what they're owed.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common minimum wage mistakes">
          <Mistakes items={[
            ['Not updating pay on a birthday', 'Moving age band — especially turning 21 — should trigger a pay rise to the higher rate.'],
            ['Counting tips towards the minimum', 'Tips never count; your basic pay alone must meet the minimum wage.'],
            ['Unlawful deductions', 'Charging for uniforms or tools cannot take pay below the legal minimum.'],
            ['Ignoring unpaid working time', 'Pre- and post-shift duties and certain travel are working time and must be paid.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is the difference between minimum and living wage?', a: 'The National Living Wage is the top band (now 21+) of the National Minimum Wage system. It is different from the voluntary "real Living Wage" set by the Living Wage Foundation.' },
            { q: 'What if my employer underpays me?', a: 'Raise it with them first. You can then complain to HMRC, which can order back pay and fine the employer. Claims can go back up to six years.' },
            { q: 'Does the minimum wage apply to zero-hours contracts?', a: 'Yes. Anyone classed as a worker or employee is entitled to at least the minimum wage for the hours they actually work.' },
            { q: 'Are interns entitled to the minimum wage?', a: 'Usually yes, if they have set hours and duties (making them a worker). Genuine work-shadowing or student placements can be exceptions.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
