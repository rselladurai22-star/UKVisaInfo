'use client';

import { useMemo, useState } from 'react';
import { calculateMarriageAllowance, ANNUAL_SAVING, BACKDATE_YEARS, TRANSFER_AMOUNT } from '../../lib/marriage-allowance/calc';
import {
  CalcCard, NumberField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, ScenarioTabs, Tip, fmtGBP,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function MarriageAllowanceClient() {
  const [lower, setLower]     = useState('8000');
  const [higher, setHigher]   = useState('38000');
  const [backdate, setBackdate] = useState<'0' | '1' | '2' | '3' | '4'>('4');

  const r = useMemo(() => calculateMarriageAllowance({
    lowerEarnerIncome: parseFloat(lower) || 0,
    higherEarnerIncome: parseFloat(higher) || 0,
    backdateYears: parseInt(backdate) as 0 | 1 | 2 | 3 | 4,
  }), [lower, higher, backdate]);

  return (
    <CalcCard wide>
      <SummaryHero
        label={r.eligible ? 'Total claim available' : 'Not eligible'}
        value={r.eligible ? fmtGBP(r.totalSaving) : '£0'}
        sub={r.eligible
          ? `£${ANNUAL_SAVING} this year + £${r.backdateSaving} from ${r.yearsBackdated.length} backdated year${r.yearsBackdated.length === 1 ? '' : 's'}.`
          : r.ineligibleReason ?? ''}
        tone={r.eligible ? 'teal' : 'red'}
        badge="2026/27"
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Couple&rsquo;s incomes" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 gap-3">
            <NumberField label="Lower earner&rsquo;s annual income" prefix="£" value={lower} onChange={setLower}
              hint="Must be below £12,570 (Personal Allowance) to transfer" />
            <NumberField label="Higher earner&rsquo;s annual income" prefix="£" value={higher} onChange={setHigher}
              hint="Must be between £12,571 and £50,270 (basic-rate taxpayer)" />
          </div>
        </Section>

        <Section title="Backdate previous years" eyebrow="Step 2" tone="inputs">
          <ScenarioTabs<'0' | '1' | '2' | '3' | '4'>
            value={backdate}
            onChange={setBackdate}
            options={[
              { value: '0', label: 'This year only' },
              { value: '2', label: '+ 2 years' },
              { value: '4', label: '+ 4 years (max)' },
            ]}
          />
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[12px]">
            {[0, 1, 2, 3, 4].map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setBackdate(String(y) as '0' | '1' | '2' | '3' | '4')}
                className="rounded-lg px-3 py-2 font-bold border transition-colors"
                style={{
                  background: parseInt(backdate) === y ? '#0A2540' : '#FFFFFF',
                  color: parseInt(backdate) === y ? '#FFFFFF' : '#0A2540',
                  borderColor: parseInt(backdate) === y ? '#0A2540' : '#E5E7EB',
                }}
              >
                {y === 0 ? 'Current' : `+${y} yr${y > 1 ? 's' : ''}`}
              </button>
            ))}
          </div>
          <p className="text-[11.5px] text-[#76777e] mt-2 leading-[1.5]">
            HMRC lets you backdate Marriage Allowance up to 4 prior tax years (2021/22 onwards), provided you met the criteria in each year.
          </p>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Eligibility &amp; the £252 mechanic" eyebrow="Step 3" tone="results">
          <StatGrid cols={3}>
            <StatCard label="Transfer amount" value={fmtGBP(TRANSFER_AMOUNT)} sub="10% of the Personal Allowance, rounded" />
            <StatCard label="Annual saving (per year)" value={fmtGBP(ANNUAL_SAVING)} sub={`£${TRANSFER_AMOUNT} × 20%`} tone={r.eligible ? 'positive' : 'muted'} />
            <StatCard label="Total backdated saving" value={fmtGBP(r.backdateSaving)} sub={`${r.yearsBackdated.length} year${r.yearsBackdated.length === 1 ? '' : 's'}`} tone={r.backdateSaving > 0 ? 'positive' : 'muted'} />
          </StatGrid>
          {r.yearsBackdated.length > 0 && (
            <div className="mt-4">
              <BreakdownTable
                highlightLast
                rows={[
                  ...r.yearsBackdated.map((y) => ({ label: `Tax year ${y.year}`, value: `+${fmtGBP(y.saving)}`, positive: true })),
                  { label: '2026/27 current year', value: `+${fmtGBP(r.annualSaving)}`, positive: true },
                  { label: 'Total claim', value: fmtGBP(r.totalSaving), bold: true },
                ]}
              />
            </div>
          )}
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        {r.eligible && (
          <Tip tone="success">
            Apply via the <strong>HMRC online service</strong> (gov.uk/apply-marriage-allowance) or your Personal Tax Account. The transfer is made by the lower earner — once set up it auto-renews each tax year.
          </Tip>
        )}
        {!r.eligible && (
          <Tip tone="warn">{r.ineligibleReason}</Tip>
        )}
        <Tip tone="info">
          Marriage Allowance is <strong>not the same</strong> as Married Couple&rsquo;s Allowance — the latter is only available where one partner was born before 6 April 1935.
        </Tip>
        <Tip tone="info">
          If both partners are basic-rate taxpayers with one below the Personal Allowance, this is essentially <strong>free money</strong> — many eligible couples never claim it.
        </Tip>
      </div>
    </CalcCard>
  );
}
