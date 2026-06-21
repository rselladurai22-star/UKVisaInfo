import type { Metadata } from 'next';
import FuelCost from './FuelCost';

export const metadata: Metadata = {
  title: 'Fuel Cost Calculator UK 2025/26, Cost Per Journey & Year | UKDesk',
  description:
    'Free UK fuel cost calculator. Work out the petrol or diesel cost of any journey and your annual fuel bill from your car MPG and the current price per litre.',
  alternates: { canonical: '/fuel-cost-calculator' },
  openGraph: {
    title: 'Fuel Cost Calculator UK 2025/26',
    description: 'Calculate fuel cost per journey, per mile and per year from MPG and pump price.',
    url: 'https://ukvisainfo.co.uk/fuel-cost-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <FuelCost />;
}
