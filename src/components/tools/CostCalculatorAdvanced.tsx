'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator, Plus, Minus, Banknote, ShieldCheck, Clock, ArrowRight,
  Users, Info, Zap, MapPin, User, Baby, Timer, RefreshCw,
  Briefcase, GraduationCap, Heart, Home, Globe,
} from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────── TYPES & DATA ────────────────────────────── */
interface VisaPreset {
  id: string; label: string; category: 'work' | 'study' | 'family' | 'settlement';
  baseFee: { out3yr: number; out5yr?: number; in3yr?: number; in5yr?: number };
  ihsAdult: number; ihsChild: number;
  priorityFee?: number; superPriorityFee?: number;
  allowsDependants: boolean; defaultYears: number; notes?: string;
}

// 8 April 2026 fees, verified against gov.uk.
const VISAS: VisaPreset[] = [
  {
    id: 'skilled-worker', label: 'Skilled Worker', category: 'work',
    baseFee: { out3yr: 819, out5yr: 1618, in3yr: 885, in5yr: 1751 },
    ihsAdult: 1035, ihsChild: 776,
    priorityFee: 500, superPriorityFee: 1000,
    allowsDependants: true, defaultYears: 3,
    notes: 'Out: £819 (≤3y) / £1,618 (>3y). ISL discount £590 if SOC listed.',
  },
  {
    id: 'health-care', label: 'Health & Care', category: 'work',
    baseFee: { out3yr: 304, out5yr: 590, in3yr: 304, in5yr: 590 },
    ihsAdult: 0, ihsChild: 776,
    priorityFee: 500,
    allowsDependants: true, defaultYears: 3,
    notes: 'Main applicant IHS-exempt. Care worker SOC 6135/6136 closed to overseas since Jul 2025.',
  },
  {
    id: 'innovator-founder', label: 'Innovator Founder', category: 'work',
    baseFee: { out3yr: 1357, in3yr: 1693 },
    ihsAdult: 1035, ihsChild: 776, priorityFee: 500,
    allowsDependants: true, defaultYears: 3,
    notes: '£1,357 out / £1,693 in. Plus endorsing body fees ~£1,000.',
  },
  {
    id: 'global-talent', label: 'Global Talent', category: 'work',
    baseFee: { out3yr: 766, out5yr: 766 },
    ihsAdult: 1035, ihsChild: 776,
    allowsDependants: true, defaultYears: 3,
    notes: '£766 total (direct prize) OR £561 endorsement + £205 visa.',
  },
  {
    id: 'student', label: 'Student', category: 'study',
    baseFee: { out3yr: 558, out5yr: 558, in3yr: 558, in5yr: 558 },
    ihsAdult: 776, ihsChild: 776, priorityFee: 500,
    allowsDependants: false, defaultYears: 3,
    notes: '£558 from 8 Apr 2026. Student IHS rate £776/yr.',
  },
  {
    id: 'graduate', label: 'Graduate', category: 'study',
    baseFee: { out3yr: 937, out5yr: 937 },
    ihsAdult: 1035, ihsChild: 776, priorityFee: 500,
    allowsDependants: false, defaultYears: 2,
    notes: '2 yrs if applied by 31 Dec 2026 · 3 yrs for PhD. Cannot extend.',
  },
  {
    id: 'family', label: 'Family / Spouse', category: 'family',
    baseFee: { out3yr: 2064, in3yr: 1407 },
    ihsAdult: 1035, ihsChild: 776, priorityFee: 573,
    allowsDependants: true, defaultYears: 2.5,
    notes: '2y 9m initial · 2y 6m extension · ILR after 5 yrs · £29,000 min income.',
  },
  {
    id: 'visitor', label: 'Standard Visitor', category: 'family',
    baseFee: { out3yr: 135, out5yr: 135 },
    ihsAdult: 0, ihsChild: 0,
    priorityFee: 500, superPriorityFee: 1000,
    allowsDependants: false, defaultYears: 0.5,
    notes: '£135 for 6 months. Long-term: £475 (2y) / £848 (5y) / £1,059 (10y).',
  },
  {
    id: 'ilr', label: 'ILR, Settlement', category: 'settlement',
    baseFee: { out3yr: 3226, in3yr: 3226 },
    ihsAdult: 0, ihsChild: 0, superPriorityFee: 1000,
    allowsDependants: true, defaultYears: 1,
    notes: '£3,226 from 8 Apr 2026. No IHS at ILR stage. Life in the UK test £50 extra.',
  },
  {
    id: 'citizenship', label: 'British Citizenship', category: 'settlement',
    baseFee: { out3yr: 1839, in3yr: 1839 },
    ihsAdult: 0, ihsChild: 0,
    allowsDependants: false, defaultYears: 1,
    notes: '£1,839 includes £130 ceremony fee. Passport £94.50 separate. Child MN1 £1,000.',
  },
  {
    id: 'bno', label: 'Hong Kong BNO', category: 'settlement',
    baseFee: { out3yr: 206, out5yr: 285, in3yr: 206, in5yr: 285 },
    ihsAdult: 1035, ihsChild: 776,
    allowsDependants: true, defaultYears: 5,
    notes: '£206 (2.5y) / £285 (5y). 5-year route gives lowest per-year cost.',
  },
  {
    id: 'ancestry', label: 'UK Ancestry', category: 'settlement',
    baseFee: { out3yr: 726, out5yr: 726 },
    ihsAdult: 1035, ihsChild: 776, priorityFee: 500,
    allowsDependants: true, defaultYears: 5,
    notes: 'Commonwealth citizens with UK-born grandparent. 5 years to ILR.',
  },
];

type Currency = 'GBP' | 'USD' | 'EUR' | 'INR' | 'NGN' | 'PKR' | 'AUD' | 'CAD';
const FX: Record<Currency, { rate: number; symbol: string; flag: string }> = {
  GBP: { rate: 1,    symbol: '£',  flag: '🇬🇧' },
  USD: { rate: 1.27, symbol: '$',  flag: '🇺🇸' },
  EUR: { rate: 1.18, symbol: '€',  flag: '🇪🇺' },
  INR: { rate: 107,  symbol: '₹',  flag: '🇮🇳' },
  NGN: { rate: 1980, symbol: '₦',  flag: '🇳🇬' },
  PKR: { rate: 355,  symbol: '₨',  flag: '🇵🇰' },
  AUD: { rate: 1.93, symbol: 'A$', flag: '🇦🇺' },
  CAD: { rate: 1.73, symbol: 'C$', flag: '🇨🇦' },
};

/* ── Quartz tokens (shared with visa pages) ── */
const C = {
  ink:'#0A0F1F', ink2:'#18181B', ink3:'#3F3F46',
  mid:'#697386', mid2:'#8792A2', faint:'#A3ACB9',
  bg:'#FFFFFF', bg2:'#FAFBFC', bg3:'#F4F6F8',
  border:'#ECECEF', hair:'#EDF0F4',
  accent:'#6366F1', accentDk:'#4F47CC', accentSoft:'#EFEEFF',
  ok:'#08855D', okSoft:'#E6F7EF',
  warn:'#BF6A02', warnSoft:'#FCEDD3',
  teal:'#0B7285', tealSoft:'#E0F2F4',
  gold:'#8B6914',
};

const CATEGORIES = [
  { id: 'work',       label: 'Work',       icon: Briefcase,     color: C.accent },
  { id: 'study',      label: 'Study',      icon: GraduationCap, color: C.teal },
  { id: 'family',     label: 'Family',     icon: Heart,         color: '#CD3D64' },
  { id: 'settlement', label: 'Settlement', icon: Home,          color: C.ok },
] as const;

/* ─────────────────────────────── CALCULATOR ──────────────────────────────── */
export default function CostCalculatorAdvanced() {
  const searchParams = useSearchParams();
  const [visaId,   setVisaId]   = useState('skilled-worker');
  const [category, setCategory] = useState<typeof CATEGORIES[number]['id']>('work');
  const [location, setLocation] = useState<'out' | 'in'>('out');
  const [years,    setYears]    = useState(3);
  const [adults,   setAdults]   = useState(1);
  const [children, setChildren] = useState(0);
  const [priority, setPriority] = useState<'standard' | 'priority' | 'super'>('standard');
  const [currency, setCurrency] = useState<Currency>('GBP');

  useEffect(() => {
    const v = searchParams.get('visa');
    if (v && VISAS.some((p) => p.id === v)) {
      setVisaId(v);
      const cat = VISAS.find((p) => p.id === v)?.category;
      if (cat) setCategory(cat);
    }
  }, [searchParams]);

  const visa = VISAS.find((v) => v.id === visaId)!;

  const result = useMemo(() => {
    const yearsCeil = Math.ceil(years);
    const baseKey = `${location}${years <= 3 ? '3yr' : '5yr'}` as keyof VisaPreset['baseFee'];
    const baseFee = (visa.baseFee[baseKey] ?? visa.baseFee.out3yr) as number;
    const totalFees    = (adults * baseFee) + (children * baseFee);
    const mainIhs      = visa.ihsAdult * yearsCeil;
    const depAdultIhs  = Math.max(0, adults - 1) * 1035 * yearsCeil;
    const childIhs     = children * visa.ihsChild * yearsCeil;
    const totalIhs     = mainIhs + depAdultIhs + childIhs;
    const priorityCost =
      priority === 'priority' ? (visa.priorityFee ?? 0) :
      priority === 'super'    ? (visa.superPriorityFee ?? 0) : 0;
    const total = totalFees + totalIhs + priorityCost;
    return { baseFee, totalFees, mainIhs, depAdultIhs, childIhs, totalIhs, priorityCost, total, yearsCeil };
  }, [visa, location, years, adults, children, priority]);

  const fx      = FX[currency];
  const convert = (gbp: number) =>
    currency === 'GBP'
      ? `£${gbp.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
      : `${fx.symbol}${(gbp * fx.rate).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

  const visasInCategory = VISAS.filter((v) => v.category === category);

  return (
    <div style={{ background: C.bg2, minHeight: '100vh', fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif', WebkitFontSmoothing: 'antialiased' }}>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 'clamp(80px,10vw,104px)', paddingBottom: 32, background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: C.accentSoft }}>
              <Calculator className="w-4 h-4" style={{ color: C.accentDk }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: C.mid2 }}>
              Tool, Visa Cost Calculator
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,3.8vw,44px)', fontWeight: 600, color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 12 }}>
            UK Visa Cost Calculator
          </h1>
          <p style={{ maxWidth: 560, color: C.mid, fontSize: 15, lineHeight: 1.65, marginBottom: 16 }}>
            Add up Home Office fees, Immigration Health Surcharge, dependants, and priority services, 
            then convert to your local currency.
          </p>
          <div className="flex flex-wrap gap-5">
            {[
              { icon: ShieldCheck, label: 'Official gov.uk fees' },
              { icon: RefreshCw,   label: 'Updated Apr 2026' },
              { icon: Globe,       label: '8 currencies supported' },
            ].map(({ icon: I, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: C.mid }}>
                <I className="w-3.5 h-3.5" style={{ color: C.accent }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main layout ── */}
      <section style={{ padding: 'clamp(24px,4vw,48px) 0' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 items-start">

            {/* ───────────── LEFT: Steps ───────────── */}
            <div className="lg:col-span-7 space-y-4">

              {/* STEP 1, Visa Type */}
              <StepCard step={1} title="Choose visa type" desc="Select the route you're applying for">
                {/* Category tabs */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                  {CATEGORIES.map((cat) => {
                    const Icon    = cat.icon;
                    const isActive = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all flex-shrink-0"
                        style={{
                          background: isActive ? cat.color : C.bg3,
                          color: isActive ? '#fff' : C.ink3,
                          border: `1px solid ${isActive ? cat.color : C.border}`,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Visa grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {visasInCategory.map((v) => {
                    const isSelected = visaId === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          setVisaId(v.id);
                          setYears(v.defaultYears);
                          if (!v.allowsDependants) { setAdults(1); setChildren(0); }
                        }}
                        className="group text-left px-4 py-3.5 rounded-xl transition-all duration-100 border-2"
                        style={{
                          background: isSelected ? '#18181B' : '#fff',
                          borderColor: isSelected ? '#18181B' : 'rgba(24, 24, 27,0.08)',
                          boxShadow: isSelected ? '0 4px 18px rgba(24, 24, 27,0.18)' : '0 1px 3px rgba(24, 24, 27,0.06)',
                        }}
                      >
                        <div className="text-[13.5px] font-bold leading-tight"
                             style={{ color: isSelected ? '#fff' : C.ink }}>
                          {v.label}
                        </div>
                        <div className="mt-1 text-[11.5px]"
                             style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : C.mid2 }}>
                          from £{v.baseFee.out3yr.toLocaleString()}
                        </div>
                        {isSelected && (
                          <div className="mt-2 text-[11px] leading-relaxed"
                               style={{ color: 'rgba(255,255,255,0.60)' }}>
                            {v.notes}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* If selected visa is in a different category, show it */}
                {!visasInCategory.some((v) => v.id === visaId) && (
                  <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl text-[12px]"
                       style={{ background: C.okSoft, color: C.ok }}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span><strong>{visa.label}</strong> is selected (from another category)</span>
                  </div>
                )}
              </StepCard>

              {/* STEP 2, Location & Duration */}
              <StepCard step={2} title="Location & duration" desc="Where you're applying from and for how long">
                {/* Location toggle */}
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#9CA3AF' }}>
                    Applying from
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { val: 'out' as const, label: 'Outside the UK',    sub: 'New application from abroad',       icon: Globe  },
                      { val: 'in'  as const, label: 'Inside the UK',     sub: 'Switching or extending in the UK',  icon: MapPin },
                    ] as const).map(({ val, label, sub, icon: Icon }) => {
                      const isActive = location === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setLocation(val)}
                          className="text-left px-4 py-4 rounded-xl border-2 transition-all duration-100"
                          style={{
                            background: isActive ? 'rgba(99, 102, 241,0.06)' : '#fff',
                            borderColor: isActive ? '#6366F1' : 'rgba(24, 24, 27,0.08)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4" style={{ color: isActive ? C.accent : C.mid2 }} />
                            <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                  style={{ borderColor: isActive ? C.accent : C.border }}>
                              {isActive && <span className="w-2 h-2 rounded-full" style={{ background: C.accent }} />}
                            </span>
                          </div>
                          <div className="text-[13.5px] font-bold" style={{ color: isActive ? '#18181B' : '#374151' }}>
                            {label}
                          </div>
                          <div className="text-[11.5px] mt-0.5" style={{ color: '#9CA3AF' }}>{sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: '#9CA3AF' }}>
                      Visa duration
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                         style={{ background: '#18181B' }}>
                      <span className="font-display font-bold text-[15px] text-white tabular-nums">{years}</span>
                      <span className="text-[11px] text-white/60">year{years !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="relative pt-2 pb-4">
                    <input
                      type="range" min={0.5} max={10} step={0.5} value={years}
                      onChange={(e) => setYears(parseFloat(e.target.value))}
                      className="w-full h-2 appearance-none rounded-full cursor-pointer outline-none"
                      style={{
                        background: `linear-gradient(to right, ${C.accent} 0%, ${C.accent} ${((years - 0.5) / 9.5) * 100}%, ${C.border} ${((years - 0.5) / 9.5) * 100}%, ${C.border} 100%)`,
                      }}
                    />
                    <div className="flex justify-between mt-2">
                      {[0.5, 2.5, 5, 7.5, 10].map((v) => (
                        <span key={v} className="text-[10.5px]" style={{ color: '#9CA3AF' }}>
                          {v}y
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StepCard>

              {/* STEP 3, Who's Applying (conditional) */}
              {visa.allowsDependants ? (
                <StepCard step={3} title="Who's applying" desc="Count everyone including you as the main applicant">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <PersonCounter
                      icon={User} label="Main applicant" sublabel="That's you"
                      value={1} min={1} max={1}
                      onChange={() => {}}
                      accent="#18181B"
                    />
                    <PersonCounter
                      icon={Users} label="Adult dependants" sublabel="Spouse, partner, family"
                      value={Math.max(0, adults - 1)} min={0} max={5}
                      onChange={(v) => setAdults(v + 1)}
                      accent="#6366F1"
                    />
                    <PersonCounter
                      icon={Baby} label="Children" sublabel="Under 18"
                      value={children} min={0} max={8}
                      onChange={setChildren}
                      accent="#C9A14A"
                    />
                  </div>
                  <p className="mt-3 text-[11.5px] flex gap-1.5 items-start" style={{ color: '#9CA3AF' }}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#C9A14A]" />
                    Each dependant pays the same application fee. IHS rates: adults £1,035/yr, children £776/yr.
                  </p>
                </StepCard>
              ) : (
                <StepCard step={3} title="Who's applying" desc="Dependants">
                  <div className="flex items-center gap-3 px-4 py-4 rounded-xl"
                       style={{ background: C.bg2, border: `1px solid ${C.border}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ background: '#F3F4F6' }}>
                      <Users className="w-5 h-5" style={{ color: '#9CA3AF' }} />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold" style={{ color: '#374151' }}>
                        Main applicant only
                      </div>
                      <div className="text-[12px]" style={{ color: '#9CA3AF' }}>
                        {visa.label} does not allow dependants on this route
                      </div>
                    </div>
                  </div>
                </StepCard>
              )}

              {/* STEP 4, Processing speed */}
              <StepCard step={4} title="Processing speed" desc="How quickly do you need a decision?">
                <div className="grid grid-cols-3 gap-3">
                  {([
                    {
                      id: 'standard' as const,
                      icon: Timer, label: 'Standard',
                      time: '3 weeks', cost: 'Included',
                      desc: 'Standard postal processing',
                      disabled: false,
                    },
                    {
                      id: 'priority' as const,
                      icon: Zap, label: 'Priority',
                      time: '5 working days', cost: visa.priorityFee ? `+£${visa.priorityFee}` : 'N/A',
                      desc: 'Faster decision via priority service',
                      disabled: !visa.priorityFee,
                    },
                    {
                      id: 'super' as const,
                      icon: Zap, label: 'Super priority',
                      time: 'Next working day', cost: visa.superPriorityFee ? `+£${visa.superPriorityFee}` : 'N/A',
                      desc: 'Fastest, decision within 24 hrs',
                      disabled: !visa.superPriorityFee,
                    },
                  ] as const).map(({ id, icon: Icon, label, time, cost, desc, disabled }) => {
                    const isActive = priority === id;
                    return (
                      <button
                        key={id}
                        onClick={() => !disabled && setPriority(id)}
                        disabled={disabled}
                        className="relative text-left p-4 rounded-xl border-2 transition-all duration-100"
                        style={{
                          opacity: disabled ? 0.45 : 1,
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          background: isActive ? '#18181B' : '#fff',
                          borderColor: isActive ? '#18181B' : 'rgba(24, 24, 27,0.08)',
                          boxShadow: isActive ? '0 4px 18px rgba(24, 24, 27,0.18)' : '0 1px 3px rgba(24, 24, 27,0.05)',
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                             style={{
                               background: isActive ? C.accentSoft : C.bg3,
                             }}>
                          <Icon className="w-4 h-4"
                                style={{ color: isActive ? C.accent : C.mid }} />
                        </div>
                        <div className="text-[13px] font-bold leading-tight"
                             style={{ color: isActive ? '#fff' : '#18181B' }}>
                          {label}
                        </div>
                        <div className="flex items-center gap-1 mt-1.5 text-[11px]"
                             style={{ color: isActive ? 'rgba(255,255,255,0.55)' : '#9CA3AF' }}>
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {time}
                        </div>
                        <div className="mt-2.5 text-[12.5px] font-bold tabular-nums"
                             style={{ color: isActive ? '#C9A14A' : '#18181B' }}>
                          {cost}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </StepCard>

              {/* STEP 5, Currency */}
              <StepCard step={5} title="Display currency" desc="Convert to your local currency (indicative rates)">
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {(Object.keys(FX) as Currency[]).map((c) => {
                    const isActive = currency === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all duration-100"
                        style={{
                          background: isActive ? '#18181B' : '#fff',
                          borderColor: isActive ? '#18181B' : 'rgba(24, 24, 27,0.08)',
                        }}
                      >
                        <span className="text-[16px] leading-none">{FX[c].flag}</span>
                        <span className="text-[11.5px] font-bold"
                              style={{ color: isActive ? '#fff' : '#374151' }}>
                          {c}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[11.5px]" style={{ color: '#9CA3AF' }}>
                  Indicative rates as of May 2026. Final payment is always in GBP.
                </p>
              </StepCard>
            </div>

            {/* ───────────── RIGHT: Result panel ───────────── */}
            <div className="lg:col-span-5 lg:sticky lg:top-[84px]">
              <motion.div
                key={result.total + currency}
                initial={{ opacity: 0.7, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl overflow-hidden text-white"
                style={{
                  background: 'linear-gradient(155deg, #06192E 0%, #18181B 50%, #4F46E5 100%)',
                  boxShadow: '0 20px 60px -8px rgba(24, 24, 27,0.35)',
                }}
              >
                {/* Total */}
                <div className="px-6 pt-7 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2"
                       style={{ color: '#C9A14A' }}>
                    Total estimated cost
                  </div>
                  <div style={{ fontSize: 'clamp(44px,5.5vw,56px)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: '#fff', letterSpacing: '-0.03em' }}>
                    {convert(result.total)}
                  </div>
                  {currency !== 'GBP' && (
                    <div className="mt-1.5 text-[13px] tabular-nums" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      = £{result.total.toLocaleString('en-GB')} GBP
                    </div>
                  )}
                  {/* Summary pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <SummaryPill label={visa.label} />
                    <SummaryPill label={location === 'out' ? 'Outside UK' : 'Inside UK'} />
                    <SummaryPill label={`${years}y`} />
                    <SummaryPill label={`${adults + children} person${adults + children !== 1 ? 's' : ''}`} />
                  </div>
                </div>

                {/* Breakdown rows */}
                <div className="px-6 py-5 space-y-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <ResultRow
                    icon={Banknote}
                    label="Home Office fees"
                    hint={`${adults + children} applicant${adults + children !== 1 ? 's' : ''} × £${result.baseFee.toLocaleString()}`}
                    value={convert(result.totalFees)}
                  />
                  <ResultRow
                    icon={ShieldCheck}
                    label="Immigration Health Surcharge"
                    hint={`${result.yearsCeil} year${result.yearsCeil !== 1 ? 's' : ''}`}
                    value={convert(result.totalIhs)}
                    zeroText="Exempt"
                    isZero={result.totalIhs === 0}
                  />
                  {result.priorityCost > 0 && (
                    <ResultRow
                      icon={Clock}
                      label="Priority service"
                      value={convert(result.priorityCost)}
                    />
                  )}
                </div>

                {/* Per-person breakdown */}
                <AnimatePresence>
                  {(adults > 1 || children > 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="px-6 py-4">
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] mb-3"
                           style={{ color: 'rgba(255,255,255,0.35)' }}>
                          Per person
                        </p>
                        <div className="space-y-2">
                          <MiniRow label="You (main)" value={convert(result.baseFee + visa.ihsAdult * result.yearsCeil)} />
                          {adults > 1 && (
                            <MiniRow
                              label={`+${adults - 1} adult dependant${adults > 2 ? 's' : ''}`}
                              value={convert((adults - 1) * (result.baseFee + 1035 * result.yearsCeil))}
                            />
                          )}
                          {children > 0 && (
                            <MiniRow
                              label={`+${children} child${children > 1 ? 'ren' : ''}`}
                              value={convert(children * (result.baseFee + visa.ihsChild * result.yearsCeil))}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer note */}
                <div className="px-6 py-5">
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Estimate only. Excludes biometrics, translations, TB test, and sponsor fees.
                    Always verify on{' '}
                    <a
                      href="https://www.gov.uk/government/publications/visa-regulations-revised-table"
                      target="_blank" rel="noopener noreferrer"
                      className="underline hover:text-white/60"
                    >gov.uk</a>.
                  </p>
                </div>
              </motion.div>

              {/* Currency card */}
              <div className="mt-4 rounded-2xl p-4 flex gap-3"
                   style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
                <div>
                  <p className="text-[12.5px] font-semibold" style={{ color: '#18181B' }}>
                    Sending money to the UK?
                  </p>
                  <a
                    href="https://wise.com/invite/u/?utm_source=ukvisainfo"
                    target="_blank" rel="sponsored nofollow noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold hover:underline"
                    style={{ color: '#C9A14A' }}
                  >
                    Wise, real exchange rate, no markup
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/blog/uk-skilled-worker-visa-salary-threshold-2026"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-[12.5px] font-semibold text-white transition-all"
                  style={{ background: C.ink, boxShadow: '0 2px 8px rgba(10,15,31,0.14)' }}
                >
                  Full cost guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/visa-types/compare"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-[12.5px] font-semibold transition-all"
                  style={{
                    background: '#fff',
                    color: '#18181B',
                    border: '1px solid rgba(24, 24, 27,0.12)',
                  }}
                >
                  Compare routes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info section */}
      <section style={{ padding: 'clamp(40px,5vw,64px) 0', background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 style={{ fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-0.02em', marginBottom: 24 }}>
            What these costs include
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Banknote, color: '#6366F1',
                title: 'Home Office application fee',
                desc: 'Paid per applicant. Varies by visa type, duration, and whether inside or outside UK.',
              },
              {
                icon: ShieldCheck, color: '#18181B',
                title: 'Immigration Health Surcharge (IHS)',
                desc: 'Paid upfront for the full visa duration. Adults £1,035/yr, students £776/yr. Health & Care main applicants exempt.',
              },
              {
                icon: Zap, color: '#C9A14A',
                title: 'Priority service (optional)',
                desc: 'Available for most routes. Priority (5 working days) or Super Priority (next working day).',
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl" style={{ background: C.bg2, border: `1px solid ${C.border}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                     style={{ background: `${color}12` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: color }} />
                </div>
                <h3 className="text-[13.5px] font-bold mb-2" style={{ color: C.ink }}>{title}</h3>
                <p className="text-[12.5px] leading-relaxed" style={{ color: C.mid }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 px-4 py-4 rounded-xl text-[12.5px] leading-relaxed" style={{ background: C.bg2, color: C.mid, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <strong className="font-semibold" style={{ color: C.ink }}>Not included in this estimate: </strong>
            biometrics (£0 to £150), translations, English language test, TB test, ATAS clearance, criminal record certificates,
            travel costs. Sponsor fees (CoS, Skills Charge) are paid by your employer.
          </div>
        </div>
      </section>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: #0A0F1F; cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(10,15,31,0.2);
        }
        input[type='range']::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: #0A0F1F; cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(10,15,31,0.2);
        }
      `}</style>
    </div>
  );
}

/* ─────────────── Sub-components ─────────────── */

function StepCard({
  step, title, desc, children,
}: {
  step: number; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden"
         style={{ border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(10,15,31,0.04)' }}>
      {/* Step header */}
      <div className="flex items-center gap-3 px-5 py-4"
           style={{ borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
             style={{ background: '#18181B' }}>
          <span className="text-[11px] font-bold text-white tabular-nums">{String(step).padStart(2, '0')}</span>
        </div>
        <div>
          <div className="text-[14px] font-bold" style={{ color: C.ink }}>{title}</div>
          <div className="text-[11.5px]" style={{ color: C.mid }}>{desc}</div>
        </div>
      </div>
      {/* Step body */}
      <div className="p-5">{children}</div>
    </div>
  );
}

function PersonCounter({
  icon: Icon, label, sublabel, value, min, max, onChange, accent,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; sublabel: string;
  value: number; min: number; max: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  const canDec = value > min;
  const canInc = value < max;
  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl text-center"
         style={{ background: C.bg2, border: `1px solid ${C.border}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
           style={{ background: `${accent}12` }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div>
        <div className="text-[12.5px] font-semibold" style={{ color: C.ink }}>{label}</div>
        <div className="text-[11px]" style={{ color: C.mid2 }}>{sublabel}</div>
      </div>
      {/* Counter */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={!canDec}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: canDec ? '#18181B' : 'rgba(24, 24, 27,0.06)',
            color: canDec ? '#fff' : '#D1D5DB',
          }}
          aria-label="Decrease"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="font-display font-bold text-[22px] tabular-nums w-6 text-center"
              style={{ color: '#18181B' }}>
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={!canInc}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: canInc ? '#18181B' : 'rgba(24, 24, 27,0.06)',
            color: canInc ? '#fff' : '#D1D5DB',
          }}
          aria-label="Increase"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function SummaryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.60)' }}>
      {label}
    </span>
  );
}

function ResultRow({
  icon: Icon, label, hint, value, isZero, zeroText,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; hint?: string; value: string;
  isZero?: boolean; zeroText?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
          <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.80)' }}>{label}</div>
          {hint && (
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{hint}</div>
          )}
        </div>
      </div>
      <span className="font-bold tabular-nums text-[14px] flex-shrink-0"
            style={{ color: isZero ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.90)' }}>
        {isZero ? zeroText : value}
      </span>
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span className="tabular-nums font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>{value}</span>
    </div>
  );
}
