'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Choice, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, incomeTax, class4NI, studentLoan, type StudentPlan } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const VIOLET = '#7c3aed';
const GREEN = '#0a7d4f';

export default function SelfEmployed() {
  const [profit, setProfit] = useState(45000);
  const [plan, setPlan] = useState<StudentPlan>('none');

  const r = useMemo(() => {
    const tax = incomeTax(profit);
    const ni = class4NI(profit);
    const sl = studentLoan(profit, plan);
    const totalTax = tax + ni + sl;
    const net = Math.max(0, profit - totalTax);
    const saTax = tax + ni; // amount payments-on-account are based on
    const poa = saTax > 1000 ? saTax / 2 : 0;
    const effRate = profit > 0 ? (totalTax / profit) * 100 : 0;
    return { tax, ni, sl, totalTax, net, poa, effRate };
  }, [profit, plan]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Self-Employed Tax' }]}
      title="Self-Employed Tax Calculator"
      subtitle="Estimate your Self Assessment bill from your annual profit — Income Tax plus Class 4 National Insurance — and see your payments on account, on 2025/26 rates."
      calcLabel="Estimate my tax"
      inputs={
        <Panel title="Your business">
          <div className="space-y-4">
            <Field label="Annual profit" hint="Income after allowable expenses"><MoneyInput value={profit} onChange={setProfit} step={1000} /></Field>
            <Field label="Student loan plan">
              <Choice<StudentPlan> name="plan" value={plan} onChange={setPlan} options={[
                { value: 'none', label: 'None' }, { value: 'plan2', label: 'Plan 2' }, { value: 'plan1', label: 'Plan 1' }, { value: 'plan5', label: 'Plan 5' },
              ]} />
            </Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Total tax due" value={gbp(r.totalTax)} sub={`${pct(r.effRate)} of profit`} tone="dark" big />
            <Stat label="Take-home" value={gbp(r.net)} sub="after tax + NI" tone="accent" />
            <Stat label="Payment on account" value={gbp(r.poa)} sub="each (Jan & Jul)" />
          </div>
          <Panel title="Your Self Assessment bill">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Profit" centerValue={gbp(profit)} segments={[
                { value: r.net, color: GREEN, label: 'Kept' },
                { value: r.tax, color: PRIMARY, label: 'Income Tax' },
                { value: r.ni, color: ACCENT, label: 'Class 4 NI' },
                { value: r.sl, color: VIOLET, label: 'Student loan' },
              ]} />
              <div className="flex-1 space-y-2 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Income Tax</span><span className="font-semibold tabular-nums">{gbp(r.tax)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Class 4 NI</span><span className="font-semibold tabular-nums">{gbp(r.ni)}</span></div>
                {r.sl > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Student loan</span><span className="font-semibold tabular-nums">{gbp(r.sl)}</span></div>}
                <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant">Take-home</span><span className="font-bold tabular-nums text-secondary">{gbp(r.net)}</span></div>
              </div>
            </div>
          </Panel>
          <Callout tone="warn" title="Budget for payments on account">
            If your bill is over £1,000, HMRC asks for <strong>payments on account</strong>: by 31 January you pay
            this year&apos;s tax <em>plus</em> 50% towards next year, and another 50% by 31 July. The first year can
            feel like 150% of the bill — set money aside.
          </Callout>
          <p className="text-[11px] text-on-surface-variant">Estimate on 2025/26 rates. Class 2 NI is now voluntary for most. Excludes other income, the trading allowance and VAT. Verify with an accountant or HMRC.</p>
        </>
      }
    >
      <Guide
        title="Self Assessment tax for the self-employed"
        intro="If you're a sole trader, you pay Income Tax and Class 4 National Insurance on your profit through Self Assessment. This guide explains the bill, the deadlines, and how to keep it down."
      >
        <GuideSection kicker="The basics" title="What you pay tax on">
          <p>As a sole trader you&apos;re taxed on your <strong>profit</strong> — income minus allowable business expenses — not your turnover. The same personal allowance and Income Tax bands apply as for employees (£12,570 tax-free, then 20%, 40%, 45%). On top you pay <strong>Class 4 National Insurance</strong> at 6% on profits between £12,570 and £50,270, and 2% above. Class 2 NI is now voluntary for most, though paying it can protect your State Pension if profits are low.</p>
        </GuideSection>
        <GuideSection kicker="Expenses" title="Cut the bill with allowable expenses">
          <p>You only pay tax on profit, so claiming every legitimate expense directly reduces it. Common ones include stock and materials, a proportion of home and phone costs, travel, equipment (via capital allowances or the Annual Investment Allowance), professional fees and software. If your turnover is under £1,000 you may use the <strong>trading allowance</strong> instead of expenses. Keep records — HMRC can ask for evidence.</p>
        </GuideSection>
        <GuideSection kicker="Payments on account" title="Why the first bill is a shock">
          <p>If your Self Assessment bill exceeds £1,000, HMRC collects <strong>payments on account</strong> towards the next year. By 31 January you pay the full bill plus 50% in advance, and a further 50% by 31 July. So your first January can be around 150% of the actual tax — budgeting roughly 30% of profit as you earn it avoids a nasty surprise.</p>
          <Callout tone="tip" title="Save as you earn">Move ~25–30% of every payment you receive into a separate tax pot. Come January you&apos;ll have the money ready and avoid borrowing to pay HMRC.</Callout>
        </GuideSection>
        <GuideSection kicker="Deadlines" title="Key Self Assessment dates">
          <p>Register by <strong>5 October</strong> after the tax year you started. File online and pay by <strong>31 January</strong>; the second payment on account is due <strong>31 July</strong>. Missing the filing deadline triggers an automatic £100 penalty, with more added over time, plus interest on late tax. Making Tax Digital for Income Tax is also being phased in for higher-income sole traders.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Not setting tax aside', 'Spending gross income leaves you short in January. Save ~30% as you go.'],
            ['Forgetting payments on account', 'The first bill includes 50% towards next year — budget for ~150%.'],
            ['Missing allowable expenses', 'Every unclaimed expense is profit you pay tax on. Track them all year.'],
            ['Filing late', 'A £100 penalty applies immediately, even if no tax is due. File on time.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much tax does a sole trader pay?', a: 'Income Tax at 20/40/45% on profit above the £12,570 allowance, plus Class 4 NI at 6% (£12,570–£50,270) and 2% above. The calculator estimates the total.' },
            { q: 'Do I still pay Class 2 NI?', a: 'For most it&apos;s now voluntary. Paying it can protect your State Pension and benefit entitlement if your profits are low — worth considering.' },
            { q: 'What are payments on account?', a: 'Advance payments towards next year&apos;s tax, due if your bill is over £1,000. You pay 50% with your January bill and 50% by 31 July.' },
            { q: 'Should I go limited instead?', a: 'A limited company can be more tax-efficient at higher profits via salary and dividends, but adds admin and cost. Compare with the dividend and contractor tools, and take advice.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
