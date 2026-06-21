/**
 * UK Lifetime ISA (LISA) calculator, 2025/26.
 *
 * Source: gov.uk/lifetime-isa
 *
 * Rules:
 *   - Must be 18 to 39 to open; can contribute until age 50
 *   - Annual contribution limit: £4,000 (counts toward £20k ISA allowance)
 *   - Government bonus: 25% of contributions (max £1,000/year)
 *   - Accessible without penalty:
 *       1. First home purchase (property ≤ £450,000), after 12 months of first contribution
 *       2. After age 60 (retirement)
 *       3. Terminal illness diagnosis
 *   - Withdrawal penalty (any other reason): 25% of total withdrawal
 *       → Effectively removes bonus AND costs 6.25% of your own money
 */

export const LISA_ANNUAL_LIMIT  = 4000;
export const LISA_BONUS_RATE    = 0.25;
export const LISA_BONUS_MAX     = 1000;  // per year
export const LISA_PENALTY_RATE  = 0.25;  // of total withdrawal
export const LISA_MAX_PROPERTY  = 450000;

export interface CalcInput {
  annualContribution: number;
  currentAge: number;
  targetAge: number;       // age at which LISA is accessed
  annualGrowthPct: number;
  purpose: 'home' | 'retirement' | 'other';
}

export interface YearRow {
  age: number;
  yearlyContrib: number;
  yearlyBonus: number;
  growth: number;
  endValue: number;
}

export interface CalcResult {
  totalContributions: number;
  totalBonuses: number;
  totalInvested: number;
  projectedValue: number;
  growth: number;
  penaltyIfWithdrawn: number;  // only if purpose === 'other'
  netIfPenaltyApplied: number;
  yearsContributing: number;
  breakdown: YearRow[];
}

export function calculateLifetimeIsa(input: CalcInput): CalcResult {
  const currentAge = Math.max(18, Math.min(39, input.currentAge));
  const targetAge  = Math.max(currentAge + 1, input.targetAge);
  const contribStop = 50; // contributions stop at 50
  const annualContrib = Math.min(LISA_ANNUAL_LIMIT, Math.max(0, input.annualContribution));
  const rate       = Math.max(0, input.annualGrowthPct) / 100;

  let value = 0;
  let totalContrib = 0;
  let totalBonus   = 0;
  const breakdown: YearRow[] = [];

  for (let age = currentAge; age < targetAge; age++) {
    const canContribute = age < contribStop;
    const yearContrib   = canContribute ? annualContrib : 0;
    const yearBonus     = canContribute ? Math.min(yearContrib * LISA_BONUS_RATE, LISA_BONUS_MAX) : 0;
    const invested      = yearContrib + yearBonus;
    const growthAmt     = (value + invested) * rate;
    value = value + invested + growthAmt;
    totalContrib += yearContrib;
    totalBonus   += yearBonus;
    breakdown.push({ age, yearlyContrib: yearContrib, yearlyBonus: yearBonus, growth: growthAmt, endValue: value });
  }

  const penaltyIfWithdrawn = input.purpose === 'other' ? value * LISA_PENALTY_RATE : 0;
  const netIfPenalty = value - penaltyIfWithdrawn;

  return {
    totalContributions: totalContrib,
    totalBonuses: totalBonus,
    totalInvested: totalContrib + totalBonus,
    projectedValue: value,
    growth: value - totalContrib - totalBonus,
    penaltyIfWithdrawn,
    netIfPenaltyApplied: netIfPenalty,
    yearsContributing: Math.min(contribStop, targetAge) - currentAge,
    breakdown,
  };
}
