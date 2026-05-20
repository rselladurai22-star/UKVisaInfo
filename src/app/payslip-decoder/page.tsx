import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import PayslipClient from './PayslipClient';

export const metadata: Metadata = {
  title: 'UK Payslip Decoder — Tax Codes, NI Categories, Deduction Acronyms Explained',
  description: 'Free UK payslip decoder. Look up every tax code (1257L, BR, 0T, K, M1), NI category letter (A, M, H, C), pension type (AE, SAC, RAS) and deduction acronym (PAYE, SL, DEA) you\'ll see on your payslip.',
  alternates: { canonical: '/payslip-decoder' },
};

export default function PayslipPage() {
  return (
    <CalcPageShell
      url="/payslip-decoder"
      eyebrow="Payslip decoder · UK · HMRC reference"
      title="Every code on your payslip, explained."
      deck="Search any UK payslip acronym — tax codes, NI category letters, pension types, deduction labels — and see exactly what HMRC means."
      verified="gov.uk/tax-codes · gov.uk/national-insurance-rates-letters"
      related={[
        { href: '/take-home-pay',       title: 'Take-home pay', desc: 'See your net broken down by tax, NI, student loan, pension.' },
        { href: '/tax-code',            title: 'Tax code decoder', desc: 'Drill into your specific tax code with a calculator.' },
        { href: '/national-insurance',  title: 'National Insurance', desc: 'Calculate NI by category letter (A, M, H, C, V…).' },
      ]}
      educational={[
        { title: 'Where to find these codes', body: 'Top of your payslip: tax code, NI category, plan numbers. Middle: the gross pay, deductions and YTD columns. Bottom: net pay paid to your bank.' },
        { title: 'Tax code wrong?', body: 'Common signs: paying too much (refund will come automatically via PAYE after HMRC updates) or paying too little (HMRC will recover later — usually painfully). Call HMRC on 0300 200 3300 with your NI number ready.' },
        { title: 'NI category wrong?', body: 'Should auto-update on your 21st / 25th birthday or on State Pension age. If it doesn\'t — speak to your payroll team. The wrong category can cost thousands a year in over-paid employee NI.' },
        { title: 'Pension type confusion', body: '"Net Pay" (NPA) and "Relief at Source" (RAS) sound similar but are opposites — NPA reduces taxable pay, RAS reduces net pay. Higher-rate taxpayers on RAS schemes must claim extra tax relief via Self Assessment.' },
        { title: 'P60 vs P45 vs P11D', body: 'P60 = annual summary issued by 31 May. P45 = leaver certificate when you change jobs. P11D = annual list of taxable benefits in kind (company car, private medical). All come from your employer.' },
        { title: 'Keep them', body: 'Keep payslips for at least 22 months after the end of the tax year (HMRC\'s minimum). Keep P60s for 6 years. Most banks now accept digital payslips for mortgage applications.' },
      ]}
    >
      <PayslipClient />
    </CalcPageShell>
  );
}
