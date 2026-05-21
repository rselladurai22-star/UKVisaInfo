'use client';

import { useState, useMemo } from 'react';
import { calculateSelfAssessment } from '../../lib/self-assessment/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function SelfAssessmentClient() {
  const [employment, setEmployment] = useState('50000');
  const [seProfit,   setSeProfit]   = useState('0');
  const [property,   setProperty]   = useState('0');
  const [dividends,  setDividends]  = useState('0');
  const [savings,    setSavings]    = useState('0');
  const [paye,       setPaye]       = useState('7540');

  const r = useMemo(() => calculateSelfAssessment({
    employmentIncome: parseFloat(employment) || 0,
    selfEmployedProfit: parseFloat(seProfit) || 0,
    propertyIncome: parseFloat(property) || 0,
    dividends: parseFloat(dividends) || 0,
    savingsInterest: parseFloat(savings) || 0,
    payeAlreadyPaid: parseFloat(paye) || 0,
  }), [employment, seProfit, property, dividends, savings, paye]);

  const refund = r.balancingPayment < 0;

  return (
    <CalcCard>
      <p className="text-[13px] text-[#76777e] mb-4">Enter each income source. PAYE already collected reduces the amount due on 31 January.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Employment income" prefix="£" value={employment} onChange={setEmployment} hint="Gross salary from P60/P45" />
        <NumberField label="Self-employed profit" prefix="£" value={seProfit} onChange={setSeProfit} hint="After allowable expenses, before tax" />
        <NumberField label="Rental income (profit)" prefix="£" value={property} onChange={setProperty} hint="After allowable expenses (not mortgage interest)" />
        <NumberField label="Dividends received" prefix="£" value={dividends} onChange={setDividends} />
        <NumberField label="Savings interest" prefix="£" value={savings} onChange={setSavings} />
        <NumberField label="PAYE tax already paid" prefix="£" value={paye} onChange={setPaye} hint="From P60 — tax deducted by employer" />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Total income" value={fmtGBP(r.totalIncome)} muted />
        <ResultBox label="Income Tax" value={fmtGBP(r.incomeTax)} />
        <ResultBox label="Class 4 NI" value={fmtGBP(r.class4Ni)} />
        <ResultBox label="Total liability" value={fmtGBP(r.totalTaxLiability)} />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultBox
          label={refund ? 'Refund due' : 'Balancing payment (31 Jan)'}
          value={fmtGBP(Math.abs(r.balancingPayment))}
          primary={!refund}
          accent={refund ? '#15803d' : undefined}
          sub={refund ? 'HMRC owes you money' : 'Due 31 January after end of tax year'}
        />
        <ResultBox
          label="1st Payment on Account"
          value={fmtGBP(r.firstPaymentOnAccount)}
          muted
          sub="Also due 31 Jan (50% of next year estimate)"
        />
      </div>

      <p className="mt-4 text-[12px] text-[#76777e]">
        Estimate only. Excludes CGT, foreign income, and pension contributions. Consult an accountant for complex returns.
      </p>
    </CalcCard>
  );
}
