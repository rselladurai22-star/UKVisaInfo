'use client';

import { useState, useMemo } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import { checkCleanAir, type FuelType, type VehicleClass } from '../../lib/clean-air/calc';

const FUEL_OPTIONS: { v: FuelType; label: string }[] = [
  { v: 'petrol', label: 'Petrol' },
  { v: 'diesel', label: 'Diesel' },
  { v: 'hybrid', label: 'Hybrid' },
  { v: 'electric', label: 'Electric' },
  { v: 'lpg', label: 'LPG / Bi-fuel' },
];

const CLASS_OPTIONS: { v: VehicleClass; label: string }[] = [
  { v: 'car', label: 'Car' },
  { v: 'van', label: 'Van (≤ 3.5t)' },
  { v: 'motorcycle', label: 'Motorcycle' },
];

export default function UlezClient() {
  const thisYear = new Date().getFullYear();
  const [fuel, setFuel] = useState<FuelType>('petrol');
  const [vehicle, setVehicle] = useState<VehicleClass>('car');
  const [year, setYear] = useState<string>('2010');

  const result = useMemo(() => checkCleanAir({
    fuel,
    vehicle,
    firstRegYear: parseInt(year, 10) || thisYear,
  }), [fuel, vehicle, year, thisYear]);

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Inputs */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_-4px_rgba(16,26,54,0.06)] space-y-5">
        <Group label="Fuel type">
          <div className="flex flex-wrap gap-2">
            {FUEL_OPTIONS.map((o) => (
              <Chip key={o.v} active={fuel === o.v} onClick={() => setFuel(o.v)}>{o.label}</Chip>
            ))}
          </div>
        </Group>

        <Group label="Vehicle">
          <div className="flex flex-wrap gap-2">
            {CLASS_OPTIONS.map((o) => (
              <Chip key={o.v} active={vehicle === o.v} onClick={() => setVehicle(o.v)}>{o.label}</Chip>
            ))}
          </div>
        </Group>

        <Group label="Year of first registration">
          <input
            type="number"
            inputMode="numeric"
            min="1980"
            max={thisYear}
            step="1"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[18px] font-bold text-[#0A2540] tabular-nums outline-none focus:border-[#0A2540] w-32"
            style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}
          />
          <span className="ml-3 text-[12.5px] text-[#76777e]">
            Inferred: Euro {result.inferredEuro}
          </span>
        </Group>
      </div>

      {/* Verdict zones */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        {result.zones.map((z, i) => (
          <div
            key={z.zone}
            className={`flex items-center justify-between gap-3 px-5 py-3 ${i === result.zones.length - 1 ? '' : 'border-b border-[#E5E7EB]'}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {z.compliant ? (
                <span className="inline-flex w-7 h-7 rounded-full bg-[#dcfce7] text-[#15803d] items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span className="inline-flex w-7 h-7 rounded-full bg-[#fee2e2] text-[#b91c1c] items-center justify-center flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-[#0A2540]">{z.zone}</div>
                {z.note && <div className="text-[11.5px] text-[#76777e]">{z.note}</div>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              {z.charge > 0 ? (
                <>
                  <div className="text-[15px] font-bold text-[#b91c1c] tabular-nums" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                    £{z.charge.toFixed(2)}<span className="text-[11px] font-medium text-[#76777e]">/day</span>
                  </div>
                </>
              ) : (
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#15803d]">No charge</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <a
        href={`https://tfl.gov.uk/modes/driving/check-your-vehicle`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0A2540] hover:underline"
      >
        Confirm with TfL{`'`}s official ULEZ checker (uses your reg plate)
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

      <p className="text-[12px] text-[#76777e] leading-relaxed">
        Our check uses year-of-registration to infer Euro standard. The official TfL/DEFRA tools query DVLA by registration plate for an exact answer — always confirm there before driving in.
      </p>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#76777e] mb-2.5">{label}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${active ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-white border-[#E5E7EB] text-[#0A2540] hover:border-[#0A2540]/40'}`}
    >
      {children}
    </button>
  );
}
