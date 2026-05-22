import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import RedundancyClient from './RedundancyClient';
import { WEEKLY_CAP, WEEKLY_CAP_FROM, TAX_FREE_CAP } from '../../lib/redundancy/calc';

export const metadata: Metadata = {
  title: 'UK Redundancy Pay Calculator — Statutory Entitlement by Age & Service',
  description: `Free UK statutory redundancy pay calculator. Enter your age, years of service and weekly pay — instantly see your entitlement using gov.uk's age-banded formula. £${WEEKLY_CAP}/week cap from ${WEEKLY_CAP_FROM}.`,
  alternates: { canonical: '/redundancy-pay' },
};

export default function RedundancyPage() {
  return (
    <CalcPageShell
      url="/redundancy-pay"
      eyebrow={`Statutory Redundancy · Cap £${WEEKLY_CAP}/week from ${WEEKLY_CAP_FROM}`}
      title="What you’re owed if you’re made redundant."
      deck="The statutory formula in plain English: age band × years of service × capped weekly pay. See your entitlement broken down year-by-year."
      verified="gov.uk/calculate-your-redundancy-pay"
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See your normal monthly net pay for context.' },
        { href: '/sick-pay',      title: 'Statutory Sick Pay', desc: 'If you\'re ill while serving notice or after.' },
        { href: '/maternity-pay', title: 'Maternity / Paternity', desc: 'Other statutory pay rights employers must honour.' },
      ]}
      educational={[
        { title: 'Age bands', body: 'For each complete year of service: 0.5 week if you were under 22 that year, 1 week aged 22–40, 1.5 weeks if 41 or older. The calculator walks back from your age at dismissal.' },
        { title: 'Service cap', body: 'Only the last 20 years of service count toward statutory redundancy pay — even if you\'ve been there longer.' },
        { title: 'Weekly pay cap', body: `Your "week\'s pay" is capped at the statutory limit (£${WEEKLY_CAP} from ${WEEKLY_CAP_FROM}). Higher earners often receive contractual enhanced redundancy on top.` },
        { title: 'Tax-free', body: `Statutory and enhanced redundancy pay is tax- and NI-free up to £${TAX_FREE_CAP.toLocaleString()}. Anything above is taxed as normal earnings via PAYE.` },
        { title: 'Notice & holiday', body: 'Statutory notice pay and accrued unused holiday are SEPARATE from redundancy pay. Notice is at least 1 week per year of service (capped at 12 weeks).' },
        { title: 'When you qualify', body: 'You need at least 2 years\' continuous service with the same employer. Agency workers, casuals and most contractors don\'t qualify for statutory redundancy.' },
      ]}
    >
      <RedundancyClient />
    </CalcPageShell>
  );
}
