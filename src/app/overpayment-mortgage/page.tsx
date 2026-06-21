import type { Metadata } from 'next';
import OverpaymentCalculator from './OverpaymentCalculator';

export const metadata: Metadata = {
  title: 'Mortgage Overpayment Calculator 2025/26, Interest & Years Saved | UKDesk',
  description:
    'Free UK mortgage overpayment calculator. See how much interest you save and how many years you cut by overpaying monthly or with a lump sum, plus the 10% early-repayment-charge allowance.',
  alternates: { canonical: '/overpayment-mortgage' },
  openGraph: { title: 'Mortgage Overpayment Calculator', description: 'Interest saved and years shaved off by overpaying.', url: 'https://ukvisainfo.co.uk/overpayment-mortgage', type: 'article' },
};

export default function Page() {
  return <OverpaymentCalculator />;
}
