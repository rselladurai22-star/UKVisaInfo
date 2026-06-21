'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

const FIRST = 26.05;   // weekly, eldest child 2025/26
const EXTRA = 17.25;   // weekly, each additional child
const LOWER = 60000;
const UPPER = 80000;
const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

export default function ChildBenefit() {
  const [children, setChildren] = useState(2);
  const [income, setIncome] = useState(65000);
  const [pension, setPension] = useState(0);

  const r = useMemo(() => {
    const adjusted = Math.max(0, income - pension);
    const benefit = (FIRST + Math.max(0, children - 1) * EXTRA) * 52;
    let chargePct = 0;
    if (adjusted >= UPPER) chargePct = 1;
    else if (adjusted > LOWER) chargePct = (adjusted - LOWER) / (UPPER - LOWER);
    const charge = benefit * chargePct;
    const kept = benefit - charge;
    const toEscape = Math.max(0, adjusted - LOWER); // pension needed to fully avoid
    return { benefit, charge, kept, chargePct, adjusted, toEscape };
  }, [children, income, pension]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Child Benefit Trap' }]}
      title="Child Benefit Tax Charge Calculator"
      subtitle="If you or your partner earns over £60,000, the High Income Child Benefit Charge claws back some or all of your Child Benefit. See what you keep, and how a pension contribution can save it."
      calcLabel="Calculate charge"
      inputs={
        <Panel title="Your details">
          <div className="space-y-4">
            <Field label="Children"><NumberInput value={children} onChange={setChildren} /></Field>
            <Field label="Higher earner's income" hint="Adjusted net income of the higher-earning partner"><MoneyInput value={income} onChange={setIncome} step={1000} /></Field>
            <Field label={`Pension contribution, ${gbp(pension)}`} hint="Reduces adjusted income and the charge"><Slider value={pension} onChange={setPension} min={0} max={30000} step={500} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Child Benefit kept" value={gbp(r.kept)} sub={`of ${gbp(r.benefit)}/yr`} tone="dark" big />
            <Stat label="HICBC charge" value={gbp(r.charge)} sub={`${pct(r.chargePct * 100, 0)} clawed back`} tone="accent" />
            <Stat label="Full benefit" value={gbp(r.benefit)} sub={`${children} child${children === 1 ? '' : 'ren'}`} />
          </div>
          <Panel title="How much is clawed back">
            <BarTrack segments={[{ value: r.kept, color: PRIMARY }, { value: r.charge, color: ACCENT }]} />
            <div className="flex justify-between text-xs text-on-surface-variant mt-2"><span>Kept {gbp(r.kept)}</span><span>Charge {gbp(r.charge)}</span></div>
          </Panel>
          {r.adjusted > LOWER && (
            <Callout tone="tip" title="Pension can rescue your Child Benefit">
              The charge is based on adjusted net income. A pension contribution of about <strong>{gbp(r.toEscape)}</strong> would
              bring you back to £60,000 and remove the charge entirely, while also boosting your pension and saving Income Tax.
            </Callout>
          )}
          <p className="text-[11px] text-on-surface-variant">2025/26 rates. The charge is on the higher earner&apos;s adjusted net income (£60,000 to £80,000 taper). Pay it via Self Assessment, or opt out of payments to avoid it.</p>
        </>
      }
    >
      <Guide
        title="The Child Benefit high-income charge"
        intro="Child Benefit is great, until one partner earns over £60,000, when the High Income Child Benefit Charge starts clawing it back. This guide explains the trap and how to beat it."
      >
        <GuideSection kicker="The basics" title="How the charge works">
          <p>Child Benefit is paid to anyone responsible for a child, £26.05 a week for the eldest and £17.25 for each additional child in 2025/26. But if you or your partner has an <strong>adjusted net income over £60,000</strong>, the <strong>High Income Child Benefit Charge (HICBC)</strong> reclaims 1% of the benefit for every £200 of income above £60,000. By <strong>£80,000</strong> the charge equals 100% of the benefit, you effectively keep none of it.</p>
        </GuideSection>
        <GuideSection kicker="The quirk" title="It's based on the higher earner, not household">
          <p>The charge looks at the <strong>highest individual income</strong>, not combined household income. So a couple each earning £55,000 (£110,000 between them) keeps all the benefit, while a single earner on £75,000 loses most of it. It&apos;s widely seen as unfair, but it&apos;s the rule, and it means how income is split between partners matters.</p>
        </GuideSection>
        <GuideSection kicker="Beat it" title="Pension contributions reduce the charge">
          <p>The charge is based on <strong>adjusted net income</strong>, your income after pension contributions and Gift Aid. So paying into a pension can bring you back under £60,000 and remove the charge, while also saving Income Tax and building your pension. For someone just over the threshold with children, a pension contribution can be one of the most rewarding pounds they spend.</p>
          <Callout tone="tip" title="A double (or triple) win">Between £60,000 and £80,000 with children, a pension contribution dodges the HICBC, saves 40% Income Tax, and grows your pension, an effective return well above the headline rate.</Callout>
        </GuideSection>
        <GuideSection kicker="Practical" title="Claim it even if you'll pay the charge">
          <p>Always <strong>claim Child Benefit</strong>, even if you expect to pay it all back. Claiming protects your State Pension via NI credits (for a parent not working) and gives your child a National Insurance number automatically. You can choose to <strong>opt out of payments</strong> to avoid the charge and the Self Assessment hassle, while keeping the NI credits. If you do receive it and are caught by the charge, you must register for Self Assessment to pay it.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Not claiming at all', 'You lose valuable NI credits towards your State Pension. Claim, even if opting out of payments.'],
            ['Forgetting to register for Self Assessment', 'If caught by the charge and receiving payments, you must file, penalties apply if you don&apos;t.'],
            ['Overlooking pension relief', 'A pension contribution can remove the charge and save tax, many miss this.'],
            ['Assuming it&apos;s household income', 'It&apos;s the highest individual income that counts, which can feel unfair but changes the strategy.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'At what income do I start losing Child Benefit?', a: 'The charge starts at £60,000 of adjusted net income and removes the benefit entirely by £80,000, based on the higher earner.' },
            { q: 'Should I still claim if I earn over £80,000?', a: 'Yes, claim but opt out of payments. You keep the NI credits towards your State Pension and your child gets an NI number, without triggering the charge.' },
            { q: 'How can I reduce the charge?', a: 'Lower your adjusted net income, most commonly via pension contributions or Gift Aid donations, which can bring you back under £60,000.' },
            { q: 'How do I pay the charge?', a: 'Through Self Assessment. You register, declare the Child Benefit received, and pay the charge with your tax bill.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
