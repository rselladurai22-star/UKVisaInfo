'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Donut,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp, incomeTax, employeeNI, dividendTax, DIV_ALLOWANCE } from '../../lib/tax2526';
import { TAX_RELATED } from '../take-home-pay/TakeHome';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const VIOLET = '#7c3aed';
const GREEN = '#0a7d4f';

export default function DirectorDividend() {
  const [salary, setSalary] = useState(12570);
  const [dividends, setDividends] = useState(40000);

  const r = useMemo(() => {
    const salaryTax = incomeTax(salary);
    const salaryNI = employeeNI(salary);
    const divTax = dividendTax(salary, dividends);
    const total = salaryTax + salaryNI + divTax;
    const gross = salary + dividends;
    const net = Math.max(0, gross - total);
    const effRate = gross > 0 ? (total / gross) * 100 : 0;
    return { salaryTax, salaryNI, divTax, total, gross, net, effRate };
  }, [salary, dividends]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tax', href: '/category/tax' }, { label: 'Dividend Tax' }]}
      title="Dividend Tax Calculator"
      subtitle="For company directors and shareholders: see the personal tax on a salary-plus-dividends mix for 2025/26, including the £500 dividend allowance and 8.75% / 33.75% / 39.35% rates."
      calcLabel="Calculate tax"
      inputs={
        <Panel title="Your income">
          <div className="space-y-4">
            <Field label="Director's salary" hint="Often set at the £12,570 allowance"><MoneyInput value={salary} onChange={setSalary} step={500} /></Field>
            <Field label="Dividends taken"><MoneyInput value={dividends} onChange={setDividends} step={1000} /></Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Total personal tax" value={gbp(r.total)} sub={`${pct(r.effRate)} of income`} tone="dark" big />
            <Stat label="Net income" value={gbp(r.net)} sub="after tax + NI" tone="accent" />
            <Stat label="Dividend tax" value={gbp(r.divTax)} sub={`after £${DIV_ALLOWANCE} allowance`} />
          </div>
          <Panel title="Tax breakdown">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <Donut centerLabel="Gross income" centerValue={gbp(r.gross)} segments={[
                { value: r.net, color: GREEN, label: 'Net income' },
                { value: r.divTax, color: PRIMARY, label: 'Dividend tax' },
                { value: r.salaryTax, color: VIOLET, label: 'Income Tax (salary)' },
                { value: r.salaryNI, color: ACCENT, label: 'NI (salary)' },
              ]} />
              <div className="flex-1 space-y-2 text-sm w-full">
                <div className="flex justify-between"><span className="text-on-surface-variant">Income Tax (salary)</span><span className="font-semibold tabular-nums">{gbp(r.salaryTax)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">NI (salary)</span><span className="font-semibold tabular-nums">{gbp(r.salaryNI)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Dividend tax</span><span className="font-semibold tabular-nums">{gbp(r.divTax)}</span></div>
                <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant">Net income</span><span className="font-bold tabular-nums text-secondary">{gbp(r.net)}</span></div>
              </div>
            </div>
          </Panel>
          <Callout tone="info" title="This is your personal tax only">
            It excludes Corporation Tax the company already paid on its profits before dividends. Dividends can only be
            paid from post-tax profit — model the company side with the corporation tax tool.
          </Callout>
        </>
      }
    >
      <Guide
        title="Dividend tax and the salary/dividend mix"
        intro="Company directors usually pay themselves a small salary plus dividends. This guide explains dividend tax rates, the allowance, and why this mix is often more efficient than a large salary."
      >
        <GuideSection kicker="The basics" title="How dividends are taxed">
          <p>Dividends are paid from a company&apos;s post-tax profit and taxed personally at lower rates than salary. Everyone gets a <strong>£500 dividend allowance</strong> (taxed at 0%). Above that, dividends are taxed at <strong>8.75%</strong> (basic rate), <strong>33.75%</strong> (higher rate) and <strong>39.35%</strong> (additional rate), depending on where they sit on top of your other income. Crucially, <strong>no National Insurance</strong> is due on dividends — a key reason directors favour them.</p>
        </GuideSection>
        <GuideSection kicker="The strategy" title="Why a small salary plus dividends works">
          <p>A common approach is a salary around the <strong>£12,570 personal allowance</strong> — enough to use the allowance and count as a qualifying year for the State Pension, while keeping NI low — topped up with dividends. The salary is a deductible company expense (reducing Corporation Tax), and dividends avoid NI. The optimal split depends on profit levels and Corporation Tax, so model both sides.</p>
          <Callout tone="tip" title="Don't forget Corporation Tax">Dividends come from profit the company has already paid Corporation Tax on (19–25%). The headline dividend rates look low, but the combined company-plus-personal tax is what really matters.</Callout>
        </GuideSection>
        <GuideSection kicker="Rules" title="Paying dividends correctly">
          <p>Dividends can only be paid from <strong>retained profit</strong> — paying more than the company has made is an illegal dividend. You should record a board minute and issue a dividend voucher for each payment. Dividends are reported on your Self Assessment return, and the tax is due by 31 January. Taking dividends faster than profit allows, or mislabelling loans as dividends, can cause tax and legal problems.</p>
        </GuideSection>
        <GuideSection kicker="Avoid these" title="Common mistakes">
          <Mistakes items={[
            ['Paying dividends from insufficient profit', 'Only retained post-tax profit can be distributed — illegal dividends can be reclaimed and taxed.'],
            ['Forgetting Corporation Tax', 'The company pays 19–25% before any dividend. Judge efficiency on combined tax, not the dividend rate alone.'],
            ['Ignoring the shrinking allowance', 'The dividend allowance is just £500 now — far smaller than a few years ago, so more is taxable.'],
            ['No paperwork', 'Without board minutes and vouchers, HMRC can challenge the payments. Keep records.'],
          ]} />
        </GuideSection>
        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How much dividend can I take tax-free?', a: 'The first £500 of dividends each year is tax-free (the dividend allowance), on top of any unused personal allowance. Beyond that, dividend tax applies.' },
            { q: 'Do I pay National Insurance on dividends?', a: 'No — dividends are free of National Insurance, which is the main reason a salary-plus-dividends mix can be efficient for directors.' },
            { q: 'What salary should a director take?', a: 'Often around the £12,570 personal allowance — enough to secure a State Pension qualifying year and use the allowance while keeping NI low — with the rest as dividends. The optimum varies; take advice.' },
            { q: 'Is this my total tax?', a: 'No — this is your personal tax. The company also pays Corporation Tax on profits before dividends are paid. Consider both together.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={TAX_RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
