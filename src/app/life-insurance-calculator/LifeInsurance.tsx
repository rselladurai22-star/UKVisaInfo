'use client';

import { useMemo, useState } from 'react';
import {
  gbp, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { INSURANCE_RELATED } from '../car-insurance-calculator/CarInsurance';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const ratePer100k = (age: number) => (age < 30 ? 4 : age < 40 ? 6 : age < 50 ? 11 : age < 60 ? 24 : 55);

export default function LifeInsurance() {
  const [age, setAge] = useState(38);
  const [income, setIncome] = useState(40000);
  const [years, setYears] = useState(10);
  const [mortgage, setMortgage] = useState(180000);
  const [debts, setDebts] = useState(8000);
  const [children, setChildren] = useState(2);
  const [funeral, setFuneral] = useState(5000);
  const [existing, setExisting] = useState(0);
  const [term, setTerm] = useState(25);

  const r = useMemo(() => {
    const incomeReplace = income * years;
    const education = children * 20000;
    const needed = Math.max(0, mortgage + debts + incomeReplace + education + funeral - existing);
    const termF = term > 25 ? 1.2 : term < 15 ? 0.9 : 1;
    const monthly = (needed / 100000) * ratePer100k(age) * termF;
    return { incomeReplace, education, needed, monthly };
  }, [age, income, years, mortgage, debts, children, funeral, existing, term]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Insurance', href: '/category/insurance' }, { label: 'Life Insurance' }]}
      title="Life Insurance Calculator"
      subtitle="Work out how much life cover your family would actually need — clearing the mortgage and debts, replacing your income and covering the children — plus a rough monthly premium for level term cover."
      calcLabel="Calculate cover"
      inputs={
        <>
          <Panel title="Your family & debts">
            <div className="space-y-4">
              <Field label="Annual income to replace"><MoneyInput value={income} onChange={setIncome} step={1000} /></Field>
              <Field label={`Years of income to cover — ${years}`} hint="Until children are independent / mortgage clear"><Slider value={years} onChange={setYears} min={1} max={25} /></Field>
              <Field label="Outstanding mortgage"><MoneyInput value={mortgage} onChange={setMortgage} step={5000} /></Field>
              <Field label="Other debts"><MoneyInput value={debts} onChange={setDebts} step={500} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Children"><NumberInput value={children} onChange={setChildren} /></Field>
                <Field label="Funeral fund"><MoneyInput value={funeral} onChange={setFuneral} step={500} /></Field>
              </div>
            </div>
          </Panel>
          <Panel title="Existing cover & term">
            <div className="space-y-4">
              <Field label="Existing life cover"><MoneyInput value={existing} onChange={setExisting} step={5000} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Your age — ${age}`}><Slider value={age} onChange={setAge} min={18} max={70} /></Field>
                <Field label="Policy term (yrs)"><NumberInput value={term} onChange={setTerm} suffix="yrs" /></Field>
              </div>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Cover you need" value={gbp(r.needed)} sub="lump sum" tone="dark" big />
            <Stat label="Est. monthly premium" value={gbp(r.monthly, 0)} sub={`level term, age ${age}`} tone="accent" />
            <Stat label="Suggested term" value={`${term} yrs`} sub="match mortgage / kids" />
          </div>
          <Panel title="What the cover is for">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Total need" centerValue={gbp(r.needed)} segments={[
                { value: mortgage, color: PRIMARY, label: 'Mortgage' },
                { value: r.incomeReplace, color: ACCENT, label: 'Income replacement' },
                { value: debts + r.education + funeral, color: '#0a7d4f', label: 'Debts, kids & funeral' },
              ]} />
              <div className="flex-1 space-y-2 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Mortgage</span><span className="font-semibold tabular-nums">{gbp(mortgage)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Income × {years} yrs</span><span className="font-semibold tabular-nums">{gbp(r.incomeReplace)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Debts + children + funeral</span><span className="font-semibold tabular-nums">{gbp(debts + r.education + funeral)}</span></div>
                {existing > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Less existing cover</span><span className="font-semibold tabular-nums text-secondary">−{gbp(existing)}</span></div>}
              </div>
            </div>
          </Panel>
          <Callout tone="info" title="Premium is indicative">Real premiums depend on your health, smoker status, exact age and the insurer. A non-smoker in good health often pays less; get quotes before deciding.</Callout>
        </>
      }
    >
      <Guide
        title="How much life insurance do you need?"
        intro="Too little cover leaves your family exposed; too much wastes money on premiums. This guide explains a simple framework for sizing cover, the types of policy, and how to keep premiums down."
      >
        <GuideSection kicker="The framework" title="The DIME method">
          <p>A reliable way to size cover is <strong>DIME</strong>: <strong>D</strong>ebt (clear all non-mortgage debts), <strong>I</strong>ncome (replace your income for the years your family needs it), <strong>M</strong>ortgage (clear it in full), and <strong>E</strong>ducation/expenses (children&apos;s costs and a funeral fund). Add these up, subtract any cover you already have, and that&apos;s your target. The calculator above does this automatically.</p>
        </GuideSection>
        <GuideSection kicker="Policy types" title="Level term, decreasing and whole-of-life">
          <p><strong>Level term</strong> pays a fixed lump sum if you die within the term — best for income replacement and family protection. <strong>Decreasing term</strong> reduces over time to track a repayment mortgage, so it&apos;s cheaper and ideal for mortgage protection. <strong>Whole-of-life</strong> pays out whenever you die (not just within a term) and is used for guaranteed funeral costs or inheritance-tax planning, but costs much more. Most families need level or decreasing term.</p>
          <Callout tone="tip" title="Write it in trust">Putting a policy in trust usually keeps the payout outside your estate (so no inheritance tax on it) and gets money to your family faster, without waiting for probate. It&apos;s typically free to set up — ask the insurer.</Callout>
        </GuideSection>
        <GuideSection kicker="Premiums" title="What drives the price">
          <p>The main factors are your <strong>age</strong> (premiums rise steeply as you get older — buy sooner), <strong>health and smoker status</strong>, the <strong>cover amount</strong> and <strong>term</strong>, and the <strong>policy type</strong>. A healthy non-smoker in their 30s can insure a large sum for a modest monthly cost; the same cover at 55 costs several times more. Locking in a level premium young is usually the cheapest route.</p>
        </GuideSection>
        <GuideSection kicker="Worked example" title="A family of four">
          <p>Take a 38-year-old earning £40,000 with a £180,000 mortgage, £8,000 of other debts and two children. Replacing 10 years of income (£400,000), clearing the mortgage and debts, and adding ~£40,000 for the children plus a funeral fund gives roughly <strong>£633,000</strong> of cover needed. On level term to match a 25-year mortgage, that might cost a healthy non-smoker around £25–£40 a month — a small price for that protection.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Only covering the mortgage', 'Clearing the mortgage helps, but your family also loses your income. Replace both.'],
            ['Not writing the policy in trust', 'Without a trust, the payout can be delayed by probate and may face inheritance tax.'],
            ['Delaying to "later"', 'Premiums rise with age and health changes. The cheapest time to buy is now.'],
            ['Forgetting to update cover', 'A new child, bigger mortgage or pay rise changes your need — review every few years.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much life insurance do I need?', a: 'A common rule is 10× your income, but the DIME method (debts + income replacement + mortgage + education) is more accurate. The calculator sizes it from your actual figures.' },
            { q: 'Is life insurance taxed?', a: 'The payout is generally free of income and capital gains tax. If the policy is not in trust, it can form part of your estate and be subject to inheritance tax — writing it in trust usually avoids this.' },
            { q: 'Level or decreasing term?', a: 'Level term keeps a fixed payout (good for income replacement); decreasing term falls over time to match a repayment mortgage and is cheaper. Many people combine both.' },
            { q: 'Do I need cover if I have it through work?', a: "Death-in-service cover is valuable but usually only 2–4× salary and ends if you leave the job. It rarely replaces a full personal policy." },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={INSURANCE_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
