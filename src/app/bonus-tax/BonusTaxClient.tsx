'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, PiggyBank, GraduationCap, MapPin, Users, Wallet, AlertTriangle, Gift } from 'lucide-react';
import { calcTax, gbp, pct } from '../../lib/taxEngine';
import u from '../../components/calc-shell/calcui.module.css';

export default function BonusTaxClient() {
  const [salary, setSalary] = useState(50000);
  const [bonus, setBonus] = useState(10000);
  const [pensionRedirect, setPensionRedirect] = useState(5000);

  const [pensionPct, setPensionPct] = useState(5);
  const [pensionType, setPensionType] = useState<'salary_sacrifice' | 'net_pay' | 'relief_at_source'>('salary_sacrifice');
  const [studentLoan, setStudentLoan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [postgradLoan, setPostgradLoan] = useState(false);
  const [taxCode, setTaxCode] = useState('1257L');
  const [niCategory, setNiCategory] = useState<'A' | 'B' | 'C'>('A');
  const [scotland, setScotland] = useState(false);
  const [children, setChildren] = useState(0);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const c = useMemo(() => {
    const common = { pensionPct, pensionType, studentLoan, postgradLoan, taxCode, niCategory, scotland, children };
    const base = calcTax({ salary, ...common });
    const withBonus = calcTax({ salary: salary + bonus, ...common });
    const withSacrifice = calcTax({ salary: salary + Math.max(0, bonus - pensionRedirect), ...common });
    const cashKept = Math.max(0, withBonus.net - base.net);
    const taxLost = Math.max(0, bonus - cashKept);
    const effRate = bonus > 0 ? taxLost / bonus : 0;
    const netCashSacrificed = Math.max(0, withBonus.net - withSacrifice.net);
    const taxSavedOnRedirect = Math.max(0, pensionRedirect - netCashSacrificed);
    return { base, withBonus, withSacrifice, cashKept, taxLost, effRate, netCashSacrificed, taxSavedOnRedirect };
  }, [salary, bonus, pensionRedirect, pensionPct, pensionType, studentLoan, postgradLoan, taxCode, niCategory, scotland, children]);

  const keepPct = bonus > 0 ? c.cashKept / bonus : 0;
  const crossesTrap = c.withBonus.adjustedNetIncome > 100000 && c.base.adjustedNetIncome <= 100000;
  const SAL_PRE = [30000, 50000, 75000, 100000, 150000];
  const BON_PRE = [2500, 5000, 10000, 20000, 50000];

  return (
    <div className={u.grid}>
      {/* LEFT */}
      <div className={u.panel}>
        <div className={u.panelHead}><Wallet size={13} /> Your details</div>

        <div className={u.primary}>
          <label className={u.primaryLabel}>Annual base salary</label>
          <div className={u.amountRow}>
            <span className={u.cur}>£</span>
            <input className={u.amountInput} type="number" value={salary || ''} onChange={(e) => setSalary(Math.max(0, +e.target.value))} />
            <span className={u.amountSuffix}>/ year</span>
          </div>
          <input className={u.slider} type="range" min={10000} max={250000} step={1000} value={salary} onChange={(e) => setSalary(+e.target.value)} />
          <div className={u.scale}><span>£10k</span><span>£250k</span></div>
          <div className={u.presets}>{SAL_PRE.map((p) => <button key={p} type="button" className={salary === p ? u.presetActive : ''} onClick={() => setSalary(p)}>£{p / 1000}k</button>)}</div>
        </div>

        <div className={u.primary} style={{ marginTop: 14 }}>
          <label className={u.primaryLabel}>Gross bonus</label>
          <div className={u.amountRow}>
            <span className={u.cur}>£</span>
            <input className={u.amountInput} type="number" value={bonus || ''} onChange={(e) => { const b = Math.max(0, +e.target.value); setBonus(b); if (pensionRedirect > b) setPensionRedirect(b); }} />
            <span className={u.amountSuffix}>/ bonus</span>
          </div>
          <input className={u.slider} type="range" min={0} max={100000} step={500} value={bonus} onChange={(e) => { const b = +e.target.value; setBonus(b); if (pensionRedirect > b) setPensionRedirect(b); }} />
          <div className={u.scale}><span>£0</span><span>£100k</span></div>
          <div className={u.presets}>{BON_PRE.map((p) => <button key={p} type="button" className={bonus === p ? u.presetActive : ''} onClick={() => { setBonus(p); if (pensionRedirect > p) setPensionRedirect(p); }}>£{p >= 1000 ? `${p / 1000}k` : p}</button>)}</div>
        </div>

        {/* bonus sacrifice */}
        <div className={u.primary} style={{ marginTop: 14 }}>
          <label className={u.primaryLabel}>Redirect into pension</label>
          <div className={u.amountRow}>
            <span className={u.cur}>£</span>
            <input className={u.amountInput} type="number" value={pensionRedirect || ''} onChange={(e) => setPensionRedirect(Math.min(bonus, Math.max(0, +e.target.value)))} />
            <span className={u.amountSuffix}>of bonus</span>
          </div>
          <input className={u.slider} type="range" min={0} max={bonus || 1} step={500} value={pensionRedirect} onChange={(e) => setPensionRedirect(+e.target.value)} />
          <div className={u.scale}><span>£0</span><span>{gbp(bonus)}</span></div>
        </div>

        <div className={u.groups} style={{ marginTop: 16 }}>
          <Group icon={<PiggyBank size={16} />} title="Pension" hint="Base contribution & scheme" open={open.pension} onToggle={() => toggle('pension')}>
            <div className={u.fieldRow}>
              <div className={u.field}>
                <span className={u.fieldLabel}>Base contribution</span>
                <div className={u.inputWrap}><input type="number" min={0} max={100} value={pensionPct} onChange={(e) => setPensionPct(Math.max(0, Math.min(100, +e.target.value)))} /><span>%</span></div>
              </div>
              <div className={`${u.field} ${u.fieldFull}`}>
                <span className={u.fieldLabel}>Arrangement</span>
                <select className={u.select} value={pensionType} onChange={(e) => setPensionType(e.target.value as typeof pensionType)}>
                  <option value="salary_sacrifice">Salary sacrifice</option>
                  <option value="net_pay">Net pay</option>
                  <option value="relief_at_source">Relief at source</option>
                </select>
              </div>
            </div>
          </Group>
          <Group icon={<GraduationCap size={16} />} title="Student loans" hint="Repayment plan" open={open.loans} onToggle={() => toggle('loans')}>
            <div className={u.field}>
              <span className={u.fieldLabel}>Plan</span>
              <select className={u.select} value={studentLoan} onChange={(e) => setStudentLoan(e.target.value as typeof studentLoan)}>
                <option value="none">No student loan</option><option value="plan1">Plan 1</option><option value="plan2">Plan 2</option><option value="plan4">Plan 4 (Scotland)</option><option value="plan5">Plan 5</option>
              </select>
            </div>
            <label className={u.check}><input type="checkbox" checked={postgradLoan} onChange={(e) => setPostgradLoan(e.target.checked)} />Postgraduate loan</label>
          </Group>
          <Group icon={<MapPin size={16} />} title="Region & tax code" hint="Scotland, HMRC code, NI" open={open.region} onToggle={() => toggle('region')}>
            <div className={u.fieldRow}>
              <div className={u.field}>
                <span className={u.fieldLabel}>Tax code</span>
                <div className={u.inputWrap}><input type="text" value={taxCode} onChange={(e) => setTaxCode(e.target.value.toUpperCase())} /></div>
              </div>
              <div className={u.field}>
                <span className={u.fieldLabel}>NI category</span>
                <select className={u.select} value={niCategory} onChange={(e) => setNiCategory(e.target.value as typeof niCategory)}><option value="A">A — Standard</option><option value="B">B — Married women</option><option value="C">C — Over pension age</option></select>
              </div>
            </div>
            <label className={u.check}><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} />Scottish taxpayer</label>
          </Group>
          <Group icon={<Users size={16} />} title="Family" hint="Child Benefit charge" open={open.family} onToggle={() => toggle('family')}>
            <div className={u.field}>
              <span className={u.fieldLabel}>Children receiving Child Benefit</span>
              <div className={u.inputWrap}><input type="number" min={0} max={10} value={children} onChange={(e) => setChildren(Math.max(0, +e.target.value))} /><span>kids</span></div>
            </div>
          </Group>
        </div>
      </div>

      {/* RIGHT */}
      <div className={u.results}>
        <div className={u.resultHero}>
          <div className={u.heroLabel}>Cash you actually keep</div>
          <div className={u.heroFigure}>{gbp(c.cashKept)}</div>
          <div className={u.heroSub}>From a <strong>{gbp(bonus)}</strong> bonus · effective rate <strong>{pct(c.effRate)}</strong></div>
        </div>

        <div className={u.barWrap}>
          <div className={u.barLabelRow}><span>Keep vs lose</span><span>of {gbp(bonus)}</span></div>
          <div className={u.bar}>
            <div className={u.barSeg} style={{ width: `${keepPct * 100}%`, background: '#10b981' }} title={`Kept ${gbp(c.cashKept)}`} />
            <div className={u.barSeg} style={{ flex: 1, background: '#be123c' }} title={`Lost ${gbp(c.taxLost)}`} />
          </div>
        </div>
        <div className={u.legend}>
          <span className={u.legendItem}><span className={u.legendDot} style={{ background: '#10b981' }} />Kept <span className={u.legendVal}>{gbp(c.cashKept)}</span></span>
          <span className={u.legendItem}><span className={u.legendDot} style={{ background: '#be123c' }} />Tax &amp; NI <span className={u.legendVal}>{gbp(c.taxLost)}</span></span>
        </div>

        {pensionRedirect > 0 && (
          <div className={u.kpis}>
            <div className={u.kpi}><div className={u.kpiLabel}><Gift size={12} /> Net cash given up</div><div className={u.kpiVal}>{gbp(c.netCashSacrificed)}</div></div>
            <div className={u.kpi}><div className={u.kpiLabel}>Tax saved by redirecting</div><div className={u.kpiVal} style={{ color: '#047857' }}>{gbp(c.taxSavedOnRedirect)}</div></div>
          </div>
        )}

        {crossesTrap && (
          <div className={u.callout}>
            <AlertTriangle size={16} />
            <span>This bonus tips you past £100,000, so part of it is taxed at an effective <strong>60%</strong> as your Personal Allowance tapers away. Redirecting the bonus into your pension sidesteps it entirely.</span>
          </div>
        )}

        <div className={u.tableWrap}>
          <div className={u.tableHead}><span className={u.tableTitle}>Salary only vs with bonus</span></div>
          <table className={u.ledger}>
            <thead><tr><th>Item</th><th>Salary</th><th>+ Bonus</th><th>Cost</th></tr></thead>
            <tbody>
              <tr><td>Gross income</td><td>{gbp(salary)}</td><td>{gbp(salary + bonus)}</td><td style={{ color: '#047857', fontWeight: 600 }}>+{gbp(bonus)}</td></tr>
              <tr><td>Income Tax</td><td>−{gbp(c.base.incomeTax)}</td><td>−{gbp(c.withBonus.incomeTax)}</td><td className={u.ledgerNeg}>−{gbp(c.withBonus.incomeTax - c.base.incomeTax)}</td></tr>
              <tr><td>National Insurance</td><td>−{gbp(c.base.ni)}</td><td>−{gbp(c.withBonus.ni)}</td><td className={u.ledgerNeg}>−{gbp(c.withBonus.ni - c.base.ni)}</td></tr>
              {c.withBonus.studentLoan > c.base.studentLoan && (
                <tr><td>Student loan</td><td>−{gbp(c.base.studentLoan)}</td><td>−{gbp(c.withBonus.studentLoan)}</td><td className={u.ledgerNeg}>−{gbp(c.withBonus.studentLoan - c.base.studentLoan)}</td></tr>
              )}
              {c.withBonus.hicbc > c.base.hicbc && (
                <tr><td>Child Benefit charge</td><td>−{gbp(c.base.hicbc)}</td><td>−{gbp(c.withBonus.hicbc)}</td><td className={u.ledgerNeg}>−{gbp(c.withBonus.hicbc - c.base.hicbc)}</td></tr>
              )}
              <tr className={u.ledgerTotal}><td>Net take-home</td><td>{gbp(c.base.net)}</td><td>{gbp(c.withBonus.net)}</td><td style={{ color: '#047857', fontWeight: 800 }}>+{gbp(c.cashKept)}</td></tr>
            </tbody>
          </table>
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
