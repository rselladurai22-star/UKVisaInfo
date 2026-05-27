'use client';

import { useState, useEffect } from 'react';
import {
  SlidersHorizontal, Check, Sparkles, Globe,
  RefreshCw, Coins, Download, Share2, CheckCircle, Save,
} from 'lucide-react';

/* ─── Types ─── */
type Region = 'England' | 'Scotland' | 'Wales';

interface BuyerProfileState {
  isFirstTimeBuyer: boolean;
  isAdditionalProperty: boolean;
  isNonUKResident: boolean;
  propertyType?: 'residential' | 'non-residential';
  sharedOwnershipPercent?: number;
  isCouncilRightToBuy?: boolean;
}

interface SavedCalcItem {
  id: string;
  name: string;
  timestamp: string;
  price: number;
  region: Region;
  profile: BuyerProfileState;
  taxAmount: number;
}

interface TaxBandBreakdown {
  name: string;
  rate: number;
  minLimit: number;
  maxLimit: number | null;
  taxableAmountInBand: number;
  taxPaidInBand: number;
  description: string;
}

interface CalcResult {
  totalTax: number;
  effectiveRate: number;
  bands: TaxBandBreakdown[];
  propertyPrice: number;
  region: Region;
  profile: BuyerProfileState;
}

/* ─── Band tables ─── */
const ENGLAND_BANDS    = [{m:0,x:250000,r:0},{m:250000,x:925000,r:.05},{m:925000,x:1500000,r:.10},{m:1500000,x:null,r:.12}];
const ENGLAND_FTB      = [{m:0,x:300000,r:0},{m:300000,x:500000,r:.05},{m:500000,x:925000,r:.05},{m:925000,x:1500000,r:.10},{m:1500000,x:null,r:.12}];
const SCOTLAND_BANDS   = [{m:0,x:145000,r:0},{m:145000,x:250000,r:.02},{m:250000,x:325000,r:.05},{m:325000,x:750000,r:.10},{m:750000,x:null,r:.12}];
const SCOTLAND_FTB     = [{m:0,x:175000,r:0},{m:175000,x:250000,r:.02},{m:250000,x:325000,r:.05},{m:325000,x:750000,r:.10},{m:750000,x:null,r:.12}];
const WALES_BANDS      = [{m:0,x:225000,r:0},{m:225000,x:400000,r:.06},{m:400000,x:750000,r:.075},{m:750000,x:1500000,r:.10},{m:1500000,x:null,r:.12}];
const ENG_NR_BANDS     = [{m:0,x:150000,r:0},{m:150000,x:250000,r:.02},{m:250000,x:null,r:.05}];
const SCO_NR_BANDS     = [{m:0,x:150000,r:0},{m:150000,x:250000,r:.01},{m:250000,x:null,r:.05}];
const WAL_NR_BANDS     = [{m:0,x:225000,r:0},{m:225000,x:250000,r:.01},{m:250000,x:1000000,r:.05},{m:1000000,x:null,r:.06}];

function calcSDLT(price: number, region: Region, profile: BuyerProfileState): CalcResult {
  const share = profile.sharedOwnershipPercent ?? 100;
  const tp = (price * share) / 100;
  const isNonRes = profile.propertyType === 'non-residential';
  let sr = 0;
  let rawBands: {m:number;x:number|null;r:number}[];

  if (region === 'England') {
    rawBands = isNonRes ? ENG_NR_BANDS : (profile.isFirstTimeBuyer && tp <= 500000 ? ENGLAND_FTB : ENGLAND_BANDS);
    if (!isNonRes) { if (profile.isAdditionalProperty) sr += .05; if (profile.isNonUKResident) sr += .02; }
  } else if (region === 'Scotland') {
    rawBands = isNonRes ? SCO_NR_BANDS : (profile.isFirstTimeBuyer ? SCOTLAND_FTB : SCOTLAND_BANDS);
    if (!isNonRes) { if (profile.isAdditionalProperty) sr += .08; if (profile.isNonUKResident) sr += .02; }
  } else {
    rawBands = isNonRes ? WAL_NR_BANDS : WALES_BANDS;
    if (!isNonRes) { if (profile.isAdditionalProperty) sr += .04; if (profile.isNonUKResident) sr += .02; }
  }

  const breakdowns: TaxBandBreakdown[] = [];
  let calculatedTax = 0;

  rawBands.forEach((band, i) => {
    const { m: min, x: max, r: rate } = band;
    const totalRate = rate + sr;
    const rLabel = `${((totalRate)*100)%1===0 ? (totalRate*100).toFixed(0) : (totalRate*100).toFixed(1)}%`;
    if (tp > min) {
      const span = max === null ? tp - min : Math.min(tp - min, max - min);
      const tax = span * totalRate;
      calculatedTax += tax;
      const minStr = min >= 1e6 ? `\u00a3${(min/1e6).toFixed(1)}m` : `\u00a3${min.toLocaleString()}`;
      const maxStr = max === null ? '+' : max >= 1e6 ? `\u2013\u00a3${(max/1e6).toFixed(1)}m` : `\u2013\u00a3${(max/1000).toFixed(0)}k`;
      breakdowns.push({ name: `Band ${i+1} \u00b7 ${rLabel}`, rate: totalRate, minLimit: min, maxLimit: max, taxableAmountInBand: span, taxPaidInBand: tax, description: `${minStr}${maxStr} \u00b7 \u00a3${span.toLocaleString()}` });
    } else {
      breakdowns.push({ name: `Band ${i+1} \u00b7 ${rLabel}`, rate: totalRate, minLimit: min, maxLimit: max, taxableAmountInBand: 0, taxPaidInBand: 0, description: `${min >= 1e6 ? `\u00a3${(min/1e6).toFixed(1)}m` : `\u00a3${min.toLocaleString()}`}${max === null ? '+' : max >= 1e6 ? `\u2013\u00a3${(max/1e6).toFixed(1)}m` : `\u2013\u00a3${(max/1000).toFixed(0)}k`} \u00b7 \u00a30` });
    }
  });

  return { totalTax: calculatedTax, effectiveRate: tp > 0 ? (calculatedTax / tp) * 100 : 0, bands: breakdowns, propertyPrice: price, region, profile };
}

const getTaxLabel = (r: Region) => r === 'England' ? 'SDLT' : r === 'Scotland' ? 'LBTT' : 'LTT';

/* ═══════════════════════════════════
   ROOT
═══════════════════════════════════ */
export default function SdltClient({ initialPrice = 350000 }: { initialPrice?: number }) {
  const [price, setPrice]   = useState(initialPrice);
  const [region, setRegion] = useState<Region>('England');
  const [profile, setProfile] = useState<BuyerProfileState>({
    isFirstTimeBuyer: false, isAdditionalProperty: false, isNonUKResident: false,
  });
  const [savedList, setSavedList] = useState<SavedCalcItem[]>([]);

  useEffect(() => {
    try { setSavedList(JSON.parse(localStorage.getItem('taxcalc_saved_quotes') ?? '[]')); } catch { /* noop */ }
  }, []);

  useEffect(() => {
    localStorage.setItem('taxcalc_saved_quotes', JSON.stringify(savedList));
  }, [savedList]);

  const result = calcSDLT(price, region, profile);

  const handleSave = (name?: string) => {
    const ts = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    setSavedList(prev => [{ id: crypto.randomUUID(), name: name || `Quote: \u00a3${price.toLocaleString()} (${region})`, timestamp: ts, price, region, profile: { ...profile }, taxAmount: result.totalTax }, ...prev]);
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen" style={{ fontFamily: "'Hanken Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* Hero — large, centered, prominent */}
      <section className="text-center max-w-4xl mx-auto pt-10 md:pt-16 pb-6 md:pb-10 px-4">
        <div className="inline-flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-blue-600 font-black mb-5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          LIVE 2026 RATES &middot; SDLT &middot; LBTT &middot; LTT
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] uppercase">
          CALCULATE UK<br className="sm:hidden" /> <span className="text-blue-600">STAMP DUTY</span>
        </h1>
        <p className="text-sm md:text-base font-medium text-slate-500 mt-5 max-w-2xl mx-auto leading-relaxed">
          The most precise SDLT, LBTT and LTT calculator. Every UK buyer scenario, live what-if comparisons, full transparency.
        </p>
      </section>

      {/* 3-Column grid */}
      <div className="w-full max-w-[1440px] xl:max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
          <div className="lg:col-span-4 xl:col-span-3">
            <SidebarInputs
              price={price} setPrice={setPrice}
              region={region} setRegion={setRegion}
              profile={profile} setProfile={setProfile}
            />
          </div>
          <div className="lg:col-span-4">
            <TaxBreakdown result={result} />
          </div>
          <div className="lg:col-span-4 xl:col-span-5">
            <ScenarioComparison
              currentResult={result}
              onSave={handleSave}
              onApplyProfile={(ftb, add) => setProfile({ isFirstTimeBuyer: ftb, isAdditionalProperty: add, isNonUKResident: false })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   SIDEBAR INPUTS
═══════════════════════════════════ */
function SidebarInputs({ price, setPrice, region, setRegion, profile, setProfile }: {
  price: number; setPrice: (p: number) => void;
  region: Region; setRegion: (r: Region) => void;
  profile: BuyerProfileState; setProfile: (p: BuyerProfileState) => void;
}) {
  const [inputVal, setInputVal] = useState(price.toLocaleString());
  const [advOpen, setAdvOpen]   = useState(false);

  const handlePriceChange = (n: number) => {
    const v = Math.max(0, n);
    setPrice(v);
    setInputVal(v.toLocaleString());
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    const num = cleaned ? parseInt(cleaned, 10) : 0;
    setPrice(num);
    setInputVal(num.toLocaleString());
  };

  const toggleProfile = (key: keyof BuyerProfileState) => {
    const updated = { ...profile, [key]: !(profile as unknown as Record<string,unknown>)[key] } as BuyerProfileState;
    if (key === 'isFirstTimeBuyer' && updated.isFirstTimeBuyer)   updated.isAdditionalProperty = false;
    if (key === 'isAdditionalProperty' && updated.isAdditionalProperty) updated.isFirstTimeBuyer = false;
    setProfile(updated);
  };

  const surchargeLabel = region === 'Scotland' ? '+8% Surcharge' : region === 'Wales' ? '+4% Surcharge' : '+5% Surcharge';
  const ftbLabel       = region === 'Scotland' ? '0% up to \u00a3175k' : region === 'Wales' ? 'Standard rates apply' : '0% up to \u00a3425k';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-100/40 flex flex-col h-full overflow-hidden">
      {/* Strip header */}
      <div className="flex justify-between items-center bg-slate-50 px-5 py-4 border-b border-slate-200">
        <h2 className="font-extrabold text-[11px] uppercase tracking-[0.2em] text-slate-800">Your Purchase</h2>
        <button onClick={() => handlePriceChange(850000)} className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-[10px] tracking-wider uppercase font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm cursor-pointer">
          <SlidersHorizontal className="w-3 h-3 text-blue-600" />
          <span>Optimize</span>
        </button>
      </div>

      <div className="px-5 md:px-6 py-5 md:py-6 flex flex-col gap-6">
        {/* Step 01 — Price */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StepBadge n="01" active />
              <span className="text-[10px] font-bold text-slate-500 tracking-[0.12em] uppercase">PROPERTY PRICE</span>
            </div>
            <button onClick={() => handlePriceChange(850000)} className="text-[10px] font-bold uppercase text-blue-600 hover:text-blue-700 cursor-pointer transition-colors tracking-wide">
              Reset &#x00a3;850k
            </button>
          </div>
          <div className="flex items-baseline gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <span className="font-mono font-bold text-slate-400 text-xl">&#x00a3;</span>
            <input
              type="text"
              value={inputVal}
              onChange={handleInput}
              onBlur={() => setInputVal(price.toLocaleString())}
              className="bg-transparent font-mono font-bold text-2xl sm:text-3xl text-blue-600 border-none focus:outline-none focus:ring-0 p-0 w-full tracking-tight"
              placeholder="0"
            />
          </div>
          <div className="pt-1">
            <input
              type="range" min="10000" max="2500000" step="5000" value={price}
              onChange={e => handlePriceChange(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-2 font-mono uppercase tracking-wider">
              <span>&#x00a3;250k</span><span>&#x00a3;750k</span><span>&#x00a3;1.25m</span><span>&#x00a3;2.5m</span>
            </div>
          </div>
        </div>

        {/* Step 02 — Region */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <StepBadge n="02" active={false} />
            <span className="text-[10px] font-bold text-slate-500 tracking-[0.12em] uppercase">TAX REGION</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['England','Scotland','Wales'] as Region[]).map(r => (
              <button key={r} onClick={() => setRegion(r)}
                className={`py-2.5 px-1 rounded-xl text-[10px] font-extrabold flex flex-col items-center border transition-all cursor-pointer ${region===r ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                <span className="uppercase tracking-wider">{r}</span>
                <span className={`text-[9px] mt-0.5 font-mono ${region===r ? 'opacity-80' : 'text-slate-400'}`}>{r==='England' ? 'SDLT' : r==='Scotland' ? 'LBTT' : 'LTT'}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Active: <strong className="text-slate-800 font-bold uppercase">{region} {getTaxLabel(region)}</strong></span>
          </div>
        </div>

        {/* Step 03 — Buyer Profile */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <StepBadge n="03" active={false} />
            <span className="text-[10px] font-bold text-slate-500 tracking-[0.12em] uppercase">BUYER PROFILE</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <ProfileCard checked={profile.isFirstTimeBuyer}    onClick={() => toggleProfile('isFirstTimeBuyer')}    color="blue"  label="First-time Buyer"    sub={ftbLabel} />
            <ProfileCard checked={profile.isAdditionalProperty} onClick={() => toggleProfile('isAdditionalProperty')} color="amber" label="Additional Property"  sub={surchargeLabel} badge="2nd Home" />
            <ProfileCard checked={profile.isNonUKResident}     onClick={() => toggleProfile('isNonUKResident')}     color="red"   label="Non-UK Resident"     sub="+2% surcharge across all bands" icon={<Globe className="w-3 h-3 text-red-500" />} />
          </div>
        </div>

        {/* Advanced */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          <button onClick={() => setAdvOpen(v => !v)}
            className="w-full flex justify-between items-center bg-slate-50 hover:bg-slate-100 px-4 py-3 rounded-xl border border-slate-200 cursor-pointer transition-colors text-[11px] font-extrabold uppercase tracking-widest text-slate-700">
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-600" /><span>Advanced Scenarios</span></span>
            <span className="text-blue-600 text-[10px] font-mono">{advOpen ? 'HIDE \u25b2' : 'SHOW \u25bc'}</span>
          </button>

          {advOpen && (
            <div className="flex flex-col gap-4 p-4 bg-slate-50/60 rounded-2xl border border-slate-200">
              {/* Property type */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-bold tracking-[0.1em] text-slate-400 uppercase">Property Category</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['residential','non-residential'] as const).map(t => (
                    <button key={t} onClick={() => setProfile({...profile, propertyType: t})}
                      className={`py-2 px-1 rounded-lg text-[10px] font-extrabold uppercase border transition-all cursor-pointer ${(profile.propertyType ?? 'residential')===t ? 'bg-white border-blue-400 text-blue-600 shadow-sm' : 'bg-transparent text-slate-500 border-slate-200 hover:bg-white'}`}>
                      {t==='residential' ? 'Residential' : 'Commercial'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Shared ownership */}
              <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-[0.1em] text-slate-400 uppercase">Shared Ownership</span>
                  <span className="text-[10px] font-mono font-bold text-blue-600">{profile.sharedOwnershipPercent ?? 100}% Share</span>
                </div>
                <input type="range" min="10" max="100" step="5" value={profile.sharedOwnershipPercent ?? 100}
                  onChange={e => setProfile({...profile, sharedOwnershipPercent: parseInt(e.target.value, 10)})}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                <div className="flex justify-between text-[8px] text-slate-400 font-mono"><span>10%</span><span>50%</span><span>100%</span></div>
                {(profile.sharedOwnershipPercent ?? 100) < 100 && (
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-[10px] text-blue-700 font-mono uppercase tracking-wider">
                    Taxable: &#x00a3;{((price * (profile.sharedOwnershipPercent ?? 100)) / 100).toLocaleString()}
                  </div>
                )}
              </div>
              {/* Right to Buy */}
              <div onClick={() => setProfile({...profile, isCouncilRightToBuy: !profile.isCouncilRightToBuy})}
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer ${profile.isCouncilRightToBuy ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${profile.isCouncilRightToBuy ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                  {profile.isCouncilRightToBuy && <Check className="w-3 h-3 stroke-[3px]" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wide">Right To Buy Scheme</span>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">Calculated on discounted net council price.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   TAX BREAKDOWN
═══════════════════════════════════ */
function TaxBreakdown({ result }: { result: CalcResult }) {
  const { totalTax, effectiveRate, bands, propertyPrice, region, profile } = result;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pctOfMax = Math.min(100, (effectiveRate / 15) * 100);
  const dashOffset = circ - (pctOfMax / 100) * circ;
  const hasSurcharge = profile.isAdditionalProperty || profile.isNonUKResident;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-100/40 p-5 md:p-6 flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-extrabold text-[11px] uppercase tracking-[0.2em] text-slate-800">Tax Breakdown</h2>
          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-blue-500" style={{animation:'spin 6s linear infinite'}} />
            Updated live for 2026
          </span>
        </div>
        <div className="bg-blue-50 px-2.5 py-1 rounded-lg text-[10px] tracking-wider uppercase font-bold text-blue-700 flex items-center gap-1 border border-blue-100">
          <Coins className="w-3.5 h-3.5 text-blue-600" />
          <span>Tiers</span>
        </div>
      </div>

      {/* Donut */}
      <div className="flex flex-col items-center py-4">
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={r} className="stroke-slate-100 fill-none" strokeWidth="11" />
            <circle cx="80" cy="80" r={r} fill="none" stroke={hasSurcharge ? '#f59e0b' : '#2563EB'} strokeWidth="11"
              strokeDasharray={circ} strokeDashoffset={totalTax > 0 ? dashOffset : circ}
              strokeLinecap="round" style={{transition:'stroke-dashoffset 0.5s ease-out'}} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">TOTAL {getTaxLabel(region)}</span>
            <span className="font-mono font-black text-slate-800 text-xl sm:text-2xl leading-none my-1.5">
              &#x00a3;{totalTax.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})}
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase">{effectiveRate.toFixed(2)}%</span>
            <span className="text-[9px] text-slate-400 lowercase">effective rate</span>
          </div>
        </div>
      </div>

      {/* Shared ownership notice */}
      {(profile.sharedOwnershipPercent ?? 100) < 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 flex items-start gap-2.5">
          <span className="text-amber-500 font-extrabold mt-0.5 shrink-0">&#x24D8;</span>
          <div>
            <p className="font-bold uppercase tracking-wider text-[9px] text-amber-700 mb-0.5">Shared Ownership Active</p>
            <p className="font-mono text-[10px]">
              {profile.sharedOwnershipPercent}% share &#x00a3;{((propertyPrice*(profile.sharedOwnershipPercent??100))/100).toLocaleString()} of &#x00a3;{propertyPrice.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Band list */}
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-500 tracking-[0.12em] uppercase font-bold">BY TAX BAND</span>
          <span className="text-slate-400 font-mono uppercase text-[9px]">{bands.filter(b=>b.taxPaidInBand>0).length} active</span>
        </div>
        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-0.5">
          {bands.map((band, idx) => {
            const active = band.taxPaidInBand > 0;
            return (
              <div key={idx} className={`rounded-xl p-3 flex justify-between items-center border transition-all ${active ? 'bg-blue-50/40 border-blue-100' : 'bg-slate-50/40 border-slate-100/70 opacity-50'}`}>
                <div className="flex flex-col pr-2">
                  <span className={`font-bold text-xs uppercase tracking-wide ${active ? 'text-slate-800' : 'text-slate-400'}`}>{band.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">{band.description}</span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className={`font-mono font-bold text-xs ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                    &#x00a3;{band.taxPaidInBand.toLocaleString(undefined,{maximumFractionDigits:0})}
                  </span>
                  {active && totalTax > 0 && (
                    <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                      {((band.taxPaidInBand/totalTax)*100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   SCENARIO COMPARISON
═══════════════════════════════════ */
function ScenarioComparison({ currentResult, onSave, onApplyProfile }: {
  currentResult: CalcResult;
  onSave: (name?: string) => void;
  onApplyProfile: (ftb: boolean, add: boolean) => void;
}) {
  const { totalTax, effectiveRate, propertyPrice, region, profile } = currentResult;
  const [saveName, setSaveName] = useState('');
  const [saveOk,   setSaveOk]   = useState(false);

  const ftbResult = calcSDLT(propertyPrice, region, { isFirstTimeBuyer: true,  isAdditionalProperty: false, isNonUKResident: false });
  const addResult = calcSDLT(propertyPrice, region, { isFirstTimeBuyer: false, isAdditionalProperty: true,  isNonUKResident: false });
  const ftbDelta  = ftbResult.totalTax - totalTax;
  const addDelta  = addResult.totalTax - totalTax;
  const hasSavings = !profile.isFirstTimeBuyer && ftbDelta < 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(saveName.trim() || `Quote: &#x00a3;${propertyPrice.toLocaleString()} (${region})`);
    setSaveName('');
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-100/40 p-5 md:p-6 flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-[11px] uppercase tracking-[0.2em] text-slate-800">Compare Scenarios</h2>
          <span className="bg-slate-100 border border-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.1em]">3 Cohorts</span>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => alert('Export coming soon')} title="Download" className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors bg-white cursor-pointer">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('URL copied!'); }} title="Share" className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors bg-white cursor-pointer">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs border-collapse">
          <thead className="text-[10px] uppercase tracking-wider bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 font-bold text-slate-500 text-left w-1/4">Scenario</th>
              <th className="px-3 py-3 font-bold text-slate-600 text-left border-l border-slate-200">Current</th>
              <th className="px-3 py-3 font-bold text-blue-700 text-left border-l border-slate-200 bg-blue-50/30">First-Time</th>
              <th className="px-3 py-3 font-bold text-amber-700 text-left border-l border-slate-200 bg-amber-50/10">Additional</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-3 text-left">
                <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide">Total Tax</div>
                <div className="text-[9px] text-slate-400 font-medium mt-0.5">payable</div>
              </td>
              <td className="px-3 py-3 border-l border-slate-100 font-mono font-bold text-slate-800">&#x00a3;{totalTax.toLocaleString(undefined,{maximumFractionDigits:0})}</td>
              <td className="px-3 py-3 border-l border-slate-100 font-mono font-bold text-blue-700 bg-blue-50/30">&#x00a3;{ftbResult.totalTax.toLocaleString(undefined,{maximumFractionDigits:0})}</td>
              <td className="px-3 py-3 border-l border-slate-100 font-mono font-bold text-amber-700 bg-amber-50/10">&#x00a3;{addResult.totalTax.toLocaleString(undefined,{maximumFractionDigits:0})}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-3 text-left">
                <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide">Eff. Rate</div>
                <div className="text-[9px] text-slate-400 font-medium mt-0.5">% of price</div>
              </td>
              <td className="px-3 py-3 border-l border-slate-100 font-mono text-slate-700">{effectiveRate.toFixed(2)}%</td>
              <td className="px-3 py-3 border-l border-slate-100 font-mono font-bold text-blue-700 bg-blue-50/30">{ftbResult.effectiveRate.toFixed(2)}%</td>
              <td className="px-3 py-3 border-l border-slate-100 font-mono text-amber-700 bg-amber-50/10">{addResult.effectiveRate.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className="px-3 py-3 text-left">
                <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wide">Delta</div>
                <div className="text-[9px] text-slate-400 font-medium mt-0.5">vs current</div>
              </td>
              <td className="px-3 py-3 border-l border-slate-100 text-[10px] text-slate-400 font-mono uppercase">Baseline</td>
              <td className="px-3 py-3 border-l border-slate-100 bg-blue-50/30">
                {ftbDelta === 0
                  ? <span className="text-[9px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                  : ftbDelta < 0
                  ? <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">&#x2212;&#x00a3;{Math.abs(ftbDelta).toLocaleString()}</span>
                  : <span className="inline-flex items-center gap-0.5 bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">+&#x00a3;{ftbDelta.toLocaleString()}</span>
                }
              </td>
              <td className="px-3 py-3 border-l border-slate-100 bg-amber-50/10">
                {addDelta === 0
                  ? <span className="text-[9px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                  : addDelta > 0
                  ? <span className="inline-flex items-center gap-0.5 bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">+&#x00a3;{addDelta.toLocaleString()}</span>
                  : <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">&#x2212;&#x00a3;{Math.abs(addDelta).toLocaleString()}</span>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recommendation banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${profile.isFirstTimeBuyer ? 'bg-emerald-50/50 border-emerald-200/60' : 'bg-slate-50/80 border-slate-200'}`}>
        <div className="flex items-start gap-3">
          <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm shrink-0">
            <CheckCircle className={`w-5 h-5 ${profile.isFirstTimeBuyer ? 'text-emerald-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[9px] font-extrabold tracking-[0.15em] uppercase ${profile.isFirstTimeBuyer ? 'text-emerald-700' : 'text-blue-700'}`}>
                {profile.isFirstTimeBuyer ? 'Incentive Applied' : 'Optimization Potential'}
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${profile.isFirstTimeBuyer ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>2026</span>
            </div>
            {profile.isFirstTimeBuyer ? (
              <p className="text-[11px] text-slate-600">Relief active. You save <strong className="text-emerald-700">&#x00a3;{Math.abs(ftbDelta).toLocaleString()}</strong> vs standard rate.</p>
            ) : hasSavings ? (
              <p className="text-[11px] text-slate-600">FTB relief could save <strong className="text-blue-600">&#x00a3;{Math.abs(ftbDelta).toLocaleString()}</strong> if eligible.</p>
            ) : profile.isAdditionalProperty ? (
              <p className="text-[11px] text-slate-600">Additional surcharge active. Extra <strong className="text-red-600">&#x00a3;{addDelta.toLocaleString()}</strong> vs standard.</p>
            ) : (
              <p className="text-[11px] text-slate-600">Standard rate. Additional surcharge would add <strong className="text-blue-600">&#x00a3;{addDelta.toLocaleString()}</strong>.</p>
            )}
          </div>
        </div>
        {hasSavings && (
          <button onClick={() => onApplyProfile(true, false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] transition-colors cursor-pointer self-start sm:self-center shrink-0 shadow-sm shadow-blue-100">
            Apply Relief
          </button>
        )}
      </div>

      {/* Save quote */}
      <form onSubmit={handleSave} className="flex flex-col gap-2 pt-4 border-t border-slate-100">
        <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Save Calculation Quote</label>
        <div className="flex gap-2">
          <input
            type="text" value={saveName} onChange={e => setSaveName(e.target.value)}
            placeholder={`Quote for &#x00a3;${propertyPrice.toLocaleString()} (${region})`}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 placeholder-slate-400 font-mono min-w-0"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow-sm shadow-blue-100 shrink-0">
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
        {saveOk && <p className="text-[10px] font-bold font-mono text-emerald-600 uppercase tracking-widest">&#x2713; Quote stored in browser cache.</p>}
      </form>
    </div>
  );
}

/* ─── Shared primitives ─── */
function StepBadge({ n, active }: { n: string; active: boolean }) {
  return (
    <div className={`border w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${active ? 'border-blue-200 bg-blue-50 text-blue-600' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
      {n}
    </div>
  );
}

function ProfileCard({ checked, onClick, color, label, sub, badge, icon }: {
  checked: boolean; onClick: () => void; color: 'blue'|'amber'|'red';
  label: string; sub: string; badge?: string; icon?: React.ReactNode;
}) {
  const activeCls = color==='blue' ? 'border-blue-300 bg-blue-50/40' : color==='amber' ? 'border-amber-300 bg-amber-50/30' : 'border-red-300 bg-red-50/20';
  const boxCls    = color==='blue' ? 'border-blue-600 bg-blue-600' : color==='amber' ? 'border-amber-600 bg-amber-600' : 'border-red-600 bg-red-600';
  return (
    <div onClick={onClick} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${checked ? activeCls : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'}`}>
      <div className="mt-0.5 shrink-0">
        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? `${boxCls} text-white` : 'border-slate-300 bg-white'}`}>
          {checked && <Check className="w-3 h-3 stroke-[3px]" />}
        </div>
      </div>
      <div className="flex flex-col min-w-0 w-full">
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <span className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">{label}{icon}</span>
          {badge && <span className="text-[8px] bg-amber-50 border border-amber-200 text-amber-800 px-1.5 py-0.5 rounded-md font-mono shrink-0">{badge}</span>}
        </div>
        <span className="text-[10px] font-mono text-slate-400 mt-0.5">{sub}</span>
      </div>
    </div>
  );
}
