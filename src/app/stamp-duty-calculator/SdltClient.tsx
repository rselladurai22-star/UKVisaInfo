'use client';

/**
 * Stamp Duty Calculator — Linear/Vercel-grade product surface (May 2026).
 *
 * Design language: zinc palette, Inter with cv11+ss01 features, real
 * toggle switches, segmented controls, hero-sized result number, soft
 * 1px shadows, hairline internal dividers. Calculator is the product.
 */

import { useMemo, useState } from 'react';
import {
  Check, Sparkles, ArrowUpRight, TrendingDown, TrendingUp, Info,
  AlertCircle,
} from 'lucide-react';
import {
  calculateSDLT, calculateAllScenarios, calculateAllCountries, calculateRefund,
  COUNTRY_LABEL,
  type BuyerType, type Country, type SDLTResult,
} from '../../lib/sdlt/calc';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — zinc/neutral, premium
───────────────────────────────────────────── */
const T = {
  // Text (true neutral, Linear/Vercel style)
  black:   '#09090B',
  ink:     '#18181B',
  body:    '#3F3F46',
  muted:   '#71717A',
  faint:   '#A1A1AA',
  ghost:   '#D4D4D8',

  // Surfaces
  paper:   '#FFFFFF',
  surface: '#FAFAFA',
  page:    '#F4F4F5',

  // Borders
  hair:    '#E4E4E7',
  divide:  '#F4F4F5',

  // Brand (used sparingly — kept emerald for site consistency)
  brand:   '#047857',
  brandH:  '#065F46',
  brandT:  '#ECFDF5',

  // Accents
  warn:    '#B45309',
  warnT:   '#FEF3C7',
  danger:  '#B91C1C',
  dangerT: '#FEE2E2',

  // Shadows
  shadowSm: '0 1px 2px rgba(9,9,11,0.04)',
  shadow:   '0 1px 3px rgba(9,9,11,0.05), 0 1px 2px rgba(9,9,11,0.04)',
  shadowMd: '0 4px 12px -2px rgba(9,9,11,0.08), 0 2px 4px rgba(9,9,11,0.04)',
  ring:     '0 0 0 3px rgba(4,120,87,0.12)',
};

const FONT_FEAT: React.CSSProperties = {
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  fontFeatureSettings: '"cv11", "ss01"',
};

const NUM: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"cv11", "ss01", "tnum"',
};

const gbp  = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const pct  = (n: number) => (n * 100).toFixed(2) + '%';
const fmtK = (n: number) => n >= 1_000_000 ? `£${(n/1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}m` : `£${(n/1000).toFixed(0)}k`;

/* Band colour scale (cool → warm, premium gradient) */
function bandColour(rate: number): string {
  if (rate === 0)   return '#F4F4F5';
  if (rate <= 0.02) return '#ECFDF5';
  if (rate <= 0.05) return '#D1FAE5';
  if (rate <= 0.075) return '#A7F3D0';
  if (rate <= 0.10) return '#6EE7B7';
  return '#34D399';
}

/* ─────────────────────────────────────────────
   STATE DERIVATION
   Toggle flags compose to a buyer type
───────────────────────────────────────────── */
interface Flags {
  ftb: boolean;
  additional: boolean;
  nonResident: boolean;
  mixedUse: boolean;
  company: boolean;
}

function deriveBuyerType(f: Flags): BuyerType {
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
    standard:    'Standard buyer',
    firstTime:   'First-time buyer',
    additional:  'Additional property',
    nonResident: 'Non-UK resident',
    addNonRes:   'Additional + Non-resident',
    mixedUse:    'Mixed-use property',
    company:     'Company-owned dwelling',
  }[b];
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
export default function SdltClient({ initialPrice = 350000 }: { initialPrice?: number }) {
  const [price, setPrice]     = useState(initialPrice);
  const [country, setCountry] = useState<Country>('england');
  const [flags, setFlags] = useState<Flags>({
    ftb: false,
    additional: false,
    nonResident: false,
    mixedUse: false,
    company: false,
  });

  const buyer    = deriveBuyerType(flags);
  const result   = useMemo(() => calculateSDLT(price, buyer, country), [price, buyer, country]);
  const allScen  = useMemo(() => calculateAllScenarios(price, country), [price, country]);
  const allCtry  = useMemo(() => calculateAllCountries(price, buyer), [price, buyer]);

  const stdResult = allScen.find((r) => r.buyerType === 'standard')!;
  const ftbResult = allScen.find((r) => r.buyerType === 'firstTime')!;

  /* Smart insights derived live */
  const insights = useMemo(() => {
    const items: { tone: 'good' | 'warn' | 'info'; label: string; detail: string }[] = [];
    if (!flags.ftb && !flags.additional && !flags.nonResident && price <= 500_000) {
      const saving = stdResult.total - ftbResult.total;
      if (saving > 0) items.push({ tone: 'good', label: `Save ${gbp(saving)} as a first-time buyer`, detail: 'If eligible, FTB relief replaces standard rates' });
    }
    if (flags.ftb && price > 500_000) {
      items.push({ tone: 'warn', label: 'FTB relief lost above £500k cap', detail: 'Standard rates apply to the full price' });
    }
    if (flags.additional) {
      items.push({ tone: 'info', label: 'Refund window: 36 months', detail: 'Sell previous main home to reclaim the 3% surcharge' });
    }
    const deadline = result.country === 'england' ? '14 days' : '30 days';
    items.push({ tone: 'info', label: `Filing deadline ${deadline}`, detail: 'From the effective date of the transaction' });
    return items.slice(0, 3);
  }, [flags, price, result.country, stdResult.total, ftbResult.total]);

  return (
    <div style={FONT_FEAT}>

      {/* ═══ THE CALCULATOR — single big card ═══ */}
      <div style={{
        background: T.paper, borderRadius: 16,
        border: `1px solid ${T.hair}`,
        boxShadow: T.shadow,
        overflow: 'hidden',
      }}>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">

          {/* ─── INPUTS PANEL (left) ─── */}
          <div style={{ background: T.surface, padding: 'clamp(24px, 3vw, 32px)' }}>

            {/* Region segmented control */}
            <Field label="Region">
              <Segmented
                value={country}
                onChange={(v) => setCountry(v as Country)}
                options={[
                  { id: 'england',  label: 'England & NI', sub: 'SDLT' },
                  { id: 'scotland', label: 'Scotland',     sub: 'LBTT' },
                  { id: 'wales',    label: 'Wales',        sub: 'LTT'  },
                ]}
              />
            </Field>

            {/* Price */}
            <Field label="Property price" topGap={28}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 400, color: T.faint, lineHeight: 1, ...NUM }}>£</span>
                <input
                  type="number" inputMode="decimal"
                  value={price || ''}
                  onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                  min={0} step={5000}
                  style={{
                    flex: 1, minWidth: 0, ...NUM,
                    fontSize: 32, fontWeight: 600, color: T.black,
                    background: 'transparent', border: 'none', outline: 'none',
                    fontFamily: 'inherit', letterSpacing: '-0.025em',
                    padding: 0, lineHeight: 1.1,
                  }}
                />
              </div>
              <input
                type="range" value={price}
                onChange={(e) => setPrice(+e.target.value)}
                min={50_000} max={2_000_000} step={5000}
                style={{ width: '100%', marginTop: 16, accentColor: T.brand, cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.faint, marginTop: 6, ...NUM }}>
                {[50_000, 250_000, 500_000, 1_000_000, 2_000_000].map((v) => (
                  <span key={v}>{fmtK(v)}</span>
                ))}
              </div>
            </Field>

            {/* Status toggles */}
            <Field label="Your status" topGap={32}>
              <div style={{ display: 'grid', gap: 4 }}>
                <Toggle
                  on={flags.ftb}
                  onChange={(v) => setFlags({ ...flags, ftb: v, additional: v ? false : flags.additional })}
                  disabled={flags.mixedUse || flags.company}
                  label="First-time buyer"
                  desc="Never owned a residential property anywhere"
                />
                <Toggle
                  on={flags.additional}
                  onChange={(v) => setFlags({ ...flags, additional: v, ftb: v ? false : flags.ftb })}
                  disabled={flags.mixedUse || flags.company}
                  label="I own other property"
                  desc="Buy-to-let, second home, inherited share"
                />
                <Toggle
                  on={flags.nonResident}
                  onChange={(v) => setFlags({ ...flags, nonResident: v })}
                  disabled={flags.mixedUse || flags.company || country !== 'england'}
                  label="Non-UK resident"
                  desc="Less than 183 days in UK in past 12 months"
                />
                <Toggle
                  on={flags.mixedUse}
                  onChange={(v) => setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: v, company: false })}
                  label="Mixed-use property"
                  desc="Has substantive commercial element"
                />
                <Toggle
                  on={flags.company}
                  onChange={(v) => setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: false, company: v })}
                  label="Bought through a company"
                  desc="Non-natural person, possible 15% flat"
                />
              </div>
            </Field>

            {/* Active scenario tag */}
            <div style={{
              marginTop: 28, padding: '10px 14px',
              background: T.paper, border: `1px solid ${T.hair}`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Active scenario
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginTop: 2 }}>
                  {buyerLabel(buyer)}
                </div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                background: T.brandT, color: T.brand,
              }}>{result.taxName}</span>
            </div>
          </div>

          {/* ─── RESULT CANVAS (right) ─── */}
          <div style={{
            padding: 'clamp(28px, 3.5vw, 40px)',
            display: 'flex', flexDirection: 'column',
            borderTop: `1px solid ${T.hair}`,
          }} className="lg:border-t-0 lg:border-l">

            {/* Result number */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                You&apos;ll pay
              </div>
              <div style={{
                fontSize: 'clamp(48px, 8vw, 88px)',
                fontWeight: 700, color: T.black,
                lineHeight: 0.95, letterSpacing: '-0.045em',
                marginTop: 12,
                ...NUM,
              }}>
                {gbp(result.total)}
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: T.muted, alignItems: 'center' }}>
                <span>On <strong style={{ color: T.ink, fontWeight: 600 }}>{gbp(price)}</strong> purchase</span>
                <Dot />
                <span>Effective <strong style={{ color: T.ink, fontWeight: 600, ...NUM }}>{pct(result.effectiveRate)}</strong></span>
                {price > 0 && (
                  <>
                    <Dot />
                    <span style={NUM}>£{(result.total / price * 1000).toFixed(0)} per £1k of price</span>
                  </>
                )}
              </div>
            </div>

            {/* Band breakdown chart */}
            {result.bands.length > 0 && (
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${T.divide}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                    How it&apos;s calculated
                  </div>
                  <div style={{ fontSize: 11, color: T.faint }}>
                    {result.bands.length} band{result.bands.length === 1 ? '' : 's'} applied
                  </div>
                </div>

                {/* Visual stacked bar */}
                <div style={{
                  display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden',
                  background: T.divide,
                }}>
                  {result.bands.map((b, i) => (
                    <div key={i} style={{
                      width: `${(b.taxOn / price) * 100}%`,
                      background: bandColour(b.rate),
                      borderRight: i < result.bands.length - 1 ? `1px solid ${T.paper}` : 'none',
                    }} />
                  ))}
                </div>

                {/* Band rows */}
                <div style={{ marginTop: 14, display: 'grid', gap: 4 }}>
                  {result.bands.map((b, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 12,
                      alignItems: 'center', padding: '8px 0',
                      borderBottom: i < result.bands.length - 1 ? `1px solid ${T.divide}` : 'none',
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: bandColour(b.rate) }} />
                      <span style={{ fontSize: 13, color: T.body }}>{b.label}</span>
                      <span style={{ fontSize: 12, color: T.faint, ...NUM }}>{gbp(b.taxOn)}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...NUM, minWidth: 76, textAlign: 'right' }}>
                        {gbp(b.tax)}
                      </span>
                    </div>
                  ))}
                  {result.surchargeAmount > 0 && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 12,
                      alignItems: 'center', padding: '10px 12px', marginTop: 4,
                      background: T.warnT, borderRadius: 6,
                    }}>
                      <AlertCircle size={10} style={{ color: T.warn }} />
                      <span style={{ fontSize: 13, color: T.warn, fontWeight: 500 }}>{result.surchargeLabel}</span>
                      <span style={{ fontSize: 12, color: T.warn, ...NUM }}>{gbp(price)}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.warn, ...NUM, minWidth: 76, textAlign: 'right' }}>
                        {gbp(result.surchargeAmount)}
                      </span>
                    </div>
                  )}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 12,
                    alignItems: 'center', padding: '12px 0 0', marginTop: 4,
                  }}>
                    <span />
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.black }}>Total {result.taxName}</span>
                    <span />
                    <span style={{ fontSize: 18, fontWeight: 700, color: T.black, ...NUM, minWidth: 76, textAlign: 'right', letterSpacing: '-0.015em' }}>
                      {gbp(result.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Inline smart insights */}
            {insights.length > 0 && (
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${T.divide}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Smart insights
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {insights.map((it, i) => {
                    const styles = {
                      good: { bg: T.brandT, fg: T.brand, Icon: Sparkles },
                      warn: { bg: T.warnT, fg: T.warn, Icon: AlertCircle },
                      info: { bg: T.surface, fg: T.muted, Icon: Info },
                    }[it.tone];
                    const Icon = styles.Icon;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '12px 14px', borderRadius: 8,
                        background: styles.bg,
                        border: it.tone === 'info' ? `1px solid ${T.hair}` : 'none',
                      }}>
                        <Icon size={14} style={{ color: styles.fg, marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, lineHeight: 1.4 }}>{it.label}</div>
                          <div style={{ fontSize: 12, color: T.muted, marginTop: 2, lineHeight: 1.5 }}>{it.detail}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SUPPORTING STRIPS — compact, scannable
      ═══════════════════════════════════════════════════════════════ */}

      {/* Scenario explorer */}
      <CompactStrip title="All scenarios at this price" caption="Tap to switch" topGap={24}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, background: T.hair, borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.hair}` }}>
          {allScen.map((r) => {
            const active = r.buyerType === buyer;
            const delta = r.total - stdResult.total;
            return (
              <button key={r.buyerType} type="button"
                onClick={() => {
                  if (r.buyerType === 'standard')    setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: false, company: false });
                  else if (r.buyerType === 'firstTime')   setFlags({ ftb: true,  additional: false, nonResident: false, mixedUse: false, company: false });
                  else if (r.buyerType === 'additional')  setFlags({ ftb: false, additional: true,  nonResident: false, mixedUse: false, company: false });
                  else if (r.buyerType === 'nonResident') setFlags({ ftb: false, additional: false, nonResident: true,  mixedUse: false, company: false });
                  else if (r.buyerType === 'addNonRes')   setFlags({ ftb: false, additional: true,  nonResident: true,  mixedUse: false, company: false });
                  else if (r.buyerType === 'mixedUse')    setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: true,  company: false });
                  else if (r.buyerType === 'company')     setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: false, company: true  });
                }}
                style={{
                  background: active ? T.black : T.paper,
                  color: active ? T.paper : T.ink,
                  padding: '16px 18px', textAlign: 'left',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.15s ease',
                }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: active ? '#A1A1AA' : T.muted, lineHeight: 1.3 }}>
                  {buyerLabel(r.buyerType)}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: '-0.02em', ...NUM }}>
                  {gbp(r.total)}
                </div>
                <div style={{ marginTop: 6, fontSize: 11, ...NUM, color: active ? '#A1A1AA' : (delta > 0 ? T.warn : delta < 0 ? T.brand : T.muted) }}>
                  {delta === 0 ? `${pct(r.effectiveRate)} effective` : `${delta > 0 ? '+' : ''}${gbp(delta)} vs standard`}
                </div>
              </button>
            );
          })}
        </div>
      </CompactStrip>

      {/* Country comparison */}
      <CompactStrip title="Across the UK at this price" caption={`${gbp(price)} · ${buyerLabel(buyer)}`} topGap={20}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {allCtry.map((r) => {
            const active = r.country === country;
            return (
              <button key={r.country} type="button" onClick={() => setCountry(r.country)}
                style={{
                  background: T.paper,
                  border: `1px solid ${active ? T.black : T.hair}`,
                  borderRadius: 12, padding: '18px 20px',
                  textAlign: 'left', cursor: 'pointer',
                  fontFamily: 'inherit', boxShadow: active ? T.shadowMd : T.shadowSm,
                  transition: 'all 0.15s ease',
                }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, letterSpacing: '-0.005em' }}>
                    {COUNTRY_LABEL[r.country]}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: T.muted, letterSpacing: '0.08em' }}>
                    {r.taxName}
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: T.black, letterSpacing: '-0.025em', ...NUM, lineHeight: 1 }}>
                  {gbp(r.total)}
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: T.muted, ...NUM, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Effective {pct(r.effectiveRate)}</span>
                  {r.surchargeAmount > 0 && (
                    <>
                      <Dot />
                      <span style={{ color: T.warn }}>+{gbp(r.surchargeAmount)} surcharge</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CompactStrip>

      {/* Refund tool — conditional */}
      {(buyer === 'additional' || buyer === 'addNonRes') && (
        <CompactStrip title="Reclaim the 3% surcharge" caption="If you sold your previous main home within 36 months" topGap={20}>
          <RefundTool defaultPrice={price} />
        </CompactStrip>
      )}

      {/* Quick reference */}
      <CompactStrip title="Quick reference" topGap={20}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, background: T.hair, borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.hair}` }}>
          {[
            { label: 'Filing deadline',  value: country === 'england' ? '14 days' : '30 days', sub: 'from completion' },
            { label: 'Late penalty',     value: '£100',  sub: 'rising to 100% of tax' },
            { label: 'Refund window',    value: '36 months', sub: '3% surcharge reclaim' },
            { label: 'Min price taxed',  value: country === 'england' ? '£125k' : country === 'scotland' ? '£145k' : '£225k', sub: 'nil-rate band' },
            { label: 'Filed by',         value: 'Solicitor', sub: 'as part of completion' },
          ].map((r, i) => (
            <div key={i} style={{ background: T.paper, padding: '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {r.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.black, marginTop: 6, ...NUM, letterSpacing: '-0.015em' }}>
                {r.value}
              </div>
              <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>{r.sub}</div>
            </div>
          ))}
        </div>
      </CompactStrip>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════ */

function Field({ label, children, topGap = 0 }: { label: string; children: React.ReactNode; topGap?: number }) {
  return (
    <div style={{ marginTop: topGap }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Segmented({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void;
  options: { id: string; label: string; sub?: string }[];
}) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      gap: 4, padding: 4,
      background: T.page, borderRadius: 10,
    }}>
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button key={o.id} type="button" onClick={() => onChange(o.id)}
            style={{
              padding: '8px 10px', borderRadius: 6,
              background: active ? T.paper : 'transparent',
              color: active ? T.ink : T.muted,
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: active ? T.shadowSm : 'none',
              transition: 'all 0.12s ease',
            }}>
            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>{o.label}</div>
            {o.sub && <div style={{ fontSize: 10, color: active ? T.faint : T.faint, marginTop: 2, letterSpacing: '0.06em' }}>{o.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  on, onChange, label, desc, disabled = false,
}: {
  on: boolean; onChange: (v: boolean) => void;
  label: string; desc: string; disabled?: boolean;
}) {
  return (
    <button type="button" role="switch" aria-checked={on}
      onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '10px 0', width: '100%',
        background: 'transparent', border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontFamily: 'inherit', textAlign: 'left',
      }}>
      <span style={{
        position: 'relative', width: 32, height: 18, borderRadius: 999,
        background: on ? T.brand : T.ghost,
        flexShrink: 0, marginTop: 1,
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
        <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, lineHeight: 1.3 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2, lineHeight: 1.45 }}>{desc}</div>
      </span>
    </button>
  );
}

function Dot() {
  return <span style={{ width: 2, height: 2, borderRadius: 999, background: T.ghost }} />;
}

function CompactStrip({
  title, caption, topGap, children,
}: { title: string; caption?: string; topGap: number; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: topGap }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, padding: '0 4px' }}>
        <h2 style={{
          fontSize: 14, fontWeight: 600, color: T.ink,
          letterSpacing: '-0.005em', margin: 0,
        }}>
          {title}
        </h2>
        {caption && (
          <span style={{ fontSize: 12, color: T.muted, ...NUM }}>{caption}</span>
        )}
      </div>
      {children}
    </section>
  );
}

/* Refund eligibility tool */
function RefundTool({ defaultPrice }: { defaultPrice: number }) {
  const [price, setPrice]       = useState(defaultPrice);
  const [months, setMonths]     = useState(8);
  const [sold, setSold]         = useState(true);
  const [resident, setResident] = useState(true);

  const r = useMemo(() => calculateRefund({
    purchasePrice: price, monthsSincePurchase: months,
    isUKResident: resident, hasSoldOldHome: sold,
  }), [price, months, sold, resident]);

  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.hair}`,
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            <Field label="Property price">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.faint, fontSize: 14 }}>£</span>
                <input type="number" value={price || ''} onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                  style={{
                    width: '100%', fontSize: 14, padding: '8px 12px 8px 24px',
                    border: `1px solid ${T.hair}`, borderRadius: 6, outline: 'none',
                    color: T.ink, ...NUM, background: T.paper,
                    fontFamily: 'inherit',
                  }} />
              </div>
            </Field>
            <Field label="Months since purchase">
              <input type="number" min={0} max={60} value={months}
                onChange={(e) => setMonths(Math.max(0, +e.target.value || 0))}
                style={{
                  width: '100%', fontSize: 14, padding: '8px 12px',
                  border: `1px solid ${T.hair}`, borderRadius: 6, outline: 'none',
                  color: T.ink, ...NUM, background: T.paper,
                  fontFamily: 'inherit',
                }} />
              <input type="range" min={0} max={60} value={months}
                onChange={(e) => setMonths(+e.target.value)}
                style={{ width: '100%', marginTop: 8, accentColor: T.brand }} />
            </Field>
          </div>
          <div style={{ marginTop: 16, display: 'grid', gap: 4 }}>
            <Toggle on={sold} onChange={setSold} label="Sold previous main home within 36 months" desc="Required for refund eligibility" />
            <Toggle on={resident} onChange={setResident} label="UK-resident at refund claim date" desc="Tested under SDLT-specific residence rules" />
          </div>
        </div>
        <div style={{
          background: r.eligible ? T.brandT : T.surface,
          padding: 24,
          borderTop: `1px solid ${T.hair}`,
        }} className="lg:border-t-0 lg:border-l">
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
            color: r.eligible ? T.brand : T.muted,
          }}>
            {r.eligible ? 'Eligible' : 'Not eligible'}
          </div>
          <div style={{
            fontSize: 36, fontWeight: 700, color: T.black,
            marginTop: 8, letterSpacing: '-0.025em', lineHeight: 1, ...NUM,
          }}>
            {gbp(r.refundAmount)}
          </div>
          <div style={{ fontSize: 11.5, color: T.muted, marginTop: 8, lineHeight: 1.55 }}>
            Potential refund of the 3% additional-property surcharge.
          </div>
        </div>
      </div>
    </div>
  );
}
