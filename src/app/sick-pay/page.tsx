import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import SspClient from './SspClient';
import { SSP_WEEKLY, LEL_WEEKLY, WAITING_DAYS, MAX_WEEKS, RATES_TAX_YEAR } from '../../lib/ssp/calc';

export const metadata: Metadata = {
  title: 'UK Statutory Sick Pay (SSP) Calculator 2025/26',
  description: `Free UK Statutory Sick Pay calculator. £${SSP_WEEKLY}/week for up to ${MAX_WEEKS} weeks, after 3 unpaid waiting days. Eligibility from the £${LEL_WEEKLY}/week Lower Earnings Limit.`,
  alternates: { canonical: '/sick-pay' },
};

export default function SspPage() {
  return (
    <CalcPageShell
      url="/sick-pay"
      eyebrow={`Statutory Sick Pay · ${RATES_TAX_YEAR}`}
      title="What you get when you\u2019re off sick."
      deck={`£${SSP_WEEKLY}/week, paid by your employer from the 4th qualifying day, for up to ${MAX_WEEKS} weeks. Enter your earnings and how long you\'ve been off to see the total.`}
      verified="gov.uk/statutory-sick-pay"
      related={[
        { href: '/take-home-pay',   title: 'Take-home pay', desc: 'See your normal net for context.' },
        { href: '/maternity-pay',   title: 'Maternity / Paternity', desc: 'Other statutory pay your employer must run.' },
        { href: '/redundancy-pay',  title: 'Redundancy pay', desc: 'Statutory entitlement if your job ends.' },
      ]}
      educational={[
        { title: 'How much, how often', body: `£${SSP_WEEKLY}/week. Paid by your employer in your normal pay run, taxed via PAYE just like wages. Daily rate = weekly rate divided by your "qualifying days" per week.` },
        { title: 'Waiting days', body: `The first ${WAITING_DAYS} qualifying days of any sickness spell are unpaid. SSP starts on day 4. Linked spells within 8 weeks count as one period — you don\'t serve waiting days again.` },
        { title: 'Eligibility', body: `You must be classed as an employee (not self-employed) and earn at least £${LEL_WEEKLY}/week on average. Agency workers and zero-hours staff usually qualify if they hit the LEL.` },
        { title: 'How long it lasts', body: `Up to ${MAX_WEEKS} weeks (196 days) in a single period of incapacity. After that, your employer no longer pays SSP — you may switch to Employment & Support Allowance via DWP.` },
        { title: 'Self-certification', body: 'For the first 7 calendar days of sickness, you can self-certify (SC2 form). After 7 days you need a fit note (Statement of Fitness for Work) from your GP, nurse, pharmacist or therapist.' },
        { title: 'Company sick pay', body: 'Many employers run a "contractual sick pay" scheme paying more than SSP for a defined period — check your contract or staff handbook. Contractual sick pay usually includes the SSP.' },
      ]}
    >
      <SspClient />
    </CalcPageShell>
  );
}
