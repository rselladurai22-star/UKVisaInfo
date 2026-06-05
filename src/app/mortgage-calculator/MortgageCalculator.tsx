'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Landmark,
  Percent,
  Receipt,
  RefreshCw,
  Handshake,
} from 'lucide-react';

const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const gbp2 = (n: number) =>
  '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface YearRow {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState(500000);
  const [deposit, setDeposit] = useState(50000);
  const [term, setTerm] = useState(25);
  const [rate, setRate] = useState(4.5);
  const [fee, setFee] = useState(999);
  const [capitalize, setCapitalize] = useState(false);

  const r = useMemo(() => {
    const loanBase = Math.max(0, price - deposit);
    const loan = loanBase + (capitalize ? fee : 0);
    const n = Math.max(1, Math.round(term * 12));
    const i = rate / 100 / 12;

    const monthly = i === 0 ? loan / n : (loan * i) / (1 - Math.pow(1 + i, -n));

    // Year-by-year amortisation.
    const schedule: YearRow[] = [];
    let balance = loan;
    let yPrincipal = 0;
    let yInterest = 0;
    for (let m = 1; m <= n; m++) {
      const interestM = balance * i;
      const principalM = Math.min(monthly - interestM, balance);
      balance = Math.max(0, balance - principalM);
      yPrincipal += principalM;
      yInterest += interestM;
      if (m % 12 === 0 || m === n) {
        schedule.push({ year: Math.ceil(m / 12), principal: yPrincipal, interest: yInterest, balance });
        yPrincipal = 0;
        yInterest = 0;
      }
    }

    const totalPaid = monthly * n;
    const totalInterest = totalPaid - loan;
    const totalCost = totalPaid + (capitalize ? 0 : fee);
    const ltv = price > 0 ? (loan / price) * 100 : 0;

    const end = new Date();
    end.setMonth(end.getMonth() + n);
    const endLabel = end.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

    return { loan, monthly, totalInterest, totalCost, ltv, n, endLabel, schedule };
  }, [price, deposit, term, rate, fee, capitalize]);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <section className="container-page pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/category/property" className="hover:text-primary transition-colors">Property</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Mortgage Calculator</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">Mortgage Calculator</h1>
        <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Monthly repayments, total interest, payoff date and a full year-by-year amortisation
          schedule — model fees, LTV and rate in one workstation.
        </p>
      </section>

      <main className="container-page pb-16 flex flex-col lg:flex-row gap-6">
        {/* ── Parameters ─────────────────────────────────────────── */}
        <aside className="w-full lg:w-1/4 space-y-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-soft lg:sticky lg:top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-bold text-on-surface">Parameters</h2>
              <span className="text-[10px] px-2 py-1 bg-surface-container rounded text-on-surface-variant uppercase tracking-wider">Config</span>
            </div>

            <div className="space-y-4">
              <Field label="Property Price">
                <NumberInput value={price} onChange={setPrice} prefix="£" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Deposit">
                  <NumberInput value={deposit} onChange={setDeposit} prefix="£" />
                </Field>
                <Field label="Term (yrs)">
                  <NumberInput value={term} onChange={setTerm} />
                </Field>
              </div>

              <div className="pt-3 border-t border-outline-variant">
                <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                  <Percent className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Interest</span>
                </div>
                <Field label={`Rate (${rate}%)`}>
                  <input
                    type="range" min={0} max={12} step={0.05} value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </Field>
              </div>

              <div className="pt-3 border-t border-outline-variant">
                <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                  <Receipt className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Fees</span>
                </div>
                <Field label="Arrangement Fee">
                  <NumberInput value={fee} onChange={setFee} prefix="£" />
                </Field>
                <label className="flex items-center justify-between mt-2 p-2 bg-surface rounded cursor-pointer">
                  <span className="text-xs">Capitalise fee into loan?</span>
                  <input
                    type="checkbox"
                    checked={capitalize}
                    onChange={(e) => setCapitalize(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 py-2.5 bg-primary-soft/30 text-primary rounded-lg text-xs font-bold">
              <RefreshCw className="h-4 w-4" /> Updates live as you type
            </div>
          </div>

          {/* Lead-gen slot */}
          <div className="bg-primary text-white p-5 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-display font-bold mb-1">Need a broker?</h4>
              <p className="text-xs opacity-80 mb-4">Compare whole-of-market mortgage rates with a fee-free adviser.</p>
              <Link href="/category/property" className="inline-block bg-white text-primary px-4 py-2 rounded-lg font-bold text-xs">
                Explore property tools
              </Link>
            </div>
            <Handshake className="absolute -right-3 -bottom-3 h-24 w-24 opacity-10" />
          </div>
        </aside>

        {/* ── Analysis center ────────────────────────────────────── */}
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Summary cards */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <SummaryCard label="Monthly Payment" value={gbp2(r.monthly)} sub={`${r.n} payments`} highlight />
            <SummaryCard label="Loan Amount" value={gbp(r.loan)} sub={`${r.ltv.toFixed(1)}% LTV`} />
            <SummaryCard label="Total Interest" value={gbp(r.totalInterest)} sub={`Over ${term} yrs`} />
            <SummaryCard label="Total Cost" value={gbp(r.totalCost)} sub={capitalize ? 'Fee capitalised' : 'Inc. fee'} />
            <SummaryCard label="Mortgage Ends" value={r.endLabel} sub="Payoff date" dark />
          </section>

          {/* Equity curve */}
          <section className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl border border-outline-variant shadow-soft">
            <h3 className="font-display font-bold text-primary">Equity acceleration curve</h3>
            <p className="text-sm text-on-surface-variant mb-5">Outstanding balance and the interest front-loading effect over the term.</p>
            <BalanceChart schedule={r.schedule} loan={r.loan} />
            <div className="flex gap-5 mt-4 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-2 rounded-sm bg-primary" /> Remaining balance</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-2 rounded-sm bg-secondary" /> Cumulative interest</span>
            </div>
          </section>

          {/* Amortisation schedule */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft overflow-hidden">
            <div className="p-5 border-b border-outline-variant">
              <h3 className="font-display font-bold text-primary">Amortisation schedule</h3>
              <p className="text-xs text-on-surface-variant">Year-by-year principal, interest and remaining balance.</p>
            </div>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-surface-container-low">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Year</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Principal Paid</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Interest Paid</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {r.schedule.map((row) => (
                    <tr key={row.year} className="border-b border-outline-variant/50">
                      <td className="px-5 py-3 font-bold">{row.year}</td>
                      <td className="px-5 py-3">{gbp(row.principal)}</td>
                      <td className="px-5 py-3 text-on-surface-variant">{gbp(row.interest)}</td>
                      <td className="px-5 py-3 font-bold text-primary">{gbp(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* ── Flagship guide ───────────────────────────────────────── */}
      <section className="container-page pb-20 border-t border-outline-variant pt-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary">The financial physics of mortgage repayment</h2>
          <div className="w-20 h-1 bg-secondary mx-auto my-4 rounded-full" />
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            How amortisation actually works, why fixed rates move with swap rates, the cliff-edges of LTV
            bands, and when overpaying beats investing.
          </p>
        </div>

        <article className="max-w-3xl mx-auto space-y-12">
          <Chapter n="1" title="The mathematics of amortisation">
            <p>Amortisation is the systematic reduction of debt through scheduled payments. The fixed monthly payment covers the period&apos;s interest plus a slice of principal. Because interest is charged on the <em>outstanding</em> balance, and that balance is highest at the start, payments are heavily front-loaded.</p>
            <p>In year one of a 25-year mortgage at 4.5%, the majority of each payment is interest — equity barely moves. The &quot;tipping point&quot;, where principal finally exceeds interest within a payment, typically arrives around year 14 on a 25-year term.</p>
            <Callout title="The equilibrium point">
              Understanding this S-curve matters: overpayments made early compress the most interest, because they cut the balance that all future interest is charged on.
            </Callout>
          </Chapter>

          <Chapter n="2" title="Base rate vs swap rates">
            <p>Retail rates aren&apos;t set by the Bank of England base rate alone. Tracker mortgages follow the base rate directly; fixed rates are priced off <strong>swap rates</strong> — what banks pay to exchange fixed for floating interest over a 2- or 5-year horizon.</p>
            <p>Swap rates reflect the market&apos;s <em>future</em> inflation and growth expectations, which is why fixed mortgage rates can rise even when the base rate is held. Watching the spread between base and swap rates reveals windows where fixed deals are temporarily cheap relative to risk.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-5 bg-primary text-white rounded-xl">
                <h4 className="font-bold mb-1">Monetary policy</h4>
                <p className="text-xs opacity-80">Drives trackers and SVRs. Volatility hits unhedged borrowers&apos; cash flow immediately.</p>
              </div>
              <div className="p-5 bg-surface-container-high rounded-xl border border-outline-variant">
                <h4 className="font-bold text-primary mb-1">Capital markets</h4>
                <p className="text-xs text-on-surface-variant">Price fixed terms via global bond yields and sovereign-debt stability.</p>
              </div>
            </div>
          </Chapter>

          <Chapter n="3" title="The cliff-edge effect of LTV bands">
            <p>Lenders price risk in discrete LTV bands — 95%, 90%, 85%, 80%, 75%, 60%. These are cliff-edges, not gradients: a borrower at 60.1% LTV can pay a noticeably higher rate than one at 59.9%.</p>
            <p>That creates a tier-jumping opportunity. A small lump-sum overpayment that drops you into the next band lowers the rate on the <em>entire</em> balance — often an effective first-year return of 20–30%.</p>
            <Callout title="Strategic milestone: the 60% floor">
              Below ~60% LTV, further equity building gives diminishing rate benefit. Focus can shift to tax-advantaged wrappers (ISAs, pensions) instead.
            </Callout>
          </Chapter>

          <Chapter n="4" title="Overpayment vs investing">
            <p>Overpaying is mathematically a guaranteed, tax-free return equal to your mortgage rate. At 4.5%, a 40% taxpayer would need ~7.5% in a taxable account to match it.</p>
            <p>The trade-off is liquidity — equity is hard to access. If expected after-tax investment returns beat the mortgage rate, ISAs and SIPPs can win (&quot;positive carry&quot;). Watch out for early repayment charges (typically 10%/yr allowance during a fix).</p>
          </Chapter>

          <Chapter n="5" title="The psychology of debt freedom">
            <p>The path to payoff is often derailed by debt fatigue — treating the mortgage as a permanent utility bill and drifting onto a high SVR for years.</p>
            <p>Gamifying the balance with milestones (&quot;25% equity&quot;, &quot;principal &gt; interest&quot;) keeps it active. The real prize is a lower survival income — a debt-free home is the strongest hedge against career and economic shocks.</p>
          </Chapter>

          {/* Glossary */}
          <div className="bg-surface-container-low p-6 sm:p-8 rounded-2xl">
            <h3 className="text-xl font-display font-bold text-primary mb-6">Glossary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {[
                ['Amortisation period', 'Total years to clear the principal through regular instalments.'],
                ['Capitalising fees', 'Adding the arrangement fee to the loan, so interest accrues on it over the term.'],
                ['ERC (early repayment charge)', 'Penalty for repaying above the allowed annual limit (often 10%) during a fix.'],
                ['Negative equity', 'When the outstanding loan exceeds the property&apos;s market value.'],
                ['Standard variable rate (SVR)', "The lender's default rate after a fixed/tracker deal ends — usually the costliest."],
                ['Stress testing', 'Checking affordability at hypothetical higher rates (e.g. +3%) to ensure solvency.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="font-bold text-primary mb-1">{t}</p>
                  <p className="text-sm text-on-surface-variant">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          <div className="bg-primary text-white p-8 sm:p-10 rounded-2xl text-center">
            <h3 className="text-xl sm:text-2xl font-display font-bold mb-2">Master your debt trajectory</h3>
            <p className="text-sm opacity-90 max-w-xl mx-auto mb-6">
              Pair this with affordability and stamp duty to model the whole purchase.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/mortgage-affordability" className="bg-white text-primary px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                Mortgage affordability
              </Link>
              <Link href="/stamp-duty-calculator" className="bg-white/10 border border-white/20 px-6 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all">
                Stamp duty
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

/* ── chart ─────────────────────────────────────────────────────── */

function BalanceChart({ schedule, loan }: { schedule: YearRow[]; loan: number }) {
  const W = 600;
  const H = 200;
  if (schedule.length === 0 || loan <= 0) return null;

  const totalInterest = schedule.reduce((s, y) => s + y.interest, 0) || 1;
  const pts = schedule.length;

  const x = (idx: number) => (pts <= 1 ? 0 : (idx / (pts - 1)) * W);
  const yBal = (bal: number) => H - (bal / loan) * (H - 10);

  let cumInt = 0;
  const intMax = totalInterest;
  const balLine = schedule.map((row, idx) => `${x(idx).toFixed(1)},${yBal(row.balance).toFixed(1)}`).join(' ');
  const intLine = schedule
    .map((row, idx) => {
      cumInt += row.interest;
      const y = H - (cumInt / intMax) * (H - 10);
      return `${x(idx).toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const areaPath = `M0,${H} L${balLine.split(' ').join(' L')} L${W},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44" preserveAspectRatio="none" role="img" aria-label="Mortgage balance and cumulative interest over the term">
      <defs>
        <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--uk-primary, #0037b0)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--uk-primary, #0037b0)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#balFill)" />
      <polyline points={balLine} fill="none" stroke="var(--uk-primary, #0037b0)" strokeWidth="2.5" />
      <polyline points={intLine} fill="none" stroke="#bb0027" strokeWidth="2.5" strokeDasharray="4 3" />
    </svg>
  );
}

/* ── building blocks ───────────────────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, prefix }: { value: number; onChange: (n: number) => void; prefix?: string }) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full bg-surface border border-outline-variant rounded-lg ${prefix ? 'pl-7' : 'pl-3'} pr-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none`}
      />
    </div>
  );
}

function SummaryCard({
  label, value, sub, highlight, dark,
}: { label: string; value: string; sub: string; highlight?: boolean; dark?: boolean }) {
  const base = 'p-4 rounded-xl border shadow-soft flex flex-col justify-between gap-2 min-h-[104px]';
  if (dark) {
    return (
      <div className={`${base} bg-primary text-white border-primary`}>
        <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
        <span className="text-xl font-display font-extrabold leading-tight">{value}</span>
        <span className="text-[11px] opacity-80">{sub}</span>
      </div>
    );
  }
  return (
    <div className={`${base} bg-surface-container-lowest border-outline-variant ${highlight ? 'border-b-4 border-b-secondary' : ''}`}>
      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</span>
      <span className={`text-xl font-display font-extrabold leading-tight ${highlight ? 'text-primary' : 'text-on-surface'}`}>{value}</span>
      <span className="text-[11px] text-on-surface-variant">{sub}</span>
    </div>
  );
}

function Chapter({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <h3 className="text-xl sm:text-2xl font-display font-bold text-primary border-l-4 border-secondary pl-4 mb-4">
        {n}. {title}
      </h3>
      <div className="space-y-4 text-[15px] leading-relaxed text-on-surface-variant">{children}</div>
    </section>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 bg-surface-container-low rounded-lg border-l-4 border-primary">
      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{title}</p>
      <p className="text-sm text-on-surface">{children}</p>
    </div>
  );
}
