'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput,
  Donut, Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';

const SMALL_RATE = 0.19;
const MAIN_RATE = 0.25;
const LOWER = 50000;
const UPPER = 250000;
const MR_FRACTION = 3 / 200;

const RELATED = [
  { href: '/vat-calculator', label: 'VAT Calculator', hint: 'Add/remove 20% VAT' },
  { href: '/sole-trader-vs-limited', label: 'Sole Trader vs Limited', hint: 'Best structure for take-home' },
  { href: '/salary-vs-dividend-calculator', label: 'Salary vs Dividend', hint: 'Optimal director pay split' },
  { href: '/director-dividend', label: 'Dividend Tax', hint: 'Tax on profit extraction' },
];

export default function CorpTax() {
  const [profit, setProfit] = useState(120000);
  const [associated, setAssociated] = useState(0);

  const r = useMemo(() => {
    const divisor = associated + 1;
    const lower = LOWER / divisor;
    const upper = UPPER / divisor;

    let tax = 0;
    let band: 'small' | 'marginal' | 'main';
    if (profit <= lower) {
      tax = profit * SMALL_RATE;
      band = 'small';
    } else if (profit >= upper) {
      tax = profit * MAIN_RATE;
      band = 'main';
    } else {
      tax = profit * MAIN_RATE - (upper - profit) * MR_FRACTION;
      band = 'marginal';
    }

    const effective = profit > 0 ? tax / profit : 0;
    const afterTax = profit - tax;
    // marginal rate on the next £1 of profit while in the relief zone is 26.5%
    const marginalRate = band === 'marginal' ? 0.265 : band === 'main' ? MAIN_RATE : SMALL_RATE;

    return { tax, effective, afterTax, band, lower, upper, marginalRate };
  }, [profit, associated]);

  const bandLabel = r.band === 'small' ? 'Small profits rate (19%)'
    : r.band === 'main' ? 'Main rate (25%)' : 'Marginal relief zone';

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Business', href: '/category/business' }, { label: 'Corporation Tax' }]}
      title="Corporation Tax Calculator"
      subtitle="Work out your UK limited company corporation tax for 2025/26 — 19% small profits rate, 25% main rate, and marginal relief in between."
      calcLabel="Calculate Corporation Tax"
      inputs={
        <Panel title="Company Profit">
          <div className="space-y-4">
            <Field label="Taxable profit (after allowable expenses)" hint="Profit chargeable to corporation tax for the accounting period">
              <MoneyInput value={profit} onChange={setProfit} step={5000} />
            </Field>
            <Field label="Associated companies" hint="Other companies under common control — they share the £50k/£250k thresholds">
              <NumberInput value={associated} onChange={setAssociated} min={0} step={1} />
            </Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Corporation Tax" value={gbp(r.tax)} sub={bandLabel} tone="dark" big />
            <Stat label="Profit After Tax" value={gbp(r.afterTax)} sub="Retained / distributable" tone="primary" />
            <Stat label="Effective Rate" value={pct(r.effective * 100)} sub="Tax ÷ profit" tone="accent" />
            <Stat label="Marginal Rate" value={pct(r.marginalRate * 100)} sub="On the next £1 of profit" />
          </div>

          <Panel title="Profit Split">
            <Donut
              centerLabel="Taxable profit"
              centerValue={gbp(profit)}
              segments={[
                { value: r.afterTax, color: PRIMARY, label: 'Profit after tax' },
                { value: r.tax, color: ACCENT, label: 'Corporation tax' },
              ]}
            />
          </Panel>

          {r.band === 'marginal' && (
            <Callout tone="warn" title="You are in the marginal relief zone">
              Profits between {gbp(r.lower)} and {gbp(r.upper)} are taxed at an effective{' '}
              <strong>26.5%</strong> on each extra pound — higher than the 25% main rate. Pension
              contributions or timing income can reduce the bite.
            </Callout>
          )}

          <p className="text-[11px] text-on-surface-variant">Estimate based on 2025/26 HMRC rates. Assumes a 12-month accounting period and no investment-income adjustments. Confirm with your accountant.</p>
        </>
      }
    >
      <Guide
        title="UK Corporation Tax explained (2025/26)"
        intro="Every UK limited company pays corporation tax on its profits. Since April 2023 the rate is no longer a flat 19% — it depends on how much profit you make, with a tapering 'marginal relief' band in the middle. Here's how it works."
      >
        <GuideSection kicker="The rates" title="Three rates, two thresholds">
          <p>For the 2025/26 financial year there are effectively three outcomes depending on your taxable profit:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Small profits rate — 19%:</strong> applies if your profits are £50,000 or less.</li>
            <li><strong>Main rate — 25%:</strong> applies if your profits are £250,000 or more.</li>
            <li><strong>Marginal relief:</strong> between £50,000 and £250,000 you pay the 25% main rate but get a reduction, giving a smooth taper. The effective rate on profit inside this band works out at 26.5% per extra pound.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="The maths" title="The marginal relief formula">
          <p>HMRC calculates marginal relief as:</p>
          <pre className="bg-surface-container p-3 rounded-lg text-xs font-mono tabular-nums text-on-surface">
            Tax = (Profit × 25%) − (Upper Limit − Profit) × 3/200
          </pre>
          <p>The 3/200 figure is the standard marginal relief fraction. The £250,000 upper limit and £50,000 lower limit are reduced if you have associated companies (see below).</p>
        </GuideSection>

        <GuideSection kicker="Worked example" title="A company with £120,000 profit">
          <p>Take a company with £120,000 taxable profit and no associated companies. It falls in the marginal relief zone:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Main-rate tax: £120,000 × 25% = £30,000.</li>
            <li>Marginal relief: (£250,000 − £120,000) × 3/200 = £130,000 × 0.015 = £1,950.</li>
            <li>Corporation tax due: £30,000 − £1,950 = <strong>£28,050</strong>.</li>
            <li>Effective rate: £28,050 ÷ £120,000 = <strong>23.4%</strong>.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Watch out" title="Associated companies share the thresholds">
          <p>If you control more than one company (or your group does), the £50,000 and £250,000 thresholds are divided by the number of associated companies plus one. Two associated companies means the small profits ceiling drops to £25,000 each and the main-rate floor to £125,000 — pushing more profit into higher tax. This catches people running several limited companies.</p>
        </GuideSection>

        <GuideSection kicker="Pay & file" title="Deadlines you cannot miss">
          <p>Corporation tax is due <strong>9 months and 1 day</strong> after the end of your accounting period — before the company tax return (CT600) deadline, which is 12 months after period end. Large companies (profits over £1.5m) pay in quarterly instalments instead.</p>
          <Callout tone="warn" title="Pay before you file">
            Unlike personal tax, the corporation tax payment deadline comes <em>before</em> the filing deadline. Missing it triggers interest from HMRC immediately.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common corporation tax mistakes">
          <Mistakes items={[
            ['Forgetting associated companies', 'Running several limited companies splits your thresholds, quietly raising the effective rate on each one.'],
            ['Confusing turnover with profit', 'Corporation tax is charged on profit after allowable expenses and capital allowances — not on sales.'],
            ['Missing the payment deadline', 'Tax is due 9 months and 1 day after period end, well before the CT600 filing deadline.'],
            ['Ignoring marginal relief planning', 'Profits in the £50k–£250k band cost 26.5% at the margin; pension contributions can be more tax-efficient than leaving cash in the company.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'When did the 25% rate start?', a: 'The 25% main rate and marginal relief system began on 1 April 2023, replacing the previous flat 19% rate. They continue for 2025/26.' },
            { q: 'Do I pay corporation tax and dividend tax?', a: 'Yes. The company pays corporation tax on profits, then you personally pay dividend tax when you extract profit as dividends. This is "double taxation" and why salary/dividend planning matters.' },
            { q: 'Can I reduce my corporation tax bill?', a: 'Legitimately, yes — employer pension contributions, the Annual Investment Allowance on equipment, R&D relief, and claiming all allowable expenses all reduce taxable profit.' },
            { q: 'What if my accounting period is not 12 months?', a: 'The thresholds are pro-rated for shorter or longer periods. This calculator assumes a standard 12-month period.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
