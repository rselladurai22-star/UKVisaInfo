/**
 * UK Rental yield + BTL ICR affordability calculator.
 *
 * Source: gov.uk/guidance/income-tax-when-you-rent-out-a-property
 *         PRA SS13/16 (BTL ICR guidance)
 *
 * Gross yield:  Annual rent / Purchase price × 100
 * Net yield:    (Annual rent − costs) / Purchase price × 100
 *
 * BTL ICR stress test:
 *   Basic-rate landlord:  125% ICR at stressed rate (pay rate + 2%, min 5.5%)
 *   Higher-rate landlord: 145% ICR
 */

export interface CalcInput {
  purchasePrice: number;
  monthlyRent: number;
  agentFeePct: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualVoids: number;
  mortgageAmount: number;
  mortgageRatePct: number;
  higherRateTaxpayer: boolean;
}

export interface CalcResult {
  annualRent: number;
  annualCosts: number;
  netAnnualIncome: number;
  grossYield: number;
  netYield: number;
  annualInterest: number;
  stressedInterest: number;
  requiredICR: number;
  actualICR: number;
  icrPasses: boolean;
  maxBorrowable: number;
}

export function calculateRentalYield(input: CalcInput): CalcResult {
  const price   = Math.max(1, input.purchasePrice);
  const monthly = Math.max(0, input.monthlyRent);
  const annual  = monthly * 12;

  const agentFee  = annual * (input.agentFeePct / 100);
  const costs     = agentFee + input.annualInsurance + input.annualMaintenance + input.annualVoids;
  const netIncome = Math.max(0, annual - costs);

  const grossYield = (annual / price) * 100;
  const netYield   = (netIncome / price) * 100;

  const payRate     = input.mortgageRatePct / 100;
  const stressRate  = Math.max(0.055, payRate + 0.02);
  const annualInt   = input.mortgageAmount * payRate;
  const stressedInt = input.mortgageAmount * stressRate;
  const icr         = input.higherRateTaxpayer ? 1.45 : 1.25;
  const actualICR   = stressedInt > 0 ? annual / stressedInt : Infinity;
  const maxBorrow   = (annual / icr) / stressRate;

  return { annualRent: annual, annualCosts: costs, netAnnualIncome: netIncome, grossYield, netYield, annualInterest: annualInt, stressedInterest: stressedInt, requiredICR: icr, actualICR, icrPasses: actualICR >= icr, maxBorrowable: maxBorrow };
}
