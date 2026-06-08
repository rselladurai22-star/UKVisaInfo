import type { Metadata } from 'next';
import MaternityPay from './MaternityPay';

export const metadata: Metadata = {
  title: 'Maternity & Paternity Pay Calculator UK 2025/26 — SMP/SPP | UKDesk',
  description:
    'Free UK maternity and paternity pay calculator for 2025/26. Estimate SMP (90% then £187.18 for 39 weeks) and SPP, with the £125 earnings test and phase breakdown.',
  alternates: { canonical: '/maternity-pay' },
  openGraph: {
    title: 'Maternity & Paternity Pay Calculator UK 2025/26',
    description: 'Estimate Statutory Maternity Pay and Statutory Paternity Pay for 2025/26.',
    url: 'https://ukvisainfo.co.uk/maternity-pay',
    type: 'article',
  },
};

export default function Page() {
  return <MaternityPay />;
}
