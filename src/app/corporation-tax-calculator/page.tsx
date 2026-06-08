import type { Metadata } from 'next';
import CorpTax from './CorpTax';

export const metadata: Metadata = {
  title: 'Corporation Tax Calculator UK 2025/26 — 19% & 25% | UKDesk',
  description:
    'Free UK corporation tax calculator for 2025/26. Work out your limited company tax at the 19% small profits rate, 25% main rate, or marginal relief in between.',
  alternates: { canonical: '/corporation-tax-calculator' },
  openGraph: {
    title: 'Corporation Tax Calculator UK 2025/26',
    description: '19% small profits rate, 25% main rate and marginal relief — calculate your company tax bill.',
    url: 'https://ukvisainfo.co.uk/corporation-tax-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <CorpTax />;
}
