import type { Metadata } from 'next';
import SickPay from './SickPay';

export const metadata: Metadata = {
  title: 'Statutory Sick Pay Calculator UK 2025/26, SSP £118.75 | UKDesk',
  description:
    'Free UK Statutory Sick Pay calculator for 2025/26. Work out SSP at £118.75 a week after three waiting days, for up to 28 weeks, with the £125 earnings test.',
  alternates: { canonical: '/sick-pay' },
  openGraph: {
    title: 'Statutory Sick Pay Calculator UK 2025/26',
    description: 'Calculate SSP, £118.75/week after three waiting days, up to 28 weeks.',
    url: 'https://ukvisainfo.co.uk/sick-pay',
    type: 'article',
  },
};

export default function Page() {
  return <SickPay />;
}
