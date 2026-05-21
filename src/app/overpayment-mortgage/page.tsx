import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MortgageOverpaymentClient from './MortgageOverpaymentClient';

export const metadata: Metadata = {
  title: 'Mortgage Overpayment Calculator 2025 — Interest Saved & Years Cut',
  description: 'UK mortgage overpayment calculator. Enter your balance, rate, and extra monthly payment to see exactly how much interest you save and how many years you cut off your mortgage.',
  alternates: { canonical: '/overpayment-mortgage' },
};

export default function MortgageOverpaymentPage() {
  return (
    <CalcPageShell
      url="/overpayment-mortgage"
      eyebrow="Mortgage Overpayment · UK"
      title="An extra £100 a month. How much does it actually save?"
      deck="Small overpayments compound dramatically over a 25-year mortgage. See exactly how many months you cut off and how much interest you save — instantly."
      verified="gov.uk/mortgages"
      related={[
        { href: '/rental-yield-calculator', title: 'Rental yield', desc: 'Check if your BTL mortgage still stacks up after overpayments.' },
        { href: '/isa-calculator', title: 'ISA calculator', desc: 'Compare overpaying your mortgage vs investing in a Stocks & Shares ISA.' },
        { href: '/lifetime-isa-calculator', title: 'Lifetime ISA', desc: 'First-time buyers — LISA bonus vs overpaying your mortgage.' },
      ]}
      educational={[
        { title: 'How overpayments work', body: 'A standard repayment mortgage calculates interest on the outstanding balance each month. Overpayments reduce the balance faster, so each subsequent month\'s interest charge is smaller — the savings compound over time.' },
        { title: 'Early Repayment Charges (ERCs)', body: 'Most fixed-rate mortgages allow overpayments of up to 10% of the outstanding balance per year without an ERC. Check your specific terms — if you overpay more, the lender may charge a percentage of the excess (typically 1–5%).' },
        { title: 'Overpay vs invest', body: 'Overpaying your mortgage earns a guaranteed return equal to your mortgage rate (e.g. 5%). A Stocks & Shares ISA might return 6–8% long-term but with more risk. If your mortgage rate is high, overpaying is often the better guaranteed option.' },
        { title: 'Term vs payment reduction', body: 'Some lenders reduce your remaining term (keeping the same monthly payment). Others keep the term the same and reduce your monthly payment. The total interest saving is identical — but reducing the term is usually better for building equity faster.' },
      ]}
    >
      <MortgageOverpaymentClient />
    </CalcPageShell>
  );
}
