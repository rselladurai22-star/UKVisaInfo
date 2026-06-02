'use client';

import { useState, useMemo } from 'react';
import {
  ChevronDown, Coins, PiggyBank, GraduationCap, MapPin, Users, AlertTriangle, Wallet,
} from 'lucide-react';
import { calcTax, gbp, pct } from '../../lib/taxEngine';
import u from '../../components/calc-shell/calcui.module.css';

type Period = 'year' | 'month' | 'week';
const DIV: Record<Period, number> = { year: 1, month: 12, week: 52 };
const PERIOD_LABEL: Record<Period, string> = { year: 'a year', month: 'a month', week: 'a week' };

const SEG = {
  net:         { label: 'Take-home', color: '#4f46e5' },
  incomeTax:   { label: 'Income Tax', color: '#be123c' },
  ni:          { label: 'National Insurance', color: '#f59e0b' },
  pension:     { label: 'Pension', color: '#10b981' },
  studentLoan: { label: 'Student loan', color: '#0ea5e9' },
  hicbc:       { label: 'Child Benefit charge', color: '#db2777' },
};

export default function TakeHomeCalcClient() {
  const [salary, setSalary] = useState(50000);
  const [bonus, setBonus] = useState(0);
  const [commission, setCommission] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [pensionPct, setPensionPct] = useState(0);
  const [pensionType, setPensionType] = useState<'salary_sacrifice' | 'net_pay' | 'relief_at_source'>('salary_sacrifice');
  const [studentLoan, setStudentLoan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [postgradLoan, setPostgradLoan] = useState(false);
  const [taxCode, setTaxCode] = useState('1257L');
  const [niCategory, setNiCategory] = useState<'A' | 'B' | 'C'>('A');
  const [scotland, setScotland] = useState(false);
  const [children, setChildren] = useState(0);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [period, setPeriod] = useState<Period>('month');
  const [tableView, setTableView] = useState<'ledger' | 'bands'>('ledger');

  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const r = useMemo(() => calcTax({
    salary, bonus, commission, overtime, pensionPct, pensionType,
    studentLoan, postgradLoan, taxCode, niCategory, scotland, children,
  }), [salary, bonus, commission, overtime, pensionPct, pensionType, studentLoan, postgradLoan, taxCode, niCategory, scotland, children]);

  const d = DIV[period];
  const PRESETS = [25000, 35000, 50000, 75000, 100000, 150000];
  const retention = r.gross > 0 ? r.net / r.gross : 0;
  const tapered = r.personalAllowance < 12570 - 0.5;
  const marginalWarn = r.marginalRate >= 0.6;

  // Stacked-bar segments (only non-zero parts).
  const segParts = ([
    ['net', r.net], ['incomeTax', r.incomeTax], ['ni', r.ni],
    ['pension', r.pension], ['studentLoan', r.studentLoan], ['hicbc', r.hicbc],
  ] as [keyof typeof SEG, number][]).filter(([, v]) => v > 0);
  const segTotal = segParts.reduce((s, [, v]) => s + v, 0) || 1;

  const ledger = ([
    ['Gross income', r.gross, false],
    ['Income Tax', r.incomeTax, true],
    ['National Insurance', r.ni, true],
    ['Pension', r.pension, true],
    ['Student loan', r.studentLoan, true],
    ['Child Benefit charge', r.hicbc, true],
  ] as [string, number, boolean][]).filter(([, v], i) => i === 0 || v > 0);

  return (
    <div className={u.grid}>
      {/* ── LEFT: inputs ── */}
      <div className={u.panel}>
        <div className={u.panelHead}><Wallet size={13} /> Your details</div>

        {/* Primary input */}
        <div className={u.primary}>
          <label className={u.primaryLabel}>Gross annual salary</label>
          <div className={u.amountRow}>
            <span className={u.cur}>£</span>
            <input
              className={u.amountInput}
              type="number"
              value={salary || ''}
              onChange={(e) => setSalary(Math.max(0, +e.target.value))}
            />
            <span className={u.amountSuffix}>/ year</span>
          </div>
          <input
            className={u.slider}
            type="range" min={10000} max={250000} step={1000}
            value={salary} onChange={(e) => setSalary(+e.target.value)}
          />
          <div className={u.scale}><span>£10k</span><span>£250k</span></div>
          <div className={u.presets}>
            {PRESETS.map((p) => (
              <button key={p} type="button" className={salary === p ? u.presetActive : ''} onClick={() => setSalary(p)}>
                £{p / 1000}k
              </button>
            ))}
          </div>
        </div>

        {/* Categorized advanced groups */}
        <div className={u.groups}>
          <Group id="income" icon={<Coins size={16} />} title="Extra income" hint="Bonus, commission, overtime" open={open.income} onToggle={() => toggle('income')}>
            <div className={u.fieldRow}>
              <Money label="Annual bonus" value={bonus} onChange={setBonus} />
              <Money label="Commission" value={commission} onChange={setCommission} />
              <Money label="Overtime" value={overtime} onChange={setOvertime} />
            </div>
          </Group>

          <Group id="pension" icon={<PiggyBank size={16} />} title="Pension" hint="Contribution rate & scheme" open={open.pension} onToggle={() => toggle('pension')}>
            <div className={u.fieldRow}>
              <div className={u.field}>
                <span className={u.fieldLabel}>Contribution</span>
                <div className={u.inputWrap}>
                  <input type="number" min={0} max={100} value={pensionPct} onChange={(e) => setPensionPct(Math.max(0, Math.min(100, +e.target.value)))} />
                  <span>%</span>
                </div>
              </div>
              <div className={`${u.field} ${u.fieldFull}`}>
                <span className={u.fieldLabel}>Arrangement</span>
                <select className={u.select} value={pensionType} onChange={(e) => setPensionType(e.target.value as typeof pensionType)}>
                  <option value="salary_sacrifice">Salary sacrifice (Tax + NI relief)</option>
                  <option value="net_pay">Net pay (Income Tax relief)</option>
                  <option value="relief_at_source">Relief at source</option>
                </select>
              </div>
            </div>
          </Group>

          <Group id="loans" icon={<GraduationCap size={16} />} title="Student loans" hint="Repayment plan" open={open.loans} onToggle={() => toggle('loans')}>
            <div className={u.field}>
              <span className={u.fieldLabel}>Plan</span>
              <select className={u.select} value={studentLoan} onChange={(e) => setStudentLoan(e.target.value as typeof studentLoan)}>
                <option value="none">No student loan</option>
                <option value="plan1">Plan 1</option>
                <option value="plan2">Plan 2</option>
                <option value="plan4">Plan 4 (Scotland)</option>
                <option value="plan5">Plan 5</option>
              </select>
            </div>
            <label className={u.check}>
              <input type="checkbox" checked={postgradLoan} onChange={(e) => setPostgradLoan(e.target.checked)} />
              Postgraduate loan (extra 6%)
            </label>
          </Group>

          <Group id="region" icon={<MapPin size={16} />} title="Region & tax code" hint="Scotland, code, NI category" open={open.region} onToggle={() => toggle('region')}>
            <div className={u.fieldRow}>
              <div className={u.field}>
                <span className={u.fieldLabel}>HMRC tax code</span>
                <div className={u.inputWrap}>
                  <input type="text" value={taxCode} onChange={(e) => setTaxCode(e.target.value.toUpperCase())} />
                </div>
              </div>
              <div className={u.field}>
                <span className={u.fieldLabel}>NI category</span>
                <select className={u.select} value={niCategory} onChange={(e) => setNiCategory(e.target.value as typeof niCategory)}>
                  <option value="A">A — Standard</option>
                  <option value="B">B — Married women</option>
                  <option value="C">C — Over pension age</option>
                </select>
              </div>
            </div>
            <label className={u.check}>
              <input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} />
              Scottish taxpayer
            </label>
          </Group>

          <Group id="family" icon={<Users size={16} />} title="Family" hint="Child Benefit charge" open={open.family} onToggle={() => toggle('family')}>
            <div className={u.field}>
              <span className={u.fieldLabel}>Children receiving Child Benefit</span>
              <div className={u.inputWrap}>
                <input type="number" min={0} max={10} value={children} onChange={(e) => setChildren(Math.max(0, +e.target.value))} />
                <span>kids</span>
              </div>
            </div>
          </Group>
        </div>
      </div>

      {/* ── RIGHT: results ── */}
      <div className={u.results}>
        <div className={u.resultHero}>
          <div className={u.periodToggle}>
            {(['year', 'month', 'week'] as Period[]).map((p) => (
              <button key={p} type="button" className={`${u.periodBtn} ${period === p ? u.periodActive : ''}`} onClick={() => setPeriod(p)}>
                {p === 'year' ? 'Yearly' : p === 'month' ? 'Monthly' : 'Weekly'}
              </button>
            ))}
          </div>
          <div className={u.heroLabel}>Take-home pay</div>
          <div className={u.heroFigure}>{gbp(r.net / d)}</div>
          <div className={u.heroSub}>
            From <strong>{gbp(r.gross / d)}</strong> gross {PERIOD_LABEL[period]} · you keep <strong>{pct(retention)}</strong>
          </div>
        </div>

        {/* stacked bar */}
        <div className={u.barWrap}>
          <div className={u.barLabelRow}><span>Where your gross goes</span><span>{gbp(r.gross / d)} {period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/wk'}</span></div>
          <div className={u.bar}>
            {segParts.map(([k, v]) => (
              <div key={k} className={u.barSeg} style={{ width: `${(v / segTotal) * 100}%`, background: SEG[k].color }} title={`${SEG[k].label}: ${gbp(v)}`} />
            ))}
          </div>
        </div>
        <div className={u.legend}>
          {segParts.map(([k, v]) => (
            <span key={k} className={u.legendItem}>
              <span className={u.legendDot} style={{ background: SEG[k].color }} />
              {SEG[k].label} <span className={u.legendVal}>{gbp(v / d)}</span>
            </span>
          ))}
        </div>

        {/* KPIs */}
        <div className={u.kpis}>
          <div className={u.kpi}>
            <div className={u.kpiLabel}>Effective tax rate</div>
            <div className={u.kpiVal}>{pct(r.effectiveRate)}</div>
          </div>
          <div className={u.kpi}>
            <div className={u.kpiLabel}>Marginal rate</div>
            <div className={`${u.kpiVal} ${marginalWarn ? u.kpiValWarn : ''}`}>{pct(r.marginalRate)}</div>
          </div>
        </div>

        {(tapered || marginalWarn) && (
          <div className={u.callout}>
            <AlertTriangle size={16} />
            <span>
              You&apos;re in a high marginal-rate band. {tapered && 'Your Personal Allowance is being tapered above £100,000. '}
              Each extra £1 of salary is taxed at <strong>{pct(r.marginalRate)}</strong> — redirecting it into pension can claw it back.
            </span>
          </div>
        )}

        {/* breakdown tables */}
        <div className={u.tableWrap}>
          <div className={u.tableHead}>
            <span className={u.tableTitle}>Breakdown</span>
            <div className={u.tableTabs}>
              <button type="button" className={`${u.tableTab} ${tableView === 'ledger' ? u.tableTabActive : ''}`} onClick={() => setTableView('ledger')}>Deductions</button>
              <button type="button" className={`${u.tableTab} ${tableView === 'bands' ? u.tableTabActive : ''}`} onClick={() => setTableView('bands')}>Tax bands</button>
            </div>
          </div>

          {tableView === 'ledger' ? (
            <table className={u.ledger}>
              <thead><tr><th>Item</th><th>Annual</th><th>Monthly</th><th>%</th></tr></thead>
              <tbody>
                {ledger.map(([label, val, neg]) => {
                  const segColor = (SEG as Record<string, { color: string }>)[
                    label === 'Income Tax' ? 'incomeTax' : label === 'National Insurance' ? 'ni'
                    : label === 'Pension' ? 'pension' : label === 'Student loan' ? 'studentLoan'
                    : label === 'Child Benefit charge' ? 'hicbc' : ''
                  ]?.color;
                  return (
                    <tr key={label}>
                      <td>{segColor && <span className={u.swatch} style={{ background: segColor }} />}{label}</td>
                      <td className={neg ? u.ledgerNeg : ''}>{neg ? '−' : ''}{gbp(val)}</td>
                      <td className={neg ? u.ledgerNeg : ''}>{neg ? '−' : ''}{gbp(val / 12)}</td>
                      <td>{pct(val / (r.gross || 1))}</td>
                    </tr>
                  );
                })}
                <tr className={u.ledgerTotal}>
                  <td><span className={u.swatch} style={{ background: SEG.net.color }} />Take-home net</td>
                  <td>{gbp(r.net)}</td>
                  <td>{gbp(r.net / 12)}</td>
                  <td>{pct(retention)}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className={u.ledger}>
              <thead><tr><th>Band</th><th>Rate</th><th>Income taxed</th><th>Tax</th></tr></thead>
              <tbody>
                {r.bands.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--uk-muted)' }}>No income tax due on this salary.</td></tr>
                ) : r.bands.map((b, i) => (
                  <tr key={i}>
                    <td>{b.name}</td>
                    <td><span className={u.rateBadge}>{pct(b.rate, 0)}</span></td>
                    <td>{gbp(b.income)}</td>
                    <td className={u.ledgerNeg}>−{gbp(b.tax)}</td>
                  </tr>
                ))}
                <tr className={u.ledgerTotal}>
                  <td>Total Income Tax</td><td /><td>{gbp(r.taxableIncome)}</td><td>−{gbp(r.incomeTax)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── small field helpers ── */
function Group({ icon, title, hint, open, onToggle, children }: {
  id: string; icon: React.ReactNode; title: string; hint: string;
  open?: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className={`${u.group} ${open ? u.groupOpen : ''}`}>
      <button type="button" className={u.groupBtn} onClick={onToggle} aria-expanded={!!open}>
        <span className={u.groupIcon}>{icon}</span>
        <span>
          <span className={u.groupTitle} style={{ display: 'block' }}>{title}</span>
          <span className={u.groupHint}>{hint}</span>
        </span>
        <ChevronDown size={18} className={`${u.groupChev} ${open ? u.groupChevOpen : ''}`} />
      </button>
      {open && <div className={u.groupBody}>{children}</div>}
    </div>
  );
}

function Money({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className={u.field}>
      <span className={u.fieldLabel}>{label}</span>
      <div className={u.inputWrap}>
        <span>£</span>
        <input type="number" value={value || ''} placeholder="0" onChange={(e) => onChange(Math.max(0, +e.target.value))} />
      </div>
    </div>
  );
}
