'use client';

import { useState, useMemo } from 'react';
import { calculateSalarySacrifice } from '../../lib/salary-sacrifice/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function SalarySacrificeClient() {
  const [salary,    setSalary]    = useState('45000');
  const [sacrifice, setSacrifice] = useState('5000');

  const r = useMemo(() => calculateSalarySacrifice({
    grossSalary: parseFloat(salary) || 0,
    sacrificeAmount: parseFloat(sacrifice) || 0,
  }), [salary, sacrifice]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Gross annual salary" prefix="£" value={salary} onChange={setSalary} />
        <NumberField label="Annual sacrifice amount" prefix="£" value={sacrifice} onChange={setSacrifice} hint="Amount to reduce salary by (goes into pension)" />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Your IT saving" value={fmtGBP(r.employeeItSaving)} />
        <ResultBox label="Your NI saving" value={fmtGBP(r.employeeNiSaving)} />
        <ResultBox label="Employer NI saving" value={fmtGBP(r.employerNiSaving)} muted />
        <ResultBox label="Total saving" value={fmtGBP(r.totalSaving)} primary />
      </div>

      <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-2 text-[13px]">
        <Row label="Sacrifice amount" value={fmtGBP(r.sacrificeAmount)} />
        <Row label="Net cost to you (reduction in take-home)" value={fmtGBP(r.netCostToEmployee)} bold />
        <Row label="vs personal pension (RAS, IT saving only)" value={fmtGBP(r.vsRasItSavingOnly)} muted />
        <Row label="Extra saving vs personal pension" value={fmtGBP(r.extraVsRas)} accent="#15803d" />
      </div>

      <div className="mt-4 p-4 bg-[#f0fdfa] rounded-xl border border-[#99f6e4] text-[13px] text-[#0A2540]">
        For every <strong>{fmtGBP(r.sacrificeAmount)}</strong> sacrifice, your take-home drops by only{' '}
        <strong>{fmtGBP(r.netCostToEmployee)}</strong> — the rest is saved through reduced IT and NI.
      </div>
    </CalcCard>
  );
}

function Row({ label, value, muted, bold, accent }: { label: string; value: string; muted?: boolean; bold?: boolean; accent?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]/40 last:border-0">
      <span className={muted ? 'text-[#76777e]' : 'text-[#0A2540]'}>{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold' : ''}`}
        style={{ color: accent ?? (bold ? '#0A2540' : muted ? '#76777e' : '#0A2540'), fontFamily: bold ? '"Plus Jakarta Sans", Inter, sans-serif' : undefined }}>
        {value}
      </span>
    </div>
  );
}
