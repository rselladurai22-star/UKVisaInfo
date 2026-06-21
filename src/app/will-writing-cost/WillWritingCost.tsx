'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, Choice, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

type Route = 'diy' | 'online' | 'writer' | 'solicitor';
type Complexity = 'simple' | 'moderate' | 'complex';

const BASE: Record<Route, [number, number]> = {
  diy: [0, 50],
  online: [80, 200],
  writer: [100, 300],
  solicitor: [150, 400],
};

const COMPLEXITY_ADD: Record<Complexity, [number, number]> = {
  simple: [0, 0],
  moderate: [50, 150],
  complex: [300, 800],
};

const RELATED = [
  { href: '/power-of-attorney-cost', label: 'Power of Attorney', hint: 'LPA fees & process' },
  { href: '/estate-value-calculator', label: 'Estate Value', hint: 'Net estate for IHT' },
  { href: '/probate-fee-calculator', label: 'Probate Fees', hint: 'Court + solicitor costs' },
  { href: '/inheritance-tax', label: 'Inheritance Tax', hint: 'Full IHT calculation' },
];

export default function WillWritingCost() {
  const [route, setRoute] = useState<Route>('solicitor');
  const [complexity, setComplexity] = useState<Complexity>('simple');
  const [mirror, setMirror] = useState(false);

  const r = useMemo(() => {
    const [bLow, bHigh] = BASE[route];
    const [cLow, cHigh] = COMPLEXITY_ADD[complexity];
    let low = bLow + cLow;
    let high = bHigh + cHigh;
    if (mirror) {
      // a second mirror will is usually discounted, not full price
      low = Math.round(low * 1.6);
      high = Math.round(high * 1.8);
    }
    return { low, high };
  }, [route, complexity, mirror]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Estate', href: '/category/estate' }, { label: 'Will Writing Cost' }]}
      title="Will Writing Cost Calculator"
      subtitle="Estimate the cost of writing a will in the UK for 2025/26, from free DIY kits to solicitor-drafted wills with trusts."
      calcLabel="Estimate Will Cost"
      inputs={
        <Panel title="Your Will">
          <div className="space-y-4">
            <Field label="How will you make it?">
              <Choice<Route>
                name="route"
                value={route}
                onChange={setRoute}
                options={[
                  { value: 'diy', label: 'DIY kit / template', desc: 'Cheapest, highest risk of errors' },
                  { value: 'online', label: 'Online will service', desc: 'Guided, checked by some providers' },
                  { value: 'writer', label: 'Will writer', desc: 'Unregulated specialist' },
                  { value: 'solicitor', label: 'Solicitor', desc: 'Regulated legal advice' },
                ]}
              />
            </Field>
            <Field label="Complexity">
              <Choice<Complexity>
                name="complexity"
                value={complexity}
                onChange={setComplexity}
                options={[
                  { value: 'simple', label: 'Simple', desc: 'Everything to spouse / children' },
                  { value: 'moderate', label: 'Moderate', desc: 'Several beneficiaries, specific gifts' },
                  { value: 'complex', label: 'Complex', desc: 'Trusts, business, blended family' },
                ]}
              />
            </Field>
            <Toggle checked={mirror} onChange={setMirror} label="Mirror wills for a couple" />
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Estimated Cost" value={`${gbp(r.low)}, ${gbp(r.high)}`} sub={mirror ? 'Both mirror wills' : 'Single will'} tone="dark" big />
            <Stat label="Route" value={route === 'diy' ? 'DIY' : route === 'online' ? 'Online' : route === 'writer' ? 'Will writer' : 'Solicitor'} sub="Chosen method" tone="primary" />
          </div>

          {route === 'diy' && (
            <Callout tone="warn" title="Cheap can be costly">
              DIY wills are free or near-free but are the leading cause of invalid wills, wrong witnessing, ambiguous wording or missing signatures can make the whole will fail, forcing intestacy.
            </Callout>
          )}
          {complexity === 'complex' && (
            <Callout tone="tip" title="Get regulated advice">
              For trusts, business assets or blended families, a solicitor's fee is small next to the tax and disputes a badly-drafted will can cause.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Indicative 2025/26 market ranges, not quotes. Some charities offer free will-writing schemes (e.g. Free Wills Month, Will Aid). Prices vary by region and firm.</p>
        </>
      }
    >
      <Guide
        title="How much does a will cost in the UK?"
        intro="A will is the only way to control who inherits your estate and to appoint guardians for your children. Costs range from nothing for a DIY kit to several hundred pounds for a solicitor, and complex estates cost more. Here's what drives the price and where to save safely."
      >
        <GuideSection kicker="The options" title="Four ways to make a will">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>DIY kit or template (£0 to £50):</strong> a paper or downloadable form. Cheapest, but easy to get wrong.</li>
            <li><strong>Online will service (£80 to £200):</strong> a guided questionnaire, sometimes checked by a professional.</li>
            <li><strong>Will writer (£100 to £300):</strong> a specialist, but the industry is largely unregulated.</li>
            <li><strong>Solicitor (£150 to £400+):</strong> regulated legal advice with professional-indemnity insurance.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="What raises the price" title="Complexity and couples">
          <p>A simple "everything to my spouse, then the children" will is cheap. Costs rise when you add trusts (for young children, vulnerable beneficiaries or to protect against care fees), business or agricultural assets, foreign property, or a blended family with stepchildren. <strong>Mirror wills</strong> for a couple, two near-identical wills, usually cost less than two separate wills because the work overlaps.</p>
        </GuideSection>

        <GuideSection kicker="Saving safely" title="Free and low-cost routes">
          <p>You don't always have to pay full price:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Free Wills Month</strong> (March and October), solicitors write simple wills free for those over 55, in return for an optional charity gift.</li>
            <li><strong>Will Aid</strong> (November), solicitors waive their fee for a donation to charity.</li>
            <li>Some employers and unions offer free or subsidised will-writing as a benefit.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A couple with young children">
          <p>A married couple with two young children want mirror wills naming guardians and leaving everything to each other, then to the children. A solicitor might charge around £300 to £500 for both mirror wills. Adding a trust to hold the children's inheritance until age 25 could push it towards £700 to £900. Against an estate of several hundred thousand pounds, that is money well spent for certainty.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common will mistakes">
          <Mistakes items={[
            ['Invalid witnessing', 'A will must be signed by you and witnessed by two people who are not beneficiaries, get this wrong and it fails.'],
            ['Never updating it', 'Marriage usually revokes an existing will; divorce, new children and house moves all warrant a review.'],
            ['Using a cheap will for a complex estate', 'Trusts and blended families need proper drafting; a template can create unintended tax or disputes.'],
            ['Not storing it safely', 'Executors must be able to find the original signed will; tell them where it is.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is a DIY will legally valid?', a: 'It can be, if correctly signed and witnessed. But errors are common and only come to light after death, when they cannot be fixed.' },
            { q: 'Do I need a solicitor?', a: 'Not legally, but for trusts, business assets, foreign property or blended families, regulated advice is strongly recommended.' },
            { q: 'What are mirror wills?', a: 'Two almost identical wills, usually for a couple, leaving everything to each other and then to the same beneficiaries. They are cheaper than two separate wills.' },
            { q: 'How often should I update my will?', a: 'Review it every five years or after any major life event, marriage, divorce, a new child, or a significant change in assets.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
