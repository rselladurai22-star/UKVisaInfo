'use client';

/**
 * Client-side interactive islands for the flagship salary article.
 * The article itself stays a Server Component (good for SEO / AdSense);
 * only these small pieces hydrate. Every animation respects
 * prefers-reduced-motion and degrades to final values without motion.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Sliders, TrendingDown } from 'lucide-react';

/* ── shared helpers ──────────────────────────────────────── */
const gbp = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`;

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// 2025/26 England, Wales & NI.
function incomeTax(gross: number) {
  const pa = gross <= 100000 ? 12570 : Math.max(0, 12570 - (gross - 100000) / 2);
  const taxable = Math.max(0, gross - pa);
  const t1 = Math.min(taxable, 37700) * 0.2;
  const t2 = Math.min(Math.max(taxable - 37700, 0), 87440) * 0.4;
  const t3 = Math.max(taxable - 125140, 0) * 0.45;
  return t1 + t2 + t3;
}
function employeeNI(gross: number) {
  const band1 = Math.min(Math.max(gross - 12570, 0), 50270 - 12570) * 0.08;
  const band2 = Math.max(gross - 50270, 0) * 0.02;
  return band1 + band2;
}
function marginalKeepPct(gross: number) {
  if (gross <= 12570) return 100;
  if (gross <= 50270) return 72;
  if (gross <= 100000) return 58;
  if (gross <= 125140) return 38;
  return 53;
}

/* ── #2 Scroll-reveal manager (mounts once) ──────────────── */
export function ScrollRevealManager() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('fa-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('fa-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/* ── #3 Reading-position pill ────────────────────────────── */
export function ReadingPosition({ minutes }: { minutes: number }) {
  const [pct, setPct] = useState(0);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setPct(p);
      setShow(scrolled > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const left = Math.max(0, Math.round(minutes * (1 - pct / 100)));
  return (
    <div
      aria-hidden
      className={`fixed bottom-4 right-5 z-40 hidden rounded-full border border-slate-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur transition-all duration-300 sm:block ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
    >
      <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold text-slate-600">
        <span className="relative inline-flex h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
          <span className="absolute inset-y-0 left-0 rounded-full bg-blue-600 transition-[width] duration-150" style={{ width: `${pct}%` }} />
        </span>
        <span className="text-blue-700">{Math.round(pct)}%</span>
        <span className="text-slate-400">·</span>
        <span>{left} min left</span>
      </div>
    </div>
  );
}

/* ── #1 Active table-of-contents rail (xl only) ──────────── */
export function ArticleTocRail({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="On this page" className="fa-toc-rail">
      <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">On this page</p>
      <ul className="space-y-1.5 border-l border-slate-200">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`-ml-px block border-l-2 py-0.5 pl-3 text-[12.5px] leading-snug transition-colors ${on ? 'border-blue-600 font-semibold text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ── #4 Count-up stat ────────────────────────────────────── */
export function CountUpStat({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const m = value.match(/^([^\d-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
    if (!m || prefersReducedMotion()) { setDisplay(value); return; }
    const prefix = m[1], suffix = m[3];
    const target = parseFloat(m[2].replace(/,/g, ''));
    const decimals = (m[2].split('.')[1] || '').length;
    const node = ref.current;
    if (!node) { setDisplay(value); return; }
    let started = false;
    const run = () => {
      if (started) return; started = true;
      const dur = 1100; const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = target * eased;
        const fmt = cur.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        setDisplay(`${prefix}${fmt}${suffix}`);
        if (p < 1) requestAnimationFrame(tick);
      };
      setDisplay(`${prefix}0${suffix}`);
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.5 });
    io.observe(node);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref} className={className}>{display}</span>;
}

/* ── #5 Salary explorer ──────────────────────────────────── */
export function SalaryExplorer() {
  const [salary, setSalary] = useState(35000);
  const tax = incomeTax(salary);
  const ni = employeeNI(salary);
  const net = salary - tax - ni;
  const keep = marginalKeepPct(salary);
  const effRate = salary > 0 ? Math.round(((tax + ni) / salary) * 100) : 0;

  const zone =
    salary <= 12570 ? { label: 'Tax-free', tone: 'emerald' } :
    salary <= 50270 ? { label: 'Basic rate', tone: 'blue' } :
    salary <= 100000 ? { label: 'Higher rate', tone: 'indigo' } :
    salary <= 125140 ? { label: '60% trap', tone: 'rose' } :
    { label: 'Additional rate', tone: 'violet' };
  const toneText: Record<string, string> = {
    emerald: 'text-emerald-700 bg-emerald-100', blue: 'text-blue-700 bg-blue-100',
    indigo: 'text-indigo-700 bg-indigo-100', rose: 'text-rose-700 bg-rose-100',
    violet: 'text-violet-700 bg-violet-100',
  };

  return (
    <div className="fa-reveal my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-cs" data-reveal>
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-white/60 px-5 py-3 sm:px-6">
        <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          <Sliders className="h-4 w-4 text-blue-600" /> Try your own salary
        </p>
        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${toneText[zone.tone]}`}>{zone.label}</span>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <label htmlFor="fa-salary" className="text-[12px] font-semibold text-slate-500">Gross salary / year</label>
            <div className="mt-1 flex items-center gap-1 font-display text-[30px] font-extrabold tabular-nums tracking-[-0.02em] text-slate-900">
              <span className="text-slate-400">£</span>
              <input
                id="fa-salary"
                type="number"
                inputMode="numeric"
                min={0}
                step={500}
                value={salary}
                onChange={(e) => setSalary(Math.max(0, Math.min(500000, Number(e.target.value) || 0)))}
                className="w-[150px] bg-transparent outline-none focus:text-blue-700"
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-slate-500">Take-home / month</p>
            <p className="font-display text-[30px] font-extrabold tabular-nums tracking-[-0.02em] text-blue-700">{gbp(net / 12)}</p>
          </div>
        </div>

        <input
          type="range"
          aria-label="Salary slider"
          min={15000}
          max={150000}
          step={500}
          value={Math.min(150000, Math.max(15000, salary))}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="fa-range mt-5 w-full"
        />

        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-slate-200 sm:grid-cols-4">
          {[
            { l: 'Income tax', v: gbp(tax) },
            { l: 'National Insurance', v: gbp(ni) },
            { l: 'Take-home / year', v: gbp(net) },
            { l: 'Effective tax rate', v: `${effRate}%` },
          ].map((s) => (
            <div key={s.l} className="bg-white px-4 py-3">
              <p className="font-display text-[18px] font-extrabold tabular-nums tracking-[-0.01em] text-slate-900">{s.v}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-slate-600">
          At this salary you keep <strong className="text-blue-700">{keep}p</strong> of your next £1 earned. Figures are 2025/26 for England, Wales &amp; NI, with no pension or student loan.
        </p>
        <Link href="/take-home-pay" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5">
          <Calculator className="h-4 w-4" /> Add pension &amp; student loan <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/* ── #6 Animated retention bars ──────────────────────────── */
export function AnimatedRetentionBars() {
  const bands = [
    { label: 'Up to £12,570', keep: 100, color: '#10b981' },
    { label: '£12,570 to £50,270', keep: 72, color: '#2563eb' },
    { label: '£50,270 to £100,000', keep: 58, color: '#6366f1' },
    { label: '£100,000 to £125,140', keep: 38, color: '#e11d48' },
    { label: '£125,140 +', keep: 53, color: '#7c3aed' },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) { setShown(true); return; }
    const node = ref.current; if (!node) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-cs">
      <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Pence kept per extra £1 earned</p>
      <div className="space-y-3">
        {bands.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-[150px] flex-none text-[12.5px] font-medium text-slate-600 sm:w-[180px]">{b.label}</span>
            <div className="h-6 flex-1 overflow-hidden rounded-md bg-slate-100">
              <div
                className="flex h-full items-center justify-end rounded-md pr-2 font-mono text-[11px] font-bold text-white"
                style={{
                  width: shown ? `${b.keep}%` : '0%',
                  background: b.color,
                  transition: `width 900ms cubic-bezier(.22,1,.36,1) ${i * 90}ms`,
                }}
              >
                <span className={shown ? 'opacity-100 transition-opacity duration-300' : 'opacity-0'} style={{ transitionDelay: `${i * 90 + 500}ms` }}>{b.keep}p</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── #8 Take-home composition chart ──────────────────────── */
export function CompositionChart() {
  const points = [15000, 30000, 50000, 100000, 150000];
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) { setShown(true); return; }
    const node = ref.current; if (!node) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { threshold: 0.25 });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-cs">
      <figcaption className="flex items-center justify-between gap-2 border-b border-slate-100 bg-white/60 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:px-6">
        <span>Where each salary goes</span>
        <span className="flex items-center gap-3 normal-case tracking-normal">
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-blue-600" /> Take-home</span>
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-slate-400" /> Tax</span>
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> NI</span>
        </span>
      </figcaption>
      <div className="space-y-4 px-5 py-6 sm:px-6">
        {points.map((g, i) => {
          const tax = incomeTax(g), ni = employeeNI(g), net = g - tax - ni;
          const pct = (n: number) => (g > 0 ? (n / g) * 100 : 0);
          const segs = [
            { w: pct(net), c: '#2563eb', v: gbp(net) },
            { w: pct(tax), c: '#94a3b8', v: gbp(tax) },
            { w: pct(ni), c: '#fbbf24', v: gbp(ni) },
          ];
          return (
            <div key={g}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-display text-[14px] font-bold text-slate-900">{gbp(g)}</span>
                <span className="font-mono text-[11.5px] text-slate-500">keep {Math.round(pct(net))}%</span>
              </div>
              <div className="flex h-7 w-full overflow-hidden rounded-lg bg-slate-100">
                {segs.map((s, j) => (
                  <div
                    key={j}
                    title={s.v}
                    className="flex items-center justify-center overflow-hidden text-[10px] font-bold text-white/95"
                    style={{
                      width: shown ? `${s.w}%` : '0%',
                      background: s.c,
                      transition: `width 1000ms cubic-bezier(.22,1,.36,1) ${i * 120 + j * 80}ms`,
                    }}
                  >
                    {s.w > 12 ? s.v : ''}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

/* ── #9 Marginal-rate curve ──────────────────────────────── */
export function MarginalRateChart() {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) { setShown(true); return; }
    const node = ref.current; if (!node) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const W = 680, H = 240, padL = 38, padB = 28, padT = 12, padR = 12;
  const maxX = 160000, maxY = 70;
  const px = (x: number) => padL + (x / maxX) * (W - padL - padR);
  const py = (y: number) => padT + (1 - y / maxY) * (H - padT - padB);
  // combined marginal take rate (tax + NI) as step function
  const steps: [number, number][] = [
    [0, 0], [12570, 0], [12570, 28], [50270, 28], [50270, 42],
    [100000, 42], [100000, 62], [125140, 62], [125140, 47], [160000, 47],
  ];
  const line = steps.map(([x, y], i) => `${i ? 'L' : 'M'}${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(' ');
  const area = `${line} L${px(160000).toFixed(1)},${py(0).toFixed(1)} L${px(0).toFixed(1)},${py(0).toFixed(1)} Z`;
  const ticksX = [0, 50270, 100000, 125140, 160000];
  const ticksY = [0, 20, 40, 60];

  return (
    <figure className="fa-reveal my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-cs sm:p-5" data-reveal>
      <figcaption className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
        <TrendingDown className="h-4 w-4 text-rose-600" /> Marginal tax rate as your salary rises
      </figcaption>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Marginal tax rate peaks at 62% between £100,000 and £125,140">
        <defs>
          <linearGradient id="fa-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticksY.map((t) => (
          <g key={t}>
            <line x1={padL} y1={py(t)} x2={W - padR} y2={py(t)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={padL - 6} y={py(t) + 3} textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="monospace">{t}%</text>
          </g>
        ))}
        {ticksX.map((t) => (
          <text key={t} x={px(t)} y={H - padB + 16} textAnchor="middle" fontSize="9.5" fill="#94a3b8" fontFamily="monospace">
            {t >= 1000 ? `${Math.round(t / 1000)}k` : t}
          </text>
        ))}
        {/* 60% trap marker */}
        <rect x={px(100000)} y={padT} width={px(125140) - px(100000)} height={H - padT - padB} fill="#fee2e2" opacity="0.5" />
        <text x={(px(100000) + px(125140)) / 2} y={py(62) - 6} textAnchor="middle" fontSize="10" fill="#e11d48" fontWeight="700">62%</text>
        <path d={area} fill="url(#fa-grad)" className={shown ? 'fa-area-in' : 'fa-area'} />
        <path d={line} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinejoin="round" className={shown ? 'fa-line-in' : 'fa-line'} pathLength={1} />
      </svg>
      <p className="mt-1 text-[12px] text-slate-500">The combined income tax + NI rate on each extra pound. Notice the spike to 62% in the £100k, £125k zone.</p>
    </figure>
  );
}

/* ── #14 Sticky calculate CTA (mobile, after table) ──────── */
export function StickyCalcCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const t = document.getElementById('table');
      const f = document.getElementById('faq');
      if (!t) return;
      const past = t.getBoundingClientRect().bottom < 0;
      const beforeEnd = !f || f.getBoundingClientRect().top > window.innerHeight;
      setShow(past && beforeEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`fixed inset-x-3 bottom-3 z-40 lg:hidden ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'} transition-all duration-300`}>
      <Link href="/take-home-pay" className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-[14px] font-bold text-white shadow-xl shadow-blue-600/25 active:scale-[0.98]">
        <Calculator className="h-4 w-4" /> Calculate your exact take-home <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
