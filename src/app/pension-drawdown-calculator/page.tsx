import type { Metadata } from 'next';
import PensionDrawdown from './PensionDrawdown';

export const metadata: Metadata = {
  title: 'Pension Drawdown Calculator 2025/26 — How Long Will It Last? | UKDesk',
  description:
    'Free UK pension drawdown calculator. See how long your pot lasts at a chosen yearly income after taking 25% tax-free cash, whether your withdrawal rate is sustainable, and drawdown vs annuity.',
  alternates: { canonical: '/pension-drawdown-calculator' },
  openGraph: { title: 'Pension Drawdown Calculator', description: 'How long your pension pot lasts in drawdown, and the 4% rule.', url: 'https://ukvisainfo.co.uk/pension-drawdown-calculator', type: 'article' },
};

export default function Page() {
  return <PensionDrawdown />;
}
