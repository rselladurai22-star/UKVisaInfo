import type { Metadata } from 'next';
import FinancialSettlement from './FinancialSettlement';

export const metadata: Metadata = {
  title: 'Divorce Settlement Calculator UK 2025/26 — Asset Split | UKDesk',
  description:
    'Free UK divorce financial settlement calculator. Get a rough starting-point estimate of how matrimonial assets — home, savings and pensions — might be split.',
  alternates: { canonical: '/financial-settlement-calculator' },
  openGraph: {
    title: 'Divorce Settlement Calculator UK 2025/26',
    description: 'Estimate how matrimonial assets might be divided on divorce — equality adjusted for needs.',
    url: 'https://ukvisainfo.co.uk/financial-settlement-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <FinancialSettlement />;
}
