/**
 * Hub Tool Index — curated, revenue-focused listing for every category hub.
 *
 * Source of truth for the "All tools in this hub" section rendered by
 * <HubToolIndex/>.
 *
 * Curation rules (max 5 per hub):
 *   - Same-mental-model calculators are CLUBBED into one multi-mode page
 *     (modes listed in the hint). One excellent page beats several thin
 *     ones on a no-authority domain — better ranking, fewer to maintain.
 *   - Picks are ordered by UK search volume × AdSense CPC × lead-gen value.
 *   - Live tools are kept featured for instant indexed traffic. A clubbed
 *     entry links to its strongest existing page until the combined page
 *     ships.
 *
 * `status`: 'live' links out · 'soon' renders disabled with a "Soon" pill.
 * `xref` (optional): tool's primary home is another hub; still links, tagged.
 */

import type { CategoryId } from './tools';

export interface HubItem {
  label: string;
  href: string;
  hint: string;
  status: 'live' | 'soon';
  xref?: string; // e.g. 'Tax' — primary home of a cross-referenced tool
}

export interface HubGroup {
  title: string;
  description: string;
  items: HubItem[];
}

export const HUB_TOOLS: Record<CategoryId, HubGroup[]> = {
  // ── PROPERTY (5) — head-term volume + highest-CPC lead-gen ─────────
  property: [
    {
      title: 'Mortgages',
      description: 'Borrowing, repayments and switching deals.',
      items: [
        { label: 'Mortgage Calculator', href: '/mortgage-calculator', hint: 'Repayment · amortisation · interest', status: 'live' },
        { label: 'Mortgage Affordability', href: '/mortgage-affordability', hint: 'How much can I borrow? + stress test', status: 'live' },
        { label: 'Overpayment Calculator', href: '/overpayment-mortgage', hint: 'Interest & years saved', status: 'live' },
        { label: 'Remortgage Calculator', href: '/remortgage-calculator', hint: 'Saving vs fees · break-even', status: 'live' },
        { label: 'LTV Calculator', href: '/ltv-calculator', hint: 'Loan-to-value & rate band', status: 'live' },
      ],
    },
    {
      title: 'Buying',
      description: 'The full cost of buying — and whether to buy at all.',
      items: [
        { label: 'Stamp Duty (SDLT)', href: '/stamp-duty-calculator', hint: '2025/26 rates · FTB · surcharges', status: 'live' },
        { label: 'House Buying Costs', href: '/house-buying-costs', hint: 'Total cash needed to buy', status: 'live' },
        { label: 'Deposit Calculator', href: '/deposit-calculator', hint: 'How much & how long to save', status: 'live' },
        { label: 'Buy vs Rent', href: '/buy-vs-rent', hint: 'Net worth over time + break-even', status: 'live' },
      ],
    },
    {
      title: 'Owning & Investing',
      description: 'Equity, growth, yield and buy-to-let tax.',
      items: [
        { label: 'Home Equity', href: '/equity-calculator', hint: 'What you own + release', status: 'live' },
        { label: 'Property Value Growth', href: '/property-value-growth', hint: 'Project value over time', status: 'live' },
        { label: 'Rental Yield', href: '/rental-yield-calculator', hint: 'Gross/net yield · ICR · ROI', status: 'live' },
        { label: 'Buy-to-Let', href: '/buy-to-let-calculator', hint: 'Section 24 · SPV · ICR', status: 'live' },
      ],
    },
  ],

  // ── INSURANCE — flagship calculators, all live ────────────────────
  insurance: [
    {
      title: 'Protection',
      description: 'Cover for your family and income.',
      items: [
        { label: 'Life Insurance', href: '/life-insurance-calculator', hint: 'How much cover you need (DIME)', status: 'live' },
        { label: 'Critical Illness', href: '/critical-illness-calculator', hint: 'Lump sum if seriously ill', status: 'live' },
        { label: 'Income Protection', href: '/income-protection-calculator', hint: 'Replace income if you can’t work', status: 'live' },
      ],
    },
    {
      title: 'Assets & Travel',
      description: 'Cover for your car, home and trips.',
      items: [
        { label: 'Car Insurance', href: '/car-insurance-calculator', hint: 'Premium estimate + group 1–50', status: 'live' },
        { label: 'Home Insurance', href: '/home-insurance-calculator', hint: 'Rebuild cost + contents', status: 'live' },
        { label: 'Travel Insurance', href: '/travel-insurance-calculator', hint: 'Cost + cover limits', status: 'live' },
      ],
    },
  ],

  // ── LOANS, DEBT & CREDIT — high-CPC credit vertical ───────────────
  loans: [
    {
      title: 'Borrowing',
      description: 'Loans, car finance and the true cost.',
      items: [
        { label: 'Personal Loan', href: '/personal-loan-calculator', hint: 'Repayment · interest · APR', status: 'live' },
        { label: 'Car Finance', href: '/car-finance-calculator', hint: 'PCP vs HP vs loan', status: 'live' },
        { label: 'Loan APR', href: '/loan-apr-calculator', hint: 'True cost of borrowing', status: 'live' },
        { label: 'Loan Comparison', href: '/loan-comparison-calculator', hint: '2–3 loans side by side', status: 'soon' },
      ],
    },
    {
      title: 'Debt & Credit',
      description: 'Clear cards and consolidate faster.',
      items: [
        { label: 'Credit Card Payoff', href: '/credit-card-payoff-calculator', hint: 'Months + interest to clear', status: 'live' },
        { label: 'Debt Consolidation', href: '/debt-consolidation-calculator', hint: 'One payment vs many', status: 'live' },
        { label: 'Debt Payoff Planner', href: '/debt-payoff-planner', hint: 'Snowball vs avalanche', status: 'live' },
        { label: 'Balance Transfer', href: '/balance-transfer-calculator', hint: '0% deal vs fee · break-even', status: 'soon' },
      ],
    },
    {
      title: 'Plan',
      description: 'Affordability and early repayment.',
      items: [
        { label: 'Loan Affordability (DTI)', href: '/loan-affordability-calculator', hint: 'How much can you borrow?', status: 'soon' },
        { label: 'Early Repayment', href: '/loan-early-repayment-calculator', hint: 'Interest saved + settlement', status: 'soon' },
      ],
    },
  ],

  // ── IMMIGRATION (5) — high-intent + lead-gen, mostly live ─────────
  immigration: [
    {
      title: 'Plan & Qualify',
      description: 'Find the right route and check eligibility.',
      items: [
        { label: 'All Visa Routes', href: '/visa-types', hint: '14 routes · 2026 fees', status: 'live' },
        { label: 'Eligibility Quiz', href: '/eligibility', hint: 'Which routes fit you', status: 'live' },
        { label: 'Skilled Worker Suite', href: '/skilled-worker-points-check', hint: 'Points · salary · sponsor search', status: 'live' },
      ],
    },
    {
      title: 'Cost & Outcome',
      description: 'Total the fees and decode decisions.',
      items: [
        { label: 'Visa Cost Calculator', href: '/tools/cost-calculator', hint: 'Fees · IHS · dependants', status: 'live' },
        { label: 'Refusal Analyzer', href: '/tools/refusal-analyzer', hint: 'Decode a refusal letter', status: 'live' },
      ],
    },
  ],

  // ── PENSIONS, INVESTING & SAVINGS — high-CPC retirement keywords ──
  savings: [
    {
      title: 'Pensions',
      description: 'Project, draw down and forecast retirement income.',
      items: [
        { label: 'Pension Calculator', href: '/pension-calculator', hint: 'Pot at retirement + income', status: 'live' },
        { label: 'Pension Drawdown', href: '/pension-drawdown-calculator', hint: 'How long will it last?', status: 'live' },
        { label: 'State Pension', href: '/state-pension', hint: 'Forecast from NI years', status: 'live' },
        { label: 'Annuity Calculator', href: '/annuity-calculator', hint: 'Pot → guaranteed income', status: 'soon' },
        { label: 'SIPP Calculator', href: '/sipp-calculator', hint: 'Contributions + tax relief', status: 'soon' },
      ],
    },
    {
      title: 'ISAs & Savings',
      description: 'Tax-free saving and growth.',
      items: [
        { label: 'Compound Interest', href: '/compound-interest-calculator', hint: 'Savings growth over time', status: 'live' },
        { label: 'ISA Calculator', href: '/isa-calculator', hint: 'Tax-free growth · £20k', status: 'live' },
        { label: 'Lifetime ISA', href: '/lifetime-isa-calculator', hint: '25% government bonus', status: 'live' },
        { label: 'Savings Goal', href: '/savings-goal-calculator', hint: 'How much / how long', status: 'soon' },
      ],
    },
    {
      title: 'Tax',
      description: 'Make contributions go further.',
      items: [
        { label: 'Pension Tax Relief', href: '/pension-tax-relief-calculator', hint: 'Higher-rate relief', status: 'soon' },
      ],
    },
  ],

  // ── TAX & INCOME — highest-volume on the site ─────────────────────
  tax: [
    {
      title: 'Employed Income',
      description: 'Net pay, NI, payslip checks and one-offs.',
      items: [
        { label: 'Take-home Pay', href: '/take-home-pay', hint: 'Salary after tax, NI & SL', status: 'live' },
        { label: 'National Insurance', href: '/national-insurance-calculator', hint: 'Class 1 / 4 breakdown', status: 'live' },
        { label: 'Salary Sacrifice', href: '/salary-sacrifice-calculator', hint: 'Pension tax & NI saving', status: 'live' },
        { label: 'Bonus Tax', href: '/bonus-tax', hint: 'Tax on a bonus', status: 'live' },
        { label: 'Payslip Auditor', href: '/payslip-auditor', hint: 'Check tax & tax code', status: 'live' },
      ],
    },
    {
      title: 'Self-Employed & Business',
      description: 'Sole traders, contractors and directors.',
      items: [
        { label: 'Self-Employed Tax', href: '/self-employed-tax', hint: 'Self Assessment + Class 4', status: 'live' },
        { label: 'Contractor & IR35', href: '/contractor-ir35', hint: 'Ltd vs PAYE vs umbrella', status: 'live' },
        { label: 'Dividend Tax', href: '/director-dividend', hint: 'Salary + dividends', status: 'live' },
        { label: 'Side-Hustle Tax', href: '/side-hustle-tax-calculator', hint: 'Trading allowance · 2nd job', status: 'soon' },
      ],
    },
    {
      title: 'Reliefs & Capital',
      description: 'Allowances, student loan and gains.',
      items: [
        { label: 'Marriage Allowance', href: '/marriage-allowance-calculator', hint: 'Transfer £1,260 · save £252', status: 'live' },
        { label: 'Child Benefit Charge', href: '/child-benefit-trap', hint: 'HICBC £60k–£80k', status: 'live' },
        { label: 'Student Loan', href: '/student-loan-repayment', hint: '9% repayment by plan', status: 'live' },
        { label: 'Capital Gains Tax', href: '/cgt-calculator', hint: '£3,000 AEA · 18%/24%', status: 'live' },
        { label: 'Inheritance Tax', href: '/inheritance-tax', hint: 'NRB £325k + RNRB £175k', status: 'live', xref: 'Estate' },
      ],
    },
  ],

  // ── BUSINESS (5) — Ltd company + cross-link to Tax ────────────────
  business: [
    {
      title: 'Company Taxes',
      description: 'VAT, corporation tax and rates.',
      items: [
        { label: 'VAT Calculator', href: '/vat-calculator', hint: 'Add/remove 20% VAT', status: 'live' },
        { label: 'Corporation Tax', href: '/corporation-tax-calculator', hint: '19% / 25% + marginal', status: 'live' },
        { label: 'Business Rates', href: '/business-rates-calculator', hint: 'RV × multiplier + SBRR', status: 'live' },
      ],
    },
    {
      title: 'Structure & Pay',
      description: 'Trading structure and director pay.',
      items: [
        { label: 'Sole Trader vs Limited', href: '/sole-trader-vs-limited', hint: 'Take-home comparison', status: 'live' },
        { label: 'Salary vs Dividend', href: '/salary-vs-dividend-calculator', hint: 'Optimal director split', status: 'live' },
        { label: 'PAYE Employer Cost', href: '/paye-employer-cost', hint: 'True cost of a hire', status: 'live' },
      ],
    },
    {
      title: 'Also in Tax',
      description: 'Contractor tools live in the Tax hub.',
      items: [
        { label: 'IR35 & Director', href: '/contractor-ir35', hint: 'IR35 · director dividend', status: 'live', xref: 'Tax' },
      ],
    },
  ],

  // ── ESTATE (5) — IHT cluster, high-CPC legal keywords ─────────────
  estate: [
    {
      title: 'Inheritance & Probate',
      description: 'IHT, probate and estate planning.',
      items: [
        { label: 'Inheritance Tax', href: '/inheritance-tax', hint: 'NRB/RNRB · gift 7-year taper', status: 'live' },
        { label: 'Gift & 7-Year Rule', href: '/gift-iht-calculator', hint: 'Taper relief on gifts', status: 'live' },
        { label: 'Estate Value', href: '/estate-value-calculator', hint: 'Net estate for IHT', status: 'live' },
        { label: 'Probate Fee', href: '/probate-fee-calculator', hint: 'Court + solicitor fees', status: 'live' },
        { label: 'Will Writing Cost', href: '/will-writing-cost', hint: 'DIY vs solicitor', status: 'live' },
        { label: 'Power of Attorney Cost', href: '/power-of-attorney-cost', hint: 'LPA fees + process', status: 'live' },
      ],
    },
  ],

  // ── FAMILY LAW (4) — high-CPC divorce keywords ────────────────────
  'family-law': [
    {
      title: 'Divorce & Maintenance',
      description: 'Costs, settlements and maintenance.',
      items: [
        { label: 'Divorce Cost', href: '/divorce-cost-calculator', hint: 'Court + legal fees', status: 'soon' },
        { label: 'Financial Settlement', href: '/financial-settlement-calculator', hint: 'Asset split estimate', status: 'soon' },
        { label: 'Child Maintenance', href: '/child-maintenance-calculator', hint: 'Statutory CMS rates', status: 'soon' },
        { label: 'Spousal Maintenance', href: '/spousal-maintenance-calculator', hint: 'Ongoing support estimate', status: 'soon' },
      ],
    },
  ],

  // ── ENERGY (4) — green-tech, rising search volume ─────────────────
  energy: [
    {
      title: 'Energy & Bills',
      description: 'Price cap, solar, heat pumps and EV charging.',
      items: [
        { label: 'Energy Bill', href: '/energy-bill', hint: 'Ofgem cap quarterly', status: 'live' },
        { label: 'Solar Panel ROI', href: '/solar-panel-roi', hint: 'Payback + export tariff', status: 'soon' },
        { label: 'Heat Pump', href: '/heat-pump-calculator', hint: 'Air/ground source cost', status: 'soon' },
        { label: 'EV Charging Cost', href: '/ev-charging-cost', hint: 'Home vs public per mile', status: 'soon' },
      ],
    },
  ],

  // ── EMPLOYMENT (5, mostly live) — high-volume statutory pay ───────
  employment: [
    {
      title: 'Pay & Wages',
      description: 'Compare salaries, wages and overtime.',
      items: [
        { label: 'Salary Compare', href: '/salary-compare', hint: 'City ↔ city equivalent', status: 'live' },
        { label: 'Holiday & Overtime Pay', href: '/holiday-pay', hint: '5.6 weeks · time-and-a-half', status: 'live' },
        { label: 'Minimum Wage', href: '/minimum-wage-checker', hint: 'NLW £12.21 · 2025', status: 'live' },
      ],
    },
    {
      title: 'Leave & Exit',
      description: 'Statutory pay, sick pay and leaving a job.',
      items: [
        { label: 'Statutory Pay', href: '/maternity-pay', hint: 'Maternity · paternity · sick', status: 'live' },
        { label: 'Redundancy & Settlement', href: '/redundancy-pay', hint: '£30k tax-free · agreement', status: 'live' },
      ],
    },
  ],

  // ── VEHICLES (5) — checks + running costs ─────────────────────────
  vehicles: [
    {
      title: 'Compliance & Checks',
      description: 'Clean-air zones, MOT and local lookups.',
      items: [
        { label: 'ULEZ / CAZ', href: '/ulez-check', hint: 'Is your car compliant?', status: 'live' },
        { label: 'MOT & Tax Check', href: '/mot-check', hint: 'Validate any UK reg', status: 'live' },
        { label: 'Postcode Lookup', href: '/postcode', hint: 'Council, MP, NHS, police', status: 'live' },
      ],
    },
    {
      title: 'Costs',
      description: 'Road tax, fuel and finance.',
      items: [
        { label: 'Vehicle Tax (VED)', href: '/vehicle-tax-calculator', hint: 'CO2 first-year + standard', status: 'live' },
        { label: 'Car Running Costs', href: '/car-running-costs', hint: 'Total cost of ownership', status: 'live' },
        { label: 'Fuel Cost', href: '/fuel-cost-calculator', hint: 'Cost per journey & year', status: 'live' },
        { label: 'Car Finance', href: '/car-finance-calculator', hint: 'PCP vs HP vs loan', status: 'soon', xref: 'Loans' },
      ],
    },
  ],

  // ── BENEFITS (5) — childcare + income support ─────────────────────
  benefits: [
    {
      title: 'Family & Support',
      description: 'Childcare and income-related support.',
      items: [
        { label: 'Childcare Costs', href: '/childcare-calculator', hint: '15/30 free hrs · TFC', status: 'live' },
        { label: 'Universal Credit', href: '/universal-credit-calculator', hint: 'Allowance + elements', status: 'soon' },
        { label: 'Council Tax Support', href: '/council-tax-support-checker', hint: 'Reduction eligibility', status: 'soon' },
        { label: 'PIP Checker', href: '/pip-benefit-checker', hint: 'Daily living + mobility', status: 'soon' },
        { label: "Carer's Allowance", href: '/carers-allowance-calculator', hint: '£81.90/wk eligibility', status: 'soon' },
      ],
    },
  ],
};
