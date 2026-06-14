import type { Metadata } from 'next';
import BuyVsRent from './BuyVsRent';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';

export const metadata: Metadata = {
  title: 'Buy vs Rent Calculator 2025/26 — Which Leaves You Better Off? | UKDesk',
  description:
    'Free UK buy vs rent calculator. Compares buying and renting fairly on the same budget, tracking your net worth over time with house-price growth, investment returns and the real costs of buying and selling. Find your break-even year.',
  alternates: { canonical: '/buy-vs-rent' },
  openGraph: {
    title: 'Buy vs Rent Calculator 2025/26 — Which Leaves You Better Off?',
    description: 'Compare buying vs renting on net worth over time, with a clear break-even year.',
    url: 'https://ukvisainfo.co.uk/buy-vs-rent',
    type: 'article',
  },
};

const FAQS = [
  { q: 'Is renting really dead money?', a: 'Not necessarily. Rent buys flexibility and no maintenance liability, and a disciplined renter can invest the deposit for a return that sometimes beats house-price growth. Mortgage interest is "dead" in the same way rent is.' },
  { q: 'How long do I need to stay for buying to pay off?', a: 'With moderate assumptions, buying often breaks even between 5 and 10 years. Shorter stays usually favour renting because of upfront and selling costs.' },
  { q: 'What house-price growth should I assume?', a: 'No one knows. UK prices have averaged roughly 3–4% a year long term, but with long flat or falling periods. Test a range including 0% and negative.' },
  { q: 'Does this account for stamp duty?', a: 'Yes, via the buying-costs percentage under Advanced options (a ~3% default covers SDLT plus legal and survey for a typical purchase). Use the Stamp Duty calculator for an exact figure.' },
];

export default function Page() {
  return (
    <>
      <FaqJsonLd faqs={FAQS} />
      <BuyVsRent />
    </>
  );
}
