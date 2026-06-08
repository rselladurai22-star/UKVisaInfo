'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

const LITRES_PER_GALLON = 4.54609;

const RELATED = [
  { href: '/fuel-cost-calculator', label: 'Fuel Cost', hint: 'Petrol/diesel per journey' },
  { href: '/vehicle-tax-calculator', label: 'Vehicle Tax', hint: 'EV VED from April 2025' },
  { href: '/energy-bill', label: 'Energy Bill', hint: 'Ofgem price cap' },
  { href: '/solar-panel-roi', label: 'Solar Panel ROI', hint: 'Charge from your roof' },
];

export default function EvCharging() {
  const [annualMiles, setAnnualMiles] = useState(9000);
  const [efficiency, setEfficiency] = useState(3.5);   // miles per kWh
  const [homePct, setHomePct] = useState(80);
  const [homeRate, setHomeRate] = useState(7);         // p/kWh off-peak
  const [publicRate, setPublicRate] = useState(75);    // p/kWh rapid
  const [petrolMpg, setPetrolMpg] = useState(45);
  const [petrolPrice, setPetrolPrice] = useState(140); // p/litre

  const r = useMemo(() => {
    const kwh = annualMiles / Math.max(0.1, efficiency);
    const homeKwh = kwh * (homePct / 100);
    const publicKwh = kwh - homeKwh;
    const annualCost = homeKwh * (homeRate / 100) + publicKwh * (publicRate / 100);
    const costPerMile = annualMiles > 0 ? annualCost / annualMiles : 0;

    // petrol comparison
    const petrolCostPerMile = (LITRES_PER_GALLON / Math.max(1, petrolMpg)) * (petrolPrice / 100);
    const petrolAnnual = petrolCostPerMile * annualMiles;
    const saving = petrolAnnual - annualCost;

    return { kwh, annualCost, costPerMile, petrolAnnual, petrolCostPerMile, saving, monthly: annualCost / 12 };
  }, [annualMiles, efficiency, homePct, homeRate, publicRate, petrolMpg, petrolPrice]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Energy', href: '/category/energy' }, { label: 'EV Charging Cost' }]}
      title="EV Charging Cost Calculator"
      subtitle="Work out the cost of charging an electric car — at home and on public chargers — and compare it with running a petrol car."
      calcLabel="Calculate Charging Cost"
      inputs={
        <div className="space-y-4">
          <Panel title="Your EV & Driving">
            <div className="space-y-4">
              <Field label="Annual mileage"><NumberInput value={annualMiles} onChange={setAnnualMiles} min={0} step={500} suffix=" mi" /></Field>
              <Field label="Efficiency (miles per kWh)" hint="Typically 3–4 mi/kWh"><NumberInput value={efficiency} onChange={setEfficiency} min={1} step={0.1} suffix=" mi" /></Field>
              <Field label="Charging at home (%)"><NumberInput value={homePct} onChange={setHomePct} min={0} step={5} suffix="%" /></Field>
              <Field label="Home rate (p/kWh)" hint="Off-peak EV tariffs can be ~7p"><NumberInput value={homeRate} onChange={setHomeRate} min={0} step={1} suffix="p" /></Field>
              <Field label="Public rate (p/kWh)" hint="Rapid chargers ~60–85p"><NumberInput value={publicRate} onChange={setPublicRate} min={0} step={5} suffix="p" /></Field>
            </div>
          </Panel>
          <Panel title="Compare with Petrol">
            <div className="space-y-4">
              <Field label="Petrol car MPG"><NumberInput value={petrolMpg} onChange={setPetrolMpg} min={1} step={1} suffix=" mpg" /></Field>
              <Field label="Petrol price (p/litre)"><NumberInput value={petrolPrice} onChange={setPetrolPrice} min={0} step={1} suffix="p" /></Field>
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Annual Charging Cost" value={gbp(r.annualCost)} sub={`${Math.round(r.kwh).toLocaleString()} kWh/year`} tone="dark" big />
            <Stat label="Cost Per Mile" value={gbp(r.costPerMile, 2)} sub="Electricity only" tone="primary" />
            <Stat label="vs Petrol" value={`${r.saving >= 0 ? 'Save ' : 'Cost +'}${gbp(Math.abs(r.saving))}`} sub={`Petrol: ${gbp(r.petrolAnnual)}/yr`} tone="accent" />
            <Stat label="Per Month" value={gbp(r.monthly)} sub="Average charging" />
          </div>

          <Panel title="Per-mile comparison">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">EV (your charging mix)</span><span className="font-semibold tabular-nums text-primary">{gbp(r.costPerMile, 2)}/mi</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Petrol equivalent</span><span className="font-semibold tabular-nums">{gbp(r.petrolCostPerMile, 2)}/mi</span></div>
            </div>
          </Panel>

          <Callout tone="tip" title="Home charging is the killer feature">
            On a 7p overnight EV tariff, home charging costs around 2p a mile — a fraction of petrol. Relying on rapid public chargers at 75p+ can cost as much as petrol, so home or workplace charging is where EVs really save.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate only. Real efficiency varies with speed, weather and load. Public charger prices vary widely by network. Remember EVs now pay road tax from April 2025.</p>
        </>
      }
    >
      <Guide
        title="How much does it cost to charge an electric car?"
        intro="Charging an EV can be dramatically cheaper than fuelling a petrol car — or surprisingly expensive — depending on where you plug in. The split between cheap home charging and pricey public rapids is the single biggest factor. Here's how to work out your real cost."
      >
        <GuideSection kicker="The basics" title="Miles per kWh and pence per kWh">
          <p>EV running cost comes down to two numbers: how far the car goes per kWh (its efficiency, typically 3–4 miles/kWh) and what you pay per kWh. Multiply your annual miles by the cost per mile to get the yearly bill:</p>
          <pre className="bg-surface-container p-3 rounded-lg text-xs font-mono tabular-nums text-on-surface">
            Cost per mile = price per kWh ÷ miles per kWh
          </pre>
          <p>At 7p/kWh and 3.5 miles/kWh, that's just 2p a mile.</p>
        </GuideSection>

        <GuideSection kicker="Home vs public" title="A huge price difference">
          <p>This is where EV costs diverge wildly:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Home off-peak:</strong> dedicated EV tariffs offer night rates around 7p/kWh — about 2p a mile.</li>
            <li><strong>Home standard:</strong> at the 27p cap rate, roughly 8p a mile.</li>
            <li><strong>Public rapid:</strong> 60–85p/kWh — around 20p a mile, comparable to or worse than petrol.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Petrol comparison" title="When EVs win">
          <p>A 45 MPG petrol car at £1.40 a litre costs about 14p a mile. An EV charged mostly at home destroys that — but one charged mostly on public rapids may not save much at all. Your home/public split, more than the car itself, decides whether you save.</p>
          <Callout tone="warn" title="No home charger changes the sums">
            Without off-street parking and a home charger, you rely on public networks at much higher rates. Factor this in before assuming an EV will be cheap to run.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="9,000 miles, mostly home charging">
          <p>Driving 9,000 miles a year at 3.5 miles/kWh uses about 2,570 kWh. Charging 80% at home (7p) and 20% on public rapids (75p) costs roughly £530 a year — about 6p a mile. The equivalent petrol car at 45 MPG would cost around £1,270, so the EV saves about £740 a year.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common EV charging mistakes">
          <Mistakes items={[
            ['Assuming all charging is cheap', 'Public rapid charging can cost as much per mile as petrol.'],
            ['Not switching to an EV tariff', 'A dedicated off-peak tariff can cut home charging cost by two-thirds.'],
            ['Ignoring winter efficiency', 'Cold weather and heating can cut range by 20–30%, raising cost per mile.'],
            ['Forgetting EV road tax', 'From April 2025 EVs pay VED, so they are no longer tax-free to keep on the road.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much does it cost to charge an EV at home?', a: 'On a standard tariff, around 8p a mile; on an off-peak EV tariff near 7p/kWh, about 2p a mile — far cheaper than petrol.' },
            { q: 'Is public charging expensive?', a: 'Rapid public chargers often cost 60–85p/kWh, which can work out around 20p a mile — similar to or more than petrol.' },
            { q: 'Do EVs pay road tax?', a: 'Yes, from 1 April 2025 electric cars pay Vehicle Excise Duty, ending their previous exemption.' },
            { q: 'How can I charge most cheaply?', a: 'Charge overnight at home on an off-peak EV tariff, and if you have solar panels, use surplus daytime generation to charge for next to nothing.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/ev-charging-cost" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
