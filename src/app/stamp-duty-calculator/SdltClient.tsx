'use client';

import { useMemo, useState } from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { calculateSDLT, BUYER_LABEL, type BuyerType, type SDLTResult } from '../../lib/sdlt/calc';

const gbp = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const gbp2 = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SdltClient({ initialPrice = 350000 }: { initialPrice?: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [buyer, setBuyer] = useState<BuyerType>('standard');

  const result: SDLTResult = useMemo(() => calculateSDLT(price, buyer), [price, buyer]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* INPUTS */}
      <aside className="lg:col-span-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your purchase
          </p>

          {/* Price */}
          <label className="block mb-5">
            <span className="block text-[13px] font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Property price
            </span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#76777e] text-[18px] font-semibold">£</span>
              <input
                type="number"
                inputMode="decimal"
                value={price || ''}
                onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                min={0} step={5000}
                className="w-full pl-8 pr-3 py-3 text-[20px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10 tabular-nums"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <input
              type="range"
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
              min={50000} max={2000000} step={5000}
              className="w-full mt-3 accent-[#101a36]"
            />
            <div className="mt-1 flex justify-between text-[10.5px] text-[#76777e] tabular-nums">
              <span>£50k</span><span>£2m</span>
            </div>
          </label>

          {/* Buyer type */}
          <fieldset className="mb-1">
            <legend className="text-[13px] font-semibold text-[#101a36] mb-2.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Buyer type
            </legend>
            <div className="space-y-2">
              {(Object.keys(BUYER_LABEL) as BuyerType[]).map((b) => (
                <label key={b} className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${buyer === b ? 'border-[#101a36] bg-[#f3f4f5]' : 'border-[#E5E7EB] hover:border-[#101a36]/40'}`}>
                  <input
                    type="radio"
                    name="buyer"
                    checked={buyer === b}
                    onChange={() => setBuyer(b)}
                    className="mt-1 accent-[#101a36]"
                  />
                  <span className="text-[13.5px] text-[#101a36]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {BUYER_LABEL[b]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-4 bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-[#78350f] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>England &amp; Northern Ireland only.</strong> Scotland uses LBTT and Wales uses LTT — both have different bands. Effective from 1 April 2025.
          </p>
        </div>
      </aside>

      {/* RESULTS */}
      <main className="lg:col-span-7 space-y-5">
        <div className="bg-[#101a36] text-white rounded-xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-56 h-56 bg-[#dae2ff] rounded-full opacity-10 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bcc5e9] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Stamp Duty Land Tax
            </p>
            <p
              className="font-bold tabular-nums tracking-[-0.02em] leading-none"
              style={{
                fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              }}
            >
              {gbp(result.total)}
            </p>
            <p className="mt-3 text-[14px] text-[#bcc5e9]" style={{ fontFamily: 'Inter, sans-serif' }}>
              On a {gbp(result.price)} purchase · effective rate {(result.effectiveRate * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {result.appliedRules.length > 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-3 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
            <Info className="w-4 h-4 text-[#101a36] flex-shrink-0 mt-0.5" />
            <ul className="text-[13px] text-[#45464d] leading-[1.6] space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {result.appliedRules.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* Band breakdown */}
        {result.bands.length > 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
            <h3 className="font-bold text-[#101a36] text-[16px] mb-4" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              Band-by-band breakdown
            </h3>
            <table className="w-full text-[13.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">
                  <th className="py-2">Band</th>
                  <th className="py-2 text-right">Taxed on</th>
                  <th className="py-2 text-right">SDLT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#101a36] tabular-nums">
                {result.bands.map((b, i) => (
                  <tr key={i}>
                    <td className="py-2.5">{b.label}</td>
                    <td className="py-2.5 text-right">{gbp(b.taxOn)}</td>
                    <td className="py-2.5 text-right font-semibold">{gbp2(b.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
