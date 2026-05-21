import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import PensionDrawdownClient from './PensionDrawdownClient';

export const metadata: Metadata = {
  title: 'Pension Drawdown Calculator 2025/26 — How Long Will Your Pot Last?',
  description: 'UK pension drawdown calculator. Enter pot size, annual withdrawal and growth rate to see how many years your pension lasts. Includes 25% tax-free lump sum (max £268,275) and Income Tax on withdrawals.',
  alternates: { canonical: '/pension-drawdown-calculator' },
};

export default function PensionDrawdownPage() {
  return (
    <CalcPageShell
      url="/pension-drawdown-calculator"
      eyebrow="Pension Drawdown · UK · 2025/26"
      title="How long will your pension pot actually last?"
      deck="Take your 25% tax-free lump sum, choose a withdrawal level, set an assumed growth rate — and see the year-by-year projection. Find the sustainable withdrawal rate before the pot runs dry."
      verified="gov.uk/tax-on-pension"
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Compare pension income against employment income.' },
        { href: '/isa-calculator', title: 'ISA calculator', desc: 'Complement your pension with ISA savings.' },
        { href: '/salary-sacrifice-calculator', title: 'Salary sacrifice', desc: 'Build your pension pot more efficiently before retirement.' },
      ]}
      educational={[
        { title: '25% tax-free lump sum', body: 'You can take up to 25% of your pension pot (the Pension Commencement Lump Sum) completely free of tax. From April 2024, the maximum tax-free amount is £268,275 (the Lump Sum Allowance). Any PCLS above this is taxed as income.' },
        { title: 'Tax on drawdown withdrawals', body: 'Money drawn from the remaining 75% of your pot is taxable as pension income — added to your other income in that year and taxed under PAYE. If you also receive a State Pension or employment income, those stack underneath and push your drawdown into higher bands.' },
        { title: 'Sustainable withdrawal rate', body: 'Financial planners often cite the "4% rule" (from Trinity Study) — withdrawing 4% per year from a diversified portfolio has historically lasted 30 years. At lower real returns or higher withdrawals, the pot depletes faster. Use the calculator to find your specific crossover point.' },
        { title: 'Sequence of returns risk', body: 'Poor market returns early in drawdown are much more damaging than poor returns late — because you are selling units at low prices to fund withdrawals. This calculator uses a flat annual growth rate; real-world returns are lumpy and sequence matters.' },
        { title: 'State Pension interaction', body: 'Include State Pension (£11,502/year in 2025/26 for a full record) as other income — it stacks underneath your pension withdrawals and uses up your Personal Allowance, meaning pension withdrawals get taxed sooner. Use this calculator\'s "other income" field for this.' },
      ]}
    >
      <PensionDrawdownClient />
    </CalcPageShell>
  );
}
