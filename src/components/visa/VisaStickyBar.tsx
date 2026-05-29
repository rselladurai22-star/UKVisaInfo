'use client';

/**
 * VisaStickyBar — slides down from below the main nav after scroll.
 * Editorial Premium: cream surface, Fraunces title, emerald accent dot,
 * ink-on-cream apply button.
 */

import { useEffect, useState } from 'react';
import { ExternalLink, Calculator } from 'lucide-react';
import Link from 'next/link';

const INK     = '#18181B';
const CREAM   = '#FFFFFF';
const EMERALD = '#6366F1';
const SLATE   = '#3F3F46';
const MUTED   = '#52525B';

interface Props {
  title: string;
  fee: string;
  applyUrl: string;
  accent?: string;
  slug: string;
}

export default function VisaStickyBar({ title, fee, applyUrl, accent, slug }: Props) {
  const dot = accent ?? EMERALD;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        setShown(window.scrollY > 420);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className="fixed left-0 right-0 z-30 top-[68px] md:top-[72px] transition-[transform,opacity] duration-200 ease-out"
      style={{
        transform: shown ? 'translateY(0)' : 'translateY(-100%)',
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(250,250,247,0.94)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(26,31,54,0.08)',
          boxShadow: '0 1px 14px -6px rgba(26,31,54,0.10)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 h-[56px] flex items-center gap-3">
          <span aria-hidden className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
          <div className="flex-1 min-w-0">
            <div
              className="leading-none truncate"
              style={{
                fontFamily: '"Inter Tight", Inter, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: '-0.018em',
                color: INK,
              }}
            >
              {title}
            </div>
            <div className="mt-1 text-[11.5px] tabular-nums truncate hidden sm:block"
                 style={{ color: MUTED, fontFamily: 'Inter, system-ui, sans-serif' }}>
              From {extractFirstFee(fee)}
            </div>
          </div>

          <Link
            href={`/tools/cost-calculator?visa=${slug}`}
            className="hidden md:inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg transition-colors duration-75"
            style={{ color: SLATE }}
            onMouseEnter={(e) => { e.currentTarget.style.color = INK; e.currentTarget.style.background = 'rgba(26,31,54,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = SLATE; e.currentTarget.style.background = 'transparent'; }}
          >
            <Calculator className="w-3.5 h-3.5" />
            Calculate cost
          </Link>

          <a
            href={applyUrl}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[12.5px] px-4 py-2 rounded-lg active:scale-[0.98] transition-all duration-100"
            style={{
              background: INK,
              color: CREAM,
              boxShadow: '0 2px 12px -2px rgba(26,31,54,0.30)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = EMERALD; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = INK; }}
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
