import type { ReactNode } from 'react';
import { Check, X, BarChart3 } from 'lucide-react';
import type { IconComponent } from '../../data/tools';
import v from './visuals.module.css';

/* ── Stat tiles ──────────────────────────────────────── */
export interface Stat { value: string; label: string; sub?: string; tone?: string }
export function StatGrid({ items }: { items: Stat[] }) {
  return (
    <div className={v.statGrid}>
      {items.map((s, i) => (
        <div key={i} className={v.stat} style={{ ['--tone' as string]: s.tone ?? '#6366f1' }}>
          <div className={v.statVal}>{s.value}</div>
          <div className={v.statLabel}>{s.label}</div>
          {s.sub && <div className={v.statSub}>{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── Rate bands (proportional bar) ───────────────────── */
export interface RateBand { name: string; rate: string; width: number; color: string }
export function RateBands({ bands, axis }: { bands: RateBand[]; axis: string[] }) {
  return (
    <div className={v.bands}>
      <div className={v.bandsBar}>
        {bands.map((b, i) => (
          <div key={i} className={v.bandSeg} style={{ flexGrow: b.width, background: b.color }}>
            <span className={v.bandSegRate}>{b.rate}</span>
            <span className={v.bandSegName}>{b.name}</span>
          </div>
        ))}
      </div>
      <div className={v.bandsAxis}>{axis.map((a, i) => <span key={i}>{a}</span>)}</div>
    </div>
  );
}

/* ── Step / marginal-rate chart (static SVG) ─────────── */
export interface RateStep { upTo: number; rate: number }
export function StepRateChart({
  title, subtitle, steps, maxIncome, highlight,
}: {
  title: string; subtitle?: string;
  steps: RateStep[]; maxIncome: number;
  highlight?: { from: number; to: number; label: string };
}) {
  const W = 720, H = 240, PADL = 38, PADB = 28, PADT = 14, PADR = 14;
  const maxRate = Math.ceil(Math.max(...steps.map((s) => s.rate)) / 10) * 10 + 5;
  const x = (inc: number) => PADL + (inc / maxIncome) * (W - PADL - PADR);
  const y = (rate: number) => PADT + (1 - rate / maxRate) * (H - PADT - PADB);

  // Build stepped area path.
  let dPath = `M ${x(0)} ${y(steps[0].rate)}`;
  let prev = 0;
  for (const s of steps) {
    dPath += ` L ${x(prev)} ${y(s.rate)} L ${x(Math.min(s.upTo, maxIncome))} ${y(s.rate)}`;
    prev = s.upTo;
  }
  const areaPath = `${dPath} L ${x(Math.min(prev, maxIncome))} ${y(0)} L ${x(0)} ${y(0)} Z`;

  const yTicks = [0, Math.round(maxRate / 2 / 10) * 10, Math.floor(maxRate / 10) * 10].filter((t, i, a) => a.indexOf(t) === i);
  const xTicks = [0, maxIncome * 0.25, maxIncome * 0.5, maxIncome * 0.75, maxIncome];

  return (
    <div className={v.chart}>
      <div className={v.chartTitle}><BarChart3 size={14} color="#6366f1" />{title}{subtitle && <span>· {subtitle}</span>}</div>
      <svg className={v.chartSvg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={title}>
        <defs>
          <linearGradient id="rcArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* gridlines + y labels */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PADL} y1={y(t)} x2={W - PADR} y2={y(t)} stroke="rgba(15,23,42,0.07)" strokeWidth="1" />
            <text x={PADL - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#9ca3af">{t}%</text>
          </g>
        ))}
        {/* highlight zone */}
        {highlight && (
          <g>
            <rect x={x(highlight.from)} y={PADT} width={x(highlight.to) - x(highlight.from)} height={H - PADT - PADB} fill="rgba(190,18,60,0.08)" />
            <line x1={x(highlight.from)} y1={PADT} x2={x(highlight.from)} y2={H - PADB} stroke="rgba(190,18,60,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={x(highlight.to)} y1={PADT} x2={x(highlight.to)} y2={H - PADB} stroke="rgba(190,18,60,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <text x={(x(highlight.from) + x(highlight.to)) / 2} y={PADT + 14} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#be123c">{highlight.label}</text>
          </g>
        )}
        <path d={areaPath} fill="url(#rcArea)" />
        <path d={dPath} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" />
        {/* x labels */}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - 8} textAnchor={t === 0 ? 'start' : t === maxIncome ? 'end' : 'middle'} fontSize="10" fill="#9ca3af">
            £{t >= 1000 ? `${Math.round(t / 1000)}k` : t}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ── Compare matrix ──────────────────────────────────── */
export type Cell = string | boolean;
export function CompareMatrix({
  columns, rows, bestIndex,
}: {
  columns: string[];           // first is the row-label header
  rows: { label: string; cells: Cell[] }[];
  bestIndex?: number;          // 1-based data column to highlight as "best"
}) {
  const cols = `minmax(120px, 1.4fr) ${columns.slice(1).map(() => 'minmax(0,1fr)').join(' ')}`;
  const isBest = (dataCol: number) => bestIndex === dataCol + 1;
  return (
    <div className={v.matrix}>
      <div className={v.matrixHead} style={{ gridTemplateColumns: cols }}>
        {columns.map((c, i) => (
          <div key={i} className={`${v.matrixHeadCell} ${i > 0 && isBest(i - 1) ? v.matrixHeadBest : ''}`}>
            {c}{i > 0 && isBest(i - 1) && <span className={v.matrixBestTag}>Best</span>}
          </div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} className={v.matrixRow} style={{ gridTemplateColumns: cols }}>
          <div className={v.matrixCell}>{r.label}</div>
          {r.cells.map((cell, ci) => (
            <div key={ci} className={`${v.matrixCell} ${isBest(ci) ? v.matrixCellBest : ''}`}>
              {typeof cell === 'boolean'
                ? (cell ? <span className={v.mYes}><Check size={16} /></span> : <span className={v.mNo}><X size={16} /></span>)
                : cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Flow diagram ────────────────────────────────────── */
export interface FlowItem { label: string; value: string; op?: string; accent?: boolean }
export function FlowSteps({ items }: { items: FlowItem[] }) {
  return (
    <div className={v.flow}>
      {items.map((it, i) => (
        <FlowFragment key={i} it={it} first={i === 0} />
      ))}
    </div>
  );
}
function FlowFragment({ it, first }: { it: FlowItem; first: boolean }) {
  return (
    <>
      {!first && <span className={v.flowOp}>{it.op ?? '−'}</span>}
      <div className={`${v.flowStep} ${it.accent ? v.flowStepAccent : ''}`}>
        <div className={v.flowLabel}>{it.label}</div>
        <div className={v.flowVal}>{it.value}</div>
      </div>
    </>
  );
}

/* ── Tip cards ───────────────────────────────────────── */
export interface Tip { icon: IconComponent; title: string; body: ReactNode }
export function TipCards({ items }: { items: Tip[] }) {
  return (
    <div className={v.tips}>
      {items.map((t, i) => {
        const Icon = t.icon;
        return (
          <div key={i} className={v.tip}>
            <span className={v.tipIcon}><Icon size={19} /></span>
            <div className={v.tipTitle}>{t.title}</div>
            <div className={v.tipBody}>{t.body}</div>
          </div>
        );
      })}
    </div>
  );
}
