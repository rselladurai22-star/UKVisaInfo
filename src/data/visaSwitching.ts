// Visa switching matrix, from current UK visa → eligible target visas.
// Used by /visa-switching page and the in-UK path on the ApplicationGuide.

export interface SwitchOption {
  toSlug: string;           // slug of target visa (must exist in VISA_DETAILS)
  toTitle: string;
  category: 'Work' | 'Study' | 'Family' | 'Settlement';
  difficulty: 'Common' | 'Conditional' | 'Rare';
  note: string;             // 1-line summary of the switch
}

export interface FromVisa {
  id: string;
  label: string;
  blurb: string;            // shown under label in selector
  switches: SwitchOption[];
  cannotSwitchInto?: string[]; // names of routes that are NOT possible from this visa
}

export const FROM_VISAS: FromVisa[] = [
  {
    id: 'student',
    label: 'Student visa',
    blurb: 'Currently studying at a UK licensed sponsor',
    switches: [
      { toSlug: 'graduate',       toTitle: 'Graduate visa',        category: 'Work',       difficulty: 'Common',      note: 'Once you complete your degree, switch to a 2-year (3-year PhD) unsponsored work visa. No employer needed.' },
      { toSlug: 'skilled-worker', toTitle: 'Skilled Worker visa',  category: 'Work',       difficulty: 'Common',      note: 'Available once you have a job offer from a licensed sponsor at RQF Level 6+ and meet salary thresholds.' },
      { toSlug: 'health',         toTitle: 'Health & Care Worker', category: 'Work',       difficulty: 'Common',      note: 'For eligible NHS roles. IHS waived. Care worker recruitment closed to overseas since Jul 2025, domestic only.' },
      { toSlug: 'family',         toTitle: 'Family / Partner visa',category: 'Family',     difficulty: 'Conditional', note: 'You can switch if you have a qualifying partner in the UK. Must meet £29,000 income threshold.' },
      { toSlug: 'student',        toTitle: 'New Student visa',     category: 'Study',      difficulty: 'Common',      note: 'Change course or institution, need a new CAS from the new sponsor.' },
    ],
    cannotSwitchInto: ['Visitor visa (not a switch, visit is short-term only)'],
  },
  {
    id: 'graduate',
    label: 'Graduate visa',
    blurb: 'Holding the 2-year (or 3-year PhD) post-study work visa',
    switches: [
      { toSlug: 'skilled-worker', toTitle: 'Skilled Worker visa',  category: 'Work',       difficulty: 'Common',      note: 'Most Graduate visa holders switch here once they secure sponsored employment.' },
      { toSlug: 'health',         toTitle: 'Health & Care Worker', category: 'Work',       difficulty: 'Common',      note: 'For NHS or eligible health/care roles. IHS waived.' },
      { toSlug: 'family',         toTitle: 'Family / Partner visa',category: 'Family',     difficulty: 'Conditional', note: 'If you have a qualifying UK partner and meet the financial requirement.' },
      { toSlug: 'student',        toTitle: 'Student visa',         category: 'Study',      difficulty: 'Common',      note: 'To pursue further study, need a new CAS.' },
    ],
    cannotSwitchInto: ['Graduate visa cannot be extended, single grant only'],
  },
  {
    id: 'skilled-worker',
    label: 'Skilled Worker visa',
    blurb: 'Holding a sponsored Skilled Worker visa',
    switches: [
      { toSlug: 'skilled-worker', toTitle: 'New Skilled Worker (employer change)', category: 'Work', difficulty: 'Common', note: 'Changing employer requires a new CoS from the new sponsor, apply before changing jobs.' },
      { toSlug: 'health',         toTitle: 'Health & Care Worker', category: 'Work',       difficulty: 'Common',      note: 'Move to an eligible NHS/health role. IHS waived. Reduced fees.' },
      { toSlug: 'family',         toTitle: 'Family / Partner visa',category: 'Family',     difficulty: 'Conditional', note: 'If you have a qualifying UK partner and meet income or savings.' },
      { toSlug: 'settlement-skilled-worker', toTitle: 'ILR (Skilled Worker)', category: 'Settlement', difficulty: 'Common', note: 'After 5 years of continuous sponsored residence, plus Life in the UK + English B1.' },
    ],
  },
  {
    id: 'health',
    label: 'Health and Care Worker visa',
    blurb: 'Working in eligible NHS / health role',
    switches: [
      { toSlug: 'skilled-worker', toTitle: 'Skilled Worker visa',  category: 'Work',       difficulty: 'Common',      note: 'For non-health roles; standard fees and IHS apply.' },
      { toSlug: 'family',         toTitle: 'Family / Partner visa',category: 'Family',     difficulty: 'Conditional', note: 'If you have a qualifying UK partner and meet finances.' },
      { toSlug: 'settlement-skilled-worker', toTitle: 'ILR (long residence)', category: 'Settlement', difficulty: 'Common', note: '5 years continuous lawful residence on Health & Care + meet criteria for settlement.' },
    ],
  },
  {
    id: 'family',
    label: 'Family / Partner visa',
    blurb: 'Joining or remaining with a UK partner / family member',
    switches: [
      { toSlug: 'family',         toTitle: 'Family visa extension', category: 'Family',    difficulty: 'Common',      note: 'Routine 2.5-year extension if you continue to meet the requirements.' },
      { toSlug: 'skilled-worker', toTitle: 'Skilled Worker visa',   category: 'Work',      difficulty: 'Conditional', note: 'If you secure a sponsored qualifying job offer at RQF Level 6+.' },
      { toSlug: 'settlement-family', toTitle: 'ILR (Family route)', category: 'Settlement', difficulty: 'Common',     note: 'After 5 years on the partner route (10 years if on the longer-residence route).' },
    ],
  },
  {
    id: 'youth-mobility',
    label: 'Youth Mobility Scheme',
    blurb: 'Up to 2-3 years in the UK for eligible nationalities aged 18-35',
    switches: [
      { toSlug: 'skilled-worker', toTitle: 'Skilled Worker visa',  category: 'Work',       difficulty: 'Common',      note: 'Switch with a qualifying sponsored job offer.' },
      { toSlug: 'health',         toTitle: 'Health & Care Worker', category: 'Work',       difficulty: 'Common',      note: 'If you secure a qualifying NHS/health role with a licensed sponsor.' },
      { toSlug: 'family',         toTitle: 'Family / Partner visa',category: 'Family',     difficulty: 'Conditional', note: 'If you have a qualifying UK partner, meet income/savings and English requirements.' },
      { toSlug: 'student',        toTitle: 'Student visa',         category: 'Study',      difficulty: 'Common',      note: 'For further study, need a CAS from a licensed sponsor.' },
    ],
    cannotSwitchInto: ['YMS cannot be extended, single grant only'],
  },
  {
    id: 'visitor',
    label: 'Visitor visa',
    blurb: 'Standard visitor visa (Standard, Marriage, Permitted-Paid)',
    switches: [],
    cannotSwitchInto: [
      'Skilled Worker, must apply from outside UK',
      'Student visa, must apply from outside UK',
      'Family / Partner visa, must apply from outside UK',
      'Health & Care, must apply from outside UK',
      'Graduate visa, only available to current/recent Student visa holders',
    ],
  },
  {
    id: 'other-work',
    label: 'Other long-term work visa',
    blurb: 'Global Talent, High Potential Individual, Scale-up, etc.',
    switches: [
      { toSlug: 'skilled-worker', toTitle: 'Skilled Worker visa',  category: 'Work',       difficulty: 'Common',      note: 'For sponsored employment in any eligible role.' },
      { toSlug: 'health',         toTitle: 'Health & Care Worker', category: 'Work',       difficulty: 'Common',      note: 'For NHS / health roles. IHS waived.' },
      { toSlug: 'family',         toTitle: 'Family / Partner visa',category: 'Family',     difficulty: 'Conditional', note: 'With qualifying UK partner and finances.' },
    ],
  },
];
