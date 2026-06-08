// Multi-country foundation. One Next.js app, one domain, country as a routing
// segment (/uk, /us, ...). Each country supplies its own config: locale,
// currency, tax year, brand strings and the list of calculators it enables.
//
// This file defines the shape only. Adding a country = add a `<code>.ts` config
// and register it in `index.ts`. The UI/engine stay generic and read the active
// CountryConfig via the router segment.

export type CountryCode = 'uk' | 'us' | 'ca' | 'au' | 'ie';

export interface CountryConfig {
  /** URL segment + key, e.g. 'uk'. */
  code: CountryCode;
  /** BCP-47 tag for <html lang>, hreflang and Intl formatting, e.g. 'en-GB'. */
  hreflang: string;
  /** Intl locale for number/date formatting (usually same as hreflang). */
  locale: string;
  /** ISO 4217 currency, e.g. 'GBP'. */
  currency: string;
  /** Human country name, e.g. 'United Kingdom'. */
  name: string;
  /** Short adjective for copy, e.g. 'UK'. */
  short: string;
  /** Current tax year label for headings/metadata, e.g. '2025/26'. */
  taxYear: string;
  /** Whether this country is published (false = built but hidden). */
  live: boolean;
  /**
   * Calculator slugs enabled for this country. A calculator absent here is not
   * routed/linked for that country (avoids dead or irrelevant pages).
   */
  calculators: string[];
}
