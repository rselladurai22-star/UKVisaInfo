'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, Choice, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

const COURT_FEE = 593;          // divorce application fee, England & Wales
const CONSENT_ORDER_FEE = 53;   // court fee to seal a financial consent order

type Route = 'diy' | 'solicitor' | 'contested';

const SOLICITOR: Record<Route, [number, number]> = {
  diy: [0, 0],
  solicitor: [600, 1500],
  contested: [3000, 15000],
};

const RELATED = [
  { href: '/financial-settlement-calculator', label: 'Financial Settlement', hint: 'Asset split estimate' },
  { href: '/child-maintenance-calculator', label: 'Child Maintenance', hint: 'CMS formula' },
  { href: '/spousal-maintenance-calculator', label: 'Spousal Maintenance', hint: 'Ongoing support' },
  { href: '/will-writing-cost', label: 'Will Writing Cost', hint: 'Update your will after divorce' },
];

export default function DivorceCost() {
  const [route, setRoute] = useState<Route>('solicitor');
  const [financialOrder, setFinancialOrder] = useState(true);
  const [mediation, setMediation] = useState(false);

  const r = useMemo(() => {
    const [solLow, solHigh] = SOLICITOR[route];
    const financial = financialOrder ? CONSENT_ORDER_FEE : 0;
    const financialLegalLow = financialOrder ? (route === 'diy' ? 0 : 500) : 0;
    const financialLegalHigh = financialOrder ? (route === 'diy' ? 300 : 1500) : 0;
    const mediationCost = mediation ? 500 : 0;

    const low = COURT_FEE + financial + solLow + financialLegalLow + mediationCost;
    const high = COURT_FEE + financial + solHigh + financialLegalHigh + mediationCost;
    return { low, high, solLow, solHigh, financial, mediationCost };
  }, [route, financialOrder, mediation]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Family Law', href: '/category/family-law' }, { label: 'Divorce Cost' }]}
      title="Divorce Cost Calculator"
      subtitle="Estimate the cost of divorce in England & Wales — the £593 court fee plus solicitor and financial-order costs, depending on how you proceed."
      calcLabel="Estimate Divorce Cost"
      inputs={
        <Panel title="Your Divorce">
          <div className="space-y-4">
            <Field label="How are you proceeding?">
              <Choice<Route>
                name="route"
                value={route}
                onChange={setRoute}
                options={[
                  { value: 'diy', label: 'DIY (no solicitor)', desc: 'Just the court fee' },
                  { value: 'solicitor', label: 'Solicitor, uncontested', desc: 'Amicable, agreed' },
                  { value: 'contested', label: 'Contested / complex', desc: 'Disputes over finances or children' },
                ]}
              />
            </Field>
            <Toggle checked={financialOrder} onChange={setFinancialOrder} label="Include a financial order (consent order)" />
            <Toggle checked={mediation} onChange={setMediation} label="Include mediation (~£500)" />
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Estimated Total" value={route === 'diy' && !financialOrder ? gbp(r.low) : `${gbp(r.low)}–${gbp(r.high)}`} sub="Court + legal fees" tone="dark" big />
            <Stat label="Court Fee" value={gbp(COURT_FEE)} sub="Divorce application" tone="primary" />
            <Stat label="Solicitor Fees" value={route === 'diy' ? '£0' : `${gbp(r.solLow)}–${gbp(r.solHigh)}`} sub={route === 'contested' ? 'Contested' : route === 'solicitor' ? 'Uncontested' : 'DIY'} tone="accent" />
            <Stat label="Financial Order" value={financialOrder ? gbp(r.financial) + '+' : '£0'} sub={financialOrder ? 'Court fee + legal' : 'Not included'} />
          </div>

          {route === 'diy' && (
            <Callout tone="tip" title="DIY divorce is cheap but limited">
              For a straightforward, agreed divorce you can apply online yourself for the £593 court fee. But always get a financial order — without one, your ex can make a financial claim against you years later.
            </Callout>
          )}
          {route === 'contested' && (
            <Callout tone="warn" title="Contested divorces cost the most">
              Disputes over money or children drive costs up quickly, often into five figures each. Mediation is usually far cheaper than fighting it out in court.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for England & Wales, 2025/26. Scotland has a separate process. Fee remission (Help with Fees) may cover the £593 court fee on a low income. Solicitor ranges are indicative.</p>
        </>
      }
    >
      <Guide
        title="How much does a divorce cost in the UK?"
        intro="Since 2022, England and Wales have a 'no-fault' divorce process that's simpler and can be done online. The court fee is fixed at £593, but the real cost depends on whether you use a solicitor and — crucially — how you sort out money and children."
      >
        <GuideSection kicker="The court fee" title="A fixed £593">
          <p>The divorce application fee in England and Wales is <strong>£593</strong>, paid to the court. It's the same whether you apply jointly or on your own, and whether or not you use a solicitor. If you're on a low income or certain benefits, the Help with Fees scheme may reduce or waive it.</p>
        </GuideSection>

        <GuideSection kicker="The big variable" title="Solicitor costs">
          <p>Legal fees are where divorces differ enormously:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>DIY:</strong> just the £593 fee if you complete the online process yourself.</li>
            <li><strong>Uncontested with a solicitor:</strong> typically £600–£1,500 for guiding you through an amicable divorce.</li>
            <li><strong>Contested or complex:</strong> disputes over money or children can run to many thousands of pounds each, sometimes far more.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Finances" title="Why you need a financial order">
          <p>The divorce itself doesn't settle money. To make a financial agreement legally binding you need a <strong>financial (consent) order</strong>, which costs a £53 court fee plus any legal fees to draft it. Without one, a former spouse can bring a financial claim against you years later — even after the divorce is final. This is the single most important step many DIY divorcers skip.</p>
          <Callout tone="warn" title="A clean break needs a court order">
            Only a sealed financial order can give you a 'clean break'. An informal agreement, however amicable, leaves the door open to future claims.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="An amicable divorce with a consent order">
          <p>A couple divorcing amicably with a solicitor handling an uncontested case and drafting a consent order might pay: £593 court fee + roughly £1,000 solicitor for the divorce + £53 consent-order fee + about £600 to draft the order — around £2,250 in total, split between them or shared.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common divorce cost mistakes">
          <Mistakes items={[
            ['Skipping the financial order', 'Without a sealed consent order, financial claims can resurface years later.'],
            ['Litigating instead of mediating', 'Court battles are the most expensive route; mediation is usually far cheaper.'],
            ['Forgetting to update your will', 'Divorce affects your will and beneficiaries — review it promptly.'],
            ['Not checking Help with Fees', 'Low-income applicants may get the £593 fee reduced or waived.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much is the divorce court fee?', a: 'It is £593 in England and Wales, regardless of whether you use a solicitor or apply jointly.' },
            { q: 'Can I divorce without a solicitor?', a: 'Yes. The no-fault process can be done online yourself, but it is wise to get legal advice on the financial settlement.' },
            { q: 'Do I need a financial order?', a: 'Strongly recommended. Only a court-sealed financial order makes your money agreement binding and enables a clean break.' },
            { q: 'How long does a divorce take?', a: 'The no-fault process has a built-in minimum of about 26 weeks (six months) from application to final order.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/divorce-cost-calculator" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
