'use client';

import { useState, useMemo } from 'react';
import { Baby, User } from 'lucide-react';
import { calculateMaternity, type PayType } from '../../lib/maternity/calc';
import { CalcCard, NumberField, ToggleRow, ResultBox, fmtGBP, fmtGBP2 } from '../../components/calc-shell/CalcFormPrimitives';

export default function MaternityClient() {
  const [type, setType] = useState<PayType>('maternity');
  const [awe, setAwe] = useState('600');
  const [pWeeks, setPWeeks] = useState<'1' | '2'>('2');

  const result = useMemo(() => calculateMaternity({
    type,
    averageWeeklyEarnings: parseFloat(awe) || 0,
    paternityWeeks: type === 'paternity' ? (parseInt(pWeeks) as 1 | 2) : undefined,
  }), [type, awe, pWeeks]);

  return (
    <CalcCard>
      <div className="mb-6">
        <ToggleRow<PayType>
          value={type}
          onChange={setType}
          options={[
            { value: 'maternity', label: 'Maternity (SMP)', icon: <Baby className="w-3.5 h-3.5" /> },
            { value: 'paternity', label: 'Paternity (SPP)', icon: <User className="w-3.5 h-3.5" /> },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField
          label="Average weekly earnings (gross)"
          prefix="£"
          value={awe}
          onChange={setAwe}
          hint="Average over the 8-week qualifying period."
        />
        {type === 'paternity' && (
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#76777e] block mb-2">Weeks of leave</span>
            <ToggleRow<'1' | '2'>
              value={pWeeks}
              onChange={setPWeeks}
              options={[
                { value: '1', label: '1 week' },
                { value: '2', label: '2 weeks' },
              ]}
            />
          </div>
        )}
      </div>

      {!result.eligible ? (
        <div className="mt-6 p-4 rounded-xl bg-[#fef3c7] border border-[#fde68a] text-[13px] text-[#92400e]">
          {result.reason}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ResultBox label={`Total gross over ${result.totalWeeks} weeks`} value={fmtGBP(result.totalGross)} primary />
            <ResultBox label="Equivalent monthly" value={fmtGBP(result.totalGross / (result.totalWeeks / 4.345))} sub={`Across paid weeks only`} />
            <ResultBox label="Average weekly earnings" value={fmtGBP2(result.awe)} muted />
          </div>

          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <h3 className="text-[14px] font-bold text-[#0A2540] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
              Phase-by-phase breakdown
            </h3>
            <div className="space-y-2">
              {result.phases.map((p) => (
                <div key={p.label} className="flex items-center justify-between p-3 rounded-xl bg-[#fafbfc] border border-[#E5E7EB]/70">
                  <div>
                    <div className="text-[13.5px] font-semibold text-[#0A2540]">{p.label}</div>
                    <div className="text-[12px] text-[#76777e]">{fmtGBP2(p.weeklyRate)}/week × {p.weeks} weeks</div>
                  </div>
                  <div className="font-bold text-[15px] text-[#0A2540] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                    {fmtGBP(p.total)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </CalcCard>
  );
}
