import type { Metadata } from 'next';
import BusinessRates from './BusinessRates';

export const metadata: Metadata = {
  title: 'Business Rates Calculator UK 2025/26 — RV & Relief | UKDesk',
  description:
    'Free UK business rates calculator for 2025/26. Estimate your England bill from rateable value × multiplier (49.9p / 55.5p) with Small Business Rate Relief applied.',
  alternates: { canonical: '/business-rates-calculator' },
  openGraph: {
    title: 'Business Rates Calculator UK 2025/26',
    description: 'Rateable value × multiplier with Small Business Rate Relief — estimate your commercial property bill.',
    url: 'https://ukvisainfo.co.uk/business-rates-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <BusinessRates />;
}
