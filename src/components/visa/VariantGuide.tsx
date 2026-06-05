'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ExternalLink, ChevronRight, ChevronDown, CheckCircle2,
  AlertTriangle, Calculator, Clock, Plane, Globe2, Users, Baby,
  Wallet, Zap, ArrowUpRight, ShieldCheck, FileText, Info, Plus, Minus,
  Building2, CreditCard, Languages, BadgeCheck, Fingerprint,
  Stethoscope, Heart, GraduationCap, Briefcase,
} from 'lucide-react';
import type { VisaDetail } from '../../data/visaDetails';
import type { VisaVariant } from '../../data/visaVariants';
import StickyMobileCta from '../StickyMobileCta';

/* ── Quartz tokens ── */
const C = {
  ink:'#0A0F1F', ink2:'#18181B', ink3:'#3F3F46',
  mid:'#52525B', mid2:'#8792A2', faint:'#A3ACB9',
  bg:'#FFFFFF', bg2:'#FAFBFC', bg3:'#F4F6F8', bg4:'#EDEFF3',
  border:'#ECECEF', borderS:'#CFD7DF', hair:'#EDF0F4',
  accent:'#6366F1', accent2:'#8B85FF', accentDk:'#4F47CC', accentSoft:'#EFEEFF',
  ok:'#08855D', okSoft:'#E6F7EF',
  warn:'#BF6A02', warnSoft:'#FCEDD3',
  pink:'#CD3D64', pinkSoft:'#FCE6EC',
  teal:'#0B7285', tealSoft:'#E0F2F4',
};
const mono = 'JetBrains Mono, ui-monospace, monospace';
const sans = 'Inter, system-ui, -apple-system, sans-serif';

type Location = 'outside' | 'inside';
type Priority = 'standard' | 'priority' | 'super';

function parseFees(feeStr: string | undefined, feeAmount: number | undefined) {
  const base = feeAmount ?? 819;
  if (!feeStr) return { y3: base, y5: base * 2 };
  const nums = [...feeStr.matchAll(/£([\d,]+)/g)].map(m => parseInt(m[1].replace(/,/g,''), 10));
  return { y3: nums[0] ?? base, y5: nums[1] ?? (nums[0] ? nums[0] * 2 : base * 2) };
}

function docIcon(d: string): React.ComponentType<{size?:number; strokeWidth?:number; color?:string}> {
  const l = d.toLowerCase();
  if (/passport|biometric|brp|evisa|share code|nationality/.test(l)) return Fingerprint;
  if (/english|ielts|selt|b1|b2|language/.test(l)) return Languages;
  if (/bank|payslip|p60|hmrc|salary|maintenance|funds|savings/.test(l)) return CreditCard;
  if (/cas|cos|sponsor|certificate of acceptance|offer|endorsement/.test(l)) return FileSignature2;
  if (/employer|institution|company|university/.test(l)) return Building2;
  if (/tb|tuberculosis|medical|gmc|nmc|hcpc/.test(l)) return Stethoscope;
  if (/birth|marriage|civil partnership|adoption|family/.test(l)) return Heart;
  if (/degree|phd|qualification|cv|reference/.test(l)) return GraduationCap;
  if (/criminal|dbs|police|atas/.test(l)) return ShieldCheck;
  return FileText;
}

function FileSignature2({ size=16, strokeWidth=2, color='currentColor' }: {size?:number; strokeWidth?:number; color?:string}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}><path d="M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8.5L18 5.5"/><path d="M8 18h1l12.5-12.5a1.5 1.5 0 0 0-2.12-2.12L7 15.5V18"/></svg>;
}

interface Props {
  visa: VisaDetail;
  variant: VisaVariant;
  otherVariants: VisaVariant[];
  slug: string;
}

export default function VariantGuide({ visa, variant: vr, otherVariants, slug }: Props) {
  const [location, setLocation] = useState<Location>('outside');
  const [years, setYears] = useState(3);
  const [priority, setPriority] = useState<Priority>('standard');
  const [extraAdults, setExtraAdults] = useState(0);
  const [extraChildren, setExtraChildren] = useState(0);
  const [expandedElig, setExpandedElig] = useState<number | null>(null);

  const fees = useMemo(() => parseFees(vr.fee, vr.feeAmount), [vr]);
  const ihsAdult = vr.ihsAdult ?? 1035;
  const ihsChild = vr.ihsChild ?? 776;
  const isInsideAvailable = !!visa.processing.inside && !/^n\/a/i.test(visa.processing.inside);
  const priorityFee = priority === 'priority' ? 500 : priority === 'super' ? 1000 : 0;
  const mainFee = years > 3 ? fees.y5 : fees.y3;
  const mainIhs = ihsAdult > 0 ? ihsAdult * years : 0;
  const depAdultCost = extraAdults * (mainFee + ihsAdult * years);
  const depChildCost = extraChildren * ((ihsChild > 0 ? ihsChild * years : 0));
  const total = mainFee + mainIhs + depAdultCost + depChildCost + priorityFee;

  const processingTime = location === 'outside' ? visa.processing.outside : visa.processing.inside;
  const processingWeeks = useMemo(() => {
    const m = processingTime.match(/(\d+)\s*(week|day|month)/i);
    if (!m) return 3;
    const n = parseInt(m[1], 10);
    if (m[2].toLowerCase().startsWith('day'))   return Math.max(1, Math.round(n / 7));
    if (m[2].toLowerCase().startsWith('month')) return n * 4;
    return n;
  }, [processingTime]);

  const SECTIONS = [
    { id: 'eligibility', label: 'Eligibility', num: '01' },
    { id: 'costs',       label: 'Costs',       num: '02' },
    { id: 'processing',  label: 'Processing',  num: '03' },
    { id: 'journey',     label: 'How to apply',num: '04' },
    { id: 'apply',       label: 'Apply now',   num: '05' },
    ...(vr.notes && vr.notes.length > 0 ? [{ id: 'conditions', label: 'Conditions', num: '06' }] : []),
    ...(otherVariants.length > 0 ? [{ id: 'routes', label: 'Other routes', num: '07' }] : []),
  ];

  return (
    <div style={{ background: C.bg, fontFamily: sans, WebkitFontSmoothing: 'antialiased', color: C.ink }}>

      {/* ── HERO ── */}
      <header style={{
        background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg} 100%)`,
        borderBottom: `1px solid ${C.border}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:0.35, pointerEvents:'none' }} aria-hidden>
          <defs>
            <pattern id="vg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke={C.hair} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vg-grid)" />
        </svg>

        <div style={{ position:'relative', maxWidth:1240, margin:'0 auto', padding:'clamp(80px,9vw,96px) clamp(20px,3vw,32px) 32px' }}>
          {/* Breadcrumb */}
          <nav style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:C.mid, marginBottom:20 }}>
            <Link href="/visa-types" style={{ color:C.mid, textDecoration:'none' }}>UK Visas</Link>
            <ChevronRight size={10} color={C.faint} />
            <Link href={`/visa-types/${slug}`} style={{ color:C.mid, textDecoration:'none' }}>{visa.title}</Link>
            <ChevronRight size={10} color={C.faint} />
            <span style={{ color:C.ink2, fontWeight:500 }}>{vr.label}</span>
          </nav>

          <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.1fr) minmax(0,1fr)', gap:'clamp(24px,4vw,56px)', alignItems:'center' }} className="visa-hero-grid">
            {/* LEFT */}
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:14,
                            background:C.accentSoft, border:`1px solid ${C.accent}33`,
                            padding:'4px 10px', borderRadius:999 }}>
                <Briefcase size={10} strokeWidth={2.2} color={C.accentDk} />
                <span style={{ fontSize:10, fontWeight:700, color:C.accentDk, letterSpacing:'0.14em', textTransform:'uppercase' }}>
                  {visa.category} · Sub-route
                </span>
              </div>

              <h1 style={{ fontSize:'clamp(26px,3.8vw,42px)', fontWeight:600, lineHeight:1.05,
                           letterSpacing:'-0.028em', color:C.ink, margin:'0 0 6px' }}>
                {visa.title}
              </h1>
              <div style={{ fontSize:'clamp(17px,2.2vw,22px)', fontWeight:500, color:C.accent,
                            letterSpacing:'-0.015em', marginBottom:14 }}>
                {vr.label}
              </div>
              <p style={{ fontSize:14.5, lineHeight:1.65, color:C.mid, maxWidth:520, margin:'0 0 24px' }}>
                {vr.headline}
              </p>

              {/* KPI row */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
                            border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden',
                            background:C.bg, marginBottom:20 }}>
                <KpiTile label="Total cost" value={`£${total.toLocaleString()}`} sub="all-in" tone={C.accent} />
                <KpiTile label="Decision" value={processingWeeks < 1 ? processingTime : `${processingWeeks}w`} sub={location === 'outside' ? 'from abroad' : 'in-UK switch'} border />
                <KpiTile label="Duration" value={vr.duration?.split(/[·(]/)[0].trim() ?? `${years}y`} sub="initial leave" border />
                <KpiTile label="Path to ILR" value={vr.yearsToIlr ? `${vr.yearsToIlr}y` : '—'} sub={vr.yearsToCitizenship ? `+${vr.yearsToCitizenship}y citizen` : 'varies'} border />
              </div>

              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <a href={visa.applyUrl} target="_blank" rel="noopener noreferrer"
                   style={{ display:'inline-flex', alignItems:'center', gap:6, background:C.ink, color:'#fff',
                            fontSize:13, fontWeight:500, padding:'10px 16px', borderRadius:7,
                            textDecoration:'none', boxShadow:'0 1px 2px rgba(10,15,31,0.18)' }}>
                  Apply on gov.uk <ArrowUpRight size={13} strokeWidth={2} />
                </a>
                <Link href={`/tools/cost-calculator?visa=${slug}`}
                      style={{ display:'inline-flex', alignItems:'center', gap:6, background:C.bg,
                               color:C.ink3, border:`1px solid ${C.borderS}`, fontSize:13, fontWeight:500,
                               padding:'10px 16px', borderRadius:7, textDecoration:'none' }}>
                  <Calculator size={13} strokeWidth={2} /> Full calculator
                </Link>
                <Link href={`/visa-types/${slug}`}
                      style={{ display:'inline-flex', alignItems:'center', gap:5, color:C.mid,
                               fontSize:13, padding:'10px 4px', textDecoration:'none' }}>
                  <ArrowLeft size={12} /> {visa.title} overview
                </Link>
              </div>
            </div>

            {/* RIGHT — Quick-summary card */}
            <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12,
                          padding:'20px 22px', boxShadow:'0 1px 2px rgba(10,15,31,0.04),0 8px 24px -16px rgba(10,15,31,0.08)' }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.mid2, letterSpacing:'0.14em',
                            textTransform:'uppercase', marginBottom:14 }}>Route at a glance</div>
              {[
                { k: 'Route', v: vr.label },
                { k: 'Fee (≤3yr)', v: `£${fees.y3.toLocaleString()}`, mono: true },
                { k: 'Fee (>3yr)', v: fees.y5 !== fees.y3 ? `£${fees.y5.toLocaleString()}` : '—', mono: true },
                { k: 'IHS/yr', v: ihsAdult > 0 ? `£${ihsAdult.toLocaleString()}` : 'Exempt', mono: true },
                { k: 'Standard', v: visa.processing.outside },
                ...(isInsideAvailable ? [{ k: 'Switch/extend', v: visa.processing.inside }] : []),
                { k: 'ILR path', v: vr.yearsToIlr ? `${vr.yearsToIlr} years` : 'Varies' },
              ].map((row, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', gap:8,
                                      padding:'8px 0', borderTop: i > 0 ? `1px solid ${C.hair}` : 'none',
                                      fontSize:12.5, alignItems:'center' }}>
                  <span style={{ color:C.mid, fontWeight:500 }}>{row.k}</span>
                  <span style={{ color:C.ink2, fontWeight:600,
                                 fontFamily: (row as {mono?:boolean}).mono ? mono : sans,
                                 fontVariantNumeric:'tabular-nums' }}>{row.v}</span>
                </div>
              ))}
              <div style={{ marginTop:14, paddingTop:12, borderTop:`1px solid ${C.border}`,
                            display:'flex', alignItems:'center', gap:6 }}>
                <ShieldCheck size={11} strokeWidth={2} color={C.ok} />
                <span style={{ fontSize:10.5, fontWeight:600, color:C.ok }}>
                  gov.uk verified · {visa.updated ?? 'April 2026'}
                </span>
                <a href={vr.source} target="_blank" rel="noopener noreferrer"
                   style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:4,
                            fontSize:10.5, color:C.mid, textDecoration:'none' }}>
                  Source <ExternalLink size={9} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── STICKY FILTER BAR ── */}
      <div className="sticky" style={{
        top:62, zIndex:30, background:C.bg,
        borderBottom:`1px solid ${C.border}`,
        boxShadow:'0 1px 4px rgba(10,15,31,0.05)',
      }}>
        <div style={{ maxWidth:1240, margin:'0 auto',
                      padding:'10px clamp(20px,3vw,32px)',
                      display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          {/* Location */}
          <FilterGroup label="Applying from">
            <div style={{ display:'flex', border:`1px solid ${C.border}`, borderRadius:7, overflow:'hidden' }}>
              {(['outside','inside'] as Location[]).map((loc) => (
                <button key={loc}
                  onClick={() => { setLocation(loc); if (loc === 'inside' && !isInsideAvailable) return; }}
                  disabled={loc === 'inside' && !isInsideAvailable}
                  style={{
                    padding:'5px 12px', fontSize:12, fontWeight:500,
                    border:'none', cursor: loc === 'inside' && !isInsideAvailable ? 'not-allowed' : 'pointer',
                    background: location === loc ? C.ink : 'transparent',
                    color: location === loc ? '#fff' : loc === 'inside' && !isInsideAvailable ? C.faint : C.ink3,
                    opacity: loc === 'inside' && !isInsideAvailable ? 0.5 : 1,
                    transition:'background 0.1s',
                  }}>
                  {loc === 'outside' ? '✈ Outside UK' : '🇬🇧 Inside UK'}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Duration */}
          <FilterGroup label="Duration">
            <div style={{ display:'flex', gap:3 }}>
              {[1,2,3,4,5].map((y) => (
                <button key={y} onClick={() => setYears(y)}
                  style={{
                    width:34, height:30, borderRadius:6, fontSize:12, fontWeight:500,
                    border: years === y ? 'none' : `1px solid ${C.border}`,
                    background: years === y ? C.accent : C.bg,
                    color: years === y ? '#fff' : C.ink3,
                    cursor:'pointer', transition:'all 0.1s',
                  }}>
                  {y}y
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Priority */}
          <FilterGroup label="Speed">
            <div style={{ display:'flex', border:`1px solid ${C.border}`, borderRadius:7, overflow:'hidden' }}>
              {([
                { id:'standard', label:'Standard' },
                { id:'priority', label:'Priority +£500' },
                { id:'super',    label:'Super +£1k' },
              ] as const).map((opt) => (
                <button key={opt.id} onClick={() => setPriority(opt.id)}
                  style={{
                    padding:'5px 10px', fontSize:11.5, fontWeight:500,
                    border:'none', cursor:'pointer',
                    background: priority === opt.id ? C.ink : 'transparent',
                    color: priority === opt.id ? '#fff' : C.ink3,
                    transition:'background 0.1s',
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Dependants */}
          <FilterGroup label="Dependants">
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <MiniCounter icon={Users} label="Adults" value={extraAdults}
                min={0} max={4} onChange={setExtraAdults} />
              <MiniCounter icon={Baby} label="Children" value={extraChildren}
                min={0} max={4} onChange={setExtraChildren} />
            </div>
          </FilterGroup>

          {/* Live total */}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'baseline', gap:6,
                        padding:'6px 14px', background:C.accentSoft,
                        border:`1px solid ${C.accent}33`, borderRadius:7 }}>
            <span style={{ fontSize:10, fontWeight:700, color:C.accentDk,
                           letterSpacing:'0.1em', textTransform:'uppercase' }}>Total</span>
            <span style={{ fontSize:18, fontWeight:600, color:C.ink,
                           letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums',
                           fontFamily:mono }}>
              £{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth:1240, margin:'0 auto',
                    padding:'clamp(28px,4vw,48px) clamp(20px,3vw,32px) 80px' }}>
        <div style={{ display:'flex', gap:40, alignItems:'flex-start' }}>

          {/* MAIN */}
          <main style={{ flex:1, minWidth:0 }}>

            {/* 01 ELIGIBILITY */}
            <GuideSection id="eligibility" num="01" title="Eligibility" badge="Requirements">
              {/* Route-specific highlights */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.accentDk,
                              letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>
                  {vr.label} — specific requirements
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {vr.eligibilityHighlights.map((line, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12,
                                          padding:'12px 14px', background:C.okSoft,
                                          border:`1px solid #BFE3D3`, borderRadius:8 }}>
                      <CheckCircle2 size={14} strokeWidth={2} color={C.ok} style={{ flexShrink:0, marginTop:2 }} />
                      <span style={{ fontSize:13.5, lineHeight:1.6, color:C.ink2 }}>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full visa eligibility — expandable */}
              <div style={{ fontSize:11, fontWeight:700, color:C.mid2,
                            letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10, marginTop:20 }}>
                All requirements
              </div>
              <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden' }}>
                {/* header */}
                <div style={{ display:'grid', gridTemplateColumns:'32px 90px 1fr 72px',
                              background:C.bg2, borderBottom:`1px solid ${C.border}`,
                              fontSize:10, fontWeight:700, color:C.mid2, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  <div style={{ padding:'8px 0', textAlign:'center' }}>#</div>
                  <div style={{ padding:'8px 10px' }}>Type</div>
                  <div style={{ padding:'8px 10px' }}>Requirement</div>
                  <div style={{ padding:'8px 10px', textAlign:'right' }}>Status</div>
                </div>
                {visa.eligibility.map((s, i) => {
                  const cls = classifyElig(s);
                  const Icon = cls.icon;
                  const conditional = /unless|or if|optional|may|might|except/i.test(s);
                  const isOpen = expandedElig === i;
                  return (
                    <div key={i}>
                      <button onClick={() => setExpandedElig(isOpen ? null : i)} style={{
                        width:'100%', display:'grid', gridTemplateColumns:'32px 90px 1fr 72px',
                        borderTop: i > 0 ? `1px solid ${C.hair}` : 'none',
                        alignItems:'center', background: isOpen ? C.accentSoft : 'transparent',
                        border:'none', cursor:'pointer', textAlign:'left',
                      }}>
                        <div style={{ padding:'11px 0', textAlign:'center', fontFamily:mono,
                                      fontSize:11, color:C.faint, fontVariantNumeric:'tabular-nums',
                                      borderRight:`1px solid ${C.hair}` }}>
                          {String(i+1).padStart(2,'0')}
                        </div>
                        <div style={{ padding:'11px 10px', borderRight:`1px solid ${C.hair}`,
                                      display:'flex', alignItems:'center', gap:5 }}>
                          <span style={{ width:18, height:18, borderRadius:4, background:`${cls.tone}14`,
                                         color:cls.tone, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                            <Icon size={10} strokeWidth={2.2} />
                          </span>
                          <span style={{ fontSize:10.5, fontWeight:600, color:C.ink2 }}>{cls.label}</span>
                        </div>
                        <div style={{ padding:'11px 10px', fontSize:13, lineHeight:1.45, color:C.ink2, fontWeight:450 }}>
                          {s}
                        </div>
                        <div style={{ padding:'11px 10px', display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6 }}>
                          <span style={{ fontSize:9.5, fontWeight:700,
                                         color: conditional ? C.warn : C.ok,
                                         background: conditional ? C.warnSoft : C.okSoft,
                                         border:`1px solid ${conditional ? '#F5D88B' : '#BFE3D3'}`,
                                         padding:'2px 6px', borderRadius:3,
                                         letterSpacing:'0.06em', textTransform:'uppercase' }}>
                            {conditional ? 'COND' : 'REQ'}
                          </span>
                          <ChevronDown size={12} color={C.faint}
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.15s' }} />
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ padding:'10px 14px 12px 46px', background:C.accentSoft,
                                      borderTop:`1px solid ${C.border}` }}>
                          <div style={{ display:'flex', gap:6, alignItems:'flex-start' }}>
                            <Info size={12} color={C.accentDk} style={{ marginTop:2, flexShrink:0 }} />
                            <p style={{ fontSize:12.5, lineHeight:1.6, color:C.ink3, margin:0 }}>
                              {conditional
                                ? 'This requirement has conditional exceptions — check gov.uk for your specific circumstances.'
                                : 'This requirement applies to all applicants on this route unless explicitly exempt by gov.uk guidance.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GuideSection>

            {/* 02 COSTS */}
            <GuideSection id="costs" num="02" title="Cost breakdown" badge="Live calculation">
              {/* Duration options header */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
                            border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden', marginBottom:16 }}>
                {[3,5].map((y) => {
                  const isCurrent = (years <= 3 && y === 3) || (years > 3 && y === 5);
                  const fee = y <= 3 ? fees.y3 : fees.y5;
                  const ihs = ihsAdult * y;
                  const tot = fee + ihs + priorityFee + depAdultCost + depChildCost;
                  return (
                    <button key={y} onClick={() => setYears(y === 3 ? 3 : 5)}
                      style={{
                        padding:'16px 18px', border:'none', cursor:'pointer',
                        background: isCurrent ? C.accentSoft : C.bg2,
                        borderRight: y === 3 ? `1px solid ${C.border}` : 'none',
                        textAlign:'left', position:'relative',
                      }}>
                      {isCurrent && (
                        <span style={{ position:'absolute', top:10, right:10,
                                       fontSize:9, fontWeight:700, color:C.accentDk,
                                       background:C.bg, border:`1px solid ${C.accent}33`,
                                       padding:'2px 7px', borderRadius:999, letterSpacing:'0.1em' }}>
                          CURRENT
                        </span>
                      )}
                      <div style={{ fontSize:10, fontWeight:700, color:C.mid2,
                                    letterSpacing:'0.12em', textTransform:'uppercase' }}>
                        {y}-Year leave
                      </div>
                      <div style={{ fontSize:26, fontWeight:600, color:C.ink,
                                    letterSpacing:'-0.025em', fontVariantNumeric:'tabular-nums',
                                    marginTop:4, lineHeight:1, fontFamily:mono }}>
                        £{tot.toLocaleString()}
                      </div>
                      <div style={{ display:'flex', height:4, borderRadius:999, overflow:'hidden',
                                    background:C.bg3, marginTop:10 }}>
                        <div style={{ width:`${fee/tot*100}%`, background:C.accent }} />
                        <div style={{ width:`${ihs/tot*100}%`, background:C.accent2 }} />
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10,
                                    color:C.mid, marginTop:5, fontVariantNumeric:'tabular-nums' }}>
                        <span>Fee £{fee.toLocaleString()}</span>
                        <span>IHS £{ihs.toLocaleString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Line items */}
              <div style={{ border:`1px solid ${C.border}`, borderRadius:10, background:C.bg, overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', background:C.bg2, borderBottom:`1px solid ${C.border}`,
                              display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:10, fontWeight:700, color:C.mid2,
                                 letterSpacing:'0.12em', textTransform:'uppercase' }}>
                    Breakdown — {years}y leave, {extraAdults + extraChildren > 0 ? `${extraAdults+extraChildren} dep, ` : ''}{priority}
                  </span>
                  <Link href={`/tools/cost-calculator?visa=${slug}`}
                    style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12,
                             fontWeight:500, color:C.accentDk, border:`1px solid ${C.border}`,
                             padding:'5px 10px', borderRadius:6, textDecoration:'none', background:C.bg }}>
                    <Calculator size={10} strokeWidth={2.2} /> Full calc
                  </Link>
                </div>
                {[
                  { label:'Application fee', val:mainFee, tone:C.accent, req:true,
                    sub:`${years <= 3 ? '≤3yr' : '>3yr'} outside UK` },
                  ...(mainIhs > 0 ? [{ label:'IHS surcharge', val:mainIhs, tone:C.accent2, req:true,
                    sub:`£${ihsAdult}/yr × ${years}y → NHS` }] : []),
                  ...(priorityFee > 0 ? [{ label:`${priority === 'priority' ? 'Priority' : 'Super-priority'} service`,
                    val:priorityFee, tone:C.warn, req:false,
                    sub:priority === 'priority' ? '5-day decision' : 'Next working day' }] : []),
                  ...(extraAdults > 0 ? [{ label:`${extraAdults} adult dependant${extraAdults > 1 ? 's' : ''}`,
                    val:depAdultCost, tone:C.teal, req:false,
                    sub:`fee + IHS × ${years}y each` }] : []),
                  ...(extraChildren > 0 ? [{ label:`${extraChildren} child dependant${extraChildren > 1 ? 's' : ''}`,
                    val:depChildCost, tone:C.pink, req:false,
                    sub:`IHS £${ihsChild}/yr each` }] : []),
                ].map((row, i, arr) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto',
                                        gap:16, padding:'12px 16px',
                                        borderTop: i > 0 ? `1px solid ${C.hair}` : 'none',
                                        alignItems:'center' }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ width:3, height:14, borderRadius:2, background:row.tone, opacity:row.req?1:0.6 }} />
                        <span style={{ fontSize:13, fontWeight:500, color:C.ink }}>
                          {row.label}
                          {!row.req && <span style={{ fontSize:9.5, fontWeight:700, color:row.tone,
                            background:`${row.tone}14`, border:`1px solid ${row.tone}33`,
                            padding:'1px 5px', borderRadius:3, marginLeft:6,
                            letterSpacing:'0.06em', textTransform:'uppercase' }}>OPT</span>}
                        </span>
                      </div>
                      <div style={{ fontSize:10.5, color:C.mid, marginTop:2, paddingLeft:11 }}>{row.sub}</div>
                    </div>
                    <span style={{ fontSize:15, fontWeight:600, color:C.ink,
                                   fontVariantNumeric:'tabular-nums', fontFamily:mono }}>
                      £{row.val.toLocaleString()}
                    </span>
                  </div>
                ))}
                {/* Total row */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:16,
                              padding:'14px 16px', background:C.ink,
                              borderTop:`1px solid ${C.ink2}` }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)',
                                  letterSpacing:'0.1em', textTransform:'uppercase' }}>Total required</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:2 }}>
                      {years}y initial leave · {extraAdults+extraChildren} dependants · {priority}
                    </div>
                  </div>
                  <span style={{ fontSize:22, fontWeight:600, color:'#fff',
                                 fontVariantNumeric:'tabular-nums', fontFamily:mono }}>
                    £{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ marginTop:12, padding:'12px 14px', background:C.bg2,
                            border:`1px solid ${C.border}`, borderRadius:8,
                            display:'flex', gap:8, alignItems:'flex-start' }}>
                <Info size={13} color={C.mid} style={{ marginTop:1, flexShrink:0 }} />
                <p style={{ fontSize:12, lineHeight:1.6, color:C.mid, margin:0 }}>
                  Figures are estimates using gov.uk-verified 2026 rates. Additional costs may include
                  biometrics (£19.20), solicitor fees, translation, and NHS registration.
                  <Link href={`/tools/cost-calculator?visa=${slug}`}
                        style={{ color:C.accentDk, fontWeight:500, marginLeft:4, textDecoration:'none' }}>
                    Open full calculator →
                  </Link>
                </p>
              </div>
            </GuideSection>

            {/* 03 PROCESSING */}
            <GuideSection id="processing" num="03" title="Processing times" badge="Timeframes">
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:1,
                            background:C.border, border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden',
                            marginBottom:16 }}>
                {[
                  { id:'standard', label:'Standard', icon:Clock,
                    time: location === 'outside' ? visa.processing.outside : (isInsideAvailable ? visa.processing.inside : 'N/A — apply from outside'),
                    fee:'Included', tone:C.ok, sub:'included in fee' },
                  { id:'priority', label:'Priority', icon:Zap,
                    time:'5 working days', fee:'+£500', tone:C.warn, sub:'most applications' },
                  { id:'super', label:'Super priority', icon:Zap,
                    time:'Next working day', fee:'+£1,000', tone:C.pink, sub:'24-hour decision' },
                ].map((opt) => {
                  const isActive = priority === opt.id as Priority;
                  return (
                    <button key={opt.id} onClick={() => setPriority(opt.id as Priority)}
                      style={{ background: isActive ? C.ink : C.bg, border:'none', cursor:'pointer',
                               padding:'16px 18px', textAlign:'left' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                        <span style={{ width:30, height:30, borderRadius:7,
                                       background: isActive ? 'rgba(255,255,255,0.1)' : `${opt.tone}14`,
                                       display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                          <opt.icon size={14} strokeWidth={2} color={ isActive ? '#fff' : opt.tone} />
                        </span>
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em',
                                        textTransform:'uppercase', color: isActive ? 'rgba(255,255,255,0.6)' : C.mid2 }}>
                            {opt.label}
                          </div>
                          {isActive && (
                            <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.4)',
                                          letterSpacing:'0.1em', textTransform:'uppercase' }}>● SELECTED</div>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.02em',
                                    color: isActive ? '#fff' : C.ink, fontVariantNumeric:'tabular-nums',
                                    lineHeight:1.2, marginBottom:4 }}>
                        {opt.time}
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color: isActive ? opt.tone : opt.tone,
                                    fontVariantNumeric:'tabular-nums' }}>
                        {opt.fee}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Inside/outside comparison */}
              {isInsideAvailable && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1,
                              background:C.border, border:`1px solid ${C.border}`,
                              borderRadius:10, overflow:'hidden' }}>
                  {[
                    { id:'outside' as Location, label:'Outside UK', icon:Plane, tone:C.accent,
                      time:visa.processing.outside, sub:'Fresh application from abroad' },
                    { id:'inside' as Location, label:'Inside UK — switch', icon:Globe2, tone:C.ok,
                      time:visa.processing.inside, sub:'Extend or switch from another visa' },
                  ].map((opt) => (
                    <button key={opt.id} onClick={() => setLocation(opt.id)}
                      style={{ background: location === opt.id ? C.bg2 : C.bg,
                               border:'none', cursor:'pointer', padding:'14px 16px', textAlign:'left' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                        <span style={{ width:26, height:26, borderRadius:6,
                                       background:`${opt.tone}14`, color:opt.tone,
                                       display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
                          <opt.icon size={12} strokeWidth={2} />
                        </span>
                        <span style={{ fontSize:11, fontWeight:700, color:opt.tone,
                                       letterSpacing:'0.08em', textTransform:'uppercase' }}>
                          {opt.label}
                        </span>
                        {location === opt.id && (
                          <span style={{ marginLeft:'auto', fontSize:9, fontWeight:700, color:opt.tone,
                                         background:`${opt.tone}14`, border:`1px solid ${opt.tone}33`,
                                         padding:'2px 7px', borderRadius:999, letterSpacing:'0.1em' }}>
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize:18, fontWeight:600, color:C.ink, marginBottom:3 }}>
                        {opt.time}
                      </div>
                      <div style={{ fontSize:11, color:C.mid }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              )}
            </GuideSection>

            {/* 04 HOW TO APPLY */}
            <GuideSection id="journey" num="04" title="How to apply" badge={`${visa.steps.length} steps`}>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {visa.steps.map((step, i) => {
                  const colors = [C.accent, C.teal, C.ok, C.warn, C.pink, C.accent2];
                  const tone = colors[i % colors.length];
                  return (
                    <div key={i} style={{ display:'flex', gap:16, paddingBottom: i < visa.steps.length-1 ? 24 : 0,
                                          position:'relative' }}>
                      {/* Line */}
                      {i < visa.steps.length - 1 && (
                        <div style={{ position:'absolute', left:18, top:36, bottom:0,
                                      width:1, background:C.border }} />
                      )}
                      {/* Circle */}
                      <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0,
                                    background:`${tone}14`, border:`2px solid ${tone}44`,
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    zIndex:1, position:'relative' }}>
                        <span style={{ fontSize:11, fontWeight:700, color:tone,
                                       fontFamily:mono }}>{i+1}</span>
                      </div>
                      <div style={{ flex:1, paddingTop:6 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:C.ink, marginBottom:4 }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize:12.5, lineHeight:1.65, color:C.mid }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Documents needed */}
              <div style={{ marginTop:24, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.mid2,
                              letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>
                  Documents you&apos;ll need
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:6 }}>
                  {visa.documents.slice(0, 12).map((d, i) => {
                    const Icon = docIcon(d);
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:10,
                                            padding:'9px 12px', border:`1px solid ${C.border}`,
                                            borderRadius:7, background:C.bg,
                                            fontSize:12.5, lineHeight:1.35, color:C.ink2 }}>
                        <span style={{ color:C.accent, flexShrink:0, width:22, height:22, borderRadius:5,
                                       background:C.accentSoft, display:'inline-flex',
                                       alignItems:'center', justifyContent:'center' }}>
                          <Icon size={12} strokeWidth={2} />
                        </span>
                        <span>{d.replace(/\(.*?\)/g,'').trim().length > 52
                          ? d.replace(/\(.*?\)/g,'').trim().slice(0,51) + '…'
                          : d.replace(/\(.*?\)/g,'').trim()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GuideSection>

            {/* 05 APPLY */}
            <GuideSection id="apply" num="05" title="Apply now" badge="gov.uk official">
              {/* Before you apply checklist */}
              <div style={{ marginBottom:20, padding:'16px 18px',
                            background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.mid2,
                              letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>
                  Before you click apply — confirm you have:
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', gap:8 }}>
                  {[
                    'Valid passport (must not expire during your visa)',
                    'Certificate of Sponsorship (CoS) reference number',
                    'Bank statements showing maintenance funds (28 days)',
                    'English language evidence (SELT, degree, or nationality)',
                    'Biometrics appointment (UKVCAS / VAC if outside UK)',
                    'All supporting documents scanned and ready to upload',
                  ].map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8,
                                          fontSize:12.5, lineHeight:1.5, color:C.ink2 }}>
                      <div style={{ width:18, height:18, borderRadius:4, border:`1.5px solid ${C.border}`,
                                    background:C.bg, flexShrink:0, marginTop:1 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary CTA */}
              <div style={{ background:C.ink, borderRadius:12, padding:'28px 28px',
                            display:'flex', justifyContent:'space-between', alignItems:'center',
                            gap:24, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)',
                                letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:6 }}>
                    Official application
                  </div>
                  <div style={{ fontSize:22, fontWeight:600, color:'#fff',
                                letterSpacing:'-0.02em', marginBottom:6 }}>
                    Apply for {vr.label}
                  </div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:12 }}>
                    Redirects to gov.uk — no agent, no fees, official Home Office form
                  </div>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    <span style={{ fontSize:10.5, fontWeight:600, color:C.ok,
                                   background:'rgba(8,133,93,0.15)', border:'1px solid rgba(8,133,93,0.3)',
                                   padding:'3px 8px', borderRadius:5 }}>
                      ✓ gov.uk verified
                    </span>
                    <span style={{ fontSize:10.5, fontWeight:600, color:'rgba(255,255,255,0.5)',
                                   background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
                                   padding:'3px 8px', borderRadius:5 }}>
                      Updated {visa.updated ?? 'April 2026'}
                    </span>
                  </div>
                </div>
                <a href={visa.applyUrl} target="_blank" rel="noopener noreferrer"
                   style={{ display:'inline-flex', alignItems:'center', gap:8,
                            background:'#fff', color:C.ink, fontSize:15, fontWeight:600,
                            padding:'13px 22px', borderRadius:10, textDecoration:'none',
                            boxShadow:'0 2px 8px rgba(0,0,0,0.2)', whiteSpace:'nowrap' }}>
                  Apply on gov.uk <ExternalLink size={15} strokeWidth={2} />
                </a>
              </div>
            </GuideSection>

            {/* 06 CONDITIONS (if notes exist) */}
            {vr.notes && vr.notes.length > 0 && (
              <GuideSection id="conditions" num="06" title="Conditions & restrictions" badge="Important">
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {vr.notes.map((note, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12,
                                          padding:'13px 16px', background:C.warnSoft,
                                          border:`1px solid #F5D88B`, borderRadius:8 }}>
                      <AlertTriangle size={14} strokeWidth={2} color={C.warn} style={{ flexShrink:0, marginTop:2 }} />
                      <span style={{ fontSize:13.5, lineHeight:1.6, color:C.ink2 }}>{note}</span>
                    </div>
                  ))}
                  {visa.notes && visa.notes.map((note, i) => (
                    <div key={`v-${i}`} style={{ display:'flex', alignItems:'flex-start', gap:12,
                                                  padding:'13px 16px', background:C.bg2,
                                                  border:`1px solid ${C.border}`, borderRadius:8 }}>
                      <Info size={14} strokeWidth={2} color={C.mid} style={{ flexShrink:0, marginTop:2 }} />
                      <span style={{ fontSize:13.5, lineHeight:1.6, color:C.ink3 }}>{note}</span>
                    </div>
                  ))}
                </div>
              </GuideSection>
            )}

            {/* OTHER ROUTES */}
            {otherVariants.length > 0 && (
              <GuideSection id="routes" num={vr.notes && vr.notes.length > 0 ? '07' : '06'}
                title="Other sub-routes" badge={`${otherVariants.length} more`}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:10 }}>
                  {otherVariants.map((o) => (
                    <Link key={o.id} href={`/visa-types/${slug}/${o.id}`}
                      style={{ display:'block', padding:'14px 16px',
                               border:`1px solid ${C.border}`, borderRadius:9,
                               background:C.bg, textDecoration:'none' }}
                      className="hover:border-[#6366F1] hover:bg-[#EFEEFF]">
                      <div style={{ fontSize:10, fontWeight:700, color:C.mid2,
                                    letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>
                        Sub-route
                      </div>
                      <div style={{ fontSize:14.5, fontWeight:600, color:C.ink,
                                    letterSpacing:'-0.015em', marginBottom:4 }}>
                        {o.label}
                      </div>
                      <div style={{ fontSize:12, color:C.mid, marginBottom:10 }}>{o.headline}</div>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {o.feeAmount && (
                          <span style={{ fontSize:10, fontWeight:600, color:C.accentDk,
                            background:C.accentSoft, border:`1px solid ${C.accent}33`,
                            padding:'2px 7px', borderRadius:4 }}>£{o.feeAmount.toLocaleString()}</span>
                        )}
                        {o.duration && (
                          <span style={{ fontSize:10, color:C.mid,
                            background:C.bg3, border:`1px solid ${C.border}`,
                            padding:'2px 7px', borderRadius:4 }}>{o.duration.split(/[·(]/)[0].trim()}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </GuideSection>
            )}
          </main>

          {/* SIDEBAR */}
          <aside className="hidden lg:block" style={{ width:228, flexShrink:0 }}>
            <div className="sticky" style={{ top:130 }}>
              {/* Live cost panel */}
              <div style={{ background:C.ink, borderRadius:10, padding:'18px 16px', marginBottom:16 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)',
                              letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>
                  Your total estimate
                </div>
                <div style={{ fontSize:28, fontWeight:600, color:'#fff', letterSpacing:'-0.03em',
                              fontVariantNumeric:'tabular-nums', fontFamily:mono, lineHeight:1 }}>
                  £{total.toLocaleString()}
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4, marginBottom:14 }}>
                  {years}y · {priority} · {extraAdults+extraChildren > 0 ? `${extraAdults+extraChildren} dep` : 'no dep'}
                </div>
                {/* Mini breakdown */}
                {[
                  { label:'Fee',      val:mainFee,          show:true },
                  { label:`IHS (${years}y)`, val:mainIhs,   show:mainIhs > 0 },
                  { label:'Priority', val:priorityFee,      show:priorityFee > 0 },
                  { label:'Dependants', val:depAdultCost+depChildCost, show:depAdultCost+depChildCost > 0 },
                ].filter(r => r.show).map((r, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between',
                                        fontSize:11.5, padding:'5px 0',
                                        borderTop:`1px solid rgba(255,255,255,0.06)` }}>
                    <span style={{ color:'rgba(255,255,255,0.45)' }}>{r.label}</span>
                    <span style={{ color:'rgba(255,255,255,0.7)', fontVariantNumeric:'tabular-nums',
                                   fontFamily:mono }}>£{r.val.toLocaleString()}</span>
                  </div>
                ))}
                <a href={visa.applyUrl} target="_blank" rel="noopener noreferrer"
                   style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                            marginTop:14, background:'#fff', color:C.ink,
                            fontSize:12.5, fontWeight:600, padding:'10px',
                            borderRadius:7, textDecoration:'none' }}>
                  Apply on gov.uk <ExternalLink size={12} />
                </a>
              </div>

              {/* Section nav */}
              <div style={{ fontSize:10, fontWeight:700, color:C.mid2, letterSpacing:'0.16em',
                            textTransform:'uppercase', marginBottom:10, paddingLeft:14 }}>
                Sections
              </div>
              <nav style={{ display:'flex', flexDirection:'column' }}>
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                     style={{ fontSize:12.5, color:C.mid, textDecoration:'none',
                              padding:'7px 14px', borderLeft:`1px solid ${C.border}`,
                              display:'flex', alignItems:'center', gap:10 }}
                     className="hover:text-[#0A0F1F] hover:border-l-[#6366F1] hover:bg-[#FAFBFC]">
                    <span style={{ fontSize:10, color:C.faint, minWidth:16, fontWeight:600, fontFamily:mono }}>
                      {s.num}
                    </span>
                    {s.label}
                  </a>
                ))}
              </nav>

              {/* Source */}
              <a href={vr.source} target="_blank" rel="noopener noreferrer"
                 style={{ display:'block', marginTop:20, padding:'12px 14px',
                          background:C.bg2, border:`1px solid ${C.border}`,
                          borderRadius:9, textDecoration:'none' }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.ok,
                              letterSpacing:'0.1em', textTransform:'uppercase',
                              display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
                  <ShieldCheck size={10} strokeWidth={2} /> GOV.UK SOURCE
                </div>
                <div style={{ fontSize:11.5, color:C.mid, lineHeight:1.5 }}>
                  Verified against gov.uk {visa.updated ?? 'April 2026'}
                </div>
                <div style={{ fontSize:11, color:C.accentDk, marginTop:6,
                              display:'flex', alignItems:'center', gap:4 }}>
                  Open source <ExternalLink size={10} />
                </div>
              </a>
            </div>
          </aside>
        </div>
      </div>

      <StickyMobileCta href={visa.applyUrl} label={`Apply — ${vr.label}`} />
    </div>
  );
}

/* ── Local helpers ── */

type EligKind = 'finance' | 'lang' | 'sponsor' | 'skill' | 'identity' | 'other';
function classifyElig(s: string): { kind: EligKind; label: string; tone: string; icon: React.ComponentType<{size?:number;strokeWidth?:number;color?:string}> } {
  const l = s.toLowerCase();
  if (/£|salary|fund|bank|maintenance|saving|income|wage/.test(l))
    return { kind:'finance', label:'Finance', tone:C.ok, icon:CreditCard };
  if (/english|b1|b2|ielts|selt|language/.test(l))
    return { kind:'lang', label:'Language', tone:C.teal, icon:Languages };
  if (/sponsor|cas|cos|licensed|certificate of/.test(l))
    return { kind:'sponsor', label:'Sponsor', tone:C.warn, icon:FileSignature2 };
  if (/qualif|degree|rqf|skill|going rate|atas|phd|profession/.test(l))
    return { kind:'skill', label:'Skill', tone:C.accent, icon:BadgeCheck };
  if (/passport|biometric|age|under 18|nationality|consent/.test(l))
    return { kind:'identity', label:'Identity', tone:C.pink, icon:Fingerprint };
  return { kind:'other', label:'Rule', tone:C.mid, icon:Info };
}

function KpiTile({ label, value, sub, tone, border }: { label:string; value:string; sub:string; tone?:string; border?:boolean }) {
  return (
    <div style={{ padding:'11px 13px', borderLeft: border ? `1px solid ${C.border}` : 'none', background:C.bg }}>
      <div style={{ fontSize:10, fontWeight:700, color:C.mid2, letterSpacing:'0.1em',
                    textTransform:'uppercase', marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:16, fontWeight:600, color: tone ?? C.ink,
                    letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, color:C.faint, marginTop:3 }}>{sub}</div>
    </div>
  );
}

function FilterGroup({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      <span style={{ fontSize:9.5, fontWeight:700, color:C.mid2,
                     letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</span>
      {children}
    </div>
  );
}

function MiniCounter({ icon:Icon, label, value, min, max, onChange }:{
  icon:React.ComponentType<{size?:number;strokeWidth?:number;color?:string}>;
  label:string; value:number; min:number; max:number; onChange:(v:number)=>void;
}) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <span style={{ fontSize:10, color:C.mid }}>{label}</span>
      <button onClick={() => onChange(Math.max(min, value-1))}
        style={{ width:22, height:22, borderRadius:5, border:`1px solid ${C.border}`,
                 background:C.bg, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Minus size={9} strokeWidth={2.5} color={C.ink3} />
      </button>
      <span style={{ fontSize:13, fontWeight:600, color:C.ink, minWidth:14, textAlign:'center',
                     fontVariantNumeric:'tabular-nums' }}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value+1))}
        style={{ width:22, height:22, borderRadius:5, border:`1px solid ${C.border}`,
                 background:C.bg, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Plus size={9} strokeWidth={2.5} color={C.ink3} />
      </button>
    </div>
  );
}

function GuideSection({ id, num, title, badge, children }: {
  id:string; num:string; title:string; badge?:string; children:React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-40" style={{ marginBottom:52 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between',
                    gap:12, marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
          <span style={{ fontFamily:mono, fontSize:11, fontWeight:500, color:C.faint }}>{num}</span>
          <h2 style={{ fontSize:19, fontWeight:600, color:C.ink, letterSpacing:'-0.02em', margin:0 }}>{title}</h2>
        </div>
        {badge && (
          <span style={{ fontSize:10.5, color:C.mid, background:C.bg3, border:`1px solid ${C.border}`,
                         padding:'3px 8px', borderRadius:4, whiteSpace:'nowrap' }}>{badge}</span>
        )}
      </div>
      {children}
    </section>
  );
}
