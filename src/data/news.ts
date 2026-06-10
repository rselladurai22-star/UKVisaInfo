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
    title: '8 April 2026 visa-fee uplift — verified from gov.uk',
    summary: 'Home Office fee table published 18 March 2026. ILR up 6.5% to £3,226. Skilled Worker, Student, Visitor all up. Child citizenship (MN1) cut to £1,000.',
    date: '2026-04-08',
    category: 'Fees',
    body: `The Home Office immigration and nationality fees effective 8 April 2026 were published on gov.uk (master table updated 18 March 2026). The verified changes are:

**Settlement**

- **Indefinite Leave to Remain** (all categories Set M/O/F): £3,029 → **£3,226** (+6.5%).
- **Long Residence ILR**: now matches the standard fee at £3,226.
- **British citizenship (adult, Form AN)**: £1,605 → **£1,709**, plus £130 ceremony fee (unchanged) = **£1,839 total**.
- **Child citizenship registration (Form MN1)**: £1,214 → **£1,000** — a £214 reduction.

**Main visas**

- **Skilled Worker** (out-of-country, ≤3 years): £769 → **£819**.
- **Skilled Worker** (out-of-country, >3 years): £1,519 → **£1,618**.
- **Student visa**: £524 → **£558**.
- **Standard Visitor** (6 months): £127 → **£135**.
- **BN(O) visa**: 30 months £193 → **£206**; 5 years £268 → **£285**.

**Held**

- Priority Visa service: £500 (unchanged).
- Super Priority service: £1,000 (unchanged).
- Life in the UK Test: £50 (unchanged).
- IHS: £1,035 adult / £776 child or student per year (unchanged).

**Salary thresholds (separate from fees)**

The Skilled Worker general minimum was confirmed at **£41,700** per gov.uk/skilled-worker-visa/your-job, with a £33,400 floor for new entrants, ISL roles and STEM PhD holders. Non-STEM PhD holders need £37,500.`,
    source: 'https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026',
    tags: ['Fees', 'Skilled Worker', 'ILR', 'Citizenship'],
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
