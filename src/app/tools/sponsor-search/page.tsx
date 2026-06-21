import type { Metadata } from 'next';
import SponsorSearch from '../../../components/tools/SponsorSearch';

export const metadata: Metadata = {
  title: 'UK Sponsor Licence Search 2026, Find Licensed Employers',
  description:
    'Search UK companies that hold a Skilled Worker sponsor licence. Filter by city, region, sector and rating. Drawn from the official Home Office register.',
  alternates: { canonical: '/tools/sponsor-search' },
  openGraph: {
    title: 'UK Sponsor Licence Search',
    description: 'Find UK employers who can sponsor your Skilled Worker visa.',
    url: 'https://ukvisainfo.co.uk/tools/sponsor-search',
  },
};

export default function Page() {
  return <SponsorSearch />;
}
