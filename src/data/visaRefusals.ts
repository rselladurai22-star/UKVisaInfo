/**
 * Top-5 refusal reasons per visa route, curated from Home Office decision-letter
 * patterns and gov.uk guidance. Each item cites the gov.uk rule it derives from.
 *
 * Pattern: every visa lists the 5 grounds that account for the bulk of
 * refusals on that route, with a one-line cause and a one-line fix.
 *
 * Verified: 2026-05-19 against the cited gov.uk pages.
 */

export interface RefusalReason {
  /** Stable id for analytics / linking. */
  id: string;
  /** Single short title (≤ 70 chars). */
  title: string;
  /** One-line cause, what the Home Office found. */
  cause: string;
  /** One-line fix, what to do before applying. */
  fix: string;
  /** gov.uk URL the rule is taken from. */
  source: string;
  /** Source page label (for the chip). */
  sourceLabel: string;
}

export const VISA_REFUSALS: Record<string, RefusalReason[]> = {
  'skilled-worker': [
    {
      id: 'salary-threshold',
      title: 'Salary below the £41,700 floor or going rate',
      cause: 'Annual gross salary lower than £41,700 OR below the going rate for the SOC code on the CoS.',
      fix: 'Re-check the going rate on Appendix Skilled Occupations and ask the sponsor to raise the CoS salary before assigning it.',
      source: 'https://www.gov.uk/skilled-worker-visa/your-job',
      sourceLabel: 'gov.uk/skilled-worker-visa/your-job',
    },
    {
      id: 'cos-issue',
      title: 'Certificate of Sponsorship invalid or expired',
      cause: 'CoS used more than 3 months after assignment, sponsor licence revoked, or SOC code on CoS not eligible at RQF Level 6.',
      fix: 'Apply within 3 months of CoS assignment. Cross-check sponsor on the licensed sponsor register the day you apply.',
      source: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers',
      sourceLabel: 'gov.uk register-of-licensed-sponsors-workers',
    },
    {
      id: 'genuine-vacancy',
      title: 'Genuine vacancy test failed',
      cause: 'Caseworker not satisfied the job is genuine, role inflated to clear salary threshold, or duties do not match the SOC code.',
      fix: 'Make sure the CoS job description matches the SOC code duties verbatim and your CV evidences the skill level required.',
      source: 'https://www.gov.uk/government/publications/workers-and-temporary-workers-guidance-for-sponsors-part-2-sponsor-a-worker',
      sourceLabel: 'gov.uk sponsor a worker (Part 2)',
    },
    {
      id: 'english-b2',
      title: 'English language not evidenced at B2 CEFR',
      cause: 'No approved SELT at B2, certificate expired (>2 yrs old), or claimed exemption (degree-in-English) not Ecctis-confirmed.',
      fix: 'Book an approved SELT (IELTS UKVI / PTE Academic UKVI / Trinity SELT) or get an Ecctis statement of equivalence before applying.',
      source: 'https://www.gov.uk/english-language',
      sourceLabel: 'gov.uk/english-language',
    },
    {
      id: 'maintenance',
      title: 'Maintenance funds (£1,270) not held for 28 days',
      cause: 'Bank balance dipped below £1,270 during the 28-day window, OR sponsor did not tick the maintenance certification on the CoS.',
      fix: 'Hold £1,270 in a single account for 28 consecutive days, dated within 31 days of applying, OR ask the sponsor to certify maintenance.',
      source: 'https://www.gov.uk/government/publications/points-based-system-appendix-finance',
      sourceLabel: 'gov.uk Appendix Finance',
    },
  ],

  'student': [
    {
      id: 'cas-issue',
      title: 'CAS not valid or issued by a non-track-record sponsor',
      cause: 'CAS used more than 6 months after issue, sponsor not on the track-record list, or course details on CAS do not match the application.',
      fix: 'Apply within 6 months of CAS issue and confirm the sponsor holds a Student sponsor licence with track-record status.',
      source: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
      sourceLabel: 'gov.uk register-of-licensed-sponsors-students',
    },
    {
      id: 'maintenance-student',
      title: 'Maintenance funds not held for 28 days',
      cause: 'Funds below £1,483/month (London) or £1,136/month (outside London) × course months, or balance dipped within the 28-day window.',
      fix: 'Hold the full required amount in a single eligible account for 28 consecutive days, ending within 31 days of applying.',
      source: 'https://www.gov.uk/student-visa/money',
      sourceLabel: 'gov.uk/student-visa/money',
    },
    {
      id: 'genuine-student',
      title: 'Genuine Student / credibility interview failed',
      cause: 'Answers in the credibility interview did not show genuine study intent, course choice rationale, or career fit.',
      fix: 'Prepare a clear statement linking the course to your career, previous study and finances; rehearse common credibility questions.',
      source: 'https://www.gov.uk/government/publications/student-and-child-student-route-caseworker-guidance',
      sourceLabel: 'gov.uk Student route caseworker guidance',
    },
    {
      id: 'english-student',
      title: 'English language not evidenced at the required CEFR level',
      cause: 'No approved SELT at B2 (degree) or B1 (below-degree), or sponsor did not record their own English assessment on the CAS.',
      fix: 'Take an approved UKVI SELT, OR confirm the sponsor recorded an internal English assessment on the CAS before applying.',
      source: 'https://www.gov.uk/student-visa/knowledge-of-english',
      sourceLabel: 'gov.uk/student-visa/knowledge-of-english',
    },
    {
      id: 'atas',
      title: 'ATAS certificate missing for sensitive subjects',
      cause: 'Course requires an ATAS certificate (sensitive science/engineering) but applicant did not obtain one before applying.',
      fix: 'Check the CAS for the ATAS requirement and apply for ATAS at FCDO at least 8 weeks before the visa application.',
      source: 'https://www.gov.uk/guidance/academic-technology-approval-scheme',
      sourceLabel: 'gov.uk Academic Technology Approval Scheme',
    },
  ],

  'visitor': [
    {
      id: 'genuine-visitor',
      title: 'Genuine visitor test failed (not satisfied you will leave)',
      cause: 'Caseworker not satisfied applicant will leave at the end of the visit, weak ties to home country, history of long UK stays.',
      fix: 'Provide strong home-country ties: employer letter, property, dependants, and a clear, dated travel plan with return flight.',
      source: 'https://www.gov.uk/government/publications/visit-guidance',
      sourceLabel: 'gov.uk Visit visa guidance',
    },
    {
      id: 'finances-visitor',
      title: 'Insufficient or unexplained finances',
      cause: 'Bank statements show insufficient funds, large unexplained deposits, or finances inconsistent with declared income.',
      fix: 'Submit 6 months of statements with deposits matched to payslips/sponsor letter; explain any one-off large credits.',
      source: 'https://www.gov.uk/standard-visitor/documents-you-must-provide',
      sourceLabel: 'gov.uk/standard-visitor/documents-you-must-provide',
    },
    {
      id: 'frequent-visits',
      title: 'Pattern of frequent or long visits (making UK your main home)',
      cause: 'Recent visa stamps show more time in the UK than at home, or back-to-back 6-month visits.',
      fix: 'Allow significant gaps between visits and ensure cumulative UK time per year remains well under 6 months.',
      source: 'https://www.gov.uk/standard-visitor/who-can-apply',
      sourceLabel: 'gov.uk/standard-visitor/who-can-apply',
    },
    {
      id: 'purpose-mismatch',
      title: 'Visit purpose not credible or not permitted',
      cause: 'Stated purpose (e.g. visiting family) inconsistent with bookings, OR planned activity is not permitted on a visitor visa.',
      fix: 'Align documents with the stated purpose, and check Appendix Visitor: Permitted Activities for what is allowed.',
      source: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-visitor-permitted-activities',
      sourceLabel: 'Immigration Rules Appendix Visitor: Permitted Activities',
    },
    {
      id: 'prior-refusal',
      title: 'Undisclosed prior visa refusal',
      cause: 'Previous UK or other-country visa refusal not declared, or earlier breach of immigration rules not addressed.',
      fix: 'Declare every refusal honestly with the date, country and reason, non-disclosure is treated as deception (refusal 9.7.1).',
      source: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-part-9-grounds-for-refusal',
      sourceLabel: 'Immigration Rules Part 9 grounds for refusal',
    },
  ],

  'family': [
    {
      id: 'minimum-income',
      title: 'Minimum income £29,000 not met',
      cause: 'Sponsor\'s gross income below £29,000 or insufficient cash savings (£88,500) held for 6 months.',
      fix: 'Combine income sources allowed under Appendix FM-SE, or use 6-month savings of £88,500+ in a regulated account.',
      source: 'https://www.gov.uk/uk-family-visa/proof-income',
      sourceLabel: 'gov.uk/uk-family-visa/proof-income',
    },
    {
      id: 'genuine-relationship',
      title: 'Genuine and subsisting relationship not accepted',
      cause: 'Insufficient evidence of cohabitation, joint finances or ongoing communication during separation.',
      fix: 'Provide joint accounts, tenancy/mortgage in both names, shared bills, photos across years, travel records and message logs.',
      source: 'https://www.gov.uk/government/publications/chapter-8-appendix-fm-family-members',
      sourceLabel: 'gov.uk Appendix FM caseworker guidance',
    },
    {
      id: 'english-a1',
      title: 'English language A1 not evidenced',
      cause: 'No approved A1 SELT (or A2 / B1 for extension/ILR), or claimed exemption not Ecctis-confirmed.',
      fix: 'Book an approved UKVI A1 SELT or get Ecctis confirmation of a degree taught in English.',
      source: 'https://www.gov.uk/english-language',
      sourceLabel: 'gov.uk/english-language',
    },
    {
      id: 'accommodation',
      title: 'Adequate accommodation not evidenced',
      cause: 'Property overcrowded under the Housing Act 1985, or no tenancy/mortgage proof in sponsor\'s name.',
      fix: 'Provide a current tenancy/mortgage statement plus a property inspection report confirming no statutory overcrowding.',
      source: 'https://www.gov.uk/government/publications/family-life-as-a-partner-or-parent-private-life-and-exceptional-circumstance',
      sourceLabel: 'gov.uk Family Life caseworker guidance',
    },
    {
      id: 'suitability-grounds',
      title: 'Suitability, overstay, deception or unpaid NHS debt',
      cause: 'Previous overstay, false document on a prior application, or unpaid NHS debt over £500.',
      fix: 'Clear NHS debt and address any prior breach in a covering letter; full disclosure is essential under Part 9 rules.',
      source: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-part-9-grounds-for-refusal',
      sourceLabel: 'Immigration Rules Part 9 grounds for refusal',
    },
  ],

  'health': [
    {
      id: 'soc-mismatch',
      title: 'Role not on the eligible health SOC list',
      cause: 'Job not in the eligible health/care SOC codes, or care worker (SOC 6135/6136) recruited from overseas after 22 Jul 2025.',
      fix: 'Confirm SOC eligibility on the Health & Care Worker SOC list before the CoS is assigned.',
      source: 'https://www.gov.uk/health-care-worker-visa/your-job',
      sourceLabel: 'gov.uk/health-care-worker-visa/your-job',
    },
    {
      id: 'cos-health',
      title: 'CoS issued by non-NHS / non-approved sponsor',
      cause: 'CoS assigned by a sponsor not approved for the Health & Care route, or by a care provider after the 2025 closure.',
      fix: 'Verify the sponsor on the licensed sponsor register and confirm they hold a Health & Care endorsement.',
      source: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers',
      sourceLabel: 'gov.uk licensed sponsor register',
    },
    {
      id: 'pro-registration',
      title: 'UK professional body registration missing',
      cause: 'GMC / NMC / HCPC registration not in place at the time of decision, or registration suspended.',
      fix: 'Submit proof of GMC/NMC/HCPC registration (or pending application reference) with the application.',
      source: 'https://www.gov.uk/health-care-worker-visa',
      sourceLabel: 'gov.uk/health-care-worker-visa',
    },
    {
      id: 'english-health',
      title: 'English language B1 / OET not at required level',
      cause: 'No B1 evidence (or OET for medical roles), or sponsor did not confirm internal English assessment on the CoS.',
      fix: 'Book OET / IELTS UKVI at the level required for your role, most clinical roles require higher than B1.',
      source: 'https://www.gov.uk/health-care-worker-visa/knowledge-of-english',
      sourceLabel: 'gov.uk health-care-worker-visa knowledge-of-english',
    },
    {
      id: 'criminal-cert',
      title: 'Criminal record certificate missing or not legalised',
      cause: 'Criminal record certificate not provided for every country lived in 12+ months in the last 10 years.',
      fix: 'Order police certificates from every relevant country at least 8 weeks before applying; have non-English ones translated.',
      source: 'https://www.gov.uk/government/publications/criminal-records-checks-for-overseas-applicants',
      sourceLabel: 'gov.uk overseas criminal records checks',
    },
  ],

  'talent': [
    {
      id: 'no-endorsement',
      title: 'Endorsement application unsuccessful',
      cause: 'Endorsing body not satisfied applicant meets exceptional talent (leader) or exceptional promise (emerging) criteria.',
      fix: 'Strengthen the portfolio with sustained recognition, peer endorsements and quantified impact in the field.',
      source: 'https://www.gov.uk/global-talent',
      sourceLabel: 'gov.uk/global-talent',
    },
    {
      id: 'evidence-thin',
      title: 'Evidence portfolio too thin or generic',
      cause: 'Fewer than 3 strong recommendations, generic letters, or evidence outside the past 5 years.',
      fix: 'Use 3 detailed reference letters from named experts, plus 10 dated artefacts (publications, awards, code, productions).',
      source: 'https://www.gov.uk/global-talent/exceptional-talent-promise-criteria-research-academia',
      sourceLabel: 'gov.uk Global Talent criteria',
    },
    {
      id: 'endorsement-expired',
      title: 'Endorsement-to-visa window exceeded',
      cause: 'Visa application submitted more than 3 months after the endorsement decision.',
      fix: 'Apply for the visa within 3 months of receiving the endorsement letter, set a calendar reminder.',
      source: 'https://www.gov.uk/global-talent/apply',
      sourceLabel: 'gov.uk/global-talent/apply',
    },
    {
      id: 'tb-talent',
      title: 'TB test certificate missing',
      cause: 'Applicant from a TB-listed country did not submit a valid IOM TB certificate.',
      fix: 'Book TB testing at an approved IOM clinic; certificate is valid for 6 months from issue.',
      source: 'https://www.gov.uk/tb-test-visa',
      sourceLabel: 'gov.uk/tb-test-visa',
    },
    {
      id: 'wrong-body',
      title: 'Wrong endorsing body chosen for the field',
      cause: 'Application sent to the wrong endorsing body (e.g. UKRI for arts), causing rejection at triage.',
      fix: 'Use the gov.uk endorsing-body matrix to map your field to the correct body before paying the endorsement fee.',
      source: 'https://www.gov.uk/global-talent-eligibility',
      sourceLabel: 'gov.uk/global-talent-eligibility',
    },
  ],

  'graduate': [
    {
      id: 'student-leave',
      title: 'Student visa already expired when applied',
      cause: 'Graduate visa application submitted after the Student visa\'s expiry date.',
      fix: 'Apply before the Student visa expires, the graduation date is not the relevant deadline.',
      source: 'https://www.gov.uk/graduate-visa',
      sourceLabel: 'gov.uk/graduate-visa',
    },
    {
      id: 'completion-not-reported',
      title: 'Sponsor has not reported course completion',
      cause: 'Education sponsor did not notify the Home Office that the qualification was successfully completed.',
      fix: 'Chase the sponsor to file the completion report on the Sponsorship Management System before applying.',
      source: 'https://www.gov.uk/graduate-visa/eligibility',
      sourceLabel: 'gov.uk/graduate-visa/eligibility',
    },
    {
      id: 'non-track-record',
      title: 'Course was at a non-track-record sponsor',
      cause: 'Awarding institution is not on the Student-route track-record list at the date of application.',
      fix: 'Confirm the sponsor\'s track-record status before applying, only HEPs with a track record can sponsor Graduate route.',
      source: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
      sourceLabel: 'gov.uk licensed student sponsors',
    },
    {
      id: 'wrong-course-level',
      title: 'Course not at eligible degree level',
      cause: 'Qualification below bachelor\'s degree level, or not a UK degree (e.g. an overseas top-up taught remotely).',
      fix: 'Verify the course is UK bachelor\'s, master\'s, or PhD on the CAS before applying.',
      source: 'https://www.gov.uk/graduate-visa/eligibility',
      sourceLabel: 'gov.uk/graduate-visa/eligibility',
    },
    {
      id: 'previous-grad',
      title: 'Previously held a Graduate or Doctorate Extension visa',
      cause: 'Applicant has already held a Graduate visa or Doctorate Extension Scheme leave (single-grant route).',
      fix: 'The Graduate route is single-grant, switch to Skilled Worker instead if you need to extend after a previous Graduate visa.',
      source: 'https://www.gov.uk/graduate-visa',
      sourceLabel: 'gov.uk/graduate-visa',
    },
  ],

  'innovator-founder': [
    {
      id: 'innovation',
      title: 'Business idea not assessed as innovative',
      cause: 'Endorsing body found the idea derivative or already widely served by competitors in the UK market.',
      fix: 'Pitch a clear gap-in-market analysis with original technology/IP, not a copy of an existing UK service.',
      source: 'https://www.gov.uk/innovator-founder-visa',
      sourceLabel: 'gov.uk/innovator-founder-visa',
    },
    {
      id: 'viable-scalable',
      title: 'Plan not viable or scalable',
      cause: 'Financial projections unrealistic, no route to revenue beyond founder, or team unable to deliver the plan.',
      fix: 'Show 3-year forecasts grounded in market data, a hiring plan, and milestones the endorsing body can verify at 12/24 months.',
      source: 'https://www.gov.uk/innovator-founder-visa/eligibility',
      sourceLabel: 'gov.uk/innovator-founder-visa/eligibility',
    },
    {
      id: 'english-b2-inn',
      title: 'English language B2 not evidenced',
      cause: 'No approved B2 SELT or Ecctis-confirmed degree taught in English.',
      fix: 'Take an approved UKVI B2 SELT or obtain Ecctis confirmation before applying.',
      source: 'https://www.gov.uk/english-language',
      sourceLabel: 'gov.uk/english-language',
    },
    {
      id: 'endorsement-3m',
      title: 'Endorsement-to-visa window exceeded',
      cause: 'Visa application submitted more than 3 months after the endorsement letter was issued.',
      fix: 'Submit the visa application within 3 months of the endorsement letter, start documents in parallel.',
      source: 'https://www.gov.uk/innovator-founder-visa/apply',
      sourceLabel: 'gov.uk/innovator-founder-visa/apply',
    },
    {
      id: 'maintenance-inn',
      title: 'Maintenance funds (£1,270) not held 28 days',
      cause: 'Savings dipped below £1,270 during the 28-day window, or held in a non-eligible account.',
      fix: 'Hold £1,270 in a single eligible account for 28 consecutive days, ending no more than 31 days before applying.',
      source: 'https://www.gov.uk/innovator-founder-visa/eligibility',
      sourceLabel: 'gov.uk/innovator-founder-visa/eligibility',
    },
  ],

  'ilr': [
    {
      id: 'absences-180',
      title: 'Absences exceeded 180 days in a rolling 12 months',
      cause: 'More than 180 days outside the UK in any rolling 12-month period across the qualifying 5 years.',
      fix: 'Spreadsheet every UK departure date and total rolling-12-month absences, apply only when every window is under 180.',
      source: 'https://www.gov.uk/indefinite-leave-to-remain/eligibility',
      sourceLabel: 'gov.uk/indefinite-leave-to-remain/eligibility',
    },
    {
      id: 'litu-fail',
      title: 'Life in the UK Test not passed',
      cause: 'No LITU pass certificate uploaded, or certificate from a non-approved test centre.',
      fix: 'Book the £50 LITU test on gov.uk; the pass is valid for life and counts for citizenship too.',
      source: 'https://www.gov.uk/life-in-the-uk-test',
      sourceLabel: 'gov.uk/life-in-the-uk-test',
    },
    {
      id: 'english-b1-ilr',
      title: 'English language B1 not evidenced',
      cause: 'No approved B1 SELT or higher, and exemption not Ecctis-confirmed.',
      fix: 'Take a UKVI B1 SELT or obtain Ecctis confirmation of a degree taught in English before applying.',
      source: 'https://www.gov.uk/english-language',
      sourceLabel: 'gov.uk/english-language',
    },
    {
      id: 'sponsor-still-licensed',
      title: 'Sponsor licence no longer valid (Skilled Worker route)',
      cause: 'Skilled Worker applicant\'s sponsor licence revoked or expired before the ILR application.',
      fix: 'Confirm the sponsor remains licensed on the day you apply; otherwise switch to a new sponsor first.',
      source: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers',
      sourceLabel: 'gov.uk licensed sponsor register',
    },
    {
      id: 'tax-discrepancy',
      title: 'HMRC tax records inconsistent with declared salary',
      cause: 'Self-assessment / PAYE history does not match the salaries declared on past CoS or visa applications (paragraph 322(5) risk).',
      fix: 'Reconcile every tax year against past visa declarations; file amendments and a written explanation if there are discrepancies.',
      source: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-part-9-grounds-for-refusal',
      sourceLabel: 'Immigration Rules Part 9 (general grounds)',
    },
  ],

  'citizenship': [
    {
      id: 'good-character',
      title: 'Good character requirement not met',
      cause: 'Unspent conviction, recent caution, NHS debt over £500, or repeated immigration breaches in the last 10 years.',
      fix: 'Clear NHS debts, wait until convictions are spent under the ROA 1974, and disclose everything with a covering letter.',
      source: 'https://www.gov.uk/government/publications/good-character-nationality-policy-guidance',
      sourceLabel: 'gov.uk Good character guidance',
    },
    {
      id: 'absences-citizen',
      title: 'Absences exceeded the allowable totals',
      cause: 'More than 450 days absent in 5 years (270 on spouse route), or more than 90 days in the final 12 months.',
      fix: 'Defer applying until your absence totals fall under the limits, there is no discretion below the threshold.',
      source: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain/check-if-you-can-apply',
      sourceLabel: 'gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },
    {
      id: 'litu-citizen',
      title: 'Life in the UK Test or B1 English not evidenced',
      cause: 'LITU pass or B1+ evidence missing; previous ILR pass not re-uploaded with the AN.',
      fix: 'Re-upload the LITU certificate and English evidence with Form AN, pass certificates do carry across.',
      source: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain/knowledge-of-english-and-life-in-the-uk',
      sourceLabel: 'gov.uk citizenship knowledge-of-english',
    },
    {
      id: 'referees',
      title: 'Referees do not meet the requirements',
      cause: 'Both referees not known to applicant for 3+ years, or referee not a British passport holder / professional.',
      fix: 'Choose one British-passport-holder referee and one professional (doctor / solicitor / accountant), both known 3+ years.',
      source: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain/referees',
      sourceLabel: 'gov.uk citizenship referees',
    },
    {
      id: 'intent-uk-home',
      title: 'Intention to make the UK your home not satisfied',
      cause: 'Long stretches abroad after ILR, family/main job overseas, or no settled UK address evidence.',
      fix: 'Show UK address, council tax, employment and family ties at the time of application; minimise time abroad in the final 12 months.',
      source: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
      sourceLabel: 'gov.uk/apply-citizenship-indefinite-leave-to-remain',
    },
  ],

  'euss': [
    {
      id: 'late-no-grounds',
      title: 'Late application with no reasonable grounds accepted',
      cause: 'Submitted after 30 June 2021 deadline without satisfactory reason (illness, abuse, dependency, lack of information).',
      fix: 'Provide medical, social-work or other documentary evidence supporting the reasonable-grounds claim.',
      source: 'https://www.gov.uk/settled-status-eu-citizens-families/eligibility',
      sourceLabel: 'gov.uk EUSS eligibility',
    },
    {
      id: 'pre-2021-residence',
      title: 'Pre-31-December-2020 UK residence not evidenced',
      cause: 'HMRC/DWP auto-check found no records, and applicant did not upload alternative residence evidence.',
      fix: 'Upload payslips, tenancy, P60s, council-tax bills or NHS letters covering periods the auto-check missed.',
      source: 'https://www.gov.uk/settled-status-eu-citizens-families/what-counts-as-evidence',
      sourceLabel: 'gov.uk EUSS evidence',
    },
    {
      id: 'criminal-euss',
      title: 'Conduct or criminality grounds',
      cause: 'Serious criminal record, or conduct (pre- or post-31 Dec 2020) considered a public-policy threat.',
      fix: 'Disclose every conviction with dates and outcomes; seek immigration legal advice before applying.',
      source: 'https://www.gov.uk/government/publications/eu-settlement-scheme-suitability-requirements',
      sourceLabel: 'gov.uk EUSS suitability requirements',
    },
    {
      id: 'family-relationship',
      title: 'Family-member relationship not evidenced',
      cause: 'Joining-family-member route used without sufficient evidence of relationship or dependency.',
      fix: 'Provide marriage certificate, birth certificate or dependency evidence (financial support records, shared address).',
      source: 'https://www.gov.uk/family-permit',
      sourceLabel: 'gov.uk EUSS family permit',
    },
    {
      id: 'durable-partner',
      title: 'Durable-partner status not accepted',
      cause: 'Unmarried partner could not show 2+ years cohabitation before 31 December 2020.',
      fix: 'Document 2+ years of shared address (joint tenancy, bills, bank statements) ending before the transition date.',
      source: 'https://www.gov.uk/settled-status-eu-citizens-families/eligibility',
      sourceLabel: 'gov.uk EUSS eligibility',
    },
  ],

  'bno': [
    {
      id: 'bno-status',
      title: 'BN(O) status not confirmed',
      cause: 'Home Office could not match the applicant to a BN(O) record, or BN(O) status was renounced.',
      fix: 'Provide your BN(O) passport (even if expired) or evidence of historic BN(O) registration with HK government records.',
      source: 'https://www.gov.uk/british-national-overseas-bno-visa',
      sourceLabel: 'gov.uk/british-national-overseas-bno-visa',
    },
    {
      id: 'tb-bno',
      title: 'TB test certificate missing',
      cause: 'Required TB certificate not uploaded, applies to applicants in Hong Kong and a number of third countries.',
      fix: 'Book a TB test at an IOM-approved clinic; certificate is valid for 6 months.',
      source: 'https://www.gov.uk/tb-test-visa',
      sourceLabel: 'gov.uk/tb-test-visa',
    },
    {
      id: 'maintenance-bno',
      title: 'Maintenance funds (6 months) not evidenced',
      cause: 'No 6 months\' worth of funds to support self and family in the UK, or evidence of a UK sponsor missing.',
      fix: 'Submit 6 months of bank statements showing sufficient funds, or a sponsor letter from a UK-based supporter.',
      source: 'https://www.gov.uk/british-national-overseas-bno-visa/eligibility',
      sourceLabel: 'gov.uk BN(O) eligibility',
    },
    {
      id: 'dependant-link',
      title: 'Dependant relationship to BN(O) not established',
      cause: 'Adult child / parent dependant could not show relationship and household-member status with the BN(O) principal.',
      fix: 'Provide birth certificates, household registration and proof of living together with the BN(O) principal.',
      source: 'https://www.gov.uk/british-national-overseas-bno-visa/family-members',
      sourceLabel: 'gov.uk BN(O) family members',
    },
    {
      id: 'suitability-bno',
      title: 'Suitability, criminal record or NHS debt',
      cause: 'Unspent convictions, deception in a prior application, or unpaid NHS debt over £500.',
      fix: 'Clear NHS debt and disclose every conviction with full dates and outcomes in the application.',
      source: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-part-9-grounds-for-refusal',
      sourceLabel: 'Immigration Rules Part 9',
    },
  ],

  'long-residence': [
    {
      id: 'continuous-broken',
      title: '10 years continuous lawful residence broken',
      cause: 'Single absence over 184 days, total absences over 548 days in 10 years, or a period without valid leave.',
      fix: 'Build a day-by-day absence ledger from BRPs and passports, apply only if every window is under the limits.',
      source: 'https://www.gov.uk/long-residence/eligibility',
      sourceLabel: 'gov.uk/long-residence/eligibility',
    },
    {
      id: 'overstay-28',
      title: 'Past overstay broke continuous residence',
      cause: 'A previous overstay of more than 14 days (post-2012) without a valid reason broke the 10-year clock.',
      fix: 'Long Residence may no longer apply, consider a Skilled Worker / Family route instead and seek legal advice.',
      source: 'https://www.gov.uk/long-residence',
      sourceLabel: 'gov.uk/long-residence',
    },
    {
      id: 'litu-lr',
      title: 'Life in the UK Test or B1 English not evidenced',
      cause: 'LITU certificate or B1+ evidence missing.',
      fix: 'Pass the £50 LITU test and book an approved B1 SELT or get Ecctis confirmation before applying.',
      source: 'https://www.gov.uk/life-in-the-uk-test',
      sourceLabel: 'gov.uk/life-in-the-uk-test',
    },
    {
      id: 'visit-time',
      title: 'Visitor / short-term leave counted as residence',
      cause: 'Time on Visitor, Graduate, Short-term Student or seasonal worker visas mistakenly counted toward the 10 years.',
      fix: 'Build the residence schedule using only qualifying long-term leave categories.',
      source: 'https://www.gov.uk/long-residence/eligibility',
      sourceLabel: 'gov.uk/long-residence/eligibility',
    },
    {
      id: 'character-lr',
      title: 'Good character, criminal record or tax discrepancy',
      cause: 'Unspent convictions, deception, or HMRC records inconsistent with declared salaries on prior visas.',
      fix: 'Reconcile tax records, clear any debt, and disclose every event with dates and evidence.',
      source: 'https://www.gov.uk/government/publications/good-character-nationality-policy-guidance',
      sourceLabel: 'gov.uk Good character guidance',
    },
  ],

  'ancestry': [
    {
      id: 'grandparent-link',
      title: 'UK-born grandparent link not evidenced',
      cause: 'Cannot produce the chain of birth/marriage certificates linking applicant to a UK-born grandparent.',
      fix: 'Order full certified copies from GRO / Scotland\'s People / GRONI for every link in the chain.',
      source: 'https://www.gov.uk/ancestry-visa/eligibility',
      sourceLabel: 'gov.uk/ancestry-visa/eligibility',
    },
    {
      id: 'commonwealth',
      title: 'Not a Commonwealth citizen on the date of application',
      cause: 'Applicant has changed citizenship or never held Commonwealth citizenship.',
      fix: 'Apply only while holding a current Commonwealth-citizen passport, before any change of nationality.',
      source: 'https://www.gov.uk/ancestry-visa',
      sourceLabel: 'gov.uk/ancestry-visa',
    },
    {
      id: 'intent-work',
      title: 'Intention and ability to work in the UK not shown',
      cause: 'No CV, no job-search evidence, no funds to support a job search, caseworker not satisfied of intent to work.',
      fix: 'Submit a CV, evidence of UK job applications or offers, and savings supporting a job-search period.',
      source: 'https://www.gov.uk/ancestry-visa/eligibility',
      sourceLabel: 'gov.uk/ancestry-visa/eligibility',
    },
    {
      id: 'maintenance-anc',
      title: 'Maintenance funds insufficient',
      cause: 'Evidence does not show funds to support self and dependants without recourse to public funds.',
      fix: 'Submit 6 months of bank statements; include sponsor undertaking if a UK family member will support you.',
      source: 'https://www.gov.uk/ancestry-visa/documents-you-must-provide',
      sourceLabel: 'gov.uk/ancestry-visa/documents',
    },
    {
      id: 'tb-anc',
      title: 'TB test certificate missing',
      cause: 'Applicant from a TB-listed country did not submit a valid IOM TB certificate.',
      fix: 'Book a TB test at an approved IOM clinic at least 4 weeks before applying.',
      source: 'https://www.gov.uk/tb-test-visa',
      sourceLabel: 'gov.uk/tb-test-visa',
    },
  ],
};

export function getRefusalsFor(slug: string): RefusalReason[] {
  return VISA_REFUSALS[slug] ?? [];
}
