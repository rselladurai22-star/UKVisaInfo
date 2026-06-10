import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'UKDesk — UK Tools, Calculators & Visa Guides',
  description:
    'A single, trusted home for UK money, property and visa decisions. 50+ calculators verified against gov.uk, HMRC and ONS.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <HomeClient />;
}
