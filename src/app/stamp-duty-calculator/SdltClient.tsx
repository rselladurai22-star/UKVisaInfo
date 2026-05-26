'use client';

/**
 * SDLT/LBTT/LTT calculator — product-experience redesign (May 2026).
 *
 *   Layout: full-width container · 3-column dashboard
 *   ────────────────────────────────────────────────────────
 *   Mobile:    inputs stack → result → context
 *   Tablet:    2-col (inputs+result | context)
 *   Desktop:   sticky inputs (320) | result flex | sticky context (360)
 *   Wide:      max 1640px, comfortable side rails
 *
 *   Components:
 *   – Configure panel (sticky left) — country tabs, scenario radios, price
 *   – Result panel (centre) — headline result, visual band chart, breakdown
 *   – Context panel (sticky right) — eligibility flags, savings insight,
 *     thresholds, next steps
 *   – Insights strip — 6 derived KPIs in cards
 *   – Scenario grid — all 7 buyer scenarios as interactive cards
 *   – Country grid — England / Scotland / Wales comparison cards
 *   – Timeline — visual purchase-to-payment stepper
 *   – Refund tool — eligibility checker as feature panel
 *   – Worked examples — 6 cards in a horizontal scroll strip
 */

import { useMemo, useState } from 'react';
import {
  ChevronRight, Check, X, AlertTriangle, TrendingUp, TrendingDown,
  Sparkles, FileText, Globe, Calendar, Calculator,
  ArrowRight, Info, Clock, ShieldCheck, Target,
} from 'lucide-react';
import {
  calculateSDLT, calculateAllScenarios, calculateAllCountries, calculateRefund,
  BUYER_LABEL, BUYER_DESC, COUNTRY_LABEL,
  type BuyerType, type Country, type SDLTResult,
} from '../../lib/sdlt/calc';

/* ─────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────── */
const T = {
  ink:      '#0A0E1F',
  body:     '#2D3748',
  muted:    '#64748B',
  faint:    '#94A3B8',
  paper:    '#FFFFFF',
  page:     '#F8FAFC',
  hair:     '#E2E8F0',
  divide:   '#F1F5F9',
  emerald:  '#047857',
  emeraldL: '#10B981',
  emeraldT: '#ECFDF5',
  gold:     '#B8860B',
  goldT:    '#FEF3C7',
  blue:     '#2563EB',
  blueT:    '#EFF6FF',
  warn:     '#D97706',
  warnT:    '#FEF3C7',
  danger:   '#DC2626',
  dangerT:  '#FEE2E2',
  shadow:   '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)',
  shadowLg: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.04)',
};

const FONT = 'Inter, system-ui, -apple-system, sans-serif';
const NUM  = 'tabular-nums';

const gbp  = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const gbp2 = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct  = (n: number) => (n * 100).toFixed(2) + '%';

const BUYERS: BuyerType[] = ['standard', 'firstTime', 'additional', 'nonResident', 'addNonRes', 'mixedUse', 'company'];

/* Band colour scale — sequential emerald intensity by rate */
function bandColour(rate: number): { bg: string; text: string } {
  if (rate === 0)       return { bg: '#F1F5F9', text: '#475569' };
  if (rate <= 0.02)     return { bg: '#D1FAE5', text: '#065F46' };
  if (rate <= 0.05)     return { bg: '#A7F3D0', text: '#064E3B' };
  if (rate <= 0.10)     return { bg: '#34D399', text: '#022C22' };
  return { bg: '#059669', text: '#FFFFFF' };
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
export default function SdltClient({ initialPrice = 350000 }: { initialPrice?: number }) {
  const [price, setPrice]     = useState(initialPrice);
  const [buyer, setBuyer]     = useState<BuyerType>('standard');
  const [country, setCountry] = useState<Country>('england');

  const result   = useMemo(() => calculateSDLT(price, buyer, country), [price, buyer, country]);
  const allScen  = useMemo(() => calculateAllScenarios(price, country), [price, country]);
  const allCtry  = useMemo(() => calculateAllCountries(price, buyer), [price, buyer]);

  const scenStandard = allScen.find((r) => r.buyerType === 'standard')!;
  const scenFtb      = allScen.find((r) => r.buyerType === 'firstTime')!;
  const scenAdd      = allScen.find((r) => r.buyerType === 'additional')!;

  return (
    <div style={{ fontFamily: FONT, color: T.ink }}>

      {/* ─────────── CALCULATOR DASHBOARD (3-column on lg+) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_360px] gap-4 lg:gap-6">

        {/* COL 1 — CONFIGURE */}
        <ConfigurePanel
          country={country} setCountry={setCountry}
          buyer={buyer} setBuyer={setBuyer}
          price={price} setPrice={setPrice}
        />

        {/* COL 2 — RESULT */}
        <ResultPanel result={result} price={price} />

        {/* COL 3 — CONTEXT */}
        <ContextPanel
          result={result} scenStandard={scenStandard}
          scenFtb={scenFtb} scenAdd={scenAdd}
        />
      </div>

      {/* ─────────── INSIGHTS STRIP ─────────── */}
      <div className="mt-6 lg:mt-8">
        <InsightsStrip result={result} scenStandard={scenStandard} scenFtb={scenFtb} scenAdd={scenAdd} />
      </div>

      {/* ─────────── SCENARIO + COUNTRY COMPARISON ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6 lg:mt-8">
        <ScenarioGrid results={allScen} current={buyer} onSelect={setBuyer} />
        <CountryGrid results={allCtry} current={country} onSelect={setCountry} />
      </div>

      {/* ─────────── TIMELINE ─────────── */}
      <div className="mt-6 lg:mt-8">
        <Timeline taxName={result.taxName} />
      </div>

      {/* ─────────── REFUND TOOL ─────────── */}
      {(buyer === 'additional' || buyer === 'addNonRes') && (
        <div className="mt-6 lg:mt-8">
          <RefundFeaturePanel defaultPrice={price} />
        </div>
      )}

      {/* ─────────── WORKED EXAMPLES ─────────── */}
      <div className="mt-6 lg:mt-8">
        <WorkedExamples country={country} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONFIGURE PANEL (left)
═══════════════════════════════════════════════════════════════ */
function ConfigurePanel({
  country, setCountry, buyer, setBuyer, price, setPrice,
}: {
  country: Country; setCountry: (c: Country) => void;
  buyer: BuyerType; setBuyer: (b: BuyerType) => void;
  price: number; setPrice: (n: number) => void;
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div style={card}>
        <PanelHeader icon={<Calculator size={14} />} title="Configure" caption="Set your scenario" />

        {/* Country */}
        <div style={{ padding: 20, borderBottom: `1px solid ${T.divide}` }}>
          <SmallLabel>Country</SmallLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {(['england', 'scotland', 'wales'] as Country[]).map((c) => {
              const active = country === c;
              const taxName = c === 'england' ? 'SDLT' : c === 'scotland' ? 'LBTT' : 'LTT';
              return (
                <button key={c} type="button" onClick={() => setCountry(c)}
                  style={{
                    padding: '10px 8px',
                    background: active ? T.ink : T.paper,
                    color: active ? T.paper : T.body,
                    border: `1px solid ${active ? T.ink : T.hair}`,
                    borderRadius: 6, cursor: 'pointer',
                    fontFamily: FONT, transition: 'all 0.12s ease',
                  }}>
                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.1 }}>
                    {c === 'england' ? 'England' : c === 'scotland' ? 'Scotland' : 'Wales'}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 500, marginTop: 3, opacity: active ? 0.7 : 0.5, letterSpacing: '0.06em' }}>
                    {taxName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price */}
        <div style={{ padding: 20, borderBottom: `1px solid ${T.divide}` }}>
          <SmallLabel>Property price</SmallLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 400, color: T.faint, lineHeight: 1 }}>£</span>
            <input type="number" inputMode="decimal" value={price || ''}
                   onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                   min={0} step={5000}
                   style={{
                     flex: 1, minWidth: 0,
                     fontSize: 28, fontWeight: 600, color: T.ink,
                     background: 'transparent', border: 'none', outline: 'none',
                     fontVariantNumeric: NUM, fontFamily: FONT, letterSpacing: '-0.018em',
                     padding: 0,
                   }} />
          </div>
          <input type="range" value={price} onChange={(e) => setPrice(+e.target.value)}
                 min={50_000} max={2_000_000} step={5000}
                 style={{ width: '100%', marginTop: 12, accentColor: T.ink, cursor: 'pointer' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
            {[250_000, 350_000, 500_000, 750_000, 1_000_000].map((p) => {
              const active = price === p;
              return (
                <button key={p} type="button" onClick={() => setPrice(p)}
                  style={{
                    fontSize: 11, fontWeight: 500,
                    padding: '4px 8px',
                    background: active ? T.ink : 'transparent',
                    color: active ? T.paper : T.muted,
                    border: `1px solid ${active ? T.ink : T.hair}`,
                    borderRadius: 4, cursor: 'pointer',
                    fontFamily: FONT, fontVariantNumeric: NUM,
                  }}>
                  {p >= 1_000_000 ? `£${p/1_000_000}m` : `£${p/1000}k`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buyer scenario */}
        <div style={{ padding: 20 }}>
          <SmallLabel>Buyer scenario</SmallLabel>
          <div role="radiogroup" style={{ display: 'grid', gap: 4 }}>
            {BUYERS.map((b) => {
              const active = buyer === b;
              return (
                <button key={b} type="button" onClick={() => setBuyer(b)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 12px', textAlign: 'left',
                    background: active ? T.emeraldT : 'transparent',
                    border: `1px solid ${active ? T.emerald : 'transparent'}`,
                    borderRadius: 6, cursor: 'pointer',
                    fontFamily: FONT, transition: 'all 0.12s ease',
                  }}>
                  <span style={{
                    marginTop: 4, width: 12, height: 12, borderRadius: '50%',
                    background: active ? T.emerald : T.paper,
                    border: `2px solid ${active ? T.emerald : T.hair}`,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? T.emerald : T.ink, lineHeight: 1.3 }}>
                      {BUYER_LABEL[b]}
                    </div>
                    <div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.45, marginTop: 3 }}>
                      {BUYER_DESC[b]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESULT PANEL (centre)
═══════════════════════════════════════════════════════════════ */
function ResultPanel({ result, price }: { result: SDLTResult; price: number }) {
  const standardBandTax = result.bands.reduce((s, b) => s + b.tax, 0);
  const totalBands = result.bands.length;

  return (
    <main style={{ minWidth: 0 }}>

      {/* Headline result card */}
      <div style={{ ...card, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <SmallLabel>Total {result.taxName} payable</SmallLabel>
            <div style={{
              fontSize: 'clamp(40px, 6vw, 56px)',
              fontWeight: 700, color: T.ink,
              lineHeight: 1, letterSpacing: '-0.028em',
              fontVariantNumeric: NUM, marginTop: 6,
            }}>
              {gbp(result.total)}
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
              On {gbp(price)} purchase · Effective rate{' '}
              <span style={{ color: T.ink, fontWeight: 600, fontVariantNumeric: NUM }}>{pct(result.effectiveRate)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <Pill tone="emerald">{COUNTRY_LABEL[result.country]}</Pill>
            <Pill tone="neutral">{BUYER_LABEL[result.buyerType]}</Pill>
          </div>
        </div>
      </div>

      {/* Visual band chart */}
      {result.bands.length > 0 && (
        <div style={{ ...card, padding: 24, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div>
              <SmallLabel>How your price is taxed</SmallLabel>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginTop: 2 }}>
                {totalBands} band{totalBands === 1 ? '' : 's'} applied
              </div>
            </div>
            <div style={{ fontSize: 12, color: T.muted }}>
              Each segment shows price portion × rate
            </div>
          </div>

          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 56, borderRadius: 6, overflow: 'hidden', border: `1px solid ${T.hair}` }}>
            {result.bands.map((b, i) => {
              const col = bandColour(b.rate);
              const widthPct = (b.taxOn / price) * 100;
              return (
                <div key={i} style={{
                  width: `${widthPct}%`,
                  background: col.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 8px', overflow: 'hidden',
                  borderRight: i < result.bands.length - 1 ? `1px solid ${T.paper}` : 'none',
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: col.text,
                    fontVariantNumeric: NUM, letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                  }}>
                    {(b.rate * 100).toFixed(b.rate === 0 ? 0 : b.rate < 0.1 ? 0 : 0)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Band labels below */}
          <div style={{ display: 'flex', marginTop: 12 }}>
            {result.bands.map((b, i) => {
              const widthPct = (b.taxOn / price) * 100;
              return (
                <div key={i} style={{ width: `${widthPct}%`, paddingRight: 8, overflow: 'hidden' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: T.faint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Band {i + 1}
                  </div>
                  <div style={{ fontSize: 12, color: T.body, marginTop: 3, fontVariantNumeric: NUM, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {gbp(b.taxOn)}
                  </div>
                  <div style={{ fontSize: 11, color: T.ink, marginTop: 1, fontVariantNumeric: NUM, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    → {gbp(b.tax)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Surcharge overlay */}
          {result.surchargeAmount > 0 && (
            <div style={{
              marginTop: 16, padding: 14,
              background: T.warnT, borderRadius: 6,
              border: `1px solid ${T.gold}33`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <AlertTriangle size={16} style={{ color: T.warn, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.warn, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Surcharge
                </div>
                <div style={{ fontSize: 13, color: T.ink, marginTop: 2 }}>
                  {result.surchargeLabel}
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.warn, fontVariantNumeric: NUM }}>
                {gbp(result.surchargeAmount)}
              </div>
            </div>
          )}

          {/* Band table (compact) */}
          <details style={{ marginTop: 16 }}>
            <summary style={{ cursor: 'pointer', fontSize: 13, color: T.muted, fontWeight: 500, listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChevronRight size={12} />
              View band-by-band detail
            </summary>
            <table style={{ width: '100%', marginTop: 12, fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.hair}` }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 10, fontWeight: 600, color: T.faint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Band</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 10, fontWeight: 600, color: T.faint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Taxed on</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 10, fontWeight: 600, color: T.faint, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tax</th>
                </tr>
              </thead>
              <tbody>
                {result.bands.map((b, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.divide}` }}>
                    <td style={{ padding: '10px 0', color: T.body }}>{b.label}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontVariantNumeric: NUM, color: T.body }}>{gbp(b.taxOn)}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontVariantNumeric: NUM, color: T.ink, fontWeight: 500 }}>{gbp2(b.tax)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: '12px 0', color: T.ink, fontWeight: 700, fontSize: 14 }}>Total {result.taxName}</td>
                  <td></td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontVariantNumeric: NUM, color: T.ink, fontWeight: 700, fontSize: 14 }}>{gbp2(result.total)}</td>
                </tr>
              </tbody>
            </table>
          </details>
        </div>
      )}

      {/* Applied rules + warnings */}
      {(result.appliedRules.length > 0 || result.warnings.length > 0) && (
        <div style={{ ...card, padding: 24, marginTop: 16 }}>
          {result.appliedRules.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Info size={14} style={{ color: T.blue }} />
                <SmallLabel>How this is calculated</SmallLabel>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {result.appliedRules.map((r, i) => (
                  <li key={i} style={{ fontSize: 13, lineHeight: 1.6, color: T.body, marginTop: i === 0 ? 0 : 6, paddingLeft: 14, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: T.faint }}>·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.warnings.length > 0 && (
            <div style={{ marginTop: result.appliedRules.length > 0 ? 16 : 0, padding: 14, background: T.warnT, borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <AlertTriangle size={14} style={{ color: T.warn }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: T.warn, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Watch for
                </div>
              </div>
              {result.warnings.map((w, i) => (
                <div key={i} style={{ fontSize: 13, lineHeight: 1.55, color: T.body, marginTop: i === 0 ? 0 : 6 }}>{w}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTEXT PANEL (right)
═══════════════════════════════════════════════════════════════ */
function ContextPanel({
  result, scenStandard, scenFtb, scenAdd,
}: {
  result: SDLTResult; scenStandard: SDLTResult; scenFtb: SDLTResult; scenAdd: SDLTResult;
}) {
  const isStd = result.buyerType === 'standard';
  const isFtb = result.buyerType === 'firstTime';
  const isAdd = result.buyerType === 'additional' || result.buyerType === 'addNonRes';
  const isNonRes = result.buyerType === 'nonResident' || result.buyerType === 'addNonRes';

  /* Eligibility flags */
  const flags: { state: 'ok' | 'no' | 'warn'; label: string }[] = [];
  flags.push({ state: isFtb && result.price <= 500_000 ? 'ok' : 'no', label: 'First-time buyer relief' });
  flags.push({ state: isAdd ? 'warn' : 'ok', label: '3% additional-property surcharge' });
  flags.push({ state: isNonRes ? 'warn' : 'ok', label: '2% non-UK resident surcharge' });
  flags.push({ state: result.buyerType === 'mixedUse' ? 'ok' : 'no', label: 'Mixed-use rates' });

  /* Dynamic insights */
  const ftbSaving  = scenStandard.total - scenFtb.total;
  const addCost    = scenAdd.total - scenStandard.total;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">

      {/* Eligibility */}
      <div style={card}>
        <PanelHeader icon={<ShieldCheck size={14} />} title="Eligibility" caption="Status check" />
        <div style={{ padding: '4px 20px 20px' }}>
          {flags.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0',
              borderBottom: i < flags.length - 1 ? `1px solid ${T.divide}` : 'none',
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                background: f.state === 'ok' ? T.emeraldT : f.state === 'warn' ? T.warnT : T.divide,
                color:      f.state === 'ok' ? T.emerald  : f.state === 'warn' ? T.warn   : T.faint,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {f.state === 'ok' ? <Check size={11} strokeWidth={3} /> : f.state === 'warn' ? <AlertTriangle size={10} strokeWidth={2.5} /> : <X size={11} strokeWidth={3} />}
              </span>
              <span style={{ fontSize: 12.5, color: T.body, lineHeight: 1.4, flex: 1 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Savings insight */}
      <div style={{ ...card, marginTop: 16 }}>
        <PanelHeader icon={<Sparkles size={14} />} title="Insight" caption="Compared to alternatives" />
        <div style={{ padding: 20 }}>
          {/* FTB delta */}
          {!isFtb && ftbSaving > 0 && (
            <InsightRow
              tone="emerald" trend="down"
              label="If first-time buyer eligible"
              value={`Save ${gbp(ftbSaving)}`}
              detail={result.price > 500_000 ? 'Cap exceeded at £500k' : `Standard ${gbp(scenStandard.total)} → FTB ${gbp(scenFtb.total)}`}
            />
          )}
          {/* Additional surcharge delta */}
          {isStd && addCost > 0 && (
            <InsightRow
              tone="warn" trend="up"
              label="If additional property"
              value={`+${gbp(addCost)}`}
              detail={`3% surcharge on full ${gbp(result.price)}`}
            />
          )}
          {/* If already additional, suggest refund */}
          {isAdd && (
            <InsightRow
              tone="blue" trend="down"
              label="Surcharge refund possible"
              value={`Recover ${gbp(result.price * 0.03)}`}
              detail="If you sell previous main home within 36 months"
            />
          )}
          {/* FTB cliff */}
          {isFtb && result.price > 500_000 && (
            <InsightRow
              tone="warn" trend="up"
              label="FTB relief lost"
              value={`Cost ${gbp(result.total - scenFtb.total)}`}
              detail={`Price ${gbp(result.price)} exceeds £500k cap — relief withdrawn entirely`}
            />
          )}
          {/* Default if nothing notable */}
          {isStd && addCost === 0 && ftbSaving === 0 && (
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
              No additional reliefs or surcharges available at this price for a standard buyer.
            </div>
          )}
        </div>
      </div>

      {/* Key thresholds for this regime */}
      <div style={{ ...card, marginTop: 16 }}>
        <PanelHeader icon={<Target size={14} />} title="Key thresholds" caption={`${result.taxName} · ${COUNTRY_LABEL[result.country]}`} />
        <div style={{ padding: '4px 20px 20px' }}>
          {getThresholds(result.country).map((t, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12,
              padding: '10px 0',
              borderBottom: i < getThresholds(result.country).length - 1 ? `1px solid ${T.divide}` : 'none',
            }}>
              <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.4 }}>{t.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, fontVariantNumeric: NUM, whiteSpace: 'nowrap' }}>{t.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function getThresholds(country: Country): { label: string; value: string }[] {
  if (country === 'scotland') return [
    { label: 'Nil-rate band',     value: '£145,000' },
    { label: 'FTB nil-rate',      value: '£175,000' },
    { label: '10% band starts',   value: '£325,000' },
    { label: '12% band starts',   value: '£750,000' },
    { label: 'ADS surcharge',     value: '+8%' },
    { label: 'Filing deadline',   value: '30 days' },
  ];
  if (country === 'wales') return [
    { label: 'Nil-rate band',     value: '£225,000' },
    { label: '7.5% band starts',  value: '£400,000' },
    { label: '10% band starts',   value: '£750,000' },
    { label: '12% band starts',   value: '£1.5m' },
    { label: 'Higher-rate',       value: '+5%' },
    { label: 'Filing deadline',   value: '30 days' },
  ];
  return [
    { label: 'Nil-rate band',         value: '£125,000' },
    { label: 'FTB nil-rate',          value: '£300,000' },
    { label: 'FTB cap',               value: '£500,000' },
    { label: '5% band starts',        value: '£250,000' },
    { label: '10% band starts',       value: '£925,000' },
    { label: '12% band starts',       value: '£1.5m' },
    { label: 'Additional surcharge',  value: '+3%' },
    { label: 'Non-resident surcharge', value: '+2%' },
    { label: 'Filing deadline',       value: '14 days' },
  ];
}

/* ═══════════════════════════════════════════════════════════════
   INSIGHTS STRIP
═══════════════════════════════════════════════════════════════ */
function InsightsStrip({
  result, scenStandard, scenFtb, scenAdd,
}: {
  result: SDLTResult; scenStandard: SDLTResult; scenFtb: SDLTResult; scenAdd: SDLTResult;
}) {
  const cards = [
    { label: 'Total tax',         value: gbp(result.total),                tone: 'ink' as const,    icon: Calculator },
    { label: 'Effective rate',    value: pct(result.effectiveRate),        tone: 'ink' as const,    icon: TrendingUp },
    { label: 'Surcharge',         value: result.surchargeAmount > 0 ? gbp(result.surchargeAmount) : '—', tone: result.surchargeAmount > 0 ? 'warn' as const : 'muted' as const, icon: AlertTriangle },
    { label: 'vs FTB',            value: result.buyerType === 'firstTime' ? '—' : (scenStandard.total - scenFtb.total > 0 ? `+${gbp(scenStandard.total - scenFtb.total)}` : '—'), tone: 'emerald' as const, icon: Sparkles },
    { label: 'vs Additional',     value: result.buyerType === 'additional' ? '—' : (scenAdd.total - scenStandard.total > 0 ? `−${gbp(scenAdd.total - scenStandard.total)}` : '—'), tone: 'muted' as const, icon: TrendingDown },
    { label: 'Filing deadline',   value: result.country === 'england' ? '14 days' : '30 days', tone: 'muted' as const, icon: Calendar },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const colorMap = {
          ink:     { val: T.ink,     bg: T.paper },
          emerald: { val: T.emerald, bg: T.paper },
          warn:    { val: T.warn,    bg: T.paper },
          muted:   { val: T.muted,   bg: T.paper },
        };
        const col = colorMap[c.tone];
        return (
          <div key={i} style={{
            ...card, padding: 16, background: col.bg,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: T.faint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {c.label}
              </span>
              <Icon size={13} style={{ color: T.faint }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: col.val, letterSpacing: '-0.018em', fontVariantNumeric: NUM, lineHeight: 1.1 }}>
              {c.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENARIO GRID
═══════════════════════════════════════════════════════════════ */
function ScenarioGrid({
  results, current, onSelect,
}: {
  results: SDLTResult[]; current: BuyerType; onSelect: (b: BuyerType) => void;
}) {
  const std = results.find((r) => r.buyerType === 'standard')!.total;
  return (
    <div style={card}>
      <PanelHeader icon={<Globe size={14} />} title="All buyer scenarios" caption="Tap a card to switch" />
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
        {results.map((r) => {
          const active = r.buyerType === current;
          const delta = r.total - std;
          return (
            <button key={r.buyerType} type="button" onClick={() => onSelect(r.buyerType)}
              style={{
                padding: '14px 14px 12px', textAlign: 'left',
                background: active ? T.ink : T.paper,
                color: active ? T.paper : T.ink,
                border: `1px solid ${active ? T.ink : T.hair}`,
                borderRadius: 8, cursor: 'pointer',
                fontFamily: FONT, transition: 'all 0.12s ease',
              }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.35, opacity: active ? 0.75 : 1, color: active ? T.paper : T.body }}>
                {BUYER_LABEL[r.buyerType]}
              </div>
              <div style={{ fontSize: 19, fontWeight: 700, marginTop: 6, fontVariantNumeric: NUM, letterSpacing: '-0.018em' }}>
                {gbp(r.total)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 10.5, color: active ? '#A7F3D0' : T.faint, fontVariantNumeric: NUM }}>
                  {pct(r.effectiveRate)}
                </span>
                {delta !== 0 && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, fontVariantNumeric: NUM,
                    color: delta > 0 ? (active ? '#FCA5A5' : T.danger) : (active ? '#A7F3D0' : T.emerald),
                  }}>
                    {delta > 0 ? '+' : ''}{gbp(delta)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COUNTRY GRID
═══════════════════════════════════════════════════════════════ */
function CountryGrid({
  results, current, onSelect,
}: {
  results: SDLTResult[]; current: Country; onSelect: (c: Country) => void;
}) {
  return (
    <div style={card}>
      <PanelHeader icon={<Globe size={14} />} title="Cross-border" caption="Same price across UK nations" />
      <div style={{ padding: 16, display: 'grid', gap: 10 }}>
        {results.map((r) => {
          const active = r.country === current;
          return (
            <button key={r.country} type="button" onClick={() => onSelect(r.country)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 16px', textAlign: 'left',
                background: active ? T.emeraldT : T.paper,
                border: `1px solid ${active ? T.emerald : T.hair}`,
                borderRadius: 8, cursor: 'pointer',
                fontFamily: FONT, transition: 'all 0.12s ease',
              }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: active ? T.emerald : T.ink, lineHeight: 1.2 }}>
                  {COUNTRY_LABEL[r.country]}
                </div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 3, letterSpacing: '0.06em' }}>
                  {r.taxName} · Effective {pct(r.effectiveRate)}{r.surchargeAmount > 0 ? ` · Surcharge ${gbp(r.surchargeAmount)}` : ''}
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.ink, fontVariantNumeric: NUM, letterSpacing: '-0.018em' }}>
                {gbp(r.total)}
              </div>
              {active && <Check size={16} style={{ color: T.emerald }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════════════════════ */
function Timeline({ taxName }: { taxName: 'SDLT' | 'LBTT' | 'LTT' }) {
  const steps = [
    { label: 'Offer accepted',     detail: 'Verbal / written offer agreed with seller' },
    { label: 'Solicitor instructed', detail: 'Conveyancer engaged, searches begin' },
    { label: 'Exchange',             detail: 'Contracts exchanged, deposit paid, legally binding' },
    { label: 'Completion',           detail: 'Effective date for tax purposes' },
    { label: `${taxName} return + payment`, detail: taxName === 'SDLT' ? 'Within 14 days of completion' : 'Within 30 days of completion', highlight: true },
  ];
  return (
    <div style={card}>
      <PanelHeader icon={<Clock size={14} />} title="Purchase journey" caption={`When ${taxName} is due`} />
      <div style={{ padding: 24, overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, minmax(140px, 1fr))`, gap: 0, position: 'relative' }}>
          {/* Line */}
          <div style={{
            position: 'absolute', left: 16, right: 16, top: 14,
            height: 2, background: T.divide,
          }} />
          {steps.map((s, i) => (
            <div key={i} style={{ position: 'relative', paddingRight: 12 }}>
              {/* Dot */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: s.highlight ? T.emerald : T.paper,
                border: `2px solid ${s.highlight ? T.emerald : T.hair}`,
                color: s.highlight ? T.paper : T.muted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontVariantNumeric: NUM,
                position: 'relative', zIndex: 1,
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: s.highlight ? T.emerald : T.ink, marginTop: 12, lineHeight: 1.3 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11.5, color: T.muted, marginTop: 4, lineHeight: 1.45 }}>
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REFUND FEATURE PANEL
═══════════════════════════════════════════════════════════════ */
function RefundFeaturePanel({ defaultPrice }: { defaultPrice: number }) {
  const [price, setPrice]       = useState(defaultPrice);
  const [months, setMonths]     = useState(8);
  const [sold, setSold]         = useState(true);
  const [resident, setResident] = useState(true);

  const r = useMemo(() => calculateRefund({
    purchasePrice: price, monthsSincePurchase: months,
    isUKResident: resident, hasSoldOldHome: sold,
  }), [price, months, sold, resident]);

  return (
    <div style={card}>
      <PanelHeader
        icon={<Sparkles size={14} />}
        title="Reclaim the 3% surcharge"
        caption="Eligibility checker for the 36-month refund window"
        tone="blue"
      />
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="lg:grid-cols-[1fr_320px]">
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <SmallLabel>Property price</SmallLabel>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.faint, fontSize: 14 }}>£</span>
                <input type="number" value={price || ''} onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                       style={{
                         width: '100%', fontSize: 15, padding: '10px 12px 10px 26px',
                         border: `1px solid ${T.hair}`, borderRadius: 6, outline: 'none',
                         color: T.ink, fontFamily: FONT, fontVariantNumeric: NUM, background: T.paper,
                       }} />
              </div>
            </div>
            <div>
              <SmallLabel>Months since purchase</SmallLabel>
              <input type="number" min={0} max={60} value={months}
                     onChange={(e) => setMonths(Math.max(0, +e.target.value || 0))}
                     style={{
                       width: '100%', fontSize: 15, padding: '10px 12px',
                       border: `1px solid ${T.hair}`, borderRadius: 6, outline: 'none',
                       color: T.ink, fontFamily: FONT, fontVariantNumeric: NUM, background: T.paper,
                     }} />
              <input type="range" min={0} max={60} value={months}
                     onChange={(e) => setMonths(+e.target.value)}
                     style={{ width: '100%', marginTop: 8, accentColor: T.emerald }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.faint, marginTop: 2 }}>
                <span>Now</span>
                <span style={{ color: months > 36 ? T.danger : T.faint, fontWeight: months > 36 ? 600 : 400 }}>
                  36mo deadline {months > 36 ? '(passed)' : ''}
                </span>
                <span>60mo</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
            <label style={checkboxRow}>
              <input type="checkbox" checked={sold} onChange={(e) => setSold(e.target.checked)} style={{ accentColor: T.emerald }} />
              <span>Sold (or will sell) previous main home within 36 months</span>
            </label>
            <label style={checkboxRow}>
              <input type="checkbox" checked={resident} onChange={(e) => setResident(e.target.checked)} style={{ accentColor: T.emerald }} />
              <span>UK-resident at refund claim date</span>
            </label>
          </div>
        </div>

        <div style={{
          background: r.eligible ? T.emeraldT : T.dangerT,
          border: `1px solid ${r.eligible ? T.emerald : T.danger}33`,
          borderRadius: 8, padding: 20,
        }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: r.eligible ? T.emerald : T.danger, marginBottom: 8,
          }}>
            {r.eligible ? 'Eligible' : 'Not eligible'}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: T.ink, fontVariantNumeric: NUM, letterSpacing: '-0.022em', lineHeight: 1 }}>
            {gbp(r.refundAmount)}
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 8, lineHeight: 1.5 }}>
            Refund of 3% additional-property surcharge
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${r.eligible ? T.emerald : T.danger}22` }}>
            {r.reasons.map((reason, i) => (
              <div key={i} style={{ fontSize: 11.5, color: T.body, marginTop: i === 0 ? 0 : 6, paddingLeft: 12, position: 'relative', lineHeight: 1.5 }}>
                <span style={{ position: 'absolute', left: 0, color: T.faint }}>·</span>
                {reason}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WORKED EXAMPLES (carousel-style row)
═══════════════════════════════════════════════════════════════ */
function WorkedExamples({ country }: { country: Country }) {
  const examples = [
    { tag: 'Standard',  price: 400_000, scenario: 'standard'   as BuyerType, label: 'Standard, £400k' },
    { tag: 'FTB win',   price: 400_000, scenario: 'firstTime'  as BuyerType, label: 'First-time buyer, £400k' },
    { tag: 'FTB cliff', price: 600_000, scenario: 'firstTime'  as BuyerType, label: 'FTB above cap, £600k' },
    { tag: '2nd home',  price: 400_000, scenario: 'additional' as BuyerType, label: 'Buy-to-let, £400k' },
    { tag: 'Foreign',   price: 400_000, scenario: 'nonResident' as BuyerType, label: 'Non-resident, £400k' },
    { tag: 'Stacked',   price: 400_000, scenario: 'addNonRes'  as BuyerType, label: '2nd home + non-resident' },
  ];
  return (
    <div style={card}>
      <PanelHeader icon={<FileText size={14} />} title="Worked examples" caption="Six common purchase scenarios" />
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {examples.map((ex, i) => {
          const r = calculateSDLT(ex.price, ex.scenario, country);
          return (
            <div key={i} style={{
              padding: 16, borderRadius: 8,
              background: T.page, border: `1px solid ${T.hair}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Example {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginTop: 6, lineHeight: 1.3 }}>
                {ex.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, marginTop: 10, fontVariantNumeric: NUM, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {gbp(r.total)}
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>
                Effective <span style={{ color: T.ink, fontWeight: 600 }}>{pct(r.effectiveRate)}</span>
                {r.surchargeAmount > 0 && (
                  <> · Surcharge <span style={{ color: T.warn, fontWeight: 600 }}>{gbp(r.surchargeAmount)}</span></>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════ */
const card: React.CSSProperties = {
  background: T.paper,
  border: `1px solid ${T.hair}`,
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: T.shadow,
};

function PanelHeader({
  icon, title, caption, tone = 'neutral',
}: {
  icon: React.ReactNode; title: string; caption?: string;
  tone?: 'neutral' | 'blue';
}) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: `1px solid ${T.divide}`,
      background: tone === 'blue' ? T.blueT : T.page,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: 6,
        background: tone === 'blue' ? T.blue : T.ink,
        color: T.paper,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: 1.2, letterSpacing: '-0.005em' }}>{title}</div>
        {caption && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{caption}</div>}
      </div>
    </div>
  );
}

function SmallLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 700, color: T.muted,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'emerald' | 'warn' }) {
  const styles = {
    neutral: { bg: T.divide, fg: T.muted },
    emerald: { bg: T.emeraldT, fg: T.emerald },
    warn:    { bg: T.warnT, fg: T.warn },
  };
  const s = styles[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 11, fontWeight: 600,
      padding: '4px 10px', borderRadius: 999,
      background: s.bg, color: s.fg,
      letterSpacing: '0.02em',
    }}>
      {children}
    </span>
  );
}

function InsightRow({
  tone, trend, label, value, detail,
}: {
  tone: 'emerald' | 'warn' | 'blue'; trend: 'up' | 'down';
  label: string; value: string; detail: string;
}) {
  const styles = {
    emerald: { bg: T.emeraldT, fg: T.emerald },
    warn:    { bg: T.warnT,    fg: T.warn },
    blue:    { bg: T.blueT,    fg: T.blue },
  };
  const s = styles[tone];
  const Icon = trend === 'up' ? TrendingUp : TrendingDown;
  return (
    <div style={{
      padding: 14, borderRadius: 8, background: s.bg,
      borderLeft: `3px solid ${s.fg}`,
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Icon size={12} style={{ color: s.fg }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: s.fg, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: T.ink, fontVariantNumeric: NUM, letterSpacing: '-0.012em' }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: T.muted, marginTop: 3, lineHeight: 1.45 }}>
        {detail}
      </div>
    </div>
  );
}

const checkboxRow: React.CSSProperties = {
  display: 'flex', alignItems: 'flex-start', gap: 10,
  fontSize: 12.5, color: T.body, lineHeight: 1.5,
  cursor: 'pointer',
};
