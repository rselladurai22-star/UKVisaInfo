import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SalarySacrificeClient from './SalarySacrificeClient';

export const metadata: Metadata = {
  title: 'Salary Sacrifice Calculator 2025/26 — Pension, Tax & NI Savings',
  description: 'UK salary sacrifice calculator 2025/26. See Income Tax and National Insurance savings for you and your employer. Compare salary sacrifice vs relief-at-source pension contributions.',
  alternates: { canonical: '/salary-sacrifice-calculator' },
};

export default function SalarySacrificePage() {
  return (
    <CalcPageShell
      url="/salary-sacrifice-calculator"
      eyebrow="Salary Sacrifice · UK · 2025/26"
      title="Salary sacrifice saves NI too — not just Income Tax"
      deck="Unlike relief-at-source pension contributions, salary sacrifice reduces your gross salary — saving both Income Tax AND National Insurance contributions for you, and NI for your employer. Many employers share their employer NI saving back."
      verified="gov.uk/salary-sacrifice-arrangements"
      sidebar={{
        keyRates: [
          { label: 'Annual Allowance', value: '£60,000', sub: '2025/26 — pension contributions cap' },
          { label: 'Employee NI (basic)', value: '8%', sub: '£12,570 – £50,270 earnings', accent: '#0F766E' },
          { label: 'Employee NI (higher)', value: '2%', sub: 'Earnings above £50,270', accent: '#0F766E' },
          { label: 'Employer NI rate', value: '15%', sub: 'On earnings above £5,000 (2025/26)' },
          { label: 'Employer NI threshold', value: '£5,000', sub: 'Down from £9,100 in 2024/25' },
          { label: 'Personal Allowance', value: '£12,570', sub: 'Tapers if income >£100k' },
        ],
        dates: [
          { date: '5 Apr', desc: 'End of 2025/26 tax year — use Annual Allowance or lose it', urgent: true },
          { date: '5 Apr', desc: 'Carry-forward opportunity: use last 3 years\' unused AA', urgent: false },
          { date: '6 Apr', desc: 'New tax year — NI thresholds reset', urgent: false },
        ],
        tips: [
          { heading: 'Employer NI sharing', body: 'Some employers pass their 15% NI saving back to you as an extra pension contribution. Always ask — it can be worth £300–£1,000+ per year.' },
          { heading: 'Protect your Annual Allowance', body: 'Total contributions (yours + employer\'s) must not exceed £60,000 or 100% of earnings. Input your employer contribution to avoid an AA charge.' },
          { heading: 'Keeps benefits intact', body: 'Unlike RAS, salary sacrifice reduces contractual salary — check this does not affect mortgage affordability evidence, life cover multiples, or enhanced redundancy calculations.' },
        ],
        govLink: 'gov.uk/salary-sacrifice-arrangements',
        govLabel: 'gov.uk — Salary sacrifice',
      }}
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See your net pay after sacrifice.' },
        { href: '/self-assessment-calculator', title: 'Self Assessment', desc: 'Check if SA is needed after sacrifice.' },
        { href: '/child-benefit-calculator', title: 'Child Benefit HICBC', desc: 'Sacrifice to drop below £60k HICBC threshold.' },
      ]}
      educational={[
        { title: 'Salary sacrifice vs relief at source', body: 'Relief-at-source (RAS) pensions add back basic-rate tax at the scheme level — you claim higher-rate relief via SA. Salary sacrifice reduces gross pay before tax and NI, so NI savings are automatic — no SA needed for that relief.' },
        { title: 'What counts toward Annual Allowance?', body: 'Defined contribution: all money going into the pot (your contributions + employer). Defined benefit: the "annual input" = (pension at year-end × 16) − (pension at year-start × 16) + lump sum changes. Carry-forward lets you use unused AA from the 3 previous years if you were a scheme member.' },
        { title: 'Tapered Annual Allowance', body: 'If your adjusted income (salary + employer pension) exceeds £260,000, the AA tapers down by £1 for every £2 above, to a minimum of £10,000. This is the "high earner" trap.' },
        { title: 'Contractual vs non-contractual sacrifice', body: 'Some schemes operate via a formal contractual salary amendment — these are more tax-efficient but harder to reverse. Non-contractual schemes are simpler. Check with HR which applies to you.' },
        { title: 'Other benefits that can be sacrificed', body: 'The same NI-saving logic applies to electric car schemes, cycle to work, and additional holiday purchase — all reduce gross salary before NI is calculated.' },
      ]}
    >
      <SalarySacrificeClient />
    </CalcPageShell>
  );
}
