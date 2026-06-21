'use client';

import { motion, useReducedMotion } from 'motion/react';

export interface ChartDatum {
  label: string;
  value: number;
  display: string;
}

// Animated line/trend chart for showing a value across an ordered series
// (take-home by salary, fees over years). Pure SVG, no chart library.
// Authored as:
//   > [!LINE] Take-home pay by salary
//   > £20k :: 17920 :: £17,920
//   > £30k :: 25120 :: £25,120
export default function LineChart({ title, items }: { title: string; items: ChartDatum[] }) {
  const reduce = useReducedMotion();
  const W = 640, H = 240, PAD = 28;
  const max = Math.max(...items.map((d) => d.value), 1);
  const min = Math.min(...items.map((d) => d.value), 0);
  const span = max - min || 1;
  const n = items.length;

  const x = (i: number) => PAD + (i * (W - PAD * 2)) / Math.max(n - 1, 1);
  const y = (v: number) => H - PAD - ((v - min) / span) * (H - PAD * 2);
  const points = items.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
  const area = `M${x(0)},${H - PAD} L${points.split(' ').join(' L')} L${x(n - 1)},${H - PAD} Z`;

  return (
    <figure className="my-8 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-cs">
      {title && (
        <figcaption className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {title}
        </figcaption>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
        <defs>
          <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {[0, 0.5, 1].map((t) => (
          <line key={t} x1={PAD} x2={W - PAD} y1={PAD + t * (H - PAD * 2)} y2={PAD + t * (H - PAD * 2)} stroke="#f1f5f9" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#lc-fill)" />
        {reduce ? (
          <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        ) : (
          <motion.polyline
            points={points}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        {items.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.value)} r="3.5" fill="#2563eb" />
            <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 11, fontFamily: 'var(--font-mono), monospace' }}>
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
