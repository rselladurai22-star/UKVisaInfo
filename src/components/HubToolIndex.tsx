import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { HUB_TOOLS, type HubItem } from '../data/hubTools';
import type { CategoryId } from '../data/tools';

/**
 * Complete, spec-driven listing of every tool in a category hub.
 * Live tools link out; planned tools render as "Soon"; cross-referenced
 * tools carry an `xref` tag. Drop one `<HubToolIndex categoryId="..."/>`
 * into any hub to guarantee the full tool set is on the page.
 */
export default function HubToolIndex({ categoryId }: { categoryId: CategoryId }) {
  const groups = HUB_TOOLS[categoryId];
  if (!groups || groups.length === 0) return null;

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const live = groups.reduce((n, g) => n + g.items.filter((i) => i.status === 'live').length, 0);

  return (
    <section className="container-page pb-20">
      <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-soft/35 flex items-center justify-center text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-on-surface leading-tight">All tools in this hub</h2>
            <p className="text-xs text-on-surface-variant">Every calculator, guide and check in one place.</p>
          </div>
        </div>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container px-2.5 py-1 rounded-md whitespace-nowrap">
          {live} live · {total - live} soon
        </span>
      </div>

      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="mb-4">
              <h3 className="text-base font-display font-bold text-on-surface">{group.title}</h3>
              <p className="text-xs text-on-surface-variant">{group.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <HubToolCard key={item.href + item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Badge({ item }: { item: HubItem }) {
  if (item.xref) {
    return (
      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary-soft text-secondary">
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
      <div className="rounded-xl p-4 border border-dashed border-outline-variant bg-surface-container-low/40 flex flex-col h-full opacity-90">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-bold text-on-surface-variant">{item.label}</h4>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-soft text-accent whitespace-nowrap">
            Soon
          </span>
        </div>
        <p className="text-xs text-on-surface-variant/80 leading-relaxed mb-2">{item.hint}</p>
        {badge && <div className="mt-auto pt-1">{badge}</div>}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="group rounded-xl p-4 border border-outline-variant bg-surface-container-lowest flex flex-col h-full hover:border-primary hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.label}</h4>
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
