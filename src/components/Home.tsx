'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, Rocket, History,
  LayoutGrid, ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, Search,
  Calculator, Compass, Scale, Clock, TrendingUp, CheckCircle2, BookOpen,
  Star, Zap, Globe2,
} from 'lucide-react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

interface VisaCard {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
  color: string;
  bg: string;
  feeFrom: string;
  processing: string;
  success: number;       // %
  badge?: string;
  emoji: string;
}

const VISA_CARDS: VisaCard[] = [
  { id: 'skilled-worker',    title: 'Skilled Worker',    icon: Briefcase,    blurb: 'Sponsored employment', color: '#d9152b', bg: 'rgba(217,21,43,0.06)',  feeFrom: '£769',   processing: '3 weeks',  success: 92, badge: 'Most popular', emoji: '💼' },
  { id: 'student',           title: 'Student',           icon: GraduationCap,blurb: 'Degree-level study',   color: '#2563eb', bg: 'rgba(37,99,235,0.06)',  feeFrom: '£524',   processing: '3 weeks',  success: 96, emoji: '🎓' },
  { id: 'visitor',           title: 'Standard Visitor',  icon: Plane,        blurb: 'Tourism or business',  color: '#0891b2', bg: 'rgba(8,145,178,0.06)',  feeFrom: '£127',   processing: '3 weeks',  success: 88, badge: 'Fastest',       emoji: '✈️' },
  { id: 'family',            title: 'Family / Spouse',   icon: Users,        blurb: 'Join settled partner', color: '#7c3aed', bg: 'rgba(124,58,237,0.06)', feeFrom: '£1,938', processing: '12 weeks', success: 82, emoji: '👨‍👩‍👧' },
  { id: 'health',            title: 'Health & Care',     icon: Stethoscope,  blurb: 'NHS / care roles',     color: '#059669', bg: 'rgba(5,150,105,0.06)',  feeFrom: '£304',   processing: '3 weeks',  success: 95, badge: 'Best value',    emoji: '🩺' },
  { id: 'talent',            title: 'Global Talent',     icon: LayoutGrid,   blurb: 'Top researchers',       color: '#d97706', bg: 'rgba(217,119,6,0.06)',  feeFrom: '£766',   processing: '8 weeks',  success: 90, emoji: '⭐' },
  { id: 'innovator-founder', title: 'Innovator Founder', icon: Rocket,       blurb: 'Endorsed founders',     color: '#e11d48', bg: 'rgba(225,29,72,0.06)',  feeFrom: '£1,191', processing: '8 weeks',  success: 78, emoji: '🚀' },
  { id: 'graduate',          title: 'Graduate',          icon: History,      blurb: '18 months post-study',  color: '#0d9488', bg: 'rgba(13,148,136,0.06)', feeFrom: '£880',   processing: '8 weeks',  success: 97, emoji: '📜' },
];

const PURPOSES = [
  { id: '',           label: 'Any purpose',   emoji: '🌍' },
  { id: 'work',       label: 'Work in the UK', emoji: '💼' },
  { id: 'study',      label: 'Study',          emoji: '🎓' },
  { id: 'family',     label: 'Join family',    emoji: '👨‍👩‍👧' },
  { id: 'visit',      label: 'Visit',          emoji: '✈️' },
  { id: 'settle',     label: 'Settle / ILR',   emoji: '🏡' },
];

const COUNTRIES = [
  { code: 'in', flag: '🇮🇳', name: 'India' },
  { code: 'ng', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'pk', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'ph', flag: '🇵🇭', name: 'Philippines' },
  { code: 'bd', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'cn', flag: '🇨🇳', name: 'China' },
  { code: 'us', flag: '🇺🇸', name: 'USA' },
  { code: 'za', flag: '🇿🇦', name: 'South Africa' },
];

const DURATIONS = [
  { id: '',          label: 'Any duration' },
  { id: 'short',     label: 'Under 6 months' },
  { id: '2y',        label: '2-3 years' },
  { id: '5y',        label: '5 years+' },
  { id: 'permanent', label: 'Permanent' },
];

const PURPOSE_TO_VISAS: Record<string, string[]> = {
  work:   ['skilled-worker', 'health', 'talent', 'innovator-founder'],
  study:  ['student', 'graduate'],
  family: ['family'],
  visit:  ['visitor'],
  settle: ['skilled-worker', 'family'],
};

const TOOLS = [
  { label: 'Eligibility quiz',  desc: '60-second match',          icon: Compass,    href: '/eligibility',          accent: '#d9152b', tint: 'rgba(217,21,43,0.07)' },
  { label: 'Salary checker',    desc: 'SOC code threshold',       icon: Briefcase,  href: '/tools/salary-checker', accent: '#0891b2', tint: 'rgba(8,145,178,0.07)' },
  { label: 'Sponsor search',    desc: '126k+ employers',          icon: Search,     href: '/tools/sponsor-search', accent: '#2563eb', tint: 'rgba(37,99,235,0.07)' },
  { label: 'Cost calculator',   desc: 'Fees + IHS + dependants',  icon: Calculator, href: '/tools/cost-calculator',accent: '#7c3aed', tint: 'rgba(124,58,237,0.07)' },
];

const STATS = [
  { v: '126k', label: 'Licensed sponsors',      icon: ShieldCheck },
  { v: '270',  label: 'SOC codes tracked',      icon: Briefcase },
  { v: '19+',  label: 'In-depth guides',        icon: BookOpen },
  { v: '100%', label: 'gov.uk sourced',         icon: CheckCircle2 },
];

const TRENDING = [
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026', label: 'Salary thresholds 2026', cat: 'Skilled Worker' },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts', label: 'Family visa £29,000',     cat: 'Family' },
  { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',     label: 'eVisa migration',          cat: 'Update' },
  { href: '/blog/uk-citizenship-10-year-long-residence-2026',      label: '10-year long residence',   cat: 'ILR' },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);
  const [purpose,  setPurpose]  = useState('');
  const [country,  setCountry]  = useState('in');
  const [duration, setDuration] = useState('');

  const filteredVisas = useMemo(() => {
    if (!purpose) return VISA_CARDS;
    const ids = PURPOSE_TO_VISAS[purpose] ?? [];
    return VISA_CARDS.filter((v) => ids.includes(v.id));
  }, [purpose]);

  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════
          HERO — search-first
      ════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden pt-[88px] md:pt-[100px] pb-12 md:pb-16 bg-gradient-to-b from-[#0a1530] via-[#0e1b3f] to-[#13204a]">

        {/* decorative bg */}
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#d9152b]/15 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#2563eb]/12 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* live badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#34d399] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
              Live · Updated 2 hours ago
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-white/65 text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3" />
              12,453 visas checked today
            </span>
          </div>

          {/* heading */}
          <h1 className="font-display text-white font-bold tracking-[-0.03em] leading-[1.02] text-center text-[2.4rem] sm:text-[3.2rem] md:text-[4rem]">
            Your UK visa, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#ffbf47] via-[#ff9f43] to-[#ffbf47] bg-clip-text text-transparent">
              found in 60 seconds.
            </span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-white/55 text-center text-base md:text-[1.0625rem] leading-relaxed">
            Compare every route, check fees, search 126,530 sponsors — straight from official Home Office data.
          </p>

          {/* ── Search wizard ── */}
          <div className="mt-9 max-w-4xl mx-auto">
            <div className="bg-white rounded-[20px] md:rounded-full shadow-[0_20px_60px_-12px_rgba(0,0,0,0.45)] p-2 flex flex-col md:flex-row items-stretch gap-1.5">
              <WizField label="I want to" icon={<Sparkles className="w-3.5 h-3.5" />}>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-transparent text-[#0a1530] text-[14.5px] font-semibold outline-none cursor-pointer appearance-none"
                >
                  {PURPOSES.map((p) => (
                    <option key={p.id} value={p.id}>{p.emoji}  {p.label}</option>
                  ))}
                </select>
              </WizField>

              <div className="hidden md:block w-px bg-[#e6eaf3] self-stretch my-2" />

              <WizField label="From" icon={<Globe2 className="w-3.5 h-3.5" />}>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent text-[#0a1530] text-[14.5px] font-semibold outline-none cursor-pointer appearance-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag}  {c.name}</option>
                  ))}
                </select>
              </WizField>

              <div className="hidden md:block w-px bg-[#e6eaf3] self-stretch my-2" />

              <WizField label="Duration" icon={<Clock className="w-3.5 h-3.5" />}>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-transparent text-[#0a1530] text-[14.5px] font-semibold outline-none cursor-pointer appearance-none"
                >
                  {DURATIONS.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </WizField>

              <button
                type="button"
                onClick={() => router.push('/eligibility')}
                className="flex items-center justify-center gap-2 bg-[#d9152b] text-white font-bold px-7 py-3.5 md:py-0 rounded-2xl md:rounded-full hover:bg-[#b8101f] active:scale-[0.98] transition-[background,transform] duration-100 text-[14px] shadow-[0_4px_16px_rgba(217,21,43,0.4)] flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Find my visa</span>
              </button>
            </div>

            {/* quick chip suggestions */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12px]">
              <span className="text-white/40 font-medium pr-1">Popular:</span>
              {[
                { label: 'Skilled Worker', id: 'skilled-worker' },
                { label: 'Student visa',   id: 'student' },
                { label: 'Family visa',    id: 'family' },
                { label: 'ILR',            id: 'ilr', href: '/visa/ilr' },
              ].map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => q.href ? router.push(q.href) : setActiveVisaId(q.id)}
                  className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/75 hover:bg-white/[0.12] hover:text-white transition-colors duration-75 font-medium"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* trust strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/35 text-[11.5px] font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#ffbf47]" /> Official gov.uk sources</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#ffbf47]" /> Free · No signup</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ffbf47]" /> Updated daily</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          VISA TRIP-CARDS
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-[#fafbfd]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-2">
                {purpose ? `Results for "${PURPOSES.find(p => p.id === purpose)?.label}"` : 'Visa routes'}
              </span>
              <h2 className="font-display text-[1.75rem] md:text-[2.25rem] font-bold text-[#0a1530] tracking-tight leading-tight">
                {filteredVisas.length} {filteredVisas.length === 1 ? 'route' : 'routes'} for you
              </h2>
            </div>
            <Link
              href="/visa-types"
              className="inline-flex items-center gap-1.5 text-[#d9152b] text-sm font-bold hover:gap-2.5 transition-[gap] duration-100"
            >
              See all routes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredVisas.map((v) => (
              <TripCard key={v.id} visa={v} onClick={() => setActiveVisaId(v.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BENTO GRID — tools + features
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-2">
              Free tools
            </span>
            <h2 className="font-display text-[1.75rem] md:text-[2.25rem] font-bold text-[#0a1530] tracking-tight leading-tight">
              Everything in one place
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-3 md:gap-4 auto-rows-[180px]">

            {/* HERO TILE — sponsor search (largest) */}
            <Link
              href="/tools/sponsor-search"
              className="col-span-12 md:col-span-7 row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-7 md:p-9 text-white"
            >
              <div className="absolute inset-0 opacity-25 pointer-events-none"
                   style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#d9152b]/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.14] text-[#ffbf47] text-[10.5px] font-bold uppercase tracking-[0.1em]">
                    <Star className="w-3 h-3" fill="currentColor" />
                    Most used
                  </span>
                  <h3 className="mt-5 font-display font-bold text-[1.75rem] md:text-[2.25rem] leading-[1.05] tracking-tight">
                    Search 126,530 <br /> UK sponsors instantly
                  </h3>
                  <p className="mt-3 text-white/55 text-[14px] md:text-[15px] max-w-md leading-relaxed">
                    The complete Home Office register. Filter by route, region and rating to find employers who can sponsor you.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className="inline-flex items-center gap-2 text-[#ffbf47] font-bold text-sm group-hover:gap-3 transition-[gap] duration-100">
                    Open sponsor search <ArrowUpRight className="w-4 h-4" />
                  </span>
                  <div className="hidden md:flex items-center gap-3 text-white/40 text-[12px]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~5s</span>
                    <span>·</span>
                    <span>Server-side search</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* COMPACT TILES */}
            {TOOLS.slice(0, 2).map((t) => (
              <BentoTile key={t.label} {...t} small />
            ))}

            {/* TRENDING UPDATES (wide) */}
            <div className="col-span-12 md:col-span-5 row-span-2 rounded-3xl bg-white border border-[rgba(14,20,36,0.08)] p-6 md:p-7">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#d9152b]">
                  <TrendingUp className="w-3 h-3" />
                  Trending guides
                </span>
                <Link href="/blog" className="text-[12px] font-semibold text-[#52596e] hover:text-[#0a1530]">All →</Link>
              </div>
              <ul className="space-y-1">
                {TRENDING.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className="group flex items-center gap-3 py-2.5 border-b border-[rgba(14,20,36,0.05)] last:border-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa3b8] flex-shrink-0 w-[88px]">{g.cat}</span>
                      <span className="text-[13.5px] font-semibold text-[#0a1530] flex-1 truncate group-hover:text-[#d9152b] transition-colors duration-75">
                        {g.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] group-hover:text-[#d9152b] group-hover:translate-x-0.5 transition-all duration-100 flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPACT TILES (row 2) */}
            {TOOLS.slice(2, 4).map((t) => (
              <BentoTile key={t.label} {...t} small />
            ))}

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          COUNTRY PICKER
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-[#fafbfd]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-9">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-2">
              Country guides
            </span>
            <h2 className="font-display text-[1.75rem] md:text-[2.25rem] font-bold text-[#0a1530] tracking-tight">
              UK visa from your country
            </h2>
            <p className="mt-3 max-w-md mx-auto text-[#52596e] text-[14.5px]">
              Get country-specific requirements, document lists and processing times.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 md:gap-3">
            {COUNTRIES.map((c) => (
              <Link
                key={c.code}
                href="/visa-types"
                className="group bg-white rounded-2xl border border-[rgba(14,20,36,0.07)] p-4 text-center hover:border-[#0a1530] hover:-translate-y-0.5 transition-[transform,border-color] duration-150"
              >
                <div className="text-[2rem] leading-none mb-2 group-hover:scale-110 transition-transform duration-150 inline-block">
                  {c.flag}
                </div>
                <div className="text-[13px] font-bold text-[#0a1530]">{c.name}</div>
                <div className="text-[10.5px] text-[#9aa3b8] mt-0.5">View routes</div>
              </Link>
            ))}
          </div>

          <p className="text-center mt-5 text-[12px] text-[#9aa3b8]">
            More country guides coming · <Link href="/visa-types" className="text-[#d9152b] font-semibold">Browse all</Link>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════ */}
      <section className="py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-gradient-to-br from-[#f7f9fd] to-white border border-[rgba(14,20,36,0.07)] rounded-2xl p-5 md:p-6"
              >
                <s.icon className="w-5 h-5 text-[#d9152b] mb-3" />
                <div className="font-display text-[1.75rem] md:text-[2rem] font-bold text-[#0a1530] tracking-tight tabular-nums leading-none">
                  {s.v}
                </div>
                <div className="mt-1.5 text-[12px] text-[#52596e] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════ */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-8 md:p-12">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-[#d9152b]/25 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.14] text-[#ffbf47] text-[10.5px] font-bold uppercase tracking-[0.1em] mb-4">
                  <Sparkles className="w-3 h-3" />
                  Start here
                </span>
                <h2 className="font-display text-white font-bold text-[1.625rem] md:text-[2rem] leading-tight tracking-tight">
                  Not sure where to start?<br />
                  Take the 60-second quiz.
                </h2>
                <p className="mt-3 text-white/55 text-[14px] max-w-md">
                  Four quick questions and we&apos;ll point you at the right UK visa route.
                </p>
              </div>
              <Link
                href="/eligibility"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-[#d9152b] text-white font-bold px-7 py-4 rounded-2xl hover:bg-[#b8101f] active:scale-[0.98] transition-[background,transform] duration-100 text-[14px] shadow-[0_4px_16px_rgba(217,21,43,0.4)]"
              >
                <Compass className="w-4 h-4" />
                Start eligibility quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeVisaId && (
        <VisaDetailModal
          visa={VISA_DETAILS[activeVisaId as keyof typeof VISA_DETAILS]}
          onClose={() => setActiveVisaId(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */
function WizField({
  label, icon, children,
}: {
  label: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <label className="flex-1 group flex items-center gap-3 px-4 py-2.5 md:py-2 rounded-2xl md:rounded-full hover:bg-[#f4f6fb] transition-colors duration-75 cursor-pointer min-w-0">
      <span className="hidden md:flex w-8 h-8 rounded-full bg-[#f3f5fb] items-center justify-center text-[#52596e] flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-0.5">{label}</span>
        {children}
      </span>
    </label>
  );
}

function TripCard({ visa: v, onClick }: { visa: VisaCard; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left bg-white rounded-3xl border border-[rgba(14,20,36,0.08)] p-5 md:p-6 hover:border-[#0a1530] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(10,21,48,0.12)] transition-[transform,border-color,box-shadow] duration-150 flex flex-col"
    >
      {/* header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <span
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-[1.5rem]"
          style={{ background: v.bg }}
        >
          {v.emoji}
        </span>
        {v.badge && (
          <span
            className="text-[9.5px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
            style={{ background: `${v.color}15`, color: v.color }}
          >
            {v.badge}
          </span>
        )}
      </div>

      <h3 className="font-display font-bold text-[17px] text-[#0a1530] leading-tight mb-1">
        {v.title}
      </h3>
      <p className="text-[12.5px] text-[#7a8195] leading-snug mb-4">{v.blurb}</p>

      {/* metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-[rgba(14,20,36,0.06)]">
        <div>
          <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#9aa3b8]">From</div>
          <div className="text-[13px] font-bold text-[#0a1530] tabular-nums">{v.feeFrom}</div>
        </div>
        <div>
          <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#9aa3b8]">Time</div>
          <div className="text-[13px] font-bold text-[#0a1530]">{v.processing}</div>
        </div>
        <div>
          <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#9aa3b8]">Success</div>
          <div className="text-[13px] font-bold text-[#059669] tabular-nums">{v.success}%</div>
        </div>
      </div>

      {/* success bar */}
      <div className="h-1 bg-[#f3f5fb] rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${v.success}%`, background: v.color }}
        />
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-[#0a1530] text-[12.5px] font-bold group-hover:gap-2.5 group-hover:text-[#d9152b] transition-all duration-100">
        View details <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}

function BentoTile({
  label, desc, icon: Icon, href, accent, tint, small,
}: {
  label: string; desc: string; icon: React.ComponentType<{ className?: string }>; href: string; accent: string; tint: string; small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        ${small ? 'col-span-6 md:col-span-3' : 'col-span-12 md:col-span-6'}
        group relative overflow-hidden rounded-3xl bg-white border border-[rgba(14,20,36,0.08)] p-5
        hover:border-[#0a1530] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,21,48,0.08)]
        transition-[transform,border-color,box-shadow] duration-150 flex flex-col justify-between
      `}
    >
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: tint, color: accent }}
      >
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <div>
        <div className="text-[14.5px] font-bold text-[#0a1530] leading-tight">{label}</div>
        <div className="text-[11.5px] text-[#8892a4] mt-0.5 leading-tight">{desc}</div>
        <div className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: accent }}>
          Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-100" />
        </div>
      </div>
    </Link>
  );
}
