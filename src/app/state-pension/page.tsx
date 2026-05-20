import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import StatePensionClient from './StatePensionClient';

export const metadata: Metadata = {
  title: 'UK State Pension Forecast — From Your NI Years (2026)',
  description: 'Free UK State Pension forecaster. Enter your National Insurance qualifying years and see your weekly, monthly and annual State Pension — plus the cost of voluntary NICs to fill gaps.',
  alternates: { canonical: '/state-pension' },
};

export default function StatePensionPage() {
  return (
    <CalcPageShell
      url="/state-pension"
      eyebrow="State Pension · UK · DWP"
      title="What will your UK State Pension be?"
      deck="Type your National Insurance qualifying years and see your forecast weekly, monthly and annual pension, plus the cost of filling any gaps."
      verified="DWP State Pension rates"
      related={[
        { href: '/pension-allowance',  title: 'Pension allowance', desc: 'How much can you contribute pre-tax?' },
        { href: '/take-home-pay',      title: 'Take-home pay',     desc: 'Net salary 2026/27.' },
        { href: '/cgt-calculator',     title: 'Capital Gains Tax', desc: '£3,000 AEA · 18%/24%.' },
      ]}
      educational={[
        { title: '35 years for the full pension', body: 'You need 35 qualifying years of National Insurance to get the full new State Pension (currently £230.25/week). The minimum to qualify at all is 10 years.' },
        { title: 'How a "qualifying year" works', body: 'A year counts if you paid enough Class 1 NI (employees), Class 2 (self-employed), or got NI credits (Universal Credit, Child Benefit for a child under 12, Carer\'s Allowance, certain illnesses). Even part-pay years can count if total earnings hit the lower threshold.' },
        { title: 'Filling gaps with Class 3', body: 'Voluntary Class 3 NIC costs about £907 per missing year (at the 2024/25 rate of £17.45/week). Each filled year adds ~£342/year of pension — break-even after roughly 2 years and 8 months of receipt. Usually a no-brainer if you have under 35 years.' },
        { title: 'Deadlines for filling gaps', body: 'Normally you can only fill the last 6 tax years. A special extension allowed filling back to 2006 for men born after 5 April 1951 and women born after 5 April 1953 — that window closed on 5 April 2025. Check your gaps urgently if uncertain.' },
        { title: 'Where to check officially', body: 'gov.uk/check-state-pension shows your forecast and a year-by-year NI record. You\'ll need a Government Gateway login. Always rely on that for actual figures; this tool is for planning.' },
        { title: 'Triple Lock', body: 'The State Pension rises each April by the highest of: CPI, average earnings growth, or 2.5%. The 2025/26 increase was 4.1% (driven by earnings).' },
      ]}
    >
      <StatePensionClient />
    </CalcPageShell>
  );
}
