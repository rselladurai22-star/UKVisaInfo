'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, Slider, LineChart, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { SAVINGS_RELATED } from '../pension-calculator/PensionCalculator';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const ALLOWANCE = 20000;

export default function IsaCalculator() {
  const [initial, setInitial] = useState(5000);
  const [monthly, setMonthly] = useState(300);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(15);

  const r = useMemo(() => {
    const i = rate / 1200;
    const yearly: number[] = [initial];
    let bal = initial;
    for (let y = 1; y <= years; y++) { for (let k = 0; k < 12; k++) bal = bal * (1 + i) + monthly; yearly.push(bal); }
    const contributions = initial + monthly * 12 * years;
    const growth = bal - contributions;
    const firstYearIn = initial + monthly * 12;
    const labels = ['Now', ...Array.from({ length: years }, (_, k) => `Yr ${k + 1}`)];
    return { final: bal, contributions, growth, firstYearIn, yearly, labels, overAllowance: firstYearIn > ALLOWANCE };
  }, [initial, monthly, rate, years]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Savings', href: '/category/savings' }, { label: 'ISA Calculator' }]}
      title="ISA Calculator"
      subtitle="See how a Stocks & Shares or Cash ISA could grow tax-free over time from a lump sum and regular saving, all within the £20,000 annual ISA allowance."
      calcLabel="Calculate growth"
      inputs={
        <Panel title="Your ISA">
          <div className="space-y-4">
            <Field label="Starting balance"><MoneyInput value={initial} onChange={setInitial} step={500} /></Field>
            <Field label="Monthly contribution"><MoneyInput value={monthly} onChange={setMonthly} step={25} /></Field>
            <Field label={`Annual return, ${pct(rate, 1)}`} hint="Cash ISA ~3 to 5%; investments vary"><Slider value={rate} onChange={setRate} min={0} max={10} step={0.1} /></Field>
            <Field label={`Years, ${years}`}><Slider value={years} onChange={setYears} min={1} max={40} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="ISA value" value={gbp(r.final)} sub={`after ${years} years`} tone="dark" big />
            <Stat label="Tax-free growth" value={gbp(r.growth)} sub="no tax to pay" tone="accent" />
            <Stat label="You paid in" value={gbp(r.contributions)} sub="contributions" />
          </div>
          {r.overAllowance && (
            <Callout tone="warn" title="Over the £20,000 allowance">
              Your first-year contributions ({gbp(r.firstYearIn)}) exceed the £20,000 annual ISA allowance. You can&apos;t
              pay more than £20,000 across all ISAs in one tax year.
            </Callout>
          )}
          <Panel title="Tax-free growth over time">
            <LineChart height={210} labels={r.labels} format={(v) => gbp(v)} series={[{ points: r.yearly, color: PRIMARY, label: 'ISA value' }]} />
          </Panel>
          <Panel title="Contributions vs growth">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="ISA value" centerValue={gbp(r.final)} segments={[
                { value: r.contributions, color: PRIMARY, label: 'You paid in' },
                { value: r.growth, color: ACCENT, label: 'Tax-free growth' },
              ]} />
              <div className="flex-1 space-y-3 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Contributions</span><span className="font-semibold tabular-nums">{gbp(r.contributions)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Growth (tax-free)</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.growth)}</span></div>
              </div>
            </div>
          </Panel>
        </>
      }
    >
      <Guide
        title="ISAs explained"
        intro="An ISA lets your savings and investments grow completely free of UK tax. This guide covers the types of ISA, the £20,000 allowance, and how to make the most of the tax-free wrapper."
      >
        <GuideSection kicker="The basics" title="What an ISA is">
          <p>An Individual Savings Account (ISA) is a tax-free wrapper: any interest, dividends or capital gains earned inside it are completely free of UK tax, and you never declare it. You can pay in up to <strong>£20,000 per tax year</strong> (2025/26) across all your ISAs combined. There&apos;s no tax on the way out either, withdrawals are tax-free at any time (subject to each product&apos;s rules).</p>
        </GuideSection>
        <GuideSection kicker="Types" title="Cash, Stocks & Shares, LISA and more">
          <ul className="space-y-3">
            {[
              ['Cash ISA', 'Like a tax-free savings account. Best for short-term money and emergency funds; returns track interest rates.'],
              ['Stocks & Shares ISA', 'Invest in funds, shares and bonds. Higher potential returns over the long run, with risk of falls. Best for 5+ year goals.'],
              ['Lifetime ISA (LISA)', 'A 25% government bonus for a first home or retirement, with rules and a withdrawal penalty. See the dedicated LISA calculator.'],
              ['Innovative Finance & Junior ISA', 'IFISA holds peer-to-peer loans (higher risk); Junior ISA is a tax-free pot for under-18s with its own allowance.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /><span><strong className="text-on-surface">{h}:</strong> {b}</span></li>
            ))}
          </ul>
        </GuideSection>
        <GuideSection kicker="The allowance" title="Using your £20,000 wisely">
          <p>The £20,000 allowance resets every 6 April and <strong>can&apos;t be carried over</strong>, use it or lose it. You can split it across different ISA types in the same year. Since April 2024 you can pay into multiple ISAs of the same type in one year, giving more flexibility to chase the best rates. A &quot;flexible&quot; ISA even lets you withdraw and replace money in the same tax year without losing the allowance.</p>
          <Callout tone="tip" title="Cash for soon, shares for later">Use a Cash ISA for money you&apos;ll need within a few years, and a Stocks & Shares ISA for long-term goals where time smooths out market ups and downs.</Callout>
        </GuideSection>
        <GuideSection kicker="Why it matters" title="The tax saving compounds">
          <p>Outside an ISA, savings interest above your Personal Savings Allowance and investment gains above the annual exempt amount are taxable, and those allowances have shrunk. Inside an ISA, none of it is taxed, so more of your return stays invested and compounds. Over decades, sheltering growth from tax can add a substantial amount to your pot.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Leaving the allowance unused', 'It resets each year and can&apos;t be reclaimed. Contribute what you can before 5 April.'],
            ['Holding long-term money in cash', 'Over many years, cash often loses to inflation; investments historically do better for long horizons.'],
            ['Chasing a poor Cash ISA rate', 'Compare rates and switch via transfer (don&apos;t withdraw and re-deposit, which uses your allowance).'],
            ['Forgetting flexible ISA rules', 'With a non-flexible ISA, replacing a withdrawal counts as a new contribution against your allowance.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much can I put in an ISA?', a: '£20,000 per tax year across all your ISAs combined in 2025/26. The allowance resets on 6 April and cannot be carried forward.' },
            { q: 'Is ISA growth really tax-free?', a: 'Yes, interest, dividends and capital gains inside an ISA are free of UK tax, and you don&apos;t declare them on a tax return.' },
            { q: 'Cash ISA or Stocks & Shares ISA?', a: 'Cash ISA suits short-term and emergency money; Stocks & Shares ISA suits long-term goals (5+ years) where higher expected returns outweigh short-term risk.' },
            { q: 'Can I transfer an ISA?', a: 'Yes, always use the provider&apos;s transfer process to keep the tax-free status. Withdrawing and re-paying uses up your annual allowance.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={SAVINGS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
