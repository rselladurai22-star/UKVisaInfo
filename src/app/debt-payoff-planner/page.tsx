import type { Metadata } from 'next';
import DebtPayoffPlanner from './DebtPayoffPlanner';

export const metadata: Metadata = {
  title: 'Debt Payoff Planner 2025/26 — Snowball vs Avalanche | UKDesk',
  description:
    'Free UK debt payoff planner. Add your debts and a spare monthly amount to compare the snowball and avalanche methods — time to clear, total interest and payoff order — and build a plan to be debt-free.',
  alternates: { canonical: '/debt-payoff-planner' },
  openGraph: { title: 'Debt Payoff Planner — Snowball vs Avalanche', description: 'Compare debt payoff strategies and see how fast you could clear your debts.', url: 'https://ukvisainfo.co.uk/debt-payoff-planner', type: 'article' },
};

export default function Page() {
  return <DebtPayoffPlanner />;
}
