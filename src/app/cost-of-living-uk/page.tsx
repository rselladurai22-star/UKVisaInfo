import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import CityCompareClient from './CityCompareClient';

export const metadata: Metadata = {
  title: 'UK Cost of Living Comparison 2026 — Side-by-Side City Costs',
  description: 'Compare monthly cost of living between any two UK cities. Rent, transport, groceries and utilities side-by-side. Includes London, Manchester, Birmingham, Edinburgh and more.',
  alternates: { canonical: '/cost-of-living-uk' },
};

export default function CostOfLivingPage() {
  return (
    <CalcPageShell
      url="/cost-of-living-uk"
      eyebrow="Cost of Living · UK 2026"
      title="Compare any two UK cities, side by side."
      deck="See exactly how monthly rent, transport, groceries and utilities differ between UK cities — sourced from ONS, transport authorities and rental data."
      verified="ONS · transport authority · rental data"
      related={[
        { href: '/take-home-pay',          title: 'Take-home pay',          desc: 'Net salary to match against city costs.' },
        { href: '/mortgage-affordability', title: 'Mortgage affordability', desc: 'What you can buy in each market.' },
        { href: '/postcode',               title: 'Postcode lookup',        desc: 'Council, MP, NHS — for any UK postcode.' },
      ]}
      educational={[
        { title: 'Where the figures come from', body: 'Rent averages combine ONS Private Rental Index with Zoopla / Rightmove published medians. Transport from TfL, GMCA, WMCA and regional operators. Groceries and utilities from ONS Family Spending Survey.' },
        { title: 'What\'s included',              body: 'A "single adult" baseline: one-bed flat rent, monthly transport pass, average grocery spend, gas + electric + broadband + mobile. Council Tax is calculated separately — see our Council Tax band tool.' },
        { title: 'What\'s NOT included',          body: 'Council Tax (highly variable by band and council), TV licence, leisure, eating out, holidays, savings, debt repayment. Add ~£200-£500/month for a realistic full budget.' },
        { title: 'Adjust for family size',        body: 'For a couple sharing rent: roughly +30% to total. For a family of 4: roughly +90% to total + £400-£800 childcare per child.' },
        { title: 'Why London is the outlier',    body: 'London rents 60-100% higher than most UK cities. Transport is uniquely capped via TfL contactless. Council Tax can actually be LOWER than smaller cities. Net effect: monthly costs are still typically 40-60% higher than regional UK.' },
        { title: 'When comparing for relocation', body: 'Pair this tool with our Mortgage Affordability and Take-Home Pay calculators to map out total budget reality before committing to a move.' },
      ]}
    >
      <CityCompareClient />
    </CalcPageShell>
  );
}
