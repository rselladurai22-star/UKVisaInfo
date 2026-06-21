import type { Metadata } from 'next';
import HolidayPay from './HolidayPay';

export const metadata: Metadata = {
  title: 'Holiday Pay Calculator UK 2025/26 to 5.6 Weeks & 12.07% | UKDesk',
  description:
    'Free UK holiday entitlement and pay calculator for 2025/26. Work out 5.6 weeks for regular workers or 12.07% accrual for irregular and part-year workers.',
  alternates: { canonical: '/holiday-pay' },
  openGraph: {
    title: 'Holiday Pay Calculator UK 2025/26',
    description: 'Statutory holiday entitlement, 5.6 weeks or the 12.07% method for irregular hours.',
    url: 'https://ukvisainfo.co.uk/holiday-pay',
    type: 'article',
  },
};

export default function Page() {
  return <HolidayPay />;
}
