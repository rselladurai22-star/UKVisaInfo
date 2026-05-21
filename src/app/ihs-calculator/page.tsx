import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import IhsClient from './IhsClient';

export const metadata: Metadata = {
  title: 'IHS Calculator 2025 — Immigration Health Surcharge UK Visa Cost',
  description: 'UK Immigration Health Surcharge calculator. Standard £1,035/year, student £776/year. Calculate total IHS for main applicant + dependants across any visa duration. Rounds up to full years.',
  alternates: { canonical: '/ihs-calculator' },
};

export default function IhsPage() {
  return (
    <CalcPageShell
      url="/ihs-calculator"
      eyebrow="Immigration Health Surcharge · UK"
      title="How much is the Immigration Health Surcharge for your visa?"
      deck="£1,035 per person per year for most visas. £776 for students and Youth Mobility. Duration is always rounded up to the nearest full year. Add dependants to get the total family cost."
      verified="gov.uk/healthcare-immigration-application/pay"
      related={[
        { href: '/skilled-worker-points-check', title: 'Skilled Worker points check', desc: 'Check your 70-point score before applying.' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Plan your UK income once you arrive.' },
        { href: '/national-insurance', title: 'National Insurance', desc: 'Understand UK payroll deductions.' },
      ]}
      educational={[
        { title: 'What is the IHS?', body: 'The Immigration Health Surcharge (IHS) is a fee paid alongside most UK visa applications. It gives access to NHS healthcare on the same basis as UK residents for the duration of the visa.' },
        { title: 'Current rates (from February 2024)', body: 'Standard rate: £1,035 per person per year. Student visas and Youth Mobility Scheme: £776 per person per year. Rates apply to the main applicant AND each dependant separately.' },
        { title: 'Rounding up to full years', body: 'Even if your visa is 2 years and 1 month, HMRC charges 3 × the annual rate (rounded up to the nearest full year). A 5-year Skilled Worker visa = 5 × £1,035 = £5,175 per person.' },
        { title: 'Who is exempt?', body: 'British and Irish citizens. EU/EEA/Swiss nationals with settled status. Applicants from certain reciprocal healthcare agreement countries for specific visa types. Check the full exemption list on gov.uk.' },
        { title: 'When is IHS paid?', body: 'IHS is paid online as part of the visa application process — before submitting the application. It is non-refundable even if the visa is refused, unless the application was withdrawn due to an HMRC processing error.' },
      ]}
    >
      <IhsClient />
    </CalcPageShell>
  );
}
