'use client';

import { useState, useMemo } from 'react';
import { calculateIsa, ISA_ANNUAL_LIMIT } from '../../lib/isa/calc';
import type { IsaType } from '../../lib/isa/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function IsaClient() {
  const [type,    setType]    = useState<IsaType>('stocks');
  const [contrib, setContrib] = useState('10000');
  const [growth,  setGrowth]  = useState('6');
  const [years,   setYears]   = useState('20');

  const r = useMemo(() => calculateIsa({
    type,
    annualContribution: parseFloat(contrib) || 0,
    annualReturnPct: parseFloat(growth) || 0,
    years: parseFloat(years) || 1,
  }), [type, contrib, growth, years]);

  const isLisa = type === 'lisa';

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="ISA type"
          value={type}
          onChange={(v) => setType(v as IsaType)}
          options={[
            { value: 'stocks', label: 'Stocks & Shares ISA' },
            { value: 'cash', label: 'Cash ISA' },
            { value: 'lisa', label: 'Lifetime ISA (LISA) — 25% bonus' },
            { value: 'jisa', label: 'Junior ISA (JISA)' },
          ]}
        />
        <NumberField
          label={isLisa ? 'Annual contribution (max £4,000)' : 'Annual contribution (max £20,000)'}
          prefix="£"
          value={contrib}
          onChange={setContrib}
          hint={isLisa ? 'LISA limit £4,000/year' : `ISA allowance £${ISA_ANNUAL_LIMIT.toLocaleString()}/year`}
        />
        <NumberField label="Assumed annual growth rate" value={growth} onChange={setGrowth} suffix="%" hint="e.g. 6% for global equity fund (not guaranteed)" />
        <NumberField label="Investment period" value={years} onChange={setYears} suffix="years" />
      </div>

      {r.isOverAllowance && (
        <p className="mt-4 text-[13px] text-[#b91c1c]">
          Contribution exceeds the {isLisa ? 'LISA £4,000' : `ISA £${ISA_ANNUAL_LIMIT.toLocaleString()}`} limit — calculation uses the capped amount.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Total contributions" value={fmtGBP(r.totalContributions)} muted />
        {isLisa && <ResultBox label="LISA bonuses" value={fmtGBP(r.lisaBonus)} accent="#15803d" />}
        <ResultBox label="Growth" value={fmtGBP(r.growth)} />
        <ResultBox label="Projected value" value={fmtGBP(r.projectedValue)} primary />
      </div>

      <div className="mt-5 overflow-x-auto -mx-2 max-h-60 overflow-y-auto">
        <table className="min-w-full text-[12.5px] tabular-nums">
          <thead className="text-[11px] uppercase tracking-wider text-[#76777e] sticky top-0 bg-white">
            <tr>
              <th className="text-left font-semibold px-2 py-2">Year</th>
              <th className="text-right font-semibold px-2 py-2">Contributions</th>
              <th className="text-right font-semibold px-2 py-2">Pot value</th>
            </tr>
          </thead>
          <tbody>
            {r.yearlyBreakdown.filter((_, i) => i % 1 === 0).map((row) => (
              <tr key={row.year} className="border-t border-[#E5E7EB]/60">
                <td className="px-2 py-1 text-[#76777e]">{row.year}</td>
                <td className="px-2 py-1 text-right text-[#45464d]">{fmtGBP(row.contributions)}</td>
                <td className="px-2 py-1 text-right font-semibold text-[#0A2540]">{fmtGBP(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[12px] text-[#76777e]">Projections are illustrative only. Investment returns are not guaranteed.</p>
    </CalcCard>
  );
}
