'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

// 2025/26 monthly standard allowances
const STD = {
  single_u25: 316.98,
  single_25: 400.14,
  couple_u25: 497.55,
  couple_25: 628.10,
};
const CHILD_FIRST = 339.00;    // first child born before 6 Apr 2017
const CHILD_OTHER = 292.81;    // other children (2-child limit)
const LCWRA = 423.27;          // limited capability for work & work-related activity
const WORK_ALLOWANCE_LOWER = 411;  // with housing support
const WORK_ALLOWANCE_HIGHER = 684; // without housing support
const TAPER = 0.55;

type Claimant = 'single_u25' | 'single_25' | 'couple_u25' | 'couple_25';

const RELATED = [
  { href: '/childcare-calculator', label: 'Childcare Costs', hint: '85% UC childcare element' },
  { href: '/council-tax-support-checker', label: 'Council Tax Support', hint: 'Reduction eligibility' },
  { href: '/carers-allowance-calculator', label: "Carer's Allowance", hint: '£83.30/week' },
  { href: '/pip-benefit-checker', label: 'PIP Checker', hint: 'Daily living + mobility' },
];

export default function UniversalCredit() {
  const [claimant, setClaimant] = useState<Claimant>('single_25');
  const [children, setChildren] = useState(0);
  const [rent, setRent] = useState(0);
  const [lcwra, setLcwra] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [savings, setSavings] = useState(0);

  const r = useMemo(() => {
    const standard = STD[claimant];
    const childElement = children > 0 ? CHILD_FIRST + Math.max(0, children - 1) * CHILD_OTHER : 0;
    const housing = Math.max(0, rent);
    const lcwraEl = lcwra ? LCWRA : 0;
    const maxUC = standard + childElement + housing + lcwraEl;

    // Work allowance applies if children or LCWRA
    const hasWorkAllowance = children > 0 || lcwra;
    const workAllowance = hasWorkAllowance ? (housing > 0 ? WORK_ALLOWANCE_LOWER : WORK_ALLOWANCE_HIGHER) : 0;
    const earningsReduction = Math.max(0, earnings - workAllowance) * TAPER;

    // Capital: over £16,000 = no UC; £6,000 to £16,000 tariff income £4.35 per £250
    let capitalReduction = 0;
    let capitalBlocks = false;
    if (savings > 16000) capitalBlocks = true;
    else if (savings > 6000) capitalReduction = Math.ceil((savings - 6000) / 250) * 4.35;

    const award = capitalBlocks ? 0 : Math.max(0, maxUC - earningsReduction - capitalReduction);

    return { standard, childElement, housing, lcwraEl, maxUC, workAllowance, earningsReduction, capitalReduction, capitalBlocks, award };
  }, [claimant, children, rent, lcwra, earnings, savings]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Benefits', href: '/category/benefits' }, { label: 'Universal Credit' }]}
      title="Universal Credit Calculator"
      subtitle="Estimate your monthly Universal Credit for 2025/26, standard allowance plus child, housing and disability elements, less the 55% earnings taper."
      calcLabel="Estimate Universal Credit"
      inputs={
        <div className="space-y-4">
          <Panel title="Your Household">
            <div className="space-y-4">
              <Field label="Who is claiming?">
                <Choice<Claimant>
                  name="claimant"
                  value={claimant}
                  onChange={setClaimant}
                  options={[
                    { value: 'single_25', label: 'Single, 25 or over', desc: `£${STD.single_25}/mo` },
                    { value: 'single_u25', label: 'Single, under 25', desc: `£${STD.single_u25}/mo` },
                    { value: 'couple_25', label: 'Couple, one 25 or over', desc: `£${STD.couple_25}/mo` },
                    { value: 'couple_u25', label: 'Couple, both under 25', desc: `£${STD.couple_u25}/mo` },
                  ]}
                />
              </Field>
              <Field label="Number of children" hint="Two-child limit applies to most"><NumberInput value={children} onChange={setChildren} min={0} step={1} /></Field>
              <Field label="Monthly rent (housing element)"><MoneyInput value={rent} onChange={setRent} step={50} /></Field>
              <Toggle checked={lcwra} onChange={setLcwra} label="Limited capability for work (LCWRA)" />
            </div>
          </Panel>
          <Panel title="Income & Savings">
            <div className="space-y-4">
              <Field label="Monthly take-home earnings"><MoneyInput value={earnings} onChange={setEarnings} step={50} /></Field>
              <Field label="Savings & capital"><MoneyInput value={savings} onChange={setSavings} step={500} /></Field>
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Monthly Universal Credit" value={gbp(r.award)} sub="Estimated award" tone="dark" big />
            <Stat label="Maximum UC" value={gbp(r.maxUC)} sub="Before earnings taper" tone="primary" />
            <Stat label="Earnings Reduction" value={gbp(r.earningsReduction)} sub="55% above work allowance" tone="accent" />
            <Stat label="Per Year" value={gbp(r.award * 12)} sub="Estimated annual" />
          </div>

          <Panel title="How it's built">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Standard allowance</span><span className="font-semibold tabular-nums">{gbp(r.standard)}</span></div>
              {r.childElement > 0 && <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Child element</span><span className="font-semibold tabular-nums">{gbp(r.childElement)}</span></div>}
              {r.housing > 0 && <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Housing element</span><span className="font-semibold tabular-nums">{gbp(r.housing)}</span></div>}
              {r.lcwraEl > 0 && <div className="flex justify-between"><span className="text-on-surface-variant font-medium">LCWRA element</span><span className="font-semibold tabular-nums">{gbp(r.lcwraEl)}</span></div>}
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− Earnings taper</span><span className="font-semibold tabular-nums text-primary">−{gbp(r.earningsReduction)}</span></div>
              {r.capitalReduction > 0 && <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− Tariff income (savings)</span><span className="font-semibold tabular-nums text-primary">−{gbp(r.capitalReduction)}</span></div>}
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Monthly award</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.award)}</span></div>
            </div>
          </Panel>

          {r.capitalBlocks && (
            <Callout tone="warn" title="Savings over £16,000">
              With more than £16,000 in savings or capital you cannot usually claim Universal Credit at all.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26. Simplified: excludes carer element, childcare costs, deductions and benefit cap. Use the official gov.uk calculator or an adviser for a precise figure.</p>
        </>
      }
    >
      <Guide
        title="Universal Credit explained (2025/26)"
        intro="Universal Credit (UC) is the main working-age benefit, replacing six older benefits with a single monthly payment. It's made up of a standard allowance plus extra elements, reduced as you earn. Here's how the calculation works."
      >
        <GuideSection kicker="The structure" title="Standard allowance plus elements">
          <p>Your maximum UC is a <strong>standard allowance</strong> based on your age and whether you're single or a couple, plus extra <strong>elements</strong> for:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Children</strong>, an amount per child, subject to the two-child limit for most families.</li>
            <li><strong>Housing</strong>, help with rent, up to local limits.</li>
            <li><strong>Disability</strong>, the LCWRA element if you have limited capability for work.</li>
            <li><strong>Childcare</strong>, up to 85% of childcare costs (handled separately).</li>
            <li><strong>Carer</strong>, for those caring 35+ hours a week.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Earnings" title="The 55% taper and work allowance">
          <p>UC is reduced as you earn, but not pound for pound. If you have children or limited capability for work, you get a <strong>work allowance</strong>, earnings you can keep before any reduction (£411/month if you get housing support, £684 if not). Above that, UC falls by <strong>55p for every £1</strong> of net earnings. This taper means work always leaves you better off overall.</p>
        </GuideSection>

        <GuideSection kicker="Savings" title="The capital rules">
          <p>Savings affect your claim:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Under £6,000: ignored.</li>
            <li>£6,000 to £16,000: treated as "tariff income" of £4.35 a month per £250 (or part) above £6,000.</li>
            <li>Over £16,000: no Universal Credit at all.</li>
          </ul>
          <Callout tone="warn" title="The £16,000 cliff">
            Capital over £16,000 stops your claim entirely, even with a low income. Some capital (like a pension pot for working-age claimants) is disregarded, check the rules.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Single parent, one child, working part-time">
          <p>A single claimant over 25 (£400.14) with one child (£339.00) and £600 rent has a maximum UC of about £1,339 a month. Earning £800 a month with the £411 work allowance, the taper removes 55% of £389 = about £214, leaving roughly £1,125 of UC plus their wages.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common Universal Credit mistakes">
          <Mistakes items={[
            ['Not reporting changes', 'Income, rent, children and savings changes must be reported promptly or you risk overpayments and penalties.'],
            ['Forgetting the childcare element', 'You can reclaim up to 85% of childcare costs, but you must pay first and claim back, and report it each month.'],
            ['Assuming work does not pay', 'The 55% taper and work allowance mean you keep a meaningful share of every pound earned.'],
            ['Ignoring the benefit cap', 'A separate overall cap can limit total benefits for some households, especially with high rents.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How is Universal Credit paid?', a: 'As a single monthly payment in arrears, usually into your bank account, covering you and your partner if you have one.' },
            { q: 'Does working stop my Universal Credit?', a: 'No. UC is designed to top up low earnings; it reduces gradually via the 55% taper, so you keep more as you earn.' },
            { q: 'What is the two-child limit?', a: 'For most families, the child element is only paid for the first two children born after 6 April 2017, with limited exceptions.' },
            { q: 'Can I get UC with savings?', a: 'Yes up to £16,000, though savings over £6,000 reduce your award through tariff income. Over £16,000 you cannot usually claim.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/universal-credit-calculator" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
