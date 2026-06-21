import type { CountryConfig } from './types';

// United Kingdom, the launch country. Rates live in src/lib/tax2526.ts and the
// per-calculator libs; this config carries locale/brand/enablement only.
export const UK: CountryConfig = {
  code: 'uk',
  hreflang: 'en-GB',
  locale: 'en-GB',
  currency: 'GBP',
  name: 'United Kingdom',
  short: 'UK',
  taxYear: '2025/26',
  live: true,
  // Mirrors the slugs already shipped. Keep in sync as calculators are added.
  calculators: [
    // money & tax
    'take-home-pay', 'national-insurance-calculator', 'pension-calculator',
    // business
    'vat-calculator', 'corporation-tax-calculator', 'business-rates-calculator',
    'sole-trader-vs-limited', 'salary-vs-dividend-calculator', 'paye-employer-cost',
    // property
    'mortgage-calculator', 'stamp-duty-calculator', 'house-buying-costs',
    // estate
    'inheritance-tax', 'estate-value-calculator', 'gift-iht-calculator',
    'probate-fee-calculator', 'will-writing-cost', 'power-of-attorney-cost',
    // benefits
    'universal-credit-calculator', 'childcare-calculator',
    'council-tax-support-checker', 'pip-benefit-checker', 'carers-allowance-calculator',
    // family
    'divorce-cost-calculator', 'financial-settlement-calculator',
    'child-maintenance-calculator', 'spousal-maintenance-calculator',
    // motoring
    'vehicle-tax-calculator', 'car-running-costs', 'fuel-cost-calculator',
    'ulez-check', 'mot-check',
    // energy
    'energy-bill', 'solar-panel-roi', 'heat-pump-calculator', 'ev-charging-cost',
    // loans
    'loan-comparison-calculator', 'balance-transfer-calculator',
    'loan-affordability-calculator', 'loan-early-repayment-calculator',
    // employment
    'salary-compare', 'holiday-pay', 'redundancy-pay', 'maternity-pay',
    'sick-pay', 'minimum-wage-checker',
  ],
};
