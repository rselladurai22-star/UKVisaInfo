import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import HolidayPayClient from './HolidayPayClient';

export const metadata: Metadata = {
  title: 'UK Holiday Pay & Leave Calculator — Statutory 5.6 Weeks, Pro-Rata, Irregular Hours',
  description: 'Free UK holiday entitlement calculator. Statutory 5.6 weeks of paid leave, pro-rata for part-time, 12.07% rule for irregular-hours and part-year workers (gov.uk).',
  alternates: { canonical: '/holiday-pay' },
};

export default function HolidayPayPage() {
  return (
    <CalcPageShell
      url="/holiday-pay"
      eyebrow="Holiday pay · UK · 2026"
      title="Your paid holiday entitlement."
      deck="Statutory 5.6 weeks for regular hours, 12.07% accrual for irregular-hours and part-year workers. Includes pay value if you enter your rate."
      verified="gov.uk · Working Time Regulations"
      related={[
        { href: '/take-home-pay',  title: 'Take-home pay',     desc: 'PAYE + NI + student loan — net pay 2026/27.' },
        { href: '/tax-code',       title: 'Tax code decoder',  desc: 'What does your HMRC tax code mean?' },
        { href: '/vat-calculator', title: 'VAT calculator',    desc: 'Add or remove 20%, 5%, 0% VAT.' },
      ]}
      educational={[
        { title: '5.6 weeks is the minimum',  body: 'The Working Time Regulations 1998 (reg. 13 + 13A) set 5.6 weeks of paid leave per year. For a 5-day worker that\'s 28 days — the statutory cap. Contracts can offer more but not less.' },
        { title: 'Pro-rata for part-time',    body: 'A 3-day-a-week worker gets 3 × 5.6 = 16.8 days. A 4-day worker gets 22.4 days. The 28-day cap only applies once you reach 5 days; below that, the proportional calc rules.' },
        { title: 'Irregular hours: 12.07%',   body: 'For workers without fixed hours (zero-hours, part-year, agency), holiday is accrued at 12.07% of hours actually worked in each pay period. From 1 April 2024 the post-Brazel reforms reinstated this method.' },
        { title: 'Bank holidays included?',   body: 'Usually yes — the 28-day statutory entitlement is inclusive of the 8 English bank holidays. Some contracts add bank holidays on top, giving 20 + 8 = 28. Read your contract.' },
        { title: 'Rolled-up holiday pay',     body: 'For irregular-hours and part-year workers only, employers can again pay holiday "rolled up" — i.e. as a 12.07% uplift on each payslip instead of paying it when taken. Must be itemised on the payslip.' },
        { title: 'Carry-over',                body: 'The first 4 weeks (under the EU Working Time Directive) can be carried over only in narrow circumstances (sickness, family leave). The extra 1.6 weeks can be carried by written agreement. The rest is "use it or lose it".' },
      ]}
    >
      <HolidayPayClient />
    </CalcPageShell>
  );
}
