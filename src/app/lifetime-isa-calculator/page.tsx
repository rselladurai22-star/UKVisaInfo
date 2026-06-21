import type { Metadata } from 'next';
import LifetimeIsa from './LifetimeIsa';

export const metadata: Metadata = {
  title: 'Lifetime ISA Calculator 2025/26 to 25% Bonus | UKDesk',
  description:
    'Free UK Lifetime ISA calculator. See how the 25% government bonus (up to £1,000/yr) grows your LISA for a first home or retirement, with the rules and the 25% withdrawal charge explained.',
  alternates: { canonical: '/lifetime-isa-calculator' },
  openGraph: { title: 'Lifetime ISA Calculator, 25% Bonus', description: 'Project your LISA with the 25% government bonus and growth.', url: 'https://ukvisainfo.co.uk/lifetime-isa-calculator', type: 'article' },
};

export default function Page() {
  return <LifetimeIsa />;
}
