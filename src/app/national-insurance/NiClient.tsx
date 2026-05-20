'use client';

import { useState, useMemo } from 'react';
import { Users, Building2, Briefcase } from 'lucide-react';
import { calculateNI, CATEGORY_LABEL, type Category, type CalcInput } from '../../lib/ni/calc';
import { CalcCard, NumberField, SelectField, ToggleRow, ResultBox, fmtGBP, fmtPct } from '../../components/calc-shell/CalcFormPrimitives';

type Kind = 'employee' | 'employer' | 'self-employed';

export default function NiClient() {
  const [kind, setKind] = useState<Kind>('employee');
  const [salary, setSalary] = useState('40000');
  const [profit, setProfit] = useState('40000');
  const [category, setCategory] = useState<Category>('A');
  const [empAllowance, setEmpAllowance] = useState(false);
  const [voluntaryClass2, setVoluntaryClass2] = useState(false);

  const result = useMemo(() => {
    const input: CalcInput = kind === 'employee'
      ? { kind: 'employee', salary: parseFloat(salary) || 0, category }
      : kind === 'employer'
      ? { kind: 'employer', salary: parseFloat(salary) || 0, category, claimEmploymentAllowance: empAllowance }
      : { kind: 'self-employed', profit: parseFloat(profit) || 0, payClass2Voluntary: voluntaryClass2 };
    return calculateNI(input);
  }, [kind, salary, profit, category, empAllowance, voluntaryClass2]);

  return (
    <CalcCard>
      <div className="mb-6">
        <ToggleRow<Kind>
          value={kind}
          onChange={setKind}
          options={[
            { value: 'employee',      label: 'Employee',      icon: <Users className="w-3.5 h-3.5" /> },
            { value: 'employer',      label: 'Employer',      icon: <Building2 className="w-3.5 h-3.5" /> },
            { value: 'self-employed', label: 'Self-employed', icon: <Briefcase className="w-3.5 h-3.5" /> },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kind !== 'self-employed' ? (
          <>
            <NumberField label="Gross annual salary" prefix="£" value={salary} onChange={setSalary} />
            <SelectField<Category>
              label="NI category letter"
              value={category}
              onChange={setCategory}
              options={(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => ({ value: c, label: CATEGORY_LABEL[c] }))}
            />
          </>
        ) : (
          <NumberField label="Annual profit (after expenses)" prefix="£" value={profit} onChange={setProfit} />
        )}
      </div>

      {kind === 'employer' && (
        <label className="mt-4 inline-flex items-center gap-2 text-[13px] text-[#0A2540] cursor-pointer">
          <input type="checkbox" checked={empAllowance} onChange={(e) => setEmpAllowance(e.target.checked)} className="accent-[#0A2540]" />
          Claim Employment Allowance (up to £10,500/year off employer NI)
        </label>
      )}

      {kind === 'self-employed' && (
        <label className="mt-4 inline-flex items-center gap-2 text-[13px] text-[#0A2540] cursor-pointer">
          <input type="checkbox" checked={voluntaryClass2} onChange={(e) => setVoluntaryClass2(e.target.checked)} className="accent-[#0A2540]" />
          Pay Class 2 voluntarily (~£180/year — protects State Pension)
        </label>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultBox label="Total NI" value={fmtGBP(result.total)} primary />
        <ResultBox label="Effective rate" value={fmtPct(result.effectiveRate)} muted sub={kind === 'self-employed' ? 'Of profit' : 'Of salary'} />
      </div>

      {result.note && (
        <p className="mt-4 text-[12.5px] text-[#0A2540] bg-[#fafbfc] border border-[#E5E7EB] rounded-xl p-3">
          {result.note}
        </p>
      )}

      {result.bands.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
          <h3 className="text-[14px] font-bold text-[#0A2540] mb-3" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
            Breakdown by band
          </h3>
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-[12.5px] tabular-nums">
              <thead className="text-[11px] uppercase tracking-wider text-[#76777e]">
                <tr>
                  <th className="text-left font-semibold px-2 py-2">Band</th>
                  <th className="text-right font-semibold px-2 py-2">Amount in band</th>
                  <th className="text-right font-semibold px-2 py-2">NI</th>
                </tr>
              </thead>
              <tbody className="text-[#0A2540]">
                {result.bands.map((b) => (
                  <tr key={b.label} className="border-t border-[#E5E7EB]/60">
                    <td className="px-2 py-1.5">{b.label}</td>
                    <td className="px-2 py-1.5 text-right">{fmtGBP(b.amount)}</td>
                    <td className="px-2 py-1.5 text-right font-semibold">{fmtGBP(b.ni)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </CalcCard>
  );
}
