/**
 * UK Pension drawdown calculator.
 *
 * Source: gov.uk/tax-on-pension
 *         gov.uk/pension-lump-sum
 *
 * Models flexible drawdown from a defined contribution (DC) pension:
 *   - 25% Tax-Free Lump Sum (TFLS) — Pension Commencement Lump Sum (PCLS)
 *     Capped at £268,275 (Lump Sum Allowance from April 2024)
 *   - Remaining 75% enters the drawdown pot
 *   - Withdrawals from drawdown are taxable as income
 *   - Projects years until pot depleted at a given withdrawal + growth rate
 */

export const TFLS_PCT     = 0.25;
export const LUMP_SUM_ALLOWANCE = 268275;  // max tax-free lump sum from April 2024

export interface CalcInput {
  potSize: number;
  annualWithdrawal: number;   // gross target income from pension (before tax)
  annualGrowthPct: number;    // assumed annual growth on invested pot
  takeTfls: boolean;          // take 25% TFLS upfront
  otherIncome: number;        // other taxable income (state pension, employment etc)
}

export interface YearRow {
  year: number;
  startValue: number;
  withdrawal: number;
  growth: number;
  endValue: number;
}

export interface CalcResult {
  taxFreeLumpSum: number;
  drawdownPot: number;
  yearsUntilDeplete: number | null;  // null = pot survives 50 years
  totalWithdrawn: number;
  breakdown: YearRow[];              // up to 50 years
}

const PA         = 12570; const BASIC_TOP = 50270; const HIGHER_TOP = 125140;
const IT_BASIC   = 0.20;  const IT_HIGHER = 0.40;  const IT_ADD = 0.45;

function taxOnWithdrawal(withdrawal: number, otherIncome: number): number {
  const total = withdrawal + otherIncome;
  const pa    = total > 125140 ? 0 : total > 100000 ? Math.max(0, PA - (total - 100000) / 2) : PA;
  const pointer = Math.max(otherIncome, pa);
  let it = 0, rem = withdrawal, ptr = pointer;
  if (rem > 0 && ptr < BASIC_TOP)  { const s = Math.min(rem, BASIC_TOP  - ptr); it += s * IT_BASIC;  rem -= s; ptr += s; }
  if (rem > 0 && ptr < HIGHER_TOP) { const s = Math.min(rem, HIGHER_TOP - ptr); it += s * IT_HIGHER; rem -= s; }
  if (rem > 0) it += rem * IT_ADD;
  return it;
}

export function calculatePensionDrawdown(input: CalcInput): CalcResult {
  const pot    = Math.max(0, input.potSize);
  const growth = Math.max(0, input.annualGrowthPct) / 100;

  const tfls       = input.takeTfls ? Math.min(pot * TFLS_PCT, LUMP_SUM_ALLOWANCE) : 0;
  const drawPot    = pot - tfls;
  const withdrawal = Math.max(0, input.annualWithdrawal);
  const other      = Math.max(0, input.otherIncome);

  const breakdown: YearRow[] = [];
  let remaining = drawPot;
  let totalWithdrawn = 0;
  let deplete: number | null = null;
  const MAX_YEARS = 50;

  for (let y = 1; y <= MAX_YEARS; y++) {
    if (remaining <= 0) { deplete = y - 1; break; }
    const start       = remaining;
    const grossWithd  = Math.min(withdrawal, remaining);
    const tax         = taxOnWithdrawal(grossWithd, other);
    const netWithd    = grossWithd - tax;
    remaining         = Math.max(0, remaining - grossWithd);
    const growthAmt   = remaining * growth;
    remaining        += growthAmt;
    totalWithdrawn   += netWithd;
    breakdown.push({ year: y, startValue: start, withdrawal: netWithd, growth: growthAmt, endValue: remaining });
    if (remaining <= 0 && deplete === null) { deplete = y; break; }
  }

  return { taxFreeLumpSum: tfls, drawdownPot: drawPot, yearsUntilDeplete: deplete, totalWithdrawn, breakdown };
}
