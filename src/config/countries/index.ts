// Country registry. Add a new market by importing its config and listing it
// here. `DEFAULT_COUNTRY` is served at the bare root until geo-routing exists.
//
// Brand/domain are intentionally single constants so the eventual rename
// (ukvisainfo.co.uk → final brand domain) touches one place.

import type { CountryCode, CountryConfig } from './types';
import { UK } from './uk';

/** Final brand + domain. Update both when the domain is locked. */
export const BRAND = 'UKDesk';
export const SITE_ORIGIN = 'https://ukvisainfo.co.uk';

export const COUNTRIES: Partial<Record<CountryCode, CountryConfig>> = {
  uk: UK,
  // us: US,   ← add a real config, then it auto-routes + enters the sitemap
  // ca: CA,
};

export const DEFAULT_COUNTRY: CountryCode = 'uk';

/** All published countries (for routing / sitemap / hreflang). */
export const LIVE_COUNTRIES: CountryConfig[] = Object.values(COUNTRIES).filter(
  (c): c is CountryConfig => !!c && c.live,
);

export const isCountryCode = (v: string): v is CountryCode =>
  Object.prototype.hasOwnProperty.call(COUNTRIES, v);

export const getCountry = (code?: string): CountryConfig =>
  (code && isCountryCode(code) && COUNTRIES[code]
    ? (COUNTRIES[code] as CountryConfig)
    : (COUNTRIES[DEFAULT_COUNTRY] as CountryConfig));

export type { CountryCode, CountryConfig } from './types';
