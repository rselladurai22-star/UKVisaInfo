'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, ChevronDown, ChevronRight, Briefcase, GraduationCap, Plane, Users,
  Stethoscope, LayoutGrid, Rocket, History, Calculator, Search, Scale, Compass,
  BookOpen, Sparkles, ArrowUpRight, FileText, Tag, Crown, ShieldCheck,
  Globe, Flag, RefreshCw, Home as HomeIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOGO_ICON = (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
    <path d="M1 7L8 1.5L15 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2.5" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="6" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="9.5" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="1" y="12.5" width="14" height="1.5" rx="0.5" fill="#ffbf47"/>
  </svg>
);

// ───────── Mega-menu data ─────────

interface MegaItem {
  href: string;
  label: string;
  desc?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}
interface MegaColumn {
  heading: string;
  items: MegaItem[];
}
interface MegaSection {
  id: string;
  label: string;
  columns: MegaColumn[];
  feature?: { title: string; desc: string; href: string; cta: string };
}

const MEGA: MegaSection[] = [
  {
    id: 'visas',
    label: 'Visas',
    columns: [
      {
        heading: 'Work',
        items: [
          { href: '/visa/skilled-worker', label: 'Skilled Worker', desc: 'Sponsored employment', icon: Briefcase, accent: '#d9152b' },
          { href: '/visa/health', label: 'Health & Care', desc: 'NHS and care roles', icon: Stethoscope, accent: '#059669' },
          { href: '/visa/talent', label: 'Global Talent', desc: 'Leaders & researchers', icon: LayoutGrid, accent: '#d97706' },
          { href: '/visa/innovator-founder', label: 'Innovator Founder', desc: 'Startup founders', icon: Rocket, accent: '#e11d48' },
        ],
      },
      {
        heading: 'Study & Family',
        items: [
          { href: '/visa/student', label: 'Student', desc: 'Degree-level study', icon: GraduationCap, accent: '#2563eb' },
          { href: '/visa/graduate', label: 'Graduate', desc: '18 months post-study', icon: History, accent: '#0d9488' },
          { href: '/visa/family', label: 'Family / Spouse', desc: 'Join settled partner', icon: Users, accent: '#7c3aed' },
          { href: '/visa/visitor', label: 'Standard Visitor', desc: 'Up to 6 months', icon: Plane, accent: '#0891b2' },
        ],
      },
    ],
    feature: {
      title: 'Browse all 10+ visa routes',
      desc: 'Full directory with fees, processing times and direct gov.uk links.',
      href: '/visa-types',
      cta: 'Visa directory',
    },
  },
  {
    id: 'settlement',
    label: 'Settlement',
    columns: [
      {
        heading: 'Stay long-term',
        items: [
          { href: '/visa/ilr', label: 'Indefinite Leave to Remain', desc: 'Permanent settlement after 5 years', icon: ShieldCheck, accent: '#059669' },
          { href: '/visa/citizenship', label: 'British Citizenship', desc: 'Naturalisation after ILR', icon: Crown, accent: '#d97706' },
          { href: '/visa/long-residence', label: '10-year long residence', desc: 'Alternative ILR route', icon: HomeIcon, accent: '#7c3aed' },
        ],
      },
      {
        heading: 'Special routes',
        items: [
          { href: '/visa/euss', label: 'EU Settlement Scheme', desc: 'For EU/EEA nationals', icon: Globe, accent: '#2563eb' },
          { href: '/visa/bno', label: 'Hong Kong BNO visa', desc: 'British National Overseas', icon: Flag, accent: '#d9152b' },
          { href: '/visa/ancestry', label: 'UK Ancestry visa', desc: 'Commonwealth + UK grandparent', icon: History, accent: '#0d9488' },
        ],
      },
    ],
    feature: {
      title: 'Settle in the UK',
      desc: 'Routes to permanent residence and British citizenship, with fees and timelines.',
      href: '/blog/uk-ilr-indefinite-leave-to-remain-2026-requirements',
      cta: 'ILR & citizenship guide',
    },
  },
  {
    id: 'switching',
    label: 'Switch',
    columns: [
      {
        heading: 'Common switching paths',
        items: [
          { href: '/blog/switch-student-to-skilled-worker-visa-uk-2026', label: 'Student → Skilled Worker', desc: 'New-entrant £30,960 rate applies', icon: RefreshCw, accent: '#d9152b' },
          { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed', label: 'Graduate → Skilled Worker', desc: '18-month bridge window', icon: RefreshCw, accent: '#0d9488' },
          { href: '/blog/uk-ilr-indefinite-leave-to-remain-2026-requirements', label: 'Skilled Worker → ILR', desc: 'After 5 years continuous', icon: RefreshCw, accent: '#059669' },
        ],
      },
      {
        heading: 'Tools to check eligibility',
        items: [
          { href: '/tools/salary-checker', label: 'Will my salary qualify?', desc: 'New-entrant + going rate check', icon: Briefcase, accent: '#d9152b' },
          { href: '/tools/compare', label: 'Compare routes', desc: 'Side-by-side analysis', icon: Scale, accent: '#059669' },
          { href: '/eligibility', label: 'Eligibility quiz', desc: '60-second match', icon: Compass, accent: '#d9152b' },
        ],
      },
    ],
    feature: {
      title: 'Switch visa routes',
      desc: 'Plan a clean move between Student, Graduate, Skilled Worker and Family routes.',
      href: '/blog/switch-student-to-skilled-worker-visa-uk-2026',
      cta: 'Switching guide',
    },
  },
  {
    id: 'tools',
    label: 'Tools',
    columns: [
      {
        heading: 'Calculators & Search',
        items: [
          { href: '/tools/salary-checker', label: 'Salary checker', desc: 'Check SOC code threshold', icon: Briefcase, accent: '#d9152b' },
          { href: '/tools/sponsor-search', label: 'Sponsor search', desc: 'Find licensed employers', icon: Search, accent: '#2563eb' },
          { href: '/tools/cost-calculator', label: 'Cost calculator', desc: 'Fees + IHS + dependants', icon: Calculator, accent: '#7c3aed' },
          { href: '/tools/compare', label: 'Visa comparison', desc: 'Side-by-side analysis', icon: Scale, accent: '#059669' },
        ],
      },
      {
        heading: 'Guides',
        items: [
          { href: '/eligibility', label: 'Eligibility quiz', desc: '60-second match', icon: Compass, accent: '#d9152b' },
          { href: '/costs', label: 'Quick cost view', desc: 'Simple fee overview', icon: Tag, accent: '#0d9488' },
        ],
      },
    ],
    feature: {
      title: 'All tools in one place',
      desc: 'Free interactive calculators and searches built from official Home Office data.',
      href: '/tools',
      cta: 'Open tools hub',
    },
  },
  {
    id: 'guides',
    label: 'Guides',
    columns: [
      {
        heading: 'Most read',
        items: [
          { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026', label: 'Salary thresholds 2026', desc: 'Full SOC code breakdown', icon: Briefcase, accent: '#d9152b' },
          { href: '/blog/uk-family-visa-minimum-income-2026-what-counts', label: 'Family visa £29,000', desc: 'What income counts', icon: Users, accent: '#7c3aed' },
          { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate', label: 'eVisa migration', desc: 'Beat the deadline', icon: ShieldCheck, accent: '#d9152b' },
          { href: '/blog/uk-visitor-visa-refused-top-reasons-2026', label: 'Visit visa refused', desc: 'How to reapply', icon: FileText, accent: '#0891b2' },
        ],
      },
      {
        heading: 'New & trending',
        items: [
          { href: '/blog/uk-citizenship-10-year-long-residence-2026', label: '10-year long residence', desc: 'Path to citizenship', icon: Crown, accent: '#d97706' },
          { href: '/blog/bringing-parents-to-uk-adult-dependent-relative-2026', label: 'Bringing parents', desc: 'Adult Dependent Relative', icon: Users, accent: '#7c3aed' },
          { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026', label: 'Find a sponsor', desc: 'Practical search guide', icon: Search, accent: '#2563eb' },
          { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed', label: 'Graduate visa', desc: 'No sponsor needed', icon: GraduationCap, accent: '#0d9488' },
        ],
      },
    ],
    feature: {
      title: '19 in-depth guides',
      desc: 'Plain-English long-form articles on every major UK visa route. Updated for 2026.',
      href: '/blog',
      cta: 'All articles',
    },
  },
];

const STATIC_LINKS = [
  { href: '/eligibility', label: 'Eligibility' },
];

export default function Header({ onApply }: { onApply: () => void }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMega(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // ESC closes mega menu
  useEffect(() => {
    if (!openMega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMega(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMega]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const sectionIsActive = (s: MegaSection) =>
    s.columns.some((c) => c.items.some((i) => isActive(i.href))) ||
    (s.feature && isActive(s.feature.href));

  const openMegaHover = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMega(id);
  };
  const closeMegaHover = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    // Short grace period only — lets cursor traverse the gap between
    // trigger and panel without flicker, but doesn't feel sticky.
    closeTimer.current = setTimeout(() => setOpenMega(null), 60);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(14,20,36,0.09)]'
            : 'bg-white/88 backdrop-blur-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[62px] md:h-[70px] flex items-center justify-between gap-4">
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

          {/* Desktop mega-menu nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {MEGA.map((s) => (
              <div
                key={s.id}
                className="relative"
                onMouseEnter={() => openMegaHover(s.id)}
                onMouseLeave={closeMegaHover}
              >
                <button
                  type="button"
                  onClick={() => setOpenMega(openMega === s.id ? null : s.id)}
                  aria-expanded={openMega === s.id}
                  className={`inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    sectionIsActive(s) || openMega === s.id
                      ? 'text-[#0a1530] bg-[rgba(14,20,36,0.05)]'
                      : 'text-[#52596e] hover:text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)]'
                  }`}
                >
                  {s.label}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      openMega === s.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
            {STATIC_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(l.href)
                    ? 'text-[#0a1530] bg-[rgba(14,20,36,0.05)]'
                    : 'text-[#52596e] hover:text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)]'
                }`}
              >
                {l.label}
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
              <Sparkles className="w-3.5 h-3.5" />
              Apply
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-[rgba(14,20,36,0.06)] transition-colors"
            >
              {mobileOpen
                ? <X className="w-[18px] h-[18px] text-[#0a1530]" />
                : <Menu className="w-[18px] h-[18px] text-[#0a1530]" />
              }
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        <AnimatePresence>
          {openMega && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full hidden lg:block"
              onMouseEnter={() => openMegaHover(openMega)}
              onMouseLeave={closeMegaHover}
            >
              <MegaPanel
                section={MEGA.find((s) => s.id === openMega)!}
                onLinkClick={() => setOpenMega(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop for mega menu */}
      <AnimatePresence>
        {openMega && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 top-[62px] md:top-[70px] z-30 bg-[rgba(10,21,48,0.18)] backdrop-blur-[2px] hidden lg:block"
            onClick={() => setOpenMega(null)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ───────── Mobile drawer ───────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-[rgba(10,21,48,0.45)] backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-[380px] bg-white lg:hidden flex flex-col shadow-[-4px_0_32px_rgba(10,21,48,0.15)]"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-[62px] border-b border-[rgba(14,20,36,0.08)] flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#c9112a] to-[#8b001d] flex items-center justify-center">
                    {LOGO_ICON}
                  </span>
                  <span className="font-display font-bold text-sm text-[#0a1530]">
                    UK Visa <span className="text-[#d9152b]">Info</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgba(14,20,36,0.06)] transition-colors"
                >
                  <X className="w-4 h-4 text-[#0a1530]" />
                </button>
              </div>

              {/* Sections */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {MEGA.map((s) => (
                  <MobileSection key={s.id} section={s} onClose={() => setMobileOpen(false)} pathname={pathname} />
                ))}
                {STATIC_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive(l.href)
                        ? 'bg-[rgba(217,21,43,0.07)] text-[#d9152b]'
                        : 'text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Compass className="w-4 h-4 text-[#d9152b]" />
                      {l.label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-35" />
                  </Link>
                ))}

                <div className="pt-3 mt-3 border-t border-[rgba(14,20,36,0.07)] space-y-0.5">
                  {[
                    { href: '/about', label: 'About' },
                    { href: '/privacy', label: 'Privacy' },
                    { href: '/terms', label: 'Terms' },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block px-4 py-2.5 text-sm text-[#52596e] hover:text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)] rounded-xl transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Apply CTA */}
              <div className="p-4 border-t border-[rgba(14,20,36,0.08)] flex-shrink-0">
                <button
                  type="button"
                  onClick={() => { onApply(); setMobileOpen(false); }}
                  className="w-full bg-[#d9152b] text-white font-bold py-3.5 rounded-xl text-sm hover:bg-[#b8101f] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
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

// ───────── Mega menu panel (desktop) ─────────

function MegaPanel({
  section,
  onLinkClick,
}: {
  section: MegaSection;
  onLinkClick: () => void;
}) {
  return (
    <div className="bg-white border-t border-[rgba(14,20,36,0.08)] shadow-[0_24px_48px_-12px_rgba(10,21,48,0.18)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-8">
        {section.columns.map((col) => (
          <div key={col.heading} className="col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a8195] mb-3">
              {col.heading}
            </h3>
            <ul className="space-y-1">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onLinkClick}
                    className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f3f5fb] transition-colors"
                  >
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        background: `${item.accent ?? '#0a1530'}12`,
                        color: item.accent ?? '#0a1530',
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#0a1530] leading-snug">
                        {item.label}
                      </div>
                      {item.desc && (
                        <div className="text-xs text-[#7a8195] mt-0.5 leading-snug">
                          {item.desc}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {section.feature && (
          <div className="col-span-4">
            <div className="hero-dark rounded-2xl p-6 text-white h-full flex flex-col justify-between min-h-[180px] relative overflow-hidden">
              <div className="dot-pattern absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#ffbf47]">
                  <BookOpen className="w-3 h-3" />
                  Quick start
                </span>
                <h4 className="mt-3 font-display font-bold text-lg leading-tight">
                  {section.feature.title}
                </h4>
                <p className="mt-1.5 text-xs text-white/55 leading-relaxed">
                  {section.feature.desc}
                </p>
              </div>
              <Link
                href={section.feature.href}
                onClick={onLinkClick}
                className="relative z-10 mt-4 inline-flex items-center gap-1.5 text-[#ffbf47] text-sm font-bold group/cta"
              >
                {section.feature.cta}
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────── Mobile section (collapsible accordion) ─────────

function MobileSection({
  section,
  onClose,
  pathname,
}: {
  section: MegaSection;
  onClose: () => void;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);

  const sectionIsActive =
    section.columns.some((c) => c.items.some((i) => pathname.startsWith(i.href))) ||
    (section.feature && pathname.startsWith(section.feature.href));

  return (
    <div className="border border-[rgba(14,20,36,0.06)] rounded-xl overflow-hidden mb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
          sectionIsActive
            ? 'bg-[rgba(217,21,43,0.07)] text-[#d9152b]'
            : 'text-[#0a1530] hover:bg-[rgba(14,20,36,0.03)]'
        }`}
      >
        {section.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-3 pt-1 bg-[#fafbfc] space-y-3">
              {section.columns.map((col) => (
                <div key={col.heading}>
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7a8195] px-3 mt-2 mb-1">
                    {col.heading}
                  </h4>
                  <ul>
                    {col.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white transition-colors"
                        >
                          <span
                            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              background: `${item.accent ?? '#0a1530'}12`,
                              color: item.accent ?? '#0a1530',
                            }}
                          >
                            <item.icon className="w-3.5 h-3.5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#0a1530] leading-snug">
                              {item.label}
                            </div>
                            {item.desc && (
                              <div className="text-[11px] text-[#7a8195] leading-snug">
                                {item.desc}
                              </div>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {section.feature && (
                <Link
                  href={section.feature.href}
                  onClick={onClose}
                  className="block mx-2 mt-2 hero-dark rounded-xl p-4 text-white"
                >
                  <div className="font-display font-bold text-sm leading-tight">
                    {section.feature.title}
                  </div>
                  <div className="mt-1 text-[11px] text-white/55 leading-snug">
                    {section.feature.desc}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#ffbf47]">
                    {section.feature.cta} <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
