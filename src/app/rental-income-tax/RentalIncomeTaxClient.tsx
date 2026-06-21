'use client';

import { useMemo, useState } from 'react';
import { calculateRentalIncomeTax } from '../../lib/rental-income-tax/calc';
import {
  CalcCard, NumberField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, ScenarioTabs, Tip, CheckboxField, fmtGBP, fmtPct,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function RentalIncomeTaxClient() {
  const [rent, setRent]         = useState('18000');
  const [mortgage, setMortgage] = useState('7200');
  const [expenses, setExpenses] = useState('2500');
  const [other, setOther]       = useState('55000');
  const [useAllowance, setUseAllowance] = useState(false);
  const [scenario, setScenario] = useState<'basic' | 'higher' | 'add'>('higher');

  // Map scenario to baseline other income for quick comparison
  const otherIncomeForScenario = scenario === 'basic' ? 35000 : scenario === 'higher' ? 55000 : 130000;
  const effectiveOther = parseFloat(other) || otherIncomeForScenario;

  const r = useMemo(() => calculateRentalIncomeTax({
    annualRent: parseFloat(rent) || 0,
    mortgageInterest: parseFloat(mortgage) || 0,
    allowableExpenses: parseFloat(expenses) || 0,
    usePropertyAllowance: useAllowance,
    otherIncome: effectiveOther,
  }), [rent, mortgage, expenses, useAllowance, effectiveOther]);

  return (
    <CalcCard wide>
      <SummaryHero
        label="Net rental income after tax · 2025/26"
        value={fmtGBP(r.netRentalIncome)}
        sub={`On ${fmtGBP(r.grossRent)} gross rent · final tax ${fmtGBP(r.finalTaxOnRental)} (${fmtPct(r.effectiveRate)} effective)`}
        tone="navy"
        badge={`Marginal rate ${(r.marginalTaxRate * 100).toFixed(0)}%`}
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Property income" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Gross annual rent" prefix="£" value={rent} onChange={setRent} hint="Total rent received per year" />
            <NumberField label="Mortgage interest paid" prefix="£" value={mortgage} onChange={setMortgage} hint="Interest portion only, capital repayment not allowable" />
            <NumberField label="Allowable expenses" prefix="£" value={expenses} onChange={setExpenses} hint="Letting agent, insurance, repairs, ground rent (not mortgage capital)" />
            <NumberField label="Other taxable income" prefix="£" value={other} onChange={setOther} hint="Employment + other for tax-band positioning" />
            <div className="sm:col-span-2">
              <CheckboxField label="Use £1,000 Property Allowance instead of actual expenses"
                checked={useAllowance} onChange={setUseAllowance}
                hint="Better than expenses only if your actual costs are below £1,000, replaces them entirely" />
            </div>
          </div>
        </Section>

        <Section title="Section 24 impact" eyebrow="Step 2" accent="#C9A14A" tone="results">
          <StatGrid cols={2}>
            <StatCard label="Tax under current rules" value={fmtGBP(r.finalTaxOnRental)} tone="negative" sub="Interest NOT deductible, 20% credit instead" />
            <StatCard label="Tax under pre-2017 rules" value={fmtGBP(r.finalTaxOnRental - r.section24Impact)} tone="muted" sub="Interest fully deductible" />
            <StatCard label="Extra tax from Section 24" value={fmtGBP(Math.max(0, r.section24Impact))} tone={r.section24Impact > 0 ? 'negative' : 'positive'} sub="Cost of finance-cost restriction" />
            <StatCard label="20% mortgage tax credit" value={fmtGBP(r.mortgageTaxCredit)} tone="positive" sub="Basic-rate credit you do receive" />
          </StatGrid>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Full tax breakdown" eyebrow="Step 3">
          <BreakdownTable
            highlightLast
            rows={[
              { label: 'Gross rental income', value: fmtGBP(r.grossRent), bold: true },
              {
                label: useAllowance ? 'Less £1,000 Property Allowance' : 'Less allowable expenses',
                value: `, ${fmtGBP(r.allowableDeductions)}`, negative: true,
              },
              { label: 'Taxable rental profit', value: fmtGBP(r.taxableProfit), bold: true, sub: 'Mortgage interest NOT deducted here' },
              { label: `Income tax on profit (marginal ${(r.marginalTaxRate * 100).toFixed(0)}%)`, value: `, ${fmtGBP(r.taxBeforeCredit)}`, negative: true },
              { label: '20% credit for mortgage interest', value: `+${fmtGBP(r.mortgageTaxCredit)}`, positive: true, sub: 'Capped at the basic rate' },
              { label: 'Final tax on rental income', value: fmtGBP(r.finalTaxOnRental), bold: true },
              { label: 'Net rental income (after mortgage + tax + costs)', value: fmtGBP(r.netRentalIncome), bold: true },
            ]}
          />
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        {r.marginalTaxRate > 0.2 && parseFloat(mortgage) > 0 && (
          <Tip tone="warn">
            As a higher-rate taxpayer, you only get a <strong>20% tax credit</strong> on mortgage interest, not full relief. This is the Section 24 sting and is why many landlords moved properties into a Ltd company structure.
          </Tip>
        )}
        {useAllowance && parseFloat(expenses) > 1000 && (
          <Tip tone="warn">
            Your actual expenses ({fmtGBP(parseFloat(expenses))}) exceed the £1,000 Property Allowance, you&rsquo;d save more tax by claiming actual expenses instead.
          </Tip>
        )}
        {r.taxableProfit === 0 && r.grossRent > 0 && (
          <Tip tone="success">
            Your profit is fully covered by expenses, no rental income tax due. You may still need to register for Self Assessment if rent exceeds £2,500.
          </Tip>
        )}
        <Tip tone="info">
          Furnished Holiday Lets (FHLs) lost their preferential tax treatment from <strong>6 April 2025</strong>, they are now taxed like regular rental property and subject to Section 24.
        </Tip>
      </div>
    </CalcCard>
  );
}
