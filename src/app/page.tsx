import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight, ArrowUpRight, ShieldCheck, Sparkles,
  Compass, BookOpen, Plane, CheckCircle2,
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../data/tools';

export const metadata: Metadata = {
  title: 'UKDesk — UK Tools, Calculators & Visa Guides',
  description:
    'A single, trusted home for UK money, property and visa decisions. 50+ calculators verified against gov.uk, HMRC and ONS.',
  alternates: { canonical: '/' },
};

/* ────────────────────────────────────────────────
   CURATED CONTENT — built from canonical data sets
──────────────────────────────────────────────── */
const POPULAR_HREFS = [
  '/take-home-pay',
  '/stamp-duty-calculator',
  '/mortgage-affordability',
  '/council-tax-band',
  '/isa-calculator',
  '/tools/cost-calculator',
];

const POPULAR_TOOLS = POPULAR_HREFS
  .map((href) => APP_TILES.find((t) => t.href === href))
  .filter((t): t is NonNullable<typeof t> => Boolean(t));

const CATEGORY_PREVIEW: Record<CategoryId, string[]> = {
  tax:         ['/take-home-pay', '/tax-code', '/national-insurance'],
  employment:  ['/holiday-pay', '/salary-compare', '/redundancy-pay'],
  property:    ['/stamp-duty-calculator', '/mortgage-affordability', '/council-tax-band'],
  savings:     ['/isa-calculator', '/pension-allowance', '/state-pension'],
  business:    ['/sole-trader-vs-limited', '/ir35-calculator', '/contractor-day-rate'],
  immigration: ['/visa-types', '/tools/cost-calculator', '/skilled-worker-points-check'],
  benefits:    ['/child-benefit-calculator', '/childcare-calculator'],
  vehicles:    ['/ulez-check', '/mot-check'],
};

const VISA_ROUTES = [
  { href: '/visa/skilled-worker', label: 'Skilled Worker',     meta: 'From £41,700 · sponsored' },
  { href: '/visa/student',        label: 'Student',            meta: '£558 · degree-level study' },
  { href: '/visa/family',         label: 'Family',             meta: '£29,000 income threshold' },
  { href: '/visa/health-care-worker', label: 'Health & Care',  meta: 'Lower fee · NHS exemption' },
  { href: '/visa/global-talent',  label: 'Global Talent',      meta: 'Endorsement route' },
  { href: '/visa/graduate',       label: 'Graduate',           meta: '2 years · post-study' },
];

const STATS = [
  { value: '50+',   label: 'live calculators' },
  { value: '14',    label: 'UK visa routes' },
  { value: '2026/27', label: 'tax year, up to date' },
  { value: '100%',  label: 'gov.uk sourced' },
];

/* ────────────────────────────────────────────────
   PAGE
──────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface">
      <Hero />
      <Popular />
      <Browse />
      <Immigration />
      <Trust />
      <ClosingCta />
    </div>
  );
}

/* ───────────── 1. HERO ───────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* soft gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.55]"
        style={{
          background:
            'radial-gradient(60% 80% at 15% 0%, #ECFDF5 0%, transparent 60%), radial-gradient(50% 70% at 95% 10%, #FBF6E7 0%, transparent 65%)',
        }}
      />
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          {/* Left — message */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-container-lowest px-3 py-1 text-xs font-medium text-on-surface-variant">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              Updated for tax year 2026/27
            </span>

            <h1 className="mt-6 text-[2.25rem] font-bold leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              UK life,<br />
              calculated&nbsp;clearly.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant">
              One trusted home for every UK money, property and visa decision.
              Fifty plus calculators, no sign-ups, no upsells — verified against
              gov.uk, HMRC and ONS.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/tools"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-surface-container-lowest transition hover:opacity-90"
              >
                Browse all tools
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/visa-types"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-container-lowest px-6 py-3 text-sm font-semibold text-primary transition hover:border-border-strong"
              >
                Explore visa routes
              </Link>
            </div>
          </div>

          {/* Right — stat board */}
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-surface-container-lowest px-4 py-5 sm:px-6 sm:py-7"
              >
                <dt className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant sm:text-xs">
                  {s.label}
                </dt>
                <dd className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-4xl">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 2. POPULAR TOOLS ───────────── */
function Popular() {
  return (
    <section className="border-b border-border bg-surface-container-lowest">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
        <SectionHead
          kicker="Popular this week"
          title="Start with the calculators most people open first."
          link={{ href: '/tools', label: 'See all 50+ tools' }}
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.href} className="bg-surface-container-lowest">
                <Link
                  href={t.href}
                  className="group flex h-full flex-col gap-5 p-7 transition hover:bg-surface-container-low"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${t.accent}14`, color: t.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {t.label}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                      {t.hint}
                    </p>
                  </div>

                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-secondary opacity-0 transition group-hover:opacity-100">
                    Open calculator
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── 3. BROWSE BY CATEGORY ───────────── */
function Browse() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
        <SectionHead
          kicker="Browse by topic"
          title="Eight focused areas. Every calculator you'll need in each."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const previewHrefs = CATEGORY_PREVIEW[cat.id] ?? [];
            const preview = previewHrefs
              .map((h) => APP_TILES.find((t) => t.href === h))
              .filter((t): t is NonNullable<typeof t> => Boolean(t));
            const total = APP_TILES.filter((t) => t.category === cat.id).length;

            return (
              <article
                key={cat.id}
                className="group flex flex-col rounded-2xl border border-border bg-surface-container-lowest p-6 transition hover:border-border-strong hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: `${cat.color}14`, color: cat.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-on-surface-variant">
                    {total} tools
                  </span>
                </div>

                <h3 className="mt-5 text-base font-semibold text-primary">
                  {cat.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                  {cat.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {preview.map((t) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className="flex items-center justify-between text-sm text-on-surface transition hover:text-secondary"
                      >
                        <span className="truncate">{t.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 flex-none opacity-50" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 4. IMMIGRATION SPOTLIGHT ───────────── */
function Immigration() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-primary text-surface">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          background:
            'radial-gradient(40% 60% at 80% 30%, #34D399 0%, transparent 70%), radial-gradient(50% 70% at 10% 90%, #B8860B 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-surface/80">
              <Plane className="h-3.5 w-3.5" />
              Immigration hub
            </span>
            <h2 className="mt-6 text-[1.875rem] font-bold leading-tight tracking-tight sm:text-5xl">
              Every UK visa route,<br />
              priced in your currency.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-surface/70">
              Fees, IHS, dependants, points and settlement clocks — kept current
              with Home Office guidance and shown in plain English.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tools/cost-calculator"
                className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface/90"
              >
                Visa cost calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/eligibility"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-white/10"
              >
                Eligibility quiz
              </Link>
            </div>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {VISA_ROUTES.map((r) => (
              <li key={r.href} className="bg-primary">
                <Link
                  href={r.href}
                  className="group flex items-center justify-between gap-4 px-5 py-5 transition hover:bg-white/[0.04]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface">
                      {r.label}
                    </p>
                    <p className="mt-1 truncate text-xs text-surface/60">
                      {r.meta}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 flex-none text-surface/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-surface" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 5. TRUST ───────────── */
function Trust() {
  const items = [
    {
      icon: ShieldCheck,
      title: 'Verified sources',
      body: 'Every figure traces back to gov.uk, HMRC, DVLA, ONS or the Bank of England.',
    },
    {
      icon: Compass,
      title: 'No upsells, no sign-ups',
      body: 'Free forever. No paywall, no email gate, no affiliate steering inside results.',
    },
    {
      icon: BookOpen,
      title: 'Plain English first',
      body: 'Editorial guides explain the numbers, the rules and where they came from.',
    },
  ];

  return (
    <section className="border-b border-border bg-surface-container-lowest">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
        <SectionHead
          kicker="Why UKDesk"
          title="Built like a reference library, used like a tool kit."
        />

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-primary">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {it.body}
                </p>
              </div>
            );
          })}
        </div>

        <ul className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-8 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
          <li className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            gov.uk
          </li>
          <li className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            HMRC 2026/27
          </li>
          <li className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            ONS
          </li>
          <li className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            DVLA / DVSA
          </li>
          <li className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            Home Office
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ───────────── 6. CLOSING CTA ───────────── */
function ClosingCta() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface-container-lowest p-6 sm:gap-8 sm:p-10 lg:flex-row lg:items-center lg:p-14">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Find your next answer in seconds.
            </h2>
            <p className="mt-3 text-base text-on-surface-variant">
              Fifty plus UK calculators, all in one place. Free, ad-light and
              kept current.
            </p>
          </div>
          <Link
            href="/tools"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-surface-container-lowest transition hover:opacity-90"
          >
            Open the tool index
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────── SHARED — SECTION HEAD ───────────── */
function SectionHead({
  kicker,
  title,
  link,
}: {
  kicker: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
          {kicker}
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-secondary"
        >
          {link.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

