/**
 * UK Property Capital Gains Tax calculator (residential property) — 2025/26.
 *
 * Source: gov.uk/capital-gains-tax/rates
 *         gov.uk/tax-sell-home  (Private Residence Relief)
 *         gov.uk/report-and-pay-your-capital-gains-tax (60-day rule)
 *
 * 2025/26 rates (from 30 October 2024 Budget):
 *   Basic-rate taxpayer:    18% on residential property gains
 *   Higher/additional rate: 24% on residential property gains
 *
 * Annual Exempt Amount: £3,000 (from 6 April 2024)
 *
 * Private Residence Relief (PPR):
 *   The final 9 months of ownership always qualify regardless of occupancy.
 *   PPR fraction = (qualifying months / total ownership months) × gain
 *
 * 60-day reporting rule: HMRC must be notified within 60 days of completion.
 */

const CGT_BASIC   = 0.18;   // residential property, basic-rate taxpayer
const CGT_HIGHER  = 0.24;   // residential property, higher/additional-rate taxpayer
const AEA         = 3000;   // Annual Exempt Amount 2025/26
const PPR_FINAL   = 9;      // final 9 months always exempt

export interface CalcInput {
  purchasePrice: number;
  salePrice: number;
  ownershipMonths: number;
  occupiedMonths: number;         // months as main residence
  lettingRelief: boolean;         // old-style letting relief (pre-2020 stays, grandfathered)
  purchaseCosts: number;          // solicitor, stamp duty etc
  improvementCosts: number;       // capital improvements (not repairs)
  saleCosts: number;              // estate agent, conveyancing
  taxableIncome: number;          // employment + other income (to determine CGT rate band)
}

export interface CalcResult {
  gain: number;
  pprRelief: number;
  gainAfterPpr: number;
  annualExemptAmount: number;
  taxableGain: number;
  basicRateTax: number;
  higherRateTax: number;
  totalCgt: number;
  effectiveRate: number;
  pprPct: number;
  qualifyingMonths: number;
}

const PA        = 12570;
const BASIC_TOP = 50270;

export function calculatePropertyCgt(input: CalcInput): CalcResult {
  const proceeds  = Math.max(0, input.salePrice);
  const base      = Math.max(0, input.purchasePrice + input.purchaseCosts + input.improvementCosts);
  const netProceeds = Math.max(0, proceeds - input.saleCosts);
  const gain      = Math.max(0, netProceeds - base);

  const totalMonths     = Math.max(1, input.ownershipMonths);
  const qualifyingMonths = Math.min(totalMonths, input.occupiedMonths + PPR_FINAL);
  const pprPct          = qualifyingMonths / totalMonths;
  const pprRelief       = gain * pprPct;
  const gainAfterPpr    = Math.max(0, gain - pprRelief);

  const taxableGain = Math.max(0, gainAfterPpr - AEA);

  // Determine how much of gain falls in basic vs higher band
  const income  = Math.max(0, input.taxableIncome);
  const basicBandLeft = Math.max(0, BASIC_TOP - Math.max(PA, income));
  const basicSlice    = Math.min(taxableGain, basicBandLeft);
  const higherSlice   = Math.max(0, taxableGain - basicSlice);

  const basicRateTax  = basicSlice  * CGT_BASIC;
  const higherRateTax = higherSlice * CGT_HIGHER;
  const totalCgt      = basicRateTax + higherRateTax;

  return { gain, pprRelief, gainAfterPpr, annualExemptAmount: AEA, taxableGain, basicRateTax, higherRateTax, totalCgt, effectiveRate: gain > 0 ? totalCgt / gain : 0, pprPct, qualifyingMonths };
}
