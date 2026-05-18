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
      <div className="flex items-center gap-2 text-[#9aa3b8] text-[10.5px] font-bold uppercase tracking-[0.14em] mb-4">
        <List className="w-3 h-3" />
        On this page
      </div>
      <ul className="space-y-0.5 border-l border-[rgba(14,20,36,0.08)]">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className="relative">
              {/* active bar */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 bottom-0 w-[2px] -translate-x-[1px] bg-[#d9152b] origin-top transition-transform duration-200 ${
                  isActive ? 'scale-y-100' : 'scale-y-0'
                }`}
              />
              <a
                href={`#${h.id}`}
                onClick={(e) => handleClick(e, h.id)}
                className={`block py-1.5 pl-4 pr-2 leading-snug rounded-r-md transition-colors duration-100 ${
                  isActive
                    ? 'text-[#0a1530] font-semibold'
                    : 'text-[#7a8195] hover:text-[#0a1530]'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
