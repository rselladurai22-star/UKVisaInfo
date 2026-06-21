import type { Metadata } from 'next';
import RemortgageCalculator from './RemortgageCalculator';

export const metadata: Metadata = {
  title: 'Remortgage Calculator 2025/26, Saving, Fees & Break-even | UKDesk',
  description:
    'Free UK remortgage calculator. Compare your current mortgage with a new rate to see your monthly saving, how long it takes to recover the product fee and any ERC, and your net saving over the deal.',
  alternates: { canonical: '/remortgage-calculator' },
  openGraph: { title: 'Remortgage Calculator', description: 'Monthly saving, break-even and net saving when you switch.', url: 'https://ukvisainfo.co.uk/remortgage-calculator', type: 'article' },
};

export default function Page() {
  return <RemortgageCalculator />;
}
