import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MileageClient from './MileageClient';

export const metadata: Metadata = {
  title: 'Mileage Expense Calculator 2025/26 — AMAP 45p/25p, HMRC Approved Rates',
  description: 'UK HMRC mileage calculator. Calculate your AMAP entitlement — 45p per mile (first 10,000), 25p after. Cars, motorcycles, bicycles. Claim the shortfall via Self Assessment.',
  alternates: { canonical: '/mileage-expense-calculator' },
};

export default function MileagePage() {
  return (
    <CalcPageShell
      url="/mileage-expense-calculator"
      eyebrow="AMAP Mileage · UK · 2025/26 HMRC rates"
      title="Are you getting the full 45p per mile you're entitled to?"
      deck="HMRC's Approved Mileage Allowance Payments cover fuel, wear & tear, insurance and depreciation — at 45p per mile for the first 10,000 and 25p after. If your employer pays less, you can claim the difference."
      verified="gov.uk/expenses-and-benefits-business-travel-mileage"
      sidebar={{
        keyRates: [
          { label: 'Car / van (first 10,000 mi)', value: '45p/mi', accent: '#0F766E' },
          { label: 'Car / van (above 10,000 mi)', value: '25p/mi' },
          { label: 'Motorcycle', value: '24p/mi' },
          { label: 'Bicycle', value: '20p/mi' },
          { label: 'Passenger supplement', value: '5p/mi', sub: 'Per passenger carried on business' },
          { label: 'EV advisory rate', value: '9p/mi', sub: 'Company-owned EV (electricity only)' },
          { label: 'Max MAR relief rate', value: '40% / 45%', sub: 'At your marginal IT rate' },
        ],
        dates: [
          { date: '5 Oct', desc: 'Register for SA if claiming >£2,500 mileage shortfall', urgent: false },
          { date: '31 Jan', desc: 'Claim mileage via SA if not reimbursed by employer', urgent: true },
          { date: 'P87', desc: 'Small claims (<£2,500) can use P87 form instead of SA', urgent: false },
        ],
        tips: [
          { heading: 'Keep a mileage log', body: 'HMRC requires a contemporaneous record: date, purpose, origin, destination, miles. A GPS app (e.g. TripLog, MileIQ) is ideal evidence.' },
          { heading: 'Employer can pay tax-free up to AMAP', body: 'Employers can pay up to the AMAP rate tax-free. Any excess is taxable — report it on your P11D and SA.' },
          { heading: 'EV owners still claim AMAP', body: 'If you own an EV privately and use it for work, you claim at 45p/mi (first 10k) — not the 9p AER, which only applies to company-owned vehicles.' },
        ],
        govLink: 'gov.uk/expenses-and-benefits-business-travel-mileage',
        govLabel: 'gov.uk — Mileage allowances',
      }}
      related={[
        { href: '/self-assessment-calculator', title: 'Self Assessment estimator', desc: 'Claim mileage shortfalls through your SA return.' },
        { href: '/company-car-tax', title: 'Company car tax', desc: 'Compare owning your car vs a company car.' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See overall net income picture.' },
      ]}
      educational={[
        { title: 'AMAP rates (unchanged since 2011)', body: 'Cars and vans: 45p for the first 10,000 business miles per tax year, 25p per mile after. Motorcycles: 24p per mile. Bicycles: 20p per mile. These cover all costs — fuel, insurance, depreciation, servicing — not just petrol.' },
        { title: 'Passenger rate', body: 'If you carry a fellow employee on a business journey, you can claim an additional 5p per mile per passenger. This is claimed by the driver, not the passengers.' },
        { title: 'Claiming the shortfall', body: 'If your employer pays less than AMAP, you can claim tax relief on the difference via Self Assessment (or a P87 form if your employer can\'t use payroll). Relief is at your marginal Income Tax rate — not NI.' },
        { title: 'Excess is taxable', body: 'If your employer pays MORE than AMAP, the excess is taxable employment income and is subject to both Income Tax and National Insurance.' },
        { title: 'EV note', body: 'AMAP rates apply regardless of fuel type — including electric vehicles you own. Company-owned EVs use the separate Advisory Electric Rate (AER) currently 9p/mile, which covers electricity only.' },
      ]}
    >
      <MileageClient />
    </CalcPageShell>
  );
}
