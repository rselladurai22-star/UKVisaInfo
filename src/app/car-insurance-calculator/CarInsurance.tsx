'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';

type Loc = 'low' | 'med' | 'high';
type Cover = 'comp' | 'tpft';

const ageFactor = (a: number) => (a < 21 ? 2.6 : a < 25 ? 1.85 : a < 30 ? 1.3 : a < 50 ? 1 : a < 70 ? 0.92 : 1.15);
const locFactor: Record<Loc, number> = { low: 0.85, med: 1, high: 1.35 };
const ncdDiscount = (y: number) => Math.min(0.6, [0, 0.15, 0.25, 0.3, 0.35, 0.45, 0.5, 0.53, 0.57, 0.6][Math.min(9, y)]);

export default function CarInsurance() {
  const [age, setAge] = useState(35);
  const [group, setGroup] = useState(20);
  const [ncd, setNcd] = useState(5);
  const [mileage, setMileage] = useState(8000);
  const [loc, setLoc] = useState<Loc>('med');
  const [cover, setCover] = useState<Cover>('comp');
  const [excess, setExcess] = useState(350);

  const r = useMemo(() => {
    const base = group * 16 + 150;
    const mileF = mileage < 5000 ? 0.9 : mileage < 10000 ? 1 : mileage < 15000 ? 1.12 : 1.25;
    const coverF = cover === 'comp' ? 1 : 1.1;
    let premium = base * ageFactor(age) * locFactor[loc] * mileF * coverF;
    premium *= 1 - ncdDiscount(ncd);
    premium -= Math.min(excess * 0.15, base * 0.2);
    premium = Math.max(150, premium);
    const low = premium * 0.82;
    const high = premium * 1.18;
    return { premium, low, high, monthly: (premium * 1.1) / 12 };
  }, [age, group, ncd, mileage, loc, cover, excess]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Insurance', href: '/category/insurance' }, { label: 'Car Insurance' }]}
      title="Car Insurance Calculator"
      subtitle="Estimate your annual car insurance premium from your age, no-claims years, the car's insurance group and where you live, and learn how the 1 to 50 group system drives the price."
      calcLabel="Estimate premium"
      inputs={
        <>
          <Panel title="Driver">
            <div className="space-y-4">
              <Field label={`Age, ${age}`}><Slider value={age} onChange={setAge} min={17} max={85} /></Field>
              <Field label={`No-claims discount, ${ncd} year${ncd === 1 ? '' : 's'}`}><Slider value={ncd} onChange={setNcd} min={0} max={9} /></Field>
              <Field label="Location risk">
                <Choice<Loc> name="loc" value={loc} onChange={setLoc} options={[
                  { value: 'low', label: 'Low (rural / small town)' },
                  { value: 'med', label: 'Medium (suburban)' },
                  { value: 'high', label: 'High (city / high-theft)' },
                ]} />
              </Field>
            </div>
          </Panel>
          <Panel title="Vehicle & cover">
            <div className="space-y-4">
              <Field label={`Insurance group, ${group} of 50`} hint="Higher group = pricier to insure"><Slider value={group} onChange={setGroup} min={1} max={50} /></Field>
              <Field label="Annual mileage"><NumberInput value={mileage} onChange={setMileage} step={500} suffix="mi" /></Field>
              <Field label="Cover type">
                <Choice<Cover> name="cover" value={cover} onChange={setCover} options={[
                  { value: 'comp', label: 'Comprehensive' },
                  { value: 'tpft', label: 'Third party, fire & theft' },
                ]} />
              </Field>
              <Field label="Voluntary excess"><MoneyInput value={excess} onChange={setExcess} step={50} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Estimated premium" value={gbp(r.premium)} sub="per year" tone="dark" big />
            <Stat label="Likely range" value={`${gbp(r.low)}, ${gbp(r.high)}`} sub="shop around" tone="accent" />
            <Stat label="Monthly (approx)" value={gbp(r.monthly, 0)} sub="incl. ~10% APR" />
          </div>
          <Callout tone="info" title="This is an estimate">
            Real quotes depend on your exact car, postcode, claims and credit history, and vary widely between
            insurers. Always compare several and check the renewal price each year.
          </Callout>
          <Panel title="What changes your price most">
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li className="flex justify-between"><span>Driver age</span><span className="font-semibold">{age < 25 ? 'Very high impact' : 'Moderate'}</span></li>
              <li className="flex justify-between"><span>Insurance group</span><span className="font-semibold">Group {group}/50</span></li>
              <li className="flex justify-between"><span>No-claims discount</span><span className="font-semibold text-secondary">−{pct(ncdDiscount(ncd) * 100, 0)}</span></li>
              <li className="flex justify-between"><span>Location risk</span><span className="font-semibold capitalize">{loc}</span></li>
            </ul>
          </Panel>
        </>
      }
    >
      <Guide
        title="How car insurance is priced in the UK"
        intro="Two identical drivers can be quoted hundreds of pounds apart. This guide explains the insurance-group system, what really moves your premium, and how to bring it down legitimately."
      >
        <GuideSection kicker="The system" title="Insurance groups 1 to 50">
          <p>Every car is assigned an <strong>insurance group from 1 to 50</strong> by the ABI and Thatcham Research. Group 1 cars are cheapest to insure; group 50 the most expensive. The rating reflects repair costs and parts prices, performance and power, the car&apos;s value, how long repairs take, and security features. A small city car might be group 2 to 5; a fast executive saloon group 40+. Choosing a lower-group car is one of the most effective ways to cut your premium before you even get a quote.</p>
        </GuideSection>
        <GuideSection kicker="The price" title="What insurers actually charge for">
          <p>Your premium is a bet on how likely you are to claim and how much it would cost. The biggest factors are your <strong>age and experience</strong> (under-25s pay far more), your <strong>claims and no-claims history</strong>, the <strong>car&apos;s group</strong>, your <strong>postcode</strong> (theft and accident rates), annual <strong>mileage</strong>, and where the car is kept overnight. Occupation, voluntary excess and how you pay (annually vs monthly) also move the number.</p>
        </GuideSection>
        <GuideSection kicker="Counter-intuitive" title="Why comprehensive can be cheaper">
          <p>It surprises people, but <strong>comprehensive cover is sometimes cheaper than third-party</strong> cover. Drivers who opt for third-party only are, statistically, a higher-risk group, so insurers price that pool higher. Always get both quotes, never assume the lesser cover is cheaper.</p>
        </GuideSection>
        <GuideSection kicker="Save money" title="Legitimate ways to cut your premium">
          <ul className="space-y-3">
            {[
              ['Build and protect no-claims', 'Each claim-free year earns a discount, up to ~60 to 70% after 5+ years. Protecting it costs a little but preserves the discount after a claim.'],
              ['Raise your voluntary excess', 'A higher excess lowers the premium, but only set it as high as you could actually afford to pay after a claim.'],
              ['Pay annually', 'Monthly instalments are a credit agreement with interest (often 20 to 30% APR). Paying yearly avoids it.'],
              ['Add an experienced named driver', 'A low-risk second driver can reduce the price, but never "front" a policy (naming the main user as a named driver), which is fraud.'],
              ['Improve security and reduce mileage', 'Approved alarms, a garage and a lower mileage estimate all help. Keep mileage honest.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}:</strong> {b}</span></li>
            ))}
          </ul>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Auto-renewing', 'Loyalty rarely pays. Compare the market every year, the renewal quote is often beatable.'],
            ['"Fronting" a policy', 'Naming a lower-risk person as main driver to cut a young driver&apos;s premium is insurance fraud and voids the policy.'],
            ['Under-declaring mileage or modifications', 'Inaccurate details can invalidate a claim. Declare everything, including alloys and remaps.'],
            ['Only buying third-party to save money', 'It is often not cheaper and leaves you exposed. Compare comprehensive too.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How do I find my car&apos;s insurance group?', a: 'It is set by the ABI/Thatcham on a 1 to 50 scale and listed in the car&apos;s specification or on comparison sites. Lower numbers are cheaper to insure.' },
            { q: 'Why is my renewal more expensive than last year?', a: 'Insurers raise prices for inflation, rising repair and claims costs, and reduced new-customer discounts. Shopping around almost always beats auto-renewing.' },
            { q: 'Does a black box (telematics) policy help?', a: 'For young or high-risk drivers it can substantially cut premiums by pricing on actual driving behaviour, at the cost of monitoring and curfews on some policies.' },
            { q: 'Is this calculator a real quote?', a: 'No, it is an estimate to show how the main factors interact. Get actual quotes from several insurers for your exact circumstances.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={INSURANCE_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}

export const INSURANCE_RELATED = [
  { href: '/life-insurance-calculator', label: 'Life Insurance', hint: 'How much cover you need' },
  { href: '/critical-illness-calculator', label: 'Critical Illness', hint: 'Cover for serious illness' },
  { href: '/income-protection-calculator', label: 'Income Protection', hint: 'If you can’t work' },
  { href: '/home-insurance-calculator', label: 'Home Rebuild Cost', hint: 'Sum insured & contents' },
  { href: '/travel-insurance-calculator', label: 'Travel Insurance', hint: 'Cover for your trip' },
  { href: '/category/insurance', label: 'All Insurance Tools', hint: 'The full hub' },
];
