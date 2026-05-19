/**
 * Visa-route variants — gov.uk-verified sub-routes within each top-level
 * visa category. Each variant carries a self-contained set of fees,
 * eligibility differentiators and citations.
 *
 * This file is the canonical sub-route source. The cost calculator,
 * eligibility quiz and per-guide variant tabs all read from here.
 *
 * Last full audit: 2026-05-19. Every `source` field links to the gov.uk
 * page the figures came from.
 */

export interface VisaVariant {
  /** URL-safe slug, unique within its parent visa. */
  id: string;
  /** Display label for tabs / picker. */
  label: string;
  /** Short headline (e.g. "70% going rate · £33,400 floor"). */
  headline: string;
  /** Application fee override for this variant. Falls back to parent. */
  fee?: string;
  /** Numeric fee for cost-calculator. */
  feeAmount?: number;
  /** IHS rate (annual). */
  ihsAdult?: number;
  ihsChild?: number;
  /** Eligible visa duration. */
  duration?: string;
  /** Time to ILR from start of this variant. */
  yearsToIlr?: number;
  /** Years on ILR before naturalisation. 0 = immediately. */
  yearsToCitizenship?: number;
  /** Two-line eligibility differentiator. */
  eligibilityHighlights: string[];
  /** Specific gotchas. */
  notes?: string[];
  /** gov.uk URL the variant was verified against. */
  source: string;
}

export interface VisaWithVariants {
  visaId: string;
  variants: VisaVariant[];
}

/* ─────────────────────────────────────────────
   SKILLED WORKER — verified 8 April 2026
   gov.uk/skilled-worker-visa/when-you-can-be-paid-less
─────────────────────────────────────────────── */
export const SKILLED_WORKER_VARIANTS: VisaVariant[] = [
  {
    id: 'standard',
    label: 'Standard rate',
    headline: '£41,700 floor · 100% of going rate',
    feeAmount: 819,
    fee: '£819 (≤3 yrs out) / £1,618 (>3 yrs out)',
    ihsAdult: 1035,
    ihsChild: 776,
    duration: 'Up to 5 years',
    yearsToIlr: 5,
    yearsToCitizenship: 1,
    eligibilityHighlights: [
      'Standard Skilled Worker — meet £41,700 or the going rate, whichever is higher',
      'RQF Level 6 (graduate-level) skill, B2 English, £1,270 maintenance funds',
    ],
    source: 'https://www.gov.uk/skilled-worker-visa/your-job',
  },
  {
    id: 'new-entrant',
    label: 'New entrant rate',
    headline: '£33,400 floor · 70% of going rate · max 4 years',
    feeAmount: 819,
    fee: '£819 (≤3 yrs out)',
    ihsAdult: 1035,
    ihsChild: 776,
    duration: 'Up to 4 years on this rate (then must move to standard)',
    yearsToIlr: 5,
    yearsToCitizenship: 1,
    eligibilityHighlights: [
      'Aged under 26 on application date, OR holding a current/recent Student or Graduate visa',
      'OR working toward a UK regulated profession qualification',
    ],
    notes: [
      'Maximum 4 years total on this rate including prior Graduate visa time.',
      'Salary at least 70% of your job\'s going rate AND at least £33,400.',
    ],
    source: 'https://www.gov.uk/skilled-worker-visa/when-you-can-be-paid-less',
  },
  {
    id: 'isl',
    label: 'Immigration Salary List',
    headline: '£33,400 floor · 100% of going rate',
    feeAmount: 590,
    fee: '£590 (≤3 yrs out, ISL discount applies)',
    ihsAdult: 1035,
    ihsChild: 776,
    duration: 'Up to 5 years',
    yearsToIlr: 5,
    yearsToCitizenship: 1,
    eligibilityHighlights: [
      'Your SOC 2020 code is on the current Immigration Salary List (ISL)',
      'Salary at least £33,400 AND at least 100% of the going rate',
    ],
    notes: [
      'ISL replaced the old Shortage Occupation List from 4 April 2024.',
      'Reduced visa application fee (£590 ≤3 yrs out) applies to ISL roles.',
    ],
    source: 'https://www.gov.uk/skilled-worker-visa/when-you-can-be-paid-less',
  },
  {
    id: 'stem-phd',
    label: 'STEM PhD',
    headline: '£33,400 floor · 80% of going rate',
    feeAmount: 819,
    fee: '£819 (≤3 yrs out)',
    ihsAdult: 1035,
    ihsChild: 776,
    duration: 'Up to 5 years',
    yearsToIlr: 5,
    yearsToCitizenship: 1,
    eligibilityHighlights: [
      'Hold a UK or Ecctis-verified overseas PhD in a STEM subject',
      'Subject relevant to your sponsored role',
    ],
    notes: ['Salary at least 80% of your job\'s going rate AND at least £33,400.'],
    source: 'https://www.gov.uk/skilled-worker-visa/when-you-can-be-paid-less',
  },
  {
    id: 'non-stem-phd',
    label: 'Non-STEM PhD',
    headline: '£37,500 floor · 90% of going rate',
    feeAmount: 819,
    fee: '£819 (≤3 yrs out)',
    ihsAdult: 1035,
    ihsChild: 776,
    duration: 'Up to 5 years',
    yearsToIlr: 5,
    yearsToCitizenship: 1,
    eligibilityHighlights: [
      'Hold a UK or Ecctis-verified overseas PhD in a non-STEM subject',
      'Subject relevant to your sponsored role',
    ],
    notes: ['Salary at least 90% of going rate AND at least £37,500.'],
    source: 'https://www.gov.uk/skilled-worker-visa/when-you-can-be-paid-less',
  },
  {
    id: 'postdoc',
    label: 'Postdoctoral researcher',
    headline: '70% of going rate · max 4 years',
    feeAmount: 819,
    fee: '£819 (≤3 yrs out)',
    ihsAdult: 1035,
    ihsChild: 776,
    duration: 'Up to 4 years on this rate',
    yearsToIlr: 5,
    yearsToCitizenship: 1,
    eligibilityHighlights: [
      'Working in eligible occupation code (SOC 2111-2115, 2119, 2162, 2311)',
      'Postdoctoral research or academic role',
    ],
    notes: ['Maximum 4 years total on this rate.'],
    source: 'https://www.gov.uk/skilled-worker-visa/when-you-can-be-paid-less',
  },
];

/* ─────────────────────────────────────────────
   BRITISH CITIZENSHIP — verified 8 April 2026
─────────────────────────────────────────────── */
export const CITIZENSHIP_VARIANTS: VisaVariant[] = [
  {
    id: 'standard',
    label: 'Standard naturalisation',
    headline: '£1,839 · 12 months on ILR required',
    feeAmount: 1839,
    fee: '£1,839 (incl. £130 ceremony)',
    yearsToCitizenship: 1,
    eligibilityHighlights: [
      '5 years UK residence + 12 months holding ILR (or settled status)',
      'Max 450 days absent in last 5 yrs · Max 90 days in last 12 months',
      'B1 CEFR English + pass Life in the UK Test',
    ],
    notes: [
      'Form AN. Biometrics free.',
      'Good character: no unspent convictions, no immigration breaches, no NHS debt over £500.',
    ],
    source: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
  },
  {
    id: 'spouse',
    label: 'Spouse of British citizen',
    headline: '£1,839 · no waiting period after ILR',
    feeAmount: 1839,
    fee: '£1,839 (incl. £130 ceremony)',
    yearsToCitizenship: 0,
    eligibilityHighlights: [
      'Married to a British citizen AND hold ILR / settled status (no minimum time on ILR)',
      '3 years UK residence (not 5) · Max 270 days absent in 3 yrs',
      'Max 90 days absent in last 12 months · B1 English + LITUK',
    ],
    notes: [
      'Form AN — same form as standard, with spouse-route declaration.',
      'Apply the moment ILR is granted if married 3+ years and resident 3+ years.',
    ],
    source: 'https://www.gov.uk/apply-citizenship-spouse/eligibility-and-fees',
  },
  {
    id: 'mn1-child',
    label: 'Child registration (Form MN1)',
    headline: '£1,000 · no ceremony required',
    feeAmount: 1000,
    fee: '£1,000 (REDUCED from £1,214 on 8 April 2026)',
    yearsToCitizenship: 0,
    eligibilityHighlights: [
      'Child under 18 with a parent who is British or settled',
      'OR child who has lived in the UK for at least 10 years',
      'OR child born in UK to parent who later became British/settled',
    ],
    notes: [
      'Children of British / settled parents born in the UK are usually British automatically — check before paying for MN1.',
      'No ceremony required for under-18s.',
    ],
    source: 'https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026',
  },
  {
    id: 'descent',
    label: 'British by descent',
    headline: 'Free · automatic — apply for passport only',
    feeAmount: 0,
    fee: 'Free (no application — apply for passport only)',
    yearsToCitizenship: 0,
    eligibilityHighlights: [
      'At least one parent is a British citizen by birth (not by descent)',
      'Born outside the UK',
    ],
    notes: [
      'No application or registration needed — you are British automatically.',
      'Apply for a British passport directly: £94.50 adult standard.',
      'Cannot pass British citizenship to your own children born outside the UK (no double descent).',
    ],
    source: 'https://www.gov.uk/types-of-british-nationality/british-citizenship',
  },
];

/* ─────────────────────────────────────────────
   ILR — settlement family with sub-routes
─────────────────────────────────────────────── */
export const ILR_VARIANTS: VisaVariant[] = [
  {
    id: 'skilled-worker',
    label: 'From Skilled Worker (Set(O))',
    headline: '5 yrs · £3,226 · B1 + LITUK',
    feeAmount: 3226,
    fee: '£3,226 (8 April 2026)',
    yearsToIlr: 5,
    eligibilityHighlights: [
      '5 years continuous on Skilled Worker route',
      'Max 180 days absent in any rolling 12-month period',
      'Sponsor still employing you at the going rate',
    ],
    source: 'https://www.gov.uk/skilled-worker-visa/settle-in-the-uk',
  },
  {
    id: 'family',
    label: 'From Family / Partner (Set(M))',
    headline: '5 yrs · £3,226 · A2→B1 English',
    feeAmount: 3226,
    fee: '£3,226 (8 April 2026)',
    yearsToIlr: 5,
    eligibilityHighlights: [
      '5 years continuous on Family / Partner route (2y9m + 2y6m + ILR)',
      'Still meet £29,000 financial requirement',
      'B1 English at ILR stage (up from A2)',
    ],
    source: 'https://www.gov.uk/uk-family-visa/settle-in-the-uk',
  },
  {
    id: 'bno',
    label: 'From BN(O)',
    headline: '5 yrs · £3,226 · B1 + LITUK',
    feeAmount: 3226,
    fee: '£3,226 (gov.uk/british-national-overseas-bno-visa/settle-in-the-uk verbatim)',
    yearsToIlr: 5,
    eligibilityHighlights: [
      '5 years continuous on BN(O) visa',
      'Max 180 days absent in any rolling 12-month period',
    ],
    source: 'https://www.gov.uk/british-national-overseas-bno-visa/settle-in-the-uk',
  },
  {
    id: 'ancestry',
    label: 'From UK Ancestry',
    headline: '5 yrs · £3,226 · evidence of work',
    feeAmount: 3226,
    fee: '£3,226 (8 April 2026)',
    yearsToIlr: 5,
    eligibilityHighlights: [
      '5 years continuous on Ancestry visa',
      'Evidence of having worked in UK during the 5 years',
    ],
    source: 'https://www.gov.uk/ancestry-visa/extend-or-settle',
  },
  {
    id: 'long-residence',
    label: '10-year Long Residence (Set(LR))',
    headline: '10 yrs · £3,226 · any qualifying route',
    feeAmount: 3226,
    fee: '£3,226 (gov.uk/long-residence verbatim)',
    yearsToIlr: 10,
    eligibilityHighlights: [
      '10 continuous years lawful UK residence on qualifying routes',
      'Max 548 days absent total · Max 184 days single absence',
      'Even one day overstaying breaks continuity (paragraph 39E grace may apply)',
    ],
    notes: [
      'Visitor, Short-term Student, Seasonal Worker, Ukraine schemes do NOT count.',
      'Useful for applicants who switched routes or had gaps in employment-based routes.',
    ],
    source: 'https://www.gov.uk/long-residence',
  },
  {
    id: 'global-talent-leader',
    label: 'Global Talent (Leader)',
    headline: '3 yrs · £3,226 · Exceptional Talent',
    feeAmount: 3226,
    fee: '£3,226 (8 April 2026)',
    yearsToIlr: 3,
    eligibilityHighlights: [
      '3 years continuous on Global Talent visa as a "leader" (Exceptional Talent)',
      'Endorsing body confirmed you as a leader in your field',
    ],
    source: 'https://www.gov.uk/global-talent-visa/settle-in-uk',
  },
  {
    id: 'global-talent-potential',
    label: 'Global Talent (Potential leader)',
    headline: '5 yrs · £3,226 · Exceptional Promise',
    feeAmount: 3226,
    fee: '£3,226 (8 April 2026)',
    yearsToIlr: 5,
    eligibilityHighlights: [
      '5 years continuous on Global Talent visa as a "potential leader" (Exceptional Promise)',
    ],
    source: 'https://www.gov.uk/global-talent-visa/settle-in-uk',
  },
  {
    id: 'innovator-founder',
    label: 'From Innovator Founder',
    headline: '3 yrs · £3,226 · endorsing body sign-off',
    feeAmount: 3226,
    fee: '£3,226 (8 April 2026)',
    yearsToIlr: 3,
    eligibilityHighlights: [
      '3 years on Innovator Founder visa',
      'Endorsing body confirms ongoing innovation, viability and scalability',
    ],
    source: 'https://www.gov.uk/innovator-founder-visa',
  },
];

/* ─────────────────────────────────────────────
   FAMILY VISA — Appendix FM sub-routes
─────────────────────────────────────────────── */
export const FAMILY_VARIANTS: VisaVariant[] = [
  {
    id: 'partner',
    label: 'Partner / Spouse',
    headline: '£2,064 · 5 yrs to ILR · £29,000 income',
    feeAmount: 2064,
    fee: '£2,064 (out) / £1,407 (in)',
    ihsAdult: 1035,
    ihsChild: 776,
    duration: '2 yrs 9 months initial + 2 yrs 6 months extension',
    yearsToIlr: 5,
    yearsToCitizenship: 0,
    eligibilityHighlights: [
      'Partner of British, Irish, settled, or refugee/HP status holder',
      '£29,000 minimum income (gross, sole sponsor) OR £88,500 cash savings',
      'A1 initial → A2 extension → B1 settlement English',
    ],
    notes: ['Spouse route to citizenship — apply same day as ILR is granted.'],
    source: 'https://www.gov.uk/uk-family-visa/apply-partner-spouse',
  },
  {
    id: 'parent',
    label: 'Parent of British / settled child',
    headline: '£2,064 · 5 yrs to ILR · no income test',
    feeAmount: 2064,
    fee: '£2,064 (out) / £1,407 (in)',
    ihsAdult: 1035,
    duration: '2 yrs 9 months initial · extends to 5 yrs',
    yearsToIlr: 5,
    eligibilityHighlights: [
      'Parent of a British or settled child under 18 living in the UK',
      'Sole responsibility OR direct access rights to the child',
      'No minimum income requirement (different from partner route)',
    ],
    source: 'https://www.gov.uk/uk-family-visa',
  },
  {
    id: 'child',
    label: 'Child of partner / parent',
    headline: '£2,064 · joins parent\'s route',
    feeAmount: 2064,
    fee: '£2,064 (out) / £1,407 (in)',
    ihsChild: 776,
    duration: 'Matches parent\'s route',
    eligibilityHighlights: [
      'Under 18 (or under 21 in some circumstances)',
      'Parent (or both parents) already on or applying for Partner route',
      'Sole responsibility OR both parents granted/applying',
    ],
    source: 'https://www.gov.uk/uk-family-visa',
  },
  {
    id: 'adult-dependent-relative',
    label: 'Adult Dependent Relative',
    headline: '£3,672 · ILR on entry · high bar',
    feeAmount: 3672,
    fee: '£3,672 (out only — no extension route)',
    ihsAdult: 1035,
    duration: 'Settlement on entry — granted indefinite leave',
    yearsToIlr: 0,
    yearsToCitizenship: 1,
    eligibilityHighlights: [
      'Parent, grandparent, sibling, or adult child of British / settled sponsor',
      'Requires long-term personal care that can ONLY reasonably be provided in the UK',
      'Sponsor must demonstrate ability to maintain and accommodate without public funds',
    ],
    notes: [
      'Very high evidence threshold — most ADR applications are refused.',
      'Apply only from outside the UK. No extension; granted ILR immediately if successful.',
    ],
    source: 'https://www.gov.uk/uk-family-visa',
  },
  {
    id: 'fiance',
    label: 'Fiancé(e) / Proposed civil partner',
    headline: '£2,064 · 6 months to marry · switch to partner',
    feeAmount: 2064,
    fee: '£2,064 (out)',
    duration: '6 months — must marry and switch to partner visa',
    eligibilityHighlights: [
      'Intending to marry / form civil partnership with a British / settled person',
      'Same £29,000 financial requirement applies',
      'Cannot work on fiancé(e) visa — switch to partner route after marriage',
    ],
    source: 'https://www.gov.uk/uk-family-visa',
  },
];

/* ─────────────────────────────────────────────
   VISITOR — visit + ETA + long-term variants
─────────────────────────────────────────────── */
export const VISITOR_VARIANTS: VisaVariant[] = [
  {
    id: 'standard',
    label: 'Standard Visitor (6 months)',
    headline: '£135 · single visit up to 6 months',
    feeAmount: 135,
    fee: '£135 (gov.uk/standard-visitor)',
    duration: 'Up to 6 months per visit',
    eligibilityHighlights: [
      'Tourism, business, study under 6 months, medical treatment',
      'No paid employment, no public funds, no marriage on this visa',
      'Genuine intention to leave at end of visit',
    ],
    source: 'https://www.gov.uk/standard-visitor',
  },
  {
    id: 'eta',
    label: 'Electronic Travel Authorisation (ETA)',
    headline: '£20 · visa-free nationals · multiple visits',
    feeAmount: 20,
    fee: '£20',
    duration: '6 months per visit · valid for multiple visits',
    eligibilityHighlights: [
      'Citizens of USA, Canada, Australia, EU/EEA, Switzerland and other visa-exempt nationals',
      'Must apply BEFORE travelling',
      'Not a visa — does not guarantee entry',
    ],
    source: 'https://www.gov.uk/get-eta',
  },
  {
    id: 'long-term-2',
    label: 'Long-term Visitor — 2 years',
    headline: '£475 · multiple visits over 2 years',
    feeAmount: 475,
    fee: '£475',
    duration: 'Multiple visits over 2 years (each visit ≤6 months)',
    eligibilityHighlights: [
      'Useful for visiting family or business contacts repeatedly',
      'Each visit still capped at 6 months',
      'Not for permanent residence',
    ],
    source: 'https://www.gov.uk/standard-visitor',
  },
  {
    id: 'long-term-5',
    label: 'Long-term Visitor — 5 years',
    headline: '£848 · multiple visits over 5 years',
    feeAmount: 848,
    fee: '£848',
    duration: 'Multiple visits over 5 years',
    eligibilityHighlights: [
      'Same rules as 2-year visitor with longer validity',
    ],
    source: 'https://www.gov.uk/standard-visitor',
  },
  {
    id: 'long-term-10',
    label: 'Long-term Visitor — 10 years',
    headline: '£1,059 · multiple visits over 10 years',
    feeAmount: 1059,
    fee: '£1,059',
    duration: 'Multiple visits over 10 years',
    eligibilityHighlights: [
      'Maximum-validity visitor visa',
      'Each visit ≤6 months',
    ],
    source: 'https://www.gov.uk/standard-visitor',
  },
  {
    id: 'marriage',
    label: 'Marriage Visitor visa',
    headline: '£135 · marry in UK, then leave',
    feeAmount: 135,
    fee: '£135',
    duration: 'Up to 6 months',
    eligibilityHighlights: [
      'Coming to UK to marry or form a civil partnership',
      'Must leave the UK afterwards — cannot switch to family visa on this route',
    ],
    notes: ['Switch to fiancé(e) visa BEFORE travelling if you intend to stay in the UK after marriage.'],
    source: 'https://www.gov.uk/marriage-visa',
  },
];

/* ─────────────────────────────────────────────
   Master variant registry
─────────────────────────────────────────────── */
export const VISA_VARIANTS: Record<string, VisaVariant[]> = {
  'skilled-worker': SKILLED_WORKER_VARIANTS,
  citizenship: CITIZENSHIP_VARIANTS,
  ilr: ILR_VARIANTS,
  family: FAMILY_VARIANTS,
  visitor: VISITOR_VARIANTS,
};

export function getVariants(visaId: string): VisaVariant[] {
  return VISA_VARIANTS[visaId] ?? [];
}
