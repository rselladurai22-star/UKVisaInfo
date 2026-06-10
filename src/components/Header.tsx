'use client';

/**
 * UKDesk Header — slim sticky bar · brand · ghost nav links · mobile menu.
 * Search lives on the homepage hero and the /tools page (not in the header).
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';

const NAV: { href: string; label: string }[] = [
  { href: '/tools', label: 'All tools' },
  { href: '/blog', label: 'Insights' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  /* scroll-aware shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* close on route change */
  useEffect(() => { setNavOpen(false); }, [pathname]);

  /* esc to close + body scroll lock while menu open */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

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

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2.5 ml-auto lg:ml-0">
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

      {/* ── Mobile nav menu ─ */}
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
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  );
}
