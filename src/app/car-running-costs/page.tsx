import type { Metadata } from 'next';
import CarRunningCosts from './CarRunningCosts';

export const metadata: Metadata = {
  title: 'Car Running Costs Calculator UK 2025/26, True Cost | UKDesk',
  description:
    'Free UK car running costs calculator. Add fuel, insurance, road tax, servicing and depreciation for the true annual cost of running a car and the cost per mile.',
  alternates: { canonical: '/car-running-costs' },
  openGraph: {
    title: 'Car Running Costs Calculator UK 2025/26',
    description: 'The true yearly cost of running a car, fuel, insurance, tax, servicing and depreciation.',
    url: 'https://ukvisainfo.co.uk/car-running-costs',
    type: 'article',
  },
};

export default function Page() {
  return <CarRunningCosts />;
}
