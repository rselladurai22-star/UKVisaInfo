import type { Metadata } from 'next';
import RentalYield from './RentalYield';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';

export const metadata: Metadata = {
  title: 'Rental Yield Calculator 2025/26 — Gross & Net Yield, ICR & ROI | UKDesk',
  description:
    'Free UK rental yield calculator. Work out gross and net rental yield, monthly cash flow, cash-on-cash ROI and the buy-to-let mortgage ICR stress test, with the Section 24 tax impact for landlords.',
  alternates: { canonical: '/rental-yield-calculator' },
  openGraph: {
    title: 'Rental Yield Calculator 2025/26 — Gross & Net Yield, ICR & ROI',
    description: 'Gross & net yield, cash flow, ROI and the ICR stress test for UK buy-to-let.',
    url: 'https://ukvisainfo.co.uk/rental-yield-calculator',
    type: 'article',
  },
};

const FAQS = [
  { q: 'What is a good rental yield in the UK?', a: 'A net yield of 5% or more is generally considered healthy. Gross yields of 6–8% are common in higher-yield northern cities, while London often sits below 4% gross.' },
  { q: 'Does the ICR stress test use my actual mortgage rate?', a: 'No — lenders use a notional stressed rate (often around 5.5%), so a cheap fixed deal does not help you pass. Required coverage is typically 125% (basic rate) or 145% (higher rate).' },
  { q: 'Is rental income taxed?', a: 'Yes. Rental profit is taxed at your income-tax rate, with mortgage interest now only attracting a 20% tax credit for individuals rather than being a deductible expense.' },
  { q: 'Should I buy through a limited company?', a: 'An SPV keeps full interest deductibility (avoiding Section 24) and can suit higher-rate or portfolio landlords, but rates and admin are higher. Take accountancy advice.' },
];

export default function Page() {
  return (
    <>
      <FaqJsonLd faqs={FAQS} />
      <RentalYield />
    </>
  );
}
