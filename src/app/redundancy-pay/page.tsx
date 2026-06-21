import type { Metadata } from 'next';
import RedundancyPay from './RedundancyPay';
import { WEEKLY_CAP, WEEKLY_CAP_FROM } from '../../lib/redundancy/calc';

export const metadata: Metadata = {
  title: 'Redundancy Pay Calculator UK 2025/26, Statutory Entitlement | UKDesk',
  description: `Free UK statutory redundancy pay calculator for 2025/26. Enter age, years of service and weekly pay for your entitlement using the gov.uk formula. £${WEEKLY_CAP}/week cap from ${WEEKLY_CAP_FROM}.`,
  alternates: { canonical: '/redundancy-pay' },
  openGraph: {
    title: 'Redundancy Pay Calculator UK 2025/26',
    description: 'Statutory redundancy entitlement by age, service and weekly pay, with the £30,000 tax-free limit.',
    url: 'https://ukvisainfo.co.uk/redundancy-pay',
    type: 'article',
  },
};

export default function Page() {
  return <RedundancyPay />;
}
