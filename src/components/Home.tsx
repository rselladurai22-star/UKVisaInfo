'use client';

/**
 * Home — May 2026 redesign
 *
 * Premium navy + teal + gold editorial layout.
 * Section order:
 *   1. Hero (with abstract UK passport SVG)
 *   2. Trust strip / live update ticker
 *   3. Visa routes (cohesive cards on warm-paper backdrop)
 *   4. Interactive tools (bento)
 *   5. Country guides (flag chips)
 *   6. Featured blog (magazine grid)
 *   7. Updates feed (latest news)
 *   8. Final CTA
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, Rocket, History,
  LayoutGrid, ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, Search,
  Calculator, Compass, Scale, BookOpen, CheckCircle2, Globe2, Flag,
  FileSearch, ListChecks, Newspaper, TrendingUp, Clock, Lock,
} from 'lucide-react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';

/* ─────────────────────────────────────────────
   DATA — all colours from brand palette only
───────────────────────────────────────────── */

const NAVY  = '#0A2540';
const TEAL  = '#00C4B4';
const GOLD  = '#C9A14A';
const NAVY2 = '#13325F';

const VISA_CARDS = [
  { id: 'skilled-worker',    title: 'Skilled Worker',    icon: Briefcase,    blurb: 'Sponsored UK employment',                color: TEAL,  meta: 'from £41,700' },
  { id: 'student',           title: 'Student',           icon: GraduationCap,blurb: 'Degree-level study in the UK',           color: NAVY,  meta: 'from £524' },
  { id: 'visitor',           title: 'Standard Visitor',  icon: Plane,        blurb: 'Tourism or business up to 6 months',     color: GOLD,  meta: 'from £127' },
  { id: 'family',            title: 'Family / Spouse',   icon: Users,        blurb: 'Join a settled UK partner or parent',    color: TEAL,  meta: '£29,000 income' },
  { id: 'health',            title: 'Health & Care',     icon: Stethoscope,  blurb: 'NHS and social care professionals',      color: NAVY,  meta: 'IHS waived' },
  { id: 'talent',            title: 'Global Talent',     icon: LayoutGrid,   blurb: 'Leaders in tech, arts and research',     color: GOLD,  meta: 'No sponsor' },
  { id: 'innovator-founder', title: 'Innovator Founder', icon: Rocket,       blurb: 'Endorsed startup founders',              color: TEAL,  meta: 'Endorsement' },
  { id: 'graduate',          title: 'Graduate',          icon: History,      blurb: 'Stay 18 months after a UK degree',       color: NAVY,  meta: '18 months' },
];

const TOOLS = [
  { label: 'Eligibility quiz',  desc: 'Answer 4 questions, get the right route.',     icon: Compass,    href: '/eligibility',           hue: TEAL },
  { label: 'Salary checker',    desc: 'Skilled Worker thresholds by SOC code.',       icon: Briefcase,  href: '/tools/salary-checker',  hue: NAVY },
  { label: 'Sponsor search',    desc: 'Find UK employers who can sponsor you.',       icon: Search,     href: '/tools/sponsor-search',  hue: TEAL },
  { label: 'Cost calculator',   desc: 'Estimate fees, IHS, dependants and priority.', icon: Calculator, href: '/tools/cost-calculator', hue: GOLD },
  { label: 'Compare routes',    desc: 'Side-by-side comparison of any two visas.',    icon: Scale,      href: '/tools/compare',         hue: NAVY },
  { label: 'Refusal analyzer',  desc: 'Decode a refusal letter and plan next steps.', icon: FileSearch, href: '/tools/refusal-analyzer',hue: TEAL },
];

const COUNTRIES = [
  { slug: 'india',      flag: '🇮🇳', name: 'India',       blurb: 'Top source · TB-test required' },
  { slug: 'nigeria',    flag: '🇳🇬', name: 'Nigeria',     blurb: 'NHS + Skilled Worker focus' },
  { slug: 'pakistan',   flag: '🇵🇰', name: 'Pakistan',    blurb: 'Family + Student routes' },
  { slug: 'philippines',flag: '🇵🇭', name: 'Philippines', blurb: 'Health & Care visa heavy' },
  { slug: 'bangladesh', flag: '🇧🇩', name: 'Bangladesh',  blurb: 'Student + dependants' },
  { slug: 'south-africa',flag: '🇿🇦',name: 'South Africa',blurb: 'Ancestry + Skilled Worker' },
  { slug: 'kenya',      flag: '🇰🇪', name: 'Kenya',       blurb: 'Healthcare workers' },
  { slug: 'sri-lanka',  flag: '🇱🇰', name: 'Sri Lanka',   blurb: 'Student + Skilled Worker' },
];

const FEATURED_GUIDES = [
  {
    href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',
    cat: 'Skilled Worker',
    title: 'UK salary thresholds 2026: the full SOC code breakdown',
    read: '8 min',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop',
  },
  {
    href: '/blog/uk-family-visa-minimum-income-2026-what-counts',
    cat: 'Family',
    title: 'Family visa £29,000 minimum income: what counts in 2026',
    read: '7 min',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop',
  },
  {
    href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026',
    cat: 'Sponsorship',
    title: 'How to find a UK sponsor licence holder — a practical guide',
    read: '9 min',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop',
  },
];

const UPDATES = [
  'eVisa migration deadline closes 31 Dec 2026',
  'Family visa minimum income remains £29,000 for May 2026',
  'IHS rises to £1,035/year for adult applicants',
  'Graduate visa stays 24 months for PhD holders',
  'Skilled Worker general threshold £41,700 from April',
];

const STATS = [
  { value: '126,530', label: 'Licensed sponsors' },
  { value: '270',     label: 'SOC codes tracked' },
  { value: '19+',     label: 'In-depth guides'  },
  { value: '100%',    label: 'gov.uk sourced'   },
];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return { ref, shown };
}

/* Animated counter — counts from 0 to numeric target */
function useCounter(rawValue: string, active: boolean) {
  const num = parseInt(rawValue.replace(/[^\d]/g, ''), 10);
  const suffix = rawValue.replace(/[\d,]/g, '');
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  const startAnim = useCallback(() => {
    if (isNaN(num)) return;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplay(Math.floor(eased * num));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(num);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [num]);

  useEffect(() => {
    if (!active) return;
    startAnim();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, startAnim]);

  if (isNaN(num)) return rawValue;
  return display.toLocaleString() + suffix;
}

/* ─────────────────────────────────────────────
   HERO PASSPORT SVG — abstract, premium
───────────────────────────────────────────── */
function PassportArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 600" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="passportFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0F2C4B" />
          <stop offset="1" stopColor="#06192E" />
        </linearGradient>
        <linearGradient id="tealSweep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00C4B4" stopOpacity="0.4" />
          <stop offset="1" stopColor="#00C4B4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="goldEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C9A14A" />
          <stop offset="1" stopColor="#E6B450" />
        </linearGradient>
      </defs>

      {/* Floating passport */}
      <g transform="translate(70 80) rotate(-6 170 220)">
        <rect x="0" y="0" rx="22" ry="22" width="340" height="440" fill="url(#passportFace)" stroke="rgba(255,255,255,0.06)" />
        <rect x="0" y="0" rx="22" ry="22" width="340" height="440" fill="url(#tealSweep)" />

        {/* gold edge */}
        <rect x="14" y="14" rx="14" ry="14" width="312" height="412" fill="none" stroke="url(#goldEdge)" strokeWidth="1.2" opacity="0.65" />

        {/* crown / crest */}
        <g transform="translate(170 110)">
          <circle r="44" fill="none" stroke="#C9A14A" strokeWidth="1.4" opacity="0.65" />
          <path d="M -28 8 L -14 -18 L 0 6 L 14 -18 L 28 8 L 22 22 L -22 22 Z" fill="none" stroke="#C9A14A" strokeWidth="1.6" />
          <circle r="3.5" fill="#C9A14A" />
        </g>

        {/* heading */}
        <text x="170" y="200" textAnchor="middle" fill="#E6B450" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="3.5" fontWeight="700">
          UNITED KINGDOM
        </text>
        <text x="170" y="222" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontFamily="Inter, sans-serif" fontSize="9.5" letterSpacing="2.8">
          PASSPORT  ·  GREAT BRITAIN
        </text>

        {/* data lines */}
        <g transform="translate(40 270)" stroke="rgba(255,255,255,0.18)" strokeWidth="1">
          <line x1="0" y1="0"  x2="260" y2="0"  />
          <line x1="0" y1="24" x2="220" y2="24" />
          <line x1="0" y1="48" x2="180" y2="48" />
          <line x1="0" y1="72" x2="240" y2="72" />
        </g>

        {/* chip */}
        <g transform="translate(40 360)">
          <rect width="56" height="40" rx="6" fill="none" stroke="#C9A14A" strokeWidth="1.2" opacity="0.7" />
          <line x1="0" y1="13" x2="56" y2="13" stroke="#C9A14A" strokeWidth="0.6" opacity="0.5" />
          <line x1="0" y1="26" x2="56" y2="26" stroke="#C9A14A" strokeWidth="0.6" opacity="0.5" />
          <line x1="28" y1="0" x2="28" y2="40" stroke="#C9A14A" strokeWidth="0.6" opacity="0.5" />
        </g>

        {/* MRZ */}
        <g transform="translate(40 414)" fill="rgba(255,255,255,0.45)" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="1.5">
          <text>P&lt;GBR&lt;&lt;UKVISAINFO&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
        </g>
      </g>

      {/* Approval stamp */}
      <g transform="translate(330 410) rotate(-12)">
        <circle r="58" fill="none" stroke="#00C4B4" strokeWidth="2" opacity="0.85" />
        <circle r="50" fill="none" stroke="#00C4B4" strokeWidth="0.6" opacity="0.6" />
        <text textAnchor="middle" y="-6"  fill="#00C4B4" fontFamily="Inter, sans-serif" fontSize="10" letterSpacing="2" fontWeight="700">APPROVED</text>
        <text textAnchor="middle" y="14"  fill="#00C4B4" fontFamily="Inter, sans-serif" fontSize="8.5" letterSpacing="1.5">MAY · 2026</text>
        <line x1="-30" y1="22" x2="30" y2="22" stroke="#00C4B4" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Abstract Union-Jack hairlines */}
      <g opacity="0.18" stroke="#C9A14A" strokeWidth="1" fill="none">
        <line x1="0" y1="0" x2="480" y2="600" />
        <line x1="480" y1="0" x2="0" y2="600" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);

  return (
    <div className="overflow-x-hidden bg-[#FAFAF7]">

      {/* ════════════════════════════════════════
          1. HERO  — editorial split layout
      ════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden">

        {/* Background mesh */}
        <div className="absolute inset-0 -z-10 hero-paper" />
        <div className="absolute inset-0 -z-10 uk-hairlines opacity-50" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(10,37,64,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(10,37,64,0.35) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-[120px] md:pt-[150px] pb-16 md:pb-28 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="reveal-in" style={{ animationDelay: '0ms' }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hairline shadow-soft text-[11px] font-bold uppercase tracking-[0.12em] text-[#0A2540]">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#00C4B4] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#00C4B4]" />
              </span>
              Updated · May 2026
            </span>

            <h1 className="mt-7 font-display font-bold tracking-[-0.035em] leading-[0.98] text-[#0A2540] text-[2.8rem] sm:text-[3.6rem] lg:text-[4.4rem]">
              The clearest guide to{' '}
              <span className="gradient-text">UK&nbsp;visas</span>{' '}
              you'll ever read.
            </h1>

            <p className="mt-7 max-w-xl text-[#5A6478] text-[1.05rem] md:text-[1.125rem] leading-[1.6]">
              Plain-English guidance on every UK visa route — eligibility,
              fees, processing times and official application links, checked
              line-by-line against the latest Home Office rules.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/eligibility"
                className="group inline-flex items-center justify-center gap-2 bg-[#0A2540] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#13325F] active:scale-[0.98] transition-[background,transform] duration-150 text-[14.5px] shadow-aurora"
              >
                <Sparkles className="w-4 h-4" />
                Start eligibility quiz
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Link>
              <Link
                href="/visa-types"
                className="inline-flex items-center justify-center gap-2 bg-white hairline text-[#0A2540] font-semibold px-6 py-3.5 rounded-full hover:border-[#0A2540] transition-colors duration-150 text-[14.5px]"
              >
                Browse all visa routes
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[#5A6478] text-[12px] font-medium">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#00C4B4]" /> 100% gov.uk sourced</span>
              <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#00C4B4]" /> Independent &amp; free</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#00C4B4]" /> No signup</span>
            </div>
          </div>

          {/* Right — passport art with float animation */}
          <div className="reveal-in relative hidden lg:block" style={{ animationDelay: '120ms' }}>
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,196,180,0.18),transparent_60%)] pointer-events-none" />
            <PassportArt className="float-anim relative w-full h-auto drop-shadow-[0_30px_60px_rgba(10,37,64,0.25)]" />
          </div>
        </div>

        {/* Live updates ticker */}
        <UpdatesTicker />
      </section>

      {/* ════════════════════════════════════════
          2. STATS strip
      ════════════════════════════════════════ */}
      <section className="border-y border-[rgba(10,37,64,0.08)] bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. VISA ROUTES
      ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 paper-grain">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Visa routes" title="Every UK visa, explained." subtitle="Tap any route for eligibility criteria, current fees, processing times and a direct link to the official gov.uk application page." />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VISA_CARDS.map((v, i) => (
              <VisaCard key={v.id} visa={v} index={i} onClick={() => setActiveVisaId(v.id)} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/visa-types" className="inline-flex items-center gap-2 text-[#0A2540] font-semibold text-[14px] hover:gap-3 transition-[gap]">
              View full visa directory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. INTERACTIVE TOOLS
      ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-y border-[rgba(10,37,64,0.08)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Free tools" title="Plan your move with confidence." subtitle="Six free interactive tools built from official Home Office data. No signup, no paywall, no email capture." />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((t, i) => <ToolCard key={t.label} tool={t} index={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. COUNTRY GUIDES — flag chips
      ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 paper-grain">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading eyebrow="Country guides" title="Tailored to your origin." subtitle="Eight in-depth country guides covering top routes, VFS application centres, TB-test rules and country-specific processing times." />
          </Reveal>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COUNTRIES.map((c, i) => (
              <Link
                key={c.slug}
                href={`/from/${c.slug}`}
                className="group lift-on-hover relative overflow-hidden rounded-2xl bg-white hairline p-5 hover:border-[#00C4B4] hover:shadow-card"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Animated gradient wash on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(0,196,180,0.06) 0%, transparent 60%)' }} />
                <div className="flex items-start gap-3">
                  <span
                    className="text-[2.2rem] leading-none flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}
                  >{c.flag}</span>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[15px] text-[#0A2540] leading-tight">From {c.name}</div>
                    <div className="text-[11.5px] text-[#5A6478] mt-1 leading-snug">{c.blurb}</div>
                  </div>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#00C4B4]">
                  Read guide <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/from" className="inline-flex items-center gap-2 text-[#0A2540] font-semibold text-[14px] hover:gap-3 transition-[gap]">
              All country guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          6. FEATURED BLOG
      ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-y border-[rgba(10,37,64,0.08)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <span className="ed-eyebrow text-[#00C4B4]">From the guides</span>
                <h2 className="mt-3 font-display font-bold text-[2rem] md:text-[2.6rem] text-[#0A2540] tracking-[-0.025em] leading-[1.05]">
                  Long-form, fully sourced.
                </h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-[#00C4B4] text-sm font-bold hover:gap-3 transition-[gap]">
                Read all 19 guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_GUIDES.map((g, i) => <GuideCard key={g.href} guide={g} index={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          7. UPDATES FEED
      ════════════════════════════════════════ */}
      <section className="py-20 md:py-24 paper-grain">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-start">
              <div>
                <span className="ed-eyebrow text-[#00C4B4]">News &amp; updates</span>
                <h2 className="mt-3 font-display font-bold text-[1.75rem] md:text-[2.2rem] text-[#0A2540] tracking-[-0.025em] leading-[1.05]">
                  The latest UK visa changes — explained.
                </h2>
                <p className="mt-4 text-[#5A6478] text-[15px] leading-relaxed">
                  Rule changes, fee updates and policy announcements, condensed to a 3-minute weekly read.
                </p>
                <Link href="/news" className="mt-6 inline-flex items-center gap-2 text-[#0A2540] font-semibold text-[14px] hover:gap-3 transition-[gap]">
                  Open the news desk <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="rounded-3xl bg-white hairline shadow-soft divide-y divide-[rgba(10,37,64,0.06)]">
                {UPDATES.map((u, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-4">
                    <Clock className="w-4 h-4 mt-0.5 text-[#00C4B4] flex-shrink-0" />
                    <span className="text-[14px] text-[#0A2540] leading-snug">{u}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          8. FINAL CTA
      ════════════════════════════════════════ */}
      <section className="pb-20 md:pb-28 pt-4">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] hero-dark p-9 md:p-14">
              <div className="absolute inset-0 dot-pattern opacity-[0.20] pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-[#00C4B4]/30 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-[#C9A14A]/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-7 md:gap-10">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/[0.12] text-[#C9A14A] text-[10.5px] font-bold uppercase tracking-[0.1em] mb-4">
                    <Sparkles className="w-3 h-3" /> Start here
                  </span>
                  <h2 className="font-display text-white font-bold text-[1.85rem] md:text-[2.5rem] leading-[1.05] tracking-[-0.02em]">
                    Not sure where to start?<br />
                    <span className="bg-gradient-to-r from-[#C9A14A] via-[#E6B450] to-[#00C4B4] bg-clip-text text-transparent">
                      Take the 60-second quiz.
                    </span>
                  </h2>
                  <p className="mt-4 text-white/60 text-[14.5px] leading-relaxed">
                    Four questions. We'll point you at the right UK visa route — with cost, eligibility and official gov.uk link.
                  </p>
                </div>
                <Link
                  href="/eligibility"
                  className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-[#00C4B4] text-[#06192E] font-bold px-7 py-4 rounded-full hover:bg-[#5EEAD9] active:scale-[0.98] transition-[background,transform] duration-150 text-[14.5px] shadow-[0_10px_32px_-6px_rgba(0,196,180,0.55)]"
                >
                  <Compass className="w-4 h-4" />
                  Start eligibility quiz
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {activeVisaId && (
        <VisaDetailModal
          visa={VISA_DETAILS[activeVisaId as keyof typeof VISA_DETAILS]}
          onClose={() => setActiveVisaId(null)}
        />
      )}

      <style jsx>{`
        .reveal-in {
          opacity: 0;
          transform: translateY(14px);
          animation: reveal-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes reveal-in {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function StatCard({ stat }: { stat: { value: string; label: string } }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const animated = useCounter(stat.value, shown);
  return (
    <div ref={ref} className="text-center md:text-left">
      <div
        className="font-display font-bold text-[2rem] md:text-[2.4rem] text-[#0A2540] tracking-[-0.025em] leading-none tabular-nums"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {animated}
      </div>
      <div className="mt-2 text-[12.5px] text-[#5A6478] font-medium">{stat.label}</div>
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-2xl">
      <span className="ed-eyebrow text-[#00C4B4]">{eyebrow}</span>
      <h2 className="mt-3 font-display font-bold text-[2rem] md:text-[2.6rem] text-[#0A2540] tracking-[-0.025em] leading-[1.05]">
        {title}
      </h2>
      <p className="mt-4 text-[#5A6478] text-[15px] md:text-[16px] leading-relaxed">{subtitle}</p>
    </div>
  );
}

function VisaCard({
  visa, index, onClick,
}: {
  visa: typeof VISA_CARDS[number]; index: number; onClick: () => void;
}) {
  const { ref, shown } = useReveal<HTMLButtonElement>();
  const Icon = visa.icon;
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 45}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 45}ms`,
      }}
      className="group text-left bg-white hairline rounded-3xl p-6 lift-on-hover hover:border-[#00C4B4] hover:shadow-card relative overflow-hidden"
    >
      {/* Animated color wash on hover */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 120% 120% at 90% -10%, ${visa.color}10 0%, transparent 60%)` }}
        aria-hidden="true"
      />
      {/* Top accent line */}
      <span
        className="absolute inset-x-0 top-0 h-[2.5px] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, ${visa.color}, ${visa.color}40)` }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between mb-6">
        <span
          className="inline-flex w-11 h-11 rounded-2xl items-center justify-center"
          style={{ background: `${visa.color}15`, color: visa.color }}
        >
          <Icon className="w-5 h-5" />
        </span>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#5A6478]">
          {visa.meta}
        </span>
      </div>

      <h3 className="font-display font-bold text-[17.5px] text-[#0A2540] leading-tight mb-1.5">
        {visa.title}
      </h3>
      <p className="text-[13px] text-[#5A6478] leading-snug mb-5 min-h-[34px]">
        {visa.blurb}
      </p>

      <span
        className="inline-flex items-center gap-1.5 text-[12.5px] font-bold transition-[gap] duration-150 group-hover:gap-2.5"
        style={{ color: visa.color }}
      >
        Explore route <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}

function ToolCard({ tool, index }: { tool: typeof TOOLS[number]; index: number }) {
  const { ref, shown } = useReveal<HTMLAnchorElement>();
  const Icon = tool.icon;
  return (
    <Link
      ref={ref}
      href={tool.href}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 45}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 45}ms`,
      }}
      className="group lift-on-hover bg-white hairline rounded-3xl p-6 hover:border-[#0A2540] hover:shadow-card relative overflow-hidden"
    >
      <span
        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: `linear-gradient(90deg, ${tool.hue}, ${tool.hue}00)` }}
        aria-hidden="true"
      />

      <span
        className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${tool.hue}15`, color: tool.hue }}
      >
        <Icon className="w-5 h-5" />
      </span>

      <h3 className="font-display font-bold text-[18px] text-[#0A2540] leading-tight mb-1.5">
        {tool.label}
      </h3>
      <p className="text-[13.5px] text-[#5A6478] leading-relaxed mb-5">
        {tool.desc}
      </p>

      <span
        className="inline-flex items-center gap-1.5 text-[13px] font-bold transition-[gap] duration-150 group-hover:gap-2.5"
        style={{ color: tool.hue }}
      >
        Open tool <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

function GuideCard({ guide, index }: { guide: typeof FEATURED_GUIDES[number]; index: number }) {
  const { ref, shown } = useReveal<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      href={guide.href}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 60}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 60}ms`,
      }}
      className="group lift-on-hover block bg-white hairline rounded-3xl overflow-hidden hover:border-[#0A2540] hover:shadow-card"
    >
      {/* Thumbnail image */}
      <div className="h-[180px] relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#13325F] to-[#0F2C4B]">
        <Image
          src={guide.image}
          alt={guide.title}
          fill
          className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06192E]/80 via-transparent to-transparent" />
        {/* Teal / gold blobs */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#00C4B4]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 bottom-0 w-40 h-40 rounded-full bg-[#C9A14A]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 h-full flex items-end p-5">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-[0.1em] bg-white/[0.12] border border-white/[0.22] text-[#E6B450] backdrop-blur-sm">
            {guide.cat}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display font-bold text-[17px] text-[#0A2540] leading-snug min-h-[64px]">
          {guide.title}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11.5px] text-[#5A6478] font-medium">{guide.read} read</span>
          <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#00C4B4] transition-[gap] duration-100 group-hover:gap-2">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function UpdatesTicker() {
  const items = [
    'Updated · May 2026',
    'eVisa deadline · 31 Dec 2026',
    'Family income · £29,000',
    'IHS · £1,035 / year',
    'Skilled Worker · £41,700',
    'Graduate visa · 24 mo (PhD)',
  ];
  return (
    <div className="relative border-t border-[rgba(10,37,64,0.08)] bg-white">
      <div className="max-w-7xl mx-auto overflow-hidden mask-fade">
        <div className="ticker flex gap-10 whitespace-nowrap py-3.5">
          {[...items, ...items, ...items].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#5A6478]">
              <TrendingUp className="w-3 h-3 text-[#00C4B4]" />
              {t}
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        .ticker { animation: ticker 38s linear infinite; }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
