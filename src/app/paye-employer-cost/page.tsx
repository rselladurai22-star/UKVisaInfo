import type { Metadata } from 'next';
import EmployerCost from './EmployerCost';

export const metadata: Metadata = {
  title: 'Employer Cost Calculator UK 2025/26 — True Cost of a Hire | UKDesk',
  description:
    'Free UK employer cost calculator for 2025/26. See the true cost of an employee: gross salary plus 15% employer National Insurance and minimum workplace pension.',
  alternates: { canonical: '/paye-employer-cost' },
  openGraph: {
    title: 'Employer Cost Calculator UK 2025/26',
    description: 'Gross salary + employer NI (15%) + pension — the real cost of hiring someone.',
    url: 'https://ukvisainfo.co.uk/paye-employer-cost',
    type: 'article',
  },
};

export default function Page() {
  return <EmployerCost />;
}
