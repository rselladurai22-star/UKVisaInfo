'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, AlertTriangle, Stars } from 'lucide-react';
import {
  gbp, pct, Panel, Segmented, Stat, Field, MoneyInput, Choice, Toggle,
  BarTrack, GuideHeading, Callout, FAQ, RelatedTools, CalcButton, ResultsPlaceholder,
} from '../../components/calc-ui';

type Mode = 'simple' | 'advanced' | 'expert';
type Buyer = 'ftb' | 'mover' | 'additional';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

interface BandRow { from: number; to: number; rate: number; taxable: number; tax: number }
interface Sdlt { total: number; effRate: number; rows: BandRow[]; surcharge: number; ftbApplied: boolean }

const STANDARD: [number, number, number][] = [
  [0, 125000, 0],
  [125000, 250000, 0.02],
  [250000, 925000, 0.05],
  [925000, 1500000, 0.1],
  [1500000, Infinity, 0.12],
];
const FTB: [number, number, number][] = [
  [0, 300000, 0],
  [300000, 500000, 0.05],
];

function computeSdlt(price: number, buyer: Buyer, nonResident: boolean, replacingMain: boolean): Sdlt {
  const ftbApplied = buyer === 'ftb' && price <= 500000;
  const bands = ftbApplied ? FTB : STANDARD;
  let surcharge = 0;
  if (buyer === 'additional' && !replacingMain) surcharge += 0.05;
  if (nonResident) surcharge += 0.02;

  const rows: BandRow[] = [];
  let total = 0;
  for (const [from, to, rate] of bands) {
    if (price <= from) break;
    const taxable = Math.min(price, to) - from;
    const r = rate + surcharge;
    const tax = taxable * r;
    rows.push({ from, to, rate: r, taxable, tax });
    total += tax;
  }
  return { total, effRate: price ? (total / price) * 100 : 0, rows, surcharge, ftbApplied };
}

export default function StampDuty() {
  const [mode, setMode] = useState<Mode>('advanced');
  const [done, setDone] = useState(false);
  const [price, setPrice] = useState(350000);
  const [buyer, setBuyer] = useState<Buyer>('mover');
  const [nonResident, setNonResident] = useState(false);
  const [replacingMain, setReplacingMain] = useState(true);

  const r = useMemo(() => {
    const main = computeSdlt(price, buyer, nonResident, replacingMain);
    const asStandard = computeSdlt(price, 'mover', false, true);
    const asFtb = computeSdlt(price, 'ftb', false, true);
    const reliefSaving = Math.max(0, asStandard.total - asFtb.total);
    const ftbEligible = price <= 500000;
    return { main, asStandard, reliefSaving, ftbEligible };
  }, [price, buyer, nonResident, replacingMain]);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <section className="container-page pt-10 pb-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/category/property" className="hover:text-primary">Property</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Stamp Duty Calculator</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">Stamp Duty (SDLT) Calculator</h1>
        <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Work out the Stamp Duty Land Tax on a property in England or Northern Ireland, using the rates
          in force from 1 April 2025. Handles first-time buyer relief, the additional-property surcharge and
          the non-resident surcharge, with a full band-by-band breakdown.
        </p>
        <div className="mt-5">
          <Segmented<Mode>
            ariaLabel="Detail level"
            value={mode}
            onChange={setMode}
            options={[{ value: 'simple', label: 'Simple' }, { value: 'advanced', label: 'Advanced' }, { value: 'expert', label: 'Expert' }]}
          />
        </div>
      </section>

      <section className="container-page pb-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Panel title="Purchase details" icon={<Home className="h-4 w-4" />}>
            <div className="space-y-4">
              <Field label="Purchase price">
                <MoneyInput value={price} onChange={setPrice} step={5000} />
              </Field>
              <Field label="Buyer type">
                <Choice<Buyer>
                  name="buyer"
                  value={buyer}
                  onChange={setBuyer}
                  options={[
                    { value: 'ftb', label: 'First-time buyer', desc: 'Relief up to £500,000' },
                    { value: 'mover', label: 'Home mover', desc: 'Replacing your main home' },
                    { value: 'additional', label: 'Additional property / BTL', desc: '+5% surcharge' },
                  ]}
                />
              </Field>

              {mode !== 'simple' && (
                <div className="pt-2 space-y-2">
                  {buyer === 'additional' && (
                    <Toggle checked={replacingMain} onChange={setReplacingMain} label="Replacing my main residence (no surcharge)" />
                  )}
                  <Toggle checked={nonResident} onChange={setNonResident} label="Non-UK resident (+2% surcharge)" />
                </div>
              )}
            </div>
          </Panel>

          <Panel title="Rates apply to" >
            <p className="text-sm text-on-surface-variant">
              England &amp; Northern Ireland (SDLT). Scotland uses <strong>LBTT</strong> and Wales uses{' '}
              <strong>LTT</strong>, which have different bands — this calculator does not cover those.
            </p>
          </Panel>
          <CalcButton done={done} onClick={() => setDone(true)} />
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 self-start scroll-mt-20">
          {done ? (<>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Stamp duty payable" value={gbp(r.main.total)} sub={r.main.surcharge > 0 ? `inc. ${pct(r.main.surcharge * 100, 0)} surcharge` : 'standard rates'} tone="dark" big />
            <Stat label="Effective rate" value={pct(r.main.effRate, 2)} sub="of purchase price" />
            <Stat label="Net price + tax" value={gbp(price + r.main.total)} sub="total to find" tone="accent" />
          </div>

          <Panel title="Band-by-band breakdown">
            {r.main.rows.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No stamp duty due at this price.</p>
            ) : (
              <div className="space-y-3">
                {r.main.rows.map((row, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-on-surface-variant">
                        {gbp(row.from)} – {row.to === Infinity ? 'above' : gbp(row.to)} <span className="font-semibold text-on-surface">@ {pct(row.rate * 100, 0)}</span>
                      </span>
                      <span className="font-bold tabular-nums">{gbp(row.tax)}</span>
                    </div>
                    <BarTrack segments={[{ value: row.tax, color: row.tax > 0 ? PRIMARY : '#c4c6d2' }, { value: Math.max(0, r.main.total - row.tax), color: '#eceef0' }]} />
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-outline-variant text-sm font-bold">
                  <span>Total</span><span className="tabular-nums">{gbp(r.main.total)}</span>
                </div>
              </div>
            )}
          </Panel>

          {mode !== 'simple' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Panel title={<span className="flex items-center gap-2"><Stars className="h-4 w-4 text-secondary" /> First-time buyer</span>}>
                {r.ftbEligible ? (
                  buyer === 'ftb'
                    ? <p className="text-sm text-on-surface-variant">Relief applied. You save <strong className="text-secondary">{gbp(r.reliefSaving)}</strong> versus standard rates.</p>
                    : <p className="text-sm text-on-surface-variant">If you qualify as a first-time buyer, you&apos;d save <strong className="text-secondary">{gbp(r.reliefSaving)}</strong> here.</p>
                ) : (
                  <p className="text-sm text-on-surface-variant">Above £500,000 — first-time buyer relief is <strong>not available</strong>; standard rates apply to the whole price.</p>
                )}
              </Panel>
              <Panel title={<span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-secondary" /> Surcharges</span>}>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-on-surface-variant">Additional property (+5%)</span><span className="tabular-nums">{gbp(computeSdlt(price, 'additional', false, false).total - r.asStandard.total)}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Non-resident (+2%)</span><span className="tabular-nums">{gbp(price * 0.02)}</span></div>
                  <div className="flex justify-between pt-1.5 border-t border-outline-variant font-bold"><span>Max liability</span><span className="tabular-nums text-primary">{gbp(computeSdlt(price, 'additional', true, false).total)}</span></div>
                </div>
              </Panel>
            </div>
          )}

          {mode === 'expert' && (
            <Panel title="Rate card — England & NI (from 1 Apr 2025)">
              <div className="overflow-hidden rounded-lg border border-outline-variant">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low text-left">
                    <tr><th className="px-3 py-2 font-bold">Band</th><th className="px-3 py-2 font-bold">Standard</th><th className="px-3 py-2 font-bold">Additional</th></tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {[['Up to £125,000', '0%', '5%'], ['£125,001–£250,000', '2%', '7%'], ['£250,001–£925,000', '5%', '10%'], ['£925,001–£1.5m', '10%', '15%'], ['Above £1.5m', '12%', '17%']].map((row) => (
                      <tr key={row[0]}><td className="px-3 py-2 text-on-surface-variant">{row[0]}</td><td className="px-3 py-2 font-semibold">{row[1]}</td><td className="px-3 py-2">{row[2]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] text-on-surface-variant">First-time buyers: 0% to £300,000, then 5% to £500,000 (no relief above £500,000).</p>
            </Panel>
          )}

          <p className="text-[11px] text-on-surface-variant">
            Estimates only, not tax advice. Special rules apply to mixed-use property, multiple dwellings, leases,
            shared ownership and companies — confirm with your conveyancer.
          </p>
          </>) : <ResultsPlaceholder />}
        </div>
      </section>

      <StampDutyGuide />
    </div>
  );
}

/* ════════════════════════════ guide ════════════════════════════ */

function StampDutyGuide() {
  return (
    <article className="container-page pb-24 border-t border-outline-variant pt-14 max-w-3xl">
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">Complete guide</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mt-1">Stamp Duty Land Tax explained (2025/26)</h2>
        <p className="mt-3 text-on-surface-variant leading-relaxed">
          Stamp Duty Land Tax (SDLT) is usually the largest single tax in a home purchase. This guide explains
          exactly how it&apos;s calculated in England and Northern Ireland, who pays more, where the reliefs are,
          and the traps that catch buyers out — all on the rates in force from 1 April 2025.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <GuideHeading kicker="The basics">How SDLT is calculated — the &quot;slice&quot; system</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            SDLT is a <strong>progressive, sliced tax</strong>: you pay each rate only on the portion of the price
            that falls inside that band — not a single rate on the whole price. So on a £350,000 home a standard
            buyer pays 0% on the first £125,000, 2% on the slice to £250,000 (£2,500), and 5% on the remaining
            £100,000 (£5,000) — £7,500 in total, an effective rate of about 2.1%. The calculator above shows this
            band split live.
          </p>
          <Callout tone="info" title="England & NI only">
            These rates are SDLT. Scotland charges Land and Buildings Transaction Tax (LBTT) and Wales charges Land
            Transaction Tax (LTT), each with its own bands and reliefs. If you&apos;re buying there, use a dedicated
            LBTT or LTT calculator.
          </Callout>
        </section>

        <section>
          <GuideHeading kicker="The rates">Standard residential bands</GuideHeading>
          <div className="my-3 overflow-hidden rounded-xl border border-outline-variant">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-left"><tr><th className="px-4 py-3 font-bold">Portion of price</th><th className="px-4 py-3 font-bold">Standard rate</th><th className="px-4 py-3 font-bold">Additional property</th></tr></thead>
              <tbody className="divide-y divide-outline-variant/60">
                <tr><td className="px-4 py-3">Up to £125,000</td><td className="px-4 py-3 font-semibold">0%</td><td className="px-4 py-3">5%</td></tr>
                <tr><td className="px-4 py-3">£125,001 – £250,000</td><td className="px-4 py-3 font-semibold">2%</td><td className="px-4 py-3">7%</td></tr>
                <tr><td className="px-4 py-3">£250,001 – £925,000</td><td className="px-4 py-3 font-semibold">5%</td><td className="px-4 py-3">10%</td></tr>
                <tr><td className="px-4 py-3">£925,001 – £1.5m</td><td className="px-4 py-3 font-semibold">10%</td><td className="px-4 py-3">15%</td></tr>
                <tr><td className="px-4 py-3">Above £1.5m</td><td className="px-4 py-3 font-semibold">12%</td><td className="px-4 py-3">17%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            The nil-rate threshold dropped from £250,000 to <strong>£125,000</strong> on 1 April 2025, when the
            temporary higher threshold ended. That means most buyers now pay a little more than in 2024.
          </p>
        </section>

        <section>
          <GuideHeading kicker="First-time buyers">First-time buyer relief</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            First-time buyers pay <strong>0% up to £300,000</strong> and 5% on the portion from £300,001 to
            £500,000. Above a £500,000 purchase price the relief disappears entirely and standard rates apply to
            the whole amount — a genuine cliff-edge. To qualify, every buyer must never have owned a residential
            property anywhere in the world, and must intend to live in the property as their only or main home.
          </p>
          <Callout tone="warn" title="The £500,000 cliff-edge">
            Buy at £500,000 as a first-time buyer and you pay £10,000. Buy at £500,001 and relief is lost — standard
            rates apply, roughly doubling the bill. Negotiating just under the threshold can save thousands.
          </Callout>
        </section>

        <section>
          <GuideHeading kicker="Second homes">The additional-property surcharge</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            If you&apos;ll own more than one residential property at the end of the day of completion, a
            <strong> 5% surcharge</strong> applies on top of the standard rate for every band (raised from 3% on 31
            October 2024). This hits buy-to-let investors and second-home buyers. The key exception is
            <strong> replacing your main residence</strong>: if you sell your previous main home on or before the
            purchase, the surcharge doesn&apos;t apply. Sell it later (within 36 months) and you can reclaim the
            surcharge you paid.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Overseas buyers">Non-resident surcharge</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Buyers who are not UK-resident for SDLT purposes pay an extra <strong>2%</strong> on every band. The
            residence test is specific to SDLT (broadly, present in the UK for at least 183 days in the 12 months
            around the purchase), so it can differ from your income-tax residence. If you later become UK-resident,
            you may be able to reclaim the 2%.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Worked example">£600,000 home, three buyer types</GuideHeading>
          <div className="my-3 overflow-hidden rounded-xl border border-outline-variant">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-left"><tr><th className="px-4 py-3 font-bold">Buyer</th><th className="px-4 py-3 font-bold">SDLT</th><th className="px-4 py-3 font-bold">Effective rate</th></tr></thead>
              <tbody className="divide-y divide-outline-variant/60">
                <tr><td className="px-4 py-3">Home mover</td><td className="px-4 py-3 font-semibold tabular-nums">£17,500</td><td className="px-4 py-3 tabular-nums">2.9%</td></tr>
                <tr><td className="px-4 py-3">First-time buyer</td><td className="px-4 py-3 font-semibold tabular-nums">£17,500</td><td className="px-4 py-3 tabular-nums">2.9%</td></tr>
                <tr><td className="px-4 py-3">Additional / BTL</td><td className="px-4 py-3 font-semibold tabular-nums">£47,500</td><td className="px-4 py-3 tabular-nums">7.9%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            At £600,000 the first-time buyer gets no relief (above the £500,000 ceiling), so pays the same as a
            home mover. The additional-property surcharge adds a flat 5% of the price — £30,000 — on top.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Practical">When and how to pay</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            An SDLT return must be filed and the tax paid within <strong>14 days</strong> of completion. In
            practice your conveyancer files it and collects the money from you at completion, so you rarely deal
            with HMRC directly — but you remain legally responsible for it being correct and on time. Keep evidence
            of first-time buyer status or main-residence replacement in case of a later enquiry.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Edge cases">Mixed-use, multiple dwellings and leases</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Properties with both residential and commercial elements may be taxed at the lower non-residential
            rates. Multiple Dwellings Relief was <strong>abolished</strong> for most purchases from 1 June 2024.
            New leasehold purchases can attract SDLT on the rent (the &quot;net present value&quot;) as well as the
            premium. These are specialist areas — take advice before relying on a cheaper treatment, as HMRC
            scrutinises aggressive claims closely.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Avoid these">Common mistakes</GuideHeading>
          <ul className="space-y-3 text-[15px] text-on-surface-variant">
            {[
              ['Assuming the old £250k threshold', 'The nil-rate band fell to £125,000 in April 2025. Older calculators understate the bill.'],
              ['Forgetting the surcharge timing', 'Owning any other home at completion triggers the 5% surcharge — even briefly. Time your sale and purchase carefully.'],
              ['Over-claiming first-time status', 'Previous ownership anywhere in the world (including inherited shares) disqualifies you.'],
              ['Budgeting only for the rate, not the cash', 'SDLT is payable in cash within 14 days and usually cannot be added to the mortgage. Plan for it upfront.'],
              ['Ignoring reclaim windows', 'Sold your old home after buying? You may reclaim the surcharge within 12 months of the sale (up to 36 months to sell).'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}.</strong> {b}</span></li>
            ))}
          </ul>
        </section>

        <section>
          <GuideHeading kicker="FAQ">Frequently asked questions</GuideHeading>
          <FAQ items={[
            { q: 'Can I add stamp duty to my mortgage?', a: 'Not directly — SDLT is due in cash within 14 days of completion. You could borrow slightly more against the property (raising your LTV and deposit need), but most buyers budget for it as an upfront cash cost alongside the deposit and legal fees.' },
            { q: 'Do first-time buyers pay any stamp duty?', a: 'Not on the first £300,000, then 5% on the portion to £500,000. Above a £500,000 purchase price the relief is lost entirely and standard rates apply to the whole amount.' },
            { q: 'I own a buy-to-let and am buying a home to live in — do I pay the surcharge?', a: 'If you are not replacing a main residence and will own two or more properties at completion, yes, the 5% surcharge applies to the new purchase. Whether a property counts as your main residence is a question of fact, not just intention.' },
            { q: 'Is stamp duty different in Scotland and Wales?', a: 'Yes. Scotland charges LBTT and Wales charges LTT, with different thresholds and an additional-dwelling supplement of their own. This tool only covers SDLT for England and Northern Ireland.' },
            { q: 'Can I reclaim the higher-rate surcharge?', a: 'If you paid the surcharge because you had not yet sold your previous main home, you can usually reclaim it if you sell that home within 36 months — the claim must normally be made within 12 months of the sale.' },
          ]} />
        </section>

        <section>
          <GuideHeading kicker="Next steps">Related calculators</GuideHeading>
          <RelatedTools items={[
            { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Monthly repayments' },
            { href: '/mortgage-affordability', label: 'Mortgage Affordability', hint: 'How much can you borrow?' },
            { href: '/buy-to-let-calculator', label: 'Buy-to-Let / Landlord', hint: 'Yield, surcharge & tax' },
            { href: '/buy-vs-rent', label: 'Buy vs Rent', hint: 'Which wins over time?' },
            { href: '/rental-yield-calculator', label: 'Rental Yield', hint: 'Gross & net yield' },
            { href: '/category/property', label: 'All Property Tools', hint: 'The full hub' },
          ]} />
        </section>
      </div>
    </article>
  );
}
