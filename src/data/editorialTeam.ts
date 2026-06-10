/**
 * Editorial team — the named humans responsible for UKDesk content.
 *
 * For YMYL pages (money, property, legal) Google's quality raters look for
 * a clearly named author with disclosed scope and qualifications. We
 * publish what is actually true: a researcher who reads gov.uk pages
 * end-to-end and writes plain-English summaries. We DO NOT claim legal
 * or regulated-adviser status — that is intentionally absent.
 *
 * If you want to edit the named editor or add more team members, this
 * is the single source of truth.
 */

export interface TeamMember {
  /** URL-safe slug — used for /about#<id> and Schema.org @id. */
  id: string;
  /** Public name as it appears on bylines. */
  name: string;
  /** Job title within UKDesk. */
  role: string;
  /** 1-line scope statement — what they actually do. */
  scope: string;
  /** 2-3 sentence biography (HTML allowed). */
  bio: string;
  /** Areas they research. */
  expertise: string[];
  /** Public profile URL fragment on /about. */
  profileUrl: string;
  /** Contact email for editorial corrections. */
  email: string;
  /** Optional initials for the avatar tile. */
  initials: string;
  /** Optional external profile (LinkedIn / GitHub) — null if not public. */
  links?: { label: string; href: string }[];
}

export const EDITORS: TeamMember[] = [
  {
    id: 'ukdesk-editorial',
    name: 'UKDesk Editorial',
    role: 'Editor & Researcher',
    scope:
      'Reads gov.uk, HMRC and ONS source pages, verifies every figure, and writes the plain-English explainers on UKDesk.',
    bio:
      'UKDesk was founded in 2026 to make UK tax thresholds, property finances and council-level lookups understandable without legalese. Every figure on the site is traced back to the cited gov.uk page on the day it is published, and re-verified at each update. UKDesk is editorial research, not financial or legal advice.',
    expertise: [
      'UK tax & take-home pay (HMRC PAYE, NI, Self Assessment, IHT, CGT, dividends)',
      'UK property finance (Stamp Duty / SDLT, mortgage affordability, rental yield)',
      'UK administrative lookups (postcode → council / NHS / police / MP, council tax bands)',
    ],
    profileUrl: '/about#ukdesk-editorial',
    email: 'contact@ukdesk.co.uk',
    initials: 'UK',
  },
];

export const PRIMARY_EDITOR = EDITORS[0];

/** Schema.org Person object for the primary editor — drop into JSON-LD. */
export function primaryEditorSchema(siteUrl = 'https://ukdesk.co.uk') {
  const e = PRIMARY_EDITOR;
  return {
    '@type': 'Person',
    '@id': `${siteUrl}${e.profileUrl}`,
    name: e.name,
    url: `${siteUrl}${e.profileUrl}`,
    jobTitle: e.role,
    description: e.scope,
    knowsAbout: e.expertise,
    email: `mailto:${e.email}`,
    worksFor: { '@type': 'Organization', name: 'UKDesk', url: siteUrl },
  };
}
