import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import RentalIncomeTaxClient from './RentalIncomeTaxClient';

export const metadata: Metadata = {
  title: 'Rental Income Tax Calculator 2025/26 — Section 24 Mortgage Interest Relief',
  description: 'UK rental income tax calculator with Section 24. See how the finance cost restriction (20% tax credit) affects higher-rate landlords. Compare old vs new system.',
  alternates: { canonical: '/rental-income-tax' },
};

export default function RentalIncomeTaxPage() {
  return (
    <CalcPageShell
      url="/rental-income-tax"
      eyebrow="Rental Income Tax · UK · 2025/26"
      title="Section 24 is costing landlords thousands. How much is it costing you?"
      deck="Since April 2020, mortgage interest is no longer tax-deductible for residential landlords. Instead you get a 20% credit. If you pay 40% tax, you're paying the difference yourself. See exactly how much."
      verified="gov.uk/guidance/restricting-finance-cost-relief-for-individual-landlords"
      sidebar={{
        keyRates: [
          { label: 'Section 24 credit rate', value: '20%', sub: 'Basic rate only — regardless of your band', accent: '#B91C1C' },
          { label: 'Higher-rate landlord net loss', value: '20%', sub: 'vs old full deduction — per £ of mortgage interest' },
          { label: 'Property Allowance', value: '£1,000', sub: 'Instead of itemising expenses' },
          { label: 'Wear & tear (furnished)', value: 'Actual costs', sub: 'Replacement of domestic items only' },
          { label: 'Basic rate (20%)', value: '£12,571–£50,270' },
          { label: 'Higher rate (40%)', value: '£50,271–£125,140' },
          { label: 'SA filing deadline', value: '31 Jan', sub: 'Rental profit on Self Assessment', accent: '#0F766E' },
        ],
        dates: [
          { date: '5 Apr 2020', desc: 'Section 24 fully phased in — no transitional relief left', urgent: false },
          { date: '31 Jan', desc: 'SA return + rental tax payment due annually', urgent: true },
          { date: '6 Apr 2025', desc: 'FHL (furnished holiday let) regime abolished', urgent: false },
        ],
        tips: [
          { heading: 'Section 24 can cause phantom profits', body: 'Even if cash flow is negative after the mortgage, you may still have a taxable profit under Section 24. Thousands of landlords are technically taxed on losses.' },
          { heading: 'Incorporation bypasses Section 24', body: 'Limited companies can still fully deduct mortgage interest. But incorporation triggers SDLT and potentially CGT — get specialist advice first.' },
          { heading: 'FHL abolished April 2025', body: 'Furnished Holiday Let status is abolished from 6 Apr 2025. Properties lose mortgage relief, capital allowances, and business asset disposal relief (10% CGT).' },
        ],
        govLink: 'gov.uk/guidance/restricting-finance-cost-relief-for-individual-landlords',
        govLabel: 'gov.uk — Section 24',
      }}
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
