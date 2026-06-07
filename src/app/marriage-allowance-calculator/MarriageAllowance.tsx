'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, PA_BASE } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

const SAVING = 252; // 20% of the £1,260 transfer

export default function MarriageAllowance() {
  const [lower, setLower] = useState(8000);
  const [higher, setHigher] = useState(35000);

  const r = useMemo(() => {
    const lowerNonTaxpayer = lower <= PA_BASE;
    const higherBasicRate = higher > PA_BASE && higher <= 50270;
    const eligible = lowerNonTaxpayer && higherBasicRate;
    const annualSaving = eligible ? SAVING : 0;
    const backdated = eligible ? 1258 : 0; // approx 4 prior years
    return { eligible, lowerNonTaxpayer, higherBasicRate, annualSaving, backdated, total: annualSaving + backdated };
  }, [lower, higher]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Marriage Allowance' }]}
      title="Marriage Allowance Calculator"
      subtitle="If one of you earns under the £12,570 personal allowance and the other is a basic-rate taxpayer, you can transfer £1,260 of allowance and save up to £252 a year — plus backdate up to four years."
      calcLabel="Check eligibility"
      inputs={
        <Panel title="Your incomes">
          <div className="space-y-4">
            <Field label="Lower earner's income" hint="The one transferring allowance"><MoneyInput value={lower} onChange={setLower} step={500} /></Field>
            <Field label="Higher earner's income" hint="Must be a basic-rate taxpayer"><MoneyInput value={higher} onChange={setHigher} step={1000} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Annual saving" value={gbp(r.annualSaving)} sub={r.eligible ? 'as a couple' : 'not eligible'} tone="dark" big />
            <Stat label="Backdated (4 yrs)" value={gbp(r.backdated)} sub="one-off, if eligible" tone="accent" />
            <Stat label="Potential total" value={gbp(r.total)} sub="this year + backdated" />
          </div>
          <Panel title="Eligibility">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">Lower earner is a non-taxpayer (≤ £12,570)</span><span className={r.lowerNonTaxpayer ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{r.lowerNonTaxpayer ? 'Yes' : 'No'}</span></li>
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">Higher earner is a basic-rate taxpayer</span><span className={r.higherBasicRate ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{r.higherBasicRate ? 'Yes' : 'No'}</span></li>
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">Married or in a civil partnership</span><span className="text-on-surface-variant">Required</span></li>
            </ul>
          </Panel>
          {r.eligible ? (
            <Callout tone="tip" title="You can claim — and backdate it">
              Apply once at gov.uk and it renews automatically. You can backdate up to four tax years, so a first
              claim can be worth over <strong>{gbp(r.total)}</strong>. The lower earner makes the claim.
            </Callout>
          ) : (
            <Callout tone="info" title="Not eligible on these figures">
              You need one partner earning under £12,570 and the other paying basic-rate tax (£12,571–£50,270). If the
              higher earner is a higher-rate taxpayer, Marriage Allowance doesn&apos;t apply.
            </Callout>
          )}
        </>
      }
    >
      <Guide
        title="Marriage Allowance explained"
        intro="Marriage Allowance is a simple, often-missed tax break worth up to £252 a year for couples where one earns little. This guide explains who qualifies and how to claim, including backdating."
      >
        <GuideSection kicker="The basics" title="How it works">
          <p>Marriage Allowance lets a non-taxpaying spouse or civil partner transfer <strong>£1,260</strong> of their unused personal allowance to a basic-rate-taxpaying partner. That reduces the higher earner&apos;s tax by 20% of £1,260 — up to <strong>£252 a year</strong>. It&apos;s designed for couples where one earns below the £12,570 personal allowance (so isn&apos;t using all of it) and the other earns between £12,571 and £50,270.</p>
        </GuideSection>
        <GuideSection kicker="Eligibility" title="Who can claim">
          <p>You must be <strong>married or in a civil partnership</strong> (living together unmarried doesn&apos;t count). One of you must be a <strong>non-taxpayer</strong> (income under £12,570), and the other a <strong>basic-rate taxpayer</strong>. It doesn&apos;t work if the higher earner pays higher-rate (40%) tax. The lower-earning partner makes the application, as they&apos;re the one giving up part of their allowance.</p>
        </GuideSection>
        <GuideSection kicker="Money" title="Backdating up to four years">
          <p>If you were eligible in previous years but never claimed, you can <strong>backdate up to four tax years</strong>. Combined with the current year, a first claim can be worth over <strong>£1,250</strong> as a lump sum. Once set up, the allowance transfers automatically each year until you cancel it or your circumstances change, so you only apply once.</p>
          <Callout tone="tip" title="Apply directly with HMRC — for free">Claim at gov.uk/marriage-allowance. Avoid third-party &quot;refund&quot; companies that take a large cut for doing what takes a few minutes yourself.</Callout>
        </GuideSection>
        <GuideSection kicker="Watch out" title="When it can cost you">
          <p>Transferring allowance can slightly increase the lower earner&apos;s own tax if their income is just under £12,570 (because they give up £1,260 of allowance). In most cases the couple is still better off overall, but if both incomes are close to the allowance it&apos;s worth checking. Tell HMRC if your income or relationship changes, as you may need to cancel.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Not claiming at all', 'Millions of eligible couples miss out on up to £252 a year plus backdating.'],
            ['Using a paid claims company', 'They charge a fee for a free, few-minute HMRC application.'],
            ['Claiming when the higher earner is higher-rate', 'It only works if the higher earner is a basic-rate taxpayer.'],
            ['Forgetting to backdate', 'A first claim can include up to four previous years — don&apos;t leave that money behind.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much is Marriage Allowance worth?', a: 'Up to £252 a year, plus up to four years backdated on a first claim — potentially over £1,250 as a one-off.' },
            { q: 'Who applies — the higher or lower earner?', a: 'The lower-earning, non-taxpaying partner applies, as they transfer part of their personal allowance.' },
            { q: 'Does it renew automatically?', a: 'Yes — once set up it carries over each year until you cancel it or become ineligible. You only apply once.' },
            { q: 'Can unmarried couples claim?', a: 'No — you must be married or in a civil partnership. Cohabiting partners are not eligible.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
