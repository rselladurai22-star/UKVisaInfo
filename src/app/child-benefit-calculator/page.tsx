import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import ChildBenefitClient from './ChildBenefitClient';

export const metadata: Metadata = {
  title: 'Child Benefit Calculator 2025/26 — HICBC Taper & Net Amount',
  description: 'Free UK Child Benefit calculator for 2025/26. Calculate your weekly/annual entitlement, see the HICBC taper clawback, and estimate your adjusted net income to decide whether to opt out.',
  alternates: { canonical: '/child-benefit-calculator' },
};

export default function ChildBenefitPage() {
  return (
    <CalcPageShell
      url="/child-benefit-calculator"
      eyebrow="Child Benefit · UK · 2025/26"
      title="How much Child Benefit are you really keeping after HICBC?"
      deck="Child Benefit pays £25.60/week for the eldest child and £16.95 for each additional child — but if either parent earns over £60,000 the High Income Charge claws it back pound-for-pound by £80,000."
      verified="gov.uk/child-benefit"
      sidebar={{
        keyRates: [
          { label: 'First / only child', value: '£25.60/wk', sub: '£1,331.20 / year', accent: '#0F766E' },
          { label: 'Each additional child', value: '£16.95/wk', sub: '£881.40 / year', accent: '#0F766E' },
          { label: 'HICBC starts', value: '£60,000', sub: 'Adjusted net income' },
          { label: 'Full clawback at', value: '£80,000', sub: '1% per £200 above £60k' },
          { label: 'Taper window', value: '£20,000', sub: 'From £60k → £80k' },
        ],
        dates: [
          { date: '5 Oct', desc: 'Register for Self Assessment if HICBC applies to you', urgent: false },
          { date: '31 Jan', desc: 'Pay HICBC via Self Assessment (same deadline as SA)', urgent: true },
          { date: '5 Apr', desc: 'End of 2025/26 tax year — freeze entitlement', urgent: false },
        ],
        tips: [
          { heading: 'Pension contributions reduce HICBC', body: 'Salary sacrifice or personal pension contributions reduce your adjusted net income — potentially dropping it below £60k and eliminating the charge entirely.' },
          { heading: 'Always register, even if opting out', body: 'Claiming and opting out preserves entitlement. It also builds NI credits if you have no other NI contributions — worth £££ toward your State Pension.' },
        ],
        govLink: 'gov.uk/child-benefit',
        govLabel: 'gov.uk — Child Benefit',
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Confirm your adjusted net income.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice', desc: 'Reduce income below £60k to avoid HICBC.' },
        { href: '/self-assessment-calculator', title: 'Self Assessment', desc: 'Declare and pay HICBC via SA return.' },
      ]}
      educational={[
        { title: 'Who can claim?', body: 'You can claim for children under 16 (or under 20 if in approved education or training). Either parent in a couple can claim — HMRC assigns the charge to whichever has the higher income.' },
        { title: 'Adjusted Net Income', body: 'ANI is not your P60 salary. It is your gross income minus pension contributions, Gift Aid donations, and trading losses. Salary sacrifice into a pension is the most common way to bring ANI below the £60,000 threshold.' },
        { title: 'HICBC mechanics', body: 'The charge is 1% of benefit received for every £200 of income above £60,000. At £80,000 the charge equals 100% of the benefit. Above £80,000 the charge still equals 100% — it does not exceed the benefit.' },
        { title: 'Opt-out vs paying charge', body: 'If you will pay back 100% (income above £80k), opt out to avoid admin. If between £60k–£80k, keeping the benefit and paying a partial charge is usually still worth it financially — you receive some net benefit.' },
        { title: 'NI credits', body: 'Claiming Child Benefit (even if opting out of payment) automatically awards National Insurance credits for any week you do not have another NI contribution. This can be extremely valuable for anyone not working.' },
      ]}
    >
      <ChildBenefitClient />
    </CalcPageShell>
  );
}
