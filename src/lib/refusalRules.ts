/**
 * Rule-based UK visa refusal analyzer.
 *
 * Each rule recognises a known refusal pattern (paragraph numbers,
 * keywords) and outputs a category, severity, plain-English summary
 * and a recommended next step. Patterns are sourced from Home Office
 * decision-letter templates and common refusal-letter language.
 */

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface RefusalRule {
  id: string;
  /** Regex(es), match any one to fire. Case-insensitive. */
  patterns: RegExp[];
  category: string;
  severity: Severity;
  title: string;
  what: string;
  why: string;
  next: string;
}

const RULES: RefusalRule[] = [
  /* ────────── General grounds (paragraph 320 / 9 of the rules) ────────── */
  {
    id: 'paragraph-320-7A',
    patterns: [
      /paragraph\s*320\s*\(?7a\)?/i,
      /paragraph\s*9\.7\.1/i,
      /false\s+representation/i,
      /false\s+document/i,
      /deception/i,
    ],
    category: 'Deception / false document',
    severity: 'critical',
    title: 'Refusal on grounds of false representation or deception',
    what: 'The Home Office believes documents in your application were false, that you misrepresented a material fact, or that information was withheld.',
    why: 'This is one of the most serious refusal categories. It triggers a 10-year ban on most UK visa categories under the general grounds in Part 9 of the Immigration Rules.',
    next: 'Do not reapply immediately. Get advice from a UK OISC-regulated immigration solicitor, false representation findings carry long-term consequences and need to be challenged through reconsideration, administrative review, or judicial review depending on the route.',
  },
  {
    id: 'previous-immigration-breach',
    patterns: [
      /paragraph\s*320\s*\(?(11|18a)\)?/i,
      /overstayed?/i,
      /breach\s+of\s+immigration/i,
      /immigration\s+rules.{0,30}contraven/i,
    ],
    category: 'Previous immigration breach',
    severity: 'high',
    title: 'Previous overstay or immigration-rules breach',
    what: 'A previous overstay, illegal entry, or breach of conditions on a prior visa is being held against this application.',
    why: 'Most overstays trigger re-entry bans of 1, 5, or 10 years depending on how you left the UK and how long you overstayed. Voluntary departure at your own expense reduces the ban; removal extends it.',
    next: 'Time-bar may apply: confirm the date of your departure and the ban period. After the ban ends, applications generally succeed if otherwise eligible. Solicitor advice strongly recommended.',
  },
  {
    id: 'general-criminality',
    patterns: [
      /paragraph\s*320\s*\(?(2|18b)\)?/i,
      /criminal\s+conviction/i,
      /custodial\s+sentence/i,
      /imprisonment/i,
    ],
    category: 'Criminal record',
    severity: 'high',
    title: 'Refusal based on criminal record',
    what: 'A criminal conviction in the UK or abroad is being treated as a disqualifying factor.',
    why: 'Convictions of 12 months or more usually trigger a mandatory refusal under Part 9. Shorter sentences are discretionary but often refused if recent.',
    next: 'Obtain certified records of the conviction and proof of rehabilitation. Some routes have stricter rules than others, solicitor advice essential.',
  },

  /* ────────── Skilled Worker route refusals ────────── */
  {
    id: 'sw-salary',
    patterns: [
      /salary.{0,40}(threshold|below|requirement|minimum)/i,
      /going\s+rate/i,
      /38,?700/,
      /paragraph\s*sw\s*\d/i,
    ],
    category: 'Skilled Worker, salary',
    severity: 'high',
    title: 'Salary does not meet the Skilled Worker threshold',
    what: 'Your offered salary failed at least one of the three salary tests (general minimum, going rate, or £15.88/hour).',
    why: 'Salary stage is the most common Skilled Worker refusal. Only basic gross salary counts, bonuses, commission, overtime and in-kind benefits are excluded.',
    next: 'Ask your sponsor to issue a fresh CoS with a higher basic salary. If your role is on the Immigration Salary List or you qualify as a new entrant, use the lower threshold and re-apply.',
  },
  {
    id: 'sw-cos',
    patterns: [
      /certificate\s+of\s+sponsorship/i,
      /\bcos\b/i,
      /sponsor(?:ed)?\s+(?:job|role|employment)/i,
      /sponsor\s+licence/i,
    ],
    category: 'Skilled Worker, sponsorship',
    severity: 'high',
    title: 'Sponsorship issue with the Certificate of Sponsorship',
    what: 'The CoS was withdrawn, expired before you applied, contained mismatched details, or the sponsor\'s licence was revoked.',
    why: 'CoS issues are second only to salary in Skilled Worker refusals. The CoS must be valid at the time of application and exactly match your job details.',
    next: 'Check the sponsor licence is still on the Home Office register. Request a new CoS if needed. If the licence was revoked you must find a new sponsor.',
  },

  /* ────────── Student route ────────── */
  {
    id: 'student-cas',
    patterns: [
      /confirmation\s+of\s+acceptance\s+for\s+studies/i,
      /\bcas\b/i,
    ],
    category: 'Student, CAS issue',
    severity: 'high',
    title: 'Problem with the Confirmation of Acceptance for Studies',
    what: 'The CAS reference was invalid, expired, or did not match the application details (course, fees, dates).',
    why: 'The CAS must be issued by a Home Office-licensed Student sponsor and matched exactly in the application form.',
    next: 'Ask your institution to issue a corrected CAS. Reapply with the new reference and all matching documents.',
  },
  {
    id: 'genuine-student',
    patterns: [
      /genuine\s+student/i,
      /credibility\s+interview/i,
      /not\s+satisfied.{0,20}study/i,
    ],
    category: 'Student, credibility',
    severity: 'high',
    title: 'Genuine student requirement not met',
    what: 'The Home Office is not satisfied that you intend to study in the UK as stated.',
    why: 'Caseworkers can refuse if your previous study history, course choice, English level or interview answers don\'t add up to a credible study plan.',
    next: 'Strengthen your application with a written study plan, sponsor letter explaining the course progression, and stronger English evidence. Solicitor advice recommended if interviewed.',
  },

  /* ────────── Financial requirement ────────── */
  {
    id: 'financial-requirement',
    patterns: [
      /financial\s+requirement/i,
      /maintenance\s+funds/i,
      /£?\d{1,3},?\d{3}.{0,20}(28\s*days|consecutive)/i,
      /paragraph\s+(fin|app\s*fm-se)/i,
    ],
    category: 'Financial requirement',
    severity: 'high',
    title: 'Financial / maintenance funds requirement not met',
    what: 'Your bank evidence did not show the required amount held for 28 consecutive days, or the source/format did not meet Appendix Finance.',
    why: 'Maintenance rules are strictly applied. Any dip below the required balance in the 28-day window, even by £1, triggers refusal. Some bank-statement formats are not accepted.',
    next: 'Hold the required balance for a fresh 28 days and reapply. Use a statement showing every day\'s closing balance, on the bank\'s letterhead, stamped if printed.',
  },

  /* ────────── Family route ────────── */
  {
    id: 'family-minimum-income',
    patterns: [
      /minimum\s+income/i,
      /£?29,?000/,
      /e-?ltrp\.[0-9]+/i,
      /partner\s+route/i,
    ],
    category: 'Family, income',
    severity: 'high',
    title: 'Family visa minimum income requirement not met',
    what: 'Your sponsor\'s evidence of £29,000 per year (or savings combination) did not meet Appendix FM-SE.',
    why: 'Family route income rules are technical, 6 months of payslips, P60s, employer letter and bank statements must all line up. Self-employed and dividend income face stricter rules.',
    next: 'Re-gather a clean 6-month evidence set. If income is borderline, use the cash savings route (£88,500 in savings replaces the income test).',
  },
  {
    id: 'family-relationship',
    patterns: [
      /genuine.{0,15}subsisting/i,
      /relationship.{0,30}not\s+(satisfied|genuine|met)/i,
    ],
    category: 'Family, relationship',
    severity: 'high',
    title: 'Genuine and subsisting relationship not accepted',
    what: 'The Home Office is not satisfied that your relationship is genuine, ongoing and intended to be permanent.',
    why: 'Common triggers: short relationship, limited evidence of cohabitation or communication, gaps in joint financial commitments, language barriers in the interview.',
    next: 'Build a richer evidence file: dated photos across multiple years, joint tenancy or bills, written communications, family witness letters, travel together. Re-apply or appeal depending on route.',
  },

  /* ────────── English language ────────── */
  {
    id: 'english',
    patterns: [
      /english\s+language\s+requirement/i,
      /\b(b1|b2|c1|c2)\s+(level|cefr)/i,
      /ielts/i,
      /selt/i,
    ],
    category: 'English language',
    severity: 'medium',
    title: 'English language requirement not satisfied',
    what: 'The English certificate provided was not from an approved SELT provider, was below the required CEFR level, or was outside its 2-year validity.',
    why: 'Most UK visas need B1 (Family), B2 (Skilled Worker), or higher. Only specific SELTs (e.g. IELTS for UKVI, PTE Academic UKVI) are accepted.',
    next: 'Book an approved SELT at the correct CEFR level. Check expiry dates carefully, the test must be valid at the date of application.',
  },

  /* ────────── TB / medical ────────── */
  {
    id: 'tb-test',
    patterns: [
      /tuberculosis/i,
      /tb\s+(test|certificate)/i,
    ],
    category: 'TB test',
    severity: 'medium',
    title: 'TB test certificate missing or invalid',
    what: 'TB screening evidence was missing, expired (over 6 months old) or from a non-approved clinic.',
    why: 'Applicants from listed countries staying 6+ months need a valid certificate from an IOM-approved clinic.',
    next: 'Book at an IOM-approved clinic, attach the new certificate, and reapply. The fee is usually £65 to 95.',
  },

  /* ────────── Visitor / standard visitor ────────── */
  {
    id: 'visitor-credibility',
    patterns: [
      /paragraph\s*v\s*4/i,
      /genuine\s+visitor/i,
      /(intention|reasons?)\s+to\s+(leave|return)/i,
      /(family|economic|social)\s+ties/i,
    ],
    category: 'Visitor, credibility',
    severity: 'high',
    title: 'Visitor visa, not a genuine visitor / unlikely to leave',
    what: 'The Home Office is not satisfied that you will leave the UK at the end of your visit, or that you have strong enough ties to your home country.',
    why: 'Visitor refusals often cite: weak employment evidence, large unexplained deposits, family in the UK, previous overstay or refusals, and unclear travel plans.',
    next: 'Strengthen ties: employment letter, property ownership, business evidence, dependants in home country. Show clear, funded travel itinerary. Address any prior refusals head-on.',
  },

  /* ────────── Administrative review ────────── */
  {
    id: 'no-right-of-appeal',
    patterns: [
      /no\s+right\s+of\s+appeal/i,
      /administrative\s+review/i,
    ],
    category: 'Procedural, review option',
    severity: 'medium',
    title: 'Administrative review available (not a refusal reason)',
    what: 'The letter mentions you have the right to ask for the decision to be reviewed by another caseworker, usually within 14 or 28 days.',
    why: 'Administrative review is appropriate when there\'s a clear casework error, e.g. a document you supplied was overlooked or a fact was misread.',
    next: 'If your refusal was due to a caseworker error rather than a substantive issue, file admin review with focused, evidenced points. If the issue is substantive (e.g. salary actually below threshold), reapply correctly instead.',
  },
];

export interface AnalysisFinding extends RefusalRule {
  matchedText: string;
}

export function analyzeRefusal(text: string): AnalysisFinding[] {
  if (!text || text.length < 20) return [];
  const findings: AnalysisFinding[] = [];
  const seen = new Set<string>();
  for (const rule of RULES) {
    for (const p of rule.patterns) {
      const m = text.match(p);
      if (m && !seen.has(rule.id)) {
        seen.add(rule.id);
        findings.push({ ...rule, matchedText: m[0] });
        break;
      }
    }
  }
  // Sort by severity (critical → low)
  const sev = { critical: 0, high: 1, medium: 2, low: 3 };
  return findings.sort((a, b) => sev[a.severity] - sev[b.severity]);
}
