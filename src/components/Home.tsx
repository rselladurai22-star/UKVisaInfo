'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, Rocket, History,
  LayoutGrid, ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, Search,
  Calculator, Compass, Scale, BookOpen, CheckCircle2,
} from 'lucide-react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const VISA_CARDS = [
  { id: 'skilled-worker',    title: 'Skilled Worker',    icon: Briefcase,    blurb: 'Sponsored UK employment — £38,700 threshold',  color: '#d9152b' },
  { id: 'student',           title: 'Student',           icon: GraduationCap,blurb: 'Degree-level study at UK institutions',        color: '#2563eb' },
  { id: 'visitor',           title: 'Standard Visitor',  icon: Plane,        blurb: 'Tourism or business visits up to 6 months',    color: '#0891b2' },
  { id: 'family',            title: 'Family / Spouse',   icon: Users,        blurb: 'Join a settled partner or family member',      color: '#7c3aed' },
  { id: 'health',            title: 'Health & Care',     icon: Stethoscope,  blurb: 'NHS and social care professionals',            color: '#059669' },
  { id: 'talent',            title: 'Global Talent',     icon: LayoutGrid,   blurb: 'Leaders in tech, arts and research',           color: '#d97706' },
  { id: 'innovator-founder', title: 'Innovator Founder', icon: Rocket,       blurb: 'Endorsed startup founders',                    color: '#e11d48' },
  { id: 'graduate',          title: 'Graduate',          icon: History,      blurb: 'Stay 18 months after a UK degree',             color: '#0d9488' },
];

const TOOLS = [
  { label: 'Eligibility quiz',  desc: 'Answer 4 questions, get the right route.',    icon: Compass,    href: '/eligibility',           accent: '#d9152b' },
  { label: 'Salary checker',    desc: 'Check Skilled Worker thresholds by SOC code.',icon: Briefcase,  href: '/tools/salary-checker',  accent: '#0891b2' },
  { label: 'Sponsor search',    desc: 'Find UK employers who can sponsor you.',      icon: Search,     href: '/tools/sponsor-search',  accent: '#2563eb' },
  { label: 'Cost calculator',   desc: 'Estimate fees, IHS and priority services.',   icon: Calculator, href: '/tools/cost-calculator', accent: '#7c3aed' },
  { label: 'Compare routes',    desc: 'Side-by-side comparison of any two visas.',   icon: Scale,      href: '/tools/compare',         accent: '#059669' },
  { label: 'Guides & blog',     desc: '19 long-form articles, updated for 2026.',    icon: BookOpen,   href: '/blog',                  accent: '#d97706' },
];

const STATS = [
  { n: 126530, label: 'Licensed sponsors',    suffix: '' },
  { n: 270,    label: 'SOC codes tracked',    suffix: '' },
  { n: 19,     label: 'In-depth guides',      suffix: '+' },
  { n: 100,    label: 'gov.uk sourced',       suffix: '%' },
];

const FEATURED_GUIDES = [
  { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',         cat: 'Skilled Worker', title: 'UK salary thresholds 2026: the full SOC code breakdown',                   read: '8 min', tone: '#d9152b' },
  { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',       cat: 'Family',         title: 'Family visa £29,000 minimum income: what counts in 2026',                   read: '7 min', tone: '#7c3aed' },
  { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026',   cat: 'Sponsorship',    title: 'How to find a UK sponsor licence holder — a practical guide',               read: '9 min', tone: '#2563eb' },
];

/* ─────────────────────────────────────────────
   HOOKS — scroll reveal + count-up
───────────────────────────────────────────── */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setShown(true); io.disconnect(); }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return { ref, shown };
}

function useCountUp(target: number, durationMs = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0; let started = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / durationMs);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, durationMs]);
  return { ref, val };
}

const fmtNum = (n: number) => n.toLocaleString('en-GB');

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ════════════════════════════════════════
          HERO — editorial, NOT search-first
      ════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden pt-[110px] md:pt-[140px] pb-20 md:pb-28">

        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#d9152b] to-transparent opacity-[0.06] blur-[120px] mesh-orb-1" />
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#2563eb] to-transparent opacity-[0.05] blur-[140px] mesh-orb-2" />
          <div className="absolute -top-20 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#d97706] to-transparent opacity-[0.05] blur-[120px] mesh-orb-3" />
        </div>
        {/* fine grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(10,21,48,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(10,21,48,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">

          <div className="reveal" style={{ animationDelay: '0ms' }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[rgba(14,20,36,0.08)] shadow-[0_2px_8px_rgba(10,21,48,0.04)] text-[#52596e] text-[11px] font-semibold uppercase tracking-[0.1em]">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#d9152b] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#d9152b]" />
              </span>
              Updated May 2026
            </span>
          </div>

          <h1
            className="reveal mt-7 font-display font-bold tracking-[-0.035em] leading-[1.02] text-[2.6rem] sm:text-[3.5rem] md:text-[4.5rem] text-[#0a1530]"
            style={{ animationDelay: '60ms' }}
          >
            Your complete guide<br className="hidden sm:block" />{' '}
            to <span className="gradient-text">UK&nbsp;visas</span>.
          </h1>

          <p
            className="reveal mt-6 max-w-xl mx-auto text-[#52596e] text-base md:text-[1.0625rem] leading-relaxed"
            style={{ animationDelay: '140ms' }}
          >
            Plain-English guidance on every UK visa route — eligibility, fees and official application links, checked against the latest Home Office rules.
          </p>

          <div
            className="reveal mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: '220ms' }}
          >
            <Link
              href="/eligibility"
              className="magnetic group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0a1530] text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-[#13204a] active:scale-[0.98] transition-[background,transform] duration-150 text-[14px] shadow-[0_6px_24px_-6px_rgba(10,21,48,0.5)]"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              Find my visa in 60 seconds
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Link>
            <Link
              href="/visa-types"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-[rgba(14,20,36,0.1)] text-[#0a1530] font-semibold px-7 py-3.5 rounded-2xl hover:bg-[#f4f6fb] hover:border-[rgba(14,20,36,0.16)] transition-colors duration-100 text-[14px]"
            >
              Browse all visa routes
            </Link>
          </div>

          <div
            className="reveal mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[#9aa3b8] text-[11.5px] font-medium"
            style={{ animationDelay: '300ms' }}
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#d9152b]" /> gov.uk sourced</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#d9152b]" /> Updated daily</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#d9152b]" /> Free · No signup</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS — animated counters
      ════════════════════════════════════════ */}
      <StatsStrip />

      {/* ════════════════════════════════════════
          VISA ROUTES
      ════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealBlock>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-3">
                Visa routes
              </span>
              <h2 className="font-display text-[2rem] md:text-[2.6rem] font-bold text-[#0a1530] tracking-[-0.025em] leading-[1.05]">
                Every UK visa, explained.
              </h2>
              <p className="mt-4 text-[#52596e] text-[15px] leading-relaxed">
                Tap any route for eligibility criteria, current fees, and a direct link to the official gov.uk application page.
              </p>
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VISA_CARDS.map((v, i) => (
              <VisaCard
                key={v.id}
                visa={v}
                onClick={() => setActiveVisaId(v.id)}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TOOLS
      ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#fafbfd] border-y border-[rgba(14,20,36,0.06)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealBlock>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-3">
                Free tools
              </span>
              <h2 className="font-display text-[2rem] md:text-[2.6rem] font-bold text-[#0a1530] tracking-[-0.025em] leading-[1.05]">
                Plan your move with confidence.
              </h2>
              <p className="mt-4 text-[#52596e] text-[15px] leading-relaxed">
                Built from official Home Office data — no signup, no paywall.
              </p>
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((t, i) => (
              <ToolCard key={t.label} tool={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED GUIDES — editorial
      ════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealBlock>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-3">
                  Featured
                </span>
                <h2 className="font-display text-[2rem] md:text-[2.6rem] font-bold text-[#0a1530] tracking-[-0.025em] leading-[1.05]">
                  Latest from the blog.
                </h2>
              </div>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 text-[#d9152b] text-sm font-bold hover:gap-2.5 transition-[gap] duration-100"
              >
                Read all guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_GUIDES.map((g, i) => (
              <GuideCard key={g.href} guide={g} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════ */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <RevealBlock>
            <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-9 md:p-14">
              {/* dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.2] pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-[#d9152b]/25 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-[#2563eb]/15 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.14] text-[#ffbf47] text-[10.5px] font-bold uppercase tracking-[0.1em] mb-4">
                    <Sparkles className="w-3 h-3" />
                    Start here
                  </span>
                  <h2 className="font-display text-white font-bold text-[1.75rem] md:text-[2.4rem] leading-[1.05] tracking-[-0.02em]">
                    Not sure where to start?<br />
                    <span className="bg-gradient-to-r from-[#ffbf47] via-[#ff9f43] to-[#ffbf47] bg-clip-text text-transparent">
                      Take the 60-second quiz.
                    </span>
                  </h2>
                  <p className="mt-3 text-white/55 text-[14.5px] leading-relaxed">
                    Four quick questions and we&apos;ll point you at the right UK visa route.
                  </p>
                </div>
                <Link
                  href="/eligibility"
                  className="magnetic flex-shrink-0 inline-flex items-center gap-2 bg-[#d9152b] text-white font-bold px-7 py-4 rounded-2xl hover:bg-[#b8101f] active:scale-[0.98] transition-[background,transform] duration-150 text-[14px] shadow-[0_8px_28px_-4px_rgba(217,21,43,0.5)]"
                >
                  <Compass className="w-4 h-4" />
                  Start eligibility quiz
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {activeVisaId && (
        <VisaDetailModal
          visa={VISA_DETAILS[activeVisaId as keyof typeof VISA_DETAILS]}
          onClose={() => setActiveVisaId(null)}
        />
      )}

      {/* ────────────────────────────────────
         Component-scoped CSS
      ───────────────────────────────────── */}
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(120deg, #d9152b 0%, #e11d48 35%, #d97706 70%, #d9152b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-pan 8s ease-in-out infinite;
        }
        @keyframes gradient-pan {
          0%, 100% { background-position: 0% center; }
          50%      { background-position: 100% center; }
        }

        /* Reveal — fade up on scroll OR initial load */
        .reveal {
          opacity: 0;
          transform: translateY(14px);
          animation: reveal-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes reveal-in {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Gradient mesh orbs — slow drift */
        .mesh-orb-1 { animation: drift1 22s ease-in-out infinite; }
        .mesh-orb-2 { animation: drift2 26s ease-in-out infinite; }
        .mesh-orb-3 { animation: drift3 28s ease-in-out infinite; }
        @keyframes drift1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.05); } }
        @keyframes drift2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,40px) scale(1.08); } }
        @keyframes drift3 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,30px) scale(1.04); } }

        /* Magnetic press */
        .magnetic { will-change: transform; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function RevealBlock({ children }: { children: React.ReactNode }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}

function StatsStrip() {
  return (
    <section className="py-10 md:py-12 border-y border-[rgba(14,20,36,0.06)] bg-[#fafbfd]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {STATS.map((s) => (
            <CountStat key={s.label} target={s.n} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CountStat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, val } = useCountUp(target, 1500);
  return (
    <div className="text-center md:text-left">
      <span
        ref={ref}
        className="font-display block text-[2rem] md:text-[2.6rem] font-bold tracking-[-0.025em] text-[#0a1530] leading-none tabular-nums"
      >
        {fmtNum(val)}{suffix}
      </span>
      <span className="mt-2 block text-[12px] md:text-[13px] text-[#52596e] font-medium">{label}</span>
    </div>
  );
}

function VisaCard({
  visa, onClick, index,
}: {
  visa: typeof VISA_CARDS[number]; onClick: () => void; index: number;
}) {
  const { ref, shown } = useReveal<HTMLButtonElement>();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({ x: x * 4, y: y * -4 });   // subtle
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  const Icon = visa.icon;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown
          ? `translateY(0) perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`
          : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 40}ms, transform 0.25s ease-out${shown ? '' : `, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 40}ms`}`,
        transformStyle: 'preserve-3d',
      }}
      className="group text-left bg-white rounded-3xl border border-[rgba(14,20,36,0.08)] p-6 hover:border-[rgba(14,20,36,0.18)] hover:shadow-[0_18px_40px_-12px_rgba(10,21,48,0.18)] cursor-pointer relative overflow-hidden"
    >
      {/* corner glow on hover */}
      <span
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${visa.color}28 0%, transparent 70%)` }}
        aria-hidden="true"
      />

      <span
        className="inline-flex w-11 h-11 rounded-2xl items-center justify-center mb-5"
        style={{ background: `${visa.color}13`, color: visa.color }}
      >
        <Icon className="w-5 h-5" />
      </span>

      <h3 className="font-display font-bold text-[17px] text-[#0a1530] leading-tight mb-1.5">
        {visa.title}
      </h3>
      <p className="text-[13px] text-[#7a8195] leading-snug mb-5 min-h-[34px]">
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

function ToolCard({
  tool, index,
}: {
  tool: typeof TOOLS[number]; index: number;
}) {
  const { ref, shown } = useReveal<HTMLAnchorElement>();
  const Icon = tool.icon;

  return (
    <Link
      ref={ref}
      href={tool.href}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 40}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 40}ms`,
      }}
      className="group block bg-white rounded-3xl border border-[rgba(14,20,36,0.08)] p-6 hover:border-[rgba(14,20,36,0.18)] hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(10,21,48,0.15)] transition-[transform,border-color,box-shadow] duration-200 relative overflow-hidden"
    >
      {/* gradient accent line on hover */}
      <span
        className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: `linear-gradient(90deg, ${tool.accent}, ${tool.accent}00)` }}
        aria-hidden="true"
      />

      <span
        className="inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
        style={{ background: `${tool.accent}13`, color: tool.accent }}
      >
        <Icon className="w-5 h-5" />
      </span>

      <h3 className="font-display font-bold text-[18px] text-[#0a1530] leading-tight mb-1.5">
        {tool.label}
      </h3>
      <p className="text-[13.5px] text-[#7a8195] leading-relaxed mb-5">
        {tool.desc}
      </p>

      <span
        className="inline-flex items-center gap-1.5 text-[13px] font-bold transition-[gap] duration-150 group-hover:gap-2.5"
        style={{ color: tool.accent }}
      >
        Open tool <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

function GuideCard({
  guide, index,
}: {
  guide: typeof FEATURED_GUIDES[number]; index: number;
}) {
  const { ref, shown } = useReveal<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      href={guide.href}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 50}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 50}ms`,
      }}
      className="group block bg-white rounded-3xl border border-[rgba(14,20,36,0.08)] overflow-hidden hover:border-[rgba(14,20,36,0.18)] hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(10,21,48,0.15)] transition-[transform,border-color,box-shadow] duration-200"
    >
      {/* Editorial header strip with gradient */}
      <div
        className="h-[180px] relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${guide.tone}18 0%, ${guide.tone}06 100%)` }}
      >
        <div
          className="absolute inset-0 opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${guide.tone}55 1px, transparent 0)`,
            backgroundSize: '18px 18px',
          }}
        />
        <span
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-2xl opacity-50 pointer-events-none transition-transform duration-500 group-hover:scale-110"
          style={{ background: `${guide.tone}30` }}
        />
        <div className="relative z-10 h-full flex items-end p-5">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-[0.1em] bg-white"
            style={{ color: guide.tone, border: `1px solid ${guide.tone}30` }}
          >
            {guide.cat}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display font-bold text-[17px] text-[#0a1530] leading-snug min-h-[64px]">
          {guide.title}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11.5px] text-[#9aa3b8] font-medium">{guide.read} read</span>
          <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#d9152b] transition-[gap] duration-100 group-hover:gap-2">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
