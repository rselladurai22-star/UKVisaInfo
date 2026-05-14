'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, Rocket, History,
  LayoutGrid, ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, RefreshCw,
  CheckCircle2, BookOpen, Calculator, Compass, Search, Star,
} from 'lucide-react';
import { motion } from 'motion/react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';
import AnimatedCounter from './AnimatedCounter';

const VISA_CARDS = [
  { id: 'skilled-worker', title: 'Skilled Worker', icon: Briefcase, blurb: 'Sponsored work in the UK', tone: 'primary' },
  { id: 'student', title: 'Student', icon: GraduationCap, blurb: 'Degree-level study', tone: 'accent' },
  { id: 'visitor', title: 'Visitor', icon: Plane, blurb: 'Up to 6 months tourism / business', tone: 'neutral' },
  { id: 'family', title: 'Family', icon: Users, blurb: 'Spouse, partner & dependants', tone: 'rose' },
  { id: 'health', title: 'Health & Care', icon: Stethoscope, blurb: 'NHS & social care roles', tone: 'cyan' },
  { id: 'talent', title: 'Global Talent', icon: LayoutGrid, blurb: 'Leaders in research, tech, arts', tone: 'violet' },
  { id: 'innovator-founder', title: 'Innovator Founder', icon: Rocket, blurb: 'Startup founders', tone: 'amber' },
  { id: 'graduate', title: 'Graduate', icon: History, blurb: 'Stay 18 months post-study', tone: 'green' },
];

const TONE_BG: Record<string, string> = {
  primary: 'bg-gradient-to-br from-primary to-primary-container text-white',
  accent: 'bg-gradient-to-br from-accent/30 to-accent/10 text-primary',
  rose: 'bg-gradient-to-br from-secondary/15 to-secondary/5 text-primary',
  neutral: 'bg-gradient-to-br from-surface-container-low to-surface-container text-primary',
  cyan: 'bg-gradient-to-br from-sky-100 to-cyan-50 text-primary',
  violet: 'bg-gradient-to-br from-violet-100 to-indigo-50 text-primary',
  amber: 'bg-gradient-to-br from-amber-100 to-orange-50 text-primary',
  green: 'bg-gradient-to-br from-emerald-100 to-green-50 text-primary',
};

export default function Home() {
  const router = useRouter();
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {/* ────── HERO ────── */}
      <section className="relative isolate overflow-hidden mesh-bg pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="aurora" aria-hidden="true" />
        <div className="dot-pattern absolute inset-0 opacity-50" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 text-white/90 text-[11px] font-semibold uppercase tracking-widest rounded-full backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Updated April 2026
            </span>

            <h1 className="font-display text-white text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mt-6">
              The clear way to{' '}
              <span className="gradient-text">your UK visa</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-white/70 text-base md:text-xl leading-relaxed">
              Plain-English guides on every UK visa route. Eligibility,
              costs and official application links — checked against the
              latest Home Office rules.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push('/eligibility')}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-secondary text-white font-semibold px-6 py-3.5 rounded-2xl shadow-glow hover:translate-y-[-2px] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Find my visa in 60 seconds
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => router.push('/visa-types')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-white/15 transition-all"
              >
                Browse all visas
              </button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-white/55 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> gov.uk sourced
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-accent" /> Reviewed monthly
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-accent" /> 8 visa routes covered
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────── BENTO GRID — visa categories ────── */}
      <section className="py-16 md:py-24 mesh-bg-light">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-secondary mb-3">
              Visa routes
            </span>
            <h2 className="text-primary text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Which visa do you need?
            </h2>
            <p className="mt-4 text-on-surface-variant text-base md:text-lg leading-relaxed">
              Tap any route for fees, eligibility, processing times and an
              official gov.uk application link.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5"
          >
            {VISA_CARDS.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => setActiveVisaId(c.id)}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 18, stiffness: 220 } },
                }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative overflow-hidden rounded-3xl p-5 md:p-7 text-left shadow-soft hover:shadow-card transition-shadow ${TONE_BG[c.tone]}`}
              >
                <div className="relative z-10">
                  <span className={`inline-flex w-11 h-11 items-center justify-center rounded-2xl ${c.tone === 'primary' ? 'bg-white/10' : 'bg-white/60'} mb-5`}>
                    <c.icon className={`w-5 h-5 ${c.tone === 'primary' ? 'text-accent' : 'text-secondary'}`} />
                  </span>
                  <div className="font-display font-bold text-lg md:text-xl leading-tight">
                    {c.title}
                  </div>
                  <p className={`mt-1.5 text-xs md:text-sm leading-snug ${c.tone === 'primary' ? 'text-white/65' : 'text-on-surface-variant'}`}>
                    {c.blurb}
                  </p>
                  <span className={`mt-5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest ${c.tone === 'primary' ? 'text-accent' : 'text-secondary'}`}>
                    View <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────── 3 TOOLS BENTO ────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Eligibility */}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -4 }}
              onClick={() => router.push('/eligibility')}
              className="group relative overflow-hidden bg-primary text-white rounded-3xl p-7 md:p-9 text-left shadow-card md:row-span-2 md:col-span-1 flex flex-col justify-between min-h-[280px]"
            >
              <div className="aurora opacity-60" aria-hidden="true" />
              <div className="relative z-10">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-white/10 mb-6">
                  <Compass className="w-6 h-6 text-accent" />
                </span>
                <div className="font-display font-bold text-2xl md:text-3xl leading-tight">
                  Eligibility quiz
                </div>
                <p className="mt-3 text-white/65 text-sm md:text-base leading-relaxed">
                  Answer 4 quick questions about your nationality, current
                  location and purpose. Get personalised visa
                  recommendations in under a minute.
                </p>
              </div>
              <span className="relative z-10 mt-8 inline-flex items-center gap-2 text-accent text-sm font-bold">
                Start the quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            {/* Costs */}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -4 }}
              onClick={() => router.push('/costs')}
              className="group bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 md:p-7 text-left shadow-soft hover:shadow-card transition-shadow"
            >
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-secondary-soft mb-5">
                <Calculator className="w-5 h-5 text-secondary" />
              </span>
              <div className="font-display font-bold text-lg md:text-xl text-primary">
                Cost calculator
              </div>
              <p className="mt-1.5 text-on-surface-variant text-sm leading-snug">
                Add up fees, IHS and priority services for your route.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-secondary text-xs font-bold uppercase tracking-widest">
                Calculate <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.button>

            {/* Blog */}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -4 }}
              onClick={() => router.push('/blog')}
              className="group bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 md:p-7 text-left shadow-soft hover:shadow-card transition-shadow"
            >
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-secondary-soft mb-5">
                <BookOpen className="w-5 h-5 text-secondary" />
              </span>
              <div className="font-display font-bold text-lg md:text-xl text-primary">
                Long-form guides
              </div>
              <p className="mt-1.5 text-on-surface-variant text-sm leading-snug">
                16 deep-dive articles on the rules behind your application.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-secondary text-xs font-bold uppercase tracking-widest">
                Read <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.button>

            {/* All visas */}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -4 }}
              onClick={() => router.push('/visa-types')}
              className="group bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 md:p-7 text-left shadow-soft hover:shadow-card transition-shadow md:col-span-2"
            >
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-secondary-soft mb-5">
                <Search className="w-5 h-5 text-secondary" />
              </span>
              <div className="font-display font-bold text-lg md:text-xl text-primary">
                Browse all visa routes
              </div>
              <p className="mt-1.5 text-on-surface-variant text-sm leading-snug max-w-md">
                Complete directory with fees, processing times, and direct
                links to the official gov.uk application portal.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-secondary text-xs font-bold uppercase tracking-widest">
                Open directory <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ────── STATS STRIP ────── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { v: 16, suf: '+', label: 'Long-form guides' },
              { v: 8, suf: '', label: 'Visa routes covered' },
              { v: 190, suf: '+', label: 'Nationalities supported' },
              { v: 100, suf: '%', label: 'gov.uk sourced' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 md:p-7 text-center shadow-soft"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight">
                  <AnimatedCounter to={s.v} suffix={s.suf} />
                </div>
                <div className="mt-2 text-[11px] md:text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── CTA BAND ────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative overflow-hidden bg-primary text-white rounded-3xl md:rounded-[2rem] p-8 md:p-16 shadow-card"
          >
            <div className="aurora opacity-50" aria-hidden="true" />
            <div className="dot-pattern absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative z-10 grid md:grid-cols-5 gap-8 md:gap-12 items-center">
              <div className="md:col-span-3">
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                  Not sure which visa you need?
                </h2>
                <p className="mt-4 text-white/65 text-base md:text-lg leading-relaxed">
                  Our 4-step eligibility check matches you to the right
                  route in under a minute. Free, no signup, no commitment.
                </p>
              </div>
              <div className="md:col-span-2 space-y-3">
                {[
                  '1. Pick your purpose',
                  '2. Tell us where you are',
                  '3. Confirm nationality',
                  '4. Get tailored route',
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm md:text-base"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-white/85">{step}</span>
                  </div>
                ))}
                <button
                  onClick={() => router.push('/eligibility')}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-accent text-primary font-bold py-3.5 rounded-2xl hover:translate-y-[-2px] transition-transform shadow-soft"
                >
                  <Sparkles className="w-4 h-4" />
                  Start eligibility check
                </button>
              </div>
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
