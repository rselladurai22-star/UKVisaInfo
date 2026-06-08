'use client';

import { useMemo, useState } from 'react';
import {
  CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const NRB = 325000;

const TAPER: { maxYears: number; relief: number; rate: number }[] = [
  { maxYears: 3, relief: 0, rate: 0.40 },
  { maxYears: 4, relief: 0.20, rate: 0.32 },
  { maxYears: 5, relief: 0.40, rate: 0.24 },
  { maxYears: 6, relief: 0.60, rate: 0.16 },
  { maxYears: 7, relief: 0.80, rate: 0.08 },
];

const RELATED = [
  { href: '/inheritance-tax', label: 'Inheritance Tax', hint: 'Full IHT calculation' },
  { href: '/estate-value-calculator', label: 'Estate Value', hint: 'Net estate for IHT' },
  { href: '/probate-fee-calculator', label: 'Probate Fees', hint: 'Court + solicitor costs' },
  { href: '/will-writing-cost', label: 'Will Writing Cost', hint: 'DIY vs solicitor' },
];

export default function GiftIht() {
  const [gift, setGift] = useState(200000);
  const [years, setYears] = useState(4);
  const [priorGifts, setPriorGifts] = useState(0);
  const [useAnnualExemption, setUseAnnualExemption] = useState(true);
  const [usePriorYearExemption, setUsePriorYearExemption] = useState(false);

  const r = useMemo(() => {
    const exemption = (useAnnualExemption ? 3000 : 0) + (usePriorYearExemption ? 3000 : 0);
    const pet = Math.max(0, gift - exemption);

    const nrbAvailable = Math.max(0, NRB - priorGifts);
    const taxablePet = Math.max(0, pet - nrbAvailable);

    let relief = 0;
    let rate = 0.40;
    let survived = false;
    if (years >= 7) {
      survived = true;
      rate = 0;
    } else {
      const band = TAPER.find((b) => years < b.maxYears) ?? TAPER[0];
      relief = band.relief;
      rate = band.rate;
    }

    const taxBeforeRelief = taxablePet * 0.40;
    const tax = survived ? 0 : taxablePet * rate;
    const reliefAmount = taxBeforeRelief - tax;

    return { exemption, pet, nrbAvailable, taxablePet, relief, rate, tax, taxBeforeRelief, reliefAmount, survived };
  }, [gift, years, priorGifts, useAnnualExemption, usePriorYearExemption]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Estate', href: '/category/estate' }, { label: 'Gift & 7-Year Rule' }]}
      title="Gift IHT & 7-Year Rule Calculator"
      subtitle="See how much inheritance tax could be due on a lifetime gift if you die within seven years — including taper relief — for 2025/26."
      calcLabel="Calculate Gift Tax"
      inputs={
        <div className="space-y-4">
          <Panel title="The Gift">
            <div className="space-y-4">
              <Field label="Gift amount"><MoneyInput value={gift} onChange={setGift} step={10000} /></Field>
              <Field label="Years between gift and death" hint="0–7 years">
                <NumberInput value={years} onChange={setYears} min={0} step={1} suffix=" yrs" />
              </Field>
              <Field label="Other gifts in the 7 years BEFORE this one" hint="Earlier gifts use up the nil-rate band first">
                <MoneyInput value={priorGifts} onChange={setPriorGifts} step={5000} />
              </Field>
            </div>
          </Panel>
          <Panel title="Annual Exemptions">
            <div className="space-y-4">
              <Toggle checked={useAnnualExemption} onChange={setUseAnnualExemption} label="Use this year's £3,000 annual exemption" />
              <Toggle checked={usePriorYearExemption} onChange={setUsePriorYearExemption} label="Carry forward last year's unused £3,000" />
            </div>
          </Panel>
        </div>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="IHT on the Gift" value={gbp(r.tax)} sub={r.survived ? 'Fully exempt — 7+ years' : `Effective rate ${(r.rate * 100).toFixed(0)}%`} tone="dark" big />
            <Stat label="Taper Relief Saved" value={gbp(r.reliefAmount)} sub={`${(r.relief * 100).toFixed(0)}% relief`} tone="primary" />
            <Stat label="Taxable Gift" value={gbp(r.taxablePet)} sub="Above available nil-rate band" tone="accent" />
            <Stat label="Covered by NRB" value={gbp(Math.min(r.pet, r.nrbAvailable))} sub="No tax on this part" />
          </div>

          <Panel title="How it's worked out">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Gift</span><span className="font-semibold tabular-nums">{gbp(gift)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− Annual exemptions</span><span className="font-semibold tabular-nums">−{gbp(r.exemption)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Potentially exempt transfer</span><span className="font-semibold tabular-nums">{gbp(r.pet)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">− Nil-rate band available</span><span className="font-semibold tabular-nums">−{gbp(Math.min(r.pet, r.nrbAvailable))}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Taxable at 40%, less taper</span><span className="font-semibold tabular-nums text-primary">{gbp(r.taxablePet)}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Tax due on gift</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.tax)}</span></div>
            </div>
          </Panel>

          {!r.survived && r.taxablePet === 0 && (
            <Callout tone="tip" title="No tax on this gift">
              The gift sits within the available nil-rate band, so no IHT is due on it — but it still reduces the nil-rate band available to the rest of your estate.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26. Taper relief only reduces tax on gifts above the nil-rate band. Gifts within the band still use up allowances. Get professional advice.</p>
        </>
      }
    >
      <Guide
        title="Gifts and the 7-year inheritance tax rule"
        intro="You can give money away during your lifetime to reduce inheritance tax, but if you die within seven years the gift can still be taxed. The good news is 'taper relief' reduces the tax the longer you survive. Here's how the rules work."
      >
        <GuideSection kicker="The basics" title="Potentially exempt transfers (PETs)">
          <p>Most gifts to individuals are <strong>potentially exempt transfers</strong>. If you survive seven years from the date of the gift, it falls completely outside your estate and pays no IHT. Die within seven years and the gift is added back when working out the tax on your estate.</p>
        </GuideSection>

        <GuideSection kicker="Taper relief" title="The sliding scale of tax">
          <p>Taper relief reduces the tax on a gift (not the gift's value) based on how long you survived:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>0–3 years: no relief — full 40%.</li>
            <li>3–4 years: 20% relief — effective 32%.</li>
            <li>4–5 years: 40% relief — effective 24%.</li>
            <li>5–6 years: 60% relief — effective 16%.</li>
            <li>6–7 years: 80% relief — effective 8%.</li>
            <li>7+ years: fully exempt.</li>
          </ul>
          <Callout tone="warn" title="Taper only helps above the nil-rate band">
            A common misconception: taper relief only reduces tax that is actually due. If the gift is within your nil-rate band there's no tax to taper, so surviving four years doesn't reduce a bill that was already zero.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Exemptions" title="Gifts you can make tax-free">
          <p>Several gifts are exempt regardless of the seven-year rule:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Annual exemption — £3,000</strong> a year, and you can carry forward one unused year.</li>
            <li><strong>Small gifts — £250</strong> per person per year.</li>
            <li><strong>Wedding gifts</strong> — up to £5,000 to a child, £2,500 to a grandchild, £1,000 to others.</li>
            <li><strong>Gifts from surplus income</strong> — regular gifts out of income that don't affect your standard of living.</li>
            <li>Gifts to spouses, civil partners and UK charities are always exempt.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A £200,000 gift, death after 4 years">
          <p>You gift £200,000 and use this year's £3,000 exemption, leaving a £197,000 PET. You made no earlier gifts, so your full £325,000 nil-rate band is available — the gift is entirely within it. Result: no tax on the gift, even though you died within seven years. However, that £197,000 reduces the nil-rate band available to the rest of your estate to £128,000, so the tax simply lands elsewhere.</p>
          <p>If instead you had already gifted £200,000 before this one, only £125,000 of nil-rate band remains, leaving £72,000 of this gift taxable. At year four, 40% relief applies, giving tax of £72,000 × 24% = £17,280.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common gifting mistakes">
          <Mistakes items={[
            ['Assuming taper relief always applies', 'It only reduces tax on the slice of gifts above the nil-rate band.'],
            ['Gifts with reservation of benefit', 'Giving away your home but continuing to live in it rent-free means it still counts as yours for IHT.'],
            ['Not recording gifts', 'Executors need dates and amounts; keep a clear record so the seven-year clock can be proven.'],
            ['Forgetting earlier gifts use the band first', 'Gifts are set against the nil-rate band in date order, which affects how much of a later gift is taxable.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Who pays the tax on a gift?', a: 'Normally the person who received the gift is liable for any IHT on it if the giver dies within seven years, though it can fall to the estate.' },
            { q: 'Does the 7-year clock reset with each gift?', a: 'Each gift has its own seven-year clock from its own date. Earlier gifts are counted first against the nil-rate band.' },
            { q: 'Can I give my house to my children?', a: 'You can, but if you keep living there without paying market rent it is a "gift with reservation of benefit" and stays in your estate.' },
            { q: 'Are wedding gifts really tax-free?', a: 'Yes — up to £5,000 for a child, £2,500 for a grandchild and £1,000 for anyone else, on top of the annual exemption.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
