/**
 * Stamp Duty Land Tax (SDLT) — England & Northern Ireland.
 * Plus LBTT (Scotland) and LTT (Wales) for cross-border comparison.
 *
 * Effective from 1 April 2025. Verified against:
 *   - gov.uk/stamp-duty-land-tax/residential-property-rates
 *   - revenue.scot/taxes/land-buildings-transaction-tax
 *   - gov.wales/land-transaction-tax-rates-and-bands
 *
 * All slab-rate calculations: each band's rate applies ONLY to the
 * portion of the price within that band, not to the whole price.
 * Surcharges (3% additional, 2% non-resident, 15% company-flat) are
 * applied differently — see notes below.
 */

export type BuyerType =
  | 'standard'      // Replacing main home, sole property
  | 'firstTime'     // First-time buyer
  | 'additional'    // Second home, buy-to-let, holiday home
  | 'nonResident'   // Non-UK resident for SDLT purposes
  | 'addNonRes'     // Both additional AND non-resident (5% surcharge)
  | 'mixedUse'      // Mixed residential/commercial (commercial rates)
  | 'company';      // Company-owned dwelling > £500k (15% flat)

export type Country = 'england' | 'scotland' | 'wales';

export interface SDLTBand {
  from: number;
  to: number;
  rate: number;
  taxOn: number;
  tax: number;
  label: string;
}

export interface SDLTResult {
  country: Country;
  taxName: 'SDLT' | 'LBTT' | 'LTT';
  price: number;
  buyerType: BuyerType;
  bands: SDLTBand[];
  surchargeAmount: number;
  surchargeLabel: string | null;
  total: number;
  effectiveRate: number;
  appliedRules: string[];
  warnings: string[];
}

/* ─────────────────────────────────────────────
   ENGLAND & NI — SDLT (post-April 2025)
───────────────────────────────────────────── */
const SDLT_STANDARD_BANDS = [
  { upTo: 125_000,   rate: 0.00, label: '0% up to £125,000' },
  { upTo: 250_000,   rate: 0.02, label: '2% on £125,001–£250,000' },
  { upTo: 925_000,   rate: 0.05, label: '5% on £250,001–£925,000' },
  { upTo: 1_500_000, rate: 0.10, label: '10% on £925,001–£1.5m' },
  { upTo: Infinity,  rate: 0.12, label: '12% above £1.5m' },
];

const SDLT_FTB_BANDS = [
  { upTo: 300_000, rate: 0.00, label: 'FTB: 0% up to £300,000' },
  { upTo: 500_000, rate: 0.05, label: 'FTB: 5% on £300,001–£500,000' },
];

const SDLT_MIXED_USE_BANDS = [
  { upTo: 150_000,  rate: 0.00, label: 'Mixed-use: 0% up to £150,000' },
  { upTo: 250_000,  rate: 0.02, label: 'Mixed-use: 2% on £150,001–£250,000' },
  { upTo: Infinity, rate: 0.05, label: 'Mixed-use: 5% above £250,000' },
];

/* ─────────────────────────────────────────────
   SCOTLAND — LBTT (Land & Buildings Transaction Tax)
   Residential rates 2025/26 + 8% ADS surcharge
───────────────────────────────────────────── */
const LBTT_STANDARD_BANDS = [
  { upTo: 145_000,  rate: 0.00, label: '0% up to £145,000' },
  { upTo: 250_000,  rate: 0.02, label: '2% on £145,001–£250,000' },
  { upTo: 325_000,  rate: 0.05, label: '5% on £250,001–£325,000' },
  { upTo: 750_000,  rate: 0.10, label: '10% on £325,001–£750,000' },
  { upTo: Infinity, rate: 0.12, label: '12% above £750,000' },
];

const LBTT_FTB_BANDS = [
  { upTo: 175_000,  rate: 0.00, label: 'FTB: 0% up to £175,000' },
  { upTo: 250_000,  rate: 0.02, label: '2% on £175,001–£250,000' },
  { upTo: 325_000,  rate: 0.05, label: '5% on £250,001–£325,000' },
  { upTo: 750_000,  rate: 0.10, label: '10% on £325,001–£750,000' },
  { upTo: Infinity, rate: 0.12, label: '12% above £750,000' },
];

/* ─────────────────────────────────────────────
   WALES — LTT (Land Transaction Tax)
   Residential rates 2025 + 5% higher-rate surcharge
───────────────────────────────────────────── */
const LTT_STANDARD_BANDS = [
  { upTo: 225_000,   rate: 0.00, label: '0% up to £225,000' },
  { upTo: 400_000,   rate: 0.06, label: '6% on £225,001–£400,000' },
  { upTo: 750_000,   rate: 0.075, label: '7.5% on £400,001–£750,000' },
  { upTo: 1_500_000, rate: 0.10, label: '10% on £750,001–£1.5m' },
  { upTo: Infinity,  rate: 0.12, label: '12% above £1.5m' },
];

/* ─────────────────────────────────────────────
   ENGINE
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   ENGLAND & NI — SDLT
───────────────────────────────────────────── */
function calculateSDLTEngland(price: number, buyerType: BuyerType): SDLTResult {
  price = Math.max(0, price);
  const appliedRules: string[] = [];
  const warnings: string[] = [];
  let bands: SDLTBand[] = [];
  let surchargeAmount = 0;
  let surchargeLabel: string | null = null;

  /* Special case: company-owned dwelling > £500k pays 15% flat */
  if (buyerType === 'company' && price > 500_000) {
    bands = [{ from: 0, to: price, rate: 0.15, taxOn: price, tax: price * 0.15, label: 'Company-bought dwelling: 15% flat' }];
    appliedRules.push('15% flat rate for non-natural persons acquiring dwellings > £500,000 (HMRC anti-avoidance, applies unless a relief is claimed).');
    warnings.push('Annual Tax on Enveloped Dwellings (ATED) may also apply — separate annual charge.');
    return {
      country: 'england',
      taxName: 'SDLT',
      price,
      buyerType,
      bands,
      surchargeAmount: 0,
      surchargeLabel: null,
      total: price * 0.15,
      effectiveRate: 0.15,
      appliedRules,
      warnings,
    };
  }

  /* Mixed-use property uses commercial-rate bands (no surcharge) */
  if (buyerType === 'mixedUse') {
    bands = applyBands(price, SDLT_MIXED_USE_BANDS);
    appliedRules.push('Non-residential / mixed-use rates applied — 3% surcharge does NOT apply to mixed-use purchases.');
    const total = bands.reduce((s, b) => s + b.tax, 0);
    return {
      country: 'england',
      taxName: 'SDLT',
      price,
      buyerType,
      bands,
      surchargeAmount: 0,
      surchargeLabel: null,
      total,
      effectiveRate: price > 0 ? total / price : 0,
      appliedRules,
      warnings,
    };
  }

  /* First-time buyer relief */
  if (buyerType === 'firstTime' && price <= 500_000) {
    bands = applyBands(price, SDLT_FTB_BANDS);
    appliedRules.push('First-time buyer relief applied (price ≤ £500,000 cap).');
  } else {
    if (buyerType === 'firstTime' && price > 500_000) {
      appliedRules.push('First-time buyer relief NOT available — purchase price exceeds £500,000 cap. Standard rates applied to the full price.');
      warnings.push('Cliff edge: £500,001 costs £10,000 in SDLT; £499,999 costs £9,999.95. Below the cap, FTB relief saves up to £15,000 vs standard rates.');
    }
    bands = applyBands(price, SDLT_STANDARD_BANDS);
  }

  let total = bands.reduce((s, b) => s + b.tax, 0);

  /* Surcharges (applied on FULL price, not just over a threshold) */
  if (buyerType === 'additional') {
    surchargeAmount = price * 0.03;
    surchargeLabel = '+3% additional-property surcharge on full price';
    total += surchargeAmount;
    appliedRules.push(`Additional-property surcharge: 3% × £${price.toLocaleString('en-GB')} = £${surchargeAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}.`);
  }

  if (buyerType === 'nonResident') {
    surchargeAmount = price * 0.02;
    surchargeLabel = '+2% non-UK resident surcharge on full price';
    total += surchargeAmount;
    appliedRules.push(`Non-resident surcharge: 2% × £${price.toLocaleString('en-GB')} = £${surchargeAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}.`);
  }

  if (buyerType === 'addNonRes') {
    surchargeAmount = price * 0.05;
    surchargeLabel = '+5% combined surcharge (additional 3% + non-resident 2%)';
    total += surchargeAmount;
    appliedRules.push(`Combined surcharge: 5% × £${price.toLocaleString('en-GB')} = £${surchargeAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}.`);
    warnings.push('You may be able to reclaim the 3% portion if you sell your previous main home within 36 months and were UK-resident at the time of the refund claim.');
  }

  return {
    country: 'england',
    taxName: 'SDLT',
    price,
    buyerType,
    bands,
    surchargeAmount,
    surchargeLabel,
    total,
    effectiveRate: price > 0 ? total / price : 0,
    appliedRules,
    warnings,
  };
}

/* ─────────────────────────────────────────────
   SCOTLAND — LBTT
───────────────────────────────────────────── */
function calculateLBTT(price: number, buyerType: BuyerType): SDLTResult {
  price = Math.max(0, price);
  const appliedRules: string[] = [];
  const warnings: string[] = [];
  let bands: SDLTBand[] = [];
  let surchargeAmount = 0;
  let surchargeLabel: string | null = null;

  if (buyerType === 'firstTime' && price <= 175_000) {
    bands = applyBands(price, LBTT_FTB_BANDS);
    appliedRules.push('LBTT first-time buyer relief: 0% up to £175,000.');
  } else if (buyerType === 'firstTime') {
    bands = applyBands(price, LBTT_FTB_BANDS);
    appliedRules.push('LBTT first-time buyer relief: 0% up to £175,000; standard bands above that.');
  } else {
    bands = applyBands(price, LBTT_STANDARD_BANDS);
  }

  let total = bands.reduce((s, b) => s + b.tax, 0);

  /* Additional Dwelling Supplement (ADS) — Scottish equivalent of 3% surcharge.
     Set to 8% from December 2024. */
  if (buyerType === 'additional' || buyerType === 'addNonRes') {
    surchargeAmount = price * 0.08;
    surchargeLabel = '+8% Additional Dwelling Supplement (ADS) on full price';
    total += surchargeAmount;
    appliedRules.push(`ADS: 8% × £${price.toLocaleString('en-GB')} = £${surchargeAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}. Effective from 5 December 2024 (up from 6%).`);
  }

  if (buyerType === 'company' && price > 40_000) {
    surchargeAmount = price * 0.08;
    surchargeLabel = '+8% Additional Dwelling Supplement (ADS) for company purchase';
    total += surchargeAmount;
    appliedRules.push('Scottish LBTT does not have a 15% flat company rate — instead, all corporate dwelling purchases above £40,000 attract the 8% ADS on top of standard bands.');
  }

  if (buyerType === 'mixedUse') {
    warnings.push('LBTT non-residential rates differ — this calculator estimates residential bands. Consult Revenue Scotland for mixed-use commercial transactions.');
  }

  return {
    country: 'scotland',
    taxName: 'LBTT',
    price,
    buyerType,
    bands,
    surchargeAmount,
    surchargeLabel,
    total,
    effectiveRate: price > 0 ? total / price : 0,
    appliedRules,
    warnings,
  };
}

/* ─────────────────────────────────────────────
   WALES — LTT
───────────────────────────────────────────── */
function calculateLTT(price: number, buyerType: BuyerType): SDLTResult {
  price = Math.max(0, price);
  const appliedRules: string[] = [];
  const warnings: string[] = [];
  let surchargeAmount = 0;
  let surchargeLabel: string | null = null;

  const bands = applyBands(price, LTT_STANDARD_BANDS);
  let total = bands.reduce((s, b) => s + b.tax, 0);

  if (buyerType === 'firstTime') {
    appliedRules.push('Wales has no separate first-time buyer relief — the £225,000 nil-rate band already covers most first-time buyer purchases without a special relief tier.');
  }

  if (buyerType === 'additional' || buyerType === 'addNonRes' || buyerType === 'company') {
    surchargeAmount = price * 0.05;
    surchargeLabel = '+5% higher-rate surcharge on full price';
    total += surchargeAmount;
    appliedRules.push(`Higher rate (additional-property): 5% × £${price.toLocaleString('en-GB')} = £${surchargeAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}. Applies to second homes, buy-to-let, and corporate dwelling purchases. Effective 11 December 2024.`);
  }

  if (buyerType === 'nonResident') {
    appliedRules.push('Wales has no non-UK resident surcharge equivalent — only the higher-rate (additional-property) surcharge applies regardless of buyer residence.');
  }

  if (buyerType === 'mixedUse') {
    warnings.push('LTT non-residential rates differ — this calculator estimates residential bands. Consult the Welsh Revenue Authority for mixed-use commercial transactions.');
  }

  return {
    country: 'wales',
    taxName: 'LTT',
    price,
    buyerType,
    bands,
    surchargeAmount,
    surchargeLabel,
    total,
    effectiveRate: price > 0 ? total / price : 0,
    appliedRules,
    warnings,
  };
}

/* ─────────────────────────────────────────────
   PUBLIC API
───────────────────────────────────────────── */
export function calculateSDLT(price: number, buyerType: BuyerType, country: Country = 'england'): SDLTResult {
  switch (country) {
    case 'scotland': return calculateLBTT(price, buyerType);
    case 'wales':    return calculateLTT(price, buyerType);
    default:         return calculateSDLTEngland(price, buyerType);
  }
}

/** Get all 4 main scenarios at a given price — useful for comparison views. */
export function calculateAllScenarios(price: number, country: Country = 'england'): SDLTResult[] {
  return (['standard', 'firstTime', 'additional', 'nonResident'] as BuyerType[])
    .map((b) => calculateSDLT(price, b, country));
}

/** Compare same price across all 3 UK nations. */
export function calculateAllCountries(price: number, buyerType: BuyerType): SDLTResult[] {
  return (['england', 'scotland', 'wales'] as Country[])
    .map((c) => calculateSDLT(price, buyerType, c));
}

/** Calculate refund eligibility for the 3% additional-property surcharge.
 *  You can claim a refund if you sell your previous main home within 36 months
 *  of paying the surcharge AND you're UK-resident at the refund claim date. */
export interface RefundInput {
  purchasePrice: number;
  monthsSincePurchase: number;
  isUKResident: boolean;
  hasSoldOldHome: boolean;
}
export interface RefundResult {
  eligible: boolean;
  refundAmount: number;
  reasons: string[];
  deadlineMonths: number;
}
export function calculateRefund(input: RefundInput): RefundResult {
  const reasons: string[] = [];
  let eligible = input.hasSoldOldHome && input.isUKResident && input.monthsSincePurchase <= 36;
  const deadlineMonths = Math.max(0, 36 - input.monthsSincePurchase);
  const refundAmount = input.purchasePrice * 0.03;

  if (!input.hasSoldOldHome) {
    reasons.push('You must have sold your previous main residence to claim the refund.');
    eligible = false;
  }
  if (input.monthsSincePurchase > 36) {
    reasons.push(`The 36-month deadline has passed (${input.monthsSincePurchase} months since purchase). Refund no longer available.`);
    eligible = false;
  } else if (eligible) {
    reasons.push(`Within the 36-month window: ${deadlineMonths} months remaining to claim.`);
  }
  if (!input.isUKResident) {
    reasons.push('You must be UK-resident at the refund claim date.');
    eligible = false;
  }
  reasons.push('Refund must be claimed within 12 months of selling the previous main home, or within 12 months of the original SDLT return filing date — whichever is later.');

  return { eligible, refundAmount, reasons, deadlineMonths };
}

export const BUYER_LABEL: Record<BuyerType, string> = {
  standard:    'Standard buyer (replacing main home)',
  firstTime:   'First-time buyer',
  additional:  'Second home / buy-to-let (+3%)',
  nonResident: 'Non-UK resident (+2%)',
  addNonRes:   'Additional + non-resident (+5%)',
  mixedUse:    'Mixed-use / commercial element',
  company:     'Company-owned dwelling',
};

export const BUYER_DESC: Record<BuyerType, string> = {
  standard:    'You\'re buying a single residential property to live in, and you\'re replacing your current main home (or it\'s your only property).',
  firstTime:   'Neither you nor anyone buying with you has ever owned a residential property anywhere in the world.',
  additional:  'You already own a residential property (anywhere in the world) and you\'re buying another. Buy-to-let, holiday home, or second residence.',
  nonResident: 'You\'ve been outside the UK for at least 183 days during the 12 months before completion.',
  addNonRes:   'Both: you already own a residential property AND you\'re non-UK resident. Both surcharges stack.',
  mixedUse:    'The property has both residential and commercial elements (e.g. shop with flat above). Non-residential / mixed-use rates apply — no 3% surcharge.',
  company:     'A non-natural person (company, partnership of companies, or collective investment scheme) is buying a single dwelling worth more than £500,000.',
};

export const COUNTRY_LABEL: Record<Country, string> = {
  england:  'England & Northern Ireland',
  scotland: 'Scotland',
  wales:    'Wales',
};
