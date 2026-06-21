/**
 * UK Inheritance Tax (IHT) calculator.
 *
 * Source: gov.uk/inheritance-tax
 *         gov.uk/inheritance-tax-residence-nil-rate-band
 *
 * Rules (2026):
 * - Nil-Rate Band (NRB): £325,000, frozen until April 2030.
 * - Residence Nil-Rate Band (RNRB): £175,000, applies when the family home
 *   passes to direct descendants (children/grandchildren/step/adopted/foster).
 * - Spouse / civil-partner exemption: unlimited transfers between UK-domiciled
 *   spouses are IHT-free, AND any unused NRB / RNRB transfers (TNRB / TRNRB).
 * - Rate: 40% on the excess; reduced to 36% if 10%+ of the net estate is left
 *   to a registered charity.
 * - RNRB tapers £1 for every £2 the estate exceeds £2 million, fully lost
 *   above £2.35m (single) / £2.7m (couple with transferred RNRB).
 *
 * This calculator deliberately does NOT model: lifetime gifts (7-year taper),
 * Business / Agricultural Property Relief, trusts, or non-UK-domiciled estates.
 */

export const NRB = 325000;
export const RNRB = 175000;
export const RATE = 0.40;
export const CHARITY_RATE = 0.36;
export const CHARITY_THRESHOLD = 0.10;        // 10% of net estate
export const RNRB_TAPER_START = 2_000_000;

export interface CalcInput {
  estateValue: number;
  charityGift: number;              // £ left to registered charity
  /** Has the family home (or its proceeds) passed to direct descendants? */
  homeToDescendants: boolean;
  /** Married / civil-partner with unused NRB transferred from late spouse */
  transferredNrb: number;           // £ (0 to 325,000)
  transferredRnrb: number;          // £ (0 to 175,000)
  spouseLegacy: number;             // £ left to UK-domiciled spouse (exempt)
}

export interface CalcResult {
  grossEstate: number;
  spouseExempt: number;
  charityExempt: number;
  netEstate: number;
  totalNrb: number;
  totalRnrb: number;
  rnrbAfterTaper: number;
  taxableEstate: number;
  rateApplied: number;
  iht: number;
  netToHeirs: number;
  charityRateUsed: boolean;
  charityShortfall?: number;
}

export function calculateIHT(input: CalcInput): CalcResult {
  const gross = Math.max(0, input.estateValue);
  const spouseExempt = Math.max(0, input.spouseLegacy);
  const charityExempt = Math.max(0, input.charityGift);
  const netEstate = Math.max(0, gross - spouseExempt - charityExempt);

  const baseNrb = NRB + Math.min(NRB, Math.max(0, input.transferredNrb));
  const baseRnrb = input.homeToDescendants
    ? RNRB + Math.min(RNRB, Math.max(0, input.transferredRnrb))
    : 0;

  /* RNRB taper for £2m+ estates */
  const overTaper = Math.max(0, gross - RNRB_TAPER_START);
  const rnrbAfterTaper = Math.max(0, baseRnrb - overTaper / 2);

  const taxableEstate = Math.max(0, netEstate - baseNrb - rnrbAfterTaper);

  /* Charity reduced rate test: charity gift must be ≥ 10% of the net estate
     (estate after liabilities, exemptions and the NRB, known as the
     "baseline amount"). We approximate against the post-exemption net estate. */
  const baseline = Math.max(1, netEstate - baseNrb - rnrbAfterTaper + charityExempt);
  const charityRateUsed = charityExempt / baseline >= CHARITY_THRESHOLD;
  const rate = charityRateUsed ? CHARITY_RATE : RATE;
  const iht = taxableEstate * rate;
  const charityShortfall = charityRateUsed
    ? undefined
    : Math.max(0, baseline * CHARITY_THRESHOLD - charityExempt);

  return {
    grossEstate: gross,
    spouseExempt,
    charityExempt,
    netEstate,
    totalNrb: baseNrb,
    totalRnrb: rnrbAfterTaper,
    rnrbAfterTaper,
    taxableEstate,
    rateApplied: rate,
    iht,
    netToHeirs: Math.max(0, gross - spouseExempt - charityExempt - iht),
    charityRateUsed,
    charityShortfall,
  };
}
