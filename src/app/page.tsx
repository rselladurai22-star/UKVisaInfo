import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'UKDesk — Free UK Calculators & Tax Estimators',
  description:
    'A single, trusted home for UK money, tax, and property decisions. 40+ calculators verified against gov.uk, HMRC and ONS.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <HomeClient />;
}
