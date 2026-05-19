'use client';

import { useMemo, useState } from 'react';
import { Info, TrendingUp, Banknote } from 'lucide-react';
import { calculateMortgage, type MortgageResult } from '../../lib/mortgage/calc';

const gbp = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function MortgageClient() {
  const [income, setIncome] = useState(50000);
  const [outgoings, setOutgoings] = useState(200);
  const [deposit, setDeposit] = useState(30000);
  const [rate, setRate] = useState(4.8);
  const [term, setTerm] = useState(25);

  const result: MortgageResult = useMemo(
    () => calculateMortgage({ annualIncome: income, monthlyOutgoings: outgoings, deposit, rate, termYears: term }),
    [income, outgoings, deposit, rate, term]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* INPUTS */}
      <aside className="lg:col-span-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your situation
          </p>

          <NumberRow label="Annual gross income (combined if joint)" value={income} onChange={setIncome} step={1000} min={0} max={500000} sliderMin={10000} sliderMax={300000} prefix="£" />
          <NumberRow label="Monthly outgoings (credit, loans)" value={outgoings} onChange={setOutgoings} step={50} min={0} max={5000} sliderMin={0} sliderMax={2000} prefix="£" />
          <NumberRow label="Deposit" value={deposit} onChange={setDeposit} step={1000} min={0} max={2000000} sliderMin={0} sliderMax={500000} prefix="£" />
          <SliderRow label="Interest rate" value={rate} onChange={setRate} step={0.1} min={0.5} max={10} unit="%" />
          <SliderRow label="Term" value={term} onChange={setTerm} step={1} min={5} max={40} unit="years" integer />
        </div>
      </aside>

      {/* RESULTS */}
      <main className="lg:col-span-7 space-y-5">
        <div className="bg-[#101a36] text-white rounded-xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-56 h-56 bg-[#dae2ff] rounded-full opacity-10 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bcc5e9] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Max property price
            </p>
            <p
              className="font-bold tabular-nums tracking-[-0.02em] leading-none"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}
            >
              {gbp(result.maxPropertyPrice)}
            </p>
            <p className="mt-3 text-[14px] text-[#bcc5e9]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {gbp(result.affordableBorrow)} mortgage + {gbp(result.deposit)} deposit ({(result.depositPct * 100).toFixed(1)}% LTV)
            </p>
          </div>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard icon={Banknote} label="Monthly repayment" value={gbp(result.monthlyRepayment)} sub={`At ${result.rate}% over ${result.termYears} years`} />
          <InfoCard icon={TrendingUp} label="Stress-tested @ +3%" value={gbp(result.monthlyRepaymentStressed)} sub={`If rate rose to ${result.stressRate.toFixed(1)}%`} />
        </div>

        {/* Breakdown card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
          <h3 className="font-bold text-[#101a36] text-[16px] mb-4" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            How we got there
          </h3>
          <dl className="divide-y divide-[#E5E7EB] text-[13.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Row label={`Base max borrow (4.5× £${income.toLocaleString('en-GB')})`} value={gbp(result.baseMaxBorrow)} />
            <Row label={`Less outgoings adjustment (60× £${outgoings})`} value={`–${gbp(result.outgoingsAdjustment)}`} muted />
            <Row label="Affordable mortgage" value={gbp(result.affordableBorrow)} bold />
            <Row label="Total repayable (interest + principal)" value={gbp(result.totalRepayable)} />
            <Row label="Total interest paid" value={gbp(result.totalInterest)} muted />
          </dl>
        </div>

        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-[#78350f] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <strong>Estimate only.</strong> Lenders apply their own credit checks, income types and stress tests. Multiples vary 4.0–5.5× depending on income, credit and product. Always seek a Decision in Principle from a broker before making an offer.
          </p>
        </div>
      </main>
    </div>
  );
}

/* helpers */
function NumberRow({ label, value, onChange, step, min, max, sliderMin, sliderMax, prefix }: {
  label: string; value: number; onChange: (v: number) => void;
  step?: number; min?: number; max?: number;
  sliderMin: number; sliderMax: number; prefix?: string;
}) {
  return (
    <label className="block mb-5">
      <span className="block text-[13px] font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#76777e] text-[16px] font-semibold">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={value || ''}
          onChange={(e) => onChange(Math.max(0, +e.target.value || 0))}
          step={step} min={min} max={max}
          className={`w-full ${prefix ? 'pl-8' : 'pl-3'} pr-3 py-2.5 text-[16px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10 tabular-nums`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        min={sliderMin} max={sliderMax} step={step ?? 1}
        className="w-full mt-3 accent-[#101a36]"
      />
    </label>
  );
}

function SliderRow({ label, value, onChange, step, min, max, unit, integer }: {
  label: string; value: number; onChange: (v: number) => void;
  step: number; min: number; max: number; unit: string; integer?: boolean;
}) {
  return (
    <label className="block mb-5">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[13px] font-semibold text-[#101a36]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
        <span className="text-[13px] font-semibold text-[#101a36] tabular-nums" style={{ fontFamily: 'Inter, sans-serif' }}>
          {integer ? value : value.toFixed(1)} {unit}
        </span>
      </div>
      <input
        type="range" value={value}
        onChange={(e) => onChange(+e.target.value)}
        min={min} max={max} step={step}
        className="w-full accent-[#101a36]"
      />
    </label>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className={`${muted ? 'text-[#76777e]' : 'text-[#45464d]'} ${bold ? 'font-semibold !text-[#101a36]' : ''}`}>{label}</dt>
      <dd className={`tabular-nums ${bold ? 'font-semibold text-[#101a36]' : 'text-[#101a36]'}`}>{value}</dd>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub: string;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.04)]">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="inline-flex w-8 h-8 rounded-full bg-[#dae2ff] text-[#101a36] items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
      </div>
      <p
        className="font-bold text-[#101a36] tabular-nums tracking-[-0.01em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 1.875rem)' }}
      >
        {value}
      </p>
      <p className="text-[12.5px] text-[#45464d] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{sub}</p>
    </div>
  );
}
