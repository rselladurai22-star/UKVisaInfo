import type { Metadata } from 'next';
import { TrendingUp, Wallet, Plane } from 'lucide-react';
import CalcLayout from '../../components/calc-shell/CalcLayout';
import type { ArticleSection } from '../../components/calc-shell/CalcArticle';
import type { FaqItem } from '../../components/calc-shell/FaqJsonLd';
import { StatGrid, TipCards } from '../../components/calc-shell/visuals';
import StudentLoanClient from './StudentLoanClient';

export const metadata: Metadata = {
  title: 'UK Student Loan Repayment Calculator 2026/27 — Plans 1, 2, 4, 5 & Postgrad',
  description:
    'Work out your monthly student loan repayment and see whether you will ever clear it or have it written off. Covers Plan 1, 2, 4, 5 and Postgraduate loans on 2026/27 thresholds.',
  alternates: { canonical: '/student-loan-repayment' },
  openGraph: {
    title: 'UK Student Loan Repayment Calculator 2026/27',
    description: 'Monthly repayment, lifetime projection and whether overpaying is worth it.',
    url: 'https://ukvisainfo.co.uk/student-loan-repayment',
    type: 'website',
  },
};

const FAQS: FaqItem[] = [
  {
    q: 'How much will I repay on my student loan?',
    a: 'For undergraduate plans you pay 9% of everything you earn above your plan threshold — not 9% of your whole salary. Postgraduate loans are 6%. If your income drops below the threshold, repayments stop automatically.',
  },
  {
    q: 'Should I overpay my student loan?',
    a: 'Usually no. Most graduates never clear the balance before it is written off, so overpaying just hands money to a debt that was about to vanish anyway. Only overpay if the calculator shows you clearing it well before the write-off date.',
  },
  {
    q: 'Does student loan debt affect my credit score or mortgage?',
    a: 'It does not appear on your credit file and does not directly affect your score. It can nudge a mortgage affordability assessment slightly because the 9% deduction reduces your take-home, but it is not treated like normal debt.',
  },
  {
    q: 'When is my student loan written off?',
    a: 'It depends on the plan: 25 years for Plan 1, 30 years for Plans 2 and 4 and Postgraduate, and 40 years for Plan 5 — counted from the April after you finished your course. Whatever is left at that point is cancelled.',
  },
];

const ARTICLE: ArticleSection[] = [
  {
    id: 'how',
    title: 'It is not really a debt — it is a payroll deduction',
    body: (
      <>
        <p>
          The word &quot;loan&quot; trips everyone up. A student loan behaves almost nothing like a credit card or a mortgage. You do not get chased for missed payments, the balance never shows on your credit file, and nobody can force you to pay faster. It works far more like a tax: a slice of your income, taken straight off your payslip, that only kicks in once you earn enough.
        </p>
        <StatGrid items={[
          { value: '9%', label: 'Undergraduate rate', sub: 'Of income above the threshold', tone: '#6366f1' },
          { value: '6%', label: 'Postgraduate rate', sub: 'Charged on top, separately', tone: '#0ea5e9' },
          { value: '£0', label: 'If you earn under it', sub: 'Repayments simply stop', tone: '#10b981' },
        ]} />
        <p>
          Crucially, the 9% only applies to the part of your salary above the threshold — not the whole thing. Earn £5,000 over the line and you repay 9% of £5,000, which is £450 a year, regardless of whether your balance is £20,000 or £60,000. Your debt size does not change your monthly payment at all. That one fact changes how you should think about the whole thing.
        </p>
      </>
    ),
  },
  {
    id: 'plans',
    title: 'Which plan you are on changes everything',
    body: (
      <>
        <p>
          There is no single &quot;student loan&quot; — there are five schemes with quite different thresholds and write-off rules, and the one you are on was decided by when and where you started studying. Get this wrong and every number you read about your loan is wrong too.
        </p>
        <table>
          <thead><tr><th>Plan</th><th>Who</th><th>Repay above</th><th>Written off</th></tr></thead>
          <tbody>
            <tr><td>Plan 1</td><td>England/Wales before Sep 2012</td><td>£26,065</td><td>25 years</td></tr>
            <tr><td>Plan 2</td><td>England/Wales 2012–2023</td><td>£28,470</td><td>30 years</td></tr>
            <tr><td>Plan 4</td><td>Scotland</td><td>£32,745</td><td>30 years</td></tr>
            <tr><td>Plan 5</td><td>England from Aug 2023</td><td>£25,000</td><td>40 years</td></tr>
            <tr><td>Postgrad</td><td>Master&apos;s / Doctoral</td><td>£21,000</td><td>30 years</td></tr>
          </tbody>
        </table>
        <p>
          Plan 5 is the one to watch for younger graduates — a lower threshold and a 40-year term means far more people will end up repaying it in full. If you are not sure which plan you are on, your online student finance account spells it out, and the calculator above lets you flip between them to see the difference.
        </p>
      </>
    ),
  },
  {
    id: 'writeoff',
    title: 'Most people never clear it — and that is fine',
    body: (
      <>
        <p>
          Here is the part that feels wrong but is genuinely true for a lot of graduates: you are not supposed to pay it all back. The balance is wiped after your plan&apos;s term, and unless you earn well above average for most of your career, that write-off arrives before you have cleared it.
        </p>
        <p>
          That is why the rising balance on your statement, with interest piling on top, often does not matter. If the loan is going to be cancelled anyway, the headline figure is just a number — what you actually pay is the 9% off your payslip for as long as you are over the threshold, and not a penny more. The calculator&apos;s projection chart shows the moment the write-off line crosses your balance, which is the only date that really matters.
        </p>
        <div className="note">
          <span className="noteTitle">When it does matter</span>
          <p>
            If you are a consistently high earner — think medicine, law, finance — you may clear the balance years before write-off. In that case the interest is real money and paying it down faster can save you. The calculator tells you which camp you are in.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'overpay',
    title: 'Should you ever overpay?',
    body: (
      <>
        <p>
          This is the question that matters, and the honest answer for most people is no. Overpaying a loan that was going to be written off is the same as setting fire to the money — you clear a debt you would never have finished paying, and you get nothing back. But the maths flips completely if you are on track to clear it early.
        </p>
        <TipCards items={[
          { icon: TrendingUp, title: 'On track to clear it? Maybe overpay', body: 'If the calculator shows you clearing the balance before write-off, overpayments cut the interest still compounding — that is a real saving.' },
          { icon: Wallet, title: 'Heading for write-off? Never overpay', body: 'If the balance gets cancelled anyway, every extra pound you throw at it is simply lost. Put it in a pension or savings instead.' },
          { icon: Plane, title: 'Moving abroad? Tell the SLC', body: 'Repayments are not collected through PAYE overseas — you arrange them directly. Ignore it and penalties can stack up.' },
        ]} />
        <p>
          The rule of thumb: do not overpay on instinct or because the balance makes you uncomfortable. Run your real numbers first. The discomfort of a big number is not a financial reason to act.
        </p>
      </>
    ),
  },
  {
    id: 'interest',
    title: 'The interest that makes the balance scary',
    body: (
      <>
        <p>
          Student loan interest is set by the Student Loans Company and moves with inflation, so the exact rate shifts over time. Plan 2 is the steepest — it slides from the inflation rate at the threshold up to inflation plus three points for high earners. Plan 5 is gentler, pegged to inflation only. Plan 1 and Plan 4 use a capped rate that tracks the Bank of England base rate.
        </p>
        <p>
          The reason the interest looks alarming and often does not bite is the same write-off logic from earlier: interest only costs you anything if you were going to repay the full balance. If you are heading for write-off, a 7% interest rate on a balance you will never clear is irrelevant. The calculator uses a representative mid-year rate for its projection, and you can override it in the advanced options to stress-test a higher figure.
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
          It takes your salary, applies the 9% (or 6% for postgraduate) above your plan&apos;s threshold, and projects the balance forward year by year — growing your salary by the rate you set, adding interest, and subtracting each year&apos;s repayments. It then finds whichever comes first: the year you clear the balance, or the year it is written off.
        </p>
        <p>
          The figures use 2026/27 thresholds and a representative interest rate, because the Student Loans Company sets the real rate monthly against RPI and the Bank rate. Treat the projection as a well-grounded estimate of the shape of your repayment, not a guarantee of the exact balance in year 23. For your precise current balance and rate, check your online student finance account.
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

export default function StudentLoanPage() {
  return (
    <CalcLayout
      crumb={[{ label: 'Home', href: '/' }, { label: 'Tax & Income', href: '/category/tax' }, { label: 'Student Loan' }]}
      eyebrow="Student loans · 2026/27"
      title="Student Loan Repayment Calculator"
      deck="See your monthly repayment, watch the balance projected to write-off, and find out whether you will ever clear it — for Plan 1, 2, 4, 5 and Postgraduate loans."
      verified="gov.uk verified"
      url="/student-loan-repayment"
      methodology={{
        summary: 'Applies the 9% (or 6% postgraduate) repayment above your plan threshold and projects the balance forward year by year with salary growth and representative interest, finding whichever comes first — full repayment or write-off. 2026/27 thresholds.',
        govUrl: 'https://www.gov.uk/repaying-your-student-loan/what-you-pay',
        govLabel: 'gov.uk · Repaying your student loan',
      }}
      faqs={FAQS}
      article={{
        heading: 'Student loans, the way they actually work',
        readingTime: '9 min read · updated May 2026',
        sections: ARTICLE,
      }}
      disclaimer="Estimates based on 2026/27 thresholds and a representative interest rate for educational purposes only. The Student Loans Company sets the actual rate monthly. Check your online account for your exact balance; this is not regulated financial advice."
    >
      <StudentLoanClient />
    </CalcLayout>
  );
}
