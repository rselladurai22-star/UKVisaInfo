'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Toggle, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const NRB = 325000;
const RNRB = 175000;
const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const IHT_RELATED = [
  { href: '/cgt-calculator', label: 'Capital Gains Tax', hint: 'Tax on gains' },
  { href: '/take-home-pay', label: 'Take-home Pay', hint: 'Salary after tax' },
  { href: '/pension-calculator', label: 'Pension Calculator', hint: 'Retirement pot' },
  { href: '/category/estate', label: 'Estate Tools', hint: 'Probate, wills & IHT' },
  { href: '/category/tax', label: 'All Tax Tools', hint: 'The full hub' },
];

export default function Iht() {
  const [estate, setEstate] = useState(700000);
  const [homeToKids, setHomeToKids] = useState(true);
  const [transferable, setTransferable] = useState(false);

  const r = useMemo(() => {
    const mult = transferable ? 2 : 1;
    const nrb = NRB * mult;
    let rnrb = homeToKids ? RNRB * mult : 0;
    if (estate > 2000000) rnrb = Math.max(0, rnrb - (estate - 2000000) / 2); // taper
    const allowance = nrb + rnrb;
    const taxable = Math.max(0, estate - allowance);
    const tax = taxable * 0.4;
    const net = estate - tax;
    const effRate = estate > 0 ? (tax / estate) * 100 : 0;
    return { nrb, rnrb, allowance, taxable, tax, net, effRate };
  }, [estate, homeToKids, transferable]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Estate', href: '/category/estate' }, { label: 'Inheritance Tax' }]}
      title="Inheritance Tax Calculator"
      subtitle="Estimate the Inheritance Tax on an estate for 2025/26 using the £325,000 nil-rate band, the £175,000 residence band, and transferable allowances between spouses."
      calcLabel="Calculate IHT"
      inputs={
        <Panel title="The estate">
          <div className="space-y-4">
            <Field label="Total estate value" hint="Property, savings, investments, possessions"><MoneyInput value={estate} onChange={setEstate} step={10000} /></Field>
            <Toggle checked={homeToKids} onChange={setHomeToKids} label="Leaving the home to children/grandchildren (+£175k band)" />
            <Toggle checked={transferable} onChange={setTransferable} label="Widowed — inherited a late spouse's unused allowances (double)" />
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Inheritance Tax" value={gbp(r.tax)} sub={`${pct(r.effRate)} of estate`} tone="dark" big />
            <Stat label="Heirs receive" value={gbp(r.net)} sub="after IHT" tone="accent" />
            <Stat label="Tax-free allowance" value={gbp(r.allowance)} sub="NRB + residence band" />
          </div>
          <Panel title="How the estate is taxed">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Nil-rate band</span><span className="font-semibold tabular-nums">{gbp(r.nrb)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Residence nil-rate band</span><span className="font-semibold tabular-nums">{gbp(r.rnrb)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Taxable at 40%</span><span className="font-semibold tabular-nums">{gbp(r.taxable)}</span></div>
              <BarTrack segments={[{ value: r.allowance, color: PRIMARY }, { value: r.taxable, color: ACCENT }]} />
              <div className="flex justify-between text-xs text-on-surface-variant"><span>Tax-free {gbp(r.allowance)}</span><span>Taxed {gbp(r.taxable)}</span></div>
            </div>
          </Panel>
          {estate > 2000000 && (
            <Callout tone="warn" title="Residence band tapered">
              Estates over £2m lose £1 of residence nil-rate band for every £2 above, so larger estates may get little
              or none of the extra £175k.
            </Callout>
          )}
          <p className="text-[11px] text-on-surface-variant">Estimate only. Excludes lifetime gifts (7-year rule), business/agricultural relief, charity reductions and trusts. Take professional advice for estate planning.</p>
        </>
      }
    >
      <Guide
        title="Inheritance Tax explained"
        intro="Inheritance Tax (IHT) is charged at 40% on the part of an estate above the tax-free allowances. This guide explains the bands, the spouse exemption, gifts and how to reduce a bill."
      >
        <GuideSection kicker="The basics" title="The 40% rate and the nil-rate band">
          <p>IHT is charged at <strong>40%</strong> on the value of an estate above the <strong>nil-rate band of £325,000</strong>. Everything below that is tax-free. The estate includes property, savings, investments and possessions, less debts. There&apos;s usually no IHT if the estate is below £325,000, or if everything is left to a spouse or civil partner (which is exempt).</p>
        </GuideSection>
        <GuideSection kicker="The home" title="The residence nil-rate band">
          <p>If you leave your home to direct descendants (children or grandchildren), an extra <strong>residence nil-rate band of £175,000</strong> applies. Combined with the standard band, an individual can pass on up to <strong>£500,000</strong> tax-free. The residence band <strong>tapers away</strong> for estates over £2 million, reducing by £1 for every £2 above that threshold.</p>
        </GuideSection>
        <GuideSection kicker="Couples" title="Transferable allowances">
          <p>Anything left to a spouse or civil partner is exempt, and any <strong>unused allowances transfer</strong> to them. So a surviving spouse can have up to <strong>£650,000</strong> of nil-rate band and <strong>£350,000</strong> of residence band — a combined <strong>£1 million</strong> tax-free for a couple leaving their home to children. The calculator&apos;s &quot;widowed&quot; toggle doubles the allowances to reflect this.</p>
          <Callout tone="tip" title="The £1m couple allowance">A married couple passing their home to children can typically leave up to £1,000,000 free of IHT. Planning around these bands is the foundation of most estate planning.</Callout>
        </GuideSection>
        <GuideSection kicker="Gifts" title="The 7-year rule">
          <p>Gifts made more than <strong>7 years</strong> before death are usually free of IHT. Gifts within 7 years count against the nil-rate band, with <strong>taper relief</strong> reducing the tax on gifts made 3–7 years before death. You can also give away £3,000 a year (the annual exemption), small gifts, and regular gifts from surplus income, all IHT-free. Larger lifetime giving is a common way to reduce an eventual bill — but you must survive 7 years.</p>
        </GuideSection>
        <GuideSection kicker="Reduce it" title="Other reliefs and planning">
          <p>Leaving 10% or more of the estate to charity cuts the IHT rate on the rest from 40% to <strong>36%</strong>. Business Relief and Agricultural Relief can remove qualifying assets from the estate (rules are changing from 2026). Pensions generally sit outside the estate. Trusts and whole-of-life policies written in trust are also used. IHT planning is complex and rules change — take professional advice.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Assuming the estate is below the threshold', 'Property values push many estates over £325k. Add everything up, including the home.'],
            ['Not using transferable allowances', 'A widow(er) can claim a late spouse&apos;s unused bands — worth up to £1m combined.'],
            ['Leaving gifts too late', 'Gifts only fully escape IHT after 7 years. Plan early.'],
            ['Ignoring the £2m taper', 'Large estates lose the residence band — factor this into planning.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much can I leave tax-free?', a: '£325,000 (nil-rate band), plus £175,000 if you leave your home to direct descendants — up to £500,000 per person, or £1m for a couple using transferable allowances.' },
            { q: 'Is inheritance from a spouse taxed?', a: 'No — transfers between spouses and civil partners are exempt, and unused allowances pass to the survivor.' },
            { q: 'Do gifts avoid Inheritance Tax?', a: 'Gifts made more than 7 years before death are usually exempt; within 7 years they count against the allowance, with taper relief after year 3. Annual and small-gift exemptions also apply.' },
            { q: 'Who pays the IHT bill?', a: 'It&apos;s normally paid from the estate by the executors before assets are distributed, due within 6 months of death.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={IHT_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
