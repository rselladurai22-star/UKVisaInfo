import type { Metadata } from 'next';
import UniversalCredit from './UniversalCredit';

export const metadata: Metadata = {
  title: 'Universal Credit Calculator UK 2025/26 — Monthly Award | UKDesk',
  description:
    'Free UK Universal Credit calculator for 2025/26. Estimate your monthly award from standard allowance, child, housing and disability elements, less the 55% earnings taper.',
  alternates: { canonical: '/universal-credit-calculator' },
  openGraph: {
    title: 'Universal Credit Calculator UK 2025/26',
    description: 'Estimate your monthly Universal Credit award for 2025/26.',
    url: 'https://ukvisainfo.co.uk/universal-credit-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <UniversalCredit />;
}
