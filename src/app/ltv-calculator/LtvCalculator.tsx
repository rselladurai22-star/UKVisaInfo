'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const BANDS = [95, 90, 85, 80, 75, 60];

export default function LtvCalculator() {
  const [value, setValue] = useState(280000);
  const [deposit, setDeposit] = useState(42000);

  const r = useMemo(() => {
    const loan = Math.max(0, value - deposit);
    const ltv = value > 0 ? (loan / value) * 100 : 0;
    const equityPct = 100 - ltv;
    const nextBand = [...BANDS].reverse().find((b) => b < ltv - 0.001);
    const depositForNext = nextBand ? Math.max(0, loan - value * (nextBand / 100)) : 0;
    return { loan, ltv, equityPct, nextBand, depositForNext };
  }, [value, deposit]);

  const tone = r.ltv <= 60 ? '#0a7d4f' : r.ltv <= 80 ? PRIMARY : r.ltv <= 90 ? ACCENT : '#ba1a1a';

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Property', href: '/category/property' }, { label: 'LTV Calculator' }]}
      title="Loan-to-Value (LTV) Calculator"
      subtitle="Work out your LTV, how much equity you hold, and exactly how much extra deposit would drop you into a cheaper rate band."
      inputs={
        <Panel title="Your figures">
          <div className="space-y-4">
            <Field label="Property value"><MoneyInput value={value} onChange={setValue} step={5000} /></Field>
            <Field label="Deposit (or equity)" hint={`${pct(value ? (deposit / value) * 100 : 0)} of value`}><MoneyInput value={deposit} onChange={setDeposit} step={1000} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Loan-to-value" value={pct(r.ltv, 1)} sub="of property value" tone="dark" big />
            <Stat label="Mortgage needed" value={gbp(r.loan)} sub={`${pct(r.equityPct, 1)} equity`} />
            <Stat label="Your equity" value={gbp(deposit)} sub="deposit / owned share" tone="accent" />
          </div>

          <Panel title="LTV band">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-on-surface-variant">Your LTV</span>
              <span className="font-bold tabular-nums" style={{ color: tone }}>{pct(r.ltv, 1)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, r.ltv)}%`, background: tone }} />
            </div>
            <div className="flex gap-1 mt-3">
              {BANDS.map((b) => (
                <div key={b} className={`flex-1 text-center py-1.5 rounded text-[11px] font-bold ${r.ltv <= b ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>≤{b}%</div>
              ))}
            </div>
            {r.nextBand ? (
              <p className="mt-3 text-sm text-on-surface-variant">
                Add <strong className="text-secondary">{gbp(r.depositForNext)}</strong> to your deposit to reach the
                <strong> {r.nextBand}%</strong> band and unlock a cheaper rate on the whole loan.
              </p>
            ) : (
              <p className="mt-3 text-sm text-on-surface-variant">You&apos;re in the lowest mainstream band, further deposit gives little rate benefit.</p>
            )}
          </Panel>

          <Panel title="Equity vs mortgage">
            <BarTrack segments={[{ value: deposit, color: ACCENT, label: 'Equity' }, { value: r.loan, color: PRIMARY, label: 'Mortgage' }]} />
            <div className="flex justify-between text-xs text-on-surface-variant mt-2">
              <span>Equity {gbp(deposit)}</span>
              <span>Mortgage {gbp(r.loan)}</span>
            </div>
          </Panel>

          <p className="text-[11px] text-on-surface-variant">Estimate only. Lenders value property independently, which can change your LTV at application.</p>
        </>
      }
    >
      <Guide
        title="Loan-to-value explained"
        intro="LTV is the single number that most influences your mortgage rate. This guide explains what it means, why the bands behave like cliff-edges, and how to use a small overpayment or a higher valuation to land a cheaper deal."
      >
        <GuideSection kicker="Definition" title="What LTV actually measures">
          <p>Loan-to-value is your mortgage as a percentage of the property&apos;s value. Borrow £238,000 against a £280,000 home and your LTV is 85%, the remaining 15% (£42,000) is your equity. Lower LTV means the lender is risking less of the property&apos;s worth, so they reward you with a cheaper rate.</p>
          <div className="my-3 p-5 rounded-lg bg-surface-container text-center"><code className="text-sm sm:text-base font-semibold text-primary">LTV = mortgage ÷ property value × 100</code></div>
        </GuideSection>
        <GuideSection kicker="Why it matters" title="The cliff-edge bands">
          <p>Lenders price in discrete bands, typically 95%, 90%, 85%, 80%, 75% and 60%. They&apos;re step changes, not a smooth slope: moving from 80.1% to 79.9% can unlock a noticeably lower rate on the <em>entire</em> loan, not just the part above the threshold. That makes a small overpayment near a boundary one of the highest-return moves in personal finance.</p>
          <Callout tone="tip" title="Tier-jumping">A modest top-up that nudges you into the next band down can produce an effective first-year return well into double digits, because the cheaper rate applies to the whole balance.</Callout>
        </GuideSection>
        <GuideSection kicker="Lower it" title="How to reduce your LTV">
          <p>Two levers move LTV: a bigger deposit (or overpayment) shrinks the loan, and a higher valuation lifts the value. At remortgage, house-price growth since you bought can quietly drop your LTV into a cheaper band, always check before you assume you&apos;re stuck on your old rate. Below 60% LTV the rate benefit largely flattens, so further overpayments are better weighed against pensions and ISAs.</p>
        </GuideSection>
        <GuideSection kicker="Worked example" title="£280,000 home, 85% to 80%">
          <p>With a £42,000 deposit you&apos;re at 85% LTV on a £280,000 home. To reach 80% you need the loan down to £224,000, a deposit of £56,000, so £14,000 more. If that unlocks a rate cut of even 0.3% on a £224,000 loan, that&apos;s around £672 a year saved for the life of the deal, on top of the interest the extra deposit itself avoids.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Assuming the purchase price is the value', 'Lenders use their own valuation, which can be lower, pushing your real LTV up and the rate with it.'],
            ['Ignoring growth at remortgage', 'Price rises since you bought may have lowered your LTV into a cheaper band. Check before re-fixing.'],
            ['Over-stretching to a round number', 'Don&apos;t drain emergency savings to hit a band; keep a cash buffer for moving and surprises.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is a good LTV?', a: 'Lower is better for your rate. 60% or below gets the cheapest deals; 90 to 95% is available but at higher rates. Most buyers aim for at least 10 to 15% deposit (85 to 90% LTV).' },
            { q: 'Can I get a mortgage at 95% LTV?', a: 'Yes, 95% (5% deposit) mortgages exist, including under guarantee schemes, but rates are higher and the choice of lenders narrower.' },
            { q: 'Does overpaying change my LTV?', a: 'Yes, overpayments reduce the loan, lowering LTV. Combined with any rise in value, this can move you into a cheaper band at your next remortgage.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators">
          <RelatedTools items={PROPERTY_RELATED} />
        </GuideSection>
      </Guide>
    </CalcShell>
  );
}

export const PROPERTY_RELATED = [
  { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Monthly repayments' },
  { href: '/mortgage-affordability', label: 'Affordability', hint: 'How much can you borrow?' },
  { href: '/deposit-calculator', label: 'Deposit Calculator', hint: 'Save to your target' },
  { href: '/remortgage-calculator', label: 'Remortgage', hint: 'Should you switch?' },
  { href: '/stamp-duty-calculator', label: 'Stamp Duty', hint: 'Tax on your purchase' },
  { href: '/category/property', label: 'All Property Tools', hint: 'The full hub' },
];
