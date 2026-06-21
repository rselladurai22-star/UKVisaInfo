'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, incomeTax, employeeNI } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

export default function PayslipAuditor() {
  const [salary, setSalary] = useState(35000);
  const [code, setCode] = useState('1257L');
  const [actualTax, setActualTax] = useState(330);
  const [actualNI, setActualNI] = useState(180);

  const r = useMemo(() => {
    const expTax = incomeTax(salary) / 12;
    const expNI = employeeNI(salary) / 12;
    const taxDiff = actualTax - expTax;
    const niDiff = actualNI - expNI;
    const num = parseInt(code, 10);
    const codeAllowance = Number.isFinite(num) ? num * 10 : null;
    const standardCode = code.toUpperCase().replace(/\s/g, '') === '1257L';
    const tol = 25; // tolerance £/month
    const taxOk = Math.abs(taxDiff) <= tol;
    const niOk = Math.abs(niDiff) <= tol;
    return { expTax, expNI, taxDiff, niDiff, codeAllowance, standardCode, taxOk, niOk };
  }, [salary, code, actualTax, actualNI]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Payslip Auditor' }]}
      title="Payslip Auditor"
      subtitle="Check your monthly payslip against what the tax should be. Spot an over-deduction, a wrong tax code or an HMRC error before it costs you, on 2025/26 rates."
      calcLabel="Audit my payslip"
      inputs={
        <>
          <Panel title="Your job">
            <div className="space-y-4">
              <Field label="Gross annual salary"><MoneyInput value={salary} onChange={setSalary} step={1000} /></Field>
              <Field label="Tax code (from your payslip)">
                <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm font-semibold uppercase focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </Field>
            </div>
          </Panel>
          <Panel title="This month's deductions">
            <div className="space-y-4">
              <Field label="Income Tax deducted"><MoneyInput value={actualTax} onChange={setActualTax} step={10} /></Field>
              <Field label="National Insurance deducted"><MoneyInput value={actualNI} onChange={setActualNI} step={10} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Expected tax / month" value={gbp(r.expTax, 0)} sub={`you paid ${gbp(actualTax, 0)}`} tone={r.taxOk ? 'primary' : 'accent'} />
            <Stat label="Expected NI / month" value={gbp(r.expNI, 0)} sub={`you paid ${gbp(actualNI, 0)}`} tone={r.niOk ? 'primary' : 'accent'} />
          </div>
          <Panel title="Audit result">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">Income Tax</span><span className={r.taxOk ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{r.taxOk ? 'Looks right' : r.taxDiff > 0 ? `Over by ${gbp(r.taxDiff, 0)}/mo` : `Under by ${gbp(-r.taxDiff, 0)}/mo`}</span></li>
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">National Insurance</span><span className={r.niOk ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{r.niOk ? 'Looks right' : r.niDiff > 0 ? `Over by ${gbp(r.niDiff, 0)}/mo` : `Under by ${gbp(-r.niDiff, 0)}/mo`}</span></li>
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">Tax code</span><span className={r.standardCode ? 'text-green-700 font-bold' : 'text-amber-600 font-bold'}>{r.standardCode ? 'Standard (1257L)' : `Non-standard${r.codeAllowance != null ? ` · £${r.codeAllowance.toLocaleString()} allowance` : ''}`}</span></li>
            </ul>
          </Panel>
          <Callout tone={r.taxOk && r.niOk ? 'tip' : 'warn'} title={r.taxOk && r.niOk ? 'Your payslip looks about right' : 'Possible discrepancy'}>
            {r.taxOk && r.niOk
              ? 'Tax and NI are close to expected. Small differences are normal early in the tax year as PAYE catches up.'
              : 'There&apos;s a gap between expected and actual. A wrong tax code, recent pay change or emergency tax can cause it, check your code with HMRC; over-paid tax is usually refunded automatically.'}
          </Callout>
          <p className="text-[11px] text-on-surface-variant">Estimate on 2025/26 rUK rates assuming a steady monthly salary. PAYE is cumulative, so a single month can differ; benefits-in-kind, pensions and Scottish rates also change the figures.</p>
        </>
      }
    >
      <Guide
        title="How to check your payslip"
        intro="Payroll errors and wrong tax codes are common and can quietly cost you for months. This guide shows how to read a payslip, spot mistakes, and get money back."
      >
        <GuideSection kicker="The basics" title="What's on a payslip">
          <p>A payslip shows your <strong>gross pay</strong>, then deductions: <strong>Income Tax (PAYE)</strong>, <strong>National Insurance</strong>, pension and any student loan, leaving your <strong>net pay</strong>. It also shows your <strong>tax code</strong> and often year-to-date totals. Checking these each month takes seconds and catches errors early, while they&apos;re easy to fix.</p>
        </GuideSection>
        <GuideSection kicker="The key clue" title="Your tax code">
          <p>The standard 2025/26 code is <strong>1257L</strong>, meaning a £12,570 tax-free allowance. The number is your allowance ÷ 10; the letter reflects your situation. Watch for emergency codes like <strong>W1, M1 or X</strong> (which tax each period in isolation and often over-deduct), <strong>BR</strong> (all income taxed at basic rate, common on a second job), or <strong>0T</strong>/<strong>K</strong> codes. A wrong code is the single most common reason for paying too much or too little.</p>
          <Callout tone="warn" title="Emergency tax">Starting a new job without a P45, or having multiple incomes, can trigger emergency tax. It usually corrects once HMRC has the right details, and over-paid tax is refunded through your pay.</Callout>
        </GuideSection>
        <GuideSection kicker="Why PAYE wobbles" title="Cumulative tax">
          <p>PAYE is normally <strong>cumulative</strong>: it spreads your allowance and bands evenly across the year and self-corrects each payday. So a single odd month (a bonus, a pay rise, a new job) can look wrong but balance out. An emergency (non-cumulative) code doesn&apos;t do this, which is why it often over-taxes until corrected.</p>
        </GuideSection>
        <GuideSection kicker="Get it back" title="Fixing errors and reclaiming tax">
          <p>If you&apos;ve overpaid, HMRC usually refunds it automatically through your pay once your code is corrected, or after the tax year via a P800. To fix a wrong code, contact HMRC or update your details in your Personal Tax Account. You can reclaim overpaid tax for up to <strong>four previous years</strong>. Keep your payslips and P60s as evidence.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Never checking the tax code', 'A wrong code can over-tax you for months. Check it against 1257L and your circumstances.'],
            ['Ignoring emergency tax', 'W1/M1/X codes over-deduct. Get your code corrected to recover it sooner.'],
            ['Not claiming a refund', 'Overpaid tax can be reclaimed for up to four years, don&apos;t leave it.'],
            ['Assuming a second-job BR code is wrong', 'BR is normal for a second job, but check your allowance is applied to your main job.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What should my tax code be?', a: 'Most people on a single job with the full allowance have 1257L for 2025/26. Different codes apply for multiple jobs, benefits-in-kind or adjustments, check yours matches your situation.' },
            { q: 'Why is my tax higher some months?', a: 'A bonus, pay rise or emergency code can raise a month&apos;s tax. Cumulative PAYE usually evens it out; an emergency code may need correcting.' },
            { q: 'How do I get overpaid tax back?', a: 'Usually automatically once your code is fixed, or via a P800 after year-end. You can reclaim for up to four previous tax years.' },
            { q: 'Is this an official check?', a: 'No, it&apos;s an estimate to flag possible discrepancies. For a definitive answer, check your Personal Tax Account or contact HMRC.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
