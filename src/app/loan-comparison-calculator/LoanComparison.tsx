'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

function monthlyPayment(principal: number, apr: number, months: number): number {
  const r = apr / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

interface LoanInput { amount: number; apr: number; months: number; }

function summarise(l: LoanInput) {
  const monthly = monthlyPayment(l.amount, l.apr, l.months);
  const totalPaid = monthly * l.months;
  const totalInterest = totalPaid - l.amount;
  return { monthly, totalPaid, totalInterest };
}

const RELATED = [
  { href: '/personal-loan-calculator', label: 'Personal Loan', hint: 'Repayment · interest · APR' },
  { href: '/loan-apr-calculator', label: 'Loan APR', hint: 'True cost of borrowing' },
  { href: '/loan-affordability-calculator', label: 'Loan Affordability', hint: 'How much can you borrow?' },
  { href: '/loan-early-repayment-calculator', label: 'Early Repayment', hint: 'Interest saved' },
];

export default function LoanComparison() {
  const [a, setA] = useState<LoanInput>({ amount: 10000, apr: 6.9, months: 60 });
  const [b, setB] = useState<LoanInput>({ amount: 10000, apr: 9.9, months: 36 });
  const [c, setC] = useState<LoanInput>({ amount: 10000, apr: 12.9, months: 48 });

  const r = useMemo(() => {
    const rows = [
      { name: 'Loan A', ...a, ...summarise(a) },
      { name: 'Loan B', ...b, ...summarise(b) },
      { name: 'Loan C', ...c, ...summarise(c) },
    ];
    const cheapest = rows.reduce((x, y) => (y.totalInterest < x.totalInterest ? y : x), rows[0]);
    const lowestMonthly = rows.reduce((x, y) => (y.monthly < x.monthly ? y : x), rows[0]);
    return { rows, cheapest, lowestMonthly };
  }, [a, b, c]);

  const loanPanel = (label: string, val: LoanInput, set: (v: LoanInput) => void) => (
    <Panel title={label}>
      <div className="space-y-4">
        <Field label="Amount"><MoneyInput value={val.amount} onChange={(v) => set({ ...val, amount: v })} step={500} /></Field>
        <Field label="APR (%)"><NumberInput value={val.apr} onChange={(v) => set({ ...val, apr: v })} min={0} step={0.1} suffix="%" /></Field>
        <Field label="Term (months)"><NumberInput value={val.months} onChange={(v) => set({ ...val, months: v })} min={1} step={6} suffix=" mo" /></Field>
      </div>
    </Panel>
  );

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Loan Comparison' }]}
      title="Loan Comparison Calculator"
      subtitle="Compare up to three personal loans side by side — monthly repayment, total interest and total cost — to find the cheapest deal."
      calcLabel="Compare Loans"
      inputs={<div className="space-y-4">{loanPanel('Loan A', a, setA)}{loanPanel('Loan B', b, setB)}{loanPanel('Loan C', c, setC)}</div>}
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Cheapest Overall" value={r.cheapest.name} sub={`${gbp(r.cheapest.totalInterest)} interest`} tone="dark" big />
            <Stat label="Lowest Monthly" value={r.lowestMonthly.name} sub={`${gbp(r.lowestMonthly.monthly)}/mo`} tone="primary" />
          </div>

          <Panel title="Side by side">
            <div className="space-y-3 text-sm w-full">
              {r.rows.map((row) => (
                <div key={row.name} className={`rounded-lg p-3 border ${row.name === r.cheapest.name ? 'border-emerald-500 bg-emerald-50/30' : 'border-outline-variant'}`}>
                  <div className="flex justify-between font-semibold"><span>{row.name}</span><span className="tabular-nums">{gbp(row.monthly)}/mo</span></div>
                  <div className="flex justify-between text-on-surface-variant text-xs mt-1"><span>Total interest</span><span className="tabular-nums">{gbp(row.totalInterest)}</span></div>
                  <div className="flex justify-between text-on-surface-variant text-xs"><span>Total repaid</span><span className="tabular-nums">{gbp(row.totalPaid)}</span></div>
                </div>
              ))}
            </div>
          </Panel>

          <Callout tone="tip" title="Lowest monthly isn't always cheapest">
            A longer term lowers the monthly payment but usually increases the total interest. The cheapest loan overall is the one with the lowest total interest you can afford monthly.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate assumes a fixed-rate repayment loan with interest compounded monthly. Always check the APR, any fees and early-repayment terms in the lender's offer.</p>
        </>
      }
    >
      <Guide
        title="How to compare personal loans"
        intro="When you borrow, the headline interest rate only tells part of the story. The term, the APR and any fees together decide what a loan really costs. Comparing loans properly means looking at total interest, not just the monthly payment. Here's how."
      >
        <GuideSection kicker="The basics" title="APR, term and total cost">
          <p>Three numbers shape every loan:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>APR</strong> — the annual cost of borrowing including compulsory fees, the fairest single comparison figure.</li>
            <li><strong>Term</strong> — how long you repay over. Longer terms mean smaller monthly payments but more total interest.</li>
            <li><strong>Total cost</strong> — the sum of all repayments, which reveals the true price of the loan.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="The trap" title="Low monthly, high total">
          <p>Lenders often advertise a low monthly payment, achieved by stretching the term. A £10,000 loan over 60 months has a lower monthly cost than over 36 months, but you pay interest for an extra two years. Always compare the <strong>total interest</strong>, not just the monthly figure.</p>
          <Callout tone="warn" title="The advertised APR may not be yours">
            The "representative APR" only has to be offered to 51% of accepted applicants. Your actual rate depends on your credit profile, so the headline rate isn't guaranteed.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Same amount, different deals">
          <p>Borrowing £10,000: at 6.9% over 60 months the monthly payment is lower but you pay more months of interest; at 9.9% over 36 months the monthly cost is higher but the loan clears sooner with less total interest. Running both through the calculator shows which genuinely costs less over its life.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common loan comparison mistakes">
          <Mistakes items={[
            ['Comparing on monthly payment alone', 'A longer term lowers the monthly cost but raises total interest.'],
            ['Ignoring fees', 'Arrangement fees and insurance add to the real cost — use the APR to capture them.'],
            ['Assuming you\'ll get the advertised rate', 'Representative APRs are only offered to most, not all, accepted applicants.'],
            ['Overlooking early-repayment charges', 'Some loans penalise overpayment; check before signing if you may repay early.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is the difference between APR and interest rate?', a: 'The interest rate is the cost of the money; the APR also includes compulsory fees, making it a fairer comparison between loans.' },
            { q: 'Is a longer loan term cheaper?', a: 'It lowers the monthly payment but usually costs more in total interest, because you borrow for longer.' },
            { q: 'Should I always pick the lowest APR?', a: 'Usually, for the same term, yes — but make sure the monthly payment is affordable and check for fees and flexibility.' },
            { q: 'Will applying for several loans hurt my credit?', a: 'Multiple full applications can. Use eligibility checkers with soft searches to compare without harming your score.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
