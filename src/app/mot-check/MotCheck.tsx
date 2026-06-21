'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { inspectReg } from '../../lib/mot/reg';

const RELATED = [
  { href: '/ulez-check', label: 'ULEZ Checker', hint: 'Clean-air zone compliance' },
  { href: '/vehicle-tax-calculator', label: 'Vehicle Tax (VED)', hint: 'CO2 first-year + standard' },
  { href: '/car-running-costs', label: 'Car Running Costs', hint: 'Total cost of ownership' },
  { href: '/fuel-cost-calculator', label: 'Fuel Cost', hint: 'Cost per journey & year' },
];

export default function MotCheck() {
  const [reg, setReg] = useState('AB12 CDE');
  const info = useMemo(() => inspectReg(reg), [reg]);
  const clean = info.normalised.replace(/\s+/g, '');

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vehicles', href: '/category/vehicles' }, { label: 'MOT & Tax Check' }]}
      title="MOT & Tax Check by Reg Plate"
      subtitle="Validate any UK number plate, see its registration era, then jump straight to the official DVSA MOT history and DVLA tax-status services."
      calcLabel="Check Plate"
      inputs={
        <Panel title="Number Plate">
          <div className="space-y-4">
            <Field label="UK registration" hint="Modern format: two letters, two numbers, three letters (e.g. AB12 CDE)">
              <input
                type="text"
                value={reg}
                onChange={(e) => setReg(e.target.value)}
                placeholder="AB12 CDE"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-lg font-bold uppercase tracking-wider tabular-nums text-on-surface outline-none focus:border-primary"
              />
            </Field>
          </div>
        </Panel>
      }
      results={
        info.valid ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Plate" value={info.normalised} sub="Valid UK format" tone="dark" big />
              <Stat label="Registration Era" value={info.era === 'modern' ? 'Current style' : info.era === 'prefix' ? 'Prefix (1983 to 2001)' : info.era === 'suffix' ? 'Suffix (1963 to 1983)' : 'Unknown'} sub={info.ageHint ?? ''} tone="primary" />
            </div>

            <Panel title="Official gov.uk checks">
              <div className="space-y-3 text-sm w-full">
                <a href={`https://www.check-mot.service.gov.uk/?registration=${encodeURIComponent(clean)}`} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-outline-variant p-4 hover:border-primary transition-colors">
                  <span className="font-semibold text-on-surface">Check MOT history →</span>
                  <span className="block text-xs text-on-surface-variant mt-1">Official DVSA service. Expiry date, full pass/fail history and advisories for {info.normalised}.</span>
                </a>
                <a href="https://www.vehicleenquiry.service.gov.uk/" target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-outline-variant p-4 hover:border-primary transition-colors">
                  <span className="font-semibold text-on-surface">Check tax status (VED) →</span>
                  <span className="block text-xs text-on-surface-variant mt-1">Official DVLA enquiry. Tax expiry, SORN status, CO2 emissions and tax band.</span>
                </a>
              </div>
            </Panel>

            <Callout tone="info" title="We don't store your plate">
              The plate stays in your browser. Both gov.uk services are free, public and the authoritative source, paid HPI checks build on these same DVLA records.
            </Callout>
          </>
        ) : (
          <Callout tone="warn" title="Not a recognised UK plate">
            That doesn't match a UK plate format. Try the modern style: two letters, two numbers, three letters, for example AB12 CDE.
          </Callout>
        )
      }
    >
      <Guide
        title="How to check a vehicle's MOT and tax"
        intro="Before buying a used car, or just to stay road-legal, you can check any UK vehicle's MOT history and tax status free on gov.uk using only the registration plate. This tool validates the plate and links you straight to the official services."
      >
        <GuideSection kicker="MOT" title="When a car needs an MOT">
          <p>Cars in Great Britain need their first MOT on the third anniversary of registration, then every year after. The MOT checks safety and emissions; driving without a valid one is illegal and invalidates most insurance. The DVSA's free service shows the expiry date and the full history, including past failures and advisories.</p>
        </GuideSection>

        <GuideSection kicker="Tax" title="Vehicle tax and SORN">
          <p>Every vehicle used or kept on a public road must be taxed (VED). The DVLA enquiry service shows whether a vehicle is currently taxed, its tax band and CO2, and whether it's declared off-road under a SORN. Untaxed vehicles risk fines and clamping.</p>
          <Callout tone="warn" title="Tax doesn't transfer when you buy">
            When you buy a used car, the seller's tax is cancelled, you must tax it before driving away. There's no longer a paper tax disc, so check the status online.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Buying used" title="What the history tells you">
          <p>The MOT history is one of the best free tools for a used-car buyer. Recurring advisories (tyres, brakes, corrosion), a sudden mileage drop between tests, or a string of failures all flag a car that may cost you. Cross-check the recorded mileage at each MOT against the seller's claimed figure.</p>
        </GuideSection>

        <GuideSection kicker="Plate formats" title="Reading a UK number plate">
          <p>The current style (since 2001) is two letters, two numbers, three letters, the two numbers encode the registration period. Earlier prefix (1983 to 2001) and suffix (1963 to 1983) plates use a single age letter. The age of the plate is a quick sanity check against a seller's description.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common checking mistakes">
          <Mistakes items={[
            ['Assuming tax carries over on purchase', 'Vehicle tax is cancelled on sale, tax it yourself before driving.'],
            ['Ignoring repeated advisories', 'The same advisory year after year points to a deferred, growing problem.'],
            ['Not checking mileage consistency', 'MOT records reveal mileage at each test, a drop suggests a clock issue.'],
            ['Paying for data you can get free', 'MOT history and tax status are free on gov.uk; paid checks add little for basic facts.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How do I check a car\'s MOT history?', a: 'Enter the registration on the DVSA check-MOT service at gov.uk. It is free and shows expiry, history and advisories.' },
            { q: 'Can I check if a car is taxed?', a: 'Yes, free on the DVLA vehicle enquiry service. It shows tax status, band, CO2 and SORN status.' },
            { q: 'Do I need the V5C to check?', a: 'No. The registration plate alone is enough for the MOT and tax-status checks.' },
            { q: 'When is the first MOT due?', a: 'For most cars, three years after first registration, then annually.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
