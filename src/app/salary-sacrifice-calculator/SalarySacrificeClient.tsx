'use client';

import { useMemo, useState } from 'react';
import { calculateSalarySacrifice } from '../../lib/salary-sacrifice/calc';
import {
  CalcCard, NumberField, Section, StatGrid, StatCard,
  SummaryHero, BreakdownTable, ScenarioTabs, Tip, fmtGBP,
} from '../../components/calc-shell/CalcFormPrimitives';

export default function SalarySacrificeClient() {
  const [salary, setSalary]       = useState('60000');
  const [mode, setMode]           = useState<'amount' | 'pct'>('pct');
  const [pct, setPct]             = useState('10');
  const [amount, setAmount]       = useState('5000');
  const [erShare, setErShare]     = useState('100');

  const sacrifice = mode === 'amount'
    ? parseFloat(amount) || 0
    : ((parseFloat(salary) || 0) * (parseFloat(pct) || 0)) / 100;

  const r = useMemo(() => calculateSalarySacrifice({
    grossSalary: parseFloat(salary) || 0,
    sacrificeAmount: sacrifice,
  }), [salary, sacrifice]);

  const erShareNum = Math.min(100, Math.max(0, parseFloat(erShare) || 0));
  const erShared = r.employerNiSaving * (erShareNum / 100);
  const finalPot = r.potContribution + erShared;

  return (
    <CalcCard wide>
      <SummaryHero
        label="Net cost to you · 2025/26"
        value={fmtGBP(r.netCostToEmployee)}
        sub={`For ${fmtGBP(finalPot)} into your pension — that&rsquo;s ${r.netCostToEmployee > 0 ? Math.round((finalPot / r.netCostToEmployee - 1) * 100) : 0}% &ldquo;free money&rdquo; vs the cost.`}
        tone="navy"
        badge={`${(sacrifice / (parseFloat(salary) || 1) * 100).toFixed(1)}% of salary`}
      />

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <Section title="Your salary" eyebrow="Step 1" tone="inputs">
          <div className="grid grid-cols-1 gap-3">
            <NumberField label="Gross annual salary" prefix="£" value={salary} onChange={setSalary} hint="Before any sacrifice — your contractual salary" />
            <ScenarioTabs<'amount' | 'pct'>
              value={mode}
              onChange={setMode}
              options={[
                { value: 'pct', label: 'By percentage', sub: '% of gross salary' },
                { value: 'amount', label: 'By fixed £', sub: 'Set annual £ amount' },
              ]}
            />
            {mode === 'pct' ? (
              <NumberField label="Sacrifice percentage" suffix="%" value={pct} onChange={setPct} hint="Typical schemes: 5–20% of salary" />
            ) : (
              <NumberField label="Annual sacrifice amount" prefix="£" value={amount} onChange={setAmount} hint="Watch the £60,000 annual allowance" />
            )}
            <NumberField label="Employer NI rebate shared" suffix="%" value={erShare} onChange={setErShare} hint="Best schemes pass 100% back into your pot" />
          </div>
        </Section>

        <Section title="Where every £1 goes" eyebrow="Step 2" tone="results">
          <BreakdownTable
            rows={[
              { label: 'Sacrifice amount', value: fmtGBP(r.sacrificeAmount), bold: true },
              { label: 'Income tax saved', value: `+${fmtGBP(r.employeeItSaving)}`, positive: true, sub: 'At your marginal rate' },
              { label: 'Employee NI saved', value: `+${fmtGBP(r.employeeNiSaving)}`, positive: true, sub: '8% / 2% above thresholds' },
              { label: 'Net cost from take-home', value: fmtGBP(r.netCostToEmployee), bold: true, sub: 'The real out-of-pocket' },
              { label: 'Employer NI saved (15%)', value: fmtGBP(r.employerNiSaving), sub: `${erShareNum}% rebated into your pot` },
              { label: 'Final pension pot increase', value: fmtGBP(finalPot), bold: true },
            ]}
            highlightLast
          />
        </Section>
      </div>

      <div className="mt-6">
        <Section title="Salary Sacrifice vs Relief-at-Source comparison">
          <StatGrid cols={3}>
            <StatCard label="Salary Sacrifice total saving" value={fmtGBP(r.totalSaving)} tone="primary" sub="IT + employee NI + employer NI" />
            <StatCard label="RAS would only save" value={fmtGBP(r.vsRasItSavingOnly)} tone="muted" sub="Basic-rate IT relief at source" />
            <StatCard label="Salary Sacrifice extra" value={`+${fmtGBP(r.extraVsRas)}`} tone="positive" sub="Additional benefit vs RAS" />
          </StatGrid>
        </Section>
      </div>

      <div className="mt-6 space-y-2.5">
        {sacrifice > 60000 && (
          <Tip tone="warn">
            You&rsquo;re sacrificing above the <strong>£60,000 annual allowance</strong>. Excess attracts the Annual Allowance Charge at your marginal rate. Check carry-forward of unused allowance from the previous 3 tax years.
          </Tip>
        )}
        {(parseFloat(salary) || 0) - sacrifice < 12570 && (
          <Tip tone="warn">
            After sacrifice, salary falls below the <strong>Personal Allowance (£12,570)</strong> — be careful not to sacrifice into &ldquo;no tax saved&rdquo; territory or below National Living Wage.
          </Tip>
        )}
        <Tip tone="info">
          Salary sacrifice reduces gross pay for <strong>all PAYE purposes</strong> — meaning lower mortgage affordability, lower SMP/SSP, lower life-cover multiples. Weigh against the tax saving.
        </Tip>
        {erShareNum < 100 && (
          <Tip tone="info">
            Many employers keep some of the 15% employer-NI saving. <strong>100% rebate</strong> is the gold standard — ask HR if your scheme can pass it all back.
          </Tip>
        )}
      </div>
    </CalcCard>
  );
}
