/**
 * UK State Pension forecaster (new State Pension, post-2016 system).
 *
 * Headline: 35 qualifying NI years for the full new State Pension.
 *   – 2025/26 full new State Pension:        £230.25/week (Triple Lock, +4.1% from £221.20)
 *   – Minimum to qualify at all:             10 years
 *   – Pro-rata between 10 and 35:            (years / 35) × full
 *
 * Voluntary Class 3 NIC (to fill gaps): £17.45/week in 2024/25 ≈ £907/year per
 * qualifying year added. Buying one extra year therefore costs ~£907 and
 * adds about (1/35) × £230.25 × 52 ≈ £342/year of pension — break-even in
 * roughly 2 years 8 months of receipt.
 *
 * Sources: gov.uk – "The new State Pension"; DWP State Pension rates 2025/26.
 *
 * NOTE: 2026/27 figures published April 2026; refresh values when next
 * year's rate is announced.
 */

export const FULL_WEEKLY_2025_26 = 230.25;
export const FULL_QUALIFYING_YEARS = 35;
export const MIN_YEARS = 10;
export const VOLUNTARY_CLASS_3_ANNUAL = 907; // approx

export interface SpInput {
  qualifyingYears: number;
  /** Years until retirement, so we can model "add more years" scenarios */
  yearsUntilRetirement?: number;
}

export interface SpResult {
  qualifyingYears: number;
  belowMinimum: boolean;
  weeklyForecast: number;
  monthlyForecast: number;
  annualForecast: number;
  shortfallVsFull: number;       // weekly £ shortfall
  yearsToFull: number;           // years needed to reach 35
  canReachFull: boolean;         // given yearsUntilRetirement
  costToBuyOneYear: number;
  weeklyGainPerExtraYear: number;
}

export function calcStatePension(input: SpInput): SpResult {
  const years = Math.max(0, Math.floor(input.qualifyingYears));
  const cappedYears = Math.min(years, FULL_QUALIFYING_YEARS);

  const belowMinimum = years < MIN_YEARS;
  const weekly = belowMinimum ? 0 : (cappedYears / FULL_QUALIFYING_YEARS) * FULL_WEEKLY_2025_26;
  const weeklyPerYear = FULL_WEEKLY_2025_26 / FULL_QUALIFYING_YEARS;

  const yearsToFull = Math.max(0, FULL_QUALIFYING_YEARS - years);
  const yur = input.yearsUntilRetirement ?? 99;
  const canReachFull = yearsToFull <= yur;

  return {
    qualifyingYears: years,
    belowMinimum,
    weeklyForecast: weekly,
    monthlyForecast: weekly * 52 / 12,
    annualForecast: weekly * 52,
    shortfallVsFull: FULL_WEEKLY_2025_26 - weekly,
    yearsToFull,
    canReachFull,
    costToBuyOneYear: VOLUNTARY_CLASS_3_ANNUAL,
    weeklyGainPerExtraYear: weeklyPerYear,
  };
}
