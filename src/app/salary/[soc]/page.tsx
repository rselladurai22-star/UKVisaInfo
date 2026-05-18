import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Briefcase, TrendingUp, Clock, AlertCircle,
  CheckCircle2, XCircle, ExternalLink, ShieldCheck, Building2, Banknote,
} from 'lucide-react';
import { SOC_OCCUPATIONS, THRESHOLDS } from '../../../data/socCodes';
import { SPONSORS } from '../../../data/sponsors';
import { socSlug, parseSocSlug } from '../../../lib/slug';
import SidebarAffiliate from '../../../components/blog/SidebarAffiliate';
import StickyMobileCta from '../../../components/StickyMobileCta';

interface RouteParams { params: Promise<{ soc: string }> }

export function generateStaticParams() {
  return SOC_OCCUPATIONS.map((o) => ({ soc: socSlug(o.code, o.title) }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { soc } = await params;
  const code = parseSocSlug(soc);
  const occ = code ? SOC_OCCUPATIONS.find((o) => o.code === code) : null;
  if (!occ) return { title: 'Occupation not found' };

  const title = `${occ.title} — UK Skilled Worker Salary 2026 (SOC ${occ.code})`;
  const description =
    `${occ.title} (SOC ${occ.code}) UK Skilled Worker visa going rate 2026: ` +
    `£${occ.goingRate.toLocaleString()} standard, £${occ.hourlyGoingRate?.toFixed(2) ?? '—'}/hour. ` +
    `${occ.lowerGoingRate ? `New-entrant rate £${occ.lowerGoingRate.toLocaleString()}. ` : ''}` +
    `Verified against Home Office Appendix Skilled Occupations.`;

  return {
    title, description,
    alternates: { canonical: `/salary/${soc}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/salary/${soc}`, type: 'article' },
  };
}

export default async function SalaryPage({ params }: RouteParams) {
  const { soc } = await params;
  const code = parseSocSlug(soc);
  if (!code) notFound();
  const occ = SOC_OCCUPATIONS.find((o) => o.code === code);
  if (!occ) notFound();

  // Effective threshold = max(general, going rate, hourly * 1950 hrs)
  const generalMin = THRESHOLDS.general;
  const effectiveThreshold = Math.max(occ.goingRate, generalMin);
  const newEntrantEffective = Math.max(
    occ.lowerGoingRate ?? generalMin,
    THRESHOLDS.newEntrant
  );
  const hourlyFloor = THRESHOLDS.hourlyMinimum;

  // Find related sponsors by sector match
  const sectorBucket = mapGroupToSector(occ.group);
  const relatedSponsors = SPONSORS
    .filter((s) => s.sector === sectorBucket && s.rating !== 'B')
    .slice(0, 12);

  // Adjacent SOC codes in the same group
  const related = SOC_OCCUPATIONS
    .filter((o) => o.group === occ.group && o.code !== occ.code)
    .slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${occ.title} — UK Skilled Worker Salary Threshold 2026`,
    description: `SOC ${occ.code} occupation going rate and Skilled Worker visa thresholds for 2026.`,
    datePublished: '2026-04-01', dateModified: '2026-05-18',
    author: { '@type': 'Organization', name: 'UK Visa Info' },
    publisher: { '@type': 'Organization', name: 'UK Visa Info' },
    mainEntityOfPage: `https://ukvisainfo.co.uk/salary/${soc}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#0e1b3f] to-[#13204a] pt-[100px] md:pt-[120px] pb-12 md:pb-16">
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '22px 22px' }}
        />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#d9152b]/20 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Link href="/tools/salary-checker" className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-sm font-medium mb-6 transition-colors duration-100">
            <ArrowLeft className="w-4 h-4" /> Salary checker
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#ffbf47]">
              <Briefcase className="w-3 h-3" /> SOC {occ.code}
            </span>
            <span className="inline-flex items-center text-[10.5px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.14] text-white/65">
              {occ.group}
            </span>
            {occ.closedToNewOverseas && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#fca5a5] text-[10.5px] font-bold uppercase tracking-[0.1em]">
                <XCircle className="w-3 h-3" /> Closed to new overseas
              </span>
            )}
            {occ.isl && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#34d399] text-[10.5px] font-bold uppercase tracking-[0.1em]">
                <CheckCircle2 className="w-3 h-3" /> Immigration Salary List
              </span>
            )}
          </div>

          <h1 className="font-display text-white text-[1.75rem] sm:text-[2.25rem] md:text-[2.875rem] font-bold leading-[1.04] tracking-[-0.025em]">
            {occ.title}
          </h1>
          <p className="mt-4 max-w-2xl text-white/65 text-base md:text-[1.0625rem] leading-relaxed">
            UK Skilled Worker visa going rate and threshold requirements for {occ.title.toLowerCase()} (SOC {occ.code}) under 2026 Home Office rules.
          </p>

          {/* Big stat row */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Going rate" value={`£${occ.goingRate.toLocaleString()}`} sub="standard" accent="#ffbf47" />
            <StatCard label="Per hour" value={`£${occ.hourlyGoingRate?.toFixed(2) ?? '—'}`} sub="at 37.5h/week" />
            {occ.lowerGoingRate ? (
              <StatCard label="New-entrant" value={`£${occ.lowerGoingRate.toLocaleString()}`} sub="discounted rate" />
            ) : (
              <StatCard label="General min" value={`£${THRESHOLDS.general.toLocaleString()}`} sub="2026 floor" />
            )}
            <StatCard label="Effective floor" value={`£${effectiveThreshold.toLocaleString()}`} sub="actual minimum" accent="#34d399" />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="bg-[#fafbfd]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-10">

            {/* Main */}
            <main className="col-span-12 lg:col-span-8 space-y-5 md:space-y-6">

              <Section eyebrow="01 · Threshold" title={`The 2026 numbers for SOC ${occ.code}`}>
                <p className="text-[#1a2240] text-[16px] md:text-[17px] leading-[1.7] mb-5">
                  To sponsor a <strong>{occ.title.toLowerCase()}</strong> on a Skilled Worker visa in 2026, the salary
                  offered must clear <strong>three separate tests</strong>. The Home Office takes the <strong>highest</strong>
                  of the three as the applicant&apos;s effective threshold.
                </p>

                <ol className="space-y-3 mb-6">
                  <ThresholdRow num={1} label="General minimum" value={`£${THRESHOLDS.general.toLocaleString()}`} note="Across all eligible occupations" />
                  <ThresholdRow num={2} label={`Going rate for SOC ${occ.code}`} value={`£${occ.goingRate.toLocaleString()}`} note="25th percentile UK earnings for the role" highlight />
                  <ThresholdRow num={3} label="Hourly floor" value={`£${hourlyFloor.toFixed(2)}/hr`} note="Across 37.5-hour standard week" />
                </ol>

                <div className="rounded-2xl bg-gradient-to-br from-[#dcfce7] to-white border border-[#bbf7d0] p-5">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#047857] mb-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Your effective threshold
                  </div>
                  <div className="font-display font-bold text-[1.75rem] md:text-[2rem] text-[#0a1530] tracking-[-0.02em] tabular-nums">
                    £{effectiveThreshold.toLocaleString()}{' '}
                    <span className="text-[14px] font-medium text-[#52596e]">/year</span>
                  </div>
                  <p className="mt-2 text-[13px] text-[#047857] leading-snug">
                    A salary below this will be refused at the salary stage with no appeal on that ground.
                  </p>
                </div>
              </Section>

              {(occ.lowerGoingRate || occ.isl) && (
                <Section eyebrow="02 · Discounts" title="Lower-rate paths">
                  <p className="text-[#52596e] text-[14.5px] leading-relaxed mb-5">
                    Some applicants can use a discounted threshold instead of the standard going rate. The lowest applicable rate wins.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {occ.lowerGoingRate && (
                      <DiscountCard
                        title="New-entrant rate"
                        value={`£${occ.lowerGoingRate.toLocaleString()}`}
                        eligibility="Under 26, recent graduate, or switching from Student/Graduate visa. Max 4 years on this rate."
                        effective={`£${newEntrantEffective.toLocaleString()}`}
                      />
                    )}
                    {occ.isl && (
                      <DiscountCard
                        title="Immigration Salary List"
                        value={`£${THRESHOLDS.islGeneral.toLocaleString()}`}
                        eligibility="SOC code is currently on the ISL — 20% discount on the general minimum."
                        effective={`£${Math.max(THRESHOLDS.islGeneral, occ.lowerGoingRate ?? occ.goingRate).toLocaleString()}`}
                      />
                    )}
                  </div>
                </Section>
              )}

              {occ.closedToNewOverseas && (
                <Section eyebrow="03 · Status" title="Closed to new overseas applications">
                  <div className="rounded-2xl bg-[#fef2f2] border border-[#fecaca] p-5 flex gap-3 items-start">
                    <span className="w-7 h-7 rounded-lg bg-[#ef4444] text-white flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                    <div className="text-[14px] text-[#7f1d1d] leading-relaxed">
                      <strong className="text-[#991b1b]">This route is closed to new overseas applicants in 2026.</strong>
                      {' '}You cannot apply from outside the UK. In-country switches may still be possible — see the
                      Home Office published guidance for the latest position.
                    </div>
                  </div>
                </Section>
              )}

              <Section eyebrow="04 · How to check" title="Verify your offer clears the threshold">
                <ol className="space-y-3 mb-5">
                  {[
                    `Confirm your offer letter shows a basic gross salary of at least £${effectiveThreshold.toLocaleString()}.`,
                    'Subtract bonuses, overtime, commission, in-kind benefits and pension contributions — none of these count.',
                    `Check the hourly equivalent: divide annual basic by your contracted weekly hours × 52. Must be £${hourlyFloor.toFixed(2)} or higher.`,
                    'If you qualify for the new-entrant or ISL discount, apply it — they stack with each other to give the lowest floor.',
                    'Build in a £500+ margin: Home Office caseworkers round down, not up.',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 items-start p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white">
                      <span className="w-7 h-7 rounded-full bg-[#0a1530] text-white font-display font-bold text-[12px] flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-[#1a2240] text-[14.5px] leading-[1.6]">{step}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/tools/salary-checker"
                  className="inline-flex items-center gap-1.5 text-[#d9152b] text-sm font-bold hover:gap-2.5 transition-[gap] duration-100"
                >
                  Use the interactive salary checker <ArrowRight className="w-4 h-4" />
                </Link>
              </Section>

              {relatedSponsors.length > 0 && (
                <Section eyebrow="05 · Sponsors" title={`Top ${sectorBucket} sponsors`}>
                  <p className="text-[#52596e] text-[14.5px] leading-relaxed mb-5">
                    A sample of A-rated licence holders in the {sectorBucket.toLowerCase()} sector — likely sponsors for {occ.title.toLowerCase()} roles.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {relatedSponsors.map((s) => (
                      <div key={s.name} className="flex items-start gap-3 p-3.5 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white">
                        <span className="mt-0.5 w-7 h-7 rounded-lg bg-[rgba(37,99,235,0.1)] text-[#2563eb] flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-semibold text-[#0a1530] truncate">{s.name}</div>
                          <div className="text-[11.5px] text-[#7a8195] flex items-center gap-1.5">
                            <span>{s.city}</span>
                            <span className="text-[#cfd5e0]">·</span>
                            <span className="text-[#10b981] font-semibold">{s.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/sponsors/sector/${sectorBucket.toLowerCase()}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[#d9152b] text-sm font-bold hover:gap-2.5 transition-[gap] duration-100"
                  >
                    All {sectorBucket} sponsors <ArrowRight className="w-4 h-4" />
                  </Link>
                </Section>
              )}

              {related.length > 0 && (
                <Section eyebrow="06 · Related" title={`Other ${occ.group} occupations`}>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {related.map((r) => (
                      <li key={r.code}>
                        <Link
                          href={`/salary/${socSlug(r.code, r.title)}`}
                          className="group flex items-center gap-3 p-3 rounded-xl border border-[rgba(14,20,36,0.06)] bg-white hover:border-[#0a1530] transition-colors duration-100"
                        >
                          <span className="text-[11px] font-bold text-[#9aa3b8] tabular-nums w-10 flex-shrink-0">
                            {r.code}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13.5px] font-semibold text-[#0a1530] truncate group-hover:text-[#d9152b] transition-colors duration-100">
                              {r.title}
                            </div>
                            <div className="text-[11.5px] text-[#7a8195] tabular-nums">
                              £{r.goingRate.toLocaleString()}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] flex-shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* CTA */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63] p-7 md:p-9">
                <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.5) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
                <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-[#d9152b]/25 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="max-w-md">
                    <h3 className="font-display text-white text-[1.25rem] md:text-[1.5rem] font-bold leading-tight tracking-[-0.015em]">
                      Need to check another role?
                    </h3>
                    <p className="mt-2 text-white/55 text-[13.5px] leading-relaxed">
                      Search the full Skilled Worker salary checker — all 270 SOC codes with going rates, hourly equivalents and discount tiers.
                    </p>
                  </div>
                  <Link
                    href="/tools/salary-checker"
                    className="inline-flex items-center gap-2 bg-[#ffbf47] text-[#0a1530] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#ffd166] active:scale-[0.98] transition-[background,transform] duration-150"
                  >
                    Open salary checker <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[100px] space-y-4">
                <div className="rounded-2xl bg-white border border-[rgba(14,20,36,0.07)] p-5 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-3">
                    Reference card
                  </div>
                  <dl className="space-y-3 text-[13px]">
                    <Row label="SOC code" value={occ.code} icon={Briefcase} />
                    <Row label="Sector" value={occ.group} icon={Building2} />
                    <Row label="Going rate" value={`£${occ.goingRate.toLocaleString()}`} icon={Banknote} />
                    <Row label="Hourly rate" value={`£${occ.hourlyGoingRate?.toFixed(2) ?? '—'}`} icon={Clock} />
                    {occ.lowerGoingRate ? (
                      <Row label="New-entrant" value={`£${occ.lowerGoingRate.toLocaleString()}`} icon={TrendingUp} />
                    ) : null}
                    <Row label="ISL listed" value={occ.isl ? 'Yes' : 'No'} icon={ShieldCheck} />
                    <Row label="New overseas" value={occ.closedToNewOverseas ? 'Closed' : 'Open'} icon={CheckCircle2} />
                  </dl>
                </div>

                <Link
                  href="/visa/skilled-worker"
                  className="group block rounded-2xl bg-gradient-to-br from-[#d9152b] to-[#b8101f] p-5 text-white relative overflow-hidden"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] opacity-70 mb-1.5">
                      Read the full guide
                    </div>
                    <div className="font-display font-bold text-[17px] leading-tight">
                      UK Skilled Worker visa
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold group-hover:gap-2.5 transition-[gap] duration-100">
                      Open guide <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>

                <SidebarAffiliate tags={['Skilled Worker', occ.group]} />

                <a
                  href="https://www.gov.uk/government/publications/skilled-worker-visa-going-rates-for-eligible-occupations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-[#fafbfd] border border-[rgba(14,20,36,0.05)] p-4 hover:border-[rgba(14,20,36,0.12)] transition-colors duration-100"
                >
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#9aa3b8] mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> Source
                  </div>
                  <p className="text-[12px] text-[#52596e] leading-snug">
                    Going rates verified against Home Office Appendix Skilled Occupations published on gov.uk.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#d9152b]">
                    View source <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <StickyMobileCta context="Check your salary" label="Open salary checker" href="/tools/salary-checker" />
    </>
  );
}

/* ── Subcomponents ────────────────────────────── */

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white border border-[rgba(14,20,36,0.07)] p-6 md:p-7 shadow-[0_2px_12px_rgba(10,21,48,0.04)]">
      <div className="mb-5 pb-4 border-b border-[rgba(14,20,36,0.06)]">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#d9152b] mb-1.5">{eyebrow}</div>
        <h2 className="font-display text-[1.375rem] md:text-[1.625rem] font-bold text-[#0a1530] leading-tight tracking-[-0.015em]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div className="bg-white/[0.06] border border-white/[0.12] rounded-2xl p-4 backdrop-blur-sm">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45 mb-1">{label}</div>
      <div className="font-display font-bold text-[1.25rem] md:text-[1.5rem] tabular-nums leading-tight tracking-[-0.015em]" style={{ color: accent ?? '#fff' }}>
        {value}
      </div>
      <div className="text-[11px] text-white/50 mt-1">{sub}</div>
    </div>
  );
}

function ThresholdRow({ num, label, value, note, highlight }: { num: number; label: string; value: string; note: string; highlight?: boolean }) {
  return (
    <li className={`flex items-start gap-3 p-3.5 rounded-xl border ${highlight ? 'border-[rgba(217,21,43,0.25)] bg-[rgba(217,21,43,0.05)]' : 'border-[rgba(14,20,36,0.06)] bg-[#fafbfd]'}`}>
      <span className={`w-7 h-7 rounded-full text-white font-display font-bold text-[12px] flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-[#d9152b]' : 'bg-[#0a1530]'}`}>
        {num}
      </span>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-[14.5px] font-bold text-[#0a1530]">{label}</div>
          <div className="font-display font-bold text-[16px] tabular-nums text-[#0a1530]">{value}</div>
        </div>
        <div className="text-[12px] text-[#7a8195] mt-0.5">{note}</div>
      </div>
    </li>
  );
}

function DiscountCard({ title, value, eligibility, effective }: { title: string; value: string; eligibility: string; effective: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#dcfce7] to-white border border-[#bbf7d0] p-5">
      <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#047857] mb-2">{title}</div>
      <div className="font-display font-bold text-[1.5rem] text-[#0a1530] tracking-[-0.015em] tabular-nums">{value}</div>
      <p className="mt-2 text-[12.5px] text-[#475569] leading-snug">{eligibility}</p>
      <div className="mt-3 pt-3 border-t border-[#bbf7d0] text-[11.5px] text-[#047857]">
        <strong>Effective floor: {effective}</strong>
      </div>
    </div>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <dt className="flex items-center gap-2 text-[12px] text-[#7a8195] font-medium">
        <Icon className="w-3 h-3" /> {label}
      </dt>
      <dd className="text-[12.5px] font-semibold text-[#0a1530] text-right tabular-nums">{value}</dd>
    </div>
  );
}

/** Map SOC group labels to sponsor sector buckets. */
function mapGroupToSector(group: string): string {
  const g = group.toLowerCase();
  if (g.includes('it') || g.includes('tech') || g.includes('digital')) return 'Technology';
  if (g.includes('health') || g.includes('care') || g.includes('medical') || g.includes('nurs')) return 'Healthcare';
  if (g.includes('financ') || g.includes('account') || g.includes('insur') || g.includes('bank')) return 'Finance';
  if (g.includes('engineer')) return 'Engineering';
  if (g.includes('teach') || g.includes('educat') || g.includes('academ')) return 'Education';
  if (g.includes('legal') || g.includes('law')) return 'Legal';
  if (g.includes('media') || g.includes('art') || g.includes('design')) return 'Media';
  if (g.includes('manufact') || g.includes('production')) return 'Manufacturing';
  if (g.includes('construct') || g.includes('trade')) return 'Construction';
  if (g.includes('retail')) return 'Retail';
  if (g.includes('hospitality') || g.includes('chef') || g.includes('food')) return 'Hospitality';
  if (g.includes('consult') || g.includes('manag')) return 'Consulting';
  return 'Other';
}
