'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, PiggyBank, GraduationCap, MapPin, Users, Wallet, AlertTriangle, Info } from 'lucide-react';
import { calcTax, gbp, pct } from '../../lib/taxEngine';
import u from '../../components/calc-shell/calcui.module.css';

export default function ChildBenefitClient() {
  const [salary, setSalary] = useState(65000);
  const [partnerSalary, setPartnerSalary] = useState(30000);
  const [children, setChildren] = useState(2);

  const [pensionContrib, setPensionContrib] = useState(0);
  const [studentLoan, setStudentLoan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5'>('none');
  const [scotland, setScotland] = useState(false);
  const [postgradLoan, setPostgradLoan] = useState(false);

  const [openG, setOpenG] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setOpenG((o) => ({ ...o, [k]: !o[k] }));

  const highestSalary = Math.max(salary, partnerSalary);
  const lowestSalary = Math.min(salary, partnerSalary);

  const c = useMemo(() => {
    const cbFirst = 1331.20, cbAdditional = 881.40;
    const totalChildBenefit = children > 0 ? cbFirst + Math.max(0, children - 1) * cbAdditional : 0;
    const baseTax = calcTax({ salary: highestSalary, studentLoan, postgradLoan, scotland, children });
    const sacTax = calcTax({ salary: Math.max(0, highestSalary - pensionContrib), studentLoan, postgradLoan, scotland, children });
    const clawbackBefore = baseTax.hicbc;
    const clawbackAfter = sacTax.hicbc;
    const restoredBenefit = Math.max(0, clawbackBefore - clawbackAfter);
    const escapePensionRequired = Math.max(0, highestSalary - 60000);
    return { totalChildBenefit, clawbackBefore, clawbackAfter, restoredBenefit, escapePensionRequired, baseTax, sacTax };
  }, [highestSalary, children, pensionContrib, studentLoan, postgradLoan, scotland]);

  const clawbackPct = c.totalChildBenefit > 0 ? c.clawbackBefore / c.totalChildBenefit : 0;
  const netKept = Math.max(0, c.totalChildBenefit - c.clawbackBefore);
  const markerPos = Math.min(99, (highestSalary / 100000) * 100);
  const SAL_PRE = [45000, 60000, 70000, 85000, 100000];

  return (
    <div className={u.grid}>
      {/* LEFT */}
      <div className={u.panel}>
        <div className={u.panelHead}><Wallet size={13} /> Your household</div>

        <div className={u.primary}>
          <label className={u.primaryLabel}>Your annual salary</label>
          <div className={u.amountRow}>
            <span className={u.cur}>£</span>
            <input className={u.amountInput} type="number" value={salary || ''} onChange={(e) => setSalary(Math.max(0, +e.target.value))} />
            <span className={u.amountSuffix}>/ year</span>
          </div>
          <input className={u.slider} type="range" min={10000} max={150000} step={1000} value={salary} onChange={(e) => setSalary(+e.target.value)} />
          <div className={u.scale}><span>£10k</span><span>£150k</span></div>
          <div className={u.presets}>{SAL_PRE.map((p) => <button key={p} type="button" className={salary === p ? u.presetActive : ''} onClick={() => setSalary(p)}>£{p / 1000}k</button>)}</div>
        </div>

        <div className={u.fieldRow} style={{ marginTop: 16 }}>
          <div className={u.field}>
            <span className={u.fieldLabel}>Partner&apos;s salary</span>
            <div className={u.inputWrap}><span>£</span><input type="number" value={partnerSalary || ''} onChange={(e) => setPartnerSalary(Math.max(0, +e.target.value))} /></div>
          </div>
          <div className={u.field}>
            <span className={u.fieldLabel}>Children</span>
            <div className={u.inputWrap}><input type="number" min={1} max={10} value={children} onChange={(e) => setChildren(Math.max(1, Math.min(10, +e.target.value)))} /><span>kids</span></div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--uk-muted)', margin: '8px 2px 0', lineHeight: 1.5 }}>The charge is based on whichever of you earns more — not your combined income.</p>

        <div className={u.groups} style={{ marginTop: 16 }}>
          <Group icon={<PiggyBank size={16} />} title="Pension escape" hint="Model a contribution" open={openG.pension} onToggle={() => toggle('pension')}>
            <div className={u.field}>
              <span className={u.fieldLabel}>Annual pension contribution</span>
              <div className={u.inputWrap}><span>£</span><input type="number" value={pensionContrib || ''} placeholder="0" onChange={(e) => setPensionContrib(Math.max(0, +e.target.value))} /></div>
            </div>
          </Group>
          <Group icon={<GraduationCap size={16} />} title="Student loans" hint="Repayment plan" open={openG.loans} onToggle={() => toggle('loans')}>
            <div className={u.field}>
              <span className={u.fieldLabel}>Plan</span>
              <select className={u.select} value={studentLoan} onChange={(e) => setStudentLoan(e.target.value as typeof studentLoan)}>
                <option value="none">No student loan</option><option value="plan1">Plan 1</option><option value="plan2">Plan 2</option><option value="plan4">Plan 4 (Scotland)</option><option value="plan5">Plan 5</option>
              </select>
            </div>
            <label className={u.check}><input type="checkbox" checked={postgradLoan} onChange={(e) => setPostgradLoan(e.target.checked)} />Postgraduate loan</label>
          </Group>
          <Group icon={<MapPin size={16} />} title="Region" hint="Scottish tax bands" open={openG.region} onToggle={() => toggle('region')}>
            <label className={u.check}><input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} />Scottish taxpayer</label>
          </Group>
        </div>
      </div>

      {/* RIGHT */}
      <div className={u.results}>
        <div className={u.resultHero}>
          <div className={u.heroLabel}>Child Benefit you lose to the charge</div>
          <div className={u.heroFigure}>{gbp(c.clawbackBefore)}</div>
          <div className={u.heroSub}>of <strong>{gbp(c.totalChildBenefit)}</strong> you&apos;re entitled to · you keep <strong>{gbp(netKept)}</strong></div>
        </div>

        <div className={u.kpis}>
          <div className={u.kpi}><div className={u.kpiLabel}>Benefit kept</div><div className={u.kpiVal} style={{ color: '#047857' }}>{gbp(netKept)}</div></div>
          <div className={u.kpi}><div className={u.kpiLabel}>Clawed back</div><div className={`${u.kpiVal} ${clawbackPct > 0 ? u.kpiValWarn : ''}`}>{pct(clawbackPct, 0)}</div></div>
        </div>

        {/* clawback scale */}
        <div className={u.barWrap}>
          <div className={u.barLabelRow}><span>Where the top earner sits</span><span>{gbp(highestSalary)}</span></div>
          <div style={{ position: 'relative', height: 14, background: 'var(--uk-soft)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '60%', width: '20%', height: '100%', background: 'linear-gradient(90deg,#fef3c7,#fee2e2)' }} />
            <div style={{ position: 'absolute', left: '80%', width: '20%', height: '100%', background: '#fca5a5' }} />
            <div style={{ position: 'absolute', left: `${markerPos}%`, top: 0, bottom: 0, width: 3, background: 'var(--uk-indigo)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--uk-muted)', marginTop: 5, fontWeight: 600 }}>
            <span>£0</span><span>£60k starts</span><span>£80k gone</span><span>£100k</span>
          </div>
        </div>

        {c.escapePensionRequired > 0 && (
          <div className={u.callout} style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
            <Info size={16} style={{ color: '#059669' }} />
            <span>Put <strong>{gbp(c.escapePensionRequired)}</strong> into a pension this year and your adjusted income drops to £60,000 — reclaiming the full <strong>{gbp(c.totalChildBenefit)}</strong> and dodging the charge completely.</span>
          </div>
        )}

        {highestSalary >= 60000 && lowestSalary < 60000 && (
          <div className={u.callout}>
            <AlertTriangle size={16} />
            <span>Even if you opt out of the cash to avoid the charge, keep the claim registered in the lower earner&apos;s name — it protects their State Pension through NI credits.</span>
          </div>
        )}

        {pensionContrib > 0 && (
          <div className={u.tableWrap}>
            <div className={u.tableHead}><span className={u.tableTitle}>Before vs with pension</span></div>
            <table className={u.ledger}>
              <thead><tr><th>Item</th><th>Before</th><th>With pension</th></tr></thead>
              <tbody>
                <tr><td>Top earner adjusted income</td><td>{gbp(highestSalary)}</td><td>{gbp(highestSalary - pensionContrib)}</td></tr>
                <tr><td>Child Benefit charge</td><td className={u.ledgerNeg}>−{gbp(c.clawbackBefore)}</td><td className={c.clawbackAfter > 0 ? u.ledgerNeg : ''}>−{gbp(c.clawbackAfter)}</td></tr>
                <tr><td>Income Tax (top earner)</td><td>−{gbp(c.baseTax.incomeTax)}</td><td>−{gbp(c.sacTax.incomeTax)}</td></tr>
                <tr className={u.ledgerTotal}><td>Benefit reclaimed</td><td colSpan={2} style={{ color: '#047857', fontWeight: 800, textAlign: 'right' }}>+{gbp(c.restoredBenefit)}</td></tr>
              </tbody>
            </table>
          </div>
        )}
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
