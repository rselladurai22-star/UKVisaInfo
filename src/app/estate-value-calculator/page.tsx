import type { Metadata } from 'next';
import EstateValue from './EstateValue';

export const metadata: Metadata = {
  title: 'Estate Value Calculator UK 2025/26, Net Estate for IHT | UKDesk',
  description:
    'Free UK estate value calculator for 2025/26. Add assets, subtract debts to find your net estate, with an inheritance tax estimate using the £325k and £175k bands.',
  alternates: { canonical: '/estate-value-calculator' },
  openGraph: {
    title: 'Estate Value Calculator UK 2025/26',
    description: 'Work out your net estate and estimated inheritance tax for 2025/26.',
    url: 'https://ukvisainfo.co.uk/estate-value-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <EstateValue />;
}
