'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

function monthlyPayment(principal: number, apr: number, months: number): number {
  const r = apr / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

function balanceAfter(principal: number, apr: number, months: number, paid: number): number {
  const r = apr / 100 / 12;
  const pay = monthlyPayment(principal, apr, months);
  let bal = principal;
  for (let i = 0; i < paid && i < months; i++) {
    bal = bal + bal * r - pay;
  }
  return Math.max(0, bal);
}

function payoffMonths(balance: number, apr: number, payment: number): { months: number; interest: number } {
  const r = apr / 100 / 12;
  let bal = balance;
  let interest = 0;
  let months = 0;
  while (bal > 0.01 && months < 1200) {
    const charge = bal * r;
    interest += charge;
    bal += charge - payment;
    months++;
    if (payment <= charge) break;
  }
  return { months, interest };
}

type Mode = 'settle' | 'overpay';

const RELATED = [
  { href: '/personal-loan-calculator', label: 'Personal Loan', hint: 'Repayment · interest · APR' },
  { href: '/loan-comparison-calculator', label: 'Loan Comparison', hint: '3 loans side by side' },
  { href: '/loan-affordability-calculator', label: 'Loan Affordability', hint: 'How much can you borrow?' },
  { href: '/overpayment-mortgage', label: 'Mortgage Overpayment', hint: 'Overpay your mortgage' },
];

export default function EarlyRepayment() {
  const [amount, setAmount] = useState(15000);
  const [apr, setApr] = useState(7.9);
  const [term, setTerm] = useState(60);
  const [paid, setPaid] = useState(18);
  const [mode, setMode] = useState<Mode>('settle');
  const [lumpSum, setLumpSum] = useState(2000);

  const r = useMemo(() => {
    const pay = monthlyPayment(amount, apr, term);
    const balance = balanceAfter(amount, apr, term, paid);
    const monthsLeft = Math.max(0, term - paid);
    const remainingInterest = Math.max(0, pay * monthsLeft - balance);

    const monthlyRate = apr / 100 / 12;

    if (mode === 'settle') {
      // Early settlement: balance + up to 58 days interest rebate rule (approx)
      const settlementInterest = balance * monthlyRate * (58 / 30);
      const settlementFigure = balance + settlementInterest;
      const interestSaved = remainingInterest - settlementInterest;
      return { pay, balance, monthsLeft, remainingInterest, settlementFigure, interestSaved, mode };
    } else {
      const newBalance = Math.max(0, balance - lumpSum);
      const original = payoffMonths(balance, apr, pay);
      const after = payoffMonths(newBalance, apr, pay);
      const interestSaved = original.interest - after.interest;
      const monthsSaved = original.months - after.months;
      return { pay, balance, monthsLeft, remainingInterest, newBalance, after, monthsSaved, interestSaved, mode };
    }
  }, [amount, apr, term, paid, mode, lumpSum]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Early Repayment' }]}
      title="Loan Early Repayment Calculator"
      subtitle="See how much interest you'd save by settling your loan early or making a lump-sum overpayment — including the early settlement figure."
      calcLabel="Calculate Saving"
      inputs={
        <div className="space-y-4">
          <Panel title="Your Loan">
            <div className="space-y-4">
              <Field label="Original loan amount"><MoneyInput value={amount} onChange={setAmount} step={500} /></Field>
              <Field label="APR (%)"><NumberInput value={apr} onChange={setApr} min={0} step={0.1} suffix="%" /></Field>
              <Field label="Original term (months)"><NumberInput value={term} onChange={setTerm} min={1} step={6} suffix=" mo" /></Field>
              <Field label="Months already paid"><NumberInput value={paid} onChange={setPaid} min={0} step={1} suffix=" mo" /></Field>
            </div>
          </Panel>
          <Panel title="What You'll Do">
            <div className="space-y-4">
              <Field label="Repayment type">
                <Choice<Mode>
                  name="mode"
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: 'settle', label: 'Settle in full now', desc: 'Pay off the whole balance' },
                    { value: 'overpay', label: 'Lump-sum overpayment', desc: 'Pay extra, keep the loan' },
                  ]}
                />
              </Field>
              {mode === 'overpay' && (
                <Field label="Lump-sum overpayment"><MoneyInput value={lumpSum} onChange={setLumpSum} step={250} /></Field>
              )}
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Interest Saved" value={gbp(Math.max(0, r.interestSaved))} sub={mode === 'settle' ? 'By settling now' : 'By overpaying'} tone="dark" big />
            <Stat label="Balance Now" value={gbp(r.balance)} sub={`After ${paid} payments`} tone="primary" />
            {mode === 'settle' ? (
              <Stat label="Settlement Figure" value={gbp(r.settlementFigure!)} sub="Balance + ~58 days interest" tone="accent" />
            ) : (
              <Stat label="Months Saved" value={`${r.monthsSaved}`} sub="Off the remaining term" tone="accent" />
            )}
            <Stat label="Remaining Interest" value={gbp(r.remainingInterest)} sub="If you keep paying normally" />
          </div>

          <Callout tone="info" title="The 58-day interest rule">
            Under the Consumer Credit Act, lenders can charge up to 58 days' extra interest when you settle a regulated loan early — built into the settlement figure above. There's no percentage penalty beyond that for most personal loans.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate assumes a fixed-rate amortising loan. Ask your lender for an official early settlement figure. Some loans (and most mortgages) have different early-repayment charges.</p>
        </>
      }
    >
      <Guide
        title="Should you repay your loan early?"
        intro="Paying off a loan ahead of schedule — or making a lump-sum overpayment — saves interest because you owe money for less time. For most UK personal loans the only catch is up to 58 days' extra interest on early settlement. Here's how the savings work."
      >
        <GuideSection kicker="Why it saves" title="Less time owing means less interest">
          <p>Interest is charged on your outstanding balance each month. Clear the debt sooner and there are fewer months of interest to pay. Even a partial overpayment reduces the balance that future interest is calculated on, so every extra pound works harder than the last.</p>
        </GuideSection>

        <GuideSection kicker="Settlement" title="The early settlement figure">
          <p>To pay off a loan in full, you ask the lender for a <strong>settlement figure</strong> — the outstanding balance plus, under the Consumer Credit Act, up to <strong>58 days' interest</strong>. This is the only meaningful charge on most regulated personal loans; there's usually no separate percentage penalty. The settlement figure is almost always less than continuing to pay every remaining instalment.</p>
        </GuideSection>

        <GuideSection kicker="Overpaying" title="Lump sums and partial repayment">
          <p>You don't have to clear the whole loan. A lump-sum <strong>overpayment</strong> cuts the balance, which either shortens the term or reduces future payments. Because it removes the most heavily-interest-bearing portion of the debt, overpaying early in the loan saves the most.</p>
          <Callout tone="tip" title="Clear the most expensive debt first">
            If you have spare cash, target the highest-APR debt first — usually credit cards before personal loans before a mortgage. That maximises the interest you save per pound.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Settling a £15,000 loan early">
          <p>On a £15,000 loan at 7.9% over 60 months, after 18 payments a chunk of the balance remains. Settling now means paying that balance plus up to 58 days' interest — far less than the interest built into the remaining 42 instalments. The difference is your saving.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common early repayment mistakes">
          <Mistakes items={[
            ['Not asking for a settlement figure', 'Always get the official figure from the lender before paying off a loan.'],
            ['Ignoring higher-rate debt', 'Clearing a cheap loan while expensive credit card debt sits idle wastes the saving.'],
            ['Emptying your emergency fund', 'Don\'t overpay so aggressively that you have no cash buffer for emergencies.'],
            ['Assuming a big penalty', 'For most personal loans the only charge is up to 58 days\' interest, not a percentage fine.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is there a penalty for repaying a loan early?', a: 'For most regulated UK personal loans, the lender can charge up to 58 days\' interest on early settlement, but no separate percentage penalty.' },
            { q: 'How do I pay off my loan early?', a: 'Ask your lender for a settlement figure, then pay that amount. The loan closes and you stop making monthly payments.' },
            { q: 'Is it better to overpay or settle in full?', a: 'If you can afford it, settling in full saves the most interest. Partial overpayments still help by reducing the balance.' },
            { q: 'Does early repayment help my credit score?', a: 'Clearing debt reduces your utilisation and commitments, which can help over time, though closing an account has a small short-term effect.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
