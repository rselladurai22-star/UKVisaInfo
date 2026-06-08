'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, Toggle,
  Donut, Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import { gbp } from '../../lib/tax2526';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const NRB = 325000;
const RNRB = 175000;
const RNRB_TAPER_START = 2000000;

const RELATED = [
  { href: '/inheritance-tax', label: 'Inheritance Tax', hint: 'Full IHT calculation' },
  { href: '/gift-iht-calculator', label: 'Gift & 7-Year Rule', hint: 'Taper relief on gifts' },
  { href: '/probate-fee-calculator', label: 'Probate Fees', hint: 'Court + solicitor costs' },
  { href: '/will-writing-cost', label: 'Will Writing Cost', hint: 'DIY vs solicitor' },
];

export default function EstateValue() {
  const [property, setProperty] = useState(400000);
  const [savings, setSavings] = useState(60000);
  const [investments, setInvestments] = useState(40000);
  const [possessions, setPossessions] = useState(20000);
  const [lifeInsurance, setLifeInsurance] = useState(0);
  const [insuranceInTrust, setInsuranceInTrust] = useState(true);
  const [mortgage, setMortgage] = useState(120000);
  const [otherDebts, setOtherDebts] = useState(5000);
  const [funeral, setFuneral] = useState(4500);
  const [homeToDescendants, setHomeToDescendants] = useState(true);
  const [married, setMarried] = useState(true);

  const r = useMemo(() => {
    const includedInsurance = insuranceInTrust ? 0 : lifeInsurance;
    const assets = property + savings + investments + possessions + includedInsurance;
    const debts = mortgage + otherDebts + funeral;
    const netEstate = Math.max(0, assets - debts);

    // Allowances (single person here; doubling if widowed not modelled — toggle 'married' transfers spouse exemption only on death between spouses)
    const mult = married ? 2 : 1; // assume full transferable NRB/RNRB available
    let rnrb = homeToDescendants ? RNRB * mult : 0;
    if (netEstate > RNRB_TAPER_START) {
      rnrb = Math.max(0, rnrb - (netEstate - RNRB_TAPER_START) / 2);
    }
    const nrb = NRB * mult;
    const allowance = nrb + rnrb;
    const taxable = Math.max(0, netEstate - allowance);
    const iht = taxable * 0.4;

    return { assets, debts, netEstate, allowance, taxable, iht, includedInsurance };
  }, [property, savings, investments, possessions, lifeInsurance, insuranceInTrust, mortgage, otherDebts, funeral, homeToDescendants, married]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Estate', href: '/category/estate' }, { label: 'Estate Value' }]}
      title="Estate Value Calculator"
      subtitle="Add up your assets, subtract debts, and see your net estate for 2025/26 — plus an estimate of any inheritance tax due."
      calcLabel="Calculate Estate Value"
      inputs={
        <div className="space-y-4">
          <Panel title="Assets">
            <div className="space-y-4">
              <Field label="Property (main home + others)"><MoneyInput value={property} onChange={setProperty} step={10000} /></Field>
              <Field label="Cash & savings"><MoneyInput value={savings} onChange={setSavings} step={5000} /></Field>
              <Field label="Investments, ISAs & shares"><MoneyInput value={investments} onChange={setInvestments} step={5000} /></Field>
              <Field label="Possessions (car, jewellery, etc.)"><MoneyInput value={possessions} onChange={setPossessions} step={1000} /></Field>
              <Field label="Life insurance payout"><MoneyInput value={lifeInsurance} onChange={setLifeInsurance} step={10000} /></Field>
              <Toggle checked={insuranceInTrust} onChange={setInsuranceInTrust} label="Life insurance written in trust (outside estate)" />
            </div>
          </Panel>
          <Panel title="Debts">
            <div className="space-y-4">
              <Field label="Mortgage outstanding"><MoneyInput value={mortgage} onChange={setMortgage} step={10000} /></Field>
              <Field label="Other debts (loans, cards)"><MoneyInput value={otherDebts} onChange={setOtherDebts} step={1000} /></Field>
              <Field label="Funeral costs"><MoneyInput value={funeral} onChange={setFuneral} step={500} /></Field>
            </div>
          </Panel>
          <Panel title="Allowances">
            <div className="space-y-4">
              <Toggle checked={homeToDescendants} onChange={setHomeToDescendants} label="Leaving home to children/grandchildren (residence band)" />
              <Toggle checked={married} onChange={setMarried} label="Married/civil partner (transferable allowances)" />
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Net Estate" value={gbp(r.netEstate)} sub={`Assets ${gbp(r.assets)} − debts ${gbp(r.debts)}`} tone="dark" big />
            <Stat label="Tax-Free Allowance" value={gbp(r.allowance)} sub="NRB + residence band" tone="primary" />
            <Stat label="Taxable Estate" value={gbp(r.taxable)} sub="Above allowances" tone="accent" />
            <Stat label="Estimated IHT" value={gbp(r.iht)} sub="40% on the excess" />
          </div>

          <Panel title="Estate composition">
            <Donut
              centerLabel="Net estate"
              centerValue={gbp(r.netEstate)}
              segments={[
                { value: Math.min(r.netEstate, r.allowance), color: PRIMARY, label: 'Within allowance' },
                { value: r.taxable, color: ACCENT, label: 'Taxable' },
              ]}
            />
          </Panel>

          {r.iht > 0 && (
            <Callout tone="warn" title="Your estate may owe inheritance tax">
              On current figures roughly <strong>{gbp(r.iht)}</strong> of IHT could be due. Gifting, trusts, charity legacies and pensions can reduce this — see the full inheritance tax calculator.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26. Pensions are usually outside the estate for IHT (rules change from April 2027). Assumes full transferable allowances if married. Get professional advice for planning.</p>
        </>
      }
    >
      <Guide
        title="How to value an estate for inheritance tax"
        intro="Your 'estate' is everything you own when you die, minus what you owe. Valuing it is the first step in working out whether inheritance tax (IHT) is due and in applying for probate. This guide walks through what counts, what doesn't, and the allowances that shelter most estates."
      >
        <GuideSection kicker="Assets" title="What goes into the estate">
          <p>Add up the open-market value of everything owned at the date of death:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Property — the main home and any others, at market value.</li>
            <li>Cash, bank and building society accounts, and savings.</li>
            <li>Investments — ISAs, shares, bonds and funds (ISAs lose their tax shelter on death).</li>
            <li>Possessions — cars, jewellery, art, furniture.</li>
            <li>Business and agricultural assets (which may qualify for relief).</li>
            <li>Money owed to the deceased.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Debts" title="What you subtract">
          <p>From the asset total, deduct liabilities: the outstanding mortgage, loans, credit cards, outstanding bills and reasonable funeral expenses. The result is the <strong>net estate</strong>.</p>
        </GuideSection>

        <GuideSection kicker="Outside the estate" title="What usually doesn't count">
          <p>Some assets typically fall outside the estate for IHT:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Life insurance written in trust</strong> — pays out directly to beneficiaries, bypassing the estate.</li>
            <li><strong>Most pensions</strong> — currently outside the estate, though this changes from April 2027 when unused pension funds are due to be brought into IHT.</li>
            <li>Assets held jointly that pass automatically to the survivor (though their value still counts towards the estate total).</li>
          </ul>
          <Callout tone="tip" title="Put life cover in trust">
            Writing a life insurance policy in trust is free and usually keeps the payout out of your estate — potentially saving 40% IHT on the proceeds.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Allowances" title="The nil-rate bands">
          <p>Two allowances shelter the estate before 40% tax bites:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Nil-rate band (NRB): £325,000</strong> per person.</li>
            <li><strong>Residence nil-rate band (RNRB): £175,000</strong> if you leave your home to children or grandchildren. It tapers away above a £2m estate.</li>
          </ul>
          <p>Married couples and civil partners can transfer unused allowances, so a surviving spouse can have up to <strong>£1,000,000</strong> of combined allowances.</p>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A £520,000 estate">
          <p>Consider a home worth £400,000, £100,000 of savings and investments, and £20,000 of possessions, with a £120,000 mortgage and £9,500 of other debts and funeral costs. Net estate = £520,000 − £129,500 = £390,500. For a single person leaving the home to children, allowances of £325,000 + £175,000 = £500,000 cover it entirely, so no IHT is due.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common estate valuation mistakes">
          <Mistakes items={[
            ['Valuing the home too low', 'HMRC can challenge under-valuations; use a proper market valuation, not a guess.'],
            ['Forgetting gifts in the last 7 years', 'Gifts made within seven years of death can use up the nil-rate band — see the gift calculator.'],
            ['Assuming pensions are always outside IHT', 'From April 2027 unused pension funds are due to count towards the estate.'],
            ['Ignoring jointly-held assets', 'A share of a jointly-owned property or account still forms part of the estate value.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Do I pay IHT on my spouse’s inheritance?', a: 'No. Transfers between UK-domiciled spouses and civil partners are completely exempt from inheritance tax, and unused allowances transfer too.' },
            { q: 'Is there IHT below £325,000?', a: 'No. Estates within the nil-rate band (and residence band where it applies) pay no inheritance tax, though probate may still be needed.' },
            { q: 'Does my pension count?', a: 'Most pensions are outside the estate for now, but the government plans to include unused pension funds in IHT from April 2027.' },
            { q: 'What rate is inheritance tax?', a: 'IHT is 40% on the value above your allowances, reduced to 36% if you leave at least 10% of the net estate to charity.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/estate-value-calculator" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
