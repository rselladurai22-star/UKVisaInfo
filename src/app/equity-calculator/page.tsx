import type { Metadata } from 'next';
import EquityCalculator from './EquityCalculator';

export const metadata: Metadata = {
  title: 'Home Equity Calculator 2025/26 — How Much Do You Own? | UKDesk',
  description:
    'Free UK home equity calculator. Work out how much equity you hold in your property, your current LTV, and roughly how much you could release by remortgaging to a higher loan-to-value.',
  alternates: { canonical: '/equity-calculator' },
  openGraph: { title: 'Home Equity Calculator', description: 'Your equity, LTV and how much you could release.', url: 'https://ukvisainfo.co.uk/equity-calculator', type: 'article' },
};

export default function Page() {
  return <EquityCalculator />;
}
