/**
 * UK Rental income tax calculator — Section 24 (finance cost restriction).
 *
 * Source: gov.uk/guidance/restricting-finance-cost-relief-for-individual-landlords
 *
 * Post Section 24 (fully phased from 6 April 2020):
 *   Mortgage interest is NOT deductible — landlord gets 20% tax credit instead.
 *   Higher-rate taxpayers therefore pay 20% more tax on their interest costs.
 */

const IT_BASIC   = 0.20; const IT_HIGHER = 0.40; const IT_ADD = 0.45;
const PA         = 12570; const BASIC_TOP = 50270; const HIGHER_TOP = 125140;

export interface CalcInput {
  annualRent: number;
  mortgageInterest: number;
  allowableExpenses: number;
  usePropertyAllowance: boolean;
  otherIncome: number;
}

export interface CalcResult {
  grossRent: number;
  allowableDeductions: number;
  taxableProfit: number;
  marginalTaxRate: number;
  taxBeforeCredit: number;
  mortgageTaxCredit: number;
  finalTaxOnRental: number;
  effectiveRate: number;
  section24Impact: number;
  netRentalIncome: number;
}

export function calculateRentalIncomeTax(input: CalcInput): CalcResult {
  const rent      = Math.max(0, input.annualRent);
  const mortgage  = Math.max(0, input.mortgageInterest);
  const expenses  = input.usePropertyAllowance ? Math.min(1000, rent) : Math.max(0, input.allowableExpenses);
  const other     = Math.max(0, input.otherIncome);
  const taxableProfit = Math.max(0, rent - expenses);
  const total     = other + taxableProfit;
  const pa        = total > 125140 ? 0 : total > 100000 ? Math.max(0, PA - (total - 100000) / 2) : PA;
  const pointer   = Math.max(pa, other);

  let taxBeforeCredit = 0, rem = taxableProfit, ptr = pointer;
  if (rem > 0 && ptr < BASIC_TOP)  { const s = Math.min(rem, BASIC_TOP  - ptr); taxBeforeCredit += s * IT_BASIC;  rem -= s; ptr += s; }
  if (rem > 0 && ptr < HIGHER_TOP) { const s = Math.min(rem, HIGHER_TOP - ptr); taxBeforeCredit += s * IT_HIGHER; rem -= s; ptr += s; }
  if (rem > 0) taxBeforeCredit += rem * IT_ADD;

  const mortgageTaxCredit = mortgage * IT_BASIC;
  const finalTax = Math.max(0, taxBeforeCredit - mortgageTaxCredit);

  // Pre-Section-24 comparison (interest was fully deductible)
  const oldProfit = Math.max(0, rent - expenses - mortgage);
  let oldTax = 0, r2 = oldProfit, p2 = pointer;
  if (r2 > 0 && p2 < BASIC_TOP)  { const s = Math.min(r2, BASIC_TOP  - p2); oldTax += s * IT_BASIC;  r2 -= s; p2 += s; }
  if (r2 > 0 && p2 < HIGHER_TOP) { const s = Math.min(r2, HIGHER_TOP - p2); oldTax += s * IT_HIGHER; r2 -= s; }
  if (r2 > 0) oldTax += r2 * IT_ADD;

  const marginalTaxRate = taxableProfit > 0
    ? (pointer < BASIC_TOP ? IT_BASIC : pointer < HIGHER_TOP ? IT_HIGHER : IT_ADD)
    : 0;

  return { grossRent: rent, allowableDeductions: expenses, taxableProfit, marginalTaxRate, taxBeforeCredit, mortgageTaxCredit, finalTaxOnRental: finalTax, effectiveRate: rent > 0 ? finalTax / rent : 0, section24Impact: finalTax - oldTax, netRentalIncome: rent - mortgage - expenses - finalTax };
}
