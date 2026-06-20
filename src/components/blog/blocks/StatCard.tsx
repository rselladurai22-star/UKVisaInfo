'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp } from 'lucide-react';

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
    <figure className="my-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-ink via-[#005c3c] to-primary p-7 md:p-10 text-white border border-outline-variant/30 shadow-soft">
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />
      <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-primary-soft/20 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-primary-fixed mb-3">
            <TrendingUp className="w-3 h-3" />
            Key figure
          </div>
          <div
            ref={ref}
            className="font-display font-bold text-[2.5rem] md:text-[3.5rem] leading-[1] tracking-[-0.03em] tabular-nums text-white"
          >
            {display}
          </div>
          <figcaption className="mt-3 text-primary-fixed/80 text-[14px] md:text-[15px] leading-snug max-w-md">
            {label}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
