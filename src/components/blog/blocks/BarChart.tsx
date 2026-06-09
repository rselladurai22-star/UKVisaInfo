'use client';

import { motion, useReducedMotion } from 'motion/react';

export interface BarDatum {
  label: string;
  value: number;
  display: string;
}

// Animated horizontal bar chart for comparing numeric values (salaries,
// fees, processing times). Bars grow in on scroll; widths are proportional
// to the largest value in the set.
export default function BarChart({ title, items }: { title: string; items: BarDatum[] }) {
  const reduce = useReducedMotion();
  const max = Math.max(...items.map((d) => d.value), 1);

  return (
    <figure className="my-8 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6 shadow-soft">
      {title && (
        <figcaption className="font-display text-on-surface font-bold text-[1.05rem] mb-5 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-primary to-secondary" />
          {title}
        </figcaption>
      )}
      <div className="space-y-3.5">
        {items.map((d, i) => {
          const pct = `${Math.max((d.value / max) * 100, 2)}%`;
          return (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-1.5 gap-3">
                <span className="text-on-surface-variant text-[0.9rem] font-medium leading-snug">{d.label}</span>
                <span className="font-display text-on-surface font-bold text-[0.95rem] tabular-nums shrink-0">
                  {d.display}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-container-low overflow-hidden">
                {reduce ? (
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: pct }}
                  />
                ) : (
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    whileInView={{ width: pct }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
