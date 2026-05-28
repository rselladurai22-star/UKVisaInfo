'use client';

/**
 * UKDesk — Header (3-level nav: Category → Sub-category → Tool)
 *
 *   Desktop top nav: 8 categories + About + News
 *   Mega-panel:      sub-category columns of tool links
 *   Mobile drawer:   drill-down (root → categories → category → tools)
 *
 *   Eligibility quiz CTA and Postcode link intentionally removed from nav.
 *   /eligibility and /postcode pages still exist and indexable.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  APP_TILES, CATEGORIES, CATEGORY_SUBGROUPS, CATEGORY_NAV_LABEL,
  type CategoryId, type AppTile,
} from '../data/tools';

/* ─────────────────────────────────────────────
   FONT + BRAND TOKENS
───────────────────────────────────────────── */
const FONT         = '"Inter", -apple-system, system-ui, sans-serif';
const FONT_DISPLAY = '"Space Grotesk", -apple-system, system-ui, sans-serif';
const INK          = '#213343';
const CREAM        = '#FFFFFF';
const ORANGE       = '#FF7A59';
const SLATE        = '#516F90';
const MUTED        = '#7C98B6';
const HAIR         = 'rgba(33,51,67,0.08)';

const toolByHref = (h: string): AppTile | undefined => APP_TILES.find((t) => t.href === h);

/* ─────────────────────────────────────────────
   LOGO
───────────────────────────────────────────── */
function Logo({ onClick, small = false }: { onClick?: () => void; small?: boolean }) {
  const badgeSize = small ? 32 : 36;
  const letterSize = small ? 16 : 18;
  const wordSize = small ? 18 : 20;
  return (
    <Link href="/" aria-label="UKDesk — home" onClick={onClick}
          className="flex items-center gap-2.5 flex-shrink-0 group">
      <span
        className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]"
        style={{
          width: badgeSize, height: badgeSize,
          background: INK, borderRadius: 10,
          boxShadow: '0 2px 10px -2px rgba(33,51,67,0.30), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>
        <span aria-hidden
              style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700,
                fontSize: letterSize, color: CREAM,
                letterSpacing: '-0.02em', lineHeight: 1, marginTop: -1,
              }}>U</span>
        <span aria-hidden className="absolute"
              style={{
                right: 4, bottom: 4, width: 5, height: 5,
                background: ORANGE, borderRadius: 2,
                boxShadow: '0 0 0 1.5px ' + INK,
              }} />
      </span>
      <span style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700,
        fontSize: wordSize, color: INK,
        letterSpacing: '-0.025em', lineHeight: 1,
      }}>
        UKDesk<span style={{ color: ORANGE }}>.</span>
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
export default function Header() {
  const pathname = usePathname();
  const [openId, setOpenId]         = useState<CategoryId | null>(null);
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

  const open = useCallback((id: CategoryId) => {
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
          background: '#FFFFFF',
          borderBottom: scrolled ? `1px solid ${HAIR}` : '1px solid transparent',
          fontFamily: FONT,
        }}
        onMouseLeave={startClose}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-6 h-[64px] md:h-[68px] flex items-center gap-1">
          <Logo />

          {/* Desktop nav — 8 categories */}
          <nav className="hidden xl:flex items-center gap-0 flex-1 ml-5" aria-label="Main navigation">
            {CATEGORIES.map((cat) => {
              const isOpen = openId === cat.id;
              const onCategoryRoute = pathname.startsWith(`/${cat.id}`);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => open(cat.id)}
                  onFocus={() => open(cat.id)}
                  onClick={() => setOpenId(isOpen ? null : cat.id)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className="relative inline-flex items-center gap-1 h-10 px-3 rounded-lg transition-colors duration-100"
                  style={{
                    fontFamily: FONT, fontSize: 14,
                    fontWeight: isOpen || onCategoryRoute ? 600 : 500,
                    color: isOpen || onCategoryRoute ? INK : SLATE,
                  }}
                  onMouseOver={(e) => { if (!isOpen) e.currentTarget.style.color = INK; }}
                  onMouseOut={(e)  => { if (!isOpen && !onCategoryRoute) e.currentTarget.style.color = SLATE; }}
                >
                  {CATEGORY_NAV_LABEL[cat.id]}
                  <ChevronDown
                    className="w-3 h-3 transition-transform duration-150"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.55 }}
                  />
                </button>
              );
            })}

            <span aria-hidden style={{ width: 1, height: 18, background: HAIR, margin: '0 10px' }} />

            <Link href="/about"
                  onMouseEnter={() => setOpenId(null)}
                  className="inline-flex items-center h-10 px-3 rounded-lg transition-colors duration-100"
                  style={{
                    fontFamily: FONT, fontSize: 14,
                    fontWeight: pathname.startsWith('/about') ? 600 : 500,
                    color: pathname.startsWith('/about') ? INK : SLATE,
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = INK; }}
                  onMouseOut={(e)  => { if (!pathname.startsWith('/about')) e.currentTarget.style.color = SLATE; }}>
              About
            </Link>
            <Link href="/news"
                  onMouseEnter={() => setOpenId(null)}
                  className="inline-flex items-center h-10 px-3 rounded-lg transition-colors duration-100"
                  style={{
                    fontFamily: FONT, fontSize: 14,
                    fontWeight: pathname.startsWith('/news') ? 600 : 500,
                    color: pathname.startsWith('/news') ? INK : SLATE,
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = INK; }}
                  onMouseOut={(e)  => { if (!pathname.startsWith('/news')) e.currentTarget.style.color = SLATE; }}>
              News
            </Link>
          </nav>

          {/* Right side: mobile hamburger only — no CTA */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="xl:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: INK }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(33,51,67,0.05)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mega panel */}
        <CategoryMegaPanel
          openId={openId}
          pathname={pathname}
          onClose={() => setOpenId(null)}
          onMouseEnter={cancelClose}
          onMouseLeave={startClose}
        />
      </header>

      {/* Desktop backdrop */}
      <div
        className="fixed inset-0 z-40 hidden xl:block transition-opacity duration-200"
        style={{
          top: 68,
          background: 'rgba(33,51,67,0.10)',
          backdropFilter: 'blur(2px)',
          opacity: openId ? 1 : 0,
          pointerEvents: openId ? 'auto' : 'none',
        }}
        onClick={() => setOpenId(null)}
        aria-hidden="true"
      />

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-50 xl:hidden transition-opacity duration-200"
        style={{
          background: 'rgba(33,51,67,0.50)',
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
   DESKTOP MEGA PANEL
───────────────────────────────────────────── */
function CategoryMegaPanel({
  openId, pathname, onClose, onMouseEnter, onMouseLeave,
}: {
  openId: CategoryId | null;
  pathname: string;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute left-0 right-0 top-full hidden xl:block"
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
          background: '#FFFFFF',
          borderTop: `1px solid ${HAIR}`,
          boxShadow: '0 28px 60px -12px rgba(33,51,67,0.18), 0 8px 22px -10px rgba(33,51,67,0.08)',
        }}
      >
        {openId && <CategoryPanelBody categoryId={openId} pathname={pathname} onClose={onClose} />}
      </div>
    </div>
  );
}

function CategoryPanelBody({
  categoryId, pathname, onClose,
}: {
  categoryId: CategoryId; pathname: string; onClose: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === categoryId)!;
  const groups = CATEGORY_SUBGROUPS[categoryId];
  const cols = Math.min(groups.length, 4);

  return (
    <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-9">
      <div className="flex items-baseline justify-between mb-7" style={{ borderBottom: `1px solid ${HAIR}`, paddingBottom: 12 }}>
        <div>
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE,
            marginBottom: 6,
          }}>
            Category
          </p>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 22, color: INK, letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            {cat.label}
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 13.5, color: SLATE, marginTop: 4 }}>
            {cat.description}
          </p>
        </div>
      </div>

      <div
        className="grid gap-6 lg:gap-8"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {groups.map((g) => (
          <SubgroupBlock key={g.label} group={g} pathname={pathname} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

function SubgroupBlock({
  group, pathname, onClose,
}: {
  group: { label: string; toolHrefs: string[] };
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div>
      <p style={{
        fontFamily: FONT, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED,
        marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${HAIR}`,
      }}>
        {group.label}
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {group.toolHrefs.map((href) => {
          const t = toolByHref(href);
          if (!t) return null;
          const isActive = pathname === href;
          return (
            <li key={href} style={{ marginBottom: 2 }}>
              <Link
                href={href}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 8, padding: '8px 10px', borderRadius: 8,
                  textDecoration: 'none',
                  background: isActive ? 'rgba(255,122,89,0.07)' : 'transparent',
                  transition: 'background 100ms',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(33,51,67,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'rgba(255,122,89,0.07)' : 'transparent'; }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{
                      fontFamily: FONT, fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                      color: isActive ? ORANGE : INK,
                    }}
                          className="truncate">
                      {t.label}
                    </span>
                    {t.status === 'new' && (
                      <span style={{
                        fontFamily: FONT, fontSize: 9, fontWeight: 700,
                        letterSpacing: '0.10em', textTransform: 'uppercase',
                        background: 'rgba(255,122,89,0.10)', color: ORANGE,
                        padding: '2px 5px', borderRadius: 4,
                      }} className="flex-shrink-0">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ═════════════════════════════════════════════
   MOBILE DRAWER — drill-down navigation
═════════════════════════════════════════════ */
function MobileDrawer({
  open, onClose, pathname,
}: {
  open: boolean; onClose: () => void; pathname: string;
}) {
  const [view, setView] = useState<
    | { kind: 'root' }
    | { kind: 'category'; id: CategoryId }
  >({ kind: 'root' });

  useEffect(() => {
    if (!open) setTimeout(() => setView({ kind: 'root' }), 280);
  }, [open]);

  const back = () => setView({ kind: 'root' });

  return (
    <aside
      className="fixed top-0 right-0 bottom-0 z-50 w-[92%] max-w-[420px] xl:hidden flex flex-col overflow-hidden"
      style={{
        background: CREAM,
        fontFamily: FONT,
        boxShadow: '-12px 0 50px rgba(33,51,67,0.18)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 240ms cubic-bezier(0.32,0.72,0,1)',
      }}
      role="dialog" aria-modal="true" aria-label="Main navigation"
    >
      <div className="flex items-center justify-between px-5 h-[64px] flex-shrink-0"
           style={{ borderBottom: `1px solid ${HAIR}` }}>
        {view.kind === 'root' ? (
          <Logo onClick={onClose} small />
        ) : (
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-1.5 -ml-1 px-2 h-10 rounded-lg transition-colors"
            style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: INK }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(33,51,67,0.05)'; }}
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
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(33,51,67,0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <X className="w-[18px] h-[18px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view.kind === 'root' && (
          <DrawerRoot pathname={pathname} onDrill={(id) => setView({ kind: 'category', id })} onClose={onClose} />
        )}
        {view.kind === 'category' && (
          <DrawerCategory categoryId={view.id} pathname={pathname} onClose={onClose} />
        )}
      </div>
    </aside>
  );
}

function DrawerRoot({
  pathname, onDrill, onClose,
}: {
  pathname: string;
  onDrill: (id: CategoryId) => void;
  onClose: () => void;
}) {
  return (
    <div className="p-4 space-y-1">
      <p style={{
        fontFamily: FONT, fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED,
        padding: '8px 12px 4px',
      }}>
        Categories
      </p>
      {CATEGORIES.map((c) => {
        const count = APP_TILES.filter((t) => t.category === c.id).length;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onDrill(c.id)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left transition-colors"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(33,51,67,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
                letterSpacing: '-0.012em', color: INK,
              }}>
                {c.label}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 12.5, color: MUTED, marginTop: 2 }}>
                {c.description}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span style={{
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 11, fontWeight: 500, color: MUTED,
              }}>
                {count}
              </span>
              <ChevronDown className="w-4 h-4 -rotate-90" style={{ color: MUTED }} />
            </div>
          </button>
        );
      })}

      <div className="my-3 mx-2" style={{ height: 1, background: HAIR }} />

      <p style={{
        fontFamily: FONT, fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED,
        padding: '8px 12px 4px',
      }}>
        More
      </p>
      {[
        { href: '/about', label: 'About UKDesk', desc: 'Independent editorial' },
        { href: '/news',  label: 'News',         desc: 'UK rule + fee updates' },
      ].map((l) => {
        const isOn = pathname === l.href || pathname.startsWith(l.href + '/');
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors"
            style={{ background: isOn ? 'rgba(255,122,89,0.07)' : 'transparent' }}
          >
            <div>
              <div style={{
                fontFamily: FONT, fontSize: 14.5, fontWeight: 600,
                color: isOn ? ORANGE : INK,
              }}>
                {l.label}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED, marginTop: 2 }}>
                {l.desc}
              </div>
            </div>
            <ArrowRight className="w-4 h-4" style={{ color: MUTED }} />
          </Link>
        );
      })}
    </div>
  );
}

function DrawerCategory({
  categoryId, pathname, onClose,
}: {
  categoryId: CategoryId; pathname: string; onClose: () => void;
}) {
  const cat    = CATEGORIES.find((c) => c.id === categoryId)!;
  const groups = CATEGORY_SUBGROUPS[categoryId];

  return (
    <div className="p-4">
      <p style={{
        fontFamily: FONT, fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE,
        padding: '0 4px',
      }}>
        Category
      </p>
      <h2 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24,
        letterSpacing: '-0.025em', color: INK, marginTop: 4, padding: '0 4px',
      }}>
        {cat.label}
      </h2>
      <p style={{ fontFamily: FONT, fontSize: 13.5, color: SLATE, marginTop: 4, padding: '0 4px' }}>
        {cat.description}
      </p>

      <div className="mt-5">
        {groups.map((g) => (
          <div key={g.label} className="mb-5">
            <p style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED,
              padding: '0 8px', marginBottom: 6,
            }}>
              {g.label}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {g.toolHrefs.map((href) => {
                const t = toolByHref(href);
                if (!t) return null;
                const isOn = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className="flex items-start justify-between gap-3 px-3 py-3 rounded-xl transition-colors"
                      style={{ background: isOn ? 'rgba(255,122,89,0.07)' : 'transparent' }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span style={{
                            fontFamily: FONT, fontSize: 14, fontWeight: 600,
                            color: isOn ? ORANGE : INK,
                          }}>
                            {t.label}
                          </span>
                          {t.status === 'new' && (
                            <span style={{
                              fontFamily: FONT, fontSize: 9, fontWeight: 700,
                              letterSpacing: '0.10em', textTransform: 'uppercase',
                              background: 'rgba(255,122,89,0.10)', color: ORANGE,
                              padding: '2px 5px', borderRadius: 4,
                            }}>
                              New
                            </span>
                          )}
                        </div>
                        <div style={{ fontFamily: FONT, fontSize: 12, color: MUTED, marginTop: 2 }}>
                          {t.hint}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: MUTED }} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
