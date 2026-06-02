'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { calcTax, gbp, pct } from '../../lib/taxEngine';
import s from '../../components/calc/calc.module.css';

interface DecodedCode {
  allowance: number;
  description: string;
  plainEnglish: string;
  issues: string[];
  refundLikelihood: 'high' | 'medium' | 'low';
  emergencyTax: boolean;
}

function decodeTaxCode(raw: string): DecodedCode {
  const code = raw.trim().toUpperCase();
  const issues: string[] = [];
  let allowance = 12570;
  let description = '';
  let plainEnglish = '';
  let emergencyTax = false;
  let refundLikelihood: DecodedCode['refundLikelihood'] = 'low';

  if (code === 'BR') {
    allowance = 0;
    description = 'Basic Rate (flat 20%)';
    plainEnglish = 'Every pound from this job is taxed at 20% — you have no tax-free allowance here. This code is usually correct for a second job, but if it\'s your only job, HMRC may owe you a refund.';
    issues.push('No personal allowance applied');
    issues.push('Check this is not your primary employment');
    refundLikelihood = 'high';
  } else if (code === 'D0') {
    allowance = 0;
    description = 'Higher Rate (flat 40%)';
    plainEnglish = 'Every pound taxed at 40%. Used for secondary jobs for higher-rate taxpayers. If this is your only income, you are almost certainly overpaying.';
    issues.push('Flat 40% — verify this is secondary employment');
    refundLikelihood = 'high';
  } else if (code === 'D1') {
    allowance = 0;
    description = 'Additional Rate (flat 45%)';
    plainEnglish = 'Every pound taxed at 45%. Rare — used for high earners with multiple income sources where all allowances are exhausted.';
    issues.push('Flat 45% — confirm with your accountant');
    refundLikelihood = 'medium';
  } else if (code === 'NT') {
    allowance = 0;
    description = 'No Tax';
    plainEnglish = 'No tax deducted. This can be correct for some specific situations (e.g. non-resident, certain pension drawdown) but should be queried with HMRC if unexpected.';
    issues.push('Zero tax deducted — verify with HMRC');
    refundLikelihood = 'low';
  } else if (code === '0T') {
    allowance = 0;
    description = 'Emergency / No Allowance';
    plainEnglish = 'No personal allowance and tax at progressive rates from £0. Usually applied when HMRC lacks your full tax information — often at the start of a job.';
    emergencyTax = true;
    issues.push('Emergency code — may mean overpayment');
    issues.push('Submit P45/P60 or call HMRC to correct');
    refundLikelihood = 'high';
  } else if (code.startsWith('K')) {
    const n = parseInt(code.slice(1)) || 0;
    allowance = -(n * 10);
    description = `K Code (negative allowance of £${(n * 10).toLocaleString()})`;
    plainEnglish = `You have benefits (like a company car or private medical) worth more than your personal allowance. HMRC adds £${(n * 10).toLocaleString()} extra to your taxable income. Your employer cannot deduct more than 50% of your gross pay in tax.`;
    if (n * 10 > 5000) issues.push('Large K code — verify your P11D benefits are accurate');
    refundLikelihood = 'medium';
  } else if (code === 'M') {
    allowance = 13830;
    description = 'Marriage Allowance (recipient — extra 10%)';
    plainEnglish = 'Your partner has transferred 10% of their personal allowance to you, increasing your tax-free income.';
    refundLikelihood = 'low';
  } else if (code === 'N') {
    allowance = 11310;
    description = 'Marriage Allowance (transferor — reduced 10%)';
    plainEnglish = 'You have transferred 10% of your personal allowance to your partner.';
    refundLikelihood = 'low';
  } else {
    const m = code.match(/^([SC]?)(\d+)([LTVY])$/);
    if (m) {
      const num = parseInt(m[2]) * 10;
      const prefix = m[1];
      const suffix = m[3];
      allowance = num;
      const region = prefix === 'S' ? 'Scotland' : prefix === 'C' ? 'Wales' : 'England/NI';
      const suffixMap: Record<string, string> = {
        L: 'standard (you get the basic personal allowance)',
        T: 'complex calculation involving other allowances',
        Y: 'full personal allowance (born before 6 April 1938)',
        V: 'married couples/civil partners allowance',
      };
      description = `${region} — £${num.toLocaleString()} personal allowance`;
      plainEnglish = `You have a tax-free allowance of £${num.toLocaleString()} in ${region}. Suffix ${suffix} means ${suffixMap[suffix] ?? 'special HMRC rules apply'}.`;
      if (num !== 12570) {
        if (num < 12570) {
          issues.push(`Allowance £${num.toLocaleString()} is less than standard £12,570 — may have unpaid tax from a previous year`);
          refundLikelihood = 'medium';
        } else {
          issues.push(`Allowance £${num.toLocaleString()} is higher than standard — check you have a reason for this`);
        }
      }
    } else {
      description = 'Unrecognised code';
      plainEnglish = 'This code format is not standard. HMRC may have used a bespoke coding. Contact HMRC or your employer\'s payroll team.';
      issues.push('Non-standard code — verify with HMRC');
      refundLikelihood = 'high';
    }
  }

  return { allowance, description, plainEnglish, issues, refundLikelihood, emergencyTax };
}

export default function PayslipAuditorClient() {
  const [activeTab, setActiveTab] = useState<'decoder' | 'auditor'>('decoder');

  // Standalone States with Sensible Defaults (PAYE £50k)
  const [taxCodeInput, setTaxCodeInput] = useState<string>('1257L');
  const [grossPay, setGrossPay] = useState<number>(50000);
  const [incomeTaxPaid, setIncomeTaxPaid] = useState<number>(7486);
  const [niPaid, setNiPaid] = useState<number>(2994.40);
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'annual'>('annual');

  // Advanced options state (progressive disclosure)
  const [pensionPct, setPensionPct] = useState<number>(0);
  const [studentLoan, setStudentLoan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [postgradLoan, setPostgradLoan] = useState<boolean>(false);
  const [niCategory, setNiCategory] = useState<'A' | 'B' | 'C'>('A');
  const [scotland, setScotland] = useState<boolean>(false);

  // Accordion UI state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const decoded = useMemo(() => decodeTaxCode(taxCodeInput), [taxCodeInput]);

  // Auditor Calculations
  const audit = useMemo(() => {
    const multiplier = period === 'monthly' ? 12 : period === 'weekly' ? 52 : 1;
    const annualGross = grossPay * multiplier;
    const annualTaxPaid = incomeTaxPaid * multiplier;
    const annualNiPaid = niPaid * multiplier;

    const expected = calcTax({
      salary: annualGross,
      taxCode: taxCodeInput,
      pensionPct,
      studentLoan,
      postgradLoan,
      niCategory,
      scotland
    });

    const taxVariance = annualTaxPaid - expected.incomeTax;
    const niVariance = annualNiPaid - expected.ni;

    const errors = [];
    if (Math.abs(taxVariance) > 50) {
      if (taxVariance > 0) {
        errors.push({
          type: 'overpayment',
          field: 'Income Tax',
          amount: taxVariance,
          message: `Overpaid ${gbp(taxVariance)} in income tax. This might be due to a Week 1/Month 1 emergency code or coding calculation errors.`,
        });
      } else {
        errors.push({
          type: 'underpayment',
          field: 'Income Tax',
          amount: Math.abs(taxVariance),
          message: `Underpaid ${gbp(Math.abs(taxVariance))} in income tax. HMRC will likely issue a coding adjustment next tax year to recover this.`,
        });
      }
    }

    if (Math.abs(niVariance) > 50) {
      if (niVariance > 0) {
        errors.push({
          type: 'overpayment',
          field: 'National Insurance',
          amount: niVariance,
          message: `NI overpayment of ${gbp(niVariance)} detected. Make sure your employer is applying the correct category.`,
        });
      }
    }

    return { expected, taxVariance, niVariance, errors, annualGross, annualTaxPaid, annualNiPaid };
  }, [grossPay, incomeTaxPaid, niPaid, taxCodeInput, period, pensionPct, studentLoan, postgradLoan, niCategory, scotland]);

  const refundColors = { high: '#ef4444', medium: '#f97316', low: '#10b981' };

  return (
    <div className={s.dashboard}>
      {/* ── LEFT: Inputs ── */}
      <div className={s.panel}>
        {/* Mode Selector */}
        <div className={s.segmentedControl}>
          {(['decoder', 'auditor'] as const).map(m => (
            <button key={m} type="button"
              className={`${s.segmentBtn} ${activeTab === m ? s.segmentBtnActive : ''}`}
              onClick={() => setActiveTab(m)}>
              {m === 'decoder' ? '🔍 Tax Code Decoder' : '📋 Payslip Auditor'}
            </button>
          ))}
        </div>

        {/* Decoder Mode Basic Input */}
        {activeTab === 'decoder' && (
          <div className={s.formSection}>
            <div className={s.shead}>HMRC Tax Code</div>
            <div className={s.numInput} style={{ fontSize: '18px', fontWeight: 700 }}>
              <input
                type="text"
                value={taxCodeInput}
                onChange={e => setTaxCodeInput(e.target.value.toUpperCase())}
                style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.04em' }}
              />
            </div>
            <div className={s.presets} style={{ marginTop: '12px' }}>
              {['1257L', 'BR', 'D0', '0T', 'K250', 'S1257L'].map(c => (
                <button key={c} type="button"
                  className={taxCodeInput === c ? s.presetBtnActive : ''}
                  onClick={() => setTaxCodeInput(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auditor Mode Basic Inputs */}
        {activeTab === 'auditor' && (
          <div className={s.formSection}>
            <div className={s.segmentedControl} style={{ marginBottom: '16px' }}>
              {(['monthly', 'weekly', 'annual'] as const).map(p => (
                <button key={p} type="button"
                  className={`${s.segmentBtn} ${period === p ? s.segmentBtnActive : ''}`}
                  onClick={() => setPeriod(p)}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className={s.fieldCard}>
                <div className={s.fl}>Gross Pay ({period})</div>
                <div className={s.numInput}>
                  <span>£</span>
                  <input type="number" value={grossPay || ''} onChange={e => setGrossPay(Math.max(0, +e.target.value))} />
                </div>
              </div>
              <div className={s.fieldCard}>
                <div className={s.fl}>Income Tax Paid</div>
                <div className={s.numInput}>
                  <span>£</span>
                  <input type="number" value={incomeTaxPaid || ''} onChange={e => setIncomeTaxPaid(Math.max(0, +e.target.value))} />
                </div>
              </div>
              <div className={s.fieldCard}>
                <div className={s.fl}>National Insurance Paid</div>
                <div className={s.numInput}>
                  <span>£</span>
                  <input type="number" value={niPaid || ''} onChange={e => setNiPaid(Math.max(0, +e.target.value))} />
                </div>
              </div>
              <div className={s.fieldCard}>
                <div className={s.fl}>Tax Code</div>
                <div className={s.numInput}>
                  <input type="text" value={taxCodeInput} onChange={e => setTaxCodeInput(e.target.value.toUpperCase())} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* "Advanced options" Accordion (Progressive Disclosure) */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
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
                  <div className={s.fl}>Pension Contribution %</div>
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
                <div className={s.fieldCard}>
                  <div className={s.fl}>National Insurance Code</div>
                  <select className={s.select} value={niCategory} onChange={e => setNiCategory(e.target.value as any)}>
                    <option value="A">Category A (Standard)</option>
                    <option value="B">Category B (Married)</option>
                    <option value="C">Category C (Pensioner)</option>
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
      </div>

      {/* ── RIGHT: Results (Unified Hierarchy UX) ── */}
      <div className={s.resultsCard}>
        {activeTab === 'decoder' ? (
          <>
            {/* 1. Hero Number */}
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '6px' }}>
                Tax-Free Allowance
              </div>
              <div style={{ fontSize: '56px', fontWeight: 800, color: '#4f46e5', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {gbp(Math.max(0, decoded.allowance))}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: refundColors[decoded.refundLikelihood], marginTop: '8px' }}>
                Refund Risk: {decoded.refundLikelihood.toUpperCase()}
              </div>
            </div>

            {/* 2. 2-3 Line Summary */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
              Your tax code <strong>{taxCodeInput}</strong> represents <strong>{decoded.description}</strong>. {decoded.plainEnglish}
            </div>

            {/* 3. Collapsible "Full breakdown" */}
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
                  padding: '14px 16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#334155'
                }}
              >
                <span>Full breakdown</span>
                <ChevronDown size={16} style={{ color: '#64748b', transform: showBreakdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showBreakdown && (
                <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {decoded.issues.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Audit Observations</div>
                      {decoded.issues.map((iss, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '10px', fontSize: '12.5px', color: '#c2410c' }}>
                          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{iss}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', fontSize: '12.5px', color: '#047857' }}>
                      <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>This is a standard allowance code. No potential audit discrepancies or negative tax traps detected.</span>
                    </div>
                  )}

                  <div className={s.infoCard} style={{ background: '#f8fafc', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Monthly Tax-Free Baseline</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{gbp(Math.max(0, decoded.allowance) / 12)}</div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 1. Hero Number */}
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '6px' }}>
                Payroll Variance
              </div>
              <div style={{ fontSize: '56px', fontWeight: 800, color: Math.abs(audit.taxVariance) < 5 ? '#10b981' : '#f97316', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {audit.taxVariance > 0 ? `+${gbp(audit.taxVariance)}` : gbp(audit.taxVariance)}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginTop: '8px' }}>
                {audit.errors.length > 0 ? '⚠ DISCREPANCIES DETECTED' : '✓ ALIGNED WITH EXPECTED'}
              </div>
            </div>

            {/* 2. 2-3 Line Summary */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
              {audit.errors.length > 0 ? (
                <span>We detected a cumulative variance of <strong>{gbp(Math.abs(audit.taxVariance))}</strong> in your payslip tax deductions. Check the details below to verify if HMRC owes you a refund.</span>
              ) : (
                <span>All deductions on your payslip match progressive HMRC rates perfectly. Your tax code and payroll calculations align with standard thresholds.</span>
              )}
            </div>

            {/* 3. Collapsible "Full breakdown" */}
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
                  padding: '14px 16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#334155'
                }}
              >
                <span>Full breakdown</span>
                <ChevronDown size={16} style={{ color: '#64748b', transform: showBreakdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showBreakdown && (
                <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className={s.ledgerCard}>
                    <table className={s.ledgerTable}>
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Paid</th>
                          <th>Expected</th>
                          <th>Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Income Tax</td>
                          <td>{gbp(audit.annualTaxPaid)}</td>
                          <td>{gbp(audit.expected.incomeTax)}</td>
                          <td style={{ color: Math.abs(audit.taxVariance) < 5 ? 'inherit' : '#ef4444', fontWeight: 700 }}>
                            {audit.taxVariance > 0 ? '+' : ''}{gbp(audit.taxVariance)}
                          </td>
                        </tr>
                        <tr>
                          <td>National Insurance</td>
                          <td>{gbp(audit.annualNiPaid)}</td>
                          <td>{gbp(audit.expected.ni)}</td>
                          <td style={{ color: Math.abs(audit.niVariance) < 5 ? 'inherit' : '#ef4444', fontWeight: 700 }}>
                            {audit.niVariance > 0 ? '+' : ''}{gbp(audit.niVariance)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {audit.errors.map((err, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '10px', fontSize: '12.5px', color: '#be123c' }}>
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>{err.field}:</strong> {err.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
