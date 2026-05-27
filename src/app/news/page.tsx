import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { NEWS_ITEMS } from '../../data/news';

export const metadata: Metadata = {
  title: 'UK Visa News — Rule Changes, Fee Updates & Processing 2026',
  description: 'Latest UK immigration updates — fee uplifts, route changes, processing-time shifts and eVisa rollout. Sourced from gov.uk.',
  alternates: { canonical: '/news' },
};

const FONT   = '"Lexend Deca", -apple-system, system-ui, sans-serif';
const INK    = '#213343';
const SLATE  = '#516F90';
const MUTED  = '#7C98B6';
const ORANGE = '#FF7A59';
const SOFT   = '#F5F8FA';
const HAIR   = 'rgba(33,51,67,0.08)';

export default function NewsIndex() {
  const items = [...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ background: '#FFFFFF', color: INK, fontFamily: FONT }}>

      {/* Hero */}
      <section className="pt-[120px] md:pt-[140px] pb-10 md:pb-14">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <p className="inline-flex items-center gap-1.5"
             style={{
               fontFamily: FONT, fontSize: 11, fontWeight: 700,
               letterSpacing: '0.16em', textTransform: 'uppercase',
               color: ORANGE, marginBottom: 14,
             }}>
            <Newspaper className="w-3 h-3" />
            Updates
          </p>
          <h1 style={{
            fontFamily: FONT, fontWeight: 700,
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            lineHeight: 1.04, letterSpacing: '-0.032em',
            color: INK, maxWidth: '20ch',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}>
            UK visa news &amp; updates
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 18, lineHeight: 1.6,
            color: SLATE, marginTop: 18, maxWidth: 640,
          }}>
            Short briefs on UK immigration changes — fee uplifts, route closures,
            processing-time shifts. Updated weekly. Subscribe to the Tuesday brief.
          </p>
        </div>
      </section>

      {/* Item list */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[820px] mx-auto px-5 md:px-10 space-y-5">
          {items.map((n) => (
            <Link
              key={n.slug}
              href={`/news/${n.slug}`}
              className="group block lift-on-hover"
              style={{
                background: '#FFFFFF',
                border: `1px solid ${HAIR}`,
                borderRadius: 20,
                padding: '24px 28px 22px',
                textDecoration: 'none', color: INK,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span style={{
                  fontFamily: FONT, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: ORANGE, background: 'rgba(255,122,89,0.10)',
                  padding: '3px 10px', borderRadius: 999,
                }}>
                  {n.category}
                </span>
                <span className="inline-flex items-center gap-1.5"
                      style={{
                        fontFamily: FONT, fontSize: 12, color: MUTED,
                      }}>
                  <Calendar className="w-3 h-3" />
                  {new Date(n.date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>

              <h2 style={{
                fontFamily: FONT, fontWeight: 700,
                fontSize: 20, lineHeight: 1.2, letterSpacing: '-0.022em',
                color: INK,
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}>
                {n.title}
              </h2>

              <p style={{
                fontFamily: FONT, fontSize: 14.5, lineHeight: 1.6,
                color: SLATE, marginTop: 10,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {n.summary}
              </p>

              <div className="mt-5 pt-4 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-[gap] duration-150"
                   style={{
                     borderTop: `1px solid ${HAIR}`,
                     paddingTop: 14,
                     width: '100%',
                     fontFamily: FONT, fontSize: 13, fontWeight: 600, color: ORANGE,
                   }}>
                Read full update
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
