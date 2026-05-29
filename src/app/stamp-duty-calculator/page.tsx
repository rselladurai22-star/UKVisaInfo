import type { Metadata } from 'next';
import Link from 'next/link';
import SdltClient from './SdltClient';
import FaqJsonLd from '../../components/calc-shell/FaqJsonLd';
import EditorByline from '../../components/EditorByline';
import { primaryEditorSchema } from '../../data/editorialTeam';

export const metadata: Metadata = {
  title: 'UK Stamp Duty Calculator 2026 — SDLT, LBTT, LTT',
  description: 'The most precise UK Stamp Duty calculator. Live SDLT, LBTT, LTT across every buyer scenario. Verified against HMRC, Revenue Scotland and the Welsh Revenue Authority.',
  alternates: { canonical: '/stamp-duty-calculator' },
  openGraph: {
    title: 'UK Stamp Duty Calculator 2026',
    description: 'The most precise UK Stamp Duty calculator. SDLT, LBTT, LTT with what-if scenarios.',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    type: 'article',
  },
};

/* Site theme tokens */
const T = {
  page:    '#FFFFFF',
  paper:   '#FFFFFF',
  surface: '#FAFAFB',
  ink:     '#18181B',
  body:    '#3F3F46',
  muted:   '#52525B',
  faint:   '#9CA3AF',
  hair:    'rgba(24,24,27,0.08)',
  divide:  'rgba(24,24,27,0.05)',
  emerald: '#6366F1',
  emeraldDk:'#4F46E5',
  emeraldT:'#EEF2FF',
  gold:    '#EC4899',
  goldT:   '#FCE7F3',
};

const FAQS = [
  { q: 'What is a first-time buyer?',
    a: 'Someone who has never owned a residential property anywhere in the world, alone or jointly. If you co-buy with anyone who has previously owned property, the relief is denied for the entire purchase — not just their share.' },
  { q: 'Bought through a company?',
    a: 'A non-natural person (a company, partnership of companies, or collective investment scheme) buying a single dwelling worth more than £500,000 in England or NI pays a flat 15% SDLT, unless a specific relief applies (e.g. let to unconnected third parties on commercial terms).' },
  { q: 'What about other properties?',
    a: 'If you already own a residential property anywhere in the world and you are buying another, a 3% surcharge is applied to every band on the full purchase price. The Scottish equivalent (ADS) is 8% from December 2024; the Welsh equivalent is 5% from December 2024.' },
  { q: 'When is SDLT due?',
    a: 'Within 14 days of completion in England and NI; 30 days for LBTT (Scotland) and LTT (Wales). Your solicitor or conveyancer normally calculates, files and pays on your behalf as part of completion.' },
  { q: 'Can I claim back the 3% surcharge?',
    a: 'Yes — if you sell your previous main residence within 36 months of paying the surcharge, you can apply to HMRC for a full refund. Use the refund tool inside the calculator to check eligibility.' },
  { q: 'Can I estimate legal fees?',
    a: 'Typical UK conveyancing fees run £800–£2,000 (solicitor + searches + Land Registry). We assume £1,500 in the Comparative Load chart as a representative average — actual quotes vary widely.' },
];

export default function Page() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',                  item: 'https://ukvisainfo.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Stamp Duty calculator', item: 'https://ukvisainfo.co.uk/stamp-duty-calculator' },
    ],
  };
  const webAppJsonLd = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'UK Stamp Duty Calculator',
    url: 'https://ukvisainfo.co.uk/stamp-duty-calculator',
    applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    author: primaryEditorSchema('https://ukvisainfo.co.uk'),
    publisher: { '@type': 'Organization', name: 'UKDesk', url: 'https://ukvisainfo.co.uk' },
  };

  return (
    <div style={{
      background: T.page, color: T.ink,
      fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
      fontFeatureSettings: '"cv11", "ss01"',
      overflowX: 'hidden',
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <FaqJsonLd faqs={FAQS} />

      {/* ───────────── Premium animations + utilities ───────────── */}
      <style>{`
        @keyframes orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(40px, -30px) scale(1.06); }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(4,120,87,0.45); }
          70%  { box-shadow: 0 0 0 12px rgba(4,120,87,0); }
          100% { box-shadow: 0 0 0 0 rgba(4,120,87,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sdlt-fade-up { animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .sdlt-fade-up-1 { animation-delay: 0.05s; }
        .sdlt-fade-up-2 { animation-delay: 0.15s; }
        .sdlt-fade-up-3 { animation-delay: 0.25s; }
        .sdlt-fade-up-4 { animation-delay: 0.35s; }
        .sdlt-grad-text {
          background: linear-gradient(115deg, #047857 0%, #EC4899 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .sdlt-cta-btn {
          position: relative; overflow: hidden;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .sdlt-cta-btn:hover { transform: translateY(-1px); }
        .sdlt-cta-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
          pointer-events: none;
        }
        .sdlt-link-arrow { transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1); }
        .sdlt-link-arrow:hover .sdlt-arrow-icon { transform: translateX(3px); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════
          HERO — compact premium with floating cards
      ═══════════════════════════════════════════ */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        paddingTop: 'clamp(80px, 9vh, 104px)',
        paddingBottom: 'clamp(24px, 4vh, 40px)',
      }}>
        {/* Animated gradient orbs */}
        <div aria-hidden style={{
          position: 'absolute', top: '-15%', left: '-8%',
          width: 'min(640px, 60vw)', aspectRatio: '1', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(4,120,87,0.18) 0%, rgba(4,120,87,0) 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
          animation: 'orb-drift 22s ease-in-out infinite',
        }} />
        <div aria-hidden style={{
          position: 'absolute', top: '25%', right: '-10%',
          width: 'min(560px, 55vw)', aspectRatio: '1', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,134,11,0.14) 0%, rgba(184,134,11,0) 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
          animation: 'orb-drift 28s ease-in-out infinite reverse',
        }} />

        {/* Dot grid */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(11,15,25,0.08) 1px, transparent 0)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 40%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 40%, black, transparent 80%)',
        }} />

        <div style={{ ...wrap, position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, alignItems: 'center' }} className="lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">

            {/* LEFT — heading + CTAs */}
            <div>
              {/* Breadcrumb */}
              <div className="sdlt-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: T.muted, marginBottom: 14 }}>
                <Link href="/" style={{ color: T.muted, textDecoration: 'none' }}>Home</Link>
                <span style={{ color: T.faint }}>/</span>
                <Link href="/tools" style={{ color: T.muted, textDecoration: 'none' }}>Calculators</Link>
                <span style={{ color: T.faint }}>/</span>
                <span style={{ color: T.ink, fontWeight: 500 }}>Stamp duty</span>
              </div>

              {/* Live badge */}
              <div className="sdlt-fade-up sdlt-fade-up-1" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '5px 12px 5px 9px', borderRadius: 999,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${T.hair}`,
                fontSize: 11.5, fontWeight: 600, color: T.body,
                marginBottom: 16,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: 999, background: T.emerald,
                  animation: 'pulse-ring 2s infinite',
                }} />
                Live · Verified May 2026 · SDLT · LBTT · LTT
              </div>

              {/* Headline */}
              <h1 className="sdlt-fade-up sdlt-fade-up-2" style={{
                fontSize: 'clamp(34px, 4.8vw, 64px)',
                fontWeight: 700, lineHeight: 0.98,
                letterSpacing: '-0.04em', color: T.ink,
                margin: 0, maxWidth: '14ch',
              }}>
                Calculate UK <span className="sdlt-grad-text">stamp duty</span> in seconds.
              </h1>

              {/* Subtitle */}
              <p className="sdlt-fade-up sdlt-fade-up-3" style={{
                fontSize: 'clamp(15px, 1.5vw, 17px)',
                lineHeight: 1.5, color: T.body, fontWeight: 400,
                margin: '14px 0 0', maxWidth: '54ch',
              }}>
                The most precise SDLT, LBTT and LTT calculator. Every UK buyer scenario, live what-if comparisons, full transparency.
              </p>

              {/* CTAs */}
              <div className="sdlt-fade-up sdlt-fade-up-4" style={{
                display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20,
              }}>
                <a href="#calculator" className="sdlt-cta-btn" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '11px 20px', borderRadius: 10,
                  background: `linear-gradient(135deg, ${T.emerald} 0%, ${T.emeraldDk} 100%)`,
                  color: T.paper, textDecoration: 'none',
                  fontSize: 14, fontWeight: 600,
                  boxShadow: '0 8px 24px -8px rgba(4,120,87,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}>
                  Start calculating
                  <span style={{ fontSize: 15 }}>→</span>
                </a>
                <a href="#faq" className="sdlt-link-arrow" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '11px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${T.hair}`,
                  color: T.ink, textDecoration: 'none',
                  fontSize: 14, fontWeight: 600,
                }}>
                  Read the FAQ
                  <span className="sdlt-arrow-icon" style={{ fontSize: 13, color: T.muted }}>↗</span>
                </a>
              </div>

              {/* Trust signals */}
              <div className="sdlt-fade-up sdlt-fade-up-4" style={{
                display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 18, fontSize: 12, color: T.muted,
              }}>
                {[
                  'HMRC verified',
                  'Revenue Scotland verified',
                  'Welsh Revenue Authority verified',
                  '£0 forever',
                ].map((t) => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6.5" stroke={T.emerald} strokeWidth="1" />
                      <path d="M4 7l2 2 4-4" stroke={T.emerald} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — floating preview cards */}
            <div className="hidden lg:block" style={{ position: 'relative', minHeight: 320 }}>
              <FloatingCard
                position={{ top: 0, right: 0 }}
                animDelay="0s"
              >
                <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Your SDLT
                </div>
                <div style={{ fontSize: 36, fontWeight: 700, color: T.ink, letterSpacing: '-0.025em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  £7,500
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11.5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: T.emerald }} />
                  <span style={{ color: T.muted }}>On £350k · 2.14% effective</span>
                </div>
              </FloatingCard>

              <FloatingCard
                position={{ top: 110, left: 0 }}
                animDelay="-3s"
                tone="emerald"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke={T.emerald} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.emerald, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Save £5,000
                  </span>
                </div>
                <div style={{ fontSize: 13, color: T.body, lineHeight: 1.45 }}>
                  As a <strong style={{ color: T.ink }}>first-time buyer</strong> at this price
                </div>
              </FloatingCard>

              <FloatingCard
                position={{ bottom: 0, right: 16 }}
                animDelay="-6s"
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { l: 'England', v: '£7.5k', a: true  },
                    { l: 'Scotland', v: '£11.4k', a: false },
                    { l: 'Wales',  v: '£11.3k', a: false },
                  ].map((r) => (
                    <div key={r.l}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: T.faint, letterSpacing: '0.06em' }}>
                        {r.l}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: r.a ? T.emerald : T.ink, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                        {r.v}
                      </div>
                    </div>
                  ))}
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE CALCULATOR (dashboard from SdltClient)
      ═══════════════════════════════════════════ */}
      <div id="calculator" style={{ scrollMarginTop: 80 }}>
        <SdltClient initialPrice={350000} />
      </div>

      {/* ═══════════════════════════════════════════
          FAQ — premium accordion
      ═══════════════════════════════════════════ */}
      <section id="faq" style={{
        paddingTop: 48, paddingBottom: 48,
        scrollMarginTop: 80,
      }}>
        <div style={wrap}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }} className="lg:grid-cols-[300px_1fr] lg:gap-16">
            {/* Left: header */}
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: T.gold,
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                Frequently asked
              </div>
              <h2 style={{
                fontSize: 'clamp(24px, 2.6vw, 32px)', fontWeight: 700,
                color: T.ink, margin: 0,
                letterSpacing: '-0.025em', lineHeight: 1.1,
              }}>
                Everything you need to know.
              </h2>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: T.muted, margin: '10px 0 0', maxWidth: '32ch' }}>
                Common questions across SDLT, LBTT, LTT and surcharge rules.
              </p>
            </div>

            {/* Right: accordion */}
            <div>
              {FAQS.map((f, i) => (
                <details key={i} className="sdlt-faq" style={{
                  borderTop: i === 0 ? `1px solid ${T.hair}` : 'none',
                  borderBottom: `1px solid ${T.hair}`,
                }}>
                  <summary style={{
                    cursor: 'pointer', listStyle: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
                    padding: '14px 0',
                    fontSize: 15, fontWeight: 600, color: T.ink,
                    lineHeight: 1.35,
                  }}>
                    {f.q}
                    <span className="sdlt-faq-icon" style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: T.surface,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: T.muted, fontSize: 12, lineHeight: 1, flexShrink: 0,
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </summary>
                  <p style={{
                    fontSize: 14, lineHeight: 1.65, color: T.body,
                    margin: 0, padding: '0 0 16px',
                    maxWidth: '62ch',
                  }}>
                    {f.a}
                  </p>
                </details>
              ))}
              <style>{`
                details.sdlt-faq[open] .sdlt-faq-icon {
                  transform: rotate(180deg);
                  background: ${T.emeraldT};
                  color: ${T.emerald};
                }
                details.sdlt-faq summary:hover { color: ${T.emerald}; }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BANNER — premium full-width gradient
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '0 clamp(16px, 4vw, 96px) 48px' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          maxWidth: 2400, margin: '0 auto',
          borderRadius: 20,
          background: `linear-gradient(135deg, ${T.ink} 0%, #1F2937 60%, ${T.emeraldDk} 100%)`,
          padding: 'clamp(32px, 4.5vw, 56px) clamp(24px, 4vw, 56px)',
          color: T.paper,
        }}>
          {/* Orbs */}
          <div aria-hidden style={{
            position: 'absolute', top: '-30%', right: '-10%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184,134,11,0.30) 0%, transparent 65%)',
            filter: 'blur(40px)', pointerEvents: 'none',
            animation: 'orb-drift 18s ease-in-out infinite',
          }} />
          <div aria-hidden style={{
            position: 'absolute', bottom: '-30%', left: '-5%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(4,120,87,0.30) 0%, transparent 65%)',
            filter: 'blur(40px)', pointerEvents: 'none',
            animation: 'orb-drift 24s ease-in-out infinite reverse',
          }} />
          {/* Dot grid */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, opacity: 0.10, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }} />

          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
          }}>
            <div style={{ maxWidth: 720 }}>
              <div style={{
                fontSize: 11, fontWeight: 700,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10,
              }}>
                The UK Desk
              </div>
              <h2 style={{
                fontSize: 'clamp(24px, 3.2vw, 38px)', fontWeight: 700,
                color: T.paper, lineHeight: 1.08,
                letterSpacing: '-0.03em', margin: 0,
                maxWidth: '24ch',
              }}>
                Every UK calculator, <span style={{
                  background: 'linear-gradient(115deg, #ECFDF5 0%, #FBF6E7 100%)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                }}>verified and free.</span>
              </h2>
              <p style={{
                fontSize: 'clamp(14px, 1.3vw, 16px)',
                color: 'rgba(255,255,255,0.7)', lineHeight: 1.5,
                margin: '10px 0 0', maxWidth: '52ch',
              }}>
                46 live calculators across UK tax, property, salary and visa life. Sourced from primary records, updated quarterly.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link href="/tools" className="sdlt-cta-btn" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 20px', borderRadius: 10,
                background: T.paper, color: T.ink, textDecoration: 'none',
                fontSize: 14, fontWeight: 600,
                boxShadow: '0 8px 24px -8px rgba(0,0,0,0.4)',
              }}>
                Browse all 46 tools
                <span style={{ fontSize: 15 }}>→</span>
              </Link>
              <Link href="/about" className="sdlt-link-arrow" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '11px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                color: T.paper, textDecoration: 'none',
                fontSize: 14, fontWeight: 600,
              }}>
                About
                <span className="sdlt-arrow-icon" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Floating preview card for hero */
function FloatingCard({
  children, position, animDelay = '0s', tone = 'plain',
}: {
  children: React.ReactNode;
  position: { top?: number; left?: number; right?: number; bottom?: number };
  animDelay?: string;
  tone?: 'plain' | 'emerald';
}) {
  const isEmerald = tone === 'emerald';
  return (
    <div style={{
      position: 'absolute',
      ...position,
      maxWidth: 280,
      padding: '20px 22px',
      background: isEmerald
        ? `linear-gradient(135deg, ${T.emeraldT} 0%, rgba(255,255,255,0.9) 100%)`
        : 'rgba(255,255,255,0.85)',
      border: `1px solid ${isEmerald ? 'rgba(4,120,87,0.2)' : T.hair}`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 16,
      boxShadow: '0 20px 50px -20px rgba(11,15,25,0.18), 0 4px 12px -4px rgba(11,15,25,0.06)',
      animation: `float-card 6s ease-in-out infinite ${animDelay}`,
    }}>
      {children}
    </div>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 2400, margin: '0 auto',
  padding: '0 clamp(16px, 4vw, 96px)',
};
