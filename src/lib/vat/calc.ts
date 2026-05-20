/**
 * UK VAT calculator.
 *
 * UK VAT rates (HMRC, current):
 *   – Standard     20%
 *   – Reduced       5%   (domestic fuel, children's car seats, mobility aids, etc.)
 *   – Zero          0%   (most food, books, children's clothes, public transport)
 *
 * Source: HMRC VAT Notice 700; https://www.gov.uk/guidance/rates-of-vat-on-different-goods-and-services
 */

export type VatRate = 20 | 5 | 0;
export type VatMode = 'add' | 'remove';

export interface VatResult {
  net: number;
  vat: number;
  gross: number;
  rate: VatRate;
  mode: VatMode;
}

export function calcVat(amount: number, rate: VatRate, mode: VatMode): VatResult {
  const safe = Math.max(0, Number.isFinite(amount) ? amount : 0);
  if (mode === 'add') {
    const net = safe;
    const vat = net * (rate / 100);
    return { net, vat, gross: net + vat, rate, mode };
  }
  // remove: input is gross
  const gross = safe;
  const net = gross / (1 + rate / 100);
  return { net, vat: gross - net, gross, rate, mode };
}
