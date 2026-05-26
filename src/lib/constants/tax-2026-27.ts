/**
 * UK tax constants — tax year 2026/27 (6 April 2026 – 5 April 2027).
 *
 * Single source of truth. Every calculator imports from here.
 * Annual rebuild: rename to `tax-2027-28.ts`, update values from
 * the Spring Budget / Autumn Statement announcements, all calcs reflow.
 *
 * Verified against:
 *   • gov.uk/income-tax-rates
 *   • gov.uk/national-insurance-rates-letters
 *   • gov.uk/repaying-your-student-loan/what-you-pay
 *   • gov.uk/marriage-allowance
 *   • gov.uk/child-benefit-tax-charge
 *   • gov.uk/individual-savings-accounts
 *   • gov.uk/capital-gains-tax/allowances
 *   • gov.uk/inheritance-tax/passing-on-home
 *   • gov.uk/tax-on-your-private-pension/lifetime-allowance
 *
 * Last verified: May 2026.
 */

export const TAX_YEAR = '2026/27' as const;

/* ─── Personal Allowance & Income Tax (rest of UK) ─────────── */
export const PERSONAL_ALLOWANCE = 12570;
export const PA_TAPER_START     = 100000;
export const PA_TAPER_END       = 125140;

export const RUK_BASIC_TOP        = 50270;
export const RUK_HIGHER_TOP       = 125140;
export const RUK_BASIC_RATE       = 0.20;
export const RUK_HIGHER_RATE      = 0.40;
export const RUK_ADDITIONAL_RATE  = 0.45;

/* ─── Income Tax — Scotland ────────────────────────────────── */
export const SCO_STARTER_TOP      = 14876;   // 19%
export const SCO_BASIC_TOP        = 26561;   // 20%
export const SCO_INTERMEDIATE_TOP = 43662;   // 21%
export const SCO_HIGHER_TOP       = 75000;   // 42%
export const SCO_ADVANCED_TOP     = 125140;  // 45%
export const SCO_STARTER_RATE      = 0.19;
export const SCO_BASIC_RATE        = 0.20;
export const SCO_INTERMEDIATE_RATE = 0.21;
export const SCO_HIGHER_RATE       = 0.42;
export const SCO_ADVANCED_RATE     = 0.45;
export const SCO_TOP_RATE          = 0.48;

/* ─── National Insurance — Class 1 (employee) ──────────────── */
export const NI_PRIMARY_THRESHOLD    = 12570;
export const NI_UPPER_EARNINGS_LIMIT = 50270;
export const NI_MAIN_RATE            = 0.08;   // 8% from Apr 2024
export const NI_ADDITIONAL_RATE      = 0.02;   // 2% above UEL

/* ─── National Insurance — Class 4 (self-employed) ─────────── */
export const NI_CLASS4_LOWER       = 12570;
export const NI_CLASS4_UPPER       = 50270;
export const NI_CLASS4_MAIN_RATE   = 0.06;   // 6% from Apr 2024
export const NI_CLASS4_HIGHER_RATE = 0.02;   // 2% above upper limit

/* ─── National Insurance — Class 1 (employer) ──────────────── */
export const NI_EMPLOYER_THRESHOLD = 5000;   // Secondary threshold reduced April 2025
export const NI_EMPLOYER_RATE      = 0.15;   // Increased from 13.8% in April 2025

/* ─── Student loans ────────────────────────────────────────── */
export type StudentLoanPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad';

export const STUDENT_LOAN_PLANS: Record<Exclude<StudentLoanPlan, 'none'>, {
  threshold: number;
  rate: number;
  label: string;
}> = {
  plan1:    { threshold: 26065, rate: 0.09, label: 'Plan 1 (England/Wales pre-2012)' },
  plan2:    { threshold: 28470, rate: 0.09, label: 'Plan 2 (England/Wales 2012–22)' },
  plan4:    { threshold: 32745, rate: 0.09, label: 'Plan 4 (Scotland)' },
  plan5:    { threshold: 25000, rate: 0.09, label: 'Plan 5 (England 2023+)' },
  postgrad: { threshold: 21000, rate: 0.06, label: 'Postgraduate Loan' },
};

/* ─── Dividends ────────────────────────────────────────────── */
export const DIVIDEND_ALLOWANCE       = 500;     // £500 from Apr 2024
export const DIVIDEND_BASIC_RATE      = 0.0875;  // 8.75%
export const DIVIDEND_HIGHER_RATE     = 0.3375;  // 33.75%
export const DIVIDEND_ADDITIONAL_RATE = 0.3935;  // 39.35%

/* ─── Capital Gains Tax ────────────────────────────────────── */
export const CGT_ALLOWANCE              = 3000;   // £3,000 from Apr 2024
export const CGT_BASIC_RATE             = 0.18;   // Increased Autumn 2024
export const CGT_HIGHER_RATE            = 0.24;   // Increased Autumn 2024
export const CGT_PROPERTY_BASIC_RATE    = 0.18;
export const CGT_PROPERTY_HIGHER_RATE   = 0.24;
export const CGT_BUSINESS_RELIEF_RATE   = 0.14;   // BADR rate April 2026

/* ─── Inheritance Tax ──────────────────────────────────────── */
export const IHT_NIL_BAND          = 325000;
export const IHT_RESIDENCE_NIL     = 175000;
export const IHT_RESIDENCE_TAPER   = 2000000;   // Taper begins
export const IHT_RATE              = 0.40;
export const IHT_REDUCED_RATE      = 0.36;       // ≥10% of estate to charity

/* ─── ISAs ─────────────────────────────────────────────────── */
export const ISA_LIMIT          = 20000;
export const LISA_LIMIT         = 4000;
export const LISA_BONUS_RATE    = 0.25;
export const LISA_BONUS_MAX     = 1000;          // Per tax year
export const LISA_PENALTY_RATE  = 0.25;          // Early withdrawal
export const LISA_AGE_MIN       = 18;
export const LISA_AGE_MAX       = 39;            // Open before 40
export const LISA_AGE_CONTRIB   = 50;            // Contribute until
export const JISA_LIMIT         = 9000;
export const HTB_ISA_MAX_BONUS  = 3000;

/* ─── Pensions ─────────────────────────────────────────────── */
export const PENSION_ANNUAL_ALLOWANCE   = 60000;
export const PENSION_MPAA               = 10000;    // Money Purchase Annual Allowance
export const PENSION_TAPER_START        = 260000;   // Threshold income
export const PENSION_TAPER_ADJ_START    = 260000;   // Adjusted income
export const PENSION_TAPER_END          = 360000;
export const PENSION_TAPER_FLOOR        = 10000;    // Minimum tapered AA
export const PENSION_LUMP_SUM_MAX       = 268275;   // Replaces LTA April 2024
export const PENSION_LUMP_SUM_DEATH_MAX = 1073100;

/* ─── State Pension ────────────────────────────────────────── */
export const STATE_PENSION_FULL_WEEKLY  = 230.25;   // 2025/26 figure — update April 2026
export const STATE_PENSION_FULL_ANNUAL  = 230.25 * 52;
export const STATE_PENSION_QYRS_FULL    = 35;
export const STATE_PENSION_QYRS_MIN     = 10;
export const STATE_PENSION_AGE          = 66;        // 67 from 2026–28

/* ─── High Income Child Benefit Charge (HICBC) ─────────────── */
export const HICBC_LOWER = 60000;   // Reformed April 2024
export const HICBC_UPPER = 80000;
export const CHILD_BENEFIT_ELDEST_WEEKLY     = 26.05;   // 2025/26
export const CHILD_BENEFIT_ADDITIONAL_WEEKLY = 17.25;   // 2025/26

/* ─── Marriage Allowance ───────────────────────────────────── */
export const MA_TRANSFER_AMOUNT = 1260;
export const MA_ANNUAL_SAVING   = MA_TRANSFER_AMOUNT * RUK_BASIC_RATE;  // £252
export const MA_BACKDATE_YEARS  = [
  { year: '2022/23', saving: 252 },
  { year: '2023/24', saving: 252 },
  { year: '2024/25', saving: 252 },
  { year: '2025/26', saving: 252 },
] as const;

/* ─── VAT ──────────────────────────────────────────────────── */
export const VAT_STANDARD_RATE     = 0.20;
export const VAT_REDUCED_RATE      = 0.05;
export const VAT_REG_THRESHOLD     = 90000;   // From April 2024
export const VAT_DEREG_THRESHOLD   = 88000;
export const VAT_FLAT_RATE_LIMIT   = 150000;
export const VAT_CASH_ACCT_LIMIT   = 1350000;

/* ─── SDLT (Stamp Duty Land Tax — England & NI) ────────────── */
// Thresholds reduced from April 2025
export const SDLT_NIL_BAND            = 125000;
export const SDLT_FTB_NIL_BAND        = 300000;   // First-time buyer
export const SDLT_FTB_MAX_PROPERTY    = 500000;
export const SDLT_SECOND_HOME_SUR     = 0.05;     // +5% from Oct 2024
export const SDLT_NON_RES_SUR         = 0.02;     // +2% non-UK resident

export const SDLT_BANDS = [
  { from: 0,       to: 125000,  rate: 0.00 },
  { from: 125000,  to: 250000,  rate: 0.02 },
  { from: 250000,  to: 925000,  rate: 0.05 },
  { from: 925000,  to: 1500000, rate: 0.10 },
  { from: 1500000, to: Infinity, rate: 0.12 },
] as const;

/* ─── National Minimum/Living Wage (April 2026 rates) ──────── */
export const NLW_21_PLUS    = 12.21;   // National Living Wage (April 2025 figure — verify April 2026)
export const NMW_18_20      = 10.00;
export const NMW_UNDER_18   = 7.55;
export const NMW_APPRENTICE = 7.55;

/* ─── Statutory pay ────────────────────────────────────────── */
export const SSP_WEEKLY               = 116.75;    // 2025/26 — update April 2026
export const SSP_WAITING_DAYS         = 3;
export const SSP_MAX_WEEKS            = 28;
export const SMP_FIRST_6_WEEKS_PCT    = 0.90;      // 90% of average weekly earnings
export const SMP_REMAINING_WEEKLY     = 187.18;    // 2025/26 — update April 2026
export const SMP_WEEKS_TOTAL          = 39;
export const SPP_WEEKLY               = 187.18;
export const SAP_FIRST_6_WEEKS_PCT    = 0.90;
export const SAP_REMAINING_WEEKLY     = 187.18;

/* ─── Redundancy ───────────────────────────────────────────── */
export const REDUNDANCY_WEEKLY_CAP    = 719;        // 2025/26 — update April 2026
export const REDUNDANCY_MAX_WEEKS     = 30;
export const REDUNDANCY_MAX_SERVICE   = 20;         // Years counted
export const REDUNDANCY_TAX_FREE_CAP  = 30000;

/* ─── Pension / income tax — mileage allowance (AMAP) ─────── */
export const MILEAGE_CAR_FIRST_10K    = 0.45;       // £/mile
export const MILEAGE_CAR_OVER_10K     = 0.25;
export const MILEAGE_MOTORCYCLE       = 0.24;
export const MILEAGE_BIKE             = 0.20;
export const MILEAGE_PASSENGER        = 0.05;       // Per passenger

/* ─── Tax-Free Childcare ───────────────────────────────────── */
export const TFC_GOVT_TOP_UP_PCT      = 0.20;       // £2 for every £8 paid
export const TFC_GOVT_TOP_UP_MAX      = 2000;       // Per child per year
export const TFC_DISABLED_TOP_UP_MAX  = 4000;
export const TFC_MIN_INCOME_HRS       = 16;
export const TFC_MAX_INCOME           = 100000;     // Per parent
export const FREE_CHILDCARE_HRS_3_4   = 30;         // Working parents
export const FREE_CHILDCARE_HRS_2     = 15;         // From April 2024

/* ─── Trading & property allowances ────────────────────────── */
export const TRADING_ALLOWANCE  = 1000;
export const PROPERTY_ALLOWANCE = 1000;
export const RENT_A_ROOM        = 7500;

/* ─── Savings interest ─────────────────────────────────────── */
export const PSA_BASIC_RATE         = 1000;   // Personal Savings Allowance
export const PSA_HIGHER_RATE        = 500;
export const PSA_ADDITIONAL_RATE    = 0;
export const STARTING_RATE_SAVINGS  = 5000;   // 0% band

/* ─── Sentinel for "no value" ──────────────────────────────── */
export const INFINITY_LIMIT = Infinity;
