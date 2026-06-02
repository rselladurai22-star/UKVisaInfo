'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, PiggyBank, Zap, Bike, GraduationCap, MapPin, Wallet, AlertTriangle } from 'lucide-react';
import { calcTax, gbp } from '../../lib/taxEngine';
import u from '../../components/calc-shell/calcui.module.css';

type Scheme = 'pension' | 'ev' | 'cycle';

export default function SalarySacrificeClient() {
  const [salary, setSalary] = useState(50000);
  const [monthlySacrifice, setMonthlySacrifice] = useState(500);
  const [activeScheme, setActiveScheme] = useState<Scheme>('pension');

  const [evP11d, setEvP11d] = useState(45000);
  const [evBikRate, setEvBikRate] = useState(2);
  const [pensionMatchingPct, setPensionMatchingPct] = useState(100);
  const [studentLoan, setStudentLoan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [scotland, setScotland] = useState(false);
  const [postgradLoan, setPostgradLoan] = useState(false);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const annualSacrifice = monthlySacrifice * 12;

  const c = useMemo(() => {
    const base = calcTax({ salary, studentLoan, postgradLoan, scotland });
    const pensionRes = calcTax({ salary: Math.max(0, salary - annualSacrifice), studentLoan, postgradLoan, scotland });
    const pensionCashLoss = Math.max(0, base.net - pensionRes.net);
    const pensionAnnualSaving = Math.max(0, annualSacrifice - pensionCashLoss);
    const pensionEmployerNiSaving = annualSacrifice * 0.138;
    const matchingAmount = pensionEmployerNiSaving * (pensionMatchingPct / 100);
    const totalPotAdded = annualSacrifice + matchingAmount;

    const bikValue = evP11d * (evBikRate / 100);
    const evWithBik = calcTax({ salary: Math.max(0, salary - annualSacrifice + bikValue), studentLoan, postgradLoan, scotland });
    const evNoBik = calcTax({ salary: Math.max(0, salary - annualSacrifice), studentLoan, postgradLoan, scotland });
    const evNet = Math.max(0, (salary - annualSacrifice) - evWithBik.incomeTax - evNoBik.ni - evNoBik.studentLoan);
    const evCashLoss = Math.max(0, base.net - evNet);
    const evAnnualSaving = Math.max(0, annualSacrifice - evCashLoss);

    const cycleRes = calcTax({ salary: Math.max(0, salary - annualSacrifice), studentLoan, postgradLoan, scotland });
    const cycleCashLoss = Math.max(0, base.net - cycleRes.net);
    const cycleTransferFee = annualSacrifice * 0.05;
    const cycleRealSaving = Math.max(0, Math.max(0, annualSacrifice - cycleCashLoss) - cycleTransferFee);

    return {
      base,
      pension: { res: pensionRes, cashLoss: pensionCashLoss, annualSaving: pensionAnnualSaving, matchingAmount, totalPotAdded },
      ev: { res: evWithBik, cashLoss: evCashLoss, annualSaving: evAnnualSaving },
      cycle: { res: cycleRes, cashLoss: cycleCashLoss, transferFee: cycleTransferFee, realSaving: cycleRealSaving },
    };
  }, [salary, annualSacrifice, evP11d, evBikRate, pensionMatchingPct, studentLoan, postgradLoan, scotland]);

  const saving = activeScheme === 'ev' ? c.ev.annualSaving : activeScheme === 'cycle' ? c.cycle.realSaving : c.pension.annualSaving;
  const cost = activeScheme === 'ev' ? c.ev.cashLoss : activeScheme === 'cycle' ? c.cycle.cashLoss + c.cycle.transferFee : c.pension.cashLoss;

  const SAL_PRE = [30000, 50000, 75000, 100000, 150000];
  const SAC_PRE = [250, 500, 750, 1000, 1500];
  const SCHEMES: { id: Scheme; label: string; icon: typeof PiggyBank }[] = [
    { id: 'pension', label: 'Pension', icon: PiggyBank },
    { id: 'ev', label: 'EV lease', icon: Zap },
    { id: 'cycle', label: 'Cycle', icon: Bike },
  ];

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
          <div className={u.presets}>
            {SAL_PRE.map((p) => <button key={p} type="button" className={salary === p ? u.presetActive : ''} onClick={() => setSalary(p)}>£{p / 1000}k</button>)}
          </div>
        </div>

        <div className={u.primary} style={{ marginTop: 14 }}>
          <label className={u.primaryLabel}>Monthly sacrifice</label>
          <div className={u.amountRow}>
            <span className={u.cur}>£</span>
            <input className={u.amountInput} type="number" value={monthlySacrifice || ''} onChange={(e) => setMonthlySacrifice(Math.max(0, +e.target.value))} />
            <span className={u.amountSuffix}>/ month</span>
          </div>
          <input className={u.slider} type="range" min={50} max={3000} step={50} value={monthlySacrifice} onChange={(e) => setMonthlySacrifice(+e.target.value)} />
          <div className={u.scale}><span>£50</span><span>£3,000</span></div>
          <div className={u.presets}>
            {SAC_PRE.map((p) => <button key={p} type="button" className={monthlySacrifice === p ? u.presetActive : ''} onClick={() => setMonthlySacrifice(p)}>£{p}</button>)}
          </div>
        </div>

        {/* scheme selector */}
        <div className={u.tableTabs} style={{ display: 'flex', width: '100%', margin: '16px 0' }}>
          {SCHEMES.map((sc) => {
            const Icon = sc.icon;
            return (
              <button key={sc.id} type="button" className={`${u.tableTab} ${activeScheme === sc.id ? u.tableTabActive : ''}`} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => setActiveScheme(sc.id)}>
                <Icon size={14} />{sc.label}
              </button>
            );
          })}
        </div>

        <div className={u.groups}>
          {activeScheme === 'pension' && (
            <Group icon={<PiggyBank size={16} />} title="Employer matching" hint="Share of the 13.8% NI saving" open={open.match} onToggle={() => toggle('match')}>
              <div className={u.field}>
                <span className={u.fieldLabel}>Employer NI saving passed to your pot</span>
                <div className={u.inputWrap}>
                  <input type="number" min={0} max={100} value={pensionMatchingPct} onChange={(e) => setPensionMatchingPct(Math.max(0, Math.min(100, +e.target.value)))} />
                  <span>%</span>
                </div>
              </div>
            </Group>
          )}
          {activeScheme === 'ev' && (
            <Group icon={<Zap size={16} />} title="Electric car" hint="List price & benefit-in-kind" open={open.ev} onToggle={() => toggle('ev')}>
              <div className={u.fieldRow}>
                <div className={u.field}>
                  <span className={u.fieldLabel}>List price (P11D)</span>
                  <div className={u.inputWrap}><span>£</span><input type="number" value={evP11d || ''} onChange={(e) => setEvP11d(Math.max(0, +e.target.value))} /></div>
                </div>
                <div className={u.field}>
                  <span className={u.fieldLabel}>BIK rate</span>
                  <div className={u.inputWrap}><input type="number" step={0.5} value={evBikRate} onChange={(e) => setEvBikRate(Math.max(0, +e.target.value))} /><span>%</span></div>
                </div>
              </div>
            </Group>
          )}
          <Group icon={<GraduationCap size={16} />} title="Student loans" hint="Repayment plan" open={open.loans} onToggle={() => toggle('loans')}>
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
            <label className={u.check}><input type="checkbox" checked={postgradLoan} onChange={(e) => setPostgradLoan(e.target.checked)} />Postgraduate loan</label>
          </Group>
          <Group icon={<MapPin size={16} />} title="Region" hint="Scottish tax bands" open={open.region} onToggle={() => toggle('region')}>
            <label className={u.check}><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} />Scottish taxpayer</label>
          </Group>
        </div>
      </div>

      {/* RIGHT */}
      <div className={u.results}>
        <div className={u.resultHero}>
          <div className={u.heroLabel}>What you save a year</div>
          <div className={u.heroFigure}>{gbp(saving)}</div>
          <div className={u.heroSub}>About <strong>{gbp(saving * 5)}</strong> over a 5-year arrangement · {gbp(monthlySacrifice)}/mo sacrificed</div>
        </div>

        <div className={u.kpis}>
          <div className={u.kpi}>
            <div className={u.kpiLabel}>Real cost to your take-home</div>
            <div className={u.kpiVal}>{gbp(cost)}<span style={{ fontSize: 13, color: 'var(--uk-muted)', fontWeight: 600 }}>/yr</span></div>
          </div>
          <div className={u.kpi}>
            <div className={u.kpiLabel}>{activeScheme === 'pension' ? 'Added to your pension' : 'You keep'}</div>
            <div className={u.kpiVal} style={{ color: '#047857' }}>
              {activeScheme === 'pension' ? gbp(c.pension.totalPotAdded) : gbp(saving)}<span style={{ fontSize: 13, color: 'var(--uk-muted)', fontWeight: 600 }}>/yr</span>
            </div>
          </div>
        </div>

        {activeScheme === 'ev' && (
          <div className={u.callout}>
            <AlertTriangle size={16} />
            <span>Electric-car benefit-in-kind rises ~1 point a year (2% now, 3% next year, and so on). Over a full lease the tax creeps up, so treat the headline saving as a starting figure.</span>
          </div>
        )}

        <div className={u.tableWrap}>
          <div className={u.tableHead}><span className={u.tableTitle}>Base salary vs under sacrifice</span></div>
          <table className={u.ledger}>
            <thead><tr><th>Item</th><th>Now</th><th>Sacrifice</th><th>Saved</th></tr></thead>
            <tbody>
              <Row label="Gross income" now={gbp(salary)} sac={gbp(salary - annualSacrifice)} diff={`−${gbp(annualSacrifice)}`} diffNeg />
              <Row label="Income Tax" now={`−${gbp(c.base.incomeTax)}`} sac={`−${gbp((activeScheme === 'ev' ? c.ev.res : activeScheme === 'cycle' ? c.cycle.res : c.pension.res).incomeTax)}`} diff={`+${gbp(c.base.incomeTax - (activeScheme === 'ev' ? c.ev.res : activeScheme === 'cycle' ? c.cycle.res : c.pension.res).incomeTax)}`} good />
              <Row label="National Insurance" now={`−${gbp(c.base.ni)}`} sac={`−${gbp((activeScheme === 'ev' ? c.ev.res : activeScheme === 'cycle' ? c.cycle.res : c.pension.res).ni)}`} diff={`+${gbp(c.base.ni - (activeScheme === 'ev' ? c.ev.res : activeScheme === 'cycle' ? c.cycle.res : c.pension.res).ni)}`} good />
              <tr className={u.ledgerTotal}>
                <td>Net take-home</td>
                <td>{gbp(c.base.net)}</td>
                <td>{gbp(c.base.net - cost)}</td>
                <td className={u.ledgerNeg}>−{gbp(cost)}</td>
              </tr>
              {activeScheme === 'pension' && (
                <tr><td style={{ color: '#047857', fontWeight: 700 }}>Into your pension</td><td colSpan={2} style={{ textAlign: 'left', fontSize: 12, color: 'var(--uk-muted)' }}>{gbp(annualSacrifice)} + {gbp(c.pension.matchingAmount)} NI rebate</td><td style={{ color: '#047857', fontWeight: 700 }}>+{gbp(c.pension.totalPotAdded)}</td></tr>
              )}
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

function Row({ label, now, sac, diff, diffNeg, good }: { label: string; now: string; sac: string; diff: string; diffNeg?: boolean; good?: boolean }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{now}</td>
      <td>{sac}</td>
      <td className={diffNeg ? u.ledgerNeg : ''} style={good ? { color: '#047857', fontWeight: 600 } : undefined}>{diff}</td>
    </tr>
  );
}
