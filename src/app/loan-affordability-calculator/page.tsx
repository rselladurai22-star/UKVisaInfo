import type { Metadata } from 'next';
import LoanAffordability from './LoanAffordability';

export const metadata: Metadata = {
  title: 'Loan Affordability Calculator UK 2025/26, DTI Based | UKDesk',
  description:
    'Free UK loan affordability calculator. Work out how much you could responsibly borrow from your debt-to-income ratio, existing commitments and loan terms.',
  alternates: { canonical: '/loan-affordability-calculator' },
  openGraph: {
    title: 'Loan Affordability Calculator UK 2025/26',
    description: 'How much can you borrow? A debt-to-income based affordability estimate.',
    url: 'https://ukvisainfo.co.uk/loan-affordability-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <LoanAffordability />;
}
