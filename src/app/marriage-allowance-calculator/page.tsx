import type { Metadata } from 'next';
import MarriageAllowance from './MarriageAllowance';

export const metadata: Metadata = {
  title: 'Marriage Allowance Calculator 2025/26, Save up to £252 | UKDesk',
  description:
    'Free UK Marriage Allowance calculator. Check if you can transfer £1,260 of personal allowance to a basic-rate spouse to save up to £252 a year, plus backdate up to four years.',
  alternates: { canonical: '/marriage-allowance-calculator' },
  openGraph: { title: 'Marriage Allowance Calculator', description: 'Check eligibility and save up to £252/yr, plus backdating.', url: 'https://ukvisainfo.co.uk/marriage-allowance-calculator', type: 'article' },
};

export default function Page() {
  return <MarriageAllowance />;
}
