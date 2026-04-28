'use client';

import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Globe, MapPin,
  Info, Briefcase, GraduationCap, Plane,
  Home as HomeIcon, CheckCircle2,
  Banknote, LightbulbIcon, ShieldCheck,
  ChevronDown, Sparkles, Verified, Timer, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import VisaDetailModal from './VisaDetailModal';
import { VISA_DETAILS } from '../data/visaDetails';
import CountryAutocomplete from './CountryAutocomplete';

interface QuizProps {
  onCancel: () => void;
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function EligibilityWizard({ onCancel }: QuizProps) {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [nationality, setNationality] = useState("");
  const [residence, setResidence] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);

  const totalSteps = 4;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps + 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const getVisaRecommendation = () => {
    switch (purpose) {
      case 'work':
        return {
          title: 'Skilled Worker Visa',
          desc: 'For individuals with a job offer from an approved UK sponsor.',
          applyUrl: 'https://www.gov.uk/skilled-worker-visa',
          reasons: [
            { t: 'Job offer anticipated', d: 'Your professional credentials align with UK shortage occupations.' },
            { t: 'High English proficiency', d: 'Your profile suggests you meet the required language standards.' },
            { t: 'Financial stability', d: 'You have indicated sufficient personal maintenance funds.' }
          ]
        };
      case 'study':
        return {
          title: 'Student Visa',
          desc: 'For students offered a place on a full-time course at a licensed sponsor.',
          applyUrl: 'https://www.gov.uk/student-visa',
          reasons: [
            { t: 'Course eligibility', d: 'Your educational background matches RQF level requirements.' },
            { t: 'Financial threshold', d: 'You meet the monthly maintenance requirements for students.' },
            { t: 'Genuine Student rule', d: 'Your intent to stay matches educational course durations.' }
          ]
        };
      case 'visit':
        return {
          title: 'Standard Visitor Visa',
          desc: 'For tourism, business meetings, or short-term study (under 6 months).',
          applyUrl: 'https://www.gov.uk/standard-visitor',
          reasons: [
            { t: 'Short-term intent', d: 'Your planned stay is within the 6-month tourism limits.' },
            { t: 'Fund clearance', d: 'You have demonstrated enough capital for your stay and return trip.' },
            { t: 'Ties to home', d: 'Your residency status indicates clear reasons to return home.' }
          ]
        };
      case 'transit':
        return {
          title: 'Transit Visa',
          desc: 'For passing through the UK on your way to another country.',
          applyUrl: 'https://www.gov.uk/transit-visa',
          reasons: [
            { t: 'Short stay', d: 'Your transit duration fits within the 48-hour or visitor-in-transit rules.' },
            { t: 'Onward travel', d: 'You have confirmed travel to a third country.' },
            { t: 'Funds', d: 'You can support yourself during transit.' }
          ]
        };
      default:
        return {
          title: 'Family Visa',
          desc: 'For joining family members settled in the UK.',
          applyUrl: 'https://www.gov.uk/uk-family-visa',
          reasons: [
            { t: 'Settlement connection', d: 'Your connection to a UK-based sponsor provides a direct route.' },
            { t: 'Accommodation proof', d: 'You have access to valid housing with your sponsor.' },
            { t: 'Financial threshold', d: 'You meet the current partner income requirements (£29k+).' }
          ]
        };
    }
  };

  const recommendation = getVisaRecommendation();

  const purposeToVisaId: Record<string, string> = {
    work: 'skilled-worker',
    study: 'student',
    visit: 'visitor',
    transit: 'visitor',
    join: 'family',
  };
  const recommendedDetail = VISA_DETAILS[purposeToVisaId[purpose || 'join'] || 'family'] || null;

  return (
    <div className="pt-24 pb-20 px-8 max-w-7xl mx-auto w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {step < totalSteps && (
             <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-secondary font-bold text-[10px] tracking-widest uppercase mb-2">Step {String(step).padStart(2, '0')} of {String(totalSteps).padStart(2, '0')}</span>
                  <div className="h-1.5 w-64 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-on-surface-variant text-xs font-medium italic opacity-60">
                  {step === 1 ? 'Identity & Residency' : step === 2 ? 'Purpose & Duration' : step === 3 ? 'Skills & Finances' : 'Review Results'}
                </div>
              </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-8">
                <h1 className="text-5xl font-extrabold tracking-tight text-primary leading-[1.1]">
                  Check your UK visa eligibility
                </h1>
                <p className="text-xl text-on-surface-variant leading-relaxed font-light">
                  Answer a few questions to find out which visa you might be eligible for and get a personalized roadmap.
                </p>
                <div className="p-6 bg-surface-container-low rounded-xl border-l-4 border-secondary/20 shadow-sm">
                  <div className="flex items-start gap-4">
                    <Info className="text-secondary w-6 h-6 flex-shrink-0" />
                    <p className="text-sm leading-relaxed text-on-surface-variant">
                      This tool provides an initial assessment based on current UK Home Office guidance. A full evaluation of your circumstances is required for a formal application.
                    </p>
                  </div>
                </div>
                <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-diplomat">
                  <img
                    className="object-cover w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                    src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=2670"
                    alt="London"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-surface-container-lowest p-10 lg:p-14 shadow-diplomat rounded-xl space-y-12">
                <div className="space-y-4">
                  <label className="block text-xl font-semibold text-primary tracking-tight">
                    What is your nationality as shown on your passport?
                  </label>
                  <CountryAutocomplete
                    id="quiz-nationality"
                    value={nationality}
                    onChange={setNationality}
                    options={countries}
                    label="Nationality"
                    icon={<Globe className="w-6 h-6" />}
                    placeholder="Search for a country..."
                  />
                  <p className="text-xs text-on-surface-variant/70 italic">If you have dual nationality, please select the one you intend to use for travel.</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-xl font-semibold text-primary tracking-tight">
                    Where are you currently living?
                  </label>
                  <CountryAutocomplete
                    id="quiz-residence"
                    value={residence}
                    onChange={setResidence}
                    options={countries}
                    label="Country of residence"
                    icon={<MapPin className="w-6 h-6" />}
                    placeholder="Select current residence"
                  />
                </div>

                <div className="pt-8 flex items-center justify-between">
                  <button onClick={onCancel} className="text-secondary font-semibold hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={nextStep} className="bg-primary text-white px-12 py-4 rounded-md font-bold text-lg hover:shadow-xl transition-all flex items-center gap-3">
                    Next <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-5xl mx-auto py-12">
              <div className="mb-12 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mt-2">Purpose & Duration</h1>
                <p className="text-on-surface-variant mt-4 max-w-xl">Tell us why you're planning to come to the UK and how long you intend to stay.</p>
              </div>

              <div className="space-y-16">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <span className="text-primary-container/20 font-black text-6xl select-none">01</span>
                    <h2 className="text-2xl font-bold text-primary">Why do you want to come to the UK?</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'work', title: 'Work', desc: 'Skilled worker, health care, or temporary work visas.', icon: Briefcase },
                      { id: 'study', title: 'Study', desc: 'Student or child student visas for recognized institutions.', icon: GraduationCap },
                      { id: 'visit', title: 'Visit family or friends', desc: 'Standard visitor visa for tourism or short stays.', icon: Plane },
                      { id: 'transit', title: 'Transit', desc: 'Passing through the UK on your way to another country.', icon: Plane },
                      { id: 'join', title: 'Join family settled in the UK', desc: 'Spouse, partner, or dependent of a UK resident.', icon: HomeIcon, colSpan: 'md:col-span-2' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setPurpose(item.id)}
                        className={`group flex flex-col items-start p-8 rounded-xl transition-all duration-300 text-left border-2 ${
                          purpose === item.id
                          ? 'bg-surface-container-lowest border-secondary shadow-lg ring-4 ring-secondary/5'
                          : 'bg-surface-container-low hover:bg-surface-container-lowest border-transparent hover:border-secondary/20'
                        } ${item.colSpan || ''}`}
                      >
                        <div className="flex justify-between w-full mb-4">
                          <item.icon className={`w-8 h-8 ${purpose === item.id ? 'text-secondary' : 'text-primary/40'}`} />
                          {purpose === item.id && <CheckCircle2 className="w-6 h-6 text-secondary fill-secondary/10" />}
                        </div>
                        <span className="text-xl font-bold text-primary">{item.title}</span>
                        <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 pt-8 border-t border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="text-primary-container/20 font-black text-6xl select-none">02</span>
                    <h2 className="text-2xl font-bold text-primary">How long do you plan to stay?</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="relative flex items-center p-6 bg-surface-container-low border-2 border-transparent rounded-xl cursor-pointer hover:bg-surface-container-high transition-all">
                      <input type="radio" name="duration" className="w-5 h-5 text-secondary focus:ring-secondary border-outline" />
                      <span className="ml-4 text-lg font-medium text-primary">6 months or less</span>
                    </label>
                    <label className="relative flex items-center p-6 bg-surface-container-low border-2 border-transparent rounded-xl cursor-pointer hover:bg-surface-container-high transition-all">
                      <input type="radio" name="duration" className="w-5 h-5 text-secondary focus:ring-secondary border-outline" />
                      <span className="ml-4 text-lg font-medium text-primary">More than 6 months</span>
                    </label>
                  </div>
                </div>

                <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button onClick={prevStep} className="flex items-center gap-2 text-secondary font-bold hover:underline underline-offset-8 px-6 py-3">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={nextStep} className="w-full sm:w-auto px-12 py-4 bg-primary text-white font-bold rounded-md shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3">
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-3xl mx-auto py-12">
              <div className="space-y-10">
                <section className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Briefcase className="w-32 h-32" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <Sparkles className="text-secondary w-5 h-5" /> Professional Qualifications
                  </h2>
                  <div className="space-y-8">
                    <div className="group">
                      <label className="block text-sm font-semibold text-primary mb-3">Do you have a job offer from an approved UK employer?</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:border-secondary/40 transition-all">
                          <CheckCircle2 className="w-5 h-5 text-secondary" />
                          <span className="font-medium text-sm">Yes, I have an offer</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg border-2 border-primary bg-primary text-white shadow-lg">
                          <Timer className="w-5 h-5" />
                          <span className="font-medium text-sm">No, I'm still looking</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-3">What is your primary profession?</label>
                      <div className="relative">
                        <select className="w-full bg-transparent border-b-2 border-outline-variant/40 focus:border-primary focus:ring-0 py-3 appearance-none transition-colors">
                          <option disabled value="">Select your industry</option>
                          <option>Healthcare & Medicine</option>
                          <option>Technology & Engineering</option>
                          <option>Finance & Legal</option>
                          <option>Education</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-outline pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-4">What is your highest level of education?</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {['Doctorate / PhD', "Master's / Bachelor's", 'Other Professional'].map((edu, i) => (
                          <label key={i} className="cursor-pointer group">
                            <input type="radio" name="edu" className="sr-only peer" />
                            <div className="p-4 text-center rounded-lg border border-outline-variant/40 peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all">
                              <span className="block text-xs font-medium text-primary">{edu}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden border-l-4 border-secondary shadow-sm">
                  <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                    <Banknote className="text-secondary w-5 h-5" /> Financial Maintenance
                  </h2>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                    To qualify for most UK visas, you must prove you can support yourself without relying on public funds.
                  </p>
                  <div className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-lg shadow-sm border border-black/5">
                    <div className="max-w-[70%]">
                      <span className="block font-bold text-primary">Personal Savings Requirement</span>
                      <span className="block text-[10px] text-on-surface-variant mt-1 leading-tight tracking-wider uppercase opacity-60">Do you have sufficient savings (usually £1,270)?</span>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-full">
                      <button className="px-5 py-1.5 rounded-full text-[10px] font-bold bg-secondary text-white shadow-sm">YES</button>
                      <button className="px-5 py-1.5 rounded-full text-[10px] font-bold text-on-surface-variant hover:bg-white transition-colors">NO</button>
                    </div>
                  </div>
                </section>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 border-t border-outline-variant/20">
                  <button onClick={prevStep} className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={nextStep} className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-md font-bold flex items-center justify-center gap-3 hover:translate-y-[-1px] transition-all shadow-lg shadow-primary/20">
                    Analyze Eligibility <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-5xl mx-auto py-12">
              <section className="hero-gradient rounded-xl p-8 md:p-12 mb-8 relative overflow-hidden text-white shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck className="w-48 h-48" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-white text-[10px] font-bold mb-6 tracking-widest uppercase">
                    <Verified className="w-3 h-3 mr-2" /> SUCCESSFUL MATCH
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                    You are likely eligible for the {recommendation.title}
                  </h1>
                  <p className="text-white/60 text-lg max-w-lg mb-8 leading-relaxed">
                    {recommendation.desc}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => setShowDetailModal(true)} className="px-8 py-4 bg-white text-primary font-bold rounded-lg shadow-lg hover:bg-surface-container-low transition-all flex items-center gap-2 group">
                      View Full Guide <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a href={recommendation.applyUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-secondary text-white border border-secondary font-bold rounded-lg hover:bg-secondary/90 transition-all flex items-center gap-2">
                      Apply on GOV.UK <ArrowRight className="w-4 h-4" />
                    </a>
                    <button onClick={() => { setStep(1); setPurpose(null); }} className="px-6 py-4 bg-transparent border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                      Restart
                    </button>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 bg-surface-container-lowest rounded-xl p-8 shadow-diplomat border border-outline-variant/10">
                  <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                    <LightbulbIcon className="w-5 h-5 mr-3 text-secondary" /> Why this visa?
                  </h3>
                  <ul className="space-y-6">
                    {recommendation.reasons.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-3 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-primary leading-none mb-1 text-sm">{item.t}</p>
                          <p className="text-on-surface-variant text-xs leading-relaxed">{item.d}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-7 bg-surface-container-low rounded-xl p-8 shadow-diplomat border border-outline-variant/10">
                  <h3 className="text-xl font-bold text-primary mb-8 flex items-center">
                    <LayoutGrid className="w-5 h-5 mr-3 text-secondary" /> Next Steps
                  </h3>
                  <div className="space-y-8">
                    {[
                      { s: 'Get Certificate of Sponsorship', d: 'Request the unique reference number from your employer.' },
                      { s: 'Prepare documents', d: 'Gather passport, proof of English language, and health results.' },
                      { s: 'Apply online', d: 'Complete the form on the official GOV.UK portal, pay fees.' }
                    ].map((stp, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">{i+1}</div>
                        <div>
                          <h4 className="font-bold text-primary mb-1 text-sm">{stp.s}</h4>
                          <p className="text-on-surface-variant text-xs leading-relaxed">{stp.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <VisaDetailModal
        visa={showDetailModal ? recommendedDetail : null}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}
