'use client';

import { useMemo, useState } from 'react';
import {
  gbp, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, Choice, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { INSURANCE_RELATED } from '../car-insurance-calculator/CarInsurance';

type Region = 'london' | 'south' | 'midlands' | 'north' | 'scotwales';
type Build = 'standard' | 'detached' | 'period';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const perM2: Record<Region, number> = { london: 2600, south: 2300, midlands: 1950, north: 1750, scotwales: 1800 };
const regionLabel: Record<Region, string> = { london: 'London', south: 'South East / South West', midlands: 'Midlands / East', north: 'North', scotwales: 'Scotland / Wales' };
const buildFactor: Record<Build, number> = { standard: 1, detached: 1.12, period: 1.35 };

export default function HomeInsurance() {
  const [area, setArea] = useState(95);
  const [region, setRegion] = useState<Region>('midlands');
  const [build, setBuild] = useState<Build>('standard');
  const [bedrooms, setBedrooms] = useState(3);
  const [garage, setGarage] = useState(0);

  const r = useMemo(() => {
    const rebuild = area * perM2[region] * buildFactor[build] + garage * 1100;
    const contents = 12000 + bedrooms * 12000;
    const premium = rebuild * 0.0012 + contents * 0.003 + 90;
    return { rebuild, contents, premium };
  }, [area, region, build, bedrooms, garage]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Insurance', href: '/category/insurance' }, { label: 'Home Insurance' }]}
      title="Home Insurance & Rebuild Cost Calculator"
      subtitle="Estimate your buildings rebuild cost (the sum insured — not the market value) and your contents value, so you insure for the right amount and avoid being penalised for under-insurance."
      calcLabel="Estimate cover"
      inputs={
        <>
          <Panel title="Your property">
            <div className="space-y-4">
              <Field label={`Internal floor area — ${area} m²`} hint="Total of all floors"><Slider value={area} onChange={setArea} min={40} max={400} step={5} /></Field>
              <Field label="Region"><Choice<Region> name="region" value={region} onChange={setRegion} options={(Object.keys(perM2) as Region[]).map((k) => ({ value: k, label: regionLabel[k] }))} /></Field>
              <Field label="Build type"><Choice<Build> name="build" value={build} onChange={setBuild} options={[
                { value: 'standard', label: 'Standard (semi / terrace)' },
                { value: 'detached', label: 'Detached' },
                { value: 'period', label: 'Period / non-standard / listed' },
              ]} /></Field>
            </div>
          </Panel>
          <Panel title="Contents & extras">
            <div className="space-y-4">
              <Field label={`Bedrooms — ${bedrooms}`} hint="Used to estimate contents value"><Slider value={bedrooms} onChange={setBedrooms} min={1} max={8} /></Field>
              <Field label="Garage / outbuilding (m²)"><NumberInput value={garage} onChange={setGarage} suffix="m²" /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Buildings rebuild" value={gbp(r.rebuild)} sub="sum insured" tone="dark" big />
            <Stat label="Contents value" value={gbp(r.contents)} sub="estimate" tone="accent" />
            <Stat label="Est. annual premium" value={gbp(r.premium, 0)} sub="buildings + contents" />
          </div>
          <Panel title="Rebuild vs contents">
            <BarTrack segments={[{ value: r.rebuild, color: PRIMARY }, { value: r.contents, color: ACCENT }]} />
            <div className="flex justify-between text-xs text-on-surface-variant mt-2"><span>Rebuild {gbp(r.rebuild)}</span><span>Contents {gbp(r.contents)}</span></div>
          </Panel>
          <Callout tone="warn" title="Rebuild cost ≠ market value">
            Insure buildings for what it would cost to rebuild — usually <strong>less</strong> than the market value
            (which includes the land). Insuring for the market value over-pays; insuring too low risks an
            under-insurance penalty on a claim. For non-standard homes, get a professional rebuild assessment.
          </Callout>
        </>
      }
    >
      <Guide
        title="Home insurance and rebuild cost explained"
        intro="The most common home-insurance mistake is insuring for the wrong amount. This guide explains rebuild cost vs market value, how contents are valued, under-insurance, and how premiums are set."
      >
        <GuideSection kicker="The key point" title="Rebuild cost vs market value">
          <p>Your <strong>buildings sum insured</strong> should be the <strong>rebuild cost</strong> — what it would cost to demolish and reconstruct your home, including materials, labour, demolition and professional fees. This is almost always <em>lower</em> than the market value, because the market price includes the land and location, which don&apos;t need rebuilding. Insuring at the market value means over-paying; insuring too low triggers under-insurance penalties. For standard homes, rebuild guides (BCIS) give a per-square-metre figure by region; for period, listed or non-standard properties, get a professional assessment.</p>
        </GuideSection>
        <GuideSection kicker="Contents" title="How contents are valued">
          <p><strong>Contents</strong> cover everything you&apos;d take if you moved — furniture, electronics, clothes, kitchenware, valuables. Value it on a &quot;new-for-old&quot; basis (replacement cost, not second-hand value) by going room by room; it&apos;s usually more than people guess. High-value items like jewellery, bikes and laptops often need to be listed individually, and cover away from home is a separate option.</p>
        </GuideSection>
        <GuideSection kicker="The trap" title="Under-insurance and 'average'">
          <p>If your sum insured is too low, insurers apply the principle of <strong>&quot;average&quot;</strong>: they reduce your payout in proportion to the under-insurance. Insure your contents for £30,000 when they&apos;re really worth £60,000, and a £10,000 claim could be cut to £5,000 — even though the loss was below the sum insured. Getting the figures right protects you when it matters most.</p>
          <Callout tone="tip" title="Review after big changes">A renovation, extension or expensive purchase changes your rebuild or contents value. Update your sums insured rather than relying on last year&apos;s figure.</Callout>
        </GuideSection>
        <GuideSection kicker="Premiums" title="What drives the price">
          <p>Buildings premiums track the rebuild cost, your location (flood and subsidence risk), property age and construction type. Contents premiums track the sum insured, your postcode&apos;s theft risk and security. Raising your voluntary excess, fitting approved locks and alarms, and combining buildings and contents with one insurer all reduce the cost. As with car cover, loyalty rarely pays — compare at renewal.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Insuring for market value', 'You only need the rebuild cost, which is usually lower. Over-insuring wastes money.'],
            ['Under-valuing contents', 'Room-by-room, contents are worth more than you think. Under-insurance cuts payouts.'],
            ['Not listing high-value items', 'Jewellery, bikes and gadgets often exceed single-item limits unless specified.'],
            ['Forgetting flood/subsidence risk', 'Check your risk; some areas need specialist cover (e.g. via Flood Re).'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Should I insure for the price I paid?', a: 'No — insure the buildings for the rebuild cost, which excludes the land and is usually lower than the purchase price. Contents are separate and based on replacement value.' },
            { q: 'What is under-insurance?', a: 'Setting your sum insured below the true value. Insurers can then reduce claims proportionately under the "average" clause, even for losses smaller than the sum insured.' },
            { q: 'Do I need buildings and contents?', a: 'Owners usually need both. Tenants typically only need contents — the landlord insures the building. Leaseholders should check whether the freeholder&apos;s policy covers the structure.' },
            { q: 'Is this a quote?', a: 'No, it&apos;s an estimate to size your sums insured. Get a professional rebuild assessment for non-standard homes and compare insurer quotes.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={INSURANCE_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
