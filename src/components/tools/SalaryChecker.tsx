'use client';

import { useMemo, useState } from 'react';
import {
  Search, CheckCircle2, XCircle, AlertTriangle, Info,
  Briefcase, TrendingUp, Sparkles, ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { SOC_OCCUPATIONS, THRESHOLDS, SOC_GROUPS, type SocOccupation } from '../../data/socCodes';

type EntryType = 'general' | 'newEntrant';

const fmt = (n: number) =>
  '£' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 });

export default function SalaryChecker() {
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [picked, setPicked] = useState<SocOccupation | null>(null);
  const [salaryRaw, setSalaryRaw] = useState('');
  const [hours, setHours] = useState(37.5);
  const [entry, setEntry] = useState<EntryType>('general');

  const salary = Number(salaryRaw.replace(/[^0-9]/g, '')) || 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = selectedGroup === 'All'
      ? SOC_OCCUPATIONS
      : SOC_OCCUPATIONS.filter((o) => o.group === selectedGroup);
    if (!q) return base.slice(0, 25);
    return base.filter((o) =>
      o.title.toLowerCase().includes(q) || o.code.includes(q),
    ).slice(0, 25);
  }, [query, selectedGroup]);

  // The 3 thresholds that apply
  const result = useMemo(() => {
    if (!picked || !salary) return null;

    const fullTimeEquivalent = (salary * 37.5) / hours;
    const hourlyRate = salary / (hours * 52);

    const baseThreshold = entry === 'newEntrant' ? THRESHOLDS.newEntrant : THRESHOLDS.general;
    const islThreshold = entry === 'newEntrant' ? THRESHOLDS.newEntrant : THRESHOLDS.islGeneral;
    const applicableMin = picked.isl ? islThreshold : baseThreshold;
    const goingRate = picked.goingRate;
    const effectiveThreshold = Math.max(applicableMin, goingRate);

    const passesGeneral = fullTimeEquivalent >= applicableMin;
    const passesGoingRate = fullTimeEquivalent >= goingRate;
    const passesHourly = hourlyRate >= THRESHOLDS.hourlyMinimum;
    const passesAll = passesGeneral && passesGoingRate && passesHourly;

    return {
      fullTimeEquivalent,
      hourlyRate,
      baseThreshold: applicableMin,
      goingRate,
      effectiveThreshold,
      passesGeneral,
      passesGoingRate,
      passesHourly,
      passesAll,
      gap: passesAll ? 0 : effectiveThreshold - fullTimeEquivalent,
    };
  }, [picked, salary, hours, entry]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-[88px] md:pt-[104px] pb-10 md:pb-12 hero-light">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-[#d9152b]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#d9152b]">
              Tool · Salary checker
            </span>
          </div>
          <h1 className="font-display text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold text-[#0a1530] tracking-tight leading-tight">
            UK Skilled Worker salary checker
          </h1>
          <p className="mt-3 max-w-2xl text-[#52596e] text-base md:text-lg leading-relaxed">
            Find your SOC 2020 occupation code, enter your offered salary,
            and see instantly whether you clear all three Skilled Worker
            thresholds. Updated April 2026.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-6">
          {/* ── LEFT: Occupation picker ── */}
          <div className="lg:col-span-7 bg-white rounded-2xl md:rounded-3xl shadow-soft border border-[rgba(14,20,36,0.08)] overflow-hidden">
            <div className="p-5 md:p-6 border-b border-[rgba(14,20,36,0.06)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d9152b] text-white text-[11px] font-bold">1</span>
                <h2 className="font-display font-bold text-base text-[#0a1530]">
                  Find your occupation
                </h2>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52596e]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by job title or SOC code…"
                  className="w-full pl-10 pr-3 py-3 bg-[#f3f5fb] border border-transparent focus:bg-white focus:border-[#0a1530] rounded-xl text-sm placeholder:text-[#7a8195] outline-none transition-all"
                  aria-label="Search occupations"
                />
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {['All', ...SOC_GROUPS].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGroup(g)}
                    className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      selectedGroup === g
                        ? 'bg-[#0a1530] text-white'
                        : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#eaeef7]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <ul className="max-h-[500px] overflow-y-auto divide-y divide-[rgba(14,20,36,0.05)]">
              {filtered.length === 0 ? (
                <li className="p-10 text-center text-sm text-[#7a8195]">
                  No occupations match &ldquo;{query}&rdquo;.
                </li>
              ) : filtered.map((o) => {
                const isPicked = picked?.code === o.code;
                return (
                  <li key={o.code}>
                    <button
                      onClick={() => setPicked(o)}
                      className={`w-full text-left p-4 md:p-5 flex items-center gap-4 transition-colors ${
                        isPicked
                          ? 'bg-[rgba(217,21,43,0.05)]'
                          : 'hover:bg-[#f9fafb]'
                      }`}
                    >
                      <span className={`font-mono text-[11px] font-bold px-2 py-1 rounded ${
                        isPicked
                          ? 'bg-[#d9152b] text-white'
                          : 'bg-[#f3f5fb] text-[#52596e]'
                      }`}>
                        {o.code}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold truncate ${
                          isPicked ? 'text-[#d9152b]' : 'text-[#0a1530]'
                        }`}>
                          {o.title}
                        </div>
                        <div className="text-[11px] text-[#7a8195] mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{o.group}</span>
                          {o.isl && (
                            <span className="px-1.5 py-0.5 rounded bg-[rgba(255,191,71,0.18)] text-[#9a6800] font-semibold uppercase tracking-wider">
                              ISL
                            </span>
                          )}
                          {o.closedToNewOverseas && (
                            <span className="px-1.5 py-0.5 rounded bg-[rgba(217,21,43,0.12)] text-[#b8101f] font-semibold uppercase tracking-wider">
                              Route closed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#0a1530] tabular-nums">
                          {fmt(o.goingRate)}
                        </div>
                        <div className="text-[10px] text-[#7a8195] uppercase tracking-wider">going rate</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── RIGHT: Inputs + Result ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-soft border border-[rgba(14,20,36,0.08)] p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d9152b] text-white text-[11px] font-bold">2</span>
                <h2 className="font-display font-bold text-base text-[#0a1530]">
                  Enter your offer
                </h2>
              </div>

              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">
                  Annual salary
                </span>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7a8195]">
                    £
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={salaryRaw}
                    onChange={(e) => setSalaryRaw(e.target.value)}
                    placeholder="38,700"
                    className="w-full pl-7 pr-3 py-3 bg-[#f3f5fb] border border-transparent focus:bg-white focus:border-[#0a1530] rounded-xl text-base font-semibold text-[#0a1530] tabular-nums outline-none transition-all"
                  />
                </div>
              </label>

              <label className="block mt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">
                  Weekly hours
                </span>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Math.max(1, Number(e.target.value) || 0))}
                  min={1}
                  max={48}
                  step={0.5}
                  className="w-full mt-1.5 px-3 py-3 bg-[#f3f5fb] border border-transparent focus:bg-white focus:border-[#0a1530] rounded-xl text-base font-semibold text-[#0a1530] tabular-nums outline-none transition-all"
                />
              </label>

              <div className="mt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#52596e] block mb-2">
                  Applicant type
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEntry('general')}
                    className={`px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                      entry === 'general'
                        ? 'bg-[#0a1530] text-white shadow-soft'
                        : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#eaeef7]'
                    }`}
                  >
                    General (£38,700)
                  </button>
                  <button
                    onClick={() => setEntry('newEntrant')}
                    className={`px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                      entry === 'newEntrant'
                        ? 'bg-[#0a1530] text-white shadow-soft'
                        : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#eaeef7]'
                    }`}
                  >
                    New entrant (£30,960)
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-[#7a8195] leading-relaxed">
                  New entrant: under 26, recent graduate, or switching from
                  Student / Graduate visa. Valid up to 4 years.
                </p>
              </div>
            </div>

            {/* Result card */}
            <AnimatePresence mode="wait">
              {picked && salary > 0 && result ? (
                <motion.div
                  key={`${picked.code}-${salary}-${entry}-${hours}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-2xl md:rounded-3xl shadow-card overflow-hidden ${
                    result.passesAll
                      ? 'bg-gradient-to-br from-[#057a55] to-[#076e49] text-white'
                      : 'bg-gradient-to-br from-[#b8101f] to-[#8b001d] text-white'
                  }`}
                >
                  <div className="p-6 md:p-7">
                    <div className="flex items-center gap-2 mb-2">
                      {result.passesAll ? (
                        <CheckCircle2 className="w-5 h-5 text-[#a0f0c4]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#ffc4cb]" />
                      )}
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-80">
                        {result.passesAll ? 'Qualifies' : 'Does not qualify'}
                      </span>
                    </div>
                    <div className="font-display text-2xl md:text-3xl font-bold leading-tight">
                      {result.passesAll
                        ? 'Your salary clears all 3 thresholds'
                        : `${fmt(result.gap)} short`}
                    </div>
                    {picked.closedToNewOverseas && (
                      <div className="mt-3 flex items-start gap-2 text-xs bg-white/10 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#ffbf47]" />
                        <span>
                          This route is closed to new overseas applicants
                          (closed March 2025). Cannot apply from outside the UK.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/10 px-6 md:px-7 py-4">
                    <ul className="text-sm space-y-2.5">
                      <li className="flex items-center justify-between">
                        <span className="opacity-90">General minimum</span>
                        <span className="flex items-center gap-2 font-semibold tabular-nums">
                          {fmt(result.baseThreshold)}
                          {result.passesGeneral ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#a0f0c4]" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-[#ffc4cb]" />
                          )}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="opacity-90">Occupation going rate</span>
                        <span className="flex items-center gap-2 font-semibold tabular-nums">
                          {fmt(result.goingRate)}
                          {result.passesGoingRate ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#a0f0c4]" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-[#ffc4cb]" />
                          )}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="opacity-90">Hourly rate (£15.88 min)</span>
                        <span className="flex items-center gap-2 font-semibold tabular-nums">
                          £{result.hourlyRate.toFixed(2)}
                          {result.passesHourly ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#a0f0c4]" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-[#ffc4cb]" />
                          )}
                        </span>
                      </li>
                      {hours !== 37.5 && (
                        <li className="flex items-center justify-between pt-2 border-t border-white/15">
                          <span className="opacity-70 text-xs">Full-time equivalent</span>
                          <span className="font-semibold text-xs tabular-nums">
                            {fmt(result.fullTimeEquivalent)}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-2xl md:rounded-3xl border-2 border-dashed border-[rgba(14,20,36,0.1)] p-8 text-center">
                  <Sparkles className="w-6 h-6 text-[#7a8195] mx-auto mb-2" />
                  <p className="text-sm text-[#7a8195]">
                    {!picked
                      ? 'Pick an occupation to start'
                      : 'Enter your annual salary'}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="py-14 md:py-20 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0a1530]">
            How the 3-threshold rule works in 2026
          </h2>
          <p className="mt-4 text-[#52596e] leading-relaxed">
            The Skilled Worker visa requires your salary to clear three
            independent tests. Caseworkers take the highest as your
            effective threshold. Falling short on any single test is a
            refusal.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { num: 1, label: 'General minimum', val: '£38,700', desc: 'Reduced to £30,960 for new entrants, ISL roles' },
              { num: 2, label: 'Going rate', val: 'Varies', desc: 'Set by SOC 2020 code at 25th percentile of UK earnings for the role' },
              { num: 3, label: 'Hourly rate', val: '£15.88/hr', desc: 'Mandatory minimum regardless of contract type' },
            ].map((t) => (
              <div key={t.num} className="bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0a1530] text-white text-xs font-bold">
                    {t.num}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">
                    {t.label}
                  </span>
                </div>
                <div className="font-display text-2xl font-bold text-[#0a1530] tabular-nums">
                  {t.val}
                </div>
                <p className="mt-1.5 text-xs text-[#7a8195] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[rgba(37,99,235,0.05)] border border-[rgba(37,99,235,0.15)] rounded-2xl p-5 flex gap-3">
            <Info className="w-5 h-5 text-[#2563eb] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#0e1424] leading-relaxed">
              This tool covers the most-sponsored 100+ SOC 2020 codes. For
              full coverage and definitive thresholds, see Home Office
              Appendix Skilled Occupations. Health & Care visa roles have
              separate (lower) thresholds — see our <Link href="/blog/uk-health-care-worker-visa-2026-complete-guide" className="text-[#2563eb] underline">Health & Care guide</Link>.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/blog/uk-skilled-worker-visa-salary-threshold-2026"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#0a1530] text-white text-sm font-semibold rounded-xl hover:bg-[#1b2c5b] transition-colors"
            >
              Full salary threshold guide
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools/sponsor-search"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[rgba(14,20,36,0.12)] text-[#0a1530] text-sm font-semibold rounded-xl hover:border-[#0a1530] transition-colors"
            >
              Find a licensed sponsor
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
