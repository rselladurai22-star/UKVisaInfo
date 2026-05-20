/**
 * UK Capital Gains Tax — 2026/27.
 *
 * Annual Exempt Amount (AEA): £3,000 (frozen from 2024/25).
 * Rates (from 30 Oct 2024 onwards — Autumn Budget 2024 alignment):
 *   – Basic rate band:   18% on all gains
 *   – Higher rate band:  24% on all gains
 * Residential property and non-property assets now share the same rates.
 *
 * The trick: gains stack on top of taxable income. Whatever basic-rate
 * band is unused gets taxed at 18%; the rest at 24%.
 *
 * Sources: HMRC CG manual, gov.uk – "Capital Gains Tax: rates and allowances".
 */

const PA_2026_27 = 12_570;
const BASIC_BAND_TOP = 50_270;          // £37,700 above PA
const BASIC_BAND_WIDTH = BASIC_BAND_TOP - PA_2026_27; // 37,700
const AEA = 3_000;
const RATE_BASIC = 0.18;
const RATE_HIGHER = 0.24;

export interface CgtInput {
  grossIncome: number;           // total taxable income (e.g. salary, rental)
  totalGain: number;             // gross gain in the year
  aeaUsedElsewhere?: number;     // if AEA already used (e.g. across multiple disposals managed elsewhere)
}

export interface CgtResult {
  totalGain: number;
  aeaApplied: number;
  taxableGain: number;
  gainAtBasic: number;
  gainAtHigher: number;
  taxAtBasic: number;
  taxAtHigher: number;
  totalTax: number;
  netGain: number;
  effectiveRate: number;
  unusedBasicBand: number;
}

export function calcCgt(input: CgtInput): CgtResult {
  const grossIncome = Math.max(0, input.grossIncome);
  const totalGain = Math.max(0, input.totalGain);
  const aeaRemaining = Math.max(0, AEA - (input.aeaUsedElsewhere ?? 0));

  const aeaApplied = Math.min(totalGain, aeaRemaining);
  const taxableGain = totalGain - aeaApplied;

  // Taxable income above PA; the part inside the basic band uses up the band
  const taxableIncome = Math.max(0, grossIncome - PA_2026_27);
  const usedBasicBand = Math.min(taxableIncome, BASIC_BAND_WIDTH);
  const unusedBasicBand = BASIC_BAND_WIDTH - usedBasicBand;

  const gainAtBasic = Math.min(taxableGain, unusedBasicBand);
  const gainAtHigher = Math.max(0, taxableGain - gainAtBasic);

  const taxAtBasic = gainAtBasic * RATE_BASIC;
  const taxAtHigher = gainAtHigher * RATE_HIGHER;
  const totalTax = taxAtBasic + taxAtHigher;

  return {
    totalGain,
    aeaApplied,
    taxableGain,
    gainAtBasic,
    gainAtHigher,
    taxAtBasic,
    taxAtHigher,
    totalTax,
    netGain: totalGain - totalTax,
    effectiveRate: totalGain > 0 ? totalTax / totalGain : 0,
    unusedBasicBand,
  };
}
