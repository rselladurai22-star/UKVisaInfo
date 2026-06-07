'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { LOANS_RELATED } from '../personal-loan-calculator/PersonalLoan';

const fmtYM = (m: number) => {
  if (m >= 1200) return '100y+';
  const y = Math.floor(m / 12); const mm = m % 12;
  return y <= 0 ? `${mm}m` : mm === 0 ? `${y}y` : `${y}y ${mm}m`;
};

function payoff(balance: number, aprPct: number, monthly: number) {
  const i = aprPct / 1200; let bal = balance; let interest = 0; let m = 0;
  while (bal > 0.005 && m < 1200) {
    m++; const intM = bal * i; interest += intM;
    let p = monthly - intM; if (p <= 0) return { months: 1200, interest: Infinity };
    if (p > bal) p = bal; bal -= p;
  }
  return { months: m, interest };
}

export default function DebtConsolidation() {
  const [balance, setBalance] = useState(15000);
  const [curApr, setCurApr] = useState(22);
  const [curMonthly, setCurMonthly] = useState(550);
  const [newApr, setNewApr] = useState(9.9);
  const [newYears, setNewYears] = useState(5);

  const r = useMemo(() => {
    const cur = payoff(balance, curApr, curMonthly);
    const n = Math.max(1, Math.round(newYears * 12));
    const i = newApr / 1200;
    const newMonthly = i === 0 ? balance / n : (balance * i) / (1 - Math.pow(1 + i, -n));
    const newInterest = newMonthly * n - balance;
    const monthlySaving = curMonthly - newMonthly;
    const interestDiff = (isFinite(cur.interest) ? cur.interest : 0) - newInterest;
    return { cur, newMonthly, newInterest, n, monthlySaving, interestDiff };
  }, [balance, curApr, curMonthly, newApr, newYears]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Debt Consolidation' }]}
      title="Debt Consolidation Calculator"
      subtitle="Compare your current debts with a single consolidation loan — the new monthly payment, the total interest, and whether a lower rate or a longer term is really saving you money."
      calcLabel="Compare"
      inputs={
        <>
          <Panel title="Current debts">
            <div className="space-y-4">
              <Field label="Total balance"><MoneyInput value={balance} onChange={setBalance} step={500} /></Field>
              <Field label={`Average APR — ${pct(curApr, 1)}`}><Slider value={curApr} onChange={setCurApr} min={0} max={50} step={0.5} /></Field>
              <Field label="Current total monthly payment"><MoneyInput value={curMonthly} onChange={setCurMonthly} step={25} /></Field>
            </div>
          </Panel>
          <Panel title="Consolidation loan">
            <div className="space-y-4">
              <Field label={`New APR — ${pct(newApr, 1)}`}><Slider value={newApr} onChange={setNewApr} min={0} max={30} step={0.1} /></Field>
              <Field label="New term (years)"><NumberInput value={newYears} onChange={setNewYears} suffix="yrs" /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="New monthly" value={gbp(r.newMonthly, 0)} sub={`was ${gbp(curMonthly, 0)}`} tone="dark" big />
            <Stat label="Monthly change" value={`${r.monthlySaving >= 0 ? '−' : '+'}${gbp(Math.abs(r.monthlySaving), 0)}`} sub={r.monthlySaving >= 0 ? 'lower payment' : 'higher payment'} tone="accent" />
            <Stat label="Interest change" value={`${r.interestDiff >= 0 ? '−' : '+'}${gbp(Math.abs(r.interestDiff))}`} sub={r.interestDiff >= 0 ? 'you save' : 'you pay more'} />
          </div>
          <Panel title="Side by side">
            <div className="overflow-hidden rounded-lg border border-outline-variant">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low text-left"><tr><th className="px-3 py-2 font-bold"></th><th className="px-3 py-2 font-bold text-right">Now</th><th className="px-3 py-2 font-bold text-right">Consolidated</th></tr></thead>
                <tbody className="divide-y divide-outline-variant/60">
                  <tr><td className="px-3 py-2 text-on-surface-variant">Monthly payment</td><td className="px-3 py-2 text-right tabular-nums">{gbp(curMonthly, 0)}</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.newMonthly, 0)}</td></tr>
                  <tr><td className="px-3 py-2 text-on-surface-variant">Time to clear</td><td className="px-3 py-2 text-right tabular-nums">{fmtYM(r.cur.months)}</td><td className="px-3 py-2 text-right tabular-nums">{fmtYM(r.n)}</td></tr>
                  <tr><td className="px-3 py-2 text-on-surface-variant">Total interest</td><td className="px-3 py-2 text-right tabular-nums">{isFinite(r.cur.interest) ? gbp(r.cur.interest) : '—'}</td><td className="px-3 py-2 text-right tabular-nums">{gbp(r.newInterest)}</td></tr>
                </tbody>
              </table>
            </div>
          </Panel>
          <Callout tone={r.interestDiff >= 0 ? 'tip' : 'warn'} title={r.interestDiff >= 0 ? 'Consolidation looks cheaper here' : 'Lower monthly, but more interest'}>
            {r.interestDiff >= 0
              ? 'A lower rate and/or shorter term reduces both the monthly payment and the total interest. Check there are no large arrangement fees.'
              : 'The new payment is lower, but stretching the debt over a longer term means more total interest. Use the shortest term you can afford.'}
          </Callout>
        </>
      }
    >
      <Guide
        title="Is debt consolidation worth it?"
        intro="Consolidating several debts into one loan can simplify your finances and cut the rate — or quietly cost you more over a longer term. This guide explains when it helps and the traps to avoid."
      >
        <GuideSection kicker="The idea" title="What consolidation does">
          <p>Debt consolidation replaces several debts — credit cards, store cards, overdrafts, loans — with a <strong>single loan and one monthly payment</strong>. The aim is usually a lower interest rate, a fixed end date and simpler admin. It works best when you&apos;re paying high card APRs and can move to a meaningfully lower personal-loan rate, while keeping the term as short as you can afford.</p>
        </GuideSection>
        <GuideSection kicker="The catch" title="Lower payment isn't always cheaper">
          <p>The biggest trap is judging consolidation by the monthly payment. Spreading the same debt over a longer term lowers the monthly cost but can <strong>increase the total interest</strong> — you pay less each month for many more months. Always compare the <strong>total interest</strong> and the payoff date, not just the monthly figure. The calculator shows both.</p>
          <Callout tone="warn" title="Don't free up cards and re-spend">Consolidating credit cards can leave them empty — and tempting. Running the balances back up while repaying the loan doubles your debt. Consider closing or locking the cleared cards.</Callout>
        </GuideSection>
        <GuideSection kicker="Risk" title="Secured vs unsecured consolidation">
          <p>Unsecured consolidation loans don&apos;t risk your home but need a reasonable credit profile. <strong>Secured</strong> consolidation (a homeowner loan or remortgage) can offer a lower rate and larger sums, but turns unsecured debt into debt secured on your home — which can be repossessed if you don&apos;t pay, and stretching it over 25 years can cost far more. Treat secured consolidation with caution.</p>
        </GuideSection>
        <GuideSection kicker="Alternatives" title="When not to consolidate">
          <p>If your debts are on credit cards, a <strong>0% balance transfer</strong> may be cheaper than a loan. If you&apos;re struggling to keep up at all, free debt advice (StepChange, National Debtline, Citizens Advice) and solutions like a Debt Management Plan may suit better than new borrowing. Consolidation is a tool for reorganising affordable debt, not a rescue for unaffordable debt.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Focusing on the monthly payment', 'A longer term lowers the payment but can raise total interest. Compare total cost.'],
            ['Re-spending on cleared cards', 'Consolidation only works if you don&apos;t rebuild the old balances.'],
            ['Securing debt on your home needlessly', 'It risks your home and often costs more over a long term.'],
            ['Ignoring arrangement fees', 'Some consolidation loans carry fees that erode the saving — check the APR.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Does consolidation save money?', a: 'It can, if the new rate is lower and you keep the term short. Over a longer term you may pay less monthly but more in total interest — always compare the total cost.' },
            { q: 'Will it affect my credit score?', a: 'A new loan involves a credit check and a new account, which dips your score short-term. Clearing cards and making consistent payments helps it recover and improve.' },
            { q: 'Is a balance transfer better?', a: 'For credit-card debt, a 0% balance transfer is often cheaper than a consolidation loan. For mixed debts or larger sums, a loan may be simpler.' },
            { q: 'Should I consolidate if I&apos;m struggling to pay?', a: 'If debts are unaffordable, seek free debt advice first (StepChange, Citizens Advice). Consolidation suits reorganising affordable debt, not rescuing unaffordable debt.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={LOANS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
