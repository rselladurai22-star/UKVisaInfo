import type { Metadata } from 'next';
import Ulez from './Ulez';

export const metadata: Metadata = {
  title: 'ULEZ & Clean Air Zone Checker UK 2025/26 — Compliance | UKDesk',
  description:
    'Free UK ULEZ and Clean Air Zone checker. See if your car, van or motorcycle is compliant with London ULEZ, England Clean Air Zones and Scottish LEZs, or faces a daily charge.',
  alternates: { canonical: '/ulez-check' },
  openGraph: {
    title: 'ULEZ & Clean Air Zone Checker UK 2025/26',
    description: 'Check ULEZ and Clean Air Zone compliance by fuel and registration year.',
    url: 'https://ukvisainfo.co.uk/ulez-check',
    type: 'article',
  },
};

export default function Page() {
  return <Ulez />;
}
