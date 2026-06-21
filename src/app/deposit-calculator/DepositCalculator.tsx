'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, LineChart,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { PROPERTY_RELATED } from '../ltv-calculator/LtvCalculator';

const PRIMARY = '#0037b0';

export default function DepositCalculator() {
  const [price, setPrice] = useState(280000);
  const [depositPct, setDepositPct] = useState(15);
  const [savings, setSavings] = useState(18000);
  const [monthly, setMonthly] = useState(600);
  const [interest, setInterest] = useState(4);

  const r = useMemo(() => {
    const target = price * (depositPct / 100);
    const shortfall = Math.max(0, target - savings);
    const mr = interest / 100 / 12;

    let bal = savings;
    let m = 0;
    const yearly: number[] = [bal];
    const labels: string[] = ['Now'];
    while (bal < target && m < 1200) {
      bal = bal * (1 + mr) + monthly;
      m++;
      if (m % 12 === 0) { yearly.push(Math.min(bal, target)); labels.push(`Yr ${m / 12}`); }
    }
    if (m % 12 !== 0) { yearly.push(Math.min(bal, target)); labels.push(`${(m / 12).toFixed(1)}y`); }
    const reached = bal >= target;
    const ltv = 100 - depositPct;
    return { target, shortfall, months: m, reached, yearly, labels, ltv };
  }, [price, depositPct, savings, monthly, interest]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Property', href: '/category/property' }, { label: 'Deposit Calculator' }]}
      title="Mortgage Deposit Calculator"
      subtitle="See the deposit you need for your target home, how far your savings have to go, and how long it will take to get there at your current saving rate."
      inputs={
        <>
          <Panel title="Your target">
            <div className="space-y-4">
              <Field label="Target property price"><MoneyInput value={price} onChange={setPrice} step={5000} /></Field>
              <Field label={`Deposit target, ${depositPct}%`} hint={`${pct(100 - depositPct)} LTV mortgage`}><Slider value={depositPct} onChange={setDepositPct} min={5} max={40} step={1} /></Field>
            </div>
          </Panel>
          <Panel title="Your saving">
            <div className="space-y-4">
              <Field label="Current savings"><MoneyInput value={savings} onChange={setSavings} step={500} /></Field>
              <Field label="Monthly saving"><MoneyInput value={monthly} onChange={setMonthly} step={50} /></Field>
              <Field label={`Savings interest, ${pct(interest, 1)}`}><Slider value={interest} onChange={setInterest} min={0} max={8} step={0.1} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Deposit needed" value={gbp(r.target)} sub={`${depositPct}% of price`} tone="dark" big />
            <Stat label="Still to save" value={gbp(r.shortfall)} sub={r.shortfall > 0 ? 'shortfall' : 'target met'} tone="accent" />
            <Stat label="Time to target" value={r.reached ? `${Math.floor(r.months / 12)}y ${r.months % 12}m` : '10y+'} sub="at current rate" />
          </div>

          <Panel title="Savings growth to target">
            <LineChart height={200} labels={r.labels} format={(v) => gbp(v)}
              series={[{ points: r.yearly, color: PRIMARY, label: 'Savings', payoffIndex: r.reached ? r.yearly.length - 1 : undefined }]} />
            <p className="mt-2 text-xs text-on-surface-variant">Assumes interest compounds monthly and you keep saving {gbp(monthly)}/month. The marker is when you hit your {gbp(r.target)} target.</p>
          </Panel>

          <Callout tone="info" title="Don't forget the other upfront costs">
            Your deposit isn&apos;t the only cash you need. Budget separately for stamp duty, legal/conveyancing fees,
            a survey and removals, often several thousand pounds on top. Use the House Buying Costs calculator for the full figure.
          </Callout>

          <p className="text-[11px] text-on-surface-variant">Estimate only. Savings rates and house prices change; revisit as your plans firm up.</p>
        </>
      }
    >
      <Guide
        title="How much deposit do you really need?"
        intro="Your deposit decides which mortgages you can access and the rate you'll pay. This guide covers how much to aim for, the schemes that can boost it, and the smart way to get there faster."
      >
        <GuideSection kicker="The basics" title="Deposit, LTV and your rate">
          <p>Your deposit is the cash you put in; the mortgage covers the rest. The bigger the deposit, the lower your loan-to-value (LTV) and the cheaper your rate. The mainstream minimum is 5% (a 95% mortgage), but rates improve markedly at 10%, 15%, 25% and especially 40%+ deposits. A larger deposit also widens your choice of lenders and improves affordability.</p>
        </GuideSection>
        <GuideSection kicker="Targets" title="5%, 10%, 15% or 25%?">
          <p>A 5% deposit gets you on the ladder but at the highest rates and with the most exposure to negative equity if prices dip. 10 to 15% is the practical sweet spot for most first-time buyers, balancing achievability against rate. 25% (a 75% mortgage) unlocks some of the best deals. Beyond 40% the rate benefit flattens, so it&apos;s rarely worth delaying a purchase just to push the deposit higher.</p>
          <div className="my-4 overflow-x-auto rounded-xl border border-outline-variant">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-left"><tr><th className="px-4 py-3 font-bold">Deposit</th><th className="px-4 py-3 font-bold">LTV</th><th className="px-4 py-3 font-bold">Typical rate access</th></tr></thead>
              <tbody className="divide-y divide-outline-variant/60">
                <tr><td className="px-4 py-3">5%</td><td className="px-4 py-3">95%</td><td className="px-4 py-3">Highest rates, fewest lenders</td></tr>
                <tr><td className="px-4 py-3">10%</td><td className="px-4 py-3">90%</td><td className="px-4 py-3">Good choice, mid rates</td></tr>
                <tr><td className="px-4 py-3">15%</td><td className="px-4 py-3">85%</td><td className="px-4 py-3">Strong rates</td></tr>
                <tr><td className="px-4 py-3">25%</td><td className="px-4 py-3">75%</td><td className="px-4 py-3">Among the best deals</td></tr>
                <tr><td className="px-4 py-3">40%+</td><td className="px-4 py-3">≤60%</td><td className="px-4 py-3">Cheapest rates available</td></tr>
              </tbody>
            </table>
          </div>
        </GuideSection>
        <GuideSection kicker="Boosters" title="LISA, gifted deposits and schemes">
          <p>A <strong>Lifetime ISA</strong> adds a 25% government bonus on up to £4,000 a year (£1,000 free annually) toward a first home up to £450,000, one of the most powerful deposit boosters available. A <strong>gifted deposit</strong> from family is widely accepted if accompanied by a letter confirming it&apos;s a gift, not a loan. Shared ownership and other schemes can lower the cash needed, at the cost of rent on the share you don&apos;t own.</p>
          <Callout tone="tip" title="Use a LISA early">Because the bonus is paid on contributions, opening and feeding a Lifetime ISA sooner captures more free money, but remember withdrawals for anything other than a first home (or after 60) carry a penalty.</Callout>
        </GuideSection>
        <GuideSection kicker="Get there faster" title="Where to keep your deposit">
          <p>While you save, your deposit should work, but safely. Easy-access and fixed-rate savings, cash ISAs and Lifetime ISAs all suit short horizons because the capital is protected. Avoid putting a deposit you&apos;ll need within a few years into the stock market, where a downturn could hit just as you&apos;re ready to buy. The calculator above lets you see how your interest rate and monthly contribution change the timeline.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Saving only for the deposit', 'Stamp duty, legal fees, survey and moving costs need separate cash, don&apos;t arrive at completion short.'],
            ['Ignoring the LISA bonus', 'For eligible first-time buyers, the 25% bonus is effectively a free uplift to your deposit.'],
            ['Draining your emergency fund', 'Keep a cash buffer after completion for moving-in costs and the unexpected.'],
            ['Chasing 40% when 25% is enough', 'Beyond a 75% mortgage the rate gains shrink; buying sooner may beat saving longer.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is the minimum deposit for a UK mortgage?', a: 'Usually 5% of the property value, though 95% mortgages carry higher rates. Some schemes and guarantor arrangements can reduce the cash you personally need.' },
            { q: 'Does a bigger deposit always get a better rate?', a: 'Up to a point. Rates improve as you cross LTV bands down to about 60% LTV (a 40% deposit); beyond that the improvement is marginal.' },
            { q: 'Can my parents gift my deposit?', a: 'Yes. Most lenders accept gifted deposits from close family with a short letter confirming the money is a gift with no stake in the property.' },
            { q: 'Should I use a Lifetime ISA?', a: 'If you are a first-time buyer purchasing under £450,000, the 25% bonus (up to £1,000 a year) is very valuable. Be aware of the withdrawal penalty for non-qualifying uses.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={PROPERTY_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
