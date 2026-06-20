'use client';

/**
 * Header v6 — "Clean Slate" chrome.
 * Frosted glass bar that gains a soft shadow on scroll. One visual anchor on
 * the right: text nav with an animated underline + a single search affordance
 * (the site is search-first) wired to a real ⌘K shortcut. Mobile collapses to
 * a search shortcut + a full-screen sheet.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';

const NAV: { href: string; label: string }[] = [
  { href: '/tools', label: 'Tools' },
  { href: '/visa-types', label: 'Visas' },
  { href: '/blog', label: 'Guides' },
  { href: '/news', label: 'Updates' },
  { href: '/about', label: 'About' },
];

function Wordmark() {
  return (
    <span className="group inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 64 64"
        width={28}
        height={28}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden
        className="h-7 w-7 shrink-0 drop-shadow-[0_2px_6px_rgba(37,99,235,0.30)] transition-transform duration-300 group-hover:-rotate-6"
      >
        <defs>
          <linearGradient id="hdrTile" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2563EB" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="hdrSheen" x1="32" y1="0" x2="32" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.26" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="15" fill="url(#hdrTile)" />
        <rect width="64" height="64" rx="15" fill="url(#hdrSheen)" />
        <path d="M20 20 V36 a12 12 0 0 0 24 0 V20" fill="none" stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="48.5" cy="17.5" r="5" fill="#7DD3FC" />
      </svg>
      <span className="font-display text-[24px] font-extrabold uppercase leading-none tracking-[-0.01em] text-slate-900">
        UKDESK<span className="text-blue-600">.</span>
      </span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setNavOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ⌘K / Ctrl+K → tools search (the /tools page handles focus itself) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        if (pathname?.startsWith('/tools')) return; // let the page focus its own input
        e.preventDefault();
        router.push('/tools');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pathname, router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <>
      <header
        className={[
          'glass-cs sticky top-0 z-50 border-b transition-[box-shadow,border-color] duration-300',
          scrolled ? 'border-slate-200/80 shadow-[0_6px_24px_-14px_rgba(15,23,42,0.18)]' : 'border-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex h-[60px] w-full max-w-6xl items-center gap-6 px-5 sm:px-8">
          <Link href="/" aria-label="UKDesk home" className="no-underline">
            <Wordmark />
          </Link>

          {/* desktop nav — plain links, animated underline */}
          <nav className="ml-auto hidden items-center gap-8 lg:flex">
            {NAV.map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'group relative py-2 text-[14.5px] font-medium no-underline transition-colors duration-150',
                    active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900',
                  ].join(' ')}
                >
                  {n.label}
                  <span
                    aria-hidden
                    className={[
                      'absolute -bottom-0.5 left-0 right-0 h-[2px] origin-left rounded-full bg-blue-600 transition-transform duration-200 ease-out',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    ].join(' ')}
                  />
                </Link>
              );
            })}
          </nav>

          {/* divider + single search affordance */}
          <div className="hidden h-5 w-px bg-slate-200 lg:block" />
          <Link
            href="/tools"
            className="group hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-2 text-[13px] font-medium text-slate-500 transition-all duration-150 hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-sm lg:inline-flex"
          >
            <Search className="h-[15px] w-[15px]" strokeWidth={2.2} />
            <span>Search tools</span>
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-px font-mono text-[10.5px] font-semibold text-slate-400 group-hover:border-blue-200 group-hover:text-blue-500">
              ⌘K
            </kbd>
          </Link>

          {/* mobile actions */}
          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <Link
              href="/tools"
              aria-label="Search tools"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Search className="h-[19px] w-[19px]" strokeWidth={2.2} />
            </Link>
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-slate-100"
            >
              <span className="flex flex-col gap-[4px]">
                <span className="block h-[2px] w-[18px] rounded-full bg-current" />
                <span className="block h-[2px] w-[18px] rounded-full bg-current" />
                <span className="block h-[2px] w-[12px] rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── mobile sheet ── */}
      {navOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-white to-slate-50 lg:hidden"
        >
          <div className="flex h-[60px] flex-none items-center border-b border-slate-200 px-5">
            <Wordmark />
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
              className="-mr-2 ml-auto rounded-full p-2 text-slate-900 transition-colors hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 pb-8 pt-3">
            {NAV.map((n, i) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setNavOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'cs-rise group relative flex items-center gap-4 rounded-xl border-b border-slate-100 px-3 py-4 no-underline transition-colors',
                    active ? 'text-blue-700' : 'text-slate-900 hover:bg-slate-100/70',
                  ].join(' ')}
                  style={{ ['--i' as string]: i }}
                >
                  {active && (
                    <span aria-hidden className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                  )}
                  <span className="font-mono text-xs tabular-nums text-slate-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-2xl font-extrabold tracking-[-0.02em]">{n.label}</span>
                  <ArrowUpRight className="ml-auto h-5 w-5 self-center text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </Link>
              );
            })}

            <Link
              href="/tools"
              onClick={() => setNavOpen(false)}
              className="cs-rise mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-3.5 text-[15px] font-bold text-white no-underline shadow-[0_8px_22px_-6px_rgba(37,99,235,0.6)]"
              style={{ ['--i' as string]: NAV.length }}
            >
              <Search className="h-4 w-4" /> Search all tools <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-8 text-xs leading-relaxed text-slate-500">
              Free UK calculators &amp; guides — verified against GOV.UK, HMRC and ONS.
              No sign-up, nothing stored.
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
