'use client';

import { useState, useMemo } from 'react';
import { compareSoleVsLtd, type PathResult } from '../../lib/sole-vs-ltd/calc';
import { CalcCard, NumberField, ToggleRow, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function SoleVsLtdClient() {
  const [profit, setProfit] = useState('80000');
  const [salary, setSalary] = useState<'5000' | '12570'>('5000');

  const result = useMemo(() => compareSoleVsLtd({
    profit: parseFloat(profit) || 0,
    directorSalary: parseInt(salary) as 5000 | 12570,
  }), [profit, salary]);

  const winner = result.betterOption;

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Annual business profit" prefix="£" value={profit} onChange={setProfit} hint="Before any owner pay or Corporation Tax." />
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e] block mb-2">Director salary (Ltd)</span>
          <ToggleRow<'5000' | '12570'>
            value={salary}
            onChange={setSalary}
            options={[
              { value: '5000',  label: '£5,000 (ST)' },
              { value: '12570', label: '£12,570 (PT)' },
            ]}
          />
          <span className="block mt-1 text-[11.5px] text-[#76777e]">£5k = no employer NI · £12,570 = uses full Personal Allowance.</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <PathCard result={result.soleTrader} win={winner === 'sole'} />
        <PathCard result={result.limited}   win={winner === 'ltd'} />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultBox
          label="Better option"
          value={winner === 'ltd' ? 'Limited company' : winner === 'sole' ? 'Sole trader' : 'Effectively tied'}
          primary
          sub={winner !== 'tie' ? `${fmtGBP(Math.abs(result.difference))}/yr more take-home` : ''}
        />
        <ResultBox
          label="Take-home gap"
          value={fmtGBP(Math.abs(result.difference))}
          accent={winner === 'ltd' ? '#15803d' : winner === 'sole' ? '#b54708' : '#76777e'}
          sub="Net of all taxes & NI"
        />
      </div>

      <p className="mt-5 text-[12px] text-[#76777e]">
        Compares only tax + NI. Doesn&rsquo;t account for accountancy fees (~£700–1,500/year for a Ltd), pension contributions (Ltd has bigger headroom via employer contribution), IR35 risk, or limited-liability protection.
      </p>
    </CalcCard>
  );
}

function PathCard({ result, win }: { result: PathResult; win: boolean }) {
  return (
    <div
      className="rounded-2xl border-2 p-5"
      style={{
        borderColor: win ? '#00C4B4' : '#E5E7EB',
        background: win ? 'rgba(0,196,180,0.03)' : '#ffffff',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-bold text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          {result.label}
        </h3>
        {win && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00C4B4] text-white">Winner</span>}
      </div>
      <div className="text-[28px] font-bold text-[#0A2540] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
        {fmtGBP(result.takeHome)}
      </div>
      <div className="text-[11.5px] text-[#76777e] mb-3">take home after all taxes</div>

      <div className="text-[12.5px] space-y-1 pt-3 border-t border-[#E5E7EB]/60">
        {result.incomeTax > 0       && <Row label="Income tax" value={fmtGBP(result.incomeTax)} />}
        {result.employeeNi > 0      && <Row label="Employee NI" value={fmtGBP(result.employeeNi)} />}
        {result.employerNi > 0      && <Row label="Employer NI" value={fmtGBP(result.employerNi)} />}
        {result.class4Ni > 0        && <Row label="Class 4 NI" value={fmtGBP(result.class4Ni)} />}
        {result.corporationTax > 0  && <Row label="Corporation Tax" value={fmtGBP(result.corporationTax)} />}
        {result.dividendTax > 0     && <Row label="Dividend tax" value={fmtGBP(result.dividendTax)} />}
        <div className="flex justify-between pt-1.5 mt-1 border-t border-[#E5E7EB]/60">
          <span className="font-semibold text-[#0A2540]">Total tax + NI</span>
          <span className="font-bold text-[#0A2540] tabular-nums">{fmtGBP(result.totalTax)}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#45464d]">{label}</span>
      <span className="tabular-nums text-[#0A2540]">{value}</span>
    </div>
  );
}
