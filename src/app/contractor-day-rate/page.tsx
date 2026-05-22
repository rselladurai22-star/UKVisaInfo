import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import ContractorDayRateClient from './ContractorDayRateClient';

export const metadata: Metadata = {
  title: 'Contractor Day Rate Calculator 2025/26 — Equivalent Permanent Salary',
  description: 'UK contractor day rate calculator. Convert your daily rate to an equivalent permanent salary — accounting for holiday, sick pay, employer NI and pension contributions that employers cover.',
  alternates: { canonical: '/contractor-day-rate' },
};

export default function ContractorDayRatePage() {
  return (
    <CalcPageShell
      url="/contractor-day-rate"
      eyebrow="Contractor Day Rate · UK · 2025/26"
      title="What permanent salary is your day rate really worth?"
      deck="Contractors bear costs that employers cover for permanent staff: holiday, sick pay, pension, employer NI, professional fees. Strip those out and see what your day rate actually equates to."
      verified="gov.uk/income-tax-rates"
      sidebar={{
        keyRates: [
          { label: 'Corporation Tax', value: '25%', sub: 'Profits > £250k (marginal relief below)' },
          { label: 'Corp Tax (small profits)', value: '19%', sub: 'Profits ≤ £50,000' },
          { label: 'Dividend allowance', value: '£500', sub: '2025/26' },
          { label: 'Dividend tax (basic)', value: '8.75%', sub: 'After allowance' },
          { label: 'Dividend tax (higher)', value: '33.75%', sub: 'After allowance' },
          { label: 'Employer NI', value: '15%', sub: 'On salary above £5,000' },
          { label: 'Optimum director salary', value: '£12,570', sub: 'Full PA use, no ee NI if sole emp.' },
        ],
        dates: [
          { date: '5 Apr', desc: 'Ltd company year-end (if using fiscal year)', urgent: false },
          { date: '9 months', desc: 'Accounts filing deadline after year-end', urgent: false },
          { date: '9 months +1', desc: 'Corporation Tax payment deadline', urgent: true },
          { date: '6 Apr', desc: 'New IR35 off-payroll rules apply to new engagements', urgent: false },
        ],
        tips: [
          { heading: 'Budget for void periods', body: 'Most contractors realistically bill 200–230 days per year after holidays, bank holidays, admin, and gap periods between contracts.' },
          { heading: 'Business costs reduce CT', body: 'Accountancy, PI insurance, software, and professional memberships are allowable limited company expenses — reducing the Corp Tax base.' },
          { heading: 'IR35 risk first', body: 'Check IR35 status before calculating Ltd route savings. If inside IR35 the Ltd company offers little advantage over umbrella/PAYE.' },
        ],
        govLink: 'gov.uk/working-through-limited-company',
        govLabel: 'gov.uk — Working via Ltd co.',
      }}
      related={[
        { href: '/ir35-calculator', title: 'IR35 calculator', desc: 'How much does an inside IR35 determination actually cost you?' },
        { href: '/self-assessment-calculator', title: 'Self Assessment', desc: 'Dividend income goes on your SA return.' },
        { href: '/dividend-tax', title: 'Dividend tax', desc: 'Understand the dividend rates used in the Ltd calculation.' },
      ]}
      educational={[
        { title: 'Why the multiplier matters', body: 'A permanent employee on £80,000 costs their employer roughly £92,000 (salary + employer NI). Add pension contributions and the employer cost can exceed £95,000. As a contractor charging £400/day on 224 days = £89,600 gross — which looks similar but includes no holiday, sick pay, or employer benefits.' },
        { title: 'Billable days', body: 'A calendar year has 260 working days. Subtract 28 days statutory holiday, 8 bank holidays, and any admin/business development time. Most contractors realistically bill 200–230 days per year.' },
        { title: 'Business costs', body: 'Accountancy fees (£1,200–£2,500/year), professional indemnity insurance (£500–£2,000), public liability, IR35 contract review, and software all reduce take-home. Input them here for an accurate net figure.' },
        { title: 'Ltd vs sole trader', body: 'Using a limited company with a low director\'s salary (£5,000 or £12,570) and dividend extraction is usually the most tax-efficient route for contractors earning above £30,000 profit.' },
      ]}
    >
      <ContractorDayRateClient />
    </CalcPageShell>
  );
}
