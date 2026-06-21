import type { Metadata } from 'next';
import EnergyBill from './EnergyBill';

export const metadata: Metadata = {
  title: 'Energy Bill Calculator UK 2025/26, Ofgem Price Cap | UKDesk',
  description:
    'Free UK energy bill calculator under the Ofgem price cap. Estimate your annual gas and electricity bill from your kWh usage, with standing charges and a typical-home comparison.',
  alternates: { canonical: '/energy-bill' },
  openGraph: {
    title: 'Energy Bill Calculator UK 2025/26',
    description: 'Estimate your annual gas and electricity bill under the Ofgem price cap.',
    url: 'https://ukvisainfo.co.uk/energy-bill',
    type: 'article',
  },
};

export default function Page() {
  return <EnergyBill />;
}
