/**
 * UK Company Car Benefit-in-Kind (BiK) tax calculator, 2025/26.
 *
 * Source: gov.uk/guidance/company-car-benefit-the-appropriate-percentage
 *
 * BiK value = list price × appropriate percentage (CO2-based)
 * Employee pays IT on BiK value at their marginal rate.
 * Employer pays Class 1A NI (15%) on BiK value.
 */

export type FuelType = 'petrol' | 'diesel' | 'electric' | 'phev';

const PHEV_RANGE: { minMiles: number; pct: number }[] = [
  { minMiles: 130, pct: 5 },
  { minMiles: 70,  pct: 8 },
  { minMiles: 40,  pct: 12 },
  { minMiles: 0,   pct: 14 },
];

export function appropriatePct(co2: number, fuel: FuelType, phevRangeMiles = 0, rde2Compliant = true): number {
  if (fuel === 'electric') return 3;
  if (fuel === 'phev') {
    const band = PHEV_RANGE.find((b) => phevRangeMiles >= b.minMiles);
    return band ? band.pct : 14;
  }
  let pct: number;
  if (co2 <= 50)      pct = 14;
  else if (co2 <= 54) pct = 15;
  else pct = 15 + Math.ceil((co2 - 54) / 5);
  pct = Math.min(37, pct);
  if (fuel === 'diesel' && !rde2Compliant) pct = Math.min(37, pct + 4);
  return pct;
}

export interface CalcInput {
  listPrice: number;
  co2: number;
  fuel: FuelType;
  phevRangeMiles: number;
  rde2Compliant: boolean;
  employeeTaxBand: 'basic' | 'higher' | 'additional';
  capitalContribution: number;
}

const TAX_RATES  = { basic: 0.20, higher: 0.40, additional: 0.45 };
const CLASS1A_NI = 0.15;

export interface CalcResult {
  appropriatePct: number;
  adjustedListPrice: number;
  bikValue: number;
  employeeItCost: number;
  employerNiCost: number;
  totalCost: number;
  monthlyEmployeeIt: number;
}

export function calculateCompanyCarTax(input: CalcInput): CalcResult {
  const capContrib = Math.min(5000, Math.max(0, input.capitalContribution));
  const listPrice  = Math.max(0, input.listPrice - capContrib);
  const pct        = appropriatePct(input.co2, input.fuel, input.phevRangeMiles, input.rde2Compliant);
  const bikValue   = listPrice * pct / 100;
  const itRate     = TAX_RATES[input.employeeTaxBand];
  const employeeIt = bikValue * itRate;
  const employerNi = bikValue * CLASS1A_NI;

  return {
    appropriatePct: pct,
    adjustedListPrice: listPrice,
    bikValue,
    employeeItCost: employeeIt,
    employerNiCost: employerNi,
    totalCost: employeeIt + employerNi,
    monthlyEmployeeIt: employeeIt / 12,
  };
}
