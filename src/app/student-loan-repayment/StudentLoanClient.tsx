'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, GraduationCap, TrendingUp, Wallet, Info } from 'lucide-react';
import { calculateStudentLoan, PLANS, type Plan } from '../../lib/student-loan/calc';
import { gbp, pct } from '../../lib/taxEngine';
import u from '../../components/calc-shell/calcui.module.css';

// ── Lifetime balance chart (kept; restyled container) ──
interface ProjRow { year: number; salary: number; repayment: number; interest: number; closingBalance: number }
function LifetimeChart({ projection, writeOffYears }: { projection: ProjRow[]; writeOffYears: number }) {
  if (!projection || !projection.length) return null;
  const W = 440, H = 170, PAD = { t: 12, r: 16, b: 32, l: 48 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const maxBal = Math.max(...projection.map((r) => r.closingBalance), projection[0]?.closingBalance ?? 0) || 1;
  const maxYr = Math.max(...projection.map((r) => r.year), 1);
  const writeOffX = PAD.l + (Math.min(writeOffYears, maxYr) / maxYr) * cW;
  const balanceLine = projection.map((r) => `${PAD.l + (r.year / maxYr) * cW},${PAD.t + cH - (r.closingBalance / maxBal) * cH}`).join(' ');
  let cum = 0;
  const repaidLine = projection.map((r) => { cum += r.repayment; return `${PAD.l + (r.year / maxYr) * cW},${PAD.t + cH - (cum / maxBal) * cH}`; }).join(' ');
  const fmt = (n: number) => n >= 1000 ? `£${Math.round(n / 1000)}k` : `£${Math.round(n)}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x={writeOffX} y={PAD.t} width={W - PAD.r - writeOffX} height={cH} fill="rgba(190,18,60,0.06)" />
      <line x1={writeOffX} y1={PAD.t} x2={writeOffX} y2={PAD.t + cH} stroke="#be123c" strokeWidth={1} strokeDasharray="4,3" />
      <text x={writeOffX + 3} y={PAD.t + 10} fontSize={9} fill="#be123c">Write-off yr {writeOffYears}</text>
      {[0.25, 0.5, 0.75, 1].map((f) => {
        const y = PAD.t + cH * (1 - f);
        return (<g key={f}><line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="rgba(15,23,42,0.07)" strokeWidth={0.5} /><text x={PAD.l - 4} y={y + 3.5} textAnchor="end" fontSize={8} fill="#94a3b8">{fmt(maxBal * f)}</text></g>);
      })}
      {repaidLine && <polyline points={repaidLine} fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4,2" />}
      <polyline points={balanceLine} fill="none" stroke="#be123c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {[5, 10, 15, 20, 25, 30, 35, 40].filter((yr) => yr <= maxYr).map((yr) => (
        <text key={yr} x={PAD.l + (yr / maxYr) * cW} y={H - 4} textAnchor="middle" fontSize={8} fill="#94a3b8">Yr {yr}</text>
      ))}
      <line x1={PAD.l} y1={H - 10} x2={PAD.l + 18} y2={H - 10} stroke="#be123c" strokeWidth={2} /><text x={PAD.l + 22} y={H - 7} fontSize={8} fill="#64748b">Balance</text>
      <line x1={PAD.l + 78} y1={H - 10} x2={PAD.l + 96} y2={H - 10} stroke="#10b981" strokeWidth={1.5} strokeDasharray="4,2" /><text x={PAD.l + 100} y={H - 7} fontSize={8} fill="#64748b">Repaid</text>
    </svg>
  );
}

export default function StudentLoanClient() {
  const [salary, setSalary] = useState(50000);
  const [plan, setPlan] = useState<Plan>('plan2');
  const [balance, setBalance] = useState(40000);
  const [salaryGrowth, setSalaryGrowth] = useState(2.5);
  const [interestRateOverride, setInterestRateOverride] = useState('');
  const [postgradLoan, setPostgradLoan] = useState(false);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const cfg = PLANS[plan];

  const calc = useMemo(() => {
    const customInterest = interestRateOverride !== '' ? parseFloat(interestRateOverride) / 100 : undefined;
    const main = calculateStudentLoan({ plan, salary, balance, interestRate: customInterest, salaryGrowthPct: salaryGrowth });
    const postgrad = postgradLoan ? calculateStudentLoan({ plan: 'postgrad', salary, balance: 10000, salaryGrowthPct: salaryGrowth }) : null;
    return { main, postgrad, totalMonthly: main.monthly + (postgrad?.monthly ?? 0), totalAnnual: main.annual + (postgrad?.annual ?? 0) };
  }, [plan, salary, balance, interestRateOverride, salaryGrowth, postgradLoan]);

  const PRESETS = [25000, 35000, 50000, 75000, 100000, 150000];
  const nowY = new Date().getFullYear();
  const clearYear = calc.main.yearsToClear ? nowY + calc.main.yearsToClear : null;
  const writeOffYear = calc.main.writtenOffAtYear ? nowY + calc.main.writtenOffAtYear : null;
  const writtenOff = !!calc.main.writtenOffAtYear;

  return (
    <div className={u.grid}>
      {/* LEFT */}
      <div className={u.panel}>
        <div className={u.panelHead}><Wallet size={13} /> Your details</div>

        <div className={u.primary}>
          <label className={u.primaryLabel}>Gross annual salary</label>
          <div className={u.amountRow}>
            <span className={u.cur}>£</span>
            <input className={u.amountInput} type="number" value={salary || ''} onChange={(e) => setSalary(Math.max(0, +e.target.value))} />
            <span className={u.amountSuffix}>/ year</span>
          </div>
          <input className={u.slider} type="range" min={10000} max={250000} step={1000} value={salary} onChange={(e) => setSalary(+e.target.value)} />
          <div className={u.scale}><span>£10k</span><span>£250k</span></div>
          <div className={u.presets}>{PRESETS.map((p) => <button key={p} type="button" className={salary === p ? u.presetActive : ''} onClick={() => setSalary(p)}>£{p / 1000}k</button>)}</div>
        </div>

        <div className={u.field} style={{ marginTop: 16 }}>
          <span className={u.fieldLabel}>Repayment plan</span>
          <select className={u.select} value={plan} onChange={(e) => setPlan(e.target.value as Plan)}>
            {(Object.keys(PLANS) as Plan[]).filter((p) => p !== 'postgrad').map((p) => <option key={p} value={p}>{PLANS[p].label}</option>)}
          </select>
          <div style={{ marginTop: 8, background: 'var(--uk-soft)', border: '1px solid rgba(15,23,42,0.06)', borderRadius: 10, padding: '9px 12px', fontSize: 12, color: 'var(--uk-text-soft)', lineHeight: 1.5 }}>
            Repay <strong>{pct(cfg.rate)}</strong> of income above <strong>{gbp(cfg.threshold)}</strong> · written off after <strong>{cfg.writeOffYears} years</strong>
          </div>
        </div>

        <div className={u.groups} style={{ marginTop: 16 }}>
          <Group icon={<TrendingUp size={16} />} title="Balance & projection" hint="Balance, growth, interest" open={open.proj} onToggle={() => toggle('proj')}>
            <div className={u.fieldRow}>
              <div className={u.field}>
                <span className={u.fieldLabel}>Outstanding balance</span>
                <div className={u.inputWrap}><span>£</span><input type="number" value={balance || ''} onChange={(e) => setBalance(Math.max(0, +e.target.value))} /></div>
              </div>
              <div className={u.field}>
                <span className={u.fieldLabel}>Salary growth</span>
                <div className={u.inputWrap}><input type="number" step={0.1} value={salaryGrowth} onChange={(e) => setSalaryGrowth(Math.max(0, +e.target.value))} /><span>%</span></div>
              </div>
              <div className={`${u.field} ${u.fieldFull}`}>
                <span className={u.fieldLabel}>Interest rate override (default {pct(cfg.defaultInterest)})</span>
                <div className={u.inputWrap}><input type="number" placeholder="Use default" value={interestRateOverride} onChange={(e) => setInterestRateOverride(e.target.value)} /><span>%</span></div>
              </div>
            </div>
          </Group>
          <Group icon={<GraduationCap size={16} />} title="Postgraduate loan" hint="Adds the extra 6%" open={open.pg} onToggle={() => toggle('pg')}>
            <label className={u.check}><input type="checkbox" checked={postgradLoan} onChange={(e) => setPostgradLoan(e.target.checked)} />I also have a Postgraduate loan</label>
          </Group>
        </div>
      </div>

      {/* RIGHT */}
      <div className={u.results}>
        <div className={u.resultHero}>
          <div className={u.heroLabel}>Monthly repayment</div>
          <div className={u.heroFigure}>{gbp(calc.totalMonthly)}</div>
          <div className={u.heroSub}><strong>{gbp(calc.totalAnnual)}</strong> a year · {pct(cfg.rate)} of pay over {gbp(cfg.threshold)}</div>
        </div>

        <div className={u.kpis}>
          <div className={u.kpi}>
            <div className={u.kpiLabel}>{writtenOff ? 'Written off in' : 'Cleared in'}</div>
            <div className={u.kpiVal}>{writtenOff ? `${cfg.writeOffYears} yrs` : `${calc.main.yearsToClear} yrs`}<span style={{ fontSize: 12, color: 'var(--uk-muted)', fontWeight: 600 }}> · {writtenOff ? writeOffYear : clearYear}</span></div>
          </div>
          <div className={u.kpi}>
            <div className={u.kpiLabel}>Total you&apos;ll repay</div>
            <div className={u.kpiVal}>{gbp(calc.main.totalRepaid)}</div>
          </div>
        </div>

        <div style={{ padding: '16px 26px 0' }}>
          <div className={u.chartTitle ?? ''} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--uk-ink)', marginBottom: 10 }}>Lifetime balance projection</div>
          <LifetimeChart projection={calc.main.projection} writeOffYears={cfg.writeOffYears} />
        </div>

        <div className={u.callout} style={writtenOff ? undefined : { background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
          <Info size={16} style={writtenOff ? undefined : { color: '#059669' }} />
          {writtenOff ? (
            <span>Your loan is on track to be <strong>written off</strong> before you clear it, so voluntary overpayments would just be money you never had to pay. Don&apos;t overpay.</span>
          ) : (
            <span>You&apos;re projected to clear the balance before the write-off date, so overpayments cut the <strong>{pct(cfg.defaultInterest)}</strong> interest still compounding — they can genuinely save you money here.</span>
          )}
        </div>

        <div className={u.tableWrap}>
          <div className={u.tableHead}><span className={u.tableTitle}>Year by year</span></div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            <table className={u.ledger}>
              <thead><tr><th>Year</th><th>Salary</th><th>Repaid</th><th>Interest</th><th>Balance</th></tr></thead>
              <tbody>
                {calc.main.projection.map((r) => (
                  <tr key={r.year}>
                    <td>Yr {r.year}</td>
                    <td>{gbp(r.salary)}</td>
                    <td style={{ color: '#047857' }}>−{gbp(r.repayment)}</td>
                    <td className={u.ledgerNeg}>+{gbp(r.interest)}</td>
                    <td style={{ fontWeight: 700 }}>{gbp(r.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group({ icon, title, hint, open, onToggle, children }: {
  icon: React.ReactNode; title: string; hint: string; open?: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className={`${u.group} ${open ? u.groupOpen : ''}`}>
      <button type="button" className={u.groupBtn} onClick={onToggle} aria-expanded={!!open}>
        <span className={u.groupIcon}>{icon}</span>
        <span><span className={u.groupTitle} style={{ display: 'block' }}>{title}</span><span className={u.groupHint}>{hint}</span></span>
        <ChevronDown size={18} className={`${u.groupChev} ${open ? u.groupChevOpen : ''}`} />
      </button>
      {open && <div className={u.groupBody}>{children}</div>}
    </div>
  );
}
