import type { Metadata } from 'next';
import Cgt from './Cgt';

export const metadata: Metadata = {
  title: 'Capital Gains Tax Calculator 2025/26 — Shares & Property | UKDesk',
  description:
    'Free UK Capital Gains Tax calculator. Estimate CGT on shares, crypto, a second home or other assets for 2025/26 — after the £3,000 allowance, at 18% and 24% based on your income.',
  alternates: { canonical: '/cgt-calculator' },
  openGraph: { title: 'Capital Gains Tax Calculator 2025/26', description: 'CGT on shares, crypto and property at 18%/24%.', url: 'https://ukvisainfo.co.uk/cgt-calculator', type: 'article' },
};

export default function Page() {
  return <Cgt />;
}
