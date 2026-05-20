/**
 * UK Statutory Maternity & Paternity Pay calculator.
 *
 * Source: gov.uk/maternity-pay-leave/pay
 *         gov.uk/paternity-pay-leave/pay-and-eligibility
 *
 * SMP (Statutory Maternity Pay):
 *  - Eligibility: average weekly earnings (AWE) ≥ Lower Earnings Limit (LEL)
 *    AND ≥ 26 weeks' continuous service by the 15th week before due date.
 *  - First 6 weeks: 90% of AWE.
 *  - Following 33 weeks: lower of (90% AWE, SMP_STATUTORY_RATE).
 *  - Up to 39 weeks paid (52 weeks total leave allowed, last 13 unpaid).
 *
 * SPP (Statutory Paternity Pay):
 *  - Up to 2 weeks (taken as one block of 2, or two blocks of 1, within 52
 *    weeks of birth — rule change April 2024).
 *  - Weekly rate: lower of (90% AWE, SPP_STATUTORY_RATE).
 *
 * Rates are reviewed annually in April.
 *  - 2024/25: £184.03/week (SMP after week 6, SPP), LEL £123/week.
 *  - 2025/26: £187.18/week, LEL £125/week.
 *
 * Below figures are the latest known published rates.
 */

export const SMP_STATUTORY_RATE = 187.18;      // £/week (2025/26)
export const SPP_STATUTORY_RATE = 187.18;
export const LEL_WEEKLY = 125;                  // Lower Earnings Limit 2025/26
export const RATES_TAX_YEAR = '2025/26';

export type PayType = 'maternity' | 'paternity';

export interface CalcInput {
  type: PayType;
  averageWeeklyEarnings: number;   // gross weekly £ during 8-week qualifying period
  paternityWeeks?: 1 | 2;          // SPP only
}

export interface PhaseRow {
  label: string;
  weeks: number;
  weeklyRate: number;
  total: number;
}

export interface CalcResult {
  eligible: boolean;
  reason?: string;
  type: PayType;
  awe: number;
  phases: PhaseRow[];
  totalGross: number;
  totalWeeks: number;
}

export function calculateMaternity(input: CalcInput): CalcResult {
  const awe = Math.max(0, input.averageWeeklyEarnings);

  if (awe < LEL_WEEKLY) {
    return {
      eligible: false,
      reason: `Average weekly earnings (£${awe.toFixed(2)}) are below the Lower Earnings Limit (£${LEL_WEEKLY}/week). You may still qualify for Maternity Allowance via JobcentrePlus.`,
      type: input.type,
      awe,
      phases: [],
      totalGross: 0,
      totalWeeks: 0,
    };
  }

  if (input.type === 'paternity') {
    const weeks = input.paternityWeeks ?? 2;
    const rate = Math.min(awe * 0.9, SPP_STATUTORY_RATE);
    return {
      eligible: true,
      type: 'paternity',
      awe,
      phases: [{ label: `${weeks} week${weeks === 1 ? '' : 's'} at statutory rate`, weeks, weeklyRate: rate, total: rate * weeks }],
      totalGross: rate * weeks,
      totalWeeks: weeks,
    };
  }

  /* Maternity */
  const phase1Rate = awe * 0.9;
  const phase2Rate = Math.min(awe * 0.9, SMP_STATUTORY_RATE);
  const phases: PhaseRow[] = [
    { label: 'Weeks 1–6 · 90% of AWE',            weeks: 6,  weeklyRate: phase1Rate, total: phase1Rate * 6 },
    { label: 'Weeks 7–39 · lower of 90% / statutory', weeks: 33, weeklyRate: phase2Rate, total: phase2Rate * 33 },
    { label: 'Weeks 40–52 · unpaid (statutory leave)', weeks: 13, weeklyRate: 0, total: 0 },
  ];

  return {
    eligible: true,
    type: 'maternity',
    awe,
    phases,
    totalGross: phases.reduce((s, p) => s + p.total, 0),
    totalWeeks: 39,
  };
}
