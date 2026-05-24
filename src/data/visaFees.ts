/**
 * Per-visa numeric fees — 8 April 2026 master gov.uk fee table.
 * Mirror of the constants used in CostCalculatorAdvanced.
 *
 * Used by the V2 visa page to drive the inline CostPanel without
 * importing the full calculator component.
 */

export interface VisaFee {
  /** Annual fee bands (in GBP). */
  baseFee: { out3yr: number; out5yr?: number; in3yr?: number; in5yr?: number };
  /** Annual IHS for adults (£1,035 standard, £776 student/dependant). */
  ihsAdult: number;
  /** Annual IHS for under-18 dependants. */
  ihsChild: number;
  /** Optional priority surcharges. */
  priorityFee?: number;
  superPriorityFee?: number;
  /** Visa allows dependants on the same application. */
  allowsDependants: boolean;
  /** Default years on the visa — used for IHS multiplication. */
  defaultYears: number;
}

export const VISA_FEES: Record<string, VisaFee> = {
  'skilled-worker':    { baseFee: { out3yr: 819,  out5yr: 1618, in3yr: 885,  in5yr: 1751 }, ihsAdult: 1035, ihsChild: 776, priorityFee: 500, superPriorityFee: 1000, allowsDependants: true,  defaultYears: 3 },
  'health':            { baseFee: { out3yr: 304,  out5yr: 590,  in3yr: 304,  in5yr: 590 },  ihsAdult: 0,    ihsChild: 776, priorityFee: 500,                            allowsDependants: true,  defaultYears: 3 },
  'innovator-founder': { baseFee: { out3yr: 1357, in3yr: 1693 },                            ihsAdult: 1035, ihsChild: 776, priorityFee: 500,                            allowsDependants: true,  defaultYears: 3 },
  'talent':            { baseFee: { out3yr: 766,  out5yr: 766 },                            ihsAdult: 1035, ihsChild: 776,                                                allowsDependants: true,  defaultYears: 3 },
  'student':           { baseFee: { out3yr: 558,  out5yr: 558,  in3yr: 558,  in5yr: 558 },  ihsAdult: 776,  ihsChild: 776, priorityFee: 500,                            allowsDependants: false, defaultYears: 3 },
  'graduate':          { baseFee: { out3yr: 937,  out5yr: 937 },                            ihsAdult: 1035, ihsChild: 776, priorityFee: 500,                            allowsDependants: false, defaultYears: 2 },
  'family':            { baseFee: { out3yr: 2064, in3yr: 1407 },                            ihsAdult: 1035, ihsChild: 776, priorityFee: 573,                            allowsDependants: true,  defaultYears: 2.5 },
  'visitor':           { baseFee: { out3yr: 135,  out5yr: 135 },                            ihsAdult: 0,    ihsChild: 0,   priorityFee: 500, superPriorityFee: 1000,    allowsDependants: false, defaultYears: 0.5 },
  'ilr':               { baseFee: { out3yr: 3226, in3yr: 3226 },                            ihsAdult: 0,    ihsChild: 0,                       superPriorityFee: 1000, allowsDependants: true,  defaultYears: 1 },
  'citizenship':       { baseFee: { out3yr: 1839, in3yr: 1839 },                            ihsAdult: 0,    ihsChild: 0,                                                allowsDependants: false, defaultYears: 1 },
  'bno':               { baseFee: { out3yr: 206,  out5yr: 285,  in3yr: 206,  in5yr: 285 },  ihsAdult: 1035, ihsChild: 776,                                                allowsDependants: true,  defaultYears: 5 },
  'ancestry':          { baseFee: { out3yr: 726,  out5yr: 726 },                            ihsAdult: 1035, ihsChild: 776, priorityFee: 500,                            allowsDependants: true,  defaultYears: 5 },
  'euss':              { baseFee: { out3yr: 0,    out5yr: 0,    in3yr: 0,    in5yr: 0 },    ihsAdult: 0,    ihsChild: 0,                                                allowsDependants: true,  defaultYears: 5 },
  'long-residence':    { baseFee: { out3yr: 3226, in3yr: 3226 },                            ihsAdult: 0,    ihsChild: 0,                       superPriorityFee: 1000, allowsDependants: false, defaultYears: 1 },
};

/** Slugs that should use the V2 (cheat-sheet) layout.
 *  Full rollout — all 14 visa routes use the scenario-driven layout.
 *  Removing a slug here falls back to the legacy template. */
const V2_SLUGS = new Set<string>([
  'skilled-worker',
  'student',
  'visitor',
  'family',
  'health',
  'talent',
  'graduate',
  'innovator-founder',
  'ilr',
  'citizenship',
  'euss',
  'bno',
  'long-residence',
  'ancestry',
]);

export function hasV2Layout(slug: string): boolean {
  return V2_SLUGS.has(slug);
}
