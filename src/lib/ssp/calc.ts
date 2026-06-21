/**
 * UK Statutory Sick Pay (SSP) calculator.
 *
 * Source: gov.uk/statutory-sick-pay
 *         gov.uk/employers-sick-pay
 *
 * Rules (2026):
 * - To qualify the employee must be classed as an employee and earn an
 *   average of at least £125/week (Lower Earnings Limit, 2025/26).
 * - SSP is paid for "qualifying days", usually the days you'd normally
 *   work. The first 3 qualifying days are "waiting days" and are NOT paid.
 * - Paid from the 4th qualifying day of sickness, up to a maximum of 28
 *   weeks.
 * - Daily rate = weekly rate / number of qualifying days that week.
 *
 * 2025/26 rate: £118.75/week (from 6 April 2025).
 * Always verify against gov.uk before quoting.
 */

export const SSP_WEEKLY = 118.75;
export const LEL_WEEKLY = 125;
export const WAITING_DAYS = 3;
export const MAX_WEEKS = 28;
export const RATES_TAX_YEAR = '2025/26';

export interface CalcInput {
  averageWeeklyEarnings: number;
  qualifyingDaysPerWeek: number;   // typically 5 for Mon, Fri
  sickDays: number;                 // total calendar sick days (continuous)
}

export interface CalcResult {
  eligible: boolean;
  reason?: string;
  dailyRate: number;
  paidDays: number;
  waitingDays: number;
  cappedDays: number;
  weeklyRate: number;
  total: number;
  weeksPaid: number;
}

export function calculateSSP(input: CalcInput): CalcResult {
  const awe = Math.max(0, input.averageWeeklyEarnings);
  const qdpw = Math.max(1, Math.min(7, Math.floor(input.qualifyingDaysPerWeek || 5)));
  const sick = Math.max(0, Math.floor(input.sickDays));

  if (awe < LEL_WEEKLY) {
    return {
      eligible: false,
      reason: `Average weekly earnings (£${awe.toFixed(2)}) are below the Lower Earnings Limit (£${LEL_WEEKLY}/week). SSP does not apply.`,
      dailyRate: 0, paidDays: 0, waitingDays: 0, cappedDays: 0,
      weeklyRate: SSP_WEEKLY, total: 0, weeksPaid: 0,
    };
  }

  const dailyRate = SSP_WEEKLY / qdpw;
  const maxPaidDays = MAX_WEEKS * qdpw;

  /* Convert sick calendar days → qualifying sick days, very approximately
     assume the absence covers the same proportion of qualifying days. */
  const qualifyingSickDays = Math.min(sick, Math.floor((sick * qdpw) / 7));
  const usedWaiting = Math.min(WAITING_DAYS, qualifyingSickDays);
  const eligibleDays = Math.max(0, qualifyingSickDays - usedWaiting);
  const paidDays = Math.min(maxPaidDays, eligibleDays);
  const cappedDays = Math.max(0, eligibleDays - paidDays);
  const total = paidDays * dailyRate;
  const weeksPaid = paidDays / qdpw;

  return {
    eligible: true,
    dailyRate,
    paidDays,
    waitingDays: usedWaiting,
    cappedDays,
    weeklyRate: SSP_WEEKLY,
    total,
    weeksPaid,
  };
}
