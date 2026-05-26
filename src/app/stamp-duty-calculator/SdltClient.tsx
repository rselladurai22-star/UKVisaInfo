'use client';

/**
 * Stamp Duty — full product experience (May 2026).
 *
 * Layout rhythm: light → dark → light → light
 *   1. Calculator card        (light, white surface, the form)
 *   2. INSIGHTS section       (dark inverse, SVG line chart + bar chart)
 *   3. Country comparison     (light, 3 cards)
 *   4. Refund tool            (light, conditional)
 *   5. Quick reference        (light, stat strip)
 */

import { useMemo, useState } from 'react';
import { Sparkles, AlertCircle, Info, TrendingUp, TrendingDown, Check, ArrowRight } from 'lucide-react';
import {
  calculateSDLT, calculateAllScenarios, calculateAllCountries, calculateRefund,
  COUNTRY_LABEL,
  type BuyerType, type Country, type SDLTResult,
} from '../../lib/sdlt/calc';

/* ─────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────── */
const T = {
  // Light theme
  black:    '#09090B',
  ink:      '#18181B',
  body:     '#3F3F46',
  muted:    '#71717A',
  faint:    '#A1A1AA',
  ghost:    '#D4D4D8',
  paper:    '#FFFFFF',
  surface:  '#FAFAFA',
  page:     '#F4F4F5',
  hair:     '#E4E4E7',
  divide:   '#F4F4F5',
  brand:    '#047857',
  brandT:   '#ECFDF5',
  warn:     '#B45309',
  warnT:    '#FEF3C7',
  danger:   '#B91C1C',
  // Dark theme
  dBlack:   '#09090B',
  dInk:     '#FAFAFA',
  dBody:    '#D4D4D8',
  dMuted:   '#A1A1AA',
  dFaint:   '#71717A',
  dHair:    'rgba(255,255,255,0.08)',
  dDivide:  'rgba(255,255,255,0.04)',
  dBrand:   '#34D399',
  dWarn:    '#FBBF24',
  // Shadows
  shadowSm: '0 1px 2px rgba(9,9,11,0.04)',
  shadow:   '0 1px 3px rgba(9,9,11,0.05), 0 1px 2px rgba(9,9,11,0.04)',
  shadowMd: '0 4px 12px -2px rgba(9,9,11,0.08), 0 2px 4px rgba(9,9,11,0.04)',
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
const fmtK = (n: number) => n >= 1_000_000 ? `£${(n/1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m` : `£${(n/1000).toFixed(0)}k`;

function bandColour(rate: number): string {
  if (rate === 0)    return '#F4F4F5';
  if (rate <= 0.02)  return '#D1FAE5';
  if (rate <= 0.05)  return '#A7F3D0';
  if (rate <= 0.075) return '#6EE7B7';
  if (rate <= 0.10)  return '#34D399';
  return '#10B981';
}

/* Buyer state machine */
interface Flags { ftb: boolean; additional: boolean; nonResident: boolean; mixedUse: boolean; company: boolean }
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
    standard: 'Standard buyer', firstTime: 'First-time buyer',
    additional: 'Additional property', nonResident: 'Non-UK resident',
    addNonRes: 'Additional + Non-resident', mixedUse: 'Mixed-use property',
    company: 'Company-owned',
  }[b];
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
   MAIN EXPERIENCE — renders multiple sections (light/dark rhythm)
═══════════════════════════════════════════════════════════════ */
export default function SdltClient({ initialPrice = 350000 }: { initialPrice?: number }) {
  const [price, setPrice]     = useState(initialPrice);
  const [country, setCountry] = useState<Country>('england');
  const [flags, setFlags] = useState<Flags>({
    ftb: false, additional: false, nonResident: false, mixedUse: false, company: false,
  });

  const buyer    = deriveBuyerType(flags);
  const result   = useMemo(() => calculateSDLT(price, buyer, country), [price, buyer, country]);
  const allScen  = useMemo(() => calculateAllScenarios(price, country), [price, country]);
  const allCtry  = useMemo(() => calculateAllCountries(price, buyer), [price, buyer]);

  const stdResult = allScen.find((r) => r.buyerType === 'standard')!;
  const ftbResult = allScen.find((r) => r.buyerType === 'firstTime')!;

  const insights = useMemo(() => {
    const items: { tone: 'good' | 'warn' | 'info'; label: string; detail: string }[] = [];
    if (!flags.ftb && !flags.additional && !flags.nonResident && price <= 500_000) {
      const saving = stdResult.total - ftbResult.total;
      if (saving > 0) items.push({ tone: 'good', label: `Save ${gbp(saving)} as a first-time buyer`, detail: 'If eligible, FTB relief replaces standard rates' });
    }
    if (flags.ftb && price > 500_000) {
      items.push({ tone: 'warn', label: 'FTB relief lost above £500k cap', detail: 'Standard rates now apply to the full price' });
    }
    if (flags.additional) {
      items.push({ tone: 'info', label: 'Refund window: 36 months', detail: 'Sell previous main home to reclaim the 3% surcharge' });
    }
    const deadline = country === 'england' ? '14 days' : '30 days';
    items.push({ tone: 'info', label: `Filing deadline ${deadline}`, detail: 'From the effective date of the transaction' });
    return items.slice(0, 3);
  }, [flags, price, country, stdResult.total, ftbResult.total]);

  return (
    <div style={FONT_FEAT}>

      {/* ═══════════════════════════════════════════
          1. CALCULATOR CARD (light)
      ═══════════════════════════════════════════ */}
      <Section bg={T.surface} pt={32} pb={48}>
        <Wrap>
          <CalculatorCard
            country={country} setCountry={setCountry}
            flags={flags} setFlags={setFlags}
            price={price} setPrice={setPrice}
            buyer={buyer} result={result}
            insights={insights}
          />
        </Wrap>
      </Section>

      {/* ═══════════════════════════════════════════
          2. INSIGHTS — dark inverse, charts
      ═══════════════════════════════════════════ */}
      <Section bg={T.dBlack} pt={80} pb={80} dark>
        <Wrap>
          <DarkInsights
            price={price} country={country} buyer={buyer} flags={flags}
            allScen={allScen} setFlags={setFlags}
          />
        </Wrap>
      </Section>

      {/* ═══════════════════════════════════════════
          3. COUNTRY COMPARISON (light)
      ═══════════════════════════════════════════ */}
      <Section bg={T.surface} pt={64} pb={48}>
        <Wrap>
          <CountrySection results={allCtry} current={country} onSelect={setCountry} buyer={buyer} price={price} />
        </Wrap>
      </Section>

      {/* ═══════════════════════════════════════════
          4. REFUND TOOL (light, conditional)
      ═══════════════════════════════════════════ */}
      {(buyer === 'additional' || buyer === 'addNonRes') && (
        <Section bg={T.surface} pt={0} pb={48}>
          <Wrap>
            <RefundSection defaultPrice={price} />
          </Wrap>
        </Section>
      )}

      {/* ═══════════════════════════════════════════
          5. QUICK REFERENCE (light)
      ═══════════════════════════════════════════ */}
      <Section bg={T.paper} pt={48} pb={48} topRule>
        <Wrap>
          <QuickRef country={country} />
        </Wrap>
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION + WRAP PRIMITIVES
═══════════════════════════════════════════════════════════════ */
function Section({
  bg, pt = 64, pb = 64, topRule = false, dark = false, children,
}: {
  bg: string; pt?: number; pb?: number; topRule?: boolean; dark?: boolean; children: React.ReactNode;
}) {
  return (
    <section style={{
      background: bg,
      paddingTop: pt, paddingBottom: pb,
      borderTop: topRule ? `1px solid ${T.hair}` : 'none',
      color: dark ? T.dInk : T.ink,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {dark && (
        <>
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 60% 50% at 85% 10%, rgba(52,211,153,0.08), transparent 60%)',
          }} />
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </>
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </section>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(16px, 3vw, 32px)' }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CALCULATOR CARD
═══════════════════════════════════════════════════════════════ */
function CalculatorCard({
  country, setCountry, flags, setFlags, price, setPrice, buyer, result, insights,
}: {
  country: Country; setCountry: (c: Country) => void;
  flags: Flags; setFlags: (f: Flags) => void;
  price: number; setPrice: (n: number) => void;
  buyer: BuyerType; result: SDLTResult;
  insights: { tone: 'good' | 'warn' | 'info'; label: string; detail: string }[];
}) {
  return (
    <div style={{
      background: T.paper, borderRadius: 16,
      border: `1px solid ${T.hair}`, boxShadow: T.shadow,
      overflow: 'hidden',
    }}>
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">

        {/* INPUTS PANEL */}
        <div style={{ background: T.surface, padding: 'clamp(24px, 3vw, 32px)' }}>

          <Field label="Region">
            <Segmented value={country} onChange={(v) => setCountry(v as Country)}
              options={[
                { id: 'england',  label: 'England & NI', sub: 'SDLT' },
                { id: 'scotland', label: 'Scotland',     sub: 'LBTT' },
                { id: 'wales',    label: 'Wales',        sub: 'LTT'  },
              ]} />
          </Field>

          <Field label="Property price" topGap={28}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 400, color: T.faint, lineHeight: 1, ...NUM }}>£</span>
              <input type="number" inputMode="decimal" value={price || ''}
                onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                min={0} step={5000}
                style={{
                  flex: 1, minWidth: 0, ...NUM,
                  fontSize: 32, fontWeight: 600, color: T.black,
                  background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: 'inherit', letterSpacing: '-0.025em',
                  padding: 0, lineHeight: 1.1,
                }} />
            </div>
            <input type="range" value={price} onChange={(e) => setPrice(+e.target.value)}
              min={50_000} max={2_000_000} step={5000}
              style={{ width: '100%', marginTop: 16, accentColor: T.brand, cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.faint, marginTop: 6, ...NUM }}>
              {[50_000, 250_000, 500_000, 1_000_000, 2_000_000].map((v) => (
                <span key={v}>{fmtK(v)}</span>
              ))}
            </div>
          </Field>

          <Field label="Your status" topGap={32}>
            <div style={{ display: 'grid', gap: 4 }}>
              <Toggle on={flags.ftb}
                onChange={(v) => setFlags({ ...flags, ftb: v, additional: v ? false : flags.additional })}
                disabled={flags.mixedUse || flags.company}
                label="First-time buyer"
                desc="Never owned a residential property anywhere" />
              <Toggle on={flags.additional}
                onChange={(v) => setFlags({ ...flags, additional: v, ftb: v ? false : flags.ftb })}
                disabled={flags.mixedUse || flags.company}
                label="I own other property"
                desc="Buy-to-let, second home, inherited share" />
              <Toggle on={flags.nonResident}
                onChange={(v) => setFlags({ ...flags, nonResident: v })}
                disabled={flags.mixedUse || flags.company || country !== 'england'}
                label="Non-UK resident"
                desc="Less than 183 days in UK in past 12 months" />
              <Toggle on={flags.mixedUse}
                onChange={(v) => setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: v, company: false })}
                label="Mixed-use property"
                desc="Has substantive commercial element" />
              <Toggle on={flags.company}
                onChange={(v) => setFlags({ ftb: false, additional: false, nonResident: false, mixedUse: false, company: v })}
                label="Bought through a company"
                desc="Non-natural person, possible 15% flat" />
            </div>
          </Field>

          <div style={{
            marginTop: 28, padding: '10px 14px',
            background: T.paper, border: `1px solid ${T.hair}`, borderRadius: 8,
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

        {/* RESULT CANVAS */}
        <div style={{
          padding: 'clamp(28px, 3.5vw, 40px)',
          display: 'flex', flexDirection: 'column',
          borderTop: `1px solid ${T.hair}`,
        }} className="lg:border-t-0 lg:border-l">
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              You&apos;ll pay
            </div>
            <div style={{
              fontSize: 'clamp(48px, 8vw, 88px)',
              fontWeight: 700, color: T.black,
              lineHeight: 0.95, letterSpacing: '-0.045em',
              marginTop: 12, ...NUM,
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
                  <span style={NUM}>£{(result.total / price * 1000).toFixed(0)} per £1k</span>
                </>
              )}
            </div>
          </div>

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

              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: T.divide }}>
                {result.bands.map((b, i) => (
                  <div key={i} style={{
                    width: `${(b.taxOn / price) * 100}%`,
                    background: bandColour(b.rate),
                    borderRight: i < result.bands.length - 1 ? `1px solid ${T.paper}` : 'none',
                  }} />
                ))}
              </div>

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
                <div style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 12, alignItems: 'center', padding: '12px 0 0', marginTop: 4 }}>
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

          {insights.length > 0 && (
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${T.divide}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 12 }}>
                Smart insights
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {insights.map((it, i) => {
                  const styles = {
                    good: { bg: T.brandT, fg: T.brand, Icon: Sparkles },
                    warn: { bg: T.warnT,  fg: T.warn,  Icon: AlertCircle },
                    info: { bg: T.surface,fg: T.muted, Icon: Info },
                  }[it.tone];
                  const Icon = styles.Icon;
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '12px 14px', borderRadius: 8, background: styles.bg,
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
  );
}

/* ═══════════════════════════════════════════════════════════════
   DARK INSIGHTS — price curve + scenario bars
═══════════════════════════════════════════════════════════════ */
function DarkInsights({
  price, country, buyer, flags, allScen, setFlags,
}: {
  price: number; country: Country; buyer: BuyerType; flags: Flags;
  allScen: SDLTResult[]; setFlags: (f: Flags) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.dBrand, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
            Insights
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 600, color: T.dInk,
            margin: 0, letterSpacing: '-0.025em', lineHeight: 1.1, maxWidth: '24ch',
          }}>
            Your tax across every price point and scenario.
          </h2>
        </div>
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(52,211,153,0.10)', border: `1px solid rgba(52,211,153,0.20)`,
          fontSize: 11, color: T.dBrand, fontWeight: 500, letterSpacing: '0.06em',
        }}>
          {buyerLabel(buyer)} · {country === 'england' ? 'England & NI' : country === 'scotland' ? 'Scotland' : 'Wales'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
        {/* Price curve */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: `1px solid ${T.dHair}`, borderRadius: 16,
          padding: 'clamp(20px, 2.5vw, 28px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.dInk }}>Price sensitivity</div>
              <div style={{ fontSize: 12, color: T.dMuted, marginTop: 2 }}>How your bill changes from £50k to £2m</div>
            </div>
          </div>
          <PriceCurveChart price={price} country={country} buyer={buyer} />
        </div>

        {/* Scenario bars */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: `1px solid ${T.dHair}`, borderRadius: 16,
          padding: 'clamp(20px, 2.5vw, 28px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.dInk }}>All scenarios</div>
              <div style={{ fontSize: 12, color: T.dMuted, marginTop: 2 }}>At {gbp(price)} · tap to switch</div>
            </div>
          </div>
          <ScenarioBarChart scenarios={allScen} current={buyer} setFlags={setFlags} />
        </div>
      </div>
    </div>
  );
}

/* ─── SVG line chart: SDLT(price) for current scenario ─── */
function PriceCurveChart({ price, country, buyer }: { price: number; country: Country; buyer: BuyerType }) {
  const W = 720, H = 320;
  const PAD = { l: 64, r: 24, t: 24, b: 44 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const maxPrice = 2_000_000;

  const points = useMemo(() => {
    const arr: { price: number; tax: number }[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const p = (i / steps) * maxPrice;
      arr.push({ price: p, tax: calculateSDLT(p, buyer, country).total });
    }
    return arr;
  }, [buyer, country]);

  const maxTax = Math.max(...points.map((p) => p.tax), 50_000);
  const xScale = (p: number) => PAD.l + (p / maxPrice) * innerW;
  const yScale = (t: number) => PAD.t + innerH - (t / maxTax) * innerH;

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.price).toFixed(2)} ${yScale(p.tax).toFixed(2)}`).join(' ');
  const area = `${path} L ${xScale(maxPrice).toFixed(2)} ${yScale(0).toFixed(2)} L ${xScale(points[0].price).toFixed(2)} ${yScale(0).toFixed(2)} Z`;

  const curTax = calculateSDLT(price, buyer, country).total;
  const cx = xScale(price);
  const cy = yScale(curTax);

  // Y axis ticks (4 ticks: 0, 33%, 66%, 100%)
  const yTicks = [0, maxTax * 0.33, maxTax * 0.66, maxTax];
  // X axis ticks
  const xTicks = [0, 500_000, 1_000_000, 1_500_000, 2_000_000];
  // Threshold markers
  const thresholds = country === 'england' ? [125_000, 250_000, 925_000, 1_500_000]
                   : country === 'scotland' ? [145_000, 325_000, 750_000]
                   : [225_000, 400_000, 750_000];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.dBrand} stopOpacity="0.30" />
          <stop offset="100%" stopColor={T.dBrand} stopOpacity="0" />
        </linearGradient>
        <filter id="curveGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Horizontal grid */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={yScale(t)} x2={W - PAD.r} y2={yScale(t)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={PAD.l - 10} y={yScale(t) + 4} fontSize="10" fill={T.dFaint} textAnchor="end" style={NUM}>
            {fmtK(t)}
          </text>
        </g>
      ))}

      {/* Threshold vertical lines */}
      {thresholds.map((t, i) => (
        <line key={i}
          x1={xScale(t)} y1={PAD.t} x2={xScale(t)} y2={PAD.t + innerH}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="2 4" />
      ))}

      {/* Area fill */}
      <path d={area} fill="url(#curveGrad)" />

      {/* Curve */}
      <path d={path} stroke={T.dBrand} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#curveGlow)" />

      {/* X axis labels */}
      {xTicks.map((t, i) => (
        <text key={i} x={xScale(t)} y={H - PAD.b + 22} fontSize="10" fill={T.dFaint} textAnchor="middle" style={NUM}>
          {t === 0 ? '£0' : fmtK(t)}
        </text>
      ))}

      {/* Current price marker */}
      <line x1={cx} y1={PAD.t} x2={cx} y2={PAD.t + innerH} stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={cx} cy={cy} r="12" fill={T.dBrand} opacity="0.18" />
      <circle cx={cx} cy={cy} r="5" fill={T.dBrand} />
      <circle cx={cx} cy={cy} r="2" fill={T.dBlack} />

      {/* Current value label */}
      <g transform={`translate(${Math.min(Math.max(cx, PAD.l + 50), W - PAD.r - 60)} ${Math.max(cy - 30, PAD.t + 12)})`}>
        <rect x="-50" y="-18" width="100" height="22" rx="4" fill={T.dBrand} />
        <text x="0" y="-3" fontSize="11" fontWeight="700" fill={T.dBlack} textAnchor="middle" style={NUM}>
          {gbp(curTax)}
        </text>
      </g>
    </svg>
  );
}

/* ─── Horizontal bar chart for scenario comparison ─── */
function ScenarioBarChart({
  scenarios, current, setFlags,
}: {
  scenarios: SDLTResult[]; current: BuyerType; setFlags: (f: Flags) => void;
}) {
  const maxVal = Math.max(...scenarios.map((s) => s.total), 1);
  const std = scenarios.find((s) => s.buyerType === 'standard')!;

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {scenarios.map((r) => {
        const active = r.buyerType === current;
        const delta = r.total - std.total;
        const w = maxVal === 0 ? 0 : (r.total / maxVal) * 100;
        return (
          <button key={r.buyerType} type="button"
            onClick={() => setFlags(flagsForBuyer(r.buyerType))}
            style={{
              background: 'transparent', border: 'none',
              padding: 0, cursor: 'pointer', textAlign: 'left',
              fontFamily: 'inherit',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 500, color: active ? T.dInk : T.dBody }}>
                {buyerLabel(r.buyerType)}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: active ? T.dBrand : T.dInk, ...NUM }}>
                {gbp(r.total)}
              </span>
            </div>
            <div style={{ position: 'relative', height: 22, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${w}%`, height: '100%',
                background: active ? T.dBrand : 'rgba(255,255,255,0.20)',
                borderRadius: 4,
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s',
                position: 'relative',
                boxShadow: active ? '0 0 12px rgba(52,211,153,0.35)' : 'none',
              }}>
                {delta !== 0 && w > 25 && (
                  <span style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 10, fontWeight: 600,
                    color: active ? T.dBlack : T.dBody, ...NUM,
                  }}>
                    {delta > 0 ? '+' : ''}{gbp(delta)}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COUNTRY SECTION
═══════════════════════════════════════════════════════════════ */
function CountrySection({
  results, current, onSelect, buyer, price,
}: {
  results: SDLTResult[]; current: Country; onSelect: (c: Country) => void;
  buyer: BuyerType; price: number;
}) {
  const maxVal = Math.max(...results.map((r) => r.total), 1);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
          Cross-border
        </div>
        <h2 style={{
          fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 600, color: T.black,
          margin: '8px 0 0', letterSpacing: '-0.02em',
        }}>
          Same purchase across UK nations
        </h2>
        <p style={{ fontSize: 13.5, color: T.muted, margin: '6px 0 0', ...NUM }}>
          {gbp(price)} · {buyerLabel(buyer)}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {results.map((r) => {
          const active = r.country === current;
          const fillW = maxVal === 0 ? 0 : (r.total / maxVal) * 100;
          return (
            <button key={r.country} type="button" onClick={() => onSelect(r.country)}
              style={{
                background: T.paper,
                border: `1px solid ${active ? T.black : T.hair}`,
                borderRadius: 14, padding: 24,
                textAlign: 'left', cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: active ? T.shadowMd : T.shadowSm,
                transition: 'all 0.15s ease', position: 'relative', overflow: 'hidden',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, letterSpacing: '-0.005em' }}>
                    {COUNTRY_LABEL[r.country]}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: T.muted, marginTop: 4, letterSpacing: '0.08em' }}>
                    {r.taxName}
                  </div>
                </div>
                {active && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                    background: T.brand, color: T.paper,
                  }}>Active</span>
                )}
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, color: T.black, letterSpacing: '-0.03em', ...NUM, lineHeight: 1 }}>
                {gbp(r.total)}
              </div>
              <div style={{ marginTop: 12, fontSize: 11.5, color: T.muted, ...NUM }}>
                Effective {pct(r.effectiveRate)}{r.surchargeAmount > 0 ? ` · +${gbp(r.surchargeAmount)} surcharge` : ''}
              </div>
              <div style={{ marginTop: 16, height: 6, background: T.divide, borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: `${fillW}%`, height: '100%',
                  background: active ? T.brand : T.muted,
                  borderRadius: 999,
                  transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REFUND TOOL (conditional)
═══════════════════════════════════════════════════════════════ */
function RefundSection({ defaultPrice }: { defaultPrice: number }) {
  const [price, setPrice]       = useState(defaultPrice);
  const [months, setMonths]     = useState(8);
  const [sold, setSold]         = useState(true);
  const [resident, setResident] = useState(true);

  const r = useMemo(() => calculateRefund({
    purchasePrice: price, monthsSincePurchase: months,
    isUKResident: resident, hasSoldOldHome: sold,
  }), [price, months, sold, resident]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
          Refund tool
        </div>
        <h2 style={{
          fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 600, color: T.black,
          margin: '8px 0 0', letterSpacing: '-0.02em',
        }}>
          Reclaim the 3% surcharge
        </h2>
        <p style={{ fontSize: 13.5, color: T.muted, margin: '6px 0 0' }}>
          If you sold your previous main home within 36 months of paying the surcharge
        </p>
      </div>
      <div style={{
        background: T.paper, border: `1px solid ${T.hair}`,
        borderRadius: 14, overflow: 'hidden',
      }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          <div style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
              <Field label="Property price">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.faint, fontSize: 14 }}>£</span>
                  <input type="number" value={price || ''} onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                    style={{
                      width: '100%', fontSize: 14, padding: '8px 12px 8px 24px',
                      border: `1px solid ${T.hair}`, borderRadius: 6, outline: 'none',
                      color: T.ink, ...NUM, background: T.paper, fontFamily: 'inherit',
                    }} />
                </div>
              </Field>
              <Field label="Months since purchase">
                <input type="number" min={0} max={60} value={months}
                  onChange={(e) => setMonths(Math.max(0, +e.target.value || 0))}
                  style={{
                    width: '100%', fontSize: 14, padding: '8px 12px',
                    border: `1px solid ${T.hair}`, borderRadius: 6, outline: 'none',
                    color: T.ink, ...NUM, background: T.paper, fontFamily: 'inherit',
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
            padding: 24, borderTop: `1px solid ${T.hair}`,
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
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUICK REFERENCE
═══════════════════════════════════════════════════════════════ */
function QuickRef({ country }: { country: Country }) {
  const items = [
    { label: 'Filing deadline',  value: country === 'england' ? '14 days' : '30 days', sub: 'from completion' },
    { label: 'Late penalty',     value: '£100',  sub: 'rising to 100% of tax' },
    { label: 'Refund window',    value: '36 months', sub: '3% surcharge reclaim' },
    { label: 'Nil-rate band',    value: country === 'england' ? '£125k' : country === 'scotland' ? '£145k' : '£225k', sub: '0% threshold' },
    { label: 'Filed by',         value: 'Solicitor', sub: 'as part of completion' },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
          Quick reference
        </div>
        <h2 style={{
          fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 600, color: T.black,
          margin: '8px 0 0', letterSpacing: '-0.02em',
        }}>
          Need-to-know facts
        </h2>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 1, background: T.hair, borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.hair}`,
      }}>
        {items.map((r, i) => (
          <div key={i} style={{ background: T.paper, padding: '20px 22px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {r.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.black, marginTop: 8, ...NUM, letterSpacing: '-0.02em' }}>
              {r.value}
            </div>
            <div style={{ fontSize: 11.5, color: T.faint, marginTop: 4 }}>{r.sub}</div>
          </div>
        ))}
      </div>
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
}: { value: string; onChange: (v: string) => void; options: { id: string; label: string; sub?: string }[] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      gap: 4, padding: 4, background: T.page, borderRadius: 10,
    }}>
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button key={o.id} type="button" onClick={() => onChange(o.id)}
            style={{
              padding: '8px 10px', borderRadius: 6,
              background: active ? T.paper : 'transparent',
              color: active ? T.ink : T.muted,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: active ? T.shadowSm : 'none',
              transition: 'all 0.12s ease',
            }}>
            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>{o.label}</div>
            {o.sub && <div style={{ fontSize: 10, color: T.faint, marginTop: 2, letterSpacing: '0.06em' }}>{o.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  on, onChange, label, desc, disabled = false,
}: { on: boolean; onChange: (v: boolean) => void; label: string; desc: string; disabled?: boolean }) {
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
        background: on ? T.brand : T.ghost, flexShrink: 0, marginTop: 1,
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
