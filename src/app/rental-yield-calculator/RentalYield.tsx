'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Receipt, Gauge, ShieldCheck } from 'lucide-react';
import {
  gbp, pct, Panel, Segmented, Stat, Field, MoneyInput, Slider, Choice,
  Donut, GuideHeading, Callout, FAQ, RelatedTools, CalcButton, ResultsPlaceholder,
} from '../../components/calc-ui';

type Mode = 'simple' | 'advanced' | 'expert';
type Band = 'basic' | 'higher' | 'additional';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const BAND_RATE: Record<Band, number> = { basic: 0.2, higher: 0.4, additional: 0.45 };
const STRESS = 0.055;

export default function RentalYield() {
  const [mode, setMode] = useState<Mode>('advanced');
  const [done, setDone] = useState(false);

  const [price, setPrice] = useState(220000);
  const [rent, setRent] = useState(1150); // monthly
  const [depositPct, setDepositPct] = useState(25);
  const [mortRate, setMortRate] = useState(5.2);
  const [mgmtPct, setMgmtPct] = useState(10);
  const [maintPct, setMaintPct] = useState(8);
  const [voidPct, setVoidPct] = useState(5);
  const [insurance, setInsurance] = useState(350);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [band, setBand] = useState<Band>('higher');

  const r = useMemo(() => {
    const annualRent = rent * 12;
    const loan = price * (1 - depositPct / 100);
    const deposit = price * (depositPct / 100);
    const interest = loan * (mortRate / 100); // interest-only basis (typical BTL)

    const mgmt = annualRent * (mgmtPct / 100);
    const maint = annualRent * (maintPct / 100);
    const voids = annualRent * (voidPct / 100);
    const opCosts = mode === 'simple' ? annualRent * 0.25 : mgmt + maint + voids + insurance + serviceCharge;

    const grossYield = price ? (annualRent / price) * 100 : 0;
    const netYield = price ? ((annualRent - opCosts) / price) * 100 : 0;

    const cashflowPreTax = annualRent - opCosts - (mode === 'simple' ? 0 : interest);

    // Section 24: interest not deductible for individuals; 20% credit.
    const taxable = Math.max(0, annualRent - opCosts);
    const tax = Math.max(0, taxable * BAND_RATE[band] - interest * 0.2);
    const cashflowPostTax = cashflowPreTax - tax;

    const cashInvested = deposit + price * 0.05;
    const roi = cashInvested ? (cashflowPostTax / cashInvested) * 100 : 0;

    const icr = interest > 0 ? (annualRent / (loan * STRESS)) * 100 : Infinity;
    const icrRequired = band === 'basic' ? 125 : 145;
    const icrPass = icr >= icrRequired;

    return {
      annualRent, opCosts, mgmt, maint, voids, interest, grossYield, netYield,
      cashflowPreTax, cashflowPostTax, tax, roi, icr, icrRequired, icrPass, deposit,
    };
  }, [price, rent, depositPct, mortRate, mgmtPct, maintPct, voidPct, insurance, serviceCharge, band, mode]);

  const yieldTone = r.netYield >= 5 ? '#0a7d4f' : r.netYield >= 3.5 ? ACCENT : '#ba1a1a';

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <section className="container-page pt-10 pb-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <Link href="/category/property" className="hover:text-primary">Property</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
          <span className="text-primary font-bold">Rental Yield</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">Rental Yield Calculator</h1>
        <p className="mt-3 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Work out gross and net rental yield, monthly cash flow and return on investment — and check whether a
          buy-to-let passes the lender&apos;s ICR stress test before you commit. Includes the Section 24 tax impact
          for individual landlords.
        </p>
        <div className="mt-5">
          <Segmented<Mode> ariaLabel="Detail level" value={mode} onChange={setMode}
            options={[{ value: 'simple', label: 'Simple' }, { value: 'advanced', label: 'Advanced' }, { value: 'expert', label: 'Expert' }]} />
        </div>
      </section>

      <section className="container-page pb-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Panel title="Property & rent" icon={<Home className="h-4 w-4" />}>
            <div className="space-y-4">
              <Field label="Purchase price">
                <MoneyInput value={price} onChange={setPrice} step={5000} />
              </Field>
              <Field label="Monthly rent">
                <MoneyInput value={rent} onChange={setRent} step={25} />
              </Field>
              {mode !== 'simple' && (
                <>
                  <Field label={`Deposit — ${depositPct}%`}>
                    <Slider value={depositPct} onChange={setDepositPct} min={5} max={100} step={1} />
                  </Field>
                  <Field label={`Mortgage rate — ${pct(mortRate, 2)}`} hint="Interest-only basis (typical for BTL)">
                    <Slider value={mortRate} onChange={setMortRate} min={0} max={10} step={0.05} />
                  </Field>
                </>
              )}
            </div>
          </Panel>

          {mode !== 'simple' && (
            <Panel title="Running costs" icon={<Receipt className="h-4 w-4" />}>
              <div className="space-y-4">
                <Field label={`Letting / management — ${mgmtPct}% of rent`}>
                  <Slider value={mgmtPct} onChange={setMgmtPct} min={0} max={20} step={1} />
                </Field>
                <Field label={`Maintenance reserve — ${maintPct}% of rent`}>
                  <Slider value={maintPct} onChange={setMaintPct} min={0} max={20} step={1} />
                </Field>
                <Field label={`Void allowance — ${voidPct}% of rent`} hint="Weeks empty between tenants">
                  <Slider value={voidPct} onChange={setVoidPct} min={0} max={20} step={1} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Insurance / yr">
                    <MoneyInput value={insurance} onChange={setInsurance} step={50} />
                  </Field>
                  <Field label="Service charge / yr">
                    <MoneyInput value={serviceCharge} onChange={setServiceCharge} step={100} />
                  </Field>
                </div>
                {mode === 'expert' && (
                  <Field label="Your income tax band">
                    <Choice<Band> name="band" value={band} onChange={setBand}
                      options={[
                        { value: 'basic', label: 'Basic rate (20%)' },
                        { value: 'higher', label: 'Higher rate (40%)' },
                        { value: 'additional', label: 'Additional rate (45%)' },
                      ]} />
                  </Field>
                )}
              </div>
            </Panel>
          )}
          <CalcButton done={done} onClick={() => setDone(true)} />
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 self-start scroll-mt-20">
          {done ? (<>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Gross yield" value={pct(r.grossYield, 2)} sub="rent ÷ price" tone="dark" />
            <Stat label="Net yield" value={pct(r.netYield, 2)} sub="after costs" tone="accent" />
            <Stat label="Monthly cash flow" value={gbp((mode === 'expert' ? r.cashflowPostTax : r.cashflowPreTax) / 12, 0)} sub={mode === 'expert' ? 'after tax' : 'before tax'} />
            {mode !== 'simple' && <Stat label="Cash-on-cash ROI" value={pct(r.roi, 1)} sub="on cash invested" />}
          </div>

          <Panel title="Yield health" icon={<Gauge className="h-4 w-4" />}>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-on-surface-variant">Net yield</span>
              <span className="font-bold tabular-nums" style={{ color: yieldTone }}>{pct(r.netYield, 2)}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (r.netYield / 8) * 100)}%`, background: yieldTone }} />
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">
              Under 3.5% net is thin once voids and rate rises bite; 5%+ net is generally considered healthy.
              The UK average gross yield is roughly 5–6%, higher in the North, lower in London and the South East.
            </p>
          </Panel>

          {mode !== 'simple' && (
            <Panel title="Where the rent goes">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                <Donut
                  centerLabel="Annual rent"
                  centerValue={gbp(r.annualRent)}
                  segments={[
                    { value: Math.max(0, r.cashflowPreTax), color: '#0a7d4f', label: 'Your cash flow' },
                    { value: r.interest, color: PRIMARY, label: 'Mortgage interest' },
                    { value: r.opCosts, color: ACCENT, label: 'Running costs' },
                  ]}
                />
                <div className="flex-1 space-y-2 text-sm">
                  <Row label="Annual rent" value={gbp(r.annualRent)} bold />
                  <Row label="Less running costs" value={`− ${gbp(r.opCosts)}`} />
                  <Row label="Less mortgage interest" value={`− ${gbp(r.interest)}`} />
                  {mode === 'expert' && <Row label="Less Section 24 tax" value={`− ${gbp(r.tax)}`} />}
                  <div className="pt-2 border-t border-outline-variant">
                    <Row label="Net cash flow" value={gbp(mode === 'expert' ? r.cashflowPostTax : r.cashflowPreTax)} bold accent />
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {mode !== 'simple' && (
            <Panel title="Lender ICR stress test" icon={<ShieldCheck className="h-4 w-4" />}>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-3 rounded-xl font-display font-bold text-lg ${r.icrPass ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {isFinite(r.icr) ? pct(r.icr, 0) : '—'} ICR
                </div>
                <div className="text-sm">
                  <div className={`font-bold ${r.icrPass ? 'text-green-700' : 'text-red-700'}`}>{r.icrPass ? 'Likely to pass' : 'Likely to fail'}</div>
                  <div className="text-on-surface-variant text-xs">Needs ≥ {r.icrRequired}% at a {pct(STRESS * 100, 1)} stress rate ({band === 'basic' ? 'basic' : 'higher'}-rate landlord).</div>
                </div>
              </div>
            </Panel>
          )}

          <p className="text-[11px] text-on-surface-variant">
            Estimates only, not tax or investment advice. Section 24 figures assume an individual landlord on an
            interest-only mortgage and exclude other income, allowances and SPV ownership. Verify with an accountant.
          </p>
          </>) : <ResultsPlaceholder />}
        </div>
      </section>

      <RentalYieldGuide />
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-on-surface-variant">{label}</span>
      <span className={`tabular-nums ${bold ? 'font-bold' : ''} ${accent ? 'text-secondary' : 'text-on-surface'}`}>{value}</span>
    </div>
  );
}

/* ════════════════════════════ guide ════════════════════════════ */

function RentalYieldGuide() {
  return (
    <article className="container-page pb-24 border-t border-outline-variant pt-14 max-w-3xl">
      <div className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">Complete guide</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary mt-1">Rental yield, cash flow and the real return on a buy-to-let</h2>
        <p className="mt-3 text-on-surface-variant leading-relaxed">
          Yield is the headline number every landlord quotes — but gross yield alone has bankrupted plenty of
          investors. This guide explains gross vs net yield, the costs that quietly erode returns, the lender stress
          test that decides whether you even get the mortgage, and the Section 24 tax change that reshaped UK
          buy-to-let.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <GuideHeading kicker="Definitions">Gross yield vs net yield</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            <strong>Gross yield</strong> is annual rent divided by the property price. A £220,000 flat let at
            £1,150/month produces £13,800 a year — a gross yield of about 6.3%. It&apos;s a useful first filter but
            ignores every cost. <strong>Net yield</strong> subtracts running costs (management, maintenance,
            insurance, voids, service charges) before dividing by the price, and is far closer to reality. The gap
            between the two is often 1.5–2.5 percentage points — the difference between a good investment and a
            money pit.
          </p>
          <div className="my-5 p-5 rounded-lg bg-surface-container text-center">
            <code className="text-sm sm:text-base font-semibold text-primary">Net yield = (annual rent − running costs) ÷ property price × 100</code>
          </div>
        </section>

        <section>
          <GuideHeading kicker="Benchmarks">What counts as a good yield?</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Yields vary hugely by region. Northern English cities, parts of Scotland and Wales often deliver gross
            yields of 6–8%+, while London and the South East can sit below 4% because capital values are so high
            relative to rents. As a rule of thumb, a <strong>net</strong> yield of 5% or more is healthy, 3.5–5% is
            workable with the right strategy, and below 3.5% leaves little cushion for voids, repairs or rate rises.
            Higher-yield areas often trade lower capital growth for stronger cash flow — your strategy should decide
            which you prioritise.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Costs">The costs landlords forget</GuideHeading>
          <ul className="space-y-3 text-[15px] text-on-surface-variant">
            {[
              ['Letting & management', 'A full management service is typically 10–15% of rent plus VAT; tenant-find only is cheaper but more hands-on.'],
              ['Maintenance reserve', 'Budget around 1% of the property value, or ~10% of rent, a year for repairs and wear.'],
              ['Void periods', 'Even good tenants leave gaps. Modelling 2–4 weeks empty a year (roughly 4–8% of rent) keeps you honest.'],
              ['Insurance', 'Specialist landlord buildings and liability cover, plus optional rent-guarantee insurance.'],
              ['Compliance', 'Gas safety, EICR electrical checks, EPC, smoke and CO alarms, and licensing in some areas.'],
              ['Service charge & ground rent', 'On leasehold flats these can be substantial and rise over time.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}.</strong> {b}</span></li>
            ))}
          </ul>
        </section>

        <section>
          <GuideHeading kicker="Financing">The ICR mortgage stress test</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Buy-to-let lenders apply an <strong>Interest Coverage Ratio (ICR)</strong>: the rent must cover a
            multiple of the mortgage interest, calculated at a stressed rate (commonly around 5.5%). The required
            ICR is typically <strong>125% for basic-rate taxpayers</strong> and <strong>145% for higher and
            additional-rate</strong> landlords. If the rent doesn&apos;t clear that hurdle, no amount of income or
            deposit will get you the loan at that level — you&apos;ll need a bigger deposit, a higher rent, or a
            cheaper property. The calculator shows a live pass/fail.
          </p>
          <Callout tone="warn" title="ICR before you offer">
            Check the ICR before making an offer. Many otherwise-sensible purchases fail the stress test at today&apos;s
            rates, especially in low-yield areas — better to know before you&apos;re committed.
          </Callout>
        </section>

        <section>
          <GuideHeading kicker="Tax">Section 24 and the end of full interest relief</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Since the phased introduction of Section 24 (fully in force from 2020), individual landlords can no
            longer deduct mortgage interest as an expense. Instead you pay tax on the rent (after other costs) and
            receive only a flat <strong>20% tax credit</strong> on the interest. For basic-rate taxpayers the effect
            is broadly neutral; for higher and additional-rate landlords it can sharply cut net cash flow, and in
            highly leveraged cases push a paper profit into a real-terms loss. This is why many portfolio landlords
            now buy through a limited company (SPV), where interest remains fully deductible — at the cost of higher
            mortgage rates and more admin.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Returns">Yield isn&apos;t the whole return — ROI and growth</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Yield measures income against the property value, but as a leveraged investor your real return is on the
            <em> cash you put in</em>. <strong>Cash-on-cash ROI</strong> divides your annual post-tax cash flow by
            your actual cash invested (deposit plus buying costs), and a mortgage can amplify it well above the
            headline yield. On top of that sits <strong>capital growth</strong> — if the property appreciates, your
            equity grows on the whole asset value, not just your deposit. A complete view weighs yield, ROI and
            expected growth together, against the risks of voids, rate rises and falling prices.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Worked example">£220,000 flat at £1,150/month</GuideHeading>
          <p className="text-[15px] leading-relaxed text-on-surface-variant">
            Annual rent is £13,800, a 6.3% gross yield. Knock off 10% management, an 8% maintenance reserve, a 5%
            void allowance and £350 insurance — roughly £3,520 of costs — and net yield falls to about 4.7%. With a
            75% loan at 5.2% interest-only, mortgage interest is about £8,580 a year, leaving pre-tax cash flow near
            £1,700. For a higher-rate landlord, Section 24 tax then takes a further bite. The lesson: a 6%+ gross
            yield can become a thin net return once the real numbers land — model them all before committing.
          </p>
        </section>

        <section>
          <GuideHeading kicker="Avoid these">Common mistakes</GuideHeading>
          <ul className="space-y-3 text-[15px] text-on-surface-variant">
            {[
              ['Quoting gross yield only', 'Gross ignores every cost. Always work to net yield and post-tax cash flow.'],
              ['Forgetting voids and arrears', 'Properties don&apos;t earn 52 weeks a year, every year. Build in an allowance.'],
              ['Underestimating maintenance', 'Boilers, roofs and white goods fail. A reserve of ~1% of value a year is realistic.'],
              ['Ignoring Section 24', 'Higher-rate landlords can owe tax even on a property that barely breaks even on cash flow.'],
              ['Skipping the ICR check', 'A purchase that fails the stress test simply won&apos;t get the mortgage you assumed.'],
            ].map(([h, b]) => (
              <li key={h} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" /><span><strong className="text-on-surface">{h}.</strong> {b}</span></li>
            ))}
          </ul>
        </section>

        <section>
          <GuideHeading kicker="FAQ">Frequently asked questions</GuideHeading>
          <FAQ items={[
            { q: 'What is a good rental yield in the UK?', a: 'A net yield of 5% or more is generally considered healthy. Gross yields of 6–8% are common in higher-yield northern cities, while London and the South East often sit below 4% gross due to high capital values.' },
            { q: 'Should I buy through a limited company?', a: 'An SPV company keeps full mortgage-interest deductibility (avoiding Section 24) and can be efficient for higher-rate or portfolio landlords, but mortgage rates are usually higher and there is more admin and cost. It rarely pays for a single basic-rate landlord. Take accountancy advice.' },
            { q: 'Does the ICR stress test use my actual mortgage rate?', a: 'No — lenders use a notional stressed rate (often around 5.5%) regardless of your actual product rate, so a cheap fixed deal does not help you pass. The required coverage is typically 125% (basic rate) or 145% (higher rate).' },
            { q: 'Is rental income taxed?', a: 'Yes. Rental profit is taxed at your income-tax rate, with mortgage interest now only attracting a 20% tax credit for individuals rather than being a deductible expense. Allowable running costs are still deductible.' },
            { q: 'How many weeks of voids should I assume?', a: 'A prudent figure is 2–4 weeks a year (roughly 4–8% of annual rent), more in slower lettings markets or for higher-turnover properties like student lets.' },
          ]} />
        </section>

        <section>
          <GuideHeading kicker="Next steps">Related calculators</GuideHeading>
          <RelatedTools items={[
            { href: '/buy-to-let-calculator', label: 'Buy-to-Let / Landlord', hint: 'Yield, Section 24 & CGT' },
            { href: '/stamp-duty-calculator', label: 'Stamp Duty (SDLT)', hint: 'Inc. 5% BTL surcharge' },
            { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Repayment vs interest-only' },
            { href: '/buy-vs-rent', label: 'Buy vs Rent', hint: 'Which wins over time?' },
            { href: '/mortgage-affordability', label: 'Affordability', hint: 'How much can you borrow?' },
            { href: '/category/property', label: 'All Property Tools', hint: 'The full hub' },
          ]} />
        </section>
      </div>
    </article>
  );
}
