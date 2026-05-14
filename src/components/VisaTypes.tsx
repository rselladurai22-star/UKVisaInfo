'use client';

import { useState } from 'react';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, Rocket, History,
  LayoutGrid, ArrowRight, ExternalLink, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';

const visas = [
  { id: 'skilled-worker', category: 'Work', icon: Briefcase, title: 'Skilled Worker Visa', desc: 'RQF Level 6 jobs, B2 English. Raised thresholds from April 2026.', salary: '£38,700 min', duration: 'Up to 5 years', url: 'https://www.gov.uk/skilled-worker-visa' },
  { id: 'student', category: 'Study', icon: GraduationCap, title: 'Student Visa', desc: 'For applicants 16+ with an offer from a UK Higher Education Provider.', salary: 'Maintenance proof', duration: 'Duration of course', url: 'https://www.gov.uk/student-visa' },
  { id: 'visitor', category: 'Visit', icon: Plane, title: 'Standard Visitor', desc: 'Tourism, short study, or business meetings up to 6 months per visit.', salary: 'N/A', duration: 'Up to 6 months', url: 'https://www.gov.uk/standard-visitor' },
  { id: 'family', category: 'Family', icon: Users, title: 'Family Visa', desc: 'Join a UK-settled partner or family member. Includes spouse and partner routes.', salary: '£29,000', duration: '2.5 years (renewable)', url: 'https://www.gov.uk/uk-family-visa' },
  { id: 'talent', category: 'Work', icon: LayoutGrid, title: 'Global Talent', desc: 'For endorsed leaders or future leaders in tech, arts, research and academia.', salary: 'N/A', duration: 'Up to 5 years', url: 'https://www.gov.uk/global-talent' },
  { id: 'health', category: 'Work', icon: Stethoscope, title: 'Health and Care', desc: 'Fast-track for NHS roles and allied health professionals. IHS exempt.', salary: '£25,600 min', duration: 'Up to 5 years', url: 'https://www.gov.uk/health-care-worker-visa' },
  { id: 'graduate', category: 'Study', icon: History, title: 'Graduate Visa', desc: 'Stay 18 months after a UK degree (3 years for PhD). No sponsor needed.', salary: 'N/A', duration: '18 months / 3 yrs', url: 'https://www.gov.uk/graduate-visa' },
  { id: 'innovator-founder', category: 'Work', icon: Rocket, title: 'Innovator Founder', desc: 'For entrepreneurs with an endorsed innovative business idea. No minimum investment.', salary: 'N/A', duration: 'Up to 3 years', url: 'https://www.gov.uk/innovator-founder-visa' },
  { id: 'youth', category: 'Work', icon: Plane, title: 'Youth Mobility Scheme', desc: '18–30 year olds from eligible countries can live and work in the UK.', salary: '£2,530 savings', duration: 'Up to 2 years', url: 'https://www.gov.uk/youth-mobility' },
  { id: 'ancestry', category: 'Family', icon: History, title: 'UK Ancestry Visa', desc: 'For Commonwealth citizens with a UK-born grandparent.', salary: 'Maintenance proof', duration: '5 years', url: 'https://www.gov.uk/ancestry-visa' },
];

const CATEGORIES = ['All', 'Work', 'Study', 'Family', 'Visit'] as const;

export default function VisaTypes() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All');
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);

  const filtered = filter === 'All' ? visas : visas.filter((v) => v.category === filter);

  return (
    <>
      {/* Hero strip */}
      <section className="pt-28 md:pt-36 pb-10 md:pb-14 mesh-bg-light">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-secondary mb-3">
            Directory
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Every UK visa route, at a glance
          </h1>
          <p className="mt-4 max-w-2xl text-on-surface-variant text-base md:text-lg leading-relaxed">
            Browse 10+ visa routes with fees, duration and direct links to
            the official gov.uk application portal.
          </p>
        </div>
      </section>

      {/* Filter pill bar */}
      <section className="sticky top-16 md:top-20 z-20 glass border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3 overflow-x-auto mask-fade">
          <div className="flex items-center gap-2 min-w-min">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === c
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((visa) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                key={visa.id}
                className="group bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 md:p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <span className="inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-secondary-soft text-secondary">
                    <visa.icon className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-full">
                    {visa.category}
                  </span>
                </div>

                <h3 className="font-display text-lg md:text-xl font-bold text-primary leading-snug">
                  {visa.title}
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                  {visa.desc}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-on-surface-variant uppercase font-semibold tracking-wider text-[10px]">Salary</dt>
                    <dd className="font-semibold text-primary mt-0.5">{visa.salary}</dd>
                  </div>
                  <div>
                    <dt className="text-on-surface-variant uppercase font-semibold tracking-wider text-[10px]">Duration</dt>
                    <dd className="font-semibold text-primary mt-0.5">{visa.duration}</dd>
                  </div>
                </dl>

                <div className="mt-6 flex gap-2">
                  {VISA_DETAILS[visa.id] ? (
                    <>
                      <Link
                        href={`/visa/${visa.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-bold uppercase tracking-widest py-3 rounded-2xl hover:bg-primary-container transition-colors"
                      >
                        Full guide <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => setActiveVisaId(visa.id)}
                        aria-label="Quick preview"
                        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-container-low text-secondary hover:bg-secondary-soft transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <a
                      href={visa.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-surface-container-low text-primary text-xs font-bold uppercase tracking-widest py-3 rounded-2xl hover:bg-primary hover:text-white transition-colors"
                    >
                      gov.uk <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <VisaDetailModal
        visa={activeVisaId ? VISA_DETAILS[activeVisaId] ?? null : null}
        onClose={() => setActiveVisaId(null)}
      />
    </>
  );
}
