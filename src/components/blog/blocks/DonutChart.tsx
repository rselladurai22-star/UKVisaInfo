'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { ChartDatum } from './LineChart';

// Distinct, well-separated hues so adjacent slices never read as "the same".
const SLICE = ['#2563eb', '#f59e0b', '#14b8a6', '#8b5cf6', '#ef4444', '#0ea5e9', '#64748b'];

// Animated donut/pie chart for showing composition (where £1 goes, fee split).
// Hover a slice or legend row to highlight it; the centre shows that value.
// Authored as:
//   > [!DONUT] Where your £1 goes
//   > Take-home :: 68 :: 68%
//   > Income tax :: 22 :: 22%
//   > NI :: 10 :: 10%
export default function DonutChart({ title, items }: { title: string; items: ChartDatum[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const total = items.reduce((s, d) => s + d.value, 0) || 1;
  const R = 60, C = 80, STROKE = 26;
  const circ = 2 * Math.PI * R;

  let offset = 0;
  const slices = items.map((d, i) => {
    const frac = d.value / total;
    const seg = { color: SLICE[i % SLICE.length], frac, dash: frac * circ, offset, datum: d };
    offset += frac * circ;
    return seg;
  });

  const centre = active != null ? slices[active] : null;

  return (
    <figure className="my-8 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-cs">
      {title && (
        <figcaption className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {title}
        </figcaption>
      )}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <div className="relative h-40 w-40 flex-none">
          <svg viewBox="0 0 160 160" className="h-40 w-40" role="img" aria-label={title}>
            <g transform="rotate(-90 80 80)">
              {slices.map((s, i) => {
                const dim = active != null && active !== i;
                const common = {
                  cx: C, cy: C, r: R, fill: 'none' as const, stroke: s.color, strokeWidth: STROKE,
                  strokeDasharray: `${s.dash} ${circ - s.dash}`,
                  style: { cursor: 'pointer', opacity: dim ? 0.3 : 1, transition: 'opacity .15s ease' },
                  onMouseEnter: () => setActive(i),
                  onMouseLeave: () => setActive(null),
                };
                return reduce ? (
                  <circle key={i} {...common} strokeDashoffset={-s.offset}>
                    <title>{`${s.datum.label}: ${s.datum.display}`}</title>
                  </circle>
                ) : (
                  <motion.circle
                    key={i}
                    {...common}
                    initial={{ strokeDashoffset: -s.offset + s.dash }}
                    whileInView={{ strokeDashoffset: -s.offset }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <title>{`${s.datum.label}: ${s.datum.display}`}</title>
                  </motion.circle>
                );
              })}
            </g>
          </svg>
          {/* Centre readout, hovered slice, or total by default */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-[15px] font-extrabold leading-none tabular-nums text-slate-900">
              {centre ? centre.datum.display : `${Math.round((slices[0]?.frac ?? 0) * 100)}%`}
            </span>
            <span className="mt-0.5 max-w-[5.5rem] text-[10px] leading-tight text-slate-500">
              {centre ? centre.datum.label : slices[0]?.datum.label}
            </span>
          </div>
        </div>

        <ul className="w-full space-y-1">
          {slices.map((s, i) => (
            <li
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[14px] transition-colors ${
                active === i ? 'bg-slate-50' : ''
              }`}
            >
              <span className="h-3 w-3 flex-none rounded-sm" style={{ background: s.color }} />
              <span className="flex-1 text-slate-600">{s.datum.label}</span>
              <span className="font-display font-bold tabular-nums text-slate-900">{s.datum.display}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
