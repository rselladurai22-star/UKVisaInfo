'use client';

import { useEffect, useState } from 'react';
import {
  X, CheckCircle2, FileText, Clock, Banknote, ShieldCheck,
  ArrowRight, Info, ListChecks, ExternalLink, Calendar,
  AlertTriangle, BookOpen, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { VisaDetail } from '../data/visaDetails';

interface Props {
  visa: VisaDetail | null;
  onClose: () => void;
}

type TabId = 'overview' | 'eligibility' | 'documents' | 'process' | 'notes';

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'eligibility', label: 'Eligibility', icon: CheckCircle2 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'process', label: 'How to Apply', icon: ListChecks },
  { id: 'notes', label: 'Key Notes', icon: Sparkles },
];

export default function VisaDetailModal({ visa, onClose }: Props) {
  const [tab, setTab] = useState<TabId>('overview');

  useEffect(() => {
    if (!visa) return;
    setTab('overview');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [visa, onClose]);

  return (
    <AnimatePresence>
      {visa && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-sm flex items-start md:items-center justify-center p-0 md:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-surface w-full max-w-6xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden my-0 md:my-4 flex flex-col max-h-[100vh] md:max-h-[92vh]"
          >
            {/* Header */}
            <div className="hero-gradient text-white px-8 md:px-12 pt-10 md:pt-12 pb-6 relative flex-shrink-0">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-secondary rounded-sm">
                  {visa.category} Route
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/60 tracking-wider">
                  <Calendar className="w-3 h-3" /> Updated {visa.updated}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 leading-tight pr-12">
                {visa.title}
              </h2>
              <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed">{visa.tagline}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7">
                <Stat icon={Banknote} label="Application Fee" value={visa.fee} />
                <Stat icon={ShieldCheck} label="Health Surcharge" value={visa.ihs} />
                <Stat icon={Calendar} label="Duration" value={visa.duration} />
                <Stat icon={Clock} label="Processing" value={visa.processing.outside} />
              </div>
            </div>

            {/* Tab Nav */}
            <div className="flex-shrink-0 bg-surface-container-lowest border-b border-outline-variant/20 px-4 md:px-8 overflow-x-auto">
              <nav className="flex gap-1 min-w-max">
                {TABS.map(t => {
                  const Active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`relative flex items-center gap-2 px-4 md:px-5 py-4 text-sm font-bold transition-colors whitespace-nowrap ${
                        Active ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      <t.icon className="w-4 h-4" />
                      {t.label}
                      {Active && (
                        <motion.div
                          layoutId="tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 bg-surface-container-low/30">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {tab === 'overview' && <OverviewTab visa={visa} />}
                  {tab === 'eligibility' && <ListTab items={visa.eligibility} icon={CheckCircle2} title="Eligibility criteria" subtitle="You must meet all of these to qualify." />}
                  {tab === 'documents' && <NumberedListTab items={visa.documents} title="Documents you'll need" subtitle="Prepare these before starting your application." />}
                  {tab === 'process' && <ProcessTab steps={visa.steps} />}
                  {tab === 'notes' && <NotesTab notes={visa.notes || []} processing={visa.processing} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sticky Footer CTA */}
            <div className="flex-shrink-0 bg-surface-container-lowest border-t border-outline-variant/30 px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
              <p className="text-xs text-on-surface-variant text-center sm:text-left">
                Ready to apply? You'll be taken to the official GOV.UK page.
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-3 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  Close
                </button>
                <a
                  href={visa.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-6 py-3 bg-secondary text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                >
                  Apply on GOV.UK <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-white/50" />
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">{label}</div>
      </div>
      <div className="text-white font-bold text-sm leading-tight">{value}</div>
    </div>
  );
}

function OverviewTab({ visa }: { visa: VisaDetail }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <section>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> What this visa is for
        </h3>
        <p className="text-on-surface-variant leading-relaxed text-base">{visa.summary}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoTile icon={Clock} label="Apply Outside UK" value={visa.processing.outside} tone="neutral" />
        <InfoTile icon={Clock} label="Apply Inside UK" value={visa.processing.inside} tone="neutral" />
        <InfoTile icon={Banknote} label="Maintenance Funds" value="£1,270 · 28 days" tone="accent" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card icon={CheckCircle2} title="Eligibility" count={visa.eligibility.length} label="criteria" />
        <Card icon={FileText} title="Documents" count={visa.documents.length} label="items" />
        <Card icon={ListChecks} title="Application Steps" count={visa.steps.length} label="steps" />
        <Card icon={Sparkles} title="Key Notes" count={(visa.notes || []).length} label="policy notes" />
      </section>

      <section className="bg-secondary/5 border-l-4 border-secondary p-5 rounded-r-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-primary mb-1">Figures valid {visa.updated}</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Home Office fees are reviewed annually each April. Rules may change between announcement and
              implementation — always verify on GOV.UK before applying.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ListTab({ items, icon: Icon, title, subtitle }: { items: string[]; icon: any; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h3 className="text-2xl font-extrabold text-primary mb-1">{title}</h3>
        <p className="text-sm text-on-surface-variant">{subtitle}</p>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/20 hover:border-secondary/30 transition-colors">
            <Icon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-primary leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NumberedListTab({ items, title, subtitle }: { items: string[]; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h3 className="text-2xl font-extrabold text-primary mb-1">{title}</h3>
        <p className="text-sm text-on-surface-variant">{subtitle}</p>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-primary leading-relaxed pt-1.5">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProcessTab({ steps }: { steps: { title: string; desc: string }[] }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold text-primary mb-1">How to apply, step by step</h3>
        <p className="text-sm text-on-surface-variant">Follow these in order. Each step typically flows into the next.</p>
      </div>
      <ol className="relative border-l-2 border-secondary/30 ml-5 space-y-8 pl-8">
        {steps.map((s, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[44px] top-0 w-10 h-10 rounded-full bg-secondary text-white font-bold text-sm flex items-center justify-center shadow-lg ring-4 ring-surface-container-low/30">
              {i + 1}
            </span>
            <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm">
              <h4 className="font-bold text-primary text-base mb-1">{s.title}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NotesTab({ notes, processing }: { notes: string[]; processing: { outside: string; inside: string } }) {
  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <h3 className="text-2xl font-extrabold text-primary mb-1">Processing times</h3>
        <p className="text-sm text-on-surface-variant mb-5">Standard service. Priority upgrades may be available.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Outside UK</span>
            </div>
            <p className="text-xl font-bold text-primary">{processing.outside}</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Inside UK</span>
            </div>
            <p className="text-xl font-bold text-primary">{processing.inside}</p>
          </div>
        </div>
      </section>

      {notes.length > 0 && (
        <section>
          <h3 className="text-2xl font-extrabold text-primary mb-1">Important notes</h3>
          <p className="text-sm text-on-surface-variant mb-5">Policy context and recent changes.</p>
          <ul className="space-y-3">
            {notes.map((n, i) => (
              <li key={i} className="flex items-start gap-3 p-4 bg-secondary/5 border-l-4 border-secondary rounded-r-lg">
                <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary leading-relaxed">{n}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: 'neutral' | 'accent' }) {
  return (
    <div className={`p-4 rounded-lg flex items-center gap-3 ${tone === 'accent' ? 'bg-secondary/5 border border-secondary/20' : 'bg-surface-container-lowest border border-outline-variant/20'}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${tone === 'accent' ? 'text-secondary' : 'text-primary/60'}`} />
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">{label}</div>
        <div className="text-sm font-bold text-primary truncate">{value}</div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, count, label }: { icon: any; title: string; count: number; label: string }) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-secondary" />
        <span className="text-3xl font-extrabold text-primary leading-none">{count}</span>
      </div>
      <div className="text-sm font-bold text-primary">{title}</div>
      <div className="text-xs text-on-surface-variant">{label}</div>
    </div>
  );
}
