'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, LineChart, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { SAVINGS_RELATED } from '../pension-calculator/PensionCalculator';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const GOLD = '#C9A14A';
const CAP = 4000;

export default function LifetimeIsa() {
  const [annual, setAnnual] = useState(4000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(4);

  const r = useMemo(() => {
    const i = rate / 100;
    const yearly: number[] = [0];
    let bal = 0, contrib = 0, bonus = 0;
    for (let y = 1; y <= years; y++) {
      const c = Math.min(annual, CAP);
      contrib += c;
      const b = c * 0.25;
      bonus += b;
      bal = (bal + c + b) * (1 + i);
      yearly.push(bal);
    }
    const growth = bal - contrib - bonus;
    const labels = ['Now', ...Array.from({ length: years }, (_, k) => `Yr ${k + 1}`)];
    return { final: bal, contrib, bonus, growth, yearly, labels };
  }, [annual, years, rate]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Savings', href: '/category/savings' }, { label: 'Lifetime ISA' }]}
      title="Lifetime ISA Calculator"
      subtitle="See how the 25% government bonus boosts a Lifetime ISA for your first home or retirement — up to £1,000 of free money each year on top of your own contributions and growth."
      calcLabel="Calculate bonus"
      inputs={
        <Panel title="Your LISA">
          <div className="space-y-4">
            <Field label={`Annual contribution — ${gbp(annual)}`} hint="Max £4,000/yr qualifies for the bonus"><Slider value={annual} onChange={setAnnual} min={0} max={4000} step={100} /></Field>
            <Field label={`Years saving — ${years}`}><Slider value={years} onChange={setYears} min={1} max={32} /></Field>
            <Field label={`Annual growth — ${pct(rate, 1)}`}><Slider value={rate} onChange={setRate} min={0} max={9} step={0.25} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="LISA value" value={gbp(r.final)} sub={`after ${years} years`} tone="dark" big />
            <Stat label="Free govt bonus" value={gbp(r.bonus)} sub="25% on contributions" tone="accent" />
            <Stat label="You paid in" value={gbp(r.contrib)} sub="contributions" />
          </div>
          <Panel title="Value over time">
            <LineChart height={210} labels={r.labels} format={(v) => gbp(v)} series={[{ points: r.yearly, color: PRIMARY, label: 'LISA value' }]} />
          </Panel>
          <Panel title="Where the value comes from">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="LISA value" centerValue={gbp(r.final)} segments={[
                { value: r.contrib, color: PRIMARY, label: 'You paid in' },
                { value: r.bonus, color: GOLD, label: 'Government bonus' },
                { value: r.growth, color: ACCENT, label: 'Growth' },
              ]} />
              <div className="flex-1 space-y-2 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Contributions</span><span className="font-semibold tabular-nums">{gbp(r.contrib)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Government bonus</span><span className="font-semibold tabular-nums" style={{ color: GOLD }}>{gbp(r.bonus)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Growth</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.growth)}</span></div>
              </div>
            </div>
          </Panel>
          <Callout tone="warn" title="Know the rules before you commit">
            Tax-free for a first home up to £450,000 or from age 60. Withdraw for anything else and a 25% government
            charge applies — which can take back more than the bonus. Open between 18 and 39; pay in until 50.
          </Callout>
        </>
      }
    >
      <Guide
        title="Lifetime ISA explained"
        intro="The Lifetime ISA hands you a 25% government bonus toward a first home or retirement — but the rules and the withdrawal penalty catch people out. This guide covers how to use it well."
      >
        <GuideSection kicker="The basics" title="What the LISA gives you">
          <p>A Lifetime ISA (LISA) lets you save up to <strong>£4,000 a year</strong> and adds a <strong>25% government bonus</strong> — up to £1,000 free each year — on top. The £4,000 counts toward your overall £20,000 ISA allowance. It comes as a Cash LISA (interest) or Stocks & Shares LISA (invested), and all growth is tax-free like any ISA. It&apos;s designed for two specific goals: buying a first home or saving for retirement.</p>
        </GuideSection>
        <GuideSection kicker="Eligibility" title="The age rules">
          <p>You can open a LISA between ages <strong>18 and 39</strong>, and keep paying in (and earning the bonus) until you turn <strong>50</strong>. Even if you can&apos;t use it yet, opening one before 40 secures the option for later. The bonus is paid monthly on what you contribute, so paying in earlier in the year captures the bonus sooner.</p>
        </GuideSection>
        <GuideSection kicker="First home" title="Using it to buy a home">
          <p>You can use the LISA (including the bonus) toward a <strong>first home costing up to £450,000</strong>, provided the account has been open at least 12 months and you buy with a mortgage. For couples who are both first-time buyers, each can have a LISA and combine the bonuses — up to £2,000 a year of free money toward the same home.</p>
          <Callout tone="tip" title="Open one early to start the clock">Even £1 opens the account and starts the 12-month qualifying period. If you might buy a first home in the next few years, opening before 40 keeps the door open.</Callout>
        </GuideSection>
        <GuideSection kicker="The catch" title="The 25% withdrawal charge">
          <p>If you withdraw for anything other than a qualifying first home or after age 60 (or terminal illness), you pay a <strong>25% government charge</strong> on the amount withdrawn. Because the charge is on the whole balance — not just the bonus — it claws back the bonus <em>and</em> a little of your own money: you can end up with less than you put in. Only use a LISA for money you&apos;re confident is for a first home or retirement.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Saving money you might need sooner', 'The 25% charge on non-qualifying withdrawals can leave you worse off than a normal ISA.'],
            ['Buying above £450,000', 'A first home over the cap doesn&apos;t qualify, and withdrawing then triggers the charge.'],
            ['Leaving it too late to open', 'You must open before 40. Open early even with a token amount to keep the option.'],
            ['Ignoring the LISA vs pension question', 'For retirement, a workplace pension with employer matching often beats a LISA. Compare both.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much bonus can I get?', a: '25% on up to £4,000 a year — a maximum of £1,000 free annually, until age 50. Over many years that can total tens of thousands.' },
            { q: 'Can I use a LISA and a Help to Buy ISA?', a: 'You can hold both, but you can only use the bonus from one of them toward a property purchase.' },
            { q: 'What if my first home costs more than £450,000?', a: 'It won&apos;t qualify for penalty-free use, and withdrawing would trigger the 25% charge. The cap is fixed regardless of region.' },
            { q: 'Is a LISA better than a pension for retirement?', a: 'A pension with employer matching and higher-rate tax relief is often better for retirement; a LISA can suit the self-employed or as a complement. For a first home, the LISA is hard to beat.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={SAVINGS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
