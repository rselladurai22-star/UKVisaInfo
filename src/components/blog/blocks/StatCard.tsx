'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Headline figure card. The number counts up once when it scrolls into
 * view (flagship feel), parsing any currency prefix / unit suffix so
 * "£41,700", "60%" or "2.4x" all animate cleanly. Honours
 * prefers-reduced-motion by showing the final value immediately.
 */
function useCountUp(value: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const m = value.match(/^([^\d-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
    if (!node || reduce || !m || !('IntersectionObserver' in window)) {
      setDisplay(value);
      return;
    }
    const prefix = m[1];
    const suffix = m[3];
    const target = parseFloat(m[2].replace(/,/g, ''));
    const decimals = (m[2].split('.')[1] || '').length;

    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      const dur = 1200;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = target * eased;
        const fmt = cur.toLocaleString('en-GB', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        setDisplay(`${prefix}${fmt}${suffix}`);
        if (p < 1) requestAnimationFrame(tick);
      };
      setDisplay(`${prefix}0${suffix}`);
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [value]);

  return { ref, display };
}

export default function StatCard({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <figure className="my-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 p-7 md:p-9 text-white shadow-cs-lg">
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.16) 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300 mb-3">
          <Sparkles className="w-4 h-4" />
          Key figure
        </p>
        <div
          ref={ref}
          className="font-display font-extrabold text-[clamp(2.25rem,7vw,3.5rem)] leading-[1] tracking-[-0.03em] tabular-nums text-white"
        >
          {display}
        </div>
        <figcaption className="mt-3 text-slate-300 text-[14px] md:text-[15px] leading-snug max-w-md">
          {label}
        </figcaption>
      </div>
    </figure>
  );
}
