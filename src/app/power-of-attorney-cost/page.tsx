import type { Metadata } from 'next';
import PowerOfAttorneyCost from './PowerOfAttorneyCost';

export const metadata: Metadata = {
  title: 'Power of Attorney Cost Calculator UK 2025/26 — LPA Fees | UKDesk',
  description:
    'Free UK Lasting Power of Attorney cost calculator for 2025/26. Work out the £82 per LPA registration fee, couples, both types, solicitor costs and fee reductions.',
  alternates: { canonical: '/power-of-attorney-cost' },
  openGraph: {
    title: 'Power of Attorney Cost Calculator UK 2025/26',
    description: 'Estimate LPA costs — the £82 registration fee per document plus any solicitor fees.',
    url: 'https://ukvisainfo.co.uk/power-of-attorney-cost',
    type: 'article',
  },
};

export default function Page() {
  return <PowerOfAttorneyCost />;
}
