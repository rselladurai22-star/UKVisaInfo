/**
 * UKDesk Tool Registry
 *
 * Single source of truth for every tool/calculator:
 *   - 46  live tools  (status: 'live' | 'new')
 *   - 50  tier-3 tools launching next (status: 'soon')
 *   - 100 tier-4 planned tools       (status: 'planned')
 *
 * Imported by Home.tsx (client component).
 */

import {
  Wallet, HomeIcon, MapPin, Plane, Calculator, Building2,
  Briefcase, GraduationCap, TrendingUp, TrendingDown,
  Percent, FileText, Car, Zap, Scale,
  Baby, HeartPulse, PiggyBank, Banknote, LandmarkIcon, Users, ReceiptText,
  Heart, Shield, Coins, Star, Clock,
  RefreshCw, ShieldCheck, Gift, Target, CheckCircle2,
  BookOpen, Flag, Wrench, Share2, Moon, Truck, Key, Calendar,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

export type IconComponent = typeof Wallet;
export type CategoryId =
  | 'tax' | 'employment' | 'property' | 'savings'
  | 'business' | 'immigration' | 'benefits' | 'vehicles';

export interface Category {
  id: CategoryId;
  label: string;
  icon: IconComponent;
  color: string;
  description: string;
}

export interface AppTile {
  href: string;
  label: string;
  hint: string;
  icon: IconComponent;
  accent: string;
  category: CategoryId;
  status: 'live' | 'new';
  trending?: boolean;
  featured?: boolean;
  kbd?: string;
  live: true;
}

export interface SoonTool {
  label: string;
  hint: string;
  icon: IconComponent;
  accent: string;
  category: CategoryId;
  href: string;
}

export interface PlannedTool {
  label: string;
  hint: string;
  category: CategoryId;
}

/* ─────────────────────────────────────────────
   BRAND TOKENS (shared)
───────────────────────────────────────────── */
const NAVY    = '#0A2540';
const TEAL    = '#00C4B4';
const GOLD    = '#C9A14A';
const ROSE    = '#E11D48';
const VIOLET  = '#7C3AED';
const BLUE    = '#2563EB';
const EMERALD = '#10B981';
const AMBER   = '#F59E0B';
const PINK    = '#EC4899';
const SKY     = '#0EA5E9';

/* ─────────────────────────────────────────────
   CATEGORIES
───────────────────────────────────────────── */
export const CATEGORIES: Category[] = [
  { id: 'tax',         label: 'Tax & Income',       icon: Wallet,    color: TEAL,   description: 'Income tax, NI, dividends, CGT and more' },
  { id: 'employment',  label: 'Employment',          icon: Briefcase, color: BLUE,   description: 'Pay, leave, redundancy, workplace rights' },
  { id: 'property',    label: 'Property',            icon: HomeIcon,  color: GOLD,   description: 'Mortgages, SDLT, rental income and costs' },
  { id: 'savings',     label: 'Savings & Pensions',  icon: PiggyBank, color: EMERALD,description: 'ISA, pensions, investments and savings goals' },
  { id: 'business',    label: 'Business',            icon: Building2, color: NAVY,   description: 'Self-employed, contractors and Ltd companies' },
  { id: 'immigration', label: 'Immigration',         icon: Plane,     color: VIOLET, description: 'Visa routes, fees, points and settlement' },
  { id: 'benefits',    label: 'Benefits',            icon: Users,     color: AMBER,  description: 'Universal credit, childcare, family support' },
  { id: 'vehicles',    label: 'Vehicles',            icon: Car,       color: ROSE,   description: 'ULEZ, MOT, company car, fuel costs' },
];

/* ─────────────────────────────────────────────
   LIVE TOOLS (46)
   status: 'live'  = original Tier-1 tools
   status: 'new'   = Tier-2 recently added
───────────────────────────────────────────── */
export const APP_TILES: AppTile[] = [
  // ── TAX & INCOME (10 live) ──────────────────────────────────────
  { href: '/take-home-pay',                label: 'Take-home Pay',        hint: 'PAYE + NI + student loan',              icon: Wallet,       accent: TEAL,   category: 'tax',        status: 'live', trending: true, featured: true, live: true, kbd: 'P' },
  { href: '/vat-calculator',               label: 'VAT Calculator',       hint: 'Add or remove 20% / 5% / 0%',           icon: Percent,      accent: SKY,    category: 'tax',        status: 'live', live: true, kbd: 'A' },
  { href: '/tax-code',                     label: 'Tax Code Decoder',     hint: 'Decode 1257L, K475, BR …',              icon: FileText,     accent: NAVY,   category: 'tax',        status: 'live', live: true, kbd: 'T' },
  { href: '/dividend-tax',                 label: 'Dividend Tax',         hint: '£500 allowance · 8.75–39.35%',          icon: PiggyBank,    accent: EMERALD,category: 'tax',        status: 'live', live: true },
  { href: '/inheritance-tax',              label: 'Inheritance Tax',      hint: 'NRB £325k + RNRB £175k',                icon: LandmarkIcon, accent: GOLD,   category: 'tax',        status: 'live', live: true },
  { href: '/national-insurance',           label: 'National Insurance',   hint: 'Employee · employer · self-employed',   icon: Users,        accent: TEAL,   category: 'tax',        status: 'live', trending: true, live: true },
  { href: '/cgt-calculator',               label: 'Capital Gains Tax',    hint: '£3,000 AEA · 18% / 24%',                icon: TrendingUp,   accent: BLUE,   category: 'tax',        status: 'live', live: true },
  { href: '/marriage-allowance-calculator',label: 'Marriage Allowance',   hint: '£1,260 PA transfer · £252 saving',      icon: Heart,        accent: ROSE,   category: 'tax',        status: 'new',  live: true },
  { href: '/company-car-tax',              label: 'Company Car Tax',      hint: 'BiK · CO₂% · EV / PHEV / diesel',       icon: Car,          accent: NAVY,   category: 'tax',        status: 'new',  live: true },
  { href: '/self-assessment-calculator',   label: 'Self Assessment',      hint: 'Multi-income SA estimate + POAC',        icon: FileText,     accent: AMBER,  category: 'tax',        status: 'new',  live: true },

  // ── EMPLOYMENT (11 live) ────────────────────────────────────────
  { href: '/holiday-pay',                  label: 'Holiday Pay',          hint: 'Statutory 5.6 weeks · 12.07%',          icon: Briefcase,    accent: BLUE,   category: 'employment', status: 'live', live: true },
  { href: '/salary-compare',               label: 'Salary Compare',       hint: 'City ↔ city equivalent gross',          icon: Scale,        accent: EMERALD,category: 'employment', status: 'live', trending: true, live: true, kbd: 'Q' },
  { href: '/redundancy-pay',               label: 'Redundancy Pay',       hint: '£719 weekly cap · £30k tax-free',       icon: Banknote,     accent: ROSE,   category: 'employment', status: 'live', live: true },
  { href: '/maternity-pay',                label: 'Maternity Pay',        hint: 'SMP 39 weeks · SPP',                    icon: Baby,         accent: PINK,   category: 'employment', status: 'live', live: true },
  { href: '/sick-pay',                     label: 'Sick Pay (SSP)',       hint: '£118.75/wk · 28-week max',              icon: HeartPulse,   accent: SKY,    category: 'employment', status: 'live', live: true },
  { href: '/student-loan-repayment',       label: 'Student Loan',         hint: 'Plan 1/2/4/5 + Postgraduate',           icon: GraduationCap,accent: VIOLET, category: 'employment', status: 'live', live: true },
  { href: '/payslip-decoder',              label: 'Payslip Decoder',      hint: 'Tax codes · NI letters · pensions',     icon: ReceiptText,  accent: AMBER,  category: 'employment', status: 'live', live: true },
  { href: '/notice-period-calculator',     label: 'Notice Period',        hint: 'Statutory 1wk/yr · PILON taxable',      icon: Clock,        accent: ROSE,   category: 'employment', status: 'new',  live: true },
  { href: '/minimum-wage-checker',         label: 'Minimum Wage',         hint: 'NLW £12.21 · Apr 2025 rates',           icon: Scale,        accent: EMERALD,category: 'employment', status: 'new',  live: true },
  { href: '/mileage-expense-calculator',   label: 'Mileage Expenses',     hint: 'AMAP 45p/25p car · 24p motorcycle',     icon: MapPin,       accent: EMERALD,category: 'employment', status: 'new',  live: true },
  { href: '/salary-sacrifice-calculator',  label: 'Salary Sacrifice',     hint: 'IT + NI saving vs relief at source',    icon: PiggyBank,    accent: TEAL,   category: 'employment', status: 'new',  live: true },

  // ── PROPERTY & MORTGAGE (9 live) ───────────────────────────────
  { href: '/stamp-duty-calculator',        label: 'Stamp Duty',           hint: 'SDLT 2026 · FTB relief',                icon: Calculator,   accent: BLUE,   category: 'property',   status: 'live', trending: true, featured: true, live: true, kbd: 'S' },
  { href: '/mortgage-affordability',       label: 'Mortgage',             hint: 'Max borrow + stress test',              icon: HomeIcon,     accent: GOLD,   category: 'property',   status: 'live', trending: true, featured: true, live: true, kbd: 'M' },
  { href: '/council-tax-band',             label: 'Council Tax',          hint: 'All 8 bands by postcode',               icon: Building2,    accent: NAVY,   category: 'property',   status: 'live', trending: true, live: true, kbd: 'C' },
  { href: '/cost-of-living-uk',            label: 'Cost of Living',       hint: 'Rent · groceries · transport',          icon: MapPin,       accent: VIOLET, category: 'property',   status: 'live', live: true },
  { href: '/energy-bill',                  label: 'Energy Bill',          hint: 'Ofgem cap quarterly',                   icon: Zap,          accent: AMBER,  category: 'property',   status: 'live', live: true, kbd: 'E' },
  { href: '/rental-income-tax',            label: 'Rental Income Tax',    hint: 'Section 24 · mortgage interest credit', icon: HomeIcon,     accent: GOLD,   category: 'property',   status: 'new',  live: true },
  { href: '/rental-yield-calculator',      label: 'Rental Yield',         hint: 'Gross/net yield · BTL ICR check',       icon: TrendingUp,   accent: EMERALD,category: 'property',   status: 'new',  live: true },
  { href: '/overpayment-mortgage',         label: 'Mortgage Overpayment', hint: 'Interest saved · months off term',      icon: LandmarkIcon, accent: BLUE,   category: 'property',   status: 'new',  live: true },
  { href: '/property-cgt-calculator',      label: 'Property CGT',         hint: 'PPR relief · 18%/24% Oct 2024',         icon: Building2,    accent: NAVY,   category: 'property',   status: 'new',  live: true },

  // ── SAVINGS & PENSIONS (7 live) ─────────────────────────────────
  { href: '/pension-allowance',            label: 'Pension Allowance',    hint: 'Tapered + MPAA + carry-forward',        icon: Coins,        accent: GOLD,   category: 'savings',    status: 'live', live: true },
  { href: '/state-pension',                label: 'State Pension',        hint: 'From your NI years',                    icon: LandmarkIcon, accent: NAVY,   category: 'savings',    status: 'live', live: true },
  { href: '/isa-calculator',               label: 'ISA Growth',           hint: '£20k ISA · LISA bonus · projection',    icon: Wallet,       accent: TEAL,   category: 'savings',    status: 'new',  live: true },
  { href: '/lifetime-isa-calculator',      label: 'Lifetime ISA',         hint: '25% bonus · first home · retirement',   icon: Star,         accent: AMBER,  category: 'savings',    status: 'new',  live: true },
  { href: '/pension-drawdown-calculator',  label: 'Pension Drawdown',     hint: 'PCLS 25% · year-by-year projection',    icon: Coins,        accent: GOLD,   category: 'savings',    status: 'new',  live: true },

  // ── BUSINESS & SELF-EMPLOYED (3 live) ───────────────────────────
  { href: '/sole-trader-vs-limited',       label: 'Sole vs Ltd',          hint: 'Which keeps more of your profit?',      icon: Briefcase,    accent: BLUE,   category: 'business',   status: 'live', live: true },
  { href: '/ir35-calculator',              label: 'IR35 Calculator',      hint: 'Inside vs outside — take-home diff',    icon: Shield,       accent: VIOLET, category: 'business',   status: 'new',  live: true },
  { href: '/contractor-day-rate',          label: 'Contractor Day Rate',  hint: 'Day rate → Ltd vs PAYE comparison',     icon: Briefcase,    accent: BLUE,   category: 'business',   status: 'new',  live: true },

  // ── IMMIGRATION (5 live) ────────────────────────────────────────
  { href: '/tools/cost-calculator',        label: 'Visa Cost Calculator', hint: 'Fees + IHS + dependants · 8 currencies', icon: Calculator,   accent: VIOLET, category: 'immigration', status: 'new', live: true, featured: true },
  { href: '/ihs-calculator',               label: 'IHS Surcharge',        hint: '£1,035/yr · students £776/yr',          icon: HeartPulse,   accent: SKY,    category: 'immigration', status: 'new', live: true },
  { href: '/skilled-worker-points-check',  label: 'Skilled Worker Points',hint: '70-point check · shortage/new entrant', icon: GraduationCap,accent: GOLD,   category: 'immigration', status: 'new', live: true },
  { href: '/postcode',                     label: 'Postcode Lookup',      hint: 'Council, MP, NHS, police, ward',        icon: MapPin,       accent: VIOLET, category: 'immigration', status: 'live', live: true, kbd: 'L' },
  { href: '/visa-types',                   label: 'UK Visa Routes',       hint: '14 routes, 2026 fees',                  icon: Plane,        accent: AMBER,  category: 'immigration', status: 'live', live: true, kbd: 'V' },

  // ── VEHICLES (2 live) ───────────────────────────────────────────
  { href: '/ulez-check',                   label: 'ULEZ / CAZ',           hint: 'Is your car compliant?',                icon: Car,          accent: VIOLET, category: 'vehicles',   status: 'live', live: true, kbd: 'U' },
  { href: '/mot-check',                    label: 'MOT & Tax Check',      hint: 'Validate any UK reg plate',             icon: Car,          accent: ROSE,   category: 'vehicles',   status: 'live', live: true, kbd: 'D' },

  // ── BENEFITS (2 live) ───────────────────────────────────────────
  { href: '/child-benefit-calculator',     label: 'Child Benefit',        hint: '£25.60/wk · HICBC taper',               icon: Baby,         accent: PINK,   category: 'benefits',   status: 'new', live: true },
  { href: '/childcare-calculator',         label: 'Childcare Costs',      hint: '15/30 free hrs · TFC · UC 85%',          icon: Baby,         accent: VIOLET, category: 'benefits',   status: 'new', live: true },
];

/* ─────────────────────────────────────────────
   TIER-3 SOON TOOLS (50) — launching next
   These get full card treatment in Coming Soon
───────────────────────────────────────────── */
export const SOON_TOOLS: SoonTool[] = [
  // Employment (9)
  { label: 'Overtime Pay Calculator',      hint: 'Time-and-a-half · double time · TOIL',    icon: Clock,        accent: ROSE,   category: 'employment', href: '/overtime-pay' },
  { label: 'Shift Allowance Calculator',   hint: 'Night / weekend premium calculation',      icon: Moon,         accent: VIOLET, category: 'employment', href: '/shift-allowance' },
  { label: 'Paternity Pay Calculator',     hint: 'SPP 2 weeks · £187.18/wk',                icon: Baby,         accent: BLUE,   category: 'employment', href: '/paternity-pay' },
  { label: 'Shared Parental Leave Pay',    hint: 'ShPP split · up to 50 weeks',              icon: Users,        accent: VIOLET, category: 'employment', href: '/shared-parental-leave-pay' },
  { label: 'Adoption Pay Calculator',      hint: 'SAP 39 weeks · £187.18/wk',               icon: Heart,        accent: ROSE,   category: 'employment', href: '/adoption-pay' },
  { label: 'Apprenticeship Pay Guide',     hint: 'NMW £7.55/hr · progression to 18+',       icon: GraduationCap,accent: TEAL,   category: 'employment', href: '/apprenticeship-pay' },
  { label: 'Zero-Hours Pay Calculator',    hint: 'Average hours · statutory entitlements',   icon: Scale,        accent: AMBER,  category: 'employment', href: '/zero-hours-pay' },
  { label: 'Furlough Pay Calculator',      hint: 'Legacy CJRS 80% claim reference',         icon: Clock,        accent: NAVY,   category: 'employment', href: '/furlough-calculator' },
  { label: 'Work From Home Tax Relief',    hint: 'Flat £6/wk or actual cost claim',          icon: HomeIcon,     accent: TEAL,   category: 'employment', href: '/work-from-home-tax-relief' },

  // Property (10)
  { label: 'Remortgage Calculator',        hint: 'New rate vs current · exit fee vs saving', icon: RefreshCw,    accent: GOLD,   category: 'property',   href: '/remortgage-calculator' },
  { label: 'Shared Ownership Calculator',  hint: 'Staircasing · rent + mortgage split',      icon: Share2,       accent: TEAL,   category: 'property',   href: '/shared-ownership' },
  { label: 'Equity Release Calculator',    hint: 'Lifetime mortgage · downsizing estimate',  icon: HomeIcon,     accent: GOLD,   category: 'property',   href: '/equity-release-calculator' },
  { label: 'Lease Extension Cost',         hint: 'Statutory premium · marriage value',       icon: Key,          accent: NAVY,   category: 'property',   href: '/lease-extension-calculator' },
  { label: 'Conveyancing Fees',            hint: 'Solicitor scale + disbursements',          icon: FileText,     accent: BLUE,   category: 'property',   href: '/conveyancing-fees-calculator' },
  { label: 'Buy-to-Let Calculator',        hint: 'Full profit after tax · Section 24',       icon: Building2,    accent: NAVY,   category: 'property',   href: '/buy-to-let-calculator' },
  { label: 'Help to Buy Repayment',        hint: 'Equity loan · interest charges post yr 5', icon: HomeIcon,     accent: TEAL,   category: 'property',   href: '/help-to-buy-repayment' },
  { label: 'Land Transaction Tax (LTT)',   hint: 'Welsh SDLT equivalent · all rates',        icon: MapPin,       accent: EMERALD,category: 'property',   href: '/land-transaction-tax' },
  { label: 'Negative Equity Calculator',   hint: 'Shortfall vs outstanding mortgage',        icon: TrendingDown, accent: ROSE,   category: 'property',   href: '/negative-equity-calculator' },
  { label: 'Service Charge Estimator',     hint: 'Leasehold annual charges + reserve fund',  icon: Wrench,       accent: NAVY,   category: 'property',   href: '/service-charge-calculator' },

  // Savings (8)
  { label: 'Compound Interest Calculator', hint: 'Daily / monthly / annual compounding',     icon: TrendingUp,   accent: EMERALD,category: 'savings',    href: '/compound-interest-calculator' },
  { label: 'Savings Goal Calculator',      hint: 'Monthly needed · time to reach target',    icon: Target,       accent: TEAL,   category: 'savings',    href: '/savings-goal-calculator' },
  { label: 'Premium Bonds Calculator',     hint: 'Expected prize yield vs cash ISA',         icon: Star,         accent: AMBER,  category: 'savings',    href: '/premium-bonds-calculator' },
  { label: 'Junior ISA Calculator',        hint: '£9,000/yr · 18-year projection',           icon: Baby,         accent: TEAL,   category: 'savings',    href: '/junior-isa-calculator' },
  { label: 'Workplace Pension Calculator', hint: 'Auto-enrolment · employer + employee NI',  icon: Briefcase,    accent: NAVY,   category: 'savings',    href: '/workplace-pension-calculator' },
  { label: 'Annuity Rate Calculator',      hint: 'Pension pot → guaranteed income options',  icon: PiggyBank,    accent: GOLD,   category: 'savings',    href: '/annuity-calculator' },
  { label: 'Crypto Tax Calculator',        hint: 'CGT on disposal · pool cost method',       icon: Coins,        accent: VIOLET, category: 'savings',    href: '/crypto-tax-calculator' },
  { label: 'Gift Aid Calculator',          hint: '25p per £1 · higher-rate reclaim',         icon: Gift,         accent: ROSE,   category: 'savings',    href: '/gift-aid-calculator' },

  // Immigration (8)
  { label: 'Visa Fee Checker',             hint: 'All 2026 Home Office fees in one place',   icon: Plane,        accent: VIOLET, category: 'immigration', href: '/visa-fee-checker' },
  { label: 'ILR Calculator',               hint: '5-year clock · absences · early entry',    icon: ShieldCheck,  accent: TEAL,   category: 'immigration', href: '/ilr-calculator' },
  { label: 'Naturalisation Calculator',    hint: '3-yr clock · Life in UK test check',       icon: Flag,         accent: NAVY,   category: 'immigration', href: '/naturalisation-calculator' },
  { label: 'Absence Calculator',           hint: 'Count days outside UK for ILR / BN(O)',    icon: Calendar,     accent: BLUE,   category: 'immigration', href: '/absence-calculator' },
  { label: 'Right to Work Checker',        hint: 'BRP / eVisa / BNO date validity',          icon: CheckCircle2, accent: EMERALD,category: 'immigration', href: '/right-to-work-checker' },
  { label: 'English Test Requirements',    hint: 'SELT provider · CEFR level by route',      icon: BookOpen,     accent: VIOLET, category: 'immigration', href: '/english-test-requirements' },
  { label: 'Dependant Visa Calculator',    hint: 'Fees + IHS for partner and children',      icon: Users,        accent: TEAL,   category: 'immigration', href: '/dependant-visa-calculator' },
  { label: 'Visa Processing Times',        hint: 'Current SLAs by route and entry type',     icon: Clock,        accent: BLUE,   category: 'immigration', href: '/visa-processing-times' },

  // Vehicles (5)
  { label: 'Car Running Costs',            hint: 'Fuel + insurance + tax + maintenance',     icon: Car,          accent: ROSE,   category: 'vehicles',   href: '/car-running-costs' },
  { label: 'Electric Car Calculator',      hint: 'Charging cost vs petrol · payback',        icon: Zap,          accent: EMERALD,category: 'vehicles',   href: '/electric-car-calculator' },
  { label: 'Fuel Cost Calculator',         hint: 'MPG / l/100km · price per litre',          icon: Car,          accent: AMBER,  category: 'vehicles',   href: '/fuel-cost-calculator' },
  { label: 'Congestion Charge Checker',    hint: 'TfL daily charge · exempt vehicles',       icon: MapPin,       accent: ROSE,   category: 'vehicles',   href: '/congestion-charge-checker' },
  { label: 'Vehicle Tax (VED) Calculator', hint: 'DVLA annual road tax by emission band',    icon: Car,          accent: NAVY,   category: 'vehicles',   href: '/vehicle-tax-calculator' },

  // Benefits (5)
  { label: 'Universal Credit Calculator',  hint: 'Standard allowance + elements + taper',    icon: Users,        accent: EMERALD,category: 'benefits',   href: '/universal-credit-calculator' },
  { label: 'Council Tax Support Checker',  hint: 'Local scheme eligibility + reduction',     icon: Building2,    accent: TEAL,   category: 'benefits',   href: '/council-tax-support-checker' },
  { label: 'PIP Benefit Checker',          hint: 'Daily living + mobility components',       icon: HeartPulse,   accent: ROSE,   category: 'benefits',   href: '/pip-benefit-checker' },
  { label: 'Housing Benefit Calculator',   hint: 'LHA rate · legacy HB estimate',            icon: HomeIcon,     accent: BLUE,   category: 'benefits',   href: '/housing-benefit-calculator' },
  { label: 'Benefits Cap Calculator',      hint: '£442.31/wk (London) · £332.41 (rest)',     icon: Scale,        accent: NAVY,   category: 'benefits',   href: '/benefits-cap-calculator' },

  // Business (4)
  { label: 'Corporation Tax Calculator',   hint: '19% small / 25% main · marginal relief',   icon: Building2,    accent: TEAL,   category: 'business',   href: '/corporation-tax-calculator' },
  { label: 'PAYE Tax Calculator',          hint: 'Employer NI + payroll tax projection',      icon: ReceiptText,  accent: BLUE,   category: 'business',   href: '/paye-tax-calculator' },
  { label: 'Invoice Tax Calculator',       hint: 'VAT + IT on invoice income estimate',       icon: FileText,     accent: GOLD,   category: 'business',   href: '/invoice-tax-calculator' },
  { label: 'Van Benefit Charge',           hint: 'Flat rate £4,020 · fuel £769 BiK 2025',    icon: Truck,        accent: BLUE,   category: 'business',   href: '/van-benefit-charge' },

  // Tax (1)
  { label: 'P11D Benefits Calculator',     hint: 'Reportable benefits · Class 1A NI',        icon: FileText,     accent: NAVY,   category: 'tax',        href: '/p11d-calculator' },
];

/* ─────────────────────────────────────────────
   TIER-4 PLANNED TOOLS (100) — on the roadmap
   Shown as coming-soon placeholders with count
───────────────────────────────────────────── */
export const PLANNED_TOOLS: PlannedTool[] = [
  // Property (12)
  { label: 'Ground Rent Calculator',       hint: 'Lease year liability estimate',            category: 'property' },
  { label: 'RICS Survey Cost Guide',       hint: 'Survey type vs property value',            category: 'property' },
  { label: 'HMO Licensing Checker',        hint: 'Rules by local authority',                 category: 'property' },
  { label: 'Flood Risk Checker',           hint: 'Environment Agency zone check',            category: 'property' },
  { label: 'Property Development ROI',     hint: 'Build cost vs GDV calculation',            category: 'property' },
  { label: 'House Price to Income Ratio',  hint: 'Affordability index by city',              category: 'property' },
  { label: 'Stamp Duty Wales (LTT)',       hint: 'Compare SDLT vs Welsh LTT rates',          category: 'property' },
  { label: 'Second-Home Surcharge',        hint: '3% SDLT on additional properties',         category: 'property' },
  { label: 'BTL Portfolio Tracker',        hint: 'Multi-property profit tracker',            category: 'property' },
  { label: 'Rent Arrears Calculator',      hint: 'Eviction timeline + notice periods',       category: 'property' },
  { label: 'Section 21 Notice Guide',      hint: 'Renters Reform Act timeline',              category: 'property' },
  { label: 'Deposit Dispute Guide',        hint: 'TDS/DPS/MyDeposits process',               category: 'property' },

  // Tax (8)
  { label: 'Income Tax Forecast',          hint: 'Forward-looking annual IT estimate',        category: 'tax' },
  { label: 'Scottish Income Tax',          hint: 'Scottish rates vs rest-of-UK',             category: 'tax' },
  { label: 'Pension Tax Relief Claim',     hint: 'Higher-rate relief via self assessment',   category: 'tax' },
  { label: 'Side-Hustle Tax Calculator',   hint: 'Trading allowance vs actual profit',       category: 'tax' },
  { label: 'PPI Tax Calculator',           hint: 'Tax on PPI refund interest',               category: 'tax' },
  { label: 'Capital Allowances Guide',     hint: 'AIA / WDA / FYA for business assets',      category: 'tax' },
  { label: 'VAT Registration Guide',       hint: '£90k threshold and voluntary reg',         category: 'tax' },
  { label: 'Total Compensation Value',     hint: 'Salary + benefits package total',          category: 'tax' },

  // Employment (12)
  { label: 'Bonus Tax Calculator',         hint: 'Net amount after PAYE on bonus',           category: 'employment' },
  { label: 'Commission Tax Calculator',    hint: 'Variable pay and commission tax',           category: 'employment' },
  { label: 'Share Options Tax',            hint: 'EMI / CSOP / unapproved options',          category: 'employment' },
  { label: 'Settlement Agreement Guide',   hint: '£30k tax-free limit + legal costs',        category: 'employment' },
  { label: 'Gardening Leave Calculator',   hint: 'Pay during notice period not working',     category: 'employment' },
  { label: 'Termination Payment Tax',      hint: 'Post-employment notice + PILON',           category: 'employment' },
  { label: 'Agency Worker Rights',         hint: 'AWR 12-week qualifying period',            category: 'employment' },
  { label: 'Car Allowance vs Company Car', hint: 'Cash allowance vs BiK tax comparison',     category: 'employment' },
  { label: 'Equal Pay Gap Calculator',     hint: 'Gender / ethnicity pay gap formula',       category: 'employment' },
  { label: 'Employment Tribunal Awards',   hint: 'Compensation award estimate',              category: 'employment' },
  { label: 'Business Travel Per Diem',     hint: 'HMRC approved subsistence amounts',        category: 'employment' },
  { label: 'Holiday Entitlement Pro-Rata', hint: 'Part-year and irregular hours',            category: 'employment' },

  // Vehicles (5)
  { label: 'Car Finance Calculator',       hint: 'PCP vs HP vs personal loan',               category: 'vehicles' },
  { label: 'EV Charging Cost',             hint: 'Home vs public charging per mile',         category: 'vehicles' },
  { label: 'TfL Zones Calculator',         hint: 'Travel card cost by zone pair',            category: 'vehicles' },
  { label: 'Driving Licence Costs',        hint: 'Theory + practical + licence fees',        category: 'vehicles' },
  { label: 'Parking Fine Checker',         hint: 'Discount window and appeal rights',        category: 'vehicles' },

  // Savings (10)
  { label: 'Dividend Reinvestment (DRIP)', hint: 'Projection with tax wrapper',              category: 'savings' },
  { label: 'Bond Yield Calculator',        hint: 'Gilt and corporate yield to maturity',     category: 'savings' },
  { label: 'Venture Capital Trust (VCT)',  hint: '30% IT relief + tax-free income',         category: 'savings' },
  { label: 'Enterprise Investment (EIS)',  hint: '30% relief + CGT deferral',               category: 'savings' },
  { label: 'SEIS Tax Relief Calculator',   hint: '50% IT relief for seed investors',         category: 'savings' },
  { label: 'Cash ISA Comparison Table',    hint: 'Rate-sorted easy access savings',          category: 'savings' },
  { label: 'Fixed Rate Bond Comparison',   hint: 'Best fixed-term savings bond rates',       category: 'savings' },
  { label: 'Inherited ISA (APS)',          hint: 'Additional permitted subscription',        category: 'savings' },
  { label: 'Help to Save Calculator',      hint: 'Government 50% bonus scheme',              category: 'savings' },
  { label: 'State Pension Deferral',       hint: 'Extra income from deferring SP',           category: 'savings' },

  // Immigration (8)
  { label: 'Family Visa Income Check',     hint: 'Family route £29k threshold',              category: 'immigration' },
  { label: 'Graduate Visa Eligibility',    hint: '2-year / 3-year checker',                 category: 'immigration' },
  { label: 'Global Talent Criteria',       hint: 'Endorsed exception route guide',          category: 'immigration' },
  { label: 'Innovator Founder Visa',       hint: 'Business plan requirements',              category: 'immigration' },
  { label: 'Visa Refusal Grounds',         hint: 'Common UK refusal reasons',               category: 'immigration' },
  { label: 'Fiancée Visa Calculator',      hint: 'Route from outside UK guide',             category: 'immigration' },
  { label: 'Points-Based System Check',    hint: 'General PBS calculator',                  category: 'immigration' },
  { label: 'Student Loan at Settlement',   hint: 'Accrued balance at ILR date',             category: 'immigration' },

  // Benefits (10)
  { label: 'Tax Credits Checker',          hint: 'Legacy CTC / WTC eligibility',            category: 'benefits' },
  { label: "Jobseeker's Allowance",        hint: 'Contribution vs income-based JSA',        category: 'benefits' },
  { label: 'Attendance Allowance',         hint: 'Lower / higher rate eligibility',         category: 'benefits' },
  { label: "Carer's Allowance Calculator", hint: '£81.90/wk + overlapping benefits',        category: 'benefits' },
  { label: 'Free School Meals Checker',    hint: 'Income thresholds by local authority',    category: 'benefits' },
  { label: 'Council Tax Exemption',        hint: 'Student, empty, mental impairment',       category: 'benefits' },
  { label: 'Pension Credit Checker',       hint: 'Savings + guarantee credit eligibility',  category: 'benefits' },
  { label: 'NHS Dental Charges',           hint: 'Band 1/2/3 dental costs 2025',            category: 'benefits' },
  { label: 'Child Maintenance (CMS)',       hint: 'Statutory CMS calculation',               category: 'benefits' },
  { label: 'Fostering Allowance Guide',    hint: 'Weekly allowance by region',              category: 'benefits' },

  // Business (10)
  { label: "R&D Tax Credits",              hint: 'SME scheme post-Apr 2023 merged',         category: 'business' },
  { label: "Entrepreneurs' Relief (BADR)", hint: '10% CGT up to £1m lifetime',              category: 'business' },
  { label: 'Business Rates Calculator',    hint: 'Non-domestic rateable value',             category: 'business' },
  { label: 'CIS Deduction Calculator',     hint: 'Construction Industry Scheme',            category: 'business' },
  { label: 'VAT Flat Rate Scheme',         hint: 'FRS vs standard scheme comparison',       category: 'business' },
  { label: 'Making Tax Digital Checker',   hint: 'MTD obligations by income',               category: 'business' },
  { label: 'Annual Investment Allowance',  hint: 'AIA £1m deduction planning',              category: 'business' },
  { label: 'Auto-Enrolment Calculator',    hint: 'Employer pension auto-enrolment cost',    category: 'business' },
  { label: 'Director Dividend Planning',   hint: 'Optimal salary + dividend split',         category: 'business' },
  { label: 'Small Claims Court Fees',      hint: 'County Court fee calculator',             category: 'business' },

  // Family & Lifestyle (10)
  { label: 'School Catchment Checker',     hint: 'Primary / secondary by postcode',         category: 'benefits' },
  { label: 'Wedding Cost Calculator',      hint: 'UK average wedding breakdown',            category: 'benefits' },
  { label: 'Funeral Cost Guide',           hint: 'Planning + DWP Funeral Payment',          category: 'benefits' },
  { label: 'Divorce Cost Estimate',        hint: 'Legal and financial split estimate',      category: 'benefits' },
  { label: 'Will Writing Costs',           hint: 'DIY vs solicitor comparison',             category: 'benefits' },
  { label: 'Power of Attorney Costs',      hint: 'LPA costs and process guide',             category: 'benefits' },
  { label: 'Private School VAT Impact',    hint: '20% VAT from January 2025',              category: 'benefits' },
  { label: 'Childcare Provider Finder',    hint: 'Ofsted ratings near your postcode',       category: 'benefits' },
  { label: 'Child Maintenance Appeals',    hint: 'CMS variation and review guide',          category: 'benefits' },
  { label: 'Fostering vs Adoption Guide',  hint: 'Allowances and legal status',             category: 'benefits' },

  // Energy & Environment (8)
  { label: 'Solar Panel ROI',              hint: 'Payback period + Smart Export Guarantee', category: 'property' },
  { label: 'Heat Pump vs Gas Boiler',      hint: 'Ground / air source economics',           category: 'property' },
  { label: 'Boiler Upgrade Scheme',        hint: '£7,500 grant eligibility checker',        category: 'property' },
  { label: 'EPC Rating Impact',            hint: 'Band impact on mortgage and rent',        category: 'property' },
  { label: 'EV Grant Checker',             hint: 'OZEV plug-in grant eligibility',          category: 'vehicles' },
  { label: 'Smart Meter Savings',          hint: 'Switching behaviour savings estimate',    category: 'property' },
  { label: 'Water Bill Estimator',         hint: 'Metered vs unmetered comparison',         category: 'property' },
  { label: 'Home Insurance Guide',         hint: 'Buildings + contents cost estimate',      category: 'property' },

  // Travel & International (5)
  { label: 'Foreign Currency Calculator',  hint: 'Mid-market + bank spread comparison',     category: 'tax' },
  { label: 'Customs Duty Calculator',      hint: 'Post-Brexit import duty + VAT',           category: 'tax' },
  { label: 'Duty-Free Allowances',         hint: 'UK inbound customs allowances',           category: 'immigration' },
  { label: 'Remote Worker Tax Guide',      hint: 'Dual tax treaty implications',            category: 'tax' },
  { label: 'Digital Nomad Visa Guide',     hint: 'UK options for remote workers',           category: 'immigration' },

  // Retirement — extra (2)
  { label: 'SIPP Contribution Planner',    hint: 'Self-invested pension + relief',          category: 'savings' },
  { label: 'Pension Sharing Order',        hint: 'Divorce pension split calculator',        category: 'savings' },
];

/* ─────────────────────────────────────────────
   DERIVED / HELPER EXPORTS
───────────────────────────────────────────── */

/** 3 featured tools pinned to the top of the "All" view */
export const FEATURED_TILES = APP_TILES.filter((t) => t.featured);

/** 6 trending tools shown in the trending strip */
export const TRENDING_TILES = APP_TILES.filter((t) => t.trending).slice(0, 6);

/** 6 most recently added tools (status: 'new') */
export const NEW_TILES = APP_TILES.filter((t) => t.status === 'new').slice(0, 6);

/** 16 coming-soon tools showcased on homepage */
export const SOON_SHOWCASE = SOON_TOOLS.slice(0, 16);

/** Total tools in pipeline (shown in stats bar) */
export const TOTAL_SOON_COUNT = SOON_TOOLS.length + PLANNED_TOOLS.length;

/** Live tool count */
export const LIVE_COUNT = APP_TILES.length;
