'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, LayoutGrid, Rocket,
  History, Calculator, Search, Scale, Compass, Sparkles, ArrowUpRight,
  FileText, Tag, Crown, ShieldCheck, Globe, Flag, RefreshCw, Home as HomeIcon,
  ChevronLeft, ArrowRight, Menu, X, BookOpen, MapPin, Building2, Newspaper,
  ListChecks, FileSearch, TrendingUp,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   NAV DATA
───────────────────────────────────────────── */
type Icon = React.ComponentType<{ className?: string }>;
interface Item   { href: string; label: string; desc?: string; icon: Icon; accent?: string }
interface Column { heading: string; items: Item[] }
interface Section {
  id: string; label: string; emoji: string;
  columns: Column[];
  feature: { title: string; desc: string; href: string; cta: string };
}

const SECTIONS: Section[] = [
  {
    id: 'visas', label: 'Visas', emoji: '🛂',
    columns: [
      { heading: 'Work', items: [
        { href: '/visa/skilled-worker',    label: 'Skilled Worker',    desc: 'Sponsored employment',  icon: Briefcase,   accent: '#d9152b' },
        { href: '/visa/health',            label: 'Health & Care',     desc: 'NHS and care roles',    icon: Stethoscope, accent: '#059669' },
        { href: '/visa/talent',            label: 'Global Talent',     desc: 'Leaders & researchers', icon: LayoutGrid,  accent: '#d97706' },
        { href: '/visa/innovator-founder', label: 'Innovator Founder', desc: 'Startup founders',      icon: Rocket,      accent: '#e11d48' },
      ]},
      { heading: 'Study & Family', items: [
        { href: '/visa/student',  label: 'Student',          desc: 'Degree-level study',   icon: GraduationCap, accent: '#2563eb' },
        { href: '/visa/graduate', label: 'Graduate',         desc: '18 months post-study', icon: History,       accent: '#0d9488' },
        { href: '/visa/family',   label: 'Family / Spouse',  desc: 'Join settled partner', icon: Users,         accent: '#7c3aed' },
        { href: '/visa/visitor',  label: 'Standard Visitor', desc: 'Up to 6 months',       icon: Plane,         accent: '#0891b2' },
      ]},
    ],
    feature: { title: 'All 10+ visa routes', desc: 'Full directory with fees, processing times and direct gov.uk links.', href: '/visa-types', cta: 'Visa directory' },
  },
  {
    id: 'settlement', label: 'Settlement', emoji: '🏡',
    columns: [
      { heading: 'Stay long-term', items: [
        { href: '/visa/ilr',            label: 'Indefinite Leave to Remain', desc: 'Permanent settlement after 5 years', icon: ShieldCheck, accent: '#059669' },
        { href: '/visa/citizenship',    label: 'British Citizenship',        desc: 'Naturalisation after ILR',           icon: Crown,       accent: '#d97706' },
        { href: '/visa/long-residence', label: '10-year long residence',     desc: 'Alternative ILR route',              icon: HomeIcon,    accent: '#7c3aed' },
      ]},
      { heading: 'Special routes', items: [
        { href: '/visa/euss',     label: 'EU Settlement Scheme', desc: 'For EU/EEA nationals',          icon: Globe,   accent: '#2563eb' },
        { href: '/visa/bno',      label: 'Hong Kong BNO',        desc: 'British National Overseas',     icon: Flag,    accent: '#d9152b' },
        { href: '/visa/ancestry', label: 'UK Ancestry visa',     desc: 'Commonwealth + UK grandparent', icon: History, accent: '#0d9488' },
      ]},
    ],
    feature: { title: 'Compare all 6 settlement routes', desc: 'Side-by-side fees, time-to-ILR and English requirements — all verified against gov.uk.', href: '/settlement', cta: 'Settlement comparison hub' },
  },
  {
    id: 'switching', label: 'Switch', emoji: '🔄',
    columns: [
      { heading: 'Switching paths', items: [
        { href: '/blog/switch-student-to-skilled-worker-visa-uk-2026',        label: 'Student → Skilled Worker',  desc: 'New-entrant £33,400 rate',   icon: RefreshCw, accent: '#d9152b' },
        { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed',              label: 'Graduate → Skilled Worker', desc: '18-month bridge window',    icon: RefreshCw, accent: '#0d9488' },
        { href: '/blog/uk-ilr-indefinite-leave-to-remain-2026-requirements', label: 'Skilled Worker → ILR',      desc: 'After 5 years continuous',  icon: RefreshCw, accent: '#059669' },
      ]},
      { heading: 'Check eligibility', items: [
        { href: '/tools/salary-checker', label: 'Will my salary qualify?', desc: 'SOC code threshold check', icon: Briefcase, accent: '#d9152b' },
        { href: '/tools/compare',        label: 'Compare routes',          desc: 'Side-by-side analysis',    icon: Scale,     accent: '#059669' },
        { href: '/eligibility',          label: 'Eligibility quiz',        desc: '60-second match',          icon: Compass,   accent: '#7c3aed' },
      ]},
    ],
    feature: { title: 'Switch visa routes', desc: 'Plan a clean move between Student, Graduate, Skilled Worker and Family.', href: '/blog/switch-student-to-skilled-worker-visa-uk-2026', cta: 'Switching guide' },
  },
  {
    id: 'tools', label: 'Tools', emoji: '⚡',
    columns: [
      { heading: 'Calculators & Search', items: [
        { href: '/tools/salary-checker',    label: 'Salary checker',    desc: 'SOC code threshold',     icon: Briefcase,  accent: '#d9152b' },
        { href: '/tools/sponsor-search',    label: 'Sponsor search',    desc: 'Find licensed employers', icon: Search,     accent: '#2563eb' },
        { href: '/tools/cost-calculator',   label: 'Cost calculator',   desc: 'Fees + IHS + dependants', icon: Calculator, accent: '#7c3aed' },
        { href: '/tools/compare',           label: 'Visa comparison',   desc: 'Side-by-side analysis',   icon: Scale,      accent: '#059669' },
      ]},
      { heading: 'Personal & analysis', items: [
        { href: '/tools/refusal-analyzer',  label: 'Refusal analyzer',  desc: 'Decode your refusal letter', icon: FileSearch, accent: '#e11d48' },
        { href: '/my-journey',              label: 'My visa journey',   desc: 'Save your plan locally',     icon: ListChecks, accent: '#10b981' },
        { href: '/eligibility',             label: 'Eligibility quiz',  desc: '60-second match',            icon: Compass,    accent: '#d9152b' },
        { href: '/salary',                  label: 'Salary by SOC code', desc: 'All 270 occupations',       icon: TrendingUp, accent: '#d97706' },
      ]},
    ],
    feature: { title: 'All tools in one place', desc: 'Free interactive calculators and searches built from official data.', href: '/tools', cta: 'Open tools hub' },
  },
  {
    id: 'explore', label: 'Explore', emoji: '🗺️',
    columns: [
      { heading: 'By your country', items: [
        { href: '/from/india',       label: 'From India 🇮🇳',       desc: 'Top source country',     icon: Globe,    accent: '#d9152b' },
        { href: '/from/nigeria',     label: 'From Nigeria 🇳🇬',     desc: 'NHS + Skilled Worker',   icon: Globe,    accent: '#059669' },
        { href: '/from/pakistan',    label: 'From Pakistan 🇵🇰',    desc: 'Study + Family',         icon: Globe,    accent: '#0d9488' },
        { href: '/from',             label: 'All country guides',    desc: '8 countries covered',    icon: Flag,     accent: '#2563eb' },
      ]},
      { heading: 'By UK city + sponsor', items: [
        { href: '/uk-cities/london',     label: 'Living in London',      desc: 'Cost + sectors + areas', icon: MapPin,    accent: '#d9152b' },
        { href: '/uk-cities/manchester', label: 'Living in Manchester',  desc: 'Tech + media hub',       icon: MapPin,    accent: '#0891b2' },
        { href: '/sponsors/sector/technology', label: 'Tech sponsors',   desc: 'By sector',              icon: Building2, accent: '#2563eb' },
        { href: '/sponsors/sector/healthcare', label: 'Healthcare sponsors', desc: 'NHS trusts + care',   icon: Stethoscope, accent: '#059669' },
      ]},
    ],
    feature: { title: 'Personalised by origin & destination', desc: 'Country guides, UK city briefs and sponsor directories — all cross-linked.', href: '/uk-cities', cta: 'Browse city guides' },
  },
  {
    id: 'guides', label: 'Guides', emoji: '📖',
    columns: [
      { heading: 'Most read', items: [
        { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',   label: 'Salary thresholds 2026', desc: 'Full SOC breakdown', icon: Briefcase,  accent: '#d9152b' },
        { href: '/blog/uk-family-visa-minimum-income-2026-what-counts', label: 'Family visa £29,000',    desc: 'What income counts', icon: Users,      accent: '#7c3aed' },
        { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',    label: 'eVisa migration',        desc: 'Beat the deadline',  icon: ShieldCheck,accent: '#d9152b' },
        { href: '/blog/uk-visitor-visa-refused-top-reasons-2026',       label: 'Visit visa refused',     desc: 'How to reapply',     icon: FileText,   accent: '#0891b2' },
      ]},
      { heading: 'News & guides', items: [
        { href: '/news',                                                      label: 'Latest UK visa news',    desc: 'Rule + fee updates',      icon: Newspaper,     accent: '#d9152b' },
        { href: '/blog/uk-citizenship-10-year-long-residence-2026',           label: '10-year long residence', desc: 'Path to citizenship',     icon: Crown,         accent: '#d97706' },
        { href: '/blog/bringing-parents-to-uk-adult-dependent-relative-2026', label: 'Bringing parents',       desc: 'Adult Dependent Relative',icon: Users,         accent: '#7c3aed' },
        { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed',              label: 'Graduate visa',          desc: 'No sponsor needed',       icon: GraduationCap, accent: '#0d9488' },
      ]},
    ],
    feature: { title: '19 in-depth guides', desc: 'Long-form articles on every major UK visa route. Updated for 2026.', href: '/blog', cta: 'All articles' },
  },
];

const LOGO = (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
    <path d="M1 7L8 1.5L15 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2.5" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="6"   y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="9.5" y="7" width="2" height="5.5" rx="0.5" fill="white"/>
    <rect x="1"   y="12.5" width="14" height="1.5" rx="0.5" fill="#ffbf47"/>
  </svg>
);

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
export default function Header({ onApply }: { onApply: () => void }) {
  const pathname = usePathname();
  const [openId, setOpenId]         = useState<string | null>(null);
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpenId(null); setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpenId(null); setMobileOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Instant-open, grace-close hover */
  const handleOpen = useCallback((id: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpenId(id);
  }, []);

  const handleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenId(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const sectionActive = (s: Section) =>
    s.columns.some((c) => c.items.some((i) => pathname.startsWith(i.href)));

  const active = openId ? SECTIONS.find((s) => s.id === openId)! : null;

  return (
    <>
      <header
        className={`
          fixed top-0 inset-x-0 z-50 transition-shadow duration-200
          ${scrolled ? 'bg-white shadow-[0_1px_0_rgba(14,20,36,0.08)]' : 'bg-white'}
        `}
        onMouseLeave={handleClose}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] md:h-[64px] flex items-center gap-6">

          {/* Brand */}
          <Link href="/" aria-label="UK Visa Info — home" className="flex items-center gap-2.5 flex-shrink-0 group">
            <span className="w-[32px] h-[32px] rounded-[9px] bg-gradient-to-br from-[#c9112a] to-[#8b001d] flex items-center justify-center shadow-[0_2px_6px_rgba(217,21,43,0.3)]">
              {LOGO}
            </span>
            <span className="font-display font-bold text-[15px] tracking-tight text-[#0a1530]">
              UK Visa <span className="text-[#d9152b]">Info</span>
            </span>
          </Link>

          {/* Desktop nav — pill buttons */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {SECTIONS.map((s) => {
              const isOpen   = openId === s.id;
              const isActive = sectionActive(s);
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseEnter={() => handleOpen(s.id)}
                  onFocus={() => handleOpen(s.id)}
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                  aria-expanded={isOpen}
                  className={`
                    relative h-9 px-3.5 text-[13.5px] font-semibold rounded-full
                    transition-colors duration-75 select-none outline-none
                    ${isOpen
                      ? 'bg-[#0a1530] text-white'
                      : isActive
                        ? 'text-[#d9152b] hover:bg-[rgba(217,21,43,0.08)]'
                        : 'text-[#52596e] hover:text-[#0a1530] hover:bg-[#f3f5fb]'}
                  `}
                >
                  {s.label}
                  {/* page-active dot */}
                  {isActive && !isOpen && (
                    <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#d9152b]" />
                  )}
                </button>
              );
            })}
            <Link
              href="/eligibility"
              className={`
                h-9 px-3.5 text-[13.5px] font-semibold rounded-full flex items-center
                transition-colors duration-75
                ${pathname.startsWith('/eligibility')
                  ? 'text-[#d9152b] hover:bg-[rgba(217,21,43,0.08)]'
                  : 'text-[#52596e] hover:text-[#0a1530] hover:bg-[#f3f5fb]'}
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
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#d9152b] text-white text-[13px] font-semibold h-9 px-4 rounded-full hover:bg-[#b8101f] active:scale-[0.97] transition-[background,transform] duration-100"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply now
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f3f5fb] transition-colors duration-75"
            >
              <Menu className="w-[18px] h-[18px] text-[#0a1530]" />
            </button>
          </div>
        </div>

        {/* ─── SINGLE shared mega panel ─── */}
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={handleClose}
          className={`
            absolute left-0 right-0 top-full hidden lg:block
            transition-[opacity,transform] duration-100 ease-out
            ${openId
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-1 pointer-events-none'}
          `}
        >
          {active && (
            <div className="bg-white border-t border-[rgba(14,20,36,0.07)] shadow-[0_24px_60px_-12px_rgba(10,21,48,0.22)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 grid grid-cols-12 gap-7">

                {active.columns.map((col) => (
                  <div key={col.heading} className="col-span-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-2.5 px-2.5">
                      {col.heading}
                    </p>
                    <ul>
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpenId(null)}
                            className="group flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#f4f6fb] transition-colors duration-75"
                          >
                            <span
                              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                              style={{ background: `${item.accent ?? '#0a1530'}14`, color: item.accent ?? '#0a1530' }}
                            >
                              <item.icon className="w-[15px] h-[15px]" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13.5px] font-semibold text-[#0a1530] leading-tight">
                                {item.label}
                              </div>
                              {item.desc && (
                                <div className="text-[11.5px] text-[#8892a4] mt-0.5 leading-tight">
                                  {item.desc}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#cfd5e0] opacity-0 group-hover:opacity-100 transition-opacity duration-75 flex-shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="col-span-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-2.5 px-2.5">
                    Quick start
                  </p>
                  <Link
                    href={active.feature.href}
                    onClick={() => setOpenId(null)}
                    className="group block rounded-2xl p-6 text-white relative overflow-hidden h-[calc(100%-22px)] min-h-[200px] bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63]"
                  >
                    <div className="absolute inset-0 opacity-[0.18] pointer-events-none" aria-hidden="true"
                      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,191,71,0.55) 1px, transparent 0)', backgroundSize: '14px 14px' }}
                    />
                    <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-[#d9152b]/22 blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#ffbf47] mb-3">
                        <BookOpen className="w-3 h-3" />
                        {active.label}
                      </span>
                      <h4 className="font-display font-bold text-[19px] leading-tight">
                        {active.feature.title}
                      </h4>
                      <p className="mt-1.5 text-[12.5px] text-white/55 leading-relaxed flex-1">
                        {active.feature.desc}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[#ffbf47] text-[13px] font-bold group-hover:gap-2.5 transition-[gap] duration-100">
                        {active.feature.cta}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Subtle backdrop tint when mega open (no blur — instant) */}
      <div
        className={`
          fixed inset-0 top-[60px] md:top-[64px] z-40 hidden lg:block
          bg-[rgba(10,21,48,0.10)]
          transition-opacity duration-150
          ${openId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setOpenId(null)}
        aria-hidden="true"
      />

      {/* MOBILE drawer */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden bg-[rgba(10,21,48,0.5)]
          transition-opacity duration-200
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onApply={() => { onApply(); setMobileOpen(false); }}
        pathname={pathname}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   MOBILE DRAWER — stack navigation, CSS-only animation
───────────────────────────────────────────── */
function MobileDrawer({
  open, onClose, onApply, pathname,
}: {
  open: boolean; onClose: () => void; onApply: () => void; pathname: string;
}) {
  const [drillId, setDrillId] = useState<string | null>(null);
  const section = drillId ? SECTIONS.find((s) => s.id === drillId) ?? null : null;

  useEffect(() => { if (!open) setTimeout(() => setDrillId(null), 280); }, [open]);

  return (
    <aside
      className={`
        fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-[400px] lg:hidden
        flex flex-col overflow-hidden bg-white shadow-[-8px_0_40px_rgba(10,21,48,0.18)]
        transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${open ? 'translate-x-0' : 'translate-x-full'}
      `}
      role="dialog" aria-modal="true" aria-label="Main navigation"
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 h-[60px] border-b border-[rgba(14,20,36,0.07)] flex-shrink-0">
        {section ? (
          <button
            type="button"
            onClick={() => setDrillId(null)}
            className="flex items-center gap-1 text-[14px] font-semibold text-[#0a1530] -ml-1 px-2 h-8 rounded-lg hover:bg-[#f3f5fb] transition-colors duration-75"
          >
            <ChevronLeft className="w-4 h-4 text-[#52596e]" />
            Back
          </button>
        ) : (
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="w-[28px] h-[28px] rounded-[8px] bg-gradient-to-br from-[#c9112a] to-[#8b001d] flex items-center justify-center">{LOGO}</span>
            <span className="font-display font-bold text-[14px] tracking-tight text-[#0a1530]">
              UK Visa <span className="text-[#d9152b]">Info</span>
            </span>
          </Link>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f3f5fb] transition-colors duration-75"
        >
          <X className="w-4 h-4 text-[#0a1530]" />
        </button>
      </div>

      {/* body — two sliding views */}
      <div className="relative flex-1 overflow-hidden">
        {/* ROOT view */}
        <div
          className={`
            absolute inset-0 overflow-y-auto
            transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${drillId ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          <div className="px-3 py-3">
            {SECTIONS.map((s) => {
              const active = s.columns.some((c) => c.items.some((i) => pathname.startsWith(i.href)));
              const itemCount = s.columns.flatMap((c) => c.items).length;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setDrillId(s.id)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-3 py-3 rounded-2xl text-left mb-1
                    transition-colors duration-75 active:bg-[#eef1f8]
                    ${active ? 'bg-[rgba(217,21,43,0.06)]' : 'hover:bg-[#f3f5fb]'}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="text-[20px] w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: active ? 'rgba(217,21,43,0.10)' : '#f3f5fb' }}
                    >
                      {s.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className={`text-[14.5px] font-bold leading-tight ${active ? 'text-[#d9152b]' : 'text-[#0a1530]'}`}>
                        {s.label}
                      </div>
                      <div className="text-[11.5px] text-[#8892a4] mt-0.5">{itemCount} topics</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#c4cad6] flex-shrink-0" />
                </button>
              );
            })}

            <div className="mt-3 pt-3 border-t border-[rgba(14,20,36,0.06)]">
              {[
                { href: '/eligibility', label: 'Eligibility quiz', icon: Compass },
                { href: '/blog',        label: 'All guides',       icon: BookOpen },
                { href: '/about',       label: 'About',            icon: Globe },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#52596e] hover:text-[#0a1530] hover:bg-[#f3f5fb] transition-colors duration-75"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* DRILL view */}
        <div
          className={`
            absolute inset-0 overflow-y-auto
            transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${drillId ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {section && (
            <div className="px-4 py-4">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[22px] w-11 h-11 rounded-2xl bg-[rgba(217,21,43,0.08)] flex items-center justify-center">
                  {section.emoji}
                </span>
                <div>
                  <div className="text-[17px] font-bold text-[#0a1530] leading-tight">{section.label}</div>
                  <div className="text-[12px] text-[#8892a4]">{section.feature.title}</div>
                </div>
              </div>

              {section.columns.map((col) => (
                <div key={col.heading} className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa3b8] mb-1.5 px-1">
                    {col.heading}
                  </p>
                  <ul>
                    {col.items.map((item) => {
                      const active = pathname.startsWith(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={`
                              flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors duration-75
                              ${active ? 'bg-[rgba(217,21,43,0.07)]' : 'hover:bg-[#f3f5fb]'}
                            `}
                          >
                            <span
                              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                              style={{ background: `${item.accent ?? '#0a1530'}14`, color: item.accent ?? '#0a1530' }}
                            >
                              <item.icon className="w-[15px] h-[15px]" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[13.5px] font-semibold leading-tight ${active ? 'text-[#d9152b]' : 'text-[#0a1530]'}`}>
                                {item.label}
                              </div>
                              {item.desc && (
                                <div className="text-[11.5px] text-[#8892a4] mt-0.5">{item.desc}</div>
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

              <Link
                href={section.feature.href}
                onClick={onClose}
                className="group block rounded-2xl p-5 text-white relative overflow-hidden mt-2 bg-gradient-to-br from-[#0a1530] via-[#13204a] to-[#1c2c63]"
              >
                <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-[#d9152b]/25 blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#ffbf47] mb-2">
                    <Sparkles className="w-3 h-3" />
                    Quick start
                  </div>
                  <div className="font-display font-bold text-[15.5px] leading-tight mb-1.5">
                    {section.feature.title}
                  </div>
                  <div className="text-[11.5px] text-white/55 leading-relaxed mb-3">
                    {section.feature.desc}
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[#ffbf47] text-[12.5px] font-bold group-hover:gap-2.5 transition-[gap] duration-100">
                    {section.feature.cta} <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="p-4 border-t border-[rgba(14,20,36,0.07)] flex-shrink-0">
        <button
          type="button"
          onClick={onApply}
          className="w-full bg-[#d9152b] text-white font-bold py-3.5 rounded-2xl text-[13.5px] hover:bg-[#b8101f] active:scale-[0.98] transition-all duration-100 inline-flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(217,21,43,0.28)]"
        >
          <Sparkles className="w-4 h-4" />
          Start guided apply
        </button>
      </div>
    </aside>
  );
}
