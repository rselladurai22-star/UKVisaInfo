/**
 * UK domestic energy bill estimator under the Ofgem price cap.
 *
 * Ofgem publishes a default-tariff cap each quarter. Unit rates and standing
 * charges vary by region (14 regions) and payment method (Direct Debit
 * cheapest, Standard Credit higher, Prepayment in between since 2024 alignment).
 *
 * This calc uses GB-average rates for "Direct Debit, dual-fuel", adjust
 * RATES below each quarter when Ofgem publishes the new cap.
 *
 * Most recent values shown are for the cap window starting 1 April 2025
 * (announced 25 Feb 2025 by Ofgem). When the next quarter is published,
 * update CAP.electricity and CAP.gas in place; nothing else needs touching.
 *
 * Source: Ofgem, "Default tariff cap level: changes to algebra and methodology";
 * https://www.ofgem.gov.uk/energy-policy-and-regulation/policy-and-regulatory-programmes/default-tariff-cap.
 */

export interface EnergyCap {
  windowLabel: string;     // human-readable, e.g. "1 April, 30 June 2025"
  electricity: {
    unitPence: number;     // p / kWh
    standingPence: number; // p / day
  };
  gas: {
    unitPence: number;     // p / kWh
    standingPence: number; // p / day
  };
}

export const CAP: EnergyCap = {
  windowLabel: '1 April, 30 June 2025',
  electricity: { unitPence: 27.03, standingPence: 53.80 },
  gas:         { unitPence:  6.99, standingPence: 32.67 },
};

/** Ofgem's "typical domestic consumption value", published annually. */
export const TDCV = {
  electricity: 2_700,   // kWh/year, single rate
  gas:        11_500,   // kWh/year, medium gas-heated home
};

export interface EnergyInput {
  electricityKwh: number;
  gasKwh: number;
}

export interface EnergyResult {
  cap: EnergyCap;
  electricityAnnual: number; // £
  gasAnnual: number;         // £
  totalAnnual: number;
  monthlyAvg: number;
  vsTypical: number;         // £ delta vs Ofgem TDCV total
  typicalBill: number;       // £ total at TDCV
}

export function calcEnergyBill(input: EnergyInput): EnergyResult {
  const elecAnnual = bill(input.electricityKwh, CAP.electricity);
  const gasAnnual  = bill(input.gasKwh,         CAP.gas);
  const total = elecAnnual + gasAnnual;
  const typicalElec = bill(TDCV.electricity, CAP.electricity);
  const typicalGas  = bill(TDCV.gas,         CAP.gas);
  const typicalBill = typicalElec + typicalGas;
  return {
    cap: CAP,
    electricityAnnual: elecAnnual,
    gasAnnual,
    totalAnnual: total,
    monthlyAvg: total / 12,
    vsTypical: total - typicalBill,
    typicalBill,
  };
}

function bill(kwh: number, fuel: { unitPence: number; standingPence: number }): number {
  const safeKwh = Math.max(0, kwh);
  const unit = safeKwh * (fuel.unitPence / 100);
  const standing = 365 * (fuel.standingPence / 100);
  return unit + standing;
}
