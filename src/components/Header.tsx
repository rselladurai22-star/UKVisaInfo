'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LINKS = [
  { href: '/visa-types', label: 'Visa Routes' },
  { href: '/eligibility', label: 'Eligibility' },
  { href: '/costs', label: 'Costs' },
  { href: '/blog', label: 'Guides' },
];

const LOGO_ICON = (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
    <path d="M1 7L8 1.5L15 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2.5" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="6" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="9.5" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="1" y="12.5" width="14" height="1.5" rx="0.5" fill="#ffbf47"/>
  </svg>
);

export default function Header({ onApply }: { onApply: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(14,20,36,0.09)]'
            : 'bg-white/88 backdrop-blur-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[62px] md:h-[70px] flex items-center justify-between gap-6">

          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="UK Visa Info — home"
          >
            <span className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#c9112a] to-[#8b001d] flex items-center justify-center flex-shrink-0 shadow-[0_1px_4px_rgba(217,21,43,0.35)] group-hover:shadow-[0_2px_8px_rgba(217,21,43,0.45)] transition-shadow">
              {LOGO_ICON}
            </span>
            <span className="font-display font-bold text-[15px] tracking-tight text-[#0a1530]">
              UK Visa <span className="text-[#d9152b]">Info</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center max-w-sm mx-auto">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(l.href)
                    ? 'text-[#0a1530]'
                    : 'text-[#52596e] hover:text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)]'
                }`}
              >
                {isActive(l.href) && (
                  <motion.span
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-[rgba(14,20,36,0.06)] rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onApply}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#d9152b] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#b8101f] active:scale-[0.97] transition-all shadow-[0_1px_4px_rgba(217,21,43,0.3)]"
            >
              Apply now
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-[rgba(14,20,36,0.06)] transition-colors"
            >
              {open
                ? <X className="w-[18px] h-[18px] text-[#0a1530]" />
                : <Menu className="w-[18px] h-[18px] text-[#0a1530]" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-[rgba(10,21,48,0.45)] backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[82%] max-w-[320px] bg-white md:hidden flex flex-col shadow-[−4px_0_32px_rgba(10,21,48,0.15)]"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-[62px] border-b border-[rgba(14,20,36,0.08)]">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <span className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#c9112a] to-[#8b001d] flex items-center justify-center">
                    {LOGO_ICON}
                  </span>
                  <span className="font-display font-bold text-sm text-[#0a1530]">
                    UK Visa <span className="text-[#d9152b]">Info</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgba(14,20,36,0.06)] transition-colors"
                >
                  <X className="w-4 h-4 text-[#0a1530]" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive(l.href)
                        ? 'bg-[rgba(217,21,43,0.07)] text-[#d9152b]'
                        : 'text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)]'
                    }`}
                  >
                    {l.label}
                    <ChevronRight className="w-4 h-4 opacity-35" />
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-[rgba(14,20,36,0.07)] space-y-0.5">
                  {[
                    { href: '/about', label: 'About' },
                    { href: '/privacy', label: 'Privacy' },
                    { href: '/terms', label: 'Terms' },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block px-4 py-3 text-sm text-[#52596e] hover:text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)] rounded-xl transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Apply CTA */}
              <div className="p-4 border-t border-[rgba(14,20,36,0.08)]">
                <button
                  type="button"
                  onClick={() => { onApply(); setOpen(false); }}
                  className="w-full bg-[#d9152b] text-white font-bold py-3.5 rounded-xl text-sm hover:bg-[#b8101f] active:scale-[0.98] transition-all"
                >
                  Apply now
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
