// Plain-English definitions for common UK immigration jargon.
export const GLOSSARY: Record<string, string> = {
  'BRP': 'Biometric Residence Permit — the old physical visa card, being phased out as all UK visas move to eVisas from 2026.',
  'eVisa': 'Digital proof of your immigration status, linked to your passport via a UKVI account. Replaces the BRP from 2026.',
  'CoS': 'Certificate of Sponsorship — a unique reference number your UK sponsor (employer) assigns you before you apply for a Skilled Worker visa.',
  'Certificate of Sponsorship': 'A unique reference number your UK sponsor (employer) assigns you before you apply for a Skilled Worker visa.',
  'IHS': 'Immigration Health Surcharge — annual fee paid alongside your visa that gives access to the NHS.',
  'Immigration Health Surcharge': 'Annual fee paid alongside your visa that gives access to the NHS. £1,035/year adult, £776/year student or dependant.',
  'ILR': 'Indefinite Leave to Remain — permanent settlement status, usually after 5–10 years of qualifying residence.',
  'Indefinite Leave to Remain': 'Permanent settlement status, usually after 5–10 years of qualifying residence.',
  'RQF': 'Regulated Qualifications Framework — the UK system for grading qualification levels. RQF 6 = Bachelor’s degree.',
  'SELT': 'Secure English Language Test — an approved provider test (e.g. IELTS for UKVI, PTE Academic UKVI).',
  'CEFR': 'Common European Framework of Reference for Languages. A1 (basic) → C2 (mastery). Most UK visas now require B1 or B2.',
  'B1': 'CEFR Intermediate level — can handle most travel situations and produce connected text on familiar topics.',
  'B2': 'CEFR Upper-Intermediate level — can interact with fluency and produce clear, detailed text on a wide range of subjects.',
  'ETA': 'Electronic Travel Authorisation — £16 pre-travel authorisation for visa-exempt visitors. Apply online, valid 2 years.',
  'ATAS': 'Academic Technology Approval Scheme — security clearance required for some postgraduate science/engineering courses.',
  'TB test': 'Tuberculosis screening required from applicants who have lived in specified countries for 6+ months.',
  'Priority service': '5 working-day decision upgrade — costs about £500 extra on top of the standard visa fee.',
  'Super Priority': 'Next-working-day decision upgrade — costs about £1,000 extra.',
  'CAS': 'Confirmation of Acceptance for Studies — the reference your education sponsor issues for a Student visa.',
  'Sponsor licence': 'A licence a UK employer or education provider must hold from the Home Office to sponsor migrants.',
  'Shortage Occupation List': 'Former concession list (replaced 2024 by the Immigration Salary List) offering reduced salary thresholds.',
  'Immigration Salary List': 'Replaces the Shortage Occupation List. A smaller set of roles eligible for a 20% salary-threshold discount.',
  'Dependant': 'A partner or child under 18 joining you on your visa.',
  'Biometrics': 'Fingerprints and a digital photo, collected at a Visa Application Centre or via the UK Immigration ID Check app.',
};

// Get canonical terms sorted by length (longest first) for greedy matching.
export const GLOSSARY_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
