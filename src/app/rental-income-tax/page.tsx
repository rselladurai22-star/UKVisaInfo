import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import RentalIncomeTaxClient from './RentalIncomeTaxClient';

export const metadata: Metadata = {
  title: 'Rental Income Tax Calculator 2025/26 — Section 24 Mortgage Interest Relief',
  description: 'UK rental income tax calculator with Section 24. See how the finance cost restriction (20% tax credit) affects higher-rate landlords. Compare old vs new system — instantly shows Section 24 impact.',
  alternates: { canonical: '/rental-income-tax' },
};

export default function RentalIncomeTaxPage() {
  return (
    <CalcPageShell
      url="/rental-income-tax"
      eyebrow="Rental Income Tax · UK · 2025/26"
      title="Section 24 is costing landlords thousands. How much is it costing you?"
      deck="Since April 2020, mortgage interest is no longer tax-deductible for residential landlords. Instead you get a 20% credit. If you pay 40% tax, you&rsquo;re paying the difference yourself. See exactly how much."
      verified="gov.uk/guidance/restricting-finance-cost-relief-for-individual-landlords"
      related={[
        { href: '/rental-yield-calculator', title: 'Rental yield', desc: 'Gross and net yield + BTL mortgage ICR check.' },
        { href: '/self-assessment-calculator', title: 'Self Assessment estimator', desc: 'Rental profit feeds into your SA bill.' },
        { href: '/property-cgt-calculator', title: 'Property CGT', desc: 'Tax when you eventually sell the property.' },
      ]}
      educational={[
        { title: 'What changed with Section 24?', body: 'Before April 2020, landlords could deduct mortgage interest from rental income before calculating tax — just like any other business expense. Section 24 replaced this with a 20% tax credit, fully phased in by April 2020.' },
        { title: 'Why higher-rate taxpayers are hit hardest', body: 'A higher-rate landlord (40% tax) with £10,000 mortgage interest used to save £4,000 in tax (40% of £10,000). Now they get a £2,000 credit (20% of £10,000), paying £2,000 more tax on the same mortgage costs.' },
        { title: 'What is still deductible?', body: 'Letting agent fees, property management, insurance, repairs and maintenance, ground rent and service charges, accountancy, and some legal fees. Capital improvements (adding value) are not revenue expenses — they reduce CGT on sale.' },
        { title: 'Property Allowance', body: 'Instead of itemising expenses, landlords with low rental income can claim the £1,000 Property Allowance. Useful if total allowable expenses are below £1,000 and administration isn\'t worth the effort.' },
        { title: 'Incorporation considerations', body: 'Moving properties into a limited company bypasses Section 24 — companies can still fully deduct mortgage interest. However, incorporation triggers SDLT and potentially CGT. Take specialist advice before incorporating.' },
      ]}
    >
      <RentalIncomeTaxClient />
    </CalcPageShell>
  );
}
