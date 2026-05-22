import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import RentalYieldClient from './RentalYieldClient';

export const metadata: Metadata = {
  title: 'Rental Yield Calculator 2025/26 — Gross & Net Yield + BTL ICR Check',
  description: 'UK rental yield calculator. Calculate gross and net rental yield, and check if your buy-to-let passes the lender ICR stress test (125% / 145%). Enter property price, rent, and costs.',
  alternates: { canonical: '/rental-yield-calculator' },
};

export default function RentalYieldPage() {
  return (
    <CalcPageShell
      url="/rental-yield-calculator"
      eyebrow="Rental Yield · UK · 2025/26"
      title="Will that buy-to-let actually stack up?"
      deck="Gross yield ignores costs. Net yield ignores the mortgage stress test. Enter price, rent, costs and your BTL mortgage — and see whether the lender's ICR check passes before you commit."
      verified="gov.uk/guidance/income-tax-when-you-rent-out-a-property"
      sidebar={{
        keyRates: [
          { label: 'ICR basic-rate taxpayer', value: '125%', sub: 'Rent must cover 125% of stressed interest', accent: '#0F766E' },
          { label: 'ICR higher-rate taxpayer', value: '145%', sub: 'Rent must cover 145% of stressed interest', accent: '#B45309' },
          { label: 'Stress test rate (typical)', value: 'Pay rate +2%', sub: 'Minimum 5.5% — whichever is higher' },
          { label: 'SDLT surcharge (BTL)', value: '+5%', sub: 'On top of standard SDLT (2025)' },
          { label: 'SDLT threshold', value: '£125,000', sub: 'Nil rate band — standard' },
          { label: 'Typical gross yield target', value: '5–7%', sub: 'UK average ~4.9% (2024)' },
        ],
        dates: [
          { date: '6 Apr 2025', desc: 'FHL abolished — holiday lets lose favourable treatment', urgent: false },
          { date: '14 days', desc: 'SDLT payment window after completion', urgent: false },
          { date: '31 Jan', desc: 'SA rental income return deadline', urgent: true },
        ],
        tips: [
          { heading: 'Net yield is what matters', body: 'Gross yield looks attractive but ignores agent fees (8–12%), insurance, maintenance reserve (1% of value p.a.), and void periods. Always model net yield.' },
          { heading: 'ICR check before you offer', body: 'If the rent does not cover 125% (or 145%) of stressed interest payments, a BTL lender will not offer a mortgage — regardless of your income or deposit.' },
          { heading: 'Budget for 2–4 weeks void', body: 'Even good tenants have gaps. Model 3.8%–7.7% of annual rent as void allowance to get a realistic net yield figure.' },
        ],
        govLink: 'gov.uk/guidance/income-tax-when-you-rent-out-a-property',
        govLabel: 'gov.uk — Rental income tax',
      }}
      related={[
        { href: '/rental-income-tax', title: 'Rental income tax', desc: 'Section 24 detailed tax on your rental profit.' },
        { href: '/property-cgt-calculator', title: 'Property CGT', desc: 'Tax when you sell.' },
        { href: '/overpayment-mortgage', title: 'Mortgage overpayment', desc: 'Reducing the BTL mortgage and interest costs.' },
      ]}
      educational={[
        { title: 'Gross yield vs net yield', body: 'Gross yield = annual rent / purchase price × 100. Net yield deducts letting agent fees, insurance, maintenance, and void periods before dividing. A 7% gross yield might only be 4–5% net once running costs are included.' },
        { title: 'BTL mortgage ICR stress test', body: 'Most buy-to-let lenders require rental income to cover the monthly interest payment at a stressed rate (typically your pay rate + 2%, minimum 5.5%) by 125% for basic-rate taxpayers or 145% for higher-rate taxpayers.' },
        { title: 'Why 145% for higher-rate taxpayers?', body: 'Section 24 means higher-rate landlords face a larger effective tax bill on the same mortgage costs. Lenders account for this by requiring a higher coverage ratio to ensure you can still service the debt after tax.' },
        { title: 'Maximum borrowable', body: 'This calculator shows the maximum amount you could borrow against the rent — based on the ICR threshold and stressed rate. Use it to quickly check if a target LTV is achievable at a given rent level.' },
        { title: 'Void periods', body: 'Budget for 2–4 weeks of void per year (3.8–7.7% of annual rent) when estimating net yield and ICR. Insurance policies for rent guarantee cover void and tenant default — worth factoring into your costs.' },
      ]}
    >
      <RentalYieldClient />
    </CalcPageShell>
  );
}
