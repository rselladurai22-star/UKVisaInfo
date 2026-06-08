'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput,
  Donut, Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import {
  gbp, incomeTax, employeeNI, dividendTax,
} from '../../lib/tax2526';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

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

const CANDIDATES = [
  { salary: 5000, label: '£5,000 (no employer NI)' },
  { salary: 9100, label: '£9,100 (old threshold)' },
  { salary: 12570, label: '£12,570 (full allowance)' },
];

function netForSalary(profit: number, salary: number) {
  const employerNi = Math.max(0, salary - SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE;
  const employeeNi = employeeNI(salary);
  const salaryTax = incomeTax(salary);
  const companyProfit = Math.max(0, profit - salary - employerNi);
  const ct = corpTax(companyProfit);
  const dividends = Math.max(0, companyProfit - ct);
  const divTax = dividendTax(salary, dividends);
  const net = salary - employeeNi - salaryTax + dividends - divTax;
  const totalTax = employerNi + employeeNi + salaryTax + ct + divTax;
  return { salary, employerNi, employeeNi, salaryTax, companyProfit, ct, dividends, divTax, net, totalTax };
}

const RELATED = [
  { href: '/sole-trader-vs-limited', label: 'Sole Trader vs Limited', hint: 'Best structure for take-home' },
  { href: '/corporation-tax-calculator', label: 'Corporation Tax', hint: '19% / 25% + marginal relief' },
  { href: '/director-dividend', label: 'Dividend Tax', hint: 'Tax on profit extraction' },
  { href: '/paye-employer-cost', label: 'Employer Cost', hint: 'True cost of a hire' },
];

export default function SalaryVsDividend() {
  const [profit, setProfit] = useState(60000);

  const r = useMemo(() => {
    const rows = CANDIDATES.map((c) => ({ ...c, ...netForSalary(profit, c.salary) }));
    const best = rows.reduce((a, b) => (b.net > a.net ? b : a), rows[0]);
    return { rows, best };
  }, [profit]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Business', href: '/category/business' }, { label: 'Salary vs Dividend' }]}
      title="Salary vs Dividend Calculator"
      subtitle="Find the most tax-efficient director split for 2025/26 — how much to take as salary and how much as dividends from your limited company profit."
      calcLabel="Find Optimal Split"
      inputs={
        <Panel title="Company Profit">
          <div className="space-y-4">
            <Field label="Profit available before director pay" hint="Company profit before any salary or dividends are taken out">
              <MoneyInput value={profit} onChange={setProfit} step={5000} />
            </Field>
            <p className="text-[11px] text-on-surface-variant">We compare common director salary levels and show which leaves the most in your pocket after employer NI, corporation tax, income tax and dividend tax.</p>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Best Net Take-Home" value={gbp(r.best.net)} sub={`Salary ${gbp(r.best.salary)} + dividends`} tone="dark" big />
            <Stat label="Recommended Salary" value={gbp(r.best.salary)} sub="Then dividends for the rest" tone="primary" />
            <Stat label="Dividends Drawn" value={gbp(r.best.dividends)} sub={`After ${gbp(r.best.ct)} corp tax`} tone="accent" />
            <Stat label="Total Tax & NI" value={gbp(r.best.totalTax)} sub={`${pct(profit > 0 ? (r.best.totalTax / profit) * 100 : 0)} of profit`} />
          </div>

          <Panel title="Optimal split">
            <Donut
              centerLabel="Net take-home"
              centerValue={gbp(r.best.net)}
              segments={[
                { value: r.best.salary - r.best.employeeNi - r.best.salaryTax, color: PRIMARY, label: 'Net salary' },
                { value: r.best.dividends - r.best.divTax, color: '#0a8f5b', label: 'Net dividends' },
                { value: r.best.totalTax, color: ACCENT, label: 'Tax & NI' },
              ]}
            />
          </Panel>

          <Panel title="Salary level comparison">
            <div className="space-y-2 text-sm w-full">
              {r.rows.map((row) => (
                <div key={row.salary} className={`flex justify-between rounded-lg px-2 py-1.5 ${row.salary === r.best.salary ? 'bg-emerald-50/40 font-semibold' : ''}`}>
                  <span className="text-on-surface-variant">{row.label}</span>
                  <span className="tabular-nums">{gbp(row.net)}</span>
                </div>
              ))}
            </div>
          </Panel>

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26 (England, Wales & NI). Single-director company assumed (no Employment Allowance). Ignores pensions, other income and student loans. Get tailored advice.</p>
        </>
      }
    >
      <Guide
        title="Salary vs dividends for company directors (2025/26)"
        intro="If you own and run a limited company, you choose how to pay yourself: a salary through PAYE, dividends from post-tax profit, or — almost always best — a mix of both. The optimal split balances National Insurance, corporation tax relief and dividend tax."
      >
        <GuideSection kicker="The trade-off" title="Why a mix beats either extreme">
          <p>Salary and dividends are taxed very differently:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Salary</strong> is a deductible company expense (it reduces corporation tax) but attracts income tax and both employee and employer National Insurance.</li>
            <li><strong>Dividends</strong> are paid from profit after corporation tax, so they don't reduce the company's tax, but they carry no NI and are taxed at lower rates (8.75% / 33.75% / 39.35%).</li>
          </ul>
          <p>The classic answer is a small salary plus dividends — enough salary to protect your State Pension record and use reliefs, with the balance as dividends.</p>
        </GuideSection>

        <GuideSection kicker="Salary level" title="How much salary should a director take?">
          <p>Two salary levels dominate the debate for 2025/26:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>£5,000 — the secondary threshold:</strong> below this, the company pays no employer NI, but you don't fully use the personal allowance against salary.</li>
            <li><strong>£12,570 — the personal allowance:</strong> a higher salary means more corporation-tax relief, but the company pays 15% employer NI on pay above £5,000.</li>
          </ul>
          <p>For most single-director companies, a £12,570 salary still wins narrowly because corporation tax relief at 19–26.5% outweighs the 15% employer NI. Companies that can claim the Employment Allowance (which a sole director cannot) favour £12,570 even more clearly.</p>
        </GuideSection>

        <GuideSection kicker="Worked example" title="£60,000 profit">
          <p>With £60,000 profit, paying a £12,570 salary leaves about £45,000 of company profit, taxed at corporation tax, then drawn as dividends. After the £500 dividend allowance, basic-rate dividends are taxed at 8.75% and higher-rate at 33.75%. Running the numbers, the £12,570-salary route typically leaves a few hundred pounds more than the £5,000 route — small but free money once your payroll is set up.</p>
          <Callout tone="tip" title="Protect your State Pension">
            A salary at or above the Lower Earnings Limit (£6,396 for 2025/26) gives you a qualifying year for the State Pension even if no NI is actually due. This is a key reason not to set salary too low.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Dividends" title="Dividend rules you must follow">
          <p>Dividends can only be paid from retained, post-tax profit. You must have enough distributable reserves, hold a board meeting (even a one-person one), and keep dividend vouchers. Paying dividends the company can't support creates an "illegal dividend" that HMRC or a liquidator can claw back.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common salary/dividend mistakes">
          <Mistakes items={[
            ['Taking all salary or all dividends', 'A blend almost always beats either extreme once NI and corporation tax relief are weighed.'],
            ['Setting salary below the Lower Earnings Limit', 'Drop below £6,396 and you may miss a qualifying year for the State Pension.'],
            ['Paying dividends with no distributable profit', 'Illegal dividends can be reclaimed and create personal tax problems.'],
            ['Forgetting the £500 dividend allowance shrank', 'The dividend allowance is now just £500, so most dividends are taxable from the first few hundred pounds.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'Is it better to take salary or dividends?', a: 'A small salary plus dividends is almost always most efficient. Pure salary wastes the NI advantage of dividends; pure dividends wastes corporation-tax relief and may miss State Pension credits.' },
            { q: 'What is the dividend allowance for 2025/26?', a: 'The tax-free dividend allowance is £500. Dividends above that are taxed at 8.75%, 33.75% or 39.35% depending on your income tax band.' },
            { q: 'Can my spouse be a shareholder?', a: 'Yes, and splitting dividends with a lower-earning spouse who genuinely owns shares can reduce the household tax bill — but get advice to avoid settlements-legislation issues.' },
            { q: 'Do dividends count for a mortgage?', a: 'Lenders usually accept dividends as income, but often want two to three years of company accounts and SA302s, so very low salaries can complicate borrowing.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
