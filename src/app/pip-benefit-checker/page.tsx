import type { Metadata } from 'next';
import PipChecker from './PipChecker';

export const metadata: Metadata = {
  title: 'PIP Benefit Checker UK 2025/26, Daily Living & Mobility | UKDesk',
  description:
    'Free UK PIP benefit checker for 2025/26. Estimate your Personal Independence Payment from daily living and mobility points at standard and enhanced rates.',
  alternates: { canonical: '/pip-benefit-checker' },
  openGraph: {
    title: 'PIP Benefit Checker UK 2025/26',
    description: 'Estimate your Personal Independence Payment from daily living and mobility points.',
    url: 'https://ukvisainfo.co.uk/pip-benefit-checker',
    type: 'article',
  },
};

export default function Page() {
  return <PipChecker />;
}
