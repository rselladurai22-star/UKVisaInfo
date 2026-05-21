'use client';

import { useState, useMemo } from 'react';
import { calculateMortgageOverpayment } from '../../lib/mortgage-overpayment/calc';
import { CalcCard, NumberField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function MortgageOverpaymentClient() {
  const [balance,   setBalance]   = useState('180000');
  const [rate,      setRate]      = useState('5.0');
  const [termMths,  setTermMths]  = useState('240');
  const [extra,     setExtra]     = useState('200');

  const r = useMemo(() => calculateMortgageOverpayment({
    outstandingBalance: parseFloat(balance) || 0,
    annualRatePct: parseFloat(rate) || 0,
    remainingTermMonths: parseFloat(termMths) || 1,
    monthlyOverpayment: parseFloat(extra) || 0,
  }), [balance, rate, termMths, extra]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Outstanding balance" prefix="£" value={balance} onChange={setBalance} />
        <NumberField label="Annual interest rate" value={rate} onChange={setRate} suffix="%" hint="Your current mortgage rate" />
        <NumberField label="Remaining term" value={termMths} onChange={setTermMths} hint="Months remaining (e.g. 240 = 20 years)" suffix="months" />
        <NumberField label="Monthly overpayment" prefix="£" value={extra} onChange={setExtra} hint="Extra amount above standard payment" />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Standard monthly payment" value={fmtGBP(r.standardMonthlyPayment)} muted />
        <ResultBox label="New monthly payment" value={fmtGBP(r.newMonthlyPayment)} />
        <ResultBox label="Interest saved" value={fmtGBP(r.interestSaved)} primary />
        <ResultBox label="New term" value={r.newTermLabel} accent="#15803d" sub={`Was ${Math.round((parseFloat(termMths) || 0) / 12 * 10) / 10} years`} />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ResultBox label="Standard total cost" value={fmtGBP(r.standardTotalCost)} muted sub="Balance + total interest (no overpayment)" />
        <ResultBox label="New total cost" value={fmtGBP(r.newTotalCost)} sub="Balance + total interest (with overpayment)" />
      </div>
    </CalcCard>
  );
}
