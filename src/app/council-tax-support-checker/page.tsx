import type { Metadata } from 'next';
import CouncilTaxSupport from './CouncilTaxSupport';

export const metadata: Metadata = {
  title: 'Council Tax Support Checker UK 2025/26 — CTR Estimate | UKDesk',
  description:
    'Free UK Council Tax Reduction checker for 2025/26. Estimate how much your council tax bill could be cut through means-tested Council Tax Support from your local council.',
  alternates: { canonical: '/council-tax-support-checker' },
  openGraph: {
    title: 'Council Tax Support Checker UK 2025/26',
    description: 'Estimate your Council Tax Reduction — the means-tested discount run by your council.',
    url: 'https://ukvisainfo.co.uk/council-tax-support-checker',
    type: 'article',
  },
};

export default function Page() {
  return <CouncilTaxSupport />;
}
