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
  const q = query.trim().toLowerCase();
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-fill the search from the ?q= URL param (e.g. the homepage search form
  // submits to /tools?q=...). Without this the query was lost on navigation.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setQuery(q);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Compute categories and their tools matching the search query
  const sections = useMemo(() => {
    return CATEGORIES
      .map((c) => {
        let items = CAT_TOOLS(c.id);
        if (q) {
          items = items.filter(
            (t) =>
              t.label.toLowerCase().includes(q) ||
              t.hint.toLowerCase().includes(q)
          );
        }
        // Live tools first, soon tools second
        items = [...items].sort((a, b) => (a.status === b.status ? 0 : a.status === 'live' ? -1 : 1));
        return { cat: c, items };
      })
      .filter((s) => s.items.length > 0);
  }, [q]);

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

        {/* Count / reset */}
        <div className="flex items-center justify-between mt-4 mb-4.5">
          <p className="text-xs font-semibold text-on-surface-variant">
            <span className="text-on-surface">{shownLive}</span> live{shownSoon > 0 && <span className="opacity-70"> · {shownSoon} soon</span>}{q && <> for &ldquo;{query}&rdquo;</>}
          </p>
          {q && (
            <button onClick={() => setQuery('')} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">Reset <X className="h-3.5 w-3.5" /></button>
          )}
        </div>

        {/* Directory Grid — every tool listed category-wise */}
        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center">
            <p className="text-sm font-semibold">No tools match &ldquo;{query}&rdquo;.</p>
            <button onClick={() => setQuery('')} className="mt-2 text-sm font-semibold text-primary hover:underline">Clear search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {sections.map(({ cat, items }) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-border bg-white p-5 shadow-soft hover:shadow-card hover:border-[#00875A]/60 transition-all duration-300 flex flex-col h-full min-h-[320px]"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-3.5">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${cat.color}14`, color: cat.color }}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[14.5px] font-display font-extrabold text-[#0B2240] truncate leading-tight">
                        {cat.label}
                      </h2>
                      <p className="text-[10.5px] text-on-surface-variant font-medium leading-none mt-0.5">
                        {items.filter((i) => i.status === 'live').length} live tools
                      </p>
                    </div>
                  </div>

                  {/* Category Description */}
                  <p className="text-[12px] text-on-surface-variant leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Tools List */}
                  <div className="space-y-1.5 flex-1">
                    {items.map((t) => (
                      <CompactTool key={t.href + t.label} tool={t} color={cat.color} />
                    ))}
                  </div>

                  {/* Footer link to hub */}
                  <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-end">
                    <Link
                      href={`/category/${cat.id}`}
                      className="text-[11px] font-bold uppercase tracking-wider hover:opacity-85 flex items-center gap-0.5 transition-opacity"
                      style={{ color: cat.color }}
                    >
                      Explore Hub <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function CompactTool({ tool, color }: { tool: HubItem; color: string }) {
  if (tool.status === 'soon') {
    return (
      <div className="group relative rounded-lg border border-dashed border-outline-variant bg-surface-container-low/30 px-3 py-2 flex items-center gap-3">
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] font-semibold text-on-surface-variant truncate">{tool.label}</span>
          <span className="block text-[10.5px] text-on-surface-variant/70 truncate">{tool.hint}</span>
        </span>
        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-soft text-accent shrink-0">Soon</span>
      </div>
    );
  }
  return (
    <Link
      href={tool.href}
      className="group relative rounded-lg border border-border bg-surface-container-lowest px-3 py-2 flex items-center gap-3 hover:border-primary/50 hover:shadow-sm active:scale-[0.99] transition-all overflow-hidden"
    >
      <span className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: color }} />
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-semibold truncate group-hover:text-primary transition-colors">{tool.label}</span>
        <span className="block text-[10.5px] text-on-surface-variant truncate">{tool.hint}</span>
      </span>
      {tool.xref && <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary-soft text-secondary shrink-0">↗</span>}
      <ArrowUpRight className="h-3.5 w-3.5 text-on-surface-variant group-hover:text-primary shrink-0 transition-colors" />
    </Link>
  );
}
