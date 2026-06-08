'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const STANDARD_RATE = 195;          // 2025/26 standard annual VED
const EXPENSIVE_SUPPLEMENT = 425;   // years 2–6 for list price > £40,000
const EXPENSIVE_THRESHOLD = 40000;

type Fuel = 'petrol' | 'diesel' | 'electric';

// First-year VED by CO2 g/km (cars registered from April 2025, petrol/RDE2 diesel)
const FIRST_YEAR: [number, number][] = [
  [50, 110], [75, 130], [90, 270], [100, 350], [110, 390], [130, 440],
  [150, 540], [170, 1360], [190, 2190], [225, 3300], [255, 4680], [Infinity, 5490],
];

function firstYearRate(co2: number, fuel: Fuel): number {
  if (fuel === 'electric') return 10;
  if (co2 <= 0) return 10;
  for (const [ceil, rate] of FIRST_YEAR) {
    if (co2 <= ceil) return fuel === 'diesel' ? bumpDiesel(co2, rate) : rate;
  }
  return 5490;
}

// Diesels not meeting RDE2 move up one band; we approximate by keeping the band (most new diesels are RDE2-compliant)
function bumpDiesel(_co2: number, rate: number): number {
  return rate;
}

const RELATED = [
  { href: '/car-running-costs', label: 'Car Running Costs', hint: 'Total cost of ownership' },
  { href: '/fuel-cost-calculator', label: 'Fuel Cost', hint: 'Cost per journey & year' },
  { href: '/ulez-check', label: 'ULEZ / CAZ', hint: 'Clean-air zone compliance' },
  { href: '/car-finance-calculator', label: 'Car Finance', hint: 'PCP vs HP vs loan' },
];

export default function VehicleTax() {
  const [fuel, setFuel] = useState<Fuel>('petrol');
  const [co2, setCo2] = useState(120);
  const [listPrice, setListPrice] = useState(28000);
  const [isNew, setIsNew] = useState(true);

  const r = useMemo(() => {
    const firstYear = firstYearRate(co2, fuel);
    const expensive = listPrice > EXPENSIVE_THRESHOLD;
    const standard = STANDARD_RATE + (expensive ? EXPENSIVE_SUPPLEMENT : 0);
    // 6-year cost: year 1 (first-year rate, + supplement if expensive) then 5 standard years
    const yearOne = isNew ? firstYear + (expensive ? EXPENSIVE_SUPPLEMENT : 0) : standard;
    const sixYear = isNew ? yearOne + standard * 5 : standard * 6;
    return { firstYear, standard, expensive, yearOne, sixYear };
  }, [co2, fuel, listPrice, isNew]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vehicles', href: '/category/vehicles' }, { label: 'Vehicle Tax' }]}
      title="Vehicle Tax (VED) Calculator"
      subtitle="Estimate your UK road tax for 2025/26 — first-year rates by CO2, the £195 standard rate, and the £425 expensive-car supplement for cars over £40,000."
      calcLabel="Calculate Road Tax"
      inputs={
        <Panel title="Your Vehicle">
          <div className="space-y-4">
            <Field label="Fuel type">
              <Choice<Fuel>
                name="fuel"
                value={fuel}
                onChange={setFuel}
                options={[
                  { value: 'petrol', label: 'Petrol', desc: 'Standard petrol car' },
                  { value: 'diesel', label: 'Diesel', desc: 'RDE2-compliant diesel' },
                  { value: 'electric', label: 'Electric', desc: 'Now pays VED from April 2025' },
                ]}
              />
            </Field>
            {fuel !== 'electric' && (
              <Field label="CO2 emissions (g/km)" hint="On the V5C log book or manufacturer spec">
                <NumberInput value={co2} onChange={setCo2} min={0} step={5} suffix=" g/km" />
              </Field>
            )}
            <Field label="List price when new" hint="Cars over £40,000 pay the expensive-car supplement">
              <MoneyInput value={listPrice} onChange={setListPrice} step={1000} />
            </Field>
            <Toggle checked={isNew} onChange={setIsNew} label="Brand-new car (first-year rate applies)" />
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label={isNew ? 'First-Year Tax' : 'Annual Tax'} value={gbp(r.yearOne)} sub={isNew ? 'Year 1 (showroom tax)' : 'Standard rate'} tone="dark" big />
            <Stat label="Standard Rate" value={gbp(r.standard)} sub={r.expensive ? 'Incl. £425 supplement' : 'From year 2 onwards'} tone="primary" />
            <Stat label="6-Year Cost" value={gbp(r.sixYear)} sub="Typical ownership period" tone="accent" />
            <Stat label="Expensive Car?" value={r.expensive ? 'Yes' : 'No'} sub={r.expensive ? '£425/yr, years 2–6' : 'Under £40,000'} />
          </div>

          {r.expensive && (
            <Callout tone="warn" title="Expensive-car supplement applies">
              Because the list price is over £40,000, you pay an extra <strong>£{EXPENSIVE_SUPPLEMENT}</strong> a year on top of the standard rate for five years (years 2–6). This now applies to electric cars too.
            </Callout>
          )}
          {fuel === 'electric' && (
            <Callout tone="info" title="EVs now pay road tax">
              Since 1 April 2025, zero-emission cars pay a £10 first-year rate and the £195 standard rate, ending their VED exemption.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for cars registered from April 2025, 2025/26 rates. Cars registered 2001–2017 use CO2 bands; pre-2001 use engine size. Always confirm on gov.uk.</p>
        </>
      }
    >
      <Guide
        title="UK vehicle tax (VED) explained for 2025/26"
        intro="Vehicle Excise Duty — road tax — is what you pay to keep a car on the road. For newer cars it has two parts: a one-off first-year rate based on CO2 emissions, then a flat standard rate. Pricey cars pay an extra supplement. Here's how it all fits together."
      >
        <GuideSection kicker="First year" title="The showroom tax">
          <p>In the first year, road tax is based on the car's CO2 emissions and can range from £10 for the cleanest cars to over £5,000 for the highest emitters. This "showroom tax" is usually bundled into the on-the-road price by the dealer.</p>
        </GuideSection>

        <GuideSection kicker="Standard rate" title="From year two onwards">
          <p>After the first year, almost all cars move to a flat <strong>standard rate of £195</strong> a year (2025/26), regardless of emissions. The only ongoing variation is the expensive-car supplement.</p>
        </GuideSection>

        <GuideSection kicker="Expensive cars" title="The £40,000 supplement">
          <p>If a car's list price was over <strong>£40,000</strong> when new, you pay an extra <strong>£425</strong> a year on top of the standard rate for five years — from year two to year six. After that it drops back to the standard rate. This is based on the original list price, not what you paid, so it can catch buyers of nearly-new cars.</p>
          <Callout tone="warn" title="EVs lost their exemption">
            From April 2025 electric cars pay VED for the first time, including the expensive-car supplement if they cost over £40,000 — which many do.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A £28,000 petrol car at 120 g/km">
          <p>A new petrol car emitting 120 g/km pays a first-year rate of around £440, then £195 a year from year two. As it's under £40,000 there's no supplement. Over six years that's roughly £440 + (£195 × 5) = £1,415 in road tax.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common road tax mistakes">
          <Mistakes items={[
            ['Forgetting EVs now pay VED', 'The electric-car exemption ended in April 2025; budget for £195 a year.'],
            ['Ignoring the £40,000 supplement', 'It is based on the original list price and adds £425 a year for five years.'],
            ['Letting tax lapse', 'You must tax a car even when SORN ends; driving untaxed risks fines and clamping.'],
            ['Assuming low emissions mean cheap standard rate', 'After year one, nearly all cars pay the same £195 standard rate.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much is road tax in 2025/26?', a: 'The standard rate is £195 a year. The first-year rate varies by CO2 from £10 to over £5,000, and cars over £40,000 pay a £425 supplement in years 2–6.' },
            { q: 'Do electric cars pay road tax now?', a: 'Yes. From 1 April 2025 EVs pay a £10 first-year rate and the £195 standard rate, plus the expensive-car supplement if over £40,000.' },
            { q: 'Can I pay monthly?', a: 'Yes, by Direct Debit, though paying monthly or every six months costs slightly more than paying annually.' },
            { q: 'What about older cars?', a: 'Cars registered between 2001 and 2017 are taxed purely on CO2 bands, and pre-2001 cars on engine size — different systems from the newer two-part scheme.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
