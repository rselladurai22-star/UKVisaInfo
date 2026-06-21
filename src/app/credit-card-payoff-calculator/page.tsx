import type { Metadata } from 'next';
import CreditCardPayoff from './CreditCardPayoff';

export const metadata: Metadata = {
  title: 'Credit Card Payoff Calculator 2025/26, Time & Interest | UKDesk',
  description:
    'Free UK credit card payoff calculator. See how long to clear your balance and the interest you’ll pay at a fixed monthly amount, versus the minimum-payment trap. Balance transfer and payoff tips included.',
  alternates: { canonical: '/credit-card-payoff-calculator' },
  openGraph: { title: 'Credit Card Payoff Calculator', description: 'Time and interest to clear a credit card vs minimum payments.', url: 'https://ukvisainfo.co.uk/credit-card-payoff-calculator', type: 'article' },
};

export default function Page() {
  return <CreditCardPayoff />;
}
