import type { Metadata } from 'next';
import NationalInsurance from './NationalInsurance';

export const metadata: Metadata = {
  title: 'National Insurance Calculator 2025/26, Class 1 & Class 4 | UKDesk',
  description:
    'Free UK National Insurance calculator. Work out your Class 1 (employed) or Class 4 (self-employed) NI for 2025/26 with a band-by-band breakdown, yearly, monthly and weekly.',
  alternates: { canonical: '/national-insurance-calculator' },
  openGraph: { title: 'National Insurance Calculator 2025/26', description: 'Class 1 and Class 4 NI with a band breakdown.', url: 'https://ukvisainfo.co.uk/national-insurance-calculator', type: 'article' },
};

export default function Page() {
  return <NationalInsurance />;
}
