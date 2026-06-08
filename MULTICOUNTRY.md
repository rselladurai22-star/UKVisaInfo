# Multi-country architecture — plan & status

Goal: extend the UK calculators+guides hub to other countries (US, CA, …) on
**one brandable domain** with country subfolders (`/uk`, `/us`), shared engine,
per-country config. Subfolders (not separate domains) so authority compounds,
one AdSense approval covers all, one codebase.

## Decision record
- **One domain + `[country]` segment.** Not separate ccTLDs. Google shares
  authority across subdirectories; lean ops shouldn't rebuild authority/AdSense
  per country.
- **Country-neutral brand** required (drop "UK…" names). Domain locked separately;
  it's a single constant (`SITE_ORIGIN`, `BRAND` in `src/config/countries/index.ts`).
- **hreflang** per locale to stop near-duplicate tax pages competing.

## Rails already laid (non-breaking — UK unaffected)
- `src/config/countries/types.ts` — `CountryConfig` shape.
- `src/config/countries/uk.ts` — UK config (locale en-GB, GBP, enabled calculators).
- `src/config/countries/index.ts` — `COUNTRIES`, `DEFAULT_COUNTRY`, `getCountry()`,
  `LIVE_COUNTRIES`, `BRAND`, `SITE_ORIGIN`.
- `src/lib/money.ts` — `money()`/`percent()`/`formattersFor()` (locale+currency aware).

These are unused until the migration below; nothing in the live site changed.

## Remaining migration (big, do as its own pass)
1. **Routing**: introduce `src/app/[country]/…`. Move (or alias) current routes
   under it. `generateStaticParams` over `LIVE_COUNTRIES`. Root `/` → redirect to
   `/uk` (or geo-detected).
2. **Domain rename** (one pass): `SITE_URL`/`metadataBase`/OG URLs/sitemap/robots/
   ads.txt/schema → new domain. 301 `ukvisainfo.co.uk/*` → `<brand>/uk/*`.
3. **Currency**: replace hardcoded `gbp()` (89 files) with `money()` bound to the
   active country. Do per-category, verify tsc each step.
4. **hreflang + canonical**: emit alternates per equivalent route across countries
   in `[country]/layout.tsx`; `x-default` → UK.
5. **Sitemap**: loop `LIVE_COUNTRIES × routes`.
6. **Consent/AdSense**: unchanged (one domain). Make Consent Mode defaults
   region-aware (EEA/UK denied, else granted) — Consent Mode v2 supports this.
7. **Per-country data**: the real work for each new country is accurate tax/benefit
   rates in a `lib/<country>/…` + a `config/countries/<code>.ts`. Engine/UI reuse.

## Adding a country (after migration)
1. Write `src/config/countries/<code>.ts` (locale, currency, taxYear, enabled
   calculators) + register in `index.ts`.
2. Add its rate tables under `src/lib/`.
3. Done — routing, sitemap, hreflang, ads, UI all pick it up.
