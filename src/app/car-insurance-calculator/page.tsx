import type { Metadata } from 'next';
import CarInsurance from './CarInsurance';

export const metadata: Metadata = {
  title: 'Car Insurance Calculator 2025/26, Premium & Group Estimate | UKDesk',
  description:
    'Free UK car insurance calculator. Estimate your annual premium from your age, no-claims years, the car’s insurance group, mileage and location, and learn how the 1 to 50 group system sets the price.',
  alternates: { canonical: '/car-insurance-calculator' },
  openGraph: { title: 'Car Insurance Calculator', description: 'Estimate your car insurance premium and understand insurance groups.', url: 'https://ukvisainfo.co.uk/car-insurance-calculator', type: 'article' },
};

export default function Page() {
  return <CarInsurance />;
}
