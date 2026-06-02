import type { Metadata } from 'next';
import { Receipt, CalendarClock, PiggyBank } from 'lucide-react';
import CalcLayout from '../../components/calc-shell/CalcLayout';
import type { ArticleSection } from '../../components/calc-shell/CalcArticle';
import type { FaqItem } from '../../components/calc-shell/FaqJsonLd';
import { StatGrid, FlowSteps, TipCards } from '../../components/calc-shell/visuals';
import SelfEmployedClient from './SelfEmployedClient';

export const metadata: Metadata = {
  title: 'Self-Employed Tax Calculator 2026/27 — Sole Trader Tax, Class 4 NI & Payments on Account',
  description:
    'Estimate your sole trader Self Assessment bill — Income Tax, Class 4 National Insurance and the January/July Payments on Account that catch first-timers out. 2026/27 rates.',
  alternates: { canonical: '/self-employed-tax' },
  openGraph: {
    title: 'Self-Employed Tax Calculator 2026/27',
    description: 'Sole trader tax, Class 4 NI and the Payments on Account schedule, in plain numbers.',
    url: 'https://ukvisainfo.co.uk/self-employed-tax',
    type: 'website',
  },
};

const FAQS: FaqItem[] = [
  {
    q: 'How much tax do I pay as a sole trader?',
    a: 'On your profit (turnover minus allowable expenses) you pay Income Tax at the normal bands plus Class 4 National Insurance — 6% on profit between £12,570 and £50,270, and 2% above that. The calculator works out both on your figures.',
  },
  {
    q: 'What are Payments on Account and why is my first bill so big?',
    a: 'Once your bill passes £1,000, HMRC asks you to pre-pay next year\'s tax in two instalments. So your first January can land as roughly 150% of the actual bill — this year\'s tax plus half of next year\'s. It is the single biggest shock for new sole traders.',
  },
  {
    q: 'What expenses can I deduct?',
    a: 'Anything wholly and exclusively for the business — tools, software, travel, a proportion of home costs if you work from home, professional fees. Every pound of genuine expense lowers your taxable profit, so keeping good records directly cuts your bill.',
  },
  {
    q: 'How much should I set aside for tax?',
    a: 'A rough rule is a quarter to a third of profit, but it depends on your income. The calculator gives a tailored monthly figure that already accounts for Payments on Account, so you can park the right amount each month and never scramble in January.',
  },
];

const ARTICLE: ArticleSection[] = [
  {
    id: 'profit',
    title: 'You are taxed on profit, not turnover',
    body: (
      <>
        <p>
          The first thing to get straight: HMRC does not tax the money that comes in, it taxes what is left after the costs of earning it. Turnover is the top line; profit is what you actually keep before tax. Mixing the two up is how people end up terrified by a tax bill that was never going to happen.
        </p>
        <FlowSteps items={[
          { label: 'Turnover', value: '£50,000', op: '', accent: true },
          { label: 'Expenses', value: '−£8,000', op: '−' },
          { label: 'Taxable profit', value: '£42,000', op: '=', accent: true },
          { label: 'Tax & NI on this', op: '→', value: 'only' },
        ]} />
        <p>
          So every legitimate expense you record — software, mileage, a slice of your home bills, an accountant — pulls your taxable profit down and your bill with it. Good bookkeeping is not admin for its own sake; it is the cheapest tax planning you will ever do.
        </p>
      </>
    ),
  },
  {
    id: 'what-you-pay',
    title: 'The two things you actually pay',
    body: (
      <>
        <p>
          A sole trader&apos;s Self Assessment bill is really two charges stacked together: ordinary Income Tax, and Class 4 National Insurance on top. Class 2 NICs, which used to be a separate flat weekly charge, have largely been folded away, so for most people it is these two that matter.
        </p>
        <StatGrid items={[
          { value: '20–45%', label: 'Income Tax', sub: 'Same bands as an employee', tone: '#6366f1' },
          { value: '6%', label: 'Class 4 NI', sub: 'On profit £12,570–£50,270', tone: '#f59e0b' },
          { value: '2%', label: 'Class 4 NI', sub: 'On profit above £50,270', tone: '#be123c' },
        ]} />
        <p>
          It is worth knowing that you pay slightly less National Insurance than an employee on the same money — there is no employer-style NIC, and the Class 4 rate is lower than the employee Class 1 rate. That is a small consolation for losing sick pay, holiday pay and a pension contribution, but it is real.
        </p>
      </>
    ),
  },
  {
    id: 'poa',
    title: 'Payments on Account — the bill that doubles',
    body: (
      <>
        <p>
          This is the one that ruins first-time sole traders, so brace yourself now and it will never sting. Once your tax bill goes over £1,000, HMRC stops trusting you to pay just once a year and starts collecting next year&apos;s tax in advance, in two instalments.
        </p>
        <p>
          The result is brutal arithmetic in your first January. You pay the tax you actually owe for the year just gone — and, at the same moment, half of next year&apos;s estimated bill as a Payment on Account. Then in July you pay the other half. So your first payment can be around 150% of the bill you were expecting.
        </p>
        <div className="note">
          <span className="noteTitle">It is not extra tax — it is just early</span>
          <p>
            Payments on Account are not a penalty or a surcharge. You are paying the same tax, just sooner, and from your second year onwards it smooths out. But that first January is real cash leaving your account, so the worst thing you can do is be surprised by it.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'set-aside',
    title: 'How to never get caught short',
    body: (
      <>
        <p>
          The single habit that separates relaxed sole traders from panicked ones is boring and simple: move tax money out of reach the moment it arrives, before it feels like yours.
        </p>
        <TipCards items={[
          { icon: PiggyBank, title: 'Open a separate tax pot', body: 'A second account you never spend from. Every time you get paid, move a fixed share across. The calculator gives you the monthly figure to use.' },
          { icon: CalendarClock, title: 'Diarise 31 January & 31 July', body: 'Those are the two dates HMRC wants money. Knowing the July payment exists stops it ambushing you mid-summer.' },
          { icon: Receipt, title: 'Log expenses as you go', body: 'A photo of every receipt beats a shoebox in January. Each one you capture is profit you are not taxed on.' },
        ]} />
        <p>
          The monthly reserve figure in the results already builds in Payments on Account, so if you save that amount religiously, both the January and July bills are covered before they arrive. No drama, no borrowing, no dread.
        </p>
      </>
    ),
  },
  {
    id: 'method',
    title: 'How this calculator works',
    body: (
      <>
        <p>
          It starts from your turnover, subtracts your expenses and any pension contributions to find your taxable profit, then applies Income Tax at the standard bands and Class 4 National Insurance at 6% and 2%. It adds student loan repayments and the Child Benefit charge where they apply, and works out your Payments on Account from the total — using last year&apos;s bill, if you enter it, to size the January balancing payment correctly.
        </p>
        <p>
          It uses 2026/27 rates and assumes a straightforward sole trader with no employees. It does not model VAT, the Construction Industry Scheme, capital allowances on big asset purchases, or a limited company structure — if any of those apply, treat this as a baseline and check the detail with an accountant. The monthly reserve is a planning figure, not a demand from HMRC.
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

export default function SelfEmployedTaxPage() {
  return (
    <CalcLayout
      crumb={[{ label: 'Home', href: '/' }, { label: 'Tax & Income', href: '/category/tax' }, { label: 'Self-Employed Tax' }]}
      eyebrow="Self-employed · 2026/27"
      title="Self-Employed Tax Calculator"
      deck="Estimate your sole trader Self Assessment bill — Income Tax, Class 4 National Insurance and the January/July Payments on Account — then see the monthly amount to set aside."
      verified="HMRC 2026/27 verified"
      url="/self-employed-tax"
      methodology={{
        summary: 'Calculates taxable profit from turnover less expenses and pension, applies Income Tax bands and Class 4 NI (6%/2%), adds student loans and the Child Benefit charge, and derives Payments on Account. Based on 2026/27 rates.',
        govUrl: 'https://www.gov.uk/self-assessment-tax-returns',
        govLabel: 'gov.uk · Self Assessment',
      }}
      faqs={FAQS}
      article={{
        heading: 'Sole trader tax, without the January panic',
        readingTime: '8 min read · updated May 2026',
        sections: ARTICLE,
      }}
      disclaimer="Estimates based on 2026/27 HMRC rates for educational purposes only. It does not model VAT, CIS, capital allowances or limited companies. This is not regulated financial advice — confirm with HMRC or an accountant."
    >
      <SelfEmployedClient />
    </CalcLayout>
  );
}
