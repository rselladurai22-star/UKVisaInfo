/**
 * Council Tax band calculator.
 *
 * Approach: take a Band D figure (national / regional fallback or
 * council-specific where we have it), apply the statutory band ratios
 * (England + Scotland use 9-band ratios A-H; Wales uses A-I).
 *
 * Band D figures sourced from gov.uk Council Tax statistics 2025-26
 * (average England Band D bill: £2,280).
 *
 * Users can override the Band D figure to match their actual bill.
 */

export type CouncilTaxBand = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

/** Statutory band ratios relative to Band D (= 9/9). */
const BAND_RATIOS: Record<CouncilTaxBand, number> = {
  A: 6 / 9,   // 0.6667
  B: 7 / 9,   // 0.7778
  C: 8 / 9,   // 0.8889
  D: 9 / 9,   // 1.0000
  E: 11 / 9,  // 1.2222
  F: 13 / 9,  // 1.4444
  G: 15 / 9,  // 1.6667
  H: 18 / 9,  // 2.0000
};

/** Average Band D bills 2025-26 by region (£). Updated annually from
 *  gov.uk Council Tax statistical release. */
const REGIONAL_BAND_D: Record<string, number> = {
  'London':                   2065,
  'South East':               2370,
  'South West':               2310,
  'East of England':          2340,
  'East Midlands':            2295,
  'West Midlands':            2280,
  'Yorkshire and The Humber': 2330,
  'North West':               2290,
  'North East':               2400,
  'Scotland':                 1490,  // Scotland's bands and base are lower
  'Wales':                    2105,
  'Northern Ireland':         0,     // NI uses domestic rates not council tax
};

/** Fallback England average Band D for 2025-26 */
const DEFAULT_BAND_D = 2280;

export interface BandRow {
  band: CouncilTaxBand;
  ratio: number;
  annual: number;
  monthly: number;
  weekly: number;
}

export interface CouncilTaxResult {
  bandD: number;
  region: string;
  rows: BandRow[];
  isNorthernIreland: boolean;
}

export function bandDForRegion(region: string | null | undefined): number {
  if (!region) return DEFAULT_BAND_D;
  return REGIONAL_BAND_D[region] ?? DEFAULT_BAND_D;
}

export function calculateBands(bandD: number, region: string | null | undefined): CouncilTaxResult {
  const isNI = region === 'Northern Ireland';
  const rows: BandRow[] = (Object.keys(BAND_RATIOS) as CouncilTaxBand[]).map((band) => {
    const ratio = BAND_RATIOS[band];
    const annual = bandD * ratio;
    return {
      band,
      ratio,
      annual,
      monthly: annual / 12,
      weekly: annual / 52,
    };
  });
  return {
    bandD,
    region: region ?? 'England',
    rows,
    isNorthernIreland: isNI,
  };
}
