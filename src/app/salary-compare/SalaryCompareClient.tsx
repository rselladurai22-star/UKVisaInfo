'use client';

import { useState, useMemo } from 'react';
import { ArrowLeftRight, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { CITIES } from '../../data/cities';
import { findEquivalentGross } from '../../lib/salary-compare/equivalent';

const SCOT_CITIES = new Set(['edinburgh', 'glasgow']);

const gbp0 = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(0, n));

export default function SalaryCompareClient() {
  const cityList = useMemo(() => Object.values(CITIES).sort((a, b) => a.name.localeCompare(b.name)), []);
  const [aId, setAId] = useState<string>('manchester');
  const [bId, setBId] = useState<string>('london');
  const [gross, setGross] = useState<string>('60000');

  const a = cityList.find((c) => c.code === aId) ?? cityList[0];
  const b = cityList.find((c) => c.code === bId) ?? cityList[1];

  const result = useMemo(() => findEquivalentGross({
    grossA: parseFloat(gross) || 0,
    monthlyCostA: a.monthlyCost.total,
    monthlyCostB: b.monthlyCost.total,
    scotlandA: SCOT_CITIES.has(a.code),
    scotlandB: SCOT_CITIES.has(b.code),
  }), [gross, a, b]);

  const swap = () => { const t = aId; setAId(bId); setBId(t); };
  const needsMore = result.delta > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Inputs */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <CitySelect label="From city" value={aId} onChange={setAId} cities={cityList} />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap cities"
            className="hidden md:inline-flex w-10 h-10 mb-0.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#f3f4f5] items-center justify-center text-[#0A2540]"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <CitySelect label="To city" value={bId} onChange={setBId} cities={cityList} />
        </div>

        <label className="block mt-5">
          <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">
            Your gross salary in {a.name}
          </span>
          <div className="mt-2 flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-4 py-3 focus-within:border-[#0A2540] transition-colors">
            <span className="text-[#76777e] text-[18px] font-semibold">£</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1000"
              value={gross}
              onChange={(e) => setGross(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-[20px] md:text-[22px] font-bold text-[#0A2540] tabular-nums outline-none"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
            />
            <span className="text-[12px] text-[#76777e]">/ year</span>
          </div>
        </label>
      </div>

      {/* Headline */}
      <div
        className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
        style={{ background: needsMore ? 'linear-gradient(135deg, #0A2540 0%, #13325F 100%)' : 'linear-gradient(135deg, #00714d 0%, #0A2540 100%)' }}
      >
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/70">
          To match your {a.name} lifestyle in {b.name}, you{`'`}d need
        </div>
        <div
          className="mt-2 font-bold tabular-nums tracking-[-0.02em]"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: '1.0' }}
        >
          {gbp0(result.grossB)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[14.5px] text-white/85">
          {needsMore ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {needsMore ? '+' : ''}{gbp0(result.delta)} {needsMore ? 'more' : 'less'} than your current {gbp0(result.grossA)} —{' '}
          a {(result.ratio * 100 - 100).toFixed(0)}% {needsMore ? 'pay rise' : 'pay cut'} keeps purchasing power equal.
        </div>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <SideCard
          name={a.name}
          gross={result.grossA}
          net={result.netA}
          cost={a.monthlyCost.total * 12}
          disposable={result.disposableA}
        />
        <SideCard
          name={b.name}
          gross={result.grossB}
          net={result.netB}
          cost={b.monthlyCost.total * 12}
          disposable={result.disposableB}
        />
      </div>

      <p className="text-[12px] text-[#76777e] leading-relaxed">
        Take-home figures use HMRC 2026/27 bands (Scottish rates auto-applied for Edinburgh and Glasgow). Cost baseline excludes Council Tax, childcare, lifestyle spend and savings — pair with our Council Tax and Cost of Living tools for a full picture.
      </p>
    </div>
  );
}

function CitySelect({ label, value, onChange, cities }: { label: string; value: string; onChange: (v: string) => void; cities: typeof CITIES[string][] }) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[15px] font-semibold text-[#0A2540] outline-none focus:border-[#0A2540] transition-colors"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {cities.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
    </label>
  );
}

function SideCard({ name, gross, net, cost, disposable }: { name: string; gross: number; net: number; cost: number; disposable: number }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6">
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#76777e]">{name}</div>
      <div className="mt-1 font-bold tabular-nums text-[22px] md:text-[24px] text-[#0A2540] tracking-[-0.01em]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
        {gbp0(gross)}
      </div>
      <div className="mt-4 space-y-1.5 text-[12.5px] tabular-nums">
        <Row label="Take-home (net)" value={gbp0(net)} />
        <Row label="City baseline cost" value={`−${gbp0(cost)}`} />
        <div className="pt-2 mt-1 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="font-semibold text-[#0A2540]">Disposable</span>
          <span className="font-bold text-[#0A2540]">{gbp0(disposable)}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#45464d]">{label}</span>
      <span className="text-[#0A2540] font-semibold">{value}</span>
    </div>
  );
}
