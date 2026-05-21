import type { Metadata } from 'next';
import VisaHubClient from '../../components/VisaHubClient';

export const metadata: Metadata = {
  title: 'Every UK Visa Route 2026 — Work, Study, Family, Settlement & Citizenship',
  description:
    'Complete UK visa directory: 35+ routes covering Skilled Worker, Student, Family, Visitor, ILR, British citizenship and special visas. Interactive cost calculator, eligibility quiz and country guidance — all gov.uk verified.',
  alternates: { canonical: '/visa-types' },
  openGraph: {
    title: 'Every UK Visa Route 2026 — Work, Study, Family, Settlement & Citizenship',
    description:
      '35+ routes: Skilled Worker, Student, Family, Visitor, ILR, British Citizenship and more. Interactive cost calculator and eligibility quiz. gov.uk verified 2026.',
    url: 'https://ukvisainfo.co.uk/visa-types',
  },
};

export default function Page() {
  return <VisaHubClient />;
}
