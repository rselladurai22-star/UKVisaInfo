/**
 * UK Sole trader vs Limited company tax comparison, 2026/27.
 *
 * Source: gov.uk/income-tax-rates
 *         gov.uk/self-employed-national-insurance-rates
 *         gov.uk/corporation-tax-rates (small profits / marginal relief)
 *         gov.uk/tax-on-dividends
 *
 * Method:
 *   Sole trader leaves the business with all profit after Income Tax + Class 4 NI.
 *   Limited company pays Corporation Tax on profit (after director's salary),
 *     then the director extracts the remainder as dividends.
 *   We compare total take-home (post all taxes) on the same gross profit.
 *
 * Assumptions:
 * - England/Wales/NI bands (not Scotland).
 * - Director takes a salary at the NI Secondary Threshold (£5,000) to avoid
 *   employer NI but still secure a State Pension year, common tax planning.
 *   Optionally raise to Primary Threshold (£12,570) for fuller NI record.
 * - All remaining post-CT profit extracted as dividends.
 * - Personal Allowance taper applies above £100k.
 * - Class 2 NI is voluntary (abolished as mandatory April 2024), ignored.
 */

import { calculateNI } from '../ni/calc';

const PA = 12570;
const BASIC_TOP = 50270;
const HIGHER_TOP = 125140;
const PA_TAPER_START = 100000;
const PA_TAPER_END = 125140;

/* Income tax (rUK) */
const IT_BASIC = 0.20;
const IT_HIGHER = 0.40;
const IT_ADDITIONAL = 0.45;

/* Dividend tax (after £500 allowance) */
const DIVIDEND_ALLOWANCE = 500;
const DIV_BASIC = 0.0875;
const DIV_HIGHER = 0.3375;
const DIV_ADDITIONAL = 0.3935;

/* Corporation tax */
const CT_SMALL_PROFITS_LIMIT = 50000;
const CT_MAIN_LIMIT = 250000;
const CT_SMALL_RATE = 0.19;
const CT_MAIN_RATE = 0.25;
const CT_MARGINAL_FRACTION = 3 / 200; // standard marginal relief fraction

function personalAllowance(total: number): number {
  if (total <= PA_TAPER_START) return PA;
  if (total >= PA_TAPER_END) return 0;
  return Math.max(0, PA - (total - PA_TAPER_START) / 2);
}

function incomeTax(taxable: number, pa: number): number {
  const above = Math.max(0, taxable - pa);
  let tax = 0;
  const t1 = Math.min(above, BASIC_TOP - pa);
  tax += Math.max(0, t1) * IT_BASIC;
  const t2 = Math.min(Math.max(0, above - (BASIC_TOP - pa)), HIGHER_TOP - BASIC_TOP);
  tax += Math.max(0, t2) * IT_HIGHER;
  const t3 = Math.max(0, above - (HIGHER_TOP - pa));
  tax += t3 * IT_ADDITIONAL;
  return tax;
}

/** Corporation tax with marginal relief between £50k and £250k. */
export function corporationTax(profit: number): number {
  if (profit <= 0) return 0;
  if (profit <= CT_SMALL_PROFITS_LIMIT) return profit * CT_SMALL_RATE;
  if (profit >= CT_MAIN_LIMIT) return profit * CT_MAIN_RATE;
  const mainCt = profit * CT_MAIN_RATE;
  const marginalRelief = (CT_MAIN_LIMIT - profit) * CT_MARGINAL_FRACTION;
  return mainCt - marginalRelief;
}

/** Stack dividends on top of salary, apply £500 allowance, then dividend rates. */
function dividendTax(salary: number, dividends: number): number {
  if (dividends <= 0) return 0;
  const total = salary + dividends;
  const pa = personalAllowance(total);
  const paUsed = Math.min(salary, pa);
  const paLeft = Math.max(0, pa - paUsed);
  const after = Math.max(0, dividends - paLeft - DIVIDEND_ALLOWANCE);
  let pointer = salary + paLeft + DIVIDEND_ALLOWANCE;
  let remaining = after;
  let tax = 0;
  if (remaining > 0 && pointer < BASIC_TOP) {
    const slice = Math.min(remaining, BASIC_TOP - pointer);
    tax += slice * DIV_BASIC; remaining -= slice; pointer += slice;
  }
  if (remaining > 0 && pointer < HIGHER_TOP) {
    const slice = Math.min(remaining, HIGHER_TOP - pointer);
    tax += slice * DIV_HIGHER; remaining -= slice; pointer += slice;
  }
  if (remaining > 0) tax += remaining * DIV_ADDITIONAL;
  return tax;
}

export interface CalcInput {
  /** Annual business profit before any owner pay / corporation tax */
  profit: number;
  /** Director's salary (for Ltd path), typically 5,000 or 12,570 */
  directorSalary: 5000 | 12570;
}

export interface PathResult {
  label: 'Sole trader' | 'Limited company';
  incomeTax: number;
  employeeNi: number;
  employerNi: number;
  class4Ni: number;
  corporationTax: number;
  dividendTax: number;
  totalTax: number;
  takeHome: number;
}

export interface CalcResult {
  profit: number;
  soleTrader: PathResult;
  limited: PathResult;
  difference: number;      // limited.takeHome - soleTrader.takeHome
  betterOption: 'sole' | 'ltd' | 'tie';
  directorSalary: number;
}

export function compareSoleVsLtd(input: CalcInput): CalcResult {
  const profit = Math.max(0, input.profit);

  /* ── Sole trader ── */
  const stPa = personalAllowance(profit);
  const stIt = incomeTax(profit, stPa);
  const stNi = calculateNI({ kind: 'self-employed', profit, payClass2Voluntary: false });
  const soleTrader: PathResult = {
    label: 'Sole trader',
    incomeTax: stIt,
    employeeNi: 0,
    employerNi: 0,
    class4Ni: stNi.total,
    corporationTax: 0,
    dividendTax: 0,
    totalTax: stIt + stNi.total,
    takeHome: profit - stIt - stNi.total,
  };

  /* ── Limited company ── */
  const salary = Math.min(profit, input.directorSalary);
  /* Employer NI on director salary (no Employment Allowance for single-director cos) */
  const erNi = calculateNI({ kind: 'employer', salary, category: 'A', claimEmploymentAllowance: false });
  /* Profit after salary + employer NI is what Corp Tax is charged on */
  const ctProfit = Math.max(0, profit - salary - erNi.total);
  const ct = corporationTax(ctProfit);
  const dividendsAvailable = Math.max(0, ctProfit - ct);
  /* Director's personal tax on salary */
  const ltdPa = personalAllowance(salary + dividendsAvailable);
  const salaryIt = incomeTax(salary, ltdPa);
  const eeNi = calculateNI({ kind: 'employee', salary, category: 'A' });
  const divTax = dividendTax(salary, dividendsAvailable);
  const limited: PathResult = {
    label: 'Limited company',
    incomeTax: salaryIt,
    employeeNi: eeNi.total,
    employerNi: erNi.total,
    class4Ni: 0,
    corporationTax: ct,
    dividendTax: divTax,
    totalTax: salaryIt + eeNi.total + erNi.total + ct + divTax,
    takeHome: salary - salaryIt - eeNi.total + dividendsAvailable - divTax,
  };

  const diff = limited.takeHome - soleTrader.takeHome;
  return {
    profit,
    soleTrader,
    limited,
    difference: diff,
    betterOption: Math.abs(diff) < 1 ? 'tie' : diff > 0 ? 'ltd' : 'sole',
    directorSalary: salary,
  };
}
