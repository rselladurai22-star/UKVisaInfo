/**
 * UK Mortgage Affordability + Repayment calculator.
 *
 * Affordability uses the standard UK lender heuristic: 4.5× annual income
 * (combined for joint applications) minus an adjustment for committed
 * outgoings. Lenders also stress-test at a higher rate — we use the FCA
 * legacy buffer of +3% over the product rate.
 *
 * Monthly repayment uses standard repayment-mortgage formula:
 *   P = L · r · (1+r)^n / ((1+r)^n − 1)
 *   r = monthly rate, n = total months.
 */

export interface MortgageInputs {
  /** Combined annual gross income */
  annualIncome: number;
  /** Monthly outgoings on existing debts (credit, loans) */
  monthlyOutgoings: number;
  /** Deposit available */
  deposit: number;
  /** Product interest rate (annual, %) */
  rate: number;
  /** Term in years */
  termYears: number;
}

export interface MortgageResult {
  // Affordability
  baseMaxBorrow: number;          // 4.5× income
  outgoingsAdjustment: number;    // £ removed for outgoings
  affordableBorrow: number;       // base − outgoings adjustment
  stressedBorrow: number;         // affordable, stress-tested
  // Property price
  maxPropertyPrice: number;
  deposit: number;
  depositPct: number;             // of max property price
  // Repayment
  monthlyRepayment: number;
  monthlyRepaymentStressed: number;
  totalRepayable: number;
  totalInterest: number;
  // Meta
  rate: number;
  stressRate: number;
  termYears: number;
}

/** Lender income multiple (varies 4-5.5; we use 4.5 mainstream) */
const INCOME_MULTIPLE = 4.5;
/** FCA legacy stress-test buffer over product rate */
const STRESS_BUFFER = 3.0;

/**
 * Outgoings reduce borrowing roughly £100 of borrowing per £4-5 of monthly
 * committed credit — we use a 60× monthly multiplier as a reasonable
 * mainstream-lender heuristic.
 */
const OUTGOINGS_MULTIPLIER = 60;

function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0) return 0;
  if (years <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const income = Math.max(0, inputs.annualIncome);
  const outgoings = Math.max(0, inputs.monthlyOutgoings);
  const deposit = Math.max(0, inputs.deposit);
  const rate = Math.max(0, inputs.rate);
  const termYears = Math.max(1, Math.min(40, inputs.termYears));

  const baseMaxBorrow = income * INCOME_MULTIPLE;
  const outgoingsAdjustment = outgoings * OUTGOINGS_MULTIPLIER;
  const affordableBorrow = Math.max(0, baseMaxBorrow - outgoingsAdjustment);

  // Stress test: simulate at rate + buffer for the same monthly payment.
  // We estimate stressed borrow by solving the payment formula with the
  // higher rate but same affordability headroom. For simplicity we use
  // a 12% haircut on affordable borrow as a proxy (close to FCA model).
  // Better: derive from a target monthly cap.
  const baseMonthly = monthlyPayment(affordableBorrow, rate, termYears);
  // What principal would the same payment buy at rate + buffer?
  const stressedRate = rate + STRESS_BUFFER;
  const stressedBorrow = principalFromPayment(baseMonthly, stressedRate, termYears);

  const maxPropertyPrice = affordableBorrow + deposit;
  const depositPct = maxPropertyPrice > 0 ? deposit / maxPropertyPrice : 0;

  const monthlyRepayment = monthlyPayment(affordableBorrow, rate, termYears);
  const monthlyRepaymentStressed = monthlyPayment(affordableBorrow, stressedRate, termYears);
  const totalRepayable = monthlyRepayment * termYears * 12;
  const totalInterest = totalRepayable - affordableBorrow;

  return {
    baseMaxBorrow,
    outgoingsAdjustment,
    affordableBorrow,
    stressedBorrow,
    maxPropertyPrice,
    deposit,
    depositPct,
    monthlyRepayment,
    monthlyRepaymentStressed,
    totalRepayable,
    totalInterest,
    rate,
    stressRate: stressedRate,
    termYears,
  };
}

function principalFromPayment(payment: number, annualRatePct: number, years: number): number {
  if (payment <= 0 || years <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  if (r === 0) return payment * n;
  return payment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
}
