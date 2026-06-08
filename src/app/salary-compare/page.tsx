import type { Metadata } from 'next';
import SalaryCompare from './SalaryCompare';

export const metadata: Metadata = {
  title: 'City Salary Comparison Calculator UK 2025/26 | UKDesk',
  description:
    'Free UK city salary comparison calculator for 2025/26. See the equivalent salary you need in another city to keep the same disposable income after tax and rent.',
  alternates: { canonical: '/salary-compare' },
  openGraph: {
    title: 'City Salary Comparison Calculator UK 2025/26',
    description: 'Compare salaries between UK cities on disposable income, after tax and cost of living.',
    url: 'https://ukvisainfo.co.uk/salary-compare',
    type: 'article',
  },
};

export default function Page() {
  return <SalaryCompare />;
}
