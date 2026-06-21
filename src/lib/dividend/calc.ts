/**
 * UK Dividend tax calculator, 2026/27.
 *
 * Source: gov.uk/tax-on-dividends
 *
 * Rules:
 * - Personal Allowance (£12,570) applies first to any non-dividend income;
 *   unused PA can cover dividends.
 * - Dividend Allowance of £500 (since 6 April 2024), taxed at 0%.
 * - After PA + DA, dividends are stacked on top of other income and taxed at:
 *     basic     8.75%   (within basic-rate band, up to £50,270)
 *     higher   33.75%   (£50,271 to £125,140)
 *     additional 39.35% (above £125,140)
 *
 * Note: Personal Allowance tapers £1 for every £2 over £100k.
 */

export const PA = 12570;
export const DIVIDEND_ALLOWANCE = 500;
export const BASIC_TOP = 50270;
export const HIGHER_TOP = 125140;
export const PA_TAPER_START = 100000;
export const PA_TAPER_END = 125140;
export const RATE_BASIC = 0.0875;
export const RATE_HIGHER = 0.3375;
export const RATE_ADDITIONAL = 0.3935;

export interface CalcInput {
  /** Salary / other non-dividend income (gross annual £) */
  otherIncome: number;
  /** Gross dividends received (annual £) */
  dividends: number;
}

export interface BandRow {
  label: string;
  rate: number;
  amount: number;
  tax: number;
}

export interface CalcResult {
  totalIncome: number;
  personalAllowance: number;
  paUsedByOther: number;
  paLeftForDividends: number;
  dividendAllowanceUsed: number;
  taxableDividends: number;
  bands: BandRow[];
  totalTax: number;
  effectiveDividendRate: number;
  netDividends: number;
}

function personalAllowance(total: number): number {
  if (total <= PA_TAPER_START) return PA;
  if (total >= PA_TAPER_END) return 0;
  return Math.max(0, PA - (total - PA_TAPER_START) / 2);
}

export function calculateDividendTax(input: CalcInput): CalcResult {
  const other = Math.max(0, input.otherIncome);
  const div = Math.max(0, input.dividends);
  const total = other + div;
  const pa = personalAllowance(total);

  const paUsedByOther = Math.min(other, pa);
  const paLeftForDividends = Math.max(0, pa - paUsedByOther);

  /* Dividends above PA and DA are taxable. */
  const dividendsAfterPa = Math.max(0, div - paLeftForDividends);
  const dividendAllowanceUsed = Math.min(DIVIDEND_ALLOWANCE, dividendsAfterPa);
  const taxableDividends = Math.max(0, dividendsAfterPa - dividendAllowanceUsed);

  /* Stack taxable dividends on top of other income (the standard rule). */
  const stackFloor = other;       // dividends sit above other income
  const bands: BandRow[] = [];

  const sliceInBand = (from: number, to: number) =>
    Math.max(0, Math.min(stackFloor + div, to) - Math.max(stackFloor + (div - taxableDividends), from));
  // Simpler: walk through bands relative to total taxable dividends starting point.

  let remaining = taxableDividends;
  let pointer = stackFloor + paLeftForDividends + dividendAllowanceUsed; // top of "tax-free zone" inside dividends slice

  const basicCap = BASIC_TOP;
  const higherCap = HIGHER_TOP;

  if (remaining > 0 && pointer < basicCap) {
    const slice = Math.min(remaining, basicCap - pointer);
    bands.push({ label: 'Basic rate (8.75%)', rate: RATE_BASIC, amount: slice, tax: slice * RATE_BASIC });
    remaining -= slice; pointer += slice;
  }
  if (remaining > 0 && pointer < higherCap) {
    const slice = Math.min(remaining, higherCap - pointer);
    bands.push({ label: 'Higher rate (33.75%)', rate: RATE_HIGHER, amount: slice, tax: slice * RATE_HIGHER });
    remaining -= slice; pointer += slice;
  }
  if (remaining > 0) {
    bands.push({ label: 'Additional rate (39.35%)', rate: RATE_ADDITIONAL, amount: remaining, tax: remaining * RATE_ADDITIONAL });
  }

  const totalTax = bands.reduce((s, b) => s + b.tax, 0);

  return {
    totalIncome: total,
    personalAllowance: pa,
    paUsedByOther,
    paLeftForDividends,
    dividendAllowanceUsed,
    taxableDividends,
    bands,
    totalTax,
    effectiveDividendRate: div > 0 ? totalTax / div : 0,
    netDividends: div - totalTax,
  };
}
