import type { Metadata } from 'next';
import Childcare from './Childcare';

export const metadata: Metadata = {
  title: 'Childcare Cost Calculator UK 2025/26, Free Hours & TFC | UKDesk',
  description:
    'Free UK childcare cost calculator for 2025/26. Estimate your bill after 15/30 funded hours, Tax-Free Childcare and the Universal Credit childcare element.',
  alternates: { canonical: '/childcare-calculator' },
  openGraph: {
    title: 'Childcare Cost Calculator UK 2025/26',
    description: 'Estimate childcare costs after free hours, Tax-Free Childcare and Universal Credit support.',
    url: 'https://ukvisainfo.co.uk/childcare-calculator',
    type: 'article',
  },
};

export default function Page() {
  return <Childcare />;
}
