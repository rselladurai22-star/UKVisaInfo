'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, Toggle, LineChart,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { SAVINGS_RELATED } from '../pension-calculator/PensionCalculator';

const PRIMARY = '#0037b0';

export default function PensionDrawdown() {
  const [pot, setPot] = useState(300000);
  const [takeTaxFree, setTakeTaxFree] = useState(true);
  const [withdrawal, setWithdrawal] = useState(16000);
  const [growth, setGrowth] = useState(4);
  const [age, setAge] = useState(60);

  const r = useMemo(() => {
    const i = growth / 100;
    const taxFree = takeTaxFree ? pot * 0.25 : 0;
    let bal = pot - taxFree;
    const yearly: number[] = [bal];
    const labels: string[] = [`Age ${age}`];
    let depletedAge = 0;
    let a = age;
    for (let y = 1; y <= 40; y++) {
      a = age + y;
      bal = bal * (1 + i) - withdrawal;
      if (bal <= 0) { bal = 0; if (!depletedAge) depletedAge = a; yearly.push(0); labels.push(`Age ${a}`); break; }
      yearly.push(bal);
      labels.push(`Age ${a}`);
    }
    const startBal = pot - taxFree;
    const sustainable = startBal * 0.04;
    return { taxFree, depletedAge, yearly, labels, sustainable, lastsYears: depletedAge ? depletedAge - age : 40, valueEnd: bal };
  }, [pot, takeTaxFree, withdrawal, growth, age]);

  const risky = withdrawal > r.sustainable * 1.15;

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Savings', href: '/category/savings' }, { label: 'Pension Drawdown' }]}
      title="Pension Drawdown Calculator"
      subtitle="See how long your pension pot could last in drawdown at a chosen yearly income, after taking your 25% tax-free cash, and whether your withdrawal rate is sustainable."
      calcLabel="Run drawdown"
      inputs={
        <>
          <Panel title="Your pot">
            <div className="space-y-4">
              <Field label="Pension pot"><MoneyInput value={pot} onChange={setPot} step={5000} /></Field>
              <Toggle checked={takeTaxFree} onChange={setTakeTaxFree} label="Take 25% tax-free cash upfront" />
              <Field label={`Age you start, ${age}`}><Slider value={age} onChange={setAge} min={55} max={75} /></Field>
            </div>
          </Panel>
          <Panel title="Income & growth">
            <div className="space-y-4">
              <Field label="Annual income you want"><MoneyInput value={withdrawal} onChange={setWithdrawal} step={500} /></Field>
              <Field label={`Assumed growth, ${pct(growth, 1)}/yr`} hint="After charges, while invested in drawdown"><Slider value={growth} onChange={setGrowth} min={0} max={8} step={0.25} /></Field>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Pot lasts" value={r.depletedAge ? `to age ${r.depletedAge}` : '40+ yrs'} sub={r.depletedAge ? `${r.lastsYears} years` : 'still growing'} tone="dark" big />
            <Stat label="Tax-free cash" value={gbp(r.taxFree)} sub="25% upfront" tone="accent" />
            <Stat label="Sustainable income" value={gbp(r.sustainable, 0)} sub="≈4% of pot/yr" />
          </div>
          <Panel title="Pot value through retirement">
            <LineChart height={210} labels={r.labels} format={(v) => gbp(v)} series={[{ points: r.yearly, color: PRIMARY, label: 'Pot value', payoffIndex: r.depletedAge ? r.yearly.length - 1 : undefined }]} />
          </Panel>
          <Callout tone={risky ? 'warn' : 'info'} title={risky ? 'Withdrawal rate looks high' : 'About drawdown'}>
            {risky
              ? `Taking ${gbp(withdrawal)}/yr is above a sustainable ~4% (${gbp(r.sustainable, 0)}). The pot could run out by age ${r.depletedAge || age + r.lastsYears}. Consider a lower income or an annuity for guaranteed income.`
              : 'Drawdown keeps your pot invested while you take an income. Returns aren’t guaranteed, a poor run of markets early on can deplete the pot faster than projected.'}
          </Callout>
        </>
      }
    >
      <Guide
        title="Pension drawdown explained"
        intro="Drawdown lets you keep your pension invested and take a flexible income in retirement. It offers control and growth potential, but the pot can run out. Here's how to use it wisely."
      >
        <GuideSection kicker="The basics" title="What flexi-access drawdown is">
          <p>From age 55 (57 from 2028) you can move your pension into <strong>flexi-access drawdown</strong>: take up to <strong>25% as a tax-free lump sum</strong>, leave the rest invested, and withdraw income as you choose. Withdrawals beyond the tax-free cash are taxed as income. Unlike an annuity, your pot stays invested so it can keep growing, but it can also fall, and you bear the risk of it running out.</p>
        </GuideSection>
        <GuideSection kicker="The key risk" title="The 4% rule and sustainability">
          <p>A widely used guide is to withdraw around <strong>4% of the pot a year</strong>, which historically gave a good chance of the money lasting 30 years. Take much more and you risk depleting the pot, especially if markets fall early in retirement, a problem called <strong>sequence-of-returns risk</strong>. The calculator shows when your chosen income would exhaust the pot at your growth assumption.</p>
          <Callout tone="warn" title="Sequence risk is real">Two retirees with the same average return can have very different outcomes if one hits a downturn in their first few years. Staying flexible, trimming withdrawals in bad years, helps the pot recover.</Callout>
        </GuideSection>
        <GuideSection kicker="Tax" title="How drawdown income is taxed">
          <p>The 25% tax-free cash is just that, tax-free. Everything else you withdraw is added to your income for the year and taxed at your marginal rate, so large withdrawals can push you into a higher tax band. Spreading withdrawals across tax years, and using your personal allowance and any ISA income, can reduce the tax you pay. Taking a big lump sum in one year is often the costliest approach.</p>
        </GuideSection>
        <GuideSection kicker="Compare" title="Drawdown vs annuity">
          <p>An <strong>annuity</strong> swaps your pot for a guaranteed income for life, certainty, but no flexibility or inheritance of the pot (depending on options). <strong>Drawdown</strong> offers flexibility, growth potential and the ability to leave the pot to heirs, but with investment risk and the chance of running out. Many people blend the two: an annuity to cover essential bills, drawdown for the rest.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Withdrawing too much too soon', 'A high early withdrawal rate, especially in a downturn, can exhaust the pot. Stay near a sustainable rate.'],
            ['Taking a big taxable lump sum', 'Large one-off withdrawals can push you into higher tax. Spread them across tax years.'],
            ['Leaving cash uninvested', 'Holding the whole pot in cash during a long retirement risks inflation eroding it.'],
            ['Going it alone on big decisions', 'Drawdown is complex and irreversible in parts, consider regulated advice or Pension Wise (free).'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much can I take tax-free?', a: 'Normally 25% of your pension pot is tax-free (up to a lump-sum allowance). The rest is taxed as income when withdrawn.' },
            { q: 'How long will my pension last?', a: 'It depends on the pot size, your withdrawal rate and investment returns. Around 4% a year is a common sustainable guide; the calculator shows when your chosen income would run out.' },
            { q: 'Is drawdown better than an annuity?', a: 'Drawdown offers flexibility and growth but carries risk; an annuity gives guaranteed income but less flexibility. Many retirees combine both.' },
            { q: 'Can I run out of money in drawdown?', a: 'Yes, unlike an annuity, drawdown isn&apos;t guaranteed for life. Withdraw sustainably and review regularly, especially after market falls.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={SAVINGS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
