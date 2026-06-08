'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const RELATED = [
  { href: '/financial-settlement-calculator', label: 'Financial Settlement', hint: 'Asset split estimate' },
  { href: '/child-maintenance-calculator', label: 'Child Maintenance', hint: 'CMS formula' },
  { href: '/divorce-cost-calculator', label: 'Divorce Cost', hint: 'Court + legal fees' },
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
];

export default function SpousalMaintenance() {
  const [payerNet, setPayerNet] = useState(3500);
  const [recipientNet, setRecipientNet] = useState(1200);
  const [recipientNeeds, setRecipientNeeds] = useState(2200);

  const r = useMemo(() => {
    const needsGap = Math.max(0, recipientNeeds - recipientNet);
    const payerSurplus = Math.max(0, payerNet - recipientNeeds); // very rough affordability proxy
    // Maintenance is the lower of the recipient's shortfall and what the payer can afford,
    // and courts aim for a fair balance — cap at the payer's surplus.
    const maintenance = Math.min(needsGap, payerSurplus);
    const payerAfter = payerNet - maintenance;
    const recipientAfter = recipientNet + maintenance;
    return { needsGap, payerSurplus, maintenance, payerAfter, recipientAfter, annual: maintenance * 12 };
  }, [payerNet, recipientNet, recipientNeeds]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Family Law', href: '/category/family-law' }, { label: 'Spousal Maintenance' }]}
      title="Spousal Maintenance Calculator"
      subtitle="Get a rough, needs-based estimate of spousal maintenance (spousal periodical payments) after divorce in England & Wales."
      calcLabel="Estimate Maintenance"
      inputs={
        <Panel title="Monthly Net Incomes & Needs">
          <div className="space-y-4">
            <Field label="Payer's net monthly income"><MoneyInput value={payerNet} onChange={setPayerNet} step={100} /></Field>
            <Field label="Recipient's net monthly income"><MoneyInput value={recipientNet} onChange={setRecipientNet} step={100} /></Field>
            <Field label="Recipient's reasonable monthly needs" hint="Housing, bills and living costs"><MoneyInput value={recipientNeeds} onChange={setRecipientNeeds} step={100} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Estimated Maintenance" value={gbp(r.maintenance)} sub="Per month" tone="dark" big />
            <Stat label="Per Year" value={gbp(r.annual)} sub="Approximate" tone="primary" />
            <Stat label="Recipient's Shortfall" value={gbp(r.needsGap)} sub="Needs minus income" tone="accent" />
            <Stat label="Payer Left With" value={gbp(r.payerAfter)} sub="After maintenance" />
          </div>

          <Panel title="After maintenance">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Recipient income + maintenance</span><span className="font-semibold tabular-nums">{gbp(r.recipientAfter)}/mo</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Payer income − maintenance</span><span className="font-semibold tabular-nums">{gbp(r.payerAfter)}/mo</span></div>
            </div>
          </Panel>

          <Callout tone="warn" title="There is no fixed formula">
            Unlike child maintenance, spousal maintenance has no set calculation. It's based on one party's needs and the other's ability to pay, with courts increasingly favouring time-limited orders and clean breaks. Treat this as a discussion starting point only.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Very rough estimate for England & Wales. Actual awards depend on all the s25 factors, earning capacity, the length of marriage and the children. Always take legal advice.</p>
        </>
      }
    >
      <Guide
        title="Spousal maintenance explained"
        intro="Spousal maintenance is regular payment from one ex-spouse to the other after divorce, separate from child maintenance. There's no formula — it's based on need and affordability — and the modern trend is towards shorter, time-limited awards or a clean break. Here's how it works."
      >
        <GuideSection kicker="The basics" title="Need and ability to pay">
          <p>Spousal maintenance (technically "periodical payments") may be ordered where one spouse can't meet their reasonable needs from their own income and the other has the means to help. The two key questions are the recipient's <strong>needs</strong> and the payer's <strong>ability to pay</strong> after meeting their own.</p>
        </GuideSection>

        <GuideSection kicker="No formula" title="Why it's discretionary">
          <p>Unlike child maintenance, there is no percentage formula. The court weighs the section 25 factors — incomes, earning capacity, length of marriage, standard of living, age and health. Two similar couples can get different outcomes, which is why early legal advice matters.</p>
        </GuideSection>

        <GuideSection kicker="The modern trend" title="Clean breaks and time limits">
          <p>Courts increasingly favour a <strong>clean break</strong> where possible — a one-off capital settlement instead of ongoing payments — or a <strong>time-limited</strong> order giving the recipient time to become financially independent (for example while children are young or they retrain). Lifelong "joint lives" orders are now rarer.</p>
          <Callout tone="tip" title="Capitalisation is an option">
            Ongoing maintenance can sometimes be 'capitalised' into a larger lump sum, giving both parties certainty and a clean break rather than years of monthly payments.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Bridging a needs gap">
          <p>If the recipient needs £2,200 a month but only earns £1,200, there's a £1,000 shortfall. If the payer earns £3,500 net and can meet their own needs with room to spare, the court might order maintenance towards that gap — though it would also push the recipient to increase their own income over time, often via a time-limited order.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common spousal maintenance mistakes">
          <Mistakes items={[
            ['Confusing it with child maintenance', 'They are separate; child maintenance follows the CMS formula, spousal maintenance does not.'],
            ['Expecting maintenance for life', 'Most modern orders are time-limited or aim for a clean break.'],
            ['Ignoring remarriage and cohabitation', 'Maintenance usually ends on the recipient\'s remarriage and can be varied if they cohabit.'],
            ['Not formalising it', 'Only a court order makes maintenance enforceable and able to be varied later.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is there a formula for spousal maintenance?', a: 'No. It is discretionary and based on the recipient\'s needs and the payer\'s ability to pay, weighed against all the circumstances.' },
            { q: 'How long does spousal maintenance last?', a: 'It varies — from a fixed term to (rarely) joint lives. Courts increasingly prefer time-limited orders or a clean break.' },
            { q: 'Does it stop if my ex remarries?', a: 'Spousal maintenance normally ends automatically on the recipient\'s remarriage, and can be reviewed if they cohabit.' },
            { q: 'Is spousal maintenance taxable?', a: 'No. Spousal maintenance payments are made from taxed income and are not taxable in the recipient\'s hands.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
