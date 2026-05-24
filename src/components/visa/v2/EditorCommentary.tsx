/**
 * EditorCommentary — original editorial analysis per visa route.
 *
 * Displays the three commentary sections from visaCommentary.ts:
 *   1. What makes this route hard
 *   2. Who actually qualifies in practice
 *   3. What gov.uk doesn't spell out
 *
 * Visually distinct from data-driven sections (eligibility, costs) —
 * this is opinion / synthesis, marked as editorial.
 */

import { Sparkles, Quote } from 'lucide-react';
import Link from 'next/link';
import { PRIMARY_EDITOR } from '../../../data/editorialTeam';
import type { VisaCommentary } from '../../../data/visaCommentary';

const INK     = '#0B0F19';
const PAPER   = '#FFFFFF';
const CREAM   = '#FAFAF7';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

interface Props {
  commentary: VisaCommentary;
}

export default function EditorCommentary({ commentary }: Props) {
  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(11,15,25,0.08)' }}>

      {/* HEADER — distinct editorial styling */}
      <div className="px-6 md:px-8 py-5 flex items-start gap-4"
           style={{ background: CREAM, borderBottom: `1px solid ${HAIR}` }}>
        <span aria-hidden
              className="w-10 h-10 rounded-xl inline-flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(184,134,11,0.14)', color: GOLD }}>
          <Quote className="w-4 h-4" strokeWidth={2.2} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-1"
             style={{ color: GOLD }}>
            Editor&apos;s analysis · original commentary
          </p>
          <p className="text-[14px] leading-[1.55]" style={{ color: INK, fontStyle: 'italic' }}>
            &ldquo;{commentary.takeaway}&rdquo;
          </p>
          <p className="mt-2 text-[11.5px]" style={{ color: SLATE }}>
            By{' '}
            <Link href={PRIMARY_EDITOR.profileUrl}
                  className="font-semibold underline-offset-2 hover:underline"
                  style={{ color: INK }}>
              {PRIMARY_EDITOR.name}
            </Link>
            {' · '}
            <Link href="/editorial-policy" className="hover:underline" style={{ color: SLATE }}>
              How we research
            </Link>
          </p>
        </div>
      </div>

      {/* THREE SECTIONS */}
      <div className="divide-y" style={{ borderColor: HAIR }}>
        {commentary.sections.map((s, i) => (
          <Section key={s.id} index={i + 1} title={s.title} body={s.body} />
        ))}
      </div>

      {/* FOOTER */}
      <div className="px-6 md:px-8 py-3.5 flex items-center justify-between gap-3 flex-wrap"
           style={{ background: CREAM, borderTop: `1px solid ${HAIR}` }}>
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em]"
              style={{ color: EMERALD }}>
          <Sparkles className="w-3 h-3" strokeWidth={2.5} />
          Editorial — not legal advice
        </span>
        <a href={`mailto:${PRIMARY_EDITOR.email}?subject=Comment%20on%20commentary`}
           className="text-[11px] font-semibold transition-colors"
           style={{ color: SLATE }}>
          Disagree? Email the editor →
        </a>
      </div>
    </div>
  );
}

function Section({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <article className="px-6 md:px-8 py-6"
             style={{ borderTop: index === 1 ? 'none' : `1px solid ${HAIR}` }}>
      <div className="flex items-baseline gap-3 mb-3">
        <span aria-hidden
              className="text-[12px] tabular-nums font-bold"
              style={{ color: GOLD, fontFamily: 'Fraunces, serif', letterSpacing: '-0.012em' }}>
          0{index}.
        </span>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18, letterSpacing: '-0.018em', color: INK, lineHeight: 1.15 }}>
          {title}
        </h3>
      </div>
      <p className="text-[14px] leading-[1.75]" style={{ color: INK }}>
        {body}
      </p>
    </article>
  );
}
