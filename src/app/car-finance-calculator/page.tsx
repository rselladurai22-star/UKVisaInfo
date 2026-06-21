import type { Metadata } from 'next';
import CarFinance from './CarFinance';

export const metadata: Metadata = {
  title: 'Car Finance Calculator 2025/26, PCP vs HP vs Loan | UKDesk',
  description:
    'Free UK car finance calculator. Compare PCP, Hire Purchase and a personal loan side by side, monthly payments, the PCP balloon and total cost to own, to pick the cheapest way to finance a car.',
  alternates: { canonical: '/car-finance-calculator' },
  openGraph: { title: 'Car Finance Calculator, PCP vs HP vs Loan', description: 'Compare car finance options and the true cost to own.', url: 'https://ukvisainfo.co.uk/car-finance-calculator', type: 'article' },
};

export default function Page() {
  return <CarFinance />;
}
