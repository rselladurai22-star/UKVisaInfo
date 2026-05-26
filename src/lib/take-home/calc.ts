/**
 * UK take-home pay calculator — tax year 2026/27.
 *
 * Thresholds and rates imported from src/lib/constants/tax-2026-27.ts
 * (single source of truth — updated annually in April).
 *
 * Note: Personal allowance tapers £1 for every £2 over £100k, fully
 * withdrawn by £125,140 — creating the "60% effective tax" trap.
 * Scotland uses different income-tax bands (handled via `scotland`
 * input flag).
 */

import {
  PERSONAL_ALLOWANCE, PA_TAPER_START, PA_TAPER_END,
  RUK_BASIC_TOP, RUK_HIGHER_TOP,
  RUK_BASIC_RATE, RUK_HIGHER_RATE, RUK_ADDITIONAL_RATE,
  SCO_STARTER_TOP, SCO_BASIC_TOP, SCO_INTERMEDIATE_TOP, SCO_HIGHER_TOP, SCO_ADVANCED_TOP,
  SCO_STARTER_RATE, SCO_BASIC_RATE, SCO_INTERMEDIATE_RATE,
  SCO_HIGHER_RATE, SCO_ADVANCED_RATE, SCO_TOP_RATE,
  NI_PRIMARY_THRESHOLD, NI_UPPER_EARNINGS_LIMIT, NI_MAIN_RATE, NI_ADDITIONAL_RATE,
  STUDENT_LOAN_PLANS,
  type StudentLoanPlan,
} from '../constants/tax-2026-27';

export type { StudentLoanPlan };

export interface CalcInput {
  /** Gross annual salary, GBP */
  salary: number;
  /** Personal pension contribution as a percentage of salary (employee, pre-tax) */
  pensionPct: number;
  /** Salary sacrifice — pre-tax/pre-NI deduction (e.g. cycle/EV scheme) */
  salarySacrifice: number;
  /** Student loan repayment plan */
  studentLoan: StudentLoanPlan;
  /** Apply Scottish income tax bands instead of rUK */
  scotland: boolean;
  /** Age 55+ exempts from class 1 NI on employee earnings only marginally —
   *  we ignore this rare edge for now; default false. */
  overStatePension?: boolean;
  /** Blind person's allowance / married couple's allowance not modelled here. */
}

export interface BandBreakdown { label: string; rate: number; from: number; to: number; taxOn: number; tax: number }

export interface CalcResult {
  taxYear: '2026/27';
  // Inputs reflected back
  grossSalary: number;
  pensionContribution: number;       // £ amount
  salarySacrifice: number;
  taxablePayAfterPension: number;    // = gross - pension - sacrifice
  // Allowances
  personalAllowance: number;
  // Tax breakdown
  incomeTax: number;
  incomeTaxBands: BandBreakdown[];
  nationalInsurance: number;
  niBands: BandBreakdown[];
  studentLoanRepayment: number;
  studentLoanPlan: StudentLoanPlan;
  // Totals
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  netWeekly: number;
  // Marginal rate at the current income point
  marginalRate: number;
  effectiveRate: number;
}

/* All constants imported from ../constants/tax-2026-27 — single source of truth. */
const SL_PLANS = STUDENT_LOAN_PLANS;

/** Personal allowance after high-income taper. */
function personalAllowance(taxablePay: number): number {
  if (taxablePay <= PA_TAPER_START) return PERSONAL_ALLOWANCE;
  if (taxablePay >= PA_TAPER_END) return 0;
  return Math.max(0, PERSONAL_ALLOWANCE - (taxablePay - PA_TAPER_START) / 2);
}

function applyBand(amount: number, from: number, to: number, rate: number, label: string): BandBreakdown {
  const taxOn = Math.max(0, Math.min(amount, to) - from);
  return { label, rate, from, to, taxOn, tax: taxOn * rate };
}

function rukIncomeTax(taxablePay: number, pa: number): { total: number; bands: BandBreakdown[] } {
  const taxable = Math.max(0, taxablePay - pa);
  // Bands relative to gross taxable income above PA
  const top = taxable + pa;
  const bands: BandBreakdown[] = [
    applyBand(top, pa, RUK_BASIC_TOP, RUK_BASIC_RATE, 'Basic rate (20%)'),
    applyBand(top, RUK_BASIC_TOP, RUK_HIGHER_TOP, RUK_HIGHER_RATE, 'Higher rate (40%)'),
    applyBand(top, RUK_HIGHER_TOP, Infinity, RUK_ADDITIONAL_RATE, 'Additional rate (45%)'),
  ].filter((b) => b.taxOn > 0);
  return { total: bands.reduce((s, b) => s + b.tax, 0), bands };
}

function scoIncomeTax(taxablePay: number, pa: number): { total: number; bands: BandBreakdown[] } {
  const taxable = Math.max(0, taxablePay - pa);
  const top = taxable + pa;
  const bands: BandBreakdown[] = [
    applyBand(top, pa, SCO_STARTER_TOP, SCO_STARTER_RATE, 'Starter (19%)'),
    applyBand(top, SCO_STARTER_TOP, SCO_BASIC_TOP, SCO_BASIC_RATE, 'Basic (20%)'),
    applyBand(top, SCO_BASIC_TOP, SCO_INTERMEDIATE_TOP, SCO_INTERMEDIATE_RATE, 'Intermediate (21%)'),
    applyBand(top, SCO_INTERMEDIATE_TOP, SCO_HIGHER_TOP, SCO_HIGHER_RATE, 'Higher (42%)'),
    applyBand(top, SCO_HIGHER_TOP, SCO_ADVANCED_TOP, SCO_ADVANCED_RATE, 'Advanced (45%)'),
    applyBand(top, SCO_ADVANCED_TOP, Infinity, SCO_TOP_RATE, 'Top (48%)'),
  ].filter((b) => b.taxOn > 0);
  return { total: bands.reduce((s, b) => s + b.tax, 0), bands };
}

function nationalInsurance(taxablePay: number, overStatePension: boolean): { total: number; bands: BandBreakdown[] } {
  if (overStatePension) return { total: 0, bands: [] };
  const bands: BandBreakdown[] = [
    applyBand(taxablePay, NI_PRIMARY_THRESHOLD, NI_UPPER_EARNINGS_LIMIT, NI_MAIN_RATE, `Main rate (${(NI_MAIN_RATE * 100).toFixed(0)}%)`),
    applyBand(taxablePay, NI_UPPER_EARNINGS_LIMIT, Infinity, NI_ADDITIONAL_RATE, `Above UEL (${(NI_ADDITIONAL_RATE * 100).toFixed(0)}%)`),
  ].filter((b) => b.taxOn > 0);
  return { total: bands.reduce((s, b) => s + b.tax, 0), bands };
}

function studentLoan(salary: number, plan: StudentLoanPlan): number {
  if (plan === 'none') return 0;
  const cfg = SL_PLANS[plan];
  return Math.max(0, salary - cfg.threshold) * cfg.rate;
}

export function calculateTakeHome(input: CalcInput): CalcResult {
  const gross = Math.max(0, input.salary);
  const sacrifice = Math.max(0, input.salarySacrifice);
  const pensionContribution = Math.max(0, gross * (input.pensionPct / 100));

  // For tax purposes: gross MINUS pension MINUS salary sacrifice = taxable pay
  // (Standard "net pay arrangement" pension treatment.)
  const taxablePay = Math.max(0, gross - pensionContribution - sacrifice);

  const pa = personalAllowance(taxablePay);

  const it = input.scotland
    ? scoIncomeTax(taxablePay, pa)
    : rukIncomeTax(taxablePay, pa);

  const ni = nationalInsurance(taxablePay, !!input.overStatePension);

  // Student loan typically charged on gross (post salary-sacrifice) earnings,
  // not the taxable pay. We use the "earnings for SL" = gross - salary sacrifice
  // (pension contributions DON'T reduce SL repayment base in net-pay arrangements).
  const slEarnings = Math.max(0, gross - sacrifice);
  const sl = studentLoan(slEarnings, input.studentLoan);

  const totalDeductions = it.total + ni.total + sl + pensionContribution + sacrifice;
  const netAnnual = gross - totalDeductions;

  // Marginal rate at current point — sum of rates active in the top slice
  const lastIt = it.bands[it.bands.length - 1]?.rate ?? 0;
  const lastNi = ni.bands[ni.bands.length - 1]?.rate ?? 0;
  const lastSl = input.studentLoan !== 'none' && taxablePay >= SL_PLANS[input.studentLoan].threshold
    ? SL_PLANS[input.studentLoan].rate
    : 0;
  const taperZone = taxablePay > PA_TAPER_START && taxablePay < PA_TAPER_END;
  // Inside the £100k-£125,140 taper, every extra £1 loses 50p of PA and that 50p
  // gets taxed at the higher rate, on top of the 40% paid on the £1 itself.
  const taperBoost = taperZone ? 0.5 * RUK_HIGHER_RATE : 0;
  const marginalRate = lastIt + lastNi + lastSl + taperBoost;

  const effectiveRate = gross > 0 ? totalDeductions / gross : 0;

  return {
    taxYear: '2026/27',
    grossSalary: gross,
    pensionContribution,
    salarySacrifice: sacrifice,
    taxablePayAfterPension: taxablePay,
    personalAllowance: pa,
    incomeTax: it.total,
    incomeTaxBands: it.bands,
    nationalInsurance: ni.total,
    niBands: ni.bands,
    studentLoanRepayment: sl,
    studentLoanPlan: input.studentLoan,
    totalDeductions,
    netAnnual,
    netMonthly: netAnnual / 12,
    netWeekly: netAnnual / 52,
    marginalRate,
    effectiveRate,
  };
}

export const STUDENT_LOAN_PLAN_LABEL: Record<StudentLoanPlan, string> = {
  none: 'No student loan',
  plan1: 'Plan 1 (England/Wales pre-2012)',
  plan2: 'Plan 2 (England/Wales 2012-22)',
  plan4: 'Plan 4 (Scotland)',
  plan5: 'Plan 5 (England 2023+)',
  postgrad: 'Postgraduate Loan',
};
