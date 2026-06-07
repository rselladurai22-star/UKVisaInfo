'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, Donut, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

export const LOANS_RELATED = [
  { href: '/car-finance-calculator', label: 'Car Finance', hint: 'PCP vs HP vs loan' },
  { href: '/credit-card-payoff-calculator', label: 'Credit Card Payoff', hint: 'Months & interest to clear' },
  { href: '/debt-consolidation-calculator', label: 'Debt Consolidation', hint: 'One payment vs many' },
  { href: '/loan-apr-calculator', label: 'Loan APR', hint: 'True cost of borrowing' },
  { href: '/debt-payoff-planner', label: 'Debt Payoff Planner', hint: 'Snowball vs avalanche' },
  { href: '/category/loans', label: 'All Loan Tools', hint: 'The full hub' },
];

export default function PersonalLoan() {
  const [amount, setAmount] = useState(10000);
  const [apr, setApr] = useState(8.9);
  const [years, setYears] = useState(5);

  const r = useMemo(() => {
    const n = Math.max(1, Math.round(years * 12));
    const i = apr / 1200;
    const monthly = i === 0 ? amount / n : (amount * i) / (1 - Math.pow(1 + i, -n));
    const totalPaid = monthly * n;
    const totalInterest = totalPaid - amount;
    return { n, monthly, totalPaid, totalInterest };
  }, [amount, apr, years]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Personal Loan' }]}
      title="Personal Loan Calculator"
      subtitle="Work out the monthly repayment, total interest and total cost of a UK personal loan — and see how the APR and term change what you pay."
      calcLabel="Calculate repayment"
      inputs={
        <Panel title="Your loan">
          <div className="space-y-4">
            <Field label="Loan amount"><MoneyInput value={amount} onChange={setAmount} step={500} /></Field>
            <Field label={`Representative APR — ${pct(apr, 1)}`}><Slider value={apr} onChange={setApr} min={2} max={40} step={0.1} /></Field>
            <Field label="Term (years)"><NumberInput value={years} onChange={setYears} suffix="yrs" /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Monthly repayment" value={gbp(r.monthly, 2)} sub={`${r.n} months`} tone="dark" big />
            <Stat label="Total interest" value={gbp(r.totalInterest)} sub={`at ${pct(apr, 1)} APR`} tone="accent" />
            <Stat label="Total repaid" value={gbp(r.totalPaid)} sub="loan + interest" />
          </div>
          <Panel title="What you repay">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Total repaid" centerValue={gbp(r.totalPaid)} segments={[
                { value: amount, color: PRIMARY, label: 'Amount borrowed' },
                { value: r.totalInterest, color: ACCENT, label: 'Interest' },
              ]} />
              <div className="flex-1 space-y-3 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Amount borrowed</span><span className="font-semibold tabular-nums">{gbp(amount)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Interest</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.totalInterest)}</span></div>
                <BarTrack segments={[{ value: amount, color: PRIMARY }, { value: r.totalInterest, color: ACCENT }]} />
              </div>
            </div>
          </Panel>
          <Callout tone="info" title="Representative APR isn't guaranteed">
            Lenders must advertise a rate that at least 51% of accepted applicants get — your actual rate depends on
            your credit profile and could be higher. Always check your personalised rate (many lenders offer a
            soft-search quote that won&apos;t affect your credit score).
          </Callout>
        </>
      }
    >
      <Guide
        title="How personal loans work"
        intro="A personal loan is a fixed amount borrowed over a fixed term at a fixed monthly repayment. This guide explains APR, how the term changes the cost, and how to borrow as cheaply as possible."
      >
        <GuideSection kicker="The basics" title="Amount, term and APR">
          <p>An unsecured personal loan gives you a lump sum you repay in equal monthly instalments over a set term — typically one to seven years. The cost is driven by the <strong>APR</strong> (annual percentage rate), which rolls the interest rate and any compulsory fees into one figure so you can compare deals fairly. A larger loan, a higher APR or a longer term all increase the total interest you pay.</p>
        </GuideSection>
        <GuideSection kicker="The trade-off" title="Why a longer term costs more">
          <p>Spreading a loan over more years lowers the monthly payment but increases the total interest, because you owe the balance for longer. A £10,000 loan at 8.9% over 3 years costs far less in total than the same loan over 7 years, even though the monthly payment is higher. Borrow over the <strong>shortest term you can comfortably afford</strong> to minimise the total cost.</p>
          <Callout tone="tip" title="Watch the £7,500–£15,000 sweet spot">UK loan rates are often lowest in the mid-size band (around £7,500–£15,000). Borrowing just under a threshold can mean a higher rate than borrowing slightly more — compare both.</Callout>
        </GuideSection>
        <GuideSection kicker="Rates" title="Representative vs personalised APR">
          <p>The advertised &quot;representative APR&quot; only has to be offered to 51% of accepted applicants — the rest can be charged more. Your personalised rate depends on your credit score, income and existing debts. Use lenders&apos; <strong>soft-search eligibility checkers</strong> to see your likely rate without leaving a hard footprint on your credit file.</p>
        </GuideSection>
        <GuideSection kicker="Save money" title="Borrowing more cheaply">
          <ul className="space-y-3">
            {[
              ['Check your credit file first', 'Correct errors and register to vote — small fixes can move you to a better rate band.'],
              ['Use soft-search checkers', 'Compare personalised rates without multiple hard searches denting your score.'],
              ['Borrow the right amount', 'Mid-size loans often have the lowest rates; avoid stretching the term unnecessarily.'],
              ['Check early-repayment terms', 'Most personal loans allow overpayment; the lender can charge up to ~58 days&apos; interest on early settlement.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}:</strong> {b}</span></li>
            ))}
          </ul>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Choosing the longest term for a low payment', 'It minimises the monthly cost but maximises total interest.'],
            ['Applying to many lenders at once', 'Multiple hard searches in a short time can lower your score. Use soft-search tools.'],
            ['Ignoring fees', 'Compare APR (which includes compulsory fees), not just the headline interest rate.'],
            ['Borrowing for non-essentials at high APR', 'For short-term or small sums, a 0% credit card can be cheaper than a loan.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What APR will I actually get?', a: 'The advertised representative APR goes to at least 51% of accepted applicants; your rate depends on your credit profile and could be higher. Use a soft-search quote to see your personalised rate.' },
            { q: 'Can I repay a personal loan early?', a: 'Yes. Most loans allow overpayment and early settlement, though the lender can charge up to around 58 days&apos; interest as an early-repayment charge. It usually still saves money overall.' },
            { q: 'Secured or unsecured loan?', a: 'Unsecured loans aren&apos;t tied to an asset and suit most borrowing up to ~£25,000. Secured loans use your home as collateral for larger sums or weaker credit, but your home is at risk if you don&apos;t pay.' },
            { q: 'Does applying hurt my credit score?', a: 'A full application leaves a hard search with a small, temporary effect. Eligibility checkers use soft searches that don&apos;t affect your score.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={LOANS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
