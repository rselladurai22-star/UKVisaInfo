import type { Metadata } from 'next';
import DepositCalculator from './DepositCalculator';

export const metadata: Metadata = {
  title: 'Mortgage Deposit Calculator 2025/26 — How Much & How Long | UKDesk',
  description:
    'Free UK mortgage deposit calculator. See the deposit you need for your target property, the LTV it gives you, and how long it will take to save at your current rate — including LISA and savings interest.',
  alternates: { canonical: '/deposit-calculator' },
  openGraph: { title: 'Mortgage Deposit Calculator', description: 'Deposit needed, LTV and time to save.', url: 'https://ukvisainfo.co.uk/deposit-calculator', type: 'article' },
};

export default function Page() {
  return <DepositCalculator />;
}
