import type { Metadata } from 'next';
import VisaTypes from '../../components/VisaTypes';

export const metadata: Metadata = {
  title: 'All UK Visa Types — Requirements & Eligibility 2026',
  description:
    'Complete directory of UK visa routes: Skilled Worker, Student, Visitor, Family, Health & Care Worker, Global Talent, Graduate and Innovator Founder. Fees, durations and eligibility at a glance.',
  alternates: { canonical: '/visa-types' },
  openGraph: {
    title: 'All UK Visa Types — Requirements & Eligibility 2026',
    description:
      'Complete directory of UK visa routes with fees, durations and eligibility.',
    url: 'https://ukvisainfo.co.uk/visa-types',
  },
};

export default function Page() {
  return <VisaTypes />;
}
