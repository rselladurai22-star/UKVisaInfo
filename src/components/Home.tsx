/**
 * UKDesk — Vivid home page (server component).
 * 6 sections; the hero search is the only client island (<HomeSearch/>).
 * Tiles + counts are driven by the tools.ts registry.
 */

import type { CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ShieldCheck, PoundSterling, Eye,
  Wallet, Home as HomeIcon, Plane, Briefcase, Landmark, Building2, Users, Car, Baby, Globe,
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../data/tools';
import HomeSearch from './HomeSearch';
import s from './Home.module.css';

const CAT: Record<CategoryId, { c: number; Icon: typeof Wallet; hint: string }> = {
  tax:         { c: 1, Icon: Wallet,    hint: 'PAYE, NI, dividends and the codes on your payslip.' },
  property:    { c: 2, Icon: HomeIcon,  hint: 'Stamp duty, mortgages, council tax and renting.' },
  immigration: { c: 3, Icon: Plane,     hint: 'Every UK visa route, fees and time to settlement.' },
  employment:  { c: 4, Icon: Briefcase, hint: 'Holiday, redundancy, maternity and sick pay.' },
  savings:     { c: 5, Icon: Landmark,  hint: 'ISAs, LISAs, pension drawdown and growth.' },
  business:    { c: 6, Icon: Building2, hint: 'Sole trader vs Ltd, IR35 and day-rate maths.' },
  benefits:    { c: 7, Icon: Users,     hint: 'Child benefit, childcare and family support.' },
  vehicles:    { c: 8, Icon: Car,       hint: 'ULEZ, MOT, company car and running costs.' },
};
const count = (id: CategoryId) => APP_TILES.filter((t) => t.category === id).length;
const tileVars = (c: number): CSSProperties => ({
  ['--tc']: `var(--uk-c${c})`,
  ['--tcbg']: `var(--uk-c${c}-bg)`,
  ['--tctx']: `var(--uk-c${c}-tx)`,
} as CSSProperties);

const MOST_USED = [
  { href: '/take-home-pay', label: 'Take-home pay', hint: 'After tax & NI', c: 1, Icon: Wallet },
  { href: '/stamp-duty-calculator', label: 'Stamp duty', hint: 'SDLT 2026', c: 2, Icon: HomeIcon },
  { href: '/visa/skilled-worker', label: 'Skilled Worker visa', hint: '£41,700 route', c: 3, Icon: Plane },
  { href: '/isa-calculator', label: 'ISA growth', hint: '£20k allowance', c: 5, Icon: Landmark },
  { href: '/child-benefit-calculator', label: 'Child benefit', hint: 'HICBC taper', c: 7, Icon: Baby },
  { href: '/mortgage-affordability', label: 'Mortgage', hint: 'Max you can borrow', c: 2, Icon: HomeIcon },
  { href: '/national-insurance', label: 'National Insurance', hint: 'Employee & self-emp.', c: 1, Icon: Users },
  { href: '/mot-check', label: 'MOT & tax check', hint: 'Any UK reg plate', c: 8, Icon: Car },
];

const SITUATIONS: { title: string; sd: string; c: number; Icon: typeof Wallet; links: [string, string][] }[] = [
  { title: 'Moving to the UK', sd: 'Visas, costs and getting set up.', c: 3, Icon: Globe, links: [['/visa-types', 'Visa routes'], ['/ihs-calculator', 'IHS surcharge'], ['/cost-of-living-uk', 'Cost of living'], ['/postcode', 'Postcode lookup']] },
  { title: 'Buying a home', sd: 'From offer to completion.', c: 2, Icon: HomeIcon, links: [['/stamp-duty-calculator', 'Stamp duty'], ['/mortgage-affordability', 'Mortgage'], ['/council-tax-band', 'Council tax'], ['/overpayment-mortgage', 'Overpayment']] },
  { title: 'Having a baby', sd: 'Leave, pay and support.', c: 7, Icon: Baby, links: [['/maternity-pay', 'Maternity pay'], ['/child-benefit-calculator', 'Child benefit'], ['/childcare-calculator', 'Childcare costs']] },
  { title: 'Going self-employed', sd: 'Tax, structure and take-home.', c: 1, Icon: Briefcase, links: [['/sole-trader-vs-limited', 'Sole trader vs Ltd'], ['/ir35-calculator', 'IR35'], ['/contractor-day-rate', 'Day rate'], ['/self-assessment-calculator', 'Self assessment']] },
];

const GUIDES = [
  { slug: 'uk-skilled-worker-visa-salary-threshold-2026', tag: 'Visa guide', c: 3, title: 'Skilled Worker visa salary thresholds 2026', desc: 'The full SOC breakdown and how the minimum salary is worked out by role.', meta: '14 Apr 2026 · 12 min read' },
  { slug: 'uk-family-visa-minimum-income-2026-what-counts', tag: 'Visa guide', c: 1, title: 'Family visa £29,000 income — what counts', desc: 'Which income sources qualify, and how to evidence them for a clean approval.', meta: '2 Apr 2026 · 9 min read' },
  { slug: 'uk-ilr-indefinite-leave-to-remain-2026-requirements', tag: 'Settlement', c: 2, title: 'ILR 2026 — indefinite leave to remain', desc: 'Absences, the qualifying period, biometrics and the application process explained.', meta: '28 Mar 2026 · 14 min read' },
];

const WHY = [
  { Icon: ShieldCheck, title: 'Sourced from primary records', body: 'Every figure traces back to GOV.UK, HMRC, ONS or the Bank of England. Where a rule has nuance, we link to the page that says so.' },
  { Icon: PoundSterling, title: 'Free, no sign-up, no upsell', body: 'No accounts, no email harvesting, no consultancy funnel. Funded by a few unobtrusive ads — so the tools stay free, and the calculations stay clean.' },
  { Icon: Eye, title: 'Plain English, built to read', body: 'Jargon translated, one idea at a time. Generous typography, strong contrast and keyboard-friendly — accessible to everyone the original rules left behind.' },
];

export default function Home() {
  return (
    <div className={s.page}>
      {/* HERO */}
      <section className={s.hero}>
        <div className={s.wrap}>
          <span className={`${s.pill} ${s.rise}`}><i aria-hidden />{APP_TILES.length}&nbsp;free tools · verified May 2026</span>
          <h1 className={s.rise} style={{ animationDelay: '.08s' }}>Everything for UK life, <em>made simple.</em></h1>
          <p className={`${s.deck} ${s.rise}`} style={{ animationDelay: '.16s' }}>
            Calculators, visa routes and plain-English rule explainers for everyday UK admin — all free, and checked against GOV.UK, HMRC and ONS.
          </p>
          <div className={s.rise} style={{ animationDelay: '.24s' }}><HomeSearch /></div>
        </div>
      </section>

      {/* MOST USED */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div><span className={s.eyebrow}>Most used</span><h2>Jump straight to a tool.</h2></div>
            <Link className={s.seeAll} href="/tools">See all {APP_TILES.length} <ArrowRight size={15} /></Link>
          </div>
          <div className={s.usedGrid}>
            {MOST_USED.map((t) => { const Icon = t.Icon; return (
              <Link key={t.href + t.label} href={t.href} className={s.usedCard}>
                <span className={s.usedIc} style={{ background: `var(--uk-c${t.c})` }}><Icon size={19} /></span>
                <span className={s.usedTxt}><span className={s.usedTt}>{t.label}</span><span className={s.usedHt}>{t.hint}</span></span>
                <ArrowRight className={s.usedArr} size={17} />
              </Link>
            ); })}
          </div>
        </div>
      </section>

      {/* TOPIC TILES */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div><span className={s.eyebrow}>Browse by topic</span><h2>Eight areas of UK life.</h2></div>
            <Link className={s.seeAll} href="/tools">See all {APP_TILES.length} tools <ArrowRight size={15} /></Link>
          </div>
          <div className={s.grid}>
            {CATEGORIES.map((cat) => { const m = CAT[cat.id]; const Icon = m.Icon; return (
              <Link key={cat.id} href="/tools" className={s.tile} style={tileVars(m.c)}>
                <span className={s.cnt}>{count(cat.id)}</span>
                <span className={s.tileIc}><Icon size={22} /></span>
                <h3>{cat.label}</h3>
                <p>{m.hint}</p>
                <span className={s.tileGo}>Explore <ArrowRight size={15} /></span>
              </Link>
            ); })}
          </div>
        </div>
      </section>

      {/* LIFE SITUATION */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div><span className={s.eyebrow}>Where are you in life?</span><h2>Start with your situation.</h2>
              <p className={s.subtitle}>Not sure which tool you need? Pick what&rsquo;s happening — we line up the rest.</p>
            </div>
          </div>
          <div className={s.sitGrid}>
            {SITUATIONS.map((sit) => { const Icon = sit.Icon; return (
              <div key={sit.title} className={s.sit}>
                <span className={s.sitIc} style={{ background: `var(--uk-c${sit.c})` }}><Icon size={24} /></span>
                <div>
                  <h3>{sit.title}</h3>
                  <p className={s.sd}>{sit.sd}</p>
                  <div className={s.links}>{sit.links.map(([href, label]) => (<Link key={href} href={href}>{label}</Link>))}</div>
                </div>
              </div>
            ); })}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className={`${s.sec} ${s.band}`}>
        <div className={s.wrap}>
          <div className={s.head}><div><span className={s.eyebrow}>Why UKDesk</span><h2>Trustworthy by design.</h2></div></div>
          <div className={s.whyGrid}>
            {WHY.map((w) => { const Icon = w.Icon; return (
              <div key={w.title} className={s.why}>
                <span className={s.whyIc}><Icon size={22} /></span>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ); })}
          </div>
          <div className={s.whyFoot}>
            <ShieldCheck size={15} />
            <span>Verified against GOV.UK, HMRC &amp; ONS · Last updated May 2026 · <Link href="/editorial-policy">Editorial policy</Link></span>
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className={s.sec}>
        <div className={s.wrap}>
          <div className={s.head}>
            <div><span className={s.eyebrow}>In-depth reading</span><h2>Latest guides.</h2></div>
            <Link className={s.seeAll} href="/blog">All guides <ArrowRight size={15} /></Link>
          </div>
          <div className={s.guidesGrid}>
            {GUIDES.map((g) => (
              <Link key={g.slug} href={`/blog/${g.slug}`} className={s.guide}>
                <span className={s.guideTop} style={{ background: `var(--uk-c${g.c})` }} />
                <span className={s.guideBody}>
                  <span className={s.guideTag} style={{ color: `var(--uk-c${g.c}-tx)` }}>{g.tag}</span>
                  <h3>{g.title}</h3>
                  <p>{g.desc}</p>
                  <span className={s.guideMeta}>{g.meta}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
