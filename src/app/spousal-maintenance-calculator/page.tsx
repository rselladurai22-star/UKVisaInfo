import type { Metadata } from 'next';
import SpousalMaintenance from './SpousalMaintenance';

export const metadata: Metadata = {
  title: 'Spousal Maintenance Calculator UK 2025/26, Estimate | UKDesk',
  description:
    'Free UK spousal maintenance calculator. Get a rough needs-based estimate of spousal periodical payments after divorce in England & Wales, no fixed formula.',
  alternates: { canonical: '/spousal-maintenance-calculator' },
  openGraph: {
    title: 'Spousal Maintenance Calculator UK 2025/26',
    description: 'A rough needs-based estimate of spousal maintenance after divorce.',
    url: 'https://ukvisainfo.co.uk/spousal-maintenance-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <SpousalMaintenance />;
}
