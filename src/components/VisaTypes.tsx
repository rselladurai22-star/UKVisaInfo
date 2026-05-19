'use client';

import { useState } from 'react';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, Rocket, History,
  LayoutGrid, ArrowRight, ExternalLink, Sparkles, Clock, Banknote,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';

type Category = 'All' | 'Work' | 'Study' | 'Family' | 'Visit';

const CATEGORY_COLORS: Record<Category, string> = {
  All: '#d9152b',
  Work: '#d9152b',
  Study: '#2563eb',
  Family: '#7c3aed',
  Visit: '#0891b2',
};

const visas = [
  {
    id: 'skilled-worker', category: 'Work' as Category, icon: Briefcase,
    title: 'Skilled Worker Visa',
    desc: 'For sponsored work in the UK at RQF Level 3+ roles. Raised salary thresholds from April 2026.',
    salary: '£41,700 min', duration: 'Up to 5 years',
    url: 'https://www.gov.uk/skilled-worker-visa',
    color: '#d9152b',
  },
  {
    id: 'student', category: 'Study' as Category, icon: GraduationCap,
    title: 'Student Visa',
    desc: 'For applicants aged 16+ with a confirmed offer from a UK Higher Education Provider.',
    salary: 'Maintenance proof', duration: 'Duration of course',
    url: 'https://www.gov.uk/student-visa',
    color: '#2563eb',
  },
  {
    id: 'visitor', category: 'Visit' as Category, icon: Plane,
    title: 'Standard Visitor',
    desc: 'Tourism, short study courses, or business meetings — up to 6 months per visit.',
    salary: 'N/A', duration: 'Up to 6 months',
    url: 'https://www.gov.uk/standard-visitor',
    color: '#0891b2',
  },
  {
    id: 'family', category: 'Family' as Category, icon: Users,
    title: 'Family Visa',
    desc: 'Join a UK-settled partner, spouse or family member. Includes spouse and partner routes.',
    salary: '£29,000', duration: '2.5 years (renewable)',
    url: 'https://www.gov.uk/uk-family-visa',
    color: '#7c3aed',
  },
  {
    id: 'talent', category: 'Work' as Category, icon: LayoutGrid,
    title: 'Global Talent',
    desc: 'For endorsed leaders or future leaders in technology, arts, research and academia.',
    salary: 'N/A', duration: 'Up to 5 years',
    url: 'https://www.gov.uk/global-talent',
    color: '#d97706',
  },
  {
    id: 'health', category: 'Work' as Category, icon: Stethoscope,
    title: 'Health and Care',
    desc: 'Fast-track for NHS roles and allied health professionals. IHS exempt.',
    salary: '£25,000 min', duration: 'Up to 5 years',
    url: 'https://www.gov.uk/health-care-worker-visa',
    color: '#059669',
  },
  {
    id: 'graduate', category: 'Study' as Category, icon: History,
    title: 'Graduate Visa',
    desc: 'Stay 18 months after completing a UK degree (3 years for PhD graduates). No sponsor needed.',
    salary: 'N/A', duration: '18 months / 3 yrs',
    url: 'https://www.gov.uk/graduate-visa',
    color: '#0d9488',
  },
  {
    id: 'innovator-founder', category: 'Work' as Category, icon: Rocket,
    title: 'Innovator Founder',
    desc: 'For entrepreneurs with an endorsed innovative business idea. No minimum investment required.',
    salary: 'N/A', duration: 'Up to 3 years',
    url: 'https://www.gov.uk/innovator-founder-visa',
    color: '#e11d48',
  },
  {
    id: 'youth', category: 'Work' as Category, icon: Plane,
    title: 'Youth Mobility Scheme',
    desc: '18–30 year olds from eligible countries can live and work freely in the UK.',
    salary: '£2,530 savings', duration: 'Up to 2 years',
    url: 'https://www.gov.uk/youth-mobility',
    color: '#d97706',
  },
  {
    id: 'ancestry', category: 'Family' as Category, icon: History,
    title: 'UK Ancestry Visa',
    desc: 'For Commonwealth citizens who have a UK-born grandparent.',
    salary: 'Maintenance proof', duration: '5 years',
    url: 'https://www.gov.uk/ancestry-visa',
    color: '#7c3aed',
  },
];

const CATEGORIES: Category[] = ['All', 'Work', 'Study', 'Family', 'Visit'];

export default function VisaTypes() {
  const [filter, setFilter] = useState<Category>('All');
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);

  const filtered = filter === 'All' ? visas : visas.filter((v) => v.category === filter);
  const activeColor = CATEGORY_COLORS[filter];

  return (
    <>
      {/* Page hero */}
      <section className="pt-[88px] md:pt-[104px] pb-12 md:pb-16 hero-light">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#d9152b]">
            Directory
          </span>
          <h1 className="mt-2 font-display text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold text-[#0a1530] tracking-tight leading-tight">
            Every UK visa route, at a glance
          </h1>
          <p className="mt-3 max-w-2xl text-[#52596e] text-base md:text-lg leading-relaxed">
            Browse 10+ visa routes with fees, duration and direct links to the official
            gov.uk application portal.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[62px] md:top-[70px] z-20 bg-white/92 backdrop-blur-xl border-b border-[rgba(14,20,36,0.08)] shadow-[0_1px_0_rgba(14,20,36,0.05)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3 overflow-x-auto mask-fade">
          <div className="flex items-center gap-2 min-w-min">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`relative whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === c
                    ? 'text-white shadow-sm'
                    : 'bg-transparent text-[#52596e] hover:text-[#0a1530] hover:bg-[rgba(14,20,36,0.05)]'
                }`}
                style={filter === c ? { background: CATEGORY_COLORS[c] } : {}}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            >
              {filtered.map((visa, i) => (
                <motion.article
                  key={visa.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', damping: 22, stiffness: 200 }}
                  className="group bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl shadow-soft hover:shadow-card hover:-translate-y-1 transition-all overflow-hidden"
                >
                  {/* Coloured left accent border */}
                  <div
                    className="h-[3px] w-full"
                    style={{ background: visa.color }}
                  />

                  <div className="p-6 md:p-7">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <span
                        className="inline-flex w-11 h-11 items-center justify-center rounded-xl flex-shrink-0"
                        style={{ background: `${visa.color}12` }}
                      >
                        <visa.icon className="w-5 h-5" style={{ color: visa.color }} />
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full mt-0.5 flex-shrink-0"
                        style={{ background: `${visa.color}12`, color: visa.color }}
                      >
                        {visa.category}
                      </span>
                    </div>

                    <h3 className="font-display text-[1.0625rem] md:text-[1.125rem] font-bold text-[#0a1530] leading-snug">
                      {visa.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#52596e] leading-relaxed">
                      {visa.desc}
                    </p>

                    {/* Key stats */}
                    <dl className="mt-5 grid grid-cols-2 gap-3">
                      <div className="bg-[#f9fafb] rounded-xl px-3 py-2.5">
                        <dt className="flex items-center gap-1 text-[10px] text-[#52596e] font-semibold uppercase tracking-wider mb-1">
                          <Banknote className="w-3 h-3" /> Salary
                        </dt>
                        <dd className="text-sm font-bold text-[#0a1530]">{visa.salary}</dd>
                      </div>
                      <div className="bg-[#f9fafb] rounded-xl px-3 py-2.5">
                        <dt className="flex items-center gap-1 text-[10px] text-[#52596e] font-semibold uppercase tracking-wider mb-1">
                          <Clock className="w-3 h-3" /> Duration
                        </dt>
                        <dd className="text-sm font-bold text-[#0a1530]">{visa.duration}</dd>
                      </div>
                    </dl>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      {VISA_DETAILS[visa.id] ? (
                        <>
                          <Link
                            href={`/visa/${visa.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 text-white font-semibold text-[13px] py-2.5 rounded-xl transition-colors"
                            style={{ background: visa.color }}
                          >
                            Full guide <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setActiveVisaId(visa.id)}
                            aria-label="Quick preview"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(14,20,36,0.05)] text-[#52596e] hover:bg-[rgba(14,20,36,0.09)] transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <a
                          href={visa.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[rgba(14,20,36,0.05)] text-[#0a1530] font-semibold text-[13px] py-2.5 rounded-xl hover:bg-[rgba(14,20,36,0.09)] transition-colors"
                        >
                          View on gov.uk <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <VisaDetailModal
        visa={activeVisaId ? VISA_DETAILS[activeVisaId] ?? null : null}
        onClose={() => setActiveVisaId(null)}
      />
    </>
  );
}
