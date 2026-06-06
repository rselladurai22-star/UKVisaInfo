'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Search, X, Home } from 'lucide-react';
import { CATEGORIES, type CategoryId } from '../../data/tools';
import { HUB_TOOLS, type HubItem } from '../../data/hubTools';

interface FlatTool extends HubItem { category: CategoryId }

const ALL_TOOLS: FlatTool[] = CATEGORIES.flatMap((c) =>
  (HUB_TOOLS[c.id] ?? []).flatMap((g) => g.items.map((it) => ({ ...it, category: c.id }))),
);
const LIVE_TOTAL = ALL_TOOLS.filter((t) => t.status === 'live').length;
const liveCount = (id: CategoryId) => ALL_TOOLS.filter((t) => t.category === id && t.status === 'live').length;

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

  const results = useMemo(() => {
    let pool = ALL_TOOLS;
    if (active !== 'all') pool = pool.filter((t) => t.category === active);
    if (q) pool = pool.filter((t) => t.label.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q));
    // live first
    return [...pool].sort((a, b) => (a.status === b.status ? 0 : a.status === 'live' ? -1 : 1));
  }, [q, active]);

  const browsing = !q && active === 'all';

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
        <header className="mb-5 sm:mb-7">
          <h1 className="text-[26px] leading-tight sm:text-4xl font-display font-bold tracking-tight">All UK Calculators</h1>
          <p className="mt-2 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            {LIVE_TOTAL} free calculators across {CATEGORIES.length} categories — money, property, tax and visas.
            Checked against GOV.UK, HMRC and ONS. No sign-up.
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
            <button onClick={() => setQuery('')} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] text-on-surface-variant">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant font-mono">K</kbd>
            </span>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap no-scrollbar">
          <Chip active={active === 'all'} onClick={() => setActive('all')} label={`All · ${LIVE_TOTAL}`} />
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={active === c.id} onClick={() => setActive(c.id)} label={c.label} count={liveCount(c.id)} color={c.color} />
          ))}
        </div>

        {/* Body */}
        <div className="mt-6">
          {browsing ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const live = (HUB_TOOLS[c.id] ?? []).flatMap((g) => g.items).filter((t) => t.status === 'live').slice(0, 4);
                return (
                  <div key={c.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-5 shadow-soft flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}14`, color: c.color }}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-sm font-display font-bold leading-tight truncate">{c.label}</h2>
                        <span className="text-[11px] text-on-surface-variant">{liveCount(c.id)} live tools</span>
                      </div>
                    </div>
                    <ul className="space-y-1.5 flex-grow mb-4">
                      {live.map((t) => (
                        <li key={t.href}>
                          <Link href={t.href} className="text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-primary/50 shrink-0" /> {t.label}
                          </Link>
                        </li>
                      ))}
                      {live.length === 0 && <li className="text-xs text-on-surface-variant/70 italic">Coming soon</li>}
                    </ul>
                    <Link href={`/category/${c.id}`} className="mt-auto inline-flex items-center justify-between gap-1 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-colors" style={{ background: `${c.color}12`, color: c.color }}>
                      Open hub <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </section>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-on-surface-variant">
                  {results.filter((t) => t.status === 'live').length} live
                  {results.some((t) => t.status === 'soon') && <span className="opacity-70"> · {results.filter((t) => t.status === 'soon').length} soon</span>}
                  {q && <> for &ldquo;{query}&rdquo;</>}
                </h2>
                {(q || active !== 'all') && (
                  <button onClick={() => { setQuery(''); setActive('all'); }} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                    Reset <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {results.length === 0 ? (
                <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-16 text-center">
                  <p className="text-sm font-semibold">No tools match &ldquo;{query}&rdquo;.</p>
                  <button onClick={() => setQuery('')} className="mt-2 text-sm font-semibold text-primary hover:underline">Clear search</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {results.map((t) => <ToolCard key={t.category + t.href + t.label} tool={t} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Chip({ active, onClick, label, count, color }: { active: boolean; onClick: () => void; label: string; count?: number; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary/50'
      }`}
      style={active && color ? { background: color, borderColor: color } : undefined}
    >
      {label}{count != null && <span className={active ? 'opacity-80' : 'opacity-60'}> · {count}</span>}
    </button>
  );
}

function ToolCard({ tool }: { tool: FlatTool }) {
  const cat = CATEGORIES.find((c) => c.id === tool.category);
  if (tool.status === 'soon') {
    return (
      <div className="bg-surface-container-low/40 border border-dashed border-outline-variant rounded-xl p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-on-surface-variant">{tool.label}</h3>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-soft text-accent shrink-0">Soon</span>
        </div>
        <p className="text-xs text-on-surface-variant/80 leading-relaxed">{tool.hint}</p>
      </div>
    );
  }
  return (
    <Link href={tool.href} className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col hover:border-primary hover:shadow-md active:scale-[0.99] transition-all">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-sm font-bold group-hover:text-primary transition-colors">{tool.label}</h3>
        {cat && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant shrink-0">{cat.label.split(' ')[0]}</span>}
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{tool.hint}</p>
      <span className="mt-auto inline-flex items-center gap-1 text-primary font-bold text-xs">Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" /></span>
    </Link>
  );
}
