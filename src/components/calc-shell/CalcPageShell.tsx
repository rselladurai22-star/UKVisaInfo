/**
 * CalcPageShell – 2-column premium layout for all UK calculator pages.
 * Left: header + calculator (wider) | Right: sticky sidebar with rates, dates, tips, related
 */
import Link from 'next/link';
import { ShieldCheck, ExternalLink, ArrowRight, Calendar, TrendingUp, Lightbulb, BookOpen } from 'lucide-react';

export interface SidebarRate { label: string; value: string; sub?: string; accent?: string }
export interface SidebarDate { date: string; desc: string; urgent?: boolean }
export interface SidebarTip  { heading: string; body: string }

export interface SidebarData {
  keyRates?:  SidebarRate[];
  dates?:     SidebarDate[];
  tips?:      SidebarTip[];
  govLink?:   string;
  govLabel?:  string;
}

interface Props {
  eyebrow:     string;
  title:       string;
  deck:        string;
  verified?:   string;
  url?:        string;
  sidebar?:    SidebarData;
  related?:    { href: string; title: string; desc: string }[];
  educational?: { title: string; body: string }[];
  children:    React.ReactNode;
}

export default function CalcPageShell({
  eyebrow, title, deck, verified = 'gov.uk / HMRC verified',
  url, sidebar, related, educational, children,
}: Props) {
  const jsonLd = url ? {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: title, description: deck,
    url: `https://ukvisainfo.co.uk${url}`,
    applicationCategory: 'FinanceApplication', operatingSystem: 'Web', inLanguage: 'en-GB',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    provider: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
  } : null;

  return (
    <div className="bg-[#FAFBFC] min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      {/* ── Hero band ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E5E7EB] relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(10,37,64,0.06) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-4 md:px-10 pt-[100px] md:pt-[116px] pb-8 md:pb-10">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full mb-4"
            style={{ background: '#EEF2FF', color: '#3730A3' }}
          >
            {eyebrow}
          </span>
          <h1
            className="font-extrabold text-[#0A2540] tracking-[-0.03em] max-w-[760px]"
            style={{
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
              lineHeight: '1.08',
            }}
          >
            {title}
          </h1>
          <p className="mt-3 text-[15.5px] md:text-[16.5px] text-[#45464d] leading-[1.6] max-w-[680px]">
            {deck}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#15803d]">
              <ShieldCheck className="w-3.5 h-3.5" />
              {verified} · Free · No signup
            </span>
          </div>
        </div>
      </div>

      {/* ── Main 2-column body ────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* ─ Calculator main column ─ */}
          <div className="w-full lg:flex-1 min-w-0">
            {children}

            {/* Educational accordion */}
            {educational && educational.length > 0 && (
              <section className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-[#0A2540]" />
                  <h2 className="text-[15px] font-extrabold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                    How it works &amp; HMRC rules
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {educational.map((e, i) => (
                    <details key={i} className="group bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer list-none select-none hover:bg-[#FAFBFC]">
                        <span className="text-[13.5px] font-bold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{e.title}</span>
                        <span className="text-[#76777e] group-open:rotate-180 transition-transform text-[18px] leading-none flex-shrink-0">⌄</span>
                      </summary>
                      <div className="px-4 pb-4 pt-1 text-[13px] text-[#45464d] leading-[1.65] border-t border-[#EEF0F2]">
                        {e.body}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ─ Right sidebar ─ */}
          {sidebar && (
            <aside className="w-full lg:w-[296px] xl:w-[320px] flex-shrink-0">
              <div className="lg:sticky lg:top-[80px] space-y-4">

                {/* Key rates card */}
                {sidebar.keyRates && sidebar.keyRates.length > 0 && (
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_2px_12px_-2px_rgba(10,37,64,0.06)]">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EEF0F2] bg-[#0A2540]">
                      <TrendingUp className="w-3.5 h-3.5 text-[#00C4B4]" />
                      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white">2025/26 Key Rates</h3>
                    </div>
                    <div className="divide-y divide-[#EEF0F2]">
                      {sidebar.keyRates.map((r, i) => (
                        <div key={i} className="px-4 py-2.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[12px] text-[#45464d] leading-[1.4]">{r.label}</span>
                            <span
                              className="tabular-nums text-[13.5px] font-extrabold text-right flex-shrink-0"
                              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', color: r.accent ?? '#0A2540' }}
                            >
                              {r.value}
                            </span>
                          </div>
                          {r.sub && <div className="text-[11px] text-[#76777e] mt-0.5">{r.sub}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important dates card */}
                {sidebar.dates && sidebar.dates.length > 0 && (
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_2px_12px_-2px_rgba(10,37,64,0.06)]">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EEF0F2]" style={{ background: '#F4F9F8' }}>
                      <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
                      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0F766E]">Important Dates</h3>
                    </div>
                    <div className="divide-y divide-[#EEF0F2]">
                      {sidebar.dates.map((d, i) => (
                        <div key={i} className="px-4 py-2.5 flex gap-3">
                          <div
                            className="text-[10.5px] font-extrabold tabular-nums mt-0.5 px-1.5 py-0.5 rounded flex-shrink-0 h-fit"
                            style={{
                              background: d.urgent ? '#FEF2F2' : '#EFF6FF',
                              color: d.urgent ? '#B91C1C' : '#1D4ED8',
                              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
                            }}
                          >
                            {d.date}
                          </div>
                          <div className="text-[12px] text-[#45464d] leading-[1.5]">{d.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips card */}
                {sidebar.tips && sidebar.tips.length > 0 && (
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_2px_12px_-2px_rgba(10,37,64,0.06)]">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EEF0F2]" style={{ background: '#FFFBEB' }}>
                      <Lightbulb className="w-3.5 h-3.5 text-[#B45309]" />
                      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#B45309]">Quick Tips</h3>
                    </div>
                    <div className="divide-y divide-[#EEF0F2]">
                      {sidebar.tips.map((t, i) => (
                        <div key={i} className="px-4 py-3">
                          <div className="text-[12.5px] font-bold text-[#0A2540] mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{t.heading}</div>
                          <div className="text-[12px] text-[#45464d] leading-[1.55]">{t.body}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related tools */}
                {related && related.length > 0 && (
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_2px_12px_-2px_rgba(10,37,64,0.06)]">
                    <div className="px-4 py-3 border-b border-[#EEF0F2] bg-[#F8F9FA]">
                      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#45464d]">Related Tools</h3>
                    </div>
                    <div className="divide-y divide-[#EEF0F2]">
                      {related.map((r) => (
                        <Link
                          key={r.href}
                          href={r.href}
                          className="group flex items-start justify-between gap-2 px-4 py-3 hover:bg-[#FAFBFC] transition-colors"
                        >
                          <div>
                            <div className="text-[13px] font-semibold text-[#0A2540] leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                              {r.title}
                            </div>
                            <div className="text-[11.5px] text-[#76777e] mt-0.5 leading-[1.45]">{r.desc}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#76777e] flex-shrink-0 mt-0.5 group-hover:text-[#0A2540] group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* HMRC source */}
                {sidebar.govLink && (
                  <a
                    href={`https://${sidebar.govLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 hover:border-[#0A2540] transition-colors group"
                  >
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#76777e]">Source</div>
                      <div className="text-[12.5px] font-semibold text-[#0A2540] mt-0.5" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                        {sidebar.govLabel ?? sidebar.govLink}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#76777e] flex-shrink-0 group-hover:text-[#0A2540]" />
                  </a>
                )}

                {/* Disclaimer */}
                <div className="text-[11px] text-[#76777e] leading-[1.55] px-1">
                  Estimates only. Tax rules can change. Consult a qualified accountant or HMRC directly for personal advice.
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
