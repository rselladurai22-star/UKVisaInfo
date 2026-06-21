import type { Metadata } from 'next';
import GiftIht from './GiftIht';

export const metadata: Metadata = {
  title: 'Gift IHT Calculator UK 2025/26 to 7-Year Rule & Taper | UKDesk',
  description:
    'Free UK gift inheritance tax calculator for 2025/26. See tax on lifetime gifts under the 7-year rule, with taper relief and the £3,000 annual exemption applied.',
  alternates: { canonical: '/gift-iht-calculator' },
  openGraph: {
    title: 'Gift IHT Calculator UK 2025/26',
    description: 'Work out inheritance tax on gifts under the 7-year rule with taper relief.',
    url: 'https://ukvisainfo.co.uk/gift-iht-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <GiftIht />;
}
