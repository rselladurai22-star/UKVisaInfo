'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

interface Props {
  /** Primary CTA label */
  label: string;
  /** Internal href or external URL */
  href: string;
  /** Show external icon instead of arrow */
  external?: boolean;
  /** Optional small secondary label/text */
  context?: string;
  /** Brand color for the button (default red) */
  accent?: string;
}

/**
 * Sticky bottom action bar shown on mobile only.
 * Hides while at the top of the page, then appears once the user has
 * scrolled past the hero. Hides again when within 200px of the bottom
 * (where a real CTA already exists).
 */
export default function StickyMobileCta({
  label, href, external, context, accent = '#2563eb',
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let pending = false;
    const update = () => {
      pending = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Show after 320px scroll, hide near footer (within 320px of bottom)
      const visible = y > 320 && y < max - 320;
      setShow(visible);
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const inner = (
    <>
      <Sparkles className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 truncate text-left">
        {context && <span className="block text-[10px] font-bold uppercase tracking-[0.1em] opacity-70 mb-0.5 leading-none">{context}</span>}
        <span className="block text-[14px] font-bold leading-tight">{label}</span>
      </span>
      {external
        ? <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-80" />
        : <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-80" />}
    </>
  );

  const cls = `flex items-center gap-3 w-full rounded-2xl text-white px-4 py-3 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.4)] active:scale-[0.985] transition-transform duration-100`;

  return (
    <div
      aria-hidden={!show}
      className={`
        fixed bottom-3 left-3 right-3 z-40 lg:hidden
        transition-[opacity,transform] duration-200 ease-out
        ${show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}
      `}
    >
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={{ background: accent }}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls} style={{ background: accent }}>
          {inner}
        </Link>
      )}
    </div>
  );
}
