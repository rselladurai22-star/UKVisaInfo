'use client';

/**
 * UKDesk — Editorial Premium Header (May 2026 redesign)
 *
 *  • Monogram badge logo (ink-black square, serif "U", emerald dot)
 *  • Fraunces serif wordmark
 *  • 3-level mega menu: Top nav → Category columns → Tool links
 *  • Every live tool is reachable from the menu (46 tools across 8 categories)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, ChevronDown, ChevronLeft, ArrowRight, ArrowUpRight,
  ShieldCheck, Globe, Newspaper, Sparkles,
} from 'lucide-react';
import {
  APP_TILES, CATEGORIES, type CategoryId, type AppTile,
} from '../data/tools';

/* ─────────────────────────────────────────────
   BRAND TOKENS — Editorial Premium
───────────────────────────────────────────── */
const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

/* ─────────────────────────────────────────────
   LOGO — Monogram badge + Fraunces wordmark
───────────────────────────────────────────── */
function Logo({ onClick, small = false }: { onClick?: () => void; small?: boolean }) {
  const badgeSize = small ? 32 : 38;
  const letterSize = small ? 16 : 19;
  const wordSize = small ? 18 : 22;
  return (
    <Link href="/" aria-label="UKDesk — home" onClick={onClick}
          className="flex items-center gap-2.5 flex-shrink-0 group">
      <span
        className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]"
        style={{
          width: badgeSize, height: badgeSize,
          background: INK,
          borderRadius: 10,
          boxShadow: '0 2px 10px -2px rgba(11,15,25,0.30), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>
        <span
          aria-hidden
          style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 600,
            fontSize: letterSize,
            color: CREAM,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontFeatureSettings: '"ss01", "ss02"',
            marginTop: -1,
          }}
        >U</span>
        <span
          aria-hidden
          className="absolute"
          style={{
            right: 4, bottom: 4,
            width: 5, height: 5,
            background: EMERALD,
            borderRadius: 2,
            boxShadow: '0 0 0 1.5px ' + INK,
          }}
        />
      </span>
      <span
        style={{
          fontFamily: 'Fraunces, serif',
          fontWeight: 700,
          fontSize: wordSize,
          color: INK,
          letterSpacing: '-0.025em',
          lineHeight: 1,
          fontFeatureSettings: '"ss01"',
        }}
      >
        UKDesk<span style={{ color: EMERALD }}>.</span>
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   VISA + GUIDE NAV DATA
───────────────────────────────────────────── */
interface VisaItem { href: string; label: string; desc: string; }
interface VisaGroup { heading: string; items: VisaItem[]; }

const VISA_GROUPS: VisaGroup[] = [
  { heading: 'Work', items: [
    { href: '/visa/skilled-worker',     label: 'Skilled Worker',     desc: '£41,700 · employer sponsored' },
    { href: '/visa/health',             label: 'Health & Care',      desc: 'NHS / care · IHS waived' },
    { href: '/visa/talent',             label: 'Global Talent',      desc: 'No sponsor · endorsed' },
    { href: '/visa/innovator-founder',  label: 'Innovator Founder',  desc: 'Business plan · endorsement' },
  ]},
  { heading: 'Study & Graduate', items: [
    { href: '/visa/student',            label: 'Student',            desc: '£558 · degree-level study' },
    { href: '/visa/graduate',           label: 'Graduate',           desc: '2 years post-study' },
  ]},
  { heading: 'Family & Visit', items: [
    { href: '/visa/family',             label: 'Family / Spouse',    desc: '£29,000 income · partner' },
    { href: '/visa/visitor',            label: 'Standard Visitor',   desc: '£135 · tourism / business' },
  ]},
  { heading: 'Settlement & Citizenship', items: [
    { href: '/visa/ilr',                label: 'Indefinite Leave',   desc: '£3,226 · after 5 years' },
    { href: '/visa/citizenship',        label: 'British Citizenship', desc: 'Naturalisation after ILR' },
    { href: '/visa/long-residence',     label: '10-year Long Residence', desc: 'Alternative ILR route' },
    { href: '/visa/euss',               label: 'EU Settlement',      desc: 'EEA / Swiss nationals' },
    { href: '/visa/bno',                label: 'Hong Kong BN(O)',    desc: 'British National Overseas' },
    { href: '/visa/ancestry',           label: 'UK Ancestry',        desc: 'Commonwealth + grandparent' },
  ]},
];

interface GuideItem { href: string; label: string; desc: string; }
const GUIDE_GROUPS = [
  { heading: 'Most read', items: [
    { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',   label: 'Skilled Worker thresholds 2026', desc: 'Full SOC breakdown' },
    { href: '/blog/uk-family-visa-minimum-income-2026-what-counts', label: 'Family visa £29,000',           desc: 'What income counts' },
    { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',    label: 'eVisa migration deadline',      desc: 'Beat the date' },
    { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed',        label: 'Graduate visa pathway',          desc: 'No sponsor needed' },
  ] as GuideItem[]},
  { heading: 'In-depth', items: [
    { href: '/blog/uk-citizenship-10-year-long-residence-2026',           label: '10-year long residence',  desc: 'Path to citizenship' },
    { href: '/blog/bringing-parents-to-uk-adult-dependent-relative-2026', label: 'Bringing parents to UK',  desc: 'Adult Dependent Relative' },
    { href: '/blog/uk-visitor-visa-refused-top-reasons-2026',             label: 'Visitor visa refusals',    desc: 'How to reapply' },
    { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026',   label: 'Finding a sponsor',        desc: '126,530 licensed UK firms' },
  ] as GuideItem[]},
  { heading: 'News & resources', items: [
    { href: '/news',     label: 'Latest visa news',  desc: 'Rule + fee updates' },
    { href: '/blog',     label: 'All guides',        desc: '19 long-form articles' },
    { href: '/from',     label: 'Country guides',    desc: '8 source countries' },
    { href: '/uk-cities', label: 'UK city briefs',   desc: 'Cost · sectors · area' },
  ] as GuideItem[]},
];

/* ─────────────────────────────────────────────
   TOOLS BY CATEGORY — for 3-level mega panel
───────────────────────────────────────────── */
const toolsByCategory: Record<CategoryId, AppTile[]> = CATEGORIES.reduce((acc, c) => {
  acc[c.id] = APP_TILES.filter((t) => t.category === c.id);
  return acc;
}, {} as Record<CategoryId, AppTile[]>);

/* Layout — pair categories into 4 balanced columns */
const TOOL_COLUMNS: { primary: CategoryId; secondary: CategoryId }[] = [
  { primary: 'tax',        secondary: 'business' },
  { primary: 'employment', secondary: 'benefits' },
  { primary: 'property',   secondary: 'vehicles' },
  { primary: 'savings',    secondary: 'immigration' },
];

/* ─────────────────────────────────────────────
   TOP NAV ITEMS
───────────────────────────────────────────── */
type NavItem =
  | { kind: 'mega';  id: 'tools' | 'visas' | 'guides'; label: string }
  | { kind: 'link';  id: string; label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { kind: 'mega', id: 'tools',  label: 'Tools' },
  { kind: 'mega', id: 'visas',  label: 'Visas' },
  { kind: 'mega', id: 'guides', label: 'Guides' },
  { kind: 'link', id: 'postcode', label: 'Postcode', href: '/postcode' },
  { kind: 'link', id: 'about',    label: 'About',    href: '/about' },
];

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
export default function Header(_props: { onApply?: () => void }) {
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

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-200"
        style={{
          background: scrolled ? 'rgba(250,250,247,0.92)' : 'rgba(250,250,247,1)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? `1px solid ${HAIR}` : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 24px -8px rgba(11,15,25,0.10)' : 'none',
        }}
        onMouseLeave={startClose}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-[68px] md:h-[72px] flex items-center gap-2">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-7" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              if (item.kind === 'link') {
                const isOnPage = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onMouseEnter={() => setOpenId(null)}
                    className="relative inline-flex items-center h-10 px-3.5 rounded-lg text-[14px] font-medium transition-colors duration-100"
                    style={{
                      color: isOnPage ? INK : SLATE,
                      fontWeight: isOnPage ? 600 : 500,
                    }}
                    onMouseOver={(e) => { if (!isOnPage) e.currentTarget.style.color = INK; }}
                    onMouseOut={(e)  => { if (!isOnPage) e.currentTarget.style.color = SLATE; }}
                  >
                    {item.label}
                    {isOnPage && (
                      <span className="absolute -bottom-px left-3 right-3 h-[2px] rounded-full"
                            style={{ background: EMERALD }} />
                    )}
                  </Link>
                );
              }
              const isOpen = openId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => open(item.id)}
                  onFocus={() => open(item.id)}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className="relative inline-flex items-center gap-1 h-10 px-3.5 rounded-lg text-[14px] font-medium transition-colors duration-100"
                  style={{
                    color: isOpen ? INK : SLATE,
                    fontWeight: isOpen ? 600 : 500,
                  }}
                  onMouseOver={(e) => { if (!isOpen) e.currentTarget.style.color = INK; }}
                  onMouseOut={(e)  => { if (!isOpen) e.currentTarget.style.color = SLATE; }}
                >
                  {item.label}
                  <ChevronDown
                    className="w-3 h-3 transition-transform duration-150"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.55 }}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/news"
              className="hidden xl:inline-flex items-center gap-1.5 h-9 px-3 text-[13px] font-medium rounded-lg transition-colors duration-100"
              style={{ color: SLATE }}
              onMouseOver={(e) => { e.currentTarget.style.color = INK; e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.color = SLATE; e.currentTarget.style.background = 'transparent'; }}
            >
              <Newspaper className="w-3.5 h-3.5" />
              News
            </Link>

            <Link
              href="/eligibility"
              className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 rounded-lg text-[13.5px] font-semibold transition-all duration-150"
              style={{
                background: INK,
                color: CREAM,
                boxShadow: '0 2px 14px -4px rgba(11,15,25,0.40)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = EMERALD; }}
              onMouseOut={(e)  => { e.currentTarget.style.background = INK; }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Eligibility quiz
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: INK }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.05)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Menu className="w-[19px] h-[19px]" />
            </button>
          </div>
        </div>

        {/* Mega panels */}
        <MegaPanel
          openId={openId}
          pathname={pathname}
          onClose={() => setOpenId(null)}
          onMouseEnter={cancelClose}
          onMouseLeave={startClose}
        />
      </header>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 hidden lg:block transition-opacity duration-200"
        style={{
          top: 72,
          background: 'rgba(11,15,25,0.10)',
          backdropFilter: 'blur(2px)',
          opacity: openId ? 1 : 0,
          pointerEvents: openId ? 'auto' : 'none',
        }}
        onClick={() => setOpenId(null)}
        aria-hidden="true"
      />

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-50 lg:hidden transition-opacity duration-200"
        style={{
          background: 'rgba(11,15,25,0.50)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
    </>
  );
}

/* ─────────────────────────────────────────────
   MEGA PANEL — 3-level desktop navigation
───────────────────────────────────────────── */
function MegaPanel({
  openId, pathname, onClose, onMouseEnter, onMouseLeave,
}: {
  openId: string | null;
  pathname: string;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-0 right-0 top-full hidden lg:block"
      style={{
        opacity: openId ? 1 : 0,
        transform: openId ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 140ms ease, transform 140ms ease',
        pointerEvents: openId ? 'auto' : 'none',
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          background: CREAM,
          borderTop: `1px solid ${HAIR}`,
          boxShadow: '0 28px 60px -12px rgba(11,15,25,0.18), 0 8px 22px -10px rgba(11,15,25,0.08)',
        }}
      >
        {openId === 'tools'  && <ToolsPanel  pathname={pathname} onClose={onClose} />}
        {openId === 'visas'  && <VisasPanel  pathname={pathname} onClose={onClose} />}
        {openId === 'guides' && <GuidesPanel pathname={pathname} onClose={onClose} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOOLS PANEL — 4 columns × paired categories
───────────────────────────────────────────── */
function ToolsPanel({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-9">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* 4 columns of tools (cols 1-9) */}
        <div className="col-span-9 grid grid-cols-4 gap-6 lg:gap-8">
          {TOOL_COLUMNS.map((col) => (
            <div key={col.primary} className="space-y-7">
              <CategoryBlock category={col.primary}   pathname={pathname} onClose={onClose} />
              <CategoryBlock category={col.secondary} pathname={pathname} onClose={onClose} />
            </div>
          ))}
        </div>

        {/* Right rail — feature */}
        <aside className="col-span-3 flex flex-col">
          <p className="eyebrow mb-3" style={{ color: GOLD }}>Editorial</p>
          <Link
            href="/tools"
            onClick={onClose}
            className="group relative block rounded-2xl overflow-hidden flex-1"
            style={{
              background: INK,
              color: CREAM,
              minHeight: 280,
              padding: 28,
            }}
          >
            <div className="absolute inset-0 opacity-[0.10] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '14px 14px' }} aria-hidden />
            <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full pointer-events-none"
                 style={{ background: 'rgba(4,120,87,0.22)', filter: 'blur(40px)' }} aria-hidden />
            <div className="relative z-10 flex flex-col h-full">
              <div
                className="font-display font-bold text-[24px] leading-[1.05] mb-3"
                style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.03em', color: CREAM }}
              >
                <span style={{ fontStyle: 'italic', color: '#A7F3D0' }}>Every</span> UK calculator,<br />
                in one calm place.
              </div>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: 'rgba(250,250,247,0.62)' }}>
                {APP_TILES.length} live tools across 8 categories. Verified against gov.uk,
                HMRC and ONS — no signup, no fluff.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold group-hover:gap-2.5 transition-[gap] duration-150"
                    style={{ color: '#FBBF24' }}>
                Browse all tools
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </aside>
      </div>

      {/* Trust strip */}
      <div className="mt-8 pt-5 flex flex-wrap items-center gap-6 text-[12px]" style={{ borderTop: `1px solid ${HAIR}` }}>
        <span className="inline-flex items-center gap-1.5" style={{ color: SLATE }}>
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: EMERALD }} />
          100% gov.uk sourced
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: SLATE }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: GOLD }} />
          {APP_TILES.length} tools live, more launching weekly
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: SLATE }}>
          <Globe className="w-3.5 h-3.5" style={{ color: SLATE }} />
          Updated May 2026
        </span>
      </div>
    </div>
  );
}

/* Single category block inside the mega panel */
function CategoryBlock({
  category, pathname, onClose,
}: {
  category: CategoryId; pathname: string; onClose: () => void;
}) {
  const meta  = CATEGORIES.find((c) => c.id === category)!;
  const tools = toolsByCategory[category];
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: `1px solid ${HAIR}` }}>
        <h3
          className="font-display"
          style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: '-0.015em',
            color: INK,
          }}
        >
          {meta.label}
        </h3>
        <span className="text-[10.5px] font-mono font-medium tabular-nums" style={{ color: MUTED }}>
          {tools.length}
        </span>
      </div>
      <ul className="space-y-0.5">
        {tools.map((t) => {
          const isActive = pathname === t.href;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                onClick={onClose}
                className="group flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-colors duration-75"
                style={{ background: isActive ? 'rgba(4,120,87,0.07)' : 'transparent' }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(4,120,87,0.07)' : 'transparent'; }}
              >
                <span
                  className="text-[13px] leading-tight truncate"
                  style={{ color: isActive ? EMERALD : INK, fontWeight: isActive ? 600 : 500 }}
                >
                  {t.label}
                </span>
                {t.status === 'new' && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-px rounded"
                    style={{ background: 'rgba(184,134,11,0.16)', color: GOLD }}
                  >
                    New
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VISAS PANEL — 3 levels: top nav → group → visa
───────────────────────────────────────────── */
function VisasPanel({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-9">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-9 grid grid-cols-4 gap-8">
          {VISA_GROUPS.map((g) => (
            <VisaGroupBlock key={g.heading} group={g} pathname={pathname} onClose={onClose} />
          ))}
        </div>
        <aside className="col-span-3 flex flex-col">
          <p className="eyebrow mb-3" style={{ color: GOLD }}>Compare</p>
          <Link
            href="/visa-types"
            onClick={onClose}
            className="group relative block rounded-2xl overflow-hidden flex-1"
            style={{ background: INK, color: CREAM, minHeight: 280, padding: 28 }}
          >
            <div className="absolute inset-0 opacity-[0.10] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '14px 14px' }} aria-hidden />
            <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full pointer-events-none"
                 style={{ background: 'rgba(184,134,11,0.22)', filter: 'blur(42px)' }} aria-hidden />
            <div className="relative z-10 flex flex-col h-full">
              <div className="text-[24px] leading-[1.05] mb-3"
                   style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, letterSpacing: '-0.03em', color: CREAM }}>
                <span style={{ fontStyle: 'italic', color: '#FDE68A' }}>Compare</span> every<br />
                UK visa route.
              </div>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: 'rgba(250,250,247,0.62)' }}>
                14 routes, side-by-side fees, English requirements, time to settlement.
                Updated for 2026 — verified against gov.uk.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold group-hover:gap-2.5 transition-[gap] duration-150"
                    style={{ color: '#FBBF24' }}>
                Visa hub
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </aside>
      </div>

      <div className="mt-8 pt-5 flex flex-wrap items-center gap-6 text-[12px]" style={{ borderTop: `1px solid ${HAIR}` }}>
        <Link href="/eligibility" onClick={onClose}
              className="inline-flex items-center gap-1.5 font-medium transition-colors"
              style={{ color: EMERALD }}>
          <Sparkles className="w-3.5 h-3.5" />
          Eligibility quiz — match in 60s
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link href="/visa-switching" onClick={onClose}
              className="inline-flex items-center gap-1.5 font-medium" style={{ color: SLATE }}>
          UK in-country visa switching
        </Link>
        <Link href="/settlement" onClick={onClose}
              className="inline-flex items-center gap-1.5 font-medium" style={{ color: SLATE }}>
          Settlement compare
        </Link>
      </div>
    </div>
  );
}

function VisaGroupBlock({
  group, pathname, onClose,
}: {
  group: VisaGroup; pathname: string; onClose: () => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: `1px solid ${HAIR}` }}>
        <h3 style={{
          fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15,
          letterSpacing: '-0.015em', color: INK,
        }}>
          {group.heading}
        </h3>
        <span className="text-[10.5px] font-mono font-medium tabular-nums" style={{ color: MUTED }}>
          {group.items.length}
        </span>
      </div>
      <ul className="space-y-1.5">
        {group.items.map((v) => {
          const isActive = pathname === v.href;
          return (
            <li key={v.href}>
              <Link
                href={v.href}
                onClick={onClose}
                className="group flex flex-col gap-0.5 px-2 py-2 rounded-md transition-colors duration-75"
                style={{ background: isActive ? 'rgba(4,120,87,0.07)' : 'transparent' }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(4,120,87,0.07)' : 'transparent'; }}
              >
                <span className="text-[13px] font-semibold leading-tight"
                      style={{ color: isActive ? EMERALD : INK }}>
                  {v.label}
                </span>
                <span className="text-[11.5px] leading-tight" style={{ color: MUTED }}>
                  {v.desc}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GUIDES PANEL — 3 columns
───────────────────────────────────────────── */
function GuidesPanel({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-9">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-9 grid grid-cols-3 gap-8">
          {GUIDE_GROUPS.map((g) => (
            <div key={g.heading}>
              <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: `1px solid ${HAIR}` }}>
                <h3 style={{
                  fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15,
                  letterSpacing: '-0.015em', color: INK,
                }}>{g.heading}</h3>
              </div>
              <ul className="space-y-1.5">
                {g.items.map((it) => {
                  const isActive = pathname === it.href;
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        onClick={onClose}
                        className="block px-2 py-2 rounded-md transition-colors"
                        style={{ background: isActive ? 'rgba(4,120,87,0.07)' : 'transparent' }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(4,120,87,0.07)' : 'transparent'; }}
                      >
                        <div className="text-[13px] font-semibold leading-tight"
                             style={{ color: isActive ? EMERALD : INK }}>
                          {it.label}
                        </div>
                        <div className="text-[11.5px] mt-0.5 leading-tight" style={{ color: MUTED }}>
                          {it.desc}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <aside className="col-span-3 flex flex-col">
          <p className="eyebrow mb-3" style={{ color: GOLD }}>Newsletter</p>
          <div
            className="rounded-2xl overflow-hidden flex-1 relative"
            style={{ background: '#FBF6E7', color: INK, minHeight: 280, padding: 28 }}
          >
            <div className="text-[22px] leading-[1.1] mb-3"
                 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, letterSpacing: '-0.025em' }}>
              The Tuesday <span style={{ fontStyle: 'italic', color: EMERALD }}>brief</span>.
            </div>
            <p className="text-[13px] leading-relaxed mb-5" style={{ color: SLATE }}>
              Rule changes, fee updates, route news. 3-minute read, every Tuesday.
            </p>
            <Link
              href="/news"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
              style={{ color: INK }}
            >
              Read the latest
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   MOBILE DRAWER — 3-level drill-down
═════════════════════════════════════════════ */
function MobileDrawer({
  open, onClose, pathname,
}: {
  open: boolean; onClose: () => void; pathname: string;
}) {
  const [view, setView] = useState<
    | { kind: 'root' }
    | { kind: 'tools' }
    | { kind: 'tools-category', category: CategoryId }
    | { kind: 'visas' }
    | { kind: 'guides' }
  >({ kind: 'root' });

  useEffect(() => {
    if (!open) setTimeout(() => setView({ kind: 'root' }), 280);
  }, [open]);

  const back = () => {
    if (view.kind === 'tools-category') setView({ kind: 'tools' });
    else setView({ kind: 'root' });
  };

  return (
    <aside
      className="fixed top-0 right-0 bottom-0 z-50 w-[90%] max-w-[400px] lg:hidden flex flex-col overflow-hidden"
      style={{
        background: CREAM,
        boxShadow: '-12px 0 50px rgba(11,15,25,0.18)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 240ms cubic-bezier(0.32,0.72,0,1)',
      }}
      role="dialog" aria-modal="true" aria-label="Main navigation"
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between px-5 h-[68px] flex-shrink-0"
           style={{ borderBottom: `1px solid ${HAIR}` }}>
        {view.kind === 'root' ? (
          <Logo onClick={onClose} small />
        ) : (
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-1.5 text-[14px] font-semibold -ml-1 px-2 h-10 rounded-lg transition-colors"
            style={{ color: INK }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: INK }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <X className="w-[18px] h-[18px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view.kind === 'root' && (
          <DrawerRoot pathname={pathname} onDrill={(v) => setView(v)} onClose={onClose} />
        )}
        {view.kind === 'tools' && (
          <DrawerToolsList onDrill={(c) => setView({ kind: 'tools-category', category: c })} />
        )}
        {view.kind === 'tools-category' && (
          <DrawerToolsCategory category={view.category} pathname={pathname} onClose={onClose} />
        )}
        {view.kind === 'visas' && (
          <DrawerVisas pathname={pathname} onClose={onClose} />
        )}
        {view.kind === 'guides' && (
          <DrawerGuides pathname={pathname} onClose={onClose} />
        )}
      </div>

      <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${HAIR}` }}>
        <Link
          href="/eligibility"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-[14px] transition-all active:scale-[0.98]"
          style={{
            background: INK,
            color: CREAM,
            boxShadow: '0 4px 18px rgba(11,15,25,0.22)',
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: '#A7F3D0' }} />
          Eligibility quiz
        </Link>
      </div>
    </aside>
  );
}

function DrawerRoot({
  pathname, onDrill, onClose,
}: {
  pathname: string;
  onDrill: (v: { kind: 'tools' } | { kind: 'visas' } | { kind: 'guides' }) => void;
  onClose: () => void;
}) {
  const drillItems = [
    { id: 'tools',  label: 'Tools',  desc: `${APP_TILES.length} calculators across 8 categories`, drill: { kind: 'tools'  as const } },
    { id: 'visas',  label: 'Visas',  desc: '14 routes · settlement · switching', drill: { kind: 'visas'  as const } },
    { id: 'guides', label: 'Guides', desc: 'Long-form articles & news',          drill: { kind: 'guides' as const } },
  ];
  const links = [
    { href: '/postcode', label: 'Postcode lookup', desc: 'Council, MP, NHS, police, ward' },
    { href: '/news',     label: 'Visa news',       desc: 'Rule + fee updates' },
    { href: '/about',    label: 'About UKDesk',    desc: 'Independent editorial' },
  ];
  return (
    <div className="p-4 space-y-1">
      {drillItems.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => onDrill(it.drill)}
          className="w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl text-left transition-colors"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18, letterSpacing: '-0.015em', color: INK }}>
              {it.label}
            </div>
            <div className="text-[12.5px] mt-0.5" style={{ color: MUTED }}>{it.desc}</div>
          </div>
          <ChevronDown className="w-4 h-4 -rotate-90" style={{ color: MUTED }} />
        </button>
      ))}

      <div className="my-3 mx-2 ed-rule-center" />

      {links.map((l) => {
        const isOn = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors"
            style={{ background: isOn ? 'rgba(4,120,87,0.07)' : 'transparent' }}
          >
            <div>
              <div className="text-[14.5px] font-semibold leading-tight" style={{ color: isOn ? EMERALD : INK }}>
                {l.label}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{l.desc}</div>
            </div>
            <ArrowRight className="w-4 h-4" style={{ color: MUTED }} />
          </Link>
        );
      })}
    </div>
  );
}

function DrawerToolsList({ onDrill }: { onDrill: (c: CategoryId) => void }) {
  return (
    <div className="p-4 space-y-1">
      <p className="px-4 mb-2 eyebrow" style={{ color: GOLD }}>By category</p>
      {CATEGORIES.map((c) => {
        const count = toolsByCategory[c.id].length;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onDrill(c.id)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left transition-colors"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="flex items-center gap-3">
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, letterSpacing: '-0.012em', color: INK }}>
                  {c.label}
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{c.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-mono tabular-nums" style={{ color: MUTED }}>{count}</span>
              <ChevronDown className="w-4 h-4 -rotate-90" style={{ color: MUTED }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DrawerToolsCategory({
  category, pathname, onClose,
}: {
  category: CategoryId; pathname: string; onClose: () => void;
}) {
  const meta  = CATEGORIES.find((c) => c.id === category)!;
  const tools = toolsByCategory[category];
  return (
    <div className="p-4">
      <p className="px-2 eyebrow mb-2" style={{ color: GOLD }}>{meta.description}</p>
      <h2 className="px-2 mb-4"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 22, letterSpacing: '-0.025em', color: INK }}>
        {meta.label}
      </h2>
      <ul className="space-y-1">
        {tools.map((t) => {
          const isOn = pathname === t.href;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                onClick={onClose}
                className="flex items-start justify-between gap-3 px-3 py-3 rounded-xl transition-colors"
                style={{ background: isOn ? 'rgba(4,120,87,0.07)' : 'transparent' }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold leading-tight" style={{ color: isOn ? EMERALD : INK }}>
                      {t.label}
                    </span>
                    {t.status === 'new' && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-px rounded"
                            style={{ background: 'rgba(184,134,11,0.16)', color: GOLD }}>
                        New
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{t.hint}</div>
                </div>
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MUTED }} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DrawerVisas({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="p-4">
      {VISA_GROUPS.map((g) => (
        <div key={g.heading} className="mb-5">
          <p className="px-2 eyebrow mb-2" style={{ color: GOLD }}>{g.heading}</p>
          <ul className="space-y-1">
            {g.items.map((v) => {
              const isOn = pathname === v.href;
              return (
                <li key={v.href}>
                  <Link href={v.href} onClick={onClose}
                        className="flex items-start justify-between gap-3 px-3 py-3 rounded-xl transition-colors"
                        style={{ background: isOn ? 'rgba(4,120,87,0.07)' : 'transparent' }}>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold leading-tight" style={{ color: isOn ? EMERALD : INK }}>
                        {v.label}
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{v.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MUTED }} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <Link href="/visa-types" onClick={onClose}
            className="block mt-2 mx-2 text-[13px] font-semibold py-3 rounded-xl text-center transition-colors"
            style={{ background: 'rgba(11,15,25,0.04)', color: INK }}>
        Browse all 14 visa routes →
      </Link>
    </div>
  );
}

function DrawerGuides({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="p-4">
      {GUIDE_GROUPS.map((g) => (
        <div key={g.heading} className="mb-5">
          <p className="px-2 eyebrow mb-2" style={{ color: GOLD }}>{g.heading}</p>
          <ul className="space-y-1">
            {g.items.map((it) => {
              const isOn = pathname === it.href;
              return (
                <li key={it.href}>
                  <Link href={it.href} onClick={onClose}
                        className="flex items-start justify-between gap-3 px-3 py-3 rounded-xl transition-colors"
                        style={{ background: isOn ? 'rgba(4,120,87,0.07)' : 'transparent' }}>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold leading-tight" style={{ color: isOn ? EMERALD : INK }}>
                        {it.label}
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{it.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MUTED }} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
