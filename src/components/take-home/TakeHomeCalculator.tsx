'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { PiggyBank, Repeat, GraduationCap, MapPin } from 'lucide-react';
import {
  calculateTakeHome, STUDENT_LOAN_PLAN_LABEL,
  type StudentLoanPlan, type CalcResult,
} from '../../lib/take-home/calc';
import s from '../calc/calc.module.css';

const gbp = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const PRESETS = [25000, 35000, 50000, 75000, 100000];
const SAL_MIN = 0, SAL_MAX = 250000;
const PERIODS: [number, string][] = [[1, 'Year'], [12, 'Month'], [52, 'Week']];

const fill = (val: number, min: number, max: number): CSSProperties => {
  const p = ((val - min) / (max - min)) * 100;
  return { background: `linear-gradient(90deg, var(--uk-indigo) ${p}%, var(--uk-track) ${p}%)` };
};

export default function TakeHomeCalculator({ initialSalary = 50000 }: { initialSalary?: number }) {
  const [salary, setSalary] = useState(initialSalary);
  const [pensionPct, setPensionPct] = useState(5);
  const [salarySacrifice, setSalarySacrifice] = useState(0);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>('none');
  const [scotland, setScotland] = useState(false);
  const [divisor, setDivisor] = useState(1);

  const r: CalcResult = useMemo(
    () => calculateTakeHome({ salary, pensionPct, salarySacrifice, studentLoan, scotland }),
    [salary, pensionPct, salarySacrifice, studentLoan, scotland],
  );

  const gross = r.grossSalary || 1;
  const per = (n: number) => gbp(n / divisor);
  const w = (v: number) => `${Math.max(0, (v / gross) * 100)}%`;
  const periodLabel = divisor === 1 ? 'a year' : divisor === 12 ? 'a month' : 'a week';

  return (
    <div className={s.calc}>
      {/* INPUTS */}
      <div className={s.panel}>
        <div className={s.salaryHero}>
          <div className={s.shead}>Annual gross salary</div>
          <div className={s.amount}>
            <span className={s.cur}>£</span>
            <input
              className={s.amtInput} type="text" inputMode="numeric" aria-label="Annual salary"
              value={salary.toLocaleString('en-GB')}
              onChange={(e) => setSalary(Math.min(SAL_MAX, Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0)))}
            />
            <span className={s.yr}>/ year</span>
          </div>
          <div className={s.sliderWrap}>
            <input className={s.slider} type="range" min={SAL_MIN} max={SAL_MAX} step={500} value={salary} style={fill(salary, SAL_MIN, SAL_MAX)} onChange={(e) => setSalary(+e.target.value)} aria-label="Salary slider" />
            <div className={s.scale}><span>£0</span><span>£125k</span><span>£250k</span></div>
          </div>
          <div className={s.presets}>{PRESETS.map((p) => (<button key={p} onClick={() => setSalary(p)}>£{p / 1000}k</button>))}</div>
        </div>

        <div className={s.group}>
          <div className={s.groupLabel}>Adjustments</div>

          <div className={s.fieldCard}>
            <div className={s.fhead}>
              <span className={s.ficon} style={{ background: 'var(--uk-c5)' }}><PiggyBank size={19} /></span>
              <div className={s.ftext}><div className={s.fl}>Pension contribution</div><div className={s.fh}>Relief at source / net-pay</div></div>
              <span className={s.fval}>{pensionPct}%</span>
            </div>
            <input className={`${s.slider} ${s.sliderMini}`} type="range" min={0} max={50} step={1} value={pensionPct} style={fill(pensionPct, 0, 50)} onChange={(e) => setPensionPct(+e.target.value)} aria-label="Pension percentage" />
          </div>

          <div className={s.fieldCard}>
            <div className={s.fhead}>
              <span className={s.ficon} style={{ background: 'var(--uk-c4)' }}><Repeat size={19} /></span>
              <div className={s.ftext}><div className={s.fl}>Salary sacrifice</div><div className={s.fh}>Cycle, EV, extra pension</div></div>
            </div>
            <div className={`${s.numInput} ${s.control}`}>
              <span>£</span>
              <input type="text" inputMode="numeric" aria-label="Salary sacrifice amount" placeholder="0"
                value={salarySacrifice ? salarySacrifice.toLocaleString('en-GB') : ''}
                onChange={(e) => setSalarySacrifice(Math.max(0, +e.target.value.replace(/[^0-9]/g, '') || 0))} />
            </div>
          </div>

          <div className={s.fieldCard}>
            <div className={s.fhead}>
              <span className={s.ficon} style={{ background: 'var(--uk-c3)' }}><GraduationCap size={19} /></span>
              <div className={s.ftext}><div className={s.fl}>Student loan</div><div className={s.fh}>Repayment plan</div></div>
            </div>
            <select className={`${s.select} ${s.control}`} value={studentLoan} onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)} aria-label="Student loan plan">
              {(Object.keys(STUDENT_LOAN_PLAN_LABEL) as StudentLoanPlan[]).map((p) => (
                <option key={p} value={p}>{STUDENT_LOAN_PLAN_LABEL[p]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={s.group}>
          <div className={s.groupLabel}>Your situation</div>
          <div
            className={`${s.fieldCard} ${s.toggle}`} role="button" tabIndex={0} aria-pressed={scotland}
            onClick={() => setScotland((v) => !v)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setScotland((v) => !v); } }}
          >
            <span className={s.ficon} style={{ background: 'var(--uk-c2)' }}><MapPin size={19} /></span>
            <div className={s.ftext}><div className={s.fl}>Scottish income tax</div><div className={s.fh}>Different bands &amp; rates</div></div>
            <span className={`${s.sw} ${scotland ? s.swOn : ''}`} />
          </div>
        </div>
      </div>

      {/* RESULT */}
      <div className={s.result}>
        <div className={s.rtop}>
          <span className={s.rl}>Your take-home pay</span>
          <div className={s.period}>
            {PERIODS.map(([d, l]) => (
              <button key={d} className={`${s.periodBtn} ${divisor === d ? s.periodOn : ''}`} onClick={() => setDivisor(d)}>{l}</button>
            ))}
          </div>
        </div>
        <div className={s.big}>{per(r.netAnnual)}</div>
        <div className={s.subr}>{periodLabel} · {gbp(r.netMonthly)}/mo · {gbp(r.netWeekly)}/wk</div>
        <div className={s.keep}>You keep <b>{Math.round((r.netAnnual / gross) * 100)}%</b> of your salary</div>

        <div className={s.stack}>
          <span style={{ width: w(r.netAnnual), background: '#4ADE80' }} />
          <span style={{ width: w(r.incomeTax), background: '#F472B6' }} />
          <span style={{ width: w(r.nationalInsurance), background: '#FBBF24' }} />
          <span style={{ width: w(r.pensionContribution), background: '#818CF8' }} />
          <span style={{ width: w(r.salarySacrifice), background: '#22D3EE' }} />
          <span style={{ width: w(r.studentLoanRepayment), background: '#38BDF8' }} />
        </div>

        <div className={s.legend}>
          <div className={s.lrow}><span className={s.ldot} style={{ background: '#4ADE80' }} /><span className={s.lnm}>Take-home</span><span className={s.lamt}>{per(r.netAnnual)}</span></div>
          <div className={s.lrow}><span className={s.ldot} style={{ background: '#F472B6' }} /><span className={s.lnm}>Income Tax</span><span className={s.lamt}>{per(r.incomeTax)}</span></div>
          <div className={s.lrow}><span className={s.ldot} style={{ background: '#FBBF24' }} /><span className={s.lnm}>National Insurance</span><span className={s.lamt}>{per(r.nationalInsurance)}</span></div>
          {r.pensionContribution > 0 && <div className={s.lrow}><span className={s.ldot} style={{ background: '#818CF8' }} /><span className={s.lnm}>Pension</span><span className={s.lamt}>{per(r.pensionContribution)}</span></div>}
          {r.salarySacrifice > 0 && <div className={s.lrow}><span className={s.ldot} style={{ background: '#22D3EE' }} /><span className={s.lnm}>Salary sacrifice</span><span className={s.lamt}>{per(r.salarySacrifice)}</span></div>}
          {r.studentLoanRepayment > 0 && <div className={s.lrow}><span className={s.ldot} style={{ background: '#38BDF8' }} /><span className={s.lnm}>Student loan</span><span className={s.lamt}>{per(r.studentLoanRepayment)}</span></div>}
          <div className={`${s.lrow} ${s.ltot}`}><span className={s.ldot} style={{ background: '#fff' }} /><span className={s.lnm}>Gross salary</span><span className={s.lamt}>{per(r.grossSalary)}</span></div>
        </div>

        <div className={s.insights}>
          <div className={s.infoCard}><div className={s.infoLabel}>Marginal rate</div><div className={s.infoVal}>{pct(r.marginalRate)}</div><div className={s.infoSub}>On your next £1</div></div>
          <div className={s.infoCard}><div className={s.infoLabel}>Effective rate</div><div className={s.infoVal}>{pct(r.effectiveRate)}</div><div className={s.infoSub}>Deductions ÷ gross</div></div>
        </div>

        {r.incomeTaxBands.length > 0 && (
          <details className={s.detailsBox}>
            <summary>Band-by-band breakdown</summary>
            <table className={s.bandTable}>
              <thead><tr><th>Band</th><th>Taxed on</th><th>Tax</th></tr></thead>
              <tbody>
                {r.incomeTaxBands.map((b, i) => (<tr key={i}><td>{b.label}</td><td>{gbp(b.taxOn)}</td><td>{gbp(b.tax)}</td></tr>))}
                {r.niBands.map((b, i) => (<tr key={`ni-${i}`}><td>NI {b.label}</td><td>{gbp(b.taxOn)}</td><td>{gbp(b.tax)}</td></tr>))}
              </tbody>
            </table>
          </details>
        )}

        <p className={s.note}>Estimate for {scotland ? 'Scotland' : 'England, Wales & NI'}, 2026/27. Pension as net-pay; salary sacrifice reduces tax &amp; NI base. Standard tax code, no other income.</p>
      </div>
    </div>
  );
}
