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
  BookOpen, Flag, Wrench, Share2, Moon, Truck, Key, Calendar, Sparkles
} from 'lucide-react';


/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

export type IconComponent = typeof Wallet;
export type CategoryId =
  | 'tax' | 'employment' | 'property' | 'savings'
  | 'business' | 'benefits' | 'vehicles'
  | 'insurance' | 'loans' | 'estate' | 'family-law' | 'energy';

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
  { id: 'property',    label: 'Mortgages & Property',       icon: HomeIcon,     color: '#00875A', description: 'Mortgages, SDLT, rental income and costs' },
  { id: 'insurance',   label: 'Insurance',                  icon: Shield,       color: '#006c49', description: 'Life cover, health, rebuild costs and more' },
  { id: 'loans',       label: 'Loans, Debt & Credit',       icon: LandmarkIcon, color: '#ba1a1a', description: 'APR comparisons, debt consolidation and credit strategy' },
  { id: 'savings',     label: 'Pensions, Investing & Savings', icon: PiggyBank,   color: '#623c00', description: 'State pension, ISAs, compound interest' },
  { id: 'tax',         label: 'Tax & Income',               icon: Wallet,       color: '#00875A', description: 'Income tax, NI, dividends, CGT and more' },
  { id: 'business',    label: 'Business & Self-Employed',   icon: Building2,    color: '#006c49', description: 'Self-employed, contractors and Ltd companies' },
  { id: 'estate',      label: 'Wills, Probate & Inheritance', icon: FileText,    color: '#623c00', description: 'Inheritance tax, probate fees and wills' },
  { id: 'family-law',  label: 'Divorce & Family Law',       icon: Users,        color: '#ba1a1a', description: 'Divorce costs, maintenance and asset split' },
  { id: 'energy',      label: 'Energy & Bills',             icon: Zap,          color: '#006c49', description: 'Energy price cap and solar panel ROI' },
  { id: 'employment',  label: 'Employment & Salary',        icon: Briefcase,    color: '#00875A', description: 'Redundancy pay, holiday entitlement and SSP' },
  { id: 'vehicles',    label: 'Vehicles & Motoring',        icon: Car,          color: '#00875A', description: 'ULEZ compliance, MOT and vehicle tax' },
  { id: 'benefits',    label: 'Benefits',                   icon: Gift,         color: '#00875A', description: 'Universal credit and childcare costs' },
];

/* ─────────────────────────────────────────────
   LIVE TOOLS (46)
   status: 'live'  = original Tier-1 tools
   status: 'new'   = Tier-2 recently added
───────────────────────────────────────────── */
export const APP_TILES: AppTile[] = [
  // ── TAX & INCOME (12 live) ──────────────────────────────────────
  { href: '/take-home-pay',                label: 'Take-home Pay',        hint: 'PAYE + NI + student loan',              icon: Wallet,       accent: TEAL,   category: 'tax',        status: 'live', trending: true, featured: true, live: true, kbd: 'P' },
  { href: '/payslip-auditor',              label: 'Payslip Auditor',      hint: 'Audit tax code + HMRC error check',     icon: FileText,     accent: NAVY,   category: 'tax',        status: 'new',  live: true, kbd: 'T' },
  { href: '/self-employed-tax',            label: 'Self-Employed Tax',    hint: 'SA estimation + Payment on Account',    icon: Briefcase,    accent: AMBER,  category: 'tax',        status: 'new',  live: true },
  { href: '/contractor-ir35',              label: 'Contractor & IR35',    hint: '3-way comparison (Ltd vs PAYE vs Perm)', icon: Briefcase,    accent: VIOLET, category: 'tax',        status: 'new',  live: true },
  { href: '/director-dividend',            label: 'Director Dividend',    hint: 'Salary/dividend split optimizer',       icon: TrendingUp,   accent: EMERALD,category: 'tax',        status: 'new',  live: true },
  { href: '/bonus-tax',                    label: 'Bonus & Overtime',     hint: 'Keep vs lose + pension redirect',       icon: Gift,         accent: ROSE,   category: 'tax',        status: 'new',  live: true },
  { href: '/student-loan-repayment',       label: 'Student Loan Pay',     hint: 'Plan 1/2/4/5 + Postgraduate',           icon: GraduationCap,accent: VIOLET, category: 'tax',        status: 'live', live: true },
  { href: '/salary-sacrifice-calculator',  label: 'Salary Sacrifice',     hint: 'EV lease, pension, cycle savings',      icon: PiggyBank,    accent: TEAL,   category: 'tax',        status: 'new',  live: true },
  { href: '/child-benefit-trap',           label: 'Child Benefit Trap',   hint: 'HICBC clawback + pension escape',       icon: Users,        accent: PINK,   category: 'tax',        status: 'new',  live: true },
  { href: '/inheritance-tax',              label: 'Inheritance Tax',      hint: 'NRB £325k + RNRB £175k',                icon: LandmarkIcon, accent: GOLD,   category: 'tax',        status: 'live', live: true },
  { href: '/cgt-calculator',               label: 'Capital Gains Tax',    hint: '£3,000 AEA · 18% / 24%',                icon: TrendingUp,   accent: BLUE,   category: 'tax',        status: 'live', live: true },
  { href: '/marriage-allowance-calculator',label: 'Marriage Allowance',   hint: '£1,260 PA transfer · £252 saving',      icon: Heart,        accent: ROSE,   category: 'tax',        status: 'new',  live: true },

  // ── EMPLOYMENT (6 live) ────────────────────────────────────────
  { href: '/holiday-pay',                  label: 'Holiday Pay',          hint: 'Statutory 5.6 weeks · 12.07%',          icon: Briefcase,    accent: BLUE,   category: 'employment', status: 'live', live: true },
  { href: '/salary-compare',               label: 'Salary Compare',       hint: 'City ↔ city equivalent gross',          icon: Scale,        accent: EMERALD,category: 'employment', status: 'live', trending: true, live: true, kbd: 'Q' },
  { href: '/redundancy-pay',               label: 'Redundancy Pay',       hint: '£719 weekly cap · £30k tax-free',       icon: Banknote,     accent: ROSE,   category: 'employment', status: 'live', live: true },
  { href: '/maternity-pay',                label: 'Maternity Pay',        hint: 'SMP 39 weeks · SPP',                    icon: Baby,         accent: PINK,   category: 'employment', status: 'live', live: true },
  { href: '/sick-pay',                     label: 'Sick Pay (SSP)',       hint: '£118.75/wk · 28-week max',              icon: HeartPulse,   accent: SKY,    category: 'employment', status: 'live', live: true },
  { href: '/minimum-wage-checker',         label: 'Minimum Wage',         hint: 'NLW £12.21 · Apr 2025 rates',           icon: Scale,        accent: EMERALD,category: 'employment', status: 'new',  live: true },

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

  // ── SAVINGS & PENSIONS (4 live) ─────────────────────────────────
  { href: '/state-pension',                label: 'State Pension',        hint: 'From your NI years',                    icon: LandmarkIcon, accent: NAVY,   category: 'savings',    status: 'live', live: true },
  { href: '/isa-calculator',               label: 'ISA Growth',           hint: '£20k ISA · LISA bonus · projection',    icon: Wallet,       accent: TEAL,   category: 'savings',    status: 'new',  live: true },
  { href: '/lifetime-isa-calculator',      label: 'Lifetime ISA',         hint: '25% bonus · first home · retirement',   icon: Star,         accent: AMBER,  category: 'savings',    status: 'new',  live: true },
  { href: '/pension-drawdown-calculator',  label: 'Pension Drawdown',     hint: 'PCLS 25% · year-by-year projection',    icon: Coins,        accent: GOLD,   category: 'savings',    status: 'new',  live: true },

  // ── BUSINESS & SELF-EMPLOYED (0 live) ───────────────────────────
  // Note: sole trader vs ltd, ir35, and contractor day rate are consolidated under category 'tax'
  { href: '/postcode',                     label: 'Postcode Lookup',      hint: 'Council, MP, NHS, police, ward',        icon: MapPin,       accent: VIOLET, category: 'property', status: 'live', live: true, kbd: 'L' },

  // ── VEHICLES (2 live) ───────────────────────────────────────────
  { href: '/ulez-check',                   label: 'ULEZ / CAZ',           hint: 'Is your car compliant?',                icon: Car,          accent: VIOLET, category: 'vehicles',   status: 'live', live: true, kbd: 'U' },
  { href: '/mot-check',                    label: 'MOT & Tax Check',      hint: 'Validate any UK reg plate',             icon: Car,          accent: ROSE,   category: 'vehicles',   status: 'live', live: true, kbd: 'D' },

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

  // Travel & International (3)
  { label: 'Foreign Currency Calculator',  hint: 'Mid-market + bank spread comparison',     category: 'tax' },
  { label: 'Customs Duty Calculator',      hint: 'Post-Brexit import duty + VAT',           category: 'tax' },
  { label: 'Remote Worker Tax Guide',      hint: 'Dual tax treaty implications',            category: 'tax' },

  // Retirement — extra (2)
  { label: 'SIPP Contribution Planner',    hint: 'Self-invested pension + relief',          category: 'savings' },
  { label: 'Pension Sharing Order',        hint: 'Divorce pension split calculator',        category: 'savings' },
];

/* ─────────────────────────────────────────────
   SUB-CATEGORIES (hub page grouping)
   Each category hub groups its tools into labelled
   sub-sections. Membership is by href so the same
   list drives both AppTiles and standalone
   tools. Any tool not listed falls into a "More" group.
───────────────────────────────────────────── */
export interface SubGroup {
  id: string;
  label: string;       // eyebrow
  title: string;       // section heading
  description: string;
  hrefs: string[];     // ordered membership
}

export const SUBCATEGORIES: Record<CategoryId, SubGroup[]> = {
  tax: [
    { id: 'paye',     label: 'Employed income', title: 'PAYE & Salary',              description: 'Net pay, payslip checks and salary-sacrifice savings under HMRC tax codes.', hrefs: ['/take-home-pay', '/payslip-auditor', '/bonus-tax', '/salary-sacrifice-calculator'] },
    { id: 'selfemp',  label: 'Business & contracting', title: 'Self-Employed & Contracting', description: 'Sole-trader bills, IR35 comparisons and director salary/dividend planning.', hrefs: ['/self-employed-tax', '/contractor-ir35', '/director-dividend'] },
    { id: 'reliefs',  label: 'Allowances & reliefs', title: 'Allowances & Reliefs',    description: 'Transfer allowances, dodge the child-benefit trap and plan student-loan repayment.', hrefs: ['/marriage-allowance-calculator', '/child-benefit-trap', '/student-loan-repayment'] },
    { id: 'capital',  label: 'Capital & estate', title: 'Capital & Estate',           description: 'Tax on gains and what your estate owes on inheritance.', hrefs: ['/cgt-calculator', '/inheritance-tax'] },
  ],
  employment: [
    { id: 'pay',   label: 'Pay & wages',    title: 'Pay & Wages',     description: 'Compare salaries, check minimum wage and work out holiday pay.', hrefs: ['/salary-compare', '/minimum-wage-checker', '/holiday-pay'] },
    { id: 'leave', label: 'Leave & absence', title: 'Leave & Absence', description: 'Statutory maternity and sick-pay entitlements.', hrefs: ['/maternity-pay', '/sick-pay'] },
    { id: 'exit',  label: 'Leaving a job',  title: 'Leaving a Job',   description: 'Redundancy pay and tax-free limits.', hrefs: ['/redundancy-pay'] },
  ],
  property: [
    { id: 'buying',   label: 'Buying & mortgages', title: 'Buying & Mortgages', description: 'Stamp duty, affordability and overpayment savings.', hrefs: ['/stamp-duty-calculator', '/mortgage-affordability', '/overpayment-mortgage'] },
    { id: 'landlord', label: 'Landlord & rental',  title: 'Landlord & Rental',  description: 'Rental income tax, yield and property capital gains.', hrefs: ['/rental-income-tax', '/rental-yield-calculator', '/property-cgt-calculator'] },
    { id: 'costs',    label: 'Running costs',      title: 'Running Costs',      description: 'Council tax, energy bills and cost of living.', hrefs: ['/council-tax-band', '/energy-bill', '/cost-of-living-uk', '/postcode'] },
  ],
  savings: [
    { id: 'isa',     label: 'Tax-free saving', title: 'ISAs & Savings',        description: 'Grow an ISA or claim the Lifetime ISA bonus.', hrefs: ['/isa-calculator', '/lifetime-isa-calculator'] },
    { id: 'pension', label: 'Retirement',      title: 'Pensions & Retirement', description: 'State pension forecast and drawdown planning.', hrefs: ['/state-pension', '/pension-drawdown-calculator'] },
  ],
  business: [],
  insurance: [],
  loans: [],
  estate: [],
  'family-law': [],
  energy: [],

  benefits: [
    { id: 'family', label: 'Family support', title: 'Family & Childcare', description: 'Free hours, Tax-Free Childcare and Universal Credit support.', hrefs: ['/childcare-calculator'] },
  ],
  vehicles: [
    { id: 'checks', label: 'Compliance', title: 'Compliance & Checks', description: 'Clean-air zone compliance and MOT/tax validity.', hrefs: ['/ulez-check', '/mot-check'] },
  ],
};

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
