/**
 * UK Mortgage overpayment calculator.
 *
 * Calculates how much interest and time is saved by making extra monthly
 * overpayments on a repayment mortgage.
 *
 * Note: Many lenders cap annual overpayments at 10% of the outstanding balance
 * without an early repayment charge (ERC). This calculator does not enforce
 * that cap — users should check their specific mortgage terms.
 */

export interface CalcInput {
  outstandingBalance: number;
  annualRatePct: number;
  remainingTermMonths: number;
  monthlyOverpayment: number;  // extra payment per month above standard repayment
}

export interface CalcResult {
  standardMonthlyPayment: number;
  standardTotalInterest: number;
  standardTotalCost: number;
  newMonthlyPayment: number;
  newTotalInterest: number;
  newTotalCost: number;
  interestSaved: number;
  monthsSaved: number;
  yearsSaved: number;
  newTermMonths: number;
  newTermLabel: string;
}

function monthlyPayment(balance: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return balance / months;
  return balance * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

function totalInterest(balance: number, monthlyRate: number, payment: number): { interest: number; months: number } {
  let remaining = balance;
  let interest  = 0;
  let months    = 0;
  const MAX = 600; // 50 years safety cap
  while (remaining > 0.01 && months < MAX) {
    const int = remaining * monthlyRate;
    interest  += int;
    remaining  = remaining + int - payment;
    if (remaining < 0) remaining = 0;
    months++;
  }
  return { interest, months };
}

function fmtTerm(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} month${m !== 1 ? 's' : ''}`;
  if (m === 0) return `${y} year${y !== 1 ? 's' : ''}`;
  return `${y} year${y !== 1 ? 's' : ''} ${m} month${m !== 1 ? 's' : ''}`;
}

export function calculateMortgageOverpayment(input: CalcInput): CalcResult {
  const balance  = Math.max(0, input.outstandingBalance);
  const rate     = Math.max(0, input.annualRatePct / 100 / 12);
  const term     = Math.max(1, Math.floor(input.remainingTermMonths));
  const extra    = Math.max(0, input.monthlyOverpayment);

  const stdPayment = monthlyPayment(balance, rate, term);
  const std        = totalInterest(balance, rate, stdPayment);
  const newPayment = stdPayment + extra;
  const newResult  = totalInterest(balance, rate, newPayment);

  const monthsSaved = std.months - newResult.months;

  return {
    standardMonthlyPayment: stdPayment,
    standardTotalInterest: std.interest,
    standardTotalCost: balance + std.interest,
    newMonthlyPayment: newPayment,
    newTotalInterest: newResult.interest,
    newTotalCost: balance + newResult.interest,
    interestSaved: std.interest - newResult.interest,
    monthsSaved,
    yearsSaved: monthsSaved / 12,
    newTermMonths: newResult.months,
    newTermLabel: fmtTerm(newResult.months),
  };
}
