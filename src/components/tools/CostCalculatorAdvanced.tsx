'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator, Plus, Minus, Banknote, ShieldCheck, Clock, ArrowRight,
  Users, Info,
} from 'lucide-react';
import Link from 'next/link';

interface VisaPreset {
  id: string;
  label: string;
  baseFee: { out3yr: number; out5yr?: number; in3yr?: number; in5yr?: number };
  ihsAdult: number;   // £/year
  ihsChild: number;   // £/year
  priorityFee?: number;
  superPriorityFee?: number;
  allowsDependants: boolean;
  defaultYears: number;
  notes?: string;
}

const VISAS: VisaPreset[] = [
  {
    id: 'skilled-worker',
    label: 'Skilled Worker',
    baseFee: { out3yr: 827, out5yr: 1636, in3yr: 827, in5yr: 1636 },
    ihsAdult: 1035, ihsChild: 776,
    priorityFee: 500, superPriorityFee: 1000,
    allowsDependants: true, defaultYears: 3,
  },
  {
    id: 'health-care',
    label: 'Health and Care Worker',
    baseFee: { out3yr: 304, out5yr: 590, in3yr: 304, in5yr: 590 },
    ihsAdult: 0, ihsChild: 776, // main applicant exempt
    priorityFee: 500,
    allowsDependants: true, defaultYears: 3,
    notes: 'Main applicant exempt from IHS. Dependants pay normal IHS.',
  },
  {
    id: 'student',
    label: 'Student',
    baseFee: { out3yr: 524, out5yr: 524, in3yr: 524, in5yr: 524 },
    ihsAdult: 776, ihsChild: 776, // student rate
    priorityFee: 500,
    allowsDependants: false, defaultYears: 3,
  },
  {
    id: 'graduate',
    label: 'Graduate',
    baseFee: { out3yr: 880, out5yr: 880 },
    ihsAdult: 1035, ihsChild: 776,
    priorityFee: 500,
    allowsDependants: false, defaultYears: 2,
    notes: 'Cannot extend. 18 months for Bachelor/Master, 3 years for PhD.',
  },
  {
    id: 'family',
    label: 'Family / Spouse',
    baseFee: { out3yr: 1938, in3yr: 1321 },
    ihsAdult: 1035, ihsChild: 776,
    priorityFee: 573,
    allowsDependants: true, defaultYears: 2.5,
    notes: 'Standard duration 30 months; renewable.',
  },
  {
    id: 'visitor',
    label: 'Visit (Standard)',
    baseFee: { out3yr: 127, out5yr: 127 },
    ihsAdult: 0, ihsChild: 0,
    priorityFee: 500, superPriorityFee: 1000,
    allowsDependants: false, defaultYears: 0.5,
  },
  {
    id: 'innovator-founder',
    label: 'Innovator Founder',
    baseFee: { out3yr: 1191, in3yr: 1486 },
    ihsAdult: 1035, ihsChild: 776,
    priorityFee: 500,
    allowsDependants: true, defaultYears: 3,
  },
  {
    id: 'global-talent',
    label: 'Global Talent',
    baseFee: { out3yr: 722, out5yr: 722 },
    ihsAdult: 1035, ihsChild: 776,
    allowsDependants: true, defaultYears: 3,
    notes: 'Two-stage fee: £561 endorsement + £161 visa.',
  },
  {
    id: 'ilr',
    label: 'ILR (Settlement)',
    baseFee: { out3yr: 3029, in3yr: 3029 },
    ihsAdult: 0, ihsChild: 0,
    superPriorityFee: 800,
    allowsDependants: true, defaultYears: 1,
    notes: 'One-off settlement fee. No IHS at ILR stage. Life in the UK Test £50 extra.',
  },
  {
    id: 'citizenship',
    label: 'British Citizenship',
    baseFee: { out3yr: 1500, in3yr: 1500 },
    ihsAdult: 0, ihsChild: 0,
    allowsDependants: false, defaultYears: 1,
    notes: 'Includes ceremony fee component. Plus passport application £88.50 (separate).',
  },
  {
    id: 'bno',
    label: 'Hong Kong BNO',
    baseFee: { out3yr: 180, out5yr: 298, in3yr: 180, in5yr: 298 },
    ihsAdult: 1035, ihsChild: 776,
    allowsDependants: true, defaultYears: 5,
  },
  {
    id: 'ancestry',
    label: 'UK Ancestry',
    baseFee: { out3yr: 637, out5yr: 637 },
    ihsAdult: 1035, ihsChild: 776,
    priorityFee: 500,
    allowsDependants: true, defaultYears: 5,
    notes: 'For Commonwealth citizens with UK-born grandparent.',
  },
];

type Currency = 'GBP' | 'USD' | 'EUR' | 'INR' | 'NGN' | 'PKR' | 'AUD' | 'CAD';

// Indicative FX rates as of May 2026 — for display only.
const FX: Record<Currency, { rate: number; symbol: string }> = {
  GBP: { rate: 1, symbol: '£' },
  USD: { rate: 1.27, symbol: '$' },
  EUR: { rate: 1.18, symbol: '€' },
  INR: { rate: 107, symbol: '₹' },
  NGN: { rate: 1980, symbol: '₦' },
  PKR: { rate: 355, symbol: '₨' },
  AUD: { rate: 1.93, symbol: 'A$' },
  CAD: { rate: 1.73, symbol: 'C$' },
};

export default function CostCalculatorAdvanced() {
  const [visaId, setVisaId] = useState('skilled-worker');
  const [location, setLocation] = useState<'out' | 'in'>('out');
  const [years, setYears] = useState(3);
  const [adults, setAdults] = useState(1); // includes main
  const [children, setChildren] = useState(0);
  const [priority, setPriority] = useState<'standard' | 'priority' | 'super'>('standard');
  const [currency, setCurrency] = useState<Currency>('GBP');

  const visa = VISAS.find((v) => v.id === visaId)!;

  const result = useMemo(() => {
    const yearsCeil = Math.ceil(years);
    const baseKey = `${location}${years <= 3 ? '3yr' : '5yr'}` as keyof VisaPreset['baseFee'];
    const baseFee = (visa.baseFee[baseKey] ?? visa.baseFee.out3yr) as number;
    const totalAdults = adults; // main + dependant adults
    const feesPerAdult = baseFee;
    const feesPerChild = baseFee;

    const totalFees = (totalAdults * feesPerAdult) + (children * feesPerChild);
    const mainIhs = visa.ihsAdult * yearsCeil; // main applicant IHS
    const dependantAdultsIhs = Math.max(0, adults - 1) * 1035 * yearsCeil;
    const childIhs = children * visa.ihsChild * yearsCeil;
    const totalIhs = mainIhs + dependantAdultsIhs + childIhs;

    const priorityCost =
      priority === 'priority' ? (visa.priorityFee ?? 0) :
      priority === 'super' ? (visa.superPriorityFee ?? 0) :
      0;

    const total = totalFees + totalIhs + priorityCost;

    return {
      baseFee,
      totalFees,
      mainIhs,
      dependantAdultsIhs,
      childIhs,
      totalIhs,
      priorityCost,
      total,
      yearsCeil,
    };
  }, [visa, location, years, adults, children, priority]);

  const fx = FX[currency];
  const convert = (gbp: number) =>
    currency === 'GBP'
      ? `£${gbp.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
      : `${fx.symbol}${(gbp * fx.rate).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white">
      <section className="pt-[88px] md:pt-[104px] pb-10 hero-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7c3aed]">
              Tool · Cost calculator
            </span>
          </div>
          <h1 className="font-display text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold text-[#0a1530] tracking-tight leading-tight">
            UK visa cost calculator
          </h1>
          <p className="mt-3 max-w-2xl text-[#52596e] text-base md:text-lg leading-relaxed">
            Add up Home Office fees, multi-year IHS, dependants and
            priority services. With live currency conversion.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-6">
          {/* ── INPUTS ── */}
          <div className="lg:col-span-7 bg-white rounded-2xl md:rounded-3xl shadow-soft border border-[rgba(14,20,36,0.08)] overflow-hidden">
            <div className="p-5 md:p-6 space-y-5">
              {/* Visa type */}
              <div>
                <Label>Visa type</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {VISAS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setVisaId(v.id);
                        setYears(v.defaultYears);
                        if (!v.allowsDependants) { setAdults(1); setChildren(0); }
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                        visaId === v.id
                          ? 'bg-[#7c3aed] text-white shadow-soft'
                          : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#eaeef7]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                {visa.notes && (
                  <p className="mt-2 text-[11px] text-[#7a8195] flex gap-1.5 items-start">
                    <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    {visa.notes}
                  </p>
                )}
              </div>

              {/* Location + Years */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Applying</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLocation('out')}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        location === 'out'
                          ? 'bg-[#0a1530] text-white'
                          : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#eaeef7]'
                      }`}
                    >Outside UK</button>
                    <button
                      onClick={() => setLocation('in')}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        location === 'in'
                          ? 'bg-[#0a1530] text-white'
                          : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#eaeef7]'
                      }`}
                    >Inside UK (switch)</button>
                  </div>
                </div>

                <div>
                  <Label>Visa duration (years)</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Stepper value={years} setValue={setYears} step={0.5} min={0.5} max={10} />
                  </div>
                </div>
              </div>

              {/* Dependants */}
              {visa.allowsDependants && (
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[rgba(14,20,36,0.06)]">
                  <div>
                    <Label>Adult applicants (incl. you)</Label>
                    <div className="mt-2"><Stepper value={adults} setValue={setAdults} min={1} max={6} /></div>
                  </div>
                  <div>
                    <Label>Children</Label>
                    <div className="mt-2"><Stepper value={children} setValue={setChildren} min={0} max={8} /></div>
                  </div>
                </div>
              )}

              {/* Priority */}
              <div className="pt-4 border-t border-[rgba(14,20,36,0.06)]">
                <Label>Processing speed</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <Choice
                    active={priority === 'standard'}
                    onClick={() => setPriority('standard')}
                    title="Standard"
                    sub="3 weeks"
                    cost="Free"
                  />
                  <Choice
                    active={priority === 'priority'}
                    onClick={() => setPriority('priority')}
                    title="Priority"
                    sub="5 working days"
                    cost={`+£${visa.priorityFee ?? 0}`}
                    disabled={!visa.priorityFee}
                  />
                  <Choice
                    active={priority === 'super'}
                    onClick={() => setPriority('super')}
                    title="Super priority"
                    sub="Next working day"
                    cost={`+£${visa.superPriorityFee ?? 0}`}
                    disabled={!visa.superPriorityFee}
                  />
                </div>
              </div>

              {/* Currency */}
              <div className="pt-4 border-t border-[rgba(14,20,36,0.06)]">
                <Label>Display currency</Label>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {(Object.keys(FX) as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        currency === c
                          ? 'bg-[#7c3aed] text-white'
                          : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#eaeef7]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-[#7a8195]">
                  Indicative rates. Final amount in £ at time of payment.
                </p>
              </div>
            </div>
          </div>

          {/* ── RESULT ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
            <motion.div
              key={result.total}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl md:rounded-3xl overflow-hidden shadow-card hero-dark text-white"
            >
              <div className="p-6 md:p-7">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#ffbf47]">
                  Total estimated cost
                </div>
                <div className="mt-2 font-display text-4xl md:text-5xl font-bold tabular-nums leading-none">
                  {convert(result.total)}
                </div>
                {currency !== 'GBP' && (
                  <div className="mt-1 text-sm text-white/55 tabular-nums">
                    £{result.total.toLocaleString('en-GB')} GBP
                  </div>
                )}
              </div>

              <div className="bg-white/[0.05] px-6 md:px-7 py-5 border-t border-white/[0.08] space-y-3 text-sm">
                <Row label="Home Office fees" hint={`${adults + children} applicant${(adults + children) > 1 ? 's' : ''}`} value={convert(result.totalFees)} icon={Banknote} />
                <Row label="IHS" hint={`${result.yearsCeil} year${result.yearsCeil !== 1 ? 's' : ''}`} value={convert(result.totalIhs)} icon={ShieldCheck} />
                {result.priorityCost > 0 && (
                  <Row label="Priority service" value={convert(result.priorityCost)} icon={Clock} />
                )}
              </div>

              {/* Breakdown */}
              <AnimatePresence>
                {(adults > 1 || children > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/[0.03] border-t border-white/[0.08] overflow-hidden"
                  >
                    <div className="px-6 md:px-7 py-4 text-xs text-white/55 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span>You (main applicant)</span>
                        <span className="tabular-nums">{convert(result.baseFee + visa.ihsAdult * result.yearsCeil)}</span>
                      </div>
                      {adults > 1 && (
                        <div className="flex items-center justify-between">
                          <span>+{adults - 1} adult dependant{adults > 2 ? 's' : ''}</span>
                          <span className="tabular-nums">{convert((adults - 1) * (result.baseFee + 1035 * result.yearsCeil))}</span>
                        </div>
                      )}
                      {children > 0 && (
                        <div className="flex items-center justify-between">
                          <span>+{children} child{children > 1 ? 'ren' : ''}</span>
                          <span className="tabular-nums">{convert(children * (result.baseFee + visa.ihsChild * result.yearsCeil))}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="mt-4 bg-[rgba(255,191,71,0.08)] border border-[rgba(255,191,71,0.25)] rounded-2xl p-4 flex gap-3">
              <Users className="w-5 h-5 text-[#9a6800] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#0a1530]">
                  Need to send money to the UK?
                </p>
                <a
                  href="https://wise.com/invite/u/?utm_source=ukvisainfo"
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#9a6800] hover:underline"
                >
                  Use Wise — real exchange rate, no markup
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-12 md:py-16 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[#0a1530] mb-4">
            What these costs include
          </h2>
          <ul className="space-y-3 text-sm text-[#52596e] leading-relaxed">
            <li><strong className="text-[#0a1530]">Home Office application fee</strong> — paid per applicant. Varies by visa type, duration, and whether applying from inside or outside the UK.</li>
            <li><strong className="text-[#0a1530]">Immigration Health Surcharge (IHS)</strong> — paid upfront for the full visa duration. Adults £1,035/year, students and Skilled Worker dependants £776/year (children). Health & Care main applicants are exempt.</li>
            <li><strong className="text-[#0a1530]">Priority service</strong> — optional faster processing. Available for most routes.</li>
          </ul>
          <p className="mt-6 text-sm text-[#7a8195] leading-relaxed">
            Not included: biometrics fees (£0–£150), translations, English
            test, TB test, ATAS clearance, criminal record certificates,
            travel costs. Sponsor fees (CoS, Skills Charge) are paid by
            your employer.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/blog/uk-skilled-worker-visa-salary-threshold-2026"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#0a1530] text-white text-sm font-semibold rounded-xl hover:bg-[#1b2c5b] transition-colors"
            >
              Skilled Worker full cost breakdown
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools/compare"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[rgba(14,20,36,0.12)] text-[#0a1530] text-sm font-semibold rounded-xl hover:border-[#0a1530] transition-colors"
            >
              Compare visa routes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">
      {children}
    </span>
  );
}

function Stepper({
  value, setValue, min = 0, max = 99, step = 1,
}: {
  value: number; setValue: (v: number) => void;
  min?: number; max?: number; step?: number;
}) {
  return (
    <div className="inline-flex items-center bg-[#f3f5fb] rounded-xl overflow-hidden w-full">
      <button
        onClick={() => setValue(Math.max(min, value - step))}
        className="w-11 h-11 flex items-center justify-center text-[#52596e] hover:bg-[#eaeef7] transition-colors"
        aria-label="Decrease"
        disabled={value <= min}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="flex-1 text-center text-base font-bold text-[#0a1530] tabular-nums">
        {value}
      </span>
      <button
        onClick={() => setValue(Math.min(max, value + step))}
        className="w-11 h-11 flex items-center justify-center text-[#52596e] hover:bg-[#eaeef7] transition-colors"
        aria-label="Increase"
        disabled={value >= max}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function Choice({
  active, onClick, title, sub, cost, disabled,
}: {
  active: boolean; onClick: () => void; title: string;
  sub: string; cost: string; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-3 rounded-xl text-left transition-all border ${
        disabled ? 'opacity-40 cursor-not-allowed border-transparent bg-[#f3f5fb]' :
        active ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-soft' :
        'bg-white border-[rgba(14,20,36,0.08)] hover:border-[#0a1530]'
      }`}
    >
      <div className={`text-xs font-bold ${active ? 'text-white' : 'text-[#0a1530]'}`}>{title}</div>
      <div className={`text-[11px] mt-0.5 ${active ? 'text-white/70' : 'text-[#7a8195]'}`}>{sub}</div>
      <div className={`text-[11px] font-semibold mt-1 ${active ? 'text-white' : 'text-[#7c3aed]'}`}>{cost}</div>
    </button>
  );
}

function Row({
  label, hint, value, icon: Icon,
}: {
  label: string; hint?: string; value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-white/70">
        <Icon className="w-3.5 h-3.5 text-[#ffbf47]" />
        {label}
        {hint && <span className="text-white/40 text-[11px]">· {hint}</span>}
      </span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
