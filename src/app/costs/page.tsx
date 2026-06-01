import type { Metadata } from 'next';
import CostCalculator from '../../components/CostCalculator';
import EditorByline from '../../components/EditorByline';

export const metadata: Metadata = {
  title: 'UK Visa Cost Calculator 2026 — Fees, IHS & Total',
  description:
    'Estimate the full cost of your UK visa application including Home Office fees, Immigration Health Surcharge (IHS £1,035/year) and priority processing add-ons. Updated April 2026.',
  alternates: { canonical: '/costs' },
  openGraph: {
    title: 'UK Visa Cost Calculator 2026',
    description:
      'Estimate fees, IHS and priority processing costs for any UK visa route.',
    url: 'https://ukvisainfo.co.uk/costs',
  },
};

const COST_NOTES = [
  {
    title: 'Home Office application fee',
    body: 'Every UK visa application carries a non-refundable Home Office fee set by the Immigration and Nationality (Fees) Regulations. Skilled Worker fees range from £719 (new entrant, up to 3 years) to £1,420 (experienced, over 3 years). Student visas are £490 from outside the UK. Visitor visas start at £115 for a standard 6-month entry. Fees were last uplifted in April 2024 and are subject to annual review.',
  },
  {
    title: 'Immigration Health Surcharge (IHS)',
    body: 'The IHS is paid upfront alongside most long-stay visa applications and gives access to NHS healthcare on the same terms as UK residents. The standard rate is £1,035 per person per year (from January 2024). Students and Youth Mobility applicants pay a reduced rate of £776 per person per year. The IHS is calculated by rounding the visa duration up to the nearest complete year — a 2-year 1-month visa is charged as 3 years. It applies separately to the main applicant and each dependant.',
  },
  {
    title: 'Priority and super-priority processing',
    body: 'Standard processing targets 3 weeks for most routes. Priority service (£500 add-on in most countries) targets 5 working days. Super-priority (£1,000 add-on, UK applications only) targets next working day. Priority slots are limited and sell out quickly — especially in Q1 and around fee-uplift dates. Not all routes offer priority; Health and Care Worker and some Global Talent endorsement pathways have separate timelines.',
  },
  {
    title: 'Biometrics and UKVCAS service fees',
    body: 'Applicants enrolling biometrics at a UK Visa and Citizenship Application Services (UKVCAS) centre pay a service charge ranging from £0 (core appointment at a standard site) to £200+ for an enhanced or out-of-hours appointment. Outside the UK, biometrics are enrolled at a Visa Application Centre (VAC); fees vary by country. Separate appointment charges apply for dependants.',
  },
  {
    title: 'Sponsor licence and Certificate of Sponsorship',
    body: 'Employer costs are separate from applicant costs. A new sponsor licence costs £536 (small employer) or £1,476 (medium/large). Issuing a Certificate of Sponsorship (CoS) costs £239 per worker for a skilled worker visa. These are borne by the employer, though some employers pass them to workers — which may or may not be permitted depending on the route.',
  },
  {
    title: 'What is not included in this calculator',
    body: 'This calculator covers mandatory Home Office fees and IHS. It does not include: solicitor or immigration adviser fees (typically £500–£3,000 for a standard application), translation costs for non-English documents, mandatory English language test fees (IELTS/OET: £150–£270), tuberculosis (TB) test fees (£50–£200 in many countries), biometric enrolment centre charges, or any government document fees in the applicant\'s home country.',
  },
];

export default function Page() {
  return (
    <>
      <CostCalculator />

      {/* Educational content — server-rendered for SEO and AdSense quality */}
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-[#0A2540] mb-2 font-display tracking-tight">
          Understanding UK visa costs in 2026
        </h2>
        <p className="text-[#52596e] text-base leading-relaxed mb-10">
          UK visa costs have two mandatory components — the Home Office application fee and the
          Immigration Health Surcharge — plus optional priority processing and biometrics charges.
          Here is what each element covers and how it is calculated.
        </p>

        <div className="space-y-6">
          {COST_NOTES.map((note) => (
            <div
              key={note.title}
              className="border border-[rgba(14,20,36,0.08)] rounded-2xl p-6 bg-white"
            >
              <h3 className="text-[1rem] font-bold text-[#0A2540] mb-2">{note.title}</h3>
              <p className="text-[0.9375rem] leading-[1.75] text-[#1f2a45]">{note.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <EditorByline verified="May 2026" prefix="Edited & verified by" />
        </div>
      </div>
    </>
  );
}
