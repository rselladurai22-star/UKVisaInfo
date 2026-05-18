'use client';

import { useEffect, useState } from 'react';

/**
 * Thin progress bar sitting just below the fixed nav, tracking how
 * far the user has read through <article>. Single rAF-throttled
 * scroll listener, no continuous work when idle.
 */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let pending = false;

    const update = () => {
      pending = false;
      const article = document.querySelector('article');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight + 200; // small buffer
      const passed = -rect.top + 200;
      const p = Math.max(0, Math.min(1, passed / Math.max(1, total)));
      setPct(p * 100);
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 right-0 top-[60px] md:top-[64px] z-40 h-[2px] pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-[#d9152b] via-[#e11d48] to-[#d97706] transition-[width] duration-75 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
