/**
 * CalcPageShell v4 — "Quartz" design system
 * Inspired by Stripe Dashboard / Linear / Vercel docs
 * Light · refined neutrals · one disciplined indigo accent · hairline borders
 */
import Link from 'next/link';
import { ShieldCheck, ExternalLink, ArrowUpRight, CalendarDays, BarChart3, Sparkles, Layers, ChevronRight } from 'lucide-react';
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
  /** Optional breadcrumb trail rendered above the hero. */
  crumb?: { label: string; href?: string }[];
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
  bg:        '#f8fafc',
  bgAlt:     '#FAFAFB',
  surface:   '#FFFFFF',
  ink:       '#18181B',
  ink2:      '#3F3F46',
  mid:       '#52525B',
  mid2:      '#6B7280',
  faint:     '#9CA3AF',
  border:    'rgba(15, 23, 42, 0.06)',
  borderStr: 'rgba(15, 23, 42, 0.08)',
  accent:    '#6366F1',
  accentDk:  '#4F46E5',
  accentSoft:'#EEF2FF',
  positive:  '#047857',
  positiveSoft: '#ecfdf5',
  warning:   '#B45309',
  warningSoft: '#FEF3C7',
  negative:  '#BE123C',
};

const DISPLAY = 'var(--font-grotesk), "Inter Tight", Inter, system-ui, sans-serif';
const TEXT    = 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif';

const DotGrid = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 600, pointerEvents: 'none', zIndex: 0, opacity: 0.5, overflow: 'hidden' }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dot-grid-shell" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(79, 70, 229, 0.08)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid-shell)" />
    </svg>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, #f8fafc 100%)' }} />
  </div>
);

export default function CalcPageShell({
  eyebrow, title, deck, verified = 'gov.uk verified',
  url, crumb, sidebar, related, educational, faqs,
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
    <div className="bg-surface text-on-surface min-h-screen" style={{ fontFamily: TEXT }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqs && faqs.length > 0 && <FaqJsonLd faqs={faqs} />}

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.55]"
          style={{
            background:
              'radial-gradient(55% 80% at 15% 0%, #ECFDF5 0%, transparent 60%), radial-gradient(45% 65% at 95% 10%, #FBF6E7 0%, transparent 65%)',
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-16">
          {crumb && crumb.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-on-surface-variant">
              {crumb.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  {b.href ? (
                    <Link href={b.href} className="transition hover:text-primary">{b.label}</Link>
                  ) : (
                    <span className="text-primary">{b.label}</span>
                  )}
                  {i < crumb.length - 1 && <ChevronRight className="h-3 w-3 opacity-50" />}
                </span>
              ))}
            </nav>
          )}

          <div className={crumb && crumb.length > 0 ? 'mt-7 max-w-3xl' : 'max-w-3xl'}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-container-lowest px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              {eyebrow}
            </span>

            <h1
              className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-[3.4rem]"
              style={{ fontFamily: DISPLAY }}
            >
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
              {deck}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              <li className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary-soft px-3 py-1.5 text-xs font-semibold text-secondary">
                <ShieldCheck className="h-3.5 w-3.5" />
                {verified}
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-container-lowest/80 px-3 py-1.5 text-xs font-medium text-on-surface-variant">
                Free · No sign-up
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-container-lowest/80 px-3 py-1.5 text-xs font-medium text-on-surface-variant">
                Updated 2026/27
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Body 2-column ────────────────────────────────── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(28px,5vw,40px) clamp(20px,4vw,40px) 64px', position: 'relative', zIndex: 1 }}>
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
              border: `1px solid rgba(15, 23, 42, 0.06)`,
              borderRadius: 24,
              boxShadow: `0 10px 30px -10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)`,
              overflow: 'hidden',
            }}>
              <div style={{ padding: 'clamp(20px,3.5vw,32px)' }}>
                {children}
              </div>
            </div>

            {/* Methodology — "How we calculate this" with gov.uk source.
                Falls back to a generic block linking /sources + /editorial-policy
                so every calc page carries the EEAT signal even before a
                bespoke methodology is authored. */}
            {methodology ? (
              <Methodology
                summary={methodology.summary}
                govUrl={methodology.govUrl}
                govLabel={methodology.govLabel}
              />
            ) : (
              <Methodology
                summary="This calculator uses current UK government rules, HMRC rates and ONS data. Figures are verified against the primary sources we list site-wide; the editorial policy explains how we keep them current."
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
                      border: `1px solid rgba(15, 23, 42, 0.06)`,
                      borderRadius: 12,
                      boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.02)',
                      overflow: 'hidden',
                      transition: 'all 0.15s ease',
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
                            className="hover:bg-[#FAFAFB] transition-colors duration-100"
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
                            <ArrowUpRight size={13} strokeWidth={2.2} color={Q.mid2} className="flex-shrink-0 mt-1 group-hover:text-[#6366F1] transition-colors" />
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
                    className="hover:border-[#6366F1]"
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
    ? { bg: Q.positiveSoft, color: Q.positive, border: 'rgba(4, 120, 87, 0.12)' }
    : { bg: Q.bgAlt, color: Q.ink2, border: Q.border };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: TEXT,
      fontSize: 12,
      fontWeight: 600,
      color: styles.color,
      background: styles.bg,
      border: `1px solid ${styles.border}`,
      padding: '6px 12px',
      borderRadius: '10px',
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
        fontSize: 10,
        fontWeight: 700,
        color: Q.accentDk,
        background: 'rgba(79, 70, 229, 0.06)',
        border: '1px solid rgba(79, 70, 229, 0.12)',
        padding: '4px 10px',
        borderRadius: 999,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}>
        {icon}
        {label}
      </div>
      <h2 style={{
        fontFamily: DISPLAY,
        fontSize: 22,
        fontWeight: 800,
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
      border: `1px solid rgba(15, 23, 42, 0.06)`,
      borderRadius: 16,
      boxShadow: `0 4px 20px -6px rgba(15, 23, 42, 0.02), 0 1px 2px rgba(15, 23, 42, 0.01)`,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        padding: '12px 16px',
        background: subtle ? Q.bgAlt : Q.surface,
        borderBottom: `1px solid ${Q.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {icon}
          <span style={{
            fontFamily: DISPLAY,
            fontSize: 13.5,
            fontWeight: 700,
            color: Q.ink,
            letterSpacing: '-0.015em',
          }}>
            {title}
          </span>
        </div>
        {sub && (
          <span style={{
            fontFamily: TEXT,
            fontSize: 11,
            fontWeight: 600,
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
