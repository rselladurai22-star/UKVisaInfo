import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MortgageClient from './MortgageClient';

export const metadata: Metadata = {
  title: 'UK Mortgage Affordability Calculator 2026 — How Much Can You Borrow?',
  description: 'Free UK mortgage calculator. Enter income, deposit, outgoings and term to see maximum borrowing, max property price, monthly repayment and FCA stress test at +3%.',
  alternates: { canonical: '/mortgage-affordability' },
};

export default function MortgagePage() {
  return (
    <CalcPageShell
      eyebrow="Mortgage · UK 2026"
      title="How much could you borrow?"
      deck="See your maximum mortgage, the property price it unlocks, monthly repayment, and how a +3% rate rise would change the picture."
      verified="FCA stress-test rules"
      related={[
        { href: '/stamp-duty-calculator', title: 'Stamp Duty calculator', desc: 'SDLT on your purchase — FTB relief & surcharges included.' },
        { href: '/take-home-pay',         title: 'Take-home pay',         desc: 'See your real net income before applying.' },
        { href: '/council-tax-band',      title: 'Council Tax band',      desc: 'Estimate annual bill for any UK postcode.' },
      ]}
      educational={[
        { title: 'Income multiple', body: 'Mainstream UK lenders typically cap borrowing at 4.5× annual gross income (combined for joint applications). A few specialist lenders go to 5–5.5× for high earners or specific professions.' },
        { title: 'Outgoings deduction', body: 'Existing credit card balances, personal loans and car finance reduce borrowing capacity. Lenders subtract roughly 60× the monthly outgoing from the income-based maximum.' },
        { title: 'Stress test (+3%)', body: 'Since 2014 (FCA Mortgage Market Review) lenders must check you can afford repayments if rates rose ~3% above the product rate. The Bank of England removed the formal requirement in Aug 2022 but most lenders still apply it.' },
        { title: 'Loan-to-Value (LTV)', body: 'Your deposit as a % of the property price. 95% LTV is the typical max; better rates are available at 90%, 85%, 80%, 75% and 60% bands. A 25% deposit (75% LTV) usually gets meaningfully cheaper rates.' },
        { title: 'Term length', body: 'Standard UK term is 25 years but 30, 35, and even 40 are increasingly common. Longer terms lower the monthly payment but increase total interest paid significantly.' },
        { title: 'What this doesn\'t include', body: 'Credit score, income type (PAYE vs self-employed), bonus reliability, recent credit defaults, property type (BTL, new-build, leasehold) — all affect what lenders will actually offer. Always get a broker Decision in Principle.' },
      ]}
    >
      <MortgageClient />
    </CalcPageShell>
  );
}
