'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const CA_WEEKLY = 83.30;        // 2025/26
const EARNINGS_LIMIT = 196;     // £/week after allowable deductions
const MIN_CARE_HOURS = 35;

const RELATED = [
  { href: '/pip-benefit-checker', label: 'PIP Checker', hint: 'Qualifying benefit for the cared-for person' },
  { href: '/universal-credit-calculator', label: 'Universal Credit', hint: 'Carer element' },
  { href: '/council-tax-support-checker', label: 'Council Tax Support', hint: 'Reduction eligibility' },
  { href: '/childcare-calculator', label: 'Childcare Costs', hint: 'Free hours + TFC' },
];

export default function CarersAllowance() {
  const [careHours, setCareHours] = useState(35);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  const [pensionDeductions, setPensionDeductions] = useState(0);
  const [getsQualifyingBenefit, setGetsQualifyingBenefit] = useState(true);
  const [inFullTimeStudy, setInFullTimeStudy] = useState(false);

  const r = useMemo(() => {
    const netEarnings = Math.max(0, weeklyEarnings - pensionDeductions);
    const reasons: string[] = [];
    if (careHours < MIN_CARE_HOURS) reasons.push(`You must care for at least ${MIN_CARE_HOURS} hours a week.`);
    if (netEarnings > EARNINGS_LIMIT) reasons.push(`Your net weekly earnings (${gbp(netEarnings)}) are above the £${EARNINGS_LIMIT} limit.`);
    if (!getsQualifyingBenefit) reasons.push('The person you care for must receive a qualifying disability benefit (e.g. PIP daily living, DLA, Attendance Allowance).');
    if (inFullTimeStudy) reasons.push('You cannot claim Carer\'s Allowance while in full-time education (21+ hours a week).');

    const eligible = reasons.length === 0;
    const weekly = eligible ? CA_WEEKLY : 0;
    return { eligible, reasons, netEarnings, weekly, monthly: weekly * 52 / 12, annual: weekly * 52 };
  }, [careHours, weeklyEarnings, pensionDeductions, getsQualifyingBenefit, inFullTimeStudy]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Benefits', href: '/category/benefits' }, { label: "Carer's Allowance" }]}
      title="Carer's Allowance Calculator"
      subtitle="Check whether you qualify for Carer's Allowance in 2025/26 to £83.30 a week if you care 35+ hours and earn under £196 a week."
      calcLabel="Check Eligibility"
      inputs={
        <Panel title="Your Caring & Income">
          <div className="space-y-4">
            <Field label="Hours of care per week"><NumberInput value={careHours} onChange={setCareHours} min={0} step={1} suffix=" hrs" /></Field>
            <Field label="Weekly earnings (after tax & NI)"><MoneyInput value={weeklyEarnings} onChange={setWeeklyEarnings} step={10} /></Field>
            <Field label="Allowable weekly deductions" hint="Half of pension contributions, some care costs"><MoneyInput value={pensionDeductions} onChange={setPensionDeductions} step={5} /></Field>
            <Toggle checked={getsQualifyingBenefit} onChange={setGetsQualifyingBenefit} label="Person cared for gets a qualifying disability benefit" />
            <Toggle checked={inFullTimeStudy} onChange={setInFullTimeStudy} label="I'm in full-time education (21+ hrs/week)" />
          </div>
        </Panel>
      }
      results={
        r.eligible ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Carer's Allowance" value={gbp(r.weekly, 2)} sub="Per week" tone="dark" big />
              <Stat label="Per Month" value={gbp(r.monthly)} sub="Approx" tone="primary" />
              <Stat label="Per Year" value={gbp(r.annual)} sub="If you qualify all year" tone="accent" />
              <Stat label="Net Earnings" value={gbp(r.netEarnings)} sub={`Limit £${EARNINGS_LIMIT}/wk`} />
            </div>

            <Callout tone="warn" title="It counts as taxable income and overlaps">
              Carer's Allowance is taxable and can't usually be paid on top of the State Pension or certain other benefits at the same rate (the "overlapping benefit" rule). It may also affect the benefits of the person you care for.
            </Callout>
          </>
        ) : (
          <Callout tone="warn" title="You may not qualify">
            <ul className="list-disc pl-5 space-y-1">
              {r.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
            </ul>
          </Callout>
        )
      }
    >
      <Guide
        title="Carer's Allowance explained (2025/26)"
        intro="Carer's Allowance is the main benefit for people who look after someone with substantial caring needs. At £83.30 a week it's modest, and the rules around earnings and overlapping benefits catch many people out. Here's how to know if you qualify."
      >
        <GuideSection kicker="The basics" title="What you get and the main tests">
          <p>Carer's Allowance is <strong>£{CA_WEEKLY.toFixed(2)} a week</strong> for 2025/26. To qualify you must:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Care for someone at least <strong>35 hours a week</strong>.</li>
            <li>Earn no more than <strong>£{EARNINGS_LIMIT} a week</strong> after tax, NI and allowable deductions.</li>
            <li>Care for someone who gets a qualifying disability benefit (PIP daily living, DLA middle/higher care, Attendance Allowance and similar).</li>
            <li>Not be in full-time education (21+ hours a week).</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Earnings" title="The cliff-edge earnings limit">
          <p>The £{EARNINGS_LIMIT} limit is a hard cliff edge: earn £1 over and you lose the entire £{CA_WEEKLY.toFixed(2)}, not a tapered amount. You can reduce your countable earnings with allowable deductions, notably half of your pension contributions and some care costs that let you work. Watch this limit carefully around pay rises and bonuses.</p>
          <Callout tone="warn" title="Overpayments are common">
            Many carers have been hit with large repayment demands after small earnings breaches went unreported. Report any change in earnings immediately.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Overlapping benefits" title="Why you might not be paid it">
          <p>Carer's Allowance overlaps with some other benefits. If you receive the State Pension or contributory benefits at the same or higher rate, you may not actually be paid the Carer's Allowance, though an "underlying entitlement" can still increase means-tested benefits like Pension Credit or Universal Credit's carer element.</p>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Caring 35 hours, part-time job">
          <p>Someone caring 40 hours a week for a parent on PIP daily living, earning £180 a week after tax with £10 of allowable pension deductions, has countable earnings of £170, under the £{EARNINGS_LIMIT} limit. They qualify for the full £{CA_WEEKLY.toFixed(2)} a week, about £{Math.round(CA_WEEKLY * 52).toLocaleString()} a year, which is taxable.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common Carer's Allowance mistakes">
          <Mistakes items={[
            ['Breaching the earnings limit', 'It is a cliff edge, a small overshoot loses the whole payment and can create an overpayment.'],
            ['Not claiming underlying entitlement', 'Even if overlapping benefits stop the payment, the entitlement can boost means-tested benefits.'],
            ['Forgetting it is taxable', 'Carer\'s Allowance counts as taxable income, which can matter alongside other earnings.'],
            ['Affecting the cared-for person', 'Your claim can sometimes reduce a severe disability premium the person you care for receives, check first.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much is Carer\'s Allowance in 2025/26?', a: `It is £${CA_WEEKLY.toFixed(2)} a week, paid weekly or every four weeks.` },
            { q: 'Can I work and claim it?', a: 'Yes, as long as your net earnings stay at or below £' + EARNINGS_LIMIT + ' a week after allowable deductions.' },
            { q: 'Does it affect the person I care for?', a: 'It can. In some cases your claim removes a severe disability premium they get, so check the combined effect before claiming.' },
            { q: 'Can I get it with the State Pension?', a: 'Often not as an actual payment due to overlapping-benefit rules, but you may keep an underlying entitlement that helps with means-tested benefits.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
