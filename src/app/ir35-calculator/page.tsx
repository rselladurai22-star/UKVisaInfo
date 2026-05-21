import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import IR35Client from './IR35Client';

export const metadata: Metadata = {
  title: 'IR35 Calculator 2025/26 — Inside vs Outside Contractor Comparison',
  description: 'UK IR35 calculator 2025/26. Compare take-home pay inside IR35 (full PAYE) vs outside (Ltd company salary + dividends). See the real cost of a determination for your day rate.',
  alternates: { canonical: '/ir35-calculator' },
};

export default function IR35Page() {
  return (
    <CalcPageShell
      url="/ir35-calculator"
      eyebrow="IR35 · UK · 2025/26"
      title="Inside or outside IR35 — what&rsquo;s the difference in your pocket?"
      deck="A single day rate, two radically different tax outcomes. Inside IR35 means full PAYE — outside means salary plus dividends through your Ltd. See the exact gap."
      verified="gov.uk/guidance/off-payroll-working-ir35"
      related={[
        { href: '/contractor-day-rate', title: 'Contractor day rate', desc: 'What permanent salary does your day rate actually equal?' },
        { href: '/sole-trader-vs-limited', title: 'Sole trader vs Ltd', desc: 'Full Ltd company vs sole trader comparison.' },
        { href: '/dividend-tax', title: 'Dividend tax', desc: 'Understand the dividend rates in the outside IR35 calculation.' },
      ]}
      educational={[
        { title: 'What is IR35?', body: 'IR35 (off-payroll working rules) determines whether a contractor is genuinely self-employed or — in substance — an employee of the end-client. If inside, full PAYE and NI apply. If outside, you can extract profits tax-efficiently via your Ltd company.' },
        { title: 'Who decides since April 2021?', body: 'For medium and large private-sector clients (and all public sector), the end-client decides the IR35 status. Only small companies (two of: turnover ≤ £10.2m, employees ≤ 50, balance sheet ≤ £5.1m) leave the decision to the contractor.' },
        { title: 'Inside IR35: how tax works', body: 'The fee-payer deducts employer NI from the gross contract value, then applies PAYE and employee NI to the remainder (the "deemed salary"). The contractor receives a net amount — broadly similar to direct employment.' },
        { title: 'Outside IR35: Ltd + dividends', body: 'Take a small director\'s salary (at or near the secondary NI threshold £5,000–£12,570) to minimise NI, pay Corporation Tax on profits, then extract the rest as dividends. Dividend tax rates (8.75%/33.75%/39.35%) are lower than income tax + NI.' },
        { title: 'The true gap', body: 'The financial difference varies significantly with day rate. On a £600/day 220-day contract (£132,000), the outside route can save £10,000–£30,000+ in tax depending on expenses and salary choice. But that must be weighed against IR35 risk and compliance costs.' },
      ]}
    >
      <IR35Client />
    </CalcPageShell>
  );
}
