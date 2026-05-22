'use client';
/**
 * CalcFormPrimitives v4 — "Quartz" design system
 * Stripe/Linear-inspired · light fills · hairline borders · refined indigo accent
 * Inter Tight (display) + Inter (body) · tabular numerics
 */

/* ─── tokens — match CalcPageShell Quartz ─────────────────── */
const Q = {
  bg:        '#FCFCFD',
  bgAlt:     '#F7F8FA',
  bgInput:   '#F7F8FA',
  surface:   '#FFFFFF',
  ink:       '#1A1F36',
  ink2:      '#3C4257',
  mid:       '#697386',
  mid2:      '#8792A2',
  faint:     '#A3ACB9',
  border:    '#E3E8EE',
  borderStr: '#CFD7DF',
  accent:    '#635BFF',
  accentDk:  '#5851DB',
  accentSoft:'#EFEEFF',
  positive:  '#08855D',
  positiveSoft: '#E6F7EF',
  warning:   '#BF6A02',
  warningSoft: '#FCEDD3',
  negative:  '#CD3D64',
  negativeSoft: '#FDEEF0',
};
const DISPLAY = '"Inter Tight", Inter, system-ui, sans-serif';
const TEXT    = 'Inter, system-ui, -apple-system, sans-serif';
const MONO    = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

/* ─── formatters ──────────────────────────────────────────── */
export function fmtGBP(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
}
export function fmtGBP2(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
export function fmtPct(n: number, dp = 1) { return `${n.toFixed(dp)}%`; }

/* ─── Field wrapper ───────────────────────────────────────── */
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{
        display: 'block',
        fontFamily: TEXT,
        fontSize: 13,
        fontWeight: 500,
        color: Q.ink2,
        letterSpacing: '-0.005em',
        marginBottom: 6,
      }}>
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ display: 'block', fontFamily: TEXT, fontSize: 12, color: Q.mid2, marginTop: 5, lineHeight: 1.5 }}>{hint}</span>
      )}
    </label>
  );
}

/* ─── NumberField — Stripe-style light fill with focus ring ─ */
export function NumberField({
  label, value, onChange, prefix, suffix, step = 'any', hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; step?: string; hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div
        className="cfp-input"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: Q.bgInput,
          border: `1px solid ${Q.border}`,
          borderRadius: 8,
          padding: '0 12px',
          height: 40,
          transition: 'box-shadow 0.12s ease, border-color 0.12s ease',
        }}
        onFocusCapture={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = Q.accent;
          el.style.background = Q.surface;
          el.style.boxShadow = `0 0 0 3px ${Q.accent}26`;
        }}
        onBlurCapture={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = Q.border;
          el.style.background = Q.bgInput;
          el.style.boxShadow = 'none';
        }}
      >
        {prefix && <span style={{ fontFamily: TEXT, fontSize: 14, fontWeight: 500, color: Q.mid }}>{prefix}</span>}
        <input
          type="number" inputMode="decimal" step={step} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: TEXT, fontSize: 14.5, fontWeight: 500, color: Q.ink,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.005em',
            height: '100%',
          }}
        />
        {suffix && <span style={{ fontFamily: TEXT, fontSize: 13, color: Q.mid2 }}>{suffix}</span>}
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
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          style={{
            width: '100%',
            background: Q.bgInput,
            border: `1px solid ${Q.border}`,
            borderRadius: 8,
            padding: '0 36px 0 12px',
            height: 40,
            fontFamily: TEXT, fontSize: 14.5, fontWeight: 500, color: Q.ink,
            letterSpacing: '-0.005em',
            outline: 'none', cursor: 'pointer',
            appearance: 'none' as const,
            WebkitAppearance: 'none' as const,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = Q.accent;
            e.currentTarget.style.background = Q.surface;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${Q.accent}26`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = Q.border;
            e.currentTarget.style.background = Q.bgInput;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <path d="M1 1l4 4 4-4" stroke={Q.mid2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Field>
  );
}

/* ─── ToggleRow — segmented control ──────────────────────── */
export function ToggleRow<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{
      display: 'inline-flex', gap: 2,
      background: Q.bgInput,
      padding: 3,
      borderRadius: 8,
      border: `1px solid ${Q.border}`,
    }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 12px',
              fontFamily: TEXT, fontSize: 13, fontWeight: 500,
              letterSpacing: '-0.005em',
              borderRadius: 6, border: 'none', cursor: 'pointer',
              background: active ? Q.surface : 'transparent',
              color: active ? Q.ink : Q.mid,
              boxShadow: active ? '0 1px 2px rgba(26,31,54,0.08), 0 0 0 1px rgba(26,31,54,0.04)' : 'none',
              transition: 'all 0.12s ease',
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
  const clr = accent ?? (primary ? Q.accent : muted ? Q.mid2 : Q.ink);
  return (
    <div style={{ paddingLeft: 0 }}>
      <div style={{
        fontFamily: TEXT, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase' as const,
        color: Q.mid2, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: DISPLAY, fontSize: 28, fontWeight: 700,
        color: clr, letterSpacing: '-0.025em', lineHeight: 1.1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: TEXT, fontSize: 12.5, color: Q.mid, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

/* ─── CalcCard ───────────────────────────────────────────── */
export function CalcCard({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{
      background: 'transparent',
      maxWidth: wide ? '100%' : '100%',
    }}>
      {children}
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────── */
export function Section({ title, eyebrow, children, tone = 'default' }: {
  title: string; eyebrow?: string; children: React.ReactNode;
  accent?: string; tone?: 'default' | 'inputs' | 'results';
}) {
  const bg     = tone === 'inputs' ? Q.bgAlt : tone === 'results' ? Q.accentSoft : 'transparent';
  const border = tone === 'default' ? 'none' : `1px solid ${tone === 'results' ? '#DDD8FF' : Q.border}`;
  const pad    = tone === 'default' ? 0 : 'clamp(18px,3vw,22px)';
  return (
    <section style={{
      background: bg, border, borderRadius: tone === 'default' ? 0 : 12, padding: pad,
    }}>
      <header style={{ marginBottom: 16 }}>
        {eyebrow && (
          <div style={{
            fontFamily: TEXT, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            color: Q.mid2, marginBottom: 4,
          }}>
            {eyebrow}
          </div>
        )}
        <h3 style={{
          fontFamily: DISPLAY, fontSize: 16, fontWeight: 600,
          color: Q.ink, letterSpacing: '-0.015em', margin: 0, lineHeight: 1.3,
        }}>
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}

/* ─── StatGrid ───────────────────────────────────────────── */
export function StatGrid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const c = cols === 2 ? 'repeat(auto-fill,minmax(200px,1fr))'
          : cols === 4 ? 'repeat(auto-fill,minmax(160px,1fr))'
          :              'repeat(auto-fill,minmax(180px,1fr))';
  return <div style={{ display: 'grid', gridTemplateColumns: c, gap: 12 }}>{children}</div>;
}

/* ─── StatCard — light surface, tonal accents ────────────── */
export function StatCard({ label, value, sub, tone = 'default', accent }: {
  label: string; value: string; sub?: string;
  tone?: 'default' | 'primary' | 'positive' | 'negative' | 'muted';
  accent?: string;
}) {
  const bg =
    tone === 'primary'  ? Q.accentSoft :
    tone === 'positive' ? Q.positiveSoft :
    tone === 'negative' ? Q.negativeSoft :
    tone === 'muted'    ? Q.bgAlt :
                          Q.surface;
  const border =
    tone === 'primary'  ? '#DDD8FF' :
    tone === 'positive' ? '#BFE3D3' :
    tone === 'negative' ? '#F8C9D2' :
                          Q.border;
  const numClr = accent ?? (
    tone === 'primary'  ? Q.accentDk :
    tone === 'positive' ? Q.positive :
    tone === 'negative' ? Q.negative :
                          Q.ink
  );
  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{
        fontFamily: TEXT, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase' as const,
        color: Q.mid2, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: DISPLAY, fontSize: 22, fontWeight: 700,
        color: numClr, letterSpacing: '-0.025em', lineHeight: 1.15,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: TEXT, fontSize: 12, color: Q.mid, marginTop: 5, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

/* ─── SummaryHero — refined indigo gradient banner ────────── */
export function SummaryHero({ label, value, sub, tone = 'navy', badge }: {
  label: string; value: string; sub?: string;
  tone?: 'navy' | 'teal' | 'red'; badge?: string;
}) {
  const isNavy = tone === 'navy';
  const bg =
    isNavy ? 'linear-gradient(135deg, #1A1F36 0%, #2D2456 100%)' :
    tone === 'teal' ? 'linear-gradient(135deg, #06593F 0%, #08855D 100%)' :
                      'linear-gradient(135deg, #8B1538 0%, #CD3D64 100%)';
  const numColor = isNavy ? '#FFFFFF' : '#FFFFFF';
  const accentBar = isNavy ? Q.accent : tone === 'teal' ? '#34D399' : '#FCA5A5';
  return (
    <div style={{
      background: bg,
      borderRadius: 14,
      padding: 'clamp(22px,4vw,30px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
        background: accentBar,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const, marginBottom: 10 }}>
        <span style={{
          fontFamily: TEXT, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,0.7)',
        }}>
          {label}
        </span>
        {badge && (
          <span style={{
            fontFamily: TEXT, fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase' as const,
            color: '#fff',
            background: 'rgba(255,255,255,0.16)',
            border: '1px solid rgba(255,255,255,0.18)',
            padding: '2px 8px', borderRadius: 999,
          }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{
        fontFamily: DISPLAY, fontSize: 'clamp(32px,6vw,46px)',
        fontWeight: 700, color: numColor,
        letterSpacing: '-0.03em', lineHeight: 1.05,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontFamily: TEXT, fontSize: 14, color: 'rgba(255,255,255,0.72)',
          marginTop: 10, lineHeight: 1.6, maxWidth: 520,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ─── BreakdownTable ─────────────────────────────────────── */
export function BreakdownTable({ rows, highlightLast }: {
  rows: { label: string; value: string; sub?: string; bold?: boolean; negative?: boolean; positive?: boolean }[];
  highlightLast?: boolean;
}) {
  return (
    <div style={{ border: `1px solid ${Q.border}`, borderRadius: 10, overflow: 'hidden', background: Q.surface }}>
      {rows.map((r, i) => {
        const last = highlightLast && i === rows.length - 1;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            padding: '12px 16px',
            borderTop: i > 0 ? `1px solid ${Q.border}` : 'none',
            background: last ? Q.bgAlt : Q.surface,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: TEXT, fontSize: 13.5,
                fontWeight: r.bold || last ? 600 : 400,
                color: r.bold || last ? Q.ink : Q.ink2,
                letterSpacing: '-0.005em',
              }}>
                {r.label}
              </div>
              {r.sub && <div style={{ fontFamily: TEXT, fontSize: 11.5, color: Q.mid2, marginTop: 2, lineHeight: 1.45 }}>{r.sub}</div>}
            </div>
            <div style={{
              fontFamily: TEXT,
              fontSize: 14,
              fontWeight: r.bold || last ? 600 : 500,
              color: last ? Q.ink : r.negative ? Q.negative : r.positive ? Q.positive : Q.ink2,
              letterSpacing: '-0.005em',
              fontVariantNumeric: 'tabular-nums',
              flexShrink: 0,
            }}>
              {r.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── ScenarioTabs — card-style selector ────────────────── */
export function ScenarioTabs<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit,minmax(140px,1fr))`,
      gap: 8,
    }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{
              textAlign: 'left',
              padding: '12px 14px',
              border: `1px solid ${active ? Q.accent : Q.border}`,
              borderRadius: 10, cursor: 'pointer',
              background: active ? Q.accentSoft : Q.surface,
              boxShadow: active ? `0 0 0 3px ${Q.accent}1f` : 'none',
              transition: 'all 0.12s ease',
            }}
          >
            <div style={{
              fontFamily: DISPLAY, fontSize: 13.5, fontWeight: 600,
              color: active ? Q.accentDk : Q.ink,
              letterSpacing: '-0.01em',
            }}>
              {o.label}
            </div>
            {o.sub && (
              <div style={{
                fontFamily: TEXT, fontSize: 11.5, marginTop: 3,
                color: active ? Q.accentDk : Q.mid,
                lineHeight: 1.4,
              }}>
                {o.sub}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Tip — alert/callout ────────────────────────────────── */
export function Tip({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'warn' | 'success' }) {
  const s = {
    info:    { bg: Q.accentSoft,    border: '#DDD8FF', barClr: Q.accent,   txt: Q.accentDk, icon: 'ⓘ' },
    warn:    { bg: Q.warningSoft,   border: '#F5D88B', barClr: Q.warning,  txt: '#7E4A02',  icon: '⚠' },
    success: { bg: Q.positiveSoft,  border: '#BFE3D3', barClr: Q.positive, txt: '#054A36',  icon: '✓' },
  }[tone];
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderLeft: `3px solid ${s.barClr}`,
      borderRadius: 8,
      padding: '11px 14px',
      fontFamily: TEXT, fontSize: 13, color: s.txt, lineHeight: 1.55,
    }}>
      <span style={{ flexShrink: 0, fontWeight: 600, marginTop: 1, color: s.barClr }}>{s.icon}</span>
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
      border: `1px solid ${checked ? Q.accent : Q.border}`,
      borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
      background: checked ? Q.accentSoft : Q.surface,
      boxShadow: checked ? `0 0 0 3px ${Q.accent}1f` : 'none',
      transition: 'all 0.12s ease',
    }}>
      <input
        type="checkbox" checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 2, accentColor: Q.accent, width: 15, height: 15, flexShrink: 0 }}
      />
      <span style={{ minWidth: 0 }}>
        <span style={{
          display: 'block', fontFamily: TEXT, fontSize: 13.5, fontWeight: 500,
          color: Q.ink, letterSpacing: '-0.005em',
        }}>
          {label}
        </span>
        {hint && <span style={{ display: 'block', fontFamily: TEXT, fontSize: 12, color: Q.mid, marginTop: 3, lineHeight: 1.5 }}>{hint}</span>}
      </span>
    </label>
  );
}
