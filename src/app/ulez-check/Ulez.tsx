'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, NumberInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { checkCleanAir, type FuelType, type VehicleClass } from '../../lib/clean-air/calc';

const RELATED = [
  { href: '/vehicle-tax-calculator', label: 'Vehicle Tax (VED)', hint: 'CO2 first-year + standard' },
  { href: '/car-running-costs', label: 'Car Running Costs', hint: 'Total cost of ownership' },
  { href: '/fuel-cost-calculator', label: 'Fuel Cost', hint: 'Cost per journey & year' },
  { href: '/ev-charging-cost', label: 'EV Charging Cost', hint: 'Home vs public' },
];

export default function Ulez() {
  const thisYear = new Date().getFullYear();
  const [fuel, setFuel] = useState<FuelType>('petrol');
  const [vehicle, setVehicle] = useState<VehicleClass>('car');
  const [year, setYear] = useState(2010);

  const r = useMemo(
    () => checkCleanAir({ fuel, vehicle, firstRegYear: year || thisYear }),
    [fuel, vehicle, year, thisYear],
  );

  const chargedZones = r.zones.filter((z) => z.charge > 0);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vehicles', href: '/category/vehicles' }, { label: 'ULEZ Checker' }]}
      title="ULEZ & Clean Air Zone Checker"
      subtitle="Check whether your car, van or motorcycle is compliant with London's ULEZ, England's Clean Air Zones and Scotland's Low Emission Zones — or faces a daily charge."
      calcLabel="Check Compliance"
      inputs={
        <Panel title="Your Vehicle">
          <div className="space-y-4">
            <Field label="Fuel type">
              <Choice<FuelType>
                name="fuel"
                value={fuel}
                onChange={setFuel}
                options={[
                  { value: 'petrol', label: 'Petrol', desc: 'Euro 4+ (≈2006) usually compliant' },
                  { value: 'diesel', label: 'Diesel', desc: 'Euro 6 (≈2015) usually compliant' },
                  { value: 'hybrid', label: 'Hybrid', desc: 'Judged on its petrol/diesel engine' },
                  { value: 'electric', label: 'Electric', desc: 'Always compliant' },
                  { value: 'lpg', label: 'LPG / Bi-fuel', desc: 'Judged like petrol' },
                ]}
              />
            </Field>
            <Field label="Vehicle type">
              <Choice<VehicleClass>
                name="vehicle"
                value={vehicle}
                onChange={setVehicle}
                options={[
                  { value: 'car', label: 'Car', desc: 'Exempt from most CAZ class B/C zones' },
                  { value: 'van', label: 'Van (≤3.5t)', desc: 'Charged in more zones' },
                  { value: 'motorcycle', label: 'Motorcycle', desc: 'Euro 3+ usually compliant' },
                ]}
              />
            </Field>
            <Field label="Year of first registration" hint={`Used to infer the Euro emissions standard (Euro ${r.inferredEuro})`}>
              <NumberInput value={year} onChange={setYear} min={1980} step={1} />
            </Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="London ULEZ" value={r.baselineCompliant ? '✓ Compliant' : 'Charged'} sub={r.baselineCompliant ? 'No daily charge' : '£12.50/day'} tone={r.baselineCompliant ? 'primary' : 'accent'} big />
            <Stat label="Inferred Standard" value={`Euro ${r.inferredEuro}`} sub={`First registered ${year}`} tone="dark" />
          </div>

          <Panel title="Zone-by-zone verdict">
            <div className="space-y-2 text-sm w-full">
              {r.zones.map((z) => (
                <div key={z.zone} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className={`font-medium ${z.compliant ? 'text-on-surface' : 'text-secondary'}`}>{z.compliant ? '✓' : '✗'} {z.zone}</span>
                    {z.note && <span className="block text-[11px] text-on-surface-variant">{z.note}</span>}
                  </div>
                  <span className="font-semibold tabular-nums shrink-0">{z.charge > 0 ? `£${z.charge.toFixed(2)}/day` : 'No charge'}</span>
                </div>
              ))}
            </div>
          </Panel>

          {chargedZones.length > 0 ? (
            <Callout tone="warn" title="Your vehicle faces charges">
              On these details you'd be charged in {chargedZones.length} zone{chargedZones.length === 1 ? '' : 's'}. Always confirm against TfL's official checker, which queries DVLA by your exact registration plate.
            </Callout>
          ) : (
            <Callout tone="tip" title="Looks compliant everywhere">
              Based on year and fuel, your vehicle appears compliant across these zones — but verify with the official TfL/DEFRA checker before driving in.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">This check infers the Euro standard from the registration year. The official TfL and DEFRA tools query DVLA by plate for an exact answer — always confirm there.</p>
        </>
      }
    >
      <Guide
        title="ULEZ and Clean Air Zones explained"
        intro="Many UK cities now charge older, more-polluting vehicles to drive in certain areas. London's Ultra Low Emission Zone (ULEZ) is the largest, but England has several Clean Air Zones and Scotland has Low Emission Zones. Whether you pay depends on your engine's Euro emissions standard."
      >
        <GuideSection kicker="The standards" title="It's all about Euro standards">
          <p>Compliance is based on the Euro emissions standard your vehicle meets, which broadly tracks its age:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Petrol:</strong> Euro 4 or newer (roughly 2006 onwards) is compliant.</li>
            <li><strong>Diesel:</strong> Euro 6 or newer (roughly September 2015 onwards) is compliant.</li>
            <li><strong>Electric &amp; hydrogen:</strong> always compliant.</li>
            <li><strong>Motorcycles:</strong> Euro 3 or newer.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="London" title="The ULEZ charge">
          <p>London's ULEZ covers all London boroughs. Non-compliant cars, vans and motorcycles pay <strong>£12.50 a day</strong>, every day, to drive within it. The charge runs alongside the separate Congestion Charge in central London, so older cars can pay both.</p>
        </GuideSection>

        <GuideSection kicker="Elsewhere" title="Clean Air Zones and LEZs">
          <p>Outside London, several English cities run Clean Air Zones (CAZ). Crucially, many — Sheffield, Tyneside, Bath, Bradford, Portsmouth — are "class B/C" zones that <strong>don't charge private cars</strong>, only vans, taxis, buses and lorries. Birmingham and Bristol do charge non-compliant cars. Scotland's four Low Emission Zones (Glasgow, Edinburgh, Dundee, Aberdeen) ban non-compliant vehicles outright rather than charging.</p>
          <Callout tone="warn" title="Always check by reg plate">
            Year of registration is a guide, not proof. The official TfL and council tools look up your exact vehicle on the DVLA database — check there before you drive in to avoid a penalty.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A 2010 petrol car">
          <p>A petrol car first registered in 2010 meets Euro 5, which is comfortably above the Euro 4 ULEZ threshold — so it's compliant in London ULEZ and the charging CAZs, with no daily fee. A 2010 diesel, by contrast, would likely be Euro 5 and fall short of the Euro 6 diesel requirement, facing the £12.50 charge.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common Clean Air Zone mistakes">
          <Mistakes items={[
            ['Assuming all CAZs charge cars', 'Several English zones only charge vans, taxis and lorries — not private cars.'],
            ['Confusing ULEZ with the Congestion Charge', 'They are separate London charges; an older car in central London can pay both.'],
            ['Guessing from the car\'s age', 'Diesels in particular need to be Euro 6 (≈2015+); always verify by reg plate.'],
            ['Forgetting it runs every day', 'The £12.50 ULEZ charge applies daily, including weekends, with limited exemptions.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How do I know if my car is ULEZ-compliant?', a: 'Check the Euro standard — petrol Euro 4 (≈2006+) and diesel Euro 6 (≈2015+) are compliant. Confirm exactly with TfL\'s checker using your reg plate.' },
            { q: 'How much is the ULEZ charge?', a: 'Non-compliant cars, vans and motorcycles pay £12.50 a day to drive within the London ULEZ.' },
            { q: 'Do all Clean Air Zones charge cars?', a: 'No. Many English CAZs only charge vans, taxis, buses and lorries. Birmingham and Bristol are the main ones charging private cars.' },
            { q: 'What about Scotland?', a: 'Scottish Low Emission Zones ban non-compliant vehicles rather than charging them, with penalties for driving in.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
