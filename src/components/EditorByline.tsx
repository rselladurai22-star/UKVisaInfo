/**
 * EditorByline — named-human byline shown on every YMYL article
 * (visa pages, blog posts, calculators with explanatory content).
 *
 * Surfaces: editor name + role + last-verified date + link to /about
 * profile + link to /editorial-policy. Builds E-E-A-T signal Google's
 * quality raters require for finance / legal / health content.
 */

import Link from 'next/link';
import { ShieldCheck, ExternalLink, Mail } from 'lucide-react';
import { PRIMARY_EDITOR } from '../data/editorialTeam';

const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const PAPER   = '#FFFFFF';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  /** Human-readable last-verified label (e.g. "April 2026" or "19 May 2026"). */
  verified: string;
  /** Optional override label for "By" — defaults to "Written & verified by". */
  prefix?: string;
  /** Use a compact variant for sidebar use. */
  compact?: boolean;
}

export default function EditorByline({ verified, prefix = 'Written & verified by', compact = false }: Props) {
  const e = PRIMARY_EDITOR;

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 text-[12px]" style={{ color: SLATE }}>
        <span aria-hidden
              className="w-7 h-7 rounded-full inline-flex items-center justify-center text-[10.5px] font-bold tabular-nums flex-shrink-0"
              style={{ background: INK, color: CREAM, fontFamily: 'Fraunces, serif', letterSpacing: '-0.01em' }}>
          {e.initials}
        </span>
        <span>
          By <Link href={e.profileUrl} className="font-semibold underline-offset-2 hover:underline" style={{ color: INK }}>{e.name}</Link>
          {' · '}
          <span style={{ color: MUTED }}>verified {verified}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden"
         style={{ background: PAPER, border: `1px solid ${HAIR}` }}>
      <div className="px-5 py-4 flex items-start gap-4">
        <span aria-hidden
              className="w-11 h-11 rounded-xl inline-flex items-center justify-center text-[14px] font-bold flex-shrink-0"
              style={{ background: INK, color: CREAM, fontFamily: 'Fraunces, serif', letterSpacing: '-0.012em' }}>
          {e.initials}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-1.5"
             style={{ color: GOLD }}>
            {prefix}
          </p>
          <p className="text-[14.5px] font-semibold" style={{ color: INK }}>
            <Link href={e.profileUrl} className="hover:underline">{e.name}</Link>
            <span className="font-normal" style={{ color: SLATE }}> — {e.role}</span>
          </p>
          <p className="mt-1.5 text-[12.5px] leading-[1.55]" style={{ color: SLATE }}>
            {e.scope}
          </p>
        </div>
      </div>

      <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3"
           style={{ background: CREAM, borderTop: `1px solid ${HAIR}` }}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: EMERALD }}>
            <ShieldCheck className="w-3 h-3" />
            Verified against gov.uk · {verified}
          </span>
          <span style={{ color: MUTED }}>·</span>
          <Link href="/editorial-policy"
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold transition-colors"
                style={{ color: SLATE }}>
            Editorial policy
          </Link>
        </div>
        <a href={`mailto:${e.email}?subject=Correction%3A%20`}
           className="inline-flex items-center gap-1 text-[11px] font-semibold"
           style={{ color: SLATE }}>
          <Mail className="w-3 h-3" />
          Suggest a correction
        </a>
      </div>
    </div>
  );
}
