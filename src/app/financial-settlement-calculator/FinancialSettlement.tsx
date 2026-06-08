'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Choice,
  Donut, Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

type Carer = 'none' | 'you' | 'them';

const RELATED = [
  { href: '/divorce-cost-calculator', label: 'Divorce Cost', hint: 'Court + legal fees' },
  { href: '/spousal-maintenance-calculator', label: 'Spousal Maintenance', hint: 'Ongoing support' },
  { href: '/child-maintenance-calculator', label: 'Child Maintenance', hint: 'CMS formula' },
  { href: '/inheritance-tax', label: 'Inheritance Tax', hint: 'Update estate planning' },
];

export default function FinancialSettlement() {
  const [houseEquity, setHouseEquity] = useState(250000);
  const [savings, setSavings] = useState(40000);
  const [pensions, setPensions] = useState(120000);
  const [otherAssets, setOtherAssets] = useState(20000);
  const [debts, setDebts] = useState(15000);
  const [marriageYears, setMarriageYears] = useState(15);
  const [carer, setCarer] = useState<Carer>('you');

  const r = useMemo(() => {
    const netAssets = Math.max(0, houseEquity + savings + pensions + otherAssets - debts);

    // Starting point: 50/50 for a long marriage. Short marriages may depart from equality.
    let yourShare = 0.5;
    if (marriageYears < 5) yourShare = 0.5; // still default but note in guide
    // Needs adjustment: primary carer of children often needs a larger share for housing
    if (carer === 'you') yourShare += 0.08;
    if (carer === 'them') yourShare -= 0.08;
    yourShare = Math.min(0.7, Math.max(0.3, yourShare));

    const yours = netAssets * yourShare;
    const theirs = netAssets - yours;
    return { netAssets, yourShare, yours, theirs };
  }, [houseEquity, savings, pensions, otherAssets, debts, marriageYears, carer]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Family Law', href: '/category/family-law' }, { label: 'Financial Settlement' }]}
      title="Divorce Financial Settlement Calculator"
      subtitle="Get a rough starting-point estimate of how matrimonial assets might be split on divorce — the courts start at equality and adjust for needs."
      calcLabel="Estimate Settlement"
      inputs={
        <div className="space-y-4">
          <Panel title="The Matrimonial Pot">
            <div className="space-y-4">
              <Field label="Property equity"><MoneyInput value={houseEquity} onChange={setHouseEquity} step={10000} /></Field>
              <Field label="Savings & investments"><MoneyInput value={savings} onChange={setSavings} step={5000} /></Field>
              <Field label="Pensions (combined value)"><MoneyInput value={pensions} onChange={setPensions} step={10000} /></Field>
              <Field label="Other assets"><MoneyInput value={otherAssets} onChange={setOtherAssets} step={5000} /></Field>
              <Field label="Debts"><MoneyInput value={debts} onChange={setDebts} step={1000} /></Field>
            </div>
          </Panel>
          <Panel title="Circumstances">
            <div className="space-y-4">
              <Field label="Length of marriage (years)"><NumberInput value={marriageYears} onChange={setMarriageYears} min={0} step={1} suffix=" yrs" /></Field>
              <Field label="Primary carer of children">
                <Choice<Carer>
                  name="carer"
                  value={carer}
                  onChange={setCarer}
                  options={[
                    { value: 'you', label: 'You', desc: 'Children mainly with you' },
                    { value: 'them', label: 'Your ex', desc: 'Children mainly with them' },
                    { value: 'none', label: 'No children / shared', desc: 'No housing-need skew' },
                  ]}
                />
              </Field>
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Your Estimated Share" value={gbp(r.yours)} sub={pct(r.yourShare * 100)} tone="dark" big />
            <Stat label="Their Estimated Share" value={gbp(r.theirs)} sub={pct((1 - r.yourShare) * 100)} tone="primary" />
            <Stat label="Total Net Assets" value={gbp(r.netAssets)} sub="The matrimonial pot" tone="accent" />
            <Stat label="Marriage Length" value={`${marriageYears} yrs`} sub={marriageYears >= 5 ? 'Equality starting point' : 'Short — may depart from 50/50'} />
          </div>

          <Panel title="The split">
            <Donut
              centerLabel="Net assets"
              centerValue={gbp(r.netAssets)}
              segments={[
                { value: r.yours, color: PRIMARY, label: 'Your share' },
                { value: r.theirs, color: ACCENT, label: 'Their share' },
              ]}
            />
          </Panel>

          <Callout tone="warn" title="This is only a starting point">
            Real settlements depend heavily on each party's needs, earning capacity, contributions and the children's housing — there is no fixed formula. Always take legal advice and consider a court-sealed consent order.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Very rough estimate for England & Wales. Courts start from equal sharing of matrimonial property and adjust for needs and fairness under s25 of the Matrimonial Causes Act. Pensions are often shared by a pension sharing order.</p>
        </>
      }
    >
      <Guide
        title="How divorce financial settlements work"
        intro="There's no rigid formula for dividing money on divorce in England and Wales. Courts start from the principle of sharing matrimonial assets equally, then adjust for each person's needs and circumstances. This tool gives a rough starting point, not a prediction."
      >
        <GuideSection kicker="The principle" title="Equal sharing as a starting point">
          <p>For longer marriages, the court's starting point is an <strong>equal (50/50) division</strong> of matrimonial assets — broadly, what was built up during the marriage. This is then adjusted to meet each party's needs, especially housing and the children's welfare, which is the court's first consideration.</p>
        </GuideSection>

        <GuideSection kicker="The factors" title="What the court weighs (s25)">
          <p>Under section 25 of the Matrimonial Causes Act, the court considers:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The welfare of any children (the top priority).</li>
            <li>Each party's income, earning capacity and financial needs.</li>
            <li>The standard of living during the marriage and its length.</li>
            <li>Each party's age, health and contributions (including homemaking).</li>
            <li>The value of assets, including pensions.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Needs" title="Why splits aren't always 50/50">
          <p>Equal sharing often gives way to <strong>needs</strong>. The parent housing the children may receive a larger share of the equity so they can keep a suitable home. In shorter, childless marriages the court may depart from equality, sometimes returning each party to roughly where they started. Pensions are frequently equalised through a pension sharing order.</p>
          <Callout tone="tip" title="Don't forget pensions">
            Pensions are often the second-biggest asset after the home and are regularly overlooked. A pension sharing order can be vital for long-term fairness, especially for a lower-earning spouse.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A 15-year marriage with children">
          <p>A couple with £250,000 equity, £40,000 savings, £120,000 in pensions and £20,000 of other assets, less £15,000 debts, have a net pot of £415,000. Starting at 50/50 (£207,500 each), the court might shift more to the parent housing the children — perhaps 58/42 — so they can rehouse, while balancing the rest through pensions and savings.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common settlement mistakes">
          <Mistakes items={[
            ['Ignoring pensions', 'They can be the largest asset; failing to address them can leave a spouse badly off in retirement.'],
            ['Hiding or guessing assets', 'Full financial disclosure is required; non-disclosure can unravel a settlement later.'],
            ['Settling without a consent order', 'An informal deal is not binding — get it sealed by the court.'],
            ['Assuming a fixed formula', 'There is no set percentage; outcomes turn on needs and fairness, so take advice.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is everything split 50/50 in a divorce?', a: 'Not always. Equal sharing is the starting point for matrimonial assets, but the split is adjusted for needs — especially housing and children.' },
            { q: 'Are pensions included?', a: 'Yes. Pensions are matrimonial assets and are often shared via a pension sharing order, sometimes offset against other assets.' },
            { q: 'Does who caused the divorce matter?', a: 'Generally no. With no-fault divorce, conduct rarely affects the financial split unless it is extreme.' },
            { q: 'Do I need a court order if we agree?', a: 'Yes — a sealed consent order makes the agreement binding and prevents future claims.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/financial-settlement-calculator" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
