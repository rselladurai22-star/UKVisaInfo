/**
 * UK Marriage Allowance calculator.
 *
 * Source: gov.uk/marriage-allowance
 *
 * 2025/26:
 * - Transfer amount:  £1,260 of Personal Allowance (10% of £12,570, rounded)
 * - Annual saving:    £1,260 × 20% = £252
 * - Backdating:       up to 4 prior tax years (all must qualify)
 */

export const TRANSFER_AMOUNT = 1260;
export const BASIC_RATE      = 0.20;
export const ANNUAL_SAVING   = TRANSFER_AMOUNT * BASIC_RATE;  // £252

export const BACKDATE_YEARS = [
  { year: '2021/22', saving: 252 },
  { year: '2022/23', saving: 252 },
  { year: '2023/24', saving: 252 },
  { year: '2024/25', saving: 252 },
] as const;

export interface CalcInput {
  lowerEarnerIncome: number;
  higherEarnerIncome: number;
  backdateYears: 0 | 1 | 2 | 3 | 4;
}

export interface CalcResult {
  eligible: boolean;
  ineligibleReason?: string;
  annualSaving: number;
  backdateSaving: number;
  totalSaving: number;
  yearsBackdated: readonly { year: string; saving: number }[];
}

const PA        = 12570;
const BASIC_TOP = 50270;

export function calculateMarriageAllowance(input: CalcInput): CalcResult {
  const lower  = Math.max(0, input.lowerEarnerIncome);
  const higher = Math.max(0, input.higherEarnerIncome);
  const years  = Math.min(4, Math.max(0, input.backdateYears));

  if (lower >= PA) {
    return { eligible: false, ineligibleReason: `Lower earner income (£${lower.toLocaleString()}) must be below the Personal Allowance (£${PA.toLocaleString()}).`, annualSaving: 0, backdateSaving: 0, totalSaving: 0, yearsBackdated: [] };
  }
  if (higher > BASIC_TOP) {
    return { eligible: false, ineligibleReason: `Higher earner income (£${higher.toLocaleString()}) is above basic rate — Marriage Allowance not available.`, annualSaving: 0, backdateSaving: 0, totalSaving: 0, yearsBackdated: [] };
  }
  if (higher <= PA) {
    return { eligible: false, ineligibleReason: `Higher earner (£${higher.toLocaleString()}) pays no Income Tax — no benefit to transfer to.`, annualSaving: 0, backdateSaving: 0, totalSaving: 0, yearsBackdated: [] };
  }

  const backdateSlice = BACKDATE_YEARS.slice(0, years);
  const backdateSaving = backdateSlice.reduce((s, y) => s + y.saving, 0);

  return {
    eligible: true,
    annualSaving: ANNUAL_SAVING,
    backdateSaving,
    totalSaving: ANNUAL_SAVING + backdateSaving,
    yearsBackdated: backdateSlice,
  };
}
