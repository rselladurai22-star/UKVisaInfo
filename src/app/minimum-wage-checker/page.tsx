import type { Metadata } from 'next';
import MinimumWage from './MinimumWage';

export const metadata: Metadata = {
  title: 'Minimum Wage Checker UK 2025/26, NLW £12.21 | UKDesk',
  description:
    'Free UK minimum wage checker for the rates from 1 April 2025. Check the National Living Wage (£12.21), 18 to 20, under-18 and apprentice rates and any shortfall owed.',
  alternates: { canonical: '/minimum-wage-checker' },
  openGraph: {
    title: 'Minimum Wage Checker UK 2025/26',
    description: 'Check your pay against the April 2025 National Minimum and Living Wage rates.',
    url: 'https://ukvisainfo.co.uk/minimum-wage-checker',
    type: 'article',
  },
};

export default function Page() {
  return <MinimumWage />;
}
