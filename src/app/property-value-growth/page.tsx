import type { Metadata } from 'next';
import PropertyValueGrowth from './PropertyValueGrowth';

export const metadata: Metadata = {
  title: 'Property Value Growth Calculator — Project Your Home&apos;s Value | UKDesk',
  description:
    'Free UK property value growth calculator. Project what your home could be worth over time at a chosen growth rate, with a low-to-high range and an inflation-adjusted value in today’s money.',
  alternates: { canonical: '/property-value-growth' },
  openGraph: { title: 'Property Value Growth Calculator', description: 'Project your home value with a growth range and real value.', url: 'https://ukvisainfo.co.uk/property-value-growth', type: 'article' },
};

export default function Page() {
  return <PropertyValueGrowth />;
}
