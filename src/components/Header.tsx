'use client';

/**
 * UKDesk — Vivid header (May 2026 redesign)
 * Desktop: CSS-hover mega-menus (Tools / Visas), command-style search, scroll-aware.
 * Mobile: slide-in drawer with accordions. Data-driven from tools.ts.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronDown, Menu, X, ArrowRight,
  Wallet, Home as HomeIcon, Plane, Briefcase, Landmark, Building2, Users, Car,
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../data/tools';
import s from './Header.module.css';

const CAT_META: Record<CategoryId, { c: string; Icon: typeof Wallet; hint: string }> = {
  tax:         { c: 'c1', Icon: Wallet,    hint: 'PAYE, NI, dividends, tax codes' },
  property:    { c: 'c2', Icon: HomeIcon,  hint: 'Stamp duty, mortgage, council tax' },
  immigration: { c: 'c3', Icon: Plane,     hint: 'Visa routes, IHS, points' },
  employment:  { c: 'c4', Icon: Briefcase, hint: 'Holiday, redundancy, sick pay' },
  savings:     { c: 'c5', Icon: Landmark,  hint: 'ISA, LISA, drawdown' },
  business:    { c: 'c6', Icon: Building2, hint: 'Sole trader vs Ltd, IR35' },
  benefits:    { c: 'c7', Icon: Users,     hint: 'Child benefit, childcare' },
  vehicles:    { c: 'c8', Icon: Car,       hint: 'ULEZ, MOT, company car' },
};
const count = (id: CategoryId) => APP_TILES.filter((t) => t.category === id).length;

export default function Header(_props: { onApply?: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [acc, setAcc] = useState<string | null>('tools');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
    <header className={`${s.header} ${scrolled ? s.scrolled : ''}`}>
      <div className={s.bar}>
        <Link href="/" className={s.brand} aria-label="UKDesk — home">
          <span className={s.mark} aria-hidden>U</span>UKDesk
        </Link>

        <ul className={s.menu}>
          <li className={s.hasMega}>
            <button className={s.item} aria-haspopup="true">Tools<ChevronDown className={s.chev} size={15} /></button>
            <div className={`${s.mega} ${s.tools}`}>
              <div className={s.megaInner}>
                <div>
                  <div className={s.megaTitle}>Browse by topic</div>
                  <div className={s.catGrid}>
                    {CATEGORIES.map((cat) => {
                      const m = CAT_META[cat.id]; const Icon = m.Icon;
                      return (
                        <Link key={cat.id} href={cat.id === 'immigration' ? '/visa-types' : `/tools#${cat.id}`} className={s.megaCat}>
                          <span className={s.ic} style={{ background: `var(--uk-${m.c})` }}><Icon size={19} /></span>
                          <span className={s.txt}>
                            <span className={s.nm}>{cat.label}<span className={s.ct}>{count(cat.id)}</span></span>
                            <span className={s.ht}>{m.hint}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className={s.megaSide}>
                  <h5>Most used</h5>
                  <Link href="/take-home-pay" className={s.sideTool}><span className={s.dot} style={{ background: 'var(--uk-c1)' }} /><span className={s.txt}><span className={s.stTt}>Take-home pay</span><span className={s.stHt}>After tax &amp; NI</span></span></Link>
                  <Link href="/stamp-duty-calculator" className={s.sideTool}><span className={s.dot} style={{ background: 'var(--uk-c2)' }} /><span className={s.txt}><span className={s.stTt}>Stamp duty</span><span className={s.stHt}>SDLT 2026</span></span></Link>
                  <Link href="/mortgage-affordability" className={s.sideTool}><span className={s.dot} style={{ background: 'var(--uk-c2)' }} /><span className={s.txt}><span className={s.stTt}>Mortgage</span><span className={s.stHt}>Max you can borrow</span></span></Link>
                  <Link href="/self-assessment-calculator" className={s.promo}>
                    <span className={s.tag}>New</span>
                    <span className={s.pt}>Self Assessment 2026</span>
                    <span className={s.pd}>Multi-income estimate + payments on account.</span>
                    <span className={s.pl}>Try it <ArrowRight size={14} /></span>
                  </Link>
                </div>
                <div className={s.megaFoot}>
                  <Link href="/tools" className={s.lk}>See all {APP_TILES.length} tools <ArrowRight size={15} /></Link>
                  <span className={s.src}>Verified against GOV.UK · HMRC · ONS</span>
                </div>
              </div>
            </div>
          </li>

          <li className={s.hasMega}>
            <button className={s.item} aria-haspopup="true">Visas<ChevronDown className={s.chev} size={15} /></button>
            <div className={`${s.mega} ${s.visas}`}>
              <div className={s.megaInner}>
                <div>
                  <div className={s.megaTitle}>UK visa routes</div>
                  <div className={s.visaCols}>
                    <div className={s.colLinks}>
                      <span className={s.gl}>Work</span>
                      <Link href="/visa/skilled-worker" className={s.rl}>Skilled Worker <small>£41,700</small></Link>
                      <span className={s.gl} style={{ marginTop: 6 }}>Study</span>
                      <Link href="/visa/student" className={s.rl}>Student <small>£558</small></Link>
                      <Link href="/visa/graduate" className={s.rl}>Graduate</Link>
                    </div>
                    <div className={s.colLinks}>
                      <span className={s.gl}>Family</span>
                      <Link href="/visa/family" className={s.rl}>Spouse / partner <small>£29k</small></Link>
                      <span className={s.gl} style={{ marginTop: 6 }}>Settlement</span>
                      <Link href="/visa/ilr" className={s.rl}>Indefinite leave (ILR)</Link>
                      <Link href="/visa/citizenship" className={s.rl}>Citizenship</Link>
                    </div>
                  </div>
                </div>
                <div className={s.megaSide}>
                  <Link href="/eligibility" className={s.promo} style={{ marginTop: 0, background: 'linear-gradient(115deg,#8B5CF6,#6366F1)' }}>
                    <span className={s.tag}>60-second quiz</span>
                    <span className={s.pt}>Not sure which visa?</span>
                    <span className={s.pd}>Answer 6 questions, get matched to the right route.</span>
                    <span className={s.pl}>Start quiz <ArrowRight size={14} /></span>
                  </Link>
                </div>
                <div className={s.megaFoot}>
                  <Link href="/visa-types" className={s.lk}>Compare all routes <ArrowRight size={15} /></Link>
                  <span className={s.src}>2026 Home Office fees</span>
                </div>
              </div>
            </div>
          </li>

          <li><Link className={s.item} href="/blog">Guides</Link></li>
          <li><Link className={s.item} href="/news">News</Link></li>
        </ul>

        <div className={s.actions}>
          <Link href="/tools" className={s.hsearch}><Search size={17} />Search…<span className={s.kbd}>⌘K</span></Link>
          <Link href="/tools" className={s.cta}>Browse all</Link>
          <button className={s.burger} aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={24} /></button>
        </div>
      </div>

      </header>

      {/* mobile drawer — rendered OUTSIDE <header>; the header's backdrop-filter would otherwise become the containing block for these position:fixed elements (trapping them in the 70px bar) */}
      <div className={`${s.scrim} ${open ? s.scrimOpen : ''}`} onClick={() => setOpen(false)} aria-hidden />
      <aside className={`${s.drawer} ${open ? s.drawerOpen : ''}`} aria-label="Menu" aria-hidden={!open}>
        <div className={s.drTop}>
          <Link href="/" className={s.brand} onClick={() => setOpen(false)}><span className={s.mark} aria-hidden>U</span>UKDesk</Link>
          <button className={s.drClose} aria-label="Close menu" onClick={() => setOpen(false)}><X size={24} /></button>
        </div>
        <div className={s.drBody}>
          <Link href="/tools" className={s.drSearch} onClick={() => setOpen(false)}><Search size={18} />Search a tool, visa or postcode…</Link>

          <div className={`${s.acc} ${acc === 'tools' ? s.accOpen : ''}`}>
            <button className={s.accHead} onClick={() => setAcc(acc === 'tools' ? null : 'tools')}>Tools<ChevronDown className={s.chev} size={20} /></button>
            <div className={s.accBody}><div className={s.accInner}>
              {CATEGORIES.map((cat) => { const m = CAT_META[cat.id]; const Icon = m.Icon; return (
                <Link key={cat.id} href={cat.id === 'immigration' ? '/visa-types' : `/tools#${cat.id}`} className={s.dsub} onClick={() => setOpen(false)}>
                  <span className={s.dIc} style={{ background: `var(--uk-${m.c})` }}><Icon size={16} /></span>{cat.label}
                </Link>
              ); })}
              <Link href="/tools" className={s.dsub} style={{ color: 'var(--uk-indigo-strong)', fontWeight: 700 }} onClick={() => setOpen(false)}>See all {APP_TILES.length} tools →</Link>
            </div></div>
          </div>

          <div className={`${s.acc} ${acc === 'visas' ? s.accOpen : ''}`}>
            <button className={s.accHead} onClick={() => setAcc(acc === 'visas' ? null : 'visas')}>Visas<ChevronDown className={s.chev} size={20} /></button>
            <div className={s.accBody}><div className={s.accInner}>
              <Link href="/visa/skilled-worker" className={s.dsub} onClick={() => setOpen(false)}>Skilled Worker visa</Link>
              <Link href="/visa/student" className={s.dsub} onClick={() => setOpen(false)}>Student visa</Link>
              <Link href="/visa/family" className={s.dsub} onClick={() => setOpen(false)}>Family / spouse visa</Link>
              <Link href="/visa/ilr" className={s.dsub} onClick={() => setOpen(false)}>Settlement (ILR)</Link>
              <Link href="/eligibility" className={s.dsub} style={{ color: 'var(--uk-indigo-strong)', fontWeight: 700 }} onClick={() => setOpen(false)}>Eligibility quiz →</Link>
            </div></div>
          </div>

          <Link href="/blog" className={s.flat} onClick={() => setOpen(false)}>Guides</Link>
          <Link href="/news" className={s.flat} onClick={() => setOpen(false)}>News</Link>
          <Link href="/about" className={s.flat} onClick={() => setOpen(false)}>About &amp; sources</Link>
        </div>
        <div className={s.drFoot}><Link href="/tools" className={s.drCta} onClick={() => setOpen(false)}>Browse all {APP_TILES.length} tools</Link></div>
      </aside>
    </>
  );
}
