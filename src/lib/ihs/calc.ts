/**
 * UK Immigration Health Surcharge (IHS) calculator.
 *
 * Source: gov.uk/healthcare-immigration-application/pay
 *
 * 2024/25 rates (in force from 6 February 2024):
 *   Standard:          £1,035 per year per person
 *   Student / Youth Mobility Scheme: £776 per year per person
 *   Children under 18: same rate as adult (no reduction)
 *
 * Duration is rounded UP to the nearest full year for IHS purposes.
 * E.g. a 2-year 6-month visa = 3 years × rate.
 *
 * Dependants pay the same rate and duration as the main applicant.
 */

export const IHS_STANDARD = 1035;  // £/year
export const IHS_STUDENT  = 776;   // £/year (student + YMS)

export type VisaCategory = 'standard' | 'student';

export interface CalcInput {
  visaYears: number;
  visaMonths: number;  // additional months beyond whole years
  applicants: number;  // total including main applicant and dependants
  category: VisaCategory;
}

export interface CalcResult {
  ratePerYear: number;
  durationYears: number;        // rounded up to nearest year
  exactDurationYears: number;   // decimal
  perPersonTotal: number;
  totalIhs: number;
  perApplicant: number;
}

export function calculateIhs(input: CalcInput): CalcResult {
  const yrs  = Math.max(0, input.visaYears);
  const mths = Math.max(0, input.visaMonths);
  const apps = Math.max(1, Math.floor(input.applicants));
  const rate = input.category === 'student' ? IHS_STUDENT : IHS_STANDARD;

  const exactYears    = yrs + mths / 12;
  const roundedYears  = Math.ceil(exactYears);  // IHS rounds up
  const perPerson     = roundedYears * rate;
  const total         = perPerson * apps;

  return { ratePerYear: rate, durationYears: roundedYears, exactDurationYears: exactYears, perPersonTotal: perPerson, totalIhs: total, perApplicant: perPerson };
}
