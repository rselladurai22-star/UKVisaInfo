'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, LayoutGrid, Rocket,
  History, Calculator, Search, Scale, Compass, BookOpen, Sparkles, ArrowUpRight,
  FileText, Tag, Crown, ShieldCheck, Globe, Flag, RefreshCw, Home as HomeIcon,
  ChevronDown, ChevronLeft, ArrowRight, Menu, X,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
interface NavItem   { href: string; label: string; desc?: string; icon: React.ComponentType<{ className?: string }>; accent?: string }
interface NavColumn { heading: string; items: NavItem[] }
interface NavSection {
  id: string; label: string; emoji: string;
  columns: NavColumn[];
  feature?: { title: string; desc: string; href: string; cta: string }
}

const SECTIONS: NavSection[] = [
  {
    id: 'visas', label: 'Visas', emoji: '🛂',
    columns: [
      { heading: 'Work', items: [
        { href: '/visa/skilled-worker',     label: 'Skilled Worker',     desc: 'Sponsored employment',   icon: Briefcase,   accent: '#d9152b' },
        { href: '/visa/health',             label: 'Health & Care',      desc: 'NHS and care roles',     icon: Stethoscope, accent: '#059669' },
        { href: '/visa/talent',             label: 'Global Talent',      desc: 'Leaders & researchers',  icon: LayoutGrid,  accent: '#d97706' },
        { href: '/visa/innovator-founder',  label: 'Innovator Founder',  desc: 'Startup founders',       icon: Rocket,      accent: '#e11d48' },
      ]},
      { heading: 'Study & Family', items: [
        { href: '/visa/student',   label: 'Student',          desc: 'Degree-level study',    icon: GraduationCap, accent: '#2563eb' },
        { href: '/visa/graduate',  label: 'Graduate',         desc: '18 months post-study',  icon: History,       accent: '#0d9488' },
        { href: '/visa/family',    label: 'Family / Spouse',  desc: 'Join settled partner',  icon: Users,         accent: '#7c3aed' },
        { href: '/visa/visitor',   label: 'Standard Visitor', desc: 'Up to 6 months',        icon: Plane,         accent: '#0891b2' },
      ]},
    ],
    feature: { title: 'Browse all 10+ visa routes', desc: 'Full directory with fees, processing times and direct gov.uk links.', href: '/visa-types', cta: 'Visa directory' },
  },
  {
    id: 'settlement', label: 'Settlement', emoji: '🏡',
    columns: [
      { heading: 'Stay long-term', items: [
        { href: '/visa/ilr',            label: 'Indefinite Leave to Remain', desc: 'Permanent settlement after 5 years', icon: ShieldCheck, accent: '#059669' },
        { href: '/visa/citizenship',    label: 'British Citizenship',        desc: 'Naturalisation after ILR',          icon: Crown,       accent: '#d97706' },
        { href: '/visa/long-residence', label: '10-year long residence',     desc: 'Alternative ILR route',             icon: HomeIcon,    accent: '#7c3aed' },
      ]},
      { heading: 'Special routes', items: [
        { href: '/visa/euss',     label: 'EU Settlement Scheme', desc: 'For EU/EEA nationals',              icon: Globe,   accent: '#2563eb' },
        { href: '/visa/bno',      label: 'Hong Kong BNO visa',   desc: 'British National Overseas',         icon: Flag,    accent: '#d9152b' },
        { href: '/visa/ancestry', label: 'UK Ancestry visa',     desc: 'Commonwealth + UK grandparent',     icon: History, accent: '#0d9488' },
      ]},
    ],
    feature: { title: 'Settle in the UK', desc: 'Routes to permanent residence and British citizenship, with fees and timelines.', href: '/blog/uk-ilr-indefinite-leave-to-remain-2026-requirements', cta: 'ILR & citizenship guide' },
  },
  {
    id: 'switching', label: 'Switch', emoji: '🔄',
    columns: [
      { heading: 'Common switching paths', items: [
        { href: '/blog/switch-student-to-skilled-worker-visa-uk-2026',          label: 'Student → Skilled Worker', desc: 'New-entrant £30,960 rate applies', icon: RefreshCw, accent: '#d9152b' },
        { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed',               label: 'Graduate → Skilled Worker',desc: '18-month bridge window',           icon: RefreshCw, accent: '#0d9488' },
        { href: '/blog/uk-ilr-indefinite-leave-to-remain-2026-requirements',   label: 'Skilled Worker → ILR',     desc: 'After 5 years continuous',         icon: RefreshCw, accent: '#059669' },
      ]},
      { heading: 'Check eligibility', items: [
        { href: '/tools/salary-checker', label: 'Will my salary qualify?', desc: 'New-entrant + going rate check', icon: Briefcase, accent: '#d9152b' },
        { href: '/tools/compare',        label: 'Compare routes',          desc: 'Side-by-side analysis',          icon: Scale,     accent: '#059669' },
        { href: '/eligibility',          label: 'Eligibility quiz',        desc: '60-second match',                icon: Compass,   accent: '#7c3aed' },
      ]},
    ],
    feature: { title: 'Switch visa routes', desc: 'Plan a clean move between Student, Graduate, Skilled Worker and Family routes.', href: '/blog/switch-student-to-skilled-worker-visa-uk-2026', cta: 'Switching guide' },
  },
  {
    id: 'tools', label: 'Tools', emoji: '⚡',
    columns: [
      { heading: 'Calculators & Search', items: [
        { href: '/tools/salary-checker',  label: 'Salary checker',   desc: 'Check SOC code threshold',   icon: Briefcase,  accent: '#d9152b' },
        { href: '/tools/sponsor-search',  label: 'Sponsor search',   desc: 'Find licensed employers',    icon: Search,     accent: '#2563eb' },
        { href: '/tools/cost-calculator', label: 'Cost calculator',  desc: 'Fees + IHS + dependants',    icon: Calculator, accent: '#7c3aed' },
        { href: '/tools/compare',         label: 'Visa comparison',  desc: 'Side-by-side analysis',      icon: Scale,      accent: '#059669' },
      ]},
      { heading: 'Guides', items: [
        { href: '/eligibility', label: 'Eligibility quiz', desc: '60-second match',    icon: Compass, accent: '#d9152b' },
        { href: '/costs',       label: 'Quick cost view',  desc: 'Simple fee overview', icon: Tag,     accent: '#0d9488' },
      ]},
    ],
    feature: { title: 'All tools in one place', desc: 'Free interactive calculators and searches built from official Home Office data.', href: '/tools', cta: 'Open tools hub' },
  },
  {
    id: 'guides', label: 'Guides', emoji: '📖',
    columns: [
      { heading: 'Most read', items: [
        { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',        label: 'Salary thresholds 2026', desc: 'Full SOC code breakdown', icon: Briefcase, accent: '#d9152b' },
        { href: '/blog/uk-family-visa-minimum-income-2026-what-counts',      label: 'Family visa £29,000',    desc: 'What income counts',      icon: Users,     accent: '#7c3aed' },
        { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',         label: 'eVisa migration',        desc: 'Beat the deadline',       icon: ShieldCheck,accent: '#d9152b' },
        { href: '/blog/uk-visitor-visa-refused-top-reasons-2026',            label: 'Visit visa refused',     desc: 'How to reapply',          icon: FileText,  accent: '#0891b2' },
      ]},
      { heading: 'New & trending', items: [
        { href: '/blog/uk-citizenship-10-year-long-residence-2026',              label: '10-year long residence', desc: 'Path to citizenship',     icon: Crown,         accent: '#d97706' },
        { href: '/blog/bringing-parents-to-uk-adult-dependent-relative-2026',    label: 'Bringing parents',       desc: 'Adult Dependent Relative',icon: Users,         accent: '#7c3aed' },
        { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026',      label: 'Find a sponsor',         desc: 'Practical search guide',  icon: Search,        accent: '#2563eb' },
        { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed',                 label: 'Graduate visa',          desc: 'No sponsor needed',       icon: GraduationCap, accent: '#0d9488' },
      ]},
    ],
    feature: { title: '19 in-depth guides', desc: 'Plain-English long-form articles on every major UK visa route. Updated for 2026.', href: '/blog', cta: 'All articles' },
  },
];

const LOGO = (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
    <path d="M1 7L8 1.5L15 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2.5" y="7" width="2"   height="5.5" rx="0.5" fill="white"/>
    <rect x="6"   y="7" width="2"   height="5.5" rx="0.5" fill="white"/>
    <rect x="9.5" y="7" width="2"   height="5.5" rx="0.5" fill="white"/>
    <rect x="1"   y="12.5" width="14" height="1.5" rx="0.5" fill="#ffbf47"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   HEADER ROOT
───────────────────────────────────────────────────────────── */
export default function Header({ onApply }: { onApply: () => void }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeId,   setActiveId]     = useState<string | null>(null);
  const [scrolled,   setScrolled]     = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close on route change */
  useEffect(() => { setMobileOpen(false); setActiveId(null); }, [pathname]);

  /* lock scroll when mobile open */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  /* ESC */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setActiveId(null); setMobileOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* click-outside desktop mega */
  useEffect(() => {
    if (!activeId) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setActiveId(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [activeId]);

  const open  = useCallback((id: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setActiveId(id); }, []);
  const close = useCallback(() => { closeTimer.current = setTimeout(() => setActiveId(null), 80); }, []);
  const keepOpen = useCallback(() => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const sectionActive = (s: NavSection) =>
    s.columns.some((c) => c.items.some((i) => pathname.startsWith(i.href)));

  return (
    <>
      {/* ══════════ NAV BAR ══════════ */}
      <header
        ref={panelRef}
        className={`
          fixed top-0 inset-x-0 z-50
          transition-[background,box-shadow] duration-200
          ${scrolled
            ? 'bg-white/96 backdrop-blur-2xl shadow-[0_1px_0_rgba(14,20,36,0.08),0_4px_24px_rgba(14,20,36,0.06)]'
            : 'bg-white/80 backdrop-blur-xl'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[62px] md:h-[68px] flex items-center gap-6">

          {/* Brand */}
          <Link href="/" aria-label="UK Visa Info — home" className="flex items-center gap-2.5 flex-shrink-0 group">
            <span className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#c9112a] to-[#8b001d] flex items-center justify-center shadow-[0_2px_8px_rgba(217,21,43,0.32)] group-hover:shadow-[0_4px_14px_rgba(217,21,43,0.45)] transition-shadow">
              {LOGO}
            </span>
            <span className="font-display font-bold text-[15px] tracking-tight text-[#0a1530]">
              UK Visa <span className="text-[#d9152b]">Info</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">
            {SECTIONS.map((s) => {
              const isActive = sectionActive(s) || activeId === s.id;
              return (
                <div
                  key={s.id}
                  className="relative"
                  onMouseEnter={() => open(s.id)}
                  onMouseLeave={close}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(activeId === s.id ? null : s.id)}
                    aria-expanded={activeId === s.id}
                    className={`
                      relative flex items-center gap-1 px-3 py-2 text-[13.5px] font-medium rounded-lg
                      transition-colors duration-100 select-none outline-none
                      ${isActive
                        ? 'text-[#0a1530]'
                        : 'text-[#52596e] hover:text-[#0a1530]'}
                    `}
                  >
                    {/* active underline */}
                    <span
                      className={`
                        absolute inset-x-1.5 bottom-0.5 h-[2px] rounded-full bg-[#d9152b]
                        transition-all duration-200 origin-left
                        ${sectionActive(s) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
                      `}
                    />
                    {s.label}
                    <ChevronDown
                      className={`w-3 h-3 mt-px transition-transform duration-150 ${activeId === s.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              );
            })}
            <Link
              href="/eligibility"
              className={`
                px-3 py-2 text-[13.5px] font-medium rounded-lg transition-colors duration-100
                ${pathname === '/eligibility' ? 'text-[#0a1530]' : 'text-[#52596e] hover:text-[#0a1530]'}
              `}
            >
              Eligibility
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onApply}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#d9152b] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#b8101f] active:scale-[0.97] transition-all shadow-[0_1px_4px_rgba(217,21,43,0.28)] hover:shadow-[0_4px_12px_rgba(217,21,43,0.35)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply now
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[rgba(14,20,36,0.06)] transition-colors"
            >
              <Menu className="w-[18px] h-[18px] text-[#0a1530]" />
            </button>
          </div>
        </div>

        {/* ── Desktop mega menu ── */}
        {SECTIONS.map((s) => (
          <DesktopMegaMenu
            key={s.id}
            section={s}
            open={activeId === s.id}
            onMouseEnter={keepOpen}
            onMouseLeave={close}
            onClose={() => setActiveId(null)}
          />
        ))}
      </header>

      {/* ── Desktop backdrop ── */}
      <div
        className={`
          fixed inset-0 top-[62px] md:top-[68px] z-40 hidden lg:block
          bg-[rgba(10,21,48,0.12)] backdrop-blur-[2px]
          transition-opacity duration-150
          ${activeId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setActiveId(null)}
        aria-hidden="true"
      />

      {/* ══════════ MOBILE DRAWER ══════════ */}
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden
          bg-[rgba(10,21,48,0.5)] backdrop-blur-sm
          transition-opacity duration-200
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onApply={() => { onApply(); setMobileOpen(false); }}
        pathname={pathname}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   DESKTOP MEGA MENU
   Uses CSS opacity+transform (GPU only — no layout thrash)
───────────────────────────────────────────────────────────── */
function DesktopMegaMenu({
  section, open, onMouseEnter, onMouseLeave, onClose,
}: {
  section: NavSection; open: boolean;
  onMouseEnter: () => void; onMouseLeave: () => void; onClose: () => void;
}) {
  return (
    <div
      className={`
        absolute left-0 right-0 top-full hidden lg:block
        transition-all duration-[120ms] ease-out origin-top
        ${open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none'}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white border-t border-[rgba(14,20,36,0.07)] shadow-[0_24px_60px_-8px_rgba(10,21,48,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-8">

          {/* Columns */}
          {section.columns.map((col, ci) => (
            <div key={col.heading} className="col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a0a8b8] mb-3 px-3">
                {col.heading}
              </p>
              <ul className="space-y-0.5">
                {col.items.map((item, ii) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f4f6fb] transition-colors duration-100"
                      style={{ transitionDelay: open ? `${(ci * 4 + ii) * 12}ms` : '0ms' }}
                    >
                      <span
                        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-100 group-hover:scale-[1.08]"
                        style={{ background: `${item.accent ?? '#0a1530'}14`, color: item.accent ?? '#0a1530' }}
                      >
                        <item.icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold text-[#0a1530] leading-snug truncate">
                          {item.label}
                        </div>
                        {item.desc && (
                          <div className="text-[11.5px] text-[#8892a4] leading-snug">
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

          {/* Feature card */}
          {section.feature && (
            <div className="col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a0a8b8] mb-3 px-3">
                Quick start
              </p>
              <Link
                href={section.feature.href}
                onClick={onClose}
                className="group block hero-dark rounded-2xl p-6 text-white relative overflow-hidden h-full min-h-[188px]"
              >
                <div className="dot-pattern absolute inset-0 opacity-25 pointer-events-none" aria-hidden="true" />
                <div className="relative z-10 flex flex-col h-full">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#ffbf47] mb-3">
                    <BookOpen className="w-3 h-3" />
                    {section.label}
                  </span>
                  <h4 className="font-display font-bold text-lg leading-tight flex-1">
                    {section.feature.title}
                  </h4>
                  <p className="mt-2 text-[12px] text-white/50 leading-relaxed">
                    {section.feature.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[#ffbf47] text-sm font-bold group-hover:gap-2.5 transition-all duration-150">
                    {section.feature.cta}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOBILE DRAWER — Stack navigation
   Main view → tap section → drill into items (slide in/out)
   Accordion uses CSS grid trick (no height animation, no JS measurement)
───────────────────────────────────────────────────────────── */
function MobileDrawer({
  open, onClose, onApply, pathname,
}: {
  open: boolean; onClose: () => void; onApply: () => void; pathname: string;
}) {
  const [drillId, setDrillId] = useState<string | null>(null);
  const section = drillId ? SECTIONS.find((s) => s.id === drillId) : null;

  /* reset drill on close */
  useEffect(() => { if (!open) setTimeout(() => setDrillId(null), 300); }, [open]);

  return (
    <aside
      className={`
        fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-[400px] lg:hidden
        flex flex-col overflow-hidden
        bg-white shadow-[-8px_0_40px_rgba(10,21,48,0.18)]
        transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
    >
      {/* ── Drawer header ── */}
      <div className="flex items-center justify-between px-5 h-[62px] border-b border-[rgba(14,20,36,0.07)] flex-shrink-0">
        {section ? (
          <button
            type="button"
            onClick={() => setDrillId(null)}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#0a1530] -ml-1 px-2 py-1.5 rounded-lg hover:bg-[rgba(14,20,36,0.04)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#52596e]" />
            Back
          </button>
        ) : (
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="w-[30px] h-[30px] rounded-[8px] bg-gradient-to-br from-[#c9112a] to-[#8b001d] flex items-center justify-center">
              {LOGO}
            </span>
            <span className="font-display font-bold text-[14px] tracking-tight text-[#0a1530]">
              UK Visa <span className="text-[#d9152b]">Info</span>
            </span>
          </Link>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgba(14,20,36,0.06)] transition-colors"
        >
          <X className="w-4 h-4 text-[#0a1530]" />
        </button>
      </div>

      {/* ── Panel body — two views slide horizontally ── */}
      <div className="relative flex-1 overflow-hidden">

        {/* ─ Root view ─ */}
        <div
          className={`
            absolute inset-0 overflow-y-auto flex flex-col
            transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${drillId ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          <nav className="px-3 py-3 space-y-0.5 flex-1">
            {SECTIONS.map((s) => {
              const active = s.columns.some((c) => c.items.some((i) => pathname.startsWith(i.href)));
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setDrillId(s.id)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left
                    transition-colors duration-100
                    ${active ? 'bg-[rgba(217,21,43,0.06)] text-[#d9152b]' : 'text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)]'}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="text-lg w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: active ? 'rgba(217,21,43,0.08)' : 'rgba(14,20,36,0.05)' }}
                    >
                      {s.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold leading-snug">{s.label}</div>
                      <div className="text-[11.5px] text-[#8892a4] leading-snug truncate">
                        {s.columns.flatMap((c) => c.items).length} topics
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#c4cad6] flex-shrink-0" />
                </button>
              );
            })}

            {/* Static links */}
            <div className="mt-1 pt-3 border-t border-[rgba(14,20,36,0.06)] space-y-0.5">
              {[
                { href: '/eligibility', label: 'Eligibility quiz', icon: Compass },
                { href: '/blog',        label: 'All guides',       icon: BookOpen },
                { href: '/about',       label: 'About',            icon: Globe },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-[#52596e] hover:text-[#0a1530] hover:bg-[rgba(14,20,36,0.04)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* ─ Drill view ─ */}
        <div
          className={`
            absolute inset-0 overflow-y-auto
            transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${drillId ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {section && (
            <div className="px-4 py-4">
              {/* Section headline */}
              <div className="mb-5 flex items-center gap-3">
                <span className="text-2xl w-11 h-11 rounded-xl bg-[rgba(217,21,43,0.07)] flex items-center justify-center">
                  {section.emoji}
                </span>
                <div>
                  <div className="text-[16px] font-bold text-[#0a1530]">{section.label}</div>
                  {section.feature && (
                    <div className="text-[12px] text-[#8892a4]">{section.feature.title}</div>
                  )}
                </div>
              </div>

              {/* Columns as inline groups */}
              {section.columns.map((col) => (
                <div key={col.heading} className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a0a8b8] mb-2 px-1">
                    {col.heading}
                  </p>
                  <ul className="space-y-0.5">
                    {col.items.map((item) => {
                      const active = pathname.startsWith(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={`
                              flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-100
                              ${active ? 'bg-[rgba(217,21,43,0.07)]' : 'hover:bg-[rgba(14,20,36,0.04)]'}
                            `}
                          >
                            <span
                              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ background: `${item.accent ?? '#0a1530'}14`, color: item.accent ?? '#0a1530' }}
                            >
                              <item.icon className="w-3.5 h-3.5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[13.5px] font-semibold leading-snug ${active ? 'text-[#d9152b]' : 'text-[#0a1530]'}`}>
                                {item.label}
                              </div>
                              {item.desc && (
                                <div className="text-[11.5px] text-[#8892a4]">{item.desc}</div>
                              )}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#c4cad6] flex-shrink-0" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Feature card */}
              {section.feature && (
                <Link
                  href={section.feature.href}
                  onClick={onClose}
                  className="group block hero-dark rounded-2xl p-5 text-white relative overflow-hidden mt-2"
                >
                  <div className="dot-pattern absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#ffbf47] mb-2">
                      <Sparkles className="w-3 h-3" />
                      Quick start
                    </div>
                    <div className="font-display font-bold text-[15px] leading-snug mb-1">
                      {section.feature.title}
                    </div>
                    <div className="text-[11.5px] text-white/50 leading-relaxed mb-3">
                      {section.feature.desc}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[#ffbf47] text-[12.5px] font-bold group-hover:gap-2.5 transition-all duration-150">
                      {section.feature.cta} <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Drawer footer CTA ── */}
      <div className="p-4 border-t border-[rgba(14,20,36,0.07)] flex-shrink-0">
        <button
          type="button"
          onClick={onApply}
          className="w-full bg-[#d9152b] text-white font-bold py-3.5 rounded-xl text-[13.5px] hover:bg-[#b8101f] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(217,21,43,0.28)]"
        >
          <Sparkles className="w-4 h-4" />
          Start guided apply
        </button>
      </div>
    </aside>
  );
}
