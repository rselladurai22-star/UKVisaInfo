'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Scale, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles,
  Briefcase, GraduationCap, Plane, Users, Stethoscope, LayoutGrid,
  Rocket, History, ShieldCheck, Crown, Globe, Flag,
} from 'lucide-react';
import Link from 'next/link';

interface VisaRow {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  fee: string;
  feeRange: string;
  ihs: string;
  salaryMin: string;
  duration: string;
  processing: string;
  ihsExempt: boolean;
  sponsorRequired: boolean;
  dependantsAllowed: boolean;
  workRights: string;
  pathToIlr: string;
  englishLevel: string;
  ageLimit?: string;
}

const VISAS: Record<string, VisaRow> = {
  'skilled-worker': {
    id: 'skilled-worker', name: 'Skilled Worker', icon: Briefcase, accent: '#6366F1',
    fee: '£827', feeRange: '£827 – £1,636', ihs: '£1,035/year',
    salaryMin: '£41,700 (or going rate)', duration: '3 or 5 years',
    processing: '3 weeks (out) / 8 weeks (in)', ihsExempt: false,
    sponsorRequired: true, dependantsAllowed: true, workRights: 'Sponsored only',
    pathToIlr: '5 years', englishLevel: 'B1',
  },
  'health-care': {
    id: 'health-care', name: 'Health & Care', icon: Stethoscope, accent: '#6366F1',
    fee: '£304', feeRange: '£304 – £590', ihs: 'Exempt (main)',
    salaryMin: '£25,000 (or going rate)', duration: '3 or 5 years',
    processing: '3 weeks (out)', ihsExempt: true,
    sponsorRequired: true, dependantsAllowed: true, workRights: 'Sponsored only',
    pathToIlr: '5 years', englishLevel: 'B1 (B2 for nurses/doctors)',
  },
  'student': {
    id: 'student', name: 'Student', icon: GraduationCap, accent: '#18181B',
    fee: '£524', feeRange: '£524', ihs: '£776/year',
    salaryMin: 'N/A', duration: 'Length of course',
    processing: '3 weeks (out) / 8 weeks (in)', ihsExempt: false,
    sponsorRequired: true, dependantsAllowed: false,
    workRights: 'Limited',
    pathToIlr: 'Does not count toward ILR', englishLevel: 'B2 (degree level)',
  },
  'graduate': {
    id: 'graduate', name: 'Graduate', icon: History, accent: '#007F76',
    fee: '£880', feeRange: '£880', ihs: '£1,035/year',
    salaryMin: 'N/A', duration: '18 months (3 yrs PhD)',
    processing: '8 weeks', ihsExempt: false,
    sponsorRequired: false, dependantsAllowed: false,
    workRights: 'Unrestricted',
    pathToIlr: 'Does not count toward ILR', englishLevel: 'N/A (proved at Student stage)',
  },
  'family': {
    id: 'family', name: 'Family / Spouse', icon: Users, accent: '#4F46E5',
    fee: '£1,938', feeRange: '£1,321 – £1,938', ihs: '£1,035/year',
    salaryMin: '£29,000 (sponsor income)', duration: '30 months (renewable)',
    processing: '12 weeks', ihsExempt: false,
    sponsorRequired: false, dependantsAllowed: false,
    workRights: 'Unrestricted',
    pathToIlr: '5 years', englishLevel: 'A1 / A2 / B1 (staged)',
  },
  'visitor': {
    id: 'visitor', name: 'Standard Visitor', icon: Plane, accent: '#6366F1',
    fee: '£127', feeRange: '£127 – £963', ihs: 'None',
    salaryMin: 'N/A', duration: 'Up to 6 months',
    processing: '3 weeks (out)', ihsExempt: true,
    sponsorRequired: false, dependantsAllowed: false,
    workRights: 'None',
    pathToIlr: 'Does not lead to settlement', englishLevel: 'None',
  },
  'innovator-founder': {
    id: 'innovator-founder', name: 'Innovator Founder', icon: Rocket, accent: '#6366F1',
    fee: '£1,191', feeRange: '£1,191 – £1,486', ihs: '£1,035/year',
    salaryMin: 'N/A', duration: '3 years',
    processing: '3 weeks (out)', ihsExempt: false,
    sponsorRequired: false, dependantsAllowed: true,
    workRights: 'Unrestricted',
    pathToIlr: '3 years (fastest route)', englishLevel: 'B2',
  },
  'global-talent': {
    id: 'global-talent', name: 'Global Talent', icon: LayoutGrid, accent: '#C9A14A',
    fee: '£722', feeRange: '£722', ihs: '£1,035/year',
    salaryMin: 'N/A', duration: '1 to 5 years',
    processing: '3 weeks (out)', ihsExempt: false,
    sponsorRequired: false, dependantsAllowed: true,
    workRights: 'Unrestricted',
    pathToIlr: '3 or 5 years', englishLevel: 'None (route-specific)',
  },
  'ilr': {
    id: 'ilr', name: 'Indefinite Leave to Remain', icon: ShieldCheck, accent: '#6366F1',
    fee: '£3,029', feeRange: '£3,029', ihs: 'None',
    salaryMin: 'N/A (route-specific)', duration: 'Permanent',
    processing: '6 months / 5 days super priority', ihsExempt: true,
    sponsorRequired: false, dependantsAllowed: true,
    workRights: 'Unrestricted',
    pathToIlr: 'This IS settlement', englishLevel: 'B1',
  },
  'citizenship': {
    id: 'citizenship', name: 'British Citizenship', icon: Crown, accent: '#C9A14A',
    fee: '£1,500', feeRange: '£1,580 with ceremony', ihs: 'None',
    salaryMin: 'N/A', duration: 'For life',
    processing: '6 months standard', ihsExempt: true,
    sponsorRequired: false, dependantsAllowed: false,
    workRights: 'Unrestricted (full citizen)',
    pathToIlr: 'Already settled', englishLevel: 'B1',
  },
  'euss': {
    id: 'euss', name: 'EU Settlement Scheme', icon: Globe, accent: '#18181B',
    fee: 'Free', feeRange: 'Free', ihs: 'None',
    salaryMin: 'N/A', duration: 'Pre-settled: 5 yrs / Settled: permanent',
    processing: '~30 days', ihsExempt: true,
    sponsorRequired: false, dependantsAllowed: true,
    workRights: 'Unrestricted',
    pathToIlr: 'Settled status = ILR equivalent', englishLevel: 'None',
  },
  'bno': {
    id: 'bno', name: 'Hong Kong BNO', icon: Flag, accent: '#6366F1',
    fee: '£298', feeRange: '£180 (2.5y) – £298 (5y)', ihs: '£1,035/year',
    salaryMin: 'N/A', duration: '2.5 or 5 years',
    processing: '12 weeks (out)', ihsExempt: false,
    sponsorRequired: false, dependantsAllowed: true,
    workRights: 'Unrestricted',
    pathToIlr: '5 years', englishLevel: 'None at entry, B1 at ILR',
  },
};

const VISA_IDS = Object.keys(VISAS);

interface FieldDef {
  key: keyof VisaRow;
  label: string;
  compare?: (a: any, b: any) => 'a' | 'b' | 'tie';
  format?: (v: any) => string | React.ReactNode;
}

const FIELDS: FieldDef[] = [
  { key: 'fee', label: 'Application fee' },
  { key: 'ihs', label: 'IHS (Health Surcharge)' },
  { key: 'salaryMin', label: 'Salary threshold' },
  { key: 'duration', label: 'Duration' },
  { key: 'processing', label: 'Processing time' },
  {
    key: 'sponsorRequired', label: 'Sponsor required',
    format: (v) => v ? <Bool yes /> : <Bool no />,
  },
  {
    key: 'dependantsAllowed', label: 'Dependants allowed',
    format: (v) => v ? <Bool yes /> : <Bool no />,
  },
  { key: 'workRights', label: 'Work rights' },
  { key: 'englishLevel', label: 'English requirement' },
  { key: 'pathToIlr', label: 'Path to ILR' },
];

export default function VisaCompare() {
  const [aId, setAId] = useState('skilled-worker');
  const [bId, setBId] = useState('graduate');

  const a = VISAS[aId];
  const b = VISAS[bId];

  const swap = () => {
    const t = aId; setAId(bId); setBId(t);
  };

  return (
    <div className="bg-white">
      <section className="pt-[88px] md:pt-[104px] pb-10 hero-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-[#6366F1]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6366F1]">
              Tool · Comparison
            </span>
          </div>
          <h1 className="font-display text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold text-[#18181B] tracking-tight leading-tight">
            UK visa comparison
          </h1>
          <p className="mt-3 max-w-2xl text-[#52525B] text-base md:text-lg leading-relaxed">
            Compare any two UK visa routes side-by-side. Fees, eligibility,
            duration, work rights and path to settlement.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-2 md:gap-4 mb-6">
            <VisaSelect label="Visa A" value={aId} onChange={setAId} disabledValue={bId} />
            <VisaSelect label="Visa B" value={bId} onChange={setBId} disabledValue={aId} />
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={swap}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f3f5fb] text-[#52525B] hover:bg-[#eaeef7] text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Swap
            </button>
          </div>

          {/* Comparison cards (mobile-first) */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <VisaHeaderCard visa={a} side="A" />
            <VisaHeaderCard visa={b} side="B" />
          </div>

          {/* Detailed comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl md:rounded-3xl shadow-soft border border-[rgba(14,20,36,0.08)] overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f3f5fb]">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">
                    Attribute
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">
                    <span className="hidden sm:inline">{a.name}</span>
                    <span className="sm:hidden">A</span>
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">
                    <span className="hidden sm:inline">{b.name}</span>
                    <span className="sm:hidden">B</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((f, i) => {
                  const va = a[f.key];
                  const vb = b[f.key];
                  return (
                    <tr key={String(f.key)} className={i % 2 ? 'bg-[#fafbfc]' : ''}>
                      <td className="px-4 py-3 text-xs font-semibold text-[#52525B]">
                        {f.label}
                      </td>
                      <td className="px-4 py-3 text-[#18181B]">
                        {f.format ? f.format(va) : String(va)}
                      </td>
                      <td className="px-4 py-3 text-[#18181B]">
                        {f.format ? f.format(vb) : String(vb)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

          {/* CTAs */}
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <Link
              href={`/visa-types/${a.id}`}
              className="inline-flex items-center justify-between gap-2 px-5 py-4 bg-[#18181B] text-white text-sm font-semibold rounded-xl hover:bg-[#4F46E5] transition-colors"
            >
              <span>Full {a.name} guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/visa-types/${b.id}`}
              className="inline-flex items-center justify-between gap-2 px-5 py-4 bg-[#18181B] text-white text-sm font-semibold rounded-xl hover:bg-[#4F46E5] transition-colors"
            >
              <span>Full {b.name} guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[#18181B] mb-4">
            How to use this comparison
          </h2>
          <p className="text-sm text-[#52525B] leading-relaxed">
            Pick the two routes you\&apos;re weighing up. Look at fees and IHS
            for short-term cost, salary threshold for whether you qualify,
            and path to ILR for long-term settlement value. The fastest
            routes to ILR are Innovator Founder (3 years) and Global Talent
            (3 years for exceptional talent endorsement).
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#6366F1] text-white text-sm font-semibold rounded-xl hover:bg-[#009E91] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Try our eligibility quiz
            </Link>
            <Link
              href="/tools/cost-calculator"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[rgba(14,20,36,0.12)] text-[#18181B] text-sm font-semibold rounded-xl hover:border-[#18181B] transition-colors"
            >
              Calculate exact costs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function VisaSelect({
  label, value, onChange, disabledValue,
}: {
  label: string; value: string;
  onChange: (v: string) => void; disabledValue: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1.5 px-3 py-3 bg-white border border-[rgba(14,20,36,0.12)] focus:border-[#18181B] rounded-xl text-sm font-semibold text-[#18181B] outline-none transition-all"
      >
        {VISA_IDS.map((id) => (
          <option key={id} value={id} disabled={id === disabledValue}>
            {VISAS[id].name}
          </option>
        ))}
      </select>
    </label>
  );
}

function VisaHeaderCard({ visa: v, side }: { visa: VisaRow; side: 'A' | 'B' }) {
  return (
    <motion.div
      key={v.id + side}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl md:rounded-3xl shadow-soft border border-[rgba(14,20,36,0.08)] overflow-hidden"
    >
      <div
        className="p-5 md:p-6 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${v.accent} 0%, ${v.accent}cc 100%)` }}
      >
        <div className="flex items-center gap-2 mb-3 opacity-80">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Visa {side}</span>
        </div>
        <div className="flex items-start gap-4">
          <span className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md flex-shrink-0">
            <v.icon className="w-5 h-5 text-white" />
          </span>
          <div>
            <h3 className="font-display font-bold text-xl leading-tight">
              {v.name}
            </h3>
            <p className="mt-1 text-xs text-white/75 leading-snug">
              From {v.fee} · {v.duration}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5 grid grid-cols-2 gap-3 text-xs">
        <Stat label="Fee range" value={v.feeRange} />
        <Stat label="IHS" value={v.ihs} />
        <Stat label="Processing" value={v.processing} />
        <Stat label="ILR" value={v.pathToIlr} />
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#7a8195]">
        {label}
      </div>
      <div className="text-xs font-semibold text-[#18181B] mt-0.5 leading-tight">
        {value}
      </div>
    </div>
  );
}

function Bool({ yes, no }: { yes?: boolean; no?: boolean }) {
  if (yes) return (
    <span className="inline-flex items-center gap-1 text-[#057a55] text-xs font-semibold">
      <CheckCircle2 className="w-3.5 h-3.5" /> Yes
    </span>
  );
  if (no) return (
    <span className="inline-flex items-center gap-1 text-[#7a8195] text-xs font-semibold">
      <XCircle className="w-3.5 h-3.5" /> No
    </span>
  );
  return null;
}
