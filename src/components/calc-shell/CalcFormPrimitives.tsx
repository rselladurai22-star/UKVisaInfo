'use client';
/**
 * CalcFormPrimitives v3 — "Graphite & Flame" design system
 * Flat underline inputs · Dark stat cards · Violet toggles · Syne/Space Grotesk type
 */

/* ─── tokens ──────────────────────────────────────────────── */
const T = {
  ink:      '#0D1117',
  mid:      '#6B7280',
  faint:    '#9CA3AF',
  border:   '#E2E6EB',
  bg:       '#F8F9FB',
  canvas:   '#FFFFFF',
  accentV:  '#7C3AED',   // violet
  accentA:  '#F59E0B',   // amber
  positive: '#059669',
  negative: '#DC2626',
  dark:     '#111827',
};
const SYNE  = '"Manrope", "DM Sans", sans-serif';
const GRSK  = '"DM Sans", system-ui, sans-serif';
const INTER = '"DM Sans", system-ui, sans-serif';

/* ─── formatters ─────────────────────────────────────────── */
export function fmtGBP(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
}
export function fmtGBP2(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
export function fmtPct(n: number, dp = 1) { return `${n.toFixed(dp)}%`; }

/* ─── Field wrapper ──────────────────────────────────────── */
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{
        display: 'block',
        fontFamily: GRSK,
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase' as const,
        color: T.mid,
        marginBottom: 6,
      }}>
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ display: 'block', fontFamily: INTER, fontSize: 11, color: T.faint, marginTop: 4, lineHeight: 1.5 }}>{hint}</span>
      )}
    </label>
  );
}

/* ─── NumberField — flat underline style ─────────────────── */
export function NumberField({
  label, value, onChange, prefix, suffix, step = 'any', hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; step?: string; hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        borderBottom: `2px solid ${T.border}`,
        paddingBottom: 8,
        transition: 'border-color 0.15s',
      }}
        onFocusCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = T.accentV)}
        onBlurCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = T.border)}
      >
        {prefix && <span style={{ fontFamily: GRSK, fontSize: 15, fontWeight: 600, color: T.mid }}>{prefix}</span>}
        <input
          type="number" inputMode="decimal" step={step} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: GRSK, fontSize: 18, fontWeight: 700, color: T.ink, letterSpacing: '-0.02em',
          }}
        />
        {suffix && <span style={{ fontFamily: INTER, fontSize: 12, color: T.faint }}>{suffix}</span>}
      </div>
    </Field>
  );
}

/* ─── SelectField ────────────────────────────────────────── */
export function SelectField<T extends string>({
  label, value, onChange, options, hint,
}: {
  label: string; value: T; onChange: (v: T) => void;
  options: { value: T; label: string }[]; hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: `2px solid ${T.border}`,
          paddingBottom: 8,
          fontFamily: GRSK, fontSize: 16, fontWeight: 600, color: T.ink,
          outline: 'none', cursor: 'pointer',
          appearance: 'none' as const,
          WebkitAppearance: 'none' as const,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = T.accentV)}
        onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

/* ─── ToggleRow — solid violet/grey blocks ───────────────── */
export function ToggleRow<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'inline-flex', gap: 4, background: T.bg, padding: 4, borderRadius: 6, border: `1px solid ${T.border}` }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 14px',
              fontFamily: GRSK, fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
              borderRadius: 4, border: 'none', cursor: 'pointer',
              background: active ? T.accentV : 'transparent',
              color: active ? '#fff' : T.mid,
              transition: 'all 0.14s',
            }}
          >
            {o.icon}{o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── ResultBox ──────────────────────────────────────────── */
export function ResultBox({
  label, value, primary, muted, accent, sub,
}: {
  label: string; value: string; primary?: boolean; muted?: boolean; accent?: string; sub?: string;
}) {
  const clr = accent ?? (primary ? T.accentV : muted ? T.faint : T.ink);
  return (
    <div style={{
      borderLeft: `4px solid ${primary ? T.accentV : muted ? T.border : T.accentA}`,
      paddingLeft: 14, paddingTop: 2, paddingBottom: 2,
    }}>
      <div style={{ fontFamily: GRSK, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: T.mid, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontFamily: SYNE, fontSize: 28, fontWeight: 800, color: clr, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: INTER, fontSize: 11.5, color: T.faint, marginTop: 3, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

/* ─── CalcCard ───────────────────────────────────────────── */
export function CalcCard({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{
      background: T.canvas,
      border: `1px solid ${T.border}`,
      borderRadius: 6,
      padding: '22px 24px',
      maxWidth: wide ? '100%' : 700,
    }}>
      {children}
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────── */
export function Section({ title, eyebrow, children, accent = T.accentV, tone = 'default' }: {
  title: string; eyebrow?: string; children: React.ReactNode;
  accent?: string; tone?: 'default' | 'inputs' | 'results';
}) {
  const bg = tone === 'inputs' ? T.bg : tone === 'results' ? '#F4F3FF' : 'transparent';
  const bdr = tone === 'default' ? 'none' : `1px solid ${T.border}`;
  return (
    <section style={{ background: bg, border: bdr, borderRadius: 6, padding: tone === 'default' ? 0 : '18px 20px 20px' }}>
      <header style={{ marginBottom: 14, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' as const }}>
        {eyebrow && (
          <span style={{ fontFamily: GRSK, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: accent }}>
            {eyebrow}
          </span>
        )}
        <h3 style={{ fontFamily: SYNE, fontSize: 14, fontWeight: 700, color: T.ink, letterSpacing: '-0.02em', margin: 0 }}>
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}

/* ─── StatGrid ───────────────────────────────────────────── */
export function StatGrid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const c = cols === 2 ? 'repeat(2,1fr)' : cols === 4 ? 'repeat(auto-fill,minmax(160px,1fr))' : 'repeat(auto-fill,minmax(180px,1fr))';
  return <div style={{ display: 'grid', gridTemplateColumns: c, gap: 10 }}>{children}</div>;
}

/* ─── StatCard — dark cards with big amber numbers ───────── */
export function StatCard({ label, value, sub, tone = 'default', accent }: {
  label: string; value: string; sub?: string;
  tone?: 'default' | 'primary' | 'positive' | 'negative' | 'muted';
  accent?: string;
}) {
  const dark = tone === 'primary';
  const bg   = tone === 'primary' ? T.dark : tone === 'positive' ? '#ECFDF5' : tone === 'negative' ? '#FEF2F2' : tone === 'muted' ? T.bg : T.canvas;
  const txt  = tone === 'primary' ? '#FFFFFF' : tone === 'positive' ? '#064E3B' : tone === 'negative' ? '#7F1D1D' : T.ink;
  const lbl  = tone === 'primary' ? 'rgba(255,255,255,0.5)' : T.mid;
  const sub_ = tone === 'primary' ? 'rgba(255,255,255,0.4)' : T.faint;
  const numClr = accent ?? (tone === 'primary' ? T.accentA : tone === 'positive' ? T.positive : tone === 'negative' ? T.negative : T.accentV);
  return (
    <div style={{
      background: bg,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : T.border}`,
      borderRadius: 6,
      padding: '14px 16px',
    }}>
      <div style={{ fontFamily: GRSK, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: lbl, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: SYNE, fontSize: 22, fontWeight: 800, color: numClr, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: INTER, fontSize: 11, color: sub_, marginTop: 4, lineHeight: 1.45 }}>{sub}</div>}
    </div>
  );
}

/* ─── SummaryHero — large result banner ─────────────────── */
export function SummaryHero({ label, value, sub, tone = 'navy', badge }: {
  label: string; value: string; sub?: string;
  tone?: 'navy' | 'teal' | 'red'; badge?: string;
}) {
  const bg  = tone === 'navy' ? T.dark : tone === 'teal' ? '#065F46' : '#7F1D1D';
  const num = tone === 'navy' ? T.accentA : tone === 'teal' ? '#6EE7B7' : '#FCA5A5';
  return (
    <div style={{
      background: bg, borderRadius: 8, padding: 'clamp(20px,4vw,28px)',
      borderLeft: `4px solid ${num}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const, marginBottom: 8 }}>
        <span style={{ fontFamily: GRSK, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.5)' }}>
          {label}
        </span>
        {badge && (
          <span style={{
            fontFamily: GRSK, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, color: num,
            background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 3,
          }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontFamily: SYNE, fontSize: 'clamp(32px,6vw,48px)', fontWeight: 800, color: num, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: INTER, fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 8, lineHeight: 1.55 }}>{sub}</div>}
    </div>
  );
}

/* ─── BreakdownTable ─────────────────────────────────────── */
export function BreakdownTable({ rows, highlightLast }: {
  rows: { label: string; value: string; sub?: string; bold?: boolean; negative?: boolean; positive?: boolean }[];
  highlightLast?: boolean;
}) {
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden' }}>
      {rows.map((r, i) => {
        const last = highlightLast && i === rows.length - 1;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px',
            borderTop: i > 0 ? `1px solid ${T.border}` : 'none',
            background: last ? T.dark : T.canvas,
          }}>
            <div>
              <div style={{
                fontFamily: INTER, fontSize: 13,
                fontWeight: r.bold || last ? 700 : 500,
                color: last ? 'rgba(255,255,255,0.9)' : r.bold ? T.ink : T.mid,
              }}>
                {r.label}
              </div>
              {r.sub && <div style={{ fontFamily: INTER, fontSize: 10.5, color: last ? 'rgba(255,255,255,0.4)' : T.faint, marginTop: 2 }}>{r.sub}</div>}
            </div>
            <div style={{
              fontFamily: GRSK,
              fontSize: 14,
              fontWeight: r.bold || last ? 700 : 600,
              color: last ? T.accentA : r.negative ? T.negative : r.positive ? T.positive : r.bold ? T.ink : T.mid,
              letterSpacing: '-0.01em',
            }}>
              {r.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── ScenarioTabs — solid block selector ───────────────── */
export function ScenarioTabs<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const cols = options.length;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 6 }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{
              textAlign: 'left', padding: '12px 14px',
              border: `2px solid ${active ? T.accentV : T.border}`,
              borderRadius: 6, cursor: 'pointer',
              background: active ? T.accentV : T.canvas,
              color: active ? '#fff' : T.ink,
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontFamily: GRSK, fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>{o.label}</div>
            {o.sub && (
              <div style={{ fontFamily: INTER, fontSize: 11, marginTop: 2, color: active ? 'rgba(255,255,255,0.6)' : T.faint }}>
                {o.sub}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Tip ────────────────────────────────────────────────── */
export function Tip({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'warn' | 'success' }) {
  const s = {
    info:    { bg: '#EEF2FF', barClr: T.accentV, txt: '#3730A3', icon: 'ⓘ' },
    warn:    { bg: '#FFFBEB', barClr: T.accentA, txt: '#92400E', icon: '⚠' },
    success: { bg: '#ECFDF5', barClr: T.positive, txt: '#065F46', icon: '✓' },
  }[tone];
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      background: s.bg, borderLeft: `3px solid ${s.barClr}`,
      borderRadius: '0 4px 4px 0',
      padding: '10px 14px',
      fontFamily: INTER, fontSize: 12.5, color: s.txt, lineHeight: 1.55,
    }}>
      <span style={{ flexShrink: 0, fontWeight: 700, marginTop: 1 }}>{s.icon}</span>
      <div>{children}</div>
    </div>
  );
}

/* ─── CheckboxField ──────────────────────────────────────── */
export function CheckboxField({ label, checked, onChange, hint }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      border: `1px solid ${checked ? T.accentV : T.border}`,
      borderRadius: 6, padding: '12px 14px', cursor: 'pointer',
      background: checked ? '#EEF2FF' : T.canvas,
      transition: 'all 0.15s',
    }}>
      <input
        type="checkbox" checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 2, accentColor: T.accentV, width: 15, height: 15, flexShrink: 0 }}
      />
      <span>
        <span style={{ display: 'block', fontFamily: GRSK, fontSize: 13, fontWeight: 600, color: T.ink }}>{label}</span>
        {hint && <span style={{ display: 'block', fontFamily: INTER, fontSize: 11, color: T.mid, marginTop: 3, lineHeight: 1.45 }}>{hint}</span>}
      </span>
    </label>
  );
}
