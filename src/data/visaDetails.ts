// UK Visa data — effective April 2026
// Reflects: May 2025 Immigration White Paper reforms, April 2026 fee uplift,
// IHS at £1,035/year (adult) / £776/year (student/dependant/YMS).
// Family visa minimum income remains £29,000 (review ongoing).

export interface VisaDetail {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  applyUrl: string;
  category: 'Work' | 'Study' | 'Visit' | 'Family';
  fee: string;
  ihs: string;
  duration: string;
  processing: { outside: string; inside: string };
  eligibility: string[];
  documents: string[];
  steps: { title: string; desc: string }[];
  notes?: string[];
  updated: string;
}

const UPDATED = 'April 2026';

export const VISA_DETAILS: Record<string, VisaDetail> = {
  'skilled-worker': {
    id: 'skilled-worker',
    title: 'Skilled Worker Visa',
    tagline: 'Work in an eligible job with a UK Home Office licensed sponsor.',
    summary:
      'For individuals with a job offer from a UK employer holding a sponsor licence. Following the May 2025 White Paper, the minimum skill level returned to RQF Level 6 (graduate) and salary thresholds rose. English language requirement is now B2.',
    applyUrl: 'https://www.gov.uk/skilled-worker-visa',
    category: 'Work',
    fee: '£827 – £1,636 (outside UK)',
    ihs: '£1,035 / year',
    duration: 'Up to 5 years, extendable; settlement after 10 years (from 2028 cohorts)',
    processing: { outside: '3 weeks', inside: '8 weeks' },
    eligibility: [
      'Confirmed job offer from a Home Office licensed sponsor',
      'Certificate of Sponsorship (CoS) issued within the last 3 months',
      'Role at RQF Level 6 (graduate-level) or above — raised from Level 3 in July 2025',
      'Salary at or above £41,700 OR the going rate for the occupation code (whichever is higher)',
      'English language B2 CEFR (raised from B1, effective 2026)',
      '£1,270 personal savings held for 28 consecutive days (unless sponsor certifies maintenance)',
    ],
    documents: [
      'Valid passport or travel document',
      'Certificate of Sponsorship reference number',
      'Proof of English language at B2 (SELT, degree taught in English, or majority-English-speaking national)',
      'Bank statements (28 consecutive days) if claiming maintenance yourself',
      'Tuberculosis (TB) test results if applying from a listed country',
      'Criminal record certificate (healthcare, education, social care roles)',
      'PhD certificate if claiming tradeable points',
    ],
    steps: [
      { title: 'Secure a qualifying job offer', desc: 'Accept an offer from a UK employer on the Home Office licensed sponsor register. Role must be RQF Level 6+.' },
      { title: 'Receive Certificate of Sponsorship', desc: 'Employer assigns you a CoS reference number — valid for 3 months from assignment.' },
      { title: 'Meet English & financial tests', desc: 'Pass approved B2 SELT or qualify by exemption; hold £1,270 savings for 28 days.' },
      { title: 'Apply online on GOV.UK', desc: 'Complete the application, pay visa fee + IHS, and book a biometric appointment.' },
      { title: 'Biometrics & decision', desc: 'Attend a Visa Application Centre. Standard decision within 3 weeks (outside UK).' },
      { title: 'Receive eVisa', desc: 'From 2026, all visas are digital (eVisa) — no physical BRP issued.' },
    ],
    notes: [
      'Immigration Skills Charge (paid by employer): £1,000/year (large sponsors) or £364/year (small/charitable).',
      'Priority: 5 working days (+£500). Super Priority: next working day (+£1,000).',
      'Shortage Occupation List replaced by Immigration Salary List — fewer roles qualify for discount.',
      'Dependants: partner and children under 18 may apply.',
    ],
    updated: UPDATED,
  },
  'student': {
    id: 'student',
    title: 'Student Visa',
    tagline: 'Study at a UK-licensed education provider aged 16+.',
    summary:
      'For students offered an unconditional place on an eligible course at a licensed Student sponsor. From January 2024, most taught Masters students cannot bring dependants; this remains in force.',
    applyUrl: 'https://www.gov.uk/student-visa',
    category: 'Study',
    fee: '£565 (outside UK) / £721 (inside UK)',
    ihs: '£776 / year',
    duration: 'Course length + up to 4 months',
    processing: { outside: '3 weeks', inside: '8 weeks' },
    eligibility: [
      'Unconditional offer with a Confirmation of Acceptance for Studies (CAS) from a licensed sponsor',
      'English language: B2 for degree-level courses, B1 below degree',
      'Maintenance funds: £1,483/month (London) or £1,136/month (outside London), up to 9 months',
      'Funds held for 28 consecutive days ending no more than 31 days before applying',
      'Parental consent if under 18',
      'Credibility interview may be required to demonstrate genuine intent',
    ],
    documents: [
      'Valid passport',
      'CAS reference number (valid 6 months)',
      'Bank statements showing maintenance funds held for 28 days',
      'Academic qualifications listed on your CAS',
      'Approved English language test certificate (if required by sponsor)',
      'TB test results if from a listed country',
      'ATAS certificate for sensitive research/science subjects',
    ],
    steps: [
      { title: 'Accept an offer & receive CAS', desc: 'Your institution issues a CAS reference once you accept an unconditional place.' },
      { title: 'Prepare finances & English', desc: 'Hold maintenance funds for 28 days; take an approved SELT if needed.' },
      { title: 'Apply online', desc: 'Apply up to 6 months before course start (outside UK) or 3 months (inside).' },
      { title: 'Biometrics', desc: 'Book a Visa Application Centre appointment for fingerprints and photograph.' },
      { title: 'Receive eVisa', desc: 'From 2026, status is held digitally — link your passport to your UKVI account on arrival.' },
    ],
    notes: [
      'Taught Masters students cannot bring dependants (except government-sponsored courses of 6+ months).',
      'Students can work up to 20 hours/week during term time (degree-level).',
      'Switching to Skilled Worker inside the UK is permitted after course completion.',
    ],
    updated: UPDATED,
  },
  'visitor': {
    id: 'visitor',
    title: 'Standard Visitor Visa',
    tagline: 'Tourism, business, short study (up to 6 months) or medical treatment.',
    summary:
      'For short stays up to 6 months. From 2024–2025 the ETA scheme was rolled out globally for visa-exempt nationals — check whether you need a visa or an Electronic Travel Authorisation (£16) instead.',
    applyUrl: 'https://www.gov.uk/standard-visitor',
    category: 'Visit',
    fee: '£127 (6 months) / £475 (2y) / £848 (5y) / £1,059 (10y)',
    ihs: 'Not required',
    duration: 'Up to 6 months per visit',
    processing: { outside: '3 weeks', inside: 'N/A' },
    eligibility: [
      'Genuine intention to leave at the end of your visit',
      'Adequate funds for travel, accommodation and living costs without working',
      'Not making the UK your main home through frequent or long visits',
      'No paid employment, public funds, or marriage/civil partnership intent',
      'Not enrolling on a course longer than 6 months',
    ],
    documents: [
      'Valid passport',
      'Bank statements for the last 6 months',
      'Travel itinerary and confirmed accommodation bookings',
      'Invitation letter from UK host (family, friends, business) if applicable',
      'Proof of employment or study ties to home country (payslips, enrolment letter)',
      'Return flight booking',
    ],
    steps: [
      { title: 'Check if you need a visa', desc: 'Visa-exempt nationals may only need an ETA (£16) — applied for online in minutes.' },
      { title: 'Plan your trip', desc: 'Confirm dates, purpose, accommodation, and return travel.' },
      { title: 'Gather evidence', desc: 'Assemble financial, employment and ties-to-home documents.' },
      { title: 'Apply online', desc: 'Submit up to 3 months before travel on GOV.UK.' },
      { title: 'Biometrics & travel', desc: 'Attend a Visa Application Centre; travel once the decision is issued.' },
    ],
    notes: [
      'ETA (Electronic Travel Authorisation) applies to most visa-exempt nationals — £16, valid 2 years.',
      'Long-term visitor visas let you visit repeatedly; each stay still capped at 6 months.',
      'Permitted Paid Engagement activities allow some paid work up to 1 month.',
    ],
    updated: UPDATED,
  },
  'family': {
    id: 'family',
    title: 'Family Visa (Spouse / Partner)',
    tagline: 'Join a partner, parent or child who is British or settled in the UK.',
    summary:
      'For partners, children, parents or adult dependent relatives of British citizens or settled persons. Minimum income requirement remained at £29,000 pending the 2026 Migration Advisory Committee review.',
    applyUrl: 'https://www.gov.uk/uk-family-visa',
    category: 'Family',
    fee: '£1,938 (outside UK) / £1,321 (inside UK)',
    ihs: '£1,035 / year',
    duration: '2 years 9 months, extendable; settlement after 5 years',
    processing: { outside: '12 weeks', inside: '8 weeks' },
    eligibility: [
      'UK-based partner is British, Irish, settled, pre-settled, or has refugee/humanitarian protection',
      'Genuine and subsisting relationship (married/civil partners, or 2+ years cohabitation)',
      'Minimum income £29,000 gross OR cash savings ≥ £88,500',
      'Adequate accommodation without recourse to public funds',
      'English language: A1 initial application, A2 extension, B1 for settlement',
      'TB test results where required',
    ],
    documents: [
      'Valid passports for applicant and sponsor',
      'Marriage certificate, civil partnership certificate, or evidence of 2+ years cohabitation',
      'Sponsor payslips and bank statements (6 months) OR evidence of savings',
      'Tenancy agreement, mortgage statement or property deeds',
      'Approved English language test certificate',
      'Relationship evidence: photos, joint accounts, communication history, travel records',
    ],
    steps: [
      { title: 'Check financial requirement', desc: 'Confirm £29,000 annual income or £88,500 cash savings held for 6 months.' },
      { title: 'Gather relationship evidence', desc: 'Joint accounts, shared tenancy, photos across years, travel, messages.' },
      { title: 'Pass English test', desc: 'A1 approved SELT unless exempt (national of majority-English country or degree taught in English).' },
      { title: 'Apply online', desc: 'Complete the form and pay visa fee + IHS (5-year total upfront).' },
      { title: 'Biometrics & decision', desc: 'Attend VAC; decisions outside the UK typically 12 weeks.' },
    ],
    notes: [
      'Partner route leads to settlement (ILR) after 5 years of continuous residence.',
      'Fiancé(e) visa: 6 months to marry, then switch to partner visa.',
      'Parent/child routes and adult dependent relative routes use different tests.',
    ],
    updated: UPDATED,
  },
  'health': {
    id: 'health',
    title: 'Health and Care Worker Visa',
    tagline: 'Fast-track route for eligible NHS and senior care roles.',
    summary:
      'For qualified doctors, nurses, and allied health professionals. The route closed to overseas recruitment of care workers (SOC 6135/6136) from 22 July 2025 following the Immigration White Paper — domestic recruitment only for new care worker applicants.',
    applyUrl: 'https://www.gov.uk/health-care-worker-visa',
    category: 'Work',
    fee: '£304 – £590',
    ihs: 'Exempt',
    duration: 'Up to 5 years, extendable',
    processing: { outside: '3 weeks', inside: '8 weeks' },
    eligibility: [
      'Job offer from the NHS, an NHS supplier, or (for pre-existing applicants only) an approved adult social care employer',
      'Certificate of Sponsorship from licensed sponsor',
      'Occupation on the eligible SOC code list for healthcare',
      'Salary at or above the relevant threshold (NHS-national-pay-scale rates apply for medical roles)',
      'English language B1 CEFR (B2 from 2026 for non-medical applicants)',
    ],
    documents: [
      'Passport',
      'Certificate of Sponsorship reference number',
      'English language evidence',
      'Enhanced DBS / criminal record certificate',
      'Registration with GMC, NMC, HCPC or other relevant UK professional body',
      'Evidence of qualifications',
    ],
    steps: [
      { title: 'Get a qualifying job offer', desc: 'Accept a role from an approved health or care sponsor on the eligible list.' },
      { title: 'Register with UK professional body', desc: 'GMC (doctors), NMC (nurses), HCPC (AHPs) etc. — can often start in parallel.' },
      { title: 'Obtain Certificate of Sponsorship', desc: 'Employer issues CoS — valid 3 months.' },
      { title: 'Apply online', desc: 'Apply up to 3 months before start date. IHS is waived.' },
      { title: 'Biometrics & decision', desc: 'Attend VAC and receive decision — typically 3 weeks.' },
    ],
    notes: [
      'No Immigration Health Surcharge — substantial saving vs Skilled Worker.',
      'Care worker (SOC 6135/6136) route: closed to new overseas recruitment from 22 July 2025.',
      'Existing care workers in the UK can still extend and switch employers until 2028.',
    ],
    updated: UPDATED,
  },
  'talent': {
    id: 'talent',
    title: 'Global Talent Visa',
    tagline: 'For leaders and exceptional promise in research, arts, and tech.',
    summary:
      'For endorsed leaders or emerging talent in academia/research, arts & culture, or digital technology. Tech Nation resumed digital tech endorsements in 2024; endorsing bodies updated guidance in 2025.',
    applyUrl: 'https://www.gov.uk/global-talent',
    category: 'Work',
    fee: '£816 total (endorsement £605 + visa £211)',
    ihs: '£1,035 / year',
    duration: '1–5 years per application, unlimited extensions',
    processing: { outside: '3 weeks', inside: '8 weeks' },
    eligibility: [
      'Endorsement from: Royal Society, British Academy, Royal Academy of Engineering, UKRI, Arts Council England, or Tech Nation',
      'Demonstrated exceptional talent (leader) or exceptional promise (emerging) in your field',
      'Two-stage application: endorsement first, then visa',
      'Certain fellowships and awards allow "fast-track" prestigious-prize route',
    ],
    documents: [
      'Passport',
      'Endorsement letter or qualifying prize evidence',
      'Evidence portfolio: CV (3 pages max), up to 10 documents, 3 letters of recommendation',
      'TB test results if required',
    ],
    steps: [
      { title: 'Apply for endorsement', desc: 'Submit evidence portfolio to the relevant endorsing body via the GOV.UK online route.' },
      { title: 'Receive endorsement', desc: 'Assessment typically within 8 weeks.' },
      { title: 'Apply for the visa', desc: 'Submit visa application on GOV.UK within 3 months of endorsement.' },
      { title: 'Biometrics & decision', desc: 'Attend VAC; decision typically 3 weeks.' },
    ],
    notes: [
      'No job offer or sponsor required.',
      'Eligible for accelerated settlement (3 years for exceptional talent).',
      'Prestigious prize holders (e.g. Nobel, Turing, Oscar) can skip endorsement.',
    ],
    updated: UPDATED,
  },
  'graduate': {
    id: 'graduate',
    title: 'Graduate Visa',
    tagline: 'Post-study work — now 18 months (from May 2025 reform).',
    summary:
      'For international students who have completed an eligible UK degree. Duration reduced from 2 years to 18 months (3 years remains for PhDs) as part of the May 2025 Immigration White Paper reforms.',
    applyUrl: 'https://www.gov.uk/graduate-visa',
    category: 'Study',
    fee: '£957',
    ihs: '£1,035 / year',
    duration: '18 months (3 years for PhD)',
    processing: { outside: 'N/A — apply inside UK only', inside: '8 weeks' },
    eligibility: [
      'Currently holding a Student (or legacy Tier 4) visa in the UK',
      'Successfully completed a bachelor\'s, master\'s or PhD at a track-record HEP sponsor',
      'Your sponsor has reported course completion to the Home Office',
      'Apply before your Student visa expires',
    ],
    documents: [
      'Passport or current BRP / eVisa link',
      'CAS reference number used for your Student visa',
      'Confirmation your sponsor has reported completion',
    ],
    steps: [
      { title: 'Complete your course', desc: 'Pass your qualification and have it confirmed by your institution.' },
      { title: 'Apply from inside the UK', desc: 'Submit the application on GOV.UK before your Student visa expires.' },
      { title: 'Pay fee + IHS upfront', desc: 'One-off fee covering the full 18 months (or 3 years for PhD).' },
      { title: 'Receive decision', desc: 'Typically within 8 weeks. No sponsor or salary requirement.' },
    ],
    notes: [
      'Duration reduced from 2 years to 18 months from May 2025 (3 years retained for PhD).',
      'Cannot be extended — switch to Skilled Worker before expiry to remain longer.',
      'No minimum salary; any work (including self-employment) is permitted.',
    ],
    updated: UPDATED,
  },
  'innovator-founder': {
    id: 'innovator-founder',
    title: 'Innovator Founder Visa',
    tagline: 'Launch an innovative, viable and scalable UK business.',
    summary:
      'For experienced businesspeople setting up a business endorsed by an approved body. Replaced the old Start-up and Innovator visas in April 2023.',
    applyUrl: 'https://www.gov.uk/innovator-founder-visa',
    category: 'Work',
    fee: '£1,274 (outside UK) / £1,590 (inside UK)',
    ihs: '£1,035 / year',
    duration: '3 years, extendable indefinitely',
    processing: { outside: '3 weeks', inside: '8 weeks' },
    eligibility: [
      'Endorsement from an approved endorsing body (list updated annually on GOV.UK)',
      'Business idea is innovative, viable and scalable — assessed at endorsement',
      'English language B2 CEFR',
      'Sufficient personal savings (£1,270+, held 28 days)',
      'Contact points with endorsing body at 12 and 24 months',
    ],
    documents: [
      'Passport',
      'Endorsement letter',
      'Detailed business plan',
      'English language B2 certificate',
      'Bank statements',
    ],
    steps: [
      { title: 'Refine your business plan', desc: 'Focus on innovation (new product/service), viability, and scalability.' },
      { title: 'Get endorsed', desc: 'Pitch to an approved endorsing body — fees vary £1,000-£5,000.' },
      { title: 'Apply for visa', desc: 'Submit application within 3 months of endorsement.' },
      { title: 'Launch and meet contact points', desc: 'Build the business; attend review meetings at 12 and 24 months.' },
      { title: 'Settle', desc: 'Eligible for settlement after 3 years if business criteria are met.' },
    ],
    notes: [
      'No minimum investment funds — but endorsing bodies will test financial viability.',
      'Secondary employment permitted alongside running your business (skilled roles only).',
    ],
    updated: UPDATED,
  },
};

export const INTENT_TO_VISA: Record<string, string> = {
  work: 'skilled-worker',
  study: 'student',
  visit: 'visitor',
  family: 'family',
};
