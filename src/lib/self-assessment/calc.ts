/**
 * UK Self Assessment tax bill estimator — 2025/26.
 *
 * Source: gov.uk/self-assessment-tax-returns
 *
 * Estimates total Income Tax + Class 4 NI liability across employment,
 * self-employment, property, dividends and savings income.
 */

import { calculateNI } from '../ni/calc';

const PA         = 12570; const BASIC_TOP = 50270; const HIGHER_TOP = 125140;
const IT_BASIC   = 0.20;  const IT_HIGHER = 0.40;  const IT_ADD = 0.45;
const DIV_ALLOWANCE = 500;
const DIV_BASIC  = 0.0875; const DIV_HIGHER = 0.3375; const DIV_ADD = 0.3935;

export interface CalcInput {
  employmentIncome: number;
  selfEmployedProfit: number;
  propertyIncome: number;
  dividends: number;
  savingsInterest: number;
  payeAlreadyPaid: number;
}

export interface CalcResult {
  totalIncome: number;
  personalAllowance: number;
  incomeTax: number;
  class4Ni: number;
  dividendTax: number;
  totalTaxLiability: number;
  payeAlreadyPaid: number;
  balancingPayment: number;
  firstPaymentOnAccount: number;
}

export function calculateSelfAssessment(input: CalcInput): CalcResult {
  const employment = Math.max(0, input.employmentIncome);
  const seProfit   = Math.max(0, input.selfEmployedProfit);
  const property   = Math.max(0, input.propertyIncome);
  const dividends  = Math.max(0, input.dividends);
  const savings    = Math.max(0, input.savingsInterest);
  const payePaid   = Math.max(0, input.payeAlreadyPaid);

  const nonSavings = employment + seProfit + property;
  const total      = nonSavings + dividends + savings;

  const pa = total > 125140 ? 0 : total > 100000 ? Math.max(0, PA - (total - 100000) / 2) : PA;

  // Non-savings IT
  let it = 0;
  const nsAbove = Math.max(0, nonSavings - pa);
  it += Math.min(nsAbove, Math.max(0, BASIC_TOP - pa)) * IT_BASIC;
  it += Math.min(Math.max(0, nsAbove - Math.max(0, BASIC_TOP - pa)), HIGHER_TOP - BASIC_TOP) * IT_HIGHER;
  it += Math.max(0, nsAbove - Math.max(0, HIGHER_TOP - pa)) * IT_ADD;

  // Savings PSA
  const psa = total <= BASIC_TOP ? 1000 : total <= HIGHER_TOP ? 500 : 0;
  const savingsPointer = Math.max(nonSavings, pa);
  const savingsTaxable = Math.max(0, savings - psa);
  let sRem = savingsTaxable;
  let sPtr = savingsPointer;
  if (sRem > 0 && sPtr < BASIC_TOP)  { const s = Math.min(sRem, BASIC_TOP  - sPtr); it += s * IT_BASIC;  sRem -= s; sPtr += s; }
  if (sRem > 0 && sPtr < HIGHER_TOP) { const s = Math.min(sRem, HIGHER_TOP - sPtr); it += s * IT_HIGHER; sRem -= s; }
  if (sRem > 0) it += sRem * IT_ADD;

  // Dividend IT
  const divTaxable = Math.max(0, dividends - DIV_ALLOWANCE);
  const divPointer = Math.max(0, nonSavings + savings - pa);
  let divRem = divTaxable, divPtr = divPointer, divTax = 0;
  if (divRem > 0 && divPtr < BASIC_TOP  - pa) { const s = Math.min(divRem, BASIC_TOP  - pa - divPtr); divTax += s * DIV_BASIC;  divRem -= s; divPtr += s; }
  if (divRem > 0 && divPtr < HIGHER_TOP - pa) { const s = Math.min(divRem, HIGHER_TOP - pa - divPtr); divTax += s * DIV_HIGHER; divRem -= s; }
  if (divRem > 0) divTax += divRem * DIV_ADD;
  it += divTax;

  // Class 4 NI
  const class4 = calculateNI({ kind: 'self-employed', profit: seProfit, payClass2Voluntary: false });

  const totalLiability = it + class4.total;
  const balancing      = totalLiability - payePaid;
  const poac           = Math.max(0, balancing) / 2;

  return { totalIncome: total, personalAllowance: pa, incomeTax: it, class4Ni: class4.total, dividendTax: divTax, totalTaxLiability: totalLiability, payeAlreadyPaid: payePaid, balancingPayment: balancing, firstPaymentOnAccount: poac };
}
