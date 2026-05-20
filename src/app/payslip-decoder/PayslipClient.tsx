'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ALL_CODES, type CodeEntry } from '../../lib/payslip/codes';
import { CalcCard } from '../../components/calc-shell/CalcFormPrimitives';

const CATEGORIES: CodeEntry['category'][] = ['Tax code', 'NI category', 'Pension', 'Deduction', 'Earnings'];

export default function PayslipClient() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<CodeEntry['category'] | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_CODES.filter((c) => {
      if (cat !== 'all' && c.category !== cat) return false;
      if (!q) return true;
      return (
        c.code.toLowerCase().includes(q) ||
        c.meaning.toLowerCase().includes(q) ||
        c.detail.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  return (
    <CalcCard>
      <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-3 py-2.5 focus-within:border-[#0A2540]">
        <Search className="w-4 h-4 text-[#76777e]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a code — e.g. 1257L, BR, AE, DEA, P60…"
          className="flex-1 min-w-0 bg-transparent text-[15px] text-[#0A2540] outline-none placeholder-[#76777e]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${cat === c ? 'bg-[#0A2540] border-[#0A2540] text-white' : 'bg-white border-[#E5E7EB] text-[#45464d] hover:border-[#0A2540]/40'}`}
          >
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-[13px] text-[#76777e] text-center py-8">No codes match "{query}". Try the abbreviation alone (e.g. <code>BR</code> or <code>DEA</code>).</p>
        ) : (
          filtered.map((c) => (
            <div key={c.category + c.code} className="border border-[#E5E7EB] rounded-xl p-4 bg-white">
              <div className="flex items-start gap-3 flex-wrap">
                <span className="font-mono text-[13.5px] font-bold text-[#0A2540] bg-[#fafbfc] border border-[#E5E7EB] rounded-md px-2 py-0.5">
                  {c.code}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#76777e] mt-1">
                  {c.category}
                </span>
              </div>
              <div className="mt-2 text-[14px] font-semibold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                {c.meaning}
              </div>
              <p className="mt-1.5 text-[13px] text-[#45464d] leading-relaxed">{c.detail}</p>
            </div>
          ))
        )}
      </div>

      <p className="mt-6 text-[12px] text-[#76777e]">
        {filtered.length} code{filtered.length === 1 ? '' : 's'} shown. Source: gov.uk tax codes, NI categories and HMRC PAYE guidance.
      </p>
    </CalcCard>
  );
}
