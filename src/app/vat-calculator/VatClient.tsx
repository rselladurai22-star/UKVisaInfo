'use client';

import { useState, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import { calcVat, type VatRate, type VatMode } from '../../lib/vat/calc';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function VatClient() {
  const [amount, setAmount] = useState<string>('100');
  const [rate, setRate] = useState<VatRate>(20);
  const [mode, setMode] = useState<VatMode>('add');

  const result = useMemo(() => calcVat(parseFloat(amount) || 0, rate, mode), [amount, rate, mode]);

  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* mode toggle */}
      <div className="inline-flex p-1 bg-[#f3f4f5] rounded-lg mb-6">
        <button
          type="button"
          onClick={() => setMode('add')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-semibold rounded-md transition-colors ${mode === 'add' ? 'bg-white text-[#0A2540] shadow-sm' : 'text-[#76777e] hover:text-[#0A2540]'}`}
        >
          <Plus className="w-3.5 h-3.5" />
          Add VAT
        </button>
        <button
          type="button"
          onClick={() => setMode('remove')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-semibold rounded-md transition-colors ${mode === 'remove' ? 'bg-white text-[#0A2540] shadow-sm' : 'text-[#76777e] hover:text-[#0A2540]'}`}
        >
          <Minus className="w-3.5 h-3.5" />
          Remove VAT
        </button>
      </div>

      {/* amount input */}
      <label className="block">
        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">
          {mode === 'add' ? 'Net amount (excluding VAT)' : 'Gross amount (including VAT)'}
        </span>
        <div className="mt-2 flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-4 py-3 focus-within:border-[#0A2540] transition-colors">
          <span className="text-[#76777e] text-[18px] font-semibold">£</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-[20px] md:text-[22px] font-bold text-[#0A2540] tabular-nums outline-none"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
          />
        </div>
      </label>

      {/* rate selector */}
      <div className="mt-6">
        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">VAT rate</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {([
            { v: 20, label: '20% standard', desc: 'most goods & services' },
            { v: 5,  label: '5% reduced',   desc: 'fuel, mobility aids' },
            { v: 0,  label: '0% zero',      desc: 'food, books, children\'s clothes' },
          ] as const).map((r) => (
            <button
              key={r.v}
              type="button"
              onClick={() => setRate(r.v as VatRate)}
              className={`text-left px-3.5 py-3 rounded-xl border transition-colors ${rate === r.v ? 'border-[#0A2540] bg-[#0A2540]/[0.04]' : 'border-[#E5E7EB] hover:border-[#0A2540]/40'}`}
            >
              <div className="text-[13px] font-bold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                {r.label}
              </div>
              <div className="text-[11px] text-[#76777e] mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* result */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <ResultBox label="Net" value={fmt(result.net)} muted />
        <ResultBox label={`VAT (${result.rate}%)`} value={fmt(result.vat)} accent="#00C4B4" />
        <ResultBox label="Gross" value={fmt(result.gross)} primary />
      </div>

      <p className="mt-5 text-[12px] text-[#76777e] leading-relaxed">
        VAT is calculated using HMRC-published rates. For business use, always verify against your VAT return — input VAT recovery, partial exemption, margin schemes and reverse-charge rules may apply.
      </p>
    </div>
  );
}

function ResultBox({ label, value, primary, muted, accent }: { label: string; value: string; primary?: boolean; muted?: boolean; accent?: string }) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: primary ? '#0A2540' : muted ? '#f6f7f8' : '#ffffff',
        borderColor: primary ? '#0A2540' : '#E5E7EB',
        color: primary ? '#ffffff' : '#0A2540',
      }}
    >
      <div
        className="text-[10.5px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: primary ? 'rgba(255,255,255,0.6)' : accent ?? '#76777e' }}
      >
        {label}
      </div>
      <div
        className="mt-1 font-bold tabular-nums text-[20px] md:text-[22px] tracking-[-0.01em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
      >
        {value}
      </div>
    </div>
  );
}
