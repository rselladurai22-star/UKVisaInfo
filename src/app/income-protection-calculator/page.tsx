import type { Metadata } from 'next';
import IncomeProtection from './IncomeProtection';

export const metadata: Metadata = {
  title: 'Income Protection Calculator 2025/26, Insure Your Salary | UKDesk',
  description:
    'Free UK income protection calculator. See the monthly benefit you’d need if illness or injury stopped your pay, the gap left by Statutory Sick Pay, and a rough premium by deferred period and age.',
  alternates: { canonical: '/income-protection-calculator' },
  openGraph: { title: 'Income Protection Calculator', description: 'Size the income protection benefit you need and estimate the premium.', url: 'https://ukvisainfo.co.uk/income-protection-calculator', type: 'article' },
};

export default function Page() {
  return <IncomeProtection />;
}
