import type { Metadata } from 'next';
import PersonalLoan from './PersonalLoan';

export const metadata: Metadata = {
  title: 'Personal Loan Calculator 2025/26, Repayments & Interest | UKDesk',
  description:
    'Free UK personal loan calculator. Enter the amount, APR and term to see your monthly repayment, total interest and total cost, with a clear breakdown and money-saving guidance.',
  alternates: { canonical: '/personal-loan-calculator' },
  openGraph: { title: 'Personal Loan Calculator', description: 'Monthly repayment, total interest and cost of a UK personal loan.', url: 'https://ukvisainfo.co.uk/personal-loan-calculator', type: 'article' },
};

export default function Page() {
  return <PersonalLoan />;
}
