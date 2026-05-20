'use client';

import { useState, useMemo } from 'react';
import { ShieldCheck, AlertTriangle, MapPin, Zap } from 'lucide-react';
import { decodeTaxCode } from '../../lib/tax-code/decode';

const SAMPLE_CODES = ['1257L', 'K475', 'BR', 'D0', 'NT', 'S1257L W1', 'C1257L', '0T'];

export default function TaxCodeClient() {
  const [code, setCode] = useState<string>('1257L');
  const result = useMemo(() => decodeTaxCode(code), [code]);

  return (
    <div className="max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* input */}
      <label className="block bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">
        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">
          Your tax code (case-insensitive)
        </span>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. 1257L"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="mt-3 w-full bg-transparent text-[28px] md:text-[32px] font-bold text-[#0A2540] tabular-nums tracking-[0.04em] outline-none placeholder:text-[#cfd5e0]"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        />

        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="text-[11.5px] text-[#76777e] mr-1 self-center">Try:</span>
          {SAMPLE_CODES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setCode(s)}
              className="px-2.5 py-1 rounded-full bg-[#f3f4f5] hover:bg-[#e7e9ec] text-[#0A2540] text-[11.5px] font-semibold transition-colors tabular-nums"
            >
              {s}
            </button>
          ))}
        </div>
      </label>

      {/* result */}
      {result.ok ? (
        <div className="mt-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803d]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#15803d]">Valid code</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill icon={MapPin}>{result.region}</Pill>
              {result.emergency && <Pill icon={Zap} accent="#E11D48">Emergency (non-cumulative)</Pill>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e]">Effective Personal Allowance</div>
              <div
                className={`mt-1 font-bold tabular-nums text-[32px] md:text-[36px] tracking-[-0.015em] ${result.personalAllowance < 0 ? 'text-[#E11D48]' : 'text-[#0A2540]'}`}
                style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
              >
                {result.personalAllowance < 0 ? '−' : ''}£{Math.abs(result.personalAllowance).toLocaleString()}
              </div>
              <div className="text-[12px] text-[#76777e] mt-1">For the 2026/27 tax year</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e]">In plain English</div>
              <p className="mt-1 text-[14.5px] text-[#0A2540] leading-[1.55]">{result.explainer}</p>
            </div>
          </div>

          {result.warning && (
            <div className="mt-6 flex items-start gap-2.5 p-4 rounded-xl bg-[#fff7ed] border border-[#fed7aa]">
              <AlertTriangle className="w-4 h-4 text-[#c2410c] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#c2410c] mb-1">Something to check</div>
                <p className="text-[13.5px] text-[#7c2d12] leading-[1.55]">{result.warning}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-6">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#b91c1c] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#b91c1c] mb-1">Not a valid UK tax code</div>
              <p className="text-[13.5px] text-[#7f1d1d] leading-[1.55]">{result.explainer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ children, icon: Icon, accent }: { children: React.ReactNode; icon?: React.ElementType; accent?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-md"
      style={{
        background: accent ? `${accent}14` : '#f3f4f5',
        color: accent ?? '#45464d',
      }}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
