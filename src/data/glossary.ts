// Plain-English definitions for common UK tax, financial, and property terms.
export const GLOSSARY: Record<string, string> = {
  'HMRC': 'His Majesty\'s Revenue and Customs — the UK government department responsible for collecting taxes and administering certain benefits.',
  'PAYE': 'Pay As You Earn — the system HMRC uses to collect Income Tax and National Insurance contributions directly from employee salaries.',
  'National Insurance': 'A UK tax paid by employees, employers, and the self-employed to fund state benefits and the State Pension.',
  'ISA': 'Individual Savings Account — a tax-free savings and investment account for UK residents, with a £20,000 annual allowance.',
  'SDLT': 'Stamp Duty Land Tax — a tax paid when purchasing property or land over a certain price threshold in England and Northern Ireland.',
  'CGT': 'Capital Gains Tax — a tax on the profit when you sell or dispose of an asset (like shares or a second home) that has increased in value.',
  'IHT': 'Inheritance Tax — a tax on the estate (property, money, and possessions) of someone who has died.',
  'VAT': 'Value Added Tax — a consumption tax charged on most goods and services in the UK, with a registration threshold of £90,000.',
  'LISA': 'Lifetime ISA — a type of ISA where you can save up to £4,000 a year for a first home or retirement, with a 25% government bonus.',
  'LTV': 'Loan-to-Value — the ratio of the mortgage loan amount to the total appraisal value of the property, expressed as a percentage.',
  'Salary Sacrifice': 'An agreement to reduce cash pay, usually in return for a non-cash benefit like pension contributions or a company car, saving tax and National Insurance.',
  'Universal Credit': 'A monthly benefit payment in the UK to help with living costs for people on a low income or who are out of work.',
  'Personal Allowance': 'The amount of income you can earn each year tax-free, currently set at £12,570 for most UK taxpayers.',
};

// Get canonical terms sorted by length (longest first) for greedy matching.
export const GLOSSARY_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
