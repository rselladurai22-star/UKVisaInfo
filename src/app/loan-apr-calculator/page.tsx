import type { Metadata } from 'next';
import LoanApr from './LoanApr';

export const metadata: Metadata = {
  title: 'Loan APR Calculator 2025/26 — True Cost of Borrowing | UKDesk',
  description:
    'Free UK loan APR calculator. Work backwards from the monthly payment and any fees to the true APR and total cost of credit, so you can compare loans fairly. APR and representative-APR explained.',
  alternates: { canonical: '/loan-apr-calculator' },
  openGraph: { title: 'Loan APR Calculator', description: 'Find the true APR and cost of credit from your monthly payment and fees.', url: 'https://ukvisainfo.co.uk/loan-apr-calculator', type: 'article' },
};

export default function Page() {
  return <LoanApr />;
}
