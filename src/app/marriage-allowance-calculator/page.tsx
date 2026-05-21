import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MarriageAllowanceClient from './MarriageAllowanceClient';

export const metadata: Metadata = {
  title: 'Marriage Allowance Calculator 2025/26 — £252 Saving + 4-Year Backdate',
  description: 'Free UK Marriage Allowance calculator. Transfer £1,260 of Personal Allowance to your partner and save £252 in Income Tax. Backdate up to 4 years for up to £1,260 total.',
  alternates: { canonical: '/marriage-allowance-calculator' },
};

export default function MarriageAllowancePage() {
  return (
    <CalcPageShell
      url="/marriage-allowance-calculator"
      eyebrow="Marriage Allowance · UK · 2025/26"
      title="Is the £252 Marriage Allowance worth claiming?"
      deck="If one of you earns below £12,570 and the other pays basic-rate tax, you can transfer £1,260 of Personal Allowance — and backdate up to four years for a one-off windfall."
      verified="gov.uk/marriage-allowance"
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See both partners&rsquo; full net salaries.' },
        { href: '/self-assessment-calculator', title: 'Self Assessment estimator', desc: 'Check how backdated claims affect your SA bill.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice', desc: 'Reducing income below £12,570 to qualify.' },
      ]}
      educational={[
        { title: 'What is Marriage Allowance?', body: 'It lets a lower-earning partner (income below £12,570) transfer £1,260 of their Personal Allowance to the higher earner. This reduces the higher earner\'s tax bill by £252 per year (£1,260 × 20%).' },
        { title: 'Who qualifies?', body: 'You must be married or in a civil partnership. The lower earner\'s income must be below the Personal Allowance (£12,570). The higher earner must pay only basic-rate Income Tax (income between £12,570 and £50,270).' },
        { title: 'Backdating', body: 'You can claim for up to 4 prior tax years if you qualified in those years. Each year saves £252 — so a full 4-year backdate plus the current year = £1,260.' },
        { title: 'How to apply', body: 'Apply via HMRC\'s online service at gov.uk/marriage-allowance. Once accepted, HMRC adjusts the higher earner\'s tax code. You do not need Self Assessment.' },
        { title: 'Transferring back', body: 'You can cancel the transfer if your circumstances change (e.g. the lower earner gets a pay rise above £12,570). Apply at the start of the next tax year.' },
      ]}
    >
      <MarriageAllowanceClient />
    </CalcPageShell>
  );
}
