'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, Search, X, Home } from 'lucide-react';
import { CATEGORIES, type CategoryId } from '../../data/tools';
import { HUB_TOOLS, type HubItem } from '../../data/hubTools';

interface FlatTool extends HubItem { category: CategoryId }

const CAT_TOOLS = (id: CategoryId): HubItem[] => (HUB_TOOLS[id] ?? []).flatMap((g) => g.items);
const ALL_TOOLS: FlatTool[] = CATEGORIES.flatMap((c) => CAT_TOOLS(c.id).map((it) => ({ ...it, category: c.id })));
const LIVE_TOTAL = ALL_TOOLS.filter((t) => t.status === 'live').length;
const TOTAL = ALL_TOOLS.length;
const liveCount = (id: CategoryId) => CAT_TOOLS(id).filter((t) => t.status === 'live').length;

export default function ToolsClient() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<CategoryId | 'all'>('all');
  const q = query.trim().toLowerCase();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Categories to render, each with its (optionally filtered) tools.
  const sections = useMemo(() => {
    return CATEGORIES
      .filter((c) => active === 'all' || c.id === active)
      .map((c) => {
        let items = CAT_TOOLS(c.id);
        if (q) items = items.filter((t) => t.label.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q));
        // live first
        items = [...items].sort((a, b) => (a.status === b.status ? 0 : a.status === 'live' ? -1 : 1));
        return { cat: c, items };
      })
      .filter((s) => s.items.length > 0);
  }, [q, active]);

  const shownLive = sections.reduce((n, s) => n + s.items.filter((i) => i.status === 'live').length, 0);
  const shownSoon = sections.reduce((n, s) => n + s.items.filter((i) => i.status === 'soon').length, 0);

  return (
    <main className="bg-surface text-on-surface min-h-screen">
      <div className="container-page pt-7 sm:pt-10 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
          <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">All Tools</span>
        </nav>

        {/* Header */}
        <header className="mb-5">
          <h1 className="text-[26px] leading-tight sm:text-4xl font-display font-bold tracking-tight">All UK Calculators</h1>
          <p className="mt-2 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            {LIVE_TOTAL} live calculators ({TOTAL} planned) across {CATEGORIES.length} categories — money, property,
            tax and visas. Checked against GOV.UK, HMRC and ONS. No sign-up.
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators…"
            className="w-full pl-12 pr-12 py-3 sm:py-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm sm:text-base shadow-soft focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant"><X className="h-4 w-4" /></button>
          ) : (
            <span className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] text-on-surface-variant">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant font-mono">K</kbd>
            </span>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-scrollbar">
          <Chip active={active === 'all'} onClick={() => setActive('all')} label="All" count={LIVE_TOTAL} />
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={active === c.id} onClick={() => setActive(c.id)} label={c.label} count={liveCount(c.id)} color={c.color} />
          ))}
        </div>

        {/* Count / reset */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <p className="text-xs font-semibold text-on-surface-variant">
            <span className="text-on-surface">{shownLive}</span> live{shownSoon > 0 && <span className="opacity-70"> · {shownSoon} soon</span>}{q && <> for &ldquo;{query}&rdquo;</>}
          </p>
          {(q || active !== 'all') && (
            <button onClick={() => { setQuery(''); setActive('all'); }} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">Reset <X className="h-3.5 w-3.5" /></button>
          )}
        </div>

        {/* Sections — every tool listed, grouped by category */}
        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center">
            <p className="text-sm font-semibold">No tools match &ldquo;{query}&rdquo;.</p>
            <button onClick={() => setQuery('')} className="mt-2 text-sm font-semibold text-primary hover:underline">Clear search</button>
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map(({ cat, items }) => {
              const Icon = cat.icon;
              return (
                <section key={cat.id}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cat.color}14`, color: cat.color }}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <h2 className="text-sm font-display font-bold">{cat.label}</h2>
                    <span className="text-[11px] text-on-surface-variant">{items.filter((i) => i.status === 'live').length} live</span>
                    <Link href={`/category/${cat.id}`} className="ml-auto text-[11px] font-bold uppercase tracking-wider hover:underline flex items-center gap-0.5" style={{ color: cat.color }}>
                      Hub <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {items.map((t) => <CompactTool key={t.href + t.label} tool={t} color={cat.color} />)}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function Chip({ active, onClick, label, count, color }: { active: boolean; onClick: () => void; label: string; count?: number; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active ? 'text-white border-transparent' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary/50'
      }`}
      style={active ? { background: color ?? 'var(--uk-primary, #0037b0)' } : undefined}
    >
      {label}{count != null && <span className={active ? 'opacity-80' : 'opacity-60'}> · {count}</span>}
    </button>
  );
}

function CompactTool({ tool, color }: { tool: HubItem; color: string }) {
  if (tool.status === 'soon') {
    return (
      <div className="group relative rounded-lg border border-dashed border-outline-variant bg-surface-container-low/40 px-3 py-2.5 flex items-center gap-3">
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-on-surface-variant truncate">{tool.label}</span>
          <span className="block text-[11px] text-on-surface-variant/70 truncate">{tool.hint}</span>
        </span>
        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-soft text-accent shrink-0">Soon</span>
      </div>
    );
  }
  return (
    <Link
      href={tool.href}
      className="group relative rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 flex items-center gap-3 hover:shadow-md active:scale-[0.99] transition-all overflow-hidden"
    >
      <span className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: color }} />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold truncate group-hover:text-primary transition-colors">{tool.label}</span>
        <span className="block text-[11px] text-on-surface-variant truncate">{tool.hint}</span>
      </span>
      {tool.xref && <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary-soft text-secondary shrink-0">↗</span>}
      <ArrowUpRight className="h-4 w-4 text-on-surface-variant group-hover:text-primary shrink-0 transition-colors" />
    </Link>
  );
}
