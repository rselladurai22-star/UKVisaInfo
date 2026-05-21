/**
 * Contractor day rate ↔ equivalent employee salary converter.
 *
 * Source: gov.uk/income-tax-rates
 *
 * Converts gross daily rate to equivalent permanent employee gross salary,
 * accounting for costs contractors bear that employers cover for permanent staff.
 */

import { calculateNI } from '../ni/calc';
import { corporationTax } from '../sole-vs-ltd/calc';

export const BILLABLE_DAYS_DEFAULT = 224; // 260 - 28 holiday - 8 bank holidays

const PA         = 12570; const BASIC_TOP = 50270; const HIGHER_TOP = 125140;
const IT_BASIC   = 0.20; const IT_HIGHER = 0.40; const IT_ADD = 0.45;
const DIV_ALLOWANCE = 500;
const DIV_BASIC  = 0.0875; const DIV_HIGHER = 0.3375; const DIV_ADD = 0.3935;

function netFromLtd(profit: number, dirSalary: number): number {
  const salary   = Math.min(profit, dirSalary);
  const erNi     = calculateNI({ kind: 'employer', salary, category: 'A', claimEmploymentAllowance: false });
  const ctProfit = Math.max(0, profit - salary - erNi.total);
  const ct       = corporationTax(ctProfit);
  const dividends = Math.max(0, ctProfit - ct);
  const above    = Math.max(0, salary - PA);
  const it       = Math.min(above, BASIC_TOP - PA) * IT_BASIC
    + Math.max(0, Math.min(above - (BASIC_TOP - PA), HIGHER_TOP - BASIC_TOP)) * IT_HIGHER
    + Math.max(0, above - (HIGHER_TOP - PA)) * IT_ADD;
  const eeNi = calculateNI({ kind: 'employee', salary, category: 'A' });
  let rem = Math.max(0, dividends - DIV_ALLOWANCE), ptr = salary + DIV_ALLOWANCE, dt = 0;
  if (rem > 0 && ptr < BASIC_TOP)  { const s = Math.min(rem, BASIC_TOP  - ptr); dt += s * DIV_BASIC;  rem -= s; ptr += s; }
  if (rem > 0 && ptr < HIGHER_TOP) { const s = Math.min(rem, HIGHER_TOP - ptr); dt += s * DIV_HIGHER; rem -= s; }
  if (rem > 0) dt += rem * DIV_ADD;
  return salary - it - eeNi.total + dividends - dt;
}

function netPaye(gross: number): number {
  const above = Math.max(0, gross - PA);
  const it = Math.min(above, BASIC_TOP - PA) * IT_BASIC
    + Math.max(0, Math.min(above - (BASIC_TOP - PA), HIGHER_TOP - BASIC_TOP)) * IT_HIGHER
    + Math.max(0, above - (HIGHER_TOP - PA)) * IT_ADD;
  const ni = calculateNI({ kind: 'employee', salary: gross, category: 'A' });
  return gross - it - ni.total;
}

function grossForNet(targetNet: number): number {
  let lo = targetNet, hi = targetNet * 2.5;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; netPaye(mid) < targetNet ? lo = mid : hi = mid; }
  return (lo + hi) / 2;
}

export interface CalcInput {
  dayRate: number;
  billableDays: number;
  annualCosts: number;
  directorSalary: 5000 | 12570;
}

export interface CalcResult {
  grossContractIncome: number;
  afterCosts: number;
  ltdTakeHome: number;
  equivalentGrossSalary: number;
  employerTotalCost: number;
  dailyRateForEquivalence: number;
}

export function calculateContractorDayRate(input: CalcInput): CalcResult {
  const gross       = input.dayRate * input.billableDays;
  const afterCosts  = Math.max(0, gross - input.annualCosts);
  const ltdTakeHome = netFromLtd(afterCosts, input.directorSalary);
  const equivGross  = grossForNet(ltdTakeHome);
  const erNi        = calculateNI({ kind: 'employer', salary: equivGross, category: 'A', claimEmploymentAllowance: false });
  const employerCost = equivGross + erNi.total;

  return { grossContractIncome: gross, afterCosts, ltdTakeHome, equivalentGrossSalary: equivGross, employerTotalCost: employerCost, dailyRateForEquivalence: employerCost / input.billableDays };
}
