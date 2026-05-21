/**
 * UK IR35 inside vs outside comparison calculator.
 *
 * Source: gov.uk/guidance/off-payroll-working-ir35
 *
 * Inside IR35: engager withholds PAYE + employee NI; PSC bears employer NI too.
 * Outside IR35: contractor extracts via low salary + dividends through Ltd company.
 */

import { calculateNI } from '../ni/calc';
import { corporationTax } from '../sole-vs-ltd/calc';

const PA         = 12570;
const BASIC_TOP  = 50270;
const HIGHER_TOP = 125140;
const IT_BASIC   = 0.20; const IT_HIGHER = 0.40; const IT_ADD = 0.45;
const DIV_ALLOWANCE = 500;
const DIV_BASIC  = 0.0875; const DIV_HIGHER = 0.3375; const DIV_ADD = 0.3935;

function incomeTax(gross: number): number {
  const above = Math.max(0, gross - PA);
  let tax = 0;
  const t1 = Math.min(above, BASIC_TOP - PA);
  tax += Math.max(0, t1) * IT_BASIC;
  const t2 = Math.min(Math.max(0, above - (BASIC_TOP - PA)), HIGHER_TOP - BASIC_TOP);
  tax += Math.max(0, t2) * IT_HIGHER;
  tax += Math.max(0, above - (HIGHER_TOP - PA)) * IT_ADD;
  return tax;
}

export interface CalcInput {
  dayRate: number;
  daysPerYear: number;
  directorSalary: 5000 | 12570;
  expenses: number;
}

export interface PathResult {
  label: string;
  grossContractValue: number;
  incomeTax: number;
  employeeNi: number;
  employerNi: number;
  corporationTax: number;
  dividendTax: number;
  totalTax: number;
  takeHome: number;
}

export interface CalcResult {
  inside: PathResult;
  outside: PathResult;
  difference: number;
  betterOption: 'inside' | 'outside' | 'tie';
}

export function calculateIR35(input: CalcInput): CalcResult {
  const gross = input.dayRate * input.daysPerYear;

  // Inside IR35
  const insideErNi     = calculateNI({ kind: 'employer', salary: gross, category: 'A', claimEmploymentAllowance: false });
  const deemedSalary   = Math.max(0, gross - insideErNi.total);
  const insideIt       = incomeTax(deemedSalary);
  const insideEeNi     = calculateNI({ kind: 'employee', salary: deemedSalary, category: 'A' });
  const insideTakeHome = deemedSalary - insideIt - insideEeNi.total;

  const inside: PathResult = {
    label: 'Inside IR35',
    grossContractValue: gross,
    incomeTax: insideIt,
    employeeNi: insideEeNi.total,
    employerNi: insideErNi.total,
    corporationTax: 0,
    dividendTax: 0,
    totalTax: insideIt + insideEeNi.total + insideErNi.total,
    takeHome: insideTakeHome,
  };

  // Outside IR35
  const salary   = Math.min(gross, input.directorSalary);
  const expenses = Math.min(Math.max(0, input.expenses), gross - salary);
  const outErNi  = calculateNI({ kind: 'employer', salary, category: 'A', claimEmploymentAllowance: false });
  const ctProfit = Math.max(0, gross - salary - outErNi.total - expenses);
  const ct       = corporationTax(ctProfit);
  const dividends = Math.max(0, ctProfit - ct);
  const outIt    = incomeTax(salary);
  const outEeNi  = calculateNI({ kind: 'employee', salary, category: 'A' });

  let rem = Math.max(0, dividends - DIV_ALLOWANCE), ptr = salary + DIV_ALLOWANCE, dt = 0;
  if (rem > 0 && ptr < BASIC_TOP)  { const s = Math.min(rem, BASIC_TOP  - ptr); dt += s * DIV_BASIC;  rem -= s; ptr += s; }
  if (rem > 0 && ptr < HIGHER_TOP) { const s = Math.min(rem, HIGHER_TOP - ptr); dt += s * DIV_HIGHER; rem -= s; ptr += s; }
  if (rem > 0) dt += rem * DIV_ADD;

  const outside: PathResult = {
    label: 'Outside IR35',
    grossContractValue: gross,
    incomeTax: outIt,
    employeeNi: outEeNi.total,
    employerNi: outErNi.total,
    corporationTax: ct,
    dividendTax: dt,
    totalTax: outIt + outEeNi.total + outErNi.total + ct + dt,
    takeHome: salary - outIt - outEeNi.total + dividends - dt,
  };

  const diff = outside.takeHome - inside.takeHome;
  return { inside, outside, difference: diff, betterOption: Math.abs(diff) < 1 ? 'tie' : diff > 0 ? 'outside' : 'inside' };
}
