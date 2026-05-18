import type { Metadata } from 'next';
import CostCalculatorAdvanced from '../../../components/tools/CostCalculatorAdvanced';

export const metadata: Metadata = {
  title: 'UK Visa Cost Calculator 2026 — Fees, IHS & Dependants',
  description:
    'Free advanced UK visa cost calculator. Add up Home Office fees, multi-year IHS, dependants and priority services across every visa type. Updated April 2026.',
  alternates: { canonical: '/tools/cost-calculator' },
  openGraph: {
    title: 'UK Visa Cost Calculator',
    description: 'Estimate the full cost of any UK visa application.',
    url: 'https://ukvisainfo.co.uk/tools/cost-calculator',
  },
};

export default function Page() {
  return <CostCalculatorAdvanced />;
}
