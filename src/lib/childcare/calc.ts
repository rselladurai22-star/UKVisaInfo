/**
 * UK Childcare cost calculator — free hours + Tax-Free Childcare + UC support.
 *
 * Source: gov.uk/free-childcare-education-eligible-children
 *         gov.uk/tax-free-childcare
 *         gov.uk/universal-credit/what-youll-get (childcare element)
 *
 * Free hours (2025/26):
 *   Age 3–4 (all): 15 free hours/week, 38 weeks/year
 *   Age 3–4 (working parents, each earning ≤£100k): 30 free hours/week, 38 weeks
 *   Age 9m–3 (working parents, each earning ≤£100k): 15 free hours/week, 38 weeks
 *
 * Tax-Free Childcare (TFC):
 *   Government pays £2 for every £8 you pay in → 20% top-up
 *   Max government contribution: £500 per quarter (£2,000/year) per child
 *   Disabled children: £1,000/quarter (£4,000/year)
 *   Not available if either parent earns > £100k or on UC
 *
 * Universal Credit childcare element:
 *   85% of eligible childcare costs (max £1,014.63/month for 1 child, £1,739.37 for 2+)
 *
 * NOTE: TFC and UC childcare are mutually exclusive.
 */

export const FREE_HOURS_UNIVERSAL   = 15;   // age 3–4, all
export const FREE_HOURS_EXTENDED    = 30;   // age 3–4, working parents
export const FREE_WEEKS             = 38;

export const TFC_GOVT_MAX_YEAR_STD  = 2000;
export const TFC_GOVT_MAX_YEAR_DIS  = 4000;
export const UC_CHILDCARE_MAX_1     = 1014.63 * 12;
export const UC_CHILDCARE_MAX_2PLUS = 1739.37 * 12;

export interface CalcInput {
  childAgeMonths: number;
  weeklyHoursNeeded: number;
  hourlyRate: number;          // local provider rate £/hr
  weeksPerYear: number;        // typically 50–52 for working parents
  workingParents: boolean;
  bothEarnUnder100k: boolean;
  onUniversalCredit: boolean;
  disabled: boolean;
  numberOfChildren: number;    // for UC cap
}

export interface CalcResult {
  grossAnnualCost: number;
  freeHoursAnnual: number;
  freeHoursSaving: number;
  afterFreeHours: number;
  tfcGovtContrib: number;
  afterTfc: number;
  ucChildcareSupport: number;
  netWithTfc: number;
  netWithUc: number;
  bestOption: 'TFC' | 'UC' | 'neither';
  monthlyCostTfc: number;
  monthlyCostUc: number;
}

export function calculateChildcare(input: CalcInput): CalcResult {
  const ageMonths = Math.max(0, input.childAgeMonths);
  const hoursNeeded = Math.max(0, input.weeklyHoursNeeded);
  const rate      = Math.max(0, input.hourlyRate);
  const weeks     = Math.max(0, input.weeksPerYear);

  const grossAnnual = hoursNeeded * rate * weeks;

  // Free hours
  let freeHours = 0;
  if (ageMonths >= 36) freeHours = FREE_HOURS_UNIVERSAL;           // 3–4: 15 for all
  if (ageMonths >= 36 && input.workingParents && input.bothEarnUnder100k) freeHours = FREE_HOURS_EXTENDED;  // 30hrs
  if (ageMonths >= 9 && ageMonths < 36 && input.workingParents && input.bothEarnUnder100k) freeHours = FREE_HOURS_EXTENDED;  // 30hrs 9m–3 (from Sept 2025)

  const freeHoursAnnual  = freeHours * FREE_WEEKS * rate;
  const afterFreeHours   = Math.max(0, grossAnnual - freeHoursAnnual);

  // Tax-Free Childcare (not available on UC or if either parent > £100k)
  let tfcGovtContrib = 0;
  if (!input.onUniversalCredit && input.bothEarnUnder100k) {
    const maxGovt = input.disabled ? TFC_GOVT_MAX_YEAR_DIS : TFC_GOVT_MAX_YEAR_STD;
    tfcGovtContrib = Math.min(afterFreeHours * 0.20, maxGovt);
  }
  const afterTfc = Math.max(0, afterFreeHours - tfcGovtContrib);

  // UC childcare (85% of eligible costs up to cap)
  let ucChildcareSupport = 0;
  if (input.onUniversalCredit) {
    const cap = input.numberOfChildren >= 2 ? UC_CHILDCARE_MAX_2PLUS : UC_CHILDCARE_MAX_1;
    ucChildcareSupport = Math.min(afterFreeHours * 0.85, cap);
  }
  const afterUc = Math.max(0, afterFreeHours - ucChildcareSupport);

  const bestOption: CalcResult['bestOption'] = input.onUniversalCredit ? 'UC'
    : tfcGovtContrib > 0 ? 'TFC'
    : 'neither';

  return {
    grossAnnualCost: grossAnnual,
    freeHoursAnnual,
    freeHoursSaving: freeHoursAnnual,
    afterFreeHours,
    tfcGovtContrib,
    afterTfc,
    ucChildcareSupport,
    netWithTfc: afterTfc,
    netWithUc: afterUc,
    bestOption,
    monthlyCostTfc: afterTfc / 12,
    monthlyCostUc: afterUc / 12,
  };
}
