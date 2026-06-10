/**
 * Affiliate offer registry.
 *
 * Each entry powers the "Recommended tools" callout at the end of blog
 * articles, and the sidebar slot in the right rail of blog posts. Offers
 * are filtered by `matchTags`, deduplicated, and sorted by `priority`.
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
      'Sending money abroad or paying for international costs? Wise charges the real mid-market exchange rate with no markup — typically 5–8× cheaper than high-street banks for international transfers. Free multi-currency account with UK sort code & account number.',
    cta: 'Open a free Wise account →',
    url: 'https://wise.com/gb/?utm_source=ukdesk&utm_medium=affiliate',
    matchTags: [
      'money', 'property', 'living', 'tax', 'moving', 'savings', 'travel',
    ],
    priority: 10,
    placeholder: true,
  },
  {
    id: 'remitly',
    name: 'Remitly — International money transfer',
    blurb:
      'Send money home or receive funds from family in a single business day. Lower fees than banks for one-off transfers, and £0 fee on your first transfer in most corridors. Useful alternative to Wise for cash pickup destinations.',
    cta: 'Send your first transfer →',
    url: 'https://www.remitly.com/?utm_source=ukdesk',
    matchTags: ['money', 'family', 'living', 'moving', 'costs'],
    priority: 6,
    placeholder: true,
  },
  {
    id: 'currensea',
    name: 'Currensea Travel Debit Card',
    blurb:
      'A debit card linked to your existing UK bank account that uses the real exchange rate for overseas spending. Save on bank fees when travelling or buying goods from abroad.',
    cta: 'Apply for Currensea →',
    url: 'https://www.currensea.com/?utm_source=ukdesk',
    matchTags: ['money', 'travel', 'savings', 'costs'],
    priority: 8,
    placeholder: true,
  },
];

/**
 * Return the top N affiliate offers relevant to a set of article tags.
 * Matching is case-insensitive.
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
