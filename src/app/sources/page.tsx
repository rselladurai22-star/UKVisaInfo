import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, ShieldCheck } from 'lucide-react';

const INK     = '#18181B';
const CREAM   = '#FFFFFF';
const PAPER   = '#FFFFFF';
const EMERALD = '#6366F1';
const GOLD    = '#6366F1';
const SLATE   = '#3F3F46';
const MUTED   = '#6B7280';
const HAIR    = 'rgba(11,15,25,0.08)';

export const metadata: Metadata = {
  title: 'Sources — Every gov.uk, HMRC & ONS Page UKDesk Cites',
  description:
    'The complete list of official sources UKDesk relies on: gov.uk visa pages, HMRC tax rates, ONS statistics, and Parliament data. Every figure traces back here.',
  alternates: { canonical: '/sources' },
  robots: { index: true, follow: true },
};

const VISA_SOURCES = [
  { label: 'Home Office immigration & nationality fees (master table)', href: 'https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026', note: 'Effective 8 April 2026 — the canonical fee table' },
  { label: 'Skilled Worker visa', href: 'https://www.gov.uk/skilled-worker-visa' },
  { label: 'Skilled Worker — your job', href: 'https://www.gov.uk/skilled-worker-visa/your-job' },
  { label: 'Skilled Worker — when you can be paid less', href: 'https://www.gov.uk/skilled-worker-visa/when-you-can-be-paid-less' },
  { label: 'Student visa', href: 'https://www.gov.uk/student-visa' },
  { label: 'Standard Visitor visa', href: 'https://www.gov.uk/standard-visitor' },
  { label: 'UK family visa', href: 'https://www.gov.uk/uk-family-visa' },
  { label: 'Health and Care Worker visa', href: 'https://www.gov.uk/health-care-worker-visa' },
  { label: 'Global Talent visa', href: 'https://www.gov.uk/global-talent' },
  { label: 'Graduate visa', href: 'https://www.gov.uk/graduate-visa' },
  { label: 'Innovator Founder visa', href: 'https://www.gov.uk/innovator-founder-visa' },
  { label: 'Indefinite Leave to Remain (ILR)', href: 'https://www.gov.uk/indefinite-leave-to-remain' },
  { label: 'British citizenship — apply with ILR', href: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain' },
  { label: 'EU Settlement Scheme', href: 'https://www.gov.uk/settled-status-eu-citizens-families' },
  { label: 'British National (Overseas) visa', href: 'https://www.gov.uk/british-national-overseas-bno-visa' },
  { label: 'Long Residence', href: 'https://www.gov.uk/long-residence' },
  { label: 'UK Ancestry visa', href: 'https://www.gov.uk/ancestry-visa' },
  { label: 'Immigration Rules — Part 9 (grounds for refusal)', href: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-part-9-grounds-for-refusal' },
  { label: 'Life in the UK Test', href: 'https://www.gov.uk/life-in-the-uk-test' },
  { label: 'English language requirements', href: 'https://www.gov.uk/english-language' },
  { label: 'TB test for visa applicants', href: 'https://www.gov.uk/tb-test-visa' },
  { label: 'ATAS (Academic Technology Approval Scheme)', href: 'https://www.gov.uk/guidance/academic-technology-approval-scheme' },
  { label: 'Register of licensed worker sponsors', href: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers' },
  { label: 'Register of licensed student sponsors', href: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students' },
  { label: 'Good character — nationality policy guidance', href: 'https://www.gov.uk/government/publications/good-character-nationality-policy-guidance' },
];

const TAX_SOURCES = [
  { label: 'HMRC — income tax rates and allowances', href: 'https://www.gov.uk/government/publications/rates-and-allowances-income-tax' },
  { label: 'HMRC — National Insurance rates and thresholds', href: 'https://www.gov.uk/government/publications/rates-and-allowances-national-insurance-contributions' },
  { label: 'HMRC — Capital Gains Tax', href: 'https://www.gov.uk/capital-gains-tax' },
  { label: 'HMRC — Inheritance Tax', href: 'https://www.gov.uk/inheritance-tax' },
  { label: 'HMRC — Stamp Duty Land Tax', href: 'https://www.gov.uk/stamp-duty-land-tax' },
  { label: 'HMRC — Self Assessment', href: 'https://www.gov.uk/self-assessment-tax-returns' },
  { label: 'HMRC — Tax codes', href: 'https://www.gov.uk/tax-codes' },
  { label: 'HMRC — VAT', href: 'https://www.gov.uk/vat-rates' },
  { label: 'HMRC — Pension allowances', href: 'https://www.gov.uk/tax-on-your-private-pension' },
  { label: 'HMRC — Marriage Allowance', href: 'https://www.gov.uk/marriage-allowance' },
  { label: 'GOV.UK — Minimum Wage rates', href: 'https://www.gov.uk/national-minimum-wage-rates' },
  { label: 'GOV.UK — Statutory Sick Pay', href: 'https://www.gov.uk/statutory-sick-pay' },
  { label: 'GOV.UK — Holiday entitlement', href: 'https://www.gov.uk/holiday-entitlement-rights' },
];

const STAT_SOURCES = [
  { label: 'ONS — Cost of living statistics', href: 'https://www.ons.gov.uk/economy/inflationandpriceindices' },
  { label: 'ONS — Annual Survey of Hours and Earnings (salary distribution)', href: 'https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/annualsurveyofhoursandearningsashegrosspaybyoccupation4digitsoc2020ashetable14' },
  { label: 'ONS — UK House Price Index', href: 'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/housepriceindex' },
];

const LOOKUP_SOURCES = [
  { label: 'postcodes.io — UK postcode geo data', href: 'https://postcodes.io', note: 'Open data backed by ONS, OS and the Royal Mail PAF.' },
  { label: 'UK Parliament Members API', href: 'https://members-api.parliament.uk', note: 'Live MP data for every constituency.' },
  { label: 'NHS — Find a GP service', href: 'https://www.nhs.uk/service-search/find-a-gp' },
  { label: 'police.uk — UK crime &amp; policing data', href: 'https://www.police.uk' },
  { label: 'Companies House — Public Data', href: 'https://www.gov.uk/government/organisations/companies-house', note: 'For the UK sponsor licence register.' },
];

export default function SourcesPage() {
  return (
    <div style={{ background: CREAM, minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-5 md:px-8 pt-[120px] pb-20">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: GOLD }}>
          Bibliography
        </p>
        <h1 className="mb-5"
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 600,
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              lineHeight: 1.02, letterSpacing: '-0.032em', color: INK,
            }}>
          Every official source UKDesk cites
        </h1>
        <p className="text-[16.5px] leading-[1.6] mb-12" style={{ color: SLATE }}>
          UKDesk does not invent data. Every fee, threshold, processing time
          and rule on the site traces back to one of the gov.uk, HMRC, ONS or
          Parliament pages listed below. We re-verify the master fee table
          before publishing any figure.{' '}
          <Link href="/editorial-policy" className="underline font-semibold" style={{ color: INK }}>
            See the editorial policy
          </Link>{' '}
          for the verification workflow.
        </p>

        <Group label="UK visa &amp; immigration (gov.uk)" sources={VISA_SOURCES} />
        <Group label="UK tax &amp; pay (HMRC + gov.uk)"   sources={TAX_SOURCES} />
        <Group label="ONS — statistics &amp; cost-of-living" sources={STAT_SOURCES} />
        <Group label="UK admin lookups"                   sources={LOOKUP_SOURCES} />

        <div className="mt-12 rounded-3xl px-5 py-5 flex items-start gap-3"
             style={{ background: 'rgba(4,120,87,0.05)', border: '1px solid rgba(4,120,87,0.18)' }}>
          <ShieldCheck className="w-4 h-4 mt-0.5" style={{ color: EMERALD }} />
          <p className="text-[13px] leading-[1.65]" style={{ color: '#064E3B' }}>
            Spotted an article on UKDesk where a figure does not link to one of these
            sources?{' '}
            <a href="mailto:contact@ukvisainfo.co.uk?subject=Missing%20citation"
               className="underline font-semibold" style={{ color: '#064E3B' }}>
              Email contact@ukvisainfo.co.uk
            </a>
            {' '}— we will add the citation within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

function Group({ label, sources }: { label: string; sources: { label: string; href: string; note?: string }[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-[10.5px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}
          dangerouslySetInnerHTML={{ __html: label }} />
      <ul className="space-y-2">
        {sources.map((s) => (
          <li key={s.href}>
            <a href={s.href} target="_blank" rel="noopener noreferrer"
               className="block rounded-xl px-4 py-3 transition-colors"
               style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
              <div className="flex items-start gap-3">
                <span className="text-[14px] font-semibold flex-1" style={{ color: INK }}
                      dangerouslySetInnerHTML={{ __html: s.label }} />
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: MUTED }} />
              </div>
              {s.note && (
                <p className="mt-1 text-[12.5px]" style={{ color: SLATE }}
                   dangerouslySetInnerHTML={{ __html: s.note }} />
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
