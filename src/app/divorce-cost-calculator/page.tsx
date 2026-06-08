import type { Metadata } from 'next';
import DivorceCost from './DivorceCost';

export const metadata: Metadata = {
  title: 'Divorce Cost Calculator UK 2025/26 — Court & Legal Fees | UKDesk',
  description:
    'Free UK divorce cost calculator for 2025/26. Estimate the £593 court fee plus solicitor and financial consent order costs for DIY, uncontested or contested divorce.',
  alternates: { canonical: '/divorce-cost-calculator' },
  openGraph: {
    title: 'Divorce Cost Calculator UK 2025/26',
    description: 'Estimate divorce costs — the £593 court fee plus solicitor and financial-order fees.',
    url: 'https://ukvisainfo.co.uk/divorce-cost-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <DivorceCost />;
}
