import type { Metadata } from 'next';
import VisaHub from '../../components/VisaHub';

export const metadata: Metadata = {
  title: 'Every UK Visa Route, Work, Study, Family, Settlement & Citizenship | UKDesk',
  description:
    'The UK visa hub: work, study, family, visitor, settlement (ILR) and British citizenship routes, each with cost, timeline and requirements in plain English. Sourced from GOV.UK.',
  alternates: { canonical: '/visa-types' },
  openGraph: {
    title: 'Every UK Visa Route, UKDesk',
    description:
      'Work, Study, Family, Visitor, ILR and British Citizenship routes, cost, timeline and requirements in plain English. GOV.UK-sourced.',
    url: 'https://ukvisainfo.co.uk/visa-types',
  },
};

export default function Page() {
  return <VisaHub />;
}
