'use client';

/**
 * Stamp Duty — dashboard product redesign (May 2026 — v4).
 *
 * Matches mockup spec:
 *   3-column hero grid:  Inputs | Tax Breakdown (donut) | What-If Scenarios
 *   Strip:               Live SDLT thresholds tracker
 *   2-column charts:     Price Sensitivity (area) | Comparative Load (bars)
 *
 * Modes: Simple (Standard/FTB/Additional/Non-UK pills) +
 *        Advanced (adds Mixed-use, Company, Joint).
 *
 * Visual: cream page, white cards, blue/indigo primary accent,
 * Inter cv11+ss01 typography, subtle 1px borders, soft shadows.
 */

import { useMemo, useState } from 'react';
import {
  Settings, ArrowRight, Info, Sparkles, Home,
} from 'lucide-react';
import {
  calculateSDLT, calculateAllScenarios, calculateAllCountries,
  type BuyerType, type Country, type SDLTResult,
} from '../../lib/sdlt/calc';

/* ─────────────────────────────────────────────
   TOKENS — cream/blue dashboard palette
───────────────────────────────────────────── */
const T = {
  // Surfaces — match site theme (FAFAF7 cream + white cards)
  page:      '#FAFAF7',
  paper:     '#FFFFFF',
  surface:   '#F6F5F0',
  // Text — match site theme (ink-black + slate hierarchy)
  ink:       '#0B0F19',
  body:      '#1F2937',
  muted:     '#475569',
  faint:     '#94A3B8',
  ghost:     '#D8D5CA',
  // Borders — site standard warm hairline
  hair:      'rgba(11,15,25,0.08)',
  divide:    'rgba(11,15,25,0.05)',
  // PRIMARY — site emerald (replaces blue)
  blue:      '#047857',
  blueDk:    '#065F46',
  blueT:     '#ECFDF5',
  blueT2:    '#D1FAE5',
  // Secondary — site gold (replaces purple for FTB scenario)
  purple:    '#B8860B',
  purpleT:   '#FBF6E7',
  // Accents — site palette
  emerald:   '#047857',
  emeraldT:  '#ECFDF5',
  amber:     '#B45309',
  amberT:    '#FEF3C7',
  rose:      '#9F1239',
  roseT:     '#FFE4E6',
  // Shadows — premium layered
  shadowSm:  '0 1px 2px rgba(11,15,25,0.04)',
  shadow:    '0 1px 3px rgba(11,15,25,0.04), 0 4px 12px -2px rgba(11,15,25,0.06)',
  shadowMd:  '0 8px 24px -6px rgba(11,15,25,0.08), 0 2px 6px rgba(11,15,25,0.04)',
};

const FONT: React.CSSProperties = {
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  fontFeatureSettings: '"cv11", "ss01"',
};
const NUM: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"cv11", "ss01", "tnum"',
};

const gbp  = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const pct  = (n: number) => (n * 100).toFixed(2) + '%';
const fmtK = (n: number) => n >= 1_000_000 ? `£${(n/1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m` : `£${(n/1000).toFixed(0)}k`;

/* Flag-based state machine */
interface Flags {
  ftb: boolean; additional: boolean; nonResident: boolean;
  mixedUse: boolean; company: boolean;
}
function deriveBuyer(f: Flags): BuyerType {
  if (f.mixedUse) return 'mixedUse';
  if (f.company)  return 'company';
  if (f.ftb)      return 'firstTime';
  if (f.additional && f.nonResident) return 'addNonRes';
  if (f.additional)  return 'additional';
  if (f.nonResident) return 'nonResident';
  return 'standard';
}
function buyerLabel(b: BuyerType): string {
  return {
    standard: 'Standard', firstTime: 'First-time buyer',
    additional: 'Additional property', nonResident: 'Non-UK resident',
    addNonRes: 'Additional + Non-resident', mixedUse: 'Mixed-use',
    company: 'Company-owned',
  }[b];
}

/* ═══════════════════════════════════════════════════════════════
   ROOT EXPERIENCE
═══════════════════════════════════════════════════════════════ */
export default function SdltClient({ initialPrice = 350000 }: { initialPrice?: number }) {
  const [price, setPrice]     = useState(initialPrice);
  const [country, setCountry] = useState<Country>('england');
  const [flags, setFlags] = useState<Flags>({
    ftb: false, additional: false, nonResident: false,
    mixedUse: false, company: false,
  });
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');

  const buyer    = deriveBuyer(flags);
  const result   = useMemo(() => calculateSDLT(price, buyer, country), [price, buyer, country]);
  const allScen  = useMemo(() => calculateAllScenarios(price, country), [price, country]);

  return (
    <div style={{ ...FONT, color: T.ink, background: T.page, paddingBottom: 40 }}>
      <div style={wrap}>
        {/* Mobile: stacked; tablet (md): Inputs full-width + Breakdown; desktop (xl): all 3 side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)_minmax(0,1fr)] gap-4 xl:gap-6">
          <CalculatorInputs
            country={country} setCountry={setCountry}
            flags={flags} setFlags={setFlags}
            price={price} setPrice={setPrice}
            mode={mode} setMode={setMode}
          />
          <TaxBreakdown result={result} price={price} />
          {/* On tablet the Scenario panel spans full width so the table isn't squashed */}
          <div className="md:col-span-2 xl:col-span-1">
            <ScenarioComparison
              price={price} country={country} flags={flags}
              result={result} allScen={allScen}
              onApply={(b) => setFlags(flagsForBuyer(b))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. CALCULATOR INPUTS (left column) — redesigned May 2026
   3-step flow: Price → Region → Buyer profile
═══════════════════════════════════════════════════════════════ */
function CalculatorInputs({
  country, setCountry, flags, setFlags, price, setPrice, mode, setMode,
}: {
  country: Country; setCountry: (c: Country) => void;
  flags: Flags; setFlags: (f: Flags) => void;
  price: number; setPrice: (n: number) => void;
  mode: 'simple' | 'advanced'; setMode: (m: 'simple' | 'advanced') => void;
}) {
  /* Price quick-presets — anchored to UK market realities */
  const PRICE_PRESETS = [
    { v: 250_000, label: '£250k', sub: 'UK median'  },
    { v: 425_000, label: '£425k', sub: 'FTB ceiling' },
    { v: 625_000, label: '£625k', sub: 'avg detached' },
    { v: 925_000, label: '£925k', sub: '10% band'    },
  ];

  /* Buyer-profile chips — multi-select where it makes sense.
     FTB is exclusive (a FTB is by definition not buying additional or as non-resident usually).
     Additional + Non-UK can stack (calc supports 'addNonRes'). */
  const setStatus = (key: 'ftb' | 'additional' | 'nonResident', val: boolean) => {
    if (key === 'ftb') {
      // FTB toggles on -> clear the others; off -> clear self
      setFlags({
        ...flags,
        ftb: val,
        additional: val ? false : flags.additional,
        nonResident: val ? false : flags.nonResident,
        mixedUse: false, company: false,
      });
      return;
    }
    // additional / nonResident — multi-select, but clear FTB & advanced
    setFlags({
      ...flags,
      ftb: false,
      mixedUse: false, company: false,
      [key]: val,
    } as Flags);
  };

  return (
    <Card padding={0}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.hair}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ flex: 1, fontSize: 17, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.015em' }}>
          Your Purchase
        </h2>
        <button type="button" onClick={() => setMode(mode === 'simple' ? 'advanced' : 'simple')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 11px', borderRadius: 20,
            background: mode === 'advanced' ? T.blueT : T.surface,
            color: mode === 'advanced' ? T.blue : T.muted,
            border: `1px solid ${mode === 'advanced' ? T.blueT2 : T.hair}`,
            cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 11.5, fontWeight: 600,
          }}>
          <Settings size={12} />
          Advanced
        </button>
      </div>

      <div style={{ padding: 24 }}>
        {/* ─── STEP 1 ─── PROPERTY PRICE ─── */}
        <StepHeader n={1} title="Property price" icon="£" />

        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 4,
          padding: '4px 0',
        }}>
          <span style={{ fontSize: 32, fontWeight: 400, color: T.faint, lineHeight: 1, ...NUM }}>£</span>
          <input type="number" inputMode="decimal" value={price || ''}
            onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
            min={0} step={5000}
            aria-label="Property price"
            style={{
              flex: 1, minWidth: 0, ...NUM,
              fontSize: 32, fontWeight: 700, color: T.ink,
              background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'inherit', letterSpacing: '-0.025em',
              padding: 0, lineHeight: 1.1,
            }} />
        </div>

        {/* Band-position tracker — shows where this price sits across UK bands */}
        <BandPositionTracker price={price} country={country} />

        <input type="range" value={price} onChange={(e) => setPrice(+e.target.value)}
          min={50_000} max={2_000_000} step={5000}
          aria-label="Property price slider"
          style={{ width: '100%', marginTop: 14, accentColor: T.blue, cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: T.faint, marginTop: 4, ...NUM }}>
          <span>£50k</span><span>£500k</span><span>£1m</span><span>£2m</span>
        </div>

        {/* Quick-pick presets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 14 }}>
          {PRICE_PRESETS.map((p) => {
            const active = price === p.v;
            return (
              <button key={p.v} type="button" onClick={() => setPrice(p.v)}
                title={`${p.label} — ${p.sub}`}
                style={{
                  padding: '8px 6px', borderRadius: 8,
                  background: active ? T.blueT : T.paper,
                  border: `1px solid ${active ? T.blue : T.hair}`,
                  color: active ? T.blue : T.body,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  transition: 'all 0.15s ease',
                }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, ...NUM }}>{p.label}</span>
                <span style={{ fontSize: 9.5, color: active ? T.blue : T.faint, fontWeight: 500 }}>{p.sub}</span>
              </button>
            );
          })}
        </div>

        {/* ─── STEP 2 ─── REGION ─── */}
        <div style={{ marginTop: 28 }} />
        <StepHeader n={2} title="Region" icon="📍" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {(['england', 'scotland', 'wales'] as Country[]).map((c) => {
            const active = country === c;
            return (
              <button key={c} type="button" onClick={() => setCountry(c)}
                aria-pressed={active}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '12px 8px', borderRadius: 10,
                  background: active ? T.blueT : T.paper,
                  border: `1.5px solid ${active ? T.blue : T.hair}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: active ? T.blue : T.ink, lineHeight: 1.2 }}>
                  {c === 'england' ? 'England & NI' : c === 'scotland' ? 'Scotland' : 'Wales'}
                </span>
                <span style={{
                  fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
                  padding: '2px 6px', borderRadius: 4,
                  background: active ? T.blue : T.surface,
                  color: active ? T.paper : T.faint,
                }}>
                  {c === 'england' ? 'SDLT' : c === 'scotland' ? 'LBTT' : 'LTT'}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── STEP 3 ─── BUYER PROFILE ─── */}
        <div style={{ marginTop: 28 }} />
        <StepHeader n={3} title="Buyer profile" icon="👤" />

        <p style={{ fontSize: 11.5, color: T.muted, margin: '0 0 12px', lineHeight: 1.5 }}>
          Leave all unchecked if you&apos;re replacing your main home. Tick any that apply — surcharges stack.
        </p>

        <div style={{ display: 'grid', gap: 8 }}>
          <BuyerChip
            on={flags.ftb}
            onChange={(v) => setStatus('ftb', v)}
            label="First-time buyer"
            tip="Never owned residential property anywhere in the world. Relief: 0% to £300k, 5% to £500k. Lost above £500k."
            badge="0% up to £300k"
            disabled={flags.additional || flags.nonResident}
          />
          <BuyerChip
            on={flags.additional}
            onChange={(v) => setStatus('additional', v)}
            label="Additional property"
            tip="You already own residential property (anywhere in the world) and this isn't replacing your main home. +5% surcharge on every band, applied to the full price."
            badge="+5% surcharge"
            disabled={flags.ftb}
          />
          <BuyerChip
            on={flags.nonResident}
            onChange={(v) => setStatus('nonResident', v)}
            label="Non-UK resident"
            tip="You haven't been UK-resident in the 12 months before completion. +2% surcharge on top of standard rates. Stacks with the additional-property surcharge."
            badge="+2% surcharge"
            disabled={flags.ftb}
          />
        </div>

        {/* Smart eligibility callout — surfaces non-obvious savings/penalties */}
        {(() => {
          const ftbCap = country === 'england' ? 500_000 : country === 'scotland' ? 175_000 : null;
          // FTB available, not yet selected, eligible by price+region
          if (!flags.ftb && !flags.additional && !flags.nonResident && ftbCap && price > 0 && price <= ftbCap) {
            return (
              <div style={{
                marginTop: 12, padding: '10px 12px', borderRadius: 10,
                background: T.purpleT, border: `1px solid ${T.purple}33`,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <Sparkles size={14} style={{ color: T.purple, marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.purple, lineHeight: 1.35 }}>
                    You may qualify for first-time-buyer relief
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2, lineHeight: 1.45 }}>
                    At this price{country === 'england' ? ' in England' : country === 'scotland' ? ' in Scotland' : ''}, FTB relief could save you thousands. Tick it above if eligible.
                  </div>
                </div>
              </div>
            );
          }
          // FTB selected but over the cap — relief is lost
          if (flags.ftb && country === 'england' && price > 500_000) {
            return (
              <div style={{
                marginTop: 12, padding: '10px 12px', borderRadius: 10,
                background: T.amberT, border: `1px solid ${T.amber}33`,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <Info size={14} style={{ color: T.amber, marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.amber, lineHeight: 1.35 }}>
                    FTB relief not available above £500k
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2, lineHeight: 1.45 }}>
                    You&apos;ll pay the standard rate — same as any non-FTB buyer at this price point.
                  </div>
                </div>
              </div>
            );
          }
          // Additional property — possible refund if replacing main home within 36 months
          if (flags.additional) {
            return (
              <div style={{
                marginTop: 12, padding: '10px 12px', borderRadius: 10,
                background: T.blueT, border: `1px solid ${T.blue}22`,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <Info size={14} style={{ color: T.blue, marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, lineHeight: 1.35 }}>
                    Selling your old main home soon?
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2, lineHeight: 1.45 }}>
                    If you sell within 36 months of completion, you can reclaim the +5% surcharge.
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}
        {mode === 'advanced' && (
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${T.divide}` }}>
            <Label>Advanced</Label>
            <div style={{ display: 'grid', gap: 6 }}>
              <AdvToggle on={flags.mixedUse}
                onChange={(v) => setFlags({
                  ftb: false, additional: false, nonResident: false,
                  mixedUse: v, company: false,
                })}
                label="Mixed-use property"
                desc="Has commercial element — no 3% surcharge applies" />
              <AdvToggle on={flags.company}
                onChange={(v) => setFlags({
                  ftb: false, additional: false, nonResident: false,
                  mixedUse: false, company: v,
                })}
                label="Company-bought"
                desc="Non-natural person, 15% flat if > £500k" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/* Donut wedge colors — also used as legend swatch colors below */
const WEDGE_COLORS = ['#047857', '#0F766E', '#15803D', '#B8860B'];

/* ═══════════════════════════════════════════════════════════════
   2. TAX BREAKDOWN (center column — donut + bands)
═══════════════════════════════════════════════════════════════ */
function TaxBreakdown({ result, price }: { result: SDLTResult; price: number }) {
  return (
    <Card padding={0}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.015em' }}>Tax Breakdown</h2>
          <div style={{ fontSize: 11.5, color: T.muted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.emerald, display: 'inline-block' }} />
            Updated live
          </div>
        </div>
      </div>
      <div style={{ padding: '32px 24px 24px' }}>

        {/* DONUT */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Donut result={result} />
        </div>

        {/* BAND ROWS — legend matched to donut wedges by color */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Breakdown by band
          </div>
          <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: T.surface, color: T.muted }}>
            {result.bands.filter(b => b.taxOn > 0).length} bands · {result.taxName}
          </span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {result.bands.filter((b) => b.taxOn > 0).map((b, i) => {
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                background: T.surface,
                borderRadius: 10,
                border: `1px solid ${T.divide}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>
                    Band {i + 1} · {(b.rate * 100).toFixed(0)}%
                  </div>
                  <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>
                    {b.label.split(':').pop()?.trim()} · on {gbp(b.taxOn)}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, ...NUM, letterSpacing: '-0.015em' }}>
                  {gbp(b.tax)}
                </div>
              </div>
            );
          })}
          {result.surchargeAmount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: T.amberT, borderRadius: 10,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.amber, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.amber, lineHeight: 1.3 }}>
                  Surcharge
                </div>
                <div style={{ fontSize: 11.5, color: T.amber, marginTop: 2, opacity: 0.85 }}>
                  {result.surchargeLabel}
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.amber, ...NUM, letterSpacing: '-0.015em' }}>
                {gbp(result.surchargeAmount)}
              </div>
            </div>
          )}
        </div>

        {/* MONTHLY COSTS CTA */}
        <a href="/mortgage-affordability" style={{
          display: 'flex', alignItems: 'center', gap: 14,
          marginTop: 24, padding: '16px 18px',
          background: T.paper, border: `1.5px solid ${T.purple}`,
          borderRadius: 12, textDecoration: 'none',
          transition: 'all 0.15s ease',
        }}>
          <span style={{
            width: 40, height: 40, borderRadius: 10,
            background: T.purpleT, color: T.purple,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Home size={18} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>
              Monthly costs?
            </span>
            <span style={{ display: 'block', fontSize: 12, color: T.muted, marginTop: 2 }}>
              Estimate your mortgage repayments
            </span>
          </span>
          <ArrowRight size={16} style={{ color: T.purple, flexShrink: 0 }} />
        </a>
      </div>
    </Card>
  );
}

/* ─── Donut chart ─── */
function Donut({ result }: { result: SDLTResult }) {
  const size = 280, stroke = 26;
  const r = (size - stroke) / 2;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const total = result.total;
  const segments: { value: number; color: string; key: string }[] = [];
  // Sequential emerald scale by band index — matches the legend below
  result.bands.filter((b) => b.tax > 0).forEach((b, i) => {
    segments.push({
      value: b.tax,
      color: WEDGE_COLORS[i % WEDGE_COLORS.length],
      key: `b${i}`,
    });
  });
  if (result.surchargeAmount > 0) {
    segments.push({ value: result.surchargeAmount, color: T.amber, key: 'surch' });
  }

  // If total is 0 (e.g. FTB at £200k), show a faint complete ring
  const isZero = total === 0;
  let cumulative = 0;
  const gap = 2; // px gap between segments

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: size, aspectRatio: '1' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        {/* Background ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.divide} strokeWidth={stroke} />
        {/* Segments */}
        {!isZero && segments.map((seg) => {
          const segLen = (seg.value / total) * circumference;
          const dashArr = `${Math.max(segLen - gap, 0.1)} ${circumference}`;
          const offset = -cumulative;
          cumulative += segLen;
          return (
            <circle key={seg.key} cx={cx} cy={cy} r={r}
              fill="none" stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={dashArr} strokeDashoffset={offset}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dasharray 0.4s ease, stroke-dashoffset 0.4s ease' }} />
          );
        })}
      </svg>
      {/* Center label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 4 }}>
          Total SDLT
        </div>
        <div style={{
          fontSize: 34, fontWeight: 700, color: T.blue,
          letterSpacing: '-0.03em', ...NUM, lineHeight: 1,
        }}>
          {gbp(total)}
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 6, ...NUM }}>
          {pct(result.effectiveRate)} effective
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. SCENARIO COMPARISON (right column)
═══════════════════════════════════════════════════════════════ */
function BandDots({ r }: { r: SDLTResult }) {
  const active = r.bands.filter(b => b.taxOn > 0);
  const colors = ['#22c55e', '#16a34a', '#f59e0b', '#ef4444', '#9f1239'];
  const displayed = active.slice(0, 5);
  const blanks = Math.max(0, 5 - displayed.length);
  return (
    <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
      {displayed.map((b, i) => (
        <span key={i} style={{
          display: 'inline-block', width: 14, height: 6, borderRadius: 2,
          background: b.tax > 0 ? colors[i] || T.ghost : T.ghost,
          opacity: b.tax > 0 ? 1 : 0.3,
        }} />
      ))}
      {Array.from({ length: blanks }).map((_, i) => (
        <span key={`g${i}`} style={{ display: 'inline-block', width: 14, height: 6, borderRadius: 2, background: T.ghost, opacity: 0.3 }} />
      ))}
    </div>
  );
}

function ScenarioComparison({
  price, country, flags, result, allScen, onApply,
}: {
  price: number; country: Country; flags: Flags;
  result: SDLTResult; allScen: SDLTResult[];
  onApply: (b: BuyerType) => void;
}) {
  const [tab, setTab] = useState<'buyer' | 'region' | 'price'>('buyer');
  const buyer = deriveBuyer(flags);

  const ftbR = allScen.find(r => r.buyerType === 'firstTime')!;
  const addR = allScen.find(r => r.buyerType === 'additional')!;
  const nonR = allScen.find(r => r.buyerType === 'nonResident')!;

  const allCountries = useMemo(() => calculateAllCountries(price, buyer), [price, buyer]);
  const engR = allCountries.find(r => r.country === 'england')!;
  const scoR = allCountries.find(r => r.country === 'scotland')!;
  const walR = allCountries.find(r => r.country === 'wales')!;

  const minus10R = useMemo(() => calculateSDLT(price * 0.9, buyer, country), [price, buyer, country]);
  const plus10R  = useMemo(() => calculateSDLT(price * 1.1, buyer, country), [price, buyer, country]);

  const bestScen = allScen.reduce((b, s) => s.total < b.total ? s : b, allScen[0]);
  const bestSaving = result.total - bestScen.total;
  const alreadyBest = bestScen.buyerType === buyer;

  const ftbCap = country === 'england' ? 500_000 : country === 'scotland' ? 175_000 : 0;
  const ftbEligible = ftbCap > 0 && price <= ftbCap;

  function eligibilityFor(b: BuyerType): { icon: string; label: string; color: string } {
    if (b === buyer) return { icon: '✓', label: 'Qualified', color: T.blue };
    if (b === 'firstTime') {
      if (ftbCap === 0) return { icon: '⊗', label: 'Not available', color: T.rose };
      return ftbEligible
        ? { icon: '✓', label: 'Eligible', color: T.blue }
        : { icon: '⊗', label: 'Not applicable', color: T.faint };
    }
    if (b === 'additional') return { icon: '⚠', label: 'Conditional', color: T.amber };
    return { icon: '⊗', label: 'Not applicable', color: T.faint };
  }

  function topBandRate(r: SDLTResult): number {
    const taxed = r.bands.filter(b => b.tax > 0);
    if (taxed.length === 0) return 0;
    return Math.max(...taxed.map(b => b.rate));
  }

  const TABS = [
    { id: 'buyer' as const, icon: '👤', label: 'By Buyer' },
    { id: 'region' as const, icon: '📍', label: 'By Region' },
    { id: 'price' as const, icon: '📈', label: 'Price ±10%' },
  ];

  function colHeader(label: string, sub: string, isHighlight: boolean, isCurrent: boolean) {
    return (
      <div style={{
        padding: '10px 8px 10px',
        background: isHighlight ? T.blueT2 : isCurrent ? T.surface : 'transparent',
        borderRadius: '8px 8px 0 0',
        textAlign: 'center' as const,
      }}>
        <div style={{ fontSize: 9.5, fontWeight: 800, color: isHighlight ? T.blue : isCurrent ? T.ink : T.muted, letterSpacing: '0.08em', textTransform: 'uppercase' as const, lineHeight: 1.3 }}>
          {isCurrent && <span style={{ marginRight: 3 }}>★</span>}{label}
        </div>
        <div style={{ fontSize: 9, color: isHighlight ? T.blue : T.faint, marginTop: 2, fontWeight: 500 }}>{sub}</div>
      </div>
    );
  }

  function colCell(content: React.ReactNode, isHighlight: boolean, isCurrent: boolean) {
    return (
      <div style={{
        padding: '10px 8px',
        background: isHighlight ? '#f0fdf4' : isCurrent ? T.surface : 'transparent',
        textAlign: 'center' as const,
        borderTop: `1px solid ${T.hair}`,
      }}>
        {content}
      </div>
    );
  }

  function rowLabel(title: string, sub: string) {
    return (
      <div style={{ padding: '10px 0', borderTop: `1px solid ${T.hair}` }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{sub}</div>
      </div>
    );
  }

  function deltaCell(delta: number, isHighlight: boolean, isCurrent: boolean) {
    if (delta === 0) {
      return colCell(<span style={{ fontSize: 11.5, color: T.faint, fontWeight: 500 }}>— Baseline</span>, isHighlight, isCurrent);
    }
    const saving = delta > 0;
    const color = saving ? T.blue : T.rose;
    return colCell(
      <span style={{ fontSize: 12.5, fontWeight: 700, color, ...NUM }}>
        {saving ? '−' : '+'}{gbp(Math.abs(delta))}
      </span>,
      isHighlight, isCurrent
    );
  }

  const buyerCols = [
    { result: result, label: 'CURRENT', sub: `${result.taxName} · ${buyer === 'standard' ? 'Standard' : buyerLabel(buyer)}`, isHighlight: false, isCurrent: true, bType: buyer },
    { result: ftbR, label: 'FIRST-TIME', sub: ftbR.total < result.total ? 'Best for you' : '0% up to £300k', isHighlight: ftbR.total < result.total, isCurrent: false, bType: 'firstTime' as BuyerType },
    { result: addR, label: 'ADDITIONAL', sub: '+ADS 5%', isHighlight: false, isCurrent: false, bType: 'additional' as BuyerType },
    { result: nonR, label: 'NON-UK', sub: '+2% surcharge', isHighlight: false, isCurrent: false, bType: 'nonResident' as BuyerType },
  ];

  return (
    <Card padding={0}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.hair}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ flex: 1, fontSize: 17, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.015em' }}>
          Scenario Comparison
        </h2>
        <span style={{
          fontSize: 9.5, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
          padding: '4px 8px', borderRadius: 6, background: T.blueT, color: T.blue,
        }}>4 SCENARIOS</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.hair}`, padding: '0 8px' }}>
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '11px 6px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
              background: 'transparent',
              color: tab === t.id ? T.blue : T.muted,
              borderBottom: `2px solid ${tab === t.id ? T.blue : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all 0.15s ease',
            }}>
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* By Buyer tab */}
      {tab === 'buyer' && (
        <div style={{ padding: '0 16px 16px', overflowX: 'auto' }}>
          <div style={{ minWidth: 320 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', gap: 4, paddingTop: 12 }}>
              <div />
              {buyerCols.map((c, i) => (
                <div key={i}>{colHeader(c.label, c.sub, c.isHighlight, c.isCurrent)}</div>
              ))}
            </div>

            {/* Row: Total Tax */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', gap: 4 }}>
              {rowLabel('Total Tax', 'Payable now')}
              {buyerCols.map((c, i) => colCell(
                <div key={i} style={{ fontSize: 13.5, fontWeight: 700, color: c.isHighlight ? T.blue : T.ink, ...NUM, letterSpacing: '-0.02em' }}>
                  {gbp(c.result.total)}
                </div>,
                c.isHighlight, c.isCurrent
              ))}
            </div>

            {/* Row: Effective Rate */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', gap: 4 }}>
              {rowLabel('Eff. Rate', '% of price')}
              {buyerCols.map((c, i) => colCell(
                <div key={i}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, ...NUM }}>{(c.result.effectiveRate * 100).toFixed(2)}%</div>
                  <div style={{ marginTop: 3, height: 3, borderRadius: 2, background: T.surface, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, c.result.effectiveRate * 500)}%`, background: c.isHighlight ? T.blue : T.faint, borderRadius: 2 }} />
                  </div>
                </div>,
                c.isHighlight, c.isCurrent
              ))}
            </div>

            {/* Row: Delta vs Current */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', gap: 4 }}>
              {rowLabel('Delta', 'vs Current')}
              {buyerCols.map((c) => deltaCell(result.total - c.result.total, c.isHighlight, c.isCurrent))}
            </div>

            {/* Row: Top Band */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', gap: 4 }}>
              {rowLabel('Top Band', 'Highest tier')}
              {buyerCols.map((c, i) => colCell(
                <div key={i}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, ...NUM }}>
                    {(topBandRate(c.result) * 100).toFixed(0)}%
                  </div>
                  <BandDots r={c.result} />
                </div>,
                c.isHighlight, c.isCurrent
              ))}
            </div>

            {/* Row: Eligibility */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', gap: 4 }}>
              {rowLabel('Eligibility', 'Live check')}
              {buyerCols.map((c) => {
                const elig = eligibilityFor(c.bType);
                return colCell(
                  <div style={{ textAlign: 'center' as const }}>
                    <div style={{ fontSize: 14, color: elig.color }}>{elig.icon}</div>
                    <div style={{ fontSize: 9.5, color: elig.color, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{elig.label}</div>
                  </div>,
                  c.isHighlight, c.isCurrent
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* By Region tab */}
      {tab === 'region' && (
        <div style={{ padding: '12px 16px 16px' }}>
          {[
            { label: 'England & NI', sub: 'SDLT', r: engR, active: country === 'england' },
            { label: 'Scotland', sub: 'LBTT', r: scoR, active: country === 'scotland' },
            { label: 'Wales', sub: 'LTT', r: walR, active: country === 'wales' },
          ].map((col) => (
            <div key={col.sub} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 14px', marginBottom: 8,
              background: col.active ? T.blueT : T.surface,
              border: `1.5px solid ${col.active ? T.blue : T.hair}`,
              borderRadius: 10,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: col.active ? T.blue : T.ink }}>{col.label}</div>
                <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{col.sub} · {(col.r.effectiveRate * 100).toFixed(2)}% effective</div>
                {col.r.total !== result.total && (
                  <div style={{
                    fontSize: 10.5, fontWeight: 700, marginTop: 4,
                    color: col.r.total < result.total ? T.blue : T.rose,
                    ...NUM,
                  }}>
                    {col.r.total < result.total ? `Save ${gbp(result.total - col.r.total)}` : `+${gbp(col.r.total - result.total)} extra`}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' as const }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: col.active ? T.blue : T.ink, letterSpacing: '-0.02em', ...NUM }}>
                  {gbp(col.r.total)}
                </div>
              </div>
            </div>
          ))}
          <p style={{ fontSize: 11, color: T.faint, margin: '8px 0 0', lineHeight: 1.5 }}>
            Comparison uses same price and buyer type across all three tax regimes.
          </p>
        </div>
      )}

      {/* Price ±10% tab */}
      {tab === 'price' && (
        <div style={{ padding: '12px 16px 16px' }}>
          {[
            { label: '−10%', price: price * 0.9, r: minus10R },
            { label: 'Current', price, r: result },
            { label: '+10%', price: price * 1.1, r: plus10R },
          ].map((col) => {
            const isCurrent = col.label === 'Current';
            const delta = col.r.total - result.total;
            return (
              <div key={col.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 14px', marginBottom: 8,
                background: isCurrent ? T.blueT : T.surface,
                border: `1.5px solid ${isCurrent ? T.blue : T.hair}`,
                borderRadius: 10,
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isCurrent ? T.blue : T.ink }}>{col.label} · {fmtK(col.price)}</div>
                  <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>
                    {(col.r.effectiveRate * 100).toFixed(2)}% effective rate
                  </div>
                  {!isCurrent && (
                    <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 4, color: delta < 0 ? T.blue : T.rose, ...NUM }}>
                      {delta < 0 ? `Save ${gbp(-delta)}` : `+${gbp(delta)} extra`}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: isCurrent ? T.blue : T.ink, letterSpacing: '-0.02em', ...NUM }}>
                  {gbp(col.r.total)}
                </div>
              </div>
            );
          })}
          <p style={{ fontSize: 11, color: T.faint, margin: '8px 0 0', lineHeight: 1.5 }}>
            Shows tax impact of a ±10% price movement with same buyer profile.
          </p>
        </div>
      )}

      {/* Best for you callout */}
      {bestSaving > 0 && !alreadyBest && (
        <div style={{
          margin: '0 16px 16px',
          padding: '14px 16px',
          background: T.blueT, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 12,
          border: `1px solid ${T.blueT2}`,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} color={T.paper} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: T.blue, letterSpacing: '0.10em', textTransform: 'uppercase' }}>BEST FOR YOU</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: T.blue, color: T.paper, letterSpacing: '0.05em' }}>AI MATCH</span>
            </div>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.5 }}>
              {buyerLabel(bestScen.buyerType)} saves you{' '}
              <strong style={{ color: T.blue, ...NUM }}>{gbp(bestSaving)}</strong>
              {' '}vs the standard rate.
            </div>
          </div>
          <button type="button" onClick={() => onApply(bestScen.buyerType)}
            style={{
              padding: '8px 14px', borderRadius: 8,
              background: T.blue, color: T.paper,
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
            }}>
            Apply <ArrowRight size={12} />
          </button>
        </div>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════ */
function Card({
  children, padding = 24, id,
}: { children: React.ReactNode; padding?: number; id?: string }) {
  return (
    <div id={id} style={{
      background: T.paper,
      border: `1px solid ${T.hair}`,
      borderRadius: 16,
      boxShadow: T.shadow,
      padding,
      overflow: 'hidden',
      transition: 'box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: T.muted,
      letterSpacing: '0.10em', textTransform: 'uppercase',
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function AdvToggle({
  on, onChange, label, desc,
}: { on: boolean; onChange: (v: boolean) => void; label: string; desc: string }) {
  return (
    <button type="button" role="switch" aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '10px 0', width: '100%',
        background: 'transparent', border: 'none',
        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      }}>
      <span style={{
        position: 'relative', width: 32, height: 18, borderRadius: 999,
        background: on ? T.blue : T.ghost, flexShrink: 0, marginTop: 1,
        transition: 'background 0.18s ease',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: 2,
          width: 14, height: 14, borderRadius: '50%',
          background: T.paper, boxShadow: T.shadowSm,
          transform: on ? 'translateX(14px)' : 'translateX(0)',
          transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: T.ink, lineHeight: 1.3 }}>{label}</span>
        <span style={{ display: 'block', fontSize: 11.5, color: T.muted, marginTop: 2, lineHeight: 1.45 }}>{desc}</span>
      </span>
    </button>
  );
}

function StepHeader({ n, title, icon }: { n: number; title: string; icon: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 22, height: 22, borderRadius: '50%',
        background: T.blueT, color: T.blue,
        fontSize: 11, fontWeight: 800, ...NUM,
        flexShrink: 0,
      }}>{n}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>
        {title}
      </span>
      <span style={{ fontSize: 14, lineHeight: 1, opacity: 0.7 }} aria-hidden="true">{icon}</span>
    </div>
  );
}

function BuyerChip({
  on, onChange, label, tip, badge, disabled,
}: {
  on: boolean; onChange: (v: boolean) => void;
  label: string; tip: string; badge: string; disabled?: boolean;
}) {
  return (
    <label
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 10,
        background: on ? T.blueT : T.paper,
        border: `1.5px solid ${on ? T.blue : T.hair}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s ease',
      }}>
      <input type="checkbox" checked={on} disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 18, height: 18, accentColor: T.blue,
          cursor: disabled ? 'not-allowed' : 'pointer', flexShrink: 0,
          margin: 0,
        }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: on ? T.blue : T.ink, lineHeight: 1.3 }}>
            {label}
          </span>
          <span title={tip} style={{
            display: 'inline-flex', cursor: 'help', color: T.faint,
            transition: 'color 0.15s',
          }}>
            <Info size={12} />
          </span>
        </span>
      </span>
      <span style={{
        fontSize: 10.5, fontWeight: 700, ...NUM,
        padding: '3px 8px', borderRadius: 6,
        background: on ? T.blue : T.surface,
        color: on ? T.paper : T.muted,
        whiteSpace: 'nowrap',
      }}>{badge}</span>
    </label>
  );
}

/* Lightweight band tracker — shows position of user's price within the
   first 5 SDLT/LBTT/LTT bands (truncated at £1.5m for visual clarity). */
function BandPositionTracker({ price, country }: { price: number; country: Country }) {
  const BANDS: Record<Country, { upTo: number; rate: number; label: string }[]> = {
    england: [
      { upTo: 250_000,   rate: 0,  label: '0%' },
      { upTo: 925_000,   rate: 5,  label: '5%' },
      { upTo: 1_500_000, rate: 10, label: '10%' },
      { upTo: 2_000_000, rate: 12, label: '12%' },
    ],
    scotland: [
      { upTo: 145_000,   rate: 0,  label: '0%' },
      { upTo: 250_000,   rate: 2,  label: '2%' },
      { upTo: 325_000,   rate: 5,  label: '5%' },
      { upTo: 750_000,   rate: 10, label: '10%' },
      { upTo: 2_000_000, rate: 12, label: '12%' },
    ],
    wales: [
      { upTo: 225_000,   rate: 0,  label: '0%' },
      { upTo: 400_000,   rate: 6,  label: '6%' },
      { upTo: 750_000,   rate: 7.5, label: '7.5%' },
      { upTo: 1_500_000, rate: 10, label: '10%' },
      { upTo: 2_000_000, rate: 12, label: '12%' },
    ],
  };
  const bands = BANDS[country];
  const max = bands[bands.length - 1].upTo;
  const pct = Math.min(100, (price / max) * 100);

  // Find current band index
  const currentIdx = bands.findIndex(b => price <= b.upTo);
  const activeIdx = currentIdx === -1 ? bands.length - 1 : currentIdx;

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        position: 'relative', height: 6, borderRadius: 999,
        background: T.surface, overflow: 'hidden',
      }}>
        {/* Band segments */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {bands.map((b, i) => {
            const prev = i === 0 ? 0 : bands[i - 1].upTo;
            const width = ((b.upTo - prev) / max) * 100;
            const isActive = i === activeIdx;
            return (
              <div key={i} style={{
                width: `${width}%`,
                background: isActive ? T.blue : i < activeIdx ? T.blueDk : 'transparent',
                opacity: isActive ? 1 : i < activeIdx ? 0.45 : 0,
                borderRight: i < bands.length - 1 ? `1px solid ${T.paper}` : 'none',
                transition: 'all 0.25s ease',
              }} />
            );
          })}
        </div>
        {/* Position marker */}
        <div style={{
          position: 'absolute', top: -3, left: `calc(${pct}% - 6px)`,
          width: 12, height: 12, borderRadius: '50%',
          background: T.paper, border: `2.5px solid ${T.blue}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          transition: 'left 0.25s ease',
        }} aria-hidden="true" />
      </div>
      <div style={{
        marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: T.muted,
      }}>
        <span style={{
          display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
          background: T.blue,
        }} />
        <span>
          You&apos;re in the <strong style={{ color: T.ink, fontWeight: 700 }}>
            {bands[activeIdx].label} band
          </strong> ({country === 'england' ? 'SDLT' : country === 'scotland' ? 'LBTT' : 'LTT'})
        </span>
      </div>
    </div>
  );
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

const wrap: React.CSSProperties = {
  width: '100%',
  padding: '0 clamp(12px, 3vw, 48px)',
  boxSizing: 'border-box',
};
