import type { Metadata } from 'next';
import { Scale, Gift, CalendarClock, RefreshCw } from 'lucide-react';
import CalcLayout from '../../components/calc-shell/CalcLayout';
import type { ArticleSection } from '../../components/calc-shell/CalcArticle';
import type { FaqItem } from '../../components/calc-shell/FaqJsonLd';
import {
  StatGrid, RateBands, StepRateChart, CompareMatrix, FlowSteps, TipCards,
} from '../../components/calc-shell/visuals';
import TakeHomeCalcClient from './TakeHomeCalcClient';

export const metadata: Metadata = {
  title: 'UK Take-Home Pay Calculator 2026/27 — Salary, Tax, NI, Pension',
  description:
    'Calculate your exact UK take-home pay for the 2026/27 tax year — PAYE Income Tax, National Insurance, student loans, pension and salary sacrifice. See your marginal rate, tax bands and a full monthly breakdown.',
  alternates: { canonical: '/take-home-pay' },
  openGraph: {
    title: 'UK Take-Home Pay Calculator 2026/27 — Salary, Tax, NI, Pension',
    description: 'Net pay after tax, NI, student loans and pension. Marginal-rate radar, tax-band breakdown and salary optimisation.',
    url: 'https://ukvisainfo.co.uk/take-home-pay',
    type: 'website',
  },
};

const FAQS: FaqItem[] = [
  {
    q: 'What is the Personal Allowance for 2026/27?',
    a: 'The standard Personal Allowance is £12,570 — the income you can earn before paying any Income Tax. It is tapered by £1 for every £2 of adjusted net income above £100,000, disappearing entirely at £125,140.',
  },
  {
    q: 'How does the £100,000 tax trap work?',
    a: 'Above £100,000 your £12,570 allowance is withdrawn at 50p per £1 earned. Combined with 40% Higher Rate tax, every £100 earned between £100,000 and £125,140 costs £60 in tax — an effective 60% marginal rate before National Insurance and student loans.',
  },
  {
    q: 'Is National Insurance worked out before or after pension?',
    a: 'It depends on the scheme. Salary sacrifice reduces gross pay before both Income Tax and NI are calculated, so you save NI. Net pay and relief-at-source schemes do not reduce the figure NI is calculated on, so no NI is saved on those contributions.',
  },
  {
    q: 'Why is my monthly take-home not exactly one twelfth of the annual figure?',
    a: 'PAYE spreads allowances and thresholds evenly across the year, so dividing the annual net by 12 is accurate for a stable salary. One-off items such as a bonus are taxed in the month they are paid, which can make a single payslip look different.',
  },
];

const ARTICLE: ArticleSection[] = [
  {
    id: 'paye',
    title: 'How your gross becomes your net',
    body: (
      <>
        <p>
          Almost every UK employee is paid through <strong>Pay As You Earn (PAYE)</strong>: your employer removes Income Tax and National Insurance from each payslip before you ever see the money. Your gross salary passes through a fixed sequence of deductions to arrive at the net figure that lands in your bank.
        </p>
        <FlowSteps items={[
          { label: 'Gross salary', value: '£50,000', op: '', accent: true },
          { label: 'Income Tax', value: '−£7,486', op: '−' },
          { label: 'National Insurance', value: '−£2,994', op: '−' },
          { label: 'Take-home', value: '£39,520', op: '=', accent: true },
        ]} />
        <p>
          The starting point is your <strong>Personal Allowance</strong> — the £12,570 you can earn tax-free in 2026/27, represented by the default tax code <strong>1257L</strong>. Income above it is taxed in the progressive bands below. Above £100,000 the allowance itself starts to disappear, which is the root of the 60% trap covered later.
        </p>
        <div className="note">
          <span className="noteTitle">Your tax code is the instruction sheet</span>
          <p>
            <strong>BR</strong> taxes everything at basic rate (typical for a second job), <strong>K</strong> codes add notional income where benefits exceed the allowance, and a leading <strong>S</strong> marks a Scottish taxpayer. The calculator reads your code and region and applies the right thresholds automatically.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'bands',
    title: 'Income Tax bands, visualised',
    body: (
      <>
        <p>
          Taxable income is sliced into bands, each taxed at a higher rate — but a higher rate only ever applies to the slice <em>inside</em> that band. Crossing into the 40% band never makes your whole salary worse off.
        </p>
        <RateBands
          axis={['£0', '£12.5k', '£50.3k', '£125.1k', '£160k']}
          bands={[
            { name: 'Allowance', rate: '0%', width: 12.57, color: '#94a3b8' },
            { name: 'Basic', rate: '20%', width: 37.7, color: '#10b981' },
            { name: 'Higher', rate: '40%', width: 74.87, color: '#f59e0b' },
            { name: 'Additional', rate: '45%', width: 35, color: '#be123c' },
          ]}
        />
        <p>
          <strong>Scotland sets its own rates.</strong> Holyrood runs a five-tier system from a 19% Starter Rate up to a 48% Top Rate, with thresholds that bite earlier than the rest of the UK. Tick the Scottish-taxpayer box and the calculator swaps in the devolved bands.
        </p>
        <div className="note">
          <span className="noteTitle">Marginal vs effective rate</span>
          <p>
            Your <em>marginal</em> rate is the tax on your next pound; your <em>effective</em> rate is total tax ÷ total income. Because early income is tax-free or taxed at 20%, a 40%-band earner still has an effective rate well under 40%. The results panel shows both.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'ni',
    title: 'National Insurance in three numbers',
    body: (
      <>
        <p>
          National Insurance sits alongside Income Tax but follows different rules: it applies only to earned income and is assessed on each job separately. Employee Class 1 contributions in 2026/27 break down into three simple rates.
        </p>
        <StatGrid items={[
          { value: '0%', label: 'Up to £12,570', sub: 'Below the Primary Threshold', tone: '#10b981' },
          { value: '8%', label: '£12,570 – £50,270', sub: 'Main rate band', tone: '#f59e0b' },
          { value: '2%', label: 'Above £50,270', sub: 'Upper Earnings Limit', tone: '#be123c' },
        ]} />
        <p>
          That 2% top rate means NI is a far smaller marginal cost for high earners than for someone in the basic-rate band, where 8% stacks on top of 20% Income Tax. Your NI category letter fine-tunes this — Category C, for those over State Pension age, removes employee NI entirely.
        </p>
      </>
    ),
  },
  {
    id: 'pension',
    title: 'Three pension schemes — only one saves NI',
    body: (
      <>
        <p>
          Pension contributions are the main lever on your take-home pay, but the saving depends entirely on how your scheme is wired. The difference is not cosmetic — only one route saves National Insurance.
        </p>
        <CompareMatrix
          columns={['Feature', 'Salary sacrifice', 'Net pay', 'Relief at source']}
          bestIndex={1}
          rows={[
            { label: 'Income Tax relief', cells: [true, true, true] },
            { label: 'National Insurance saved', cells: [true, false, false] },
            { label: 'Relief applied automatically', cells: [true, true, 'Basic only'] },
            { label: 'Higher-rate claim needed', cells: [false, false, true] },
          ]}
        />
        <div className="note">
          <span className="noteTitle">The most powerful use of a pension</span>
          <p>
            Contributions cut your adjusted net income, so they can pull you back below £100,000 to restore the Personal Allowance, or below £60,000 to escape the Child Benefit charge. In those bands a contribution is worth far more than its headline relief.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'student-loans',
    title: 'Student loans stack on top',
    body: (
      <>
        <p>
          Repayments act like an extra tax above your plan&apos;s threshold — but they stop once the balance clears or is written off. The rate depends on the loan type, and holding two loans means they stack.
        </p>
        <StatGrid items={[
          { value: '9%', label: 'Undergraduate', sub: 'Plans 1, 2, 4 and 5', tone: '#6366f1' },
          { value: '6%', label: 'Postgraduate', sub: 'Charged separately', tone: '#0ea5e9' },
          { value: '15%', label: 'Combined', sub: 'If you hold both', tone: '#be123c' },
        ]} />
        <p>
          The threshold differs by plan, which is why selecting the right one matters: <strong>Plan 1</strong> (pre-2012), <strong>Plan 2</strong> (2012–2022), <strong>Plan 4</strong> (Scotland, higher threshold) and <strong>Plan 5</strong> (England, from August 2023). The calculator adds the Postgraduate slice when you tick the box, so your marginal rate reflects the true cost of an extra pound.
        </p>
      </>
    ),
  },
  {
    id: 'traps',
    title: 'The marginal-rate traps',
    body: (
      <>
        <p>
          At certain points, earning slightly more triggers a disproportionate loss. This chart plots your <strong>combined marginal rate</strong> (Income Tax + NI) across income — notice the spike between £100,000 and £125,140.
        </p>
        <StepRateChart
          title="Combined marginal rate by salary"
          subtitle="Income Tax + employee NI, 2026/27"
          maxIncome={160000}
          highlight={{ from: 100000, to: 125140, label: '60% trap' }}
          steps={[
            { upTo: 12570, rate: 0 },
            { upTo: 50270, rate: 28 },
            { upTo: 100000, rate: 42 },
            { upTo: 125140, rate: 62 },
            { upTo: 160000, rate: 47 },
          ]}
        />
        <StatGrid items={[
          { value: '60%', label: '£100k – £125k', sub: 'Personal Allowance taper', tone: '#be123c' },
          { value: 'HICBC', label: '£60k – £80k', sub: 'Child Benefit clawback', tone: '#db2777' },
          { value: '45%', label: 'Above £125,140', sub: 'Additional rate — taper ends', tone: '#f59e0b' },
        ]} />
        <p>
          Inside the taper, every £100 earned costs £40 in Higher Rate tax and loses £50 of allowance taxed at 40% — an effective 60% rate. Above £125,140 there is no allowance left to lose, so the marginal rate actually <em>falls</em> back to around 47%. Whenever you enter a trap band, the results panel flags it.
        </p>
      </>
    ),
  },
  {
    id: 'optimise',
    title: 'Turning numbers into a strategy',
    body: (
      <>
        <p>
          A take-home figure only matters if it changes a decision. Four moves consistently pay off.
        </p>
        <TipCards items={[
          { icon: Scale, title: 'Compare offers properly', body: 'A raise that pushes you into the 60% band or past the Child Benefit threshold can deliver far less than it looks. Model it before celebrating.' },
          { icon: Gift, title: 'Sacrifice the bonus', body: 'A bonus is taxed at your marginal rate. Diverting it into your pension dodges Income Tax, employee NI and often captures employer NI too.' },
          { icon: CalendarClock, title: 'Mind the PAYE schedule', body: 'Large one-off payments can over-deduct in a single month and self-correct later. Trust the annual view, not one payslip.' },
          { icon: RefreshCw, title: 'Re-run after life changes', body: 'A loan ending, Child Benefit stopping, reaching State Pension age or moving to Scotland all shift your numbers materially.' },
        ]} />
      </>
    ),
  },
  {
    id: 'method',
    title: 'How this calculator works',
    body: (
      <>
        <p>
          Everything runs in your browser — nothing you type is sent anywhere. It applies the 2026/27 Personal Allowance, Income Tax bands (UK and Scotland), Class 1 National Insurance, all four student loan plans plus Postgraduate loans, and the Child Benefit charge.
        </p>
        <p>
          Annual figures are authoritative; <strong>monthly</strong> divides by twelve and <strong>weekly</strong> by fifty-two, matching how PAYE spreads allowances evenly for a stable salary. It assumes a single employment, standard tax codes, and excludes benefits in kind, the Marriage Allowance transfer and unusual emergency codes. For multiple jobs, large benefit packages or self-employment alongside PAYE, treat the result as a close estimate and confirm with HMRC or a qualified accountant.
        </p>
      </>
    ),
  },
  {
    id: 'faq',
    title: 'Frequently asked questions',
    body: (
      <>
        {FAQS.map((f) => (
          <div key={f.q}>
            <h4>{f.q}</h4>
            <p>{f.a}</p>
          </div>
        ))}
      </>
    ),
  },
];

export default function TakeHomePayPage() {
  return (
    <CalcLayout
      crumb={[{ label: 'Home', href: '/' }, { label: 'Tax & Income', href: '/category/tax' }, { label: 'Take-home Pay' }]}
      eyebrow="Flagship · 2026/27"
      title="UK Take-Home Pay Calculator"
      deck="See exactly what lands in your bank account after Income Tax, National Insurance, pension and student loans — with your marginal rate, tax bands and a full breakdown by month or week."
      verified="HMRC 2026/27 verified"
      url="/take-home-pay"
      methodology={{
        summary: 'Built on the 2026/27 Personal Allowance, Income Tax bands (UK & Scotland), Class 1 National Insurance, all student loan plans and the High Income Child Benefit Charge. Figures are checked against HMRC.',
        govUrl: 'https://www.gov.uk/income-tax-rates',
        govLabel: 'gov.uk · Income Tax rates',
      }}
      faqs={FAQS}
      article={{
        heading: 'Understanding UK take-home pay',
        readingTime: '10 min read · updated May 2026',
        sections: ARTICLE,
      }}
      disclaimer="Estimates based on 2026/27 HMRC thresholds for educational purposes only. This is not regulated financial advice; your circumstances may change the result. Confirm with HMRC or a qualified accountant."
    >
      <TakeHomeCalcClient />
    </CalcLayout>
  );
}
