'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Search, MapPin, Building2, X, Crown, ExternalLink, Filter, Sparkles, Loader2,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

interface RawSponsor {
  n: string;
  c: string;
  o?: string;
  t: 'AP' | 'A' | 'B' | 'PR';
  r: string[];
  g?: string;
}

interface ApiResponse {
  items: RawSponsor[];
  total: number;
  page: number;
  totalPages: number;
}

const RATING_LABEL: Record<string, { label: string; bg: string; text: string }> = {
  AP: { label: 'Premium',     bg: 'rgba(201, 161, 74,0.15)', text: '#9a6800' },
  A:  { label: 'A-rated',    bg: 'rgba(0, 168, 154,0.12)',  text: '#057a55' },
  B:  { label: 'B (limited)', bg: 'rgba(99, 102, 241,0.12)', text: '#009E91' },
  PR: { label: 'Provisional', bg: 'rgba(201, 161, 74,0.12)', text: '#9a6800' },
};

const ROUTE_LABEL: Record<string, string> = {
  SW: 'Skilled Worker',
  HC: 'Health & Care',
  SS: 'Senior or Specialist',
  GT: 'Graduate Trainee',
  IC: 'Intra-Company',
  SU: 'Scale-up',
  MR: 'Minister of Religion',
  SP: 'International Sportsperson',
  TW: 'Temporary Worker',
  CW: 'Charity Worker',
  SE: 'Seasonal Worker',
  YM: 'Youth Mobility',
  IA: 'International Agreement',
  CR: 'Creative Worker',
  RW: 'Religious Worker',
  OT: 'Other',
};

const RATING_OPTIONS = [
  { value: '',   label: 'Any rating' },
  { value: 'AP', label: 'Premium' },
  { value: 'A',  label: 'A-rated' },
  { value: 'B',  label: 'B-rated' },
  { value: 'PR', label: 'Provisional' },
];

const ROUTE_OPTIONS = [
  { value: '',   label: 'Any route' },
  { value: 'SW', label: 'Skilled Worker' },
  { value: 'HC', label: 'Health & Care' },
  { value: 'SS', label: 'Senior or Specialist Worker' },
  { value: 'GT', label: 'Graduate Trainee' },
  { value: 'IC', label: 'Intra-Company' },
  { value: 'SU', label: 'Scale-up' },
];

const PAGE_SIZE = 60;
const DEBOUNCE_MS = 280;

export default function SponsorSearch() {
  const [query,       setQuery]       = useState('');
  const [debouncedQ,  setDebouncedQ]  = useState('');
  const [region,      setRegion]      = useState('');
  const [rating,      setRating]      = useState('');
  const [route,       setRoute]       = useState('SW');
  const [showFilters, setShowFilters] = useState(false);
  const [page,        setPage]        = useState(0);

  const [result,   setResult]   = useState<ApiResponse | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [regions,  setRegions]  = useState<string[]>([]);

  // Debounce the query
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQ(v);
      setPage(0);
    }, DEBOUNCE_MS);
  };

  // Reset page when filters change
  const setFilter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(0);
  };

  // Fetch regions once
  useEffect(() => {
    fetch('/api/sponsors/regions')
      .then((r) => r.ok ? r.json() : [])
      .then(setRegions)
      .catch(() => {});
  }, []);

  // Fetch results whenever search params change
  const fetchResults = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set('q', debouncedQ);
    if (region)     params.set('region', region);
    if (rating)     params.set('rating', rating);
    if (route)      params.set('route', route);
    params.set('page', String(page));
    params.set('size', String(PAGE_SIZE));

    const url = `/api/sponsors?${params.toString()}`;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Server error (${r.status})`);
        return r.json() as Promise<ApiResponse>;
      })
      .then((data) => { if (!cancelled) { setResult(data); setLoading(false); } })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [debouncedQ, region, rating, route, page]);

  useEffect(() => {
    const cancel = fetchResults();
    return cancel;
  }, [fetchResults]);

  const activeFilterCount = [region, rating, route !== 'SW' ? route : ''].filter(Boolean).length;
  const clearFilters = () => { setFilter(setRegion)(''); setFilter(setRating)(''); setFilter(setRoute)('SW'); };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-[88px] md:pt-[104px] pb-10 hero-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-[#18181B]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#18181B]">
              Tool · Sponsor search
            </span>
          </div>
          <h1 className="font-display text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold text-[#18181B] tracking-tight leading-tight">
            UK sponsor licence search
          </h1>
          <p className="mt-3 max-w-2xl text-[#52525B] text-base md:text-lg leading-relaxed">
            Search the complete Home Office register of licensed UK sponsors.{' '}
            <strong className="text-[#18181B]">126,530 organisations</strong> across Skilled
            Worker, Health &amp; Care, Scale-up and other work routes.
          </p>
        </div>
      </section>

      {/* Sticky search bar */}
      <section className="sticky top-[58px] md:top-[72px] z-20 bg-white/85 backdrop-blur-xl border-b border-[rgba(14,20,36,0.06)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center gap-3">
          <div className="relative flex-1">
            {loading
              ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B] animate-spin" />
              : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
            }
            <input
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Company name or city…"
              className="w-full pl-10 pr-10 py-3 bg-[#f3f5fb] focus:bg-white border border-transparent focus:border-[#18181B] rounded-xl text-sm placeholder:text-[#7a8195] outline-none transition-all"
              aria-label="Search sponsors"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setDebouncedQ(''); setPage(0); }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a8195] hover:text-[#18181B]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-[#18181B] text-white'
                : 'bg-[#f3f5fb] text-[#52525B] hover:bg-[#eaeef7]'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-[#6366F1] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="border-t border-[rgba(14,20,36,0.06)] bg-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-4 grid sm:grid-cols-3 gap-3">
              <Select
                label="Route"
                value={route}
                onChange={setFilter(setRoute)}
                options={ROUTE_OPTIONS}
              />
              <Select
                label="Region"
                value={region}
                onChange={setFilter(setRegion)}
                options={[{ value: '', label: 'Any region' }, ...regions.map((r) => ({ value: r, label: r }))]}
              />
              <Select
                label="Rating"
                value={rating}
                onChange={setFilter(setRating)}
                options={RATING_OPTIONS}
              />
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#6366F1] hover:underline"
                >
                  <X className="w-3 h-3" /> Reset filters
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-[rgba(99, 102, 241,0.05)] border border-[rgba(99, 102, 241,0.2)] rounded-2xl p-5 mb-5 text-sm text-[#18181B]">
              <strong className="text-[#009E91]">Error:</strong> {error}. Try refreshing.
            </div>
          )}

          {/* Results header */}
          {result && (
            <div className="flex items-center justify-between mb-5 min-h-[28px]">
              <p className="text-sm text-[#52525B]">
                <span className="font-semibold text-[#18181B] tabular-nums">
                  {result.total.toLocaleString('en-GB')}
                </span>
                {' '}{result.total === 1 ? 'sponsor' : 'sponsors'} found
                {loading && <Loader2 className="inline-block w-3 h-3 ml-2 animate-spin text-[#7a8195]" />}
              </p>
              {result.totalPages > 1 && (
                <p className="text-xs text-[#7a8195] tabular-nums">
                  Page {result.page + 1} of {result.totalPages}
                </p>
              )}
            </div>
          )}

          {/* First load skeleton */}
          {loading && !result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-4 md:p-5 animate-pulse"
                >
                  <div className="h-4 bg-[#f3f5fb] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#f3f5fb] rounded w-1/2 mb-4" />
                  <div className="h-2 bg-[#f3f5fb] rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {result && result.total === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-dashed border-[rgba(14,20,36,0.12)] p-12 text-center">
              <Building2 className="w-10 h-10 text-[#7a8195] mx-auto mb-3 opacity-50" />
              <h3 className="font-display text-lg font-bold text-[#18181B] mb-1">
                No sponsors match your search
              </h3>
              <p className="text-sm text-[#7a8195] mb-4">
                Try a broader search term or different filters.
              </p>
            </div>
          )}

          {/* Cards */}
          {result && result.items.length > 0 && (
            <ul className={`grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 transition-opacity duration-150 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {result.items.map((s, i) => (
                <SponsorCard key={`${s.n}-${i}`} sponsor={s} />
              ))}
            </ul>
          )}

          {/* Pagination */}
          {result && result.totalPages > 1 && (
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          )}
        </div>
      </section>

      {/* Info */}
      <section className="py-12 md:py-16 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[#18181B] mb-3">
            About this data
          </h2>
          <p className="text-sm text-[#52525B] leading-relaxed">
            This search covers the complete Home Office Register of Licensed Sponsors as of
            mid-May 2026 — 126,530 organisations across Skilled Worker, Health and Care,
            Scale-up, Senior or Specialist Worker, Graduate Trainee and other work routes.
            Searches are processed server-side so only the matching results are sent to your browser.
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-3">
            {[
              { key: 'Premium',     desc: 'Top-tier compliant sponsor.' },
              { key: 'A-rated',     desc: 'Standard compliant sponsor.' },
              { key: 'B-rated',     desc: 'On Home Office action plan. Cannot issue new CoS while B-rated.' },
            ].map((item) => (
              <div key={item.key} className="bg-white rounded-xl border border-[rgba(14,20,36,0.08)] p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#52525B]">{item.key}</div>
                <div className="mt-1 text-sm text-[#18181B] leading-snug">{item.desc}</div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-[#7a8195]">
            Source:{' '}
            <a
              href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#18181B] underline inline-flex items-center gap-1"
            >
              Home Office Register of Licensed Sponsors (Workers)
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#18181B] text-white text-sm font-semibold rounded-xl hover:bg-[#4F46E5] transition-colors"
            >
              How to find a sponsor — full guide
            </Link>
            <Link
              href="/tools/salary-checker"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[rgba(14,20,36,0.12)] text-[#18181B] text-sm font-semibold rounded-xl hover:border-[#18181B] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Check salary threshold
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SponsorCard({ sponsor: s }: { sponsor: RawSponsor }) {
  const r = RATING_LABEL[s.t] ?? RATING_LABEL.A;
  return (
    <li className="bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-4 md:p-5 hover:border-[#18181B] hover:shadow-soft transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#18181B] text-sm md:text-[15px] leading-snug">
            {s.n}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#7a8195]">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {s.c}{s.g ? `, ${s.g}` : (s.o ? `, ${s.o}` : '')}
            </span>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full flex-shrink-0"
          style={{ background: r.bg, color: r.text }}
        >
          {s.t === 'AP' && <Crown className="w-2.5 h-2.5" />}
          {r.label}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-[rgba(14,20,36,0.05)] flex flex-wrap gap-1">
        {s.r.slice(0, 4).map((code) => (
          <span
            key={code}
            className="text-[10px] font-semibold uppercase tracking-wider text-[#52525B] bg-[#f3f5fb] px-1.5 py-0.5 rounded"
          >
            {ROUTE_LABEL[code] ?? code}
          </span>
        ))}
        {s.r.length > 4 && (
          <span className="text-[10px] text-[#7a8195] font-semibold">
            +{s.r.length - 4}
          </span>
        )}
      </div>
    </li>
  );
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  const range = 2;
  const pages: (number | '…')[] = [];

  for (let p = 0; p < totalPages; p++) {
    if (p === 0 || p === totalPages - 1 || Math.abs(p - page) <= range) {
      pages.push(p);
    } else if (Math.abs(p - page) === range + 1) {
      pages.push('…');
    }
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <PagBtn disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Previous">
        <ChevronLeft className="w-4 h-4" />
      </PagBtn>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-[#7a8195]">…</span>
        ) : (
          <PagBtn
            key={p}
            active={p === page}
            onClick={() => onPage(p as number)}
            aria-current={p === page ? 'page' : undefined}
          >
            {(p as number) + 1}
          </PagBtn>
        )
      )}

      <PagBtn disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)} aria-label="Next">
        <ChevronRight className="w-4 h-4" />
      </PagBtn>
    </nav>
  );
}

function PagBtn({
  children,
  active,
  disabled,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] h-9 px-2.5 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-default ${
        active
          ? 'bg-[#18181B] text-white'
          : 'bg-[#f3f5fb] text-[#52525B] hover:bg-[#e6eaf5] hover:text-[#18181B]'
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#52525B]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1.5 px-3 py-2.5 bg-[#f3f5fb] focus:bg-white border border-transparent focus:border-[#18181B] rounded-xl text-sm font-medium text-[#18181B] outline-none transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
