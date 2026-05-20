/**
 * UK Student loan repayment calculator — 2026/27.
 *
 * Source: gov.uk/repaying-your-student-loan/what-you-pay
 *         gov.uk/repaying-your-student-loan/when-your-loan-is-written-off
 *
 * Thresholds and rates per Department for Education / Student Loans Company
 * latest published values. Interest treatment is approximate — actual interest
 * is set monthly by SLC based on RPI / Bank rate, this uses a representative
 * mid-year figure for projection only.
 */

export type Plan = 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad';

export interface PlanConfig {
  id: Plan;
  label: string;
  threshold: number;       // gross annual earnings above which 9%/6% is deducted
  rate: number;            // 0.09 or 0.06
  writeOffYears: number;   // from first April after course end
  defaultInterest: number; // representative annual interest %
  note: string;
}

/** Source: gov.uk/repaying-your-student-loan/what-you-pay — 2026/27 thresholds */
export const PLANS: Record<Plan, PlanConfig> = {
  plan1:    { id: 'plan1', label: 'Plan 1 (England/Wales, started before Sep 2012)', threshold: 26065, rate: 0.09, writeOffYears: 25, defaultInterest: 0.0525, note: 'Interest is lower of RPI or Bank of England base rate + 1%.' },
  plan2:    { id: 'plan2', label: 'Plan 2 (England/Wales, started Sep 2012 – Jul 2023)', threshold: 28470, rate: 0.09, writeOffYears: 30, defaultInterest: 0.0775, note: 'Interest slides from RPI (under threshold) to RPI+3% (£49,130+).' },
  plan4:    { id: 'plan4', label: 'Plan 4 (Scotland)', threshold: 32745, rate: 0.09, writeOffYears: 30, defaultInterest: 0.0525, note: 'Interest is lower of RPI or Bank of England base rate + 1%.' },
  plan5:    { id: 'plan5', label: 'Plan 5 (England, started Aug 2023 onwards)', threshold: 25000, rate: 0.09, writeOffYears: 40, defaultInterest: 0.044, note: 'Interest is RPI only (no real-rate premium).' },
  postgrad: { id: 'postgrad', label: 'Postgraduate Loan (Master\'s / Doctoral)', threshold: 21000, rate: 0.06, writeOffYears: 30, defaultInterest: 0.0775, note: 'Interest is RPI + 3%.' },
};

export interface CalcInput {
  plan: Plan;
  salary: number;             // gross annual £
  balance: number;            // current outstanding £
  /** Optional override for projection. Defaults to plan's representative rate. */
  interestRate?: number;
  /** Annual salary increase % for projection. */
  salaryGrowthPct?: number;
}

export interface YearRow {
  year: number;
  salary: number;
  repayment: number;
  interest: number;
  closingBalance: number;
}

export interface CalcResult {
  plan: Plan;
  monthly: number;
  annual: number;
  marginalRate: number;
  belowThreshold: boolean;
  projection: YearRow[];
  yearsToClear: number | null;
  writtenOffAtYear: number | null;
  totalRepaid: number;
  totalInterest: number;
}

const MAX_YEARS = 40;

export function calculateStudentLoan(input: CalcInput): CalcResult {
  const cfg = PLANS[input.plan];
  const salary = Math.max(0, input.salary);
  const annual = Math.max(0, salary - cfg.threshold) * cfg.rate;
  const monthly = annual / 12;

  const interest = input.interestRate ?? cfg.defaultInterest;
  const growth = (input.salaryGrowthPct ?? 0) / 100;

  const projection: YearRow[] = [];
  let bal = Math.max(0, input.balance);
  let s = salary;
  let totalRepaid = 0;
  let totalInterest = 0;
  let yearsToClear: number | null = null;
  const horizon = Math.min(MAX_YEARS, cfg.writeOffYears);

  for (let y = 1; y <= horizon && bal > 0; y++) {
    const rep = Math.min(bal, Math.max(0, s - cfg.threshold) * cfg.rate);
    const int = (bal - rep / 2) * interest;
    bal = Math.max(0, bal - rep + int);
    totalRepaid += rep;
    totalInterest += int;
    projection.push({ year: y, salary: s, repayment: rep, interest: int, closingBalance: bal });
    if (bal <= 0 && yearsToClear === null) yearsToClear = y;
    s = s * (1 + growth);
  }

  const writtenOff = bal > 0 ? cfg.writeOffYears : null;

  return {
    plan: input.plan,
    monthly,
    annual,
    marginalRate: salary > cfg.threshold ? cfg.rate : 0,
    belowThreshold: salary <= cfg.threshold,
    projection,
    yearsToClear,
    writtenOffAtYear: writtenOff,
    totalRepaid,
    totalInterest,
  };
}
