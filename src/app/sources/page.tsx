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
    'The complete list of official sources UKDesk relies on: HMRC tax rates, ONS statistics, and Parliament data. Every figure traces back here.',
  alternates: { canonical: '/sources' },
  robots: { index: true, follow: true },
};

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
  { label: 'Companies House — Public Data', href: 'https://www.gov.uk/government/organisations/companies-house' },
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
          Parliament pages listed below. We re-verify the sources
          before publishing any figure.{' '}
          <Link href="/editorial-policy" className="underline font-semibold" style={{ color: INK }}>
            See the editorial policy
          </Link>{' '}
          for the verification workflow.
        </p>

        <Group label="UK tax &amp; pay (HMRC + gov.uk)"   sources={TAX_SOURCES} />
        <Group label="ONS — statistics &amp; cost-of-living" sources={STAT_SOURCES} />
        <Group label="UK admin lookups"                   sources={LOOKUP_SOURCES} />

        <div className="mt-12 rounded-3xl px-5 py-5 flex items-start gap-3"
             style={{ background: 'rgba(4,120,87,0.05)', border: '1px solid rgba(4,120,87,0.18)' }}>
          <ShieldCheck className="w-4 h-4 mt-0.5" style={{ color: EMERALD }} />
          <p className="text-[13px] leading-[1.65]" style={{ color: '#064E3B' }}>
            Spotted an article on UKDesk where a figure does not link to one of these
            sources?{' '}
            <a href="mailto:contact@ukdesk.co.uk?subject=Missing%20citation"
               className="underline font-semibold" style={{ color: '#064E3B' }}>
              Email contact@ukdesk.co.uk
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
