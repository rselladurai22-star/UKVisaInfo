/**
 * Settlement-route fee constants effective 8 April 2026.
 *
 * Every value here is sourced from gov.uk pages cited in the `source`
 * field. Update each constant against the linked gov.uk page only —
 * do not estimate or extrapolate. Master fee table:
 * https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026
 *
 * Last full audit: 2026-05-19.
 */

export interface FeeFact {
  value: number;
  /** Human-readable label */
  label: string;
  /** gov.uk page the value came from */
  source: string;
  /** Date this constant was last verified against gov.uk */
  verified: string;
}

const VERIFIED = '2026-05-19';
const FEE_TABLE_8APR2026 = 'https://www.gov.uk/government/publications/visa-regulations-revised-table/home-office-immigration-and-nationality-fees-8-april-2026';

/** Indefinite Leave to Remain — main applicants and dependants.
 *  Increased from £3,029 → £3,226 from 8 April 2026 per the master table.
 *  Also confirmed verbatim on gov.uk/british-national-overseas-bno-visa/settle-in-the-uk:
 *  "It costs £3,226 for each person applying". */
export const ILR_FEE: FeeFact = {
  value: 3226,
  label: 'ILR application (Set M/O/F)',
  source: FEE_TABLE_8APR2026,
  verified: VERIFIED,
};

/** 10-year Long Residence (Set LR). Same fee as standard ILR from 8 April 2026. */
export const LONG_RESIDENCE_FEE: FeeFact = {
  value: 3226,
  label: 'Long Residence ILR (Set LR)',
  source: 'https://www.gov.uk/long-residence',
  verified: VERIFIED,
};

/** Naturalisation as British citizen — Form AN. 8 April 2026 table: £1,709
 *  application fee + £130 ceremony = £1,839 total.
 *  gov.uk/apply-citizenship-indefinite-leave-to-remain page states it
 *  verbatim: "£1,839 to apply (this includes the £130 citizenship ceremony fee)". */
export const NATURALISATION_AN_TOTAL: FeeFact = {
  value: 1839,
  label: 'British citizenship (Form AN, ceremony incl.)',
  source: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
  verified: VERIFIED,
};
export const NATURALISATION_CEREMONY_FEE: FeeFact = {
  value: 130,
  label: 'Citizenship ceremony fee (included in £1,839)',
  source: FEE_TABLE_8APR2026,
  verified: VERIFIED,
};

/** Child citizenship registration — Form MN1.
 *  REDUCED from £1,214 → £1,000 from 8 April 2026. */
export const REGISTRATION_MN1: FeeFact = {
  value: 1000,
  label: 'Child citizenship registration (Form MN1)',
  source: FEE_TABLE_8APR2026,
  verified: VERIFIED,
};

/** BN(O) visa, 2.5-year stay (per person). gov.uk cost page = £206. */
export const BNO_2_5YR: FeeFact = {
  value: 206,
  label: 'BN(O) visa, 2 years 6 months',
  source: 'https://www.gov.uk/british-national-overseas-bno-visa/how-much-it-costs',
  verified: VERIFIED,
};

/** BN(O) visa, 5-year stay (per person). gov.uk cost page = £285. */
export const BNO_5YR: FeeFact = {
  value: 285,
  label: 'BN(O) visa, 5 years',
  source: 'https://www.gov.uk/british-national-overseas-bno-visa/how-much-it-costs',
  verified: VERIFIED,
};

/** Ancestry visa application. gov.uk/ancestry-visa = £726. */
export const ANCESTRY_FEE: FeeFact = {
  value: 726,
  label: 'UK Ancestry visa',
  source: 'https://www.gov.uk/ancestry-visa',
  verified: VERIFIED,
};

/** Immigration Health Surcharge per year (adult). Derived from BN(O)
 *  cost page: £5,175 ÷ 5 = £1,035/year. */
export const IHS_ADULT_PER_YEAR: FeeFact = {
  value: 1035,
  label: 'IHS — adult, per year',
  source: 'https://www.gov.uk/british-national-overseas-bno-visa/how-much-it-costs',
  verified: VERIFIED,
};

/** Immigration Health Surcharge per year (child). £3,880 ÷ 5 = £776/year. */
export const IHS_CHILD_PER_YEAR: FeeFact = {
  value: 776,
  label: 'IHS — child / student, per year',
  source: 'https://www.gov.uk/british-national-overseas-bno-visa/how-much-it-costs',
  verified: VERIFIED,
};

/** Life in the UK Test — published fee, valid for life. */
export const LIFE_IN_UK_TEST: FeeFact = {
  value: 50,
  label: 'Life in the UK Test',
  source: 'https://www.gov.uk/life-in-the-uk-test',
  verified: VERIFIED,
};

/** Priority Visa service (non-settlement). 5-working-day decision. */
export const PRIORITY_FEE: FeeFact = {
  value: 500,
  label: 'Priority Visa service',
  source: 'https://www.gov.uk/government/publications/visa-regulations-revised-table',
  verified: VERIFIED,
};

/** Super Priority Visa service. 1 working-day decision. */
export const SUPER_PRIORITY_FEE: FeeFact = {
  value: 1000,
  label: 'Super Priority service',
  source: 'https://www.gov.uk/government/publications/visa-regulations-revised-table',
  verified: VERIFIED,
};

/** UK biometric appointment — free standard, premium £67-£200 at UKVCAS. */
export const BIOMETRIC_FEE_RANGE = '£0 standard · £67-£200 premium';

/* ────────────────────────────────────────────────
   Pre-built breakdowns per settlement route
─────────────────────────────────────────────── */

export interface BreakdownLine {
  label: string;
  amount: number;
  source: string;
}
export interface RouteBreakdown {
  id: string;
  title: string;
  lines: BreakdownLine[];
  total: number;
  perPerson: boolean;
  note: string;
}

/** ILR — applicant pays one ILR fee + LITUK. 8 Apr 2026 fee table: £3,226. */
export const ILR_BREAKDOWN: RouteBreakdown = {
  id: 'ilr',
  title: 'ILR cost for a single applicant',
  lines: [
    { label: 'ILR application (Set M/O/F)', amount: 3226, source: '8 Apr 2026 Home Office fee table' },
    { label: 'Life in the UK Test (one-off)', amount: 50, source: 'gov.uk/life-in-the-uk-test' },
  ],
  total: 3276,
  perPerson: true,
  note: 'Each dependent adult or child pays £3,226 application separately. Super Priority adds £1,000 per applicant.',
};

/** Long Residence — Set(LR) at £3,226 (same as standard ILR from 8 Apr 2026) + LITUK. */
export const LONG_RESIDENCE_BREAKDOWN: RouteBreakdown = {
  id: 'long-residence',
  title: 'Long Residence ILR cost for a single applicant',
  lines: [
    { label: 'Set(LR) application', amount: 3226, source: 'gov.uk/long-residence' },
    { label: 'Life in the UK Test (one-off)', amount: 50, source: 'gov.uk/life-in-the-uk-test' },
  ],
  total: 3276,
  perPerson: true,
  note: 'Same fee as standard 5-year ILR from 8 April 2026. Super Priority adds £1,000.',
};

/** Citizenship — single applicant going from ILR. */
export const CITIZENSHIP_BREAKDOWN: RouteBreakdown = {
  id: 'citizenship',
  title: 'British citizenship (adult) cost',
  lines: [
    { label: 'Naturalisation (Form AN) inc. ceremony', amount: 1839, source: 'gov.uk/apply-citizenship-indefinite-leave-to-remain' },
  ],
  total: 1839,
  perPerson: true,
  note: 'Includes £130 ceremony fee. Biometrics free. Children register on Form MN1 for £1,214.',
};

/** BNO 5-year route from arrival to ILR. ILR rose to £3,226 on 8 Apr 2026. */
export const BNO_TO_ILR_BREAKDOWN: RouteBreakdown = {
  id: 'bno-to-ilr',
  title: 'BN(O) 5-year route to ILR — single adult',
  lines: [
    { label: 'BN(O) visa (5 years)', amount: 285, source: 'gov.uk/british-national-overseas-bno-visa/how-much-it-costs' },
    { label: 'IHS for 5 years (adult)', amount: 5175, source: 'gov.uk/british-national-overseas-bno-visa/how-much-it-costs' },
    { label: 'ILR application (Set M)', amount: 3226, source: '8 Apr 2026 fee table + gov.uk/british-national-overseas-bno-visa/settle-in-the-uk' },
    { label: 'Life in the UK Test', amount: 50, source: 'gov.uk/life-in-the-uk-test' },
  ],
  total: 8736,
  perPerson: true,
  note: 'After ILR you can naturalise after 12 months (+£1,839). Children pay BNO £285 + IHS £3,880 + ILR £3,226.',
};

/** Ancestry 5-year route to ILR. ILR rose to £3,226 on 8 Apr 2026. */
export const ANCESTRY_TO_ILR_BREAKDOWN: RouteBreakdown = {
  id: 'ancestry-to-ilr',
  title: 'UK Ancestry 5-year route to ILR — single adult',
  lines: [
    { label: 'Ancestry visa', amount: 726, source: 'gov.uk/ancestry-visa' },
    { label: 'IHS for 5 years (adult)', amount: 5175, source: 'gov.uk/british-national-overseas-bno-visa/how-much-it-costs (rate)' },
    { label: 'ILR application (Set O)', amount: 3226, source: '8 Apr 2026 fee table' },
    { label: 'Life in the UK Test', amount: 50, source: 'gov.uk/life-in-the-uk-test' },
  ],
  total: 9177,
  perPerson: true,
  note: 'Spouse and dependent adults pay the same per person. Children: visa £726 + IHS £3,880 + ILR £3,226.',
};

/** EUSS — free at every stage. */
export const EUSS_BREAKDOWN: RouteBreakdown = {
  id: 'euss',
  title: 'EU Settlement Scheme cost',
  lines: [
    { label: 'EUSS application', amount: 0, source: 'gov.uk/settled-status-eu-citizens-families' },
    { label: 'Pre-settled → settled conversion', amount: 0, source: 'gov.uk/settled-status-eu-citizens-families' },
    { label: 'Biometrics (in-app via UK Immigration: ID Check)', amount: 0, source: 'gov.uk' },
  ],
  total: 0,
  perPerson: true,
  note: 'Free at every stage including conversion. Children of settled holders born in UK acquire British citizenship automatically.',
};

export const SETTLEMENT_BREAKDOWNS: Record<string, RouteBreakdown> = {
  ilr: ILR_BREAKDOWN,
  'long-residence': LONG_RESIDENCE_BREAKDOWN,
  citizenship: CITIZENSHIP_BREAKDOWN,
  bno: BNO_TO_ILR_BREAKDOWN,
  ancestry: ANCESTRY_TO_ILR_BREAKDOWN,
  euss: EUSS_BREAKDOWN,
};
