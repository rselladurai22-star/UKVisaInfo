'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { PROPERTY_RELATED } from '../ltv-calculator/LtvCalculator';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

export default function EquityCalculator() {
  const [value, setValue] = useState(360000);
  const [balance, setBalance] = useState(190000);
  const [maxLtv, setMaxLtv] = useState(85);

  const r = useMemo(() => {
    const equity = Math.max(0, value - balance);
    const equityPct = value > 0 ? (equity / value) * 100 : 0;
    const ltv = value > 0 ? (balance / value) * 100 : 0;
    const borrowCeiling = value * (maxLtv / 100);
    const releasable = Math.max(0, borrowCeiling - balance);
    return { equity, equityPct, ltv, releasable };
  }, [value, balance, maxLtv]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Property', href: '/category/property' }, { label: 'Equity Calculator' }]}
      title="Home Equity Calculator"
      subtitle="See how much of your home you actually own, your current LTV, and roughly how much equity you could release by remortgaging to a higher loan-to-value."
      inputs={
        <Panel title="Your property">
          <div className="space-y-4">
            <Field label="Current property value"><MoneyInput value={value} onChange={setValue} step={5000} /></Field>
            <Field label="Outstanding mortgage"><MoneyInput value={balance} onChange={setBalance} step={1000} /></Field>
            <Field label={`Max LTV you could borrow to — ${maxLtv}%`} hint="Lenders typically allow up to 80–90% for capital raising"><Slider value={maxLtv} onChange={setMaxLtv} min={60} max={95} step={1} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Your equity" value={gbp(r.equity)} sub={`${pct(r.equityPct, 1)} of value`} tone="dark" big />
            <Stat label="Current LTV" value={pct(r.ltv, 1)} sub="mortgage ÷ value" />
            <Stat label="Could release" value={gbp(r.releasable)} sub={`up to ${maxLtv}% LTV`} tone="accent" />
          </div>

          <Panel title="Equity vs mortgage">
            <BarTrack segments={[{ value: r.equity, color: ACCENT }, { value: balance, color: PRIMARY }]} />
            <div className="flex justify-between text-xs text-on-surface-variant mt-2">
              <span>Equity {gbp(r.equity)}</span>
              <span>Mortgage {gbp(balance)}</span>
            </div>
            <p className="mt-3 text-sm text-on-surface-variant">
              Releasing equity means borrowing more against your home — it increases your mortgage and monthly cost.
              Borrowing up to {maxLtv}% LTV could free up around <strong className="text-secondary">{gbp(r.releasable)}</strong>,
              subject to affordability and lender approval.
            </p>
          </Panel>

          <p className="text-[11px] text-on-surface-variant">Estimate only. Releasing equity is borrowing — it must be affordable and is secured on your home. This is not advice.</p>
        </>
      }
    >
      <Guide
        title="Home equity, and how to release it"
        intro="Equity is the part of your home you own outright. This guide explains how it builds, the ways to turn it into cash, and the trade-offs to weigh before borrowing against your house."
      >
        <GuideSection kicker="Definition" title="What home equity is">
          <p>Equity is your property&apos;s value minus the mortgage secured on it. A £360,000 home with a £190,000 mortgage holds £170,000 of equity — about 47% of the value, an LTV of 53%. Equity grows two ways: as you pay down the mortgage (each repayment buys a little more), and as the property&apos;s value rises.</p>
          <div className="my-3 p-5 rounded-lg bg-surface-container text-center"><code className="text-sm sm:text-base font-semibold text-primary">Equity = property value − outstanding mortgage</code></div>
        </GuideSection>
        <GuideSection kicker="Access" title="Ways to release equity">
          <p>There are several routes, each with different costs and risks:</p>
          <ul className="space-y-3 mt-2">
            {[
              ['Remortgage for more', 'Switch to a new, larger mortgage and take the difference as cash. Usually the cheapest route if you can pass affordability.'],
              ['Further advance', 'Borrow extra from your existing lender, often at a different rate to your main loan.'],
              ['Second-charge mortgage', 'A separate loan secured behind your main mortgage — useful if you don&apos;t want to disturb a good rate, but typically dearer.'],
              ['Lifetime mortgage (equity release)', 'For older homeowners (usually 55+): borrow against the home with no monthly payments, repaid from the eventual sale. Interest rolls up, so the debt grows.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /><span><strong className="text-on-surface">{h}:</strong> {b}</span></li>
            ))}
          </ul>
        </GuideSection>
        <GuideSection kicker="Uses" title="What people release equity for">
          <p>Common uses include home improvements (which may add value), consolidating more expensive debt, helping a child with their own deposit, or funding retirement. The key test is whether the benefit justifies turning unsecured flexibility into secured, long-term debt against your home.</p>
          <Callout tone="warn" title="Consolidating debt is a trade-off">Moving short-term debt onto your mortgage lowers the monthly cost but can cost far more in total interest because you repay it over decades — and your home is now at risk if you can&apos;t pay.</Callout>
        </GuideSection>
        <GuideSection kicker="Risks" title="Before you borrow against your home">
          <p>Releasing equity raises your LTV, which can push you into a more expensive rate band, and it increases your monthly payment and total interest. With a lifetime mortgage, rolled-up interest can erode the inheritance you leave. Always check the impact on affordability, on any benefits you receive, and take regulated advice — equity release in particular requires it.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Treating equity as free money', 'It&apos;s borrowing secured on your home, repayable with interest, not spare cash.'],
            ['Overstating your value', 'A surveyor&apos;s valuation may be lower than you hope, reducing how much you can release.'],
            ['Ignoring the rate-band effect', 'Raising your LTV can move you to a pricier band, increasing the cost on the whole loan.'],
            ['Skipping advice on lifetime mortgages', 'Rolled-up interest and early-repayment charges make these complex — regulated advice is required for good reason.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much equity can I release?', a: 'It depends on your property value, current mortgage and the maximum LTV the lender allows (often 80–90% for capital raising), plus affordability. The calculator gives a rough ceiling.' },
            { q: 'Is releasing equity the same as equity release?', a: 'Not quite. "Equity release" usually refers to lifetime mortgages for older homeowners. Releasing equity more broadly includes remortgaging or a further advance, which you repay monthly.' },
            { q: 'Will releasing equity affect my rate?', a: 'It can. Borrowing more raises your LTV, which may move you into a more expensive band, and the new borrowing is priced at current rates.' },
            { q: 'Do I pay tax on released equity?', a: 'No — borrowed money is not income, so it is not taxed. But it is debt that must be repaid with interest.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={PROPERTY_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
