'use client';

import { useState, useMemo } from 'react';
import { calculateSkilledWorkerPoints, THRESHOLD_GENERAL, THRESHOLD_SHORTAGE, THRESHOLD_NEW_ENTRANT } from '../../lib/skilled-worker/calc';
import { CalcCard, NumberField, ResultBox } from '../../components/calc-shell/CalcFormPrimitives';

export default function SkilledWorkerClient() {
  const [hasSponsor,   setHasSponsor]   = useState(true);
  const [rqf3,         setRqf3]         = useState(true);
  const [english,      setEnglish]      = useState(true);
  const [salary,       setSalary]       = useState('38700');
  const [goingRate,    setGoingRate]    = useState('35000');
  const [shortage,     setShortage]     = useState(false);
  const [phdRelevant,  setPhdRelevant]  = useState(false);
  const [phdStem,      setPhdStem]      = useState(false);
  const [newEntrant,   setNewEntrant]   = useState(false);

  const r = useMemo(() => calculateSkilledWorkerPoints({
    hasApprovedSponsor: hasSponsor,
    jobAtRqf3Plus: rqf3,
    englishB1Plus: english,
    annualSalary: parseFloat(salary) || 0,
    jobGoingRate: parseFloat(goingRate) || 0,
    inShortageOccupation: shortage,
    hasPhdRelevant: phdRelevant,
    hasPhdStem: phdStem,
    isNewEntrant: newEntrant,
  }), [hasSponsor, rqf3, english, salary, goingRate, shortage, phdRelevant, phdStem, newEntrant]);

  return (
    <CalcCard>
      <p className="text-[13px] text-[#76777e] mb-4">Answer each question honestly. All three mandatory criteria (A, B, C) must be met.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <NumberField label="Annual salary offered" prefix="£" value={salary} onChange={setSalary} hint={`General threshold: £${THRESHOLD_GENERAL.toLocaleString()}`} />
        <NumberField label="Job going rate (SOC code)" prefix="£" value={goingRate} onChange={setGoingRate} hint="HMRC-listed going rate for your occupation" />
      </div>

      <div className="space-y-1 mb-6 border border-[#E5E7EB] rounded-xl divide-y divide-[#E5E7EB]">
        {[
          { label: 'A, Approved sponsor', sublabel: 'Employer has a valid sponsor licence', state: hasSponsor, set: setHasSponsor },
          { label: 'B, Job at RQF 3+ skill level', sublabel: 'Equivalent to A-level or higher', state: rqf3, set: setRqf3 },
          { label: 'C, English language (B1+)', sublabel: 'Passport / degree / approved test', state: english, set: setEnglish },
          { label: 'Job on shortage occupation (Immigration Salary List)', sublabel: `Reduces salary threshold to £${THRESHOLD_SHORTAGE.toLocaleString()}`, state: shortage, set: setShortage },
          { label: 'New entrant route', sublabel: `Under 26, student switch, graduate trainee, threshold £${THRESHOLD_NEW_ENTRANT.toLocaleString()}`, state: newEntrant, set: setNewEntrant },
          { label: 'PhD in STEM subject (20 pts)', sublabel: 'Relevant to the job', state: phdStem, set: setPhdStem },
        ].map(({ label, sublabel, state, set }) => (
          <label key={label} className="flex items-start gap-2.5 cursor-pointer py-2 px-3 hover:bg-[#f3f4f5] transition-colors">
            <input type="checkbox" checked={state} onChange={(e) => set(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#00C4B4]" />
            <span>
              <span className="block text-[13.5px] font-semibold text-[#0A2540]">{label}</span>
              <span className="block text-[12px] text-[#76777e]">{sublabel}</span>
            </span>
          </label>
        ))}
        {!phdStem && (
          <label className="flex items-start gap-2.5 cursor-pointer py-2 px-3 hover:bg-[#f3f4f5] transition-colors">
            <input type="checkbox" checked={phdRelevant} onChange={(e) => setPhdRelevant(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#00C4B4]" />
            <span>
              <span className="block text-[13.5px] font-semibold text-[#0A2540]">PhD relevant to job (10 pts)</span>
              <span className="block text-[12px] text-[#76777e]">Non-STEM doctorate</span>
            </span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <ResultBox
          label="Total points"
          value={`${r.totalPoints} / 70`}
          primary={r.passes}
          accent={!r.passes ? '#b91c1c' : undefined}
        />
        <ResultBox
          label="Result"
          value={r.passes ? '✓ Eligible' : '✗ Not eligible'}
          accent={r.passes ? '#15803d' : '#b91c1c'}
        />
        {!r.passes && (
          <ResultBox label="Points short" value={`${r.missingPoints} pts needed`} muted />
        )}
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="min-w-full text-[12.5px]">
          <thead className="text-[11px] uppercase tracking-wider text-[#76777e]">
            <tr>
              <th className="text-left px-2 py-2">Criterion</th>
              <th className="text-left px-2 py-2">Description</th>
              <th className="text-right px-2 py-2">Pts</th>
              <th className="text-right px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {r.breakdown.map((b) => (
              <tr key={b.code} className="border-t border-[#E5E7EB]/60">
                <td className="px-2 py-1.5 font-bold text-[#0A2540]">{b.code}</td>
                <td className="px-2 py-1.5 text-[#45464d]">{b.description}</td>
                <td className="px-2 py-1.5 text-right text-[#0A2540]">{b.points}</td>
                <td className={`px-2 py-1.5 text-right font-semibold ${b.awarded ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>
                  {b.awarded ? '✓' : '✗'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CalcCard>
  );
}
