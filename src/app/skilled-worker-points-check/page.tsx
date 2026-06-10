import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SkilledWorkerClient from './SkilledWorkerClient';

export const metadata: Metadata = {
  title: 'Skilled Worker Visa Points Calculator 2024 — 70-Point Check UK',
  description: 'UK Skilled Worker visa 70-point eligibility checker. Verify sponsor, skill level, English, and salary requirements including shortage occupation and new entrant routes. Updated April 2024 thresholds.',
  alternates: { canonical: '/skilled-worker-points-check' },
};

export default function SkilledWorkerPage() {
  return (
    <CalcPageShell
      url="/skilled-worker-points-check"
      eyebrow="Skilled Worker Visa · UK · 2024 rules"
      title="Do you have the 70 points for a Skilled Worker visa?"
      deck="Sponsor, skill level, English language and salary — all checked against the April 2024 thresholds (£38,700 general, £30,960 shortage, £23,220 new entrant). See your score and any gap instantly."
      verified="gov.uk/skilled-worker-visa/your-job"
      related={[
        { href: '/ihs-calculator', title: 'IHS calculator', desc: 'Calculate the Immigration Health Surcharge for your visa.' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'See your net salary at the UK threshold levels.' },
        { href: '/national-insurance', title: 'National Insurance', desc: 'Understand UK payroll deductions once you start work.' },
      ]}
      educational={[
        { title: '70 points — what you need', body: 'All three mandatory criteria are required: approved sponsor (20 pts), RQF 3+ skill level (20 pts), English language B1+ (10 pts). The remaining 20 tradeable points must come from meeting the salary threshold or using a tradeable route.' },
        { title: 'General salary threshold', body: 'From 4 April 2024: £38,700 per year OR the "going rate" for your specific occupation (Standard Occupational Classification code) — whichever is higher. This replaced the old £26,200 threshold.' },
        { title: 'Shortage occupations', body: 'Jobs on the Immigration Salary List (formerly Shortage Occupation List) have a reduced threshold: 80% of the going rate (minimum £30,960). HMRC updates this list periodically — check the latest MAC recommendations.' },
        { title: 'New entrant route', body: 'If you are under 26, switching from a Student visa, a graduate trainee, or in a recognised shortage occupation, you can qualify with a lower salary: £23,220 or 70% of the going rate (whichever is higher). This pathway lasts a maximum of 4 years.' },
        { title: 'PhD tradeable points', body: 'A relevant PhD adds 10 tradeable points; a STEM PhD adds 20 points. These are in addition to salary points — useful if your salary is borderline but you hold a qualifying doctorate.' },
      ]}
    >
      <SkilledWorkerClient />
    </CalcPageShell>
  );
}
