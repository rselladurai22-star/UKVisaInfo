'use client';

/**
 * UKDesk Header — June 2026 redesign
 * Slim sticky bar · brand · search-pill (⌘K) · ghost links · primary CTA
 * Mobile: hamburger opens the same command palette overlay.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, Menu, Search, X } from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../data/tools';

const POPULAR = [
  '/take-home-pay',
  '/stamp-duty-calculator',
  '/mortgage-affordability',
  '/visa-types',
  '/tools/cost-calculator',
  '/council-tax-band',
];

const NAV: { href: string; label: string }[] = [
  { href: '/tools', label: 'All tools' },
  { href: '/visa-types', label: 'Visas' },
  { href: '/blog', label: 'Insights' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* scroll-aware shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* close on route change */
  useEffect(() => { setOpen(false); setNavOpen(false); }, [pathname]);

  /* body scroll lock + focus + esc + ⌘K open */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === 'Escape') { setOpen(false); setNavOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || navOpen ? 'hidden' : '';
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    return () => { document.body.style.overflow = ''; };
  }, [open, navOpen]);

  /* filter */
  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [] as typeof APP_TILES;
    return APP_TILES
      .filter((t) =>
        t.label.toLowerCase().includes(q) ||
        (t.hint?.toLowerCase().includes(q) ?? false) ||
        t.category.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [q]);

  const popularTiles = useMemo(
    () => POPULAR.map((h) => APP_TILES.find((t) => t.href === h)).filter(Boolean) as typeof APP_TILES,
    [],
  );

  const go = useCallback((href: string) => { setOpen(false); router.push(href); }, [router]);

  return (
    <>
      <header
        className={[
          'sticky top-0 z-50 transition-all duration-150',
          scrolled
            ? 'bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 border-b border-border shadow-[0_1px_0_rgba(11,15,25,0.04)]'
            : 'bg-surface/80 backdrop-blur-sm border-b border-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex h-[64px] max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 no-underline" aria-label="UKDesk home">
            <span className="relative inline-flex h-9 w-9 items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <svg
                viewBox="0 0 64 64"
                width={36}
                height={36}
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="UKDesk"
                className="h-9 w-9"
              >
                <path d="M32 8 L54 19 L32 30 L10 19 Z" fill="#0B2240" />
                <path d="M10 19 L32 30 V52 L10 41 Z" fill="#0037b0" />
                <path d="M32 30 L54 19 V41 L32 52 Z" fill="#00875A" />
              </svg>
            </span>
            <span className="hidden font-display text-lg font-bold tracking-tight sm:inline">
              <span className="text-[#0B2240] font-black tracking-tight text-xl font-display">UK<span className="text-[#00875A]">Desk</span></span>
            </span>
          </Link>

          {/* Nav (desktop) */}
          <nav className="mx-auto hidden items-center gap-1.5 lg:flex">
            {NAV.map((n) => {
              const active = pathname === n.href || (n.href !== '/' && pathname?.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={[
                    'rounded-full px-3.5 py-1.5 text-sm font-semibold transition no-underline',
                    active
                      ? 'bg-primary-soft text-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary',
                  ].join(' ')}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5 ml-auto lg:ml-0">
            {/* Mobile actions */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-primary md:hidden cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-surface lg:hidden cursor-pointer"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile nav menu (same links as desktop header) ─ */}
      {navOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-md animate-[fadeIn_120ms_ease-out] lg:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setNavOpen(false); }}
        >
          <div className="ml-auto flex h-full w-full max-w-xs flex-col bg-surface shadow-[0_30px_80px_-20px_rgba(11,15,25,0.4)] animate-[slideIn_180ms_cubic-bezier(0.22,1,0.36,1)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-display text-lg font-bold tracking-tight">
                <span className="text-[#0B2240] font-black tracking-tight text-xl font-display">UK<span className="text-[#00875A]">Desk</span></span>
              </span>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-primary transition hover:bg-surface-container"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {NAV.map((n) => {
                const active = pathname === n.href || (n.href !== '/' && pathname?.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setNavOpen(false)}
                    className={[
                      'flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold no-underline transition',
                      active
                        ? 'bg-primary-soft text-primary'
                        : 'text-on-surface hover:bg-surface-container-low hover:text-primary',
                    ].join(' ')}
                  >
                    {n.label}
                    <ArrowRight className="h-4 w-4 opacity-60" />
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={() => { setNavOpen(false); setOpen(true); }}
              className="mx-4 mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-primary transition hover:bg-surface-container-low"
            >
              <Search className="h-4 w-4" /> Search tools
            </button>
          </div>
        </div>
      )}

      {/* ── Command palette overlay ─────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search and browse"
          className="fixed inset-0 z-[60] flex items-start justify-center bg-primary/40 px-4 pt-4 backdrop-blur-md animate-[fadeIn_120ms_ease-out] sm:pt-16"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_30px_80px_-20px_rgba(11,15,25,0.4)] animate-[popIn_160ms_cubic-bezier(0.22,1,0.36,1)]">
            {/* Search row */}
            <div className="flex items-center gap-3 border-b border-border bg-surface-container-lowest px-5 py-4">
              <Search className="h-5 w-5 text-on-surface-variant" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search calculators, visas, guides…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(results[0].href); }}
                className="flex-1 border-0 bg-transparent text-base font-medium text-primary placeholder:text-on-surface-variant focus:outline-none focus:ring-0"
                autoComplete="off"
              />
              <kbd className="hidden rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10.5px] font-semibold text-on-surface-variant sm:inline-flex">
                ESC
              </kbd>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-primary transition hover:bg-surface-container sm:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results / Browse */}
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {q ? (
                results.length === 0 ? (
                  <p className="px-2 py-12 text-center text-sm text-on-surface-variant">
                    No tools match <span className="font-semibold text-primary">&quot;{query}&quot;</span>. Try a broader term.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {results.map((t) => {
                      const Icon = t.icon;
                      const cat = CATEGORIES.find((c) => c.id === t.category);
                      return (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            onClick={() => setOpen(false)}
                            className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 no-underline transition hover:border-border hover:bg-surface-container-lowest"
                          >
                            <span
                              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white"
                              style={{ background: t.accent }}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[14.5px] font-semibold text-primary">{t.label}</span>
                              {t.hint && <span className="block truncate text-xs text-on-surface-variant">{t.hint}</span>}
                            </span>
                            {cat && (
                              <span className="hidden rounded-full border border-border bg-surface px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-on-surface-variant sm:inline-block">
                                {cat.label.split(' ')[0]}
                              </span>
                            )}
                            <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:translate-x-0.5 group-hover:text-secondary" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Categories */}
                  <section>
                    <h3 className="px-2 pb-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Browse by topic
                    </h3>
                    <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const n = APP_TILES.filter((t) => t.category === cat.id).length;
                        return (
                          <li key={cat.id}>
                            <Link
                              href={`/category/${cat.id as CategoryId}`}
                              onClick={() => setOpen(false)}
                              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 no-underline transition hover:border-border hover:bg-surface-container-lowest"
                            >
                              <span
                                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white"
                                style={{ background: cat.color }}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13.5px] font-semibold text-primary">{cat.label}</span>
                                <span className="block text-[11px] font-medium text-on-surface-variant">{n} tools</span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>

                  {/* Popular */}
                  <section>
                    <h3 className="px-2 pb-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Most used
                    </h3>
                    <ul className="flex flex-col gap-1">
                      {popularTiles.map((t) => {
                        const Icon = t.icon;
                        return (
                          <li key={t.href}>
                            <Link
                              href={t.href}
                              onClick={() => setOpen(false)}
                              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 no-underline transition hover:border-border hover:bg-surface-container-lowest"
                            >
                              <span
                                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white"
                                style={{ background: t.accent }}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[14px] font-semibold text-primary">{t.label}</span>
                                {t.hint && <span className="block truncate text-xs text-on-surface-variant">{t.hint}</span>}
                              </span>
                              <ArrowRight className="h-4 w-4 text-on-surface-variant transition group-hover:translate-x-0.5 group-hover:text-secondary" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>

                  {/* Mobile nav (shows extra links inside palette on small screens) */}
                  <section className="lg:hidden">
                    <h3 className="px-2 pb-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Navigate
                    </h3>
                    <ul className="grid grid-cols-2 gap-1">
                      {NAV.map((n) => (
                        <li key={n.href}>
                          <Link
                            href={n.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl border border-border px-3 py-2.5 text-[13.5px] font-semibold text-primary no-underline transition hover:bg-surface-container-lowest"
                          >
                            {n.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-border bg-surface-container-lowest px-5 py-3 text-[11px] text-on-surface-variant">
              <span className="hidden sm:inline">
                <span className="font-semibold text-primary">↵</span> open ·{' '}
                <span className="font-semibold text-primary">esc</span> close
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-secondary" />
                {APP_TILES.length} tools verified against GOV.UK
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn  { from { opacity: 0; transform: translateY(8px) scale(0.985) }
                            to   { opacity: 1; transform: translateY(0)   scale(1) } }
        @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  );
}
