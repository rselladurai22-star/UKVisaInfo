import type { Metadata } from 'next';
import BonusTax from './BonusTax';

export const metadata: Metadata = {
  title: 'Bonus Tax Calculator 2025/26, How Much Will I Keep? | UKDesk',
  description:
    'Free UK bonus tax calculator. See how much of your bonus you keep after Income Tax and National Insurance, and how sacrificing it into your pension can save 40 to 60%+ on 2025/26 rates.',
  alternates: { canonical: '/bonus-tax' },
  openGraph: { title: 'Bonus Tax Calculator 2025/26', description: 'How much of your bonus you keep after tax and NI.', url: 'https://ukvisainfo.co.uk/bonus-tax', type: 'article' },
};

export default function Page() {
  return <BonusTax />;
}
