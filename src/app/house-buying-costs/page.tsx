import type { Metadata } from 'next';
import HouseBuyingCosts from './HouseBuyingCosts';

export const metadata: Metadata = {
  title: 'House Buying Costs Calculator 2025/26 — Total Cash Needed | UKDesk',
  description:
    'Free UK house buying costs calculator. Add up every upfront cost — deposit, stamp duty, conveyancing, survey, searches, Land Registry, mortgage fees and removals — to see the real cash you need.',
  alternates: { canonical: '/house-buying-costs' },
  openGraph: { title: 'House Buying Costs Calculator', description: 'Every upfront cost of buying a home, totalled.', url: 'https://ukvisainfo.co.uk/house-buying-costs', type: 'article' },
};

export default function Page() {
  return <HouseBuyingCosts />;
}
