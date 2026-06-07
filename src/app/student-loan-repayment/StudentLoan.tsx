'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, Choice, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, studentLoan, SL_THRESHOLD, type StudentPlan } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

type Plan = Exclude<StudentPlan, 'none' | 'pg'>;
const WRITEOFF: Record<Plan, number> = { plan1: 25, plan2: 30, plan4: 30, plan5: 40 };
const PLAN_LABEL: Record<Plan, string> = { plan1: 'Plan 1 (pre-2012)', plan2: 'Plan 2 (2012–2023)', plan4: 'Plan 4 (Scotland)', plan5: 'Plan 5 (2023+)' };

export default function StudentLoan() {
  const [salary, setSalary] = useState(32000);
  const [plan, setPlan] = useState<Plan>('plan2');
  const [pg, setPg] = useState(false);
  const [balance, setBalance] = useState(45000);
  const [interest, setInterest] = useState(7);

  const r = useMemo(() => {
    const planRep = studentLoan(salary, plan);
    const pgRep = pg ? studentLoan(salary, 'pg') : 0;
    const annual = planRep + pgRep;

    // payoff estimate on the main plan balance (salary held flat)
    let bal = balance, y = 0, cleared = 0;
    const wo = WRITEOFF[plan];
    while (bal > 0 && y < wo) {
      y++;
      bal = bal * (1 + interest / 100) - planRep;
      if (bal <= 0) { cleared = y; break; }
    }
    const writtenOff = cleared === 0;
    return { planRep, pgRep, annual, cleared, writtenOff, wo, threshold: SL_THRESHOLD[plan] };
  }, [salary, plan, pg, balance, interest]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Student Loan' }]}
      title="Student Loan Repayment Calculator"
      subtitle="See your annual and monthly student loan repayments by plan, and estimate whether you'll clear the balance or have it written off — on 2025/26 thresholds."
      calcLabel="Calculate repayments"
      inputs={
        <>
          <Panel title="Your income & plan">
            <div className="space-y-4">
              <Field label="Annual salary"><MoneyInput value={salary} onChange={setSalary} step={1000} /></Field>
              <Field label="Repayment plan">
                <Choice<Plan> name="plan" value={plan} onChange={setPlan} options={(Object.keys(WRITEOFF) as Plan[]).map((k) => ({ value: k, label: PLAN_LABEL[k] }))} />
              </Field>
              <Toggle checked={pg} onChange={setPg} label="Also repaying a Postgraduate Loan (6%)" />
            </div>
          </Panel>
          <Panel title="Balance & interest (optional)">
            <div className="space-y-4">
              <Field label="Current balance"><MoneyInput value={balance} onChange={setBalance} step={1000} /></Field>
              <Field label={`Interest rate — ${pct(interest, 1)}`}><Slider value={interest} onChange={setInterest} min={0} max={9} step={0.1} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Repayment / year" value={gbp(r.annual)} sub={`9% over ${gbp(r.threshold)}`} tone="dark" big />
            <Stat label="Per month" value={gbp(r.annual / 12, 0)} sub="deducted via PAYE" tone="accent" />
            <Stat label="Outcome" value={r.writtenOff ? `Written off (${r.wo}y)` : `Clear in ${r.cleared}y`} sub={r.writtenOff ? 'never fully repaid' : 'at this salary'} />
          </div>
          <Panel title="Repayment by plan (at this salary)">
            <div className="space-y-2 text-sm">
              {(Object.keys(WRITEOFF) as Plan[]).map((p) => (
                <div key={p} className="flex justify-between"><span className="text-on-surface-variant">{PLAN_LABEL[p]}</span><span className="font-semibold tabular-nums">{gbp(studentLoan(salary, p))}/yr</span></div>
              ))}
              {pg && <div className="flex justify-between"><span className="text-on-surface-variant">Postgraduate Loan</span><span className="font-semibold tabular-nums">{gbp(studentLoan(salary, 'pg'))}/yr</span></div>}
            </div>
          </Panel>
          <Callout tone="info" title="It's repaid like a tax, not a debt">
            Repayments are 9% (6% postgraduate) of income above the threshold — regardless of the balance — and stop
            when you earn under it. Anything left after the write-off period is cancelled, so many borrowers never
            repay it in full.
          </Callout>
        </>
      }
    >
      <Guide
        title="How student loan repayments work"
        intro="UK student loans behave more like a graduate tax than a normal debt. This guide explains the plans, thresholds, interest and the write-off — and why overpaying often doesn't pay."
      >
        <GuideSection kicker="The basics" title="9% above a threshold">
          <p>You repay <strong>9%</strong> of everything you earn above your plan&apos;s threshold (6% for postgraduate loans, payable on top). It&apos;s collected automatically through PAYE or Self Assessment. If your income drops below the threshold, repayments stop. The balance and interest are largely irrelevant to what you pay each month — only your income matters, which is why it feels like a tax.</p>
        </GuideSection>
        <GuideSection kicker="The plans" title="Which plan are you on?">
          <p>Your plan depends on when and where you studied. Thresholds for 2025/26 are roughly: <strong>Plan 1</strong> £26,065, <strong>Plan 2</strong> (English/Welsh students 2012–2023) £28,470, <strong>Plan 4</strong> (Scotland) £32,745, and <strong>Plan 5</strong> (from 2023) £25,000. Postgraduate loans repay at 6% above £21,000. If you have both an undergraduate and postgraduate loan, you pay both simultaneously.</p>
        </GuideSection>
        <GuideSection kicker="Write-off" title="When the loan is cancelled">
          <p>Any remaining balance is written off after a set period: <strong>Plan 2</strong> 30 years after you became eligible to repay, <strong>Plan 5</strong> 40 years, <strong>Plan 1</strong> around 25 years (or age 65 for older loans), and Postgraduate 30 years. Many borrowers — especially lower and middle earners — never repay the full amount before it&apos;s cancelled, which changes the maths on overpaying.</p>
          <Callout tone="warn" title="Overpaying often doesn't pay">If you&apos;re likely to have the loan written off before clearing it, voluntary overpayments are wasted — you&apos;d simply pay more than you otherwise would. Only high earners who&apos;ll clear it early tend to benefit from overpaying.</Callout>
        </GuideSection>
        <GuideSection kicker="Interest" title="How interest is set">
          <p>Interest varies by plan and is linked to RPI inflation (Plan 2 historically RPI plus up to 3% depending on income; Plan 1, 4 and 5 at lower rates). High interest can make the balance grow faster than repayments for some borrowers — but because of the write-off, that often doesn&apos;t increase what you actually pay. Focus on your repayment (income-driven), not the headline balance.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Overpaying when you&apos;ll be written off', 'Most borrowers shouldn&apos;t overpay — it just costs more than the automatic deductions.'],
            ['Worrying about the balance', 'What you pay depends on income, not balance. The balance only matters if you&apos;ll clear it early.'],
            ['Forgetting it stops below the threshold', 'Repayments pause automatically if your income falls below the plan threshold.'],
            ['Not checking your plan', 'Paying on the wrong plan threshold can over- or under-deduct. Confirm your plan with the SLC.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much do I repay?', a: '9% of income above your plan threshold (6% for postgraduate loans). The balance doesn&apos;t change your monthly repayment.' },
            { q: 'When is my student loan written off?', a: 'Plan 2 after 30 years, Plan 5 after 40 years, Plan 1 around 25 years, Postgraduate after 30 years. Anything left is cancelled.' },
            { q: 'Should I pay it off early?', a: 'Usually only if you&apos;re a high earner who will clear it well before the write-off. Otherwise overpaying typically wastes money.' },
            { q: 'Does it affect my credit score or mortgage?', a: 'It&apos;s not on your credit file, but lenders see the repayment reducing your take-home, which can slightly affect mortgage affordability.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
