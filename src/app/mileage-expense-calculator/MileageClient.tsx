'use client';

import { useMemo, useState } from 'react';
import { calculateMileage, type VehicleType, AMAP, PASSENGER_RATE } from '../../lib/mileage/calc';
import {
  CalcCard, NumberField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, ScenarioTabs, Tip, fmtGBP, fmtGBP2,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function MileageClient() {
  const [miles, setMiles]       = useState('12000');
  const [vehicle, setVehicle]   = useState<VehicleType>('car');
  const [passengers, setPass]   = useState('0');
  const [employer, setEmployer] = useState('25');
  const [band, setBand]         = useState<'basic' | 'higher' | 'additional'>('higher');

  const r = useMemo(() => calculateMileage({
    miles: parseFloat(miles) || 0,
    vehicleType: vehicle,
    passengers: parseFloat(passengers) || 0,
    employerPaidPence: parseFloat(employer) || 0,
    taxBand: band,
  }), [miles, vehicle, passengers, employer, band]);

  const isClaim = r.claimableRelief > 0;

  return (
    <CalcCard wide>
      <SummaryHero
        label={isClaim ? 'Mileage allowance relief you can claim' : r.taxableSurplus > 0 ? 'Taxable surplus to declare' : 'No claim'}
        value={isClaim ? fmtGBP(r.taxSavingIfClaimed) : r.taxableSurplus > 0 ? fmtGBP(r.taxableSurplus) : '£0'}
        sub={isClaim
          ? `On top of ${fmtGBP(r.employerPaid)} already received — claim ${fmtGBP(r.claimableRelief)} of shortfall at your ${band === 'basic' ? '20%' : band === 'higher' ? '40%' : '45%'} marginal rate.`
          : r.taxableSurplus > 0
            ? 'Your employer paid above HMRC&rsquo;s AMAP rates — the excess is taxable.'
            : 'Employer reimbursement matches the HMRC AMAP entitlement exactly.'}
        tone={isClaim ? 'teal' : r.taxableSurplus > 0 ? 'red' : 'navy'}
        badge={`${(parseFloat(miles) || 0).toLocaleString()} miles`}
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Your business travel" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Business miles driven" value={miles} onChange={setMiles} hint="Tax year 2025/26 (6 Apr 2025 – 5 Apr 2026)" />
            <NumberField label="Passengers carried (avg)" value={passengers} onChange={setPass} hint="Other employees on business — 5p/mile each" />
            <NumberField label="Employer pays per mile" prefix="" suffix="pence" value={employer} onChange={setEmployer} hint="Common rates: 25p, 35p, 45p" />
            <ScenarioTabs<'basic' | 'higher' | 'additional'>
              value={band}
              onChange={setBand}
              options={[
                { value: 'basic', label: '20%' },
                { value: 'higher', label: '40%' },
                { value: 'additional', label: '45%' },
              ]}
            />
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0A2540] mb-1.5">Vehicle</p>
            <ScenarioTabs<VehicleType>
              value={vehicle}
              onChange={setVehicle}
              options={[
                { value: 'car', label: 'Car / van', sub: '45p first 10k · 25p above' },
                { value: 'motorcycle', label: 'Motorcycle', sub: '24p all miles' },
                { value: 'bicycle', label: 'Bicycle', sub: '20p all miles' },
              ]}
            />
          </div>
        </Section>

        <Section title="AMAP entitlement breakdown" eyebrow="Step 2" tone="results">
          <BreakdownTable
            rows={[
              ...r.breakdown.map((b) => ({
                label: b.band, value: fmtGBP2(b.amount), sub: `${b.miles.toLocaleString()} mi × ${(b.rate * 100).toFixed(0)}p`,
              })),
              ...(r.passengerElement > 0 ? [{ label: `Passenger element (${PASSENGER_RATE * 100}p/mi × ${passengers})`, value: fmtGBP2(r.passengerElement) }] : []),
              { label: 'Total AMAP entitlement', value: fmtGBP2(r.amapEntitlement), bold: true },
              { label: 'Less employer reimbursement', value: `–${fmtGBP2(r.employerPaid)}`, negative: true, sub: `${employer}p/mi × ${(parseFloat(miles) || 0).toLocaleString()}` },
              {
                label: r.claimableRelief > 0 ? 'Allowable shortfall (claim relief on)' : r.taxableSurplus > 0 ? 'Surplus over AMAP (taxable)' : 'Net difference',
                value: r.claimableRelief > 0 ? fmtGBP2(r.claimableRelief) : fmtGBP2(r.taxableSurplus),
                bold: true,
                positive: r.claimableRelief > 0,
                negative: r.taxableSurplus > 0,
              },
            ]}
            highlightLast
          />
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Result summary">
          <StatGrid cols={3}>
            <StatCard label="AMAP entitlement" value={fmtGBP(r.amapEntitlement)} sub="HMRC-approved rate × miles" />
            <StatCard label="Employer reimbursement" value={fmtGBP(r.employerPaid)} sub={`${employer}p per mile`} tone="muted" />
            <StatCard label={isClaim ? 'Tax relief claimable' : 'Tax due on surplus'}
              value={fmtGBP(isClaim ? r.taxSavingIfClaimed : r.taxableSurplus * (band === 'basic' ? 0.2 : band === 'higher' ? 0.4 : 0.45))}
              tone={isClaim ? 'positive' : 'negative'}
              sub={isClaim ? `At ${band === 'basic' ? '20%' : band === 'higher' ? '40%' : '45%'} marginal rate` : 'Reportable on Self Assessment'} />
          </StatGrid>
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        {isClaim && (
          <Tip tone="success">
            Claim via <strong>Form P87</strong> (online or post). Under £2,500 of annual relief can be claimed without Self Assessment — just submit P87 each year you have a shortfall.
          </Tip>
        )}
        {r.taxableSurplus > 0 && (
          <Tip tone="warn">
            Your employer paid more than the AMAP rate. The surplus ({fmtGBP(r.taxableSurplus)}) is treated as taxable benefit and must be reported on a <strong>P11D</strong> or via PAYE.
          </Tip>
        )}
        <Tip tone="info">
          AMAP rates of <strong>{AMAP.car.first * 100}p / {AMAP.car.additional * 100}p</strong> have been unchanged since 2011. Real-world fuel + wear costs are now well above the 25p tier — many drivers materially out-of-pocket.
        </Tip>
      </div>
    </CalcCard>
  );
}
