'use client';

/**
 * calc-ui, shared premium UI kit for the flagship calculator pages.
 *
 * Visual language (from the "Precision & Clarity" design system):
 *   - Deep navy primary, crimson accent, cool-grey scaffolding.
 *   - Level-1 cards: white, 1px outline, soft precision shadow.
 *   - Soft 0.5rem card radius, tabular figures, generous vertical rhythm.
 * Built on the site's design tokens so it inherits light/dark + brand.
 */

import {
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Calculator, SlidersHorizontal } from 'lucide-react';

/* ── formatting ─────────────────────────────────────────────────── */

export const gbp = (n: number, dp = 0) =>
  '£' +
  (isFinite(n) ? n : 0).toLocaleString('en-GB', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });

export const pct = (n: number, dp = 1) => `${(isFinite(n) ? n : 0).toFixed(dp)}%`;

/* ── layout primitives ──────────────────────────────────────────── */

export function Panel({
  title,
  action,
  icon,
  children,
  className = '',
}: {
  title?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-soft ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-outline-variant">
          <h3 className="flex items-center gap-2 font-display font-bold text-on-surface text-sm sm:text-base">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </h3>
          {action}
        </header>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex w-full sm:w-auto p-1 bg-surface-container rounded-full border border-outline-variant"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            title={o.hint}
            onClick={() => onChange(o.value)}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all ${
              active
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── result stat ────────────────────────────────────────────────── */

export function Stat({
  label,
  value,
  sub,
  tone = 'default',
  big,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: 'default' | 'primary' | 'accent' | 'dark';
  big?: boolean;
}) {
  const toneCls =
    tone === 'dark'
      ? 'bg-primary text-white border-primary'
      : tone === 'primary'
      ? 'bg-primary-soft/25 border-primary-soft'
      : 'bg-surface-container-lowest border-outline-variant';
  const valueCls =
    tone === 'dark' ? 'text-white' : tone === 'accent' ? 'text-secondary' : 'text-primary';
  return (
    <div className={`p-3.5 sm:p-4 rounded-xl border shadow-soft flex flex-col gap-1 sm:gap-1.5 ${toneCls}`}>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${tone === 'dark' ? 'opacity-70' : 'text-on-surface-variant'}`}>
        {label}
      </span>
      <span className={`font-display font-extrabold tabular-nums leading-tight break-words ${big ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'} ${valueCls}`}>
        {value}
      </span>
      {sub && <span className={`text-[11px] ${tone === 'dark' ? 'opacity-80' : 'text-on-surface-variant'}`}>{sub}</span>}
    </div>
  );
}

/* ── inputs ─────────────────────────────────────────────────────── */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-[11px] text-on-surface-variant/80">{hint}</span>}
    </label>
  );
}

export function MoneyInput({
  value,
  onChange,
  suffix,
  min = 0,
  step = 1000,
}: {
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  min?: number;
  step?: number;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">£</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        step={step}
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-surface border border-outline-variant rounded-lg pl-7 pr-12 py-2.5 text-sm font-semibold tabular-nums focus:border-primary focus:ring-1 focus:ring-primary outline-none"
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-on-surface-variant">{suffix}</span>}
    </div>
  );
}

export function NumberInput({
  value,
  onChange,
  suffix,
  min = 0,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  min?: number;
  step?: number;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-surface border border-outline-variant rounded-lg px-3 pr-10 py-2.5 text-sm font-semibold tabular-nums focus:border-primary focus:ring-1 focus:ring-primary outline-none"
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-on-surface-variant">{suffix}</span>}
    </div>
  );
}

export function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
    />
  );
}

export function Choice<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: { value: T; label: string; desc?: string }[];
  value: T;
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <label
            key={o.value}
            className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
              active ? 'border-primary bg-primary-soft/20' : 'border-outline-variant bg-surface hover:border-primary/50'
            }`}
          >
            <input
              type="radio"
              name={name}
              checked={active}
              onChange={() => onChange(o.value)}
              className="mt-0.5 text-primary focus:ring-primary"
            />
            <span>
              <span className="block text-sm font-semibold text-on-surface">{o.label}</span>
              {o.desc && <span className="block text-[11px] text-on-surface-variant">{o.desc}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: ReactNode;
}) {
  return (
    <label className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-surface border border-outline-variant cursor-pointer">
      <span className="text-sm text-on-surface">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-outline-variant'}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}

/* ── proportion bar ─────────────────────────────────────────────── */

export function BarTrack({ segments }: { segments: { value: number; color: string; label?: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="w-full h-3 rounded-full overflow-hidden bg-surface-container flex">
      {segments.map((s, i) => (
        <div key={i} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={s.label} />
      ))}
    </div>
  );
}

/* ── donut ──────────────────────────────────────────────────────── */

export function Donut({
  segments,
  centerLabel,
  centerValue,
  size = 180,
}: {
  segments: { value: number; color: string; label: string }[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const R = 70;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full">
      <svg viewBox="0 0 180 180" style={{ maxWidth: size }} className="shrink-0 w-32 h-32 sm:w-44 sm:h-44 -rotate-90">
        <circle cx="90" cy="90" r={R} fill="none" stroke="var(--uk-surface-container, #eceef0)" strokeWidth="22" />
        {segments.map((s, i) => {
          const len = (s.value / total) * C;
          const el = (
            <circle
              key={i}
              cx="90"
              cy="90"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="22"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="space-y-2 w-full sm:flex-1">
        {centerValue && (
          <div className="mb-3">
            <div className="text-xs text-on-surface-variant">{centerLabel}</div>
            <div className="text-xl font-display font-extrabold text-primary tabular-nums">{centerValue}</div>
          </div>
        )}
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-on-surface-variant">{s.label}</span>
            <span className="font-semibold text-on-surface tabular-nums ml-auto">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── line chart (multi-series, interactive) ─────────────────────── */

export interface ChartSeries {
  points: number[];
  color: string;
  label: string;
  dashed?: boolean;
  /** index where the line reaches zero (e.g. mortgage paid off), gets a marker */
  payoffIndex?: number;
}

export function LineChart({
  series,
  labels,
  height = 220,
  format = (n: number) => gbp(n),
}: {
  series: ChartSeries[];
  labels?: string[];
  height?: number;
  format?: (n: number) => string;
}) {
  const W = 640;
  const H = 220;
  const pad = { l: 8, r: 8, t: 10, b: 18 };
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const n = Math.max(...series.map((s) => s.points.length), 1);
  const allMax = Math.max(1, ...series.flatMap((s) => s.points));
  const x = (i: number) => pad.l + (n <= 1 ? 0 : (i / (n - 1)) * (W - pad.l - pad.r));
  const y = (v: number) => pad.t + (1 - v / allMax) * (H - pad.t - pad.b);

  const onMove = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * (n - 1)));
  };

  const hoverLeftPct = hover === null ? 0 : (hover / Math.max(1, n - 1)) * 100;

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative"
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onTouchStart={(e) => onMove(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} preserveAspectRatio="none" role="img" aria-label="Mortgage balance over time">
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + g * (H - pad.t - pad.b)} y2={pad.t + g * (H - pad.t - pad.b)} stroke="var(--uk-outline-variant, #c4c6d2)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
          ))}

          {/* hover guide line */}
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="var(--uk-on-surface-variant, #444651)" strokeWidth="1" opacity="0.35" />
          )}

          {series.map((s, si) => {
            const pts = s.points.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
            return (
              <polyline key={si} points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dashed ? '6 4' : undefined} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            );
          })}

          {/* payoff markers */}
          {series.map((s, si) =>
            s.payoffIndex != null && s.payoffIndex < s.points.length ? (
              <circle key={`p${si}`} cx={x(s.payoffIndex)} cy={y(0)} r="4" fill={s.color} stroke="white" strokeWidth="1.5" />
            ) : null,
          )}

          {/* hover dots */}
          {hover !== null &&
            series.map((s, si) =>
              hover < s.points.length ? (
                <circle key={`h${si}`} cx={x(hover)} cy={y(s.points[hover])} r="3.5" fill={s.color} stroke="white" strokeWidth="1.5" />
              ) : null,
            )}
        </svg>

        {/* tooltip */}
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 z-10"
            style={{ left: `${hoverLeftPct}%` }}
          >
            <div className="rounded-lg bg-primary text-white px-2.5 py-1.5 shadow-lg text-[11px] whitespace-nowrap">
              <div className="font-bold mb-0.5">{labels?.[hover] ?? `Point ${hover}`}</div>
              {series.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-sm" style={{ background: s.color }} />
                  <span className="opacity-80">{s.label}:</span>
                  <span className="font-semibold tabular-nums ml-auto">{format(s.points[hover] ?? 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-xs text-on-surface-variant">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-2 rounded-sm" style={{ background: s.color, opacity: s.dashed ? 0.7 : 1 }} />
            {s.label}
          </span>
        ))}
        <span className="ml-auto opacity-70 hidden sm:inline">Hover the chart for year-by-year values</span>
      </div>
    </div>
  );
}

/* ── guide building blocks ──────────────────────────────────────── */

export function GuideHeading({ kicker, children }: { kicker?: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      {kicker && <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">{kicker}</span>}
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mt-1">{children}</h2>
    </div>
  );
}

export function Callout({ tone = 'info', title, children }: { tone?: 'info' | 'warn' | 'tip'; title: string; children: ReactNode }) {
  const map = {
    info: 'border-primary bg-primary-soft/15',
    warn: 'border-red-500 bg-red-50',
    tip: 'border-secondary bg-secondary-soft/30',
  } as const;
  return (
    <div className={`my-5 p-5 rounded-r-lg border-l-4 ${map[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 text-on-surface">{title}</p>
      <div className="text-sm text-on-surface-variant leading-relaxed">{children}</div>
    </div>
  );
}

export function FAQ({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="divide-y divide-outline-variant border border-outline-variant rounded-xl overflow-hidden">
      {items.map((it, i) => (
        <FAQItem key={i} q={it.q} a={it.a} />
      ))}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="bg-surface-container-lowest">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-on-surface">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div id={id} className="px-5 pb-4 text-sm text-on-surface-variant leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

/* ── Advanced options disclosure ─────────────────────────────────
   Replaces Simple/Advanced/Expert mode tabs: mandatory inputs stay
   visible, optional inputs live behind this collapsible. Everything
   remains accessible to power users, nothing is hidden behind a mode. */
export function AdvancedOptions({
  children,
  label = 'Advanced options',
  hint,
  defaultOpen = false,
}: {
  children: ReactNode;
  label?: string;
  hint?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="rounded-xl border border-outline-variant overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left bg-surface-container-lowest hover:bg-surface-container transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1">
          <span className="block text-sm font-bold text-on-surface">{label}</span>
          {hint && <span className="block text-[12px] text-on-surface-variant">{hint}</span>}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div id={id} className="px-4 py-4 border-t border-outline-variant space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── page scaffold (mobile-first) ───────────────────────────────── */

export function CalcShell({
  breadcrumb,
  title,
  subtitle,
  controls,
  inputs,
  results,
  children,
  calcLabel = 'Calculate',
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  subtitle: ReactNode;
  controls?: ReactNode;
  inputs: ReactNode;
  results: ReactNode;
  children?: ReactNode;
  calcLabel?: string;
}) {
  const [done, setDone] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const onCalc = () => {
    setDone(true);
    requestAnimationFrame(() => {
      if (window.innerWidth < 1024) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <section className="container-page pt-7 sm:pt-10 pb-4 sm:pb-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2 sm:mb-3 flex-wrap">
          {breadcrumb.map((b, i) => (
            <span key={b.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              {b.href ? <Link href={b.href} className="hover:text-primary">{b.label}</Link> : <span className="text-primary font-bold">{b.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="text-[26px] leading-tight sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">{title}</h1>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">{subtitle}</p>
        {controls && <div className="mt-4 sm:mt-5">{controls}</div>}
      </section>

      <section className="container-page pb-10 sm:pb-14 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {inputs}
          <CalcButton done={done} onClick={onCalc} label={calcLabel} />
        </div>
        <div ref={resultsRef} className="lg:col-span-7 space-y-4 sm:space-y-5 lg:sticky lg:top-24 self-start scroll-mt-20">
          {done ? results : <ResultsPlaceholder label={calcLabel} />}
        </div>
      </section>

      {children}
    </div>
  );
}

export function CalcButton({ done, onClick, label = 'Calculate' }: { done: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 rounded-xl shadow-soft hover:bg-primary-container active:scale-[0.99] transition-all"
    >
      <Calculator className="h-4 w-4" /> {done ? 'Recalculate' : label}
    </button>
  );
}

export function ResultsPlaceholder({ label = 'Calculate' }: { label?: string }) {
  return (
    <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[260px]">
      <div className="w-12 h-12 rounded-2xl bg-primary-soft/30 text-primary flex items-center justify-center mb-4">
        <Calculator className="h-6 w-6" />
      </div>
      <h3 className="font-display font-bold text-on-surface">Your results appear here</h3>
      <p className="text-sm text-on-surface-variant mt-1 max-w-xs">Enter your details, then press <span className="font-semibold text-on-surface">{label}</span> to see the full breakdown.</p>
    </div>
  );
}

export function Guide({
  kicker = 'Complete guide',
  title,
  intro,
  children,
}: {
  kicker?: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="container-page pb-20 sm:pb-24 border-t border-outline-variant pt-12 sm:pt-14 max-w-3xl">
      <div className="mb-8 sm:mb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">{kicker}</span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary mt-1">{title}</h2>
        <p className="mt-3 text-sm sm:text-base text-on-surface-variant leading-relaxed">{intro}</p>
      </div>
      <div className="space-y-10 sm:space-y-12">{children}</div>
    </article>
  );
}

export function GuideSection({ kicker, title, children }: { kicker?: string; title: string; children: ReactNode }) {
  return (
    <section>
      <GuideHeading kicker={kicker}>{title}</GuideHeading>
      <div className="space-y-4 text-[15px] leading-relaxed text-on-surface-variant">{children}</div>
    </section>
  );
}

export function Mistakes({ items }: { items: [string, string][] }) {
  return (
    <ul className="space-y-3 text-[15px] text-on-surface-variant">
      {items.map(([h, b]) => (
        <li key={h} className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
          <span><strong className="text-on-surface">{h}.</strong> {b}</span>
        </li>
      ))}
    </ul>
  );
}

export function RelatedTools({ items }: { items: { href: string; label: string; hint: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((it) => (
        <a
          key={it.href}
          href={it.href}
          className="group p-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary hover:shadow-md transition-all"
        >
          <span className="block text-sm font-bold text-on-surface group-hover:text-primary">{it.label}</span>
          <span className="block text-xs text-on-surface-variant mt-0.5">{it.hint}</span>
        </a>
      ))}
    </div>
  );
}
