'use client';

import { useMemo, useState } from 'react';
import { calculateRentalYield } from '../../lib/rental-yield/calc';
import {
  CalcCard, NumberField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, ScenarioTabs, Tip, fmtGBP,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function RentalYieldClient() {
  const [price, setPrice]       = useState('250000');
  const [rent, setRent]         = useState('1400');
  const [agent, setAgent]       = useState('10');
  const [insurance, setIns]     = useState('300');
  const [maintenance, setMtn]   = useState('1500');
  const [voids, setVoids]       = useState('840');
  const [mortgage, setMortgage] = useState('187500');
  const [rate, setRate]         = useState('5.5');
  const [band, setBand]         = useState<'basic' | 'higher'>('higher');

  const r = useMemo(() => calculateRentalYield({
    purchasePrice: parseFloat(price) || 0,
    monthlyRent: parseFloat(rent) || 0,
    agentFeePct: parseFloat(agent) || 0,
    annualInsurance: parseFloat(insurance) || 0,
    annualMaintenance: parseFloat(maintenance) || 0,
    annualVoids: parseFloat(voids) || 0,
    mortgageAmount: parseFloat(mortgage) || 0,
    mortgageRatePct: parseFloat(rate) || 0,
    higherRateTaxpayer: band === 'higher',
  }), [price, rent, agent, insurance, maintenance, voids, mortgage, rate, band]);

  return (
    <CalcCard wide>
      <SummaryHero
        label="Net rental yield"
        value={`${r.netYield.toFixed(2)}%`}
        sub={`Gross yield ${r.grossYield.toFixed(2)}% · Net cashflow ${fmtGBP(r.netAnnualIncome - r.annualInterest)}/yr after mortgage interest`}
        tone={r.netYield >= 5 ? 'teal' : r.netYield >= 3 ? 'navy' : 'red'}
        badge={r.icrPasses ? 'ICR passes' : 'ICR fails'}
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Property &amp; rent" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Purchase price" prefix="£" value={price} onChange={setPrice} hint="Include SDLT in your cash-on-cash calc separately" />
            <NumberField label="Expected monthly rent" prefix="£" value={rent} onChange={setRent} hint="Use comparable lettings on Rightmove / Zoopla" />
          </div>
        </Section>

        <Section title="Tax position" eyebrow="Step 2" tone="inputs">
          <ScenarioTabs<'basic' | 'higher'>
            value={band}
            onChange={setBand}
            options={[
              { value: 'basic', label: 'Basic rate landlord', sub: 'Lender stress at 125% ICR' },
              { value: 'higher', label: 'Higher rate landlord', sub: 'Lender stress at 145% ICR' },
            ]}
          />
        </Section>
      </div>

      <div className="mt-5 grid lg:grid-cols-2 gap-5">
        <Section title="Annual running costs" eyebrow="Step 3" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Letting agent fee" suffix="% of rent" value={agent} onChange={setAgent} hint="Typical 8–12% management or 1 month finder fee" />
            <NumberField label="Insurance (annual)" prefix="£" value={insurance} onChange={setIns} hint="Landlord buildings + contents" />
            <NumberField label="Maintenance &amp; repairs" prefix="£" value={maintenance} onChange={setMtn} hint="Budget ~10% of annual rent" />
            <NumberField label="Voids &amp; bad debt" prefix="£" value={voids} onChange={setVoids} hint="Typical 5–6% of annual rent (3 weeks vacant)" />
          </div>
        </Section>

        <Section title="Buy-to-let mortgage" eyebrow="Step 4" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Mortgage amount" prefix="£" value={mortgage} onChange={setMortgage} hint="Typical BTL LTV 75%" />
            <NumberField label="Mortgage pay rate" suffix="%" value={rate} onChange={setRate} hint="Lender stress-tests at rate + 2%, min 5.5%" />
          </div>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Yield breakdown &amp; affordability" eyebrow="Results" tone="results">
          <StatGrid cols={4}>
            <StatCard label="Gross yield" value={`${r.grossYield.toFixed(2)}%`} sub={`${fmtGBP(r.annualRent)} / ${fmtGBP(parseFloat(price) || 0)}`} />
            <StatCard label="Net yield" value={`${r.netYield.toFixed(2)}%`} tone="primary" sub="After running costs" />
            <StatCard label="Mortgage interest" value={fmtGBP(r.annualInterest)} sub={`${rate}% pay rate`} tone="muted" />
            <StatCard label="Annual cashflow" value={fmtGBP(r.netAnnualIncome - r.annualInterest)} tone={r.netAnnualIncome - r.annualInterest > 0 ? 'positive' : 'negative'} sub="Pre-tax (S24 may erode)" />
          </StatGrid>
          <div className="mt-4">
            <BreakdownTable
              highlightLast
              rows={[
                { label: 'Annual rent', value: fmtGBP(r.annualRent), bold: true },
                { label: 'Letting agent', value: `–${fmtGBP(r.annualRent * (parseFloat(agent) || 0) / 100)}`, negative: true, sub: `${agent}%` },
                { label: 'Insurance', value: `–${fmtGBP(parseFloat(insurance) || 0)}`, negative: true },
                { label: 'Maintenance', value: `–${fmtGBP(parseFloat(maintenance) || 0)}`, negative: true },
                { label: 'Voids / bad debt', value: `–${fmtGBP(parseFloat(voids) || 0)}`, negative: true },
                { label: 'Net rental income', value: fmtGBP(r.netAnnualIncome), bold: true },
                { label: 'Less mortgage interest', value: `–${fmtGBP(r.annualInterest)}`, negative: true },
                { label: 'Pre-tax cashflow', value: fmtGBP(r.netAnnualIncome - r.annualInterest), bold: true },
              ]}
            />
          </div>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Lender BTL stress test (ICR)" accent="#C9A14A">
          <StatGrid cols={3}>
            <StatCard label="Required ICR" value={`${(r.requiredICR * 100).toFixed(0)}%`} sub={band === 'higher' ? '145% · higher-rate landlord' : '125% · basic-rate landlord'} />
            <StatCard label="Your stressed ICR" value={isFinite(r.actualICR) ? `${(r.actualICR * 100).toFixed(0)}%` : '∞'} tone={r.icrPasses ? 'positive' : 'negative'} sub={`At stressed rate ${Math.max(5.5, (parseFloat(rate) || 0) + 2).toFixed(1)}%`} />
            <StatCard label="Max borrowable" value={fmtGBP(r.maxBorrowable)} tone="primary" sub="At this rent & ICR" />
          </StatGrid>
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        {!r.icrPasses && (
          <Tip tone="warn">
            Your stressed ICR ({(r.actualICR * 100).toFixed(0)}%) is below the lender requirement of {(r.requiredICR * 100).toFixed(0)}%. Either increase deposit, reduce loan, or push rent — most BTL lenders won&rsquo;t advance the full amount otherwise.
          </Tip>
        )}
        {r.netYield < 4 && (
          <Tip tone="warn">
            A net yield below 4% leaves little buffer for rate rises or void periods. The average UK BTL yield is around 5.5–6.5% — consider higher-yield areas (e.g. NE, NW, Wales).
          </Tip>
        )}
        <Tip tone="info">
          Lenders stress-test BTL mortgages at <strong>pay rate + 2% (min 5.5%)</strong> per the PRA Supervisory Statement SS13/16. The required ICR depends on the landlord&rsquo;s personal tax band.
        </Tip>
      </div>
    </CalcCard>
  );
}
