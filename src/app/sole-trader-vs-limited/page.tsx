import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SoleVsLtdClient from './SoleVsLtdClient';

export const metadata: Metadata = {
  title: 'Sole Trader vs Limited Company UK Calculator 2026/27',
  description: 'Free comparison: sole trader vs limited company total tax in the UK. Income Tax + Class 4 NI vs Corporation Tax + dividend tax. Pick the right structure at your profit level.',
  alternates: { canonical: '/sole-trader-vs-limited' },
};

export default function SoleVsLtdPage() {
  return (
    <CalcPageShell
      url="/sole-trader-vs-limited"
      eyebrow="Business structure · UK · 2026/27"
      title="Sole trader or limited company — which keeps more?"
      deck="Enter your annual profit, choose how much salary a director would draw, and see the all-in tax bill on both sides — including Corporation Tax marginal relief and dividend tax."
      verified="gov.uk/corporation-tax-rates · gov.uk/income-tax-rates"
      related={[
        { href: '/dividend-tax',        title: 'Dividend tax',        desc: 'Drill into the dividend tax half of the limited path.' },
        { href: '/national-insurance',  title: 'National Insurance',  desc: 'Class 4 (self-employed) and Class 1 (employer) numbers.' },
        { href: '/take-home-pay',       title: 'Take-home pay',       desc: 'Compare both options against a normal PAYE salary.' },
      ]}
      educational={[
        { title: 'Sole trader path', body: 'You pay Income Tax (20% / 40% / 45%) on profit after the £12,570 Personal Allowance, plus Class 4 NI (6% / 2%) on the same profit. Class 2 NI is voluntary from April 2024.' },
        { title: 'Limited company path', body: 'The company pays Corporation Tax on profit (19% up to £50k, marginal relief £50k–£250k, 25% main rate above). You then draw the post-tax cash as a small salary + dividends.' },
        { title: 'Why a £5,000 director salary', body: 'Pitching salary at the £5,000 employer NI Secondary Threshold (from April 2025) gives the company a deductible expense and you a State Pension qualifying year — without triggering employer NI. £12,570 (the PT) is the other common pick.' },
        { title: 'Corporation Tax marginal relief', body: 'Profits between £50,000 and £250,000 get a tapered rate using HMRC\'s 3/200 fraction — effectively 26.5% marginal on the slice in that range. Above £250,000 the full 25% applies.' },
        { title: 'Dividend tax 2026/27', body: '£500 dividend allowance (taxed at 0%), then 8.75% / 33.75% / 39.35% by income band. Dividends sit ON TOP of salary, filling whichever band you\'re in.' },
        { title: 'Other factors not modelled', body: 'Pension contributions (massive for Ltd), the £108 (2025/26) IR35 / off-payroll rules, VAT thresholds, accountancy fees, and the limited liability protection of a company. This is a tax comparison only.' },
      ]}
    >
      <SoleVsLtdClient />
    </CalcPageShell>
  );
}
