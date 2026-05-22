'use client';

import { useMemo, useState } from 'react';
import { calculateSelfAssessment } from '../../lib/self-assessment/calc';
import {
  CalcCard, NumberField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, Tip, fmtGBP,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function SelfAssessmentClient() {
  const [employment, setEmployment] = useState('45000');
  const [seProfit, setSeProfit]     = useState('15000');
  const [property, setProperty]     = useState('0');
  const [dividends, setDividends]   = useState('2000');
  const [savings, setSavings]       = useState('500');
  const [paye, setPaye]             = useState('6486');

  const r = useMemo(() => calculateSelfAssessment({
    employmentIncome: parseFloat(employment) || 0,
    selfEmployedProfit: parseFloat(seProfit) || 0,
    propertyIncome: parseFloat(property) || 0,
    dividends: parseFloat(dividends) || 0,
    savingsInterest: parseFloat(savings) || 0,
    payeAlreadyPaid: parseFloat(paye) || 0,
  }), [employment, seProfit, property, dividends, savings, paye]);

  const dueBy31Jan = Math.max(0, r.balancingPayment) + r.firstPaymentOnAccount;
  const refund = r.balancingPayment < 0 ? Math.abs(r.balancingPayment) : 0;

  return (
    <CalcCard wide>
      <SummaryHero
        label={refund > 0 ? 'Estimated refund' : 'Estimated bill due 31 January 2027'}
        value={fmtGBP(refund > 0 ? refund : dueBy31Jan)}
        sub={refund > 0
          ? 'You appear to have overpaid via PAYE — HMRC will refund the difference.'
          : `Balancing payment ${fmtGBP(Math.max(0, r.balancingPayment))} + first POA ${fmtGBP(r.firstPaymentOnAccount)}`}
        tone={refund > 0 ? 'teal' : 'navy'}
        badge="2025/26"
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Income sources" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Employment income (gross)" prefix="£" value={employment} onChange={setEmployment} hint="P60 box 1 / total salary" />
            <NumberField label="Self-employment profit" prefix="£" value={seProfit} onChange={setSeProfit} hint="After allowable business expenses" />
            <NumberField label="Property income (net)" prefix="£" value={property} onChange={setProperty} hint="Rental profit after allowable costs" />
            <NumberField label="Dividends" prefix="£" value={dividends} onChange={setDividends} hint="£500 dividend allowance applies" />
            <NumberField label="Savings interest" prefix="£" value={savings} onChange={setSavings} hint="PSA: £1,000 basic / £500 higher / £0 add" />
            <NumberField label="PAYE already paid" prefix="£" value={paye} onChange={setPaye} hint="P60 box 2 — tax already deducted" />
          </div>
        </Section>

        <Section title="Tax liability summary" eyebrow="Step 2" tone="results">
          <StatGrid cols={2}>
            <StatCard label="Total income" value={fmtGBP(r.totalIncome)} sub={`Personal Allowance: ${fmtGBP(r.personalAllowance)}`} />
            <StatCard label="Income tax" value={fmtGBP(r.incomeTax)} tone="muted" />
            <StatCard label="Class 4 NI" value={fmtGBP(r.class4Ni)} sub="Self-employed contributions" tone="muted" />
            <StatCard label="Total liability" value={fmtGBP(r.totalTaxLiability)} tone="primary" />
          </StatGrid>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="January &amp; July payment schedule" eyebrow="Step 3" accent="#C9A14A">
          <BreakdownTable
            rows={[
              { label: 'Total tax liability 2025/26', value: fmtGBP(r.totalTaxLiability), bold: true },
              { label: 'Less PAYE already paid', value: `–${fmtGBP(r.payeAlreadyPaid)}`, negative: true },
              { label: 'Balancing payment 2025/26', value: fmtGBP(Math.max(0, r.balancingPayment)), bold: true, sub: 'Due 31 January 2027' },
              { label: 'First payment on account 2026/27', value: fmtGBP(r.firstPaymentOnAccount), sub: '50% of last year — due 31 January 2027' },
              { label: 'Second payment on account 2026/27', value: fmtGBP(r.firstPaymentOnAccount), sub: 'Due 31 July 2027' },
            ]}
          />
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <StatCard label="Due 31 January 2027" value={fmtGBP(dueBy31Jan)} tone="primary" sub="Balancing + first POA" />
            <StatCard label="Due 31 July 2027" value={fmtGBP(r.firstPaymentOnAccount)} tone="muted" sub="Second POA on account" />
          </div>
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        {r.firstPaymentOnAccount === 0 && r.balancingPayment > 0 && r.balancingPayment < 1000 && (
          <Tip tone="success">
            Your balancing payment is under £1,000 — <strong>no Payments on Account</strong> are required.
          </Tip>
        )}
        {refund > 0 && (
          <Tip tone="success">
            You appear to have <strong>overpaid via PAYE</strong>. HMRC will repay this automatically once your return is processed — typically within 5 working days for online filings.
          </Tip>
        )}
        {r.totalIncome > 100000 && r.personalAllowance < 12570 && (
          <Tip tone="warn">
            Total income above £100,000 — your <strong>Personal Allowance is tapered</strong> (£1 lost for every £2 above). At £125,140 it&rsquo;s nil — an effective 60% marginal rate.
          </Tip>
        )}
        {parseFloat(seProfit) > 0 && (
          <Tip tone="info">
            <strong>Class 2 NI is no longer required</strong> for 2025/26 — only Class 4 (8%/2% on profits above £12,570) applies for self-employed earners.
          </Tip>
        )}
        <Tip tone="info">
          Filing deadlines: paper return <strong>31 October 2026</strong> · online <strong>31 January 2027</strong>. Late filing is an automatic £100 penalty.
        </Tip>
      </div>
    </CalcCard>
  );
}
