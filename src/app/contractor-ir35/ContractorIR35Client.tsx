'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ShieldCheck, Briefcase, TrendingUp, AlertTriangle } from 'lucide-react';
import { calcTax, gbp, pct } from '../../lib/taxEngine';
import s from '../../components/calc/calc.module.css';

export default function ContractorIR35Client() {
  // Standalone States with Sensible Defaults
  const [dailyRate, setDailyRate] = useState<number>(400);
  const [workingDays, setWorkingDays] = useState<number>(220);
  
  // Advanced options (Progressive Disclosure)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  // Advanced inputs
  const [pensionPct, setPensionPct] = useState<number>(5);
  const [expenses, setExpenses] = useState<number>(3000);
  const [studentLoan, setStudentLoan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [scotland, setScotland] = useState<boolean>(false);
  const [postgradLoan, setPostgradLoan] = useState<boolean>(false);

  const annualContract = dailyRate * workingDays;

  // Run calculation
  const calculations = useMemo(() => {
    // 1. Outside IR35 — Ltd company, low salary £12,570 + dividends
    const salary = 12570;
    const pensionAmount = annualContract * (pensionPct / 100);
    const profitBeforeTax = Math.max(0, annualContract - salary - expenses - pensionAmount);
    
    // Corp Tax
    const corpTax = profitBeforeTax <= 50000 
      ? profitBeforeTax * 0.19 
      : 9500 + (profitBeforeTax - 50000) * 0.25;

    const profitAfterTax = Math.max(0, profitBeforeTax - corpTax);
    const dividend = profitAfterTax;

    // Personal tax on dividend
    const divAllowance = 500;
    const taxableDividends = Math.max(0, dividend - divAllowance);
    let dividendTax = 0;
    let remainingDiv = taxableDividends;

    // Personal Allowance used by salary, leaving £37,700 basic rate limit
    const basicLimit = 37700;
    const basicSlice = Math.min(remainingDiv, basicLimit);
    dividendTax += basicSlice * 0.0875;
    remainingDiv -= basicSlice;

    if (remainingDiv > 0) {
      const higherLimit = 74870; // £125,140 - £12,570 - £37,700
      const higherSlice = Math.min(remainingDiv, higherLimit);
      dividendTax += higherSlice * 0.3375;
      remainingDiv -= higherSlice;

      if (remainingDiv > 0) {
        dividendTax += remainingDiv * 0.3935;
      }
    }

    // Student loans on Outside IR35 (salary + dividend)
    let outsideSL = 0;
    const totalOutsideIncome = salary + dividend;
    const slThresholds = { plan1: 26065, plan2: 28470, plan4: 32745, plan5: 25000 };
    if (studentLoan !== 'none') {
      const threshold = slThresholds[studentLoan];
      if (totalOutsideIncome > threshold) {
        outsideSL += (totalOutsideIncome - threshold) * 0.09;
      }
    }
    if (postgradLoan && totalOutsideIncome > 21000) {
      outsideSL += (totalOutsideIncome - 21000) * 0.06;
    }

    const outsideNet = salary + dividend - dividendTax - outsideSL;
    const outsideTax = corpTax + dividendTax + outsideSL;

    // 2. Inside IR35 (Umbrella)
    const umbrellaMargin = 1200; // typical £25/week margins
    const grossAfterUmbrella = Math.max(0, annualContract - umbrellaMargin);
    
    // Employer costs (employer NI 13.8% + Apprenticeship Levy 0.5% = 14.3%)
    let employerCosts = 0;
    if (grossAfterUmbrella > 9100) {
      employerCosts = (grossAfterUmbrella - 9100) * 0.143 / 1.143;
    }
    const insideGrossSalary = Math.max(0, grossAfterUmbrella - employerCosts);

    // Calculate PAYE tax on Inside Gross Salary
    const insideTaxResult = calcTax({
      salary: insideGrossSalary,
      pensionPct,
      pensionType: 'salary_sacrifice',
      studentLoan,
      postgradLoan,
      scotland
    });

    const insideNet = insideTaxResult.net;
    const insideTax = annualContract - insideNet;

    // 3. Permanent Employee Equivalent
    const permSalary = annualContract * 0.65;
    const permTaxResult = calcTax({
      salary: permSalary,
      pensionPct,
      pensionType: 'salary_sacrifice',
      studentLoan,
      postgradLoan,
      scotland
    });

    const permNet = permTaxResult.net;
    const permTax = permSalary - permNet;

    return {
      outside: {
        net: outsideNet,
        tax: outsideTax,
        gross: annualContract,
        effectiveRate: outsideTax / annualContract,
        pension: pensionAmount,
        corpTax,
        divTax: dividendTax,
        slTax: outsideSL
      },
      inside: {
        net: insideNet,
        tax: insideTax,
        gross: annualContract,
        effectiveRate: insideTax / annualContract,
        pension: insideTaxResult.pension,
        paye: insideTaxResult.incomeTax,
        ni: insideTaxResult.ni,
        slTax: insideTaxResult.studentLoan,
        employerCosts,
        umbrellaMargin
      },
      perm: {
        net: permNet,
        tax: permTax,
        gross: permSalary,
        effectiveRate: permTax / permSalary,
        pension: permTaxResult.pension,
        paye: permTaxResult.incomeTax,
        ni: permTaxResult.ni,
        slTax: permTaxResult.studentLoan
      }
    };
  }, [annualContract, pensionPct, expenses, studentLoan, postgradLoan, scotland]);

  const bestNet = Math.max(calculations.outside.net, calculations.inside.net, calculations.perm.net);
  const diffOutsideInside = calculations.outside.net - calculations.inside.net;

  const PRESETS = [200, 350, 500, 750, 1000, 1500];

  return (
    <div className={s.dashboard}>
      {/* ── LEFT: Inputs ── */}
      <div className={s.panel}>
        {/* Day Rate & Working Days (Essential Inputs) */}
        <div className={s.salaryHero}>
          <div className={s.shead}>Offered Day Rate</div>
          <div className={s.amount}>
            <span className={s.cur}>£</span>
            <input
              type="number"
              className={s.amtInput}
              value={dailyRate || ''}
              onChange={e => setDailyRate(Math.max(0, +e.target.value))}
            />
            <span className={s.yr}>/ day</span>
          </div>
          <input
            type="range"
            className={s.slider}
            min={100} max={2500} step={25}
            value={dailyRate}
            onChange={e => setDailyRate(+e.target.value)}
          />
          <div className={s.scale}><span>£100</span><span>£2,500</span></div>
          <div className={s.presets}>
            {PRESETS.map(p => (
              <button key={p} type="button"
                className={dailyRate === p ? s.presetBtnActive : ''}
                onClick={() => setDailyRate(p)}
              >
                £{p}
              </button>
            ))}
          </div>
        </div>

        <div className={s.fieldCard} style={{ marginBottom: '20px' }}>
          <div className={s.fl}>Working Days per Year</div>
          <div className={s.fh}>Typical full-time contract has 220 billable days</div>
          <div className={s.numInput}>
            <input
              type="number"
              min={10} max={365}
              value={workingDays}
              onChange={e => setWorkingDays(Math.max(10, Math.min(365, +e.target.value)))}
            />
            <span className={s.inputAddon}>days</span>
          </div>
        </div>

        {/* Single "Advanced options" Progressive Disclosure Accordion */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: '#f8fafc',
              border: 0,
              padding: '16px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#1e293b'
            }}
          >
            <span>Advanced options</span>
            <ChevronDown size={18} style={{ color: '#64748b', transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showAdvanced && (
            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px', background: '#ffffff' }}>
              <div className={s.fieldGrid}>
                <div className={s.fieldCard}>
                  <div className={s.fl}>Annual Corp Expenses</div>
                  <div className={s.fh}>Accountancy, insurance, software, etc. (Outside only)</div>
                  <div className={s.numInput}>
                    <span>£</span>
                    <input type="number" value={expenses || ''} onChange={e => setExpenses(Math.max(0, +e.target.value))} />
                  </div>
                </div>

                <div className={s.fieldCard}>
                  <div className={s.fl}>Pension Contribution %</div>
                  <div className={s.fh}>Allocated out of contract value</div>
                  <div className={s.numInput}>
                    <input type="number" min={0} max={100} value={pensionPct} onChange={e => setPensionPct(Math.max(0, Math.min(100, +e.target.value)))} />
                    <span style={{ marginLeft: 'auto' }}>%</span>
                  </div>
                </div>

                <div className={s.fieldCard}>
                  <div className={s.fl}>Student Loan Plan</div>
                  <select className={s.select} value={studentLoan} onChange={e => setStudentLoan(e.target.value as any)}>
                    <option value="none">No Student Loan</option>
                    <option value="plan1">Plan 1</option>
                    <option value="plan2">Plan 2</option>
                    <option value="plan4">Plan 4 (Scotland)</option>
                    <option value="plan5">Plan 5</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={scotland} onChange={e => setScotland(e.target.checked)} style={{ accentColor: '#4f46e5' }} />
                  Scottish Taxpayer?
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={postgradLoan} onChange={e => setPostgradLoan(e.target.checked)} style={{ accentColor: '#4f46e5' }} />
                  Postgraduate Loan?
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Contract Billing Valuation Card */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.1em' }}>Annual Billing Value</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', color: '#0f172a', marginTop: '4px' }}>{gbp(annualContract)}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>£{dailyRate} × {workingDays} billing days</div>
        </div>
      </div>

      {/* ── RIGHT: Results (Standard Results UX Hierarchy) ── */}
      <div className={s.resultsCard}>
        {/* 1. Hero Number */}
        <div className={s.heroMetric}>
          <div className={s.mhead}>Outside IR35 Annual Take-Home Net</div>
          <div className={s.mval} style={{ color: '#4f46e5' }}>{gbp(calculations.outside.net)}</div>
          <div className={s.msub}>Equivalent to {gbp(calculations.outside.net / 12)} / month</div>
        </div>

        {/* 2. Plain-English Summary */}
        <div className={s.summaryText} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #4f46e5', fontSize: '13.5px', color: '#334155', lineHeight: '1.6' }}>
          Based on a day rate of <strong>{gbp(dailyRate)}</strong> over <strong>{workingDays}</strong> days (<strong>{gbp(annualContract)}</strong> gross billing), operating <strong>Outside IR35</strong> via a Limited Company yields an estimated net take-home pay of <strong>{gbp(calculations.outside.net)}</strong>. 
          This is <strong>{gbp(diffOutsideInside)}</strong> more than an equivalent <strong>Inside IR35</strong> umbrella contract (<strong>{gbp(calculations.inside.net)}</strong> net).
        </div>

        {/* 3. Collapsible "Full breakdown" Accordion */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setShowBreakdown(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: '#f8fafc',
              border: 0,
              padding: '16px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#1e293b'
            }}
          >
            <span>Full breakdown &amp; comparisons</span>
            <ChevronDown size={18} style={{ color: '#64748b', transform: showBreakdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showBreakdown && (
            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff' }}>
              {/* Visual Bars Comparison */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>Outside IR35 (Ltd Co.)</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#4f46e5' }}>{gbp(calculations.outside.net)} / yr</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(calculations.outside.net / bestNet) * 100}%`, background: '#4f46e5' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10.5px', color: '#64748b' }}>
                    <span>Effective Tax Rate: {pct(calculations.outside.effectiveRate)}</span>
                    <span>Retention: {pct(1 - calculations.outside.effectiveRate)}</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>Inside IR35 (Umbrella)</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#f97316' }}>{gbp(calculations.inside.net)} / yr</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(calculations.inside.net / bestNet) * 100}%`, background: '#f97316' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10.5px', color: '#64748b' }}>
                    <span>Effective Tax Rate: {pct(calculations.inside.effectiveRate)}</span>
                    <span>Loss to IR35: −{gbp(diffOutsideInside)}</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>Permanent Equivalent (65% day rate)</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#10b981' }}>{gbp(calculations.perm.net)} / yr</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(calculations.perm.net / bestNet) * 100}%`, background: '#10b981' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10.5px', color: '#64748b' }}>
                    <span>Perm Salary: {gbp(calculations.perm.gross)}</span>
                    <span>Effective Tax: {pct(calculations.perm.effectiveRate)}</span>
                  </div>
                </div>
              </div>

              {/* Outside IR35 detailed card */}
              <div style={{ background: 'rgba(79, 70, 229, 0.04)', border: '1px solid rgba(79, 70, 229, 0.12)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontWeight: 700, color: '#4f46e5', fontSize: '13px', marginBottom: '12px' }}>Outside IR35 Structure Analysis</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Annual Ltd Billing Revenue', val: calculations.outside.gross },
                    { label: 'Director Salary (Salary Expense)', val: -12570 },
                    { label: 'Annual Corp Expenses', val: -expenses },
                    { label: 'Company Pension Contribution', val: -calculations.outside.pension },
                    { label: 'Corporation Tax (19% / 25%)', val: -calculations.outside.corpTax },
                    { label: 'Personal Dividend Tax', val: -calculations.outside.divTax },
                    { label: 'Student Loan Deductions', val: -calculations.outside.slTax },
                    { label: 'Net Take-Home Pay', val: calculations.outside.net, highlight: true }
                  ].map((row, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', borderBottom: row.highlight ? '1px solid #e2e8f0' : 'none', paddingTop: row.highlight ? '6px' : '0', fontWeight: row.highlight ? 700 : 400 }}>
                      <span style={{ color: row.highlight ? '#1e293b' : '#475569' }}>{row.label}</span>
                      <span style={{ color: row.highlight ? '#4f46e5' : (row.val < 0 ? '#dc2626' : '#1e293b'), fontFamily: 'var(--font-mono)' }}>
                        {row.val < 0 ? `−${gbp(-row.val)}` : gbp(row.val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inside IR35 detailed card */}
              <div style={{ background: 'rgba(249, 115, 22, 0.04)', border: '1px solid rgba(249, 115, 22, 0.12)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontWeight: 700, color: '#f97316', fontSize: '13px', marginBottom: '12px' }}>Inside IR35 (Umbrella) Structure Analysis</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Annual Contract Billing Value', val: calculations.inside.gross },
                    { label: 'Umbrella Margin (Admin Fee)', val: -calculations.inside.umbrellaMargin },
                    { label: 'Employer NI & App Levy Deductions', val: -calculations.inside.employerCosts },
                    { label: 'Inside Gross PAYE Salary', val: calculations.inside.gross - calculations.inside.umbrellaMargin - calculations.inside.employerCosts },
                    { label: 'Employee Income Tax (PAYE)', val: -calculations.inside.paye },
                    { label: 'Employee National Insurance', val: -calculations.inside.ni },
                    { label: 'Student Loan Deductions', val: -calculations.inside.slTax },
                    { label: 'Net Take-Home Pay', val: calculations.inside.net, highlight: true }
                  ].map((row, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', borderBottom: row.highlight ? '1px solid #e2e8f0' : 'none', paddingTop: row.highlight ? '6px' : '0', fontWeight: row.highlight ? 700 : 400 }}>
                      <span style={{ color: row.highlight ? '#1e293b' : '#475569' }}>{row.label}</span>
                      <span style={{ color: row.highlight ? '#f97316' : (row.val < 0 ? '#dc2626' : '#1e293b'), fontFamily: 'var(--font-mono)' }}>
                        {row.val < 0 ? `−${gbp(-row.val)}` : gbp(row.val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning card for status risk */}
              {diffOutsideInside > 5000 && (
                <div className={s.warningCard} style={{ margin: 0 }}>
                  <AlertTriangle size={16} className={s.warningIcon} style={{ flexShrink: 0 }} />
                  <div className={s.warningContent}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '12.5px', fontWeight: 700, color: '#9a3412' }}>Status Compliance Risk</h4>
                    <p style={{ margin: 0, fontSize: '11.5px', color: '#c2410c' }}>
                      Operating outside IR35 increases your net pay by {gbp(diffOutsideInside)}/year. However, you must ensure that your contract terms and actual working relationships strictly conform to HMRC guidelines for genuine business-to-business transactions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
