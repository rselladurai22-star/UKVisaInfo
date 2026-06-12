'use client';

/**
 * Header v4 — "Ledger" chrome.
 * Flat paper bar, text wordmark, underline-active nav. Mobile menu is a
 * full-screen paper sheet with numbered rows (no drawer, no pills).
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, X } from 'lucide-react';

const NAV: { href: string; label: string }[] = [
  { href: '/tools', label: 'Tools' },
  { href: '/visa-types', label: 'Visas' },
  { href: '/blog', label: 'Guides' },
  { href: '/news', label: 'Updates' },
  { href: '/about', label: 'About' },
];

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 64 64"
        width={26}
        height={26}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden
        className="h-[26px] w-[26px] shrink-0 drop-shadow-[0_1px_1px_rgba(11,15,25,0.15)]"
      >
        <path d="M32 6 L56 18 L32 30 L8 18 Z" fill="#0b0f19" />
        <path d="M8 18 L32 30 V54 L8 42 Z" fill="#047857" />
        <path d="M32 30 L56 18 V42 L32 54 Z" fill="#10b981" />
      </svg>
      <span className="font-display text-[20px] font-extrabold leading-none tracking-[-0.03em] text-[#0b0f19]">
        ukdesk<span className="text-emerald-600">.</span>
      </span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  /* close on route change */
  useEffect(() => { setNavOpen(false); }, [pathname]);

  /* esc closes; lock scroll while open */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#0b0f19]/10 bg-[#fbfbf9]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fbfbf9]/85">
        <div className="mx-auto flex h-[56px] w-full max-w-6xl items-center px-5 sm:px-8">
          <Link href="/" aria-label="UKDesk home" className="no-underline">
            <Wordmark />
          </Link>

          {/* desktop nav — text links, underline = active */}
          <nav className="ml-auto hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={[
                  'relative py-[17px] text-sm font-semibold no-underline transition-colors',
                  isActive(n.href)
                    ? 'text-[#0b0f19] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-emerald-600'
                    : 'text-slate-500 hover:text-[#0b0f19]',
                ].join(' ')}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* mobile trigger — plain text, generous tap area */}
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="ml-auto -mr-2 px-2 py-2 text-sm font-bold text-[#0b0f19] lg:hidden"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </header>

      {/* ── mobile sheet — full-screen paper, numbered rows ── */}
      {navOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-[#fbfbf9] lg:hidden"
        >
          <div className="flex h-[56px] flex-none items-center border-b border-[#0b0f19]/10 px-5">
            <Wordmark />
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
              className="-mr-2 ml-auto p-2 text-[#0b0f19]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 pt-2 pb-8">
            {NAV.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setNavOpen(false)}
                className={[
                  'group flex items-baseline gap-4 border-b border-[#0b0f19]/10 py-5 no-underline',
                  isActive(n.href) ? 'text-emerald-700' : 'text-[#0b0f19]',
                ].join(' ')}
              >
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-2xl font-extrabold tracking-[-0.02em]">
                  {n.label}
                </span>
                <ArrowUpRight className="ml-auto h-5 w-5 self-center text-slate-300" />
              </Link>
            ))}

            <p className="mt-8 text-xs leading-relaxed text-slate-500">
              Free UK calculators & guides — verified against GOV.UK, HMRC and ONS.
              No sign-up, nothing stored.
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
