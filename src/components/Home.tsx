'use client';

/**
 * Home page — architected for the 300-feature UK utility platform.
 *
 * Six top-level categories each act as a hub that can hold any number
 * of underlying tools. New features slot into the existing category
 * without restructuring the home page. Currently-live tools show with
 * working links; planned tools show with a "Coming soon" pill.
 *
 *   1. Money & Tax       — Take-home Pay, Stamp Duty, more
 *   2. Property & Mortgage — Mortgage Affordability, Council Tax band
 *   3. Visas & Immigration — full visa hub (the original anchor)
 *   4. Local & Postcode  — Postcode super-dashboard, Cost of Living
 *   5. NHS & Healthcare  — GP finder, waiting times (planned)
 *   6. Transport & Driving — ULEZ, MOT (planned)
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, Rocket, History,
  LayoutGrid, ArrowRight, ArrowUpRight, ShieldCheck, Calculator,
  Compass, BookOpen, Globe2, Wallet, HomeIcon, MapPin, Bus, Search,
  Sparkles, CheckCircle2, Clock,
} from 'lucide-react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';

/* ─────────────────────────────────────────────
   BRAND
───────────────────────────────────────────── */
const NAVY = '#0A2540';
const TEAL = '#00C4B4';
const GOLD = '#C9A14A';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

interface CategoryTool { label: string; href: string; live: boolean }
interface Category {
  id: string;
  title: string;
  desc: string;
  icon: typeof Wallet;
  liveCount: number;
  plannedCount: number;
  tools: CategoryTool[];
  href: string;
  accent: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'money',
    title: 'Money & Tax',
    desc: 'PAYE, NI, ISA, pension, salary sacrifice — your real take-home.',
    icon: Wallet,
    liveCount: 1,
    plannedCount: 39,
    tools: [
      { label: 'Take-Home Pay',      href: '/take-home-pay',  live: true },
      { label: 'Marginal tax rate',  href: '/take-home-pay#rates', live: true },
      { label: 'Pension optimiser',  href: '#',               live: false },
      { label: 'ISA tracker',        href: '#',               live: false },
    ],
    href: '/take-home-pay',
    accent: TEAL,
  },
  {
    id: 'property',
    title: 'Property & Mortgage',
    desc: 'What you can borrow, the SDLT bill and council tax for any home.',
    icon: HomeIcon,
    liveCount: 3,
    plannedCount: 17,
    tools: [
      { label: 'Mortgage affordability', href: '/mortgage-affordability', live: true },
      { label: 'Stamp Duty calculator',  href: '/stamp-duty-calculator',  live: true },
      { label: 'Council Tax band',       href: '/council-tax-band',       live: true },
      { label: 'Rent by postcode',       href: '#',                       live: false },
    ],
    href: '/mortgage-affordability',
    accent: GOLD,
  },
  {
    id: 'visas',
    title: 'Visas & Immigration',
    desc: '14 visa routes, eligibility quiz, cost calculator, refusal analyzer.',
    icon: Plane,
    liveCount: 8,
    plannedCount: 4,
    tools: [
      { label: 'Find your visa',       href: '/eligibility',           live: true },
      { label: 'Skilled Worker',       href: '/visa/skilled-worker',   live: true },
      { label: 'Sponsor search',       href: '/tools/sponsor-search',  live: true },
      { label: 'Visa cost calculator', href: '/tools/cost-calculator', live: true },
    ],
    href: '/visa-types',
    accent: NAVY,
  },
  {
    id: 'local',
    title: 'Local & Postcode',
    desc: 'Council, MP, NHS, police, ward, school catchment by postcode.',
    icon: MapPin,
    liveCount: 2,
    plannedCount: 13,
    tools: [
      { label: 'Postcode super-lookup', href: '/postcode',          live: true },
      { label: 'Cost of Living',        href: '/cost-of-living-uk', live: true },
      { label: 'Bin collection',        href: '#',                  live: false },
      { label: 'School catchment',      href: '#',                  live: false },
    ],
    href: '/postcode',
    accent: TEAL,
  },
  {
    id: 'health',
    title: 'NHS & Healthcare',
    desc: 'Find a GP, NHS waiting times, PPC calculator and dental fees.',
    icon: Stethoscope,
    liveCount: 0,
    plannedCount: 25,
    tools: [
      { label: 'GP finder',         href: '#', live: false },
      { label: 'NHS waiting times', href: '#', live: false },
      { label: 'PPC calculator',    href: '#', live: false },
      { label: 'Dental band fees',  href: '#', live: false },
    ],
    href: '#',
    accent: GOLD,
  },
  {
    id: 'transport',
    title: 'Transport & Driving',
    desc: 'ULEZ checker, MOT due dates, train split-tickets, EV costs.',
    icon: Bus,
    liveCount: 0,
    plannedCount: 20,
    tools: [
      { label: 'ULEZ checker',     href: '#', live: false },
      { label: 'MOT due by reg',   href: '#', live: false },
      { label: 'Train split-tix',  href: '#', live: false },
      { label: 'EV cost vs petrol', href: '#', live: false },
    ],
    href: '#',
    accent: NAVY,
  },
];

interface PopularTool {
  href: string;
  title: string;
  desc: string;
  icon: typeof Calculator;
  size: 'sm' | 'md' | 'lg';
  accent: string;
}

const POPULAR_TOOLS: PopularTool[] = [
  { href: '/take-home-pay',          title: 'Take-Home Pay',        desc: 'PAYE + NI + student loan + pension',           icon: Wallet,     size: 'lg', accent: TEAL },
  { href: '/postcode',               title: 'Postcode Lookup',      desc: 'Council, MP, NHS, police force — all in one',  icon: MapPin,     size: 'md', accent: NAVY },
  { href: '/mortgage-affordability', title: 'Mortgage Affordability', desc: 'Max borrow + stress-tested monthly',         icon: HomeIcon,   size: 'md', accent: GOLD },
  { href: '/stamp-duty-calculator',  title: 'Stamp Duty',           desc: 'SDLT 2026 with FTB relief + surcharges',       icon: Calculator, size: 'sm', accent: TEAL },
  { href: '/council-tax-band',       title: 'Council Tax Band',     desc: 'All 8 bands for any UK postcode',              icon: Calculator, size: 'sm', accent: NAVY },
  { href: '/tools/cost-calculator',  title: 'Visa Cost',            desc: 'Home Office + IHS + dependants',               icon: Calculator, size: 'sm', accent: GOLD },
];

interface VisaCard {
  id: string; title: string; icon: typeof Briefcase; blurb: string; meta: string; accent: string;
}

const VISA_CARDS: VisaCard[] = [
  { id: 'skilled-worker',    title: 'Skilled Worker',    icon: Briefcase,    blurb: 'Sponsored UK employment',            meta: 'from £41,700', accent: TEAL },
  { id: 'student',           title: 'Student',           icon: GraduationCap, blurb: 'Degree-level study',                 meta: 'fee £558',     accent: NAVY },
  { id: 'visitor',           title: 'Standard Visitor',  icon: Plane,        blurb: 'Tourism or business ≤6 months',      meta: 'fee £135',     accent: GOLD },
  { id: 'family',            title: 'Family / Spouse',   icon: Users,        blurb: 'Join settled UK partner',            meta: '£29,000 income', accent: TEAL },
  { id: 'health',            title: 'Health & Care',     icon: Stethoscope,  blurb: 'NHS / social care',                  meta: 'IHS waived',   accent: NAVY },
  { id: 'talent',            title: 'Global Talent',     icon: LayoutGrid,   blurb: 'Endorsed leaders',                   meta: 'No sponsor',   accent: GOLD },
  { id: 'innovator-founder', title: 'Innovator Founder', icon: Rocket,       blurb: 'Endorsed startup founders',          meta: '£1,357',       accent: TEAL },
  { id: 'graduate',          title: 'Graduate',          icon: History,      blurb: 'Stay after a UK degree',             meta: '2 years',      accent: NAVY },
];

const FEATURED_GUIDES = [
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',     title: 'Skilled Worker salary thresholds 2026', read: '8 min', tag: 'Skilled Worker' },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',   title: 'Family visa £29,000 — what counts',     read: '7 min', tag: 'Family' },
  { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026', title: 'How to find a sponsor licence holder',  read: '9 min', tag: 'Sponsorship' },
];

const STATS = [
  { v: '126,530', label: 'Licensed sponsors searchable' },
  { v: '270',     label: 'SOC codes with going rates' },
  { v: '14',      label: 'Visa routes covered' },
  { v: '100%',    label: 'gov.uk / HMRC sourced' },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export default function Home() {
  const router = useRouter();
  const [activeVisa, setActiveVisa] = useState<string | null>(null);
  const [postcode, setPostcode] = useState('');

  const submitPostcode = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = postcode.replace(/\s+/g, '').toUpperCase();
    if (trimmed.length >= 5) router.push(`/postcode/${trimmed}`);
  };

  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden pt-[100px] md:pt-[130px] pb-16 md:pb-20">
        {/* Subtle gradient mesh — very faint, white-friendly */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(118,119,126,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.10,
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
            }}
          />
          <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: TEAL }} />
          <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: GOLD }} />
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-[#f3f4f5] text-[#45464d] mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
            <ShieldCheck className="w-3 h-3" />
            UK · 2026 verified · gov.uk · HMRC · ONS
          </div>

          {/* Headline */}
          <h1
            className="font-bold text-[#0A2540] tracking-[-0.025em]"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(2.5rem, 7vw, 4.25rem)',
              lineHeight: '1.05',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            Everything UK, sorted.
          </h1>

          {/* Deck */}
          <p
            className="mt-5 text-[16px] md:text-[18px] text-[#45464d] leading-[1.55] max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Free calculators, lookups and guides for life in Britain — from visas and mortgages to take-home pay, council tax and postcodes. All verified against gov.uk, HMRC and ONS.
          </p>

          {/* Postcode quick-search */}
          <form
            onSubmit={submitPostcode}
            className="mt-9 max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_8px_32px_-4px_rgba(16,26,54,0.10)] p-1.5 flex items-center gap-1.5"
          >
            <label htmlFor="hp-postcode" className="pl-3 flex items-center gap-2 text-[#76777e] flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </label>
            <input
              id="hp-postcode"
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder="Try your postcode  ·  SW1A 1AA"
              autoCapitalize="characters"
              autoComplete="postal-code"
              className="flex-1 min-w-0 bg-transparent text-[16px] md:text-[17px] font-semibold text-[#0A2540] placeholder:text-[#c1c2c5] outline-none py-3 tracking-wide tabular-nums"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#0A2540] text-white text-[13.5px] font-semibold px-4 py-2.5 rounded-xl hover:bg-[#13325F] active:scale-[0.98] transition-all duration-100 flex-shrink-0"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Look up</span>
            </button>
          </form>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0A2540] hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Sparkles className="w-4 h-4" />
              Find your visa in 60 seconds
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[#cfd5e0]">·</span>
            <Link
              href="/take-home-pay"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0A2540] hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Calculator className="w-4 h-4" />
              Calculate take-home pay
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-12 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-y-6 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-bold text-[#0A2540] tabular-nums tracking-[-0.015em]"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
                >
                  {s.v}
                </div>
                <div className="mt-1 text-[11.5px] md:text-[12px] text-[#76777e] leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CATEGORIES — the 300-feature backbone
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Categories
            </p>
            <h2
              className="font-bold text-[#0A2540] tracking-[-0.015em]"
              style={{
                fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                lineHeight: '1.1',
              }}
            >
              Every part of UK life, in one place.
            </h2>
            <p className="mt-3 text-[15px] md:text-[16px] text-[#45464d] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Six categories covering money, property, immigration, local services, healthcare and transport. More tools added every week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {CATEGORIES.map((c) => <CategoryCard key={c.id} cat={c} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          POPULAR TOOLS BENTO
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Popular tools
              </p>
              <h2
                className="font-bold text-[#0A2540] tracking-[-0.015em]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  lineHeight: '1.15',
                }}
              >
                Used by thousands every week.
              </h2>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0A2540] hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-3 md:gap-4 auto-rows-[160px]">
            {POPULAR_TOOLS.map((t) => <PopularTile key={t.href} tool={t} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          VISA ROUTES — original anchor
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                UK Visas
              </p>
              <h2
                className="font-bold text-[#0A2540] tracking-[-0.015em]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  lineHeight: '1.15',
                }}
              >
                Find your UK visa route.
              </h2>
              <p className="mt-2 text-[14px] md:text-[15px] text-[#45464d] max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                14 routes covered with 8 April 2026 fees verified line-by-line from gov.uk.
              </p>
            </div>
            <Link
              href="/visa-types"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0A2540] hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All visa routes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {VISA_CARDS.map((v) => <VisaTile key={v.id} v={v} onClick={() => setActiveVisa(v.id)} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED GUIDES
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Featured guides
              </p>
              <h2
                className="font-bold text-[#0A2540] tracking-[-0.015em]"
                style={{
                  fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  lineHeight: '1.15',
                }}
              >
                Latest from the blog.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0A2540] hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURED_GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group block bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#0A2540] transition-colors duration-100 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md bg-[rgba(0,196,180,0.10)] text-[#007F76]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {g.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Clock className="w-3 h-3" />
                    {g.read}
                  </span>
                </div>
                <h3
                  className="font-bold text-[#0A2540] text-[16px] md:text-[17px] leading-[1.3] group-hover:text-[#13325F] transition-colors"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
                >
                  {g.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] group-hover:gap-2 transition-[gap] duration-100" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Read article <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="bg-[#0A2540] rounded-2xl p-7 md:p-10 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: TEAL }} />
            <div className="absolute -left-24 -bottom-24 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: GOLD }} />

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-md">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#dae2ff] mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Sparkles className="w-3 h-3" />
                  Start here
                </span>
                <h3
                  className="text-white font-bold tracking-[-0.015em] leading-[1.15]"
                  style={{
                    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  }}
                >
                  Not sure where to begin?
                </h3>
                <p className="mt-2 text-[14px] md:text-[15px] text-[#bcc5e9] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Take our 60-second quiz to find the right UK visa, or jump straight into the most-used calculators.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/eligibility"
                  className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-[#0A2540] bg-[#C9A14A] hover:bg-[#d5af5e] px-5 py-3 rounded-lg active:scale-[0.98] transition-all duration-100"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Eligibility quiz <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-white/[0.08] border border-white/20 hover:bg-white/[0.14] px-5 py-3 rounded-lg transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Explore tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeVisa && (
        <VisaDetailModal
          visa={VISA_DETAILS[activeVisa as keyof typeof VISA_DETAILS]}
          onClose={() => setActiveVisa(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function CategoryCard({ cat }: { cat: Category }) {
  const Icon = cat.icon;
  const totalTools = cat.liveCount + cat.plannedCount;
  const isLive = cat.liveCount > 0;
  return (
    <Link
      href={cat.href === '#' ? '#categories' : cat.href}
      className={`group block bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-6px_rgba(16,26,54,0.10)] transition-all duration-150 ${cat.href === '#' ? 'opacity-90' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span
          className="inline-flex w-11 h-11 rounded-xl items-center justify-center flex-shrink-0"
          style={{ background: `${cat.accent}14`, color: cat.accent }}
        >
          <Icon className="w-5 h-5" />
        </span>
        <span
          className="inline-flex items-center text-[10.5px] font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-md"
          style={{
            background: isLive ? 'rgba(16,185,129,0.10)' : '#f3f4f5',
            color: isLive ? '#00714d' : '#76777e',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {isLive ? `${cat.liveCount} live` : 'Coming soon'}
        </span>
      </div>

      <h3
        className="font-bold text-[#0A2540] text-[17px] md:text-[18px] tracking-[-0.01em] mb-1.5"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
      >
        {cat.title}
      </h3>
      <p className="text-[13.5px] text-[#45464d] leading-[1.55] mb-4 min-h-[42px]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {cat.desc}
      </p>

      <ul className="space-y-1.5 mb-4">
        {cat.tools.slice(0, 4).map((t) => (
          <li key={t.label} className="flex items-center gap-2 text-[12.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {t.live ? (
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10b981' }} />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border border-dashed border-[#cfd5e0] flex-shrink-0" />
            )}
            <span className={t.live ? 'text-[#0A2540] font-medium' : 'text-[#76777e]'}>
              {t.label}
            </span>
            {!t.live && (
              <span className="text-[10px] uppercase tracking-[0.08em] text-[#76777e] ml-auto">soon</span>
            )}
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
        <span className="text-[11.5px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <strong className="text-[#0A2540] tabular-nums">{cat.liveCount}</strong>/{totalTools} tools live
        </span>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A2540] group-hover:gap-2 transition-[gap] duration-100" style={{ fontFamily: 'Inter, sans-serif' }}>
          Browse <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

function PopularTile({ tool }: { tool: PopularTool }) {
  const Icon = tool.icon;
  const spanClass = tool.size === 'lg'
    ? 'col-span-12 md:col-span-6 row-span-2'
    : tool.size === 'md'
      ? 'col-span-12 md:col-span-6 lg:col-span-3 row-span-2'
      : 'col-span-6 md:col-span-4 lg:col-span-2 row-span-1';

  return (
    <Link
      href={tool.href}
      className={`${spanClass} group relative overflow-hidden bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-6px_rgba(16,26,54,0.10)] transition-all duration-150 flex flex-col justify-between`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: `linear-gradient(90deg, ${tool.accent}, ${tool.accent}00)` }}
      />
      <span
        className="inline-flex w-10 h-10 rounded-xl items-center justify-center"
        style={{ background: `${tool.accent}14`, color: tool.accent }}
      >
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <div>
        <h3
          className="font-bold text-[#0A2540] text-[14.5px] md:text-[15px] leading-tight mb-1 tracking-[-0.005em]"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        >
          {tool.title}
        </h3>
        <p className="text-[12px] text-[#45464d] leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
          {tool.desc}
        </p>
        <div className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: tool.accent, fontFamily: 'Inter, sans-serif' }}>
          Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-100" />
        </div>
      </div>
    </Link>
  );
}

function VisaTile({ v, onClick }: { v: VisaCard; onClick: () => void }) {
  const Icon = v.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left bg-white border border-[#E5E7EB] rounded-xl p-5 md:p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-6px_rgba(16,26,54,0.10)] transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <span
          className="inline-flex w-10 h-10 rounded-xl items-center justify-center"
          style={{ background: `${v.accent}14`, color: v.accent }}
        >
          <Icon className="w-[18px] h-[18px]" />
        </span>
        <span
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md"
          style={{ background: `${v.accent}10`, color: v.accent, fontFamily: 'Inter, sans-serif' }}
        >
          {v.meta}
        </span>
      </div>
      <h3
        className="font-bold text-[#0A2540] text-[15px] leading-tight mb-1 tracking-[-0.005em]"
        style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
      >
        {v.title}
      </h3>
      <p className="text-[12.5px] text-[#45464d] leading-snug mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        {v.blurb}
      </p>
      <span
        className="inline-flex items-center gap-1 text-[12.5px] font-semibold group-hover:gap-2 transition-[gap] duration-100"
        style={{ color: v.accent, fontFamily: 'Inter, sans-serif' }}
      >
        View route <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}

/* Re-export unused imports if needed for design consistency */
export const _designTokens = { NAVY, TEAL, GOLD, Globe2, BookOpen, Compass, ArrowUpRight };
