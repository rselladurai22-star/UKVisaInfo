'use client';

import { useState, useMemo } from 'react';
import { calculatePensionDrawdown } from '../../lib/pension-drawdown/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function PensionDrawdownClient() {
  const [pot,        setPot]        = useState('300000');
  const [withdrawal, setWithdrawal] = useState('20000');
  const [growth,     setGrowth]     = useState('4');
  const [takeTfls,   setTakeTfls]   = useState(true);
  const [other,      setOther]      = useState('11502');

  const r = useMemo(() => calculatePensionDrawdown({
    potSize: parseFloat(pot) || 0,
    annualWithdrawal: parseFloat(withdrawal) || 0,
    annualGrowthPct: parseFloat(growth) || 0,
    takeTfls,
    otherIncome: parseFloat(other) || 0,
  }), [pot, withdrawal, growth, takeTfls, other]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Pension pot size" prefix="£" value={pot} onChange={setPot} />
        <NumberField label="Annual target withdrawal (gross)" prefix="£" value={withdrawal} onChange={setWithdrawal} hint="Before tax — net income will be lower" />
        <NumberField label="Assumed annual growth rate" value={growth} onChange={setGrowth} suffix="%" hint="Growth on the invested drawdown pot" />
        <NumberField label="Other income (State Pension, employment)" prefix="£" value={other} onChange={setOther} hint="Stacks below pension withdrawals for tax" />
      </div>
      <div className="mt-3">
        <label className="flex items-start gap-2.5 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#f3f4f5] transition-colors">
          <input type="checkbox" checked={takeTfls} onChange={(e) => setTakeTfls(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#00C4B4]" />
          <span>
            <span className="block text-[13.5px] font-semibold text-[#0A2540]">Take 25% tax-free lump sum (PCLS)</span>
            <span className="block text-[12px] text-[#76777e]">Max £268,275 from April 2024</span>
          </span>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {takeTfls && <ResultBox label="Tax-free lump sum" value={fmtGBP(r.taxFreeLumpSum)} accent="#15803d" />}
        <ResultBox label="Drawdown pot" value={fmtGBP(r.drawdownPot)} muted />
        <ResultBox
          label="Pot lasts"
          value={r.yearsUntilDeplete === null ? '50+ years' : `${r.yearsUntilDeplete} years`}
          primary
          accent={r.yearsUntilDeplete !== null && r.yearsUntilDeplete < 20 ? '#b91c1c' : undefined}
        />
        <ResultBox label="Total net withdrawn" value={fmtGBP(r.totalWithdrawn)} muted />
      </div>

      <div className="mt-5 overflow-x-auto -mx-2 max-h-60 overflow-y-auto">
        <table className="min-w-full text-[12.5px] tabular-nums">
          <thead className="text-[11px] uppercase tracking-wider text-[#76777e] sticky top-0 bg-white">
            <tr>
              <th className="text-left font-semibold px-2 py-2">Year</th>
              <th className="text-right font-semibold px-2 py-2">Net withdrawal</th>
              <th className="text-right font-semibold px-2 py-2">Growth</th>
              <th className="text-right font-semibold px-2 py-2">Pot end</th>
            </tr>
          </thead>
          <tbody>
            {r.breakdown.map((row) => (
              <tr key={row.year} className="border-t border-[#E5E7EB]/60">
                <td className="px-2 py-1 text-[#76777e]">{row.year}</td>
                <td className="px-2 py-1 text-right text-[#45464d]">{fmtGBP(row.withdrawal)}</td>
                <td className="px-2 py-1 text-right text-[#15803d]">+{fmtGBP(row.growth)}</td>
                <td className="px-2 py-1 text-right font-semibold text-[#0A2540]">{fmtGBP(row.endValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CalcCard>
  );
}
