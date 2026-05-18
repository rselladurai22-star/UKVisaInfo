/**
 * News feed for UK immigration updates.
 *
 * Short, dated posts tracking Home Office rule changes, fee uplifts,
 * processing-time shifts, eVisa updates etc. Less effort than long-form
 * blog articles but excellent for Google News eligibility, RSS pickup,
 * and giving newsletter subscribers fresh weekly content.
 *
 * Add new items at the top of the array. Each item should be 80-200
 * words. Link out to the official gov.uk source where available.
 */

export interface NewsItem {
  slug: string;
  title: string;
  summary: string;
  date: string;            // ISO YYYY-MM-DD
  category: 'Rules' | 'Fees' | 'Processing' | 'eVisa' | 'Routes' | 'Sponsors';
  body: string;            // markdown
  source?: string;         // official source URL
  tags?: string[];
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: 'spring-2026-fee-uplift',
    title: 'Spring 2026 visa-fee uplift confirmed',
    summary: 'Home Office published the April 2026 fee schedule — Skilled Worker fees rise 8–12%, Student visa unchanged, IHS holds at £1,035/year.',
    date: '2026-04-01',
    category: 'Fees',
    body: `The Home Office has published the April 2026 visa-fee schedule. Headline changes:

- **Skilled Worker visa**: £827 (1-3 years) up from £769; £1,636 (5 years) up from £1,500.
- **Health & Care visa**: held at £304 / £590 — recognising recruitment pressure on the NHS.
- **Student visa**: held at £524 from overseas, £490 in-country.
- **Visitor visa**: unchanged at £127 (short stay).
- **IHS**: held at £1,035/year for adults, £776/year for students and dependants.

The Immigration Skills Charge remains £1,000/year for medium and large sponsors and £364/year for small/charity sponsors.`,
    source: 'https://www.gov.uk/government/publications/visa-regulations-revised-table',
    tags: ['Fees', 'Skilled Worker'],
  },
  {
    slug: 'evisa-transition-2026',
    title: 'Final eVisa transition: BRPs no longer accepted from 2026',
    summary: 'All BRPs expired 31 Dec 2024. From 2026 only the digital eVisa via your UKVI account is accepted as proof of status.',
    date: '2026-03-15',
    category: 'eVisa',
    body: `If you held a Biometric Residence Permit (BRP), it expired on **31 December 2024**. Your immigration status is now proof through your **UKVI account and the View and Prove service**. Carriers and landlords are required to check the digital share code.

If you haven't created your UKVI account yet:
1. Visit gov.uk/get-evisa with your existing BRP.
2. Verify your identity using the UK Immigration: ID Check app.
3. Receive an email confirming your eVisa is linked to your account.`,
    source: 'https://www.gov.uk/evisa',
    tags: ['eVisa'],
  },
  {
    slug: 'care-worker-route-closed',
    title: 'Care Worker route closed to new overseas applicants',
    summary: 'From 11 March 2025, the dedicated Care Worker route is closed to new applications from overseas. Existing visa holders can extend.',
    date: '2026-02-20',
    category: 'Routes',
    body: `The Home Office confirmed the Care Worker pathway under the Skilled Worker route is **closed to new overseas applications**. Existing visa holders can:

- Extend their current Care Worker visa.
- Switch in-country to other Skilled Worker occupations if they meet the salary and SOC code rules.
- Apply for the Health & Care visa under nursing or paramedic occupations if qualified.

The route closure does not affect the wider Health & Care visa — nurses, midwives, paramedics and senior healthcare professionals remain eligible.`,
    source: 'https://www.gov.uk/skilled-worker-visa',
    tags: ['Health & Care', 'Skilled Worker'],
  },
];

export function getNewsItem(slug: string): NewsItem | undefined {
  return NEWS_ITEMS.find((n) => n.slug === slug);
}
