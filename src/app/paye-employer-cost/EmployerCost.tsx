'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, NumberInput, Toggle,
  Donut, Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';

const PRIMARY = '#0037b0';
const ACCENT = '#bb0027';
const SECONDARY_THRESHOLD = 5000;   // employer NI starts here
const EMPLOYER_NI_RATE = 0.15;      // 15%
const QE_LOWER = 6240;              // pension qualifying earnings band
const QE_UPPER = 50270;
const EMPLOYMENT_ALLOWANCE = 10500; // 2025/26

const RELATED = [
  { href: '/salary-vs-dividend-calculator', label: 'Salary vs Dividend', hint: 'Optimal director split' },
  { href: '/corporation-tax-calculator', label: 'Corporation Tax', hint: '19% / 25% + marginal relief' },
  { href: '/sole-trader-vs-limited', label: 'Sole Trader vs Limited', hint: 'Structure comparison' },
  { href: '/vat-calculator', label: 'VAT Calculator', hint: 'Add/remove 20% VAT' },
];

export default function EmployerCost() {
  const [salary, setSalary] = useState(35000);
  const [pensionPct, setPensionPct] = useState(3);
  const [claimEA, setClaimEA] = useState(false);

  const r = useMemo(() => {
    const employerNiRaw = Math.max(0, salary - SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE;
    const employerNi = claimEA ? Math.max(0, employerNiRaw - EMPLOYMENT_ALLOWANCE) : employerNiRaw;

    const qualifyingEarnings = Math.max(0, Math.min(salary, QE_UPPER) - QE_LOWER);
    const pension = qualifyingEarnings * (pensionPct / 100);

    const totalCost = salary + employerNi + pension;
    const onCostPct = salary > 0 ? (totalCost - salary) / salary : 0;

    return { employerNi, pension, totalCost, onCostPct, monthly: totalCost / 12 };
  }, [salary, pensionPct, claimEA]);

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Business', href: '/category/business' }, { label: 'Employer Cost' }]}
      title="Employer Cost Calculator"
      subtitle="See the true cost of a hire in 2025/26, gross salary plus employer National Insurance (15%) and minimum auto-enrolment pension contributions."
      calcLabel="Calculate True Cost"
      inputs={
        <Panel title="The Role">
          <div className="space-y-4">
            <Field label="Gross annual salary"><MoneyInput value={salary} onChange={setSalary} step={1000} /></Field>
            <Field label="Employer pension contribution (%)" hint="Auto-enrolment minimum is 3% of qualifying earnings">
              <NumberInput value={pensionPct} onChange={setPensionPct} suffix="%" min={0} step={0.5} />
            </Field>
            <Toggle
              checked={claimEA}
              onChange={setClaimEA}
              label={<span>Claim Employment Allowance (£10,500)</span>}
            />
            <p className="text-[11px] text-on-surface-variant">Most single-director companies with no other employees cannot claim the Employment Allowance.</p>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="True Annual Cost" value={gbp(r.totalCost)} sub={`${pct(r.onCostPct * 100)} on top of salary`} tone="dark" big />
            <Stat label="Per Month" value={gbp(r.monthly)} sub="Total employment cost" tone="primary" />
            <Stat label="Employer NI" value={gbp(r.employerNi)} sub="15% over £5,000" tone="accent" />
            <Stat label="Employer Pension" value={gbp(r.pension)} sub={`${pensionPct}% of qualifying pay`} />
          </div>

          <Panel title="Cost Breakdown">
            <Donut
              centerLabel="Total cost"
              centerValue={gbp(r.totalCost)}
              segments={[
                { value: salary, color: PRIMARY, label: 'Gross salary' },
                { value: r.employerNi, color: ACCENT, label: 'Employer NI' },
                { value: r.pension, color: '#0a8f5b', label: 'Employer pension' },
              ]}
            />
          </Panel>

          <p className="text-[11px] text-on-surface-variant">Estimate for 2025/26. Excludes apprenticeship levy (paybill over £3m), benefits, equipment, recruitment and the Class 1A NIC on taxable benefits.</p>
        </>
      }
    >
      <Guide
        title="The true cost of an employee (2025/26)"
        intro="A salary is only part of what an employee costs you. On top of gross pay, an employer pays National Insurance, a minimum workplace pension, and often benefits and overheads. Budgeting on salary alone routinely understates the real cost by 15 to 20%."
      >
        <GuideSection kicker="Employer NI" title="Secondary Class 1 National Insurance, 15%">
          <p>From 6 April 2025 employer (secondary) National Insurance is charged at <strong>15%</strong> on earnings above the secondary threshold of <strong>£5,000</strong> a year. That threshold dropped sharply from £9,100, and the rate rose from 13.8%, so employing staff costs noticeably more in 2025/26 than before.</p>
          <pre className="bg-surface-container p-3 rounded-lg text-xs font-mono tabular-nums text-on-surface">
            Employer NI = (Salary − £5,000) × 15%
          </pre>
        </GuideSection>

        <GuideSection kicker="Pensions" title="Auto-enrolment workplace pension">
          <p>You must automatically enrol eligible staff into a workplace pension and contribute at least <strong>3%</strong> of their qualifying earnings. Qualifying earnings for 2025/26 are the slice of pay between <strong>£6,240</strong> and <strong>£50,270</strong>. Total minimum contributions are 8% (3% employer + 5% employee).</p>
        </GuideSection>

        <GuideSection kicker="Relief" title="The Employment Allowance">
          <p>Eligible employers can claim the <strong>Employment Allowance</strong>, which reduces their annual employer NI bill by up to <strong>£10,500</strong> in 2025/26. However, a limited company whose only employee is also a director generally cannot claim it, a common trap for one-person companies.</p>
        </GuideSection>

        <GuideSection kicker="Worked example" title="Hiring on £35,000">
          <p>Take an employee on £35,000 with the minimum 3% pension and no Employment Allowance:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Employer NI: (£35,000 − £5,000) × 15% = <strong>£4,500</strong>.</li>
            <li>Qualifying earnings: £35,000 − £6,240 = £28,760.</li>
            <li>Employer pension: £28,760 × 3% = <strong>£862.80</strong>.</li>
            <li>True cost: £35,000 + £4,500 + £863 = <strong>£40,363</strong>, about 15.3% on top of salary.</li>
          </ul>
        </GuideSection>

        <GuideSection kicker="Don't forget" title="The costs this calculator excludes">
          <p>Beyond pay, NI and pension, budget for: recruitment fees, equipment and software, training, holiday and sick cover, Class 1A NI on taxable benefits, employer's liability insurance, and office space. A useful rule of thumb is that the fully-loaded cost of an employee is 20 to 30% above their gross salary.</p>
          <Callout tone="warn" title="Benefits attract their own NI">
            Taxable benefits like a company car or private medical cover trigger Class 1A employer NI at 15% on the benefit value, an extra cost on top of the figures above.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common employer cost mistakes">
          <Mistakes items={[
            ['Budgeting on salary alone', 'Employer NI and pension add roughly 15% before you count any benefits or overheads.'],
            ['Assuming you can claim Employment Allowance', 'Single-director companies with no other staff usually cannot claim the £10,500 allowance.'],
            ['Ignoring the £5,000 secondary threshold change', 'The threshold fell to £5,000 and the rate rose to 15% in April 2025, raising costs versus prior years.'],
            ['Forgetting Class 1A on benefits', 'Company cars and medical cover add 15% employer NI on the benefit value each year.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'What is the secondary threshold?', a: 'It is the salary level above which employers start paying NI on an employee. For 2025/26 it is £5,000 a year.' },
            { q: 'Do I pay employer NI on pension contributions?', a: 'No. Employer pension contributions are not subject to employer NI, which is part of why salary sacrifice into pensions is tax-efficient.' },
            { q: 'Is the apprenticeship levy included?', a: 'No. The 0.5% apprenticeship levy only applies to employers with an annual pay bill over £3 million, so it is excluded here.' },
            { q: 'How much should I budget above salary?', a: 'As a planning rule, allow 20 to 30% on top of gross salary once you include NI, pension, benefits, equipment and overheads.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
