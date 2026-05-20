/**
 * UK National Insurance calculator — 2026/27.
 *
 * Source: gov.uk/national-insurance-rates-letters
 *         gov.uk/self-employed-national-insurance-rates
 *
 * Class 1 (employee):
 *  - Primary Threshold (PT) £12,570; Upper Earnings Limit (UEL) £50,270.
 *  - Main rate 8% between PT and UEL (since 6 April 2024).
 *  - Additional rate 2% above UEL.
 *  - Employee categories A (standard), H (apprentice <25), M (under 21),
 *    V (veteran first year of civilian employment), Z (deferred — already
 *    paying max NI elsewhere), C (state pension age — no employee NI),
 *    B (married woman reduced rate, legacy), J (deferred standard).
 *
 * Class 1 (employer):
 *  - Secondary Threshold (ST) £5,000 from 6 April 2025 (was £9,100).
 *  - Rate 15% from 6 April 2025 (was 13.8%).
 *  - Employment Allowance £10,500 from 6 April 2025 (was £5,000) — most
 *    eligible employers can offset up to this much employer NI per year.
 *
 * Class 2 (self-employed):
 *  - From 6 April 2024, mandatory Class 2 NI was abolished. Voluntary
 *    contributions remain available at £3.45/week (2024/25) for those who
 *    want to maintain State Pension entitlement.
 *
 * Class 4 (self-employed profits):
 *  - 6% between £12,570 and £50,270 (rate cut from 8% on 6 April 2024).
 *  - 2% above £50,270.
 */

/* Class 1 employee */
export const PT_WEEKLY = 242;       // £242/week (≈ £12,570/year)
export const PT_ANNUAL = 12570;
export const UEL_ANNUAL = 50270;
export const EMPLOYEE_MAIN_RATE = 0.08;
export const EMPLOYEE_ADD_RATE = 0.02;

/* Class 1 employer */
export const SECONDARY_THRESHOLD = 5000;        // from 6 April 2025
export const EMPLOYER_RATE = 0.15;              // from 6 April 2025
export const EMPLOYMENT_ALLOWANCE = 10500;

/* Class 4 self-employed */
export const CLASS4_LOWER = 12570;
export const CLASS4_UPPER = 50270;
export const CLASS4_MAIN_RATE = 0.06;
export const CLASS4_ADD_RATE = 0.02;

/* Class 2 voluntary (legacy mandatory) */
export const CLASS2_WEEKLY = 3.45;
export const CLASS2_SMALL_PROFITS_THRESHOLD = 6725;

export type Category = 'A' | 'B' | 'C' | 'H' | 'J' | 'M' | 'V' | 'Z';

export const CATEGORY_LABEL: Record<Category, string> = {
  A: 'A — Standard adult employee',
  B: 'B — Married woman reduced rate (legacy)',
  C: 'C — Over State Pension age (no employee NI)',
  H: 'H — Apprentice under 25',
  J: 'J — Deferred (already paying max NI elsewhere)',
  M: 'M — Employee under 21',
  V: 'V — Veteran in first year of civilian employment',
  Z: 'Z — Deferred under 21',
};

export interface EmployeeInput {
  kind: 'employee';
  salary: number;
  category: Category;
}

export interface EmployerInput {
  kind: 'employer';
  salary: number;
  category: Category;
  claimEmploymentAllowance: boolean;
}

export interface SelfEmployedInput {
  kind: 'self-employed';
  profit: number;
  payClass2Voluntary: boolean;
}

export type CalcInput = EmployeeInput | EmployerInput | SelfEmployedInput;

export interface BandRow {
  label: string;
  rate: number;
  amount: number;
  ni: number;
}

export interface CalcResult {
  kind: CalcInput['kind'];
  bands: BandRow[];
  total: number;
  effectiveRate: number;
  note?: string;
}

function bandSlice(amount: number, from: number, to: number, rate: number, label: string): BandRow {
  const ni = Math.max(0, Math.min(amount, to) - from);
  return { label, rate, amount: ni, ni: ni * rate };
}

export function calculateNI(input: CalcInput): CalcResult {
  if (input.kind === 'employee') {
    const sal = Math.max(0, input.salary);
    /* Categories that pay no employee NI */
    if (input.category === 'C') {
      return { kind: 'employee', bands: [], total: 0, effectiveRate: 0, note: 'Category C employees (over State Pension age) pay no employee NI.' };
    }
    /* M, H, Z, V have the same rates as A for employee — the difference is on the employer side. */
    const bands = [
      bandSlice(sal, PT_ANNUAL, UEL_ANNUAL, EMPLOYEE_MAIN_RATE, `${(EMPLOYEE_MAIN_RATE * 100).toFixed(0)}% on £${PT_ANNUAL.toLocaleString()}–£${UEL_ANNUAL.toLocaleString()}`),
      bandSlice(sal, UEL_ANNUAL, Infinity, EMPLOYEE_ADD_RATE, `${(EMPLOYEE_ADD_RATE * 100).toFixed(0)}% above £${UEL_ANNUAL.toLocaleString()}`),
    ].filter((b) => b.amount > 0);
    const total = bands.reduce((s, b) => s + b.ni, 0);
    return { kind: 'employee', bands, total, effectiveRate: sal > 0 ? total / sal : 0 };
  }

  if (input.kind === 'employer') {
    const sal = Math.max(0, input.salary);
    /* Zero-rated employer NI categories up to £50,270: H (apprentice <25),
       M (employee <21), V (veteran first year). Rate is 0% on earnings up to
       UEL, then 15% above. */
    const zeroRatedToUel = ['H', 'M', 'V'].includes(input.category);
    let bands: BandRow[];
    if (zeroRatedToUel) {
      bands = [
        { label: '0% on earnings up to UEL (relief)', rate: 0, amount: Math.max(0, Math.min(sal, UEL_ANNUAL) - SECONDARY_THRESHOLD), ni: 0 },
        bandSlice(sal, UEL_ANNUAL, Infinity, EMPLOYER_RATE, `15% above £${UEL_ANNUAL.toLocaleString()}`),
      ].filter((b) => b.amount > 0);
    } else {
      bands = [
        bandSlice(sal, SECONDARY_THRESHOLD, Infinity, EMPLOYER_RATE, `15% above £${SECONDARY_THRESHOLD.toLocaleString()}`),
      ].filter((b) => b.amount > 0);
    }
    let total = bands.reduce((s, b) => s + b.ni, 0);
    let note: string | undefined;
    if (input.claimEmploymentAllowance) {
      const offset = Math.min(EMPLOYMENT_ALLOWANCE, total);
      total -= offset;
      note = `Employment Allowance offset £${offset.toLocaleString(undefined, { maximumFractionDigits: 0 })} (max £${EMPLOYMENT_ALLOWANCE.toLocaleString()}/year).`;
    }
    return { kind: 'employer', bands, total, effectiveRate: sal > 0 ? total / sal : 0, note };
  }

  /* Self-employed */
  const profit = Math.max(0, input.profit);
  const bands = [
    bandSlice(profit, CLASS4_LOWER, CLASS4_UPPER, CLASS4_MAIN_RATE, `Class 4 · 6% on £${CLASS4_LOWER.toLocaleString()}–£${CLASS4_UPPER.toLocaleString()}`),
    bandSlice(profit, CLASS4_UPPER, Infinity, CLASS4_ADD_RATE, `Class 4 · 2% above £${CLASS4_UPPER.toLocaleString()}`),
  ].filter((b) => b.amount > 0);
  let total = bands.reduce((s, b) => s + b.ni, 0);
  let note: string | undefined;
  if (input.payClass2Voluntary) {
    const class2 = CLASS2_WEEKLY * 52;
    bands.push({ label: `Class 2 voluntary · £${CLASS2_WEEKLY.toFixed(2)}/week × 52`, rate: 0, amount: 52, ni: class2 });
    total += class2;
    note = 'Class 2 NI is voluntary from 6 April 2024 — paying it protects State Pension entitlement for years with low profits.';
  } else if (profit < CLASS2_SMALL_PROFITS_THRESHOLD) {
    note = `Profits are below the Small Profits Threshold (£${CLASS2_SMALL_PROFITS_THRESHOLD.toLocaleString()}). Consider paying Class 2 voluntarily to keep State Pension years.`;
  }
  return { kind: 'self-employed', bands, total, effectiveRate: profit > 0 ? total / profit : 0, note };
}
