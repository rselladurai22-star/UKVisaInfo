import type { Metadata } from 'next';
import MortgageCalculator from './MortgageCalculator';

export const metadata: Metadata = {
  title: 'Mortgage Calculator 2026 — Monthly Repayments, Interest & Amortisation',
  description:
    'UK mortgage repayment calculator. Enter property price, deposit, term and rate to see your monthly payment, total interest, total cost, payoff date and a full year-by-year amortisation schedule. Model fee capitalisation and overpayments.',
  alternates: { canonical: '/mortgage-calculator' },
  openGraph: {
    title: 'Mortgage Calculator 2026 — Monthly Repayments, Interest & Amortisation',
    description:
      'See your monthly mortgage payment, total interest, payoff date and full amortisation schedule. Model fees and LTV bands.',
    url: 'https://ukvisainfo.co.uk/mortgage-calculator',
  },
};

export default function MortgageCalculatorPage() {
  return <MortgageCalculator />;
}
