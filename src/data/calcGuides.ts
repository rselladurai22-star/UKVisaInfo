// Reverse cross-link map: calculator path -> related blog guides.
//
// Mirrors the post -> calculator links (BlogPost.relatedTools) so calculators
// can link back to the guides that explain them (topic-cluster interlinking).
// Kept as a small standalone literal — does NOT import the large blog.ts — so
// it is safe to use inside client calculator components without bloating the
// bundle. Keep in sync when adding posts.

export interface GuideLink {
  slug: string;
  title: string;
}

const G = {
  tax50k: { slug: 'how-much-tax-on-50000-salary-uk-2025-26', title: 'How much tax will I pay on £50,000?' },
  soletrader: { slug: 'sole-trader-vs-limited-company-tax-2025-26', title: 'Sole trader vs limited company' },
  ftbsdlt: { slug: 'first-time-buyer-stamp-duty-2025-26', title: 'First-time buyer stamp duty 2025/26' },
  uc: { slug: 'universal-credit-taper-explained-2025-26', title: 'Universal Credit and the 55% taper' },
  evpetrol: { slug: 'electric-car-vs-petrol-running-cost-2026', title: 'Electric car vs petrol running cost' },
  pricecap: { slug: 'ofgem-energy-price-cap-explained-2025-26', title: 'How the Ofgem price cap really works' },
  divorce: { slug: 'cost-of-divorce-england-2025', title: 'What a divorce really costs in England' },
  sacrifice: { slug: 'salary-sacrifice-pension-explained-2025-26', title: 'Salary sacrifice explained' },
  mortgageborrow: { slug: 'how-much-mortgage-can-i-borrow-2025-26', title: 'How much mortgage can I borrow?' },
  iht: { slug: 'inheritance-tax-explained-2025-26', title: 'Inheritance tax explained' },
  isapension: { slug: 'isa-vs-pension-where-to-save-2025-26', title: 'ISA or pension: where to save?' },
  debt: { slug: 'clear-credit-card-debt-snowball-vs-avalanche', title: 'Clear card debt: snowball vs avalanche' },
  childben: { slug: 'child-benefit-high-income-charge-2025-26', title: 'Child Benefit high income charge' },
  buyrent: { slug: 'buy-vs-rent-uk-2025', title: 'Buy vs rent in 2025' },
  vat: { slug: 'do-i-need-to-register-for-vat-2025-26', title: 'Do I need to register for VAT?' },
  tax100k: { slug: 'how-much-tax-on-100000-salary-uk-2025-26', title: 'Earning £100,000? The 60% tax trap' },
  deposit: { slug: 'how-much-deposit-to-buy-a-house-uk-2025', title: 'How much deposit do you need?' },
  retire: { slug: 'how-much-do-i-need-to-retire-uk-2025', title: 'How much do you need to retire?' },
  cartax: { slug: 'how-much-is-car-tax-ved-2025-26', title: 'How much is car tax in 2025/26?' },
  counciltax: { slug: 'council-tax-bands-and-reductions-explained-2025-26', title: 'Council tax bands & reductions' },
  ni: { slug: 'national-insurance-explained-how-much-2025-26', title: 'National Insurance explained' },
  tax60k: { slug: 'how-much-tax-on-60000-salary-uk-2025-26', title: 'How much tax on £60,000?' },
  sdlt: { slug: 'how-much-is-stamp-duty-2025-26', title: 'How much is stamp duty?' },
  redundancy: { slug: 'redundancy-pay-how-much-2025-26', title: 'Redundancy pay: how much?' },
  marriage: { slug: 'marriage-allowance-claim-252-2025-26', title: 'Marriage Allowance: claim £252' },
  cgt: { slug: 'capital-gains-tax-explained-2025-26', title: 'Capital Gains Tax explained' },
  carcost: { slug: 'what-does-a-car-cost-to-run-per-year-2025', title: 'What a car costs to run per year' },
} satisfies Record<string, GuideLink>;

export const CALC_GUIDES: Record<string, GuideLink[]> = {
  '/take-home-pay': [G.tax50k, G.tax60k, G.tax100k, G.sacrifice, G.ni, G.childben],
  '/national-insurance-calculator': [G.ni, G.tax50k, G.tax60k, G.marriage],
  '/marriage-allowance-calculator': [G.marriage],
  '/redundancy-pay': [G.redundancy],
  '/cgt-calculator': [G.cgt],
  '/property-cgt-calculator': [G.cgt],
  '/pension-calculator': [G.retire, G.sacrifice, G.isapension, G.tax100k],
  '/pension-drawdown-calculator': [G.retire],
  '/state-pension': [G.retire, G.ni],
  '/sole-trader-vs-limited': [G.soletrader, G.vat],
  '/corporation-tax-calculator': [G.soletrader, G.vat],
  '/salary-vs-dividend-calculator': [G.soletrader],
  '/vat-calculator': [G.vat, G.soletrader],
  '/stamp-duty-calculator': [G.sdlt, G.ftbsdlt],
  '/mortgage-calculator': [G.mortgageborrow, G.ftbsdlt, G.buyrent],
  '/mortgage-affordability': [G.mortgageborrow],
  '/house-buying-costs': [G.ftbsdlt, G.buyrent],
  '/deposit-calculator': [G.deposit, G.mortgageborrow, G.buyrent],
  '/buy-vs-rent': [G.buyrent, G.mortgageborrow],
  '/universal-credit-calculator': [G.uc, G.counciltax],
  '/childcare-calculator': [G.uc],
  '/council-tax-support-checker': [G.counciltax, G.uc],
  '/council-tax-band': [G.counciltax],
  '/ev-charging-cost': [G.evpetrol, G.cartax],
  '/vehicle-tax-calculator': [G.cartax, G.carcost, G.evpetrol],
  '/car-running-costs': [G.carcost, G.cartax],
  '/fuel-cost-calculator': [G.carcost, G.evpetrol],
  '/lifetime-isa-calculator': [G.isapension, G.deposit],
  '/energy-bill': [G.pricecap],
  '/solar-panel-roi': [G.pricecap],
  '/heat-pump-calculator': [G.pricecap],
  '/divorce-cost-calculator': [G.divorce],
  '/child-maintenance-calculator': [G.divorce],
  '/financial-settlement-calculator': [G.divorce],
  '/inheritance-tax': [G.iht],
  '/estate-value-calculator': [G.iht],
  '/gift-iht-calculator': [G.iht],
  '/isa-calculator': [G.isapension],
  '/debt-payoff-planner': [G.debt],
  '/credit-card-payoff-calculator': [G.debt],
  '/balance-transfer-calculator': [G.debt],
  '/child-benefit-trap': [G.childben],
};

export const guidesFor = (calcPath: string): GuideLink[] => CALC_GUIDES[calcPath] ?? [];
