/**
 * Affiliate offer registry.
 *
 * Each entry powers the "Recommended tools" callout at the end of blog
 * articles, and the sidebar slot in the right rail of blog posts. Offers
 * are filtered by `matchTags`, deduplicated, and sorted by `priority`.
 *
 * ─────────────────────────────────────────────────────────────────────
 *  HOW TO ACTIVATE EACH PROGRAM (real money, paid quarterly/monthly)
 * ─────────────────────────────────────────────────────────────────────
 *
 *  1. WISE (money transfer)             ⭐ Highest fit for our audience
 *     Sign up:  https://wise.com/campaigns/en/affiliates
 *     Payout:   £5-80 per qualified signup (varies by destination)
 *     Replace:  the `url` on the 'wise' entry with your tracking link
 *               of the form https://wise.prf.hn/click/camref:[YOUR_ID]
 *
 *  2. SAFETYWING (health/travel insurance)
 *     Sign up:  https://safetywing.com/affiliates
 *     Payout:   10% recurring on every monthly premium
 *     Replace:  the `url` on 'safetywing' with your sw.tools link
 *
 *  3. MAGOOSH IELTS (test prep)
 *     Sign up:  https://magoosh.com/affiliates/
 *     Payout:   25% of sale (~$15-50 per signup)
 *     Replace:  the `url` on 'magoosh-ielts' with your Refersion link
 *
 *  4. E2 LANGUAGE (IELTS / OET / PTE prep)
 *     Sign up:  https://www.e2language.com/affiliate
 *     Payout:   30% recurring on subscription
 *
 *  5. KAPLAN INTERNATIONAL ENGLISH
 *     Sign up:  Through Awin (https://www.awin.com) — search Kaplan
 *     Payout:   8% of course fees (avg £80-200 per booking)
 *
 *  6. REMITLY (money transfer, alternative to Wise)
 *     Sign up:  Through Impact Radius (https://impact.com)
 *     Payout:   £15-40 per qualifying first transfer
 *
 *  7. PHOTOAID (passport photos online)
 *     Sign up:  https://photoaid.com/en/partners
 *     Payout:   20% per order (£2-5)
 *
 * ─────────────────────────────────────────────────────────────────────
 *  Until you sign up, the `url` field points to the public landing
 *  page so links are still legally compliant — they're marked
 *  rel="sponsored nofollow" so Google treats them as ads, not endorsements.
 *  You earn £0 from those clicks but you're not breaking any rules.
 * ─────────────────────────────────────────────────────────────────────
 */

export interface AffiliateOffer {
  id: string;
  name: string;
  blurb: string;
  cta: string;
  url: string;
  /** Article tags that should show this offer. Case-insensitive match. */
  matchTags: string[];
  /** Higher number wins when multiple match the same article. */
  priority: number;
  /** True until you've replaced the URL with your tracking link. */
  placeholder?: boolean;
}

export const AFFILIATES: AffiliateOffer[] = [
  {
    id: 'wise',
    name: 'Wise (formerly TransferWise)',
    blurb:
      'Moving money for visa fees, IHS, deposits or living costs? Wise charges the real mid-market exchange rate with no markup — typically 5–8× cheaper than high-street banks for international transfers. Free multi-currency account with UK sort code & account number.',
    cta: 'Open a free Wise account →',
    // TODO: replace with https://wise.prf.hn/click/camref:[YOUR_CAMREF]
    url: 'https://wise.com/gb/?utm_source=ukvisainfo&utm_medium=affiliate',
    matchTags: [
      'Skilled Worker', 'Student', 'Student visa', 'Family', 'Family visa',
      'Health & Care', 'Costs', 'IHS', 'Visitor', 'Visitor visa',
      'Innovator Founder', 'Graduate', 'Graduate visa', 'Sponsorship',
    ],
    priority: 10,
    placeholder: true,
  },
  {
    id: 'safetywing',
    name: 'SafetyWing — Visa-eligible health insurance',
    blurb:
      'Health insurance designed for students, remote workers and new arrivals. Meets UK visa health-coverage requirements for some routes, covers you globally from $45/month, and pays out within 5 days. Recurring monthly subscription — cancel anytime.',
    cta: 'See SafetyWing plans →',
    // TODO: replace with https://safetywing.com/insurance/nomad?referenceID=[YOUR_REF]
    url: 'https://safetywing.com/?referenceID=ukvisainfo',
    matchTags: [
      'Student', 'Student visa', 'Visitor', 'Visitor visa',
      'Graduate', 'Graduate visa', 'Family', 'IHS', 'Costs',
      'Skilled Worker', 'Innovator Founder',
    ],
    priority: 9,
    placeholder: true,
  },
  {
    id: 'magoosh-ielts',
    name: 'Magoosh IELTS Prep',
    blurb:
      'IELTS is required for most UK visa routes. Magoosh offers self-paced online prep with score-improvement guarantee — used by 1M+ test-takers and cheaper than classroom courses. Full mock tests, video lessons, and dedicated speaking/writing practice.',
    cta: 'See Magoosh IELTS plans →',
    // TODO: replace with your Refersion tracking link from magoosh.com/affiliates
    url: 'https://magoosh.com/ielts/?utm_source=ukvisainfo',
    matchTags: ['IELTS', 'English language', 'English', 'Student', 'Student visa', 'Tests'],
    priority: 8,
    placeholder: true,
  },
  {
    id: 'e2-language',
    name: 'E2 Language — IELTS / OET / PTE prep',
    blurb:
      'Specialist test prep for UKVI-approved English tests: IELTS Academic, OET (for nurses) and PTE Academic. Live classes, AI scoring on practice essays, and pass guarantee on premium plans.',
    cta: 'Browse E2 Language courses →',
    // TODO: e2language affiliate program once signed up
    url: 'https://www.e2language.com/?utm_source=ukvisainfo',
    matchTags: ['IELTS', 'OET', 'English language', 'English', 'Health & Care', 'Tests'],
    priority: 7,
    placeholder: true,
  },
  {
    id: 'kaplan-english',
    name: 'Kaplan International English',
    blurb:
      'In-person and online English courses recognised for UK visa English requirements. IELTS, OET and general English prep at centres across London, Manchester, Edinburgh and online.',
    cta: 'Browse Kaplan courses →',
    // TODO: replace with your Awin tracking link once Kaplan accepts you
    url: 'https://www.kaplaninternational.com/?utm_source=ukvisainfo',
    matchTags: ['English language', 'English', 'IELTS', 'Tests'],
    priority: 6,
    placeholder: true,
  },
  {
    id: 'remitly',
    name: 'Remitly — International money transfer',
    blurb:
      'Send money home or receive funds from family in a single business day. Lower fees than banks for one-off transfers, and £0 fee on your first transfer in most corridors. Useful alternative to Wise for cash pickup destinations.',
    cta: 'Send your first transfer →',
    // TODO: replace with your Impact Radius tracking link
    url: 'https://www.remitly.com/?utm_source=ukvisainfo',
    matchTags: ['Costs', 'IHS', 'Family', 'Family visa', 'Student', 'Student visa'],
    priority: 6,
    placeholder: true,
  },
  {
    id: 'photoaid',
    name: 'PhotoAiD — Online passport photos',
    blurb:
      'Take your UK biometric photo at home with your phone — PhotoAiD verifies it meets Home Office spec or refunds you. Cheaper than VFS centres and delivers a digital + printable version.',
    cta: 'Get your photo →',
    // TODO: replace with your partner link from photoaid.com/en/partners
    url: 'https://photoaid.com/en/photo-uk?utm_source=ukvisainfo',
    matchTags: [
      'Documents', 'Skilled Worker', 'Student', 'Student visa', 'Family',
      'Family visa', 'Visitor', 'Visitor visa', 'Graduate',
    ],
    priority: 5,
    placeholder: true,
  },
  {
    id: 'currensea',
    name: 'Currensea',
    blurb:
      'A debit card linked to your existing UK current account that uses the real exchange rate for overseas spending. Useful for new arrivals waiting for a UK bank account.',
    cta: 'Apply for Currensea →',
    // TODO: Awin tracking link
    url: 'https://www.currensea.com/?utm_source=ukvisainfo',
    matchTags: ['Costs', 'Visitor', 'Visitor visa', 'Student', 'Student visa', 'Skilled Worker'],
    priority: 4,
    placeholder: true,
  },
];

/**
 * Return the top N affiliate offers relevant to a set of article tags.
 * Matching is case-insensitive so author-written tags ("Student visa")
 * match registry tags ("Student visa", "student visa", etc.).
 */
export function pickAffiliates(tags: string[], max = 2): AffiliateOffer[] {
  const lowered = tags.map((t) => t.toLowerCase());
  const matches = AFFILIATES.filter((a) =>
    a.matchTags.some((t) => lowered.includes(t.toLowerCase()))
  );
  const sorted = [...new Map(matches.map((a) => [a.id, a])).values()].sort(
    (a, b) => b.priority - a.priority
  );
  return sorted.slice(0, max);
}
