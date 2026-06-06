'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Slider, LineChart,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { PROPERTY_RELATED } from '../ltv-calculator/LtvCalculator';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const fmtYM = (m: number) => {
  const y = Math.floor(m / 12); const mm = m % 12;
  if (y <= 0) return `${mm}m`;
  if (mm === 0) return `${y}y`;
  return `${y}y ${mm}m`;
};

interface Sim { months: number; totalInterest: number; yearly: number[] }
function simulate(loan: number, i: number, payment: number, extra: number, lump: number, annualLump: number): Sim {
  let bal = Math.max(0, loan - lump);
  let totalInterest = 0; let m = 0; const yearly = [bal];
  while (bal > 0.005 && m < 12 * 60) {
    m++;
    const interestM = bal * i;
    let prin = payment - interestM + extra;
    if (annualLump > 0 && m % 12 === 0) prin += annualLump;
    if (prin <= 0) break;
    if (prin > bal) prin = bal;
    bal -= prin; totalInterest += interestM;
    if (m % 12 === 0 || bal <= 0.005) yearly.push(Math.max(0, bal));
  }
  return { months: m, totalInterest, yearly };
}

export default function OverpaymentCalculator() {
  const [balance, setBalance] = useState(220000);
  const [rate, setRate] = useState(4.6);
  const [term, setTerm] = useState(22);
  const [monthlyOver, setMonthlyOver] = useState(200);
  const [lump, setLump] = useState(0);
  const [annualLump, setAnnualLump] = useState(0);

  const r = useMemo(() => {
    const n = Math.max(1, Math.round(term * 12));
    const i = rate / 100 / 12;
    const payment = i === 0 ? balance / n : (balance * i) / (1 - Math.pow(1 + i, -n));
    const base = simulate(balance, i, payment, 0, 0, 0);
    const over = simulate(balance, i, payment, monthlyOver, lump, annualLump);
    const interestSaved = base.totalInterest - over.totalInterest;
    const monthsSaved = base.months - over.months;
    const labels = ['Now', ...base.yearly.slice(1).map((_, idx) => `Yr ${idx + 1}`)];
    const erc = balance * 0.1;
    const overpaidYr1 = monthlyOver * 12 + lump + annualLump;
    const end = new Date(); end.setMonth(end.getMonth() + over.months);
    return {
      payment, base, over, interestSaved, monthsSaved, labels, erc, overpaidYr1,
      endLabel: end.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      ercBreach: overpaidYr1 > erc,
    };
  }, [balance, rate, term, monthlyOver, lump, annualLump]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Property', href: '/category/property' }, { label: 'Overpayment Calculator' }]}
      title="Mortgage Overpayment Calculator"
      subtitle="See how much interest you'd save and how many years you'd shave off your mortgage by overpaying — monthly, as a lump sum, or both."
      inputs={
        <>
          <Panel title="Your mortgage">
            <div className="space-y-4">
              <Field label="Outstanding balance"><MoneyInput value={balance} onChange={setBalance} step={1000} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Rate — ${pct(rate, 2)}`}><Slider value={rate} onChange={setRate} min={0.5} max={10} step={0.05} /></Field>
                <Field label="Years left"><NumberInput value={term} onChange={setTerm} suffix="yrs" /></Field>
              </div>
            </div>
          </Panel>
          <Panel title="Your overpayments">
            <div className="space-y-4">
              <Field label="Monthly overpayment"><MoneyInput value={monthlyOver} onChange={setMonthlyOver} step={50} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="One-off lump (now)"><MoneyInput value={lump} onChange={setLump} step={500} /></Field>
                <Field label="Yearly lump"><MoneyInput value={annualLump} onChange={setAnnualLump} step={500} /></Field>
              </div>
            </div>
          </Panel>
        </>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Interest saved" value={gbp(r.interestSaved)} sub="over the term" tone="dark" big />
            <Stat label="Time saved" value={fmtYM(r.monthsSaved)} sub="off your mortgage" tone="accent" />
            <Stat label="Paid off" value={r.endLabel} sub={`vs ${fmtYM(r.base.months)} normally`} />
          </div>

          <Panel title="Balance: overpaying vs not">
            <LineChart height={210} labels={r.labels} format={(v) => gbp(v)}
              series={[
                { points: r.base.yearly, color: PRIMARY, label: 'Standard payments', payoffIndex: r.base.yearly.length - 1 },
                { points: r.over.yearly, color: ACCENT, label: 'With overpayments', dashed: true, payoffIndex: r.over.yearly.length - 1 },
              ]} />
            <div className="mt-3 p-3 rounded-lg bg-secondary-soft/30 border border-secondary/20 text-sm">
              Overpaying clears the mortgage in <strong className="text-secondary">{fmtYM(r.over.months)}</strong> instead of <strong>{fmtYM(r.base.months)}</strong> — saving <strong className="text-secondary">{gbp(r.interestSaved)}</strong> in interest.
            </div>
          </Panel>

          {r.ercBreach && (
            <Callout tone="warn" title="Check your overpayment allowance">
              You&apos;d overpay about {gbp(r.overpaidYr1)} this year, above a typical 10% annual allowance ({gbp(r.erc)}).
              On a fixed deal that can trigger an early repayment charge — confirm your lender&apos;s limit first.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Assumes overpayments reduce the term (payment unchanged) and the rate holds. Real savings depend on your lender&apos;s rules and future rates.</p>
        </>
      }
    >
      <Guide
        title="Should you overpay your mortgage?"
        intro="Overpaying is one of the most reliable ways to save money — but only if you understand the 10% rule, whether to cut the term or the payment, and how it stacks up against saving or investing instead."
      >
        <GuideSection kicker="The mechanics" title="Why overpaying saves so much">
          <p>Every pound you overpay comes straight off the balance, so it stops accruing interest for the entire remaining term. Because mortgage interest is front-loaded, overpayments made early are the most powerful — they remove capital that would otherwise have been charged interest for 20+ years. Even a modest monthly overpayment can knock years off the term and save tens of thousands in interest.</p>
        </GuideSection>
        <GuideSection kicker="Two ways" title="Regular overpayments vs lump sums">
          <p>Regular monthly overpayments are easy to budget and chip away steadily at the balance. Lump sums — a bonus, inheritance or savings — make an immediate dent and are especially effective early in the mortgage. Both work; the calculator lets you combine them. The earlier and larger the overpayment, the bigger the saving.</p>
        </GuideSection>
        <GuideSection kicker="The catch" title="The 10% rule and early repayment charges">
          <p>Most fixed and discounted deals let you overpay up to <strong>10% of the outstanding balance each year</strong> without penalty. Go beyond that during the fixed period and you may face an <strong>early repayment charge (ERC)</strong>, often 1–5% of the excess. Always check your annual allowance before making a large overpayment. Once you&apos;re on the standard variable rate, there&apos;s usually no ERC and you can overpay freely.</p>
          <Callout tone="warn" title="Confirm before a big lump sum">A £20,000 lump on a £150,000 balance exceeds a 10% (£15,000) allowance — the £5,000 over could attract a charge. Splitting it across two tax/anniversary years can avoid this.</Callout>
        </GuideSection>
        <GuideSection kicker="Choice" title="Reduce the term or the payment?">
          <p>By default, overpaying keeps your monthly payment the same and shortens the term — this saves the most interest. Some lenders instead let you keep the original term and lower the monthly payment, which helps cash flow but saves less. If your goal is to be mortgage-free sooner and minimise interest, choose to reduce the term.</p>
        </GuideSection>
        <GuideSection kicker="Alternatives" title="Overpay, save, or invest?">
          <p>Overpaying earns a guaranteed, tax-free return equal to your mortgage rate. Compare that to what you&apos;d earn elsewhere: if a savings account pays more than your mortgage rate after tax, saving may win; if you have higher-interest debt, clear that first; and pension contributions can beat overpaying for higher-rate taxpayers thanks to tax relief. An offset mortgage is another way to use savings to cut interest while keeping access to the cash.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Breaching the 10% allowance', 'Overpaying above your annual limit during a fix can cost more in ERC than the interest saved.'],
            ['Overpaying before clearing pricier debt', 'Credit cards and loans usually cost far more than a mortgage — clear them first.'],
            ['Leaving no emergency fund', 'Money overpaid is hard to get back. Keep 3–6 months of expenses accessible.'],
            ['Reducing the payment instead of the term', 'If your aim is to save interest, keep the payment and cut the term instead.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much can I overpay without penalty?', a: 'Usually up to 10% of the outstanding balance per year during a fixed or discounted deal. Above that you may face an early repayment charge. On the SVR there is typically no limit.' },
            { q: 'Does overpaying lower my monthly payment?', a: 'By default it shortens the term and keeps the payment the same, which saves the most interest. Some lenders let you instead reduce the monthly payment over the original term.' },
            { q: 'Is it better to overpay or invest?', a: 'Overpaying gives a guaranteed return equal to your mortgage rate. Investing might beat it but carries risk. Clearing higher-interest debt and pension contributions (for higher-rate taxpayers) often come first.' },
            { q: 'Can I get overpayments back?', a: 'Generally no — once overpaid, the money has reduced your balance. Some lenders offer "borrow back" or offset features; check before assuming you can access it again.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={PROPERTY_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
