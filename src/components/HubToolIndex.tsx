import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { HUB_TOOLS, type HubItem } from '../data/hubTools';
import { CATEGORIES, type CategoryId } from '../data/tools';

/**
 * Data-driven category hub: breadcrumb, category header and the full,
 * grouped tool set. Live tools link out; planned tools render as "Soon";
 * cross-referenced tools carry an `xref` tag. This is the entire hub page, 
 * there are no bespoke per-category components, so links never drift.
 */
export default function HubToolIndex({ categoryId }: { categoryId: CategoryId }) {
  const groups = HUB_TOOLS[categoryId];
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!groups || groups.length === 0 || !cat) return null;

  const Icon = cat.icon;
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const live = groups.reduce((n, g) => n + g.items.filter((i) => i.status === 'live').length, 0);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Header */}
      <section className="container-page pt-8 sm:pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/tools" className="hover:text-primary">All Tools</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold truncate">{cat.label}</span>
        </nav>

        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: `${cat.color}14`, color: cat.color }}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight leading-tight">{cat.label}</h1>
            <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">{cat.description}.</p>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md">
          {live} live{total - live > 0 && <span className="opacity-70">· {total - live} coming soon</span>}
        </div>
      </section>

      {/* Tool groups */}
      <section className="container-page pb-16 sm:pb-20 space-y-8 sm:space-y-10">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="mb-3 sm:mb-4 pb-2 border-b border-outline-variant">
              <h2 className="text-base sm:text-lg font-display font-bold text-on-surface">{group.title}</h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">{group.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {group.items.map((item) => (
                <HubToolCard key={item.href + item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Badge({ item }: { item: HubItem }) {
  if (item.xref) {
    return (
      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary-soft text-secondary whitespace-nowrap">
        ↗ {item.xref}
      </span>
    );
  }
  return null;
}

function HubToolCard({ item }: { item: HubItem }) {
  const badge = <Badge item={item} />;

  if (item.status === 'soon') {
    return (
      <div className="rounded-xl p-4 border border-dashed border-outline-variant bg-surface-container-low/40 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-on-surface-variant">{item.label}</h3>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-soft text-accent whitespace-nowrap shrink-0">
            Soon
          </span>
        </div>
        <p className="text-xs text-on-surface-variant/80 leading-relaxed">{item.hint}</p>
        {badge && <div className="mt-2">{badge}</div>}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="group rounded-xl p-4 border border-outline-variant bg-surface-container-lowest flex flex-col hover:border-primary hover:shadow-md active:scale-[0.99] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.label}</h3>
        {badge}
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{item.hint}</p>
      <span className="mt-auto inline-flex items-center gap-1 text-primary font-bold text-xs">
        Open
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}
