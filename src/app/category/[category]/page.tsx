import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight, ArrowRight, ChevronRight,
  ShieldCheck, Zap, LayoutGrid,
} from 'lucide-react';
import { APP_TILES, CATEGORIES, type CategoryId } from '../../../data/tools';
import { getHubSections } from '../../../lib/categoryMeta';
import HubNav from './HubNav';

type RouteParams = { params: Promise<{ category: string }> };

const VALID = new Set<string>(CATEGORIES.map((c) => c.id));

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};
  const count = APP_TILES.filter((t) => t.category === cat.id).length;
  const title = `${cat.label} calculators & tools — ${count}+ free UK tools | UKDesk`;
  const description = `${cat.description}. ${count} free ${cat.label.toLowerCase()} calculators, each checked against GOV.UK, HMRC and ONS. No sign-up.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${cat.id}` },
    openGraph: { title, description, url: `https://ukvisainfo.co.uk/category/${cat.id}` },
  };
}

export default async function CategoryHub({ params }: RouteParams) {
  const { category } = await params;
  if (!VALID.has(category)) notFound();

  const id = category as CategoryId;
  const cat = CATEGORIES.find((c) => c.id === id)!;
  const Icon = cat.icon;
  const sections = getHubSections(id);
  const total = sections.reduce((n, sec) => n + sec.items.length, 0);

  const tabs = sections.map((sec) => ({ id: sec.id, title: sec.title, count: sec.items.length }));

  return (
    <div className="bg-surface text-on-surface">
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.55]"
          style={{
            background: `radial-gradient(55% 80% at 15% 0%, ${cat.color}1A 0%, transparent 60%), radial-gradient(45% 65% at 95% 10%, #FBF6E714 0%, transparent 65%)`,
          }}
        />

        <div className="mx-auto max-w-6xl px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
            <Link href="/" className="transition hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <Link href="/tools" className="transition hover:text-primary">All tools</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-primary">{cat.label}</span>
          </nav>

          {/* Hero content */}
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-surface-container-lowest shadow-sm"
                  style={{ background: cat.color }}
                  aria-hidden
                >
                  <Icon className="h-7 w-7" />
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-container-lowest px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: cat.color }} />
                  {total} live {total === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl">
                {cat.label}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-on-surface-variant">
                {cat.description}.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                <Chip icon={ShieldCheck}>Checked vs GOV.UK · HMRC · ONS</Chip>
                <Chip icon={Zap}>Runs in your browser</Chip>
                <Chip icon={LayoutGrid}>No sign-up</Chip>
              </ul>
            </div>

            {/* Quick stats */}
            {total > 0 && (
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                <Stat value={total} label={total === 1 ? 'calculator' : 'calculators'} />
                <Stat value={sections.length} label={sections.length === 1 ? 'topic group' : 'topic groups'} />
                <Stat value="2026/27" label="tax year" />
                <Stat value="Free" label="forever" />
              </dl>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── STICKY NAV ───────────── */}
      {total > 0 && (
        <HubNav
          tabs={tabs}
          categories={CATEGORIES.map((x) => ({ id: x.id, label: x.label, color: x.color }))}
          currentId={id}
          currentLabel={cat.label}
          currentColor={cat.color}
        />
      )}

      {/* ───────────── SECTIONS ───────────── */}
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-4">
        {total === 0 ? (
          <EmptyState label={cat.label} />
        ) : (
          sections.map((sec) => (
            <section
              key={sec.id}
              id={`sec-${sec.id}`}
              className="scroll-mt-32 border-t border-border py-14 first:border-t-0 first:pt-12"
            >
              {/* Section header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: cat.color }}
                  >
                    {sec.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-primary sm:text-3xl">
                    {sec.title}
                  </h2>
                  {sec.description && (
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                      {sec.description}
                    </p>
                  )}
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-surface-container-lowest px-3 py-1 text-xs font-semibold text-on-surface-variant sm:self-auto">
                  {sec.items.length} {sec.items.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              {/* Tool grid */}
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sec.items.map((t) => {
                  const ToolIcon = t.icon;
                  return (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className="group flex h-full flex-col rounded-2xl border border-border bg-surface-container-lowest p-6 transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm"
                      >
                        <span
                          className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{
                            background: `color-mix(in srgb, ${t.accent} 12%, transparent)`,
                            color: t.accent,
                          }}
                          aria-hidden
                        >
                          <ToolIcon className="h-5 w-5" />
                        </span>

                        <h3 className="mt-5 text-base font-semibold leading-snug text-primary">
                          {t.label}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                          {t.hint}
                        </p>

                        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                          Open calculator
                          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      {/* ───────────── CLOSING BAR ───────────── */}
      <section className="border-t border-border bg-surface-container-lowest">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-primary">
              Need a different topic?
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Browse the full index of 50+ UK calculators across eight areas.
            </p>
          </div>
          <Link
            href="/tools"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-surface-container-lowest transition hover:opacity-90"
          >
            Browse all tools
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ────────── helpers ────────── */
function Chip({ icon: I, children }: { icon: typeof ShieldCheck; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-container-lowest/80 px-3 py-1.5 text-xs font-medium text-on-surface-variant">
      <I className="h-3.5 w-3.5 text-secondary" />
      {children}
    </li>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-surface-container-lowest px-5 py-5">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
        {label}
      </dt>
      <dd className="mt-1.5 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {value}
      </dd>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface-container-lowest p-8 text-center">
      <h3 className="text-lg font-semibold text-primary">Tools coming soon</h3>
      <p className="mt-2 text-sm text-on-surface-variant">
        We&apos;re building the {label.toLowerCase()} calculators next. In the
        meantime, browse every live UKDesk tool.
      </p>
      <Link
        href="/tools"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary"
      >
        Browse all tools
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
