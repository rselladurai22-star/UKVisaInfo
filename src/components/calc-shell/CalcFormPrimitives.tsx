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

export function CalcCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {children}
    </div>
  );
}
