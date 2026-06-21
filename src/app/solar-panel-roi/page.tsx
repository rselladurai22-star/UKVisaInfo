import type { Metadata } from 'next';
import SolarRoi from './SolarRoi';

export const metadata: Metadata = {
  title: 'Solar Panel ROI Calculator UK 2025/26, Payback & Savings | UKDesk',
  description:
    'Free UK solar panel ROI calculator. Estimate payback period, annual savings, export income (SEG) and 25-year return from system size, cost and self-use.',
  alternates: { canonical: '/solar-panel-roi' },
  openGraph: {
    title: 'Solar Panel ROI Calculator UK 2025/26',
    description: 'Estimate solar payback, savings and 25-year return for a UK home.',
    url: 'https://ukvisainfo.co.uk/solar-panel-roi',
    type: 'article',
  },
};

export default function Page() {
  return <SolarRoi />;
}
