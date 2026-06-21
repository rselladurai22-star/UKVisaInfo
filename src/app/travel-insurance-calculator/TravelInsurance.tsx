'use client';

import { useMemo, useState } from 'react';
import {
  gbp, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, Choice, Toggle,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { INSURANCE_RELATED } from '../car-insurance-calculator/CarInsurance';

type Region = 'uk' | 'europe' | 'wwexus' | 'wwus';
type Trip = 'single' | 'annual';
const regionDaily: Record<Region, number> = { uk: 0.8, europe: 1.5, wwexus: 3, wwus: 4.5 };
const regionLabel: Record<Region, string> = { uk: 'UK', europe: 'Europe', wwexus: 'Worldwide (excl. USA/Canada)', wwus: 'Worldwide (incl. USA/Canada)' };
const regionMedical: Record<Region, string> = { uk: '£2m', europe: '£5m', wwexus: '£10m', wwus: '£10m+' };
const ageFactor = (a: number) => (a < 50 ? 1 : a < 66 ? 1.4 : a < 76 ? 2.2 : 3.5);

export default function TravelInsurance() {
  const [region, setRegion] = useState<Region>('europe');
  const [days, setDays] = useState(10);
  const [travellers, setTravellers] = useState(2);
  const [oldest, setOldest] = useState(40);
  const [tripCost, setTripCost] = useState(1500);
  const [trip, setTrip] = useState<Trip>('single');
  const [conditions, setConditions] = useState(false);

  const r = useMemo(() => {
    const base = regionDaily[region];
    const travF = travellers * 0.85;
    const condF = conditions ? 1.45 : 1;
    const single = base * days * ageFactor(oldest) * travF * condF + 8;
    const annual = Math.max(single * 2.6, base * 17 * ageFactor(oldest) * travF * condF * 2.4);
    const premium = trip === 'single' ? single : annual;
    return { single, annual, premium };
  }, [region, days, travellers, oldest, tripCost, trip, conditions]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Insurance', href: '/category/insurance' }, { label: 'Travel Insurance' }]}
      title="Travel Insurance Calculator"
      subtitle="Estimate the cost of travel insurance for your trip and see the cover limits you should look for, medical, cancellation and baggage, for the UK, Europe or worldwide."
      calcLabel="Estimate premium"
      inputs={
        <>
          <Panel title="Your trip">
            <div className="space-y-4">
              <Field label="Destination"><Choice<Region> name="region" value={region} onChange={setRegion} options={(Object.keys(regionDaily) as Region[]).map((k) => ({ value: k, label: regionLabel[k] }))} /></Field>
              <Field label="Cover type"><Choice<Trip> name="trip" value={trip} onChange={setTrip} options={[
                { value: 'single', label: 'Single trip' }, { value: 'annual', label: 'Annual multi-trip' },
              ]} /></Field>
              {trip === 'single' && <Field label={`Trip length, ${days} days`}><Slider value={days} onChange={setDays} min={1} max={45} /></Field>}
            </div>
          </Panel>
          <Panel title="Travellers & cost">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Travellers"><NumberInput value={travellers} onChange={setTravellers} /></Field>
                <Field label={`Oldest age, ${oldest}`}><Slider value={oldest} onChange={setOldest} min={1} max={90} /></Field>
              </div>
              <Field label="Total trip cost" hint="For cancellation cover"><MoneyInput value={tripCost} onChange={setTripCost} step={100} /></Field>
              <Toggle checked={conditions} onChange={setConditions} label="A traveller has pre-existing medical conditions" />
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Estimated premium" value={gbp(r.premium, 0)} sub={trip === 'single' ? 'single trip' : 'annual multi-trip'} tone="dark" big />
            <Stat label="Single vs annual" value={`${gbp(r.single, 0)} / ${gbp(r.annual, 0)}`} sub="this trip vs year" tone="accent" />
            <Stat label="Medical cover to seek" value={regionMedical[region]} sub="minimum" />
          </div>
          <Panel title="Cover limits to look for">
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-on-surface-variant">Emergency medical</span><span className="font-semibold">{regionMedical[region]}+</span></li>
              <li className="flex justify-between"><span className="text-on-surface-variant">Cancellation</span><span className="font-semibold">{gbp(tripCost)} (your trip cost)</span></li>
              <li className="flex justify-between"><span className="text-on-surface-variant">Baggage</span><span className="font-semibold">£1,500 to £2,500</span></li>
              <li className="flex justify-between"><span className="text-on-surface-variant">Personal liability</span><span className="font-semibold">£2m</span></li>
            </ul>
          </Panel>
          <Callout tone="info" title="Estimate only">
            Travel premiums vary widely by insurer, exact destination, activities and declared conditions. If
            you&apos;re travelling more than two or three times a year, an annual multi-trip policy is usually cheaper.
          </Callout>
        </>
      }
    >
      <Guide
        title="Travel insurance: what you actually need"
        intro="Cheap travel insurance is easy to find, but the wrong policy can leave you with a huge bill abroad. This guide explains the cover limits that matter, pre-existing conditions, the GHIC, and single vs annual policies."
      >
        <GuideSection kicker="The priority" title="Emergency medical cover comes first">
          <p>The single most important part of travel insurance is <strong>emergency medical cover</strong>. A serious illness or accident abroad, hospital treatment plus repatriation home, can cost tens or hundreds of thousands of pounds. Look for at least <strong>£2 million in Europe</strong> and <strong>£5 to £10 million worldwide</strong>, especially for the USA where healthcare is extremely expensive. This is the cover you buy travel insurance for; everything else is secondary.</p>
        </GuideSection>
        <GuideSection kicker="The rest" title="Cancellation, baggage and liability">
          <p><strong>Cancellation</strong> cover should at least match your total prepaid trip cost (flights, hotels, tours) so you&apos;re reimbursed if you can&apos;t travel for a covered reason. <strong>Baggage</strong> cover (£1,500 to £2,500) replaces lost or stolen belongings, with single-item limits to check for valuables. <strong>Personal liability</strong> (around £2m) protects you if you injure someone or damage property. Add-ons like gadget, winter-sports or cruise cover suit specific trips.</p>
        </GuideSection>
        <GuideSection kicker="Health" title="Pre-existing conditions and the GHIC">
          <p>You must declare <strong>pre-existing medical conditions</strong>, failing to can void a claim. Conditions raise the premium but ensure you&apos;re actually covered. The free <strong>GHIC</strong> (Global Health Insurance Card, the successor to the EHIC) gives access to state healthcare in the EU at the same cost as locals, but it is <em>not</em> a substitute for travel insurance, it doesn&apos;t cover repatriation, private treatment or non-EU countries. Carry both.</p>
          <Callout tone="warn" title="Declare everything">If you don&apos;t disclose a known condition and then claim for something related, the insurer can refuse to pay. Honesty on the medical questions is what makes the policy valid.</Callout>
        </GuideSection>
        <GuideSection kicker="Value" title="Single trip vs annual multi-trip">
          <p>A <strong>single-trip</strong> policy covers one journey and is cheapest for occasional travellers. An <strong>annual multi-trip</strong> policy covers unlimited trips in a year (each up to a maximum length, often 31 days) and works out cheaper if you travel two or three times or more annually. Buy cover <strong>as soon as you book</strong>, not just before you fly, cancellation cover only protects you for the period you&apos;re insured.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Buying on price, not medical limit', 'A cheap policy with low medical cover is a false economy abroad. Check the medical limit first.'],
            ['Not declaring conditions', 'Non-disclosure voids claims. Declare every pre-existing condition, even managed ones.'],
            ['Relying on the GHIC alone', 'It only covers state care in the EU, no repatriation, no USA, no private treatment.'],
            ['Buying too late', 'Cancellation cover starts when you buy. Insure when you book to protect deposits.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much medical cover do I need?', a: 'At least £2 million for Europe and £5 to £10 million worldwide. Higher is sensible for the USA, where treatment and repatriation are very costly.' },
            { q: 'Is the GHIC enough on its own?', a: 'No. The GHIC gives access to state healthcare in the EU but does not cover repatriation, private care, cancellation or non-EU destinations. Use it alongside travel insurance.' },
            { q: 'Single or annual policy?', a: 'Single trip is cheapest for one journey; annual multi-trip is better value from about two or three trips a year, subject to a maximum trip length.' },
            { q: 'When should I buy?', a: 'As soon as you book your trip, so cancellation cover protects your deposits, not just before departure.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={INSURANCE_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
