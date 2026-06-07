import type { Metadata } from 'next';
import Iht from './Iht';

export const metadata: Metadata = {
  title: 'Inheritance Tax Calculator 2025/26 — NRB £325k + Residence £175k | UKDesk',
  description:
    'Free UK Inheritance Tax calculator. Apply the £325,000 nil-rate band, £175,000 residence band and transferable spouse allowances to see the 40% IHT bill and what heirs receive.',
  alternates: { canonical: '/inheritance-tax' },
  openGraph: { title: 'Inheritance Tax Calculator 2025/26', description: 'IHT bill after the £325k and £175k allowances.', url: 'https://ukvisainfo.co.uk/inheritance-tax', type: 'article' },
};

export default function Page() {
  return <Iht />;
}
