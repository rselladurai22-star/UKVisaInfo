'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Landmark, UserCircle2, Menu, X, ChevronDown,
  Briefcase, GraduationCap, Plane, Users,
  ExternalLink, FileCheck2, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header({ onApply }: { onApply: () => void }) {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const visaCategories = [
    { title: 'Work Visas', icon: Briefcase, desc: 'Skilled Worker, Health & Care' },
    { title: 'Study Visas', icon: GraduationCap, desc: 'Student, Graduate, Child' },
    { title: 'Visit Visas', icon: Plane, desc: 'Tourism, Business, Transit' },
    { title: 'Family Visas', icon: Users, desc: 'Spouse, Partner, Dependents' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-diplomat border-b border-primary/10 shadow-diplomat">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2"
          >
            <Landmark className="text-secondary w-6 h-6" />
            UK Visa Info
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-sans tracking-tight text-sm font-medium h-full">
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setActiveDropdown('types')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/visa-types"
              className={`flex items-center gap-1 transition-all hover:text-secondary h-20 px-2 ${
                isActive('/visa-types') ? 'text-primary border-b-2 border-secondary font-bold' : 'text-primary/70'
              }`}
            >
              Visa Types
              <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'types' ? 'rotate-180' : ''}`} />
            </Link>
            <AnimatePresence>
              {activeDropdown === 'types' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-surface-container-lowest border border-primary/10 shadow-2xl rounded-b-xl overflow-hidden z-50 p-2"
                >
                  <div className="space-y-1">
                    {visaCategories.map((cat, i) => (
                      <Link
                        key={i}
                        href="/visa-types"
                        onClick={() => setActiveDropdown(null)}
                        className="w-full flex items-start gap-3 p-3 hover:bg-surface-container-low rounded-lg transition-colors text-left group"
                      >
                        <div className="mt-1 p-1 bg-primary-container text-white rounded group-hover:bg-secondary transition-colors">
                          <cat.icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-primary">{cat.title}</div>
                          <div className="text-[10px] text-on-surface-variant leading-tight">{cat.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/visa-types"
            className={`flex items-center h-20 px-2 transition-all hover:text-secondary ${
              isActive('/visa-types') ? 'text-primary font-bold' : 'text-primary/70'
            }`}
          >
            Requirements
          </Link>
          <Link
            href="/eligibility"
            className={`flex items-center h-20 px-2 transition-all hover:text-secondary ${
              isActive('/eligibility') ? 'text-primary border-b-2 border-secondary font-bold' : 'text-primary/70'
            }`}
          >
            Eligibility
          </Link>
          <Link
            href="/costs"
            className={`flex items-center h-20 px-2 transition-all hover:text-secondary ${
              isActive('/costs') ? 'text-primary border-b-2 border-secondary font-bold' : 'text-primary/70'
            }`}
          >
            Costs
          </Link>
          <button
            onClick={onApply}
            className="group inline-flex items-center gap-1.5 bg-secondary text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-secondary/90 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> Apply
          </button>
          <Link
            href="/blog"
            className={`flex items-center h-20 px-2 transition-all hover:text-secondary ${
              isActive('/blog') ? 'text-primary border-b-2 border-secondary font-bold' : 'text-primary/70'
            }`}
          >
            Blog
          </Link>
          <a className="text-primary/70 hover:text-secondary transition-colors px-2" href="https://www.gov.uk/contact-ukvi-inside-outside-uk" target="_blank" rel="noopener noreferrer">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-primary hover:text-secondary transition-all" aria-label="Account">
            <UserCircle2 className="w-6 h-6" />
          </button>
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden text-primary"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-surface border-t border-primary/10"
          >
            <div className="px-8 py-4 flex flex-col divide-y divide-outline-variant/20">
              {[
                { href: '/visa-types', label: 'Visa Types' },
                { href: '/visa-types', label: 'Requirements' },
                { href: '/eligibility', label: 'Eligibility' },
                { href: '/costs', label: 'Costs' },
                { href: '/blog', label: 'Blog' },
              ].map((l, i) => (
                <Link
                  key={`${l.href}-${i}`}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-left py-4 font-bold text-sm ${isActive(l.href) ? 'text-secondary' : 'text-primary'}`}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => { onApply(); setMobileOpen(false); }}
                className="py-4 font-bold text-sm text-secondary flex items-center justify-between"
              >
                Apply (Guided) <FileCheck2 className="w-4 h-4" />
              </button>
              <a
                href="https://www.gov.uk/apply-to-come-to-the-uk"
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 font-bold text-sm text-primary flex items-center justify-between"
                onClick={() => setMobileOpen(false)}
              >
                GOV.UK direct <ExternalLink className="w-4 h-4 text-secondary" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
