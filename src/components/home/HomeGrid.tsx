'use client';

/**
 * Variant D — Calculator index grid (flat).
 * Tiny header + filter pills + searchable flat grid of every live tool.
 * Notion / Linear product-page feel.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../data/tools';
import { FONT, FONT_DISPLAY, INK, PAPER, SOFT, ORANGE, SLATE, MUTED, HAIR } from './tokens';

type Filter = 'all' | CategoryId;

export default function HomeGrid() {
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return APP_TILES.filter((t) => {
      if (filter !== 'all' && t.category !== filter) return false;
      if (ql && !t.label.toLowerCase().includes(ql) && !t.hint.toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [filter, q]);

  return (
    <div style={{ background: PAPER, color: INK, fontFamily: FONT, paddingTop: 88 }}>

      {/* Header */}
      <section style={{ padding: '40px 0 28px' }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <p style={{
            fontFamily: FONT, fontSize: 12, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE,
            marginBottom: 16,
          }}>
            UKDesk · The free UK reference desk
          </p>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            lineHeight: 1.05, letterSpacing: '-0.028em',
            color: INK, marginBottom: 18,
          }}>
            All {APP_TILES.length} UK calculators, in one place.
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 18.5, fontWeight: 400,
            color: SLATE, lineHeight: 1.65, maxWidth: 720,
          }}>
            UKDesk is a free reference site for UK life. {APP_TILES.length} calculators and
            lookups covering tax, mortgages, council tax, visas, salary, benefits and more —
            every figure verified against gov.uk, HMRC and ONS. No signup, no advice, just the numbers.
          </p>
        </div>
      </section>

      {/* Filter + search bar (sticky) */}
      <section
        className="sticky top-[64px] md:top-[68px] z-20"
        style={{
          background: '#FFFFFF',
          padding: '12px 0',
        }}
      >
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 flex flex-col md:flex-row md:items-center gap-3">
          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto flex-1 mask-fade">
            <Chip label="All" count={APP_TILES.length} active={filter === 'all'} onClick={() => setFilter('all')} />
            {CATEGORIES.map((c) => {
              const count = APP_TILES.filter((t) => t.category === c.id).length;
              return (
                <Chip key={c.id} label={c.label} count={count}
                      active={filter === c.id} onClick={() => setFilter(c.id)} />
              );
            })}
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#FFFFFF', borderRadius: 10,
            padding: '8px 14px',
            minWidth: 260, maxWidth: 340,
          }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: MUTED }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools…"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: FONT, fontSize: 15, fontWeight: 400, color: INK, flex: 1,
                minWidth: 0,
              }}
            />
          </div>
        </div>
      </section>

      {/* Flat grid */}
      <section style={{ padding: '32px 0 80px' }}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-10">
          <p style={{
            fontFamily: FONT, fontSize: 14.5, fontWeight: 400, color: MUTED, marginBottom: 24,
          }}>
            <span style={{ fontFamily: FONT, fontWeight: 600, color: INK, fontVariantNumeric: 'tabular-nums' }}>
              {filtered.length}
            </span>{' '}
            {filtered.length === 1 ? 'tool' : 'tools'}
            {filter !== 'all' && (
              <>
                {' '}in <span style={{ fontWeight: 600, color: INK }}>
                  {CATEGORIES.find((c) => c.id === filter)?.label}
                </span>
              </>
            )}
          </p>

          {filtered.length === 0 ? (
            <div style={{
              background: PAPER, border: `1px dashed rgba(33,51,67,0.16)`,
              borderRadius: 16, padding: 48, textAlign: 'center',
            }}>
              <p style={{ fontFamily: FONT, fontSize: 14, color: MUTED }}>
                No tools match.
              </p>
            </div>
          ) : (
            <div className="grid gap-3"
                 style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {filtered.map((t) => (
                <Link key={t.href} href={t.href}
                      className="group"
                      style={{
                        display: 'flex', flexDirection: 'column',
                        background: '#FFFFFF',
                        borderRadius: 14, padding: '16px 18px',
                        textDecoration: 'none', color: INK,
                        transition: 'all 150ms',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,122,89,0.04)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(255,122,89,0.10)',
                      color: ORANGE,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <t.icon className="w-4 h-4" />
                    </span>
                    <ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ color: ORANGE }} />
                  </div>
                  <div style={{
                    fontFamily: FONT, fontSize: 16, fontWeight: 500, color: INK,
                    marginBottom: 6, letterSpacing: '-0.005em',
                  }}>
                    {t.label}
                  </div>
                  <div style={{
                    fontFamily: FONT, fontSize: 14, fontWeight: 400, color: SLATE, lineHeight: 1.5,
                  }}>
                    {t.hint}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Chip({
  label, count, active, onClick,
}: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 transition-all duration-100"
      style={{
        fontFamily: FONT, fontSize: 14, fontWeight: 500,
        padding: '8px 16px', borderRadius: 999,
        background: active ? ORANGE : 'transparent',
        color: active ? '#FFFFFF' : SLATE,
        border: '1px solid transparent',
        cursor: 'pointer',
        transition: 'color 100ms',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = INK; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = SLATE; }}
    >
      {label}
      <span style={{
        fontFamily: 'inherit', fontSize: 12, fontWeight: 400,
        fontVariantNumeric: 'tabular-nums',
        color: active ? 'rgba(255,255,255,0.7)' : MUTED,
      }}>
        {count}
      </span>
    </button>
  );
}
