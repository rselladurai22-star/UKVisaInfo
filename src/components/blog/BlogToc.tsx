'use client';

import { useEffect, useState } from 'react';

export interface TocHeading { id: string; text: string }

/**
 * On-brand (Clean Slate Blue) "On this page" table of contents.
 * Auto-built from the article's H2 headings; highlights the section in view.
 * Lives at the top of the sticky right sidebar on every standard post.
 */
export default function BlogToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (!headings.length) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const visible = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        if (visible.size) {
          const [topId] = [...visible.entries()].sort((a, b) => a[1] - b[1])[0];
          setActiveId(topId);
        }
      },
      { rootMargin: '-90px 0px -65% 0px', threshold: [0, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  const onClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav aria-label="Table of contents">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 mb-3">On this page</p>
      <ol className="space-y-0.5 border-l border-slate-200">
        {headings.map((h) => {
          const active = activeId === h.id;
          return (
            <li key={h.id} className="relative">
              <span
                aria-hidden
                className="absolute -left-px top-0 bottom-0 w-[2px] origin-top bg-blue-600 transition-transform duration-200"
                style={{ transform: active ? 'scaleY(1)' : 'scaleY(0)' }}
              />
              <a
                href={`#${h.id}`}
                onClick={(e) => onClick(e, h.id)}
                className={`block py-1.5 pl-4 pr-2 text-[13px] leading-snug transition-colors ${
                  active ? 'font-semibold text-blue-700' : 'text-slate-500 hover:text-blue-700'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
