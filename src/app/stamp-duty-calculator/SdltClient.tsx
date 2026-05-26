'use client';

/**
 * SDLT/LBTT/LTT calculator — clean editorial redesign (May 2026).
 *
 * Single-column flow, Inter throughout, hairlines instead of shadows.
 * No display fonts, no dark hero panels, no gradient orbs.
 */

import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  calculateSDLT, calculateAllScenarios, calculateAllCountries, calculateRefund,
  BUYER_LABEL, BUYER_DESC, COUNTRY_LABEL,
  type BuyerType, type Country, type SDLTResult,
} from '../../lib/sdlt/calc';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — single, restricted palette
───────────────────────────────────────────── */
const T = {
  ink:    '#11181C', // primary text
  body:   '#33383D', // body text
  muted:  '#5C6B73', // secondary text
  faint:  '#8A949B', // tertiary text / labels
  hair:   '#E4E7EA', // primary border
  divide: '#F1F3F4', // table dividers
  paper:  '#FFFFFF',
  pale:   '#FAFBFC',
  warn:   '#A4520F',
  ok:     '#0D7A50',
  bad:    '#9B2226',
};

const FONT = 'Inter, system-ui, -apple-system, sans-serif';
const NUM  = 'tabular-nums';

const gbp  = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const gbp2 = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct  = (n: number) => (n * 100).toFixed(2) + '%';

const BUYERS: BuyerType[] = ['standard', 'firstTime', 'additional', 'nonResident', 'addNonRes', 'mixedUse', 'company'];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SdltClient({ initialPrice = 350000 }: { initialPrice?: number }) {
  const [price, setPrice]     = useState(initialPrice);
  const [buyer, setBuyer]     = useState<BuyerType>('standard');
  const [country, setCountry] = useState<Country>('england');
  const [openId, setOpenId]   = useState<null | 'scenarios' | 'countries' | 'refund'>(null);

  const result   = useMemo(() => calculateSDLT(price, buyer, country), [price, buyer, country]);
  const allScen  = useMemo(() => calculateAllScenarios(price, country), [price, country]);
  const allCtry  = useMemo(() => calculateAllCountries(price, buyer), [price, buyer]);

  return (
    <div style={{ fontFamily: FONT, color: T.ink }}>

      {/* ═══ Country tabs ═══ */}
      <div style={{ display: 'flex', gap: 28, borderBottom: `1px solid ${T.hair}`, marginBottom: 40 }}>
        {(['england', 'scotland', 'wales'] as Country[]).map((c) => {
          const active = country === c;
          const taxName = c === 'england' ? 'SDLT' : c === 'scotland' ? 'LBTT' : 'LTT';
          return (
            <button key={c} type="button" onClick={() => setCountry(c)}
              style={{
                padding: '12px 0',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? T.ink : T.muted,
                background: 'transparent',
                border: 'none',
                borderBottom: active ? `2px solid ${T.ink}` : '2px solid transparent',
                marginBottom: -1,
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: 0,
              }}>
              {COUNTRY_LABEL[c]}
              <span style={{ marginLeft: 8, fontSize: 11, color: T.faint, fontWeight: 500, letterSpacing: '0.06em' }}>
                {taxName}
              </span>
            </button>
          );
        })}
      </div>

      {/* ═══ Price input ═══ */}
      <div style={{ marginBottom: 40 }}>
        <Label>Purchase price</Label>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 38, fontWeight: 400, color: T.faint, lineHeight: 1 }}>£</span>
          <input
            type="number" inputMode="decimal"
            value={price || ''}
            onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
            min={0} step={5000}
            style={{
              flex: 1, minWidth: 0,
              fontSize: 38, fontWeight: 600, color: T.ink,
              background: 'transparent', border: 'none', outline: 'none',
              fontVariantNumeric: NUM, fontFamily: FONT, letterSpacing: '-0.015em',
              padding: 0,
            }}
          />
        </div>
        <input type="range" value={price} onChange={(e) => setPrice(+e.target.value)}
               min={50_000} max={2_000_000} step={5000}
               style={{ width: '100%', marginTop: 16, accentColor: T.ink, cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.faint, marginTop: 6, fontVariantNumeric: NUM }}>
          <span>£50k</span><span>£500k</span><span>£1m</span><span>£2m</span>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[150_000, 250_000, 350_000, 500_000, 750_000, 1_000_000, 1_500_000].map((p) => {
            const active = price === p;
            return (
              <button key={p} type="button" onClick={() => setPrice(p)}
                style={{
                  fontSize: 12, fontWeight: 500,
                  padding: '5px 11px',
                  background: active ? T.ink : 'transparent',
                  color: active ? T.paper : T.muted,
                  border: `1px solid ${active ? T.ink : T.hair}`,
                  borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'inherit', fontVariantNumeric: NUM,
                }}>
                {p >= 1_000_000 ? `£${p/1_000_000}m` : `£${p/1000}k`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Buyer scenario ═══ */}
      <div style={{ marginBottom: 48 }}>
        <Label>Buyer scenario</Label>
        <div role="radiogroup">
          {BUYERS.map((b, i) => {
            const active = buyer === b;
            return (
              <label key={b} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 0',
                borderTop: i === 0 ? `1px solid ${T.hair}` : `1px solid ${T.divide}`,
                cursor: 'pointer',
              }}>
                <input type="radio" name="buyer" checked={active}
                       onChange={() => setBuyer(b)}
                       style={{ marginTop: 4, accentColor: T.ink, cursor: 'pointer' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: active ? 600 : 500, color: T.ink, lineHeight: 1.4 }}>
                    {BUYER_LABEL[b]}
                  </div>
                  <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.55, marginTop: 4 }}>
                    {BUYER_DESC[b]}
                  </div>
                </div>
              </label>
            );
          })}
          <div style={{ borderTop: `1px solid ${T.hair}` }} />
        </div>
      </div>

      {/* ═══ HEADLINE RESULT ═══ */}
      <div style={{ marginTop: 48, marginBottom: 32 }}>
        <Label>Your {result.taxName} bill</Label>
        <div style={{
          fontSize: 'clamp(40px, 7vw, 56px)',
          fontWeight: 600, color: T.ink,
          lineHeight: 1, letterSpacing: '-0.025em',
          fontVariantNumeric: NUM,
        }}>
          {gbp(result.total)}
        </div>
        <div style={{ fontSize: 14, color: T.muted, marginTop: 12, lineHeight: 1.5 }}>
          Effective rate{' '}
          <span style={{ color: T.ink, fontWeight: 500, fontVariantNumeric: NUM }}>{pct(result.effectiveRate)}</span>
          {' · '}{COUNTRY_LABEL[result.country]}
          {' · '}<span style={{ color: T.ink }}>{BUYER_LABEL[result.buyerType]}</span>
        </div>
      </div>

      {/* ═══ Band table ═══ */}
      {result.bands.length > 0 && (
        <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse', marginBottom: 32 }}>
          <thead>
            <tr>
              <Th>Band</Th>
              <Th align="right">Taxed on</Th>
              <Th align="right">Tax</Th>
            </tr>
          </thead>
          <tbody>
            {result.bands.map((b, i) => (
              <tr key={i}>
                <Td color={T.body}>{b.label}</Td>
                <Td align="right" color={T.body}>{gbp(b.taxOn)}</Td>
                <Td align="right" color={T.ink} weight={500}>{gbp2(b.tax)}</Td>
              </tr>
            ))}
            {result.surchargeAmount > 0 && (
              <tr>
                <Td color={T.warn} weight={500}>{result.surchargeLabel}</Td>
                <Td align="right" color={T.warn}>{gbp(result.price)}</Td>
                <Td align="right" color={T.warn} weight={500}>{gbp2(result.surchargeAmount)}</Td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '14px 0', color: T.ink, fontWeight: 600, fontSize: 15 }}>Total</td>
              <td style={{ padding: '14px 0' }}></td>
              <td style={{ padding: '14px 0', textAlign: 'right', fontVariantNumeric: NUM, color: T.ink, fontWeight: 600, fontSize: 15 }}>{gbp2(result.total)}</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* ═══ Applied rules ═══ */}
      {result.appliedRules.length > 0 && (
        <div style={{
          paddingLeft: 16, borderLeft: `2px solid ${T.divide}`,
          fontSize: 13, lineHeight: 1.65, color: T.muted,
          marginBottom: 32,
        }}>
          {result.appliedRules.map((r, i) => (
            <p key={i} style={{ margin: i === 0 ? 0 : '8px 0 0' }}>{r}</p>
          ))}
        </div>
      )}

      {/* ═══ Warnings ═══ */}
      {result.warnings.length > 0 && (
        <div style={{
          paddingLeft: 16, borderLeft: `2px solid ${T.warn}`,
          fontSize: 13, lineHeight: 1.65, color: T.warn,
          marginBottom: 32,
        }}>
          {result.warnings.map((w, i) => (
            <p key={i} style={{ margin: i === 0 ? 0 : '8px 0 0' }}>{w}</p>
          ))}
        </div>
      )}

      {/* ═══ Disclosures (collapsible tools) ═══ */}
      <div style={{ borderTop: `1px solid ${T.hair}`, marginTop: 24 }}>
        <Disclosure
          open={openId === 'scenarios'}
          onToggle={() => setOpenId((x) => x === 'scenarios' ? null : 'scenarios')}
          label="Compare all 7 buyer scenarios at this price"
          subLabel={`See the bill across every scenario for ${gbp(price)}.`}
        >
          <ScenariosTable results={allScen} current={buyer} />
        </Disclosure>

        <Disclosure
          open={openId === 'countries'}
          onToggle={() => setOpenId((x) => x === 'countries' ? null : 'countries')}
          label="Compare England, Scotland and Wales"
          subLabel={`SDLT, LBTT and LTT at ${gbp(price)} for a ${BUYER_LABEL[buyer].toLowerCase()}.`}
        >
          <CountriesTable results={allCtry} current={country} />
        </Disclosure>

        <Disclosure
          open={openId === 'refund'}
          onToggle={() => setOpenId((x) => x === 'refund' ? null : 'refund')}
          label="Reclaim the 3% additional-property surcharge"
          subLabel="Check refund eligibility if you sold your previous main home within 36 months."
        >
          <RefundTool />
        </Disclosure>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: T.muted,
      letterSpacing: '0.10em', textTransform: 'uppercase',
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th style={{
      textAlign: align, padding: '10px 0',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: T.faint, borderBottom: `1px solid ${T.hair}`,
    }}>
      {children}
    </th>
  );
}

function Td({
  children, align = 'left', color = T.body, weight = 400,
}: {
  children: React.ReactNode; align?: 'left' | 'right'; color?: string; weight?: number;
}) {
  return (
    <td style={{
      padding: '12px 0', textAlign: align,
      borderBottom: `1px solid ${T.divide}`,
      fontVariantNumeric: align === 'right' ? NUM : 'normal',
      color, fontWeight: weight, fontSize: 14,
    }}>
      {children}
    </td>
  );
}

function Disclosure({
  open, onToggle, label, subLabel, children,
}: {
  open: boolean; onToggle: () => void; label: string; subLabel: string; children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: `1px solid ${T.hair}` }}>
      <button type="button" onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '18px 0', fontFamily: FONT,
        }}>
        <span style={{
          marginTop: 3, color: T.muted, display: 'inline-flex',
          transition: 'transform 0.15s ease',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          <ChevronRight size={14} />
        </span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontSize: 14.5, fontWeight: 500, color: T.ink }}>{label}</span>
          {!open && <span style={{ display: 'block', fontSize: 12.5, color: T.muted, marginTop: 3, lineHeight: 1.5 }}>{subLabel}</span>}
        </span>
      </button>
      {open && <div style={{ padding: '0 0 28px 26px' }}>{children}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPARISON TABLES
───────────────────────────────────────────── */
function ScenariosTable({ results, current }: { results: SDLTResult[]; current: BuyerType }) {
  return (
    <table style={{ width: '100%', fontSize: 13.5, borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <Th>Scenario</Th>
          <Th align="right">Tax</Th>
          <Th align="right">Rate</Th>
          <Th align="right">vs Standard</Th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => {
          const vsStd = r.total - results[0].total;
          const isCurrent = r.buyerType === current;
          return (
            <tr key={r.buyerType}>
              <Td color={isCurrent ? T.ink : T.body} weight={isCurrent ? 600 : 400}>
                {BUYER_LABEL[r.buyerType]}
              </Td>
              <Td align="right" color={T.ink} weight={500}>{gbp(r.total)}</Td>
              <Td align="right" color={T.muted}>{pct(r.effectiveRate)}</Td>
              <Td align="right" color={vsStd > 0 ? T.bad : vsStd < 0 ? T.ok : T.muted}>
                {vsStd === 0 ? '—' : `${vsStd > 0 ? '+' : ''}${gbp(vsStd)}`}
              </Td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function CountriesTable({ results, current }: { results: SDLTResult[]; current: Country }) {
  return (
    <table style={{ width: '100%', fontSize: 13.5, borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <Th>Country</Th>
          <Th align="right">Tax</Th>
          <Th align="right">Rate</Th>
          <Th align="right">Surcharge</Th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => {
          const isCurrent = r.country === current;
          return (
            <tr key={r.country}>
              <Td color={isCurrent ? T.ink : T.body} weight={isCurrent ? 600 : 400}>
                {COUNTRY_LABEL[r.country]}
                <span style={{ marginLeft: 8, fontSize: 11, color: T.faint, fontWeight: 500, letterSpacing: '0.06em' }}>
                  {r.taxName}
                </span>
              </Td>
              <Td align="right" color={T.ink} weight={500}>{gbp(r.total)}</Td>
              <Td align="right" color={T.muted}>{pct(r.effectiveRate)}</Td>
              <Td align="right" color={T.muted}>{r.surchargeAmount > 0 ? gbp(r.surchargeAmount) : '—'}</Td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ─────────────────────────────────────────────
   REFUND SUB-TOOL
───────────────────────────────────────────── */
function RefundTool() {
  const [price, setPrice]       = useState(450_000);
  const [months, setMonths]     = useState(8);
  const [sold, setSold]         = useState(true);
  const [resident, setResident] = useState(true);

  const r = useMemo(() => calculateRefund({
    purchasePrice: price, monthsSincePurchase: months,
    isUKResident: resident, hasSoldOldHome: sold,
  }), [price, months, sold, resident]);

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
        <label>
          <Label>Property price</Label>
          <input type="number" value={price || ''}
                 onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                 style={inputStyle} />
        </label>
        <label>
          <Label>Months since purchase</Label>
          <input type="number" min={0} max={60} value={months}
                 onChange={(e) => setMonths(Math.max(0, +e.target.value || 0))}
                 style={inputStyle} />
          <input type="range" min={0} max={60} value={months}
                 onChange={(e) => setMonths(+e.target.value)}
                 style={{ width: '100%', marginTop: 8, accentColor: T.ink, cursor: 'pointer' }} />
        </label>
      </div>

      <label style={checkboxRow}>
        <input type="checkbox" checked={sold} onChange={(e) => setSold(e.target.checked)} style={{ accentColor: T.ink, cursor: 'pointer' }} />
        Sold (or will sell) previous main home within 36 months
      </label>
      <label style={{ ...checkboxRow, marginBottom: 28 }}>
        <input type="checkbox" checked={resident} onChange={(e) => setResident(e.target.checked)} style={{ accentColor: T.ink, cursor: 'pointer' }} />
        UK-resident at the refund claim date
      </label>

      <div style={{ borderTop: `1px solid ${T.hair}`, paddingTop: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: r.eligible ? T.ok : T.bad,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          {r.eligible ? '— Eligible —' : '— Not eligible —'}
        </div>
        <div style={{
          fontSize: 36, fontWeight: 600, color: T.ink,
          fontVariantNumeric: NUM, lineHeight: 1, letterSpacing: '-0.02em',
          marginBottom: 10,
        }}>
          {gbp(r.refundAmount)}
        </div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>
          Potential refund of the 3% additional-property surcharge.
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12.5, color: T.muted, lineHeight: 1.65 }}>
          {r.reasons.map((reason, i) => (
            <li key={i} style={{ marginTop: i === 0 ? 0 : 6, paddingLeft: 12, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: 0 }}>·</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', fontSize: 16, padding: '9px 12px',
  border: `1px solid ${T.hair}`, borderRadius: 4, outline: 'none',
  color: T.ink, fontFamily: FONT, fontVariantNumeric: NUM,
  background: T.paper,
};

const checkboxRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  fontSize: 13.5, color: T.body, lineHeight: 1.4,
  cursor: 'pointer', marginBottom: 12,
};
