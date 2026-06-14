'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Building } from 'lucide-react';
import {
  gbp, pct, Panel, AdvancedOptions, Stat, Field, MoneyInput, NumberInput, Slider,
  LineChart, GuideHeading, Callout, FAQ, RelatedTools, CalcButton, ResultsPlaceholder,
} from '../../components/calc-ui';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

export default function BuyVsRent() {
  const [done, setDone] = useState(false);

  const [price, setPrice] = useState(300000);
  const [deposit, setDeposit] = useState(45000);
  const [rate, setRate] = useState(4.7);
  const [termYears, setTermYears] = useState(25);
  const [rent, setRent] = useState(1300); // monthly
  const [years, setYears] = useState(15);

  const [hpi, setHpi] = useState(3);
  const [rentGrowth, setRentGrowth] = useState(3);
  const [invReturn, setInvReturn] = useState(5);

  const [buyCostPct, setBuyCostPct] = useState(3);
  const [sellCostPct, setSellCostPct] = useState(2);
  const [maintPct, setMaintPct] = useState(1);
  const [ownership, setOwnership] = useState(600); // insurance/service per year

  const r = useMemo(() => {
    const n = Math.max(1, Math.round(termYears * 12));
    const i = rate / 100 / 12;
    const loan = Math.max(0, price - deposit);
    const payment = i === 0 ? loan / n : (loan * i) / (1 - Math.pow(1 + i, -n));

    const upfront = deposit + price * (buyCostPct / 100);
    const mInv = Math.pow(1 + invReturn / 100, 1 / 12) - 1;

    let bal = loan;
    let value = price;
    let rentM = rent;
    let portfolio = upfront; // renter invests the same upfront capital
    const buyNW: number[] = [upfront >= 0 ? deposit : 0];
    const rentNW: number[] = [upfront];
    const labels: string[] = ['Now'];

    const horizon = Math.max(1, Math.round(years));
    for (let m = 1; m <= horizon * 12; m++) {
      // mortgage
      const interestM = bal * i;
      const principalM = Math.min(payment - interestM, bal);
      bal = Math.max(0, bal - principalM);
      // monthly costs
      value *= Math.pow(1 + hpi / 100, 1 / 12);
      const maintM = value * (maintPct / 100) / 12;
      const ownM = ownership / 12;
      const buyerOut = (bal > 0 || principalM > 0 ? payment : interestM) + maintM + ownM;
      // renter: same monthly budget as buyer, invests the difference vs rent
      portfolio *= 1 + mInv;
      portfolio += buyerOut - rentM;
      // grow rent annually
      if (m % 12 === 0) rentM *= 1 + rentGrowth / 100;

      if (m % 12 === 0) {
        const saleEquity = value * (1 - sellCostPct / 100) - bal;
        buyNW.push(saleEquity);
        rentNW.push(portfolio);
        labels.push(`Year ${m / 12}`);
      }
    }

    const finalBuy = buyNW[buyNW.length - 1];
    const finalRent = rentNW[rentNW.length - 1];
    const diff = finalBuy - finalRent;

    let crossover = -1;
    for (let k = 1; k < buyNW.length; k++) {
      if (buyNW[k] >= rentNW[k]) { crossover = k; break; }
    }

    return { payment, buyNW, rentNW, labels, finalBuy, finalRent, diff, crossover, monthlyBuy: payment };
  }, [price, deposit, rate, termYears, rent, years, hpi, rentGrowth, invReturn, buyCostPct, sellCostPct, maintPct, ownership]);

  const buyingWins = r.diff >= 0;

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <section className="container-page pt-10 pb-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/category/property" className="hover:text-primary">Property</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Buy vs Rent</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">Buy vs Rent Calculator</h1>
        <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Should you buy or keep renting? This compares the two fairly — same monthly budget for both — and tracks
          your <strong>net worth</strong> down each path over time, including house-price growth, the deposit you
          could invest instead, and the costs of buying and selling.
        </p>
      </section>

      <section className="container-page pb-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Panel title="Buying" icon={<Home className="h-4 w-4" />}>
            <div className="space-y-4">
              <Field label="Property price"><MoneyInput value={price} onChange={setPrice} step={5000} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Deposit" hint={`${pct(price ? (deposit / price) * 100 : 0)} of price`}><MoneyInput value={deposit} onChange={setDeposit} step={1000} /></Field>
                <Field label="Term (years)"><NumberInput value={termYears} onChange={setTermYears} suffix="yrs" /></Field>
              </div>
              <Field label={`Mortgage rate — ${pct(rate, 2)}`}><Slider value={rate} onChange={setRate} min={0.5} max={10} step={0.05} /></Field>
            </div>
          </Panel>

          <Panel title="Renting & horizon" icon={<Building className="h-4 w-4" />}>
            <div className="space-y-4">
              <Field label="Monthly rent"><MoneyInput value={rent} onChange={setRent} step={25} /></Field>
              <Field label={`Years to compare — ${years}`}><Slider value={years} onChange={setYears} min={1} max={30} step={1} /></Field>
            </div>
          </Panel>

          <AdvancedOptions label="Assumptions" hint="Growth rates and buying/selling costs — pre-filled with typical figures">
            <Field label={`House price growth — ${pct(hpi, 1)}/yr`}><Slider value={hpi} onChange={setHpi} min={-2} max={8} step={0.25} /></Field>
            <Field label={`Rent growth — ${pct(rentGrowth, 1)}/yr`}><Slider value={rentGrowth} onChange={setRentGrowth} min={0} max={8} step={0.25} /></Field>
            <Field label={`Investment return (if renting) — ${pct(invReturn, 1)}/yr`} hint="What the renter earns investing the deposit + monthly savings"><Slider value={invReturn} onChange={setInvReturn} min={0} max={10} step={0.25} /></Field>
            <div className="pt-2 border-t border-outline-variant space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Buying costs — ${buyCostPct}%`} hint="SDLT + legal + survey"><Slider value={buyCostPct} onChange={setBuyCostPct} min={0} max={10} step={0.5} /></Field>
                <Field label={`Selling costs — ${sellCostPct}%`} hint="Agent + legal"><Slider value={sellCostPct} onChange={setSellCostPct} min={0} max={5} step={0.5} /></Field>
              </div>
              <Field label={`Maintenance — ${maintPct}% of value/yr`}><Slider value={maintPct} onChange={setMaintPct} min={0} max={3} step={0.25} /></Field>
              <Field label="Insurance & service charge / yr"><MoneyInput value={ownership} onChange={setOwnership} step={100} /></Field>
            </div>
          </AdvancedOptions>
          <CalcButton done={done} onClick={() => setDone(true)} />
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 self-start scroll-mt-20">
          {done ? (<>
          <div className={`p-5 rounded-2xl border ${buyingWins ? 'bg-primary text-white border-primary' : 'bg-secondary-soft/40 border-secondary/20'}`}>
            <div className="text-xs uppercase tracking-wider font-bold opacity-80">After {years} years</div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold mt-1">
              {buyingWins ? 'Buying' : 'Renting'} leaves you {gbp(Math.abs(r.diff))} better off
            </div>
            <div className={`text-sm mt-1 ${buyingWins ? 'opacity-80' : 'text-on-surface-variant'}`}>
              {r.crossover > 0
                ? `Buying overtakes renting around year ${r.crossover}.`
                : 'Renting stays ahead over the whole period at these assumptions.'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label={`Net worth if you BUY`} value={gbp(r.finalBuy)} sub="sale equity, net of costs" tone="primary" />
            <Stat label={`Net worth if you RENT`} value={gbp(r.finalRent)} sub="invested deposit + savings" tone="accent" />
          </div>

          <Panel title="Net worth over time">
            <LineChart
              height={220}
              labels={r.labels}
              format={(v) => gbp(v)}
              series={[
                { points: r.buyNW, color: PRIMARY, label: 'Buy (home equity)' },
                { points: r.rentNW, color: ACCENT, label: 'Rent (investments)', dashed: true },
              ]}
            />
            <p className="mt-2 text-xs text-on-surface-variant">
              Both paths assume the same monthly housing budget. The renter invests the deposit plus any month where
              renting is cheaper than owning; the buyer&apos;s wealth is their sale equity net of selling costs.
            </p>
          </Panel>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Your mortgage payment" value={gbp(r.monthlyBuy, 0)} sub="per month" />
            <Stat label="Starting rent" value={gbp(rent, 0)} sub={`+${pct(rentGrowth, 1)}/yr`} />
          </div>

          <p className="text-[11px] text-on-surface-variant">
            A model, not a prediction. Results are highly sensitive to house-price growth and investment-return
            assumptions, which no one can know in advance. Treat it as a way to test scenarios, not a forecast.
          </p>
          </>) : <ResultsPlaceholder />}
        </div>
      </section>

      <BuyVsRentGuide />
    </div>
  );
}

/* ════════════════════════════ guide ════════════════════════════ */

function BuyVsRentGuide() {
  return (
    <article className="container-page pb-24 border-t border-outline-variant pt-14 max-w-3xl">
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">Complete guide</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mt-1">Buy vs rent: the real maths</h2>
        <p className="mt-3 text-on-surface-variant leading-relaxed">
          &quot;Renting is dead money&quot; is one of the most repeated — and most misleading — lines in UK personal
          finance. The honest answer depends on house-price growth, investment returns, how long you stay and the
          often-ignored costs of buying and selling. This guide explains how to compare the two fairly.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <GuideHeading kicker="The principle">Why a fair comparison uses net worth, not rent vs mortgage</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Comparing a monthly rent to a monthly mortgage payment is the classic mistake. Part of a mortgage payment
            buys you equity — it&apos;s saving, not spending — while a renter who pays less each month can invest the
            difference. A fair comparison gives both people the <strong>same monthly housing budget</strong> and asks
            a single question: after X years, who has the greater <strong>net worth</strong>? The buyer&apos;s wealth
            is the equity they&apos;d walk away with if they sold; the renter&apos;s is their investment pot from the
            deposit they never tied up, plus any monthly savings.
          </p>
          <Callout tone="info" title="The two levers that decide it">
            The result hinges on two unknowables: how fast house prices grow, and what return the renter earns on
            their investments. Small changes to either flip the answer — which is why the sliders above matter more
            than any single &quot;rule&quot;.
          </Callout>
        </section>

        <section>
          <GuideHeading kicker="Buying">The costs of owning that nobody mentions</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Buyers focus on the deposit and forget the rest. <strong>Upfront</strong>: stamp duty, legal fees,
            survey, mortgage arrangement fees and removals — often 3–5% of the price. <strong>Ongoing</strong>:
            maintenance (budget around 1% of the value a year), buildings insurance, service charges and ground rent
            on leaseholds, and the interest portion of the mortgage, which is itself &quot;dead money&quot; in the
            same way rent is. <strong>On exit</strong>: estate-agent and legal fees of roughly 1.5–2.5% when you
            sell. These frictions are why buying rarely wins over short horizons.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Renting">The renter&apos;s hidden advantage — and its catch</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            A renter keeps the deposit liquid and can invest it. Over decades, a diversified portfolio has
            historically returned more than house prices in many periods — so the &quot;opportunity cost&quot; of
            locking a deposit into bricks is real. The catch is discipline: the maths only works if the renter
            <em> actually invests</em> the deposit and the monthly savings, rather than spending them. Renting also
            offers flexibility (no selling costs to move) but no protection against rising rents, which a fixed
            mortgage gives a buyer.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Leverage">Why buying can win big — the leverage effect</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            A mortgage is leverage. With a 15% deposit you control an asset worth roughly 6.7 times your cash, and
            any house-price growth applies to the <strong>whole</strong> value, not just your deposit. If a £300,000
            home rises 3% a year, that&apos;s £9,000 of growth on a £45,000 deposit — a 20% return on your cash in
            year one, before costs. This leverage is what lets buyers overtake renters once enough time has passed
            for growth to outweigh the upfront and selling frictions.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Time">The break-even horizon</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Because buying carries heavy upfront and exit costs, it almost always loses over short periods and tends
            to win over long ones. The <strong>crossover year</strong> — when the buyer&apos;s net worth overtakes
            the renter&apos;s — is the single most useful output above. As a rough guide, with moderate growth
            assumptions, buying often breaks even somewhere between years 5 and 10; faster house-price growth or
            lower investment returns pull that forward, and the reverse pushes it back. If you expect to move within
            a few years, renting frequently wins on the numbers alone.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Worked example">£300,000 home, 15% deposit, 15 years</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            With a £45,000 deposit, a 4.7% mortgage over 25 years, 3% house-price growth, 3% rent growth and a 5%
            investment return, buying typically falls behind for the first few years while upfront costs drag, then
            overtakes renting once equity and growth compound — often pulling clearly ahead by year 15. Drop
            house-price growth to 1% or lift investment returns to 7%, and renting can stay ahead the whole time. The
            point isn&apos;t a single answer; it&apos;s to see how sensitive the outcome is to assumptions you
            control.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Beyond money">What the calculator can&apos;t price</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Numbers don&apos;t capture everything. Owning brings security of tenure, freedom to decorate and a fixed
            housing cost in retirement; renting brings flexibility, no maintenance liability and no exposure to a
            single illiquid asset. Many people will pay a financial premium for the certainty of owning — and
            that&apos;s a perfectly rational choice. Use the maths to understand the trade-off, not to override what
            matters to you.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Avoid these">Common mistakes</GuideHeading>
          <ul className="space-y-3 text-[15px] text-on-surface-variant">
            {[
              ['Comparing rent to the mortgage payment', 'Ignores equity built by the buyer and savings invested by the renter. Compare net worth instead.'],
              ['Forgetting buying and selling costs', 'Stamp duty, legal fees and agent fees can total 5–7% round-trip and crush short-term buying.'],
              ['Assuming house prices only rise', 'Prices fall in some periods. Test a low- or negative-growth scenario before committing.'],
              ['Not actually investing as a renter', 'The renting case only wins if the deposit and monthly savings are genuinely invested, not spent.'],
              ['Ignoring how long you&apos;ll stay', 'If you might move within a few years, the exit costs of buying usually make renting cheaper.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}.</strong> {b}</span></li>
            ))}
          </ul>
        </section>

        <section>
          <GuideHeading kicker="FAQ">Frequently asked questions</GuideHeading>
          <FAQ items={[
            { q: 'Is renting really dead money?', a: 'Not necessarily. Rent buys you a place to live with flexibility and no maintenance liability, and a disciplined renter can invest the deposit for a return that sometimes beats house-price growth. The interest portion of a mortgage is "dead" in exactly the same way rent is.' },
            { q: 'How long do I need to stay for buying to pay off?', a: 'It depends on costs and growth, but with moderate assumptions buying often breaks even somewhere between 5 and 10 years. Shorter stays usually favour renting because of the upfront and selling costs.' },
            { q: 'What house-price growth should I assume?', a: 'No one knows. UK house prices have grown around 3–4% a year on average over the long run, but with long flat or falling periods. Test a range — including 0% and negative — to see how robust your decision is.' },
            { q: 'Does this account for stamp duty?', a: 'Yes, via the buying-costs percentage in Expert mode (a default of around 3% covers SDLT plus legal and survey fees for a typical purchase). Use the dedicated Stamp Duty calculator for an exact figure.' },
            { q: 'What if rents rise faster than expected?', a: 'Faster rent growth favours buying, because a repayment mortgage fixes most of your housing cost while a renter faces rising payments. Increase the rent-growth slider to see the effect.' },
          ]} />
        </section>

        <section>
          <GuideHeading kicker="Next steps">Related calculators</GuideHeading>
          <RelatedTools items={[
            { href: '/mortgage-affordability', label: 'Mortgage Affordability', hint: 'How much can you borrow?' },
            { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Monthly repayments' },
            { href: '/stamp-duty-calculator', label: 'Stamp Duty (SDLT)', hint: 'Cost of buying' },
            { href: '/rental-yield-calculator', label: 'Rental Yield', hint: 'If you let instead' },
            { href: '/buy-to-let-calculator', label: 'Buy-to-Let / Landlord', hint: 'Investing in property' },
            { href: '/category/property', label: 'All Property Tools', hint: 'The full hub' },
          ]} />
        </section>
      </div>
    </article>
  );
}
