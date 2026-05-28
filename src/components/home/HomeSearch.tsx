'use client';

/**
 * Variant B — Search-as-hero, minimal.
 * Massive centered command palette as the entire above-the-fold.
 * Below the fold: news ticker + popular tools.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ArrowUpRight, CornerDownLeft, Command } from 'lucide-react';
import { APP_TILES, type AppTile } from '../../data/tools';
import { NEWS_ITEMS } from '../../data/news';
import { FONT, FONT_DISPLAY, FONT_MONO, INK, PAPER, SOFT, ORANGE, SLATE, MUTED, HAIR } from './tokens';

const POPULAR_HREFS = [
  '/take-home-pay',
  '/stamp-duty-calculator',
  '/mortgage-affordability',
  '/council-tax-band',
  '/visa-types',
  '/postcode',
];

export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery]     = useState('');
  const [active, setActive]   = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as AppTile[];
    const isPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(q);
    if (isPostcode) {
      return [{
        href: `/postcode/${q.replace(/\s+/g, '').toUpperCase()}`,
        label: `Look up postcode ${q.toUpperCase()}`,
        hint: 'Council · MP · NHS · police · ward',
      } as unknown as AppTile];
    }
    return APP_TILES.filter((t) =>
      t.label.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); const t = results[active]; if (t) router.push(t.href); }
    if (e.key === 'Escape')    { inputRef.current?.blur(); }
  };

  const popular = useMemo(
    () => POPULAR_HREFS.map((h) => APP_TILES.find((t) => t.href === h)).filter(Boolean) as AppTile[],
    [],
  );
  const latestNews = useMemo(() => [...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4), []);

  return (
    <div style={{ background: PAPER, color: INK, fontFamily: FONT, paddingTop: 88 }}>

      {/* Above-the-fold hero: just search */}
      <section style={{
        minHeight: 'calc(100vh - 88px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 20px',
      }}>
        <p style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE,
          marginBottom: 18,
        }}>
          UKDesk · the search bar for UK life
        </p>

        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize: 'clamp(2.4rem, 6vw, 5rem)',
          lineHeight: 1.02, letterSpacing: '-0.035em',
          color: INK, marginBottom: 36,
          textAlign: 'center', maxWidth: '18ch',
        }}>
          What do you need to look up?
        </h1>

        {/* Massive search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 720 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: PAPER, borderRadius: 16,
            border: `1px solid ${focused ? ORANGE : HAIR}`,
            boxShadow: focused
              ? '0 0 0 6px rgba(255,122,89,0.10), 0 24px 60px -16px rgba(33,51,67,0.22)'
              : '0 10px 32px -10px rgba(33,51,67,0.14), 0 2px 6px rgba(33,51,67,0.04)',
            padding: '4px 4px 4px 22px',
            transition: 'all 150ms',
          }}>
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: focused ? ORANGE : MUTED }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActive(0); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 160)}
              onKeyDown={onKey}
              placeholder="Take-home pay · Stamp duty · Skilled Worker · SW1A 1AA…"
              style={{
                flex: 1, padding: '20px 16px',
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: FONT, fontSize: 17, fontWeight: 500, color: INK,
              }}
            />
            <span className="hidden md:inline-flex items-center gap-1"
                  style={{
                    background: SOFT, color: SLATE,
                    fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600,
                    padding: '6px 10px', borderRadius: 8, marginRight: 4,
                  }}>
              <Command className="w-3 h-3" /> K
            </span>
          </div>

          {focused && query && results.length > 0 && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 'calc(100% + 8px)',
              background: PAPER, borderRadius: 16, overflow: 'hidden',
              border: `1px solid ${HAIR}`,
              boxShadow: '0 28px 64px -16px rgba(33,51,67,0.24)',
              zIndex: 50,
            }}>
              {results.map((r, i) => (
                <Link key={r.href} href={r.href} onMouseEnter={() => setActive(i)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 12, padding: '14px 20px',
                        textDecoration: 'none', color: INK,
                        background: i === active ? 'rgba(255,122,89,0.06)' : 'transparent',
                      }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: FONT, fontSize: 14.5, fontWeight: 600, color: INK }} className="truncate">
                      {r.label}
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 12.5, color: MUTED, marginTop: 2 }} className="truncate">
                      {r.hint}
                    </div>
                  </div>
                  <CornerDownLeft className="w-3.5 h-3.5 flex-shrink-0" style={{ color: MUTED }} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Popular chips */}
        <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 720 }}>
          <span style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED,
            display: 'inline-flex', alignItems: 'center', padding: '4px 0',
          }}>
            Popular
          </span>
          {popular.map((t) => (
            <Link key={t.href} href={t.href}
                  style={{
                    fontFamily: FONT, fontSize: 13, fontWeight: 500,
                    padding: '6px 14px', borderRadius: 999,
                    background: SOFT, color: INK,
                    textDecoration: 'none',
                  }}>
              {t.label}
            </Link>
          ))}
        </div>

        <p style={{
          fontFamily: FONT, fontSize: 12.5, color: MUTED,
          marginTop: 22, textAlign: 'center',
        }}>
          {APP_TILES.length} live UK calculators. Verified against gov.uk, HMRC and ONS. Free, no signup.
        </p>
      </section>

      {/* Below the fold: tiny news strip */}
      <section style={{ borderTop: `1px solid ${HAIR}`, background: SOFT, padding: '40px 20px 80px' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="flex items-baseline justify-between mb-6">
            <p style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE,
            }}>
              Latest news
            </p>
            <Link href="/news" className="inline-flex items-center gap-1"
                  style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: INK, textDecoration: 'none' }}>
              All updates <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {latestNews.map((n) => (
              <li key={n.slug} style={{ borderBottom: `1px solid ${HAIR}` }}>
                <Link href={`/news/${n.slug}`} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: 16, padding: '14px 0', textDecoration: 'none', color: INK,
                }}>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: INK }}>
                      {n.title}
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED, marginTop: 2 }}>
                      {new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {n.category}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: MUTED }} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
