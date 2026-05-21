import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SelfAssessmentClient from './SelfAssessmentClient';

export const metadata: Metadata = {
  title: 'Self Assessment Tax Calculator 2025/26 — Estimate Your January Bill',
  description: 'UK Self Assessment tax estimator 2025/26. Add employment, self-employed, property, dividend and savings income to estimate your January 31 balancing payment and payment on account.',
  alternates: { canonical: '/self-assessment-calculator' },
};

export default function SelfAssessmentPage() {
  return (
    <CalcPageShell
      url="/self-assessment-calculator"
      eyebrow="Self Assessment · UK · 2025/26"
      title="No surprises on 31 January. Estimate your SA bill now."
      deck="Mix employment, self-employed profit, rental income, dividends and savings interest — then subtract what PAYE has already collected. What&rsquo;s left is roughly what you owe (or get back) on 31 January."
      verified="gov.uk/self-assessment-tax-returns"
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Estimate the PAYE already deducted from your salary.' },
        { href: '/dividend-tax', title: 'Dividend tax', desc: 'Dive deeper into the dividend portion of your return.' },
        { href: '/rental-income-tax', title: 'Rental income tax', desc: 'Section 24 detailed view for landlords.' },
      ]}
      educational={[
        { title: 'Who needs Self Assessment?', body: 'You must file if you are self-employed (profit > £1,000), a company director, have income above £100,000, have untaxed income (e.g. rental, dividends above £500), or owe the High Income Child Benefit Charge.' },
        { title: 'Key deadlines', body: 'Register by 5 October after the tax year. File paper return by 31 October. File online by 31 January. Pay any balance by 31 January. First and second payments on account are due 31 January and 31 July.' },
        { title: 'Payment on account', body: 'HMRC requires you to prepay next year\'s tax in two instalments (31 Jan and 31 July), each at 50% of your current year\'s liability minus PAYE. This calculator shows the first payment on account due alongside the balancing payment.' },
        { title: 'Class 4 NI for the self-employed', body: '6% on self-employed profits between £12,570 and £50,270, and 2% above £50,270. Paid via Self Assessment alongside Income Tax. Class 2 NI (flat rate) was abolished from April 2024.' },
        { title: 'What this calculator does NOT cover', body: 'Capital gains tax, foreign income, pension lump sums, share scheme options, trust income. For these, use HMRC\'s SA calculator or consult an accountant.' },
      ]}
    >
      <SelfAssessmentClient />
    </CalcPageShell>
  );
}
