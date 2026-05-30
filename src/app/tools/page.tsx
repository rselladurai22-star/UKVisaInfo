import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  ArrowRight, ArrowUpRight, Plane,
  Wallet, Home as HomeIcon, Briefcase, Landmark, Building2, Users, Car,
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../data/tools';
import s from '../../components/calc/calc.module.css';

export const metadata: Metadata = {
  title: 'All UK Calculators & Tools — Tax, Property, Visas, Benefits | UKDesk',
  description:
    'Every free UKDesk tool in one place — take-home pay, stamp duty, mortgage, council tax, dividend & capital gains tax, ISAs, pensions, child benefit, visa fees and more. Checked against GOV.UK, HMRC and ONS.',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'All UK Calculators & Tools — UKDesk',
    description: 'Every free UKDesk calculator and tool, grouped by topic. No sign-up.',
    url: 'https://ukvisainfo.co.uk/tools',
  },
};

const CAT: Record<CategoryId, { c: number; Icon: typeof Wallet }> = {
  tax:         { c: 1, Icon: Wallet },
  property:    { c: 2, Icon: HomeIcon },
  immigration: { c: 3, Icon: Plane },
  employment:  { c: 4, Icon: Briefcase },
  savings:     { c: 5, Icon: Landmark },
  business:    { c: 6, Icon: Building2 },
  benefits:    { c: 7, Icon: Users },
  vehicles:    { c: 8, Icon: Car },
};

// Interactive visa tools that aren't in the APP_TILES registry — surfaced in the Immigration section.
const VISA_TOOLS = [
  { href: '/tools/salary-checker', title: 'Skilled Worker salary checker', hint: 'Your salary vs the visa minimum + going rate, by SOC code' },
  { href: '/tools/sponsor-search', title: 'Sponsor licence search', hint: 'Find licensed UK employers by city, sector and rating' },
  { href: '/tools/compare', title: 'Visa comparison', hint: 'Compare any two routes side by side' },
  { href: '/tools/refusal-analyzer', title: 'Refusal letter analyzer', hint: 'Plain-English breakdown of each refusal ground' },
];

const catVar = (c: number): CSSProperties => ({ ['--tc']: `var(--uk-c${c})`, ['--tctx']: `var(--uk-c${c}-tx)` } as CSSProperties);

export default function ToolsIndex() {
  return (
    <div className={s.page}>
      <div className={s.wrap}>
        <div className={s.crumb}><Link href="/">Home</Link><span className={s.sep}>›</span><span>All tools</span></div>

        <div className={s.toolHead} style={{ maxWidth: 760 }}>
          <span className={s.tag}>Browse everything</span>
          <h1 className={s.h1}>All {APP_TILES.length} tools</h1>
          <p className={s.intro}>Every UKDesk calculator and lookup, grouped by topic — each one checked against GOV.UK, HMRC and ONS. No sign-up.</p>
        </div>

        {/* category jump nav */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 28, borderBottom: '1px solid var(--uk-line)' }}>
          {CATEGORIES.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600,
              color: 'var(--uk-text)', background: 'var(--uk-soft)', border: '1px solid var(--uk-line)',
              padding: '7px 13px', borderRadius: 999, textDecoration: 'none',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: `var(--uk-c${CAT[cat.id].c})` }} />
              {cat.label}
              <span style={{ color: 'var(--uk-muted)', fontVariantNumeric: 'tabular-nums' }}>{APP_TILES.filter((t) => t.category === cat.id).length}</span>
            </a>
          ))}
        </div>

        {/* category sections */}
        {CATEGORIES.map((cat) => {
          const tools = APP_TILES.filter((t) => t.category === cat.id);
          const m = CAT[cat.id];
          const Icon = m.Icon;
          const isImmigration = cat.id === 'immigration';
          return (
            <section key={cat.id} id={cat.id} style={{ scrollMarginTop: 88, paddingTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18 }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: `var(--uk-c${m.c})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <Icon size={22} />
                </span>
                <h2 style={{ fontFamily: 'var(--font-grotesk), sans-serif', fontWeight: 700, fontSize: '1.55rem', letterSpacing: '-0.025em', color: 'var(--uk-ink)', margin: 0 }}>
                  {cat.label}
                </h2>
                <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: 'var(--uk-muted)', fontVariantNumeric: 'tabular-nums' }}>
                  {tools.length + (isImmigration ? VISA_TOOLS.length + 1 : 0)} tools
                </span>
              </div>

              <div className={s.relGrid} style={{ ['--cv' as string]: '' } as CSSProperties}>
                {isImmigration && (
                  <Link href="/visa-types" className={s.relCard} style={{ ...catVar(m.c), background: 'var(--uk-c3-bg)', borderColor: 'transparent' } as CSSProperties}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 7 }}>Visa hub — all routes</h3>
                    <p>Every UK visa route in one place: fees, eligibility, English level and time to settlement.</p>
                    <span style={{ color: 'var(--uk-c3-tx)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                      Open the visa hub <ArrowRight size={14} />
                    </span>
                  </Link>
                )}
                {tools.map((t) => (
                  <Link key={t.href} href={t.href} className={s.relCard}>
                    <h3>{t.label}</h3>
                    <p>{t.hint}</p>
                    <span>Open <ArrowUpRight size={13} /></span>
                  </Link>
                ))}
                {isImmigration && VISA_TOOLS.map((t) => (
                  <Link key={t.href} href={t.href} className={s.relCard}>
                    <h3>{t.title}</h3>
                    <p>{t.hint}</p>
                    <span>Open <ArrowUpRight size={13} /></span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
