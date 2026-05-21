'use client';

import { useState, useMemo } from 'react';
import { calculateMileage } from '../../lib/mileage/calc';
import type { VehicleType } from '../../lib/mileage/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function MileageClient() {
  const [miles,      setMiles]      = useState('8000');
  const [vehicle,    setVehicle]    = useState<VehicleType>('car');
  const [passengers, setPassengers] = useState('0');
  const [paidPence,  setPaidPence]  = useState('0');
  const [taxBand,    setTaxBand]    = useState<'basic'|'higher'|'additional'>('basic');

  const r = useMemo(() => calculateMileage({
    miles: parseFloat(miles) || 0,
    vehicleType: vehicle,
    passengers: parseFloat(passengers) || 0,
    employerPaidPence: parseFloat(paidPence) || 0,
    taxBand,
  }), [miles, vehicle, passengers, paidPence, taxBand]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Business miles driven" value={miles} onChange={setMiles} hint="Total business miles in the tax year" />
        <SelectField
          label="Vehicle type"
          value={vehicle}
          onChange={(v) => setVehicle(v as VehicleType)}
          options={[
            { value: 'car', label: 'Car or van' },
            { value: 'motorcycle', label: 'Motorcycle (24p/mile)' },
            { value: 'bicycle', label: 'Bicycle (20p/mile)' },
          ]}
        />
        <NumberField label="Passengers (fellow employees)" value={passengers} onChange={setPassengers} hint="Adds 5p per mile per passenger" />
        <NumberField label="What your employer pays (pence/mile)" value={paidPence} onChange={setPaidPence} hint="Enter 0 if employer pays nothing" />
        <SelectField
          label="Your Income Tax band"
          value={taxBand}
          onChange={(v) => setTaxBand(v as 'basic'|'higher'|'additional')}
          options={[
            { value: 'basic', label: 'Basic rate (20%)' },
            { value: 'higher', label: 'Higher rate (40%)' },
            { value: 'additional', label: 'Additional rate (45%)' },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultBox label="AMAP entitlement" value={fmtGBP(r.amapEntitlement)} />
        <ResultBox label="Claimable shortfall" value={fmtGBP(r.claimableRelief)} primary />
        <ResultBox label="Tax saving if claimed" value={fmtGBP(r.taxSavingIfClaimed)} accent="#15803d" />
      </div>

      {r.taxableSurplus > 0 && (
        <p className="mt-4 text-[13px] text-[#b91c1c]">
          Your employer pays above AMAP — <strong>{fmtGBP(r.taxableSurplus)}</strong> is taxable employment income.
        </p>
      )}

      <div className="mt-5 overflow-x-auto -mx-2">
        <table className="min-w-full text-[12.5px] tabular-nums">
          <thead className="text-[11px] uppercase tracking-wider text-[#76777e]">
            <tr>
              <th className="text-left font-semibold px-2 py-2">Band</th>
              <th className="text-right font-semibold px-2 py-2">Miles</th>
              <th className="text-right font-semibold px-2 py-2">Rate</th>
              <th className="text-right font-semibold px-2 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {r.breakdown.map((b) => (
              <tr key={b.band} className="border-t border-[#E5E7EB]/60">
                <td className="px-2 py-1.5 text-[#0A2540]">{b.band}</td>
                <td className="px-2 py-1.5 text-right text-[#45464d]">{b.miles.toLocaleString()}</td>
                <td className="px-2 py-1.5 text-right text-[#45464d]">{(b.rate * 100).toFixed(0)}p</td>
                <td className="px-2 py-1.5 text-right font-semibold text-[#0A2540]">{fmtGBP(b.amount)}</td>
              </tr>
            ))}
            {r.passengerElement > 0 && (
              <tr className="border-t border-[#E5E7EB]/60">
                <td className="px-2 py-1.5 text-[#0A2540]">Passenger element</td>
                <td className="px-2 py-1.5 text-right text-[#45464d]">{(parseFloat(miles) || 0).toLocaleString()}</td>
                <td className="px-2 py-1.5 text-right text-[#45464d]">5p × {passengers}</td>
                <td className="px-2 py-1.5 text-right font-semibold text-[#0A2540]">{fmtGBP(r.passengerElement)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CalcCard>
  );
}
