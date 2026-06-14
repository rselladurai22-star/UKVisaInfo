'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Users, Gauge } from 'lucide-react';
import {
  gbp, pct, Panel, AdvancedOptions, Stat, Field, MoneyInput, NumberInput, Slider,
  BarTrack, Donut, GuideHeading, Callout, FAQ, RelatedTools, CalcButton, ResultsPlaceholder,
} from '../../components/calc-ui';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const annuityFactor = (i: number, n: number) => (i === 0 ? n : (1 - Math.pow(1 + i, -n)) / i);

export default function MortgageAffordability() {
  const [done, setDone] = useState(false);

  const [income1, setIncome1] = useState(45000);
  const [income2, setIncome2] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [deposit, setDeposit] = useState(40000);
  const [commitments, setCommitments] = useState(250); // monthly
  const [termYears, setTermYears] = useState(30);
  const [rate, setRate] = useState(4.7);
  const [stressUplift, setStressUplift] = useState(1); // % above product rate
  const [multiple, setMultiple] = useState(4.5);

  const r = useMemo(() => {
    const gross = income1 + income2 + otherIncome;
    const n = Math.max(1, Math.round(termYears * 12));
    const i = rate / 100 / 12;
    const stressRate = (rate + stressUplift) / 100 / 12;

    const ltiCap = gross * multiple;

    // Commitments consume borrowing capacity equal to the loan that monthly cost could service.
    const af = annuityFactor(stressRate, n);
    const commitmentCapacity = commitments * af;

    const maxBorrow = Math.max(0, ltiCap - commitmentCapacity);
    const maxPrice = maxBorrow + deposit;
    const ltv = maxPrice > 0 ? (maxBorrow / maxPrice) * 100 : 0;
    const depositPctOfPrice = maxPrice > 0 ? (deposit / maxPrice) * 100 : 0;

    const payAt = (loan: number, mr: number) => loan / annuityFactor(mr, n);
    const monthly = payAt(maxBorrow, i);
    const stressMonthly = payAt(maxBorrow, stressRate);

    const grossMonthly = gross / 12;
    const dti = grossMonthly > 0 ? (monthly / grossMonthly) * 100 : 0;

    const scenarios = [4.0, 4.5, 5.0, 5.5].map((m) => {
      const borrow = Math.max(0, gross * m - commitmentCapacity);
      return { m, borrow, price: borrow + deposit, monthly: payAt(borrow, i) };
    });

    return { gross, maxBorrow, maxPrice, ltv, depositPctOfPrice, monthly, stressMonthly, dti, scenarios, grossMonthly };
  }, [income1, income2, otherIncome, deposit, commitments, termYears, rate, stressUplift, multiple]);

  const dtiTone = r.dti <= 35 ? '#0a7d4f' : r.dti <= 45 ? ACCENT : '#ba1a1a';

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <section className="container-page pt-10 pb-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/category/property" className="hover:text-primary">Property</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Mortgage Affordability</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">How Much Can I Borrow?</h1>
        <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Estimate your maximum mortgage and property budget the way UK lenders do — income multiples
          tempered by your committed outgoings and an affordability stress test. Updated for 2025/26 lending rules.
        </p>
      </section>

      <section className="container-page pb-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Panel title="Your income" icon={<Users className="h-4 w-4" />}>
            <div className="space-y-4">
              <Field label="Annual income (applicant 1)" hint="Gross, before tax">
                <MoneyInput value={income1} onChange={setIncome1} step={1000} />
              </Field>
              <Field label="Deposit">
                <MoneyInput value={deposit} onChange={setDeposit} step={1000} />
              </Field>
            </div>
          </Panel>

          <AdvancedOptions label="Second income, outgoings & terms" hint="Add a joint applicant, commitments and lending assumptions — pre-filled with typical values">
            <Field label="Annual income (applicant 2)">
              <MoneyInput value={income2} onChange={setIncome2} step={1000} />
            </Field>
            <Field label="Other annual income" hint="Bonus, commission, benefits (lenders often count part)">
              <MoneyInput value={otherIncome} onChange={setOtherIncome} step={500} />
            </Field>
            <Field label="Monthly credit commitments" hint="Loans, car finance, credit cards, childcare">
              <MoneyInput value={commitments} onChange={setCommitments} step={50} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Term (years)">
                <NumberInput value={termYears} onChange={setTermYears} suffix="yrs" />
              </Field>
              <Field label={`Rate — ${pct(rate, 2)}`}>
                <Slider value={rate} onChange={setRate} min={0.5} max={10} step={0.05} />
              </Field>
            </div>
            <Field label={`Income multiple — ${multiple.toFixed(1)}×`} hint="Most lenders cap at 4.5×; some allow 5–5.5×">
              <Slider value={multiple} onChange={setMultiple} min={3.5} max={5.5} step={0.1} />
            </Field>
            <Field label={`Stress test uplift — +${stressUplift}%`} hint="Lenders test the payment at a higher rate">
              <Slider value={stressUplift} onChange={setStressUplift} min={0} max={3} step={0.5} />
            </Field>
          </AdvancedOptions>
          <CalcButton done={done} onClick={() => setDone(true)} />
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 self-start scroll-mt-20">
          {done ? (<>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Max property price" value={gbp(r.maxPrice)} sub={`${pct(r.depositPctOfPrice)} deposit`} tone="dark" big />
            <Stat label="Max borrowing" value={gbp(r.maxBorrow)} sub={`${pct(r.ltv)} LTV`} />
            <Stat label="Indicative payment" value={gbp(r.monthly, 0)} sub="per month" tone="accent" />
          </div>

          <Panel title="Budget breakdown" icon={<Gauge className="h-4 w-4" />}>
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
              <Donut
                centerLabel="Property budget"
                centerValue={gbp(r.maxPrice)}
                segments={[
                  { value: r.maxBorrow, color: PRIMARY, label: 'Mortgage' },
                  { value: deposit, color: ACCENT, label: 'Your deposit' },
                ]}
              />
              <div className="flex-1 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Mortgage</span><span className="font-semibold tabular-nums">{gbp(r.maxBorrow)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Deposit</span><span className="font-semibold tabular-nums">{gbp(deposit)}</span></div>
                <BarTrack segments={[{ value: r.maxBorrow, color: PRIMARY }, { value: deposit, color: ACCENT }]} />
                <div className="flex justify-between pt-1 border-t border-outline-variant"><span className="text-on-surface-variant">Total budget</span><span className="font-bold tabular-nums">{gbp(r.maxPrice)}</span></div>
              </div>
            </div>
          </Panel>

          <Panel title="Affordability check">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-on-surface-variant">Mortgage as % of gross income</span>
                <span className="font-bold tabular-nums" style={{ color: dtiTone }}>{pct(r.dti)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, r.dti)}%`, background: dtiTone }} />
              </div>
              <p className="mt-2 text-xs text-on-surface-variant">
                Under 35% is comfortable; 35–45% is typical; above 45% lenders may decline. Your stress-tested payment
                (rate +{stressUplift}%) is <strong>{gbp(r.stressMonthly, 0)}/mo</strong>.
              </p>
            </Panel>

          <Panel title="Income-multiple scenarios">
              <div className="overflow-hidden rounded-lg border border-outline-variant">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-low text-left">
                    <tr><th className="px-3 py-2 font-bold">Multiple</th><th className="px-3 py-2 font-bold text-right">Borrow</th><th className="px-3 py-2 font-bold text-right">Price</th><th className="px-3 py-2 font-bold text-right">Monthly</th></tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {r.scenarios.map((s) => (
                      <tr key={s.m} className={Math.abs(s.m - multiple) < 0.05 ? 'bg-primary-soft/15' : ''}>
                        <td className="px-3 py-2 font-semibold">{s.m.toFixed(1)}×</td>
                        <td className="px-3 py-2 text-right tabular-nums">{gbp(s.borrow)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{gbp(s.price)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-on-surface-variant">{gbp(s.monthly, 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

          <p className="text-[11px] text-on-surface-variant">
            An estimate, not a mortgage offer or a guarantee of lending. Each lender scores income, credit history,
            employment type and outgoings differently. A broker can match you to the most generous lender for your profile.
          </p>
          </>) : <ResultsPlaceholder />}
        </div>
      </section>

      <AffordabilityGuide />
    </div>
  );
}

/* ════════════════════════════ guide ════════════════════════════ */

function AffordabilityGuide() {
  return (
    <article className="container-page pb-24 border-t border-outline-variant pt-14 max-w-3xl">
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">Complete guide</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mt-1">How much can you really borrow?</h2>
        <p className="mt-3 text-on-surface-variant leading-relaxed">
          &quot;Affordability&quot; is the single biggest factor in whether your offer gets accepted. UK lenders no
          longer just multiply your salary — they model your whole financial life. This guide explains exactly how
          the assessment works in 2025/26, what moves the number, and how to maximise it.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <GuideHeading kicker="The basics">Income multiples — the starting point</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Most lenders cap borrowing at a <strong>loan-to-income (LTI) multiple</strong> — typically around
            <strong> 4.5 times</strong> your gross annual income, occasionally 5 to 5.5 times for higher earners,
            professionals or specific schemes. On a £45,000 income, 4.5× gives a £202,500 ceiling. With a joint
            application the incomes are combined, which is why two average salaries often out-borrow one large one.
            Lenders are also limited by regulation in how many loans they can write above 4.5× LTI, so that band can
            tighten late in the year.
          </p>
          <Callout tone="info" title="LTI is a cap, not a promise">
            Hitting 4.5× requires the rest of your profile to support it. Commitments, credit history and the stress
            test can all pull the realistic figure below the headline multiple.
          </Callout>
        </section>

        <section>
          <GuideHeading kicker="The reality">Affordability modelling and committed outgoings</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Since the post-2014 mortgage rules, lenders run a detailed <strong>affordability assessment</strong>:
            net income minus committed and essential expenditure must comfortably cover the mortgage. Car finance,
            personal loans, credit-card balances, childcare and school fees all reduce your capacity. As a rule of
            thumb, every £100/month of commitment can cut your maximum borrowing by several thousand pounds, because
            that £100 could otherwise have serviced part of a larger loan. Clearing or reducing short-term debt
            before you apply is often the fastest way to lift your budget.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Risk">The stress test</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Lenders check you could still afford the mortgage if rates rose. Until 2022 the Bank of England required
            a stress of roughly 3% above the reversion rate; that specific rule was withdrawn, but lenders still
            apply their own stress (commonly +1% to +3%, or a floor rate). The calculator above lets you set the
            uplift to see how a higher rate squeezes affordability. A payment that looks fine today but fails at a
            stressed rate is exactly what the test is designed to catch.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Income">What actually counts as income</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Basic salary is counted in full. Variable pay is treated cautiously: many lenders count only 50–100% of
            a regular bonus, overtime or commission, and want a track record (often two years). The self-employed are
            usually assessed on the average of the last two to three years&apos; profits or salary-plus-dividends.
            Benefits such as Child Benefit and tax credits may be partially counted. Because policies vary widely, two
            lenders can offer very different amounts on identical paperwork — which is where a broker earns their fee.
          </p>
          <div className="my-5 overflow-hidden rounded-xl border border-outline-variant">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low text-left"><tr><th className="px-4 py-3 font-bold">Income type</th><th className="px-4 py-3 font-bold">Typical treatment</th></tr></thead>
              <tbody className="divide-y divide-outline-variant/60">
                <tr><td className="px-4 py-3">Basic salary</td><td className="px-4 py-3">100%</td></tr>
                <tr><td className="px-4 py-3">Regular bonus / commission</td><td className="px-4 py-3">50–100%, with history</td></tr>
                <tr><td className="px-4 py-3">Overtime / shift allowance</td><td className="px-4 py-3">50–100%</td></tr>
                <tr><td className="px-4 py-3">Self-employed profit</td><td className="px-4 py-3">2–3 year average</td></tr>
                <tr><td className="px-4 py-3">Benefits (e.g. Child Benefit)</td><td className="px-4 py-3">Often partially counted</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <GuideHeading kicker="Deposit">Deposit, LTV and the rate you&apos;ll get</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Your deposit sets your loan-to-value (LTV), and LTV largely sets your interest rate. The bands matter:
            crossing from 90% to 85%, or 80% to 75%, can unlock a noticeably cheaper rate, which in turn improves
            affordability. A bigger deposit therefore helps twice — it reduces the loan and lowers the rate on it.
            Below 60% LTV the rate benefit flattens. Don&apos;t forget the deposit isn&apos;t your only upfront cost:
            stamp duty, legal fees and surveys all need separate cash.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Worked example">A couple earning £70,000 combined</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Two applicants earning £45,000 and £25,000 have a combined income of £70,000. At 4.5× that&apos;s a
            £315,000 LTI ceiling. With £350/month of car finance and credit commitments, affordability modelling
            trims roughly £55,000 of capacity, bringing the realistic maximum loan to around £260,000. Adding a
            £40,000 deposit gives a property budget near £300,000 at about 87% LTV. Pay off the car finance first and
            the budget can jump by tens of thousands — the calculator above shows the effect instantly.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Boost it">How to increase what you can borrow</GuideHeading>
          <ul className="space-y-3 text-[15px] text-on-surface-variant">
            {[
              ['Clear short-term debt', 'Paying off loans and card balances frees up affordability quickly — often more than a small pay rise would.'],
              ['Extend the term', 'A longer term lowers the monthly payment and can raise the maximum loan — at the cost of more total interest.'],
              ['Add a co-applicant', 'A second income (or a joint-borrower-sole-proprietor arrangement) can lift the ceiling substantially.'],
              ['Grow the deposit', 'A larger deposit cuts LTV, unlocks a cheaper rate and improves affordability.'],
              ['Use a broker', 'Lender policies differ enormously on bonuses, self-employment and multiples. A broker finds the most generous fit.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}.</strong> {b}</span></li>
            ))}
          </ul>
        </section>

        <section>
          <GuideHeading kicker="Avoid these">Common mistakes</GuideHeading>
          <ul className="space-y-3 text-[15px] text-on-surface-variant">
            {[
              ['Confusing a multiple with an offer', 'A 4.5× figure is a ceiling. Affordability, credit and the stress test decide the real number.'],
              ['Forgetting upfront costs', 'Your deposit, stamp duty, legal fees and survey are separate cash needs — don&apos;t spend it all on the deposit.'],
              ['Applying with avoidable debt', 'Even unused credit-card limits and recent searches can dent affordability. Tidy your file first.'],
              ['Maxing out the budget', 'Borrowing the absolute maximum leaves no room for rate rises or life changes. Build in headroom.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}.</strong> {b}</span></li>
            ))}
          </ul>
        </section>

        <section>
          <GuideHeading kicker="FAQ">Frequently asked questions</GuideHeading>
          <FAQ items={[
            { q: 'How many times my salary can I borrow?', a: 'Around 4.5 times income is the common cap, though some lenders go to 5–5.5× for higher earners or certain professions. The exact figure depends on your outgoings, credit profile and the lender.' },
            { q: 'Does a joint application let us borrow more?', a: 'Usually yes — most lenders combine both incomes (subject to the same multiple and affordability tests), so two incomes typically support a larger loan than one.' },
            { q: 'Will my student loan reduce how much I can borrow?', a: 'Student-loan repayments reduce your net income and so can slightly lower affordability, but they are treated more leniently than consumer debt because they stop if income falls.' },
            { q: 'Can I get a mortgage if I am self-employed?', a: 'Yes. Lenders typically average your last two to three years of accounts or SA302s. A longer trading history and steady or rising profits help. A broker who specialises in self-employed cases can widen your options.' },
            { q: 'Is this the same as a Decision in Principle?', a: 'No. This is an estimate. A Decision (or Agreement) in Principle is a soft-checked indication from a specific lender, and a full application with documents is the only way to confirm what you can borrow.' },
          ]} />
        </section>

        <section>
          <GuideHeading kicker="Next steps">Related calculators</GuideHeading>
          <RelatedTools items={[
            { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Monthly repayments & interest' },
            { href: '/stamp-duty-calculator', label: 'Stamp Duty (SDLT)', hint: 'Tax on your purchase' },
            { href: '/buy-vs-rent', label: 'Buy vs Rent', hint: 'Which wins over time?' },
            { href: '/buy-to-let-calculator', label: 'Buy-to-Let / Landlord', hint: 'Yield, Section 24 & CGT' },
            { href: '/rental-yield-calculator', label: 'Rental Yield', hint: 'Gross & net yield' },
            { href: '/category/property', label: 'All Property Tools', hint: 'The full hub' },
          ]} />
        </section>
      </div>
    </article>
  );
}
