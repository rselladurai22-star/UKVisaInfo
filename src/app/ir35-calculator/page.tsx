import type { Metadata } from 'next';
import CalcPageShell from '../../components/calc-shell/CalcPageShell';
import IR35Client from './IR35Client';

export const metadata: Metadata = {
  title: 'IR35 Calculator 2025/26 — Inside vs Outside Take-Home Comparison',
  description: 'UK IR35 status calculator. Compare inside vs outside IR35 take-home pay. See the full cost difference: PAYE + employer NI inside, Ltd salary + dividends outside.',
  alternates: { canonical: '/ir35-calculator' },
};

export default function IR35Page() {
  return (
    <CalcPageShell
      url="/ir35-calculator"
      eyebrow="IR35 · Off-Payroll Working · UK · 2025/26"
      title="Inside vs outside IR35 — what is the real take-home difference?"
      deck="IR35 determinations have real financial consequences. Inside = PAYE, employer NI, no expenses. Outside = Ltd route, dividend extraction, full expenses. Here's the full breakdown side-by-side."
      verified="gov.uk/guidance/understanding-off-payroll-working-ir35"
      sidebar={{
        keyRates: [
          { label: 'Inside IR35 tax', value: 'PAYE rates', sub: '20% / 40% / 45% + NI', accent: '#B91C1C' },
          { label: 'Outside IR35 (Corp Tax)', value: '25%', sub: 'On Ltd profits >£250k' },
          { label: 'Outside IR35 (Corp Tax)', value: '19%', sub: 'On Ltd profits ≤£50k' },
          { label: 'Deemed employer NI', value: '15%', sub: 'Inside: paid by fee-payer / agency', accent: '#B91C1C' },
          { label: 'Employee NI (inside)', value: '8% / 2%', sub: 'Same as permanent PAYE' },
          { label: 'Dividend (outside)', value: '8.75%', sub: 'Basic rate after £500 allowance', accent: '#0F766E' },
          { label: 'Off-payroll reform date', value: '6 Apr 2021', sub: 'Public & large/med private sector' },
        ],
        dates: [
          { date: '31 Jan', desc: 'Dividend income from Ltd on SA return — same deadline', urgent: false },
          { date: '6 Apr', desc: 'New off-payroll rules apply if switching engagement', urgent: false },
          { date: '9 mo', desc: 'Ltd accounts due after company year-end', urgent: false },
        ],
        tips: [
          { heading: 'Get a Status Determination Statement', body: 'Since April 2021, clients in medium/large private sector must provide a written SDS. Request it — it locks in the responsibility for an incorrect determination.' },
          { heading: 'CEST tool is not binding on HMRC', body: 'HMRC\'s Check Employment Status for Tax tool can help but is not legally binding. If challenged, all factors are assessed holistically.' },
          { heading: 'Business Expenses', body: 'Outside IR35: legitimate business costs reduce Ltd profit before Corp Tax. Inside IR35: no tax relief on the same costs — a significant hidden cost.' },
        ],
        govLink: 'gov.uk/guidance/understanding-off-payroll-working-ir35',
        govLabel: 'gov.uk — IR35 guidance',
      }}
      related={[
        { href: '/contractor-day-rate', title: 'Contractor day rate', desc: 'What permanent salary does your rate equal?' },
        { href: '/take-home-pay', title: 'Take-home pay', desc: 'Inside IR35 net pay as a permanent employee.' },
        { href: '/dividend-tax', title: 'Dividend tax', desc: 'Outside route: dividend tax rates and allowance.' },
      ]}
      educational={[
        { title: 'What is IR35?', body: 'IR35 (off-payroll working rules) applies when HMRC considers a contractor\'s work to be effectively employment. The key tests are control (over how/when/where), substitution (can someone else do the work?), and mutuality of obligation (is there an expectation of continued work?).' },
        { title: 'Who determines status?', body: 'Since April 2021, the "client" (end-user) determines IR35 status for medium and large private sector engagements — not the contractor. For small clients, the contractor still self-determines. Public sector clients have applied this since April 2017.' },
        { title: 'Fee-payer responsibility', body: 'The fee-payer (usually the agency) deducts PAYE and NI from the gross contract rate. The employer NI is also deducted from the contract rate — meaning inside IR35 effectively reduces gross income before any calculation.' },
        { title: 'Expenses and benefits', body: 'Outside IR35: business expenses reduce Ltd profit before Corp Tax — travel, accommodation, equipment, subscriptions. Inside IR35: no expenses are deductible from the deemed salary. This is a significant hidden financial cost of inside status.' },
        { title: 'What to do if you disagree', body: 'You can raise a formal disagreement with the client within 45 days of the SDS. The client must respond in 45 days. If unresolved, take it to HMRC or legal challenge. Keep detailed evidence of working practices (contract terms, how work was actually performed).' },
      ]}
    >
      <IR35Client />
    </CalcPageShell>
  );
}
