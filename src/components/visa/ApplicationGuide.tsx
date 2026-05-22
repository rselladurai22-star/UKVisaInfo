'use client';

/**
 * ApplicationGuide — clean, differentiated guide for visa applications.
 *
 * Two distinct paths:
 *   1. Apply from outside UK (entry clearance) — with nationality filter
 *   2. Switch / extend inside UK — different process, different fee, no VAC
 *
 * Auto-detects which paths are available from the visa's processing data.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Globe, Building2, MapPin, Stethoscope, ShieldCheck, Clock,
  ExternalLink, ChevronDown, Info, Calculator,
} from 'lucide-react';
import { NATIONALITIES } from '../../data/visaNationalities';

interface Step { title: string; desc: string }

interface Props {
  slug: string;
  title: string;
  category: 'Work' | 'Study' | 'Visit' | 'Family';
  fee: string;
  ihs: string;
  applyUrl: string;
  processing: { outside: string; inside: string };
  steps: Step[];                   // existing steps (we treat as outside-UK by default)
  accent: string;
}

type PathId = 'outside' | 'inside';

const SWITCHING_FROM_BY_CATEGORY: Record<string, string[]> = {
  Work:   ['Student visa (completed degree)', 'Graduate visa', 'Health & Care Worker', 'Dependant of a worker', 'Most other long-term visas'],
  Study:  ['Student visa (course change)', 'Tier 4 (Child) Student', 'Some short-term visas — restrictions apply'],
  Family: ['Most long-term visa categories (Skilled Worker, Student, Health & Care, Graduate)', 'Not from Visitor visa'],
  Visit:  [],
};

function isAvailable(value: string) {
  return value && !/^n\/a/i.test(value.trim());
}

export default function ApplicationGuide({
  slug, title, category, fee, ihs, applyUrl, processing, steps, accent,
}: Props) {
  const outsideAvailable = isAvailable(processing.outside);
  const insideAvailable  = isAvailable(processing.inside);

  const defaultPath: PathId = outsideAvailable ? 'outside' : 'inside';
  const [path, setPath] = useState<PathId>(defaultPath);
  const [natCode, setNatCode] = useState<string>('india');
  const [natOpen, setNatOpen] = useState(false);

  const nat = useMemo(
    () => NATIONALITIES.find(n => n.code === natCode) ?? NATIONALITIES[0],
    [natCode]
  );

  const outsideTheme = {
    accent,
    bgSoft: `${accent}0c`,
    border: `${accent}30`,
    chip: `${accent}18`,
  };
  const insideTheme = {
    accent: '#0A2540',
    bgSoft: 'rgba(10,37,64,0.05)',
    border: 'rgba(10,37,64,0.20)',
    chip: 'rgba(10,37,64,0.10)',
  };

  // Outside-UK 6-step gov.uk style flow
  const outsideSteps: Step[] = [
    { title: 'Check you can apply', desc: `Confirm you meet every eligibility requirement for the ${title} before you start. The Home Office refuses on the first missed condition, and the application fee is non-refundable.` },
    { title: 'Get your documents ready', desc: 'Gather your passport, financial evidence, English language proof, and any sponsor or course documents listed below. Originals must be available; certified translations are required for non-English documents.' },
    { title: 'Apply online on GOV.UK', desc: `Start the application on the official GOV.UK page. You'll be asked about your nationality, the route, and the type of visa. Save and return — the application can take 30–60 minutes.` },
    { title: 'Pay the fee and IHS', desc: `Pay the application fee (${fee.split('·')[0].trim()}) and the Immigration Health Surcharge (${ihs}) upfront. Both are paid online by card.` },
    { title: 'Book and attend biometrics', desc: nat.tbTest
        ? `Book your appointment at a UK Visa Application Centre in ${nat.vacCities.split(',')[0].trim()}. You'll provide fingerprints and a photo. You'll also need to complete a TB test at a Home Office-approved clinic before this appointment.`
        : `Book your appointment at a UK Visa Application Centre (${nat.vacCities.split('—')[0].trim()}). You'll provide fingerprints and a photo. No TB test required for your nationality.` },
    { title: 'Wait for the decision', desc: `Standard processing is ${processing.outside}. You'll be notified by email. From 2026, your visa is issued as a digital eVisa — no physical BRP. Use the UK Immigration: ID Check app to verify your identity online.` },
  ];

  // Inside-UK 5-step switch flow
  const insideSteps: Step[] = [
    { title: 'Confirm you can switch', desc: `Most long-term UK visas can switch into the ${title} from inside the UK, provided you currently hold valid leave. You cannot switch from a Visitor visa or short-term visa for most routes.` },
    { title: 'Apply before your current visa expires', desc: 'You must apply before your existing leave expires. Submitting late breaks your continuous lawful residence and may affect your route to settlement.' },
    { title: 'Apply online on GOV.UK', desc: 'Use the same online application. Select "I am applying inside the UK". You will not visit a Visa Application Centre overseas; you stay in the UK throughout.' },
    { title: 'Pay the fee and IHS', desc: `Pay the in-UK application fee and the Immigration Health Surcharge (${ihs}). The in-UK fee is usually higher than the outside-UK fee.` },
    { title: 'Verify your identity', desc: 'Use the UK Immigration: ID Check app on your phone to scan your passport and take a photo. If your case requires it, you may be asked to attend a UKVCAS service point in the UK instead.' },
    { title: 'Wait for the decision', desc: `Standard processing is ${processing.inside}. You can continue working/studying under section 3C leave while you wait. Your new permission is issued as a digital eVisa.` },
  ];

  // Choose steps: prefer the visa's own steps for outside-UK (more specific),
  // but fall back to gov.uk-style generic if needed.
  const showSteps = path === 'outside'
    ? (steps.length >= 4 ? steps : outsideSteps)
    : insideSteps;

  const theme = path === 'outside' ? outsideTheme : insideTheme;

  return (
    <div>
      {/* ─── PATH TABS ─── */}
      <div
        role="tablist"
        aria-label="Application path"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7 p-1.5 rounded-2xl bg-white border border-[#E5E7EB]"
        style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.05)' }}
      >
        <PathTab
          id="outside"
          active={path === 'outside'}
          disabled={!outsideAvailable}
          onClick={() => setPath('outside')}
          icon={Globe}
          title="Apply from outside UK"
          subtitle={outsideAvailable ? `Entry clearance · ${processing.outside}` : 'Not applicable for this route'}
          accent={accent}
        />
        <PathTab
          id="inside"
          active={path === 'inside'}
          disabled={!insideAvailable}
          onClick={() => setPath('inside')}
          icon={Building2}
          title="Switch / extend inside UK"
          subtitle={insideAvailable ? `In-country · ${processing.inside}` : 'Not applicable for this route'}
          accent="#0A2540"
        />
      </div>

      {/* ─── CONTEXT STRIP ─── */}
      <div className="rounded-2xl border bg-white p-6 mb-6"
           style={{ borderColor: theme.border, boxShadow: '0 2px 12px rgba(10,37,64,0.06)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.accent }} />
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em]"
                style={{ color: theme.accent, fontFamily: 'Inter, sans-serif' }}>
            {path === 'outside' ? 'New application · From your home country' : 'In-country switch · No travel needed'}
          </span>
        </div>
        <p className="text-[14.5px] font-normal text-[#334155] leading-[1.72] max-w-3xl"
           style={{ fontFamily: 'Inter, sans-serif' }}>
          {path === 'outside' ? (
            <>This guide is for people applying to the UK from <strong className="font-bold text-[#0F172A]">outside</strong> the UK
            (entry clearance). You will book a biometrics appointment at a UK Visa Application Centre in your country
            and travel to the UK after a decision is granted.</>
          ) : (
            <>This guide is for people already <strong className="font-bold text-[#0F172A]">inside the UK</strong> on another long-term visa
            who want to switch into the {title} without leaving. Identity is verified using the
            UK Immigration: ID Check app — no overseas VAC visit.</>
          )}
        </p>

        {/* Quick facts strip */}
        <div className="mt-5 pt-5 border-t border-[#F3F4F6] grid grid-cols-2 md:grid-cols-4 gap-4">
          <Fact label="Application fee" value={fee.split('·')[0].trim()} icon={ShieldCheck} accent={theme.accent} />
          <Fact label="IHS surcharge"  value={ihs} icon={Stethoscope} accent={theme.accent} />
          <Fact label="Processing"      value={path === 'outside' ? processing.outside : processing.inside} icon={Clock} accent={theme.accent} />
          <Fact label="Identity check"  value={path === 'outside' ? 'Biometrics at VAC' : 'UK Immigration ID app'} icon={MapPin} accent={theme.accent} />
        </div>
      </div>

      {/* ─── NATIONALITY FILTER (outside UK only) ─── */}
      {path === 'outside' && (
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 mb-6"
             style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.05)' }}>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-[3px] h-[14px] rounded-full" style={{ background: accent }} />
                <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em]"
                      style={{ color: accent, fontFamily: 'Inter, sans-serif' }}>
                  Applying from
                </span>
              </div>
              <h3 className="text-[16px] font-extrabold text-[#0A2540]"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                Select your nationality
              </h3>
              <p className="text-[13px] font-normal text-[#64748B] mt-1"
                 style={{ fontFamily: 'Inter, sans-serif' }}>
                Requirements like TB testing and VAC location depend on where you apply from.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setNatOpen(o => !o)}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#94A3B8] transition-colors"
                aria-haspopup="listbox" aria-expanded={natOpen}
              >
                <span className="text-[18px]">{nat.flag}</span>
                <span className="text-[14px] font-bold text-[#0A2540]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {nat.name}
                </span>
                <ChevronDown className="w-4 h-4 text-[#64748B]" />
              </button>
              {natOpen && (
                <ul role="listbox"
                    className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-xl bg-white border border-[#E5E7EB] z-20"
                    style={{ boxShadow: '0 12px 32px -8px rgba(10,37,64,0.18)' }}>
                  {NATIONALITIES.map((n) => (
                    <li key={n.code}>
                      <button
                        onClick={() => { setNatCode(n.code); setNatOpen(false); }}
                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium ${
                          n.code === natCode ? 'bg-[#F1F5F9] text-[#0A2540]' : 'text-[#334155] hover:bg-[#F8FAFC]'
                        }`}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <span className="text-[16px]">{n.flag}</span>
                        {n.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Nationality result panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <NatRow
              icon={Stethoscope}
              label="TB test"
              value={nat.tbTest ? 'Required' : 'Not required'}
              tone={nat.tbTest ? '#C9A14A' : '#10B981'}
              sub={nat.tbTest ? 'Test at IOM-approved clinic before biometrics' : 'No TB test for your nationality'}
            />
            <NatRow
              icon={MapPin}
              label="Visa Application Centre"
              value={nat.vacCities.split(/[,—]/)[0].trim()}
              tone={accent}
              sub={nat.vacCities.includes(',') || nat.vacCities.includes('—')
                ? nat.vacCities
                : 'Book your biometrics here'}
            />
            <NatRow
              icon={Clock}
              label="Typical processing"
              value={nat.processingWeeks}
              tone="#0A2540"
              sub={'Standard service · priority available'}
            />
          </div>

          {nat.note && (
            <div className="mt-4 flex items-start gap-3 rounded-xl p-4"
                 style={{ background: `${accent}08`, border: `1px solid ${accent}22` }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
              <p className="text-[13.5px] font-normal text-[#0F172A] leading-[1.65]"
                 style={{ fontFamily: 'Inter, sans-serif' }}>
                <strong className="font-bold">Note for {nat.name}:</strong> {nat.note}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── SWITCHING-FROM HINT (inside UK only) ─── */}
      {path === 'inside' && SWITCHING_FROM_BY_CATEGORY[category]?.length ? (
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 mb-6"
             style={{ boxShadow: '0 2px 12px rgba(10,37,64,0.05)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-[3px] h-[14px] rounded-full bg-[#0A2540]" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#0A2540]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
              Can switch from
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SWITCHING_FROM_BY_CATEGORY[category].map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold text-[#0A2540] bg-[#F1F5F9] border border-[#E2E8F0]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* ─── STEP-BY-STEP GUIDE (gov.uk style paragraph cards) ─── */}
      <div className="rounded-2xl bg-white border overflow-hidden"
           style={{ borderColor: theme.border, boxShadow: '0 2px 12px rgba(10,37,64,0.06)' }}>
        <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center gap-3"
             style={{ background: theme.bgSoft }}>
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ background: theme.accent }}>
            {path === 'outside' ? <Globe className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
          </span>
          <div>
            <div className="text-[10.5px] font-extrabold uppercase tracking-[0.16em]"
                 style={{ color: theme.accent, fontFamily: 'Inter, sans-serif' }}>
              Step-by-step
            </div>
            <h3 className="text-[16px] font-extrabold text-[#0A2540] leading-tight"
                style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              {path === 'outside'
                ? `Apply for the ${title} from outside the UK`
                : `Switch into the ${title} from inside the UK`}
            </h3>
          </div>
        </div>

        <ol className="divide-y divide-[#F3F4F6]">
          {showSteps.map((s, i) => (
            <li key={i} className="px-6 py-6 md:px-8 md:py-7 flex gap-5">
              <span aria-hidden
                    className="flex-shrink-0 w-10 h-10 rounded-full text-white text-[14px] font-extrabold flex items-center justify-center"
                    style={{
                      background: theme.accent,
                      boxShadow: `0 4px 14px -4px ${theme.accent}80`,
                      fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                    }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-[16px] md:text-[17px] font-extrabold text-[#0A2540] leading-tight mb-2"
                    style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                  {s.title}
                </h4>
                <p className="text-[14.5px] font-normal text-[#334155] leading-[1.78] max-w-3xl"
                   style={{ fontFamily: 'Inter, sans-serif' }}>
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Footer CTAs */}
        <div className="px-6 py-5 md:px-8 border-t border-[#F3F4F6] bg-[#FAFBFC] flex flex-wrap gap-3">
          <a href={applyUrl} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-white text-[13.5px] font-extrabold px-5 py-3 rounded-xl transition-all active:scale-[0.98]"
             style={{
               background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`,
               boxShadow: `0 6px 18px -6px ${theme.accent}80`,
               fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
             }}>
            {path === 'outside' ? 'Apply from outside UK' : 'Apply inside UK'} on gov.uk
            <ExternalLink className="w-4 h-4" />
          </a>
          <Link href={`/tools/cost-calculator?visa=${slug}`}
                className="inline-flex items-center gap-2 text-[#0A2540] text-[13.5px] font-bold px-5 py-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#94A3B8] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}>
            <Calculator className="w-4 h-4" />
            Calculate total cost
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Subcomponents ─── */

function PathTab({
  active, disabled, onClick, icon: Icon, title, subtitle, accent,
}: {
  id: PathId; active: boolean; disabled: boolean; onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string; subtitle: string; accent: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={`relative text-left px-5 py-4 rounded-xl transition-all flex items-start gap-3.5 ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${active ? '' : 'hover:bg-[#F8FAFC]'}`}
      style={active ? {
        background: `linear-gradient(135deg, ${accent}10 0%, ${accent}05 100%)`,
        border: `1.5px solid ${accent}`,
      } : {
        background: 'transparent',
        border: '1.5px solid transparent',
      }}
    >
      <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: active ? accent : `${accent}15`,
              color: active ? '#fff' : accent,
            }}>
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[14.5px] font-extrabold leading-tight mb-1"
             style={{
               color: active ? accent : '#0A2540',
               fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
             }}>
          {title}
        </div>
        <div className="text-[12px] font-medium text-[#64748B]"
             style={{ fontFamily: 'Inter, sans-serif' }}>
          {subtitle}
        </div>
      </div>
    </button>
  );
}

function Fact({
  label, value, icon: Icon, accent,
}: {
  label: string; value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ color: accent }}><Icon className="w-3.5 h-3.5" strokeWidth={2.2} /></span>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9CA3AF]"
              style={{ fontFamily: 'Inter, sans-serif' }}>
          {label}
        </span>
      </div>
      <div className="text-[14px] font-extrabold text-[#0A2540] leading-tight tabular-nums"
           style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
        {value}
      </div>
    </div>
  );
}

function NatRow({
  icon: Icon, label, value, sub, tone,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string; value: string; sub: string; tone: string;
}) {
  return (
    <div className="rounded-xl p-4 bg-[#F8FAFC] border border-[#E5E7EB]">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${tone}15`, color: tone }}>
          <Icon className="w-[15px] h-[15px]" strokeWidth={2.2} />
        </span>
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9CA3AF]"
               style={{ fontFamily: 'Inter, sans-serif' }}>
            {label}
          </div>
          <div className="text-[13.5px] font-extrabold text-[#0A2540] leading-tight"
               style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            {value}
          </div>
        </div>
      </div>
      <p className="text-[12px] font-normal text-[#64748B] leading-[1.55]"
         style={{ fontFamily: 'Inter, sans-serif' }}>
        {sub}
      </p>
    </div>
  );
}
