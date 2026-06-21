import type { Metadata } from 'next';
import StatePension from './StatePension';

export const metadata: Metadata = {
  title: 'State Pension Calculator 2025/26, Forecast from NI Years | UKDesk',
  description:
    'Free UK State Pension forecast. Estimate your new State Pension from your National Insurance qualifying years, 35 years for the full £230.25/week, and see how to fill gaps and boost it.',
  alternates: { canonical: '/state-pension' },
  openGraph: { title: 'State Pension Forecast', description: 'Estimate your State Pension from your NI qualifying years.', url: 'https://ukvisainfo.co.uk/state-pension', type: 'article' },
};

export default function Page() {
  return <StatePension />;
}
