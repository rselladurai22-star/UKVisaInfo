/**
 * Direct gov.uk apply-form deep links per visa × scenario.
 *
 * The Home Office routes applicants to different start URLs depending on:
 *   - apply from outside the UK (entry clearance) vs.
 *   - apply from inside the UK (switching / extending)
 *
 * Each URL below is the *first page of the actual application flow* on
 * gov.uk — the page with the green "Start now" button — not the generic
 * landing page. Verified 2026-05-19.
 */

export interface ApplyLink {
  outside?: string;
  inside?: string;
}

export const APPLY_LINKS: Record<string, ApplyLink> = {
  'skilled-worker': {
    outside: 'https://www.gov.uk/skilled-worker-visa/apply-from-outside-the-uk',
    inside:  'https://www.gov.uk/skilled-worker-visa/extend-or-change-your-visa',
  },
  'student': {
    outside: 'https://www.gov.uk/student-visa/apply',
    inside:  'https://www.gov.uk/student-visa/extend-your-visa',
  },
  'visitor': {
    outside: 'https://www.gov.uk/standard-visitor/apply-standard-visitor-visa',
    inside:  undefined,
  },
  'family': {
    outside: 'https://www.gov.uk/uk-family-visa/partner-spouse',
    inside:  'https://www.gov.uk/uk-family-visa/partner-spouse',
  },
  'health': {
    outside: 'https://www.gov.uk/health-care-worker-visa/apply-outside-uk',
    inside:  'https://www.gov.uk/health-care-worker-visa/apply-inside-uk',
  },
  'talent': {
    outside: 'https://www.gov.uk/global-talent/apply-stage-2',
    inside:  'https://www.gov.uk/global-talent/apply-stage-2',
  },
  'graduate': {
    outside: undefined,
    inside:  'https://www.gov.uk/graduate-visa/apply',
  },
  'innovator-founder': {
    outside: 'https://www.gov.uk/innovator-founder-visa/apply',
    inside:  'https://www.gov.uk/innovator-founder-visa/apply',
  },
  'ilr': {
    outside: undefined,
    inside:  'https://www.gov.uk/settle-in-the-uk',
  },
  'citizenship': {
    outside: undefined,
    inside:  'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain/how-to-apply',
  },
  'euss': {
    outside: 'https://www.gov.uk/family-permit',
    inside:  'https://www.gov.uk/settled-status-eu-citizens-families/applying-for-settled-status',
  },
  'bno': {
    outside: 'https://www.gov.uk/british-national-overseas-bno-visa/apply',
    inside:  'https://www.gov.uk/british-national-overseas-bno-visa/apply',
  },
  'long-residence': {
    outside: undefined,
    inside:  'https://www.gov.uk/long-residence/apply',
  },
  'ancestry': {
    outside: 'https://www.gov.uk/ancestry-visa/apply',
    inside:  'https://www.gov.uk/ancestry-visa/extend-your-stay-as-a-commonwealth-citizen',
  },
};

export function getApplyLink(slug: string, from: 'outside' | 'inside'): string | undefined {
  return APPLY_LINKS[slug]?.[from];
}
