/**
 * UK National Minimum Wage / National Living Wage checker — April 2025.
 *
 * Source: gov.uk/national-minimum-wage-rates
 *
 * Rates from 1 April 2025:
 *   National Living Wage (21+):       £12.21/hour
 *   18–20:                            £10.00/hour
 *   Under 18 (school leaving age+):   £7.55/hour
 *   Apprentice (under 19, or 19+ in first year): £7.55/hour
 */

export const NMW_RATES = {
  nlw:        12.21,  // 21+  National Living Wage
  age18to20:  10.00,  // 18–20
  under18:     7.55,  // school leaving age up to 17
  apprentice:  7.55,  // under 19, or 19+ in year 1 of apprenticeship
} as const;

export type WorkerCategory = keyof typeof NMW_RATES;

export interface CalcInput {
  age: number;
  isApprentice: boolean;
  apprenticeAge19PlusYear1: boolean;  // 19+ but in first year of apprenticeship
  hourlyRate: number;
  weeklyHours: number;
}

export interface CalcResult {
  category: WorkerCategory;
  minimumRate: number;
  actualRate: number;
  weeklyShortfall: number;
  annualShortfall: number;
  compliant: boolean;
  annualPay: number;
  annualMinimumPay: number;
}

export function determineCategory(age: number, isApprentice: boolean, apprenticeAge19PlusYear1: boolean): WorkerCategory {
  if (isApprentice && (age < 19 || apprenticeAge19PlusYear1)) return 'apprentice';
  if (age >= 21) return 'nlw';
  if (age >= 18) return 'age18to20';
  return 'under18';
}

export function calculateMinimumWage(input: CalcInput): CalcResult {
  const category    = determineCategory(input.age, input.isApprentice, input.apprenticeAge19PlusYear1);
  const minimumRate = NMW_RATES[category];
  const actual      = Math.max(0, input.hourlyRate);
  const hours       = Math.max(0, input.weeklyHours);
  const weeklyShort = Math.max(0, minimumRate - actual) * hours;
  const annual      = actual * hours * 52;
  const annualMin   = minimumRate * hours * 52;

  return { category, minimumRate, actualRate: actual, weeklyShortfall: weeklyShort, annualShortfall: weeklyShort * 52, compliant: actual >= minimumRate, annualPay: annual, annualMinimumPay: annualMin };
}
