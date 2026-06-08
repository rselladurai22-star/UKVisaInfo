import type { Metadata } from 'next';
import EvCharging from './EvCharging';

export const metadata: Metadata = {
  title: 'EV Charging Cost Calculator UK 2025/26 — Home vs Public | UKDesk',
  description:
    'Free UK EV charging cost calculator. Work out the cost of charging an electric car at home and on public chargers, with a petrol-car comparison and cost per mile.',
  alternates: { canonical: '/ev-charging-cost' },
  openGraph: {
    title: 'EV Charging Cost Calculator UK 2025/26',
    description: 'Cost of charging an EV at home vs public chargers, compared with petrol.',
    url: 'https://ukvisainfo.co.uk/ev-charging-cost',
    type: 'article',
  },
};

export default function Page() {
  return <EvCharging />;
}
