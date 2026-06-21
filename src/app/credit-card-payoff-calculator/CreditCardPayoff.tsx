'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, LineChart,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { LOANS_RELATED } from '../personal-loan-calculator/PersonalLoan';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const fmtYM = (m: number) => {
  if (m >= 1200) return '100y+';
  const y = Math.floor(m / 12); const mm = m % 12;
  if (y <= 0) return `${mm}m`;
  if (mm === 0) return `${y}y`;
  return `${y}y ${mm}m`;
};

interface Sim { months: number; interest: number; yearly: number[] }
function simFixed(balance: number, i: number, pay: number): Sim {
  let bal = balance; let interest = 0; let m = 0; const yearly = [bal];
  while (bal > 0.005 && m < 1200) {
    m++; const intM = bal * i; interest += intM;
    let p = pay - intM; if (p <= 0) { m = 1200; break; }
    if (p > bal) p = bal; bal -= p;
    if (m % 12 === 0 || bal <= 0.005) yearly.push(Math.max(0, bal));
  }
  return { months: m, interest, yearly };
}
function simMin(balance: number, i: number): Sim {
  let bal = balance; let interest = 0; let m = 0; const yearly = [bal];
  while (bal > 0.005 && m < 1200) {
    m++; const intM = bal * i; interest += intM;
    let pay = Math.max(bal * 0.01 + intM, 5);
    if (pay > bal + intM) pay = bal + intM;
    let p = pay - intM; if (p > bal) p = bal; bal -= p;
    if (m % 12 === 0 || bal <= 0.005) yearly.push(Math.max(0, bal));
  }
  return { months: m, interest, yearly };
}

export default function CreditCardPayoff() {
  const [balance, setBalance] = useState(4000);
  const [apr, setApr] = useState(24.9);
  const [payment, setPayment] = useState(200);

  const r = useMemo(() => {
    const i = apr / 1200;
    const fixed = simFixed(balance, i, payment);
    const min = simMin(balance, i);
    const labels = ['Now', ...Array.from({ length: Math.max(fixed.yearly.length, min.yearly.length) - 1 }, (_, k) => `Yr ${k + 1}`)];
    return { i, fixed, min, labels, neverClears: fixed.months >= 1200, saved: min.interest - fixed.interest, firstMonthInterest: balance * i };
  }, [balance, apr, payment]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Credit Card Payoff' }]}
      title="Credit Card Payoff Calculator"
      subtitle="See how long it takes to clear a credit card and how much interest you'll pay at a fixed monthly amount, and how much longer (and dearer) paying only the minimum would be."
      calcLabel="Calculate payoff"
      inputs={
        <Panel title="Your card">
          <div className="space-y-4">
            <Field label="Balance"><MoneyInput value={balance} onChange={setBalance} step={100} /></Field>
            <Field label={`APR, ${pct(apr, 1)}`}><Slider value={apr} onChange={setApr} min={0} max={50} step={0.1} /></Field>
            <Field label="Fixed monthly payment"><MoneyInput value={payment} onChange={setPayment} step={25} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          {r.neverClears ? (
            <Callout tone="warn" title="This payment won't clear the card">
              {gbp(payment)}/month barely covers the {gbp(r.firstMonthInterest, 0)} first-month interest, so the balance
              never reduces. Increase the payment above the monthly interest to make progress.
            </Callout>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Stat label="Time to clear" value={fmtYM(r.fixed.months)} sub={`at ${gbp(payment)}/mo`} tone="dark" big />
              <Stat label="Interest paid" value={gbp(r.fixed.interest)} sub={`at ${pct(apr, 1)} APR`} tone="accent" />
              <Stat label="Total repaid" value={gbp(balance + r.fixed.interest)} sub="balance + interest" />
            </div>
          )}

          <Panel title="Your payment vs minimum only">
            <LineChart height={200} labels={r.labels} format={(v) => gbp(v)}
              series={[
                { points: r.min.yearly, color: ACCENT, label: `Minimum only (${fmtYM(r.min.months)})`, dashed: true },
                { points: r.fixed.yearly, color: PRIMARY, label: `Your payment (${fmtYM(r.fixed.months)})`, payoffIndex: r.neverClears ? undefined : r.fixed.yearly.length - 1 },
              ]} />
            <div className="mt-3 p-3 rounded-lg bg-secondary-soft/30 border border-secondary/20 text-sm">
              Paying only the minimum would take <strong>{fmtYM(r.min.months)}</strong> and cost <strong className="text-secondary">{gbp(r.min.interest)}</strong> in interest, your fixed payment saves about <strong className="text-secondary">{gbp(Math.max(0, r.saved))}</strong>.
            </div>
          </Panel>

          <Callout tone="info" title="The minimum-payment trap">
            Minimum payments fall as the balance drops, so most of each payment goes on interest, stretching a debt
            over decades. Always pay a fixed amount (or more), not the minimum.
          </Callout>
        </>
      }
    >
      <Guide
        title="Clearing credit card debt"
        intro="Credit cards are easy to spend on and slow to clear. This guide explains why minimum payments are a trap, how to pay off faster, and when a balance transfer or consolidation helps."
      >
        <GuideSection kicker="The trap" title="Why minimum payments cost so much">
          <p>UK minimum payments are typically the greater of around 1% of the balance plus that month&apos;s interest, or a few pounds. Because the percentage shrinks as the balance falls, the payment gets smaller over time and most of it goes on interest. Paying only the minimum on a typical card can take <strong>decades</strong> and cost more in interest than the original balance. Card statements now show how long minimum-only repayment would take, it&apos;s usually a shock.</p>
        </GuideSection>
        <GuideSection kicker="The fix" title="Pay a fixed amount, not the minimum">
          <p>The single most powerful move is to pay a <strong>fixed monthly amount</strong> rather than the shrinking minimum. Keeping the payment level means an ever-larger share clears the balance, and the debt falls away far faster. Even a modest increase over the minimum can cut years off the term, use the calculator to see your own numbers.</p>
        </GuideSection>
        <GuideSection kicker="Go faster" title="Balance transfers and 0% deals">
          <p>A <strong>0% balance transfer</strong> card moves your debt to a card charging no interest for a promotional period (often 12 to 30 months), usually for a one-off transfer fee of 1 to 3%. Every pound you pay then clears the balance instead of feeding interest. To benefit, clear (or move) the balance before the 0% period ends and avoid new spending on the card. It&apos;s one of the cheapest ways to attack expensive card debt.</p>
          <Callout tone="tip" title="Clear it before the 0% ends">Set a standing order to clear the balance over the promo period. If you can&apos;t, plan another transfer before the rate jumps to the standard APR.</Callout>
        </GuideSection>
        <GuideSection kicker="Multiple cards" title="Snowball vs avalanche">
          <p>With several debts, two strategies work. The <strong>avalanche</strong> targets the highest-APR debt first (mathematically cheapest). The <strong>snowball</strong> clears the smallest balance first for quick wins and motivation. Both clear all debts; avalanche saves the most interest. The debt payoff planner compares them for your debts.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Paying only the minimum', 'It stretches the debt over decades and maximises interest. Pay a fixed amount instead.'],
            ['Spending on a 0% card', 'New purchases can lose the 0% benefit and complicate repayment. Use it only to clear the transferred balance.'],
            ['Missing a payment on a 0% deal', 'A missed payment can cancel the promotional rate. Set up a direct debit.'],
            ['Ignoring higher-APR debts', 'Tackle the most expensive debt first (avalanche) to save the most.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How long to pay off a credit card?', a: 'It depends on the balance, APR and your payment. Paying a fixed amount well above the minimum can clear a card in a year or two; minimum-only can take decades.' },
            { q: 'Is a balance transfer worth it?', a: 'Usually yes for expensive debt, a 0% period lets every payment clear the balance, for a small transfer fee. Clear or move the balance before the 0% ends.' },
            { q: 'Will paying off a card help my credit score?', a: 'Yes. Lower credit utilisation (balance vs limit) and consistent payments improve your score over time.' },
            { q: 'Should I close the card after clearing it?', a: 'Not necessarily, keeping it open (unused) lowers your overall utilisation, which can help your score. Just avoid running the balance back up.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={LOANS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
