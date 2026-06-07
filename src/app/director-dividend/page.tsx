import type { Metadata } from 'next';
import DirectorDividend from './DirectorDividend';

export const metadata: Metadata = {
  title: 'Dividend Tax Calculator 2025/26 — Salary & Dividends | UKDesk',
  description:
    'Free UK dividend tax calculator for directors and shareholders. See the personal tax on a salary-plus-dividends mix on 2025/26 rates, including the £500 allowance and 8.75%/33.75%/39.35% rates.',
  alternates: { canonical: '/director-dividend' },
  openGraph: { title: 'Dividend Tax Calculator 2025/26', description: 'Tax on a salary + dividends mix for company directors.', url: 'https://ukvisainfo.co.uk/director-dividend', type: 'article' },
};

export default function Page() {
  return <DirectorDividend />;
}
