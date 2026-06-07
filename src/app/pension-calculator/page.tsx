import type { Metadata } from 'next';
import PensionCalculator from './PensionCalculator';

export const metadata: Metadata = {
  title: 'Pension Calculator 2025/26 — How Much Pension Will I Have? | UKDesk',
  description:
    'Free UK pension calculator. Project your pension pot at retirement from your current savings and monthly contributions, and see the 25% tax-free cash and sustainable yearly income it could provide.',
  alternates: { canonical: '/pension-calculator' },
  openGraph: { title: 'Pension Calculator — How Much Will I Have?', description: 'Project your pension pot, tax-free cash and retirement income.', url: 'https://ukvisainfo.co.uk/pension-calculator', type: 'article' },
};

export default function Page() {
  return <PensionCalculator />;
}
