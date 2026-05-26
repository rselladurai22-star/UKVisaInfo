import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import MortgageClient from './MortgageClient';

export const metadata: Metadata = {
  title: 'UK Mortgage Affordability Calculator 2026 — How Much Can You Borrow?',
  description: 'Free UK mortgage calculator. Enter income, deposit, outgoings and term to see maximum borrowing, max property price, monthly repayment and FCA stress test at +3%.',
  alternates: { canonical: '/mortgage-affordability' },
};

export default function MortgagePage() {
  return (
    <CalcPageShell
      url="/mortgage-affordability"
      eyebrow="Mortgage · UK 2026"
      title="How much could you borrow?"
      deck="See your maximum mortgage, the property price it unlocks, monthly repayment, and how a +3% rate rise would change the picture."
      verified="FCA stress-test rules"
      methodology={{
        summary: "Maximum borrowing uses the standard UK lender model: gross income × multiple (4.5× default, single or joint), minus existing monthly outgoings × 60. Affordability is then stress-tested at +3% above the product rate, per the FCA Mortgage Market Review framework. Loan-to-Value limits cap final lending against deposit size.",
        govUrl: "https://www.fca.org.uk/firms/mortgages-home-finance/responsible-lending",
        govLabel: "FCA · Mortgage Market Review",
      }}
      faqs={[
        { q: 'How much can I borrow on a UK mortgage in 2026?', a: 'Most UK lenders cap borrowing at 4.5× annual gross income (combined for joint applications). A handful of specialist lenders go to 5–5.5× for high earners (typically £75,000+) or specific professions (doctors, lawyers, accountants). Outgoings, credit commitments and dependants reduce the figure further.' },
        { q: 'What is the FCA stress test and does it still apply?', a: 'Since the 2014 Mortgage Market Review, FCA rules required lenders to check that borrowers could still afford repayments if rates rose by ~3% above the product rate. The Bank of England formally removed the requirement in August 2022, but the FCA still requires a stress-test approach — and most major lenders continue to apply a 3-percentage-point cushion in practice.' },
        { q: 'How does a deposit affect what I can borrow?', a: 'Lenders price by loan-to-value (LTV) band. A 5% deposit gives 95% LTV — possible but at the highest rates and stricter affordability checks. Better rates open up at 90%, 85%, 80%, 75% and 60% LTV. A 25% deposit (75% LTV) usually unlocks meaningfully cheaper rates and is the most common "sweet spot" band.' },
        { q: 'What income counts towards a mortgage application?', a: 'Basic salary always counts. Guaranteed bonuses, regular overtime and shift allowances usually count at 50–100% depending on the lender. Self-employed income normally needs 2–3 years of accounts (or SA302s). Variable elements like commission, freelance income and rental income are assessed individually — each lender has its own policy.' },
        { q: 'How does the calculator treat existing debt?', a: 'Lenders subtract approximately 60 × monthly debt repayment from your income-based maximum. So a £200/month car finance reduces your borrowing capacity by about £12,000; a £150/month credit card minimum payment reduces it by £9,000. The calculator uses this 60× rule of thumb — actual lenders sometimes apply slightly different multipliers.' },
        { q: 'What is a typical UK mortgage term?', a: 'The traditional term is 25 years, but 30, 35 and 40-year terms are increasingly common — particularly with first-time buyers stretching affordability. Longer terms cut the monthly payment but increase total interest paid significantly: a 35-year term costs roughly 50% more in total interest than a 25-year term at the same rate.' },
        { q: 'Can I get a mortgage if I am self-employed?', a: 'Yes — most major lenders accept self-employed applicants with 2 years of full tax-year accounts (or SA302s from HMRC). Some specialist lenders accept 1 year of trading history, though usually at slightly higher rates. Income is assessed on net profit (for sole traders) or salary plus dividends (for limited company directors), averaged across the available years.' },
        { q: 'What is a Decision in Principle and is it binding?', a: 'A Decision in Principle (DIP) or Agreement in Principle (AIP) is a soft assessment by a lender confirming they would, subject to full underwriting, lend you up to a given amount. It is valid for 60–90 days and is NOT a binding offer — full underwriting can still uncover issues that change the outcome. Most estate agents now require a DIP before accepting offers.' },
        { q: 'Should I use a mortgage broker or go direct?', a: 'A whole-of-market broker has access to lenders you cannot approach directly (specialist, intermediary-only lenders) and knows each lender\'s niche affordability rules. For straightforward applications, going direct to one of the top high-street lenders works fine. For self-employed, contractor, BTL, or adverse-credit cases, a broker typically secures meaningfully better outcomes.' },
        { q: 'How long does mortgage approval take?', a: 'A Decision in Principle takes minutes to hours. Full mortgage application underwriting typically takes 2–6 weeks: 1 week for initial paperwork, 1–3 weeks for valuation, 1–2 weeks for offer issue. Completion happens at the buyer\'s pace from there — typically 8–12 weeks from offer acceptance for the average UK purchase chain.' },
      ]}
      related={[
        { href: '/stamp-duty-calculator', title: 'Stamp Duty calculator', desc: 'SDLT on your purchase — FTB relief & surcharges included.' },
        { href: '/take-home-pay',         title: 'Take-home pay',         desc: 'See your real net income before applying.' },
        { href: '/council-tax-band',      title: 'Council Tax band',      desc: 'Estimate annual bill for any UK postcode.' },
      ]}
      educational={[
        { title: 'Income multiple', body: 'Mainstream UK lenders typically cap borrowing at 4.5× annual gross income (combined for joint applications). A few specialist lenders go to 5–5.5× for high earners or specific professions.' },
        { title: 'Outgoings deduction', body: 'Existing credit card balances, personal loans and car finance reduce borrowing capacity. Lenders subtract roughly 60× the monthly outgoing from the income-based maximum.' },
        { title: 'Stress test (+3%)', body: 'Since 2014 (FCA Mortgage Market Review) lenders must check you can afford repayments if rates rose ~3% above the product rate. The Bank of England removed the formal requirement in Aug 2022 but most lenders still apply it.' },
        { title: 'Loan-to-Value (LTV)', body: 'Your deposit as a % of the property price. 95% LTV is the typical max; better rates are available at 90%, 85%, 80%, 75% and 60% bands. A 25% deposit (75% LTV) usually gets meaningfully cheaper rates.' },
        { title: 'Term length', body: 'Standard UK term is 25 years but 30, 35, and even 40 are increasingly common. Longer terms lower the monthly payment but increase total interest paid significantly.' },
        { title: 'What this doesn\'t include', body: 'Credit score, income type (PAYE vs self-employed), bonus reliability, recent credit defaults, property type (BTL, new-build, leasehold) — all affect what lenders will actually offer. Always get a broker Decision in Principle.' },
      ]}
    >
      <MortgageClient />
    </CalcPageShell>
  );
}
