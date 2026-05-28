'use client';

/**
 * Variant A — Live UK data dashboard.
 * Big metric tiles + compact search + per-topic mini-dashboards.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ArrowUpRight, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../data/tools';
import { FONT, FONT_DISPLAY, FONT_MONO, INK, PAPER, SOFT, ORANGE, SLATE, MUTED, HAIR } from './tokens';

interface Metric {
  label: string; value: string; delta?: string;
  trend?: 'up' | 'down' | 'flat'; source: string; href?: string;
}

const METRICS: Metric[] = [
  { label: 'Bank rate',            value: '4.25%',   delta: '−25 bp',  trend: 'down', source: 'BoE',    href: '/mortgage-affordability' },
  { label: 'CPI inflation',        value: '2.1%',    delta: '−0.2 pp', trend: 'down', source: 'ONS' },
  { label: 'Avg weekly wage',      value: '£697',    delta: '+4.1%',   trend: 'up',   source: 'ONS',    href: '/take-home-pay' },
  { label: 'Skilled Worker min',   value: '£41,700', delta: 'Apr 26',  trend: 'flat', source: 'gov.uk', href: '/visa/skilled-worker' },
  { label: 'Family visa income',   value: '£29,000',                   trend: 'flat', source: 'gov.uk', href: '/visa/family' },
  { label: 'IHS standard',         value: '£1,035',  delta: 'per yr',  trend: 'flat', source: 'gov.uk', href: '/ihs-calculator' },
  { label: 'FTB SDLT threshold',   value: '£300k',   delta: '−£125k',  trend: 'down', source: 'HMRC',   href: '/stamp-duty-calculator' },
  { label: 'NLW (21+)',            value: '£12.21',  delta: '+6.7%',   trend: 'up',   source: 'gov.uk', href: '/minimum-wage-checker' },
];

const TOPIC_CARDS: { categoryId: CategoryId; title: string; lede: string; toolHrefs: string[] }[] = [
  { categoryId: 'tax',         title: 'Money & Tax', lede: 'PAYE, NI, dividends, CGT.', toolHrefs: ['/take-home-pay', '/tax-code', '/national-insurance'] },
  { categoryId: 'property',    title: 'Property',    lede: 'Mortgage, SDLT, council tax.', toolHrefs: ['/mortgage-affordability', '/stamp-duty-calculator', '/council-tax-band'] },
  { categoryId: 'employment',  title: 'Work',        lede: 'Salary, leave, redundancy.', toolHrefs: ['/salary-compare', '/redundancy-pay', '/minimum-wage-checker'] },
  { categoryId: 'immigration', title: 'Visas',       lede: '14 routes, all 2026 fees.', toolHrefs: ['/visa-types', '/tools/cost-calculator', '/skilled-worker-points-check'] },
];

export default function HomeDashboard() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    const isPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(query);
    if (isPostcode) {
      router.push(`/postcode/${query.replace(/\s+/g, '').toUpperCase()}`);
    } else {
      const match = APP_TILES.find((t) => t.label.toLowerCase().includes(query.toLowerCase()));
      router.push(match ? match.href : `/blog?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div style={{ background: PAPER, color: INK, fontFamily: FONT, paddingTop: 88 }}>

      {/* Hero */}
      <section style={{ paddingTop: 32, paddingBottom: 24 }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE,
            marginBottom: 14,
          }}>
            Live UK data · 27 May 2026
          </p>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.2rem, 5.4vw, 4rem)',
            lineHeight: 1.02, letterSpacing: '-0.032em',
            color: INK, maxWidth: '20ch',
          }}>
            The numbers that run UK life.
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 18, lineHeight: 1.6,
            color: SLATE, marginTop: 18, maxWidth: 640,
          }}>
            Bank rates, visa fees, wages, tax thresholds — every figure your
            UKDesk calculator reads from, in one panel.
          </p>

          {/* Compact search */}
          <form onSubmit={submit} style={{ maxWidth: 520, marginTop: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: SOFT, border: `1px solid ${HAIR}`,
              borderRadius: 12, padding: '4px 4px 4px 14px',
            }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: MUTED }} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a tool, calculator or postcode…"
                style={{
                  flex: 1, padding: '10px 12px', background: 'transparent',
                  border: 'none', outline: 'none',
                  fontFamily: FONT, fontSize: 14, color: INK,
                }}
              />
              <button type="submit"
                      style={{
                        padding: '8px 14px', borderRadius: 8,
                        background: ORANGE, color: '#FFFFFF',
                        fontFamily: FONT, fontSize: 13, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                      }}>
                Go
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Metric tiles */}
      <section style={{ paddingTop: 16, paddingBottom: 40 }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              background: HAIR,
              border: `1px solid ${HAIR}`,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <style>{`
              @media (min-width: 640px) { .ukd-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; } }
              @media (min-width: 1024px) { .ukd-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; } }
            `}</style>
            <div className="ukd-metric-grid grid gap-px" style={{ gridColumn: '1 / -1', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', background: HAIR }}>
              {METRICS.map((m) => (
                <MetricTile key={m.label} metric={m} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Per-topic mini-dashboards */}
      <section style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE,
            marginBottom: 14,
          }}>
            By topic
          </p>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)',
            lineHeight: 1.1, letterSpacing: '-0.026em',
            color: INK, marginBottom: 30,
          }}>
            Pick a panel, get the tools.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {TOPIC_CARDS.map((card) => {
              const cat = CATEGORIES.find((c) => c.id === card.categoryId)!;
              const tools = card.toolHrefs.map((h) => APP_TILES.find((t) => t.href === h)!).filter(Boolean);
              return (
                <div key={card.categoryId}
                     style={{
                       background: PAPER, border: `1px solid ${HAIR}`,
                       borderRadius: 20, padding: '24px 26px 22px',
                     }}>
                  <p style={{
                    fontFamily: FONT, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED,
                    marginBottom: 6,
                  }}>
                    {cat.label}
                  </p>
                  <h3 style={{
                    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
                    letterSpacing: '-0.022em', color: INK, lineHeight: 1.15,
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: 13.5, color: SLATE, marginTop: 4 }}>
                    {card.lede}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0' }}>
                    {tools.map((t) => (
                      <li key={t.href} style={{ borderTop: `1px solid ${HAIR}` }}>
                        <Link href={t.href}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                gap: 8, padding: '10px 0',
                                textDecoration: 'none', color: INK,
                              }}>
                          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600 }}>
                            {t.label}
                          </span>
                          <ArrowUpRight className="w-4 h-4" style={{ color: MUTED }} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/tools"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px', borderRadius: 12,
                    background: INK, color: '#FFFFFF',
                    fontFamily: FONT, fontSize: 14, fontWeight: 600,
                    textDecoration: 'none',
                  }}>
              Browse all {APP_TILES.length} tools
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricTile({ metric: m }: { metric: Metric }) {
  const Trend = m.trend === 'up' ? TrendingUp : m.trend === 'down' ? TrendingDown : Minus;
  const trendColor = m.trend === 'up' ? '#047857' : m.trend === 'down' ? '#9F1239' : MUTED;
  const inner = (
    <div style={{
      background: PAPER, padding: '20px 22px',
      height: '100%',
    }}>
      <div style={{
        fontFamily: FONT, fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED,
      }}>
        {m.label}
      </div>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 28, fontWeight: 600,
        letterSpacing: '-0.02em', color: INK, lineHeight: 1.1,
        marginTop: 8, fontVariantNumeric: 'tabular-nums',
      }}>
        {m.value}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {m.delta && (
          <span className="inline-flex items-center gap-1"
                style={{
                  fontFamily: FONT_MONO, fontSize: 11, fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums', color: trendColor,
                }}>
            <Trend className="w-3 h-3" />
            {m.delta}
          </span>
        )}
        <span style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 500, color: MUTED }}>
          {m.source}
        </span>
      </div>
    </div>
  );
  return m.href ? (
    <Link href={m.href} style={{ textDecoration: 'none', color: INK, display: 'block' }}
          className="hover:bg-[#F5F8FA] transition-colors">
      {inner}
    </Link>
  ) : inner;
}
