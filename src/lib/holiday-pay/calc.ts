/**
 * UK statutory holiday entitlement & pay.
 *
 * Statutory rule: 5.6 weeks per year (Working Time Regulations 1998, reg. 13/13A).
 *   – A 5-day-a-week worker → 5.6 × 5 = 28 days (the legal cap).
 *   – Part-time → 5.6 × days per week (e.g. 3-day worker → 16.8 days).
 *   – Irregular hours / part-year workers (post-2024 reforms) → 12.07% of hours
 *     worked in a pay period (HMRC and gov.uk – Brazel ruling overturned for
 *     irregular workers; 12.07% method reinstated from 1 April 2024).
 *
 * Bank holidays are typically included within the 28-day cap (contract dependent).
 *
 * Source: gov.uk – "Holiday entitlement"; Working Time Regulations 1998.
 */

export type WorkerType = 'regular' | 'irregular';

export interface RegularInput {
  type: 'regular';
  daysPerWeek: number;            // 1–7
  contractWeeks?: number;         // default 5.6
  weeklyGrossPay?: number;        // optional, to value the holiday
}

export interface IrregularInput {
  type: 'irregular';
  hoursWorkedInPeriod: number;    // hours in the relevant pay period
  hourlyRate?: number;            // optional, to value the holiday
}

export type HolidayInput = RegularInput | IrregularInput;

export interface HolidayResult {
  kind: 'regular' | 'irregular';
  entitlementDays?: number;        // annual days (regular)
  entitlementHours?: number;       // accrued hours in the period (irregular)
  cappedAtStatutoryMax?: boolean;  // true if > 28 days was clipped
  payValue?: number;               // optional £
  note: string;
}

const STAT_WEEKS = 5.6;
const STAT_DAY_CAP = 28;
const IRREGULAR_PCT = 0.1207;     // 12.07%

export function calcHoliday(input: HolidayInput): HolidayResult {
  if (input.type === 'irregular') {
    const hours = Math.max(0, input.hoursWorkedInPeriod);
    const accrued = hours * IRREGULAR_PCT;
    return {
      kind: 'irregular',
      entitlementHours: accrued,
      payValue: input.hourlyRate ? accrued * input.hourlyRate : undefined,
      note:
        'Irregular-hours and part-year workers accrue holiday at 12.07% of hours worked in each pay period (gov.uk, from 1 April 2024). 12.07% is 5.6 ÷ (52 − 5.6) — the ratio of holiday weeks to working weeks.',
    };
  }

  // regular
  const dpw = Math.min(7, Math.max(0, input.daysPerWeek));
  const weeks = input.contractWeeks ?? STAT_WEEKS;
  const raw = dpw * weeks;
  const capped = raw > STAT_DAY_CAP && weeks <= STAT_WEEKS;
  const days = capped ? STAT_DAY_CAP : raw;

  return {
    kind: 'regular',
    entitlementDays: days,
    cappedAtStatutoryMax: capped,
    payValue:
      input.weeklyGrossPay !== undefined
        ? (input.weeklyGrossPay / dpw) * days
        : undefined,
    note:
      capped
        ? 'You\'d accrue more than the 28-day statutory cap, so entitlement is capped at 28 days (the legal minimum maximum). Your employer can offer more in your contract.'
        : 'Statutory entitlement is 5.6 weeks per year. Bank holidays are usually included within this — check your contract.',
  };
}
