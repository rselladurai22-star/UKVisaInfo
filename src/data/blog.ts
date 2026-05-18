// Blog post registry. Each post is an indexable long-form article
// targeting a specific low-competition UK visa query.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  updated: string; // ISO
  readMinutes: number;
  tags: string[];
  body: string; // markdown
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'uk-skilled-worker-visa-salary-threshold-2026',
    title: 'UK Skilled Worker Visa Salary Threshold 2026 — Full List by Job',
    description:
      'Complete 2026 breakdown of Skilled Worker visa salary thresholds: general minimum £38,700, going rates by occupation code, new-entrant discount and shortage route rules.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 9,
    tags: ['Skilled Worker', 'Salary', 'Sponsorship'],
    body: `
The Skilled Worker visa is the UK's main work route, and in 2026 the salary rules are stricter than ever. If your salary doesn't clear the threshold, your application is refused — no judgement, no appeal on that ground. This guide walks you through every threshold that applies in April 2026, who each one hits, and how to check whether your specific job code qualifies.

## The three numbers you need to know

There is no single "Skilled Worker salary threshold." Your application must clear **three** separate salary tests simultaneously:

1. **General minimum salary** — £38,700 per year for most new applicants from April 2026.
2. **Going rate for your occupation code** — varies by SOC 2020 job code, published by the Home Office.
3. **£15.88 per hour** — minimum hourly rate regardless of contract type.

You must meet **all three**. The Home Office takes the highest of the three as your effective threshold. A nurse on £32,000 fails even if nursing's going rate is lower, because the general minimum isn't met (unless they qualify for a discount — see below).

## Who qualifies for a lower threshold?

Five groups get a discount from the £38,700 headline figure:

| Group | Minimum salary | Notes |
|---|---|---|
| **New entrants** (under 26, or recent graduate, or moving from Student visa) | £30,960 | Max 4 years on this rate |
| **PhD in a STEM subject relevant to the role** | £34,830 | Subject must match job |
| **PhD in a non-STEM subject relevant to the role** | £38,700 (no discount in 2026) | Changed April 2025 |
| **Immigration Salary List occupation** | £30,960 | Replaced the old Shortage Occupation List |
| **Health & Care visa (eligible healthcare roles)** | £25,600 or going rate | Separate route; see our Health & Care guide |

The new-entrant discount is the most commonly missed. If you're 25, graduated within the last 2 years, or switching from a UK Student visa — apply it. It saves £7,740 per year on the threshold.

## Going rates by occupation — the ones most people apply for

Every SOC 2020 code has its own going rate, set at the 25th percentile of UK earnings for that role. Here are the 2026 figures for the most commonly sponsored roles:

- **Software developer (2136)** — £49,400
- **Programmer and software development professional (2134)** — £49,400
- **IT business analyst, architect and systems designer (2135)** — £52,300
- **Chartered and certified accountants (2421)** — £39,700
- **Management consultants and business analysts (2423)** — £42,900
- **Registered nurse (2231)** — £31,081 (Health & Care route) / £38,700 (Skilled Worker)
- **Care worker (6135)** — Closed to new overseas applications from March 2025
- **Civil engineer (2121)** — £40,500
- **Mechanical engineer (2122)** — £38,900
- **Secondary school teacher (2314)** — £31,650 (under education pay scale)
- **Chef (5434)** — £30,960 (Immigration Salary List)
- **Graphic designer (3421)** — £30,960 (under new-entrant rate only)

If your role's going rate is **above** £38,700, the going rate applies. If it's below, £38,700 applies (unless you qualify for a discount group).

## The Immigration Salary List — what replaced the Shortage Occupation List

From April 2024 the Shortage Occupation List was abolished. In its place, the **Immigration Salary List (ISL)** offers a 20% discount on the general threshold for specific roles where the UK cannot fill vacancies domestically.

ISL roles in 2026 include:
- Bricklayers and masons (5312)
- Roofers, roof tilers and slaters (5313)
- Construction and building trades supervisors (5330)
- Animal care services occupations (6139, partial)
- Laboratory technicians (3111)
- Boat and ship builders and repairers (5235)
- Stonemasons and related trades (5311)

If you're on the ISL, the minimum drops from £38,700 to £30,960 — but you still need to clear your occupation's going rate and £15.88/hour.

## How salary is calculated — the gotchas

The Home Office doesn't just take your offer letter number at face value. They count:

- **Basic gross salary only.** Bonuses, commission, overtime, allowances (including London weighting in most cases), in-kind benefits and pension contributions do **not** count.
- **Guaranteed allowances** — some allowances count if they are guaranteed in the Certificate of Sponsorship and paid regardless of performance. Car allowances and accommodation allowances usually don't.
- **Weekly hours** — the salary is assessed against a standard 37.5-hour week. If you work 30 hours, your gross is pro-rated up to 37.5 hours for threshold purposes — which is why £15.88/hour exists as a floor.

Example: You're offered £35,000 for a 30-hour week. The full-time equivalent is £43,750, which clears £38,700. But if you're offered £32,000 for 37.5 hours, you fail — even if your hourly rate is fine.

## What happens if your salary rises later

Your threshold is locked at the time your Certificate of Sponsorship is issued. If thresholds rise after you're granted leave, you're fine for your current visa — but an extension or switch will be assessed at the new rate.

This bites hardest at **extension stage**. Applicants granted leave in 2023 at the old £26,200 threshold now face £38,700 when they extend in 2028. Many will need to negotiate a pay rise or switch employer.

## What to do next

1. **Find your SOC 2020 code.** Your sponsor should know; if not, the ONS's SOC 2020 tool is the definitive source.
2. **Check your going rate.** Home Office Appendix Skilled Occupations lists every code and rate.
3. **Confirm which threshold group you're in.** New entrant? ISL? PhD-STEM? Apply the discount.
4. **Verify £15.88/hour on your actual working hours.**

If all three clear with a margin of at least £500, you're safe. Thin margins are risky — Home Office caseworkers round down, not up.

Our [UK Skilled Worker visa guide](/visa/skilled-worker) covers the full application process, document list and fee breakdown.
`.trim(),
  },

  {
    slug: 'uk-student-visa-cost-2026-full-breakdown',
    title: 'How Much Does a UK Student Visa Cost in 2026? Full Breakdown',
    description:
      'Complete 2026 cost of studying in the UK on a Student visa: Home Office fee £524, IHS £776/year, tuition, maintenance funds and hidden costs. With worked examples.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 8,
    tags: ['Student visa', 'Costs', 'IHS'],
    body: `
The UK Student visa headline fee is £524 — but that's a tiny fraction of what you'll actually pay to study in the UK in 2026. When you add the Immigration Health Surcharge, required maintenance funds and tuition, the real number is often £35,000 to £55,000 for a single year. This guide breaks down every cost, including the ones most prospectuses don't mention.

## The headline Home Office fees

| Fee | Applying outside UK | Applying inside UK |
|---|---|---|
| Student visa application | £524 | £524 |
| Priority service (optional) | £500 | £500 |
| Super priority (optional) | £1,000 | £1,000 |
| Dependant (per person) | £524 | £524 |

The priority services are optional but recommended if your course starts within 8 weeks. Standard processing is 3 weeks outside the UK, 8 weeks inside.

## The Immigration Health Surcharge (IHS) — £776/year

All Student visa applicants pay IHS upfront for the full duration of their visa. For students, the discounted rate is **£776 per year** (adults on the main Skilled Worker rate pay £1,035).

Key rules:
- Paid upfront as a lump sum. If your visa is for 3 years and 4 months, you pay £776 × 4 = £3,104 (any partial year counts as a full year for IHS).
- Covers NHS access for the full visa duration, including GP visits, A&E, most hospital care.
- Prescriptions, dental, optical and some maternity services are not covered — you still pay those.
- Dependants on a Student visa also pay £776/year each.

For a typical 3-year undergraduate degree, IHS alone is around **£3,104**.

## Tuition fees — the biggest cost by far

International student tuition in 2026:

- **Undergraduate (humanities)** — £18,000 to £26,000/year
- **Undergraduate (STEM)** — £22,000 to £35,000/year
- **Undergraduate (medicine, dentistry)** — £35,000 to £65,000/year
- **Master's (taught)** — £20,000 to £32,000/year
- **Master's (MBA)** — £35,000 to £110,000 total
- **PhD** — £18,000 to £28,000/year

Russell Group universities sit at the top of each range. London institutions add roughly £2,000 to £5,000 per year over equivalent courses elsewhere.

## The maintenance requirement — not a fee, but a lock

Your visa requires you to **prove** you have enough money to live on. You don't pay this to the Home Office, but the funds must sit in your account (or a parent's account with a sponsor letter) untouched for 28 consecutive days before you apply.

2026 maintenance requirements:
- **Courses in London** — £1,483/month, up to 9 months = **£13,347**
- **Courses outside London** — £1,136/month, up to 9 months = **£10,224**

Even for a 1-month course you must show the full 9-month equivalent. For a 12-month master's in London, you need to prove £13,347 in savings plus first-year tuition (minus any already paid).

Typical total proof required for a London master's student who has paid £5,000 toward tuition and has total course fees of £28,000:
£28,000 − £5,000 + £13,347 = **£36,347** in the bank for 28 days.

## Hidden and commonly missed costs

1. **TB test** (£80–£200) — required if you're applying from a listed country including India, Pakistan, Nigeria, Bangladesh, most of Southeast Asia and sub-Saharan Africa. Must be done at an IOM-approved clinic.
2. **ATAS clearance** (£0 but ~4 weeks to obtain) — required for some STEM postgrad courses. Delays people every year.
3. **English test** (£175–£230) — IELTS/UKVI, PTE Academic or equivalent. Some universities accept their own in-house test, which is cheaper.
4. **Translations** (£30–£150 per document) — all non-English documents must be certified translations.
5. **Biometrics appointment fee** (£0 to £150) — paid to the VFS or TLS centre; some locations add a premium for weekend slots.
6. **CAS issue fee** — most universities include this, but a few charge £50–£100.
7. **Airport pickup, initial accommodation deposit** — typically £500–£1,500 before you've unpacked.

## Worked example: 1-year master's in London

Sanjay, 24, applying from Chennai for an MSc Finance at a central London university:

| Item | Cost |
|---|---|
| Tuition | £32,000 |
| Student visa fee | £524 |
| IHS (1 year + 4 months buffer) | £1,552 |
| TB test (Chennai) | £85 |
| IELTS UKVI | £230 |
| Biometrics (VFS Chennai premium) | £110 |
| Document translations | £180 |
| Flight London one-way | £520 |
| Week-one accommodation + deposit | £1,400 |
| **Upfront total** | **£36,601** |
| Maintenance shown in bank (not paid to Home Office) | £13,347 |

Monthly living costs in London on top of this: £1,400–£1,800 covering rent (£900–£1,300), food (£200–£300), transport (£170 Zone 1–2 young person's Travelcard), phone (£15) and incidentals.

## Ways to reduce the total

- **Apply early** — standard processing is free; priority (£500) is only needed if your CAS is within 6 weeks of course start.
- **Choose a non-London university** — the £347/month maintenance saving compounds.
- **Scholarships** — Chevening, Commonwealth, Great Scholarships, and university-specific awards for international students.
- **In-country TB clinics** — list on gov.uk; approved clinics charge less than premium private hospitals.
- **Skip university accommodation year 2** — shared house rents in most UK cities are 30–40% cheaper.

## What you can't reduce

- The Home Office fee is fixed at £524.
- IHS is mandatory — no health insurance substitute works.
- Maintenance is a proof requirement, not a spending requirement. You can use the same money for tuition after the 28-day window.

See our [full UK Student visa guide](/visa/student) for eligibility, documents and step-by-step application walkthrough, or try the [cost calculator](/costs) to model your specific situation.
`.trim(),
  },

  {
    slug: 'uk-family-visa-minimum-income-2026-what-counts',
    title: 'UK Family Visa Minimum Income £29,000 — What Counts in 2026?',
    description:
      'What income counts toward the £29,000 UK Family visa threshold in 2026: employment, self-employment, savings, pensions, dividends — and the common mistakes that get applications refused.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 10,
    tags: ['Family visa', 'Spouse visa', 'Income threshold'],
    body: `
If you're sponsoring a partner or spouse to come to the UK, the single question that decides your application is: can you show £29,000 of qualifying income? In 2026 the rules around what counts — and what absolutely does not — are tighter than most guides explain. This article walks through every income source, the exact evidence needed and the six mistakes that sink applications every week.

## Why £29,000 and not £38,700?

In April 2024 the Family visa minimum income threshold rose from £18,600 to £29,000 under the plan to raise it incrementally to match the Skilled Worker threshold. The increase to £34,500 and then £38,700 was paused in 2024 pending a Migration Advisory Committee review. As of April 2026 the threshold remains **£29,000** — but expect further rises; watch Home Office announcements if you're close to applying.

The £29,000 applies to:
- Partner/spouse applications (initial entry clearance and extensions)
- Fiancé(e) applications
- Unmarried partner applications after 2 years of cohabitation

It does **not** apply to:
- Parent of a British child (no income threshold, but adequate maintenance test instead)
- EU Settlement Scheme applications
- Adult Dependent Relative (different, harder test)
- Sponsors receiving certain disability benefits (see below)

## The five income categories the Home Office accepts

Under Appendix FM-SE, income must fall into one of five categories:

1. **Category A** — Employment income from the same employer for 6+ months
2. **Category B** — Employment income from less than 6 months with a current employer, OR variable earnings
3. **Category C** — Non-employment income (rental, dividends, interest)
4. **Category D** — Cash savings of £88,500+ held for 6 months
5. **Category E** — Pension income
6. **Category F/G** — Self-employment (sole trader, limited company director)

Most applicants use a combination, typically Category A + Category D.

## Category A — the simplest path

**Requirement:** Gross annual salary of £29,000 from a single UK employer you've been with for 6+ months.

**Evidence:**
- 6 months of payslips (originals or employer-stamped copies)
- 6 months of corresponding bank statements showing salary deposited
- Employer letter confirming start date, role, salary, contract type, hours
- Signed employment contract

**Catches:**
- Zero-hours contracts count only under Category B (variable earnings), not A.
- If salary increased within the 6 months, they use the **lowest** month × 12 as your annual figure.
- Probationary periods count as long as you're past them by the application date.

## Category B — under 6 months or variable income

Harder test. You must show **both**:
1. Your current salary × 12 ≥ £29,000 (as evidenced by most recent payslip), **and**
2. Total gross income in the 12 months before application ≥ £29,000.

The 12-month look-back is the trap. If you've been unemployed, on reduced hours or between jobs in that year, you'll likely fail.

## Category C — non-employment income

Includes:
- UK property rental (after agent fees, but gross of mortgage interest)
- Dividend income from shares (not your own limited company — that's Category F)
- Interest from savings accounts
- Maintenance payments received from ex-partners
- Academic stipends and maternity allowance

**Evidence:** 12 months of bank statements showing receipts, plus source documents (tenancy agreement, share certificate, SA302).

## Category D — cash savings

**Requirement:** £88,500+ in cash savings held for 6+ months at time of application.

The formula is: £16,000 (Home Office buffer) + (£29,000 × 2.5) = £88,500.

**Who holds it?** Sponsor, applicant, or jointly. Cannot be held by parents, employers or "about to be transferred."

**What counts as savings:**
- UK or overseas bank current/savings accounts
- Stocks/shares (valued at lowest price in the 6-month period)
- Investment ISAs, pensions that are accessible without penalty

**What does NOT count:**
- Locked-in pensions
- Property equity (you'd need to sell first)
- Gifted money received in the last 6 months (gifts reset the 6-month clock)
- Cryptocurrency (explicitly excluded)

**Mixing savings with income:** You can combine. If you earn £20,000, the shortfall is £9,000. Required savings = £16,000 + (£9,000 × 2.5) = £38,500. Significantly lower than the pure-savings route.

## Category F/G — self-employment

Two sub-categories:
- **Category F** — most recent full financial year's earnings meet threshold
- **Category G** — average of last two financial years' earnings meet threshold

**Required evidence (sole trader):**
- SA302s or tax year overviews from HMRC
- Self-assessment tax returns
- Business bank statements
- Proof of registration with HMRC and, if applicable, VAT and National Insurance
- Evidence of ongoing business activity (invoices, contracts)

**Required evidence (limited company director, "Category F Director"):**
- Full accounts (not abridged) for the financial year
- Corporation tax return (CT600)
- Personal self-assessment
- Company and personal bank statements
- Certificate of Incorporation
- Shareholder register

The limited-company route is the hardest Family visa evidence bundle. Directors also need to show that salary + dividends drawn personally total £29,000 — retained profits in the company don't count toward your personal threshold.

## The six mistakes that refuse applications every week

1. **Mixing payslip months.** Six consecutive payslips, not six cherry-picked ones. A gap disqualifies Category A.
2. **Salary paid in cash.** Doesn't count. Bank deposits are mandatory.
3. **Overseas income without evidence of continuation in the UK.** If your £40,000 salary is from a US employer and you can't show it will continue in the UK, it doesn't count post-entry.
4. **Savings deposited within 6 months.** Large lump sums that appeared 5 months ago require a source trail (inheritance, sale of property) **and** still don't count unless held for the full 6 months.
5. **Dividends from your own limited company claimed under Category C.** Wrong category. Must go under F/G with full company accounts.
6. **Adding together two sources that don't combine.** You can mix Category A + D, but you can't mix Category B + F. Read Appendix FM-SE paragraph 9 carefully.

## Exemptions — when £29,000 doesn't apply

If the sponsor receives any of the following, the income threshold is replaced by an "adequate maintenance" test (currently around £9,000/year after housing costs):
- Carer's Allowance
- Disability Living Allowance (any rate)
- Personal Independence Payment (any rate)
- Attendance Allowance
- Armed Forces Independence Payment
- Industrial Injuries Disablement Benefit

If the sponsored applicant is a child and the other parent is already in the UK with status, adequate maintenance applies rather than £29,000.

## What to do before you apply

1. Pick your category and stick to it. Don't try to hedge.
2. Pull bank statements early — many banks charge for more than 3 months' history.
3. If self-employed, file your self-assessment **before** applying, not after. The Home Office needs HMRC-stamped evidence.
4. Get your employer letter dated within 28 days of application submission.
5. If using savings, screenshot your balance the day after the 6-month window opens and again on application day.

See our [Family visa guide](/visa/family) for the full document list and application walkthrough. If you're unsure whether your income combination qualifies, the Home Office's own Family Life Appendix FM-SE is the definitive text — every refusal reason cites it by paragraph.
`.trim(),
  },

  {
    slug: 'brp-vs-evisa-2026-whats-changing',
    title: 'BRP vs eVisa — What\'s Changing in 2026?',
    description:
      'The UK is retiring physical BRPs in favour of eVisas. What you must do before your BRP expires, how to create a UKVI account, and what happens at airports in 2026.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 7,
    tags: ['eVisa', 'BRP', 'Immigration status'],
    body: `
If you hold a Biometric Residence Permit (BRP), you've probably heard that "BRPs are ending." What you may not know is exactly what that means for you, when to act and what happens if you do nothing. This article explains the BRP to eVisa transition as it stands in April 2026, the deadlines that still matter and the real-world consequences at airports and landlord checks.

## What is an eVisa?

An eVisa is not a document. It's an online record of your UK immigration status linked to your passport. You prove your status by logging into your **UKVI account** and generating a **share code** for employers, landlords, banks and airlines.

Replacing BRPs with eVisas has been Home Office policy since 2022, accelerated in 2024–25 with the physical-card phase-out. As of 31 December 2024, the Home Office stopped issuing new BRPs to most applicants. Anyone granted leave from January 2025 onwards received an eVisa only.

## Who still holds a BRP?

If your BRP was issued before 31 December 2024 and is still valid, you still hold a physical card — but the card expires on 31 December 2024 on its face regardless of your actual leave duration. This is not a bug. The card's expiry date is not your visa's expiry date.

Your **underlying immigration leave** continues as granted (e.g. 5 years on Skilled Worker, ILR indefinite). Only the physical card's usefulness ends.

## What you must do in 2026

Create a UKVI account and link your eVisa. Specifically:

1. **Go to gov.uk/evisa** and click "Create a UKVI account."
2. Enter the passport you used to apply for your visa.
3. Verify your identity via email and SMS.
4. Scan your BRP (or upload a photo) so the Home Office can match the record.
5. Once linked, your eVisa is live. Test it by generating a share code.

Budget 15–30 minutes. Most people finish in one sitting. The Home Office recommends doing this well before any international travel because airlines have started checking eVisa status at boarding.

## What happens if you don't create a UKVI account

Nothing immediate — your leave itself doesn't lapse. But practically:

- **Airline check-in** will fail if the carrier can't verify your status via the electronic border system. Some airlines now refuse boarding with only a BRP.
- **Right to Work checks** cannot be completed by employers using an expired BRP. They must use the online service, which requires your share code.
- **Right to Rent checks** follow the same rule.
- **NHS registration** in new areas may ask for eVisa proof.
- **Bank account opening** will require a share code.

Many reports in late 2025 and early 2026 show applicants stuck at overseas airports when airlines couldn't verify status. Some were allowed to board after a phone call to the Home Office's carrier liaison; many were denied boarding and had to rebook.

## The passport link — the most common mistake

Your eVisa is linked to the passport number **you used when applying**. If you've renewed your passport since your visa was granted, you must update the passport number in your UKVI account **before** travel. This is done inside the account under "Update your details."

Forgetting this is the single most common reason for boarding refusals in 2026. New passport = new number = airline's system can't match your eVisa record at check-in.

## Share codes — how they work

A share code is a 9-character alphanumeric code generated inside your UKVI account. You give it to a third party along with your date of birth, and they can view your immigration status on gov.uk.

Share code rules:
- Valid for 90 days from generation.
- Employer/landlord/bank-specific — you generate a different code for each check type.
- Does not show your passport number, just your status, conditions and expiry.
- Free to generate; no limit on the number you create.

Treat share codes like one-time passwords. Don't publish them; don't reuse across third parties unnecessarily.

## What if your BRP is lost or damaged?

You do not need to replace the physical card. Instead, create your UKVI account using the **reference number** from your original decision letter, or contact UKVI's BRP team for help linking your record. The Home Office is explicit that **replacement BRPs are no longer issued** — they will help you move to eVisa instead.

If you never received your decision letter (common for 2015–2018 applicants), use your full legal name, date of birth, nationality and visa type; the Home Office support line can verify identity and issue a recovery link.

## ILR holders and the "status lost" myth

There's a persistent rumour that Indefinite Leave to Remain (ILR) holders can "lose" their status if they don't create a UKVI account. This is **false**. Your ILR doesn't lapse because you haven't registered an eVisa. However:

- You still can't prove ILR without a share code. So practically, you need the account for any status check.
- ILR can be lost by **absence** — 2+ continuous years outside the UK, or prolonged residency elsewhere. This rule is unchanged by eVisa.
- ILR can be lost by **revocation** — serious crimes, deception in original application. Also unchanged.

Create the account. ILR is too valuable to leave unverified.

## Dual nationals and British passport holders

If you're a British citizen or Commonwealth citizen with Right of Abode, you don't have a UKVI account or eVisa. Your British passport (or Certificate of Entitlement in a foreign passport) is your proof of status. No action needed.

If you're a dual national holding both British and, say, Indian passports, travel on your British passport into the UK. Don't try to use an eVisa attached to your Indian passport — you don't have one, because you don't need one.

## Family members and children

Each person's immigration status is individual. If your spouse and children hold dependant leave, **each** needs their own UKVI account. Parents can create and manage accounts for children under 18, but the account belongs to the child and must be transferred to their control at 18.

## What's coming next

The Home Office roadmap through 2026–2027:
- **End 2026** — airline systems fully integrated with UKVI; BRP-only boarding expected to be refused universally.
- **2027** — all remaining paper-based and legacy document holders migrated.
- **Longer term** — expansion to biometric at-border verification, potentially reducing the need for share codes at entry.

For now, the job is straightforward: create your UKVI account, link your current passport, and test a share code before your next flight.
`.trim(),
  },

  {
    slug: 'uk-visa-processing-times-2026-by-type-and-country',
    title: 'UK Visa Processing Times 2026 — By Visa Type and Country',
    description:
      'Current UK visa processing times in 2026 by visa type and country of application, plus priority service availability, seasonal backlogs and how to escalate delays.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 7,
    tags: ['Processing times', 'Priority service', 'Application'],
    body: `
The UK Home Office publishes target processing times, but the real-world times you'll see in 2026 often diverge — sometimes faster, sometimes significantly slower depending on which country you're applying from. This guide sets out the published 2026 targets, actual times reported by applicants through early 2026 and what to do when your application runs over.

## The published 2026 service standards

These are Home Office "service standards" — the times the Home Office aims to meet for 95% of straightforward applications.

### Out-of-country (overseas applications)

| Visa type | Standard | Priority | Super priority |
|---|---|---|---|
| Visit visa (standard, marriage, transit) | 3 weeks | 5 working days | Next working day |
| Student | 3 weeks | 5 working days | Not available |
| Skilled Worker | 3 weeks | 5 working days | Not available |
| Health & Care Worker | 3 weeks | 5 working days | Not available |
| Family (spouse, partner, fiancé) | 12 weeks | 30 working days | Not available |
| Global Talent | 3 weeks | 5 working days | Not available |

### In-country (switching or extending)

| Visa type | Standard | Priority | Super priority |
|---|---|---|---|
| Skilled Worker (extension/switch) | 8 weeks | 5 working days | Next working day |
| Student (extension/switch) | 8 weeks | 5 working days | Next working day |
| Family (extension) | 8 weeks | 30 working days | Not available |
| Indefinite Leave to Remain | 6 months | 5 working days | Not available |
| Naturalisation (citizenship) | 6 months | Not available | Not available |

Priority service costs £500; super priority £1,000.

## What applicants actually report in 2026

Service standards are targets, not guarantees. Real-world averages as of early 2026:

**Generally on target or faster than target:**
- Visit visas from Canada, Australia, New Zealand, Japan, South Korea — often 5–10 days standard.
- Skilled Worker from India, Philippines, Nigeria — usually 2–3 weeks standard.
- Student visas during off-peak (November–May).

**Running slower than target:**
- Family visas from Pakistan, Bangladesh, Nigeria, Ghana — frequently 14–20 weeks.
- Student visas in peak (June–September) — often 4–5 weeks even with a "3 week" target.
- In-country ILR — reports of 6–9 months common, even though the target is "6 months."
- Naturalisation — regularly 8–12 months.

**Consistently badly delayed:**
- Asylum-linked Family Reunion applications.
- Applications flagged for additional checks (see below).
- Appeals after refusal — 6 to 14 months to First-tier Tribunal hearing.

## Why applications go over service standard

Service standards apply to "straightforward" applications. Your application may be pulled out of the standard stream if:

1. **Previous refusal** — adds 2–6 weeks.
2. **Deception allegation history** — adds 2+ months, may trigger interview.
3. **Complex employment or financial evidence** — e.g. limited-company directors, overseas income.
4. **Criminal record in any country** — triggers ACRO or foreign police checks.
5. **Age under 18 without both parents present** — consent verification takes weeks.
6. **Dependent applicants included** — each adds complexity.
7. **Priority applications during peak** — the "priority" queue can also back up.

If any of these apply to you, add 50–100% to the published target as a working assumption.

## Peak seasons to avoid

- **Student visa peak:** June 1 to September 20. Expect 4–5 week actuals against a 3-week target.
- **Visit visa peak:** April 1 to June 15 (summer travel), November 15 to December 15 (winter travel).
- **Family visa peak:** April (threshold changes trigger rush) and September (post-summer).
- **In-country extension peak:** Last 28 days of the applicant's existing visa (everyone leaves it late).

If you can apply off-peak, you will almost always see faster turnaround without paying priority.

## Priority vs super priority — when they're worth it

**Priority (£500):**
- Worth it if your course or job starts within 6 weeks.
- Worth it for family reunions if the 12-week target would miss a key event (birth, wedding).
- Not worth it if you're applying 2+ months before need.

**Super priority (£1,000):**
- Only sensible for emergencies.
- Not available for Family or Global Talent.
- Requires a UK biometrics visit that can be booked at short notice — which is not guaranteed.

A common mistake: paying £1,000 for super priority when the standard service would have met your timeline anyway.

## How to escalate a delayed application

If your application is past the published service standard, in this order:

1. **Check your UKVI account.** Most status updates appear there before email.
2. **Contact UKVI Contact Centre** (gov.uk form). Provide GWF reference. Response in 5–10 working days. Usually: "your application is being processed."
3. **MP enquiry.** Your UK MP (or your sponsor's MP) can raise a case with the Home Office Account Management team. Response times drop dramatically — often 2–3 weeks. Free.
4. **Pre-action protocol letter.** If you're 3+ months past service standard and facing specific harm (job offer withdrawal, course place loss), a solicitor's PAP letter forces a response within 14 days.
5. **Judicial review.** Last resort. £700+ court fee plus solicitor costs. Rarely needed if PAP is credible.

MP enquiries are by far the highest return-for-effort escalation route and the least used.

## Interviews — what triggers them in 2026

Most applicants are never interviewed. Triggers in 2026:

- Marriage/partner applications where the couple have no shared accommodation or finances.
- Applications where English proficiency doesn't match documentation.
- Genuine student interviews — random sample plus any flagged case.
- Skilled Worker interviews — rare but increasing where the role looks implausible for the CV.

Interviews are usually video calls, 30–60 minutes, conducted in English. Preparation is the same as for any visa: know your own application cold, have documents ready, answer in the present tense for ongoing facts.

## What to do before you apply

1. **Pick the right service.** If your timeline is tight, budget for priority.
2. **Apply off-peak if possible.** A July Student visa takes twice as long as a February one.
3. **Prepare a bundle, not a pile.** Organised documents process faster.
4. **Check your biometrics appointment calendar** in your country. Some VFS centres have 3-week appointment queues — factor this in.
5. **Save your GWF reference.** You cannot track without it.

Service standards will almost certainly shift again before 2027. Our individual visa guides ([Skilled Worker](/visa/skilled-worker), [Student](/visa/student), [Family](/visa/family)) are updated as new targets are published.
`.trim(),
  },

  {
    slug: 'uk-graduate-visa-2026-no-sponsor-needed',
    title: 'UK Graduate Visa 2026 — 2 Years Post-Study, No Sponsor Needed',
    description:
      'Complete 2026 guide to the UK Graduate visa: who qualifies, fees (£880), 18-month duration, what you can do without a sponsor, and how to switch into Skilled Worker.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 7,
    tags: ['Graduate visa', 'Post-study', 'Switching'],
    body: `
The Graduate visa is the UK's post-study work route — and in 2026 it's the single most useful visa most international students never use. It lets you stay 18 months after graduation without a sponsor, work in any job at any salary, and use that time to find sponsorship for a Skilled Worker visa. This guide covers eligibility, costs, what you can and cannot do, and the switching strategy that gets the highest success rate.

## Who qualifies in 2026

To apply for the Graduate visa you must:

1. Hold a current Student visa (or equivalent legacy Tier 4) in the UK at the time of application.
2. Have **successfully completed** an eligible course at a UK Higher Education Provider with a track record of compliance. Course must be one of:
   - UK Bachelor's degree
   - UK Master's degree
   - UK PhD or other doctoral qualification
   - Eligible professional course (e.g. PGCE, law conversion)
3. Apply from inside the UK before your Student visa expires.
4. Your education provider has reported your course completion to UKVI.

Note: from January 2024, dependants can no longer be added to **new** Graduate visa applications unless they were already on your Student visa as dependants. Most master's students are now barred from bringing family on this route.

## How long the visa lasts

- Bachelor's or Master's graduate — **18 months**
- PhD or doctoral graduate — **3 years**

The clock starts when your Graduate visa is granted, not when you finish your course. The duration cannot be extended. You can switch into another route (most commonly Skilled Worker) before it ends.

## Costs in 2026

| Item | Amount |
|---|---|
| Application fee | £880 |
| Immigration Health Surcharge (1 year × duration) | £1,035/year × 2 = £2,070 (18 months) or × 3 = £3,105 (PhD) |
| Priority service (optional) | £500 |

Total minimum: around **£2,950** for an 18-month visa. PhD graduates pay around **£3,985** because of the longer IHS bill.

There is no maintenance funds requirement and no English test for this route — both were assessed at the Student visa stage.

## What you can do on the Graduate visa

- Work for any employer in any role at any salary (no minimum threshold)
- Work as self-employed
- Volunteer
- Travel abroad and return
- Switch into another visa route (Skilled Worker, Innovator Founder, Global Talent)

## What you cannot do

- Apply for most public benefits (housing benefit, universal credit, jobseekers allowance)
- Work as a professional sportsperson or sports coach
- Extend the Graduate visa
- Use Graduate visa time toward Indefinite Leave to Remain (the 5-year clock for ILR does **not** include Graduate visa time)

The ILR exclusion is the biggest catch. Two years on Graduate visa do **not** count toward the 5 years required for settlement. You must switch to Skilled Worker (or another qualifying route) and start the ILR clock from there.

## The switching strategy that works

Most Graduate visa holders aim to switch to Skilled Worker before the 18 months expire. The success rate is high if you plan it correctly:

**Months 1–3:** Apply to roles aggressively. Filter heavily for Home Office licensed sponsors — the official register is updated daily. Don't waste applications on companies that aren't licensed.

**Months 4–9:** Negotiate offers. The £38,700 general threshold (or your role's going rate, whichever is higher) is now your benchmark. New entrant discount drops this to £30,960 if you're under 26 or graduated within the last 2 years.

**Months 10–14:** Get the Certificate of Sponsorship (CoS) issued. Apply to switch from Graduate to Skilled Worker.

**Months 15–18:** Buffer. Allow time for processing if priority service isn't used.

The hardest months are the first three. Sponsoring a Graduate visa hire costs the employer roughly £5,000 in fees plus £8,000–£25,000 over 5 years in Immigration Skills Charge. Many small employers don't sponsor. Filter your job search ruthlessly.

## Sectors with high sponsor density

- Tech (banks, fintech, AI companies, large consultancies)
- Healthcare (NHS trusts, private hospitals — Health & Care visa easier than Skilled Worker)
- Education (state and private schools — teacher shortage areas)
- Engineering (oil/gas, civil, aerospace)
- Big Four and top consultancies (Deloitte, EY, PwC, KPMG, Bain, McKinsey, BCG)

Sectors to avoid if you need sponsorship:
- Marketing and creative agencies (most under threshold and unlicensed)
- Non-profits (mostly unlicensed)
- Hospitality, retail (mostly under threshold)
- Most start-ups under 50 staff

## Common mistakes

1. **Applying after Student visa expires.** Graduate visa must be applied for from inside the UK while still on a valid Student visa. If your Student visa lapses first, you must leave and re-enter — a costly and slow path.
2. **Forgetting your university hasn't reported completion yet.** UKVI checks a database. If your course completion isn't reported, the application is refused. Confirm with your university's international office before you submit.
3. **Assuming Graduate years count toward ILR.** They don't. Plan your settlement timeline assuming a fresh 5-year clock starts on Skilled Worker.
4. **Using up the 18 months in low-skilled work.** It's tempting to take any job. But you'll need to demonstrate skill-relevant experience to sponsors. Roles aligned to your degree help; supermarket shifts do not.

## What if you can't find sponsorship?

Realistic options at the end of 18 months:
- **Skilled Worker** — primary route, requires sponsor
- **Health & Care Worker** — relevant healthcare roles, lower threshold
- **Innovator Founder** — for credible business ventures with endorsement
- **Global Talent** — if you have leader/exceptional promise endorsement
- **Marriage to British citizen or settled person** — Family visa route
- **Return home and re-enter via Student again for further study + another Graduate** — possible but expensive

Without a path forward, you must leave the UK before your Graduate visa expires. Overstaying triggers a 1-year (voluntary) to 10-year (deception) re-entry ban.

## Application checklist

- Valid current Student visa
- Passport
- BRP or eVisa share code
- Completion confirmation from your university (handled internally — they report to UKVI)
- IHS payment
- £880 application fee
- Optional: priority service £500

That's it — far fewer documents than Student or Skilled Worker. The Graduate visa is the UK's friendliest route, and most students who qualify should apply.

See our [full Graduate visa guide](/visa/graduate) and [Skilled Worker guide](/visa/skilled-worker) for the switching path, or [eligibility checker](/eligibility) if you're unsure which route fits.
`.trim(),
  },

  {
    slug: 'switch-student-to-skilled-worker-visa-uk-2026',
    title: 'How to Switch from Student Visa to Skilled Worker Visa in the UK (2026)',
    description:
      'Step-by-step 2026 guide to switching from a UK Student visa to Skilled Worker visa: eligibility, new-entrant rates, course completion rules, fees, and the timing pitfalls that refuse switches.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 8,
    tags: ['Switching', 'Student visa', 'Skilled Worker'],
    body: `
Switching from a Student visa to a Skilled Worker visa inside the UK is a defined Home Office route — but the rules around when you can switch, what salary you need, and what evidence you must show are stricter than most applicants realise. This guide walks you through the 2026 process, including the new-entrant discount that drops the salary threshold by £7,740 and the timing rules that catch out roughly 20% of applicants.

## Can you switch directly?

Yes — switching from Student to Skilled Worker is allowed inside the UK, **provided you meet specific timing and course conditions**. You do not have to leave the UK first. Most students switch in their final term or shortly after graduation.

You qualify to switch if **all** of the following are true:

1. You currently hold a valid Student visa.
2. You have completed (or will complete by the date the new visa takes effect) the course on your Student visa, OR you are studying a PhD and have studied at least 24 months.
3. You have a sponsorship offer from a Home Office licensed employer with a Certificate of Sponsorship (CoS).
4. The role meets the Skilled Worker eligibility (RQF Level 3+ skill, salary thresholds, etc.).

Apply before your Student visa expires. If it lapses, you must leave the UK and apply from abroad — a slower and more expensive path.

## The salary threshold — and the new-entrant discount

In 2026 the Skilled Worker general minimum is £38,700. But students switching almost always qualify for the **new-entrant rate** of £30,960. New entrant applies if any of these is true:

- You are under 26 at application date
- You are switching from a Student visa (regardless of age)
- You are switching from a Graduate visa
- You hold a UK PhD relevant to the job

Crucially, the second bullet means **all Student-to-Skilled-Worker switchers** get the discount, not just those under 26. New-entrant rate is valid for up to 4 years on Skilled Worker — at extension you'll need to meet the full £38,700 (or your role's going rate, whichever is higher).

You must still meet:
- The going rate for your SOC 2020 occupation code
- £15.88 per hour minimum

The Home Office takes the highest of the three numbers as your effective threshold.

## The course-completion rule — the most missed detail

You can switch **before** your course officially ends, but only in narrow circumstances. The Home Office will accept your application if any of these is true:

- Your course is a PhD and you've been studying it for at least 24 months
- Your course end date is **on or before** the start date of your sponsored role on your CoS

Common error: a student finishes exams in May, course end date is 30 September (matches the Student visa expiry), but the job offer wants them to start on 1 July. Provided the CoS lists 1 July and the Student visa expiry is later, the Home Office allows it. But if the CoS start date is **before** the course end date you were sponsored for, it can be refused.

Solve this by either:
- Asking your sponsor to push CoS start date past your course end, OR
- Asking your university to confirm an earlier course completion to UKVI.

## Costs to switch in 2026

| Item | Amount |
|---|---|
| Application fee (3-year visa, in-UK switch) | £827 |
| Application fee (5-year visa, in-UK switch) | £1,636 |
| Immigration Health Surcharge | £1,035/year × visa length |
| Priority service | £500 |
| Super priority | £1,000 |

Most switchers go for the 3-year visa to minimise upfront IHS, then extend. Total cost for 3 years with priority service: around **£4,400** (the employer typically covers all of this for sponsored roles, but check your offer carefully).

The Home Office processing target for in-country switches is 8 weeks standard, 5 working days priority. Real-world averages in 2026 sit at 3–5 weeks standard during off-peak.

## What your employer must provide

Your sponsor must:
1. Hold a valid Sponsor Licence (check the Home Office register).
2. Issue you a Certificate of Sponsorship (CoS) — a digital reference number, not a physical document.
3. Pay the Immigration Skills Charge (£1,000/year for medium/large employers, £364/year for small employers/charities). This **cannot be passed to you** — doing so is illegal.
4. Confirm the role, salary, hours, and SOC code on the CoS.

If the employer asks **you** to pay the Skills Charge or the £880 sponsor fee for issuing the CoS, walk away. It's a red flag and likely an unlicensed or unethical sponsor.

## Documents you'll need

For your application:
- Current passport
- BRP or eVisa share code
- Certificate of Sponsorship reference number
- Proof of English (Student visa applicants are usually exempt — your existing English evidence carries forward)
- Bank statements showing £1,270 maintenance for 28 days OR sponsor letter confirming maintenance is covered (Skilled Worker A-rated sponsors can certify this)
- TB test results (if from a listed country and you've been outside the UK for 6+ months recently)
- Criminal record certificate (only for specific roles — healthcare, education, social work)

For your sponsor's records (they handle these, not you):
- Right to Work check evidence
- HR system showing your contract details
- Records of how they recruited you (some roles still require advertising checks)

## Timing — the window that catches people out

The most common refusal scenario for switchers:

- Student visa expires 31 October
- Course completed 15 September
- Job offer received 1 October, CoS issued 10 October
- Application submitted 25 October — should be fine, but...
- Job start date on CoS: 1 November (after Student visa expiry)
- Result: refused, because at the moment the new visa takes effect (the gap between submission and grant), the student has no current visa with the right work permission.

Solution: ensure your application is submitted **and** the start date on CoS sits **before** the Student visa expires, or wait to apply until you are on a Graduate visa. Switching from Graduate to Skilled Worker has the same rules but a much wider window.

## Should you take Graduate visa first?

Many students benefit from spending 6–18 months on Graduate visa before switching. Pros:
- No salary threshold during job search.
- More employers will hire you when you can start immediately without sponsorship.
- You can experience the role before committing to 5 years.

Cons:
- Extra £880 + IHS (£2,070) to apply for Graduate visa first.
- Graduate visa years don't count toward ILR.

If you have a firm Skilled Worker offer that meets the threshold and starts soon after graduation, switch directly. If you don't have an offer or want to job-hunt without time pressure, take the Graduate route.

## After you switch — what changes

- You're on a 3- or 5-year Skilled Worker visa, tied to your sponsor.
- The 5-year ILR clock starts now.
- You can change employers but must apply for a new CoS each time and submit a change-of-employment application.
- You can bring dependants (spouse, children under 18) on Skilled Worker — much easier than under Student visa.
- You can do supplementary work in addition to your sponsored role, capped at 20 hours/week and only in the same broad SOC group or on the Immigration Salary List.

See our [Skilled Worker visa guide](/visa/skilled-worker) for the full salary threshold breakdown by occupation, or our [Graduate visa article](/blog/uk-graduate-visa-2026-no-sponsor-needed) for the alternative path.
`.trim(),
  },

  {
    slug: 'uk-ilr-indefinite-leave-to-remain-2026-requirements',
    title: 'UK ILR (Indefinite Leave to Remain) 2026 — 5-Year Route Requirements',
    description:
      'Complete 2026 guide to UK ILR: 5-year qualifying routes, absence rules (180 days/year), Life in the UK Test, B1 English, fees (£3,029) and the documents that prevent refusal.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 9,
    tags: ['ILR', 'Settlement', 'Long-term'],
    body: `
Indefinite Leave to Remain (ILR) is the prize at the end of the UK visa road — permanent residence with no time limit, the right to work without restriction, and a path to British citizenship 12 months later. But ILR is also where applications get refused for paperwork errors that have been brewing for years. This 2026 guide covers the eligibility rules, the absence trap that catches most applicants, and the document standards the Home Office expects.

## The 5-year qualifying routes

You can apply for ILR after 5 years of continuous lawful residence on one of these routes (or a combination thereof, in some cases):

| Route | Years to ILR | Notes |
|---|---|---|
| Skilled Worker | 5 years | Most common in 2026 |
| Health & Care Worker | 5 years | Same as Skilled Worker |
| Global Talent | 3 or 5 years | 3 years for science/research/arts at certain endorsement levels |
| Innovator Founder | 3 years | Faster than most routes |
| Scale-up | 5 years | But only first 2 years tied to sponsor |
| Spouse/Partner of British citizen or settled person | 5 years | Plus financial requirements |
| UK Ancestry | 5 years | Commonwealth citizens with UK-born grandparent |
| Tier 1 Investor (closed to new applications, but legacy holders) | 2/3/5 years depending on investment level |

Routes that **do not** count toward ILR:
- Student visa
- Graduate visa
- Visit visa
- Youth Mobility Scheme
- Most short-term work visas

Time on these routes is "wasted" for ILR purposes. You must switch into a qualifying route before the 5-year clock starts.

## The absence rule — the most common refusal reason

You must not have been absent from the UK for more than **180 days in any rolling 12-month period** during your 5 years of qualifying residence.

Important specifics:
- The rule is **rolling**, not calendar. The Home Office checks every possible 12-month window in your 5 years, not just January–December.
- Day of departure and day of return both count as days **in the UK** if you were physically here.
- Travel for compelling family reasons (serious illness, bereavement) can sometimes be excused but the discretion is narrow.
- Skilled Worker holders required to travel for work get **no automatic exemption** — work travel counts.

How to check yourself: list every trip out of the UK in the last 5 years with dates. Compute the worst 12-month window (rolling, not fixed). If it exceeds 180 days, you'll likely be refused.

If you're close to the limit, delay your application until a worse window rolls off the back of the 5-year period.

## Continuous lawful residence

You must have had valid leave to remain for the entire 5 years. Common breaks that disqualify:

- Letting your visa expire and applying late, even by a day
- Being granted leave outside the rules
- Holding visit visa time during the 5 years (unless transitioning between qualifying leave periods within 28 days)
- Periods on visa types that don't qualify for ILR

A 14-day grace period exists for late applications when there is a "good reason beyond your control" — illness, postal delays, technical issues. Use it sparingly; the Home Office is strict about what counts.

## The Life in the UK Test

Required for almost all ILR applicants over 18 and under 65.

- Format: 24 multiple-choice questions, 45 minutes, computer-based
- Pass mark: 75% (18 of 24 correct)
- Cost: £50 per attempt
- Booked online at gov.uk
- Available at 30+ test centres across the UK
- Material: official handbook "Life in the United Kingdom: A Guide for New Residents" (3rd edition)

You must pass the test before applying. Bring the unique reference number to your ILR application. The pass is valid forever.

Most people study for 2–4 weeks. Common study tools: the official handbook, official practice tests, free quiz apps. Reading the handbook cover-to-cover plus 4–5 mock tests is usually enough.

## English language requirement

Required at B1 CEFR level (intermediate) or above. You meet this if any is true:

- You hold a degree taught in English from a UK or recognised foreign institution.
- You have passed an approved English test (IELTS, PTE Academic, etc.) at B1 or above within the last 2 years.
- You are a national of a "majority English-speaking" country (USA, Canada, Australia, New Zealand, Ireland, several Caribbean nations, etc.).
- You have already submitted English evidence in a previous successful UK visa application — usually you don't need to retest.

Most Skilled Worker holders satisfied this at initial visa; you don't typically need new evidence at ILR. Family visa holders often do need updated evidence, especially if their initial English was at A1/A2.

## Fees in 2026

| Item | Amount |
|---|---|
| ILR application fee | £3,029 |
| Premium service (in-person same-day) | £1,000 (limited slots) |
| Super priority service (5 working days) | £800 |
| Life in the UK Test | £50 |
| Biometrics enrolment | Included in fee |

Family applicants apply each — a couple with two children on Spouse route pay 4 × £3,029 = £12,116 just for ILR fees, before optional services.

There is no IHS at ILR — you've left the visa system at this point.

## Documents the Home Office expects

For Skilled Worker route:

- Passport (current)
- BRP or eVisa share code
- Sponsor letter confirming continued employment, role, salary, length of time at the employer
- Recent payslips (12 months recommended; minimum 6)
- Bank statements covering the same period
- P60s for each tax year you've been in the UK
- HMRC tax record showing taxes paid
- Evidence of all absences (travel itinerary, boarding passes if you have them)
- Life in the UK Test pass certificate
- English proof (if not already on file)

For Spouse route:

- Sponsor's identity document and proof of status
- Marriage certificate or civil partnership certificate
- Joint financial evidence (bank statements, bills)
- Evidence of cohabitation throughout the 5 years (tenancy, mortgage, council tax, utility bills)
- Communication evidence between you both during periods of absence
- Salary or savings evidence if income still relevant

The Home Office checks consistency between your tax record and your declared salary throughout the 5 years. Discrepancies (e.g. you declared £40k to UKVI for visa renewal but paid tax on £25k) are a leading refusal reason and have been weaponised under the "deception" provision in recent years. If your sponsor under-reported you, fix it with HMRC before applying.

## Processing times in 2026

- Standard service: target 6 months, real-world 4–8 months
- Super priority: target 5 working days, real-world 5–15 working days
- Premium in-person: same day if you secure a slot — these book out 4–8 weeks in advance

Most applicants benefit from super priority — the £800 premium is worth it given that any uncertainty in employment, travel plans or family movements becomes a problem when you're waiting on ILR.

## The 12-month wait — citizenship eligibility

Once you have ILR, you can apply for British citizenship 12 months later (or immediately if your spouse is a British citizen). Citizenship adds:

- A British passport
- Voting rights
- Protection from deportation
- The right to take a British passport for children

Citizenship application costs £1,500 + £19.20 ceremony fee. If you plan to apply, hold ILR for the full 12 months without spending more than 90 days outside the UK in that final year (separate, stricter absence rule than ILR's 180/year).

## Common mistakes that refuse applications

1. **Underestimating absence days.** Always count both travel days as UK days.
2. **Salary inconsistency.** Declared salary on visa applications doesn't match HMRC tax records.
3. **Insufficient employment evidence.** A current sponsor letter without supporting payslips and HMRC records is too thin.
4. **Late Life in the UK Test booking.** Test centres book out — don't leave it to the last 2 weeks.
5. **Applying with a passport about to expire.** Renew your passport first; ILR applications get returned otherwise.
6. **Missing 28-day window for cohabitation gaps.** Spouse applicants must cohabit for the qualifying period; gaps over 6 months in extreme cases need detailed explanation.

## What ILR doesn't give you

- It can be **lost** by 2+ years of continuous absence from the UK.
- It can be **revoked** for serious criminal conduct or deception.
- It does **not** automatically give your children British citizenship — that depends on where and when they were born.
- It does **not** give EU/Schengen travel rights — only a British passport does.

## Plan ILR from year 1 of your visa

The applicants who pass ILR cleanly are the ones who started planning during their first year. Specifically:
- Track every travel date in a single spreadsheet.
- Match HMRC tax records to declared salaries every year.
- Save P60s, payslips and bank statements year-by-year.
- Pass Life in the UK Test in year 4 once you're sure you'll stay.
- Book super priority slots early.

If you're early in your 5-year journey, start the spreadsheet today. If you're approaching ILR, start the document gather 3 months ahead — last-minute scrambles are where things go wrong.

See our [Skilled Worker guide](/visa/skilled-worker) and [Family visa guide](/visa/family) for the route-specific paths, or our [eligibility checker](/eligibility) if you're considering switching to a qualifying route.
`.trim(),
  },

  {
    slug: 'uk-visitor-visa-refused-top-reasons-2026',
    title: 'UK Visitor Visa Refused — Top Reasons & How to Reapply (2026)',
    description:
      'The 7 most common reasons UK Visitor visas are refused in 2026, exactly what the Home Office\'s refusal letter codes mean, and how to reapply successfully.',
    date: '2026-04-23',
    updated: '2026-04-23',
    readMinutes: 7,
    tags: ['Visitor visa', 'Refusal', 'Reapplication'],
    body: `
A UK Visitor visa refusal lands like a punch — months of planning gone, and a refusal letter that often reads like it was written by an algorithm in a hurry. The good news: most refusal reasons are addressable, and reapplications succeed when you fix the specific weakness the Home Office identified. This 2026 guide explains the seven most common refusal reasons, what the refusal letter codes actually mean, and how to reapply with the highest chance of success.

## How decisions are actually made

UK Visitor visas are decided by Entry Clearance Officers (ECOs) working from regional decision-making centres. Each ECO has 15–25 minutes per application. They are looking for **risk indicators** — patterns that suggest the applicant might overstay, work illegally, or has been deceptive.

The decision rests on the applicant's ability to demonstrate they meet the **genuine visitor test** in Appendix V of the Immigration Rules. Specifically:
- Will leave the UK at the end of their visit
- Will not undertake prohibited activities (work, study at certain levels, marriage)
- Has sufficient funds for the trip without relying on public funds or working
- Travel arrangements are credible

If the ECO believes any of these points fails on the balance of probabilities, the visa is refused.

## The 7 most common refusal reasons

### 1. Insufficient ties to home country (Appendix V 4.2(a))

The single most common refusal reason. The ECO has not been satisfied that you'll leave the UK at the end of your visit.

What triggers it:
- Self-employed without strong business evidence
- No employment letter, or letter without contact details
- Studying remotely without enrolment evidence
- Single without dependants
- Property or assets at home not evidenced

How to fix it: provide a stronger ties package. Employment letter on letterhead with HR contact, business registration documents, tenancy or property deed, family ties (marriage certificate, school enrolment letters for children), bank account showing regular salary deposits in your home country.

### 2. Inconsistent or implausible bank statements (Appendix V 4.2(c))

The ECO has not been satisfied that the funds shown are genuinely available or genuinely yours.

What triggers it:
- Large unexplained deposits in the 30 days before application
- Average balance vs latest balance dramatically different
- Salary not visible (cash payments)
- Funds appear to be transferred from a third party right before application

How to fix it: show 6 months of the same account, with consistent salary deposits. If a sponsor is funding the trip, get a separate bank statement and sponsor letter from them. Don't move large sums into the account immediately before applying — explain any unusual deposit with a source document (sale of asset, bonus letter).

### 3. Sponsor's documents don't support the claim (Appendix V 4.2(c))

If a UK sponsor (relative, friend) is paying for or hosting your visit, their documents are scrutinised closely.

What triggers it:
- Sponsor's bank statement shows insufficient funds
- Sponsor's status (visa) is not confirmed
- Multiple visitors sponsored simultaneously by one person
- Sponsor's salary not commensurate with the support claimed

How to fix it: provide the sponsor's most recent 3–6 months of bank statements, payslips, BRP or eVisa share code, a signed sponsor letter naming you, and proof of accommodation (tenancy, mortgage). The sponsor's monthly disposable income must comfortably cover your stay.

### 4. Travel history thin or absent

The ECO sees no evidence you have travelled internationally before, especially to similar developed countries.

What triggers it:
- First-time international traveller from a high-risk country (in Home Office terms)
- No Schengen, US, Canadian, Australian visas
- Previous travel only to home region

How to fix it: this can't be fabricated. Build travel history first — a Schengen visa to a country like Germany or France, or a UAE/Singapore tourist visa, all count. Some applicants take 6–12 months to build a record before reapplying.

### 5. Purpose of visit not credible

The reason you've stated for visiting doesn't add up.

What triggers it:
- "Tourism" with no booked itinerary, no hotels
- Business visit without invitation letter or company contact
- Family visit when family ties are unclear
- "Conference" without registration evidence

How to fix it: provide concrete itinerary documents — flight bookings (refundable is fine), hotel reservations or sponsor's address, day-by-day itinerary, conference registration, business invitation on UK company letterhead with their VAT number and Companies House registration.

### 6. Previous refusal not addressed (Appendix 9 paragraph 9.7.2)

You've reapplied without explaining or fixing the previous refusal.

What triggers it:
- Reapplying with the same documents that caused the first refusal
- Not acknowledging the previous refusal in the new application form
- Same weakness in different wording

How to fix it: address the original refusal head-on. Include a covering letter that says: "My previous application was refused on [specific ground]. I have addressed this by [specific evidence change]." The ECO is required to consider new evidence; help them see what's changed.

### 7. Discrepancies or deception findings (Paragraph 9.7.1 / 9.8.1)

The most serious refusal type. The ECO has identified a contradiction between what you've stated and the documents.

What triggers it:
- Employment letter says one job; LinkedIn says another
- Bank balance on application form differs from statements
- Travel dates conflict with visa stamps in passport
- A documented past refusal not declared

How to fix it: deception findings carry a 10-year ban — far harder to recover from. Reapply only with comprehensive documents that resolve the discrepancy in writing. Consider an immigration solicitor for any deception-route refusal; the stakes are too high to handle alone.

## How to read the refusal letter

UK refusal letters cite the specific Immigration Rule paragraph. Decoding them:

- **Appendix V 4.2(a)** — Genuine visitor / will leave at end of visit (most common)
- **Appendix V 4.2(b)** — Will not undertake prohibited activities
- **Appendix V 4.2(c)** — Sufficient funds available
- **Appendix V 4.3** — Pattern of visits suggests intention beyond visiting
- **Paragraph 9.4.1** — Credible criminal record
- **Paragraph 9.7.1** — False representation in this or earlier application (deception)
- **Paragraph 9.7.2** — Previous refusal in same category, no fresh material
- **Paragraph 9.8.1** — Previous deception triggers automatic refusal for 10 years

The numbers tell you exactly what the ECO doubted. Use them to focus your reapplication.

## Reapplying — when and how

There is no formal cooling-off period for Visitor visa reapplications (unlike some work routes). You can reapply the next day.

But the smart approach:
- Wait at least 2 months unless the original refusal was clearly an ECO error
- Address every specific concern in the original refusal
- Add new evidence — the same documents will fail again
- Include a covering letter explicitly responding to the refusal points

Statistics from immigration tribunals suggest reapplications with addressed weaknesses succeed roughly 65–75% of the time; reapplications without address succeed under 20% of the time.

## When to consider an Administrative Review or Appeal

- **Administrative Review**: applicable for some visit visa decisions where you believe the ECO made an error. Cost £80. Limited grounds — you cannot submit new evidence; review is on the original case file. Generally lower success rate than reapplying with new evidence.
- **Appeal**: visit visas have very limited appeal rights. Only available where a human rights ground was claimed (rare for visit). For most visit refusals, reapplication is the practical route.

## Should you use an agent?

Most successful Visitor visa applications do not need an agent. The application is mostly about evidence, not legal complexity. Where an agent or solicitor adds real value:
- Deception findings (high stakes, formal legal route)
- Multiple prior refusals (strategic planning required)
- Complex ties or sponsor situations
- Long-term plans involving family reunion

Be wary of unregulated agents charging £500+ for simple reapplications. The Home Office form is straightforward; preparing a clean evidence pack is the work that matters.

## Practical reapplication checklist

- Read the refusal letter carefully and identify each cited paragraph
- For each cited paragraph, identify what evidence would address it
- Gather new or stronger documents, dated after the original refusal
- Write a 1–2 page covering letter directly addressing the refusal points
- Submit through the same online portal — there's no separate "reapplication" route
- Pay the standard fee again (no discount for reapplication)
- Choose priority service if your travel dates are imminent

See our [Visitor visa guide](/visa/visitor) for the full document list and application walkthrough.
`.trim(),
  },

  {
    slug: 'uk-health-care-worker-visa-2026-complete-guide',
    title: 'UK Health and Care Worker Visa 2026 — Complete Guide',
    description:
      'Full 2026 guide to the UK Health and Care Worker visa: eligible roles, £25,600 salary minimum, IHS exemption, care worker route closure, and how to apply.',
    date: '2026-04-29',
    updated: '2026-04-29',
    readMinutes: 8,
    tags: ['Health & Care', 'Healthcare workers', 'NHS'],
    body: `
The Health and Care Worker visa is the UK's most generous work route — cheaper fees, IHS exemption, and a lower salary threshold than Skilled Worker. But in 2026 it has also been the most-reformed: the care worker sub-route is closed to new overseas applicants, sponsor scrutiny is tighter than ever, and English requirements have been raised for certain roles. This guide covers who still qualifies, how the route differs from Skilled Worker, and the steps to apply.

## How Health and Care differs from Skilled Worker

Health and Care Worker visa is a sub-category of the Skilled Worker route, but with significant benefits:

| Feature | Skilled Worker | Health and Care |
|---|---|---|
| Application fee (3 years, out of UK) | £827 | £304 |
| Application fee (5 years, out of UK) | £1,636 | £590 |
| Immigration Health Surcharge | £1,035/year | **Exempt** |
| General salary minimum | £38,700 | £25,600 (or going rate) |
| New-entrant minimum | £30,960 | £20,960 (or going rate) |
| Sponsorship licence required | Yes | Yes (different category) |
| Path to ILR | 5 years | 5 years |
| Dependants allowed | Yes | Yes (with restrictions) |

The IHS exemption alone saves £3,105 over a 3-year visa — usually more than the entire visa fee. This is the most underused fact about the route.

## Who qualifies in 2026

You must be sponsored for one of these eligible roles by an approved health or care sector employer:

**Eligible roles (current):**
- Registered nurse (SOC 2231) — including adult, child, mental health, learning disability
- Doctor (SOC 2211, 2212)
- Midwife (SOC 2232)
- Paramedic (SOC 3213)
- Dentist (SOC 2215)
- Pharmacist (SOC 2213)
- Allied health professional (physiotherapist, occupational therapist, dietitian, radiographer, etc. — SOC 22XX series)
- Social worker (SOC 2442) — England-only restrictions apply
- Senior care worker (SOC 6135) — limited; see below

**Eligible employer types:**
- NHS trusts and foundation trusts
- NHS-commissioned organisations
- Private hospitals delivering NHS services
- Care homes registered with CQC (England), Care Inspectorate (Scotland), CIW (Wales), RQIA (NI)
- Adult social care providers regulated by the relevant national body

## Care worker route — what changed

In March 2025 the standard **care worker** role (SOC 6135 at non-senior level) was closed to new overseas applicants on the Health and Care visa. The government acted after widespread sponsor abuse cases — including over 470 sponsor licences revoked between 2022 and 2025.

What this means in 2026:

- New overseas applicants **cannot** apply for care worker positions (non-senior).
- Senior care worker positions remain open but at the higher £25,600+ salary.
- People already in the UK on care worker visas can extend; they are not affected.
- Switching from another visa (e.g. Student) to care worker is now also blocked for the standard role.

If you're in the UK on another visa, you can still switch to senior care worker, registered nursing, or other eligible roles — but not into entry-level care work.

## Salary thresholds in 2026

You must clear the highest of three:

1. **£25,600 general minimum** (or £20,960 for new entrants)
2. **Going rate for your SOC 2020 code**
3. **£12.82 per hour**

Going rates for common roles:

- Registered nurse (band 5) — £31,081 (NHS pay scale)
- Senior care worker — £25,600
- Care home manager (registered) — £34,000+
- Junior doctor (FY1) — £36,616 (NHS pay scale)
- Consultant — £93,666+ (NHS scale)
- Physiotherapist (band 5) — £31,081
- Pharmacist — £41,659 (NHS scale, or private going rate)

NHS positions follow the Agenda for Change pay bands; these salaries are already above the threshold for most roles. Private care home positions typically sit at or just above £25,600 — leaving little headroom.

## English language requirement

The Home Office requires CEFR B1 for most roles. In 2026, **nurses and doctors must now meet B2** (raised from B1) following the 2024 white paper changes.

Accepted tests:
- IELTS Academic 4.0 (B1) or 5.5 (B2)
- OET (Occupational English Test) — specifically designed for healthcare; widely accepted
- Pearson PTE Academic, Trinity ISE, LanguageCert
- Degree taught in English from a recognised institution

Most NHS roles also require professional English certification (NMC for nurses, GMC for doctors), which is typically a higher bar than the Home Office's.

## Costs in 2026

| Item | Out of UK | In UK switch |
|---|---|---|
| Application fee (3 years) | £304 | £304 |
| Application fee (5 years) | £590 | £590 |
| IHS | £0 (exempt) | £0 (exempt) |
| Priority service | £500 | £500 |
| Super priority | n/a | £1,000 |

Total for 3 years: as low as **£304**. A Skilled Worker visa for the same period costs around £4,400. The savings are enormous and almost always covered by the sponsor.

## Documents you'll need

- Current passport
- Certificate of Sponsorship reference number from your employer
- Proof of English (IELTS, OET, etc.) or evidence of qualifying nationality
- Tuberculosis test result (if from a listed country)
- Criminal record certificate from each country you've lived in for 12+ months in the last 10 years (for roles working with children or vulnerable adults — virtually all healthcare)
- Evidence of maintenance funds (£1,270 for 28 days, OR A-rated sponsor certifies it)
- Professional registration evidence (NMC PIN, GMC number, HCPC registration, etc.) — must be obtained before applying

## Sponsorship — choosing the right employer

Health and Care sponsors fall into roughly three tiers:

**Tier 1 — High-trust, low-risk:**
- NHS trusts (all)
- Major teaching hospitals
- Top 50 care home chains (HC-One, Barchester, Care UK, Bupa, etc.)

**Tier 2 — Mid-trust, check track record:**
- Mid-sized NHS-commissioned providers
- Regional care home groups
- Private hospitals (BMI Healthcare, Spire, Nuffield)

**Tier 3 — Higher risk, due diligence essential:**
- Small single-site care homes
- Care agencies (many had licences revoked in 2023–25)
- Newly licensed sponsors

For Tier 3, check the sponsor licence register at gov.uk, look up CQC inspection ratings, search Companies House for the company structure, and ask current overseas staff about working conditions. Sponsor licence revocation cancels your visa.

## Dependants in 2026

Most Health and Care visa holders can bring:
- Spouse / civil partner / unmarried partner
- Children under 18

**Exception added January 2024:** care workers can no longer bring dependants on new applications. This restriction does not apply to registered nurses, doctors, midwives, or allied health professionals — they can still bring family.

Each dependant pays the standard £582 application fee (3 years) plus IHS at the dependant rate of £776/year (dependants on Health and Care are **not** IHS-exempt — only the main applicant is).

## Path to ILR

The Health and Care Worker visa counts toward Indefinite Leave to Remain in the same way as Skilled Worker — 5 years of continuous residence with up to 180 days absent per rolling 12 months. The 5-year clock starts from the date your Health and Care visa takes effect.

At extension and at ILR application, you'll need:
- Continuing employment in an eligible role (or having moved between eligible roles with new sponsor licence)
- Salary at the prevailing threshold at the time of application
- HMRC tax records consistent with declared salary
- Life in the UK Test pass
- B1 English (or B2 for nurses/doctors as required by profession)

## Application process — step by step

1. **Find an eligible sponsor.** Use the sponsor licence register (filtered for Health and Care category) at gov.uk.
2. **Pass the English test** if not exempt.
3. **Get professional registration** with the relevant UK body (NMC for nurses takes 2–6 months; GMC for doctors takes 3–9 months including PLAB). Start this before applying for visa.
4. **Receive Certificate of Sponsorship** from employer (digital reference number).
5. **Gather documents** including TB test, criminal record certificates, qualifications.
6. **Apply online** at gov.uk — pick the Health and Care Worker visa option.
7. **Attend biometrics appointment** at VFS / TLS / Visa Application Centre.
8. **Wait for decision** — 3 weeks standard, 5 working days priority.
9. **Collect BRP or activate eVisa** on arrival in the UK.

## Common mistakes

1. **Confusing Health and Care with Skilled Worker.** The lower fees and IHS exemption only apply if you select Health and Care on the application form. Selecting Skilled Worker by accident costs you thousands.
2. **Applying before professional registration is complete.** Without NMC PIN / GMC number, the application fails.
3. **Using a sponsor on the wrong licence.** Some sponsors hold a Skilled Worker licence but not Health and Care category. Confirm before accepting a CoS.
4. **Forgetting criminal record certificates.** For healthcare roles, certificates from every country you've lived in for 12+ months in the last 10 years are mandatory.
5. **Missing the senior vs non-senior care worker distinction.** Senior care worker still works; standard care worker is closed.

## What's coming in 2026–2027

The Migration Advisory Committee is reviewing the entire Health and Care route in late 2026. Possible changes:
- Salary threshold harmonisation with Skilled Worker (would raise to £38,700)
- IHS exemption review (most likely to be retained for cost reasons)
- Further restrictions on care worker dependants
- Mandatory English certification renewal at extension

If you're considering this route, applying in 2026 is likely cheaper and easier than waiting for the next review cycle.

See our [Health visa guide](/visa/health) for the application walkthrough, or our [eligibility checker](/eligibility) to see if you qualify.
`.trim(),
  },

  {
    slug: 'uk-dependant-visa-rules-2026-spouse-children',
    title: 'UK Dependant Visa Rules 2026 — Spouse and Children Explained',
    description:
      'Who can bring dependants on a UK visa in 2026: rules for Skilled Worker, Student, Health and Care, and Family visas, fees, income requirements, and the dependant ban that affects students.',
    date: '2026-04-29',
    updated: '2026-04-29',
    readMinutes: 8,
    tags: ['Dependants', 'Spouse', 'Children'],
    body: `
The right to bring your spouse and children to the UK depends entirely on which visa **you** hold — and in 2026 the rules are stricter than at any point in the last decade. Three major restrictions have come in since 2024: Student visa dependant ban for most courses, care worker dependant ban, and tighter income evidence at Skilled Worker level. This guide walks through who can bring family in 2026, what it costs, and the documents needed.

## Who counts as a "dependant"?

The Home Office defines a dependant as:

- A **spouse** or **civil partner** (legally married/registered in the relevant country)
- An **unmarried partner** living together in a relationship akin to marriage for **2+ years**
- A **child under 18** at the date of application

Children turning 18 during the visa can extend as dependants. Adult children, parents and siblings are **not** dependants on most routes — they must apply separately under specific routes (Adult Dependent Relative is the main one, and it is famously restrictive).

## Visa-by-visa rules in 2026

### Skilled Worker visa — full dependant rights

You **can** bring spouse and children. Each dependant:
- Pays application fee (£827 for 3 years, £1,636 for 5 years) — same as you
- Pays IHS at £1,035/year (adult) / £776/year (child) — full amount, no exemption
- Counts toward your maintenance requirement (extra £285 per dependant for 28 days, unless A-rated sponsor certifies)

Cost example: Skilled Worker + spouse + one child for 3 years (out-of-UK initial application):
- 3 × £827 = £2,481 fees
- IHS: £1,035 × 3 + £776 × 3 = £5,538
- **Total: ~£8,019**

Dependants on Skilled Worker can work in any job (no sponsorship needed for them), study, and access NHS but not most public benefits.

### Student visa — dependant ban (huge change)

From January 2024, Student visa dependants are **banned** for almost all courses. The exceptions:

- **Government-sponsored students** (Chevening, Commonwealth, etc.) on courses 6+ months
- **PhD or doctoral students** (research degrees only)
- **Students whose course is 6+ months and started before January 2024** (legacy)

Most master's and undergraduate students cannot bring family in 2026. This is the single biggest visa change of the last decade for South Asian and African students, who have historically brought spouses on Student dependant visas.

If you're not in the eligible group above and want to bring family, the practical paths are:
1. Spouse applies as a Skilled Worker independently (if they have UK employment offer)
2. Wait until you switch to Skilled Worker post-graduation and add dependants then
3. PhD route — research degrees still allow dependants

### Health and Care Worker visa — split rules

Most roles (nurses, doctors, allied health) **can** bring dependants on standard terms.

**Care workers cannot** bring dependants on new applications since January 2024. This affects roughly 100,000 new applicants per year.

Salary applies for the main applicant; dependants don't need to meet any threshold themselves.

### Family visa — this IS the dependant route

If you don't have UK status but your spouse/partner does (British citizen, settled, or refugee/humanitarian status), they can sponsor you on a Family visa. This is a separate route, not a "dependant" sub-category.

Requirements (sponsor side):
- £29,000 annual income (or qualifying savings)
- Suitable accommodation
- Genuine relationship evidence
- English language at A1 (initial) / A2 (extension) / B1 (ILR)

See our [Family visa article](/blog/uk-family-visa-minimum-income-2026-what-counts) for the £29,000 breakdown.

### Visitor visa — 6 months for family visits

If you only want family to visit short-term, they don't need a "dependant" visa — they apply for a standard Visitor visa, valid up to 6 months. They cannot work, study (more than recreational courses), or settle on this route.

### Graduate visa — restricted

Graduate visa allows dependants **only if** they were already on your Student visa as dependants. New dependants cannot be added. This catches out students who married during their UK studies.

### Global Talent and Innovator Founder — full rights

Both allow dependants on standard terms — fees, IHS, no income test for the main applicant (since the visa itself proves capacity).

## Documents required for dependant applications

For spouse/civil partner:
- Marriage / civil partnership certificate (translated and apostilled if foreign)
- Cohabitation evidence (joint bills, tenancy, photos with dates, communications during separation)
- Spouse's passport
- Spouse's TB test (if from a listed country)
- Spouse's biometrics enrolment
- Two recent photos of the couple together

For unmarried partner:
- 2 years of cohabitation evidence — joint tenancy, joint bills, both names on bank statements, etc.
- Statement from each partner about the relationship
- Evidence of relationship over time (photos with dates, communications)

For children under 18:
- Birth certificate showing the parents' names
- Both parents' passports
- If only one parent is applying or already in the UK, consent letter from the other parent
- Custody documentation if applicable
- Child's TB test (if from listed country and child is over 11)
- Two recent photos of the child

## Income evidence for dependants

For Skilled Worker:
- £285 per dependant for 28 days in savings, OR
- A-rated sponsor confirms maintenance in the CoS / sponsor letter

For Family visa (where you are the dependant):
- The £29,000 sponsor income test applies — sponsor's job, savings, or pension evidence

## Common mistakes

1. **Marrying mid-Student-visa, then trying to add dependant.** The student dependant ban applies — they cannot join you while you're on Student visa. Wait until Skilled Worker.
2. **Applying for partner separately for cost savings.** Each application is a separate fee. There is no discount for batched family applications.
3. **Missing apostille on overseas documents.** Marriage certificates from many countries (India, Pakistan, Nigeria, Egypt, etc.) need apostille / legalisation. Get this in your home country before applying.
4. **Forgetting child consent letter.** Single parent or separated parents cases need explicit consent from the other parent for the child to travel and apply.
5. **Bringing children turning 18.** Apply before their 18th birthday. After 18, they need a separate visa route — usually Student or Skilled Worker.

## When dependants arrive — practical setup

Once granted, dependants can:
- Enter the UK on the same date or after the main applicant
- Get a BRP / eVisa with the same expiry as the main applicant
- Work without restriction (Skilled Worker dependants, unlike main applicant, are not tied to a sponsor)
- Use NHS (paid for via IHS)
- Open UK bank accounts (need to bring proof of address and visa)

If their relationship to the main applicant ends (separation, divorce, death), they typically have 60 days to apply for an alternative visa or leave the UK. Skilled Worker dependants who have built their own career may switch to Skilled Worker in their own right at that point.

## Strategic planning

Optimal timing for dependant applications:
- **Apply together at initial visa stage.** Cheaper than adding later (no separate biometrics scheduling, single solicitor consultation).
- **Children born in the UK** while parents are on visa get British citizenship only if at least one parent is settled (ILR or British) at the time of birth. Otherwise they get the same status as the parent.
- **ILR for dependants** is achievable at the same 5-year mark as the main applicant, assuming continuous residence.

See our visa guides for [Skilled Worker](/visa/skilled-worker), [Health & Care](/visa/health), [Family](/visa/family), and [Student](/visa/student) for route-specific dependant detail.
`.trim(),
  },

  {
    slug: 'uk-visa-english-language-requirement-2026',
    title: 'UK Visa English Language Requirement 2026 — Tests & Exemptions',
    description:
      'Full 2026 guide to UK visa English language tests: CEFR levels required by route, accepted tests (IELTS, OET, PTE), exemptions for native speakers and degree holders, and the new B2 rules for nurses and doctors.',
    date: '2026-04-29',
    updated: '2026-04-29',
    readMinutes: 7,
    tags: ['English language', 'IELTS', 'Tests'],
    body: `
Every UK visa applicant — whether for work, study, family or settlement — must demonstrate they meet a specific English language standard. The required level varies dramatically by route, and the rules around accepted tests and exemptions changed significantly in 2024–25. This 2026 guide explains exactly what level you need for your visa, which tests to take, and the exemptions that save many applicants £200–£300 in testing fees.

## CEFR levels required by visa route

The UK uses the Common European Framework of Reference (CEFR) standard. Each visa specifies a minimum level:

| Route | Required level | Notes |
|---|---|---|
| Student visa (degree level RQF 6+) | B2 | Universities often require higher |
| Student visa (below degree RQF 3–5) | B1 | Foundation, A-level, etc. |
| Skilled Worker | B1 | Same for Health & Care, Scale-up |
| Health & Care (nurses, doctors) | **B2** (raised from B1 in 2024) | Professional registration may demand higher |
| Family visa — initial application | A1 | Lowest UK threshold |
| Family visa — extension after 30 months | A2 | |
| Family visa — ILR | B1 | Same as Skilled Worker |
| ILR (most routes) | B1 | |
| Naturalisation (citizenship) | B1 | Plus Life in the UK Test |
| Global Talent | None (route-specific) | |
| Innovator Founder | B2 | Higher than most work routes |
| Visit visa | None | |
| Graduate visa | None (proven at Student stage) | |

The biggest pitfall: Family visa applicants must clear three different levels at three different stages — A1, A2, then B1. Many forget to retake at extension.

## What CEFR levels mean in practice

- **A1 (Beginner)** — Can introduce yourself, ask simple questions, understand short slow speech.
- **A2 (Elementary)** — Can have simple conversations on familiar topics, write short messages.
- **B1 (Intermediate)** — Can handle most travel situations, describe experiences, give short reasoned opinions.
- **B2 (Upper-intermediate)** — Can converse fluently with native speakers, write clear detailed text, follow complex arguments.

Roughly speaking: B1 is where most applicants who studied English in secondary school land naturally; B2 takes deliberate practice or having lived in an English environment.

## Accepted tests for UKVI in 2026

The Home Office maintains a Secure English Language Test (SELT) list. Tests not on this list are **not accepted** for visa purposes — even if internationally recognised.

**SELT-approved providers (2026):**

1. **IELTS for UKVI** — Academic or General Training. Most popular globally. ~£230. Centres in 140+ countries.
2. **IELTS Life Skills** — A1, A2 and B1 only (no reading/writing). For Family and ILR. Cheaper at ~£175.
3. **Pearson PTE Academic UKVI** — All levels. Computer-based, fast turnaround. ~£200.
4. **LanguageCert International ESOL SELT** — All levels. Increasingly popular for being £140–£190.
5. **Trinity College London ISE SELT** — Available in UK only. ~£175.
6. **OET (Occupational English Test)** — Healthcare-specific. Required by NMC/GMC anyway. ~£500.

### Which test to choose

- **IELTS** — safest default; accepted everywhere, widely available. Choose Academic if also applying to UK universities.
- **PTE Academic** — fastest results (often 2 days vs 13 for IELTS), computer-based, no human examiner subjectivity.
- **LanguageCert** — cheapest option; appearing in more centres each year.
- **IELTS Life Skills** — cheapest for Family / ILR applicants who only need A1, A2 or B1.
- **OET** — only worth it if you're a nurse/doctor already needing it for professional registration. Double-purpose test.

Test results expire **2 years** from the date sat. Apply for your visa within that window or you'll need to retake.

## Exemptions — when you don't need a test

You are **exempt** from the test if any one of these applies:

### 1. Majority English-speaking country nationality

You are a national (passport holder, not just resident) of:
- Antigua and Barbuda
- Australia
- Bahamas
- Barbados
- Belize
- Canada
- Dominica
- Grenada
- Guyana
- Ireland (separate route anyway)
- Jamaica
- Malta
- New Zealand
- St Kitts and Nevis
- St Lucia
- St Vincent and the Grenadines
- Trinidad and Tobago
- USA

Note: India, Nigeria, Pakistan, the Philippines, Kenya, Ghana etc. are **not** on this list despite widespread English use.

### 2. Degree taught in English

You hold a UK academic degree (Bachelor's, Master's, or PhD) — automatically counts.

You hold a non-UK degree taught entirely in English. You'll need:
- An **Ecctis (formerly UK ENIC) verification statement** that the qualification is equivalent to a UK Bachelor's / Master's / PhD
- An **English Medium of Instruction (EMI) confirmation** from the institution

Ecctis statements cost £210 and take 10–15 working days. Plan ahead.

### 3. Previously approved in earlier UK visa

If you have already met a particular English level on a prior successful UK visa application, you usually do not need to re-prove it for the same or lower level. The Home Office checks your file.

Example: a Student visa applicant who passed B2 IELTS in 2022. They can switch to Skilled Worker (B1) without retesting. The B2 evidence is on file and covers the lower B1 requirement.

This is the most-overlooked exemption. Always check your prior UK application file before booking a new test.

### 4. Specific other exemptions

- **Under 18** — child applicants do not test.
- **65 or over** — exempt from English at all stages including ILR (but still need Life in the UK Test).
- **Long-term physical or mental condition** preventing testing — requires evidence (GP letter, specialist report).

## Booking and sitting the test

1. **Choose a SELT centre** at gov.uk/find-test-centre.
2. **Book online** — usually 1–4 weeks ahead in popular cities; 1–2 days in less busy centres.
3. **ID requirements** — passport only. Driving licence and other ID are not accepted at SELT centres.
4. **Bring exam confirmation** — printed or on phone.
5. **Allow 3–4 hours** for IELTS / PTE; OET takes longer.
6. **Get results** — IELTS 13 days; PTE 2–5 days; LanguageCert 5–7 days.

Test centres are stricter than general IELTS — phones must be off and stowed; food and water only in clear bottles; bathroom breaks are escorted.

## When tests get rejected

The most common reasons your test won't be accepted:

1. **Wrong test type.** "IELTS Academic" (regular) is not the same as "IELTS for UKVI Academic." The UKVI version is the one Home Office accepts.
2. **Expired results.** 2 years from test sitting date, not from result date.
3. **Wrong CEFR mapping.** IELTS 4.0 is B1 in reading/listening but A2 in writing/speaking; minimum scores in **each component** must reach the required CEFR level, not just the overall band.
4. **Counterfeit certificates.** The Home Office cross-checks every test with the awarding body's database. Even genuine certificates from suspended test centres (this has happened with several centres in the past 5 years) cause refusal.
5. **Name discrepancy.** Name on test must match passport exactly. Initials, missing middle name, or character differences trigger refusal.

## Family visa special — the three levels

Family visa applicants face the trickiest English journey:

1. **A1 at initial application** (entry clearance or in-country switch) — easiest level, often passed with IELTS Life Skills.
2. **A2 at 30-month extension** — must be retested unless higher previous evidence.
3. **B1 at ILR application** — must be retested unless higher previous evidence.

Plan ahead: if you take an A2 test at initial application stage, you'll need to retest at A2 minimum (or B1) at extension. Taking B1 at initial application saves you the A2 retest — useful if your English is already that level.

## Cost summary

| Test | Levels covered | Approx. cost |
|---|---|---|
| IELTS Life Skills | A1, A2, B1 only | £175 |
| LanguageCert SELT | A1–C2 | £140–£190 |
| Pearson PTE UKVI | A1–C2 | £200 |
| IELTS for UKVI Academic | A1–C2 | £230 |
| Trinity ISE SELT (UK only) | A1–C2 | £175 |
| OET | B1+ healthcare | £500 |

Plus Ecctis statement if claiming exemption via foreign degree: £210.

## What to do next

1. **Check if you're exempt first.** Save the £140+ test fee if you can.
2. **Identify your required level** for your specific visa.
3. **Pick the cheapest SELT test that covers your level.**
4. **Book at least 4 weeks before your visa application** to allow time for results and resits if needed.
5. **Sit the test in person** — there are no remote SELT options (a common misconception).

See our route-specific guides for full English requirements at each stage: [Family visa](/blog/uk-family-visa-minimum-income-2026-what-counts), [Skilled Worker](/visa/skilled-worker), [ILR](/blog/uk-ilr-indefinite-leave-to-remain-2026-requirements).
`.trim(),
  },

  {
    slug: 'uk-eta-electronic-travel-authorisation-2026',
    title: 'UK ETA Electronic Travel Authorisation 2026 — Who Needs It & How to Apply',
    description:
      'The UK ETA scheme is now mandatory for most non-visa nationals visiting the UK. Who needs one in 2026, how to apply (£10, 3 days), validity, and what to do if refused.',
    date: '2026-04-29',
    updated: '2026-04-29',
    readMinutes: 6,
    tags: ['ETA', 'Visitor', 'Travel authorisation'],
    body: `
The UK Electronic Travel Authorisation (ETA) scheme rolled out in phases between 2023 and 2025, and as of 2026 it is now mandatory for almost all non-visa-required nationals visiting the UK. Coming for a holiday from the US, Canada, Australia, the EU or 30+ other countries? You almost certainly need an ETA before you board. This guide covers who needs one, the £10 application process, validity rules, and what to do if denied.

## What is an ETA?

An ETA is a digital pre-travel authorisation, similar to:
- US ESTA
- Canadian eTA
- Australian ETA

It is **not** a visa. It is permission to *travel to* the UK; the final decision to enter is still made by Border Force when you arrive. But without an ETA, the airline will refuse to board you.

## Who needs an ETA in 2026

You need an ETA if **all** of the following are true:

1. You are a national of one of the eligible countries (see list below)
2. You are visiting the UK for tourism, business, short study (under 6 months), or transit
3. You do not already hold a UK visa or other UK immigration status (e.g. Family permit, settled status)
4. You are not a British or Irish citizen

### Countries that need an ETA in 2026

Full list as of 2026 (subject to expansion):
- All EU/EEA member states + Switzerland
- USA, Canada, Australia, New Zealand
- Japan, South Korea, Singapore, Hong Kong (BNO holders separate route)
- Gulf states: Bahrain, Kuwait, Oman, Qatar, Saudi Arabia, UAE
- Israel, Brunei
- Antigua and Barbuda, Bahamas, Barbados, St Kitts and Nevis, St Lucia, etc. (Caribbean Commonwealth)
- Argentina, Chile, Uruguay
- Taiwan, Malaysia, Mauritius

### Who does NOT need an ETA

- British and Irish citizens
- Holders of a current UK visa (Skilled Worker, Student, Visitor, etc.)
- Holders of UK settled status (ILR, EUSS)
- Holders of a UK Family Permit
- Nationals of "visa national" countries (India, China, Pakistan, Nigeria, etc.) — these still need a full visit visa, not just an ETA
- Children under 18 if travelling with a parent who has an ETA — wait, this is wrong: **every traveller including infants needs their own ETA**

## How to apply

**Where:** UK ETA app (iOS / Android) or gov.uk/guidance/apply-for-an-electronic-travel-authorisation

**Cost:** £10 per person (free for under-3s but they still need an ETA submission)

**Time:** Most decisions are returned within minutes; the official target is **3 business days**.

### What you need to apply

- A valid passport (must remain valid for at least the duration of your stay)
- A recent digital photo (or live face scan via app)
- A credit/debit card
- An email address for notifications

### Step by step

1. Download the UK ETA app or go to the gov.uk page.
2. Choose "Apply for an ETA."
3. Scan the photo page of your passport.
4. Take a live selfie (the app checks it matches your passport photo).
5. Answer questions about employment, recent travel, criminal history, immigration history.
6. Pay £10 by card.
7. Receive ETA decision by email — usually within 30 minutes.

## ETA validity rules

- Valid for **2 years** from issue, OR until your passport expires (whichever is sooner)
- Allows **multiple visits** during validity
- Each visit can be up to **6 months** (the standard visitor allowance)
- Allows **transit** through UK airports

You do not need to apply for a new ETA for each visit during the 2-year validity. If your passport is renewed during this period, your old ETA does not transfer — you must apply for a new one linked to the new passport.

## What you can do on an ETA visit

The ETA permits the same activities as a standard Visitor visa:

- Tourism, leisure, sightseeing
- Visiting family and friends
- Short business activities (meetings, training, conferences)
- Short-term study courses under 6 months
- Transit through UK airports
- Marriage / civil partnership if pre-arranged at a registered venue

You **cannot**:
- Work or run a business in the UK
- Live in the UK long-term
- Study a course over 6 months
- Access public funds or NHS-eligible long-term services
- Claim asylum on entry (separate process)

## ETA refusals and what to do

ETA refusal rates are low — around 1–2% — but rising as Home Office screens more carefully. Common refusal reasons:

### 1. Previous UK immigration breach
Overstayers, deportees, or those with prior UK refusals will usually be refused an ETA and must apply for a full visitor visa instead.

### 2. Serious criminal convictions
You must declare convictions in any country. Serious convictions (12+ months custodial in last 10 years; offences against children; drug trafficking; serious violence) result in refusal.

### 3. Inconsistent passport / identity issues
- Damaged passport
- Different name from previous visa applications
- Recent passport issued without supporting biographical detail

### 4. Recent travel patterns suggesting overstay risk
Frequent short trips with quick returns can flag concerns.

### 5. Application errors
Wrong nationality, wrong date of birth, mismatched photo — these are rejected automatically and require new application + new £10 fee.

## If refused

A refusal letter explains the ground. You can:
1. **Apply for a standard Visitor visa instead** — this allows fuller documentation and more discretion, though costs more (£127) and takes longer (3 weeks).
2. **Reapply for ETA** if the refusal was due to a fixable error (wrong details, recoverable identity issue). You'll pay £10 again.
3. **Address the underlying issue first** if refusal cited immigration history or criminal record — apply for visa with detailed explanation rather than ETA.

There is no formal ETA appeal route — your remedy is to reapply (for fixable issues) or escalate to a visitor visa application.

## ETA and connecting flights / transit

If you transit through a UK airport (e.g. London Heathrow connecting to another country), you need an ETA in 2026 — even if you don't pass through immigration. The exceptions are:

- **Same terminal, airside transit** at LHR / LGW under 24 hours — some routes still don't require ETA
- **Direct Airside Transit Visa (DATV) routes** for certain nationals — different scheme

The rules around transit have shifted multiple times. If your itinerary involves a UK stopover, check the most current gov.uk transit guidance before booking.

## Common mistakes

1. **Booking flights before getting ETA.** While ETA approval is fast, the few applications that go to manual review can take 3+ business days. Apply at least a week before travel.
2. **One ETA for a family.** Each person — including infants — needs their own.
3. **Assuming ETA works for work or long study.** It doesn't. Misusing ETA for work activity triggers entry refusal and a future ban.
4. **Forgetting ETA when boarding a UK-bound flight.** Airlines check ETA at check-in. No ETA = no boarding. You don't get a chance to "explain at the gate."
5. **Renewing passport mid-validity and assuming ETA carries over.** It doesn't.

## What's coming next

- **Phase 4 expansion** in 2026: more nationalities expected to be added to the ETA-eligible list, moving some current visa nationals (e.g. South Africa is being discussed) into ETA territory.
- **EU national rollout** completed October 2024; most teething issues at borders resolved by 2026.
- **Possible integration with eVisa system** for status verification at borders.

## ETA vs Visit visa — which do you need?

| Situation | Use |
|---|---|
| US/EU/Australian tourist | ETA |
| Visit visa national (India, China, etc.) tourist | Visit visa |
| Already hold Skilled Worker visa | Neither |
| Long study (12 months) | Student visa |
| Working short-term | Work visa |
| Family member of UK national wanting to live | Family visa |

See our [Visitor visa guide](/visa/visitor) if you're a visa national, or our [eligibility checker](/eligibility) if unsure which route applies.
`.trim(),
  },

  {
    slug: 'uk-innovator-founder-visa-2026-endorsement-guide',
    title: 'UK Innovator Founder Visa 2026 — Endorsement and Business Plan Guide',
    description:
      'Complete 2026 guide to the UK Innovator Founder visa: endorsing bodies, business plan requirements, no minimum investment, 3-year route to ILR, and the bar most applicants underestimate.',
    date: '2026-04-29',
    updated: '2026-04-29',
    readMinutes: 9,
    tags: ['Innovator Founder', 'Entrepreneur', 'Business'],
    body: `
The Innovator Founder visa replaced the older Innovator and Start-up visas in April 2023 and is the UK's primary route for entrepreneurs in 2026. It has three rare benefits: no minimum investment requirement, a faster 3-year path to ILR, and full work rights including other employment alongside your business. But the bar — endorsement by an approved body for a genuinely innovative, viable and scalable business — is significantly higher than headline guides suggest. This article walks through what it takes to actually get endorsed in 2026.

## What is the Innovator Founder visa?

A 3-year visa for non-UK entrepreneurs who:
- Have a **new business idea** that is innovative, viable and scalable
- Have been **endorsed** by a Home Office-approved endorsing body
- Meet financial maintenance, English, and good character requirements

Key features:
- No minimum investment (the previous £50,000 requirement was dropped in 2023)
- Settle (ILR) after 3 years — fastest non-Global-Talent route
- Can work for another employer alongside running the business
- Full dependant rights
- Renewable indefinitely if you don't reach ILR criteria

## The three endorsement criteria

The bar is set by these three words. They are assessed separately and you must satisfy **all three**.

### Innovative
Your business idea must be original or address a market gap in a meaningfully new way. Endorsers look for:
- A novel product, service or business model
- Clear differentiation from competitors
- Defensible IP, technology, or unique market insight
- "Why now" — what makes this idea timely

What does **not** count as innovative:
- A new restaurant, café or retail store
- A standard import/export business
- A consulting / professional services firm offering generic services
- A franchise of an existing chain

### Viable
The business must be capable of running successfully — i.e. the founder has the skills, market knowledge and plan to make it work. Endorsers look for:
- A founder with relevant industry experience or technical expertise
- A realistic financial plan with sensible revenue assumptions
- Identified customers, contracts or pilot users
- Adequate funding identified (even if not raised yet)

### Scalable
The business must have potential to grow significantly — creating jobs, generating substantial revenue, and reaching beyond a single locality. Endorsers look for:
- Total addressable market size
- Path to £1m+ revenue within 3–5 years
- Plans to hire UK staff
- Distribution channels that scale

## Approved endorsing bodies in 2026

There are currently four endorsing bodies for new Innovator Founder applications (as of early 2026):

1. **Envestors Limited** — generalist, broad industry coverage
2. **UK Endorsement Services Limited** — generalist
3. **Innovator International** — international entrepreneurs, generalist
4. **The Global Entrepreneurs Programme (GEP)** — for established founders relocating to the UK (high bar; typically £1m+ revenue)

The old list of 10+ endorsing bodies has been pruned. Some previously-approved bodies (Tech Nation, etc.) no longer endorse new applicants.

### Endorsement application process

Each body has its own application portal and assessment process. Typical flow:

1. Submit initial expression of interest with elevator pitch and biography
2. Submit detailed business plan (15–40 pages)
3. Pay assessment fee (£500–£3,000 depending on body)
4. Interview with endorser's review panel (60–90 minutes)
5. Decision: endorse, defer (more work needed), or decline

Endorsement takes **6–12 weeks** end to end. Decline rates vary by body — Envestors and UK Endorsement Services report approval rates around 30–40%.

The endorser writes you an endorsement letter referencing the three criteria. You upload this to your Home Office visa application.

## The business plan — what endorsers actually want

The plan is the document the endorser will spend most time on. Best practice in 2026:

**Mandatory sections:**
- Executive summary (1 page)
- Problem and solution
- Market analysis with TAM/SAM/SOM (total/serviceable/obtainable market)
- Competitive analysis with named competitors and your differentiators
- Product/technology description — for tech businesses, this should include architecture or IP claims
- Go-to-market strategy
- Financial model — 3-year projection with monthly view in year 1
- Funding plan — how much you'll raise, from whom, and when
- Founder background and team
- UK economic contribution — projected jobs, exports, tax revenue

**Red flags endorsers look for:**
- Vague TAM figures ("$10 trillion AI market")
- No identified customers or pilot users
- Founder with no relevant industry experience
- Generic financial projections (linear growth, no seasonality)
- No mention of competitors (suggests poor market research)
- Heavy reliance on "we'll figure it out as we go"

**Length:** 15–25 pages is typical. Don't pad. Endorsers prefer dense, well-evidenced documents to fluffy 60-page essays.

## Eligibility checklist

To apply for the visa itself (after endorsement):

1. Endorsement letter from approved body
2. Age 18 or over
3. £1,270 maintenance funds in your account for 28+ days
4. CEFR B2 English (higher than Skilled Worker)
5. TB test if from listed country
6. Genuine intention to operate the business in the UK
7. No serious criminal record

There is **no minimum personal investment** required. You can come with £0 personal funds, provided the business plan shows the funding model works.

## Costs in 2026

| Item | Amount |
|---|---|
| Endorsement fee | £500–£3,000 (varies by body) |
| Visa application fee (out of UK) | £1,191 |
| Visa application fee (in UK switch) | £1,486 |
| IHS (3 years × £1,035) | £3,105 |
| Priority service | £500 |
| Dependant fee (each) | £1,191 + IHS |

Total minimum (single applicant, no dependants): around **£5,800** including a mid-range endorsement fee.

## The 3-year route to ILR

Innovator Founder is one of the few routes offering ILR in 3 years instead of 5. To qualify for ILR at the 3-year mark, you must demonstrate the business has met at least **two of the following seven indicators**:

1. **Investment**: at least £50,000 invested in the business from any source (founder funds, angel, VC) — this is now an ILR test, not a visa entry test.
2. **Jobs**: created at least 10 full-time UK jobs at standard pay (or 5 jobs each paying £25,000+).
3. **Revenue**: business turnover of £1m+ in the last full year.
4. **Customers**: turnover £500,000+ from non-UK customers.
5. **Innovation**: significant R&D activity / IP development.
6. **Investment institution**: investment from a recognised UK or international institutional investor.
7. **Profitability** or paid taxes at certain levels.

Most successful Innovator Founders meet criteria 1 + 2 or 1 + 3.

## Switching from another visa

You can switch into Innovator Founder from inside the UK if you currently hold:
- Start-up visa (legacy route, transitioning)
- Skilled Worker visa
- Student visa or Graduate visa (must have completed UK degree)
- Most other long-term visas

You cannot switch from visitor visas, transit, or short-term student.

For Graduate visa holders specifically: the Innovator Founder route is increasingly popular as the UK's structured path from graduation to entrepreneurship. The endorsing bodies look favourably on UK-educated founders with relevant degree-related ventures.

## Common mistakes

1. **Targeting the wrong endorsing body.** Each has industry preferences. Tech-heavy ideas do better at certain bodies; sustainability or social impact at others. Research recent endorsements.
2. **Submitting a thin business plan.** The biggest single reason for decline. Endorsers want depth, not slogans.
3. **Treating the interview lightly.** The panel will probe weaknesses in the plan. Founders who can't defend their numbers fail at this stage.
4. **Claiming innovation that isn't.** "First X in the UK" is often dismissed if the concept exists elsewhere. Be honest about differentiation.
5. **Forgetting B2 English.** Higher than Skilled Worker — many entrepreneurs assume their existing B1 evidence is enough.
6. **Underestimating the timeline.** Most successful applicants spend 6–12 months on the plan and endorsement process before applying.

## What to do if endorsement is declined

Each body has its own appeal process — usually allowing one resubmission within 6 months if you significantly strengthen the plan. Alternative paths:

- **Try a different endorsing body.** Each has different preferences; a decline at one is not a death sentence elsewhere.
- **Pivot the business idea** to address the specific feedback.
- **Consider Skilled Worker** if your business plan isn't endorsable but you have employable skills.
- **Consider Global Talent** if your endorsement letter route includes founder-level recognition in your field.

## Practical preparation timeline

Realistic timeline from "I want to do this" to landing in the UK:

- **Months 1–3:** Develop business plan, build founder credentials, secure pilot customers/partners
- **Months 4–6:** Submit endorsement application; respond to follow-ups; sit interview
- **Months 7–8:** Receive endorsement; gather visa application documents; sit B2 English test
- **Months 9–10:** Submit Home Office visa application; biometrics; await decision
- **Month 11+:** Move to UK

Compressing this is risky. Founders who try to do it in under 6 months typically submit weaker plans and decline rates rise.

See our [Innovator Founder visa guide](/visa/innovator-founder) for the full document list, or our [eligibility checker](/eligibility) if you're unsure which route fits.
`.trim(),
  },

  {
    slug: 'uk-visit-visa-documents-checklist-2026',
    title: 'UK Visit Visa Documents Checklist 2026 — Complete List by Purpose',
    description:
      'Full 2026 checklist of documents for a UK Visit visa: passport, finances, ties, sponsor letter, itinerary and purpose-specific evidence. With examples by country and visit type.',
    date: '2026-05-14',
    updated: '2026-05-14',
    readMinutes: 9,
    tags: ['Visitor visa', 'Documents', 'Checklist'],
    body: `
A UK Visit visa application succeeds or fails on the strength of its document bundle. The Home Office gives Entry Clearance Officers 15–25 minutes per case, so the easier it is to verify your story from the paperwork, the higher your chance of approval. This 2026 checklist covers every document type the Home Office accepts, ordered by category, with notes on what makes each one a strong piece of evidence versus a weak one.

## How the checklist works

There is no single "required document list" published by the Home Office for Visit visas. Instead, the decision is made on **balance of probabilities** that you meet the [genuine visitor test](/blog/uk-visitor-visa-refused-top-reasons-2026). Your job is to submit enough credible evidence in four categories:

1. **Identity** — who you are
2. **Finances** — you can afford the trip without working
3. **Ties to home country** — you'll return
4. **Purpose** — credible reason for visiting, evidenced

Every document should serve at least one of these four. Documents that don't are noise and dilute the application.

## Category 1 — Identity documents

### Required for everyone

- **Current passport** — must have at least one blank page and validity beyond your planned departure date from the UK. The Home Office recommends 6 months minimum validity.
- **Previous passports** if they contain visa stamps relevant to your travel history (especially Schengen, US, Canadian, Australian visas).
- **A digital photo** taken within the last 6 months meeting the gov.uk photo specifications (white background, neutral expression, no glasses).

### Required if applicable

- **Marriage certificate or civil partnership certificate** if travelling with spouse or for marriage visitor purposes.
- **Birth certificates of children** if children are part of the application.
- **Old name documents** (deed poll, name change certificate) if your name on documents differs from current passport.

### Strong vs weak

- Strong: passport with multiple recent Schengen, US, or Australian visa stamps demonstrating travel discipline.
- Weak: passport less than 6 months old with no prior travel history.

## Category 2 — Financial documents

### Required

- **6 months of bank statements** from your main current account or salary account. Must show:
  - Account holder name matching passport
  - Account number, bank name and address on each page
  - Regular salary or business income credits
  - Average balance comfortably covering trip costs

If your most recent statement is more than 30 days old, the Home Office may consider it stale.

### Strong financial evidence

- Salary credits every month for 6+ months, consistent in amount.
- Average closing balance well above the cost of the planned trip (rule of thumb: 3× total trip cost).
- No suspicious deposits — large unexplained credits weeks before application destroy credibility.

### Weak financial evidence

- Statements showing balance build-up immediately before application.
- Single large deposit from an unverified source.
- Heavy gambling, betting, or crypto transaction history.
- Account balance below trip cost.

### Optional but very useful

- **Payslips** for the last 6 months matching the bank deposits.
- **P60 / annual tax return** showing annual income consistent with monthly payslips.
- **Fixed deposit certificates** or savings account statements showing assets beyond the current account.
- **Pension statements** for retired applicants.
- **Property ownership documents** (title deeds, registered land ownership) — particularly powerful for demonstrating ties.

## Category 3 — Ties to home country

This is the single most scrutinised category. ECOs need to believe you'll leave the UK at the end of your stay.

### Employment ties

- **Employer letter** on letterhead, dated within 4 weeks of application, stating:
  - Your name, position, start date with the company
  - Confirmation that you're employed at the company
  - Approved leave dates (must include the dates of your UK visit)
  - Confirmation that you're expected to return to work after the visit
  - HR contact name, phone number, email address
- **Employment contract** signed and current.
- **Recent payslips** (also evidence of finances).

### Self-employment / business ties

- **Business registration certificate** (Certificate of Incorporation, partnership registration, sole trader registration).
- **Recent tax returns** showing the business is active.
- **VAT registration certificate** if applicable.
- **Recent business bank statements** showing ongoing activity.
- **Contracts or invoices** from the last 3–6 months demonstrating active operation.

### Family ties

- **Marriage certificate** if married and spouse is not travelling.
- **Birth certificates of children** if children are not travelling.
- **School enrolment letters** for school-age children showing they will be in school in your home country during your trip.
- **Letters from spouse or family confirming your expected return** — these have limited weight but can support a wider picture.

### Property and economic ties

- **Property ownership documents** in your name (title deed, registered ownership).
- **Tenancy agreements** showing ongoing lease commitments in home country.
- **Mortgage statements** showing active loan repayments.
- **Council tax bills, utility bills** in your name showing ongoing residence.
- **Bank loan documents** showing committed financial obligations at home.

### Strong vs weak ties

- Strong: long-term employed with senior position, owned property, school-age children remaining in home country, multiple verified travel returns.
- Weak: self-employed without business registration, single with no dependants, no property, no prior international travel.

You cannot fabricate ties you don't have. If your situation has thin ties, compensate with strong financial evidence, detailed itinerary, and reliable sponsor.

## Category 4 — Purpose-specific documents

### Tourism visit

- **Flight booking confirmations** (return flights from the UK). Refundable bookings are fine if you prefer not to commit before approval.
- **Hotel reservations** for the entire stay, or sponsor's address details if staying with family/friends.
- **Day-by-day itinerary** — typed, one page maximum, listing where you'll be each day with key activities (sightseeing locations, train journeys, etc).
- **Tickets to specific events** (concerts, sporting events) if relevant.

### Visiting family or friends

- **Sponsor's invitation letter** signed and dated, including:
  - Sponsor's full name, address, phone number
  - Relationship to applicant
  - Dates of the planned visit
  - Confirmation of accommodation offered (own room, shared, etc.)
  - Confirmation of any financial support being provided
  - Sponsor's signature and date
- **Sponsor's immigration status documents**:
  - British citizen — passport bio page
  - Settled person — eVisa share code or BRP scan
  - On valid visa — eVisa share code or BRP scan
- **Sponsor's most recent 3–6 months of bank statements** if they're providing financial support.
- **Sponsor's payslips and employer letter** if employed.
- **Sponsor's proof of accommodation**:
  - Tenancy agreement (if renting)
  - Mortgage statement (if owner)
  - Council tax bill
  - Recent utility bill in sponsor's name

### Business visit

- **Invitation letter from UK company** on letterhead, including:
  - UK company name, address, Companies House registration number, VAT number
  - UK contact's name and position
  - Purpose of visit (meetings, training, conference)
  - Dates of visit
  - Confirmation of who is paying expenses
- **Your employer letter** confirming the trip is sponsored by your employer.
- **Conference / event registration confirmations** if attending an event.

### Marriage visitor

- **Confirmation of marriage venue** with a licensed registrar in the UK.
- **Notice of marriage** documentation if already filed.
- **Evidence of relationship** — photos with dates, communications, joint trips.
- **Evidence of intention to leave** the UK after the ceremony.

### Transit visitor

- **Onward flight booking** showing departure within 48 hours of arrival.
- **Visa for destination country** if required.

## Category 5 — Previous travel history

This is technically not a separate category but is checked carefully by the ECO.

- **Old passports** with stamps showing visits to Schengen, US, Canada, Australia, UK (if any).
- **Confirmation pages from prior visa grants** if not stamped in passport.
- **Departure stamps** showing compliance with previous visa conditions.

Travel history cannot be fabricated. If thin, focus other categories.

## Document quality standards

### Translations

Every non-English document must be translated by a certified translator. The translation must include:
- The translator's full name and contact details
- The translator's signature
- The date of translation
- A confirmation that the translation is accurate

Translations from family members or unqualified translators are not accepted.

### Originals vs copies

The Home Office now accepts digital uploads of documents for most Visit visa applications. Original documents are usually not requested. However:
- Bank statements should show bank name and stamp/seal on each page if you can get them stamped.
- Employer letters should be on letterhead with the HR contact's signature.

### Common rejection patterns

- **Photocopies of photocopies** — too blurry, hard to verify.
- **Bank statements without account holder name visible** — must show your name on the same page as transactions.
- **Employer letter with no contact details** — looks suspicious; ECOs cannot verify.
- **Translations done by family members** — not accepted; must be by certified translator.
- **Documents older than 6 months** — considered stale.

## Putting the bundle together

Recommended structure for upload (most applicants upload PDFs combining multiple documents):

1. **Cover letter** (optional but recommended) — 1 page introducing yourself, the purpose of the visit, and a brief list of supporting documents.
2. **Passport bio page**
3. **Photo**
4. **Financial bundle** (bank statements + payslips + P60 in one PDF)
5. **Employment bundle** (employer letter + contract in one PDF)
6. **Ties bundle** (property docs + family docs in one PDF)
7. **Purpose bundle** (sponsor letter + sponsor docs + itinerary in one PDF)
8. **Travel history** (passport stamps, prior visas)

Total bundle size should be **15–35 pages** for most applicants. Thinner bundles risk weak-evidence refusals. Thicker bundles (over 50 pages) make the ECO's job harder and risk key documents being missed.

## Cover letter — a quiet advantage

A 1-page cover letter is optional, but for applicants from higher-refusal countries (Pakistan, Nigeria, Bangladesh, certain African nations), it materially raises approval odds. A good cover letter:

- States your name, age, occupation, and country in the first line.
- Explains the purpose of the visit in 2–3 sentences.
- Lists your ties to your home country (job, family, property) in 3–4 bullets.
- Confirms who is funding the trip.
- Lists key supporting documents by reference.
- Closes by stating your intention to return on a specific date.

No legal language needed. Plain English, factually accurate, dated and signed.

## What NOT to include

- **Fake or altered documents.** Detection is sophisticated; the consequence is a 10-year ban under deception provisions.
- **Documents in your sponsor's name** that don't relate to you. Only the sponsor's own immigration, accommodation and financial documents are relevant.
- **Lengthy emotional letters** about why you want to visit. Stick to facts.
- **Documents older than 6 months** unless specifically required (e.g. marriage certificate, property deed).
- **Newspaper articles, awards, certificates** unrelated to the visit purpose.

## Final pre-submission checklist

Before clicking submit:

- [ ] Passport bio page scanned clearly, all four corners visible
- [ ] 6 months of bank statements, every page legible
- [ ] Employer letter dated within last 30 days
- [ ] All non-English documents have certified translations attached
- [ ] Sponsor (if applicable) has provided all their immigration + accommodation + financial documents
- [ ] Flight bookings and hotel reservations (or sponsor address)
- [ ] Day-by-day itinerary
- [ ] No file over 6MB (Home Office limit)
- [ ] All files in PDF, JPG or PNG format

See our companion article on [the top reasons Visit visas get refused](/blog/uk-visitor-visa-refused-top-reasons-2026) for what to avoid, and our [Visitor visa guide](/visa/visitor) for the application walkthrough.
`.trim(),
  },

  {
    slug: 'uk-skilled-worker-sponsor-licence-how-to-find-2026',
    title: 'UK Skilled Worker Sponsor Licence — How to Find a Licensed Employer (2026)',
    description:
      'How to find a UK Skilled Worker sponsor in 2026: the official register, filtering by industry, what makes a good vs bad sponsor, and how to verify before accepting an offer.',
    date: '2026-05-14',
    updated: '2026-05-14',
    readMinutes: 8,
    tags: ['Sponsorship', 'Skilled Worker', 'Job search'],
    body: `
The single hardest thing about getting a UK Skilled Worker visa isn't the application — it's finding a licensed sponsor willing to hire you. Of the 1.5 million UK businesses, fewer than 60,000 hold a Skilled Worker Sponsor Licence. Less than half of those actively sponsor non-UK workers in a typical year. This guide explains exactly how to find sponsors in 2026, how to filter them by industry and salary credibility, and how to spot the warning signs of unethical sponsors that lead to revoked visas.

## What a Sponsor Licence actually is

A Skilled Worker Sponsor Licence is permission granted by the UK Home Office for an employer to sponsor non-UK workers. Holding a licence means the employer has:

- Demonstrated it is a genuine UK business
- Paid the licence fee (£574 for small/charity, £1,579 for medium/large)
- Committed to meeting sponsor compliance duties (record-keeping, reporting changes, monitoring attendance)
- Identified key personnel responsible for compliance

Without a licence, an employer **cannot** sponsor you. Even if they want to. Even if they will pay above threshold. Job offers from unlicensed employers are a dead end.

## The official sponsor register

The Home Office publishes the complete list of approved sponsors every working day at:

**https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers**

The file is an Excel/CSV download. It contains:

- **Organisation name** — exact legal name
- **Town/City** — primary licence address
- **County** — region
- **Type of rating** — A (premium), B (limited), or "Provisional" for newly licensed
- **Route** — the visa categories the licence covers (e.g. Skilled Worker, Senior or Specialist Worker, Graduate Trainee, etc.)
- **Sub-tier** (older terminology, still referenced)

The list runs to roughly 100,000 lines in 2026 — most lines are duplicate rows for sponsors holding multiple route licences. Filtering by "Worker" or "Skilled Worker" route narrows it to about 60,000.

## How to use the register effectively

### Step 1 — Download and filter

Open the file in Excel or Google Sheets. Filter:
- **Route** contains "Worker" (the Skilled Worker visa)
- **Type of rating** is "A" or "A (Premium)" — avoid B-rated and Provisional sponsors as starting choices (more on this below)

### Step 2 — Filter by location

If you have a city preference, filter **Town/City** column. Common patterns:
- "London" gives ~16,000 sponsors
- "Manchester" ~2,500
- "Birmingham" ~2,000
- "Edinburgh" ~900
- "Leeds" ~1,000

### Step 3 — Filter by industry signal

The register itself doesn't include industry codes. To filter by sector:
- Cross-reference each company name against Companies House (free at find-and-update.company-information.service.gov.uk).
- Look up SIC codes (Standard Industrial Classification) of each filtered company.
- Use bulk lookup tools — third-party Sponsor Licence search platforms layer SIC data on top of the official register for easier filtering. Most are free for basic search.

### Step 4 — Cross-check with LinkedIn

For each shortlisted sponsor, search the company on LinkedIn. Check:
- **Total employees** — small companies (<50) sponsor far less often than mid-size (50–500).
- **Job postings** — companies posting roles with "visa sponsorship considered" wording in 2025–26 are actively sponsoring.
- **Existing international hires** — check current employees' profiles. If many are visibly international, the company has a sponsorship track record.

## A-rated vs B-rated vs Provisional

The Type of rating column is critical:

| Rating | Meaning |
|---|---|
| **A (premium)** | Standard compliant sponsor in good standing. Choose these first. |
| **A (basic)** | Same as premium for practical purposes. |
| **B** | Sponsor has been put on a B-rating after a compliance issue. Must work on a Home Office-approved action plan. Cannot issue new Certificates of Sponsorship until upgraded back to A. |
| **Provisional** | Newly licensed sponsor on initial probation. Compliance not yet demonstrated. Use with caution. |

For job seekers, focus on **A-rated** sponsors. B-rated sponsors can't issue you a CoS while on B-rating, and Provisional sponsors carry higher revocation risk.

## Sponsorship is sector-specific

Some sectors have very high sponsor density and pay well above the £38,700 threshold:

- **Technology** — banks, fintech, big tech UK offices, mid-size SaaS, consulting tech practices. Heavy sponsorship, salaries usually £45k–£90k.
- **Healthcare** — NHS trusts, private hospitals, registered nursing care. Use the Health & Care Worker visa route here (separate, cheaper).
- **Investment banking & financial services** — JP Morgan, Goldman, HSBC, Barclays, etc. All licensed.
- **Engineering** — civil, mechanical, aerospace majors (Rolls-Royce, BAE Systems, Atkins, AECOM, Arup).
- **Consulting** — Big Four (Deloitte, PwC, EY, KPMG), strategy firms (McKinsey, BCG, Bain).
- **Legal services** — magic circle and US-headquartered firms. All licensed but limited to qualified lawyers.
- **Education** — state schools (DfE-coordinated for teacher shortage areas), private schools, universities.

Sectors with **low** sponsorship density:
- Hospitality and retail (most below threshold even when licensed).
- Marketing and creative agencies (small teams, threshold issues).
- Non-profit and charity sector (limited budgets for sponsor compliance overhead).
- Construction labour (mostly below threshold; some senior management roles eligible).

## What to do once you've found candidates

You have a list of, say, 80 A-rated sponsors in your sector and city. Now:

### Step 1 — Check current open roles

Search each on:
- LinkedIn Jobs
- Indeed
- The company's career page directly
- Otta, Hired, AngelList for tech

Focus on roles posted in the last 30 days that match your skill level.

### Step 2 — Filter for visa-friendly language

Job descriptions that explicitly say "we offer visa sponsorship" or "international applicants welcome" are gold. Job descriptions that say "must have right to work" are a hard no — they're filtering out anyone who needs sponsorship.

For ambiguous descriptions, check Glassdoor or LinkedIn for prior employees on visas; it tells you whether the company actually sponsors in practice.

### Step 3 — Salary check

The role must clear:
- **£38,700** general minimum (or £30,960 new-entrant rate if you're under 26 / recent graduate / switching from Student visa)
- The **going rate for your SOC 2020 code** (look up in our [Skilled Worker salary guide](/blog/uk-skilled-worker-visa-salary-threshold-2026))
- **£15.88/hour** minimum

If a job pays £35,000, it fails — apply elsewhere.

### Step 4 — Tailor your application

- **CV in UK format** — 2 pages, no photo, no date of birth, no marital status, no nationality at the top (but visa status can be in cover letter).
- **Cover letter** stating clearly: "I require Skilled Worker visa sponsorship from start date. I meet the £38,700 / new-entrant £30,960 threshold based on the salary advertised."
- **Apply via the company's own portal** when possible — third-party recruiters often filter out non-UK candidates pre-screening.

## Red flags — sponsors to avoid

### 1. Pay-to-sponsor schemes

If an employer asks **you** to pay for your CoS, the Immigration Skills Charge, or any administrative cost of sponsorship — it's illegal under UK law. Walk away. These schemes are widespread in care work and sometimes in IT contracting; sponsors that engage in them get their licences revoked en masse.

### 2. Sponsors with recent compliance issues

Check the Home Office's sponsor revocation register at gov.uk. Companies recently downgraded to B-rating or revoked have ongoing compliance problems that could affect your visa.

### 3. Tiny new sponsors

Sponsors registered in the last 12 months with no LinkedIn footprint, no Companies House filings, and no visible UK office are higher risk. Compliance training is hard; many new sponsors fail their first Home Office compliance audit.

### 4. Sponsors offering exactly threshold salary

If a company is offering precisely £38,700 (or £30,960 for new entrants), with no headroom, it's a thin margin. Any tax change or annual review error could push you below threshold at extension and refuse the renewal.

### 5. Recruitment agencies running visa schemes

Some agencies advertise "visa sponsorship guaranteed" packages where you pay upfront. Many are scams. Legitimate sponsors don't charge candidates.

## Verify the sponsor before accepting

Once you have an offer, do these checks **before** signing:

1. **Check the official sponsor register** — confirm the exact legal name of the offering company appears as A-rated for Skilled Worker.
2. **Check Companies House** — confirm the company is active, filings up to date, registered address makes sense.
3. **Check CQC / Ofsted / equivalent regulator** if applicable to the sector.
4. **Search the company on Glassdoor and Indeed** — look for employee reviews mentioning sponsorship experience.
5. **Ask current employees** — find a current or recent international hire on LinkedIn and politely message asking about their sponsorship experience.

A two-hour verification check now saves years of trouble if the sponsor turns out to be problematic.

## The Certificate of Sponsorship (CoS)

When you accept the offer, the sponsor issues a **Certificate of Sponsorship** — a unique alphanumeric reference number on the Home Office's Sponsorship Management System. It contains:

- Your name, date of birth, nationality
- The job title and SOC 2020 code
- Salary, hours, start date
- Sponsor's licence number
- Certificate validity period (you must apply for visa within 3 months)

You then use this CoS reference to apply for your Skilled Worker visa. The sponsor cannot pre-issue CoSs in bulk; each is for a specific named worker for a specific role.

## Costs the sponsor pays (not you)

- **Sponsor Licence fee** — £574 small/charity, £1,579 medium/large, paid every 4 years.
- **CoS issuance fee** — £239 per certificate.
- **Immigration Skills Charge** — £1,000/year for medium/large, £364/year for small/charity. Paid upfront for full visa duration.

For a 5-year Skilled Worker visa, the medium/large employer pays the Home Office around £6,800 in fees + Skills Charge before you arrive. This is why some smaller sponsors are slow to offer sponsorship: the cost matters.

## What you pay

- Visa application fee: £827 (3 years) or £1,636 (5 years)
- Immigration Health Surcharge: £1,035/year × duration
- Optional priority service: £500

Many sponsors will cover all or part of these for you as part of the offer package. Always negotiate this; it can be the difference between a job offer that costs you nothing and one that costs you £6,000.

## Final tactical advice

1. **Start broad, narrow systematically.** 80 candidates filtered to 15 with active roles is realistic.
2. **Apply to 20–30 roles per week.** Conversion is low; volume is necessary.
3. **Don't waste effort on unlicensed companies.** Confirm sponsor licence before applying.
4. **Prepare for rejections.** Most non-UK candidates need 50–200 applications to land a sponsored role.
5. **Use the new-entrant rate** if eligible — £30,960 unlocks roles below £38,700 that were otherwise blocked.

See our [Skilled Worker salary guide](/blog/uk-skilled-worker-visa-salary-threshold-2026) for occupation-specific thresholds, or our [Switch to Skilled Worker guide](/blog/switch-student-to-skilled-worker-visa-uk-2026) if you're moving from a Student or Graduate visa.
`.trim(),
  },

  {
    slug: 'uk-citizenship-10-year-long-residence-2026',
    title: 'UK Citizenship by 10-Year Long Residence — Complete 2026 Guide',
    description:
      'Full 2026 guide to the UK 10-year long residence route: who qualifies, absence rules (540 days), required documents, costs (£3,029 ILR + £1,500 citizenship), and how to apply step by step.',
    date: '2026-05-18',
    updated: '2026-05-18',
    readMinutes: 9,
    tags: ['Citizenship', 'ILR', 'Long residence', 'Settlement'],
    body: `
The 10-year long residence route is the UK\'s safety net for people who have spent a decade lawfully in the country but don\'t fit the standard 5-year visa pathways. It can also be the fastest route to British citizenship for visa holders who switched routes or had gaps in their employment-based path. With Home Office policy tightening in 2026 and refusal rates climbing, the rules matter more than ever. This guide explains exactly who qualifies, the absence trap that disqualifies most applicants, and the 2026 cost breakdown.

## What is the 10-year long residence rule?

Under paragraph 276B of the Immigration Rules (Long Residence — Settlement), you can apply for Indefinite Leave to Remain (ILR) if you have lived in the UK **continuously and lawfully** for 10 years. ILR is the gateway to British citizenship — you can apply for naturalisation 12 months later.

The route exists because many people don\'t follow a clean 5-year visa pathway. You might have switched between Student → Graduate → Skilled Worker, or held multiple visa types over the years. As long as your residence was continuous and lawful, the 10-year clock ticks regardless of which visa you held.

## Who qualifies in 2026

You qualify if **all** of the following are true:

1. You have spent **at least 10 continuous years** in the UK
2. Each year was on a **valid visa or leave to remain** (not just physical presence)
3. You have not been absent for more than **540 days in total** across the 10 years
4. You have not been absent for more than **184 days in any single trip**
5. You pass the **Life in the UK Test** and meet B1 English
6. You are of **good character** — no serious criminal convictions, no deception findings
7. You have not been in the UK on **specific excluded routes** (see below)

## The absence rule — what disqualifies most applicants

The 540-day total absence cap is the single biggest reason long residence applications get refused in 2026. The Home Office counts every day you were outside the UK during the 10-year period — including departure and arrival days in some interpretations.

Action steps:
- **Pull your passport stamps** for all 10 years. List every trip with dates.
- **Add up total days outside the UK.** If total exceeds 540, you cannot apply yet — wait for the worst year to roll off the back of the period.
- **Check no single trip exceeded 184 days.** A single 200-day trip disqualifies the entire application, even if total absences are under 540.

The Home Office has discretion to grant despite breaches in exceptional circumstances (serious illness, family bereavement requiring extended care), but this is rarely exercised in 2026 — the burden of evidence is severe.

## Which visa routes count toward the 10 years?

**Visas that count toward long residence:**
- Skilled Worker / Tier 2
- Student / Tier 4
- Graduate visa (added back to the count in 2024 after policy reversal)
- Health and Care Worker
- Global Talent
- Family / Spouse / Partner
- Youth Mobility Scheme
- UK Ancestry
- Innovator Founder
- Refugee status / Humanitarian Protection
- EUSS pre-settled and settled status
- Most other long-term visas

**Visas that do NOT count:**
- Visit visas (any duration)
- Transit visas
- Periods of overstaying (any duration breaks the clock)
- Time on temporary admission or immigration bail
- Time when leave was granted outside the Immigration Rules
- Domestic Worker in a Private Household visa (specific exclusion)

A common trap: people who spent 6 months on a visitor visa between their Student visa and Skilled Worker visa lose **both** the visitor period and any continuity. The 10-year clock resets to zero.

## Continuous residence — the 28-day grace rule

Continuous residence means no gaps where you had no valid visa. The Home Office historically allowed a **28-day grace period** for late visa applications, but this was tightened in 2023 and effectively removed in 2024 for new applications.

In 2026, you must show:
- Valid leave to remain (or applied-for extension with statutory protection) on every single day of the 10 years
- No periods where you were technically overstaying, even by one day
- No periods of "leave outside the rules" granted in compassionate circumstances

If you ever had a visa lapse and reapplied a week later, that gap likely breaks continuity and resets your clock.

## Costs in 2026

| Item | Amount |
|---|---|
| ILR application fee | £3,029 |
| Premium service (in-person same-day) | £1,000 (limited slots) |
| Super priority service (5 working days) | £800 |
| Life in the UK Test | £50 |
| Biometrics | Included |
| Citizenship application (separate, 12 months later) | £1,500 |
| Citizenship ceremony | £80 |

Single-applicant total to citizenship: around **£4,659** (standard service) or **£5,659** (super priority) including the citizenship stage.

For families: each adult applies separately. Children under 18 born in the UK during your residence have separate rules — see citizenship section below.

## Documents you\'ll need

For the ILR application:
- Current passport (and every prior passport covering the 10 years)
- All previous BRPs / eVisa records / visa decision letters
- Sponsor letter if currently on Skilled Worker (confirming continued employment)
- 12 months of recent payslips and bank statements
- HMRC tax records covering all 10 years (download from HMRC online account)
- P60s for each tax year
- Evidence of every absence (travel itineraries, boarding passes where available)
- Life in the UK Test pass certificate
- English language evidence (if not already on file from earlier visa)
- Council tax bills, tenancy agreements, utility bills demonstrating UK residence
- HMRC self-assessment records if you were ever self-employed

## English language and Life in the UK

Required for all applicants under 65 and over 18:

- **Life in the UK Test**: 24 multiple-choice questions, pass mark 75% (18 correct), £50, valid forever once passed
- **English language B1**: same as standard ILR — IELTS Life Skills B1, or evidence of degree taught in English, or majority-English-speaking nationality

Most long residence applicants have already passed these for earlier visa applications. The evidence carries forward.

## Discretionary refusals — what to avoid

Long residence applications are decided on the **balance of probabilities** but the Home Office has wide discretion. Common discretionary refusal reasons in 2026:

1. **Tax inconsistency.** Declared salary on visa applications doesn\'t match HMRC tax records over the 10 years. This has been weaponised under the "deception" provision. Reconcile any discrepancies with HMRC before applying.
2. **Criminal record below threshold.** Even cautions and spent convictions can be cited. Declare everything.
3. **Insufficient continuous residence evidence.** Gaps you can\'t document risk refusal even if you were genuinely in the UK.
4. **NHS debt over £500.** Routine immigration applications are refused if you owe more than £500 to the NHS for non-IHS-covered treatments.
5. **Public funds claims.** If your dependants claimed certain public funds, the Home Office may refuse even if you yourself did not.

## After ILR — the 12-month wait to citizenship

Once granted ILR via long residence, you can apply for British citizenship via **naturalisation** 12 months later (or immediately if your spouse is British). The citizenship application requires:

- 12 months of ILR (or marriage to British citizen)
- Maximum 90 days absent in the final 12 months
- Maximum 450 days absent in the last 5 years
- Life in the UK Test (same one)
- B1 English (same one)
- Good character requirement
- £1,500 application fee + £80 ceremony fee

The naturalisation route from long residence-based ILR is straightforward provided you maintain residence and don\'t accumulate absences during that final year.

## 10-year route vs 5-year route — which to take

If you\'re close to the 5-year mark on a standard Skilled Worker or Family visa, take the 5-year route — it\'s 5 years vs 10 years. The 10-year long residence route only makes sense if:

1. You don\'t qualify for a 5-year route (e.g. switched between non-qualifying visas)
2. You had gaps that disrupted a single-route 5-year clock but your overall residence remained lawful
3. You\'re a refugee with humanitarian protection (different rules apply)

For most clean Skilled Worker / Family visa holders, the 5-year route is the only one to consider. Long residence is the safety net for everyone else.

## When to apply

You can apply at any point after you complete 10 years of continuous lawful residence. Practical recommendations:

- **Apply when within 28 days of 10-year completion** — earlier applications can technically be refused as "premature"
- **Have a current valid visa** at the date of application — applying when your visa is about to expire risks complications
- **Use super priority service** at £800 — given the complexity of 10-year documentation, faster decisions reduce risk of supervening events (employment changes, absences)

## Common mistakes to avoid

1. **Counting visitor visa time** — does not count
2. **Underestimating total absences** — count both travel days as outside-UK days for safety
3. **Tax inconsistency** — reconcile HMRC records with declared salaries before applying
4. **Missing original BRPs / decision letters** — keep all immigration documents for the full 10 years
5. **Applying without Life in the UK Test booked** — test centres book out 2–6 weeks in advance
6. **Forgetting passport renewal during the period** — you need every passport you held during the 10 years

See our [ILR guide](/blog/uk-ilr-indefinite-leave-to-remain-2026-requirements) for general settlement requirements, or our [Skilled Worker guide](/visa/skilled-worker) if you\'re on a 5-year work route.
`.trim(),
  },

  {
    slug: 'bringing-parents-to-uk-adult-dependent-relative-2026',
    title: 'Bringing Your Parents to the UK in 2026 — Adult Dependent Relative Visa',
    description:
      'Full 2026 guide to the UK Adult Dependent Relative visa: who qualifies, the strict care requirement, evidence of long-term care need, fees (£3,250), and why most applications fail.',
    date: '2026-05-18',
    updated: '2026-05-18',
    readMinutes: 8,
    tags: ['Family visa', 'Dependants', 'Adult Dependent Relative', 'Parents'],
    body: `
Bringing your elderly parents to live with you in the UK is one of the hardest things to do under UK immigration law. The Adult Dependent Relative (ADR) visa is the only direct route, and it has a notoriously high refusal rate — over 80% of applications were refused in some recent years. This 2026 guide explains exactly who can qualify, what evidence the Home Office actually accepts, and the alternative options when ADR isn\'t realistic.

## What is the Adult Dependent Relative visa?

The ADR visa lets a UK-based British citizen or settled person sponsor a relative aged 18 or over who needs long-term personal care. Eligible relatives include:

- Parents
- Grandparents
- Brothers and sisters (over 18)
- Children (over 18)

Relatives must be related to either the sponsor or the sponsor\'s spouse. In-laws qualify if the spouse meets the sponsorship requirement.

It is the only direct route for bringing adult parents to settle in the UK. There is no equivalent to the spouse visa for parents.

## The two-part test

To qualify, the applicant must show **both**:

### Part 1 — Long-term personal care need

The applicant must, as a result of age, illness or disability, require **long-term personal care** to perform everyday tasks. "Everyday tasks" means:

- Washing
- Dressing
- Cooking
- Toileting

Standard household tasks like shopping, gardening, or financial admin do not qualify. The need must be for the most basic self-care.

This must be evidenced with:
- Medical reports from qualified doctors detailing the specific conditions
- Specialist medical opinions where applicable
- Letters from healthcare providers describing daily care requirements
- Photos / videos in severe cases showing the applicant\'s actual condition

### Part 2 — Unable to obtain required care in their home country

The applicant must show that the required level of care is **either unavailable** in their home country, **or unaffordable** even with the help of the UK sponsor.

This is where most applications fail. The Home Office has interpreted this requirement extremely strictly. Successful applicants typically show:

- The required specialist care does not exist in their home country (e.g. specific medical conditions requiring care not available)
- All affordable care options have been exhausted
- Cultural / personal factors (e.g. no other relatives, complex care needs)
- Detailed cost analyses showing private care is unaffordable even with UK financial support

A common refusal scenario: parents from India where home help services and live-in carers cost £200–500/month. The Home Office reasons that a UK-based child earning £40k+ could easily fund this — and refuses on the basis that affordable care IS available.

## The unwritten reality — refusal rates

The ADR visa has the highest refusal rate of any UK family route. Recent years saw 80–90% refusal rates. The bar set by the 2012 reforms was deliberately high to reduce the number of elderly parents joining adult children in the UK.

In practice, successful ADR applications typically involve:
- Single, widowed parent with no other relatives in the home country
- Specific medical conditions (dementia, advanced cancer, paralysis)
- Country where the required care is genuinely unavailable
- Comprehensive evidence package prepared by an immigration solicitor
- Strong UK sponsor financial position

If your parents are reasonably healthy and live in a country with available paid care (most countries), the ADR route will almost certainly fail.

## What the UK sponsor must show

The sponsor (you, in the UK) must demonstrate:

- **Status**: British citizen, settled person, or refugee
- **Accommodation**: suitable property without overcrowding the household
- **Income or savings**: enough to maintain the relative without recourse to public funds, typically £18,600+ income or equivalent savings
- **Long-term commitment**: declaration that you will provide care, accommodation and financial support for at least 5 years

Note: no specific income threshold is set in legislation (unlike spouse visas), but in practice £18,600+ is what most adjudicators accept.

## Costs in 2026

| Item | Amount |
|---|---|
| Application fee (out of UK) | £3,250 |
| Application fee (in UK switch) | £1,048 (rare; few in-UK applicants) |
| IHS (5 years) | £5,175 |
| Priority service | £573 |
| Total minimum out-of-UK | £8,425 |

If granted, the visa allows immediate ILR (settlement). The applicant does not need a 5-year qualifying period.

## Documents required

For the applicant:
- Birth certificate establishing relationship to sponsor
- Death certificate of spouse (if applicable)
- Detailed medical reports
- Letters from healthcare providers
- Evidence of current care arrangements
- Cost analysis of available care in home country
- Statement explaining why care cannot be obtained / afforded
- Passport and standard immigration documents

For the sponsor:
- British / settled status evidence
- Marriage certificate (if relating through spouse)
- Property ownership / tenancy documents
- 6 months of bank statements
- Payslips and employer letter
- P60
- Statement of support and commitment

## Why most ADR applications fail

The single most common reason: **the Home Office decides that care is available and affordable in the home country**, even with the sponsor\'s help.

Other common refusal reasons:
1. **Medical evidence too generic** — applicant must demonstrate specific care needs, not generic "old age"
2. **No exploration of in-country alternatives** — application must show care options were investigated and exhausted
3. **Other relatives available in home country** — if there\'s a sibling or close relative locally, refusal is likely
4. **Sponsor income insufficient** — typically need £25k+ to comfortably support a parent

## What to do if ADR isn\'t realistic

For most families, the ADR route will not succeed. Realistic alternatives:

### 1. Long-term visit visas
Parents can apply for 2, 5 or 10-year multi-entry Visit visas, each allowing visits of up to 6 months at a time. They cannot be in the UK for more than 6 months in any 12-month period as a general rule.

This works for parents who can travel back and forth but cannot settle permanently.

### 2. Family visit visa multiple-entry
Standard 6-month visit visas can be applied for repeatedly. Some parents make 4–6 visits per year, especially around major family events.

### 3. Settled status via citizenship
If you have UK citizen children, your parents may have indirect routes through extended family connections — though these are rare and complex.

### 4. Private medical visit visa
For specific medical treatment requiring time in the UK, the visitor visa allows medical treatment up to 11 months in some cases. Not a settlement route.

### 5. UK Ancestry visa (limited scope)
Only available to Commonwealth citizens with UK-born grandparents (the parents\' grandparent must be UK-born). Few people qualify.

## Practical timeline if you decide to apply

1. **Months 1–3**: Build medical evidence — multiple specialist reports, current care logs
2. **Months 4–5**: Conduct in-country care cost analysis with quotes from providers
3. **Months 6–7**: Prepare sponsor evidence and statement of support
4. **Month 8**: Consider immigration solicitor consultation (£300–800 for a strategic review)
5. **Month 9**: Submit application; expect 12+ weeks decision

If refused, you can appeal on human rights grounds (Article 8 family life), which is the most common successful path. Appeals add 6–18 months to the process.

## Common scams to avoid

The ADR visa\'s low success rate has spawned several scams:
- **"Guaranteed approval" solicitors** charging £5,000–15,000 — no one can guarantee Home Office approval
- **Fake medical reports** — Home Office routinely cross-checks with stated providers
- **Made-up "in-country care unavailability"** — claims about non-existent care that are easily verified

Stick to genuine OISC-registered advisers or SRA-regulated solicitors.

## The honest assessment

If you\'re considering ADR for your parents, here\'s the realistic check:

- **Are your parents physically dependent on others for basic tasks?** If no, refusal is almost certain.
- **Is care genuinely unavailable in their country?** If you live in a major Indian/Nigerian/Pakistani/Bangladeshi/Filipino city, care is available — refusal almost certain.
- **Do they have NO other relatives in the country?** If they have siblings or other adult relatives locally, refusal is likely.

For 90%+ of applicants, the practical answer is repeated long-term visit visas, not ADR. This isn\'t ideal but it\'s the reality of current UK immigration policy.

See our [Family visa guide](/visa/family) for related routes, or our [Visit visa article](/blog/uk-visit-visa-documents-checklist-2026) for long-term visit visa planning.
`.trim(),
  },

  {
    slug: 'uk-evisa-final-deadline-2026-how-to-migrate',
    title: 'UK eVisa Final Deadline 2026 — How to Migrate Before You Get Stuck',
    description:
      'Critical 2026 guide to migrating from BRP to eVisa before key deadlines. How to create your UKVI account, link your passport, and avoid the boarding refusals that hit thousands of travellers in 2025–26.',
    date: '2026-05-18',
    updated: '2026-05-18',
    readMinutes: 7,
    tags: ['eVisa', 'BRP', 'Immigration status', 'Travel'],
    body: `
The UK\'s shift from physical Biometric Residence Permits (BRPs) to digital eVisas is reaching its final stages in 2026. Travellers who haven\'t migrated have been stranded at airports across the world over the past 12 months, with airlines refusing boarding because they can\'t verify status without an eVisa share code. This guide explains exactly what you must do before the next major deadline, why thousands are still failing to complete migration, and the specific actions that prevent travel disasters.

## What\'s actually happening in 2026

The Home Office stopped issuing physical BRPs to most applicants on **31 December 2024**. Anyone granted leave from January 2025 onwards received an eVisa only — no physical card.

BRPs already in circulation have a printed expiry date of 31 December 2024 on most cards, **regardless of when your underlying visa actually expires**. This is intentional: the card\'s legal status as a stand-alone identity document ended on that date, but your immigration leave continues as originally granted.

Throughout 2025 and into 2026, airlines progressively integrated with the Home Office\'s electronic verification system. By mid-2026, **most major airlines refuse to board passengers who cannot produce a current eVisa share code at check-in or boarding gate**, even if their underlying leave is valid.

## Who still needs to act

You need to create or update your UKVI account immediately if **any** of the following applies:

1. You hold a current physical BRP and have never logged into the gov.uk UKVI account portal
2. You created a UKVI account but never tested generating a share code
3. You renewed your passport at any point since your visa was granted, and haven\'t updated your UKVI account with the new passport number
4. You hold ILR (Indefinite Leave to Remain) granted before 2020 and have a paper "no time limit" stamp in an old passport, not a BRP
5. You hold EUSS (EU Settlement Scheme) status but have never tested your share code recently

The single biggest cause of boarding refusals in 2026 is **passport renewal without UKVI account update**. The airline\'s system looks up your status against your current passport number. If the number doesn\'t match what\'s in your UKVI account, no match returns and the airline refuses to board.

## The 30-minute migration checklist

If you haven\'t done this yet, set aside 30 minutes and complete all steps:

### Step 1 — Create or access your UKVI account

- Go to **gov.uk/evisa**
- Click "Create a UKVI account" or "Sign in"
- Use the passport you used for your original UK visa application
- Verify your email and phone number

### Step 2 — Link your eVisa

- Inside the account, navigate to "View and prove your immigration status"
- Confirm your immigration details match Home Office records
- If they don\'t match, contact UKVI Resolution Centre via the linked form

### Step 3 — Update passport details

- If your current passport is different from the one you applied for your visa with, click "Update details"
- Enter the new passport number
- Submit a clear photo of your current passport bio page

This is the step most people skip and the one that causes airport refusals. **Do this for every passport renewal, not just at deadlines.**

### Step 4 — Generate and test a share code

- Click "Prove your right to work / rent / status"
- Generate a share code (valid 90 days; you can generate as many as you want)
- Open the code in a private browser window and verify your status displays correctly with date of birth check

If the code works, your eVisa is fully operational.

### Step 5 — Save key information

Record (somewhere secure, not on your phone\'s lock screen):
- Your UKVI account email and password
- A note of your immigration status type and expiry date
- The phone number used for verification

## The 2026 deadline timeline

| Date | What changes |
|---|---|
| **31 Dec 2024** | Physical BRPs no longer issued; existing cards lose stand-alone validity |
| **Throughout 2025** | Airlines progressively integrate eVisa verification |
| **Mid-2026** | Most major airlines refuse boarding without eVisa share code |
| **End 2026** | Some carriers may still accept BRP with manual phone verification, but reliability drops |
| **2027** | All remaining paper-based and legacy document holders expected to be fully migrated |

Note: your underlying immigration **leave** does not expire because of this transition. ILR is permanent. Visa expiry dates are unchanged. Only the practical ability to prove your status at airports and to UK officials is affected.

## What happens at airports right now

The current reality at major international airports (as of May 2026):

- **London Heathrow, Gatwick**: full eVisa integration. Boarding refused without share code at originating airport.
- **EU airports (Schengen → UK flights)**: most major carriers integrated. Refusals common.
- **Indian airports**: hit-and-miss — some carriers still accept BRP with phone verification.
- **US airports**: mostly integrated. Refusals common since late 2025.
- **Middle Eastern hubs (Dubai, Doha)**: variable by carrier.

If you\'re refused boarding:
1. Call the **Home Office Carrier Liaison Centre** (number on gov.uk/contact-ukvi-inside-outside-uk)
2. They can sometimes verify status by phone in real time, but airlines aren\'t obligated to accept this
3. If not resolved, you\'ll need to rebook flights — often at significant cost

This is why migrating before any planned travel is critical.

## Specific situations and what to do

### "I lost or damaged my BRP"
Don\'t apply for a replacement BRP — they\'re no longer issued. Instead, create your UKVI account using your decision letter reference or contact the BRP team for identity recovery.

### "I never received my decision letter"
For older grants (pre-2018) you may not have a letter. Use the support form at gov.uk/evisa with your full name, date of birth, nationality and visa type. The Home Office can verify and issue a recovery link.

### "I have ILR from before 2010 — paper-only in an old passport"
You urgently need to create a UKVI account. The Home Office\'s "no time limit" stamp in an expired passport is increasingly unrecognised at borders. Use the "I have ILR but no current document" path on gov.uk/evisa.

### "I\'m on EUSS pre-settled or settled status"
You already have a digital status — you only need to verify the UKVI account works and your current passport is linked.

### "I have dual nationality and travel on a different passport"
Each immigration status is linked to a specific passport. If you travel on a passport not linked to your UKVI account, the airline won\'t find your status. Update or add the passport you actually travel on.

### "I have multiple visa records (e.g. Student visa then Skilled Worker)"
Your UKVI account should show only your current status. Old expired statuses don\'t affect anything. Make sure the current one is linked to your current passport.

## The myths that cause problems

1. **"My BRP doesn\'t expire until 2027, so I\'m fine."** False. The BRP physical card became unusable as standalone evidence after 31 Dec 2024.
2. **"ILR is permanent, so I don\'t need an eVisa."** Your ILR is permanent, but proving it without a working eVisa is increasingly impossible.
3. **"The airline will figure it out at check-in."** Airlines lose £2,000–10,000 per "carrier liability" for transporting someone without valid status. They won\'t risk it.
4. **"I\'ll do it when I next travel."** Travel days are the worst time to discover your account doesn\'t work or your passport isn\'t linked. Do it now.

## Family members and children

Each person has their own UKVI account and eVisa. Parents must create accounts for children under 18, but the account belongs to the child and transfers to their control at 18.

If your spouse or children are dependants on your visa, they each need:
- Their own UKVI account
- Their current passport linked
- Their own ability to generate share codes

Frequent issue: parents create their own account but forget about children\'s accounts. Children get stuck at airports while parents pass through.

## What to do before any international travel

Pre-flight checklist (do this 1 week before any UK-bound trip):

- [ ] Log into UKVI account at gov.uk/evisa
- [ ] Confirm current passport number matches the one you\'ll travel on
- [ ] Generate a share code, test it works
- [ ] Save the share code somewhere accessible (email it to yourself)
- [ ] Confirm your underlying immigration status is still valid for the travel dates
- [ ] For children: repeat the entire process for each child

If anything fails, contact UKVI Resolution Centre **before** booking flights, not on the day.

## What\'s coming next

The Home Office roadmap through 2026–2027:
- **Late 2026**: integration with EU/Schengen entry system for border-side verification
- **2027**: phase-out of phone-based airline verification; eVisa share code becomes mandatory
- **Long-term**: integration with biometric facial recognition at UK borders

For now, the action is simple but urgent: create the account, link the current passport, test the share code, save the details. The 30 minutes you spend now prevents a stranded-at-airport disaster later.

See our companion article on [BRP vs eVisa changes](/blog/brp-vs-evisa-2026-whats-changing) for the underlying policy, or [Visit visa documents](/blog/uk-visit-visa-documents-checklist-2026) if you\'re helping family members travel to the UK.
`.trim(),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
