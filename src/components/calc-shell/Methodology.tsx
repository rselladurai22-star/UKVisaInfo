/**
 * Methodology — small primitive shown on calculator pages explaining
 * "How we calculate this". Links the relevant gov.uk source, the master
 * /sources page, and the /editorial-policy. Builds E-E-A-T signal for
 * YMYL (Your Money or Your Life) content.
 *
 *   <Methodology
 *     govUrl="https://www.gov.uk/marriage-allowance"
 *     govLabel="gov.uk · Marriage Allowance"
 *     summary="We apply the 2026/27 transfer amount (£1,260) at the basic
 *              rate (20%) to compute annual saving, then add eligible
 *              backdated years (up to 4 prior tax years)."
 *   />
 */

import Link from 'next/link';
import { BookOpen, ExternalLink } from 'lucide-react';

interface Props {
  /** Plain-English description of the calculation method. */
  summary: string;
  /** Canonical gov.uk URL the rules are taken from. Optional for generic
   *  fallback blocks; bespoke pages should always set this. */
  govUrl?: string;
  /** Display label for the gov.uk link. Defaults to the URL. */
  govLabel?: string;
}

const Q = {
  surface:    '#FFFFFF',
  bgAlt:      '#FAFAFB',
  ink:        '#18181B',
  ink2:       '#3F3F46',
  mid:        '#52525B',
  mid2:       '#6B7280',
  border:     '#ECECEF',
  accent:     '#6366F1',
  accentDk:   '#4F46E5',
  accentSoft: '#EEF2FF',
};

const DISPLAY = 'var(--font-grotesk), "Inter Tight", Inter, system-ui, sans-serif';
const TEXT    = 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif';

export default function Methodology({ summary, govUrl, govLabel }: Props) {
  return (
    <section
      aria-label="How we calculate this"
      style={{
        background: Q.surface,
        border: `1px solid ${Q.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        margin: '24px 0 16px',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 16px',
          background: Q.bgAlt,
          borderBottom: `1px solid ${Q.border}`,
        }}
      >
        <BookOpen size={13} strokeWidth={2.4} color={Q.accent} />
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 13,
            fontWeight: 600,
            color: Q.ink,
            letterSpacing: '-0.01em',
          }}
        >
          How we calculate this
        </span>
      </header>

      <div style={{ padding: '14px 16px' }}>
        <p
          style={{
            fontFamily: TEXT,
            fontSize: 13.5,
            color: Q.ink2,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {summary}
        </p>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            alignItems: 'center',
            fontFamily: TEXT,
            fontSize: 12,
          }}
        >
          {govUrl && (
            <>
              <a
                href={govUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  color: Q.accentDk,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {govLabel ?? govUrl.replace(/^https?:\/\//, '')}
                <ExternalLink size={11} strokeWidth={2.4} />
              </a>

              <span style={{ color: Q.mid2 }}>·</span>
            </>
          )}

          <Link
            href="/sources"
            style={{
              color: Q.ink2,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            All sources
          </Link>

          <span style={{ color: Q.mid2 }}>·</span>

          <Link
            href="/editorial-policy"
            style={{
              color: Q.ink2,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Editorial policy
          </Link>
        </div>
      </div>
    </section>
  );
}
