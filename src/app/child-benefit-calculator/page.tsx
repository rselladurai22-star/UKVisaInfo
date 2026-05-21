import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import ChildBenefitClient from './ChildBenefitClient';

export const metadata: Metadata = {
  title: 'Child Benefit Calculator 2025/26 — HICBC Taper £60k–£80k',
  description: 'UK Child Benefit calculator 2025/26. See £25.60/wk for eldest child, £16.95 for each additional child. Instantly calculates the High Income Child Benefit Charge taper between £60,000 and £80,000.',
  alternates: { canonical: '/child-benefit-calculator' },
};

export default function ChildBenefitPage() {
  return (
    <CalcPageShell
      url="/child-benefit-calculator"
      eyebrow="Child Benefit · UK · 2025/26 HMRC rates"
      title="How much Child Benefit will you keep?"
      deck="£25.60 a week for your first child. But earn over £60,000 and HMRC claws it back — 1% per £200 above the threshold until nothing remains at £80,000."
      verified="gov.uk/child-benefit/what-youll-get"
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See your full net salary before and after the charge.' },
        { href: '/self-assessment-calculator', title: 'Self Assessment estimator', desc: 'HICBC is paid via Self Assessment — estimate your January bill.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice', desc: 'Sacrificing into pension reduces adjusted net income below £60k.' },
      ]}
      educational={[
        { title: 'Current rates (2025/26)', body: '£25.60/week for the eldest or only child (£1,331.20/year). £16.95/week for each additional child (£881.40/year). Paid by HMRC every 4 weeks.' },
        { title: 'High Income Child Benefit Charge', body: 'If the higher earner in your household has an adjusted net income above £60,000, HMRC reclaims 1% of the Child Benefit for every £200 over the threshold. At £80,000 the entire benefit is clawed back.' },
        { title: 'Adjusted net income', body: 'Adjusted net income = gross income minus pension contributions, Gift Aid, trading losses. Making pension contributions or salary sacrifice payments can reduce income below the thresholds.' },
        { title: 'Should you still claim?', body: 'Yes — even if you expect to pay it all back via HICBC, claiming builds National Insurance credits (protecting your State Pension) and registers children for a National Insurance number automatically at 16.' },
        { title: 'How to pay the charge', body: 'Register for Self Assessment and file a tax return. You can also opt out of receiving payments to avoid the annual return, but you lose the NI credits — usually not advisable.' },
      ]}
    >
      <ChildBenefitClient />
    </CalcPageShell>
  );
}
