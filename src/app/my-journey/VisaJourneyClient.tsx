'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, Lock, Plus, Check, CalendarDays, ListChecks, RotateCcw,
  Trash2, ArrowRight, BookOpen, Briefcase,
} from 'lucide-react';
import { VISA_DETAILS } from '../../data/visaDetails';

interface Journey {
  visa: string;             // visa slug
  targetDate: string;       // ISO YYYY-MM-DD
  steps: { id: string; label: string; done: boolean }[];
  notes: string;
  updated: number;
}

const STORAGE_KEY = 'ukvisa:journey:v1';

const DEFAULT_STEPS: Omit<Journey['steps'][number], 'done'>[] = [
  { id: 'route',    label: 'Choose visa route' },
  { id: 'docs',     label: 'Gather supporting documents' },
  { id: 'english',  label: 'Book English language test' },
  { id: 'tb',       label: 'Book TB test (if required)' },
  { id: 'fee',      label: 'Budget for fees and IHS' },
  { id: 'apply',    label: 'Submit online application' },
  { id: 'biom',     label: 'Attend biometric appointment' },
  { id: 'decision', label: 'Receive decision' },
];

function emptyJourney(): Journey {
  return {
    visa: '',
    targetDate: '',
    steps: DEFAULT_STEPS.map((s) => ({ ...s, done: false })),
    notes: '',
    updated: Date.now(),
  };
}

export default function VisaJourneyClient() {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setJourney(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (journey) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(journey)); } catch { /* ignore */ }
    } else {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    }
  }, [journey, ready]);

  const visa = journey?.visa ? VISA_DETAILS[journey.visa as keyof typeof VISA_DETAILS] : null;

  const doneCount = journey?.steps.filter((s) => s.done).length ?? 0;
  const totalCount = journey?.steps.length ?? 0;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const daysToTarget = useMemo(() => {
    if (!journey?.targetDate) return null;
    const t = new Date(journey.targetDate).getTime();
    if (!Number.isFinite(t)) return null;
    return Math.ceil((t - Date.now()) / (1000 * 60 * 60 * 24));
  }, [journey?.targetDate]);

  return (
    <>
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0e1b3f] to-[#0F2C4B] pt-[100px] md:pt-[120px] pb-12 md:pb-14">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#10b981]/18 blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A] mb-3">
            <Sparkles className="w-3 h-3" /> Personal planner
          </span>
          <h1 className="font-display text-white text-[1.875rem] sm:text-[2.5rem] md:text-[2.875rem] font-bold leading-[1.05] tracking-[-0.025em]">
            My UK visa journey
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-white/65 text-base leading-relaxed">
            Track your visa route, target date and document checklist progress in one place. Everything stays on this device.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] text-white/45">
            <Lock className="w-3 h-3 text-[#34d399]" /> Stored locally — never uploaded.
          </p>
        </div>
      </header>

      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">

          {!journey ? (
            <StartCard onStart={() => setJourney(emptyJourney())} />
          ) : (
            <div className="space-y-5">
              {/* Progress card */}
              <section className="rounded-3xl bg-gradient-to-br from-[#0A2540] to-[#0F2C4B] text-white p-6 md:p-7 relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#10b981]/30 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A]">Progress</div>
                      <div className="mt-1 font-display font-bold text-[1.75rem] tabular-nums leading-none">
                        {doneCount}<span className="text-white/40">/{totalCount}</span>
                      </div>
                    </div>
                    {daysToTarget !== null && (
                      <div className="text-right">
                        <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/45">Target</div>
                        <div className={`mt-1 font-display font-bold text-[1.5rem] tabular-nums leading-none ${daysToTarget < 0 ? 'text-[#fca5a5]' : 'text-white'}`}>
                          {daysToTarget < 0 ? `${Math.abs(daysToTarget)}d past` : `${daysToTarget}d left`}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#C9A14A] rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </section>

              {/* Route + target form */}
              <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#00C4B4] mb-1.5">01 · Your route</div>
                <h2 className="font-display text-[1.25rem] font-bold text-[#0A2540] tracking-[-0.015em] mb-5">
                  Visa route &amp; target date
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-[12px] font-semibold text-[#52596e] mb-1.5">Visa route</span>
                    <select
                      value={journey.visa}
                      onChange={(e) => setJourney({ ...journey, visa: e.target.value, updated: Date.now() })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(14,20,36,0.1)] bg-white text-[14px] font-semibold text-[#0A2540] focus:border-[#0A2540] outline-none transition-colors"
                    >
                      <option value="">Choose a route…</option>
                      {Object.values(VISA_DETAILS).map((v) => (
                        <option key={v.id} value={v.id}>{v.title}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-[12px] font-semibold text-[#52596e] mb-1.5">Target travel date</span>
                    <input
                      type="date"
                      value={journey.targetDate}
                      onChange={(e) => setJourney({ ...journey, targetDate: e.target.value, updated: Date.now() })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(14,20,36,0.1)] bg-white text-[14px] font-semibold text-[#0A2540] focus:border-[#0A2540] outline-none transition-colors"
                    />
                  </label>
                </div>

                {visa && (
                  <div className="mt-4 p-3.5 rounded-xl bg-white border border-[rgba(14,20,36,0.05)] flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-[#00C4B4]" />
                    <div className="flex-1 text-[12.5px] text-[#52596e]">
                      Processing <strong className="text-[#0A2540]">{visa.processing.outside}</strong> outside the UK · Fee {visa.fee}
                    </div>
                    <Link href={`/visa-types/${visa.id}`} className="text-[12px] font-semibold text-[#00C4B4] hover:underline">
                      Open guide →
                    </Link>
                  </div>
                )}
              </section>

              {/* Steps */}
              <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#00C4B4] mb-1.5">02 · Checklist</div>
                    <h2 className="font-display text-[1.25rem] font-bold text-[#0A2540] tracking-[-0.015em] flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-[#00C4B4]" /> Application steps
                    </h2>
                  </div>
                  {doneCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setJourney({ ...journey, steps: journey.steps.map((s) => ({ ...s, done: false })), updated: Date.now() })}
                      className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#7a8195] hover:text-[#00C4B4] px-2.5 py-1.5 rounded-lg hover:bg-[rgba(0, 196, 180,0.06)] transition-colors duration-100"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>

                <ul className="space-y-1.5">
                  {journey.steps.map((s, i) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...journey.steps];
                          next[i] = { ...next[i], done: !next[i].done };
                          setJourney({ ...journey, steps: next, updated: Date.now() });
                        }}
                        aria-pressed={s.done}
                        className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors duration-100 group"
                      >
                        <span
                          className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center border-2 transition-[background,border-color,transform] duration-150 ${
                            s.done
                              ? 'bg-[#10b981] border-[#10b981]'
                              : 'border-[#cfd5e0] group-hover:border-[#10b981] bg-white'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 text-white transition-opacity duration-100 ${s.done ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                        </span>
                        <span className={`flex-1 text-[14.5px] leading-snug ${s.done ? 'text-[#7a8195] line-through' : 'text-[#1a2240]'}`}>
                          {s.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Notes */}
              <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#00C4B4] mb-1.5">03 · Notes</div>
                <h2 className="font-display text-[1.25rem] font-bold text-[#0A2540] tracking-[-0.015em] mb-4">
                  Personal notes
                </h2>
                <textarea
                  value={journey.notes}
                  onChange={(e) => setJourney({ ...journey, notes: e.target.value, updated: Date.now() })}
                  placeholder="Reference numbers, appointment dates, anything you want to remember…"
                  className="w-full min-h-[120px] p-3.5 rounded-xl border border-[rgba(14,20,36,0.1)] bg-white focus:bg-white focus:border-[#0A2540] outline-none transition-colors duration-100 text-[14px] leading-relaxed text-[#1a2240] placeholder:text-[#9aa3b8] resize-y"
                />
              </section>

              {/* Footer actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-[11.5px] text-[#9aa3b8]">
                  Last updated {new Date(journey.updated).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.confirm('Clear your saved journey? This cannot be undone.')) {
                      setJourney(null);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#7a8195] hover:text-[#ef4444] px-3 py-2 rounded-lg hover:bg-[rgba(239,68,68,0.06)] transition-colors duration-100"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear my journey
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function StartCard({ onStart }: { onStart: () => void }) {
  return (
    <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-7 md:p-10 text-center shadow-[0_4px_18px_rgba(10, 37, 64,0.04)]">
      <span className="inline-flex w-12 h-12 rounded-2xl bg-[rgba(0, 196, 180,0.08)] text-[#00C4B4] items-center justify-center mb-4">
        <CalendarDays className="w-5 h-5" />
      </span>
      <h2 className="font-display text-[1.5rem] md:text-[1.875rem] font-bold text-[#0A2540] tracking-[-0.02em]">
        Build your visa plan
      </h2>
      <p className="mt-3 max-w-md mx-auto text-[#52596e] text-[14.5px] leading-relaxed">
        Pick your route, set a target date, and tick off each step as you go. Everything is saved on this device — no signup, no upload.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-7 inline-flex items-center gap-2 bg-[#00C4B4] text-white font-bold px-6 py-3.5 rounded-xl text-[14px] hover:bg-[#009E91] active:scale-[0.98] transition-[background,transform] duration-100 shadow-[0_4px_16px_rgba(0, 196, 180,0.32)]"
      >
        <Plus className="w-4 h-4" /> Start my journey
      </button>

      <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        {[
          { icon: ListChecks, t: 'Checklist progress', d: 'Tick each step as you complete it.' },
          { icon: CalendarDays, t: 'Target countdown', d: 'See how many days to your planned travel.' },
          { icon: BookOpen, t: 'Linked to your route', d: 'Pulls in fees and processing time from your visa guide.' },
        ].map((b, i) => (
          <div key={i} className="p-4 rounded-xl bg-white border border-[rgba(14,20,36,0.05)]">
            <b.icon className="w-4 h-4 text-[#00C4B4] mb-2" />
            <div className="text-[13.5px] font-bold text-[#0A2540]">{b.t}</div>
            <div className="text-[11.5px] text-[#7a8195] mt-0.5 leading-snug">{b.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-7 text-[11px] text-[#9aa3b8] flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3 text-[#10b981]" /> Stored only in your browser. <Link href="/eligibility" className="text-[#00C4B4] font-semibold ml-1">Not sure which route? <ArrowRight className="inline w-3 h-3" /></Link>
      </div>
    </section>
  );
}
