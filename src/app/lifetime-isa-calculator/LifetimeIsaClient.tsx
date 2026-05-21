'use client';

import { useState, useMemo } from 'react';
import { calculateLifetimeIsa } from '../../lib/lifetime-isa/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function LifetimeIsaClient() {
  const [contrib,    setContrib]    = useState('4000');
  const [currentAge, setCurrentAge] = useState('25');
  const [targetAge,  setTargetAge]  = useState('35');
  const [growth,     setGrowth]     = useState('5');
  const [purpose,    setPurpose]    = useState<'home'|'retirement'|'other'>('home');

  const r = useMemo(() => calculateLifetimeIsa({
    annualContribution: parseFloat(contrib) || 0,
    currentAge: parseFloat(currentAge) || 18,
    targetAge: parseFloat(targetAge) || 60,
    annualGrowthPct: parseFloat(growth) || 0,
    purpose,
  }), [contrib, currentAge, targetAge, growth, purpose]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Annual contribution (max £4,000)" prefix="£" value={contrib} onChange={setContrib} hint="You must be 18–39 to open; contributions stop at 50" />
        <NumberField label="Current age" value={currentAge} onChange={setCurrentAge} suffix="years" />
        <NumberField label="Access at age (target)" value={targetAge} onChange={setTargetAge} suffix="years" hint="Penalty-free: first home purchase or age 60+" />
        <NumberField label="Assumed annual growth" value={growth} onChange={setGrowth} suffix="%" hint="Historical global equity: ~6–8% long term" />
        <SelectField
          label="Purpose"
          value={purpose}
          onChange={(v) => setPurpose(v as 'home'|'retirement'|'other')}
          options={[
            { value: 'home', label: 'First home purchase (≤ £450,000)' },
            { value: 'retirement', label: 'Retirement (access from 60)' },
            { value: 'other', label: 'Other — 25% penalty applies' },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Your contributions" value={fmtGBP(r.totalContributions)} muted />
        <ResultBox label="LISA bonuses" value={fmtGBP(r.totalBonuses)} accent="#15803d" />
        <ResultBox label="Investment growth" value={fmtGBP(r.growth)} />
        <ResultBox label="Projected value" value={fmtGBP(r.projectedValue)} primary />
      </div>

      {purpose === 'other' && (
        <div className="mt-4 p-4 bg-[#fff1f2] border border-[#fecdd3] rounded-lg text-[13px] text-[#be123c]">
          <strong>25% withdrawal penalty:</strong> {fmtGBP(r.penaltyIfWithdrawn)} — you would receive only <strong>{fmtGBP(r.netIfPenaltyApplied)}</strong>.
          This penalty claws back the bonus AND 6.25% of your own contributions.
        </div>
      )}

      <div className="mt-5 overflow-x-auto -mx-2 max-h-60 overflow-y-auto">
        <table className="min-w-full text-[12.5px] tabular-nums">
          <thead className="text-[11px] uppercase tracking-wider text-[#76777e] sticky top-0 bg-white">
            <tr>
              <th className="text-left font-semibold px-2 py-2">Age</th>
              <th className="text-right font-semibold px-2 py-2">Contribution</th>
              <th className="text-right font-semibold px-2 py-2">Bonus</th>
              <th className="text-right font-semibold px-2 py-2">Pot value</th>
            </tr>
          </thead>
          <tbody>
            {r.breakdown.map((row) => (
              <tr key={row.age} className="border-t border-[#E5E7EB]/60">
                <td className="px-2 py-1 text-[#76777e]">{row.age}</td>
                <td className="px-2 py-1 text-right text-[#45464d]">{fmtGBP(row.yearlyContrib)}</td>
                <td className="px-2 py-1 text-right text-[#15803d]">+{fmtGBP(row.yearlyBonus)}</td>
                <td className="px-2 py-1 text-right font-semibold text-[#0A2540]">{fmtGBP(row.endValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[12px] text-[#76777e]">Projections illustrative only. Investment returns are not guaranteed.</p>
    </CalcCard>
  );
}
