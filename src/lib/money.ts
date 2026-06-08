// Locale-aware currency + percent formatting for the multi-country build.
//
// Existing UK code uses gbp()/pct() from tax2526.ts — keep those for UK pages.
// New country-generic calculators should format via money()/percent() using the
// active CountryConfig's locale + currency, so the same component works for
// GBP/USD/CAD/etc without hardcoding the £ sign.

export function money(amount: number, currency = 'GBP', locale = 'en-GB', dp = 0): string {
  const n = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(n);
}

export function percent(n: number, dp = 1, locale = 'en-GB'): string {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(v / 100);
}

/** Bind formatters to a country once, e.g. const { money } = formattersFor(country). */
export function formattersFor(opts: { currency: string; locale: string }) {
  return {
    money: (amount: number, dp = 0) => money(amount, opts.currency, opts.locale, dp),
    percent: (n: number, dp = 1) => percent(n, dp, opts.locale),
  };
}
