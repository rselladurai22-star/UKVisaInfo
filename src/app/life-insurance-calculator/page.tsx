import type { Metadata } from 'next';
import LifeInsurance from './LifeInsurance';

export const metadata: Metadata = {
  title: 'Life Insurance Calculator 2025/26, How Much Cover Do I Need? | UKDesk',
  description:
    'Free UK life insurance calculator. Work out how much cover your family needs using the DIME method, mortgage, debts, income replacement and children, plus a rough monthly premium for level term cover.',
  alternates: { canonical: '/life-insurance-calculator' },
  openGraph: { title: 'Life Insurance Calculator, How Much Cover?', description: 'Size your life cover with the DIME method and estimate the premium.', url: 'https://ukvisainfo.co.uk/life-insurance-calculator', type: 'article' },
};

export default function Page() {
  return <LifeInsurance />;
}
