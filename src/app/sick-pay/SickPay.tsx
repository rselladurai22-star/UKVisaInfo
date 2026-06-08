'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';
import { calculateSSP, SSP_WEEKLY, LEL_WEEKLY, WAITING_DAYS, MAX_WEEKS } from '../../lib/ssp/calc';

const RELATED = [
  { href: '/maternity-pay', label: 'Maternity & Paternity', hint: 'SMP/SPP statutory pay' },
  { href: '/redundancy-pay', label: 'Redundancy Pay', hint: 'Statutory entitlement' },
  { href: '/holiday-pay', label: 'Holiday Pay', hint: '5.6 weeks entitlement' },
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
];

export default function SickPay() {
  const [awe, setAwe] = useState(400);
  const [qdpw, setQdpw] = useState(5);
  const [sickDays, setSickDays] = useState(21);

  const r = useMemo(
    () => calculateSSP({ averageWeeklyEarnings: awe, qualifyingDaysPerWeek: qdpw, sickDays }),
    [awe, qdpw, sickDays],
  );

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Employment', href: '/category/employment' }, { label: 'Statutory Sick Pay' }]}
      title="Statutory Sick Pay Calculator"
      subtitle="Work out your Statutory Sick Pay (SSP) for 2025/26 — £118.75 a week after three waiting days, for up to 28 weeks."
      calcLabel="Calculate Sick Pay"
      inputs={
        <Panel title="Your Sickness">
          <div className="space-y-4">
            <Field label="Average weekly earnings" hint={`Must be at least £${LEL_WEEKLY}/week to qualify`}><MoneyInput value={awe} onChange={setAwe} step={25} /></Field>
            <Field label="Qualifying (working) days per week"><NumberInput value={qdpw} onChange={setQdpw} min={1} step={1} suffix=" days" /></Field>
            <Field label="Total continuous sick days"><NumberInput value={sickDays} onChange={setSickDays} min={0} step={1} suffix=" days" /></Field>
          </div>
        </Panel>
      }
      results={
        r.eligible ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Total SSP" value={gbp(r.total)} sub={`${r.weeksPaid.toFixed(1)} weeks paid`} tone="dark" big />
              <Stat label="Weekly Rate" value={gbp(r.weeklyRate)} sub="Standard SSP" tone="primary" />
              <Stat label="Daily Rate" value={gbp(r.dailyRate)} sub={`${qdpw} working days/week`} tone="accent" />
              <Stat label="Paid Days" value={String(r.paidDays)} sub={`After ${r.waitingDays} waiting days`} />
            </div>

            <Panel title="How it's worked out">
              <div className="space-y-2 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Waiting days (unpaid)</span><span className="font-semibold tabular-nums">{r.waitingDays}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Paid qualifying days</span><span className="font-semibold tabular-nums">{r.paidDays}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Daily rate</span><span className="font-semibold tabular-nums">{gbp(r.dailyRate)}</span></div>
                <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Total SSP</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.total)}</span></div>
              </div>
            </Panel>

            {r.cappedDays > 0 && (
              <Callout tone="warn" title="Reached the 28-week limit">
                SSP is capped at {MAX_WEEKS} weeks. Beyond that you may move onto Employment and Support Allowance (ESA) or other support.
              </Callout>
            )}
          </>
        ) : (
          <Callout tone="warn" title="Not eligible for SSP">
            {r.reason}
          </Callout>
        )
      }
    >
      <Guide
        title="Statutory Sick Pay explained (2025/26)"
        intro="If you're too ill to work, your employer must pay Statutory Sick Pay (SSP) provided you meet the earnings test. It's a flat weekly rate, doesn't start until the fourth day of sickness, and lasts up to 28 weeks. Here's how it works."
      >
        <GuideSection kicker="The basics" title="Rate, waiting days and limit">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Rate:</strong> £{SSP_WEEKLY.toFixed(2)} a week from 6 April 2025.</li>
            <li><strong>Waiting days:</strong> the first {WAITING_DAYS} qualifying days are unpaid — SSP starts on day 4.</li>
            <li><strong>Maximum:</strong> up to {MAX_WEEKS} weeks of SSP for any one period of sickness.</li>
          </ul>
          <p>The daily rate is the weekly rate divided by your number of working ("qualifying") days that week, so it's the same total however your week is split.</p>
        </GuideSection>

        <GuideSection kicker="Eligibility" title="Who qualifies">
          <p>To get SSP you must be classed as an employee, have done some work, be off sick for at least four days in a row (including non-working days), and earn an average of at least <strong>£{LEL_WEEKLY}</strong> a week — the Lower Earnings Limit. You must also tell your employer within their deadline (or seven days if none is set).</p>
        </GuideSection>

        <GuideSection kicker="Linked periods" title="When sickness joins up">
          <p>Two periods of sickness of four or more days that are eight weeks or less apart are "linked" and treated as one. That matters because the three waiting days only apply once across linked periods, and the 28-week limit runs across them.</p>
          <Callout tone="tip" title="Contractual sick pay can be more generous">
            Many employers offer occupational sick pay above SSP — sometimes full pay for a set number of weeks. Check your contract; SSP is only the legal minimum.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Three weeks off, 5-day week">
          <p>An employee earning £400 a week works five days a week and is off sick for 21 continuous calendar days (15 working days). The first three working days are unpaid waiting days, leaving 12 paid days. The daily rate is £{SSP_WEEKLY.toFixed(2)} ÷ 5 = £{(SSP_WEEKLY / 5).toFixed(2)}, so total SSP is about £{(12 * (SSP_WEEKLY / 5)).toFixed(2)}.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common SSP mistakes">
          <Mistakes items={[
            ['Expecting pay from day one', 'The first three qualifying days are waiting days and are not paid.'],
            ['Assuming everyone qualifies', 'You must earn at least the Lower Earnings Limit (£' + LEL_WEEKLY + '/week) on average.'],
            ['Forgetting linked periods', 'Sickness within eight weeks of a previous spell links, affecting waiting days and the 28-week cap.'],
            ['Not reporting in time', 'Tell your employer promptly and follow their sickness-reporting rules to avoid losing pay.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much is SSP in 2025/26?', a: `Statutory Sick Pay is £${SSP_WEEKLY.toFixed(2)} a week from 6 April 2025, paid for up to ${MAX_WEEKS} weeks.` },
            { q: 'Do I get paid for the first days off?', a: 'No. The first three qualifying days are waiting days and unpaid, unless the sickness links to a recent earlier period.' },
            { q: 'Can I get SSP if self-employed?', a: 'No. SSP is only for employees. Self-employed people may claim Employment and Support Allowance (ESA) instead.' },
            { q: 'What happens after 28 weeks?', a: 'SSP ends. Your employer should give you form SSP1 so you can claim ESA or Universal Credit if you are still unable to work.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
