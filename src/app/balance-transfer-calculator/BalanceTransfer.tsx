'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

// Simulate paying a fixed monthly amount against a balance at a monthly rate
function payoff(balance: number, monthlyRate: number, payment: number, introMonths = 0): { months: number; interest: number } {
  let bal = balance;
  let interest = 0;
  let months = 0;
  while (bal > 0.01 && months < 600) {
    const rate = months < introMonths ? 0 : monthlyRate;
    const charge = bal * rate;
    interest += charge;
    bal += charge - payment;
    months++;
    if (payment <= bal * rate) break; // payment never clears
  }
  return { months, interest };
}

const RELATED = [
  { href: '/credit-card-payoff-calculator', label: 'Credit Card Payoff', hint: 'Months + interest to clear' },
  { href: '/debt-consolidation-calculator', label: 'Debt Consolidation', hint: 'One payment vs many' },
  { href: '/loan-comparison-calculator', label: 'Loan Comparison', hint: '3 loans side by side' },
  { href: '/debt-payoff-planner', label: 'Debt Payoff Planner', hint: 'Snowball vs avalanche' },
];

export default function BalanceTransfer() {
  const [balance, setBalance] = useState(5000);
  const [currentApr, setCurrentApr] = useState(24.9);
  const [monthlyPay, setMonthlyPay] = useState(250);
  const [feePct, setFeePct] = useState(2.9);
  const [introMonths, setIntroMonths] = useState(24);
  const [postApr, setPostApr] = useState(22.9);

  const r = useMemo(() => {
    const stay = payoff(balance, currentApr / 100 / 12, monthlyPay);

    const fee = balance * (feePct / 100);
    const transferBalance = balance + fee;
    const transfer = payoff(transferBalance, postApr / 100 / 12, monthlyPay, introMonths);

    const saving = stay.interest - (transfer.interest + fee);
    return { stay, fee, transfer, saving, transferBalance };
  }, [balance, currentApr, monthlyPay, feePct, introMonths, postApr]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Balance Transfer' }]}
      title="Balance Transfer Calculator"
      subtitle="See whether moving your credit card balance to a 0% deal saves money after the transfer fee, and how much interest you'll avoid."
      calcLabel="Calculate Saving"
      inputs={
        <div className="space-y-4">
          <Panel title="Your Current Card">
            <div className="space-y-4">
              <Field label="Balance to transfer"><MoneyInput value={balance} onChange={setBalance} step={250} /></Field>
              <Field label="Current APR (%)"><NumberInput value={currentApr} onChange={setCurrentApr} min={0} step={0.1} suffix="%" /></Field>
              <Field label="Monthly payment you'll make"><MoneyInput value={monthlyPay} onChange={setMonthlyPay} step={25} /></Field>
            </div>
          </Panel>
          <Panel title="The 0% Deal">
            <div className="space-y-4">
              <Field label="Transfer fee (%)"><NumberInput value={feePct} onChange={setFeePct} min={0} step={0.1} suffix="%" /></Field>
              <Field label="0% intro period (months)"><NumberInput value={introMonths} onChange={setIntroMonths} min={0} step={1} suffix=" mo" /></Field>
              <Field label="APR after intro (%)"><NumberInput value={postApr} onChange={setPostApr} min={0} step={0.1} suffix="%" /></Field>
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="You'd Save" value={gbp(Math.max(0, r.saving))} sub={r.saving > 0 ? 'By transferring' : 'No saving'} tone="dark" big />
            <Stat label="Transfer Fee" value={gbp(r.fee)} sub={`${feePct}% of balance`} tone="accent" />
            <Stat label="Interest if You Stay" value={gbp(r.stay.interest)} sub={`${r.stay.months} months`} tone="primary" />
            <Stat label="Interest if You Transfer" value={gbp(r.transfer.interest)} sub={`${r.transfer.months} months`} />
          </div>

          <Panel title="Stay vs transfer">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Stay, total interest</span><span className="font-semibold tabular-nums">{gbp(r.stay.interest)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Transfer, interest + fee</span><span className="font-semibold tabular-nums">{gbp(r.transfer.interest + r.fee)}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Net saving</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.saving)}</span></div>
            </div>
          </Panel>

          {r.transfer.months <= introMonths ? (
            <Callout tone="tip" title="You'll clear it interest-free">
              At this payment you repay the balance within the 0% period, so you pay only the {gbp(r.fee)} transfer fee, no interest at all.
            </Callout>
          ) : (
            <Callout tone="warn" title="Aim to clear it before the 0% ends">
              You won't clear the balance within the {introMonths}-month 0% window, so interest at {postApr}% kicks in afterwards. Increase your monthly payment to finish before the deal ends.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate assumes a fixed monthly payment and no new spending on either card. Most 0% deals require minimum payments and lose the 0% rate if you miss one.</p>
        </>
      }
    >
      <Guide
        title="Are balance transfers worth it?"
        intro="A 0% balance transfer moves expensive credit card debt onto a card charging no interest for an introductory period, for a one-off fee. Done right, it can save hundreds in interest. Done wrong, you pay a fee and still get charged. Here's how to tell which."
      >
        <GuideSection kicker="The basics" title="0% interest for a fee">
          <p>A balance transfer card charges <strong>0% interest</strong> on the transferred balance for a set period (often 12 to 30 months), in exchange for a one-off <strong>transfer fee</strong>, typically 1 to 3% of the balance. If you clear the debt within the 0% window, the fee is all you pay, far less than ongoing interest at 20 to 30%.</p>
        </GuideSection>

        <GuideSection kicker="The maths" title="Fee vs interest saved">
          <p>The deal is worth it when the interest you'd otherwise pay exceeds the transfer fee. On a £5,000 balance at 24.9%, staying put could cost hundreds in interest, while a 2.9% transfer fee is just £145. As long as you keep up payments, the 0% card usually wins comfortably.</p>
          <Callout tone="warn" title="Clear it before the 0% ends">
            The big risk is reaching the end of the 0% period with a balance left, when the card reverts to a high APR (often 20%+). Set a payment that clears the balance within the deal.
          </Callout>
        </GuideSection>

        <GuideSection kicker="The rules" title="What to watch out for">
          <ul className="list-disc pl-5 space-y-2">
            <li>You must still make at least the minimum monthly payment, miss one and you can lose the 0% rate.</li>
            <li>New purchases usually aren't covered by the 0% and may be charged interest.</li>
            <li>You generally can't transfer between cards from the same bank.</li>
            <li>The 0% length you're offered depends on your credit profile.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Worked example" title="£5,000 at 24.9%">
          <p>Paying £250 a month on a £5,000 balance at 24.9% costs a significant amount of interest over the time it takes to clear. Transferring to a 24-month 0% card with a 2.9% fee (£145) and paying the same £250 clears it inside the 0% period, so you pay only the £145 fee and save the rest.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common balance transfer mistakes">
          <Mistakes items={[
            ['Only paying the minimum', 'Minimum payments may not clear the balance before the 0% ends, leaving you facing high interest.'],
            ['Spending on the new card', 'Purchases usually aren\'t at 0% and complicate how payments are applied.'],
            ['Missing a payment', 'A single missed payment can cancel the 0% deal entirely.'],
            ['Ignoring the fee', 'On small balances or short payoff times, the fee can outweigh the interest saved.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is a balance transfer fee?', a: 'A one-off charge, usually 1 to 3% of the balance you move, for the 0% interest deal.' },
            { q: 'Does a balance transfer hurt my credit score?', a: 'The application is a hard search and a new account, which can dip your score short-term, but reducing your debt helps over time.' },
            { q: 'Can I transfer more than once?', a: 'Yes, some people "rate tart" between 0% cards, but each application is a credit check and offers depend on your profile.' },
            { q: 'What happens at the end of the 0% period?', a: 'Any remaining balance starts accruing interest at the card\'s standard APR, so aim to clear it before then.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/balance-transfer-calculator" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
