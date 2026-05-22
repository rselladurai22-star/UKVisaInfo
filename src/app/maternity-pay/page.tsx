import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MaternityClient from './MaternityClient';
import { SMP_STATUTORY_RATE, LEL_WEEKLY, RATES_TAX_YEAR } from '../../lib/maternity/calc';

export const metadata: Metadata = {
  title: 'UK Maternity & Paternity Pay Calculator — SMP, SPP 2025/26',
  description: `Free UK Statutory Maternity Pay and Paternity Pay calculator. 6 weeks at 90% of pay, then 33 weeks at the statutory rate (£${SMP_STATUTORY_RATE}/week). Eligibility from the £${LEL_WEEKLY}/week Lower Earnings Limit.`,
  alternates: { canonical: '/maternity-pay' },
};

export default function MaternityPage() {
  return (
    <CalcPageShell
      url="/maternity-pay"
      eyebrow={`Statutory Maternity & Paternity · ${RATES_TAX_YEAR} rates`}
      title="What you’ll be paid on parental leave."
      deck="Average weekly earnings in, full SMP or SPP breakdown out — the 6-week 90% phase, the 33-week statutory phase and the unpaid tail, all in one shot."
      verified="gov.uk/maternity-pay-leave/pay · gov.uk/paternity-pay-leave"
      related={[
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Compare your normal monthly net pay to what you\'ll get on SMP/SPP.' },
        { href: '/sick-pay',      title: 'Statutory Sick Pay', desc: 'The other major statutory pay employers must honour.' },
        { href: '/redundancy-pay', title: 'Redundancy pay', desc: 'If you\'re made redundant during or shortly after leave.' },
      ]}
      educational={[
        { title: 'Statutory Maternity Pay (SMP)', body: `Paid for up to 39 weeks. First 6 weeks: 90% of your average weekly earnings, no cap. Following 33 weeks: lower of 90% AWE or £${SMP_STATUTORY_RATE}/week. The final 13 weeks of the 52-week leave entitlement are unpaid.` },
        { title: 'Statutory Paternity Pay (SPP)', body: `Up to 2 weeks at the lower of 90% AWE or £${SMP_STATUTORY_RATE}/week. From April 2024 the leave can be taken as 1 + 1 weeks within the first year, not just one block at birth.` },
        { title: 'Eligibility', body: `For SMP you need 26 weeks\' continuous service by the 15th week before your due date AND average weekly earnings ≥ £${LEL_WEEKLY}. If you don\'t qualify, apply to JobcentrePlus for Maternity Allowance.` },
        { title: 'How AWE is worked out', body: 'HMRC uses gross pay over an 8-week reference period ending with the qualifying week (15 weeks before due date). Bonuses, overtime and commission count if paid in those weeks.' },
        { title: 'Shared Parental Leave', body: 'Mum and partner can split up to 50 weeks leave / 37 weeks pay between them after the initial compulsory 2-week maternity period. Pay rate is the same statutory £rate.' },
        { title: 'Tax treatment', body: 'SMP and SPP are subject to PAYE and NI just like normal wages — you keep your tax code, but the lower income usually means lower deductions overall.' },
      ]}
    >
      <MaternityClient />
    </CalcPageShell>
  );
}
