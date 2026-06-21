/**
 * Central noindex list for secondary / duplicative calculator routes.
 *
 * WHY: AdSense flagged the site for "Low value content". The indexed set was
 * dominated by ~90 calculators spread across many niches, to a reviewer that
 * reads as a made-for-ads utility farm, even though each page has prose. The
 * fix is to keep only the strongest, most-unique calculators indexed so the
 * site's editorial content (visa guides + blog) and flagship tools dominate
 * the indexed surface.
 *
 * These pages STAY LIVE for users (linked from hubs, fully usable). They are
 * only excluded from search via:
 *   1. `X-Robots-Tag: noindex, follow` header (see next.config.ts), and
 *   2. exclusion from sitemap.ts.
 *
 * Fully reversible: move a path out of this array to re-index it.
 * After changing this list, the affected pages must be re-crawled before
 * re-requesting an AdSense review.
 */
export const NOINDEX_TOOL_PATHS: string[] = [
  // ── Loans, debt & credit (10), near-identical amortisation math ──
  '/personal-loan-calculator',
  '/car-finance-calculator',
  '/loan-apr-calculator',
  '/loan-comparison-calculator',
  '/credit-card-payoff-calculator',
  '/debt-consolidation-calculator',
  '/debt-payoff-planner',
  '/balance-transfer-calculator',
  '/loan-affordability-calculator',
  '/loan-early-repayment-calculator',

  // ── Insurance (6), rough premium/cover estimators ──
  '/life-insurance-calculator',
  '/critical-illness-calculator',
  '/income-protection-calculator',
  '/car-insurance-calculator',
  '/home-insurance-calculator',
  '/travel-insurance-calculator',

  // ── Property, secondary to mortgage / affordability / stamp duty (12) ──
  '/overpayment-mortgage',
  '/remortgage-calculator',
  '/ltv-calculator',
  '/house-buying-costs',
  '/deposit-calculator',
  '/buy-vs-rent',
  '/equity-calculator',
  '/property-value-growth',
  '/rental-yield-calculator',
  '/buy-to-let-calculator',
  '/property-cgt-calculator',
  '/rental-income-tax',

  // ── Estate, secondary to inheritance-tax (5) ──
  '/gift-iht-calculator',
  '/estate-value-calculator',
  '/probate-fee-calculator',
  '/will-writing-cost',
  '/power-of-attorney-cost',

  // ── Family law (4), fee/settlement estimators ──
  '/divorce-cost-calculator',
  '/financial-settlement-calculator',
  '/child-maintenance-calculator',
  '/spousal-maintenance-calculator',

  // ── Energy, secondary to energy-bill (3) ──
  '/solar-panel-roi',
  '/heat-pump-calculator',
  '/ev-charging-cost',

  // ── Vehicles, secondary to VED / MOT / ULEZ (2) ──
  '/car-running-costs',
  '/fuel-cost-calculator',

  // ── Savings/pension, secondary to pension-calculator (2) ──
  '/pension-drawdown-calculator',
  '/state-pension',

  // ── Benefits, secondary to universal-credit / childcare (3) ──
  '/council-tax-support-checker',
  '/pip-benefit-checker',
  '/carers-allowance-calculator',

  // ── Business, secondary to VAT / corporation-tax (4) ──
  '/business-rates-calculator',
  '/sole-trader-vs-limited',
  '/salary-vs-dividend-calculator',
  '/paye-employer-cost',

  // ── Misc secondary (1) ──
  '/cost-of-living-uk',
];

/** O(1) membership test for the sitemap filter. */
export const NOINDEX_TOOL_SET = new Set(NOINDEX_TOOL_PATHS);
