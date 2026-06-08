'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

function maxLoan(payment: number, apr: number, months: number): number {
  const r = apr / 100 / 12;
  if (payment <= 0 || months <= 0) return 0;
  if (r === 0) return payment * months;
  return (payment * (1 - Math.pow(1 + r, -months))) / r;
}

const RELATED = [
  { href: '/loan-comparison-calculator', label: 'Loan Comparison', hint: '3 loans side by side' },
  { href: '/personal-loan-calculator', label: 'Personal Loan', hint: 'Repayment · interest · APR' },
  { href: '/loan-early-repayment-calculator', label: 'Early Repayment', hint: 'Interest saved' },
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
];

export default function LoanAffordability() {
  const [grossAnnual, setGrossAnnual] = useState(35000);
  const [housing, setHousing] = useState(900);
  const [existingDebt, setExistingDebt] = useState(150);
  const [targetDti, setTargetDti] = useState(36);
  const [apr, setApr] = useState(8.9);
  const [months, setMonths] = useState(48);

  const r = useMemo(() => {
    const monthlyGross = grossAnnual / 12;
    const maxTotalServicing = monthlyGross * (targetDti / 100);
    const currentServicing = housing + existingDebt;
    const affordableNew = Math.max(0, maxTotalServicing - currentServicing);
    const loan = maxLoan(affordableNew, apr, months);
    const currentDti = monthlyGross > 0 ? (currentServicing / monthlyGross) * 100 : 0;
    return { monthlyGross, maxTotalServicing, currentServicing, affordableNew, loan, currentDti };
  }, [grossAnnual, housing, existingDebt, targetDti, apr, months]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Loan Affordability' }]}
      title="Loan Affordability Calculator"
      subtitle="Work out how much you could responsibly borrow based on your debt-to-income ratio (DTI), existing commitments and the loan terms."
      calcLabel="Check Affordability"
      inputs={
        <div className="space-y-4">
          <Panel title="Your Income & Commitments">
            <div className="space-y-4">
              <Field label="Gross annual income"><MoneyInput value={grossAnnual} onChange={setGrossAnnual} step={1000} /></Field>
              <Field label="Monthly rent / mortgage"><MoneyInput value={housing} onChange={setHousing} step={50} /></Field>
              <Field label="Other monthly debt payments" hint="Cards, loans, car finance"><MoneyInput value={existingDebt} onChange={setExistingDebt} step={25} /></Field>
            </div>
          </Panel>
          <Panel title="Loan & Target">
            <div className="space-y-4">
              <Field label="Target debt-to-income (%)" hint="Lenders prefer under 36–43%"><NumberInput value={targetDti} onChange={setTargetDti} min={1} step={1} suffix="%" /></Field>
              <Field label="Expected APR (%)"><NumberInput value={apr} onChange={setApr} min={0} step={0.1} suffix="%" /></Field>
              <Field label="Loan term (months)"><NumberInput value={months} onChange={setMonths} min={1} step={6} suffix=" mo" /></Field>
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="You Could Borrow" value={gbp(Math.round(r.loan / 100) * 100)} sub={`Over ${months} months`} tone="dark" big />
            <Stat label="Affordable Payment" value={gbp(r.affordableNew)} sub="New monthly budget" tone="primary" />
            <Stat label="Current DTI" value={pct(r.currentDti)} sub="Before new loan" tone="accent" />
            <Stat label="DTI Headroom" value={gbp(r.maxTotalServicing - r.currentServicing)} sub={`To ${targetDti}% target`} />
          </div>

          <Panel title="How it's worked out">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Monthly gross income</span><span className="font-semibold tabular-nums">{gbp(r.monthlyGross)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Max servicing at {targetDti}% DTI</span><span className="font-semibold tabular-nums">{gbp(r.maxTotalServicing)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− Existing commitments</span><span className="font-semibold tabular-nums">−{gbp(r.currentServicing)}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Affordable new payment</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.affordableNew)}/mo</span></div>
            </div>
          </Panel>

          {r.currentDti > targetDti && (
            <Callout tone="warn" title="You're already above your target DTI">
              Your existing commitments already exceed your target ratio, so most lenders would be reluctant to extend further credit. Reducing existing debt first will help.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate only. Lenders use their own affordability rules, stress tests and credit scoring — this DTI-based figure is a guide, not a guarantee of approval. Borrow only what you can comfortably repay.</p>
        </>
      }
    >
      <Guide
        title="How much can you afford to borrow?"
        intro="Before taking a loan, it's worth checking what you can realistically afford — not just what a lender might offer. The debt-to-income ratio (DTI) is the key measure: the share of your income already going on debt. Keep it sensible and borrowing stays manageable."
      >
        <GuideSection kicker="The basics" title="What is debt-to-income?">
          <p>Your <strong>debt-to-income ratio</strong> is your total monthly debt payments (including rent or mortgage) divided by your gross monthly income, as a percentage. Lenders use it to judge affordability:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Under 36%:</strong> generally comfortable.</li>
            <li><strong>36–43%:</strong> manageable but watched closely.</li>
            <li><strong>Over 43%:</strong> many lenders become reluctant to lend more.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="The maths" title="From DTI to a loan amount">
          <p>Start with your gross monthly income and apply your target DTI to get the maximum you should spend servicing debt. Subtract what you already pay on housing and other debts — what's left is your affordable new monthly payment. Working backwards from that payment, the APR and the term gives the loan size that fits.</p>
        </GuideSection>

        <GuideSection kicker="Lenders" title="Why approval isn't guaranteed">
          <p>DTI is only part of the picture. Lenders also look at your credit history, employment stability, regular outgoings and run their own affordability and stress tests. Two people with the same DTI can get different decisions. Treat this as a planning tool, not a promise of approval.</p>
          <Callout tone="tip" title="Leave yourself a buffer">
            Borrowing right up to your maximum leaves no room for rate rises or emergencies. Aim below your ceiling so an unexpected bill doesn't tip you into trouble.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="£35,000 income, modest commitments">
          <p>On £35,000 gross (£2,917 a month), a 36% DTI target allows about £1,050 of total debt servicing. With £900 rent and £150 of other debt, you're already at the limit — leaving little headroom. Reducing the existing debt, or choosing a longer term, would free up affordable monthly capacity for a new loan.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common affordability mistakes">
          <Mistakes items={[
            ['Borrowing the maximum offered', 'What a lender will offer and what you can comfortably afford are not the same thing.'],
            ['Forgetting housing in the DTI', 'Rent or mortgage is the biggest commitment and must be counted.'],
            ['Ignoring rate rises', 'Variable rates and future borrowing can push your DTI higher than planned.'],
            ['Not leaving an emergency buffer', 'Maxing out affordability leaves no cushion for unexpected costs.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is a good debt-to-income ratio?', a: 'Under 36% is generally considered comfortable; many lenders become cautious above 43%.' },
            { q: 'Does DTI use gross or net income?', a: 'It is usually calculated on gross (pre-tax) income, though it is wise to also check affordability against your take-home pay.' },
            { q: 'Will a low DTI guarantee approval?', a: 'No. Credit history, income stability and the lender\'s own checks all matter alongside DTI.' },
            { q: 'Should I include my mortgage in DTI?', a: 'Yes. Your mortgage or rent is a core monthly commitment and is included in the ratio.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
