/**
 * Stamp Duty Land Tax (SDLT) — England & Northern Ireland.
 * Rates effective from 1 April 2025.
 *
 * gov.uk/stamp-duty-land-tax/residential-property-rates
 *
 * Scotland uses LBTT (Land and Buildings Transaction Tax) and Wales uses
 * LTT (Land Transaction Tax) — both have their own bands. We handle
 * England/NI here. Scotland + Wales are flagged with a "use LBTT/LTT" notice.
 */

export type BuyerType = 'standard' | 'firstTime' | 'additional' | 'nonResident';

export interface SDLTBand { from: number; to: number; rate: number; taxOn: number; tax: number; label: string }
export interface SDLTResult {
  price: number;
  buyerType: BuyerType;
  bands: SDLTBand[];
  total: number;
  effectiveRate: number;
  appliedRules: string[];
}

/** Standard residential rates (post-April 2025) */
const STANDARD_BANDS = [
  { upTo: 125000,  rate: 0.00, label: '0% up to £125,000' },
  { upTo: 250000,  rate: 0.02, label: '2% on £125,001-£250,000' },
  { upTo: 925000,  rate: 0.05, label: '5% on £250,001-£925,000' },
  { upTo: 1500000, rate: 0.10, label: '10% on £925,001-£1.5m' },
  { upTo: Infinity, rate: 0.12, label: '12% above £1.5m' },
];

/** First-time buyer relief (price ≤ £500,000) */
const FTB_BANDS = [
  { upTo: 300000,  rate: 0.00, label: 'FTB: 0% up to £300,000' },
  { upTo: 500000,  rate: 0.05, label: 'FTB: 5% on £300,001-£500,000' },
];

function applyBands(price: number, bands: { upTo: number; rate: number; label: string }[]): SDLTBand[] {
  const out: SDLTBand[] = [];
  let from = 0;
  for (const b of bands) {
    const to = b.upTo;
    const taxOn = Math.max(0, Math.min(price, to) - from);
    if (taxOn > 0) {
      out.push({ from, to, rate: b.rate, taxOn, tax: taxOn * b.rate, label: b.label });
    }
    from = to;
    if (price <= to) break;
  }
  return out;
}

export function calculateSDLT(price: number, buyerType: BuyerType): SDLTResult {
  price = Math.max(0, price);
  const appliedRules: string[] = [];
  let bands: SDLTBand[] = [];

  if (buyerType === 'firstTime' && price <= 500000) {
    bands = applyBands(price, FTB_BANDS);
    appliedRules.push('First-time buyer relief applied (price ≤ £500,000)');
  } else {
    if (buyerType === 'firstTime' && price > 500000) {
      appliedRules.push('First-time buyer relief NOT available — price exceeds £500,000 cap');
    }
    bands = applyBands(price, STANDARD_BANDS);
  }

  let total = bands.reduce((s, b) => s + b.tax, 0);

  if (buyerType === 'additional') {
    const surcharge = price * 0.03;
    total += surcharge;
    appliedRules.push(`+3% additional-property surcharge on full price (£${surcharge.toLocaleString('en-GB', { maximumFractionDigits: 0 })})`);
  }

  if (buyerType === 'nonResident') {
    const surcharge = price * 0.02;
    total += surcharge;
    appliedRules.push(`+2% non-UK resident surcharge on full price (£${surcharge.toLocaleString('en-GB', { maximumFractionDigits: 0 })})`);
  }

  return {
    price,
    buyerType,
    bands,
    total,
    effectiveRate: price > 0 ? total / price : 0,
    appliedRules,
  };
}

export const BUYER_LABEL: Record<BuyerType, string> = {
  standard:    'Standard buyer (replacing main home)',
  firstTime:   'First-time buyer',
  additional:  'Second home / buy-to-let (+3%)',
  nonResident: 'Non-UK resident (+2%)',
};
