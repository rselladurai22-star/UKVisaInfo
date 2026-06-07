import type { Metadata } from 'next';
import SalarySacrifice from './SalarySacrifice';

export const metadata: Metadata = {
  title: 'Salary Sacrifice Calculator 2025/26 — Pension Tax & NI Saving | UKDesk',
  description:
    'Free UK salary sacrifice calculator. See how sacrificing salary into your pension cuts Income Tax and National Insurance, the real cost to your take-home, and the employer NI top-up.',
  alternates: { canonical: '/salary-sacrifice-calculator' },
  openGraph: { title: 'Salary Sacrifice Calculator 2025/26', description: 'Tax and NI saved by sacrificing salary into your pension.', url: 'https://ukvisainfo.co.uk/salary-sacrifice-calculator', type: 'article' },
};

export default function Page() {
  return <SalarySacrifice />;
}
