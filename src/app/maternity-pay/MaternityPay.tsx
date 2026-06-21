'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';
import { calculateMaternity, SMP_STATUTORY_RATE, LEL_WEEKLY, type PayType } from '../../lib/maternity/calc';

const RELATED = [
  { href: '/sick-pay', label: 'Statutory Sick Pay', hint: 'SSP £118.75/week' },
  { href: '/redundancy-pay', label: 'Redundancy Pay', hint: 'Statutory entitlement' },
  { href: '/childcare-calculator', label: 'Childcare Costs', hint: 'Free hours + Tax-Free Childcare' },
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
];

export default function MaternityPay() {
  const [type, setType] = useState<PayType>('maternity');
  const [awe, setAwe] = useState(550);
  const [paternityWeeks, setPaternityWeeks] = useState<1 | 2>(2);

  const r = useMemo(
    () => calculateMaternity({ type, averageWeeklyEarnings: awe, paternityWeeks }),
    [type, awe, paternityWeeks],
  );

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Employment', href: '/category/employment' }, { label: 'Maternity & Paternity Pay' }]}
      title="Maternity & Paternity Pay Calculator"
      subtitle="Estimate Statutory Maternity Pay (SMP) or Statutory Paternity Pay (SPP) for 2025/26 to 90% of pay then £187.18 a week."
      calcLabel="Calculate Statutory Pay"
      inputs={
        <Panel title="Your Details">
          <div className="space-y-4">
            <Field label="Type of pay">
              <Choice<PayType>
                name="type"
                value={type}
                onChange={setType}
                options={[
                  { value: 'maternity', label: 'Maternity (SMP)', desc: 'Up to 39 weeks paid' },
                  { value: 'paternity', label: 'Paternity (SPP)', desc: 'Up to 2 weeks paid' },
                ]}
              />
            </Field>
            <Field label="Average weekly earnings" hint={`Must be at least £${LEL_WEEKLY}/week to qualify`}><MoneyInput value={awe} onChange={setAwe} step={25} /></Field>
            {type === 'paternity' && (
              <Field label="Paternity weeks">
                <Choice<'1' | '2'>
                  name="patWeeks"
                  value={String(paternityWeeks) as '1' | '2'}
                  onChange={(v) => setPaternityWeeks(v === '1' ? 1 : 2)}
                  options={[
                    { value: '1', label: '1 week', desc: 'One week of leave' },
                    { value: '2', label: '2 weeks', desc: 'Full entitlement' },
                  ]}
                />
              </Field>
            )}
          </div>
        </Panel>
      }
      results={
        r.eligible ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Total Statutory Pay" value={gbp(r.totalGross)} sub={`Over ${r.totalWeeks} weeks`} tone="dark" big />
              <Stat label="Average Weekly Earnings" value={gbp(r.awe)} sub="Your qualifying pay" tone="primary" />
              <Stat label="Statutory Rate" value={gbp(SMP_STATUTORY_RATE)} sub="Standard weekly rate" tone="accent" />
              <Stat label="Weeks Paid" value={String(r.totalWeeks)} sub={type === 'maternity' ? 'Of 52 weeks leave' : 'Paternity weeks'} />
            </div>

            <Panel title="Phase breakdown">
              <div className="space-y-2 text-sm w-full">
                {r.phases.map((p) => (
                  <div key={p.label} className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">{p.label} ({p.weeks} wk × {gbp(p.weeklyRate)})</span>
                    <span className="font-semibold tabular-nums">{gbp(p.total)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Total</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.totalGross)}</span></div>
              </div>
            </Panel>

            <Callout tone="info" title="This is gross pay">
              Statutory maternity and paternity pay is taxable and subject to National Insurance like normal wages, so your take-home will be lower.
            </Callout>
          </>
        ) : (
          <Callout tone="warn" title="Not eligible for statutory pay">
            {r.reason}
          </Callout>
        )
      }
    >
      <Guide
        title="Maternity and paternity pay explained (2025/26)"
        intro="New parents in employment may be entitled to Statutory Maternity Pay (SMP) or Statutory Paternity Pay (SPP). The amounts and durations differ a lot. Here's how each is calculated for 2025/26 and what you need to qualify."
      >
        <GuideSection kicker="Maternity" title="How SMP works">
          <p>Statutory Maternity Pay runs for up to <strong>39 weeks</strong>:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>First 6 weeks:</strong> 90% of your average weekly earnings.</li>
            <li><strong>Next 33 weeks:</strong> the lower of £{SMP_STATUTORY_RATE.toFixed(2)} or 90% of your average weekly earnings.</li>
          </ul>
          <p>You can take up to 52 weeks of maternity leave in total; the final 13 weeks are usually unpaid.</p>
        </GuideSection>

        <GuideSection kicker="Paternity" title="How SPP works">
          <p>Statutory Paternity Pay covers up to <strong>2 weeks</strong>, paid at the lower of £{SMP_STATUTORY_RATE.toFixed(2)} or 90% of average weekly earnings. Since April 2024 the two weeks can be taken as two separate single weeks at any point within 52 weeks of the birth, with shorter notice.</p>
        </GuideSection>

        <GuideSection kicker="Eligibility" title="What you need to qualify">
          <p>For both SMP and SPP you must:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Earn at least <strong>£{LEL_WEEKLY}</strong> a week on average (the Lower Earnings Limit).</li>
            <li>Have <strong>26 weeks' continuous service</strong> by the qualifying week (the 15th week before the due date).</li>
            <li>Give the correct notice and, for SMP, provide a MATB1 certificate.</li>
          </ul>
          <Callout tone="tip" title="Maternity Allowance is a backup">
            If you don't qualify for SMP, for example you're self-employed or recently changed jobs, you may still get Maternity Allowance from the DWP, worth up to £{SMP_STATUTORY_RATE.toFixed(2)} a week.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="SMP on £550 a week">
          <p>On average weekly earnings of £550, the first six weeks pay 90% = £495 a week (£2,970). The next 33 weeks pay the lower of £{SMP_STATUTORY_RATE.toFixed(2)} or £495, i.e. £{SMP_STATUTORY_RATE.toFixed(2)} a week (about £{(SMP_STATUTORY_RATE * 33).toFixed(2)}). Total SMP over 39 weeks is roughly £{(495 * 6 + SMP_STATUTORY_RATE * 33).toFixed(2)} gross.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common statutory pay mistakes">
          <Mistakes items={[
            ['Thinking SMP is tax-free', 'It is taxable and subject to NI like normal pay, so budget for a lower net figure.'],
            ['Missing the qualifying week', 'Continuous service is tested at the 15th week before the due date, late starters can miss out.'],
            ['Overlooking enhanced schemes', 'Many employers top up SMP with occupational maternity pay; check your contract.'],
            ['Forgetting shared parental leave', 'Parents can convert most maternity leave into shared parental leave, splitting it between them.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How long is maternity pay?', a: 'SMP is paid for up to 39 weeks: six weeks at 90% of pay, then 33 weeks at the lower of £' + SMP_STATUTORY_RATE.toFixed(2) + ' or 90% of pay.' },
            { q: 'Can fathers get more than two weeks?', a: 'Statutory Paternity Pay is two weeks, but parents can use Shared Parental Leave to share up to 50 weeks of leave and 37 weeks of pay.' },
            { q: 'Is statutory pay taxed?', a: 'Yes. SMP and SPP are treated as earnings, so income tax and National Insurance are deducted.' },
            { q: 'What if I do not qualify for SMP?', a: 'You may be able to claim Maternity Allowance from the DWP instead, especially if you are self-employed or recently changed employer.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
