'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

const LITRES_PER_GALLON = 4.54609;

type Unit = 'mpg' | 'l100';

const RELATED = [
  { href: '/car-running-costs', label: 'Car Running Costs', hint: 'Total cost of ownership' },
  { href: '/vehicle-tax-calculator', label: 'Vehicle Tax', hint: 'VED by CO2 & list price' },
  { href: '/car-finance-calculator', label: 'Car Finance', hint: 'PCP vs HP vs loan' },
  { href: '/ev-charging-cost', label: 'EV Charging Cost', hint: 'Home vs public' },
];

export default function FuelCost() {
  const [unit, setUnit] = useState<Unit>('mpg');
  const [efficiency, setEfficiency] = useState(45);
  const [pricePerLitre, setPricePerLitre] = useState(140);
  const [distance, setDistance] = useState(30);
  const [annualMiles, setAnnualMiles] = useState(9000);

  const r = useMemo(() => {
    const pricePounds = pricePerLitre / 100;
    // litres per mile
    let litresPerMile: number;
    if (unit === 'mpg') {
      litresPerMile = efficiency > 0 ? LITRES_PER_GALLON / efficiency : 0;
    } else {
      // L/100km → per mile: efficiency L per 100km, 1 mile = 1.60934 km
      litresPerMile = (efficiency / 100) * 1.60934;
    }
    const costPerMile = litresPerMile * pricePounds;
    const journeyCost = costPerMile * distance;
    const annualCost = costPerMile * annualMiles;
    return { costPerMile, journeyCost, annualCost, monthly: annualCost / 12 };
  }, [unit, efficiency, pricePerLitre, distance, annualMiles]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vehicles', href: '/category/vehicles' }, { label: 'Fuel Cost' }]}
      title="Fuel Cost Calculator"
      subtitle="Work out the fuel cost of any journey and your yearly fuel bill from your car's MPG and the current pump price."
      calcLabel="Calculate Fuel Cost"
      inputs={
        <Panel title="Your Car & Trip">
          <div className="space-y-4">
            <Field label="Efficiency unit">
              <Choice<Unit>
                name="unit"
                value={unit}
                onChange={setUnit}
                options={[
                  { value: 'mpg', label: 'Miles per gallon (MPG)', desc: 'UK standard' },
                  { value: 'l100', label: 'Litres per 100km', desc: 'Metric' },
                ]}
              />
            </Field>
            <Field label={unit === 'mpg' ? 'Fuel economy (MPG)' : 'Consumption (L/100km)'}>
              <NumberInput value={efficiency} onChange={setEfficiency} min={1} step={1} suffix={unit === 'mpg' ? ' mpg' : ' L'} />
            </Field>
            <Field label="Fuel price (pence per litre)"><NumberInput value={pricePerLitre} onChange={setPricePerLitre} min={0} step={1} suffix="p" /></Field>
            <Field label="Journey distance (miles)"><NumberInput value={distance} onChange={setDistance} min={0} step={5} suffix=" mi" /></Field>
            <Field label="Annual mileage"><NumberInput value={annualMiles} onChange={setAnnualMiles} min={0} step={500} suffix=" mi" /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="This Journey" value={gbp(r.journeyCost, 2)} sub={`${distance} miles`} tone="dark" big />
            <Stat label="Cost Per Mile" value={gbp(r.costPerMile, 2)} sub="Fuel only" tone="primary" />
            <Stat label="Annual Fuel" value={gbp(r.annualCost)} sub={`${annualMiles.toLocaleString()} miles/year`} tone="accent" />
            <Stat label="Per Month" value={gbp(r.monthly)} sub="Average fuel spend" />
          </div>

          <Callout tone="tip" title="MPG drops in the real world">
            Official MPG figures are lab-tested. Real-world economy is often 10–20% lower, especially in town, with a full car, or in cold weather. Use your own brim-to-brim figure for accuracy.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Fuel-only estimate. 1 UK gallon = 4.546 litres. Doesn't include tax, insurance, servicing or depreciation — see the running-costs calculator for total cost.</p>
        </>
      }
    >
      <Guide
        title="How to work out your fuel costs"
        intro="Fuel is the most visible running cost of a car, and small changes in MPG or pump price add up over a year. This calculator turns your car's economy and the current price into a cost per mile, per journey and per year."
      >
        <GuideSection kicker="The maths" title="From MPG to cost per mile">
          <p>UK cars quote economy in miles per gallon, but fuel is sold in litres. To convert:</p>
          <pre className="bg-surface-container p-3 rounded-lg text-xs font-mono tabular-nums text-on-surface">
            Litres per mile = 4.546 ÷ MPG{'\n'}
            Cost per mile = Litres per mile × price per litre
          </pre>
          <p>So at 45 MPG and £1.40 a litre, each mile uses 4.546 ÷ 45 = 0.101 litres, costing about 14.1p.</p>
        </GuideSection>

        <GuideSection kicker="Real-world MPG" title="Why you rarely hit the official figure">
          <p>Manufacturers' MPG figures come from standardised lab tests (WLTP). Real driving — town stop-start, motorway speeds, air-con, roof boxes, cold starts and a heavy right foot — typically knocks 10–20% off. For an accurate cost, measure your own MPG: fill to the brim, note the mileage, fill again next time and divide miles by gallons used.</p>
        </GuideSection>

        <GuideSection kicker="Cutting the bill" title="Practical ways to spend less">
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep tyres correctly inflated — under-inflation wastes fuel.</li>
            <li>Remove roof bars and clutter to cut drag and weight.</li>
            <li>Ease off: steady speeds and gentle acceleration beat hard driving.</li>
            <li>Use a fuel-price app to find the cheapest local pumps; supermarket fuel is often cheaper.</li>
          </ul>
          <Callout tone="warn" title="Premium fuel rarely pays off">
            For most ordinary cars, premium petrol gives no measurable benefit. Stick to standard unleaded unless your handbook specifically requires higher octane.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A 9,000-mile year at 45 MPG">
          <p>Driving 9,000 miles a year at 45 MPG and £1.40 a litre costs about 14.1p a mile, or roughly £1,270 a year — about £106 a month — on fuel alone. Improving real-world economy to 50 MPG would save around £125 a year at the same price.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common fuel-cost mistakes">
          <Mistakes items={[
            ['Trusting the official MPG', 'Real-world economy is usually 10–20% worse than the brochure figure.'],
            ['Ignoring price per litre swings', 'A 10p/litre change moves a typical annual bill by around £90.'],
            ['Forgetting fuel is only part of the cost', 'Insurance, tax, servicing and depreciation often cost more than fuel.'],
            ['Confusing US and UK MPG', 'A UK gallon is 4.546 litres; US MPG figures are about 20% lower for the same car.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How do I work out fuel cost per mile?', a: 'Divide 4.546 by your MPG to get litres per mile, then multiply by the price per litre. At 45 MPG and £1.40/litre that is about 14p a mile.' },
            { q: 'Is a UK gallon the same as a US gallon?', a: 'No. A UK gallon is 4.546 litres; a US gallon is 3.785 litres, so UK MPG figures look higher than US ones for the same car.' },
            { q: 'Why is my MPG worse than advertised?', a: 'Official figures are lab-tested. Town driving, cold weather, loads and driving style all reduce real-world economy.' },
            { q: 'Does cruise control save fuel?', a: 'On flat motorways, yes — steady speeds are efficient. On hilly roads it can use more, so judge the terrain.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/fuel-cost-calculator" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
