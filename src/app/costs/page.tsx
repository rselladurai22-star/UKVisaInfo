import type { Metadata } from 'next';
import CostCalculator from '../../components/CostCalculator';

export const metadata: Metadata = {
  title: 'UK Visa Cost Calculator 2026 — Fees, IHS & Total',
  description:
    'Estimate the full cost of your UK visa application including Home Office fees, Immigration Health Surcharge (IHS £1,035/year) and priority processing add-ons. Updated April 2026.',
  alternates: { canonical: '/costs' },
  openGraph: {
    title: 'UK Visa Cost Calculator 2026',
    description:
      'Estimate fees, IHS and priority processing costs for any UK visa route.',
    url: 'https://ukvisainfo.co.uk/costs',
  },
};

export default function Page() {
  return <CostCalculator />;
}
