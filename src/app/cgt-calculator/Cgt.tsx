'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Choice, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import {
  gbp, personalAllowance, BASIC_BAND, CGT_ALLOWANCE, CGT_BASIC, CGT_HIGHER,
} from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

type Asset = 'shares' | 'property';
const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

export default function Cgt() {
  const [proceeds, setProceeds] = useState(60000);
  const [cost, setCost] = useState(30000);
  const [income, setIncome] = useState(40000);
  const [asset, setAsset] = useState<Asset>('shares');

  const r = useMemo(() => {
    const gain = Math.max(0, proceeds - cost);
    const taxable = Math.max(0, gain - CGT_ALLOWANCE);
    const pa = personalAllowance(income);
    const otherTaxable = Math.max(0, income - pa);
    const basicRoom = Math.max(0, BASIC_BAND - otherTaxable);
    const atBasic = Math.min(taxable, basicRoom);
    const atHigher = taxable - atBasic;
    const tax = atBasic * CGT_BASIC + atHigher * CGT_HIGHER;
    const net = gain - tax;
    const effRate = gain > 0 ? (tax / gain) * 100 : 0;
    return { gain, taxable, atBasic, atHigher, tax, net, effRate };
  }, [proceeds, cost, income, asset]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Capital Gains Tax' }]}
      title="Capital Gains Tax Calculator"
      subtitle="Estimate the CGT on selling shares, a second property, crypto or other assets for 2025/26, after the £3,000 annual exempt amount, at 18% and 24% depending on your income."
      calcLabel="Calculate CGT"
      inputs={
        <>
          <Panel title="The disposal">
            <div className="space-y-4">
              <Field label="Sale proceeds"><MoneyInput value={proceeds} onChange={setProceeds} step={1000} /></Field>
              <Field label="Cost (purchase + costs)"><MoneyInput value={cost} onChange={setCost} step={1000} /></Field>
              <Field label="Asset type">
                <Choice<Asset> name="asset" value={asset} onChange={setAsset} options={[
                  { value: 'shares', label: 'Shares / crypto / other' },
                  { value: 'property', label: 'Residential property' },
                ]} />
              </Field>
            </div>
          </Panel>
          <Panel title="Your income">
            <Field label="Other taxable income" hint="Sets how much gain is taxed at 18% vs 24%"><MoneyInput value={income} onChange={setIncome} step={1000} /></Field>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="CGT to pay" value={gbp(r.tax)} sub={`${pct(r.effRate)} of the gain`} tone="dark" big />
            <Stat label="Gain after tax" value={gbp(r.net)} sub="you keep" tone="accent" />
            <Stat label="Taxable gain" value={gbp(r.taxable)} sub={`after £${CGT_ALLOWANCE.toLocaleString()}`} />
          </div>
          <Panel title="How the gain is taxed">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Total gain</span><span className="font-semibold tabular-nums">{gbp(r.gain)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Less annual exempt amount</span><span className="font-semibold tabular-nums text-secondary">−{gbp(Math.min(r.gain, CGT_ALLOWANCE))}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Taxed at 18%</span><span className="font-semibold tabular-nums">{gbp(r.atBasic)} → {gbp(r.atBasic * CGT_BASIC)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Taxed at 24%</span><span className="font-semibold tabular-nums">{gbp(r.atHigher)} → {gbp(r.atHigher * CGT_HIGHER)}</span></div>
              <BarTrack segments={[{ value: r.atBasic * CGT_BASIC, color: PRIMARY }, { value: r.atHigher * CGT_HIGHER, color: ACCENT }]} />
              <div className="flex justify-between pt-1 border-t border-outline-variant"><span className="text-on-surface-variant">Total CGT</span><span className="font-bold tabular-nums">{gbp(r.tax)}</span></div>
            </div>
          </Panel>
          {asset === 'property' && (
            <Callout tone="warn" title="Property: report and pay within 60 days">
              For UK residential property, CGT must be reported and paid within <strong>60 days</strong> of completion
              via an HMRC property account, separately from your annual Self Assessment.
            </Callout>
          )}
        </>
      }
    >
      <Guide
        title="Capital Gains Tax explained"
        intro="CGT is the tax on the profit when you sell an asset that's risen in value. This guide covers the £3,000 allowance, the 18% and 24% rates, what's taxable, and how to reduce the bill."
      >
        <GuideSection kicker="The basics" title="What CGT applies to">
          <p>Capital Gains Tax is charged on the <strong>gain</strong>, not the total proceeds, when you sell or dispose of an asset that has grown in value. It applies to shares and funds outside an ISA, second homes and buy-to-lets, crypto, business assets and valuable possessions. Your main home is usually exempt under <strong>Private Residence Relief</strong>. Everyone has a <strong>£3,000 annual exempt amount</strong> (2025/26) before any CGT is due.</p>
        </GuideSection>
        <GuideSection kicker="The rates" title="18% and 24%">
          <p>Since 30 October 2024, gains are taxed at <strong>18%</strong> within your remaining basic-rate band and <strong>24%</strong> above it, the same rates now apply to property and other assets. Crucially, the gain is stacked on top of your income to decide the split: a higher earner pays mostly 24%, while someone with little other income may pay 18% on much of it. That&apos;s why your income level changes the bill.</p>
        </GuideSection>
        <GuideSection kicker="Reduce it" title="Legitimate ways to cut CGT">
          <ul className="space-y-3">
            {[
              ['Use both spouses&apos; allowances', 'Transfers between spouses/civil partners are CGT-free, so you can use two £3,000 allowances and two basic-rate bands.'],
              ['Spread disposals across tax years', 'Selling in two tranches across 5 April uses two annual allowances.'],
              ['Use your ISA', 'Gains inside an ISA are completely CGT-free, "Bed & ISA" moves holdings into the wrapper.'],
              ['Offset losses', 'Capital losses reduce gains; report them to carry forward to future years.'],
              ['Claim reliefs', 'Private Residence Relief, Business Asset Disposal Relief (10% up to a lifetime limit) and gift reliefs can apply.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}:</strong> {b}</span></li>
            ))}
          </ul>
        </GuideSection>
        <GuideSection kicker="Reporting" title="How and when to pay">
          <p>For most assets, report gains on your <strong>Self Assessment</strong> return and pay by 31 January. For UK <strong>residential property</strong>, there&apos;s a separate rule: report and pay within <strong>60 days</strong> of completion via an HMRC online property account. The annual exempt amount has shrunk sharply in recent years, so more disposals now create a reportable gain, keep records of costs and improvements.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Missing the 60-day property deadline', 'Residential property CGT is due within 60 days of completion, not at the end of the tax year.'],
            ['Forgetting allowable costs', 'Buying/selling costs and capital improvements reduce the gain, keep the paperwork.'],
            ['Wasting the annual allowance', 'It can&apos;t be carried forward. Use it each year, e.g. via Bed & ISA.'],
            ['Ignoring the spouse exemption', 'Transferring assets to a spouse first can double allowances and use a lower tax band.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much is Capital Gains Tax?', a: '18% within your remaining basic-rate band and 24% above, on gains over the £3,000 annual exempt amount (2025/26). Your other income determines the split.' },
            { q: 'Do I pay CGT on my home?', a: 'Usually no, your only or main residence is generally exempt under Private Residence Relief, though letting or business use can restrict it.' },
            { q: 'Is crypto subject to CGT?', a: 'Yes, disposing of crypto (selling, swapping or spending) can create a taxable gain, calculated using pooling rules.' },
            { q: 'When do I report a property gain?', a: 'Within 60 days of completion via an HMRC property account, separately from Self Assessment.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
