import type { Metadata } from 'next';
import VisaJourneyClient from './VisaJourneyClient';

export const metadata: Metadata = {
  title: 'My UK Visa Journey — Track Your Application Step-by-Step',
  description: 'Save your visa choice, deadlines and document checklist progress in one place. All data stays in your browser — nothing is uploaded.',
  alternates: { canonical: '/my-journey' },
};

export default function MyJourneyPage() {
  return <VisaJourneyClient />;
}
