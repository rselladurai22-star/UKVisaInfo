// Affiliate offer registry.
//
// Each entry is shown as a "Recommended tools" callout at the end of blog
// articles whose tags match the `matchTags` array. Update `url` with your
// real affiliate tracking link once you've signed up to each programme.
//
// Sign-up programmes (free):
//   - Wise:     https://wise.com/affiliates
//   - Magoosh:  https://magoosh.com/affiliates/
//   - Kaplan:   Awin / Impact / direct
//   - Currensea: Awin
//   - Remitly:  Impact Radius / Awin
//
// Until you sign up, links go to the public landing page (no commission yet
// but legally compliant; we mark them as "sponsored").

export interface AffiliateOffer {
  id: string;
  name: string;
  blurb: string;
  cta: string;
  url: string;
  /** Article tags that should show this offer. */
  matchTags: string[];
  /** Higher number wins when multiple match the same article. */
  priority: number;
}

export const AFFILIATES: AffiliateOffer[] = [
  {
    id: 'wise',
    name: 'Wise (TransferWise)',
    blurb:
      'Moving money to or from the UK for fees, deposits or living costs? Wise charges the real mid-market exchange rate with no markup — typically 5–8× cheaper than high-street banks for international transfers.',
    cta: 'Open a free Wise account',
    url: 'https://wise.com/invite/u/?utm_source=ukvisainfo',
    matchTags: [
      'Student visa',
      'Family visa',
      'Skilled Worker',
      'Health & Care',
      'Costs',
      'IHS',
      'Visitor visa',
      'Innovator Founder',
      'Graduate visa',
    ],
    priority: 10,
  },
  {
    id: 'magoosh-ielts',
    name: 'Magoosh IELTS Prep',
    blurb:
      'Need IELTS for your UK visa? Magoosh offers self-paced online IELTS prep with score improvement guarantee. Cheaper than classroom courses and used by 1M+ test-takers worldwide.',
    cta: 'See Magoosh IELTS plans',
    url: 'https://magoosh.com/ielts/?utm_source=ukvisainfo',
    matchTags: ['IELTS', 'English language', 'Student visa', 'Tests'],
    priority: 9,
  },
  {
    id: 'kaplan-english',
    name: 'Kaplan International English',
    blurb:
      'In-person and online English courses recognised for UK visa applications. Offers IELTS, OET and general English prep at centres across London, Manchester and online.',
    cta: 'Browse Kaplan English courses',
    url: 'https://www.kaplaninternational.com/?utm_source=ukvisainfo',
    matchTags: ['English language', 'IELTS', 'Tests'],
    priority: 7,
  },
  {
    id: 'currensea',
    name: 'Currensea',
    blurb:
      'A debit card linked to your existing UK current account that uses the real exchange rate for overseas spending. Useful for new arrivals waiting for a UK bank account.',
    cta: 'Apply for Currensea',
    url: 'https://www.currensea.com/?utm_source=ukvisainfo',
    matchTags: ['Costs', 'Visitor visa', 'Student visa', 'Skilled Worker'],
    priority: 5,
  },
];

/** Return the top N affiliate offers relevant to a set of article tags. */
export function pickAffiliates(tags: string[], max = 2): AffiliateOffer[] {
  const matches = AFFILIATES.filter((a) =>
    a.matchTags.some((t) => tags.includes(t))
  );
  // Deduplicate by id (just in case), sort by priority desc
  const sorted = [...new Map(matches.map((a) => [a.id, a])).values()].sort(
    (a, b) => b.priority - a.priority
  );
  return sorted.slice(0, max);
}
