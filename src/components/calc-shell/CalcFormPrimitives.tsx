'use client';
/* Shared form primitives for calculator client components. */

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="block mt-1 text-[11.5px] text-[#76777e]">{hint}</span>}
    </label>
  );
}

export function NumberField({
  label, value, onChange, prefix, suffix, step = 'any', hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-3 py-2.5 focus-within:border-[#0A2540]">
        {prefix && <span className="text-[#76777e] text-[15px] font-semibold">{prefix}</span>}
        <input
          type="number" inputMode="decimal" step={step} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[16px] font-bold text-[#0A2540] tabular-nums outline-none"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        />
        {suffix && <span className="text-[#76777e] text-[13px]">{suffix}</span>}
      </div>
    </Field>
  );
}

export function SelectField<T extends string>({
  label, value, onChange, options, hint,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14.5px] font-semibold text-[#0A2540] bg-white outline-none focus:border-[#0A2540]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

export function ToggleRow<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex p-1 bg-[#f3f4f5] rounded-lg">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-semibold rounded-md transition-colors ${value === o.value ? 'bg-white text-[#0A2540] shadow-sm' : 'text-[#76777e] hover:text-[#0A2540]'}`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ResultBox({
  label, value, primary, muted, accent, sub,
}: {
  label: string;
  value: string;
  primary?: boolean;
  muted?: boolean;
  accent?: string;
  sub?: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: primary ? '#0A2540' : muted ? '#f6f7f8' : '#ffffff',
        borderColor: primary ? '#0A2540' : '#E5E7EB',
        color: primary ? '#ffffff' : '#0A2540',
      }}
    >
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: primary ? 'rgba(255,255,255,0.6)' : accent ?? '#76777e' }}>
        {label}
      </div>
      <div className="mt-1 font-bold tabular-nums text-[18px] md:text-[22px] tracking-[-0.01em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-[11.5px]"
          style={{ color: primary ? 'rgba(255,255,255,0.55)' : '#76777e' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export const fmtGBP = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);

export const fmtGBP2 = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;

export function CalcCard({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div
      className={`${wide ? 'max-w-5xl' : 'max-w-4xl'} mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {children}
    </div>
  );
}

/* ─────────────── Advanced primitives ─────────────── */

export function Section({ title, eyebrow, children, accent = '#00C4B4', tone = 'default' }: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  accent?: string;
  tone?: 'default' | 'inputs' | 'results';
}) {
  const bg = tone === 'inputs' ? '#FAFBFC' : tone === 'results' ? '#F4F9F8' : 'transparent';
  const border = tone === 'inputs' ? '#EEF0F2' : tone === 'results' ? '#D7EBE7' : 'transparent';
  return (
    <section
      className="rounded-xl"
      style={{ background: bg, border: tone === 'default' ? 'none' : `1px solid ${border}`, padding: tone === 'default' ? 0 : '20px 20px 22px' }}
    >
      <header className="mb-3 flex items-baseline gap-2 flex-wrap">
        {eyebrow && (
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.18em]" style={{ color: accent }}>
            {eyebrow}
          </span>
        )}
        <h3 className="text-[15.5px] font-bold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', letterSpacing: '-0.01em' }}>
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}

export function StatGrid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const c = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';
  return <div className={`grid grid-cols-1 ${c} gap-3`}>{children}</div>;
}

export function StatCard({ label, value, sub, tone = 'default', accent }: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'primary' | 'positive' | 'negative' | 'muted';
  accent?: string;
}) {
  const styles = {
    default:  { bg: '#FFFFFF', border: '#E5E7EB', text: '#0A2540', labelClr: '#76777e', subClr: '#76777e' },
    primary:  { bg: '#0A2540', border: '#0A2540', text: '#FFFFFF', labelClr: 'rgba(255,255,255,0.6)', subClr: 'rgba(255,255,255,0.55)' },
    positive: { bg: '#ECFDF5', border: '#A7F3D0', text: '#064E3B', labelClr: '#047857', subClr: '#047857' },
    negative: { bg: '#FEF2F2', border: '#FECACA', text: '#7F1D1D', labelClr: '#B91C1C', subClr: '#B91C1C' },
    muted:    { bg: '#F6F7F8', border: '#E5E7EB', text: '#0A2540', labelClr: '#76777e', subClr: '#76777e' },
  }[tone];
  return (
    <div className="rounded-xl p-4 border" style={{ background: styles.bg, borderColor: styles.border }}>
      <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em]" style={{ color: accent ?? styles.labelClr }}>
        {label}
      </div>
      <div className="mt-1.5 font-extrabold tabular-nums text-[20px] md:text-[24px] tracking-[-0.02em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', color: styles.text }}>
        {value}
      </div>
      {sub && <div className="mt-1 text-[11.5px] leading-[1.45]" style={{ color: styles.subClr }}>{sub}</div>}
    </div>
  );
}

export function Tip({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'warn' | 'success' }) {
  const styles = {
    info:    { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E3A8A', icon: 'ⓘ' },
    warn:    { bg: '#FFFBEB', border: '#FDE68A', text: '#78350F', icon: '⚠' },
    success: { bg: '#ECFDF5', border: '#A7F3D0', text: '#064E3B', icon: '✓' },
  }[tone];
  return (
    <div className="rounded-lg px-3.5 py-2.5 border text-[12.5px] leading-[1.55] flex gap-2.5"
      style={{ background: styles.bg, borderColor: styles.border, color: styles.text }}>
      <span aria-hidden className="font-bold mt-[1px]">{styles.icon}</span>
      <div>{children}</div>
    </div>
  );
}

export function BreakdownTable({ rows, highlightLast }: {
  rows: { label: string; value: string; sub?: string; bold?: boolean; negative?: boolean; positive?: boolean }[];
  highlightLast?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
      {rows.map((r, i) => {
        const isLast = i === rows.length - 1;
        const hi = highlightLast && isLast;
        return (
          <div key={i}
            className={`flex items-center justify-between px-4 py-2.5 ${i > 0 ? 'border-t border-[#EEF0F2]' : ''}`}
            style={{ background: hi ? '#0A2540' : '#FFFFFF', color: hi ? '#FFFFFF' : '#0A2540' }}>
            <div>
              <div className={`text-[13px] ${r.bold || hi ? 'font-bold' : 'font-medium'}`}
                style={{ color: hi ? '#FFFFFF' : (r.bold ? '#0A2540' : '#45464d') }}>
                {r.label}
              </div>
              {r.sub && (
                <div className="text-[11px] mt-0.5" style={{ color: hi ? 'rgba(255,255,255,0.6)' : '#76777e' }}>{r.sub}</div>
              )}
            </div>
            <div className={`tabular-nums text-[14px] ${r.bold || hi ? 'font-extrabold' : 'font-semibold'}`}
              style={{
                color: hi ? '#00C4B4' :
                  r.negative ? '#B91C1C' :
                  r.positive ? '#047857' :
                  (r.bold ? '#0A2540' : '#45464d'),
                fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              }}>
              {r.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ScenarioTabs<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="text-left rounded-xl border-2 px-3.5 py-2.5 transition-colors"
            style={{
              borderColor: active ? '#0A2540' : '#E5E7EB',
              background: active ? '#0A2540' : '#FFFFFF',
              color: active ? '#FFFFFF' : '#0A2540',
            }}
          >
            <div className="text-[13.5px] font-bold" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{o.label}</div>
            {o.sub && (
              <div className="text-[11px] mt-0.5" style={{ color: active ? 'rgba(255,255,255,0.6)' : '#76777e' }}>{o.sub}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function SummaryHero({ label, value, sub, tone = 'navy', badge }: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'navy' | 'teal' | 'red';
  badge?: string;
}) {
  const bg = tone === 'navy' ? '#0A2540' : tone === 'teal' ? '#0F766E' : '#7F1D1D';
  return (
    <div className="rounded-2xl p-5 md:p-6" style={{ background: bg, color: '#FFFFFF' }}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10.5px] font-extrabold uppercase tracking-[0.18em]" style={{ color: '#00C4B4' }}>{label}</span>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF' }}>{badge}</span>
        )}
      </div>
      <div className="mt-2 font-extrabold tabular-nums text-[34px] md:text-[42px] tracking-[-0.035em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
        {value}
      </div>
      {sub && <div className="mt-1.5 text-[13px] leading-[1.55]" style={{ color: 'rgba(255,255,255,0.7)' }}>{sub}</div>}
    </div>
  );
}

export function CheckboxField({ label, checked, onChange, hint }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-3 cursor-pointer hover:border-[#0A2540]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-[#0A2540]"
      />
      <span>
        <span className="block text-[13.5px] font-semibold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{label}</span>
        {hint && <span className="block text-[11.5px] text-[#76777e] mt-0.5 leading-[1.45]">{hint}</span>}
      </span>
    </label>
  );
}
