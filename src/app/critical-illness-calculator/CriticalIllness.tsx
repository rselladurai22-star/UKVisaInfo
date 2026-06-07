'use client';

import { useMemo, useState } from 'react';
import {
  gbp, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { INSURANCE_RELATED } from '../car-insurance-calculator/CarInsurance';

const ratePer100k = (age: number) => (age < 30 ? 10 : age < 40 ? 16 : age < 50 ? 30 : age < 60 ? 62 : 130);

export default function CriticalIllness() {
  const [age, setAge] = useState(38);
  const [income, setIncome] = useState(40000);
  const [years, setYears] = useState(3);
  const [mortgage, setMortgage] = useState(180000);
  const [includeMortgage, setIncludeMortgage] = useState(true);
  const [debts, setDebts] = useState(8000);
  const [existing, setExisting] = useState(0);
  const [term, setTerm] = useState(25);

  const r = useMemo(() => {
    const incomeCover = income * years;
    const needed = Math.max(0, (includeMortgage ? mortgage : 0) + debts + incomeCover - existing);
    const termF = term > 25 ? 1.2 : term < 15 ? 0.9 : 1;
    const monthly = (needed / 100000) * ratePer100k(age) * termF;
    return { incomeCover, needed, monthly };
  }, [age, income, years, mortgage, includeMortgage, debts, existing, term]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Insurance', href: '/category/insurance' }, { label: 'Critical Illness' }]}
      title="Critical Illness Cover Calculator"
      subtitle="Estimate the lump sum you'd need if a serious illness stopped you working — to clear the mortgage and debts and fund your recovery — plus a rough monthly premium."
      calcLabel="Calculate cover"
      inputs={
        <>
          <Panel title="Your needs">
            <div className="space-y-4">
              <Field label="Annual income"><MoneyInput value={income} onChange={setIncome} step={1000} /></Field>
              <Field label={`Years of income to cover — ${years}`} hint="Typical recovery / adjustment period"><Slider value={years} onChange={setYears} min={1} max={10} /></Field>
              <Field label="Outstanding mortgage"><MoneyInput value={mortgage} onChange={setMortgage} step={5000} /></Field>
              <Toggle checked={includeMortgage} onChange={setIncludeMortgage} label="Clear the mortgage with the payout" />
              <Field label="Other debts"><MoneyInput value={debts} onChange={setDebts} step={500} /></Field>
            </div>
          </Panel>
          <Panel title="Existing cover & term">
            <div className="space-y-4">
              <Field label="Existing critical illness cover"><MoneyInput value={existing} onChange={setExisting} step={5000} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Your age — ${age}`}><Slider value={age} onChange={setAge} min={18} max={65} /></Field>
                <Field label="Term (yrs)"><NumberInput value={term} onChange={setTerm} suffix="yrs" /></Field>
              </div>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Cover you need" value={gbp(r.needed)} sub="lump sum" tone="dark" big />
            <Stat label="Est. monthly premium" value={gbp(r.monthly, 0)} sub={`age ${age}`} tone="accent" />
            <Stat label="Income portion" value={gbp(r.incomeCover)} sub={`${years} yrs cover`} />
          </div>
          <Callout tone="info" title="Critical illness costs more than life cover">
            For the same sum, critical illness premiums are typically two to three times life-insurance premiums,
            because a claim is more likely. Many people combine the two in one policy. Estimate only — health and
            smoker status drive the real price.
          </Callout>
        </>
      }
    >
      <Guide
        title="Critical illness cover explained"
        intro="Critical illness cover pays a tax-free lump sum if you're diagnosed with a serious condition the policy covers. This guide explains what it covers, how much to take, and how it differs from life and income protection."
      >
        <GuideSection kicker="The basics" title="What critical illness cover pays for">
          <p>Critical illness cover (CIC) pays a one-off, tax-free lump sum if you&apos;re diagnosed with — and survive — one of the specific serious conditions listed in the policy. Common covered conditions include heart attack, stroke, many cancers, multiple sclerosis and organ failure, though definitions and the number of conditions vary a lot between insurers. It&apos;s designed to remove financial pressure while you recover: clearing the mortgage, paying off debts, funding treatment or adapting your home.</p>
        </GuideSection>
        <GuideSection kicker="How much" title="Sizing your cover">
          <p>A sensible target clears your <strong>mortgage and debts</strong> and replaces a few years of income to cover the recovery and adjustment period. Unlike life insurance you usually don&apos;t need to replace income for decades — most people aim for enough to stabilise finances for two to five years plus debt clearance. The calculator builds this from your figures.</p>
        </GuideSection>
        <GuideSection kicker="Compare" title="CIC vs life cover vs income protection">
          <p>These three products solve different problems. <strong>Life insurance</strong> pays out on death. <strong>Critical illness</strong> pays a lump sum on diagnosis of a listed condition. <strong>Income protection</strong> pays a regular monthly income if illness or injury stops you working, for any reason, until you recover or retire. Income protection covers a far wider range of situations than CIC; many advisers rate it the priority, with CIC as a useful addition for the lump-sum needs.</p>
          <Callout tone="tip" title="Combined policies">A combined life and critical illness policy pays out on the first event (death or diagnosis). It&apos;s cheaper than two separate policies but only pays once — consider separate cover if you want both to pay.</Callout>
        </GuideSection>
        <GuideSection kicker="The detail" title="Read the definitions">
          <p>The value of CIC is in the small print. Two policies covering "cancer" can differ on which stages and types are included. Look at the number of conditions, the severity definitions, whether children&apos;s cover is included, and any survival period (often 10–14 days). The cheapest policy is not always the best if its definitions are narrow.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Choosing on price alone', 'Narrow condition definitions can mean no payout when you expected one. Compare cover quality, not just cost.'],
            ['Not disclosing health history', 'Non-disclosure can void a claim. Answer medical questions fully and honestly.'],
            ['Assuming it replaces income protection', 'CIC pays once, for listed conditions only. Income protection covers far more situations with an ongoing income.'],
            ['Over-insuring the income portion', 'You usually need a few years of income, not decades — don&apos;t pay for more than you need.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is the payout taxed?', a: 'No — a critical illness lump sum is generally free of income and capital gains tax.' },
            { q: 'Does it cover every illness?', a: 'No. It only pays for the specific conditions and severity levels defined in the policy. Always check the list and definitions before buying.' },
            { q: 'Should I get critical illness or income protection?', a: 'Many advisers prioritise income protection because it covers more situations with an ongoing income. Critical illness adds a lump sum for big one-off costs like clearing the mortgage. Budget permitting, both complement each other.' },
            { q: 'Can I add it to life insurance?', a: 'Yes — combined life and critical illness policies are common and cheaper than two separate ones, but they pay out only once, on the first claim.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={INSURANCE_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
