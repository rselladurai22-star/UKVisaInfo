'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, ExternalLink, Info } from 'lucide-react';
import {
  bandDForRegion, calculateBands, type CouncilTaxBand, type CouncilTaxResult,
} from '../../lib/council-tax/calc';
import { isValidPostcode, normalisePostcode, formatPostcode } from '../../lib/postcode/lookup';

const gbp = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 });

interface PostcodeContext {
  postcode: string;
  council: string;
  region: string;
  country: string;
}

export default function CouncilTaxClient() {
  const [postcodeInput, setPostcodeInput] = useState('');
  const [postcode, setPostcode] = useState<PostcodeContext | null>(null);
  const [bandD, setBandD] = useState(2280);
  const [selectedBand, setSelectedBand] = useState<CouncilTaxBand>('D');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-derive default Band D when region changes from postcode lookup
  useEffect(() => {
    if (postcode) setBandD(bandDForRegion(postcode.region));
  }, [postcode]);

  const result: CouncilTaxResult = useMemo(
    () => calculateBands(bandD, postcode?.region ?? null),
    [bandD, postcode]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidPostcode(postcodeInput)) {
      setError('That doesn\'t look like a UK postcode.');
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(normalisePostcode(postcodeInput))}`);
      if (!r.ok) throw new Error('lookup failed');
      const data = await r.json();
      if (data.status !== 200) throw new Error('not found');
      setPostcode({
        postcode: data.result.postcode,
        council: data.result.admin_district,
        region: data.result.region ?? data.result.country,
        country: data.result.country,
      });
    } catch {
      setError('Couldn\'t find that postcode. Check it and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <aside className="lg:col-span-5 space-y-4">
        {/* Postcode lookup card */}
        <form
          onSubmit={submit}
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your area
          </p>
          <label className="block">
            <span className="block text-[13px] font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Enter UK postcode
            </span>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777e]" />
                <input
                  type="text"
                  value={postcodeInput}
                  onChange={(e) => { setPostcodeInput(e.target.value.toUpperCase()); setError(null); }}
                  placeholder="SW1A 1AA"
                  autoCapitalize="characters"
                  autoComplete="postal-code"
                  className="w-full pl-10 pr-3 py-2.5 text-[15px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10 tabular-nums"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 bg-[#101a36] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a2444] active:scale-[0.98] disabled:opacity-60"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Search className="w-4 h-4" />
                Look up
              </button>
            </div>
          </label>
          {error && (
            <p className="mt-2 text-[12.5px] text-[#D9152B]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}
          {postcode && (
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] text-[13px] text-[#45464d] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div>
                Postcode <strong className="text-[#101a36]">{formatPostcode(postcode.postcode)}</strong>
              </div>
              <div>
                Council <strong className="text-[#101a36]">{postcode.council}</strong>
              </div>
              <div>
                Region <strong className="text-[#101a36]">{postcode.region}</strong>
              </div>
            </div>
          )}
        </form>

        {/* Band D override */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Tune the figure
          </p>
          <label className="block mb-4">
            <span className="block text-[13px] font-semibold text-[#101a36] mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
              Band D annual bill
            </span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#76777e] text-[16px] font-semibold">£</span>
              <input
                type="number"
                value={bandD || ''}
                onChange={(e) => setBandD(Math.max(0, +e.target.value || 0))}
                step={10} min={0} max={5000}
                className="w-full pl-8 pr-3 py-2.5 text-[16px] font-semibold text-[#101a36] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#101a36] focus:ring-2 focus:ring-[#101a36]/10 tabular-nums"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </label>
          <p className="text-[12px] text-[#76777e] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Pre-filled with the regional average. Replace with your council&apos;s actual Band D figure (find it on your council&apos;s website) for an accurate result.
          </p>
        </div>

        {/* Find your band */}
        <a
          href="https://www.tax.service.gov.uk/check-council-tax-band/search"
          target="_blank" rel="noopener noreferrer"
          className="block bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#101a36] transition-colors"
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#76777e] mb-1.5 flex items-center gap-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Info className="w-3 h-3" /> Don&apos;t know your band?
          </div>
          <p className="text-[12.5px] text-[#45464d] leading-[1.55]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Check the official VOA Council Tax band lookup (England &amp; Wales).
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#101a36]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Open VOA tool <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      </aside>

      <main className="lg:col-span-7 space-y-4">
        {result.isNorthernIreland ? (
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-6 text-[#78350f]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <h3 className="font-bold text-[16px] mb-2" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              Northern Ireland uses Rates, not Council Tax
            </h3>
            <p className="text-[14px] leading-[1.6]">
              Domestic Rates are calculated from a property&apos;s capital value rather than band. Check your bill via nidirect.gov.uk.
            </p>
          </div>
        ) : (
          <>
            {/* Highlighted band */}
            <div className="bg-[#101a36] text-white rounded-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-56 h-56 bg-[#dae2ff] rounded-full opacity-10 blur-3xl pointer-events-none" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bcc5e9] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Band {selectedBand} · annual bill
                </p>
                <p
                  className="font-bold tabular-nums tracking-[-0.02em] leading-none"
                  style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}
                >
                  {gbp(result.rows.find((r) => r.band === selectedBand)?.annual ?? 0)}
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-[14px] tabular-nums" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#bcc5e9] block mb-1">Monthly</span>
                    <span className="font-semibold">{gbp(result.rows.find((r) => r.band === selectedBand)?.monthly ?? 0)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#bcc5e9] block mb-1">Weekly</span>
                    <span className="font-semibold">{gbp(result.rows.find((r) => r.band === selectedBand)?.weekly ?? 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* All bands table */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.05)]">
              <h3 className="font-bold text-[#101a36] text-[16px] mb-1" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                All bands for {result.region}
              </h3>
              <p className="text-[12.5px] text-[#76777e] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Tap a band to highlight it above.
              </p>
              <table className="w-full text-[13.5px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <thead>
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">
                    <th className="py-2">Band</th>
                    <th className="py-2 text-right">Ratio</th>
                    <th className="py-2 text-right">Annual</th>
                    <th className="py-2 text-right">Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] tabular-nums">
                  {result.rows.map((r) => {
                    const active = r.band === selectedBand;
                    return (
                      <tr
                        key={r.band}
                        onClick={() => setSelectedBand(r.band)}
                        className={`cursor-pointer transition-colors ${active ? 'bg-[#f3f4f5]' : 'hover:bg-[#f8f9fa]'}`}
                      >
                        <td className={`py-2.5 ${active ? 'font-bold text-[#101a36]' : 'text-[#101a36]'}`}>
                          Band {r.band}
                        </td>
                        <td className="py-2.5 text-right text-[#76777e]">
                          {(r.ratio * 100).toFixed(1)}%
                        </td>
                        <td className={`py-2.5 text-right ${active ? 'font-bold text-[#101a36]' : 'font-semibold text-[#101a36]'}`}>
                          {gbp(r.annual)}
                        </td>
                        <td className="py-2.5 text-right text-[#45464d]">
                          {gbp(r.monthly)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
