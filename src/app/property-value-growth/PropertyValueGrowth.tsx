'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, LineChart,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { PROPERTY_RELATED } from '../ltv-calculator/LtvCalculator';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const GREY = '#94a3b8';

export default function PropertyValueGrowth() {
  const [value, setValue] = useState(280000);
  const [growth, setGrowth] = useState(3);
  const [years, setYears] = useState(15);
  const [inflation, setInflation] = useState(2.5);

  const r = useMemo(() => {
    const mk = (g: number) => {
      const out = [value];
      for (let y = 1; y <= years; y++) out.push(value * Math.pow(1 + g / 100, y));
      return out;
    };
    const mid = mk(growth);
    const low = mk(Math.max(-5, growth - 1.5));
    const high = mk(growth + 1.5);
    const labels = ['Now', ...Array.from({ length: years }, (_, i) => `Yr ${i + 1}`)];
    const finalMid = mid[mid.length - 1];
    const totalGrowth = finalMid - value;
    const realFinal = finalMid / Math.pow(1 + inflation / 100, years);
    return { mid, low, high, labels, finalMid, totalGrowth, realFinal };
  }, [value, growth, years, inflation]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Property', href: '/category/property' }, { label: 'Property Value Growth' }]}
      title="Property Value Growth Calculator"
      subtitle="Project what your property could be worth over time at a chosen growth rate, with a low-to-high range and an inflation-adjusted 'real' value so you can see the gain in today's money."
      inputs={
        <Panel title="Assumptions">
          <div className="space-y-4">
            <Field label="Current property value"><MoneyInput value={value} onChange={setValue} step={5000} /></Field>
            <Field label={`Annual growth, ${pct(growth, 1)}`}><Slider value={growth} onChange={setGrowth} min={-2} max={8} step={0.25} /></Field>
            <Field label={`Years to project, ${years}`}><Slider value={years} onChange={setYears} min={1} max={30} step={1} /></Field>
            <Field label={`Inflation (for real value), ${pct(inflation, 1)}`}><Slider value={inflation} onChange={setInflation} min={0} max={6} step={0.25} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label={`Value in ${years} years`} value={gbp(r.finalMid)} sub={`at ${pct(growth, 1)}/yr`} tone="dark" big />
            <Stat label="Total growth" value={gbp(r.totalGrowth)} sub={`${pct((r.totalGrowth / value) * 100, 0)} gain`} tone="accent" />
            <Stat label="In today's money" value={gbp(r.realFinal)} sub="inflation-adjusted" />
          </div>

          <Panel title="Projected value over time">
            <LineChart height={220} labels={r.labels} format={(v) => gbp(v)}
              series={[
                { points: r.high, color: GREY, label: `High (${pct(growth + 1.5, 1)})`, dashed: true },
                { points: r.mid, color: PRIMARY, label: `Central (${pct(growth, 1)})` },
                { points: r.low, color: ACCENT, label: `Low (${pct(Math.max(-5, growth - 1.5), 1)})`, dashed: true },
              ]} />
            <p className="mt-2 text-xs text-on-surface-variant">The band shows how sensitive the outcome is to the growth rate. No one can predict house prices, treat this as a range of scenarios, not a forecast.</p>
          </Panel>

          <Callout tone="info" title="Nominal vs real">
            The headline figure is in future pounds. The &quot;today&apos;s money&quot; figure strips out inflation so you can
            judge the genuine increase in buying power, often a far more sobering number.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">A projection, not a prediction. Past growth doesn&apos;t guarantee future returns; prices can and do fall.</p>
        </>
      }
    >
      <Guide
        title="Understanding house-price growth"
        intro="Property is often assumed to 'always go up', but the real picture is more nuanced. This guide explains how growth compounds, why inflation matters, what actually drives UK house prices, and how to use projections sensibly."
      >
        <GuideSection kicker="History" title="What UK house prices have actually done">
          <p>Over the long run, UK house prices have grown roughly in line with, or a little above, incomes, averaging somewhere around 3 to 4% a year in nominal terms across recent decades. But that average hides long flat spells and real falls, such as the early-1990s slump and the 2008 financial crisis. Growth is also wildly uneven by region: London and the South East surged for years before slowing, while parts of the North have only recently recovered earlier peaks.</p>
        </GuideSection>
        <GuideSection kicker="The maths" title="Why compounding matters">
          <p>Growth compounds: each year&apos;s increase is applied to a larger base. At 3% a year, a £280,000 home becomes about £376,000 after 10 years and £505,000 after 20, not because the annual rise grows, but because it stacks. Small changes to the rate have outsized effects over long horizons, which is why the low-to-high band in the calculator widens so much over time.</p>
          <div className="my-3 p-5 rounded-lg bg-surface-container text-center"><code className="text-sm sm:text-base font-semibold text-primary">Future value = current value × (1 + growth)<sup>years</sup></code></div>
        </GuideSection>
        <GuideSection kicker="Real terms" title="Nominal vs real value">
          <p>A price that doubles over 20 years sounds impressive, but if general prices also rose substantially over that period, your home&apos;s real buying power grew far less. The inflation-adjusted (&quot;real&quot;) figure shows the value in today&apos;s money. For a true picture of whether property built wealth, always look at real growth, not just the headline number.</p>
          <Callout tone="tip" title="The leverage twist">In real terms house prices grow modestly, but because most buyers use a mortgage, even modest growth on the whole property value can be a large return on the deposit. Leverage, not raw price growth, is what makes property powerful.</Callout>
        </GuideSection>
        <GuideSection kicker="Drivers" title="What moves house prices">
          <p>The big levers are interest rates and mortgage availability (cheaper borrowing lifts what buyers can pay), incomes and employment, supply of new homes, demographics and migration, and government policy such as stamp duty changes or help-to-buy schemes. Local factors, transport links, schools, regeneration, drive the wide gap between regions and even neighbouring streets.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Assuming prices only rise', 'They fall in some periods. Stress-test your plans against flat or negative growth.'],
            ['Confusing nominal with real gains', 'Inflation can eat most of a headline rise. Judge growth in today&apos;s money.'],
            ['Extrapolating one region&apos;s past', 'A decade of strong London growth tells you little about the next decade anywhere.'],
            ['Forgetting costs', 'Buying, selling, maintaining and financing a home all eat into the paper gain.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much do UK house prices grow each year?', a: 'Historically around 3 to 4% a year on average in nominal terms, but with long flat periods and occasional falls, and big regional differences. No average guarantees any individual property&apos;s outcome.' },
            { q: 'What growth rate should I assume?', a: 'A central case of 2 to 4% is common, but test a range. The low-to-high band in the calculator shows how much the assumption changes the result.' },
            { q: 'Is property a good investment?', a: 'It can be, especially via the leverage a mortgage provides, but it is illiquid, concentrated in a single asset, and carries buying, selling and maintenance costs. Compare it honestly against other options.' },
            { q: 'Why is real value lower than the projected value?', a: 'The projected value is in future pounds; the real value strips out inflation to show the increase in genuine buying power, which is usually much smaller.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={PROPERTY_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
