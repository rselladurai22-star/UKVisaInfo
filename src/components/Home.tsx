'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase, GraduationCap, Plane, Users,
  Stethoscope, Rocket, History, LayoutGrid,
  CheckCircle2, ShieldCheck, RefreshCw, ArrowRight, ArrowUpRight,
  Clock, AlertCircle, Scale, FileText, Timer
} from 'lucide-react';
import { motion } from 'motion/react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS, INTENT_TO_VISA } from '../data/visaDetails';
import AnimatedCounter from './AnimatedCounter';
import CountryAutocomplete from './CountryAutocomplete';

const ALL_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
  "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
  "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt",
  "El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon",
  "Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan",
  "Kenya","Kiribati","Korea, North","Korea, South","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia",
  "Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta",
  "Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique",
  "Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia",
  "Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa",
  "San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia",
  "Solomon Islands","Somalia","South Africa","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey",
  "Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

export default function Home() {
  const router = useRouter();
  const [intent, setIntent] = useState('work');
  const [nationality, setNationality] = useState('');
  const [activeVisaId, setActiveVisaId] = useState<string | null>(null);

  const onStartQuiz = () => router.push('/eligibility');
  const openVisa = (id: string) => setActiveVisaId(id);
  const closeVisa = () => setActiveVisaId(null);

  const handleSeeRequirements = () => {
    const id = INTENT_TO_VISA[intent];
    if (id) openVisa(id);
    else onStartQuiz();
  };

  const visaCategories = [
    { id: 'skilled-worker', title: 'Skilled Worker', icon: Briefcase, desc: 'For individuals with a job offer from an approved UK employer.' },
    { id: 'student', title: 'Student Visa', icon: GraduationCap, desc: 'For international students who have been offered a place on a course.' },
    { id: 'visitor', title: 'Standard Visitor', icon: Plane, desc: 'Tourism, business, study (up to 6 months), and other permitted activities.' },
    { id: 'family', title: 'Family Visa', icon: Users, desc: 'Join a spouse, partner, parent, or child who is a British citizen or settled.' },
    { id: 'talent', title: 'Global Talent', icon: LayoutGrid, desc: 'For leaders or potential leaders in academia, research, arts, or digital tech.' },
    { id: 'health', title: 'Health and Care', icon: Stethoscope, desc: 'Fast-track visa for medical professionals with a job offer from the NHS.' },
    { id: 'innovator-founder', title: 'Innovator Founder', icon: Rocket, desc: 'For entrepreneurs seeking to set up a business that is new, innovative, and scalable.' },
    { id: 'graduate', title: 'Graduate Visa', icon: History, desc: 'Stay in the UK for at least 2 years after successfully completing a course.' },
  ];

  const navigate = (view: string) => {
    const map: Record<string, string> = { home: '/', types: '/visa-types', quiz: '/eligibility', costs: '/costs' };
    router.push(map[view] || '/');
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden hero-gradient">
        <div className="aurora"></div>
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=2670"
            alt="London Skyline"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>
        <div className="uk-pattern absolute inset-0 z-10"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest mb-6 rounded-sm"
            >
              Official Information Hub
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              UK Visas: Types, <span className="gradient-text">Eligibility</span>, Costs, Application Links & All Details
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
            >
              Find the right visa, check if you qualify, see exact costs, and apply officially — all in one place. Your definitive guide to UK immigration.
            </motion.p>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => router.push('/visa-types')}
                className="bg-gradient-to-r from-secondary to-[#8b001d] text-white px-8 py-4 font-bold text-sm hover:translate-y-[-2px] transition-all shadow-lg shadow-secondary/20"
              >
                Browse All Visa Types
              </button>
              <button 
                onClick={onStartQuiz}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 font-bold text-sm hover:bg-white/20 transition-all"
              >
                Check My Eligibility
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-wrap gap-8 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div className="flex items-center gap-2 text-white font-medium text-xs tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4 text-white" /> Verified Gov Data
              </div>
              <div className="flex items-center gap-2 text-white font-medium text-xs tracking-widest uppercase">
                <CheckCircle2 className="w-4 h-4 text-white" /> Secure Portal
              </div>
              <div className="flex items-center gap-2 text-white font-medium text-xs tracking-widest uppercase">
                <RefreshCw className="w-4 h-4 text-white" /> Updated April 2026
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:block lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-diplomat border border-white/10 p-8 rounded-lg shadow-2xl"
            >
              <h3 className="text-white font-bold text-xl mb-6">Quick Search</h3>
              <div className="space-y-6">
                <div className="border-b border-white/20 pb-2">
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-widest">I want to...</label>
                  <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="bg-transparent text-white w-full border-none focus:ring-0 cursor-pointer appearance-none py-2 text-lg"
                  >
                    <option value="work" className="bg-primary">Work in the UK</option>
                    <option value="study" className="bg-primary">Study in the UK</option>
                    <option value="visit" className="bg-primary">Visit for Holiday</option>
                    <option value="family" className="bg-primary">Join Family</option>
                  </select>
                </div>
                <div className="pb-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-widest block mb-1">My Nationality</label>
                  <CountryAutocomplete
                    id="home-nationality"
                    value={nationality}
                    onChange={setNationality}
                    options={ALL_COUNTRIES}
                    placeholder="Enter country..."
                    label="Nationality"
                    inputClassName="bg-transparent text-white w-full border-b border-white/20 focus:border-white/60 focus:ring-0 outline-none placeholder:text-white/30 py-2 pr-14 text-lg transition-colors"
                  />
                </div>
                <button
                  onClick={handleSeeRequirements}
                  className="w-full bg-white text-primary py-4 font-bold text-sm uppercase tracking-wider hover:bg-secondary hover:text-white transition-colors"
                >
                  See Requirements
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visa Categories */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3 inline-block">Explore routes</span>
              <h2 className="text-primary text-4xl font-extrabold tracking-tight mb-4">Visa Categories</h2>
              <p className="text-on-surface-variant max-w-xl">Comprehensive guidance on every UK visa route. Select a category to explore detailed requirements and application steps.</p>
            </div>
            <button onClick={() => navigate('types')} className="group text-secondary font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all">
              View All Categories <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
            }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {visaCategories.map((cat, idx) => (
              <motion.button
                key={idx}
                onClick={() => openVisa(cat.id)}
                variants={{
                  hidden: { opacity: 0, y: 24, scale: 0.96 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 18, stiffness: 220 } },
                }}
                whileHover={{ y: -6, transition: { type: 'spring', damping: 15, stiffness: 300 } }}
                whileTap={{ scale: 0.98 }}
                className="shimmer group bg-surface-container-lowest p-8 rounded-xl shadow-diplomat border border-outline-variant/20 hover:border-secondary hover:shadow-xl transition-colors cursor-pointer block text-left w-full"
              >
                <div className="w-12 h-12 bg-primary-container text-white flex items-center justify-center mb-6 rounded-lg group-hover:bg-secondary transition-colors">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-primary font-bold text-xl mb-2">{cat.title}</h3>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{cat.desc}</p>
                <div className="text-primary-container text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-secondary">
                  View Details <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Quick stats row with animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { v: 12, suf: '+', label: 'Visa routes covered' },
              { v: 190, suf: '+', label: 'Nationalities supported' },
              { v: 2026, pre: '', label: 'April data refresh', noComma: true },
              { v: 100, suf: '%', label: 'Official gov.uk sources' },
            ].map((s, i) => (
              <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight mb-1">
                  {s.noComma ? s.v : <AnimatedCounter to={s.v} prefix={s.pre || ''} suffix={s.suf || ''} />}
                </div>
                <div className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Teaser */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-primary text-white p-12 md:p-20 relative overflow-hidden rounded-lg shadow-2xl">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
              <CheckCircle2 className="w-64 h-64 rotate-12 -mr-20 -mt-20" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Can you move to the UK?</h2>
              <p className="text-white/70 text-lg mb-10 leading-relaxed">Answer 5 quick questions about your nationality, current location, and purpose of stay to find out which visa routes are open to you today.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {[
                  { step: '1', title: 'Define your goal' },
                  { step: '2', title: 'Assess skills & funds' },
                  { step: '3', title: 'Get your roadmap' }
                ].map((s, i) => (
                  <div key={i} className="space-y-2 border-l border-white/20 pl-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Step {s.step}</span>
                    <p className="font-medium text-sm">{s.title}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={onStartQuiz}
                className="bg-secondary text-white px-10 py-5 font-bold text-lg hover:bg-secondary/90 transition-all flex items-center gap-3 shadow-xl"
              >
                Check Now <Rocket className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Costs */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary text-4xl font-extrabold mb-4">Visa Costs & Processing</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Transparency on fees helps you plan your move. Costs vary by visa duration and application location.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Skilled Worker */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col shadow-diplomat">
              <div className="p-8 border-b border-outline-variant/10">
                <h3 className="text-primary font-bold text-xl mb-1">Skilled Worker</h3>
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Main Applicant</p>
              </div>
              <div className="p-8 flex-grow space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-on-surface-variant text-sm">Standard Fee</span>
                  <span className="text-primary font-bold text-2xl">£827 – £1,636</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-on-surface-variant text-sm">Health Surcharge</span>
                  <span className="text-primary font-bold text-lg">£1,035/year</span>
                </div>
                <div className="pt-6 border-t border-outline-variant/10">
                  <h4 className="text-[10px] font-bold uppercase mb-4 text-primary tracking-widest">Processing Times</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Clock className="w-4 h-4 text-secondary" /> Outside UK: 3 weeks
                    </li>
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Clock className="w-4 h-4 text-secondary" /> Inside UK: 8 weeks
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Featured Visitor */}
            <div className="bg-primary text-white rounded-xl overflow-hidden flex flex-col ring-4 ring-secondary/10 scale-105 shadow-2xl relative">
              <div className="absolute top-4 right-4 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">Most Popular</div>
              <div className="p-8 border-b border-white/10">
                <h3 className="text-white font-bold text-xl mb-1">Standard Visitor</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">6 Month Stay</p>
              </div>
              <div className="p-8 flex-grow space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-white/60 text-sm">Application Fee</span>
                  <span className="text-white font-bold text-2xl">£127</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/60 text-sm">Health Surcharge</span>
                  <span className="text-white font-bold text-lg">None</span>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-[10px] font-bold uppercase mb-4 text-white/60 tracking-widest">Processing Times</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-white/60">
                      <Clock className="w-4 h-4 text-secondary" /> Standard: 3 weeks
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/60">
                      <Clock className="w-4 h-4 text-secondary" /> Priority: 5 days
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Student Visa */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col shadow-diplomat">
              <div className="p-8 border-b border-outline-variant/10">
                <h3 className="text-primary font-bold text-xl mb-1">Student Visa</h3>
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Tier 4 Replacement</p>
              </div>
              <div className="p-8 flex-grow space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-on-surface-variant text-sm">Standard Fee</span>
                  <span className="text-primary font-bold text-2xl">£565</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-on-surface-variant text-sm">Health Surcharge</span>
                  <span className="text-primary font-bold text-lg">£776/year</span>
                </div>
                <div className="pt-6 border-t border-outline-variant/10">
                  <h4 className="text-[10px] font-bold uppercase mb-4 text-primary tracking-widest">Processing Times</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Clock className="w-4 h-4 text-secondary" /> Outside UK: 3 weeks
                    </li>
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Clock className="w-4 h-4 text-secondary" /> Inside UK: 8 weeks
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-12 text-on-surface-variant text-[10px] font-medium tracking-widest uppercase opacity-60">
            * Fees reflect the April 2026 Home Office fee schedule. Rates reviewed annually each April.
          </p>
        </div>
      </section>

      {/* Vital Info */}
      <section className="py-24 bg-surface pb-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-primary text-4xl font-extrabold mb-8 tracking-tight">Vital Information</h2>
              <p className="text-on-surface-variant mb-12 leading-relaxed">Essential knowledge for a successful application. Avoid common pitfalls and stay updated with the latest policy changes.</p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <AlertCircle className="text-secondary w-6 h-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary mb-2">April 2026 Changes</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Skilled Worker minimum now £41,700 at RQF Level 6. English raised to B2. Graduate visa reduced to 18 months. Care worker route closed to new overseas recruits.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Scale className="text-secondary w-6 h-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-primary mb-2">Appeals Process</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">Information on how to challenge a decision if your application is refused.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container-high p-10 rounded-lg shadow-diplomat">
                <h3 className="text-xl font-extrabold mb-6 flex items-center gap-3">
                  <FileText className="text-primary w-6 h-6" /> Required Documents
                </h3>
                <ul className="space-y-4 text-sm text-on-surface-variant">
                  {['Current passport or valid travel document', 'Tuberculosis (TB) test results', 'Criminal record certificate', 'Proof of English proficiency', 'Bank statements for maintenance'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                       <CheckCircle2 className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-surface-container-high p-10 rounded-lg shadow-diplomat">
                <h3 className="text-xl font-extrabold mb-6 flex items-center gap-3">
                  <Timer className="text-primary w-6 h-6" /> Priority Services
                </h3>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Need a decision faster? Most routes offer expedited processing for an additional fee.</p>
                <div className="space-y-4">
                  <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant/20 shadow-sm">
                    <p className="font-bold text-[10px] uppercase text-primary tracking-widest mb-1">Priority Service</p>
                    <p className="text-sm">Decision within 5 working days.</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded border border-outline-variant/20 shadow-sm">
                    <p className="font-bold text-[10px] uppercase text-primary tracking-widest mb-1">Super Priority</p>
                    <p className="text-sm">Decision by end of next working day.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VisaDetailModal
        visa={activeVisaId ? VISA_DETAILS[activeVisaId] ?? null : null}
        onClose={closeVisa}
      />
    </div>
  );
}
