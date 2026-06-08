import type { Metadata } from 'next';
import VehicleTax from './VehicleTax';

export const metadata: Metadata = {
  title: 'Vehicle Tax (VED) Calculator UK 2025/26 — Road Tax | UKDesk',
  description:
    'Free UK vehicle tax calculator for 2025/26. Estimate road tax by CO2 first-year rate, the £195 standard rate and the £425 expensive-car supplement over £40,000.',
  alternates: { canonical: '/vehicle-tax-calculator' },
  openGraph: {
    title: 'Vehicle Tax (VED) Calculator UK 2025/26',
    description: 'Estimate UK road tax — first-year CO2 rates, £195 standard rate and the £40,000 supplement.',
    url: 'https://ukvisainfo.co.uk/vehicle-tax-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <VehicleTax />;
}
