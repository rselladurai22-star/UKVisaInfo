/**
 * "Equivalent salary" finder, what would you need to earn in city B to keep
 * the same disposable income (take-home minus baseline cost of living) as in
 * city A.
 *
 * UK tax is piecewise-linear (HMRC 2026/27 bands), so a small binary search
 * over net-pay is fine; we hit < £1 precision in ~25 iterations.
 *
 * Uses calculateTakeHome from src/lib/take-home/calc.ts as the gold reference.
 */

import { calculateTakeHome, type CalcInput } from '../take-home/calc';

export interface EquivalentInput {
  grossA: number;
  monthlyCostA: number;
  monthlyCostB: number;
  scotlandA?: boolean;
  scotlandB?: boolean;
}

export interface EquivalentResult {
  grossA: number;
  netA: number;
  disposableA: number;       // £/year after baseline city costs
  grossB: number;            // equivalent gross in city B
  netB: number;
  disposableB: number;
  delta: number;             // grossB − grossA (positive = need more in B)
  ratio: number;             // grossB / grossA
}

const DEFAULT: Omit<CalcInput, 'salary' | 'scotland'> = {
  pensionPct: 0,
  salarySacrifice: 0,
  studentLoan: 'none',
};

function netOf(gross: number, scotland: boolean): number {
  return calculateTakeHome({ ...DEFAULT, salary: gross, scotland }).netAnnual;
}

export function findEquivalentGross(input: EquivalentInput): EquivalentResult {
  const { grossA, monthlyCostA, monthlyCostB } = input;
  const scotA = !!input.scotlandA;
  const scotB = !!input.scotlandB;

  const netA = netOf(grossA, scotA);
  const annualCostA = monthlyCostA * 12;
  const annualCostB = monthlyCostB * 12;
  const disposableA = netA - annualCostA;

  // Target net in B: disposable + annualCostB
  const targetNetB = disposableA + annualCostB;

  // Binary search for gross in B
  let lo = 0;
  let hi = Math.max(1_000_000, grossA * 4);
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const net = netOf(mid, scotB);
    if (net < targetNetB) lo = mid; else hi = mid;
    if (Math.abs(net - targetNetB) < 1) break;
  }
  const grossB = (lo + hi) / 2;
  const netB = netOf(grossB, scotB);

  return {
    grossA,
    netA,
    disposableA,
    grossB,
    netB,
    disposableB: netB - annualCostB,
    delta: grossB - grossA,
    ratio: grossB / grossA,
  };
}
