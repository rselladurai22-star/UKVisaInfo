'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, LineChart, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

export const SAVINGS_RELATED = [
  { href: '/pension-drawdown-calculator', label: 'Pension Drawdown', hint: 'Income & pot longevity' },
  { href: '/state-pension', label: 'State Pension', hint: 'From your NI years' },
  { href: '/isa-calculator', label: 'ISA Calculator', hint: 'Tax-free growth' },
  { href: '/lifetime-isa-calculator', label: 'Lifetime ISA', hint: '25% bonus' },
  { href: '/compound-interest-calculator', label: 'Compound Interest', hint: 'Growth over time' },
  { href: '/category/savings', label: 'All Savings Tools', hint: 'The full hub' },
];

export default function PensionCalculator() {
  const [age, setAge] = useState(35);
  const [retireAge, setRetireAge] = useState(67);
  const [pot, setPot] = useState(40000);
  const [monthly, setMonthly] = useState(400);
  const [growth, setGrowth] = useState(5);

  const r = useMemo(() => {
    const months = Math.max(0, Math.round((retireAge - age) * 12));
    const i = growth / 1200;
    const fv = i === 0 ? pot + monthly * months : pot * Math.pow(1 + i, months) + monthly * ((Math.pow(1 + i, months) - 1) / i);
    const contributions = pot + monthly * months;
    const taxFree = fv * 0.25;
    const income4 = fv * 0.04;
    // yearly chart
    const yrs = Math.max(1, retireAge - age);
    const yearly: number[] = [pot];
    let bal = pot;
    for (let y = 1; y <= yrs; y++) { for (let k = 0; k < 12; k++) bal = bal * (1 + i) + monthly; yearly.push(bal); }
    const labels = ['Now', ...Array.from({ length: yrs }, (_, k) => `Age ${age + k + 1}`)];
    return { fv, contributions, growthAmt: fv - contributions, taxFree, income4, yearly, labels };
  }, [age, retireAge, pot, monthly, growth]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Savings', href: '/category/savings' }, { label: 'Pension Calculator' }]}
      title="Pension Calculator"
      subtitle="Project your pension pot at retirement from your current savings and monthly contributions, then see the tax-free cash and the sustainable yearly income it could provide."
      calcLabel="Project my pension"
      inputs={
        <>
          <Panel title="You & retirement">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Current age, ${age}`}><Slider value={age} onChange={setAge} min={18} max={70} /></Field>
                <Field label={`Retire at, ${retireAge}`}><Slider value={retireAge} onChange={setRetireAge} min={Math.max(age + 1, 55)} max={75} /></Field>
              </div>
              <Field label="Current pension pot"><MoneyInput value={pot} onChange={setPot} step={1000} /></Field>
            </div>
          </Panel>
          <Panel title="Contributions & growth">
            <div className="space-y-4">
              <Field label="Monthly contribution" hint="You + employer combined, after tax relief"><MoneyInput value={monthly} onChange={setMonthly} step={50} /></Field>
              <Field label={`Assumed growth, ${pct(growth, 1)}/yr`} hint="After charges; 4 to 6% is a common assumption"><Slider value={growth} onChange={setGrowth} min={0} max={9} step={0.25} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label={`Pot at ${retireAge}`} value={gbp(r.fv)} sub="projected" tone="dark" big />
            <Stat label="Tax-free cash" value={gbp(r.taxFree)} sub="25% of pot" tone="accent" />
            <Stat label="Yearly income" value={gbp(r.income4)} sub="at 4% withdrawal" />
          </div>
          <Panel title="Pot growth to retirement">
            <LineChart height={210} labels={r.labels} format={(v) => gbp(v)} series={[{ points: r.yearly, color: PRIMARY, label: 'Projected pot' }]} />
          </Panel>
          <Panel title="Contributions vs growth">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Pot at retirement" centerValue={gbp(r.fv)} segments={[
                { value: r.contributions, color: PRIMARY, label: 'You paid in' },
                { value: r.growthAmt, color: ACCENT, label: 'Investment growth' },
              ]} />
              <div className="flex-1 space-y-3 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Total contributions</span><span className="font-semibold tabular-nums">{gbp(r.contributions)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Investment growth</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.growthAmt)}</span></div>
              </div>
            </div>
          </Panel>
          <Callout tone="info" title="A projection, not a promise">
            Real returns vary year to year and aren&apos;t guaranteed; charges and inflation reduce the real value.
            This excludes the State Pension, add that on top using the State Pension forecast.
          </Callout>
        </>
      }
    >
      <Guide
        title="How much pension will you have?"
        intro="Your retirement income comes from three places: workplace/personal pensions, the State Pension, and other savings. This guide explains how pensions grow, the tax perks, and how much to pay in."
      >
        <GuideSection kicker="The engine" title="Contributions, tax relief and compounding">
          <p>A pension is a long-term investment with two big advantages: <strong>tax relief</strong> on what you pay in, and <strong>compound growth</strong> over decades. Every £80 a basic-rate taxpayer contributes is topped up to £100 by tax relief; higher-rate taxpayers can claim more back. That boosted amount then grows tax-free inside the pension. Because compounding rewards time, starting earlier matters far more than paying in large amounts later.</p>
        </GuideSection>
        <GuideSection kicker="Workplace" title="Auto-enrolment and employer contributions">
          <p>Under auto-enrolment, employees contribute a minimum of 5% of qualifying earnings and employers add at least 3%, free money you shouldn&apos;t turn down. Many employers will <strong>match</strong> higher contributions, so paying in enough to get the full match is usually the best-value saving you can do. The calculator&apos;s &quot;monthly contribution&quot; should include both your and your employer&apos;s payments.</p>
          <Callout tone="tip" title="Grab the full match first">If your employer matches contributions up to, say, 6%, paying less than 6% leaves free money on the table. Maximise the match before other investing.</Callout>
        </GuideSection>
        <GuideSection kicker="At retirement" title="Tax-free cash and income">
          <p>From age 55 (rising to 57 in 2028) you can normally take <strong>25% of your pot tax-free</strong>. The rest provides income, via drawdown (keeping it invested and withdrawing flexibly), an annuity (a guaranteed income for life), or lump sums. A common rule of thumb is that withdrawing around <strong>4% a year</strong> gives a reasonable chance the pot lasts through retirement, though this depends on returns and how long you live.</p>
        </GuideSection>
        <GuideSection kicker="Limits" title="Allowances to know">
          <p>You get tax relief on pension contributions up to the <strong>annual allowance</strong> (£60,000 for most people in 2025/26, or 100% of earnings if lower), with tapering for very high earners and a lower limit once you start drawing flexibly. There&apos;s no longer a lifetime allowance cap on the pot itself, but limits apply to tax-free lump sums. The State Pension is separate and needs around 35 qualifying NI years for the full amount.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Starting late', 'Compounding rewards time more than amount. Even small early contributions beat large late ones.'],
            ['Not getting the employer match', 'Contributing below the match threshold turns down free money.'],
            ['Forgetting the State Pension', 'It&apos;s a valuable, separate income, check your forecast and NI record.'],
            ['Ignoring charges', 'High fund or platform fees compound against you over decades. Keep costs low.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much should I pay into a pension?', a: 'A common guide is to save a percentage of your salary equal to half your age when you started (e.g. 15% if you began at 30). At minimum, contribute enough to get the full employer match.' },
            { q: 'When can I access my pension?', a: 'Normally from age 55, rising to 57 in 2028, for personal and workplace pensions. The State Pension age is currently 66, rising to 67 and then 68.' },
            { q: 'How much is the State Pension?', a: 'The full new State Pension is £230.25 a week (about £11,973 a year) in 2025/26, needing roughly 35 qualifying NI years. Use the State Pension forecast to check yours.' },
            { q: 'Is this calculator inflation-adjusted?', a: 'No, it projects nominal (future) pounds. Remember inflation reduces what that pot will buy, so consider using a growth rate net of inflation for a "today&apos;s money" view.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={SAVINGS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
