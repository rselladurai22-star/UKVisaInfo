'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Receipt, PiggyBank, GraduationCap, MapPin, Users, Wallet, CalendarClock } from 'lucide-react';
import { calcTax, gbp, pct } from '../../lib/taxEngine';
import u from '../../components/calc-shell/calcui.module.css';

export default function SelfEmployedClient() {
  const [turnover, setTurnover] = useState(50000);
  const [expenses, setExpenses] = useState(0);
  const [pensionContrib, setPensionContrib] = useState(0);
  const [priorYearBill, setPriorYearBill] = useState(0);
  const [scotland, setScotland] = useState(false);
  const [studentLoan, setStudentLoan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [postgradLoan, setPostgradLoan] = useState(false);
  const [children, setChildren] = useState(0);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const netProfit = Math.max(0, turnover - expenses - pensionContrib);

  const calc = useMemo(() => {
    const t = calcTax({ salary: netProfit, scotland, pensionPct: 0, studentLoan, postgradLoan, children });
    let class4 = 0;
    if (netProfit > 12570) {
      class4 += Math.min(netProfit - 12570, 50270 - 12570) * 0.06;
      if (netProfit > 50270) class4 += (netProfit - 50270) * 0.02;
    }
    const totalSA = t.incomeTax + class4;
    const monthlyReserve = (totalSA + (totalSA >= 1000 ? totalSA * 0.5 : 0)) / 12;
    return { tax: t.incomeTax, class4, totalSA, monthlyReserve, studentLoan: t.studentLoan, hicbc: t.hicbc, netTakeHome: netProfit - totalSA - t.studentLoan - t.hicbc };
  }, [netProfit, scotland, studentLoan, postgradLoan, children]);

  const poa = useMemo(() => {
    const balancingJan = calc.totalSA - priorYearBill * 0.5;
    return { balancingJan: Math.max(0, balancingJan), nextJan: calc.totalSA * 0.5, nextJul: calc.totalSA * 0.5 };
  }, [calc.totalSA, priorYearBill]);

  const effRate = netProfit > 0 ? (calc.totalSA + calc.studentLoan + calc.hicbc) / netProfit : 0;
  const PRESETS = [25000, 50000, 75000, 100000, 150000];

  return (
    <div className={u.grid}>
      {/* LEFT */}
      <div className={u.panel}>
        <div className={u.panelHead}><Wallet size={13} /> Your business</div>

        <div className={u.primary}>
          <label className={u.primaryLabel}>Annual turnover</label>
          <div className={u.amountRow}>
            <span className={u.cur}>£</span>
            <input className={u.amountInput} type="number" value={turnover || ''} onChange={(e) => setTurnover(Math.max(0, +e.target.value))} />
            <span className={u.amountSuffix}>/ year</span>
          </div>
          <input className={u.slider} type="range" min={10000} max={250000} step={1000} value={turnover} onChange={(e) => setTurnover(+e.target.value)} />
          <div className={u.scale}><span>£10k</span><span>£250k</span></div>
          <div className={u.presets}>{PRESETS.map((p) => <button key={p} type="button" className={turnover === p ? u.presetActive : ''} onClick={() => setTurnover(p)}>£{p / 1000}k</button>)}</div>
        </div>

        <div className={u.groups} style={{ marginTop: 16 }}>
          <Group icon={<Receipt size={16} />} title="Expenses & pension" hint="Reduce your taxable profit" open={open.exp} onToggle={() => toggle('exp')}>
            <div className={u.fieldRow}>
              <div className={u.field}><span className={u.fieldLabel}>Allowable expenses</span><div className={u.inputWrap}><span>£</span><input type="number" value={expenses || ''} placeholder="0" onChange={(e) => setExpenses(Math.max(0, +e.target.value))} /></div></div>
              <div className={u.field}><span className={u.fieldLabel}>Pension payments</span><div className={u.inputWrap}><span>£</span><input type="number" value={pensionContrib || ''} placeholder="0" onChange={(e) => setPensionContrib(Math.max(0, +e.target.value))} /></div></div>
            </div>
          </Group>
          <Group icon={<CalendarClock size={16} />} title="Payments on Account" hint="Last year's tax bill" open={open.poa} onToggle={() => toggle('poa')}>
            <div className={u.field}>
              <span className={u.fieldLabel}>Prior year SA tax bill</span>
              <div className={u.inputWrap}><span>£</span><input type="number" value={priorYearBill || ''} placeholder="0" onChange={(e) => setPriorYearBill(Math.max(0, +e.target.value))} /></div>
            </div>
          </Group>
          <Group icon={<GraduationCap size={16} />} title="Student loans" hint="Repayment plan" open={open.loans} onToggle={() => toggle('loans')}>
            <div className={u.field}><span className={u.fieldLabel}>Plan</span><select className={u.select} value={studentLoan} onChange={(e) => setStudentLoan(e.target.value as typeof studentLoan)}><option value="none">No student loan</option><option value="plan1">Plan 1</option><option value="plan2">Plan 2</option><option value="plan4">Plan 4 (Scotland)</option><option value="plan5">Plan 5</option></select></div>
            <label className={u.check}><input type="checkbox" checked={postgradLoan} onChange={(e) => setPostgradLoan(e.target.checked)} />Postgraduate loan</label>
          </Group>
          <Group icon={<MapPin size={16} />} title="Region" hint="Scottish tax bands" open={open.region} onToggle={() => toggle('region')}>
            <label className={u.check}><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} />Scottish taxpayer</label>
          </Group>
          <Group icon={<Users size={16} />} title="Family" hint="Child Benefit charge" open={open.family} onToggle={() => toggle('family')}>
            <div className={u.field}><span className={u.fieldLabel}>Children receiving Child Benefit</span><div className={u.inputWrap}><input type="number" min={0} max={10} value={children} onChange={(e) => setChildren(Math.max(0, +e.target.value))} /><span>kids</span></div></div>
          </Group>
        </div>
      </div>

      {/* RIGHT */}
      <div className={u.results}>
        <div className={u.resultHero}>
          <div className={u.heroLabel}>Take-home profit</div>
          <div className={u.heroFigure}>{gbp(calc.netTakeHome)}</div>
          <div className={u.heroSub}>About <strong>{gbp(calc.netTakeHome / 12)}</strong> a month · taxable profit <strong>{gbp(netProfit)}</strong></div>
        </div>

        <div className={u.kpis}>
          <div className={u.kpi}><div className={u.kpiLabel}>Self-assessment bill</div><div className={u.kpiVal}>{gbp(calc.totalSA)}</div></div>
          <div className={u.kpi}><div className={u.kpiLabel}>Effective rate</div><div className={u.kpiVal}>{pct(effRate)}</div></div>
        </div>

        <div className={u.callout} style={{ background: 'rgba(79,70,229,0.05)', borderColor: 'rgba(79,70,229,0.18)', color: '#3730a3' }}>
          <PiggyBank size={16} style={{ color: '#4f46e5' }} />
          <span>Set aside about <strong>{gbp(calc.monthlyReserve)}</strong> a month in a separate account and the January bill — Payments on Account included — will never catch you out.</span>
        </div>

        <div className={u.tableWrap}>
          <div className={u.tableHead}><span className={u.tableTitle}>Profit to take-home</span></div>
          <table className={u.ledger}>
            <thead><tr><th>Item</th><th>Annual</th><th>Monthly</th></tr></thead>
            <tbody>
              <tr><td>Turnover</td><td>{gbp(turnover)}</td><td>{gbp(turnover / 12)}</td></tr>
              {expenses > 0 && <tr><td>Expenses</td><td className={u.ledgerNeg}>−{gbp(expenses)}</td><td className={u.ledgerNeg}>−{gbp(expenses / 12)}</td></tr>}
              {pensionContrib > 0 && <tr><td>Pension</td><td className={u.ledgerNeg}>−{gbp(pensionContrib)}</td><td className={u.ledgerNeg}>−{gbp(pensionContrib / 12)}</td></tr>}
              <tr style={{ background: 'var(--uk-soft)' }}><td style={{ fontWeight: 700 }}>Taxable profit</td><td>{gbp(netProfit)}</td><td>{gbp(netProfit / 12)}</td></tr>
              <tr><td>Income Tax</td><td className={u.ledgerNeg}>−{gbp(calc.tax)}</td><td className={u.ledgerNeg}>−{gbp(calc.tax / 12)}</td></tr>
              <tr><td>Class 4 NI</td><td className={u.ledgerNeg}>−{gbp(calc.class4)}</td><td className={u.ledgerNeg}>−{gbp(calc.class4 / 12)}</td></tr>
              {calc.studentLoan > 0 && <tr><td>Student loan</td><td className={u.ledgerNeg}>−{gbp(calc.studentLoan)}</td><td className={u.ledgerNeg}>−{gbp(calc.studentLoan / 12)}</td></tr>}
              {calc.hicbc > 0 && <tr><td>Child Benefit charge</td><td className={u.ledgerNeg}>−{gbp(calc.hicbc)}</td><td className={u.ledgerNeg}>−{gbp(calc.hicbc / 12)}</td></tr>}
              <tr className={u.ledgerTotal}><td>Take-home</td><td>{gbp(calc.netTakeHome)}</td><td>{gbp(calc.netTakeHome / 12)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className={u.tableWrap}>
          <div className={u.tableHead}><span className={u.tableTitle}>What HMRC wants, and when</span></div>
          <table className={u.ledger}>
            <thead><tr><th>Payment</th><th>Due</th><th>Amount</th></tr></thead>
            <tbody>
              <tr><td>Balancing payment</td><td>31 Jan</td><td>{gbp(poa.balancingJan)}</td></tr>
              <tr><td>1st payment on account</td><td>31 Jan</td><td>{gbp(poa.nextJan)}</td></tr>
              <tr><td>2nd payment on account</td><td>31 Jul</td><td>{gbp(poa.nextJul)}</td></tr>
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
