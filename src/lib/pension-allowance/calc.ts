/**
 * UK Pension Annual Allowance, 2026/27.
 *
 *, Standard AA:                 £60,000
 *, Money Purchase AA (MPAA):    £10,000  (if you've flexibly accessed DC pot)
 *, Tapered AA (high earners):
 *       Applies only if BOTH:
 *         • Threshold income > £200,000
 *         • Adjusted income  > £260,000
 *       Reduce AA by £1 for every £2 of adjusted income over £260,000,
 *       to a minimum of £10,000 (so fully tapered at adjusted £360,000).
 *
 *, Carry-forward: up to 3 prior years of unused AA can be used,
 *     in order from oldest to newest.
 *
 * Sources: HMRC PTM055000, gov.uk, "Tax on your private pension contributions".
 */

const STD_AA = 60_000;
const MPAA = 10_000;
const TAPER_AI_THRESHOLD = 260_000;
const TAPER_TI_THRESHOLD = 200_000;
const TAPER_FLOOR = 10_000;

export interface PaaInput {
  adjustedIncome: number;        // for taper test (income + employer pension contribs + salary sacrifice in)
  thresholdIncome: number;       // for taper gate
  mpaaTriggered: boolean;        // has the person flexibly accessed a DC pot?
  carryForward?: number;         // optional unused AA from prior 3 tax years
  plannedContribution?: number;  // optional, how much will you contribute this year?
}

export interface PaaResult {
  standardAa: number;
  mpaaApplies: boolean;
  taperApplies: boolean;
  thisYearAa: number;            // what you can put in this year (excluding carry-forward)
  carryForward: number;
  totalAvailable: number;        // thisYearAa + carryForward (carry-forward not available with MPAA)
  contribution: number;
  overage: number;               // 0 if within allowance
  note: string;
}

export function calcPensionAllowance(input: PaaInput): PaaResult {
  const ai = Math.max(0, input.adjustedIncome);
  const ti = Math.max(0, input.thresholdIncome);
  const carry = Math.max(0, input.carryForward ?? 0);
  const contribution = Math.max(0, input.plannedContribution ?? 0);

  let thisYearAa = STD_AA;
  const taperApplies = ti > TAPER_TI_THRESHOLD && ai > TAPER_AI_THRESHOLD;
  if (taperApplies) {
    const overTaper = ai - TAPER_AI_THRESHOLD;
    const reduction = Math.floor(overTaper / 2);
    thisYearAa = Math.max(TAPER_FLOOR, STD_AA - reduction);
  }

  const mpaaApplies = input.mpaaTriggered;
  if (mpaaApplies) {
    // MPAA caps DC contributions at £10k for the year and BLOCKS carry-forward on the MPAA.
    // (Defined-benefit accrual can still use a residual AA, out of scope for v1.)
    thisYearAa = Math.min(thisYearAa, MPAA);
  }

  const totalAvailable = mpaaApplies ? thisYearAa : thisYearAa + carry;
  const overage = Math.max(0, contribution - totalAvailable);

  let note = '';
  if (mpaaApplies) {
    note = 'MPAA is active because you\'ve flexibly accessed a DC pension pot. Your money-purchase contributions are capped at £10,000 for the year and you cannot use carry-forward against this cap.';
  } else if (taperApplies) {
    note = `Tapered: your adjusted income of £${ai.toLocaleString()} reduced your annual allowance by £${(STD_AA - thisYearAa).toLocaleString()}. The taper floor is £10,000 (reached at adjusted income £360,000).`;
  } else if (ti > TAPER_TI_THRESHOLD && ai <= TAPER_AI_THRESHOLD) {
    note = 'Your threshold income is above £200,000 but adjusted income is under £260,000, so the taper does not apply this year.';
  } else {
    note = 'Standard £60,000 annual allowance applies. Up to 3 prior years\' unused allowance can be carried forward.';
  }

  return {
    standardAa: STD_AA,
    mpaaApplies,
    taperApplies,
    thisYearAa,
    carryForward: mpaaApplies ? 0 : carry,
    totalAvailable,
    contribution,
    overage,
    note,
  };
}
