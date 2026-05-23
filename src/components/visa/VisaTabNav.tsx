'use client';

/**
 * VisaTabNav — sticky section anchor nav (Editorial Premium)
 * Cream surface, hairline rule, ink labels, emerald active state.
 */

import { useEffect, useState } from 'react';

export interface Tab { id: string; label: string }

const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const EMERALD = '#047857';
const SLATE   = '#475569';

export default function VisaTabNav({ tabs, accent }: { tabs: Tab[]; accent?: string }) {
  const activeColor = accent ?? EMERALD;
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? '');

  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;

    const visible = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        if (visible.size > 0) {
          const top = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0];
          setActiveId(top);
        }
      },
      { rootMargin: '-140px 0px -65% 0px', threshold: [0, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [tabs]);

  const onClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-[68px] md:top-[72px] z-30"
      style={{
        background: 'rgba(250,250,247,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(11,15,25,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 overflow-x-auto">
        <ul className="flex items-center gap-0 min-w-max">
          {tabs.map((t) => {
            const isActive = t.id === activeId;
            return (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  onClick={(e) => onClick(e, t.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className="relative inline-flex items-center h-12 px-4 transition-colors duration-100"
                  style={{
                    color: isActive ? INK : SLATE,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '-0.005em',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = INK; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = SLATE; }}
                >
                  {t.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-px h-[2px] rounded-full origin-left transition-transform duration-200"
                    style={{
                      background: activeColor,
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
