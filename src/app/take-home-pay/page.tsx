import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import TakeHomeCalculator from '../../components/take-home/TakeHomeCalculator';
import s from '../../components/calc/calc.module.css';

export const metadata: Metadata = {
  title: 'UK Take-Home Pay Calculator 2026/27 — PAYE, NI, Student Loan, Pension',
  description:
    'Free UK take-home pay calculator. Enter your salary and instantly see net pay after income tax, National Insurance, student loan repayments, pension contributions and salary sacrifice. 2026/27 HMRC rates.',
  alternates: { canonical: '/take-home-pay' },
  openGraph: {
    title: 'UK Take-Home Pay Calculator 2026/27',
    description: 'Net pay after tax, NI, student loan and pension. HMRC-verified 2026/27 rates.',
    url: 'https://ukvisainfo.co.uk/take-home-pay',
    type: 'website',
  },
};

const EXPLAIN = [
  { h: 'Income Tax (rUK)', p: 'Personal Allowance £12,570 (tapers £1-for-£2 above £100k). Basic 20% to £50,270, higher 40% to £125,140, additional 45% above.' },
  { h: 'Income Tax (Scotland)', p: 'Starter 19% · Basic 20% · Intermediate 21% · Higher 42% · Advanced 45% · Top 48%. Toggle “Scottish income tax”.' },
  { h: 'National Insurance', p: '8% on earnings between £12,570 and £50,270 (Primary Threshold to Upper Earnings Limit). 2% on earnings above the UEL.' },
  { h: 'Student loans', p: '9% above the plan threshold (Plan 1 £26,065 · Plan 2 £28,470 · Plan 4 £32,745 · Plan 5 £25,000) · Postgraduate 6% above £21,000.' },
  { h: 'Pension', p: 'Net-pay arrangement — your contribution reduces taxable pay. Salary-sacrificed pension also reduces the NI base.' },
  { h: 'Salary sacrifice', p: 'Pre-tax and pre-NI deduction for benefits like cycle-to-work, EV lease or extra pension. Cuts both your tax and NI.' },
];

const RELATED = [
  { href: '/national-insurance', title: 'National Insurance calculator', desc: 'Employee, employer and self-employed NI for the 2026/27 year.' },
  { href: '/pension-allowance', title: 'Pension allowance', desc: 'Annual allowance, taper and carry-forward — how much you can pay in.' },
  { href: '/tools/salary-checker', title: 'Skilled Worker salary checker', desc: 'Check your salary against the UK visa minimum and going rates by SOC code.' },
];

export default function TakeHomePayPage() {
  return (
    <div className={s.page}>
      <div className={s.wrap}>
        <div className={s.crumb}>
          <Link href="/">Home</Link><span className={s.sep}>›</span>
          <Link href="/tools">Tax &amp; Income</Link><span className={s.sep}>›</span>
          <span>Take-home pay</span>
        </div>

        <div className={s.toolHead}>
          <span className={s.tag}>Tax &amp; Income</span>
          <h1 className={s.h1}>Take-home pay calculator</h1>
          <p className={s.intro}>
            Drag your salary and see exactly what lands in your account after Income Tax, National Insurance,
            pension and student loan — live, for the 2026/27 tax year.
          </p>
          <span className={s.trust}><ShieldCheck size={15} /> HMRC-verified · Free · No sign-up</span>
        </div>

        <TakeHomeCalculator initialSalary={50000} />

        <section className={s.explain}>
          <h2>How the 2026/27 numbers work</h2>
          <div className={s.explainGrid}>
            {EXPLAIN.map((e) => (<div key={e.h}><h3>{e.h}</h3><p>{e.p}</p></div>))}
          </div>
          <p className={s.disclaimer}>
            For guidance only. This calculator does not account for benefits in kind, taxable expenses, K-codes,
            marriage allowance transfer, blind person&rsquo;s allowance, the child benefit High-Income Charge or the
            pension annual-allowance taper. For complex situations, check with HMRC or a chartered accountant.
          </p>
          <div className={s.srcline}>
            <ShieldCheck size={15} />
            <span>Rates from <a href="https://www.gov.uk/income-tax-rates" target="_blank" rel="noopener noreferrer">HMRC — Income Tax rates 2026/27</a> · Updated May 2026</span>
          </div>
        </section>

        <section className={s.related}>
          <p className={s.relHead}>Related tools</p>
          <h2 className={s.relH2}>What you might calculate next</h2>
          <div className={s.relGrid}>
            {RELATED.map((c) => (
              <Link key={c.href} href={c.href} className={s.relCard}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span>Open <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
