import type { Metadata } from 'next';
import SalaryVsDividend from './SalaryVsDividend';

export const metadata: Metadata = {
  title: 'Salary vs Dividend Calculator UK 2025/26, Director Split | UKDesk',
  description:
    'Free UK salary vs dividend calculator for 2025/26. Find the most tax-efficient director split between salary and dividends after employer NI, corporation and dividend tax.',
  alternates: { canonical: '/salary-vs-dividend-calculator' },
  openGraph: {
    title: 'Salary vs Dividend Calculator UK 2025/26',
    description: 'Find the optimal director pay split between salary and dividends for 2025/26.',
    url: 'https://ukvisainfo.co.uk/salary-vs-dividend-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <SalaryVsDividend />;
}
