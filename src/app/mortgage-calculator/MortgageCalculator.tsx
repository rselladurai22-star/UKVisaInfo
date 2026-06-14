'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, SlidersHorizontal, TrendingDown, Info } from 'lucide-react';
import {
  gbp, pct, Panel, Stat, Field, MoneyInput, NumberInput, Slider, Toggle, AdvancedOptions,
  Donut, LineChart, BarTrack, GuideHeading, Callout, FAQ, RelatedTools, CalcButton, ResultsPlaceholder,
} from '../../components/calc-ui';

const ACCENT = '#bb0027';
const PRIMARY = '#0037b0';

interface YearRow { year: number; interest: number; principal: number; balance: number }
interface SimResult { months: number; totalInterest: number; yearly: YearRow[] }

function simulate(loan: number, monthlyRate: number, payment: number, extraMonthly: number, annualLump: number): SimResult {
  let bal = loan;
  let totalInterest = 0;
  let yInt = 0;
  let yPrin = 0;
  const yearly: YearRow[] = [];
  let m = 0;
  const cap = 12 * 60;
  while (bal > 0.005 && m < cap) {
    m++;
    const intM = bal * monthlyRate;
    let prin = payment - intM + extraMonthly;
    if (annualLump > 0 && m % 12 === 0) prin += annualLump;
    if (prin <= 0) { prin = 0; } // payment doesn't even cover interest
    if (prin > bal) prin = bal;
    bal -= prin;
    totalInterest += intM;
    yInt += intM;
    yPrin += prin;
    if (m % 12 === 0 || bal <= 0.005) {
      yearly.push({ year: Math.ceil(m / 12), interest: yInt, principal: yPrin, balance: Math.max(0, bal) });
      yInt = 0; yPrin = 0;
    }
    if (payment - intM + extraMonthly <= 0 && annualLump === 0) break; // never amortises
  }
  return { months: m, totalInterest, yearly };
}

const LTV_BANDS = [60, 75, 80, 85, 90, 95];

const fmtYM = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y <= 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
};

export default function MortgageCalculator() {
  const [done, setDone] = useState(false);

  const [price, setPrice] = useState(350000);
  const [deposit, setDeposit] = useState(52500); // 15%
  const [termYears, setTermYears] = useState(25);
  const [rate, setRate] = useState(4.7);

  const [fee, setFee] = useState(999);
  const [capitalise, setCapitalise] = useState(true);
  const [overMonthly, setOverMonthly] = useState(0);
  const [overLump, setOverLump] = useState(0);

  const r = useMemo(() => {
    const loanBase = Math.max(0, price - deposit);
    const loan = loanBase + (capitalise ? fee : 0);
    const n = Math.max(1, Math.round(termYears * 12));
    const i = rate / 100 / 12;

    const payment = i === 0 ? loan / n : (loan * i) / (1 - Math.pow(1 + i, -n));

    const base = simulate(loan, i, payment, 0, 0);
    const over = simulate(loan, i, payment, overMonthly, overLump);

    const totalInterestBase = base.totalInterest;
    const interestSaved = totalInterestBase - over.totalInterest;
    const monthsSaved = base.months - over.months;

    const totalPaid = payment * base.months;
    const totalCost = totalPaid + (capitalise ? 0 : fee) + deposit;
    const ltv = price > 0 ? (loanBase / price) * 100 : 0;
    const interestOnly = loan * i;

    const end = new Date();
    end.setMonth(end.getMonth() + over.months);
    const endLabel = end.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

    // Next lower LTV band + overpayment needed to reach it.
    const nextBand = [...LTV_BANDS].reverse().find((b) => b < ltv - 0.01);
    const reduceToBand = nextBand ? loanBase - price * (nextBand / 100) : 0;

    // Rate sensitivity table.
    const sens = [-1, 0, 1, 2, 3].map((d) => {
      const ri = (rate + d) / 100 / 12;
      const pay = ri === 0 ? loan / n : (loan * ri) / (1 - Math.pow(1 + ri, -n));
      return { delta: d, rate: rate + d, payment: pay };
    });

    const overpaying = overMonthly > 0 || overLump > 0;
    const baseBalances = [loan, ...base.yearly.map((y) => y.balance)];
    const overBalances = [loan, ...over.yearly.map((y) => y.balance)];
    const chartLabels = baseBalances.map((_, idx) => (idx === 0 ? 'Now' : `Year ${idx}`));

    return {
      loan, loanBase, payment, n, totalInterestBase, interestSaved, monthsSaved,
      totalPaid, totalCost, ltv, interestOnly, endLabel, base, over, nextBand, reduceToBand, sens,
      overpaying, baseBalances, overBalances, chartLabels,
      neverAmortises: i > 0 && payment + overMonthly <= loan * i,
    };
  }, [price, deposit, termYears, rate, fee, capitalise, overMonthly, overLump]);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Header */}
      <section className="container-page pt-10 pb-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/category/property" className="hover:text-primary">Property</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Mortgage Calculator</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">UK Mortgage Repayment Calculator</h1>
        <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Work out your monthly repayment, total interest and payoff date — then model overpayments,
          fees, LTV bands and rate rises. Figures use the standard capital-and-interest (annuity) method
          lenders apply, updated for 2025/26.
        </p>
      </section>

      {/* Calculator */}
      <section className="container-page pb-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Panel title="Your mortgage" icon={<Home className="h-4 w-4" />}>
            <div className="space-y-4">
              <Field label="Property price">
                <MoneyInput value={price} onChange={setPrice} step={5000} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Deposit" hint={`${pct(price ? (deposit / price) * 100 : 0)} of price`}>
                  <MoneyInput value={deposit} onChange={setDeposit} step={1000} />
                </Field>
                <Field label="Term (years)">
                  <NumberInput value={termYears} onChange={setTermYears} suffix="yrs" />
                </Field>
              </div>
              <Field label={`Interest rate — ${pct(rate, 2)}`}>
                <Slider value={rate} onChange={setRate} min={0} max={12} step={0.05} />
              </Field>

            </div>
          </Panel>

          <AdvancedOptions label="Fees & overpayments" hint="Add a product fee and model overpayments to clear the loan sooner">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Product / arrangement fee">
                <MoneyInput value={fee} onChange={setFee} step={100} />
              </Field>
              <div className="flex items-end">
                <Toggle checked={capitalise} onChange={setCapitalise} label="Add fee to loan" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Monthly overpayment">
                <MoneyInput value={overMonthly} onChange={setOverMonthly} step={50} />
              </Field>
              <Field label="Annual lump sum">
                <MoneyInput value={overLump} onChange={setOverLump} step={500} />
              </Field>
            </div>
            <p className="text-[11px] text-on-surface-variant flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              Most lenders allow penalty-free overpayments of up to 10% of the balance per year during a fixed deal.
            </p>
          </AdvancedOptions>

          <CalcButton done={done} onClick={() => setDone(true)} />
        </div>

        {/* Results (sticky) */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 self-start scroll-mt-20">
          {done ? (<>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Monthly payment" value={gbp(r.payment, 2)} sub={`${r.n} payments`} tone="dark" />
            <Stat label="Loan amount" value={gbp(r.loanBase)} sub={`${pct(r.ltv)} LTV`} />
            <Stat label="Total interest" value={gbp(r.totalInterestBase)} sub={`Over ${termYears} yrs`} tone="accent" />
            <Stat label="Mortgage ends" value={r.endLabel} sub={`${r.over.months} payments`} />
          </div>

          {r.neverAmortises && (
            <Callout tone="warn" title="Payment too low">
              At this rate the monthly payment barely covers interest, so the balance never clears. Increase the
              term length or deposit, or check the rate.
            </Callout>
          )}

          <Panel title="Where your money goes">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Donut
                centerLabel="Total repaid"
                centerValue={gbp(r.loan + r.totalInterestBase)}
                segments={[
                  { value: r.loan, color: PRIMARY, label: 'Capital (loan)' },
                  { value: r.totalInterestBase, color: ACCENT, label: 'Interest' },
                ]}
              />
              <div className="flex-1 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Capital borrowed</span><span className="font-semibold tabular-nums">{gbp(r.loan)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Interest (full term)</span><span className="font-semibold tabular-nums text-secondary">{gbp(r.totalInterestBase)}</span></div>
                <BarTrack segments={[{ value: r.loan, color: PRIMARY }, { value: r.totalInterestBase, color: ACCENT }]} />
                <div className="flex justify-between pt-1"><span className="text-on-surface-variant">Total of payments</span><span className="font-bold tabular-nums">{gbp(r.totalPaid)}</span></div>
              </div>
            </div>
          </Panel>

          <Panel title="Rate sensitivity (stress test)" icon={<SlidersHorizontal className="h-4 w-4" />}>
            <p className="text-xs text-on-surface-variant mb-3">
              Lenders test affordability at higher rates. Here&apos;s your monthly payment if rates change at renewal:
            </p>
            <div className="overflow-x-auto rounded-lg border border-outline-variant">
              <table className="w-full text-sm">
                <tbody>
                  {r.sens.map((s) => (
                    <tr key={s.delta} className={`border-b border-outline-variant/60 last:border-0 ${s.delta === 0 ? 'bg-primary-soft/15' : ''}`}>
                      <td className="px-3 py-2 text-on-surface-variant">{s.delta === 0 ? 'Current' : `${s.delta > 0 ? '+' : ''}${s.delta}%`}</td>
                      <td className="px-3 py-2 font-semibold tabular-nums">{pct(s.rate, 2)}</td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums text-primary">{gbp(s.payment, 2)}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Balance over time" icon={<TrendingDown className="h-4 w-4" />}>
            <LineChart
              height={200}
              labels={r.chartLabels}
              format={(v) => gbp(v)}
              series={[
                { points: r.baseBalances, color: PRIMARY, label: 'Standard payments', payoffIndex: r.base.yearly.length },
                ...(r.overpaying
                  ? [{ points: r.overBalances, color: ACCENT, label: 'With overpayments', dashed: true, payoffIndex: r.over.yearly.length }]
                  : []),
              ]}
            />

            {r.overpaying ? (
              <>
                <div className="mt-4 p-3 rounded-lg bg-secondary-soft/30 border border-secondary/20 text-sm text-on-surface">
                  Overpaying clears your mortgage in{' '}
                  <strong className="text-secondary">{fmtYM(r.over.months)}</strong> instead of{' '}
                  <strong>{fmtYM(r.base.months)}</strong> — that&apos;s{' '}
                  <strong className="text-secondary">{fmtYM(r.monthsSaved)} early</strong>.
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  <Stat label="Interest saved" value={gbp(r.interestSaved)} tone="primary" />
                  <Stat label="Time saved" value={fmtYM(r.monthsSaved)} tone="primary" />
                  <Stat label="Paid off" value={r.endLabel} tone="primary" />
                </div>
              </>
            ) : (
              <p className="mt-3 text-xs text-on-surface-variant">
                Add a monthly or lump-sum overpayment under Advanced options to see how much faster you could be
                mortgage-free.
              </p>
            )}
          </Panel>

          <Panel title="LTV band analysis">
                <p className="text-sm text-on-surface-variant mb-3">
                  Lenders price in bands. You&apos;re at <strong className="text-primary">{pct(r.ltv)}</strong> LTV.
                  {r.nextBand
                    ? <> Overpay <strong className="text-secondary">{gbp(Math.max(0, r.reduceToBand))}</strong> to reach the {r.nextBand}% band and unlock a cheaper rate on the whole balance.</>
                    : <> You&apos;re already in the lowest mainstream band — further equity gives little rate benefit.</>}
                </p>
                <div className="flex gap-1">
                  {LTV_BANDS.map((b) => (
                    <div key={b} className={`flex-1 text-center py-1.5 rounded text-[11px] font-bold ${r.ltv > b ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>≤{b}%</div>
                  ))}
                </div>
              </Panel>

              <Panel title="Repayment vs interest-only">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Repayment</div>
                    <div className="text-xl font-display font-bold text-primary tabular-nums">{gbp(r.payment, 0)}<span className="text-xs font-normal">/mo</span></div>
                    <div className="text-xs text-on-surface-variant mt-1">Clears the loan; builds equity.</div>
                  </div>
                  <div>
                    <div className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Interest-only</div>
                    <div className="text-xl font-display font-bold text-secondary tabular-nums">{gbp(r.interestOnly, 0)}<span className="text-xs font-normal">/mo</span></div>
                    <div className="text-xs text-on-surface-variant mt-1">Lower cost; balance stays owed.</div>
                  </div>
                </div>
              </Panel>

              <Panel title="Amortisation schedule">
                <div className="overflow-x-auto max-h-[360px] overflow-y-auto -mx-1">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-surface-container-low">
                      <tr className="text-left">
                        <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Year</th>
                        <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Principal</th>
                        <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Interest</th>
                        <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.over.yearly.map((y) => (
                        <tr key={y.year} className="border-b border-outline-variant/50">
                          <td className="px-3 py-2 font-bold">{y.year}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{gbp(y.principal)}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-on-surface-variant">{gbp(y.interest)}</td>
                          <td className="px-3 py-2 text-right tabular-nums font-semibold text-primary">{gbp(y.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

          <p className="text-[11px] text-on-surface-variant">
            Estimates only, not financial advice or a mortgage offer. Lenders apply their own criteria, rounding and
            day-count conventions. Verify figures with a regulated adviser before committing.
          </p>
          </>) : <ResultsPlaceholder />}
        </div>
      </section>

      {/* ── Guide ─────────────────────────────────────────────────── */}
      <Guide />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Educational guide (3,000+ words)
═══════════════════════════════════════════════════════════════════ */

function Guide() {
  return (
    <article className="container-page pb-24 border-t border-outline-variant pt-14 max-w-3xl">
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">Complete guide</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mt-1">How UK mortgage repayments really work</h2>
        <p className="mt-3 text-on-surface-variant leading-relaxed">
          A repayment mortgage looks simple — borrow a sum, pay it back monthly — but the maths underneath
          decides how much of your money becomes the bank&apos;s and how much becomes your equity. This guide
          explains the mechanics, the levers you control, and the costly traps, all for the UK 2025/26 market.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <GuideHeading kicker="The mechanics">The annuity formula behind your payment</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            A capital-and-interest (&quot;repayment&quot;) mortgage uses the standard annuity formula. Your fixed
            monthly payment <em>M</em> is set so that, at the agreed interest rate, the balance reaches exactly
            zero on the final month of the term:
          </p>
          <div className="my-5 p-5 rounded-lg bg-surface-container text-center">
            <code className="text-sm sm:text-base font-semibold text-primary">M = P · i ÷ (1 − (1 + i)<sup>−n</sup>)</code>
            <p className="mt-2 text-xs text-on-surface-variant">
              P = loan · i = monthly interest rate (annual ÷ 12) · n = number of monthly payments (years × 12)
            </p>
          </div>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Each month the lender charges interest on the <strong>outstanding</strong> balance only. Because that
            balance is highest at the start, early payments are mostly interest and barely dent the capital. As
            the balance falls, the interest slice shrinks and the capital slice grows — an accelerating curve
            sometimes called the &quot;amortisation S-curve&quot;.
          </p>
          <Callout tone="tip" title="The crossover point">
            On a typical 25-year mortgage, the point where more of each payment goes to capital than to interest
            doesn&apos;t arrive until roughly year 12–14. This is exactly why overpayments made early are so
            powerful — they remove capital that would otherwise accrue interest for two more decades.
          </Callout>
        </section>

        <section>
          <GuideHeading kicker="Worked example">A £297,500 loan at 4.7% over 25 years</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Take a £350,000 home with a £52,500 deposit (15%), leaving a £297,500 loan at 4.7% over 25 years
            (300 payments). The monthly payment works out at about <strong>£1,686</strong>. Over the full term
            you repay roughly <strong>£505,800</strong> — meaning around <strong>£208,300 of interest</strong>
            on top of the capital. In year one, roughly £13,800 of your £20,200 in payments is interest; only
            about £6,400 reduces the balance.
          </p>
          <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant">
              <div className="text-xs text-on-surface-variant uppercase tracking-wider">Monthly</div>
              <div className="text-2xl font-display font-extrabold text-primary tabular-nums">£1,686</div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant">
              <div className="text-xs text-on-surface-variant uppercase tracking-wider">Interest (25 yrs)</div>
              <div className="text-2xl font-display font-extrabold text-secondary tabular-nums">£208,300</div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant">
              <div className="text-xs text-on-surface-variant uppercase tracking-wider">Total repaid</div>
              <div className="text-2xl font-display font-extrabold text-on-surface tabular-nums">£505,800</div>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Now add a £150/month overpayment from day one. You&apos;d clear the mortgage around 3 years early and
            save roughly £30,000 in interest — a guaranteed, tax-free return equal to your mortgage rate. Use the
            calculator above — open Advanced options to model overpayments and fees.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Loan structure">Repayment vs interest-only</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            With a <strong>repayment</strong> mortgage each payment clears interest and a slice of capital, so
            you own the home outright at the end of the term. With an <strong>interest-only</strong> mortgage you
            pay just the interest; the full capital is still owed on the final day and must be repaid from a
            separate plan (sale, investments, or a pension lump sum). Interest-only is now mostly limited to
            buy-to-let and high-equity borrowers, because residential lenders must see a credible repayment
            vehicle. The monthly saving is real but the long-term cost is far higher.
          </p>
          <div className="my-5 overflow-x-auto rounded-xl border border-outline-variant">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-left">
                <tr>
                  <th className="px-4 py-3 font-bold">Feature</th>
                  <th className="px-4 py-3 font-bold">Repayment</th>
                  <th className="px-4 py-3 font-bold">Interest-only</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                <tr><td className="px-4 py-3 text-on-surface-variant">Monthly cost</td><td className="px-4 py-3">Higher</td><td className="px-4 py-3">Lower</td></tr>
                <tr><td className="px-4 py-3 text-on-surface-variant">Balance at end</td><td className="px-4 py-3">£0</td><td className="px-4 py-3">Full loan still owed</td></tr>
                <tr><td className="px-4 py-3 text-on-surface-variant">Builds equity</td><td className="px-4 py-3">Yes, automatically</td><td className="px-4 py-3">Only via house-price growth</td></tr>
                <tr><td className="px-4 py-3 text-on-surface-variant">Typical use</td><td className="px-4 py-3">Residential</td><td className="px-4 py-3">Buy-to-let, high equity</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <GuideHeading kicker="Rates">Fixed, tracker and SVR — and why swap rates matter</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            A <strong>fixed rate</strong> locks your rate for a set period (commonly 2 or 5 years). A
            <strong> tracker</strong> follows the Bank of England base rate plus a margin, so payments move with
            policy decisions. The <strong>standard variable rate (SVR)</strong> is the lender&apos;s default rate
            you roll onto when a deal ends — almost always the most expensive option, so remortgaging before then
            usually pays.
          </p>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Crucially, fixed rates are <em>not</em> priced off the base rate. They&apos;re priced off
            <strong> swap rates</strong> — the wholesale cost banks pay to swap floating interest for fixed over a
            given term. Swaps reflect the market&apos;s expectations of <em>future</em> inflation and rates, which
            is why fixed mortgage deals can get cheaper or dearer even when the base rate hasn&apos;t moved.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
            <div className="p-5 rounded-xl bg-primary text-white">
              <h4 className="font-bold mb-1">Base rate → trackers & SVR</h4>
              <p className="text-xs opacity-80">Moves your payment immediately. Good when rates are falling, painful when rising.</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-container-high border border-outline-variant">
              <h4 className="font-bold text-primary mb-1">Swap rates → fixed deals</h4>
              <p className="text-xs text-on-surface-variant">Set the price of new fixes. Watch them to time a remortgage.</p>
            </div>
          </div>
        </section>

        <section>
          <GuideHeading kicker="Equity">LTV bands and the cliff-edge effect</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Loan-to-value (LTV) is your loan as a percentage of the property value. Lenders price risk in discrete
            bands — typically 95%, 90%, 85%, 80%, 75% and 60%. These are <strong>cliff-edges</strong>, not smooth
            gradients: dropping from 80.1% to 79.9% can unlock a materially cheaper rate on the <em>entire</em>
            loan. A modest overpayment or a higher valuation that tips you into the next band down can produce an
            effective first-year return well into double digits. Below ~60% LTV the rate benefit largely flattens,
            so further overpayments are better weighed against pensions and ISAs.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Strategy">Overpaying vs investing</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Overpaying is mathematically equivalent to earning a <strong>guaranteed, tax-free return</strong> equal
            to your mortgage rate. At 4.7%, a higher-rate taxpayer would need to earn about 7.8% gross in a taxable
            account to match it. The trade-offs are liquidity (equity is hard to access) and early repayment
            charges — most fixed deals allow penalty-free overpayments of up to 10% of the balance per year, and
            exceeding that triggers an ERC (often 1–5% of the amount). Where expected after-tax investment returns
            beat the mortgage rate, tax-advantaged wrappers such as ISAs and pensions can win instead.
          </p>
          <Callout tone="warn" title="Check your ERC first">
            Before making a large overpayment during a fixed term, confirm your annual penalty-free allowance.
            Overshooting it can cost more than the interest you save.
          </Callout>
        </section>

        <section>
          <GuideHeading kicker="True cost">Fees, and the cost of the whole purchase</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            The headline rate isn&apos;t the full picture. Product/arrangement fees (often £999–£1,499), valuation
            and booking fees all add up — and if you <strong>add the fee to the loan</strong> rather than paying it
            upfront, you pay interest on it for the whole term. A lower rate with a big fee can be worse than a
            slightly higher rate with no fee on a smaller loan. Beyond the mortgage itself, budget for stamp duty,
            conveyancing, surveys and removals. Use the related tools below to total the real cost of buying.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Affordability">How lenders decide what you can borrow</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Most UK lenders cap borrowing at around <strong>4.5 times income</strong> (sometimes 5–5.5× for higher
            earners or specific schemes), then <strong>stress-test</strong> the payment at a notably higher rate to
            check you could still cope if rates rose. They also assess committed outgoings — childcare, loans, car
            finance and credit-card balances all reduce the maximum. That&apos;s why two people on the same salary
            can be offered very different amounts. To size your own ceiling, use the dedicated affordability tool.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Avoid these">Common mistakes</GuideHeading>
          <ul className="space-y-3 text-[15px] text-on-surface-variant">
            {[
              ['Drifting onto the SVR', 'Letting a fixed deal lapse can add hundreds a month overnight. Set a reminder 6 months before it ends and remortgage.'],
              ['Chasing the lowest rate only', 'A high arrangement fee can wipe out the saving. Compare the total cost over the deal period, not just the rate.'],
              ['Capitalising fees by default', 'Adding the fee to the loan means paying interest on it for 25 years. Pay upfront if you can.'],
              ['Over-extending the term', 'A longer term lowers the monthly payment but can hugely increase total interest. Use the shortest term you can afford.'],
              ['Ignoring the ERC', 'Overpaying above your annual allowance during a fix can incur a charge larger than the interest saved.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span><strong className="text-on-surface">{h}.</strong> {b}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <GuideHeading kicker="FAQ">Frequently asked questions</GuideHeading>
          <FAQ
            items={[
              { q: 'Is this calculator accurate to the penny?', a: 'It uses the standard annuity formula lenders apply, but real offers differ slightly due to daily-interest vs monthly-interest conventions, rounding, and the exact date of completion. Treat the output as a close estimate, not an offer.' },
              { q: 'Should I pick a 2-year or 5-year fix?', a: 'A 5-year fix gives certainty for longer and avoids remortgage fees sooner, but you may miss out if rates fall. A 2-year fix is cheaper to exit if you expect rates to drop or your circumstances to change. There is no universally right answer — it depends on your view of rates and your need for stability.' },
              { q: 'Does overpaying reduce my monthly payment or my term?', a: 'By default, overpaying keeps the payment the same and shortens the term (saving the most interest). Some lenders let you instead "recalculate" to lower the monthly payment over the original term. Ask which your lender applies.' },
              { q: 'What is a good interest rate right now?', a: 'Rates change constantly and depend heavily on your LTV, credit profile and the deal length. As a rule, the lower your LTV the better the rate. Always compare current whole-of-market deals rather than relying on a fixed figure.' },
              { q: 'Can I get a mortgage on interest-only?', a: 'For residential purchases, lenders require a credible repayment strategy and usually a low LTV. Interest-only is far more common for buy-to-let, where rent covers the interest and the property may be sold to repay capital.' },
            ]}
          />
        </section>

        <section>
          <GuideHeading kicker="Next steps">Related calculators</GuideHeading>
          <RelatedTools
            items={[
              { href: '/mortgage-affordability', label: 'Mortgage Affordability', hint: 'How much can you borrow?' },
              { href: '/stamp-duty-calculator', label: 'Stamp Duty (SDLT)', hint: 'Tax on your purchase' },
              { href: '/buy-to-let-calculator', label: 'Buy-to-Let / Landlord', hint: 'Yield, Section 24 & CGT' },
              { href: '/rental-yield-calculator', label: 'Rental Yield', hint: 'Gross & net yield + ICR' },
              { href: '/buy-vs-rent', label: 'Buy vs Rent', hint: 'Which wins over time?' },
              { href: '/category/property', label: 'All Property Tools', hint: 'The full hub' },
            ]}
          />
        </section>
      </div>
    </article>
  );
}
