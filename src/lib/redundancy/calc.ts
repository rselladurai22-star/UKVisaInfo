/**
 * UK Statutory Redundancy Pay calculator.
 *
 * Source: gov.uk/calculate-your-redundancy-pay
 *         gov.uk/redundancy-your-rights
 *
 * Rules (2026):
 * - Must have ≥ 2 years' continuous service with the employer.
 * - For each full year of service:
 *     · age < 22  → 0.5 week's pay
 *     · age 22 to 40 → 1.0 week's pay
 *     · age 41+  → 1.5 weeks' pay
 * - Maximum 20 years of service counted.
 * - Weekly pay is capped (statutory limit, reviewed annually each April).
 *   - £700/week from 6 April 2024
 *   - £719/week from 6 April 2025
 *   - WEEKLY_CAP below holds the latest known statutory limit.
 * - Statutory redundancy pay is tax-free up to £30,000.
 *
 * Note: Service is counted at the date of dismissal (not notice). Age is
 * the age you'll be on the date employment ends.
 */

/** Statutory weekly cap. Update when gov.uk publishes the next April review. */
export const WEEKLY_CAP = 719;
export const WEEKLY_CAP_FROM = '6 April 2025';
export const MAX_YEARS = 20;
export const TAX_FREE_CAP = 30000;

export interface CalcInput {
  age: number;             // age at end of employment
  yearsService: number;    // complete years (round down)
  weeklyPay: number;       // gross weekly pay, capped internally
}

export interface YearSlice {
  yearOfService: number;
  ageInYear: number;
  weeksMultiplier: number;
  amount: number;
}

export interface CalcResult {
  eligible: boolean;
  reason?: string;
  cappedWeeklyPay: number;
  totalWeeks: number;
  statutoryPay: number;
  taxFree: number;
  taxable: number;
  slices: YearSlice[];
}

export function calculateRedundancy(input: CalcInput): CalcResult {
  const age = Math.floor(input.age);
  const years = Math.min(MAX_YEARS, Math.floor(input.yearsService));
  const weeklyPay = Math.max(0, input.weeklyPay);
  const cappedWeeklyPay = Math.min(weeklyPay, WEEKLY_CAP);

  if (years < 2) {
    return {
      eligible: false,
      reason: 'You need at least 2 years\' continuous service to qualify for statutory redundancy pay.',
      cappedWeeklyPay,
      totalWeeks: 0,
      statutoryPay: 0,
      taxFree: 0,
      taxable: 0,
      slices: [],
    };
  }

  /* Walk back from age-at-dismissal, banding each year. */
  const slices: YearSlice[] = [];
  let totalWeeks = 0;
  for (let i = 0; i < years; i++) {
    const ageInYear = age - i;       // age during this year of service (approx)
    const mul = ageInYear >= 41 ? 1.5 : ageInYear >= 22 ? 1.0 : 0.5;
    const amount = mul * cappedWeeklyPay;
    slices.unshift({ yearOfService: years - i, ageInYear, weeksMultiplier: mul, amount });
    totalWeeks += mul;
  }

  const statutoryPay = totalWeeks * cappedWeeklyPay;
  const taxFree = Math.min(statutoryPay, TAX_FREE_CAP);
  const taxable = Math.max(0, statutoryPay - TAX_FREE_CAP);

  return {
    eligible: true,
    cappedWeeklyPay,
    totalWeeks,
    statutoryPay,
    taxFree,
    taxable,
    slices,
  };
}
