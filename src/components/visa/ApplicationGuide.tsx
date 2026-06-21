'use client';

/**
 * ApplicationGuide, Editorial Premium application path guide.
 *
 * Two clean paths with crystal-clear differentiation:
 *   1. Apply from outside UK (entry clearance), with nationality filter
 *   2. Switch / extend inside UK, different process, different fee, no VAC
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Globe, Building2, MapPin, Stethoscope, ShieldCheck, Clock,
  ExternalLink, ChevronDown, Info, Calculator,
} from 'lucide-react';
import { NATIONALITIES } from '../../data/visaNationalities';

const INK     = '#18181B';
const CREAM   = '#FFFFFF';
const PAPER   = '#FFFFFF';
const EMERALD = '#6366F1';
const GOLD    = '#4F46E5';
const SLATE   = '#3F3F46';
const MUTED   = '#52525B';
const HAIR    = '#ECECEF';

interface Step { title: string; desc: string }

interface Props {
  slug: string;
  title: string;
  category: 'Work' | 'Study' | 'Visit' | 'Family';
  fee: string;
  ihs: string;
  applyUrl: string;
  processing: { outside: string; inside: string };
  steps: Step[];
  accent?: string;
}

type PathId = 'outside' | 'inside';

const SWITCHING_FROM_BY_CATEGORY: Record<string, string[]> = {
  Work:   ['Student visa (completed degree)', 'Graduate visa', 'Health & Care Worker', 'Dependant of a worker', 'Most other long-term visas'],
  Study:  ['Student visa (course change)', 'Tier 4 (Child) Student', 'Some short-term visas, restrictions apply'],
  Family: ['Most long-term visa categories (Skilled Worker, Student, Health & Care, Graduate)', 'Not from Visitor visa'],
  Visit:  [],
};

function isAvailable(value: string) {
  return value && !/^n\/a/i.test(value.trim());
}

export default function ApplicationGuide({
  slug, title, category, fee, ihs, applyUrl, processing, steps,
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

  // Step lists (unchanged content, just owned here)
  const outsideSteps: Step[] = [
    { title: 'Check you can apply', desc: `Confirm you meet every eligibility requirement for the ${title} before you start. The Home Office refuses on the first missed condition, and the application fee is non-refundable.` },
    { title: 'Get your documents ready', desc: 'Gather your passport, financial evidence, English language proof, and any sponsor or course documents listed below. Originals must be available; certified translations are required for non-English documents.' },
    { title: 'Apply online on GOV.UK', desc: `Start the application on the official GOV.UK page. You'll be asked about your nationality, the route, and the type of visa. Save and return, the application can take 30 to 60 minutes.` },
    { title: 'Pay the fee and IHS', desc: `Pay the application fee (${fee.split('·')[0].trim()}) and the Immigration Health Surcharge (${ihs}) upfront. Both are paid online by card.` },
    { title: 'Book and attend biometrics', desc: nat.tbTest
        ? `Book your appointment at a UK Visa Application Centre in ${nat.vacCities.split(',')[0].trim()}. You'll provide fingerprints and a photo. You'll also need to complete a TB test at a Home Office-approved clinic before this appointment.`
        : `Book your appointment at a UK Visa Application Centre (${nat.vacCities.split(', ')[0].trim()}). You'll provide fingerprints and a photo. No TB test required for your nationality.` },
    { title: 'Wait for the decision', desc: `Standard processing is ${processing.outside}. You'll be notified by email. From 2026, your visa is issued as a digital eVisa, no physical BRP. Use the UK Immigration: ID Check app to verify your identity online.` },
  ];

  const insideSteps: Step[] = [
    { title: 'Confirm you can switch', desc: `Most long-term UK visas can switch into the ${title} from inside the UK, provided you currently hold valid leave. You cannot switch from a Visitor visa or short-term visa for most routes.` },
    { title: 'Apply before your current visa expires', desc: 'You must apply before your existing leave expires. Submitting late breaks your continuous lawful residence and may affect your route to settlement.' },
    { title: 'Apply online on GOV.UK', desc: 'Use the same online application. Select "I am applying inside the UK". You will not visit a Visa Application Centre overseas; you stay in the UK throughout.' },
    { title: 'Pay the fee and IHS', desc: `Pay the in-UK application fee and the Immigration Health Surcharge (${ihs}). The in-UK fee is usually higher than the outside-UK fee.` },
    { title: 'Verify your identity', desc: 'Use the UK Immigration: ID Check app on your phone to scan your passport and take a photo. If your case requires it, you may be asked to attend a UKVCAS service point in the UK instead.' },
    { title: 'Wait for the decision', desc: `Standard processing is ${processing.inside}. You can continue working/studying under section 3C leave while you wait. Your new permission is issued as a digital eVisa.` },
  ];

  const showSteps = path === 'outside'
    ? (steps.length >= 4 ? steps : outsideSteps)
    : insideSteps;

  return (
    <div>
      {/* ─── PATH TABS ─── */}
      <div
        role="tablist"
        aria-label="Application path"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7 p-2 rounded-lg"
        style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 12px -6px rgba(26,31,54,0.08)' }}
      >
        <PathTab
          active={path === 'outside'}
          disabled={!outsideAvailable}
          onClick={() => setPath('outside')}
          icon={Globe}
          title="Apply from outside UK"
          subtitle={outsideAvailable ? `Entry clearance · ${processing.outside}` : 'Not applicable for this route'}
        />
        <PathTab
          active={path === 'inside'}
          disabled={!insideAvailable}
          onClick={() => setPath('inside')}
          icon={Building2}
          title="Switch / extend inside UK"
          subtitle={insideAvailable ? `In-country · ${processing.inside}` : 'Not applicable for this route'}
        />
      </div>

      {/* ─── CONTEXT STRIP ─── */}
      <div className="rounded-lg p-7 mb-6"
           style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)' }}>
        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: GOLD }}>
          {path === 'outside' ? 'New application · From your home country' : 'In-country switch · No travel needed'}
        </p>
        <p className="text-[14px] leading-[1.65] max-w-3xl" style={{ color: INK }}>
          {path === 'outside' ? (
            <>This guide is for people applying to the UK from <strong style={{ fontWeight: 700 }}>outside</strong> the UK
            (entry clearance). You will book a biometrics appointment at a UK Visa Application Centre in your country
            and travel to the UK after a decision is granted.</>
          ) : (
            <>This guide is for people already <strong style={{ fontWeight: 700 }}>inside the UK</strong> on another long-term visa
            who want to switch into the {title} without leaving. Identity is verified using the
            UK Immigration: ID Check app, no overseas VAC visit.</>
          )}
        </p>

        {/* Quick facts strip */}
        <div className="mt-6 pt-6 grid grid-cols-2 md:grid-cols-4 gap-5" style={{ borderTop: `1px solid ${HAIR}` }}>
          <Fact label="Application fee" value={fee.split('·')[0].trim()} icon={ShieldCheck} />
          <Fact label="IHS surcharge"  value={ihs} icon={Stethoscope} />
          <Fact label="Processing"      value={path === 'outside' ? processing.outside : processing.inside} icon={Clock} />
          <Fact label="Identity check"  value={path === 'outside' ? 'Biometrics at VAC' : 'UK Immigration ID app'} icon={MapPin} />
        </div>
      </div>

      {/* ─── NATIONALITY FILTER (outside UK only) ─── */}
      {path === 'outside' && (
        <div className="rounded-lg p-7 mb-6"
             style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: GOLD }}>
                Applying from
              </p>
              <h3 style={{
                fontFamily: '"Inter Tight", Inter, sans-serif',
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: '-0.022em',
                color: INK,
                lineHeight: 1.15,
              }}>
                Select your nationality
              </h3>
              <p className="text-[13.5px] mt-2 max-w-md" style={{ color: SLATE }}>
                TB testing and VAC location depend on where you apply from.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setNatOpen(o => !o)}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-colors"
                style={{ background: CREAM, border: `1px solid ${HAIR}`, color: INK }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = EMERALD; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = HAIR; }}
                aria-haspopup="listbox" aria-expanded={natOpen}
              >
                <span className="text-[18px]">{nat.flag}</span>
                <span className="text-[14px] font-semibold">{nat.name}</span>
                <ChevronDown className="w-4 h-4" style={{ color: MUTED }} />
              </button>
              {natOpen && (
                <ul role="listbox"
                    className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-xl z-20"
                    style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 16px 40px -12px rgba(26,31,54,0.22)' }}>
                  {NATIONALITIES.map((n) => (
                    <li key={n.code}>
                      <button
                        onClick={() => { setNatCode(n.code); setNatOpen(false); }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium transition-colors"
                        style={{
                          background: n.code === natCode ? 'rgba(99,91,255,0.06)' : 'transparent',
                          color: n.code === natCode ? EMERALD : INK,
                        }}
                        onMouseEnter={(e) => { if (n.code !== natCode) e.currentTarget.style.background = 'rgba(26,31,54,0.04)'; }}
                        onMouseLeave={(e) => { if (n.code !== natCode) e.currentTarget.style.background = 'transparent'; }}
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
              tone={nat.tbTest ? GOLD : EMERALD}
              sub={nat.tbTest ? 'Test at IOM-approved clinic before biometrics' : 'No TB test for your nationality'}
            />
            <NatRow
              icon={MapPin}
              label="Visa Application Centre"
              value={nat.vacCities.split(/[, ]/)[0].trim()}
              tone={EMERALD}
              sub={nat.vacCities.includes(',') || nat.vacCities.includes(', ')
                ? nat.vacCities
                : 'Book your biometrics here'}
            />
            <NatRow
              icon={Clock}
              label="Typical processing"
              value={nat.processingWeeks}
              tone={INK}
              sub="Standard service · priority available"
            />
          </div>

          {nat.note && (
            <div className="mt-5 flex items-start gap-3 rounded-xl p-4"
                 style={{ background: 'rgba(99,91,255,0.05)', border: '1px solid rgba(99,91,255,0.18)' }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: EMERALD }} />
              <p className="text-[13.5px] leading-[1.65]" style={{ color: INK }}>
                <strong style={{ fontWeight: 700 }}>Note for {nat.name}:</strong> {nat.note}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── SWITCHING-FROM HINT (inside UK only) ─── */}
      {path === 'inside' && SWITCHING_FROM_BY_CATEGORY[category]?.length ? (
        <div className="rounded-lg p-7 mb-6"
             style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)' }}>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: GOLD }}>
            Can switch from
          </p>
          <div className="flex flex-wrap gap-2">
            {SWITCHING_FROM_BY_CATEGORY[category].map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] font-semibold"
                    style={{ background: 'rgba(26,31,54,0.05)', color: INK, border: `1px solid ${HAIR}` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* ─── STEP-BY-STEP GUIDE ─── */}
      <div className="rounded-lg overflow-hidden"
           style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 16px -8px rgba(26,31,54,0.08)' }}>
        <div className="px-7 py-5 flex items-center gap-3"
             style={{ background: 'rgba(99,91,255,0.04)', borderBottom: `1px solid ${HAIR}` }}>
          <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: INK, color: CREAM }}>
            {path === 'outside' ? <Globe className="w-[18px] h-[18px]" /> : <Building2 className="w-[18px] h-[18px]" />}
          </span>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
              Step-by-step
            </p>
            <h3 className="leading-tight"
                style={{
                  fontFamily: '"Inter Tight", Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: '-0.02em',
                  color: INK,
                }}>
              {path === 'outside'
                ? `Apply for the ${title} from outside the UK`
                : `Switch into the ${title} from inside the UK`}
            </h3>
          </div>
        </div>

        <ol>
          {showSteps.map((s, i) => (
            <li key={i} className="px-7 py-6 md:px-8 md:py-7 flex gap-5"
                style={{ borderBottom: i < showSteps.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
              <span aria-hidden
                    className="flex-shrink-0 w-10 h-10 rounded-full text-[14px] flex items-center justify-center"
                    style={{
                      background: INK,
                      color: CREAM,
                      fontFamily: '"Inter Tight", Inter, sans-serif',
                      fontWeight: 700,
                    }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 style={{
                  fontFamily: '"Inter Tight", Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: '-0.018em',
                  color: INK,
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}>
                  {s.title}
                </h4>
                <p className="text-[14.5px] leading-[1.75] max-w-3xl" style={{ color: SLATE }}>
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Footer CTAs */}
        <div className="px-7 py-5 md:px-8 flex flex-wrap gap-3"
             style={{ background: CREAM, borderTop: `1px solid ${HAIR}` }}>
          <a href={applyUrl} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-5 py-3 rounded-xl transition-all active:scale-[0.98]"
             style={{
               background: INK,
               color: CREAM,
               boxShadow: '0 1px 2px rgba(26,31,54,0.06)',
             }}
             onMouseEnter={(e) => { e.currentTarget.style.background = EMERALD; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = INK; }}>
            {path === 'outside' ? 'Apply from outside UK' : 'Apply inside UK'} on gov.uk
            <ExternalLink className="w-4 h-4" />
          </a>
          <Link href={`/tools/cost-calculator?visa=${slug}`}
                className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-5 py-3 rounded-xl transition-colors"
                style={{ background: PAPER, border: `1px solid ${HAIR}`, color: INK }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = EMERALD; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = HAIR; }}>
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
  active, disabled, onClick, icon: Icon, title, subtitle,
}: {
  active: boolean; disabled: boolean; onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string; subtitle: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className="relative text-left px-5 py-4 rounded-xl transition-all flex items-start gap-3.5"
      style={{
        background: active ? INK : 'transparent',
        color: active ? CREAM : INK,
        border: active ? '1.5px solid transparent' : `1.5px solid ${HAIR}`,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => { if (!active && !disabled) e.currentTarget.style.background = 'rgba(26,31,54,0.04)'; }}
      onMouseLeave={(e) => { if (!active && !disabled) e.currentTarget.style.background = 'transparent'; }}
    >
      <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: active ? 'rgba(250,250,247,0.10)' : 'rgba(99,91,255,0.10)',
              color: active ? CREAM : EMERALD,
            }}>
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="leading-tight mb-1"
             style={{
               fontFamily: '"Inter Tight", Inter, sans-serif',
               fontWeight: 600,
               fontSize: 16,
               letterSpacing: '-0.018em',
               color: active ? CREAM : INK,
             }}>
          {title}
        </div>
        <div className="text-[12px] font-medium"
             style={{ color: active ? 'rgba(250,250,247,0.65)' : MUTED }}>
          {subtitle}
        </div>
      </div>
    </button>
  );
}

function Fact({
  label, value, icon: Icon,
}: {
  label: string; value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5" style={{ color: EMERALD }} strokeWidth={2.2} />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MUTED }}>
          {label}
        </span>
      </div>
      <div className="leading-tight tabular-nums"
           style={{
             fontFamily: '"Inter Tight", Inter, sans-serif',
             fontWeight: 600,
             fontSize: 16,
             letterSpacing: '-0.015em',
             color: INK,
           }}>
        {value}
      </div>
    </div>
  );
}

function NatRow({
  icon: Icon, label, value, sub, tone,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string; value: string; sub: string; tone: string;
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: CREAM, border: `1px solid ${HAIR}` }}>
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${tone}18`, color: tone }}>
          <Icon className="w-[15px] h-[15px]" strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: MUTED }}>
            {label}
          </div>
          <div className="leading-tight"
               style={{
                 fontFamily: '"Inter Tight", Inter, sans-serif',
                 fontWeight: 600,
                 fontSize: 15,
                 letterSpacing: '-0.015em',
                 color: INK,
               }}>
            {value}
          </div>
        </div>
      </div>
      <p className="text-[12px] leading-[1.55]" style={{ color: SLATE }}>
        {sub}
      </p>
    </div>
  );
}
