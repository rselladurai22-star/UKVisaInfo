import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MinimumWageClient from './MinimumWageClient';

export const metadata: Metadata = {
  title: 'Minimum Wage Checker 2025 — NLW £12.21, 18-20 £10.00, Under 18 £7.55',
  description: 'UK National Minimum Wage checker April 2025. NLW £12.21/hr (21+), £10.00 (18-20), £7.55 (under 18 and apprentices). Check if your pay is compliant and see the annual shortfall.',
  alternates: { canonical: '/minimum-wage-checker' },
};

export default function MinimumWagePage() {
  return (
    <CalcPageShell
      url="/minimum-wage-checker"
      eyebrow="National Minimum Wage · UK · April 2025"
      title="Is your pay above the legal minimum?"
      deck="From April 2025: £12.21 for workers aged 21 and over, £10.00 for 18&ndash;20, and £7.55 for under-18s and apprentices. Enter your age, hours, and hourly rate — get an instant compliance check."
      verified="gov.uk/national-minimum-wage-rates"
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See net pay at minimum wage levels.' },
        { href: '/notice-period-calculator', title: 'Notice period', desc: 'Notice pay cannot breach minimum wage either.' },
        { href: '/redundancy-pay', title: 'Redundancy pay', desc: 'Statutory redundancy uses a week\'s pay capped at £719.' },
      ]}
      educational={[
        { title: 'Rates from 1 April 2025', body: 'National Living Wage (21+): £12.21/hour. Ages 18–20: £10.00/hour. Under 18 (above school leaving age): £7.55/hour. Apprentices under 19, or 19+ in first year of apprenticeship: £7.55/hour.' },
        { title: 'Who does NMW apply to?', body: 'Almost all workers including agency workers, home workers, agricultural workers, and casual workers. It does NOT apply to genuinely self-employed individuals, volunteers, family workers in a family business living in the family home, or workers below school-leaving age.' },
        { title: 'What counts as pay?', body: 'Basic pay, shift premium, incentive pay. What does NOT count: tips/gratuities, employer pension contributions, or premium payments for overtime hours (only the base rate counts for NMW purposes).' },
        { title: 'Reporting underpayment', body: 'If you believe you are being underpaid, you can report to HMRC via the National Minimum Wage helpline or acas.org.uk. Employers face penalties of up to 200% of underpayment plus public "naming and shaming" on gov.uk.' },
        { title: 'Salary sacrifice and NMW', body: 'Salary sacrifice cannot reduce effective pay below NMW. If a sacrifice would breach the minimum, it must be refused or limited — this is a common issue when employees on minimum wage want to join pension salary sacrifice schemes.' },
      ]}
    >
      <MinimumWageClient />
    </CalcPageShell>
  );
}
