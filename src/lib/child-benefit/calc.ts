/**
 * UK Child Benefit + High Income Child Benefit Charge (HICBC) calculator.
 *
 * Source: gov.uk/child-benefit/what-youll-get
 *         gov.uk/child-benefit-tax-charge
 *
 * 2025/26 rates:
 * - Eldest / only child:     £25.60/week  (£1,331.20/year)
 * - Additional children:     £16.95/week  (£881.40/year)
 *
 * HICBC (from 6 April 2024):
 * - Lower threshold: £60,000 adjusted net income
 * - Upper threshold: £80,000 (full clawback)
 * - Taper: 1% for every £200 earned above £60,000
 *   → at £70,000 = 50% clawback, at £80,000 = 100%
 */

export const ELDEST_WEEKLY     = 25.60;
export const ADDITIONAL_WEEKLY = 16.95;
export const HICBC_LOWER       = 60_000;
export const HICBC_UPPER       = 80_000;

export interface CalcInput {
  children: number;           // total number of qualifying children
  higherEarnerIncome: number; // adjusted net income of the higher earner
}

export interface CalcResult {
  annualBenefit: number;
  weeklyBenefit: number;
  hicbcCharge: number;
  netBenefit: number;
  effectiveRate: number;      // HICBC as % of gross benefit
  isFullyClawedBack: boolean;
  clawbackPct: number;        // 0–100
}

export function calculateChildBenefit(input: CalcInput): CalcResult {
  const children = Math.max(0, Math.floor(input.children));
  const income   = Math.max(0, input.higherEarnerIncome);

  const weeklyBenefit =
    children === 0 ? 0 :
    ELDEST_WEEKLY + Math.max(0, children - 1) * ADDITIONAL_WEEKLY;
  const annualBenefit = weeklyBenefit * 52;

  const clawbackPct = income <= HICBC_LOWER ? 0
    : income >= HICBC_UPPER ? 100
    : Math.floor((income - HICBC_LOWER) / 200);

  const hicbcCharge = (annualBenefit * clawbackPct) / 100;
  const netBenefit  = annualBenefit - hicbcCharge;

  return {
    annualBenefit,
    weeklyBenefit,
    hicbcCharge,
    netBenefit,
    effectiveRate: annualBenefit > 0 ? clawbackPct / 100 : 0,
    isFullyClawedBack: clawbackPct >= 100,
    clawbackPct,
  };
}
