import type { Metadata } from 'next';
import MortgageAffordability from './MortgageAffordability';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';

export const metadata: Metadata = {
  title: 'Mortgage Affordability Calculator 2025/26 — How Much Can I Borrow? | UKDesk',
  description:
    'Free UK mortgage affordability calculator. Enter income, deposit, outgoings and term to see your maximum borrowing, property budget, monthly repayment and stress-tested affordability — the way lenders assess it.',
  alternates: { canonical: '/mortgage-affordability' },
  openGraph: {
    title: 'Mortgage Affordability Calculator 2025/26 — How Much Can I Borrow?',
    description: 'See your maximum mortgage and property budget, with income multiples, commitments and a stress test.',
    url: 'https://ukvisainfo.co.uk/mortgage-affordability',
    type: 'article',
  },
};

const FAQS = [
  { q: 'How many times my salary can I borrow?', a: 'Around 4.5 times income is the common cap, though some lenders go to 5–5.5× for higher earners or certain professions. The exact figure depends on your outgoings, credit profile and the lender.' },
  { q: 'Does a joint application let us borrow more?', a: 'Usually yes — most lenders combine both incomes (subject to the same multiple and affordability tests), so two incomes typically support a larger loan than one.' },
  { q: 'Can I get a mortgage if I am self-employed?', a: 'Yes. Lenders typically average your last two to three years of accounts or SA302s. A longer trading history and steady or rising profits help.' },
  { q: 'Is this the same as a Decision in Principle?', a: 'No. This is an estimate. A Decision in Principle is a soft-checked indication from a specific lender; a full application with documents confirms what you can borrow.' },
];

export default function Page() {
  return (
    <>
      <FaqJsonLd faqs={FAQS} />
      <MortgageAffordability />
    </>
  );
}
