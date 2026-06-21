'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Donut, Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const LITRES_PER_GALLON = 4.54609;
const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const RELATED = [
  { href: '/fuel-cost-calculator', label: 'Fuel Cost', hint: 'Cost per journey & year' },
  { href: '/vehicle-tax-calculator', label: 'Vehicle Tax', hint: 'VED by CO2 & list price' },
  { href: '/car-finance-calculator', label: 'Car Finance', hint: 'PCP vs HP vs loan' },
  { href: '/ev-charging-cost', label: 'EV Charging Cost', hint: 'Home vs public' },
];

export default function CarRunningCosts() {
  const [annualMiles, setAnnualMiles] = useState(9000);
  const [mpg, setMpg] = useState(45);
  const [pricePerLitre, setPricePerLitre] = useState(140);
  const [insurance, setInsurance] = useState(700);
  const [ved, setVed] = useState(195);
  const [servicing, setServicing] = useState(500);
  const [purchasePrice, setPurchasePrice] = useState(20000);
  const [depreciationPct, setDepreciationPct] = useState(12);

  const r = useMemo(() => {
    const fuel = (LITRES_PER_GALLON / Math.max(1, mpg)) * (pricePerLitre / 100) * annualMiles;
    const depreciation = purchasePrice * (depreciationPct / 100);
    const total = fuel + insurance + ved + servicing + depreciation;
    const perMile = annualMiles > 0 ? total / annualMiles : 0;
    return { fuel, depreciation, total, perMile, monthly: total / 12 };
  }, [annualMiles, mpg, pricePerLitre, insurance, ved, servicing, purchasePrice, depreciationPct]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vehicles', href: '/category/vehicles' }, { label: 'Car Running Costs' }]}
      title="Car Running Costs Calculator"
      subtitle="Add up the true yearly cost of running a car, fuel, insurance, road tax, servicing and depreciation, and see the cost per mile."
      calcLabel="Calculate Running Costs"
      inputs={
        <div className="space-y-4">
          <Panel title="Usage & Fuel">
            <div className="space-y-4">
              <Field label="Annual mileage"><NumberInput value={annualMiles} onChange={setAnnualMiles} min={0} step={500} suffix=" mi" /></Field>
              <Field label="Fuel economy (MPG)"><NumberInput value={mpg} onChange={setMpg} min={1} step={1} suffix=" mpg" /></Field>
              <Field label="Fuel price (pence/litre)"><NumberInput value={pricePerLitre} onChange={setPricePerLitre} min={0} step={1} suffix="p" /></Field>
            </div>
          </Panel>
          <Panel title="Fixed & Standing Costs">
            <div className="space-y-4">
              <Field label="Insurance per year"><MoneyInput value={insurance} onChange={setInsurance} step={50} /></Field>
              <Field label="Road tax (VED) per year"><MoneyInput value={ved} onChange={setVed} step={5} /></Field>
              <Field label="Servicing & maintenance per year"><MoneyInput value={servicing} onChange={setServicing} step={50} /></Field>
            </div>
          </Panel>
          <Panel title="Depreciation">
            <div className="space-y-4">
              <Field label="Car value"><MoneyInput value={purchasePrice} onChange={setPurchasePrice} step={1000} /></Field>
              <Field label="Annual depreciation rate" hint="Typically 10 to 20% of value a year"><NumberInput value={depreciationPct} onChange={setDepreciationPct} min={0} step={1} suffix="%" /></Field>
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total Per Year" value={gbp(r.total)} sub="All running costs" tone="dark" big />
            <Stat label="Per Month" value={gbp(r.monthly)} sub="Average" tone="primary" />
            <Stat label="Cost Per Mile" value={gbp(r.perMile, 2)} sub="Including depreciation" tone="accent" />
            <Stat label="Fuel Share" value={gbp(r.fuel)} sub="Of the annual total" />
          </div>

          <Panel title="Where the money goes">
            <Donut
              centerLabel="Per year"
              centerValue={gbp(r.total)}
              segments={[
                { value: r.depreciation, color: ACCENT, label: 'Depreciation' },
                { value: r.fuel, color: PRIMARY, label: 'Fuel' },
                { value: insurance, color: '#0a8f5b', label: 'Insurance' },
                { value: servicing, color: '#d98500', label: 'Servicing' },
                { value: ved, color: '#7a4fd0', label: 'Road tax' },
              ]}
            />
          </Panel>

          <Callout tone="tip" title="Depreciation is the hidden giant">
            Most drivers focus on fuel, but depreciation is usually the biggest cost of owning a newer car, the value it quietly loses each year whether you drive it or not.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate only. Excludes finance interest, parking, tolls, breakdown cover and clean-air-zone charges. Depreciation is an estimate based on your chosen rate.</p>
        </>
      }
    >
      <Guide
        title="The true cost of running a car"
        intro="Fuel is the cost drivers notice, but it's rarely the biggest. Once you add insurance, tax, servicing and, above all, depreciation, the real cost of motoring is often double what people assume. This calculator pulls it all together into a yearly figure and a cost per mile."
      >
        <GuideSection kicker="The big five" title="What makes up running costs">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Fuel:</strong> driven by mileage, MPG and pump price.</li>
            <li><strong>Insurance:</strong> a fixed annual cost regardless of mileage.</li>
            <li><strong>Road tax (VED):</strong> usually the £195 standard rate.</li>
            <li><strong>Servicing & maintenance:</strong> routine service, MOT, tyres, repairs.</li>
            <li><strong>Depreciation:</strong> the value the car loses each year, the largest cost for newer cars.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Depreciation" title="The cost you can't see on a payslip">
          <p>A new car can lose 15 to 35% of its value in the first year and around 50 to 60% over three years. On a £20,000 car, that's thousands of pounds a year, more than fuel for most drivers. Buying a two-to-three-year-old car lets someone else absorb the steepest depreciation, which is why nearly-new cars are often the best value.</p>
        </GuideSection>

        <GuideSection kicker="Fixed vs variable" title="Why low mileage doesn't mean cheap">
          <p>Insurance, tax and depreciation are largely fixed, you pay them whether you drive 2,000 or 20,000 miles. Only fuel and some maintenance scale with mileage. That's why a barely-used second car can still cost over £2,000 a year to keep, and why car clubs or rental can be cheaper for occasional drivers.</p>
          <Callout tone="warn" title="Don't forget the extras">
            Parking permits, tolls, congestion and clean-air-zone charges, breakdown cover and finance interest all sit on top of the figures here. In cities they can add hundreds of pounds a year.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A £20,000 car, 9,000 miles a year">
          <p>At 45 MPG and £1.40 a litre, 9,000 miles costs about £1,270 in fuel. Add £700 insurance, £195 tax and £500 servicing, plus 12% depreciation on £20,000 (£2,400), and the total is roughly £5,065 a year, about £422 a month, or 56p a mile. Depreciation alone is nearly half the cost.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common running-cost mistakes">
          <Mistakes items={[
            ['Only counting fuel', 'Depreciation and insurance usually cost more than fuel combined.'],
            ['Buying brand new for low mileage', 'If you barely drive, depreciation makes a new car very expensive per mile.'],
            ['Ignoring insurance group', 'Insurance varies hugely by model and can outweigh fuel savings from a smaller engine.'],
            ['Forgetting city charges', 'Congestion, ULEZ and parking can quietly add hundreds a year.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is the average cost of running a car in the UK?', a: 'It varies widely, but including depreciation many drivers spend £3,000 to £6,000 a year on a typical car doing average mileage.' },
            { q: 'Is depreciation a real cost?', a: 'Yes. It is money you lose when you eventually sell or trade in the car, and for newer cars it is usually the single biggest cost.' },
            { q: 'How can I cut running costs?', a: 'Buy a slightly used car to avoid first-year depreciation, shop around for insurance, drive efficiently, and keep up with servicing to avoid big repairs.' },
            { q: 'Are electric cars cheaper to run?', a: 'Often yes on fuel and servicing, but check insurance, depreciation and, since April 2025, road tax before assuming overall savings.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
