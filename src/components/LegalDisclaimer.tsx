/**
 * LegalDisclaimer, YMYL disclaimer banner shown above-the-fold on
 * every visa, settlement and immigration article. Required by Google
 * Search Quality guidelines for Your-Money-or-Your-Life content.
 */

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

const INK     = '#0B0F19';
const SLATE   = '#475569';

interface Props {
  /** Optional override, defaults to a generic immigration disclaimer. */
  text?: string;
  /** Render as a card (default) or a compact inline strip. */
  variant?: 'card' | 'inline';
}

export default function LegalDisclaimer({
  text = 'Not legal advice. UKDesk is independent editorial research, we are not the Home Office, not gov.uk, and not OISC-regulated immigration advisers. For decisions specific to your case, consult a UK immigration solicitor (SRA-regulated) or an OISC adviser.',
  variant = 'card',
}: Props) {
  if (variant === 'inline') {
    return (
      <p className="text-[11.5px] leading-[1.55]" style={{ color: SLATE }}>
        <strong style={{ color: INK, fontWeight: 700 }}>Not legal advice.</strong>{' '}
        {text.replace('Not legal advice. ', '')}{' '}
        <Link href="/terms#disclaimer" className="underline font-semibold" style={{ color: INK }}>
          Read the full disclaimer
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
         style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)' }}>
      <span className="w-8 h-8 rounded-xl inline-flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(245,158,11,0.18)', color: '#92400e' }}>
        <ShieldAlert className="w-4 h-4" strokeWidth={2.2} />
      </span>
      <div className="flex-1">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-1.5"
           style={{ color: '#92400e' }}>
          Editorial, not legal advice
        </p>
        <p className="text-[12.5px] leading-[1.6]" style={{ color: '#5C3D10' }}>
          {text}{' '}
          <Link href="/terms#disclaimer" className="underline font-semibold" style={{ color: '#5C3D10' }}>
            Read the full disclaimer
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
