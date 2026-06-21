/**
 * UK Clean Air Zone & ULEZ vehicle compliance.
 *
 * Compliance rule of thumb (cars and vans):
 *, Petrol: Euro 4 or newer (typically first registered from Jan 2006)
 *, Diesel: Euro 6 or newer (typically first registered from Sep 2015)
 *, Pure electric / hydrogen: always compliant
 *, Plug-in hybrid: passes if the combustion side meets the petrol/diesel rule
 *, LPG / bi-fuel: treated as petrol for the test
 *
 * Charges (non-compliant cars/vans, daily):
 *, London ULEZ (Greater London, 24/7):     £12.50 cars · £12.50 vans
 *, Birmingham CAZ class D:                  £8.00 cars · £8.00 vans
 *, Bristol CAZ class D:                     £9.00 cars · £9.00 vans
 *, Sheffield CAZ class C:                   vans £10, taxis £10 (cars exempt)
 *, Tyneside CAZ (Newcastle/Gateshead) C:    vans £12.50, taxis £12.50 (cars exempt)
 *, Bradford CAZ class C:                    vans/taxis/coaches (cars exempt)
 *, Portsmouth CAZ class B:                  vans/taxis only (cars exempt)
 *, Bath CAZ class C:                        vans £9 (cars exempt)
 *, Scottish LEZs (Glasgow, Edinburgh,
 *     Aberdeen, Dundee, all classes incl. cars): £60 / £120 / £240 / £480
 *     (penalty doubles on each subsequent same-month entry)
 *
 * Source: Transport for London ULEZ rules; gov.uk/clean-air-zones; relevant
 * council CAZ pages; Transport Scotland LEZ rules.
 */

export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'lpg';
export type VehicleClass = 'car' | 'van' | 'motorcycle';

export interface CazInput {
  fuel: FuelType;
  vehicle: VehicleClass;
  /** First registration date, YYYY format (year only is fine for the test) */
  firstRegYear: number;
  euroStandardOverride?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ZoneVerdict {
  zone: string;
  region: 'England' | 'Scotland';
  charge: number;    // daily £ (0 if exempt / compliant)
  compliant: boolean;
  note?: string;
}

export interface CazResult {
  inferredEuro: 1 | 2 | 3 | 4 | 5 | 6;
  baselineCompliant: boolean; // London ULEZ / English CAZ class D test
  scottishLezCompliant: boolean;
  zones: ZoneVerdict[];
}

const PETROL_EURO_YEAR: Record<number, 1 | 2 | 3 | 4 | 5 | 6> = {
  1993: 1, 1997: 2, 2001: 3, 2006: 4, 2011: 5, 2015: 6,
};
const DIESEL_EURO_YEAR: Record<number, 1 | 2 | 3 | 4 | 5 | 6> = {
  1993: 1, 1997: 2, 2001: 3, 2006: 4, 2011: 5, 2015: 6,
};

function inferEuro(fuel: FuelType, year: number): 1 | 2 | 3 | 4 | 5 | 6 {
  if (fuel === 'electric') return 6;
  const map = fuel === 'diesel' ? DIESEL_EURO_YEAR : PETROL_EURO_YEAR;
  let euro: 1 | 2 | 3 | 4 | 5 | 6 = 1;
  for (const [thresholdYear, e] of Object.entries(map)) {
    if (year >= parseInt(thresholdYear, 10)) euro = e;
  }
  return euro;
}

export function checkCleanAir(input: CazInput): CazResult {
  const euro = input.euroStandardOverride ?? inferEuro(input.fuel, input.firstRegYear);
  const isElectric = input.fuel === 'electric';

  // Compliance rules
  const isPetrolLike = input.fuel === 'petrol' || input.fuel === 'hybrid' || input.fuel === 'lpg';
  const isDiesel = input.fuel === 'diesel';
  const baselineCompliant =
    isElectric ||
    (isPetrolLike && euro >= 4) ||
    (isDiesel && euro >= 6);

  // Scotland uses the same test, but cars are not exempted from charges if non-compliant
  const scottishLezCompliant = baselineCompliant;

  const zones: ZoneVerdict[] = [
    zoneRow('London ULEZ',              'England',  baselineCompliant, !baselineCompliant ? 12.5 : 0, 'Greater London-wide, 24/7'),
    zoneRow('Birmingham CAZ D',         'England',  baselineCompliant, !baselineCompliant ? 8.0  : 0),
    zoneRow('Bristol CAZ D',            'England',  baselineCompliant, !baselineCompliant ? 9.0  : 0),
    zoneRow('Glasgow LEZ',              'Scotland', scottishLezCompliant, !scottishLezCompliant ? 60.0 : 0, 'PCN £60 first time, doubling each repeat'),
    zoneRow('Edinburgh LEZ',            'Scotland', scottishLezCompliant, !scottishLezCompliant ? 60.0 : 0),
    zoneRow('Aberdeen LEZ',             'Scotland', scottishLezCompliant, !scottishLezCompliant ? 60.0 : 0),
    zoneRow('Dundee LEZ',               'Scotland', scottishLezCompliant, !scottishLezCompliant ? 60.0 : 0),
  ];

  // Cars are exempt from class B/C zones (Sheffield, Tyneside, Bath, Bradford, Portsmouth)
  if (input.vehicle === 'van' || input.vehicle === 'motorcycle') {
    zones.push(zoneRow('Sheffield CAZ C',   'England', baselineCompliant, !baselineCompliant && input.vehicle === 'van' ? 10.0 : 0, 'vans/taxis only'));
    zones.push(zoneRow('Tyneside CAZ C',    'England', baselineCompliant, !baselineCompliant && input.vehicle === 'van' ? 12.5 : 0, 'Newcastle / Gateshead, vans/taxis only'));
    zones.push(zoneRow('Bath CAZ C',        'England', baselineCompliant, !baselineCompliant && input.vehicle === 'van' ? 9.0  : 0));
    zones.push(zoneRow('Bradford CAZ C',    'England', baselineCompliant, !baselineCompliant && input.vehicle === 'van' ? 9.0  : 0));
    zones.push(zoneRow('Portsmouth CAZ B',  'England', baselineCompliant, !baselineCompliant && input.vehicle === 'van' ? 10.0 : 0));
  }

  return { inferredEuro: euro, baselineCompliant, scottishLezCompliant, zones };
}

function zoneRow(zone: string, region: ZoneVerdict['region'], compliant: boolean, charge: number, note?: string): ZoneVerdict {
  return { zone, region, charge, compliant, note };
}
