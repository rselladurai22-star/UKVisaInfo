import type { Metadata } from 'next';
import EarlyRepayment from './EarlyRepayment';

export const metadata: Metadata = {
  title: 'Loan Early Repayment Calculator UK 2025/26 — Interest Saved | UKDesk',
  description:
    'Free UK loan early repayment calculator. See the interest you save by settling a loan early or making a lump-sum overpayment, including the early settlement figure.',
  alternates: { canonical: '/loan-early-repayment-calculator' },
  openGraph: {
    title: 'Loan Early Repayment Calculator UK 2025/26',
    description: 'Interest saved by settling early or overpaying, with the 58-day settlement rule.',
    url: 'https://ukvisainfo.co.uk/loan-early-repayment-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <EarlyRepayment />;
}
