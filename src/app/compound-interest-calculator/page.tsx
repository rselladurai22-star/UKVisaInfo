import type { Metadata } from 'next';
import CompoundInterest from './CompoundInterest';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator 2025/26, Savings Growth | UKDesk',
  description:
    'Free UK compound interest calculator. See how a lump sum plus regular monthly saving grows over time, how much is interest vs contributions, and the power of starting early. Rule of 72 explained.',
  alternates: { canonical: '/compound-interest-calculator' },
  openGraph: { title: 'Compound Interest Calculator', description: 'See your savings grow with compound interest over time.', url: 'https://ukvisainfo.co.uk/compound-interest-calculator', type: 'article' },
};

export default function Page() {
  return <CompoundInterest />;
}
