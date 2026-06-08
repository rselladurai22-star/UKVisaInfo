'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, Toggle, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const LPA_FEE = 82;            // per LPA registration (England & Wales)
const SOLICITOR_PER_LPA = 200; // typical mid-point

type Help = 'none' | 'reduced' | 'exempt';

const RELATED = [
  { href: '/will-writing-cost', label: 'Will Writing Cost', hint: 'DIY vs solicitor' },
  { href: '/estate-value-calculator', label: 'Estate Value', hint: 'Net estate for IHT' },
  { href: '/probate-fee-calculator', label: 'Probate Fees', hint: 'Court + solicitor costs' },
  { href: '/inheritance-tax', label: 'Inheritance Tax', hint: 'Full IHT calculation' },
];

export default function PowerOfAttorneyCost() {
  const [people, setPeople] = useState<1 | 2>(1);
  const [property, setProperty] = useState(true);
  const [health, setHealth] = useState(true);
  const [useSolicitor, setUseSolicitor] = useState(false);
  const [help, setHelp] = useState<Help>('none');

  const r = useMemo(() => {
    const typesPerPerson = (property ? 1 : 0) + (health ? 1 : 0);
    const totalLpas = typesPerPerson * people;

    let feePerLpa = LPA_FEE;
    if (help === 'reduced') feePerLpa = LPA_FEE / 2; // 50% remission
    if (help === 'exempt') feePerLpa = 0;            // full exemption

    const registrationFees = totalLpas * feePerLpa;
    const solicitorFees = useSolicitor ? totalLpas * SOLICITOR_PER_LPA : 0;
    const total = registrationFees + solicitorFees;

    return { totalLpas, registrationFees, solicitorFees, total, feePerLpa };
  }, [people, property, health, useSolicitor, help]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Estate', href: '/category/estate' }, { label: 'Power of Attorney Cost' }]}
      title="Power of Attorney Cost Calculator"
      subtitle="Work out the cost of setting up Lasting Powers of Attorney (LPAs) in England & Wales for 2025/26 — the £82 registration fee plus any solicitor costs."
      calcLabel="Estimate LPA Cost"
      inputs={
        <Panel title="Your LPAs">
          <div className="space-y-4">
            <Field label="How many people?">
              <Choice<'1' | '2'>
                name="people"
                value={String(people) as '1' | '2'}
                onChange={(v) => setPeople(v === '2' ? 2 : 1)}
                options={[
                  { value: '1', label: 'Just me', desc: 'One person' },
                  { value: '2', label: 'A couple', desc: 'Two people, e.g. partners' },
                ]}
              />
            </Field>
            <Toggle checked={property} onChange={setProperty} label="Property & Financial Affairs LPA" />
            <Toggle checked={health} onChange={setHealth} label="Health & Welfare LPA" />
            <Toggle checked={useSolicitor} onChange={setUseSolicitor} label="Use a solicitor to prepare them" />
            <Field label="Help with fees (low income)">
              <Choice<Help>
                name="help"
                value={help}
                onChange={setHelp}
                options={[
                  { value: 'none', label: 'Pay full fee', desc: '£82 per LPA' },
                  { value: 'reduced', label: '50% remission', desc: 'Income under £12,000' },
                  { value: 'exempt', label: 'Full exemption', desc: 'On certain benefits' },
                ]}
              />
            </Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total Cost" value={gbp(r.total)} sub={`${r.totalLpas} LPA${r.totalLpas === 1 ? '' : 's'}`} tone="dark" big />
            <Stat label="Registration Fees" value={gbp(r.registrationFees)} sub={`${gbp(r.feePerLpa)} each`} tone="primary" />
            <Stat label="Solicitor Fees" value={gbp(r.solicitorFees)} sub={useSolicitor ? `~${gbp(SOLICITOR_PER_LPA)} per LPA` : 'None — DIY'} tone="accent" />
            <Stat label="LPAs Needed" value={String(r.totalLpas)} sub="Types × people" />
          </div>

          {!useSolicitor && (
            <Callout tone="tip" title="You can apply yourself">
              Most people set up LPAs themselves online or on paper through the Office of the Public Guardian, paying only the £82 registration fee per document — no solicitor required.
            </Callout>
          )}
          {help !== 'none' && (
            <Callout tone="info" title="Reduced fees available">
              If your gross income is under £12,000 you can apply for a 50% reduction, and certain means-tested benefits qualify for full exemption from the £82 fee.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for England & Wales, 2025/26. Scotland and Northern Ireland have different systems and fees. Solicitor costs are indicative — get quotes.</p>
        </>
      }
    >
      <Guide
        title="Lasting Power of Attorney costs explained (2025/26)"
        intro="A Lasting Power of Attorney (LPA) lets someone you trust make decisions for you if you lose mental capacity. There are two types, and each must be registered for £82. This guide covers what they cost, whether you need a solicitor, and how to pay less."
      >
        <GuideSection kicker="The two types" title="Property & Financial, and Health & Welfare">
          <p>There are two separate LPAs in England and Wales, and most people set up both:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Property &amp; Financial Affairs:</strong> lets your attorney manage money, bills, property and investments. It can be used while you still have capacity, with your permission.</li>
            <li><strong>Health &amp; Welfare:</strong> covers medical care, where you live and life-sustaining treatment. It can only be used once you have lost capacity.</li>
          </ul>
          <p>Each LPA is registered separately and costs <strong>£82</strong>. A couple wanting both types therefore needs four LPAs at £328 in fees.</p>
        </GuideSection>

        <GuideSection kicker="Do you need a solicitor?" title="DIY vs professional help">
          <p>You can complete and register LPAs yourself through the Office of the Public Guardian (OPG), online or on paper, paying only the registration fee. A solicitor typically charges £150–£300 per LPA on top, which can be worth it for complex family situations, business interests, or to ensure the forms are watertight.</p>
        </GuideSection>

        <GuideSection kicker="Paying less" title="Fee reductions and exemptions">
          <p>The £82 fee can be reduced or waived:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>50% reduction</strong> if your gross annual income is less than £12,000.</li>
            <li><strong>Full exemption</strong> if you receive certain means-tested benefits such as Income Support, income-based ESA or Guarantee Pension Credit.</li>
          </ul>
          <Callout tone="warn" title="Register while you have capacity">
            An LPA must be made and registered while you still have mental capacity. Leave it too late and your family may have to apply to the Court of Protection instead — far slower and more expensive.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A couple setting up both LPAs">
          <p>A married couple each want a Property &amp; Financial and a Health &amp; Welfare LPA — four LPAs in total. Doing it themselves, that is 4 × £82 = <strong>£328</strong> in registration fees and nothing else. Using a solicitor at around £200 per LPA would add about £800, taking the total to roughly £1,128.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common LPA mistakes">
          <Mistakes items={[
            ['Leaving it too late', 'You can only make an LPA while you have capacity; after that it is the Court of Protection, which costs far more.'],
            ['Only setting up one type', 'A financial LPA does not cover medical decisions, and vice versa — most people need both.'],
            ['Choosing the wrong attorney', 'Pick someone you trust completely; they will have significant control over your affairs.'],
            ['Not telling anyone it exists', 'Attorneys and family should know the LPA exists and where to find it.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much is an LPA in 2025/26?', a: 'The registration fee is £82 per LPA in England and Wales. There are two types, so registering both costs £164 per person.' },
            { q: 'Can I do it without a solicitor?', a: 'Yes. Many people register LPAs themselves through the Office of the Public Guardian, paying only the £82 fee.' },
            { q: 'How long does registration take?', a: 'The OPG currently takes up to around 20 weeks to register an LPA, so apply well before you expect to need it.' },
            { q: 'Is an LPA the same across the UK?', a: 'No. England and Wales use LPAs; Scotland has Continuing and Welfare Powers of Attorney; Northern Ireland has its own system, with different fees.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
