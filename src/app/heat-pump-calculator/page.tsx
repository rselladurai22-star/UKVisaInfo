import type { Metadata } from 'next';
import HeatPump from './HeatPump';

export const metadata: Metadata = {
  title: 'Heat Pump Cost Calculator UK 2025/26 — vs Gas Boiler | UKDesk',
  description:
    'Free UK heat pump cost calculator. Compare air source heat pump running costs against a gas boiler and see payback after the £7,500 Boiler Upgrade Scheme grant.',
  alternates: { canonical: '/heat-pump-calculator' },
  openGraph: {
    title: 'Heat Pump Cost Calculator UK 2025/26',
    description: 'Compare heat pump vs gas boiler running costs and payback with the £7,500 grant.',
    url: 'https://ukvisainfo.co.uk/heat-pump-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <HeatPump />;
}
