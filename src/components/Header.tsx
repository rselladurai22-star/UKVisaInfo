'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase, GraduationCap, Plane, Users, Stethoscope, LayoutGrid, Rocket,
  History, Calculator, Search, Scale, Compass, Sparkles, ArrowUpRight,
  FileText, Tag, Crown, ShieldCheck, Globe, Flag, RefreshCw, Home as HomeIcon,
  ChevronLeft, ArrowRight, Menu, X, BookOpen, MapPin, Building2, Newspaper,
  ListChecks, FileSearch, TrendingUp, ChevronDown, Banknote,
  Percent, Calendar, Car, Zap,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   NAV DATA
───────────────────────────────────────────── */
type Icon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
interface Item   { href: string; label: string; desc?: string; icon: Icon; accent?: string }
interface Column { heading: string; items: Item[] }
interface Section {
  id: string; label: string;
  columns: Column[];
  feature: { title: string; desc: string; href: string; cta: string };
}

type NavItem =
  | { kind: 'link';     id: string; label: string; href: string; icon?: Icon; primary?: boolean; accent?: boolean }
  | { kind: 'dropdown'; id: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { kind: 'dropdown', id: 'tools',    label: 'Tools' },
  { kind: 'link',     id: 'visas',    label: 'Visas',     href: '/visa-types', icon: Plane },
  { kind: 'link',     id: 'postcode', label: 'Postcode',  href: '/postcode',   icon: MapPin },
  { kind: 'dropdown', id: 'guides',   label: 'Guides' },
  { kind: 'link',     id: 'about',    label: 'About',     href: '/about' },
];

const SECTIONS: Section[] = [
  {
    id: 'settlement', label: 'Settlement',
    columns: [
      { heading: 'Stay long-term', items: [
        { href: '/visa/ilr',            label: 'ILR (Settlement)',         desc: 'Permanent settlement after 5 years', icon: ShieldCheck, accent: '#00A89A' },
        { href: '/visa/citizenship',    label: 'British Citizenship',      desc: 'Naturalisation after ILR',           icon: Crown,       accent: '#C9A14A' },
        { href: '/visa/long-residence', label: '10-year long residence',   desc: 'Alternative ILR route',              icon: HomeIcon,    accent: '#13325F' },
      ]},
      { heading: 'Special routes', items: [
        { href: '/visa/euss',     label: 'EU Settlement Scheme', desc: 'For EU/EEA nationals',          icon: Globe,   accent: '#0A2540' },
        { href: '/visa/bno',      label: 'Hong Kong BNO',        desc: 'British National Overseas',     icon: Flag,    accent: '#00C4B4' },
        { href: '/visa/ancestry', label: 'UK Ancestry visa',     desc: 'Commonwealth + UK grandparent', icon: History, accent: '#007F76' },
      ]},
    ],
    feature: { title: 'Compare all 6 settlement routes', desc: 'Side-by-side fees, time-to-ILR and English requirements — all verified against gov.uk.', href: '/settlement', cta: 'Settlement hub' },
  },
  {
    id: 'switch', label: 'Switch Visa',
    columns: [
      { heading: 'From Student', items: [
        { href: '/visa/skilled-worker',                            label: 'Student → Skilled Worker', desc: 'After graduation with CoS',   icon: Briefcase,     accent: '#00C4B4' },
        { href: '/visa/graduate',                                  label: 'Student → Graduate',       desc: '2 yrs, no sponsor needed',    icon: GraduationCap, accent: '#007F76' },
        { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed',   label: 'Graduate → Skilled Worker', desc: 'Find a sponsor in 2 years',  icon: RefreshCw,     accent: '#00C4B4' },
      ]},
      { heading: 'From Work or Family', items: [
        { href: '/visa/family',                            label: 'Visitor → Family / Spouse',   desc: 'In rare cases · usually go home', icon: Users,       accent: '#13325F' },
        { href: '/visa/ilr',                               label: 'Work / Family → ILR',         desc: 'Settle after 5 qualifying years', icon: ShieldCheck, accent: '#00A89A' },
        { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate', label: 'BRP → eVisa migration', desc: 'Move your status online',        icon: Globe,       accent: '#0A2540' },
      ]},
    ],
    feature: { title: 'Can I switch visa inside the UK?', desc: 'Check eligibility rules, fees and timing before changing your immigration status. Always verify with gov.uk.', href: '/eligibility', cta: 'Check eligibility' },
  },
  {
    id: 'tools', label: 'Tools',
    columns: [
      { heading: 'Money & Tax', items: [
        { href: '/take-home-pay',     label: 'Take-home pay',      desc: 'PAYE + NI + student loan',     icon: Banknote,   accent: '#00C4B4' },
        { href: '/tax-code',          label: 'Tax code decoder',   desc: '1257L · K475 · BR · D0',       icon: FileText,   accent: '#0A2540' },
        { href: '/vat-calculator',    label: 'VAT calculator',     desc: 'Add or remove 20% / 5% / 0%',   icon: Percent,    accent: '#0EA5E9' },
        { href: '/salary-compare',    label: 'Salary comparison',  desc: 'City ↔ city equivalent gross', icon: Scale,      accent: '#10B981' },
        { href: '/cgt-calculator',    label: 'Capital Gains Tax',  desc: '£3,000 AEA · 18% / 24%',        icon: Calculator, accent: '#C9A14A' },
        { href: '/holiday-pay',       label: 'Holiday pay',        desc: '5.6 weeks · 12.07% rule',       icon: Calendar,   accent: '#00A89A' },
      ]},
      { heading: 'Property, Vehicle & Life', items: [
        { href: '/mortgage-affordability', label: 'Mortgage affordability', desc: 'Max borrow + stress test',  icon: HomeIcon,   accent: '#C9A14A' },
        { href: '/stamp-duty-calculator',  label: 'Stamp duty',             desc: 'SDLT 2026 + FTB relief',    icon: Tag,        accent: '#2563EB' },
        { href: '/council-tax-band',       label: 'Council tax band',       desc: 'All 8 bands by postcode',   icon: Building2,  accent: '#0A2540' },
        { href: '/postcode',               label: 'Postcode lookup',        desc: 'Council, MP, NHS, police',  icon: MapPin,     accent: '#7C3AED' },
        { href: '/ulez-check',             label: 'ULEZ & CAZ checker',     desc: 'Is your car compliant?',    icon: Car,        accent: '#E11D48' },
        { href: '/energy-bill',            label: 'Energy bill',            desc: 'Ofgem cap quarterly',       icon: Zap,        accent: '#F59E0B' },
      ]},
    ],
    feature: { title: 'All free, all the time', desc: 'Verified against gov.uk, HMRC and ONS. No signup, no email harvesting, no ads in your face.', href: '/tools', cta: 'Open all tools' },
  },
  {
    id: 'explore', label: 'Explore',
    columns: [
      { heading: 'By your country', items: [
        { href: '/from/india',   label: 'From India',    desc: 'Top source country',   icon: Globe, accent: '#00C4B4' },
        { href: '/from/nigeria', label: 'From Nigeria',  desc: 'NHS + Skilled Worker', icon: Globe, accent: '#00A89A' },
        { href: '/from/pakistan',label: 'From Pakistan', desc: 'Study + Family',       icon: Globe, accent: '#007F76' },
        { href: '/from',         label: 'All countries', desc: '8 countries covered',  icon: Flag,  accent: '#0A2540' },
      ]},
      { heading: 'By UK city & sector', items: [
        { href: '/uk-cities/london',           label: 'London',              desc: 'Cost + sectors + areas', icon: MapPin,     accent: '#00C4B4' },
        { href: '/uk-cities/manchester',       label: 'Manchester',          desc: 'Tech + media hub',       icon: MapPin,     accent: '#00C4B4' },
        { href: '/sponsors/sector/technology', label: 'Tech sponsors',       desc: 'Hiring now',             icon: Building2,  accent: '#0A2540' },
        { href: '/sponsors/sector/healthcare', label: 'Healthcare sponsors', desc: 'NHS trusts + care',      icon: Stethoscope,accent: '#00A89A' },
      ]},
    ],
    feature: { title: 'Personalised by country & city', desc: 'Country guides, UK city briefs and sponsor directories — all cross-linked.', href: '/uk-cities', cta: 'Browse city guides' },
  },
  {
    id: 'guides', label: 'Guides',
    columns: [
      { heading: 'Most read', items: [
        { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',   label: 'Salary thresholds 2026', desc: 'Full SOC breakdown', icon: Briefcase,   accent: '#00C4B4' },
        { href: '/blog/uk-family-visa-minimum-income-2026-what-counts', label: 'Family visa £29,000',    desc: 'What income counts', icon: Users,       accent: '#13325F' },
        { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',    label: 'eVisa migration guide',  desc: 'Beat the deadline',  icon: ShieldCheck, accent: '#00C4B4' },
        { href: '/blog/uk-visitor-visa-refused-top-reasons-2026',       label: 'Visitor visa refusals',  desc: 'How to reapply',     icon: FileText,    accent: '#00C4B4' },
      ]},
      { heading: 'News & in-depth', items: [
        { href: '/news',                                                      label: 'Latest visa news',       desc: 'Rule + fee updates',       icon: Newspaper,     accent: '#00C4B4' },
        { href: '/blog/uk-citizenship-10-year-long-residence-2026',           label: '10-year long residence', desc: 'Path to citizenship',      icon: Crown,         accent: '#C9A14A' },
        { href: '/blog/bringing-parents-to-uk-adult-dependent-relative-2026', label: 'Bringing parents to UK', desc: 'Adult Dependent Relative', icon: Users,         accent: '#13325F' },
        { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed',              label: 'Graduate visa',          desc: 'No sponsor needed',        icon: GraduationCap, accent: '#007F76' },
      ]},
    ],
    feature: { title: '19 in-depth guides', desc: 'Long-form articles on every major UK visa route. Updated for 2026.', href: '/blog', cta: 'All articles' },
  },
];

/**
 * UKDesk logo — app-launcher tile grid (2×2).
 * Reads as: "this is a hub of tools", with one tile lit in teal as the accent.
 * The mark sits on a navy chip; the wordmark "UKDesk" follows.
 */
/* ─────────────────────────────────────────────
   CONTEXTUAL NAVIGATION — visa + guides sections
───────────────────────────────────────────── */
const VISA_NAV = [
  { label: 'Visa Hub',    href: '/visa-types',            icon: Plane },
  { label: 'Settlement',  href: '/settlement',            icon: ShieldCheck },
  { label: 'Eligibility', href: '/eligibility',           icon: ListChecks },
  { label: 'Calculator',  href: '/tools/cost-calculator', icon: Calculator },
  { label: 'Countries',   href: '/from',                  icon: Globe },
  { label: 'Sponsors',    href: '/sponsors',              icon: Building2 },
];

const VISA_ROOTS = ['/visa-types', '/visa/', '/settlement', '/eligibility', '/from', '/sponsors'];
function isVisaPage(p: string) {
  return VISA_ROOTS.some((r) => p === r || p.startsWith(r + '/') || p.startsWith(r + '?'));
}

/**
 * UKDesk logo mark — 4-point compass star.
 * North/South: teal  East/West: white  Center: gold
 * Reads as: navigation, guidance, direction through UK life.
 */
const LOGO_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {/* N/S points — teal */}
    <path d="M12 3 L15.2 11 L12 9.4 L8.8 11 Z" fill="#00C4B4"/>
    <path d="M12 21 L8.8 13 L12 14.6 L15.2 13 Z" fill="#00C4B4"/>
    {/* E/W points — white */}
    <path d="M21 12 L13 8.8 L14.6 12 L13 15.2 Z" fill="rgba(255,255,255,0.82)"/>
    <path d="M3 12 L11 15.2 L9.4 12 L11 8.8 Z" fill="rgba(255,255,255,0.82)"/>
    {/* Center jewel — gold */}
    <circle cx="12" cy="12" r="2" fill="#C9A14A"/>
  </svg>
);

const Brand = ({ onClick }: { onClick?: () => void }) => (
  <Link href="/" aria-label="UKDesk — home" className="flex items-center gap-2.5 flex-shrink-0" onClick={onClick}>
    <span
      className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
      style={{
        background: 'linear-gradient(145deg, #0D2D4F 0%, #06192E 100%)',
        boxShadow: '0 2px 10px rgba(10,37,64,0.4), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1.5px rgba(0,196,180,0.32)',
      }}>
      {LOGO_SVG}
    </span>
    <span className="font-display font-bold tracking-[-0.02em] text-[#0A2540] leading-none" style={{ fontSize: '17px', letterSpacing: '-0.02em' }}>
      UK<span style={{ color: '#00C4B4' }}>Desk</span>
    </span>
  </Link>
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
    const fn = () => setScrolled(window.scrollY > 6);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpenId(null); setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpenId(null); setMobileOpen(false); } };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const open = useCallback((id: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpenId(id);
  }, []);

  const startClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenId(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const isPageInSection = (s: Section) =>
    s.columns.some((c) => c.items.some((i) => pathname.startsWith(i.href)));

  const active = openId ? SECTIONS.find((s) => s.id === openId) ?? null : null;

  return (
    <>
      {/* ═══ HEADER BAR ═══════════════════════════════════════════════ */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-200"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,1)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(10,37,64,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 20px -4px rgba(10,37,64,0.10)' : 'none',
        }}
        onMouseLeave={startClose}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 h-[62px] md:h-[66px] flex items-center gap-2">

          <Brand />

          {/* ── Desktop nav — full OR minimal on visa sub-site ── */}
          {isVisaPage(pathname) ? (
            /* On visa pages: header is logo-only. The visa hub owns all its own nav. */
            <nav className="hidden lg:flex items-center flex-1 ml-5" aria-label="Visa page back link">
              <span className="flex-1" />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-medium transition-all duration-100"
                style={{ color: '#5A6478', fontFamily: 'Inter,sans-serif' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(10,37,64,0.05)'; e.currentTarget.style.color = '#0A2540'; }}
                onMouseOut={(e)  => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5A6478'; }}
              >
                ← All tools
              </Link>
            </nav>
          ) : (
            /* ── FULL GLOBAL NAV ── */
            <nav className="hidden lg:flex items-center gap-1 flex-1 ml-4" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => {
                if (item.kind === 'link') {
                  const Icon       = item.icon;
                  const isOnPage   = pathname.startsWith(item.href);
                  if (item.primary) {
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onMouseEnter={() => setOpenId(null)}
                        className="relative inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-semibold transition-all duration-100"
                        style={{
                          background: 'linear-gradient(135deg, #00C4B4 0%, #00A89A 100%)',
                          color: '#fff',
                          boxShadow: '0 2px 10px -2px rgba(0,196,180,0.45)',
                        }}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {item.label}
                      </Link>
                    );
                  }
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onMouseEnter={() => setOpenId(null)}
                      className="relative inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13.5px] font-medium transition-all duration-100"
                      style={{
                        background: isOnPage ? 'rgba(201,161,74,0.10)' : 'transparent',
                        color: isOnPage ? '#C9A14A' : '#374151',
                      }}
                      onMouseOver={(e) => { if (!isOnPage) e.currentTarget.style.background = 'rgba(10,37,64,0.04)'; }}
                      onMouseOut={(e)  => { if (!isOnPage) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" style={{ color: isOnPage ? '#C9A14A' : '#5A6478' }} />}
                      {item.label}
                      {isOnPage && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#C9A14A' }} />
                      )}
                    </Link>
                  );
                }
                const s = SECTIONS.find((x) => x.id === item.id);
                if (!s) return null;
                const isOpen   = openId === s.id;
                const isActive = isPageInSection(s);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onMouseEnter={() => open(s.id)}
                    onFocus={() => open(s.id)}
                    onClick={() => setOpenId(isOpen ? null : s.id)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className="relative h-9 px-3 rounded-lg text-[13.5px] font-medium transition-all duration-100 select-none outline-none inline-flex items-center gap-1"
                    style={{
                      background: isOpen ? '#0A2540' : 'transparent',
                      color: isOpen ? '#fff' : isActive ? '#00C4B4' : '#374151',
                      fontWeight: isOpen ? 600 : 500,
                    }}
                    onMouseOver={(e) => { if (!isOpen) e.currentTarget.style.background = 'rgba(10,37,64,0.04)'; }}
                    onMouseOut={(e)  => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {s.label}
                    <ChevronDown
                      className="w-3 h-3 transition-transform duration-150"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.55 }}
                    />
                    {isActive && !isOpen && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#00C4B4' }} />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Subtle "Get matched in 60s" hint on desktop (links to eligibility) */}
            <Link
              href="/news"
              className="hidden xl:inline-flex items-center gap-1.5 h-9 px-3 text-[12.5px] font-medium rounded-lg transition-colors duration-100"
              style={{
                color: pathname.startsWith('/news') ? '#0A2540' : '#5A6478',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(10,37,64,0.04)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Newspaper className="w-3.5 h-3.5" />
              News
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-100 hover:bg-gray-100"
            >
              <Menu className="w-[18px] h-[18px] text-[#0A2540]" />
            </button>
          </div>
        </div>

        {/* ── MEGA PANEL — only on full-nav pages ── */}
        {!isVisaPage(pathname) && <div
          onMouseEnter={cancelClose}
          onMouseLeave={startClose}
          className="absolute left-0 right-0 top-full hidden lg:block pointer-events-none"
          style={{
            opacity: openId ? 1 : 0,
            transform: openId ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 120ms ease, transform 120ms ease',
            pointerEvents: openId ? 'auto' : 'none',
          }}
        >
          {active && (
            <div
              className="overflow-hidden"
              style={{
                background: '#fff',
                borderTop: '1px solid rgba(10,37,64,0.07)',
                boxShadow: '0 24px 60px -8px rgba(10,37,64,0.18), 0 8px 20px -8px rgba(10,37,64,0.10)',
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-12 gap-6">
                {/* Two content columns */}
                {active.columns.map((col, ci) => (
                  <div key={col.heading} className="col-span-4">
                    <p
                      className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-3 px-2"
                      style={{ color: '#9CA3AF' }}
                    >
                      {col.heading}
                    </p>
                    <ul className="space-y-0.5">
                      {col.items.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenId(null)}
                              className="group flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-75"
                              style={{
                                background: isActive ? 'rgba(0,196,180,0.06)' : 'transparent',
                              }}
                              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#F9FAFB'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(0,196,180,0.06)' : 'transparent'; }}
                            >
                              <span
                                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-100 group-hover:scale-110"
                                style={{
                                  background: `${item.accent ?? '#0A2540'}18`,
                                  color: item.accent ?? '#0A2540',
                                }}
                              >
                                <item.icon className="w-[15px] h-[15px]" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div
                                  className="text-[13.5px] font-semibold leading-tight"
                                  style={{ color: isActive ? '#00C4B4' : '#0A2540' }}
                                >
                                  {item.label}
                                </div>
                                {item.desc && (
                                  <div className="text-[11.5px] mt-0.5 leading-tight" style={{ color: '#9CA3AF' }}>
                                    {item.desc}
                                  </div>
                                )}
                              </div>
                              <ArrowRight
                                className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-100"
                                style={{ color: '#C9A14A' }}
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                {/* Feature card */}
                <div className="col-span-4">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-3 px-2" style={{ color: '#9CA3AF' }}>
                    Quick start
                  </p>
                  <Link
                    href={active.feature.href}
                    onClick={() => setOpenId(null)}
                    className="group block rounded-2xl p-6 text-white relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #06192E 0%, #0A2540 55%, #13325F 100%)',
                      minHeight: '180px',
                    }}
                  >
                    <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden
                         style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,161,74,0.6) 1px, transparent 0)', backgroundSize: '14px 14px' }} />
                    <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full blur-3xl pointer-events-none"
                         style={{ background: 'rgba(0,196,180,0.20)' }} />
                    <div className="relative z-10 flex flex-col h-full">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: '#C9A14A' }}>
                        <BookOpen className="w-3 h-3" />
                        {active.label}
                      </span>
                      <h4 className="font-display font-bold text-[18px] leading-tight text-white">
                        {active.feature.title}
                      </h4>
                      <p className="mt-2 text-[12.5px] leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {active.feature.desc}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold group-hover:gap-2.5 transition-[gap] duration-100" style={{ color: '#C9A14A' }}>
                        {active.feature.cta}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Bottom trust bar */}
              <div className="border-t px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-5" style={{ borderColor: 'rgba(10,37,64,0.06)', background: 'rgba(10,37,64,0.02)' }}>
                {[
                  { icon: ShieldCheck, text: '100% gov.uk sourced' },
                  { icon: Tag,         text: 'Free forever' },
                  { icon: Globe,       text: 'Updated May 2026' },
                ].map(({ icon: I, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-[11.5px] font-medium" style={{ color: '#5A6478' }}>
                    <I className="w-3 h-3" style={{ color: '#00C4B4' } as React.CSSProperties} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>}
      </header>

      {/* Backdrop — only when mega panel is visible */}
      {!isVisaPage(pathname) && (
      <div
        className="fixed inset-0 z-40 hidden lg:block transition-opacity duration-150"
        style={{
          top: '66px',
          background: 'rgba(10,37,64,0.08)',
          opacity: openId ? 1 : 0,
          pointerEvents: openId ? 'auto' : 'none',
        }}
        onClick={() => setOpenId(null)}
        aria-hidden="true"
      />
      )}

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-50 lg:hidden transition-opacity duration-200"
        style={{
          background: 'rgba(10,37,64,0.45)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── MOBILE DRAWER ─────────────────────────────────────────── */}
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
   MOBILE DRAWER
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
      className="fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-[400px] lg:hidden flex flex-col overflow-hidden"
      style={{
        background: '#fff',
        boxShadow: '-8px 0 40px rgba(10,37,64,0.16)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 240ms cubic-bezier(0.32,0.72,0,1)',
      }}
      role="dialog" aria-modal="true" aria-label="Main navigation"
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between px-4 h-[62px] flex-shrink-0"
           style={{ borderBottom: '1px solid rgba(10,37,64,0.07)' }}>
        {section ? (
          <button
            type="button"
            onClick={() => setDrillId(null)}
            className="flex items-center gap-1.5 text-[14px] font-semibold text-[#0A2540] -ml-1 px-2 h-9 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#5A6478]" />
            Back
          </button>
        ) : (
          <Brand onClick={onClose} />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-4.5 h-4.5 text-[#0A2540]" />
        </button>
      </div>

      {/* Drawer body — two sliding views */}
      <div className="relative flex-1 overflow-hidden">
        {/* ROOT */}
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            transform: drillId ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 240ms cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <div className="px-3 py-4 space-y-1">
            {/* Primary CTA — Eligibility */}
            <Link
              href="/eligibility"
              onClick={onClose}
              className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-white mb-2"
              style={{
                background: 'linear-gradient(135deg, #00C4B4 0%, #00A89A 100%)',
                boxShadow: '0 4px 14px -2px rgba(0,196,180,0.40)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <div>
                  <div className="text-[14.5px] font-bold leading-tight">Eligibility Quiz</div>
                  <div className="text-[11.5px]" style={{ color: 'rgba(255,255,255,0.75)' }}>Get matched in 60 seconds</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {NAV_ITEMS.map((item) => {
              if (item.kind === 'link' && item.id === 'eligibility') return null; // already rendered above

              if (item.kind === 'link') {
                const Icon = item.icon;
                const isOnPage = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl transition-colors"
                    style={{ background: isOnPage ? 'rgba(201,161,74,0.08)' : 'transparent' }}
                    onMouseEnter={(e) => { if (!isOnPage) e.currentTarget.style.background = '#F9FAFB'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isOnPage ? 'rgba(201,161,74,0.08)' : 'transparent'; }}
                  >
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(201,161,74,0.10)' }}>
                      {Icon && <Icon className="w-[15px] h-[15px]" style={{ color: '#C9A14A' }} />}
                    </span>
                    <div className="flex-1">
                      <div className="text-[14.5px] font-semibold leading-tight"
                           style={{ color: isOnPage ? '#C9A14A' : '#0A2540' }}>
                        {item.label}
                      </div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: '#9CA3AF' }}>
                        Estimate fees, IHS & dependants
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: '#D1D5DB' }} />
                  </Link>
                );
              }

              const s = SECTIONS.find((x) => x.id === item.id);
              if (!s) return null;
              const isActive = s.columns.some((c) => c.items.some((i) => pathname.startsWith(i.href)));
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setDrillId(s.id)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-3.5 rounded-xl text-left transition-colors duration-75"
                  style={{ background: isActive ? 'rgba(0,196,180,0.06)' : 'transparent' }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#F9FAFB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(0,196,180,0.06)' : 'transparent'; }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold leading-tight"
                           style={{ color: isActive ? '#00C4B4' : '#0A2540' }}>
                        {s.label}
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>
                        {s.columns.flatMap((c) => c.items).length} topics
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 -rotate-90" style={{ color: '#D1D5DB' }} />
                </button>
              );
            })}

            <div className="mt-2 pt-3 space-y-0.5" style={{ borderTop: '1px solid rgba(10,37,64,0.06)' }}>
              {[
                { href: '/blog', label: 'All guides', icon: BookOpen  },
                { href: '/news', label: 'Visa news',  icon: Newspaper },
                { href: '/about', label: 'About us',   icon: Globe     },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-colors"
                  style={{ color: pathname.startsWith(href) ? '#00C4B4' : '#374151' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#5A6478' } as React.CSSProperties} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* DRILL */}
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{
            transform: drillId ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 240ms cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          {section && (
            <div className="px-4 py-5">
              <div className="mb-5">
                <div className="text-[18px] font-bold text-[#0A2540]">{section.label}</div>
                <div className="text-[12.5px] mt-0.5" style={{ color: '#9CA3AF' }}>{section.feature.title}</div>
              </div>

              {section.columns.map((col) => (
                <div key={col.heading} className="mb-5">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-2 px-1" style={{ color: '#9CA3AF' }}>
                    {col.heading}
                  </p>
                  <ul className="space-y-0.5">
                    {col.items.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors"
                            style={{ background: isActive ? 'rgba(0,196,180,0.07)' : 'transparent' }}
                            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#F9FAFB'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(0,196,180,0.07)' : 'transparent'; }}
                          >
                            <span
                              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                              style={{ background: `${item.accent ?? '#0A2540'}18`, color: item.accent ?? '#0A2540' }}
                            >
                              <item.icon className="w-[15px] h-[15px]" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13.5px] font-semibold leading-tight"
                                   style={{ color: isActive ? '#00C4B4' : '#0A2540' }}>
                                {item.label}
                              </div>
                              {item.desc && (
                                <div className="text-[11.5px] mt-0.5" style={{ color: '#9CA3AF' }}>{item.desc}</div>
                              )}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#D1D5DB' }} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Feature card */}
              <Link
                href={section.feature.href}
                onClick={onClose}
                className="group block rounded-2xl p-5 text-white relative overflow-hidden mt-2"
                style={{ background: 'linear-gradient(135deg, #06192E 0%, #0A2540 55%, #13325F 100%)' }}
              >
                <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                     style={{ background: 'rgba(0,196,180,0.22)' }} />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: '#C9A14A' }}>
                    <Sparkles className="w-3 h-3" />
                    Quick start
                  </div>
                  <div className="font-display font-bold text-[15.5px] leading-tight mb-2 text-white">
                    {section.feature.title}
                  </div>
                  <div className="text-[11.5px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {section.feature.desc}
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[12.5px] font-bold group-hover:gap-2.5 transition-[gap] duration-100" style={{ color: '#C9A14A' }}>
                    {section.feature.cta} <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Drawer footer CTA */}
      <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(10,37,64,0.07)' }}>
        <Link
          href="/tools/cost-calculator"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl text-[14px] transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #0A2540 0%, #13325F 100%)',
            boxShadow: '0 4px 18px rgba(10,37,64,0.20)',
          }}
        >
          <Calculator className="w-4 h-4" style={{ color: '#C9A14A' } as React.CSSProperties} />
          Open Cost Calculator
        </Link>
      </div>
    </aside>
  );
}
