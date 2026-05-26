'use client';

/**
 * Advanced SDLT/LBTT/LTT calculator — Deep+ pilot (May 2026).
 *
 *   – Country selector: England & NI (SDLT) / Scotland (LBTT) / Wales (LTT)
 *   – 7 buyer scenarios with descriptions
 *   – Band-by-band breakdown + surcharge breakdown
 *   – Cross-scenario comparison at the same price
 *   – Cross-country comparison at the same price + scenario
 *   – Refund eligibility sub-tool for the 3% additional surcharge
 */

import { useMemo, useState } from 'react';
import {
  Info, AlertTriangle, ArrowRightLeft, ChevronDown, CheckCircle2, XCircle,
  Calculator, Globe, Sparkles,
} from 'lucide-react';
import {
  calculateSDLT,
  calculateAllScenarios,
  calculateAllCountries,
  calculateRefund,
  BUYER_LABEL,
  BUYER_DESC,
  COUNTRY_LABEL,
  type BuyerType,
  type Country,
  type SDLTResult,
} from '../../lib/sdlt/calc';

const gbp  = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const gbp2 = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct  = (n: number) => (n * 100).toFixed(2) + '%';

const BUYERS_ENG: BuyerType[] = ['standard', 'firstTime', 'additional', 'nonResident', 'addNonRes', 'mixedUse', 'company'];

export default function SdltClient({ initialPrice = 350000 }: { initialPrice?: number }) {
  const [price, setPrice]     = useState(initialPrice);
  const [buyer, setBuyer]     = useState<BuyerType>('standard');
  const [country, setCountry] = useState<Country>('england');
  const [showCompareScenarios, setShowCompareScenarios] = useState(false);
  const [showCompareCountries, setShowCompareCountries] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const result = useMemo(() => calculateSDLT(price, buyer, country), [price, buyer, country]);
  const allScenarios = useMemo(() => calculateAllScenarios(price, country), [price, country]);
  const allCountries = useMemo(() => calculateAllCountries(price, buyer), [price, buyer]);

  return (
    <div className="space-y-6">

      {/* ═══════════════════════════════════════════
          1. COUNTRY SELECTOR
      ═══════════════════════════════════════════ */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-[#76777e]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.10em] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Country / tax regime
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['england', 'scotland', 'wales'] as Country[]).map((c) => {
            const active = country === c;
            const taxName = c === 'england' ? 'SDLT' : c === 'scotland' ? 'LBTT' : 'LTT';
            return (
              <button key={c} type="button" onClick={() => setCountry(c)}
                      className={`px-3 py-3 rounded-lg text-left border-2 transition-all ${active ? 'border-[#101a36] bg-[#101a36] text-white' : 'border-[#E5E7EB] bg-white text-[#101a36] hover:border-[#101a36]/40'}`}
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-70">{taxName}</div>
                <div className="text-[13px] font-semibold leading-tight mt-1">{COUNTRY_LABEL[c]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          2. MAIN CALCULATOR — INPUTS + RESULTS
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* INPUTS */}
        <aside className="lg:col-span-5 space-y-4">

          {/* Price */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-[0.10em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Property price
              </span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#76777e] text-[20px] font-semibold">£</span>
                <input
                  type="number" inputMode="decimal"
                  value={price || ''}
                  onChange={(e) => setPrice(Math.max(0, +e.target.value || 0))}
                  min={0} step={5000}
                  className="w-full pl-9 pr-3 py-3 text-[22px] font-bold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10 tabular-nums"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <input type="range" value={price} onChange={(e) => setPrice(+e.target.value)}
                     min={50_000} max={2_000_000} step={5000}
                     className="w-full mt-3 accent-[#101a36]" />
              <div className="mt-1 flex justify-between text-[10.5px] text-[#76777e] tabular-nums">
                <span>£50k</span><span>£500k</span><span>£1m</span><span>£2m</span>
              </div>
            </label>

            {/* Quick price presets */}
            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.10em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Quick presets</p>
              <div className="flex flex-wrap gap-1.5">
                {[150_000, 250_000, 350_000, 500_000, 750_000, 1_000_000, 1_500_000].map((p) => (
                  <button key={p} type="button" onClick={() => setPrice(p)}
                          className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-md border transition-colors ${price === p ? 'border-[#101a36] bg-[#101a36] text-white' : 'border-[#E5E7EB] text-[#45464d] hover:border-[#101a36]/40'}`}
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                    {p >= 1_000_000 ? `£${p / 1_000_000}m` : `£${p / 1000}k`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buyer scenario */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.10em] text-[#76777e] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Buyer scenario
            </p>
            <div className="space-y-2">
              {BUYERS_ENG.map((b) => {
                const active = buyer === b;
                return (
                  <button key={b} type="button" onClick={() => setBuyer(b)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${active ? 'border-[#101a36] bg-[#f3f4f5]' : 'border-[#E5E7EB] hover:border-[#101a36]/40'}`}
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${active ? 'border-[#101a36]' : 'border-[#cfd2d8]'}`}>
                        {active && <div className="w-2 h-2 rounded-full bg-[#101a36]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-semibold text-[#101a36] leading-tight">{BUYER_LABEL[b]}</div>
                        <div className="text-[12px] text-[#76777e] leading-[1.45] mt-1">{BUYER_DESC[b]}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </aside>

        {/* RESULTS */}
        <main className="lg:col-span-7 space-y-4">

          {/* Headline result */}
          <ResultHeadline result={result} />

          {/* Applied rules */}
          {result.appliedRules.length > 0 && (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-[#101a36] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.10em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    How this is calculated
                  </p>
                  <ul className="text-[13px] text-[#45464d] leading-[1.6] space-y-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {result.appliedRules.map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
                <ul className="text-[12.5px] text-[#78350f] leading-[1.55] space-y-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Band breakdown */}
          {result.bands.length > 0 && (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
              <h3 className="font-bold text-[#101a36] text-[15px] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                Band-by-band breakdown
              </h3>
              <table className="w-full text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <thead>
                  <tr className="text-left text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#76777e]">
                    <th className="py-2">Band</th>
                    <th className="py-2 text-right">Taxed on</th>
                    <th className="py-2 text-right">Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#101a36] tabular-nums">
                  {result.bands.map((b, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-3">{b.label}</td>
                      <td className="py-2.5 text-right">{gbp(b.taxOn)}</td>
                      <td className="py-2.5 text-right font-semibold">{gbp2(b.tax)}</td>
                    </tr>
                  ))}
                  {result.surchargeAmount > 0 && (
                    <tr className="bg-[#fff8e6]">
                      <td className="py-2.5 pr-3 font-medium text-[#78350f]">{result.surchargeLabel}</td>
                      <td className="py-2.5 text-right text-[#78350f]">{gbp(result.price)}</td>
                      <td className="py-2.5 text-right font-semibold text-[#78350f]">{gbp2(result.surchargeAmount)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#101a36]">
                    <td className="pt-3 font-bold text-[#101a36]">Total {result.taxName}</td>
                    <td className="pt-3"></td>
                    <td className="pt-3 text-right font-bold text-[#101a36] text-[15px]">{gbp2(result.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

        </main>
      </div>

      {/* ═══════════════════════════════════════════
          3. COMPARE ACROSS SCENARIOS (same price, all buyer types)
      ═══════════════════════════════════════════ */}
      <CollapsibleCard
        open={showCompareScenarios}
        onToggle={() => setShowCompareScenarios((v) => !v)}
        title="Compare all buyer scenarios at this price"
        subtitle={`See the SDLT bill for the same ${gbp(price)} property across every scenario.`}
        icon={<ArrowRightLeft className="w-4 h-4" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr className="text-left text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#76777e]">
                <th className="py-2 pr-3">Scenario</th>
                <th className="py-2 text-right">Tax</th>
                <th className="py-2 text-right">Effective rate</th>
                <th className="py-2 text-right pl-3">vs Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#101a36] tabular-nums">
              {allScenarios.map((r) => {
                const vsStandard = r.total - allScenarios[0].total;
                return (
                  <tr key={r.buyerType} className={r.buyerType === buyer ? 'bg-[#f3f4f5]' : ''}>
                    <td className="py-2.5 pr-3 font-medium">{BUYER_LABEL[r.buyerType]}</td>
                    <td className="py-2.5 text-right font-semibold">{gbp(r.total)}</td>
                    <td className="py-2.5 text-right text-[#45464d]">{pct(r.effectiveRate)}</td>
                    <td className="py-2.5 text-right pl-3" style={{ color: vsStandard > 0 ? '#9F1239' : vsStandard < 0 ? '#047857' : '#76777e' }}>
                      {vsStandard === 0 ? '—' : `${vsStandard > 0 ? '+' : ''}${gbp(vsStandard)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CollapsibleCard>

      {/* ═══════════════════════════════════════════
          4. COMPARE ACROSS COUNTRIES (England vs Scotland vs Wales)
      ═══════════════════════════════════════════ */}
      <CollapsibleCard
        open={showCompareCountries}
        onToggle={() => setShowCompareCountries((v) => !v)}
        title="Compare England, Scotland and Wales at this price"
        subtitle={`SDLT, LBTT and LTT for a ${gbp(price)} purchase as a ${BUYER_LABEL[buyer].toLowerCase()}.`}
        icon={<Globe className="w-4 h-4" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr className="text-left text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#76777e]">
                <th className="py-2 pr-3">Country</th>
                <th className="py-2 text-right">Total tax</th>
                <th className="py-2 text-right">Effective rate</th>
                <th className="py-2 text-right pl-3">Surcharge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#101a36] tabular-nums">
              {allCountries.map((r) => (
                <tr key={r.country} className={r.country === country ? 'bg-[#f3f4f5]' : ''}>
                  <td className="py-2.5 pr-3 font-medium">
                    {COUNTRY_LABEL[r.country]} <span className="text-[10.5px] font-bold text-[#76777e] ml-1.5">({r.taxName})</span>
                  </td>
                  <td className="py-2.5 text-right font-semibold">{gbp(r.total)}</td>
                  <td className="py-2.5 text-right text-[#45464d]">{pct(r.effectiveRate)}</td>
                  <td className="py-2.5 text-right pl-3 text-[#45464d]">{r.surchargeAmount > 0 ? gbp(r.surchargeAmount) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleCard>

      {/* ═══════════════════════════════════════════
          5. REFUND SUB-TOOL (3% surcharge refund)
      ═══════════════════════════════════════════ */}
      <CollapsibleCard
        open={showRefund}
        onToggle={() => setShowRefund((v) => !v)}
        title="Claim back the 3% additional-property surcharge"
        subtitle="If you sold your previous main home within 36 months, you can claim a refund. Check eligibility →"
        icon={<Sparkles className="w-4 h-4" />}
      >
        <RefundCalculator />
      </CollapsibleCard>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Headline result panel
───────────────────────────────────────────── */
function ResultHeadline({ result }: { result: SDLTResult }) {
  return (
    <div className="bg-[#101a36] text-white rounded-xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-56 h-56 bg-[#dae2ff] rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.10em] text-[#bcc5e9] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {result.taxName} on {gbp(result.price)} purchase
        </p>
        <p className="font-bold tabular-nums tracking-[-0.02em] leading-none"
           style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}>
          {gbp(result.total)}
        </p>
        <p className="mt-3 text-[14px] text-[#bcc5e9]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Effective rate {pct(result.effectiveRate)} · {COUNTRY_LABEL[result.country]} · {BUYER_LABEL[result.buyerType]}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Refund sub-tool
───────────────────────────────────────────── */
function RefundCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(450_000);
  const [monthsSince, setMonthsSince] = useState(8);
  const [isUKResident, setIsUKResident] = useState(true);
  const [hasSoldOldHome, setHasSoldOldHome] = useState(true);

  const refund = useMemo(() =>
    calculateRefund({ purchasePrice, monthsSincePurchase: monthsSince, isUKResident, hasSoldOldHome }),
    [purchasePrice, monthsSince, isUKResident, hasSoldOldHome]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Inputs */}
      <div className="space-y-4">
        <label className="block">
          <span className="block text-[11px] font-bold uppercase tracking-[0.10em] text-[#76777e] mb-1.5">
            Purchase price of additional property
          </span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#76777e] font-semibold">£</span>
            <input type="number" inputMode="decimal" value={purchasePrice || ''}
                   onChange={(e) => setPurchasePrice(Math.max(0, +e.target.value || 0))}
                   className="w-full pl-8 pr-3 py-2.5 text-[16px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] tabular-nums" />
          </div>
        </label>

        <label className="block">
          <span className="block text-[11px] font-bold uppercase tracking-[0.10em] text-[#76777e] mb-1.5">
            Months since you paid the surcharge
          </span>
          <input type="number" min={0} max={60} value={monthsSince}
                 onChange={(e) => setMonthsSince(Math.max(0, +e.target.value || 0))}
                 className="w-full px-3 py-2.5 text-[16px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] tabular-nums" />
          <input type="range" min={0} max={60} value={monthsSince}
                 onChange={(e) => setMonthsSince(+e.target.value)}
                 className="w-full mt-2 accent-[#101a36]" />
          <div className="mt-1 flex justify-between text-[10px] text-[#76777e]">
            <span>0</span><span>36 (deadline)</span><span>60</span>
          </div>
        </label>

        <label className="flex items-start gap-2.5 p-3 rounded-lg border-2 border-[#E5E7EB] cursor-pointer hover:border-[#101a36]/40">
          <input type="checkbox" checked={hasSoldOldHome} onChange={(e) => setHasSoldOldHome(e.target.checked)} className="mt-0.5 accent-[#101a36]" />
          <span className="text-[13px] text-[#101a36]">I have sold (or will sell) my previous main residence within 36 months.</span>
        </label>

        <label className="flex items-start gap-2.5 p-3 rounded-lg border-2 border-[#E5E7EB] cursor-pointer hover:border-[#101a36]/40">
          <input type="checkbox" checked={isUKResident} onChange={(e) => setIsUKResident(e.target.checked)} className="mt-0.5 accent-[#101a36]" />
          <span className="text-[13px] text-[#101a36]">I am UK-resident at the refund claim date.</span>
        </label>
      </div>

      {/* Result */}
      <div className={`rounded-xl p-5 border-2 ${refund.eligible ? 'border-[#10b981] bg-[#ecfdf5]' : 'border-[#fb7185] bg-[#fef2f2]'}`}>
        <div className="flex items-center gap-2 mb-3">
          {refund.eligible
            ? <CheckCircle2 className="w-5 h-5 text-[#047857]" />
            : <XCircle className="w-5 h-5 text-[#9f1239]" />}
          <p className={`text-[11px] font-bold uppercase tracking-[0.10em] ${refund.eligible ? 'text-[#047857]' : 'text-[#9f1239]'}`}>
            {refund.eligible ? 'Eligible for refund' : 'Not currently eligible'}
          </p>
        </div>
        <p className="text-[28px] font-bold tabular-nums text-[#101a36] leading-none mb-2"
           style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          {gbp(refund.refundAmount)}
        </p>
        <p className="text-[12px] text-[#45464d] mb-4">
          Potential refund of the 3% additional-property surcharge.
        </p>
        <ul className="text-[12px] text-[#45464d] leading-[1.55] space-y-1.5">
          {refund.reasons.map((r, i) => <li key={i}>• {r}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Collapsible card
───────────────────────────────────────────── */
function CollapsibleCard({
  open, onToggle, title, subtitle, icon, children,
}: {
  open: boolean; onToggle: () => void;
  title: string; subtitle: string; icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
      <button type="button" onClick={onToggle}
              className="w-full flex items-center gap-3 p-5 text-left hover:bg-[#fafafa] transition-colors">
        <div className="w-9 h-9 rounded-lg bg-[#f3f4f5] flex items-center justify-center text-[#101a36] flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14.5px] font-bold text-[#101a36] leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            {title}
          </h3>
          <p className="text-[12.5px] text-[#76777e] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            {subtitle}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#76777e] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-6 pt-1 border-t border-[#E5E7EB] mt-1">
          {children}
        </div>
      )}
    </div>
  );
}
