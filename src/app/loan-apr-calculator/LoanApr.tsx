'use client';

import { useMemo, useState } from 'react';
import {
  gbp, pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Donut, BarTrack,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { LOANS_RELATED } from '../personal-loan-calculator/PersonalLoan';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

function solveApr(net: number, payment: number, n: number) {
  if (payment * n <= net) return 0;
  let lo = 1e-7, hi = 1;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    const pv = (payment * (1 - Math.pow(1 + mid, -n))) / mid;
    if (pv > net) lo = mid; else hi = mid;
  }
  const i = (lo + hi) / 2;
  return (Math.pow(1 + i, 12) - 1) * 100;
}

export default function LoanApr() {
  const [amount, setAmount] = useState(10000);
  const [payment, setPayment] = useState(220);
  const [years, setYears] = useState(5);
  const [fee, setFee] = useState(0);

  const r = useMemo(() => {
    const n = Math.max(1, Math.round(years * 12));
    const net = amount - fee;
    const apr = solveApr(net, payment, n);
    const totalRepaid = payment * n;
    const costOfCredit = totalRepaid + fee - amount;
    return { n, apr, totalRepaid, costOfCredit };
  }, [amount, payment, years, fee]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Loans', href: '/category/loans' }, { label: 'Loan APR' }]}
      title="Loan APR Calculator"
      subtitle="Work backwards from the monthly payment to the true APR, including any fees, so you can compare loans fairly. APR is the only figure that captures the real cost of borrowing."
      calcLabel="Calculate APR"
      inputs={
        <Panel title="Loan details">
          <div className="space-y-4">
            <Field label="Amount borrowed"><MoneyInput value={amount} onChange={setAmount} step={500} /></Field>
            <Field label="Monthly payment"><MoneyInput value={payment} onChange={setPayment} step={5} /></Field>
            <Field label="Term (years)"><NumberInput value={years} onChange={setYears} suffix="yrs" /></Field>
            <Field label="Arrangement / product fee" hint="Compulsory fees raise the true APR"><MoneyInput value={fee} onChange={setFee} step={50} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="True APR" value={pct(r.apr, 1)} sub="incl. fees" tone="dark" big />
            <Stat label="Cost of credit" value={gbp(r.costOfCredit)} sub="interest + fees" tone="accent" />
            <Stat label="Total repaid" value={gbp(r.totalRepaid)} sub={`${r.n} payments`} />
          </div>
          <Panel title="Borrowed vs cost of credit">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Total cost" centerValue={gbp(amount + r.costOfCredit)} segments={[
                { value: amount, color: PRIMARY, label: 'Amount borrowed' },
                { value: r.costOfCredit, color: ACCENT, label: 'Interest + fees' },
              ]} />
              <div className="flex-1 space-y-3 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Amount borrowed</span><span className="font-semibold tabular-nums">{gbp(amount)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Interest + fees</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.costOfCredit)}</span></div>
                <BarTrack segments={[{ value: amount, color: PRIMARY }, { value: r.costOfCredit, color: ACCENT }]} />
              </div>
            </div>
          </Panel>
          <Callout tone="info" title="Why APR beats the headline rate">
            APR bundles the interest rate and compulsory fees into one annualised figure, so two loans can be
            compared on a like-for-like basis. A loan with a low rate but a big fee can have a higher APR than one
            with a slightly higher rate and no fee.
          </Callout>
        </>
      }
    >
      <Guide
        title="APR and the true cost of borrowing"
        intro="APR is the single most useful number for comparing loans, but it's widely misunderstood. This guide explains what APR includes, how representative APR works, and how to use it to find the cheapest deal."
      >
        <GuideSection kicker="Definition" title="What APR actually measures">
          <p>The <strong>Annual Percentage Rate</strong> expresses the total cost of a loan, the interest <em>plus</em> any compulsory fees, as a yearly percentage of the amount borrowed. Because it standardises everything into one figure, APR lets you compare loans with different rates, fees and terms on a like-for-like basis. By law, lenders must show the APR, which is why it&apos;s the figure to focus on rather than the headline interest rate alone.</p>
        </GuideSection>
        <GuideSection kicker="The catch" title="Representative APR vs your APR">
          <p>Advertised rates are usually a <strong>representative APR</strong>, which only has to be offered to <strong>51% of accepted applicants</strong>. The other 49% can be charged more based on their credit profile. So the rate you actually get may be higher than advertised. Use lenders&apos; soft-search eligibility checkers to see your personalised APR without harming your credit score.</p>
        </GuideSection>
        <GuideSection kicker="Fees" title="How fees inflate the real cost">
          <p>A loan with a low interest rate but a large arrangement fee can cost more than one with a slightly higher rate and no fee, and the APR captures this. The calculator above works backwards from your monthly payment and any fee to reveal the true APR, so you can see past marketing to the genuine cost of credit.</p>
          <Callout tone="tip" title="Compare total cost too">On short loans, even APR can understate the impact of a fixed fee. Also compare the total amount repayable across the whole term, the simplest measure of which loan is cheapest.</Callout>
        </GuideSection>
        <GuideSection kicker="Watch out" title="APR vs flat rate vs monthly rate">
          <p>Beware quotes given as a <strong>&quot;flat rate&quot;</strong>, common in some car and point-of-sale finance. A flat rate charges interest on the original amount for the whole term, ignoring that you&apos;re paying it down, so the true APR is often roughly <strong>double</strong> the flat rate. Always insist on the APR. Credit cards quote a monthly rate too; multiply with care, as APR compounds.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Comparing interest rates, not APRs', 'Only APR includes compulsory fees. Two "5%" loans can cost very differently.'],
            ['Assuming you&apos;ll get the advertised rate', 'Representative APR goes to just 51% of applicants. Check your personalised rate.'],
            ['Falling for a flat rate', 'A flat rate hides a much higher true APR, often about double. Ask for the APR.'],
            ['Ignoring the total repayable', 'The clearest measure of cost is the total amount you&apos;ll pay back over the term.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What does APR include?', a: 'The interest rate plus any compulsory fees, expressed as an annual percentage. It is designed to let you compare the true cost of different loans.' },
            { q: 'Why is the APR higher than the interest rate?', a: 'Because APR adds in compulsory fees and compounds over the year. If there are no fees and simple interest, they are close; fees push the APR above the headline rate.' },
            { q: 'What is representative APR?', a: 'The advertised rate that at least 51% of accepted applicants receive. Your personalised APR depends on your credit profile and can be higher.' },
            { q: 'Is a lower APR always better?', a: 'Usually, for the same term, but always check the total amount repayable too, especially when comparing different term lengths.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={LOANS_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
