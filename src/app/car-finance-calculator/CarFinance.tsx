'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { LOANS_RELATED } from '../personal-loan-calculator/PersonalLoan';

const pmt = (pv: number, fv: number, aprPct: number, n: number) => {
  const i = aprPct / 1200;
  if (i === 0) return (pv - fv) / n;
  return ((pv - fv / Math.pow(1 + i, n)) * i) / (1 - Math.pow(1 + i, -n));
};

export default function CarFinance() {
  const [price, setPrice] = useState(25000);
  const [deposit, setDeposit] = useState(3000);
  const [months, setMonths] = useState(48);
  const [apr, setApr] = useState(9.9);
  const [balloonPct, setBalloonPct] = useState(40);
  const [loanApr, setLoanApr] = useState(8.5);

  const r = useMemo(() => {
    const financed = Math.max(0, price - deposit);
    const balloon = price * (balloonPct / 100);
    const hp = pmt(financed, 0, apr, months);
    const pcp = pmt(financed, balloon, apr, months);
    const loan = pmt(financed, 0, loanApr, months);
    return {
      financed, balloon,
      hp, hpTotal: deposit + hp * months,
      pcp, pcpOwn: deposit + pcp * months + balloon, pcpReturn: deposit + pcp * months,
      loan, loanTotal: deposit + loan * months,
    };
  }, [price, deposit, months, apr, balloonPct, loanApr]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Car Finance' }]}
      title="Car Finance Calculator"
      subtitle="Compare the three ways to finance a car, PCP, Hire Purchase and a personal loan, side by side, so you can see the real monthly cost and the total price of ownership."
      calcLabel="Compare options"
      inputs={
        <>
          <Panel title="The car">
            <div className="space-y-4">
              <Field label="Car price"><MoneyInput value={price} onChange={setPrice} step={500} /></Field>
              <Field label="Deposit"><MoneyInput value={deposit} onChange={setDeposit} step={250} /></Field>
              <Field label={`Term, ${months} months`}><Slider value={months} onChange={setMonths} min={12} max={60} step={6} /></Field>
            </div>
          </Panel>
          <Panel title="Rates & balloon">
            <div className="space-y-4">
              <Field label={`Finance APR (PCP/HP), ${pct(apr, 1)}`}><Slider value={apr} onChange={setApr} min={0} max={20} step={0.1} /></Field>
              <Field label={`PCP final payment (GMFV), ${balloonPct}% of price`} hint="The balloon you pay to own the car"><Slider value={balloonPct} onChange={setBalloonPct} min={20} max={60} /></Field>
              <Field label={`Personal loan APR, ${pct(loanApr, 1)}`}><Slider value={loanApr} onChange={setLoanApr} min={0} max={25} step={0.1} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Stat label="PCP / month" value={gbp(r.pcp, 0)} sub="lowest monthly" tone="dark" />
            <Stat label="HP / month" value={gbp(r.hp, 0)} sub="own at end" tone="accent" />
            <Stat label="Loan / month" value={gbp(r.loan, 0)} sub="own now" />
          </div>
          <Panel title="Full comparison">
            <div className="overflow-x-auto rounded-lg border border-outline-variant">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low text-left">
                  <tr><th className="px-3 py-2 font-bold"></th><th className="px-3 py-2 font-bold text-right">Monthly</th><th className="px-3 py-2 font-bold text-right">Total to own</th><th className="px-3 py-2 font-bold text-right">Own it?</th></tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  <tr><td className="px-3 py-2 font-semibold">PCP</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.pcp, 0)}</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.pcpOwn)}</td><td className="px-3 py-2 text-right text-xs">+ {gbp(r.balloon)} balloon</td></tr>
                  <tr><td className="px-3 py-2 font-semibold">Hire Purchase</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.hp, 0)}</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.hpTotal)}</td><td className="px-3 py-2 text-right text-xs">Yes, at end</td></tr>
                  <tr><td className="px-3 py-2 font-semibold">Personal loan</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.loan, 0)}</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.loanTotal)}</td><td className="px-3 py-2 text-right text-xs">Yes, now</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-on-surface-variant">PCP has the lowest monthly cost but you only own the car if you pay the {gbp(r.balloon)} final payment. Hand it back or part-exchange instead at the end.</p>
          </Panel>
          <Callout tone="info" title="Lowest monthly ≠ cheapest">
            PCP&apos;s low monthly payment is tempting, but to actually own the car you pay the balloon on top, often
            making a personal loan the cheapest route to ownership. Choose based on whether you want to own or keep
            changing cars.
          </Callout>
        </>
      }
    >
      <Guide
        title="Car finance explained: PCP vs HP vs loan"
        intro="Car finance jargon hides big differences in cost and ownership. This guide breaks down PCP, Hire Purchase and personal loans so you can pick the right one and avoid the common traps."
      >
        <GuideSection kicker="Option 1" title="PCP (Personal Contract Purchase)">
          <p>PCP is the most popular new-car finance. You pay a deposit, then low monthly payments that only cover the car&apos;s <strong>depreciation</strong> (plus interest) over the term, not its full value. At the end you choose: pay the large <strong>balloon payment</strong> (the &quot;Guaranteed Minimum Future Value&quot;) to own it, hand it back, or part-exchange into a new deal. Low monthlies suit people who like changing cars every few years, but mileage limits apply and you don&apos;t own the car unless you pay the balloon.</p>
        </GuideSection>
        <GuideSection kicker="Option 2" title="Hire Purchase (HP)">
          <p>HP spreads the <strong>whole</strong> price (after deposit) over the term, so monthly payments are higher than PCP, but you <strong>own the car outright</strong> at the end with no balloon. There are no mileage limits. HP suits people who want to keep the car long-term and own it. The car is technically the lender&apos;s until the final payment, so it can be repossessed if you default.</p>
        </GuideSection>
        <GuideSection kicker="Option 3" title="Personal loan">
          <p>A personal loan isn&apos;t car finance at all, you borrow the money, buy the car as a cash buyer, and <strong>own it immediately</strong>. You repay the loan separately. This often has the lowest total cost to own, gives you negotiating power as a cash buyer, and has no mileage limits, but the loan is unsecured against your wider finances and you need to qualify for the full amount.</p>
          <Callout tone="tip" title="Cash-buyer leverage">Buying with a loan makes you a cash buyer at the dealership, which can win a bigger discount, though watch that you don&apos;t lose a finance-linked deposit contribution the dealer might offer.</Callout>
        </GuideSection>
        <GuideSection kicker="Decide" title="Which should you choose?">
          <p>Want the <strong>lowest monthly cost</strong> and to change cars often? PCP. Want to <strong>own the car</strong> and keep it for years at a fixed cost? HP or a personal loan, whichever has the lower APR, a loan is frequently cheapest overall. Always compare the <strong>total cost to own</strong>, not just the monthly figure, and watch PCP mileage and condition charges.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Judging by monthly payment alone', 'PCP looks cheapest monthly but the balloon makes ownership dearer. Compare total cost.'],
            ['Ignoring PCP mileage limits', 'Excess-mileage and damage charges at the end of a PCP can be substantial.'],
            ['Forgetting you don&apos;t own a PCP car', 'Unless you pay the balloon, you hand it back with nothing to show for the payments.'],
            ['Not comparing a personal loan', 'A loan often beats dealer finance on total cost and gives cash-buyer discounts.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is PCP or HP cheaper?', a: 'PCP has lower monthly payments but a large balloon to own the car; HP costs more monthly but you own it at the end with no balloon. To own the car outright, HP or a personal loan is usually cheaper overall.' },
            { q: 'What is the balloon payment?', a: 'On PCP, the optional final lump sum (the Guaranteed Minimum Future Value) you pay if you want to keep the car. Skip it and you hand the car back or part-exchange.' },
            { q: 'Can I pay off car finance early?', a: 'Yes. You can usually settle HP or PCP early and may save interest, though early-settlement charges can apply. Ask for a settlement figure.' },
            { q: 'Does car finance affect my credit score?', a: 'Yes, it&apos;s a credit agreement that appears on your file. Keeping up payments helps your score; missed payments and repossession harm it.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={LOANS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
