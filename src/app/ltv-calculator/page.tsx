import type { Metadata } from 'next';
import LtvCalculator from './LtvCalculator';

export const metadata: Metadata = {
  title: 'LTV Calculator 2025/26, Loan-to-Value & Equity | UKDesk',
  description:
    'Free UK loan-to-value (LTV) calculator. Work out your LTV and equity from your property value and deposit, see which rate band you fall in, and how much extra deposit reaches the next cheaper band.',
  alternates: { canonical: '/ltv-calculator' },
  openGraph: { title: 'LTV Calculator, Loan-to-Value & Equity', description: 'Work out your LTV, equity and rate band.', url: 'https://ukvisainfo.co.uk/ltv-calculator', type: 'article' },
};

export default function Page() {
  return <LtvCalculator />;
}
