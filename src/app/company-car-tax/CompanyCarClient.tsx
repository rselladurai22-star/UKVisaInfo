'use client';

import { useMemo, useState } from 'react';
import { calculateCompanyCarTax, type FuelType } from '../../lib/company-car/calc';
import {
  CalcCard, NumberField, SelectField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, ScenarioTabs, Tip, CheckboxField, fmtGBP,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function CompanyCarClient() {
  const [listPrice, setListPrice]   = useState('45000');
  const [co2, setCo2]               = useState('120');
  const [fuel, setFuel]             = useState<FuelType>('petrol');
  const [phevRange, setPhevRange]   = useState('40');
  const [rde2, setRde2]             = useState(true);
  const [taxBand, setTaxBand]       = useState<'basic' | 'higher' | 'additional'>('higher');
  const [capContrib, setCapContrib] = useState('0');

  const r = useMemo(() => calculateCompanyCarTax({
    listPrice: parseFloat(listPrice) || 0,
    co2: parseFloat(co2) || 0,
    fuel,
    phevRangeMiles: parseFloat(phevRange) || 0,
    rde2Compliant: rde2,
    employeeTaxBand: taxBand,
    capitalContribution: parseFloat(capContrib) || 0,
  }), [listPrice, co2, fuel, phevRange, rde2, taxBand, capContrib]);

  return (
    <CalcCard wide>
      <SummaryHero
        label="Your annual BiK cost · 2025/26"
        value={fmtGBP(r.employeeItCost)}
        sub={`${fmtGBP(r.monthlyEmployeeIt)}/month · BiK value ${fmtGBP(r.bikValue)} at ${r.appropriatePct}% appropriate percentage`}
        tone="navy"
        badge={fuel === 'electric' ? 'EV · 3%' : fuel === 'phev' ? 'PHEV' : ''}
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Vehicle" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="List price (P11D)" prefix="£" value={listPrice} onChange={setListPrice} hint="Manufacturer&rsquo;s list price + accessories + VAT" />
            <SelectField label="Fuel type" value={fuel} onChange={(v) => setFuel(v as FuelType)}
              options={[
                { value: 'petrol', label: 'Petrol' },
                { value: 'diesel', label: 'Diesel' },
                { value: 'phev', label: 'Plug-in hybrid (PHEV)' },
                { value: 'electric', label: 'Pure electric (BEV)' },
              ]}
            />
            {fuel !== 'electric' && (
              <NumberField label="CO₂ emissions" suffix="g/km" value={co2} onChange={setCo2} hint="From V5C / WLTP combined" />
            )}
            {fuel === 'phev' && (
              <NumberField label="Electric-only range" suffix="miles" value={phevRange} onChange={setPhevRange} hint="≥130mi = 5%, ≥70 = 8%, ≥40 = 12%, &lt;40 = 14%" />
            )}
            <NumberField label="Capital contribution" prefix="£" value={capContrib} onChange={setCapContrib} hint="Up to £5,000 reduces P11D value" />
            {fuel === 'diesel' && (
              <div className="sm:col-span-2">
                <CheckboxField label="RDE2 / Euro 6d compliant"
                  checked={rde2} onChange={setRde2}
                  hint="Non-compliant diesels add a 4% surcharge (capped at 37%)"
                />
              </div>
            )}
          </div>
        </Section>

        <Section title="Driver" eyebrow="Step 2" tone="inputs">
          <ScenarioTabs<'basic' | 'higher' | 'additional'>
            value={taxBand}
            onChange={setTaxBand}
            options={[
              { value: 'basic', label: 'Basic rate', sub: '20% — under £50,270' },
              { value: 'higher', label: 'Higher rate', sub: '40% — £50,270–£125,140' },
              { value: 'additional', label: 'Additional', sub: '45% — over £125,140' },
            ]}
          />
          <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
            <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#76777e]">Appropriate percentage applied</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold tabular-nums text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{r.appropriatePct}%</span>
              <span className="text-[12px] text-[#76777e]">of {fmtGBP(r.adjustedListPrice)} adjusted list price</span>
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Cost breakdown" eyebrow="Step 3" tone="results">
          <StatGrid cols={3}>
            <StatCard label="BiK taxable value" value={fmtGBP(r.bikValue)} sub={`${r.appropriatePct}% × ${fmtGBP(r.adjustedListPrice)}`} />
            <StatCard label="Employee income tax" value={fmtGBP(r.employeeItCost)} sub={`${fmtGBP(r.monthlyEmployeeIt)} per month`} tone="primary" />
            <StatCard label="Employer Class 1A NI" value={fmtGBP(r.employerNiCost)} sub="15% of BiK value · 2025/26" tone="muted" />
          </StatGrid>
          <div className="mt-4">
            <BreakdownTable
              highlightLast
              rows={[
                { label: 'List price (P11D)', value: fmtGBP(parseFloat(listPrice) || 0) },
                { label: 'Less capital contribution', value: `–${fmtGBP(Math.min(5000, parseFloat(capContrib) || 0))}`, negative: true },
                { label: 'Adjusted P11D value', value: fmtGBP(r.adjustedListPrice), bold: true },
                { label: `BiK at ${r.appropriatePct}%`, value: fmtGBP(r.bikValue), bold: true },
                { label: `Income tax (${taxBand === 'basic' ? '20%' : taxBand === 'higher' ? '40%' : '45%'})`, value: fmtGBP(r.employeeItCost), negative: true },
                { label: 'Total annual cost to driver', value: fmtGBP(r.employeeItCost), bold: true },
              ]}
            />
          </div>
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        {fuel === 'electric' && (
          <Tip tone="success">
            <strong>Pure EVs are taxed at just 3%</strong> in 2025/26 (rising to 4% in 26/27, 5% in 27/28, 7% in 28/29). A £45k EV costs a higher-rate driver only ~£540/year in BiK.
          </Tip>
        )}
        {fuel === 'phev' && parseFloat(phevRange) < 40 && (
          <Tip tone="warn">
            With under 40 electric miles, your PHEV is taxed at 14% — a typical petrol equivalent. Switching to a long-range PHEV (≥130 mi) drops the rate to 5%.
          </Tip>
        )}
        {fuel === 'diesel' && !rde2 && (
          <Tip tone="warn">
            Non-RDE2 diesels carry a <strong>4% surcharge</strong>. Confirm compliance on the V5C — most cars registered after Jan 2021 are RDE2.
          </Tip>
        )}
        <Tip tone="info">
          The employer&rsquo;s Class 1A NI ({fmtGBP(r.employerNiCost)}) is paid by the company, not the driver — useful when comparing total cost vs a cash allowance.
        </Tip>
      </div>
    </CalcCard>
  );
}
