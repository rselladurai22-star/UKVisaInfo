/**
 * CalcPageShell v3 — "Graphite & Flame" theme
 * Cool grey canvas · Dark obsidian sidebar · Syne display headings · Space Grotesk numbers
 * Zero resemblance to the previous Navy/Teal/Cream design.
 */
import Link from 'next/link';
import { ShieldCheck, ExternalLink, ArrowUpRight, CalendarDays, BarChart2, Zap } from 'lucide-react';

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

/* ─── tokens ────────────────────────────────────── */
const T = {
  bg:         '#F0F2F5',   // cool grey canvas
  canvas:     '#FFFFFF',   // card surfaces
  ink:        '#0D1117',   // near-black text
  mid:        '#6B7280',   // secondary text
  border:     '#E2E6EB',   // card border
  accentV:    '#7C3AED',   // electric violet — primary accent
  accentA:    '#F59E0B',   // amber — highlights / numbers
  sidebarBg:  '#0D1117',   // obsidian sidebar
  sidebarEl:  '#161B22',   // elevated inside sidebar
  sidebarBdr: 'rgba(255,255,255,0.06)',
  positive:   '#059669',
  negative:   '#DC2626',
};

/* ─── font shortcuts ────────────────────────────── */
const SYNE  = '"Syne", "Space Grotesk", sans-serif';
const GRSK  = '"Space Grotesk", "Inter", sans-serif';
const INTER = '"Inter", system-ui, sans-serif';

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
  } : null;

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: INTER }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{ background: T.canvas, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(88px,12vw,120px) clamp(16px,4vw,40px) 40px' }}>

          {/* eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{
              display: 'inline-block',
              background: T.accentV,
              color: '#fff',
              fontFamily: GRSK,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 3,
            }}>
              {eyebrow}
            </span>
          </div>

          {/* title — Syne display, very tight */}
          <h1 style={{
            fontFamily: SYNE,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: T.ink,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            maxWidth: 820,
            margin: '0 0 16px',
          }}>
            {title}
          </h1>

          {/* left-bar deck */}
          <p style={{
            fontFamily: INTER,
            fontSize: 16,
            color: T.mid,
            lineHeight: 1.65,
            maxWidth: 680,
            borderLeft: `3px solid ${T.accentV}`,
            paddingLeft: 16,
            margin: '0 0 20px',
          }}>
            {deck}
          </p>

          {/* verified chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={13} color={T.positive} />
            <span style={{ fontFamily: GRSK, fontSize: 11, fontWeight: 600, color: T.positive, letterSpacing: '0.04em' }}>
              {verified}
            </span>
            <span style={{ color: T.border, margin: '0 4px' }}>·</span>
            <span style={{ fontFamily: GRSK, fontSize: 11, fontWeight: 600, color: T.mid }}>Free · No signup</span>
          </div>
        </div>
      </div>

      {/* ── Body: 2-col ──────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px clamp(16px,4vw,40px) 48px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* ─ Main column ─ */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Calculator content */}
            <div style={{
              background: T.canvas,
              border: `1px solid ${T.border}`,
              borderTop: `3px solid ${T.accentV}`,
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden',
            }}>
              <div style={{ padding: 'clamp(20px,4vw,32px)' }}>
                {children}
              </div>
            </div>

            {/* Educational accordion */}
            {educational && educational.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 3, height: 18, background: T.accentA, borderRadius: 2 }} />
                  <h2 style={{ fontFamily: SYNE, fontSize: 14, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', margin: 0 }}>
                    How it works &amp; HMRC rules
                  </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 8 }}>
                  {educational.map((e, i) => (
                    <details key={i} style={{ background: T.canvas, border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden' }}>
                      <summary style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 16px', cursor: 'pointer', listStyle: 'none',
                        fontFamily: GRSK, fontSize: 13, fontWeight: 600, color: T.ink,
                      }}>
                        {e.title}
                        <span style={{ color: T.mid, fontSize: 16, lineHeight: 1, flexShrink: 0, marginLeft: 8 }}>+</span>
                      </summary>
                      <div style={{
                        padding: '0 16px 14px', borderTop: `1px solid ${T.border}`,
                        fontFamily: INTER, fontSize: 13, color: T.mid, lineHeight: 1.65,
                      }}>
                        <div style={{ paddingTop: 12 }}>{e.body}</div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─ Sidebar: Obsidian dark ─ */}
          {sidebar && (
            <aside className="w-full lg:w-[280px] xl:w-[308px] flex-shrink-0">
              <div className="lg:sticky lg:top-[80px]" style={{ display: 'flex', flexDirection: 'column', gap: 3, background: T.sidebarBg, borderRadius: 8, overflow: 'hidden' }}>

                {/* Key Rates */}
                {sidebar.keyRates && sidebar.keyRates.length > 0 && (
                  <div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 16px 10px',
                      borderBottom: `1px solid ${T.sidebarBdr}`,
                    }}>
                      <BarChart2 size={12} color={T.accentV} />
                      <span style={{ fontFamily: GRSK, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.accentV }}>
                        2025/26 Rates
                      </span>
                    </div>
                    <div>
                      {sidebar.keyRates.map((r, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8,
                          padding: '9px 16px',
                          borderBottom: `1px solid ${T.sidebarBdr}`,
                        }}>
                          <div>
                            <div style={{ fontFamily: INTER, fontSize: 11.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>{r.label}</div>
                            {r.sub && <div style={{ fontFamily: INTER, fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{r.sub}</div>}
                          </div>
                          <div style={{
                            fontFamily: GRSK,
                            fontSize: 14,
                            fontWeight: 700,
                            color: r.accent ?? T.accentA,
                            letterSpacing: '-0.01em',
                            flexShrink: 0,
                            textAlign: 'right',
                          }}>
                            {r.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Dates */}
                {sidebar.dates && sidebar.dates.length > 0 && (
                  <div style={{ borderTop: `2px solid ${T.sidebarBdr}` }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 16px 10px',
                      borderBottom: `1px solid ${T.sidebarBdr}`,
                    }}>
                      <CalendarDays size={12} color={T.accentA} />
                      <span style={{ fontFamily: GRSK, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.accentA }}>
                        Key Dates
                      </span>
                    </div>
                    {sidebar.dates.map((d, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        padding: '9px 16px',
                        borderBottom: `1px solid ${T.sidebarBdr}`,
                      }}>
                        <span style={{
                          fontFamily: GRSK, fontSize: 9.5, fontWeight: 700,
                          background: d.urgent ? T.negative : T.accentA,
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: 3,
                          flexShrink: 0,
                          marginTop: 2,
                          letterSpacing: '0.02em',
                        }}>
                          {d.date}
                        </span>
                        <span style={{ fontFamily: INTER, fontSize: 11.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                          {d.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {sidebar.tips && sidebar.tips.length > 0 && (
                  <div style={{ borderTop: `2px solid ${T.sidebarBdr}` }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 16px 10px',
                      borderBottom: `1px solid ${T.sidebarBdr}`,
                    }}>
                      <Zap size={12} color="#FCD34D" />
                      <span style={{ fontFamily: GRSK, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FCD34D' }}>
                        Tips
                      </span>
                    </div>
                    {sidebar.tips.map((t, i) => (
                      <div key={i} style={{
                        padding: '10px 16px',
                        borderBottom: `1px solid ${T.sidebarBdr}`,
                      }}>
                        <div style={{ fontFamily: GRSK, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: 3, letterSpacing: '-0.01em' }}>
                          {t.heading}
                        </div>
                        <div style={{ fontFamily: INTER, fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                          {t.body}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Related */}
                {related && related.length > 0 && (
                  <div style={{ borderTop: `2px solid ${T.sidebarBdr}` }}>
                    <div style={{
                      padding: '12px 16px 10px',
                      borderBottom: `1px solid ${T.sidebarBdr}`,
                    }}>
                      <span style={{ fontFamily: GRSK, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                        Related Tools
                      </span>
                    </div>
                    {related.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="group"
                        style={{ display: 'block', textDecoration: 'none' }}
                      >
                        <div style={{
                          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6,
                          padding: '9px 16px',
                          borderBottom: `1px solid ${T.sidebarBdr}`,
                        }}
                          className="hover:bg-[#161B22] transition-colors duration-100"
                        >
                          <div>
                            <div style={{ fontFamily: GRSK, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.01em' }}>{r.title}</div>
                            <div style={{ fontFamily: INTER, fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 2, lineHeight: 1.45 }}>{r.desc}</div>
                          </div>
                          <ArrowUpRight size={12} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0, marginTop: 2 }} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Gov source + disclaimer */}
                <div style={{ padding: '12px 16px 14px', borderTop: `2px solid ${T.sidebarBdr}` }}>
                  {sidebar.govLink && (
                    <a
                      href={`https://${sidebar.govLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', marginBottom: 10 }}
                    >
                      <ExternalLink size={11} color={T.accentV} />
                      <span style={{ fontFamily: GRSK, fontSize: 11, fontWeight: 600, color: T.accentV }}>
                        {sidebar.govLabel ?? sidebar.govLink}
                      </span>
                    </a>
                  )}
                  <p style={{ fontFamily: INTER, fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6, margin: 0 }}>
                    Estimates only. Consult HMRC or a qualified accountant for personal advice.
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
