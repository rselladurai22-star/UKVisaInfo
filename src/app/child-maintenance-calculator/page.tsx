import type { Metadata } from 'next';
import ChildMaintenance from './ChildMaintenance';

export const metadata: Metadata = {
  title: 'Child Maintenance Calculator UK 2025/26, CMS Rates | UKDesk',
  description:
    'Free UK child maintenance calculator using the Child Maintenance Service formula. Estimate payments at 12/16/19% of gross income with shared-care reductions.',
  alternates: { canonical: '/child-maintenance-calculator' },
  openGraph: {
    title: 'Child Maintenance Calculator UK 2025/26',
    description: 'Estimate CMS child maintenance from gross income, number of children and shared care.',
    url: 'https://ukvisainfo.co.uk/child-maintenance-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <ChildMaintenance />;
}
