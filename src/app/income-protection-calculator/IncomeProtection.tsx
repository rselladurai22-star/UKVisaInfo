'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { INSURANCE_RELATED } from '../car-insurance-calculator/CarInsurance';

type Defer = '4' | '13' | '26' | '52';
const SSP_WEEKLY = 118.75; // 2025/26

const ageRate = (a: number) => (a < 30 ? 0.03 : a < 40 ? 0.05 : a < 50 ? 0.085 : 0.15);
const deferFactor: Record<Defer, number> = { '4': 1.4, '13': 1, '26': 0.8, '52': 0.62 };

export default function IncomeProtection() {
  const [gross, setGross] = useState(40000);
  const [outgoings, setOutgoings] = useState(1800);
  const [employerWeeks, setEmployerWeeks] = useState(8);
  const [defer, setDefer] = useState<Defer>('13');
  const [age, setAge] = useState(38);

  const r = useMemo(() => {
    const maxBenefit = (gross * 0.6) / 12; // insurers cap ~60% of gross
    const recommended = Math.min(outgoings, maxBenefit);
    const annualBenefit = recommended * 12;
    const monthlyPremium = (annualBenefit * ageRate(age) * deferFactor[defer]) / 12;
    const sspMonthly = (SSP_WEEKLY * 52) / 12;
    const replacement = gross > 0 ? (recommended * 12) / gross * 100 : 0;
    return { maxBenefit, recommended, monthlyPremium, sspMonthly, replacement };
  }, [gross, outgoings, employerWeeks, defer, age]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Insurance', href: '/category/insurance' }, { label: 'Income Protection' }]}
      title="Income Protection Calculator"
      subtitle="If illness or injury stopped your pay, how big a monthly benefit would you need — and what would it cost? Statutory Sick Pay is just £118.75 a week, so the gap is usually large."
      calcLabel="Calculate cover"
      inputs={
        <>
          <Panel title="Your income & costs">
            <div className="space-y-4">
              <Field label="Gross annual income"><MoneyInput value={gross} onChange={setGross} step={1000} /></Field>
              <Field label="Essential monthly outgoings" hint="Mortgage/rent, bills, food, minimum debt"><MoneyInput value={outgoings} onChange={setOutgoings} step={50} /></Field>
              <Field label={`Employer full-pay sick weeks — ${employerWeeks}`} hint="How long your employer pays full pay"><Slider value={employerWeeks} onChange={setEmployerWeeks} min={0} max={52} /></Field>
            </div>
          </Panel>
          <Panel title="Policy options">
            <div className="space-y-4">
              <Field label="Deferred period (waiting time before payout)">
                <Choice<Defer> name="defer" value={defer} onChange={setDefer} options={[
                  { value: '4', label: '4 weeks' }, { value: '13', label: '13 weeks' }, { value: '26', label: '26 weeks' }, { value: '52', label: '52 weeks' },
                ]} />
              </Field>
              <Field label={`Your age — ${age}`}><Slider value={age} onChange={setAge} min={18} max={60} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Monthly benefit needed" value={gbp(r.recommended, 0)} sub={`covers ${pct(r.replacement, 0)} of income`} tone="dark" big />
            <Stat label="Est. monthly premium" value={gbp(r.monthlyPremium, 0)} sub={`${defer}-wk wait, age ${age}`} tone="accent" />
            <Stat label="Max insurable" value={gbp(r.maxBenefit, 0)} sub="≈60% of gross /mo" />
          </div>
          <Callout tone="warn" title="The SSP gap">
            Statutory Sick Pay is only about {gbp(r.sspMonthly, 0)}/month and lasts up to 28 weeks. After your
            employer&apos;s sick pay ends, that&apos;s often all you&apos;d get — leaving a large shortfall against your
            {' '}{gbp(outgoings, 0)} of essential costs.
          </Callout>
          <Callout tone="info" title="Estimate only">Premiums depend on your job, health, smoker status, the deferred period and how long the benefit pays. A longer wait before payout makes cover cheaper.</Callout>
        </>
      }
    >
      <Guide
        title="Income protection: insuring your salary"
        intro="Income protection is the cover most people overlook and many advisers rate first. It replaces part of your income if you can't work due to illness or injury. Here's how it works and how to size it."
      >
        <GuideSection kicker="The basics" title="What income protection does">
          <p>Income protection insurance (IP) pays a regular, tax-free monthly income if illness or injury stops you working — for almost any medical reason, not just a defined list. Payments start after a chosen <strong>deferred period</strong> and continue until you recover, the policy term ends, or you retire (for a full &quot;long-term&quot; policy). Unlike critical illness, it isn&apos;t a one-off lump sum and isn&apos;t limited to specific conditions, which is why it covers the widest range of situations.</p>
        </GuideSection>
        <GuideSection kicker="The gap" title="Why SSP isn't enough">
          <p>If you can&apos;t work, Statutory Sick Pay is just <strong>£118.75 a week</strong> (2025/26) for up to 28 weeks, and only if you qualify. Some employers add a few weeks or months of full pay, but after that most people fall back to SSP or nothing. Against a typical mortgage and bills, that leaves a serious shortfall — which is exactly the gap income protection fills.</p>
        </GuideSection>
        <GuideSection kicker="How much" title="Benefit amount and the deferred period">
          <p>Insurers usually cap the benefit at around <strong>60% of your gross income</strong> (it&apos;s tax-free, so that broadly matches your take-home). Aim to cover your essential outgoings up to that cap. The <strong>deferred period</strong> — how long you wait before payments start — is the big premium lever: setting it to match when your employer&apos;s sick pay ends (say 13 or 26 weeks) cuts the cost substantially versus a 4-week wait.</p>
          <Callout tone="tip" title="Match the deferred period to your sick pay">If your employer pays full salary for 3 months, a 13-week deferred period avoids paying for cover you don&apos;t need — lowering your premium with no real loss of protection.</Callout>
        </GuideSection>
        <GuideSection kicker="Detail" title="Own occupation and payment terms">
          <p>Choose <strong>&quot;own occupation&quot;</strong> cover where possible — it pays out if you can&apos;t do <em>your</em> job, rather than any job, which is a much stronger definition. Also check whether it&apos;s a <strong>full-term</strong> policy (pays until recovery or retirement) or a cheaper <strong>budget/short-term</strong> version that only pays for a year or two per claim. Full-term own-occupation cover is the gold standard.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Relying on SSP or savings', 'SSP is minimal and savings run out fast. IP is the only sustainable replacement for a lost salary.'],
            ['Picking a short deferred period for no reason', 'A longer wait that matches your employer sick pay is much cheaper.'],
            ['Choosing "any occupation" cover', 'It only pays if you can&apos;t do any job at all — far weaker than "own occupation".'],
            ['Over-insuring above the cap', 'Insurers limit benefit to ~60% of gross; paying for more is wasted.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is the payout taxed?', a: 'Personal income protection benefits are paid tax-free, which is why cover is capped at around 60% of gross income (roughly your take-home).' },
            { q: 'How is it different from critical illness cover?', a: 'Income protection pays a monthly income for almost any illness/injury that stops you working; critical illness pays a one-off lump sum only for specific listed conditions.' },
            { q: 'What deferred period should I choose?', a: 'Match it to when your employer sick pay ends — commonly 13 or 26 weeks. A longer deferred period lowers the premium.' },
            { q: 'Does it cover redundancy?', a: 'No. Standard income protection covers illness and injury, not job loss. Redundancy cover is a separate, more limited product.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={INSURANCE_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
