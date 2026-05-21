'use client';

import { useState, useMemo } from 'react';
import { calculateCompanyCarTax } from '../../lib/company-car/calc';
import type { FuelType } from '../../lib/company-car/calc';
import { CalcCard, NumberField, SelectField, ResultBox, fmtGBP } from '../../components/calc-shell/CalcFormPrimitives';

export default function CompanyCarClient() {
  const [listPrice,    setListPrice]    = useState('35000');
  const [co2,          setCo2]          = useState('120');
  const [fuel,         setFuel]         = useState<FuelType>('petrol');
  const [phevRange,    setPhevRange]    = useState('50');
  const [rde2,         setRde2]         = useState(true);
  const [taxBand,      setTaxBand]      = useState<'basic'|'higher'|'additional'>('basic');
  const [capContrib,   setCapContrib]   = useState('0');

  const r = useMemo(() => calculateCompanyCarTax({
    listPrice: parseFloat(listPrice) || 0,
    co2: parseFloat(co2) || 0,
    fuel,
    phevRangeMiles: parseFloat(phevRange) || 0,
    rde2Compliant: rde2,
    employeeTaxBand: taxBand,
    capitalContribution: parseFloat(capContrib) || 0,
  }), [listPrice, co2, fuel, phevRange, rde2, taxBand, capContrib]);

  return (
    <CalcCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Car list price (P11D value)" prefix="£" value={listPrice} onChange={setListPrice} hint="Manufacturer&rsquo;s list price inc. factory options, VAT" />
        <NumberField label="CO2 emissions (g/km)" value={co2} onChange={setCo2} hint="From DVLA V5C or manufacturer spec" />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField
          label="Fuel type"
          value={fuel}
          onChange={(v) => setFuel(v as FuelType)}
          options={[
            { value: 'petrol', label: 'Petrol' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'electric', label: 'Pure electric (EV)' },
            { value: 'phev', label: 'Plug-in hybrid (PHEV)' },
          ]}
        />
        {fuel === 'phev' && (
          <NumberField label="Zero-emission range (miles)" value={phevRange} onChange={setPhevRange} hint="WLTP electric range" />
        )}
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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField label="Your capital contribution" prefix="£" value={capContrib} onChange={setCapContrib} hint="Optional: max £5,000 reduces list price" />
      </div>
      {fuel === 'diesel' && (
        <div className="mt-2">
          <label className="flex items-center gap-2.5 cursor-pointer py-2 px-3 rounded-lg hover:bg-[#f3f4f5] transition-colors">
            <input type="checkbox" checked={rde2} onChange={(e) => setRde2(e.target.checked)} className="w-4 h-4 accent-[#00C4B4]" />
            <span>
              <span className="block text-[13.5px] font-semibold text-[#0A2540]">Meets RDE2 standard?</span>
              <span className="block text-[12px] text-[#76777e]">RDE2-compliant = no 4% diesel surcharge</span>
            </span>
          </label>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultBox label="Appropriate %" value={`${r.appropriatePct}%`} muted />
        <ResultBox label="BiK value" value={fmtGBP(r.bikValue)} />
        <ResultBox label="Your annual IT cost" value={fmtGBP(r.employeeItCost)} primary />
        <ResultBox label="Employer Class 1A NI" value={fmtGBP(r.employerNiCost)} muted />
      </div>

      <p className="mt-4 text-[13px] text-[#76777e]">
        Monthly cost to you: <strong className="text-[#0A2540]">{fmtGBP(r.monthlyEmployeeIt)}</strong>
        {' '}· Total combined annual cost: <strong className="text-[#0A2540]">{fmtGBP(r.totalCost)}</strong>
      </p>
    </CalcCard>
  );
}
