import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import StudentLoanClient from './StudentLoanClient';

export const metadata: Metadata = {
  title: 'UK Student Loan Repayment Calculator — Plans 1, 2, 4, 5 & Postgraduate',
  description: 'Free UK student loan repayment calculator. Enter your salary and outstanding balance, see your monthly deduction, how long until it clears, and whether you\'ll hit the write-off. 2026/27 thresholds.',
  alternates: { canonical: '/student-loan-repayment' },
};

export default function StudentLoanPage() {
  return (
    <CalcPageShell
      url="/student-loan-repayment"
      eyebrow="Student Loan · UK · 2026/27 thresholds"
      title="Your student loan, in plain numbers."
      deck="Pick your plan, drop in your salary and balance — instantly see your monthly deduction, the years to clear, and whether you'll ever finish paying it."
      verified="Department for Education / SLC thresholds"
      related={[
        { href: '/take-home-pay',    title: 'Take-home pay', desc: 'See the loan deduction in the full PAYE picture.' },
        { href: '/salary-compare',   title: 'Salary compare', desc: 'How your gross compares to your sector across the UK.' },
        { href: '/national-insurance', title: 'National Insurance', desc: 'See your NI alongside the 9% / 6% loan deduction.' },
      ]}
      educational={[
        { title: 'Plan 1 — pre-Sep-2012 (E/W)', body: '9% of earnings above £26,065/year. Interest lower of RPI or BoE base rate + 1%. Written off 25 years after first April due to repay (or at age 65).' },
        { title: 'Plan 2 — Sep 2012 – Jul 2023 (E/W)', body: '9% above £28,470/year. Interest slides from RPI (under £28,470) up to RPI + 3% (above £49,130). Written off 30 years after first April due to repay.' },
        { title: 'Plan 4 — Scotland', body: '9% above £32,745/year. Interest the lower of RPI or BoE base rate + 1%. Written off 30 years after first April due to repay.' },
        { title: 'Plan 5 — Aug 2023 onwards (England)', body: '9% above £25,000/year. Interest is RPI only. Written off after 40 years — many borrowers will repay the full amount.' },
        { title: 'Postgraduate Loan', body: '6% above £21,000/year. Interest is RPI + 3%. Paid in addition to any undergrad plan deduction. Written off 30 years after first April due to repay.' },
        { title: 'When deductions start', body: 'Your employer starts deducting from the April after you finish your course — not from day one. HMRC tells your employer which plan to apply, shown on your payslip as "SL" or "PGL".' },
      ]}
    >
      <StudentLoanClient />
    </CalcPageShell>
  );
}
