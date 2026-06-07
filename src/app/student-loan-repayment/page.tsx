import type { Metadata } from 'next';
import StudentLoan from './StudentLoan';

export const metadata: Metadata = {
  title: 'Student Loan Repayment Calculator 2025/26 — All Plans | UKDesk',
  description:
    'Free UK student loan repayment calculator. See your annual and monthly repayments by plan (1, 2, 4, 5 and Postgraduate) on 2025/26 thresholds, and whether your balance will be written off.',
  alternates: { canonical: '/student-loan-repayment' },
  openGraph: { title: 'Student Loan Repayment Calculator', description: 'Repayments by plan and whether your loan gets written off.', url: 'https://ukvisainfo.co.uk/student-loan-repayment', type: 'article' },
};

export default function Page() {
  return <StudentLoan />;
}
