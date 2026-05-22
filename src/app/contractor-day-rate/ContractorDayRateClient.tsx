'use client';

import { useMemo, useState } from 'react';
import { calculateContractorDayRate, BILLABLE_DAYS_DEFAULT } from '../../lib/contractor-day-rate/calc';
import {
  CalcCard, NumberField, SelectField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, Tip, fmtGBP,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function ContractorDayRateClient() {
  const [dayRate, setDayRate]           = useState('600');
  const [days, setDays]                 = useState(String(BILLABLE_DAYS_DEFAULT));
  const [costs, setCosts]               = useState('3000');
  const [dirSalary, setDirSalary]       = useState<'5000' | '12570'>('12570');

  const r = useMemo(() => calculateContractorDayRate({
    dayRate: parseFloat(dayRate) || 0,
    billableDays: parseFloat(days) || 0,
    annualCosts: parseFloat(costs) || 0,
    directorSalary: (dirSalary === '5000' ? 5000 : 12570) as 5000 | 12570,
  }), [dayRate, days, costs, dirSalary]);

  const uplift = r.equivalentGrossSalary > 0 ? ((r.afterCosts / r.equivalentGrossSalary - 1) * 100) : 0;

  return (
    <CalcCard wide>
      <SummaryHero
        label="Equivalent permanent salary"
        value={fmtGBP(r.equivalentGrossSalary)}
        sub={`Your £${dayRate}/day delivers the same take-home as ${fmtGBP(r.equivalentGrossSalary)} PAYE — net of ${fmtGBP(parseFloat(costs) || 0)} annual contractor costs.`}
        tone="navy"
        badge={`${uplift.toFixed(0)}% gross uplift you take on as a contractor`}
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Your contract" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Day rate" prefix="£" value={dayRate} onChange={setDayRate} hint="Gross daily invoice rate" />
            <NumberField label="Billable days / year" value={days} onChange={setDays} hint="Default 224 (260 − 28 holiday − 8 bank)" />
            <NumberField label="Annual business costs" prefix="£" value={costs} onChange={setCosts} hint="Accountant, insurance, training, software" />
            <SelectField label="Director&rsquo;s salary"
              value={dirSalary} onChange={(v) => setDirSalary(v as '5000' | '12570')}
              options={[
                { value: '5000', label: '£5,000 (Secondary Threshold — zero employer NI)' },
                { value: '12570', label: '£12,570 (Personal Allowance — uses full IT-free band)' },
              ]}
              hint="The optimal split depends on whether you can claim the £10,500 Employment Allowance"
            />
          </div>
        </Section>

        <Section title="Profit waterfall" eyebrow="Step 2" tone="results">
          <BreakdownTable
            rows={[
              { label: 'Annual gross invoiced', value: fmtGBP(r.grossContractIncome), bold: true, sub: `${dayRate} × ${days} days` },
              { label: 'Less business costs', value: `–${fmtGBP(parseFloat(costs) || 0)}`, negative: true },
              { label: 'Pre-tax profit', value: fmtGBP(r.afterCosts), bold: true },
              { label: 'Ltd take-home (after CT + IT + NI + Div tax)', value: fmtGBP(r.ltdTakeHome), bold: true },
              { label: 'Equivalent PAYE gross salary', value: fmtGBP(r.equivalentGrossSalary), bold: true, sub: 'Same net take-home via direct employment' },
              { label: 'True cost to a hiring employer', value: fmtGBP(r.employerTotalCost), sub: 'Equivalent salary + employer NI' },
            ]}
            highlightLast
          />
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Permanent vs contractor break-even">
          <StatGrid cols={3}>
            <StatCard label="Take-home you keep" value={fmtGBP(r.ltdTakeHome)} tone="primary" />
            <StatCard label="Equivalent salary (gross)" value={fmtGBP(r.equivalentGrossSalary)} sub={`${uplift.toFixed(0)}% above pre-tax profit`} />
            <StatCard label="Day rate to match £80k PAYE" value={fmtGBP(r.dailyRateForEquivalence)} sub="Total employer cost ÷ billable days" tone="muted" />
          </StatGrid>
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        <Tip tone="info">
          A common rule of thumb is &ldquo;day rate × 200 = salary equivalent&rdquo;. With proper Ltd structuring (small salary + dividends) the actual multiplier is closer to <strong>{(r.equivalentGrossSalary / (parseFloat(dayRate) || 1)).toFixed(0)}</strong>.
        </Tip>
        {(parseFloat(dayRate) || 0) > 0 && r.afterCosts / r.equivalentGrossSalary < 1.15 && (
          <Tip tone="warn">
            Your gross uplift over the equivalent salary is under 15% — that&rsquo;s a thin margin for the IR35, agency, no-PAYE-benefits, and no-paid-holiday risk a contractor takes.
          </Tip>
        )}
        <Tip tone="info">
          This compares <strong>outside IR35</strong> Ltd routes. If your contract is inside IR35, the Ltd advantage largely disappears — use the IR35 calculator instead.
        </Tip>
      </div>
    </CalcCard>
  );
}
