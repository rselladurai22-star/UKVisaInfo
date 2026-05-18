'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search, MapPin, Building2, X, Crown, ExternalLink, Filter, Sparkles, Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface RawSponsor {
  n: string;     // organisation name
  c: string;     // city
  o?: string;    // county (optional)
  t: 'AP' | 'A' | 'B' | 'PR';  // rating
  r: string[];   // route codes
  g?: string;    // region
}

const RATING_LABEL: Record<string, { label: string; bg: string; text: string }> = {
  AP: { label: 'Premium',   bg: 'rgba(255,191,71,0.15)', text: '#9a6800' },
  A:  { label: 'A-rated',   bg: 'rgba(5,150,105,0.12)',  text: '#057a55' },
  B:  { label: 'B (limited)', bg: 'rgba(217,21,43,0.12)', text: '#b8101f' },
  PR: { label: 'Provisional', bg: 'rgba(217,119,6,0.12)',  text: '#9a6800' },
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

const RATING_FILTER_OPTIONS = [
  { value: '', label: 'Any rating' },
  { value: 'AP', label: 'Premium' },
  { value: 'A',  label: 'A-rated' },
  { value: 'B',  label: 'B-rated' },
  { value: 'PR', label: 'Provisional' },
];

const ROUTE_FILTER_OPTIONS = [
  { value: '', label: 'Any route' },
  { value: 'SW', label: 'Skilled Worker' },
  { value: 'HC', label: 'Health & Care' },
  { value: 'SS', label: 'Senior or Specialist Worker' },
  { value: 'GT', label: 'Graduate Trainee' },
  { value: 'IC', label: 'Intra-Company' },
  { value: 'SU', label: 'Scale-up' },
];

const PAGE_SIZE = 60;

export default function SponsorSearch() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [route, setRoute] = useState<string>('SW');
  const [showFilters, setShowFilters] = useState(false);

  const [data, setData] = useState<RawSponsor[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Lazy-load the full register on first interaction
  useEffect(() => {
    let cancelled = false;
    if (data || loading) return;
    setLoading(true);
    fetch('/sponsors-data.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load sponsor data (${r.status})`);
        return r.json();
      })
      .then((json: RawSponsor[]) => {
        if (!cancelled) setData(json);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [data, loading]);

  // Unique regions from data
  const regions = useMemo(() => {
    if (!data) return [];
    const set = new Set<string>();
    for (const s of data) {
      if (s.g) set.add(s.g);
    }
    return Array.from(set).sort();
  }, [data]);

  // Filter pipeline
  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.filter((s) => {
      if (q && !s.n.toLowerCase().includes(q) && !s.c.toLowerCase().includes(q)) return false;
      if (region && s.g !== region) return false;
      if (rating && s.t !== rating) return false;
      if (route && !s.r.includes(route)) return false;
      return true;
    });
  }, [data, query, region, rating, route]);

  const visible = filtered.slice(0, visibleCount);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, region, rating, route]);

  const activeFilterCount = [region, rating, route !== 'SW' ? route : ''].filter(Boolean).length;
  const clearFilters = () => {
    setRegion(''); setRating(''); setRoute('SW');
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-[88px] md:pt-[104px] pb-10 hero-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-[#2563eb]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2563eb]">
              Tool · Sponsor search
            </span>
          </div>
          <h1 className="font-display text-[1.875rem] sm:text-[2.25rem] md:text-[2.75rem] font-bold text-[#0a1530] tracking-tight leading-tight">
            UK sponsor licence search
          </h1>
          <p className="mt-3 max-w-2xl text-[#52596e] text-base md:text-lg leading-relaxed">
            Search the complete Home Office register of licensed UK
            sponsors. <strong className="text-[#0a1530]">126,530 organisations</strong> across Skilled Worker,
            Health & Care, Scale-up and other work routes.
          </p>
        </div>
      </section>

      {/* Sticky search bar */}
      <section className="sticky top-[58px] md:top-[72px] z-20 bg-white/85 backdrop-blur-xl border-b border-[rgba(14,20,36,0.06)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center gap-3">
          <div className="relative flex-1">
            {loading
              ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52596e] animate-spin" />
              : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52596e]" />
            }
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={loading ? 'Loading sponsor data…' : 'Company name or city…'}
              className="w-full pl-10 pr-10 py-3 bg-[#f3f5fb] focus:bg-white border border-transparent focus:border-[#0a1530] rounded-xl text-sm placeholder:text-[#7a8195] outline-none transition-all"
              aria-label="Search sponsors"
              disabled={loading && !data}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a8195] hover:text-[#0a1530]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-[#0a1530] text-white'
                : 'bg-[#f3f5fb] text-[#52596e] hover:bg-[#eaeef7]'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-[#d9152b] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="border-t border-[rgba(14,20,36,0.06)] bg-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-4 grid sm:grid-cols-3 gap-3">
              <Select label="Route" value={route} onChange={setRoute} options={ROUTE_FILTER_OPTIONS} />
              <Select label="Region" value={region} onChange={setRegion} options={[{ value: '', label: 'Any region' }, ...regions.map((r) => ({ value: r, label: r }))]} />
              <Select label="Rating" value={rating} onChange={setRating} options={RATING_FILTER_OPTIONS} />
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#d9152b] hover:underline"
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
            <div className="bg-[rgba(217,21,43,0.05)] border border-[rgba(217,21,43,0.2)] rounded-2xl p-5 mb-5 text-sm text-[#0a1530]">
              <strong className="text-[#b8101f]">Couldn&apos;t load sponsor data:</strong> {error}. Try refreshing the page.
            </div>
          )}

          {loading && !data ? (
            <div className="bg-white rounded-2xl border border-dashed border-[rgba(14,20,36,0.12)] p-16 text-center">
              <Loader2 className="w-8 h-8 text-[#2563eb] mx-auto mb-3 animate-spin" />
              <h3 className="font-display text-base font-bold text-[#0a1530]">
                Loading sponsor register…
              </h3>
              <p className="text-sm text-[#7a8195] mt-1.5">
                One-time load of 126,530 records. Cached after first visit.
              </p>
            </div>
          ) : data ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-[#52596e]">
                  <span className="font-semibold text-[#0a1530] tabular-nums">
                    {filtered.length.toLocaleString('en-GB')}
                  </span>
                  {' '}
                  {filtered.length === 1 ? 'sponsor' : 'sponsors'} found
                </p>
                <p className="text-xs text-[#7a8195]">
                  Showing {Math.min(visibleCount, filtered.length).toLocaleString('en-GB')}
                </p>
              </div>

              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-[rgba(14,20,36,0.12)] p-12 text-center">
                  <Building2 className="w-10 h-10 text-[#7a8195] mx-auto mb-3 opacity-50" />
                  <h3 className="font-display text-lg font-bold text-[#0a1530] mb-1">
                    No sponsors match your search
                  </h3>
                  <p className="text-sm text-[#7a8195] mb-4">
                    Try a broader search or different filters.
                  </p>
                </div>
              ) : (
                <>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {visible.map((s, i) => (
                      <SponsorCard key={`${s.n}-${i}`} sponsor={s} />
                    ))}
                  </ul>

                  {filtered.length > visibleCount && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                        className="inline-flex items-center gap-2 bg-[#0a1530] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1b2c5b] transition-colors"
                      >
                        Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
                        <span className="text-white/60 text-xs tabular-nums">
                          ({(filtered.length - visibleCount).toLocaleString('en-GB')} remaining)
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : null}
        </div>
      </section>

      {/* Info */}
      <section className="py-12 md:py-16 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[#0a1530] mb-3">
            About this data
          </h2>
          <p className="text-sm text-[#52596e] leading-relaxed">
            This search covers the complete Home Office Register of Licensed
            Sponsors as of mid-May 2026 — 126,530 organisations across
            Skilled Worker, Health and Care, Scale-up, Senior or Specialist
            Worker, Graduate Trainee and other work routes. The official
            register is published daily and may include changes since this
            data was captured.
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-[rgba(14,20,36,0.08)] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">Premium</div>
              <div className="mt-1 text-sm text-[#0a1530] leading-snug">
                Top-tier compliant sponsor.
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[rgba(14,20,36,0.08)] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">A-rated</div>
              <div className="mt-1 text-sm text-[#0a1530] leading-snug">
                Standard compliant sponsor.
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[rgba(14,20,36,0.08)] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">B-rated</div>
              <div className="mt-1 text-sm text-[#0a1530] leading-snug">
                On Home Office action plan. Cannot issue new CoS while B-rated.
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#7a8195]">
            Source:{' '}
            <a
              href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563eb] underline inline-flex items-center gap-1"
            >
              Home Office Register of Licensed Sponsors (Workers)
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/blog/uk-skilled-worker-sponsor-licence-how-to-find-2026"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#0a1530] text-white text-sm font-semibold rounded-xl hover:bg-[#1b2c5b] transition-colors"
            >
              How to find a sponsor — full guide
            </Link>
            <Link
              href="/tools/salary-checker"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[rgba(14,20,36,0.12)] text-[#0a1530] text-sm font-semibold rounded-xl hover:border-[#0a1530] transition-colors"
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
    <li className="bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-4 md:p-5 hover:border-[#0a1530] hover:shadow-soft transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#0a1530] text-sm md:text-[15px] leading-snug">
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
            className="text-[10px] font-semibold uppercase tracking-wider text-[#52596e] bg-[#f3f5fb] px-1.5 py-0.5 rounded"
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
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1.5 px-3 py-2.5 bg-[#f3f5fb] focus:bg-white border border-transparent focus:border-[#0a1530] rounded-xl text-sm font-medium text-[#0a1530] outline-none transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
