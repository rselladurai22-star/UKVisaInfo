'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const GEN_PER_KWP = 900; // kWh/year per kWp, UK average

const RELATED = [
  { href: '/energy-bill', label: 'Energy Bill', hint: 'Ofgem price cap' },
  { href: '/heat-pump-calculator', label: 'Heat Pump', hint: 'Running cost vs gas' },
  { href: '/ev-charging-cost', label: 'EV Charging Cost', hint: 'Home vs public' },
  { href: '/cost-of-living-uk', label: 'Cost of Living', hint: 'Household spending guide' },
];

export default function SolarRoi() {
  const [systemKw, setSystemKw] = useState(4);
  const [installCost, setInstallCost] = useState(6500);
  const [selfUsePct, setSelfUsePct] = useState(50);
  const [unitPrice, setUnitPrice] = useState(27);     // p/kWh import
  const [exportRate, setExportRate] = useState(15);   // p/kWh SEG

  const r = useMemo(() => {
    const generation = systemKw * GEN_PER_KWP;
    const selfUsed = generation * (selfUsePct / 100);
    const exported = generation - selfUsed;
    const importSaving = selfUsed * (unitPrice / 100);
    const exportIncome = exported * (exportRate / 100);
    const annualBenefit = importSaving + exportIncome;
    const payback = annualBenefit > 0 ? installCost / annualBenefit : 0;
    const benefit25 = annualBenefit * 25;
    const profit25 = benefit25 - installCost;
    const roi = installCost > 0 ? (profit25 / installCost) * 100 : 0;
    return { generation, selfUsed, exported, importSaving, exportIncome, annualBenefit, payback, benefit25, profit25, roi };
  }, [systemKw, installCost, selfUsePct, unitPrice, exportRate]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Energy', href: '/category/energy' }, { label: 'Solar Panel ROI' }]}
      title="Solar Panel ROI Calculator"
      subtitle="Estimate the payback period and 25-year return on solar panels — from system size, install cost, self-use and the export tariff."
      calcLabel="Calculate Solar ROI"
      inputs={
        <Panel title="Your System">
          <div className="space-y-4">
            <Field label="System size (kWp)" hint="A typical home system is 3.5–5 kWp"><NumberInput value={systemKw} onChange={setSystemKw} min={1} step={0.5} suffix=" kWp" /></Field>
            <Field label="Installation cost"><MoneyInput value={installCost} onChange={setInstallCost} step={250} /></Field>
            <Field label="Electricity you use yourself (%)" hint="Higher if home in the day or with a battery"><NumberInput value={selfUsePct} onChange={setSelfUsePct} min={0} step={5} suffix="%" /></Field>
            <Field label="Electricity unit price (p/kWh)"><NumberInput value={unitPrice} onChange={setUnitPrice} min={0} step={1} suffix="p" /></Field>
            <Field label="Export tariff (p/kWh)" hint="Smart Export Guarantee — varies by supplier"><NumberInput value={exportRate} onChange={setExportRate} min={0} step={1} suffix="p" /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Payback Period" value={`${r.payback.toFixed(1)} yrs`} sub="To recover the cost" tone="dark" big />
            <Stat label="Annual Benefit" value={gbp(r.annualBenefit)} sub="Savings + export income" tone="primary" />
            <Stat label="25-Year Profit" value={gbp(r.profit25)} sub="After install cost" tone="accent" />
            <Stat label="Return on Cost" value={pct(r.roi)} sub="Over 25 years" />
          </div>

          <Panel title="Where the value comes from">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Annual generation</span><span className="font-semibold tabular-nums">{Math.round(r.generation).toLocaleString()} kWh</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Self-used — bill savings</span><span className="font-semibold tabular-nums text-primary">{gbp(r.importSaving)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Exported — SEG income</span><span className="font-semibold tabular-nums">{gbp(r.exportIncome)}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Total per year</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.annualBenefit)}</span></div>
            </div>
          </Panel>

          <Callout tone="tip" title="Self-use is where the money is">
            Every kWh you use yourself saves the full {unitPrice}p import rate, while exported power only earns {exportRate}p. Shifting use to daylight hours — or adding a battery — sharply improves returns.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate only. Assumes ~{GEN_PER_KWP} kWh/year per kWp (UK average; varies by roof orientation and shading). Excludes panel degradation, inverter replacement and energy-price changes.</p>
        </>
      }
    >
      <Guide
        title="Are solar panels worth it in the UK?"
        intro="Solar panels can cut your electricity bills and earn money from exported power, but whether they pay off depends on your roof, how much energy you use during daylight, and what you pay to install them. This calculator estimates payback and lifetime return."
      >
        <GuideSection kicker="How it pays" title="Two sources of value">
          <p>A solar system saves and earns money in two ways:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Self-consumption:</strong> every unit you use yourself avoids buying it from the grid at the full import rate — the biggest saving.</li>
            <li><strong>Export income:</strong> surplus power sent back to the grid earns money under the Smart Export Guarantee (SEG), typically 5–15p/kWh depending on supplier.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Generation" title="What a UK roof produces">
          <p>As a rule of thumb, each kWp of panels generates around <strong>900 kWh a year</strong> in the UK, best on a south-facing, unshaded roof. A typical 4 kWp system therefore produces roughly 3,600 kWh — a large share of an average home's electricity. Output is highest in summer and lowest in winter, when demand is greatest.</p>
        </GuideSection>

        <GuideSection kicker="Self-use" title="Why timing matters so much">
          <p>The economics hinge on how much you use directly. If you're out all day and export most generation at 15p, returns are modest. If you run appliances in daylight, work from home, or add a battery to store solar for the evening, self-use climbs and so does the saving — because you avoid the much higher import rate.</p>
          <Callout tone="warn" title="Batteries add cost and payback">
            A home battery boosts self-use but can add £3,000–£5,000. It improves savings but usually lengthens the overall payback, so model it carefully.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A 4 kWp system at £6,500">
          <p>A 4 kWp system generates about 3,600 kWh a year. With 50% self-use at 27p, that's about £486 in bill savings, plus 1,800 kWh exported at 15p for £270 — roughly £756 a year. Against a £6,500 install, payback is around 8–9 years, after which it's largely profit across the panels' 25-year-plus life.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common solar mistakes">
          <Mistakes items={[
            ['Overestimating self-use', 'If you export most of your generation, returns are far lower than the headline savings suggest.'],
            ['Ignoring roof orientation', 'North-facing or heavily shaded roofs generate much less; get a proper site assessment.'],
            ['Forgetting inverter replacement', 'Inverters often need replacing once in the system life, an extra £800–£1,500.'],
            ['Choosing the cheapest quote blind', 'Compare equipment quality and warranties, not just price — get several MCS-certified quotes.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How long do solar panels take to pay back?', a: 'Typically 8–12 years in the UK, depending on system cost, self-use and export rates. Panels usually last 25 years or more.' },
            { q: 'What is the Smart Export Guarantee?', a: 'SEG requires larger suppliers to pay you for surplus electricity you export to the grid. Rates vary, so shop around for the best export tariff.' },
            { q: 'Do solar panels add value to my home?', a: 'They can, by lowering running costs and improving the EPC rating, though the effect on sale price varies.' },
            { q: 'Is there VAT on solar panels?', a: 'Residential solar installations currently benefit from 0% VAT in Great Britain, reducing the upfront cost.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
