import type { Metadata } from 'next';
import WillWritingCost from './WillWritingCost';

export const metadata: Metadata = {
  title: 'Will Writing Cost Calculator UK 2025/26 — DIY vs Solicitor | UKDesk',
  description:
    'Free UK will writing cost estimator for 2025/26. Compare DIY kits, online services, will writers and solicitors, including mirror wills and complex estates with trusts.',
  alternates: { canonical: '/will-writing-cost' },
  openGraph: {
    title: 'Will Writing Cost Calculator UK 2025/26',
    description: 'Compare the cost of making a will — DIY, online, will writer or solicitor.',
    url: 'https://ukvisainfo.co.uk/will-writing-cost',
    type: 'article',
  },
};

export default function Page() {
  return <WillWritingCost />;
}
