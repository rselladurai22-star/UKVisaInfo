import type { Metadata } from 'next';
import TravelInsurance from './TravelInsurance';

export const metadata: Metadata = {
  title: 'Travel Insurance Calculator 2025/26 — Cost & Cover Limits | UKDesk',
  description:
    'Free UK travel insurance calculator. Estimate single-trip and annual multi-trip premiums by destination, length, travellers and age, and see the medical, cancellation and baggage cover limits to look for.',
  alternates: { canonical: '/travel-insurance-calculator' },
  openGraph: { title: 'Travel Insurance Calculator', description: 'Estimate travel insurance cost and the cover limits you need.', url: 'https://ukvisainfo.co.uk/travel-insurance-calculator', type: 'article' },
};

export default function Page() {
  return <TravelInsurance />;
}
