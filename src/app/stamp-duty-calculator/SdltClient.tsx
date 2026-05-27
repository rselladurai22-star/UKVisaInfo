'use client';

/**
 * Stamp Duty Calculator — Material Design 3 redesign (May 2026 v5).
 *
 * 3-column layout: Your Purchase | Tax Breakdown | Scenario Comparison
 * Design: Hanken Grotesk, blue-tinted MD3 surfaces, emerald green brand.
 */

import { useMemo, useState } from 'react';
import {
  Settings, Download, Share2, CheckCircle2,
  ArrowRight, ArrowDown, ArrowUp, Info, Home,
} from 'lucide-react';
import {
  calculateSDLT, calculateAllScenarios,
  type BuyerType, type Country, type SDLTResult,
} from '../../lib/sdlt/calc';

/* ─── Design tokens — Material Design 3 blue-surface / emerald brand ─── */
const C = {
  surface:              '#f8f9ff',
  surfaceLowest:        '#ffffff',
  surfaceLow:           '#eff4ff',
  surfaceContainer:     '#e5eeff',
  surfaceHigh:          '#dce9ff',
  surfaceHighest:       '#d3e4fe',
  onSurface:            '#0b1c30',
  onSurfaceVariant:     '#404946',
  outline:              '#707975',
  outlineVariant:       '#c0c8c4',
  primary:              '#00221b',
  secondary:            '#006c47',
  onSecondary:          '#ffffff',
  secondaryContainer:   '#54fbb3',
  onSecondaryContainer: '#00714a',
  secondaryFixedDim:    '#2de19b',
  amber:                '#cc8e00',
  amberBg:              'rgba(255,186,59,0.16)',
  error:                '#ba1a1a',
  errorBg:              '#ffdad6',
  shadow: '0 1px 3px rgba(11,28,48,0.07), 0 4px 16px -4px rgba(11,28,48,0.07)',
};

const FONT: React.CSSProperties = {
  fontFamily: '"Hanken Grotesk", "Inter", system-ui, -apple-system, sans-serif',
};
const NUM: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' };

/**
 * Fluid type scale — clamp(min, preferred-vw, max)
 * Scales smoothly from ~375px mobile → 1440px desktop.
 */
const T = {
  /** Section headings (Your Purchase, Tax Breakdown…) */
  heading:    'clamp(16px, 2.2vw, 20px)',
  /** Large price / donut total number */
  display:    'clamp(22px, 4.5vw, 34px)',
  /** Donut center total */
  donutTotal: 'clamp(18px, 3.5vw, 28px)',
  /** Table primary numbers */
  tableNum:   'clamp(14px, 2.2vw, 18px)',
  /** Body / description text */
  body:       'clamp(13px, 1.6vw, 14px)',
  /** Small / caption / sub-labels */
  caption:    'clamp(11px, 1.2vw, 12px)',
  /** Medium labels */
  label:      'clamp(12px, 1.5vw, 14px)',
};
const gbp = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const pct = (n: number) => (n * 100).toFixed(2) + '%';

/* ─── Buyer state machine ─── */
interface Flags { ftb: boolean; additional: boolean; nonResident: boolean; mixedUse: boolean; company: boolean; }

function deriveBuyer(f: Flags): BuyerType {
  if (f.mixedUse)  return 'mixedUse';
  if (f.company)   return 'company';
  if (f.ftb)       return 'firstTime';
  if (f.additional && f.nonResident) return 'addNonRes';
  if (f.additional)  return 'additional';
  if (f.nonResident) return 'nonResident';
  return 'standard';
}

function flagsForBuyer(b: BuyerType): Flags {
  return {
    ftb:         b === 'firstTime',
    additional:  b === 'additional'  || b === 'addNonRes',
    nonResident: b === 'nonResident' || b === 'addNonRes',
    mixedUse:    b === 'mixedUse',
    company:     b === 'company',
  };
}

/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
export default function SdltClient({ initialPrice = 350_000 }: { initialPrice?: number }) {
  const [price, setPrice]     = useState(initialPrice);
  const [country, setCountry] = useState<Country>('england');
  const [flags, setFlags]     = useState<Flags>({ ftb: false, additional: false, nonResident: false, mixedUse: false, company: false });
  const [mode, setMode]       = useState<'simple' | 'advanced'>('simple');

  const buyer   = deriveBuyer(flags);
  const result  = useMemo(() => calculateSDLT(price, buyer, country), [price, buyer, country]);
  const allScen = useMemo(() => calculateAllScenarios(price, country), [price, country]);

  return (
    <div style={{ ...FONT, color: C.onSurface, background: C.surface, paddingBottom: 48 }}>
      <div style={{ width: '100%', padding: '0 clamp(12px, 3vw, 48px)', boxSizing: 'border-box' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3">
            <CalculatorInputs
              country={country} setCountry={setCountry}
              flags={flags} setFlags={setFlags}
              price={price} setPrice={setPrice}
              mode={mode} setMode={setMode}
            />
          </div>
          <div className="lg:col-span-4">
            <TaxBreakdown result={result} />
          </div>
          <div className="lg:col-span-5">
            <ScenarioComparison
              flags={flags} result={result} allScen={allScen}
              onApply={(b) => setFlags(flagsForBuyer(b))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. CALCULATOR INPUTS (left column)
═══════════════════════════════════════════════════════════════ */
function CalculatorInputs({
  country, setCountry, flags, setFlags, price, setPrice, mode, setMode,
}: {
  country: Country; setCountry: (c: Country) => void;
  flags: Flags; setFlags: (f: Flags) => void;
  price: number; setPrice: (n: number) => void;
  mode: 'simple' | 'advanced'; setMode: (m: 'simple' | 'advanced') => void;
}) {
  const SLIDER_MIN = 50_000, SLIDER_MAX = 2_000_000;
  const sliderPct = Math.min(100, Math.max(0, ((price - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100));
  const ftbCap = country === 'england' ? 500_000 : country === 'scotland' ? 175_000 : null;

  const setStatus = (key: 'ftb' | 'additional' | 'nonResident', val: boolean) => {
    if (key === 'ftb') {
      setFlags({ ...flags, ftb: val, additional: val ? false : flags.additional, nonResident: val ? false : flags.nonResident, mixedUse: false, company: false });
      return;
    }
    setFlags({ ...flags, ftb: false, mixedUse: false, company: false, [key]: val } as Flags);
  };

  return (
    <Panel>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ flex: 1, fontSize: T.heading, fontWeight: 700, color: C.primary, margin: 0 }}>Your Purchase</h2>
        <button type="button" onClick={() => setMode(mode === 'simple' ? 'advanced' : 'simple')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 999,
            background: mode === 'advanced' ? C.secondaryContainer : C.surfaceLow,
            color: mode === 'advanced' ? C.onSecondaryContainer : C.onSurfaceVariant,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: T.label, fontWeight: 500,
          }}>
          <Settings size={13} />
          Advanced
        </button>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ── STEP 1: PROPERTY PRICE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <StepBadge n={1} label="PROPERTY PRICE £" active />

          {/* Large price input */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, borderBottom: `2px solid ${C.secondary}`, paddingBottom: 8 }}>
            <span style={{ fontSize: T.display, fontWeight: 400, color: C.onSurfaceVariant, lineHeight: 1, ...NUM }}>£</span>
            <input
              type="number" inputMode="decimal" value={price || ''}
              onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
              min={0} step={5000} aria-label="Property price"
              style={{
                flex: 1, minWidth: 0, ...NUM,
                fontSize: T.display, fontWeight: 700, color: C.primary,
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'inherit', letterSpacing: '-0.02em', padding: 0, lineHeight: 1,
              }}
            />
          </div>

          {/* Custom slider */}
          <div>
            <div style={{ position: 'relative', height: 8, borderRadius: 999, background: C.surfaceContainer }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${sliderPct}%`, borderRadius: 999, background: C.secondary, transition: 'width 0.08s ease', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: `${sliderPct}%`, width: 16, height: 16, borderRadius: '50%', background: C.secondary, border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', pointerEvents: 'none', transition: 'left 0.08s ease' }} />
              <input type="range"
                value={price} onChange={(e) => setPrice(+e.target.value)}
                min={SLIDER_MIN} max={SLIDER_MAX} step={5000}
                aria-label="Property price slider"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', margin: 0 }}
              />
            </div>
            {/* Preset markers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: T.caption, color: C.outline, marginTop: 8, fontFamily: 'monospace' }}>
              {[250_000, 425_000, 625_000, 925_000].map(v => (
                <button key={v} type="button" onClick={() => setPrice(v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: T.caption, color: price === v ? C.secondary : C.outline, fontWeight: price === v ? 700 : 400, fontFamily: 'monospace', padding: 0 }}>
                  £{v / 1000}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── STEP 2: REGION ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16, borderTop: `1px solid ${C.surfaceContainer}` }}>
          <StepBadge n={2} label="REGION" active={false} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {([
              { key: 'england', name: 'England', tax: 'SDLT' },
              { key: 'scotland', name: 'Scotland', tax: 'LBTT' },
              { key: 'wales',   name: 'Wales',    tax: 'LTT'  },
            ] as const).map(({ key, name, tax }) => {
              const active = country === key;
              return (
                <button key={key} type="button" onClick={() => setCountry(key)} aria-pressed={active}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    padding: '12px 6px', borderRadius: 8,
                    background: active ? C.secondary : C.surfaceLow,
                    border: `1px solid ${active ? C.secondary : 'transparent'}`,
                    color: active ? C.onSecondary : C.onSurface,
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: active ? '0 2px 8px rgba(0,108,71,0.22)' : 'none',
                    transition: 'all 0.15s ease',
                  }}>
                  <span style={{ fontSize: T.label, fontWeight: 700 }}>{name}</span>
                  <span style={{ fontSize: T.caption, opacity: active ? 0.8 : 0.6 }}>{tax}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── STEP 3: BUYER PROFILE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16, borderTop: `1px solid ${C.surfaceContainer}` }}>
          <StepBadge n={3} label="BUYER PROFILE" active={false} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <CheckboxCard checked={flags.ftb}          onChange={(v) => setStatus('ftb', v)}          label="First-time buyer"     description="0% up to £300k"   disabled={flags.additional || flags.nonResident} />
            <CheckboxCard checked={flags.additional}   onChange={(v) => setStatus('additional', v)}   label="Additional property"  description="+5% surcharge"    disabled={flags.ftb} />
            <CheckboxCard checked={flags.nonResident}  onChange={(v) => setStatus('nonResident', v)}  label="Non-UK resident"      description="+2% surcharge"    disabled={flags.ftb} />
          </div>

          {/* Smart eligibility callouts */}
          {!flags.ftb && !flags.additional && !flags.nonResident && ftbCap && price > 0 && price <= ftbCap && (
            <Callout icon={<Info size={14} />} color={C.secondary} bg={C.surfaceLow} border={C.outlineVariant}
              title="You may qualify for FTB relief"
              body="Tick 'First-time buyer' above if you've never owned residential property anywhere." />
          )}
          {flags.ftb && country === 'england' && price > 500_000 && (
            <Callout icon={<Info size={14} />} color={C.amber} bg={C.amberBg} border={`${C.amber}44`}
              title="FTB relief not available above £500k"
              body="Standard rates apply at this price point." />
          )}
          {flags.additional && (
            <Callout icon={<Info size={14} />} color={C.secondary} bg={C.surfaceLow} border={C.outlineVariant}
              title="Selling your main home soon?"
              body="You can reclaim the +5% surcharge if you sell within 36 months of completion." />
          )}
        </div>

        {/* Advanced toggles */}
        {mode === 'advanced' && (
          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.surfaceContainer}` }}>
            <div style={{ fontSize: T.caption, fontWeight: 700, color: C.outline, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Advanced</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <AdvToggle on={flags.mixedUse} onChange={(v) => setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: v, company: false })} label="Mixed-use property" desc="Commercial element — no 3% surcharge applies" />
              <AdvToggle on={flags.company}  onChange={(v) => setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: false, company: v })} label="Company-bought" desc="Non-natural person, 15% flat if > £500k" />
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. TAX BREAKDOWN (center column)
═══════════════════════════════════════════════════════════════ */
const WEDGE_COLORS = ['#006c47', '#2de19b', '#0f766e', '#ffba3b', '#ba1a1a'];

function TaxBreakdown({ result }: { result: SDLTResult }) {
  const activeBands = result.bands.filter(b => b.taxOn > 0);
  return (
    <Panel>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.outlineVariant}` }}>
        <h2 style={{ fontSize: T.heading, fontWeight: 700, color: C.primary, margin: 0 }}>Tax Breakdown</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: T.caption, color: C.outline }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.secondary, display: 'inline-block', flexShrink: 0 }} />
          Updated live
        </div>
      </div>

      <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Donut */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Donut result={result} />
        </div>

        {/* Band list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: T.caption, fontWeight: 700, color: C.onSurfaceVariant, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Breakdown by band</span>
            <span style={{ fontSize: T.caption, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: C.surfaceLow, color: C.outline }}>
              {activeBands.length} bands · {result.taxName}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeBands.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 8, background: C.surfaceLowest, border: `1px solid ${C.surfaceContainer}` }}>
                <div>
                  <div style={{ fontSize: T.body, fontWeight: 600, color: C.onSurface }}>Band {i + 1} · {(b.rate * 100).toFixed(0)}%</div>
                  <div style={{ fontSize: T.caption, color: C.outline, marginTop: 2 }}>{b.label.split(':').pop()?.trim()} · {gbp(b.taxOn)}</div>
                </div>
                <span style={{ fontSize: T.label, fontWeight: 700, color: C.primary, ...NUM }}>{gbp(b.tax)}</span>
              </div>
            ))}
            {result.surchargeAmount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 8, background: C.amberBg, border: `1px solid ${C.amber}33` }}>
                <div>
                  <div style={{ fontSize: T.body, fontWeight: 600, color: C.amber }}>Surcharge</div>
                  <div style={{ fontSize: T.caption, color: C.amber, opacity: 0.85, marginTop: 2 }}>{result.surchargeLabel}</div>
                </div>
                <span style={{ fontSize: T.label, fontWeight: 700, color: C.amber, ...NUM }}>{gbp(result.surchargeAmount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Monthly costs CTA */}
        <a href="/mortgage-affordability" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 10, background: C.surfaceLowest, border: `1.5px solid ${C.outlineVariant}`, textDecoration: 'none', transition: 'border-color 0.15s' }}>
          <span style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0, background: C.surfaceLow, color: C.secondary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Home size={18} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: T.body, fontWeight: 700, color: C.onSurface }}>Monthly costs?</span>
            <span style={{ display: 'block', fontSize: T.caption, color: C.outline, marginTop: 1 }}>Estimate your mortgage repayments</span>
          </span>
          <ArrowRight size={15} style={{ color: C.secondary, flexShrink: 0 }} />
        </a>
      </div>
    </Panel>
  );
}

function Donut({ result }: { result: SDLTResult }) {
  const size = 192, stroke = 22;
  const r = (size - stroke) / 2;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = result.total;
  const isZero = total === 0;
  const segments: { value: number; color: string; key: string }[] = [];
  result.bands.filter(b => b.tax > 0).forEach((b, i) => {
    segments.push({ value: b.tax, color: WEDGE_COLORS[i % WEDGE_COLORS.length], key: `b${i}` });
  });
  if (result.surchargeAmount > 0) segments.push({ value: result.surchargeAmount, color: C.amber, key: 'surch' });
  let cumulative = 0;
  const gap = 2;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surfaceHigh} strokeWidth={stroke} />
        {!isZero && segments.map((seg) => {
          const segLen = (seg.value / total) * circumference;
          const dashArr = `${Math.max(segLen - gap, 0.1)} ${circumference}`;
          const offset = -cumulative;
          cumulative += segLen;
          return (
            <circle key={seg.key} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={dashArr} strokeDashoffset={offset} strokeLinecap="butt"
              style={{ transition: 'stroke-dasharray 0.4s ease, stroke-dashoffset 0.4s ease' }} />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center' }}>
        <div style={{ fontSize: T.caption, fontWeight: 700, color: C.outline, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          Total {result.taxName}
        </div>
        <div style={{ fontSize: T.donutTotal, fontWeight: 700, color: C.primary, letterSpacing: '-0.02em', ...NUM, lineHeight: 1 }}>{gbp(total)}</div>
        <div style={{ fontSize: T.caption, color: C.onSurfaceVariant, marginTop: 5, ...NUM }}>{pct(result.effectiveRate)} effective</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. SCENARIO COMPARISON (right column)
═══════════════════════════════════════════════════════════════ */
function ScenarioComparison({
  flags, result, allScen, onApply,
}: {
  flags: Flags; result: SDLTResult; allScen: SDLTResult[];
  onApply: (b: BuyerType) => void;
}) {
  const buyer     = deriveBuyer(flags);
  const ftbR      = allScen.find(r => r.buyerType === 'firstTime')!;
  const addR      = allScen.find(r => r.buyerType === 'additional')!;
  const bestScen  = allScen.reduce((b, s) => s.total < b.total ? s : b, allScen[0]);
  const bestSaving = result.total - bestScen.total;
  const alreadyBest = bestScen.buyerType === buyer;

  const cols = [
    { label: 'Current',    sub: result.taxName,    r: result, isCurrent: true,  highlight: false },
    { label: 'First-time', sub: '0% up to £300k',  r: ftbR,   isCurrent: false, highlight: ftbR.total < result.total },
    { label: 'Additional', sub: '+5% surcharge',   r: addR,   isCurrent: false, highlight: false },
  ];

  function DeltaCell({ r }: { r: SDLTResult }) {
    const d = result.total - r.total;
    if (d === 0) return <span style={{ color: C.outline, fontSize: T.caption }}>— Baseline</span>;
    const saving = d > 0;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 5, fontSize: T.caption, fontWeight: 700, background: saving ? C.secondaryContainer : C.amberBg, color: saving ? C.onSecondaryContainer : C.amber, ...NUM }}>
        {saving ? <ArrowDown size={11} /> : <ArrowUp size={11} />}
        {saving ? '-' : '+'}{gbp(Math.abs(d))}
      </span>
    );
  }

  return (
    <Panel>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ flex: 1, fontSize: T.heading, fontWeight: 700, color: C.primary, margin: 0 }}>Scenario Comparison</h2>
        <span style={{ fontSize: T.caption, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4, background: C.surfaceLow, color: C.secondaryFixedDim }}>
          4 SCENARIOS
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <IconBtn><Download size={16} /></IconBtn>
          <IconBtn><Share2 size={16} /></IconBtn>
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: T.body, textAlign: 'left', minWidth: 340 }}>
          <thead>
            <tr style={{ background: C.surfaceLow, fontSize: T.caption, color: C.outline, borderBottom: `1px solid ${C.outlineVariant}` }}>
              <th style={{ padding: '12px 16px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', width: '24%' }}>Metric</th>
              {cols.map((c, i) => (
                <th key={i} style={{ padding: '12px 14px', fontWeight: 700, borderLeft: `1px solid ${C.surfaceHigh}`, background: c.highlight ? C.surfaceLow : 'transparent', color: c.highlight ? C.secondary : C.outline }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Total Tax */}
            <tr style={{ borderBottom: `1px solid ${C.surfaceContainer}` }}>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600, color: C.onSurface, fontSize: T.body }}>Total Tax</div>
                <div style={{ fontSize: T.caption, color: C.outline, marginTop: 2 }}>Payable now</div>
              </td>
              {cols.map((c, i) => (
                <td key={i} style={{ padding: '14px 14px', borderLeft: `1px solid ${C.surfaceContainer}`, background: c.highlight ? C.surfaceLow : 'transparent' }}>
                  <span style={{ fontSize: T.tableNum, fontWeight: 800, color: c.highlight ? C.secondary : C.primary, letterSpacing: '-0.02em', ...NUM }}>{gbp(c.r.total)}</span>
                </td>
              ))}
            </tr>
            {/* Effective Rate */}
            <tr style={{ borderBottom: `1px solid ${C.surfaceContainer}` }}>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600, color: C.onSurface, fontSize: T.body }}>Effective Rate</div>
                <div style={{ fontSize: T.caption, color: C.outline, marginTop: 2 }}>% of price</div>
              </td>
              {cols.map((c, i) => (
                <td key={i} style={{ padding: '14px 14px', borderLeft: `1px solid ${C.surfaceContainer}`, background: c.highlight ? C.surfaceLow : 'transparent', fontWeight: 700, fontSize: T.body, color: c.highlight ? C.secondary : C.onSurface, ...NUM }}>
                  {pct(c.r.effectiveRate)}
                </td>
              ))}
            </tr>
            {/* Delta */}
            <tr>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600, color: C.onSurface, fontSize: T.body }}>Delta vs Current</div>
                <div style={{ fontSize: T.caption, color: C.outline, marginTop: 2 }}>Savings / Extra</div>
              </td>
              {cols.map((c, i) => (
                <td key={i} style={{ padding: '14px 14px', borderLeft: `1px solid ${C.surfaceContainer}`, background: c.highlight ? C.surfaceLow : 'transparent' }}>
                  <DeltaCell r={c.r} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Best-for-you banner */}
      {bestSaving > 0 && !alreadyBest && (
        <div style={{ margin: '16px 20px 20px', padding: '14px 16px', background: C.surfaceLow, borderRadius: 12, border: `1px solid ${C.surfaceHighest}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0, background: C.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color={C.onSecondary} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: T.caption, fontWeight: 800, color: C.secondary, letterSpacing: '0.10em', textTransform: 'uppercase' }}>Best for you</span>
              <span style={{ fontSize: T.caption, fontWeight: 700, padding: '2px 5px', borderRadius: 3, background: C.secondary, color: C.onSecondary }}>AI MATCH</span>
            </div>
            <div style={{ fontSize: T.label, color: C.onSurface, lineHeight: 1.5 }}>
              {bestScen.buyerType === 'firstTime' ? 'First-Time Buyer' : 'Standard'} relief saves you{' '}
              <strong style={{ color: C.secondary, ...NUM }}>{gbp(bestSaving)}</strong> vs current rate.
            </div>
          </div>
          <button type="button" onClick={() => onApply(bestScen.buyerType)}
            style={{ padding: '8px 14px', borderRadius: 8, background: C.secondary, color: C.onSecondary, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: T.label, fontWeight: 700, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
            Apply <ArrowRight size={12} />
          </button>
        </div>
      )}
    </Panel>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════ */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: C.surfaceLowest, border: `1px solid ${C.outlineVariant}`, borderRadius: 12, boxShadow: C.shadow, overflow: 'hidden' }}>
      {children}
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" style={{ padding: 6, borderRadius: 6, border: `1px solid ${C.outlineVariant}`, background: 'transparent', cursor: 'pointer', color: C.onSurfaceVariant, display: 'flex', alignItems: 'center' }}>
      {children}
    </button>
  );
}

function StepBadge({ n, label, active }: { n: number; label: string; active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: active ? C.secondaryContainer : C.surfaceContainer, color: active ? C.onSecondaryContainer : C.onSurfaceVariant, fontSize: T.caption, fontWeight: 700, flexShrink: 0 }}>{n}</span>
      <span style={{ fontSize: T.caption, fontWeight: 700, color: C.onSurfaceVariant, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

function CheckboxCard({ checked, onChange, label, description, disabled }: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; description: string; disabled?: boolean;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px', borderRadius: 8, background: C.surfaceLowest, border: `1px solid ${checked ? C.secondary : C.outlineVariant}`, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'border-color 0.15s' }}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} style={{ display: 'none' }} />
      <div style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1, border: `2px solid ${checked ? C.secondary : C.outline}`, background: checked ? C.secondary : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        {checked && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: T.body, fontWeight: 600, color: checked ? C.primary : C.onSurface }}>{label}</div>
        <div style={{ fontSize: T.caption, color: C.outline, marginTop: 2 }}>{description}</div>
      </div>
    </label>
  );
}

function Callout({ icon, color, bg, border, title, body }: { icon: React.ReactNode; color: string; bg: string; border: string; title: string; body: string }) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: 8, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ color, marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: T.label, fontWeight: 700, color }}>{title}</div>
        <div style={{ fontSize: T.caption, color: C.onSurfaceVariant, marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );
}

function AdvToggle({ on, onChange, label, desc }: { on: boolean; onChange: (v: boolean) => void; label: string; desc: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
      <span style={{ position: 'relative', width: 32, height: 18, borderRadius: 999, flexShrink: 0, marginTop: 1, background: on ? C.secondary : C.outlineVariant, transition: 'background 0.18s ease', display: 'inline-block' }}>
        <span style={{ position: 'absolute', top: 2, left: 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.12)', transform: on ? 'translateX(14px)' : 'translateX(0)', transition: 'transform 0.18s ease', display: 'block' }} />
      </span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: T.body, fontWeight: 600, color: C.onSurface }}>{label}</span>
        <span style={{ display: 'block', fontSize: T.caption, color: C.outline, marginTop: 2 }}>{desc}</span>
      </span>
    </button>
  );
}