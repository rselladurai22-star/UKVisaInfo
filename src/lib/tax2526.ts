/**
 * UK tax engine — 2025/26 (rest-of-UK / England, Wales & NI).
 * Shared by the Tax & Income calculators. Figures are estimates; Scotland
 * has its own income-tax bands (see the Scottish income tax tool).
 */

export const PA_BASE = 12570;          // personal allowance
export const PA_TAPER_START = 100000;  // £1 lost per £2 over this
export const BASIC_BAND = 37700;       // width of 20% band (above PA)
export const ADDL_THRESHOLD = 125140;  // 45% starts here (income)
export const PT = 12570;               // NI primary threshold
export const UEL = 50270;              // NI upper earnings limit

export const DIV_ALLOWANCE = 500;
export const DIV_BASIC = 0.0875;
export const DIV_HIGHER = 0.3375;
export const DIV_ADDL = 0.3935;

export const CGT_ALLOWANCE = 3000;
export const CGT_BASIC = 0.18;
export const CGT_HIGHER = 0.24;

export type StudentPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'pg';
export const SL_THRESHOLD: Record<StudentPlan, number> = {
  none: Infinity, plan1: 26065, plan2: 28470, plan4: 32745, plan5: 25000, pg: 21000,
};
export const SL_RATE: Record<StudentPlan, number> = {
  none: 0, plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, pg: 0.06,
};

export const personalAllowance = (income: number) =>
  Math.max(0, PA_BASE - Math.max(0, income - PA_TAPER_START) / 2);

/** Income tax on total (non-dividend) income, rUK 2025/26. */
export function incomeTax(income: number): number {
  const pa = personalAllowance(income);
  const taxable = Math.max(0, income - pa);
  const higherTop = Math.max(BASIC_BAND, ADDL_THRESHOLD - pa); // taxable amount where 45% starts
  let tax = 0;
  tax += Math.min(taxable, BASIC_BAND) * 0.2;
  if (taxable > BASIC_BAND) tax += (Math.min(taxable, higherTop) - BASIC_BAND) * 0.4;
  if (taxable > higherTop) tax += (taxable - higherTop) * 0.45;
  return tax;
}

/** Class 1 employee NI 2025/26 (8% PT→UEL, 2% above). */
export function employeeNI(income: number): number {
  let ni = 0;
  if (income > PT) ni += (Math.min(income, UEL) - PT) * 0.08;
  if (income > UEL) ni += (income - UEL) * 0.02;
  return ni;
}

/** Class 4 self-employed NI 2025/26 (6% PT→UEL, 2% above). Class 2 now voluntary. */
export function class4NI(profit: number): number {
  let ni = 0;
  if (profit > PT) ni += (Math.min(profit, UEL) - PT) * 0.06;
  if (profit > UEL) ni += (profit - UEL) * 0.02;
  return ni;
}

export function studentLoan(income: number, plan: StudentPlan): number {
  if (plan === 'none') return 0;
  return Math.max(0, income - SL_THRESHOLD[plan]) * SL_RATE[plan];
}

/** Dividend tax, stacked on top of other (non-dividend) income. */
export function dividendTax(otherIncome: number, dividends: number): number {
  const pa = personalAllowance(otherIncome + dividends);
  // Personal allowance used by other income first; remainder covers dividends.
  const paLeft = Math.max(0, pa - otherIncome);
  const taxableDiv = Math.max(0, dividends - paLeft - DIV_ALLOWANCE);
  if (taxableDiv <= 0) return 0;
  // Where dividends sit in the bands depends on other income (after its PA).
  const otherTaxable = Math.max(0, otherIncome - pa);
  const basicRoom = Math.max(0, BASIC_BAND - otherTaxable);
  const higherRoom = Math.max(0, (ADDL_THRESHOLD - pa) - Math.max(otherTaxable, BASIC_BAND));
  let remaining = taxableDiv;
  let tax = 0;
  const inBasic = Math.min(remaining, basicRoom); tax += inBasic * DIV_BASIC; remaining -= inBasic;
  const inHigher = Math.min(remaining, higherRoom); tax += inHigher * DIV_HIGHER; remaining -= inHigher;
  if (remaining > 0) tax += remaining * DIV_ADDL;
  return tax;
}

/** CGT on a gain given the person's other taxable income. */
export function cgt(gain: number, otherIncome: number): number {
  const taxable = Math.max(0, gain - CGT_ALLOWANCE);
  if (taxable <= 0) return 0;
  const pa = personalAllowance(otherIncome);
  const otherTaxable = Math.max(0, otherIncome - pa);
  const basicRoom = Math.max(0, BASIC_BAND - otherTaxable); // remaining 20% band
  const atBasic = Math.min(taxable, basicRoom);
  const atHigher = taxable - atBasic;
  return atBasic * CGT_BASIC + atHigher * CGT_HIGHER;
}

export const gbp = (n: number, dp = 0) =>
  '£' + (isFinite(n) ? n : 0).toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
