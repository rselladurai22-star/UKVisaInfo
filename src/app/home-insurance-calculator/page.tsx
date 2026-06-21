import type { Metadata } from 'next';
import HomeInsurance from './HomeInsurance';

export const metadata: Metadata = {
  title: 'Home Insurance & Rebuild Cost Calculator 2025/26 | UKDesk',
  description:
    'Free UK home insurance calculator. Estimate your buildings rebuild cost (sum insured, not market value) and contents value by floor area, region and bedrooms, and avoid under-insurance penalties.',
  alternates: { canonical: '/home-insurance-calculator' },
  openGraph: { title: 'Home Insurance & Rebuild Cost Calculator', description: 'Estimate buildings rebuild cost and contents value to insure correctly.', url: 'https://ukvisainfo.co.uk/home-insurance-calculator', type: 'article' },
};

export default function Page() {
  return <HomeInsurance />;
}
