/**
 * HMRC Approved Mileage Allowance Payments (AMAP) calculator, 2025/26.
 *
 * Source: gov.uk/expenses-and-benefits-business-travel-mileage
 *
 * AMAP rates (unchanged since 2011):
 *   Cars/vans:    45p first 10,000 miles, 25p above
 *   Motorcycles:  24p all miles
 *   Bicycles:     20p all miles
 *   Passenger:    5p per passenger per mile (claimed by driver)
 */

export type VehicleType = 'car' | 'motorcycle' | 'bicycle';

export const AMAP = {
  car:        { first: 0.45, additional: 0.25, threshold: 10000 },
  motorcycle: { first: 0.24, additional: 0.24, threshold: Infinity },
  bicycle:    { first: 0.20, additional: 0.20, threshold: Infinity },
} as const;

export const PASSENGER_RATE = 0.05;

export interface CalcInput {
  miles: number;
  vehicleType: VehicleType;
  passengers: number;
  employerPaidPence: number;
  taxBand: 'basic' | 'higher' | 'additional';
}

export interface CalcResult {
  amapEntitlement: number;
  passengerElement: number;
  mileageElement: number;
  employerPaid: number;
  claimableRelief: number;
  taxableSurplus: number;
  taxSavingIfClaimed: number;
  breakdown: { band: string; miles: number; rate: number; amount: number }[];
}

const TAX_RATES = { basic: 0.20, higher: 0.40, additional: 0.45 };

export function calculateMileage(input: CalcInput): CalcResult {
  const miles      = Math.max(0, input.miles);
  const passengers = Math.max(0, Math.floor(input.passengers));
  const rates      = AMAP[input.vehicleType];

  const breakdown: CalcResult['breakdown'] = [];
  if (rates.threshold < Infinity) {
    const first = Math.min(miles, rates.threshold);
    const extra = Math.max(0, miles - rates.threshold);
    if (first > 0) breakdown.push({ band: `First ${rates.threshold.toLocaleString()} miles`, miles: first, rate: rates.first, amount: first * rates.first });
    if (extra > 0) breakdown.push({ band: `Above ${rates.threshold.toLocaleString()} miles`, miles: extra, rate: rates.additional, amount: extra * rates.additional });
  } else {
    breakdown.push({ band: 'All miles', miles, rate: rates.first, amount: miles * rates.first });
  }

  const mileageElement   = breakdown.reduce((s, b) => s + b.amount, 0);
  const passengerElement = miles * PASSENGER_RATE * passengers;
  const amapEntitlement  = mileageElement + passengerElement;
  const employerPaid     = (input.employerPaidPence / 100) * miles;
  const diff             = amapEntitlement - employerPaid;

  return {
    amapEntitlement,
    passengerElement,
    mileageElement,
    employerPaid,
    claimableRelief: Math.max(0, diff),
    taxableSurplus: Math.max(0, -diff),
    taxSavingIfClaimed: Math.max(0, diff) * TAX_RATES[input.taxBand],
    breakdown,
  };
}
