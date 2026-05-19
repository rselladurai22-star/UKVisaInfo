import type { Metadata } from 'next';
import { Suspense } from 'react';
import CostCalculatorAdvanced from '../../../components/tools/CostCalculatorAdvanced';

export const metadata: Metadata = {
  title: 'UK Visa Cost Calculator 2026 — Fees, IHS & Dependants',
  description:
    'Free UK visa cost calculator with 8 April 2026 fees verified against gov.uk. Add Home Office fees, multi-year IHS, dependants and priority services across every visa route.',
  alternates: { canonical: '/tools/cost-calculator' },
  openGraph: {
    title: 'UK Visa Cost Calculator',
    description: 'Estimate the full cost of any UK visa application — gov.uk-verified figures.',
    url: 'https://ukvisainfo.co.uk/tools/cost-calculator',
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CostCalculatorAdvanced />
    </Suspense>
  );
}
