/**
 * AffiliateDisclosure — single-line FTC/UK ASA-compliant disclosure.
 * Drop above any block containing affiliate links so the relationship
 * is obvious before the user clicks.
 *
 * Compliant per:
 *   • FTC .com Disclosures (clear, conspicuous, near the endorsement)
 *   • UK ASA CAP Code rule 3.1 (advertising must be obviously identifiable)
 *   • Google's "sponsored / nofollow" link attribute requirements
 *
 *   <AffiliateDisclosure />               // default phrasing
 *   <AffiliateDisclosure compact />        // minimal "Ad" tag
 *   <AffiliateDisclosure variant="inline" /> // sits inline with text
 */

import { Info } from 'lucide-react';

interface Props {
  /** Compact variant — just shows "Ad · why" pill. */
  compact?: boolean;
  /** Layout variant — default is block, inline sits with surrounding text. */
  variant?: 'block' | 'inline';
}

export default function AffiliateDisclosure({ compact = false, variant = 'block' }: Props) {
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider"
        style={{
          background: '#F7F8FA',
          color: '#697386',
          border: '1px solid #E3E8EE',
          padding: '2px 7px',
          borderRadius: 6,
          letterSpacing: '0.04em',
        }}
        title="Affiliate links on this page — we may earn a commission at no extra cost to you"
      >
        Ad
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <span className="text-[11.5px] italic" style={{ color: '#697386' }}>
        Some links below are affiliate links — we may earn a commission at no extra cost to you.
        This never influences our editorial.
      </span>
    );
  }

  return (
    <div
      role="note"
      aria-label="Affiliate disclosure"
      className="flex items-start gap-2 my-3"
      style={{
        background: '#F7F8FA',
        border: '1px solid #E3E8EE',
        borderLeft: '3px solid #8792A2',
        borderRadius: 8,
        padding: '9px 12px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 12.5,
        color: '#3C4257',
        lineHeight: 1.55,
      }}
    >
      <Info size={13} strokeWidth={2.2} color="#697386" style={{ flexShrink: 0, marginTop: 1 }} />
      <span>
        <strong style={{ fontWeight: 600 }}>Affiliate disclosure:</strong>{' '}
        Some links on this page are affiliate links. If you sign up via these links we may
        earn a small commission at no extra cost to you. This never influences our editorial —
        we only link to services we&apos;ve independently reviewed.
      </span>
    </div>
  );
}
