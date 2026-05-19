'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Calculator } from 'lucide-react';
import Link from 'next/link';

interface Props {
  title: string;
  fee: string;
  applyUrl: string;
  accent: string;
  slug: string;
}

/**
 * Slides down from below the main nav once the user scrolls past the
 * hero. Gives one-tap access to "Apply on gov.uk" + the cost calculator
 * deep-link, without re-introducing the busy floating-CTA pattern.
 * Pure CSS reveal via translateY + opacity.
 */
export default function VisaStickyBar({ title, fee, applyUrl, accent, slug }: Props) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        setShown(window.scrollY > 380);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className={`
        fixed left-0 right-0 z-30
        top-[60px] md:top-[64px]
        transition-[transform,opacity] duration-200 ease-out
        ${shown ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
      `}
    >
      <div
        className="bg-white/95 backdrop-blur border-b border-[rgba(14,20,36,0.06)]"
        style={{ boxShadow: '0 1px 8px rgba(10, 37, 64,0.04)' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-[52px] flex items-center gap-3">
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: accent }}
          />
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-[13.5px] text-[#0A2540] tracking-tight leading-none truncate">
              {title}
            </div>
            <div className="mt-1 text-[11px] text-[#52596e] tabular-nums truncate hidden sm:block">
              From {extractFirstFee(fee)}
            </div>
          </div>

          <Link
            href={`/tools/cost-calculator?visa=${slug}`}
            className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#52596e] hover:text-[#0A2540] transition-colors duration-75 px-3 py-1.5 rounded-lg hover:bg-[#f3f5fb]"
          >
            <Calculator className="w-3.5 h-3.5" />
            Calculate cost
          </Link>

          <a
            href={applyUrl}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white font-bold text-[12.5px] px-4 py-2 rounded-full active:scale-[0.98] transition-transform duration-100"
            style={{ background: accent, boxShadow: `0 4px 14px ${accent}40` }}
          >
            Apply on gov.uk
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function extractFirstFee(s: string): string {
  const m = s.match(/£[\d,]+/);
  return m ? m[0] : s;
}
