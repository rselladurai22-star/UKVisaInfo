'use client';

import { useState, useMemo } from 'react';
import { calculateNoticePeriod } from '../../lib/notice-period/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function NoticePeriodClient() {
  const [years,       setYears]       = useState('3');
  const [weekly,      setWeekly]      = useState('800');
  const [contractual, setContractual] = useState('4');
  const [payType,     setPayType]     = useState<'work_notice'|'pilon'|'garden_leave'>('work_notice');
  const [taxBand,     setTaxBand]     = useState<'basic'|'higher'|'additional'>('basic');

  const r = useMemo(() => calculateNoticePeriod({
    yearsOfService: parseFloat(years) || 0,
    weeklyGrossPay: parseFloat(weekly) || 0,
    contractualNoticeWeeks: parseFloat(contractual) || 0,
    paymentType: payType,
    taxBand,
  }), [years, weekly, contractual, payType, taxBand]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Years of service (complete years)" value={years} onChange={setYears} suffix="years" />
        <NumberField label="Weekly gross pay" prefix="£" value={weekly} onChange={setWeekly} />
        <NumberField label="Contractual notice (weeks)" value={contractual} onChange={setContractual} hint="From your employment contract" suffix="weeks" />
        <SelectField
          label="Payment type"
          value={payType}
          onChange={(v) => setPayType(v as 'work_notice'|'pilon'|'garden_leave')}
          options={[
            { value: 'work_notice', label: 'Work the notice period' },
            { value: 'pilon', label: 'Payment in Lieu of Notice (PILON)' },
            { value: 'garden_leave', label: 'Garden leave' },
          ]}
        />
        <SelectField
          label="Income Tax band"
          value={taxBand}
          onChange={(v) => setTaxBand(v as 'basic'|'higher'|'additional')}
          options={[
            { value: 'basic', label: 'Basic rate (20%)' },
            { value: 'higher', label: 'Higher rate (40%)' },
            { value: 'additional', label: 'Additional rate (45%)' },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Statutory notice" value={`${r.statutoryNoticeWeeks} weeks`} muted />
        <ResultBox label="Effective notice" value={`${r.effectiveNoticeWeeks} weeks`} />
        {payType === 'pilon' ? (
          <>
            <ResultBox label="Gross PILON" value={fmtGBP(r.grossPilon)} />
            <ResultBox label="Net PILON (after IT + NI)" value={fmtGBP(r.netPilon)} primary />
          </>
        ) : (
          <ResultBox label="Notice period" value={r.lastDayIfWorking} primary />
        )}
      </div>

      <div className="mt-4 p-3 bg-[#f8f9fa] rounded-lg text-[13px] text-[#45464d] border border-[#E5E7EB]">
        {r.taxNote}
      </div>
    </CalcCard>
  );
}
