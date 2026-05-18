'use client';

import { useEffect, useState } from 'react';

export interface Tab { id: string; label: string }

export default function VisaTabNav({ tabs, accent }: { tabs: Tab[]; accent: string }) {
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
      { rootMargin: '-120px 0px -65% 0px', threshold: [0, 1] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [tabs]);

  const onClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-[60px] md:top-[64px] z-30 bg-white/92 backdrop-blur border-b border-[rgba(14,20,36,0.07)]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-auto">
        <ul className="flex items-center gap-0 min-w-max">
          {tabs.map((t) => {
            const isActive = t.id === activeId;
            return (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  onClick={(e) => onClick(e, t.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative inline-flex items-center h-12 px-3.5 text-[13px] font-semibold transition-colors duration-75 ${
                    isActive ? 'text-[#0a1530]' : 'text-[#7a8195] hover:text-[#0a1530]'
                  }`}
                >
                  {t.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-1.5 -bottom-px h-[2px] rounded-full origin-left transition-transform duration-200 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    style={{ background: accent }}
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
