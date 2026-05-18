'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, Rocket, History, LayoutGrid,
  ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, RefreshCw, BookOpen, Calculator, Compass,
  CheckCircle2, Search, Scale,
} from 'lucide-react';
import { motion } from 'motion/react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';
import AnimatedCounter from './AnimatedCounter';

const VISA_CARDS = [
  {
    id: 'skilled-worker', title: 'Skilled Worker', icon: Briefcase,
    blurb: 'Sponsored employment · £38,700 salary threshold',
    color: '#d9152b', bg: 'rgba(217,21,43,0.07)',
  },
  {
    id: 'student', title: 'Student', icon: GraduationCap,
    blurb: 'Degree-level study at UK institutions',
    color: '#2563eb', bg: 'rgba(37,99,235,0.07)',
  },
  {
    id: 'visitor', title: 'Visitor', icon: Plane,
    blurb: 'Tourism or business visits up to 6 months',
    color: '#0891b2', bg: 'rgba(8,145,178,0.07)',
  },
  {
    id: 'family', title: 'Family', icon: Users,
    blurb: 'Spouse, partner and dependants',
    color: '#7c3aed', bg: 'rgba(124,58,237,0.07)',
  },
  {
    id: 'health', title: 'Health & Care', icon: Stethoscope,
    blurb: 'NHS and social care professionals',
    color: '#059669', bg: 'rgba(5,150,105,0.07)',
  },
  {
    id: 'talent', title: 'Global Talent', icon: LayoutGrid,
    blurb: 'Leaders in tech, arts and research',
    color: '#d97706', bg: 'rgba(217,119,6,0.07)',
  },
  {
    id: 'innovator-founder', title: 'Innovator Founder', icon: Rocket,
    blurb: 'Endorsed startup founders',
    color: '#e11d48', bg: 'rgba(225,29,72,0.07)',
  },
  {
    id: 'graduate', title: 'Graduate', icon: History,
    blurb: 'Stay 18 months after a UK degree',
    color: '#0d9488', bg: 'rgba(13,148,136,0.07)',
  },
];

const TOOLS = [
  {
    label: 'Eligibility quiz',
    desc: 'Answer 4 quick questions to find the right visa route for you.',
    icon: Compass,
    href: '/eligibility',
    cta: 'Start quiz',
    accent: '#d9152b',
    tint: 'rgba(217,21,43,0.07)',
  },
  {
    label: 'Salary checker',
    desc: 'Check if your offered salary clears the Skilled Worker threshold by SOC code.',
    icon: Briefcase,
    href: '/tools/salary-checker',
    cta: 'Check salary',
    accent: '#0891b2',
    tint: 'rgba(8,145,178,0.07)',
  },
  {
    label: 'Sponsor search',
    desc: 'Find UK employers who hold a Skilled Worker sponsor licence.',
    icon: Search,
    href: '/tools/sponsor-search',
    cta: 'Find sponsors',
    accent: '#2563eb',
    tint: 'rgba(37,99,235,0.07)',
  },
  {
    label: 'Cost calculator',
    desc: 'Estimate Home Office fees, IHS and priority services for any route.',
    icon: Calculator,
    href: '/tools/cost-calculator',
    cta: 'Calculate',
    accent: '#7c3aed',
    tint: 'rgba(124,58,237,0.07)',
  },
  {
    label: 'Compare visas',
    desc: 'Side-by-side comparison of any two UK visa routes.',
    icon: Scale,
    href: '/tools/compare',
    cta: 'Compare',
    accent: '#059669',
    tint: 'rgba(5,150,105,0.07)',
  },
  {
    label: 'Guides & blog',
    desc: '19 in-depth articles on UK visa rules, updated for 2026 thresholds.',
    icon: BookOpen,
    href: '/blog',
    cta: 'Read guides',
    accent: '#d97706',
    tint: 'rgba(217,119,6,0.07)',
  },
];

const STATS = [
  { v: 19, suf: '+', label: 'Long-form guides' },
  { v: 6, suf: '', label: 'Interactive tools' },
  { v: 8, suf: '', label: 'Visa routes covered' },
  { v: 100, suf: '%', label: 'gov.uk sourced' },
];

const QUIZ_STEPS = [
  'Pick your purpose (work, study, family, visit)',
  'Tell us where you currently are',
  'Confirm your nationality',
  'Get your personalised visa recommendation',
];

export default function Home() {
  const router = useRouter();
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);

  return (
    <div className="flex flex-col bg-white">

      {/* ── HERO ── */}
      <section className="relative isolate overflow-hidden hero-dark pt-[90px] md:pt-[106px] pb-20 md:pb-28">
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-white/75 text-[11px] font-semibold uppercase tracking-[0.1em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffbf47] animate-pulse" />
              Updated May 2026
            </span>

            <h1 className="mt-7 font-display text-white font-bold tracking-[-0.03em] leading-[1.04] text-[2.6rem] sm:text-[3.25rem] md:text-[4.25rem]">
              Your complete guide<br className="hidden sm:block" /> to UK visas
            </h1>

            <p className="mt-6 max-w-xl mx-auto text-white/58 text-base md:text-[1.0625rem] leading-relaxed">
              Plain-English guidance on every UK visa route — eligibility, fees and official
              application links, checked against the latest Home Office rules.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push('/eligibility')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#d9152b] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#b8101f] active:scale-[0.98] transition-all text-sm shadow-[0_2px_12px_rgba(217,21,43,0.45)]"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                Find my visa in 60 seconds
              </button>
              <button
                onClick={() => router.push('/visa-types')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/[0.08] border border-white/[0.14] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/[0.13] transition-all text-sm"
              >
                Browse all visa routes
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 text-white/40 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffbf47]" />
                gov.uk sourced
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#ffbf47]" />
                Reviewed monthly
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ffbf47]" />
                8 visa routes covered
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VISA CATEGORY CARDS ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#d9152b]">
                Visa routes
              </span>
              <h2 className="mt-2 font-display text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-bold text-[#0a1530] leading-tight">
                Which visa do you need?
              </h2>
              <p className="mt-2.5 text-[#52596e] text-sm md:text-base max-w-lg leading-relaxed">
                Tap any route for fees, eligibility requirements and official application links.
              </p>
            </div>
            <button
              onClick={() => router.push('/visa-types')}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a1530] hover:text-[#d9152b] transition-colors whitespace-nowrap"
            >
              View all routes <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"
          >
            {VISA_CARDS.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => setActiveVisaId(c.id)}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } },
                }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="group relative text-left bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-5 md:p-6 shadow-soft hover:shadow-card transition-all overflow-hidden"
              >
                {/* Top colour bar */}
                <div
                  className="absolute top-0 inset-x-0 h-[3px]"
                  style={{ background: c.color }}
                />
                {/* Icon */}
                <span
                  className="inline-flex w-10 h-10 items-center justify-center rounded-xl mb-4"
                  style={{ background: c.bg }}
                >
                  <c.icon className="w-5 h-5" style={{ color: c.color }} />
                </span>
                <div className="font-display font-bold text-[0.9375rem] md:text-[1.0625rem] text-[#0a1530] leading-snug">
                  {c.title}
                </div>
                <p className="mt-1.5 text-[0.75rem] text-[#52596e] leading-relaxed line-clamp-2">
                  {c.blurb}
                </p>
                <span
                  className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ color: c.color }}
                >
                  View guide
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="py-14 bg-[#f3f5fb] border-y border-[rgba(14,20,36,0.07)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="text-center"
              >
                <div className="font-display text-[2.5rem] md:text-[3rem] font-bold text-[#0a1530] tabular-nums leading-none">
                  <AnimatedCounter to={s.v} suffix={s.suf} />
                </div>
                <div className="mt-2 text-[11px] text-[#52596e] font-semibold tracking-[0.07em] uppercase">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVERYTHING INSIDE ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#d9152b]">
                Everything inside
              </span>
              <h2 className="mt-2 font-display text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-bold text-[#0a1530] leading-tight">
                Free tools &amp; long-form guides
              </h2>
              <p className="mt-2.5 text-[#52596e] text-sm md:text-base max-w-lg leading-relaxed">
                Six interactive tools and 19 deep-dive articles — all free,
                no signup. Built on official Home Office data.
              </p>
            </div>
            <button
              onClick={() => router.push('/tools')}
              className="self-start md:self-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a1530] hover:text-[#d9152b] transition-colors whitespace-nowrap"
            >
              All tools
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {TOOLS.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => router.push(t.href)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden text-left bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-6 md:p-7 shadow-soft hover:shadow-card transition-all"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-70 blur-2xl"
                  style={{ background: t.tint }}
                />
                <div className="relative z-10">
                  <span
                    className="inline-flex w-11 h-11 items-center justify-center rounded-xl mb-5"
                    style={{ background: t.tint, color: t.accent }}
                  >
                    <t.icon className="w-5 h-5" />
                  </span>
                  <div className="font-display font-bold text-[1.0625rem] md:text-[1.125rem] text-[#0a1530]">
                    {t.label}
                  </div>
                  <p className="mt-1.5 text-[13px] text-[#52596e] leading-relaxed">
                    {t.desc}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                    style={{ color: t.accent }}
                  >
                    {t.cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY CTA BAND ── */}
      <section className="py-20 md:py-28 bg-[#f3f5fb]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative overflow-hidden hero-dark rounded-2xl md:rounded-3xl p-9 md:p-14 shadow-card"
          >
            <div className="dot-pattern absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <h2 className="font-display text-white text-[1.75rem] md:text-[2.5rem] font-bold leading-tight tracking-tight">
                  Not sure which visa you need?
                </h2>
                <p className="mt-4 text-white/55 text-sm md:text-base leading-relaxed">
                  Our 4-step eligibility check matches you to the right route in under a minute.
                  Free, no sign-up, no commitment.
                </p>
                <button
                  onClick={() => router.push('/eligibility')}
                  className="mt-7 inline-flex items-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-6 py-3.5 rounded-xl hover:bg-[#ffd166] active:scale-[0.98] transition-all text-sm shadow-[0_2px_12px_rgba(255,191,71,0.35)]"
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  Start eligibility check
                </button>
              </div>
              <ul className="space-y-3.5">
                {QUIZ_STEPS.map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/20 text-white/70 font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-white/75 text-sm leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <VisaDetailModal
        visa={activeVisaId ? VISA_DETAILS[activeVisaId] ?? null : null}
        onClose={() => setActiveVisaId(null)}
      />
    </div>
  );
}
