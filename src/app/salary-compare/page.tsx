import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SalaryCompareClient from './SalaryCompareClient';

export const metadata: Metadata = {
  title: 'UK Salary Comparison — Equivalent Pay Between Any Two UK Cities',
  description: 'Is £60,000 in Manchester the same as £80,000 in London? Compare equivalent UK salaries across cities — accounts for HMRC tax + cost of living.',
  alternates: { canonical: '/salary-compare' },
};

export default function SalaryComparePage() {
  return (
    <CalcPageShell
      url="/salary-compare"
      eyebrow="Salary compare · UK 2026/27"
      title="What does that salary feel like in another UK city?"
      deck="Enter a gross salary and a city. We solve for the equivalent gross in any other UK city that keeps your disposable income (take-home minus city baseline costs) the same."
      verified="HMRC + ONS / city baseline"
      related={[
        { href: '/take-home-pay',     title: 'Take-home pay',      desc: 'See your net pay 2026/27.' },
        { href: '/cost-of-living-uk', title: 'Cost of living',     desc: 'Compare cities line-by-line.' },
        { href: '/postcode',          title: 'Postcode lookup',    desc: 'Council Tax, MP, NHS, more.' },
      ]}
      educational={[
        { title: 'How equivalence is defined', body: 'We compute take-home in city A using HMRC 2026/27 bands, subtract the baseline monthly cost-of-living total, and find the gross in city B that delivers the same disposable amount. The reverse direction works too.' },
        { title: 'What\'s in "baseline cost"', body: 'One-bed rent, monthly transport pass, average grocery spend, and utilities + internet + mobile. Council Tax is excluded — see our Council Tax tool — as is lifestyle spend, savings and debt.' },
        { title: 'Why London needs so much more', body: 'Rent in London is 60-100% higher than most UK cities. Even though wages there are usually higher, the cost gap means a £60k Manchester salary often needs £85-95k London-side just to maintain the same lifestyle.' },
        { title: 'Scotland is different', body: 'Scottish income tax has more bands and higher top rates. Edinburgh or Glasgow comparisons toggle to Scottish rates automatically when selected.' },
        { title: 'Not modelled', body: 'Council Tax (highly variable), childcare, partner income, leisure budget, savings rate. A high earner with no kids in Manchester might be better off than the same gross in London even before this calc.' },
        { title: 'Sources', body: 'Tax: HMRC 2026/27 published bands. Cost-of-living baselines: ONS Private Rental Index + ONS Family Spending + transport authority published prices.' },
      ]}
    >
      <SalaryCompareClient />
    </CalcPageShell>
  );
}
