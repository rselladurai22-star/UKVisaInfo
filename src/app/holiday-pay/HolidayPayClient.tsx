'use client';

import { useState, useMemo } from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { calcHoliday, type WorkerType } from '../../lib/holiday-pay/calc';

const fmtGBP = (n: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function HolidayPayClient() {
  const [type, setType] = useState<WorkerType>('regular');
  // regular
  const [daysPerWeek, setDaysPerWeek] = useState<string>('5');
  const [weeklyPay, setWeeklyPay] = useState<string>('');
  // irregular
  const [hours, setHours] = useState<string>('40');
  const [hourly, setHourly] = useState<string>('');

  const result = useMemo(() => {
    if (type === 'regular') {
      return calcHoliday({
        type: 'regular',
        daysPerWeek: parseFloat(daysPerWeek) || 0,
        weeklyGrossPay: weeklyPay ? parseFloat(weeklyPay) : undefined,
      });
    }
    return calcHoliday({
      type: 'irregular',
      hoursWorkedInPeriod: parseFloat(hours) || 0,
      hourlyRate: hourly ? parseFloat(hourly) : undefined,
    });
  }, [type, daysPerWeek, weeklyPay, hours, hourly]);

  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* type */}
      <div className="inline-flex p-1 bg-[#f3f4f5] rounded-lg mb-6">
        <button
          type="button"
          onClick={() => setType('regular')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-semibold rounded-md transition-colors ${type === 'regular' ? 'bg-white text-[#0A2540] shadow-sm' : 'text-[#76777e] hover:text-[#0A2540]'}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Regular hours
        </button>
        <button
          type="button"
          onClick={() => setType('irregular')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-semibold rounded-md transition-colors ${type === 'irregular' ? 'bg-white text-[#0A2540] shadow-sm' : 'text-[#76777e] hover:text-[#0A2540]'}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Irregular / part-year
        </button>
      </div>

      {type === 'regular' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <NumField label="Days worked per week" hint="0–7" value={daysPerWeek} onChange={setDaysPerWeek} step="0.5" max="7" />
          <NumField label="Weekly gross pay (optional)" hint="To value your leave in £" value={weeklyPay} onChange={setWeeklyPay} prefix="£" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <NumField label="Hours worked in the pay period" hint="e.g. 40 in a 4-week period" value={hours} onChange={setHours} />
          <NumField label="Hourly rate (optional)" hint="To value the holiday in £" value={hourly} onChange={setHourly} prefix="£" step="0.01" />
        </div>
      )}

      {/* result */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#0A2540] text-white rounded-xl p-5">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/60">
            {result.kind === 'regular' ? 'Annual entitlement' : 'Accrued this period'}
          </div>
          <div
            className="mt-1 font-bold tabular-nums text-[32px] md:text-[36px] tracking-[-0.015em]"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
          >
            {result.kind === 'regular'
              ? `${(result.entitlementDays ?? 0).toFixed(1)} days`
              : `${(result.entitlementHours ?? 0).toFixed(2)} hours`}
          </div>
          <div className="text-[12px] text-white/60 mt-1">
            {result.kind === 'regular' ? 'Per holiday year' : 'At 12.07% of hours worked'}
          </div>
        </div>

        {result.payValue !== undefined && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#00C4B4' }}>
              Pay value
            </div>
            <div
              className="mt-1 font-bold tabular-nums text-[32px] md:text-[36px] tracking-[-0.015em] text-[#0A2540]"
              style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
            >
              {fmtGBP(result.payValue)}
            </div>
            <div className="text-[12px] text-[#76777e] mt-1">
              {result.kind === 'regular' ? 'Total annual holiday pay' : `Value of this period${"'"}s accrual`}
            </div>
          </div>
        )}
      </div>

      {result.cappedAtStatutoryMax && (
        <div className="mt-5 flex items-start gap-2.5 p-4 rounded-xl bg-[#fff7ed] border border-[#fed7aa]">
          <AlertTriangle className="w-4 h-4 text-[#c2410c] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#c2410c] mb-1">Capped at 28 days</div>
            <p className="text-[13.5px] text-[#7c2d12] leading-[1.55]">
              You{`'`}d accrue more than 28 days, but UK law caps statutory entitlement at 28. Many employers offer more in their contracts — check yours.
            </p>
          </div>
        </div>
      )}

      <p className="mt-5 text-[12px] text-[#76777e] leading-relaxed">
        {result.note}
      </p>
    </div>
  );
}

function NumField({ label, hint, value, onChange, prefix, step, max }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; prefix?: string; step?: string; max?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e]">{label}</span>
      <div className="mt-2 flex items-center gap-2 border border-[#E5E7EB] rounded-xl bg-white px-4 py-3 focus-within:border-[#0A2540] transition-colors">
        {prefix && <span className="text-[#76777e] text-[16px] font-semibold">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step={step ?? '1'}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-[17px] md:text-[19px] font-bold text-[#0A2540] tabular-nums outline-none"
          style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
        />
      </div>
      {hint && <div className="text-[11.5px] text-[#76777e] mt-1.5">{hint}</div>}
    </label>
  );
}
