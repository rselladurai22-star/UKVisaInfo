import type { Metadata } from 'next';
import SelfEmployed from './SelfEmployed';

export const metadata: Metadata = {
  title: 'Self-Employed Tax Calculator 2025/26 — Self Assessment | UKDesk',
  description:
    'Free UK self-employed tax calculator. Estimate your Self Assessment bill — Income Tax plus Class 4 National Insurance — from your annual profit, plus payments on account, on 2025/26 rates.',
  alternates: { canonical: '/self-employed-tax' },
  openGraph: { title: 'Self-Employed Tax Calculator 2025/26', description: 'Self Assessment Income Tax + Class 4 NI from your profit.', url: 'https://ukvisainfo.co.uk/self-employed-tax', type: 'article' },
};

export default function Page() {
  return <SelfEmployed />;
}
