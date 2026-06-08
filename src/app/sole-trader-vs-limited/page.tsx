import type { Metadata } from 'next';
import SoleTraderVsLimited from './SoleTraderVsLimited';

export const metadata: Metadata = {
  title: 'Sole Trader vs Limited Company Calculator 2025/26 | UKDesk',
  description:
    'Free UK calculator comparing sole trader vs limited company take-home pay for 2025/26. Income tax & Class 4 NI versus salary, corporation tax and dividends.',
  alternates: { canonical: '/sole-trader-vs-limited' },
  openGraph: {
    title: 'Sole Trader vs Limited Company 2025/26',
    description: 'Compare take-home pay: sole trader tax versus a limited company salary-plus-dividends structure.',
    url: 'https://ukvisainfo.co.uk/sole-trader-vs-limited',
    type: 'article',
  },
};

export default function Page() {
  return <SoleTraderVsLimited />;
}
