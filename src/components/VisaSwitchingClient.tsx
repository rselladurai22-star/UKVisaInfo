'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Building2, ArrowRight, ShieldCheck, AlertTriangle, Smartphone,
  Clock, CheckCircle2, XCircle, Info, ExternalLink,
  Briefcase, GraduationCap, Heart, Crown, ChevronDown, Calculator,
} from 'lucide-react';
import { FROM_VISAS } from '../data/visaSwitching';

const CATEGORY_COLORS: Record<string, string> = {
  Work: '#6366F1',
  Study: '#1E3A8A',
  Family: '#9F1239',
  Settlement: '#6366F1',
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Work: Briefcase,
  Study: GraduationCap,
  Family: Heart,
  Settlement: Crown,
};

const DIFFICULTY_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  Common:      { bg: '#6366F115', color: '#6366F1', label: 'Common switch' },
  Conditional: { bg: 'rgba(88,81,219,0.12)', color: '#5C4A12', label: 'Conditional' },
  Rare:        { bg: 'rgba(159,18,57,0.10)', color: '#9F1239', label: 'Rare / unusual' },
};

export default function VisaSwitchingClient() {
  const [fromId, setFromId] = useState<string>('student');
  const [open, setOpen] = useState(false);

  const from = useMemo(() => FROM_VISAS.find(v => v.id === fromId) ?? FROM_VISAS[0], [fromId]);

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* HERO — Editorial Premium cream */}
      <section className="relative overflow-hidden pt-[84px] md:pt-[96px] pb-10 md:pb-12"
               style={{ background: '#FFFFFF' }}>
        <div className="relative max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/visa-types"
                  className="inline-flex items-center gap-1 text-[13px] font-medium transition-colors"
                  style={{ color: '#3F3F46' }}>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" /> All visa routes
            </Link>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase px-3.5 py-1.5 rounded-full mb-6"
                style={{
                  background: 'rgba(99,91,255,0.08)',
                  color: '#6366F1',
                  border: '1px solid rgba(99,91,255,0.18)',
                  letterSpacing: '0.18em',
                }}>
            <Building2 className="w-3 h-3" /> Already in the UK
          </span>

          <h1 style={{
            fontFamily: '"Inter Tight", Inter, sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(1.75rem, 4.5vw, 2.875rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.025em',
            color: '#18181B',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}>
            Visa <span style={{ fontStyle: 'italic', color: '#6366F1' }}>switching</span> guide
          </h1>
          <p className="mt-6 text-[15px] md:text-[16px] leading-[1.65] max-w-2xl"
             style={{ color: '#3F3F46' }}>
            Switch from one UK visa to another without leaving the country.
            Choose your current visa below to see which routes you can move to —
            with the conditions and step-by-step process for each.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12 grid grid-cols-12 gap-8 lg:gap-12">

        {/* LEFT: From selector + key facts */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-[100px] space-y-4">
            <div className="rounded-lg bg-white border border-[#E5E7EB] p-6"
                 style={{ boxShadow: '0 2px 12px rgba(26,31,54,0.06)' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-[3px] h-[14px] rounded-full bg-[#6366F1]" />
                <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#064E3B]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Step 1 · Your current visa
                </span>
              </div>
              <h3 className="text-[17px] font-extrabold text-[#18181B] mb-1"
                  style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                I am currently on…
              </h3>
              <p className="text-[13px] font-normal text-[#64748B] mb-4 leading-[1.55]"
                 style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Choose the UK visa you currently hold. We&apos;ll show what you can switch into.
              </p>

              {/* Dropdown */}
              <div className="relative">
                <button onClick={() => setOpen(o => !o)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#94A3B8] transition-colors text-left"
                        aria-haspopup="listbox" aria-expanded={open}>
                  <div>
                    <div className="text-[14px] font-extrabold text-[#18181B]"
                         style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                      {from.label}
                    </div>
                    <div className="text-[11.5px] font-normal text-[#64748B] mt-0.5">{from.blurb}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <ul role="listbox"
                      className="absolute left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-xl bg-white border border-[#E5E7EB] z-20"
                      style={{ boxShadow: '0 12px 32px -8px rgba(26,31,54,0.18)' }}>
                    {FROM_VISAS.map(v => (
                      <li key={v.id}>
                        <button onClick={() => { setFromId(v.id); setOpen(false); }}
                                className={`w-full text-left px-4 py-3 ${
                                  v.id === fromId ? 'bg-[#F1F5F9]' : 'hover:bg-[#FFFFFF]'
                                }`}>
                          <div className="text-[14px] font-bold text-[#18181B]"
                               style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {v.label}
                          </div>
                          <div className="text-[12px] font-normal text-[#64748B] mt-0.5">{v.blurb}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-5 pt-5 border-t border-[#F3F4F6] space-y-3">
                <KeyFact icon={Building2} label="Where" value="Inside UK · no overseas travel" />
                <KeyFact icon={Smartphone} label="Identity"  value="UK Immigration: ID Check app" />
                <KeyFact icon={Clock} label="Lawful stay" value="Continue under section 3C leave" />
                <KeyFact icon={ShieldCheck} label="Source" value="100% gov.uk verified" />
              </div>
            </div>

            <Link href="/tools/cost-calculator"
                  className="flex items-center justify-between gap-3 rounded-lg p-5 text-white"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #064E3B)', boxShadow: '0 8px 30px -8px rgba(99,91,255,0.5)' }}>
              <div>
                <div className="text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-white/85 mb-1">In-UK fees usually higher</div>
                <div className="text-[16px] font-extrabold leading-tight"
                     style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                  Calculate switching cost
                </div>
              </div>
              <Calculator className="w-5 h-5 text-white/90" />
            </Link>
          </div>
        </aside>

        {/* RIGHT: Switch options */}
        <main className="col-span-12 lg:col-span-8 space-y-6">

          {/* Step 2 header */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-[3px] h-[18px] rounded-full bg-[#6366F1]" />
              <span className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#064E3B]"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Step 2 · Where you can switch to
              </span>
            </div>
            <h2 className="text-[23px] md:text-[28px] font-extrabold text-[#18181B] tracking-[-0.022em] leading-[1.12]"
                style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
              From <span style={{ color: '#064E3B' }}>{from.label}</span>{' → '}
            </h2>
            <p className="mt-3 text-[14.5px] font-normal text-[#3F3F46] leading-[1.72] max-w-2xl"
               style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {from.switches.length > 0
                ? `Available switches from a ${from.label}. Common routes are routine; conditional routes have extra requirements you must meet.`
                : `The ${from.label} is a short-stay route. You generally cannot switch into a long-term UK visa from inside the UK — you must leave and apply for entry clearance.`}
            </p>
          </div>

          {/* Switch cards */}
          {from.switches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {from.switches.map((s) => {
                const color = CATEGORY_COLORS[s.category] ?? '#18181B';
                const Icon = CATEGORY_ICONS[s.category] ?? Briefcase;
                const diff  = DIFFICULTY_STYLE[s.difficulty];
                return (
                  <Link key={s.toSlug + s.toTitle} href={`/visa/${s.toSlug}`}
                        className="group block rounded-lg bg-white border border-[#E5E7EB] p-5 hover:border-[#18181B] transition-all"
                        style={{ boxShadow: '0 2px 12px rgba(26,31,54,0.05)' }}>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${color}15`, color }}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] mb-1"
                             style={{ color, fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {s.category} route
                        </div>
                        <h3 className="text-[15.5px] font-extrabold text-[#18181B] leading-tight"
                            style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                          {s.toTitle}
                        </h3>
                      </div>
                    </div>
                    <p className="text-[13.5px] font-normal text-[#334155] leading-[1.65] mb-4"
                       style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {s.note}
                    </p>
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F3F4F6]">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                            style={{ background: diff.bg, color: diff.color, fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {s.difficulty === 'Common' ? <CheckCircle2 className="w-3 h-3" />
                          : s.difficulty === 'Conditional' ? <AlertTriangle className="w-3 h-3" />
                          : <Info className="w-3 h-3" />}
                        {diff.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#18181B] group-hover:gap-2 transition-all"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        See full guide
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg bg-white border border-amber-200 p-7"
                 style={{ boxShadow: '0 2px 12px rgba(245,158,11,0.08)' }}>
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(245,158,11,0.14)', color: '#B45309' }}>
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div className="flex-1">
                  <h3 className="text-[16px] font-extrabold text-[#18181B] mb-2"
                      style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                    No in-country switches available
                  </h3>
                  <p className="text-[14px] font-normal text-[#334155] leading-[1.7]"
                     style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    From a <strong className="font-bold">{from.label}</strong>, you cannot switch into a long-term
                    UK visa while inside the UK. You must leave the UK and apply for entry clearance from your home
                    country (or the country in which you normally live).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cannot switch into */}
          {from.cannotSwitchInto && from.cannotSwitchInto.length > 0 && (
            <div className="rounded-lg bg-white border border-[#FECACA] p-6"
                 style={{ boxShadow: '0 2px 12px rgba(225,29,72,0.06)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: '#FEE2E2', color: '#B91C1C' }}>
                  <XCircle className="w-4 h-4" />
                </span>
                <h3 className="text-[14.5px] font-extrabold text-[#18181B]"
                    style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                  Cannot switch from {from.label} into
                </h3>
              </div>
              <ul className="space-y-2">
                {from.cannotSwitchInto.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13.5px] font-normal text-[#334155] leading-[1.6]"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-1 text-[#DC2626]" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Generic step-by-step */}
          <div className="rounded-lg bg-white border border-[#E5E7EB] overflow-hidden mt-2"
               style={{ boxShadow: '0 2px 12px rgba(26,31,54,0.06)' }}>
            <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center gap-3"
                 style={{ background: 'rgba(99,91,255,0.06)' }}>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                    style={{ background: '#6366F1' }}>
                <Building2 className="w-4 h-4" />
              </span>
              <div>
                <div className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#064E3B]"
                     style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Step 3 · How an in-UK switch works
                </div>
                <h3 className="text-[16px] font-extrabold text-[#18181B] leading-tight"
                    style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                  General switching process
                </h3>
              </div>
            </div>
            <ol className="divide-y divide-[#F3F4F6]">
              {SWITCH_STEPS.map((s, i) => (
                <li key={i} className="px-6 py-5 md:px-8 md:py-6 flex gap-5">
                  <span aria-hidden
                        className="flex-shrink-0 w-10 h-10 rounded-full text-white text-[14px] font-extrabold flex items-center justify-center"
                        style={{ background: '#6366F1', boxShadow: '0 4px 14px -4px rgba(99,91,255,0.6)', fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15.5px] md:text-[16.5px] font-extrabold text-[#18181B] leading-tight mb-1.5"
                        style={{ fontFamily: '"Inter Tight", Inter, sans-serif' }}>
                      {s.title}
                    </h4>
                    <p className="text-[14px] font-normal text-[#334155] leading-[1.75] max-w-3xl"
                       style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="px-6 py-4 md:px-8 border-t border-[#F3F4F6] bg-[#FAFBFC] flex flex-wrap gap-3">
              <a href="https://www.gov.uk/check-uk-visa" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-[13px] font-bold text-[#18181B] hover:underline">
                gov.uk: Check if you can switch <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

const SWITCH_STEPS = [
  { title: 'Apply before your current visa expires',
    desc: 'You must submit your switch application while you still have valid leave. Submitting late breaks your continuous lawful residence and may affect future settlement.' },
  { title: 'Use the same online GOV.UK application',
    desc: 'Visit the GOV.UK page for your target visa and select "I\'m applying inside the UK". You stay in the UK throughout — no overseas Visa Application Centre.' },
  { title: 'Pay the in-UK fee and IHS upfront',
    desc: 'In-UK fees are usually higher than the outside-UK equivalent. The Immigration Health Surcharge is paid for the full duration in advance.' },
  { title: 'Verify your identity with the UK Immigration: ID Check app',
    desc: 'Most applicants scan their passport using the official app and take a photo. If your case requires it, you may instead be asked to attend a UKVCAS centre in the UK.' },
  { title: 'Continue working / studying under section 3C leave',
    desc: 'If you applied before your old visa expired, your conditions automatically continue while you wait for a decision. This is called section 3C leave.' },
  { title: 'Receive decision as a digital eVisa',
    desc: 'From 2026 all permissions are issued digitally. You access your eVisa via your UKVI account — no physical BRP card.' },
];

function KeyFact({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string; value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(99,91,255,0.12)', color: '#064E3B' }}>
        <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9CA3AF]"
             style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {label}
        </div>
        <div className="text-[13px] font-bold text-[#18181B] leading-snug mt-0.5"
             style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {value}
        </div>
      </div>
    </div>
  );
}
