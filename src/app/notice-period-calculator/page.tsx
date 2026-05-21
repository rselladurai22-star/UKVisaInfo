import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import NoticePeriodClient from './NoticePeriodClient';

export const metadata: Metadata = {
  title: 'Notice Period Calculator 2025 — Statutory Notice, PILON, Garden Leave',
  description: 'UK notice period calculator. Calculate statutory minimum notice (1 week per year, max 12), PILON tax, and garden leave. Compare contractual vs statutory notice for any length of service.',
  alternates: { canonical: '/notice-period-calculator' },
};

export default function NoticePeriodPage() {
  return (
    <CalcPageShell
      url="/notice-period-calculator"
      eyebrow="Notice Period · UK Employment Law"
      title="How much notice are you owed — and what&rsquo;s the tax on PILON?"
      deck="Statutory minimum is 1 week per year of service, up to 12 weeks. But PILON is fully taxable since 2018. Enter your details to see the gross and net payment in lieu, or how long garden leave runs."
      verified="gov.uk/notice-period"
      related={[
        { href: '/redundancy-pay', title: 'Redundancy pay', desc: 'Statutory redundancy pay — separate from notice pay.' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Estimate net pay during your working notice period.' },
        { href: '/minimum-wage-checker', title: 'Minimum wage checker', desc: 'Ensure notice pay does not breach NMW.' },
      ]}
      educational={[
        { title: 'Statutory minimum notice', body: 'Under the Employment Rights Act 1996: the employer must give at least 1 week\'s notice for each complete year of service, minimum 1 week, maximum 12 weeks. Once you have worked for at least 1 month, the minimum applies.' },
        { title: 'Contractual notice', body: 'Your contract may specify a longer notice period — e.g. 3 months for a senior role. If contractual notice exceeds the statutory minimum, the contractual period applies. The calculator uses whichever is higher.' },
        { title: 'PILON — Payment In Lieu Of Notice', body: 'Since April 2018, all PILON payments are taxable as employment income, subject to Income Tax and National Insurance. There is no longer a tax-free element for the notice portion (unlike the £30,000 exemption for redundancy payments).' },
        { title: 'Garden leave', body: 'The employee remains employed and on payroll but does not attend work (often to protect commercial interests or client relationships). Full salary continues — no PILON tax implications arise since it\'s regular employment income.' },
        { title: 'Employee notice to employer', body: 'The statutory minimum an employee must give is 1 week (once past 1 month\'s service), regardless of length of service. Your contract may require more — check your contract carefully before resigning.' },
      ]}
    >
      <NoticePeriodClient />
    </CalcPageShell>
  );
}
