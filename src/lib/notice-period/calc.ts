/**
 * UK Notice period calculator.
 *
 * Source: gov.uk/notice-period
 *         Employment Rights Act 1996 s.86
 *
 * Statutory minimum notice (employer to employee):
 *   - 1 week per year of service (min 1 week, max 12 weeks)
 *   - After ≥ 1 month employment
 *
 * Employee statutory notice to employer: 1 week (once past probation / 1 month)
 *
 * PILON (Payment In Lieu Of Notice):
 *   Employer can pay salary instead of requiring employee to work notice.
 *   Post-April 2018: PILON is always taxable (Employment Income Manual EIM13500).
 *   PILON = contractual weekly pay × notice weeks
 *
 * Garden Leave:
 *   Employee remains employed (on payroll) but does not attend work.
 *   Full pay continues; no PILON tax implications.
 */

export interface CalcInput {
  yearsOfService: number;
  weeklyGrossPay: number;
  contractualNoticeWeeks: number;  // from contract, may be longer than statutory
  paymentType: 'work_notice' | 'pilon' | 'garden_leave';
  taxBand: 'basic' | 'higher' | 'additional';
}

export interface CalcResult {
  statutoryNoticeWeeks: number;
  contractualNoticeWeeks: number;
  effectiveNoticeWeeks: number;
  grossPilon: number;            // if PILON
  taxOnPilon: number;            // IT + NI on PILON
  netPilon: number;
  lastDayIfWorking: string;      // "X weeks from today"
  taxNote: string;
}

const TAX_RATES = { basic: 0.20, higher: 0.40, additional: 0.45 };
const NI_RATES  = { basic: 0.08, higher: 0.02, additional: 0.02 };

export function calculateNoticePeriod(input: CalcInput): CalcResult {
  const years = Math.max(0, input.yearsOfService);
  const weekly = Math.max(0, input.weeklyGrossPay);
  const contractual = Math.max(0, input.contractualNoticeWeeks);

  const statutory = years < 1 ? 0 : Math.min(12, Math.floor(years));
  const effective = Math.max(statutory, contractual);

  const grossPilon = weekly * effective;
  const itRate = TAX_RATES[input.taxBand];
  const niRate = NI_RATES[input.taxBand];
  const taxOnPilon = input.paymentType === 'pilon' ? grossPilon * (itRate + niRate) : 0;
  const netPilon   = grossPilon - taxOnPilon;

  const taxNote = input.paymentType === 'pilon'
    ? 'PILON is fully taxable (Income Tax + NI) as of April 2018.'
    : input.paymentType === 'garden_leave'
    ? 'Garden leave: you remain employed and on payroll, normal PAYE applies to regular salary.'
    : 'Working notice: regular PAYE deductions apply throughout the notice period.';

  return { statutoryNoticeWeeks: statutory, contractualNoticeWeeks: contractual, effectiveNoticeWeeks: effective, grossPilon, taxOnPilon, netPilon, lastDayIfWorking: `${effective} weeks from today`, taxNote };
}
