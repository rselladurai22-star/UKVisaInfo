/**
 * UK Payslip decoder — explains the codes, abbreviations and deduction
 * acronyms commonly found on a PAYE payslip.
 *
 * Source: gov.uk/tax-codes
 *         gov.uk/national-insurance-rates-letters
 *         gov.uk/workplace-pensions
 *
 * This is reference data — there is no "calculation" beyond looking up
 * meanings, but the structure mirrors the other calc libraries so the UI
 * stays consistent.
 */

export interface CodeEntry {
  code: string;
  category: 'Tax code' | 'NI category' | 'Pension' | 'Deduction' | 'Earnings';
  meaning: string;
  detail: string;
}

export const TAX_CODES: CodeEntry[] = [
  { code: '1257L', category: 'Tax code', meaning: 'Standard Personal Allowance', detail: 'The default code for someone with one job and the full £12,570 Personal Allowance. The "L" suffix means you get the standard PA.' },
  { code: 'BR',    category: 'Tax code', meaning: 'Basic rate (20%) on all of this income', detail: 'Used when you have a second job and your Personal Allowance is fully used by the first one. ALL pay from this employment is taxed at 20%.' },
  { code: 'D0',    category: 'Tax code', meaning: 'Higher rate (40%) on all of this income', detail: 'Second employment / pension where the PA is used elsewhere AND the first income is already in the higher-rate band.' },
  { code: 'D1',    category: 'Tax code', meaning: 'Additional rate (45%) on all of this income', detail: 'Rare. Second employment where the first income is already in the additional-rate band.' },
  { code: '0T',    category: 'Tax code', meaning: 'No Personal Allowance', detail: 'Used when HMRC has no details (e.g. new starter with no P45 or starter checklist), or your PA is fully used up. Each band of pay is taxed at the relevant rate.' },
  { code: 'NT',    category: 'Tax code', meaning: 'No tax to deduct', detail: 'Used for non-UK-resident workers paid in the UK, certain claims, or where tax is being collected another way.' },
  { code: 'K…',    category: 'Tax code', meaning: 'Negative allowance — taxable benefit exceeds PA', detail: 'A "K" code means the value of taxable benefits (company car, untaxed income, tax owed from earlier years) is more than your PA. The number is ADDED to your taxable pay each period.' },
  { code: 'M1 / W1', category: 'Tax code', meaning: 'Emergency code — non-cumulative', detail: 'Tax is calculated only on this period\'s pay, ignoring prior earnings. Common for new starters until HMRC issues a proper code; usually leads to a refund later.' },
  { code: 'S…',    category: 'Tax code', meaning: 'Scotland', detail: 'Prefix "S" (e.g. S1257L) means Scottish income-tax bands apply. Set by HMRC based on your address.' },
  { code: 'C…',    category: 'Tax code', meaning: 'Wales (Cymru)', detail: 'Prefix "C" (e.g. C1257L) means Welsh income-tax bands apply. Rates currently identical to England but the code is set separately.' },
];

export const NI_CATEGORIES: CodeEntry[] = [
  { code: 'A', category: 'NI category', meaning: 'Standard adult employee', detail: 'Default for most employees aged 21–State Pension age. 8% / 2% employee, 15% employer.' },
  { code: 'B', category: 'NI category', meaning: 'Married woman / widow (legacy)', detail: 'Reduced employee rate of 1.85% — only women who elected to pay the reduced rate before 1977. Almost obsolete.' },
  { code: 'C', category: 'NI category', meaning: 'Over State Pension age', detail: 'Employee pays no NI. Employer still pays the 15% above the Secondary Threshold.' },
  { code: 'H', category: 'NI category', meaning: 'Apprentice under 25', detail: 'Employee pays standard 8% / 2%. Employer pays 0% on earnings up to the UEL — significant employer saving.' },
  { code: 'J', category: 'NI category', meaning: 'Deferred (already maxed elsewhere)', detail: 'For people with multiple employments who hold a CA2700 deferment certificate. Employee pays just 2% on this income.' },
  { code: 'M', category: 'NI category', meaning: 'Employee under 21', detail: 'Employee pays standard 8% / 2%. Employer pays 0% on earnings up to the UEL.' },
  { code: 'V', category: 'NI category', meaning: 'Veteran, first year of civilian employment', detail: 'Employer pays 0% on earnings up to the UEL for the first 12 months. Employee pays standard rates.' },
  { code: 'Z', category: 'NI category', meaning: 'Deferred employee under 21', detail: 'Combination of J and M.' },
];

export const PENSION_CODES: CodeEntry[] = [
  { code: 'AE', category: 'Pension', meaning: 'Auto-Enrolment', detail: 'Workplace pension contribution under the Pensions Act 2008. Minimum 5% employee + 3% employer of qualifying earnings.' },
  { code: 'SS / SAC', category: 'Pension', meaning: 'Salary Sacrifice', detail: 'You "sacrifice" some gross pay in exchange for an employer pension contribution. Saves both Income Tax AND NI on the sacrificed amount.' },
  { code: 'NP / NPA', category: 'Pension', meaning: 'Net Pay Arrangement', detail: 'Contribution is deducted from gross pay BEFORE tax — you get tax relief immediately. NI is NOT reduced.' },
  { code: 'RAS', category: 'Pension', meaning: 'Relief At Source', detail: 'Contribution is deducted from NET pay. The pension provider claims 20% basic-rate tax relief and adds it to your pot. Higher/Additional rate taxpayers claim the extra via self-assessment.' },
  { code: 'AVC', category: 'Pension', meaning: 'Additional Voluntary Contribution', detail: 'Extra pension contribution on top of the standard scheme. Tax-relieved the same way as the main scheme.' },
];

export const DEDUCTION_CODES: CodeEntry[] = [
  { code: 'PAYE', category: 'Deduction', meaning: 'Pay As You Earn (Income Tax)', detail: 'HMRC income tax deducted at source based on your tax code.' },
  { code: 'NI / NIC', category: 'Deduction', meaning: 'National Insurance Contributions', detail: 'Class 1 employee NI on earnings between PT (£12,570) and UEL (£50,270), plus 2% above. Funds State Pension and certain benefits.' },
  { code: 'SL / STL', category: 'Deduction', meaning: 'Student Loan repayment', detail: '9% of earnings above your plan threshold (or 6% for Postgraduate Loan). HMRC tells your employer which plan to apply.' },
  { code: 'PGL', category: 'Deduction', meaning: 'Postgraduate Loan repayment', detail: '6% of earnings above £21,000. Paid in addition to undergrad Plan loan if you have both.' },
  { code: 'AOE / DEA', category: 'Deduction', meaning: 'Attachment of Earnings / Direct Earnings Attachment', detail: 'Court order or DWP order for the employer to deduct unpaid debts (council tax arrears, child maintenance, benefit overpayments) directly from pay.' },
  { code: 'SMP / SPP / SSP / SAP / ShPP', category: 'Deduction', meaning: 'Statutory pay items', detail: 'Maternity / Paternity / Sick / Adoption / Shared Parental Pay. Shown as additions, not deductions — but appear on the same payslip.' },
];

export const EARNINGS_CODES: CodeEntry[] = [
  { code: 'BACS', category: 'Earnings', meaning: 'Bankers\' Automated Clearing Services', detail: 'How the net pay is transferred to your bank account — takes up to 3 working days.' },
  { code: 'YTD', category: 'Earnings', meaning: 'Year-To-Date', detail: 'Running total since 6 April. Each column on the right of your payslip usually shows period + YTD.' },
  { code: 'P60', category: 'Earnings', meaning: 'Annual tax certificate', detail: 'Issued by your employer at the end of every tax year (by 31 May). Summary of total pay, tax, NI, student loan and pension for the year.' },
  { code: 'P45', category: 'Earnings', meaning: 'Leaver certificate', detail: 'Issued when you leave a job. Hand it to your next employer or HMRC so your tax code can be set correctly.' },
  { code: 'P11D', category: 'Earnings', meaning: 'Taxable benefits return', detail: 'Annual form listing benefits in kind (private medical, company car). The cash-equivalent is added to your taxable income via your tax code.' },
];

export const ALL_CODES: CodeEntry[] = [
  ...TAX_CODES, ...NI_CATEGORIES, ...PENSION_CODES, ...DEDUCTION_CODES, ...EARNINGS_CODES,
];
