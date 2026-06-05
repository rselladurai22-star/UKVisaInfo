import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight, Search, Briefcase, GraduationCap, Users,
  HeartPulse, Star, Award, ShieldCheck, Ban, BookOpen,
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../data/tools';

export const metadata: Metadata = {
  title: 'des-kly.info — UK Tools, Calculators & Visa Guides',
  description:
    'A single, trusted home for UK money, property and visa decisions. 50+ calculators verified against gov.uk, HMRC and ONS.',
  alternates: { canonical: '/' },
};

/* ────────────────────────────────────────────────
   CURATED CONTENT — built from canonical data sets
──────────────────────────────────────────────── */
const STATS = [
  { value: '50+',     label: 'Live calculators' },
  { value: '14',      label: 'UK visa routes' },
  { value: '2026/27', label: 'Tax year ready' },
  { value: '100%',    label: 'gov.uk sourced' },
];

const VISA_ROUTES = [
  { href: '/visa/skilled-worker',     icon: Briefcase,     label: 'Skilled Worker', meta: 'From £41,700 · sponsored route',            cta: 'Check eligibility & fees' },
  { href: '/visa/student',            icon: GraduationCap, label: 'Student Visa',   meta: '£558 fee · degree-level study requirements', cta: 'View requirement checklist' },
  { href: '/visa/family',             icon: Users,         label: 'Family Visa',    meta: '£29,000 income threshold · spouse & partners', cta: 'Calculate income requirement' },
  { href: '/visa/health-care-worker', icon: HeartPulse,    label: 'Health & Care',  meta: 'Lower application fee · NHS IHS exemption',   cta: 'Verify exemption status' },
  { href: '/visa/global-talent',      icon: Star,          label: 'Global Talent',  meta: 'Endorsement route · no salary threshold',     cta: 'Find endorsing bodies' },
  { href: '/visa/graduate',           icon: Award,         label: 'Graduate Visa',  meta: '2 years duration · post-study work',           cta: 'Calculate stay limits' },
];

/* Bento order + one or two sample tool links per category. */
const BENTO_ORDER: CategoryId[] = [
  'tax', 'property', 'business', 'insurance', 'loans',
];

const CATEGORY_LINKS: Record<CategoryId, string[]> = {
  tax:         ['/take-home-pay'],
  employment:  ['/holiday-pay', '/salary-compare'],
  property:    ['/stamp-duty-calculator', '/mortgage-affordability'],
  immigration: ['/visa-types', '/tools/cost-calculator'],
  business:    [],
  savings:     ['/isa-calculator'],
  benefits:    ['/childcare-calculator'],
  vehicles:    ['/mot-check'],
  insurance:   [],
  loans:       [],
  estate:      [],
  'family-law': [],
  energy:      [],
};

const toolByHref = (href: string) => APP_TILES.find((t) => t.href === href);
const liveCount = (id: CategoryId) => APP_TILES.filter((t) => t.category === id).length;

/* Section heading — avoids the .h-2 / Tailwind h-2 (height:0.5rem) collision. */
const H2 =
  'font-display text-[clamp(26px,2.5vw+18px,40px)] font-bold leading-[1.12] tracking-tight text-on-surface [text-wrap:balance]';

/* ────────────────────────────────────────────────
   PAGE
──────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface">
      <Hero />
      <Stats />
      <VisaGrid />
      <BrowseBento />
      <WhyUs />
      <ClosingCta />
    </div>
  );
}

/* ───────────── 1. HERO ───────────── */
const TRENDING = [
  { label: 'Skilled Worker', href: '/visa/skilled-worker' },
  { label: 'Student Visa',   href: '/visa/student' },
  { label: 'Visa Fees',      href: '/tools/cost-calculator' },
  { label: 'IHS Calculator', href: '/ihs-calculator' },
];

function Hero() {
  return (
    <section className="overflow-hidden bg-surface">
      <div className="container-page pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-5 inline-block rounded-full bg-secondary-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
            Updated for tax year 2026/27
          </span>

          <h1 className="h-display mb-6 leading-tight">
            UK life,<br />
            <span className="text-primary">calculated clearly.</span>
          </h1>

          <p className="t-lead mb-10 max-w-xl">
            One trusted home for every UK money, property and visa decision.
            Fifty plus calculators, no sign-ups, no upsells — verified against
            gov.uk, HMRC and ONS.
          </p>

          {/* Search */}
          <form action="/tools" method="get" className="group relative w-full">
            <div
              aria-hidden
              className="absolute inset-0 rounded-xl bg-primary/5 blur-xl transition-all group-focus-within:bg-primary/10"
            />
            <div className="relative flex items-center rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-5 py-3.5 shadow-card">
              <Search className="mr-3 h-5 w-5 flex-none text-primary" />
              <input
                type="search"
                name="q"
                placeholder="Search 50+ visa guides and tools…"
                className="flex-1 border-none bg-transparent text-base text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-0"
              />
              <kbd className="ml-3 hidden items-center rounded border border-outline-variant/30 bg-surface-container-low px-2 text-xs font-medium text-outline md:inline-flex">
                ⌘ K
              </kbd>
            </div>
          </form>

          {/* Trending */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-outline">Trending:</span>
            {TRENDING.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-full bg-surface-container px-3.5 py-1 text-xs font-semibold text-primary transition hover:bg-primary hover:text-surface-container-lowest"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 2. STATS ROW ───────────── */
function Stats() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="container-page flex flex-wrap justify-between gap-8 py-10">
        {STATS.map((s) => (
          <div key={s.label} className="flex min-w-[140px] flex-col gap-1">
            <span className="font-display text-3xl font-bold tracking-tight text-primary tabular-nums sm:text-4xl">
              {s.value}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── 3. FEATURED VISA ROUTES ───────────── */
function VisaGrid() {
  return (
    <section id="visas" className="bg-surface-container-low">
      <div className="container-page section-y">
        <div className="mb-12 max-w-2xl">
          <p className="t-eyebrow mb-2 text-primary">Immigration hub</p>
          <h2 className={`${H2} mb-4`}>Every UK visa route, priced in your currency.</h2>
          <p className="t-body">
            Fees, IHS, dependants, points and settlement clocks — kept current
            with Home Office guidance and shown in plain English.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VISA_ROUTES.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.href}
                href={r.href}
                className="lift-on-hover group flex flex-col rounded-2xl bg-surface-container-lowest p-6 shadow-card hover:shadow-card-hover"
              >
                <div className="mb-6 flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-5 w-5 text-outline transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <h3 className="mb-1 text-xl font-semibold text-on-surface">{r.label}</h3>
                <p className="mb-8 text-sm text-on-surface-variant">{r.meta}</p>
                <div className="mt-auto border-t border-border pt-4">
                  <span className="text-sm font-semibold text-primary">{r.cta}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 4. BROWSE BY TOPIC (BENTO) ───────────── */
function BrowseBento() {
  return (
    <section id="tools" className="bg-surface">
      <div className="container-page section-y">
        <div className="mb-12 text-center">
          <p className="t-eyebrow mb-2 text-primary">Browse by topic</p>
          <h2 className={H2}>Eight focused areas. Every calculator you&apos;ll need.</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {BENTO_ORDER.map((id) => {
            const cat = CATEGORIES.find((c) => c.id === id)!;
            const Icon = cat.icon;
            const count = liveCount(id);
            const links = CATEGORY_LINKS[id]
              .map(toolByHref)
              .filter((t): t is NonNullable<typeof t> => Boolean(t));
            const highlight = id === 'immigration';

            return (
              <article
                key={id}
                className={
                  highlight
                    ? 'flex flex-col rounded-2xl border-2 border-primary bg-primary-soft/40 p-6'
                    : 'flex flex-col rounded-2xl border border-border bg-surface-container-lowest p-6 transition hover:border-primary'
                }
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={
                      highlight
                        ? 'rounded bg-primary px-2 py-1 text-xs font-semibold text-surface-container-lowest'
                        : 'rounded bg-surface-container-high px-2 py-1 text-xs font-semibold text-on-surface-variant'
                    }
                  >
                    {count === 0 ? '0 tools' : `${count} ${count === 1 ? 'tool' : 'tools'}`}
                  </span>
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <h3 className={`mb-1 text-lg font-semibold ${highlight ? 'text-primary' : 'text-on-surface'}`}>
                  {cat.label}
                </h3>
                <p className="mb-4 text-sm text-on-surface-variant">{cat.description}</p>

                {count === 0 ? (
                  <span className="mt-auto text-xs italic text-on-surface-variant">Coming soon</span>
                ) : (
                  <ul className="mt-auto space-y-2">
                    {links.map((t) => (
                      <li key={t.href}>
                        <Link
                          href={t.href}
                          className={`text-sm font-semibold text-primary transition hover:text-primary-container ${
                            highlight ? '' : 'underline decoration-primary/20 underline-offset-2 hover:decoration-primary'
                          }`}
                        >
                          {t.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 5. WHY UKDESK (DARK) ───────────── */
function WhyUs() {
  const ACCENT = '#6ffbbe';
  const items = [
    { icon: ShieldCheck, title: 'Verified sources',        body: 'Every figure traces back to gov.uk, HMRC, DVLA, ONS or the Bank of England.' },
    { icon: Ban,         title: 'No upsells, no sign-ups',  body: 'Free forever. No paywall, no email gate, no affiliate steering inside results.' },
    { icon: BookOpen,    title: 'Plain English first',      body: 'Editorial guides explain the numbers, the rules and where they came from.' },
  ];
  const sources = ['GOV.UK', 'HMRC', 'ONS', 'HOME OFFICE', 'DVLA', 'BANK OF ENGLAND'];

  return (
    <section style={{ background: '#2a313d', color: '#ebf1ff' }}>
      <div className="container-page section-y">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
              Why des-kly.info
            </p>
            <h2 className={`${H2} mb-10`} style={{ color: '#ebf1ff' }}>
              Built like a reference library,<br className="hidden sm:block" /> used like a tool kit.
            </h2>

            <div className="space-y-8">
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <div key={it.title} className="flex gap-5">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10" style={{ color: ACCENT }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="mb-1 text-lg font-semibold" style={{ color: '#ebf1ff' }}>
                        {it.title}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(235,241,255,0.7)' }}>{it.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
                Official data sources
              </p>
              <div className="grid grid-cols-2 gap-4">
                {sources.map((s) => (
                  <div
                    key={s}
                    className="flex h-12 items-center justify-center rounded-lg bg-white/10 px-2 text-center text-xs font-bold"
                    style={{ color: 'rgba(235,241,255,0.9)' }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 6. CLOSING CTA ───────────── */
function ClosingCta() {
  return (
    <section className="bg-surface">
      <div className="container-page section-y text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="h-display mb-4">Find your next answer in seconds.</h2>
          <p className="t-lead mx-auto mb-8 max-w-xl">
            Fifty plus UK calculators, all in one place. Free, ad-light and kept current.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-9 py-4 text-sm font-semibold text-surface-container-lowest transition hover:scale-105"
          >
            Open the tool index
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
