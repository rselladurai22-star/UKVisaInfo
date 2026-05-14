'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, ArrowUpRight, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LINKS: { href: string; label: string }[] = [
  { href: '/visa-types', label: 'Visas' },
  { href: '/eligibility', label: 'Eligibility' },
  { href: '/costs', label: 'Costs' },
  { href: '/blog', label: 'Guides' },
];

export default function Header({ onApply }: { onApply: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-soft' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="UK Visa Info — home"
          >
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-[#8b001d] text-white shadow-soft">
              <Crown className="w-4 h-4" />
            </span>
            <span className="font-display font-bold text-base md:text-lg tracking-tight text-primary">
              UK Visa <span className="text-secondary">Info</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(l.href)
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {l.label}
                {isActive(l.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-secondary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onApply}
              className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-container transition-colors ring-soft"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors"
            >
              {open ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-sm bg-surface-container-lowest md:hidden flex flex-col shadow-card"
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
            >
              <div className="flex items-center justify-between p-5 border-b border-outline-variant/30">
                <span className="font-display font-bold text-base text-primary">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-5 space-y-1">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center justify-between gap-3 px-4 py-4 rounded-2xl text-base font-semibold transition-colors ${
                      isActive(l.href)
                        ? 'bg-secondary-soft text-secondary'
                        : 'text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    {l.label}
                    <ArrowUpRight className="w-4 h-4 opacity-60" />
                  </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-outline-variant/30 space-y-1">
                  <Link
                    href="/about"
                    className="block px-4 py-3 rounded-2xl text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="/privacy"
                    className="block px-4 py-3 rounded-2xl text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    className="block px-4 py-3 rounded-2xl text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    Terms
                  </Link>
                </div>
              </nav>

              <div className="p-5 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => {
                    onApply();
                    setOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 rounded-2xl shadow-soft active:scale-[0.98] transition-transform"
                >
                  <Sparkles className="w-4 h-4" />
                  Start guided apply
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
