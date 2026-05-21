/**
 * UK ISA allowance + compound growth calculator — 2025/26.
 *
 * Source: gov.uk/individual-savings-accounts
 *         gov.uk/lifetime-isa
 *
 * 2025/26 allowances:
 *   Total ISA:   £20,000/year
 *   LISA:        £4,000/year (counts toward £20k total)
 *   JISA:        £9,000/year (separate allowance for under-18s)
 *
 * LISA bonus: 25% government top-up (max £1,000/year) on contributions
 * LISA accessible: first home (≤ £450k) or age 60+; 25% penalty otherwise
 *
 * NOTE: Stocks & Shares ISA growth is illustrative — not guaranteed.
 */

export const ISA_ANNUAL_LIMIT  = 20000;
export const LISA_ANNUAL_LIMIT = 4000;
export const LISA_BONUS_RATE   = 0.25;
export const LISA_BONUS_MAX    = 1000;
export const JISA_ANNUAL_LIMIT = 9000;

export type IsaType = 'cash' | 'stocks' | 'lisa' | 'jisa';

export interface IsaAllocation {
  type: IsaType;
  annualContribution: number;
  annualReturnPct: number;  // assumed growth rate
  years: number;
}

export interface CalcResult {
  totalContributions: number;
  lisaBonus: number;
  totalInvested: number;
  projectedValue: number;
  growth: number;
  yearlyBreakdown: { year: number; value: number; contributions: number }[];
  allowanceUsed: number;
  allowanceRemaining: number;
  isOverAllowance: boolean;
}

export function calculateIsa(allocation: IsaAllocation): CalcResult {
  const contrib  = Math.max(0, allocation.annualContribution);
  const rate     = Math.max(0, allocation.annualReturnPct) / 100;
  const years    = Math.max(1, Math.floor(allocation.years));

  const isLisa   = allocation.type === 'lisa';
  const cappedContrib = isLisa ? Math.min(contrib, LISA_ANNUAL_LIMIT) : contrib;
  const annualBonus   = isLisa ? Math.min(cappedContrib * LISA_BONUS_RATE, LISA_BONUS_MAX) : 0;
  const annualInvested = cappedContrib + annualBonus;

  let value = 0;
  let totalContributions = 0;
  let totalBonus = 0;
  const yearlyBreakdown: CalcResult['yearlyBreakdown'] = [];

  for (let y = 1; y <= years; y++) {
    value = (value + annualInvested) * (1 + rate);
    totalContributions += cappedContrib;
    totalBonus += annualBonus;
    yearlyBreakdown.push({ year: y, value, contributions: totalContributions });
  }

  const allowanceUsed = isLisa ? cappedContrib : allocation.type === 'jisa' ? 0 : cappedContrib;
  const allowanceRemaining = isLisa ? LISA_ANNUAL_LIMIT - cappedContrib : ISA_ANNUAL_LIMIT - allowanceUsed;

  return {
    totalContributions,
    lisaBonus: totalBonus,
    totalInvested: totalContributions + totalBonus,
    projectedValue: value,
    growth: value - totalContributions - totalBonus,
    yearlyBreakdown,
    allowanceUsed,
    allowanceRemaining: Math.max(0, allowanceRemaining),
    isOverAllowance: contrib > (isLisa ? LISA_ANNUAL_LIMIT : ISA_ANNUAL_LIMIT),
  };
}
