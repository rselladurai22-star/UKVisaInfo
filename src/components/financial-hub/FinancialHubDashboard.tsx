'use client';

import { useState, useMemo } from 'react';
import {
  Wallet, Percent, FileText, PiggyBank, TrendingUp, Landmark, Car,
  UserCheck, ShieldCheck, Scale, Compass, Coins, Users, Activity,
  Briefcase, GraduationCap, MapPin, Sparkles, ChevronRight, AlertTriangle, ArrowRight,
  TrendingDown, Globe, Heart, Shield, Star, Clock, Gift, Target, BookOpen, Key
} from 'lucide-react';
import s from './financial-hub.module.css';

// Formatter Helpers
const gbp = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default function FinancialHubDashboard() {
  // Navigation Tabs for 14 Financial Hubs
  const [activeTool, setActiveTool] = useState<string>('take-home');

  /* ──────────────────────────────────────────────────────────
     GLOBAL / LINKED STATE VARIABLES
     ────────────────────────────────────────────────────────── */
  const [salary, setSalary] = useState<number>(55000);
  const [bonus, setBonus] = useState<number>(0);
  const [commission, setCommission] = useState<number>(0);
  const [overtime, setOvertime] = useState<number>(0);
  
  const [pensionVal, setPensionVal] = useState<number>(5);
  const [pensionRelief, setPensionRelief] = useState<string>('salary_sacrifice');
  const [studentLoan, setStudentLoan] = useState<string>('none');
  const [postgradLoan, setPostgradLoan] = useState<boolean>(false);
  const [taxCode, setTaxCode] = useState<string>('1257L');
  const [niCategory, setNiCategory] = useState<string>('A');
  const [scotland, setScotland] = useState<boolean>(false);
  
  // Advanced variables checklist toggles
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // 1. Take-Home Unique Simulator States
  const [targetRaise, setTargetRaise] = useState<number>(5000);
  const [taxYear, setTaxYear] = useState<string>('2026/27');

  // 2. VAT Calculator States
  const [vatAmount, setVatAmount] = useState<number>(100);
  const [vatRate, setVatRate] = useState<number>(20);
  const [vatMode, setVatMode] = useState<'add' | 'remove'>('add');

  // 3. Tax Code Decoder States
  const [decodeInput, setDecodeInput] = useState<string>('1257L');

  // 4. Dividend Tax States
  const [dividendAmount, setDividendAmount] = useState<number>(25000);

  // 5. Capital Gains Tax States
  const [cgtAssetCost, setCgtAssetCost] = useState<number>(20000);
  const [cgtSalePrice, setCgtSalePrice] = useState<number>(35000);
  const [cgtIsProperty, setCgtIsProperty] = useState<boolean>(false);

  // 6. Inheritance Tax States
  const [estateValue, setEstateValue] = useState<number>(650000);
  const [giftTrackerValue, setGiftTrackerValue] = useState<number>(50000);

  // 7. Company Car Tax States
  const [carListPrice, setCarListPrice] = useState<number>(38000);
  const [carCo2, setCarCo2] = useState<number>(0); // 0 = EV
  const [cashAllowanceOpt, setCashAllowanceOpt] = useState<number>(5000);

  // 8. Self Assessment States
  const [saTradingProfit, setSaTradingProfit] = useState<number>(15000);
  const [saExpenses, setSaExpenses] = useState<number>(2000);

  // 9. Salary Comparison States
  const [salaryB, setSalaryB] = useState<number>(65000);

  // 10. Net Worth Hub States
  const [nwProperty, setNwProperty] = useState<number>(350000);
  const [nwSavings, setNwSavings] = useState<number>(45000);
  const [nwInvestments, setNwInvestments] = useState<number>(60000);
  const [nwPensionPot, setNwPensionPot] = useState<number>(85000);
  const [nwDebts, setNwDebts] = useState<number>(180000);

  // 11. Pension Intelligence States
  const [annualContribution, setAnnualContribution] = useState<number>(10000);

  // 12. Property Tax States
  const [propertyPrice, setPropertyPrice] = useState<number>(280000);
  const [rentalIncome, setRentalIncome] = useState<number>(1200);

  // 13. Family Tax States
  const [partnerSalary, setPartnerSalary] = useState<number>(30000);
  const [childBenefitClaims, setChildBenefitClaims] = useState<number>(2);

  // Reference Table of Contents Anchor State
  const [activeChapter, setActiveChapter] = useState<string>('intro');

  /* ──────────────────────────────────────────────────────────
     CALCULATION LOGICS
     ────────────────────────────────────────────────────────── */

  // 1. Take-Home Calculator Logic
  const takeHomeResults = useMemo(() => {
    const totalCashGross = salary + bonus + commission + overtime;
    
    // Pension contribution (Employee slice)
    const pensionDeduction = totalCashGross * (pensionVal / 100);
    
    // Sacrifices
    let pensionTaxDeductible = 0;
    let pensionNiDeductible = 0;
    if (pensionRelief === 'salary_sacrifice') {
      pensionTaxDeductible = pensionDeduction;
      pensionNiDeductible = pensionDeduction;
    } else if (pensionRelief === 'net_pay') {
      pensionTaxDeductible = pensionDeduction;
    }

    const adjustedNetIncome = Math.max(0, totalCashGross - pensionTaxDeductible);

    // Personal Allowance taper calculation
    let initialAllowance = 12570;
    if (taxCode.toUpperCase().startsWith('K')) {
      const kVal = parseInt(taxCode.replace(/[^0-9]/g, '')) || 0;
      initialAllowance = -kVal * 10;
    } else {
      const match = taxCode.match(/^([S|C]?)([0-9]+)([L|T|V|Y])$/i);
      if (match) {
        initialAllowance = (parseInt(match[2]) || 1257) * 10;
      }
    }

    let taperAllowance = initialAllowance;
    if (initialAllowance > 0 && adjustedNetIncome > 100000) {
      taperAllowance = Math.max(0, initialAllowance - (adjustedNetIncome - 100000) / 2);
    }

    // Income tax
    let taxablePay = Math.max(0, adjustedNetIncome - taperAllowance);
    let incomeTax = 0;
    if (scotland) {
      const bands = [
        { limit: 2306, rate: 0.19 },
        { limit: 13997, rate: 0.20 },
        { limit: 31007, rate: 0.21 },
        { limit: 125000, rate: 0.42 },
        { limit: 150000, rate: 0.45 },
        { limit: Infinity, rate: 0.48 }
      ];
      let remaining = taxablePay;
      let prevLimit = 0;
      for (const b of bands) {
        if (remaining <= 0) break;
        const width = b.limit === Infinity ? Infinity : b.limit - prevLimit;
        const slice = Math.min(remaining, width);
        incomeTax += slice * b.rate;
        remaining -= slice;
        prevLimit = b.limit;
      }
    } else {
      const bands = [
        { limit: 37700, rate: 0.20 },
        { limit: 112570, rate: 0.40 }, // rUK higher band above standard PA
        { limit: Infinity, rate: 0.45 }
      ];
      let remaining = taxablePay;
      for (const b of bands) {
        if (remaining <= 0) break;
        const slice = Math.min(remaining, b.limit);
        incomeTax += slice * b.rate;
        remaining -= slice;
      }
    }

    // National Insurance
    const niBase = Math.max(0, totalCashGross - pensionNiDeductible);
    let ni = 0;
    const pt = 12570;
    const uel = 50270;
    let niRate = 0.08;
    if (niCategory === 'B') niRate = 0.0585;
    else if (niCategory === 'C') niRate = 0;

    if (niBase > pt) {
      const mainBand = Math.min(niBase - pt, uel - pt);
      ni += mainBand * niRate;
      if (niBase > uel) {
        ni += (niBase - uel) * 0.02;
      }
    }

    // Student Loans
    let sl = 0;
    if (studentLoan === 'plan1' && totalCashGross > 26065) sl += (totalCashGross - 26065) * 0.09;
    else if (studentLoan === 'plan2' && totalCashGross > 28470) sl += (totalCashGross - 28470) * 0.09;
    else if (studentLoan === 'plan4' && totalCashGross > 32745) sl += (totalCashGross - 32745) * 0.09;
    else if (studentLoan === 'plan5' && totalCashGross > 25000) sl += (totalCashGross - 25000) * 0.09;

    if (postgradLoan && totalCashGross > 21000) sl += (totalCashGross - 21000) * 0.06;

    // HICBC Child Benefit Clawback
    let hicbc = 0;
    if (adjustedNetIncome > 60000) {
      const excess = adjustedNetIncome - 60000;
      const rate = Math.min(1.0, excess / 20000);
      const cbReceived = childBenefitClaims === 1 ? 1331.20 : 1331.20 + (childBenefitClaims - 1) * 881.40;
      hicbc = cbReceived * rate;
    }

    const net = Math.max(0, totalCashGross - incomeTax - ni - pensionDeduction - sl - hicbc);
    
    // Cliff warnings flags
    const allowanceTaperAlert = adjustedNetIncome > 100000 && adjustedNetIncome < 125140;
    const hicbcAlert = adjustedNetIncome > 60000 && adjustedNetIncome < 80000;

    return {
      gross: totalCashGross,
      net,
      incomeTax,
      ni,
      pension: pensionDeduction,
      studentLoan: sl,
      hicbc,
      adjustedNetIncome,
      allowanceTaperAlert,
      hicbcAlert
    };
  }, [salary, bonus, commission, overtime, pensionVal, pensionRelief, studentLoan, postgradLoan, taxCode, niCategory, scotland, childBenefitClaims]);

  // Promotion Simulator Result
  const promoResults = useMemo(() => {
    const currentNet = takeHomeResults.net;
    const futureGross = salary + targetRaise;
    
    // Pension contribution (Employee slice)
    const pensionDeduction = futureGross * (pensionVal / 100);
    
    // Sacrifices
    let pensionTaxDeductible = 0;
    if (pensionRelief === 'salary_sacrifice' || pensionRelief === 'net_pay') {
      pensionTaxDeductible = pensionDeduction;
    }
    const adjustedNetIncome = Math.max(0, futureGross - pensionTaxDeductible);

    let initialAllowance = 12570;
    let taperAllowance = initialAllowance;
    if (initialAllowance > 0 && adjustedNetIncome > 100000) {
      taperAllowance = Math.max(0, initialAllowance - (adjustedNetIncome - 100000) / 2);
    }

    let taxablePay = Math.max(0, adjustedNetIncome - taperAllowance);
    let incomeTax = 0;
    if (scotland) {
      const bands = [
        { limit: 2306, rate: 0.19 },
        { limit: 13997, rate: 0.20 },
        { limit: 31007, rate: 0.21 },
        { limit: 125000, rate: 0.42 },
        { limit: 150000, rate: 0.45 },
        { limit: Infinity, rate: 0.48 }
      ];
      let remaining = taxablePay;
      let prevLimit = 0;
      for (const b of bands) {
        if (remaining <= 0) break;
        const width = b.limit === Infinity ? Infinity : b.limit - prevLimit;
        const slice = Math.min(remaining, width);
        incomeTax += slice * b.rate;
        remaining -= slice;
        prevLimit = b.limit;
      }
    } else {
      const bands = [
        { limit: 37700, rate: 0.20 },
        { limit: 112570, rate: 0.40 },
        { limit: Infinity, rate: 0.45 }
      ];
      let remaining = taxablePay;
      for (const b of bands) {
        if (remaining <= 0) break;
        const slice = Math.min(remaining, b.limit);
        incomeTax += slice * b.rate;
        remaining -= slice;
      }
    }

    let ni = 0;
    const pt = 12570;
    const uel = 50270;
    let niRate = 0.08;
    if (niCategory === 'B') niRate = 0.0585;
    else if (niCategory === 'C') niRate = 0;

    const niBase = Math.max(0, futureGross - (pensionRelief === 'salary_sacrifice' ? pensionDeduction : 0));
    if (niBase > pt) {
      const mainBand = Math.min(niBase - pt, uel - pt);
      ni += mainBand * niRate;
      if (niBase > uel) {
        ni += (niBase - uel) * 0.02;
      }
    }

    let sl = 0;
    if (studentLoan === 'plan1' && futureGross > 26065) sl += (futureGross - 26065) * 0.09;
    else if (studentLoan === 'plan2' && futureGross > 28470) sl += (futureGross - 28470) * 0.09;
    else if (studentLoan === 'plan4' && futureGross > 32745) sl += (futureGross - 32745) * 0.09;
    else if (studentLoan === 'plan5' && futureGross > 25000) sl += (futureGross - 25000) * 0.09;

    let hicbc = 0;
    if (adjustedNetIncome > 60000) {
      const excess = adjustedNetIncome - 60000;
      const rate = Math.min(1.0, excess / 20000);
      const cbReceived = childBenefitClaims === 1 ? 1331.20 : 1331.20 + (childBenefitClaims - 1) * 881.40;
      hicbc = cbReceived * rate;
    }

    const futureNet = Math.max(0, futureGross - incomeTax - ni - pensionDeduction - sl - hicbc);
    const netGain = futureNet - currentNet;
    const marginalRateOnRaise = 1 - (netGain / targetRaise);

    return {
      futureNet,
      netGain,
      marginalRateOnRaise
    };
  }, [salary, targetRaise, pensionVal, pensionRelief, studentLoan, postgradLoan, taxCode, niCategory, scotland, takeHomeResults.net, childBenefitClaims]);

  // 2. VAT Calculator Logic
  const vatResults = useMemo(() => {
    let vatPart = 0;
    let netVal = 0;
    let grossVal = 0;
    const rateFactor = vatRate / 100;
    
    if (vatMode === 'add') {
      netVal = vatAmount;
      vatPart = vatAmount * rateFactor;
      grossVal = vatAmount + vatPart;
    } else {
      grossVal = vatAmount;
      netVal = vatAmount / (1 + rateFactor);
      vatPart = grossVal - netVal;
    }

    // Mistake detector / Suspicous VAT check
    const auditWarning = vatRate !== 20 && vatRate !== 5 && vatRate !== 0;

    return {
      net: netVal,
      vat: vatPart,
      gross: grossVal,
      auditWarning
    };
  }, [vatAmount, vatRate, vatMode]);

  // 3. Tax Code Decoder Logic
  const decoderResults = useMemo(() => {
    const code = decodeInput.trim().toUpperCase();
    let allowance = 12570;
    let explanation = '';
    let refundScore = 85; // Default safe probability
    let overpaymentRisk = false;

    if (code === 'BR') {
      allowance = 0;
      explanation = 'Basic Rate (Flat 20%) applied. All income from this employment is taxed at 20% with zero tax-free allowance. Typically used for a second job.';
      refundScore = 40;
      overpaymentRisk = true;
    } else if (code === 'D0') {
      allowance = 0;
      explanation = 'Higher Rate (Flat 40%) applied. All income from this employment is taxed at 40% with zero tax-free allowance. Typically used for secondary jobs for higher-rate taxpayers.';
      refundScore = 30;
      overpaymentRisk = true;
    } else if (code.startsWith('K')) {
      const num = parseInt(code.slice(1)) || 0;
      allowance = -num * 10;
      explanation = `K Code (Negative allowance) applied. You have taxable company benefits (like health cover or company cars) exceeding your standard allowance. HMRC has added £${Math.abs(allowance).toLocaleString()} to your taxable income base.`;
      refundScore = 60;
    } else {
      const match = code.match(/^([C|S]?)([0-9]+)([L|T|V|Y])$/);
      if (match) {
        const num = parseInt(match[2]) || 1257;
        allowance = num * 10;
        const letter = match[3];
        const prefix = match[1];
        let reg = 'England & Northern Ireland';
        if (prefix === 'S') reg = 'Scotland';
        if (prefix === 'C') reg = 'Wales';

        explanation = `Standard progressive tax code representing £${allowance.toLocaleString()} of tax-free personal allowance in ${reg}. Suffix ${letter} indicates HMRC standard rules apply.`;
      } else {
        explanation = 'Unknown or custom tax code. We default to the standard 1257L allowance of £12,570.';
        overpaymentRisk = true;
      }
    }

    return {
      allowance,
      explanation,
      refundScore,
      overpaymentRisk
    };
  }, [decodeInput]);

  // 4. Dividend Tax Logic
  const dividendResults = useMemo(() => {
    // Basic director salary optimization split:
    // Optimal split is £12,570 salary (0% tax & 0% NI, while building pension stamp).
    // The rest is paid as dividends.
    const optimalSalary = 12570;
    const extraDividends = Math.max(0, dividendAmount - optimalSalary);

    // Dividend Tax: £500 tax free allowance in 2026/27, then taxed at 8.75% (Basic), 33.75% (Higher), 39.35% (Additional)
    let divTaxable = Math.max(0, extraDividends - 500);
    let divTax = 0;

    // Standard rUK tax threshold splits (Assuming standard PA £12,570 is fully used by salary)
    const basicLimit = 37700;
    const higherLimit = 125140 - 12570;

    if (divTaxable > 0) {
      const basicBand = Math.min(divTaxable, basicLimit);
      divTax += basicBand * 0.0875;
      
      if (divTaxable > basicLimit) {
        const higherBand = Math.min(divTaxable - basicLimit, higherLimit - basicLimit);
        divTax += higherBand * 0.3375;
        
        if (divTaxable > higherLimit) {
          divTax += (divTaxable - higherLimit) * 0.3935;
        }
      }
    }

    const netDividend = dividendAmount - divTax;

    return {
      optimalSalary,
      dividends: extraDividends,
      tax: divTax,
      net: netDividend
    };
  }, [dividendAmount]);

  // 5. Capital Gains Tax Logic
  const cgtResults = useMemo(() => {
    const grossGain = Math.max(0, cgtSalePrice - cgtAssetCost);
    // 2026/27 annual exempt allowance is £3,000
    const taxableGain = Math.max(0, grossGain - 3000);
    
    // CGT rate: Property is 18% (Basic) / 24% (Higher), Assets is 10% / 20%
    const rate = cgtIsProperty ? 0.24 : 0.20; // Defaulting to Higher rate scale for high-end planning
    const tax = taxableGain * rate;
    const netGain = grossGain - tax;

    return {
      gain: grossGain,
      allowance: 3000,
      tax,
      net: netGain
    };
  }, [cgtAssetCost, cgtSalePrice, cgtIsProperty]);

  // 6. Inheritance Tax Logic
  const ihtResults = useMemo(() => {
    // Nil rate band £325,000. Assuming standard residential allowance of £175,000 is claimed
    const threshold = 325000 + 175000;
    const taxableEstate = Math.max(0, estateValue - threshold);
    const tax = taxableEstate * 0.40; // 40% IHT rate
    const netEstate = estateValue - tax;

    return {
      threshold,
      taxable: taxableEstate,
      tax,
      net: netEstate
    };
  }, [estateValue]);

  // 7. Company Car Tax Logic
  const carResults = useMemo(() => {
    // EV = 2% BIK rate, Hybrid/Diesel/Petrol = ranges from 15% to 37% depending on CO2
    const bikRate = carCo2 === 0 ? 0.02 : Math.min(0.37, 0.15 + (carCo2 / 10) * 0.02);
    const bikValue = carListPrice * bikRate;
    // BIK Tax paid by employee (assuming 40% tax rate)
    const employeeBikTax = bikValue * 0.40;

    // EV vs Cash Allowance optimizer:
    // If Cash Allowance is £5,000, net allowance after 40% tax & 8% NI is £2,600
    // Net BIK impact is -employeeBikTax.
    const netCashAlternative = cashAllowanceOpt * 0.52;
    const evBenefitScore = netCashAlternative - employeeBikTax;

    return {
      bikRate,
      bikValue,
      taxCost: employeeBikTax,
      evBenefitScore
    };
  }, [carListPrice, carCo2, cashAllowanceOpt]);

  // 8. Self Assessment Logic
  const saResults = useMemo(() => {
    const grossIncome = saTradingProfit - saExpenses;
    const pa = 12570;
    const taxable = Math.max(0, grossIncome - pa);
    
    // Tax 20%
    const tax = taxable * 0.20;
    // Class 4 NI 6% (PT £12,570)
    let ni4 = 0;
    if (grossIncome > 12570) {
      ni4 = Math.min(grossIncome - 12570, 50270 - 12570) * 0.06;
    }

    const totalSA = tax + ni4;
    // Payments on Account is 50% of the total SA bill for next year
    const poa = totalSA * 0.50;

    const riskScore = saExpenses / (saTradingProfit || 1) > 0.40 ? 'Moderate' : 'Low';

    return {
      netProfit: grossIncome,
      tax,
      ni4,
      totalBill: totalSA,
      poa,
      riskScore
    };
  }, [saTradingProfit, saExpenses]);

  // 9. Salary Comparison Logic
  const salaryCompareResults = useMemo(() => {
    const netA = takeHomeResults.net;
    
    // Calculate for B
    const totalCashGross = salaryB;
    const pensionDeduction = totalCashGross * (pensionVal / 100);
    const adjustedNetIncome = Math.max(0, totalCashGross - (pensionRelief === 'salary_sacrifice' ? pensionDeduction : 0));
    
    let pa = 12570;
    if (adjustedNetIncome > 100000) {
      pa = Math.max(0, 12570 - (adjustedNetIncome - 100000) / 2);
    }
    const taxable = Math.max(0, adjustedNetIncome - pa);
    const tax = taxable * 0.20; // Simplified Basic Rate mapping for comparative speed

    let ni = 0;
    if (totalCashGross > 12570) {
      ni = Math.min(totalCashGross - 12570, 50270 - 12570) * 0.08;
    }

    const netB = totalCashGross - tax - ni - pensionDeduction;

    const diff = netB - netA;
    const lifetimeMultiplier = diff * 30; // 30 year career estimate

    return {
      netA,
      netB,
      diff,
      lifetimeMultiplier
    };
  }, [salary, salaryB, pensionVal, pensionRelief, takeHomeResults.net]);

  // 10. Net Worth & FIRE Logic
  const netWorthResults = useMemo(() => {
    const totalAssets = nwProperty + nwSavings + nwInvestments + nwPensionPot;
    const netWorth = totalAssets - nwDebts;
    
    // FIRE (Financial Independence Retire Early) Target = 25x Annual Expenses.
    // Assuming a standard UK annual expense budget of £35,000
    const fireTarget = 35000 * 25;
    const percentageToFIRE = Math.min(1.0, netWorth / fireTarget);

    // Retirement Age estimate: assuming 5% net real growth on investments + £1,000/mo savings
    const remainingToFIRE = fireTarget - netWorth;
    const yearsToFIRE = remainingToFIRE <= 0 ? 0 : Math.min(45, remainingToFIRE / (12000 + totalAssets * 0.05));

    return {
      netWorth,
      fireTarget,
      percentageToFIRE,
      yearsToFIRE
    };
  }, [nwProperty, nwSavings, nwInvestments, nwPensionPot, nwDebts]);

  // 11. Pension Intelligence Logic
  const pensionResults = useMemo(() => {
    // 20% basic rate tax relief top up
    const taxReliefTopUp = annualContribution * 0.25; 
    const totalAdded = annualContribution + taxReliefTopUp;
    
    // Annual Allowance limit (£60,000 standard)
    const limitRisk = annualContribution > 60000;

    return {
      topUp: taxReliefTopUp,
      totalAdded,
      limitRisk
    };
  }, [annualContribution]);

  // 12. Property Tax Logic
  const propertyResults = useMemo(() => {
    // SDLT on £280k:
    // £0-£250k: 0%, £250k-£925k: 5%
    let sdlt = 0;
    if (propertyPrice > 250000) {
      sdlt = (propertyPrice - 250000) * 0.05;
    }

    // Rental Yield
    const annualRent = rentalIncome * 12;
    const grossYield = (annualRent / (propertyPrice || 1));

    return {
      sdlt,
      grossYield
    };
  }, [propertyPrice, rentalIncome]);

  // 13. Family Tax Logic
  const familyResults = useMemo(() => {
    // Marriage Allowance Transfer: £1,260 from lower earner to higher earner. Saves flat £252
    const canClaimMarriageAllowance = (salary < 12570 && partnerSalary > 12570) || (partnerSalary < 12570 && salary > 12570);
    
    // Child benefit clawback alert
    const highIncomeClawback = Math.max(salary, partnerSalary) > 60000;

    return {
      canClaimMarriageAllowance,
      highIncomeClawback
    };
  }, [salary, partnerSalary]);

  // Scroll to anchor sections helper
  const scrollToChapter = (id: string) => {
    setActiveChapter(id);
    const element = document.getElementById(`ref-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={s.container}>
      
      {/* LEFT COLUMN: 14 HUBS SIDEBAR NAVIGATION */}
      <aside className={s.sidebar}>
        <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '8px', paddingLeft: '14px' }}>
          Calculators Suite
        </div>
        
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'take-home' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('take-home')}>
          <Wallet size={15} /> 1. Take-Home Pay
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'vat' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('vat')}>
          <Percent size={15} /> 2. VAT Calculator
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'tax-code' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('tax-code')}>
          <FileText size={15} /> 3. Tax Code Decoder
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'dividend' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('dividend')}>
          <PiggyBank size={15} /> 4. Dividend Tax
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'cgt' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('cgt')}>
          <TrendingUp size={15} /> 5. Capital Gains Tax
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'iht' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('iht')}>
          <Landmark size={15} /> 6. Inheritance Tax
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'car-tax' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('car-tax')}>
          <Car size={15} /> 7. Company Car Tax
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'self-assessment' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('self-assessment')}>
          <UserCheck size={15} /> 8. Self Assessment
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'compare' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('compare')}>
          <Scale size={15} /> 9. Salary Compare
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'net-worth' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('net-worth')}>
          <Compass size={15} /> 10. Net Worth Hub
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'pension' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('pension')}>
          <Coins size={15} /> 11. Pension Intelligence
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'property-tax' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('property-tax')}>
          <Key size={15} /> 12. Property Tax Hub
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'family-tax' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('family-tax')}>
          <Users size={15} /> 13. Family Tax Hub
        </button>
        <button type="button" className={`${s.sidebarItem} ${activeTool === 'dashboard' ? s.sidebarItemActive : ''}`} onClick={() => setActiveTool('dashboard')}>
          <Activity size={15} /> 14. Health Dashboard
        </button>
      </aside>

      {/* MIDDLE COLUMN: CENTER CONSOLE (INPUT FORMS) */}
      <main className={s.formConsole}>
        
        {/* Hub Title Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Sparkles size={16} />
          {activeTool.replace('-', ' ')} Tool Console
        </div>

        {/* 1. Take-Home Pay Console */}
        {activeTool === 'take-home' && (
          <>
            <div className={s.field}>
              <label className={s.fieldLabel}>Gross Annual Salary</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={salary} onChange={(e) => setSalary(Math.max(0, +e.target.value))} />
                <span className={s.inputSuffix}>/ year</span>
              </div>
              <input type="range" min={20000} max={200000} step={1000} value={salary} onChange={(e) => setSalary(+e.target.value)} style={{ width: '100%', accentColor: '#4f46e5', marginTop: '10px' }} />
            </div>

            {/* Advanced Settings Toggle */}
            <div className={`${s.checkboxCard} ${showAdvanced ? s.checkboxCardActive : ''}`} onClick={() => setShowAdvanced(!showAdvanced)}>
              <input type="checkbox" className={s.checkboxInput} checked={showAdvanced} readOnly />
              <div>
                <span className={s.fieldLabel}>Configure Advanced settings</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>Configure bonuses, pensions, student loans, and tax codes.</p>
              </div>
            </div>

            {/* Collapsible advanced section */}
            <div className={`${s.collapsibleSection} ${showAdvanced ? s.collapsibleSectionOpen : ''}`}>
              <div className={s.inputGrid}>
                <div className={s.field}>
                  <label className={s.fieldLabel}>Annual Bonus</label>
                  <div className={s.numericWrapper}>
                    <span className={s.inputPrefix}>£</span>
                    <input type="number" className={s.numericInput} value={bonus || ''} onChange={(e) => setBonus(Math.max(0, +e.target.value))} placeholder="0" />
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel}>Commission</label>
                  <div className={s.numericWrapper}>
                    <span className={s.inputPrefix}>£</span>
                    <input type="number" className={s.numericInput} value={commission || ''} onChange={(e) => setCommission(Math.max(0, +e.target.value))} placeholder="0" />
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel}>Overtime</label>
                  <div className={s.numericWrapper}>
                    <span className={s.inputPrefix}>£</span>
                    <input type="number" className={s.numericInput} value={overtime || ''} onChange={(e) => setOvertime(Math.max(0, +e.target.value))} placeholder="0" />
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel}>Pension contribution</label>
                  <div className={s.numericWrapper}>
                    <input type="number" className={s.numericInput} value={pensionVal} onChange={(e) => setPensionVal(Math.max(0, +e.target.value))} />
                    <span className={s.inputSuffix}>%</span>
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel}>Pension Arrangement</label>
                  <select className={s.numericWrapper} style={{ width: '100%', outline: 'none' }} value={pensionRelief} onChange={(e) => setPensionRelief(e.target.value)}>
                    <option value="salary_sacrifice">Salary Sacrifice</option>
                    <option value="net_pay">Net Pay Arrangement</option>
                    <option value="relief_at_source">Relief at Source</option>
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel}>Tax Code</label>
                  <div className={s.numericWrapper}>
                    <input type="text" className={s.numericInput} value={taxCode} onChange={(e) => setTaxCode(e.target.value.toUpperCase())} />
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel}>Student Loan Plan</label>
                  <select className={s.numericWrapper} style={{ width: '100%', outline: 'none' }} value={studentLoan} onChange={(e) => setStudentLoan(e.target.value)}>
                    <option value="none">None</option>
                    <option value="plan1">Plan 1</option>
                    <option value="plan2">Plan 2</option>
                    <option value="plan4">Plan 4 (Scotland)</option>
                    <option value="plan5">Plan 5</option>
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel}>NI Category</label>
                  <select className={s.numericWrapper} style={{ width: '100%', outline: 'none' }} value={niCategory} onChange={(e) => setNiCategory(e.target.value)}>
                    <option value="A">Category A</option>
                    <option value="B">Category B</option>
                    <option value="C">Category C</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={scotland} onChange={(e) => setScotland(e.target.checked)} style={{ accentColor: '#4f46e5' }} />
                  Scottish Taxpayer?
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={postgradLoan} onChange={(e) => setPostgradLoan(e.target.checked)} style={{ accentColor: '#4f46e5' }} />
                  Postgraduate Loan?
                </label>
              </div>
            </div>
          </>
        )}

        {/* 2. VAT Calculator Console */}
        {activeTool === 'vat' && (
          <>
            <div className={s.field}>
              <label className={s.fieldLabel}>VAT Calculation Mode</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className={`${s.sidebarItem} ${vatMode === 'add' ? s.sidebarItemActive : ''}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setVatMode('add')}>Add VAT</button>
                <button type="button" className={`${s.sidebarItem} ${vatMode === 'remove' ? s.sidebarItemActive : ''}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setVatMode('remove')}>Remove VAT</button>
              </div>
            </div>
            <div className={s.inputGrid}>
              <div className={s.field}>
                <label className={s.fieldLabel}>Amount</label>
                <div className={s.numericWrapper}>
                  <span className={s.inputPrefix}>£</span>
                  <input type="number" className={s.numericInput} value={vatAmount} onChange={(e) => setVatAmount(Math.max(0, +e.target.value))} />
                </div>
              </div>
              <div className={s.field}>
                <label className={s.fieldLabel}>VAT Rate (%)</label>
                <div className={s.numericWrapper}>
                  <input type="number" className={s.numericInput} value={vatRate} onChange={(e) => setVatRate(Math.max(0, +e.target.value))} />
                  <span className={s.inputSuffix}>%</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 3. Tax Code Decoder Console */}
        {activeTool === 'tax-code' && (
          <div className={s.field}>
            <label className={s.fieldLabel}>Enter HMRC Tax Code</label>
            <div className={s.numericWrapper}>
              <input type="text" className={s.numericInput} value={decodeInput} onChange={(e) => setDecodeInput(e.target.value.toUpperCase())} placeholder="1257L" />
            </div>
            <p style={{ fontSize: '11.5px', color: '#64748b', margin: '6px 0 0 0' }}>Enter codes like 1257L, BR, D0, or company car negative codes like K250.</p>
          </div>
        )}

        {/* 4. Dividend Tax Console */}
        {activeTool === 'dividend' && (
          <div className={s.field}>
            <label className={s.fieldLabel}>Target Annual Dividend Extraction</label>
            <div className={s.numericWrapper}>
              <span className={s.inputPrefix}>£</span>
              <input type="number" className={s.numericInput} value={dividendAmount} onChange={(e) => setDividendAmount(Math.max(0, +e.target.value))} />
            </div>
            <input type="range" min={5000} max={150000} step={1000} value={dividendAmount} onChange={(e) => setDividendAmount(+e.target.value)} style={{ width: '100%', accentColor: '#4f46e5', marginTop: '10px' }} />
          </div>
        )}

        {/* 5. Capital Gains Tax Console */}
        {activeTool === 'cgt' && (
          <>
            <div className={s.inputGrid}>
              <div className={s.field}>
                <label className={s.fieldLabel}>Asset Cost Price</label>
                <div className={s.numericWrapper}>
                  <span className={s.inputPrefix}>£</span>
                  <input type="number" className={s.numericInput} value={cgtAssetCost} onChange={(e) => setCgtAssetCost(Math.max(0, +e.target.value))} />
                </div>
              </div>
              <div className={s.field}>
                <label className={s.fieldLabel}>Disposal Sale Price</label>
                <div className={s.numericWrapper}>
                  <span className={s.inputPrefix}>£</span>
                  <input type="number" className={s.numericInput} value={cgtSalePrice} onChange={(e) => setCgtSalePrice(Math.max(0, +e.target.value))} />
                </div>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" checked={cgtIsProperty} onChange={(e) => setCgtIsProperty(e.target.checked)} style={{ accentColor: '#4f46e5' }} />
              Is this asset a residential property?
            </label>
          </>
        )}

        {/* 6. Inheritance Tax Console */}
        {activeTool === 'iht' && (
          <div className={s.inputGrid}>
            <div className={s.field}>
              <label className={s.fieldLabel}>Estimated Total Estate Value</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={estateValue} onChange={(e) => setEstateValue(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Active Gift Value (Prior 7 years)</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={giftTrackerValue} onChange={(e) => setGiftTrackerValue(Math.max(0, +e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* 7. Company Car Tax Console */}
        {activeTool === 'car-tax' && (
          <>
            <div className={s.inputGrid}>
              <div className={s.field}>
                <label className={s.fieldLabel}>Car List Price (P11D Value)</label>
                <div className={s.numericWrapper}>
                  <span className={s.inputPrefix}>£</span>
                  <input type="number" className={s.numericInput} value={carListPrice} onChange={(e) => setCarListPrice(Math.max(0, +e.target.value))} />
                </div>
              </div>
              <div className={s.field}>
                <label className={s.fieldLabel}>CO2 Emissions (g/km)</label>
                <div className={s.numericWrapper}>
                  <input type="number" className={s.numericInput} value={carCo2} onChange={(e) => setCarCo2(Math.max(0, +e.target.value))} />
                  <span className={s.inputSuffix}>g/km</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>EV = 0 g/km. EV rate is capped at 2% BIK.</span>
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Proposed Annual Cash Alternative Allowance</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={cashAllowanceOpt} onChange={(e) => setCashAllowanceOpt(Math.max(0, +e.target.value))} />
              </div>
            </div>
          </>
        )}

        {/* 8. Self Assessment Console */}
        {activeTool === 'self-assessment' && (
          <div className={s.inputGrid}>
            <div className={s.field}>
              <label className={s.fieldLabel}>Trading / Self-Employed Income</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={saTradingProfit} onChange={(e) => setSaTradingProfit(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Allowable Business Expenses</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={saExpenses} onChange={(e) => setSaExpenses(Math.max(0, +e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* 9. Salary Compare Console */}
        {activeTool === 'compare' && (
          <div className={s.inputGrid}>
            <div className={s.field}>
              <label className={s.fieldLabel}>Job Offer / Salary A</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={salary} onChange={(e) => setSalary(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Job Offer / Salary B</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={salaryB} onChange={(e) => setSalaryB(Math.max(0, +e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* 10. Net Worth Hub Console */}
        {activeTool === 'net-worth' && (
          <div className={s.inputGrid}>
            <div className={s.field}>
              <label className={s.fieldLabel}>Property Value</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={nwProperty} onChange={(e) => setNwProperty(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Savings Cash</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={nwSavings} onChange={(e) => setNwSavings(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Stock Investments</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={nwInvestments} onChange={(e) => setNwInvestments(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Pension Pot</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={nwPensionPot} onChange={(e) => setNwPensionPot(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Outstanding Debts / Mortgages</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={nwDebts} onChange={(e) => setNwDebts(Math.max(0, +e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* 11. Pension Intelligence Console */}
        {activeTool === 'pension' && (
          <div className={s.field}>
            <label className={s.fieldLabel}>Your Annual Pension Contribution</label>
            <div className={s.numericWrapper}>
              <span className={s.inputPrefix}>£</span>
              <input type="number" className={s.numericInput} value={annualContribution} onChange={(e) => setAnnualContribution(Math.max(0, +e.target.value))} />
            </div>
            <input type="range" min={1000} max={80000} step={1000} value={annualContribution} onChange={(e) => setAnnualContribution(+e.target.value)} style={{ width: '100%', accentColor: '#4f46e5', marginTop: '10px' }} />
          </div>
        )}

        {/* 12. Property Tax Hub Console */}
        {activeTool === 'property-tax' && (
          <div className={s.inputGrid}>
            <div className={s.field}>
              <label className={s.fieldLabel}>Property Price</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={propertyPrice} onChange={(e) => setPropertyPrice(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Monthly Rental Income</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={rentalIncome} onChange={(e) => setRentalIncome(Math.max(0, +e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* 13. Family Tax Hub Console */}
        {activeTool === 'family-tax' && (
          <div className={s.inputGrid}>
            <div className={s.field}>
              <label className={s.fieldLabel}>Your Annual Salary</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={salary} onChange={(e) => setSalary(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Partner Annual Salary</label>
              <div className={s.numericWrapper}>
                <span className={s.inputPrefix}>£</span>
                <input type="number" className={s.numericInput} value={partnerSalary} onChange={(e) => setPartnerSalary(Math.max(0, +e.target.value))} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.fieldLabel}>Children Claimed</label>
              <div className={s.numericWrapper}>
                <input type="number" className={s.numericInput} value={childBenefitClaims} onChange={(e) => setChildBenefitClaims(Math.max(0, +e.target.value))} />
              </div>
            </div>
          </div>
        )}

        {/* 14. Financial Health Dashboard Console */}
        {activeTool === 'dashboard' && (
          <div>
            <span style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', display: 'block', marginBottom: '16px' }}>
              Welcome to the **Financial Health Suite Platform Layer**. This dashboard connects all your inputs across the platforms (salary, savings, property, pensions, and debt) to provide a master overview of your wealth and taxation index.
            </span>
            <div className={s.inputGrid}>
              <div className={s.field}>
                <label className={s.fieldLabel}>Link Salary (Annual)</label>
                <div className={s.numericWrapper}>
                  <span className={s.inputPrefix}>£</span>
                  <input type="number" className={s.numericInput} value={salary} onChange={(e) => setSalary(Math.max(0, +e.target.value))} />
                </div>
              </div>
              <div className={s.field}>
                <label className={s.fieldLabel}>Link Net Worth Investments</label>
                <div className={s.numericWrapper}>
                  <span className={s.inputPrefix}>£</span>
                  <input type="number" className={s.numericInput} value={nwInvestments} onChange={(e) => setNwInvestments(Math.max(0, +e.target.value))} />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* RIGHT COLUMN: ANALYTICS & RESULTS CARD DECK */}
      <section className={s.analyticsPanel}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '8px' }}>
          Live Calculations &amp; Insights
        </div>

        {/* 1. Take-Home Pay Analytics */}
        {activeTool === 'take-home' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Net Cash Take-home (Annual)</div>
              <div className={s.metricValue}>{gbp(takeHomeResults.net)}</div>
              <span style={{ fontSize: '12px', color: '#047857', fontWeight: 600, display: 'block', marginTop: '6px' }}>
                Equivalent to {gbp(takeHomeResults.net / 12)} / month
              </span>
            </div>

            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Gross Cash Pay</span>
                <span className={s.ledgerValue}>{gbp(takeHomeResults.gross)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Income Tax</span>
                <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>-{gbp(takeHomeResults.incomeTax)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>National Insurance</span>
                <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>-{gbp(takeHomeResults.ni)}</span>
              </div>
              {takeHomeResults.pension > 0 && (
                <div className={s.ledgerRow}>
                  <span className={s.ledgerLabel}>Workplace Pension</span>
                  <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>-{gbp(takeHomeResults.pension)}</span>
                </div>
              )}
              {takeHomeResults.studentLoan > 0 && (
                <div className={s.ledgerRow}>
                  <span className={s.ledgerLabel}>Student Loan Repayment</span>
                  <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>-{gbp(takeHomeResults.studentLoan)}</span>
                </div>
              )}
              {takeHomeResults.hicbc > 0 && (
                <div className={s.ledgerRow}>
                  <span className={s.ledgerLabel}>HICBC Clawback</span>
                  <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>-{gbp(takeHomeResults.hicbc)}</span>
                </div>
              )}
            </div>

            {/* Cliff warning notifications */}
            {takeHomeResults.allowanceTaperAlert && (
              <div className={s.warningCard}>
                <AlertTriangle size={20} className={s.warningIcon} />
                <div className={s.warningText}>
                  <h4>60% Effective Tax Cliff Alert</h4>
                  <p>Your adjusted net income is in the £100,000 to £125,140 personal allowance taper zone. Consider contributing to a pension to regain your tax-free allowance.</p>
                </div>
              </div>
            )}

            {takeHomeResults.hicbcAlert && (
              <div className={s.warningCard}>
                <AlertTriangle size={20} className={s.warningIcon} />
                <div className={s.warningText}>
                  <h4>Child Benefit Taper Active</h4>
                  <p>Your adjusted net income exceeds £60,000. You are paying a progressive clawback tax on your Child Benefit payments. Contributing to a pension can restore these benefits.</p>
                </div>
              </div>
            )}

            {/* Unique Simulator: Promotion Impact & Negotiation */}
            <div className={s.simulatorCard}>
              <div className={s.simulatorTitle}>
                <Activity size={13} /> Promotion Impact Simulator
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Proposed Raise:</span>
                <div className={s.numericWrapper} style={{ height: '32px', flex: 1, padding: '0 8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>£</span>
                  <input type="number" style={{ fontSize: '13px', border: 'none', background: 'transparent', outline: 'none', width: '100%', fontWeight: 700 }} value={targetRaise} onChange={(e) => setTargetRaise(Math.max(0, +e.target.value))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', borderTop: '1px solid rgba(79, 70, 229, 0.15)', paddingTop: '10px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Net Cash Retained</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#047857' }}>+{gbp(promoResults.netGain)}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Marginal Tax on Raise</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#be123c' }}>{pct(promoResults.marginalRateOnRaise)}</span>
                </div>
              </div>
            </div>

            {/* AI Payroll Explanation Simulator */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid rgba(15, 23, 42, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                <Sparkles size={13} style={{ color: '#4f46e5' }} /> AI Payroll Diagnosis
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b', lineHeight: '1.6' }}>
                Your effective tax deduction rate is **{pct((takeHomeResults.gross - takeHomeResults.net) / (takeHomeResults.gross || 1))}**. For every additional £100 you negotiate on your base salary, you will pocket **{gbp(100 * (1 - promoResults.marginalRateOnRaise))}** in net disposable income.
              </p>
            </div>
          </div>
        )}

        {/* 2. VAT Analytics */}
        {activeTool === 'vat' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>{vatMode === 'add' ? 'Total (Gross Price)' : 'Total (Net Price)'}</div>
              <div className={s.metricValue}>{gbp(vatMode === 'add' ? vatResults.gross : vatResults.net)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Net Amount</span>
                <span className={s.ledgerValue}>{gbp(vatResults.net)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>VAT Fraction ({vatRate}%)</span>
                <span className={s.ledgerValue}>{gbp(vatResults.vat)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Gross Amount</span>
                <span className={s.ledgerValue}>{gbp(vatResults.gross)}</span>
              </div>
            </div>

            {/* Unique Feature: Suspicion Audit Checker */}
            {vatResults.auditWarning && (
              <div className={s.warningCard}>
                <AlertTriangle size={20} className={s.warningIcon} />
                <div className={s.warningText}>
                  <h4>Non-Standard VAT Rate Audit Risk</h4>
                  <p>The selected VAT rate of {vatRate}% is not a standard UK tax rate (20%, 5%, or 0%). Invoices issued with this rate may trigger compliance audits.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Tax Code Analytics */}
        {activeTool === 'tax-code' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardPrimary}`}>
              <div className={s.metricLabel}>Tax-Free Personal Allowance</div>
              <div className={s.metricValue}>{gbp(decoderResults.allowance)}</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid rgba(15, 23, 42, 0.06)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>HMRC Coding Description</span>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: '1.55' }}>{decoderResults.explanation}</p>
            </div>

            {/* Unique features */}
            <div className={s.simulatorCard}>
              <div className={s.simulatorTitle} style={{ color: '#047857' }}>
                <ShieldCheck size={13} /> Coding Analytics Risk Matrix
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '9.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Refund Likelihood</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#047857' }}>{decoderResults.refundScore}% Score</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '9.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Overpayment Risk</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: decoderResults.overpaymentRisk ? '#be123c' : '#047857' }}>
                    {decoderResults.overpaymentRisk ? 'High Risk' : 'Low Risk'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Dividend Tax Analytics */}
        {activeTool === 'dividend' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Net Extracted Dividend</div>
              <div className={s.metricValue}>{gbp(dividendResults.net)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Optimal Director Salary</span>
                <span className={s.ledgerValue}>{gbp(dividendResults.optimalSalary)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Gross Dividend Amount</span>
                <span className={s.ledgerValue}>{gbp(dividendResults.dividends)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Dividend Tax Liability</span>
                <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>-{gbp(dividendResults.tax)}</span>
              </div>
            </div>
            
            {/* Split suggestions */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px dashed #c7d2fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, color: '#4f46e5', marginBottom: '6px' }}>
                <Sparkles size={12} /> Optimal Corporate extraction scenario
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                Pay yourself a director salary of **£12,570** to utilize your personal tax-free allowance fully and generate a free National Insurance stamp, extracting the remaining **{gbp(dividendResults.dividends)}** as company dividends.
              </p>
            </div>
          </div>
        )}

        {/* 5. Capital Gains Tax Analytics */}
        {activeTool === 'cgt' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Net Capital Gain (After Tax)</div>
              <div className={s.metricValue}>{gbp(cgtResults.net)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Gross Asset Capital Gain</span>
                <span className={s.ledgerValue}>{gbp(cgtResults.gain)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Exempt Annual Allowance</span>
                <span className={s.ledgerValue}>{gbp(cgtResults.allowance)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Estimated CGT (Flat Rate)</span>
                <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>-{gbp(cgtResults.tax)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Inheritance Tax Analytics */}
        {activeTool === 'iht' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Net Inheritable Value</div>
              <div className={s.metricValue}>{gbp(ihtResults.net)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Total Unified Tax Threshold</span>
                <span className={s.ledgerValue}>{gbp(ihtResults.threshold)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Taxable Estate slice</span>
                <span className={s.ledgerValue}>{gbp(ihtResults.taxable)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>40% IHT Bill</span>
                <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>-{gbp(ihtResults.tax)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 7. Company Car Tax Analytics */}
        {activeTool === 'car-tax' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardPrimary}`}>
              <div className={s.metricLabel}>Annual BIK Employee Tax Cost</div>
              <div className={s.metricValue}>{gbp(carResults.taxCost)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>BIK Percentage rate</span>
                <span className={s.ledgerValue}>{pct(carResults.bikRate)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Imputed Benefit Value</span>
                <span className={s.ledgerValue}>{gbp(carResults.bikValue)}</span>
              </div>
            </div>

            {/* EV vs Cash Allowance Optimizer output */}
            <div className={s.simulatorCard}>
              <div className={s.simulatorTitle}>
                <Compass size={13} /> EV vs Cash Allowance Optimizer
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: '1.5' }}>
                Opting for the cash allowance alternative leaves you with **{gbp(cashAllowanceOpt * 0.52)}** net annual cash. Taking the company vehicle yields an option score of **{gbp(carResults.evBenefitScore)}** compared to cash extraction.
              </p>
            </div>
          </div>
        )}

        {/* 8. Self Assessment Analytics */}
        {activeTool === 'self-assessment' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Net Trading Profit</div>
              <div className={s.metricValue}>{gbp(saResults.netProfit)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Estimated Income Tax</span>
                <span className={s.ledgerValue}>{gbp(saResults.tax)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Class 4 NI Liability</span>
                <span className={s.ledgerValue}>{gbp(saResults.ni4)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Total SA Liability</span>
                <span className={`${s.ledgerValue} ${s.ledgerValueDanger}`}>{gbp(saResults.totalBill)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Payments on Account (Next Year)</span>
                <span className={s.ledgerValue}>{gbp(saResults.poa)}</span>
              </div>
            </div>

            {/* Risk Indicator */}
            <div className={s.simulatorCard}>
              <div className={s.simulatorTitle} style={{ color: saResults.riskScore === 'Low' ? '#047857' : '#d97706' }}>
                <Shield size={13} /> Filing Audit Enquiry Risk
              </div>
              <span style={{ fontSize: '15px', fontWeight: 800 }}>{saResults.riskScore} Risk Index</span>
            </div>
          </div>
        )}

        {/* 9. Salary Compare Analytics */}
        {activeTool === 'compare' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Net Salary Difference</div>
              <div className={s.metricValue}>{gbp(salaryCompareResults.diff)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Offer A Net Cash</span>
                <span className={s.ledgerValue}>{gbp(salaryCompareResults.netA)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Offer B Net Cash</span>
                <span className={s.ledgerValue}>{gbp(salaryCompareResults.netB)}</span>
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid rgba(15, 23, 42, 0.06)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Lifetime Earnings Projection</div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                Over a standard 30-year career horizon, this difference accumulates to an estimated **{gbp(salaryCompareResults.lifetimeMultiplier)}** in net capital.
              </p>
            </div>
          </div>
        )}

        {/* 10. Net Worth Hub Analytics */}
        {activeTool === 'net-worth' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Your Unified Net Worth</div>
              <div className={s.metricValue}>{gbp(netWorthResults.netWorth)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>FIRE Number Target</span>
                <span className={s.ledgerValue}>{gbp(netWorthResults.fireTarget)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Progress toward Financial Independence</span>
                <span className={s.ledgerValue}>{pct(netWorthResults.percentageToFIRE)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Years to reach FIRE target</span>
                <span className={s.ledgerValue}>{netWorthResults.yearsToFIRE.toFixed(1)} years</span>
              </div>
            </div>
          </div>
        )}

        {/* 11. Pension Intelligence Analytics */}
        {activeTool === 'pension' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Gross Pension Pot Increase</div>
              <div className={s.metricValue}>{gbp(pensionResults.totalAdded)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Your Cash Contribution</span>
                <span className={s.ledgerValue}>{gbp(annualContribution)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>HMRC Tax Relief Top Up</span>
                <span className={s.ledgerValue}>{gbp(pensionResults.topUp)}</span>
              </div>
            </div>

            {pensionResults.limitRisk && (
              <div className={s.warningCard}>
                <AlertTriangle size={20} className={s.warningIcon} />
                <div className={s.warningText}>
                  <h4>Annual Pension Allowance Exceeded</h4>
                  <p>Your contribution exceeds the standard UK annual allowance limit of £60,000. You may incur tax charges on the excess unless you carry forward unused allowances.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 12. Property Tax Hub Analytics */}
        {activeTool === 'property-tax' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardPrimary}`}>
              <div className={s.metricLabel}>Stamp Duty (SDLT) Due</div>
              <div className={s.metricValue}>{gbp(propertyResults.sdlt)}</div>
            </div>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Gross Rental Yield</div>
              <div className={s.metricValue}>{pct(propertyResults.grossYield)}</div>
            </div>
          </div>
        )}

        {/* 13. Family Tax Hub Analytics */}
        {activeTool === 'family-tax' && (
          <div className={s.metricGrid}>
            {familyResults.canClaimMarriageAllowance ? (
              <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
                <div className={s.metricLabel}>Marriage Allowance eligibility</div>
                <div className={s.metricValue}>£252 Saving</div>
                <span style={{ fontSize: '11.5px', color: '#047857', display: 'block', marginTop: '4px' }}>Eligible to transfer allowance!</span>
              </div>
            ) : (
              <div className={`${s.metricCard} ${s.metricCardPrimary}`}>
                <div className={s.metricLabel}>Marriage Allowance status</div>
                <div className={s.metricValue}>Not Eligible</div>
                <span style={{ fontSize: '11.5px', color: '#475569', display: 'block', marginTop: '4px' }}>Both salaries exceed standard allowance threshold.</span>
              </div>
            )}

            {familyResults.highIncomeClawback && (
              <div className={s.warningCard}>
                <AlertTriangle size={20} className={s.warningIcon} />
                <div className={s.warningText}>
                  <h4>Household Child Benefit clawback active</h4>
                  <p>At least one partner earns more than £60,000. The High Income Child Benefit Charge is active for your household.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 14. Financial Health Dashboard Analytics */}
        {activeTool === 'dashboard' && (
          <div className={s.metricGrid}>
            <div className={`${s.metricCard} ${s.metricCardSuccess}`}>
              <div className={s.metricLabel}>Connected Net Assets</div>
              <div className={s.metricValue}>{gbp(netWorthResults.netWorth)}</div>
            </div>
            <div className={s.ledgerTable}>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Gross linked salary</span>
                <span className={s.ledgerValue}>{gbp(salary)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Projected net take-home</span>
                <span className={s.ledgerValue}>{gbp(takeHomeResults.net)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Total estate IHT risk threshold</span>
                <span className={s.ledgerValue}>{gbp(ihtResults.threshold)}</span>
              </div>
              <div className={s.ledgerRow}>
                <span className={s.ledgerLabel}>Estimated FIRE target</span>
                <span className={s.ledgerValue}>{gbp(netWorthResults.fireTarget)}</span>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* BOTTOM SECTION: 3,000+ WORD EXPLAINER LIBRARY PORTAL */}
      <footer className={s.referenceHub}>
        
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '32px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
          Comprehensive UK Taxation &amp; Financial Governance Guide (3,000+ Words)
        </h2>

        <div className={s.referenceLayout}>
          
          {/* Guide Sub-Nav Bar */}
          <nav className={s.refNav}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '6px', paddingLeft: '14px' }}>
              Guide Chapters
            </div>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'intro' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('intro')}>Introduction</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'paye' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('paye')}>1. Progressive PAYE Bands</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'ni' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('ni')}>2. National Insurance Classes</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'loans' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('loans')}>3. Student &amp; Postgrad Loans</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'vat' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('vat')}>4. VAT Mechanisms</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'codes' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('codes')}>5. Deciphering Tax Codes</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'dividends' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('dividends')}>6. Corporate Dividends</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'cgt' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('cgt')}>7. Capital Gains Taxes</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'iht' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('iht')}>8. Inheritance Tapering</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'car' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('car')}>9. Company Vehicle BIK</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'sa' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('sa')}>10. Self Assessment &amp; POA</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'fire' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('fire')}>11. FIRE &amp; Wealth Modelling</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'pensions' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('pensions')}>12. Pension Relief Systems</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'property' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('property')}>13. Property &amp; Stamp Duty</button>
            <button type="button" className={`${s.refNavItem} ${activeChapter === 'family' ? s.refNavItemActive : ''}`} onClick={() => scrollToChapter('family')}>14. Family Tax Optimization</button>
          </nav>

          {/* Chapter Content Portal */}
          <div className={s.refContent}>
            
            <section id="ref-intro" className={s.refChapter}>
              <h2>UK Financial Governance &amp; Strategy Core</h2>
              <p>
                Navigating the complex landscape of British personal finance, corporate taxation, and wealth accumulation requires a deep, mathematically precise understanding of the statutory framework set out by His Majesty’s Revenue and Customs (HMRC), the Department for Work and Pensions (DWP), and the Chancellor of the Exchequer. The UK tax code is not merely a collection of flat rates; it is a progressive, interlinked system of thresholds, taper brackets, relief mechanics, and potential cliff-edges. 
              </p>
              <p>
                For individuals seeking to maximize their wealth extraction, whether through employment salaries, self-employed trading profits, or corporate dividends, standard calculators often fail to account for how these individual layers intersect. For instance, an increase in employment salary can trigger a child benefit clawback, taper your personal allowance, increase student loan repayments, and push your company car BIK liability into a higher bracket all at once. This guide provides the full legal and calculations framework underpinning all 14 tools in our suite, serving as a comprehensive strategic asset.
              </p>
            </section>

            <section id="ref-paye" className={s.refChapter}>
              <h2>1. The PAYE Progressive Tax Framework</h2>
              <p>
                The Pay As You Earn (PAYE) system is the primary vehicle through which employee income is taxed. The foundational pillar of the system is the **Personal Allowance**, which represents the baseline slice of annual income that you are permitted to earn entirely tax-free. For the 2026/27 tax year, the standard Personal Allowance remains fixed at **£12,570**.
              </p>
              <p>
                Any gross salary earned above the Personal Allowance is subject to progressive income tax bands. In England, Wales, and Northern Ireland (known as rest-of-UK or rUK), the slices are taxed at:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Tax Slice</th>
                    <th>Annual Range (Standard 1257L Code)</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Personal Allowance (Tax-free)</td>
                    <td>£0 to £12,570</td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td>Basic Rate</td>
                    <td>£12,571 to £50,270</td>
                    <td>20%</td>
                  </tr>
                  <tr>
                    <td>Higher Rate</td>
                    <td>£50,271 to £125,140</td>
                    <td>40%</td>
                  </tr>
                  <tr>
                    <td>Additional Rate</td>
                    <td>Above £125,140</td>
                    <td>45%</td>
                  </tr>
                </tbody>
              </table>

              <div className={s.refCallout}>
                <span className={s.refCalloutTitle}>The Personal Allowance Taper (The 60% Marginal Tax Bracket)</span>
                <p>
                  Once an individual’s **Adjusted Net Income** (gross salary minus tax-deductible pension contributions or salary sacrifices) exceeds **£100,000**, HMRC claw back the tax-free Personal Allowance. The taper occurs at a rate of **£1 of allowance for every £2 of income** over £100,000. 
                </p>
                <p>
                  As a direct consequence, once Adjusted Net Income reaches **£125,140**, the entire £12,570 Personal Allowance is fully tapered to £0. Because you are paying 40% higher rate tax on the earnings in this band *plus* an extra 20% tax penalty resulting from the progressive loss of your tax-free allowance, the **effective marginal tax rate in the £100,000 to £125,140 bracket is 60%**.
                </p>
              </div>

              <h3>Devolved Scottish Tax Scales</h3>
              <p>
                The Scottish Parliament holds independent legislative power to set separate income tax rates and bands. For Scottish taxpayers (recognized by the "S" prefix on their tax code), the system is divided into six bands, which results in a significantly higher tax burden for middle and higher-income earners.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Scottish Tax Band</th>
                    <th>Taxable Range (Above Allowance)</th>
                    <th>Scottish Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Starter Rate</td>
                    <td>First £2,306</td>
                    <td>19%</td>
                  </tr>
                  <tr>
                    <td>Basic Rate</td>
                    <td>£2,306 to £13,997</td>
                    <td>20%</td>
                  </tr>
                  <tr>
                    <td>Intermediate Rate</td>
                    <td>£13,997 to £31,007</td>
                    <td>21%</td>
                  </tr>
                  <tr>
                    <td>Higher Rate</td>
                    <td>£31,007 to £125,000</td>
                    <td>42%</td>
                  </tr>
                  <tr>
                    <td>Advanced Rate</td>
                    <td>£125,000 to £150,000</td>
                    <td>45%</td>
                  </tr>
                  <tr>
                    <td>Top Rate</td>
                    <td>Above £150,000</td>
                    <td>48%</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section id="ref-ni" className={s.refChapter}>
              <h2>2. National Insurance Classes &amp; Liability Thresholds</h2>
              <p>
                National Insurance Contributions (NICs) are collected by HMRC to fund the State Pension, statutory benefits, and the NHS. Unlike income tax, NI is calculated based on individual weekly or monthly pay periods rather than aggregated annually. This means a one-off performance bonus can push a single payslip into a different bracket.
              </p>
              <h3>Class 1 Contributions (Employees &amp; Employers)</h3>
              <p>
                Class 1 National Insurance has two separate liabilities: the Employee contribution (deducted from gross pay) and the Employer contribution (paid by the employer on top of the base salary).
              </p>
              <ul>
                <li>
                  **Employee Primary Threshold (PT)**: Set at **£12,570** per year. Earnings below this are completely exempt from employee NI.
                </li>
                <li>
                  **Employee Upper Earnings Limit (UEL)**: Set at **£50,270** per year.
                </li>
                <li>
                  **Standard Rates (Category A)**: Under Category A, employees pay **8%** on earnings between the PT (£12,570) and the UEL (£50,270), and **2%** on everything above the UEL.
                </li>
                <li>
                  **Employer Secondary Threshold (ST)**: Crucially, following the Autumn Budget, the Secondary Threshold was cut to **£5,000** per year, and the employer rate was raised to **15%**. This represents a major increase in operating costs for UK employers.
                </li>
              </ul>
              <h3>Class 4 Contributions (Self-Employed Sole Traders)</h3>
              <p>
                Self-employed sole traders and partners pay Class 4 NI on their annual trading profits. The rates are calculated through the Self-Assessment tax return:
              </p>
              <ul>
                <li>
                  **6%** on profits between the Lower Profits Limit (£12,570) and the Upper Profits Limit (£50,270).
                </li>
                <li>
                  **2%** on profits above the Upper Profits Limit (£50,270).
                </li>
                <li>
                  *Note: Mandatory Class 2 weekly flat-rate contributions were officially abolished.*
                </li>
              </ul>
            </section>

            <section id="ref-loans" className={s.refChapter}>
              <h2>3. Student and Postgraduate Loan Repayment Scales</h2>
              <p>
                Student loans in the United Kingdom are repaid directly through the payroll system, acting effectively as an additional tax surcharge. Repayments are calculated as a flat percentage of gross cash earnings above specific plan thresholds.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Loan Plan</th>
                    <th>Applies to</th>
                    <th>Annual Threshold</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Plan 1</td>
                    <td>England &amp; Wales pre-2012; Northern Ireland students</td>
                    <td>£26,065</td>
                    <td>9%</td>
                  </tr>
                  <tr>
                    <td>Plan 2</td>
                    <td>England &amp; Wales undergraduate 2012 to 2022</td>
                    <td>£28,470</td>
                    <td>9%</td>
                  </tr>
                  <tr>
                    <td>Plan 4</td>
                    <td>Scottish undergraduate students</td>
                    <td>£32,745</td>
                    <td>9%</td>
                  </tr>
                  <tr>
                    <td>Plan 5</td>
                    <td>England undergraduate 2023 onwards</td>
                    <td>£25,000</td>
                    <td>9%</td>
                  </tr>
                  <tr>
                    <td>Postgraduate</td>
                    <td>Masters and PhD loans across the UK</td>
                    <td>£21,000</td>
                    <td>6%</td>
                  </tr>
                </tbody>
              </table>
              <div className={s.refCallout}>
                <span className={s.refCalloutTitle}>The Combined Debt Trap</span>
                <p>
                  If you have both a Plan 2 undergraduate student loan and a postgraduate loan, your repayments are calculated concurrently. This means you pay **9%** of your earnings above £28,470 plus **6%** of your earnings above £21,000. 
                </p>
                <p>
                  This adds an effective **15%** surcharge to your marginal rate. For a higher rate taxpayer, this pushes their combined marginal tax rate to **57%** (40% tax + 2% NI + 15% student loans), rising to **77%** if they also sit within the personal allowance taper zone.
                </p>
              </div>
            </section>

            <section id="ref-vat" className={s.refChapter}>
              <h2>4. VAT Mechanics &amp; Invoicing Regulations</h2>
              <p>
                Value Added Tax (VAT) is a consumption tax charged on taxable goods and services supplied in the United Kingdom. Businesses must register for VAT if their VAT-taxable turnover exceeds the registration threshold, which is currently set at **£90,000** on a rolling 12-month basis.
              </p>
              <h3>Standard, Reduced, and Zero Rates</h3>
              <ul>
                <li>**Standard Rate (20%)**: Applies to the vast majority of goods and commercial services.</li>
                <li>**Reduced Rate (5%)**: Applies to domestic utilities (such as fuel and power), car seats, and energy-saving materials.</li>
                <li>**Zero Rate (0%)**: Applies to most food items, books, children's clothes, and public transport. Zero-rated supplies are still taxable, meaning businesses can reclaim VAT on inputs used to produce them (unlike VAT-exempt supplies).</li>
              </ul>
              <h3>Partial Exemption &amp; Retail Margin Schemes</h3>
              <p>
                If a business supplies both taxable (standard, reduced, or zero-rated) and exempt goods, it is classified as partially exempt. The business must separate input VAT between taxable and exempt supplies, as VAT on inputs used for exempt items cannot be reclaimed unless it falls below de minimis limits.
              </p>
              <p>
                The **Retail Margin Scheme** is designed for businesses trading in second-hand goods, art, antiques, or collectors' items. Rather than paying VAT on the full sale price, the business only pays VAT at 20% on the difference (the margin) between what they paid for the item and what they sold it for.
              </p>
            </section>

            <section id="ref-codes" className={s.refChapter}>
              <h2>5. Deciphering HMRC Tax Codes</h2>
              <p>
                An employee's tax code tells their employer's payroll system how much tax-free income they are entitled to. The code is comprised of numbers followed by letters. The numbers indicate the exact amount of personal allowance. Multiplying this number by 10 gives the tax-free limit (e.g. 1257 = £12,570).
              </p>
              <h3>Tax Code Suffix Meanings</h3>
              <ul>
                <li>**L**: Standard suffix. Entitles the holder to the baseline Personal Allowance (£12,570).</li>
                <li>**T**: Applied when HMRC is actively tracking other items in your allowance, such as deducting child benefit charges or adding medical benefits.</li>
                <li>**Y**: Historic code applied to taxpayers born before 6 April 1938.</li>
                <li>**BR**: Basic Rate. No personal allowance is granted; all income from this employment is taxed at a flat 20%.</li>
                <li>**D0**: Higher Rate. All income from this employment is taxed at a flat 40% (no allowance).</li>
                <li>**D1**: Additional Rate. All income from this employment is taxed at a flat 45%.</li>
                <li>**NT**: No Tax. No income tax is deducted at source.</li>
                <li>**K Codes**: If a code begins with a "K", it represents a negative personal allowance. This happens when your taxable benefits-in-kind (like health insurance or company cars) exceed £12,570. The number following the K represents the amount added to your taxable income base.</li>
              </ul>
            </section>

            <section id="ref-dividends" className={s.refChapter}>
              <h2>6. Corporate Dividend Taxation &amp; Extraction Splits</h2>
              <p>
                For directors of limited companies, dividend extraction is a highly tax-efficient method of drawing income. Dividends are paid out of post-tax company profits (after Corporation Tax is deducted, which ranges from 19% to 25%). Dividends do not attract employee or employer National Insurance.
              </p>
              <h3>The Dividend Allowance</h3>
              <p>
                For the 2026/27 tax year, the first **£500** of dividend income is tax-free. Any dividends drawn above this threshold are taxed according to your tax band:
              </p>
              <ul>
                <li>**Basic Rate**: 8.75%</li>
                <li>**Higher Rate**: 33.75%</li>
                <li>**Additional Rate**: 39.35%</li>
              </ul>
              <h3>Director Salary vs. Dividend Split Optimization</h3>
              <p>
                The standard tax-planning strategy for sole directors is to extract salary up to the Secondary Threshold of National Insurance (**£12,570**), which utilizes the personal allowance fully and counts as a qualifying year for the State Pension without triggering any employee or employer NI. 
              </p>
              <p>
                Any cash extraction above £12,570 is paid entirely in dividends. Because dividends are taxed at lower rates (e.g. 8.75% basic rate vs 20% income tax + 8% NI on salary), this strategy saves thousands of pounds in tax annually compared to paying a standard salary.
              </p>
            </section>

            <section id="ref-cgt" className={s.refChapter}>
              <h2>7. Capital Gains Tax &amp; Optimization Strategies</h2>
              <p>
                Capital Gains Tax (CGT) is charged on the profit (gain) realized when you dispose of (sell, gift, or transfer) a capital asset that has increased in value. For the 2026/27 tax year, the annual exempt allowance for individuals is capped at **£3,000**.
              </p>
              <h3>CGT Asset Classes &amp; Tax Rates</h3>
              <ul>
                <li>**Standard Assets (Shares, Cryptocurrencies, Business assets)**: Basic rate taxpayers pay **10%** on gains within the basic rate band, while higher-rate taxpayers pay **20%**.</li>
                <li>**Residential Properties (Not covered by Private Residence Relief)**: Basic rate taxpayers pay **18%**, and higher-rate taxpayers pay **24%**.</li>
              </ul>
              <h3>Bed &amp; ISA and Spousal Transfer Rules</h3>
              <p>
                **Bed &amp; ISA** is a transaction where you sell assets from a taxable investment account and immediately repurchase them inside a tax-free ISA (Individual Savings Account). This secures future gains from CGT, although the initial sale is a disposal and may trigger a CGT liability if the gain exceeds £3,000.
              </p>
              <p>
                **Spousal Transfers** are exempt from CGT. You can transfer assets to your spouse or civil partner at "no gain, no loss" value. This allows you to split assets before disposal, utilizing both of your £3,000 tax-free allowances and basic-rate tax bands to halve the tax bill.
              </p>
            </section>

            <section id="ref-iht" className={s.refChapter}>
              <h2>8. Inheritance Tax and Estate Planning</h2>
              <p>
                Inheritance Tax (IHT) is a tax on the estate (property, money, and possessions) of a deceased person. 
              </p>
              <h3>Nil Rate Bands &amp; Allowances</h3>
              <ul>
                <li>**Nil-Rate Band (NRB)**: The standard threshold is set at **£325,000**. Estates valued below this are exempt from IHT.</li>
                <li>**Residence Nil-Rate Band (RNRB)**: An additional **£175,000** allowance is available if you pass your main home to direct descendants (children or grandchildren). This brings the total tax-free threshold to **£500,000** for individuals.</li>
                <li>**Spousal Transfer**: If you leave your entire estate to your spouse or civil partner, the transfer is completely tax-free, and any unused allowances can be transferred to the surviving partner, creating a combined threshold of up to **£1,000,000**.</li>
              </ul>
              <h3>The 7-Year Gift Rule</h3>
              <p>
                Gifts made to individuals during your lifetime are classified as Potentially Exempt Transfers (PETs). If you die within **7 years** of making the gift, it is added back into your estate for IHT calculations. If you survive past 7 years, the gift is exempt from IHT. 
              </p>
              <p>
                Between years 3 and 7, IHT is reduced through **taper relief**:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Years between Gift and Death</th>
                    <th>IHT Rate Reduction</th>
                    <th>Effective IHT Rate on Gift</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Under 3 years</td>
                    <td>0%</td>
                    <td>40%</td>
                  </tr>
                  <tr>
                    <td>3 to 4 years</td>
                    <td>20%</td>
                    <td>32%</td>
                  </tr>
                  <tr>
                    <td>4 to 5 years</td>
                    <td>40%</td>
                    <td>24%</td>
                  </tr>
                  <tr>
                    <td>5 to 6 years</td>
                    <td>60%</td>
                    <td>16%</td>
                  </tr>
                  <tr>
                    <td>6 to 7 years</td>
                    <td>80%</td>
                    <td>8%</td>
                  </tr>
                  <tr>
                    <td>Over 7 years</td>
                    <td>100% (Exempt)</td>
                    <td>0%</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section id="ref-car" className={s.refChapter}>
              <h2>9. Company Car BIK Tax &amp; EV Optimization</h2>
              <p>
                If your employer provides a company car for private use, it is treated as a taxable Benefit in Kind (BIK). The taxable value is calculated by multiplying the vehicle's manufacturer list price (P11D value) by a percentage determined by the car's CO2 emissions and fuel type.
              </p>
              <h3>CO2 Emission Bands &amp; Rates</h3>
              <ul>
                <li>**Electric Vehicles (0 g/km)**: The BIK rate is capped at **2%** for the 2025/26 and 2026/27 tax years, rising by 1% annually thereafter. This makes EVs extremely tax-efficient.</li>
                <li>**Hybrids and petrol/diesels**: Rates scale progressively from 15% up to **37%** for high-emission vehicles.</li>
              </ul>
              <h3>EV vs. Cash Allowance Optimization</h3>
              <p>
                If an employee is offered a choice between a company car and a cash allowance (e.g. £500/month), they must compare the net income return. A cash allowance is added to your salary and taxed at your marginal rate (typically 40% income tax + 2% primary NI + 9% student loan = 51% total deduction). 
              </p>
              <p>
                In contrast, an EV company car only triggers 2% BIK tax. For a £40,000 EV, the BIK value is £800, costing a higher-rate taxpayer only £320/year in tax. The savings can be significant.
              </p>
            </section>

            <section id="ref-sa" className={s.refChapter}>
              <h2>10. Self Assessment, POA, and HMRC Audit Risks</h2>
              <p>
                Self Assessment is the system used by HMRC to collect income tax and National Insurance from individuals with untaxed income, such as sole traders, partners, landlords, and directors.
              </p>
              <h3>Payments on Account (POA)</h3>
              <p>
                If your tax bill is more than £1,000 and less than 80% of your tax is deducted at source, you must make Payments on Account. These are advance payments toward your next year's tax bill. 
              </p>
              <p>
                Each payment is exactly **50%** of your previous year’s tax bill, due in two instalments: **31 January** (alongside your balancing payment) and **31 July**. This means in your first profitable year of trading, your initial tax bill can feel like **150% of the actual liability**, causing major cashflow issues if not planned for.
              </p>
              <h3>HMRC Enquiry Risk Indicators</h3>
              <p>
                HMRC uses advanced automated algorithms to scan tax returns for anomalies. High risk indicators include:
              </p>
              <ul>
                <li>High business expense claims relative to turnover (specifically exceeding 40%).</li>
                <li>Large fluctuations in income or expenses year-on-year.</li>
                <li>Claiming round numbers for expenses rather than precise penny figures.</li>
                <li>Failing to declare secondary dividend incomes or capital gains.</li>
              </ul>
            </section>

            <section id="ref-fire" className={s.refChapter}>
              <h2>11. Wealth Accumulation &amp; the FIRE Mathematical Model</h2>
              <p>
                The **FIRE (Financial Independence, Retire Early)** movement relies on mathematical modeling of compound interest and investment withdrawal rates to calculate when you can retire.
              </p>
              <h3>The 4% Safe Withdrawal Rate (The Rule of 25)</h3>
              <p>
                The cornerstone of FIRE theory is the **Trinity Study**, which concluded that a retiree can safely withdraw **4%** of their portfolio value in the first year of retirement, adjusting subsequent withdrawals for inflation, with an extremely low probability of running out of money over a 30-year horizon.
              </p>
              <p>
                To calculate your target portfolio size, you multiply your target annual living expenses by **25** (the inverse of 4%). For example, if you require a net income of £40,000 per year, your target FIRE portfolio size is **£1,000,000**.
              </p>
              <h3>Retirement Projection Variables</h3>
              <p>
                The speed at which you reach your target FIRE number is determined by your net savings rate, your investment asset allocation, and the real rate of return (market growth minus inflation). Real growth is historically estimated at **5%** for a diversified global stock index portfolio.
              </p>
            </section>

            <section id="ref-pensions" className={s.refChapter}>
              <h2>12. Workplace Pension Relief &amp; Allowance Mechanics</h2>
              <p>
                Workplace pensions are one of the most effective tax wrappers in the UK, offering immediate relief on contributions up to statutory annual limits.
              </p>
              <h3>Salary Sacrifice vs. Net Pay vs. Relief at Source</h3>
              <ul>
                <li>
                  **Salary Sacrifice**: You exchange a portion of your contractual salary for a direct employer pension contribution. This reduces your gross income, saving you **Income Tax and National Insurance** (8% basic, 2% higher rate).
                </li>
                <li>
                  **Net Pay Arrangement**: Pension contributions are deducted from your salary before tax, providing immediate relief at your highest marginal tax rate. However, NI is still calculated on the full pre-pension salary.
                </li>
                <li>
                  **Relief at Source**: Contributions are deducted from your post-tax salary. The pension provider automatically claims basic rate relief (20%) from the government. Higher and additional rate taxpayers must claim the remaining 20% or 25% relief through Self-Assessment.
                </li>
              </ul>
              <h3>Annual and Lifetime Allowance History</h3>
              <p>
                The **Annual Allowance** is the maximum amount you can contribute to your pensions each tax year while still receiving tax relief. For the 2026/27 tax year, the standard limit is **£60,000**. 
              </p>
              <p>
                High earners are subject to the **Tapered Annual Allowance**, where your allowance is reduced by £1 for every £2 of adjusted income over £260,000, down to a minimum allowance of £10,000.
              </p>
            </section>

            <section id="ref-property" className={s.refChapter}>
              <h2>13. Property Taxation &amp; Stamp Duty (SDLT)</h2>
              <p>
                Purchasing and leasing residential property in the UK carries unique stamp duty, income tax, and capital gains liabilities.
              </p>
              <h3>Stamp Duty Land Tax (SDLT) Bands</h3>
              <p>
                SDLT is paid when you buy property in England and Northern Ireland. The tax is progressive, calculated on the slice of the purchase price falling within each band:
              </p>
              <ul>
                <li>**£0 to £250,000**: 0%</li>
                <li>**£250,001 to £925,000**: 5%</li>
                <li>**£925,001 to £1,500,000**: 10%</li>
                <li>**Above £1,500,000**: 12%</li>
                <li>*Note: An additional 3% surcharge applies if the property is a second home or buy-to-let investment.*</li>
              </ul>
              <h3>Section 24 Rental Income Tax Restriction</h3>
              <p>
                Under Section 24 rules, private landlords cannot deduct mortgage interest costs from their rental income before calculating income tax. Instead, they receive a flat **20% basic rate tax credit** on their mortgage interest expenses. This can push basic-rate taxpayers into higher tax brackets and makes holding property inside a limited company wrapper popular.
              </p>
            </section>

            <section id="ref-family" className={s.refChapter}>
              <h2>14. Family Taxation &amp; Household Tapers</h2>
              <p>
                HMRC taxes individuals, not households. This means couples can optimize their combined tax liabilities by shifting assets and income streams to utilize both partners' allowances.
              </p>
              <h3>Marriage Allowance Transfer</h3>
              <p>
                If one partner earns below the Personal Allowance (£12,570) and the other is a basic-rate taxpayer, the lower earner can transfer **£1,260** of their unused allowance to their partner. This reduces the higher earner's tax bill by a flat **£252** for the tax year.
              </p>
              <h3>Household Child Benefit &amp; Partner Salary Balancing</h3>
              <p>
                The High Income Child Benefit Charge applies if the highest-earning partner’s income exceeds **£60,000**. If both partners earn £59,000 (household income £118,000), they keep the full child benefit. However, if one partner earns £80,000 and the other earns £0 (household income £80,000), the child benefit is fully clawed back. 
              </p>
              <p>
                Balancing salaries, transferring income-generating assets, and making pension contributions are key strategies to optimize household tax.
              </p>
            </section>

          </div>
        </div>
      </footer>

    </div>
  );
}
