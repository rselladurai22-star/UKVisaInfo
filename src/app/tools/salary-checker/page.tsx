import type { Metadata } from 'next';
import SalaryChecker from '../../../components/tools/SalaryChecker';

export const metadata: Metadata = {
  title: 'UK Skilled Worker Salary Checker 2026 — By SOC Code',
  description:
    'Free tool to check if your UK job offer meets the Skilled Worker visa salary threshold. Search 100+ SOC 2020 occupation codes with 2026 going rates. Instant qualification check.',
  alternates: { canonical: '/tools/salary-checker' },
  openGraph: {
    title: 'UK Skilled Worker Salary Checker',
    description: 'Check if your salary qualifies for a UK Skilled Worker visa.',
    url: 'https://ukvisainfo.co.uk/tools/salary-checker',
  },
};

export default function Page() {
  return <SalaryChecker />;
}
