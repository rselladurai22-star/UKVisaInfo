'use client';

import { useState } from 'react';
import {
  Briefcase, GraduationCap, Plane, Users,
  Stethoscope, Rocket, History, LayoutGrid,
  ArrowRight, ExternalLink, Info
} from 'lucide-react';
import { motion } from 'motion/react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';

const visas = [
  { id: 'skilled-worker', category: 'Work', icon: Briefcase, title: 'Skilled Worker Visa', desc: 'RQF Level 6 jobs, B2 English. Raised thresholds from April 2026.', salary: '£41,700 minimum', duration: 'Up to 5 years', points: '70 points required', url: 'https://www.gov.uk/skilled-worker-visa' },
  { id: 'student', category: 'Study', icon: GraduationCap, title: 'Student Visa', desc: 'For those aged 16+ who have been offered a place on a course.', salary: 'Needs maintenance funds', duration: 'Duration of course', points: '70 points required', url: 'https://www.gov.uk/student-visa' },
  { id: 'visitor', category: 'Visit', icon: Plane, title: 'Standard Visitor', desc: 'Tourism, short study, or business meetings.', salary: 'N/A', duration: 'Up to 6 months', points: 'Eligibility based', url: 'https://www.gov.uk/standard-visitor' },
  { id: 'family', category: 'Family', icon: Users, title: 'Family Visa', desc: 'Join a family member settled in the UK.', salary: '£29,000 threshold', duration: 'Up to 2.5 years', points: 'Relationship based', url: 'https://www.gov.uk/uk-family-visa' },
  { id: 'talent', category: 'Work', icon: LayoutGrid, title: 'Global Talent', desc: 'For leaders in tech, arts, and science.', salary: 'N/A', duration: 'Up to 5 years', points: 'Endorsement required', url: 'https://www.gov.uk/global-talent' },
  { id: 'health', category: 'Work', icon: Stethoscope, title: 'Health and Care', desc: 'Fast-track for NHS/AHPs. Care worker route closed to new overseas applicants.', salary: 'IHS exempt', duration: 'Up to 5 years', points: 'Job offer required', url: 'https://www.gov.uk/health-care-worker-visa' },
  { id: 'graduate', category: 'Study', icon: History, title: 'Graduate Visa', desc: 'Stay 18 months after a UK degree (3 years for PhD) — reduced May 2025.', salary: 'N/A', duration: '18 months (3y PhD)', points: 'Course completion', url: 'https://www.gov.uk/graduate-visa' },
  { id: 'innovator', category: 'Work', icon: Rocket, title: 'Innovator Founder', desc: 'For entrepreneurs with an innovative business idea.', salary: 'N/A', duration: 'Up to 3 years', points: 'Endorsement required', url: 'https://www.gov.uk/innovator-founder-visa' },
  { id: 'youth', category: 'Work', icon: Plane, title: 'Youth Mobility Scheme', desc: 'For 18-30 year olds from eligible countries to live/work in the UK.', salary: '£2,530 savings', duration: 'Up to 2 years', points: 'Age & nationality', url: 'https://www.gov.uk/youth-mobility' },
  { id: 'spouse', category: 'Family', icon: Users, title: 'Spouse/Partner Visa', desc: 'Join your partner who is settled in the UK.', salary: '£29,000 income', duration: '2.5 years, renewable', points: 'Relationship proof', url: 'https://www.gov.uk/uk-family-visa/partner-spouse' },
  { id: 'ancestry', category: 'Family', icon: History, title: 'UK Ancestry Visa', desc: 'For Commonwealth citizens with a UK-born grandparent.', salary: 'Maintenance funds', duration: '5 years', points: 'Ancestry proof', url: 'https://www.gov.uk/ancestry-visa' },
  { id: 'business-visitor', category: 'Visit', icon: Briefcase, title: 'Business Visitor', desc: 'Short business trips, meetings, and conferences.', salary: 'N/A', duration: 'Up to 6 months', points: 'Purpose based', url: 'https://www.gov.uk/standard-visitor/visit-on-business' },
];

export default function VisaTypes() {
  const [filter, setFilter] = useState('All');
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);
  const categories = ['All', 'Work', 'Study', 'Family', 'Visit'];

  const filteredVisas = filter === 'All' ? visas : visas.filter(v => v.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-primary mb-4">Visa Directory</h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">
          Explore the full range of UK immigration routes. Each visa has unique requirements, costs, and rights attached to it.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-8">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-primary mb-4">Filter by Group</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 text-left text-sm font-medium rounded-md transition-all ${
                    filter === cat 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-secondary/5 border-l-4 border-secondary rounded-r-lg">
            <h4 className="font-bold text-sm text-secondary mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" /> Need Advice?
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              If you're unsure which category fits your situation, try our Eligibility Wizard.
            </p>
          </div>
        </aside>

        {/* Visa Cards Grid */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVisas.map((visa, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={visa.id}
              className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-diplomat hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary-container text-white flex items-center justify-center rounded-lg group-hover:bg-secondary transition-colors">
                  <visa.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 border border-outline-variant/20 px-2 py-1 rounded">
                  {visa.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-primary mb-2">{visa.title}</h3>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{visa.desc}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/10">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider mb-1">Salary Threshold</label>
                  <p className="text-xs font-bold text-primary">{visa.salary}</p>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider mb-1">Max Duration</label>
                  <p className="text-xs font-bold text-primary">{visa.duration}</p>
                </div>
              </div>

              {VISA_DETAILS[visa.id] ? (
                <button onClick={() => setActiveVisaId(visa.id)} className="w-full mt-8 py-3 bg-surface-container-low hover:bg-primary hover:text-white transition-all text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded">
                  Full Requirements <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <a href={visa.url} target="_blank" rel="noopener noreferrer" className="w-full mt-8 py-3 bg-surface-container-low hover:bg-primary hover:text-white transition-all text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded">
                  Full Requirements <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <VisaDetailModal
        visa={activeVisaId ? VISA_DETAILS[activeVisaId] ?? null : null}
        onClose={() => setActiveVisaId(null)}
      />
    </div>
  );
}
