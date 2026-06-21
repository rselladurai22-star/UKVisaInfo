'use client';

import { useMemo, useState } from 'react';
import {
  pct, CalcShell, Panel, Stat, Field, MoneyInput, Choice,
  Guide, GuideSection, Callout, Mistakes, FAQ, RelatedTools,
} from '../../components/calc-ui';
import { gbp } from '../../lib/tax2526';
import { CITIES } from '../../data/cities';
import { findEquivalentGross } from '../../lib/salary-compare/equivalent';

const CITY_IDS = Object.keys(CITIES);
const cityOpts = CITY_IDS.map((id) => ({ value: id, label: CITIES[id].name, desc: `${CITIES[id].region} · ${gbp(CITIES[id].monthlyCost.total)}/mo` }));

const RELATED = [
  { href: '/take-home-pay', label: 'Take-Home Pay', hint: 'Net pay after tax & NI' },
  { href: '/minimum-wage-checker', label: 'Minimum Wage', hint: 'NLW £12.21 · 2025' },
  { href: '/cost-of-living-uk', label: 'Cost of Living', hint: 'City spending guide' },
  { href: '/holiday-pay', label: 'Holiday Pay', hint: '5.6 weeks entitlement' },
];

export default function SalaryCompare() {
  const [fromId, setFromId] = useState('manchester');
  const [toId, setToId] = useState('london');
  const [gross, setGross] = useState(45000);

  const r = useMemo(() => {
    const a = CITIES[fromId];
    const b = CITIES[toId];
    return findEquivalentGross({
      grossA: gross,
      monthlyCostA: a.monthlyCost.total,
      monthlyCostB: b.monthlyCost.total,
      scotlandA: a.region === 'Scotland',
      scotlandB: b.region === 'Scotland',
    });
  }, [fromId, toId, gross]);

  const fromName = CITIES[fromId].name;
  const toName = CITIES[toId].name;
  const needMore = r.delta > 0;

  return (
    <CalcShell
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Employment', href: '/category/employment' }, { label: 'Salary Compare' }]}
      title="City Salary Comparison Calculator"
      subtitle="See what salary you'd need in another UK city to keep the same disposable income, after tax and local cost of living."
      calcLabel="Compare Cities"
      inputs={
        <Panel title="Your Move">
          <div className="space-y-4">
            <Field label="Current city">
              <Choice<string> name="from" value={fromId} onChange={setFromId} options={cityOpts} />
            </Field>
            <Field label="Current gross salary"><MoneyInput value={gross} onChange={setGross} step={1000} /></Field>
            <Field label="Moving to">
              <Choice<string> name="to" value={toId} onChange={setToId} options={cityOpts} />
            </Field>
          </div>
        </Panel>
      }
      results={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label={`Equivalent in ${toName}`} value={gbp(Math.round(r.grossB))} sub={`To match ${fromName}`} tone="dark" big />
            <Stat label="Difference" value={`${needMore ? '+' : ''}${gbp(Math.round(r.delta))}`} sub={needMore ? 'You need more' : 'You could earn less'} tone={needMore ? 'accent' : 'primary'} />
            <Stat label={`Disposable in ${fromName}`} value={gbp(Math.round(r.disposableA))} sub="After tax & living costs" />
            <Stat label="Salary Ratio" value={pct((r.ratio - 1) * 100)} sub={`${toName} vs ${fromName}`} />
          </div>

          <Panel title="The comparison">
            <div className="space-y-2 text-sm w-full">
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">{fromName} gross</span><span className="font-semibold tabular-nums">{gbp(r.grossA)}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">{fromName} take-home</span><span className="font-semibold tabular-nums">{gbp(Math.round(r.netA))}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant font-medium">{fromName} disposable</span><span className="font-semibold tabular-nums text-primary">{gbp(Math.round(r.disposableA))}</span></div>
              <div className="pt-2 border-t border-outline-variant flex justify-between"><span className="text-on-surface-variant font-bold">{toName} equivalent gross</span><span className="font-bold tabular-nums text-secondary text-base">{gbp(Math.round(r.grossB))}</span></div>
            </div>
          </Panel>

          <p className="text-[11px] text-on-surface-variant">Estimate based on indicative single-adult cost-of-living figures per city and 2025/26 income tax (Scottish bands applied for Scottish cities). Real costs vary by lifestyle and neighbourhood.</p>
        </>
      }
    >
      <Guide
        title="Comparing salaries between UK cities"
        intro="A £45,000 salary stretches very differently in London than in Manchester. This tool works out the 'equivalent salary' you'd need elsewhere to keep the same disposable income, your take-home pay after tax, minus typical local living costs."
      >
        <GuideSection kicker="The idea" title="Disposable income, not headline pay">
          <p>Comparing gross salaries between cities is misleading because two things change: the tax you pay (Scotland has different bands) and your cost of living, dominated by rent. What actually matters is <strong>disposable income</strong>, what's left after tax and the basics. This calculator holds your disposable income constant and solves for the gross salary that delivers it in the new city.</p>
        </GuideSection>

        <GuideSection kicker="What drives the gap" title="Rent is the biggest factor">
          <p>For most people moving cities, rent is the single largest difference. London rents can be double those in the North, which is why a much higher salary is often needed just to break even. Transport, groceries and utilities also vary, but rent usually dominates the calculation.</p>
        </GuideSection>

        <GuideSection kicker="Tax" title="Don't forget Scottish income tax">
          <p>If you move to or from Scotland, your income tax changes. Scotland has additional bands and different rates, so the same gross salary produces a different take-home. This tool applies Scottish rates automatically for Scottish cities.</p>
          <Callout tone="tip" title="Negotiate on disposable income">
            When weighing a job offer in a pricier city, translate it into disposable income rather than the headline number, a 20% pay rise can still leave you worse off if rent doubles.
          </Callout>
        </GuideSection>

        <GuideSection kicker="Worked example" title="£45,000 Manchester to London">
          <p>On £45,000 in Manchester, your take-home is your salary minus income tax, National Insurance and pension. Subtract Manchester's typical living costs and you have a disposable figure. London's higher rent means you'd need a noticeably higher gross, often several thousand pounds more, to be left with the same amount of spending money each year.</p>
        </GuideSection>

        <GuideSection kicker="Avoid these" title="Common city-comparison mistakes">
          <Mistakes items={[
            ['Comparing gross salaries directly', 'Tax and cost of living change the real value of the same number between cities.'],
            ['Ignoring Scottish income tax', 'Moving across the border changes your take-home even at the same gross salary.'],
            ['Underestimating rent differences', 'Rent is usually the dominant factor and can wipe out a sizeable pay rise.'],
            ['Forgetting one-off moving costs', 'Deposits, removals and overlap rent can dent the first year of a move.'],
          ]} />
        </GuideSection>

        <GuideSection kicker="FAQ" title="Frequently asked questions">
          <FAQ items={[
            { q: 'How is the equivalent salary worked out?', a: 'We calculate your take-home pay after tax in the first city, subtract local living costs to get disposable income, then find the gross salary that gives the same disposable income in the second city.' },
            { q: 'Are the cost-of-living figures exact?', a: 'No, they are indicative averages for a single adult. Your real costs depend on lifestyle, household size and neighbourhood.' },
            { q: 'Does it account for Scottish tax?', a: 'Yes. Scottish income tax bands are applied automatically when a Scottish city is selected.' },
            { q: 'Should I only consider salary when moving?', a: 'No. Career opportunities, commute, family and quality of life matter too, disposable income is just one important input.' },
          ]} />
        </GuideSection>
        <GuideSection title="Related calculators"><RelatedTools items={RELATED} /></GuideSection>
      </Guide>
    </CalcShell>
  );
}
