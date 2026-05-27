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
  Settings, ArrowRight, ArrowUpRight, TrendingUp, TrendingDown,
  Home, Sparkles, ChevronDown, Info,
} from 'lucide-react';
import {
  calculateSDLT, calculateAllScenarios, calculateAllCountries, calculateRefund,
  COUNTRY_LABEL,
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
  const stdRes   = allScen.find((r) => r.buyerType === 'standard')!;
  const ftbRes   = allScen.find((r) => r.buyerType === 'firstTime')!;

  return (
    <div style={{ ...FONT, color: T.ink, background: T.page, paddingBottom: 32 }}>

      {/* ═══ HERO 3-COLUMN GRID ═══ */}
      <div style={wrap}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)_minmax(0,1fr)] gap-4 lg:gap-5">
          <CalculatorInputs
            country={country} setCountry={setCountry}
            flags={flags} setFlags={setFlags}
            price={price} setPrice={setPrice}
            mode={mode} setMode={setMode}
          />
          <TaxBreakdown result={result} price={price} />
          <WhatIfScenarios
            price={price} country={country} flags={flags}
            current={result.total} stdRes={stdRes} ftbRes={ftbRes}
            onApply={(b) => setFlags(flagsForBuyer(b))}
          />
        </div>
      </div>

      {/* ═══ LIVE TRACKER STRIP ═══ */}
      <div style={{ ...wrap, marginTop: 16 }}>
        <LiveTracker country={country} />
      </div>

      {/* ═══ TWO-COLUMN CHARTS ═══ */}
      <div style={{ ...wrap, marginTop: 16 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          <PriceSensitivityCard price={price} buyer={buyer} country={country} />
          <ComparativeLoadCard scenarios={allScen} current={buyer} />
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
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.015em' }}>
          Your purchase
        </h2>
        <button type="button" onClick={() => setMode(mode === 'simple' ? 'advanced' : 'simple')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 8,
            background: mode === 'advanced' ? T.blueT : 'transparent',
            color: mode === 'advanced' ? T.blue : T.muted,
            border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600,
            transition: 'all 0.15s ease',
          }}
          title="Toggle advanced mode"
          aria-label="Toggle advanced mode">
          <Settings size={13} />
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
  // Index map: which color belongs to each taxable band (only bands with tax > 0)
  const taxableIndexByBand = new Map<number, number>();
  let tIdx = 0;
  result.bands.forEach((b, i) => {
    if (b.tax > 0) {
      taxableIndexByBand.set(i, tIdx);
      tIdx += 1;
    }
  });

  return (
    <Card padding={0}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.hair}` }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.015em' }}>
          Tax Breakdown
        </h2>
      </div>
      <div style={{ padding: '32px 24px 24px' }}>

        {/* DONUT */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Donut result={result} />
        </div>

        {/* BAND ROWS — legend matched to donut wedges by color */}
        <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Breakdown by band
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {result.bands.filter((b) => b.taxOn > 0).map((b, i) => {
            // Find this band's original index to look up its donut color
            const origIdx = result.bands.indexOf(b);
            const colorIdx = taxableIndexByBand.get(origIdx);
            const swatchColor = b.tax > 0 && colorIdx !== undefined
              ? WEDGE_COLORS[colorIdx % WEDGE_COLORS.length]
              : T.ghost;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                background: b.tax > 0 ? T.surface : T.surface,
                borderRadius: 10,
                border: `1px solid ${T.divide}`,
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: swatchColor,
                }} />
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
   3. WHAT-IF SCENARIOS (right column)
═══════════════════════════════════════════════════════════════ */
function WhatIfScenarios({
  current, stdRes, ftbRes, price, country, flags, onApply,
}: {
  current: number; stdRes: SDLTResult; ftbRes: SDLTResult;
  price: number; country: Country; flags: Flags;
  onApply: (b: BuyerType) => void;
}) {
  const ftbDelta = current - ftbRes.total; // positive = saving by switching to FTB
  const additional = calculateSDLT(price, 'additional', country);
  const addDelta = additional.total - current;
  const nonRes = calculateSDLT(price, 'nonResident', country);
  const nonResDelta = nonRes.total - current;

  return (
    <Card padding={0}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.hair}` }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.015em' }}>
          What-if Scenarios
        </h2>
      </div>
      <div style={{ padding: 20, display: 'grid', gap: 10 }}>
        <ScenarioCard
          tone="purple" label="As a first-time buyer"
          value={gbp(ftbRes.total)}
          delta={ftbDelta > 0 ? `Save ${gbp(ftbDelta)}` : 'No saving available'}
          deltaTone="good"
          active={flags.ftb}
          onClick={() => onApply('firstTime')}
        />
        <ScenarioCard
          tone="amber" label="If additional property"
          value={gbp(additional.total)}
          delta={addDelta > 0 ? `Extra ${gbp(addDelta)}` : 'No change'}
          deltaTone="warn"
          active={flags.additional}
          onClick={() => onApply('additional')}
        />
        <ScenarioCard
          tone="rose" label="Non-UK resident"
          value={gbp(nonRes.total)}
          delta={nonResDelta > 0 ? `Extra ${gbp(nonResDelta)}` : 'Same'}
          deltaTone="warn"
          active={flags.nonResident}
          onClick={() => onApply('nonResident')}
        />

        {/* Compare all button */}
        <button type="button"
          onClick={() => {
            const el = document.getElementById('compare');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            marginTop: 8, padding: '12px 16px',
            background: T.surface, border: `1px solid ${T.hair}`,
            borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 13, fontWeight: 600, color: T.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          Compare All Scenarios
          <ArrowRight size={14} />
        </button>
      </div>
    </Card>
  );
}

function ScenarioCard({
  tone, label, value, delta, deltaTone, active, onClick,
}: {
  tone: 'purple' | 'amber' | 'rose';
  label: string; value: string; delta: string;
  deltaTone: 'good' | 'warn';
  active: boolean; onClick: () => void;
}) {
  const styles = {
    purple: { bg: T.purpleT, border: T.purple,  text: T.purple },
    amber:  { bg: T.amberT,  border: T.amber,   text: T.amber },
    rose:   { bg: T.roseT,   border: T.rose,    text: T.rose },
  }[tone];
  const deltaColor = deltaTone === 'good' ? T.emerald : T.amber;
  return (
    <button type="button" onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '16px 18px',
        background: styles.bg,
        border: `1.5px solid ${active ? styles.border : 'transparent'}`,
        borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.15s ease',
      }}>
      <div style={{
        fontSize: 10.5, fontWeight: 700, color: styles.text,
        letterSpacing: '0.10em', textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 28, fontWeight: 700, color: T.ink,
        letterSpacing: '-0.025em', ...NUM, lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: deltaColor, marginTop: 8, fontWeight: 600 }}>
        {delta.includes('Save') || delta.includes('Extra') ? (
          <>
            {delta.split(' ')[0]}{' '}
            <span style={{ color: deltaColor, fontWeight: 700, ...NUM }}>
              {delta.split(' ').slice(1).join(' ')}
            </span>
          </>
        ) : delta}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. LIVE TRACKER STRIP (full-width)
═══════════════════════════════════════════════════════════════ */
function LiveTracker({ country }: { country: Country }) {
  const items =
    country === 'scotland' ? [
      { label: 'LBTT nil-rate',  value: '£145k', delta: 'stable',       trend: 'flat' as const },
      { label: 'ADS surcharge',  value: '8%',    delta: '↑ from 6%',    trend: 'up' as const },
      { label: 'Filing window',  value: '30d',   delta: 'unchanged',    trend: 'flat' as const },
    ] :
    country === 'wales' ? [
      { label: 'LTT nil-rate',     value: '£225k', delta: 'highest UK', trend: 'flat' as const },
      { label: 'Higher-rate',      value: '5%',    delta: '↑ from 4%',  trend: 'up' as const },
      { label: 'Filing window',    value: '30d',   delta: 'unchanged',  trend: 'flat' as const },
    ] : [
      { label: 'SDLT nil-rate',    value: '£125k', delta: '↓ from £250k Apr 2025', trend: 'down' as const },
      { label: 'FTB cap',          value: '£500k', delta: 'unchanged',              trend: 'flat' as const },
      { label: 'Filing window',    value: '14d',   delta: 'unchanged',              trend: 'flat' as const },
    ];

  return (
    <Card padding={0}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${T.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.01em' }}>
            Live {country === 'england' ? 'SDLT' : country === 'scotland' ? 'LBTT' : 'LTT'} Rate Tracker
          </h2>
          <p style={{ fontSize: 12, color: T.muted, margin: '4px 0 0' }}>
            Current thresholds and year-on-year changes
          </p>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 12px', borderRadius: 999,
          background: T.emeraldT, color: T.emerald,
          fontSize: 11, fontWeight: 600,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: T.emerald }} />
          Live Updates
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: T.hair }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: T.paper, padding: '20px 24px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              {it.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8, gap: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: T.ink, letterSpacing: '-0.028em', ...NUM, lineHeight: 1 }}>
                {it.value}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 600,
                color: it.trend === 'up' ? T.amber : it.trend === 'down' ? T.emerald : T.muted,
              }}>
                {it.trend === 'up' && <TrendingUp size={11} />}
                {it.trend === 'down' && <TrendingDown size={11} />}
                {it.delta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. PRICE SENSITIVITY (area chart card)
═══════════════════════════════════════════════════════════════ */
function PriceSensitivityCard({ price, buyer, country }: { price: number; buyer: BuyerType; country: Country }) {
  const [range, setRange] = useState<10 | 25>(10);

  const points = useMemo(() => {
    const lo = price * (1 - range / 100);
    const hi = price * (1 + range / 100);
    const arr: { p: number; t: number }[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const p = lo + (i / steps) * (hi - lo);
      arr.push({ p, t: calculateSDLT(p, buyer, country).total });
    }
    return arr;
  }, [price, buyer, country, range]);

  const W = 720, H = 300;
  const PAD = { l: 56, r: 20, t: 20, b: 40 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const xs = points.map((p) => p.p);
  const ts = points.map((p) => p.t);
  const minP = Math.min(...xs), maxP = Math.max(...xs);
  const minT = 0;
  const maxT = Math.max(...ts) * 1.1 || 1;

  const xScale = (p: number) => PAD.l + ((p - minP) / (maxP - minP || 1)) * innerW;
  const yScale = (t: number) => PAD.t + innerH - ((t - minT) / (maxT - minT)) * innerH;

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.p).toFixed(2)} ${yScale(p.t).toFixed(2)}`).join(' ');
  const area = `${path} L ${xScale(maxP).toFixed(2)} ${yScale(0).toFixed(2)} L ${xScale(minP).toFixed(2)} ${yScale(0).toFixed(2)} Z`;

  const cx = xScale(price);
  const cy = yScale(calculateSDLT(price, buyer, country).total);

  const xTicks = 5;
  const xLabels = Array.from({ length: xTicks }, (_, i) => minP + (i / (xTicks - 1)) * (maxP - minP));

  return (
    <Card padding={0}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.015em' }}>
          Price Sensitivity
        </h2>
        <div style={{
          display: 'inline-flex', padding: 3, gap: 2,
          background: T.surface, borderRadius: 8,
        }}>
          {[10, 25].map((r) => (
            <button key={r} type="button" onClick={() => setRange(r as 10 | 25)}
              style={{
                padding: '5px 10px', borderRadius: 6,
                background: range === r ? T.paper : 'transparent',
                color: range === r ? T.ink : T.muted,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 11, fontWeight: 600,
                boxShadow: range === r ? T.shadowSm : 'none',
              }}>
              ±{r}%
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: 24 }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="psGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.blue} stopOpacity="0.20" />
              <stop offset="100%" stopColor={T.blue} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {[0.25, 0.5, 0.75].map((f, i) => {
            const y = PAD.t + innerH * (1 - f);
            return <line key={i} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={T.divide} strokeWidth="1" />;
          })}
          {/* Y labels */}
          {[0, 0.5, 1].map((f, i) => {
            const t = minT + (maxT - minT) * f;
            return <text key={i} x={PAD.l - 8} y={yScale(t) + 4} fontSize="10" fill={T.faint} textAnchor="end" style={NUM}>{fmtK(t)}</text>;
          })}
          {/* Area + curve */}
          <path d={area} fill="url(#psGrad)" />
          <path d={path} stroke={T.blue} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Current price marker */}
          <line x1={cx} y1={PAD.t} x2={cx} y2={PAD.t + innerH} stroke={T.blue} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <circle cx={cx} cy={cy} r="6" fill={T.paper} stroke={T.blue} strokeWidth="2.5" />
          {/* X labels */}
          {xLabels.map((p, i) => (
            <text key={i} x={xScale(p)} y={H - PAD.b + 18} fontSize="10" fill={T.faint} textAnchor="middle" style={NUM}>
              {fmtK(p)}
            </text>
          ))}
        </svg>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. COMPARATIVE LOAD (bar chart card)
═══════════════════════════════════════════════════════════════ */
function ComparativeLoadCard({ scenarios, current }: { scenarios: SDLTResult[]; current: BuyerType }) {
  const FEE_EST = 1500; // estimated conveyancing + searches
  const showing = scenarios.filter((s) => ['standard', 'firstTime', 'additional', 'nonResident'].includes(s.buyerType));
  const maxTotal = Math.max(...showing.map((s) => s.total + FEE_EST), 1);

  const W = 720, H = 300;
  const PAD = { l: 20, r: 20, t: 20, b: 56 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const bw = innerW / showing.length;
  const barW = bw * 0.5;

  return (
    <Card padding={0} id="compare">
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.hair}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: T.ink, margin: 0, letterSpacing: '-0.015em' }}>
          Comparative Load
        </h2>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: T.muted, fontWeight: 500 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: T.blue }} />
            SDLT
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: T.purple }} />
            Fees
          </span>
        </div>
      </div>
      <div style={{ padding: 24 }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Bars */}
          {showing.map((s, i) => {
            const totalH = ((s.total + FEE_EST) / maxTotal) * innerH;
            const sdltH = (s.total / maxTotal) * innerH;
            const feeH  = (FEE_EST  / maxTotal) * innerH;
            const x = PAD.l + bw * i + (bw - barW) / 2;
            const yBaseSdlt = PAD.t + innerH - sdltH;
            const yBaseFee  = PAD.t + innerH - sdltH - feeH;
            const active = s.buyerType === current;
            const labelShort = s.buyerType === 'standard' ? 'Standard' : s.buyerType === 'firstTime' ? 'FTB' : s.buyerType === 'additional' ? 'Additional' : 'Non-UK';
            return (
              <g key={s.buyerType} opacity={active ? 1 : 0.85}>
                {/* Fees segment */}
                {s.total + FEE_EST > 0 && (
                  <rect x={x} y={yBaseFee} width={barW} height={feeH} fill={T.purple} rx="2" />
                )}
                {/* SDLT segment */}
                {s.total > 0 && (
                  <rect x={x} y={yBaseSdlt} width={barW} height={sdltH} fill={active ? T.blueDk : T.blue} rx="2" />
                )}
                {/* If both zero, show small fee bar */}
                {s.total === 0 && (
                  <rect x={x} y={PAD.t + innerH - feeH} width={barW} height={feeH} fill={T.purple} rx="2" />
                )}
                {/* Label */}
                <text x={x + barW / 2} y={H - PAD.b + 18}
                  fontSize="11" fill={active ? T.ink : T.muted}
                  fontWeight={active ? 700 : 500}
                  textAnchor="middle">
                  {labelShort}
                </text>
                <text x={x + barW / 2} y={H - PAD.b + 34}
                  fontSize="10" fill={T.faint}
                  textAnchor="middle" style={NUM}>
                  {fmtK(s.total + FEE_EST)}
                </text>
              </g>
            );
          })}
        </svg>
        <div style={{ fontSize: 11, color: T.faint, marginTop: 8, textAlign: 'center' }}>
          Fees assumed at £{FEE_EST.toLocaleString()} (conveyancing + searches, indicative)
        </div>
      </div>
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
  maxWidth: 2400,
  margin: '0 auto',
  padding: '0 clamp(16px, 4vw, 96px)',
};
