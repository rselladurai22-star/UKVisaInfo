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

const FONT         = '"Inter", -apple-system, system-ui, sans-serif';
const FONT_DISPLAY = '"Space Grotesk", -apple-system, system-ui, sans-serif';
const FONT_MONO    = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const INK    = '#213343';
const SLATE  = '#516F90';
const MUTED  = '#7C98B6';
const ORANGE = '#FF7A59';
const HAIR   = 'rgba(33,51,67,0.08)';
const SOFT   = '#F5F8FA';

const visas = [
  {
    id: 'skilled-worker', category: 'Work' as Category, icon: Briefcase,
    title: 'Skilled Worker Visa',
    desc: 'For sponsored work in the UK at RQF Level 3+ roles. Raised salary thresholds from April 2026.',
    salary: '£41,700 min', duration: 'Up to 5 years',
    url: 'https://www.gov.uk/skilled-worker-visa',
  },
  {
    id: 'student', category: 'Study' as Category, icon: GraduationCap,
    title: 'Student Visa',
    desc: 'For applicants aged 16+ with a confirmed offer from a UK Higher Education Provider.',
    salary: 'Maintenance proof', duration: 'Duration of course',
    url: 'https://www.gov.uk/student-visa',
  },
  {
    id: 'visitor', category: 'Visit' as Category, icon: Plane,
    title: 'Standard Visitor',
    desc: 'Tourism, short study courses, or business meetings — up to 6 months per visit.',
    salary: 'N/A', duration: 'Up to 6 months',
    url: 'https://www.gov.uk/standard-visitor',
  },
  {
    id: 'family', category: 'Family' as Category, icon: Users,
    title: 'Family Visa',
    desc: 'Join a UK-settled partner, spouse or family member. Includes spouse and partner routes.',
    salary: '£29,000', duration: '2.5 years (renewable)',
    url: 'https://www.gov.uk/uk-family-visa',
  },
  {
    id: 'talent', category: 'Work' as Category, icon: LayoutGrid,
    title: 'Global Talent',
    desc: 'For endorsed leaders or future leaders in technology, arts, research and academia.',
    salary: 'N/A', duration: 'Up to 5 years',
    url: 'https://www.gov.uk/global-talent',
  },
  {
    id: 'health', category: 'Work' as Category, icon: Stethoscope,
    title: 'Health and Care',
    desc: 'Fast-track for NHS roles and allied health professionals. IHS exempt.',
    salary: '£25,000 min', duration: 'Up to 5 years',
    url: 'https://www.gov.uk/health-care-worker-visa',
  },
  {
    id: 'graduate', category: 'Study' as Category, icon: History,
    title: 'Graduate Visa',
    desc: 'Stay 18 months after completing a UK degree (3 years for PhD graduates). No sponsor needed.',
    salary: 'N/A', duration: '18 months / 3 yrs',
    url: 'https://www.gov.uk/graduate-visa',
  },
  {
    id: 'innovator-founder', category: 'Work' as Category, icon: Rocket,
    title: 'Innovator Founder',
    desc: 'For entrepreneurs with an endorsed innovative business idea. No minimum investment required.',
    salary: 'N/A', duration: 'Up to 3 years',
    url: 'https://www.gov.uk/innovator-founder-visa',
  },
  {
    id: 'youth', category: 'Work' as Category, icon: Plane,
    title: 'Youth Mobility Scheme',
    desc: '18–30 year olds from eligible countries can live and work freely in the UK.',
    salary: '£2,530 savings', duration: 'Up to 2 years',
    url: 'https://www.gov.uk/youth-mobility',
  },
  {
    id: 'ancestry', category: 'Family' as Category, icon: History,
    title: 'UK Ancestry Visa',
    desc: 'For Commonwealth citizens who have a UK-born grandparent.',
    salary: 'Maintenance proof', duration: '5 years',
    url: 'https://www.gov.uk/ancestry-visa',
  },
];

const CATEGORIES: Category[] = ['All', 'Work', 'Study', 'Family', 'Visit'];

export default function VisaTypes() {
  const [filter, setFilter] = useState<Category>('All');
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);

  const filtered = filter === 'All' ? visas : visas.filter((v) => v.category === filter);

  return (
    <div style={{ background: '#FFFFFF', color: INK, fontFamily: FONT }}>
      {/* Page hero */}
      <section className="pt-[120px] md:pt-[140px] pb-10 md:pb-14">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE,
            marginBottom: 14,
          }}>
            Directory
          </p>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            lineHeight: 1.04, letterSpacing: '-0.032em',
            color: INK, maxWidth: '20ch',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}>
            Every UK visa route, at a glance
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 18, lineHeight: 1.6,
            color: SLATE, marginTop: 18, maxWidth: 620,
          }}>
            Browse 10+ visa routes with fees, duration and direct links to the
            official gov.uk application portal.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[62px] md:top-[70px] z-20"
           style={{
             background: 'rgba(255,255,255,0.92)',
             backdropFilter: 'blur(12px)',
             WebkitBackdropFilter: 'blur(12px)',
             borderBottom: `1px solid ${HAIR}`,
           }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-3 overflow-x-auto mask-fade">
          <div className="flex items-center gap-2 min-w-min">
            {CATEGORIES.map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className="whitespace-nowrap transition-all"
                  style={{
                    fontFamily: FONT, fontSize: 13.5, fontWeight: 600,
                    padding: '8px 16px', borderRadius: 8,
                    background: active ? ORANGE : 'transparent',
                    color: active ? '#FFFFFF' : SLATE,
                    border: active ? `1px solid ${ORANGE}` : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = SOFT;
                      e.currentTarget.style.color = INK;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = SLATE;
                    }
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              {filtered.map((visa, i) => (
                <motion.article
                  key={visa.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', damping: 22, stiffness: 200 }}
                  className="group lift-on-hover"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${HAIR}`,
                    borderRadius: 24,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '28px 28px 24px' }}>
                    {/* Icon + category eyebrow */}
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="inline-flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 44, height: 44,
                          background: 'rgba(255,122,89,0.10)',
                          color: ORANGE,
                          borderRadius: 12,
                        }}
                      >
                        <visa.icon className="w-5 h-5" />
                      </span>
                      <span style={{
                        fontFamily: FONT, fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: ORANGE,
                      }}>
                        {visa.category}
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: FONT_DISPLAY, fontWeight: 700,
                      fontSize: 19, lineHeight: 1.2, letterSpacing: '-0.02em',
                      color: INK,
                    }}>
                      {visa.title}
                    </h3>
                    <p style={{
                      fontFamily: FONT, fontSize: 14, lineHeight: 1.55,
                      color: SLATE, marginTop: 8,
                    }}>
                      {visa.desc}
                    </p>

                    {/* Key stats */}
                    <dl className="mt-5 grid grid-cols-2 gap-3">
                      <div style={{
                        background: SOFT, borderRadius: 12,
                        padding: '10px 12px',
                      }}>
                        <dt className="flex items-center gap-1"
                            style={{
                              fontFamily: FONT, fontSize: 10, fontWeight: 700,
                              letterSpacing: '0.12em', textTransform: 'uppercase',
                              color: MUTED, marginBottom: 4,
                            }}>
                          <Banknote className="w-3 h-3" /> Salary
                        </dt>
                        <dd style={{
                          fontFamily: FONT_MONO, fontSize: 13.5, fontWeight: 600, color: INK,
                        }}>{visa.salary}</dd>
                      </div>
                      <div style={{
                        background: SOFT, borderRadius: 12,
                        padding: '10px 12px',
                      }}>
                        <dt className="flex items-center gap-1"
                            style={{
                              fontFamily: FONT, fontSize: 10, fontWeight: 700,
                              letterSpacing: '0.12em', textTransform: 'uppercase',
                              color: MUTED, marginBottom: 4,
                            }}>
                          <Clock className="w-3 h-3" /> Duration
                        </dt>
                        <dd style={{
                          fontFamily: FONT_MONO, fontSize: 13.5, fontWeight: 600, color: INK,
                        }}>{visa.duration}</dd>
                      </div>
                    </dl>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      {VISA_DETAILS[visa.id] ? (
                        <>
                          <Link
                            href={`/visa/${visa.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 transition-colors"
                            style={{
                              fontFamily: FONT, fontSize: 13, fontWeight: 600,
                              color: '#FFFFFF', background: ORANGE,
                              padding: '10px 14px', borderRadius: 12,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#FF5C35'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = ORANGE; }}
                          >
                            Full guide <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setActiveVisaId(visa.id)}
                            aria-label="Quick preview"
                            className="inline-flex items-center justify-center transition-colors"
                            style={{
                              width: 40, height: 40,
                              background: SOFT, color: SLATE,
                              borderRadius: 12,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#EAF0F6'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = SOFT; }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <a
                          href={visa.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 transition-colors"
                          style={{
                            fontFamily: FONT, fontSize: 13, fontWeight: 600,
                            color: INK, background: SOFT,
                            padding: '10px 14px', borderRadius: 12,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#EAF0F6'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = SOFT; }}
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
    </div>
  );
}
