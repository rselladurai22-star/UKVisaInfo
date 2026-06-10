'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ArrowRight, ArrowLeft, Briefcase, GraduationCap, Plane, Users,
  Home as HomeIcon, Rocket, CheckCircle2, ExternalLink, Sparkles, ShieldCheck
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

type StepId = 'purpose' | 'detail' | 'result';

interface Answer {
  label: string;
  value: string;
  desc?: string;
  icon?: any;
}

// Decision tree → gov.uk apply URL + recommended visa title.
const PURPOSES: Answer[] = [
  { label: 'Work in the UK', value: 'work', icon: Briefcase, desc: 'Skilled worker, health & care, global talent' },
  { label: 'Study in the UK', value: 'study', icon: GraduationCap, desc: 'Student, child student, graduate' },
  { label: 'Visit (tourism, business)', value: 'visit', icon: Plane, desc: 'Up to 6 months' },
  { label: 'Join family', value: 'family', icon: Users, desc: 'Partner, parent, child of UK resident' },
  { label: 'Settle permanently (ILR)', value: 'settle', icon: HomeIcon, desc: 'Indefinite Leave to Remain' },
  { label: 'Start a business', value: 'business', icon: Rocket, desc: 'Innovator Founder, start-up routes' },
];

const FOLLOWUPS: Record<string, { question: string; options: Answer[] }> = {
  work: {
    question: 'Do you have a job offer from a UK sponsor?',
    options: [
      { label: 'Yes — in healthcare / NHS', value: 'health' },
      { label: 'Yes — in another eligible role', value: 'skilled' },
      { label: 'No — but I am a leader in my field', value: 'talent' },
      { label: 'No — I want to come and look', value: 'hpi' },
    ],
  },
  study: {
    question: 'What level of study?',
    options: [
      { label: 'Full-time degree / course (16+)', value: 'student' },
      { label: 'Short course under 6 months', value: 'svvisitor' },
      { label: 'After finishing my UK degree', value: 'graduate' },
      { label: 'School-age (4–17)', value: 'childstudent' },
    ],
  },
  visit: {
    question: 'What is the purpose of your visit?',
    options: [
      { label: 'Tourism or seeing family', value: 'visitor' },
      { label: 'Business meetings / conferences', value: 'visitor' },
      { label: 'Getting married in the UK', value: 'marriage' },
      { label: 'Transiting to another country', value: 'transit' },
    ],
  },
  family: {
    question: 'Who are you joining in the UK?',
    options: [
      { label: 'Spouse or unmarried partner', value: 'family' },
      { label: 'Parent (you are under 18)', value: 'family' },
      { label: 'Child (British / settled)', value: 'family' },
      { label: 'Adult relative needing care', value: 'family' },
    ],
  },
  settle: {
    question: 'On what basis are you settling?',
    options: [
      { label: 'After 5–10 years on a visa', value: 'ilr' },
      { label: 'EU / EEA pre-settled → settled', value: 'euss' },
      { label: 'British citizenship (after ILR)', value: 'citizenship' },
    ],
  },
  business: {
    question: 'What stage is your business idea at?',
    options: [
      { label: 'Endorsed innovative business plan', value: 'innovator' },
      { label: 'Moving an overseas business to UK', value: 'expansion' },
      { label: 'Transferring within my company', value: 'ict' },
    ],
  },
};

interface Outcome {
  title: string;
  blurb: string;
  applyUrl: string;
  bullets: string[];
}

const OUTCOMES: Record<string, Outcome> = {
  skilled: {
    title: 'Skilled Worker Visa',
    blurb: 'For a job offer from a Home Office licensed sponsor at RQF Level 6+ with salary ≥ £41,700 (or going rate).',
    applyUrl: 'https://www.gov.uk/skilled-worker-visa/apply-from-outside-the-uk',
    bullets: ['Certificate of Sponsorship from employer', 'English B2 proof', '£1,270 maintenance for 28 days'],
  },
  health: {
    title: 'Health and Care Worker Visa',
    blurb: 'Fast-track route for medical professionals (doctors, nurses, adult social care) with an NHS or approved offer.',
    applyUrl: 'https://www.gov.uk/health-care-worker-visa/apply-from-outside-the-uk',
    bullets: ['NHS / approved sponsor CoS', 'IHS exemption', 'Reduced visa fees'],
  },
  talent: {
    title: 'Global Talent Visa',
    blurb: 'For recognised or emerging leaders in academia, research, arts, or digital technology.',
    applyUrl: 'https://www.gov.uk/global-talent',
    bullets: ['Endorsement from approved body', 'No salary or sponsor needed', 'Fast path to settlement (3y exceptional talent)'],
  },
  hpi: {
    title: 'High Potential Individual Visa',
    blurb: 'For recent graduates of a top-50 global university — come to the UK to work, switch jobs, or search.',
    applyUrl: 'https://www.gov.uk/high-potential-individual-visa',
    bullets: ['Degree within last 5 years', 'English B1', '2 years (3 for PhD)'],
  },
  student: {
    title: 'Student Visa',
    blurb: 'For an unconditional place on an eligible full-time course at a Student-sponsor institution.',
    applyUrl: 'https://www.gov.uk/student-visa/apply',
    bullets: ['Confirmation of Acceptance for Studies (CAS)', 'Financial evidence', 'TB test (if applicable)'],
  },
  childstudent: {
    title: 'Child Student Visa',
    blurb: 'For 4–17 year olds studying at an independent UK fee-paying school.',
    applyUrl: 'https://www.gov.uk/child-study-visa',
    bullets: ['CAS from licensed school', 'Parental consent', 'Care arrangements confirmed'],
  },
  graduate: {
    title: 'Graduate Visa',
    blurb: 'Stay in the UK for 18 months (3 years for PhD) after completing your UK degree. No sponsor required.',
    applyUrl: 'https://www.gov.uk/graduate-visa',
    bullets: ['Must be in the UK', 'Student-sponsor confirmed completion', 'Apply before current visa ends'],
  },
  svvisitor: {
    title: 'Standard Visitor Visa (short study)',
    blurb: 'Courses up to 6 months at an accredited provider — including English-language courses.',
    applyUrl: 'https://www.gov.uk/standard-visitor',
    bullets: ['Accredited course acceptance letter', 'Funds for stay', 'Return travel proof'],
  },
  visitor: {
    title: 'Standard Visitor Visa',
    blurb: 'Up to 6 months for tourism, visiting family, short-term business activities, or private medical treatment.',
    applyUrl: 'https://www.gov.uk/standard-visitor',
    bullets: ['Sufficient funds', 'Intent to leave at end of visit', 'Ties to home country'],
  },
  marriage: {
    title: 'Marriage Visitor Visa',
    blurb: 'For visiting the UK to marry or register a civil partnership, then leaving within 6 months.',
    applyUrl: 'https://www.gov.uk/marriage-visa',
    bullets: ['Notice of marriage at a designated register office', 'Funds + return travel', 'Not for settlement'],
  },
  transit: {
    title: 'Transit Visa',
    blurb: 'For passing through UK border control on the way to another country within 48 hours.',
    applyUrl: 'https://www.gov.uk/transit-visa',
    bullets: ['Proof of onward travel', 'Funds for transit', 'Valid third-country entry rights'],
  },
  family: {
    title: 'UK Family Visa',
    blurb: 'For joining a partner, parent, child, or adult relative who is British or settled in the UK.',
    applyUrl: 'https://www.gov.uk/uk-family-visa/apply-partner-spouse',
    bullets: ['Relationship evidence', 'Minimum income £29,000 (partner route)', 'Adequate accommodation'],
  },
  ilr: {
    title: 'Indefinite Leave to Remain',
    blurb: 'Permanent settlement after the qualifying period on your route (usually 5 or 10 years).',
    applyUrl: 'https://www.gov.uk/indefinite-leave-to-remain',
    bullets: ['Life in the UK test', 'English B1 (if not exempt)', 'Continuous residence evidence'],
  },
  euss: {
    title: 'EU Settlement Scheme',
    blurb: 'For EU, EEA or Swiss citizens (and family) moving from pre-settled to settled status.',
    applyUrl: 'https://www.gov.uk/settled-status-eu-citizens-families',
    bullets: ['5 years continuous residence', 'No serious criminal record', 'Proof of identity'],
  },
  citizenship: {
    title: 'British Citizenship (Naturalisation)',
    blurb: 'Apply to become a British citizen, usually 12 months after getting ILR.',
    applyUrl: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    bullets: ['Good character requirement', 'Life in the UK test', 'English B1 or higher'],
  },
  innovator: {
    title: 'Innovator Founder Visa',
    blurb: 'For experienced entrepreneurs with an innovative, viable and scalable business plan endorsed by an approved body.',
    applyUrl: 'https://www.gov.uk/innovator-founder-visa',
    bullets: ['Endorsement letter (valid 3 months)', 'English B2', 'Maintenance funds'],
  },
  expansion: {
    title: 'UK Expansion Worker Visa',
    blurb: 'For senior staff sent to establish a UK branch of an overseas business.',
    applyUrl: 'https://www.gov.uk/uk-expansion-worker-visa',
    bullets: ['Overseas sponsor licence', 'Existing role with the business', 'Funded by parent company'],
  },
  ict: {
    title: 'Senior or Specialist Worker (Global Business Mobility)',
    blurb: 'Intra-company transfer for senior employees or specialists moving to a UK branch.',
    applyUrl: 'https://www.gov.uk/senior-specialist-worker-visa',
    bullets: ['12 months with linked business overseas', 'Salary ≥ £48,500 (or going rate)', 'CoS from UK branch'],
  },
};

export default function ApplyWizard({ open, onClose }: Props) {
  const [step, setStep] = useState<StepId>('purpose');
  const [purpose, setPurpose] = useState<string | null>(null);
  const [outcomeKey, setOutcomeKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep('purpose');
    setPurpose(null);
    setOutcomeKey(null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const outcome = outcomeKey ? OUTCOMES[outcomeKey] : null;
  const followup = purpose ? FOLLOWUPS[purpose] : null;

  const restart = () => {
    setStep('purpose');
    setPurpose(null);
    setOutcomeKey(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-sm flex items-start md:items-center justify-center p-0 md:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-surface w-full max-w-3xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden my-0 md:my-4 flex flex-col max-h-[100vh] md:max-h-[90vh]"
          >
            <div className="hero-gradient text-white px-8 md:px-10 pt-8 pb-6 relative">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-2">
                <Sparkles className="w-3 h-3 text-secondary" /> Guided Apply
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight pr-10">
                Find the right visa to apply for
              </h2>
              <p className="text-white/60 mt-2 text-sm md:text-base">
                Answer a couple of quick questions — we'll send you to the exact GOV.UK page.
              </p>
              <div className="flex items-center gap-1.5 mt-5">
                {(['purpose', 'detail', 'result'] as StepId[]).map((s, i) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      (step === 'purpose' && i === 0) ||
                      (step === 'detail' && i <= 1) ||
                      (step === 'result' && i <= 2)
                        ? 'bg-secondary'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 bg-surface-container-low/30">
              <AnimatePresence mode="wait">
                {step === 'purpose' && (
                  <motion.div
                    key="purpose"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-primary mb-6">Why are you coming to the UK?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {PURPOSES.map((p) => (
                        <button
                          key={p.value}
                          onClick={() => { setPurpose(p.value); setStep('detail'); }}
                          className="flex items-start gap-4 p-5 bg-surface-container-lowest border-2 border-outline-variant/20 rounded-xl hover:border-secondary hover:shadow-lg transition-all text-left group"
                        >
                          <span className="p-2.5 rounded-lg bg-primary-container/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                            {p.icon && <p.icon className="w-5 h-5" />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-primary text-sm">{p.label}</div>
                            {p.desc && <div className="text-xs text-on-surface-variant mt-1">{p.desc}</div>}
                          </div>
                          <ArrowRight className="w-4 h-4 text-outline-variant group-hover:text-secondary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'detail' && followup && (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-primary mb-6">{followup.question}</h3>
                    <div className="space-y-3">
                      {followup.options.map((o, i) => (
                        <button
                          key={i}
                          onClick={() => { setOutcomeKey(o.value); setStep('result'); }}
                          className="w-full flex items-center justify-between gap-4 p-5 bg-surface-container-lowest border-2 border-outline-variant/20 rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all text-left group"
                        >
                          <span className="font-bold text-primary text-sm">{o.label}</span>
                          <ArrowRight className="w-4 h-4 text-outline-variant group-hover:text-secondary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-outline-variant/20">
                      <button
                        onClick={restart}
                        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary font-bold"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'result' && outcome && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold tracking-widest uppercase mb-4">
                      <CheckCircle2 className="w-3 h-3" /> Recommended route
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-3 tracking-tight">
                      {outcome.title}
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed mb-6">{outcome.blurb}</p>

                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 mb-6">
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> Core requirements
                      </div>
                      <ul className="space-y-2">
                        {outcome.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-primary">
                            <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={outcome.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-white font-bold rounded-lg shadow-lg hover:bg-secondary/90 transition-all"
                      >
                        Apply on GOV.UK <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={restart}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-outline-variant/30 text-primary font-bold rounded-lg hover:border-primary transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Start over
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
