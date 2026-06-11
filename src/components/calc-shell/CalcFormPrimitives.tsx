'use client';
/**
 * CalcFormPrimitives v4 — "Quartz" design system
 * Stripe/Linear-inspired · light fills · hairline borders · refined indigo accent
 * Inter Tight (display) + Inter (body) · tabular numerics
 */

/* ─── tokens — match CalcPageShell Quartz ─────────────────── */
const Q = {
  bg:        '#f8fafc',
  bgAlt:     '#FAFAFB',
  bgInput:   '#f8fafc',
  surface:   '#FFFFFF',
  ink:       '#18181B',
  ink2:      '#3F3F46',
  mid:       '#52525B',
  mid2:      '#6B7280',
  faint:     '#9CA3AF',
  border:    'rgba(15, 23, 42, 0.06)',
  borderStr: 'rgba(15, 23, 42, 0.08)',
  accent:    '#6366F1',
  accentDk:  '#4F46E5',
  accentSoft:'#EEF2FF',
  positive:  '#047857',
  positiveSoft: '#ecfdf5',
  warning:   '#B45309',
  warningSoft: '#FEF3C7',
  negative:  '#BE123C',
  negativeSoft: '#FFE4E6',
};
const DISPLAY = 'var(--font-display), var(--font-grotesk), "Inter Tight", Inter, system-ui, sans-serif';
const TEXT    = 'var(--font-sans), var(--font-inter), Inter, system-ui, -apple-system, sans-serif';
const MONO    = 'var(--font-mono), var(--font-jetbrains), "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

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
        fontWeight: 600,
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
          borderRadius: 10,
          padding: '0 14px',
          height: 46,
          transition: 'all 0.12s ease',
        }}
        onFocusCapture={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = Q.accent;
          el.style.background = Q.surface;
          el.style.boxShadow = `0 0 0 3px ${Q.accent}1a`;
        }}
        onBlurCapture={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = Q.border;
          el.style.background = Q.bgInput;
          el.style.boxShadow = 'none';
        }}
      >
        {prefix && <span style={{ fontFamily: TEXT, fontSize: 14.5, fontWeight: 600, color: Q.mid }}>{prefix}</span>}
        <input
          type="number" inputMode="decimal" step={step} value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
            // 16px floor: anything smaller makes iOS Safari zoom the page on focus
            fontFamily: TEXT, fontSize: 16, fontWeight: 600, color: Q.ink,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.005em',
            height: '100%',
          }}
        />
        {suffix && <span style={{ fontFamily: TEXT, fontSize: 13, fontWeight: 500, color: Q.mid2 }}>{suffix}</span>}
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
            borderRadius: 10,
            padding: '0 36px 0 14px',
            height: 46,
            fontFamily: TEXT, fontSize: 16, fontWeight: 600, color: Q.ink,
            letterSpacing: '-0.005em',
            outline: 'none', cursor: 'pointer',
            appearance: 'none' as const,
            WebkitAppearance: 'none' as const,
            transition: 'all 0.12s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = Q.accent;
            e.currentTarget.style.background = Q.surface;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${Q.accent}1a`;
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
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
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
      display: 'inline-flex', flexWrap: 'wrap', gap: 2, maxWidth: '100%',
      background: '#f1f5f9',
      padding: 3,
      borderRadius: 10,
      border: '1px solid #e2e8f0',
    }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value} type="button" onClick={() => onChange(o.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px',
              fontFamily: TEXT, fontSize: 13, fontWeight: 600,
              letterSpacing: '-0.005em',
              borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active ? '#ffffff' : 'transparent',
              color: active ? '#4f46e5' : '#64748b',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)' : 'none',
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
  const clr = accent ?? (primary ? Q.accentDk : muted ? Q.mid2 : Q.ink);
  return (
    <div style={{
      background: primary ? Q.accentSoft : '#f8fafc',
      border: `1px solid ${primary ? '#c7d2fe' : Q.border}`,
      borderRadius: 12,
      padding: '16px 20px',
    }}>
      <div style={{
        fontFamily: TEXT, fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.06em', textTransform: 'uppercase' as const,
        color: primary ? Q.accentDk : Q.mid2, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: DISPLAY, fontSize: 32, fontWeight: 800,
        color: clr, letterSpacing: '-0.03em', lineHeight: 1.1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: TEXT, fontSize: 12, color: primary ? Q.accentDk : Q.mid, opacity: 0.8, marginTop: 4, lineHeight: 1.5 }}>{sub}</div>}
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
  const bg     = tone === 'inputs' ? Q.bgAlt : tone === 'results' ? '#f8fafc' : 'transparent';
  const border = tone === 'default' ? 'none' : `1px solid rgba(15, 23, 42, 0.06)`;
  const pad    = tone === 'default' ? 0 : 'clamp(18px,3vw,24px)';
  return (
    <section style={{
      background: bg, border, borderRadius: tone === 'default' ? 0 : 16, padding: pad,
      boxShadow: tone !== 'default' ? '0 4px 20px -6px rgba(15, 23, 42, 0.02)' : 'none',
      marginBottom: 20,
    }}>
      <header style={{ marginBottom: 16 }}>
        {eyebrow && (
          <div style={{
            fontFamily: TEXT, fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            color: Q.accent, marginBottom: 4,
          }}>
            {eyebrow}
          </div>
        )}
        <h3 style={{
          fontFamily: DISPLAY, fontSize: 16.5, fontWeight: 700,
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
    tone === 'primary'  ? '#C7D2FE' :
    tone === 'positive' ? '#BFE3D3' :
    tone === 'negative' ? '#F8C9D2' :
                          'rgba(15, 23, 42, 0.06)';
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
      borderRadius: 12,
      padding: '16px 20px',
      boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.02)',
    }}>
      <div style={{
        fontFamily: TEXT, fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.04em', textTransform: 'uppercase' as const,
        color: Q.mid2, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: DISPLAY, fontSize: 24, fontWeight: 800,
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
    isNavy ? 'linear-gradient(135deg, #221552 0%, #3A2370 60%, #4A2C6E 100%)' :
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
    <div style={{ border: `1px solid rgba(15, 23, 42, 0.06)`, borderRadius: 12, overflow: 'hidden', background: Q.surface, boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.02)' }}>
      {rows.map((r, i) => {
        const last = highlightLast && i === rows.length - 1;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            padding: '14px 18px',
            borderTop: i > 0 ? `1px solid rgba(15, 23, 42, 0.04)` : 'none',
            background: last ? '#ecfdf5' : Q.surface,
            borderLeft: last ? '3px solid #10b981' : 'none',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: TEXT, fontSize: 13.5,
                fontWeight: r.bold || last ? 700 : 500,
                color: last ? '#047857' : r.bold ? Q.ink : Q.ink2,
                letterSpacing: '-0.005em',
              }}>
                {r.label}
              </div>
              {r.sub && <div style={{ fontFamily: TEXT, fontSize: 11.5, color: Q.mid2, marginTop: 2, lineHeight: 1.45 }}>{r.sub}</div>}
            </div>
            <div style={{
              fontFamily: TEXT,
              fontSize: 14.5,
              fontWeight: r.bold || last ? 700 : 600,
              color: last ? '#047857' : r.negative ? Q.negative : r.positive ? Q.positive : Q.ink2,
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
    info:    { bg: Q.accentSoft,    border: '#C7D2FE', barClr: Q.accent,   txt: Q.accentDk, icon: 'ⓘ' },
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
      border: `1px solid ${checked ? Q.accent : 'rgba(15, 23, 42, 0.06)'}`,
      borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
      background: checked ? Q.accentSoft : Q.surface,
      boxShadow: checked ? `0 4px 12px -3px ${Q.accent}15` : '0 2px 8px -2px rgba(15, 23, 42, 0.02)',
      transition: 'all 0.12s ease',
    }}>
      <input
        type="checkbox" checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 2, accentColor: Q.accent, width: 16, height: 16, flexShrink: 0 }}
      />
      <span style={{ minWidth: 0 }}>
        <span style={{
          display: 'block', fontFamily: TEXT, fontSize: 13.5, fontWeight: 600,
          color: Q.ink, letterSpacing: '-0.005em',
        }}>
          {label}
        </span>
        {hint && <span style={{ display: 'block', fontFamily: TEXT, fontSize: 12, color: Q.mid, marginTop: 4, lineHeight: 1.5 }}>{hint}</span>}
      </span>
    </label>
  );
}
