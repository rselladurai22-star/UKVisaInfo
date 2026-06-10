'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeftRight, Home as HomeIcon, Bus, ShoppingBasket, Zap, MapPin } from 'lucide-react';
import { CITIES } from '../../data/cities';

const gbp = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function CityCompareClient() {
  const cityList = useMemo(() => Object.values(CITIES).sort((a, b) => a.name.localeCompare(b.name)), []);
  const [leftId, setLeftId] = useState<string>('london');
  const [rightId, setRightId] = useState<string>('manchester');

  const left = cityList.find((c) => c.code === leftId) ?? cityList[0];
  const right = cityList.find((c) => c.code === rightId) ?? cityList[1];

  const swap = () => { const t = leftId; setLeftId(rightId); setRightId(t); };

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          Compare two UK cities
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-end">
          <CitySelect label="City A" value={leftId} onChange={setLeftId} options={cityList} />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap cities"
            className="hidden md:inline-flex w-10 h-10 mb-0.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#f3f4f5] items-center justify-center text-[#101a36]"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <CitySelect label="City B" value={rightId} onChange={setRightId} options={cityList} />
        </div>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-4">
        <CityHeadlineCard
          name={left.name}
          region={left.region}
          monthly={left.monthlyCost.total}
          tagline={left.tagline}
        />
        <CityHeadlineCard
          name={right.name}
          region={right.region}
          monthly={right.monthlyCost.total}
          tagline={right.tagline}
        />
      </div>

      {/* Line-item table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
        <h3 className="font-bold text-[#101a36] text-[16px] mb-4" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          Monthly cost breakdown
        </h3>
        <table className="w-full text-[13.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">
              <th className="py-2">Item</th>
              <th className="py-2 text-right">{left.name}</th>
              <th className="py-2 text-right">{right.name}</th>
              <th className="py-2 text-right">Diff</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] tabular-nums">
            <Row label="One-bed rent" icon={HomeIcon} a={left.monthlyCost.rent1bed} b={right.monthlyCost.rent1bed} />
            <Row label="Transport"    icon={Bus} a={left.monthlyCost.transport} b={right.monthlyCost.transport} />
            <Row label="Groceries"    icon={ShoppingBasket} a={left.monthlyCost.groceries} b={right.monthlyCost.groceries} />
            <Row label="Utilities + internet" icon={Zap} a={left.monthlyCost.utilities} b={right.monthlyCost.utilities} />
            <tr className="border-t-2 border-[#E5E7EB]">
              <td className="py-3 font-bold text-[#101a36]">Total per month</td>
              <td className="py-3 text-right font-bold text-[#101a36]">{gbp(left.monthlyCost.total)}</td>
              <td className="py-3 text-right font-bold text-[#101a36]">{gbp(right.monthlyCost.total)}</td>
              <td className="py-3 text-right font-bold" style={{ color: left.monthlyCost.total > right.monthlyCost.total ? '#15803d' : '#D9152B' }}>
                {left.monthlyCost.total > right.monthlyCost.total ? '−' : '+'}{gbp(Math.abs(left.monthlyCost.total - right.monthlyCost.total))}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-[11.5px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Difference shown is City B − City A. Negative means City B is cheaper.
        </p>
      </div>

      {/* Top sectors side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectorCard name={left.name} sectors={left.topSectors.slice(0, 4)} />
        <SectorCard name={right.name} sectors={right.topSectors.slice(0, 4)} />
      </div>

    </div>
  );
}

function CitySelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { code: string; name: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-3 text-[16px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {options.map((o) => (
          <option key={o.code} value={o.code}>{o.name}</option>
        ))}
      </select>
    </label>
  );
}

function CityHeadlineCard({ name, region, monthly, tagline }: {
  name: string; region: string; monthly: number; tagline: string;
}) {
  return (
    <div className="bg-[#101a36] text-white rounded-xl p-5 md:p-6 relative overflow-hidden">
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#dae2ff] rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="relative">
        <MapPin className="w-5 h-5 text-[#bcc5e9] mb-2" />
        <p
          className="font-bold tabular-nums tracking-[-0.01em] leading-tight"
          style={{
            fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          }}
        >
          {name}
        </p>
        <p className="text-[11.5px] text-[#bcc5e9] mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
          {region}
        </p>
        <p
          className="mt-3 font-bold tabular-nums leading-none"
          style={{
            fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          }}
        >
          {gbp(monthly)}<span className="text-[12px] text-[#bcc5e9] font-medium ml-1">/mo</span>
        </p>
        <p className="mt-2 text-[12px] text-[#bcc5e9] leading-[1.45] line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {tagline}
        </p>
      </div>
    </div>
  );
}

function Row({ label, icon: Icon, a, b }: { label: string; icon: React.ComponentType<{ className?: string }>; a: number; b: number }) {
  const diff = b - a;
  return (
    <tr>
      <td className="py-2.5 text-[#45464d]">
        <span className="inline-flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#76777e]" />
          {label}
        </span>
      </td>
      <td className="py-2.5 text-right text-[#101a36] font-semibold">{gbp(a)}</td>
      <td className="py-2.5 text-right text-[#101a36] font-semibold">{gbp(b)}</td>
      <td className="py-2.5 text-right font-semibold" style={{ color: diff < 0 ? '#15803d' : diff > 0 ? '#D9152B' : '#76777e' }}>
        {diff === 0 ? '—' : `${diff > 0 ? '+' : '−'}${gbp(Math.abs(diff))}`}
      </td>
    </tr>
  );
}

function SectorCard({ name, sectors }: { name: string; sectors: { sector: string; reason: string }[] }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
        Top sectors · {name}
      </p>
      <ul className="space-y-2.5">
        {sectors.map((s) => (
          <li key={s.sector}>
            <div className="font-semibold text-[14px] text-[#101a36]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              {s.sector}
            </div>
            <div className="text-[12.5px] text-[#45464d] leading-[1.5]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {s.reason}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
