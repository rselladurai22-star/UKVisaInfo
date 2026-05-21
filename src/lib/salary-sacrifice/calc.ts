/**
 * UK Salary Sacrifice pension saving calculator — 2025/26.
 *
 * Source: gov.uk/salary-sacrifice-and-the-effects-on-paye
 *
 * Salary sacrifice reduces gross pay → saves employee IT + NI + employer NI.
 * Compared to a personal pension contribution (RAS), also saves employee/employer NI.
 */

import { calculateNI } from '../ni/calc';

const PA         = 12570; const BASIC_TOP = 50270; const HIGHER_TOP = 125140;
const IT_BASIC   = 0.20;  const IT_HIGHER = 0.40;  const IT_ADD = 0.45;

function marginalIT(gross: number): number {
  if (gross <= PA)        return 0;
  if (gross <= BASIC_TOP) return IT_BASIC;
  if (gross <= HIGHER_TOP) return IT_HIGHER;
  return IT_ADD;
}

export interface CalcInput {
  grossSalary: number;
  sacrificeAmount: number;
}

export interface CalcResult {
  sacrificeAmount: number;
  employeeItSaving: number;
  employeeNiSaving: number;
  employerNiSaving: number;
  totalSaving: number;
  netCostToEmployee: number;
  potContribution: number;
  vsRasItSavingOnly: number;
  extraVsRas: number;
}

export function calculateSalarySacrifice(input: CalcInput): CalcResult {
  const salary   = Math.max(0, input.grossSalary);
  const sacrifice = Math.min(Math.max(0, input.sacrificeAmount), salary);

  const itRate   = marginalIT(salary);
  const eeNiRate = salary <= PA ? 0 : salary <= BASIC_TOP ? 0.08 : 0.02;

  const employeeItSaving  = sacrifice * itRate;
  const employeeNiSaving  = sacrifice * eeNiRate;

  const erNiBefore = calculateNI({ kind: 'employer', salary, category: 'A', claimEmploymentAllowance: false });
  const erNiAfter  = calculateNI({ kind: 'employer', salary: Math.max(0, salary - sacrifice), category: 'A', claimEmploymentAllowance: false });
  const employerNiSaving = erNiBefore.total - erNiAfter.total;

  const totalSaving       = employeeItSaving + employeeNiSaving + employerNiSaving;
  const netCostToEmployee = sacrifice - employeeItSaving - employeeNiSaving;
  const vsRasItSavingOnly = sacrifice * IT_BASIC;
  const extraVsRas        = totalSaving - vsRasItSavingOnly;

  return { sacrificeAmount: sacrifice, employeeItSaving, employeeNiSaving, employerNiSaving, totalSaving, netCostToEmployee, potContribution: sacrifice, vsRasItSavingOnly, extraVsRas };
}
