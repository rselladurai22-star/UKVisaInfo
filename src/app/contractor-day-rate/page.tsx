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
      related={[
        { href: '/ir35-calculator', title: 'IR35 calculator', desc: 'How much does an inside IR35 determination actually cost you?' },
        { href: '/sole-trader-vs-limited', title: 'Sole trader vs Ltd', desc: 'Compare extraction routes for your annual profit.' },
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
