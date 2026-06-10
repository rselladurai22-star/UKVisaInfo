import type { Metadata } from 'next';
import VisaCompare from '../../../components/tools/VisaCompare';

export const metadata: Metadata = {
  title: 'UK Visa Comparison Tool 2026 — Side-by-Side Routes',
  description:
    'Compare any two UK visa routes side-by-side: fees, IHS, salary thresholds, processing time, work rights and path to ILR. Helps you choose the right route.',
  alternates: { canonical: '/visa-types/compare' },
  openGraph: {
    title: 'UK Visa Comparison Tool',
    description: 'Side-by-side comparison of UK visa routes.',
    url: 'https://ukvisainfo.co.uk/visa-types/compare',
  },
};

export default function Page() {
  return <VisaCompare />;
}
