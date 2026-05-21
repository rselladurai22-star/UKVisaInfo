/**
 * UK Skilled Worker visa 70-point eligibility checker — 2024/25.
 *
 * Source: gov.uk/skilled-worker-visa/your-job
 *         Home Office Points-Based System guidance
 *
 * Points structure (70 required):
 *   Mandatory (50 pts — all required):
 *     A: Approved sponsor                        = 20
 *     B: Job at appropriate skill level (RQF 3+) = 20
 *     C: English at B1 level or above            = 10
 *
 *   Tradeable (20 pts — various combos):
 *     D: Salary meets general threshold (£38,700) = 20
 *     E: Job in shortage occupation list         = 20 (can combine with F)
 *     F: Salary ≥ £30,960 (going rate ×90%)      = 10  (if E awarded)
 *     G: PhD relevant to job                     = 10
 *     H: PhD in STEM                             = 20
 *     I: New entrant (under 26, student switch,
 *          graduate trainee, or shortage occ.)   = 20 — salary ≥ £23,220 (60% of threshold)
 *
 * Salary thresholds (from 4 April 2024):
 *   General:           £38,700/year
 *   Going rate:        role-specific (user enters this)
 *   New entrant:       £23,220/year (or 70% of going rate, whichever is higher)
 *   Shortage occupat.: £30,960/year (going rate × 90%)
 */

export const THRESHOLD_GENERAL    = 38700;
export const THRESHOLD_SHORTAGE   = 30960;  // 80% of £38,700
export const THRESHOLD_NEW_ENTRANT = 23220;

export interface CalcInput {
  hasApprovedSponsor: boolean;
  jobAtRqf3Plus: boolean;
  englishB1Plus: boolean;
  annualSalary: number;
  jobGoingRate: number;          // HMRC/Home Office going rate for that SOC code
  inShortageOccupation: boolean;
  hasPhdRelevant: boolean;
  hasPhdStem: boolean;
  isNewEntrant: boolean;         // under 26, student switch, graduate trainee etc
}

export interface PointsBreakdown {
  code: string;
  description: string;
  points: number;
  awarded: boolean;
}

export interface CalcResult {
  totalPoints: number;
  passes: boolean;
  breakdown: PointsBreakdown[];
  missingPoints: number;
  note?: string;
}

export function calculateSkilledWorkerPoints(input: CalcInput): CalcResult {
  const breakdown: PointsBreakdown[] = [];
  let total = 0;

  function award(code: string, description: string, points: number, condition: boolean) {
    breakdown.push({ code, description, points, awarded: condition });
    if (condition) total += points;
  }

  // Mandatory
  award('A', 'Approved sponsor', 20, input.hasApprovedSponsor);
  award('B', 'Job at RQF 3+ skill level', 20, input.jobAtRqf3Plus);
  award('C', 'English language (B1+)', 10, input.englishB1Plus);

  // Tradeable — salary vs thresholds
  const newEntrantMinSalary = Math.max(THRESHOLD_NEW_ENTRANT, input.jobGoingRate * 0.70);
  const shortageMinSalary   = Math.max(THRESHOLD_SHORTAGE, input.jobGoingRate * 0.80);
  const goingRateFull       = input.jobGoingRate;

  const meetsGeneral  = input.annualSalary >= THRESHOLD_GENERAL && input.annualSalary >= goingRateFull;
  const meetsShortage = input.inShortageOccupation && input.annualSalary >= shortageMinSalary;
  const meetsNewEntrant = input.isNewEntrant && input.annualSalary >= newEntrantMinSalary;

  if (meetsGeneral) {
    award('D', `Salary ≥ £${THRESHOLD_GENERAL.toLocaleString()} (general threshold)`, 20, true);
  } else if (meetsShortage) {
    award('E', 'Job on shortage occupation list', 20, true);
  } else if (meetsNewEntrant) {
    award('I', 'New entrant route (reduced salary)', 20, true);
  } else {
    award('D', `Salary ≥ £${THRESHOLD_GENERAL.toLocaleString()} (general threshold)`, 20, false);
    if (input.inShortageOccupation) award('E', 'Shortage occupation (salary ≥ 80% going rate)', 20, false);
    if (input.isNewEntrant) award('I', 'New entrant route', 20, false);
  }

  // PhD — only if salary points already covered (can't use to compensate salary gap)
  if (input.hasPhdStem && !meetsGeneral && !meetsShortage && !meetsNewEntrant) {
    award('H', 'PhD in STEM subject', 20, false);
  } else if (input.hasPhdStem) {
    award('H', 'PhD in STEM subject', 20, true);
  } else if (input.hasPhdRelevant) {
    award('G', 'PhD relevant to job', 10, true);
  }

  return { totalPoints: total, passes: total >= 70, breakdown, missingPoints: Math.max(0, 70 - total) };
}
