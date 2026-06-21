// UK Tax Engine 2026/27, shared calculation utilities

export const TAX_YEAR = '2026/27';

// ── Thresholds ────────────────────────────────────────────────────────────────
export const THRESHOLDS = {
  personalAllowance: 12570,
  basicRateLimit: 37700,       // taxable income above PA
  higherRateThreshold: 50270,  // PA + basicRateLimit
  additionalRateThreshold: 125140,
  parapetThreshold: 100000,    // PA taper starts here
  niPrimaryThreshold: 12570,
  niUpperEarningsLimit: 50270,
  hicbcLower: 60000,
  hicbcUpper: 80000,
  cbFirstChild: 1331.20,
  cbAdditionalChild: 881.40,
  dividendAllowance: 500,
  annualAllowance: 60000,
} as const;

// ── Scotland bands 2026/27 ────────────────────────────────────────────────────
export const SCOTLAND_BANDS = [
  { name: 'Starter',     from: 0,      to: 2306,   rate: 0.19 },
  { name: 'Basic',       from: 2306,   to: 13991,  rate: 0.20 },
  { name: 'Intermediate',from: 13991,  to: 31092,  rate: 0.21 },
  { name: 'Higher',      from: 31092,  to: 62430,  rate: 0.42 },
  { name: 'Advanced',    from: 62430,  to: 125140, rate: 0.45 },
  { name: 'Top',         from: 125140, to: Infinity,rate: 0.48 },
] as const;

// ── England/Wales/NI bands ────────────────────────────────────────────────────
export const RUK_BANDS = [
  { name: 'Basic',      from: 0,      to: 37700,  rate: 0.20 },
  { name: 'Higher',     from: 37700,  to: 125140, rate: 0.40 },
  { name: 'Additional', from: 125140, to: Infinity,rate: 0.45 },
] as const;

// ── Student loan thresholds ───────────────────────────────────────────────────
export const STUDENT_LOAN_PLANS = {
  plan1:     { threshold: 26065, rate: 0.09, writeOff: 25, name: 'Plan 1' },
  plan2:     { threshold: 28470, rate: 0.09, writeOff: 30, name: 'Plan 2' },
  plan4:     { threshold: 32745, rate: 0.09, writeOff: 30, name: 'Plan 4 (Scotland)' },
  plan5:     { threshold: 25000, rate: 0.09, writeOff: 40, name: 'Plan 5' },
  postgrad:  { threshold: 21000, rate: 0.06, writeOff: 30, name: 'Postgraduate' },
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface TaxInputs {
  salary: number;
  bonus?: number;
  commission?: number;
  overtime?: number;
  pensionPct?: number;
  pensionType?: 'salary_sacrifice' | 'net_pay' | 'relief_at_source';
  studentLoan?: 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5';
  postgradLoan?: boolean;
  taxCode?: string;
  niCategory?: 'A' | 'B' | 'C';
  scotland?: boolean;
  children?: number;
}

export interface TaxResult {
  gross: number;
  adjustedNetIncome: number;
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  ni: number;
  pension: number;
  studentLoan: number;
  hicbc: number;
  net: number;
  effectiveRate: number;
  marginalRate: number;
  bands: { name: string; income: number; tax: number; rate: number }[];
  // flags
  inHicbcTrap: boolean;
  inPaTaper: boolean;
  in40pctBand: boolean;
  in45pctBand: boolean;
  nearHicbc: boolean;
}

// ── Core engine ───────────────────────────────────────────────────────────────
export function calcTax(inputs: TaxInputs): TaxResult {
  const {
    salary = 0,
    bonus = 0,
    commission = 0,
    overtime = 0,
    pensionPct = 0,
    pensionType = 'salary_sacrifice',
    studentLoan = 'none',
    postgradLoan = false,
    taxCode = '1257L',
    niCategory = 'A',
    scotland = false,
    children = 0,
  } = inputs;

  const gross = salary + bonus + commission + overtime;

  // Pension
  const pensionAmount = gross * (pensionPct / 100);
  const pensionReducesNI = pensionType === 'salary_sacrifice';
  const pensionReducesTax = pensionType === 'salary_sacrifice' || pensionType === 'net_pay';
  const taxablePensionReduction = pensionReducesTax ? pensionAmount : 0;

  const adjustedNetIncome = Math.max(0, gross - taxablePensionReduction);

  // Personal Allowance from tax code
  let pa = 12570;
  const code = taxCode.trim().toUpperCase();
  if (code.startsWith('K')) {
    const n = parseInt(code.slice(1)) || 0;
    pa = -(n * 10);
  } else {
    const m = code.match(/^([SC]?)(\d+)([LTVY])$/);
    if (m) pa = parseInt(m[2]) * 10;
    else if (code === 'BR' || code === 'D0' || code === 'D1' || code === 'NT') pa = 0;
  }

  // Taper PA
  let effectivePA = pa;
  if (pa > 0 && adjustedNetIncome > THRESHOLDS.parapetThreshold) {
    effectivePA = Math.max(0, pa - (adjustedNetIncome - THRESHOLDS.parapetThreshold) / 2);
  }

  const taxableIncome = Math.max(0, adjustedNetIncome - effectivePA);

  // Income tax with band tracking
  const allBands = scotland ? SCOTLAND_BANDS : RUK_BANDS;
  let remaining = taxableIncome;
  let incomeTax = 0;
  const bands: TaxResult['bands'] = [];
  for (const b of allBands) {
    if (remaining <= 0) break;
    const width = b.to === Infinity ? remaining : Math.min(remaining, b.to - b.from);
    const slice = Math.min(remaining, width);
    const tax = slice * b.rate;
    incomeTax += tax;
    if (slice > 0) bands.push({ name: b.name, income: slice, tax, rate: b.rate });
    remaining -= slice;
  }

  // NI
  const niBase = Math.max(0, gross - (pensionReducesNI ? pensionAmount : 0));
  let ni = 0;
  let niRate = niCategory === 'B' ? 0.0585 : niCategory === 'C' ? 0 : 0.08;
  if (niBase > THRESHOLDS.niPrimaryThreshold) {
    const mainBand = Math.min(niBase - THRESHOLDS.niPrimaryThreshold, THRESHOLDS.niUpperEarningsLimit - THRESHOLDS.niPrimaryThreshold);
    ni += mainBand * niRate;
    if (niBase > THRESHOLDS.niUpperEarningsLimit) {
      ni += (niBase - THRESHOLDS.niUpperEarningsLimit) * 0.02;
    }
  }

  // Student loan
  let sl = 0;
  if (studentLoan !== 'none' && STUDENT_LOAN_PLANS[studentLoan]) {
    const plan = STUDENT_LOAN_PLANS[studentLoan];
    if (gross > plan.threshold) sl += (gross - plan.threshold) * plan.rate;
  }
  if (postgradLoan && gross > STUDENT_LOAN_PLANS.postgrad.threshold) {
    sl += (gross - STUDENT_LOAN_PLANS.postgrad.threshold) * STUDENT_LOAN_PLANS.postgrad.rate;
  }

  // HICBC
  let hicbc = 0;
  if (children > 0 && adjustedNetIncome > THRESHOLDS.hicbcLower) {
    const excess = adjustedNetIncome - THRESHOLDS.hicbcLower;
    const rate = Math.min(1, excess / (THRESHOLDS.hicbcUpper - THRESHOLDS.hicbcLower));
    const cbTotal = THRESHOLDS.cbFirstChild + Math.max(0, children - 1) * THRESHOLDS.cbAdditionalChild;
    hicbc = cbTotal * rate;
  }

  const net = Math.max(0, gross - incomeTax - ni - pensionAmount - sl - hicbc);
  const effectiveRate = gross > 0 ? (gross - net) / gross : 0;

  // Marginal rate at current salary
  const marginalBand = bands[bands.length - 1];
  const slRate = studentLoan !== 'none' ? 0.09 : 0;
  const pgRate = postgradLoan ? 0.06 : 0;
  const niMarginal = gross < THRESHOLDS.niUpperEarningsLimit ? niRate : 0.02;
  const marginalRate = (marginalBand?.rate ?? 0) + (pensionReducesNI ? 0 : niMarginal) + slRate + pgRate;

  return {
    gross,
    adjustedNetIncome,
    personalAllowance: effectivePA,
    taxableIncome,
    incomeTax,
    ni,
    pension: pensionAmount,
    studentLoan: sl,
    hicbc,
    net,
    effectiveRate,
    marginalRate,
    bands,
    inHicbcTrap: adjustedNetIncome > THRESHOLDS.hicbcLower && adjustedNetIncome < THRESHOLDS.hicbcUpper && children > 0,
    inPaTaper: adjustedNetIncome > THRESHOLDS.parapetThreshold && adjustedNetIncome < THRESHOLDS.additionalRateThreshold,
    in40pctBand: taxableIncome > THRESHOLDS.basicRateLimit,
    in45pctBand: adjustedNetIncome > THRESHOLDS.additionalRateThreshold,
    nearHicbc: adjustedNetIncome > 55000 && adjustedNetIncome < THRESHOLDS.hicbcLower && children > 0,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export const gbp = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

export const pct = (n: number, dp = 1) => `${(n * 100).toFixed(dp)}%`;

export function calcStudentLoanProjection(
  currentSalary: number,
  balance: number,
  plan: 'plan1' | 'plan2' | 'plan4' | 'plan5',
  annualGrowthRate = 0.025
): { yearsToClear: number; totalRepaid: number; writeOffAmount: number; writeOffYear: number; monthly: number } {
  const config = STUDENT_LOAN_PLANS[plan];
  const writeOffYear = config.writeOff;
  let bal = balance;
  let totalRepaid = 0;
  let year = 0;
  const interestRate = plan === 'plan1' ? 0.015 : plan === 'plan4' ? 0.015 : plan === 'plan5' ? 0.03 : 0.05;

  while (bal > 0 && year < writeOffYear) {
    year++;
    const sal = currentSalary * Math.pow(1 + annualGrowthRate, year - 1);
    const annual = sal > config.threshold ? (sal - config.threshold) * config.rate : 0;
    const interest = bal * interestRate;
    bal = bal + interest - annual;
    totalRepaid += Math.min(annual, bal + annual);
    if (bal <= 0) { bal = 0; break; }
  }

  const monthlyRepayment = currentSalary > config.threshold
    ? ((currentSalary - config.threshold) * config.rate) / 12
    : 0;

  return {
    yearsToClear: bal <= 0 ? year : -1,
    totalRepaid,
    writeOffAmount: Math.max(0, bal),
    writeOffYear,
    monthly: monthlyRepayment,
  };
}

// Contractor take-home calculator
export interface ContractorResult {
  label: string;
  gross: number;
  tax: number;
  ni: number;
  net: number;
  effectiveRate: number;
  color: string;
}

export function calcContractorComparison(
  dailyRate: number,
  workingDays = 220
): ContractorResult[] {
  const annualContract = dailyRate * workingDays;

  // Outside IR35, Ltd company, salary £12,570 + dividends
  const corpTaxRate = annualContract > 50000 ? 0.25 : 0.19;
  const outDirectorSalary = 12570;
  const outRevenue = annualContract;
  const outCorpTax = (outRevenue - outDirectorSalary) * corpTaxRate;
  const outProfit = outRevenue - outDirectorSalary - outCorpTax;
  const outDivTax = Math.max(0, outProfit - 500) > THRESHOLDS.basicRateLimit
    ? 500 * 0 + THRESHOLDS.basicRateLimit * 0.0875 + Math.max(0, outProfit - 500 - THRESHOLDS.basicRateLimit) * 0.3375
    : Math.max(0, outProfit - 500) * 0.0875;
  const outNet = outProfit - outDivTax + outDirectorSalary;
  const outTotalTax = outCorpTax + outDivTax;

  // Inside IR35, umbrella/deemed salary
  const insideGross = annualContract * 0.85; // 15% employer costs
  const insideTax = calcTax({ salary: insideGross });
  const insideNet = insideTax.net;

  // Permanent employee equivalent
  const permSalary = annualContract * 0.7; // typical perm is 70% of day rate annualised
  const permTax = calcTax({ salary: permSalary });
  const permNet = permTax.net;

  return [
    {
      label: 'Outside IR35 (Ltd)',
      gross: annualContract,
      tax: outTotalTax,
      ni: 0,
      net: outNet,
      effectiveRate: outTotalTax / annualContract,
      color: '#4f46e5',
    },
    {
      label: 'Inside IR35 (Umbrella)',
      gross: annualContract,
      tax: insideTax.incomeTax,
      ni: insideTax.ni,
      net: insideNet,
      effectiveRate: (insideTax.incomeTax + insideTax.ni) / annualContract,
      color: '#f97316',
    },
    {
      label: 'Permanent Employee',
      gross: permSalary,
      tax: permTax.incomeTax,
      ni: permTax.ni,
      net: permNet,
      effectiveRate: (permTax.incomeTax + permTax.ni) / permSalary,
      color: '#10b981',
    },
  ];
}

// ── Self Employed Tax & Payments on Account ────────────────────────────────────
export interface SelfEmployedResult {
  revenue: number;
  expenses: number;
  netProfit: number;
  class4Ni: number;
  class2Ni: number;
  incomeTax: number;
  totalTaxAndNi: number;
  netIncome: number;
  janPayment: number;
  julyPayment: number;
  nextJanPayment: number;
  cashReserveMonthly: number;
}

export function calcSelfEmployedTax(revenue: number, expenses: number, scotland = false): SelfEmployedResult {
  const netProfit = Math.max(0, revenue - expenses);
  const taxResult = calcTax({ salary: netProfit, scotland });
  
  let class4Ni = 0;
  if (netProfit > 12570) {
    const mainBand = Math.min(netProfit - 12570, 50270 - 12570);
    class4Ni += mainBand * 0.06;
    if (netProfit > 50270) {
      class4Ni += (netProfit - 50270) * 0.02;
    }
  }

  const totalTaxAndNi = taxResult.incomeTax + class4Ni;
  const netIncome = netProfit - totalTaxAndNi;

  const poaRequired = totalTaxAndNi >= 1000;
  const balancingPayment = totalTaxAndNi;
  const poaEach = poaRequired ? totalTaxAndNi * 0.5 : 0;

  const janPayment = balancingPayment + poaEach;
  const julyPayment = poaEach;
  const nextJanPayment = balancingPayment + poaEach;

  const cashReserveMonthly = (totalTaxAndNi * 1.15) / 12;

  return {
    revenue,
    expenses,
    netProfit,
    class4Ni,
    class2Ni: 0,
    incomeTax: taxResult.incomeTax,
    totalTaxAndNi,
    netIncome,
    janPayment,
    julyPayment,
    nextJanPayment,
    cashReserveMonthly,
  };
}

// ── Director Salary vs Dividend Optimiser ──────────────────────────────────────
export interface DirectorOptimisationResult {
  revenue: number;
  salary: number;
  dividend: number;
  corpTax: number;
  personalTax: number;
  totalTax: number;
  netTakeHome: number;
  corpTaxRate: number;
  optimalSplit: boolean;
}

export function calcDirectorOptimisation(revenue: number, salary: number): DirectorOptimisationResult {
  const taxableProfitForCorp = Math.max(0, revenue - salary);
  
  let corpTax = 0;
  if (taxableProfitForCorp <= 50000) {
    corpTax = taxableProfitForCorp * 0.19;
  } else if (taxableProfitForCorp <= 250000) {
    corpTax = 50000 * 0.19 + (taxableProfitForCorp - 50000) * 0.265;
  } else {
    corpTax = taxableProfitForCorp * 0.25;
  }

  const profitAfterTax = Math.max(0, taxableProfitForCorp - corpTax);
  const dividend = profitAfterTax; 

  const salTaxResult = calcTax({ salary });
  const personalIncome = salary + dividend;
  
  let pa = 12570;
  if (personalIncome > 100000) {
    pa = Math.max(0, 12570 - (personalIncome - 100000) / 2);
  }

  const unusedPA = Math.max(0, pa - salary);
  let remainingDiv = dividend;
  let divTax = 0;

  if (unusedPA > 0) {
    const slice = Math.min(remainingDiv, unusedPA);
    remainingDiv -= slice;
  }

  if (remainingDiv > 0) {
    const allowanceSlice = Math.min(remainingDiv, 500);
    remainingDiv -= allowanceSlice;
  }

  if (remainingDiv > 0) {
    const currentTaxableSalary = Math.max(0, salary - pa);
    const basicRateRemaining = Math.max(0, 37700 - currentTaxableSalary);

    if (basicRateRemaining > 0) {
      const basicSlice = Math.min(remainingDiv, basicRateRemaining);
      divTax += basicSlice * 0.0875;
      remainingDiv -= basicSlice;
    }
    
    if (remainingDiv > 0) {
      const higherRateLimit = 125140 - Math.max(pa, salary);
      const higherRateRemaining = Math.max(0, higherRateLimit);
      const higherSlice = Math.min(remainingDiv, higherRateRemaining);
      divTax += higherSlice * 0.3375;
      remainingDiv -= higherSlice;
      
      if (remainingDiv > 0) {
        divTax += remainingDiv * 0.3935;
      }
    }
  }

  const personalTax = salTaxResult.incomeTax + salTaxResult.ni + divTax;
  const totalTax = corpTax + personalTax;
  const netTakeHome = salary + dividend - personalTax;

  const corpTaxRate = taxableProfitForCorp > 0 ? corpTax / taxableProfitForCorp : 0.19;
  const optimalSplit = Math.abs(salary - 12570) <= 100 || Math.abs(salary - 9100) <= 100;

  return {
    revenue,
    salary,
    dividend,
    corpTax,
    personalTax,
    totalTax,
    netTakeHome,
    corpTaxRate,
    optimalSplit,
  };
}

// ── EV Salary Sacrifice Calculator ─────────────────────────────────────────────
export interface EvSalarySacrificeResult {
  salary: number;
  leaseCostMonthly: number;
  pensionPct: number;
  bikRate: number;
  netCostSalarySacrifice: number;
  netCostPersonalLease: number;
  monthlySavings: number;
  annualSavings: number;
  fiveYearSavings: number;
}

export function calcEvSalarySacrifice(
  salary: number,
  leaseCostMonthly: number,
  bikRate = 0.02,
  carListPrice = 45000
): EvSalarySacrificeResult {
  const grossAnnualLease = leaseCostMonthly * 12;
  const baseResult = calcTax({ salary });
  const sacResult = calcTax({ salary: Math.max(0, salary - grossAnnualLease) });

  const marginalRate = baseResult.marginalRate;
  const annualBikTax = carListPrice * bikRate * marginalRate;

  const netCostSalarySacrifice = (baseResult.net - sacResult.net) + annualBikTax;
  const netCostPersonalLease = grossAnnualLease;

  const annualSavings = Math.max(0, netCostPersonalLease - netCostSalarySacrifice);
  const monthlySavings = annualSavings / 12;
  const fiveYearSavings = annualSavings * 5;

  return {
    salary,
    leaseCostMonthly,
    pensionPct: 5,
    bikRate,
    netCostSalarySacrifice: netCostSalarySacrifice / 12,
    netCostPersonalLease: netCostPersonalLease / 12,
    monthlySavings,
    annualSavings,
    fiveYearSavings,
  };
}

