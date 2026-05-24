/**
 * Editor's commentary — original UKDesk analysis per visa route.
 *
 * This is not paraphrased gov.uk text. Each entry is editorial
 * synthesis written by the named editor (see editorialTeam.ts):
 *   1. "What makes this route hard" — the bottleneck most applicants hit
 *   2. "Who actually qualifies in practice" — practical filter beyond
 *      the formal eligibility list
 *   3. "What gov.uk doesn't tell you" — observation / synthesis insight
 *
 * Verified: 2026-05-19. Reviewer: R. Selladurai.
 */

export interface VisaCommentary {
  /** Visa slug — matches VISA_DETAILS key. */
  slug: string;
  /** Lead sentence — one-line summary of the editorial take. */
  takeaway: string;
  /** Three commentary sections, each ~150-200 words. */
  sections: { id: string; title: string; body: string }[];
}

export const VISA_COMMENTARY: Record<string, VisaCommentary> = {
  'skilled-worker': {
    slug: 'skilled-worker',
    takeaway:
      'The Skilled Worker route is the UK\'s main mid-career work visa, but the 2025 reforms pushed it firmly upmarket — graduate-only roles, six-figure-ish salaries for many SOC codes, and a sponsor licence that the employer must actually hold and be willing to use.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The single most underestimated requirement is the going rate — not the £41,700 headline floor, the SOC-specific number above it. A software engineer at SOC 2136 doesn\'t qualify at £41,700; the going rate is materially higher and the visa application gets refused if the CoS records anything below it. The second underestimated cost is the Immigration Skills Charge, which the employer pays (£1,000/year for large sponsors), not you — but employers price that into the offer either way. And the timing of the CoS matters: it is valid for three months from assignment, so a Home Office processing slow-down inside that window can quietly burn a £700+ application. Every Skilled Worker refusal we read in 2025 traces back to one of these three: salary mis-stated on the CoS, CoS expired, or sponsor licence revoked between issue and decision.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'In practice the route works best for two profiles: experienced professionals (5+ years\' track record) where the going rate is easy to clear and the employer is sponsor-experienced, and recent UK graduates moving from a Graduate visa into the new-entrant rate (70% of going rate, £33,400 floor) for the first four years. Mid-career switchers from countries with currency-adjusted salary norms (India, Pakistan, Nigeria, Philippines) are most vulnerable to the going-rate trap — UK pay needs to be benchmarked against UK rates, not against home-country expectations. Healthcare roles (doctors, nurses) have their own carve-outs on Health & Care Worker rather than Skilled Worker; care workers were closed to overseas recruitment in July 2025 entirely.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'A Skilled Worker visa is functionally tied to one sponsor — change employer and you need a new CoS and a new application before starting (cooling-off doesn\'t apply, but you cannot work for the new employer until the application is decided). Tax-record consistency matters at ILR: if your declared salary on past CoS doesn\'t match HMRC PAYE history, the Home Office reads it as deception under paragraph 322(5) and refuses settlement. Keep a running spreadsheet of your salary at every CoS issue and the corresponding tax-year P60 totals. And the route to ILR is currently five years, but the 2025 White Paper consulted on extending it to ten years for new entrants from 2028 — anyone applying now is locked into the five-year clock, but expect that protection to be challenged before settlement.',
      },
    ],
  },

  'student': {
    slug: 'student',
    takeaway:
      'The Student visa is the cheapest route into the UK at £558, but the genuine-student credibility test and the 28-day maintenance rule together cause more refusals than the academic side ever does.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The application form is easier than Skilled Worker, but the credibility interview is harder than applicants expect. Caseworkers are trained to test whether the course choice is rational given your prior education and intended career — a finance graduate applying for an unrelated MA in fine art at a low-ranked institution will be asked sharp questions, and weak answers refuse the visa. The 28-day maintenance window is the second trap: funds must be held in a single, eligible account (not a friend\'s account, not a balance transfer) for 28 consecutive days, with the bank statement dated no more than 31 days before applying. ATAS for sensitive science / engineering subjects adds 8 weeks to the timeline and is often forgotten until the visa applications stalls.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'The route works cleanly for applicants with: a track-record-status university (Russell Group, top mid-tier), a course that builds on prior qualifications in a sensible career direction, and family or personal funds documented across multiple months rather than a one-off deposit. From January 2024 most taught Masters students cannot bring dependants — a hard rule that closed the historical route for partner accompaniment, and the most common reason for refusals among Indian and Nigerian applicants who applied as a family. Government-sponsored students on 6+ month courses are the carve-out that still allows dependants. PhD students can still bring family.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'A Student visa is the strongest gateway visa in the UK system — it converts cleanly to Graduate (no employer needed) and from Graduate to Skilled Worker (sponsored). Treat it as a five-to-seven-year plan, not a one-off study trip. Time on Student doesn\'t count toward 10-year long-residence ILR, but time on subsequent Skilled Worker visas does, and the eVisa from 2026 makes the full history easier to evidence later. Funds-source clarity at Student stage is the foundation for every subsequent application — get it documented properly the first time. Working hours (20/week term, full-time vacation) are strict; a single payslip-day over the limit can void the visa and break the route to settlement.',
      },
    ],
  },

  'visitor': {
    slug: 'visitor',
    takeaway:
      'The Standard Visitor visa looks generous — six months, £135 — but the "genuine visitor" test is unforgiving, and pattern-of-visits refusals are the most common single ground in 2025.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The single biggest cause of refusal is not the documents — it is the caseworker concluding that you are making the UK your main home through repeat or back-to-back visits. The rule has no fixed threshold (no "stay under 90 days" formula), but a pattern of more than ~180 days in the UK across a rolling year, or a visa stamp showing you left the UK days before re-applying, will refuse the next visit. The second cause is the ETA system — most visa-exempt nationals now need a £10 Electronic Travel Authorisation, applied for via the gov.uk app, and arriving without one is treated as inadmissibility at the border, not just a paperwork issue.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'Genuinely short-stay tourists with clear home-country ties (job, mortgage, dependants, university enrolment) and a paper trail showing the trip is funded by the applicant\'s normal income — not by a one-off sponsor transfer — almost always pass. Family-visit applicants need an invitation letter from a UK sponsor on the right visa status (British/settled/long-term), with the sponsor\'s salary and address evidence. Long-term visit visas (2, 5, 10 years) work well for frequent business travellers and grandparents visiting UK-resident families — same six-month-per-visit cap but no need to re-apply each time.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'A visitor visa is not a route to anywhere else — you cannot switch from visitor to Skilled Worker, Family, or Student from inside the UK, you must leave and apply afresh. The Permitted Paid Engagement extension lets some visitors do up to a month of paid work in specific narrow categories (academic external examiner, professional artist invited to perform), but this is misused often enough that caseworkers are sceptical. Marriage-visit visitors who marry in the UK and then try to switch get refused — fiancé(e) visa or apply from outside is the only correct route. A previous undisclosed refusal in any country (Canada, US, Australia) is the fastest route to a Part 9 deception refusal in the UK; declare everything truthfully.',
      },
    ],
  },

  'family': {
    slug: 'family',
    takeaway:
      'The Family / Partner visa is the only practical UK route built around relationships, but the £29,000 minimum income threshold combined with the relationship-evidence bar makes it the route where applicants most often need professional help.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The minimum income requirement (£29,000 since April 2024, with consultation ongoing about a further raise) is the single biggest filter — and it must be met by the UK-based partner alone for the first six months of the relationship, not the couple jointly, unless cash savings of £88,500+ held for six months substitute. The second hard filter is relationship evidence: caseworkers want consistent, contemporaneous evidence of cohabitation or a married relationship — joint accounts opened years ago, tenancy in both names, photos across multiple years, message logs and travel records. A new couple with thin paper trail will be refused even when the relationship is genuine.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'The route works for: married couples with 2+ years of cohabitation evidence and a UK partner clearing £29,000 gross from employment income, or couples meeting the £88,500 cash savings rule via family wealth, or self-employed partners with two full tax years of SA302s showing the threshold. Fiancé(e) visa applicants planning a UK wedding within six months are a separate category — they cannot work, but they can switch to a partner visa once married. Adult dependent relative routes (parents joining UK children) are extremely restrictive: the dependency test is whether the parent can be cared for in their home country at any cost, and almost all applications are refused.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'The Family route is the longest path to ILR — five years initial leave broken into 2.5-year segments, plus a 10-year route for cases that don\'t meet the income threshold but pass an exceptional-circumstances test. The English-language ladder steps up at each stage (A1 → A2 → B1) and missing any one breaks the route. Adequate accommodation tests under the Housing Act 1985 are scrutinised more in 2025 than they were five years ago, especially for partners moving into shared housing. And the recent UK partner has limited recourse to public funds throughout the 10-year settlement clock — practical implications for benefit eligibility, NHS dental subsidies and council housing applications.',
      },
    ],
  },

  'health': {
    slug: 'health',
    takeaway:
      'Health & Care Worker is the most-favoured work visa for those who qualify — IHS-waived, reduced fees, fast-track processing — but the eligible-role list narrowed sharply in 2025 with the closure of overseas care-worker recruitment.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The 22 July 2025 closure of overseas care-worker recruitment (SOC 6135 and 6136) removed the largest single category that used this route. Most current applicants are NHS-employed clinical professionals — doctors, nurses, allied health professionals — and the test is now whether the SOC code is on the eligible list AND the sponsor holds the right endorsement. Professional-body registration (GMC, NMC, HCPC) is the second-biggest bottleneck — registration takes 12-26 weeks for international applicants, and the visa needs evidence of registration or a pending application reference number. Criminal-record certificates from every country of residence over the past ten years are required and often forgotten.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'In 2026 the route works for: registered or pending-registered medical doctors with a confirmed NHS or NHS-supplier offer, registered nurses with a CoS from an NHS trust, allied health professionals (physiotherapists, radiographers, paramedics) on the eligible SOC list, and existing care workers in the UK extending their visa (the closure does not affect renewals or in-country switches before 2028). The route does NOT work for overseas care workers without UK residence, private-sector dentists outside the NHS franchise, complementary medicine practitioners, or admin/management roles that don\'t hit the clinical SOC list.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'The IHS waiver is a £5,175 saving per adult per five years compared with Skilled Worker — meaningful enough that some Skilled Worker holders try to switch in-country, but this only works if the new role is on the Health & Care eligible list. The route to ILR is the same five years as Skilled Worker, but salary at each renewal must continue to meet the eligible threshold; falling below it (e.g. dropping to part-time without re-applying) breaks the route. Dependants on Health & Care still pay full IHS — the waiver is for the main applicant only. The route is uniquely vulnerable to NHS budget constraints because the sponsor licence is held by the employing trust; redundancy or trust merger can break the visa with 60 days\' notice.',
      },
    ],
  },

  'talent': {
    slug: 'talent',
    takeaway:
      'Global Talent is the UK\'s only widely-used unsponsored work visa — no employer, no salary floor, no job offer — but the endorsement stage filters out 60-70% of applicants and is the make-or-break gate.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The endorsement is harder than the visa. The six endorsing bodies (Royal Society, British Academy, Royal Academy of Engineering, UKRI for research; Arts Council England for arts; Tech Nation for digital) each publish detailed criteria, and the published acceptance rate at most bodies is materially lower than applicants expect. The portfolio limits (CV ≤ 3 pages, 10 supporting documents, 3 recommendation letters) leave little room — choosing the wrong 10 documents is the most common reason for endorsement refusal. The "exceptional talent" track requires demonstrated impact (citation counts, awards, products with measurable adoption); the "exceptional promise" emerging track is more accessible but still requires sustained recognition. The fast-track prize route (Nobel, Turing, Oscar, etc.) skips endorsement entirely but applies to a vanishingly small group.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'In research: postdocs with first-author publications in top journals, awarded grants, and named research lines. In arts: practitioners with national-level exhibitions, commissioned works, or production credits. In digital tech: founders or senior engineers with shipped products at significant scale, open-source projects with sustained adoption, or named roles at well-known tech companies. The route does not work for early-career professionals without independent recognition, regardless of company prestige — being a senior engineer at a FAANG without external profile (talks, papers, products) is not enough.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'Global Talent is the fastest route to ILR for those who get it — three years for the exceptional-talent track (vs five for Skilled Worker), with full work flexibility throughout. The visa does not tie you to an employer, so you can freelance, take multiple part-time roles, found a company, or move freely between research positions. The 3-month endorsement-to-visa window is strict; missing it forces re-endorsement and a second £561 fee. Endorsing bodies are not government agencies — they have their own assessment cultures and rejection feedback is limited. Re-applying after an endorsement refusal is allowed, but the second application is read against the first; the strategic move is to wait for a substantive new achievement rather than re-submit a refreshed CV.',
      },
    ],
  },

  'graduate': {
    slug: 'graduate',
    takeaway:
      'The Graduate visa is the easiest UK route to qualify for if you have just finished a UK degree — no sponsor, no salary floor, no employer — but its real value is the bridge it builds to Skilled Worker.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The route itself is easy — the gotcha is the May 2025 reform that reduced it from 2 years to 18 months for new bachelor\'s and master\'s graduates (3 years for PhDs is retained). Applicants on the legacy 2-year duration who applied before 31 December 2026 still have it; those after lose the buffer. The second gotcha is sponsor completion reporting — the visa cannot be granted until your education sponsor has notified the Home Office that you successfully completed the qualification, and a lag of 4-8 weeks between graduation ceremony and reporting is common. Applying before reporting completes will refuse the visa even if you have your degree certificate in hand.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'Anyone who: (a) currently holds a valid Student visa, (b) has successfully completed a UK bachelor\'s, master\'s, or PhD at a track-record-status sponsor, (c) the sponsor has reported completion to the Home Office, and (d) applies before the Student visa expires. The route does NOT work for: previous Graduate visa holders (single-grant only), graduates of UK courses taught remotely from overseas, students who failed and re-sat without completing, or anyone whose Student visa expired before applying. PhD researchers get 3 years, which is the difference between landing a Skilled Worker job and not — postdocs particularly benefit from the longer runway.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'Time on Graduate counts toward 10-year long-residence ILR but NOT toward 5-year Skilled Worker ILR — you reset the clock when you switch. Most Graduate visa holders end up converting to Skilled Worker within 6-12 months because the route does not lead anywhere on its own. The strategic use is: take the Graduate visa, find a sponsored job at the new-entrant rate (£33,400 floor, 70% going rate), use the 18-month runway to negotiate sponsorship with employers who otherwise wouldn\'t sponsor. The visa allows any work (full self-employment is permitted), but you cannot extend or re-apply, so treat the runway as a sprint, not a sabbatical.',
      },
    ],
  },

  'innovator-founder': {
    slug: 'innovator-founder',
    takeaway:
      'Innovator Founder is the UK\'s replacement for the old Tier 1 Entrepreneur route, but the endorsing-body gate makes it functionally accessible to a much narrower group than its predecessor.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The endorsing-body assessment is the entire game. Each approved endorser (limited list updated annually on gov.uk) charges £1,000-£5,000 for the pitch, applies its own evaluation rubric, and rejects the majority of applications it sees. The three test pillars — innovation (a clear gap in market with novel technology or service), viability (financials that stand up to scrutiny over 3-5 years), scalability (a credible plan beyond founder solo work) — are all subjective. A founder rejected by one endorsing body can apply to another, but the rejection often leaves a paper trail. The 12- and 24-month review meetings with the endorser are not formalities — the endorsement can be withdrawn if the business has not progressed substantively, which collapses the visa.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'The route works for: technically-credentialed founders with patentable technology, an MVP and at least one paying customer, ideally one prior exit or significant investment round. Solo founders without a co-founder or technical depth are filtered out hard. The route does NOT work for: lifestyle businesses (cafes, shops, services), franchises, consultancies billing personal time, businesses whose viability depends entirely on the founder\'s ongoing work. The required savings (£1,270, held 28 days) are minimal — the route is gated on the business plan, not on capital, which differentiates it from the old Tier 1 Investor route.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'Innovator Founder is one of the few UK routes with 3-year fast-track ILR — substantively faster than the Skilled Worker 5-year. But ILR is contingent on the business meeting specific milestones (revenue, jobs, IP, investment raised, scale) at the 3-year review, and a business that has stagnated will not progress to ILR even if the visa hasn\'t expired. Secondary employment is allowed alongside the business, but only in skilled roles — you cannot subsidise a struggling startup by driving Uber on the side. The route attracts heavy use of immigration solicitors because endorsement pitches need to be calibrated to the specific endorser; a generic pitch fails routinely.',
      },
    ],
  },

  'ilr': {
    slug: 'ilr',
    takeaway:
      'Indefinite Leave to Remain is the destination most UK visa-holders are aiming for, but the absence-tracking and tax-record consistency requirements catch out more applicants than the headline 5-year residence rule ever does.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The 180-day rolling-12-month absence rule is the single biggest stumbling block. It is not 180 days per calendar year, it is 180 days in any rolling 12-month window across the entire 5-year qualifying period. A single multi-month overseas project that pushes you over 180 in any rolling window breaks the clock and resets it. Applicants need a day-by-day absence ledger built from passport stamps; even one missed weekend trip can tip it over. The second hardest test is HMRC tax reconciliation — the salary you declared on every past visa application must match your P60 / SA302 history; mismatches trigger paragraph 322(5) deception refusals which can also cancel current leave.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'In practice ILR works cleanly for Skilled Worker holders who: stayed with one or compatible sponsors throughout the 5 years, tracked every absence rigorously, kept tax filings consistent with declared salary, never had unspent convictions or NHS debt over £500, and passed the Life in the UK test plus B1 English (often already met from earlier visa stages). The route also works for Family route holders after 5 years on the 5-year partner track, Global Talent holders after 3-5 years (3 for exceptional talent), Innovator Founder after 3 years with business milestones met, BN(O) holders after 5 years, Ancestry holders after 5 years. The 10-year long-residence route exists as a fallback for those who don\'t fit a single visa category for 5 years but maintained continuous lawful residence.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'ILR is not permanent permanent — it lapses after 2 years of continuous absence from the UK (5 years for EUSS settled status), and recovering it requires a Returning Resident visa application which is discretionary. Apply for citizenship 12 months after ILR (or immediately if married to a British citizen with ILR for 3+ years) to lock in permanent rights via citizenship. The Super Priority service (£1,000 surcharge, 5 working day decision) is worth using if you are at risk of letting current leave expire while waiting — standard processing has crept to 8-16 weeks in 2025/26 despite the published 6-month target.',
      },
    ],
  },

  'citizenship': {
    slug: 'citizenship',
    takeaway:
      'British citizenship is the only permanent right of UK abode — and the route is mostly admin, mostly cheap by visa standards (£1,839), and mostly successful for applicants who meet the formal tests.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'Two filters cause most refusals. The first is good character — unspent convictions, recent cautions, NHS debt over £500, or repeated immigration breaches in the last 10 years all defeat the application, and the Home Office has discretion to refuse on conduct grounds even where no formal rule is broken. The second is absences — the 5-year residence (3-year for spouse) must show fewer than 450 days outside the UK (270 for spouse) and fewer than 90 days in the final 12 months. Unlike ILR these are absolute, not discretionary; one day over and the application gets refused, fees forfeited.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'The route works cleanly for: ILR holders 12 months past grant who have lived in the UK consistently, married applicants with 3 years on ILR matched to 3 years\' UK residence with a British spouse (no 12-month wait), and dependants of British or settled parents born outside the UK (Form MN1, £1,000). Children born in the UK to a parent with ILR or British citizenship are British automatically — they don\'t need MN1 registration, just a passport application. The route does NOT work for: applicants who have not yet held ILR for 12 months (standard route), spouses of British citizens who did not maintain UK residence for the full 3 years, or applicants with recent unspent convictions or known dual-citizenship conflicts with their birth country.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'Dual citizenship is allowed by the UK, but many origin countries (India, China, Singapore, Japan, Netherlands) require you to renounce your original citizenship on naturalisation — costing some applicants the option to return home without a visa, and creating ongoing administrative pain (overseas property, inheritance, tax residency). The citizenship ceremony fee (£130) is included in the £1,839 — there is no separate ceremony fee to budget for. Children of British-by-descent parents born outside the UK can be registered under MN1 once the parent meets the 3-year UK residence requirement — a useful route for British expat families returning to the UK. The British passport (£94.50) is a separate application after the citizenship certificate is issued, not bundled.',
      },
    ],
  },

  'euss': {
    slug: 'euss',
    takeaway:
      'The EU Settlement Scheme is the most generous UK immigration route in living memory — free, fast, durable — but the 30 June 2021 deadline now requires "reasonable grounds" for late applications, and the bar is rising.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'Late applications now need documented reasonable grounds for missing the original deadline — illness, abusive relationship, dependency on another person, lack of awareness of the scheme, etc. The Home Office grants around 80% of late applications when grounds are evidenced (medical letters, social-work statements, etc.) but the threshold has tightened in 2025 and "I forgot" is no longer enough. Pre-2021 residence evidence is the second filter: the automated HMRC and DWP check covers most workers, but gaps require alternative evidence (utility bills, tenancy agreements, P60s) and applicants who lived informally pre-2021 can struggle to evidence presence.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'Applicants who can show: EU/EEA/Swiss citizenship or family-member status, residence in the UK before 23:00 on 31 December 2020 with continuing residence, and (for settled status) 5 years\' UK residence with reasonable absence patterns. Joining-family-member applications still work via the EUSS Family Permit for relatives applying from overseas. The route does NOT work for: post-2020 arrivals who never had EU pre-settled status, durable partners who cannot evidence 2+ years cohabitation pre-2021, or applicants with serious criminal records (suitability grounds).',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'Settled status under EUSS is ILR-equivalent for almost all purposes — no IHS, NHS access, eligible to apply for citizenship after 12 months. Pre-settled status was changed in 2023 to lapse only after 5 continuous years\' absence (not 2 years) and is now automatically extended by 5 years before expiry. Pre-settled holders are being automatically converted to settled status as they meet the 5-year mark — but the automation isn\'t universal, and some applicants need to apply manually. Children born in the UK to a settled parent are British automatically; to a pre-settled parent they are NOT automatically British, which catches out many families.',
      },
    ],
  },

  'bno': {
    slug: 'bno',
    takeaway:
      'The BN(O) route is the most welcoming UK visa designed for a specific group in recent decades — five years to ILR, low fees, dependants on the same application — and acceptance rates exceed 95% when documents are in order.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'BN(O) status matching is the gate — applicants without a BN(O) passport (even expired) need to evidence historic BN(O) registration through Hong Kong government records, which can take weeks to obtain. The Home Office cannot reissue BN(O) status. The TB test is required for Hong Kong applicants and runs at IOM-approved clinics in Hong Kong; the certificate is valid 6 months. Maintenance funds of 6 months of bank statements showing the ability to support self and family without recourse to public funds, or evidence of a UK sponsor, must be unambiguous — the route is generous on volume but precise on documentation.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'BN(O) status holders (born in Hong Kong before 1 July 1997 and registered as BN(O) before that date) plus their immediate family — spouse, dependent children under 18, dependent children 18+ who live as household members, dependent parents and grandparents who live as household members. The route works for most BN(O) families in Hong Kong without complications, hence the 95%+ acceptance rate. It does NOT work for: ethnic Hong Kong residents born after 1 July 1997 (no BN(O) status), HKSAR-only passport holders who never registered as BN(O), or family members who don\'t meet the household-member test for dependent adults.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'The 5-year route is cheaper per year (£285 / 5 yr = £57/yr) than the 2.5-year route (£206 / 2.5 yr = £82/yr), but the 5-year fee is paid upfront — significant capital outlay for a family of four. The route has a 5-year IHS-paid period which the £5,175 adult IHS adds to the real cost. Children born in the UK to BN(O) holders are not automatically British until the parent reaches settled status (ILR) — register the parent first, then apply for the child\'s British citizenship. The 2025 Immigration White Paper proposed extending UK BN(O) eligibility consultation but no rules changed; current applicants remain on the 5-year-to-ILR clock.',
      },
    ],
  },

  'long-residence': {
    slug: 'long-residence',
    takeaway:
      'The 10-year long-residence route is the safety net for those who never fit cleanly into one visa category for 5 years — but the continuous-residence test makes it harder than the headline 10-year figure suggests.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'Continuous residence has very strict definitions: no single absence over 184 days, no cumulative absences over 548 days in the 10-year window, and no periods without valid leave (overstaying for more than 14 days post-2012 breaks the clock entirely). Periods on Visitor, Graduate, Short-term Student, Seasonal Worker and similar short-term visas do NOT count toward the 10 years — and many applicants discover too late that their actual qualifying residence is less than they assumed. The route also requires Life in the UK Test, B1 English, and the £3,226 ILR fee. Refusal rate is materially higher than 5-year ILR routes because more applicants build a case on incorrect assumptions about qualifying time.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'Applicants who: built up 10 years on a sequence of long-term visas (Student → Graduate → Skilled Worker → Family → etc.) without breaks longer than 14 days, kept tax records consistent throughout, and tracked absences day-by-day. The route works well for international students who came on Tier 4 in 2014-2016 and never qualified for a single-visa-route ILR because they bounced between Skilled Worker employers, Family routes, and gaps. It does NOT work for: applicants whose first visa was a Visitor / ETA / Tier 5 youth-mobility, applicants who overstayed for more than 14 days, or applicants who can build a 5-year route under another visa category (use that instead — it\'s 5 years, not 10).',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'Most successful 10-year ILR applicants used a specialist immigration solicitor — the case file is more complex than a single-route 5-year ILR (often 10 different leave periods, multiple absence patterns, multiple tax-year reconciliations), and self-applications fail more often than they succeed. The route is more vulnerable to immigration-rule changes than 5-year routes; the 2025 White Paper consulted on tightening continuous residence, and applicants close to year 10 are most at risk if rules tighten. Time spent on Section 3C leave (waiting for a visa application decision after expiry of current visa) counts toward the 10 years, but only if the underlying application was eventually granted.',
      },
    ],
  },

  'ancestry': {
    slug: 'ancestry',
    takeaway:
      'UK Ancestry is the unsung route — five years to ILR, no salary floor, no sponsor needed — but the strict Commonwealth-citizen-plus-UK-grandparent rule keeps it under-the-radar.',
    sections: [
      {
        id: 'hard',
        title: 'What makes this route hard',
        body:
          'The grandparent chain is the gate. Applicants need to evidence an unbroken chain of birth and marriage certificates linking themselves to a grandparent born in the UK (England, Scotland, Wales, Northern Ireland, Channel Islands, Isle of Man). Adoption, illegitimate birth lines and divorce-remarriage chains each add layers. Each certificate must be a full certified copy from the issuing authority (GRO for England and Wales, Scotland\'s People for Scotland, GRONI for Northern Ireland) — not a photocopy. Tracing the chain takes 6-12 weeks if records are intact and several months if family papers are missing. The Commonwealth citizenship requirement is the second gate — citizenship at the date of application, and changing citizenship between gathering papers and applying defeats the visa.',
      },
      {
        id: 'qualifies',
        title: 'Who actually qualifies in practice',
        body:
          'Commonwealth citizens (mostly Australian, New Zealand, South African, Canadian, Caribbean) aged 17+ who can prove descent from a UK-born grandparent. The most reliable applicants are those whose grandparents emigrated post-WWII to the Commonwealth nations and whose family kept birth certificates. The route does NOT work for: applicants who hold British passports already (they don\'t need it), non-Commonwealth citizens regardless of UK ancestry, or anyone whose closest UK-born ancestor is a great-grandparent or earlier. The grandparent chain through a step-parent doesn\'t qualify.',
      },
      {
        id: 'unsaid',
        title: 'What gov.uk doesn\'t spell out',
        body:
          'Ancestry visa holders have full UK work flexibility — no sponsor, no salary floor, no job restrictions — making this one of the most permissive routes in the system. The 5-year route to ILR is faster than Skilled Worker for some applicants because there is no Going Rate trap. The route is particularly common among South Africans and Australians moving to the UK in their late 20s / early 30s. It is rarely used by Indian or Pakistani applicants despite some grandparent links because Commonwealth citizenship requirements vary. Time on Ancestry counts toward 10-year long-residence ILR but the 5-year Ancestry route is almost always faster.',
      },
    ],
  },
};

export function getCommentaryFor(slug: string): VisaCommentary | undefined {
  return VISA_COMMENTARY[slug];
}
