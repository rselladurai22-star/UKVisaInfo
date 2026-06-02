'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Check } from 'lucide-react';

type Tab = { id: string; title: string; count: number };
type Cat = { id: string; label: string; color: string };

export default function HubNav({
  tabs,
  categories,
  currentId,
  currentLabel,
  currentColor,
}: {
  tabs: Tab[];
  categories: Cat[];
  currentId: string;
  currentLabel: string;
  currentColor: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const switchRef = useRef<HTMLDivElement>(null);

  // Scroll-spy: highlight whichever section is closest to the top of the viewport.
  useEffect(() => {
    if (!tabs.length) return;
    const els = tabs
      .map((t) => document.getElementById(`sec-${t.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace('sec-', ''));
      },
      { rootMargin: '-140px 0px -65% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [tabs]);

  // Close the switcher on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (switchRef.current && !switchRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="sticky top-[70px] z-40 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        {/* Tabs */}
        <div
          className="-mx-2 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {tabs.map((t) => {
            const isActive = active === t.id;
            return (
              <a
                key={t.id}
                href={`#sec-${t.id}`}
                className={[
                  'group inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                  isActive
                    ? 'bg-primary text-surface-container-lowest'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary',
                ].join(' ')}
              >
                {t.title}
                <span
                  className={[
                    'inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums',
                    isActive
                      ? 'bg-surface-container-lowest/20 text-surface-container-lowest'
                      : 'bg-surface-container text-on-surface-variant group-hover:bg-surface-container-high',
                  ].join(' ')}
                >
                  {t.count}
                </span>
              </a>
            );
          })}
        </div>

        {/* Category switcher */}
        <div className="relative flex-none" ref={switchRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-container-lowest px-3.5 py-1.5 text-xs font-semibold text-primary transition hover:border-border-strong"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: currentColor }}
              aria-hidden
            />
            <span className="hidden sm:inline">{currentLabel}</span>
            <span className="sm:hidden">Switch</span>
            <ChevronDown
              className="h-3.5 w-3.5 transition"
              style={{ transform: open ? 'rotate(180deg)' : 'none' }}
            />
          </button>

          {open && (
            <div
              role="listbox"
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 origin-top-right rounded-2xl border border-border bg-surface-container-lowest p-2 shadow-lg"
            >
              <p className="px-2.5 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                Jump to category
              </p>
              {categories.map((cat) => {
                const isCurrent = cat.id === currentId;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setOpen(false)}
                    role="option"
                    aria-selected={isCurrent}
                    className={[
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition',
                      isCurrent
                        ? 'bg-surface-container text-primary'
                        : 'text-on-surface hover:bg-surface-container-low',
                    ].join(' ')}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: cat.color }}
                      aria-hidden
                    />
                    <span className="flex-1">{cat.label}</span>
                    {isCurrent && <Check className="h-3.5 w-3.5 text-secondary" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
