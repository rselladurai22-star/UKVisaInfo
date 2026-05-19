'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { isValidPostcode, normalisePostcode } from '../../lib/postcode/lookup';

interface Props {
  /** Pre-filled value (when shown on a result page) */
  initial?: string;
  /** Visual variant — "hero" is large, "compact" is for headers */
  variant?: 'hero' | 'compact';
}

export default function PostcodeSearch({ initial = '', variant = 'hero' }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) { setError('Enter your postcode.'); return; }
    if (!isValidPostcode(trimmed)) { setError('That doesn\'t look like a UK postcode.'); return; }
    setError(null);
    setLoading(true);
    router.push(`/postcode/${normalisePostcode(trimmed)}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={submit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777e]" />
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null); }}
            placeholder="Enter postcode"
            autoComplete="postal-code"
            className="w-full pl-10 pr-4 py-2.5 text-[14px] font-medium bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10 transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#101a36] text-white text-[13.5px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a2444] active:scale-[0.98] transition-all duration-100 disabled:opacity-60"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Lookup
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_8px_32px_-4px_rgba(16,26,54,0.10)] p-2 sm:p-2.5 flex items-center gap-2">
        <label htmlFor="pc-input" className="pl-3 sm:pl-4 flex items-center gap-2 text-[#76777e] flex-shrink-0">
          <MapPin className="w-5 h-5" />
        </label>
        <input
          id="pc-input"
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value.toUpperCase()); setError(null); }}
          placeholder="SW1A 1AA"
          autoComplete="postal-code"
          autoCapitalize="characters"
          spellCheck={false}
          aria-label="UK postcode"
          aria-invalid={!!error}
          className="flex-1 min-w-0 bg-transparent text-[18px] sm:text-[20px] font-semibold text-[#101a36] placeholder:text-[#c1c2c5] outline-none py-3 sm:py-4 tracking-wide tabular-nums"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#101a36] text-white text-[14px] font-semibold px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:bg-[#1a2444] active:scale-[0.98] transition-all duration-100 disabled:opacity-60 flex-shrink-0"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Look up</span>
          <ArrowRight className="w-4 h-4 hidden sm:inline" />
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-3 text-[13px] text-[#D9152B] font-medium"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {error}
        </p>
      )}
      <p className="mt-3 text-[12.5px] text-[#76777e]" style={{ fontFamily: 'Inter, sans-serif' }}>
        Free · No signup · Works for any UK postcode. We never store your search.
      </p>
    </form>
  );
}
