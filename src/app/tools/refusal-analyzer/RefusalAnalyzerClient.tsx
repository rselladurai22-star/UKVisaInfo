'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, ShieldCheck, AlertTriangle, AlertCircle, Info, CheckCircle2,
  ArrowRight, Lock, RotateCcw, MessageCircle, BookOpen,
} from 'lucide-react';
import { analyzeRefusal, type AnalysisFinding, type Severity } from '../../../lib/refusalRules';
import SidebarAffiliate from '../../../components/blog/SidebarAffiliate';
import StickyMobileCta from '../../../components/StickyMobileCta';

const SEV_STYLES: Record<Severity, { bg: string; border: string; text: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  critical: { bg: 'rgba(239,68,68,0.06)',  border: '#ef4444', text: '#b91c1c', icon: AlertCircle,    label: 'Critical' },
  high:     { bg: 'rgba(245,158,11,0.06)', border: '#f59e0b', text: '#92400e', icon: AlertTriangle,  label: 'High' },
  medium:   { bg: 'rgba(59,130,246,0.06)', border: '#3b82f6', text: '#1d4ed8', icon: Info,           label: 'Medium' },
  low:      { bg: 'rgba(107,114,128,0.05)',border: '#6b7280', text: '#374151', icon: Info,           label: 'Low' },
};

export default function RefusalAnalyzerClient() {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const findings = useMemo(() => (submitted ? analyzeRefusal(text) : []), [submitted, text]);
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const onAnalyze = () => {
    if (text.trim().length < 50) return;
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };
  const onReset = () => { setText(''); setSubmitted(false); };

  return (
    <>
      {/* Hero */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#18181B] via-[#0e1b3f] to-[#0F2C4B] pt-[100px] md:pt-[120px] pb-12 md:pb-16">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201, 161, 74,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#6366F1]/20 blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A] mb-4">
            <Sparkles className="w-3 h-3" /> Free · No signup
          </span>
          <h1 className="font-display text-white text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold leading-[1.05] tracking-[-0.025em]">
            UK Visa Refusal Analyzer
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-white/65 text-base md:text-[1.0625rem] leading-relaxed">
            Paste your refusal letter and we&apos;ll decode each ground in plain English, severity, what it means, and what to do next.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-white/45 text-[12px]">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#60a5fa]" /> Runs in your browser, never sent to a server</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#C9A14A]" /> Based on Home Office decision-letter rules</span>
          </div>
        </div>
      </header>

      {/* Tool */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-10">

            <main className="col-span-12 lg:col-span-8 space-y-5">
              {/* Input */}
              <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(24, 24, 27,0.04)]">
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#6366F1] mb-1.5">
                    01 · Paste your letter
                  </div>
                  <h2 className="font-display text-[1.375rem] md:text-[1.625rem] font-bold text-[#18181B] tracking-[-0.015em] leading-tight">
                    Paste the refusal letter text below
                  </h2>
                  <p className="mt-2 text-[13px] text-[#7a8195] leading-relaxed">
                    Copy and paste the main body, especially the &ldquo;Reasons for Refusal&rdquo; section. Personal details like your name and reference number can be left in or stripped.
                  </p>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => { setText(e.target.value); if (submitted) setSubmitted(false); }}
                  placeholder="Paste the full refusal letter or the &quot;Reasons for Refusal&quot; section here…&#10;&#10;Example: &quot;Your application has been refused under paragraph 320(7A) of the Immigration Rules because…&quot;"
                  className="w-full min-h-[260px] md:min-h-[320px] p-4 rounded-2xl border border-[rgba(14,20,36,0.1)] bg-white focus:bg-white focus:border-[#18181B] outline-none transition-colors duration-100 text-[14px] leading-relaxed text-[#18181B] placeholder:text-[#9aa3b8] font-mono resize-y"
                  spellCheck={false}
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11.5px] text-[#7a8195] tabular-nums">
                    {wordCount} words · {charCount} chars
                    {charCount > 0 && charCount < 50 && <span className="text-[#C9A14A] ml-2">(too short to analyze)</span>}
                  </div>
                  <div className="flex gap-2">
                    {text.length > 0 && (
                      <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center gap-1.5 bg-white border border-[rgba(14,20,36,0.1)] text-[#52525B] font-semibold px-4 py-2.5 rounded-xl text-[13px] hover:border-[rgba(14,20,36,0.18)] hover:bg-white transition-colors duration-100"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onAnalyze}
                      disabled={text.trim().length < 50}
                      className="inline-flex items-center gap-2 bg-[#6366F1] text-white font-bold px-5 py-2.5 rounded-xl text-[13px] hover:bg-[#009E91] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-[background,transform] duration-100 shadow-[0_4px_14px_rgba(99, 102, 241,0.32)]"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Analyze letter
                    </button>
                  </div>
                </div>
              </section>

              {/* Results */}
              {submitted && (
                <section id="analysis-results" className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(24, 24, 27,0.04)] scroll-mt-24">
                  <div className="mb-5 pb-4 border-b border-[rgba(14,20,36,0.06)]">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#6366F1] mb-1.5">
                      02 · Analysis
                    </div>
                    <h2 className="font-display text-[1.375rem] md:text-[1.625rem] font-bold text-[#18181B] tracking-[-0.015em] leading-tight">
                      {findings.length === 0
                        ? 'No common refusal patterns detected'
                        : findings.length === 1
                          ? '1 ground identified'
                          : `${findings.length} grounds identified`}
                    </h2>
                  </div>

                  {findings.length === 0 ? (
                    <div className="rounded-2xl bg-[#fffbeb] border border-[#fde68a] p-5">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-[#C9A14A] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-[14px] font-bold text-[#78350f]">
                            We didn&apos;t recognise specific paragraphs or keywords.
                          </div>
                          <p className="mt-2 text-[13px] text-[#92400e] leading-relaxed">
                            This may mean the letter uses non-standard wording, the text pasted was too short, or the refusal grounds are uncommon. Try pasting the full &ldquo;Reasons for Refusal&rdquo; section.
                            For complex refusals, get advice from an OISC-regulated immigration solicitor.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ol className="space-y-4">
                      {findings.map((f, i) => (
                        <FindingCard key={f.id} finding={f} index={i + 1} />
                      ))}
                    </ol>
                  )}

                  {/* Always-on advice */}
                  <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-[#18181B] to-[#0F2C4B] text-white relative overflow-hidden">
                    <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-[#6366F1]/25 blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#C9A14A] mb-2">
                        Important
                      </div>
                      <p className="text-[13.5px] text-white/75 leading-relaxed">
                        This tool offers general educational guidance based on common Home Office wording. It is <strong className="text-white">not legal advice</strong>.
                        Complex or critical refusals deserve a professional review from an OISC-regulated immigration solicitor.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* How it works */}
              {!submitted && (
                <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(24, 24, 27,0.04)]">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#6366F1] mb-2">How it works</div>
                  <h3 className="font-display text-[1.125rem] font-bold text-[#18181B] mb-4">
                    Three quick steps
                  </h3>
                  <ol className="space-y-3">
                    {[
                      { t: 'Paste the letter', d: 'Copy the body of your refusal letter into the box above. Personal details aren&apos;t needed.' },
                      { t: 'We scan for known patterns', d: 'The text is matched against Home Office paragraph numbers and decision-letter wording, all in your browser, nothing is uploaded.' },
                      { t: 'You get a plain-English breakdown', d: 'Each ground is categorised by severity (critical / high / medium) with what it means and what to do next.' },
                    ].map((s, i) => (
                      <li key={i} className="flex gap-3 items-start p-3.5 rounded-xl bg-white border border-[rgba(14,20,36,0.05)]">
                        <span className="w-7 h-7 rounded-full bg-[#18181B] text-white font-display font-bold text-[12px] flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        <div>
                          <div className="text-[14.5px] font-bold text-[#18181B]">{s.t}</div>
                          <div className="text-[13px] text-[#52525B] mt-0.5">{s.d}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </main>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[100px] space-y-4">

                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-[#dbeafe] text-[#15803d] flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="text-[13.5px] font-bold text-[#18181B] leading-tight">Need expert help?</div>
                      <div className="text-[11px] text-[#7a8195]">Free 15-min consult</div>
                    </div>
                  </div>
                  <p className="text-[12.5px] text-[#52525B] leading-snug mb-3">
                    Critical and high-severity refusals are worth a 15-minute review with a UK OISC-regulated immigration solicitor.
                  </p>
                  <Link
                    href="/eligibility"
                    className="block text-center bg-[#18181B] text-white text-[12.5px] font-bold py-2.5 rounded-xl hover:bg-[#0F2C4B] transition-colors duration-100"
                  >
                    Get matched with a solicitor →
                  </Link>
                </div>

                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-3">
                    Related guides
                  </div>
                  <ul className="space-y-2">
                    {[
                      { href: '/blog/uk-visitor-visa-refused-top-reasons-2026', label: 'Top Visitor visa refusal reasons 2026' },
                      { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026', label: 'Skilled Worker salary thresholds' },
                      { href: '/blog/uk-family-visa-minimum-income-2026-what-counts', label: 'Family visa minimum income' },
                    ].map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="group flex items-start gap-2 text-[13px] text-[#52525B] hover:text-[#18181B] transition-colors duration-100"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{l.label}</span>
                          <ArrowRight className="w-3 h-3 text-[#cfd5e0] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <SidebarAffiliate tags={['Skilled Worker', 'Family', 'Student']} />

                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.05)] p-4">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Private by design
                  </div>
                  <p className="text-[12px] text-[#52525B] leading-snug">
                    Pattern matching runs entirely in your browser. No text leaves your device, and nothing is stored on our servers.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta context="Need expert help?" label="Get matched with a solicitor" href="/eligibility" />
    </>
  );
}

function FindingCard({ finding: f, index }: { finding: AnalysisFinding; index: number }) {
  const s = SEV_STYLES[f.severity];
  const Icon = s.icon;
  return (
    <li
      className="rounded-2xl p-5 relative"
      style={{ background: s.bg, boxShadow: `inset 4px 0 0 ${s.border}` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-full bg-white text-[#18181B] font-display font-bold text-[12px] flex items-center justify-center flex-shrink-0 border border-[rgba(14,20,36,0.08)]">
          {index}
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-[0.1em]"
          style={{ background: s.border, color: '#fff' }}
        >
          <Icon className="w-3 h-3" />
          {s.label}
        </span>
        <span className="text-[11px] font-semibold text-[#7a8195] uppercase tracking-[0.06em]">
          {f.category}
        </span>
      </div>

      <h3 className="font-display font-bold text-[1.0625rem] md:text-[1.125rem] text-[#18181B] leading-tight tracking-[-0.01em] mb-3">
        {f.title}
      </h3>

      <dl className="space-y-2.5 text-[13.5px]">
        <Row label="What it means">{f.what}</Row>
        <Row label="Why it matters">{f.why}</Row>
        <Row label="What to do next" highlight>{f.next}</Row>
      </dl>

      <div className="mt-3 pt-3 border-t border-[rgba(14,20,36,0.08)] text-[11.5px] text-[#7a8195]">
        Matched on: <code className="bg-white/60 px-1.5 py-0.5 rounded font-mono text-[#18181B]">&ldquo;{f.matchedText}&rdquo;</code>
      </div>
    </li>
  );
}

function Row({ label, children, highlight }: { label: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`flex flex-col sm:flex-row gap-1.5 sm:gap-3 ${highlight ? 'pt-2.5 mt-2 border-t border-[rgba(14,20,36,0.08)]' : ''}`}>
      <dt className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7a8195] sm:w-32 flex-shrink-0 pt-1">
        {label}
      </dt>
      <dd className={`flex-1 leading-[1.65] ${highlight ? 'font-semibold text-[#18181B]' : 'text-[#1a2240]'}`}>
        {children}
      </dd>
    </div>
  );
}

/* Unused for now but available if we add a positive feedback variant */
export const _CheckCircle = CheckCircle2;
