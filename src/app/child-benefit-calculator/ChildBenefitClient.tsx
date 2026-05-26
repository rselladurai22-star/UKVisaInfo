'use client';

import { useMemo, useState } from 'react';
import { calculateChildBenefit, ELDEST_WEEKLY, ADDITIONAL_WEEKLY, HICBC_LOWER, HICBC_UPPER } from '../../lib/child-benefit/calc';
import {
  CalcCard, NumberField, SelectField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, Tip, CheckboxField, fmtGBP,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function ChildBenefitClient() {
  const [children, setChildren]   = useState('2');
  const [income, setIncome]       = useState('72000');
  const [pension, setPension]     = useState('0');
  const [giftAid, setGiftAid]     = useState('0');
  const [claim, setClaim]         = useState(true);

  const adjustedIncome = Math.max(0,
    (parseFloat(income) || 0) - (parseFloat(pension) || 0) - (parseFloat(giftAid) || 0) * 1.25
  );

  const r = useMemo(() => calculateChildBenefit({
    children: parseInt(children) || 0,
    higherEarnerIncome: adjustedIncome,
  }), [children, adjustedIncome]);

  const headlineLabel = !claim
    ? 'You will not receive Child Benefit'
    : r.isFullyClawedBack
      ? 'Net benefit (after HICBC)'
      : r.clawbackPct > 0
        ? 'Net benefit after HICBC'
        : 'Net annual benefit';

  const headlineValue = !claim ? '£0' : fmtGBP(r.netBenefit);
  const tone = r.isFullyClawedBack || !claim ? 'red' : r.clawbackPct > 0 ? 'navy' : 'teal';
  const badge = r.clawbackPct > 0 && claim ? `${r.clawbackPct}% clawback` : undefined;

  return (
    <CalcCard wide>
      <SummaryHero
        label="Your result · 2024/25 rates"
        value={headlineValue}
        sub={claim
          ? `${parseInt(children) || 0} child${(parseInt(children) || 0) === 1 ? '' : 'ren'} · £${r.weeklyBenefit.toFixed(2)}/week gross entitlement`
          : 'Tick "Claim Child Benefit" below to receive payments (still claim to protect your State Pension NI credits even if clawed back).'}
        tone={tone}
        badge={badge}
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Household details" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Qualifying children" value={children} onChange={setChildren} hint="Under 16, or under 20 in approved education" />
            <SelectField label="Will you claim Child Benefit?" value={claim ? 'yes' : 'no'} onChange={(v) => setClaim(v === 'yes')}
              options={[
                { value: 'yes', label: 'Yes — receive the payment' },
                { value: 'no', label: 'No — opt out (still register to protect NI credits)' },
              ]}
            />
          </div>
        </Section>

        <Section title="Higher earner&rsquo;s income" eyebrow="Step 2" tone="inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberField label="Total taxable income" prefix="£" value={income} onChange={setIncome} hint="Salary, bonus, dividends, rental — before pension/Gift Aid" />
            <NumberField label="Pension contribution (gross)" prefix="£" value={pension} onChange={setPension} hint="Reduces adjusted net income" />
            <NumberField label="Gift Aid donations (cash)" prefix="£" value={giftAid} onChange={setGiftAid} hint="Grossed up at ×1.25 for HICBC" />
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-3">
              <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#76777e]">Adjusted net income</div>
              <div className="mt-1 text-[20px] font-extrabold tabular-nums text-[#0A2540]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                {fmtGBP(adjustedIncome)}
              </div>
              <div className="text-[11px] text-[#76777e] mt-0.5">HICBC tested against this figure</div>
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Where you sit on the HICBC taper" eyebrow="2025/26 thresholds" accent="#C9A14A">
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-4">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.1em] text-[#76777e]">
              <span>£0 charge below £{HICBC_LOWER.toLocaleString()}</span>
              <span>100% clawback at £{HICBC_UPPER.toLocaleString()}+</span>
            </div>
            <div className="relative h-3 mt-2 rounded-full bg-[#F1F3F5] overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#34D399] via-[#FBBF24] to-[#EF4444]" style={{ width: '100%', opacity: 0.85 }} />
              <div className="absolute top-[-4px] h-5 w-[2px] bg-[#0A2540]"
                style={{ left: `${Math.min(100, Math.max(0, ((adjustedIncome - HICBC_LOWER) / (HICBC_UPPER - HICBC_LOWER)) * 100))}%` }} />
            </div>
            <div className="mt-2 text-[12.5px] text-[#45464d]">
              At <strong>{fmtGBP(adjustedIncome)}</strong>, the clawback is <strong>{r.clawbackPct}%</strong> of the gross benefit.
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Full annual breakdown" eyebrow="Step 3" tone="results">
          <StatGrid cols={3}>
            <StatCard label="Gross annual benefit" value={fmtGBP(r.annualBenefit)} sub={`£${r.weeklyBenefit.toFixed(2)}/week`} />
            <StatCard label="HICBC charge" value={fmtGBP(r.hicbcCharge)} sub={`${r.clawbackPct}% of gross`} tone={r.hicbcCharge > 0 ? 'negative' : 'default'} />
            <StatCard label="Net benefit retained" value={claim ? fmtGBP(r.netBenefit) : '£0'} tone="primary" />
          </StatGrid>
          <div className="mt-4">
            <BreakdownTable
              highlightLast
              rows={[
                { label: 'Eldest / only child', value: `£${ELDEST_WEEKLY.toFixed(2)} / week × 52` },
                { label: 'Additional children', value: `£${ADDITIONAL_WEEKLY.toFixed(2)} / week × 52 × ${Math.max(0, (parseInt(children) || 0) - 1)}` },
                { label: 'Gross annual entitlement', value: fmtGBP(r.annualBenefit), bold: true },
                { label: `HICBC at ${r.clawbackPct}%`, value: `–${fmtGBP(r.hicbcCharge)}`, negative: true, sub: 'Self Assessment liability on higher earner' },
                { label: 'Net benefit you keep', value: claim ? fmtGBP(r.netBenefit) : '£0', bold: true },
              ]}
            />
          </div>
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        {!claim && (
          <Tip tone="warn">
            <strong>Still register</strong> — opting out of the payment is fine, but submitting Form CH2 protects your <strong>State Pension NI credits</strong> for years caring for a child under 12.
          </Tip>
        )}
        {r.clawbackPct > 0 && r.clawbackPct < 100 && (
          <Tip tone="info">
            <strong>Paying into a pension</strong> is the easiest way to reduce HICBC — a £5,000 salary sacrifice could save you the full clawback on top of the income-tax relief.
          </Tip>
        )}
        {r.isFullyClawedBack && claim && (
          <Tip tone="warn">
            You will receive the benefit but the higher earner must declare it via <strong>Self Assessment</strong> and repay it in full. Many families opt out at this level.
          </Tip>
        )}
      </div>
    </CalcCard>
  );
}
