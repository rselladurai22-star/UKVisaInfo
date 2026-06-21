/**
 * UK postcode super-lookup, aggregates data from free official APIs.
 *
 * Primary source: postcodes.io (open-source, no auth, unlimited).
 * MP source: members-api.parliament.uk (no auth).
 *
 * All data is cached for 24 hours via Next.js fetch revalidation, 
 * postcodes don't change often and electoral boundaries even less.
 */

export interface PostcodeData {
  /** Canonical formatted postcode (e.g. "SW1A 1AA") */
  postcode: string;
  /** Outward + inward halves */
  outcode: string;
  incode: string;

  /** Admin district (e.g. "Westminster"), usually the council */
  council: string;
  /** Electoral ward */
  ward: string;
  /** Parish (England only) */
  parish?: string;

  /** Westminster constituency */
  constituency: string;
  /** Current MP name + party (if available) */
  mp?: string;
  mpParty?: string;
  /** Currently serving since */
  mpSince?: string;

  /** Region (e.g. "London", "South East") */
  region: string;
  /** Country (England / Scotland / Wales / Northern Ireland) */
  country: string;

  /** NHS region / former PCT */
  nhsRegion: string;
  /** Integrated Care Board (England) */
  icb?: string;

  /** Police force (e.g. "Metropolitan Police") */
  policeForce: string;

  /** Geo */
  latitude: number;
  longitude: number;

  /** Lower-layer / Middle-layer SOA, used for ONS data lookups */
  lsoa: string;
  msoa: string;
}

/** Loose UK postcode regex, accepts with or without space, any case. */
const POSTCODE_RE = /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s*[0-9][ABD-HJLNP-UW-Z]{2}$/i;

/** Normalise input to canonical (no spaces, uppercase). */
export function normalisePostcode(raw: string): string {
  return raw.replace(/\s+/g, '').toUpperCase();
}

/** Format canonical to display form (outcode + space + incode). */
export function formatPostcode(raw: string): string {
  const norm = normalisePostcode(raw);
  if (norm.length < 5) return norm;
  return `${norm.slice(0, -3)} ${norm.slice(-3)}`;
}

export function isValidPostcode(raw: string): boolean {
  return POSTCODE_RE.test(raw.trim());
}

interface PostcodesIoResult {
  postcode: string;
  outcode: string;
  incode: string;
  admin_district: string;
  admin_ward: string;
  parish?: string;
  parliamentary_constituency: string;
  region: string | null;
  european_electoral_region?: string;
  country: string;
  nhs_ha: string;
  ccg?: string;
  pfa: string;
  longitude: number;
  latitude: number;
  lsoa: string;
  msoa: string;
}

export async function lookupPostcode(raw: string): Promise<PostcodeData | null> {
  const code = normalisePostcode(raw);
  if (!isValidPostcode(code)) return null;

  let result: PostcodesIoResult | null = null;
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(code)}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 200) return null;
    result = data.result as PostcodesIoResult;
  } catch {
    return null;
  }

  if (!result) return null;

  // Best-effort MP lookup, failure is non-fatal.
  let mp: string | undefined;
  let mpParty: string | undefined;
  let mpSince: string | undefined;
  try {
    const search = encodeURIComponent(result.parliamentary_constituency);
    const mpRes = await fetch(
      `https://members-api.parliament.uk/api/Location/Constituency/Search?searchText=${search}&skip=0&take=1`,
      { next: { revalidate: 604800 } } // weekly
    );
    if (mpRes.ok) {
      const mpData = await mpRes.json();
      const member = mpData?.items?.[0]?.value?.currentRepresentation?.member?.value;
      if (member) {
        mp = member.nameDisplayAs;
        mpParty = member.latestParty?.name;
        mpSince = member.latestHouseMembership?.membershipStartDate?.slice(0, 10);
      }
    }
  } catch {
    /* ignore */
  }

  return {
    postcode: result.postcode,
    outcode: result.outcode,
    incode: result.incode,
    council: result.admin_district,
    ward: result.admin_ward,
    parish: result.parish ?? undefined,
    constituency: result.parliamentary_constituency,
    mp, mpParty, mpSince,
    region: result.region ?? result.european_electoral_region ?? result.country,
    country: result.country,
    nhsRegion: result.nhs_ha,
    icb: result.ccg,
    policeForce: result.pfa,
    latitude: result.latitude,
    longitude: result.longitude,
    lsoa: result.lsoa,
    msoa: result.msoa,
  };
}
