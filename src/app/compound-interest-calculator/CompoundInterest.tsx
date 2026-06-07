'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, LineChart, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { SAVINGS_RELATED } from '../pension-calculator/PensionCalculator';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState(5000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(20);

  const r = useMemo(() => {
    const i = rate / 1200;
    const yearly: number[] = [principal];
    let bal = principal;
    for (let y = 1; y <= years; y++) { for (let k = 0; k < 12; k++) bal = bal * (1 + i) + monthly; yearly.push(bal); }
    const final = bal;
    const contributions = principal + monthly * 12 * years;
    const interest = final - contributions;
    const labels = ['Now', ...Array.from({ length: years }, (_, k) => `Yr ${k + 1}`)];
    return { final, contributions, interest, yearly, labels };
  }, [principal, monthly, rate, years]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Savings', href: '/category/savings' }, { label: 'Compound Interest' }]}
      title="Compound Interest Calculator"
      subtitle="See how a lump sum and regular monthly saving grow over time when interest compounds — and how much of the final pot is your money versus interest earned on interest."
      calcLabel="Calculate growth"
      inputs={
        <Panel title="Your savings">
          <div className="space-y-4">
            <Field label="Starting amount"><MoneyInput value={principal} onChange={setPrincipal} step={500} /></Field>
            <Field label="Monthly contribution"><MoneyInput value={monthly} onChange={setMonthly} step={25} /></Field>
            <Field label={`Annual interest / return — ${pct(rate, 1)}`}><Slider value={rate} onChange={setRate} min={0} max={12} step={0.1} /></Field>
            <Field label={`Years — ${years}`}><Slider value={years} onChange={setYears} min={1} max={40} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Final balance" value={gbp(r.final)} sub={`after ${years} years`} tone="dark" big />
            <Stat label="Interest earned" value={gbp(r.interest)} sub="growth on growth" tone="accent" />
            <Stat label="You paid in" value={gbp(r.contributions)} sub="contributions" />
          </div>
          <Panel title="Balance over time">
            <LineChart height={210} labels={r.labels} format={(v) => gbp(v)} series={[{ points: r.yearly, color: PRIMARY, label: 'Balance' }]} />
          </Panel>
          <Panel title="Contributions vs interest">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Final balance" centerValue={gbp(r.final)} segments={[
                { value: r.contributions, color: PRIMARY, label: 'You paid in' },
                { value: r.interest, color: ACCENT, label: 'Interest earned' },
              ]} />
              <div className="flex-1 space-y-3 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Contributions</span><span className="font-semibold tabular-nums">{gbp(r.contributions)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Interest</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.interest)}</span></div>
              </div>
            </div>
          </Panel>
          <Callout tone="tip" title="Time is the magic ingredient">
            Interest earns interest, so the curve steepens over time — the longer you leave it, the more the growth
            dwarfs your contributions. Even a few extra years makes a big difference.
          </Callout>
        </>
      }
    >
      <Guide
        title="Compound interest, the eighth wonder"
        intro="Compound interest is interest earned on your interest — the force behind long-term wealth. This guide explains how it works, the maths, and how to make it work hardest for you."
      >
        <GuideSection kicker="The basics" title="Simple vs compound interest">
          <p>Simple interest is earned only on your original amount. <strong>Compound interest</strong> is earned on your original amount <em>plus</em> all the interest already added — so each period&apos;s interest is bigger than the last. Over a few years the difference is modest; over decades it&apos;s enormous. This is why compounding is often called the eighth wonder of the world, and why starting early beats saving more later.</p>
          <div className="my-3 p-5 rounded-lg bg-surface-container text-center"><code className="text-sm sm:text-base font-semibold text-primary">Future value = P × (1 + r)<sup>n</sup> + regular contributions compounded</code></div>
        </GuideSection>
        <GuideSection kicker="The levers" title="Rate, time and frequency">
          <p>Three things drive the result. The <strong>rate</strong> of return: even 1% extra a year compounds into a large gap over decades. <strong>Time</strong>: the single most powerful lever, because the steepest growth happens at the end. And <strong>compounding frequency</strong>: interest added monthly grows slightly faster than annually, as it starts compounding sooner. Regular contributions supercharge all three by constantly adding new money to compound.</p>
        </GuideSection>
        <GuideSection kicker="Quick maths" title="The Rule of 72">
          <p>To estimate how long an investment takes to double, divide 72 by the annual return. At 6% a year, money doubles in about 12 years (72 ÷ 6); at 8%, in 9 years. It&apos;s a handy mental shortcut for grasping the power — and the cost of a lower rate or higher fees, which extend the doubling time.</p>
          <Callout tone="warn" title="Fees and inflation compound too">A 1% annual fee compounds against you exactly like returns compound for you — over decades it can cost a large slice of the pot. And inflation erodes real value, so compare returns to inflation, not just to zero.</Callout>
        </GuideSection>
        <GuideSection kicker="Apply it" title="Where compounding works for you">
          <p>Compounding powers ISAs, pensions, savings accounts and investment funds. To harness it: start as early as possible, reinvest all interest and dividends, contribute regularly, keep charges low, and leave it alone — withdrawing early breaks the compounding chain. Tax wrappers like ISAs and pensions let the growth compound without tax dragging on it each year.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Waiting to start', 'The biggest growth happens in the final years, so delaying loses the most valuable compounding time.'],
            ['Not reinvesting', 'Spending the interest or dividends stops them compounding. Reinvest to keep the snowball rolling.'],
            ['Ignoring fees', 'High charges compound against you. A low-cost fund can be worth tens of thousands over time.'],
            ['Comparing to zero, not inflation', 'A 2% return when inflation is 3% loses real value. Aim to beat inflation.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is compound interest?', a: 'Interest calculated on your original amount plus the interest already earned, so your balance grows at an accelerating rate over time.' },
            { q: 'How often should interest compound?', a: 'More frequent compounding (monthly or daily) grows slightly faster than annual, but the rate and time matter far more. This calculator compounds monthly.' },
            { q: 'What return should I assume?', a: 'Cash savings might be 3–5%; long-term diversified investments have historically returned around 5–8% before inflation, but with risk and no guarantee. Use a realistic, conservative figure.' },
            { q: 'Is the growth taxed?', a: 'In a normal account, interest and gains may be taxable. Inside an ISA or pension, growth compounds tax-free, which boosts the long-term result.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={SAVINGS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
