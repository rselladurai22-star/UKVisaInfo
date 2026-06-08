import type { Metadata } from 'next';
import BalanceTransfer from './BalanceTransfer';

export const metadata: Metadata = {
  title: 'Balance Transfer Calculator UK 2025/26 — 0% Deal vs Fee | UKDesk',
  description:
    'Free UK balance transfer calculator. See whether moving your credit card balance to a 0% deal saves money after the transfer fee, and the interest you avoid.',
  alternates: { canonical: '/balance-transfer-calculator' },
  openGraph: {
    title: 'Balance Transfer Calculator UK 2025/26',
    description: 'Work out if a 0% balance transfer saves money after the fee.',
    url: 'https://ukvisainfo.co.uk/balance-transfer-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <BalanceTransfer />;
}
