'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

const TAPER = 0.20; // typical working-age CTR taper on excess income

const RELATED = [
  { href: '/universal-credit-calculator', label: 'Universal Credit', hint: 'Standard allowance + elements' },
  { href: '/pip-benefit-checker', label: 'PIP Checker', hint: 'Daily living + mobility' },
  { href: '/carers-allowance-calculator', label: "Carer's Allowance", hint: '£83.30/week' },
  { href: '/council-tax-band', label: 'Council Tax Bands', hint: 'Band A–H by area' },
];

export default function CouncilTaxSupport() {
  const [annualBill, setAnnualBill] = useState(1800);
  const [weeklyIncome, setWeeklyIncome] = useState(200);
  const [applicableAmount, setApplicableAmount] = useState(160);
  const [maxSupportPct, setMaxSupportPct] = useState(100);
  const [savings, setSavings] = useState(0);
  const [pensioner, setPensioner] = useState(false);
  const [onPassporting, setOnPassporting] = useState(false);

  const r = useMemo(() => {
    const capitalLimit = pensioner ? 16000 : 16000;
    if (savings > capitalLimit && !(pensioner && onPassporting)) {
      return { blocked: true, weeklyReduction: 0, annualReduction: 0, remaining: annualBill, reductionPct: 0 };
    }
    const maxWeekly = (annualBill / 52) * (maxSupportPct / 100);
    let weeklyReduction: number;
    if (onPassporting) {
      // passported claimants get maximum support
      weeklyReduction = maxWeekly;
    } else {
      const excess = Math.max(0, weeklyIncome - applicableAmount);
      weeklyReduction = Math.max(0, maxWeekly - excess * TAPER);
    }
    const annualReduction = weeklyReduction * 52;
    const remaining = Math.max(0, annualBill - annualReduction);
    return { blocked: false, weeklyReduction, annualReduction, remaining, reductionPct: annualBill > 0 ? (annualReduction / annualBill) * 100 : 0 };
  }, [annualBill, weeklyIncome, applicableAmount, maxSupportPct, savings, pensioner, onPassporting]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Benefits', href: '/category/benefits' }, { label: 'Council Tax Support' }]}
      title="Council Tax Support Checker"
      subtitle="Estimate how much your council tax bill could be reduced through Council Tax Reduction (CTR) — a means-tested discount run by your local council."
      calcLabel="Estimate Reduction"
      inputs={
        <div className="space-y-4">
          <Panel title="Your Bill & Income">
            <div className="space-y-4">
              <Field label="Annual council tax bill"><MoneyInput value={annualBill} onChange={setAnnualBill} step={50} /></Field>
              <Field label="Weekly household income" hint="After tax, including benefits"><MoneyInput value={weeklyIncome} onChange={setWeeklyIncome} step={10} /></Field>
              <Field label="Applicable amount (weekly)" hint="Your assessed living needs — roughly your benefit-level income"><MoneyInput value={applicableAmount} onChange={setApplicableAmount} step={10} /></Field>
              <Field label="Savings & capital"><MoneyInput value={savings} onChange={setSavings} step={500} /></Field>
            </div>
          </Panel>
          <Panel title="Your Scheme">
            <div className="space-y-4">
              <Field label="Your council's maximum support (%)" hint="Working-age schemes vary; many cap at 80–100%">
                <NumberInput value={maxSupportPct} onChange={setMaxSupportPct} min={0} step={5} suffix="%" />
              </Field>
              <Toggle checked={pensioner} onChange={setPensioner} label="Pension-age claimant (national CTR rules)" />
              <Toggle checked={onPassporting} onChange={setOnPassporting} label="On a passporting benefit (e.g. Guarantee Pension Credit, income-based JSA/ESA)" />
            </div>
          </Panel>
        </div>
      }
      results={
        r.blocked ? (
          <Callout tone="warn" title="Savings over £16,000">
            With more than £16,000 in savings you usually can't get Council Tax Reduction, unless you're a pensioner on Guarantee Pension Credit.
          </Callout>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Estimated Reduction" value={gbp(r.annualReduction)} sub="Off your annual bill" tone="dark" big />
              <Stat label="You'd Pay" value={gbp(r.remaining)} sub="After support" tone="primary" />
              <Stat label="Per Week" value={gbp(r.weeklyReduction, 2)} sub="Reduction" tone="accent" />
              <Stat label="Reduction" value={pct(r.reductionPct)} sub="Of the bill" />
            </div>

            {r.reductionPct >= 99 && (
              <Callout tone="tip" title="You may pay little or nothing">
                On these figures your council tax could be almost fully covered. Apply through your local council — Council Tax Reduction is never automatic.
              </Callout>
            )}

            <p className="text-[11px] text-on-surface-variant">Estimate only. Each council runs its own working-age scheme with different rules, maximum support and tapers, so your actual reduction may differ. Pensioners follow national rules. Apply via your council.</p>
          </>
        )
      }
    >
      <Guide
        title="Council Tax Reduction (Support) explained"
        intro="Council Tax Reduction — sometimes called Council Tax Support — cuts your council tax bill if you're on a low income. Unlike most benefits it isn't run nationally: every council sets its own scheme for working-age residents, so the rules and generosity vary by area."
      >
        <GuideSection kicker="The basics" title="A local, means-tested discount">
          <p>CTR reduces the council tax you owe based on your income, savings, household and circumstances. It can cover anywhere from a small percentage up to <strong>100%</strong> of the bill. You apply to your local council, not the DWP, and it's separate from other discounts like the 25% single-person discount.</p>
        </GuideSection>

        <GuideSection kicker="Two systems" title="Pensioners vs working age">
          <p>There are effectively two regimes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Pension age:</strong> a national scheme with consistent rules, where the poorest pensioners can get up to 100% off.</li>
            <li><strong>Working age:</strong> each council designs its own scheme. Many cap maximum support below 100% (often 80–90%), so even the poorest residents pay something.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="How it's worked out" title="Income, applicable amount and taper">
          <p>Most schemes compare your income with an "applicable amount" — a figure representing your basic living needs. If you're on a passporting benefit like Guarantee Pension Credit, you usually get maximum support automatically. Otherwise, support reduces as your income rises above the applicable amount, typically by around 20p for each extra pound.</p>
          <Callout tone="warn" title="Savings cut your claim">
            Like other means-tested help, savings over £16,000 usually rule you out (except pensioners on Guarantee Pension Credit), and savings above £6,000 can reduce the award.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A low-income working-age household">
          <p>A household with a £1,800 annual bill, weekly income of £200 against an applicable amount of £160, in a council offering up to 100% support: the £40 excess income reduces the maximum weekly support of about £34.62 by 20% of £40 (£8), leaving roughly £26.62 a week — about £1,384 a year off the bill, so they'd pay around £416.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common Council Tax Support mistakes">
          <Mistakes items={[
            ['Not applying', 'CTR is never automatic — you must claim it from your council even if you get other benefits.'],
            ['Assuming you can get 100%', 'Many working-age schemes cap support below 100%, so check your council\'s rules.'],
            ['Forgetting other discounts', 'CTR is separate from single-person, student and disability discounts, which can stack.'],
            ['Not reporting changes', 'Income, household or savings changes affect your award and must be reported.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is Council Tax Reduction the same everywhere?', a: 'No. Working-age schemes are set locally and vary widely. Pension-age support follows national rules.' },
            { q: 'Can I get 100% off my council tax?', a: 'Possibly — pensioners on the lowest incomes can, and some councils offer 100% for working-age residents, but many cap it lower.' },
            { q: 'Does it stack with other discounts?', a: 'Yes. CTR is applied alongside discounts such as the 25% single-person discount and student exemptions.' },
            { q: 'How do I apply?', a: 'Through your local council\'s website. You can often claim it at the same time as Universal Credit, but it is a separate application.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/council-tax-support-checker" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
