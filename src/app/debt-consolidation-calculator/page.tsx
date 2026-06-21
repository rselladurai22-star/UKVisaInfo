import type { Metadata } from 'next';
import DebtConsolidation from './DebtConsolidation';

export const metadata: Metadata = {
  title: 'Debt Consolidation Calculator 2025/26, Save or Cost More? | UKDesk',
  description:
    'Free UK debt consolidation calculator. Compare your current debts with a single consolidation loan, new monthly payment, total interest and payoff date, and see whether it really saves money.',
  alternates: { canonical: '/debt-consolidation-calculator' },
  openGraph: { title: 'Debt Consolidation Calculator', description: 'Compare current debts vs a consolidation loan on monthly cost and total interest.', url: 'https://ukvisainfo.co.uk/debt-consolidation-calculator', type: 'article' },
};

export default function Page() {
  return <DebtConsolidation />;
}
