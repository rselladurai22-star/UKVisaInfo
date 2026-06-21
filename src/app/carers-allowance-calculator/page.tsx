import type { Metadata } from 'next';
import CarersAllowance from './CarersAllowance';

export const metadata: Metadata = {
  title: "Carer's Allowance Calculator UK 2025/26 to £83.30/week | UKDesk",
  description:
    "Free UK Carer's Allowance checker for 2025/26. See if you qualify for £83.30 a week, caring 35+ hours, earning under £196 a week, for someone on a disability benefit.",
  alternates: { canonical: '/carers-allowance-calculator' },
  openGraph: {
    title: "Carer's Allowance Calculator UK 2025/26",
    description: "Check eligibility for Carer's Allowance, £83.30/week for 2025/26.",
    url: 'https://ukvisainfo.co.uk/carers-allowance-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <CarersAllowance />;
}
