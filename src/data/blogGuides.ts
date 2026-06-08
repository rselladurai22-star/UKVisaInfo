import type { BlogPost } from './blog';

// 21 multi-category guides (split out of blog.ts to keep each module small
// enough for the build — a single 10k-line file overran the SWC stack).
export const GUIDE_POSTS: BlogPost[] = [
  {
    slug: 'how-much-tax-on-100000-salary-uk-2025-26',
    title: 'Earning £100,000? Beware the 60% Tax Trap',
    description:
      'Why a £100,000 salary triggers a hidden 60% marginal tax rate in 2025/26, how the personal allowance taper works, your real take-home, and how a pension fixes it.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'money',
    tags: ['Income Tax', 'Take-Home Pay', '60% Tax Trap'],
    relatedTools: [
      { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
      { href: '/pension-calculator', label: 'Pension Calculator', hint: 'Pot at retirement' },
      { href: '/national-insurance-calculator', label: 'National Insurance', hint: 'Class 1 / 4 NI' },
    ],
    body: `
Crossing into six figures feels like a milestone, and it is — but it is also where the UK tax system plays its strangest trick. For a slice of income just above £100,000, the effective tax rate leaps to an eye-watering 60%, higher than anything the additional-rate payers face. It is not a published rate; it is a side effect of how the personal allowance is withdrawn. If you earn near this level, understanding it can be worth thousands. Here is how the 60% trap works in 2025/26.

> [!STAT] 60% | The effective marginal tax rate on income between £100,000 and £125,140

> [!KEY] The short version
> Above £100,000, your **personal allowance is withdrawn** by £1 for every £2 you earn.
> That hidden withdrawal creates an effective **60% tax rate** between £100,000 and £125,140.
> By £125,140 your **entire personal allowance is gone** and you are a full additional-rate payer.
> A **pension contribution** is the classic way to sidestep the trap — and the relief is huge.

## The personal allowance taper

Most people keep a £12,570 tax-free personal allowance. But once your adjusted income passes **£100,000**, HMRC takes that allowance away — £1 of allowance for every £2 of income over the line. By the time you reach **£125,140**, the whole £12,570 has gone, and every pound of your income is taxed.

Here is why that creates a 60% rate. For each extra £100 you earn above £100,000, you not only pay 40% tax on the £100 itself (£40), you also lose £50 of personal allowance — which means £50 that was tax-free is now taxed at 40% (£20 more). Add the 2% National Insurance, and you lose about £62 of that £100. The band between £100,000 and £125,140 is, in effect, taxed at **60%** before NI, or about 62% with it.

## What you actually take home on £100,000

At exactly £100,000 you still have your full personal allowance, so the maths is more forgiving than just above it:

> [!STEPS]
> 1. **Income tax** — 20% on £37,700 plus 40% on £49,730 = £7,540 + £19,892 = £27,432.
> 2. **National Insurance** — 8% to £50,270 plus 2% above = about £4,011.
> 3. **Take-home** — £100,000 − £27,432 − £4,011 = about **£68,557 a year**, or roughly £5,713 a month.

It is the income *above* £100,000 that gets punished. A pay rise from £100,000 to £110,000 hands you only about £3,800 of the £10,000 — the rest vanishes into the 60% zone. See your own figure on the [take-home pay calculator](/take-home-pay).

## The pension escape hatch

Because the taper is based on **adjusted net income**, a pension contribution is the cleanest way out. Contributions reduce your adjusted income, so paying enough to bring it back to £100,000 restores your personal allowance.

> [!STAT] ~60% | The effective relief on a pension contribution that escapes the trap

Picture someone on £110,000. They contribute £10,000 to their pension, dropping adjusted income to £100,000. They get 40% income tax relief on the contribution *and* recover the personal allowance they were losing — an effective relief of around 60%. In plain terms, a £10,000 pension contribution can cost them only about £4,000 of take-home, with £10,000 (or more, with employer salary-sacrifice NI savings) landing in their pension. There are few better-value moves in the tax system. The [pension calculator](/pension-calculator) shows the long-term effect.

> [!WARNING] Other thresholds bite here too
> The £100,000 line also removes eligibility for the 30 hours of funded childcare and Tax-Free Childcare. For parents, crossing it can cost thousands in lost childcare support on top of the 60% tax — making a pension contribution to stay under £100,000 even more compelling.

## Why the trap exists

It is not deliberate policy so much as an interaction. The personal allowance withdrawal was introduced to claw back the tax-free amount from high earners, and because it overlaps with the 40% band, it produces the 60% spike. Successive governments have left it in place — partly because it raises revenue quietly, partly because fixing it is politically awkward. For now it is simply a feature of the landscape to plan around.

> [!FAQ]
> Q: What is the 60% tax trap?
> A: Between £100,000 and £125,140, the personal allowance is withdrawn by £1 for every £2 earned. Combined with 40% income tax, this produces an effective 60% marginal rate on income in that band.
>
> Q: How much do you take home on £100,000?
> A: About £68,557 a year, or roughly £5,713 a month, before pension or student loan. Income above £100,000 is taxed far more harshly because of the allowance taper.
>
> Q: At what income do you lose your personal allowance?
> A: It starts reducing above £100,000 and is fully gone by £125,140, where you become a full additional-rate taxpayer.
>
> Q: How can I avoid the 60% tax trap?
> A: A pension contribution reduces your adjusted net income. Paying enough to bring it back to £100,000 restores your personal allowance and delivers around 60% effective relief — one of the best-value moves available.
>
> Q: Does the trap affect childcare support?
> A: Yes. Crossing £100,000 also removes the 30 funded childcare hours and Tax-Free Childcare, so parents have an extra reason to keep adjusted income at or below the threshold.

Figures are 2025/26 estimates for England, Wales and Northern Ireland; Scotland sets its own bands. Treat take-home figures as a guide and take advice on large pension contributions.
`.trim(),
  },
  {
    slug: 'how-much-deposit-to-buy-a-house-uk-2025',
    title: 'How Much Deposit Do You Really Need to Buy a House?',
    description:
      'How much deposit you need for a UK home in 2025 — the 5%, 10% and 25% tiers, how the deposit changes your mortgage rate, and how long it realistically takes to save.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 9,
    category: 'property',
    tags: ['Deposit', 'Mortgages', 'First-Time Buyer'],
    relatedTools: [
      { href: '/deposit-calculator', label: 'Deposit Calculator', hint: 'How much & how long' },
      { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Repayment · interest' },
      { href: '/lifetime-isa-calculator', label: 'Lifetime ISA', hint: '£4k + 25% bonus' },
    ],
    body: `
The deposit is the wall most first-time buyers have to climb, and the figure people quote — "you need 10%" — hides a more useful truth. The minimum to get a mortgage is lower than that, but a bigger deposit unlocks dramatically better rates, which can matter more than the deposit itself. Knowing the tiers, and what each one buys you, helps you decide whether to keep saving or to buy now. Here is the honest picture for 2025.

> [!KEY] The short version
> The **minimum** deposit for most mortgages is **5%** of the property price.
> **10%** opens up far more deals and better rates; **25%+** gets you the cheapest rates.
> A bigger deposit lowers your **loan-to-value (LTV)**, which is what really drives your interest rate.
> On a £250,000 home, 5% is £12,500, 10% is £25,000 and 25% is £62,500.

## The deposit tiers

Lenders price mortgages by **loan-to-value** — the percentage of the property's value you are borrowing. The less you borrow relative to the price, the lower the risk to the lender, and the better the rate you are offered. Your deposit sets your LTV.

| Deposit | Loan-to-value | What it gets you |
|---|---|---|
| 5% | 95% | The minimum — fewer deals, highest rates |
| 10% | 90% | A solid step up in choice and pricing |
| 15% | 85% | Noticeably better rates |
| 25%+ | 75% or less | The cheapest rates lenders offer |

On a £250,000 home that means £12,500 at 5%, £25,000 at 10% and £62,500 at 25%. The [deposit calculator](/deposit-calculator) works out the figure for any price and shows how long it takes to save at your rate.

> [!STAT] 5% | The minimum deposit most lenders require — but rarely the cheapest option

## Why a bigger deposit can beat a bigger salary

Here is the part that surprises people. The jump from a 95% to a 90% mortgage, or 90% to 85%, can cut your interest rate meaningfully — and on a mortgage of a couple of hundred thousand pounds, even a small rate difference changes your monthly payment by a lot. Pushing your deposit over the next LTV threshold (say, from 8% to 10%) can save you more over the mortgage term than the extra deposit cost you. The [mortgage calculator](/mortgage-calculator) lets you compare the monthly payment at different rates so you can see the effect.

## The total cash you actually need

The deposit is not the only upfront cost, and forgetting the rest is a classic mistake:

> [!CHECKLIST] Upfront cash beyond the deposit
> - Stamp duty (first-time buyers pay nothing up to £300,000, then 5% to £500,000).
> - Solicitor and conveyancing fees (often £1,000–£2,000).
> - A survey (£400–£1,500 depending on type).
> - Mortgage arrangement fees (sometimes added to the loan).
> - Moving costs and any immediate furnishing.

Budget for the deposit *plus* these, or you will be caught short close to completion.

## How to build the deposit faster

> [!STEPS]
> 1. **Open a Lifetime ISA** — for a first home up to £450,000, the government adds a 25% bonus on up to £4,000 a year. Free money toward your deposit. Check the rules with the [Lifetime ISA calculator](/lifetime-isa-calculator).
> 2. **Automate the saving** — a standing order on payday into a separate account removes the temptation to spend it.
> 3. **Aim for the next LTV threshold**, not a round number — crossing 90% or 85% is where the rate savings kick in.
> 4. **Clear expensive debt first** — it both improves your mortgage affordability and frees up cash to save.

> [!WARNING] Don't drain every penny into the deposit
> Putting your entire savings into the deposit leaves nothing for the other buying costs, moving, or the inevitable early repairs and furnishings. Keep a buffer — a slightly smaller deposit with an emergency fund intact is usually wiser than a marginally lower rate and no savings.

> [!FAQ]
> Q: How much deposit do I need to buy a house in the UK?
> A: The minimum is usually 5% of the property price, but 10% or more opens up far better mortgage rates. On a £250,000 home that is £12,500 at 5% or £25,000 at 10%.
>
> Q: Is a bigger deposit worth it?
> A: Often yes. A bigger deposit lowers your loan-to-value, which can cut your interest rate enough to save more over the mortgage term than the extra deposit cost you.
>
> Q: What is loan-to-value?
> A: The percentage of the property's price you are borrowing. A £25,000 deposit on a £250,000 home is a 90% loan-to-value. Lower LTV means lower risk to the lender and cheaper rates.
>
> Q: Can a Lifetime ISA help with my deposit?
> A: Yes. For a first home up to £450,000, the government adds a 25% bonus on up to £4,000 a year paid into a Lifetime ISA — a meaningful boost to a deposit.
>
> Q: What other costs do I need beyond the deposit?
> A: Stamp duty (above £300,000 for first-time buyers), legal and survey fees, possible mortgage fees, and moving costs. Budget for these on top of the deposit.

Figures are 2025/26 estimates and illustrative. Rates and lender criteria vary — treat the calculators as a guide and consider mortgage advice.
`.trim(),
  },
  {
    slug: 'how-much-do-i-need-to-retire-uk-2025',
    title: 'How Much Do You Actually Need to Retire in the UK?',
    description:
      'A realistic look at how big a pension pot you need to retire in the UK — the income targets, the role of the State Pension, the 4% rule, and how to check if you are on track.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 11,
    category: 'money',
    tags: ['Pensions', 'Retirement', 'Saving'],
    relatedTools: [
      { href: '/pension-calculator', label: 'Pension Calculator', hint: 'Pot at retirement' },
      { href: '/pension-drawdown-calculator', label: 'Pension Drawdown', hint: 'How long will it last?' },
      { href: '/state-pension', label: 'State Pension', hint: 'Forecast from NI years' },
    ],
    body: `
"How much do I need to retire?" is the question that keeps people up at night, usually answered with an intimidating six- or seven-figure number that bears no relation to their life. The truth is more manageable, because the State Pension does a lot of the heavy lifting, and the number depends entirely on the lifestyle you want. Here is a realistic, jargon-free way to work out your own target for the UK in 2025.

> [!KEY] The short version
> A common rule of thumb is you need about **two-thirds of your working income** in retirement.
> The **full State Pension** is about **£11,973 a year** and covers a big chunk of a basic lifestyle.
> A widely-used guide suggests a pot of roughly **25 times** the annual income you want it to provide.
> The **earlier you start**, the more compounding does the work for you.

## Start with the income, not the pot

The mistake is fixating on a giant pot. What actually matters is the **annual income** you want in retirement. Industry research (the PLSA retirement living standards) gives useful anchors for a single person:

| Lifestyle | Rough annual income needed |
|---|---|
| Minimum (covers basics, little spare) | around £14,000 |
| Moderate (some comfort, a holiday) | around £31,000 |
| Comfortable (more freedom and luxuries) | around £43,000 |

Couples need more in total but less each, because many costs are shared. Decide which life you are aiming for, and you have your income target. Everything else flows from that.

## The State Pension does a lot

Here is the reassuring part. The **full new State Pension** is about **£11,973 a year** in 2025/26 (£230.25 a week), paid from State Pension age — currently 66, rising to 67. For a couple who both qualify, that is nearly £24,000 a year of guaranteed, inflation-linked income before they touch a penny of private savings.

That means a single person aiming for a "moderate" £31,000 only needs their private pension to provide about £19,000 a year — not £31,000. Check your own State Pension forecast, which depends on your National Insurance record, with the [State Pension tool](/state-pension).

> [!STAT] £11,973 | The full new State Pension a year in 2025/26 — your guaranteed foundation

## How big a pot for the rest?

To turn a pot into income, a common rule of thumb is the **4% rule** — you can withdraw about 4% of your pot in the first year, rising with inflation, with a reasonable chance it lasts 30 years. Flip that around and you need roughly **25 times** the annual income you want the pot to provide.

> [!STEPS]
> 1. **Set your income target** — say £31,000 a year (moderate).
> 2. **Subtract the State Pension** — £31,000 − £11,973 = about £19,000 from your own savings.
> 3. **Multiply by 25** — £19,000 × 25 = about £475,000 pot needed.
> 4. **Adjust for reality** — a part-time job, downsizing, or a partner's pension all reduce the figure.

The [pension calculator](/pension-calculator) projects what your contributions will grow to, and the [drawdown calculator](/pension-drawdown-calculator) shows how long a pot lasts at different withdrawal rates.

> [!WARNING] The 4% rule is a guide, not a guarantee
> The 4% figure is a rule of thumb from historical data, not a promise. Poor early investment returns, living longer than expected, or high inflation can all mean a pot does not last. Many people use a more cautious withdrawal rate or keep some flexibility to spend less in bad years.

## Why starting early matters so much

Compounding rewards time more than amount. Someone who saves a modest sum from their twenties can end up with a bigger pot than someone who saves much more from their forties, simply because the early money had decades to grow. If retirement feels far off, that is exactly why starting now is so powerful — and if it feels close, the levers are saving more, working a little longer, or trimming the income target.

## Don't forget the free money

Before stretching for a giant private pot, make sure you are capturing every employer pension contribution available — it is free money that goes straight into your retirement. Salary sacrifice can boost it further. For many people, maximising workplace contributions gets them most of the way to their target without heroics.

> [!FAQ]
> Q: How much do I need to retire in the UK?
> A: It depends on the lifestyle you want. A common rule is about two-thirds of your working income. With the State Pension covering around £12,000 a year, many people need a private pot of a few hundred thousand pounds to top up to a moderate or comfortable income.
>
> Q: How much is the State Pension?
> A: The full new State Pension is about £11,973 a year (£230.25 a week) in 2025/26, paid from State Pension age, provided you have enough National Insurance years.
>
> Q: What is the 4% rule?
> A: A rule of thumb that you can withdraw about 4% of your pension pot in the first year, increasing with inflation, with a reasonable chance it lasts 30 years. It implies needing roughly 25 times your target annual income.
>
> Q: How big a pension pot do I need for £30,000 a year?
> A: After the State Pension covers around £12,000, you need your pot to provide about £18,000–£19,000 a year — roughly £450,000–£475,000 using the 4% rule, less if you have other income.
>
> Q: Does starting early really make a difference?
> A: Hugely. Compounding means money saved in your twenties and thirties grows far more than the same amount saved later, so starting early is the single biggest advantage.

Figures are 2025/26 estimates and rules of thumb, not personal advice. Investment returns are not guaranteed — consider regulated financial advice for retirement planning.
`.trim(),
  },
  {
    slug: 'how-much-is-car-tax-ved-2025-26',
    title: 'How Much Is Car Tax in 2025/26? VED Rates Explained',
    description:
      'UK car tax (VED) for 2025/26 explained — the £195 standard rate, first-year rates by CO2, the £40,000 expensive-car supplement, and why electric cars now pay too.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 9,
    category: 'motoring',
    tags: ['Car Tax', 'VED', 'Road Tax'],
    relatedTools: [
      { href: '/vehicle-tax-calculator', label: 'Vehicle Tax (VED)', hint: 'CO2 + standard rate' },
      { href: '/car-running-costs', label: 'Car Running Costs', hint: 'Total cost of ownership' },
      { href: '/ev-charging-cost', label: 'EV Charging Cost', hint: 'Home vs public' },
    ],
    body: `
Car tax is one of those costs that quietly changes every year, and 2025/26 brought a big shift: electric cars now pay it too. Whether you are budgeting for a new car or just wondering why your renewal looks different, the system is more logical than it first appears once you separate the one-off first-year charge from the flat rate everyone settles into. Here is how Vehicle Excise Duty works in 2025/26.

> [!KEY] The short version
> The **standard rate** of car tax is **£195 a year** for most cars from their second year.
> The **first-year rate** depends on CO2 emissions — from £10 for the cleanest to over £5,000 for the dirtiest.
> Cars with a list price over **£40,000** pay a **£425 supplement** a year for years two to six.
> **Electric cars now pay VED** since April 2025 — the exemption is gone.

## The two parts of car tax

For any car registered since April 2017, Vehicle Excise Duty (VED) has two stages:

1. A **first-year rate** based on the car's CO2 emissions — paid once, usually bundled into the on-the-road price by the dealer.
2. A **standard rate** from year two onward — a flat fee that is the same for almost every car.

For 2025/26 that standard rate is **£195 a year**. Whether your car is a small petrol hatchback or a large diesel, once you are past the first year you pay the same £195 — unless the expensive-car supplement applies. Check yours on the [vehicle tax calculator](/vehicle-tax-calculator).

## The first-year "showroom tax"

The first year is where emissions matter. The dirtier the car, the more you pay up front:

| CO2 (g/km) | First-year rate (petrol) |
|---|---|
| 0 (electric) | £10 |
| 1–50 | £110 |
| 51–75 | £130 |
| 76–100 | £270–£350 |
| 111–150 | £440–£540 |
| 151–170 | £1,360 |
| Over 255 | £5,490 |

This is why a high-emission performance car can cost thousands in its first year, while an efficient one costs very little. After that first year, they all drop to the £195 standard rate.

> [!STAT] £195 | The standard annual car tax rate from year two for most vehicles

## The £40,000 expensive-car supplement

Here is the one that catches buyers of premium and electric cars. If a car's **list price when new was over £40,000**, it pays an extra **£425 a year** on top of the standard rate — for five years, from year two to year six. So a £45,000 car effectively pays £195 + £425 = £620 a year during that period.

> [!WARNING] This now hits electric cars too
> Since April 2025, electric cars pay VED for the first time — a £10 first-year rate, then the £195 standard rate. Crucially, the £40,000 supplement applies to them as well, and many EVs list above £40,000, so a new electric car can face £620 a year in tax during years two to six. The free-tax era for EVs is over.

## Older cars work differently

If your car was registered before April 2017, it sits in a different system. Cars registered between 2001 and 2017 are taxed purely on **CO2 bands** — a low-emission car from that era can still be very cheap or even free to tax. Cars registered before 2001 are taxed on **engine size**. So the rules above apply to newer cars; older ones follow their own, often cheaper, tables.

## Paying and avoiding pitfalls

You can pay annually, every six months or monthly by Direct Debit, though paying monthly costs slightly more overall. Two things to remember: car tax no longer transfers when you buy a used car, so you must tax it before driving away; and if a car is off the road, you must declare a SORN or keep taxing it. Driving untaxed risks fines and clamping, picked up automatically by number-plate cameras. The [car running costs calculator](/car-running-costs) folds tax into the full picture of what a car costs to keep.

> [!FAQ]
> Q: How much is car tax in 2025/26?
> A: The standard rate is £195 a year for most cars from year two. The first-year rate varies by CO2 emissions from £10 to over £5,000, and cars over £40,000 pay a £425 supplement in years two to six.
>
> Q: Do electric cars pay car tax now?
> A: Yes. Since 1 April 2025, electric cars pay a £10 first-year rate then the £195 standard rate, plus the £40,000 expensive-car supplement if applicable.
>
> Q: What is the expensive-car supplement?
> A: An extra £425 a year, on top of the standard rate, for cars with a list price over £40,000 when new. It applies from year two to year six.
>
> Q: Why is my first-year tax so high?
> A: The first-year rate is based on CO2 emissions, so higher-emission cars pay much more up front. It drops to the £195 standard rate from the second year.
>
> Q: Does car tax transfer when I buy a used car?
> A: No. The seller's tax is cancelled on sale, so you must tax the car yourself before driving it. There is no longer a paper tax disc — check and tax it online.

Figures are 2025/26 estimates for cars registered from April 2017. Older cars use different tables. Always confirm your exact rate on gov.uk.
`.trim(),
  },
  {
    slug: 'council-tax-bands-and-reductions-explained-2025-26',
    title: 'Council Tax Bands and Reductions Explained',
    description:
      'How council tax bands work in 2025/26, why your band may be wrong, and every discount and reduction you might be missing — from the single-person discount to full support.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 9,
    category: 'benefits',
    tags: ['Council Tax', 'Bills', 'Discounts'],
    relatedTools: [
      { href: '/council-tax-band', label: 'Council Tax Bands', hint: 'Band A–H by area' },
      { href: '/council-tax-support-checker', label: 'Council Tax Support', hint: 'Reduction eligibility' },
      { href: '/universal-credit-calculator', label: 'Universal Credit', hint: 'Allowance + elements' },
    ],
    body: `
Council tax is one of the biggest household bills, yet most people pay whatever the council asks without ever checking whether their band is right or whether they qualify for a discount. Both can be wrong in your favour. Bands are based on valuations that are now decades old, and a whole menu of reductions goes unclaimed every year. Here is how council tax works in 2025/26 and where the savings hide.

> [!KEY] The short version
> Your bill depends on your property's **band (A to H)**, set on its **1991 value** in England.
> Many homes are in the **wrong band** — you can check and challenge it for free.
> A **single adult** gets a **25% discount**; students and some others are exempt entirely.
> Low-income households can claim **Council Tax Reduction**, worth up to 100% off.

## How bands work

In England, every home is placed in one of eight bands, **A (lowest) to H (highest)**, based on what it was worth on **1 April 1991** — not today. Wales uses a similar system with a 2003 valuation and nine bands; Scotland has its own. Your council sets a charge for band D, and the other bands are fixed proportions of it: band A pays two-thirds of band D, band H pays twice as much, and so on.

Because the valuations are so old, two near-identical houses can sit in different bands, and plenty of homes were banded hastily back in 1991. You can look up any property's band and compare it with your neighbours' using the [council tax band tool](/council-tax-band).

> [!STAT] 1991 | The year England's council tax bands are still based on

## Could your band be wrong?

This is the check almost nobody does. If similar neighbouring properties are in a lower band than yours, or your home was valued incorrectly in 1991, you may be over-banded — and have been overpaying for years. You can challenge your band with the Valuation Office Agency for free.

> [!WARNING] A band challenge can go either way
> Challenging your band can result in it being lowered (a refund and lower future bills) — but the VOA can also review and *raise* it, or your neighbours', if it finds the band was too low. Check the evidence carefully before challenging: compare bands and 1991 values of similar local properties first, so you only challenge when the case is strong.

## The discounts you might be missing

A surprising amount of council tax goes uncollected as discounts simply because people do not claim:

> [!CHECKLIST] Common council tax discounts
> - **Single-person discount** — 25% off if you are the only adult in the home.
> - **Student homes** — full exemption if everyone is a full-time student.
> - **Severe mental impairment** — those who qualify are disregarded, sometimes giving 25% or 100% off.
> - **Annexes and empty properties** — special rules and sometimes discounts apply.
> - **Disabled band reduction** — a home adapted for a disabled resident can be charged a band lower.

If you live alone and are not getting the 25% single-person discount, you are almost certainly overpaying — claim it directly from your council.

## Council Tax Reduction for low incomes

Separately from discounts, **Council Tax Reduction (CTR)** — sometimes called Council Tax Support — cuts the bill for people on low incomes. Unlike most benefits it is run locally, so the rules vary by council, but it can cover anywhere from a small percentage up to **100%** of the bill. Pension-age claimants follow national rules and the poorest can get 100%; working-age schemes are set by each council and often cap support a little lower. The [Council Tax Support checker](/council-tax-support-checker) estimates what you might get, and if you claim [Universal Credit](/universal-credit-calculator) you can usually apply for CTR alongside it.

> [!FAQ]
> Q: How are council tax bands worked out?
> A: In England, by your property's value on 1 April 1991, placing it in a band from A to H. Wales uses a 2003 valuation and Scotland its own system. Your council sets the band D charge and the other bands are fixed proportions of it.
>
> Q: Can I get my council tax band lowered?
> A: Possibly. If similar local properties are in a lower band, you can challenge yours for free with the Valuation Office Agency — but be aware a review could also raise it, so check the evidence first.
>
> Q: What discounts can reduce my council tax?
> A: A 25% single-person discount, full exemption for all-student households, disregards for severe mental impairment, and a disabled band reduction, among others. Many go unclaimed.
>
> Q: What is Council Tax Reduction?
> A: A means-tested reduction for people on low incomes, run by your local council, worth up to 100% of the bill. It is separate from discounts and you must apply for it.
>
> Q: Do I get a discount living alone?
> A: Yes — a 25% single-person discount if you are the only adult in the property. If you are not receiving it, claim it from your council.

Figures and rules are 2025/26 estimates for England unless stated. Bands and support schemes vary by nation and council — check with your local authority.
`.trim(),
  },
  {
    slug: 'national-insurance-explained-how-much-2025-26',
    title: 'National Insurance Explained: How Much Do You Actually Pay?',
    description:
      'A clear guide to National Insurance in 2025/26 — the 8% employee rate, the thresholds, what self-employed people pay, what it funds, and why it is separate from income tax.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 9,
    category: 'money',
    tags: ['National Insurance', 'Take-Home Pay', 'Tax'],
    relatedTools: [
      { href: '/national-insurance-calculator', label: 'National Insurance', hint: 'Class 1 / 4 NI' },
      { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
      { href: '/state-pension', label: 'State Pension', hint: 'Built from NI years' },
    ],
    body: `
National Insurance is the deduction on your payslip that most people never question, sitting quietly next to income tax and taking a chunk of every pay packet. It works differently from income tax, funds different things, and matters more than people realise — because it is what builds your State Pension. Here is what you actually pay in 2025/26, and why it is worth understanding rather than ignoring.

> [!KEY] The short version
> Employees pay **8%** National Insurance on earnings between **£12,570 and £50,270**, then **2%** above.
> It is **separate from income tax**, with its own thresholds and rates.
> The **self-employed** pay 6% then 2% Class 4 NI on profits.
> National Insurance is what **builds your State Pension** record — not just another tax.

## How National Insurance works for employees

If you are employed, you pay **Class 1** National Insurance, deducted automatically before you are paid. For 2025/26:

- You pay **nothing** on the first £12,570 a year (the primary threshold).
- You pay **8%** on earnings between £12,570 and £50,270.
- You pay **2%** on everything above £50,270.

So unlike income tax — where the rate *rises* to 40% in the higher band — National Insurance actually *falls* to 2% once you pass £50,270. That is why high earners' marginal rates are a little lower than you might expect at the top. See your own deduction on the [National Insurance calculator](/national-insurance-calculator) or the full picture on the [take-home pay tool](/take-home-pay).

> [!STAT] 8% | The main rate of employee National Insurance in 2025/26, between £12,570 and £50,270

## A quick example

Someone earning £35,000 pays NI only on the slice above £12,570:

> [!STEPS]
> 1. **Earnings above the threshold** — £35,000 − £12,570 = £22,430.
> 2. **Apply 8%** — £22,430 × 0.08 = about £1,794 a year.
> 3. **Monthly** — roughly £150 of National Insurance.

All of it at 8%, because £35,000 is below the £50,270 upper limit where the rate drops to 2%.

## What the self-employed pay

If you work for yourself, you pay **Class 4** National Insurance through Self Assessment on your profits:

- **6%** on profits between £12,570 and £50,270.
- **2%** on profits above £50,270.

**Class 2** National Insurance, the old flat weekly charge, is now voluntary for most — but paying it (or having enough profit) still builds your State Pension record, which matters (see below). The self-employed rates are slightly lower than the employee 8%, reflecting that they get fewer contributory benefits.

## Why National Insurance is not just another tax

Here is the part that makes NI different from income tax: it is the mechanism that builds your **State Pension**. Each year you pay enough National Insurance (or receive credits) counts as a "qualifying year." You generally need about 35 qualifying years for the full new State Pension, and at least 10 to get anything at all.

> [!WARNING] Gaps in your record can cost you a full State Pension
> Years spent not working, with low earnings, or abroad can leave gaps that reduce your State Pension. The good news is you often get **NI credits** automatically — for example while claiming Child Benefit or certain other benefits — and you can sometimes pay voluntary contributions to fill gaps. Check your record and forecast with the [State Pension tool](/state-pension); fixing a gap is occasionally one of the best-value things you can do.

## Income tax versus National Insurance

People often lump the two together, but they are genuinely separate systems:

| | Income tax | National Insurance |
|---|---|---|
| Tax-free threshold | £12,570 personal allowance | £12,570 primary threshold |
| Rates | 20% / 40% / 45% (rises) | 8% then 2% (falls) |
| Applies to | Most income, including savings | Mainly earnings from work |
| Builds State Pension? | No | Yes |

They only line up neatly at £50,270, where the higher-rate tax band and the lower NI rate both begin.

> [!FAQ]
> Q: How much National Insurance do I pay?
> A: As an employee in 2025/26, 8% on earnings between £12,570 and £50,270, then 2% above. The self-employed pay 6% then 2% Class 4 NI on profits.
>
> Q: Why does my National Insurance go down at higher earnings?
> A: Unlike income tax, the NI rate falls from 8% to 2% above £50,270. So the very top of your earnings is charged less NI, not more.
>
> Q: Is National Insurance the same as income tax?
> A: No. They are separate systems with different thresholds and rates, and National Insurance specifically builds your State Pension entitlement, which income tax does not.
>
> Q: Do the self-employed pay National Insurance?
> A: Yes — Class 4 NI at 6% then 2% on profits through Self Assessment. Class 2 is now voluntary for most, but contributing still protects your State Pension record.
>
> Q: Why does National Insurance matter for my pension?
> A: Each qualifying year of NI counts toward the State Pension. You need about 35 years for the full amount, so gaps can reduce it — though credits and voluntary contributions can help fill them.

Figures are 2025/26 estimates for the UK. Treat take-home figures as a guide and check your own National Insurance record on gov.uk.
`.trim(),
  },
  {
    slug: 'inheritance-tax-explained-2025-26',
    title: 'Inheritance Tax Explained: Will Your Family Actually Pay It?',
    description:
      'A plain-English guide to UK inheritance tax in 2025/26 — the £325,000 nil-rate band, the £175,000 residence band, the £1m couple allowance, and the legal ways to reduce it.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 11,
    category: 'estate',
    tags: ['Inheritance Tax', 'Estate Planning', 'IHT'],
    relatedTools: [
      { href: '/inheritance-tax', label: 'Inheritance Tax', hint: 'NRB £325k + RNRB £175k' },
      { href: '/estate-value-calculator', label: 'Estate Value', hint: 'Net estate for IHT' },
      { href: '/gift-iht-calculator', label: 'Gift & 7-Year Rule', hint: 'Taper relief' },
    ],
    body: `
Inheritance tax has a fearsome reputation, yet most estates never pay a penny of it. The fear comes from misunderstanding the allowances — people hear "40%" and panic, without realising how much is sheltered before that rate ever applies. For families that do cross the threshold, though, the bill can be large, and a little planning goes a long way. Here is who actually pays inheritance tax in 2025/26, and what legally reduces it.

> [!KEY] The short version
> Everyone has a **£325,000 nil-rate band** before any inheritance tax is due.
> Leaving your home to children or grandchildren adds a **£175,000 residence band**.
> Married couples and civil partners can combine allowances — up to **£1,000,000**.
> Anything above the allowances is taxed at **40%** (36% if you leave 10% to charity).

## The allowances that shelter most estates

Inheritance tax (IHT) is charged on the value of everything you leave — property, savings, investments, possessions — minus debts. But it only bites above your tax-free allowances, and these are more generous than most people assume.

| Allowance | 2025/26 amount | Condition |
|---|---|---|
| Nil-rate band (NRB) | £325,000 | Everyone |
| Residence nil-rate band (RNRB) | £175,000 | Leaving your home to direct descendants |
| Combined, single person | up to £500,000 | Home to children/grandchildren |
| Combined, couple | up to £1,000,000 | Transferable allowances |

That last row is the key one. When the first spouse or civil partner dies, anything left to the survivor is completely exempt, and their unused allowances transfer. So a surviving spouse can have two nil-rate bands and two residence bands — up to £1,000,000 — before IHT applies. That single fact takes the vast majority of family homes out of the tax. Estimate your own position with the [inheritance tax calculator](/inheritance-tax).

## The residence band and its catch

The £175,000 residence band only applies if you leave your home (or its value) to **direct descendants** — children, grandchildren, stepchildren or adopted children. Leave the house to a sibling or a friend and you lose it. There is also a **taper**: for estates worth more than £2 million, the residence band reduces by £1 for every £2 above that line, disappearing entirely on large estates. Wealthy families therefore cannot rely on it.

> [!STAT] £1,000,000 | The combined allowance available to many married couples before any IHT is due

## What counts toward your estate

To know whether you are near the threshold, add up the open-market value of everything you own and subtract what you owe. Our [estate value calculator](/estate-value-calculator) does this, but the broad picture is:

> [!CHECKLIST] Typically inside the estate
> - Your home and any other property.
> - Cash, savings and ISAs (ISAs lose their tax shelter on death).
> - Investments, shares and bonds.
> - Cars, jewellery, art and other possessions.
> - Money owed to you.

Some things usually fall **outside** the estate, which is where planning starts: most **pensions** (though unused pension funds are due to be brought into IHT from April 2027), and **life insurance written in trust**, which pays beneficiaries directly rather than through the estate.

## The legal ways to reduce it

If your estate is heading over the allowances, several long-established reliefs help:

- **Spouse exemption** — leave anything to your spouse or civil partner tax-free, and transfer your allowances.
- **Gifting** — give money away and survive seven years, and it falls outside your estate entirely. Smaller exemptions (£3,000 a year, wedding gifts, regular gifts from surplus income) are immediate. The [gift calculator](/gift-iht-calculator) shows how the seven-year rule and taper relief work.
- **Charity** — gifts to charity are exempt, and leaving 10% of your estate to charity cuts the rate on the rest from 40% to 36%.
- **Life insurance in trust** — a policy written in trust keeps the payout out of your estate, useful for covering an expected bill.

> [!WARNING] A gift with strings attached does not work
> If you give away your home but keep living in it rent-free, it is a "gift with reservation of benefit" and still counts as yours for IHT. The classic mistake. To remove an asset from your estate you generally have to give it up genuinely and completely.

## The seven-year rule in brief

Most lifetime gifts to individuals are "potentially exempt." Survive seven years from the date of the gift and it is free of IHT. Die within seven years and it counts back toward your estate — though **taper relief** reduces the tax on gifts above the nil-rate band the longer you survived. A common misconception is that taper helps every gift; it only reduces tax that is actually due, so a gift within your nil-rate band gets no benefit from it because there was no tax to taper in the first place.

> [!FAQ]
> Q: How much can you inherit before paying inheritance tax?
> A: £325,000 per person tax-free, rising to £500,000 if you leave your home to direct descendants. Married couples and civil partners can combine allowances for up to £1,000,000.
>
> Q: What is the inheritance tax rate?
> A: 40% on the value of the estate above your allowances, reduced to 36% if you leave at least 10% of the net estate to charity.
>
> Q: Do I pay inheritance tax on money left by my spouse?
> A: No. Transfers between UK-domiciled spouses and civil partners are completely exempt, and your partner's unused allowances transfer to you.
>
> Q: Are pensions subject to inheritance tax?
> A: Most pensions currently fall outside the estate, but the government plans to bring unused pension funds into inheritance tax from April 2027.
>
> Q: Can gifting reduce inheritance tax?
> A: Yes. Gifts fall outside your estate if you survive seven years, and several gifts are immediately exempt — including £3,000 a year and regular gifts from surplus income.

Figures are 2025/26 estimates for the UK. Inheritance tax planning is highly personal — take professional advice before acting on gifts, trusts or insurance.
`.trim(),
  },
  {
    slug: 'isa-vs-pension-where-to-save-2025-26',
    title: 'ISA or Pension: Where Should You Actually Put Your Money?',
    description:
      'ISA versus pension for UK savers in 2025/26 — the £20,000 ISA allowance, the Lifetime ISA bonus, pension tax relief, and how to decide which to use for your goals.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'money',
    tags: ['ISA', 'Pensions', 'Savings', 'Investing'],
    relatedTools: [
      { href: '/isa-calculator', label: 'ISA Calculator', hint: 'Tax-free growth' },
      { href: '/lifetime-isa-calculator', label: 'Lifetime ISA', hint: '£4k + 25% bonus' },
      { href: '/pension-calculator', label: 'Pension Calculator', hint: 'Pot at retirement' },
    ],
    body: `
ISA or pension is one of the great personal-finance dilemmas, and the honest answer is "it depends on what the money is for." Both shelter your savings from tax, but they do it at different ends — one tax-free going in, the other tax-free coming out — and the right choice turns on your age, your tax rate and when you will need the money. Here is how to decide in 2025/26 without the jargon.

> [!KEY] The short version
> You can put **£20,000 a year** into ISAs, and the growth and withdrawals are **tax-free**.
> Pensions give **tax relief going in** — an instant uplift — but you cannot touch them until age 57+.
> For retirement, a **pension usually wins** on tax, especially with employer contributions.
> For flexible, accessible savings, an **ISA wins** because you can withdraw any time.

## How each one is taxed

The fundamental difference is *when* the tax break happens.

- A **pension** gives you tax relief when you pay in. A £100 contribution costs a basic-rate taxpayer £80, a higher-rate taxpayer £60. It grows tax-free, but is taxed as income when you draw it (after a 25% tax-free lump sum) — and you cannot access it until your late fifties.
- An **ISA** is the mirror image. You pay in from taxed income with no upfront relief, but everything inside grows tax-free and every withdrawal is tax-free, at any age.

So a pension is "tax-free in, taxed out"; an ISA is "taxed in, tax-free out." Which is better depends on your tax rate now versus in retirement, and how soon you need the cash.

## The £20,000 ISA allowance

Every UK adult can shelter **£20,000 a year** across ISAs — cash, stocks and shares, or a mix. There is no tax on the interest, dividends or growth, and no tax when you take money out. For a goal where you might need access — a house deposit, an emergency fund, money for the next decade — the ISA's flexibility is its superpower. Model the tax-free growth with the [ISA calculator](/isa-calculator).

> [!STAT] £20,000 | The annual ISA allowance for 2025/26 — tax-free in and out

## The Lifetime ISA: a 25% government bonus

The **Lifetime ISA (LISA)** deserves special attention because it adds free money. You can pay in up to **£4,000 a year** (which counts within your £20,000 ISA allowance), and the government adds a **25% bonus** — up to £1,000 a year. It is designed for two goals: buying your first home (up to £450,000) or retirement from age 60.

> [!WARNING] The Lifetime ISA has a sharp penalty
> Withdraw from a LISA for anything other than a first home or after age 60, and you pay a 25% government charge — which is more than the bonus you received, because it is charged on the larger total. The £450,000 property cap has also not risen with house prices, catching buyers in expensive areas. Use a LISA only if you are confident it fits one of its two purposes. The [Lifetime ISA calculator](/lifetime-isa-calculator) shows the bonus and the penalty.

## When the pension clearly wins

For long-term retirement saving, the pension usually beats the ISA on tax — for three reasons:

1. **Employer contributions.** If your workplace pension comes with employer matching, that is free money an ISA cannot replicate. Always capture the full employer match first.
2. **Higher-rate relief.** A higher-rate taxpayer gets 40% relief going in and may pay only 20% in retirement — a genuine tax arbitrage.
3. **Salary sacrifice.** Paying in by salary sacrifice saves National Insurance too, often boosted by a shared employer NI saving.

The [pension calculator](/pension-calculator) shows what regular contributions compound to over a working life.

## A simple way to decide

> [!STEPS]
> 1. **Grab the free money first** — pay enough into your workplace pension to get the full employer match. Nothing beats it.
> 2. **Build accessible savings** — an emergency fund and shorter-term goals belong in an ISA you can reach any time.
> 3. **For a first home** — consider a Lifetime ISA for the 25% bonus, if the property cap and rules suit you.
> 4. **For extra retirement saving** — top up the pension, especially as a higher-rate taxpayer.

It is rarely strictly one or the other. Most people are best served by using both: the pension for locked-away retirement money with the best tax treatment, and the ISA for flexible savings they may need before then.

> [!FAQ]
> Q: Is an ISA or pension better for retirement?
> A: For retirement specifically, a pension usually wins on tax — especially with employer contributions and higher-rate relief. An ISA is better for money you may need before your late fifties because you can access it any time.
>
> Q: How much can I put in an ISA in 2025/26?
> A: £20,000 a year across all your ISAs combined, with tax-free growth and tax-free withdrawals.
>
> Q: What is the Lifetime ISA bonus?
> A: The government adds 25% to what you pay in, up to £1,000 a year on a £4,000 contribution, for buying a first home (up to £450,000) or retirement from age 60.
>
> Q: Can I have both an ISA and a pension?
> A: Yes, and most people should. Use the pension for tax-efficient retirement saving and the ISA for flexible, accessible savings — they complement each other.
>
> Q: Do I pay tax when I take money out of an ISA?
> A: No. ISA withdrawals are completely tax-free, at any age. A pension, by contrast, is taxed as income on withdrawal beyond the 25% tax-free lump sum.

Figures are 2025/26 estimates. Investment values can fall as well as rise, and the right mix depends on your circumstances — consider regulated financial advice for big decisions.
`.trim(),
  },
  {
    slug: 'clear-credit-card-debt-snowball-vs-avalanche',
    title: 'How to Clear Credit Card Debt Faster: Snowball vs Avalanche',
    description:
      'Two proven methods to pay off credit card and loan debt — the snowball and the avalanche — compared with worked numbers, plus how 0% balance transfers speed both up.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 9,
    category: 'money',
    tags: ['Debt', 'Credit Cards', 'Budgeting'],
    relatedTools: [
      { href: '/debt-payoff-planner', label: 'Debt Payoff Planner', hint: 'Snowball vs avalanche' },
      { href: '/credit-card-payoff-calculator', label: 'Credit Card Payoff', hint: 'Months + interest' },
      { href: '/balance-transfer-calculator', label: 'Balance Transfer', hint: '0% deal vs fee' },
    ],
    body: `
If you are juggling more than one debt — a couple of credit cards, an overdraft, maybe a loan — the order you clear them in matters more than most people realise. Two well-known methods, the snowball and the avalanche, tackle the same debts in opposite orders, and each has a genuine case. One saves the most money; the other keeps you motivated enough to finish. Here is how they work and how to choose, with the numbers laid out.

> [!KEY] The short version
> **Avalanche** — pay off the **highest interest rate** first. Saves the most money overall.
> **Snowball** — pay off the **smallest balance** first. Builds momentum with quick wins.
> Either way: pay the **minimum on everything**, then throw all spare cash at one target debt.
> A **0% balance transfer** can supercharge both by pausing interest entirely.

## The principle both methods share

Whichever you choose, the engine is the same. You make the **minimum payment on every debt** to stay current, then direct every spare pound at one chosen debt until it is gone. When that debt clears, its old payment rolls onto the next target — the payment amount snowballs upward even as the number of debts falls. The methods only differ in **which debt you attack first**.

## The avalanche: cheapest by the numbers

The avalanche targets the debt with the **highest interest rate** first, regardless of its size. Mathematically this is optimal — you are always killing the most expensive debt, so you pay the least interest and clear everything fastest in pure money terms.

Imagine three debts:

| Debt | Balance | APR |
|---|---|---|
| Card A | £1,000 | 29.9% |
| Card B | £3,000 | 22.9% |
| Overdraft | £1,500 | 39.9% |

The avalanche says: overdraft first (39.9%), then Card A (29.9%), then Card B (22.9%) — because that order minimises the interest you hand over. Over the life of the debt this saves the most. Our [debt payoff planner](/debt-payoff-planner) runs both methods on your actual balances so you can see the difference.

> [!STAT] Highest APR first | The avalanche rule that minimises total interest paid

## The snowball: built for motivation

The snowball ignores interest rates and targets the **smallest balance** first. In the example above that means Card A (£1,000), then the overdraft, then Card B. You clear a whole debt quickly, feel the win, and that momentum keeps many people going where a slow grind would have them give up.

It is not mathematically optimal — you may pay a little more interest — but personal finance is behavioural as much as numerical. A method you actually stick to beats a perfect plan you abandon in month three. For many people the snowball's psychological boost is worth the small extra cost.

## Which should you choose?

> [!STEPS]
> 1. **If you are disciplined and motivated by saving money** — use the avalanche. It is the cheapest route, full stop.
> 2. **If you have struggled to stick with debt repayment before** — use the snowball. The quick wins keep you in the game.
> 3. **If your highest-APR debt is also your smallest** — lucky you; both methods agree, so just start.

There is no wrong answer. The best method is the one you will follow to the end.

## Supercharge either with a 0% balance transfer

Both methods get dramatically faster if you stop the interest. A **0% balance-transfer card** moves expensive debt onto a card charging no interest for a set period, for a one-off fee of typically 1–3%. While the interest is paused, every pound you pay goes to clearing the balance rather than feeding the lender.

> [!WARNING] Clear it before the 0% period ends
> The risk with a balance transfer is reaching the end of the 0% window with a balance left, when the card reverts to a high APR — often 20% or more. Set a monthly payment that clears the debt inside the deal, keep paying at least the minimum, and avoid spending on the card. The [balance transfer calculator](/balance-transfer-calculator) checks whether the fee is worth the interest you save.

## Don't forget the basics

No repayment method works if more debt keeps arriving. Pause new spending on the cards, build even a small emergency buffer so a surprise bill does not send you back to credit, and if the debt feels unmanageable, free help from StepChange or Citizens Advice is genuinely good and judgement-free. The [credit card payoff calculator](/credit-card-payoff-calculator) shows how long a single card takes to clear at different monthly payments — often a wake-up call that spurs action.

> [!FAQ]
> Q: Is the snowball or avalanche method better?
> A: The avalanche saves the most money by targeting the highest interest rate first. The snowball clears small debts first for motivation. Choose the avalanche if you are disciplined, the snowball if you need quick wins to stay on track.
>
> Q: Should I pay off my smallest debt or highest-interest debt first?
> A: Highest-interest first is cheapest (avalanche). Smallest-balance first is more motivating (snowball). Both keep minimum payments on everything else while you focus spare cash on one debt.
>
> Q: Do balance transfers actually help?
> A: Yes, if used well. Pausing interest for a fee of 1–3% lets every payment reduce the balance. The key is clearing the debt before the 0% period ends to avoid the high revert rate.
>
> Q: What if I can only afford minimum payments?
> A: Minimum-only payments clear debt very slowly and cost a lot in interest. Even a small extra amount each month, focused on one debt, makes a big difference — and free debt advice can help if you are stuck.
>
> Q: Will paying off debt improve my credit score?
> A: Generally yes. Reducing balances lowers your credit utilisation, a major scoring factor, and clearing debts reduces your commitments — both help over time.

This is general information, not debt advice. If you are struggling, free regulated help is available from StepChange, National Debtline and Citizens Advice.
`.trim(),
  },
  {
    slug: 'child-benefit-high-income-charge-2025-26',
    title: 'Child Benefit and the High Income Charge: Should You Still Claim?',
    description:
      'The High Income Child Benefit Charge explained for 2025/26 — the £60,000 to £80,000 taper, how the charge is worked out, and why you should usually claim even if you repay it.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 9,
    category: 'money',
    tags: ['Child Benefit', 'Income Tax', 'HICBC'],
    relatedTools: [
      { href: '/child-benefit-trap', label: 'Child Benefit Trap', hint: 'High income charge' },
      { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
      { href: '/pension-calculator', label: 'Pension Calculator', hint: 'Reduce adjusted income' },
    ],
    body: `
Child Benefit is paid to anyone bringing up a child, but since 2013 a quirk in the system claws it back from higher earners through the awkwardly named High Income Child Benefit Charge. It catches more families every year, confuses almost everyone, and leads some to opt out when they should not. The thresholds rose in 2024, which helps, but the trap is still real. Here is how it works in 2025/26 and the decision you actually need to make.

> [!KEY] The short version
> Child Benefit is **£26.05 a week** for the eldest child and **£17.25** for each other child in 2025/26.
> The charge starts when the **higher earner's adjusted income passes £60,000**, removing it fully by **£80,000**.
> It is based on the **highest individual income**, not the household total.
> You should usually **still claim** — even if you repay it — to protect your State Pension and your child's NI number.

## What Child Benefit pays

For 2025/26, Child Benefit is worth **£26.05 a week** (about £1,355 a year) for your eldest or only child, plus **£17.25 a week** (about £897 a year) for each additional child. It is not means-tested at the point of payment — anyone responsible for a child can claim. The clawback happens separately, through the tax system.

## The High Income Child Benefit Charge

If you or your partner has an "adjusted net income" over **£60,000**, you start to repay some of the benefit through a tax charge. It is tapered:

> [!STEPS]
> 1. **Below £60,000** — no charge; you keep all the Child Benefit.
> 2. **£60,000 to £80,000** — you repay 1% of the benefit for every £200 of income over £60,000.
> 3. **£80,000 and above** — the charge equals the full benefit; you effectively repay all of it.

So at £70,000 — halfway through the band — you repay half. At £80,000 you repay it all. The thresholds doubled-ish in April 2024 (they used to start at £50,000), which lifted many families out of the charge, but high earners are still caught. Our [Child Benefit trap calculator](/child-benefit-trap) shows your exact position.

> [!STAT] £60,000–£80,000 | The income band over which Child Benefit is gradually clawed back

## The unfairness everyone notices

The charge is based on the **highest single income**, not the household's combined income. That produces an obvious injustice: a couple each earning £55,000 — £110,000 between them — keep all their Child Benefit, while a single earner on £80,000 loses all of theirs. It is widely criticised and politically awkward, but it is the rule, and it shapes the planning.

## The pension lever

Because the charge keys off **adjusted net income**, pension contributions can rescue it. Pension contributions reduce your adjusted income, so paying enough into a pension to drop below £60,000 — or further down the taper — can restore some or all of your Child Benefit. For a higher earner with children, a pension contribution can therefore deliver income tax relief *and* recovered Child Benefit at the same time, an unusually high effective return. The [pension calculator](/pension-calculator) helps you size it, and the [take-home pay tool](/take-home-pay) shows the income effect.

## Should you still claim?

This is where people make a costly mistake. Faced with repaying the benefit, some families simply do not claim it. That can be wrong for two reasons:

> [!WARNING] Opting out can cost you State Pension years
> Claiming Child Benefit gives the at-home parent National Insurance credits that count toward their State Pension while they are not working. Opt out entirely and you can quietly lose qualifying years, worth far more over a lifetime than the benefit you avoided repaying. It also triggers your child's National Insurance number automatically.

The usual answer: **claim the benefit, but tick the box to not receive the payments** if your income means you would repay it all. That way you keep the National Insurance protection without the hassle of repaying through Self Assessment. If your income is in the taper or might fall, take the payments and settle the charge through your tax return.

> [!FAQ]
> Q: At what income do you start losing Child Benefit?
> A: The High Income Child Benefit Charge begins when the higher earner's adjusted net income passes £60,000, and removes the benefit entirely by £80,000.
>
> Q: Is the charge based on household or individual income?
> A: Individual income — specifically the highest earner's. This is why two parents on £55,000 each keep the benefit while a single earner on £80,000 loses it.
>
> Q: How much is Child Benefit in 2025/26?
> A: £26.05 a week for the eldest child and £17.25 a week for each additional child.
>
> Q: Should I stop claiming if I have to repay it?
> A: Usually not. Claim it but opt out of the payments if you would repay it all — that preserves the National Insurance credits toward your State Pension and your child's NI number.
>
> Q: Can a pension contribution help me keep Child Benefit?
> A: Yes. Pension contributions reduce your adjusted net income, so paying enough to drop below or through the £60,000–£80,000 band can restore some or all of the benefit, on top of the normal tax relief.

Figures are 2025/26 estimates. The charge is settled through Self Assessment; check your own position and consider advice if your income is near the thresholds.
`.trim(),
  },
  {
    slug: 'buy-vs-rent-uk-2025',
    title: 'Buy vs Rent in 2025: Does Buying Actually Make Sense?',
    description:
      'An even-handed look at buying versus renting in the UK in 2025 — the true costs on each side, the break-even point, and the questions that decide it for your situation.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'property',
    tags: ['Buy vs Rent', 'Mortgages', 'Property'],
    relatedTools: [
      { href: '/buy-vs-rent', label: 'Buy vs Rent', hint: 'Net worth + break-even' },
      { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Repayment · interest' },
      { href: '/deposit-calculator', label: 'Deposit Calculator', hint: 'How much & how long' },
    ],
    body: `
"Rent is dead money" is the line every would-be buyer hears, usually from someone who bought twenty years ago. It is also only half true. Buying can build wealth, but it comes with costs that renters never see, and there are situations where renting genuinely leaves you better off. The honest answer is not a slogan — it is a calculation that depends on how long you will stay, what you would do with the money, and what you value. Here is how to think about it in 2025.

> [!KEY] The short version
> Buying builds equity, but carries costs renters avoid — **stamp duty, maintenance, and transaction fees**.
> Renting is **flexible and predictable**, with no exposure to maintenance or falling prices.
> Buying usually wins **the longer you stay** — short stays rarely recover the upfront costs.
> The deposit you would tie up has an **opportunity cost** worth weighing against ownership.

## The costs nobody mentions when you buy

The headline comparison — mortgage payment versus rent — misses most of the picture. Owning carries costs a renter never pays:

> [!CHECKLIST] Costs that fall only on owners
> - Stamp duty on purchase (often thousands).
> - Solicitor, survey and mortgage fees.
> - Buildings insurance.
> - Maintenance and repairs — boiler, roof, decorating (budget around 1% of the value a year).
> - Service charges and ground rent on leasehold flats.
> - Estate agent fees and stamp duty again when you move on.

These do not make buying a bad idea — but they mean the true cost of owning is well above the mortgage payment, and they are why a short stay rarely pays off.

## Why time is the deciding factor

The big one-off costs of buying — stamp duty and fees on the way in, agent fees on the way out — are spread over however long you own. Stay two years and they swamp any equity you built. Stay fifteen and they fade into insignificance while your mortgage balance shrinks and (usually) the property gains value. This is the **break-even point**: the number of years before buying overtakes renting. Our [buy vs rent calculator](/buy-vs-rent) estimates it for your figures, projecting net worth on each path over time.

> [!STAT] The longer you stay | The single biggest factor tipping the maths toward buying

## The opportunity cost of the deposit

Here is the argument renters rarely get credit for. A house deposit is a large sum of money. If you rent instead and invest that deposit — and any monthly saving where rent is cheaper than ownership costs — that money can grow. A renter who invests the difference is not necessarily worse off than an owner; they are building wealth in a different asset. Whether buying wins depends partly on how house prices perform versus what your investments would have earned. Neither is guaranteed.

## Where renting genuinely wins

Renting is not a failure state. It is the better choice when:

- You might **move within a few years** — for work, relationships or lifestyle.
- You value **flexibility** and not being tied to one place or one job market.
- You want **no exposure to maintenance** costs or a falling market.
- Buying would stretch you so thin you could not save, invest or absorb a shock.

A renter with a stable, growing investment pot and the freedom to move is in a strong position, not a weak one.

## Where buying genuinely wins

Buying tends to win when:

- You will **stay long enough** to clear the upfront costs — often five years or more.
- You want **stability** and the freedom to make a home your own.
- Your mortgage payment is **comparable to or below** local rent once you are in.
- You value the **forced saving** of paying down a mortgage, which many people stick to better than voluntary investing.

> [!WARNING] Don't buy at the limit of affordability
> Stretching to the absolute maximum the bank will lend leaves no cushion for rate rises, repairs or a change in income. The [mortgage calculator](/mortgage-calculator) shows the repayment, and the [deposit calculator](/deposit-calculator) how long the deposit takes to save — aim to buy comfortably, not at the ceiling.

## So, buy or rent?

There is no universal answer, only the right answer for your circumstances. If you have a stable life, a sufficient deposit, and plan to stay put for years, buying usually builds more wealth and gives you a home that is genuinely yours. If your future is uncertain, your deposit would be better invested, or you simply value flexibility, renting is a perfectly rational — sometimes superior — choice. Run your own numbers before you let a slogan decide.

> [!FAQ]
> Q: Is it better to buy or rent in 2025?
> A: It depends mainly on how long you will stay. Buying usually wins over five-plus years because the upfront costs are spread out; for short stays, renting often leaves you better off.
>
> Q: Is rent really "dead money"?
> A: Not entirely. Rent buys you flexibility and freedom from maintenance and market risk. A renter who invests the deposit they would otherwise tie up can build wealth too.
>
> Q: What costs do buyers pay that renters don't?
> A: Stamp duty, legal and survey fees, buildings insurance, ongoing maintenance, and agent fees and stamp duty again when they move. These add well above the mortgage payment.
>
> Q: How long do I need to stay for buying to pay off?
> A: Often around five years or more, depending on prices, costs and rents. The break-even point is exactly what the buy vs rent calculator estimates.
>
> Q: Should I buy at the maximum the bank will lend?
> A: It is wiser not to. Buying below your ceiling leaves room for rate rises, repairs and income changes, and keeps you able to save and invest.

Figures and conclusions are illustrative — outcomes depend on prices, rates and investment returns, none of which are guaranteed. Treat the calculators as a guide.
`.trim(),
  },
  {
    slug: 'do-i-need-to-register-for-vat-2025-26',
    title: 'Do I Need to Register for VAT? The £90,000 Threshold Explained',
    description:
      'When a UK business must register for VAT in 2025/26 — the £90,000 threshold, voluntary registration, the Flat Rate Scheme, and the traps that catch growing businesses.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'business',
    tags: ['VAT', 'Self-Employed', 'Small Business'],
    relatedTools: [
      { href: '/vat-calculator', label: 'VAT Calculator', hint: 'Add/remove 20% VAT' },
      { href: '/corporation-tax-calculator', label: 'Corporation Tax', hint: '19% / 25% + marginal' },
      { href: '/sole-trader-vs-limited', label: 'Sole Trader vs Limited', hint: 'Take-home compared' },
    ],
    body: `
VAT registration is the milestone every growing small business eyes nervously, because it changes how you price, what you charge clients, and how much admin you carry. Register too late and HMRC can hit you with penalties and a backdated bill; register too early and you may add 20% to your prices for no reason. Knowing exactly when you must — and when you might choose to — is essential. Here is the 2025/26 picture in plain terms.

> [!KEY] The short version
> You **must register** once VAT-taxable turnover passes **£90,000** in any rolling 12 months.
> It is a **rolling** 12-month test, not your accounting year — watch it continuously.
> You **can register voluntarily** below the threshold, which sometimes pays.
> The **Flat Rate Scheme** can simplify VAT for smaller businesses, but check the limited-cost trader trap.

## The £90,000 threshold

You must register for VAT if your **VAT-taxable turnover** exceeds **£90,000** in any rolling 12-month period, or if you expect to cross it within the next 30 days. "VAT-taxable turnover" means your total sales that are not exempt — for most businesses, simply your sales.

> [!WARNING] It is a rolling test, not your tax year
> The single biggest mistake is checking turnover only at the financial year end. The £90,000 test applies to **any** consecutive 12 months. A strong few months can push you over mid-year, and you must register within 30 days of realising you will exceed it. Miss the deadline and HMRC can charge penalties plus the VAT you should have collected.

Once registered, you charge VAT (usually 20%) on your sales, hand it to HMRC, and reclaim the VAT on your business purchases. The [VAT calculator](/vat-calculator) handles adding and removing VAT from any figure.

## What registration actually changes

Crossing the threshold has real consequences:

- You add **20% to your prices** (or absorb it, cutting your margin) — a big deal if your customers are the public and cannot reclaim VAT.
- You can **reclaim VAT** on equipment, stock and expenses, which helps if you buy a lot.
- You take on **quarterly VAT returns** under Making Tax Digital, needing compatible software.

For a business selling to other VAT-registered businesses, registration is often neutral or even helpful — your clients reclaim the VAT you charge, and you reclaim yours. For a business selling to consumers, it can mean a real 20% price rise or margin hit, which is why some deliberately manage turnover near the threshold.

> [!STAT] £90,000 | The rolling-12-month turnover at which VAT registration becomes compulsory

## Voluntary registration: when it pays

You can register **below** £90,000 if you want to. It makes sense when:

- Your customers are mostly **VAT-registered businesses** who reclaim the VAT, so your prices effectively do not rise for them.
- You spend heavily on **VATable costs** — equipment, stock, software — and want to reclaim that input VAT.
- You want the **credibility** of looking like an established, larger business.

It is a poorer idea if you sell to consumers and buy little, since you would be adding 20% to your prices with little to reclaim.

## The Flat Rate Scheme and its trap

Smaller registered businesses can use the **Flat Rate Scheme (FRS)** to simplify VAT: you charge 20% as normal but pay HMRC a fixed, lower percentage of your gross turnover, instead of tracking VAT on every purchase. It cuts admin and can leave a small surplus.

> [!WARNING] Beware the limited-cost trader rate
> If you spend very little on physical goods — typical of consultants and service businesses — you are classed as a "limited cost trader" and must use a high 16.5% flat rate, which is rarely worthwhile. Many people join the FRS expecting their sector's lower rate, only to be caught by this. Check carefully before opting in; the [VAT calculator](/vat-calculator) lets you compare the schemes.

## Deregistration

It works the other way too. If your turnover falls below **£88,000**, you can apply to deregister and stop charging VAT — useful if you scale back. Keeping an eye on the rolling figure cuts both ways.

This sits alongside your other business taxes — see the [corporation tax calculator](/corporation-tax-calculator) for company profits and the [sole trader vs limited comparison](/sole-trader-vs-limited) if you are weighing your structure.

> [!FAQ]
> Q: When do I have to register for VAT?
> A: Once your VAT-taxable turnover exceeds £90,000 in any rolling 12-month period, or when you expect to exceed it within the next 30 days. You must register within 30 days of realising you will cross it.
>
> Q: Is the threshold based on my tax year?
> A: No. It is a rolling 12-month test, so you must monitor turnover continuously, not just at your year end. This catches many growing businesses out.
>
> Q: Should I register voluntarily below £90,000?
> A: It can pay if your customers are VAT-registered businesses or you spend heavily on VATable costs you can reclaim. It is usually a poor idea if you sell to consumers and buy little.
>
> Q: What is the Flat Rate Scheme?
> A: A simplified VAT method where you pay HMRC a fixed percentage of gross turnover instead of tracking VAT on every purchase. Watch the 16.5% limited-cost trader rate, which applies if you buy few physical goods.
>
> Q: Can I deregister from VAT?
> A: Yes. If your turnover falls below £88,000 you can apply to deregister and stop charging VAT.

Figures are 2025/26 estimates. VAT rules are detailed and the penalties for getting registration wrong are real — take accountancy advice if you are near the threshold.
`.trim(),
  },
  {
    slug: 'universal-credit-taper-explained-2025-26',
    title: 'Universal Credit and the 55% Taper, Explained With Examples',
    description:
      'How Universal Credit really works in 2025/26 — the standard allowance, work allowance and the 55% earnings taper — with plain worked examples showing why work always pays.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 11,
    category: 'benefits',
    tags: ['Universal Credit', 'Benefits', 'Work Allowance'],
    relatedTools: [
      { href: '/universal-credit-calculator', label: 'Universal Credit', hint: 'Allowance + elements' },
      { href: '/childcare-calculator', label: 'Childcare Costs', hint: 'Free hours + TFC' },
      { href: '/council-tax-support-checker', label: 'Council Tax Support', hint: 'Reduction eligibility' },
    ],
    body: `
There is a stubborn myth that being on Universal Credit means you are better off not working, or that earning an extra pound gets that pound snatched straight back. Neither is true, and the misunderstanding costs people real money — turning down shifts or hours that would have left them better off. The reality is a system built specifically so that work always pays, through something called the taper. Here is how it actually works in 2025/26.

> [!KEY] The short version
> Your maximum Universal Credit is a **standard allowance** plus extra **elements** for children, housing and disability.
> If you have children or limited capability for work, you get a **work allowance** — earnings you keep in full.
> Above that, UC drops by **55p for every £1** you earn — not pound for pound.
> Because the taper is 55%, not 100%, you are **always** better off overall for working more.

## What makes up your Universal Credit

Universal Credit is not a single fixed payment. It is built up from parts, then reduced by your earnings. The starting point is the **standard allowance**, which depends on your age and whether you are single or a couple. For 2025/26, monthly:

| Your situation | Standard allowance (monthly) |
|---|---|
| Single, under 25 | £316.98 |
| Single, 25 or over | £400.14 |
| Couple, both under 25 | £497.55 |
| Couple, one 25 or over | £628.10 |

On top of that you may get **elements**:

- A **child element** for each child (subject to the two-child limit for most families).
- A **housing element** towards rent.
- An **LCWRA element** if you have limited capability for work and work-related activity.
- A **childcare element** worth up to 85% of childcare costs.
- A **carer element** if you care for someone 35+ hours a week.

Add the standard allowance and your elements together and you have your **maximum** Universal Credit — what you would get with no earnings.

## The work allowance and the 55% taper

This is the part people get wrong. If you have children or limited capability for work, you get a **work allowance** — an amount you can earn each month before UC is reduced at all:

- **£411 a month** if you also get help with housing costs.
- **£684 a month** if you do not.

Earn below your work allowance and your UC is untouched. Earn above it and UC falls by **55p for every extra £1** of take-home pay. It does not vanish; it tapers.

> [!STAT] 55p | How much Universal Credit falls for each extra £1 you earn above the work allowance

## A worked example

Meet a single parent, over 25, with one child and £600 of monthly rent. Their maximum UC is built like this:

> [!STEPS]
> 1. **Standard allowance** — £400.14.
> 2. **Child element** — £339.00.
> 3. **Housing element** — £600.00.
> 4. **Maximum UC** — about £1,339 a month with no earnings.

Now they take a part-time job paying £800 a month after tax. Because they have a child and get housing help, their work allowance is £411:

> [!STEPS]
> 1. **Earnings above the work allowance** — £800 − £411 = £389.
> 2. **Taper reduction** — £389 × 55% = about £214.
> 3. **UC now paid** — £1,339 − £214 = about £1,125.
> 4. **Total monthly income** — £1,125 UC + £800 wages = **£1,925**.

Compare that to not working: £1,339 of UC and nothing else. By working, they are about **£586 a month better off**. Every hour worked adds to their income — that is the whole point of the taper. You can run your own household through the [Universal Credit calculator](/universal-credit-calculator) to see your figures.

## The savings trap people forget

UC is means-tested on capital as well as income:

- **Under £6,000** of savings: ignored entirely.
- **£6,000 to £16,000**: treated as "tariff income" of £4.35 a month for each £250 (or part) above £6,000.
- **Over £16,000**: no Universal Credit at all.

> [!WARNING] The £16,000 cliff is absolute
> If your savings or capital exceed £16,000, your claim stops completely — even with a very low income. This catches people who receive an inheritance or a redundancy payment. Some capital, like a working-age pension pot, is disregarded, so check the rules before assuming you are excluded.

## Childcare: the 85% element

If you work and pay for childcare, UC can repay up to **85%** of your costs, capped at roughly £1,015 a month for one child and £1,739 for two or more. The catch is that you usually have to pay the provider first and claim the money back, and report it each month. It cannot be combined with Tax-Free Childcare — you choose one. Our [childcare calculator](/childcare-calculator) compares the two so you pick the better deal.

## Why "better off not working" is a myth

Under the old benefits system, some people genuinely faced losing nearly all extra income to withdrawal rates above 90%. Universal Credit was designed to end that. With a single 55% taper and a work allowance on top, the maths almost always favours working more. There are edge cases — the benefit cap, very high rents, or the loss of passported benefits — but for the typical household, an extra shift means more money in the bank, not less.

> [!FAQ]
> Q: Will I lose all my Universal Credit if I get a job?
> A: No. UC reduces gradually as you earn, by 55p per £1 above your work allowance, so you keep a meaningful share of every pound. It only reaches zero once your earnings are high enough to taper the whole award away.
>
> Q: What is the work allowance?
> A: It is the amount you can earn each month before the taper starts, available if you have children or limited capability for work — £411 a month if you get housing support, £684 if you do not.
>
> Q: How is Universal Credit paid?
> A: As a single monthly payment in arrears, covering you and your partner if you have one. Most elements are combined into that one payment.
>
> Q: Does the two-child limit affect me?
> A: For most families, the child element is only paid for the first two children born after 6 April 2017, with limited exceptions. Older children and certain circumstances are treated differently.
>
> Q: Can I get Universal Credit with savings?
> A: Yes, up to £16,000. Savings between £6,000 and £16,000 reduce your award through tariff income; above £16,000 you cannot usually claim at all.

Figures are 2025/26 estimates and simplified — they exclude the benefit cap, deductions and individual circumstances. Use the official gov.uk calculator or a welfare adviser for an exact figure.
`.trim(),
  },
  {
    slug: 'electric-car-vs-petrol-running-cost-2026',
    title: 'Is an Electric Car Really Cheaper to Run Than Petrol in 2026?',
    description:
      'A straight answer on electric vs petrol running costs in 2026 — home charging versus public, the new EV road tax, insurance and depreciation, with the real cost per mile.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 11,
    category: 'motoring',
    tags: ['Electric Cars', 'Running Costs', 'EV', 'Fuel'],
    relatedTools: [
      { href: '/ev-charging-cost', label: 'EV Charging Cost', hint: 'Home vs public' },
      { href: '/fuel-cost-calculator', label: 'Fuel Cost', hint: 'Per journey & year' },
      { href: '/vehicle-tax-calculator', label: 'Vehicle Tax (VED)', hint: 'CO2 + standard rate' },
    ],
    body: `
"Electric cars are cheaper to run" is one of those claims that is true, false, and complicated all at once — depending entirely on where you charge. Plug in at home overnight and the savings against petrol are enormous. Rely on public rapid chargers and you might save almost nothing. Add in the road tax that EVs now pay from April 2025, plus insurance and depreciation, and the picture deserves an honest look. Here it is for 2026.

> [!KEY] The honest answer
> Charged **at home on an off-peak tariff**, an EV costs about **2p a mile** versus roughly **14p** for a 45 MPG petrol car.
> Charged mostly on **public rapids** (60–85p/kWh), the cost can rival petrol.
> **EVs now pay road tax** (£195 standard) since April 2025 — the exemption is gone.
> Your **home-versus-public charging split** decides whether you actually save.

## The number that matters: cost per mile

Strip away the noise and running cost comes down to one figure — pence per mile — built from two numbers: how far the car travels per kWh (its efficiency, typically 3 to 4 miles/kWh) and what you pay per kWh.

| Where you charge | Price per kWh | Cost per mile (at 3.5 mi/kWh) |
|---|---|---|
| Home, off-peak EV tariff | about 7p | about 2p |
| Home, standard cap rate | about 27p | about 8p |
| Public rapid charger | 60–85p | about 20p |

Now compare petrol. A 45 MPG car at £1.40 a litre costs about **14p a mile** in fuel. So a home-charged EV is roughly seven times cheaper per mile, while a public-only EV is actually *dearer* than petrol. The whole argument lives in that table.

## A full-year comparison

Take someone driving 9,000 miles a year who charges 80% at home and 20% on public rapids:

> [!STEPS]
> 1. **Energy used** — 9,000 ÷ 3.5 = about 2,570 kWh a year.
> 2. **Home charging** — 80% at 7p = about £144.
> 3. **Public charging** — 20% at 75p = about £386.
> 4. **Total charging cost** — about £530 a year.

The equivalent 45 MPG petrol car covering the same 9,000 miles burns roughly £1,270 of fuel. So this driver saves about **£740 a year on energy alone**. Our [EV charging calculator](/ev-charging-cost) lets you set your own split and tariff, and the [fuel cost calculator](/fuel-cost-calculator) does the petrol side.

> [!STAT] £740 | Typical yearly energy saving for a mostly-home-charged EV vs petrol

## The costs people forget

Energy is not the whole story. Three other lines can shift the verdict:

- **Road tax.** Since 1 April 2025, electric cars pay Vehicle Excise Duty — a £10 first-year rate then the £195 standard rate, plus the £425 expensive-car supplement if the list price topped £40,000 (which many EVs do). The free-tax era is over. Check yours on the [vehicle tax calculator](/vehicle-tax-calculator).
- **Insurance.** EVs can cost more to insure — pricier parts, specialist repairs and higher values. Always quote before assuming savings.
- **Depreciation.** This is the wild card. EV used values have been volatile, and a car that loses value faster can wipe out years of fuel savings. Buy wisely.

> [!WARNING] No home charger changes everything
> The entire EV cost advantage assumes cheap home charging. Without off-street parking and a home charger, you depend on public networks at 60–85p/kWh, and the running-cost case largely collapses. Be brutally honest about where you will actually charge before you buy.

## Servicing: a quiet EV win

One area where EVs reliably save is maintenance. No oil changes, no cambelt, no exhaust, far fewer moving parts and regenerative braking that spares the brake pads. Servicing is typically cheaper and less frequent — a genuine, if undramatic, saving that adds up over years of ownership.

## So, cheaper or not?

If you can charge at home on an off-peak tariff and you do average mileage, **yes — clearly cheaper to run**, often by £700+ a year on energy plus servicing savings, even after the new road tax. If you would rely on public rapid charging, the honest answer is **probably not** — you would buy an EV for the driving experience and emissions, not to save money. The deciding factor is not the car. It is the plug you use.

> [!FAQ]
> Q: How much does it cost to charge an electric car at home?
> A: On a standard tariff, about 8p a mile; on a dedicated off-peak EV tariff around 7p/kWh, roughly 2p a mile — far cheaper than petrol at about 14p a mile.
>
> Q: Do electric cars pay road tax now?
> A: Yes. From 1 April 2025 EVs pay Vehicle Excise Duty — a £10 first-year rate then £195 standard, plus the expensive-car supplement if the list price was over £40,000.
>
> Q: Is public charging really as expensive as petrol?
> A: It can be. Rapid public chargers often cost 60–85p/kWh, working out around 20p a mile — similar to or more than petrol. Home charging is where EVs save.
>
> Q: Are electric cars cheaper to service?
> A: Generally yes. With no oil, exhaust or cambelt and fewer moving parts, EV servicing is usually cheaper and less frequent than for a petrol car.
>
> Q: Will an EV save me money overall?
> A: If you charge mostly at home on an off-peak tariff, very likely. If you depend on public rapids, probably not — weigh insurance and depreciation alongside energy before deciding.

Figures are 2026 estimates and vary with tariffs, driving style, weather and model. Treat the calculators as a guide and get your own insurance and charging quotes.
`.trim(),
  },
  {
    slug: 'ofgem-energy-price-cap-explained-2025-26',
    title: 'How the Ofgem Price Cap Actually Works (And Why Your Bill Differs)',
    description:
      'The Ofgem energy price cap explained for 2025/26 — what it really limits, why it is not a cap on your total bill, how standing charges work, and how to cut what you pay.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'energy',
    tags: ['Energy Bills', 'Price Cap', 'Ofgem'],
    relatedTools: [
      { href: '/energy-bill', label: 'Energy Bill', hint: 'Ofgem price cap' },
      { href: '/solar-panel-roi', label: 'Solar Panel ROI', hint: 'Payback + export' },
      { href: '/heat-pump-calculator', label: 'Heat Pump', hint: 'Running cost vs gas' },
    ],
    body: `
Every three months the news announces a new energy "price cap" figure, and every three months people misunderstand what it means. They hear "the cap is £1,800" and assume their bill cannot exceed £1,800. It can — easily. The cap does not limit your bill at all. It limits something else entirely, and knowing the difference is the first step to actually controlling what you pay. Here is how it really works in 2025/26.

> [!WARNING] The cap is not a limit on your total bill
> Ofgem's price cap limits the **unit rate** and the **standing charge** your supplier can charge — not the amount you owe. Use more energy and you pay more, with no ceiling. The "typical bill" figure you see in headlines is just the cap applied to an average household's usage.

## The two parts of every energy bill

For each fuel — gas and electricity — your bill is built from two components:

- **The unit rate**: the price for each kWh of energy you actually use.
- **The standing charge**: a fixed daily fee just for being connected, whether you use any energy or not.

For the current cap window, the GB-average capped rates are roughly:

| | Unit rate | Standing charge |
|---|---|---|
| Electricity | about 27p per kWh | about 54p per day |
| Gas | about 7p per kWh | about 33p per day |

Multiply your usage by the unit rate, add a year of standing charges, and that is your bill. The cap sets the *rates* in that calculation — not the total. Two homes on the same capped tariff can have wildly different bills because one uses twice the energy.

## Why the headline "typical bill" misleads

When Ofgem quotes a figure like "£1,800 a year," that is the cap applied to its **typical domestic consumption** — about 2,700 kWh of electricity and 11,500 kWh of gas a year. If your home is bigger, colder, or busier, you will use more and pay more. If you are out all day in a small flat, you will pay less. The headline number describes an imaginary average household, not you. Our [energy bill calculator](/energy-bill) lets you put in your own kWh from a recent bill for a figure that actually reflects your home.

> [!STAT] 2,700 / 11,500 | The kWh of electricity / gas Ofgem assumes for its "typical" household

## Standing charges: paying before you use anything

The part that frustrates people most is the standing charge. Across gas and electricity it now adds up to over **£300 a year** before you have switched on a single light. It covers the cost of the networks, meters and various policy costs, and crucially it is the same whether you are away for a month or running everything at once. Low users feel this keenly — a tiny flat used occasionally can still cost hundreds a year in standing charges alone.

## How to actually cut your bill

Because the cap fixes the rates, the only levers left are how much you use and which tariff you are on:

> [!CHECKLIST] Practical ways to lower your bill
> - Turn the thermostat down by 1°C — heating dominates gas use and this alone can cut around 10% of heating cost.
> - Draught-proof, and improve loft and cavity-wall insulation where you can.
> - Submit regular meter readings so you are billed on real usage, not estimates.
> - Compare any fixed deal's unit rate against the current cap before switching.
> - Consider time-of-use tariffs if you can shift usage to cheaper overnight hours.

For bigger structural savings, two technologies change the maths entirely. [Solar panels](/solar-panel-roi) cut the electricity you buy from the grid, and a [heat pump](/heat-pump-calculator) can lower heating costs — both worth modelling against your actual usage.

## Should you fix your tariff?

A fixed deal gives certainty and can sometimes beat the cap, but it locks you in and may carry exit fees. The cap, by contrast, moves every quarter — sometimes down, sometimes up. There is no universal right answer: compare the fixed unit rate and standing charge against the current cap, factor in your appetite for certainty, and decide. Do not assume "fixed" automatically means "cheaper."

> [!FAQ]
> Q: Does the price cap limit my total energy bill?
> A: No. It caps the unit rate and standing charge your supplier can charge. If you use more energy, you pay more — there is no ceiling on the total amount.
>
> Q: How often does the cap change?
> A: Every quarter. Ofgem announces the next cap a few weeks before each three-month window begins, so rates can shift up or down four times a year.
>
> Q: Why is my bill different from the headline figure?
> A: The headline "typical bill" applies the cap to an average household's usage. Your bill depends on your actual consumption, your region's rates, and your payment method.
>
> Q: What is a standing charge and can I avoid it?
> A: It is a fixed daily fee for being connected to the gas and electricity networks, payable regardless of usage. A few tariffs offer lower or zero standing charges but usually with higher unit rates — worth it only for very low users.
>
> Q: Is a fixed tariff cheaper than the cap?
> A: Sometimes. Compare the fixed unit rate and standing charge against the current cap before committing, and check for exit fees. Fixing buys certainty, not guaranteed savings.

Figures are estimates at GB-average Direct Debit cap rates for the current window. Your real rates vary by region and payment method, and the cap changes every quarter.
`.trim(),
  },
  {
    slug: 'cost-of-divorce-england-2025',
    title: 'What Does a Divorce Really Cost in England in 2025?',
    description:
      'The real cost of divorce in England in 2025 — the £593 court fee, why you still need a financial order, solicitor fee ranges, and how contested cases run into five figures.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'family',
    tags: ['Divorce', 'Family Law', 'Costs'],
    relatedTools: [
      { href: '/divorce-cost-calculator', label: 'Divorce Cost', hint: 'Court + legal fees' },
      { href: '/child-maintenance-calculator', label: 'Child Maintenance', hint: 'CMS formula' },
      { href: '/financial-settlement-calculator', label: 'Financial Settlement', hint: 'Asset split' },
    ],
    body: `
Ask what a divorce costs and you will get answers ranging from "£593" to "tens of thousands." Both can be right, because the divorce itself and sorting out the money are two completely separate things — and it is the second that drives the bill. Since the no-fault rules arrived in 2022, ending the marriage on paper is cheap and straightforward. Deciding who gets what is where the cost lives. Here is the honest breakdown for England in 2025.

> [!KEY] The short version
> The divorce **court fee is fixed at £593**, the same whether you use a solicitor or not.
> A straightforward, agreed divorce can be done yourself for little more than that fee.
> You should still get a **financial order** (£53 court fee plus legal drafting) — without it, claims can resurface years later.
> **Contested** cases over money or children are where costs run into the thousands, sometimes far more.

## The court fee: a flat £593

The application fee to divorce in England and Wales is **£593**. It is the same whether you apply on your own or jointly, and whether or not a solicitor is involved. If you are on a low income or certain benefits, the Help with Fees scheme may reduce or waive it. That single fee is the only unavoidable cost of the divorce itself.

## The cheapest route: do it yourself

Since the introduction of no-fault divorce, the process is a guided online application with a built-in minimum timeline of about 26 weeks. For a couple who agree, with no complications, there is genuinely nothing stopping you completing it yourselves for just the £593 (plus a few pounds for document copies). No blame, no court hearing, no solicitor required.

## Where the real money goes: the finances

Here is the crucial point that catches people out. **The divorce does not settle your finances.** Ending the marriage and dividing your money, property and pensions are separate legal steps. To make a financial agreement legally binding you need a **financial order** — often a consent order if you agree — which costs a £53 court fee plus whatever a solicitor charges to draft it (commonly a few hundred to a couple of thousand pounds).

> [!WARNING] Skipping the financial order is the biggest mistake
> If you divorce without a sealed financial order, your ex-spouse can bring a financial claim against you — sometimes years later, even after the divorce is final, and even against money you earn afterwards. A famous case saw a claim succeed more than two decades on. Only a court-sealed order gives you a clean break.

## What solicitors actually cost

Legal fees are the variable that turns a £600 divorce into a £10,000 one:

| Route | Typical cost |
|---|---|
| DIY, agreed, no solicitor | £593 court fee only |
| Solicitor, uncontested | £600–£1,500 |
| Consent order drafting | £53 court fee + a few hundred to ~£1,500 legal |
| Contested (money or children disputed) | £3,000–£15,000+ each, sometimes much more |

The jump to the bottom row happens when you cannot agree and the matter heads toward court. Every letter, negotiation and hearing adds cost — to both sides. You can sketch your own likely range with the [divorce cost calculator](/divorce-cost-calculator).

## Mediation: usually far cheaper than fighting

Before most contested financial cases can go to court, you are expected to consider **mediation** — a trained neutral helping you reach agreement. At roughly £500 or so it is dramatically cheaper than litigation, faster, and tends to leave relationships less scorched, which matters enormously if you share children. It does not work for every couple, but where it does, it can save five figures.

## The two things divorce does not include

Two costs sit alongside the divorce and are handled separately:

- **Child maintenance** — worked out by the Child Maintenance Service formula based on the paying parent's income, number of children and shared care. Estimate it with the [child maintenance calculator](/child-maintenance-calculator).
- **Dividing assets** — the home, savings and pensions, which start from a position of equal sharing and adjust for needs. The [financial settlement calculator](/financial-settlement-calculator) gives a rough starting point, though real outcomes depend on your circumstances.

> [!FAQ]
> Q: How much is the divorce court fee in 2025?
> A: It is £593 in England and Wales, regardless of whether you use a solicitor or apply jointly. Fee reductions are available on low incomes through Help with Fees.
>
> Q: Can I get divorced without a solicitor?
> A: Yes. The no-fault process can be completed online yourself, but it is strongly advisable to get legal help with the financial settlement, which the divorce itself does not resolve.
>
> Q: Do I really need a financial order if we agree?
> A: Yes. Only a court-sealed financial order makes your agreement binding and prevents future claims. An informal understanding, however amicable, leaves the door open.
>
> Q: Why are some divorces so expensive?
> A: The divorce itself is cheap. Costs escalate when finances or children are disputed and the matter moves toward court, where legal fees on both sides can reach five figures.
>
> Q: How long does a divorce take?
> A: The no-fault process has a built-in minimum of about 26 weeks (six months) from application to final order. Sorting out the finances can take longer and is handled in parallel.

Figures are 2025 estimates for England and Wales. Scotland and Northern Ireland have separate processes. Solicitor ranges are indicative — always get written quotes.
`.trim(),
  },
  {
    slug: 'salary-sacrifice-pension-explained-2025-26',
    title: 'Salary Sacrifice: A Pay Rise the Taxman Helps Fund',
    description:
      'How pension salary sacrifice works in 2025/26 — the income tax and National Insurance you save, a worked example, the employer NI bonus, and the traps to avoid.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'money',
    tags: ['Salary Sacrifice', 'Pensions', 'Take-Home Pay', 'Tax'],
    relatedTools: [
      { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
      { href: '/pension-calculator', label: 'Pension Calculator', hint: 'Pot at retirement' },
      { href: '/national-insurance-calculator', label: 'National Insurance', hint: 'Class 1 / 4 NI' },
    ],
    body: `
Salary sacrifice is one of the few genuinely free wins in personal finance, and most people who could use it do not. The idea sounds counterintuitive — agree to a lower salary — but what you are really doing is rerouting money into your pension before tax and National Insurance can touch it, often with your employer chipping in their saving too. Done right, it turns roughly £100 of "lost" salary into noticeably more than £100 in your pension. Here is exactly how it works in 2025/26.

> [!KEY] The short version
> You swap part of your **gross salary** for a pension contribution, so it is never taxed as income.
> You save **income tax and employee National Insurance** on the sacrificed amount.
> Many employers pass back their **15% employer NI saving** too, boosting your pot further.
> Your take-home falls by **less** than the amount contributed — the taxman funds the gap.

## What salary sacrifice actually is

In a normal pension, you pay in from your take-home pay and claim some tax back. With **salary sacrifice**, you formally agree to a lower salary, and your employer pays the difference directly into your pension. Because that money never counts as your salary, it is never subject to income tax or National Insurance in the first place. It is the same destination — your pension — reached by a more tax-efficient route.

## The savings, line by line

Say you sacrifice £100 of monthly salary. As a basic-rate taxpayer you would otherwise have paid:

- **20% income tax** on that £100 = £20.
- **8% employee NI** = £8.

So that £100 of gross salary was only ever going to be £72 in your pocket. Through sacrifice, the full £100 goes into your pension instead. Your take-home drops by just £72, but £100 lands in your pot — an instant uplift before any investment growth.

> [!STAT] £72 | What £100 of pension salary sacrifice actually costs a basic-rate taxpayer in lost take-home

For a higher-rate taxpayer it is even better: 40% tax plus 2% NI means £100 into the pension costs only about £58 of take-home.

## The employer NI bonus

Here is the part that makes salary sacrifice better than an ordinary pension. When you sacrifice salary, your **employer** also saves their National Insurance — 15% in 2025/26 — on the amount. Generous employers pass some or all of that saving into your pension on top. On a £100 sacrifice that is up to another £15, so £115 could land in your pot for your £72 of foregone take-home. Always check your scheme's rules to see whether the employer NI saving is shared.

## A worked example

Take someone earning £45,000 who decides to sacrifice 5% of salary — £2,250 a year — into their pension:

> [!STEPS]
> 1. **Salary for tax** drops from £45,000 to £42,750.
> 2. **Tax and NI saved** on the £2,250 — about 20% + 8% = roughly £630.
> 3. **Net take-home cost** — about £1,620 for the year.
> 4. **Into the pension** — the full £2,250, plus any shared employer NI saving.

So roughly £1,620 of reduced take-home becomes £2,250+ of retirement savings. Model the long-term effect with the [pension calculator](/pension-calculator), and check the take-home impact on the [take-home pay tool](/take-home-pay).

## The traps to watch

Salary sacrifice is powerful but not for everyone:

> [!WARNING] You cannot sacrifice below the minimum wage
> Salary sacrifice cannot reduce your effective pay below the National Minimum Wage. If you are a lower earner, your employer may have to limit or refuse the sacrifice. This is the most common reason a scheme cannot be used in full.

Other points to keep in mind:

- A lower headline salary can affect **mortgage borrowing**, life cover based on salary, and statutory payments like maternity pay — though pension contributions are usually viewed favourably by lenders.
- It only helps if your employer **offers** a salary sacrifice scheme; not all do.
- Contributions still count toward the **annual allowance** (usually £60,000), so very large sacrifices need checking.

## Why it is the smartest use of a pay rise

If you get a raise and do not need all of it, sacrificing the extra into your pension is often the most efficient thing you can do with it — especially if the rise pushes you over a threshold like £50,270 or £100,000, where each pound is taxed much harder. Sacrificing enough to drop back under the line can be worth far more than the contribution itself. It is the same lever, used deliberately.

> [!FAQ]
> Q: How does pension salary sacrifice save money?
> A: You give up part of your gross salary in exchange for an employer pension contribution, so that money is never taxed as income or subject to National Insurance. Your take-home falls by less than the amount contributed.
>
> Q: How much does it actually cost me?
> A: For a basic-rate taxpayer, about £72 of take-home for every £100 into the pension; for a higher-rate taxpayer, around £58 — before any employer NI saving is added.
>
> Q: What is the employer NI bonus?
> A: When you sacrifice salary, your employer saves their 15% National Insurance on it. Many employers add some or all of that saving to your pension, making salary sacrifice more generous than a standard pension contribution.
>
> Q: Can everyone use salary sacrifice?
> A: Only if your employer offers a scheme, and only down to the National Minimum Wage. Lower earners may be limited, and you should check the effect on mortgage applications and statutory pay.
>
> Q: Does it affect my State Pension?
> A: Sacrifice usually keeps you above the level needed to protect your State Pension record, but very large reductions for low earners should be checked, as National Insurance credits depend on earnings.

Figures are 2025/26 estimates for England, Wales and Northern Ireland. Salary sacrifice rules and scheme terms vary by employer — check yours and take advice for large contributions.
`.trim(),
  },
  {
    slug: 'how-much-mortgage-can-i-borrow-2025-26',
    title: 'How Much Mortgage Can I Actually Borrow on My Salary?',
    description:
      'How much you can borrow for a mortgage in 2025/26 — the income multiple lenders use, affordability and stress tests, how deposit and debts change the figure, with examples.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'property',
    tags: ['Mortgages', 'Affordability', 'Buying'],
    relatedTools: [
      { href: '/mortgage-affordability', label: 'Mortgage Affordability', hint: 'How much can I borrow?' },
      { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Repayment · interest' },
      { href: '/deposit-calculator', label: 'Deposit Calculator', hint: 'How much & how long to save' },
    ],
    body: `
Before you fall in love with a house, it pays to know the number that decides everything: how much a lender will actually let you borrow. It is rarely as much as people hope, and it is not a single figure — it flexes with your deposit, your debts and the lender's stress test. Get a realistic estimate first and you save yourself the heartbreak of viewing homes you can never finance. Here is how lenders work it out in 2025/26.

> [!KEY] The short version
> Most lenders cap borrowing at around **4 to 4.5 times** your annual income.
> They then run an **affordability and stress test** on your actual outgoings, which can lower that.
> Existing **debts, credit commitments and childcare** reduce how much you can borrow.
> A bigger **deposit** unlocks lower rates and sometimes more generous lending.

## The starting point: the income multiple

The headline rule of thumb is the **income multiple**. Most lenders will advance roughly **4 to 4.5 times** your gross annual income, though some go higher for strong applicants or specific schemes. For a single applicant earning £40,000:

> [!STEPS]
> 1. **At 4x income** — £40,000 × 4 = £160,000.
> 2. **At 4.5x income** — £40,000 × 4.5 = £180,000.
> 3. **Joint applicants** combine incomes, so a couple earning £40,000 each could borrow toward £320,000–£360,000.

That gives a ballpark, but it is only the ceiling. The actual offer comes from the affordability assessment.

> [!STAT] 4–4.5x | The income multiple most UK lenders use as a starting point

## The affordability and stress test

Since the mortgage rules tightened after the financial crisis, lenders cannot just multiply your salary and lend. They must check you can afford the repayments — not only at today's rate, but at a higher **stressed** rate, to be sure you could cope if rates rose. They look at your real monthly picture:

- Your take-home pay.
- Committed outgoings: existing loans, credit cards, car finance, childcare.
- Living costs and the number of dependants.

If your outgoings are high relative to income, the amount you can borrow falls below the headline multiple. If you are debt-free with low commitments, you may reach or exceed it. Our [mortgage affordability calculator](/mortgage-affordability) applies this logic so you get a realistic figure, not just a multiple.

## How debts shrink your borrowing

This is where would-be buyers get caught out. Every monthly commitment reduces what a lender will offer, often by far more than the payment itself. A £250-a-month car finance deal can cut your maximum mortgage by several thousand pounds, because the lender projects that commitment across the affordability calculation. Clearing or reducing debts before you apply can meaningfully increase what you can borrow.

> [!WARNING] Lenders see your credit commitments
> Outstanding loans, credit-card balances, car finance, buy-now-pay-later and even a large agreed overdraft all show on your credit file and feed the affordability test. Tidy your finances for three to six months before applying — pay down balances and avoid new credit.

## The deposit changes everything

How much you put down does two things. First, it directly reduces how much you need to borrow. Second, it affects the **loan-to-value (LTV)** — the percentage of the property's value you are borrowing — which drives the interest rate you are offered:

| Deposit | LTV | Typical effect |
|---|---|---|
| 5% | 95% | Highest rates, fewer deals |
| 10% | 90% | Better choice and pricing |
| 25%+ | 75% or less | Lowest rates, widest choice |

A bigger deposit not only shrinks the loan but cuts the interest rate, lowering your monthly payment and improving affordability — a double benefit. The [deposit calculator](/deposit-calculator) shows how long it takes to save to each LTV band, and the [mortgage calculator](/mortgage-calculator) turns a loan size into a monthly repayment.

## A realistic worked example

A couple earning £35,000 and £30,000 — £65,000 combined — with a £30,000 deposit and no significant debts:

> [!STEPS]
> 1. **Income multiple** — £65,000 × 4.5 = about £292,500 maximum loan.
> 2. **Add the deposit** — £292,500 + £30,000 = a property budget around £322,000.
> 3. **Affordability check** — with no debts and modest outgoings, they likely reach near the top of that range; with a car loan and childcare, expect it to come down.

It is a starting frame, not a promise — only a lender's full assessment (or a mortgage broker) gives a firm figure.

> [!FAQ]
> Q: How many times my salary can I borrow for a mortgage?
> A: Typically 4 to 4.5 times your gross annual income, though some lenders offer more for strong applicants or specific schemes. The final amount depends on the affordability assessment.
>
> Q: Does my partner's income count?
> A: Yes. Joint applicants combine incomes, so two earners can usually borrow considerably more than one — subject to the same affordability and stress testing.
>
> Q: Why can I borrow less than 4.5x my salary?
> A: Existing debts, credit commitments, childcare and high living costs reduce affordability. The stress test also checks you could cope with higher interest rates, which can lower the figure.
>
> Q: How does my deposit affect borrowing?
> A: A bigger deposit reduces the loan you need and lowers the loan-to-value, unlocking better interest rates and wider lender choice — which in turn improves affordability.
>
> Q: Should I use a mortgage broker?
> A: A broker can search the whole market, match you to lenders likely to accept you, and often secure better rates — particularly useful if your situation is non-standard.

Figures are 2025/26 estimates and illustrative only. Lending decisions depend on each lender's criteria and a full affordability assessment — treat calculator results as a guide and seek professional mortgage advice.
`.trim(),
  },
  {
    slug: 'how-much-tax-on-50000-salary-uk-2025-26',
    title: 'How Much Tax Will I Pay on £50,000 in 2025/26?',
    description:
      'A clear, worked breakdown of the income tax and National Insurance on a £50,000 UK salary in 2025/26 — what lands in your bank each month, and the 40% trap just above it.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 11,
    category: 'money',
    tags: ['Income Tax', 'Take-Home Pay', 'National Insurance'],
    relatedTools: [
      { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
      { href: '/national-insurance-calculator', label: 'National Insurance', hint: 'Class 1 / 4 NI' },
      { href: '/pension-calculator', label: 'Pension Calculator', hint: 'Pot at retirement' },
    ],
    body: `
"How much will I actually take home?" is the question every job offer really comes down to, and the answer is never the headline number. A £50,000 salary sounds tidy and round, but by the time HMRC has taken income tax and National Insurance, what reaches your account is noticeably less. Here is exactly where the money goes in 2025/26 — and why £50,000 happens to sit at one of the most awkward spots in the whole tax system.

> [!STAT] £39,520 | Roughly what you keep from £50,000 after tax and NI in 2025/26

> [!KEY] The short version
> Income tax on £50,000 is **£7,486**, and employee National Insurance is **£2,994**.
> That leaves about **£39,520 a year**, or **£3,293 a month**, before pension or student loan.
> Your whole salary sits in the **20% basic-rate band** — you are £270 short of where 40% tax begins.
> A pension contribution is the single most efficient way to keep more of a pay rise from here.

## Where the £50,000 actually goes

The UK taxes income in slices, not all at once. Two separate deductions come out of an ordinary employee's salary: **income tax**, collected by HMRC, and **National Insurance**, which funds the State Pension and contributory benefits. They use different thresholds, which is why the maths looks fiddlier than it should.

For 2025/26 the numbers that matter are:

| Allowance / threshold | 2025/26 figure |
|---|---|
| Personal allowance (tax-free) | £12,570 |
| Basic rate (20%) up to | £50,270 |
| Higher rate (40%) from | £50,270 |
| NI primary threshold | £12,570 |
| NI upper earnings limit | £50,270 |

Notice that both the basic-rate ceiling and the NI upper limit land on the same number — £50,270. That is not a coincidence; the system is built so the higher-rate band and the lower NI rate begin together. A £50,000 salary slides in just underneath both.

## Step one: income tax

You do not pay tax on the first £12,570 — that is your personal allowance. Everything above it, up to £50,270, is taxed at 20%.

> [!STEPS]
> 1. **Start with the salary** — £50,000 gross.
> 2. **Remove the personal allowance** — £50,000 − £12,570 = £37,430 of taxable income.
> 3. **Apply 20%** — £37,430 × 0.20 = £7,486 of income tax for the year.

Because £37,430 fits comfortably inside the £37,700-wide basic-rate band, none of your income is taxed at 40%. Every extra pound up to £50,270 is still only 20%. That matters for what comes next.

## Step two: National Insurance

National Insurance has its own band. For 2025/26, employees pay **8%** on earnings between £12,570 and £50,270, then just 2% above that. At £50,000 you are entirely inside the 8% band:

> [!STEPS]
> 1. **Earnings above the NI threshold** — £50,000 − £12,570 = £37,430.
> 2. **Apply 8%** — £37,430 × 0.08 = £2,994.40 of National Insurance for the year.

Put the two together and HMRC takes £7,486 + £2,994 = **£10,480**, leaving you with **£39,520 a year** — about **£3,293 a month**. Our [take-home pay calculator](/take-home-pay) does this instantly if you want to plug in your own number, but it is worth seeing the slices once so the deductions stop feeling random.

## The 40% trap hiding just above you

Here is the part that surprises people. At £50,000 your **effective** tax rate — total tax and NI divided by salary — is about 21%. But your **marginal** rate, what you lose on the next pound, is about to jump.

Up to £50,270 each extra pound costs you 20% tax plus 8% NI — 28% gone. The moment you cross £50,270, that same pound costs 40% tax plus 2% NI — 42% gone. So a pay rise from £50,000 to £55,000 does not feel like a £5,000 rise; the slice above £50,270 is taxed far harder than everything below it.

> [!WARNING] This is also where Child Benefit starts to bite
> If you or your partner claim Child Benefit, the High Income Child Benefit Charge begins clawing it back once *adjusted net income* passes £60,000, fully removing it by £80,000. A pay rise into that zone can be startlingly inefficient once lost benefit is counted. See our [Child Benefit trap guide](/child-benefit-trap) for the full picture.

## How to actually keep more of it

You cannot change the tax bands, but you can change the income they are measured against. The cleanest lever is a **pension contribution**.

Say you pay 5% of salary — £2,500 — into a workplace pension by salary sacrifice. Your taxable salary drops to £47,500. You save 20% tax and 8% NI on that £2,500 — about £700 — and your employer often saves their NI too, which good schemes pass back into your pot. You have not lost £2,500 of spending power; you have moved roughly £1,800 of net pay into long-term savings and let HMRC fund the rest. The [pension calculator](/pension-calculator) shows what that compounds to over a career.

The same trick is what rescues people earning just over £50,270 or £100,000 — sacrificing enough salary to drop back under a threshold can be worth far more than the contribution itself.

## What about student loans?

If you are repaying a student loan, that is a third deduction on top. Most recent graduates are on **Plan 2**, which takes 9% of income above £28,470. On £50,000 that is 9% × (£50,000 − £28,470) = about **£1,938 a year**, or £161 a month, dropping your take-home to roughly £37,580. Plan 1, Plan 4 and the postgraduate loan use different thresholds and rates — our [student loan calculator](/student-loan-repayment) handles whichever you are on.

> [!STAT] £3,293 | Monthly take-home on £50,000 — before pension or student loan

## A quick reality check on "£50k"

It is worth remembering what £50,000 buys in 2025. It is comfortably above the UK median full-time salary, but it is also the level at which you stop being a straightforward basic-rate taxpayer and start having to think about thresholds, the 40% band, and benefit tapers. The jump from "I just get paid" to "I need to plan around tax" happens right around here — which is exactly why this salary attracts so many searches.

> [!FAQ]
> Q: Is £50,000 a higher-rate taxpayer?
> A: Not quite. Higher-rate tax (40%) starts at £50,270 of taxable income in 2025/26, so a £50,000 salary stays entirely in the 20% basic-rate band. You are £270 of salary away from the higher rate.
>
> Q: How much is £50,000 a month after tax?
> A: About £3,293 a month before any pension or student loan deductions — £39,520 across the year. A 5% pension or a Plan 2 student loan will each reduce that further.
>
> Q: Why is my National Insurance different from my income tax?
> A: They are separate systems with their own thresholds and rates. Income tax uses the £12,570 personal allowance and 20%/40% bands; NI charges 8% between £12,570 and £50,270, then 2%. They only line up at the top of the basic-rate band.
>
> Q: Does a pension contribution really save tax at this salary?
> A: Yes. Contributions made before tax (salary sacrifice or net-pay schemes) reduce the income that tax and NI are charged on, saving roughly 28% on each pound contributed at this level — plus any employer NI saving a good scheme returns to you.
>
> Q: What happens to my take-home if I get a £5,000 pay rise?
> A: The slice above £50,270 is taxed at 40% plus 2% NI, so you keep about 58p in the pound on that part rather than 72p. The rise is still worthwhile, just less than the headline suggests — model it on the [take-home calculator](/take-home-pay).

The figures here are 2025/26 estimates for England, Wales and Northern Ireland; Scotland sets its own income tax bands. Always treat take-home estimates as a guide and check your own payslip and tax code.
`.trim(),
  },
  {
    slug: 'sole-trader-vs-limited-company-tax-2025-26',
    title: 'Sole Trader vs Limited Company: Which Leaves You Better Off?',
    description:
      'An honest, worked comparison of sole trader versus limited company take-home pay in 2025/26 — the real tax difference at £60,000 profit, and the costs that quietly cancel it out.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 12,
    category: 'business',
    tags: ['Sole Trader', 'Limited Company', 'Corporation Tax', 'Self-Employed'],
    relatedTools: [
      { href: '/sole-trader-vs-limited', label: 'Sole Trader vs Limited', hint: 'Take-home compared' },
      { href: '/corporation-tax-calculator', label: 'Corporation Tax', hint: '19% / 25% + marginal' },
      { href: '/salary-vs-dividend-calculator', label: 'Salary vs Dividend', hint: 'Optimal director split' },
    ],
    body: `
Every freelancer, contractor and small business owner eventually hits the same fork in the road: should you carry on as a sole trader, or set up a limited company? The internet will tell you the company "saves tax," and at certain profit levels that is true. But the saving is smaller than people think, it arrives with strings attached, and below a certain income it disappears entirely once you count the cost of running the company. Here is the honest version, with the numbers worked through.

> [!KEY] The honest summary
> A limited company can leave you with **more take-home** once profits comfortably clear the personal allowance.
> At **£60,000 profit** the difference in 2025/26 is roughly **£700 a year** — real, but modest.
> Accountancy fees of **£1,000–£2,000** can wipe out that saving at lower profits.
> The decision is rarely just about tax — liability, admin, IR35 and pensions all matter.

## How a sole trader is taxed

As a sole trader, you and the business are legally the same person. There is no corporation tax, no Companies House filing, and your profit is simply your income. You pay **income tax** and **Class 4 National Insurance** through Self Assessment.

For 2025/26 that means, on your profit:

- Income tax: 20% above the £12,570 personal allowance, then 40% above £50,270.
- Class 4 NI: 6% on profit between £12,570 and £50,270, then 2% above.
- Class 2 NI is now voluntary for most, though it still protects your State Pension record.

It is gloriously simple. The money is yours the moment it lands, and your admin is one tax return a year.

## How a limited company is taxed

A company is a separate legal person. Its profit belongs to the company until you extract it, and it is taxed twice on the way to your pocket: once as **corporation tax** inside the company, then again as **dividend tax** when you pay yourself.

The classic tax-efficient owner-director takes a small salary up to the personal allowance — £12,570 — and draws the rest as dividends. The salary is a deductible expense that reduces corporation tax, while dividends escape National Insurance entirely and are taxed at lower headline rates (8.75% / 33.75% / 39.35%) after a £500 dividend allowance.

That structure is where the saving comes from. Let us run it.

## The worked example: £60,000 profit

Take a business making £60,000 of profit before the owner pays themselves anything.

**As a sole trader:**

> [!STEPS]
> 1. **Income tax** — 20% on £37,700 plus 40% on the next £9,730 = £7,540 + £3,892 = £11,432.
> 2. **Class 4 NI** — 6% on £37,700 plus 2% on £9,730 = £2,262 + £195 = £2,457.
> 3. **Take-home** — £60,000 − £11,432 − £2,457 = about **£46,111**.

**As a limited company** (salary £12,570 + dividends):

> [!STEPS]
> 1. **Employer NI on the salary** — 15% on the slice above £5,000 = about £1,136.
> 2. **Corporation tax** — company profit after salary and employer NI is about £46,295, taxed at 19% = about £8,796.
> 3. **Dividends drawn** — £46,295 − £8,796 = about £37,499.
> 4. **Dividend tax** — after the £500 allowance, about £36,999 taxed at 8.75% = about £3,237.
> 5. **Take-home** — £12,570 salary + £37,499 dividends − £3,237 = about **£46,831**.

So at £60,000 profit the limited company leaves you roughly **£720 better off** — before you have paid for the privilege of running it.

> [!STAT] £720 | Approximate annual tax saving from a limited company at £60,000 profit, 2025/26

## Why that saving is smaller than the headlines suggest

Two things have eaten into the company advantage in recent years. The **dividend allowance** has shrunk to just £500, so almost all your dividends are now taxable. And **employer National Insurance** rose to 15% from April 2025 with the threshold dropping to £5,000, which means even a modest director's salary now triggers a real NI bill. The structure still wins at £60,000, but by hundreds rather than thousands.

> [!WARNING] Accountancy fees can erase the saving
> A limited company realistically needs an accountant — annual accounts, a corporation tax return, a confirmation statement and payroll all have to be filed correctly. That is commonly £1,000–£2,000 a year. At £60,000 profit, the £720 tax saving does not cover it. The company only pulls clearly ahead once profits are high enough that the saving outgrows the fees.

You can run both scenarios at your own profit level with our [sole trader vs limited calculator](/sole-trader-vs-limited), and fine-tune the director's pay split with the [salary vs dividend tool](/salary-vs-dividend-calculator).

## Where the crossover really sits

As a rough guide:

| Annual profit | Usually better |
|---|---|
| Under £30,000 | Sole trader (saving is tiny, admin not worth it) |
| £30,000–£50,000 | Roughly even — depends on fees and whether you draw it all |
| £50,000+ | Limited company starts to win clearly |
| £100,000+ | Limited company, with real planning value |

The company advantage grows with profit, and it grows further if you do **not** need to draw every penny — because you can leave money in the company after corporation tax and pay yourself in a later, lower-income year, smoothing your tax over time. A sole trader cannot do that; their profit is taxed the year it is earned whether they spend it or not.

## It was never only about tax

If you fixate on the £720, you will make a bad decision. The things that often matter more:

- **Limited liability** — a company ring-fences your personal assets if the business fails or is sued. For a sole trader, the buck stops at your house.
- **Credibility** — some clients, particularly larger ones, will only contract with a limited company.
- **Admin and privacy** — company accounts and your director details are public at Companies House, and the filing burden is real.
- **Pensions** — employer pension contributions from a company are a corporation-tax-deductible way to extract profit that often beats both salary and dividends.
- **IR35** — if you work like an employee through your own company for a single client, the off-payroll rules can strip out most of the tax benefit. Our [IR35 guide](/contractor-ir35) covers when this bites.

## So which should you choose?

If you are testing an idea, earning modestly, or value simplicity above all, **stay a sole trader** — incorporate later when the numbers justify it, which is a routine thing to do. If your profits comfortably clear £50,000, you want limited liability, or you do not need to draw all your income each year, **the company probably wins** — just go in with your eyes open about the admin and fees.

> [!FAQ]
> Q: At what profit does a limited company become worthwhile?
> A: There is no fixed line, but the tax saving usually only outweighs accountancy fees once profits are comfortably above £30,000–£40,000, and it becomes clearly worthwhile from around £50,000 upward. Below that, sole trading is simpler and barely costs more.
>
> Q: Do I pay tax twice with a limited company?
> A: In effect, yes — the company pays corporation tax on its profit, then you pay dividend tax when you extract that profit. The salary-plus-dividend structure is designed to keep the combined bill below what a sole trader would pay at higher profits.
>
> Q: Can I switch from sole trader to limited later?
> A: Yes, and many businesses do exactly that once profits grow. You transfer the trade and assets into the new company. There is no need to incorporate on day one.
>
> Q: Does the small dividend allowance change the answer?
> A: It narrows the company's advantage but does not remove it at higher profits. With the allowance down to £500, nearly all dividends are taxable, which is why the saving at £60,000 is hundreds rather than thousands of pounds.
>
> Q: What about leaving money in the company?
> A: A company lets you retain post-tax profit and draw it in a later year — useful if your income varies or you want to stay under a tax threshold. This flexibility is one of the strongest non-headline reasons to incorporate.

Figures are 2025/26 estimates for England, Wales and Northern Ireland and ignore student loans, pension contributions and your personal circumstances. Take tailored advice before changing your business structure.
`.trim(),
  },
  {
    slug: 'first-time-buyer-stamp-duty-2025-26',
    title: "First-Time Buyer Stamp Duty in 2025/26: What You'll Really Pay",
    description:
      'The 2025/26 first-time buyer stamp duty rules explained with worked examples — the new £300,000 relief threshold, the brutal £500,000 cliff edge, and how to avoid losing the relief.',
    date: '2026-06-08',
    updated: '2026-06-08',
    readMinutes: 10,
    category: 'property',
    tags: ['Stamp Duty', 'First-Time Buyer', 'Buying', 'SDLT'],
    relatedTools: [
      { href: '/stamp-duty-calculator', label: 'Stamp Duty (SDLT)', hint: '2025/26 rates · FTB · surcharges' },
      { href: '/mortgage-calculator', label: 'Mortgage Calculator', hint: 'Repayment · interest' },
      { href: '/house-buying-costs', label: 'House Buying Costs', hint: 'Total cash to buy' },
    ],
    body: `
Stamp duty is the tax nobody budgets for until the solicitor asks for it, and for first-time buyers the rules changed for the worse in April 2025. The relief that used to shelter purchases up to £425,000 was cut back, and a hard cliff edge at £500,000 now catches anyone buying a slightly pricier first home. If you are saving for a deposit, knowing exactly where these lines fall can change which homes you even look at. Here is what first-time buyers actually pay in 2025/26.

> [!WARNING] The rules got tighter in April 2025
> The first-time buyer nil-rate band dropped from £425,000 to **£300,000**, and the maximum price you can claim any relief on fell from £625,000 to **£500,000**. If your first home costs more than £500,000, you get **no first-time buyer relief at all** and pay the standard rates on the whole price.

## What stamp duty is

Stamp Duty Land Tax (SDLT) is a tax on buying property in England and Northern Ireland. (Scotland has its own LBTT and Wales its own LTT, with different thresholds.) It is charged in bands, like income tax — you pay each rate only on the slice of the price that falls in that band, not on the whole purchase.

For most buyers the standard 2025/26 residential rates are:

| Portion of price | Standard rate |
|---|---|
| Up to £125,000 | 0% |
| £125,001 to £250,000 | 2% |
| £250,001 to £925,000 | 5% |
| £925,001 to £1.5m | 10% |
| Above £1.5m | 12% |

First-time buyers get a more generous version of this — but only within limits.

## The first-time buyer relief, in plain terms

If you (and anyone you are buying with) have never owned a home anywhere in the world, and the property costs **£500,000 or less**, you qualify for first-time buyer relief:

- **0% on the first £300,000**
- **5% on the portion from £300,001 to £500,000**

> [!KEY] The two numbers that decide everything
> Buy at **£300,000 or under** → you pay **zero** stamp duty.
> Buy between **£300,001 and £500,000** → you pay 5% only on the slice above £300,000.
> Buy at **£500,001 or more** → relief vanishes entirely and you pay **standard rates on the whole price**.

## Worked examples

Nothing makes this clearer than real numbers. Here is what three first-time buyers pay.

**A £295,000 flat:** the whole price is under £300,000, so the bill is **£0**. Nothing to pay.

**A £425,000 house:**

> [!STEPS]
> 1. **First £300,000** — taxed at 0% = £0.
> 2. **Remaining £125,000** (£300,001 to £425,000) — taxed at 5% = £6,250.
> 3. **Total stamp duty** — **£6,250**.

**A £510,000 house** — just over the cliff, so no relief:

> [!STEPS]
> 1. **First £125,000** — 0% = £0.
> 2. **£125,001 to £250,000** — 2% on £125,000 = £2,500.
> 3. **£250,001 to £510,000** — 5% on £260,000 = £13,000.
> 4. **Total stamp duty** — **£15,500**.

> [!STAT] £15,500 | Stamp duty on a £510,000 first home — versus £10,500 at £500,000

## The cliff edge that can cost you thousands

Look closely at that last example. A first-time buyer at exactly £500,000 pays £10,500 (0% on £300k, 5% on £200k). Push the price just £10,000 higher to £510,000 and the bill jumps to £15,500 — a £5,000 increase for £10,000 of house, because you lose the relief on the entire purchase, not just the bit over £500,000.

This makes the £500,000 mark a genuine negotiating line. If a property is listed at £505,000–£520,000 and you are a first-time buyer, getting the price agreed at £500,000 or below is worth far more than the few thousand pounds of headline discount — it can swing the relief back into play. Run any price through our [stamp duty calculator](/stamp-duty-calculator) to see the exact figure before you offer.

## How to keep the relief

A few practical points that trip people up:

- **Everyone buying must be a first-time buyer.** If you buy with a partner who has owned before — even abroad, even years ago — the relief is lost for the whole purchase. This catches a lot of couples.
- **Inherited property counts.** If you have ever owned a share of a property, including one you inherited, you are not a first-time buyer.
- **It is the price, not the mortgage, that matters.** The £500,000 test is on the purchase price, regardless of how much you are borrowing.
- **You normally have 14 days** from completion to file the return and pay, which your solicitor handles — but the money has to be ready, so build it into your savings target.

## Don't forget the rest of the buying costs

Stamp duty is only one line in the bill. A first-time buyer also needs a deposit, solicitor's fees, survey costs, mortgage arrangement fees and moving costs. On a £425,000 purchase the £6,250 of stamp duty might sit alongside £2,000 of legal and survey fees and a 10% deposit of £42,500. Our [house buying costs calculator](/house-buying-costs) totals the cash you actually need on the day, and the [mortgage calculator](/mortgage-calculator) shows what the monthly repayments look like once you are in.

> [!FAQ]
> Q: Do first-time buyers pay stamp duty in 2025/26?
> A: Only above £300,000. There is no stamp duty on a first home costing £300,000 or less. Between £300,001 and £500,000 you pay 5% on the portion above £300,000. Above £500,000 you lose the relief and pay standard rates on the whole price.
>
> Q: What changed in April 2025?
> A: The first-time buyer nil-rate band fell from £425,000 to £300,000, and the maximum eligible price dropped from £625,000 to £500,000. Both changes made stamp duty more expensive for first-time buyers of mid-to-higher priced homes.
>
> Q: I'm buying with my partner who owned a home before — do we still get relief?
> A: No. Every buyer must be a first-time buyer for the relief to apply. If one of you has previously owned property anywhere in the world, the purchase is taxed at standard rates.
>
> Q: Is stamp duty the same across the UK?
> A: No. SDLT applies in England and Northern Ireland. Scotland uses Land and Buildings Transaction Tax (LBTT) and Wales uses Land Transaction Tax (LTT), each with its own bands and first-time buyer treatment.
>
> Q: Can I add the stamp duty to my mortgage?
> A: Stamp duty must usually be paid in cash shortly after completion, not borrowed as part of the mortgage. Some buyers increase their loan elsewhere to free up cash, but the tax itself is a separate, upfront cost to budget for.

Figures are 2025/26 estimates for England and Northern Ireland. Always confirm your exact liability with your conveyancer before committing, and treat calculator results as a guide.
`.trim(),
  },
];
