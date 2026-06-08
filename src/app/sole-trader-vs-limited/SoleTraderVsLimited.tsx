'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import RelatedGuides from '../../components/RelatedGuides';
import {
  gbp, incomeTax, class4NI, employeeNI, dividendTax,
} from '../../lib/tax2526';

const PA = 12570;
const SECONDARY_THRESHOLD = 5000;
const EMPLOYER_NI_RATE = 0.15;
const CT_LOWER = 50000;
const CT_UPPER = 250000;
const CT_SMALL = 0.19;
const CT_MAIN = 0.25;
const CT_MR = 3 / 200;

function corpTax(profit: number): number {
  if (profit <= 0) return 0;
  if (profit <= CT_LOWER) return profit * CT_SMALL;
  if (profit >= CT_UPPER) return profit * CT_MAIN;
  return profit * CT_MAIN - (CT_UPPER - profit) * CT_MR;
}

const RELATED = [
  { href: '/corporation-tax-calculator', label: 'Corporation Tax', hint: '19% / 25% + marginal relief' },
  { href: '/salary-vs-dividend-calculator', label: 'Salary vs Dividend', hint: 'Optimal director split' },
  { href: '/self-employed-tax', label: 'Self-Employed Tax', hint: 'Sole trader tax & Class 4 NI' },
  { href: '/director-dividend', label: 'Dividend Tax', hint: 'Tax on profit extraction' },
];

export default function SoleTraderVsLimited() {
  const [profit, setProfit] = useState(60000);

  const r = useMemo(() => {
    // ── Sole trader ──
    const stIncomeTax = incomeTax(profit);
    const stNi = class4NI(profit);
    const stTakeHome = profit - stIncomeTax - stNi;

    // ── Limited (salary at PA + dividends) ──
    const salary = Math.min(PA, Math.max(0, profit));
    const employerNi = Math.max(0, salary - SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE;
    const companyProfit = Math.max(0, profit - salary - employerNi);
    const ct = corpTax(companyProfit);
    const dividends = Math.max(0, companyProfit - ct);
    const divTax = dividendTax(salary, dividends);
    const salaryTax = incomeTax(salary) + employeeNI(salary);
    const ltdTakeHome = salary + dividends - divTax - salaryTax;

    const ltdTotalTax = employerNi + ct + divTax + salaryTax;
    const stTotalTax = stIncomeTax + stNi;
    const saving = ltdTakeHome - stTakeHome;

    return {
      stIncomeTax, stNi, stTakeHome, stTotalTax,
      salary, employerNi, companyProfit, ct, dividends, divTax, salaryTax, ltdTakeHome, ltdTotalTax,
      saving, ltdBetter: saving > 0,
    };
  }, [profit]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Business', href: '/category/business' }, { label: 'Sole Trader vs Limited' }]}
      title="Sole Trader vs Limited Company"
      subtitle="Compare your 2025/26 take-home pay as a sole trader against running a limited company and extracting profit as a small salary plus dividends."
      calcLabel="Compare Take-Home"
      inputs={
        <Panel title="Your Business">
          <div className="space-y-4">
            <Field label="Annual profit (before tax)" hint="Profit after business expenses but before any tax">
              <MoneyInput value={profit} onChange={setProfit} step={5000} />
            </Field>
            <p className="text-[11px] text-on-surface-variant">The limited model assumes a director salary of £12,570 (the personal allowance) with the rest taken as dividends — the typical tax-efficient structure.</p>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Sole Trader Take-Home" value={gbp(r.stTakeHome)} sub={`Tax + NI ${gbp(r.stTotalTax)}`} tone="primary" big />
            <Stat label="Limited Take-Home" value={gbp(r.ltdTakeHome)} sub={`Total tax ${gbp(r.ltdTotalTax)}`} tone="dark" big />
          </div>

          <div className={`p-4 rounded-xl border text-sm ${r.ltdBetter ? 'border-emerald-500 bg-emerald-50/25' : 'border-blue-500 bg-blue-50/25'}`}>
            <h4 className="font-bold text-on-surface">{r.ltdBetter ? 'Limited company wins' : 'Sole trader wins'}</h4>
            <p className="mt-1 text-on-surface-variant leading-relaxed">
              At {gbp(profit)} profit, the {r.ltdBetter ? 'limited company' : 'sole trader'} route keeps{' '}
              <strong>{gbp(Math.abs(r.saving))}</strong> more per year. {r.ltdBetter
                ? 'Weigh this against extra admin, accountancy fees and filing duties.'
                : 'At lower profits the simplicity of sole trading usually wins.'}
            </p>
          </div>

          <Panel title="Limited company breakdown">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Director salary</span><span className="font-semibold tabular-nums">{gbp(r.salary)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Employer NI</span><span className="font-semibold tabular-nums">−{gbp(r.employerNi)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Corporation tax</span><span className="font-semibold tabular-nums">−{gbp(r.ct)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Dividends drawn</span><span className="font-semibold tabular-nums">{gbp(r.dividends)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">Dividend tax</span><span className="font-semibold tabular-nums">−{gbp(r.divTax)}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">Net take-home</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(r.ltdTakeHome)}</span></div>
            </div>
          </Panel>

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26 (England, Wales & NI). Ignores student loans, pension contributions, the £500 dividend allowance interactions with other income, and accountancy costs. Get advice before changing structure.</p>
        </>
      }
    >
      <Guide
        title="Sole trader vs limited company (2025/26)"
        intro="One of the biggest decisions for a UK business owner is whether to trade as a self-employed sole trader or incorporate a limited company. Tax is a major factor — but not the only one. This guide compares the take-home maths and the trade-offs."
      >
        <GuideSection kicker="Sole trader" title="How sole traders are taxed">
          <p>As a sole trader, you and the business are the same legal person. You pay <strong>income tax</strong> and <strong>Class 4 National Insurance</strong> on your profits through Self Assessment:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Income tax: 20% / 40% / 45% above the £12,570 personal allowance.</li>
            <li>Class 4 NI: 6% on profits between £12,570 and £50,270, then 2% above.</li>
            <li>Class 2 NI is now voluntary for most, but still builds your State Pension record.</li>
          </ul>
          <p>It's simple to run — no Companies House filing, no corporation tax, and your money is your own.</p>
        </GuideSection>

        <GuideSection kicker="Limited" title="How a limited company is taxed">
          <p>A limited company is a separate legal entity. The typical tax-efficient owner-director takes a small salary up to the personal allowance and draws the rest of the profit as dividends:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The company pays <strong>corporation tax</strong> (19%–25%) on its profits.</li>
            <li>A modest director's salary is usually set at £12,570 to use the personal allowance.</li>
            <li>Remaining post-tax profit is paid as <strong>dividends</strong>, taxed at 8.75% / 33.75% / 39.35% after the £500 dividend allowance.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Worked example" title="£60,000 profit compared">
          <p>At £60,000 annual profit, the sole trader pays income tax and Class 4 NI on the lot, while the limited company splits a £12,570 salary and dividends, paying corporation tax first then dividend tax. In most cases at this level the limited company leaves a few thousand pounds more in your pocket — but that gap narrows once you factor in accountancy fees (often £1,000–£2,000 a year) and the extra admin.</p>
          <Callout tone="tip" title="The crossover point">
            Incorporation usually starts to pay once profits comfortably exceed the personal allowance and you don't need to draw every penny. Below roughly £30,000 profit, sole trading is often simpler and barely costs more in tax.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Beyond tax" title="It's not only about the maths">
          <p>Tax is one input. Also weigh:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Limited liability:</strong> a company protects your personal assets if the business fails.</li>
            <li><strong>Credibility:</strong> some clients prefer to contract with a limited company.</li>
            <li><strong>Admin:</strong> annual accounts, a confirmation statement, corporation tax returns and payroll all add work.</li>
            <li><strong>Privacy:</strong> company accounts and director details are public at Companies House.</li>
            <li><strong>Retained profit:</strong> a company lets you leave profit in the business and draw it later, smoothing your tax.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common mistakes when choosing">
          <Mistakes items={[
            ['Incorporating too early', 'At low profits the tax saving is small and easily wiped out by accountancy fees and admin.'],
            ['Drawing dividends with no profit', 'Dividends can only be paid from retained post-tax profit — illegal dividends can be reclaimed by HMRC or a liquidator.'],
            ['Forgetting the salary triggers employer NI', 'A director salary above £5,000 now attracts 15% employer NI, slightly denting the limited-company advantage.'],
            ['Ignoring the bigger picture', 'Liability, IR35, pensions and mortgage applications can matter more than a small tax saving.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Can I switch from sole trader to limited later?', a: 'Yes — many businesses start as sole traders and incorporate once profits justify it. You transfer the trade and assets to the new company.' },
            { q: 'Do I have to take dividends?', a: 'No. You can leave profit in the company (after corporation tax) and draw it in a later year, which can keep you out of higher-rate dividend tax.' },
            { q: 'Is a limited company always cheaper on tax?', a: 'No. The advantage grows with profit, but at lower profits the gap is small and can be outweighed by accountancy costs and admin.' },
            { q: 'What about IR35?', a: 'If you work like an employee through your own company for one client, the off-payroll (IR35) rules can remove most of the tax benefit. See our IR35 tools.' },
          ]} />
        </GuideSection>
        <RelatedGuides calc="/sole-trader-vs-limited" />
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
