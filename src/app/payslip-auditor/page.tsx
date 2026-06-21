import type { Metadata } from 'next';
import PayslipAuditor from './PayslipAuditor';

export const metadata: Metadata = {
  title: 'Payslip Auditor 2025/26, Check Your Tax & Tax Code | UKDesk',
  description:
    'Free UK payslip checker. Compare your monthly Income Tax and National Insurance against what they should be, decode your tax code, and spot over-deductions or HMRC errors. 2025/26 rates.',
  alternates: { canonical: '/payslip-auditor' },
  openGraph: { title: 'Payslip Auditor, Check Your Tax', description: 'Spot wrong tax codes and over-deductions on your payslip.', url: 'https://ukvisainfo.co.uk/payslip-auditor', type: 'article' },
};

export default function Page() {
  return <PayslipAuditor />;
}
