'use client';

/**
 * UKDesk — Category-based mega-menu header (May 2026 redesign v2)
 *
 *  Navigation: Immigration | Calculators | Resources | About
 *  – Immigration: all visa routes + immigration tools + eligibility quiz
 *  – Calculators: 46 tools across 8 categories (4-column paired layout)
 *  – Resources:  guides, news, country/city pages, about
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, ChevronDown, ChevronLeft, ArrowRight, ArrowUpRight,
  ShieldCheck, Globe, Sparkles,
} from 'lucide-react';
import {
  APP_TILES, CATEGORIES, type CategoryId, type AppTile,
} from '../data/tools';

/* ─────────────────────────────────────────────
   BRAND TOKENS
───────────────────────────────────────────── */
const INK     = '#0B0F19';
const CREAM   = '#FAFAF7';
const EMERALD = '#047857';
const GOLD    = '#B8860B';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

/* ─────────────────────────────────────────────
   LOGO
───────────────────────────────────────────── */
function Logo({ onClick, small = false }: { onClick?: () => void; small?: boolean }) {
  const badgeSize  = small ? 32 : 38;
  const letterSize = small ? 16 : 19;
  const wordSize   = small ? 18 : 22;
  return (
    <Link href="/" aria-label="UKDesk — home" onClick={onClick}
          className="flex items-center gap-2.5 flex-shrink-0 group">
      <span className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]"
            style={{ width: badgeSize, height: badgeSize, background: INK, borderRadius: 10,
                     boxShadow: '0 2px 10px -2px rgba(11,15,25,0.30), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        <span aria-hidden
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: letterSize,
                       color: CREAM, letterSpacing: '-0.02em', lineHeight: 1,
                       fontFeatureSettings: '"ss01", "ss02"', marginTop: -1 }}>U</span>
        <span aria-hidden className="absolute"
              style={{ right: 4, bottom: 4, width: 5, height: 5, background: EMERALD,
                       borderRadius: 2, boxShadow: '0 0 0 1.5px ' + INK }} />
      </span>
      <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: wordSize,
                     color: INK, letterSpacing: '-0.025em', lineHeight: 1, fontFeatureSettings: '"ss01"' }}>
        UKDesk<span style={{ color: EMERALD }}>.</span>
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   VISA ROUTE DATA
───────────────────────────────────────────── */
interface VisaItem  { href: string; label: string; desc: string; }
interface VisaGroup { heading: string; items: VisaItem[]; }

const VISA_GROUPS: VisaGroup[] = [
  { heading: 'Work', items: [
    { href: '/visa/skilled-worker',    label: 'Skilled Worker',       desc: '£41,700 · employer sponsored' },
    { href: '/visa/health',            label: 'Health & Care',        desc: 'NHS / care · IHS waived' },
    { href: '/visa/talent',            label: 'Global Talent',        desc: 'No sponsor · endorsed' },
    { href: '/visa/innovator-founder', label: 'Innovator Founder',    desc: 'Business plan · endorsement' },
  ]},
  { heading: 'Study & Graduate', items: [
    { href: '/visa/student',   label: 'Student',  desc: '£558 · degree-level study' },
    { href: '/visa/graduate',  label: 'Graduate', desc: '2 years post-study' },
  ]},
  { heading: 'Family & Visit', items: [
    { href: '/visa/family',  label: 'Family / Spouse',  desc: '£29,000 income · partner' },
    { href: '/visa/visitor', label: 'Standard Visitor', desc: '£135 · tourism / business' },
  ]},
  { heading: 'Settlement & Citizenship', items: [
    { href: '/visa/ilr',            label: 'Indefinite Leave',       desc: '£3,226 · after 5 years' },
    { href: '/visa/citizenship',    label: 'British Citizenship',    desc: 'Naturalisation after ILR' },
    { href: '/visa/long-residence', label: '10-year Long Residence', desc: 'Alternative ILR route' },
    { href: '/visa/euss',           label: 'EU Settlement',          desc: 'EEA / Swiss nationals' },
    { href: '/visa/bno',            label: 'Hong Kong BN(O)',        desc: 'British National Overseas' },
    { href: '/visa/ancestry',       label: 'UK Ancestry',            desc: 'Commonwealth + grandparent' },
  ]},
];

/* ─────────────────────────────────────────────
   IMMIGRATION TOOLS STRIP
───────────────────────────────────────────── */
const IMMIGRATION_TOOLS = [
  { href: '/eligibility',                  label: 'Eligibility quiz',     isHighlighted: true },
  { href: '/ihs-calculator',               label: 'IHS calculator' },
  { href: '/skilled-worker-points-check',  label: 'Points checker' },
  { href: '/visa-switching',               label: 'Visa switching' },
  { href: '/settlement',                   label: 'Settlement compare' },
  { href: '/tools/cost-calculator',        label: 'Visa cost calculator' },
];

/* ─────────────────────────────────────────────
   RESOURCES DATA (guides, news, explore)
───────────────────────────────────────────── */
interface ResourceItem { href: string; label: string; desc: string; }
const RESOURCE_GROUPS: { heading: string; items: ResourceItem[] }[] = [
  { heading: 'Most read guides', items: [
    { href: '/blog/uk-skilled-worker-visa-salary-threshold-2026',   label: 'Skilled Worker thresholds 2026', desc: 'Full SOC breakdown' },
    { href: '/blog/uk-family-visa-minimum-income-2026-what-counts', label: 'Family visa £29,000',            desc: 'What income counts' },
    { href: '/blog/uk-evisa-final-deadline-2026-how-to-migrate',    label: 'eVisa migration deadline',       desc: 'Beat the date' },
    { href: '/blog/uk-graduate-visa-2026-no-sponsor-needed',        label: 'Graduate visa pathway',          desc: 'No sponsor needed' },
  ]},
  { heading: 'In-depth', items: [
    { href: '/blog/uk-citizenship-10-year-long-residence-2026',           label: '10-year long residence',   desc: 'Path to citizenship' },
    { href: '/blog/bringing-parents-to-uk-adult-dependent-relative-2026', label: 'Bringing parents to UK',   desc: 'Adult Dependent Relative' },
    { href: '/blog/uk-visitor-visa-refused-top-reasons-2026',             label: 'Visitor visa refusals',    desc: 'How to reapply' },
    { href: '/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026',   label: 'Finding a sponsor',        desc: '126,530 licensed UK firms' },
  ]},
  { heading: 'Explore', items: [
    { href: '/news',      label: 'Latest visa news',   desc: 'Rule + fee updates' },
    { href: '/blog',      label: 'All guides',         desc: '19 long-form articles' },
    { href: '/from',      label: 'Country guides',     desc: '8 source countries' },
    { href: '/uk-cities', label: 'UK city briefs',     desc: 'Cost · sectors · area' },
    { href: '/postcode',  label: 'Postcode lookup',    desc: 'Council, MP, NHS, police' },
    { href: '/about',     label: 'About UKDesk',       desc: 'Independent editorial' },
  ]},
];

/* ─────────────────────────────────────────────
   TOOLS BY CATEGORY
───────────────────────────────────────────── */
const toolsByCategory: Record<CategoryId, AppTile[]> = CATEGORIES.reduce((acc, c) => {
  acc[c.id] = APP_TILES.filter((t) => t.category === c.id);
  return acc;
}, {} as Record<CategoryId, AppTile[]>);

const TOOL_COLUMNS: { primary: CategoryId; secondary: CategoryId }[] = [
  { primary: 'tax',        secondary: 'business' },
  { primary: 'employment', secondary: 'benefits' },
  { primary: 'property',   secondary: 'vehicles' },
  { primary: 'savings',    secondary: 'immigration' },
];

/* ─────────────────────────────────────────────
   NAV ITEMS — category-based
───────────────────────────────────────────── */
type NavItem =
  | { kind: 'mega'; id: 'immigration' | 'calculators' | 'resources'; label: string }
  | { kind: 'link'; id: string; label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { kind: 'mega', id: 'immigration', label: 'Immigration' },
  { kind: 'mega', id: 'calculators', label: 'Calculators' },
  { kind: 'mega', id: 'resources',   label: 'Resources' },
  { kind: 'link', id: 'about',       label: 'About',      href: '/about' },
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
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenId(null); setMobileOpen(false); }
    };
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
                  <Link key={item.id} href={item.href}
                        onMouseEnter={() => setOpenId(null)}
                        className="relative inline-flex items-center h-10 px-3.5 rounded-lg text-[14px] font-medium transition-colors duration-100"
                        style={{ color: isOnPage ? INK : SLATE, fontWeight: isOnPage ? 600 : 500 }}
                        onMouseOver={(e) => { if (!isOnPage) e.currentTarget.style.color = INK; }}
                        onMouseOut={(e)  => { if (!isOnPage) e.currentTarget.style.color = SLATE; }}>
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
                <button key={item.id} type="button"
                        onMouseEnter={() => open(item.id)}
                        onFocus={() => open(item.id)}
                        onClick={() => setOpenId(isOpen ? null : item.id)}
                        aria-expanded={isOpen} aria-haspopup="true"
                        className="relative inline-flex items-center gap-1 h-10 px-3.5 rounded-lg text-[14px] font-medium transition-colors duration-100"
                        style={{ color: isOpen ? INK : SLATE, fontWeight: isOpen ? 600 : 500 }}
                        onMouseOver={(e) => { if (!isOpen) e.currentTarget.style.color = INK; }}
                        onMouseOut={(e)  => { if (!isOpen) e.currentTarget.style.color = SLATE; }}>
                  {item.label}
                  <ChevronDown className="w-3 h-3 transition-transform duration-150"
                               style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.55 }} />
                </button>
              );
            })}
          </nav>

          {/* Right actions — just hamburger on mobile */}
          <div className="flex items-center gap-2 ml-auto">
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
          openId={openId} pathname={pathname}
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
   MEGA PANEL — routes to category panels
───────────────────────────────────────────── */
function MegaPanel({
  openId, pathname, onClose, onMouseEnter, onMouseLeave,
}: {
  openId: string | null; pathname: string;
  onClose: () => void; onMouseEnter: () => void; onMouseLeave: () => void;
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
      <div className="overflow-hidden"
           style={{
             background: CREAM,
             borderTop: `1px solid ${HAIR}`,
             boxShadow: '0 28px 60px -12px rgba(11,15,25,0.18), 0 8px 22px -10px rgba(11,15,25,0.08)',
           }}>
        {openId === 'immigration' && <ImmigrationPanel pathname={pathname} onClose={onClose} />}
        {openId === 'calculators' && <CalculatorsPanel pathname={pathname} onClose={onClose} />}
        {openId === 'resources'   && <ResourcesPanel   pathname={pathname} onClose={onClose} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   IMMIGRATION PANEL — visa routes + tools
───────────────────────────────────────────── */
function ImmigrationPanel({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-9">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* 4 visa group columns */}
        <div className="col-span-9 grid grid-cols-4 gap-8">
          {VISA_GROUPS.map((g) => (
            <VisaGroupBlock key={g.heading} group={g} pathname={pathname} onClose={onClose} />
          ))}
        </div>

        {/* Right rail — compare all routes */}
        <aside className="col-span-3 flex flex-col">
          <p className="eyebrow mb-3" style={{ color: GOLD }}>Compare</p>
          <Link href="/visa-types" onClick={onClose}
                className="group relative block rounded-2xl overflow-hidden flex-1"
                style={{ background: INK, color: CREAM, minHeight: 280, padding: 28 }}>
            <div className="absolute inset-0 opacity-[0.10] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '14px 14px' }} aria-hidden />
            <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full pointer-events-none"
                 style={{ background: 'rgba(184,134,11,0.22)', filter: 'blur(42px)' }} aria-hidden />
            <div className="relative z-10 flex flex-col h-full">
              <div className="text-[24px] leading-[1.05] mb-3"
                   style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, letterSpacing: '-0.03em', color: CREAM }}>
                <span style={{ fontStyle: 'italic', color: '#FDE68A' }}>Compare</span> every<br />UK visa route.
              </div>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: 'rgba(250,250,247,0.62)' }}>
                14 routes, side-by-side fees, English requirements, time to settlement.
                Updated for 2026 — verified against gov.uk.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold group-hover:gap-2.5 transition-[gap] duration-150"
                    style={{ color: '#FBBF24' }}>
                Visa hub <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </aside>
      </div>

      {/* Immigration tools strip */}
      <div className="mt-7 pt-5 flex flex-wrap items-center gap-3"
           style={{ borderTop: `1px solid ${HAIR}` }}>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] mr-1" style={{ color: MUTED }}>
          Tools
        </span>
        {IMMIGRATION_TOOLS.map((t) => (
          <Link key={t.href} href={t.href} onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors duration-100"
                style={{
                  background: t.isHighlighted ? 'rgba(4,120,87,0.09)' : 'rgba(11,15,25,0.04)',
                  color: t.isHighlighted ? EMERALD : SLATE,
                  border: t.isHighlighted ? '1px solid rgba(4,120,87,0.25)' : '1px solid transparent',
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = t.isHighlighted ? EMERALD : INK; e.currentTarget.style.background = t.isHighlighted ? 'rgba(4,120,87,0.13)' : 'rgba(11,15,25,0.07)'; }}
                onMouseOut={(e)  => { e.currentTarget.style.color = t.isHighlighted ? EMERALD : SLATE; e.currentTarget.style.background = t.isHighlighted ? 'rgba(4,120,87,0.09)' : 'rgba(11,15,25,0.04)'; }}>
            {t.isHighlighted && <Sparkles className="w-3 h-3" />}
            {t.label}
          </Link>
        ))}
        <Link href="/visa-switching" onClick={onClose}
              className="ml-auto text-[12px] font-medium"
              style={{ color: MUTED }}>
          In-country switching
          <ArrowUpRight className="inline w-3 h-3 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CALCULATORS PANEL — 4 columns × paired categories
───────────────────────────────────────────── */
function CalculatorsPanel({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-9">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-9 grid grid-cols-4 gap-6 lg:gap-8">
          {TOOL_COLUMNS.map((col) => (
            <div key={col.primary} className="space-y-7">
              <CategoryBlock category={col.primary}   pathname={pathname} onClose={onClose} />
              <CategoryBlock category={col.secondary} pathname={pathname} onClose={onClose} />
            </div>
          ))}
        </div>

        <aside className="col-span-3 flex flex-col">
          <p className="eyebrow mb-3" style={{ color: GOLD }}>Editorial</p>
          <Link href="/tools" onClick={onClose}
                className="group relative block rounded-2xl overflow-hidden flex-1"
                style={{ background: INK, color: CREAM, minHeight: 280, padding: 28 }}>
            <div className="absolute inset-0 opacity-[0.10] pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)', backgroundSize: '14px 14px' }} aria-hidden />
            <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full pointer-events-none"
                 style={{ background: 'rgba(4,120,87,0.22)', filter: 'blur(40px)' }} aria-hidden />
            <div className="relative z-10 flex flex-col h-full">
              <div className="font-display font-bold text-[24px] leading-[1.05] mb-3"
                   style={{ fontFamily: 'Fraunces, serif', letterSpacing: '-0.03em', color: CREAM }}>
                <span style={{ fontStyle: 'italic', color: '#A7F3D0' }}>Every</span> UK calculator,<br />in one calm place.
              </div>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: 'rgba(250,250,247,0.62)' }}>
                {APP_TILES.length} live tools across 8 categories. Verified against gov.uk,
                HMRC and ONS — no signup, no fluff.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold group-hover:gap-2.5 transition-[gap] duration-150"
                    style={{ color: '#FBBF24' }}>
                Browse all tools <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </aside>
      </div>

      <div className="mt-8 pt-5 flex flex-wrap items-center gap-6 text-[12px]"
           style={{ borderTop: `1px solid ${HAIR}` }}>
        <span className="inline-flex items-center gap-1.5" style={{ color: SLATE }}>
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: EMERALD }} />
          100% gov.uk sourced
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: SLATE }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: GOLD }} />
          {APP_TILES.length} tools live, more launching weekly
        </span>
        <span className="inline-flex items-center gap-1.5" style={{ color: SLATE }}>
          <Globe className="w-3.5 h-3.5" />
          Updated May 2026
        </span>
      </div>
    </div>
  );
}

/* Single category block inside Calculators panel */
function CategoryBlock({ category, pathname, onClose }: { category: CategoryId; pathname: string; onClose: () => void }) {
  const meta  = CATEGORIES.find((c) => c.id === category)!;
  const tools = toolsByCategory[category];
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: `1px solid ${HAIR}` }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, letterSpacing: '-0.015em', color: INK }}>
          {meta.label}
        </h3>
        <span className="text-[10.5px] font-mono font-medium tabular-nums" style={{ color: MUTED }}>{tools.length}</span>
      </div>
      <ul className="space-y-0.5">
        {tools.map((t) => {
          const isActive = pathname === t.href;
          return (
            <li key={t.href}>
              <Link href={t.href} onClick={onClose}
                    className="group flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-colors duration-75"
                    style={{ background: isActive ? 'rgba(4,120,87,0.07)' : 'transparent' }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(4,120,87,0.07)' : 'transparent'; }}>
                <span className="text-[13px] leading-tight truncate"
                      style={{ color: isActive ? EMERALD : INK, fontWeight: isActive ? 600 : 500 }}>
                  {t.label}
                </span>
                {t.status === 'new' && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-px rounded"
                        style={{ background: 'rgba(184,134,11,0.16)', color: GOLD }}>New</span>
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
   VISA GROUP BLOCK (used in ImmigrationPanel)
───────────────────────────────────────────── */
function VisaGroupBlock({ group, pathname, onClose }: { group: VisaGroup; pathname: string; onClose: () => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: `1px solid ${HAIR}` }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, letterSpacing: '-0.015em', color: INK }}>
          {group.heading}
        </h3>
        <span className="text-[10.5px] font-mono font-medium tabular-nums" style={{ color: MUTED }}>{group.items.length}</span>
      </div>
      <ul className="space-y-1.5">
        {group.items.map((v) => {
          const isActive = pathname === v.href;
          return (
            <li key={v.href}>
              <Link href={v.href} onClick={onClose}
                    className="group flex flex-col gap-0.5 px-2 py-2 rounded-md transition-colors duration-75"
                    style={{ background: isActive ? 'rgba(4,120,87,0.07)' : 'transparent' }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(4,120,87,0.07)' : 'transparent'; }}>
                <span className="text-[13px] font-semibold leading-tight"
                      style={{ color: isActive ? EMERALD : INK }}>{v.label}</span>
                <span className="text-[11.5px] leading-tight" style={{ color: MUTED }}>{v.desc}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESOURCES PANEL — guides, news, explore
───────────────────────────────────────────── */
function ResourcesPanel({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-9">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-9 grid grid-cols-3 gap-8">
          {RESOURCE_GROUPS.map((g) => (
            <div key={g.heading}>
              <div className="flex items-baseline justify-between mb-3 pb-2" style={{ borderBottom: `1px solid ${HAIR}` }}>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15, letterSpacing: '-0.015em', color: INK }}>
                  {g.heading}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {g.items.map((it) => {
                  const isActive = pathname === it.href;
                  return (
                    <li key={it.href}>
                      <Link href={it.href} onClick={onClose}
                            className="block px-2 py-2 rounded-md transition-colors"
                            style={{ background: isActive ? 'rgba(4,120,87,0.07)' : 'transparent' }}
                            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(4,120,87,0.07)' : 'transparent'; }}>
                        <div className="text-[13px] font-semibold leading-tight"
                             style={{ color: isActive ? EMERALD : INK }}>{it.label}</div>
                        <div className="text-[11.5px] mt-0.5 leading-tight" style={{ color: MUTED }}>{it.desc}</div>
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
          <div className="rounded-2xl overflow-hidden flex-1 relative"
               style={{ background: '#FBF6E7', color: INK, minHeight: 280, padding: 28 }}>
            <div className="text-[22px] leading-[1.1] mb-3"
                 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, letterSpacing: '-0.025em' }}>
              The Tuesday <span style={{ fontStyle: 'italic', color: EMERALD }}>brief</span>.
            </div>
            <p className="text-[13px] leading-relaxed mb-5" style={{ color: SLATE }}>
              Rule changes, fee updates, route news. 3-minute read, every Tuesday.
            </p>
            <Link href="/news" onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                  style={{ color: INK }}>
              Read the latest <ArrowUpRight className="w-3.5 h-3.5" />
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
function MobileDrawer({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const [view, setView] = useState<
    | { kind: 'root' }
    | { kind: 'immigration' }
    | { kind: 'calculators' }
    | { kind: 'calculators-category'; category: CategoryId }
    | { kind: 'resources' }
  >({ kind: 'root' });

  useEffect(() => {
    if (!open) setTimeout(() => setView({ kind: 'root' }), 280);
  }, [open]);

  const back = () => {
    if (view.kind === 'calculators-category') setView({ kind: 'calculators' });
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
          <button type="button" onClick={back}
                  className="flex items-center gap-1.5 text-[14px] font-semibold -ml-1 px-2 h-10 rounded-lg transition-colors"
                  style={{ color: INK }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button type="button" onClick={onClose} aria-label="Close menu"
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: INK }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          <X className="w-[18px] h-[18px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view.kind === 'root' && (
          <DrawerRoot pathname={pathname} onDrill={(v) => setView(v)} onClose={onClose} />
        )}
        {view.kind === 'immigration' && (
          <DrawerImmigration pathname={pathname} onClose={onClose} />
        )}
        {view.kind === 'calculators' && (
          <DrawerCalculatorsList onDrill={(c) => setView({ kind: 'calculators-category', category: c })} />
        )}
        {view.kind === 'calculators-category' && (
          <DrawerCalculatorsCategory category={view.category} pathname={pathname} onClose={onClose} />
        )}
        {view.kind === 'resources' && (
          <DrawerResources pathname={pathname} onClose={onClose} />
        )}
      </div>

      <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${HAIR}` }}>
        <Link href="/eligibility" onClick={onClose}
              className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-[14px] transition-all active:scale-[0.98]"
              style={{ background: INK, color: CREAM, boxShadow: '0 4px 18px rgba(11,15,25,0.22)' }}>
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
  onDrill: (v: { kind: 'immigration' } | { kind: 'calculators' } | { kind: 'resources' }) => void;
  onClose: () => void;
}) {
  const drillItems = [
    { id: 'immigration', label: 'Immigration', desc: 'Visa routes · tools · eligibility',            drill: { kind: 'immigration' as const } },
    { id: 'calculators', label: 'Calculators', desc: `${APP_TILES.length} tools across 8 categories`, drill: { kind: 'calculators' as const } },
    { id: 'resources',   label: 'Resources',   desc: 'Guides, news, country pages, about',           drill: { kind: 'resources'   as const } },
  ];
  const links = [
    { href: '/about', label: 'About UKDesk', desc: 'Independent editorial' },
  ];
  return (
    <div className="p-4 space-y-1">
      {drillItems.map((it) => (
        <button key={it.id} type="button" onClick={() => onDrill(it.drill)}
                className="w-full flex items-center justify-between gap-3 px-4 py-4 rounded-xl text-left transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
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
          <Link key={l.href} href={l.href} onClick={onClose}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors"
                style={{ background: isOn ? 'rgba(4,120,87,0.07)' : 'transparent' }}>
            <div>
              <div className="text-[14.5px] font-semibold leading-tight" style={{ color: isOn ? EMERALD : INK }}>{l.label}</div>
              <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{l.desc}</div>
            </div>
            <ArrowRight className="w-4 h-4" style={{ color: MUTED }} />
          </Link>
        );
      })}
    </div>
  );
}

function DrawerImmigration({ pathname, onClose }: { pathname: string; onClose: () => void }) {
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
                      <div className="text-[14px] font-semibold leading-tight" style={{ color: isOn ? EMERALD : INK }}>{v.label}</div>
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

      {/* Immigration tools section */}
      <div className="mt-2 pt-4 mx-2" style={{ borderTop: `1px solid ${HAIR}` }}>
        <p className="eyebrow mb-3" style={{ color: GOLD }}>Immigration tools</p>
        <ul className="space-y-1">
          {IMMIGRATION_TOOLS.map((t) => {
            const isOn = pathname === t.href;
            return (
              <li key={t.href}>
                <Link href={t.href} onClick={onClose}
                      className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-colors"
                      style={{ background: isOn ? 'rgba(4,120,87,0.07)' : 'transparent' }}>
                  <div className="flex items-center gap-2">
                    {t.isHighlighted && <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: EMERALD }} />}
                    <span className="text-[14px] font-semibold leading-tight"
                          style={{ color: isOn ? EMERALD : (t.isHighlighted ? EMERALD : INK) }}>
                      {t.label}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: MUTED }} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Link href="/visa-types" onClick={onClose}
            className="block mt-4 mx-2 text-[13px] font-semibold py-3 rounded-xl text-center transition-colors"
            style={{ background: 'rgba(11,15,25,0.04)', color: INK }}>
        Browse all 14 visa routes →
      </Link>
    </div>
  );
}

function DrawerCalculatorsList({ onDrill }: { onDrill: (c: CategoryId) => void }) {
  return (
    <div className="p-4 space-y-1">
      <p className="px-4 mb-2 eyebrow" style={{ color: GOLD }}>By category</p>
      {CATEGORIES.map((c) => {
        const count = toolsByCategory[c.id].length;
        return (
          <button key={c.id} type="button" onClick={() => onDrill(c.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(11,15,25,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
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

function DrawerCalculatorsCategory({
  category, pathname, onClose,
}: { category: CategoryId; pathname: string; onClose: () => void }) {
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
              <Link href={t.href} onClick={onClose}
                    className="flex items-start justify-between gap-3 px-3 py-3 rounded-xl transition-colors"
                    style={{ background: isOn ? 'rgba(4,120,87,0.07)' : 'transparent' }}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold leading-tight" style={{ color: isOn ? EMERALD : INK }}>
                      {t.label}
                    </span>
                    {t.status === 'new' && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-px rounded"
                            style={{ background: 'rgba(184,134,11,0.16)', color: GOLD }}>New</span>
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

function DrawerResources({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="p-4">
      {RESOURCE_GROUPS.map((g) => (
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
                      <div className="text-[14px] font-semibold leading-tight" style={{ color: isOn ? EMERALD : INK }}>{it.label}</div>
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
