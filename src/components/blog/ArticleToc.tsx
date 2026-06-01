'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export interface Heading {
  id: string;
  text: string;
}

/**
 * Sticky table of contents that highlights the section currently in view.
 * One IntersectionObserver watches every H2 in the article.
 */
export default function ArticleToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (!headings.length) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);

    if (!elements.length) return;

    const visible = new Map<string, number>();

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible.set(e.target.id, e.boundingClientRect.top);
          } else {
            visible.delete(e.target.id);
          }
        }
        if (visible.size > 0) {
          // pick the heading closest to the top of viewport
          const sorted = [...visible.entries()].sort((a, b) => a[1] - b[1]);
          setActiveId(sorted[0][0]);
        }
      },
      { rootMargin: '-90px 0px -65% 0px', threshold: [0, 1] }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const y = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav aria-label="Table of contents" className="text-[13px]">
      {/* header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#0A2540] text-white">
          <List className="w-3 h-3" />
        </span>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#52596e]">
          On this page
        </span>
      </div>

      <ol className="space-y-0 border-l-2 border-[rgba(14,20,36,0.07)]">
        {headings.map((h, idx) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className="relative">
              {/* active indicator bar */}
              <span
                aria-hidden="true"
                className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00C4B4] to-[#C9A14A] origin-top transition-transform duration-200"
                style={{ transform: isActive ? 'scaleY(1)' : 'scaleY(0)' }}
              />
              <a
                href={`#${h.id}`}
                onClick={(e) => handleClick(e, h.id)}
                className={`flex items-start gap-2.5 py-2 pl-4 pr-2 leading-snug rounded-r-lg transition-all duration-150 ${
                  isActive
                    ? 'text-[#007a72] font-semibold bg-[rgba(0,196,180,0.05)]'
                    : 'text-[#8a94aa] hover:text-[#0A2540] hover:bg-[rgba(14,20,36,0.03)]'
                }`}
              >
                <span
                  className={`flex-shrink-0 mt-[3px] w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#00C4B4] text-white'
                      : 'bg-[rgba(14,20,36,0.06)] text-[#9aa3b8]'
                  }`}
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
                <span className="text-[12.5px] leading-[1.4]">{h.text}</span>
              </a>
            </li>
          );
        })}
      </ol>

      {/* progress hint */}
      <div className="mt-5 pt-4 border-t border-[rgba(14,20,36,0.07)]">
        <p className="text-[11px] text-[#b0b8cc] leading-snug">
          {headings.length} section{headings.length !== 1 ? 's' : ''} in this guide
        </p>
      </div>
    </nav>
  );
}
