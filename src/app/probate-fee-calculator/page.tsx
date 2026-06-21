import type { Metadata } from 'next';
import ProbateFee from './ProbateFee';

export const metadata: Metadata = {
  title: 'Probate Fee Calculator UK 2025/26, Court & Solicitor Costs | UKDesk',
  description:
    'Free UK probate fee calculator for 2025/26. Estimate the £300 England & Wales court fee plus solicitor costs for grant-only or full estate administration.',
  alternates: { canonical: '/probate-fee-calculator' },
  openGraph: {
    title: 'Probate Fee Calculator UK 2025/26',
    description: 'Estimate probate costs, the £300 court fee plus any solicitor fees.',
    url: 'https://ukvisainfo.co.uk/probate-fee-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <ProbateFee />;
}
