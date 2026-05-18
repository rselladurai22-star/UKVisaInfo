'use client';

import { useMemo, useState } from 'react';
import {
  Search, MapPin, Building2, X, Crown, ExternalLink, Filter, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { SPONSORS, SPONSOR_SECTORS, type Sponsor } from '../../data/sponsors';

const REGIONS = Array.from(new Set(SPONSORS.map((s) => s.region))).sort();
const RATINGS = ['A (Premium)', 'A', 'B'] as const;

const RATING_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  'A (Premium)': { bg: 'rgba(255,191,71,0.15)', text: '#9a6800', label: 'Premium' },
  'A': { bg: 'rgba(5,150,105,0.12)', text: '#057a55', label: 'A-rated' },
  'B': { bg: 'rgba(217,21,43,0.12)', text: '#b8101f', label: 'B (limited)' },
};

const SECTOR_DOTS: Record<string, string> = {
  Technology: '#2563eb',
  Finance: '#0891b2',
  Consulting: '#7c3aed',
  Healthcare: '#059669',
  Legal: '#0a1530',
  Engineering: '#d97706',
  Education: '#e11d48',
  Retail: '#0d9488',
  Hospitality: '#ec4899',
  Government: '#475569',
  Media: '#9333ea',
  Manufacturing: '#525a70',
  Construction: '#b45309',
  Other: '#6b7280',
};

export default function SponsorSearch() {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPONSORS.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.city.toLowerCase().includes(q)) return false;
      if (sector && s.sector !== sector) return false;
      if (region && s.region !== region) return false;
      if (rating && s.rating !== rating) return false;
      return true;
    });
  }, [query, sector, region, rating]);

  const activeFilterCount = [sector, region, rating].filter(Boolean).length;
  const clearFilters = () => {
    setSector('');
    setRegion('');
    setRating('');
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
            Find UK employers who hold a Skilled Worker sponsor licence.
            Filter by city, sector and rating. Curated subset of the
            official Home Office register.
          </p>
        </div>
      </section>

      {/* Sticky search bar */}
      <section className="sticky top-[58px] md:top-[72px] z-20 bg-white/85 backdrop-blur-xl border-b border-[rgba(14,20,36,0.06)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52596e]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Company name or city…"
              className="w-full pl-10 pr-10 py-3 bg-[#f3f5fb] focus:bg-white border border-transparent focus:border-[#0a1530] rounded-xl text-sm placeholder:text-[#7a8195] outline-none transition-all"
              aria-label="Search sponsors"
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

        {/* Filter dropdown */}
        {showFilters && (
          <div className="border-t border-[rgba(14,20,36,0.06)] bg-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-4 grid sm:grid-cols-3 gap-3">
              <Select label="Sector" value={sector} onChange={setSector} options={SPONSOR_SECTORS} />
              <Select label="Region" value={region} onChange={setRegion} options={REGIONS} />
              <Select label="Rating" value={rating} onChange={setRating} options={RATINGS} />
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#d9152b] hover:underline"
                >
                  <X className="w-3 h-3" /> Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#52596e]">
              <span className="font-semibold text-[#0a1530] tabular-nums">{filtered.length}</span> {filtered.length === 1 ? 'sponsor' : 'sponsors'} found
              {(sector || region || rating) && (
                <span className="text-[#7a8195]"> · filtered</span>
              )}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[rgba(14,20,36,0.12)] p-12 text-center">
              <Building2 className="w-10 h-10 text-[#7a8195] mx-auto mb-3 opacity-50" />
              <h3 className="font-display text-lg font-bold text-[#0a1530] mb-1">
                No sponsors match your search
              </h3>
              <p className="text-sm text-[#7a8195] mb-4">
                This tool covers ~250 of the most active UK sponsors.
                Try a broader search, or check the full register at gov.uk.
              </p>
              <a
                href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:underline"
              >
                Open official register
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {filtered.map((s, i) => (
                <SponsorCard key={`${s.name}-${i}`} sponsor={s} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Info / disclaimer */}
      <section className="py-12 md:py-16 bg-[#f9fafb]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[#0a1530] mb-3">
            About this search
          </h2>
          <p className="text-sm text-[#52596e] leading-relaxed">
            This tool is a curated subset of the Home Office\&apos;s Register
            of Licensed Sponsors covering the largest and most active
            Skilled Worker sponsors. The full register has 60,000+ entries
            and is published daily at gov.uk. Use this for quick lookups;
            check the official register for definitive status before any
            application.
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-[rgba(14,20,36,0.08)] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">A (Premium)</div>
              <div className="mt-1 text-sm text-[#0a1530] leading-snug">
                Top-tier sponsor in good standing with the Home Office.
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[rgba(14,20,36,0.08)] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">A-rated</div>
              <div className="mt-1 text-sm text-[#0a1530] leading-snug">
                Standard compliant sponsor. Can issue new CoS.
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[rgba(14,20,36,0.08)] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#52596e]">B-rated</div>
              <div className="mt-1 text-sm text-[#0a1530] leading-snug">
                On Home Office action plan. Cannot issue new CoS while B-rated.
              </div>
            </div>
          </div>

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

function SponsorCard({ sponsor: s }: { sponsor: Sponsor }) {
  const r = RATING_STYLES[s.rating];
  const dot = SECTOR_DOTS[s.sector] ?? SECTOR_DOTS.Other;
  return (
    <li className="bg-white border border-[rgba(14,20,36,0.08)] rounded-2xl p-4 md:p-5 hover:border-[#0a1530] hover:shadow-soft transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#0a1530] text-sm md:text-base leading-snug">
            {s.name}
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-[#7a8195]">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {s.city}, {s.region}
            </span>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full flex-shrink-0"
          style={{ background: r.bg, color: r.text }}
        >
          {s.rating === 'A (Premium)' && <Crown className="w-2.5 h-2.5" />}
          {r.label}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-[rgba(14,20,36,0.05)] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
        <span className="text-xs font-semibold text-[#52596e]">{s.sector}</span>
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
  options: readonly string[];
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
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
