import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import LifetimeIsaClient from './LifetimeIsaClient';

export const metadata: Metadata = {
  title: 'Lifetime ISA Calculator 2025/26 — 25% Bonus, First Home £450k, Retirement 60+',
  description: 'UK Lifetime ISA calculator. 25% government bonus (max £1,000/year) on up to £4,000 contributions. Project LISA growth for first home purchase or retirement from age 60. Shows penalty for other withdrawals.',
  alternates: { canonical: '/lifetime-isa-calculator' },
};

export default function LifetimeIsaPage() {
  return (
    <CalcPageShell
      url="/lifetime-isa-calculator"
      eyebrow="Lifetime ISA · UK · 2025/26"
      title="The government adds 25% to your savings. Are you using it?"
      deck="Up to £1,000 free money per year from HMRC — for your first home (up to £450,000) or retirement from 60. Open before you turn 40. See how the bonus compounds over time."
      verified="gov.uk/lifetime-isa"
      related={[
        { href: '/isa-calculator', title: 'ISA calculator', desc: 'Full ISA allowance and compound growth projection.' },
        { href: '/pension-drawdown-calculator', title: 'Pension drawdown', desc: 'Compare LISA retirement vs pension drawdown.' },
        { href: '/overpayment-mortgage', title: 'Mortgage overpayment', desc: 'Compare LISA first-home savings vs overpaying mortgage.' },
      ]}
      educational={[
        { title: 'LISA basics', body: 'Open a LISA between ages 18 and 39. Contribute up to £4,000 per year. HMRC adds a 25% bonus (up to £1,000/year). Accessible without penalty for: first home purchase (≤ £450,000) after 12 months of opening, or from age 60 for retirement.' },
        { title: 'The penalty for other withdrawals', body: 'Withdrawing for any other reason incurs a 25% penalty on the TOTAL withdrawal (not just the bonus). On a £4,000 contribution + £1,000 bonus = £5,000 total, a 25% penalty = £1,250 — so you actually lose £250 of your own money too.' },
        { title: 'LISA vs pension', body: 'For higher-rate taxpayers, pensions win (40% relief vs 25% bonus). For basic-rate taxpayers, it is more nuanced — pensions also attract employer contributions via salary sacrifice. LISA is often better for first-home purchase regardless of tax band.' },
        { title: 'Contributions stop at 50', body: 'You can continue to hold and grow a LISA after age 50, but no new contributions (and therefore no bonus) are allowed after your 50th birthday. The account remains open and can still be accessed penalty-free from age 60.' },
        { title: 'First home rules', body: 'The property must cost £450,000 or less. You must be a first-time buyer. The LISA must have been open for at least 12 months before you use it. It is used alongside a mortgage (you cannot use it to buy cash). Both partners in a couple can each use their own LISA on the same property.' },
      ]}
    >
      <LifetimeIsaClient />
    </CalcPageShell>
  );
}
