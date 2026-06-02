import type { Metadata } from 'next';
import { Gift, Scale, CalendarClock, PiggyBank } from 'lucide-react';
import CalcLayout from '../../components/calc-shell/CalcLayout';
import type { ArticleSection } from '../../components/calc-shell/CalcArticle';
import type { FaqItem } from '../../components/calc-shell/FaqJsonLd';
import { StatGrid, FlowSteps, StepRateChart, TipCards } from '../../components/calc-shell/visuals';
import BonusTaxClient from './BonusTaxClient';

export const metadata: Metadata = {
  title: 'UK Bonus Tax Calculator 2026/27 — How Much of Your Bonus You Keep',
  description:
    'Find out exactly how much of your bonus you keep after Income Tax, National Insurance and student loans, and how much you save by sacrificing it into your pension. 2026/27 rates.',
  alternates: { canonical: '/bonus-tax' },
  openGraph: {
    title: 'UK Bonus Tax Calculator 2026/27',
    description: 'How much of your bonus you actually keep — and how bonus sacrifice changes the maths.',
    url: 'https://ukvisainfo.co.uk/bonus-tax',
    type: 'website',
  },
};

const FAQS: FaqItem[] = [
  {
    q: 'Is a bonus taxed more than normal salary?',
    a: 'No — it is taxed at the same rates, but it all lands on top of your existing salary, so it is taxed at your highest marginal rate. That is why a bonus often feels like it gets hammered: every pound sits in your top band rather than being spread across the lower ones.',
  },
  {
    q: 'Why was so much tax taken off my bonus in one month?',
    a: 'PAYE assumes the big month is your new normal and taxes it as if you earn that much every month, so it over-deducts. It usually corrects itself over the following months, or at year end. The annual figure on this calculator is the reliable one.',
  },
  {
    q: 'Can I avoid tax on my bonus?',
    a: 'You cannot avoid it, but you can defer and shelter it. Sacrificing the bonus straight into your pension before it is paid means it skips Income Tax and National Insurance entirely — you do not get the cash now, but almost none of it is lost to deductions.',
  },
  {
    q: 'Does a bonus affect my Child Benefit or Personal Allowance?',
    a: 'It can. A bonus that pushes your income over £60,000 starts clawing back Child Benefit, and over £100,000 it tapers your Personal Allowance. Both can be avoided by sacrificing enough of the bonus into a pension to stay under the line.',
  },
];

const ARTICLE: ArticleSection[] = [
  {
    id: 'why-hit',
    title: 'Why your bonus feels like it gets hammered',
    body: (
      <>
        <p>
          Open the payslip with the bonus on it and the first reaction is usually the same: where did half of it go? It is not that bonuses are taxed under some special punishing rate. They are taxed at exactly the same rates as your salary. The catch is where the money lands.
        </p>
        <p>
          Your normal salary gets the benefit of the low bands — the tax-free allowance, the 20% band, and so on. By the time your bonus arrives, those cheap bands are already used up by your salary. So the whole bonus stacks on top, taxed at your highest marginal rate the entire way.
        </p>
        <FlowSteps items={[
          { label: 'Gross bonus', value: '£10,000', op: '', accent: true },
          { label: 'Income Tax', value: '−£4,000', op: '−' },
          { label: 'National Insurance', value: '−£200', op: '−' },
          { label: 'You keep', value: '£5,800', op: '=', accent: true },
        ]} />
        <p>
          That example is someone already in the 40% band. Same bonus, someone in the basic-rate band keeps a lot more. Your salary decides the rate your bonus pays — which is the single most important thing to understand here.
        </p>
      </>
    ),
  },
  {
    id: 'marginal',
    title: 'It all rides on your marginal rate',
    body: (
      <>
        <p>
          The number that decides how much of your bonus survives is your marginal rate — the tax on your next pound. This chart shows how it moves as salary climbs, and why a bonus is worth wildly different amounts to different people.
        </p>
        <StepRateChart
          title="Marginal rate your bonus pays"
          subtitle="Income Tax + employee NI, 2026/27"
          maxIncome={160000}
          highlight={{ from: 100000, to: 125140, label: '60% zone' }}
          steps={[
            { upTo: 12570, rate: 0 },
            { upTo: 50270, rate: 28 },
            { upTo: 100000, rate: 42 },
            { upTo: 125140, rate: 62 },
            { upTo: 160000, rate: 47 },
          ]}
        />
        <p>
          The ugly spike between £100,000 and £125,140 is the one to watch. If your salary plus bonus lands in there, part of the bonus is effectively taxed at 60% because you are losing your Personal Allowance on top of paying higher-rate tax. A bonus that drops you into that zone is the most expensive money you will ever be handed.
        </p>
      </>
    ),
  },
  {
    id: 'sacrifice',
    title: 'The bonus sacrifice trick',
    body: (
      <>
        <p>
          Here is the move that changes everything: before the bonus is paid, you ask your employer to put some or all of it straight into your pension. It never hits your payslip as cash, so it never gets taxed. You give up money now in exchange for almost none of it being lost.
        </p>
        <StatGrid items={[
          { value: '£0', label: 'Tax on sacrificed bonus', sub: 'It skips Income Tax and NI entirely', tone: '#10b981' },
          { value: '60%', label: 'Saved in the trap zone', sub: 'If it keeps you under £100k', tone: '#be123c' },
          { value: '13.8%', label: 'Employer NI', sub: 'Often added to your pot too', tone: '#6366f1' },
        ]} />
        <p>
          The trade-off is real — that money is locked away until pension age, so this is not for cash you actually need this month. But if you were going to save anyway, redirecting a bonus is about the most efficient way to do it. The calculator above shows exactly how much tax you claw back for any amount you redirect.
        </p>
        <div className="note">
          <span className="noteTitle">Timing matters</span>
          <p>
            Bonus sacrifice has to be agreed before you become entitled to the bonus — you cannot take the cash and then decide to sacrifice it after the fact. If your employer offers it, sort the paperwork early, well before the bonus run.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'traps',
    title: 'The thresholds a bonus can trip',
    body: (
      <>
        <p>
          A bonus does not just get taxed — it can shove your total income across lines that trigger separate penalties. Three to keep an eye on.
        </p>
        <TipCards items={[
          { icon: Gift, title: 'Child Benefit (£60k+)', body: 'Cross £60,000 and Child Benefit starts being clawed back, gone entirely by £80,000. A bonus can wipe out a chunk of it for the year.' },
          { icon: Scale, title: 'Personal Allowance (£100k+)', body: 'Past £100,000 your tax-free allowance tapers away, creating that 60% effective band. Sacrifice enough to stay under it.' },
          { icon: PiggyBank, title: 'Pension annual allowance', body: 'You can normally only put £60,000 a year into a pension with tax relief. A huge bonus sacrifice could brush against that ceiling.' },
        ]} />
        <p>
          The pattern with all three is the same: it is the total that matters, not the bonus in isolation. That is why the calculator works out your tax with and without the bonus and shows you the gap — including any Child Benefit charge it sets off.
        </p>
      </>
    ),
  },
  {
    id: 'payslip',
    title: 'Why one payslip can look wrong',
    body: (
      <>
        <p>
          A common panic: the bonus month shows a brutal tax deduction, far more than you expected. Usually nothing has gone wrong. PAYE works month by month and, when it sees a big month, it assumes you will earn that much every month from now on — so it taxes you as if you suddenly became a much higher earner.
        </p>
        <p>
          Over the following months, as your pay drops back to normal, the system notices and quietly refunds the over-deduction. By the end of the tax year it all evens out. So judge the damage on the annual figure, not the scary single payslip. If you have left the job or the year has ended and it has not corrected, that is when it is worth a word with HMRC.
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
          It works out your full-year tax twice: once on your salary alone, and once with the bonus added on top. The difference in take-home is the cash you actually keep, and everything else is what the bonus cost you. When you redirect part of the bonus into a pension, it runs a third calculation on the reduced amount and shows how much tax that move saves.
        </p>
        <p>
          It uses 2026/27 thresholds and includes Income Tax, National Insurance, student loans and the Child Benefit charge. It assumes the bonus is paid as normal earnings in the year. It will not model deferred or share-based bonuses, which follow their own rules — for those, treat this as the cash-equivalent picture and check the specifics with your payroll team.
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

export default function BonusTaxPage() {
  return (
    <CalcLayout
      crumb={[{ label: 'Home', href: '/' }, { label: 'Tax & Income', href: '/category/tax' }, { label: 'Bonus & Overtime' }]}
      eyebrow="Bonus tax · 2026/27"
      title="Bonus Tax Calculator"
      deck="See how much of your bonus you actually keep after Income Tax, National Insurance and student loans — and how much you claw back by redirecting it into your pension."
      verified="HMRC 2026/27 verified"
      url="/bonus-tax"
      methodology={{
        summary: 'Calculates your tax on salary alone versus salary plus bonus, so the difference is the real cash you keep. Bonus sacrifice is modelled by reducing the taxable bonus. Includes Income Tax, NI, student loans and the Child Benefit charge on 2026/27 thresholds.',
        govUrl: 'https://www.gov.uk/income-tax-rates',
        govLabel: 'gov.uk · Income Tax rates',
      }}
      faqs={FAQS}
      article={{
        heading: 'How your bonus is really taxed',
        readingTime: '8 min read · updated May 2026',
        sections: ARTICLE,
      }}
      disclaimer="Estimates based on 2026/27 HMRC thresholds for educational purposes only. This is not regulated financial advice; deferred or share-based bonuses follow different rules. Confirm with HMRC or your payroll team."
    >
      <BonusTaxClient />
    </CalcLayout>
  );
}
