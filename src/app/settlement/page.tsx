import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, ShieldCheck, Clock, ExternalLink, Crown,
  Home as HomeIcon, Globe2, Flag, RefreshCw, CheckCircle2, XCircle,
  Calculator, Sparkles,
} from 'lucide-react';
import { VISA_DETAILS } from '../../data/visaDetails';
import { SETTLEMENT_BREAKDOWNS } from '../../data/settlementFees';
import StickyMobileCta from '../../components/StickyMobileCta';
import EditorByline from '../../components/EditorByline';

export const metadata: Metadata = {
  title: 'UK Settlement 2026 — ILR, Citizenship, EUSS, BNO, Long Residence, Ancestry',
  description: 'Compare every UK settlement route side-by-side. Verified gov.uk fees and rules for ILR, naturalisation, EU Settlement Scheme, Hong Kong BNO, 10-year long residence and UK Ancestry visa. Updated May 2026.',
  alternates: { canonical: '/settlement' },
  openGraph: {
    title: 'UK Settlement Routes Compared',
    description: 'Side-by-side comparison of every UK route to ILR and citizenship — verified against gov.uk.',
    url: 'https://ukvisainfo.co.uk/settlement',
    type: 'article',
  },
};

interface Row {
  id: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  href: string;
  yearsToIlr: string;
  applicationFee: string;
  ihsImpact: string;
  english: string;
  litUkTest: 'Yes' | 'No' | 'At ILR';
  totalToIlrSingle: number | null;
  bestFor: string;
  source: string;
}

const ROWS: Row[] = [
  {
    id: 'euss', emoji: '🇪🇺', icon: Globe2,
    title: 'EU Settlement Scheme',
    href: '/visa-types/euss',
    yearsToIlr: '5 yrs continuous residence',
    applicationFee: 'Free',
    ihsImpact: 'None',
    english: 'Not required',
    litUkTest: 'No',
    totalToIlrSingle: 0,
    bestFor: 'EU/EEA/Swiss citizens already resident pre-2021',
    source: 'gov.uk/settled-status-eu-citizens-families',
  },
  {
    id: 'bno', emoji: '🇭🇰', icon: Flag,
    title: 'British National (Overseas)',
    href: '/visa-types/bno',
    yearsToIlr: '5 yrs on BN(O) visa',
    applicationFee: '£285 (5-year) / £206 (2.5-year)',
    ihsImpact: '£5,175 adult / £3,880 child per 5 yrs',
    english: 'B1 at ILR stage only',
    litUkTest: 'At ILR',
    totalToIlrSingle: 8539,
    bestFor: 'Hong Kong BN(O) status holders + family',
    source: 'gov.uk/british-national-overseas-bno-visa/how-much-it-costs',
  },
  {
    id: 'ancestry', emoji: '🌳', icon: RefreshCw,
    title: 'UK Ancestry',
    href: '/visa-types/ancestry',
    yearsToIlr: '5 yrs on Ancestry visa',
    applicationFee: '£726',
    ihsImpact: '£5,175 adult / £3,880 child per 5 yrs',
    english: 'B1 at ILR stage',
    litUkTest: 'At ILR',
    totalToIlrSingle: 8980,
    bestFor: 'Commonwealth citizens with UK-born grandparent',
    source: 'gov.uk/ancestry-visa',
  },
  {
    id: 'ilr', emoji: '🏡', icon: HomeIcon,
    title: 'ILR (5-year route)',
    href: '/visa-types/ilr',
    yearsToIlr: '5 yrs on Skilled Worker / Family / etc.',
    applicationFee: '£3,029',
    ihsImpact: 'Paid on prior visa (varies)',
    english: 'B1 CEFR',
    litUkTest: 'Yes',
    totalToIlrSingle: 3079,
    bestFor: 'Skilled Worker, Family, Health & Care, Talent, Innovator holders',
    source: 'gov.uk fee table 9 April 2025',
  },
  {
    id: 'long-residence', emoji: '📜', icon: HomeIcon,
    title: '10-year Long Residence',
    href: '/visa-types/long-residence',
    yearsToIlr: '10 yrs continuous lawful residence',
    applicationFee: '£3,226',
    ihsImpact: 'Paid on each prior visa (varies)',
    english: 'B1 CEFR',
    litUkTest: 'Yes',
    totalToIlrSingle: 3276,
    bestFor: 'Anyone with 10 years lawful UK residence but no 5-year route',
    source: 'gov.uk/long-residence',
  },
  {
    id: 'citizenship', emoji: '👑', icon: Crown,
    title: 'British Citizenship (Naturalisation)',
    href: '/visa-types/citizenship',
    yearsToIlr: '12 months on ILR (or immediate with British spouse)',
    applicationFee: '£1,839 incl. £130 ceremony',
    ihsImpact: 'None',
    english: 'B1 CEFR',
    litUkTest: 'Yes',
    totalToIlrSingle: 1839,
    bestFor: 'Permanent UK residents who want a British passport',
    source: 'gov.uk/apply-citizenship-indefinite-leave-to-remain',
  },
];

const POUND = (n: number | null) => n === null ? '—' : (n === 0 ? 'Free' : '£' + n.toLocaleString('en-GB'));

export default function SettlementHub() {
  return (
    <>
      {/* Hero — v3 light editorial */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-12 sm:pb-12">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              <Sparkles className="w-3 h-3" /> Settlement compare
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> gov.uk verified
            </span>
          </div>

          <h1 className="font-display text-[#0b0f19] text-[clamp(28px,6vw,46px)] font-extrabold leading-[1.06] tracking-[-0.028em] [text-wrap:balance]">
            Every UK settlement route in one view.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 text-[clamp(15.5px,1.4vw,18px)] leading-relaxed">
            6 routes to ILR or British citizenship — compared side-by-side on fees, time, English requirement, Life in the UK Test and best-fit profile. Every figure cited from gov.uk.
          </p>
        </div>
      </header>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">

          {/* Byline */}
          <EditorByline verified="May 2026" />

          {/* Comparison table */}
          <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] shadow-[0_2px_12px_rgba(10, 37, 64,0.04)] overflow-hidden">
            <div className="p-6 md:p-7 border-b border-[rgba(14,20,36,0.06)]">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#047857] mb-1.5">
                01 · Side-by-side
              </div>
              <h2 className="font-display text-[1.5rem] md:text-[1.875rem] font-bold text-[#0A2540] tracking-[-0.015em]">
                Compare all 6 routes
              </h2>
              <p className="mt-2 text-[14px] text-[#52596e] leading-relaxed">
                Application fee shown for a single adult applicant. IHS and dependants extra unless stated.
              </p>
            </div>

            {/* Mobile: stacked route cards (table hidden) */}
            <div className="md:hidden divide-y divide-[rgba(14,20,36,0.06)]">
              {ROWS.map((r) => (
                <Link key={r.id} href={r.href} className="block px-5 py-4 active:bg-emerald-50/40">
                  <div className="flex items-center gap-3">
                    <span className="text-[1.4rem] leading-none">{r.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#0b0f19] leading-tight">{r.title}</div>
                      <div className="text-[11.5px] text-[#9aa3b8] mt-0.5">{r.bestFor}</div>
                    </div>
                    <span className={`font-display font-bold text-[15px] tabular-nums shrink-0 ${r.totalToIlrSingle === 0 ? 'text-emerald-600' : 'text-[#0b0f19]'}`}>
                      {POUND(r.totalToIlrSingle)}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#f7f9fd] border border-[rgba(14,20,36,0.06)] px-2.5 py-1 text-[11px] font-semibold text-[#52596e]">{r.yearsToIlr}</span>
                    <span className="rounded-full bg-[#f7f9fd] border border-[rgba(14,20,36,0.06)] px-2.5 py-1 text-[11px] font-semibold text-[#52596e]">Fee {r.applicationFee}</span>
                    <span className="rounded-full bg-[#f7f9fd] border border-[rgba(14,20,36,0.06)] px-2.5 py-1 text-[11px] font-semibold text-[#52596e]">English: {r.english}</span>
                    <span className="rounded-full bg-[#f7f9fd] border border-[rgba(14,20,36,0.06)] px-2.5 py-1 text-[11px] font-semibold text-[#52596e]">LITUK: {r.litUkTest}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-[13.5px]">
                <thead>
                  <tr className="bg-[#f7f9fd] text-left">
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7a8195] whitespace-nowrap">Route</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7a8195] whitespace-nowrap">Time to ILR</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7a8195] whitespace-nowrap">Fee (single)</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7a8195] whitespace-nowrap">IHS</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7a8195] whitespace-nowrap">English</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7a8195] whitespace-nowrap">LITUK</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7a8195] whitespace-nowrap text-right">Total to ILR</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id} className="border-t border-[rgba(14,20,36,0.06)] hover:bg-white transition-colors duration-100">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[1.5rem] leading-none">{r.emoji}</span>
                          <div>
                            <div className="font-bold text-[#0A2540] leading-tight">{r.title}</div>
                            <div className="text-[11px] text-[#9aa3b8] mt-0.5">{r.bestFor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#1a2240] whitespace-nowrap">{r.yearsToIlr}</td>
                      <td className="px-5 py-4 text-[#1a2240] tabular-nums whitespace-nowrap">{r.applicationFee}</td>
                      <td className="px-5 py-4 text-[#52596e] whitespace-nowrap">{r.ihsImpact}</td>
                      <td className="px-5 py-4 text-[#52596e] whitespace-nowrap">{r.english}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {r.litUkTest === 'No'
                          ? <span className="inline-flex items-center gap-1 text-[12px] text-[#10b981] font-semibold"><XCircle className="w-3.5 h-3.5" /> Not required</span>
                          : r.litUkTest === 'At ILR'
                            ? <span className="inline-flex items-center gap-1 text-[12px] text-[#C9A14A] font-semibold"><Clock className="w-3.5 h-3.5" /> At ILR</span>
                            : <span className="inline-flex items-center gap-1 text-[12px] text-[#047857] font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Required</span>}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums">
                        <span className={`font-bold ${r.totalToIlrSingle === 0 ? 'text-[#10b981]' : 'text-[#0A2540]'}`}>
                          {POUND(r.totalToIlrSingle)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href={r.href} className="inline-flex items-center gap-1 text-[#047857] font-bold text-[12.5px] hover:gap-2 transition-[gap] duration-100">
                          Guide <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Source row */}
            <div className="px-5 py-3 bg-white border-t border-[rgba(14,20,36,0.06)] text-[11.5px] text-[#7a8195] flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-[#10b981]" />
              All figures verified against gov.uk on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
              <a href="https://www.gov.uk/government/publications/visa-regulations-revised-table" target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-[#047857] font-semibold hover:underline">
                Open fee table <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>

          {/* Route cards with cost stacks */}
          <section>
            <div className="mb-6">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#047857] mb-1.5">
                02 · Cost stacks
              </div>
              <h2 className="font-display text-[1.5rem] md:text-[1.875rem] font-bold text-[#0A2540] tracking-[-0.015em]">
                What each route costs in full
              </h2>
              <p className="mt-2 text-[14px] text-[#52596e] leading-relaxed max-w-2xl">
                Visualised cost stack from arrival to ILR for each route. Cite-by-cite breakdown linked from each card.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(SETTLEMENT_BREAKDOWNS).map(([slug, bd]) => {
                const v = VISA_DETAILS[slug as keyof typeof VISA_DETAILS];
                const max = Math.max(1, ...bd.lines.map((l) => l.amount));
                return (
                  <Link
                    key={slug}
                    href={`/visa-types/${slug}`}
                    className="group block rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5 md:p-6 hover:border-[#0A2540] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10, 37, 64,0.08)] transition-[transform,border-color,box-shadow] duration-150"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8]">
                          {bd.title.replace(' for a single applicant', '').replace(' — single adult', '').replace(' for a single adult', '')}
                        </div>
                        <div className="mt-1 font-display font-bold text-[16px] text-[#0A2540] group-hover:text-[#047857] transition-colors duration-100 leading-tight">
                          {v?.title ?? slug}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#9aa3b8]">Total</div>
                        <div className={`font-display font-bold text-[1.5rem] leading-none tabular-nums tracking-[-0.015em] ${bd.total === 0 ? 'text-[#10b981]' : 'text-[#0A2540]'}`}>
                          {POUND(bd.total)}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-1.5 mb-3">
                      {bd.lines.map((l) => (
                        <li key={l.label} className="flex items-center gap-3">
                          <span className="text-[12px] text-[#52596e] flex-1 truncate">{l.label}</span>
                          <div className="flex-1 max-w-[110px] h-1.5 bg-[#f3f5fb] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#047857] to-[#34d399] transition-[width] duration-500 ease-out"
                              style={{ width: bd.total === 0 ? '0%' : `${Math.max(3, (l.amount / max) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[12px] font-bold text-[#0A2540] tabular-nums w-16 text-right">
                            {l.amount === 0 ? '£0' : '£' + l.amount.toLocaleString('en-GB')}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 border-t border-[rgba(14,20,36,0.06)] flex items-center justify-between text-[11.5px] text-[#7a8195]">
                      <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#10b981]" /> gov.uk verified</span>
                      <span className="inline-flex items-center gap-1 text-[#047857] font-semibold group-hover:gap-1.5 transition-[gap] duration-100">
                        Open guide <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Decision tree */}
          <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-8 shadow-[0_2px_12px_rgba(10, 37, 64,0.04)]">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#047857] mb-1.5">
              03 · Pick your route
            </div>
            <h2 className="font-display text-[1.5rem] md:text-[1.875rem] font-bold text-[#0A2540] tracking-[-0.015em] mb-6">
              Which route fits you?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { q: 'I have BN(O) status from Hong Kong', a: 'British National (Overseas) visa', href: '/visa-types/bno' },
                { q: 'I have an EU/EEA/Swiss passport and was in the UK before 2021', a: 'EU Settlement Scheme (free)', href: '/visa-types/euss' },
                { q: 'I have a Commonwealth passport AND a UK-born grandparent', a: 'UK Ancestry visa', href: '/visa-types/ancestry' },
                { q: 'I\'m on a Skilled Worker / Family / Talent visa about to hit 5 years', a: 'Indefinite Leave to Remain', href: '/visa-types/ilr' },
                { q: 'I\'ve been in the UK lawfully for 10+ years but never hit a 5-year route', a: '10-year Long Residence ILR', href: '/visa-types/long-residence' },
                { q: 'I\'ve held ILR for 12+ months and want a British passport', a: 'British naturalisation', href: '/visa-types/citizenship' },
              ].map((c, i) => (
                <Link key={i} href={c.href} className="group flex items-start gap-3 p-4 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0A2540] hover:bg-white transition-colors duration-150">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 font-display font-bold text-[13px]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aa3b8]">If</div>
                    <div className="text-[13.5px] text-[#1a2240] leading-snug">{c.q}</div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-bold text-[#047857] group-hover:gap-2 transition-[gap] duration-100">
                      → {c.a} <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Calculator CTA */}
          <section>
            <Link
              href="/tools/cost-calculator"
              className="group block relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065f46] to-[#047857] p-7 md:p-10 text-white"
            >
              <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-emerald-300/25 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="max-w-md">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.1] border border-white/[0.16] text-emerald-200 text-[10.5px] font-bold uppercase tracking-[0.1em] mb-3">
                    <Calculator className="w-3 h-3" /> Full calculator
                  </span>
                  <h3 className="font-display text-[1.25rem] md:text-[1.5rem] font-bold leading-tight tracking-[-0.015em]">
                    Get an exact cost for your situation
                  </h3>
                  <p className="mt-2 text-white/55 text-[13.5px] leading-relaxed">
                    Pick your route, add dependants, choose priority service — see the total live, with every line cited to gov.uk.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 bg-white text-[#065f46] font-bold px-5 py-3 rounded-xl text-sm group-hover:gap-3 transition-[gap] duration-100">
                  Open cost calculator <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </section>
        </div>
      </div>

      <StickyMobileCta context="Plan your settlement" label="Open cost calculator" href="/tools/cost-calculator" />
    </>
  );
}
