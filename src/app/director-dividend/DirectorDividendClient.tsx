'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ShieldCheck, Target, TrendingUp, HelpCircle } from 'lucide-react';
import { calcTax, gbp, pct } from '../../lib/taxEngine';
import s from '../../components/calc/calc.module.css';

interface OptimisationResult {
  revenue: number;
  expenses: number;
  salary: number;
  dividend: number;
  corpTax: number;
  personalTaxOnSalary: number;
  niOnSalary: number;
  employerNi: number;
  dividendTax: number;
  studentLoanTax: number;
  netTakeHome: number;
  totalTax: number;
  effectiveRate: number;
}

function calcDirectorOptimal(
  revenue: number,
  expenses: number,
  salary: number,
  studentLoan: 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' = 'none',
  postgradLoan = false,
  scotland = false
): OptimisationResult {
  // Employer NI on director salary
  // 2026/27 Secondary Threshold is £9,100. Rate is 13.8%.
  const secondaryThreshold = 9100;
  const employerNi = salary > secondaryThreshold ? (salary - secondaryThreshold) * 0.138 : 0;

  const profitBeforeCorpTax = Math.max(0, revenue - expenses - salary - employerNi);

  // Corp Tax 2026/27: 19% on first £50,000, 25% (or 26.5% marginal) thereafter.
  let corpTax = 0;
  if (profitBeforeCorpTax <= 50000) {
    corpTax = profitBeforeCorpTax * 0.19;
  } else {
    corpTax = 9500 + (profitBeforeCorpTax - 50000) * 0.25;
  }

  const profitAfterTax = Math.max(0, profitBeforeCorpTax - corpTax);
  const dividend = profitAfterTax;

  // Personal tax on salary
  const salTaxResult = calcTax({
    salary,
    scotland,
    studentLoan: 'none', // Handle student loans on total personal income below
    postgradLoan: false
  });

  // Dividend tax
  const divAllowance = 500;
  const totalPersonalIncome = salary + dividend;
  
  // PA taper
  let pa = 12570;
  if (totalPersonalIncome > 100000) {
    pa = Math.max(0, 12570 - (totalPersonalIncome - 100000) / 2);
  }

  const unusedPA = Math.max(0, pa - salary);
  let remainingDiv = Math.max(0, dividend - divAllowance);
  let dividendTax = 0;

  // Utilize unused PA first
  if (unusedPA > 0) {
    const slice = Math.min(remainingDiv, unusedPA);
    remainingDiv -= slice;
  }

  if (remainingDiv > 0) {
    const currentTaxableSalary = Math.max(0, salary - pa);
    const basicLimitRemaining = Math.max(0, 37700 - currentTaxableSalary);

    const basicSlice = Math.min(remainingDiv, basicLimitRemaining);
    dividendTax += basicSlice * 0.0875;
    remainingDiv -= basicSlice;

    if (remainingDiv > 0) {
      const higherLimit = 74870; // 125,140 - 12,570 - 37,700
      const higherSlice = Math.min(remainingDiv, higherLimit);
      dividendTax += higherSlice * 0.3375;
      remainingDiv -= higherSlice;

      if (remainingDiv > 0) {
        dividendTax += remainingDiv * 0.3935;
      }
    }
  }

  // Student loan deductions on combined personal income (salary + dividend)
  let studentLoanTax = 0;
  const slThresholds = { plan1: 26065, plan2: 28470, plan4: 32745, plan5: 25000 };
  if (studentLoan !== 'none') {
    const threshold = slThresholds[studentLoan];
    if (totalPersonalIncome > threshold) {
      studentLoanTax += (totalPersonalIncome - threshold) * 0.09;
    }
  }
  if (postgradLoan && totalPersonalIncome > 21000) {
    studentLoanTax += (totalPersonalIncome - 21000) * 0.06;
  }

  const netTakeHome = salary + dividend - salTaxResult.incomeTax - salTaxResult.ni - dividendTax - studentLoanTax;
  const totalTax = corpTax + salTaxResult.incomeTax + salTaxResult.ni + employerNi + dividendTax + studentLoanTax;
  const effectiveRate = revenue > 0 ? totalTax / revenue : 0;

  return {
    revenue,
    expenses,
    salary,
    dividend,
    corpTax,
    personalTaxOnSalary: salTaxResult.incomeTax,
    niOnSalary: salTaxResult.ni,
    employerNi,
    dividendTax,
    studentLoanTax,
    netTakeHome,
    totalTax,
    effectiveRate
  };
}

export default function DirectorDividendClient() {
  const [revenue, setRevenue] = useState<number>(120000);
  const [expenses, setExpenses] = useState<number>(5000);
  const [salary, setSalary] = useState<number>(12570);

  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  // Advanced fields
  const [studentLoan, setStudentLoan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [postgradLoan, setPostgradLoan] = useState<boolean>(false);
  const [scotland, setScotland] = useState<boolean>(false);

  // Compute sweet spot
  const sweetSpot = useMemo(() => {
    // Try salary levels of £0, £9,100, and £12,570 to see which gives highest net take home
    const options = [0, 9100, 12570];
    let bestSal = 12570;
    let bestNet = 0;
    for (const sal of options) {
      const res = calcDirectorOptimal(revenue, expenses, sal, studentLoan, postgradLoan, scotland);
      if (res.netTakeHome > bestNet) {
        bestNet = res.netTakeHome;
        bestSal = sal;
      }
    }
    return { salary: bestSal, net: bestNet };
  }, [revenue, expenses, studentLoan, postgradLoan, scotland]);

  // Calculations for current salary input
  const res = useMemo(() => {
    return calcDirectorOptimal(revenue, expenses, salary, studentLoan, postgradLoan, scotland);
  }, [revenue, expenses, salary, studentLoan, postgradLoan, scotland]);

  const isOptimal = Math.abs(salary - sweetSpot.salary) < 10;
  const PRESETS = [50000, 80000, 120000, 150000, 200000, 300000];

  return (
    <div className={s.dashboard}>
      {/* ── LEFT: Inputs ── */}
      <div className={s.panel}>
        {/* Estimated Company Revenue (Turnover) - Essential Input */}
        <div className={s.salaryHero}>
          <div className={s.shead}>Annual Ltd Company Revenue</div>
          <div className={s.amount}>
            <span className={s.cur}>£</span>
            <input
              type="number"
              className={s.amtInput}
              value={revenue || ''}
              onChange={e => setRevenue(Math.max(0, +e.target.value))}
            />
            <span className={s.yr}>/ year</span>
          </div>
          <input
            type="range"
            className={s.slider}
            min={10000} max={500000} step={5000}
            value={revenue}
            onChange={e => setRevenue(+e.target.value)}
          />
          <div className={s.scale}><span>£10k</span><span>£500k</span></div>
          <div className={s.presets}>
            {PRESETS.map(p => (
              <button key={p} type="button"
                className={revenue === p ? s.presetBtnActive : ''}
                onClick={() => setRevenue(p)}
              >
                £{p / 1000}k
              </button>
            ))}
          </div>
        </div>

        {/* Company Expenses (Essential Input) */}
        <div className={s.fieldCard} style={{ marginBottom: '20px' }}>
          <div className={s.fl}>Annual Allowable Expenses</div>
          <div className={s.fh}>Accountancy fees, insurance, travel, home office, etc.</div>
          <div className={s.numInput}>
            <span>£</span>
            <input
              type="number"
              value={expenses || ''}
              onChange={e => setExpenses(Math.max(0, +e.target.value))}
            />
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
              <div className={s.fieldCard}>
                <div className={s.fl}>Director Salary (Annual)</div>
                <div className={s.fh}>Defaults to Primary Threshold £12,570 for optimum tax write-off.</div>
                <div className={s.numInput}>
                  <span>£</span>
                  <input
                    type="number"
                    value={salary || ''}
                    onChange={e => setSalary(Math.max(0, +e.target.value))}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {[0, 9100, 12570].map(v => (
                    <button key={v} type="button"
                      className={salary === v ? s.presetBtnActive : ''}
                      style={{
                        fontSize: '11px', fontWeight: 600, background: '#f1f5f9', border: '1px solid #e2e8f0',
                        borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', color: '#475569'
                      }}
                      onClick={() => setSalary(v)}>
                      {v === 0 ? '£0 Salary' : v === 9100 ? '£9,100 (Secondary NI)' : '£12,570 (Primary Threshold)'}
                    </button>
                  ))}
                  <button type="button"
                    style={{
                      fontSize: '11px', fontWeight: 700, background: '#ecfdf5', border: '1px solid rgba(4,120,87,0.3)',
                      borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', color: '#047857'
                    }}
                    onClick={() => setSalary(sweetSpot.salary)}>
                    🎯 Optimal: {gbp(sweetSpot.salary)}
                  </button>
                </div>
              </div>

              <div className={s.fieldGrid}>
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

                <div className={s.fieldCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    <input type="checkbox" checked={scotland} onChange={e => setScotland(e.target.checked)} style={{ accentColor: '#4f46e5' }} />
                    Scottish Taxpayer?
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer', marginTop: '10px' }}>
                    <input type="checkbox" checked={postgradLoan} onChange={e => setPostgradLoan(e.target.checked)} style={{ accentColor: '#4f46e5' }} />
                    Postgraduate Loan?
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Results (Standard Results UX Hierarchy) ── */}
      <div className={s.resultsCard}>
        {/* 1. Hero Number */}
        <div className={s.heroMetric}>
          <div className={s.mhead}>Estimated Director Net Take-Home</div>
          <div className={s.mval} style={{ color: '#10b981' }}>{gbp(res.netTakeHome)}</div>
          <div className={s.msub}>Salary: {gbp(res.salary)} | Dividends: {gbp(res.dividend)}</div>
        </div>

        {/* 2. Plain-English Summary */}
        <div className={s.summaryText} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #10b981', fontSize: '13.5px', color: '#334155', lineHeight: '1.6' }}>
          At a company turnover of <strong>{gbp(revenue)}</strong> and expenses of <strong>{gbp(expenses)}</strong>, drawing a salary of <strong>{gbp(res.salary)}</strong> leaves <strong>{gbp(res.dividend)}</strong> in dividends. 
          Your net take-home is <strong>{gbp(res.netTakeHome)}</strong> (effective tax leakage of <strong>{pct(res.effectiveRate)}</strong>). 
          {isOptimal ? (
            <span> This split matches the mathematically optimal sweet spot.</span>
          ) : (
            <span> You could increase your net take-home by <strong>{gbp(sweetSpot.net - res.netTakeHome)}</strong> by adjusting the director salary to <strong>{gbp(sweetSpot.salary)}</strong>.</span>
          )}
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
            <span>Full breakdown &amp; leakage ledger</span>
            <ChevronDown size={18} style={{ color: '#64748b', transform: showBreakdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showBreakdown && (
            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px', background: '#ffffff' }}>
              {/* Extraction ratio visual progress */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>Extraction Mix</div>
                <div style={{ display: 'flex', height: '12px', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: `${(res.salary / revenue) * 100}%`, background: '#4f46e5' }} />
                  <div style={{ width: `${(res.dividend / revenue) * 100}%`, background: '#10b981' }} />
                  <div style={{ flex: 1, background: '#f43f5e' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600 }}>
                  <span style={{ color: '#4f46e5' }}>Salary: {pct(res.salary / revenue)}</span>
                  <span style={{ color: '#10b981' }}>Dividends: {pct(res.dividend / revenue)}</span>
                  <span style={{ color: '#f43f5e' }}>Tax &amp; Expenses: {pct((revenue - res.salary - res.dividend) / revenue)}</span>
                </div>
              </div>

              {/* Detailed Ledger Table */}
              <div className={s.ledgerCard} style={{ margin: 0 }}>
                <table className={s.ledgerTable}>
                  <thead>
                    <tr>
                      <th>Extraction Component</th>
                      <th>Gross Amount</th>
                      <th>Tax / Deductions</th>
                      <th>Net Extracted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ltd Revenue (Pre-expense)</td>
                      <td>{gbp(revenue)}</td>
                      <td>−</td>
                      <td>{gbp(revenue)}</td>
                    </tr>
                    <tr>
                      <td>Company Expenses</td>
                      <td>−</td>
                      <td>−{gbp(expenses)}</td>
                      <td>−</td>
                    </tr>
                    <tr>
                      <td>Director Salary</td>
                      <td>{gbp(res.salary)}</td>
                      <td>
                        Income Tax: −{gbp(res.personalTaxOnSalary)}<br />
                        Employee NI: −{gbp(res.niOnSalary)}<br />
                        Employer NI: −{gbp(res.employerNi)}
                      </td>
                      <td>{gbp(res.salary - res.personalTaxOnSalary - res.niOnSalary)}</td>
                    </tr>
                    <tr>
                      <td>Corporation Tax</td>
                      <td>−</td>
                      <td>−{gbp(res.corpTax)}</td>
                      <td>−</td>
                    </tr>
                    <tr>
                      <td>Dividends Extracted</td>
                      <td>{gbp(res.dividend)}</td>
                      <td>−{gbp(res.dividendTax)}</td>
                      <td>{gbp(res.dividend - res.dividendTax)}</td>
                    </tr>
                    {res.studentLoanTax > 0 && (
                      <tr>
                        <td>Student Loan Deductions</td>
                        <td>−</td>
                        <td>−{gbp(res.studentLoanTax)}</td>
                        <td>−</td>
                      </tr>
                    )}
                    <tr className={s.ledgerRowTotal}>
                      <td><strong>Net Extractable Value</strong></td>
                      <td><strong>{gbp(res.salary + res.dividend)}</strong></td>
                      <td><strong>Total Tax: −{gbp(res.totalTax)}</strong></td>
                      <td><strong>{gbp(res.netTakeHome)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Sweet spot tip */}
              <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6', fontSize: '12.5px', color: '#1e3a8a' }}>
                <strong>Why £12,570?</strong> Paying a salary up to the Primary NI threshold (£12,570) counts as a tax-deductible expense for the company (saving Corporation Tax), while incurring zero employee National Insurance.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
