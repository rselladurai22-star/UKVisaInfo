import type { Metadata } from 'next';
import LoanComparison from './LoanComparison';

export const metadata: Metadata = {
  title: 'Loan Comparison Calculator UK 2025/26, Compare 3 Loans | UKDesk',
  description:
    'Free UK loan comparison calculator. Compare up to three personal loans side by side on monthly repayment, total interest and total cost to find the cheapest.',
  alternates: { canonical: '/loan-comparison-calculator' },
  openGraph: {
    title: 'Loan Comparison Calculator UK 2025/26',
    description: 'Compare up to three loans on monthly payment, total interest and total cost.',
    url: 'https://ukvisainfo.co.uk/loan-comparison-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <LoanComparison />;
}
