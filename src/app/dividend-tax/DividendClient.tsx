'use client';

import { useState, useMemo } from 'react';
import { calculateDividendTax } from '../../lib/dividend/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP, fmtPct } from '../../components/calc-shell/CalcFormPrimitives';

export default function DividendClient() {
  const [other, setOther] = useState('30000');
  const [dividends, setDividends] = useState('15000');

  const result = useMemo(() => calculateDividendTax({
    otherIncome: parseFloat(other) || 0,
    dividends: parseFloat(dividends) || 0,
  }), [other, dividends]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Salary / other non-dividend income" prefix="£" value={other} onChange={setOther} hint="PAYE salary, pension, rental, interest, etc." />
        <NumberField label="Gross dividends received" prefix="£" value={dividends} onChange={setDividends} />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultBox label="Total dividend tax" value={fmtGBP(result.totalTax)} primary />
        <ResultBox label="Net dividends" value={fmtGBP(result.netDividends)} accent="#15803d" />
        <ResultBox label="Effective rate" value={fmtPct(result.effectiveDividendRate)} muted sub="On the dividend portion only" />
      </div>

      <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
        <h3 className="text-[14px] font-bold text-[#0A2540] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          How the tax is built up
        </h3>
        <div className="space-y-2 text-[13px]">
          <Row label="Personal Allowance available" value={fmtGBP(result.personalAllowance)} muted />
          <Row label="… used by other income" value={`–${fmtGBP(result.paUsedByOther)}`} muted />
          <Row label="… left to cover dividends" value={fmtGBP(result.paLeftForDividends)} muted />
          <Row label="£500 Dividend Allowance used" value={`–${fmtGBP(result.dividendAllowanceUsed)}`} muted />
          <Row label="Taxable dividends" value={fmtGBP(result.taxableDividends)} bold />
        </div>

        {result.bands.length > 0 && (
          <div className="mt-5 overflow-x-auto -mx-2">
            <table className="min-w-full text-[12.5px] tabular-nums">
              <thead className="text-[11px] uppercase tracking-wider text-[#76777e]">
                <tr>
                  <th className="text-left font-semibold px-2 py-2">Band</th>
                  <th className="text-right font-semibold px-2 py-2">Amount</th>
                  <th className="text-right font-semibold px-2 py-2">Rate</th>
                  <th className="text-right font-semibold px-2 py-2">Tax</th>
                </tr>
              </thead>
              <tbody className="text-[#0A2540]">
                {result.bands.map((b) => (
                  <tr key={b.label} className="border-t border-[#E5E7EB]/60">
                    <td className="px-2 py-1.5">{b.label}</td>
                    <td className="px-2 py-1.5 text-right">{fmtGBP(b.amount)}</td>
                    <td className="px-2 py-1.5 text-right">{(b.rate * 100).toFixed(2)}%</td>
                    <td className="px-2 py-1.5 text-right font-semibold">{fmtGBP(b.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CalcCard>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]/40 last:border-0">
      <span className={muted ? 'text-[#76777e]' : 'text-[#0A2540]'}>{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold text-[#0A2540]' : muted ? 'text-[#45464d]' : 'text-[#0A2540]'}`}
        style={bold ? { fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' } : undefined}>
        {value}
      </span>
    </div>
  );
}
