import type { Metadata } from 'next';
import TakeHome from './TakeHome';

export const metadata: Metadata = {
  title: 'Take-Home Pay Calculator 2025/26, Salary After Tax | UKDesk',
  description:
    'Free UK salary take-home calculator. See your net pay after Income Tax, National Insurance, pension and student loan, yearly, monthly and weekly, on 2025/26 rates for England, Wales and NI.',
  alternates: { canonical: '/take-home-pay' },
  openGraph: { title: 'Take-Home Pay Calculator 2025/26', description: 'Your salary after tax, NI, pension and student loan.', url: 'https://ukvisainfo.co.uk/take-home-pay', type: 'article' },
};

export default function Page() {
  return <TakeHome />;
}
