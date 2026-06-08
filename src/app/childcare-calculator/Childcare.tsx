'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, NumberInput, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';
import { calculateChildcare, FREE_WEEKS } from '../../lib/childcare/calc';

const RELATED = [
  { href: '/universal-credit-calculator', label: 'Universal Credit', hint: 'Standard allowance + elements' },
  { href: '/maternity-pay', label: 'Maternity Pay', hint: 'SMP/SPP statutory pay' },
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
  { href: '/child-benefit-trap', label: 'Child Benefit Trap', hint: 'High income charge' },
];

export default function Childcare() {
  const [ageMonths, setAgeMonths] = useState(24);
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(7);
  const [weeksPerYear, setWeeksPerYear] = useState(51);
  const [working, setWorking] = useState(true);
  const [under100k, setUnder100k] = useState(true);
  const [onUC, setOnUC] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [numChildren, setNumChildren] = useState(1);

  const r = useMemo(() => calculateChildcare({
    childAgeMonths: ageMonths,
    weeklyHoursNeeded: weeklyHours,
    hourlyRate,
    weeksPerYear,
    workingParents: working,
    bothEarnUnder100k: under100k,
    onUniversalCredit: onUC,
    disabled,
    numberOfChildren: numChildren,
  }), [ageMonths, weeklyHours, hourlyRate, weeksPerYear, working, under100k, onUC, disabled, numChildren]);

  const net = onUC ? r.netWithUc : r.netWithTfc;
  const support = onUC ? r.ucChildcareSupport : r.tfcGovtContrib;

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Benefits', href: '/category/benefits' }, { label: 'Childcare Costs' }]}
      title="Childcare Cost Calculator"
      subtitle="Estimate your real childcare bill after free hours, Tax-Free Childcare and Universal Credit support for 2025/26."
      calcLabel="Calculate Childcare Cost"
      inputs={
        <div className="space-y-4">
          <Panel title="Your Childcare">
            <div className="space-y-4">
              <Field label="Child's age (months)"><NumberInput value={ageMonths} onChange={setAgeMonths} min={0} step={1} suffix=" mo" /></Field>
              <Field label="Hours needed per week"><NumberInput value={weeklyHours} onChange={setWeeklyHours} min={0} step={1} suffix=" hrs" /></Field>
              <Field label="Provider hourly rate"><NumberInput value={hourlyRate} onChange={setHourlyRate} min={0} step={0.5} suffix=" £" /></Field>
              <Field label="Weeks needed per year"><NumberInput value={weeksPerYear} onChange={setWeeksPerYear} min={1} step={1} suffix=" wks" /></Field>
              <Field label="Number of children in childcare"><NumberInput value={numChildren} onChange={setNumChildren} min={1} step={1} /></Field>
            </div>
          </Panel>
          <Panel title="Your Situation">
            <div className="space-y-4">
              <Toggle checked={working} onChange={setWorking} label="Working parent(s) (16+ hrs each)" />
              <Toggle checked={under100k} onChange={setUnder100k} label="Both parents earn under £100,000" />
              <Toggle checked={onUC} onChange={setOnUC} label="On Universal Credit" />
              <Toggle checked={disabled} onChange={setDisabled} label="Child is disabled" />
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Net Childcare Cost" value={gbp(net)} sub={`After support · ${onUC ? 'Universal Credit' : 'Tax-Free Childcare'}`} tone="dark" big />
            <Stat label="Per Month" value={gbp(net / 12)} sub="What you actually pay" tone="primary" />
            <Stat label="Gross Cost" value={gbp(r.grossAnnualCost)} sub="Before any help" tone="accent" />
            <Stat label="Government Support" value={gbp(r.freeHoursSaving + support)} sub="Free hours + scheme" />
          </div>

          <Panel title="How the help stacks up">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Gross annual cost</span><span className="font-semibold tabular-nums">{gbp(r.grossAnnualCost)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− Free hours ({FREE_WEEKS} weeks)</span><span className="font-semibold tabular-nums text-primary">−{gbp(r.freeHoursSaving)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− {onUC ? 'Universal Credit (85%)' : 'Tax-Free Childcare (20%)'}</span><span className="font-semibold tabular-nums text-primary">−{gbp(support)}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">You pay</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(net)}</span></div>
            </div>
          </Panel>

          <Callout tone="warn" title="You can't combine TFC and Universal Credit">
            Tax-Free Childcare and the Universal Credit childcare element cannot be claimed together. UC's 85% support is usually more generous for lower earners; TFC's 20% top-up suits higher earners not on UC.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26. From September 2025, 30 funded hours extend to children from 9 months for eligible working parents. Free hours cover {FREE_WEEKS} weeks a year; stretching them over more weeks lowers the weekly hours.</p>
        </>
      }
    >
      <Guide
        title="UK childcare support explained (2025/26)"
        intro="Childcare is one of the biggest costs for working families, but several government schemes can cut the bill dramatically: funded free hours, Tax-Free Childcare and the Universal Credit childcare element. Knowing which you qualify for — and which combine — makes a big difference."
      >
        <GuideSection kicker="Free hours" title="Funded early-years hours">
          <p>In England, funded childcare hours have expanded significantly:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>15 hours</strong> for all 3–4 year olds, regardless of income.</li>
            <li><strong>30 hours</strong> for 3–4 year olds of working parents.</li>
            <li><strong>30 hours</strong> for children from <strong>9 months</strong> of working parents, following the September 2025 expansion.</li>
          </ul>
          <p>Funded hours cover {FREE_WEEKS} weeks a year (term time). You can "stretch" them over more weeks at fewer hours per week if your provider allows.</p>
        </GuideSection>

        <GuideSection kicker="Tax-Free Childcare" title="The 20% top-up">
          <p><strong>Tax-Free Childcare (TFC)</strong> gives you £2 for every £8 you pay in, up to £2,000 a year per child (£4,000 if disabled). Both parents must generally work and each earn under £100,000. You pay into an online account and the government tops it up — effectively a 20% discount on childcare costs.</p>
        </GuideSection>

        <GuideSection kicker="Universal Credit" title="The 85% childcare element">
          <p>If you're on <strong>Universal Credit</strong> and working, you can claim back up to <strong>85%</strong> of childcare costs, capped at around £1,015 a month for one child and £1,739 for two or more. This is far more generous than TFC for lower earners — but you cannot have both.</p>
          <Callout tone="warn" title="The £100,000 cliff edge">
            If either parent's adjusted income tips over £100,000, you lose both the 30 funded hours and Tax-Free Childcare entirely — a cliff edge worth thousands. Pension contributions can bring income back under the line.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A two-year-old, 40 hours a week">
          <p>A two-year-old of working parents under £100k needing 40 hours a week at £7/hour costs about £14,280 a year gross (51 weeks). With 30 funded hours over 38 weeks saving roughly £7,980, and Tax-Free Childcare giving 20% off the remainder, the net cost falls substantially — often by more than half once both schemes are applied.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common childcare cost mistakes">
          <Mistakes items={[
            ['Trying to combine TFC and UC', 'You must choose one; they cannot be claimed together.'],
            ['Missing the 9-month expansion', 'From September 2025 funded 30 hours start at 9 months for eligible working parents.'],
            ['Falling off the £100,000 cliff', 'Crossing £100k income removes funded hours and TFC entirely — model pension contributions to stay under.'],
            ['Forgetting to reconfirm eligibility', 'You must reconfirm TFC and funded-hours eligibility every three months or risk losing it.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Can I get 30 free hours from 9 months?', a: 'Yes — since September 2025 eligible working parents can access 30 funded hours from when their child is 9 months old.' },
            { q: 'Is Tax-Free Childcare worth it?', a: 'For working parents not on Universal Credit, yes — it gives a 20% top-up worth up to £2,000 per child per year.' },
            { q: 'TFC or Universal Credit — which is better?', a: 'UC repays up to 85% of costs and usually wins for lower earners, while TFC suits higher earners not on UC. You cannot use both.' },
            { q: 'Do free hours cover the whole year?', a: 'Funded hours cover 38 weeks (term time). Many providers let you stretch them across more weeks at fewer hours per week.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/childcare-calculator" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
