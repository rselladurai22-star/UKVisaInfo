'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ArrowUpRight, Filter } from 'lucide-react';
import type { BlogPost } from '../../data/blog';

const FONT   = '"Lexend Deca", -apple-system, system-ui, sans-serif';
const INK    = '#213343';
const SLATE  = '#516F90';
const MUTED  = '#7C98B6';
const ORANGE = '#FF7A59';
const SOFT   = '#F5F8FA';
const HAIR   = 'rgba(33,51,67,0.08)';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [posts]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of sorted) for (const t of p.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [sorted]);

  const filtered = useMemo(() => {
    if (!activeTag) return sorted;
    return sorted.filter((p) => p.tags.includes(activeTag));
  }, [sorted, activeTag]);

  const [featured, ...rest] = filtered;

  return (
    <div style={{ background: '#FFFFFF', color: INK, fontFamily: FONT }}>

      {/* Page hero */}
      <section className="pt-[120px] md:pt-[140px] pb-8 md:pb-10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE,
            marginBottom: 14,
          }}>
            Blog &amp; Guides
          </p>
          <h1 style={{
            fontFamily: FONT, fontWeight: 700,
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            lineHeight: 1.04, letterSpacing: '-0.032em',
            color: INK, maxWidth: '20ch',
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}>
            Long-form UK visa guides
          </h1>
          <p style={{
            fontFamily: FONT, fontSize: 18, lineHeight: 1.6,
            color: SLATE, marginTop: 18, maxWidth: 640,
          }}>
            Plain-English deep dives on the rules behind your application — updated
            for 2026 thresholds, fees and processing times.
          </p>
        </div>
      </section>

      {/* Tag filter pill bar */}
      <div className="sticky top-[62px] md:top-[70px] z-30"
           style={{
             background: 'rgba(255,255,255,0.95)',
             backdropFilter: 'blur(12px)',
             WebkitBackdropFilter: 'blur(12px)',
             borderTop: `1px solid ${HAIR}`,
             borderBottom: `1px solid ${HAIR}`,
           }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-3 flex items-center gap-2 overflow-x-auto mask-fade">
          <Filter className="w-4 h-4 flex-shrink-0" style={{ color: MUTED }} />
          <Chip
            label="All"
            count={sorted.length}
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {tagCounts.map(([tag, count]) => (
            <Chip
              key={tag}
              label={tag}
              count={count}
              active={activeTag === tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            />
          ))}
        </div>
      </div>

      <section className="py-10 md:py-14">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">

          <p style={{
            fontFamily: FONT, fontSize: 13, color: MUTED, marginBottom: 28,
          }}>
            <span style={{ fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums' }}>
              {filtered.length}
            </span>{' '}
            {filtered.length === 1 ? 'article' : 'articles'}
            {activeTag && (
              <>
                {' '}tagged{' '}
                <span style={{ fontWeight: 700, color: INK }}>{activeTag}</span>
              </>
            )}
          </p>

          {filtered.length === 0 ? (
            <div style={{
              background: '#FFFFFF', borderRadius: 16,
              border: `1px dashed rgba(33,51,67,0.16)`,
              padding: 48, textAlign: 'center',
            }}>
              <p style={{ fontFamily: FONT, fontSize: 14, color: MUTED }}>
                No articles match this tag yet.
              </p>
            </div>
          ) : (
            <>
              {/* Featured article — HubSpot-style large card */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group block lift-on-hover"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${HAIR}`,
                    borderRadius: 28,
                    padding: '40px 40px 36px',
                    marginBottom: 40,
                    textDecoration: 'none', color: INK,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Orange accent stripe across top */}
                  <span aria-hidden style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 4, background: ORANGE,
                  }} />
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span style={{
                      fontFamily: FONT, fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE,
                    }}>
                      Latest article
                    </span>
                    {featured.tags.slice(0, 2).map((tag) => (
                      <span key={tag} style={{
                        fontFamily: FONT, fontSize: 10.5, fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: SLATE, background: SOFT,
                        padding: '3px 9px', borderRadius: 999,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 style={{
                    fontFamily: FONT, fontWeight: 700,
                    fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
                    lineHeight: 1.1, letterSpacing: '-0.028em',
                    color: INK, maxWidth: '24ch',
                    textWrap: 'balance' as React.CSSProperties['textWrap'],
                  }}>
                    {featured.title}
                  </h2>
                  <p style={{
                    fontFamily: FONT, fontSize: 16, lineHeight: 1.6,
                    color: SLATE, marginTop: 14, maxWidth: '60ch',
                  }}>
                    {featured.description}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-5"
                       style={{ fontFamily: FONT, fontSize: 13, color: MUTED }}>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(featured.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readMinutes} min read
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-[gap] duration-150"
                          style={{
                            fontFamily: FONT, fontSize: 14, fontWeight: 600, color: ORANGE,
                          }}>
                      Read article
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              )}

              {/* 3-col grid of remaining articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group lift-on-hover"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${HAIR}`,
                      borderRadius: 20,
                      padding: '24px 24px 22px',
                      textDecoration: 'none', color: INK,
                      display: 'flex', flexDirection: 'column',
                    }}
                  >
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag, idx) => (
                        <span key={tag} style={{
                          fontFamily: FONT, fontSize: 10, fontWeight: 700,
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          color: idx === 0 ? ORANGE : SLATE,
                          background: idx === 0 ? 'rgba(255,122,89,0.10)' : SOFT,
                          padding: '3px 8px', borderRadius: 999,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 style={{
                      fontFamily: FONT, fontWeight: 700,
                      fontSize: 17, lineHeight: 1.2, letterSpacing: '-0.018em',
                      color: INK, flex: 1,
                    }}>
                      {post.title}
                    </h3>

                    <p style={{
                      fontFamily: FONT, fontSize: 13.5, lineHeight: 1.55,
                      color: SLATE, marginTop: 10,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.description}
                    </p>

                    <div className="mt-5 pt-4 flex items-center justify-between"
                         style={{
                           borderTop: `1px solid ${HAIR}`,
                           fontFamily: FONT, fontSize: 12, color: MUTED,
                         }}>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {post.readMinutes} min read
                      </span>
                      <span className="inline-flex items-center gap-1 group-hover:gap-2 transition-[gap] duration-150"
                            style={{ color: ORANGE, fontWeight: 600 }}>
                        Read
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
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
      className="inline-flex items-center gap-1.5 whitespace-nowrap transition-all duration-100 flex-shrink-0"
      style={{
        fontFamily: FONT, fontSize: 12.5, fontWeight: 600,
        padding: '6px 14px', borderRadius: 999,
        background: active ? ORANGE : SOFT,
        color: active ? '#FFFFFF' : SLATE,
        border: active ? `1px solid ${ORANGE}` : '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = '#EAF0F6';
          e.currentTarget.style.color = INK;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = SOFT;
          e.currentTarget.style.color = SLATE;
        }
      }}
    >
      {label}
      <span style={{
        fontFamily: FONT, fontSize: 11, fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        color: active ? 'rgba(255,255,255,0.7)' : MUTED,
      }}>
        {count}
      </span>
    </button>
  );
}
