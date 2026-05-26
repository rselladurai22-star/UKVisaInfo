/**
 * CalcPageShell v4 — "Quartz" design system
 * Inspired by Stripe Dashboard / Linear / Vercel docs
 * Light · refined neutrals · one disciplined indigo accent · hairline borders
 */
import Link from 'next/link';
import { ShieldCheck, ExternalLink, ArrowUpRight, CalendarDays, BarChart3, Sparkles, Layers } from 'lucide-react';
import FaqJsonLd, { type FaqItem } from './FaqJsonLd';
import EditorByline from '../EditorByline';
import Methodology from './Methodology';

export interface SidebarRate { label: string; value: string; sub?: string; accent?: string }
export interface SidebarDate { date: string; desc: string; urgent?: boolean }
export interface SidebarTip  { heading: string; body: string }
export interface SidebarData {
  keyRates?: SidebarRate[]; dates?: SidebarDate[]; tips?: SidebarTip[];
  govLink?: string; govLabel?: string;
}

export interface MethodologyData {
  summary: string;
  govUrl: string;
  govLabel?: string;
}

interface Props {
  eyebrow: string; title: string; deck: string;
  verified?: string; url?: string;
  sidebar?: SidebarData;
  related?: { href: string; title: string; desc: string }[];
  educational?: { title: string; body: string }[];
  /** FAQ entries — emits FAQPage JSON-LD for rich-result eligibility. */
  faqs?: FaqItem[];
  /** Last-verified date for EditorByline (e.g. "May 2026"). Defaults to current month. */
  editorVerified?: string;
  /** Hide the auto-rendered byline (rare — only for non-YMYL pages). */
  hideByline?: boolean;
  /** Methodology block — "How we calculate this" with gov.uk source link. */
  methodology?: MethodologyData;
  children: React.ReactNode;
}

const DEFAULT_VERIFIED = 'May 2026';

/* ─── design tokens — Stripe-inspired Quartz palette ────── */
const Q = {
  bg:        '#FCFCFD',
  bgAlt:     '#F7F8FA',
  surface:   '#FFFFFF',
  ink:       '#1A1F36',
  ink2:      '#3C4257',
  mid:       '#697386',
  mid2:      '#8792A2',
  faint:     '#A3ACB9',
  border:    '#E3E8EE',
  borderStr: '#CFD7DF',
  accent:    '#635BFF',
  accentDk:  '#5851DB',
  accentSoft:'#EFEEFF',
  positive:  '#08855D',
  positiveSoft: '#E6F7EF',
  warning:   '#BF6A02',
  warningSoft: '#FCEDD3',
  negative:  '#CD3D64',
};

const DISPLAY = '"Inter Tight", Inter, system-ui, sans-serif';
const TEXT    = 'Inter, system-ui, -apple-system, sans-serif';

export default function CalcPageShell({
  eyebrow, title, deck, verified = 'gov.uk verified',
  url, sidebar, related, educational, faqs,
  editorVerified = DEFAULT_VERIFIED, hideByline = false, methodology,
  children,
}: Props) {
  const jsonLd = url ? {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: title, description: deck,
    url: `https://ukvisainfo.co.uk${url}`,
    applicationCategory: 'FinanceApplication', operatingSystem: 'Web', inLanguage: 'en-GB',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  } : null;

  return (
    <div style={{
      background: Q.bg,
      minHeight: '100vh',
      fontFamily: TEXT,
      color: Q.ink,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqs && faqs.length > 0 && <FaqJsonLd faqs={faqs} />}

      {/* ── Hero ─────────────────────────────────────────── */}
      <header style={{
        background: Q.surface,
        borderBottom: `1px solid ${Q.border}`,
      }}>
        <div style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: 'clamp(80px,11vw,108px) clamp(20px,4vw,40px) clamp(36px,6vw,56px)',
        }}>
          {/* eyebrow + breadcrumb-style label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: Q.accentSoft,
              color: Q.accentDk,
              fontFamily: TEXT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              padding: '4px 10px',
              borderRadius: 999,
              border: `1px solid ${Q.accent}1f`,
            }}>
              <Sparkles size={11} strokeWidth={2.5} />
              {eyebrow}
            </span>
          </div>

          {/* title — Inter Tight, optically tuned */}
          <h1 style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(1.75rem, 4.5vw, 2.875rem)',
            fontWeight: 700,
            color: Q.ink,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            maxWidth: 800,
            margin: '0 0 18px',
          }}>
            {title}
          </h1>

          {/* deck — generous line height, optimal measure */}
          <p style={{
            fontFamily: TEXT,
            fontSize: 'clamp(15px, 1.5vw, 17px)',
            color: Q.mid,
            lineHeight: 1.65,
            maxWidth: 660,
            margin: '0 0 24px',
            fontWeight: 400,
          }}>
            {deck}
          </p>

          {/* trust signals row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Chip icon={<ShieldCheck size={12} strokeWidth={2.5} />} label={verified} tone="success" />
            <Chip label="Free · No signup" tone="default" />
            <Chip label="Updated 2025/26" tone="default" />
          </div>
        </div>
      </header>

      {/* ── Body 2-column ────────────────────────────────── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(28px,5vw,40px) clamp(20px,4vw,40px) 64px' }}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Main column ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Author byline — E-E-A-T signal above every YMYL calc */}
            {!hideByline && (
              <div style={{ marginBottom: 16 }}>
                <EditorByline verified={editorVerified} />
              </div>
            )}

            {/* Calculator surface */}
            <div style={{
              background: Q.surface,
              border: `1px solid ${Q.border}`,
              borderRadius: 12,
              boxShadow: `0 1px 2px rgba(26,31,54,0.04)`,
              overflow: 'hidden',
            }}>
              <div style={{ padding: 'clamp(20px,3.5vw,32px)' }}>
                {children}
              </div>
            </div>

            {/* Methodology — "How we calculate this" with gov.uk source */}
            {methodology && (
              <Methodology
                summary={methodology.summary}
                govUrl={methodology.govUrl}
                govLabel={methodology.govLabel}
              />
            )}

            {/* Educational — refined accordion */}
            {educational && educational.length > 0 && (
              <section style={{ marginTop: 36 }}>
                <SectionLabel icon={<Layers size={14} strokeWidth={2.2} />} label="Reference" title="How it works" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8, marginTop: 16 }}>
                  {educational.map((e, i) => (
                    <details key={i} style={{
                      background: Q.surface,
                      border: `1px solid ${Q.border}`,
                      borderRadius: 10,
                      overflow: 'hidden',
                      transition: 'border-color 0.15s ease',
                    }}>
                      <summary style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                        padding: '14px 16px',
                        cursor: 'pointer',
                        listStyle: 'none',
                        fontFamily: DISPLAY,
                        fontSize: 14,
                        fontWeight: 600,
                        color: Q.ink,
                        letterSpacing: '-0.005em',
                      }}>
                        <span>{e.title}</span>
                        <span style={{
                          color: Q.mid2,
                          fontSize: 18,
                          lineHeight: 1,
                          fontWeight: 300,
                          flexShrink: 0,
                          width: 18, height: 18,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        }}>+</span>
                      </summary>
                      <div style={{
                        padding: '4px 16px 14px',
                        fontFamily: TEXT,
                        fontSize: 13.5,
                        color: Q.mid,
                        lineHeight: 1.65,
                      }}>
                        {e.body}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar — light cards, hairline borders ── */}
          {sidebar && (
            <aside className="w-full lg:w-[280px] xl:w-[300px] flex-shrink-0">
              <div className="lg:sticky lg:top-[80px]" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Key rates */}
                {sidebar.keyRates && sidebar.keyRates.length > 0 && (
                  <SideCard icon={<BarChart3 size={13} strokeWidth={2.4} color={Q.accent} />} title="Key rates" sub="2025/26">
                    <div>
                      {sidebar.keyRates.map((r, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10,
                          padding: '10px 14px',
                          borderTop: i > 0 ? `1px solid ${Q.border}` : 'none',
                        }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: TEXT, fontSize: 12.5, color: Q.ink2, lineHeight: 1.4, fontWeight: 500 }}>{r.label}</div>
                            {r.sub && (
                              <div style={{ fontFamily: TEXT, fontSize: 11, color: Q.mid2, marginTop: 2, lineHeight: 1.4 }}>{r.sub}</div>
                            )}
                          </div>
                          <div style={{
                            fontFamily: DISPLAY,
                            fontSize: 14,
                            fontWeight: 600,
                            color: r.accent ?? Q.ink,
                            letterSpacing: '-0.015em',
                            fontVariantNumeric: 'tabular-nums',
                            flexShrink: 0,
                            textAlign: 'right',
                          }}>
                            {r.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SideCard>
                )}

                {/* Dates */}
                {sidebar.dates && sidebar.dates.length > 0 && (
                  <SideCard icon={<CalendarDays size={13} strokeWidth={2.4} color={Q.warning} />} title="Key dates">
                    <div>
                      {sidebar.dates.map((d, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: 10, alignItems: 'flex-start',
                          padding: '10px 14px',
                          borderTop: i > 0 ? `1px solid ${Q.border}` : 'none',
                        }}>
                          <span style={{
                            fontFamily: TEXT,
                            fontSize: 10.5,
                            fontWeight: 600,
                            background: d.urgent ? '#FDEEF0' : Q.bgAlt,
                            color: d.urgent ? Q.negative : Q.ink2,
                            border: `1px solid ${d.urgent ? '#F8C9D2' : Q.border}`,
                            padding: '2px 7px',
                            borderRadius: 6,
                            flexShrink: 0,
                            marginTop: 1,
                            letterSpacing: '-0.005em',
                            whiteSpace: 'nowrap',
                          }}>
                            {d.date}
                          </span>
                          <span style={{ fontFamily: TEXT, fontSize: 12.5, color: Q.mid, lineHeight: 1.5 }}>
                            {d.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </SideCard>
                )}

                {/* Tips */}
                {sidebar.tips && sidebar.tips.length > 0 && (
                  <SideCard icon={<Sparkles size={13} strokeWidth={2.4} color={Q.accent} />} title="Pro tips">
                    <div>
                      {sidebar.tips.map((t, i) => (
                        <div key={i} style={{
                          padding: '10px 14px',
                          borderTop: i > 0 ? `1px solid ${Q.border}` : 'none',
                        }}>
                          <div style={{ fontFamily: DISPLAY, fontSize: 12.5, fontWeight: 600, color: Q.ink, letterSpacing: '-0.005em', marginBottom: 3 }}>
                            {t.heading}
                          </div>
                          <div style={{ fontFamily: TEXT, fontSize: 12, color: Q.mid, lineHeight: 1.55 }}>
                            {t.body}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SideCard>
                )}

                {/* Related */}
                {related && related.length > 0 && (
                  <SideCard title="Related tools" subtle>
                    <div>
                      {related.map((r, i) => (
                        <Link
                          key={r.href}
                          href={r.href}
                          className="group block"
                          style={{ textDecoration: 'none' }}
                        >
                          <div
                            className="hover:bg-[#F7F8FA] transition-colors duration-100"
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
                              padding: '10px 14px',
                              borderTop: i > 0 ? `1px solid ${Q.border}` : 'none',
                            }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{
                                fontFamily: DISPLAY, fontSize: 13, fontWeight: 600, color: Q.ink, letterSpacing: '-0.005em',
                              }}>
                                {r.title}
                              </div>
                              <div style={{ fontFamily: TEXT, fontSize: 11.5, color: Q.mid, marginTop: 2, lineHeight: 1.45 }}>
                                {r.desc}
                              </div>
                            </div>
                            <ArrowUpRight size={13} strokeWidth={2.2} color={Q.mid2} className="flex-shrink-0 mt-1 group-hover:text-[#635BFF] transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </SideCard>
                )}

                {/* Source */}
                {sidebar.govLink && (
                  <a
                    href={`https://${sidebar.govLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                      background: Q.surface,
                      border: `1px solid ${Q.border}`,
                      borderRadius: 10,
                      padding: '12px 14px',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                    className="hover:border-[#635BFF]"
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: TEXT, fontSize: 10.5, fontWeight: 600, color: Q.mid2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Source</div>
                      <div style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 600, color: Q.ink, marginTop: 2 }}>
                        {sidebar.govLabel ?? sidebar.govLink}
                      </div>
                    </div>
                    <ExternalLink size={13} strokeWidth={2.2} color={Q.mid2} style={{ flexShrink: 0 }} />
                  </a>
                )}

                {/* Disclaimer */}
                <p style={{
                  fontFamily: TEXT,
                  fontSize: 11,
                  color: Q.faint,
                  lineHeight: 1.55,
                  margin: '4px 4px 0',
                }}>
                  Estimates only. Consult HMRC or a qualified accountant for advice on your circumstances.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function Chip({ icon, label, tone = 'default' }: { icon?: React.ReactNode; label: string; tone?: 'default' | 'success' }) {
  const styles = tone === 'success'
    ? { bg: Q.positiveSoft, color: Q.positive, border: '#BFE3D3' }
    : { bg: Q.bgAlt, color: Q.ink2, border: Q.border };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: TEXT,
      fontSize: 12,
      fontWeight: 500,
      color: styles.color,
      background: styles.bg,
      border: `1px solid ${styles.border}`,
      padding: '4px 9px',
      borderRadius: 999,
      letterSpacing: '-0.005em',
    }}>
      {icon}
      {label}
    </span>
  );
}

function SectionLabel({ icon, label, title }: { icon?: React.ReactNode; label: string; title: string }) {
  return (
    <div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: TEXT,
        fontSize: 11,
        fontWeight: 600,
        color: Q.mid2,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {icon}
        {label}
      </div>
      <h2 style={{
        fontFamily: DISPLAY,
        fontSize: 22,
        fontWeight: 700,
        color: Q.ink,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        margin: 0,
      }}>
        {title}
      </h2>
    </div>
  );
}

function SideCard({ icon, title, sub, subtle, children }: {
  icon?: React.ReactNode; title: string; sub?: string; subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: Q.surface,
      border: `1px solid ${Q.border}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        padding: '11px 14px',
        background: subtle ? Q.bgAlt : Q.surface,
        borderBottom: `1px solid ${Q.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {icon}
          <span style={{
            fontFamily: DISPLAY,
            fontSize: 13,
            fontWeight: 600,
            color: Q.ink,
            letterSpacing: '-0.01em',
          }}>
            {title}
          </span>
        </div>
        {sub && (
          <span style={{
            fontFamily: TEXT,
            fontSize: 10.5,
            fontWeight: 500,
            color: Q.mid2,
            letterSpacing: '0.02em',
          }}>
            {sub}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
