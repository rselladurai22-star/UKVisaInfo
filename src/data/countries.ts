/**
 * Country-specific UK visa data for the /from/[country] landing pages.
 *
 * These pages target the highest-volume "UK visa for X" searches.
 * Each country needs: routes that apply, common requirements, embassy
 * locations, processing notes, and recent rule changes.
 *
 * Start with a small set of fully-written pages, then expand as time
 * allows. Search volume estimates: India 40k+/mo, Nigeria 18k+/mo,
 * Pakistan 14k+/mo, Philippines 9k+/mo, Bangladesh 7k+/mo.
 */

export interface CountryGuide {
  code: string;             // ISO-like slug used in URL
  flag: string;
  name: string;
  demonym: string;          // "Indian", "Nigerian", "Pakistani", used in copy
  /** Short tagline shown in hero */
  tagline: string;
  /** Whether the country is on the TB-test list */
  tbTest: boolean;
  /** Whether nationals need an ETA */
  etaRequired: boolean;
  /** Top visa routes used by this country */
  topRoutes: { slug: string; title: string; reason: string }[];
  /** Common application centres (VFS Global locations) */
  applicationCentres: string[];
  /** Country-specific notes / requirements */
  notes: string[];
  /** Long-form intro paragraph */
  intro: string;
  /** Most relevant blog posts */
  recommendedReads?: string[];
  /** Status, 'full' if written end-to-end, 'stub' if needs expansion */
  status: 'full' | 'stub';
}

export const COUNTRIES: Record<string, CountryGuide> = {
  india: {
    code: 'india',
    flag: '🇮🇳',
    name: 'India',
    demonym: 'Indian',
    tagline: 'The largest non-EU source of UK visa applicants, over 250,000 grants in 2025.',
    tbTest: true,
    etaRequired: false,
    intro: `India is the single biggest source of UK work and study visas. In 2025 the UK granted over 250,000 visas to Indian nationals, more than China, Nigeria and Pakistan combined. The top routes are Skilled Worker (especially IT and Health & Care), Student visas at Russell Group universities, and Visitor visas for tourism and business. If you're applying from India, you'll need a TB test certificate, biometric enrolment at a VFS centre, and supporting documents in English or with certified translations.`,
    topRoutes: [
      { slug: 'skilled-worker', title: 'Skilled Worker', reason: 'IT, engineering and care roles dominate Indian applications.' },
      { slug: 'student',        title: 'Student',        reason: 'Top destination at Russell Group universities, 100k+ Indian students in the UK.' },
      { slug: 'visitor',        title: 'Standard Visitor', reason: 'Used for family visits, tourism and short business trips.' },
      { slug: 'family',         title: 'Family / Spouse', reason: 'Joining settled partners or family members in the UK.' },
      { slug: 'health',         title: 'Health & Care',   reason: 'Care workers and NHS nurses on the dedicated route.' },
    ],
    applicationCentres: [
      'New Delhi (Shivaji Stadium)', 'Mumbai (Vile Parle East)', 'Bengaluru (Whitefield)',
      'Chennai (Anna Salai)', 'Kolkata (Park Street)', 'Hyderabad (Kondapur)',
      'Chandigarh', 'Ahmedabad', 'Pune', 'Goa', 'Jalandhar', 'Cochin',
    ],
    notes: [
      'TB test is mandatory for any visa over 6 months, book at an IOM-approved clinic before applying.',
      'Documents in regional languages need certified English translations by a UK Embassy-recognised translator.',
      'Biometric appointments fill up fast at Delhi and Mumbai, book 2-4 weeks in advance, especially before the September student-visa peak.',
      'Indian-issued bank statements must show 28+ days of consecutive balance, fixed deposits alone are not accepted for Student route.',
      'Priority service available at all 12 VFS centres, 5 working days for £500 extra.',
      'No ETA required: Indian nationals always need a full visa, even for short visits.',
    ],
    recommendedReads: [
      'uk-skilled-worker-visa-salary-threshold-2026',
      'uk-skilled-worker-sponsor-licence-how-to-find-2026',
      'uk-graduate-visa-2026-no-sponsor-needed',
    ],
    status: 'full',
  },

  nigeria: {
    code: 'nigeria', flag: '🇳🇬', name: 'Nigeria', demonym: 'Nigerian',
    tagline: 'A major source for Skilled Worker, Student and Family visa applications.',
    tbTest: true, etaRequired: false,
    intro: `Nigeria is one of the top non-Commonwealth sources of UK visas. Skilled Worker (especially Health & Care), Student, and Family routes lead the volume. Applicants need a TB test, certified English translations of any non-English documents, and biometrics at Abuja or Lagos VFS centres. Refusal rates are higher than average, strong financial evidence and clear ties to Nigeria are critical for Visitor visas.`,
    topRoutes: [
      { slug: 'skilled-worker', title: 'Skilled Worker', reason: 'IT and engineering professionals.' },
      { slug: 'health',         title: 'Health & Care',   reason: 'NHS nurses and care workers.' },
      { slug: 'student',        title: 'Student',         reason: 'Postgraduate programmes especially.' },
      { slug: 'visitor',        title: 'Standard Visitor', reason: 'Family visits and business meetings.' },
    ],
    applicationCentres: ['Abuja', 'Lagos (Victoria Island)', 'Lagos (Lekki)'],
    notes: [
      'TB test required for all visas over 6 months, IOM Lagos or Abuja.',
      'Strong evidence of ties to Nigeria critical for Visitor visa approval (employment letter, property, family).',
      'Bank statements must show genuine, consistent activity, large unexplained deposits frequently refused.',
      'Care worker route (Health & Care) closed to new overseas applications from March 2025.',
    ],
    status: 'stub',
  },

  pakistan: {
    code: 'pakistan', flag: '🇵🇰', name: 'Pakistan', demonym: 'Pakistani',
    tagline: 'Top source for Student, Family and Skilled Worker visas in South Asia.',
    tbTest: true, etaRequired: false,
    intro: `Pakistan ranks consistently in the top 5 source countries for UK visas. The Student route is especially popular, followed by Family / Spouse visas and Skilled Worker. Applications go through VFS centres in Islamabad, Karachi, Lahore and Mirpur. A TB test is mandatory and applicants typically need to demonstrate strong ties to Pakistan and clear financial evidence.`,
    topRoutes: [
      { slug: 'student',        title: 'Student',         reason: 'Postgraduate enrolments at UK universities.' },
      { slug: 'family',         title: 'Family / Spouse', reason: 'Spouse and partner reunification.' },
      { slug: 'skilled-worker', title: 'Skilled Worker',  reason: 'Healthcare and IT professionals.' },
      { slug: 'visitor',        title: 'Standard Visitor', reason: 'Family visits and business.' },
    ],
    applicationCentres: ['Islamabad', 'Karachi', 'Lahore', 'Mirpur'],
    notes: [
      'TB test mandatory for all visas over 6 months.',
      'Mirpur AJK has a separate VFS centre serving the Kashmir region.',
      'Family visa applicants must meet the £29,000 minimum income threshold.',
    ],
    status: 'stub',
  },

  philippines: {
    code: 'philippines', flag: '🇵🇭', name: 'the Philippines', demonym: 'Filipino',
    tagline: 'Major source for NHS Health & Care workers and seafarer visas.',
    tbTest: true, etaRequired: false,
    intro: `Filipino nationals are a key source of UK NHS staff, particularly registered nurses and care workers. Health & Care visa applications dominate, followed by Student and Visitor routes. Applications are processed at the VFS centre in Makati, Manila.`,
    topRoutes: [
      { slug: 'health',         title: 'Health & Care',   reason: 'Nurses, midwives and care workers in the NHS.' },
      { slug: 'skilled-worker', title: 'Skilled Worker',  reason: 'IT and finance roles.' },
      { slug: 'student',        title: 'Student',         reason: 'Postgraduate study.' },
    ],
    applicationCentres: ['Manila (Makati)', 'Cebu'],
    notes: [
      'TB test mandatory at IOM Manila for all visas over 6 months.',
      'Health & Care visa eligible for £25,000 minimum or going rate, whichever is higher.',
      'Care worker route closed to new overseas applications from March 2025, nursing route remains open.',
    ],
    status: 'stub',
  },

  bangladesh: {
    code: 'bangladesh', flag: '🇧🇩', name: 'Bangladesh', demonym: 'Bangladeshi',
    tagline: 'Major source for Student, Family and Skilled Worker visas.',
    tbTest: true, etaRequired: false,
    intro: `Bangladesh is a significant source country for UK visas, particularly Student and Family routes. The British High Commission in Dhaka coordinates applications through VFS centres in Dhaka, Chittagong and Sylhet.`,
    topRoutes: [
      { slug: 'student',        title: 'Student',         reason: 'Postgraduate study.' },
      { slug: 'family',         title: 'Family / Spouse', reason: 'Spouse and partner reunification.' },
      { slug: 'visitor',        title: 'Standard Visitor', reason: 'Family visits.' },
      { slug: 'skilled-worker', title: 'Skilled Worker',  reason: 'Healthcare professionals.' },
    ],
    applicationCentres: ['Dhaka', 'Chittagong', 'Sylhet'],
    notes: [
      'TB test mandatory at IOM-approved clinic.',
      'English-translated documents required for all non-English documents.',
    ],
    status: 'stub',
  },

  china: {
    code: 'china', flag: '🇨🇳', name: 'China', demonym: 'Chinese',
    tagline: 'Largest source of UK Student visas, over 100,000 applicants per year.',
    tbTest: false, etaRequired: false,
    intro: `China remains the single biggest source of UK Student visas. Most applicants are headed to Russell Group universities for undergraduate or master\'s programmes. Skilled Worker and Visitor routes are also common. Applications are processed through VFS centres in Beijing, Shanghai, Guangzhou and Chongqing.`,
    topRoutes: [
      { slug: 'student',        title: 'Student',         reason: 'Largest Student visa source country.' },
      { slug: 'graduate',       title: 'Graduate',        reason: '18-month post-study route.' },
      { slug: 'skilled-worker', title: 'Skilled Worker',  reason: 'Finance, IT and engineering roles.' },
      { slug: 'visitor',        title: 'Standard Visitor', reason: 'Business and tourism.' },
    ],
    applicationCentres: ['Beijing', 'Shanghai', 'Guangzhou', 'Chongqing', 'Shenyang', 'Wuhan', 'Hangzhou'],
    notes: [
      'No TB test required.',
      'Financial evidence in CNY must be converted to GBP using OANDA closing rates from the application date.',
      'Tier 4 priority service available at all centres.',
    ],
    status: 'stub',
  },

  usa: {
    code: 'usa', flag: '🇺🇸', name: 'the United States', demonym: 'American',
    tagline: 'Visa-exempt for short visits, ETA required from 2026.',
    tbTest: false, etaRequired: true,
    intro: `US citizens do not need a visa to enter the UK for visits up to 6 months, but from 2026 must apply for an Electronic Travel Authorisation (ETA) before travelling. For longer stays, work, study, family, a full visa is required. Skilled Worker and Student routes are the most common long-stay applications from the US.`,
    topRoutes: [
      { slug: 'visitor',        title: 'Visitor (ETA)',   reason: 'Short visits up to 6 months, ETA only, no full visa.' },
      { slug: 'skilled-worker', title: 'Skilled Worker',  reason: 'Tech, finance and creative-industry roles.' },
      { slug: 'student',        title: 'Student',         reason: 'Postgraduate programmes especially.' },
      { slug: 'talent',         title: 'Global Talent',   reason: 'Endorsed leaders in tech, arts, science.' },
    ],
    applicationCentres: ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Houston', 'Washington DC'],
    notes: [
      'ETA required from 2026 for all short visits, costs £20, valid 2 years.',
      'No TB test required.',
      'US-issued documents accepted without translation if in English.',
      'Some VFS centres charge significantly higher biometric fees in the US.',
    ],
    status: 'stub',
  },

  'south-africa': {
    code: 'south-africa', flag: '🇿🇦', name: 'South Africa', demonym: 'South African',
    tagline: 'Major source for Skilled Worker, Visitor and Ancestry visas.',
    tbTest: false, etaRequired: true,
    intro: `South African nationals are a significant source of UK visas, including the unique UK Ancestry visa for Commonwealth citizens with a UK-born grandparent. Skilled Worker, Visitor and Family routes are common. From 2026 ETAs are required for visa-free short visits.`,
    topRoutes: [
      { slug: 'ancestry',       title: 'UK Ancestry',     reason: 'Commonwealth route with UK grandparent, exclusive to South Africa and a few others.' },
      { slug: 'skilled-worker', title: 'Skilled Worker',  reason: 'IT, finance and healthcare roles.' },
      { slug: 'visitor',        title: 'Visitor (ETA)',   reason: 'ETA required from 2026.' },
      { slug: 'family',         title: 'Family / Spouse', reason: 'Spouse reunification.' },
    ],
    applicationCentres: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'],
    notes: [
      'No TB test required.',
      'ETA required for short visits from 2026.',
      'UK Ancestry visa requires proof of grandparent born in UK, Channel Islands or Isle of Man.',
    ],
    status: 'stub',
  },
};

export function getCountry(slug: string): CountryGuide | undefined {
  return COUNTRIES[slug];
}
