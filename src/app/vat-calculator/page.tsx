import type { Metadata } from 'next';
import Vat from './Vat';

export const metadata: Metadata = {
  title: 'VAT Calculator UK 2025/26, Add & Remove VAT | UKDesk',
  description:
    'Free UK VAT calculator. Add or remove 20% standard rate or 5% reduced rate VAT. Learn about registration thresholds (£90,000), flat rate schemes, and compliance.',
  alternates: { canonical: '/vat-calculator' },
  openGraph: {
    title: 'VAT Calculator UK 2025/26',
    description: 'Add or remove 20% or 5% VAT quickly. Calculate net, gross, and VAT amounts.',
    url: 'https://ukvisainfo.co.uk/vat-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <Vat />;
}
