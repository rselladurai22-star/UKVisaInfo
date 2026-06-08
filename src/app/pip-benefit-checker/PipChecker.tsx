'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, NumberInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

// 2025/26 weekly PIP rates
const DL_STANDARD = 73.90;
const DL_ENHANCED = 110.40;
const MOB_STANDARD = 29.20;
const MOB_ENHANCED = 77.05;

function rate(points: number, standard: number, enhanced: number): { rate: number; level: string } {
  if (points >= 12) return { rate: enhanced, level: 'Enhanced' };
  if (points >= 8) return { rate: standard, level: 'Standard' };
  return { rate: 0, level: 'None' };
}

const RELATED = [
  { href: '/carers-allowance-calculator', label: "Carer's Allowance", hint: '£83.30/week' },
  { href: '/universal-credit-calculator', label: 'Universal Credit', hint: 'Standard allowance + elements' },
  { href: '/council-tax-support-checker', label: 'Council Tax Support', hint: 'Reduction eligibility' },
  { href: '/childcare-calculator', label: 'Childcare Costs', hint: 'Free hours + TFC' },
];

export default function PipChecker() {
  const [dlPoints, setDlPoints] = useState(8);
  const [mobPoints, setMobPoints] = useState(4);

  const r = useMemo(() => {
    const dl = rate(dlPoints, DL_STANDARD, DL_ENHANCED);
    const mob = rate(mobPoints, MOB_STANDARD, MOB_ENHANCED);
    const weekly = dl.rate + mob.rate;
    return { dl, mob, weekly, monthly: weekly * 52 / 12, annual: weekly * 52 };
  }, [dlPoints, mobPoints]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Benefits', href: '/category/benefits' }, { label: 'PIP Checker' }]}
      title="PIP Benefit Checker"
      subtitle="Estimate your Personal Independence Payment for 2025/26 from your daily living and mobility points — standard and enhanced rates."
      calcLabel="Check PIP Entitlement"
      inputs={
        <Panel title="Your Assessment Points">
          <div className="space-y-4">
            <Field label="Daily living points" hint="8–11 = standard, 12+ = enhanced">
              <NumberInput value={dlPoints} onChange={setDlPoints} min={0} step={1} suffix=" pts" />
            </Field>
            <Field label="Mobility points" hint="8–11 = standard, 12+ = enhanced">
              <NumberInput value={mobPoints} onChange={setMobPoints} min={0} step={1} suffix=" pts" />
            </Field>
            <p className="text-[11px] text-on-surface-variant">Points come from the PIP assessment across 10 daily living and 2 mobility activities. This estimates the award once your points are known.</p>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Weekly PIP" value={gbp(r.weekly, 2)} sub="Both components" tone="dark" big />
            <Stat label="Per Month" value={gbp(r.monthly)} sub="Paid every 4 weeks" tone="primary" />
            <Stat label="Daily Living" value={r.dl.rate > 0 ? gbp(r.dl.rate, 2) : '—'} sub={r.dl.level} tone="accent" />
            <Stat label="Mobility" value={r.mob.rate > 0 ? gbp(r.mob.rate, 2) : '—'} sub={r.mob.level} />
          </div>

          <Panel title="Your award">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Daily living ({r.dl.level})</span><span className="font-semibold tabular-nums">{gbp(r.dl.rate, 2)}/wk</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Mobility ({r.mob.level})</span><span className="font-semibold tabular-nums">{gbp(r.mob.rate, 2)}/wk</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Total per year</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.annual)}</span></div>
            </div>
          </Panel>

          {r.weekly === 0 && (
            <Callout tone="info" title="Below the points threshold">
              You need at least 8 points in a component to receive any award for it. Fewer than 8 in both means no PIP on these scores.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26. PIP is tax-free and not means-tested. The actual award depends on a DWP health assessment. Reform of PIP eligibility has been proposed — check current rules.</p>
        </>
      }
    >
      <Guide
        title="Personal Independence Payment (PIP) explained"
        intro="PIP helps with the extra costs of a long-term health condition or disability. It's tax-free, not means-tested, and you can get it whether you work or not. It has two parts — daily living and mobility — each paid at a standard or enhanced rate based on assessment points."
      >
        <GuideSection kicker="The two parts" title="Daily living and mobility">
          <p>PIP has two separate components, and you can get one or both:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Daily living</strong> — for help with everyday tasks: standard £{DL_STANDARD.toFixed(2)}/week, enhanced £{DL_ENHANCED.toFixed(2)}/week.</li>
            <li><strong>Mobility</strong> — for getting around: standard £{MOB_STANDARD.toFixed(2)}/week, enhanced £{MOB_ENHANCED.toFixed(2)}/week.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="The points" title="How the rate is decided">
          <p>An assessment scores you across 10 daily living activities and 2 mobility activities, looking at how your condition affects you reliably, repeatedly and safely. For each component:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>8–11 points</strong> → standard rate.</li>
            <li><strong>12 or more points</strong> → enhanced rate.</li>
            <li>Fewer than 8 points → no award for that component.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Key features" title="Tax-free and a passport to more">
          <p>PIP is not taxed and doesn't reduce other benefits — in fact it can <strong>increase</strong> them. Getting PIP can unlock extra amounts in Universal Credit, a Council Tax reduction, the Blue Badge, and entitle a carer to Carer's Allowance.</p>
          <Callout tone="tip" title="It can passport other help">
            Because PIP can trigger a carer's claim and extra benefit elements, it's worth checking the knock-on entitlements if your PIP is awarded.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Standard daily living only">
          <p>Someone scoring 9 points for daily living and 4 for mobility gets the standard daily living rate (£{DL_STANDARD.toFixed(2)}/week) and nothing for mobility, since mobility is below 8 points. That's about £{(DL_STANDARD).toFixed(2)} a week, or roughly £{Math.round(DL_STANDARD * 52).toLocaleString()} a year, paid every four weeks.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common PIP mistakes">
          <Mistakes items={[
            ['Underselling your worst days', 'The assessment considers whether you can do tasks reliably and repeatedly — describe your bad days, not just your best.'],
            ['Missing the reliability test', 'You score points if you cannot do something safely, to an acceptable standard, repeatedly, or in reasonable time.'],
            ['Not gathering evidence', 'Supporting letters from GPs, consultants and carers strengthen a claim significantly.'],
            ['Giving up after refusal', 'Many awards are won at mandatory reconsideration or appeal, so challenge a decision you think is wrong.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is PIP means-tested?', a: 'No. PIP is not affected by your income, savings or whether you work — it is based on how your condition affects you.' },
            { q: 'Is PIP taxable?', a: 'No. PIP is completely tax-free and does not count as income for tax purposes.' },
            { q: 'Can I work and claim PIP?', a: 'Yes. PIP is about the impact of your condition, not your ability to work, so employment does not stop a claim.' },
            { q: 'How is PIP paid?', a: 'Usually every four weeks directly into your bank account, combining both components into one payment.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
